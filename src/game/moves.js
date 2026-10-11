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
//  ground     the floor damage style a special, shot or super leaves (GROUND_STYLES in ground.js, ADR 0024)
export const MOVES = {
  light1: { anim: 'light1', startup: 5, active: 3, recovery: 11, dmg: 28, reach: 1.3, width: 0.95, hitstun: 22, push: 2.2, airPop: 5.5, hitstop: 7, lunge: 4.5, next: 'light2', cancel: 7, sfx: 'whoosh', spark: 'light', light: true },
  light2: { anim: 'light2', startup: 5, active: 3, recovery: 12, dmg: 30, reach: 1.35, width: 0.95, hitstun: 22, push: 2.4, airPop: 5.5, hitstop: 7, lunge: 4.5, next: 'light3', cancel: 7, sfx: 'whoosh', spark: 'light', light: true },
  light3: { anim: 'light3', startup: 6, active: 4, recovery: 14, dmg: 36, reach: 1.55, width: 1.0, hitstun: 24, push: 2.8, airPop: 6, hitstop: 8, lunge: 5, next: 'light4', cancel: 9, sfx: 'whoosh', spark: 'light', light: true, low: true },
  light4: { anim: 'light4', startup: 9, active: 4, recovery: 22, dmg: 58, reach: 1.65, width: 1.05, launch: [14, 6], hitstop: 13, lunge: 6, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.5, wallBounce: true },
  heavy: { anim: 'heavy', startup: 12, active: 5, recovery: 22, dmg: 64, reach: 1.4, width: 1.05, launch: [2.4, 15.5], hitstop: 12, lunge: 5.5, hop: 5, sfx: 'whooshHeavy', spark: 'heavy', big: true, shake: 0.45, launcher: true, yTol: 1.7, boxPad: [0.14, 0.3] },
  airLight1: { anim: 'airLight1', startup: 4, active: 4, recovery: 9, dmg: 24, reach: 1.4, width: 1.0, hitstun: 20, push: 1.6, airPop: 6.2, hitstop: 7, air: true, yTol: 1.7, next: 'airLight2', cancel: 7, sfx: 'whoosh', spark: 'light' },
  airLight2: { anim: 'airLight2', startup: 4, active: 4, recovery: 10, dmg: 26, reach: 1.45, width: 1.0, hitstun: 20, push: 1.8, airPop: 6.4, hitstop: 7, air: true, yTol: 1.7, next: 'airLight3', cancel: 8, sfx: 'whoosh', spark: 'light' },
  airLight3: { anim: 'airLight3', startup: 6, active: 4, recovery: 14, dmg: 40, reach: 1.55, width: 1.05, launch: [12, 4.5], hitstop: 11, air: true, yTol: 1.8, sfx: 'whooshHeavy', spark: 'heavy', big: true, shake: 0.4, wallBounce: true },
  airHeavy: { anim: 'airHeavy', startup: 9, active: 6, recovery: 16, dmg: 62, reach: 1.45, width: 1.15, launch: [3, -22], groundBounce: true, hardKnockdown: true, hitstop: 15, air: true, yTol: 2.4, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.7, boxPad: [0.5, 0.45] },
  throw: { anim: 'throw', startup: 8, active: 3, recovery: 14, air: true, projectile: true, cost: 50 },
  // Killua's Rhythm Echo follow-up: the claw strike out of the afterimage teleport
  echoStrike: { anim: 'specialForward', startup: 3, active: 4, recovery: 18, dmg: 70, reach: 1.6, width: 1.1, launch: [15, 6], hitstop: 12, spark: 'smash', big: true, shake: 0.5, wallBounce: true, boxPad: [0.2, 0.3], sfx: 'whooshHeavy' },
  vanishKick: { anim: 'light4', startup: 2, active: 5, recovery: 20, dmg: 75, reach: 1.7, width: 1.15, launch: [17, 6.5], hitstop: 16, spark: 'smash', big: true, shake: 0.8, wallBounce: true, yTol: 2.4, sfx: 'whooshHeavy' },
};

