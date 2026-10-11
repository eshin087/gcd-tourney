// Canon power-ups (ENG-069, ADR 0023). Holding Special charges ki; how that LOOKS is fighter data: `charge` in
// src/characters/<id>.js, deep-merged over CHARGE_DEFAULT, plus `charge` on an active mode (moves.js). One small
// interpreter turns the data into four primitives: a body shell (auraShell.js: the power lives on the body), a few
// emitters, an eye glint, and the bar / MAX beats. The restraint rules R1-R9 are enforced here rather than trusted
// to the data, so no charge block can bring back ENG-059's ~100 blooming flame sprites around the fighter.
//
// Ground damage is optional (feature/ground-damage): every live charge frame calls
// game.fx.ground?.chargeTick?.(f, t, level) and a full gauge calls game.fx.ground?.chargeMax?.(f); without that
// module a style with ground.crackAt lays at most one crater per charge. Styles with crackAt 0 (Gojo, Killua) never
// touch the floor.
import * as THREE from 'three';
import { KI_BAR } from './constants.js';

// ---- restraint rules (ADR 0023). Data can ask for less, never for more.
const CAP = 16; // R1: live charge sprites per fighter (emitters + eye glints)
const KEEP_CAP = 2; // R1: held effects (Naruto's chakra tail)
const GLOW_MAX = 0.6; // R2: no charge sprite pushes far into the bloom...
const GLOW_BIG = 0.2; // ...and a big one barely at all
const BIG = 0.25; // R2/R3: "big" sprite scale
const OPACITY_BIG = 0.6; // R3
const SHELL_MAX = 0.7; // R3
const FRONT_MAX = 0.25; // R4: only small sprites may sit in front of the body
const LINES_MAX = 0.35; // R5: a new bar pulses the focus lines, nothing while holding
const FLASH_MAX = 0.1; // R5: overlay flash only at MAX, in the style's dark color
const TINT_MAX = 0.06; // R6: steady body tint
const RUMBLE_MAX = 0.05; // R9: camera trauma per 4 frames

// Effects drawn from their base (they rise from a point) rather than their center.
const BOTTOM = new Set(['flame', 'streak', 'wisp', 'naruto_chakraTail', 'dust']);

// A restrained DBZ-style ki aura: what a new fighter without a `charge` block gets (a future Goku, say).
// Palette keys left null resolve to def.color (main) and def.auraCore (core).
export const CHARGE_DEFAULT = {
  palette: { main: null, core: null, dark: '#1c1626', pebble: '#9c8a74' },
  body: [0.3, 1.5], // half width, height of the body the emitters work in (world units)
  bodyTint: 0.04, // R6: steady tint toward `tint` (a palette key)
  tint: 'main',
  shell: { kind: 'flame', width: [0.03, 0.07], lift: 1, noise: 0.8, speed: 2.4, opacity: [0.3, 0.5] },
  emit: [
    { fx: 'flame', from: 'back', every: 6, max: 6, scale: [0.3, 0.42], vel: [0, 1.3, 0], color: 'main', opacity: 0.5 },
    { fx: 'star', frame: 2, from: 'ring', every: 8, max: 4, scale: 0.12, vel: 'toChest', life: 0.24, color: 'core', glow: 0.5 },
    { fx: 'star', frame: 3, from: 'floor', every: 10, max: 4, scale: [0.16, 0.22], vel: [0, [1.1, 2.4], 0], life: 0.9, color: 'pebble', opacity: 1 },
  ],
  eyes: null, // { at: [forward, up] (spec v2 art units), color, bar, every }
  ground: { dustEvery: 28, crackAt: 2, rumble: 0.04 },
  // the beat when a new bar fills, and the one when the gauge is full
  bar: { ring: { scale: 1.8, color: 'core', opacity: 0.5 }, ripple: 0, burst: { scale: 0.9 }, dust: 0.5, flash: 0, lines: 0.3, shake: 0.12, punch: 0.2, fx: [] },
  max: { ring: { scale: 2.4, color: 'core', opacity: 0.55 }, ripple: 0, burst: { scale: 1.1 }, dust: 0.7, flash: 0.08, lines: 0.35, shake: 0.2, punch: 0.35, fx: [] },
  sound: 'hum', // audio.loop('charge', variant): hum | boil | crackle | calm
};

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof THREE.Color);
// Objects merge key by key; arrays (emitter lists, ranges) and null replace.
function merge(a, b) {
  if (b === undefined) return a;
  if (!isObj(b) || !isObj(a)) return b;
  const out = { ...a };
  for (const k of Object.keys(b)) out[k] = merge(a[k], b[k]);
  return out;
}

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (v, d = 0) => (Array.isArray(v) ? rnd(v[0], v[1]) : v ?? d);
const hi = (v, d = 0) => (Array.isArray(v) ? v[1] : v ?? d);
const lerp = (a, b, k) => a + (b - a) * k;

