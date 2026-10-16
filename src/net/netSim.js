// Local rollback test mode (ADR 0036, ENG-093): one browser, one game, and a simulated network in between, so the
// rollback session (rollback.js) can be played and tested before any server exists.
//
// SimLink is the network: what the remote peer sends arrives `latency` frames later (± `jitter`), or never (`loss`).
// SimRemote is the other player's machine: each frame it produces its input `delay` frames ahead (from a CPU brain,
// a second keyboard, or a recorded log), sends every input we haven't acknowledged, and can report state hashes
// for the desync check. startNetSim wires it into a running game from URL parameters:
//   ?fight=naruto,sasuke&mode=solo&net=sim[&lag=6][&jitter=2][&loss=5][&delay=2]   (lag / jitter in frames, loss in %)
// mode=solo: you against a CPU whose inputs cross the simulated network; mode=versus: player 2's keys do.
import { Pad } from '../core/input.js';
import { rng } from '../game/rng.js';
import { RollbackSession, packInput } from './rollback.js';

export class SimLink {
  constructor({ latency = 6, jitter = 0, loss = 0, seed = 1 } = {}) {
    Object.assign(this, { latency, jitter, loss });
    this.R = rng(seed);
    this.now = 0;
    this.queue = []; // [{ at, msg }] from the remote to us
    this.remote = null;
    this.stats = { sent: 0, dropped: 0 };
  }

  // the session's tick (wall-clock time, which keeps going while a side stalls): the remote peer runs, then whatever
  // is due is ready to receive
  pump(tick) {
    this.now = tick;
    this.remote?.tick();
  }

  // ours to the remote (it only reads the acknowledgements, so the way there is instant)
  send(msg) {
    this.remote?.onMessage(msg);
  }

  // the remote's to us, over the simulated network
  deliver(msg) {
    this.stats.sent++;
    if (this.R() < this.loss) { this.stats.dropped++; return; }
    const at = this.now + Math.max(1, this.latency + Math.round((this.R() * 2 - 1) * this.jitter));
    this.queue.push({ at, msg });
  }

  receive() {
    const out = [];
    this.queue = this.queue.filter((q) => (q.at <= this.now ? (out.push(q.msg), false) : true));
    return out;
  }
}

// The other machine. source(frame) -> its packed input for that frame; check(frame) -> its state hash for a frame
// it has confirmed (optional: the test uses a reference run's hashes). It keeps its own frame clock: one frame per
// tick, except that, like our session, it stalls rather than run more than `maxRollback` frames past our newest
// input (our messages reach it at once, so it always knows that).
export class SimRemote {
  constructor(link, { player = 1, delay = 2, maxRollback = 8, source, check = null, checkEvery = 60 }) {
    Object.assign(this, { link, player, delay, maxRollback, source, check, checkEvery });
    this.reset();
    link.remote = this;
  }

  reset() {
    this.frame = 0;
    this.inputs = new Map();
    for (let f = 0; f < this.delay; f++) this.inputs.set(f, 0);
    this.newest = this.delay - 1;
    this.acked = this.delay - 1; // the newest of its inputs we have confirmed
    this.peerNewest = this.delay - 1; // the newest of our inputs it has
    this.checked = -1;
  }

  tick() {
    if (this.frame - this.peerNewest <= this.maxRollback) {
      const f = this.frame + this.delay;
      this.inputs.set(f, this.source(f));
      this.inputs.delete(f - 64);
      this.newest = f;
      this.frame++;
    }
    const start = Math.max(this.acked + 1, this.newest - 15);
    const v = [];
    for (let k = start; k <= this.newest; k++) v.push(this.inputs.get(k) ?? 0);
    this.link.deliver({ t: 'in', from: this.player, start, v, ack: null });
    // its own check for a frame it settled a little while ago (it would only know its hash once confirmed)
    const c = Math.floor((this.frame - 20) / this.checkEvery) * this.checkEvery;
    if (this.check && c >= 0 && c > this.checked) {
      this.checked = c;
      this.link.deliver({ t: 'ck', frame: c, hash: this.check(c) });
    }
  }