// Homing super dash contact hit
export const SUPER_DASH = { speed: 18, maxFrames: 42, dmg: 38, hitstun: 26, push: 3.2, airPop: 7, hitstop: 9, spark: 'heavy', big: true, shake: 0.3 };

// Vanish: teleport behind the opponent (1 ki bar), then vanishKick
export const VANISH = { cost: 100, hideFrames: 9 };

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
};

// Defensive options (ADR 0014), all free. Frames at 60 fps.
//  parry      Guard pressed at most `window` frames before a blockable hit lands: no damage or block stun,
//             a melee attacker is staggered (`stagger`, `bigStagger` for big moves and specials), a
//             projectile is swatted away. One attempt per `lockout` frames, counted from every Guard press,
//             so mashing Guard only blocks; a parry re-arms at once, so a string can be parried hit by hit.
//  spotDodge  Guard + ↓ (pressed): intangible on frames [from, to), then recovery. Each dodge within
//             `staleWindow` frames of the last adds `stale` recovery frames (up to `staleMax` times).
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
export const DEFENSE = {
  parry: { window: 6, lockout: 24, stagger: 16, bigStagger: 24, freeze: 7, ki: 12 },
  spotDodge: { len: 24, from: 2, to: 15, stale: 4, staleMax: 3, staleWindow: 150 },
  airDodge: { len: 30, from: 2, to: 18, speed: 12.5, drop: 6.5, lowDrop: 24, lowY: 0.95, land: 10 },
  wavedash: { len: 16, act: 5, friction: 0.875, speed: 12.5 },
  tech: {
    minY: 0.35, len: 10, invuln: 16, back: [-2.5, 6.5], toward: [3, 7], up: [0, 7.5], down: [0, -9],
    roll: { len: 20, invuln: 18, speed: 7.5, friction: 0.88 },
  },
  burst: {
    cost: 200, perRound: 1, buffer: 3, chord: 6, freeze: 8, startup: 4, active: 6, radius: 2.4, whiff: 20, blocked: 30,
    hit: { dmg: 10, minScale: 1, launch: [14, 9], hitstun: 14, push: 2, hitstop: 12, big: true, spark: 'smash', shake: 0.7, burst: true },
  },
  reversal: { window: 3 },
};

// Signature rush specials (1 ki bar). `cancelStartup`: the startup when it's cancelled out of a normal that hit
// (ADR 0015): fast enough to combo after light x3, while a raw one stays slow and punishable.
export const SPECIALS = {
  rasengan: {
    anim: 'special', startup: 24, cancelStartup: 14, active: 22, recovery: 20, dmg: 140, reach: 1.3, width: 1.05,
    launch: [16, 9], hitstop: 18, rush: 14, cost: 100, big: true, shake: 0.9, special: true, wallBounce: true,
    fx: 'rasengan', sfxLoop: 'rasengan', color: '#6ab4ff', name: 'RASENGAN', spark: 'smash', ground: 'spiral',
  },
  chidori: {
    anim: 'special', startup: 28, cancelStartup: 16, active: 18, recovery: 20, dmg: 152, reach: 1.3, width: 1.05,
    launch: [14, 11], hitstop: 20, rush: 18, cost: 100, big: true, shake: 0.9, special: true, wallBounce: true,
    fx: 'chidori', sfxLoop: 'chidori', color: '#9ad8ff', name: 'CHIDORI', spark: 'smash', ground: 'lightning',
  },
};

