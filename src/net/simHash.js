// Simulation fingerprints for online play (ADR 0036). Rollback netcode needs two machines to compute the same fight
// from the same inputs; these hashes say whether they did. The state is hashed in groups so a mismatch also says
// where it started: game flow, either fighter, the pads (input buffers), the shots in flight, and the camera basis
// the controls read (stick directions and facing are camera-relative). dumpSim() walks the same values into a flat
// { path: value } map for diffing two runs. View-only objects (meshes, materials, textures, DOM, the fighters'
// interpolated render positions) are skipped; everything else a fighter or shot carries is included, cosmetic
// timers too, because the walk can't tell them apart and a false alarm is cheaper than a missed desync.

export const GROUPS = ['game', 'f0', 'f1', 'pads', 'shots', 'cam'];

// game-level fields the simulation reads or writes in the fixed step (the round timer, world freezes, clashes,
// the domain, combos); wall-clock bookkeeping such as stateT, acc and time is left out on purpose
const GAME_KEYS = ['state', 'inputLive', 'timeLeft', 'round', 'freeze', 'timeScale', 'slowT', 'koTriggered', 'roundWinner',
  'spClashCool', 'struggleCool', 'superFlash', 'clash', 'domain', 'pendingMelee', 'combos'];
// references back into the engine or the view, never walked; and view state the fighters carry today, which the
// simulation/view split (ADR 0036) moves off them: the power-up particles (chargeFx.js, Math.random) and the hit
// flash (hitFlash.js, stamped with the render clock). The CPU brains tag the shots they have seen (_aid, seen): their
// own bookkeeping, absent when a replay or a remote player drives the pads
const SKIP = new Set(['game', 'def', 'asset', 'actor', 'scene', 'renderPos', 'boxViewer', 'hasStrip', 'mesh', 'mat', 'geo', 'tex', 'chargeFx', 'hfx', '_aid', 'seen']);
const MAX_DEPTH = 8;

const F64 = new Float64Array(1), U32 = new Uint32Array(F64.buffer);

// murmur3-style word mixing: cheap, and every bit of every value reaches the result
class Hasher {
  constructor() { this.h = 0x9747b28c; this.paths = false; }
  word(w) {
    let k = Math.imul(w | 0, 0xcc9e2d51);
    k = Math.imul((k << 15) | (k >>> 17), 0x1b873593);
    const h = this.h ^ k;
    this.h = (Math.imul((h << 13) | (h >>> 19), 5) + 0xe6546b64) | 0;
  }
  num(_, x) {
    if (x !== x) return this.word(0x7ff80000); // NaN: engines may keep different payload bits
    F64[0] = x;
    this.word(U32[0]);
    this.word(U32[1]);
  }
  str(_, s) {
    this.word(s.length);
    for (let i = 0; i < s.length; i++) this.word(s.charCodeAt(i));
  }
  tag(_, t) { this.word(0x5a5a0000 + t); }
  key(k) { this.str(null, k); }
  done() {
    let h = this.h;
    h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    return (h ^ (h >>> 16)) >>> 0;
  }
}

class Dumper {
  constructor() { this.out = {}; this.paths = true; }
  num(p, x) { this.out[p] = x; }
  str(p, s) { this.out[p] = s; }
  tag(p, t) { this.out[p] = TAGS[t] ?? `<${t}>`; }
  key() {}
}
const TAGS = { 1: true, 2: false, 3: undefined, 4: null, 5: '<seen>', 6: '<deep>', 100: '<fighter 0>', 101: '<fighter 1>' };

const isView = (o) => o.isObject3D || o.isMaterial || o.isTexture || o.isBufferGeometry || o.nodeType || o instanceof Promise;

function walk(v, s, path, depth, seen, fighters) {
  switch (typeof v) {
    case 'number': return s.num(path, v);
    case 'string': return s.str(path, v);
    case 'boolean': return s.tag(path, v ? 1 : 2);
    case 'undefined': return s.tag(path, 3);
    case 'object': break;
    default: return; // functions, symbols
  }
  if (v === null) return s.tag(path, 4);
  if (isView(v)) return;
  const fi = fighters.indexOf(v);
  if (fi >= 0 && depth > 0) return s.tag(path, 100 + fi); // another object's reference to a fighter, not its contents again
  if (seen.has(v)) return s.tag(path, 5);
  if (depth > MAX_DEPTH) return s.tag(path, 6);
  seen.add(v);
  const sub = (k) => (s.paths ? `${path}.${k}` : null);
  if (Array.isArray(v) || ArrayBuffer.isView(v)) {
    s.num(sub('length'), v.length);
    for (let i = 0; i < v.length; i++) walk(v[i], s, sub(i), depth + 1, seen, fighters);
  } else if (v instanceof Map) {
    let i = 0;
    for (const [k, x] of v) { walk(k, s, sub(`key${i}`), depth + 1, seen, fighters); walk(x, s, sub(`val${i++}`), depth + 1, seen, fighters); }
  } else if (v instanceof Set) {
    let i = 0;
    for (const x of v) walk(x, s, sub(i++), depth + 1, seen, fighters);
  } else {
    for (const k of Object.keys(v)) {
      if (SKIP.has(k) || (depth === 0 && k === 'pad')) continue;
      s.key(k);
      walk(v[k], s, sub(k), depth + 1, seen, fighters);
    }
  }
}

// the animation playback the hitboxes come from (fighter.js advances it in the fixed step)
const actorOf = (a) => ({ animName: a.animName, fi: a.fi, ft: a.ft, done: a.done, frame: a.frame });

function visit(game, group, s) {
  const F = game.fighters, seen = new Set();
  switch (group) {
    case 'game': for (const k of GAME_KEYS) { s.key(k); walk(game[k], s, `game.${k}`, 1, seen, F); } break;
    case 'f0': case 'f1': {
      const f = F[group === 'f0' ? 0 : 1];
      if (!f) break;
      walk(f, s, group, 0, seen, F);
      s.key('actor');
      walk(actorOf(f.actor), s, `${group}.actor`, 1, seen, F);
      break;
    }
    case 'pads': walk(game.pads, s, 'pads', 1, seen, F); break;
    case 'shots':
      for (const k of ['projectiles', 'beams', 'orbs', 'vortices']) { s.key(k); walk(game[k], s, `shots.${k}`, 1, seen, F); }
      break;
    case 'cam': {
      const c = game.cam;
      walk({ right: c.right, fwd: c.fwd }, s, 'cam', 1, seen, F);
      break;
    }
  }
}

// One hash per group, in GROUPS order (written into `out` when given, so a per-frame caller allocates nothing).
export function hashSim(game, out = new Uint32Array(GROUPS.length)) {
  GROUPS.forEach((g, i) => {
    const s = new Hasher();
    visit(game, g, s);
    out[i] = s.done();
  });
  return out;
}

// The same values as a flat { 'f0.pos.x': 1.25, ... } map (diff two of them with diffDumps).
export function dumpSim(game, groups = GROUPS) {
  const d = new Dumper();
  for (const g of groups) visit(game, g, d);
  return d.out;
}

// The paths whose values differ, as [{ path, a, b }] (NaN equals NaN here: Object.is).
export function diffDumps(a, b, max = 40) {
  const out = [];
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (!Object.is(a[k], b[k])) out.push({ path: k, a: a[k], b: b[k] });
    if (out.length >= max) break;
  }
  return out;
}

// A string's hash (art fingerprints, logs).
export function hashString(str) {
  const s = new Hasher();
  s.str(null, str);
  return s.done();
}
