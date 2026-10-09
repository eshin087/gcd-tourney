// Lightning-assassin archetype (Killua, Hunter x Hunter, Godspeed era). The placeholder sprite
// sheet is baked from this 3D chibi model at startup; the real art comes from art/characters/killua/.
// Kit (ADR 0009): Narukami bolt, Rhythm Echo teleport, Thunderbolt dive, Godspeed mode,
// Lightning Palm beam, Godspeed: Whirlwind super.

const model = {
  // slimmer and a little shorter than the older fighters
  props: {
    thigh: 0.215, shin: 0.205, torso: 0.315, shoulderW: 0.152, upper: 0.155, fore: 0.142,
    armR: [0.055, 0.048], foreR: [0.05, 0.042], thighR: [0.086, 0.068], shinR: [0.066, 0.05], headR: 0.258,
  },
  palette: {
    skin: { base: '#fbdcc6', shadow: '#e1a98c', light: '#fff0e6' },
    hair: { base: '#e8ecf6', shadow: '#a9b2cc', light: '#ffffff', hi: '#ffffff' },
    tunic: { base: '#4a3f8c', shadow: '#2c2558', light: '#6c60b4' },
    white: { base: '#eeeaf4', shadow: '#b4aec8', light: '#ffffff' },
    shorts: { base: '#2a2f4e', shadow: '#171a30', light: '#40476e' },
    shoe: { base: '#7b54c8', shadow: '#4c3288', light: '#a080ec' },
    sole: { base: '#e8e4f0', shadow: '#aaa4bc', light: '#ffffff' },
  },
  outfit: {
    pelvis: 'shorts',
    torso: [{ mat: 'tunic', y0: -0.05, y1: 0.4 }],
    collar: 'high', collarMat: 'white',
    shoulder: 'tunic',
    upperArm: 'white', foreArm: 'white', hand: 'skin',
    thigh: 'shorts', shin: 'skin', wrap: 'white', foot: 'shoe', sole: 'sole',
  },
  hair: {
    mat: 'hair', hairline: 0.3, hairSlope: -0.22, nape: -0.55, capScale: 1.06,
    // messy spikes in every direction, longest on top and at the back
    spikes: [
      [86, 0, 0.2, 0.078, 5, 6], [74, 50, 0.22, 0.08, 5, 12], [74, -50, 0.22, 0.08, 5, 12], [70, 120, 0.23, 0.082, 5, 18], [70, -120, 0.23, 0.082, 5, 18],
      [66, 170, 0.22, 0.08, 5, 22], [52, 20, 0.17, 0.072, 5, 0], [50, 85, 0.21, 0.078, 5, 6], [50, -85, 0.21, 0.078, 5, 6], [46, 145, 0.23, 0.08, 5, 14],
      [46, -145, 0.23, 0.08, 5, 14], [40, 180, 0.22, 0.078, 5, 18], [26, 110, 0.19, 0.07, 5, 6], [26, -110, 0.19, 0.07, 5, 6], [18, 160, 0.2, 0.07, 5, 10],
      [18, -160, 0.2, 0.07, 5, 10], [32, 60, 0.15, 0.064, 4, 0], [32, -60, 0.15, 0.064, 4, 0], [60, 95, 0.16, 0.07, 5, 10], [60, -95, 0.16, 0.07, 5, 10],
    ],
    bangs: [
      [0.19, 0.15, 0.06, 0.8, -0.55, 0.2, 0.14, 0.046], [0.2, 0.15, -0.05, 0.85, -0.5, -0.22, 0.13, 0.044],
      [0.15, 0.16, 0.15, 0.55, -0.6, 0.55, 0.13, 0.04], [0.15, 0.16, -0.15, 0.55, -0.6, -0.55, 0.12, 0.04],
    ],
  },
  face: { iris: '#3fa0ff', irisDark: '#1a4fae', line: '#1a1424', mouth: '#5a1a22', skinLine: '#c99278', sclera: '#f6f2f4', whiskers: false, symbol: '#3a3448' },
};

// low assassin stance, open hands (claws)
const stance = {
  root: { yaw: 4 },
  spine: { lean: 18, yaw: 8 },
  head: { nod: -8, yaw: 12 },
  aF: { sw: 58, ab: 12, el: 40, hand: 'open' },
  aN: { sw: 18, ab: 28, el: 60, hand: 'open' },
  lF: { sw: 34, ab: 8, kn: 40 },
  lN: { sw: -30, ab: 10, kn: 30, fl: 0.7, an: -12 },
};

