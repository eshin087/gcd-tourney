// Tech recovery poses (ADR 0030): which strip a tech state shows, on what clock, facing which way. Pure (no three.js,
// no DOM) so tools/test-tech-anims.mjs runs it in Node; Fighter asks it every frame of a tech state.
//
// The three dedicated strips (src/art/animGuide.js: techGround, techRoll, wallTech) are optional. A fighter whose sheet
// lacks one keeps exactly the poses the engine showed before they existed (LEGACY_POSE), free-running as before, so
// missing art never changes a current character. With the strip, the pose follows the tech state's own clock in three
// beats (DEFENSE animPhases in moves.js), so the art's frame count never touches gameplay timing, invulnerability or
// movement.

export const TECH_ART = Object.freeze({ inPlace: 'techGround', roll: 'techRoll', wall: 'wallTech' });

// What each tech showed before its art existed, per beat [contact, main, settle]; still shown while a sheet lacks it.
// The wall tech's beats are the cling, the kick and the fall; its wall-jump variant becomes `jumpUp` at the kick.
export const LEGACY_POSE = Object.freeze({
  inPlace: Object.freeze(['land', 'land', 'land']),
  roll: Object.freeze(['airRecover', 'airRecover', 'airRecover']),
  wall: Object.freeze(['land', 'airRecover', 'airRecover']),
});

// The beat of a tech state's clock. `beats` are sim frames [contact, main, settle] (DEFENSE animPhases).
export function techBeat(t, beats) {
  const a = beats[0], b = beats[1], c = beats[2];
  if (t < a) return { phase: 0, p: t / a };
  if (t < a + b) return { phase: 1, p: (t - a) / b };
  return { phase: 2, p: c > 0 ? Math.min(1, (t - a - b) / c) : 1 };
}

// What a tech state shows on frame t of its clock. kind: 'inPlace' | 'roll' | 'wall'; art: the fighter's sheet has
// the dedicated strip. Returns { name, phase, p, reverse } for SpriteActor.setPhase, or { name, free: true } for the
// legacy pose (Fighter plays it free-running, as before). reverse: play the main beat backward (a back roll).
export function techPose(kind, t, beats, art, reverse = false) {
  const b = techBeat(t, beats);
  if (!art) return { name: LEGACY_POSE[kind][b.phase], free: true };
  return { name: TECH_ART[kind], phase: b.phase, p: b.p, reverse: !!reverse && b.phase === 1 };
}

// The roll strip is drawn as a forward roll (toward the facing). Rolling the other way plays its tumble beat backward,
// so it reads as a back roll and the sprite never turns around mid-roll; a roll mostly into or out of the screen
// (|cos| < ROLL_SIDE between the roll and the facing) plays forward.
export const ROLL_SIDE = 0.25;
export function rollBackward(vx, vz, fx, fz) {
  const v = Math.hypot(vx, vz), f = Math.hypot(fx, fz);
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
export function wallFacing(axis, sign, camRight) {
  const nx = axis === 'x' ? -sign : 0, nz = axis === 'z' ? -sign : 0;
  const d = nx * camRight.x + nz * camRight.z;
  return Math.abs(d) >= WALL_SIDE ? { side: true, fx: nx, fz: nz } : { side: false, fx: 0, fz: 0 };
}
