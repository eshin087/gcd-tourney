// Fighter kits (ADR 0009, baseline ADR 0011): which special each input slot fires, and the shared
// behaviour of every special kind (shot, teleport, pull, dive, counter, mode), the second supers and
// non-beam ultimates (flurry, domain, ignite, skyStrike; orb, rampage, reflex: ADR 0017; laneStrike: ADR 0032), status effects
// (burn, the Whirlwind reflex, the Four-Tails shroud), timed modes and passives. Character files only hold data; a new *kind* is the only thing that
// needs code here. Kit moves run in the fighter state 'kit' with their data in fighter.kitState. Shadow clones are
// plain entries in kitState.crew that Fighter.sync draws (clones.js).
import * as THREE from 'three';
import { SPECIAL_MOVES, SUPERS, MOVES, PASSIVES, CLASH, PROJECTILES, ULTIMATE } from './moves.js';
import { ARENA_LIMIT } from './constants.js';
import * as dmath from './dmath.js';
import { audio } from '../core/audio.js';
import { crewMember } from './clones.js';

const tmp = new THREE.Vector2();
const FRAME_MS = 1000 / 60;

// keep a looping pose running (the flash poses: beamCharge, beamFire, ...)
function loop(f, anim) {
  f.actor.play(anim);
  f.actor.update(FRAME_MS);
}

// Element-flavoured bursts, so one kind serves every fighter: 'lightning' (Killua), 'chakra' (red
// flame licks: Nine-Tails), 'smoke' (shadow clones, substitution), 'black' (Amaterasu), 'ring'.
function burst(g, kind, x, y, z, color, scale = 1) {
  if (kind === 'poof') g.fx.poof(x, y, z, 0.6 * scale);
  else if (kind === 'lightning') g.fx.spawn('lightning', x, y, z, { scale, random: true, life: 0.1, color: color ?? 0xd8f0ff, order: 9, glow: 2 });
  else if (kind === 'chakra') g.fx.spawn('flame', x, y - 0.45, z, { bottom: true, scale: 0.5 * scale, color: color ?? 0xff5a1a, vel: [0, 2.2, 0], opacity: 0.85, order: 8, glow: 0.5 });
  else if (kind === 'smoke') g.fx.smoke(x, y, z, 0.7 * scale);
  else if (kind === 'black') g.fx.spawn('flame', x, y - 0.45, z, { bottom: true, scale: 0.55 * scale, color: 0x140a18, vel: [0, 1.7, 0], opacity: 0.95, order: 8, glow: 0 });
  else if (kind === 'ring') g.fx.spawn('ring', x, y, z, { scale: 1.2 * scale, color: color ?? 0xffffff, glow: 0.8, order: 8 });
}

// ------------------------------------------------------------------ slots
export function kitOf(def) {
  if (!def._kit) {
    const k = def.kit || {};
    const specials = { ...(k.specials || {}) };
    if (!specials.neutral && def.special) specials.neutral = def.special;
    if (!specials.air && def.projectile) specials.air = def.projectile + 'Air';
    def._kit = { specials, super: k.super || null, ultimate: k.ultimate || null, passive: k.passive || null };
  }
  return def._kit;
}

const FALLBACK = { forward: ['neutral'], up: ['neutral'], down: ['neutral'], back: ['down', 'neutral'], airDown: ['air'] };

// The stick picks the slot: forward/back along the screen relative to the facing, up/down when
// the stick is mostly vertical (up/down also move in depth, but nobody walks while casting).
// A ground special comes out on release, so a neutral stick then falls back to the stick at the
// press: a quick tap lets go of the direction and the button on the same frame.
export function specialSlot(f, air) {
  // forward/back count toward the opponent, not the current facing: walking back turns the sprite
  const s = towardSide(f);
  let x = f.pad.mx * s, y = f.pad.my;
  if (Math.abs(x) < 0.5 && Math.abs(y) < 0.6) { x = (f.spMx ?? 0) * s; y = f.spMy ?? 0; }
  const vertical = Math.abs(y) > 0.6 && Math.abs(y) > Math.abs(x);
  if (air) return vertical && y < 0 ? 'airDown' : 'air';
  if (vertical) return y > 0 ? 'up' : 'down';
  if (x > 0.5) return 'forward';
  if (x < -0.5) return 'back';
  return 'neutral';
}

// +1 when the opponent is to the screen-right, -1 to the left (falls back to the facing when level).
export function towardSide(f) {
  const R = f.game.basis.right, o = f.opp;
  const sx = (o.pos.x - f.pos.x) * R.x + (o.pos.z - f.pos.z) * R.z;
  return Math.abs(sx) > 0.12 ? Math.sign(sx) : f.side;
}

export function specialFor(def, slot) {
  const s = kitOf(def).specials;
  for (const k of [slot, ...(FALLBACK[slot] || [])]) if (s[k] && SPECIAL_MOVES[s[k]]) return SPECIAL_MOVES[s[k]];
  return null;
}

// Fire the special the stick selects. Returns true when something came out.
export function doSpecial(f, air = false) {
  const m = specialFor(f.def, specialSlot(f, air));
  if (!m) return false;
  if (m.kind === 'mode' && f.mode?.id === m.name) return false; // modes don't stack
  if (!f.canAfford(m.cost ?? 0)) return false;
  f.ki -= m.cost ?? 0;
  f.spPending = false;
  START[m.kind](f, m);
  return true;
}

// ------------------------------------------------------------------ supers
export function wantsSuper(f) {
  return !!f.pad.b.super?.pressed && f.ki >= 300;
}

// A non-beam ultimate (Heavy + Special): a SUPERS entry named by kit.ultimate (Sasuke's Amaterasu).
// Returns false for the shared beam ultimate.
export function startKitUltimate(f) {
  const id = kitOf(f.def).ultimate;
  if (!id || !SUPERS[id]) return false;
  startSuper(f, id, true);
  return true;
}

// SUPER button: the fighter's second super, or their ultimate when they have none. `ultimate` marks the
// Heavy + Special finisher (only ultimates clash, ADR 0017).
export function startSuper(f, id = kitOf(f.def).super, ultimate = false) {
  const S = id && SUPERS[id];
  if (!S) { f.startUltimate(); return; }
  // fired into the opponent's running ultimate, it answers it: a short flash and windup, so the two can meet
  const answer = ultimate && CLASH_KINDS.has(S.kind) && ultimateLive(f.opp);
  f.ki -= S.cost;
  f.spPending = false;
  f.endMoveFx();
  enter(f, { kind: S.kind, m: S, phase: 'flash', ultimate, answer, at: f.game.frameNo }, S.flashPose ?? S.pose ?? 'superPose');
  if (S.flashPose && S.flashPhase != null) f.actor.setPhase(S.flashPose, S.flashPhase, 0.5);
  if (S.shroud) startShroud(f, S, answer ? CLASH.answerFlash : S.flash); // the chakra swallows him during the flash
  f.invuln = (answer ? CLASH.answerFlash : S.flash) + 12;
  f.vel.set(0, 0, 0);
  f.faceOpponent();
  f.game.onSuperStart(f, S, answer, ultimate);
  // an eye technique's sigil stays up through the flash (and the splash hold) into the move itself
  if (S.sigil) {
    const flash = answer ? CLASH.answerFlash : S.flash + (ultimate ? ULTIMATE.splashHold : 0);
    f.game.fx.sigils.show(f, S.sigil, (flash + (S.delay ?? 0) + 30) / 60);
  }
}

// ------------------------------------------------------------------ clashes (ADR 0017)
// Kit ultimates with a body the other side can meet; the shared beam always clashes. Ignite and reflex ultimates
// have nothing to push against.
const CLASH_KINDS = new Set(['orb', 'rampage']);

export function clashable(def) {
  const id = kitOf(def).ultimate;
  return !id || !SUPERS[id] || CLASH_KINDS.has(SUPERS[id].kind);
}

// A clashable ultimate of theirs is on its way (charging, winding up, or out on the field): an ultimate fired now
// answers it (Fighter.startUltimate, startSuper). Two fired on the same frame are a plain race, not an answer.
export function ultimateLive(f) {
  if (!f || f.ko) return false;
  const now = f.game.frameNo;
  if ((f.state === 'beamCharge' || f.state === 'beamFire') && (f.ultAt ?? -1) < now) return true;
  const k = f.kitState;
  if (f.state === 'kit' && k?.ultimate && CLASH_KINDS.has(k.kind) && (k.at ?? -1) < now && !['maul', 'whiff', 'recover'].includes(k.phase)) return true;
  return f.game.orbs.some((ob) => ob.owner === f && ob.ultimate && !ob.dead && !ob.hit);
}

// windup frames before the body is out: Hollow Purple's merge, the Four-Tails roar (shorter when answering)
export const mergeOf = (k) => (k.answer ? k.m.answerMerge ?? k.m.merge : k.m.merge);
export const roarOf = (k) => (k.answer ? k.m.answerRoar ?? k.m.roar : k.m.roar);

// The Four-Tails pounce as a clash body (Game.ultimateBody), from the roar on: { S, k, dir } (dir: a 2D heading).
export function rushBody(f) {
  const k = f.kitState;
  if (f.state !== 'kit' || !k?.ultimate || k.kind !== 'rampage' || !k.dir || (k.phase !== 'roar' && k.phase !== 'lunge')) return null;
  return { S: k.m, k, dir: k.dir };
}

// Hollow Purple still merging in Gojo's hands is already a clash body (Game.ultimateBody): { S, k, at }
export function formingOrb(f) {
  const k = f.kitState;
  if (f.state !== 'kit' || !k?.ultimate || k.kind !== 'orb' || k.phase !== 'merge') return null;
  return { S: k.m, k, at: new THREE.Vector3(f.pos.x + f.face.x * 0.9, f.pos.y + 0.98, f.pos.z + f.face.y * 0.9) };
}

