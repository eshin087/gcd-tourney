#!/usr/bin/env node
// Relay regression test (ADR 0033): every command against a throw-away .relay/ home, a fake Codex chat index and
// a fake `codex` that records its arguments. Never touches the real .relay/, the Codex app or a chat.
//   npm run test:relay

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mainRoot } from './relay.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RELAY = path.join(HERE, 'relay.mjs');
const FIX = path.join(HERE, '.test-fixtures', 'relay');
const HOME = path.join(FIX, 'home');
const CODEX_HOME = path.join(FIX, 'codex-home');
const FAKE = path.join(FIX, 'fake-codex.mjs');
const CALLS = path.join(FIX, 'codex-calls.jsonl');
const SCALE = '01a13380-96ab-7493-b632-49eb14bebc7a';
const GOKU = '01a13b01-566a-70d3-bfd5-3418b577e972';

let passes = 0, failures = 0;
const check = (ok, msg) => {
  if (ok) passes++;
  else { failures++; console.log(`  FAIL ${msg}`); }
};

fs.rmSync(FIX, { recursive: true, force: true });
fs.mkdirSync(CODEX_HOME, { recursive: true });
fs.writeFileSync(FAKE, `import fs from 'node:fs';
fs.appendFileSync(${JSON.stringify(CALLS)}, JSON.stringify(process.argv.slice(2)) + '\\n');
if (process.env.FAKE_CODEX_FAIL) { console.error('thread not found'); process.exit(1); }
`);
// The app appends a line per rename: the latest title wins, Guardian reviews are noise.
fs.writeFileSync(path.join(CODEX_HOME, 'session_index.jsonl'), [
  { id: SCALE, thread_name: 'Scale Consistency', updated_at: '2026-10-13T10:00:00Z' },
  { id: GOKU, thread_name: 'Prepare Goku and Luffy art previews', updated_at: '2026-10-14T15:21:48Z' },
  { id: '01a13b01-ac04-7142-aed4-ef22452c085e', thread_name: 'Guardian review', updated_at: '2026-10-14T15:22:07Z' },
  { id: GOKU, thread_name: '2 - Goku Luffy', updated_at: '2026-10-14T15:39:49Z' },
  { id: SCALE, thread_name: '1 - Scale Consistency', updated_at: '2026-10-14T15:40:01Z' },
].map((o) => JSON.stringify(o)).join('\n') + '\n{"id":"torn');

const relay = (args, extra = {}) => {
  const r = spawnSync(process.execPath, [RELAY, ...args], {
    encoding: 'utf8',
    env: { ...process.env, RELAY_HOME: HOME, CODEX_HOME, RELAY_CODEX: FAKE, RELAY_HOP_LIMIT: '', ...extra },
  });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};
