// Attack alts (ADR 0031): every attack and both hit reactions may have one alternate strip, `<base>Alt`, with the
// base's frame count, phases and timing but another technique, so a long fight stops showing the same swing over and
// over. Which version plays is a pure function of how often this fighter has used the base: the Thue-Morse sequence
// (bit = parity of the set bits of the use count) is balanced and never shows one version three times in a row, and a
// per-base offset keeps the moves of a chain from switching together. No Math.random: a future online mode replays
// the same choices on both machines. An alt plays only when the sheet has it as its own strip (SheetAsset.has), never
// through FALLBACK; otherwise the base plays, exactly as before alts existed. Pure module (no three.js, no DOM).

// base -> its alt. Moves map through this by their `anim` (MOVES, kit moves that borrow these strips, e.g. vanishKick
// plays light4), hit reactions by the strip takeHit chose.
export const ALT_OF = {
  light1: 'light1Alt', light2: 'light2Alt', light3: 'light3Alt', light4: 'light4Alt', heavy: 'heavyAlt',
  airLight1: 'airLight1Alt', airLight2: 'airLight2Alt', airLight3: 'airLight3Alt', airHeavy: 'airHeavyAlt',
  hurtHigh: 'hurtHighAlt', hurtLow: 'hurtLowAlt',
};

// alt -> its base
export const ALT_BASE = Object.fromEntries(Object.entries(ALT_OF).map(([base, alt]) => [alt, base]));

// ?alts=0 never picks an alt, ?alts=1 always picks it when the sheet has one (art review); dev switches parsed like
// ?depthscale in sprites.js. The location guard keeps the module importable by the Node tests.
const ALTS_Q = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('alts') : null;
export const ALTS_MODE = ALTS_Q === '0' ? 'off' : ALTS_Q === '1' ? 'on' : 'auto';

// Thue-Morse bit of n: 0 1 1 0 1 0 0 1 ... (every pair 2k, 2k + 1 holds one of each, and no run is longer than two)
export function thueMorse(n) {
  let b = 0;
  for (let v = n >>> 0; v; v &= v - 1) b ^= 1;
  return b;
}

// A small stable offset (0-7) per base name, so light1..light4, used once each per string, sit at different points of
// the sequence and a string mixes versions instead of flipping all four together.
export function altOffset(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return h & 7;
}

const OFFSET = Object.fromEntries(Object.keys(ALT_OF).map((base) => [base, altOffset(base)]));

// The strip one use of `base` shows: its alt or the base itself. counters = the fighter's use count per base (advanced
// only while the alt exists, so a sheet without alts never moves it); hasAnim(name) = the sheet has that strip as its
// own art. Other names (special, throw, guard...) pass through untouched.
export function pickAnim(base, counters, hasAnim, mode = ALTS_MODE) {
  const alt = ALT_OF[base];
  if (!alt || mode === 'off' || !hasAnim(alt)) return base;
  if (mode === 'on') return alt;
  const n = counters[base] ?? 0;
  counters[base] = n + 1;
  return thueMorse(n + OFFSET[base]) ? alt : base;
}
