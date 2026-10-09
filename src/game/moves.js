// Move data, in 60fps frames. Gameplay timing lives here (not in the art), so a
// new sprite sheet only needs the same animation names to plug in.
//
//  startup/active/recovery  frames per phase (animation frames are spread across them via anims.json "phases")
//  dmg        base damage (HP is 1000)
//  reach      forward hit range from the attacker's center, width = sideways tolerance (free-roam ring)
//  hitstun    frames a grounded victim is stunned;  push = knockback speed
//  airPop     upward speed given to an airborne victim (keeps juggles alive)
//  launch     [horizontal, vertical] speed -> knocks the victim into the air
//  groundBounce / wallBounce  the victim bounces off the floor / ring barrier once per combo
//  launcher   a jump or dash input after it connects chases the victim into the air
//  next/cancel  chain into the next move from this frame on
//  spark      'light' | 'heavy' | 'smash' impact effect size
//  boxPad     [x, y] world units the sprite hit box grows by for the overlap test (default 0.1/0.12, air 0.18/0.45)
export const MOVES = {
  light1: { anim: 'light1', startup: 5, active: 3, recovery: 11, dmg: 28, reach: 1.3, width: 0.95, hitstun: 22, push: 2.2, airPop: 5.5, hitstop: 7, lunge: 4.5, next: 'light2', cancel: 7, sfx: 'whoosh', spark: 'light', light: true },
  light2: { anim: 'light2', startup: 5, active: 3, recovery: 12, dmg: 30, reach: 1.35, width: 0.95, hitstun: 22, push: 2.4, airPop: 5.5, hitstop: 7, lunge: 4.5, next: 'light3', cancel: 7, sfx: 'whoosh', spark: 'light', light: true },
  light3: { anim: 'light3', startup: 6, active: 4, recovery: 14, dmg: 36, reach: 1.55, width: 1.0, hitstun: 24, push: 2.8, airPop: 6, hitstop: 8, lunge: 5, next: 'light4', cancel: 9, sfx: 'whoosh', spark: 'light', light: true, low: true },
  light4: { anim: 'light4', startup: 9, active: 4, recovery: 22, dmg: 58, reach: 1.65, width: 1.05, launch: [14, 6], hitstop: 13, lunge: 6, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.5, wallBounce: true },
  heavy: { anim: 'heavy', startup: 12, active: 5, recovery: 22, dmg: 64, reach: 1.4, width: 1.05, launch: [2.4, 15.5], hitstop: 12, lunge: 5.5, hop: 5, sfx: 'whooshHeavy', spark: 'heavy', big: true, shake: 0.45, launcher: true, yTol: 1.7, boxPad: [0.14, 0.3] },
  airLight1: { anim: 'airLight1', startup: 4, active: 4, recovery: 9, dmg: 24, reach: 1.4, width: 1.0, hitstun: 20, push: 1.6, airPop: 6.2, hitstop: 7, air: true, yTol: 1.7, next: 'airLight2', cancel: 7, sfx: 'whoosh', spark: 'light' },
  airLight2: { anim: 'airLight2', startup: 4, active: 4, recovery: 10, dmg: 26, reach: 1.45, width: 1.0, hitstun: 20, push: 1.8, airPop: 6.4, hitstop: 7, air: true, yTol: 1.7, next: 'airLight3', cancel: 8, sfx: 'whoosh', spark: 'light' },
  airLight3: { anim: 'airLight3', startup: 6, active: 4, recovery: 14, dmg: 40, reach: 1.55, width: 1.05, launch: [12, 4.5], hitstop: 11, air: true, yTol: 1.8, sfx: 'whooshHeavy', spark: 'heavy', big: true, shake: 0.4, wallBounce: true },
  airHeavy: { anim: 'airHeavy', startup: 9, active: 6, recovery: 16, dmg: 62, reach: 1.45, width: 1.15, launch: [3, -22], groundBounce: true, hitstop: 15, air: true, yTol: 2.4, sfx: 'whooshHeavy', spark: 'smash', big: true, shake: 0.7 },
  throw: { anim: 'throw', startup: 8, active: 3, recovery: 14, air: true, projectile: true, cost: 50 },
  // Killua's Rhythm Echo follow-up: the claw strike out of the afterimage teleport
  echoStrike: { anim: 'specialForward', startup: 3, active: 4, recovery: 18, dmg: 70, reach: 1.6, width: 1.1, launch: [15, 6], hitstop: 12, spark: 'smash', big: true, shake: 0.5, wallBounce: true, boxPad: [0.2, 0.3], sfx: 'whooshHeavy' },
  vanishKick: { anim: 'light4', startup: 2, active: 5, recovery: 20, dmg: 75, reach: 1.7, width: 1.15, launch: [17, 6.5], hitstop: 16, spark: 'smash', big: true, shake: 0.8, wallBounce: true, yTol: 2.4, sfx: 'whooshHeavy' },
};

// Homing super dash contact hit
export const SUPER_DASH = { speed: 18, maxFrames: 42, dmg: 38, hitstun: 26, push: 3.2, airPop: 7, hitstop: 9, spark: 'heavy', big: true, shake: 0.3 };

