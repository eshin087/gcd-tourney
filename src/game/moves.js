// Move data, in 60fps frames. Gameplay timing lives here (not in the art), so a
// new sprite sheet only needs the same animation names to plug in.
//
//  startup/active/recovery  frames per phase (animation frames are spread across them via anims.json "phases")
//  dmg        base damage (HP is 1000)
//  reach      forward hit range from the attacker's center, width = sideways tolerance (free-roam ring)
//  hitstun    frames a grounded victim is stunned;  push = knockback speed
//  airPop     upward speed given to an airborne victim (keeps juggles alive)
//  launch     [horizontal, vertical] speed -> knocks the victim into the air
//  groundBounce / wallBounce  the victim bounces off the floor / ring barrier (a per-combo budget: JUGGLE.ground / .wall)
//  launcher   a jump or dash input after it connects chases the victim into the air
//  next/cancel  chain into the next move from this frame on
//  spark      'light' | 'heavy' | 'smash' impact effect size
//  boxPad     [x, y] world units the sprite hit box grows by for the overlap test (default 0.1/0.12, air 0.18/0.45)
//  hardKnockdown  no tech roll on the landing after this hit (ADR 0022); unset, it defaults to true for ground-bounce
//             spikes (dive slams) and big unblockable hits (super and ultimate finishes, clash results), else false
//  lock       a multi-hit tick keeps air stun / hit stun at least this long, so one move can't be teched midway
//  noTech     the timed impact tech can't beat the floor or barrier impact after this hit (super finishes, ADR 0028)
//  ground     the floor damage style a special, shot or super leaves (GROUND_STYLES in ground.js, ADR 0024)
//  meleeClash 'light' | 'heavy': meets the same class head-on in a MELEE CLASH; a heavy beats a light (MELEE_CLASH)
// Directional normals (ADR 0042; NORMALS below picks them from the stick):
//  btn        the button that starts it ('light' | 'heavy'): the other one pressed a frame or two later still reads as a throw
//  chain      a jab-string move (Light × 4, air Light × 3): the only normals that chain into other normals (the next hit, the
//             launcher, the spike). Every other normal links: the next move has to land inside the hit stun
//  landLag    an aerial's landing lag (default AIR.landLag); landing from `autoCancel` on (its recovery's tail) is a plain landing
//  back       hits behind the attacker (a back air): it sends them the other way
//  both       hits in front and behind (a down smash)
//  feet       a light pop: the victim lands on their feet instead of in a knockdown (Smash's low-knockback hits)
//  charge     a smash attack: Heavy held on frame `at` holds the swing up to `max` frames, for up to `mul` × the damage
export const MOVES = {
  light1: { anim: 'light1', startup: 5, active: 3, recovery: 11, dmg: 28, reach: 1.3, width: 0.95, hitstun: 22, push: 2.2, airPop: 5.5, hitstop: 7, lunge: 4.5, next: 'light2', cancel: 7, sfx: 'whoosh', spark: 'light', light: true, chain: true, btn: 'light', meleeClash: 'light' },
  light2: { anim: 'light2', startup: 5, active: 3, recovery: 12, dmg: 30, reach: 1.35, width: 0.95, hitstun: 22, push: 2.4, airPop: 5.5, hitstop: 7, lunge: 4.5, next: 'light3', cancel: 7, sfx: 'whoosh', spark: 'light', light: true, chain: true, btn: 'light', meleeClash: 'light' },
  light3: { anim: 'light3', startup: 6, active: 4, recovery: 14, dmg: 36, reach: 1.55, width: 1.0, hitstun: 24, push: 2.8, airPop: 6, hitstop: 8, lunge: 5, next: 'light4', cancel: 9, sfx: 'whoosh', spark: 'light', light: true, low: true, chain: true, btn: 'light', meleeClash: 'light' },
  light4: { anim: 'light4', startup: 9, active: 4, recovery: 22, dmg: 58, reach: 1.65, width: 1.05, launch: [14, 6], hitstop: 13, lunge: 6, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.5, wallBounce: true, chain: true, btn: 'light', meleeClash: 'light' },
  heavy: { anim: 'heavy', startup: 12, active: 5, recovery: 22, dmg: 64, reach: 1.4, width: 1.05, launch: [2.4, 15.5], hitstop: 12, lunge: 5.5, hop: 5, sfx: 'whooshHeavy', spark: 'heavy', big: true, shake: 0.45, launcher: true, yTol: 1.7, boxPad: [0.14, 0.3], btn: 'heavy', meleeClash: 'heavy' },
  // ---- tilts, dash attack and smash attacks (ADR 0042): until Codex draws them they show the strips FALLBACK names
  // (src/game/sprites.js), whose hit boxes they use
  // forward tilt: a long poke that pushes them out (+4 on hit, -5 on block)
  fTilt: { anim: 'fTilt', startup: 7, active: 3, recovery: 15, dmg: 46, reach: 1.6, width: 1.0, hitstun: 22, push: 4, airPop: 5.5, hitstop: 9, lunge: 3, sfx: 'whoosh', spark: 'heavy', btn: 'light', meleeClash: 'light' },
  // up tilt: an anti-air that pops them just over the head, so it juggles into itself or an up air
  uTilt: { anim: 'uTilt', startup: 6, active: 6, recovery: 14, dmg: 38, reach: 1.15, width: 1.0, launch: [0.4, 8.5], feet: true, hitstop: 8, lunge: 2.5, yTol: 2.2, boxPad: [0.35, 0.5], sfx: 'whoosh', spark: 'heavy', btn: 'light', meleeClash: 'light' },
  // down tilt: a quick low poke (+11 on hit: links into a jab or a tilt; +1 on block)
  dTilt: { anim: 'dTilt', startup: 5, active: 3, recovery: 12, dmg: 30, reach: 1.5, width: 0.95, hitstun: 26, push: 1.6, airPop: 5, hitstop: 7, lunge: 2, low: true, sfx: 'whoosh', spark: 'light', btn: 'light', meleeClash: 'light' },
  // dash attack: Light during a dash with the stick held; it carries the dash in and pops them up a little (-6 on block)
  dashAttack: { anim: 'dashAttack', startup: 8, active: 5, recovery: 25, dmg: 50, reach: 1.5, width: 1.05, launch: [4, 8.5], feet: true, hitstop: 10, lunge: 10, sfx: 'whooshHeavy', spark: 'heavy', big: true, shake: 0.3, btn: 'light', meleeClash: 'light' },
  // smash attacks: slow, punishable (-8 to -10 on block), and Heavy held on frame `charge.at` charges them
  fSmash: { anim: 'fSmash', startup: 15, active: 4, recovery: 30, dmg: 90, reach: 1.7, width: 1.05, launch: [17, 7], wallBounce: true, hitstop: 14, lunge: 4, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.7, btn: 'heavy', meleeClash: 'heavy', charge: { at: 6, max: 60, mul: 1.4 } },
  uSmash: { anim: 'uSmash', startup: 11, active: 6, recovery: 26, dmg: 80, reach: 1.2, width: 1.05, launch: [2, 17], hitstop: 13, lunge: 3, yTol: 2.4, boxPad: [0.35, 0.6], sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.6, btn: 'heavy', meleeClash: 'heavy', charge: { at: 5, max: 60, mul: 1.4 } },
  dSmash: { anim: 'dSmash', startup: 9, active: 5, recovery: 28, dmg: 76, reach: 1.5, width: 1.0, launch: [12, 4.5], both: true, low: true, hitstop: 13, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.55, btn: 'heavy', meleeClash: 'heavy', charge: { at: 4, max: 60, mul: 1.4 } },
  // ---- aerials. Neutral air is airLight1 (the air string's first hit) and down air is airHeavy (the spike)
  airLight1: { anim: 'airLight1', startup: 4, active: 4, recovery: 9, dmg: 24, reach: 1.4, width: 1.0, hitstun: 20, push: 1.6, airPop: 6.2, hitstop: 7, air: true, yTol: 1.7, next: 'airLight2', cancel: 7, landLag: 6, sfx: 'whoosh', spark: 'light', chain: true, meleeClash: 'light' },
  airLight2: { anim: 'airLight2', startup: 4, active: 4, recovery: 10, dmg: 26, reach: 1.45, width: 1.0, hitstun: 20, push: 1.8, airPop: 6.4, hitstop: 7, air: true, yTol: 1.7, next: 'airLight3', cancel: 8, sfx: 'whoosh', spark: 'light', chain: true, meleeClash: 'light' },
  airLight3: { anim: 'airLight3', startup: 6, active: 4, recovery: 14, dmg: 40, reach: 1.55, width: 1.05, launch: [12, 4.5], hitstop: 11, air: true, yTol: 1.8, sfx: 'whooshHeavy', spark: 'heavy', big: true, shake: 0.4, wallBounce: true, chain: true, meleeClash: 'light' },
  airHeavy: { anim: 'airHeavy', startup: 9, active: 6, recovery: 16, dmg: 62, reach: 1.45, width: 1.15, launch: [3, -22], groundBounce: true, hardKnockdown: true, hitstop: 15, air: true, yTol: 2.4, landLag: 10, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.7, boxPad: [0.5, 0.45], meleeClash: 'heavy' },
  // forward air: the main front aerial, a light pop that keeps a juggle going
  fair: { anim: 'fair', startup: 6, active: 4, recovery: 14, dmg: 42, reach: 1.5, width: 1.0, hitstun: 22, push: 3, airPop: 6.5, feet: true, hitstop: 9, air: true, yTol: 1.8, landLag: 9, autoCancel: 20, sfx: 'whoosh', spark: 'heavy', meleeClash: 'light' },
  // back air: the strongest aerial, behind the attacker (the facing holds through a jump, so a jump away then ← is one)
  bair: { anim: 'bair', startup: 7, active: 3, recovery: 15, dmg: 56, reach: 1.5, width: 1.05, launch: [13, 6], wallBounce: true, back: true, hitstop: 12, air: true, yTol: 1.8, landLag: 11, autoCancel: 21, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.45, meleeClash: 'light' },
  // up air: hits above the head and pops them higher: the juggle tool
  uair: { anim: 'uair', startup: 5, active: 5, recovery: 12, dmg: 34, reach: 1.1, width: 1.0, launch: [0.4, 9.5], feet: true, hitstop: 8, air: true, yTol: 2.4, boxPad: [0.25, 0.5], landLag: 7, autoCancel: 18, sfx: 'whoosh', spark: 'heavy', meleeClash: 'light' },
  throw: { anim: 'throw', startup: 8, active: 3, recovery: 14, air: true, projectile: true, cost: 50 },
  // Killua's Rhythm Echo follow-up: the claw strike out of the afterimage teleport (and Whirlwind's counter); his
  // lightning bursts through them on the hit (`blastFx`) instead of the white smash spark (ENG-SKL-KIL)
  echoStrike: { anim: 'specialForward', startup: 3, active: 4, recovery: 18, dmg: 70, reach: 1.6, width: 1.1, launch: [15, 6], hitstop: 12, spark: 'smash', big: true, shake: 0.5, wallBounce: true, boxPad: [0.2, 0.3], sfx: 'whooshHeavy', blastFx: { fx: 'palmShock', scale: 0.7, smoke: 0, ring: 1 }, color: '#62d8ff' },
  vanishKick: { anim: 'light4', startup: 2, active: 5, recovery: 20, dmg: 75, reach: 1.7, width: 1.15, launch: [17, 6.5], hitstop: 16, spark: 'smash', big: true, shake: 0.8, wallBounce: true, yTol: 2.4, sfx: 'whooshHeavy' },
};

