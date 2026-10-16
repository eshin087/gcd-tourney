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
// player leaving or going silent ends the match early.

export const STREAK_CAP = 5;
export const INPUT_DELAY = 2;
export const NEXT_MATCH_MS = 6000; // the results on screen, then the next pair
export const SILENT_MS = 10000; // a player whose inputs stop this long (closed laptop, app in the background) forfeits
export const RESULT_WAIT_MS = 8000; // one player reported the winner: how long the other has to agree
export const MAX_MEMBERS = 24;
export const WATCHDOG_MS = 2000; // the silence check's period while a match runs
const FEED_EVERY = 6; // confirmed frames per spectator message (ten a second)
const FEED_CHUNK = 3000; // frames per message when catching a late spectator up
const RATE = 150; // messages a second a member may send (a player sends 60), and twice that as a burst

const cleanName = (s) => String(s ?? '').replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 16) || 'Player';
const cleanFighter = (s) => (typeof s === 'string' && /^[a-z0-9_-]{1,24}$/.test(s) ? s : null);
const isInput = (v) => Number.isInteger(v) && v >= 0 && v < 1 << 23;
const isFrame = (f) => Number.isInteger(f) && f >= 0 && f < 1e7;

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
  }

  // a member a restarted object finds on its sockets (room.js): back in, without a broadcast
  restore(m) {
    this.members.set(m.id, { id: m.id, name: m.name, fighter: m.fighter, play: m.play, sim: m.sim });
  }

  // a new connection's hello; returns the member, or null (rejected: the socket is closed after the error)
  join(id, hello) {
    const sim = String(hello?.sim ?? '').slice(0, 40);
    const first = this.members.values().next().value;
    if (this.members.size >= MAX_MEMBERS) return this.reject(id, 'full', 'This room is full.');
    if (first && first.sim !== sim) return this.reject(id, 'version', 'This room runs another version of the game. Refresh the page to update.');
    const m = { id, name: cleanName(hello?.name), fighter: cleanFighter(hello?.fighter) || 'naruto', play: hello?.play !== false, sim };
    this.members.set(id, m);
    this.queue = this.queue.filter((q) => this.members.has(q)); // ids a restart left behind
    if (m.play) this.queue.push(id);
    this.io.send(id, { t: 'welcome', you: id, room: this.view() });
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
    this.changed();
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
    }
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
    if ('name' in msg) m.name = cleanName(msg.name);
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
  maybeStart() {
    if (this.match || this.queue.length < 2 || this.io.now() < this.nextAt) return;
    const players = this.queue.splice(0, 2);
    const ms = players.map((id) => this.members.get(id));
    this.matchNo++;
    const now = this.io.now();
    this.match = {
      no: this.matchNo,
      players,
      fighters: ms.map((m) => m.fighter),
      names: ms.map((m) => m.name),
      seed: (Math.random() * 4294967296) >>> 0,
      delay: INPUT_DELAY,
      inputs: [new Array(INPUT_DELAY).fill(0), new Array(INPUT_DELAY).fill(0)], // the first `delay` frames are neutral
      fed: -1, // the newest frame sent to spectators
      lastIn: [now, now],
      result: [null, null],
      resultAt: 0,
    };
    this.cut = null;
    for (const id of this.members.keys()) this.sendMatch(id);
  }

  // the match to one member: its setup, and for a spectator every confirmed frame so far (a late joiner fast-forwards)
  sendMatch(id) {
    const M = this.match;
    const you = M.players.indexOf(id);
    this.io.send(id, {
      t: 'start', no: M.no, seed: M.seed, delay: M.delay, you,
      players: M.players.map((p, i) => ({ id: p, name: M.names[i], fighter: M.fighters[i] })),
    });
    if (you >= 0) return;
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

  // the alarm (room.js): a silent player, a result waiting for its pair, the next match's start
  timer() {
    const now = this.io.now(), M = this.match;
    if (M) {
      const quiet = M.lastIn.map((t) => now - t > SILENT_MS);
      if (quiet[0] || quiet[1]) return this.finish(quiet[0] && quiet[1] ? null : quiet[0] ? 1 : 0, 'timeout');
      if (M.resultAt && now >= M.resultAt) return this.finish(M.result[0] ?? M.result[1], 'ko');
      return;
    }
    if (this.queue.length >= 2 && now >= this.nextAt) this.changed();
  }

  // when the alarm must fire next (ms), or null
  nextWake() {
    const now = this.io.now(), M = this.match;
    if (M) return Math.min(now + WATCHDOG_MS, M.resultAt || Infinity);
    if (this.queue.length >= 2 && this.nextAt > now) return this.nextAt;
    return null;
  }

  // ------------------------------------------------------------ room state
  view() {
    const now = this.io.now();
    return {
      members: [...this.members.values()].map((m) => ({ id: m.id, name: m.name, fighter: m.fighter, play: m.play, wins: this.wins[m.id] || 0, streak: this.streak[m.id] || 0 })),
      queue: this.queue.slice(),
      match: this.match ? { no: this.match.no, players: this.match.players.slice(), fighters: this.match.fighters.slice() } : null,
      host: this.members.keys().next().value ?? null,
      nextIn: !this.match && this.queue.length >= 2 ? Math.max(0, this.nextAt - now) : null,
    };
  }

  changed() {
    this.maybeStart();
    const room = this.view();
    for (const id of this.members.keys()) this.io.send(id, { t: 'room', room });
    this.io.save({ queue: this.queue, wins: this.wins, streak: this.streak, matchNo: this.matchNo, nextAt: this.nextAt, live: this.match?.no ?? null });
  }
}