// Vanish: teleport behind the opponent (1 ki bar), then vanishKick
export const VANISH = { cost: 100, hideFrames: 9 };

// Signature rush specials (1 ki bar)
export const SPECIALS = {
  rasengan: {
    anim: 'special', startup: 24, active: 22, recovery: 20, dmg: 140, reach: 1.3, width: 1.05,
    launch: [16, 9], hitstop: 18, rush: 14, cost: 100, big: true, shake: 0.9, special: true, wallBounce: true,
    fx: 'rasengan', sfxLoop: 'rasengan', color: '#6ab4ff', name: 'RASENGAN', spark: 'smash',
  },
  chidori: {
    anim: 'special', startup: 28, active: 18, recovery: 20, dmg: 152, reach: 1.3, width: 1.05,
    launch: [14, 11], hitstop: 20, rush: 18, cost: 100, big: true, shake: 0.9, special: true, wallBounce: true,
    fx: 'chidori', sfxLoop: 'chidori', color: '#9ad8ff', name: 'CHIDORI', spark: 'smash',
  },
};

// Air projectiles (half a ki bar)
export const PROJECTILES = {
  shuriken: { count: 3, spread: 0.2, speed: 22, radius: 0.35, dmg: 22, hitstun: 16, push: 2, airPop: 4, life: 1.2, sprite: 'shuriken', scale: 0.55, sfx: 'shuriken', spark: 'light' },
  fireball: { count: 1, spread: 0, speed: 12, radius: 0.85, dmg: 80, launch: [8, 7], life: 1.6, sprite: 'fire', scale: 1.5, sfx: 'fireball', big: true, spark: 'heavy', glowColor: 0xff7a20, trail: 'fire', burst: 'explosion' },
  // Killua's Narukami: a very fast lightning bolt with a long stun
  bolt: { count: 1, spread: 0, speed: 36, radius: 0.45, dmg: 58, hitstun: 38, push: 3, airPop: 7, life: 0.55, sprite: 'lightning', scale: 0.95, color: 0xd8f0ff, glowColor: 0x6ab8ff, sfx: 'flash', spark: 'heavy', trail: 'bolt', random: true },
  // Sasuke's Chidori Sharp Spear: a lightning lance that only reaches ~6 units, but instantly
  spear: { count: 1, spread: 0, speed: 44, radius: 0.55, dmg: 72, hitstun: 34, push: 4, airPop: 8, life: 0.11, sprite: 'lightning', scale: 1.25, color: 0xe8f6ff, glowColor: 0x5a8cff, sfx: 'flash', spark: 'heavy', trail: 'bolt', random: true },
  // Gojo's Reversal: Red: a short-range repulsion blast that sends the victim into the wall
  red: { count: 1, spread: 0, speed: 21, radius: 0.95, dmg: 88, launch: [20, 7], wallBounce: true, life: 0.42, sprite: 'orb', scale: 1.25, color: 0xff4050, glowColor: 0xff2038, sfx: 'explosion', big: true, spark: 'smash', trail: 'red', burst: 'explosion', burstColor: 0xff3048 },
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
    kind: 'rush', anim: 'specialForward', startup: 30, active: 20, recovery: 24, dmg: 40, reach: 1.35, width: 1.1,
    hitstun: 60, push: 0, hitstop: 12, rush: 13, cost: 100, special: true, big: true, shake: 0.6, selfDmg: 25,
    fx: 'rasenshuriken', sfxLoop: 'rasengan', color: '#cfeaff', name: 'RASENSHURIKEN', spark: 'smash',
    vortex: {
      len: 40, pull: 12, radius: 2.2, tick: 6, colors: { orb: 0xe8f6ff, glow: 0x8ac8ff, ring: 0xffffff },
      tickHit: { dmg: 12, minScale: 0.8, hitstun: 24, push: 0, airPop: 1, hitstop: 2, spark: 'light' },
      pop: { dmg: 76, minScale: 0.8, launch: [18, 9], wallBounce: true, hitstop: 14, big: true, spark: 'smash' },
    },
  },
  // Uzumaki Barrage: clones kick him up (anti-air), then a heel drop
  uzumakiBarrage: {
    kind: 'dive', anim: 'specialUp', cost: 100, rise: 13, riseV: 14, hang: 5, slamV: -34, area: 1.6, recovery: 16, riseFx: 'clones', landFx: 'dust',
    name: 'UZUMAKI BARRAGE', color: '#ffb43a',
    riseHit: { dmg: 38, launch: [3, 11], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 96, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  uzumakiBarrageAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.6, recovery: 16, riseFx: 'clones', landFx: 'dust', name: 'UZUMAKI BARRAGE', color: '#ffb43a',
    hit: { dmg: 90, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  // Nine-Tails Chakra Cloak: tougher and stronger rather than faster (Godspeed is the speed mode)
  nineTails: {
    kind: 'mode', anim: 'specialDown', cost: 100, startup: 20, recovery: 8, len: 480, speed: 1.12, damage: 1.1, defense: 1.12,
    fx: 'chakra', auraColor: '#ff5a1a', auraCore: [1.0, 0.8, 0.5], name: 'NINE-TAILS CLOAK', color: '#ff6a2a',
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
    name: "LION'S BARRAGE", color: '#9ad8ff',
    riseHit: { dmg: 40, launch: [2, 12], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 98, launch: [5, 12], groundBounce: true, hitstop: 14, big: true, shake: 0.7, spark: 'smash' },
  },
  lionsBarrageAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.6, recovery: 16, landFx: 'dust', name: "LION'S BARRAGE", color: '#9ad8ff',
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
    kind: 'dive', cost: 100, rise: 14, riseV: 15, hang: 5, slamV: -34, area: 1.7, recovery: 16, landFx: 'thunder', name: 'THUNDERBOLT', color: '#bfe6ff',
    riseHit: { dmg: 34, launch: [3, 11], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 104, launch: [5, 13], groundBounce: true, hitstop: 14, big: true, shake: 0.8, spark: 'smash' },
  },
  thunderboltAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.7, recovery: 16, landFx: 'thunder', name: 'THUNDERBOLT', color: '#bfe6ff',
    hit: { dmg: 98, launch: [5, 13], groundBounce: true, hitstop: 14, big: true, shake: 0.8, spark: 'smash' },
  },
  godspeed: { kind: 'mode', anim: 'specialDown', cost: 100, startup: 18, recovery: 6, len: 480, speed: 1.35, damage: 1.12, blinkDash: true, fx: 'lightning', name: 'GODSPEED', color: '#bfe6ff' },

  // ---- Gojo
  blue: {
    kind: 'pull', anim: 'special', cost: 100, startup: 12, recovery: 23, dist: 2.6, radius: 3.5, len: 50, pull: 9, tick: 9, name: 'LAPSE: BLUE', color: '#4aa8ff',
    tickHit: { dmg: 8, hitstun: 24, push: 0, airPop: 1.2, hitstop: 2, spark: 'light' },
    pop: { dmg: 40, launch: [0, 13], hitstop: 10, big: true, spark: 'heavy' },
  },
  red: { kind: 'shot', anim: 'specialForward', startup: 14, active: 3, recovery: 22, projectile: true, proj: 'red', cost: 100, name: 'REVERSAL: RED', color: '#ff3a4a' },
  redAir: { kind: 'shot', anim: 'throw', startup: 10, active: 3, recovery: 16, air: true, projectile: true, proj: 'red', cost: 100, name: 'REVERSAL: RED', color: '#ff3a4a' },
  blink: { kind: 'teleport', cost: 50, hide: 6, to: 'above', off: 0.9, height: 2.3, ghosts: 0, follow: null, name: 'BLINK', color: '#9fd8ff' },
  infinity: { kind: 'counter', anim: 'specialDown', cost: 50, len: 24, recovery: 14, stagger: 48, onCounter: 'freeze', name: 'INFINITY', callout: 'INFINITY!', color: '#d8f2ff' },
};

