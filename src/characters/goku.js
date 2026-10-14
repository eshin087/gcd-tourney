// Saiyan martial artist archetype (Goku, Dragon Ball Z, Super Saiyan in the Cell saga). The placeholder sprite
// sheet is baked from this 3D chibi model at startup; the real art comes from art/characters/goku/.
// Kit (ADR 0032): Ki Blast Volley, Dragon Fist, Rising Kick dive, Instant Transmission, Kaio-ken Rush super,
// and the Kamehameha: the cast's one beam ultimate (ADR 0017).

const model = {
  palette: {
    skin: { base: '#f6c8a0', shadow: '#d48c68', light: '#ffe4cc' },
    hair: { base: '#ffd84a', shadow: '#e09a1c', light: '#fff07a', hi: '#fffbe0' },
    gi: { base: '#f47a1e', shadow: '#bc4a12', light: '#ffa04a' },
    under: { base: '#2a4cb4', shadow: '#162a72', light: '#4a72e0' },
    boot: { base: '#2a3c9c', shadow: '#16205e', light: '#4a5ec8' },
    sole: { base: '#e8c46a', shadow: '#b08a34', light: '#fff0a8' },
  },
  outfit: {
    pelvis: 'gi',
    torso: [{ mat: 'gi', y0: -0.05, y1: 0.4 }],
    collar: 'ring', collarMat: 'under',
    shoulder: 'under',
    upperArm: 'skin', sleeve: { mat: 'under', len: 0.45 }, foreArm: 'skin', warmer: 'under', hand: 'skin',
    thigh: 'gi', shin: 'gi', wrap: 'boot', foot: 'boot', sole: 'sole',
  },
  hair: {
    mat: 'hair', hairline: 0.34, hairSlope: -0.2, nape: -0.5, capScale: 1.06,
    // Super Saiyan: long golden spikes swept straight up and back, one bang over the forehead
    spikes: [
      [88, 0, 0.26, 0.085, 5, 4], [78, 45, 0.27, 0.085, 5, 10], [78, -45, 0.27, 0.085, 5, 10], [74, 110, 0.28, 0.088, 5, 16], [74, -110, 0.28, 0.088, 5, 16],
      [70, 165, 0.26, 0.085, 5, 20], [60, 20, 0.2, 0.078, 5, 0], [56, 80, 0.24, 0.08, 5, 8], [56, -80, 0.24, 0.08, 5, 8], [50, 140, 0.24, 0.08, 5, 14],
      [50, -140, 0.24, 0.08, 5, 14], [40, 180, 0.22, 0.078, 5, 18], [30, 110, 0.18, 0.07, 5, 6], [30, -110, 0.18, 0.07, 5, 6],
    ],
    bangs: [[0.2, 0.17, 0.03, 0.8, -0.5, 0.05, 0.14, 0.046]],
  },
  face: { iris: '#2fb8a6', irisDark: '#156a5e', line: '#1d1420', mouth: '#5a1a22', skinLine: '#b9704f', sclera: '#f6f2f4' },
};

const stance = {
  root: { yaw: 6 },
  spine: { lean: 6, yaw: 10 },
  head: { nod: -4, yaw: 12 },
  aN: { sw: 46, ab: 26, el: 110 },
  aF: { sw: 66, ab: 12, el: 80 },
  lN: { sw: -24, ab: 10, kn: 16, fl: 0.7, an: -12 },
  lF: { sw: 32, ab: 6, kn: 22 },
};