function extraAnims({ st }) {
  return {
    // Narukami: palm drawn back crackling, thrust forward (the bolt leaves on the active frame)
    special: {
      samples: [0.04, 0.12, 0.2, 0.3, 0.42, 0.54], end: 0.6, phases: [2, 1, 3], smear: { 2: ['handN'] },
      keys: [
        [0, st()],
        [0.12, st({ spine: { lean: 8, yaw: 26 }, aN: { sw: -30, ab: 26, el: 60, hand: 'palm' }, aF: { sw: 70, ab: 10, el: 30, hand: 'open' }, face: 'angry', flutter: 1.5 }), 'out'],
        [0.2, st({ spine: { lean: 22, yaw: -24 }, root: { x: 0.06 }, lF: { sw: 46, kn: 30 }, lN: { sw: -40, kn: 12 }, aN: { sw: 92, ab: 4, el: 0, hand: 'palm' }, aF: { sw: -30, ab: 20, el: 30, hand: 'open' }, face: 'shout', flutter: 2.5 }), 'snap'],
        [0.4, st({ spine: { lean: 20, yaw: -20 }, root: { x: 0.05 }, lF: { sw: 44, kn: 30 }, lN: { sw: -38, kn: 14 }, aN: { sw: 88, ab: 6, el: 6, hand: 'palm' }, aF: { sw: -28, ab: 20, el: 34, hand: 'open' }, face: 'angry' }), 'linear'],
        [0.6, st(), 'inout'],
      ],
    },
    // Rhythm Echo strike: a lunging claw from behind the opponent
    specialForward: {
      samples: [0.03, 0.08, 0.13, 0.19, 0.27, 0.35, 0.43], end: 0.48, phases: [2, 2, 3], smear: { 2: ['handN'] },
      keys: [
        [0, st({ spine: { lean: 30 }, lF: { kn: 70 }, lN: { kn: 60 }, aN: { sw: -40, ab: 30, el: 40, hand: 'open' }, face: 'angry' })],
        [0.08, st({ spine: { lean: 34, yaw: 20 }, lF: { sw: 50, kn: 60 }, lN: { sw: -40, kn: 40 }, aN: { sw: -20, ab: 34, el: 70, hand: 'open' }, face: 'angry', flutter: 2 }), 'out'],
        [0.13, st({ spine: { lean: 30, yaw: -30 }, root: { x: 0.1 }, lF: { sw: 64, kn: 22 }, lN: { sw: -56, kn: 8, fl: 0.3 }, aN: { sw: 96, ab: 2, el: 2, hand: 'open' }, aF: { sw: -60, ab: 24, el: 20, hand: 'open' }, face: 'shout', flutter: 3 }), 'snap'],
        [0.24, st({ spine: { lean: 28, yaw: -28 }, root: { x: 0.1 }, lF: { sw: 62, kn: 24 }, lN: { sw: -54, kn: 10, fl: 0.3 }, aN: { sw: 94, ab: 4, el: 6, hand: 'open' }, aF: { sw: -58, ab: 24, el: 22, hand: 'open' }, face: 'angry' }), 'linear'],
        [0.48, st(), 'inout'],
      ],
    },
    // Thunderbolt: crouch, then a lightning leap with one arm raised (the slam reuses airHeavy)
    specialUp: {
      samples: [0.03, 0.08, 0.14, 0.2, 0.26, 0.32], end: 0.36, phases: [2, 2, 2],
      keys: [
        [0, st({ squash: 0.88, spine: { lean: 26 }, lF: { sw: 46, kn: 90 }, lN: { sw: -18, kn: 80 }, aN: { sw: -30, ab: 20, el: 30 }, aF: { sw: -24, ab: 20, el: 30 }, face: 'angry' })],
        [0.1, st({ squash: 1.08, spine: { lean: -6 }, root: { y: 0.1 }, lF: { sw: 60, kn: 110, fl: 0, an: -25 }, lN: { sw: 20, kn: 90, fl: 0, an: -30 }, aN: { sw: 170, ab: 14, el: 10, hand: 'open' }, aF: { sw: -40, ab: 30, el: 30, hand: 'open' }, face: 'shout', flutter: 2.5 }), 'snap'],
        [0.3, st({ spine: { lean: -2 }, root: { y: 0.12 }, lF: { sw: 66, kn: 114, fl: 0, an: -25 }, lN: { sw: 26, kn: 96, fl: 0, an: -30 }, aN: { sw: 166, ab: 16, el: 14, hand: 'open' }, aF: { sw: -36, ab: 30, el: 34, hand: 'open' }, face: 'angry', flutter: 2 }), 'linear'],
      ],
    },
    // Godspeed: clench, then arms flung out with a shout as the lightning takes over
    specialDown: {
      samples: [0.04, 0.12, 0.22, 0.32], end: 0.38, phases: [2, 1, 1],
      keys: [
        [0, st({ spine: { lean: 30 }, lF: { kn: 56 }, lN: { kn: 46 }, aN: { sw: 20, ab: 20, el: 120 }, aF: { sw: 24, ab: -10, el: 120 }, face: 'angry' })],
        [0.14, st({ spine: { lean: -10 }, head: { nod: -18 }, lF: { sw: 30, kn: 20 }, lN: { sw: -30, kn: 16 }, aN: { sw: 40, ab: 70, el: 20, hand: 'open' }, aF: { sw: 40, ab: 70, el: 20, hand: 'open' }, face: 'shout', flutter: 3 }), 'snap'],
        [0.36, st({ face: 'angry' }), 'inout'],
      ],
    },
    // Whirlwind activation: crackling hand raised, cold eyes
    superPose: {
      loop: true, frames: 4, cycle: 0.4,
      keys: [
        [0, st({ spine: { lean: 6, yaw: 20 }, head: { nod: -10 }, aN: { sw: 120, ab: 20, el: 40, hand: 'open' }, aF: { sw: 30, ab: 20, el: 60, hand: 'open' }, face: 'angry', flutter: 2 })],
        [0.2, st({ spine: { lean: 7, yaw: 20 }, head: { nod: -11 }, aN: { sw: 124, ab: 20, el: 38, hand: 'open' }, aF: { sw: 30, ab: 20, el: 62, hand: 'open' }, face: 'angry', flutter: 3 })],
      ],
    },
    intro: {
      loop: true, frames: 4, cycle: 0.8,
      keys: [
        [0, st({ spine: { lean: 0, yaw: 14 }, head: { nod: 2, yaw: -6 }, lF: { sw: 10, kn: 6 }, lN: { sw: -10, kn: 4 }, aN: { sw: -8, ab: 14, el: 20 }, aF: { sw: -6, ab: 12, el: 20 }, face: 'smirk', flutter: 0.6 })],
        [0.4, st({ spine: { lean: 0, yaw: 14 }, head: { nod: 4, yaw: -6 }, root: { y: -0.006 }, lF: { sw: 10, kn: 8 }, lN: { sw: -10, kn: 6 }, aN: { sw: -8, ab: 14, el: 22 }, aF: { sw: -6, ab: 12, el: 22 }, face: 'smirk', flutter: 1 })],
      ],
    },
    taunt: {
      loop: true, frames: 2, cycle: 0.5,
      keys: [
        [0, st({ spine: { lean: 2, yaw: 16 }, head: { nod: -4 }, aF: { sw: 80, ab: 10, el: 30, hand: 'open' }, aN: { sw: -4, ab: 14, el: 20 }, face: 'smirk' })],
        [0.25, st({ spine: { lean: 3, yaw: 16 }, head: { nod: -5 }, aF: { sw: 84, ab: 10, el: 26, hand: 'open' }, aN: { sw: -4, ab: 14, el: 20 }, face: 'smirk', flutter: 1 })],
      ],
    },
    win: {
      loop: true, frames: 4, cycle: 1.0,
      keys: [
        [0, st({ root: { yaw: -30 }, spine: { lean: -2, yaw: -8 }, head: { nod: 6, yaw: 16 }, lF: { sw: 8, kn: 6 }, lN: { sw: -8, kn: 4 }, aN: { sw: 20, ab: 24, el: 130 }, aF: { sw: 22, ab: -14, el: 130 }, face: 'smirk', flutter: 1 })],
        [0.5, st({ root: { yaw: -30 }, spine: { lean: -2, yaw: -8 }, head: { nod: 8, yaw: 16 }, lF: { sw: 8, kn: 8 }, lN: { sw: -8, kn: 6 }, aN: { sw: 22, ab: 24, el: 128 }, aF: { sw: 22, ab: -14, el: 128 }, face: 'smirk', flutter: 2 })],
      ],
    },
  };
}

