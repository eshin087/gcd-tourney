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
import { CameraDirector } from '../game/camera.js';
import { installDetMath } from './dmath.js';
import { GROUPS, hashSim, hashKeys, dumpSim, diffDumps, hashString } from './simHash.js';

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

// A fresh match from the log's settings, intro skipped. Returns the frame counter it starts from and `done`, which
// undoes the run's patches. The camera starts fresh too: the simulation reads the control basis from it (stick
// directions, facing), so the last screen's camera would leak into the first frames; so does the frame counter.
// `fixedBasis` pins that basis to the world axes after every camera update: the stand-in for a simulation-owned basis,
// so a run can show what else is not deterministic yet. `detMath` swaps in dmath.js's hypot / sin / cos for the run
// (Safari's Math.hypot differs from Chrome's in the last bit).
function startRun(game, cfg, { fixedBasis = false, detMath = false } = {}) {
  window.__manualStep = true; // the rAF loop must not step the game behind our back
  const restoreMath = detMath ? installDetMath() : () => {};
  game.cam = new CameraDirector(game.camera);
  game.acc = 0;
  game.frameNo = 0; // the simulation reads the absolute frame counter (cooldown stamps, beam-clash chart seeds): per match, as online play will need
  game.time = 0; // the render clock reaches it too (the charge tremble moves the camera, the round winner faces the camera's yaw)
  game.startMatch({ ...cfg });
  game.skipIntro();
  if (fixedBasis) {
    const c = game.cam, update = c.update;
    c.update = function (dt, g) {
      update.call(this, dt, g);
      this.right.set(1, 0, 0);
      this.fwd.set(0, 0, -1);
    };
  }
  return { f0: game.frameNo, done: restoreMath };
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
  // record({ p1, p2, level, seed, maxFrames, name, fixedBasis, detMath, dumpAt }): a CPU vs CPU match (Math.random seeded, so the
  // same seed records the same match again in this browser). The log's per-frame hashes stay in memory (log.per) for
  // same-page replays, and log.dump holds dumpSim() after frame dumpAt.
  async function record({ p1 = 'naruto', p2 = 'sasuke', level = 'impossible', seed = 7, maxFrames = 20000, name = null, fixedBasis = false, detMath = false, dumpAt = null } = {}) {
    const realRandom = Math.random;
    Math.random = rng(seed);
    const cfg = { mode: 'cpu', p1, p2, level, seed }, test = { fixedBasis, detMath };
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
      v: 1, name, made: new Date().toISOString(), ua: navigator.userAgent, cfg, test, frames, every: EVERY, groups: GROUPS,
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
  async function replay(log, { dt = '60', stopAt = log.frames, dumpAt = null, noDraw = false, onProgress = null, fixedBasis = log.test?.fixedBasis,
    detMath = log.test?.detMath, ref: refPer = null, keepPer = false, randomSeed = (log.cfg.seed ^ 0x5bd1e995) >>> 0, onStep = null } = {}) {
    const realRandom = Math.random;
    Math.random = rng(randomSeed);
    const { f0, done } = startRun(game, log.cfg, { fixedBasis, detMath });
    // idle stand-ins, not null: the rules know a CPU's pad from a person's (holding back blocks only for a person,
    // Fighter.holdingBack), and the recording ran under the CPU's
    game.brains = [{ update() {} }, { update() {} }];
    game.director = null;
    const art = game.assets.map(artPrint);
    const feed = makeFeed(log.inputs), poll = game.input.poll, draw = game.renderer.render;
    game.input.poll = () => feed(game, game.frameNo - f0 - 1);
    if (noDraw) game.renderer.render = () => {};
    const ref = refPer ?? log.per ?? null, checks = ref ? null : unhex(log.checks), fh = !ref && log.frameHashes ? unhex(log.frameHashes) : null;
    const H = new Uint32Array(NG), chain = new Uint32Array(NG), timing = [], drawT = [], per = keepPer ? [] : null;
    let frames = 0, first = null, dump = null, halt = false, exact = null;
    const groupsAt = (a, b) => GROUPS.filter((_, g) => a[g] !== b[g]);
    const unhook = hookStep(game, f0, (k) => {
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
      dt, frames, of: log.frames, match: !first && frames === Math.min(stopAt, log.frames), first, dump, per: per && Uint32Array.from(per),
      art: { same: JSON.stringify(art) === JSON.stringify(log.art), here: art, ref: log.art },
      step, frame: stats(drawT), rollback8: step && +(8 * step.p95).toFixed(2), burst8: stats(burst), timerMs: Number.isFinite(tick) ? +tick.toFixed(3) : null,
      result: { winner: game.roundWinner?.index ?? null, rounds: game.round, hp: game.fighters.map((f) => f.hp) },
    };
  }

  // Two replays of the same inputs, the second at another render rate (`dt`) and/or another Math.random sequence
  // (`randomSeed`). Replays repeat themselves exactly (the recording doesn't: the brains keep state across matches),
  // so where they split, both run again up to that frame and the values that differ come back too.
  async function diagnose(log, { dt = '60', randomSeed = 12345, fixedBasis = log.test?.fixedBasis } = {}) {
    const base = { noDraw: true, fixedBasis, detMath: log.test?.detMath };
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
      + `${log.test?.fixedBasis ? ', control basis pinned' : ''}${log.test?.detMath ? ', deterministic math' : ''}\nscreenshot this when it finishes and send it to Claude`;
    const r = await replay(log, { dt, onProgress: (k, n, first) => show(`${head}\nreplaying... ${k} / ${n}${first ? '  (already split)' : ''}`) });
    const f = r.first;
    const sameEnd = r.result.winner === log.result.winner && r.result.rounds === log.result.rounds && r.result.hp.join() === log.result.hp.join();
    const lines = [
      head,
      '',
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

  const det = { record, replay, diagnose, addTrace, traceCheck, save, load, run, dump: () => dumpSim(game), hash: () => Array.from(hashSim(game)) };
  window.det = det;
  if (qs.get('det')) ready.then(() => run(qs.get('det'), qs.get('dt') || '60'));
  return det;
}
