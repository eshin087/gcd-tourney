// Orange fox-ninja archetype (Naruto vibe). The placeholder sprite sheet is baked
// from this 3D chibi model at startup; drop public/characters/naruto/sheet.png +
// anims.json to replace it with hand-made / AI-generated art (see ASSETS.md).

const model = {
  palette: {
    skin: { base: '#f8c69b', shadow: '#d98a66', light: '#ffe2c6' },
    hair: { base: '#ffc935', shadow: '#e0861c', light: '#ffe36a', hi: '#fff6c2' },
    jacket: { base: '#f88320', shadow: '#c44d14', light: '#ffac48' },
    pants: { base: '#f07a1e', shadow: '#b9461a', light: '#ffa040' },
    black: { base: '#2b2c42', shadow: '#17182a', light: '#474a72' },
    white: { base: '#f1eef6', shadow: '#bbb5cc', light: '#ffffff' },
    sandal: { base: '#2d55b4', shadow: '#1b3376', light: '#5a88e2' },
    band: { base: '#25306e', shadow: '#141a46', light: '#3e4fa0' },
    metal: { base: '#b8c2d2', shadow: '#76829a', light: '#e4eaf4', hi: '#ffffff' },
    sole: { base: '#3b2b2a', shadow: '#241818', light: '#5a4440' },
  },
  outfit: {
    pelvis: 'pants',
    torso: [{ mat: 'jacket', y0: -0.05, y1: 0.25 }, { mat: 'black', y0: 0.235, y1: 0.4 }],
    collar: 'ring', collarMat: 'white',
    shoulder: 'black',
    upperArm: 'jacket', foreArm: 'jacket', hand: 'skin',
    thigh: 'pants', shin: 'pants', pantsCuff: true, foot: 'sandal', toes: 'skin', sole: 'sole',
  },
  hair: {
    mat: 'hair', hairline: 0.3, hairSlope: -0.25, nape: -0.55,
    // [elevation, azimuth, length, radius, sides, tiltBack]
    spikes: [
      [84, 0, 0.17, 0.076, 5, 10], [72, 55, 0.19, 0.078, 5, 12], [72, -55, 0.19, 0.078, 5, 12], [70, 135, 0.21, 0.08, 5, 18], [70, -135, 0.21, 0.08, 5, 18],
      [50, 22, 0.15, 0.07, 5, 0], [48, 92, 0.2, 0.078, 5, 8], [48, -92, 0.2, 0.078, 5, 8], [44, 150, 0.22, 0.08, 5, 14], [44, -150, 0.22, 0.08, 5, 14], [52, 180, 0.2, 0.078, 5, 18],
      [22, 118, 0.18, 0.07, 5, 8], [22, -118, 0.18, 0.07, 5, 8], [16, 165, 0.19, 0.07, 5, 10], [16, -165, 0.19, 0.07, 5, 10], [28, 72, 0.13, 0.06, 4, 0], [28, -72, 0.13, 0.06, 4, 0],
    ],
    // [x, y, z, dirX, dirY, dirZ, length, radius]
    bangs: [
      [0.19, 0.15, 0.07, 0.8, -0.5, 0.25, 0.13, 0.048], [0.2, 0.15, -0.05, 0.85, -0.45, -0.25, 0.12, 0.046], [0.15, 0.16, 0.16, 0.55, -0.55, 0.6, 0.12, 0.042], [0.15, 0.16, -0.16, 0.55, -0.55, -0.6, 0.11, 0.04],
    ],
  },
  headband: { band: 'band', plate: 'metal', y: 0.07, tilt: 5, tails: true },
  face: { iris: '#2f86ec', irisDark: '#1a3f8e', line: '#1d1420', mouth: '#5a1a22', skinLine: '#b9704f', sclera: '#f6f2f4', whiskers: true, symbol: '#3a3448' },
};

const stance = {
  root: { yaw: 6 },
  spine: { lean: 8, yaw: 8 },
  head: { nod: -4, yaw: 12 },
  aN: { sw: 40, ab: 30, el: 116 },
  aF: { sw: 64, ab: 14, el: 76 },
  lN: { sw: -22, ab: 9, kn: 14, fl: 0.7, an: -12 },
  lF: { sw: 30, ab: 6, kn: 22 },
};

