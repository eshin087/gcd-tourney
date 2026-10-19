// Limitless-sorcerer archetype (Gojo, Jujutsu Kaisen). The placeholder sprite sheet is baked
// from this 3D chibi model at startup; the real art comes from art/characters/gojo/.
// Blindfold in every sprite; the Six Eyes show only on the super pose and the cut-in.
// Kit (ADR 0009): Lapse: Blue pull, Reversal: Red blast, Blink teleport, Infinity counter,
// Infinity passive, Hollow Purple orb, Domain Expansion: Unlimited Void super. Their anime look (ENG-SKL-GOJ) is data on
// the moves (moves.js) and art/characters/gojo/SKILLS_REVAMP.md.

const model = {
  // the tallest fighter: longer legs and torso, smaller head
  props: {
    thigh: 0.27, shin: 0.258, torso: 0.37, spineUp: 0.045, shoulderW: 0.178, upper: 0.182, fore: 0.166,
    armR: [0.06, 0.052], foreR: [0.054, 0.045], thighR: [0.094, 0.074], shinR: [0.07, 0.054], headR: 0.238, hand: 1.15,
  },
  palette: {
    skin: { base: '#fbe2d2', shadow: '#e2ae96', light: '#fff4ec' },
    hair: { base: '#f2f4fa', shadow: '#b4bccf', light: '#ffffff', hi: '#ffffff' },
    jacket: { base: '#1c2034', shadow: '#0d0f1c', light: '#323858' },
    pants: { base: '#1a1d30', shadow: '#0c0e1a', light: '#2e3352' },
    shoe: { base: '#141420', shadow: '#08080e', light: '#2a2a3c' },
    band: { base: '#16161e', shadow: '#08080c', light: '#2c2c3a' },
    sole: { base: '#2a2a34', shadow: '#16161c', light: '#40404c' },
    metal: { base: '#c8cede', shadow: '#8890a6', light: '#eef2fa', hi: '#ffffff' },
  },
  outfit: {
    pelvis: 'pants',
    torso: [{ mat: 'jacket', y0: -0.08, y1: 0.4 }],
    collar: 'high', collarMat: 'jacket',
    shoulder: 'jacket',
    upperArm: 'jacket', foreArm: 'jacket', hand: 'skin',
    thigh: 'pants', shin: 'pants', foot: 'shoe', sole: 'sole',
  },
  hair: {
    mat: 'hair', hairline: 0.32, hairSlope: -0.18, nape: -0.5, capScale: 1.05,
    // swept up and back over the blindfold
    spikes: [
      [88, 0, 0.2, 0.08, 5, -10], [80, 40, 0.21, 0.08, 5, 0], [80, -40, 0.21, 0.08, 5, 0], [76, 90, 0.2, 0.08, 5, 8], [76, -90, 0.2, 0.08, 5, 8],
      [72, 140, 0.19, 0.078, 5, 14], [72, -140, 0.19, 0.078, 5, 14], [64, 180, 0.18, 0.076, 5, 18], [66, 20, 0.18, 0.076, 5, -14], [66, -20, 0.18, 0.076, 5, -14],
      [56, 65, 0.16, 0.07, 5, 0], [56, -65, 0.16, 0.07, 5, 0], [50, 120, 0.15, 0.068, 5, 6], [50, -120, 0.15, 0.068, 5, 6], [44, 165, 0.14, 0.066, 5, 10],
    ],
    // a few strands falling over the blindfold
    bangs: [
      [0.2, 0.16, 0.05, 0.75, -0.4, 0.15, 0.1, 0.04], [0.2, 0.16, -0.05, 0.75, -0.42, -0.15, 0.09, 0.038],
    ],
  },
  blindfold: { mat: 'band', y: -0.035, h: 0.11, r: 1.07 },
  face: { iris: '#5fe2ff', irisDark: '#1f8ee8', line: '#16121c', mouth: '#5a1a22', skinLine: '#cc9a84', sclera: '#f6f2f4', whiskers: false, symbol: '#3a3448' },
};

// relaxed and upright, hands low (pockets energy), chin up
const stance = {
  spine: { lean: 2, yaw: 10 },
  head: { nod: 4, yaw: 14 },
  aF: { sw: 30, ab: 14, el: 50, hand: 'open' },
  aN: { sw: -12, ab: 16, el: 34 },
  lF: { sw: 22, ab: 6, kn: 14 },
  lN: { sw: -20, ab: 8, kn: 10, fl: 0.7, an: -10 },
};

