// Rollback netcode (ADR 0036, ENG-093), GGPO-style and transport-agnostic.
//
// A player's input for one frame is one packed number (packInput: the stick quantized to signed 8 bits per axis,
// the seven buttons as bits), so it fits a wire message and every machine applies exactly the same values. Local
// inputs are scheduled `delay` frames ahead and sent at once, unacknowledged ones repeated in every message so a
// lost packet costs nothing. A remote input that hasn't arrived is predicted (the last one received, repeated). When
// the real one arrives and differs from what was used, the session restores the state saved before that frame and
// re-simulates up to the present quietly (Game.quiet: nothing drawn or heard twice). It never runs more than
// `maxRollback` frames past the newest remote input: past that it stalls a frame, which is also how two machines
// keep pace. Time sync: each message carries the sender's frame advantage (how far its frame is past the newest
// frame it has heard of from the other side); a side whose advantage is clearly bigger than the other's waits half
// the difference, so a machine that started a little earlier doesn't make the other roll back on every frame.
// Every `checkEvery` frames both sides exchange the state hash of a frame they have both confirmed; a different
// hash is a desync.
//
// The link is anything with send(msg), receive() -> [msg] and optionally pump(tick) (netSim.js simulates one; the
// lobby server's relay will be another, ENG-094).
import { ACTIONS } from '../core/input.js';
import { hashSim } from './simHash.js';

const SYNC_EVERY = 60; // ticks between time-sync checks
const q8 = (v) => Math.max(-127, Math.min(127, Math.round(v * 127)));
const s8 = (b) => (b << 24) >> 24;

// stick (screen right / up, -1..1) and buttons ({ light: true, ... }) -> one 23-bit number
export function packInput(x, y, b) {
  let bits = 0;
  ACTIONS.forEach((a, j) => { if (b?.[a]) bits |= 1 << j; });
  return (q8(x || 0) & 0xff) | ((q8(y || 0) & 0xff) << 8) | (bits << 16);
}

// a Pad's frame from a packed input: the same writes as InputManager.poll, so buffers and double taps follow
export function applyInput(pad, v) {
  pad.tick();
  pad.setMove(s8(v & 0xff) / 127, s8((v >> 8) & 0xff) / 127);
  ACTIONS.forEach((a, j) => pad.set(a, !!((v >> (16 + j)) & 1)));
}

// the six group hashes of one frame folded into one (the same fold as the determinism test's per-frame hashes)
export const foldHash = (H) => { let c = 0x811c9dc5; for (let g = 0; g < H.length; g++) c = Math.imul(c ^ H[g], 0x01000193) >>> 0; return c; };

export class RollbackSession {
  // local: (player, frame) -> packed input for a local player. remote: the indexes of the remote players.
  // hashEvery: also keep the hash of every n-th frame (1 = all, for tests); checkEvery: the desync check.
  constructor(game, { link, local, localPlayers = [0], remotePlayers = [1], delay = 2, maxRollback = 8, checkEvery = 60, hashEvery = 0, onDesync = null }) {
    Object.assign(this, { game, link, local, localPlayers, remotePlayers, delay, maxRollback, checkEvery, hashEvery, onDesync });
    this.reset();
  }

  // a new match (Game.startMatch): frame 0, nothing received yet; the first `delay` frames of everyone are neutral
  reset() {
    const n = this.localPlayers.length + this.remotePlayers.length;
    this.inputs = Array.from({ length: n }, () => new Map());
    this.lastConf = new Array(n).fill(this.delay - 1); // the newest frame up to which a player's inputs are all known
    for (const map of this.inputs) for (let f = 0; f < this.delay; f++) map.set(f, 0);
    this.used = Array.from({ length: n }, () => new Map()); // what a remote player's frames were simulated with
    this.states = new Map(); // frame -> the state saved before simulating it
    this.hashes = new Map(); // frame -> its state hash after simulating it (the latest simulation of it)
    this.sentChecks = new Set();
    this.remoteChecks = new Map(); // frame -> the hash the other side reported
    this.ackedByRemote = this.delay - 1; // the newest of our inputs the other side has confirmed
    this.cur = new Array(n).fill(0);
    this.ticks = 0;
    this.remoteFrame = -1; // the other side's newest frame we know of (its newest input, less its delay)
    this.remoteAdv = null; // its frame advantage, as it last reported it
    this.syncWait = 0; // frames left to wait for the other side (time sync)
    this.stats = { frames: 0, rollbacks: 0, resimFrames: 0, maxDepth: 0, stalls: 0, syncWaits: 0, predicted: 0, missed: 0, desyncs: 0, checks: 0, lost: 0 };
  }

  remoteConfirmed() {
    let m = Infinity;
    for (const r of this.remotePlayers) m = Math.min(m, this.lastConf[r]);
    return m;
  }

