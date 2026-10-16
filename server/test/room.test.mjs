// Lobby room rules test (ENG-094): RoomCore driven in plain Node with a fake clock and fake sockets.
// Run: npm run test:lobby (from the repository root) or npm test (from server/).
import assert from 'node:assert/strict';
import { RoomCore, STREAK_CAP, NEXT_MATCH_MS, SILENT_MS, RESULT_WAIT_MS, MAX_MEMBERS, STATS_KEPT, pickDelay, QUICK_COUNT, CHAT_GAP_MS, BAN_MS, VOTE_MS } from '../src/roomCore.js';
import { isRude } from '../src/names.js';

const INPUT_DELAY = 2; // two members with no round trip yet (80 ms assumed each) get 2 frames

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed++;
  } catch (e) {
    console.error(`FAIL ${name}\n`, e);
    process.exitCode = 1;
  }
};

// a room with a fake clock; box[id] holds what each member received
function makeRoom(saved = null) {
  const box = {};
  const env = { clock: 1000, saved: null, closed: [] };
  const io = {
    send: (id, msg) => (box[id] ||= []).push(structuredClone(msg)),
    close: (id, code) => env.closed.push([id, code]),
    save: (s) => (env.saved = structuredClone(s)),
    now: () => env.clock,
  };
  const room = new RoomCore(io, saved);
  const join = (id, extra = {}, info = {}) => room.join(id, { name: id.toUpperCase(), fighter: 'naruto', sim: 'sim1', ...extra }, { ip: 'ip-' + id, ...info });
  const last = (id, t) => [...(box[id] || [])].reverse().find((m) => m.t === t);
  const all = (id, t) => (box[id] || []).filter((m) => m.t === t);
  const clear = () => { for (const k of Object.keys(box)) box[k] = []; };
  const tick = (ms) => { env.clock += ms; room.timer(); };
  return { room, box, env, join, last, all, clear, tick };
}

// a match to its end: both players' inputs for n frames, then both report `winner`
function play(R, n = 30, winner = 0) {
  const M = R.room.match;
  for (let p = 0; p < 2; p++) R.room.message(M.players[p], { t: 'in', start: INPUT_DELAY, v: new Array(n).fill(p + 1), ack: 0 });
  for (const id of M.players) R.room.message(id, { t: 'result', winner });
  return M;
}

test('join, welcome and room broadcast', () => {
  const R = makeRoom();
  R.join('a');
  const w = R.last('a', 'welcome');
  assert.equal(w.you, 'a');
  assert.equal(w.room.members.length, 1);
  assert.equal(w.room.host, 'a');
  assert.deepEqual(w.room.queue, ['a']);
  assert.equal(R.room.match, null, 'one player: no match');
  R.join('b', { name: '<b>bad name!!!</b>', fighter: 'BAD ID' });
  const room = R.last('a', 'room').room;
  assert.equal(room.members[1].name, 'bbad nameb', 'markup stripped');
  assert.equal(room.members[1].fighter, 'naruto', 'invalid fighter falls back');
});

test('two players start a match; a third spectates', () => {
  const R = makeRoom();
  R.join('a', { fighter: 'gojo' });
  R.join('b', { fighter: 'killua' });
  const s = R.last('a', 'start');
  assert.ok(s, 'match started');
  assert.equal(s.you, 0);
  assert.equal(R.last('b', 'start').you, 1);
  assert.deepEqual(s.players.map((p) => p.fighter), ['gojo', 'killua']);
  assert.equal(s.delay, INPUT_DELAY);
  R.join('c');
  assert.equal(R.last('c', 'start').you, -1, 'late joiner spectates');
  assert.deepEqual(R.room.queue, ['c']);
});