// Homing super dash contact hit
export const SUPER_DASH = { speed: 18, maxFrames: 42, dmg: 38, hitstun: 26, push: 3.2, airPop: 7, hitstop: 9, spark: 'heavy', big: true, shake: 0.3 };

// Vanish: teleport behind the opponent (1 ki bar), then vanishKick
export const VANISH = { cost: 100, hideFrames: 9 };

// Directional normals (ADR 0042, Fighter.normalFor): the stick when Light or Heavy is pressed picks the move. On the
// ground ← and → both give the forward move (a ground attack turns to face them); in the air the facing holds from
// the jump, so `forward` / `back` are along it. ↓ + Light in the air is the down air, the spike.
export const NORMALS = {
  ground: {
    light: { neutral: 'light1', forward: 'fTilt', up: 'uTilt', down: 'dTilt' },
    heavy: { neutral: 'heavy', forward: 'fSmash', up: 'uSmash', down: 'dSmash' },
  },
  air: {
    light: { neutral: 'airLight1', forward: 'fair', back: 'bair', up: 'uair', down: 'airHeavy' },
    heavy: { neutral: 'airHeavy', forward: 'airHeavy', back: 'airHeavy', up: 'airHeavy', down: 'airHeavy' },
  },
};

// Smash air (ADR 0042). Speeds in units/s, frames at 60 fps.
//  fullHop / shortHop  jump speed when Jump is still held as the jump squat ends / let go before (or pressed with an attack
//             within `chord` frames: the short hop with that aerial out at once)
//  doubleJump one more jump in the air, back on landing or when hit
//  fastFall   a fresh ↓ at or past the top of the jump (rising slower than `ffFrom`) drops at once at this speed
//  landLag    an aerial's landing lag unless the move says otherwise (MOVES landLag / autoCancel)
//  juggle     how close a reeling opponent in the air has to be for the DBFZ float (air attacks hover level with them and
//             keep turning to them); anywhere else the air is Smash's: the facing holds and attacks fall with the jump
export const AIR = { fullHop: 13.6, shortHop: 9.6, doubleJump: 12.6, chord: 2, fastFall: 15, ffFrom: 2.5, landLag: 8, juggle: 3.2 };

// Juggle rules (ADR 0026): read by Fighter.takeHit / physics / onLand and by the CPU combo composer (aiCombo.js), so the
// planner predicts links with the numbers the engine plays. Frames at 60 fps, speeds in units/s.
//  cap        hits after which a launched victim techs by itself
//  decay      hit stun and air stun scale: max(floor, 1 − per·(combo − 1))
//  launchStun air stun after a launching hit: max(min, base − per·combo) × decay
//  airStun    air stun after a juggle hit (no launch): max(min, base − per·combo) × decay
//  gravity    a launched victim's gravity scale: min(max, base + per·combo)
//  pop        a juggle hit's airPop × max(floor, 1 − per·combo)
//  scale      damage scaling: max(minScale ?? floor, 1 − per·(combo − 1))
//  wall       ring-barrier bounce: a launched victim faster than `minSpeed` toward it comes back at `keep` × its speed and
//             rises at least at `up`. Budget: at most `max` per combo (a wallBounce hit arms it only while bounces are
//             left), the n-th with air stun `stun[n - 1]` (flat, no decay; shorter each time), so the same-wall
//             "handball" is a real, limited route
//  ground     ground bounce: rises at `up`, keeps `keep` of the horizontal speed; `max` per combo, air stun `stun[n - 1]`
//  floor      a hard landing (impact > `impact`) bounces once at `keep` × the impact and `slide` of the horizontal speed
export const JUGGLE = {
  cap: 22,
  decay: { per: 0.045, floor: 0.35 },
  launchStun: { base: 40, per: 1.6, min: 6 },
  airStun: { base: 26, per: 1, min: 5 },
  gravity: { base: 0.6, per: 0.035, max: 1.35 },
  pop: { per: 0.03, floor: 0.5 },
  scale: { per: 0.065, floor: 0.4 },
  wall: { max: 3, minSpeed: 5, keep: 0.55, up: 7, stun: [32, 28, 22] },
  ground: { max: 2, up: 11, keep: 0.35, stun: [30, 24] },
  floor: { impact: 8, keep: 0.32, slide: 0.5 },
};

