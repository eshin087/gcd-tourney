// Test lab scripts (ADR 0018): input timelines that drive a fighter's Pad frame by frame, the way a CPU brain does,
// so one tap plays a move or a whole scenario exactly the same way every time. Everything is read from the fighter
// data (kits, MOVES, SPECIAL_MOVES, SUPERS), so a new fighter or a new move shows up here without lab changes.
import { PAD_INPUTS } from '../core/input.js';
import { MOVES, SPECIAL_MOVES, SUPERS, ULTIMATE, THROW, DEFENSE, VANISH, SUPER_DASH, MELEE_CLASH, AIR } from '../game/moves.js';
import { kitOf, specialFor, towardSide, clashable, energyMoves, airEnergyMoves, canBeamClash } from '../game/kit.js';
import { impactAhead } from '../game/aiTech.js';

// A step holds buttons (and a stick) from frame `t` for `len` frames. Sticks: 'toward' / 'away' the opponent,
// 'up' / 'down', or [mx, my] in screen space. A `tech: n` step is the timed impact tech (ADR 0028): between t and
// t + len it presses Guard (3 frames) once, when the fighter's next floor or wall impact is n live frames away.
// The C-stick in scripts and recordings (ADR 0042): 'cToward' / 'cAway' flick it at or away from the opponent, and a
// recording keeps cLeft / cRight relative to them, like the stick, so P1's recording does the same on the dummy.
const C_SIDE = { cToward: 1, cAway: -1 };
const cFor = (f, b) => (b in C_SIDE ? (C_SIDE[b] * towardSide(f) > 0 ? 'cRight' : 'cLeft') : b);
const cMirror = (b, side) => (side < 0 && (b === 'cLeft' || b === 'cRight') ? (b === 'cLeft' ? 'cRight' : 'cLeft') : b);
const stick = (f, s) => {
  if (!s) return [0, 0];
  if (Array.isArray(s)) return s;
  const side = towardSide(f);
  return { toward: [side, 0], away: [-side, 0], up: [0, 1], down: [0, -1] }[s] ?? [0, 0];
};

export class ScriptBrain {
  constructor(f, steps, done) {
    this.autoBlock = true; // a script stands in for a player: holding back blocks (Fighter.holdingBack)
    this.f = f;
    this.steps = steps;
    this.t = 0;
    this.done = done;
    this.end = Math.max(0, ...steps.map((s) => s.t + (s.len ?? 3))) + 2;
    this.fired = new Map(); // tech step -> the frame it pressed (the steps are shared data: never written to)
  }

  update() {
    const pad = this.f.pad, t = this.t++;
    pad.tick();
    let mv = [0, 0];
    const down = new Set();
    for (const s of this.steps) {
      if (t < s.t || t >= s.t + (s.len ?? 3)) continue;
      for (const b of s.btn || []) down.add(cFor(this.f, b));
      if (s.stick) mv = stick(this.f, s.stick);
      if (s.tech != null && !this.fired.has(s)) {
        const a = impactAhead(this.f);
        if (a && a.k - 1 <= s.tech) this.fired.set(s, t);
      }
    }
    for (const at of this.fired.values()) if (t < at + 3) down.add('guard');
    pad.setMove(mv[0], mv[1]);
    pad.dashDir = null; // a scripted stick never reads as a double-tap dash
    for (const b of PAD_INPUTS) pad.set(b, down.has(b));
    if (t === this.end) this.done?.();
  }
}

// Replays a recorded pad timeline on another fighter. The stick is stored relative to "toward the opponent", so
// a recording made by P1 (facing right) does the same thing on the dummy (facing left).
export class ReplayBrain {
  constructor(f, frames, loop = true) {
    this.autoBlock = true; // replays a player's recording
    this.f = f;
    this.frames = frames;
    this.i = 0;
    this.loop = loop;
  }

  update() {
    const pad = this.f.pad;
    pad.tick();
    if (this.i >= this.frames.length) {
      if (!this.loop) { pad.setMove(0, 0); for (const b of PAD_INPUTS) pad.set(b, false); return; }
      this.i = 0;
    }
    const fr = this.frames[this.i++];
    pad.setMove(fr.mx * towardSide(this.f), fr.my);
    pad.dashDir = null;
    const side = towardSide(this.f);
    for (const b of PAD_INPUTS) pad.set(b, fr.b.includes(cMirror(b, side)));
  }
}

// One recorded frame of a pad (see ReplayBrain).
export function recordFrame(f) {
  const pad = f.pad;
  const side = towardSide(f);
  return { mx: pad.mx * side, my: pad.my, b: PAD_INPUTS.filter((b) => pad.b[b].down).map((b) => cMirror(b, side)) };
}