// Second supers on the SUPER button, and non-beam ultimates (kit.ultimate), 3 bars each.
// kind: flurry | domain | ignite | skyStrike (src/game/kit.js). `range` = the CPU only fires it this close.
// pose = the animation during the super flash (default superPose).
export const SUPERS = {
  whirlwind: { kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 8, every: 7, hitDmg: 22, finalDmg: 130, minScale: 0.8, hitFx: 'lightning', finalFx: 'thunder', name: 'GODSPEED: WHIRLWIND', color: '#bfe6ff' },
  shadowCloneBarrage: { kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 7, every: 7, hitDmg: 22, finalDmg: 130, minScale: 0.8, hitFx: 'smoke', finalFx: 'rasengan', name: 'SHADOW CLONE BARRAGE', color: '#ffb43a' },
  unlimitedVoid: { kind: 'domain', cost: 300, flash: 50, len: 150, name: 'DOMAIN EXPANSION: UNLIMITED VOID', color: '#9fd8ff' },
  kirin: { kind: 'skyStrike', cost: 300, flash: 40, delay: 40, radius: 2.0, dmg: 280, launch: [6, 16], recovery: 24, pose: 'beamCharge', strikePose: 'beamFire', name: 'KIRIN', color: '#9fd8ff' },
  amaterasu: { kind: 'ignite', cost: 300, flash: 46, delay: 10, recovery: 26, dmg: 80, launch: [4, 9], burn: { len: 200, every: 20, dmg: 14 }, name: 'AMATERASU', callout: 'AMATERASU', color: '#c040ff' },
};

// Passive abilities (kit.passive). Infinity stops projectiles but each stop costs Gojo ki.
export const PASSIVES = {
  infinity: { kiCost: 15 },
};

// Ultimate beam (full 3 bars)
export const ULTIMATE = {
  cost: 300, windup: 46, counterWindup: 14, duration: 84, speed: 34, maxLen: 26, width: 1.25,
  tickEvery: 5, tickDmg: 12, finalDmg: 130, launch: [17, 10], flash: 42,
};