// Air projectiles (half a ki bar)
export const PROJECTILES = {
  shuriken: { count: 3, spread: 0.2, speed: 22, radius: 0.35, dmg: 22, hitstun: 16, push: 2, airPop: 4, life: 1.2, sprite: 'shuriken', scale: 0.55, sfx: 'shuriken', spark: 'light' },
  fireball: { count: 1, spread: 0, speed: 12, radius: 0.85, dmg: 80, launch: [8, 7], life: 1.6, sprite: 'fire', scale: 1.5, sfx: 'fireball', big: true, spark: 'heavy', glowColor: 0xff7a20, trail: 'fire', burst: 'explosion', ground: 'fire' },
  // Killua's Narukami: a very fast lightning bolt with a long stun
  bolt: { count: 1, spread: 0, speed: 36, radius: 0.45, dmg: 58, hitstun: 38, push: 3, airPop: 7, life: 0.55, sprite: 'lightning', scale: 0.95, color: 0xd8f0ff, glowColor: 0x6ab8ff, sfx: 'flash', spark: 'heavy', trail: 'bolt', random: true, ground: 'lightning' },
  // Sasuke's Chidori Sharp Spear: a lightning lance that only reaches ~6 units, but instantly
  spear: { count: 1, spread: 0, speed: 44, radius: 0.55, dmg: 72, hitstun: 34, push: 4, airPop: 8, life: 0.11, sprite: 'lightning', scale: 1.25, color: 0xe8f6ff, glowColor: 0x5a8cff, sfx: 'flash', spark: 'heavy', trail: 'bolt', random: true, ground: 'lightning' },
  // Gojo's Reversal: Red: a short-range repulsion blast that sends the victim into the wall
  red: { count: 1, spread: 0, speed: 21, radius: 0.95, dmg: 88, launch: [20, 7], wallBounce: true, life: 0.42, sprite: 'orb', scale: 1.25, color: 0xff4050, glowColor: 0xff2038, sfx: 'explosion', big: true, spark: 'smash', trail: 'red', burst: 'explosion', burstColor: 0xff3048, ground: 'repel' },
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
    fx: 'rasenshuriken', sfxLoop: 'rasengan', color: '#cfeaff', name: 'RASENSHURIKEN', spark: 'smash', ground: 'wind',
    vortex: {
      len: 40, pull: 12, radius: 2.2, tick: 6, colors: { orb: 0xe8f6ff, glow: 0x8ac8ff, ring: 0xffffff }, ground: 'wind',
      tickHit: { dmg: 12, minScale: 0.8, hitstun: 24, push: 0, airPop: 1, hitstop: 2, spark: 'light' },
      pop: { dmg: 76, minScale: 0.8, launch: [18, 9], wallBounce: true, hitstop: 14, big: true, spark: 'smash' },
    },
  },
  // Uzumaki Barrage: clones kick him up (anti-air), then a heel drop
  uzumakiBarrage: {
    kind: 'dive', anim: 'specialUp', cost: 100, rise: 13, riseV: 14, hang: 5, slamV: -34, area: 1.6, recovery: 16, riseFx: 'clones', landFx: 'dust',
    name: 'UZUMAKI BARRAGE', color: '#ffb43a', ground: 'stone',
    riseHit: { dmg: 38, launch: [3, 11], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 96, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  uzumakiBarrageAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.6, recovery: 16, riseFx: 'clones', landFx: 'dust', name: 'UZUMAKI BARRAGE', color: '#ffb43a', ground: 'stone',
    hit: { dmg: 90, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  // Nine-Tails Chakra Cloak: tougher and stronger rather than faster (Godspeed is the speed mode)
  nineTails: {
    kind: 'mode', anim: 'specialDown', cost: 100, startup: 20, recovery: 8, len: 480, speed: 1.12, damage: 1.1, defense: 1.12,
    fx: 'chakra', auraColor: '#ff5a1a', auraCore: [1.0, 0.8, 0.5], name: 'NINE-TAILS CLOAK', color: '#ff6a2a',
    charge: { level: 1 }, // powering up in the cloak looks one bar further along (chargeFx.js)
  },
  // Substitution Jutsu: a log takes the hit; he reappears behind them with a kick
  substitution: {
    kind: 'counter', anim: 'guard', cost: 50, len: 18, recovery: 16, stagger: 30, onCounter: 'behind', hide: 6, follow: 'vanishKick',
    name: 'SUBSTITUTION', callout: 'SUBSTITUTION!', color: '#ffb43a',
  },

  // ---- Sasuke (Hebi era)
  chidoriSpear: { kind: 'shot', anim: 'specialForward', startup: 9, active: 3, recovery: 18, projectile: true, proj: 'spear', cost: 50, name: 'CHIDORI SPEAR', color: '#9ad8ff' },
  lionsBarrage: {
    kind: 'dive', anim: 'specialUp', cost: 100, rise: 12, riseV: 14, hang: 4, slamV: -34, area: 1.6, recovery: 16, landFx: 'dust',
    name: "LION'S BARRAGE", color: '#9ad8ff', ground: 'stone',
    riseHit: { dmg: 40, launch: [2, 12], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 98, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  lionsBarrageAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.6, recovery: 16, landFx: 'dust', name: "LION'S BARRAGE", color: '#9ad8ff', ground: 'stone',
    hit: { dmg: 92, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  // Sharingan: reads the attack and answers at once
  sharingan: {
    kind: 'counter', anim: 'specialDown', cost: 50, len: 20, recovery: 14, stagger: 22, onCounter: 'strike', follow: 'vanishKick',
    name: 'SHARINGAN', callout: 'SHARINGAN!', color: '#ff3040',
  },

  // ---- Killua (Godspeed era)
  narukami: { kind: 'shot', anim: 'special', startup: 10, active: 3, recovery: 16, projectile: true, proj: 'bolt', cost: 50, name: 'NARUKAMI', color: '#bfe6ff' },
  narukamiAir: { kind: 'shot', anim: 'throw', startup: 8, active: 3, recovery: 14, air: true, projectile: true, proj: 'bolt', cost: 50, name: 'NARUKAMI', color: '#bfe6ff' },
  rhythmEcho: { kind: 'teleport', cost: 100, hide: 7, to: 'behind', off: 0.85, ghosts: 3, follow: 'echoStrike', name: 'RHYTHM ECHO', color: '#bfe6ff' },
  thunderbolt: {
    kind: 'dive', cost: 100, rise: 14, riseV: 15, hang: 5, slamV: -34, area: 1.7, recovery: 16, landFx: 'thunder', name: 'THUNDERBOLT', color: '#bfe6ff', ground: 'lightning',
    riseHit: { dmg: 34, launch: [3, 11], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 104, launch: [5, 13], groundBounce: true, hitstop: 14, big: true, shake: 0.8, spark: 'smash' },
  },
  thunderboltAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.7, recovery: 16, landFx: 'thunder', name: 'THUNDERBOLT', color: '#bfe6ff', ground: 'lightning',
    hit: { dmg: 98, launch: [5, 13], groundBounce: true, hitstop: 14, big: true, shake: 0.8, spark: 'smash' },
  },
  godspeed: { kind: 'mode', anim: 'specialDown', cost: 100, startup: 18, recovery: 6, len: 480, speed: 1.35, damage: 1.12, blinkDash: true, fx: 'lightning', name: 'GODSPEED', color: '#bfe6ff', charge: { level: 1 } },

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
};

// Second supers on the SUPER button, and non-beam ultimates (kit.ultimate), 3 bars each.
// kind: flurry | domain | ignite | skyStrike | orb | rampage | reflex (src/game/kit.js). `range` = the CPU only fires
// it this close. pose = the animation during the super flash (default superPose); strikePose = the release.
export const SUPERS = {
  speedOfLightning: { kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 8, every: 7, hitDmg: 22, finalDmg: 130, minScale: 0.8, hitFx: 'lightning', finalFx: 'thunder', name: 'GODSPEED: SPEED OF LIGHTNING', color: '#bfe6ff', ground: 'lightning' },
  shadowCloneBarrage: { kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 7, every: 7, hitDmg: 22, finalDmg: 130, minScale: 0.8, hitFx: 'smoke', finalFx: 'rasengan', name: 'SHADOW CLONE BARRAGE', color: '#ffb43a', ground: 'spiralBig' },
  unlimitedVoid: { kind: 'domain', cost: 300, flash: 50, len: 150, name: 'DOMAIN EXPANSION: UNLIMITED VOID', color: '#9fd8ff' },
  kirin: { kind: 'skyStrike', cost: 300, flash: 40, delay: 40, radius: 2.0, dmg: 280, launch: [6, 16], recovery: 24, pose: 'beamCharge', strikePose: 'beamFire', name: 'KIRIN', color: '#9fd8ff', ground: 'lightningBig' },
  amaterasu: { kind: 'ignite', cost: 300, flash: 46, delay: 10, recovery: 26, dmg: 80, launch: [4, 9], burn: { len: 200, every: 20, dmg: 14 }, name: 'AMATERASU', callout: 'AMATERASU', color: '#c040ff', ground: 'blackFire' },

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
  // Four-Tails (Naruto, early Shippuden): the cloak boils into the four-tailed shroud (`roar`), he pounces on all
  // fours (`speed`, up to `range`), and a catch becomes a mauling: `slams` claw slams, then a chakra roar that
  // blasts them away. A whiff leaves him open for `whiff` frames. Until Codex redraws beamCharge / beamFire as the
  // shroud form (KIT.md), the transformation uses specialDown and the pounce uses dash, both tinted by `shroud`.
  // Answering the opponent's ultimate, the roar is `answerRoar` frames; in a clash he holds the maul claw frame.
  fourTails: {
    kind: 'rampage', cost: 300, flash: 46, roar: 16, answerRoar: 6, dash: 26, speed: 20, steer: 0.03, range: 8, slams: 3, every: 13, slamDmg: 45, finalDmg: 120,
    minScale: 0.9, launch: [20, 11], whiff: 34, pose: 'beamCharge', strikePose: 'beamFire', maulPose: 'beamFire', maulPhase: 2,
    shroud: { tint: [1, 1, 1], chakra: 0xb0140c, core: 0x1a0204 }, name: 'FOUR-TAILS', color: '#d0281c', ground: 'claw', roarGround: 'chakraBlast',
  },
  // Whirlwind (Killua): Godspeed's reflex mode. For `len` frames his body answers every blockable attack on its own:
  // a lightning blink behind the attacker (projectiles too) and the `follow` strike, up to `counters` times. Supers,
  // ultimates and throws go straight through it, and the opponent can simply wait it out.
  whirlwind: {
    kind: 'reflex', cost: 300, flash: 40, recovery: 12, len: 300, counters: 4, hide: 4, follow: 'echoStrike',
    pose: 'beamCharge', name: 'GODSPEED: WHIRLWIND', callout: 'WHIRLWIND!', color: '#bfe6ff',
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
export const CLASH = {
  intro: 40, lead: 40, outro: 24,
  windows: { perfect: 3, great: 6, good: 9 },
  points: { perfect: 3, great: 2, good: 1, miss: 0, stray: -1 },
  phases: [{ notes: 4, every: 30 }, { notes: 7, every: 20, doubles: 2 }, { notes: 6, every: 15, doubles: 1 }],
  doubleGap: 8, hold: { gap: 30, len: 40 },
  push: 0.018, drawMargin: 2, winDmg: 250, drawDmg: 90, answerFlash: 20,
  rush: { reach: 0.8, shove: 2.2 },
  special: { intro: 12, lead: 34, cooldown: 480, dmg: 60 },
};

// Ultimate beam (full 3 bars)
export const ULTIMATE = {
  cost: 300, windup: 46, counterWindup: 14, duration: 84, speed: 34, maxLen: 26, width: 1.25,
  tickEvery: 5, tickDmg: 12, finalDmg: 130, launch: [17, 10], flash: 42,
};