function extraAnims({ st }) {
  return {
    // Ki Blast Volley: one palm thrust after the other, three quick blasts
    special: {
      samples: [0.06, 0.16, 0.26, 0.36, 0.46, 0.56, 0.7, 0.86], end: 0.92, phases: [3, 3, 2],
      keys: [
        [0, st()],
        [0.12, st({ spine: { lean: 4, yaw: 24 }, aN: { sw: 40, ab: 20, el: 120, hand: 'open' }, aF: { sw: 30, ab: 14, el: 110, hand: 'open' }, face: 'angry' }), 'out'],
        [0.3, st({ spine: { lean: 12, yaw: -10 }, root: { x: 0.03 }, aN: { sw: 92, ab: 6, el: 6, hand: 'palm' }, aF: { sw: 20, ab: 20, el: 100, hand: 'open' }, face: 'shout', flutter: 1.5 }), 'snap'],
        [0.45, st({ spine: { lean: 12, yaw: 14 }, root: { x: 0.03 }, aN: { sw: 20, ab: 20, el: 100, hand: 'open' }, aF: { sw: 92, ab: -6, el: 6, hand: 'palm' }, face: 'shout', flutter: 1.5 }), 'snap'],
        [0.6, st({ spine: { lean: 12, yaw: -10 }, root: { x: 0.03 }, aN: { sw: 92, ab: 6, el: 6, hand: 'palm' }, aF: { sw: 20, ab: 20, el: 100, hand: 'open' }, face: 'shout', flutter: 1.5 }), 'snap'],
        [0.92, st(), 'inout'],
      ],
    },
    // Dragon Fist: fist drawn back at the hip, then a full-body dash punch
    specialForward: {
      samples: [0.05, 0.14, 0.24, 0.32, 0.42, 0.52, 0.62], end: 0.66, phases: [2, 2, 3],
      keys: [
        [0, st()],
        [0.12, st({ root: { y: -0.04 }, spine: { lean: 14, yaw: 30 }, lF: { kn: 50 }, lN: { kn: 40 }, aN: { sw: -40, ab: 20, el: 100 }, aF: { sw: 70, ab: -10, el: 60, hand: 'open' }, face: 'shout', flutter: 2 }), 'out'],
        [0.24, st({ spine: { lean: 30, yaw: -24 }, root: { x: 0.1 }, lF: { sw: 64, kn: 20 }, lN: { sw: -62, kn: 6, fl: 0.3 }, aN: { sw: 94, ab: 2, el: 0 }, aF: { sw: -70, ab: 24, el: 30 }, face: 'shout', flutter: 3 }), 'snap'],
        [0.42, st({ spine: { lean: 28, yaw: -20 }, root: { x: 0.09 }, lF: { sw: 62, kn: 22 }, lN: { sw: -60, kn: 8, fl: 0.3 }, aN: { sw: 92, ab: 4, el: 2 }, aF: { sw: -68, ab: 24, el: 32 }, face: 'shout', flutter: 2.5 })],
        [0.66, st(), 'inout'],
      ],
    },
    // Rising Kick: crouch, a rising kick that flips him over into the axe-kick drop (airHeavy)
    specialUp: {
      samples: [0.05, 0.12, 0.2, 0.28, 0.36, 0.44], end: 0.48, phases: [2, 2, 2],
      keys: [
        [0, st()],
        [0.1, st({ root: { y: -0.08 }, spine: { lean: 20 }, lF: { kn: 80 }, lN: { kn: 70 }, aN: { sw: -30, ab: 20, el: 30 }, aF: { sw: -30, ab: 20, el: 30 }, face: 'shout' }), 'out'],
        [0.22, st({ root: { y: 0.05 }, spine: { lean: -20 }, lF: { sw: 150, kn: 10, fl: 0 }, lN: { sw: -20, kn: 40, fl: 0 }, aN: { sw: 40, ab: 40, el: 30 }, aF: { sw: -40, ab: 30, el: 20 }, head: { nod: -20 }, face: 'shout', flutter: 3 }), 'snap'],
        [0.34, st({ spine: { lean: -10 }, lF: { sw: 120, kn: 30, fl: 0 }, lN: { sw: -30, kn: 50, fl: 0 }, aN: { sw: 60, ab: 30, el: 60 }, aF: { sw: -20, ab: 30, el: 40 }, face: 'shout', flutter: 2 })],
        [0.48, st({ spine: { lean: 20 }, lF: { sw: 160, kn: 0, fl: 0 }, lN: { sw: -10, kn: 60, fl: 0 }, aN: { sw: 140, ab: 20, el: 40 }, aF: { sw: 140, ab: -10, el: 40 }, face: 'angry', flutter: 2 })],
      ],
    },
    // Instant Transmission: two fingers raised to the forehead, eyes shut, then gone
    specialDown: {
      samples: [0.05, 0.14, 0.24, 0.34], end: 0.4, phases: [2, 1, 1],
      keys: [
        [0, st()],
        [0.14, st({ spine: { lean: 0, yaw: 14 }, lF: { sw: 10, kn: 8 }, lN: { sw: -10, kn: 6 }, aN: { sw: 130, ab: 10, el: 140, hand: 'open' }, aF: { sw: -6, ab: 14, el: 20 }, head: { nod: 6 } }), 'out'],
        [0.4, st({ spine: { lean: 0, yaw: 14 }, lF: { sw: 10, kn: 8 }, lN: { sw: -10, kn: 6 }, aN: { sw: 132, ab: 10, el: 142, hand: 'open' }, aF: { sw: -6, ab: 14, el: 20 }, head: { nod: 8 } }), 'inout'],
      ],
    },
    // Kaio-ken: fists clenched at the sides, the red aura bursting out
    superPose: {
      loop: true, frames: 4, cycle: 0.5,
      keys: [
        [0, st({ root: { y: -0.04 }, spine: { lean: -4 }, lF: { sw: 30, ab: 16, kn: 34 }, lN: { sw: -30, ab: 16, kn: 28 }, aN: { sw: -10, ab: 30, el: 70 }, aF: { sw: -10, ab: 30, el: 70 }, head: { nod: -14 }, face: 'shout', flutter: 3 })],
        [0.25, st({ root: { y: -0.05 }, spine: { lean: -5 }, lF: { sw: 30, ab: 16, kn: 36 }, lN: { sw: -30, ab: 16, kn: 30 }, aN: { sw: -10, ab: 32, el: 72 }, aF: { sw: -10, ab: 32, el: 72 }, head: { nod: -16 }, face: 'shout', flutter: 4 })],
      ],
    },
    intro: {
      loop: true, frames: 4, cycle: 0.8,
      keys: [
        [0, st({ spine: { lean: 2, yaw: 14 }, lF: { sw: 14, kn: 10 }, lN: { sw: -12, kn: 8 }, aN: { sw: 50, ab: 20, el: 120 }, aF: { sw: 60, ab: -10, el: 100, hand: 'open' }, face: 'smirk', flutter: 1 })],
        [0.4, st({ spine: { lean: 3, yaw: 14 }, root: { y: -0.01 }, lF: { sw: 14, kn: 12 }, lN: { sw: -12, kn: 10 }, aN: { sw: 51, ab: 20, el: 121 }, aF: { sw: 61, ab: -10, el: 101, hand: 'open' }, face: 'smirk', flutter: 2 })],
      ],
    },
    taunt: {
      loop: true, frames: 2, cycle: 0.5,
      keys: [
        [0, st({ spine: { lean: -2, yaw: 18 }, aN: { sw: 70, ab: 10, el: 60, hand: 'open' }, aF: { sw: -4, ab: 14, el: 20 }, head: { nod: -6 }, face: 'smirk' })],
        [0.25, st({ spine: { lean: -3, yaw: 18 }, aN: { sw: 74, ab: 10, el: 40, hand: 'open' }, aF: { sw: -4, ab: 14, el: 20 }, head: { nod: -7 }, face: 'smirk', flutter: 1 })],
      ],
    },
    win: {
      loop: true, frames: 4, cycle: 1.0,
      keys: [
        [0, st({ spine: { lean: -4, yaw: 20 }, lF: { sw: 10, kn: 8 }, lN: { sw: -10, kn: 6 }, aN: { sw: 150, ab: 10, el: 10 }, aF: { sw: 10, ab: 26, el: 100 }, head: { nod: -10 }, face: 'grin', flutter: 1 })],
        [0.5, st({ spine: { lean: -5, yaw: 20 }, lF: { sw: 10, kn: 10 }, lN: { sw: -10, kn: 8 }, aN: { sw: 152, ab: 10, el: 8 }, aF: { sw: 10, ab: 26, el: 102 }, head: { nod: -12 }, face: 'grin', flutter: 2 })],
      ],
    },
  };
}

