#!/usr/bin/env node
// Claude <-> Codex relay (ADR 0033, approvals in Claude: ADR 0037): hand work back and forth without the user
// pasting prompts, and bring every approval to the user as a question in Claude.
//
//   node tools/relay.mjs lanes                          configured lanes + recent Codex chats to map them to
//   node tools/relay.mjs add <lane> <chat id|title>     map a lane to a Codex chat (`--thread <chat>` works too)
//   node tools/relay.mjs remove <lane>                  forget a lane (refused while its watcher runs)
//   node tools/relay.mjs send <lane> [--note "..."]     Claude -> Codex: queue the inbox prompt into the lane's chat
//        send <lane> --direct --note "<question>"       a one-off message that skips the inbox
//        send <lane> --user-approved "<asset vNN>" --quote "<the user's answer>"   relay the user's approval
//        send <lane> --user-rejected "<asset vNN>" --quote "..." --note "<feedback>"
//        send <lane> --user-decision "<what>" --quote "..."                        relay any other user decision
//   node tools/relay.mjs ring <lane> [--note "..."]     Codex -> Claude: ring the lane's doorbell after a handback
//        ring <lane> --for user --kind approval|decision|blocked --note "<what the user must answer; link>"
//   node tools/relay.mjs wait <lane> [--timeout 24h]    Claude's watcher: exits when Codex rings (run in the background)
//   node tools/relay.mjs status [<lane>]                whose turn each lane is (Claude, Codex or you), round trips, watcher
//   node tools/relay.mjs reset <lane>                   the user replied: round trips back to 0
//   node tools/relay.mjs pause|resume <lane|all>        stop switch: send, ring and wait refuse while paused
// (`npm run relay -- ...` works too, but npm swallows some flags such as --thread: prefer node.)
//
// Why this shape: Claude can type into a Codex chat (`codex queue`), but nothing outside can type into a Claude
// app chat, so Codex rings a doorbell file and a background watcher in the Claude session wakes it. The watcher
// only stats a file every few seconds: no tokens, no network. The real handoff content stays where it always was
// (docs/agents/CODEX_INBOX.md, CLAUDE_ART_HANDOFF.md, the branches); the relay only says "your turn".
// Why .relay/ in the main checkout, git-ignored: a doorbell needs no commit (parallel lanes committing to main
// at once would fight over the index lock), and every worktree shares the one folder. It is found without the git
// CLI because Codex's sandbox cannot run git.
// Why approvals go through Claude (ADR 0037): the user works from a phone, and a question box in Claude (with a
// push notification) is one place to see and answer everything waiting. Codex rings `--for user`, Claude asks, and
// a `--user-approved` send carries the user's own answer word for word; a plain note still may not say "approve".
// Round trips count only the sends that answer a new ring (a follow-up does not), and a relayed user answer
// starts the count again. Exit codes: 0 ok, 1 error, 2 wait timed out, 3 round-trip limit reached, 4 paused.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOP_LIMIT = Number(process.env.RELAY_HOP_LIMIT) || 4;
const LANE_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Approvals travel only as --user-approved with the user's quoted answer; a free note that reads like one is refused.
const APPROVAL_RE = /\bapprov(e|ed|al)\b/i;
const KINDS = ['approval', 'decision', 'blocked'];

const [cmd, ...rest] = process.argv.slice(2);
const VALUE_FLAGS = new Set(['--note', '--thread', '--timeout', '--interval', '--for', '--kind', '--quote',
  '--user-approved', '--user-rejected', '--user-decision']);
const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
const flag = (name) => rest.includes(name);
const positionals = rest.filter((a, i) => !a.startsWith('--') && !VALUE_FLAGS.has(rest[i - 1]));
const positional = positionals[0];
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
const watcherAlive = (lane) => {
  const w = readJson(path.join(laneDir(lane), 'watcher.json'), null);
  return w && Date.now() - Date.parse(w.lastCheck) < 2 * 6e4 ? w : null;
};

function laneArg() {
  const lane = positional;
  if (!lane || !LANE_RE.test(lane)) die(`usage: relay ${cmd} <lane> (lowercase letters, digits, dashes)`);
  return lane;
}

