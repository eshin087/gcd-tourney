// Seeded randomness (ADR 0026): one small PRNG for everything that should be reproducible from a seed: the rhythm
// clash charts (a pairing always gets the same chart) and the CPU combo composer's choices (a match seed, `?seed=`,
// gives the same personas and routes). It is for variety and reproducible tests, not lockstep replays: the rest of the
// sim still uses Math.random.

// mulberry32: a 32-bit state, fast and good enough for game choices. Returns a () => [0, 1) function.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// FNV-1a over the sorted ids: Hollow Purple vs Four-Tails is the same chart whoever is on the left
export function seedOf(...ids) {
  let h = 2166136261;
  for (const ch of ids.map(String).sort().join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// A standard normal sample (Box-Muller) from a [0, 1) source.
export function gauss(rand = Math.random) {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Weighted pick from { key: weight }; null when every weight is 0.
export function pickW(w, rand = Math.random) {
  let total = 0;
  for (const k in w) total += Math.max(0, w[k] || 0);
  if (total <= 0) return null;
  let r = rand() * total;
  for (const k in w) if ((r -= Math.max(0, w[k] || 0)) <= 0) return k;
  return null;
}