function build(def, modeCharge) {
  const raw = merge(merge(CHARGE_DEFAULT, def.charge ?? {}), modeCharge ?? {});
  const pal = {}, css = {};
  const auraCore = def.auraCore ? new THREE.Color().setRGB(...def.auraCore) : new THREE.Color(0xffffff);
  for (const [k, v] of Object.entries({ main: null, core: null, dark: '#1c1626', ...raw.palette })) {
    pal[k] = v != null ? new THREE.Color(v) : k === 'core' ? auraCore : new THREE.Color(def.color ?? 0xffffff);
    css[k] = '#' + pal[k].getHexString();
  }
  const color = (key) => pal[key] ?? (key ? new THREE.Color(key) : pal.main);
  // emitters: clamp what the rules forbid once, here (the conservative end of each range)
  const fx = (e) => {
    const big = hi(e.scale, 0.2);
    let glow = Math.min(e.glow ?? 0, GLOW_MAX);
    if (big > BIG) glow = Math.min(glow, GLOW_BIG);
    let opacity = e.opacity ?? 0.6;
    if (big > 0.3) opacity = Math.min(opacity, OPACITY_BIG);
    return { ...e, glow, opacity, c: color(e.color), every: Math.max(1, e.every ?? 6), max: Math.max(0, e.max ?? 2), bar: e.bar ?? 0, front: e.front ?? 0 };
  };
  const beat = (b) => b && {
    ...b,
    ring: b.ring && { ...b.ring, c: color(b.ring.color ?? 'core'), opacity: Math.min(0.6, b.ring.opacity ?? 0.5) },
    flash: Math.min(FLASH_MAX, b.flash ?? 0),
    lines: Math.min(LINES_MAX, b.lines ?? 0),
    fx: (b.fx ?? []).map(fx),
  };
  const sh = raw.shell;
  const range = (v, d) => (Array.isArray(v) ? v : [v ?? d, v ?? d]);
  const shell = sh && {
    ...sh,
    // outer band / inner band colors; 'dark' keeps near-black against the body with a thin colored rim
    c: color(sh.color ?? 'main'),
    core: color(sh.core ?? (sh.kind === 'dark' ? 'dark' : 'core')),
    opacity: range(sh.opacity, 0.4).map((o) => Math.min(SHELL_MAX, o)),
    width: range(sh.width, 0.03),
  };
  const emit = (raw.emit ?? []).map(fx);
  let keeps = 0;
  for (const e of emit) if (e.hold && ++keeps > KEEP_CAP) e.max = 0; // R1
  return {
    level: modeCharge?.level ?? 0,
    pal, css, shell, emit,
    body: raw.body,
    bodyTint: Math.min(TINT_MAX, raw.bodyTint ?? 0),
    tint: pal[raw.tint] ?? pal.main,
    eyes: raw.eyes && { every: 80, ...raw.eyes, c: color(raw.eyes.color ?? 'core') },
    ground: { dustEvery: 0, crackAt: 0, rumble: 0, ...raw.ground, rumble: Math.min(RUMBLE_MAX, raw.ground?.rumble ?? 0) },
    bar: beat(raw.bar), max: beat(raw.max),
    sound: raw.sound,
  };
}

const cache = new WeakMap(); // def -> Map(mode.charge | null -> style)
// The resolved style of a fighter right now (its own data + its active mode's). Cached: called every frame.
export function chargeStyle(f) {
  const mc = f.mode?.charge ?? null;
  let byMode = cache.get(f.def);
  if (!byMode) cache.set(f.def, (byMode = new Map()));
  let s = byMode.get(mc);
  if (!s) byMode.set(mc, (s = build(f.def, mc)));
  return s;
}

// 0..3: ki bars filled, plus the mode's boost (Nine-Tails cloak, Godspeed); 3 = MAX look.
export const chargeLevel = (f, s = chargeStyle(f)) => Math.max(0, Math.min(3, Math.floor(f.ki / KI_BAR) + s.level));