const calls = () => (fs.existsSync(CALLS) ? fs.readFileSync(CALLS, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);
const state = (lane, name) => JSON.parse(fs.readFileSync(path.join(HOME, lane, `${name}.json`), 'utf8'));

console.log('relay test');

// ---- mainRoot: the main checkout from itself, a subfolder, an in-project worktree and an outside managed one
const main = path.join(FIX, 'main');
fs.mkdirSync(path.join(main, '.git', 'worktrees', 'x'), { recursive: true });
fs.mkdirSync(path.join(main, 'tools'), { recursive: true });
fs.mkdirSync(path.join(main, '.worktrees', 'x', 'tools'), { recursive: true });
fs.writeFileSync(path.join(main, '.worktrees', 'x', '.git'), `gitdir: ${path.join(main, '.git', 'worktrees', 'x').replace(/\\/g, '/')}\n`);
const outside = path.join(FIX, 'managed', 'gcdTourney');
fs.mkdirSync(path.join(outside, 'tools'), { recursive: true });
fs.writeFileSync(path.join(outside, '.git'), `gitdir: ${path.join(main, '.git', 'worktrees', 'y')}\n`);
check(mainRoot(path.join(main, 'tools')) === path.resolve(main), 'mainRoot: from the main checkout');
check(mainRoot(path.join(main, '.worktrees', 'x', 'tools')) === path.resolve(main), 'mainRoot: from an in-project worktree');
check(mainRoot(path.join(outside, 'tools')) === path.resolve(main), 'mainRoot: from an app-managed worktree outside');

// ---- lanes and add
let r = relay(['lanes']);
check(r.code === 0 && /none yet/.test(r.out), 'lanes: says none are mapped yet');
check(r.out.includes(`${SCALE}  1 - Scale Consistency`) && r.out.includes('2 - Goku Luffy'), 'lanes: lists chats by their latest title');
check(!r.out.includes('Guardian review') && !r.out.includes('Prepare Goku'), 'lanes: hides Guardian reviews and old titles');
r = relay(['add', 'scale', '--thread', '1 - Scale Consistency']);
check(r.code === 0 && JSON.parse(fs.readFileSync(path.join(HOME, 'lanes.json'), 'utf8')).scale.thread === SCALE, 'add: an exact title resolves to the chat UUID');
r = relay(['add', 'goku', '--thread', 'New chat']);
check(r.code === 0 && /not in the Codex chat list yet/.test(r.out) && JSON.parse(fs.readFileSync(path.join(HOME, 'lanes.json'), 'utf8')).goku.thread === 'New chat', 'add: a title not on disk yet is kept for codex queue to resolve, with a warning');
r = relay(['add', 'goku', '--thread', GOKU]);
check(r.code === 0 && /2 - Goku Luffy/.test(r.out), 'add: a UUID works and shows its title');
check(relay(['add', 'Bad Lane', '--thread', GOKU]).code === 1, 'add: lane names are lowercase-dash');

// ---- send
r = relay(['send', 'scale', '--note', 'stagger07 recalibrated on fec0703']);
let c = calls();
check(r.code === 0 && /round trip 1\/4/.test(r.out), `send: queues and counts the round trip (${r.out.trim()})`);
check(c.length === 1 && c[0][0] === 'queue' && c[0][1] === '--thread' && c[0][2] === SCALE && c[0][3] === '--message', 'send: runs codex queue --thread <uuid> --message');
check(/^\[relay scale #1\] /.test(c[0][4]) && c[0][4].includes('docs/agents/CODEX_INBOX.md'), 'send: the message names the lane, its number and the inbox');
check(c[0][4].includes('node tools/relay.mjs ring scale') && c[0][4].includes("Claude's note: stagger07"), 'send: the message tells Codex how to ring back and carries the note');
check(c[0][4].includes('never the user\'s approval') && !/[\r\n]/.test(c[0][4]), 'send: one line, and says it is no approval');
r = relay(['send', 'scale', '--note', 'approve naruto stagger v07']);
check(r.code === 1 && /never carries an approval/.test(r.out) && calls().length === 1, 'send: refuses a note that reads like an approval');
check(relay(['send', 'scale', '--note', 'two\nlines']).code === 1, 'send: refuses a multi-line note');
check(relay(['send', 'nowhere']).code === 1, 'send: refuses an unmapped lane');
r = relay(['send', 'scale', '--dry-run']);
check(r.code === 0 && /would queue/.test(r.out) && calls().length === 1 && state('scale', 'send').seq === 1, 'send --dry-run: prints, queues nothing, counts nothing');
r = relay(['send', 'scale'], { FAKE_CODEX_FAIL: '1' });
check(r.code === 1 && /paste instead/.test(r.out) && state('scale', 'send').seq === 1, 'send: a failed codex queue says to fall back and counts nothing');

// ---- the hop limit between user replies
relay(['send', 'scale']); relay(['send', 'scale']); relay(['send', 'scale']);
r = relay(['send', 'scale']);
check(r.code === 3 && /4 round trips without the user/.test(r.out) && state('scale', 'send').hops === 4, 'send: the 5th round trip stops for the user (exit 3)');
r = relay(['reset', 'scale']);
check(r.code === 0 && state('scale', 'send').hops === 0 && state('scale', 'send').seq === 4, 'reset: hops back to 0, numbering kept');
check(relay(['send', 'scale']).code === 0 && state('scale', 'send').seq === 5, 'send: works again after reset');
check(relay(['send', 'goku'], { RELAY_HOP_LIMIT: '1' }).code === 0 && relay(['send', 'goku'], { RELAY_HOP_LIMIT: '1' }).code === 3, 'send: RELAY_HOP_LIMIT overrides the limit');

// ---- ring and wait
r = relay(['wait', 'scale', '--timeout', '300ms', '--interval', '50ms']);
check(r.code === 2 && /no ring/.test(r.out), 'wait: times out with exit 2 when Codex has not rung');
check(!fs.existsSync(path.join(HOME, 'scale', 'watcher.json')), 'wait: a timed-out watcher leaves no heartbeat');
r = relay(['ring', 'scale', '--note', 'Naruto calibration returned at 0725f44']);
check(r.code === 0 && state('scale', 'ring').seq === 1, 'ring: writes the doorbell (#1)');
// The ring landed before the watcher started: it must still wake.
r = relay(['wait', 'scale', '--timeout', '5s', '--interval', '50ms']);
check(r.code === 0 && /Codex rang lane scale \(#1/.test(r.out) && r.out.includes('0725f44'), 'wait: an earlier ring wakes it at once with the note');
check(state('scale', 'seen').seq === 1, 'wait: records the ring as read');
r = relay(['wait', 'scale', '--timeout', '200ms', '--interval', '50ms']);
check(r.code === 2, 'wait: a read ring does not wake it twice');
const late = spawnSync(process.execPath, ['-e', `
  const { spawn } = require('node:child_process');
  const env = { ...process.env, RELAY_HOME: ${JSON.stringify(HOME)} };
  const w = spawn(process.execPath, [${JSON.stringify(RELAY)}, 'wait', 'scale', '--timeout', '10s', '--interval', '50ms'], { env });
  let out = ''; w.stdout.on('data', (d) => (out += d));
  setTimeout(() => spawn(process.execPath, [${JSON.stringify(RELAY)}, 'ring', 'scale', '--note', 'late'], { env }), 400);
  w.on('exit', (code) => { console.log(JSON.stringify({ code, out })); });
`], { encoding: 'utf8' });
const lateResult = JSON.parse(late.stdout.trim().split('\n').pop() || '{}');
check(lateResult.code === 0 && /#2 .*late/.test(lateResult.out), 'wait: a ring while it watches wakes it');

// ---- pause
relay(['pause', 'scale']);
check(relay(['send', 'scale']).code === 4, 'pause: send refuses (exit 4)');
check(relay(['ring', 'scale']).code === 4, 'pause: ring refuses (exit 4)');
check(relay(['wait', 'scale', '--timeout', '1s', '--interval', '50ms']).code === 4, 'pause: wait stops (exit 4)');
relay(['resume', 'scale']);
check(relay(['ring', 'scale']).code === 0, 'resume: ring works again');
relay(['pause', 'all']);
check(relay(['send', 'goku']).code === 4 && relay(['ring', 'goku']).code === 4, 'pause all: every lane refuses');
r = relay(['status']);
check(/ALL LANES PAUSED/.test(r.out), 'status: says when every lane is paused');
relay(['resume', 'all']);

// ---- status
r = relay(['status']);
check(r.code === 0 && /^scale: 1 - Scale Consistency/m.test(r.out) && /^goku: 2 - Goku Luffy/m.test(r.out), 'status: one block per lane with its chat title');
check(/turn: Claude \(unread ring\)/.test(r.out), 'status: an unread ring puts the turn on Claude');
check(/round trips: 1\/4/.test(r.out) && /watcher: off/.test(r.out), 'status: round trips and the watcher');
check(!/^paused:/m.test(r.out) && !/^lanes/m.test(r.out), 'status: the pause file and lanes.json are not lanes');

console.log(`relay test: ${passes} passed, ${failures} failed`);
fs.rmSync(FIX, { recursive: true, force: true });
process.exit(failures ? 1 : 0);
