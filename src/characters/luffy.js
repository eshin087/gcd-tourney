// Rubber brawler archetype (Monkey D. Luffy, One Piece, Enies Lobby arc: Gear Second and Gear Third). The
// placeholder sprite sheet is baked from this 3D chibi model at startup; the real art comes from art/characters/luffy/.
// Kit (ADR 0032): Gum-Gum Pistol, Bazooka, Rocket dive, Whip, Gear Second mode, Jet Gatling super and the Gear Third
// Gigant Pistol ultimate (laneStrike: a giant fist down his lane, not a beam). Played as in the anime (ADR 0051): the
// rubber limbs, Gear Second's pink skin (`recolor`), the fist storm and the chibi are data in moves.js.

const model = {
  palette: {
    skin: { base: '#f4c49c', shadow: '#d08a62', light: '#ffe0c6' },
    hair: { base: '#2a2630', shadow: '#141218', light: '#4a4458', hi: '#6a6480' },
    vest: { base: '#d8302a', shadow: '#961a18', light: '#f05a48' },
    shorts: { base: '#3a64b8', shadow: '#203c7a', light: '#5a88dc' },
    cuff: { base: '#f0ece4', shadow: '#bdb6a8', light: '#ffffff' },
    straw: { base: '#f0cc6a', shadow: '#c09a3a', light: '#fff0a8' },
    hatband: { base: '#d8302a', shadow: '#961a18', light: '#f05a48' },
    sandal: { base: '#8a5a34', shadow: '#5a3820', light: '#b07a4a' },
    sole: { base: '#5a3820', shadow: '#3a2414', light: '#7a5434' },
  },
  outfit: {
    pelvis: 'shorts',
    torso: [{ mat: 'skin', y0: -0.05, y1: 0.12 }, { mat: 'vest', y0: 0.11, y1: 0.4 }],
    shoulder: 'vest',
    upperArm: 'skin', foreArm: 'skin', hand: 'skin',
    thigh: 'shorts', shin: 'skin', wrap: 'cuff', foot: 'sandal', toes: 'skin', sole: 'sole',
  },
  hair: {
    mat: 'hair', hairline: 0.28, hairSlope: -0.22, nape: -0.5,
    // short messy black hair, mostly hidden under the hat
    spikes: [
      [40, 30, 0.12, 0.07, 4, 0], [40, -30, 0.12, 0.07, 4, 0], [30, 90, 0.13, 0.07, 4, 6], [30, -90, 0.13, 0.07, 4, 6],
      [24, 150, 0.14, 0.072, 4, 10], [24, -150, 0.14, 0.072, 4, 10], [20, 180, 0.14, 0.072, 4, 12],
    ],
    bangs: [
      [0.19, 0.14, 0.07, 0.8, -0.55, 0.2, 0.12, 0.044], [0.2, 0.14, -0.05, 0.85, -0.5, -0.2, 0.11, 0.042], [0.16, 0.15, 0.15, 0.55, -0.6, 0.5, 0.11, 0.04],
    ],
  },
  face: { iris: '#2a2630', irisDark: '#141218', line: '#1d1420', mouth: '#5a1a22', skinLine: '#b9704f', sclera: '#f6f2f4' },
  // the straw hat: a wide flat brim, a round crown and the red band
  extras({ add, head, HC, P, THREE }) {
    const r = P.headR, y = HC.y + r * 0.62;
    add(head, new THREE.CylinderGeometry(r * 1.85, r * 1.85, 0.02, 28), 'straw', 'hat', { pos: [HC.x - 0.01, y, HC.z] });
    add(head, new THREE.CylinderGeometry(r * 0.92, r * 1.04, r * 0.55, 22), 'straw', 'hat', { pos: [HC.x - 0.01, y + r * 0.27, HC.z] });
    add(head, new THREE.CylinderGeometry(r * 1.045, r * 1.06, r * 0.16, 22, 1, true), 'hatband', 'hat', { pos: [HC.x - 0.01, y + r * 0.08, HC.z], side: THREE.DoubleSide });
  },
};

const stance = {
  root: { yaw: 8 },
  spine: { lean: 10, yaw: 10 },
  head: { nod: -6, yaw: 12 },
  aN: { sw: 50, ab: 24, el: 104 },
  aF: { sw: 60, ab: 16, el: 90 },
  lN: { sw: -26, ab: 12, kn: 22, fl: 0.7, an: -12 },
  lF: { sw: 34, ab: 8, kn: 28 },
};

