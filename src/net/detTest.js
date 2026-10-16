// Determinism test for online play (ADR 0036; debug only, loaded with ?debug or ?det=<log>). Rollback netcode
// replays the same inputs on two machines and needs the same fight on both. record() plays a CPU vs CPU match and
// keeps, frame by frame, both pads' inputs (after the brains wrote them) and the simulation hashes (simHash.js).
// replay() plays those inputs back with the brains switched off and reports the first frame where the two runs
// disagree, and in which part of the state. Replays can run at another render rate (120 / 144 Hz, uneven frame
// times) to show what still depends on wall-clock time; a saved log (public/det/<name>.json) replays in another
// browser or on a phone against the reference hashes. Every replay also times the fixed step: a rollback pays it
// once per re-simulated frame.
import { ACTIONS } from '../core/input.js';
import { rng } from '../game/rng.js';
import { GROUPS, hashSim, hashKeys, dumpSim, diffDumps, hashString } from './simHash.js';
import { RollbackSession, packInput, applyInput, foldHash } from './rollback.js';
import { SimLink, SimRemote } from './netSim.js';
import { LobbyClient, lobbyUrl, newCode } from './lobby.js';
import { SpectateSession } from './spectate.js';

// this build's simulation fingerprint (vite.config.js simId): a fixture recorded on another one is stale
const SIM = import.meta.env.SIM_ID ?? null;
const EVERY = 30; // a saved log keeps the chained group hashes every 30 frames: another browser places a split within 30
const NG = GROUPS.length;

const yieldNow = () => new Promise((r) => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });

// the render rates a replay can run at: one frame() per simulation step, more (a 120 or 144 Hz screen), or uneven
// frame times averaging 60 Hz, as in a real browser
function dtSource(mode, seed = 99) {
  if (mode === '120') return () => 1 / 120;
  if (mode === '144') return () => 1 / 144;
  if (mode === 'jitter') { const r = rng(seed); return () => (1 / 60) * (0.55 + 0.9 * r()); }
  return () => 1 / 60;
}

const artPrint = (asset) => ({ source: asset.source ?? '?', meta: hashString(JSON.stringify(asset.meta)).toString(16) });
const probe = (g) => g.fighters.flatMap((f) => [f.pos.x, f.pos.y, f.pos.z, f.hp]);
// the six group hashes of one frame folded into one (a saved log keeps one per frame)
const combine = (H) => { let c = 0x811c9dc5; for (let g = 0; g < H.length; g++) c = Math.imul(c ^ H[g], 0x01000193) >>> 0; return c; };
const hex = (u32s) => Array.from(u32s, (x) => x.toString(16).padStart(8, '0')).join('');
const unhex = (s) => Uint32Array.from({ length: s.length / 8 }, (_, i) => parseInt(s.slice(i * 8, i * 8 + 8), 16));

function stats(a) {
  if (!a.length) return null;
  const s = Float64Array.from(a).sort(), q = (p) => +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(3);
  return { n: s.length, avg: +(s.reduce((x, y) => x + y, 0) / s.length).toFixed(3), p50: q(0.5), p95: q(0.95), p99: q(0.99), max: +s[s.length - 1].toFixed(3) };
}

// A fresh match from the log's settings, intro skipped. Returns the frame counter it starts from (0: startMatch resets
// it). No workarounds any more (ENG-091): the simulation owns its control basis, counts frames and uses deterministic
// math, so the camera, the render clock and the frame rate can be anything.
function startRun(game, cfg) {
  window.__manualStep = true; // the rAF loop must not step the game behind our back
  game.startMatch({ ...cfg });
  game.skipIntro();
  return { f0: game.frameNo, done: () => {} };
}

// Runs `after(k)` after every fixed step (k = 0 for the first step of the run) and times the step itself.
function hookStep(game, f0, after, timing) {
  const own = Object.hasOwn(game, 'fixedUpdate'), orig = game.fixedUpdate;
  game.fixedUpdate = function () {
    const t0 = performance.now();
    orig.call(this);
    timing.push(performance.now() - t0);
    after(this.frameNo - f0 - 1);
  };
  // put back exactly what was there: an own copy of the prototype's method would hide later patches of Game.prototype
  return () => { if (own) game.fixedUpdate = orig; else delete game.fixedUpdate; };
}