const oneLine = (name, value) => {
  if (/[\r\n]/.test(value ?? '')) die(`${name} must be one line`);
  return (value ?? '').trim();
};
const noteArg = () => oneLine('--note', opt('--note'));

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
  if (!Object.keys(configured).length) console.log('  none yet: node tools/relay.mjs add <lane> <Codex chat UUID or exact title>');
  for (const [lane, l] of Object.entries(configured)) console.log(`  ${lane.padEnd(16)} ${l.thread}  ${l.title ?? ''}`);
  console.log('\nRecent Codex chats:');
  for (const c of (await codexChats()).slice(0, 12)) console.log(`  ${c.id}  ${c.title}  (${c.updated.slice(0, 16).replace('T', ' ')})`);
}

async function cmdAdd() {
  const lane = laneArg();
  const want = opt('--thread') ?? positionals[1];
  if (!want) die('usage: relay add <lane> <Codex chat UUID or exact title>');
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

function cmdRemove() {
  const lane = laneArg();
  const all = lanes();
  if (!all[lane] && !fs.existsSync(laneDir(lane))) die(`no lane ${lane}`);
  if (watcherAlive(lane)) die(`lane ${lane} has a watcher running; stop it first`);
  delete all[lane];
  writeJson(path.join(HOME, 'lanes.json'), all);
  fs.rmSync(laneDir(lane), { recursive: true, force: true });
  console.log(`[relay] removed lane ${lane}`);
}

// What a send says, by kind. Every message carries the ring-back rules, so a Codex chat that has not re-read
// AGENTS.md still knows them.
function sendMessage(lane, seq, kind, { note, subject, quote }) {
  const tail = [
    `When you hand back to Claude, commit the handoff as usual, then run: node tools/relay.mjs ring ${lane} --note "<one line>".`,
    `When the next step is the user's (an image needs approval, a decision, BLOCKED), do not wait in this chat: run node tools/relay.mjs ring ${lane} --for user --kind approval|decision|blocked --note "<what they must answer; versions; review link>". Claude asks the user with buttons and relays the answer.`,
    'An approval counts only when the user types it in this chat or a relay message says "USER APPROVAL via Claude".',
  ];
  const head = {
    inbox: [`[relay ${lane} #${seq}] Claude handed back.`, 'Read docs/agents/CODEX_INBOX.md and do the section for this chat.', note && `Claude's note: ${note}`],
    direct: [`[relay ${lane} #${seq}] Claude asks (no inbox item): ${note}`],
    approved: [`[relay ${lane} #${seq}] USER APPROVAL via Claude: the user approved ${subject}. Their answer in Claude's question box: "${quote}".`,
      'Record it as approved by the user via Claude (REVIEW.md, manifest, TRACKER) and continue.'],
    rejected: [`[relay ${lane} #${seq}] USER REJECTION via Claude: the user rejected ${subject}. Their answer: "${quote}".`,
      note && `Their feedback: ${note}`, 'Record the rejection with that reason and continue as the art rules say.'],
    decision: [`[relay ${lane} #${seq}] USER DECISION via Claude on ${subject}: "${quote}".`, note && `Claude's note: ${note}`,
      'Record it and continue. This is not an image approval.'],
  }[kind];
  return [...head, ...tail].filter(Boolean).join(' ');
}

async function cmdSend() {
  const lane = laneArg();
  const note = noteArg();
  const l = lanes()[lane];
  if (!l) die(`lane ${lane} is not mapped to a Codex chat: node tools/relay.mjs add ${lane} <chat id|title>`);
  if (isPaused(lane)) die(`lane ${lane} is paused (node tools/relay.mjs resume ${lane})`, 4);

  const answers = ['--user-approved', '--user-rejected', '--user-decision'].filter((f) => opt(f) !== undefined);
  if (answers.length > 1) die('send carries one user answer at a time');
  const kind = answers.length ? { '--user-approved': 'approved', '--user-rejected': 'rejected', '--user-decision': 'decision' }[answers[0]]
    : flag('--direct') ? 'direct' : 'inbox';
  const subject = answers.length ? oneLine(answers[0], opt(answers[0])) : '';
  const quote = oneLine('--quote', opt('--quote'));
  const fromUser = answers.length > 0;
  if (fromUser && (!subject || !quote)) die(`${answers[0]} needs what it is about and --quote "<the user's answer, word for word>"`);
  if (kind === 'direct' && !note) die('--direct needs --note "<the message>"');
  if (!fromUser && APPROVAL_RE.test(note)) {
    die('a plain note never carries an approval: relay the user\'s answer with --user-approved "<asset vNN>" --quote "<their answer>"');
  }

  const sent = readJson(path.join(laneDir(lane), 'send.json'), { seq: 0, hops: 0 });
  const rang = readJson(path.join(laneDir(lane), 'ring.json'), { seq: 0 });
  // Only a send that answers a ring Claude has not answered yet is a round trip; a follow-up is not. A relayed
  // user answer is the user speaking, so the count starts again.
  const answersRing = rang.seq > (sent.lastRing ?? 0);
  const hops = fromUser ? 0 : sent.hops + (answersRing ? 1 : 0);
  if (!fromUser && answersRing && sent.hops >= HOP_LIMIT) {
    die(`lane ${lane} made ${sent.hops} round trips without the user: stop and ask them (then relay reset ${lane})`, 3);
  }
  const seq = sent.seq + 1;
  const message = sendMessage(lane, seq, kind, { note, subject, quote });
  if (flag('--dry-run')) {
    console.log(`[relay] would queue into ${l.thread}:\n${message}`);
    return;
  }
  try {
    queue(lane, l, message);
  } catch (err) {
    log(lane, { event: 'send-failed', seq, error: String(err.stderr || err.message).slice(0, 500) });
    die(`codex queue failed (give the user the inbox prompt to paste instead):\n${err.stderr || err.message}`);
  }
  writeJson(path.join(laneDir(lane), 'send.json'), { seq, hops, lastRing: rang.seq, at: now(), kind, note, subject, quote });
  // Claude sends only after reading the handoff, so every ring so far is answered: without this, a ring Claude read by
  // hand (no watcher running) woke the next watcher at once, as if Codex had replied to this send.
  const seenFile = path.join(laneDir(lane), 'seen.json');
  if (rang.seq > readJson(seenFile, { seq: 0 }).seq) writeJson(seenFile, { seq: rang.seq, at: now() });
  log(lane, { event: 'send', seq, kind, note, ...(fromUser && { subject, quote }) });
  console.log(`[relay] queued #${seq} (${kind}) into Codex chat ${l.title || l.thread} (round trips ${hops}/${HOP_LIMIT})`);
}

// An archived chat refuses the queue; unarchive it once and retry, since the user archiving a finished chat should
// not break its lane.
function queue(lane, l, message) {
  try {
    runCodex(['queue', '--thread', l.thread, '--message', message]);
  } catch (err) {
    const text = String(err.stderr || err.message);
    if (!/is archived/i.test(text)) throw err;
    const id = UUID_RE.test(l.thread) ? l.thread : /session ([0-9a-f-]{36}) is archived/i.exec(text)?.[1];
    if (!id) throw err;
    runCodex(['unarchive', id]);
    log(lane, { event: 'unarchived', thread: id });
    console.log(`[relay] unarchived Codex chat ${l.title || id}`);
    runCodex(['queue', '--thread', l.thread, '--message', message]);
  }
}

function cmdRing() {
  const lane = laneArg();
  const note = noteArg();
  const forUser = opt('--for') !== undefined;
  if (forUser && opt('--for') !== 'user') die('--for takes only "user"');
  const kind = opt('--kind') ?? (forUser ? 'decision' : undefined);
  if (kind !== undefined && !forUser) die('--kind goes with --for user');
  if (forUser && !KINDS.includes(kind)) die(`--kind is one of ${KINDS.join(', ')}`);
  if (forUser && !note) die('--for user needs --note "<what the user must answer; versions; review link>"');
  if (isPaused(lane)) die(`lane ${lane} is paused: tell the user instead`, 4);
  const rang = readJson(path.join(laneDir(lane), 'ring.json'), { seq: 0 });
  const seq = rang.seq + 1;
  writeJson(path.join(laneDir(lane), 'ring.json'), { seq, at: now(), note, ...(forUser && { for: 'user', kind }) });
  log(lane, { event: 'ring', seq, note, ...(forUser && { for: 'user', kind }) });
  console.log(`[relay] rang Claude on lane ${lane} (#${seq}${forUser ? `, for the user: ${kind}` : ''})`);
}

const parseDuration = (s, fallback) => {
  const m = /^(\d+(?:\.\d+)?)(ms|s|m|h)?$/.exec(s ?? '');
  if (!m) return fallback;
  return Number(m[1]) * { ms: 1, s: 1e3, m: 6e4, h: 36e5 }[m[2] ?? 's'];
};

async function cmdWait() {
  const lane = laneArg();
  const timeout = parseDuration(opt('--timeout'), 24 * 36e5);
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
      log(lane, { event: 'woke', seq: rang.seq, ...(rang.for && { for: rang.for }) });
      if (rang.for === 'user') {
        console.log(`[relay] Codex needs the USER on lane ${lane} (${rang.kind}, #${rang.seq} at ${clock(rang.at)}): ${rang.note}`);
        console.log('[relay] notify the user, ask with a question box, then relay their answer word for word: '
          + `send ${lane} --user-approved|--user-rejected|--user-decision "<what>" --quote "<their answer>"`);
      } else {
        console.log(`[relay] Codex rang lane ${lane} (#${rang.seq} at ${clock(rang.at)}): ${rang.note || '(no note)'}`);
        console.log('[relay] read the newest section of docs/agents/CLAUDE_ART_HANDOFF.md (or the lane\'s handoff) and continue');
      }
      return;
    }
    writeJson(watcherFile, { pid: process.pid, startedAt: new Date(started).toISOString(), lastCheck: now() });
    if (Date.now() - started >= timeout) {
      fs.rmSync(watcherFile, { force: true });
      log(lane, { event: 'wait-timeout' });
      const sent = readJson(path.join(laneDir(lane), 'send.json'), {});
      const codexTurn = sent.at && (!rang.at || sent.at > rang.at);
      die(`no ring on lane ${lane} after ${Math.round(timeout / 6e4)} min${codexTurn ? '; it is still Codex\'s turn: start the watcher again' : ''}`, 2);
    }
    if (Date.now() - lastBeat >= 5 * 6e4) { console.log(`[relay] waiting... ${clock(now())}`); lastBeat = Date.now(); }
    await new Promise((r) => setTimeout(r, interval));
  }
}