// a clash caught it mid-merge: it forms right now (Game.startClash)
export function releaseOrb(f) {
  const fo = formingOrb(f);
  return fo && formOrb(f, fo.k, fo.S);
}

// Red and Blue become Purple 0.9 ahead of him, and it rolls out
function formOrb(f, k, S) {
  const g = f.game, id = 'purple' + f.index;
  g.fx.drop(id + 'r');
  g.fx.drop(id + 'b');
  g.fx.drop(id + 'g');
  const ob = g.spawnOrb(f, S, new THREE.Vector3(f.pos.x + f.face.x * 0.9, f.pos.y + 0.98, f.pos.z + f.face.y * 0.9), k.ultimate);
  k.phase = 'fire';
  k.t0 = 0;
  return ob;
}

// a won clash: the pounce went through, so the beast roars it out (the recover phase, still in the shroud)
export function resumeRampage(f, S, k) {
  enter(f, { ...k, phase: 'recover', t0: 0 }, S.pose ?? 'beamCharge');
}

// ------------------------------------------------------------------ beam clashes (ADR 0027)
// Energy moves: the specials that can meet the opponent's energy in a BEAM CLASH (Game.checkEnergyClash), a shot
// whose projectile has `clash: 'beam'` or a rush special with `clash: 'rush'` (driven into the stream by hand).
// [{ slot, m, cost, kind, range }], range = how far it reaches (a shot's flight, a rush's run plus its reach).
const ENERGY_SLOTS = ['neutral', 'forward', 'up', 'down', 'back'], AIR_ENERGY_SLOTS = ['air', 'airDown'];

export const isEnergy = (m) => !!m && (m.kind === 'shot' ? PROJECTILES[m.proj]?.clash === 'beam' : m.kind === 'rush' && m.clash === 'rush');

function energyList(def, slots) {
  const out = [], seen = new Set();
  for (const slot of slots) {
    const m = specialFor(def, slot);
    if (!isEnergy(m) || seen.has(m)) continue;
    seen.add(m);
    const P = PROJECTILES[m.proj];
    const range = m.kind === 'shot' ? P.speed * P.life + 0.8 : (m.rush * m.active) / 60 + (m.reach ?? 1.3);
    out.push({ slot, m, cost: m.cost ?? 0, kind: m.kind, range });
  }
  return out;
}

export function energyMoves(def) {
  return (def._energy ??= energyList(def, ENERGY_SLOTS));
}

export function airEnergyMoves(def) {
  return (def._airEnergy ??= energyList(def, AIR_ENERGY_SLOTS));
}

// Two fighters can beam-clash: both have an energy move and at least one of them is a shot (two rush specials
// meeting are the one-beat special clash instead).
export function canBeamClash(a, b) {
  const all = (d) => [...energyMoves(d), ...airEnergyMoves(d)];
  const A = all(a), B = all(b);
  return A.length > 0 && B.length > 0 && [...A, ...B].some((e) => e.kind === 'shot');
}

// The opponent's energy shot in flight that is heading at f inside CLASH.struggle.answerRange, or null: an energy
// move f starts now meets it (the answer).
export function incomingEnergy(f) {
  const g = f.game, R = CLASH.struggle.answerRange;
  let best = null, bd = R;
  for (const p of g.projectiles) {
    if (p.owner === f || p.dead || p.P.clash !== 'beam') continue;
    const dx = f.pos.x - p.pos.x, dy = f.pos.y + 0.85 - p.pos.y, dz = f.pos.z - p.pos.z, d = dmath.hypot(dx, dy, dz);
    const v = dmath.hypot(p.vel.x, p.vel.y, p.vel.z) || 1;
    const along = (dx * p.vel.x + dy * p.vel.y + dz * p.vel.z) / v;
    if (d > bd || along < 0.6 * d || Math.sqrt(Math.max(0, d * d - along * along)) > 1.6) continue;
    best = p;
    bd = d;
  }
  return best;
}

// The states a fighter can be locked into a beam clash from (not stunned, not mid-dodge, mid-kit move or teleport):
// Game.checkEnergyClash's lock test, here so the CPUs ask the same question before they fire into incoming energy.
export const ENERGY_LOCK = new Set(['attack', 'idle', 'run', 'land', 'guard', 'air', 'dash', 'jumpSquat', 'charge', 'wavedash']);

// Whether an energy move f starts within `lead` frames could still lock a beam clash with the opponent: the guards of
// Game.checkEnergyClash (no clash running, no cooldown, the round live, the opponent free to lock, the two at least
// `minDist` apart, counting the run of a Rasengan / Chidori of theirs meanwhile). An answer fired when none of that
// holds can't clash and just eats the hit, so the CPUs check this first.
export function canBeamClashNow(f, lead = 0) {
  const g = f.game, o = f.opp;
  if (!g || !o || g.clash || g.struggleCool > 0 || !g.inputLive || (g.state !== 'fight' && !g.training)) return false;
  if (o.ko || o.hidden || !ENERGY_LOCK.has(o.state)) return false;
  let gap = dmath.hypot(f.pos.x - o.pos.x, f.pos.z - o.pos.z);
  const m = o.state === 'attack' ? o.move : null;
  if (m?.kind === 'rush' && isEnergy(m) && !o.moveHit) {
    gap -= (Math.max(0, Math.min(o.t + lead, m.startup + m.active) - Math.max(o.t, m.startup)) * m.rush) / 60;
  }
  return gap > CLASH.struggle.minDist;
}

// ------------------------------------------------------------------ passives and modes
// Infinity: projectiles stop before touching Gojo while he can act and has the ki to pay for it
// (PASSIVES.infinity.kiCost per stop, paid by the projectile code).
export function infinityStops(f) {
  return kitOf(f.def).passive === 'infinity' && !f.ko && f.ki >= PASSIVES.infinity.kiCost
    && !['hitstun', 'launched', 'down', 'getup', 'held'].includes(f.state);
}

export function noChip(f) {
  return kitOf(f.def).passive === 'infinity';
}

// Counter stance: the hit is absorbed (returns 'miss') and a melee attacker is frozen for `stagger`
// frames. onCounter: 'freeze' (Infinity: combo them yourself), 'strike' (Sharingan: answer at once
// with `follow`), 'behind' (Substitution: a log takes the hit, reappear behind them with `follow`).
export function counterHit(f, att, m) {
  const C = f.kitState?.m || {};
  f.counterT = 0;
  const g = f.game, p = f.pos;
  const melee = !m.projectileHit && att !== f;
  if (melee) {
    att.endMoveFx();
    att.move = null;
    att.vel.set(0, 0, 0);
    att.heldT = C.stagger ?? 50;
    att.setState('held', 'stagger');
  }
  g.fx.spawn('ring', p.x, p.y + 0.9, p.z, { scale: 1.6, color: C.color ?? 0xd8f2ff, glow: 1.2, depthTest: false, order: 9 });
  g.fx.spawn('glow', p.x, p.y + 0.9, p.z, { scale: 2, color: C.color ?? 0x9fd8ff, opacity: 0.6, glow: 1 });
  g.hud.callout(f.index, C.callout ?? 'COUNTER!', C.color ?? '#d8f2ff');
  g.fx.overlay.flash(C.color ?? '#d8f2ff', 0.35);
  if (C.sigil) g.fx.sigils.burst(f); // the read: the pattern spins up and flares
  g.freeze = Math.max(g.freeze, 6);
  audio.play('block', 1.2);
  if (C.onCounter === 'behind') {
    // the log: a puff where he stood and, with `log`, the log itself left behind; then the teleport (strike from behind)
    if (C.log) g.fx.subLog(p.x, p.y, p.z, f.face.x, f.face.y);
    else burst(g, 'smoke', p.x, p.y + 0.8, p.z, null, 1.3);
    g.fx.debris(p.x, p.z, 4, 0.6);
    START.teleport(f, { kind: 'teleport', hide: C.hide ?? 6, to: 'behind', off: 0.85, ghosts: 0, follow: melee ? C.follow : null, color: C.color });
  } else if (C.onCounter === 'strike' && melee && C.follow) {
    f.kitState = null;
    f.startMove(C.follow, MOVES[C.follow]);
  }
  return 'miss';
}

// Damage over time (Amaterasu): ticks never stun or add to the combo, but can still KO.
export function tickBurn(f) {
  const B = f.burn;
  if (!B) return;
  if (f.ko || --B.t <= 0) { f.burn = null; return; }
  const g = f.game, p = f.renderPos || f.pos;
  if (B.t % 2 === 0) burst(g, 'black', p.x + (Math.random() - 0.5) * 0.7, p.y + 0.3 + Math.random() * 0.9, p.z, null, 0.8 + Math.random() * 0.5);
  if (B.t % B.every === 0) f.dot(B.att, B.dmg);
  if (B.ground && B.t % 40 === 0 && f.pos.y < 0.3) g.fx.ground.impact(f.pos, { kind: 'burn', style: B.ground, tint: B.color, quiet: true, noMerge: true });
}