// Both pads, frame k, from the recorded changes: the same writes a brain or InputManager.poll makes (tick, stick,
// buttons), so the pads' own derived state (buffers, double taps) is rebuilt rather than copied.
// The log's inputs as packed per-frame values (rollback.js packInput), the first `neutral` frames left at rest: what a
// rollback session sends and applies, so a straight replay of this table is the reference a netplay run must equal.
function packedInputs(inputs, frames, neutral = 0) {
  return inputs.map((L) => {
    const out = new Array(frames + 64).fill(0);
    let j = 0, cur = 0;
    for (let k = 0; k < out.length; k++) {
      while (j < L.length && L[j][0] <= k) {
        const [, mx, my, bits] = L[j++], b = {};
        ACTIONS.forEach((a, i) => { b[a] = !!(bits & (1 << i)); });
        cur = packInput(mx, my, b);
      }
      out[k] = k < neutral ? 0 : cur;
    }
    return out;
  });
}

function makeFeed(inputs) {
  const ptr = [0, 0], cur = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
  return (game, k) => {
    for (let i = 0; i < 2; i++) {
      const L = inputs[i];
      while (ptr[i] < L.length && L[ptr[i]][0] <= k) cur[i] = L[ptr[i]++];
      const [, mx, my, bits, dash] = cur[i], p = game.pads[i];
      p.tick();
      p.setMove(mx, my);
      if (!dash) p.dashDir = null; // the brains never double-tap dash (they clear it after the stick)
      ACTIONS.forEach((a, j) => p.set(a, !!(bits & (1 << j))));
    }
  };
}

let ui = null;
function show(text) {
  if (!ui) {
    ui = document.createElement('pre');
    ui.id = 'det-overlay';
    Object.assign(ui.style, {
      position: 'fixed', left: '8px', top: '8px', right: '8px', zIndex: 99999, margin: 0, padding: '12px', maxHeight: '90vh', overflow: 'auto',
      background: 'rgba(10,12,20,0.92)', color: '#e8f0ff', font: '12px/1.45 ui-monospace, Menlo, Consolas, monospace', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', borderRadius: '8px',
    });
    document.body.append(ui);
  }
  ui.textContent = text;
}

