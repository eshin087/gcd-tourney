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
    anim: 'special', startup: 24, active: 22, recovery: 20, dmg: 150, reach: 1.3, width: 1.05,
    launch: [16, 9], hitstop: 18, rush: 14, cost: 100, big: true, shake: 0.9, special: true, wallBounce: true,
    fx: 'rasengan', sfxLoop: 'rasengan', color: '#6ab4ff', name: 'RASENGAN', spark: 'smash',
  },
  chidori: {
    anim: 'special', startup: 28, active: 18, recovery: 20, dmg: 165, reach: 1.3, width: 1.05,
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

  // ---- Killua (Godspeed era)
  narukami: { kind: 'shot', anim: 'special', startup: 10, active: 3, recovery: 16, projectile: true, proj: 'bolt', cost: 50, name: 'NARUKAMI', color: '#bfe6ff' },
  narukamiAir: { kind: 'shot', anim: 'throw', startup: 8, active: 3, recovery: 14, air: true, projectile: true, proj: 'bolt', cost: 50, name: 'NARUKAMI', color: '#bfe6ff' },
  rhythmEcho: { kind: 'teleport', cost: 100, hide: 7, to: 'behind', off: 0.85, ghosts: 3, follow: 'echoStrike', name: 'RHYTHM ECHO', color: '#bfe6ff' },
  thunderbolt: {
    kind: 'dive', cost: 100, rise: 14, riseV: 15, hang: 5, slamV: -34, area: 1.7, recovery: 16, name: 'THUNDERBOLT', color: '#bfe6ff',
    riseHit: { dmg: 34, launch: [3, 11], hitstop: 8, spark: 'heavy' },
    hit: { dmg: 104, launch: [5, 13], groundBounce: true, hitstop: 14, big: true, shake: 0.8, spark: 'smash' },
  },
  thunderboltAir: {
    kind: 'dive', cost: 100, rise: 0, hang: 3, slamV: -36, area: 1.7, recovery: 16, name: 'THUNDERBOLT', color: '#bfe6ff',
    hit: { dmg: 98, launch: [5, 13], groundBounce: true, hitstop: 14, big: true, shake: 0.8, spark: 'smash' },
  },
  godspeed: { kind: 'mode', anim: 'specialDown', cost: 100, startup: 18, recovery: 6, len: 480, speed: 1.35, damage: 1.15, blinkDash: true, name: 'GODSPEED', color: '#bfe6ff' },

  // ---- Gojo
  blue: {
    kind: 'pull', anim: 'special', cost: 100, startup: 12, recovery: 20, dist: 2.6, radius: 3.6, len: 50, pull: 9, tick: 9, name: 'LAPSE: BLUE', color: '#4aa8ff',
    tickHit: { dmg: 9, hitstun: 24, push: 0, airPop: 1.2, hitstop: 2, spark: 'light' },
    pop: { dmg: 42, launch: [0, 13.5], hitstop: 10, big: true, spark: 'heavy' },
  },
  red: { kind: 'shot', anim: 'specialForward', startup: 14, active: 3, recovery: 22, projectile: true, proj: 'red', cost: 100, name: 'REVERSAL: RED', color: '#ff3a4a' },
  redAir: { kind: 'shot', anim: 'throw', startup: 10, active: 3, recovery: 16, air: true, projectile: true, proj: 'red', cost: 100, name: 'REVERSAL: RED', color: '#ff3a4a' },
  blink: { kind: 'teleport', cost: 50, hide: 6, to: 'above', off: 0.9, height: 2.3, ghosts: 0, follow: null, name: 'BLINK', color: '#9fd8ff' },
  infinity: { kind: 'counter', anim: 'specialDown', cost: 50, len: 26, recovery: 14, stagger: 50, name: 'INFINITY', color: '#d8f2ff' },
};

// Second supers on the SUPER button (3 bars). kind: flurry | domain (src/game/kit.js)
export const SUPERS = {
  whirlwind: { kind: 'flurry', cost: 300, flash: 34, dash: 14, range: 6.5, hits: 8, every: 7, hitDmg: 22, finalDmg: 130, minScale: 0.8, name: 'GODSPEED: WHIRLWIND', color: '#bfe6ff' },
  unlimitedVoid: { kind: 'domain', cost: 300, flash: 50, len: 150, name: 'DOMAIN EXPANSION: UNLIMITED VOID', color: '#9fd8ff' },
};

// Ultimate beam (full 3 bars)
export const ULTIMATE = {
  cost: 300, windup: 46, counterWindup: 14, duration: 84, speed: 34, maxLen: 26, width: 1.25,
  tickEvery: 5, tickDmg: 12, finalDmg: 130, launch: [17, 10], flash: 42,
};
