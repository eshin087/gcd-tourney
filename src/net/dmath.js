// Deterministic math for online play (ADR 0036). The spec lets each engine round Math.hypot, sin, cos, pow, ... its own
// way, and the determinism test caught Safari's Math.hypot one ulp off Chrome's (the push-apart step, a jump's
// velocity). These use only + - * / and Math.sqrt, which IEEE 754 rounds exactly in every engine, so every browser
// gets the same bits. The kernels are fdlibm's polynomials (|r| <= pi/4) after a two-constant Cody-Waite reduction:
// within about 1 ulp of the true value for the arguments a fight produces (|x| < 1e6), deterministic for any input.
// For now only the determinism test installs them (installDetMath); ENG-092 moves the simulation onto them for good.

export const hypot = (...a) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * a[i];
  return Math.sqrt(s);
};

const INV_PIO2 = 6.36619772367581382433e-1; // 2 / pi
const PIO2_1 = 1.57079632673412561417; // the first 33 bits of pi / 2 (n * PIO2_1 is exact for |n| < 2^20)
const PIO2_1T = 6.07710050650619224932e-11; // pi / 2 - PIO2_1

const S1 = -1.66666666666666324348e-1, S2 = 8.33333333332248946124e-3, S3 = -1.98412698298579493134e-4,
  S4 = 2.75573137070700676789e-6, S5 = -2.50507602534068634195e-8, S6 = 1.58969099521155010221e-10;
const C1 = 4.16666666666666019037e-2, C2 = -1.38888888888741095749e-3, C3 = 2.48015872894767294178e-5,
  C4 = -2.75573143513906633035e-7, C5 = 2.08757232129817482790e-9, C6 = -1.13596475577881948265e-11;

const ksin = (x) => {
  const z = x * x;
  return x + z * x * (S1 + z * (S2 + z * (S3 + z * (S4 + z * (S5 + z * S6)))));
};
const kcos = (x) => {
  const z = x * x;
  return 1 - 0.5 * z + z * z * (C1 + z * (C2 + z * (C3 + z * (C4 + z * (C5 + z * C6)))));
};

// x = n * pi/2 + r with |r| <= pi/4; returns n mod 4 and leaves r in RED[0]
const RED = [0];
function reduce(x) {
  const n = Math.floor(x * INV_PIO2 + 0.5);
  RED[0] = (x - n * PIO2_1) - n * PIO2_1T;
  return ((n % 4) + 4) % 4;
}

export function sin(x) {
  if (!Number.isFinite(x)) return NaN;
  if (x > -0.7853981633974483 && x < 0.7853981633974483) return x === 0 ? x : ksin(x); // keeps -0
  const q = reduce(x), r = RED[0];
  return q === 0 ? ksin(r) : q === 1 ? kcos(r) : q === 2 ? -ksin(r) : -kcos(r);
}

export function cos(x) {
  if (!Number.isFinite(x)) return NaN;
  const q = reduce(x), r = RED[0];
  return q === 0 ? kcos(r) : q === 1 ? -ksin(r) : q === 2 ? -kcos(r) : ksin(r);
}

// Swap Math.hypot / sin / cos for the deterministic ones (the whole page: the simulation, effects and three.js alike).
// Returns the function that puts the engine's back.
export function installDetMath() {
  const real = { hypot: Math.hypot, sin: Math.sin, cos: Math.cos };
  Object.assign(Math, { hypot, sin, cos });
  return () => Object.assign(Math, real);
}