test('inputs are relayed to the opponent and fed to spectators', () => {
  const R = makeRoom();
  R.join('a'); R.join('b'); R.join('c');
  R.clear();
  R.room.message('a', { t: 'in', start: 2, v: [5, 6, 7, 8], ack: 1, adv: 3 });
  const relayed = R.last('b', 'in');
  assert.deepEqual(relayed, { t: 'in', from: 0, start: 2, v: [5, 6, 7, 8], ack: 1, adv: 3 });
  assert.equal(R.all('a', 'in').length, 0, 'not echoed');
  assert.equal(R.all('c', 'feed').length, 0, 'nothing confirmed yet');
  R.room.message('b', { t: 'in', start: 2, v: [9, 9, 9, 9, 9, 9, 9, 9], ack: 4 });
  const feed = R.last('c', 'feed');
  assert.equal(feed.start, 0);
  assert.deepEqual(feed.a, [0, 0, 5, 6, 7, 8], 'neutral delay frames, then A');
  assert.deepEqual(feed.b, [0, 0, 9, 9, 9, 9]);
  // overlapping resend: frames already kept are not doubled
  R.room.message('a', { t: 'in', start: 3, v: [6, 7, 8, 8, 8, 8, 8, 8], ack: 9 });
  assert.equal(R.room.match.inputs[0].length, 11);
  assert.deepEqual(R.room.match.inputs[0].slice(0, 6), [0, 0, 5, 6, 7, 8]);
});

test('a spectator who joins mid-match gets every confirmed frame', () => {
  const R = makeRoom();
  R.join('a'); R.join('b');
  for (let k = 0; k < 10; k++) {
    R.room.message('a', { t: 'in', start: 2 + k * 10, v: new Array(10).fill(k + 1) });
    R.room.message('b', { t: 'in', start: 2 + k * 10, v: new Array(10).fill(k + 101) });
  }
  R.join('late');
  const feeds = R.all('late', 'feed');
  const a = feeds.flatMap((f) => f.a);
  assert.equal(feeds[0].start, 0);
  assert.equal(a.length, R.room.match.fed + 1);
  assert.equal(a.length, 102);
  assert.equal(a[101], 10);
});

test('bad input messages are ignored', () => {
  const R = makeRoom();
  R.join('a'); R.join('b');
  const len = () => R.room.match.inputs[0].length;
  R.room.message('a', { t: 'in', start: 2, v: [1.5] });
  R.room.message('a', { t: 'in', start: 2, v: [-1] });
  R.room.message('a', { t: 'in', start: 2, v: [1 << 23] });
  R.room.message('a', { t: 'in', start: 'x', v: [1] });
  R.room.message('a', { t: 'in', start: 2, v: new Array(65).fill(0) });
  R.room.message('a', { t: 'in', start: 9, v: [1] }); // a gap
  assert.equal(len(), INPUT_DELAY);
  R.room.message('a', null);
  R.room.message('a', { t: 'nope' });
  R.room.message('ghost', { t: 'in', start: 2, v: [1] });
});

test('winner stays on, loser to the back', () => {
  const R = makeRoom();
  R.join('a'); R.join('b'); R.join('c');
  play(R, 30, 1); // b wins
  const end = R.last('c', 'end');
  assert.equal(end.winner, 'b');
  assert.equal(end.reason, 'ko');
  assert.equal(end.streak, 1);
  assert.deepEqual(R.room.queue, ['b', 'c', 'a']);
  assert.equal(R.room.match, null, 'results stay up before the next match');
  R.tick(NEXT_MATCH_MS);
  assert.deepEqual(R.room.match.players, ['b', 'c']);
  const view = R.last('a', 'room').room;
  assert.equal(view.members.find((m) => m.id === 'b').wins, 1);
});

test('streak cap sends the champion to the back', () => {
  const R = makeRoom();
  R.join('a'); R.join('b'); R.join('c'); R.join('d');
  for (let k = 0; k < STREAK_CAP; k++) {
    if (!R.room.match) R.tick(NEXT_MATCH_MS);
    const M = R.room.match;
    play(R, 10, M.players.indexOf('a') >= 0 ? M.players.indexOf('a') : 0);
  }
  const end = R.last('b', 'end');
  assert.equal(end.winner, 'a');
  assert.equal(end.streak, STREAK_CAP);
  assert.equal(end.capped, true);
  assert.equal(R.room.queue.at(-1), 'a', 'champion rests at the back');
  assert.equal(R.room.streak.a, 0);
});

