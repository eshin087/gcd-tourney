// Every animation the engine knows, with what the poses should show. Used by the
// Sprite Lab to build ChatGPT prompts, and mirrored in ASSETS.md.
export const ANIM_GUIDE = {
  idle: { frames: 8, loop: true, pose: 'fighting stance, fists up, slight breathing bob' },
  run: { frames: 8, loop: true, pose: 'full run cycle (ninja run: torso leaned forward, arms trailing straight back)' },
  dash: { frames: 2, loop: true, pose: 'low fast forward dash, body leaning far forward, arms back' },
  backDash: { frames: 3, pose: 'quick hop backwards' },
  superDash: { frames: 2, loop: true, pose: 'flying horizontally like a missile, one fist thrust forward, legs trailing' },
  jumpSquat: { frames: 1, pose: 'crouch right before jumping' },
  jumpUp: { frames: 2, loop: true, pose: 'rising in the air, knees tucked, one arm up' },
  jumpFall: { frames: 2, loop: true, pose: 'falling, legs extending down, arms out for balance' },
  land: { frames: 2, pose: 'landing crouch, then rising' },
  light1: { frames: 7, phases: [2, 2, 3], pose: 'jab: wind-up, lead fist fully extended (2 frames), recover' },
  light2: { frames: 7, phases: [2, 2, 3], pose: 'straight punch with the rear arm: wind-up, extended (2 frames), recover' },
  light3: { frames: 7, phases: [2, 2, 3], pose: 'front kick at stomach height: knee chambered, leg extended (2 frames), recover' },
  light4: { frames: 8, phases: [3, 2, 3], pose: 'spinning roundhouse finisher: wind-up and spin, leg high and extended (2 frames), recover' },
  heavy: { frames: 8, phases: [3, 2, 3], pose: 'rising uppercut launcher: deep crouch, explode upward with the fist straight up (2 frames), land' },
  airLight1: { frames: 5, phases: [1, 2, 2], pose: 'mid-air jab' },
  airLight2: { frames: 5, phases: [1, 2, 2], pose: 'mid-air front kick' },
  airLight3: { frames: 6, phases: [2, 2, 2], pose: 'mid-air spinning kick that knocks away' },
  airHeavy: { frames: 6, phases: [2, 2, 2], pose: 'double-fist hammer: both fists raised overhead, then smashed down-forward' },
  guard: { frames: 2, loop: true, pose: 'blocking, forearms crossed in front of face' },
  block: { frames: 2, pose: 'blocking while being pushed back, eyes shut' },
  hurtHigh: { frames: 3, pose: 'hit in the face: head snapped back, arms flung back' },
  hurtLow: { frames: 3, pose: 'hit in the stomach: doubled over' },
  launched: { frames: 2, loop: true, pose: 'knocked flying backwards, body arched back, limbs flailing' },
  spin: { frames: 4, loop: true, pose: 'tumbling head over heels through the air (one full backward rotation)' },
  airRecover: { frames: 3, pose: 'backflip recovery in mid-air' },
  down: { frames: 2, pose: 'hitting the ground, then lying flat on the back' },
  getup: { frames: 5, pose: 'kip-up from lying on the back to standing' },
  charge: { frames: 4, loop: true, pose: 'powering up: wide stance, fists clenched at sides, shouting upward' },
  throw: { frames: 4, phases: [1, 1, 2], pose: 'throwing a projectile in mid-air: arm cocked back, whipped forward, follow-through' },
  beamCharge: { frames: 3, loop: true, pose: 'charging a beam: both hands cupped together at the rear hip, shouting' },
  beamFire: { frames: 3, loop: true, pose: 'firing a beam: both arms thrust straight forward, palms open, shouting' },
  vanish: { frames: 2, pose: 'crouch and blur before teleporting' },
  stagger: { frames: 4, loop: true, pose: 'dizzy stagger' },
  ko: { frames: 1, pose: 'knocked out, lying flat on the back' },
  special: { frames: 8, phases: [3, 3, 2], pose: 'signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover' },
  intro: { frames: 4, loop: true, pose: 'pre-fight intro pose (character-specific attitude)' },
  taunt: { frames: 2, loop: true, pose: 'confident taunt / pointing at the opponent' },
  win: { frames: 4, loop: true, pose: 'victory pose' },
  // move system v2 (ADR 0009): optional, character-specific; missing ones fall back (src/game/sprites.js FALLBACK)
  specialForward: { frames: 7, phases: [2, 2, 3], optional: true, pose: 'forward special: e.g. a dashing claw strike, or a finger-flick blast' },
  specialUp: { frames: 6, phases: [2, 2, 2], optional: true, pose: 'up special: a leap or rising anti-air technique' },
  specialDown: { frames: 4, phases: [2, 1, 1], optional: true, pose: 'down special: a power-up or a calm defensive stance' },
  superPose: { frames: 4, loop: true, optional: true, pose: 'second super activation pose (the cut-in moment)' },
  // tech recoveries (ADR 0029): optional for every fighter; missing ones fall back to the poses the engine showed
  // before (FALLBACK, src/game/techAnim.js). The engine plays them on the tech state's own clock (DEFENSE animPhases in
  // src/game/moves.js), so `phases` here are art frames per beat: contact, main motion, settle.
  techGround: { frames: 4, phases: [1, 2, 1], optional: true, pose: 'ground tech in place: impact brace low on the floor (feet wide, one palm slapped down, head up), pushing up, rising, back in the fighting stance' },
  techRoll: { frames: 6, phases: [1, 4, 1], optional: true, pose: 'ground tech roll: hits the floor on the back of the shoulder, one tight forward roll along the floor toward screen-right (4 frames, about a quarter turn each), up into a low crouch facing right' },
  wallTech: { frames: 5, phases: [2, 1, 2], optional: true, pose: 'wall tech: lands feet-first on a wall at screen-left, soles flat on it, knees to the chest (2 frames), legs explode off it toward screen-right, airborne recovery into the fall' },
};

export function chatgptPrompt(charName, look, anim) {
  const g = ANIM_GUIDE[anim];
  if (!g) return '';
  return [
    `Pixel art sprite strip of ${charName} (${look}), 2D fighting game sprite, chibi proportions about 3 heads tall, seen in 3/4 view,`,
    `body facing RIGHT, ${g.frames} frame${g.frames > 1 ? 's' : ''} in a single horizontal row, evenly spaced with empty space between poses.`,
    `Animation: ${anim} — ${g.pose}.`,
    `Clean 1-pixel dark outline, limited palette with 3 shades per color, cel shading lit from the upper right, crisp hard pixels (no anti-aliasing, no blur).`,
    `Same character design, size and proportions in every frame, feet on the same baseline. Solid flat magenta (#FF00FF) background, no shadows on the ground, no text.`,
  ].join(' ');
}
