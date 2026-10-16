// One lobby room's rules (ADR 0036, ENG-094): its members, the winner-stays-on queue, the match relay and the
// spectator feed. No Cloudflare API in here: room.js adapts it to a Durable Object, and server/test drives it in
// plain Node with a fake clock.
//
// A member is one connection. `hello { name, fighter, sim, play }` joins (every member must run the same
// simulation build, `sim`), and the room answers `welcome { you, room }`. Everyone who wants to play waits in the
// queue: the first two play, the winner stays on (to the back after STREAK_CAP wins in a row), the loser goes to the
// back. The two players exchange the rollback session's messages (`in` inputs, `ck` state hashes) through the room,
// which keeps every input and feeds the confirmed frames to everyone else; spectators replay them and never roll
// back. Both players report the winner once all their frames are confirmed. A disagreement, a desync report, a
// player leaving or going silent ends the match early. Each member reports its round trip to the room (`rtt`), and a
// match's input delay comes from its two players' (pickDelay); players send their connection stats after a match
// (`stats`), kept for GET /room/<CODE>/stats.
//
// Public rooms (ENG-095): the member who opens an empty room makes it public (hello `public`, after the anti-bot check
// room.js runs) or private; a public room's summary() is listed by the directory. Members talk in quick-chat only
// (`say`: an index into the client's phrase and emote list, no free text) and names pass a filter (names.js). The
// host (the longest-standing member) can remove anyone; anyone can vote to remove someone, and a majority of the
// others does it. A removed member's browser (its `cid`) can't come back for BAN_MS, nor its address unless someone
// still in the room shares it (one home's Wi-Fi: the host who removed them, a sibling).
//
// Rejoining (ENG-097): a dropped connection (room.js: disconnect) keeps the member's seat for GRACE_MS, marked away.
// The welcome carries a secret `token`; a hello with `resume { id, token, have }` takes the seat back. A player
// returning to its match gets the start again with `resume.have` (how many of each player's inputs the room holds),
// then `log` messages with every input it lacks (from its own `have`; all of them after a reload) and `logEnd`.
// `leave` is a member leaving on purpose (no grace).
import { cleanName } from './names.js';

export const STREAK_CAP = 5;
export const STATS_KEPT = 20; // the newest per-player match stats a room keeps
export const NEXT_MATCH_MS = 6000; // the results on screen, then the next pair
export const SILENT_MS = 20000; // a player whose inputs stop this long (closed laptop, app in the background) forfeits
export const GRACE_MS = 20000; // a dropped member's seat (and match) waits this long for it to come back
export const RESULT_WAIT_MS = 8000; // one player reported the winner: how long the other has to agree
export const MAX_MEMBERS = 24;
export const WATCHDOG_MS = 2000; // the silence check's period while a match runs
export const QUICK_COUNT = 24; // quick-chat phrases and emotes (the client's list, src/net/quickChat.js)
export const CHAT_KEPT = 8; // lines a room keeps for members who arrive later
export const CHAT_GAP_MS = 1200; // one line per member at most this often
export const BAN_MS = 10 * 60 * 1000; // a removed member stays out this long
export const VOTE_MS = 90 * 1000; // a vote to remove someone lapses after this
const FEED_EVERY = 6; // confirmed frames per spectator message (ten a second)
const FEED_CHUNK = 3000; // frames per message when catching a late spectator up
const RATE = 150; // messages a second a member may send (a player sends 60), and twice that as a burst