function extraAnims({ st }) {
  return {
    // Gum-Gum Pistol: the arm wound far back, then the straight punch (the projectile is the stretched fist)
    special: {
      samples: [0.06, 0.16, 0.26, 0.36, 0.46, 0.56, 0.7, 0.86], end: 0.92, phases: [3, 3, 2],
      keys: [
        [0, st()],
        [0.14, st({ spine: { lean: 4, yaw: 40 }, lF: { kn: 30 }, lN: { kn: 26 }, aN: { sw: -60, ab: 20, el: 30 }, aF: { sw: 60, ab: -10, el: 70, hand: 'open' }, face: 'shout', flutter: 1 }), 'out'],
        [0.34, st({ spine: { lean: 16, yaw: -20 }, root: { x: 0.04 }, lF: { sw: 50, kn: 20 }, lN: { sw: -50, kn: 10, fl: 0.4 }, aN: { sw: 92, ab: 2, el: 0 }, aF: { sw: -40, ab: 20, el: 40 }, face: 'shout', flutter: 2 }), 'snap'],
        [0.56, st({ spine: { lean: 14, yaw: -18 }, root: { x: 0.04 }, lF: { sw: 48, kn: 22 }, lN: { sw: -48, kn: 12, fl: 0.4 }, aN: { sw: 90, ab: 4, el: 2 }, aF: { sw: -40, ab: 20, el: 40 }, face: 'shout', flutter: 2 })],
        [0.92, st(), 'inout'],
      ],
    },
    // Gum-Gum Bazooka: both arms stretched back, then both palms shoved forward
    specialForward: {
      samples: [0.05, 0.14, 0.24, 0.32, 0.42, 0.52, 0.62], end: 0.66, phases: [2, 2, 3],
      keys: [
        [0, st()],
        [0.12, st({ root: { y: -0.05 }, spine: { lean: -6, yaw: 0 }, lF: { kn: 50 }, lN: { kn: 40 }, aN: { sw: -80, ab: 20, el: 10, hand: 'open' }, aF: { sw: -80, ab: 20, el: 10, hand: 'open' }, face: 'shout', flutter: 2 }), 'out'],
        [0.26, st({ spine: { lean: 26, yaw: 0 }, root: { x: 0.1 }, lF: { sw: 62, kn: 24 }, lN: { sw: -60, kn: 6, fl: 0.3 }, aN: { sw: 92, ab: 4, el: 0, hand: 'palm' }, aF: { sw: 92, ab: -4, el: 0, hand: 'palm' }, face: 'shout', flutter: 3 }), 'snap'],
        [0.42, st({ spine: { lean: 24, yaw: 0 }, root: { x: 0.09 }, lF: { sw: 60, kn: 26 }, lN: { sw: -58, kn: 8, fl: 0.3 }, aN: { sw: 90, ab: 6, el: 2, hand: 'palm' }, aF: { sw: 90, ab: -6, el: 2, hand: 'palm' }, face: 'shout', flutter: 2.5 })],
        [0.66, st(), 'inout'],
      ],
    },
    // Gum-Gum Rocket: crouched low with the arms stretched back, slingshot up, turn over into the drop (airHeavy)
    specialUp: {
      samples: [0.05, 0.12, 0.2, 0.28, 0.36, 0.44], end: 0.48, phases: [2, 2, 2],
      keys: [
        [0, st()],
        [0.1, st({ root: { y: -0.1 }, spine: { lean: 30 }, lF: { kn: 90 }, lN: { kn: 80 }, aN: { sw: -100, ab: 30, el: 10, hand: 'open' }, aF: { sw: -100, ab: 30, el: 10, hand: 'open' }, face: 'shout' }), 'out'],
        [0.22, st({ root: { y: 0.06 }, spine: { lean: -10 }, lF: { sw: 10, kn: 20, fl: 0 }, lN: { sw: -10, kn: 30, fl: 0 }, aN: { sw: 170, ab: 20, el: 0 }, aF: { sw: 170, ab: -20, el: 0 }, head: { nod: -20 }, face: 'shout', flutter: 3 }), 'snap'],
        [0.34, st({ spine: { lean: 0 }, lF: { sw: 30, kn: 50, fl: 0 }, lN: { sw: -20, kn: 60, fl: 0 }, aN: { sw: 150, ab: 30, el: 30 }, aF: { sw: 150, ab: -30, el: 30 }, face: 'grin', flutter: 2 })],
        [0.48, st({ spine: { lean: 20 }, lF: { sw: 160, kn: 0, fl: 0 }, lN: { sw: -10, kn: 60, fl: 0 }, aN: { sw: 140, ab: 20, el: 40 }, aF: { sw: 140, ab: -10, el: 40 }, face: 'angry', flutter: 2 })],
      ],
    },
    // Gum-Gum Whip: a low sweeping kick, the leg stretched far out along the floor
    specialDown: {
      samples: [0.05, 0.14, 0.24, 0.34], end: 0.4, phases: [2, 1, 1],
      keys: [
        [0, st()],
        [0.12, st({ root: { y: -0.12 }, spine: { lean: 30, yaw: 30 }, lF: { sw: -30, kn: 90 }, lN: { kn: 90 }, aN: { sw: 40, ab: 40, el: 40 }, aF: { sw: 20, ab: 40, el: 40 }, face: 'shout' }), 'out'],
        [0.24, st({ root: { y: -0.16 }, spine: { lean: 40, yaw: -30 }, lF: { sw: 90, ab: 10, kn: 0, fl: 0 }, lN: { sw: -10, kn: 100 }, aN: { sw: 20, ab: 60, el: 20, hand: 'open' }, aF: { sw: 40, ab: 50, el: 30, hand: 'open' }, face: 'shout', flutter: 2 }), 'snap'],
        [0.4, st({ root: { y: -0.06 }, spine: { lean: 20 }, lF: { kn: 50 }, lN: { kn: 50 }, face: 'angry', flutter: 1 }), 'inout'],
      ],
    },
    // Jet Gatling stance: Gear Second steam, both fists cocked
    superPose: {
      loop: true, frames: 4, cycle: 0.4,
      keys: [
        [0, st({ root: { y: -0.06 }, spine: { lean: 20, yaw: 10 }, lF: { kn: 60 }, lN: { kn: 50 }, aN: { sw: 40, ab: 20, el: 120 }, aF: { sw: 30, ab: 20, el: 120 }, head: { nod: -10 }, face: 'shout', flutter: 3 })],
        [0.2, st({ root: { y: -0.07 }, spine: { lean: 21, yaw: 10 }, lF: { kn: 62 }, lN: { kn: 52 }, aN: { sw: 42, ab: 20, el: 122 }, aF: { sw: 32, ab: 20, el: 122 }, head: { nod: -11 }, face: 'shout', flutter: 4 })],
      ],
    },
    intro: {
      loop: true, frames: 4, cycle: 0.8,
      keys: [
        [0, st({ spine: { lean: 0, yaw: 14 }, lF: { sw: 14, kn: 10 }, lN: { sw: -12, kn: 8 }, aN: { sw: 150, ab: 10, el: 120, hand: 'open' }, aF: { sw: 40, ab: 20, el: 100 }, head: { nod: -6 }, face: 'grin', flutter: 1 })],
        [0.4, st({ spine: { lean: 1, yaw: 14 }, root: { y: -0.01 }, lF: { sw: 14, kn: 12 }, lN: { sw: -12, kn: 10 }, aN: { sw: 152, ab: 10, el: 122, hand: 'open' }, aF: { sw: 40, ab: 20, el: 102 }, head: { nod: -7 }, face: 'grin', flutter: 2 })],
      ],
    },
    taunt: {
      loop: true, frames: 2, cycle: 0.5,
      keys: [
        [0, st({ spine: { lean: -4, yaw: 20 }, aN: { sw: 80, ab: 10, el: 20 }, aF: { sw: -4, ab: 20, el: 30 }, head: { nod: -8 }, face: 'grin' })],
        [0.25, st({ spine: { lean: -5, yaw: 20 }, root: { y: 0.01 }, aN: { sw: 84, ab: 10, el: 16 }, aF: { sw: -4, ab: 20, el: 30 }, head: { nod: -10 }, face: 'grin', flutter: 1 })],
      ],
    },
    win: {
      loop: true, frames: 6, cycle: 0.9,
      keys: [
        [0, st({ spine: { lean: -6, yaw: 20 }, lF: { sw: 12, kn: 10 }, lN: { sw: -10, kn: 8 }, aN: { sw: 176, ab: 14, el: 4 }, aF: { sw: 176, ab: -14, el: 4 }, head: { nod: -14 }, face: 'grin', flutter: 1 })],
        [0.3, st({ root: { y: 0.14 }, spine: { lean: -10, yaw: 20 }, lF: { sw: 40, kn: 80, fl: 0 }, lN: { sw: -10, kn: 60, fl: 0 }, aN: { sw: 178, ab: 20, el: 2 }, aF: { sw: 178, ab: -20, el: 2 }, head: { nod: -18 }, face: 'grin', flutter: 2 })],
        [0.6, st({ spine: { lean: -6, yaw: 20 }, lF: { sw: 12, kn: 10 }, lN: { sw: -10, kn: 8 }, aN: { sw: 176, ab: 14, el: 4 }, aF: { sw: 176, ab: -14, el: 4 }, head: { nod: -14 }, face: 'grin', flutter: 1 })],
      ],
    },
  };
}