// Per-frame mode upkeep: timer and the mode's look (Godspeed crackle, Nine-Tails chakra cloak).
export function tickMode(f) {
  const M = f.mode;
  if (!M) return;
  if (--M.t <= 0) {
    f.mode = null;
    return;
  }
  // while powering up the charge style shows the mode instead (its `charge.level` boost, chargeFx.js): no stacking
  if (f.state === 'charge') return;
  const g = f.game, p = f.pos;
  if (M.cloak) {
    // the Nine-Tails Cloak lives on the body (Fighter.sync, Effects.cloakTick): no flame aura around it
  } else if (M.fx === 'chakra') {
    if (f.t % 2 === 0) g.fx.auraTick(f, 0.45, g.cam.right);
  } else if (f.t % 3 === 0) {
    const a = Math.random() * Math.PI * 2;
    g.fx.spawn('lightning', p.x + dmath.cos(a) * 0.35, p.y + 0.3 + Math.random() * 1.1, p.z + dmath.sin(a) * 0.2, { scale: 0.32, random: true, life: 0.08, color: 0xd8f0ff, rot: a, order: 9, glow: 1.6 });
  }
}

// Godspeed dash: a lightning blink instead of a run-up.
export function blinkDash(f, d) {
  const g = f.game;
  f.actor.ghost(f.mode.color || f.def.color, 0.35, 0.6);
  const lim = ARENA_LIMIT;
  const x = THREE.MathUtils.clamp(f.pos.x + d.x * 2.6, -lim, lim), z = THREE.MathUtils.clamp(f.pos.z + d.y * 2.6, -lim, lim);
  g.fx.spawn('lightning', f.pos.x, f.pos.y + 0.8, f.pos.z, { scale: 0.9, random: true, life: 0.12, color: 0xd8f0ff, order: 9, glow: 2 });
  f.teleport(x, f.pos.y, z);
  g.fx.spawn('lightning', x, f.pos.y + 0.8, z, { scale: 0.9, random: true, life: 0.12, color: 0xd8f0ff, order: 9, glow: 2 });
  f.invuln = Math.max(f.invuln, 6);
  audio.play('vanishIn', 0.7);
}

// ------------------------------------------------------------------ Whirlwind (reflex) and the shroud
// Whirlwind upkeep: the timer and the crackle that says "don't swing at him".
export function tickReflex(f) {
  const R = f.reflex;
  if (!R) return;
  if (f.ko || --R.t <= 0 || R.left <= 0) { f.reflex = null; return; }
  const g = f.game, p = f.pos;
  if (R.t % 2 === 0) {
    const a = Math.random() * Math.PI * 2;
    g.fx.spawn('lightning', p.x + dmath.cos(a) * 0.4, p.y + 0.2 + Math.random() * 1.3, p.z + dmath.sin(a) * 0.25, { scale: 0.38, random: true, life: 0.08, color: 0xe8f6ff, rot: a, order: 9, glow: 1.8 });
  }
  if (R.t % 9 === 0) f.actor.ghost(R.m.color, 0.25, 0.4);
}

// Whirlwind answers blockable strikes and shots; supers, ultimates (unblockable), beams and throws get through.
export function reflexReady(f, m) {
  return f.reflex?.left > 0 && !m.beam && !m.unblockable && !f.hidden
    && !['hitstun', 'launched', 'down', 'getup', 'held', 'throw', 'clash'].includes(f.state);
}

// The body moves before the mind: the hit misses, a lightning blink puts him behind the attacker (the thrower,
// for a shot) and the follow strike lands. A melee attacker is frozen long enough for it to connect.
export function reflexCounter(f, att, m) {
  const R = f.reflex, S = R.m, g = f.game, p = f.pos;
  R.left--;
  if (!m.projectileHit && att !== f) {
    att.endMoveFx();
    att.move = null;
    att.vel.set(0, 0, 0);
    att.heldT = 12;
    att.setState('held', 'stagger');
  }
  burst(g, 'lightning', p.x, p.y + 0.9, p.z, 0xd8f0ff, 1.4);
  g.hud.callout(f.index, S.callout ?? S.name, S.color);
  g.fx.overlay.flash(S.color, 0.3);
  g.freeze = Math.max(g.freeze, 4);
  audio.play('vanish', 1.1);
  f.endMoveFx();
  f.move = null;
  START.teleport(f, { kind: 'teleport', hide: S.hide ?? 4, to: 'behind', off: 0.85, ghosts: 2, follow: S.follow, color: S.color });
  return 'miss';
}

// The four-tailed shroud (Four-Tails): during the flash the red-black chakra swallows him from the feet up (the body
// shader's `engulf`, Fighter.sync), then he stays inside it for the whole rampage: `hold` 1 keeps the drawn body a
// boiling silhouette (until Codex's shroud frames ship), 0 lets the drawn shroud frames show; `tails` chakra tails
// lash behind him (Effects.shroudTick). Plain numbers only: f.shroud is saved with the fighter (ADR 0036).
function startShroud(f, S, flash) {
  const C = S.shroud;
  f.shroud = { flash, hold: C.hold ?? 1, tails: C.tails ?? 0, core: C.core, rim: C.rim ?? C.chakra, chakra: C.chakra };
}

// How far the chakra has swallowed him, 0..1: climbing through the first 70 % of his flash, then `hold`.
export function shroudLevel(f) {
  const s = f.shroud;
  if (!s) return 0;
  const F = f.game.superFlash;
  if (F?.who === f && s.flash) return Math.min(1, F.t / (s.flash * 0.7));
  return s.hold;
}

// out of the shroud: the chakra bursts off him and he is himself again (`quiet`: a round reset, no burst)
export function endShroud(f, quiet = false) {
  const s = f.shroud;
  if (!s) return;
  f.shroud = null;
  if (quiet) return;
  const g = f.game, p = f.pos;
  g.fx.poof(p.x, p.y + 0.8, p.z, 1.0);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.fx.spawn('bubble', p.x, p.y + 0.4 + i * 0.15, p.z, { scale: 0.22, color: s.chakra, vel: [dmath.cos(a) * 2.2, 1.6, dmath.sin(a) * 1.2], life: 0.45, fade: true, order: 7 });
  }
  audio.play('vanish', 0.7);
}

// the shroud lasts as long as the rampage (or its clash), whichever way it ends
export function tickShroud(f) {
  if (f.shroud && !((f.state === 'kit' && f.kitState?.kind === 'rampage') || f.state === 'clash')) endShroud(f);
}

// ------------------------------------------------------------------ helpers
function enter(f, k, anim) {
  f.endMoveFx();
  f.move = null;
  f.setState('kit', anim);
  f.kitState = k;
}

// Drive a phased animation like Fighter.updateAttack does (startup / active / recovery).
function pose(f, anim, t, A, B, C) {
  const phase = t < A ? 0 : t < B ? 1 : 2;
  const prog = phase === 0 ? t / Math.max(1, A) : phase === 1 ? (t - A) / Math.max(1, B - A) : (t - B) / Math.max(1, C - B);
  f.actor.setPhase(anim, phase, Math.min(0.999, prog));
}

function finish(f) {
  f.kitState = null;
  f.counterT = 0;
  f.hidden = false;
  f.actor.setVisible(true);
  if (f.pos.y > 0.05) {
    f.air = true;
    f.airAttack = false;
    f.setState('air', 'jumpFall');
  } else f.setState('idle');
}

function dirTo(f, o) {
  tmp.set(o.pos.x - f.pos.x, o.pos.z - f.pos.z);
  if (tmp.lengthSq() < 1e-4) tmp.set(f.face.x, f.face.y);
  return tmp.clone().normalize();
}

// Point at screen-offset `back` (+1 = the side the opponent is not facing) from the opponent.
function besideOpponent(f, back, off) {
  const o = f.opp, R = f.game.basis.right;
  let s = back;
  if (Math.abs(o.pos.x + R.x * s * off) > ARENA_LIMIT || Math.abs(o.pos.z + R.z * s * off) > ARENA_LIMIT) s = -s;
  return {
    x: THREE.MathUtils.clamp(o.pos.x + R.x * s * off, -ARENA_LIMIT, ARENA_LIMIT),
    z: THREE.MathUtils.clamp(o.pos.z + R.z * s * off, -ARENA_LIMIT, ARENA_LIMIT),
  };
}

function inLane(f, o, tol = 1.0) {
  const F = f.game.basis.fwd;
  return Math.abs((o.pos.x - f.pos.x) * F.x + (o.pos.z - f.pos.z) * F.z) < tol;
}

// The Four-Tails roar pose: the drawn roar loop, or one held frame of a stand-in strip (`poseAt`: [phase, progress])
function beastPose(f, S) {
  if (S.poseAt) f.actor.setPhase(S.pose, S.poseAt[0], S.poseAt[1]);
  else loop(f, S.pose ?? 'beamCharge');
}

// ------------------------------------------------------------------ shadow clones (ENG-SKL-NAR)
// A crew is plain data in kitState.crew (crewMember, clones.js); Fighter.sync draws it. Every hit is still the real
// fighter's: the clones are what the anime shows around it.
function crewOut(g, crew) {
  if (!crew) return;
  for (const c of crew) {
    if (!c.vis) continue;
    c.vis = false;
    g.fx.poof(c.x, c.y + 0.8, c.z, 0.55);
  }
}

// a point `r` from the target at angle `a` on the screen plane (depth squashed, so the circle reads on camera)
function around(f, o, a, r) {
  const R = f.game.basis.right, F = f.game.basis.fwd;
  const ox = dmath.cos(a) * r, oz = dmath.sin(a) * r * 0.65;
  return {
    x: THREE.MathUtils.clamp(o.pos.x + R.x * ox + F.x * oz, -ARENA_LIMIT, ARENA_LIMIT),
    z: THREE.MathUtils.clamp(o.pos.z + R.z * ox + F.z * oz, -ARENA_LIMIT, ARENA_LIMIT),
  };
}

function faceAt(c, x, z) {
  const dx = x - c.x, dz = z - c.z, l = dmath.hypot(dx, dz);
  if (l > 1e-3) { c.fx = dx / l; c.fz = dz / l; }
}