function extraAnims({ st }) {
  return {
    // Lapse: Blue: two fingers raised forward (the engine draws the vortex in front)
    special: {
      samples: [0.04, 0.12, 0.2, 0.3, 0.4, 0.5], end: 0.56, phases: [2, 1, 3],
      keys: [
        [0, st()],
        [0.12, st({ spine: { lean: 4, yaw: 20 }, aN: { sw: 84, ab: 8, el: 30, hand: 'open' }, aF: { sw: -10, ab: 16, el: 40 }, head: { nod: -2 }, face: 'smirk', flutter: 1 }), 'out'],
        [0.2, st({ spine: { lean: 6, yaw: -10 }, root: { x: 0.03 }, aN: { sw: 92, ab: 4, el: 4, hand: 'open' }, aF: { sw: -14, ab: 16, el: 40 }, face: 'smirk', flutter: 1.5 }), 'snap'],
        [0.56, st(), 'inout'],
      ],
    },
    // Reversal: Red: hand drawn back, flicked forward, recoil
    specialForward: {
      samples: [0.04, 0.1, 0.16, 0.22, 0.3, 0.38, 0.46], end: 0.5, phases: [2, 2, 3],
      keys: [
        [0, st()],
        [0.1, st({ spine: { lean: -4, yaw: 28 }, aN: { sw: 40, ab: 30, el: 100, hand: 'open' }, aF: { sw: 20, ab: 10, el: 40 }, face: 'angry', flutter: 1.5 }), 'out'],
        [0.16, st({ spine: { lean: 10, yaw: -20 }, root: { x: 0.05 }, lF: { sw: 40, kn: 24 }, lN: { sw: -40, kn: 10 }, aN: { sw: 94, ab: 2, el: 0, hand: 'palm' }, aF: { sw: -30, ab: 20, el: 30 }, face: 'shout', flutter: 3 }), 'snap'],
        [0.3, st({ spine: { lean: -6, yaw: -10 }, root: { x: -0.02 }, aN: { sw: 70, ab: 10, el: 30, hand: 'open' }, aF: { sw: -20, ab: 20, el: 30 }, face: 'smirk', flutter: 1.5 }), 'out'],
        [0.5, st(), 'inout'],
      ],
    },
    // Infinity: an open palm raised, perfectly calm
    specialDown: {
      samples: [0.04, 0.1, 0.2, 0.3], end: 0.34, phases: [2, 1, 1],
      keys: [
        [0, st()],
        [0.1, st({ spine: { lean: -2, yaw: 18 }, head: { nod: 6 }, aN: { sw: 96, ab: 6, el: 10, hand: 'palm' }, aF: { sw: -14, ab: 16, el: 30 }, face: 'smirk', flutter: 1 }), 'out'],
        [0.34, st({ spine: { lean: -2, yaw: 18 }, head: { nod: 6 }, aN: { sw: 94, ab: 6, el: 12, hand: 'palm' }, aF: { sw: -14, ab: 16, el: 30 }, face: 'smirk' })],
      ],
    },
    // Domain Expansion hand sign: blindfold lifted, Six Eyes open
    superPose: {
      loop: true, frames: 4, cycle: 0.6,
      keys: [
        [0, st({ spine: { lean: 0, yaw: 18 }, head: { nod: 2 }, aN: { sw: 70, ab: 30, el: 100, hand: 'open' }, aF: { sw: 66, ab: -20, el: 104, hand: 'open' }, face: 'smirk', eyes: 'six', blindfold: false, flutter: 1.5 })],
        [0.3, st({ spine: { lean: 0, yaw: 18 }, head: { nod: 3 }, aN: { sw: 72, ab: 30, el: 98, hand: 'open' }, aF: { sw: 68, ab: -20, el: 102, hand: 'open' }, face: 'smirk', eyes: 'six', blindfold: false, flutter: 2.5 })],
      ],
    },
    intro: {
      loop: true, frames: 4, cycle: 1.0,
      keys: [
        [0, st({ spine: { lean: -4, yaw: 14 }, head: { nod: 8, yaw: -10 }, lF: { sw: 8, kn: 4 }, lN: { sw: -8, kn: 4 }, aN: { sw: -6, ab: 14, el: 40 }, aF: { sw: -4, ab: 12, el: 40 }, face: 'smirk', flutter: 0.6 })],
        [0.5, st({ spine: { lean: -4, yaw: 14 }, head: { nod: 10, yaw: -10 }, root: { y: -0.005 }, lF: { sw: 8, kn: 6 }, lN: { sw: -8, kn: 6 }, aN: { sw: -6, ab: 14, el: 42 }, aF: { sw: -4, ab: 12, el: 42 }, face: 'smirk', flutter: 1 })],
      ],
    },
    taunt: {
      loop: true, frames: 2, cycle: 0.6,
      keys: [
        [0, st({ spine: { lean: -6, yaw: 18 }, head: { nod: 10 }, aN: { sw: 150, ab: 20, el: 30, hand: 'open' }, aF: { sw: -6, ab: 14, el: 40 }, face: 'grin' })],
        [0.3, st({ spine: { lean: -6, yaw: 18 }, head: { nod: 11 }, aN: { sw: 156, ab: 26, el: 26, hand: 'open' }, aF: { sw: -6, ab: 14, el: 40 }, face: 'grin', flutter: 1 })],
      ],
    },
    win: {
      loop: true, frames: 4, cycle: 1.0,
      keys: [
        [0, st({ root: { yaw: -30 }, spine: { lean: -4, yaw: -8 }, head: { nod: 8, yaw: 16 }, lF: { sw: 8, kn: 6 }, lN: { sw: -8, kn: 4 }, aN: { sw: 150, ab: 14, el: 110, hand: 'open' }, aF: { sw: -6, ab: 14, el: 40 }, face: 'grin', flutter: 1 })],
        [0.5, st({ root: { yaw: -30 }, spine: { lean: -4, yaw: -8 }, head: { nod: 10, yaw: 16 }, lF: { sw: 8, kn: 8 }, lN: { sw: -8, kn: 6 }, aN: { sw: 152, ab: 14, el: 108, hand: 'open' }, aF: { sw: -6, ab: 14, el: 40 }, face: 'grin', flutter: 2 })],
      ],
    },
  };
}

