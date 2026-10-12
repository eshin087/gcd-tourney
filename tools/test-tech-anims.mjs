#!/usr/bin/env node
// Tech recovery poses (ADR 0030): animation selection, beat transitions and missing-art fallbacks, without a browser.
//   npm run test:anims
// Imports the engine's pure modules (src/game/techAnim.js, animPhase.js, moves.js, src/art/animGuide.js) and the real
// FALLBACK / SheetAsset from src/game/sprites.js (location is stubbed: the module reads URL flags at load).

globalThis.location = globalThis.location || { search: '' };
const { TECH_ART, LEGACY_POSE, techBeat, techPose, rollBackward, wallFacing } = await import('../src/game/techAnim.js');
const { phaseFrame } = await import('../src/game/animPhase.js');
const { DEFENSE } = await import('../src/game/moves.js');
const { ANIM_GUIDE } = await import('../src/art/animGuide.js');
const { FALLBACK, SheetAsset } = await import('../src/game/sprites.js');

let passes = 0, failures = 0;
const check = (ok, msg) => {
  if (ok) passes++;
  else { failures++; console.log(`  FAIL ${msg}`); }
};
const sum = (a) => a.reduce((p, c) => p + c, 0);

console.log('tech animation test');

// ---- the contract: guide entries, fallbacks, beats that fit the gameplay timings
const T = DEFENSE.tech, I = DEFENSE.impactTech;
for (const name of Object.values(TECH_ART)) {
  const g = ANIM_GUIDE[name];
  check(g && g.optional === true && g.phases?.length === 3 && sum(g.phases) === g.frames, `guide: ${name} is optional with 3 beats that sum to its frames`);
  check(typeof FALLBACK[name] === 'string' && ANIM_GUIDE[FALLBACK[name]], `FALLBACK: ${name} falls back to an existing animation (${FALLBACK[name]})`);
}
check(sum(I.inPlace.animPhases) === I.inPlace.len && I.inPlace.animPhases[0] + I.inPlace.animPhases[1] === I.inPlace.invuln,
  'beats: tech in place spans its length, the main beat ends with the invulnerability');
check(sum(I.roll.animPhases) === I.roll.len && I.roll.animPhases[0] + I.roll.animPhases[1] === I.roll.invuln,
  'beats: the timed tech roll spans its length, the tumble ends with the invulnerability');
check(sum(T.roll.animPhases) === T.roll.len && T.roll.animPhases[0] + T.roll.animPhases[1] === T.roll.invuln,
  'beats: the hold-Guard tech roll spans its length, the tumble ends with the invulnerability');
check(sum(I.wall.animPhases) === I.wall.stick + I.wall.len && I.wall.animPhases[0] === I.wall.stick,
  'beats: the wall tech spans the cling and the fall, its first beat is exactly the cling');
check(Number.isInteger(I.wallJump.animFrames) && I.wallJump.animFrames > 0 && I.wallJump.animFrames < I.wall.len,
  'beats: the wall jump shows the push-off for a few frames only');

// ---- beat transitions on the state clock
const beatSeq = (beats, n) => Array.from({ length: n }, (_, t) => techBeat(t, beats).phase).join('');
check(beatSeq(I.inPlace.animPhases, I.inPlace.len) === '000011111111112222', `transitions: in place 4/10/4 (${beatSeq(I.inPlace.animPhases, I.inPlace.len)})`);
check(beatSeq(I.wall.animPhases, 18) === '000000111122222222', `transitions: wall cling 6, kick 4, fall 8 (${beatSeq(I.wall.animPhases, 18)})`);
check(techBeat(I.roll.len + 5, I.roll.animPhases).phase === 2 && techBeat(I.roll.len + 5, I.roll.animPhases).p === 1, 'transitions: past the end it holds the settle beat');
check(techBeat(0, [0, 3, 1]).phase === 1, 'transitions: an empty contact beat starts in the main beat');