  onMessage(msg) {
    if (msg.t !== 'in') return;
    if (msg.ack != null) this.acked = Math.max(this.acked, msg.ack);
    this.peerNewest = Math.max(this.peerNewest, msg.start + msg.v.length - 1);
  }
}

// a CPU brain playing the remote side: it thinks on a pad of its own, and what it pressed becomes the frame's input
function cpuSource(game, p) {
  const shadow = new Pad();
  return () => {
    const f = game.fighters[p], brain = game.brains[p];
    if (!f || !brain) return 0;
    const real = f.pad;
    f.pad = shadow;
    try {
      brain.update(game);
    } finally {
      f.pad = real;
    }
    const b = {};
    for (const a of Object.keys(shadow.b)) b[a] = shadow.b[a].down;
    return packInput(shadow.mx, shadow.my, b);
  };
}

// ?net=sim: start the session on the running game and show its numbers
export function startNetSim(game, qs) {
  const num = (k, d) => (qs.has(k) ? Number(qs.get(k)) : d);
  const opts = { latency: num('lag', 6), jitter: num('jitter', 2), loss: num('loss', 3) / 100, delay: num('delay', 2) };
  const link = new SimLink({ ...opts, seed: (Math.random() * 4294967296) >>> 0 });
  // one device sample per tick (link.now), shared by both sides even when their frame clocks differ
  // (InputManager.sample clears the tapped keys)
  let sampled = -1, sample = [];
  const sampleNow = () => {
    if (link.now !== sampled) { sample = game.input.sample(); sampled = link.now; }
    return sample;
  };
  const local = () => { const s = sampleNow()[0]; return s ? packInput(s.x, s.y, s.b) : 0; };
  const cpu = cpuSource(game, 1);
  const remoteSource = () => {
    if (game.cfg?.mode === 'versus') { const s = sampleNow()[1]; return s ? packInput(s.x, s.y, s.b) : 0; }
    return cpu();
  };
  const remote = new SimRemote(link, { player: 1, delay: opts.delay, maxRollback: 8, source: remoteSource });
  const session = new RollbackSession(game, { link, local, delay: opts.delay, maxRollback: 8 });
  // a match restarts: the remote starts over too
  const reset = session.reset.bind(session);
  session.reset = () => {
    reset();
    remote.reset();
    link.queue = [];
    link.now = 0;
    sampled = -1;
  };
  game.netplay = session;
  showStats(game, session, link, opts);
  console.info(`[net] simulated rollback: lag ${opts.latency}±${opts.jitter} frames, loss ${Math.round(opts.loss * 100)} %, delay ${opts.delay}`);
  return session;
}

function showStats(game, session, link, opts) {
  const el = document.createElement('div');
  el.id = 'net-stats';
  Object.assign(el.style, {
    position: 'fixed', left: '50%', top: '6px', transform: 'translateX(-50%)', zIndex: 50, pointerEvents: 'none',
    font: '11px/1.3 ui-monospace, Menlo, Consolas, monospace', color: '#dfe8ff', background: 'rgba(8,10,18,0.7)',
    padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap',
  });
  document.body.append(el);
  const ms = (f) => Math.round((f * 1000) / 60);
  let last = { ...session.stats }, lastT = performance.now();
  setInterval(() => {
    const s = session.stats, now = performance.now(), sec = (now - lastT) / 1000;
    const rb = ((s.rollbacks - last.rollbacks) / sec).toFixed(1);
    el.textContent = `NET SIM · ping ${ms(opts.latency * 2)}±${ms(opts.jitter)} ms · loss ${Math.round(opts.loss * 100)}% · delay ${opts.delay}f · `
      + `rollbacks ${rb}/s (max ${s.maxDepth}f) · stalls ${s.stalls}`; // no desync check: one simulation (det.netplay has it)
    last = { ...s };
    lastT = now;
  }, 500);
}
