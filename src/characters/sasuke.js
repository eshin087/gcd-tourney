// Brooding lightning-ninja archetype (Sasuke vibe). The placeholder sprite sheet is
// baked from this 3D chibi model; drop public/characters/sasuke/sheet.png +
// anims.json to replace it.

const model = {
  props: { headR: 0.24 },
  palette: {
    skin: { base: '#fbd8bd', shadow: '#e0a283', light: '#fff1e4' },
    hair: { base: '#1e2032', shadow: '#0e0f18', light: '#2e3556', hi: '#4a5684' },
    shirt: { base: '#2e4282', shadow: '#1a2650', light: '#4a64ac' },
    white: { base: '#ebe8f2', shadow: '#aaa5c0', light: '#ffffff' },
    shorts: { base: '#d8d6e4', shadow: '#9893b2', light: '#f2f0f8' },
    sandal: { base: '#2a2f58', shadow: '#171a36', light: '#454f8c' },
    band: { base: '#283a6c', shadow: '#162044', light: '#3e548f' },
    metal: { base: '#b8c2d2', shadow: '#76829a', light: '#e4eaf4', hi: '#ffffff' },
    sole: { base: '#2a2228', shadow: '#181216', light: '#433840' },
  },
  outfit: {
    pelvis: 'shorts',
    torso: [{ mat: 'shirt', y0: -0.05, y1: 0.4 }],
    collar: 'high', collarMat: 'shirt',
    shoulder: 'shirt',
    upperArm: 'skin', sleeve: { mat: 'shirt', len: 0.6 },
    foreArm: 'skin', warmer: 'white', hand: 'skin',
    thigh: 'shorts', shin: 'skin', wrap: 'white', foot: 'sandal', toes: 'skin', sole: 'sole',
  },
  hair: {
    mat: 'hair', hairline: 0.26, hairSlope: -0.3, nape: -0.62, capScale: 1.09,
    spikes: [
      [42, 180, 0.24, 0.085, 5, 32], [58, 158, 0.22, 0.08, 5, 34], [58, -158, 0.22, 0.08, 5, 34], [26, 150, 0.21, 0.078, 5, 26], [26, -150, 0.21, 0.078, 5, 26],
      [70, 175, 0.2, 0.075, 5, 40], [8, 172, 0.19, 0.072, 5, 18], [42, 128, 0.18, 0.072, 5, 28], [42, -128, 0.18, 0.072, 5, 28],
      [78, 45, 0.11, 0.07, 5, 26], [78, -45, 0.11, 0.07, 5, 26], [82, 120, 0.14, 0.072, 5, 34], [60, 95, 0.12, 0.068, 5, 22], [60, -95, 0.12, 0.068, 5, 22],
    ],
    bangs: [
      [0.15, 0.09, 0.165, 0.22, -1, 0.12, 0.24, 0.042], [0.15, 0.09, -0.165, 0.22, -1, -0.12, 0.23, 0.04],
      [0.21, 0.14, 0.05, 0.62, -0.78, 0.12, 0.11, 0.042], [0.21, 0.14, -0.06, 0.62, -0.78, -0.12, 0.1, 0.04],
    ],
  },
  headband: { band: 'band', plate: 'metal', y: 0.075, tilt: 4, tails: true },
  face: { iris: '#2c2c40', irisDark: '#121218', line: '#141018', mouth: '#5a1a22', skinLine: '#c4866a', sclera: '#f6f2f4', whiskers: false, symbol: '#3a3448' },
};

const stance = {
  spine: { lean: 14, yaw: 6 },
  head: { nod: -2, yaw: 10 },
  aF: { sw: 74, ab: 10, el: 30, hand: 'open' },
  aN: { sw: 24, ab: 26, el: 74 },
  lF: { sw: 34, ab: 6, kn: 34 },
  lN: { sw: -28, ab: 10, kn: 20, fl: 0.7, an: -12 },
};