// ---- per-fighter runtime state
function state(f) {
  return (f.chargeFx ??= { active: false, t: 0, live: [], counts: [], ids: [], level: -1, cracked: false, glintAt: -999, keeps: new Set() });
}

// The camera's right / up / forward this frame. Body spots live in the sprite's billboard plane (feet + right x side
// + up x height, like the sprite's own pixels), so "behind the body" stays behind it however far the camera pitches.
const R = new THREE.Vector3(), U = new THREE.Vector3(), F = new THREE.Vector3(), P = new THREE.Vector3(), T = new THREE.Vector3(), C = new THREE.Vector3();
function basis(game) {
  const q = game.camera.quaternion;
  R.set(1, 0, 0).applyQuaternion(q);
  U.set(0, 1, 0).applyQuaternion(q);
  F.set(0, 0, -1).applyQuaternion(q);
}

// A spawn point for `from`, `d` units behind the body's plane (negative: in front). `flip`: the sprite's facing.
// `k`: SpriteActor.depthK (ENG-067). The body draws scaled by it about its feet, so every spot on and around it
// scales the same way or the power-up drifts off the drawn body when the two fighters stand at different depths.
function place(from, p, body, flip, d = 0, k = 1) {
  const hw = body[0] * k, h = body[1] * k;
  let side = 0, up = 0;
  switch (from) {
    case 'body': side = rnd(-hw, hw); up = rnd(0.15, 0.85) * h; break;
    case 'back': side = -flip * rnd(0.02, hw * 0.9); up = rnd(0.45, 0.8) * h; break;
    case 'head': side = rnd(-0.4, 0.4) * hw; up = rnd(0.86, 0.96) * h; break;
    case 'chest': up = 0.6 * h; break;
    case 'hips': side = -flip * hw * 0.3; up = 0.42 * h; break;
    case 'feet': up = 0.02; break;
    case 'floor': case 'ring': {
      // on (or above) the floor around them: plain world space, depth sorts itself
      const a = Math.random() * Math.PI * 2, r = (from === 'floor' ? rnd(0.3, 0.85) : rnd(1.0, 1.4)) * k;
      return P.set(p.x + Math.cos(a) * r, p.y + (from === 'floor' ? 0.04 : rnd(0.25, 0.85) * h), p.z + Math.sin(a) * r * 0.6);
    }
  }
  return P.copy(p).addScaledVector(R, side).addScaledVector(U, up).addScaledVector(F, d);
}

const VEL = [0, 0, 0];
const SH = {}; // the shell's per-frame settings, reused
function spawnOne(game, f, s, e, b, tag) {
  const fx = game.fx;
  const p = f.renderPos || f.pos, flip = f.actor.flip, dk = f.actor.depthK ?? 1;
  const scale = pick(e.scale, 0.2) * (1 + (e.grow ?? 0) * b);
  const front = e.front && scale <= FRONT_MAX && Math.random() < (e.front === true ? 1 : e.front);
  const at = place(e.from ?? 'body', p, s.body, flip, front ? -0.15 : 0.3, dk); // R4: anything bigger stays behind
  at.addScaledVector(U, (e.y ?? 0) * dk);
  let vel = null;
  if (e.vel === 'toChest') {
    const k = 4; // reaches the chest in about a quarter second
    T.copy(p).addScaledVector(U, 0.6 * s.body[1] * dk).sub(at).multiplyScalar(k);
    VEL[0] = T.x; VEL[1] = T.y; VEL[2] = T.z;
    vel = VEL;
  } else if (e.vel) {
    // [right, up, toward the camera] on screen: rising along the camera's up keeps a sprite behind the body
    T.copy(R).multiplyScalar(pick(e.vel[0])).addScaledVector(U, pick(e.vel[1])).addScaledVector(F, -pick(e.vel[2]));
    VEL[0] = T.x; VEL[1] = T.y; VEL[2] = T.z;
    vel = VEL;
  }
  const it = fx.spawn(e.fx, at.x, at.y, at.z, {
    bottom: BOTTOM.has(e.fx), scale: scale * dk, color: e.c, opacity: e.opacity, glow: e.glow, vel, grav: e.grav ?? 0,
    life: e.life, frame: e.frame ?? -1, random: !!e.random, fade: !!e.fade, rot: e.spin ? Math.random() * 6.28 : 0,
    flipX: e.flipX ?? (BOTTOM.has(e.fx) ? Math.random() < 0.5 : false), order: front ? 6 : 1,
  });
  it.tag = tag;
  it.drag = e.drag ?? 0;
  return it;
}

