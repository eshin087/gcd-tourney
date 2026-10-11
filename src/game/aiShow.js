// Showcase (ADR 0016): the part of a CPU that wants to *show* its kit. It keeps a match-long record of
// which tools this fighter has used (every kit special, the second super, the ultimate, and the system
// techniques: vanish, super dash, wavedash, parry, spot dodge, air dodge, throw, charge, burst (ADR 0022); an ultimate clash when
// both fighters' ultimates can meet, ADR 0017; a beam clash when their energy specials can, ADR 0027) and turns it into
// weights, so a brain's planners prefer what the viewer hasn't seen yet. It only watches its own fighter's
// state (what the screen shows) and never presses a button: each brain still decides whether a tool is a
// real option right now, so the fight stays real while the variety goes up.
// It also holds the brain's per-match defense persona (ADR 0025): a hidden temperament (parrier, dancer,
// phantom, rock, scrapper) that reweights the defensive answers, so two CPU fights don't defend the same way.
import { SUPERS } from './moves.js';
import { kitOf, specialFor, clashable, canBeamClash } from './kit.js';

const SLOTS = ['neutral', 'forward', 'up', 'down', 'back'];
const AIR_SLOTS = ['air', 'airDown'];
export const TECH = ['vanish', 'superDash', 'wavedash', 'parry', 'spotDodge', 'airDodge', 'throw', 'charge', 'burst', 'backstep', 'vanishWar'];

// Defense personas (ADR 0025): multipliers on the defensive answers' weights. `roll` = how often it is rolled.
// parry / dodge (spot dodge) / airdodge / wavedash / backstep / vanish / counter / block: the answers themselves;
// read: the showman's guesses (approach and string reads); rally: its flashy non-guaranteed parry punish;
// escape: mid-combo escapes (the hold-Guard tech's direction, bursts, gap reversals, escapes after a tech).
export const DEF_PERSONAS = {
  parrier: { roll: 1, parry: 1.9, dodge: 0.7, airdodge: 0.9, wavedash: 0.8, backstep: 0.7, vanish: 0.8, counter: 1.1, block: 1.0, read: 1.2, rally: 1.6, escape: 0.9 },
  dancer: { roll: 1, parry: 0.7, dodge: 1.7, airdodge: 1.6, wavedash: 1.9, backstep: 1.5, vanish: 0.8, counter: 0.8, block: 0.6, read: 1.2, rally: 0.8, escape: 1.3 },
  phantom: { roll: 1, parry: 0.8, dodge: 1.0, airdodge: 1.2, wavedash: 1.0, backstep: 1.0, vanish: 2.3, counter: 1.4, block: 0.7, read: 1.0, rally: 1.0, escape: 1.5 },
  rock: { roll: 0.7, parry: 1.4, dodge: 0.8, airdodge: 0.8, wavedash: 0.7, backstep: 0.8, vanish: 0.7, counter: 1.5, block: 1.8, read: 0.8, rally: 1.3, escape: 0.7 },
  scrapper: { roll: 0.8, parry: 1.1, dodge: 1.1, airdodge: 1.4, wavedash: 1.2, backstep: 1.2, vanish: 1.2, counter: 1.0, block: 0.8, read: 1.4, rally: 1.2, escape: 1.2 },
};
const PERSONA_KEYS = Object.keys(DEF_PERSONAS.parrier).filter((k) => k !== 'roll');

// m' = 1 + (m - 1)·s: strength 1 uses the persona as it is, 0 turns it off
const blend = (raw, s) => Object.fromEntries(PERSONA_KEYS.map((k) => [k, 1 + (raw[k] - 1) * s]));

// A persona for this match: picked by `roll` weight (70 % of the time not the same as the opponent's, `avoid`), each
// multiplier jittered ×0.8-1.25 so the same persona still differs from match to match.
export function rollPersona(strength, avoid = null) {
  const w = Object.fromEntries(Object.entries(DEF_PERSONAS).map(([id, P]) => [id, P.roll]));
  let id = pickW(w);
  if (avoid && id === avoid && Math.random() < 0.7) { delete w[avoid]; id = pickW(w); }
  const match = Object.fromEntries(PERSONA_KEYS.map((k) => [k, DEF_PERSONAS[id][k] * (0.8 + 0.45 * Math.random())]));
  return { id, s: strength, match, m: blend(match, strength) };
}

// Each round nudges the match's multipliers by ±10 % (a fighter warms up to some answers, cools on others).
export function jitterPersona(p) {
  const round = Object.fromEntries(PERSONA_KEYS.map((k) => [k, p.match[k] * (0.9 + 0.2 * Math.random())]));
  return { ...p, m: blend(round, p.s) };
}
const ENTER = { dodge: 'spotDodge', airDodge: 'airDodge', wavedash: 'wavedash', vanish: 'vanish', superDash: 'superDash', throw: 'throw', charge: 'charge', beamCharge: 'beam', burst: 'burst' };

// Weighted pick from { key: weight }; null when every weight is 0.
export function pickW(w) {
  let total = 0;
  for (const k in w) total += Math.max(0, w[k] || 0);
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const k in w) if ((r -= Math.max(0, w[k] || 0)) <= 0) return k;
  return null;
}

// A special's tool id: its name (a ground move and its air version share one), else its projectile.
export const specialId = (m) => 'sp:' + (m.name ?? m.proj ?? m.kind);