function extraAnims({ st, pose }) {
  const runL = (k) => ({ lF: { sw: 52 - k * 100, kn: 30 + k * 40 }, lN: { sw: -54 + k * 100, kn: 40 - k * 10, fl: 0.4 } });
  return {
    // Rasengan: form the orb in both hands, run in, thrust
    special: {
      samples: [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.84, 0.95], end: 1.02, phases: [3, 3, 2], smear: { 5: ['handN'] },
      keys: [
        [0, st()],
        [0.1, st({ spine: { lean: 16 }, lF: { kn: 46 }, lN: { kn: 36 }, aN: { sw: 72, ab: 22, el: 42, hand: 'palm' }, aF: { sw: 80, ab: -14, el: 58, hand: 'open' }, face: 'shout', flutter: 1.5 }), 'out'],
        [0.3, st({ spine: { lean: 18 }, root: { x: 0.01 }, lF: { kn: 48 }, lN: { kn: 38 }, aN: { sw: 74, ab: 22, el: 40, hand: 'palm' }, aF: { sw: 82, ab: -14, el: 56, hand: 'open' }, face: 'shout', flutter: 2 })],
        [0.44, st({ spine: { lean: 32 }, head: { nod: -20 }, ...runL(0), aN: { sw: 86, ab: 6, el: 4, hand: 'palm' }, aF: { sw: -100, ab: 18, el: 12 }, face: 'shout', flutter: 2.5 }), 'out'],
        [0.58, st({ spine: { lean: 32 }, head: { nod: -20 }, ...runL(1), aN: { sw: 86, ab: 6, el: 4, hand: 'palm' }, aF: { sw: -100, ab: 18, el: 12 }, face: 'shout', flutter: 2.5 }), 'linear'],
        [0.7, st({ spine: { lean: 28, yaw: -26 }, root: { x: 0.08 }, lF: { sw: 62, kn: 20 }, lN: { sw: -60, kn: 6, fl: 0.3 }, aN: { sw: 94, ab: 2, el: 0, hand: 'palm' }, aF: { sw: -80, ab: 24, el: 14 }, face: 'shout', flutter: 3 }), 'snap'],
        [1.0, st(), 'inout'],
      ],
    },
    intro: {
      loop: true, frames: 4, cycle: 0.6,
      keys: [
        [0, st({ spine: { lean: 4, yaw: 16 }, lF: { sw: 14, kn: 10 }, lN: { sw: -12, kn: 8 }, aN: { sw: 46, ab: 16, el: 122, hand: 'open' }, aF: { sw: 52, ab: -16, el: 116, hand: 'open' }, face: 'angry', flutter: 1 })],
        [0.3, st({ spine: { lean: 6, yaw: 16 }, root: { y: -0.01 }, lF: { sw: 14, kn: 14 }, lN: { sw: -12, kn: 12 }, aN: { sw: 47, ab: 16, el: 122, hand: 'open' }, aF: { sw: 53, ab: -16, el: 116, hand: 'open' }, face: 'angry', flutter: 2 })],
      ],
    },
    taunt: {
      loop: true, frames: 2, cycle: 0.5,
      keys: [
        [0, st({ spine: { lean: -6, yaw: 22 }, lF: { sw: 16, kn: 8 }, lN: { sw: -14, kn: 6 }, aN: { sw: 96, ab: 10, el: 4 }, aF: { sw: 20, ab: 30, el: 110 }, head: { nod: -8 }, face: 'grin' })],
        [0.25, st({ spine: { lean: -7, yaw: 22 }, root: { y: 0.01 }, lF: { sw: 16, kn: 8 }, lN: { sw: -14, kn: 6 }, aN: { sw: 98, ab: 10, el: 2 }, aF: { sw: 20, ab: 30, el: 112 }, head: { nod: -10 }, face: 'grin' })],
      ],
    },
    win: {
      loop: true, frames: 6, cycle: 0.9,
      keys: [
        [0, st({ spine: { lean: -6, yaw: 20 }, lF: { sw: 12, kn: 10 }, lN: { sw: -10, kn: 8 }, aN: { sw: 176, ab: 14, el: 4 }, aF: { sw: 16, ab: 26, el: 100 }, head: { nod: -14 }, face: 'grin', flutter: 1 })],
        [0.3, st({ root: { y: 0.12 }, spine: { lean: -10, yaw: 20 }, lF: { sw: 40, kn: 80, fl: 0 }, lN: { sw: -10, kn: 60, fl: 0 }, aN: { sw: 178, ab: 14, el: 2 }, aF: { sw: 20, ab: 40, el: 90 }, head: { nod: -18 }, face: 'grin', flutter: 2 })],
        [0.6, st({ spine: { lean: -6, yaw: 20 }, lF: { sw: 12, kn: 10 }, lN: { sw: -10, kn: 8 }, aN: { sw: 176, ab: 14, el: 4 }, aF: { sw: 16, ab: 26, el: 100 }, head: { nod: -14 }, face: 'grin', flutter: 1 })],
      ],
    },
  };
  void pose;
}

export default {
  id: 'naruto',
  name: 'NARUTO',
  subtitle: 'Orange Hokage-to-be',
  look: 'spiky blonde hair, blue eyes, three whisker marks on each cheek, dark blue forehead protector with a metal plate, orange jumpsuit with black shoulders, blue sandals',
  color: '#ff8a1c',
  aura: [1.0, 0.55, 0.12],
  auraCore: [1.0, 0.92, 0.55],
  beam: { core: '#fff6d8', mid: '#ffb43a', edge: '#ff6a10', name: 'RASEN CANNON' },
  specialName: 'RASENGAN',
  projectileName: 'SHURIKEN',
  special: 'rasengan',
  projectile: 'shuriken',
  stats: { speed: 5.9, power: 1.0, defense: 1.0 },
  model,
  stance,
  extraAnims,
  portraitFace: 'angry',
};
