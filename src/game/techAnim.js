// Tech recovery poses (ADR 0030): which strip a tech state shows, on what clock, facing which way. Pure (no three.js,
// no DOM) so tools/test-tech-anims.mjs runs it in Node; Fighter asks it every frame of a tech state.
//
// The three dedicated strips (src/art/animGuide.js: techGround, techRoll, wallTech) are optional. A fighter whose sheet
// lacks one keeps exactly the poses the engine showed before they existed (LEGACY_POSE), free-running as before, so
// missing art never changes a current character. With the strip, the pose follows the tech state's own clock in three
// beats (DEFENSE animPhases in moves.js), so the art's frame count never touches gameplay timing, invulnerability or
// movement.
import * as dmath from './dmath.js';

export const TECH_ART = Object.freeze({ inPlace: 'techGround', roll: 'techRoll', wall: 'wallTech' });

// What each tech showed before its art existed, per beat [contact, main, settle]; still shown while a sheet lacks it.
// The wall tech's beats are the cling, the kick and the fall; its wall-jump variant becomes `jumpUp` at the kick.
export const LEGACY_POSE = Object.freeze({
  inPlace: Object.freeze(['land', 'land', 'land']),
  roll: Object.freeze(['airRecover', 'airRecover', 'airRecover']),
  wall: Object.freeze(['land', 'airRecover', 'airRecover']),
});

// The beat of a tech state's clock. `beats` are sim frames [contact, main, settle] (DEFENSE animPhases). The helpers
// here fill `out` when given one (Fighter passes a reused object: they run every frame of a tech state).
export function techBeat(t, beats, out = {}) {
  const a = beats[0], b = beats[1], c = beats[2];
  if (t < a) { out.phase = 0; out.p = t / a; }
  else if (t < a + b) { out.phase = 1; out.p = (t - a) / b; }
  else { out.phase = 2; out.p = c > 0 ? Math.min(1, (t - a - b) / c) : 1; }
  return out;
}

// What a tech state shows on frame t of its clock. kind: 'inPlace' | 'roll' | 'wall'; art: the fighter's sheet has
// the dedicated strip. Returns { name, free: false, phase, p, reverse } for SpriteActor.setPhase, or { name, free: true }
// for the legacy pose (Fighter plays it free-running, as before). reverse: play the main beat backward (a back roll).
const BEAT = { phase: 0, p: 0 };
export function techPose(kind, t, beats, art, reverse = false, out = {}) {
  const b = techBeat(t, beats, BEAT);
  out.free = !art;
  out.name = art ? TECH_ART[kind] : LEGACY_POSE[kind][b.phase];
  out.phase = b.phase;
  out.p = b.p;
  out.reverse = !!art && !!reverse && b.phase === 1;
  return out;
}

// The roll strip is drawn as a forward roll (toward the facing). Rolling the other way plays its tumble beat backward,
// so it reads as a back roll; a roll mostly into or out of the screen (|cos| < ROLL_SIDE between the roll and the
// facing) plays forward. Fighter decides it once, at the roll's start, with the facing it then keeps on screen: a
// cross-up mid-roll never turns the sprite around or flips the tumble.
export const ROLL_SIDE = 0.25;
export function rollBackward(vx, vz, fx, fz) {
  const v = dmath.hypot(vx, vz), f = dmath.hypot(fx, fz);
  if (v < 1e-4 || f < 1e-4) return false;
  return (vx * fx + vz * fz) / (v * f) < -ROLL_SIDE;
}

// The ring barrier is four walls (x = ±ARENA_LIMIT, z = ±ARENA_LIMIT; n = the wall's normal into the ring). The wall
// strip is drawn with the wall at the cell's left, behind the fighter, pushing off to the right. A wall the camera
// sees at a screen side (|n·camRight| >= WALL_SIDE: the two x walls, because the fight camera's yaw stays within
// ±0.42 rad) shows the strip facing away from it, so the drawn wall lies on the barrier. A wall in depth (the front
// and back z walls) has no screen side to draw it on: the fighter keeps facing the opponent and the strip is
// re-centred on the fighter (anims.json wallAnchor) while it pushes off into the screen.
export const WALL_SIDE = 0.5;
export function wallFacing(axis, sign, camRight, out = {}) {
  const nx = axis === 'x' ? -sign : 0, nz = axis === 'z' ? -sign : 0;
  out.side = Math.abs(nx * camRight.x + nz * camRight.z) >= WALL_SIDE;
  out.fx = out.side ? nx : 0;
  out.fz = out.side ? nz : 0;
  return out;
}

// How far along the camera's right a wall-anchored frame is drawn from the fighter, in the sprite's local world units
// (Fighter scales it by the depth factor). The packer puts such a frame's wall side near the cell's left edge (its
// wall line, anims.json wallLine) so a full push-off fits the cell. On a screen-side wall that line goes on the
// fighter's position, against the barrier; on a wall in depth the body's centre does (anims.json wallAnchor).
// flip: the sprite's mirror (1 = facing screen-right); line: the wall line's distance left of the pivot; anchor: the
// body centre's offset right of the pivot.
export function wallShift(side, flip, line, anchor) {
  return side ? flip * line : -flip * anchor;
}
