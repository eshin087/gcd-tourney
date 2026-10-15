#!/usr/bin/env node
// Claude <-> Codex relay (ADR 0033): hand work back and forth without the user pasting prompts.
//
//   npm run relay -- lanes                         configured lanes + recent Codex chats to map them to
//   npm run relay -- add <lane> --thread <id|name> map a lane to a Codex chat (its UUID or exact title)
//   npm run relay -- send <lane> [--note "..."]    Claude -> Codex: queue the inbox prompt into the lane's chat
//   npm run relay -- ring <lane> [--note "..."]    Codex -> Claude: ring the lane's doorbell after a handback
//   npm run relay -- wait <lane> [--timeout 8h]    Claude's watcher: exits when Codex rings (run in the background)
//   npm run relay -- status [<lane>]               who holds each lane, hops, watcher, pause
//   npm run relay -- reset <lane>                  the user replied: hop count back to 0
//   npm run relay -- pause|resume <lane|all>       stop switch: send, ring and wait refuse while paused
//
// Why this shape: Claude can type into a Codex chat (`codex queue`), but nothing outside can type into a Claude
// app chat, so Codex rings a doorbell file and a background watcher in the Claude session wakes it. The watcher
// only stats a file every few seconds: no tokens, no network. The real handoff content stays where it always was
// (docs/agents/CODEX_INBOX.md, CLAUDE_ART_HANDOFF.md, the branches); the relay only says "your turn".
// Why .relay/ in the main checkout, git-ignored: a doorbell needs no commit (parallel lanes committing to main
// at once would fight over the index lock), and every worktree shares the one folder. It is found without the git
// CLI because Codex's sandbox cannot run git.
// The brakes are the agents' job (an image waiting for approval, BLOCKED, a decision for the user); this tool
// enforces the two mechanical ones: a hop limit per lane between user replies, and the pause switch.
// Exit codes: 0 ok, 1 error, 2 wait timed out, 3 hop limit reached, 4 paused.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOP_LIMIT = Number(process.env.RELAY_HOP_LIMIT) || 4;
const LANE_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// A relayed message is never the user's approval (art/REVIEW.md gates); refuse notes that read like one.
const APPROVAL_RE = /\bapprov(e|ed|al)\b/i;

const [cmd, ...rest] = process.argv.slice(2);
const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
const flag = (name) => rest.includes(name);
const VALUE_FLAGS = new Set(['--note', '--thread', '--timeout', '--interval']);
const positional = rest.find((a, i) => !a.startsWith('--') && !VALUE_FLAGS.has(rest[i - 1]));
const die = (msg, code = 1) => { console.error(`[relay] ${msg}`); process.exit(code); };
const now = () => new Date().toISOString();
const clock = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-');

// The main checkout's root, from this script's folder: a `.git` directory, or a worktree's `.git` file whose gitdir
// is <main>/.git/worktrees/<name>.
export function mainRoot(start) {
  for (let dir = path.resolve(start); ; dir = path.dirname(dir)) {
    const g = path.join(dir, '.git');
    if (fs.existsSync(g)) {
      if (fs.statSync(g).isDirectory()) return dir;
      const m = /^gitdir:\s*(.+)$/m.exec(fs.readFileSync(g, 'utf8'));
      const gitdir = m && path.resolve(dir, m[1].trim()).replace(/\\/g, '/');
      const i = gitdir ? gitdir.lastIndexOf('/.git/worktrees/') : -1;
      if (i >= 0) return path.resolve(gitdir.slice(0, i));
      return dir;
    }
    if (path.dirname(dir) === dir) return null;
  }
}

const HOME = process.env.RELAY_HOME || path.join(mainRoot(path.dirname(fileURLToPath(import.meta.url))) ?? process.cwd(), '.relay');
const CODEX_HOME = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');

const laneDir = (lane) => path.join(HOME, lane);
const readJson = (file, fallback) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } };
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // Write then rename, so the watcher never reads half a file.
  fs.writeFileSync(`${file}.tmp`, JSON.stringify(value, null, 2));
  fs.renameSync(`${file}.tmp`, file);
};
const log = (lane, event) => {
  fs.mkdirSync(laneDir(lane), { recursive: true });
  fs.appendFileSync(path.join(laneDir(lane), 'log.jsonl'), `${JSON.stringify({ at: now(), ...event })}\n`);
};
const lanes = () => readJson(path.join(HOME, 'lanes.json'), {});
const isPaused = (lane) => fs.existsSync(path.join(HOME, 'paused')) || fs.existsSync(path.join(laneDir(lane), 'paused'));