// Drop dead handles in place (no per-frame allocation) and count the live ones per emitter. A mesh out of the
// scene is dead too, however it left (Effects.clearAll on a round or lab reset): a stale handle would hold its
// emitter's `max` and the CAP for the rest of the match.
function prune(S) {
  let n = 0;
  S.counts.fill(0);
  for (const it of S.live) {
    if (it.life <= 0 || !it.mesh.parent) continue;
    S.live[n++] = it;
    if (it.emitter >= 0) S.counts[it.emitter] = (S.counts[it.emitter] ?? 0) + 1;
  }
  S.live.length = n;
}

function glint(game, f, s, S, max) {
  const E = s.eyes;
  if (!E || f.asset?.meta?.source !== 'art-pack') return; // offsets are measured on spec v2 art; skip the placeholder
  if (S.live.length >= CAP) return;
  const p = f.renderPos || f.pos, flip = f.actor.flip, dk = f.actor.depthK ?? 1;
  const [fwd, up] = E.at; // on the drawn eyes, which sit depthK higher on a depth-scaled body
  P.copy(p).addScaledVector(R, flip * fwd * dk).addScaledVector(U, up * dk).addScaledVector(F, -0.1);
  const it = game.fx.spawn('star', P.x, P.y, P.z, {
    scale: (E.scale ?? 0.12) * (max ? 1.4 : 1) * dk, color: E.c, glow: Math.min(GLOW_MAX, E.glow ?? 0.6), life: 0.2, depthTest: false, order: 9,
  });
  it.tag = 'charge';
  it.emitter = -1;
  S.live.push(it);
}

// One sim frame of a charge. `frozen` (super flash / special clash: f.t stands still) only refreshes the shell
// and held effects: every `t % n` emitter would otherwise fire on each frozen frame (R7).
export function chargeTick(game, f, t, frozen = false) {
  const s = chargeStyle(f), S = state(f), fx = game.fx;
  basis(game);
  if (!S.active || t < S.t) {
    S.active = true;
    S.cracked = false;
    S.glintAt = -999;
    S.level = -1;
  }
  S.t = t;
  const level = chargeLevel(f, s);
  const b = Math.min(1, t / 45);
  const k = Math.min(1, 0.7 * b + 0.1 * level);
  // the shell: width and opacity build with time and level, nothing else grows
  const sh = s.shell, shell = sh && f.actor.auraShell?.();
  if (shell) {
    SH.kind = sh.kind; SH.lift = sh.lift; SH.noise = sh.noise; SH.speed = sh.speed; SH.color = sh.c; SH.core = sh.core;
    SH.width = lerp(sh.width[0], sh.width[1], k);
    SH.opacity = lerp(sh.opacity[0], sh.opacity[1], k);
    SH.dash = sh.kind === 'electric' && Math.random() < 0.08 ? 0 : sh.dash ?? 0; // now and then the whole outline flashes
    SH.time = game.time;
    shell.show(SH);
  }
  // held effects (a chakra tail) follow the body even while frozen
  const p = f.renderPos || f.pos, flip = f.actor.flip, dk = f.actor.depthK ?? 1;
  for (let i = 0; i < s.emit.length; i++) {
    const e = s.emit[i];
    if (!e.hold || !e.max) continue;
    const id = (S.ids[i] ??= `chg${f.index}_${i}`); // per fighter: a mirror match shares the style
    if (level < e.bar) { if (S.keeps.delete(id)) fx.drop(id); continue; }
    const at = place(e.from ?? 'hips', p, s.body, flip, 0.25, dk).addScaledVector(U, (e.y ?? 0) * dk);
    const it = fx.keep(id, e.fx, at.x, at.y, at.z, { bottom: BOTTOM.has(e.fx), scale: pick(e.scale, 0.5) * dk, color: e.c, opacity: e.opacity, glow: e.glow, order: 1 });
    it.mesh.scale.x = Math.abs(it.mesh.scale.x) * flip; // drawn curling back for a fighter facing right
    it.rot = Math.sin(game.time * 2.2) * (e.sway ?? 0.08) * flip;
    it.tag = 'chargeKeep';
    S.keeps.add(id);
  }
  if (frozen) return 0;

  // emitters (R1: a hard cap on top of each emitter's own `max`)
  for (const it of S.live) if (it.drag && it.vel) it.vel.multiplyScalar(Math.pow(it.drag, 1 / 60));
  prune(S);
  for (let i = 0; i < s.emit.length; i++) {
    const e = s.emit[i];
    if (e.hold || level < e.bar || t % e.every !== 0) continue;
    if ((S.counts[i] ?? 0) >= e.max || S.live.length >= CAP) continue;
    const it = spawnOne(game, f, s, e, b, 'charge');
    it.emitter = i;
    S.live.push(it);
    S.counts[i] = (S.counts[i] ?? 0) + 1;
  }
  // eyes: a glint as their bar is reached and now and then after
  const E = s.eyes;
  if (E && level >= E.bar && (level > S.level || t - S.glintAt >= E.every)) {
    S.glintAt = t;
    glint(game, f, s, S, level >= 3);
  }
  // the floor
  const G = s.ground;
  if (G.dustEvery && t > 0 && t % G.dustEvery === 0 && S.live.length < CAP) {
    const at = place('feet', p, s.body, flip, 0.35, dk); // a billboard ring: behind, so its far arc never crosses the body
    const it = fx.spawn('ring', at.x, at.y, at.z, { scale: (1 + 0.5 * b) * dk, color: 0xd8ccb8, opacity: 0.35, life: 0.35, fade: true });
    it.tag = 'charge';
    it.emitter = -1;
    S.live.push(it);
  }
  if (G.crackAt > 0) {
    const ground = fx.ground;
    if (ground?.chargeTick) ground.chargeTick(f, t, level);
    else if (!S.cracked && level >= G.crackAt && t >= 30) {
      S.cracked = true;
      fx.crater(f.pos);
    }
  }
  if (G.rumble && t % 4 === 0) game.cam.shake(G.rumble * (0.5 + 0.5 * b));
  S.level = level;
  return 0; // R5: no focus lines while holding (a bar pulses them, see chargeBar)
}