// Uzumaki Barrage: `clones` clones poof out beside him and rise with him, kicking up one after another
function riseCrew(f, k, m) {
  const g = f.game, R = g.basis.right;
  if (k.t0 === 1) {
    k.crew = [];
    for (let i = 0; i < m.clones; i++) {
      const s = i % 2 ? 1 : -1, j = (i >> 1) + 1;
      const c = crewMember(f.pos.x + R.x * s * 0.6 * j - f.face.x * 0.35, 0, f.pos.z + R.z * s * 0.6 * j - f.face.y * 0.35, f.face.x, f.face.y, 'specialUp', 0);
      c.ox = R.x * s * 0.6 * j - f.face.x * 0.35;
      c.oz = R.z * s * 0.6 * j - f.face.y * 0.35;
      k.crew.push(c);
      g.fx.poof(c.x, 0.7, c.z, 0.6);
    }
    audio.play('vanish', 0.6);
  }
  if (!k.crew) return;
  k.crew.forEach((c, i) => {
    if (!c.vis) return;
    c.x = f.pos.x + c.ox;
    c.z = f.pos.z + c.oz;
    c.y = f.pos.y * (0.75 + 0.12 * i);
    c.fx = f.face.x;
    c.fz = f.face.y;
    c.pr = THREE.MathUtils.clamp(k.t0 / m.rise - 0.12 * (i + 1), 0, 0.99);
  });
}

// Shadow Clone Barrage (S.crew): the clones poof out in a fan around him as he dashes in and converge on the target
// from every side; caught, they pummel it in turn (S.hits beats, one striker per beat), kick it skyward one clone
// at a time (U-ZU-MA-KI: crew.kicks), and Naruto drops on it from above with a big Rasengan. The dash and the catch
// are the plain flurry's (the CPUs' timing reads them), and a whiff poofs every clone away.
const STRIKES = ['light1', 'light2', 'light4', 'heavy', 'light3'];
function crewFlurry(f, k, S) {
  const g = f.game, o = f.opp, C = S.crew;
  if (k.phase === 'flash') { k.phase = 'dash'; k.t0 = 0; }
  k.t0++;
  if (k.phase === 'dash') {
    const d = dirTo(f, o), R = g.basis.right;
    if (k.t0 === 1) {
      k.crew = [];
      k.base = towardSide(f) > 0 ? Math.PI : 0; // the side of the ring he comes from
      for (let i = 0; i < C.count; i++) {
        const s = i % 2 ? 1 : -1, j = (i >> 1) + 1;
        const x = f.pos.x + R.x * s * 0.8 * j - d.x * 0.3 * j, z = f.pos.z + R.z * s * 0.8 * j - d.y * 0.3 * j;
        const c = crewMember(THREE.MathUtils.clamp(x, -ARENA_LIMIT, ARENA_LIMIT), 0, THREE.MathUtils.clamp(z, -ARENA_LIMIT, ARENA_LIMIT), d.x, d.y, 'dash', 0.5);
        c.a = k.base + s * (0.6 + 0.55 * j); // where on the ring around the target this one ends up
        k.crew.push(c);
        g.fx.poof(c.x, 0.8, c.z, 0.6);
      }
      audio.play('vanish', 0.9);
    }
    f.vel.set(d.x * 24, 0, d.y * 24);
    f.actor.setPhase('dash', 1, 0.5);
    if (k.t0 % 3 === 0) f.actor.ghost(S.color, 0.3, 0.5);
    for (const c of k.crew) {
      const t = around(f, o, c.a, C.ring);
      const dx = t.x - c.x, dz = t.z - c.z, l = dmath.hypot(dx, dz), step = Math.min(l, 26 / 60);
      if (l > 1e-3) { c.x += (dx / l) * step; c.z += (dz / l) * step; }
      faceAt(c, o.pos.x, o.pos.z);
      c.anim = 'dash';
      c.pr = 0.5;
    }
    const reach = f.distTo() < 1.4 && Math.abs(o.pos.y - f.pos.y) < 1.4 && inLane(f, o, 1.3);
    if (reach && o.evading) g.onEvade(o);
    if (reach && !o.ko && !o.hidden && o.invuln <= 0) {
      k.phase = 'hits';
      k.t0 = 0;
      k.i = 0;
      o.endMoveFx();
      o.move = null;
      o.heldT = S.hits * S.every + C.kicks * C.kickEvery + C.drop + 50;
      o.vel.set(0, 0, 0);
      o.setState('held', 'hurtHigh');
      f.vel.set(0, 0, 0);
      g.freeze = Math.max(g.freeze, 4);
      // the ring closes: every clone on its spot around them
      for (const c of k.crew) { const t = around(f, o, c.a, C.ring); c.x = t.x; c.z = t.z; faceAt(c, o.pos.x, o.pos.z); c.anim = 'idle'; }
    } else if (k.t0 > S.dash) {
      crewOut(g, k.crew);
      k.phase = 'land';
      k.t0 = 0;
      f.vel.set(0, 0, 0);
    }
    return;
  }
  if (k.phase === 'hits' || k.phase === 'kick' || k.phase === 'drop') {
    f.vel.set(0, 0, 0);
    if (o.ko) {
      // KO'd mid-barrage: the body flies off on its KO launch; holding it would re-freeze it in the air every hit
      o.heldT = 0;
      crewOut(g, k.crew);
      k.phase = 'land';
      k.t0 = 0;
      f.hidden = false;
      f.actor.setVisible(true);
      f.air = f.pos.y > 0.05;
      return;
    }
  }
  if (k.phase === 'hits') {
    // everyone keeps a ready stance; on each beat one of them darts in and strikes
    for (const c of k.crew) {
      if (!c.vis) continue;
      if (c.hitT > 0 && --c.hitT === 0) { const t = around(f, o, c.a, C.ring); c.x = t.x; c.z = t.z; c.anim = 'idle'; }
      if (c.anim === 'idle') c.pr = (k.t0 / 40 + c.a) % 1;
    }
    f.faceOpponent();
    if (k.t0 % S.every !== 1) return;
    if (k.i < S.hits) {
      const n = k.crew.length + 1, who = k.i % n, kind = STRIKES[k.i % STRIKES.length];
      let at;
      if (who === n - 1) {
        // Naruto himself takes a turn
        const t = around(f, o, k.base, 0.85);
        f.teleport(t.x, o.pos.y, t.z);
        f.faceOpponent();
        f.actor.setPhase(kind, 1, 0.5);
        at = f.pos;
      } else {
        const c = k.crew[who], t = around(f, o, c.a, 0.8);
        c.x = t.x; c.z = t.z; c.y = o.pos.y;
        faceAt(c, o.pos.x, o.pos.z);
        c.anim = kind;
        c.pr = 0.55;
        c.hitT = S.every - 1;
        at = c;
      }
      o.heldT = Math.max(o.heldT, 40);
      f.hitPoint = { x: (at.x + o.pos.x) / 2, y: o.pos.y + 0.9, z: (at.z + o.pos.z) / 2 };
      o.takeHit(f, { dmg: S.hitDmg, minScale: S.minScale, hitstun: 40, push: 0, airPop: 0, hitstop: 3, unblockable: true, spark: 'heavy' }, dirTo(f, o));
      f.hitPoint = null;
      if (!o.ko) o.vel.set(0, 0, 0);
      g.cam.shake(0.25);
      k.i++;
      return;
    }
    k.phase = 'kick';
    k.t0 = 0;
    k.i = 0;
    // the clones not kicking leave; the kickers wait under them
    k.crew.forEach((c, i) => { if (i >= C.kicks) { c.vis = true; crewOut(g, [c]); } });
    return;
  }
  if (k.phase === 'kick') {
    // U-ZU-MA-KI: one clone after another kicks them higher, then is gone in a puff
    o.air = true;
    if ((k.t0 - 1) % C.kickEvery === 0 && k.i < C.kicks) {
      const prev = k.crew[k.i - 1];
      if (prev) crewOut(g, [prev]);
      const c = k.crew[k.i] ?? (k.crew[k.i] = crewMember(o.pos.x, 0, o.pos.z, f.face.x, f.face.y));
      const side = k.i % 2 ? 0.35 : -0.35, R = g.basis.right;
      c.x = o.pos.x + R.x * side;
      c.z = o.pos.z + R.z * side;
      c.y = Math.max(0, o.pos.y - 0.9);
      faceAt(c, o.pos.x - R.x * side * 4, o.pos.z - R.z * side * 4);
      if (!c.vis) { c.vis = true; g.fx.poof(c.x, c.y + 0.8, c.z, 0.5); }
      c.anim = 'specialUp';
      c.pr = 0.4;
      f.hitPoint = { x: o.pos.x, y: o.pos.y + 0.3, z: o.pos.z };
      o.takeHit(f, { dmg: C.kickDmg, minScale: S.minScale, hitstun: 40, push: 0, airPop: 0, hitstop: 2, unblockable: true, spark: 'heavy' }, dirTo(f, o));
      f.hitPoint = null;
      if (C.callout?.[k.i]) g.hud.callout(f.index, C.callout[k.i], S.color);
      g.cam.shake(0.3);
      k.i++;
    }
    if (!o.ko) o.vel.set(0, C.rise / ((C.kicks * C.kickEvery) / 60), 0);
    // the real Naruto is out of sight, ready to drop on them
    if (k.t0 === 1) { f.hidden = true; f.actor.setVisible(false); }
    if (k.t0 >= C.kicks * C.kickEvery) {
      crewOut(g, k.crew);
      k.phase = 'drop';
      k.t0 = 0;
      const d = dirTo(f, o);
      f.teleport(o.pos.x - d.x * 0.6, o.pos.y + 1.7, o.pos.z - d.y * 0.6);
      f.hidden = false;
      f.actor.setVisible(true);
      f.faceOpponent();
      g.onVanish(f, 'in');
      audio.play('rasengan', 0.9);
    }
    return;
  }
  if (k.phase === 'drop') {
    // falling on them with a big Rasengan in his palm, driven down into them
    if (!o.ko) o.vel.set(0, 0, 0);
    const tx = o.pos.x, ty = o.pos.y + 0.55, tz = o.pos.z, left = Math.max(1, C.drop - k.t0 + 1);
    f.pos.x += (tx - f.pos.x) / left;
    f.pos.y += (ty - f.pos.y) / left;
    f.pos.z += (tz - f.pos.z) / left;
    f.actor.setPhase(C.dropPose ?? 'special', 1, 0.6);
    const H = f.actor.hand?.();
    const hx = H ? f.pos.x + f.face.x * H.x : f.pos.x + f.face.x * 0.6, hy = H ? f.pos.y + H.y : f.pos.y + 0.75, hz = H ? f.pos.z + f.face.y * H.x : f.pos.z + f.face.y * 0.6;
    g.fx.keep('crewOrb' + f.index, C.dropFx ?? 'rasengan', hx, hy, hz, { scale: C.dropScale ?? 0.85, order: 9, glow: 0.5 });
    if (k.t0 < C.drop) return;
    g.fx.drop('crewOrb' + f.index);
    o.heldT = 0;
    f.hitPoint = { x: o.pos.x, y: o.pos.y + 0.8, z: o.pos.z };
    o.takeHit(f, { dmg: S.finalDmg, minScale: S.minScale, launch: [3, -22], groundBounce: true, noTech: true, hitstop: 16, unblockable: true, big: true, shake: 1, spark: 'smash', hitFlash: 'special', ground: S.ground, color: S.color }, dirTo(f, o));
    f.hitPoint = null;
    g.fx.blast(C.burstFx ?? 'rasenganBurst', o.pos.x, o.pos.y + 0.7, o.pos.z, 1.3, new THREE.Color(0x6ab4ff));
    g.fx.overlay.impactFrame(3);
    g.cam.shake(1.1);
    g.excite = 1;
    k.phase = 'land';
    k.t0 = 0;
    f.air = true;
    return;
  }
  // land / whiff recovery
  f.vel.x *= 0.7;
  f.vel.z *= 0.7;
  if (f.pos.y > 0.05) { f.vel.y = Math.min(f.vel.y, -6); return; }
  f.actor.setPhase('land', 1, Math.min(0.999, k.t0 / 14));
  if (k.t0 >= 14) finish(f);
}