export default {
  id: 'killua',
  name: 'KILLUA',
  subtitle: 'Godspeed Assassin',
  look: 'fluffy spiky silver-white hair, sharp cat-like blue eyes, slim build, loose long-sleeved purple shirt with a dark navy rolled collar over a white undershirt (white cuffs and hem), baggy dark navy shorts above the knee, purple-and-white high-top sneakers, blue-white lightning',
  color: '#8fd4ff',
  aura: [0.55, 0.82, 1.0],
  auraCore: [0.92, 0.97, 1.0],
  beam: { core: '#ffffff', mid: '#9fdcff', edge: '#4a8cff', name: 'LIGHTNING PALM' },
  specialName: 'NARUKAMI',
  projectileName: 'NARUKAMI',
  superName: 'GODSPEED: WHIRLWIND',
  kit: {
    specials: { neutral: 'narukami', forward: 'rhythmEcho', up: 'thunderbolt', down: 'godspeed', air: 'narukamiAir', airDown: 'thunderboltAir' },
    super: 'whirlwind',
  },
  stats: { speed: 6.8, power: 0.97, defense: 0.95 }, // stat index 1.01 (ADR 0011)
  model,
  stance,
  extraAnims,
  runLean: 44,
  runArms: { aN: { sw: -110, ab: 24, el: 10 }, aF: { sw: -104, ab: 18, el: 10 } },
  portraitFace: 'angry',
};
