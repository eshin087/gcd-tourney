// Test lab scripts (ADR 0018): input timelines that drive a fighter's Pad frame by frame, the way a CPU brain does,
// so one tap plays a move or a whole scenario exactly the same way every time. Everything is read from the fighter
// data (kits, MOVES, SPECIAL_MOVES, SUPERS), so a new fighter or a new move shows up here without lab changes.
import { ACTIONS } from '../core/input.js';
import { MOVES, SPECIAL_MOVES, SUPERS, ULTIMATE, THROW, DEFENSE, VANISH, SUPER_DASH } from '../game/moves.js';
import { kitOf, specialFor, towardSide, clashable } from '../game/kit.js';

// A step holds buttons (and a stick) from frame `t` for `len` frames. Sticks: 'toward' / 'away' the opponent,
// 'up' / 'down', or [mx, my] in screen space.
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
  }

  update() {
    const pad = this.f.pad, t = this.t++;
    pad.tick();
    let mv = [0, 0];
    const down = new Set();
    for (const s of this.steps) {
      if (t < s.t || t >= s.t + (s.len ?? 3)) continue;
      for (const b of s.btn || []) down.add(b);
      if (s.stick) mv = stick(this.f, s.stick);
    }
    pad.setMove(mv[0], mv[1]);
    pad.dashDir = null; // a scripted stick never reads as a double-tap dash
    for (const b of ACTIONS) pad.set(b, down.has(b));
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
      if (!this.loop) { pad.setMove(0, 0); for (const b of ACTIONS) pad.set(b, false); return; }
      this.i = 0;
    }
    const fr = this.frames[this.i++];
    pad.setMove(fr.mx * towardSide(this.f), fr.my);
    pad.dashDir = null;
    for (const b of ACTIONS) pad.set(b, fr.b.includes(b));
  }
}

// One recorded frame of a pad (see ReplayBrain).
export function recordFrame(f) {
  const pad = f.pad;
  return { mx: pad.mx * towardSide(f), my: pad.my, b: ACTIONS.filter((b) => pad.b[b].down) };
}