export default {
  id: 'gojo',
  name: 'GOJO',
  subtitle: 'The Strongest',
  look: 'tall, spiky white hair swept up over a black blindfold, dark navy high-collar jujutsu uniform, dark pants and shoes; bright blue Six Eyes on supers',
  color: '#7ac8ff',
  aura: [0.45, 0.72, 1.0],
  auraCore: [0.9, 0.96, 1.0],
  // Powering up (ENG-069, src/game/chargeFx.js): almost nothing shows. A faint Infinity shimmer on his outline,
  // pebbles that lift and stop dead in mid-air, a faint space ripple now and then, the Six Eyes glint at MAX. No
  // rumble, dust, cracks or screen flash.
  charge: {
    palette: { main: '#8fd0ff', core: '#e8f8ff', pebble: '#8a7560', eye: '#7fe8ff' },
    bodyTint: 0,
    shell: { kind: 'shimmer', width: [0.016, 0.026], lift: 0, noise: 0, speed: 0.8, opacity: [0.2, 0.3] },
    emit: [
      { fx: 'wisp', from: 'body', every: 18, max: 2, scale: [0.22, 0.3], vel: [0, 0.6, 0], color: 'main', opacity: 0.3 },
      { fx: 'ripple', from: 'chest', bar: 1, every: 180, max: 1, scale: 0.9, life: 0.5, fade: true, color: 'core', opacity: 0.2 },
      { fx: 'star', frame: 3, from: 'floor', every: 15, max: 4, scale: [0.18, 0.24], vel: [0, [1.0, 1.4], 0], drag: 0.04, life: 1.8, fade: true, color: 'pebble', opacity: 1 },
    ],
    eyes: { at: [0.02, 1.48], color: 'eye', bar: 3 },
    ground: { dustEvery: 0, crackAt: 0, rumble: 0 },
    bar: { ring: null, ripple: 1.0, burst: null, dust: 0, flash: 0, lines: 0, shake: 0, punch: 0.12 },
    max: { ring: null, ripple: 1.6, burst: null, dust: 0, flash: 0, lines: 0, shake: 0, punch: 0.12 },
    sound: 'calm',
  },
  beam: { core: '#ffffff', mid: '#b46cff', edge: '#6a2cd8', name: 'HOLLOW PURPLE', width: 1.85 },
  specialName: 'LAPSE: BLUE',
  projectileName: 'REVERSAL: RED',
  superName: 'UNLIMITED VOID',
  kit: {
    specials: { neutral: 'blue', forward: 'red', up: 'blink', down: 'infinity', air: 'redAir' },
    super: 'unlimitedVoid',
    ultimate: 'hollowPurple', // an orb, not a beam (ADR 0017)
    passive: 'infinity',
  },
  stats: { speed: 6.0, power: 1.0, defense: 1.0 }, // stat index 0.97; Infinity is his edge (ADR 0011)
  // floor damage (ground.js, ADR 0024): glass-like cursed fractures; charge false: Infinity keeps the floor still
  // while he powers up (no cracks)
  ground: { style: 'cursed', tint: '#b46cff', charge: false },
  // Hollow Purple's merge (ENG-SKL-GOJ, kit.js mergeLook): the drawn palms that hold Red (near) and Blue (far) on each
  // beamCharge frame, final-cell pixels measured by Claude on the packed strip (`_v`: re-measure when it changes);
  // `meet`, where the drawn merge brings them together (Purple forms there); `eyes`: where the Six Eyes glint as the
  // merge starts (v04 f1). v04 measured on the packed strip (auto head fit x0.8562), 2026-10-18
  hands: {
    beamCharge: {
      _v: 4, near: [[64, 108], [172, 101], [146, 120], [144, 120]], far: [[206, 111], [193, 113], [159, 120], [158, 119]], meet: [151, 114], eyes: [140, 75],
    },
  },
  model,
  stance,
  extraAnims,
  runLean: 30,
  portraitFace: 'smirk',
  cutinEyes: 'six', // the cut-in shows the eyes under the blindfold
  selectFacing: 'right', // which way art/characters/gojo/ui/select faces (char select mirrors it per side)
};