// The tools a fighter has: { id: { kind, m, ground, air } } where ground / air are the special slots that fire
// it (the same move on two slots, like a dive on ↑ and air ↓, is one tool).
export function toolsOf(def) {
  const tools = {};
  const add = (slot, air) => {
    const m = specialFor(def, slot);
    if (!m) return;
    const id = specialId(m);
    const t = tools[id] || (tools[id] = { kind: m.kind, m, ground: null, air: null });
    if (air && !t.air) t.air = slot;
    if (!air && !t.ground) t.ground = slot;
  };
  for (const s of SLOTS) add(s, false);
  for (const s of AIR_SLOTS) add(s, true);
  const K = kitOf(def);
  if (SUPERS[K.super]) tools.super = { kind: SUPERS[K.super].kind, m: SUPERS[K.super] };
  if (SUPERS[K.ultimate]) tools.ultimate = { kind: SUPERS[K.ultimate].kind, m: SUPERS[K.ultimate] };
  else tools.beam = { kind: 'beam' }; // Heavy + Special fires the shared beam (and SUPER does too without a second super)
  for (const id of TECH) tools[id] = { kind: 'tech' };
  return tools;
}

export class Showcase {
  // push 0..1: how hard unused tools are preferred (0 = no effect, the brain's own weights only)
  // persona 0..1: strength of the defense persona (0 = none; ADR 0025)
  constructor(fighter, push = 0, persona = 0) {
    this.f = fighter;
    this.push = push;
    this.personaS = persona;
    this.persona = null; // rolled on the first watch(), when both brains exist
    this.defLog = {}; // defensive answers picked this match (report)
    this.defDone = {}; // defensive actions carried out (reads, reversals, escapes, rallies included)
    this.rallies = 0;
    this.tools = toolsOf(fighter.def);
    // a rhythm clash is a tool only when both ultimates can meet (Hollow Purple, Four-Tails, a beam)
    const o = fighter.opp;
    if (o && clashable(fighter.def) && clashable(o.def)) this.tools.clash = { kind: 'tech' };
    if (o && canBeamClash(fighter.def, o.def)) this.tools.beamClash = { kind: 'tech' }; // energy specials meeting (ADR 0027)
    this.used = {}; // tool id -> times used this match
    this.lastState = '';
    this.lastMove = null;
    this.parries = fighter.parries ?? 0;
  }

  note(id) {
    if (id && this.tools[id]) this.used[id] = (this.used[id] || 0) + 1;
  }

  // Once per frame, before the brain thinks: notice what our fighter just started.
  watch() {
    const f = this.f, s = f.state, g = f.game;
    if (this.personaS > 0 && g?.brains) {
      if (!this.persona) {
        const other = g.brains[1 - f.index]?.show?.persona;
        this.persona = rollPersona(this.personaS, other?.id);
        this.personaRound = g.round;
      } else if (g.round !== this.personaRound) {
        this.personaRound = g.round;
        this.persona = jitterPersona(this.persona);
      }
    }
    if (s !== this.lastState) {
      if (ENTER[s]) this.note(ENTER[s]);
      if (s === 'dash' && f.backDash) this.note('backstep');
      // a vanish answering theirs (their kick then whiffs on nobody): the vanish war
      const o = f.opp;
      if (s === 'vanish' && o && (o.state === 'vanish' || (o.state === 'attack' && o.moveName === 'vanishKick'))) this.note('vanishWar');
      if (s === 'kit' && f.kitState) {
        const k = f.kitState, K = kitOf(f.def);
        if (k.m === SUPERS[K.super]) this.note('super');
        else if (k.m === SUPERS[K.ultimate]) this.note('ultimate');
        else if (k.m) this.note(specialId(k.m));
      }
    }
    // rush specials and shots run as attacks (their data is a copy, so match by name)
    if (s === 'attack' && f.move !== this.lastMove && (f.moveName === 'special' || f.moveName === 'shot' || f.moveName === 'throw')) {
      this.note(specialId(f.move));
    }
    // an ultimate clash or a beam clash this fighter is in (not the one-beat special clash)
    const cl = f.game?.clash;
    if (cl && !cl.lite && cl !== this.lastClash && (cl.a?.f === f || cl.b?.f === f)) {
      this.lastClash = cl;
      this.note(cl.tier === 'struggle' ? 'beamClash' : 'clash');
    }
    if ((f.parries ?? 0) !== this.parries) {
      this.parries = f.parries;
      this.note('parry');
    }
    this.lastState = s;
    this.lastMove = s === 'attack' ? f.move : null;
  }

  // Weight multiplier for a tool: 1 + 3·push for one the viewer hasn't seen, falling toward 1 with each use.
  bias(id) {
    if (!this.push) return 1;
    const n = this.used[id] || 0;
    return 1 + (this.push * 3) / (1 + n * 2);
  }

  fresh(id) {
    return !(this.used[id] > 0);
  }

  // The defense persona's multiplier for `key` (DEF_PERSONAS columns); 1 without a persona.
  pm(key) {
    return this.persona?.m[key] ?? 1;
  }

  // Defensive bookkeeping for report(): `picked` an answer to a threat, or `did` one (pressed it).
  logDef(type, did = false) {
    const L = did ? this.defDone : this.defLog;
    L[type] = (L[type] || 0) + 1;
  }

  // Tools not shown yet, for the soak report (docs/TESTING.md) and debugging.
  unseen() {
    return Object.keys(this.tools).filter((id) => !this.used[id]);
  }

  // Soak report (docs/TESTING.md): `game.brains.map((b) => b.show.report())` after a match.
  report() {
    const f = this.f;
    return { persona: this.persona?.id ?? null, used: { ...this.used }, defLog: { ...this.defLog }, done: { ...this.defDone }, parries: f.parries ?? 0, evades: f.evades ?? 0, rallies: this.rallies };
  }
}
