// Procedural ground-damage decals (ENG-070, ADR 0024): the fallback for every name in the decal contract. Five
// seeded parametric painters (crack webs, bowl craters, scorches, directional grooves, wall holes) paint each name
// at half density (a 256 px cell is painted 128 px, ppu 32 instead of 64) straight into pixel buffers, so the edges
// stay hard and the colors stay on the palettes in art/decals/DECALS.md. The output has the shape of the packed
// atlas (public/decals/atlas.json), so GroundDamage merges hand-made names over it one name at a time.
//
// Art rules the painters follow (the same as the hand-made art): straight top-down, radial shading only (no side
// light: the engine rotates decals), no tile grid inside a decal, alpha fully on or off, and pure #FFFFFF reserved
// for hot seams (the "hot key": the engine glows those texels in the fighter's tint, then cools them to soot).
// Directional decals are drawn with the motion going left to right.
import { rng, hex } from './pixel.js';

export const DECAL_PPU = 64; // world scale of the hand-made decal cells (256 px = 4 units)
const PROC_PPU = DECAL_PPU / 2; // procedural cells are painted at half density

// The decal contract (shared with tools/pack-sprites.mjs, ADR 0024): cell px at ppu 64, variants, page group,
// mode (flat on the floor or wall face-on), tinted (white-only art, colored at runtime). `dir`: drawn with the
// motion left to right (the engine turns it along the movement); `tile`: seamless along x.
export const DECALS = {
  crack_s: { w: 256, h: 256, n: 8, group: 'base', mode: 'flat' },
  crack: { w: 256, h: 256, n: 8, group: 'base', mode: 'flat' },
  crater: { w: 256, h: 256, n: 8, group: 'base', mode: 'flat' },
  crater_big: { w: 512, h: 512, n: 6, group: 'base', mode: 'flat' },
  crater_huge: { w: 512, h: 512, n: 4, group: 'base', mode: 'flat' },
  fracture_ring: { w: 512, h: 512, n: 4, group: 'base', mode: 'flat' },
  scuff: { w: 256, h: 128, n: 8, group: 'base', mode: 'flat', dir: true },
  skid: { w: 512, h: 128, n: 4, group: 'base', mode: 'flat', dir: true },
  rubble: { w: 256, h: 256, n: 6, group: 'base', mode: 'flat' },
  dirt_crater: { w: 256, h: 256, n: 4, group: 'edge', mode: 'flat' },
  dirt_skid: { w: 512, h: 128, n: 3, group: 'edge', mode: 'flat', dir: true },
  barrier_crack: { w: 256, h: 256, n: 6, group: 'edge', mode: 'wall', tinted: true },
  crater_wall: { w: 512, h: 512, n: 4, group: 'edge', mode: 'wall' },
  burn_lightning: { w: 256, h: 256, n: 6, group: 'lightning', mode: 'flat' },
  burn_lightning_big: { w: 512, h: 512, n: 4, group: 'lightning', mode: 'flat' },
  fracture_lightning: { w: 512, h: 512, n: 2, group: 'lightning', mode: 'flat' },
  burn_fire: { w: 256, h: 256, n: 6, group: 'fire', mode: 'flat' },
  burn_black: { w: 256, h: 256, n: 4, group: 'fire', mode: 'flat' },
  scour_spiral: { w: 256, h: 256, n: 6, group: 'chakra', mode: 'flat' },
  scour_spiral_big: { w: 512, h: 512, n: 3, group: 'chakra', mode: 'flat' },
  cut_wind: { w: 256, h: 256, n: 6, group: 'chakra', mode: 'flat' },
  claw: { w: 512, h: 256, n: 4, group: 'chakra', mode: 'flat', dir: true },
  scorch_chakra: { w: 512, h: 512, n: 3, group: 'chakra', mode: 'flat', dir: true },
  fracture_chakra: { w: 512, h: 512, n: 2, group: 'chakra', mode: 'flat' },
  erasure: { w: 256, h: 256, n: 3, group: 'cursed', mode: 'flat' },
  erasure_trench: { w: 512, h: 256, n: 3, group: 'cursed', mode: 'flat', dir: true, tile: true },
  crush_implode: { w: 256, h: 256, n: 4, group: 'cursed', mode: 'flat' },
  gouge_repel: { w: 512, h: 256, n: 4, group: 'cursed', mode: 'flat', dir: true },
  fracture_cursed: { w: 256, h: 256, n: 4, group: 'cursed', mode: 'flat' },
  fracture_cursed_big: { w: 512, h: 512, n: 2, group: 'cursed', mode: 'flat' },
  scorch_ki: { w: 256, h: 256, n: 4, group: 'ki', mode: 'flat' },
};

// Procedural variants per name: fewer than the hand-made art (texture memory), never fewer than 2 (the engine's
// shuffle bag never repeats a variant back to back). crater_wall keeps 4: two body holes, two round holes.
const procVariants = (name, s) => (name === 'crater_wall' ? 4 : s.w >= 512 && s.h >= 512 ? Math.min(s.n, name === 'crater_big' ? 3 : 2) : Math.min(s.n, s.w >= 512 ? 3 : 4));

