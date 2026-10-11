// Show director (ADR 0027): spectator-only choreography for CPU vs CPU. A beam clash needs one fighter to fire an
// energy move and the other to answer it with theirs, which two independent brains almost never line up, so once
// per match the director picks a random moment and a random challenger and *cues* both brains: the challenger
// fires an energy move from a distance the other can answer, the other answers it (MasterBrain 'challenge' plan and
// 'answerEnergy' defense; CpuBrain cueChoose at Easy / Normal / Hard, which a spectator can pick too). It never
// presses a button or touches the simulation: the brains still play the fight and decide when a cue is possible,
// and a cue that comes to nothing expires and comes back a little later. Only Game.watching creates one (solo and
// versus CPUs never get cues). After the match's first BEAM CLASH it is done: any later one comes from the fight
// itself.
import { energyMoves, airEnergyMoves, canBeamClash } from './kit.js';

// Seconds of fight time (the round timer running): the first cue of round 1 lands at a random moment in `first`,
// a round that started without a beam clash cues after `later`; a cue lasts `cue` frames and, when nothing came of
// it, the next one follows after `retry`.
export const DIRECTOR = { first: [15, 40], later: [8, 20], cue: 480, retry: [6, 12] };

const between = ([a, b]) => Math.round((a + Math.random() * (b - a)) * 60);

export class ShowDirector {
  constructor(game) {
    this.game = game;
    const [a, b] = game.fighters;
    // the Naruto mirror has no energy shot on either side (two Rasengans are the one-beat special clash)
    this.beam = { done: !(a && b && canBeamClash(a.def, b.def)), round: 0, t: 0, due: 0, cue: null, cues: 0, at: null };
  }

  update() {
    const g = this.game, B = this.beam;
    if (B.done) return;
    if (g.clash?.tier === 'struggle') {
      B.done = true;
      B.cue = null;
      B.at = g.timeLeft; // for the soak report (docs/TESTING.md)
      return;
    }
    if (g.state !== 'fight' || !g.inputLive || g.clash) return;
    if (g.round !== B.round) {
      B.round = g.round;
      B.t = 0;
      B.cue = null;
      B.due = between(B.round === 1 ? DIRECTOR.first : DIRECTOR.later);
    }
    B.t++;
    if (B.cue) {
      if (--B.cue.left <= 0) { B.cue = null; B.due = B.t + between(DIRECTOR.retry); }
      return;
    }
    if (B.t < B.due) return;
    // any fighter with an energy move can open; the other answers (a rush opener needs a shot to answer it, and
    // canBeamClash makes sure one side has one)
    const can = g.fighters.filter((f) => energyMoves(f.def).length || airEnergyMoves(f.def).length);
    const ch = can[Math.floor(Math.random() * can.length)];
    if (!ch) { B.done = true; return; }
    B.cue = { challenger: ch.index, left: DIRECTOR.cue };
    B.cues++;
  }

  // What the director wants from fighter `index` right now: 'challenge', 'answer' or null.
  cueFor(kind, index) {
    if (kind !== 'beamClash') return null;
    const cue = this.beam.cue;
    if (!cue) return null;
    return cue.challenger === index ? 'challenge' : 'answer';
  }
}