function laneArg() {
  const lane = positional;
  if (!lane || !LANE_RE.test(lane)) die(`usage: relay ${cmd} <lane> (lowercase letters, digits, dashes)`);
  return lane;
}

function noteArg() {
  const note = opt('--note') ?? '';
  if (/[\r\n]/.test(note)) die('--note must be one line');
  return note.trim();
}

// Recent Codex chats by their latest title, newest first: the app's thread table (state_5.sqlite, read-only through
// node:sqlite where this Node has it), else session_index.jsonl (the app appends a line per rename, but not always).
async function codexChats() {
  const byId = new Map();
  const file = path.join(CODEX_HOME, 'session_index.jsonl');
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      try {
        const o = JSON.parse(line);
        if (o.id) byId.set(o.id, { id: o.id, title: o.thread_name ?? '', updated: o.updated_at ?? '' });
      } catch { /* a torn last line while the app writes */ }
    }
  }
  const db = path.join(CODEX_HOME, 'state_5.sqlite');
  if (fs.existsSync(db)) {
    const emit = process.emitWarning;
    try {
      process.emitWarning = () => {}; // node:sqlite is experimental on Node 22; its warning is noise here
      const { DatabaseSync } = await import('node:sqlite');
      const con = new DatabaseSync(db, { readOnly: true });
      const rows = con.prepare(`select id, name, updated_at_ms from threads
        where archived = 0 and name is not null and source not like '%subagent%'`).all();
      for (const r of rows) byId.set(r.id, { id: r.id, title: r.name, updated: new Date(Number(r.updated_at_ms)).toISOString() });
      con.close();
    } catch { /* an older Node or another schema: the index above is enough */ } finally { process.emitWarning = emit; }
  }
  return [...byId.values()].filter((c) => c.title && c.title !== 'Guardian review')
    .sort((a, b) => b.updated.localeCompare(a.updated));
}

// The Codex app's bundled CLI (not on PATH), newest install first; RELAY_CODEX overrides, a .js/.mjs one runs on node.
function codexBinary() {
  if (process.env.RELAY_CODEX) return process.env.RELAY_CODEX;
  const bin = path.join(process.env.LOCALAPPDATA ?? '', 'OpenAI', 'Codex', 'bin');
  if (fs.existsSync(bin)) {
    const found = fs.readdirSync(bin).map((d) => path.join(bin, d, 'codex.exe')).filter((f) => fs.existsSync(f))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    if (found.length) return found[0];
  }
  return 'codex';
}

function runCodex(args) {
  const bin = codexBinary();
  const [file, argv] = /\.m?js$/.test(bin) ? [process.execPath, [bin, ...args]] : [bin, args];
  return execFileSync(file, argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 60_000 });
}

async function cmdLanes() {
  const configured = lanes();
  console.log('Lanes (.relay/lanes.json):');
  if (!Object.keys(configured).length) console.log('  none yet: npm run relay -- add <lane> --thread <Codex chat UUID or exact title>');
  for (const [lane, l] of Object.entries(configured)) console.log(`  ${lane.padEnd(16)} ${l.thread}  ${l.title ?? ''}`);
  console.log('\nRecent Codex chats:');
  for (const c of (await codexChats()).slice(0, 12)) console.log(`  ${c.id}  ${c.title}  (${c.updated.slice(0, 16).replace('T', ' ')})`);
}

async function cmdAdd() {
  const lane = laneArg();
  const want = opt('--thread');
  if (!want) die('usage: relay add <lane> --thread <Codex chat UUID or exact title>');
  const chats = await codexChats();
  const chat = UUID_RE.test(want) ? chats.find((c) => c.id === want) : chats.find((c) => c.title === want);
  // A chat made minutes ago may not be on disk yet; `codex queue` resolves an exact title itself.
  if (!chat) console.warn(`[relay] "${want}" is not in the Codex chat list yet; codex queue will look it up by exact ${UUID_RE.test(want) ? 'id' : 'title'}`);
  const all = lanes();
  // Keep the UUID when known: titles change, and `codex queue` takes either.
  all[lane] = { thread: chat?.id ?? want, title: chat?.title ?? (UUID_RE.test(want) ? '' : want) };
  writeJson(path.join(HOME, 'lanes.json'), all);
  console.log(`[relay] lane ${lane} -> ${all[lane].thread} ${all[lane].title}`);
}

