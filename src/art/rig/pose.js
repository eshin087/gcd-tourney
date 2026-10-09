// Pose model + keyframe evaluation for the 3D rig. Poses are plain objects of
// joint angles (degrees); anything not given falls back to BASE.
//
//  root:  x/z shift, y lift, lean (forward), yaw (turn toward viewer), roll
//  spine: lean, yaw (twist chest toward viewer), roll
//  head:  nod (chin down), yaw, roll
//  aN/aF: near/far arm  sw (swing forward/up from hanging), ab (raise outward), tw, el (elbow bend), hand
//  lN/lF: near/far leg  sw (swing forward), ab (spread), tw, kn (knee bend), an (ankle), fl (auto-flat foot 0..1)
export const BASE = {
  root: { x: 0, y: 0, z: 0, lean: 0, yaw: 0, roll: 0 },
  spine: { lean: 0, yaw: 0, roll: 0 },
  head: { nod: 0, yaw: 0, roll: 0 },
  aN: { sw: 0, ab: 12, tw: 0, el: 8, wr: 0, hand: 'fist' },
  aF: { sw: 0, ab: 12, tw: 0, el: 8, wr: 0, hand: 'fist' },
  lN: { sw: 0, ab: 3, tw: 0, kn: 0, an: 0, fl: 1 },
  lF: { sw: 0, ab: 3, tw: 0, kn: 0, an: 0, fl: 1 },
  face: 'normal',
  eyes: null,
  blindfold: true, // only rigs with model.blindfold care; a pose lifts it with false
  flutter: 0,
  squash: 1,
  snap: true,
};

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

function merge(a, b) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b || {})) out[k] = isObj(v) && isObj(a[k]) ? merge(a[k], v) : v;
  return out;
}

export function pose(...layers) {
  return layers.reduce((acc, l) => merge(acc, l), BASE);
}

export const EASE = {
  linear: (t) => t,
  in: (t) => t * t,
  out: (t) => 1 - (1 - t) * (1 - t),
  inout: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  snap: (t) => 1 - Math.pow(1 - t, 4),
  back: (t) => {
    const c = 1.9;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  },
  hold: (t) => (t < 1 ? 0 : 1),
};

function lerpObj(a, b, t) {
  const out = {};
  for (const k of Object.keys(a)) {
    const va = a[k], vb = b[k];
    if (typeof va === 'number' && typeof vb === 'number') out[k] = va + (vb - va) * t;
    else if (isObj(va)) out[k] = lerpObj(va, vb || va, t);
    else out[k] = t < 0.5 ? va : vb ?? va;
  }
  return out;
}

// keys: [[time, pose, ease], ...] sorted by time. ease shapes the segment ending at that key.
export function evalKeys(keys, t, loop = false, cycle = 0) {
  if (loop && cycle > 0) t = ((t % cycle) + cycle) % cycle;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [ta, pa] = keys[i], [tb, pb, e] = keys[i + 1];
    if (t <= tb) {
      const u = (t - ta) / (tb - ta || 1);
      return lerpObj(pa, pb, (EASE[e || 'inout'] || EASE.inout)(u));
    }
  }
  if (loop && cycle > 0) {
    const [ta, pa] = keys[keys.length - 1];
    const u = (t - ta) / (cycle - ta || 1);
    return lerpObj(pa, keys[0][1], EASE.inout(u));
  }
  return keys[keys.length - 1][1];
}

// Sample times + per-frame durations (ms) for an animation definition.
export function sampleTimes(a) {
  if (a.samples) {
    const s = a.samples;
    const end = a.end ?? s[s.length - 1] + 0.08;
    return s.map((t, i) => ({ t, ms: Math.max(16, Math.round(((s[i + 1] ?? end) - t) * 1000)) }));
  }
  const n = a.frames || 1;
  const cycle = a.cycle || n * 0.1;
  return Array.from({ length: n }, (_, i) => ({ t: (i * cycle) / n, ms: Math.round((cycle / n) * 1000) }));
}