function extraAnims({ st }) {
  const runL = (k) => ({ lF: { sw: 52 - k * 100, kn: 30 + k * 40 }, lN: { sw: -54 + k * 100, kn: 40 - k * 10, fl: 0.4 } });
  return {
    // Chidori: lightning gathers in the lowered hand, sprint with it trailing, thrust
    special: {
      samples: [0.08, 0.2, 0.32, 0.44, 0.54, 0.64, 0.8, 0.92], end: 1.0, phases: [3, 3, 2], smear: { 5: ['handN'] },
      keys: [
        [0, st()],
        [0.1, st({ spine: { lean: 30 }, lF: { sw: 56, kn: 82 }, lN: { sw: -26, kn: 62 }, aN: { sw: -46, ab: 22, el: 10, hand: 'open' }, aF: { sw: -14, ab: -30, el: 84, hand: 'open' }, face: 'angry', eyes: 'red', flutter: 1.5 }), 'out'],
        [0.3, st({ spine: { lean: 32 }, root: { x: 0.01 }, lF: { sw: 58, kn: 84 }, lN: { sw: -26, kn: 64 }, aN: { sw: -48, ab: 22, el: 10, hand: 'open' }, aF: { sw: -14, ab: -30, el: 84, hand: 'open' }, face: 'angry', eyes: 'red', flutter: 2 })],
        [0.42, st({ spine: { lean: 44 }, head: { nod: -30 }, ...runL(0), aN: { sw: -58, ab: 24, el: 2, hand: 'open' }, aF: { sw: -96, ab: 18, el: 12 }, face: 'angry', eyes: 'red', flutter: 2.5 }), 'out'],
        [0.56, st({ spine: { lean: 44 }, head: { nod: -30 }, ...runL(1), aN: { sw: -58, ab: 24, el: 2, hand: 'open' }, aF: { sw: -96, ab: 18, el: 12 }, face: 'angry', eyes: 'red', flutter: 2.5 }), 'linear'],
        [0.66, st({ spine: { lean: 30, yaw: -28 }, root: { x: 0.09 }, lF: { sw: 62, kn: 20 }, lN: { sw: -62, kn: 6, fl: 0.3 }, aN: { sw: 95, ab: 2, el: 0, hand: 'palm' }, aF: { sw: -80, ab: 24, el: 14 }, face: 'shout', eyes: 'red', flutter: 3 }), 'snap'],
        [0.98, st({ eyes: 'red' }), 'inout'],
      ],
    },
    // Chidori Sharp Spear: hand pulled back low, a long straight thrust (the engine draws the lance)
    specialForward: {
      samples: [0.04, 0.1, 0.16, 0.22, 0.3, 0.38, 0.46], end: 0.5, phases: [2, 2, 3],
      keys: [
        [0, st({ eyes: 'red' })],
        [0.1, st({ spine: { lean: 18, yaw: 24 }, lF: { kn: 50 }, lN: { kn: 30 }, aN: { sw: -44, ab: 22, el: 12, hand: 'open' }, aF: { sw: 60, ab: -10, el: 70, hand: 'open' }, face: 'angry', eyes: 'red', flutter: 1.5 }), 'out'],
        [0.16, st({ spine: { lean: 26, yaw: -26 }, root: { x: 0.08 }, lF: { sw: 60, kn: 22 }, lN: { sw: -60, kn: 6, fl: 0.3 }, aN: { sw: 92, ab: 2, el: 0, hand: 'open' }, aF: { sw: -60, ab: 24, el: 20 }, face: 'shout', eyes: 'red', flutter: 3 }), 'snap'],
        [0.3, st({ spine: { lean: 22, yaw: -20 }, root: { x: 0.07 }, lF: { sw: 58, kn: 24 }, lN: { sw: -58, kn: 8, fl: 0.3 }, aN: { sw: 90, ab: 4, el: 4, hand: 'open' }, aF: { sw: -58, ab: 24, el: 20 }, face: 'angry', eyes: 'red', flutter: 2 })],
        [0.5, st({ eyes: 'red' }), 'inout'],
      ],
    },
    // Lion's Barrage rise: crouch, rising kick, flip over into the heel drop (airHeavy)
    specialUp: {
      samples: [0.05, 0.12, 0.2, 0.28, 0.36, 0.44], end: 0.48, phases: [2, 2, 2],
      keys: [
        [0, st()],
        [0.1, st({ root: { y: -0.08 }, spine: { lean: 24 }, lF: { kn: 84 }, lN: { kn: 72 }, aN: { sw: -40, ab: 24, el: 20 }, aF: { sw: 20, ab: 20, el: 60 }, face: 'angry', eyes: 'red' }), 'out'],
        [0.22, st({ root: { y: 0.05 }, spine: { lean: -24 }, lF: { sw: 160, kn: 6, fl: 0 }, lN: { sw: -14, kn: 30, fl: 0 }, aN: { sw: 30, ab: 50, el: 20 }, aF: { sw: -50, ab: 30, el: 20 }, head: { nod: -24 }, face: 'shout', eyes: 'red', flutter: 3 }), 'snap'],
        [0.34, st({ spine: { lean: -12 }, lF: { sw: 128, kn: 24, fl: 0 }, lN: { sw: -24, kn: 46, fl: 0 }, aN: { sw: 50, ab: 40, el: 50 }, aF: { sw: -30, ab: 30, el: 40 }, face: 'angry', eyes: 'red', flutter: 2 })],
        [0.48, st({ spine: { lean: 22 }, lF: { sw: 165, kn: 0, fl: 0 }, lN: { sw: -10, kn: 60, fl: 0 }, aN: { sw: 130, ab: 30, el: 50 }, aF: { sw: 130, ab: -10, el: 50 }, face: 'angry', eyes: 'red', flutter: 2 })],
      ],
    },
    // Sharingan counter: a still, reading stance, hand raised before the face
    specialDown: {
      samples: [0.04, 0.1, 0.2, 0.3], end: 0.34, phases: [2, 1, 1],
      keys: [
        [0, st()],
        [0.1, st({ spine: { lean: 2, yaw: 16 }, head: { nod: 4 }, aN: { sw: 112, ab: 8, el: 58, hand: 'open' }, aF: { sw: -10, ab: 16, el: 30, hand: 'open' }, face: 'angry', eyes: 'red', flutter: 1 }), 'out'],
        [0.34, st({ spine: { lean: 2, yaw: 16 }, head: { nod: 4 }, aN: { sw: 110, ab: 8, el: 60, hand: 'open' }, aF: { sw: -10, ab: 16, el: 30, hand: 'open' }, face: 'angry', eyes: 'red' })],
      ],
    },
    // Amaterasu (his ultimate): the Mangekyō gaze, a hand raised to the eye
    superPose: {
      loop: true, frames: 4, cycle: 0.6,
      keys: [
        [0, st({ spine: { lean: -2, yaw: 18 }, head: { nod: -4, yaw: 6 }, lF: { sw: 10, kn: 8 }, lN: { sw: -10, kn: 6 }, aN: { sw: 128, ab: -16, el: 142, hand: 'open' }, aF: { sw: -6, ab: 14, el: 20 }, face: 'angry', eyes: 'red', flutter: 1.5 })],
        [0.3, st({ spine: { lean: -2, yaw: 18 }, head: { nod: -5, yaw: 6 }, lF: { sw: 10, kn: 10 }, lN: { sw: -10, kn: 8 }, aN: { sw: 129, ab: -16, el: 143, hand: 'open' }, aF: { sw: -6, ab: 14, el: 20 }, face: 'angry', eyes: 'red', flutter: 2.5 })],
      ],
    },
    // Kirin (his SUPER) replaces the beam poses: an arm raised to the storm, then swung down at them
    beamCharge: {
      loop: true, frames: 3, cycle: 0.15,
      keys: [
        [0, st({ spine: { lean: -8, yaw: 18 }, head: { nod: -26 }, lF: { sw: 20, kn: 14 }, lN: { sw: -20, kn: 10 }, aN: { sw: 176, ab: 10, el: 4, hand: 'open' }, aF: { sw: -10, ab: 20, el: 30 }, face: 'angry', eyes: 'red', flutter: 3 })],
        [0.05, st({ spine: { lean: -9, yaw: 18 }, head: { nod: -27 }, lF: { sw: 20, kn: 16 }, lN: { sw: -20, kn: 12 }, aN: { sw: 177, ab: 12, el: 3, hand: 'open' }, aF: { sw: -10, ab: 20, el: 30 }, face: 'angry', eyes: 'red', flutter: 3.5 })],
        [0.1, st({ spine: { lean: -8, yaw: 18 }, head: { nod: -26 }, lF: { sw: 20, kn: 14 }, lN: { sw: -20, kn: 10 }, aN: { sw: 176, ab: 10, el: 4, hand: 'open' }, aF: { sw: -10, ab: 20, el: 30 }, face: 'angry', eyes: 'red', flutter: 3 })],
      ],
    },
    beamFire: {
      loop: true, frames: 3, cycle: 0.15,
      keys: [
        [0, st({ spine: { lean: 20, yaw: -16 }, head: { nod: -6 }, lF: { sw: 40, kn: 30 }, lN: { sw: -40, kn: 12, fl: 0.4 }, aN: { sw: 96, ab: 4, el: 0, hand: 'open' }, aF: { sw: -40, ab: 24, el: 20 }, face: 'shout', eyes: 'red', flutter: 3 })],
        [0.05, st({ spine: { lean: 21, yaw: -16 }, head: { nod: -7 }, lF: { sw: 40, kn: 32 }, lN: { sw: -40, kn: 14, fl: 0.4 }, aN: { sw: 97, ab: 4, el: 0, hand: 'open' }, aF: { sw: -40, ab: 24, el: 20 }, face: 'shout', eyes: 'red', flutter: 3.5 })],
        [0.1, st({ spine: { lean: 20, yaw: -16 }, head: { nod: -6 }, lF: { sw: 40, kn: 30 }, lN: { sw: -40, kn: 12, fl: 0.4 }, aN: { sw: 96, ab: 4, el: 0, hand: 'open' }, aF: { sw: -40, ab: 24, el: 20 }, face: 'shout', eyes: 'red', flutter: 3 })],
      ],
    },
    intro: {
      loop: true, frames: 4, cycle: 0.8,
      keys: [
        [0, st({ spine: { lean: -2, yaw: 18 }, head: { nod: 6, yaw: -8 }, lF: { sw: 10, kn: 6 }, lN: { sw: -10, kn: 4 }, aN: { sw: 52, ab: 8, el: 122, tw: 30 }, aF: { sw: 58, ab: -6, el: 118 }, face: 'smirk', flutter: 0.6 })],
        [0.4, st({ spine: { lean: -2, yaw: 18 }, head: { nod: 8, yaw: -8 }, root: { y: -0.006 }, lF: { sw: 10, kn: 8 }, lN: { sw: -10, kn: 6 }, aN: { sw: 52, ab: 8, el: 122, tw: 30 }, aF: { sw: 58, ab: -6, el: 118 }, face: 'smirk', flutter: 1.2 })],
      ],
    },
    taunt: {
      loop: true, frames: 2, cycle: 0.6,
      keys: [
        [0, st({ spine: { lean: 2, yaw: 10 }, head: { nod: -6 }, aF: { sw: 84, ab: 10, el: 36, hand: 'open' }, aN: { sw: -6, ab: 16, el: 14 }, face: 'angry', eyes: 'red' })],
        [0.3, st({ spine: { lean: 3, yaw: 10 }, head: { nod: -5 }, aF: { sw: 86, ab: 10, el: 34, hand: 'open' }, aN: { sw: -6, ab: 16, el: 14 }, face: 'angry', eyes: 'red', flutter: 1 })],
      ],
    },
    win: {
      loop: true, frames: 4, cycle: 1.0,
      keys: [
        [0, st({ root: { yaw: -40 }, spine: { lean: -2, yaw: -10 }, head: { nod: 10, yaw: 20 }, lF: { sw: 8, kn: 6 }, lN: { sw: -8, kn: 4 }, aN: { sw: 150, ab: 20, el: 46, hand: 'open' }, aF: { sw: -4, ab: 14, el: 14 }, face: 'smirk', flutter: 1 })],
        [0.5, st({ root: { yaw: -40 }, spine: { lean: -2, yaw: -10 }, head: { nod: 12, yaw: 20 }, lF: { sw: 8, kn: 8 }, lN: { sw: -8, kn: 6 }, aN: { sw: 152, ab: 20, el: 44, hand: 'open' }, aF: { sw: -4, ab: 14, el: 14 }, face: 'smirk', flutter: 2 })],
      ],
    },
  };
}