export default {
  id: 'luffy',
  name: 'LUFFY',
  subtitle: 'Rubber Pirate Captain',
  look: 'straw hat with a red band, messy short black hair, black eyes, a small scar under the left eye, wiry build, open red short-sleeveless vest, blue knee-length shorts with white fur cuffs, yellow sash, straw sandals, pink Gear Second steam',
  color: '#e8402a',
  aura: [1.0, 0.55, 0.5],
  auraCore: [1.0, 0.9, 0.88],
  // Powering up (ADR 0023, src/game/chargeFx.js): Gear Second, the skin flushing pink and steam pouring off him.
  charge: {
    palette: { main: '#ffd0d0', core: '#ffffff', edge: '#ff8a8a', pebble: '#9c8a74' },
    bodyTint: 0.06, tint: 'edge',
    shell: { kind: 'shimmer', color: 'edge', core: 'main', width: [0.02, 0.05], opacity: [0.3, 0.5] },
    emit: [
      { fx: 'wisp', from: 'body', every: 6, max: 4, scale: [0.3, 0.45], vel: [0, 1.4, 0], color: 'core', opacity: 0.45 },
      { fx: 'wisp', from: 'body', bar: 2, every: 5, max: 3, scale: [0.35, 0.5], vel: [0, 1.8, 0], color: 'main', opacity: 0.5 },
      { fx: 'star', frame: 3, from: 'floor', every: 14, max: 3, scale: [0.14, 0.2], vel: [0, [1.0, 2.0], 0], life: 0.8, color: 'pebble', opacity: 1 },
    ],
    ground: { dustEvery: 30, crackAt: 3, rumble: 0.03 },
    bar: { ring: { scale: 1.6, color: 'main', opacity: 0.4 }, burst: { scale: 0.8 } },
    max: { ring: { scale: 2.2, color: 'edge', opacity: 0.45 }, burst: { scale: 1.0 }, flash: 0.06 },
    sound: 'boil',
  },
  // Palette swaps on the drawn body (ENG-SKL-LUF, the sprite shader's `recolor`): a mode or super names one. Gear Second
  // flushes his skin pink in every animation: his packed sheet's exact skin colours (light to deep shadow, then the
  // blush) to the pinks of his approved Gear Second `charge` frames. The placeholder bake has none of these colours,
  // so it stays as it is.
  recolor: {
    gear2: [
      ['#fcc081', '#f99a96'], ['#fbba79', '#f5958d'], ['#fbb675', '#f28981'], ['#f9b171', '#f28981'],
      ['#f4a57b', '#f07174'], ['#dc8440', '#d8655f'], ['#c97c45', '#b85450'],
    ],
  },
  // the shared beam's palette, used only by his beam-clash streams; his ultimate is the Gigant Pistol
  beam: { core: '#ffffff', mid: '#ffb0a0', edge: '#e8402a', name: 'GIGANT PISTOL' },
  specialName: 'GUM-GUM PISTOL',
  projectileName: 'GUM-GUM PISTOL',
  superName: 'GEAR SECOND: JET GATLING',
  kit: {
    // ↓ is Gear Second (ADR 0011 keeps ↓ for modes and counters), so the Whip sits on ←
    specials: { neutral: 'gumPistol', forward: 'gumBazooka', up: 'gumRocket', down: 'gearSecond', back: 'gumWhip', air: 'gumPistolAir', airDown: 'gumRocketAir' },
    super: 'jetGatling',
    ultimate: 'gigantPistol', // a giant fist down his lane, not a beam (ADR 0032)
  },
  stats: { speed: 6.1, power: 1.0, defense: 1.0 }, // stat index 0.98 (ADR 0011)
  // floor damage (ground.js, ADR 0024): plain stone craters (rubber, no element)
  ground: { style: 'stone', tint: '#e8402a' },
  model,
  stance,
  extraAnims,
  portraitFace: 'angry',
  selectFacing: 'right',
};
