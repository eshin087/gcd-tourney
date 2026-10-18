// Save and restore the simulation (ADR 0036, ENG-092): the state a rollback rewinds to. A saved state is a deep copy
// of everything the fixed step reads and writes: the game's match fields, both fighters, both pads, the shots, the
// clash, the control basis and each sprite's playback (its frame picks the hit boxes). Nothing else is copied.
// Static data (move tables, character definitions, art packs), the engine objects and the view (meshes, effects,
// the HUD, the camera) stay shared by reference. Restoring copies the saved state back without consuming it, so one
// state can be restored any number of times. simHash.js is the oracle: save, run, restore, re-run, same hashes.
import * as MOVES from './moves.js';
import { STREAM_STYLES } from './projectiles.js';
import { ROSTER } from '../characters/index.js';

// the game's own match state (everything else on Game is the engine, the view, or set once per match)
export const GAME_STATE = [
  'state', 'stateT', 'flowFlags', 'inputLive', 'timeLeft', 'round', 'roundWinner', 'koTriggered', 'freeze', 'timeScale',
  'slowT', 'superFlash', 'clash', 'domain', 'pendingMelee', 'combos', 'comboF', 'fightF', 'trackedState', 'spClashCool',
  'struggleCool', 'meleeChain', 'meleeFocus', 'meleeFxF', 'projectiles', 'beams', 'orbs', 'vortices', 'frameNo',
  'nextShotId',
];
// a fighter's view state and engine links: kept as they are, never saved or restored
const FIGHTER_KEEP = new Set(['game', 'def', 'asset', 'actor', 'pad', 'renderPos', 'boxViewer', 'chargeFx', 'hfx', 'groundMark', 'crewView']);

// Objects reachable from the static tables are shared, never copied: a move's identity (f.move === MOVES.x) must
// survive a restore, and copying the art packs' box tables every frame would cost for nothing.
const STATIC = new WeakSet();
let staticAssets = null;
function markStatic(v) {
  if (v === null || typeof v !== 'object' || STATIC.has(v) || isView(v)) return;
  STATIC.add(v);
  if (v instanceof Map) for (const [k, x] of v) { markStatic(k); markStatic(x); }
  else if (v instanceof Set) for (const x of v) markStatic(x);
  else for (const k of Object.keys(v)) markStatic(v[k]);
}
function ensureStatic(game) {
  if (staticAssets === game.rosterAssets) return;
  for (const t of Object.values(MOVES)) markStatic(t);
  markStatic(STREAM_STYLES);
  markStatic(ROSTER);
  for (const a of game.rosterAssets ?? []) markStatic(a);
  staticAssets = game.rosterAssets;
}

const isView = (o) => !!(o.isObject3D || o.isMaterial || o.isTexture || o.isBufferGeometry || o.nodeType || o instanceof Promise);
const isMath = (o) => !!(o && (o.isVector2 || o.isVector3 || o.isVector4 || o.isColor || o.isQuaternion));

// A deep copy that keeps shared structure (two references to one object stay one copy) and leaves the live
// objects in `keep` (the game, the fighters, the pads, the basis) and everything static or view as they are.
function clone(v, memo, keep) {
  if (v === null || typeof v !== 'object') return v; // primitives, and functions shared as they are
  if (keep.has(v) || STATIC.has(v) || isView(v)) return v;
  const seen = memo.get(v);
  if (seen !== undefined) return seen;
  if (Array.isArray(v)) {
    const a = new Array(v.length);
    memo.set(v, a);
    for (let i = 0; i < v.length; i++) a[i] = clone(v[i], memo, keep);
    return a;
  }
  if (v instanceof Map) {
    const m = new Map();
    memo.set(v, m);
    for (const [k, x] of v) m.set(clone(k, memo, keep), clone(x, memo, keep));
    return m;
  }
  if (v instanceof Set) {
    const s = new Set();
    memo.set(v, s);
    for (const x of v) s.add(clone(x, memo, keep));
    return s;
  }
  if (ArrayBuffer.isView(v)) {
    const t = v.slice();
    memo.set(v, t);
    return t;
  }
  const o = Object.create(Object.getPrototypeOf(v));
  memo.set(v, o);
  for (const k of Object.keys(v)) o[k] = clone(v[k], memo, keep);
  return o;
}

const liveSet = (game) => new Set([game, game.basis, ...game.fighters, ...game.pads, ...game.fighters.map((f) => f.actor)]);

// the fields of a fighter the simulation owns (functions and view links stay on the live fighter)
const fighterKeys = (f) => Object.keys(f).filter((k) => !FIGHTER_KEEP.has(k) && typeof f[k] !== 'function');

export function saveState(game) {
  ensureStatic(game);
  const memo = new Map(), keep = liveSet(game);
  const fighters = game.fighters.map((f) => {
    const s = {};
    for (const k of fighterKeys(f)) s[k] = clone(f[k], memo, keep);
    return s;
  });
  const pads = game.pads.map((p) => {
    const s = {};
    for (const k of Object.keys(p)) if (typeof p[k] !== 'function') s[k] = clone(p[k], memo, keep);
    return s;
  });
  const basis = {};
  for (const k of Object.keys(game.basis)) basis[k] = clone(game.basis[k], memo, keep);
  const g = {};
  for (const k of GAME_STATE) g[k] = clone(game[k], memo, keep);
  return { fighters, pads, basis, game: g, actors: game.fighters.map((f) => f.actor.saveState()) };
}

// Copy a saved field onto a live object: math objects (positions, velocities, facings) in place, so whatever holds
// them keeps holding the live one; anything else as a fresh copy.
function put(obj, k, saved, memo, keep) {
  const cur = obj[k];
  if (isMath(saved) && isMath(cur) && Object.getPrototypeOf(saved) === Object.getPrototypeOf(cur)) {
    cur.copy(saved);
    memo.set(saved, cur);
  } else obj[k] = clone(saved, memo, keep);
}

export function loadState(game, S) {
  const memo = new Map(), keep = liveSet(game);
  game.fighters.forEach((f, i) => {
    const s = S.fighters[i];
    for (const k of fighterKeys(f)) if (!(k in s)) delete f[k]; // fields set after the save (a lazily added stamp)
    for (const k of Object.keys(s)) put(f, k, s[k], memo, keep);
    f.actor.loadState(S.actors[i]);
  });
  game.pads.forEach((p, i) => {
    const s = S.pads[i];
    for (const k of Object.keys(s)) put(p, k, s[k], memo, keep);
  });
  for (const k of Object.keys(S.basis)) put(game.basis, k, S.basis[k], memo, keep);
  for (const k of GAME_STATE) game[k] = clone(S.game[k], memo, keep);
}