// Hit flash on the victim's sprite (ENG-064, src/game/hitFlash.js). Render only; frames at 60 fps, counted every
// sim frame including hitstop and freezes. Which tier a hit plays: ko > the move's `hitFlash` field (supers) > special
// (a big beam) > tick (hitstop <= 3, not big: multi-hits never re-pop) > counter (it interrupts the startup or active
// frames of the victim's own move) > rush (`special`: the 1-bar rush specials) > smash > heavy (`big` or a heavy
// spark) > light. Full white for longer than a smash is for counter hits, supers and KOs only.
//  pop    frames of pure white at contact (the snap); 'hs' = the whole hitstop, capped at popMax
//  lift   brighten held through the rest of hitstop; keeps the line art (0 none .. 1 near white)
//  rim    inner-edge glow (a bright outline) in rimColor (null = the attacker's color); fade: ease-out frames
//  shake  hitstop jitter of the sprite (world units);  blockShake: the same on a blocked hit
//  comboPop  from this combo count a normal hit pops 1 frame at most
//  style  'pop' (default) | 'tint' (no rim) | 'rim' (no pop below counter) | 'classic' (the old solid white) | 'off'
//         (?flash=<style>, lab Tools chips);  strength scales lift + rim
export const HIT_FLASH = {
  style: 'pop', strength: 1, rimPx: 2, comboPop: 6, blockShake: 0.04,
  light: { pop: 1, lift: 0.35, rim: 0.8, rimColor: 0xffffff, fade: 6, shake: 0.035 },
  heavy: { pop: 2, lift: 0.45, rim: 1, rimColor: 0xfff0c8, fade: 7, shake: 0.05 },
  smash: { pop: 3, lift: 0.5, rim: 1, rimColor: 0xffe08a, fade: 8, shake: 0.07 },
  counter: { pop: 'hs', popMax: 4, lift: 0.5, rim: 1, rimColor: 0xffa070, fade: 8, shake: 0.07 },
  special: { pop: 'hs', popMax: 5, lift: 0.55, rim: 1, rimColor: 0xffffff, fade: 10, shake: 0.09 },
  // 2 frames under the special hit's 0.3x slow-mo last about as long on screen as a smash's 3 under its 0.4x
  rush: { pop: 2, lift: 0.55, rim: 1, rimColor: 0xffffff, fade: 10, shake: 0.09 },
  ko: { pop: 'hs', popMax: 5, lift: 0.55, rim: 1, rimColor: 0xffffff, fade: 12, shake: 0.09 },
  tick: { pop: 0, lift: 0.3, rim: 0.7, rimColor: 0xffffff, fade: 5, shake: 0.03 },
  parry: { pop: 1, lift: 0.3, rim: 1, rimColor: 0x9ff0ff, fade: 8, shake: 0 },
  burn: { pop: 0, lift: 0.25, rim: 0.6, rimColor: null, fade: 6, shake: 0 },
  // Amaterasu catching (ENG-SKL-SAS): no white at all, a dark crimson rim as the black flames take them
  ignite: { pop: 0, lift: 0, rim: 1, rimColor: 0x5c1226, fade: 12, shake: 0.09 },
  tech: { pop: 1, lift: 0.4, rim: 1, rimColor: 0xc8f8ff, fade: 10, shake: 0 }, // a timed impact tech (ADR 0028)
};

// Defensive options (ADR 0014), all free. Frames at 60 fps.
//  parry      Guard pressed at most `window` frames before a blockable hit lands: no damage or block stun,
//             a melee attacker is staggered (`stagger`, `bigStagger` for big moves and specials), a
//             projectile is swatted away. One attempt per `lockout` frames, counted from every Guard press,
//             so mashing Guard only blocks; a parry re-arms at once, so a string can be parried hit by hit.
//  spotDodge  Guard + ↓ (pressed): intangible on frames [from, to), then recovery. Each dodge within
//             `staleWindow` frames of the last adds `stale` recovery frames (up to `staleMax` times).
//             `pose`/`poseFrame`: the dodge holds that strip's frame (the vanish strip's low crouch): the strip's
//             last frame is the vanish's standing toe-rise, and holding it made every crouched-idle fighter pop up
//             taller for the whole dodge. A fighter whose vanish crouch is still taller than its idle names its own
//             held pose as character data (`dodgePose: [animation, frame]`, Sasuke).
//  airDodge   Guard in the air, once per airtime. With a direction it bursts that way at `speed`, angled
//             down (`drop`; `lowDrop` when below `lowY`, so a dodge right after takeoff meets the floor).
//             Landing in a neutral dodge costs `land` frames.
//  wavedash   a directional air dodge that meets the floor slides along it (or Guard pressed with the jump):
//             friction per frame, actions from frame `act`, the slide's momentum carries into the next move.
// Throw (ADR 0015): Light + Heavy close up. It grabs a grounded opponent who is not in hit or block stun,
// airborne or invincible, so it beats a held Guard, parry attempts, counter stances and slow startups, and
// loses to anything already active, to a spot dodge and to jumping. The victim breaks it with Light + Heavy
// within `techWindow` frames of the grab. range/lane: screen and depth reach; whiff: recovery when it misses;
// hold: frames the victim is pinned before the toss; breakLag: recovery for both after a break.
export const THROW = {
  startup: 5, active: 3, whiff: 26, range: 1.05, lane: 0.6, hold: 18, techWindow: 12, breakLag: 10, recovery: 14, push: 7,
  hit: { dmg: 80, minScale: 0.8, launch: [12, 8.5], wallBounce: true, hardKnockdown: true, hitstop: 10, unblockable: true, big: true, spark: 'smash', shake: 0.6 },
};

// Combo escape (ADR 0022):
//  tech       launched (not KO, not held): any button, or Guard simply held, techs on the first open frame (air stun
//             over and above `minY`): `len` frames, invulnerable `invuln`. The stick picks the hop [along, up], `along`
//             toward the opponent on screen: neutral or away = `back`, toward = `toward`, ↑ = `up` (rise in place),
//             ↓ = `down` (fast fall). An open frame the victim lets pass is a gap: the combo turns blue.
//    roll     landing from a launch while holding Guard rolls back to the feet instead of lying down (not after a
//             `hardKnockdown` hit): `len` frames at `speed` (stick direction, else away), invulnerable `invuln`.
//  burst      Guard + Special in hit stun or a launch (not held or grabbed, not inside their 3-bar move or beam):
//             `cost` ki, `perRound` per round. A world freeze, then an invulnerable shockwave of `radius` on frames
//             [startup, startup + active) that launches the attacker (`hit`, blockable and parryable: burst bait),
//             then `whiff` frames of recovery (`blocked` when it was blocked or parried). `buffer`: Special or Guard
//             pressed this recently still counts (a press during hitstop survives it); Special itself must be
//             pressed during the combo and under `chord` frames ago (Guard pressed while a charge holds Special
//             is a tech, not a burst).
//  reversal   an attack started within `window` frames of leaving stun, block or wake-up that hits: REVERSAL
//  impactTech timed tech, Smash style (ADR 0028): a FRESH Guard press (an edge: holding Guard alone never does it) at
//             most `window` frames before a launched victim hits the floor (the first contact of a fall: a ground
//             bounce, a spike's or throw's hard knockdown, a plain landing) or the ring barrier on a wall bounce techs
//             the impact: the bounce never happens (no bounce budget used) and the combo ends. A press that doesn't
//             tech locks the timed tech out for `lockout` frames counted from it, so mashing fails. Frames are the
//             victim's live frames: a press during hitstop or a world freeze counts as made on the first frame after
//             it. Never on a KO, while held, or after a `noTech` hit (super finishes).
//    inPlace  floor, stick neutral: stand up on the spot, `len` frames, invulnerable `invuln`
//    roll     floor, stick left / right: roll that way at `speed` (`friction` per frame), `len`, invulnerable `invuln`
//    wall     barrier: cling `stick` frames, then kick off away from it at [along, up], free (falling) `len` frames
//             after the kick; invulnerable `invuln` from the impact
//    wallJump barrier with ↑ (or Jump) held at the kick: [along, up] higher, actionable at once; invulnerable `invuln`
//             from the impact
//  animPhases (ADR 0030, art only: no gameplay effect) the tech's dedicated pose (techGround / techRoll / wallTech) is
//             played on the state's own clock in three beats of sim frames [contact, main motion, settle] that sum to
//             the state's length, so any frame count of the art lands on the same moments: the contact beat ends as
//             the body leaves the impact, the main motion ends with the invulnerability (rolls, in place) or the kick
//             (wall: its first beat is `stick`). wallJump.animFrames: frames the push-off pose shows in the air before
//             jumpUp (the jump is actionable throughout; any action replaces the pose).
export const DEFENSE = {
  parry: { window: 6, lockout: 24, stagger: 16, bigStagger: 24, freeze: 7, ki: 12 },
  spotDodge: { len: 24, from: 2, to: 15, stale: 4, staleMax: 3, staleWindow: 150, pose: 'vanish', poseFrame: 0 },
  airDodge: { len: 30, from: 2, to: 18, speed: 12.5, drop: 6.5, lowDrop: 24, lowY: 0.95, land: 10 },
  wavedash: { len: 16, act: 5, friction: 0.875, speed: 12.5 },
  tech: {
    minY: 0.35, len: 10, invuln: 16, back: [-2.5, 6.5], toward: [3, 7], up: [0, 7.5], down: [0, -9],
    roll: { len: 20, invuln: 18, speed: 7.5, friction: 0.88, animPhases: [3, 15, 2] },
  },
  burst: {
    cost: 200, perRound: 1, buffer: 3, chord: 6, freeze: 8, startup: 4, active: 6, radius: 2.4, whiff: 20, blocked: 30,
    hit: { dmg: 10, minScale: 1, launch: [14, 9], hitstun: 14, push: 2, hitstop: 12, big: true, spark: 'smash', shake: 0.7, burst: true },
  },
  reversal: { window: 3 },
  impactTech: {
    window: 11, lockout: 40,
    inPlace: { len: 18, invuln: 14, animPhases: [4, 10, 4] },
    roll: { len: 22, invuln: 18, speed: 8, friction: 0.88, animPhases: [3, 15, 4] },
    wall: { stick: 6, along: 7, up: 6.5, len: 12, invuln: 22, animPhases: [6, 4, 8] },
    wallJump: { along: 5, up: 13, invuln: 14, animFrames: 4 },
  },
};