export default {
  id: 'goku',
  name: 'GOKU',
  subtitle: 'Super Saiyan',
  look: 'Super Saiyan: tall spiky golden hair swept upward with one bang over the forehead, teal-green eyes, muscular build, orange sleeveless martial arts gi over a short-sleeved dark blue undershirt, dark blue wristbands and belt sash, dark blue boots with yellow trim, golden aura',
  color: '#ffd84a',
  aura: [1.0, 0.85, 0.3],
  auraCore: [1.0, 0.97, 0.75],
  // Powering up (ADR 0023, src/game/chargeFx.js): the Super Saiyan aura, a golden flame shell rising off him, rocks
  // lifting off the floor and the ground cracking at bar 2.
  charge: {
    palette: { main: '#ffd84a', core: '#fff6c0', edge: '#ffb020', dark: '#c07a10', pebble: '#9c8a74' },
    bodyTint: 0.04,
    shell: { kind: 'flame', color: 'edge', core: 'main', width: [0.04, 0.1], lift: 0.8, noise: 0.7, speed: 2.6, opacity: [0.45, 0.7] },
    emit: [
      { fx: 'wisp', from: 'body', every: 8, max: 3, scale: [0.3, 0.45], vel: [0, 1.8, 0], color: 'main', opacity: 0.5 },
      { fx: 'wisp', from: 'head', bar: 1, every: 10, max: 2, scale: [0.3, 0.4], vel: [0, 2.0, 0], color: 'core', opacity: 0.5 },
      { fx: 'star', frame: 3, from: 'floor', every: 8, max: 5, scale: [0.16, 0.24], vel: [0, [1.4, 2.8], 0], life: 0.9, color: 'pebble', opacity: 1 },
    ],
    ground: { dustEvery: 16, crackAt: 2, rumble: 0.08 },
    bar: { ring: { scale: 1.8, color: 'core', opacity: 0.45 }, burst: { scale: 0.9 } },
    max: { ring: { scale: 2.4, color: 'main', opacity: 0.5 }, burst: { scale: 1.1 }, flash: 0.08 },
    sound: 'hum',
  },
  // the Kamehameha: the shared beam ultimate, the cast's only beam (ADR 0017)
  beam: { core: '#ffffff', mid: '#8fd8ff', edge: '#2a7cff', name: 'KAMEHAMEHA' },
  specialName: 'KI BLAST VOLLEY',
  projectileName: 'KI BLAST',
  superName: 'KAIO-KEN RUSH',
  kit: {
    specials: { neutral: 'kiVolley', forward: 'dragonFist', up: 'risingKick', down: 'instantTransmission', air: 'kiVolleyAir', airDown: 'risingKickAir' },
    super: 'kaiokenRush',
  },
  stats: { speed: 6.2, power: 1.02, defense: 1.0 }, // stat index 1.02 (ADR 0011)
  // floor damage (ground.js, ADR 0024): ki scorch under his specials; a full Super Saiyan charge cracks the floor
  ground: { style: 'ki', tint: '#ffd84a' },
  model,
  stance,
  extraAnims,
  portraitFace: 'angry',
  selectFacing: 'right',
};