test('a player who leaves forfeits', () => {
  const R = makeRoom();
  R.join('a'); R.join('b'); R.join('c');
  R.room.leave('a');
  const end = R.last('b', 'end');
  assert.equal(end.winner, 'b');
  assert.equal(end.reason, 'forfeit');
  assert.deepEqual(R.room.queue, ['b', 'c']);
  assert.equal(R.room.members.size, 2);
});

test('a silent player forfeits; two silent players are no contest', () => {
  const R = makeRoom();
  R.join('a'); R.join('b');
  R.tick(SILENT_MS / 2);
  R.room.message('a', { t: 'in', start: 2, v: [1] });
  R.tick(SILENT_MS / 2 + 1);
  let end = R.last('a', 'end');
  assert.equal(end.reason, 'timeout');
  assert.equal(end.winner, 'a');
  R.tick(NEXT_MATCH_MS);
  assert.ok(R.room.match, 'next match');
  R.tick(SILENT_MS + 1);
  end = R.last('a', 'end');
  assert.equal(end.winner, null);
  assert.deepEqual(R.room.queue, ['a', 'b']);
});

test('results must agree; one result alone wins after the wait', () => {
  const R = makeRoom();
  R.join('a'); R.join('b');
  R.room.message('a', { t: 'result', winner: 0 });
  R.room.message('b', { t: 'result', winner: 1 });
  assert.equal(R.last('a', 'end').reason, 'mismatch');
  assert.equal(R.last('a', 'end').winner, null);
  assert.deepEqual(R.room.queue, ['a', 'b'], 'no contest: same pair again, same sides');
  R.tick(NEXT_MATCH_MS);
  R.room.message('b', { t: 'result', winner: 1 });
  assert.equal(R.room.match.resultAt > 0, true);
  R.tick(RESULT_WAIT_MS + 1);
  assert.equal(R.last('a', 'end').winner, 'b');
});

test('a desync ends the match as no contest', () => {
  const R = makeRoom();
  R.join('a'); R.join('b');
  R.room.message('b', { t: 'desync', frame: 600 });
  const end = R.last('a', 'end');
  assert.equal(end.reason, 'desync');
  assert.equal(end.frame, 600);
  assert.equal(end.winner, null);
});

test('state hashes are relayed between the players only', () => {
  const R = makeRoom();
  R.join('a'); R.join('b'); R.join('c');
  R.room.message('a', { t: 'ck', frame: 60, hash: -5 });
  assert.deepEqual(R.last('b', 'ck'), { t: 'ck', frame: 60, hash: (-5) >>> 0 });
  assert.equal(R.all('c', 'ck').length, 0);
  R.room.message('c', { t: 'ck', frame: 60, hash: 1 });
  assert.equal(R.all('a', 'ck').length, 0, 'a spectator cannot inject hashes');
});

test('another build is turned away; the room fills up', () => {
  const R = makeRoom();
  R.join('a');
  assert.equal(R.join('b', { sim: 'other' }), null);
  assert.equal(R.last('b', 'error').code, 'version');
  for (let i = 1; i < MAX_MEMBERS; i++) R.join(`m${i}`);
  assert.equal(R.join('extra'), null);
  assert.equal(R.last('extra', 'error').code, 'full');
});

test('spectate only, then back in line; fighter changes wait for the next match', () => {
  const R = makeRoom();
  R.join('a', { play: false });
  R.join('b');
  assert.equal(R.room.match, null);
  assert.deepEqual(R.room.queue, ['b']);
  R.room.message('a', { t: 'set', play: true, fighter: 'sasuke' });
  assert.deepEqual(R.room.match.players, ['b', 'a']);
  assert.equal(R.room.match.fighters[1], 'sasuke');
  R.room.message('a', { t: 'set', fighter: 'gojo' });
  assert.equal(R.room.match.fighters[1], 'sasuke', 'the running match keeps its fighter');
  R.room.message('a', { t: 'set', play: false });
  play(R, 5, 0);
  assert.deepEqual(R.room.queue, ['b'], 'a left the line');
});