export function install(game, ready, qs) {
  // record({ p1, p2, level, seed, maxFrames, name, dumpAt }): a CPU vs CPU match (Math.random seeded, so the
  // same seed records the same match again in this browser). The log's per-frame hashes stay in memory (log.per) for
  // same-page replays, and log.dump holds dumpSim() after frame dumpAt.
  async function record({ p1 = 'naruto', p2 = 'sasuke', level = 'impossible', seed = 7, maxFrames = 20000, name = null, dumpAt = null } = {}) {
    const realRandom = Math.random;
    Math.random = rng(seed);
    const cfg = { mode: 'cpu', p1, p2, level, seed }, test = {};
    const { f0, done } = startRun(game, cfg, test);
    let dump = null;
    const inputs = [[], []], last = [null, null], stick = [[0, 0], [0, 0]];
    // the stick as the brain gave it, before Pad.setMove normalizes it: replaying the normalized value would normalize
    // it twice, and a length of 1.0000000000000002 rescales it (online, the wire carries the raw stick too)
    game.pads.forEach((p, i) => {
      const setMove = p.setMove;
      p.setMove = function (x, y) { stick[i][0] = x; stick[i][1] = y; return setMove.call(this, x, y); };
    });
    game.brains.forEach((b, i) => {
      const think = b.update;
      b.update = function (g) {
        think.call(this, g);
        const p = g.pads[i];
        let bits = 0;
        ACTIONS.forEach((a, j) => { if (p.b[a].down) bits |= 1 << j; });
        const rec = [g.frameNo - f0 - 1, stick[i][0], stick[i][1], bits, p.dashDir ? 1 : 0], L = last[i];
        if (!L || L[1] !== rec[1] || L[2] !== rec[2] || L[3] !== rec[3] || L[4] !== rec[4]) { inputs[i].push(rec); last[i] = rec; }
      };
    });
    const per = [], H = new Uint32Array(NG), chain = new Uint32Array(NG), checks = [], probes = [], timing = [], frameH = [];
    let frames = 0;
    const unhook = hookStep(game, f0, (k) => {
      hashSim(game, H);
      for (let g = 0; g < NG; g++) { chain[g] = (Math.imul(chain[g], 31) + H[g]) >>> 0; per.push(H[g]); }
      frameH.push(combine(H));
      if (k % EVERY === EVERY - 1) { checks.push(...chain); probes.push(probe(game)); }
      if (k === dumpAt) dump = dumpSim(game);
      frames = k + 1;
    }, timing);
    try {
      let it = 0;
      while (game.state !== 'results' && frames < maxFrames) {
        game.frame(1 / 60);
        if (++it % 240 === 0) await yieldNow();
      }
    } finally {
      unhook();
      done();
      Math.random = realRandom;
    }
    const log = {
      v: 1, name, made: new Date().toISOString(), ua: navigator.userAgent, sim: import.meta.env.SIM_ID, cfg, test, frames, every: EVERY, groups: GROUPS,
      result: { winner: game.roundWinner?.index ?? null, rounds: game.round, wins: game.fighters.map((f) => f.wins), hp: game.fighters.map((f) => f.hp) },
      art: game.assets.map(artPrint), inputs, checks: hex(checks), frameHashes: hex(frameH), probes, step: stats(timing),
    };
    Object.defineProperty(log, 'per', { value: Uint32Array.from(per), enumerable: false });
    Object.defineProperty(log, 'dump', { value: dump, enumerable: false });
    det.last = log;
    return log;
  }

  // replay(log, { dt: '60' | '120' | '144' | 'jitter', stopAt, dumpAt, noDraw }): the log's inputs, brains off.
  // Compares every frame against log.per when the log was recorded in this page, else the saved checkpoints.
  // dumpAt: also return dumpSim() right after that frame. noDraw skips the GPU draw (the camera still updates).
  // ref: per-frame hashes to compare against instead (another replay's `per`, kept with keepPer). randomSeed: the
  // Math.random sequence (by default another one than the recording's: a draw that reaches the simulation shows).
  // onStep(k): called after every step; returning true stops the replay there.
  // rollback: { every, depth } turns the replay into a rollback stress test (ADR 0036): after every `every` frames it
  // saves the state, plays `depth` frames on wrong inputs (a misprediction), restores, and re-simulates them quietly
  // on the right ones, the way rollback netcode will; every frame is still checked against the recording.
  async function replay(log, { dt = '60', stopAt = log.frames, dumpAt = null, noDraw = false, onProgress = null,
    ref: refPer = null, keepPer = false, randomSeed = (log.cfg.seed ^ 0x5bd1e995) >>> 0, onStep = null, rollback = null, packed = null } = {}) {
    const realRandom = Math.random;
    Math.random = rng(randomSeed);
    const { f0, done } = startRun(game, log.cfg);
    game.brains = [null, null]; // the match setup (Game.kinds) still says both sides are CPUs, as when it was recorded
    game.director = null;
    const art = game.assets.map(artPrint);
    // packed: per-player packed inputs (packedInputs) applied the way a rollback session does, instead of the log's
    const feed = packed ? (g, k) => g.pads.forEach((pad, i) => applyInput(pad, packed[i][k] ?? 0)) : makeFeed(log.inputs);
    const poll = game.input.poll, draw = game.renderer.render;
    game.input.poll = () => feed(game, game.frameNo - f0 - 1);
    if (noDraw) game.renderer.render = () => {};
    const ref = refPer ?? log.per ?? null, checks = ref ? null : unhex(log.checks), fh = !ref && log.frameHashes ? unhex(log.frameHashes) : null;
    const H = new Uint32Array(NG), chain = new Uint32Array(NG), timing = [], drawT = [], per = keepPer ? [] : null;
    let frames = 0, first = null, dump = null, halt = false, exact = null;
    const groupsAt = (a, b) => GROUPS.filter((_, g) => a[g] !== b[g]);
    const check = (k) => {
      hashSim(game, H);
      for (let g = 0; g < NG; g++) chain[g] = (Math.imul(chain[g], 31) + H[g]) >>> 0;
      if (per) per.push(...H);
      if (fh && exact === null && k < fh.length && combine(H) !== fh[k]) exact = k; // a saved log's per-frame hash: the exact frame
      if (!first && ref && (k + 1) * NG <= ref.length) {
        const R = ref.subarray(k * NG, k * NG + NG);
        if (H.some((h, g) => h !== R[g])) first = { frame: k, groups: groupsAt(H, R) };
      }
      if (!first && checks && k % EVERY === EVERY - 1) {
        const c = (k + 1) / EVERY - 1, R = checks.subarray(c * NG, c * NG + NG);
        if (c * NG < checks.length && chain.some((h, g) => h !== R[g])) first = { frame: exact ?? undefined, window: [k - EVERY + 1, k], groups: groupsAt(chain, R), probe: { ref: log.probes[c], here: probe(game) } };
      }
      if (k === dumpAt) dump = dumpSim(game);
      if (onStep?.(k)) halt = true;
      frames = k + 1;
    };
    // the rollback stress test: wrong inputs from a seeded stream (stick and buttons at random)
    const R = rng(0xbadc0de), rb = { n: 0, save: [], load: [], resim: [] };
    const guess = () => {
      for (const p of game.pads) {
        p.tick();
        p.setMove(Math.round(R() * 2 - 1), Math.round(R() * 2 - 1));
        ACTIONS.forEach((a) => p.set(a, R() < 0.15));
      }
    };
    const realStep = () => Object.getPrototypeOf(game).fixedUpdate.call(game); // the real step, not the timing hook
    const rewind = () => {
      const { depth } = rollback;
      let t = performance.now();
      const S = game.saveState();
      rb.save.push(performance.now() - t);
      game.input.poll = guess;
      for (let i = 0; i < depth; i++) realStep(); // predicted frames: played and shown as usual
      t = performance.now();
      game.loadState(S);
      rb.load.push(performance.now() - t);
      game.input.poll = () => feed(game, game.frameNo - f0 - 1);
      t = performance.now();
      game.quiet(() => { for (let i = 0; i < depth; i++) { realStep(); check(game.frameNo - f0 - 1); } });
      rb.resim.push(performance.now() - t);
      rb.n++;
    };
    const unhook = hookStep(game, f0, (k) => {
      check(k);
      if (rollback && !first && (k + 1) % rollback.every === 0 && k + 1 + rollback.depth < stopAt && game.state !== 'results') rewind();
    }, timing);
    const render = game.render;
    game.render = function (d) { const t0 = performance.now(); render.call(this, d); drawT.push(performance.now() - t0); };
    const next = dtSource(dt);
    try {
      let it = 0;
      while (frames < stopAt && game.state !== 'results' && !halt) {
        game.frame(next());
        if (++it % 120 === 0) { onProgress?.(frames, log.frames, first); await yieldNow(); }
      }
    } finally {
      unhook();
      done();
      game.render = render;
      game.input.poll = poll;
      game.renderer.render = draw;
      Math.random = realRandom;
    }
    if (!first && exact !== null) first = { frame: exact, groups: [] }; // split after the last checkpoint
    const step = stats(timing);
    // 8 consecutive steps (a rollback's worth): their summed time is still meaningful where the timer is coarse
    // (Safari rounds performance.now() to 1 ms, so one step reads 0 or 1)
    const burst = [];
    for (let i = 8; i <= timing.length; i++) { let s = 0; for (let j = i - 8; j < i; j++) s += timing[j]; burst.push(s); }
    const tick = timing.reduce((m, t) => (t > 0 && t < m ? t : m), Infinity);
    return {
      dt, frames, of: log.frames, match: !first && frames >= Math.min(stopAt, log.frames), first, dump, per: per && Uint32Array.from(per),
      art: { same: JSON.stringify(art) === JSON.stringify(log.art), here: art, ref: log.art },
      step, frame: stats(drawT), rollback8: step && +(8 * step.p95).toFixed(2), burst8: stats(burst), timerMs: Number.isFinite(tick) ? +tick.toFixed(3) : null,
      result: { winner: game.roundWinner?.index ?? null, rounds: game.round, hp: game.fighters.map((f) => f.hp) },
      rollback: rollback && { ...rollback, n: rb.n, save: stats(rb.save), load: stats(rb.load), resim: stats(rb.resim) },
    };
  }

  // netplay(log, { delay, latency, jitter, loss, seed, localPlayer, maxRollback, startAt }): the log's two players through a
  // rollback session (rollback.js) over a simulated network (netSim.js): one is local, the other's inputs arrive
  // `latency` ± `jitter` frames late or not at all (`loss`). Every frame's final state must equal a straight replay of
  // the same packed inputs, and the remote's hash reports (the desync check) must all agree. tamper: a frame from
  // which the remote reports hashes of a different input (its jump pressed): the desync check must catch it.
  // startAt: the other machine starts that many ticks late; time sync must even the two out.
  async function netplay(log, { delay = 2, latency = 6, jitter = 2, loss = 0.05, seed = 1, localPlayer = 0, maxRollback = 8, startAt = 0, onProgress = null, tamper = null } = {}) {
    const table = packedInputs(log.inputs, log.frames, delay);
    const ref = await replay(log, { packed: table, keepPer: true, noDraw: true, ref: new Uint32Array(0) }); // nothing to compare: it is the reference
    const refFold = [];
    for (let k = 0; (k + 1) * NG <= ref.per.length; k++) refFold.push(foldHash(ref.per.subarray(k * NG, k * NG + NG)));
    const realRandom = Math.random;
    Math.random = rng((log.cfg.seed ^ 0x9e3779b9) >>> 0);
    startRun(game, log.cfg);
    game.brains = [null, null];
    game.director = null;
    const remotePlayer = 1 - localPlayer, link = new SimLink({ latency, jitter, loss, seed });
    const source = (f) => (table[remotePlayer][f] ?? 0) ^ (tamper != null && f === tamper ? 1 << (16 + ACTIONS.indexOf('jump')) : 0);
    new SimRemote(link, { player: remotePlayer, delay, maxRollback, source, check: (f) => refFold[f], checkEvery: 60, startAt });
    const session = new RollbackSession(game, { link, local: (p, f) => table[p][f] ?? 0, localPlayers: [localPlayer], remotePlayers: [remotePlayer], delay, maxRollback, hashEvery: 1 });
    const draw = game.renderer.render;
    game.renderer.render = () => {};
    game.netplay = session;
    try {
      let it = 0;
      while (game.frameNo < ref.frames && game.state !== 'results' && it < ref.frames * 3) {
        game.frame(1 / 60);
        if (++it % 120 === 0) { onProgress?.(game.frameNo, ref.frames); await yieldNow(); }
      }
    } finally {
      game.netplay = null;
      game.renderer.render = draw;
      Math.random = realRandom;
    }
    const done = Math.min(session.remoteConfirmed(), game.frameNo - 1);
    let first = null, compared = 0;
    for (let f = 0; f <= done; f++) {
      const h = session.hashes.get(f);
      if (h === undefined || refFold[f] === undefined) continue;
      compared++;
      if (h !== refFold[f]) { first = f; break; }
    }
    return {
      match: first === null && session.stats.desyncs === 0 && compared > 0.9 * ref.frames, first, compared,
      frames: game.frameNo, of: ref.frames, net: { latency, jitter, loss, delay, maxRollback }, stats: { ...session.stats }, link: { ...link.stats },
    };
  }

  // online(log, { lobby, frames }): the real lobby server end to end (ENG-094; `npm run lobby` locally). Three sockets
  // join a fresh room: a spectator, this game as player 1 (RollbackSession over the lobby link) and a bot as player 2
  // (SimRemote playing the log's second pad over its own socket). The intro is played, as online. Every frame of this
  // game must equal the same inputs replayed straight through a spectator session, the bot's hash reports must agree
  // (the desync check, through the server), and the spectator's feed must be exactly the inputs both players sent.
  async function online(log, { lobby = lobbyUrl(), frames = 3000, onProgress = null } = {}) {
    if (!lobby) throw new Error('no lobby server: run npm run lobby, or pass { lobby: "ws://..." }');
    const N = Math.min(frames, log.frames);
    const cfg = { mode: 'online', p1: log.cfg.p1, p2: log.cfg.p2 };
    const draw = game.renderer.render;
    game.renderer.render = () => {};
    window.__manualStep = true;
    const sockets = [];
    try {
      // the room: a spectator first, then us (player 1), then the bot (player 2): the server starts the match
      const code = newCode(), sim = import.meta.env.SIM_ID || 'dev';
      const feed = [[], []], closed = [];
      let start = null, botStart = null, ended = null;
      const connect = (hello, on) => new Promise((resolve, reject) => {
        const c = new LobbyClient(lobby, code, {
          ...on,
          open: () => c.send({ t: 'hello', sim, rtt: c.rtt, ...hello }),
          welcome: () => resolve(c),
          error: (m) => reject(new Error(m.text)),
          close: (e) => { closed.push(`${hello.name} ${e.code}`); reject(new Error('closed ' + e.code)); },
        });
        sockets.push(c);
      });
      await connect({ name: 'Watcher', fighter: cfg.p1, play: false }, {
        feed: (m) => m.a.forEach((v, k) => { if (m.start + k === feed[0].length) { feed[0].push(v); feed[1].push(m.b[k]); } }),
      });
      const A = await connect({ name: 'Det A', fighter: cfg.p1 }, { start: (m) => { start = m; }, end: (m) => { ended = m; } });
      let remote = null;
      const botLink = { deliver: (msg) => B.send(msg), remote: null };
      const B = await connect({ name: 'Det B', fighter: cfg.p2 }, { start: (m) => { botStart = m; } });
      B.inbox = { push: (m) => { if (m.t === 'in') remote?.onMessage(m); } }; // the bot reads our inputs at once
      for (let i = 0; !(start && botStart) && i < 200; i++) await new Promise((r) => setTimeout(r, 10));
      if (!start || start.you !== 0 || botStart.you !== 1) throw new Error('the match did not start as expected');

      // the reference, now that the server picked the input delay (the neutral frames at the start): the same inputs
      // straight through, as a spectator would play them
      const delay = start.delay;
      const table = packedInputs(log.inputs, N + 600, delay);
      game.netplay = null;
      game.startMatch({ ...cfg, spectate: true });
      const ref = new SpectateSession(game);
      ref.feed(0, table[0], table[1]);
      game.netplay = ref;
      const refFold = [];
      for (let f = 0; f < N; f++) {
        ref.simulate();
        refFold.push(foldHash(hashSim(game)));
        if (f % 600 === 0) await yieldNow();
      }
      game.netplay = null;

      game.startMatch({ ...cfg, spectate: false });
      const session = new RollbackSession(game, { link: A.matchLink(), local: (p, f) => table[p][f] ?? 0, localPlayers: [0], remotePlayers: [1], delay, hashEvery: 1 });
      remote = new SimRemote(botLink, { player: 1, delay, maxRollback: 8, source: (f) => table[1][f] ?? 0, check: (f) => refFold[f], checkEvery: 60 });
      game.netplay = session;
      // real time, 60 ticks a second: the server holds each socket to a real client's message rate. Like Game.frame
      // (which clamps a long frame to 0.1 s), a stall of this page (a hidden tab) is not made up in a burst.
      const t0 = performance.now();
      let due = t0;
      for (let it = 0; game.frameNo < N && it < N * 3 && !ended; it++) {
        due = Math.max(due + 1000 / 60, performance.now() - 100);
        do await yieldNow(); while (performance.now() < due); // the sockets deliver meanwhile
        remote.tick();
        game.frame(1 / 60);
        if (it % 120 === 0) onProgress?.(game.frameNo, N);
      }
      const ms = performance.now() - t0;
      const done = Math.min(session.remoteConfirmed(), game.frameNo - 1);
      let first = null, compared = 0;
      for (let f = 0; f <= done; f++) {
        const h = session.hashes.get(f);
        if (h === undefined) continue;
        compared++;
        if (h !== refFold[f]) { first = f; break; }
      }
      await new Promise((r) => setTimeout(r, 300)); // the last feed batches
      let feedFirst = null;
      for (let f = 0; f < feed[0].length; f++) if (feed[0][f] !== table[0][f] || feed[1][f] !== table[1][f]) { feedFirst = f; break; }
      const stats = { ...session.stats };
      return {
        match: first === null && stats.desyncs === 0 && compared > 0.9 * N && feedFirst === null && feed[0].length > 0.8 * N && !ended,
        first, compared, frames: game.frameNo, of: N, seconds: +(ms / 1000).toFixed(1), stats,
        feed: { frames: feed[0].length, first: feedFirst }, ended, closed, rtt: A.rtt, delay, ids: { A: start.players[0].id, B: start.players[1].id },
      };
    } finally {
      for (const c of sockets) c.close();
      game.netplay = null;
      game.renderer.render = draw;
    }
  }

  // bot(code, { name, fighter, play, style, auto }): a stand-in member for trying the online screens alone (ENG-094).
  // It joins the room and, when it plays, sends inputs like a real peer (SimRemote: its own 60 Hz clock and stall rule)
  // without running a game: 'idle' stands still, 'mash' walks in and attacks. It never reports a result, so a KO ends
  // after the server's result wait. auto: false leaves its ticks to the caller (handle.tick(): a hidden page throttles
  // timers). Returns { client, tick(), close() }.
  function bot(code, { name = 'Bot', fighter = 'sasuke', play = true, style = 'mash', auto = true, lobby = lobbyUrl() } = {}) {
    let remote = null, timer = null;
    const link = { deliver: (msg) => client.send(msg), remote: null };
    const stop = () => { clearInterval(timer); remote = null; };
    const client = new LobbyClient(lobby, code, {
      open: () => client.send({ t: 'hello', name, fighter, play, sim: import.meta.env.SIM_ID || 'dev', rtt: client.rtt }),
      start: (m) => {
        stop();
        if (m.you < 0) return;
        const toward = m.you === 0 ? 1 : -1;
        const source = (f) => (style === 'idle' ? 0 : packInput(f % 150 < 70 ? toward : 0, 0, { light: f % 12 < 3, heavy: f % 97 < 3, jump: f % 211 < 3 }));
        remote = new SimRemote(link, { player: m.you, delay: m.delay, maxRollback: 8, source });
        if (auto) timer = setInterval(() => remote?.tick(), 1000 / 60);
      },
      end: stop,
    });
    client.inbox = { push: (m) => { if (m.t === 'in') remote?.onMessage(m); } };
    return { client, tick: () => remote?.tick(), close: () => { stop(); client.close(); }, get remote() { return remote; } };
  }

  // Two replays of the same inputs, the second at another render rate (`dt`) and/or another Math.random sequence
  // (`randomSeed`). Replays repeat themselves exactly (the recording doesn't: the brains keep state across matches),
  // so where they split, both run again up to that frame and the values that differ come back too.
  async function diagnose(log, { dt = '60', randomSeed = 12345 } = {}) {
    const base = { noDraw: true };
    const a = await replay(log, { ...base, keepPer: true });
    const r = await replay(log, { ...base, dt, randomSeed, ref: a.per });
    delete a.per;
    if (!r.first || r.first.frame == null) return r;
    const k = r.first.frame;
    const A = await replay(log, { ...base, stopAt: k + 1, dumpAt: k });
    const B = await replay(log, { ...base, dt, randomSeed, stopAt: k + 1, dumpAt: k });
    r.diff = diffDumps(A.dump, B.dump);
    return r;
  }

  // Traces: the hash of every top-level value (simHash.hashKeys) for each frame of [from, to], recorded here and saved
  // in the log, so a device whose checkpoints split inside that window finds the first frame and the fields that
  // differ on its own. addTrace(log, from, to) replays to `to` and appends the trace to log.traces.
  async function addTrace(log, from, to) {
    const rows = [];
    await replay(log, { stopAt: to + 1, noDraw: true, onStep: (k) => { if (k >= from) rows.push(hashKeys(game)); } });
    const paths = [...new Set(rows.flatMap((r) => Object.keys(r)))];
    const tr = { from, to, paths, frames: rows.map((r) => paths.map((p) => (r[p] ?? 0).toString(16).padStart(8, '0')).join('')) };
    (log.traces ??= []).push(tr);
    return tr;
  }

  // The first frame in the trace's window where this browser differs, the fields, and this browser's values for them.
  async function traceCheck(log, tr, dt = '60') {
    let hit = null;
    await replay(log, {
      dt, stopAt: tr.to + 1, noDraw: true, onStep: (k) => {
        if (k < tr.from) return false;
        const here = hashKeys(game), ref = tr.frames[k - tr.from];
        const bad = tr.paths.filter((p, i) => (here[p] ?? 0) !== parseInt(ref.slice(i * 8, i * 8 + 8), 16));
        for (const p of Object.keys(here)) if (!tr.paths.includes(p)) bad.push(p);
        if (!bad.length) return false;
        const d = dumpSim(game), values = [];
        for (const p of bad) for (const [q, v] of Object.entries(d)) if (q === p || q.startsWith(p + '.') || q.startsWith(p + '[')) values.push([q, v]);
        hit = { frame: k, paths: bad, values };
        return true;
      },
    });
    return hit;
  }

  // Dev server only: write the log to public/det/<name>.json (vite.config.js det-fixtures).
  async function save(log, name = log.name) {
    const res = await fetch(`/__det/save?name=${encodeURIComponent(name)}`, { method: 'POST', body: JSON.stringify(log) });
    return res.text();
  }

  // A saved log (public/det/<name>.json).
  async function load(name) {
    const res = await fetch(`${import.meta.env.BASE_URL}det/${name}.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // ?det=<name>: replay a saved log in this browser and print the verdict (the phone / other-browser check).
  async function run(name, dt = '60') {
    show(`Determinism test: loading ${name}...`);
    let log;
    try {
      log = await load(name);
    } catch (e) {
      show(`Determinism test: could not load det/${name}.json (${e.message})`);
      return null;
    }
    const head = `Determinism test (ADR 0036): ${log.cfg.p1} vs ${log.cfg.p2}, seed ${log.cfg.seed}, ${log.frames} frames, render ${dt}`
      + `\nscreenshot this when it finishes and send it to Claude`;
    const r = await replay(log, { dt, onProgress: (k, n, first) => show(`${head}\nreplaying... ${k} / ${n}${first ? '  (already split)' : ''}`) });
    const f = r.first;
    const stale = !!log.sim && log.sim !== SIM; // gameplay changed since the recording (vite.config.js simId)
    const sameEnd = r.result.winner === log.result.winner && r.result.rounds === log.result.rounds && r.result.hp.join() === log.result.hp.join();
    const lines = [
      head,
      '',
      stale ? `STALE FIXTURE: recorded on simulation ${log.sim}, this build is ${SIM}. Gameplay code changed since; a split below means nothing until Claude re-records it.` : null,
      r.match ? 'RESULT: MATCH. Every checkpoint equals the reference.' : f ? `RESULT: SPLIT ${f.frame != null ? `at frame ${f.frame}` : ''}${f.window ? ` (checkpoint frames ${f.window.join('-')}, first in: ${f.groups.join(', ')})` : ''}` : `RESULT: stopped early at ${r.frames} / ${r.of}`,
      f?.probe ? `  positions + hp at that checkpoint ${JSON.stringify(f.probe.ref) === JSON.stringify(f.probe.here) ? 'are identical' : `differ\n    reference: ${JSON.stringify(f.probe.ref)}\n    this run:  ${JSON.stringify(f.probe.here)}`}` : null,
      `art: ${r.art.same ? 'same as the reference' : `DIFFERENT (here ${JSON.stringify(r.art.here)}, reference ${JSON.stringify(r.art.ref)})`}`,
      `result: winner ${r.result.winner}, rounds ${r.result.rounds}, hp ${r.result.hp.join(' / ')} (${sameEnd ? 'same as the reference' : `reference: winner ${log.result.winner}, rounds ${log.result.rounds}, hp ${log.result.hp.join(' / ')}`})`,
    ].filter((l) => l !== null);
    const tr = f?.window && log.traces?.find((t) => t.from <= f.window[0] && t.to >= f.window[1]);
    if (tr) {
      show(`${lines.join('\n')}\n\ntracing frames ${tr.from}-${tr.to}...`);
      const hit = await traceCheck(log, tr, dt);
      lines.push('', hit ? `TRACE: first differing frame ${hit.frame}, fields: ${hit.paths.join(', ')}` : 'TRACE: no field differs in that window (the trace and the checkpoints disagree)');
      if (hit) lines.push('  this browser\'s values:', ...hit.values.slice(0, 40).map(([q, v]) => `    ${q} = ${typeof v === 'number' ? String(v) : JSON.stringify(v)}`));
      det.trace = hit;
    } else if (f?.window) lines.push('', `TRACE: none recorded for frames ${f.window.join('-')} yet; Claude adds one from this screenshot`);
    // the rollback stress test (ADR 0036): every 10 frames save, play 8 frames on wrong inputs, restore, re-simulate
    show(`${lines.join('\n')}\n\nrollback test...`);
    const RB = { every: 10, depth: 8 };
    const q = await replay(log, { dt, noDraw: true, rollback: RB });
    const qf = q.first, rbs = q.rollback;
    lines.push('', q.match ? `ROLLBACK: MATCH. ${rbs.n} rewinds of ${RB.depth} frames (every ${RB.every}) changed nothing.`
      : `ROLLBACK: SPLIT ${qf?.frame != null ? `at frame ${qf.frame}` : ''}${qf?.window ? ` (frames ${qf.window.join('-')}, ${qf.groups.join(', ')})` : ''} after ${rbs.n} rewinds`,
    `  save ms: avg ${rbs.save?.avg}, max ${rbs.save?.max}; restore ms: avg ${rbs.load?.avg}, max ${rbs.load?.max}; 8 quiet frames ms: avg ${rbs.resim?.avg}, max ${rbs.resim?.max}`);
    det.rollback = q;
    lines.push(
      '',
      `fixed step ms: avg ${r.step?.avg}, p95 ${r.step?.p95}, max ${r.step?.max} (timer step ${r.timerMs} ms)`,
      `8 consecutive steps ms (one rollback): avg ${r.burst8?.avg}, p95 ${r.burst8?.p95}, max ${r.burst8?.max} (budget 16.7)`,
      `frame (draw) ms: avg ${r.frame?.avg}, p95 ${r.frame?.p95}`,
      `reference fixed step ms (${(log.ua.match(/(Chrome|Firefox|Version)\/[\d.]+/) || ['?'])[0]}): avg ${log.step?.avg}, p95 ${log.step?.p95}`,
      '',
      navigator.userAgent,
    );
    show(lines.join('\n'));
    det.result = r;
    return r;
  }

  const det = { record, replay, netplay, online, bot, diagnose, addTrace, traceCheck, save, load, run, dump: () => dumpSim(game), hash: () => Array.from(hashSim(game)) };
  window.det = det;
  if (qs.get('det')) ready.then(() => run(qs.get('det'), qs.get('dt') || '60'));
  return det;
}