// ---- frames shown over a whole state (the guide's art phases on the state's beats)
const frames = (name, beats, n, reverse = false) => Array.from({ length: n }, (_, t) => {
  const P = techPose(Object.keys(TECH_ART).find((k) => TECH_ART[k] === name), t, beats, true, reverse);
  const g = ANIM_GUIDE[name];
  return phaseFrame(g.phases, g.frames, P.phase, P.reverse ? Math.max(0, 1 - P.p - 1e-6) : P.p);
}).join('');
check(frames('techGround', I.inPlace.animPhases, 18) === '000011111222223333', `frames: techGround f0 brace, f1-f2 rise, f3 stance (${frames('techGround', I.inPlace.animPhases, 18)})`);
check(frames('techRoll', I.roll.animPhases, 22) === '0001111222233334445555', `frames: techRoll contact, 4 tumble frames, recovery (${frames('techRoll', I.roll.animPhases, 22)})`);
check(frames('techRoll', I.roll.animPhases, 22, true) === '0004444333322221115555', `frames: a back roll plays the tumble backward, contact and recovery forward (${frames('techRoll', I.roll.animPhases, 22, true)})`);
check(frames('techRoll', T.roll.animPhases, 20) === '00011112222333344455', `frames: the hold-Guard roll (${frames('techRoll', T.roll.animPhases, 20)})`);
check(frames('wallTech', I.wall.animPhases, 18) === '000111222233334444', `frames: wallTech cling f0-f1, push-off f2, fall f3-f4 (${frames('wallTech', I.wall.animPhases, 18)})`);
// a strip drawn with another frame count still lands on the same beats (the packer rescales its phases)
check(phaseFrame([2, 3, 2], 7, 1, 0) === 2 && phaseFrame([2, 3, 2], 7, 2, 0.99) === 6, 'frames: other frame counts keep the beat boundaries');

// ---- selection: dedicated strip when the sheet has it, the legacy pose otherwise
for (const kind of ['inPlace', 'roll', 'wall']) {
  const beats = kind === 'roll' ? I.roll.animPhases : I[kind].animPhases;
  const t1 = beats[0] + 1;
  const art = techPose(kind, t1, beats, true), legacy = techPose(kind, t1, beats, false);
  check(art.name === TECH_ART[kind] && !art.free && art.phase === 1, `selection: ${kind} with art plays ${TECH_ART[kind]} on its beats`);
  check(legacy.free && legacy.name === LEGACY_POSE[kind][1], `selection: ${kind} without art keeps its legacy pose (${legacy.name})`);
}
check(techPose('wall', 0, I.wall.animPhases, false).name === 'land' && techPose('wall', I.wall.stick, I.wall.animPhases, false).name === 'airRecover',
  'selection: without art the wall tech still clings in land and kicks in airRecover');
check(techPose('roll', 1, I.roll.animPhases, true, true).reverse === false && techPose('roll', 5, I.roll.animPhases, true, true).reverse === true,
  'selection: only the tumble beat reverses');

// ---- rolls and walls
check(rollBackward(-8, 0, 1, 0) && !rollBackward(8, 0, 1, 0) && !rollBackward(0, 8, 1, 0) && !rollBackward(0, 0, 1, 0), 'roll: backward only when it rolls against the facing (not in depth, not standing)');
for (const yaw of [-0.42, 0, 0.42]) {
  const camRight = { x: Math.cos(yaw), z: -Math.sin(yaw) };
  const xp = wallFacing('x', 1, camRight), xn = wallFacing('x', -1, camRight), zp = wallFacing('z', 1, camRight), zn = wallFacing('z', -1, camRight);
  check(xp.side && xp.fx === -1 && xn.side && xn.fx === 1 && !zp.side && !zn.side, `walls at yaw ${yaw}: the x walls are screen-side (facing away from them), the z walls are in depth`);
}

// ---- missing art: SheetAsset never loses a tech strip, it falls back
const img = { width: 4096, height: 2816 };
const meta = (anims) => ({ frameWidth: 256, frameHeight: 256, columns: 16, pivot: [128, 240], pixelsPerUnit: 128, animations: anims });
const base = { idle: { frames: [0, 1] }, land: { frames: [2, 3] }, airRecover: { frames: [4, 5, 6] }, jumpUp: { frames: [7] } };
const old = new SheetAsset(img, meta(base), 'art-pack');
check(!old.has('techGround') && !old.has('techRoll') && !old.has('wallTech'), 'missing art: a sheet without the strips reports none');
check(old.anim('techGround') === base.land && old.anim('techRoll') === base.airRecover && old.anim('wallTech') === base.land, 'missing art: lookups fall back to land / airRecover / land');
const withArt = { ...base, techGround: { frames: [8, 9, 10, 11], phases: [1, 2, 1] }, wallTech: { frames: [12, 13, 14, 15, 16], phases: [2, 1, 2] } };
const neu = new SheetAsset(img, { ...meta(withArt), wallAnchor: { 12: 30, 13: 28, 14: 41 } }, 'art-pack');
check(neu.has('techGround') && neu.has('wallTech') && !neu.has('techRoll') && neu.anim('techRoll') === base.airRecover, 'missing art: each strip switches on by itself (techRoll still falls back)');
check(Math.abs(neu.wallAnchor(12) - 30 / 128) < 1e-9 && neu.wallAnchor(15) === 0 && old.wallAnchor(12) === 0, 'wall anchor: read from anims.json in world units, 0 elsewhere');

console.log(`${failures ? 'FAILED' : 'OK'}: ${passes} passed, ${failures} failed`);
process.exitCode = failures ? 1 : 0;