// ------------------------------------------------------------------ palettes (art/decals/DECALS.md)
const P = {
  surface: hex('#e3d5bf'), light: hex('#efe6d7'), chip: hex('#f6f0e4'), mid: hex('#d2c1a8'), shade: hex('#c4b29e'),
  deep: hex('#b09a82'), rim: hex('#a58d75'), crack: hex('#8f7663'), deepCrack: hex('#6e5a4a'), pit: hex('#574638'),
  soot1: hex('#4a3f37'), soot2: hex('#3a302a'), soot3: hex('#2a2420'), soot4: hex('#1e1a18'),
  glass1: hex('#5e6b78'), glass2: hex('#8c9aa8'),
  ember1: hex('#7a2a10'), ember2: hex('#c4501a'), ember3: hex('#f08a2a'),
  black1: hex('#141012'), black2: hex('#221a1c'), black3: hex('#3a2226'), black4: hex('#5a1e1e'),
  polish1: hex('#f2eadc'), polish2: hex('#e8dcc8'), polish3: hex('#b8a48c'),
  void1: hex('#3c3a40'), void2: hex('#2e2c33'), void3: hex('#232128'),
  grass1: hex('#73ce63'), grass2: hex('#52ad4c'), grass3: hex('#4ca649'), grass4: hex('#429843'), grass5: hex('#32743a'), grass6: hex('#2d7335'),
  earth1: hex('#8a6a48'), earth2: hex('#6e5236'), earth3: hex('#54402a'), earth4: hex('#3e2f20'),
  brick1: hex('#ddb5a1'), brick2: hex('#c08c74'), brick3: hex('#a87660'), brick4: hex('#8b7669'), brick5: hex('#6e5a50'), brick6: hex('#4a3a34'), brick7: hex('#b89c82'),
  white: [255, 255, 255], w2: hex('#e6e6e6'), w3: hex('#c8c8c8'), w4: hex('#a8a8a8'),
  burnt: hex('#5a1e1e'),
};
const HOT = P.white;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ raster
// A cell's pixels. Everything is opaque or empty, so there are no soft edges to clean up afterwards.
class Raster {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.d = new Uint8ClampedArray(w * h * 4);
  }

  set(x, y, c) {
    x = Math.floor(x); y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4, d = this.d;
    d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
  }

  has(x, y) {
    x = Math.floor(x); y = Math.floor(y);
    return x >= 0 && y >= 0 && x < this.w && y < this.h && this.d[(y * this.w + x) * 4 + 3] > 0;
  }

  erase(x, y) {
    x = Math.floor(x); y = Math.floor(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.d[(y * this.w + x) * 4 + 3] = 0;
  }

  // square brush of width w
  dot(x, y, c, w = 1) {
    const o = Math.floor((w - 1) / 2);
    for (let j = 0; j < w; j++) for (let i = 0; i < w; i++) this.set(x - o + i, y - o + j, c);
  }

  line(x0, y0, x1, y1, c, w = 1) {
    const dx = x1 - x0, dy = y1 - y0;
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
    for (let k = 0; k <= n; k++) this.dot(x0 + (dx * k) / n, y0 + (dy * k) / n, c, w);
  }

  // even-odd scanline fill
  poly(pts, c) {
    let y0 = Infinity, y1 = -Infinity;
    for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const xs = [];
    for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(this.h - 1, Math.ceil(y1)); y++) {
      const sy = y + 0.5;
      xs.length = 0;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > sy) !== (yj > sy)) xs.push(xi + ((sy - yi) / (yj - yi)) * (xj - xi));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) this.set(x, y, c);
      }
    }
  }

  ellipse(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const u = (x + 0.5 - cx) / rx, v = (y + 0.5 - cy) / ry;
        if (u * u + v * v <= 1) this.set(x, y, c);
      }
    }
  }

  // a 1 px circle outline (gaps where `keep` says no)
  circle(cx, cy, r, c, keep = null) {
    const n = Math.max(12, Math.ceil(r * TAU));
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU;
      if (!keep || keep(a)) this.set(cx + Math.cos(a) * r, cy + Math.sin(a) * r, c);
    }
  }
}