// Whose move a lane is: Claude's when a ring is unread or answered by nobody, the user's after a ring for them
// (until Claude relays an answer), Codex's after a send.
function turnOf(sent, rang, seen) {
  if (rang.seq > seen.seq) return rang.for === 'user' ? `you, via Claude (unread: ${rang.kind})` : 'Claude (unread ring)';
  if (sent.at && (!rang.at || sent.at > rang.at)) return 'Codex';
  if (rang.for === 'user') return `you (${rang.kind}: ${rang.note})`;
  return rang.at ? 'Claude' : '-';
}

function cmdStatus() {
  const all = lanes();
  const names = positional ? [positional] : [...new Set([...Object.keys(all), ...(fs.existsSync(HOME) ? fs.readdirSync(HOME) : [])])]
    .filter((n) => all[n] || (LANE_RE.test(n) && fs.existsSync(laneDir(n)) && fs.statSync(laneDir(n)).isDirectory()));
  if (fs.existsSync(path.join(HOME, 'paused'))) console.log('ALL LANES PAUSED (node tools/relay.mjs resume all)');
  if (!names.length) { console.log('[relay] no lanes yet (node tools/relay.mjs lanes)'); return; }
  for (const lane of names) {
    const sent = readJson(path.join(laneDir(lane), 'send.json'), { seq: 0, hops: 0 });
    const rang = readJson(path.join(laneDir(lane), 'ring.json'), { seq: 0 });
    const seen = readJson(path.join(laneDir(lane), 'seen.json'), { seq: 0 });
    const w = watcherAlive(lane);
    console.log(`${lane}: ${all[lane] ? (all[lane].title || all[lane].thread) : '(not mapped)'}${isPaused(lane) ? '  PAUSED' : ''}`);
    console.log(`  turn: ${turnOf(sent, rang, seen)}   round trips: ${sent.hops}/${HOP_LIMIT}   watcher: ${w ? `on (checked ${clock(w.lastCheck)})` : 'off'}`);
    console.log(`  last send #${sent.seq} ${clock(sent.at)} ${sent.kind && sent.kind !== 'inbox' ? `[${sent.kind}] ` : ''}${sent.subject ?? sent.note ?? ''}`);
    console.log(`  last ring #${rang.seq} ${clock(rang.at)} ${rang.for === 'user' ? `[for you: ${rang.kind}] ` : ''}${rang.note ?? ''}`);
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
  lanes: cmdLanes, add: cmdAdd, remove: cmdRemove, send: cmdSend, ring: cmdRing, wait: cmdWait, status: cmdStatus,
  reset: cmdReset, pause: () => cmdPause(true), resume: () => cmdPause(false),
};
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!COMMANDS[cmd]) die(`usage: relay ${Object.keys(COMMANDS).join('|')} ... (header of tools/relay.mjs)`);
  await COMMANDS[cmd]();
}