// ------------------------------------------------------------------ kinds: start
const START = {
  rush(f, m) {
    if (m.selfDmg) f.hp = Math.max(1, f.hp - m.selfDmg); // pre-Sage Rasenshuriken tears his own arm
    // cancelled out of a normal that hit: the faster startup, so light x3 -> special combos (ADR 0015)
    f.startMove('special', f.cancelSpecial && m.cancelStartup ? { ...m, startup: m.cancelStartup } : m);
    answer(f, m);
  },

  shot(f, m) {
    f.startMove(m.air ? 'throw' : 'shot', { ...m, special: false });
    answer(f, m);
    if (m.name) f.game.onKitMove(f, m);
  },

  teleport(f, m) {
    enter(f, { kind: 'teleport', m, from: f.pos.clone() }, m.anim ?? 'vanish');
    f.hidden = !m.startup;
    f.invuln = (m.startup ?? 0) + m.hide + 8;
    f.vel.set(0, 0, 0);
    f.actor.setVisible(!f.hidden);
    // with a wind-up pose (Blink) the puff waits for the moment the fighter actually disappears
    if (f.hidden) vanishFx(f, m);
    f.game.onKitMove(f, m);
  },

  pull(f, m) {
    enter(f, { kind: 'pull', m }, m.anim);
    f.vel.set(0, 0, 0);
    f.faceOpponent();
    f.game.onKitMove(f, m);
  },

  dive(f, m) {
    const startAir = f.pos.y > 0.05;
    const rose = m.rise > 0 && !startAir;
    enter(f, { kind: 'dive', m, phase: rose ? 'rise' : 'hang', t0: 0, rose }, rose ? 'specialUp' : 'airHeavy');
    f.air = true;
    f.faceOpponent();
    f.vel.set(0, m.rise > 0 && !startAir ? m.riseV : 0, 0);
    f.game.onKitMove(f, m);
    audio.play('superJump');
    f.game.fx.dust(f.pos, 1.0);
  },

  counter(f, m) {
    enter(f, { kind: 'counter', m }, m.anim);
    f.vel.set(0, 0, 0);
    f.counterT = m.len;
    const p = f.pos, g = f.game;
    g.fx.spawn('ring', p.x, p.y + 0.9, p.z, { scale: 1.1, color: m.color ?? 0xd8f2ff, glow: 0.8, order: 8 });
    // an eye technique (data: `sigil`, `eyeFlash`): the pattern behind the fighter for the stance, the eyes in the HUD
    if (m.sigil) g.fx.sigils.show(f, m.sigil, (m.len + m.recovery) / 60);
    if (m.eyeFlash) g.hud.eyeFlash(f.index, f.asset?.cutin, m.color ?? f.def.color);
    audio.play('flash', 0.6);
  },

  mode(f, m) {
    enter(f, { kind: 'mode', m }, m.anim);
    f.vel.set(0, 0, 0);
  },
};

// An energy move started while their energy shot heads at us answers it (ADR 0027): Game.checkEnergyClash locks the
// two together even if the shot drifts out of the answer cone before our move is out. Only for this move.
function answer(f, m) {
  f.answering = isEnergy(m) ? incomingEnergy(f) : null;
  f.answerMove = f.move;
}

// afterimage, smoke puff, speed lines and sound where a teleporting fighter disappears
function vanishFx(f, m) {
  const g = f.game;
  f.actor.ghost(m.color || f.def.color, 0.35, 0.6);
  g.fx.smoke(f.pos.x, f.pos.y + 0.6, f.pos.z, 0.9);
  g.fx.spawn('lines', f.pos.x, f.pos.y + 0.8, f.pos.z, { scale: 1.1, glow: 0.6, depthTest: false, order: 8 });
  audio.play('vanish');
}

// ------------------------------------------------------------------ kinds: per frame
export function update(f) {
  const k = f.kitState;
  if (!k) return finish(f);
  UPDATE[k.kind](f, k, k.m, f.t);
}

