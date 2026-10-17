#!/usr/bin/env node
// Relay regression test (ADR 0033, approvals in Claude: ADR 0037): every command against a throw-away .relay/ home, a fake Codex chat index and
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
const STALE_MS = 24 * 36e5;

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
// An archived chat refuses the queue until it is unarchived (the flag file stands for the archived state).
const flagFile = process.env.FAKE_CODEX_ARCHIVED;
if (flagFile && process.argv[2] === 'unarchive') fs.rmSync(flagFile, { force: true });
else if (flagFile && fs.existsSync(flagFile)) { console.error('Error: failed to queue session message: thread/queue/add failed: session ' + fs.readFileSync(flagFile, 'utf8') + ' is archived.'); process.exit(1); }
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

check(relay(['add', 'gojo', 'relay-gojo-chat']).code === 0 && JSON.parse(fs.readFileSync(path.join(HOME, 'lanes.json'), 'utf8')).gojo.thread === 'relay-gojo-chat', 'add: the chat can follow the lane without --thread');

// ---- send
r = relay(['send', 'scale', '--note', 'stagger07 recalibrated on fec0703']);
let c = calls();
check(r.code === 0 && /round trips 0\/4/.test(r.out), `send: the first send answers no ring, so it is no round trip (${r.out.trim()})`);
check(c.length === 1 && c[0][0] === 'queue' && c[0][1] === '--thread' && c[0][2] === SCALE && c[0][3] === '--message', 'send: runs codex queue --thread <uuid> --message');
check(/^\[relay scale #1\] /.test(c[0][4]) && c[0][4].includes('docs/agents/CODEX_INBOX.md'), 'send: the message names the lane, its number and the inbox');
check(c[0][4].includes('node tools/relay.mjs ring scale --note') && c[0][4].includes("Claude's note: stagger07"), 'send: the message tells Codex how to ring back and carries the note');
check(c[0][4].includes('ring scale --for user --kind approval|decision|blocked') && c[0][4].includes('USER APPROVAL via Claude') && !/[\r\n]/.test(c[0][4]), 'send: one line that says how to ring for the user and what counts as an approval');
r = relay(['send', 'scale', '--note', 'approve naruto stagger v07']);
check(r.code === 1 && /never carries an approval/.test(r.out) && calls().length === 1, 'send: refuses a plain note that reads like an approval');
check(relay(['send', 'scale', '--note', 'two\nlines']).code === 1, 'send: refuses a multi-line note');
check(relay(['send', 'nowhere']).code === 1, 'send: refuses an unmapped lane');
r = relay(['send', 'scale', '--dry-run']);
check(r.code === 0 && /would queue/.test(r.out) && calls().length === 1 && state('scale', 'send').seq === 1, 'send --dry-run: prints, queues nothing, counts nothing');
r = relay(['send', 'scale'], { FAKE_CODEX_FAIL: '1' });
check(r.code === 1 && /paste instead/.test(r.out) && state('scale', 'send').seq === 1, 'send: a failed codex queue says to fall back and counts nothing');

// ---- direct messages
check(relay(['send', 'scale', '--direct']).code === 1, 'send --direct: needs a note');
r = relay(['send', 'scale', '--direct', '--note', 'Are the Luffy refs packed?']);
c = calls();
check(r.code === 0 && /^\[relay scale #2\] Claude asks \(no inbox item\): Are the Luffy refs packed\?/.test(c.at(-1)[4]) && !c.at(-1)[4].includes('CODEX_INBOX'), 'send --direct: the message is the question, without the inbox');
check(c.at(-1)[4].includes('ring scale --note'), 'send --direct: still says how to ring back');

// ---- round trips: only sends that answer a new ring count
const ringAndSend = (lane, extra) => { relay(['ring', lane, '--note', 'ready']); return relay(['send', lane], extra); };
r = relay(['send', 'scale', '--note', 'update: one more thing']);
check(r.code === 0 && state('scale', 'send').hops === 0, 'round trips: a follow-up with no new ring does not count');
for (let i = 1; i <= 4; i++) {
  r = ringAndSend('scale');
  check(r.code === 0 && state('scale', 'send').hops === i, `round trips: answering ring ${i} counts (${i}/4)`);
}
check(relay(['send', 'scale', '--note', 'follow-up at the limit']).code === 0, 'round trips: a follow-up still goes at the limit (it answers no ring)');
r = ringAndSend('scale');
check(r.code === 3 && /4 round trips without the user/.test(r.out) && state('scale', 'send').hops === 4, 'round trips: answering a 5th ring stops for the user (exit 3)');
r = relay(['reset', 'scale']);
check(r.code === 0 && state('scale', 'send').hops === 0, 'reset: round trips back to 0, numbering kept');
check(relay(['send', 'scale']).code === 0 && state('scale', 'send').hops === 1, 'send: answering after reset counts from 1');
relay(['ring', 'goku', '--note', 'ready']);
check(relay(['send', 'goku'], { RELAY_HOP_LIMIT: '1' }).code === 0 && ringAndSend('goku', { RELAY_HOP_LIMIT: '1' }).code === 3, 'send: RELAY_HOP_LIMIT overrides the limit');

// ---- approvals and decisions travel through Claude
r = relay(['ring', 'goku', '--for', 'user', '--kind', 'approval', '--note', 'naruto stagger v08 ready; review art/review/r5.html']);
check(r.code === 0 && state('goku', 'ring').for === 'user' && state('goku', 'ring').kind === 'approval', 'ring --for user: records what the user must answer');
check(relay(['ring', 'goku', '--for', 'user', '--kind', 'vibes', '--note', 'x']).code === 1, 'ring --for user: the kind is approval, decision or blocked');
check(relay(['ring', 'goku', '--for', 'user']).code === 1, 'ring --for user: needs a note saying what to answer');
check(relay(['ring', 'goku', '--kind', 'approval', '--note', 'x']).code === 1, 'ring: --kind goes with --for user');
check(/turn: you, via Claude \(unread: approval\)/.test(relay(['status', 'goku']).out), 'status: an unread ring for the user puts the turn on the user');
r = relay(['wait', 'goku', '--timeout', '5s', '--interval', '50ms']);
check(r.code === 0 && /needs the USER on lane goku \(approval/.test(r.out) && r.out.includes('naruto stagger v08'), 'wait: with no desk running, a ring for the user wakes the lane\'s chat');
check(/approvals desk is not running/.test(r.out) && /do not ask the user here/.test(r.out) && r.out.includes("'0 - Approvals' and type /approvals"), 'wait: ...which points the user at the desk instead of asking');
check(/turn: you \(approval: naruto stagger v08/.test(relay(['status', 'goku']).out), 'status: until Claude relays an answer, the turn is the user\'s');
check(relay(['send', 'goku', '--user-approved', 'naruto stagger v08']).code === 1, 'send --user-approved: needs the user\'s quoted answer');
check(relay(['send', 'goku', '--user-approved', 'a', '--user-rejected', 'b', '--quote', 'x']).code === 1, 'send: one user answer at a time');
r = relay(['send', 'goku', '--user-approved', 'naruto stagger v08', '--quote', 'Approve v08']);
c = calls();
check(r.code === 0 && /\(approved\)/.test(r.out), 'send --user-approved: goes through');
check(/^\[relay goku #\d+\] USER APPROVAL via Claude: the user approved naruto stagger v08\. Their answer in Claude's question box: "Approve v08"\./.test(c.at(-1)[4]), 'send --user-approved: Codex reads who approved what, in the user\'s words');
check(state('goku', 'send').hops === 0, 'send --user-approved: the user spoke, so round trips start again');
check(/turn: Codex/.test(relay(['status', 'goku']).out), 'status: after the relayed answer the turn is Codex\'s');
r = relay(['send', 'goku', '--user-rejected', 'naruto taunt v09', '--quote', 'Reject', '--note', 'the torso is still short']);
check(r.code === 0 && /USER REJECTION via Claude: the user rejected naruto taunt v09\. Their answer: "Reject"\. Their feedback: the torso is still short/.test(calls().at(-1)[4]), 'send --user-rejected: carries the answer and the feedback');
r = relay(['send', 'goku', '--user-decision', 'Luffy special', '--quote', 'Keep the stretch punch']);
check(r.code === 0 && /USER DECISION via Claude on Luffy special: "Keep the stretch punch"\. .*not an image approval/.test(calls().at(-1)[4]), 'send --user-decision: relays other decisions, marked as no approval');
check(relay(['send', 'goku', '--user-decision', 'x', '--quote', 'two\nlines']).code === 1, 'send: the quote must be one line');

// ---- the approvals desk (ADR 0039): one queue of asks, one Claude chat that asks the user
const askPath = (id) => path.join(HOME, 'asks', `${id}.json`);
const readAsk = (id) => JSON.parse(fs.readFileSync(askPath(id), 'utf8'));
const seenOf = (lane) => JSON.parse(fs.readFileSync(path.join(HOME, lane, 'seen.json'), 'utf8')).seq;
let callsBefore;
const deskBeat = () => {
  fs.mkdirSync(path.join(HOME, 'desk'), { recursive: true });
  fs.writeFileSync(path.join(HOME, 'desk', 'watcher.json'), JSON.stringify({ pid: 1, lastCheck: new Date().toISOString() }));
};
check(relay(['add', 'asks', GOKU]).code === 1 && relay(['ring', 'desk']).code === 1, 'desk: asks and desk are not lane names');
check(/0 open/.test(relay(['asks']).out), 'asks: nothing open after the relayed answers');
relay(['ring', 'goku', '--for', 'user', '--kind', 'decision', '--note', 'Luffy gear: keep or redo? review/luffy.html']);
const gokuAsk = `lane-goku-${state('goku', 'ring').seq}`;
r = relay(['asks']);
check(r.code === 0 && r.out.includes(gokuAsk) && /\[decision\]/.test(r.out) && r.out.includes('Codex lane goku') && r.out.includes('Luffy gear'), 'asks: a Codex ring for the user is an open ask by itself');
check(/^Approvals desk "0 - Approvals": watcher off; 1 open ask/m.test(relay(['status']).out), 'status: names the desk, its watcher and the open asks');
// With the desk on, a lane watcher leaves the user's ring to it and keeps watching.
deskBeat();
r = relay(['wait', 'goku', '--timeout', '300ms', '--interval', '50ms']);
check(r.code === 2 && /routed to the approvals desk, still watching/.test(r.out) && seenOf('goku') === state('goku', 'ring').seq, 'wait: with the desk on, a ring for the user is routed and the lane keeps watching');
fs.rmSync(path.join(HOME, 'desk', 'watcher.json'));
r = relay(['wait', 'all', '--timeout', '5s', '--interval', '50ms']);
check(r.code === 0 && /1 new for the USER/.test(r.out) && r.out.includes(gokuAsk) && /relay\.mjs answer <id>/.test(r.out), 'wait all: wakes the desk on a new ask and says how to answer');
check(relay(['wait', 'all', '--timeout', '200ms', '--interval', '50ms']).code === 2, 'wait all: an ask already shown does not wake it twice');
check(relay(['answer', gokuAsk, '--user-decision', 'Luffy gear']).code === 1, 'answer: needs the user\'s quoted answer');
callsBefore = calls().length;
r = relay(['answer', gokuAsk, '--user-decision', 'Luffy gear', '--quote', 'Keep it']);
check(r.code === 0 && calls().length === callsBefore + 1 && /USER DECISION via Claude on Luffy gear: "Keep it"/.test(calls().at(-1)[4]), 'answer: a Codex ask is relayed to its lane through send');
check(readAsk(gokuAsk).status === 'answered' && readAsk(gokuAsk).answer.quote === 'Keep it' && /0 open/.test(relay(['asks']).out), 'answer: the ask is closed with the quote kept');
check(relay(['answer', gokuAsk, '--user-decision', 'x', '--quote', 'y']).code === 1, 'answer: an answered ask cannot be answered twice');
relay(['ring', 'goku', '--for', 'user', '--kind', 'approval', '--note', 'naruto win v03']);
relay(['asks']);
relay(['send', 'goku', '--user-approved', 'naruto win v03', '--quote', 'Approve v03']);
relay(['asks']);
check(readAsk(`lane-goku-${state('goku', 'ring').seq}`).status === 'closed', 'asks: an answer relayed by any chat closes the lane\'s ask');
// Claude chats ask through the queue.
check(relay(['ask', '--note', 'x']).code === 1 && relay(['ask', '--from', 'Effects', '--note', 'x', '--kind', 'vibes']).code === 1, 'ask: needs --from and a known kind');
check(relay(['ask', '--from', '0 - Approvals', '--note', 'x']).code === 1, 'ask: the desk does not ask itself');
r = relay(['ask', '--from', '7 - Effects and Ground', '--session', 'local_abc', '--kind', 'approval', '--note', 'Ship the clash FX now?', '--link', 'https://example.test/r']);
const claudeAsk = /\((claude-[a-z0-9-]+)\)/.exec(r.out)?.[1];
check(r.code === 0 && claudeAsk && /Do not ask the user in this chat/.test(r.out) && /desk is not running/.test(r.out), 'ask: queues for the desk, says to stop, and to point the user at a stopped desk');
deskBeat();
check(!/desk is not running/.test(relay(['ask', '--from', 'Q&A', '--note', 'second']).out), 'ask: no desk warning while the desk runs');
fs.rmSync(path.join(HOME, 'desk', 'watcher.json'));
r = relay(['wait', 'all', '--timeout', '5s', '--interval', '50ms']);
check(r.code === 0 && /2 new for the USER/.test(r.out) && r.out.includes('Claude chat "7 - Effects and Ground" (local_abc)') && r.out.includes('https://example.test/r'), 'wait all: wakes on Claude chats\' asks with their source and link');
callsBefore = calls().length;
r = relay(['answer', claudeAsk, '--user-approved', 'clash FX', '--quote', 'Ship it']);
check(r.code === 0 && calls().length === callsBefore && /SendMessage to local_abc/.test(r.out) && /USER APPROVAL via the approvals desk on clash FX: "Ship it"/.test(r.out), 'answer: a Claude ask sends nothing to Codex and says what to message back');
const second = /- (claude-\S+)/.exec(relay(['asks']).out)?.[1] ?? '';
check(relay(['answer', second, '--dismiss', '']).code === 1 && relay(['answer', second, '--dismiss', 'asked twice']).code === 0 && /0 open/.test(relay(['asks']).out), 'answer --dismiss: closes a stale ask with a reason');
r = relay(['brief']);
check(r.code === 0 && r.out.includes('only the Claude chat "0 - Approvals" asks') && /0 open ask/.test(r.out) && r.out.includes('run /approvals'), 'brief: states the rule and the queue');
check(relay(['brief'], { RELAY_HOME: path.join(FIX, 'nowhere') }).code === 0, 'brief: never fails, even with no relay folder');

// ---- Codex chats with no lane (the thread table knows each chat's folder): found, and answerable through `ask --app codex`
{
  const { DatabaseSync } = await import('node:sqlite');
  const projectRoot = mainRoot(HERE);
  const db = new DatabaseSync(path.join(CODEX_HOME, 'state_5.sqlite'));
  db.exec('create table threads (id text, name text, cwd text, source text, archived integer, updated_at_ms integer)');
  const ins = db.prepare('insert into threads values (?,?,?,?,?,?)');
  const NEWCHAT = '01a15000-0000-7000-8000-000000000001';
  ins.run(NEWCHAT, '8 - Brand New Chat', `\\\\?\\${projectRoot}`, 'cli', 0, Date.now());
  ins.run('01a15000-0000-7000-8000-000000000002', 'Other project chat', '\\\\?\\E:\\Somewhere\\else', 'cli', 0, Date.now());
  ins.run('01a15000-0000-7000-8000-000000000003', 'Old project chat', `\\\\?\\${projectRoot}`, 'cli', 0, Date.now() - 10 * 24 * 36e5);
  ins.run('01a15000-0000-7000-8000-000000000004', 'Guardian review', `\\\\?\\${projectRoot}`, 'cli', 0, Date.now());
  db.close();
  r = relay(['status']);
  check(/Codex chats with NO lane.*"8 - Brand New Chat"/.test(r.out), 'status: a recent project Codex chat with no lane is listed');
  check(!/Other project chat|Old project chat|Guardian review/.test(r.out.split('\n').filter((l) => /NO lane/.test(l)).join('')), 'status: other projects\' chats, old chats and Guardian reviews are not');
  check(relay(['ask', '--app', 'robot', '--from', 'x', '--note', 'y']).code === 1, 'ask: --app is claude or codex');
  r = relay(['ask', '--app', 'codex', '--from', '8 - Brand New Chat', '--kind', 'decision', '--note', 'Keep the stretch punch? review/luffy.html']);
  const looseAsk = /\((claude-[a-z0-9-]+)\)/.exec(r.out)?.[1];
  check(r.code === 0 && looseAsk && /Codex chat "8 - Brand New Chat" \(no lane yet\)/.test(relay(['asks']).out), 'ask --app codex: a lane-less Codex chat queues a question the desk can see');
  callsBefore = calls().length;
  r = relay(['answer', looseAsk, '--user-decision', 'Luffy punch', '--quote', 'Keep it']);
  c = calls();
  check(r.code === 0 && /lane 8-brand-new-chat -> /.test(r.out) && c.length === callsBefore + 1 && c.at(-1)[2] === NEWCHAT, 'answer: a lane-less Codex chat is mapped by its title and the answer is queued into it');
  check(/USER DECISION via Claude on Luffy punch: "Keep it"/.test(c.at(-1)[4]) && !/NO lane.*Brand New/.test(relay(['status']).out), 'answer: it reads as a normal relayed decision and the chat now has a lane');
}

// ---- the desk stops itself once every Claude chat is done, no lane waits on Codex and no ask is open
{
  const QHOME = path.join(FIX, 'quiet-home');
  const q = (args) => relay(args, { RELAY_HOME: QHOME });
  const deskWait = (extra = []) => q(['wait', 'all', '--interval', '50ms', '--idle', '300ms', '--timeout', '1500ms', ...extra]);
  const laneFile = (lane, name, value) => {
    fs.mkdirSync(path.join(QHOME, lane), { recursive: true });
    fs.writeFileSync(path.join(QHOME, lane, `${name}.json`), JSON.stringify(value));
  };
  r = deskWait();
  check(r.code === 5 && /stopped itself/.test(r.out) && !fs.existsSync(path.join(QHOME, 'desk', 'watcher.json')), 'wait all: with nothing going on it stops itself after the quiet spell (exit 5)');
  check(deskWait(['--no-auto-stop']).code === 2, 'wait all --no-auto-stop: runs until the timeout instead');
  check(q(['chat', 'maybe', '--from', 'x']).code === 1 && q(['chat', 'done']).code === 1, 'chat: the state is active or done, and --from is needed');
  check(q(['chat', 'done', '--from', '0 - Approvals']).code === 1, 'chat: the desk does not report on itself');
  r = q(['chat', 'active', '--from', '3 - Gojo Running', '--session', 'local_g1']);
  check(r.code === 0 && /active/.test(r.out), 'chat active: recorded');
  r = deskWait();
  check(r.code === 2 && /still busy: Claude chat "3 - Gojo Running" is still on its task/.test(r.out), 'wait all: an active Claude chat keeps it watching');
  check(/auto-stop: keeps watching because Claude chat "3 - Gojo Running"/.test(q(['status']).out) && /"3 - Gojo Running" active/.test(q(['status']).out), 'status: says why the desk keeps watching and lists chat states');
  q(['chat', 'done', '--from', '3 - Gojo Running', '--session', 'local_g1']);
  check(deskWait().code === 5, 'wait all: once that chat reports done it stops itself');
  const old = new Date(Date.now() - 2 * STALE_MS).toISOString();
  fs.writeFileSync(path.join(QHOME, 'chats', 'local_g1.json'), JSON.stringify({ from: 'Ghost', state: 'active', at: old }));
  check(deskWait().code === 5 && /"Ghost" active \(stale\)/.test(q(['status']).out), 'wait all: an active report older than a day is stale and does not hold it');
  laneFile('gojo', 'send', { seq: 1, at: new Date().toISOString() });
  r = deskWait();
  check(r.code === 2 && /lane gojo: Codex is working/.test(r.out), 'wait all: a lane where it is Codex\'s turn keeps it watching');
  laneFile('gojo', 'ring', { seq: 1, at: new Date(Date.now() + 1000).toISOString(), note: 'done' });
  check(/lane gojo: Codex rang, no Claude chat has read it/.test(deskWait().out), 'wait all: an unread ring for Claude keeps it watching');
  laneFile('gojo', 'seen', { seq: 1 });
  laneFile('gojo', 'watcher', { pid: 1, lastCheck: new Date().toISOString() });
  check(/lane gojo: a Claude chat is waiting on Codex/.test(deskWait().out), 'wait all: a running lane watcher keeps it watching');
  fs.rmSync(path.join(QHOME, 'gojo', 'watcher.json'));
  q(['pause', 'gojo']);
  laneFile('gojo', 'send', { seq: 2, at: new Date(Date.now() + 2000).toISOString() });
  check(deskWait().code === 5, 'wait all: a paused lane does not hold it');
  q(['resume', 'gojo']);
  q(['ask', '--from', 'Effects', '--note', 'ship it?']);
  r = deskWait();
  check(r.code === 0 && /1 new for the USER/.test(r.out), 'wait all: an open ask still wakes it first');
  check(/open ask/.test(deskWait().out), 'wait all: and an open ask, even one already shown, keeps it from stopping');
  check(/chat active/.test(q(['brief']).out), 'brief: tells new chats to report their task state');
}

// ---- the user's switch: while the desk is off nobody queues, and each chat asks the user itself
{
  const OHOME = path.join(FIX, 'off-home');
  const o = (args, extra = {}) => relay(args, { RELAY_HOME: OHOME, ...extra });
  check(o(['desk', 'maybe']).code === 1, 'desk: takes on, off or nothing');
  check(/approvals desk is ON/.test(o(['desk']).out), 'desk: on by default');
  o(['add', 'goku', GOKU]);
  o(['ring', 'goku', '--for', 'user', '--kind', 'approval', '--note', 'luffy win v04']);
  r = o(['desk', 'off', '--note', 'working in two chats today']);
  check(r.code === 0 && /desk is OFF \(since .*: working in two chats today\)/.test(r.out), 'desk off: recorded with the reason');
  check(/1 ask\(s\) queued earlier still wait/.test(r.out) && r.out.includes('lane-goku-1'), 'desk off: lists the asks still queued so none is lost');
  r = o(['ask', '--from', 'Effects', '--note', 'ship it?']);
  check(r.code === 6 && /nothing was queued: ask the user yourself in this chat/.test(r.out) && !fs.readdirSync(path.join(OHOME, 'asks')).some((f) => f.startsWith('claude-')), 'ask: refused while the desk is off (exit 6), nothing queued');
  r = o(['wait', 'goku', '--timeout', '5s', '--interval', '50ms']);
  check(r.code === 0 && /needs the USER on lane goku/.test(r.out) && /switched off .*ask the user here/.test(r.out) && !/do not ask the user here/.test(r.out), 'wait: with the desk off, the lane\'s own chat asks the user');
  check(o(['wait', 'all', '--timeout', '1s', '--interval', '50ms']).code === 6, 'wait all: refuses to start while the desk is off (exit 6)');
  r = o(['brief']);
  check(r.code === 0 && /SWITCHED OFF by the user/.test(r.out) && /every chat asks the user itself/.test(r.out) && !/run \/approvals/.test(r.out), 'brief: new chats learn the desk is off');
  check(/APPROVALS DESK SWITCHED OFF/.test(o(['status']).out) && /SWITCHED OFF/.test(o(['asks']).out), 'status and asks: say the desk is off');
  r = o(['desk', 'on']);
  check(r.code === 0 && /desk is ON/.test(r.out) && /only the Claude chat "0 - Approvals" asks/.test(o(['brief']).out), 'desk on: back to the desk rule');
  check(o(['ask', '--from', 'Effects', '--note', 'ship it?']).code === 0, 'ask: queues again once the desk is on');
  // A running desk watcher stops when the user switches it off (the asks are shown first, so they do not wake it).
  check(o(['wait', 'all', '--timeout', '5s', '--interval', '50ms']).code === 0, 'wait all: works again once the desk is on');
  const run = spawnSync(process.execPath, ['-e', `
    const { spawn } = require('node:child_process');
    const env = { ...process.env, RELAY_HOME: ${JSON.stringify(OHOME)} };
    const w = spawn(process.execPath, [${JSON.stringify(RELAY)}, 'wait', 'all', '--timeout', '10s', '--interval', '50ms'], { env });
    let out = ''; w.stdout.on('data', (d) => (out += d)); w.stderr.on('data', (d) => (out += d));
    setTimeout(() => spawn(process.execPath, [${JSON.stringify(RELAY)}, 'desk', 'off'], { env }), 400);
    w.on('exit', (code) => { console.log(JSON.stringify({ code, out })); });
  `], { encoding: 'utf8' });
  const ran = JSON.parse(run.stdout.trim().split('\n').pop() || '{}');
  check(ran.code === 6 && /was switched off; it stopped watching/.test(ran.out), 'wait all: a running desk stops when it is switched off (exit 6)');
}

// ---- an archived chat is unarchived and the send retried once
const archived = path.join(FIX, 'archived.flag');
fs.writeFileSync(archived, SCALE);
let before = calls().length;
r = relay(['send', 'scale'], { FAKE_CODEX_ARCHIVED: archived });
c = calls().slice(before);
check(r.code === 0 && /unarchived Codex chat/.test(r.out), 'send: an archived chat is unarchived and the send goes through');
check(c.map((a) => a[0]).join() === 'queue,unarchive,queue' && c[1][1] === SCALE, 'send: queue, unarchive <uuid>, queue again');
relay(['add', 'titled', 'Some title']);
fs.writeFileSync(archived, GOKU);
before = calls().length;
r = relay(['send', 'titled'], { FAKE_CODEX_ARCHIVED: archived });
c = calls().slice(before);
check(r.code === 0 && c[1]?.[0] === 'unarchive' && c[1][1] === GOKU, 'send: a lane mapped by title unarchives the id the error names');

// ---- ring and wait
r = relay(['wait', 'scale', '--timeout', '300ms', '--interval', '50ms']);
check(r.code === 2 && /no ring/.test(r.out) && /still Codex's turn: start the watcher again/.test(r.out), 'wait: times out with exit 2 and says to restart while it is Codex\'s turn');
check(!fs.existsSync(path.join(HOME, 'scale', 'watcher.json')), 'wait: a timed-out watcher leaves no heartbeat');
r = relay(['ring', 'scale', '--note', 'Naruto calibration returned at 0725f44']);
const scaleRing = state('scale', 'ring').seq;
check(r.code === 0, 'ring: writes the doorbell');
// The ring landed before the watcher started: it must still wake.
r = relay(['wait', 'scale', '--timeout', '5s', '--interval', '50ms']);
check(r.code === 0 && r.out.includes(`Codex rang lane scale (#${scaleRing}`) && r.out.includes('0725f44'), 'wait: an earlier ring wakes it at once with the note');
check(state('scale', 'seen').seq === scaleRing, 'wait: records the ring as read');
r = relay(['wait', 'scale', '--timeout', '200ms', '--interval', '50ms']);
check(r.code === 2 && !/still Codex's turn/.test(r.out), 'wait: a read ring does not wake it twice (and no restart hint on Claude\'s turn)');
const late = spawnSync(process.execPath, ['-e', `
  const { spawn } = require('node:child_process');
  const env = { ...process.env, RELAY_HOME: ${JSON.stringify(HOME)} };
  const w = spawn(process.execPath, [${JSON.stringify(RELAY)}, 'wait', 'scale', '--timeout', '10s', '--interval', '50ms'], { env });
  let out = ''; w.stdout.on('data', (d) => (out += d));
  setTimeout(() => spawn(process.execPath, [${JSON.stringify(RELAY)}, 'ring', 'scale', '--note', 'late'], { env }), 400);
  w.on('exit', (code) => { console.log(JSON.stringify({ code, out })); });
`], { encoding: 'utf8' });
const lateResult = JSON.parse(late.stdout.trim().split('\n').pop() || '{}');
check(lateResult.code === 0 && new RegExp(`#${scaleRing + 1} .*late`).test(lateResult.out), 'wait: a ring while it watches wakes it');
// Claude read a ring by hand (no watcher), then sent: the next watcher waits for Codex's reply to that send.
relay(['ring', 'goku', '--note', 'read by hand']);
const seenSeq = (lane) => (fs.existsSync(path.join(HOME, lane, 'seen.json')) ? state(lane, 'seen').seq : 0);
check(relay(['send', 'goku']).code === 0 && seenSeq('goku') === state('goku', 'ring').seq, 'send: answers every ring before it');
r = relay(['wait', 'goku', '--timeout', '200ms', '--interval', '50ms']);
check(r.code === 2, 'wait: a ring answered by a send does not wake the next watcher');

// ---- remove
relay(['add', 'scratch', GOKU]);
check(relay(['remove', 'scratch']).code === 0 && !JSON.parse(fs.readFileSync(path.join(HOME, 'lanes.json'), 'utf8')).scratch, 'remove: forgets the lane');
check(relay(['remove', 'scratch']).code === 1, 'remove: an unknown lane is an error');
relay(['add', 'busy', GOKU]);
fs.mkdirSync(path.join(HOME, 'busy'), { recursive: true });
fs.writeFileSync(path.join(HOME, 'busy', 'watcher.json'), JSON.stringify({ pid: 1, lastCheck: new Date().toISOString() }));
check(relay(['remove', 'busy']).code === 1 && fs.existsSync(path.join(HOME, 'busy')), 'remove: refused while a watcher runs');
fs.rmSync(path.join(HOME, 'busy', 'watcher.json'));
check(relay(['remove', 'busy']).code === 0 && !fs.existsSync(path.join(HOME, 'busy')), 'remove: its state goes with it');

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
