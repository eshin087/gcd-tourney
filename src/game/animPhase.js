// Which frame of a phased strip shows at a gameplay moment: the one mapping shared by attack playback
// (SpriteActor.setPhase) and the tech poses (techAnim.js), kept pure so tools/test-tech-anims.mjs can check it.
// `phases` are the strip's art frames per beat (anims.json, e.g. [2, 2, 3]); `phase` 0..2 and `p` 0..1 come from the
// gameplay clock (an attack's startup / active / recovery, a tech state's DEFENSE animPhases).

export function phaseFrame(phases, n, phase, p) {
  let idx;
  if (phases && phases.length === 3) {
    const start = phase === 0 ? 0 : phase === 1 ? phases[0] : phases[0] + phases[1];
    const cnt = Math.max(1, phases[phase]);
    idx = start + Math.min(cnt - 1, Math.floor(p * cnt));
  } else {
    // a strip without phases: thirds of its frames
    const total = phase === 0 ? p * 0.33 : phase === 1 ? 0.33 + p * 0.33 : 0.66 + p * 0.34;
    idx = Math.floor(total * n);
  }
  return Math.max(0, Math.min(n - 1, idx));
}

// The frame a looping strip goes back to after its last one (anims.json `loopFrom`, ENG-117): `charge` plays its
// gather and release once, then loops only the held power stance. 0, the whole strip, when unset or out of range.
export function loopStart(a) {
  const k = a?.loopFrom | 0;
  return k > 0 && k < (a.frames?.length ?? 0) ? k : 0;
}