const UPDATE = {
  teleport(f, k, m, t) {
    const startup = m.startup ?? 0, recovery = m.recovery ?? 0;
    if (t < startup) {
      f.actor.setPhase(m.anim ?? 'vanish', 0, t / startup);
      return;
    }
    if (t < startup + m.hide) {
      if (!f.hidden) vanishFx(f, m);
      f.hidden = true;
      f.actor.setVisible(false);
      return;
    }
    if (!k.arrived) {
      const g = f.game, o = f.opp;
      const pos = besideOpponent(f, -o.side, m.off);
      const y = m.to === 'above' ? o.pos.y + m.height : o.pos.y;
      // afterimages along the path (Rhythm Echo)
      for (let i = 1; i <= (m.ghosts || 0); i++) {
        const a = i / (m.ghosts + 1);
        f.actor.place(k.from.x + (pos.x - k.from.x) * a, k.from.y + (y - k.from.y) * a, k.from.z + (pos.z - k.from.z) * a);
        f.actor.ghost(m.color || f.def.color, 0.45, 0.5);
      }
      f.teleport(pos.x, y, pos.z);
      f.actor.place(pos.x, y, pos.z);
      f.hidden = false;
      f.actor.setVisible(true);
      f.faceOpponent();
      g.onVanish(f, 'in');
      k.arrived = true;
    }
    if (t < startup + m.hide + recovery) {
      f.actor.setPhase(m.anim, 2, (t - startup - m.hide) / recovery);
      return;
    }
    const y = f.pos.y;
    f.kitState = null;
    if (m.follow) {
      f.air = y > 0.05;
      f.startMove(m.follow, { ...MOVES[m.follow], hover: f.air });
    } else {
      f.air = y > 0.05;
      f.vel.set(0, 1.5, 0);
      f.airAttack = false;
      f.airDashes = 0;
      if (f.air) f.setState('air', 'jumpFall');
      else f.setState('idle');
    }
  },

  pull(f, k, m, t) {
    const A = m.startup, C = m.startup + m.recovery;
    pose(f, m.anim, t, A, A + 2, C);
    if (t === A) f.game.spawnVortex(f, m);
    if (t >= C) finish(f);
  },

  dive(f, k, m) {
    const o = f.opp;
    k.t0++;
    if (k.phase === 'rise') {
      // leap toward the opponent; the rising body is an anti-air hit
      const frames = m.rise + m.hang;
      const d = dirTo(f, o), dist = f.distTo();
      const sp = Math.min(14, Math.max(0, dist - 0.4) / (frames / 60));
      f.vel.x = d.x * sp;
      f.vel.z = d.y * sp;
      f.vel.y = m.riseV * (1 - k.t0 / m.rise) + 2;
      if (m.clones) riseCrew(f, k, m);
      f.actor.setPhase('specialUp', k.t0 < m.rise * 0.4 ? 0 : 1, Math.min(0.999, k.t0 / m.rise));
      if (m.riseHit && !k.riseHit && o.hittable && f.distTo() < 1.25 && Math.abs(o.pos.y - f.pos.y) < 1.4 && inLane(f, o)) {
        k.riseHit = true;
        o.takeHit(f, m.riseHit, dirTo(f, o));
        if (m.riseCallout) f.game.hud.callout(f.index, m.riseCallout, m.color);
      }
      if (k.t0 >= m.rise) { k.phase = 'hang'; k.t0 = 0; crewOut(f.game, k.crew); }
      return;
    }
    if (k.phase === 'hang') {
      if (k.crew) crewOut(f.game, k.crew); // an air dive skips the rise
      f.vel.set(0, 0.5, 0);
      f.faceOpponent();
      // a ground dive turns over on specialUp's last frames (drawn to flow into airHeavy f0)
      if (k.rose) f.actor.setPhase('specialUp', 2, Math.min(0.999, k.t0 / m.hang));
      else f.actor.setPhase('airHeavy', 0, Math.min(0.999, k.t0 / m.hang));
      if (k.t0 >= m.hang) {
        k.phase = 'slam';
        k.t0 = 0;
        audio.play('whooshHeavy');
      }
      return;
    }
    if (k.phase === 'slam') {
      const d = dirTo(f, o);
      const fall = Math.max(4, (f.pos.y / -m.slamV) * 60);
      // home in at up to ~45 degrees: a deeper dive from higher up, like a DBFZ dive kick
      const sp = Math.min(-m.slamV * 0.9, Math.max(0, f.distTo() - 0.5) / (fall / 60));
      f.vel.set(d.x * sp, m.slamV, d.y * sp);
      f.actor.setPhase('airHeavy', 1, 0.5);
      if (k.t0 > 90) finish(f); // safety: never hang forever
      return;
    }
    // 'land': recovery
    f.vel.x *= 0.6;
    f.vel.z *= 0.6;
    f.actor.setPhase('land', 1, Math.min(0.999, k.t0 / m.recovery));
    if (k.t0 >= m.recovery) finish(f);
  },

  counter(f, k, m, t) {
    pose(f, m.anim, t, 3, m.len, m.len + m.recovery);
    if (t >= m.len) f.counterT = 0;
    if (t >= m.len + m.recovery) finish(f);
  },

  mode(f, k, m, t) {
    pose(f, m.anim, t, m.startup - 2, m.startup, m.startup + m.recovery);
    if (t === m.startup) {
      f.mode = {
        id: m.name, t: m.len, len: m.len, speed: m.speed ?? 1, damage: m.damage ?? 1, defense: m.defense ?? 1,
        blinkDash: !!m.blinkDash, color: m.color, fx: m.fx ?? 'lightning', auraColor: m.auraColor, auraCore: m.auraCore, charge: m.charge,
        cloak: m.cloak ?? null,
      };
      const g = f.game, p = f.pos;
      g.onKitMove(f, m);
      g.fx.burstAt(f, m.auraColor ?? m.color, 1.4);
      if (m.cloak) g.fx.cloakBurst(f, m.cloak); // the chakra wells up over him all at once
      else if (f.mode.fx === 'chakra') for (let i = 0; i < 8; i++) burst(g, 'chakra', p.x + (Math.random() - 0.5) * 1.2, p.y + 0.5, p.z, m.auraColor, 1.4);
      else burst(g, 'lightning', p.x, p.y + 0.9, p.z, 0xd8f0ff, 1.6);
      g.fx.overlay.flash(m.auraColor ?? m.color, 0.35);
      audio.play('kiFull');
    }
    if (t >= m.startup + m.recovery) finish(f);
  },

  // ---- Godspeed: Whirlwind (Killua): lightning dash; on contact the opponent is held and
  // struck from every direction, then slammed into the floor
  flurry(f, k, S) {
    if (S.crew) return crewFlurry(f, k, S);
    const g = f.game, o = f.opp;
    if (k.phase === 'flash') { k.phase = 'dash'; k.t0 = 0; }
    k.t0++;
    if (k.phase === 'dash') {
      const d = dirTo(f, o);
      f.vel.set(d.x * 24, 0, d.y * 24);
      f.actor.setPhase('dash', 1, 0.5);
      if (k.t0 % 2 === 0) f.actor.ghost(S.color, 0.3, 0.6);
      const reach = f.distTo() < 1.4 && Math.abs(o.pos.y - f.pos.y) < 1.4 && inLane(f, o, 1.3);
      if (reach && o.evading) g.onEvade(o);
      const hit = reach && !o.ko && !o.hidden && o.invuln <= 0;
      if (hit) {
        k.phase = 'hits';
        k.t0 = 0;
        k.i = 0;
        o.endMoveFx();
        o.move = null;
        o.heldT = S.hits * S.every + 50;
        o.vel.set(0, 0, 0);
        o.setState('held', 'hurtHigh');
        f.vel.set(0, 0, 0);
        f.hidden = true;
        f.actor.setVisible(false);
        g.freeze = Math.max(g.freeze, 4);
      } else if (k.t0 > S.dash) {
        k.phase = 'land';
        k.t0 = 0;
        f.vel.set(0, 0, 0);
      }
      return;
    }
    if (k.phase === 'hits') {
      f.vel.set(0, 0, 0);
      if (o.ko) {
        // KO'd mid-flurry: the body flies off on its KO launch; holding it would re-freeze it in the air every hit
        o.heldT = 0;
        k.phase = 'land';
        k.t0 = 0;
        f.hidden = false;
        f.actor.setVisible(true);
        f.air = true;
        return;
      }
      if (k.t0 % S.every !== 1) return;
      if (k.i < S.hits) {
        if (S.front) {
          // a blur of fists from one spot in front of them (Jet Gatling), not strikes from every side
          const d = (k.dir ??= dirTo(f, o));
          f.teleport(o.pos.x - d.x * 0.95, o.pos.y, o.pos.z - d.y * 0.95);
        } else {
          const R = g.basis.right, F = g.basis.fwd, a = k.i * 2.39996 + 0.6;
          const ox = dmath.cos(a) * 1.05, oz = dmath.sin(a) * 0.7;
          f.teleport(o.pos.x + R.x * ox + F.x * oz, o.pos.y + (k.i % 3) * 0.35, o.pos.z + R.z * ox + F.z * oz);
        }
        f.hidden = false;
        f.actor.setVisible(true);
        f.faceOpponent();
        f.actor.setPhase(k.i % 2 ? 'light2' : 'light4', 1, 0.5);
        f.actor.ghost(S.color, 0.4, 0.55);
        o.heldT = Math.max(o.heldT, 30);
        o.takeHit(f, { dmg: S.hitDmg, minScale: S.minScale, hitstun: 40, push: 0, airPop: 0, hitstop: 3, unblockable: true, spark: 'heavy' }, dirTo(f, o));
        if (!o.ko) o.vel.set(0, 0, 0); // a KO keeps its launch
        burst(g, S.hitFx ?? 'lightning', o.pos.x, o.pos.y + 0.9, o.pos.z, S.hitColor ?? 0xd8f0ff, 1.1);
        g.cam.shake(0.25);
        k.i++;
        return;
      }
      o.heldT = 0;
      if (S.front) {
        // final: one last straight punch from in front that sends them flying into the wall
        f.faceOpponent();
        f.actor.setPhase('heavy', 1, 0.5);
        o.takeHit(f, { dmg: S.finalDmg, minScale: S.minScale, launch: S.finalLaunch ?? [20, 9], wallBounce: true, noTech: true, hitstop: 16, unblockable: true, big: true, shake: 1, spark: 'smash', hitFlash: 'special', ground: S.ground, color: S.color }, dirTo(f, o));
      } else {
        // final: from above, slammed into the floor
        f.teleport(o.pos.x, o.pos.y + 2.4, o.pos.z);
        f.faceOpponent();
        f.actor.setPhase('airHeavy', 1, 0.5);
        o.takeHit(f, { dmg: S.finalDmg, minScale: S.minScale, launch: [3, -22], groundBounce: true, noTech: true, hitstop: 16, unblockable: true, big: true, shake: 1, spark: 'smash', hitFlash: 'special', ground: S.ground, color: S.color }, dirTo(f, o));
      }
      if (S.finalFx === 'impact') g.fx.explosion(o.pos.x, o.pos.y + 0.9, o.pos.z, new THREE.Color(S.finalColor ?? 0xffffff));
      else g.fx.thunder(o.pos.x, o.pos.z, 0xd8f0ff);
      g.fx.overlay.impactFrame(3);
      g.cam.shake(1.1);
      g.excite = 1;
      k.phase = 'land';
      k.t0 = 0;
      f.air = true;
      return;
    }
    // land / whiff recovery
    f.vel.x *= 0.7;
    f.vel.z *= 0.7;
    if (f.pos.y > 0.05) { f.vel.y = Math.min(f.vel.y, -6); return; }
    f.actor.setPhase('land', 1, Math.min(0.999, k.t0 / 14));
    if (k.t0 >= 14) finish(f);
  },

  // ---- Amaterasu (Sasuke): the Mangekyō gaze ignites black flames on the opponent wherever they
  // stand (no range, no block); they keep burning (tickBurn) while the fight goes on
  ignite(f, k, S) {
    const g = f.game, o = f.opp;
    if (k.phase === 'flash') { k.phase = 'gaze'; k.t0 = 0; }
    k.t0++;
    f.actor.setPhase('superPose', 1, 0.5);
    if (k.t0 === S.delay) {
      if (!o.ko && !o.hidden && o.invuln <= 0) {
        o.takeHit(f, { dmg: S.dmg, minScale: 1, launch: S.launch, noTech: true, hitstop: 14, unblockable: true, big: true, shake: 0.8, spark: 'heavy', hitFlash: 'special' }, dirTo(f, o));
        // color: the hit flash rim per tick and the burn mark's tint; ground: the floor style under a burning body
        o.burn = { t: S.burn.len, every: S.burn.every, dmg: S.burn.dmg, att: f, ground: S.ground, color: S.color };
        if (o.pos.y < 0.3) g.fx.ground.impact(o.pos, { kind: 'ignite', style: S.ground, tint: S.color, quiet: true });
        for (let i = 0; i < 10; i++) burst(g, 'black', o.pos.x + (Math.random() - 0.5) * 1.1, o.pos.y + Math.random() * 1.2, o.pos.z, null, 1.6);
        g.hud.callout(f.index, S.callout ?? S.name, S.color);
        g.fx.overlay.flash('#000000', 0.5);
        audio.play('fireball', 1.2);
      } else {
        g.hud.callout(f.index, 'MISS', S.color);
        if (o.evading) g.onEvade(o);
      }
    }
    if (k.t0 >= S.delay + S.recovery) finish(f);
  },

  // ---- Kirin (Sasuke): the storm marks where the opponent stands and a lightning dragon strikes
  // that spot `delay` frames later. Huge and unblockable, but they can still dash out of it.
  skyStrike(f, k, S) {
    const g = f.game, o = f.opp;
    if (k.phase === 'flash') { k.phase = 'mark'; k.t0 = 0; k.at = o.pos.clone(); }
    k.t0++;
    if (k.phase === 'mark') {
      f.actor.setPhase(S.pose ?? 'beamCharge', 1, 0.5);
      const a = k.at;
      g.fx.keep('kirin' + f.index, 'glow', a.x, 0.1, a.z, { scale: S.radius * (1 + 0.15 * dmath.sin(k.t0 * 0.5)), color: S.color, opacity: 0.55, order: 2, glow: 1 });
      if (k.t0 % 5 === 0) g.fx.spawn('lightning', a.x + (Math.random() - 0.5) * 1.4, 3.2 + Math.random(), a.z, { scale: 0.9, random: true, life: 0.1, color: 0xd8f0ff, order: 9, glow: 2 });
      if (k.t0 >= S.delay) {
        g.fx.drop('kirin' + f.index);
        g.fx.thunder(a.x, a.z, 0xd8f0ff);
        g.fx.thunder(a.x + 0.4, a.z, 0x9fd8ff);
        g.fx.explosion(a.x, 0.8, a.z, new THREE.Color(0x9fd8ff));
        g.fx.ground.impact(a, { kind: 'kirin', style: S.ground, tint: S.color, d: S.radius * 3.2 });
        g.fx.overlay.impactFrame(4);
        g.cam.shake(1.2);
        audio.play('explosion', 1.3);
        const dx = o.pos.x - a.x, dz = o.pos.z - a.z;
        if (o.hittable && dmath.hypot(dx, dz) < S.radius && o.pos.y < 3) {
          const d = tmp.set(dx, dz);
          if (d.lengthSq() < 1e-4) d.set(f.face.x, f.face.y);
          o.takeHit(f, { dmg: S.dmg, minScale: 1, launch: S.launch, noTech: true, hitstop: 18, unblockable: true, big: true, shake: 1, spark: 'smash', hitFlash: 'special' }, d.clone().normalize());
          g.excite = 1;
        } else g.tag(o, 'dodge');
        k.phase = 'recover';
        k.t0 = 0;
      }
      return;
    }
    f.actor.setPhase(S.strikePose ?? 'beamFire', 1, 0.5);
    if (k.t0 >= S.recovery) finish(f);
  },

  // ---- Domain Expansion: Unlimited Void (Gojo): the stage becomes the void and the opponent is
  // frozen; Gojo is free to combo until it collapses
  domain(f, k, S) {
    const g = f.game;
    if (k.phase === 'flash') {
      k.phase = 'cast';
      k.t0 = 0;
      g.startDomain(f, S);
    }
    k.t0 = (k.t0 || 0) + 1;
    f.actor.setPhase('superPose', 1, 0.5);
    if (k.t0 >= 12) finish(f);
  },

  // ---- Hollow Purple (Gojo): Red (near hand) and Blue (far hand) drift together in front of him and fuse;
  // the orb then rolls on by itself (Orb in projectiles.js) while he recovers
  orb(f, k, S) {
    const g = f.game, id = 'purple' + f.index;
    if (k.phase === 'flash') { k.phase = 'merge'; k.t0 = 0; }
    k.t0++;
    if (k.phase === 'merge') {
      loop(f, S.pose ?? 'beamCharge');
      // the drawn hands hold the two orbs (Gojo's beamCharge: near hand 0.58 behind, far hand 0.59 ahead,
      // 1.06 up); they meet 0.9 ahead of him
      const a = Math.min(1, k.t0 / mergeOf(k)), e = a * a * (3 - 2 * a);
      const at = (fwd) => ({ x: f.pos.x + f.face.x * fwd, y: f.pos.y + 1.06 - 0.08 * e, z: f.pos.z + f.face.y * fwd });
      const r = at(-0.58 + 1.48 * e), b = at(0.59 + 0.31 * e);
      const s = 0.42 + 0.25 * e + 0.04 * dmath.sin(k.t0 * 0.9);
      g.fx.keep(id + 'r', 'orb', r.x, r.y, r.z, { scale: s, color: S.red, order: 8, glow: 1.3 });
      g.fx.keep(id + 'b', 'orb', b.x, b.y, b.z, { scale: s, color: S.blue, order: 8, glow: 1.3 });
      g.fx.keep(id + 'g', 'glow', (r.x + b.x) / 2, r.y, (r.z + b.z) / 2, { scale: 0.6 + 1.6 * e, color: S.glow, opacity: 0.35 + 0.4 * e, order: 3, glow: 1 });
      if (k.t0 % 4 === 0) g.fx.spawn('lightning', (r.x + b.x) / 2, r.y, (r.z + b.z) / 2, { scale: 0.4 + 0.5 * e, random: true, life: 0.08, color: 0xe0c0ff, rot: Math.random() * 6.28, order: 9, glow: 1.6 });
      if (k.t0 === 1) audio.play('beamCharge', 0.8);
      if (a >= 1) formOrb(f, k, S);
      return;
    }
    loop(f, S.strikePose ?? 'beamFire');
    if (k.t0 >= S.recovery) finish(f);
  },

  // ---- Four-Tails (Naruto): a roar inside the shroud, a pounce on all fours, and a mauling for what it catches
  rampage(f, k, S) {
    const g = f.game, o = f.opp, C = S.shroud;
    if (k.phase === 'flash') {
      k.phase = 'roar';
      k.t0 = 0;
      // the pounce commits to where they stand as the roar starts (a little steering only): leaving the lane
      // during the roar dodges it, like a beam
      k.dir = dirTo(f, o);
      const p = f.pos;
      g.fx.spawn('ring', p.x, p.y + 0.8, p.z, { scale: 3.2, color: C.chakra, glow: 1, order: 8, depthTest: false });
      g.fx.spawn('fourTailsRoar', p.x, p.y + 0.8, p.z, { scale: 1.5, order: 8, depthTest: false });
      g.fx.debris(p.x, p.z, 10, 1.1);
      g.cam.shake(0.9);
      audio.play('smash', 0.9);
    }
    k.t0++;
    if (k.phase === 'roar') {
      beastPose(f, S);
      if (k.t0 >= roarOf(k)) { k.phase = 'lunge'; k.t0 = 0; k.from = f.pos.clone(); audio.play('superDash'); }
      return;
    }
    if (k.phase === 'lunge') {
      const want = dirTo(f, o), d = k.dir;
      d.x += (want.x - d.x) * (S.steer ?? 0.03);
      d.y += (want.y - d.y) * (S.steer ?? 0.03);
      d.normalize();
      f.vel.set(d.x * S.speed, 0, d.y * S.speed);
      f.face.set(d.x, d.y);
      loop(f, S.strikePose ?? 'beamFire');
      if (k.t0 % 3 === 0) f.actor.ghost(C.chakra, 0.3, 0.55);
      const reach = f.distTo() < 1.35 && Math.abs(o.pos.y - f.pos.y) < 1.4 && inLane(f, o, 1.0);
      // a dodge holding him off is only called out once the pounce really missed (the bodies still collide, so he
      // can wait it out in front of them and catch them as the dodge ends)
      if (reach && o.evading) k.slip = true;
      else if (!reach && k.slip) { k.slip = false; g.onEvade(o); }
      const catchable = !o.ko && !o.hidden && o.invuln <= 0 && o.state !== 'down' && o.state !== 'getup';
      if (catchable && reach) {
        k.phase = 'maul';
        k.t0 = 0;
        k.i = 0;
        o.endMoveFx();
        o.move = null;
        o.heldT = S.slams * S.every + 40;
        o.vel.set(0, 0, 0);
        o.setState('held', 'hurtHigh');
        f.vel.set(0, 0, 0);
        g.freeze = Math.max(g.freeze, 5);
        g.cam.shake(0.6);
        return;
      }
      if (k.t0 > S.dash || dmath.hypot(f.pos.x - k.from.x, f.pos.z - k.from.z) > S.range) {
        if (k.slip) g.onEvade(o);
        k.phase = 'whiff';
        k.t0 = 0;
        f.vel.set(0, 0, 0);
      }
      return;
    }
    if (k.phase === 'maul') {
      f.vel.set(0, 0, 0);
      if (o.ko) {
        // KO'd by a slam: let the body fly on its KO launch instead of pinning it for the rest of the mauling
        o.heldT = 0;
        k.phase = 'recover';
        k.t0 = 0;
        return;
      }
      if (k.t0 % S.every !== 1) return;
      const d = dirTo(f, o), p = o.pos;
      if (k.i < S.slams) {
        f.actor.setPhase(S.maulPose ?? 'heavy', S.maulPhase ?? 1, 0.5); // the claw-strike frame
        o.heldT = Math.max(o.heldT, 30);
        o.takeHit(f, { dmg: S.slamDmg, minScale: S.minScale, hitstun: 40, push: 0, airPop: 0, hitstop: 5, unblockable: true, spark: 'smash', shake: 0.6 }, d);
        if (!o.ko) o.vel.set(0, 0, 0); // a KO keeps its launch
        burst(g, 'chakra', p.x, p.y + 0.4, p.z, C.chakra, 1.6);
        g.fx.ground.impact(p, { kind: 'slam', style: S.ground, tint: C.chakra, dir: d });
        g.cam.shake(0.55);
        k.i++;
        return;
      }
      // the chakra roar, point blank: it blasts them into the barrier
      o.heldT = 0;
      f.actor.setPhase(S.pose ?? 'beamCharge', 1, 0.5);
      o.takeHit(f, { dmg: S.finalDmg, minScale: S.minScale, launch: S.launch, wallBounce: true, noTech: true, hitstop: 18, unblockable: true, big: true, shake: 1.2, spark: 'smash', hitFlash: 'special' }, d);
      g.fx.spawn('ring', f.pos.x, f.pos.y + 0.9, f.pos.z, { scale: 3.6, color: C.chakra, glow: 1.2, order: 8, depthTest: false });
      g.fx.spawn('fourTailsRoar', f.pos.x + d.x * 0.6, f.pos.y + 0.9, f.pos.z + d.y * 0.6, { scale: 1.8, order: 8, depthTest: false });
      g.fx.explosion(p.x, p.y + 0.9, p.z, new THREE.Color(C.chakra));
      g.fx.ground.impact(f.pos, { kind: 'roar', style: S.roarGround, tint: C.chakra, dir: d, origin: true, noMerge: true });
      g.fx.overlay.impactFrame(4);
      g.fx.overlay.flash('#ff2010', 0.5);
      g.cam.shake(1.2);
      audio.play('explosion', 1.3);
      g.excite = 1;
      k.phase = 'recover';
      k.t0 = 0;
      return;
    }
    // whiff / recover: still in the shroud, and wide open after a whiff
    f.vel.x *= 0.7;
    f.vel.z *= 0.7;
    beastPose(f, S);
    if (k.t0 >= (k.phase === 'whiff' ? S.whiff : 18)) finish(f);
  },

  // ---- Whirlwind (Killua): Godspeed switches to reflex; the counters themselves happen in reflexCounter
  reflex(f, k, S) {
    const g = f.game;
    if (k.phase === 'flash') {
      k.phase = 'set';
      k.t0 = 0;
      f.reflex = { t: S.len, left: S.counters, m: S };
      const p = f.pos;
      burst(g, 'lightning', p.x, p.y + 0.9, p.z, 0xd8f0ff, 1.8);
      g.fx.spawn('ring', p.x, p.y + 0.9, p.z, { scale: 2.2, color: S.color, glow: 1.2, order: 8, depthTest: false });
      g.fx.overlay.flash(S.color, 0.35);
      audio.play('kiFull');
    }
    k.t0++;
    loop(f, S.pose ?? 'beamCharge');
    if (k.t0 >= S.recovery) finish(f);
  },

  // ---- Gigant Pistol (Luffy, ADR 0032): the arm blows up during `windup`, then the giant fist shoots down his lane
  // to `reach` in `extend` frames. It commits to the lane he faces when the punch leaves: leave the lane or be in the
  // air above `height` and it misses. One unblockable hit, then the arm snaps back during `recovery`.
  laneStrike(f, k, S) {
    const g = f.game, o = f.opp, id = 'fist' + f.index;
    if (k.phase === 'flash') { k.phase = 'windup'; k.t0 = 0; audio.play('beamCharge', 0.8); }
    k.t0++;
    if (k.phase === 'windup') {
      loop(f, S.pose ?? 'beamCharge');
      if (k.t0 % 6 === 1) g.fx.smoke(f.pos.x - f.face.x * 0.3, f.pos.y + 1.0, f.pos.z - f.face.y * 0.3, 0.5);
      if (k.t0 >= S.windup) {
        k.phase = 'punch';
        k.t0 = 0;
        k.dir = new THREE.Vector2(f.face.x, f.face.y);
        audio.play('whooshHeavy', 1.2);
        g.cam.shake(0.5);
      }
      return;
    }
    if (k.phase === 'punch') {
      loop(f, S.strikePose ?? 'beamFire');
      const d = k.dir, ext = S.reach * Math.min(1, k.t0 / S.extend);
      const x = f.pos.x + d.x * (0.6 + ext), z = f.pos.z + d.y * (0.6 + ext);
      g.fx.keep(id, 'orb', x, f.pos.y + 1.0, z, { scale: S.fist.scale, color: S.fist.color, order: 8, glow: 0 });
      if (k.t0 % 2 === 0) g.fx.spawn('lines', x, f.pos.y + 1.0, z, { scale: 1.4, glow: 0.4, depthTest: false, order: 8 });
      // along the lane (0 at his body, out to the fist) and across it
      const rx = o.pos.x - f.pos.x, rz = o.pos.z - f.pos.z;
      const along = rx * d.x + rz * d.y, across = Math.abs(rx * d.y - rz * d.x);
      if (!k.hit && o.hittable && along > 0 && along < 0.6 + ext + S.width * 0.5 && across < S.width && o.pos.y - f.pos.y < S.height) {
        k.hit = true;
        o.takeHit(f, { dmg: S.dmg, minScale: 1, launch: S.launch, wallBounce: true, noTech: true, hitstop: 18, unblockable: true, big: true, shake: 1.2, spark: 'smash', hitFlash: 'special' }, d.clone());
        g.fx.explosion(o.pos.x, o.pos.y + 0.9, o.pos.z, new THREE.Color(S.color));
        g.fx.ground.impact(o.pos, { kind: 'slam', style: S.ground, tint: S.color, dir: d });
        g.fx.overlay.impactFrame(4);
        g.cam.shake(1.2);
        audio.play('explosion', 1.3);
        g.excite = 1;
      }
      if (k.t0 >= S.extend + 6) {
        if (!k.hit) { g.tag(o, 'dodge'); if (o.evading) g.onEvade(o); }
        g.fx.drop(id);
        k.phase = 'recover';
        k.t0 = 0;
      }
      return;
    }
    loop(f, S.strikePose ?? 'beamFire');
    if (k.t0 >= S.recovery) finish(f);
  },
};