// The charge ended (released, cancelled, hit, ultimate): hide the shell and let go of held effects. Cheap when idle.
export function chargeEnd(game, f) {
  const S = f.chargeFx;
  if (!S?.active) return;
  S.active = false;
  f.actor.shell?.hide();
  for (const id of S.keeps) game.fx.drop(id);
  S.keeps.clear();
}

// A new ki bar while charging (Game.onChargeBar keeps the chime and the MAX POWER! callout).
export function chargeBar(game, f, full) {
  const s = chargeStyle(f), B = full ? s.max : s.bar;
  if (!B) return;
  basis(game);
  const fx = game.fx, p = f.renderPos || f.pos, dk = f.actor.depthK ?? 1;
  const chest = C.copy(place('chest', p, s.body, f.actor.flip, 0.3, dk)); // place() reuses one vector
  const tag = (it) => { it.tag = 'chargeBar'; return it; };
  if (B.ring) {
    const at = place('feet', p, s.body, f.actor.flip, 0.35, dk); // behind: its far arc would otherwise cross the chest
    tag(fx.spawn('ring', at.x, at.y, at.z, { scale: B.ring.scale * dk, color: B.ring.c, opacity: B.ring.opacity, glow: 0.2, life: 0.3, fade: true }));
  }
  if (B.ripple) tag(fx.spawn('ripple', chest.x, chest.y, chest.z, { scale: B.ripple * dk, color: s.pal.core, opacity: 0.35, life: 0.3, fade: true, order: 1 }));
  // drawn behind the body: the fighter stays readable through the beat
  if (B.burst) tag(fx.spawn('burst', chest.x, chest.y, chest.z, { scale: B.burst.scale * dk, color: s.pal.main, opacity: 0.7, glow: Math.min(0.4, B.burst.glow ?? 0.3), order: 1, rot: Math.random() * 6 }));
  for (const e of B.fx) tag(spawnOne(game, f, s, e, 1, 'chargeBar'));
  if (B.dust) fx.dust(f.pos, B.dust);
  if (full && B.flash) fx.overlay.flash(s.css.dark, B.flash); // R5: dark, faint, MAX only
  if (B.lines) fx.overlay.lines = Math.max(fx.overlay.lines, B.lines);
  if (B.punch) game.cam.zoomPunch(B.punch);
  if (B.shake) game.cam.shake(B.shake);
  if (full && s.ground.crackAt > 0) fx.ground?.chargeMax?.(f);
}