const newToken = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, '0')).join('');
const seedOf = (id) => [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
const cleanFighter = (s) => (typeof s === 'string' && /^[a-z0-9_-]{1,24}$/.test(s) ? s : null);
const isInput = (v) => Number.isInteger(v) && v >= 0 && v < 1 << 23;
const isFrame = (f) => Number.isInteger(f) && f >= 0 && f < 1e7;
const num = (v, max = 1e7) => (Number.isFinite(v) ? Math.max(0, Math.min(max, Math.round(v * 10) / 10)) : null);

// A match's input delay in frames, from its two players' round trips to the room (ms; unknown counts as 80). A move
// takes about (rttA + rttB) / 2 to reach the other player; rollback hides what the delay doesn't, so a good
// connection gets 1 frame (the least a player feels next to playing offline) and only long ones get more.
export function pickDelay(rttA, rttB) {
  const oneWay = ((rttA ?? 80) + (rttB ?? 80)) / 2 / (1000 / 60);
  return oneWay <= 4 ? 1 : oneWay <= 7 ? 2 : 3;
}

export class RoomCore {
  // io: { send(id, msg), save(state), now() -> ms }. saved: the last save(), for an object that restarted.
  constructor(io, saved = null) {
    this.io = io;
    this.members = new Map(); // id -> { id, name, fighter, play, sim }, in join order (the first is the host)
    const s = saved || {};
    this.queue = s.queue || []; // ids waiting to play, in order (the two playing are not in it)
    this.wins = s.wins || {};
    this.streak = s.streak || {};
    this.matchNo = s.matchNo || 0;
    this.nextAt = s.nextAt || 0; // no match starts before this (the last one's results stay up)
    this.match = null; // a match never survives a restart: its inputs lived in memory
    this.cut = s.live ?? null; // the match a restart cut short, if any: its players hear it ended
    this.told = new Set();
    this.bucket = new Map(); // id -> { tokens, at }: the flood limit
    this.statsLog = s.stats || []; // the players' connection stats of recent matches, newest last
    this.pub = !!s.pub; // listed in the public directory
    this.title = s.title || '';
    this.region = s.region || ''; // where its first member connected from (Cloudflare's location code, e.g. LAX)
    this.bans = s.bans || {}; // 'c:' + browser id or 'i:' + address hash -> until (ms)
    this.chat = []; // recent quick-chat lines { from, name, i }
    this.votes = new Map(); // target id -> Map(voter id -> when)
  }

  // a member a restarted object finds on its sockets (room.js): back in, without a broadcast
  restore(m) {
    this.members.set(m.id, { id: m.id, name: m.name, fighter: m.fighter, play: m.play, sim: m.sim, rtt: m.rtt ?? null, ip: m.ip ?? null, cid: m.cid ?? null, token: m.token, awayUntil: null });
  }

  // the seat a resume hello may take back: the member's id, or null
  resumable(r) {
    const m = r && this.members.get(r.id);
    return m && typeof r.token === 'string' && r.token === m.token ? m.id : null;
  }

  // the connection dropped: the seat waits GRACE_MS (a match too: its silence rule has the same length)
  disconnect(id) {
    const m = this.members.get(id);
    if (!m) return;
    m.awayUntil = this.io.now() + GRACE_MS;
    this.changed();
  }

  // a member back on a new connection (room.js already pointed it at the seat): the room, and its match
  resume(m, hello) {
    m.awayUntil = null; // in line for real again (changed() may start a match with it)
    this.rtt(m, { ms: hello?.rtt });
    this.io.send(m.id, { t: 'welcome', you: m.id, token: m.token, room: this.view(), resumed: true });
    if (this.match) this.sendMatch(m.id, Array.isArray(hello.resume.have) ? hello.resume.have : [0, 0]);
    this.changed();
    return m;
  }

  // A new connection's hello; returns the member, or null (rejected: the socket is closed after the error). info (from
  // room.js): { ip: a hash of the address, region, verified: the anti-bot check passed }.
  join(id, hello, info = {}) {
    if (hello?.resume) {
      const back = this.resumable(hello.resume) === id && this.members.get(id);
      return back ? this.resume(back, hello) : this.reject(id, 'gone', 'Your seat in the room is gone. Join it again.');
    }
    const sim = String(hello?.sim ?? '').slice(0, 40);
    const first = this.members.values().next().value;
    const now = this.io.now();
    const cid = typeof hello?.cid === 'string' ? hello.cid.slice(0, 40) : null;
    if ((cid && this.bans['c:' + cid] > now) || (info.ip && this.bans['i:' + info.ip] > now)) {
      return this.reject(id, 'banned', 'You were removed from this room. Try another one.');
    }
    if (this.members.size >= MAX_MEMBERS) return this.reject(id, 'full', 'This room is full.');
    if (first && first.sim !== sim) return this.reject(id, 'version', 'This room runs another version of the game. Refresh the page to update.');
    const m = { id, name: cleanName(hello?.name, seedOf(id)), fighter: cleanFighter(hello?.fighter) || 'naruto', play: hello?.play !== false, sim, rtt: null, ip: info.ip ?? null, cid, token: newToken(), awayUntil: null };
    if (!first) {
      // the room opens: public only after the anti-bot check
      if (hello?.public && !info.verified) return this.reject(id, 'verify', 'Could not check that you are a person. Try again.');
      this.pub = !!hello?.public;
      this.title = `${m.name}'s room`;
      this.region = String(info.region ?? '').slice(0, 8);
      this.chat = [];
    }
    this.rtt(m, { ms: hello?.rtt });
    this.members.set(id, m);
    this.queue = this.queue.filter((q) => this.members.has(q)); // ids a restart left behind
    if (m.play) this.queue.push(id);
    this.io.send(id, { t: 'welcome', you: id, token: m.token, room: this.view() });
    if (this.match) this.sendMatch(id);
    this.changed();
    return m;
  }

  reject(id, code, text) {
    this.io.send(id, { t: 'error', code, text });
    return null;
  }

  leave(id) {
    if (!this.members.delete(id)) return;
    this.bucket.delete(id);
    this.queue = this.queue.filter((q) => q !== id);
    const M = this.match;
    if (M && M.players.includes(id)) this.finish(1 - M.players.indexOf(id), 'forfeit');
    delete this.wins[id];
    delete this.streak[id];
    this.votes.delete(id);
    for (const v of this.votes.values()) v.delete(id);
    if (!this.members.size) this.empty();
    this.changed();
  }

  // the last member left: the code is free again (a later visitor opens a fresh room under it)
  empty() {
    Object.assign(this, { queue: [], wins: {}, streak: {}, pub: false, title: '', region: '', chat: [], nextAt: 0 });
    this.votes.clear();
  }

  // returns 'flood' when the member sent too much (room.js closes the socket)
  message(id, msg) {
    const m = this.members.get(id);
    if (!m || !msg || typeof msg !== 'object') return;
    if (!this.spend(id)) return 'flood';
    switch (msg.t) {
      case 'set': return this.set(m, msg);
      case 'in': return this.input(m, msg);
      case 'ck': return this.check(m, msg);
      case 'result': return this.result(m, msg);
      case 'desync': return this.desync(m, msg);
      case 'rtt': return this.rtt(m, msg);
      case 'stats': return this.stats(m, msg);
      case 'say': return this.say(m, msg);
      case 'kick': return this.kick(m, msg);
      case 'vote': return this.vote(m, msg);
      case 'leave': return this.leave(m.id);
    }
  }

  // ------------------------------------------------------------ talk and moderation (ENG-095)
  // a quick-chat line: an index into the client's list, so no one can type anything at anyone
  say(m, msg) {
    const now = this.io.now();
    if (!Number.isInteger(msg.i) || msg.i < 0 || msg.i >= QUICK_COUNT || (m.saidAt != null && now - m.saidAt < CHAT_GAP_MS)) return;
    m.saidAt = now;
    const line = { from: m.id, name: m.name, i: msg.i };
    this.chat.push(line);
    if (this.chat.length > CHAT_KEPT) this.chat.shift();
    for (const id of this.members.keys()) this.io.send(id, { t: 'say', ...line });
  }

  host() {
    return this.members.keys().next().value ?? null;
  }

  // the host removes someone
  kick(m, msg) {
    if (m.id !== this.host() || msg.id === m.id || !this.members.has(msg.id)) return;
    this.remove(msg.id, 'The host removed you from the room.');
  }

  // anyone votes to remove someone; a majority of the others (at least two votes) does it
  vote(m, msg) {
    const target = msg.id, now = this.io.now();
    if (target === m.id || !this.members.has(target)) return;
    const v = this.votes.get(target) || new Map();
    v.set(m.id, now);
    for (const [voter, at] of v) if (now - at > VOTE_MS || !this.members.has(voter)) v.delete(voter);
    this.votes.set(target, v);
    if (v.size >= this.needed()) this.remove(target, 'The room voted to remove you.');
    else this.changed();
  }

  // votes it takes to remove someone: a majority of everyone else, and never fewer than two
  needed() {
    return Math.max(2, Math.floor((this.members.size - 1) / 2) + 1);
  }

  remove(id, text) {
    const m = this.members.get(id);
    if (!m) return;
    const until = this.io.now() + BAN_MS;
    if (m.cid) this.bans['c:' + m.cid] = until;
    if (m.ip && ![...this.members.values()].some((o) => o.id !== id && o.ip === m.ip)) this.bans['i:' + m.ip] = until;
    this.io.send(id, { t: 'error', code: 'removed', text });
    this.io.close?.(id, 4001, 'removed');
    this.leave(id); // a player in a match forfeits it
  }

  // the member's round trip to the room (its ping / pong), smoothed: it sets the next match's input delay
  rtt(m, msg) {
    const ms = num(msg.ms, 5000);
    if (ms == null) return;
    m.rtt = m.rtt == null ? ms : Math.round(m.rtt * 0.7 + ms * 0.3);
  }

  // a player's connection over its last match (what the lag felt like, device by device): kept, not broadcast
  stats(m, msg) {
    const keys = ['match', 'slot', 'delay', 'rtt', 'frames', 'rollbacks', 'maxDepth', 'resimFrames', 'stalls', 'syncWaits', 'fps', 'fpsLow', 'longFrames', 'seconds'];
    const entry = { at: new Date(this.io.now()).toISOString(), name: m.name, device: String(msg.device ?? '').slice(0, 16) };
    for (const k of keys) entry[k] = num(msg[k]);
    this.statsLog.push(entry);
    if (this.statsLog.length > STATS_KEPT) this.statsLog.splice(0, this.statsLog.length - STATS_KEPT);
    this.persist();
  }

  spend(id) {
    const now = this.io.now();
    const b = this.bucket.get(id) || { tokens: RATE * 2, at: now };
    b.tokens = Math.min(RATE * 2, b.tokens + ((now - b.at) / 1000) * RATE) - 1;
    b.at = now;
    this.bucket.set(id, b);
    return b.tokens >= 0;
  }

  // name, fighter (from the next match on) and whether the member wants to play
  set(m, msg) {
    if ('name' in msg) m.name = cleanName(msg.name, seedOf(m.id));
    if ('fighter' in msg) m.fighter = cleanFighter(msg.fighter) || m.fighter;
    if ('play' in msg) {
      m.play = !!msg.play;
      const playing = this.match?.players.includes(m.id);
      if (!m.play) this.queue = this.queue.filter((q) => q !== m.id);
      else if (!playing && !this.queue.includes(m.id)) this.queue.push(m.id);
    }
    this.changed();
  }

  // ------------------------------------------------------------ the match
  // the first two in line who are here (an away member keeps its place but isn't put into a match)
  maybeStart() {
    if (this.match || this.io.now() < this.nextAt) return;
    const players = this.queue.filter((id) => !this.members.get(id)?.awayUntil).slice(0, 2);
    if (players.length < 2) return;
    this.queue = this.queue.filter((id) => !players.includes(id));
    const ms = players.map((id) => this.members.get(id));
    this.matchNo++;
    const now = this.io.now();
    const delay = pickDelay(ms[0].rtt, ms[1].rtt);
    this.match = {
      no: this.matchNo,
      players,
      fighters: ms.map((m) => m.fighter),
      names: ms.map((m) => m.name),
      seed: (Math.random() * 4294967296) >>> 0,
      delay,
      inputs: [new Array(delay).fill(0), new Array(delay).fill(0)], // the first `delay` frames are neutral
      fed: -1, // the newest frame sent to spectators
      lastIn: [now, now],
      result: [null, null],
      resultAt: 0,
    };
    this.cut = null;
    for (const id of this.members.keys()) this.sendMatch(id);
  }

  // The match to one member: its setup, and for a spectator every confirmed frame so far (a late joiner fast-forwards).
  // have (a player coming back): how many of each player's inputs it still holds; it gets the rest as `log`.
  sendMatch(id, have = null) {
    const M = this.match;
    const you = M.players.indexOf(id);
    const start = {
      t: 'start', no: M.no, seed: M.seed, delay: M.delay, you,
      players: M.players.map((p, i) => ({ id: p, name: M.names[i], fighter: M.fighters[i] })),
    };
    if (you >= 0 && have) start.resume = { have: M.inputs.map((l) => l.length) };
    this.io.send(id, start);
    if (you >= 0) {
      if (!have) return;
      for (let p = 0; p < 2; p++) {
        const list = M.inputs[p];
        for (let f = Math.max(0, Math.min(have[p] | 0, list.length)); f < list.length; f += FEED_CHUNK) {
          this.io.send(id, { t: 'log', no: M.no, p, start: f, v: list.slice(f, f + FEED_CHUNK) });
        }
      }
      this.io.send(id, { t: 'logEnd', no: M.no });
      return;
    }
    for (let f = 0; f <= M.fed; f += FEED_CHUNK) {
      const end = Math.min(M.fed, f + FEED_CHUNK - 1);
      this.io.send(id, { t: 'feed', no: M.no, start: f, a: M.inputs[0].slice(f, end + 1), b: M.inputs[1].slice(f, end + 1) });
    }
  }

  slot(m) {
    return this.match ? this.match.players.indexOf(m.id) : -1;
  }

  // A player's inputs: kept (each frame once, in order) and passed on to the other player as they came.
  input(m, msg) {
    const M = this.match, p = this.slot(m);
    if (p < 0) return this.stale(m);
    if (!isFrame(msg.start) || !Array.isArray(msg.v) || msg.v.length > 64 || !msg.v.every(isInput)) return;
    const list = M.inputs[p];
    for (let k = 0; k < msg.v.length; k++) {
      const f = msg.start + k;
      if (f === list.length) list.push(msg.v[k]);
      else if (f > list.length) break; // a gap can't happen over one ordered socket
    }
    M.lastIn[p] = this.io.now();
    const out = { t: 'in', from: p, start: msg.start, v: msg.v };
    if (Number.isInteger(msg.ack)) out.ack = msg.ack;
    if (Number.isFinite(msg.adv)) out.adv = Math.round(msg.adv);
    this.io.send(M.players[1 - p], out);
    this.feed(false);
  }

  // frames both players' inputs are known for, to everyone else (in batches; `all`: whatever is left)
  feed(all) {
    const M = this.match;
    const conf = Math.min(M.inputs[0].length, M.inputs[1].length) - 1;
    if (conf - M.fed < (all ? 1 : FEED_EVERY)) return;
    const msg = { t: 'feed', no: M.no, start: M.fed + 1, a: M.inputs[0].slice(M.fed + 1, conf + 1), b: M.inputs[1].slice(M.fed + 1, conf + 1) };
    M.fed = conf;
    for (const id of this.members.keys()) if (!M.players.includes(id)) this.io.send(id, msg);
  }

  check(m, msg) {
    const p = this.slot(m);
    if (p < 0 || !isFrame(msg.frame) || !Number.isInteger(msg.hash)) return;
    this.io.send(this.match.players[1 - p], { t: 'ck', frame: msg.frame, hash: msg.hash >>> 0 });
  }

  // the winner (0 / 1) a player's game reached on confirmed frames
  result(m, msg) {
    const M = this.match, p = this.slot(m);
    if (p < 0) return this.stale(m);
    if (msg.winner !== 0 && msg.winner !== 1) return;
    M.result[p] = msg.winner;
    const other = M.result[1 - p];
    if (other == null) {
      M.resultAt = this.io.now() + RESULT_WAIT_MS;
      return;
    }
    if (other === msg.winner) this.finish(msg.winner, 'ko');
    else this.finish(null, 'mismatch');
  }

  desync(m, msg) {
    if (this.slot(m) < 0) return;
    this.finish(null, 'desync', isFrame(msg.frame) ? msg.frame : null);
  }

  // a message for a match that is gone: after a restart its players are told once (else they'd wait forever)
  stale(m) {
    if (this.cut == null || this.told.has(m.id)) return;
    this.told.add(m.id);
    this.io.send(m.id, { t: 'end', no: this.cut, winner: null, reason: 'server' });
  }

  // w: the winning slot, or null for no contest. The winner stays on, the loser queues again at the back.
  finish(w, reason, frame = null) {
    const M = this.match;
    this.feed(true); // the last confirmed frames, so spectators can play to the end
    this.match = null;
    const here = (id) => this.members.get(id)?.play;
    let streak = 0, capped = false;
    if (w != null) {
      const win = M.players[w], lose = M.players[1 - w];
      this.wins[win] = (this.wins[win] || 0) + 1;
      streak = this.streak[win] = (this.streak[win] || 0) + 1;
      this.streak[lose] = 0;
      if (here(lose)) this.queue.push(lose);
      if (here(win)) {
        capped = streak >= STREAK_CAP;
        if (capped) {
          this.streak[win] = 0;
          this.queue.push(win);
        } else this.queue.unshift(win);
      }
    } else {
      // no contest: the same two again, first in line (whoever is still here and still wants to)
      for (const id of [...M.players].reverse()) if (here(id)) this.queue.unshift(id);
    }
    this.nextAt = this.io.now() + NEXT_MATCH_MS;
    const end = { t: 'end', no: M.no, winner: w == null ? null : M.players[w], reason, streak, capped };
    if (frame != null) end.frame = frame;
    for (const id of this.members.keys()) this.io.send(id, end);
    this.changed();
  }

  // the alarm (room.js): a seat whose grace ran out, a silent player, a result waiting for its pair, the next match
  timer() {
    const now = this.io.now();
    for (const m of [...this.members.values()]) if (m.awayUntil && now >= m.awayUntil) this.leave(m.id);
    const M = this.match;
    if (M) {
      const quiet = M.lastIn.map((t) => now - t > SILENT_MS);
      if (quiet[0] || quiet[1]) return this.finish(quiet[0] && quiet[1] ? null : quiet[0] ? 1 : 0, 'timeout');
      if (M.resultAt && now >= M.resultAt) return this.finish(M.result[0] ?? M.result[1], 'ko');
      return;
    }
    if (this.queue.length >= 2 && now >= this.nextAt) this.changed();
  }

  // ready to play: in line and not away
  ready() {
    return this.queue.filter((id) => !this.members.get(id)?.awayUntil).length;
  }

  // when the alarm must fire next (ms), or null
  nextWake() {
    const now = this.io.now(), M = this.match;
    const away = Math.min(...[...this.members.values()].map((m) => m.awayUntil || Infinity));
    let at = away;
    if (M) at = Math.min(at, now + WATCHDOG_MS, M.resultAt || Infinity);
    else if (this.ready() >= 2 && this.nextAt > now) at = Math.min(at, this.nextAt);
    return at === Infinity ? null : at;
  }

  // ------------------------------------------------------------ room state
  view() {
    const now = this.io.now();
    return {
      members: [...this.members.values()].map((m) => ({
        id: m.id, name: m.name, fighter: m.fighter, play: m.play, wins: this.wins[m.id] || 0, streak: this.streak[m.id] || 0,
        away: m.awayUntil ? Math.max(0, m.awayUntil - now) : 0, // ms left to come back
      })),
      queue: this.queue.slice(),
      match: this.match ? { no: this.match.no, players: this.match.players.slice(), fighters: this.match.fighters.slice() } : null,
      host: this.host(),
      nextIn: !this.match && this.queue.length >= 2 ? Math.max(0, this.nextAt - now) : null,
      pub: this.pub,
      title: this.title,
      region: this.region,
      chat: this.chat.slice(),
      votes: Object.fromEntries([...this.votes].filter(([, v]) => v.size).map(([id, v]) => [id, v.size])),
      needed: this.needed(),
    };
  }

  // what the public directory lists (null: not listed)
  summary() {
    if (!this.pub || !this.members.size) return null;
    const names = (ids) => ids.map((id) => this.members.get(id)?.name ?? '?');
    return {
      title: this.title,
      region: this.region,
      members: this.members.size,
      playing: this.match ? names(this.match.players) : null,
      waiting: this.queue.length,
      full: this.members.size >= MAX_MEMBERS,
    };
  }

  changed() {
    this.maybeStart();
    const room = this.view();
    for (const id of this.members.keys()) this.io.send(id, { t: 'room', room });
    this.persist();
  }

  persist() {
    const now = this.io.now();
    for (const [ip, until] of Object.entries(this.bans)) if (until <= now) delete this.bans[ip];
    this.io.save({
      queue: this.queue, wins: this.wins, streak: this.streak, matchNo: this.matchNo, nextAt: this.nextAt,
      live: this.match?.no ?? null, stats: this.statsLog, pub: this.pub, title: this.title, region: this.region, bans: this.bans,
    });
  }
}