// Signature rush specials (1 ki bar). `cancelStartup`: the startup when it's cancelled out of a normal that hit
// (ADR 0015): fast enough to combo after light x3, while a raw one stays slow and punishable.
export const SPECIALS = {
  rasengan: {
    anim: 'special', startup: 24, cancelStartup: 14, active: 22, recovery: 20, dmg: 140, reach: 1.3, width: 1.05,
    launch: [16, 9], hitstop: 18, rush: 14, cost: 100, big: true, shake: 0.9, special: true, wallBounce: true,
    fx: 'rasengan', sfxLoop: 'rasengan', color: '#6ab4ff', name: 'RASENGAN', spark: 'smash', ground: 'spiral', clash: 'rush',
    blastFx: { fx: 'rasenganBurst', scale: 0.85 }, // the sphere grinds into them and blows out in a spiral (ENG-SKL-NAR)
  },
  chidori: {
    anim: 'special', startup: 28, cancelStartup: 16, active: 18, recovery: 20, dmg: 152, reach: 1.3, width: 1.05,
    launch: [14, 11], hitstop: 20, rush: 18, cost: 100, big: true, shake: 0.9, special: true, wallBounce: true,
    fx: 'chidori', sfxLoop: 'chidori', color: '#9ad8ff', name: 'CHIDORI', spark: 'smash', ground: 'lightning', clash: 'rush',
    // the anime's (ENG-SKL-SAS): the hand dragged along the floor through the run tears a trench (`trench`, a ground
    // style), contact jumps to the drawn stab (`hitPose`: that frame's place in the active phase) and the lightning
    // pierces through them (`blastFx`) instead of the generic white-out
    trench: 'lightningTrench', hitPose: 0.85, blastFx: { fx: 'chidoriBurst', scale: 0.95, smoke: 1 },
  },
};

// Air projectiles (half a ki bar)
//  clash   'beam': an energy shot. Meeting the opponent's energy head-on it becomes a stream in a BEAM CLASH
//          (CLASH.struggle, ADR 0027), drawn in its `stream` palette and shape (`style`: bolt, lance, flame, orb or the
//          ribbon; STREAM_STYLES in projectiles.js, ADR 0034); a physical shot (shuriken) just cancels.
//          Rush specials with `clash: 'rush'` (Rasengan, Chidori) are driven into the stream by hand.
export const PROJECTILES = {
  shuriken: { count: 3, spread: 0.2, speed: 22, radius: 0.35, dmg: 22, hitstun: 16, push: 2, airPop: 4, life: 1.2, sprite: 'shuriken', scale: 0.55, sfx: 'shuriken', spark: 'light' },
  // Sasuke's Great Fireball (ENG-SKL-SAS): the HD rolling sphere turned along its flight (`orient`) and its own fire blast
  fireball: { count: 1, spread: 0, speed: 12, radius: 0.85, dmg: 80, launch: [8, 7], life: 1.6, sprite: 'greatFireball', scale: 0.95, orient: true, sfx: 'fireball', big: true, spark: 'none', glowColor: 0xff7a20, trail: 'fire', burstFx: { fx: 'greatFireballBurst', scale: 0.95, sfx: 'explosion', shake: 0.5 }, ground: 'fire',
    clash: 'beam', stream: { core: '#ffe8b0', mid: '#ff7a20', edge: '#c8300c', style: 'flame' } },
  // Killua's Lightning Palm: a very fast lightning bolt with a long stun. His own forked bolt turned along its flight
  // (`orient`), the shock bursting through them on a hit (`burstFx`) and the paralysis crawling over their body while
  // the stun lasts (`cling`); no glow disc and no white spark (ENG-SKL-KIL)
  bolt: { count: 1, spread: 0, speed: 36, radius: 0.45, dmg: 58, hitstun: 38, push: 3, airPop: 7, life: 0.55, sprite: 'lightningPalm', scale: 0.9, orient: true, sfx: 'flash', spark: 'none', ground: 'lightning',
    burstFx: { fx: 'palmShock', scale: 0.85, smoke: 0, ring: 0.9, color: 0x62d8ff }, cling: { fx: 'shockCrawl', scale: 0.95 },
    clash: 'beam', stream: { core: '#e8f6ff', mid: '#6ab8ff', edge: '#2a5cff', style: 'bolt' } },
  // Killua's yo-yo (ENG-SKL-KIL): his steel yo-yo snapped out for `life` seconds, then reeled back to his hand at `reel`
  // units/s (`returns`; at once on a hit or on the floor), its string a thin `limb` from his drawn hand. Physical
  yoyo: { count: 1, spread: 0, speed: 24, radius: 0.4, dmg: 54, hitstun: 30, push: 2.5, airPop: 6.5, life: 0.2, sprite: 'yoyo', scale: 0.8, sfx: 'whoosh', spark: 'none',
    returns: true, reel: 30, limb: { fx: 'strand', tube: 1 / 32, thick: 0.02, color: 0xe8f0ff }, burstFx: { fx: 'palmShock', scale: 0.45, smoke: 0, ring: 0.8, sfx: 'hit', shake: 0.25, color: 0x62d8ff } },
  // Sasuke's Chidori Sharp Spear: a lightning lance that only reaches ~5 units, but instantly. Drawn as the blade
  // growing out of his hand (`lance`: the HD strip laid along the shot, f3-f5 held while it is out; ENG-SKL-SAS)
  spear: { count: 1, spread: 0, speed: 44, radius: 0.55, dmg: 72, hitstun: 34, push: 4, airPop: 8, life: 0.11, sprite: 'lightning', scale: 1.25, color: 0xe8f6ff, glowColor: 0x5a8cff, sfx: 'flash', spark: 'none', ground: 'lightning',
    lance: { fx: 'chidoriSpear', len: 4.9, seq: [0, 1, 2, 3, 4, 5, 3, 4, 5, 6, 7], ms: 35 }, burstFx: { fx: 'chidoriBurst', scale: 0.55, smoke: 0 },
    clash: 'beam', stream: { core: '#e4f2ff', mid: '#5a9cff', edge: '#3a2cdc', style: 'lance' } },
  // Gojo's Reversal: Red: a short-range repulsion blast that sends the victim into the wall
  red: { count: 1, spread: 0, speed: 21, radius: 0.95, dmg: 88, launch: [20, 7], wallBounce: true, life: 0.42, sprite: 'orb', scale: 1.25, color: 0xff4050, glowColor: 0xff2038, sfx: 'explosion', big: true, spark: 'smash', trail: 'red', burst: 'explosion', burstColor: 0xff3048, ground: 'repel',
    clash: 'beam', stream: { core: '#ffd8dc', mid: '#ff3048', edge: '#a00c22', style: 'orb' } },
  // Goku's ki blast volley: three quick blasts in a narrow fan. No beam clash: a volley of small blasts has no
  // stream to push (his Kamehameha and Dragon Fist are the energy moves that clash)
  kiBlast: { count: 3, spread: 0.14, speed: 24, radius: 0.4, dmg: 24, hitstun: 18, push: 2, airPop: 4, life: 0.9, sprite: 'orb', scale: 0.5, color: 0xd8f2ff, glowColor: 0x5ab0ff, sfx: 'flash', spark: 'light' },
  // Luffy's Gum-Gum Pistol: the stretched fist itself, very fast and short-lived (~6 u, like the Chidori Spear).
  // Physical, so it cancels shots but never beam-clashes; the drawn arm comes from the `special` strip
  pistol: { count: 1, spread: 0, speed: 42, radius: 0.5, dmg: 70, hitstun: 30, push: 6, airPop: 6, life: 0.15, sprite: 'orb', scale: 0.6, color: 0xf6c9a0, sfx: 'whooshHeavy', spark: 'heavy' },
};

