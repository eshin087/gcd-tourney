// How the CPU brains press the directional normals (ADR 0042 phase 2, ENG-111). The stick picks the normal as the
// attack starts (Fighter.normalFor, the stick at the press when it is neutral by then), so a brain holds its aim from
// the press until the fighter has read the button, and a neutral one for a plain jab or launcher: walking in depth
// while pressing Light would be an up or down tilt. Jumps: Jump held through the 4-frame squat is a full hop, a tap is
// a short hop, Jump + Light / Heavy a short hop with that aerial out at once. In the air a fresh ↓ past the top of the
// jump fast-falls, so a brain steering in depth keeps off one it doesn't mean.
import { NORMALS, AIR } from './moves.js';
import { towardSide } from './kit.js';

// move name -> { btn, dir, air }: the input NORMALS maps to it (the down air answers to Heavy, the neutral way)
export const NORMAL_INPUT = {};
for (const where of ['ground', 'air']) {
  for (const btn of ['light', 'heavy']) {
    for (const [dir, name] of Object.entries(NORMALS[where][btn])) {
      const was = NORMAL_INPUT[name];
      if (!was || (was.dir !== 'neutral' && dir === 'neutral')) NORMAL_INPUT[name] = { btn, dir, air: where === 'air' };
    }
  }
}
NORMAL_INPUT.dashAttack = { btn: 'light', dir: 'forward', air: false }; // Light in a forward dash with the stick still held

export const FULL_HOP = 8; // frames Jump stays down for a full hop: the squat's 4, plus the slack of a buffered start
export const SHORT_HOP = 2; // a tap: let go before the squat ends
export const AIM_FRAMES = 12; // the longest a press waits in a buffer before the fighter reads it (a chain's 10)

// The screen stick for an aim: ← / → toward them for a ground normal (a ground attack turns to face them), along the
// facing for an aerial (the facing holds through a jump, so `back` hits behind; a short hop's aerial reads it as the
// squat ends, when the jump's facing is the one it has now)
export function aimStick(f, dir, air, toward = towardSide(f)) {
  const s = air ? f.side : toward;
  switch (dir) {
    case 'forward': return [s, 0];
    case 'back': return [-s, 0];
    case 'up': return [0, 1];
    case 'down': return [0, -1];
  }
  return [0, 0];
}

// A Smash aerial is running or the jump is free: where a fresh ↓ is a fast fall (Fighter.tryFastFall)
const smashAir = (f) => f.state === 'air' || (f.state === 'attack' && f.air && !!f.move?.air && !f.juggleMove);

// `my` kept off a fresh ↓ in the air (↓ already held is no fresh press, so it stays), unless the brain means a fast fall
export function noFlick(f, my) {
  if (my >= -0.5 || f.pad.prevDir.d || !smashAir(f) || f.chase > 0) return my;
  return -0.45;
}

// Can a fast fall happen now (past the top, not yet fallen, no chase)? Then a fresh ↓ (the stick let go of ↓ first) does it.
export const canFastFall = (f) => smashAir(f) && !f.fastFell && f.chase <= 0 && f.vel.y <= AIR.ffFrom;