const tap = (t, btn, extra = {}) => ({ t, btn: [].concat(btn), len: 3, ...extra });
// a full hop: Jump held through the jump squat (a 3-frame tap is a short hop, ADR 0042)
const hop = (t, extra = {}) => tap(t, 'jump', { len: 8, ...extra });
const SLOT_STICK = { neutral: null, forward: 'toward', back: 'away', up: 'up', down: 'down', air: null, airDown: 'down' };
const SLOT_LABEL = { neutral: 'Special', forward: '→ Special', back: '← Special', up: '↑ Special', down: '↓ Special', air: 'air Special', airDown: 'air ↓ Special' };

// How far apart to stand for a move to show what it does
const RANGE = { rush: 1.4, shot: 4.5, teleport: 3, pull: 3, dive: 2.4, counter: 1.4, mode: 2.5, flurry: 3.5, domain: 3, skyStrike: 4, ignite: 4, orb: 5, rampage: 4.5, reflex: 1.6, beam: 5 };

const fd = (m) => [m.startup, m.active, m.recovery].every((x) => x != null) ? `${m.startup}/${m.active}/${m.recovery} f` : '';

// A short frame-data line for a special or super entry.
export function describe(m) {
  if (!m) return '';
  const cost = m.cost ? `${m.cost / 100} bar${m.cost === 100 ? '' : 's'}` : '';
  const bits = [m.kind, cost];
  switch (m.kind) {
    case 'rush': bits.push(fd(m), `${m.dmg} dmg`, m.cancelStartup ? `cancel ${m.cancelStartup} f` : ''); break;
    case 'shot': bits.push(fd(m), m.proj ? `shot: ${m.proj}` : ''); break;
    case 'dive': bits.push(m.riseHit ? `rise ${m.riseHit.dmg}` : '', `slam ${m.hit?.dmg}`); break;
    case 'teleport': bits.push(`hide ${m.hide} f`, m.follow ? `then ${m.follow} (${MOVES[m.follow]?.dmg})` : ''); break;
    case 'counter': bits.push(`window ${m.len} f`, `on counter: ${m.onCounter}`); break;
    case 'mode': bits.push(`${m.len} f`, `speed ×${m.speed ?? 1}`, `dmg ×${m.damage ?? 1}`, `def ×${m.defense ?? 1}`); break;
    case 'pull': bits.push(`${m.len} f`, `pop ${m.pop?.dmg}`); break;
    case 'flurry': bits.push(`${m.hits}×${m.hitDmg} + ${m.finalDmg}`); break;
    case 'domain': bits.push(`hold ${m.len} f`); break;
    case 'skyStrike': bits.push(`${m.dmg} after ${m.delay} f`); break;
    case 'ignite': bits.push(`${m.dmg} + burn ${m.burn.len / m.burn.every}×${m.burn.dmg}`); break;
    case 'orb': bits.push(`${m.dmg}, ${m.speed} u/s, r ${m.radius}`); break;
    case 'rampage': bits.push(`${m.slams}×${m.slamDmg} + ${m.finalDmg}`, `reach ${m.range}`); break;
    case 'reflex': bits.push(`${m.counters} counters in ${m.len} f`); break;
  }
  return bits.filter(Boolean).join(' · ');
}

