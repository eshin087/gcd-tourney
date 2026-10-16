// Deterministic math for the simulation (ADR 0036). The spec lets each engine round Math.hypot, sin, cos, atan2, ...
// its own way, and the determinism test caught Safari's Math.hypot one ulp off Chrome's (the push-apart step, a
// jump's velocity), which splits an online match. These use only + - * / and Math.sqrt, which IEEE 754 rounds
// exactly in every engine, so every browser gets the same bits. sin / cos / atan are fdlibm's polynomials after its
// reductions: within about 1 ulp of the true value for the arguments a fight produces, deterministic for any input.
// Gameplay code calls these, never the Math versions (tools/lint-sim-math.mjs); effects, the camera and three.js
// keep the engine's (they don't feed the simulation).

export const PI = Math.PI;

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

// fdlibm s_atan.c: the argument folded onto [0, 7/16) around four breakpoints, then an odd polynomial
const ATANHI = [4.63647609000806093515e-1, 7.85398163397448278999e-1, 9.82793723247329054082e-1, 1.57079632679489655800];
const ATANLO = [2.26987774529616870924e-17, 3.06161699786838301793e-17, 1.39033110312309984516e-17, 6.12323399573676603587e-17];
const AT = [3.33333333333329318027e-1, -1.99999999998764832476e-1, 1.42857142725034663711e-1, -1.11111104054623557880e-1,
  9.09088713343650656196e-2, -7.69187620504482999495e-2, 6.66107313738753120669e-2, -5.83357013379057348645e-2,
  4.97687799461593236017e-2, -3.65315727442169155270e-2, 1.62858201153657823623e-2];

export function atan(v) {
  if (v !== v) return NaN;
  const neg = v < 0 || Object.is(v, -0);
  let x = neg ? -v : v, id;
  if (x >= 7.378697629483821e19) return neg ? -(ATANHI[3] + ATANLO[3]) : ATANHI[3] + ATANLO[3]; // |x| >= 2^66
  if (x < 0.4375) {
    if (x < 3.725290298461914e-9) return v; // |x| < 2^-28: atan(x) = x
    id = -1;
  } else if (x < 1.1875) {
    if (x < 0.6875) { id = 0; x = (2 * x - 1) / (2 + x); } else { id = 1; x = (x - 1) / (x + 1); }
  } else if (x < 2.4375) { id = 2; x = (x - 1.5) / (1 + 1.5 * x); } else { id = 3; x = -1 / x; }
  const z = x * x, w = z * z;
  const s1 = z * (AT[0] + w * (AT[2] + w * (AT[4] + w * (AT[6] + w * (AT[8] + w * AT[10])))));
  const s2 = w * (AT[1] + w * (AT[3] + w * (AT[5] + w * (AT[7] + w * AT[9]))));
  if (id < 0) { const r = x - x * (s1 + s2); return neg ? -r : r; }
  const r = ATANHI[id] - ((x * (s1 + s2) - ATANLO[id]) - x);
  return neg ? -r : r;
}

const PI_LO = 1.2246467991473531772e-16; // pi - PI

// fdlibm e_atan2.c's case table on top of atan (finite arguments; the simulation never passes infinities)
export function atan2(y, x) {
  if (x !== x || y !== y) return NaN;
  const yneg = y < 0 || Object.is(y, -0), xneg = x < 0 || Object.is(x, -0);
  if (y === 0) return xneg ? (yneg ? -PI : PI) : y; // keeps the sign of a zero y
  if (x === 0) return yneg ? -PI / 2 : PI / 2;
  const q = y / x;
  const z = Number.isFinite(q) ? atan(q < 0 ? -q : q) : PI / 2;
  if (!xneg) return yneg ? -z : z;
  return yneg ? (z - PI_LO) - PI : PI - (z - PI_LO);
}

// The determinism test (src/net/detTest.js) can swap these in for Math's on the whole page, so code outside the
// simulation runs on them too; returns the function that puts the engine's back.
export function installDetMath() {
  const real = { hypot: Math.hypot, sin: Math.sin, cos: Math.cos, atan2: Math.atan2 };
  Object.assign(Math, { hypot, sin, cos, atan2 });
  return () => Object.assign(Math, real);
}