function cmdSend() {
  const lane = laneArg();
  const note = noteArg();
  const l = lanes()[lane];
  if (!l) die(`lane ${lane} is not mapped to a Codex chat: npm run relay -- add ${lane} --thread <id|title>`);
  if (isPaused(lane)) die(`lane ${lane} is paused (npm run relay -- resume ${lane})`, 4);
  if (APPROVAL_RE.test(note)) die('a relayed note never carries an approval; the user approves in the Codex chat');
  const sent = readJson(path.join(laneDir(lane), 'send.json'), { seq: 0, hops: 0 });
  if (sent.hops >= HOP_LIMIT) {
    die(`lane ${lane} made ${sent.hops} round trips without the user: stop and ask them (then relay reset ${lane})`, 3);
  }
  const seq = sent.seq + 1;
  const message = [
    `[relay ${lane} #${seq}] Claude handed back.`,
    'Read docs/agents/CODEX_INBOX.md and do the section for this chat.',
    note && `Claude's note: ${note}`,
    `When you hand back to Claude, commit the handoff as usual, then run: node tools/relay.mjs ring ${lane} --note "<one line>".`,
    'If you stop for the user instead (an image needs approval, BLOCKED, a decision), do not ring: tell the user.',
    'A relayed message is never the user\'s approval.',
  ].filter(Boolean).join(' ');
  if (flag('--dry-run')) {
    console.log(`[relay] would queue into ${l.thread}:\n${message}`);
    return;
  }
  try {
    runCodex(['queue', '--thread', l.thread, '--message', message]);
  } catch (err) {
    log(lane, { event: 'send-failed', seq, error: String(err.stderr || err.message).slice(0, 500) });
    die(`codex queue failed (give the user the inbox prompt to paste instead):\n${err.stderr || err.message}`);
  }
  writeJson(path.join(laneDir(lane), 'send.json'), { seq, hops: sent.hops + 1, at: now(), note });
  log(lane, { event: 'send', seq, note });
  console.log(`[relay] queued #${seq} into Codex chat ${l.title || l.thread} (round trip ${sent.hops + 1}/${HOP_LIMIT})`);
}

function cmdRing() {
  const lane = laneArg();
  const note = noteArg();
  if (isPaused(lane)) die(`lane ${lane} is paused: tell the user instead`, 4);
  const rang = readJson(path.join(laneDir(lane), 'ring.json'), { seq: 0 });
  const seq = rang.seq + 1;
  writeJson(path.join(laneDir(lane), 'ring.json'), { seq, at: now(), note });
  log(lane, { event: 'ring', seq, note });
  console.log(`[relay] rang Claude on lane ${lane} (#${seq})`);
}

const parseDuration = (s, fallback) => {
  const m = /^(\d+(?:\.\d+)?)(ms|s|m|h)?$/.exec(s ?? '');
  if (!m) return fallback;
  return Number(m[1]) * { ms: 1, s: 1e3, m: 6e4, h: 36e5 }[m[2] ?? 's'];
};