// ------------------------------------------------------------------ landing / gravity
export function onLand(f) {
  const k = f.kitState;
  if (!k) return finish(f);
  if (k.kind === 'dive' && k.phase === 'slam') {
    const g = f.game, o = f.opp, m = k.m;
    const hit = o.hittable && f.distTo() < m.area && Math.abs(o.pos.y - f.pos.y) < 1.3 && inLane(f, o, 1.1) ? o.takeHit(f, m.hit, dirTo(f, o)) : null;
    if (m.landFx === 'thunder') g.fx.thunder(f.pos.x, f.pos.z, 0xd8f0ff);
    else g.fx.dust(f.pos, 1.6);
    g.fx.ground.dive(f, m, hit === 'hit');
    g.cam.shake(0.8);
    audio.play('explosion', 0.9);
    k.phase = 'land';
    k.t0 = 0;
    return;
  }
  if (k.kind === 'flurry') return; // keeps its own recovery
  if (k.kind === 'teleport') return;
  if (k.kind === 'rampage' || k.kind === 'orb' || k.kind === 'reflex' || k.kind === 'laneStrike') return; // their phases run to the end
  finish(f);
}

export function gravityScale(f) {
  const k = f.kitState;
  if (!k) return 1;
  if (k.kind === 'dive' || k.kind === 'teleport') return 0;
  if (k.kind === 'flurry') return k.phase === 'land' ? 1 : 0;
  if (k.kind === 'orb' || k.kind === 'reflex' || k.kind === 'laneStrike') return 0; // cast where they stand, in the air too
  if (k.kind === 'rampage') return k.phase === 'whiff' || k.phase === 'recover' ? 1 : 0;
  return 1;
}

