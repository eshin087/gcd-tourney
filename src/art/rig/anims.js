// Keyframed animation library for the 3D rig (DBFZ-style moveset).
// Each anim: keys [[time, pose, ease]], then either
//   loop + frames + cycle  (evenly sampled loop), or
//   samples [t...] (+ phases [startup, active, recovery] for attacks, + smear {frameIdx: [limbs]}).
import { pose } from './pose.js';

const range = (n) => Array.from({ length: n }, (_, i) => i);

// Ninja-run leg for phase th (radians)
function runLeg(th) {
  const sw = 6 + 50 * Math.sin(th);
  const c = Math.max(0, Math.cos(th + 0.35));
  const kn = 20 + 85 * c * c;
  return { sw, kn, fl: 0.4, an: -12 };
}

export function buildAnims(C) {
  const S = C.stance;
  const st = (o = {}) => pose(S, o);
  const air = (o = {}) => pose(S, { lF: { sw: 52, kn: 92, fl: 0, an: -25 }, lN: { sw: 14, kn: 78, fl: 0, an: -30 }, spine: { lean: 6 }, flutter: 1 }, o);
  const runArms = C.runArms || { aN: { sw: -102, ab: 24, el: 14 }, aF: { sw: -96, ab: 18, el: 14 } };

  const A = {};

  // ---------------------------------------------------------------- locomotion
  A.idle = {
    loop: true, frames: 8, cycle: 1.2,
    keys: [
      [0, st()],
      [0.6, st({ root: { y: -0.012 }, lF: { kn: (S.lF?.kn ?? 30) + 6 }, lN: { kn: (S.lN?.kn ?? 20) + 6 }, aN: { sw: (S.aN?.sw ?? 40) - 3 }, aF: { sw: (S.aF?.sw ?? 60) - 3 }, head: { nod: (S.head?.nod ?? 0) + 3 }, flutter: 0.4 })],
    ],
  };
  const runKeys = range(8).map((i) => {
    const th = (i / 8) * Math.PI * 2;
    const b = Math.max(0, Math.sin(th * 2));
    return [i * 0.06, pose(S, {
      root: { y: 0.025 * b, lean: 0 },
      spine: { lean: C.runLean ?? 36, yaw: 6 * Math.sin(th), roll: 0 },
      head: { nod: -(C.runLean ?? 36) * 0.7, yaw: 0 },
      lN: runLeg(th), lF: runLeg(th + Math.PI),
      aN: { ...runArms.aN, sw: runArms.aN.sw + 5 * Math.sin(th * 2) }, aF: { ...runArms.aF, sw: runArms.aF.sw + 5 * Math.cos(th * 2) },
      flutter: 1.2,
    }), 'linear'];
  });
  A.run = { loop: true, frames: 8, cycle: 0.48, keys: runKeys };

  const dashPose = (k) => pose(S, {
    spine: { lean: 48, yaw: 0 }, head: { nod: -38 },
    lF: { sw: 58 + k * 4, kn: 34, fl: 0.3 }, lN: { sw: -62 - k * 4, kn: 26, fl: 0, an: -30 },
    ...runArms, flutter: 2,
  });
  A.dash = { loop: true, frames: 2, cycle: 0.12, keys: [[0, dashPose(0)], [0.06, dashPose(1)]] };
  const fly = (k) => pose(S, {
    root: { lean: 68 + k * 3 }, spine: { lean: 4 }, head: { nod: -52 },
    aN: { sw: 172, ab: 6, el: 4 }, aF: { sw: -18, ab: 16, el: 12 },
    lF: { sw: -6, kn: 22 + k * 6, fl: 0, an: -40 }, lN: { sw: -18, kn: 44 - k * 6, fl: 0, an: -40 },
    flutter: 2.2, face: 'angry',
  });
  A.superDash = { loop: true, frames: 2, cycle: 0.1, keys: [[0, fly(0)], [0.05, fly(1)]] };
  A.backDash = { samples: [0, 0.06, 0.12], end: 0.2, keys: [
    [0, st({ spine: { lean: -6 }, root: { y: 0.05 }, lF: { sw: 30, kn: 50 }, lN: { sw: 10, kn: 60 } })],
    [0.12, st({ spine: { lean: -10 }, root: { y: 0.1 }, lF: { sw: 40, kn: 70, fl: 0 }, lN: { sw: 20, kn: 80, fl: 0 }, flutter: 1 })],
  ] };

  A.jumpSquat = { samples: [0], end: 0.07, keys: [[0, st({ squash: 0.88, spine: { lean: 18 }, lF: { sw: 42, kn: 82 }, lN: { sw: -14, kn: 76 }, aN: { sw: -28, el: 30, ab: 20 }, aF: { sw: -24, el: 30 } })]] };
  A.jumpUp = { loop: true, frames: 2, cycle: 0.16, keys: [
    [0, st({ squash: 1.06, spine: { lean: 4 }, lF: { sw: 72, kn: 112, fl: 0, an: -25 }, lN: { sw: 30, kn: 100, fl: 0, an: -35 }, aN: { sw: 125, ab: 30, el: 30 }, aF: { sw: -55, ab: 22, el: 20 }, head: { nod: -10 }, flutter: 1 })],
    [0.08, st({ squash: 1.04, spine: { lean: 6 }, lF: { sw: 70, kn: 108, fl: 0, an: -25 }, lN: { sw: 28, kn: 96, fl: 0, an: -35 }, aN: { sw: 120, ab: 32, el: 34 }, aF: { sw: -50, ab: 24, el: 24 }, head: { nod: -8 }, flutter: 1.4 })],
  ] };
  A.jumpFall = { loop: true, frames: 2, cycle: 0.16, keys: [
    [0, st({ spine: { lean: 2 }, lF: { sw: 36, kn: 42, fl: 0, an: -20 }, lN: { sw: -12, kn: 30, fl: 0, an: -25 }, aN: { sw: 72, ab: 50, el: 22 }, aF: { sw: -42, ab: 40, el: 18 }, flutter: 1.2 })],
    [0.08, st({ spine: { lean: 0 }, lF: { sw: 32, kn: 38, fl: 0, an: -20 }, lN: { sw: -14, kn: 28, fl: 0, an: -25 }, aN: { sw: 76, ab: 52, el: 24 }, aF: { sw: -40, ab: 42, el: 16 }, flutter: 1.6 })],
  ] };
  A.land = { samples: [0, 0.05], end: 0.12, keys: [
    [0, st({ squash: 0.86, spine: { lean: 20 }, lF: { sw: 46, kn: 78 }, lN: { sw: -18, kn: 66 }, aN: { sw: 30, ab: 40, el: 40 }, aF: { sw: -20, ab: 30, el: 30 } })],
    [0.1, st({ squash: 0.95, spine: { lean: 12 } })],
  ] };
  A.airRecover = { samples: [0, 0.05, 0.1], end: 0.16, keys: [
    [0, air({ root: { lean: -60 }, lF: { sw: 110, kn: 130 }, lN: { sw: 100, kn: 130 } })],
    [0.05, air({ root: { lean: -200 }, lF: { sw: 120, kn: 135 }, lN: { sw: 110, kn: 135 } }), 'linear'],
    [0.1, air({ root: { lean: -340 } }), 'linear'],
  ] };

  // tech recoveries (ADR 0030): the engine plays them on the tech state's clock, beat by beat (phases = frames per
  // beat: contact, main motion, settle), so the sample times here only set the default durations
  const brace = st({ squash: 0.84, spine: { lean: 28 }, lF: { sw: 52, kn: 94 }, lN: { sw: -24, kn: 82 }, aN: { sw: 72, ab: 18, el: 8 }, aF: { sw: -30, ab: 40, el: 44 }, face: 'angry' });
  A.techGround = { samples: [0, 0.067, 0.15, 0.233], end: 0.3, phases: [1, 2, 1], keys: [
    [0, brace],
    [0.067, st({ squash: 0.9, spine: { lean: 18 }, lF: { sw: 42, kn: 64 }, lN: { sw: -18, kn: 54 }, aN: { sw: 40, ab: 30, el: 40 }, face: 'angry' })],
    [0.15, st({ squash: 0.96, spine: { lean: 8 }, face: 'angry' })],
    [0.233, st({ face: 'angry' })],
  ] };
  const tuck = (lean) => air({ root: { lean }, spine: { lean: 30 }, head: { nod: 30 }, lF: { sw: 128, kn: 138 }, lN: { sw: 118, kn: 138 }, aN: { sw: 70, ab: 20, el: 110 }, aF: { sw: 60, ab: 20, el: 110 }, flutter: 1 });
  A.techRoll = { samples: [0, 0.05, 0.113, 0.175, 0.238, 0.3], end: 0.367, phases: [1, 4, 1], keys: [
    [0, tuck(-70)],
    [0.05, tuck(20)], [0.113, tuck(110), 'linear'], [0.175, tuck(200), 'linear'], [0.238, tuck(290), 'linear'],
    [0.3, st({ squash: 0.84, spine: { lean: 24 }, lF: { sw: 52, kn: 96 }, lN: { sw: -20, kn: 84 }, face: 'angry' })],
  ] };
  // the placeholder cannot model the barrier: a feet-first cling, the push-off and the airborne recovery, grounded
  A.wallTech = { samples: [0, 0.05, 0.1, 0.167, 0.233], end: 0.3, phases: [2, 1, 2], keys: [
    [0, air({ root: { lean: 60 }, spine: { lean: 20 }, lF: { sw: 120, kn: 130 }, lN: { sw: 110, kn: 128 }, aN: { sw: 90, ab: 30, el: 40 }, aF: { sw: -60, ab: 30, el: 30 } })],
    [0.05, air({ root: { lean: 55 }, spine: { lean: 22 }, lF: { sw: 124, kn: 138 }, lN: { sw: 114, kn: 136 }, aN: { sw: 96, ab: 30, el: 40 }, aF: { sw: -64, ab: 30, el: 30 }, face: 'angry' })],
    [0.1, air({ root: { lean: 25 }, spine: { lean: 10 }, lF: { sw: 30, kn: 10, fl: 0 }, lN: { sw: 10, kn: 6, fl: 0 }, aN: { sw: -60, ab: 30, el: 20 }, aF: { sw: -70, ab: 30, el: 20 }, flutter: 1.6, face: 'angry' })],
    [0.167, air({ spine: { lean: 6 }, lF: { sw: 60, kn: 90 }, lN: { sw: 30, kn: 70 }, aN: { sw: 60, ab: 50, el: 30 }, aF: { sw: -30, ab: 40, el: 20 } })],
    [0.233, st({ spine: { lean: 2 }, lF: { sw: 36, kn: 42, fl: 0, an: -20 }, lN: { sw: -12, kn: 30, fl: 0, an: -25 }, aN: { sw: 72, ab: 50, el: 22 }, aF: { sw: -42, ab: 40, el: 18 }, flutter: 1.2 })],
  ] };

  // ---------------------------------------------------------------- auto combo
  // Attack alts (light1Alt ... airHeavyAlt, hurtHighAlt, hurtLowAlt; ADR 0031) are deliberately NOT keyed here: the
  // baker renders every entry of this table on the main thread at startup, and a placeholder alt would only re-pose the
  // same chibi swing. With no entry the baked sheet has no alt strip (SheetAsset.has is false), so Fighter keeps the
  // base and FALLBACK maps direct lookups to it. Bake time stays flat.
  A.light1 = {
    samples: [0.02, 0.05, 0.08, 0.12, 0.17, 0.22, 0.27], end: 0.3, phases: [2, 2, 3], smear: { 2: ['handF'] },
    keys: [
      [0, st()],
      [0.045, st({ aF: { sw: 52, el: 104 }, spine: { yaw: (S.spine?.yaw ?? 0) - 6 } }), 'out'],
      [0.075, st({ aF: { sw: 86, ab: 4, el: 2 }, aN: { sw: 30, el: 128 }, spine: { yaw: 24, lean: 12 }, root: { x: 0.05 }, lF: { sw: 36, kn: 26 }, lN: { sw: -30, kn: 10 }, face: 'angry' }), 'snap'],
      [0.14, st({ aF: { sw: 84, ab: 4, el: 8 }, aN: { sw: 30, el: 128 }, spine: { yaw: 22, lean: 11 }, root: { x: 0.05 }, lF: { sw: 36, kn: 26 }, lN: { sw: -30, kn: 10 }, face: 'angry' }), 'linear'],
      [0.29, st(), 'inout'],
    ],
  };
  A.light2 = {
    samples: [0.025, 0.06, 0.09, 0.13, 0.18, 0.24, 0.29], end: 0.32, phases: [2, 2, 3], smear: { 2: ['handN'] },
    keys: [
      [0, st()],
      [0.05, st({ aN: { sw: 20, el: 124, ab: 32 }, spine: { yaw: 22 }, root: { x: -0.02 } }), 'out'],
      [0.085, st({ aN: { sw: 90, ab: 10, el: 2 }, aF: { sw: 34, el: 122 }, spine: { yaw: -28, lean: 16 }, root: { x: 0.09 }, lF: { sw: 38, kn: 28 }, lN: { sw: -34, kn: 8, fl: 0.4, an: -20 }, face: 'angry' }), 'snap'],
      [0.15, st({ aN: { sw: 88, ab: 10, el: 8 }, aF: { sw: 34, el: 122 }, spine: { yaw: -24, lean: 15 }, root: { x: 0.09 }, lF: { sw: 38, kn: 28 }, lN: { sw: -34, kn: 8, fl: 0.4, an: -20 }, face: 'angry' }), 'linear'],
      [0.31, st(), 'inout'],
    ],
  };
  A.light3 = {
    samples: [0.03, 0.07, 0.105, 0.15, 0.21, 0.27, 0.33], end: 0.36, phases: [2, 2, 3], smear: { 2: ['footN'] },
    keys: [
      [0, st()],
      [0.06, st({ root: { yaw: -10 }, lN: { sw: 86, kn: 112, fl: 0, an: -20 }, lF: { sw: 8, kn: 14 }, spine: { lean: -4 }, aN: { sw: 52, el: 112 }, aF: { sw: 42, el: 104 } }), 'out'],
      [0.1, st({ root: { yaw: -18 }, lN: { sw: 94, kn: 2, fl: 0, an: -34 }, lF: { sw: 4, kn: 10 }, spine: { lean: -18, yaw: -8 }, root: { x: 0.05 }, aF: { sw: 32, el: 112 }, aN: { sw: -32, ab: 34, el: 38 }, face: 'angry' }), 'snap'],
      [0.17, st({ root: { yaw: -16 }, lN: { sw: 92, kn: 6, fl: 0, an: -34 }, lF: { sw: 4, kn: 10 }, spine: { lean: -17, yaw: -6 }, root: { x: 0.05 }, aF: { sw: 32, el: 112 }, aN: { sw: -30, ab: 34, el: 40 }, face: 'angry' }), 'linear'],
      [0.35, st(), 'inout'],
    ],
  };
  A.light4 = {
    samples: [0.04, 0.09, 0.135, 0.17, 0.21, 0.28, 0.35, 0.42], end: 0.46, phases: [3, 2, 3], smear: { 3: ['footN'] },
    keys: [
      [0, st()],
      [0.08, st({ spine: { yaw: 26, lean: 10 }, root: { yaw: 20 }, lF: { kn: 48 }, lN: { sw: -32, kn: 42 }, aN: { sw: 20, el: 90, ab: 40 }, aF: { sw: 30, el: 100 } }), 'out'],
      [0.13, st({ root: { yaw: -10, y: 0.03 }, spine: { yaw: -6, lean: -6 }, lN: { sw: 62, kn: 74, fl: 0 }, lF: { sw: 0, kn: 16 } }), 'inout'],
      [0.17, st({ lN: { sw: 114, ab: 30, kn: 2, fl: 0, an: -28 }, lF: { sw: -6, kn: 10 }, spine: { lean: -28, yaw: -24 }, root: { yaw: -34, y: 0.07 }, aN: { sw: -42, ab: 44, el: 18 }, aF: { sw: 62, ab: 24, el: 40 }, face: 'shout', flutter: 1.5 }), 'snap'],
      [0.25, st({ lN: { sw: 110, ab: 30, kn: 6, fl: 0, an: -28 }, lF: { sw: -6, kn: 10 }, spine: { lean: -26, yaw: -22 }, root: { yaw: -32, y: 0.06 }, aN: { sw: -40, ab: 44, el: 20 }, aF: { sw: 60, ab: 24, el: 42 }, face: 'shout', flutter: 1 }), 'linear'],
      [0.45, st(), 'inout'],
    ],
  };
  A.heavy = {
    samples: [0.035, 0.075, 0.11, 0.14, 0.19, 0.26, 0.33, 0.39], end: 0.42, phases: [3, 2, 3], smear: { 3: ['handN'] },
    keys: [
      [0, st()],
      [0.08, st({ lF: { sw: 52, kn: 88 }, lN: { sw: -16, kn: 82 }, spine: { lean: 24, yaw: 18 }, aN: { sw: -26, el: 46, ab: 26 }, aF: { sw: 42, el: 112 }, head: { nod: 10 }, squash: 0.94 }), 'out'],
      // first active frame: rear fist driving forward-up into the opponent's chin
      [0.13, st({ aN: { sw: 116, ab: 6, el: 10 }, aF: { sw: 30, el: 96, ab: 22 }, spine: { lean: 6, yaw: -16 }, root: { y: 0.06, x: 0.06 }, lF: { sw: 30, kn: 22, fl: 0.5 }, lN: { sw: -22, kn: 6, fl: 0, an: -30 }, head: { nod: -8 }, face: 'shout', flutter: 1.5, squash: 1.04 }), 'snap'],
      // second active frame: follow-through overhead as the hop lifts off
      [0.2, st({ aN: { sw: 162, ab: 10, el: 12 }, aF: { sw: 30, el: 90, ab: 22 }, spine: { lean: -12, yaw: -22 }, root: { y: 0.2 }, lF: { sw: 24, kn: 14, fl: 0.4 }, lN: { sw: -16, kn: 8, fl: 0, an: -34 }, head: { nod: -16 }, face: 'shout', flutter: 1 }), 'linear'],
      [0.41, st(), 'inout'],
    ],
  };

  // ---------------------------------------------------------------- air
  A.airLight1 = {
    samples: [0.03, 0.075, 0.11, 0.16, 0.21], end: 0.24, phases: [1, 2, 2], smear: { 1: ['handF'] },
    keys: [[0, air()], [0.04, air({ aF: { sw: 54, el: 100 } }), 'out'], [0.07, air({ aF: { sw: 78, el: 2 }, spine: { yaw: 22, lean: 10 }, face: 'angry' }), 'snap'], [0.13, air({ aF: { sw: 76, el: 8 }, spine: { yaw: 20, lean: 10 }, face: 'angry' }), 'linear'], [0.24, air(), 'inout']],
  };
  A.airLight2 = {
    samples: [0.035, 0.08, 0.12, 0.17, 0.22], end: 0.25, phases: [1, 2, 2], smear: { 1: ['footN'] },
    keys: [[0, air()], [0.05, air({ lN: { sw: 70, kn: 110, fl: 0 } }), 'out'], [0.08, air({ lN: { sw: 80, kn: 2, fl: 0, an: -34 }, spine: { lean: -12, yaw: -14 }, root: { yaw: -12 }, aN: { sw: -40, ab: 40 }, face: 'angry' }), 'snap'], [0.14, air({ lN: { sw: 78, kn: 6, fl: 0, an: -34 }, spine: { lean: -11, yaw: -12 }, root: { yaw: -10 }, aN: { sw: -38, ab: 40 }, face: 'angry' }), 'linear'], [0.25, air(), 'inout']],
  };
  A.airLight3 = {
    samples: [0.04, 0.09, 0.13, 0.18, 0.25, 0.31], end: 0.34, phases: [2, 2, 2], smear: { 2: ['footF'] },
    keys: [[0, air()], [0.07, air({ root: { yaw: -20 }, spine: { yaw: -20 }, lF: { sw: 60, kn: 120 } }), 'out'], [0.11, air({ root: { yaw: 30, lean: -10 }, spine: { yaw: 30, lean: -18 }, lF: { sw: 108, ab: 24, kn: 2, fl: 0, an: -30 }, lN: { sw: 10, kn: 90 }, aN: { sw: -50, ab: 50 }, aF: { sw: 60, ab: 30, el: 50 }, face: 'shout', flutter: 1.5 }), 'snap'], [0.19, air({ root: { yaw: 28, lean: -10 }, spine: { yaw: 28, lean: -16 }, lF: { sw: 104, ab: 24, kn: 6, fl: 0, an: -30 }, lN: { sw: 10, kn: 90 }, aN: { sw: -48, ab: 50 }, aF: { sw: 58, ab: 30, el: 50 }, face: 'shout' }), 'linear'], [0.34, air(), 'inout']],
  };
  A.airHeavy = {
    samples: [0.04, 0.09, 0.135, 0.18, 0.25, 0.32], end: 0.36, phases: [2, 2, 2], smear: { 2: ['handN', 'handF'] },
    keys: [
      [0, air()],
      [0.08, air({ aN: { sw: 176, el: 42, ab: 8 }, aF: { sw: 172, el: 46, ab: 8 }, spine: { lean: -20 }, lF: { sw: 62, kn: 104 }, lN: { sw: 30, kn: 96 }, face: 'shout', flutter: 1.2 }), 'out'],
      [0.13, air({ aN: { sw: 68, el: 8, ab: 4 }, aF: { sw: 64, el: 12, ab: 4 }, spine: { lean: 40 }, root: { lean: 12 }, lF: { sw: 8, kn: 52 }, lN: { sw: -24, kn: 40 }, face: 'shout', flutter: 2 }), 'snap'],
      [0.2, air({ aN: { sw: 66, el: 12, ab: 4 }, aF: { sw: 62, el: 14, ab: 4 }, spine: { lean: 38 }, root: { lean: 10 }, lF: { sw: 8, kn: 52 }, lN: { sw: -24, kn: 40 }, face: 'shout', flutter: 1 }), 'linear'],
      [0.36, air(), 'inout'],
    ],
  };
  A.throw = {
    samples: [0.05, 0.1, 0.16, 0.23], end: 0.28, phases: [1, 1, 2], smear: { 1: ['handN'] },
    keys: [
      [0, air()],
      [0.06, air({ aN: { sw: -128, ab: 24, el: 60 }, spine: { yaw: 26, lean: -8 }, aF: { sw: 70, ab: 20, el: 30 } }), 'out'],
      [0.1, air({ aN: { sw: 104, ab: 10, el: 0, hand: 'open' }, spine: { yaw: -26, lean: 16 }, aF: { sw: -40, ab: 30, el: 20 }, face: 'angry' }), 'snap'],
      [0.18, air({ aN: { sw: 74, ab: 12, el: 20, hand: 'open' }, spine: { yaw: -18, lean: 12 }, aF: { sw: -34, ab: 30, el: 20 } }), 'linear'],
      [0.28, air(), 'inout'],
    ],
  };

  // ---------------------------------------------------------------- defense & reactions
  const guardP = (o = {}) => st({ aN: { sw: 72, ab: 12, el: 108, tw: 22 }, aF: { sw: 80, ab: 6, el: 102 }, spine: { lean: 12 }, head: { nod: 14 }, lF: { kn: 36 }, lN: { kn: 28 }, face: 'angry', ...o });
  A.guard = { loop: true, frames: 2, cycle: 0.6, keys: [[0, guardP()], [0.3, guardP({ root: { y: -0.008 } })]] };
  A.block = { samples: [0, 0.06], end: 0.14, keys: [[0, guardP({ spine: { lean: -6 }, head: { nod: 20 }, root: { x: -0.04 }, face: 'closed' })], [0.1, guardP()]] };
  const hurtH = (k) => st({ head: { nod: -30 + k * 10 }, spine: { lean: -24 + k * 8, yaw: -10 }, root: { lean: -6 + k * 2, x: -0.03 }, aN: { sw: -38 + k * 15, ab: 44, el: 30 }, aF: { sw: -24 + k * 10, ab: 34, el: 40 }, lF: { sw: 22, kn: 32 }, lN: { sw: -28, kn: 22 }, face: 'hurt', flutter: 1 });
  A.hurtHigh = { samples: [0, 0.07, 0.16], end: 0.26, keys: [[0, hurtH(0)], [0.07, hurtH(0.3)], [0.2, hurtH(1)]] };
  const hurtL = (k) => st({ head: { nod: 26 - k * 8 }, spine: { lean: 40 - k * 12 }, root: { x: -0.02 }, aN: { sw: 40, ab: 12, el: 82 }, aF: { sw: 34, el: 92 }, lF: { sw: 20, kn: 34 }, lN: { sw: -22, kn: 24 }, face: 'hurt', flutter: 1 });
  A.hurtLow = { samples: [0, 0.07, 0.16], end: 0.26, keys: [[0, hurtL(0)], [0.07, hurtL(0.3)], [0.2, hurtL(1)]] };
  const launchP = (k) => pose(S, { root: { lean: -52 - k * 6 }, spine: { lean: -14 }, head: { nod: -22 }, aN: { sw: 148 + k * 6, ab: 34, el: 20 }, aF: { sw: 136 - k * 6, ab: 22, el: 30 }, lF: { sw: 42, kn: 30 + k * 10, fl: 0, an: -20 }, lN: { sw: 18, kn: 46 - k * 8, fl: 0, an: -20 }, face: 'hurt', flutter: 2 });
  A.launched = { loop: true, frames: 2, cycle: 0.14, keys: [[0, launchP(0)], [0.07, launchP(1)]] };
  const spinP = (a) => pose(S, { root: { lean: a }, spine: { lean: 20 }, head: { nod: 20 }, aN: { sw: 60, ab: 30, el: 80 }, aF: { sw: 50, ab: 30, el: 80 }, lF: { sw: 80, kn: 110, fl: 0 }, lN: { sw: 70, kn: 120, fl: 0 }, face: 'hurt', flutter: 2 });
  A.spin = { loop: true, frames: 4, cycle: 0.24, keys: [[0, spinP(-30)], [0.06, spinP(-120), 'linear'], [0.12, spinP(-210), 'linear'], [0.18, spinP(-300), 'linear']] };
  const downP = (k) => pose(S, { root: { lean: -90 + (1 - k) * 18 }, spine: { lean: 0 }, head: { nod: -8 }, aN: { sw: 40 - k * 20, ab: 52, el: 24 }, aF: { sw: 30 - k * 10, ab: 40, el: 30 }, lF: { sw: 14 + (1 - k) * 30, kn: 20, fl: 0 }, lN: { sw: 4 + (1 - k) * 20, kn: 10, fl: 0 }, face: k ? 'closed' : 'hurt' });
  A.down = { samples: [0, 0.08], end: 0.5, keys: [[0, downP(0)], [0.08, downP(1)]] };
  A.ko = { samples: [0], end: 0.5, keys: [[0, pose(downP(1), { face: 'closed' })]] };
  A.getup = {
    samples: [0, 0.07, 0.13, 0.19, 0.27], end: 0.34,
    keys: [
      [0, pose(downP(1), { lF: { sw: 118, kn: 122 }, lN: { sw: 108, kn: 122 }, aN: { sw: 150, ab: 30, el: 100 }, aF: { sw: 140, ab: 30, el: 100 } })],
      [0.07, pose(downP(1), { root: { lean: -125 }, lF: { sw: 150, kn: 50 }, lN: { sw: 140, kn: 60 }, aN: { sw: 150, ab: 30, el: 100 }, aF: { sw: 140, ab: 30, el: 100 }, face: 'angry' })],
      [0.13, st({ root: { lean: -40, y: 0.2 }, lF: { sw: 20, kn: 60, fl: 0 }, lN: { sw: -10, kn: 50, fl: 0 }, aN: { sw: 60, ab: 50 }, aF: { sw: 40, ab: 50 }, face: 'angry', flutter: 1 })],
      [0.19, st({ squash: 0.9, spine: { lean: 22 }, lF: { sw: 44, kn: 72 }, lN: { sw: -20, kn: 62 }, face: 'angry' })],
      [0.27, st({ face: 'angry' })],
    ],
  };
  const stag = (k) => st({ spine: { lean: -8, roll: 8 * k }, head: { nod: -12, roll: 10 * k }, aN: { sw: 10 - 6 * k, ab: 24, el: 20 }, aF: { sw: -6 + 6 * k, ab: 20, el: 20 }, root: { x: 0.02 * k }, face: 'hurt' });
  A.stagger = { loop: true, frames: 4, cycle: 0.6, keys: [[0, stag(1)], [0.15, stag(0)], [0.3, stag(-1)], [0.45, stag(0)]] };

  // ---------------------------------------------------------------- ki & beams
  const chargeP = (k) => st({
    lF: { sw: 18, ab: 22, kn: 36 }, lN: { sw: -18, ab: 22, kn: 36 }, spine: { lean: -10, roll: k * 1.5, yaw: 4 }, head: { nod: -24 },
    aN: { sw: -14, ab: 38 + k * 2, el: 30, tw: 0 }, aF: { sw: -10, ab: 36 - k * 2, el: 30 }, root: { x: k * 0.008 }, face: 'shout', flutter: 2.4,
  });
  A.charge = { loop: true, frames: 4, cycle: 0.2, keys: [[0, chargeP(1)], [0.05, chargeP(-1)], [0.1, chargeP(1)], [0.15, chargeP(-1)]] };
  const bcP = (k) => st({
    spine: { yaw: -36, lean: 6, roll: k }, root: { yaw: -8, x: k * 0.006 }, head: { yaw: 18, nod: -6 },
    aN: { sw: -48, el: 72, ab: 14, hand: 'open' }, aF: { sw: -36, el: 84, ab: -34, hand: 'open' },
    lF: { sw: 32, ab: 10, kn: 42 }, lN: { sw: -30, ab: 10, kn: 32 }, face: 'shout', flutter: 2,
  });
  A.beamCharge = { loop: true, frames: 3, cycle: 0.15, keys: [[0, bcP(1)], [0.05, bcP(-1)], [0.1, bcP(0)]] };
  const bfP = (k) => st({
    spine: { yaw: -6, lean: 14, roll: k }, root: { x: k * 0.006 }, head: { nod: 4, yaw: 8 },
    aN: { sw: 90, ab: 2, el: 2, hand: 'palm' }, aF: { sw: 90, ab: -4, el: 4, hand: 'palm' },
    lF: { sw: 38, ab: 12, kn: 30 }, lN: { sw: -38, ab: 12, kn: 14, fl: 0.6, an: -14 }, face: 'shout', flutter: 3,
  });
  A.beamFire = { loop: true, frames: 3, cycle: 0.15, keys: [[0, bfP(1)], [0.05, bfP(-1)], [0.1, bfP(0)]] };
  A.vanish = { samples: [0, 0.05], end: 0.1, keys: [[0, st({ spine: { lean: 20 }, lF: { kn: 60 }, lN: { kn: 50 }, squash: 0.9 })], [0.05, st({ squash: 1.1, root: { y: 0.05 }, flutter: 2 })]] };

  // ---------------------------------------------------------------- character hooks
  Object.assign(A, C.extra ? C.extra({ st, air, pose, runLeg, runArms }) : {});
  return A;
}