test('flooding is refused', () => {
  const R = makeRoom();
  R.join('a');
  let r;
  for (let i = 0; i < 400 && r !== 'flood'; i++) r = R.room.message('a', { t: 'set', name: 'x' });
  assert.equal(r, 'flood');
});

test('a restarted room keeps its line and tells a cut match its end', () => {
  const R = makeRoom();
  R.join('a'); R.join('b'); R.join('c');
  const saved = R.env.saved;
  assert.equal(saved.live, 1);
  const R2 = makeRoom(saved);
  for (const id of ['a', 'b', 'c']) R2.room.restore({ id, name: id, fighter: 'naruto', play: true, sim: 'sim1' });
  assert.equal(R2.room.match, null);
  R2.room.message('a', { t: 'in', start: 2, v: [1] });
  R2.room.message('a', { t: 'in', start: 3, v: [1] });
  assert.equal(R2.all('a', 'end').length, 1);
  assert.equal(R2.last('a', 'end').reason, 'server');
  R2.join('d');
  assert.ok(R2.room.match, 'the line plays on');
});

test('input delay follows the players\' round trips', () => {
  assert.equal(pickDelay(20, 50), 1, 'home Wi-Fi: 1 frame');
  assert.equal(pickDelay(60, 60), 1, '60 ms from player to player: still 1');
  assert.equal(pickDelay(100, 100), 2);
  assert.equal(pickDelay(160, 170), 3);
  assert.equal(pickDelay(null, null), 2, 'unknown: 80 ms assumed');
  const R = makeRoom();
  R.join('a', { rtt: 24 });
  R.room.message('a', { t: 'rtt', ms: 30 });
  R.room.message('a', { t: 'rtt', ms: 'x' });
  assert.equal(R.room.members.get('a').rtt, 26);
  R.join('b', { rtt: 45 });
  assert.equal(R.last('a', 'start').delay, 1);
  assert.equal(R.room.match.inputs[0].length, 1, 'one neutral frame');
  R.room.message('a', { t: 'in', start: 1, v: [3, 3, 3, 3, 3, 3] });
  R.room.message('b', { t: 'in', start: 1, v: [4, 4, 4, 4, 4, 4] });
  R.join('c');
  const feed = R.last('c', 'feed');
  assert.deepEqual(feed.a, [0, 3, 3, 3, 3, 3, 3]);
});

test('connection stats are kept, cleaned and capped', () => {
  const R = makeRoom();
  R.join('a');
  R.room.message('a', { t: 'stats', match: 1, slot: 0, device: 'touch', delay: 1, rtt: 41.26, rollbacks: 12, stalls: 3, fps: 58.4, junk: 'x', frames: -5 });
  const e = R.room.statsLog[0];
  assert.equal(e.name, 'A');
  assert.equal(e.device, 'touch');
  assert.equal(e.rtt, 41.3);
  assert.equal(e.frames, 0);
  assert.equal(e.junk, undefined);
  assert.equal(R.env.saved.stats.length, 1, 'persisted');
  for (let i = 0; i < STATS_KEPT + 5; i++) R.room.message('a', { t: 'stats', match: i });
  assert.equal(R.room.statsLog.length, STATS_KEPT);
});

test('a public room needs the anti-bot check; its title, region and listing', () => {
  const R = makeRoom();
  assert.equal(R.join('a', { public: true }), null);
  assert.equal(R.last('a', 'error').code, 'verify');
  assert.equal(R.room.members.size, 0);
  R.join('a', { public: true, name: 'Eric' }, { verified: true, region: 'LAX' });
  assert.equal(R.room.pub, true);
  assert.equal(R.last('a', 'welcome').room.title, "Eric's room");
  assert.deepEqual(R.room.summary(), { title: "Eric's room", region: 'LAX', members: 1, playing: null, waiting: 1, full: false });
  R.join('b', { public: false }); // a later member doesn't change it
  assert.equal(R.room.pub, true);
  assert.deepEqual(R.room.summary().playing, ['Eric', 'B']);
  R.room.leave('a');
  R.room.leave('b');
  assert.equal(R.room.summary(), null, 'empty: unlisted');
  assert.equal(R.room.pub, false);
  R.join('c');
  assert.equal(R.room.pub, false, 'reopened private');
  assert.equal(R.room.title, "C's room");
});