  // One tick of the game's fixed clock: send, receive, rewind if a prediction was wrong, then simulate the next
  // frame (or stall). Returns whether a frame ran.
  tick() {
    const g = this.game, now = g.frameNo;
    this.ticks++; // wall-clock ticks: they keep counting while we stall (not inside pump?.(): skipped without one)
    this.link.pump?.(this.ticks);
    for (const p of this.localPlayers) {
      const f = now + this.delay;
      if (!this.inputs[p].has(f)) {
        this.inputs[p].set(f, this.local(p, f));
        this.lastConf[p] = f;
        this.inputs[p].delete(f - 4 * (this.maxRollback + this.delay) - 16); // past any rewind and any resend
      }
    }
    this.sendInputs();
    let rewind = Infinity;
    for (const msg of this.link.receive()) rewind = Math.min(rewind, this.receive(msg, now));
    if (rewind < now) this.rewind(rewind, now);
    this.sendChecks();
    if (this.ticks % SYNC_EVERY === 0 && this.remoteAdv != null && this.remoteFrame >= 0) {
      const diff = this.advantage() - this.remoteAdv;
      if (diff >= 2) this.syncWait = Math.min(this.maxRollback, diff >> 1);
    }
    if (this.syncWait > 0) {
      this.syncWait--;
      this.stats.syncWaits++;
      return false;
    }
    if (now - this.remoteConfirmed() > this.maxRollback) {
      this.stats.stalls++;
      return false;
    }
    this.simulate(now);
    this.stats.frames++;
    return true;
  }

  // how far our frame is past the newest frame of the other side's we know of (includes the one-way latency, which
  // the other side's figure includes too, so the difference of the two is twice the head start)
  advantage() {
    return this.remoteFrame < 0 ? 0 : this.game.frameNo - this.remoteFrame;
  }

  // the frame's input for every player: real when known, else the remote's last real one again
  inputFor(p, f) {
    const v = this.inputs[p].get(f);
    if (v !== undefined) return v;
    return this.inputs[p].get(this.lastConf[p]) ?? 0;
  }

  simulate(f) {
    const g = this.game;
    this.states.set(f, g.saveState());
    this.states.delete(f - this.maxRollback - this.delay - 2);
    for (let p = 0; p < this.cur.length; p++) {
      this.cur[p] = this.inputFor(p, f);
      if (this.remotePlayers.includes(p)) {
        this.used[p].set(f, this.cur[p]);
        this.used[p].delete(f - 4 * (this.maxRollback + this.delay));
        if (f > this.lastConf[p]) this.stats.predicted++;
      }
    }
    g.fixedUpdate(); // Game.stepWorld calls applyInputs for this frame
    if ((this.hashEvery && f % this.hashEvery === 0) || f % this.checkEvery === 0) this.hashes.set(f, foldHash(hashSim(g)));
  }

  // Game.stepWorld: the pads get this frame's inputs instead of the devices and brains
  applyInputs(game) {
    game.pads.forEach((pad, p) => applyInput(pad, this.cur[p]));
  }

  // restore the state before frame `from` and run the frames up to `now` again, quietly, with what is known now
  rewind(from, now) {
    const S = this.states.get(from);
    if (!S) { this.stats.lost++; return; } // older than the window: cannot happen while maxRollback holds
    const g = this.game;
    g.loadState(S);
    g.quiet(() => { for (let f = from; f < now; f++) this.simulate(f); });
    this.stats.rollbacks++;
    this.stats.resimFrames += now - from;
    this.stats.maxDepth = Math.max(this.stats.maxDepth, now - from);
  }

  // Our unacknowledged inputs (a few frames at most), the newest we have of theirs (so they can drop theirs), and
  // nothing else: a message lost on the way is covered by the next.
  sendInputs() {
    for (const p of this.localPlayers) {
      const start = Math.max(this.ackedByRemote + 1, this.lastConf[p] - 15);
      const v = [];
      for (let f = start; f <= this.lastConf[p]; f++) v.push(this.inputs[p].get(f) ?? 0);
      this.link.send({ t: 'in', from: p, start, v, ack: this.remoteConfirmed(), adv: this.advantage() });
    }
  }

  // a message from the other side; returns the earliest frame whose prediction it proved wrong (Infinity: none)
  receive(msg, now) {
    let wrong = Infinity;
    if (msg.t === 'in' && this.remotePlayers.includes(msg.from)) {
      const p = msg.from, map = this.inputs[p];
      msg.v.forEach((v, k) => {
        const f = msg.start + k;
        if (map.has(f)) return;
        map.set(f, v);
        const was = this.used[p].get(f);
        if (f < now && was !== undefined && was !== v) {
          wrong = Math.min(wrong, f);
          this.stats.missed++;
        }
      });
      while (map.has(this.lastConf[p] + 1)) this.lastConf[p]++;
      this.remoteFrame = Math.max(this.remoteFrame, msg.start + msg.v.length - 1 - this.delay);
      if (Number.isFinite(msg.adv)) this.remoteAdv = msg.adv;
      for (const f of map.keys()) if (f < this.lastConf[p] - 4 * (this.maxRollback + this.delay)) map.delete(f);
      if (msg.ack != null) this.ackedByRemote = Math.max(this.ackedByRemote, msg.ack);
    } else if (msg.t === 'ck') this.remoteChecks.set(msg.frame, msg.hash);
    return wrong;
  }

  // hashes of frames both sides have confirmed: send ours, compare theirs
  sendChecks() {
    const done = this.remoteConfirmed();
    for (const [f, h] of this.hashes) {
      if (f > done) continue;
      if (f % this.checkEvery === 0 && !this.sentChecks.has(f)) {
        this.sentChecks.add(f);
        this.link.send({ t: 'ck', frame: f, hash: h });
      }
      const theirs = this.remoteChecks.get(f);
      if (theirs !== undefined) {
        this.remoteChecks.delete(f);
        this.stats.checks++;
        if (theirs !== h) {
          this.stats.desyncs++;
          this.onDesync?.(f, h, theirs);
        }
      }
    }
    if (!this.hashEvery) for (const f of this.hashes.keys()) if (f < done - 4 * this.checkEvery) this.hashes.delete(f); // their check may still come
  }
}
