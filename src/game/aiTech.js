// Timed impact tech for the CPUs, the training dummy and the lab scripts (ADR 0028). The tech needs a fresh Guard press
// at most DEFENSE.impactTech.window live frames before a launched fighter meets the floor or the ring barrier, so a
// brain has to see the impact coming: impactAhead() steps the flight forward the way Fighter.physics would, and a
// TechTimer decides once per impact whether to go for it and how many frames early it presses (the level's jitter can
// put it outside the window: too early locks the tech out, too late misses it).
import { DEFENSE, JUGGLE } from './moves.js';
import { ARENA_LIMIT, GRAVITY, DT } from './constants.js';
import { gauss } from './rng.js';

const J = JUGGLE;
const AHEAD = { k: 0, kind: '', axis: '', sign: 0 };

// The fighter's next techable impact, or null: k = live frames until it (1 = on its next live frame; hitstop frames
// don't count, like the tech window), kind 'ground' (the first floor contact of this fall) or 'wall' (a wall bounce,
// axis / sign: the barrier). Nobody touching them; a later hit changes it.
export function impactAhead(f, max = 90) {
  if (f.state !== 'launched' || !f.impactTechable()) return null;
  const gs = Math.min(J.gravity.max, J.gravity.base + f.combo * J.gravity.per);
  let x = f.pos.x, y = f.pos.y, z = f.pos.z, vx = f.vel.x, vy = f.vel.y, vz = f.vel.z;
  for (let k = 1; k <= max; k++) {
    x += vx * DT; y += vy * DT; z += vz * DT;
    vy -= GRAVITY * gs * DT;
    if (y <= 0 && vy <= 0) return f.bounced ? null : out(k, 'ground', '', 0);
    if (Math.abs(x) > ARENA_LIMIT) {
      if (f.wb && Math.abs(vx) > J.wall.minSpeed) return out(k, 'wall', 'x', Math.sign(x));
      x = Math.sign(x) * ARENA_LIMIT; vx *= -0.25;
    }
    if (Math.abs(z) > ARENA_LIMIT) {
      if (f.wb && Math.abs(vz) > J.wall.minSpeed) return out(k, 'wall', 'z', Math.sign(z));
      z = Math.sign(z) * ARENA_LIMIT; vz *= -0.25;
    }
  }
  return null;
}

function out(k, kind, axis, sign) {
  AHEAD.k = k; AHEAD.kind = kind; AHEAD.axis = axis; AHEAD.sign = sign;
  return AHEAD;
}

// The option a brain picks per impact: on the floor tech in place or roll away / toward, on the barrier the wall tech
// or the wall jump. Weights, not rates.
const GROUND_OPTS = [['inPlace', 0.4], ['away', 0.35], ['toward', 0.25]];
const WALL_OPTS = [['wall', 0.55], ['wallJump', 0.45]];
const pickOpt = (opts, r) => {
  let a = r * opts.reduce((s, o) => s + o[1], 0);
  for (const [id, w] of opts) if ((a -= w) < 0) return id;
  return opts[0][0];
};

// One brain's timing. rate: chance per launch that it goes for the timed tech at that launch's impacts; sd: frames of
// error on its press, around `aim` frames before each impact (a press at most `window` early techs). The choice is
// made when the launch starts because any earlier Guard press in it (the hold-Guard tech's) would lock the timed tech
// out: an `armed` brain techs at the air gaps with another button instead (Fighter: any press techs an open frame).
// plan(f) every brain frame, before the fighter updates (a press now is stamped on the fighter's next live frame),
// returns null or this.out:
//   guard  'release' (let a held Guard go, so the press is an edge) | 'press' | null
//   mx, my the stick to hold for the option (screen space: mx toward the opponent's side for 'toward'), or null
export class TechTimer {
  constructor(rate, sd, rand = Math.random) {
    this.rate = rate;
    this.sd = sd;
    this.rand = rand;
    this.aim = Math.round(DEFENSE.impactTech.window * 0.45);
    this.armed = null; // this launch: going for the timed tech (null = not launched)
    this.key = null;
    this.out = { guard: null, mx: null, my: null };
  }

  plan(f, side = 1) {
    const o = this.out;
    o.guard = null; o.mx = null; o.my = null;
    // the wall jump: keep ↑ held through the cling until the kick
    if (f.state === 'impactTech') {
      if (this.opt === 'wallJump') o.my = 1;
      return o.my != null ? o : null;
    }
    if (f.state !== 'launched') { this.armed = null; this.key = null; this.opt = null; return null; }
    if (this.armed === null) this.armed = this.rand() < this.rate;
    if (!this.armed) return null;
    const a = impactAhead(f);
    if (!a) return null;
    const key = `${f.combo}:${f.gbCount}:${f.wbCount}:${a.kind}`; // a new hit or bounce is a new impact
    if (key !== this.key) {
      this.key = key;
      this.lead = Math.round(this.aim + gauss(this.rand) * this.sd);
      this.opt = pickOpt(a.kind === 'wall' ? WALL_OPTS : GROUND_OPTS, this.rand());
      this.pressed = false;
    }
    const left = a.k - 1; // the press made now is this many live frames before the impact
    if (this.opt === 'away' || this.opt === 'toward') { o.mx = this.opt === 'toward' ? side : -side; o.my = 0; }
    else if (this.opt === 'wallJump') { o.mx = 0; o.my = 1; }
    else if (left <= this.lead + 2) { o.mx = 0; o.my = 0; } // tech in place / wall tech: a neutral stick at the impact
    if (!this.pressed && left <= this.lead) { this.pressed = true; o.guard = 'press'; }
    else if (!this.pressed && left <= this.lead + 2) o.guard = 'release';
    return o;
  }

}