// Every move a fighter has, as rows of { group, name, info, steps, range, ki }.
export function moveList(def) {
  const K = kitOf(def), rows = [];
  const add = (group, name, info, steps, range = 1.3, ki = 0) => rows.push({ group, name, info, steps, range, ki });
  const m = (id) => MOVES[id];

  // the directional normals (ADR 0042): the stick when Light or Heavy is pressed picks the move
  const dm = (id, more = '') => `${fd(m(id))} · ${m(id).dmg} dmg${more}`;
  const charged = (id) => ` · ×${m(id).charge.mul} held ${m(id).charge.max} f`;
  add('Normals', 'Light × 4 (jab string)', `${fd(m('light1'))} … light4 ${m('light4').dmg} dmg`, [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light')]);
  add('Normals', '→ Light: forward tilt', dm('fTilt'), [tap(0, 'light', { stick: 'toward' })]);
  add('Normals', '↑ Light: up tilt (anti-air)', dm('uTilt'), [tap(0, 'light', { stick: 'up' })], 1.0);
  add('Normals', '↓ Light: down tilt', dm('dTilt'), [tap(0, 'light', { stick: 'down' })]);
  add('Normals', 'Dash attack (Light in a dash, stick held)', dm('dashAttack'), [{ t: 0, btn: ['dash'], len: 5, stick: 'toward' }, tap(5, 'light', { stick: 'toward' })], 3.5);
  add('Normals', 'Heavy (launcher)', `${fd(m('heavy'))} · ${m('heavy').dmg} dmg`, [tap(0, 'heavy')]);
  add('Normals', '→ Heavy: forward smash (held: charged)', dm('fSmash', charged('fSmash')), [{ t: 0, btn: ['heavy'], len: 45, stick: 'toward' }], 1.4);
  add('Normals', '↑ Heavy: up smash', dm('uSmash', charged('uSmash')), [tap(0, 'heavy', { stick: 'up' })], 1.0);
  add('Normals', '↓ Heavy: down smash (both sides)', dm('dSmash', charged('dSmash')), [tap(0, 'heavy', { stick: 'down' })]);
  add('Normals', 'Air light × 3 (air string)', `${fd(m('airLight1'))} …`, [hop(0), tap(12, 'light'), tap(24, 'light'), tap(36, 'light')]);
  add('Normals', 'Short hop neutral air (Jump + Light)', dm('airLight1'), [tap(0, ['jump', 'light'], { len: 2 })], 1.0);
  add('Normals', 'Short hop → air: forward air', dm('fair'), [tap(0, ['jump', 'light'], { len: 2, stick: 'toward' }), { t: 2, stick: 'toward', len: 2 }], 1.1);
  add('Normals', 'Back air (run off, jump, ← toward them)', dm('bair'), [{ t: 0, stick: 'away', len: 4 }, tap(4, ['jump', 'light'], { len: 2, stick: 'toward' })], 0.9);
  add('Normals', '↑ air: up air', dm('uair'), [hop(0), tap(10, 'light', { stick: 'up' })], 0.9);
  add('Normals', 'Air heavy or ↓ air: down air (spike)', `${fd(m('airHeavy'))} · ${m('airHeavy').dmg} dmg`, [hop(0), tap(14, 'heavy')]);
  add('Normals', 'Throw (Light + Heavy close)', `${THROW.startup}/${THROW.active} f · ${THROW.hit.dmg} dmg · break window ${THROW.techWindow} f`, [tap(0, ['light', 'heavy'])], 0.9);
  add('Movement', 'Dash', '', [{ t: 0, btn: ['dash'], len: 5, stick: 'toward' }], 4);
  add('Movement', 'Back dash', '', [{ t: 0, btn: ['dash'], len: 5, stick: 'away' }], 2);
  add('Movement', 'Super dash (dash, no direction)', `${SUPER_DASH.dmg} dmg on contact`, [tap(0, 'dash')], 6);
  add('Normals', 'C-stick → on the ground: forward smash (uncharged)', dm('fSmash'), [tap(0, 'cToward', { len: 2 })], 1.4);
  add('Normals', 'C-stick in the air: back air (run off, hop, C toward them)', dm('bair'), [{ t: 0, stick: 'away', len: 4 }, tap(4, 'jump', { len: 2 }), tap(6, 'cToward', { len: 2 })], 0.9);
  add('Movement', 'Short hop (tap Jump)', `${AIR.shortHop} u/s vs ${AIR.fullHop} held`, [tap(0, 'jump', { len: 2 })], 4);
  add('Movement', 'Double jump', `${AIR.doubleJump} u/s, back on landing`, [hop(0), tap(20, 'jump')], 4);
  add('Movement', 'Fast fall (↓ past the top)', `${AIR.fastFall} u/s`, [hop(0), { t: 24, stick: 'down', len: 8 }], 4);
  add('Movement', 'Wavedash', `slide, act from f${DEFENSE.wavedash.act}`, [tap(0, 'jump', { len: 2 }), { t: 2, btn: ['guard'], len: 3, stick: 'toward' }, { t: 5, stick: 'toward', len: 8 }], 4);
  add('Movement', 'Vanish (Guard + Special)', `${VANISH.cost / 100} bar · teleport behind`, [tap(0, ['guard', 'special'])], 3.5, VANISH.cost);
  add('Movement', 'Charge ki (hold Special)', '', [{ t: 0, btn: ['special'], len: 80 }], 4);
  // the whole power-up from an empty gauge: bars at charge frames 69, 138 and 207 (MAX); the hold starts it at f12
  add('Movement', 'Charge to MAX (hold Special)', 'from 0 ki, 230 frames', [{ t: 0, btn: ['special'], len: 242 }], 4);
  rows[rows.length - 1].kiFrom = 0;
  add('Defense', 'Spot dodge (Guard + ↓)', `intangible f${DEFENSE.spotDodge.from}-${DEFENSE.spotDodge.to}`, [tap(0, 'guard', { stick: 'down' })]);
  add('Defense', 'Air dodge', `intangible f${DEFENSE.airDodge.from}-${DEFENSE.airDodge.to}`, [hop(0), tap(12, 'guard', { stick: 'away' })]);

  const seen = new Set();
  for (const slot of ['neutral', 'forward', 'back', 'up', 'down', 'air', 'airDown']) {
    const sp = specialFor(def, slot);
    if (!sp || (seen.has(sp) && slot !== 'air')) continue;
    if (slot !== 'neutral' && !K.specials[slot] && specialFor(def, 'neutral') === sp) continue; // only a fallback
    seen.add(sp);
    const air = slot.startsWith('air');
    const steps = air ? [hop(0), tap(12, 'special', { stick: SLOT_STICK[slot] })] : [tap(0, 'special', { stick: SLOT_STICK[slot] })];
    const label = sp.name ?? (sp.proj ? (def.projectileName ?? sp.proj).toUpperCase() : sp.kind);
    add('Specials', `${SLOT_LABEL[slot]}: ${label}`, describe(sp), steps, RANGE[sp.kind] ?? 1.4, sp.cost ?? 0);
  }
  const S = SUPERS[K.super];
  if (S) add('Supers', `SUPER: ${S.name}`, describe(S), [tap(0, 'super')], RANGE[S.kind] ?? 3, S.cost);
  const U = SUPERS[K.ultimate];
  if (U) add('Supers', `Ultimate (Heavy + Special): ${U.name}`, describe(U), [tap(0, ['heavy', 'special'])], RANGE[U.kind] ?? 4, U.cost);
  else add('Supers', `Ultimate (Heavy + Special): ${def.beam?.name ?? 'beam'}`, `beam · 3 bars · ${ULTIMATE.tickDmg}/${ULTIMATE.tickEvery} f + ${ULTIMATE.finalDmg}`, [tap(0, ['heavy', 'special'])], RANGE.beam, ULTIMATE.cost);
  return rows;
}

const kindOf = (def) => SUPERS[kitOf(def).ultimate]?.kind ?? 'beam';
const CLASH_NOTE = 'needs two ultimates that clash (beam, orb or pounce), e.g. Gojo vs Naruto';

// BEAM CLASH (ADR 0027): the energy move a side fires. A shot when it has one (`rush` prefers the Rasengan / Chidori),
// never a rush against a side that has no shot to meet it (two rushes are the one-beat special clash).
const energyOf = (def, other, { air = false, rush = false } = {}) => {
  const theirShot = [...energyMoves(other), ...airEnergyMoves(other)].some((e) => e.kind === 'shot');
  const list = (air ? airEnergyMoves(def) : energyMoves(def)).filter((e) => e.kind === 'shot' || theirShot);
  return list.find((e) => e.kind === (rush ? 'rush' : 'shot')) ?? list[0] ?? null;
};
// (none when that side has no energy move: the lab still plays a scenario its `needs` turned down, so it stays still)
const energyTap = (t, e) => (e ? [tap(t, 'special', { stick: SLOT_STICK[e.slot] })] : []);
// A named kit shot freezes the world for its 8-frame flash (Game.onKitMove) while the scripts keep counting, and a
// ground special comes out when the button is let go (3 frames): the frame the dummy's shot is `x` frames into its
// startup is 11 + x.
const KIT_FLASH = 8, RELEASE = 3;
const BEAM_NOTE = 'needs an energy shot on at least one side (Naruto vs Naruto has only Rasengans: a special clash)';

// Scenario groups in panel order: related mechanics sit together, so one group answers one question ("do clashes
// work?", "can the dummy escape?"). Every scenario names its `group`; the lab lists a group it doesn't know last.
export const SCENARIO_GROUPS = [
  { id: 'clash', name: 'Clashes', info: 'two attacks meet head-on, from jabs up to ultimates' },
  { id: 'defense', name: 'Defense', info: 'the dummy attacks, you get out of it' },
  { id: 'escape', name: 'Tech & escape', info: 'you combo the dummy, it gets out' },
  { id: 'combo', name: 'Combos', info: 'your routes on a still dummy' },
  { id: 'kit', name: 'Fighter kits', info: 'one fighter\'s own technique' },
  { id: 'look', name: 'Look & feel', info: 'hit feedback and art checks' },
];

// Shared mechanics, each with both fighters scripted. `setup` = { gap (units apart), kiA, kiB, nearWall },
// `a` / `b` = the timelines for P1 / the dummy. `needs(defs)` returns a note when this pairing can't show it.
// `brief` is the one line the list shows; `info` the full description (shown when the row is opened or played).
// (Single-fighter moves without a dummy reaction, such as wavedash, vanish, super dash or a plain throw, live in
// the MOVES tab, not here.)
export const SCENARIOS = [
  // ------------------------------------------------ clashes, smallest to biggest
  {
    id: 'meleeClash', group: 'clash', name: 'Melee clash chain', brief: 'both jab at once: CLASH ×2, ×3 ... CLASH BREAK!',
    info: `Both jab at once: the swings meet, CLASH!, no damage, sparks in both colors, then a short pushback. Both press again while the strikes are held, so it chains (CLASH ×2, ×3 ...) and the ${MELEE_CLASH.finale}th skids them far back (CLASH BREAK!). Two heavies clash the same way (ADR 0038).`,
    setup: { gap: 1.8 },
    a: [tap(0, 'light'), tap(14, 'light'), tap(34, 'light'), tap(56, 'light'), tap(80, 'light')],
    b: [tap(0, 'light'), tap(14, 'light'), tap(34, 'light'), tap(56, 'light'), tap(80, 'light')],
  },
  {
    id: 'heavyCrush', group: 'clash', name: 'Heavy beats light', brief: 'your jab meets their heavy: CRUSH!',
    info: 'The dummy swings a heavy; your jab meets it while it is live: CRUSH!, the heavy blows through and launches you.',
    setup: { gap: 1.8 }, a: [tap(5, 'light')], b: [tap(0, 'heavy')],
  },
  {
    id: 'spClash', group: 'clash', name: 'Special clash (rush vs rush)', brief: 'two rush specials meet: one ring',
    info: 'Both rush specials meet head-on: one ring, press as it closes. The closer press wins.',
    needs: (defs) => (defs.every((d) => specialFor(d, 'neutral')?.kind === 'rush') ? null : 'needs two rush specials, e.g. Naruto vs Sasuke'),
    setup: { gap: 3.2, kiA: 100, kiB: 100 }, a: [tap(0, 'special')], b: [tap(0, 'special')],
  },
  {
    id: 'beamClash', group: 'clash', name: 'Beam clash', brief: 'both fire energy specials: BEAM CLASH!',
    info: 'Both fire an energy special at once (Narukami, Reversal: Red, Chidori Spear; Naruto drives a Rasengan in): BEAM CLASH!, two streams meet in the middle and the rhythm chart decides it. The winner\'s stream runs through and wall-bounces the loser; a dead heat blows both back.',
    needs: ([a, b]) => (canBeamClash(a, b) ? null : BEAM_NOTE),
    setup: { gap: 5, kiA: 100, kiB: 100 },
    a: ([a, b]) => energyTap(0, energyOf(a, b)), b: ([a, b]) => energyTap(0, energyOf(b, a)),
  },
  {
    id: 'beamAnswer', group: 'clash', name: 'Answer an energy shot', brief: 'fire into their shot in flight: BEAM CLASH',
    info: 'The dummy fires its energy shot at you; you fire yours (a Rasengan / Chidori if you have one) while it flies at you: the two meet in a BEAM CLASH instead of the hit.',
    needs: ([a, b]) => (energyOf(b, a)?.kind === 'shot' && energyOf(a, b) ? null : 'needs a dummy with an energy shot (Killua, Sasuke, Gojo)'),
    setup: { gap: 5, kiA: 100, kiB: 100 },
    a: ([a, b]) => energyTap(KIT_FLASH + (energyOf(b, a)?.m.startup ?? 0), energyOf(a, b, { rush: true })),
    b: ([a, b]) => energyTap(0, energyOf(b, a)),
  },
  {
    id: 'beamAir', group: 'clash', name: 'Beam clash from the air', brief: 'your air shot vs their ground answer',
    info: 'You jump and fire your air energy shot down at the dummy; it answers from the ground. Locked in the air, you ease down to a low hover through the clash and fall once it is over; a Rasengan / Chidori answer stays planted and holds its technique up the stream line.',
    needs: ([a, b]) => (airEnergyMoves(a).length && energyOf(b, a) ? null : 'your fighter has no air energy shot (Killua, Sasuke, Gojo do)'),
    setup: { gap: 5, kiA: 100, kiB: 100 },
    a: ([a]) => (airEnergyMoves(a).length ? [hop(0), tap(14, 'special')] : []),
    b: ([a, b]) => { const air = airEnergyMoves(a)[0]; return air ? energyTap(14 + KIT_FLASH + air.m.startup - 2 - RELEASE, energyOf(b, a, { rush: true })) : []; },
  },
  {
    id: 'ultClash', group: 'clash', name: 'Ultimate clash', brief: 'both ultimates on one frame, then the rhythm duel',
    info: 'Both fire their ultimate on the same frame, then the rhythm clash: press Light, Heavy or Special as each ring closes on the target and hold the last one. The dummy plays at the CLASH level picked in Tools (Normal by default).',
    needs: ([a, b]) => (clashable(a) && clashable(b) ? null : CLASH_NOTE),
    setup: { gap: 6, kiA: 300, kiB: 300 }, a: [tap(0, ['heavy', 'special'])], b: [tap(0, ['heavy', 'special'])],
  },
  {
    id: 'ultAnswer', group: 'clash', name: 'Answer an ultimate', brief: 'fire your ultimate into theirs',
    info: 'The dummy fires its ultimate; yours goes off into it (a short flash and windup), so the two meet in a clash.',
    needs: ([a, b]) => (clashable(a) && clashable(b) ? null : CLASH_NOTE),
    setup: { gap: 6, kiA: 300, kiB: 300 }, a: [tap(56, ['heavy', 'special'])], b: [tap(0, ['heavy', 'special'])],
  },
  // ------------------------------------------------ defense: the dummy attacks
  {
    id: 'holdBack', group: 'defense', name: 'Hold back to block', brief: 'stick away blocks a light string',
    info: 'The dummy runs a light string at you; you only hold the stick away from it (no Guard button).',
    setup: { gap: 1.3 }, a: [tap(8, [], { stick: 'away', len: 70 })], b: [tap(6, 'light'), tap(16, 'light'), tap(28, 'light')],
  },
  {
    id: 'parry', group: 'defense', name: 'Parry', brief: 'Guard just before their jab lands',
    info: `The dummy jabs; you press Guard just before it lands (window ${DEFENSE.parry.window} f).`,
    setup: { gap: 1.2 }, a: [tap(2, 'guard', { len: 14 })], b: [tap(0, 'light')],
  },
  {
    id: 'spotDodge', group: 'defense', name: 'Spot dodge', brief: 'Guard + ↓ through their heavy',
    info: 'The dummy swings a heavy; you spot dodge through it.',
    setup: { gap: 1.3 }, a: [tap(5, 'guard', { stick: 'down' })], b: [tap(0, 'heavy')],
  },
  {
    id: 'airDodge', group: 'defense', name: 'Air dodge', brief: 'jump in, dodge their anti-air',
    info: 'You jump in; the dummy anti-airs; you air dodge.',
    setup: { gap: 2.4 }, a: [hop(0, { stick: 'toward' }), { t: 3, stick: 'toward', len: 8 }, tap(13, 'guard', { stick: 'away' })], b: [tap(9, 'heavy')],
  },
  {
    id: 'backstep', group: 'defense', name: 'Backstep', brief: 'back dash out of their heavy: BACKSTEP',
    info: 'The dummy swings a heavy; you back dash out of it (Dash with the stick away: 8 invulnerable frames), and BACKSTEP calls it out (ADR 0025).',
    setup: { gap: 1.2 }, a: [tap(6, 'dash', { stick: 'away' })], b: [tap(0, 'heavy')],
  },
  {
    id: 'throwBreak', group: 'defense', name: 'Break a throw', brief: 'they throw you, Light + Heavy breaks it',
    info: `The dummy throws you; you press Light + Heavy within ${THROW.techWindow} frames.`,
    setup: { gap: 0.9 }, a: [tap(7, ['light', 'heavy'])], b: [tap(0, ['light', 'heavy'])],
  },
  // ------------------------------------------------ tech & escape (ADR 0022 / 0028): the dummy's side is scripted,
  // so these don't depend on the DUMMY TECH / BURST options; a `tech: n` step presses Guard n live frames before impact
  {
    id: 'holdTech', group: 'escape', name: 'Hold Guard to tech', brief: 'launched, holds Guard: TECH!',
    info: 'You launch the dummy and stop; it holds Guard and techs on the first frame it can (TECH!). The stick picks the hop: away (default), toward, ↑ rise, ↓ drop.',
    setup: { gap: 1.2 }, a: [tap(0, 'heavy')], b: [{ t: 24, btn: ['guard'], len: 90 }],
  },
  {
    id: 'techRoll', group: 'escape', name: 'Tech roll', brief: 'knocked down, rolls up: TECH ROLL!',
    info: 'Light ×4 knocks the dummy down; it holds Guard and rolls back to its feet instead of lying down (TECH ROLL!). Not after a hard knockdown (spike, throw, super finish).',
    setup: { gap: 1.2 }, a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light')], b: [{ t: 30, btn: ['guard'], len: 110 }],
  },
  {
    id: 'spikeTech', group: 'escape', name: 'Timed tech off a spike', brief: 'a timed press beats the ground bounce',
    info: `Light ×3, launcher, chase, air Light ×2 and the air heavy spike: the dummy presses Guard 5 frames before it hits the floor and techs in place (TECH!) instead of the ground bounce. A fresh press up to ${DEFENSE.impactTech.window} frames early techs; holding Guard doesn't. Stick left / right at the impact rolls instead.`,
    setup: { gap: 1.2 }, a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'heavy'), tap(62, 'jump'), tap(78, 'light'), tap(88, 'light'), tap(100, 'heavy')],
    b: [{ t: 100, tech: 5, len: 90 }],
  },
  {
    id: 'techLockout', group: 'escape', name: 'Tech too early (locked out)', brief: 'mashing fails: it bounces and stays down',
    info: `The spike again: the dummy presses Guard during your air string, too early (about 16 frames before the floor, outside the ${DEFENSE.impactTech.window}-frame window), then again 4 frames before the floor. The first press locked the timed tech out for ${DEFENSE.impactTech.lockout} frames, so the second does nothing: it ground-bounces and stays down. Mashing fails.`,
    setup: { gap: 1.2 }, a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'heavy'), tap(62, 'jump'), tap(78, 'light'), tap(88, 'light'), tap(100, 'heavy')],
    b: [{ t: 100, btn: ['guard'], len: 3 }, { t: 104, tech: 4, len: 90 }],
  },
  {
    id: 'wallTech', group: 'escape', name: 'Wall tech', brief: 'into the barrier, kicks off it: WALL TECH!',
    info: 'Light ×4 into the barrier: the dummy presses Guard just before it hits and WALL TECH!s: it clings to the barrier for a moment and kicks off away from it, invulnerable. The bounce (and its budget) never happens.',
    setup: { gap: 1.2, nearWall: true }, a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light')], b: [{ t: 38, tech: 5, len: 60 }],
  },
  {
    id: 'wallJumpTech', group: 'escape', name: 'Wall-jump tech', brief: 'wall tech with ↑: a higher jump off it',
    info: 'The same wall tech with ↑ held: a higher jump off the barrier, free to act in the air at once (air attack, air dodge, super dash).',
    setup: { gap: 1.2, nearWall: true }, a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light')], b: [{ t: 38, tech: 5, len: 60, stick: 'up' }],
  },
  {
    id: 'burst', group: 'escape', name: 'Burst', brief: 'bursts out of your light string: BURST!',
    info: `The dummy bursts out of your light string (Guard + Special while hit, ${DEFENSE.burst.cost / 100} bars, once per round): BURST! blows you away.`,
    setup: { gap: 1.2, kiB: DEFENSE.burst.cost }, a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light')], b: [tap(30, ['guard', 'special'])],
  },
  {
    id: 'burstBait', group: 'escape', name: 'Burst bait', brief: 'block its burst, then PUNISH!',
    info: 'You jab once and hold Guard; the dummy bursts into your guard, and you super dash in to punish its long recovery (PUNISH!).',
    setup: { gap: 1.2, kiB: DEFENSE.burst.cost }, a: [tap(0, 'light'), { t: 4, btn: ['guard'], len: 50 }, tap(64, 'dash'), tap(78, 'light'), tap(90, 'light'), tap(102, 'heavy')], b: [tap(26, ['guard', 'special'])],
  },
  // ------------------------------------------------ combos (ADR 0026 routes): `room` = units from the dummy to the barrier behind it
  {
    id: 'airCombo', group: 'combo', name: 'Air combo', brief: 'launch, chase, air string, spike',
    info: 'Light × 3, Heavy launcher, jump to chase, air string, air heavy spike (ground bounce).',
    setup: { gap: 1.2 },
    a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'heavy'), tap(62, 'jump'), tap(78, 'light'), tap(88, 'light'), tap(98, 'light'), tap(112, 'heavy')],
    b: [],
  },
  {
    id: 'wallBounce', group: 'combo', name: 'Wall bounce', brief: 'light4 bounces them off the barrier',
    info: 'The light auto combo ends in light4, which bounces them off the ring barrier.',
    setup: { gap: 1.2, nearWall: true }, a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light')], b: [],
  },
  {
    id: 'handball', group: 'combo', name: 'Handball (3 wall bounces)', brief: 'three wall bounces in one combo',
    info: 'Light ×4 into the barrier (WALL BOUNCE!), super dash after the bounce, air Light ×3 into the same wall (WALL BOUNCE ×2!), then a vanish kick bounces them a third time (HANDBALL!). The bounce budget: 3 wall bounces per combo, 32 / 28 / 22 frames of stun.',
    setup: { gap: 1.2, nearWall: true, room: 1.8, kiA: 100 },
    a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light'), { t: 68, btn: ['dash'], len: 6 }, tap(90, 'light'), tap(101, 'light'), tap(112, 'light'), tap(140, ['guard', 'special'])],
    b: [],
  },
  {
    id: 'vanishPingPong', group: 'combo', name: 'Vanish ping-pong', brief: 'vanish twice in an air combo: VANISH ×2!',
    info: 'Launch, chase, air Light ×2, vanish behind them, then vanish again out of the kick (VANISH ×2!): a true combo, no gap.',
    setup: { gap: 1.2, kiA: 200 },
    a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'heavy'), tap(62, 'jump'), tap(78, 'light'), tap(88, 'light'), tap(106, ['guard', 'special']), tap(142, ['guard', 'special'])],
    b: [],
  },
  {
    id: 'blueCombo', group: 'combo', name: 'Blue combo (a gap)', brief: 'a late chase turns the counter blue',
    info: 'You launch, then super dash in late: the dummy could have teched in between (it never does here), so the counter turns blue. Compare with the air combo, which stays true.',
    setup: { gap: 1.2 }, a: [tap(0, 'heavy'), tap(58, 'dash'), tap(80, 'light'), tap(92, 'light'), tap(104, 'heavy')], b: [],
  },
  // ------------------------------------------------ one fighter's own technique
  {
    id: 'counter', group: 'kit', name: 'Counter stance', brief: 'your counter special catches their jab',
    info: 'Your counter special, and the dummy walks into it with a jab.',
    needs: ([a]) => (['down', 'back'].some((s) => specialFor(a, s)?.kind === 'counter') ? null : 'your fighter has no counter special'),
    setup: { gap: 0.9, kiA: 100 },
    a: (defs) => [tap(0, 'special', { stick: specialFor(defs[0], 'down')?.kind === 'counter' ? 'down' : 'away' })], b: [tap(8, 'light')],
  },
  {
    id: 'reflex', group: 'kit', name: 'Whirlwind vs attacks', brief: 'reflex ultimate vs three attacks',
    info: 'Your reflex ultimate, then the dummy attacks three times.',
    needs: ([a]) => (kindOf(a) === 'reflex' ? null : 'your fighter\'s ultimate is not a reflex (Killua)'),
    setup: { gap: 1.2, kiA: 300 }, a: [tap(0, ['heavy', 'special'])], b: [tap(70, 'light'), tap(120, 'light'), tap(170, 'heavy')],
  },
  {
    id: 'orbEats', group: 'kit', name: 'Hollow Purple vs a projectile', brief: 'the orb eats their air special',
    info: 'Your orb rolls out; the dummy fires its air special into it.',
    needs: ([a]) => (kindOf(a) === 'orb' ? null : 'your fighter\'s ultimate is not an orb (Gojo)'),
    setup: { gap: 6, kiA: 300, kiB: 100 }, a: [tap(0, ['heavy', 'special'])], b: [hop(66), tap(78, 'special')],
  },
  // ------------------------------------------------ look & feel
  {
    id: 'counterHit', group: 'look', name: 'Counter hit (hit flash)', brief: 'jab their heavy startup: full-white pop',
    info: 'The dummy starts a heavy; your jab lands in its startup: a counter hit, which keeps a full-white pop. Compare the styles in Tools → HIT FLASH.',
    setup: { gap: 1.2 }, a: [tap(3, 'light'), tap(15, 'light'), tap(27, 'light')], b: [tap(0, 'heavy')],
  },
  {
    id: 'attackAlts', group: 'look', name: 'Attack alts', brief: 'repeat strings: base and alt strips alternate',
    info: 'Light ×3 three times, then two heavies. A fighter with alt strips (light1Alt ..., hurtHighAlt, hurtLowAlt; ADR 0031) alternates each base with its alt in a fixed pattern, never the same version three times running; without them every swing plays the base. Add ?alts=1 to the URL to see every alt, ?alts=0 to see none.',
    setup: { gap: 1.2 },
    a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(66, 'light'), tap(78, 'light'), tap(90, 'light'), tap(132, 'light'), tap(144, 'light'), tap(156, 'light'), tap(200, 'heavy'), tap(260, 'heavy')],
    b: [],
  },
  {
    id: 'groundDamage', group: 'look', name: 'Ground damage', brief: 'spike, dive and a long charge crack the floor',
    info: 'Light × 3, launcher, chase, air light × 2 and the air heavy spike (a ground bounce crater), the dive special (or the forward special), then Special held for 4 s: the crack under you grows into a fracture from the crack level of your power-up (Naruto bar 2, Sasuke MAX; Killua and Gojo keep the floor whole; MAX POWER needs METER on normal).',
    setup: { gap: 1.2, kiA: 300 },
    a: (defs) => {
      const dive = ['up', 'neutral', 'forward'].find((s) => specialFor(defs[0], s)?.kind === 'dive');
      return [
        tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'heavy'), tap(62, 'jump'), tap(78, 'light'), tap(88, 'light'), tap(100, 'heavy'),
        tap(190, 'special', { stick: dive ? SLOT_STICK[dive] : 'toward' }), { t: 300, btn: ['special'], len: 240 },
      ];
    },
    b: [],
  },
];