// irregular closed outline around (cx, cy)
function blob(R, cx, cy, r, jag = 0.22, n = 16, sx = 1, sy = 1, rot = 0) {
  const pts = [];
  for (let k = 0; k < n; k++) {
    const a = (k / n) * TAU + (R() - 0.5) * (TAU / n) * 0.6;
    const rr = r * (1 + (R() - 0.5) * 2 * jag);
    const x = Math.cos(a) * rr * sx, y = Math.sin(a) * rr * sy;
    pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return pts;
}

// A jagged crack from (x, y) heading `ang`: straight runs that kink (stone breaks in angles, not curls), drifting
// back toward the heading so webs stay radial; tapers and branches. `seam`: paint the hot key along the first part.
function crack(ras, R, x, y, ang, len, o = {}) {
  const { w = 1, color = P.crack, core = P.deepCrack, wiggle = 0.9, step = 4.5, branch = 0.14, depth = 0, seam = 0 } = o;
  let px = x, py = y, a = ang, run = 0;
  while (run < len) {
    a += (R() - 0.5) * wiggle + (ang - a) * 0.45;
    const s = Math.min(len - run + 0.5, step * (0.6 + R() * 0.8));
    const nx = px + Math.cos(a) * s, ny = py + Math.sin(a) * s;
    const ww = run > len * 0.55 ? Math.max(1, w - 1) : w;
    ras.line(px, py, nx, ny, color, ww);
    if (ww >= 2) ras.line(px, py, nx, ny, run < seam ? HOT : core, 1);
    else if (run < seam) ras.line(px, py, nx, ny, HOT, 1);
    if (depth < 2 && R() < branch) {
      const side = R() < 0.5 ? -1 : 1;
      crack(ras, R, nx, ny, a + side * (0.45 + R() * 0.6), (len - run) * (0.3 + R() * 0.45), { ...o, w: Math.max(1, ww - 1), depth: depth + 1, branch: branch * 0.55, seam: 0 });
    }
    px = nx; py = ny; run += s;
  }
  return [px, py];
}

// loose pebbles: 1-3 px chips with a light top pixel (radial shading only, so the highlight sits on the pebble's
// outer side, away from the center)
function pebbles(ras, R, cx, cy, r0, r1, n, cols = [P.shade, P.mid, P.deep], hi = P.chip) {
  for (let k = 0; k < n; k++) {
    const a = R() * TAU, r = r0 + R() * (r1 - r0);
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, s = 1 + Math.floor(R() * 2.4);
    ras.dot(x, y, P.rim, s + 1);
    ras.dot(x, y, cols[k % cols.length], s);
    if (s > 1 && hi) ras.set(x + Math.sign(Math.cos(a)), y + Math.sign(Math.sin(a)), hi);
  }
}

// chunky broken shards around a rim: raised fragments (light top, grout outline)
function shards(ras, R, cx, cy, r, n, size, o = {}) {
  const { top = P.light, edge = P.rim, hi = P.chip, out = 0.15 } = o;
  for (let k = 0; k < n; k++) {
    const a = (k / n) * TAU + (R() - 0.5) * 0.5;
    const rr = r * (1 + (R() - 0.3) * out);
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    const s = size * (0.6 + R() * 0.7);
    const pts = blob(R, x, y, s, 0.35, 5 + Math.floor(R() * 3), 1.3, 0.8, a + Math.PI / 2);
    ras.poly(pts.map(([px, py]) => [px + Math.sign(px - x), py + Math.sign(py - y)]), edge);
    ras.poly(pts, top);
    ras.set(x + Math.cos(a) * s * 0.5, y + Math.sin(a) * s * 0.5, hi);
  }
}

// concentric radial shading: rings of `cols` from the outside in, each a jagged blob
function bowlFill(ras, R, cx, cy, r, cols, sx = 1, sy = 1, rot = 0, jag = 0.12) {
  cols.forEach((c, i) => {
    const rr = r * (1 - (i / cols.length) * 0.82);
    ras.poly(blob(R, cx, cy, rr, jag, 18, sx, sy, rot), c);
  });
}

// ------------------------------------------------------------------ the five painters
// 1. Crack webs: crack_s, crack, fracture_* , cut_wind, rubble.
function crackWeb(ras, R, name, i) {
  const W = ras.w, H = ras.h, cx = W / 2 + (R() - 0.5) * W * 0.06, cy = H / 2 + (R() - 0.5) * H * 0.06, half = W / 2;
  if (name === 'rubble') {
    pebbles(ras, R, W / 2, H / 2, half * 0.42, half * 0.92, 34 + Math.floor(R() * 14));
    shards(ras, R, W / 2, H / 2, half * 0.62, 5 + Math.floor(R() * 3), half * 0.07, { out: 0.6 });
    return;
  }
  if (name === 'crack_s') {
    const arms = 3 + Math.floor(R() * 4);
    for (let k = 0; k < arms; k++) crack(ras, R, cx, cy, (k / arms) * TAU + (R() - 0.5) * 0.9, half * (0.7 + R() * 0.25), { w: k < 2 ? 2 : 1, branch: 0.1 });
    ras.poly(blob(R, cx, cy, 2.5 + R() * 1.5, 0.4, 7), P.crack);
    ras.dot(cx, cy, P.deepCrack, 2);
    for (let k = 0; k < 1 + Math.floor(R() * 3); k++) shards(ras, R, cx, cy, 4 + R() * 3, 1, 1.6, { top: P.mid });
    return;
  }
  if (name === 'crack') {
    const arms = 6 + Math.floor(R() * 5);
    for (let k = 0; k < arms; k++) crack(ras, R, cx, cy, (k / arms) * TAU + (R() - 0.5) * 0.6, half * (0.88 + R() * 0.09), { w: k % 3 ? 2 : 3, branch: 0.2 });
    const dent = W * 0.075;
    bowlFill(ras, R, cx, cy, dent, [P.shade, P.deep, P.crack, P.pit]);
    shards(ras, R, cx, cy, dent * 1.15, 4 + Math.floor(R() * 5), dent * 0.4, { top: P.mid });
    pebbles(ras, R, cx, cy, dent * 1.6, half * 0.75, 5 + Math.floor(R() * 5));
    return;
  }
  if (name === 'cut_wind') {
    // razor-straight wind cuts radiating and crossing, a few slices knocked along them
    const n = 18 + Math.floor(R() * 10);
    for (let k = 0; k < n; k++) {
      const a = R() * TAU, off = (R() - 0.5) * half * 0.5, len = half * (0.8 + R() * 0.9);
      const x0 = cx + Math.cos(a + Math.PI / 2) * off - Math.cos(a) * len / 2, y0 = cy + Math.sin(a + Math.PI / 2) * off - Math.sin(a) * len / 2;
      ras.line(x0, y0, x0 + Math.cos(a) * len, y0 + Math.sin(a) * len, k < 3 ? HOT : k % 3 ? P.crack : P.deepCrack, 1);
    }
    for (let k = 0; k < 3 + Math.floor(R() * 4); k++) {
      const a = R() * TAU, r = half * (0.15 + R() * 0.5), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, s = half * (0.08 + R() * 0.06);
      const pts = [[x - s, y - s * 0.4], [x + s, y - s * 0.6], [x + s * 0.8, y + s * 0.5], [x - s * 0.9, y + s * 0.4]];
      ras.poly(pts.map(([px, py]) => [px + 1, py + 1]), P.deepCrack);
      ras.poly(pts, P.light);
    }
    return;
  }
  // fracture family: a flattened center, ring cracks, radial cracks between them, lifted slab edges outside
  const big = W >= 256;
  const cursed = name.startsWith('fracture_cursed');
  const disc = name === 'fracture_chakra' ? 0.4 : cursed ? 0.24 : 0.3;
  const rings = name === 'fracture_cursed_big' ? [0.42, 0.62, 0.84] : cursed ? [0.62] : [0.55, 0.85];
  // the dish
  if (cursed) {
    // the perfectly round, flattened middle is only outlined: drawn over a crater, a filled disc would plug the bowl
    ras.circle(W / 2, H / 2, half * disc, P.deepCrack);
    ras.circle(W / 2, H / 2, half * disc + 1, P.chip);
  } else {
    ras.poly(blob(R, cx, cy, half * disc, 0.08, 20), P.shade);
    ras.poly(blob(R, cx, cy, half * disc - 2, 0.08, 20), P.mid);
  }
  // ring cracks (perfect circles for cursed, jagged with gaps otherwise)
  for (const fr of rings) {
    const r = half * fr;
    if (cursed) {
      ras.circle(W / 2, H / 2, r, P.deepCrack, (a) => Math.sin(a * 3 + fr * 10) > -0.7);
      continue;
    }
    const gaps = R() * TAU;
    const n = Math.ceil(r * TAU / 3);
    let prev = null;
    for (let k = 0; k <= n; k++) {
      const a = (k / n) * TAU;
      if (Math.sin(a * 2 + gaps) < -0.75) { prev = null; continue; }
      const rr = r * (1 + (R() - 0.5) * 0.06);
      const p = [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
      if (prev) ras.line(prev[0], prev[1], p[0], p[1], fr > 0.8 ? P.crack : P.deepCrack, 1);
      prev = p;
    }
  }
  // radial cracks from the dish edge out (straight segments for the cursed glass)
  const arms = cursed ? (big ? 10 : 7) : 8 + Math.floor(R() * 5);
  for (let k = 0; k < arms; k++) {
    const a = (k / arms) * TAU + (cursed ? 0.1 : (R() - 0.5) * 0.4);
    const r0 = half * disc;
    const len = half * (0.95 - disc) * (0.75 + R() * 0.25);
    const hot = (name === 'fracture_cursed' || name === 'fracture_cursed_big') && k % 4 === 1 ? len * 0.8 : 0;
    if (cursed) {
      // glass: straight runs that turn at sharp angles
      let x = W / 2 + Math.cos(a) * r0, y = H / 2 + Math.sin(a) * r0, ang = a, run = 0;
      while (run < len) {
        const s = half * (0.12 + R() * 0.16);
        const nx = x + Math.cos(ang) * s, ny = y + Math.sin(ang) * s;
        ras.line(x, y, nx, ny, run < hot ? HOT : P.deepCrack, 1);
        x = nx; y = ny; run += s;
        ang = a + (R() - 0.5) * 0.7;
      }
    } else crack(ras, R, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, a, len, { w: 2, branch: 0.18, step: big ? 4 : 3 });
  }
  if (name === 'fracture_lightning') {
    // electric burn tracks zig-zagging between the ring cracks
    for (let k = 0; k < 7; k++) {
      let a = R() * TAU, r = half * (0.3 + R() * 0.2);
      let x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      for (let s = 0; s < 9; s++) {
        a += (R() - 0.5) * 1.4;
        r = Math.min(half * 0.9, r + half * 0.06);
        const nx = cx + Math.cos(a) * r, ny = cy + Math.sin(a) * r;
        ras.line(x, y, nx, ny, s < 3 && k < 3 ? HOT : P.soot2, 1);
        x = nx; y = ny;
      }
    }
    for (let k = 0; k < 30; k++) { const a = R() * TAU, r = half * (0.2 + R() * 0.7); ras.set(cx + Math.cos(a) * r, cy + Math.sin(a) * r, P.soot1); }
  }
  if (name === 'fracture_chakra') {
    // dust and grit swept outward by the pressure: radial streaks across the dish edge
    for (let k = 0; k < 60; k++) {
      const a = R() * TAU, r0 = half * (0.15 + R() * 0.3), r1 = r0 + half * (0.08 + R() * 0.18);
      ras.line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, k % 3 ? P.light : P.deep, 1);
    }
    for (let k = 0; k < 7; k++) { const a = R() * TAU, r = R() * half * 0.12; ras.set(cx + Math.cos(a) * r, cy + Math.sin(a) * r, HOT); }
  }
  if (!cursed) shards(ras, R, cx, cy, half * 0.86, 8 + Math.floor(R() * 5), half * 0.06, { out: 0.12 });
}

// 2. Bowl craters: crater, crater_big, crater_huge, dirt_crater, scour_spiral(_big), crush_implode, erasure.
function bowl(ras, R, name, i) {
  const W = ras.w, H = ras.h, half = W / 2;
  const cx = W / 2 + (R() - 0.5) * W * 0.04, cy = H / 2 + (R() - 0.5) * H * 0.04;
  if (name === 'erasure') {
    // matter erased: a perfect hollow, no rubble, no cracks
    const r = half * (0.7 + R() * 0.1);
    ras.ellipse(W / 2, H / 2, r + 1.5, r + 1.5, P.chip);
    ras.ellipse(W / 2, H / 2, r, r, HOT);
    ras.ellipse(W / 2, H / 2, r - 1, r - 1, P.void1);
    ras.ellipse(W / 2, H / 2, r * 0.72, r * 0.72, P.void2);
    ras.ellipse(W / 2, H / 2, r * 0.42, r * 0.42, P.void3);
    return;
  }
  if (name === 'dirt_crater') {
    const r = half * (0.5 + R() * 0.12);
    // flung clumps first (under the torn turf)
    pebbles(ras, R, cx, cy, r * 1.1, half * 0.95, 26, [P.earth2, P.earth1, P.earth3], P.grass2);
    for (let k = 0; k < 10; k++) {
      const a = R() * TAU, rr = r * (1.15 + R() * 0.6);
      ras.poly(blob(R, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 2 + R() * 2.5, 0.4, 6), k % 2 ? P.grass5 : P.grass4);
    }
    ras.poly(blob(R, cx, cy, r * 1.12, 0.22, 20), P.grass6);
    ras.poly(blob(R, cx, cy, r * 1.04, 0.2, 20), P.grass3);
    bowlFill(ras, R, cx, cy, r * 0.92, [P.earth1, P.earth2, P.earth3, P.earth4], 1, 1, 0, 0.16);
    return;
  }
  const spiral = name.startsWith('scour_spiral');
  const big = name === 'crater_big' || name === 'scour_spiral_big';
  const huge = name === 'crater_huge';
  // bowl size: crater 40-55% of the cell, big 40-50% (deeper), huge 55-70%, spiral bowls about half
  const r = half * (huge ? 0.58 + R() * 0.12 : big ? 0.42 + R() * 0.08 : spiral ? 0.5 : name === 'crush_implode' ? 0.34 : 0.4 + R() * 0.14);
  // shape: round, oval, lopsided or (plain craters) a double dent
  const shape = name === 'crater' ? i % 4 : 0;
  const sx = shape === 1 ? 1.18 : 1, sy = shape === 1 ? 0.84 : 1, rot = R() * Math.PI;
  // long cracks under everything
  const arms = huge ? 8 + Math.floor(R() * 5) : big ? 9 : 7 + Math.floor(R() * 4);
  for (let k = 0; k < arms; k++) {
    const a = (k / arms) * TAU + (R() - 0.5) * 0.5;
    crack(ras, R, cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8, a, half * (huge ? 1.05 : 0.95) - r * 0.8, { w: huge ? 3 : 2, branch: 0.28, step: big || huge ? 4 : 3 });
  }
  if (huge) {
    // inner and outer fracture rings
    for (const k of [1.3, 1.6]) ras.circle(cx, cy, r * k, P.crack, (a) => Math.sin(a * 5 + k * 7) > -0.55);
  }
  if (name === 'crush_implode') {
    // inward-curling cracks spiraling into the pit, slabs dragged toward the center
    for (let k = 0; k < 9; k++) {
      let a = (k / 9) * TAU, rr = half * 0.95;
      let x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      while (rr > r * 0.4) {
        rr -= 3; a += 0.09;
        const nx = cx + Math.cos(a) * rr, ny = cy + Math.sin(a) * rr;
        ras.line(x, y, nx, ny, rr > half * 0.6 ? P.crack : P.deepCrack, rr > half * 0.6 ? 1 : 2);
        x = nx; y = ny;
      }
    }
  }
  // the rubble field around big bowls
  pebbles(ras, R, cx, cy, r * 1.15, half * 0.95, huge ? 60 : big ? 40 : 12);
  // the bowl: radial shading, darker toward the pit
  const cols = huge ? [P.shade, P.deep, P.rim, P.crack, P.deepCrack, P.pit] : big ? [P.shade, P.deep, P.rim, P.crack, P.pit] : [P.shade, P.deep, P.crack, P.pit];
  if (spiral) bowlFill(ras, R, cx, cy, r, [P.polish3, P.polish2, P.polish1], 1, 1, 0, 0.05);
  else bowlFill(ras, R, cx, cy, r, cols, sx, sy, rot);
  if (shape === 2) bowlFill(ras, R, cx + r * 0.35, cy - r * 0.1, r * 0.55, [P.deep, P.crack, P.pit]); // lopsided
  if (shape === 3) {
    const a = R() * TAU;
    bowlFill(ras, R, cx + Math.cos(a) * r * 0.75, cy + Math.sin(a) * r * 0.75, r * 0.6, cols); // double dent
  }
  if (spiral) {
    // grooves ground in as one spiral (arms all turning the same way, out from the middle); the freshest groove,
    // nearest the middle, is the hot key
    const arms = big ? 7 : 5, ph = R() * TAU, turns = 1.1;
    for (let k = 0; k < arms; k++) {
      let prev = null;
      const n = Math.ceil(r * 7);
      for (let s = 0; s <= n; s++) {
        const t = s / n, a = ph + (k / arms) * TAU + t * TAU * turns, rr = r * (0.1 + t * 0.86);
        const p = [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
        if (prev) {
          ras.line(prev[0], prev[1], p[0], p[1], P.deep, t > 0.3 ? 2 : 1);
          ras.line(prev[0], prev[1], p[0], p[1], k === 0 && t < 0.45 ? HOT : P.rim, 1);
        }
        prev = p;
      }
    }
    ras.ellipse(cx, cy, r * 0.12, r * 0.12, P.deep);
    ras.ellipse(cx, cy, r * 0.06, r * 0.06, P.crack);
  }
  if (name === 'crush_implode') {
    // the crushed middle: rubble piled in the pit, slabs pulled in
    pebbles(ras, R, cx, cy, 0, r * 0.55, 26, [P.shade, P.mid, P.deep, P.rim]);
    shards(ras, R, cx, cy, r * 0.8, 6, half * 0.07, { top: P.mid, out: 0.4 });
    return;
  }
  // the broken raised rim
  shards(ras, R, cx, cy, r * 1.04, huge ? 14 : big ? 11 : 6 + Math.floor(R() * 6), half * (huge ? 0.07 : big ? 0.075 : 0.085));
  if (big || huge) {
    // terraced rim and tilted slabs pushed out of the floor (the tilt reads as a darker outer band)
    shards(ras, R, cx, cy, r * 1.32, huge ? 10 : 7, half * 0.05, { top: P.mid });
    const slabs = big ? 3 + Math.floor(R() * 3) : 4;
    for (let k = 0; k < slabs; k++) {
      const a = R() * TAU, rr = r * (1.45 + R() * 0.3), x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr, s = half * 0.11;
      const pts = blob(R, x, y, s, 0.2, 4, 1.4, 0.9, a + Math.PI / 2);
      ras.poly(pts.map(([px, py]) => [px + Math.cos(a) * 2, py + Math.sin(a) * 2]), P.deep);
      ras.poly(pts, P.light);
      ras.line(pts[0][0], pts[0][1], pts[1][0], pts[1][1], P.chip, 1);
    }
  }
  if (spiral) shards(ras, R, cx, cy, r * 1.02, big ? 12 : 8, half * 0.05, { out: big ? 0.5 : 0.15 });
}

// 3. Scorches: burn_lightning(_big), burn_fire, burn_black, scorch_ki.
function scorch(ras, R, name) {
  const W = ras.w, H = ras.h, half = W / 2;
  const cx = W / 2 + (R() - 0.5) * W * 0.05, cy = H / 2 + (R() - 0.5) * H * 0.05;
  if (name === 'burn_fire' || name === 'burn_black') {
    const black = name === 'burn_black';
    const blots = black ? 3 + Math.floor(R() * 2) : 1;
    for (let b = 0; b < blots; b++) {
      const bx = cx + (b ? (R() - 0.5) * half * 0.7 : 0), by = cy + (b ? (R() - 0.5) * half * 0.7 : 0);
      const r = half * (b ? 0.28 + R() * 0.15 : black ? 0.5 : 0.62);
      // flame-tongue edges: the outline bulges in licks
      const n = 28, licks = 6 + Math.floor(R() * 5), ph = R() * TAU;
      const pts = [];
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU;
        const lick = Math.max(0, Math.sin(a * licks + ph)) ** 3;
        const rr = r * (0.85 + lick * 0.45 + (R() - 0.5) * 0.12);
        pts.push([bx + Math.cos(a) * rr, by + Math.sin(a) * rr]);
      }
      if (black) {
        ras.poly(pts.map(([x, y]) => [x + Math.sign(x - bx), y + Math.sign(y - by)]), P.black4);
        ras.poly(pts, P.black3);
        bowlFill(ras, R, bx, by, r * 0.85, [P.black2, P.black1], 1, 1, 0, 0.25);
      } else {
        ras.poly(pts.map(([x, y]) => [x + Math.sign(x - bx) * 2, y + Math.sign(y - by) * 2]), P.ember1);
        ras.poly(pts, P.soot1);
        bowlFill(ras, R, bx, by, r * 0.85, [P.soot2, P.soot3, P.soot4], 1, 1, 0, 0.2);
        // ember rim and hot embers
        for (const [x, y] of pts) if (R() < 0.5) ras.set(x, y, R() < 0.5 ? P.ember2 : P.ember3);
        for (let k = 0; k < 5; k++) { const a = R() * TAU, rr = r * (0.3 + R() * 0.6); ras.dot(bx + Math.cos(a) * rr, by + Math.sin(a) * rr, HOT, 1 + (k % 2)); }
        for (let k = 0; k < 14; k++) { const a = R() * TAU, rr = r * R() * 0.9; ras.set(bx + Math.cos(a) * rr, by + Math.sin(a) * rr, P.shade); }
      }
    }
    return;
  }
  if (name === 'scorch_ki') {
    const rays = 16 + Math.floor(R() * 8);
    for (let k = 0; k < rays; k++) {
      const a = (k / rays) * TAU + (R() - 0.5) * 0.3, len = half * (0.6 + R() * 0.3), wd = 0.05 + R() * 0.06;
      ras.poly([[cx + Math.cos(a - wd) * half * 0.15, cy + Math.sin(a - wd) * half * 0.15], [cx + Math.cos(a) * len, cy + Math.sin(a) * len], [cx + Math.cos(a + wd) * half * 0.15, cy + Math.sin(a + wd) * half * 0.15]], k % 3 ? P.soot1 : P.soot2);
    }
    ras.ellipse(cx, cy, half * 0.3, half * 0.3, P.soot2);
    ras.ellipse(cx, cy, half * 0.22, half * 0.22, P.soot3);
    ras.circle(cx, cy, half * 0.16, HOT);
    ras.ellipse(cx, cy, half * 0.14, half * 0.14, P.glass1);
    ras.ellipse(cx, cy, half * 0.07, half * 0.07, P.glass2);
    return;
  }
  // Lichtenberg figures: forked soot branches with hot seams down the main ones
  const big = name === 'burn_lightning_big';
  const pit = big ? half * 0.35 : half * 0.09;
  if (big) {
    pebbles(ras, R, cx, cy, pit * 1.1, half * 0.9, 30, [P.soot1, P.soot2, P.shade]);
    // soot halo
    for (let k = 0; k < 220; k++) { const a = R() * TAU, rr = pit * (1 + R() * 1.4); ras.set(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, k % 2 ? P.soot1 : P.deep); }
  }
  const mains = big ? 8 + Math.floor(R() * 5) : 5 + Math.floor(R() * 3);
  for (let k = 0; k < mains; k++) {
    const a = (k / mains) * TAU + (R() - 0.5) * 0.5;
    crack(ras, R, cx + Math.cos(a) * pit * 0.8, cy + Math.sin(a) * pit * 0.8, a, half * 0.97 - pit * 0.8, {
      w: big ? 3 : 2, color: P.soot2, core: P.soot3, wiggle: 1.1, step: big ? 4 : 3, branch: 0.55, seam: half * (big ? 0.55 : 0.4),
    });
  }
  if (big) {
    bowlFill(ras, R, cx, cy, pit, [P.glass2, P.glass1, P.soot2, P.soot3], 1, 1, 0, 0.15);
    shards(ras, R, cx, cy, pit * 1.02, 10, half * 0.05, { top: P.glass2, edge: P.soot2, hi: P.chip });
  } else {
    ras.poly(blob(R, cx, cy, pit, 0.3, 10), P.glass1);
    ras.poly(blob(R, cx, cy, pit * 0.55, 0.3, 8), P.glass2);
  }
}

// 4. Directional grooves (motion left to right): scuff, skid, dirt_skid, claw, erasure_trench, gouge_repel,
// scorch_chakra.
function groove(ras, R, name) {
  const W = ras.w, H = ras.h, cy = H / 2;
  if (name === 'erasure_trench') {
    // straight, smooth-walled, seamless along x: every column is the same
    const top = Math.round(H * 0.24), bot = Math.round(H * 0.76);
    for (let x = 0; x < W; x++) {
      ras.set(x, top - 2, P.chip); ras.set(x, bot + 1, P.chip);
      ras.set(x, top - 1, HOT); ras.set(x, bot, HOT);
      for (let y = top; y < bot; y++) {
        const t = Math.abs((y + 0.5 - cy) / ((bot - top) / 2));
        ras.set(x, y, t > 0.78 ? P.void1 : t > 0.4 ? P.void2 : P.void3);
      }
    }
    return;
  }
  if (name === 'scuff') {
    const n = 3 + Math.floor(R() * 4);
    for (let k = 0; k < n; k++) {
      const y = cy + (R() - 0.5) * H * 0.55, x0 = W * (0.06 + R() * 0.2), x1 = W * (0.62 + R() * 0.22);
      ras.line(x0, y, x1, y + (R() - 0.5) * 3, k % 2 ? P.light : P.chip, R() < 0.4 ? 2 : 1);
      for (let g = 0; g < 4; g++) ras.set(x0 + R() * (x1 - x0), y + (R() - 0.5) * 3, P.shade);
    }
    pebbles(ras, R, W * 0.86, cy, 0, H * 0.18, 9, [P.shade, P.rim, P.mid]);
    return;
  }
  if (name === 'skid' || name === 'dirt_skid') {
    const dirt = name === 'dirt_skid';
    const x0 = W * 0.05, x1 = W * 0.84, w0 = H * 0.1, w1 = H * (0.5 + R() * 0.12);
    // ragged broken edges, a little bend: a body plowing through, not a cut
    const bend = (R() - 0.5) * H * 0.12;
    const edge = (t, s) => [x0 + (x1 - x0) * t, cy + Math.sin(t * Math.PI) * bend + s * (w0 + (w1 - w0) * t) / 2 * (1 + (R() - 0.5) * 0.5)];
    const top = [], bot = [];
    for (let k = 0; k <= 26; k++) { top.push(edge(k / 26, -1)); bot.push(edge(k / 26, 1)); }
    const outline = [...top, ...bot.reverse()];
    if (dirt) {
      // torn turf curled up along both sides
      ras.poly(outline.map(([x, y]) => [x, cy + (y - cy) * 1.35]), P.grass5);
      for (const [x, y] of top) ras.dot(x, cy + (y - cy) * 1.3, P.grass1, 2);
      for (const [x, y] of bot) ras.dot(x, cy + (y - cy) * 1.3, P.grass6, 2);
    } else ras.poly(outline.map(([x, y]) => [x, cy + (y - cy) * 1.2]), P.rim);
    ras.poly(outline, dirt ? P.earth2 : P.deep);
    ras.poly(outline.map(([x, y]) => [x, cy + (y - cy) * 0.55]), dirt ? P.earth3 : P.rim);
    // drag streaks along the groove
    for (let k = 0; k < 7; k++) {
      const t0 = 0.1 + R() * 0.4, t1 = t0 + 0.2 + R() * 0.4, off = (R() - 0.5) * 0.8;
      const ya = cy + off * (w0 + (w1 - w0) * t0) / 2, yb = cy + off * (w0 + (w1 - w0) * t1) / 2;
      ras.line(x0 + (x1 - x0) * t0, ya, x0 + (x1 - x0) * t1, yb, dirt ? P.earth4 : k % 2 ? P.crack : P.shade, 1);
    }
    if (!dirt) for (const [x, y] of [...top, ...bot]) if (R() < 0.45) ras.dot(x, cy + (y - cy) * 1.1, R() < 0.5 ? P.chip : P.light, 1 + Math.floor(R() * 2));
    // grit and chunks pushed up at the right end, a few cracks running off the sides
    pebbles(ras, R, x1 + H * 0.04, cy + bend * 0.2, 0, w1 * 0.75, 22, dirt ? [P.earth2, P.earth1, P.earth3] : [P.shade, P.mid, P.deep], dirt ? P.grass2 : P.chip);
    if (!dirt) {
      shards(ras, R, x1 + H * 0.02, cy, w1 * 0.35, 3, H * 0.06, { out: 0.6 });
      for (let k = 0; k < 4; k++) {
        const t = 0.3 + R() * 0.6, s = R() < 0.5 ? -1 : 1, [ex, ey] = edge(t, s);
        crack(ras, R, ex, ey, s * (Math.PI / 2) + (R() - 0.5) * 0.8, H * (0.12 + R() * 0.15), { step: 3, branch: 0 });
      }
    }
    return;
  }
  if (name === 'claw') {
    // four parallel, slightly curved furrows; burnt edges; hot streaks in the bottoms
    const bend = (R() - 0.5) * H * 0.25, gap = H * 0.17, y0 = cy - gap * 1.5;
    for (let k = 0; k < 4; k++) {
      let px = null, py = null;
      for (let s = 0; s <= 40; s++) {
        const t = s / 40, x = W * (0.06 + t * 0.8), y = y0 + k * gap + Math.sin(t * Math.PI) * bend + (R() - 0.5);
        const w = Math.max(1, Math.round(Math.sin(Math.min(1, t * 1.25) * Math.PI) * 5));
        if (px != null) {
          ras.line(px, py, x, y, P.burnt, w + 2);
          ras.line(px, py, x, y, P.pit, w);
          if (t > 0.3 && t < 0.6 && w > 2) ras.line(px, py, x, y, HOT, 1);
        }
        px = x; py = y;
      }
    }
    pebbles(ras, R, W * 0.9, cy, 0, H * 0.35, 24, [P.shade, P.rim, P.deep]);
    return;
  }
  if (name === 'gouge_repel') {
    const n = 5 + Math.floor(R() * 4), ox = W * 0.03;
    for (let k = 0; k < n; k++) {
      const a = (k / (n - 1) - 0.5) * 0.9 + (R() - 0.5) * 0.1, len = W * (0.6 + R() * 0.28);
      const ex = ox + Math.cos(a) * len, ey = cy + Math.sin(a) * len, wd = H * (0.03 + R() * 0.03);
      const nx = -Math.sin(a) * wd, ny = Math.cos(a) * wd;
      const wedge = [[ox, cy], [ex + nx, ey + ny], [ex - nx, ey - ny]];
      ras.poly(wedge.map(([x, y]) => [x + Math.sign(nx), y + Math.sign(ny)]), P.rim);
      ras.poly(wedge, P.deepCrack);
      ras.line(ox, cy, ox + Math.cos(a) * len * 0.3 + nx, cy + Math.sin(a) * len * 0.3 + ny, HOT, 1);
      pebbles(ras, R, ex, ey, 0, H * 0.09, 5, [P.shade, P.rim, P.mid]);
    }
    return;
  }
  // scorch_chakra: a fan blasted open from the middle of the left edge
  const ox = W * 0.02, spread = 0.62;
  const fan = [[ox, cy]];
  for (let k = 0; k <= 14; k++) {
    const a = -spread + (k / 14) * spread * 2, r = W * (0.82 + (R() - 0.5) * 0.12);
    fan.push([ox + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  ras.poly(fan.map(([x, y]) => [x + Math.sign(x - ox) * 2, y + Math.sign(y - cy) * 2]), P.rim);
  ras.poly(fan, P.mid);
  for (let k = 0; k < 70; k++) {
    const a = (R() - 0.5) * spread * 1.9, r0 = W * R() * 0.5, r1 = r0 + W * (0.1 + R() * 0.25);
    ras.line(ox + Math.cos(a) * r0, cy + Math.sin(a) * r0, ox + Math.cos(a) * r1, cy + Math.sin(a) * r1, [P.deep, P.shade, P.light, P.soot1][k % 4], 1);
  }
  for (let k = 0; k < 6; k++) {
    const a = (R() - 0.5) * spread * 1.5, r = W * (0.08 + R() * 0.16);
    ras.line(ox, cy, ox + Math.cos(a) * r, cy + Math.sin(a) * r, HOT, 1);
  }
  pebbles(ras, R, ox, cy, W * 0.78, W * 0.95, 34, [P.shade, P.rim, P.deep]);
}

// 5. Wall holes (face-on): barrier_crack (white-only, tinted at runtime), crater_wall (brick stand wall).
function wallHole(ras, R, name, i) {
  const W = ras.w, H = ras.h, cx = W / 2, cy = H / 2, half = W / 2;
  if (name === 'barrier_crack') {
    // hex cells around the impact, a few knocked out, then straight radial fractures
    const r = half * 0.16, h = r * Math.sqrt(3);
    const cells = [];
    for (let q = -2; q <= 2; q++) {
      for (let s = -2; s <= 2; s++) {
        const x = cx + q * r * 1.5, y = cy + s * h + (q & 1 ? h / 2 : 0);
        const d = Math.hypot(x - cx, y - cy);
        if (d < half * 0.42) cells.push([x, y, d]);
      }
    }
    cells.sort((a, b) => a[2] - b[2]);
    const out = 2 + (i % 3);
    cells.forEach(([x, y], k) => {
      const hexPts = [];
      for (let e = 0; e < 6; e++) hexPts.push([x + Math.cos((e / 6) * TAU) * r, y + Math.sin((e / 6) * TAU) * r]);
      if (k < out) ras.poly(hexPts, P.white);
      for (let e = 0; e < 6; e++) if (k < out || R() < 0.55) ras.line(hexPts[e][0], hexPts[e][1], hexPts[(e + 1) % 6][0], hexPts[(e + 1) % 6][1], k < out + 3 ? P.w2 : P.w3, 1);
    });
    const arms = 7 + Math.floor(R() * 4);
    for (let k = 0; k < arms; k++) {
      const a = (k / arms) * TAU + (R() - 0.5) * 0.4;
      crack(ras, R, cx + Math.cos(a) * half * 0.3, cy + Math.sin(a) * half * 0.3, a, half * (0.6 + R() * 0.08), { w: 1, color: k % 2 ? P.w3 : P.w4, core: P.w3, wiggle: 0.3, step: 4, branch: 0.25 });
    }
    return;
  }
  // crater_wall: variants 0-1 the body-shaped hole of a KO crash, 2-3 a round blast hole. Light from above is
  // allowed here (walls are never rotated): the top inner edge is in shadow.
  const person = i < 2;
  const pts = [];
  if (person) {
    // arms and legs spread, about 70% of the cell tall
    const s = H * 0.7 / 7.4, top = cy - H * 0.35;
    const P2 = (x, y) => pts.push([cx + x * s * (i ? -1 : 1), top + y * s]);
    [[0, 0], [0.8, 0.2], [1, 1], [0.6, 1.7], [1.4, 1.9], [3.1, 0.8], [3.5, 1.3], [1.8, 2.8], [1.4, 4.3], [2.6, 6.8], [2, 7.4], [0.5, 5], [-0.5, 5], [-2, 7.4], [-2.6, 6.8], [-1.4, 4.3], [-1.8, 2.8], [-3.4, 1.9], [-3.1, 1.4], [-1.4, 1.9], [-0.6, 1.7], [-1, 1], [-0.8, 0.2]]
      .forEach(([x, y]) => P2(x, y));
  } else pts.push(...blob(R, cx, cy, half * (0.42 + R() * 0.1), 0.18, 22));
  // cracks through the brick courses: alternating along and across the mortar lines
  for (let k = 0; k < 9; k++) {
    let a = (k / 9) * TAU + R() * 0.4, x = cx + Math.cos(a) * half * 0.3, y = cy + Math.sin(a) * half * 0.3;
    for (let s = 0; s < 8; s++) {
      const horiz = s % 2 === 0;
      const len = half * (0.06 + R() * 0.08);
      const nx = horiz ? x + Math.sign(Math.cos(a) || 1) * len : x, ny = horiz ? y : y + Math.sign(Math.sin(a) || 1) * len * 0.6;
      ras.line(x, y, nx, ny, s < 4 ? P.brick6 : P.brick5, s < 3 ? 2 : 1);
      x = nx; y = ny;
    }
  }
  // broken brick ring, the hole, rubble inside, shadow under the top edge
  const grow = (k) => pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
  ras.poly(grow(1.14), P.brick4);
  ras.poly(grow(1.07), P.brick3);
  ras.poly(pts, P.brick6);
  for (let k = 0; k < 90; k++) {
    const x = cx + (R() - 0.5) * W * 0.8, y = cy + (R() - 0.5) * H * 0.8;
    if (ras.has(x, y) && ras.d[(Math.floor(y) * W + Math.floor(x)) * 4] === P.brick6[0]) ras.dot(x, y, k % 3 ? P.brick5 : P.brick4, 1 + (k % 2));
  }
  for (const [x, y] of grow(1.1)) if (R() < 0.6) ras.dot(x, y, R() < 0.5 ? P.brick2 : P.brick7, 2);
}

const PAINTER = {
  crack_s: crackWeb, crack: crackWeb, fracture_ring: crackWeb, fracture_lightning: crackWeb, fracture_chakra: crackWeb,
  fracture_cursed: crackWeb, fracture_cursed_big: crackWeb, cut_wind: crackWeb, rubble: crackWeb,
  crater: bowl, crater_big: bowl, crater_huge: bowl, dirt_crater: bowl, scour_spiral: bowl, scour_spiral_big: bowl,
  crush_implode: bowl, erasure: bowl,
  burn_lightning: scorch, burn_lightning_big: scorch, burn_fire: scorch, burn_black: scorch, scorch_ki: scorch,
  scuff: groove, skid: groove, dirt_skid: groove, claw: groove, erasure_trench: groove, gouge_repel: groove, scorch_chakra: groove,
  barrier_crack: wallHole, crater_wall: wallHole,
};

const seedOf = (name, i) => [...name].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) >>> 0, 7) + i * 977;

// Paint one name's variants. Returns { w, h, cells: [ImageData-like { w, h, data }] } at half density.
export function paintDecal(name) {
  const s = DECALS[name];
  const w = s.w / 2, h = s.h / 2, n = procVariants(name, s);
  const cells = [];
  for (let i = 0; i < n; i++) {
    const ras = new Raster(w, h);
    PAINTER[name](ras, rng(seedOf(name, i)), name, i);
    cells.push(ras);
  }
  return { w, h, cells };
}

// Shelf-pack the given names into canvas pages (<= max px a side). Returns the packed atlas shape
// { ppu, pages: [canvas], decals: { name: { page, w, h, frames, mode, tinted, group } } }, painting each name once
// (`cache`: name -> paintDecal result, filled in place).
export function bakeDecals(names, cache = new Map(), max = 2048) {
  const items = [];
  for (const name of names) {
    if (!DECALS[name]) continue;
    if (!cache.has(name)) cache.set(name, paintDecal(name));
    const p = cache.get(name);
    p.cells.forEach((c, i) => items.push({ name, i, c }));
  }
  // tallest first; the sort is stable, so each name's cells stay together
  items.sort((a, b) => b.c.h - a.c.h || b.c.w - a.c.w);
  const pages = [], decals = {};
  const newPage = () => { pages.push({ w: 0, h: 0, shelves: [], placed: [] }); return pages[pages.length - 1]; };
  let page = newPage();
  for (const it of items) {
    const { w, h } = it.c;
    let spot = null;
    for (const sh of page.shelves) {
      if (sh.h >= h && sh.x + w <= max) { spot = [sh.x, sh.y]; sh.x += w; break; }
    }
    if (!spot) {
      let y = page.shelves.reduce((m, sh) => Math.max(m, sh.y + sh.h), 0);
      if (y + h > max) { page = newPage(); y = 0; }
      page.shelves.push({ y, h, x: w });
      spot = [0, y];
    }
    page.w = Math.max(page.w, spot[0] + w);
    page.h = Math.max(page.h, spot[1] + h);
    page.placed.push({ it, x: spot[0], y: spot[1] });
    const s = DECALS[it.name];
    const e = decals[it.name] ??= { page: pages.length - 1, w, h, frames: [], mode: s.mode, tinted: !!s.tinted, group: s.group };
    // a name split by a page break keeps the frames on its first page (only the last one or two can spill)
    if (e.page === pages.length - 1) e.frames[it.i] = [spot[0], spot[1]];
  }
  const canvases = pages.map((pg) => {
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, pg.w);
    cv.height = Math.max(1, pg.h);
    const ctx = cv.getContext('2d');
    for (const { it, x, y } of pg.placed) ctx.putImageData(new ImageData(it.c.d, it.c.w, it.c.h), x, y);
    return cv;
  });
  for (const e of Object.values(decals)) e.frames = e.frames.filter(Boolean);
  return { ppu: PROC_PPU, pages: canvases, decals };
}