// ------------------------------------------------------------------ recovery
// Past the kit move's startup and active frames: a hit now punishes a whiff or a recovery instead of interrupting
// the move, so the hit flash plays it as a normal hit, not a counter hit (hitFlash.js). One test per kind; a kind
// without one never counts as recovering.
const RECOVERING = {
  teleport: (k, m, t) => t >= (m.startup ?? 0) + m.hide, // arrived
  pull: (k, m, t) => t > m.startup, // the vortex is out
  dive: (k) => k.phase === 'land',
  counter: (k, m, t) => t >= m.len, // the stance is over (counterT 0)
  mode: (k, m, t) => t > m.startup, // the mode is on
  flurry: (k) => k.phase === 'land',
  ignite: (k, m) => k.t0 > m.delay, // the flames are lit
  skyStrike: (k) => k.phase === 'recover',
  domain: (k) => k.phase === 'cast', // the void is up
  orb: (k) => k.phase === 'fire', // the orb rolls on by itself
  rampage: (k) => k.phase === 'whiff' || k.phase === 'recover',
  reflex: (k) => k.phase === 'set',
  laneStrike: (k) => k.phase === 'recover', // the arm is snapping back
};

export function inRecovery(f) {
  const k = f.kitState;
  return f.state === 'kit' && !!k && !!RECOVERING[k.kind]?.(k, k.m, f.t);
}