const tap = (t, btn, extra = {}) => ({ t, btn: [].concat(btn), len: 3, ...extra });
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

  add('Normals', 'Light × 4 (auto combo)', `${fd(m('light1'))} … light4 ${m('light4').dmg} dmg`, [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light')]);
  add('Normals', 'Heavy (launcher)', `${fd(m('heavy'))} · ${m('heavy').dmg} dmg`, [tap(0, 'heavy')]);
  add('Normals', 'Air light × 3', `${fd(m('airLight1'))} …`, [tap(0, 'jump'), tap(12, 'light'), tap(24, 'light'), tap(36, 'light')]);
  add('Normals', 'Air heavy (spike)', `${fd(m('airHeavy'))} · ${m('airHeavy').dmg} dmg`, [tap(0, 'jump'), tap(14, 'heavy')]);
  add('Normals', 'Throw (Light + Heavy close)', `${THROW.startup}/${THROW.active} f · ${THROW.hit.dmg} dmg · break window ${THROW.techWindow} f`, [tap(0, ['light', 'heavy'])], 0.9);
  add('Movement', 'Dash', '', [{ t: 0, btn: ['dash'], len: 5, stick: 'toward' }], 4);
  add('Movement', 'Back dash', '', [{ t: 0, btn: ['dash'], len: 5, stick: 'away' }], 2);
  add('Movement', 'Super dash (dash, no direction)', `${SUPER_DASH.dmg} dmg on contact`, [tap(0, 'dash')], 6);
  add('Movement', 'Wavedash', `slide, act from f${DEFENSE.wavedash.act}`, [tap(0, 'jump', { len: 2 }), { t: 2, btn: ['guard'], len: 3, stick: 'toward' }, { t: 5, stick: 'toward', len: 8 }], 4);
  add('Movement', 'Vanish (Guard + Special)', `${VANISH.cost / 100} bar · teleport behind`, [tap(0, ['guard', 'special'])], 3.5, VANISH.cost);
  add('Movement', 'Charge ki (hold Special)', '', [{ t: 0, btn: ['special'], len: 80 }], 4);
  add('Defense', 'Spot dodge (Guard + ↓)', `intangible f${DEFENSE.spotDodge.from}-${DEFENSE.spotDodge.to}`, [tap(0, 'guard', { stick: 'down' })]);
  add('Defense', 'Air dodge', `intangible f${DEFENSE.airDodge.from}-${DEFENSE.airDodge.to}`, [tap(0, 'jump'), tap(12, 'guard', { stick: 'away' })]);

  const seen = new Set();
  for (const slot of ['neutral', 'forward', 'back', 'up', 'down', 'air', 'airDown']) {
    const sp = specialFor(def, slot);
    if (!sp || (seen.has(sp) && slot !== 'air')) continue;
    if (slot !== 'neutral' && !K.specials[slot] && specialFor(def, 'neutral') === sp) continue; // only a fallback
    seen.add(sp);
    const air = slot.startsWith('air');
    const steps = air ? [tap(0, 'jump'), tap(12, 'special', { stick: SLOT_STICK[slot] })] : [tap(0, 'special', { stick: SLOT_STICK[slot] })];
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

// Shared mechanics, each with both fighters scripted. `setup` = { gap (units apart), kiA, kiB, nearWall },
// `a` / `b` = the timelines for P1 / the dummy. `needs(defs)` returns a note when this pairing can't show it.
export const SCENARIOS = [
  {
    id: 'ultClash', name: 'Ultimate clash', info: 'Both fire their ultimate on the same frame, then the rhythm clash: press Light, Heavy or Special as each ring closes on the target and hold the last one. The dummy plays at Normal.',
    needs: ([a, b]) => (clashable(a) && clashable(b) ? null : CLASH_NOTE),
    setup: { gap: 6, kiA: 300, kiB: 300 }, a: [tap(0, ['heavy', 'special'])], b: [tap(0, ['heavy', 'special'])],
  },
  {
    id: 'ultAnswer', name: 'Answer an ultimate', info: 'The dummy fires its ultimate; yours goes off into it (a short flash and windup), so the two meet in a clash.',
    needs: ([a, b]) => (clashable(a) && clashable(b) ? null : CLASH_NOTE),
    setup: { gap: 6, kiA: 300, kiB: 300 }, a: [tap(56, ['heavy', 'special'])], b: [tap(0, ['heavy', 'special'])],
  },
  {
    id: 'spClash', name: 'Special clash (rush vs rush)', info: 'Both rush specials meet head-on: one ring, press as it closes. The closer press wins.',
    needs: (defs) => (defs.every((d) => specialFor(d, 'neutral')?.kind === 'rush') ? null : 'needs two rush specials, e.g. Naruto vs Sasuke'),
    setup: { gap: 3.2, kiA: 100, kiB: 100 }, a: [tap(0, 'special')], b: [tap(0, 'special')],
  },
  {
    id: 'throwBreak', name: 'Throw, then break it', info: `The dummy throws you; you press Light + Heavy within ${THROW.techWindow} frames.`,
    setup: { gap: 0.9 }, a: [tap(7, ['light', 'heavy'])], b: [tap(0, ['light', 'heavy'])],
  },
  { id: 'throw', name: 'Throw (no break)', info: 'You throw the dummy.', setup: { gap: 0.9 }, a: [tap(0, ['light', 'heavy'])], b: [] },
  {
    id: 'holdBack', name: 'Hold back to block', info: 'The dummy runs a light string at you; you only hold the stick away from it (no Guard button).',
    setup: { gap: 1.3 }, a: [tap(8, [], { stick: 'away', len: 70 })], b: [tap(6, 'light'), tap(16, 'light'), tap(28, 'light')],
  },
  {
    id: 'parry', name: 'Parry', info: `The dummy jabs; you press Guard just before it lands (window ${DEFENSE.parry.window} f).`,
    setup: { gap: 1.2 }, a: [tap(2, 'guard', { len: 14 })], b: [tap(0, 'light')],
  },
  {
    id: 'spotDodge', name: 'Spot dodge', info: 'The dummy swings a heavy; you spot dodge through it.',
    setup: { gap: 1.3 }, a: [tap(5, 'guard', { stick: 'down' })], b: [tap(0, 'heavy')],
  },
  {
    id: 'airDodge', name: 'Air dodge', info: 'You jump in; the dummy anti-airs; you air dodge.',
    setup: { gap: 2.4 }, a: [tap(0, 'jump', { stick: 'toward' }), { t: 3, stick: 'toward', len: 8 }, tap(13, 'guard', { stick: 'away' })], b: [tap(9, 'heavy')],
  },
  {
    id: 'wavedash', name: 'Wavedash', info: 'Jump, then Guard with a direction at once: a ground slide.',
    setup: { gap: 5 }, a: [tap(0, 'jump', { len: 2 }), { t: 2, btn: ['guard'], len: 3, stick: 'toward' }, { t: 5, stick: 'toward', len: 10 }], b: [],
  },
  {
    id: 'airCombo', name: 'Air combo (launch, chase, spike)', info: 'Light × 3, Heavy launcher, jump to chase, air string, air heavy spike (ground bounce).',
    setup: { gap: 1.2 },
    a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'heavy'), tap(62, 'jump'), tap(78, 'light'), tap(88, 'light'), tap(98, 'light'), tap(112, 'heavy')],
    b: [],
  },
  {
    id: 'wallBounce', name: 'Wall bounce', info: 'The light auto combo ends in light4, which bounces them off the ring barrier.',
    setup: { gap: 1.2, nearWall: true }, a: [tap(0, 'light'), tap(12, 'light'), tap(24, 'light'), tap(38, 'light')], b: [],
  },
  {
    id: 'vanish', name: 'Vanish', info: 'Guard + Special: teleport behind them and kick.',
    setup: { gap: 3.2, kiA: 100 }, a: [tap(0, ['guard', 'special'])], b: [],
  },
  { id: 'superDash', name: 'Super dash', info: 'Dash with no direction: a homing flight that plows through projectiles.', setup: { gap: 7 }, a: [tap(0, 'dash')], b: [] },
  {
    id: 'counter', name: 'Counter stance', info: 'Your counter special, and the dummy walks into it with a jab.',
    needs: ([a]) => (['down', 'back'].some((s) => specialFor(a, s)?.kind === 'counter') ? null : 'your fighter has no counter special'),
    setup: { gap: 0.9, kiA: 100 },
    a: (defs) => [tap(0, 'special', { stick: specialFor(defs[0], 'down')?.kind === 'counter' ? 'down' : 'away' })], b: [tap(8, 'light')],
  },
  {
    id: 'reflex', name: 'Whirlwind vs attacks', info: 'Your reflex ultimate, then the dummy attacks three times.',
    needs: ([a]) => (kindOf(a) === 'reflex' ? null : 'your fighter\'s ultimate is not a reflex (Killua)'),
    setup: { gap: 1.2, kiA: 300 }, a: [tap(0, ['heavy', 'special'])], b: [tap(70, 'light'), tap(120, 'light'), tap(170, 'heavy')],
  },
  {
    id: 'orbEats', name: 'Hollow Purple vs a projectile', info: 'Your orb rolls out; the dummy fires its air special into it.',
    needs: ([a]) => (kindOf(a) === 'orb' ? null : 'your fighter\'s ultimate is not an orb (Gojo)'),
    setup: { gap: 6, kiA: 300, kiB: 100 }, a: [tap(0, ['heavy', 'special'])], b: [tap(66, 'jump'), tap(78, 'special')],
  },
];