export default {
  id: 'sasuke',
  name: 'SASUKE',
  subtitle: 'Last of the Clan',
  look: 'spiky black hair with a blue sheen swept back, long bangs framing the face, dark eyes, dark blue forehead protector, navy high-collar short-sleeve shirt, white arm warmers, white shorts, white leg wraps, dark sandals',
  color: '#4a7bff',
  aura: [0.25, 0.55, 1.0],
  auraCore: [0.8, 0.92, 1.0],
  // Powering up (ENG-069, src/game/chargeFx.js): dark curse-mark chakra (near-black wisps, a dark shell, black
  // tongues licking up from his back from bar 2), Chidori current crawling over the body, the Sharingan glint
  // (stronger at MAX). No Susanoo.
  charge: {
    palette: { main: '#5a3a8e', core: '#9a7ad8', dark: '#120a1c', spark: '#d8f0ff', eye: '#ff1a2a' },
    bodyTint: 0,
    shell: { kind: 'dark', width: [0.03, 0.065], lift: 0.8, noise: 0.7, speed: 1.4, opacity: [0.45, 0.7] },
    emit: [
      { fx: 'wisp', from: 'back', every: 7, max: 4, scale: [0.3, 0.42], vel: [0, 1.5, 0], color: 'dark', opacity: 0.7 },
      { fx: 'wisp', from: 'back', bar: 1, every: 12, max: 2, scale: [0.28, 0.36], vel: [0, 1.4, 0], color: 'main', opacity: 0.5 },
      { fx: 'flame', from: 'back', bar: 2, every: 8, max: 3, scale: [0.36, 0.5], vel: [0, 1.2, 0], color: 'dark', opacity: 0.6 },
      { fx: 'arc', from: 'body', every: 5, max: 2, scale: [0.14, 0.22], life: 0.08, random: true, spin: true, color: 'spark', glow: 0.5, front: 1 },
    ],
    eyes: { at: [-0.04, 1.36], color: 'eye', bar: 1 },
    ground: { dustEvery: 0, crackAt: 3, rumble: 0.03 },
    bar: { ring: { scale: 1.6, color: 'main', opacity: 0.4 }, burst: null, dust: 0.4, lines: 0.25 },
    max: { ring: { scale: 2.2, color: 'main', opacity: 0.5 }, burst: null, dust: 0.5, flash: 0.08, fx: [{ fx: 'arc', from: 'chest', scale: 0.3, life: 0.08, random: true, spin: true, color: 'spark', glow: 0.5, front: 1 }] },
    sound: 'crackle',
  },
  beam: { core: '#f0fbff', mid: '#62b8ff', edge: '#3a54ff', name: 'LIGHTNING LANCE' },
  specialName: 'CHIDORI',
  projectileName: 'FIREBALL',
  superName: 'KIRIN',
  special: 'chidori',
  projectile: 'fireball',
  // Hebi era; his ultimate is Amaterasu instead of a beam (ADR 0011)
  kit: {
    specials: { neutral: 'chidori', forward: 'chidoriSpear', up: 'lionsBarrage', down: 'sharingan', air: 'fireballAir', airDown: 'lionsBarrageAir' },
    super: 'kirin',
    ultimate: 'amaterasu',
  },
  stats: { speed: 6.2, power: 1.0, defense: 1.0 },
  ground: { style: 'lightning', tint: '#9ad8ff', charge: 'fracture_lightning' }, // floor damage (ground.js, ADR 0024)
  model,
  stance,
  extraAnims,
  runLean: 40,
  portraitFace: 'angry',
  cutinRedEyes: true,
};