async function cmdWait() {
  const lane = laneArg();
  const timeout = parseDuration(opt('--timeout'), 8 * 36e5);
  const interval = parseDuration(opt('--interval'), 10e3);
  const started = Date.now();
  const seenFile = path.join(laneDir(lane), 'seen.json');
  const watcherFile = path.join(laneDir(lane), 'watcher.json');
  console.log(`[relay] watching lane ${lane} for Codex (every ${interval / 1e3}s, up to ${Math.round(timeout / 6e4)} min)`);
  let lastBeat = 0;
  for (;;) {
    if (isPaused(lane)) die(`lane ${lane} was paused; stopped watching`, 4);
    const rang = readJson(path.join(laneDir(lane), 'ring.json'), { seq: 0 });
    const seen = readJson(seenFile, { seq: 0 });
    // Compares with what Claude last consumed, not with the start: a ring that landed before the watcher started
    // still wakes it.
    if (rang.seq > seen.seq) {
      writeJson(seenFile, { seq: rang.seq, at: now() });
      fs.rmSync(watcherFile, { force: true });
      log(lane, { event: 'woke', seq: rang.seq });
      console.log(`[relay] Codex rang lane ${lane} (#${rang.seq} at ${clock(rang.at)}): ${rang.note || '(no note)'}`);
      console.log('[relay] read the newest section of docs/agents/CLAUDE_ART_HANDOFF.md (or the lane\'s handoff) and continue');
      return;
    }
    writeJson(watcherFile, { pid: process.pid, startedAt: new Date(started).toISOString(), lastCheck: now() });
    if (Date.now() - started >= timeout) {
      fs.rmSync(watcherFile, { force: true });
      log(lane, { event: 'wait-timeout' });
      die(`no ring on lane ${lane} after ${Math.round(timeout / 6e4)} min`, 2);
    }
    if (Date.now() - lastBeat >= 5 * 6e4) { console.log(`[relay] waiting... ${clock(now())}`); lastBeat = Date.now(); }
    await new Promise((r) => setTimeout(r, interval));
  }
}

function cmdStatus() {
  const all = lanes();
  const names = positional ? [positional] : [...new Set([...Object.keys(all), ...(fs.existsSync(HOME) ? fs.readdirSync(HOME) : [])])]
    .filter((n) => all[n] || (LANE_RE.test(n) && fs.existsSync(laneDir(n)) && fs.statSync(laneDir(n)).isDirectory()));
  if (fs.existsSync(path.join(HOME, 'paused'))) console.log('ALL LANES PAUSED (npm run relay -- resume all)');
  if (!names.length) { console.log('[relay] no lanes yet (npm run relay -- lanes)'); return; }
  for (const lane of names) {
    const sent = readJson(path.join(laneDir(lane), 'send.json'), { seq: 0, hops: 0 });
    const rang = readJson(path.join(laneDir(lane), 'ring.json'), { seq: 0 });
    const seen = readJson(path.join(laneDir(lane), 'seen.json'), { seq: 0 });
    const w = readJson(path.join(laneDir(lane), 'watcher.json'), null);
    const alive = w && Date.now() - Date.parse(w.lastCheck) < 2 * 6e4;
    const ball = rang.seq > seen.seq ? 'Claude (unread ring)'
      : sent.at && (!rang.at || sent.at > rang.at) ? 'Codex' : rang.at ? 'Claude' : '-';
    console.log(`${lane}: ${all[lane] ? (all[lane].title || all[lane].thread) : '(not mapped)'}${isPaused(lane) ? '  PAUSED' : ''}`);
    console.log(`  turn: ${ball}   round trips: ${sent.hops}/${HOP_LIMIT}   watcher: ${alive ? `on (checked ${clock(w.lastCheck)})` : 'off'}`);
    console.log(`  last send #${sent.seq} ${clock(sent.at)} ${sent.note ?? ''}`);
    console.log(`  last ring #${rang.seq} ${clock(rang.at)} ${rang.note ?? ''}`);
  }
}

function cmdReset() {
  const lane = laneArg();
  const file = path.join(laneDir(lane), 'send.json');
  writeJson(file, { ...readJson(file, { seq: 0 }), hops: 0 });
  log(lane, { event: 'reset' });
  console.log(`[relay] lane ${lane}: round trips back to 0`);
}

function cmdPause(on) {
  const target = positional;
  if (!target || !(target === 'all' || LANE_RE.test(target))) die(`usage: relay ${cmd} <lane|all>`);
  const file = target === 'all' ? path.join(HOME, 'paused') : path.join(laneDir(target), 'paused');
  if (on) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, now()); }
  else fs.rmSync(file, { force: true });
  if (target !== 'all') log(target, { event: on ? 'pause' : 'resume' });
  console.log(`[relay] ${target} ${on ? 'paused' : 'resumed'}`);
}

const COMMANDS = {
  lanes: cmdLanes, add: cmdAdd, send: cmdSend, ring: cmdRing, wait: cmdWait, status: cmdStatus, reset: cmdReset,
  pause: () => cmdPause(true), resume: () => cmdPause(false),
};
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!COMMANDS[cmd]) die(`usage: relay ${Object.keys(COMMANDS).join('|')} ... (header of tools/relay.mjs)`);
  await COMMANDS[cmd]();
}