test('names pass the filter', () => {
  const R = makeRoom();
  R.join('a', { name: 'sh1tlord' });
  assert.match(R.room.members.get('a').name, /^Player\d{3}$/);
  R.room.message('a', { t: 'set', name: 'Kakashi' });
  assert.equal(R.room.members.get('a').name, 'Kakashi');
  assert.equal(isRude('Peacock'), false);
});

test('quick-chat: indexes only, rate limited, kept for latecomers', () => {
  const R = makeRoom();
  R.join('a'); R.join('b');
  R.room.message('a', { t: 'say', i: 3 });
  assert.deepEqual(R.last('b', 'say'), { t: 'say', from: 'a', name: 'A', i: 3 });
  R.room.message('a', { t: 'say', i: 4 });
  assert.equal(R.all('b', 'say').length, 1, 'too soon');
  R.env.clock += CHAT_GAP_MS;
  R.room.message('a', { t: 'say', i: QUICK_COUNT });
  R.room.message('a', { t: 'say', i: 'hello' });
  R.room.message('a', { t: 'say', text: 'free text' });
  assert.equal(R.all('b', 'say').length, 1, 'no out-of-range index or free text');
  R.join('c');
  assert.deepEqual(R.last('c', 'welcome').room.chat, [{ from: 'a', name: 'A', i: 3 }]);
});

test('the host removes someone; the address stays out for a while', () => {
  const R = makeRoom();
  R.join('a'); R.join('b'); R.join('c');
  R.room.message('b', { t: 'kick', id: 'c' });
  assert.equal(R.room.members.size, 3, 'only the host can');
  R.room.message('a', { t: 'kick', id: 'a' });
  assert.equal(R.room.members.size, 3, 'not yourself');
  R.room.message('a', { t: 'kick', id: 'b' });
  assert.equal(R.last('b', 'error').code, 'removed');
  assert.deepEqual(R.env.closed.at(-1), ['b', 4001]);
  assert.equal(R.room.members.has('b'), false);
  assert.equal(R.last('a', 'end').reason, 'forfeit', 'b was playing: forfeit');
  assert.equal(R.join('b2', {}, { ip: 'ip-b' }), null);
  assert.equal(R.last('b2', 'error').code, 'banned');
  R.env.clock += BAN_MS + 1;
  assert.ok(R.join('b3', {}, { ip: 'ip-b' }), 'the ban lapses');
});

test('one home network: removing someone on the host address bans their browser, not the address', () => {
  const R = makeRoom();
  R.join('host', {}, { ip: 'home' });
  R.join('kid', { cid: 'browser-kid' }, { ip: 'home' });
  R.room.message('host', { t: 'kick', id: 'kid' });
  assert.equal(R.join('kid2', { cid: 'browser-kid' }, { ip: 'home' }), null, 'the same browser stays out');
  assert.ok(R.join('sibling', { cid: 'browser-sib' }, { ip: 'home' }), 'others on the same Wi-Fi still get in');
});

test('vote to remove: a majority of the others, at least two', () => {
  const R = makeRoom();
  R.join('a'); R.join('b');
  R.room.message('a', { t: 'vote', id: 'b' });
  assert.ok(R.room.members.has('b'), 'two members: one vote is not enough');
  R.join('c'); R.join('d'); R.join('e');
  assert.equal(R.room.needed(), 3, 'five members: 3 of the other 4');
  R.env.clock += VOTE_MS + 1; // a's vote lapses
  R.room.message('c', { t: 'vote', id: 'b' });
  R.room.message('d', { t: 'vote', id: 'b' });
  assert.equal(R.last('e', 'room').room.votes.b, 2);
  assert.ok(R.room.members.has('b'));
  R.room.message('e', { t: 'vote', id: 'b' });
  assert.equal(R.room.members.has('b'), false);
  assert.equal(R.last('b', 'error').text, 'The room voted to remove you.');
});

console.log(process.exitCode ? `room test: ${passed} passed, some FAILED` : `room test: OK, ${passed} passed`);
