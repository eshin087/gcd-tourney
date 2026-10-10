// Rhythm clash (ADR 0017 part 2): when two ultimates meet, both players play the same short note chart. Approach
// rings close on a target; each press is graded by how many frames it is off its note, better grades push the
// struggle point harder, and a press with no note near it pushes back, so mashing loses. This module is the pure
// logic (chart + judging); Game owns the bodies and the visuals, the HUD draws the rings.
import { CLASH } from './moves.js';

// small seeded PRNG (mulberry32): a pairing always gets the same chart, and both players get the same one
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// FNV-1a over the sorted ids: Hollow Purple vs Four-Tails is the same chart whoever is on the left
export function seedOf(...ids) {
  let h = 2166136261;
  for (const ch of ids.map(String).sort().join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Frames from the clash start. Phase by phase the notes come faster; some become doubles (a second tap
// `doubleGap` later) and a later phase may rest one beat; the chart ends on the FINAL PUSH hold.
export function makeChart(seed, C = CLASH) {
  const R = rng(seed), notes = [];
  let t = C.intro;
  C.phases.forEach((P, pi) => {
    const doubles = new Set();
    while (doubles.size < Math.min(P.doubles ?? 0, P.notes - 1)) doubles.add(1 + Math.floor(R() * (P.notes - 1)));
    const rest = pi > 0 && R() < 0.5 ? 1 + Math.floor(R() * (P.notes - 2)) : -1;
    for (let i = 0; i < P.notes; i++) {
      if (i !== rest) {
        notes.push({ t, kind: 'tap', phase: pi });
        if (doubles.has(i)) notes.push({ t: t + C.doubleGap, kind: 'tap', phase: pi, double: true });
      }
      t += P.every;
    }
  });
  t += C.hold.gap;
  notes.push({ t, kind: 'hold', end: t + C.hold.len, phase: C.phases.length });
  notes.sort((a, b) => a.t - b.t);
  return { notes, end: t + C.hold.len, lead: C.lead };
}

// The special clash (two rush specials meeting): one ring, one press.
export function beatChart(S = CLASH.special) {
  const t = S.intro + S.lead;
  return { notes: [{ t, kind: 'tap', phase: 0 }], end: t, lead: S.lead, lite: true };
}

export function grade(off, W = CLASH.windows) {
  const a = Math.abs(off);
  return a <= W.perfect ? 'perfect' : a <= W.great ? 'great' : a <= W.good ? 'good' : null;
}

// One player's run through a chart. frame(now, pressed, down) once per frame: `pressed` = a clash button went down
// this frame, `down` = one is held. Returns what got graded this frame ([{ i, g, off }], i = -1 for a stray).
export class Judge {
  constructor(chart, C = CLASH) {
    this.chart = chart;
    this.C = C;
    this.res = chart.notes.map(() => null);
    this.score = 0;
    this.holding = -1;
    this.strayT = -99;
    this.counts = { perfect: 0, great: 0, good: 0, miss: 0, stray: 0 };
  }

  give(i, g, off, out) {
    this.score += this.C.points[g] ?? 0;
    this.counts[g] = (this.counts[g] ?? 0) + 1;
    out.push({ i, g, off });
  }

  frame(now, pressed, down) {
    const out = [], N = this.chart.notes, W = this.C.windows;
    // the FINAL PUSH: held to its end (or let go within the window before it) completes it
    if (this.holding >= 0) {
      const n = N[this.holding];
      if (now >= n.end) { this.give(this.holding, 'perfect', 0, out); this.res[this.holding].done = true; this.holding = -1; }
      else if (!down) {
        const g = grade(n.end - now, W);
        this.give(this.holding, g ?? 'miss', n.end - now, out);
        this.res[this.holding].done = true;
        this.holding = -1;
      }
    }
    if (pressed) {
      // the earliest open note whose window holds the press (a late tap can't steal the double after it)
      let best = -1, bo = 0;
      for (let i = 0; i < N.length; i++) {
        if (this.res[i]) continue;
        const o = now - N[i].t;
        if (o < -W.good) break;
        if (o <= W.good) { best = i; bo = o; break; }
      }
      if (best >= 0) {
        this.res[best] = { g: grade(bo, W), off: bo };
        this.give(best, this.res[best].g, bo, out);
        if (N[best].kind === 'hold') this.holding = best;
      } else if (now - this.strayT >= 4) {
        // off the beat: mashing pushes you back (at most one stray every 4 frames, so a held tap counts once)
        this.strayT = now;
        this.give(-1, 'stray', 0, out);
      }
    }
    for (let i = 0; i < N.length; i++) {
      if (!this.res[i] && now - N[i].t > W.good) {
        this.res[i] = { g: 'miss' };
        this.give(i, 'miss', 0, out);
      }
    }
    return out;
  }

  get finished() {
    return this.res.every((r, i) => r && (this.chart.notes[i].kind !== 'hold' || r.done || r.g === 'miss'));
  }

  // the most this player can still score (a hold is two grades: the press and the release)
  maxLeft() {
    let n = 0;
    this.chart.notes.forEach((note, i) => {
      if (!this.res[i]) n += note.kind === 'hold' ? 2 : 1;
      else if (i === this.holding) n += 1;
    });
    return n * this.C.points.perfect;
  }
}

// The CPU's presses for a chart: each note at its frame plus a gaussian error (`sd` frames), or skipped (`miss`);
// the hold is let go around its end with half that error. Returns [{ at, len }] in time order (len = frames held).
export function cpuPlan(chart, skill, rand = Math.random) {
  const gauss = () => {
    let u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const presses = [];
  for (const n of chart.notes) {
    if (rand() < skill.miss) continue;
    const at = Math.max(1, Math.round(n.t + gauss() * skill.sd));
    const len = n.kind === 'hold' ? Math.max(4, Math.round(n.end + gauss() * skill.sd * 0.5) - at) : 2;
    presses.push({ at, len });
  }
  return presses.sort((a, b) => a.at - b.at);
}

// A CPU's side of one clash: the plan, handed out frame by frame. `due(now)` = the presses starting on `now`.
export class BeatPlan {
  constructor(clash, skill, rand) {
    this.clash = clash;
    this.presses = cpuPlan(clash.chart, skill, rand);
    this.i = 0;
    this.alt = false;
  }

  due(now) {
    const out = [];
    while (this.i < this.presses.length && this.presses[this.i].at <= now) out.push(this.presses[this.i++]);
    return out;
  }

  // alternate Light and Heavy so two quick presses are always two separate button-downs
  button() {
    this.alt = !this.alt;
    return this.alt ? 'light' : 'heavy';
  }
}