// Special moves by id (ADR 0009). A fighter's kit maps input slots to these ids.
// kind: rush | shot | teleport | pull | dive | counter | mode (behaviour in src/game/kit.js)
export const SPECIAL_MOVES = {
  rasengan: { kind: 'rush', ...SPECIALS.rasengan },
  chidori: { kind: 'rush', ...SPECIALS.chidori },
  shurikenAir: { kind: 'shot', ...MOVES.throw, proj: 'shuriken' },
  fireballAir: { kind: 'shot', ...MOVES.throw, proj: 'fireball' },

  // ---- Naruto (early Shippuden, pre-Sage)
  // Rasenshuriken, handheld (he can't throw it yet): slower than the Rasengan, grinds the victim in a
  // wind vortex, and tears his own arm (selfDmg)
  rasenshuriken: {
    kind: 'rush', anim: 'specialForward', startup: 30, cancelStartup: 18, active: 20, recovery: 24, dmg: 40, reach: 1.35, width: 1.1,
    hitstun: 60, push: 0, hitstop: 12, rush: 13, cost: 100, special: true, big: true, shake: 0.6, selfDmg: 25,
    fx: 'rasenshuriken', sfxLoop: 'rasengan', color: '#cfeaff', name: 'RASENSHURIKEN', spark: 'smash', ground: 'wind', clash: 'rush',
    blastFx: { fx: null }, // its blast is the vortex's dome of wind blades (ENG-SKL-NAR)
    vortex: {
      len: 40, pull: 12, radius: 2.2, tick: 6, colors: { orb: 0xe8f6ff, glow: 0x8ac8ff, ring: 0xffffff }, ground: 'wind', dome: 'rasenshurikenDome',
      tickHit: { dmg: 12, minScale: 0.8, hitstun: 24, push: 0, airPop: 1, hitstop: 2, spark: 'light' },
      pop: { dmg: 76, minScale: 0.8, launch: [18, 9], wallBounce: true, hitstop: 14, big: true, spark: 'smash' },
    },
  },
  // Uzumaki Barrage: `clones` shadow clones poof out and kick up with him (U-ZU-MA-KI, anti-air), then his heel drop
  uzumakiBarrage: {
    kind: 'dive', anim: 'specialUp', cost: 100, rise: 13, riseV: 14, hang: 5, slamV: -34, area: 1.6, recovery: 16, clones: 3, riseCallout: 'U-ZU-MA-KI!', landFx: 'dust',
    name: 'UZUMAKI BARRAGE', color: '#ffb43a', ground: 'stone',
    riseHit: { dmg: 38, launch: [3, 11], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 96, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  uzumakiBarrageAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.6, recovery: 16, landFx: 'dust', name: 'UZUMAKI BARRAGE', color: '#ffb43a', ground: 'stone',
    hit: { dmg: 90, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  // Nine-Tails Chakra Cloak: tougher and stronger rather than faster (Godspeed is the speed mode). `cloak`: the Part 1
  // anime look (ENG-SKL-NAR): see-through red-orange chakra over his whole body (`fill`, `edge` near the outline) and a
  // boiling rim with fizzing specks around it (`rim`, `core`, `speck`, `width` in world units); an aura only, no tail
  // (the user, 2026-10-18)
  nineTails: {
    kind: 'mode', anim: 'specialDown', cost: 100, startup: 20, recovery: 8, len: 480, speed: 1.12, damage: 1.1, defense: 1.12,
    fx: 'chakra', auraColor: '#ff5a1a', auraCore: [1.0, 0.8, 0.5], name: 'NINE-TAILS CLOAK', color: '#ff6a2a',
    charge: { level: 1 }, // powering up in the cloak looks one bar further along (chargeFx.js)
    cloak: {
      fill: '#d8300e', edge: '#ff9a3a', opacity: 0.42, rim: '#ff5a14', core: '#ffb050', speck: '#ff3a10', rimOpacity: 0.75, width: 0.06,
      bubble: '#ff6a2a',
    },
  },
  // Substitution Jutsu: a log takes the hit (`log`: left behind in a puff); he reappears behind them with a kick
  substitution: {
    kind: 'counter', anim: 'guard', cost: 50, len: 18, recovery: 16, stagger: 30, onCounter: 'behind', hide: 6, follow: 'vanishKick', log: true,
    name: 'SUBSTITUTION', callout: 'SUBSTITUTION!', color: '#ffb43a',
  },

  // ---- Sasuke (Hebi era)
  chidoriSpear: { kind: 'shot', anim: 'specialForward', startup: 9, active: 3, recovery: 18, projectile: true, proj: 'spear', cost: 50, name: 'CHIDORI SPEAR', color: '#9ad8ff' },
  // Lion's Barrage: the rising kick, then (`shadow`, ENG-SKL-SAS, kit.js shadowTick) the Shadow of the Dancing Leaf: he
  // blinks behind them after `blink` frames as they rise `climb` units over `follow` frames (`behind` beyond them,
  // `below` under them), lands the `hits` (each its strip over `len` frames, the blow on frame `at`), flips `above`
  // them over `over` frames and drives them into the floor with the heel drop, `under` him
  lionsBarrage: {
    kind: 'dive', anim: 'specialUp', cost: 100, rise: 12, riseV: 14, hang: 4, slamV: -34, area: 1.6, recovery: 16, landFx: 'dust',
    name: "LION'S BARRAGE", color: '#9ad8ff', ground: 'stone',
    riseHit: { dmg: 40, launch: [2, 12], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 98, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
    shadow: {
      blink: 3, follow: 10, climb: 1.6, behind: 0.75, below: 0.2, above: 1.15, over: 7, under: 0.95, callout: "LION'S BARRAGE!",
      hits: [{ anim: 'airLight2', len: 8, at: 3, dmg: 10, spark: 'light' }, { anim: 'airLight1', len: 7, at: 2, dmg: 10, spark: 'light' }, { anim: 'airLight3', len: 9, at: 4, dmg: 12 }],
    },
  },
  lionsBarrageAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.6, recovery: 16, landFx: 'dust', name: "LION'S BARRAGE", color: '#9ad8ff', ground: 'stone',
    hit: { dmg: 92, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  // Sharingan: reads the attack and answers at once
  sharingan: {
    kind: 'counter', anim: 'specialDown', cost: 50, len: 20, recovery: 14, stagger: 22, onCounter: 'strike', follow: 'vanishKick',
    name: 'SHARINGAN', callout: 'SHARINGAN!', color: '#ff3040',
    sigil: true, eyeFlash: true, // the fighter's `eyes` pattern behind him and the red eyes in the HUD (ADR 0035)
    current: { fx: 'chidoriCurrent', scale: 1.35 }, // the read answered with Chidori Current (ENG-SKL-SAS)
  },

  // ---- Killua (Godspeed era; the anime's look: ENG-SKL-KIL, art/characters/killua/SKILLS_REVAMP.md)
  // Lightning Palm (雷掌, Ikazuchi): his lightning gathers in his open palm (`fx`, held there through the startup)
  narukami: { kind: 'shot', anim: 'special', startup: 10, active: 3, recovery: 16, projectile: true, proj: 'bolt', cost: 50, name: 'LIGHTNING PALM', color: '#bfe6ff', fx: 'palmCrackle' },
  // Yo-yo: in the air he snaps his steel yo-yo down at them and reels it back in
  yoyo: { kind: 'shot', anim: 'throw', startup: 8, active: 3, recovery: 14, air: true, projectile: true, proj: 'yoyo', cost: 50, name: 'YO-YO', color: '#bfe6ff' },
  // Rhythm Echo (肢曲): nothing where he leaves (`vanishFx: false`), his crackle where he lands (`appearFx`). While he
  // is hidden `afterimage.n` afterimages of him close in round the target, one every `every` frames, `ring` units out,
  // in his loose ready stance, and flicker on `linger` frames after the real one strikes from behind (clones.js)
  rhythmEcho: {
    kind: 'teleport', cost: 100, hide: 7, to: 'behind', off: 0.85, ghosts: 0, vanishFx: false, appearFx: 'palmCrackle', follow: 'echoStrike', name: 'RHYTHM ECHO', color: '#bfe6ff',
    afterimage: { n: 4, every: 2, ring: 1.3, anim: 'beamCharge', linger: 24, flash: 0.15, tint: '#bfe6ff' },
  },
  // Narukami (落雷, Thunderbolt): he leaps over them, gathers lightning in his hand at the top (`gather`) and dives inside
  // a bolt from the sky (`column`, `top` units high); it hits the floor as his lightning strike (`landFx`)
  thunderbolt: {
    kind: 'dive', cost: 100, rise: 14, riseV: 15, hang: 5, slamV: -34, area: 1.7, recovery: 16, name: 'NARUKAMI', color: '#bfe6ff', ground: 'lightning',
    gather: { fx: 'palmCrackle', scale: 0.55 }, column: { fx: 'narukamiBolt', scale: 0.7, top: 9 }, landFx: { fx: 'narukamiStrike', scale: 1.3, column: 0.9 },
    riseHit: { dmg: 34, launch: [3, 11], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 104, launch: [5, 13], groundBounce: true, hitstop: 14, big: true, shake: 0.8, spark: 'none' },
  },
  thunderboltAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.7, recovery: 16, name: 'NARUKAMI', color: '#bfe6ff', ground: 'lightning',
    gather: { fx: 'palmCrackle', scale: 0.55 }, column: { fx: 'narukamiBolt', scale: 0.7, top: 9 }, landFx: { fx: 'narukamiStrike', scale: 1.3, column: 0.9 },
    hit: { dmg: 98, launch: [5, 13], groundBounce: true, hitstop: 14, big: true, shake: 0.8, spark: 'none' },
  },
  // Godspeed (神速, Kanmuru): lightning bursts out of his whole body (`burstFx`, on his chest), then lives on it for the
  // whole mode (`aura`: the HD crackle on the body; `shell`: an electric outline), and every blink dash leaves a streak
  // (`blink`)
  godspeed: {
    kind: 'mode', anim: 'specialDown', cost: 100, startup: 18, recovery: 6, len: 480, speed: 1.35, damage: 1.12, blinkDash: true, fx: 'lightning', name: 'GODSPEED', color: '#bfe6ff', charge: { level: 1 },
    burstFx: { fx: 'godspeedBurst', scale: 1.2, center: true }, blink: 'godspeedStreak',
    aura: { fx: 'godspeedAura', scale: 1, front: 0.45, glow: 0.3 }, shell: { kind: 'electric', width: 0.035, dash: 0.4, speed: 15, opacity: 0.55, color: '#62d8ff', core: '#eafcff' },
  },

  // ---- Gojo
  blue: {
    kind: 'pull', anim: 'special', cost: 100, startup: 12, recovery: 23, dist: 2.6, radius: 3.5, len: 50, pull: 9, tick: 9, name: 'LAPSE: BLUE', color: '#4aa8ff', ground: 'implode',
    tickHit: { dmg: 8, hitstun: 24, push: 0, airPop: 1.2, hitstop: 2, spark: 'light' },
    pop: { dmg: 40, launch: [0, 13], hitstop: 10, big: true, spark: 'heavy' },
  },
  red: { kind: 'shot', anim: 'specialForward', startup: 14, active: 3, recovery: 22, projectile: true, proj: 'red', cost: 100, name: 'REVERSAL: RED', color: '#ff3a4a' },
  redAir: { kind: 'shot', anim: 'throw', startup: 10, active: 3, recovery: 16, air: true, projectile: true, proj: 'red', cost: 100, name: 'REVERSAL: RED', color: '#ff3a4a' },
  blink: { kind: 'teleport', anim: 'specialUp', startup: 6, recovery: 6, cost: 50, hide: 6, to: 'above', off: 0.9, height: 2.3, ghosts: 0, follow: null, name: 'BLINK', color: '#9fd8ff' },
  infinity: { kind: 'counter', anim: 'specialDown', cost: 50, len: 24, recovery: 14, stagger: 48, onCounter: 'freeze', name: 'INFINITY', callout: 'INFINITY!', color: '#d8f2ff' },

  // ---- Goku (Super Saiyan, Cell saga; ADR 0032)
  kiVolley: { kind: 'shot', anim: 'special', startup: 12, active: 3, recovery: 18, projectile: true, proj: 'kiBlast', cost: 50, name: 'KI BLAST VOLLEY', color: '#9fd8ff' },
  kiVolleyAir: { kind: 'shot', anim: 'throw', startup: 9, active: 3, recovery: 14, air: true, projectile: true, proj: 'kiBlast', cost: 50, name: 'KI BLAST VOLLEY', color: '#9fd8ff' },
  // Dragon Fist: a ki-wrapped dash punch (the user's pick, 2026-10-13, though the technique is from GT)
  dragonFist: {
    kind: 'rush', anim: 'specialForward', startup: 26, cancelStartup: 16, active: 20, recovery: 22, dmg: 150, reach: 1.35, width: 1.05,
    launch: [18, 10], hitstop: 20, rush: 16, cost: 100, big: true, shake: 1.0, special: true, wallBounce: true,
    fx: 'kiFist', color: '#ffd84a', name: 'DRAGON FIST', spark: 'smash', ground: 'ki', clash: 'rush',
  },
  // rising kick into a flip, then the axe-kick drop (dive)
  risingKick: {
    kind: 'dive', anim: 'specialUp', cost: 100, rise: 13, riseV: 15, hang: 4, slamV: -34, area: 1.6, recovery: 16, landFx: 'dust',
    name: 'RISING KICK', color: '#ffd84a', ground: 'stone',
    riseHit: { dmg: 38, launch: [3, 12], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 96, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  risingKickAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.6, recovery: 16, landFx: 'dust', name: 'RISING KICK', color: '#ffd84a', ground: 'stone',
    hit: { dmg: 92, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  // Instant Transmission: two fingers to the forehead (specialDown), gone, and a kick from behind
  instantTransmission: {
    kind: 'teleport', anim: 'specialDown', startup: 8, recovery: 4, cost: 100, hide: 6, to: 'behind', off: 0.85, ghosts: 0, follow: 'vanishKick',
    name: 'INSTANT TRANSMISSION', color: '#ffd84a',
  },

  // ---- Luffy (Enies Lobby arc, Gear Second / Gear Third; ADR 0032)
  gumPistol: { kind: 'shot', anim: 'special', startup: 11, active: 3, recovery: 20, projectile: true, proj: 'pistol', cost: 50, name: 'GUM-GUM PISTOL', color: '#e8402a' },
  gumPistolAir: { kind: 'shot', anim: 'throw', startup: 9, active: 3, recovery: 16, air: true, projectile: true, proj: 'pistol', cost: 50, name: 'GUM-GUM PISTOL', color: '#e8402a' },
  // both palms shoved forward: a short lunge that sends them into the wall. Physical: no beam clash
  gumBazooka: {
    kind: 'rush', anim: 'specialForward', startup: 22, cancelStartup: 14, active: 14, recovery: 24, dmg: 145, reach: 1.6, width: 1.15,
    launch: [22, 8], hitstop: 18, rush: 10, cost: 100, big: true, shake: 0.9, special: true, wallBounce: true,
    color: '#e8402a', name: 'GUM-GUM BAZOOKA', spark: 'smash', ground: 'stone',
  },
  // slingshot launch straight up, then he comes down on them
  gumRocket: {
    kind: 'dive', anim: 'specialUp', cost: 100, rise: 16, riseV: 17, hang: 4, slamV: -34, area: 1.7, recovery: 16, landFx: 'dust',
    name: 'GUM-GUM ROCKET', color: '#e8402a', ground: 'stone',
    riseHit: { dmg: 36, launch: [3, 12], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 100, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  gumRocketAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.7, recovery: 16, landFx: 'dust', name: 'GUM-GUM ROCKET', color: '#e8402a', ground: 'stone',
    hit: { dmg: 94, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  // a long low sweeping kick that trips them: barely moves him, but the leg stretches far
  gumWhip: {
    kind: 'rush', anim: 'specialDown', startup: 14, cancelStartup: 10, active: 8, recovery: 20, dmg: 90, reach: 2.3, width: 1.0,
    launch: [10, 5], hitstop: 12, rush: 3, cost: 50, special: true, color: '#e8402a', name: 'GUM-GUM WHIP', spark: 'heavy', ground: 'stone',
  },
  // Gear Second: he pumps his blood and steams; faster and a little stronger (ADR 0011 mode budget: 1.25 × 1.1 × 1.0)
  gearSecond: {
    kind: 'mode', anim: 'charge', cost: 100, startup: 20, recovery: 8, len: 420, speed: 1.25, damage: 1.1, defense: 1.0,
    fx: 'chakra', auraColor: '#ff9c9c', auraCore: [1.0, 0.86, 0.86], name: 'GEAR SECOND', color: '#ff7a7a', charge: { level: 1 },
  },
};

// Second supers on the SUPER button, and non-beam ultimates (kit.ultimate), 3 bars each.
// kind: flurry | domain | ignite | skyStrike | orb | rampage | reflex | laneStrike (src/game/kit.js). `range` = the CPU only fires
// it this close. pose = the animation during the super flash (default superPose); strikePose = the release.
export const SUPERS = {
  // Speed of Lightning (電光石火, Killua): `zigzag` plays the anime inside the plain flurry's frames (ENG-SKL-KIL). Godspeed
  // is on him (`aura`, `shell`); the dash and every blink between blows leave a lightning streak (`streak`); each blow is one of
  // `attacks` (his own normals, `pose` for the last) with the shock bursting through them (`shock`); then he is over
  // them, the bolt from the sky comes down through him (`column`) and Narukami hits the floor under them (`strike`)
  speedOfLightning: {
    kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 8, every: 7, hitDmg: 22, finalDmg: 130, minScale: 0.8, hitFx: 'lightning', finalFx: 'thunder', name: 'GODSPEED: SPEED OF LIGHTNING', color: '#bfe6ff', ground: 'lightning',
    aura: SPECIAL_MOVES.godspeed.aura, shell: SPECIAL_MOVES.godspeed.shell,
    zigzag: {
      attacks: ['light1', 'fair', 'light3', 'bair', 'heavy', 'light2', 'uair', 'light4'], streak: 'godspeedStreak', shock: { fx: 'palmShock', scale: 0.6, smoke: 0, ring: 0.8 },
      pose: ['airHeavy', 1, 0.5], gather: { fx: 'palmCrackle', scale: 0.6 }, column: { fx: 'narukamiBolt', scale: 0.9, top: 9 }, strike: { fx: 'narukamiStrike', scale: 1.5 },
    },
  },
  // Shadow Clone Barrage (Naruto, ENG-SKL-NAR): `crew` turns the flurry into the anime's. His dash and first blow (the
  // plain flurry's catch), then he holds the `seal` while `hits` clones come one at a time, every `every` frames: each
  // poofs in on its own side `ring` units from the target, plays one of `attacks` through over `life` frames (hit on
  // frame `hitAt`) and poofs out. Then `kicks` clones kick it `rise` units up one at a time with the `callout`s, and he
  // drops on it from above with a big Rasengan over `drop` frames (the user, 2026-10-18: "summoned 1 by 1 really
  // quick with the poof smoke effect and have each clone rapidly attack with different attacks").
  shadowCloneBarrage: {
    kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 8, every: 5, hitDmg: 13, finalDmg: 120, minScale: 0.8, name: 'SHADOW CLONE BARRAGE', color: '#ffb43a', ground: 'spiralBig',
    crew: {
      ring: 0.85, life: 12, hitAt: 4, seal: 'superPose',
      attacks: ['light2', 'airLight2', 'heavy', 'light3', 'airHeavy', 'light4', 'heavyAlt', 'light1Alt'],
      kicks: 4, kickEvery: 6, kickDmg: 12, rise: 2.2, drop: 10, callout: ['U', 'ZU', 'MA', 'KI'], dropFx: 'rasengan', dropScale: 0.85, burstFx: 'rasenganBurst',
    },
  },
  unlimitedVoid: { kind: 'domain', cost: 300, flash: 50, len: 150, name: 'DOMAIN EXPANSION: UNLIMITED VOID', color: '#9fd8ff' },
  // Kirin (Sasuke): `storm` plays the anime's sequence inside the sky strike's frames (ENG-SKL-SAS, kit.js stormTick):
  // the Great Fireball breathed up (it takes `heat` frames to reach the sky), `clouds` thunderclouds `spread` apart
  // gathering `height` units over the spot from `cloudAt` over `gather` frames while the stage dims to `dim` (and the
  // camera tips up by `lift`), his arm
  // swung down `swing` frames before the strike (strikePose) and the dragon diving the last `dive` frames (its head
  // landing at `headLand`), its body lingering `linger` frames after
  kirin: {
    kind: 'skyStrike', cost: 300, flash: 40, delay: 40, radius: 2.0, dmg: 280, launch: [6, 16], recovery: 24, pose: 'beamCharge', strikePose: 'beamFire', name: 'KIRIN', color: '#9fd8ff', ground: 'lightningBig',
    storm: { heat: 14, cloudAt: 4, gather: 18, height: 3.7, clouds: 5, spread: 1.9, cloudScale: 1.75, dim: 0.6, lift: 1, swing: 9, dive: 6, headLand: 1.25, headScale: 1.15, bodyScale: 1.0, linger: 8, strikeFx: 'kirinStrike', strikeScale: 1.5 },
  },
  // Amaterasu (Sasuke): the black flames burst on them (`blastFx`) with no white flash (`hitFlash`), and while they burn
  // the blaze clings to their body (`burn.fx`, kit.tickBurn) in black and dark crimson (ENG-SKL-SAS)
  amaterasu: {
    kind: 'ignite', cost: 300, flash: 46, delay: 10, recovery: 26, dmg: 80, launch: [4, 9], burn: { len: 200, every: 20, dmg: 14, fx: 'amaterasu' }, name: 'AMATERASU', callout: 'AMATERASU', color: '#d01c3a', ground: 'blackFire', sigil: 'mangekyo',
    blastFx: { fx: 'amaterasuIgnite', scale: 1.1, smoke: 0 }, hitFlash: 'ignite',
  },

  // ---- ultimates with their own shape (ADR 0017): one beam in the cast at most, every other finisher different
  // Hollow Purple (Gojo): Red from the near hand and Blue from the far hand meet in front of him (`merge` frames) and
  // the imaginary mass rolls forward, erasing every projectile in its path. Huge and slow-ish: you leave its lane or
  // vanish, you can't block it. One hit (`dmg`, unscaled), then it keeps going and carves a trench. Fired into the
  // opponent's running ultimate it merges in `answerMerge` frames instead, so the two meet (a rhythm clash).
  hollowPurple: {
    kind: 'orb', cost: 300, flash: 46, merge: 26, answerMerge: 8, recovery: 24, speed: 15, radius: 1.45, life: 2.4, dmg: 260, launch: [18, 12],
    pose: 'beamCharge', strikePose: 'beamFire', red: 0xff3048, blue: 0x4aa8ff, orb: 0xa24cff, glow: 0x7a2cff,
    name: 'HOLLOW TECHNIQUE: PURPLE', color: '#b46cff', ground: 'erasure',
  },
  // Whirlwind (Killua): Godspeed's reflex mode. For `len` frames his body answers every blockable attack on its own:
  // a lightning blink behind the attacker (projectiles too) and the `follow` strike, up to `counters` times. Supers,
  // ultimates and throws go straight through it, and the opponent can simply wait it out.
  whirlwind: {
    kind: 'reflex', cost: 300, flash: 40, recovery: 12, len: 300, counters: 4, hide: 4, follow: 'echoStrike',
    pose: 'beamCharge', name: 'GODSPEED: WHIRLWIND', callout: 'WHIRLWIND!', color: '#bfe6ff',
    // the look (ENG-SKL-KIL): Godspeed bursts on (`burstFx`) and stays on his body (`aura`, `shell`) while it runs; each
    // counter leaves an electrified afterimage where he stood (`echo`, its color) and a lightning streak to behind them
    burstFx: { fx: 'godspeedBurst', scale: 1.4 }, aura: { ...SPECIAL_MOVES.godspeed.aura, front: 0.6 }, shell: SPECIAL_MOVES.godspeed.shell, streak: 'godspeedStreak', echo: 0x9fe8ff,
  },

  // ---- Goku and Luffy (ADR 0032)
  // Kaio-ken (Goku): the red aura flares and he rushes them; same budget as the other flurries
  kaiokenRush: {
    kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 8, every: 7, hitDmg: 22, finalDmg: 130, minScale: 0.8,
    hitFx: 'chakra', hitColor: 0xff3020, finalFx: 'impact', finalColor: 0xff4030, name: 'KAIO-KEN RUSH', color: '#ff3a2a', ground: 'ki',
  },
  // Jet Gatling (Luffy, Gear Second): a blur of fists from in front (`front`), then one last straight punch that sends
  // them into the wall instead of a slam from above
  jetGatling: {
    kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 9, every: 6, hitDmg: 20, finalDmg: 125, minScale: 0.8, front: true,
    finalLaunch: [20, 9], hitFx: 'ring', hitColor: 0xffd8d8, finalFx: 'impact', finalColor: 0xff7a7a, name: 'GEAR SECOND: JET GATLING', color: '#ff7a7a', ground: 'stone',
  },
  // Gigant Pistol (Luffy, Gear Third): he blows his arm up to giant size (`windup`, on beamCharge), then the giant fist
  // shoots down his lane to `reach` in `extend` frames (beamFire). One unblockable hit; you dodge it by leaving the
  // lane or jumping over it during the long windup. No clash: a fist has nothing to push against (ADR 0032).
  gigantPistol: {
    kind: 'laneStrike', cost: 300, flash: 44, windup: 34, extend: 8, reach: 7, width: 1.1, height: 2.0, dmg: 270, launch: [22, 9], recovery: 30,
    pose: 'beamCharge', strikePose: 'beamFire', fist: { color: 0xf6c9a0, scale: 2.4 }, name: 'GEAR THIRD: GIGANT PISTOL', color: '#e8402a', ground: 'stone',
  },
};

// Passive abilities (kit.passive). Infinity stops projectiles but each stop costs Gojo ki.
export const PASSIVES = {
  infinity: { kiCost: 15 },
};

// Ultimate clashes (ADR 0017): a rhythm duel on one shared note chart (src/game/clash.js). Frames at 60 fps.
//  intro      CLASH! and a count-in before the first note;  lead: frames an approach ring shows before its note
//  windows    |press - note| in frames per grade (perfect ±3 ≈ 50 ms); points per grade, stray = a press with no note
//  phases     notes and the gap between them per phase, faster each time; doubles = notes that come as two taps
//  hold       the FINAL PUSH: `gap` after the last phase, held for `len`
//  push       struggle point per point of score lead (0.5 = even);  drawMargin: a final lead under this is a draw
//             (a blowout ends early: the trailing player can't make up the lead before the FINAL PUSH)
//  winDmg / drawDmg  what the clash is worth (the winner's ultimate lands; a draw blows both back)
//  answerFlash  an ultimate fired while the opponent's is running starts with this short a flash (its windup is
//             shorter too: counterWindup, answerMerge, answerRoar), so the two can meet
//  rush       a pounce in a clash: the struggle point sits `reach` ahead of the rusher, who can be shoved `shove` back
//  special    the one-beat clash between two rush specials: its note (`lead` after `intro`), the cooldown between
//             special clashes, and the hit the loser takes (a tie keeps the old double hit)
//  launch     the loser's launch when an ultimate clash is won
//  struggle   BEAM CLASH (ADR 0027): two energy attacks meeting (PROJECTILES `clash`, rush specials driven into a
//             shot) lock both owners in a shorter rhythm duel with its own numbers (they override the ones above).
//             A 4.5 s chart, a lead of `drawMargin` wins; the winner's stream runs through for `winDmg` and a
//             wall-bounce `launch`, a draw blows both back for `drawDmg`. `cooldown`: frames before the next one;
//             `minDist`: owners closer than this just trade; `catch`: extra contact radius for a shot still in its
//             startup; `answerRange`: an energy move started while their energy heads at you this close meets it at
//             once (the answer); `width`: the stream's width (the ultimate beam is ULTIMATE.width); `sparks`: the
//             struggle point's flare, x the ultimate clash's (two short streams would vanish under the full one);
//             `rushReach`: how far ahead of a Rasengan / Chidori a shot meets it (detection); once locked it sits at
//             `handReach` + `orbReach` (ADR 0034);
//             `craters`: the ground-damage force (ground.js) under the loser / between them on a draw (an ultimate
//             clash uses GROUND.fixed clashWin / clashDraw)
export const CLASH = {
  intro: 40, lead: 40, outro: 24,
  windows: { perfect: 3, great: 6, good: 9 },
  points: { perfect: 3, great: 2, good: 1, miss: 0, stray: -1 },
  phases: [{ notes: 4, every: 30 }, { notes: 7, every: 20, doubles: 2 }, { notes: 6, every: 15, doubles: 1 }],
  doubleGap: 8, hold: { gap: 30, len: 40 },
  push: 0.018, drawMargin: 2, winDmg: 250, drawDmg: 90, answerFlash: 20,
  rush: { reach: 0.8, shove: 2.2 },
  special: { intro: 12, lead: 34, cooldown: 480, dmg: 60 },
  launch: [18, 10],
  struggle: {
    intro: 30, lead: 36, phases: [{ notes: 4, every: 24 }, { notes: 5, every: 18, doubles: 1 }], hold: { gap: 24, len: 30 }, outro: 24,
    push: 0.045, drawMargin: 1, winDmg: 120, drawDmg: 45, launch: [16, 9], cooldown: 900, minDist: 2.2, catch: 0.4, answerRange: 5.5, width: 0.95,
    sparks: 0.45, rushReach: 1.5, craters: [0.9, 1.0],
    // once locked, a rush meets the stream at its held technique's front (ADR 0034): the drawn hand (else these
    // fixed offsets: a Rasengan-type orb, a Chidori held forward) plus the orb's radius
    handReach: [0.6, 0.7], orbReach: 0.55,
    // a stream from the air (ADR 0034): an owner higher than `airMin` eases down to `airHover` over `airEase` frames. Against
    // a grounded rush the rusher stays planted and holds the technique up the stream line, `airTech` = [technique centre,
    // struggle point] ahead of the hand; the side losing ground is shoved `airPush` along the floor (the rusher) or back
    // and `airLift` up (the air owner)
    airMin: 0.3, airHover: 1.1, airEase: 24, airTech: [0.4, 0.82], airPush: 1.4, airLift: 0.5,
  },
};

// MELEE CLASH (ADR 0038): a light meeting a light (or a heavy a heavy) while both swings are live cancels both: no
// damage, both hold their strikes together for a moment, then get pushed back a step and can act, so pressing again
// starts the next one. Clashes within `chainGap` frames of the last one form a chain that grows the sparks and the
// camera push-in and pays both fighters ki; the `finale`-th pushes both far back (CLASH BREAK!). A light meeting a
// heavy loses: the heavy lands at once.
//  window     frames before its first active frame the other swing still counts as live (both pressed a few frames apart)
//  stop       frames the strikes stay pressed together (hit stop) per class
//  look       while they do: `dim` darkens the stage and `lines` sets the speed lines on the contact; the camera push-in
//             holds `hold` seconds
//  cam        how far the camera pushes in on the contact (0-1), + camPer per chain step, at most camMax
//  push       the pushback (units/s) once the strikes part; act: frames of it before they can act (a swing pressed
//             during the freeze comes out then); slide: frames of it before they stand (cancellable from act)
//  breakPush  the finale's pushback instead: its hit stop, speed, act and slide (no damage, no knockdown)
//  buffer     extra frames a Light or Heavy pressed during the freeze is kept for (it comes out on the first free frame)
//  ki         ki for each fighter per clash by class, x (1 + kiPer * (n - 1)) in a chain
//  seekRange  screen distance the CPU tries a clash from; chainSeek: its rate multiplier for pressing again out of a
//             slide (the per-level rates are `meleeClash` in ai.js / aiMaster.js)
export const MELEE_CLASH = {
  window: 4, chainGap: 80, finale: 5,
  stop: { light: 12, heavy: 14 },
  look: { dim: 0.3, lines: 0.5, hold: 0.25 },
  cam: 0.6, camPer: 0.08, camMax: 0.9,
  push: { light: 6.5, heavy: 7.5 }, act: 3, slide: 10, buffer: 8,
  ki: { light: 10, heavy: 18 }, kiPer: 0.25,
  breakPush: { stop: 18, speed: 13, act: 12, slide: 18 },
  seekRange: 2.6, chainSeek: 1.1,
};

// Ultimate beam (full 3 bars)
export const ULTIMATE = {
  cost: 300, windup: 46, counterWindup: 14, duration: 84, speed: 34, maxLen: 26, width: 1.25,
  tickEvery: 5, tickDmg: 12, finalDmg: 130, launch: [17, 10], flash: 42,
  // extra frozen frames on every ultimate's flash (beam or kit) for the full-screen splash (ADR 0035); the world
  // is paused, so no frame data moves
  splashHold: 24,
};
