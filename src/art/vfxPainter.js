// Procedural pixel VFX frames baked into one atlas. Effects are drawn white/grey
// where they should be tinted at runtime, and in full color where they are fixed.
import { rng } from './pixel.js';

const CELL = 64;

function threshold(ctx, w, h, levels = [0, 255]) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) {
    const a = d[i];
    let best = levels[0];
    for (const l of levels) if (Math.abs(l - a) < Math.abs(best - a)) best = l;
    d[i] = best;
  }
  ctx.putImageData(img, 0, 0);
}

function cell() {
  const c = document.createElement('canvas');
  c.width = CELL;
  c.height = CELL;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  return [c, ctx];
}

// A Rasengan-style ball: blue shells, a white core and spiral streams wound around it in three directions. `spin`
// (0..1) turns the streams so consecutive frames loop.
function sphere(ctx, r, spin) {
  for (const [col, k] of [['#173c9e', 1], ['#2259d0', 0.9], ['#3a8ef0', 0.75], ['#6ec4ff', 0.55]]) {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(0, 0, r * k, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = '#ddf6ff';
  ctx.lineWidth = Math.max(1, r / 10);
  for (let k = 0; k < 3; k++) {
    ctx.save();
    ctx.rotate(k * 1.05 + spin * Math.PI * 2);
    ctx.scale(1, 0.45);
    for (let s = 0; s < 2; s++) {
      ctx.beginPath(); ctx.arc(0, 0, r * (0.8 - s * 0.25), s * Math.PI, s * Math.PI + 2.2); ctx.stroke();
    }
    ctx.restore();
  }
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, 0, Math.max(1.5, r * 0.32), 0, Math.PI * 2); ctx.fill();
}

// a jagged lightning path from (x0, y0) to (x1, y1): `n` kinks up to `j` px off the straight line
function zigzag(R, x0, y0, x1, y1, n = 5, j = 3) {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, pts = [[x0, y0]];
  for (let k = 1; k < n; k++) {
    const s = k / n, o = (R() - 0.5) * 2 * j;
    pts.push([x0 + dx * s + nx * o, y0 + dy * s + ny * o]);
  }
  pts.push([x1, y1]);
  return pts;
}

// one lightning bolt in hard bands: a dark-blue rim, the blue body and a pale core along the same path
function bolt(ctx, pts, w = 2, cols = ['#2350d8', '#7cc8ff', '#e8f7ff']) {
  cols.forEach((c, k) => {
    ctx.strokeStyle = c;
    ctx.lineWidth = Math.max(1, w * (1 - k * 0.38));
    ctx.beginPath();
    pts.forEach(([x, y], s) => (s ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  });
}

// Killua's lightning bands (ENG-SKL-KIL): a violet rim, the cyan body and a near-white core; hot = white-cyan only
const KIL = ['#5534d0', '#62d8ff', '#eafcff'];
const KIL_HOT = ['#b4f0ff', '#ffffff'];

function disc(ctx, x, y, r, col) {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2); ctx.fill();
}

// a thin four-point star: arms `r` long, a `core` center, turned by `rot` (Blue's collapse, the Six Eyes)
function star4(ctx, r, col, core, rot = 0) {
  ctx.save();
  ctx.rotate(rot);
  ctx.fillStyle = col;
  for (let k = 0; k < 4; k++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath(); ctx.moveTo(0, -1.2); ctx.lineTo(r, 0); ctx.lineTo(0, 1.2); ctx.fill();
  }
  ctx.restore();
  disc(ctx, 0, 0, Math.max(1, r * 0.18), core);
}

// `n` short spikes around a sphere, from radius r0 out to r1 (Reversal: Red's repulsion shell); `seed` varies them
function spikes(ctx, r0, r1, n, col, seed = 0) {
  const R = rng(930 + seed);
  ctx.fillStyle = col;
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + R() * 0.3, l = r1 + R() * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a - 0.18) * r0, Math.sin(a - 0.18) * r0);
    ctx.lineTo(Math.cos(a) * l, Math.sin(a) * l);
    ctx.lineTo(Math.cos(a + 0.18) * r0, Math.sin(a + 0.18) * r0);
    ctx.fill();
  }
}

// a thin, slightly hexagonal ring (Infinity's ripple of space); `gap` breaks it into arcs
function hexRing(ctx, r, col, gap = 0) {
  ctx.strokeStyle = col;
  ctx.lineWidth = 1;
  for (let k = 0; k < 6; k++) {
    if (gap && k % 2) continue;
    const a0 = (k / 6) * Math.PI * 2, a1 = ((k + 1) / 6) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(Math.cos(a0) * r, Math.sin(a0) * r); ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r); ctx.stroke();
  }
}

// the Hollow Purple sphere: hard bands from the indigo rim to a white-pink core, swirling bands turned by `spin`
function purpleSphere(ctx, r, spin) {
  for (const [c, k] of [['#2a0a6a', 1], ['#6a1cc8', 0.92], ['#8a2ce8', 0.8], ['#b44cff', 0.64], ['#d070ff', 0.48], ['#ffe8ff', 0.3]]) disc(ctx, 0, 0, r * k, c);
  ctx.lineWidth = Math.max(1, r / 12);
  for (let k = 0; k < 3; k++) {
    ctx.strokeStyle = k === 0 ? '#ff8a8a' : k === 1 ? '#7fe0ff' : '#f0a8ff';
    ctx.beginPath(); ctx.arc(0, 0, r * (0.72 - k * 0.1), spin * Math.PI * 2 + k * 2.1, spin * Math.PI * 2 + k * 2.1 + 1.3); ctx.stroke();
  }
  disc(ctx, 0, 0, Math.max(1, r * 0.14), '#ffffff');
}

// a flame tongue standing on (x, y): `h` tall, `w` wide at its base, its tip swaying by `sway` px
function tongue(ctx, x, y, w, h, sway, col) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.quadraticCurveTo(x - w * 0.45 + sway * 0.3, y - h * 0.55, x + sway, y - h);
  ctx.quadraticCurveTo(x + w * 0.45 + sway * 0.3, y - h * 0.55, x + w / 2, y);
  ctx.fill();
}

// Luffy's skin as packed in his sheet (the stretched limbs join his drawn arm), and Gear Second's pink flush
const LUFFY_SKIN = { light: '#fcc081', base: '#fbba79', mid: '#f9b171', shadow: '#dc8440', deep: '#c97c45', line: '#492610' };
const GEAR2_SKIN = { light: '#f99a96', base: '#f28981', mid: '#f07174', shadow: '#d8655f', deep: '#984e47', line: '#723834' };
// a rubber blow's starburst bands, core to rim
const IMPACT = ['#fff6c8', '#ffe07a', '#ffb43a', '#ff7a1a', '#e8420e', '#a81e0a', '#5a0e06'];

// a horizontal tube from x 0 to `to`: one flat color per row from `y0` down (a stretched limb); `wave` bends it
function rubberTube(ctx, y0, rows, to = 64, wave = 0) {
  for (let x = 0; x < to; x++) {
    const dy = wave ? Math.round(Math.sin(x * 0.5) * wave) : 0;
    rows.forEach((c, k) => { ctx.fillStyle = c; ctx.fillRect(x, y0 + k + dy, 1, 1); });
  }
}

// a clenched fist seen from the side, knuckles to screen-right: the wrist cut flat at x `wx` (`h` px tall, centered on
// `cy`), the fist `k` x 2.3 wrist heights tall
function fist(ctx, wx, cy, h, k, S) {
  const fh = h * 2.3 * k, fw = fh * 1.05, x0 = wx + 1, y0 = cy - fh / 2;
  const round = (x, y, w, hh, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, hh, r); else ctx.rect(x, y, w, hh); ctx.fill(); };
  const kr = fh / 8; // the knuckles: four bumps down the front, one per finger
  ctx.fillStyle = S.line;
  ctx.fillRect(wx, cy - h / 2 - 1, 2, h + 2);
  round(x0, y0 - 1, fw - kr + 1, fh + 2, fh * 0.38);
  for (let f = 0; f < 4; f++) disc(ctx, x0 + fw - kr * 1.2, y0 + kr + f * kr * 2, kr + 1, S.line);
  ctx.fillStyle = S.base;
  round(x0 + 1, y0, fw - kr - 1, fh, fh * 0.36);
  for (let f = 0; f < 4; f++) disc(ctx, x0 + fw - kr * 1.2, y0 + kr + f * kr * 2, kr, f ? S.base : S.light);
  ctx.fillStyle = S.light; ctx.fillRect(x0 + fh * 0.2, y0 + 1, fw * 0.5, Math.max(1, fh * 0.12));
  ctx.fillStyle = S.shadow; ctx.fillRect(x0 + fh * 0.2, y0 + fh * 0.8, fw * 0.6, Math.max(1, fh * 0.14));
  ctx.fillStyle = S.line; // the creases between the fingers, toward the knuckles
  for (let f = 1; f < 4; f++) ctx.fillRect(x0 + fw * 0.5, y0 + f * kr * 2, fw * 0.5 - kr, Math.max(1, fh / 40));
  ctx.fillStyle = S.line; // the thumb wrapped over the fingers
  round(x0 + fw * 0.12, y0 + fh * 0.18, fw * 0.5, fh * 0.22, fh * 0.1);
  ctx.fillStyle = S.deep;
  round(x0 + fw * 0.12 + 1, y0 + fh * 0.18 + 1, fw * 0.5 - 2, fh * 0.22 - 2, fh * 0.1);
}

// `spikes` thick spikes round (0, 0), out to `r`, each drawn in the color bands of `cols` (rim first, core last)
function starburst(ctx, R, r, spikes, width, cols) {
  if (r <= 0) return;
  const bands = [[cols[6], 1], [cols[4], 0.82], [cols[3], 0.66], [cols[2], 0.5], [cols[1], 0.32]];
  const ang = Array.from({ length: spikes }, (_, k) => (k / spikes) * Math.PI * 2 + R() * 0.3);
  const len = ang.map(() => 0.7 + R() * 0.3);
  for (const [c, f] of bands) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ang.forEach((a, k) => {
      const w = (Math.PI / spikes) * width;
      ctx.lineTo(Math.cos(a - w) * r * f * 0.35, Math.sin(a - w) * r * f * 0.35);
      ctx.lineTo(Math.cos(a) * r * f * len[k], Math.sin(a) * r * f * len[k]);
      ctx.lineTo(Math.cos(a + w) * r * f * 0.35, Math.sin(a + w) * r * f * 0.35);
    });
    ctx.closePath();
    ctx.fill();
  }
}

const PAINTERS = {
  // white crescent slash + small star (video-style hit spark)
  spark(i, n, ctx) {
    const t = i / (n - 1);
    ctx.translate(32, 32);
    ctx.rotate(-0.5);
    const r = 12 + t * 14;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r, -1.3, 1.3);
    ctx.arc(-5 - t * 4, 0, r - 2 - (1 - t) * 6, 1.25, -1.25, true);
    ctx.fill();
    if (t < 0.6) {
      ctx.fillStyle = '#fff6c8';
      const s = (1 - t) * 10;
      ctx.beginPath();
      ctx.moveTo(r - 2, -s); ctx.lineTo(r + 1, 0); ctx.lineTo(r - 2, s); ctx.lineTo(r - 5, 0);
      ctx.fill();
      ctx.fillRect(r - 2 - s, -1, s * 2, 2);
    }
    ctx.globalAlpha = 1;
  },
  // radial burst with spikes
  burst(i, n, ctx) {
    const t = i / (n - 1);
    ctx.translate(32, 32);
    const R = rng(77);
    ctx.fillStyle = '#ffffff';
    const spikes = 10;
    ctx.beginPath();
    for (let k = 0; k < spikes * 2; k++) {
      const a = (k / (spikes * 2)) * Math.PI * 2 + R() * 0.2;
      const rr = (k % 2 ? 6 + t * 10 : 14 + t * 16 + R() * 8) * (1 - t * 0.3);
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    if (t > 0.35) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(0, 0, (t - 0.35) * 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  },
  ring(i, n, ctx) {
    const t = i / (n - 1);
    ctx.translate(32, 32);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, 6 * (1 - t));
    ctx.beginPath();
    ctx.ellipse(0, 0, 8 + t * 22, (8 + t * 22) * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
  },
  dust(i, n, ctx) {
    const t = i / (n - 1);
    const R = rng(13);
    ctx.translate(32, 44);
    for (let k = 0; k < 5; k++) {
      const x = (R() - 0.5) * 20 * (0.6 + t), y = -R() * 8 * t - t * 6;
      const r = (4 + R() * 4) * (1 - t * 0.7) + t * 3;
      ctx.fillStyle = k % 2 ? '#e8dccb' : '#cdbda8';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  },
  smoke(i, n, ctx) {
    const t = i / (n - 1);
    const R = rng(29);
    ctx.translate(32, 34);
    for (let k = 0; k < 9; k++) {
      const a = R() * Math.PI * 2;
      const d = 6 + t * 16;
      const r = (7 + R() * 5) * (1 - t * 0.75);
      ctx.fillStyle = k % 3 ? '#f2f0f6' : '#c8c4d6';
      ctx.beginPath(); ctx.arc(Math.cos(a) * d * R(), Math.sin(a) * d * 0.7 * R() - t * 6, r, 0, Math.PI * 2); ctx.fill();
    }
  },
  shuriken(i, n, ctx) {
    ctx.translate(32, 32);
    ctx.rotate((i / n) * (Math.PI / 2));
    ctx.fillStyle = '#5a6070';
    for (let k = 0; k < 4; k++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(0, -2.5); ctx.lineTo(9, 0); ctx.lineTo(0, 2.5); ctx.fill();
    }
    ctx.fillStyle = '#c8d0dc';
    for (let k = 0; k < 4; k++) {
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(2, -1, 5, 1);
    }
    ctx.fillStyle = '#1a1a24';
    ctx.fillRect(-1, -1, 2, 2);
  },
  fire(i, n, ctx) {
    const R = rng(40 + i);
    ctx.translate(32, 32);
    const cols = ['#c42a10', '#f05a14', '#ff9a24', '#ffd04a', '#fff4c0'];
    cols.forEach((c, k) => {
      ctx.fillStyle = c;
      const r = 18 - k * 3.4;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.35) {
        const rr = r + (R() - 0.3) * 5 * (1 - k * 0.15);
        ctx.lineTo(Math.cos(a) * rr - k * 1.2, Math.sin(a) * rr * 0.9);
      }
      ctx.fill();
    });
  },
  flame(i, n, ctx) {
    // white flame tongue, tinted at runtime (aura)
    const t = i / (n - 1);
    ctx.translate(32, 60);
    const h = 22 + Math.sin(t * Math.PI) * 26;
    const w = 7 * (1 - t * 0.5);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-w, 0);
    ctx.quadraticCurveTo(-w * 1.2, -h * 0.5, Math.sin(t * 6) * 4, -h);
    ctx.quadraticCurveTo(w * 1.2, -h * 0.5, w, 0);
    ctx.fill();
  },
  lightning(i, n, ctx) {
    const R = rng(900 + i * 7);
    ctx.translate(32, 32);
    const bolt = (len, w, col) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.beginPath();
      let x = 0, y = 0;
      const a0 = R() * Math.PI * 2;
      ctx.moveTo(0, 0);
      for (let k = 0; k < 6; k++) {
        const a = a0 + (R() - 0.5) * 1.6;
        x += Math.cos(a) * len / 6;
        y += Math.sin(a) * len / 6;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    for (let k = 0; k < 6; k++) bolt(18 + R() * 12, 3, '#ffffff');
    for (let k = 0; k < 4; k++) bolt(12 + R() * 10, 1, '#ffffff');
  },
  orb(i, n, ctx) {
    // rasengan-like swirling sphere (fixed colors)
    ctx.translate(32, 32);
    ctx.fillStyle = '#3a7cf0';
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7ab8ff';
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#e8f6ff';
    ctx.lineWidth = 2;
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      const a = (i / n) * Math.PI * 2 + (k * Math.PI) / 2;
      ctx.arc(0, 0, 4 + k * 2.4, a, a + 2.2);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
  },
  glow(i, n, ctx) {
    // soft-ish round glow (3 alpha levels), tinted at runtime
    ctx.translate(32, 32);
    const r = 26 - (i % 2) * 2;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2); ctx.fill();
  },
  streak(i, n, ctx) {
    // vertical light streak for auras
    const t = i / (n - 1);
    ctx.fillStyle = '#ffffff';
    const h = 40 * Math.sin(t * Math.PI) + 6;
    ctx.fillRect(31, 60 - h - t * 10, 2, h);
    ctx.fillRect(30, 60 - h * 0.6 - t * 10, 4, h * 0.3);
  },
  star(i, n, ctx) {
    const t = i / (n - 1);
    ctx.translate(32, 32);
    const s = 10 * (1 - t) + 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-s, -1, s * 2, 2);
    ctx.fillRect(-1, -s, 2, s * 2);
    ctx.fillRect(-2, -2, 4, 4);
  },
  // radial impact lines (fighting-game hit lines)
  lines(i, n, ctx) {
    const t = i / (n - 1);
    const R = rng(55);
    ctx.translate(32, 32);
    ctx.fillStyle = '#ffffff';
    for (let k = 0; k < 14; k++) {
      const a = (k / 14) * Math.PI * 2 + R() * 0.35;
      const r0 = 7 + t * 12, r1 = r0 + (12 + R() * 12) * (1 - t * 0.55);
      const w = Math.max(0.04, 0.16 - t * 0.12);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a - w) * r0, Math.sin(a - w) * r0);
      ctx.lineTo(Math.cos(a + w) * r0, Math.sin(a + w) * r0);
      ctx.fill();
    }
  },
  // ---- power-up effects (ENG-069): stand-ins until the Codex art in art/vfx/EFFECTS.md is approved
  // chakra bubble: a dot swells round, wobbles, pops into droplets
  bubble(i, n, ctx) {
    ctx.translate(32, 32);
    const ell = (rx, ry, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); };
    if (i < 4) {
      const r = [2.5, 5, 8, 9][i], rx = i === 3 ? 9.5 : r, ry = i === 3 ? 7.5 : r;
      ell(rx, ry, '#ffffff');
      if (r > 4) ell(rx - 2, ry - 2, '#e6e6e6');
      if (r > 4) { ctx.fillStyle = '#ffffff'; ctx.fillRect(-rx * 0.5, -ry * 0.55, 2, 2); }
      return;
    }
    const d = i === 4 ? 7 : 10, s = i === 4 ? 2 : 1;
    ctx.fillStyle = '#ffffff';
    for (let k = 0; k < 4; k++) {
      const a = k * 1.7 + 0.4;
      ctx.fillRect(Math.round(Math.cos(a) * d) - s, Math.round(Math.sin(a) * d * 0.8) - s, s * 2, s * 2);
    }
  },
  // thin S-curved energy wisp licking upward; the tip detaches at the end (base on the bottom anchor)
  wisp(i, n, ctx) {
    const h = [14, 24, 32, 38, 35, 28, 20][i], sway = [0, 2, 3, 0, -3, -4, -5][i], w = 4.5 - i * 0.4;
    ctx.fillStyle = '#ffffff';
    for (let s = 0; s <= 1; s += 0.02) {
      if (i >= 5 && s > 0.62 && s < 0.74) continue;
      const x = 32 + Math.sin(s * Math.PI * 1.6) * 2.5 * s + sway * s * s, y = 60 - h * s;
      const r = Math.max(0.7, w * (1 - s * 0.85));
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  },
  // ONE short electric arc between two points with a fork or two; frames are shown at random
  arc(i, n, ctx) {
    const R = rng(300 + i * 17);
    ctx.translate(32, 32);
    const a0 = R() * Math.PI, L = 10 + R() * 4;
    const pts = [];
    for (let k = 0; k <= 5; k++) {
      const s = k / 5 - 0.5, j = k % 5 ? (R() - 0.5) * 8 : 0;
      pts.push([Math.cos(a0) * L * 2 * s - Math.sin(a0) * j, Math.sin(a0) * L * 2 * s + Math.cos(a0) * j]);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.lineWidth = 1;
    for (let k = 0; k < 1 + (i % 2); k++) {
      const [x, y] = pts[2 + k], a = a0 + (R() < 0.5 ? 1 : -1) * (0.6 + R() * 0.6);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 5, y + Math.sin(a) * 5); ctx.lineTo(x + Math.cos(a + 0.5) * 8, y + Math.sin(a + 0.5) * 8); ctx.stroke();
    }
  },
  // a thin, perfectly round space ripple with a dashed inner echo, breaking into dashes as it grows
  ripple(i, n, ctx) {
    const t = i / (n - 1), r = 10 + t * 20;
    ctx.translate(32, 32);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = [3, 2, 2, 1, 1][i];
    if (i === n - 1) ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#c8c8c8';
    ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.arc(0, 0, r - 4, 0, Math.PI * 2); ctx.stroke();
  },
  // a string for a limb (Effects.limb, ENG-SKL-LUF): a white line on rows 31-32 across the whole cell, the same in every
  // column (it is stretched to any length; tube 1 / 32), tinted at runtime
  strand(i, n, ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 31, 64, 1);
    ctx.fillStyle = '#c8c8c8';
    ctx.fillRect(0, 32, 64, 1);
  },
  // Naruto's one-tail chakra: a thick boiling tail out of the base, sweeping back (to the left) and up, swaying
  naruto_chakraTail(i, n, ctx) {
    const sw = Math.sin((i / n) * Math.PI * 2) * 3;
    const pt = (s) => {
      // cubic from the base (32,60) up and back to the tip
      const p0 = [32, 60], p1 = [21, 54], p2 = [7 + sw * 0.4, 42], p3 = [8 + sw, 17 + sw * 0.4];
      const u = 1 - s;
      return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * s * p1[k] + 3 * u * s * s * p2[k] + s * s * s * p3[k]);
    };
    const dot = (x, y, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
    for (const [col, grow] of [['#c8c8c8', 1.2], ['#ffffff', 0]]) {
      for (let s = 0; s <= 1; s += 0.025) {
        const [x, y] = pt(s);
        dot(x, y, Math.max(1, 6.5 * (1 - s * 0.75)) + grow, col);
      }
    }
    // bubbles boiling along the edge, drifting toward the tip frame by frame
    for (let k = 0; k < 6; k++) {
      const s = ((k / 6 + i / (n * 6)) % 1) * 0.85;
      const [x, y] = pt(s), [x2, y2] = pt(Math.min(1, s + 0.02));
      const nx = -(y2 - y), ny = x2 - x, l = Math.hypot(nx, ny) || 1, side = k % 2 ? 1 : -1;
      const r = 6.5 * (1 - s * 0.75);
      dot(x + (nx / l) * r * side, y + (ny / l) * r * side, Math.max(1, r * 0.45), '#e6e6e6');
    }
  },
  // ---- Naruto's signature techniques (ENG-SKL-NAR, ADR 0044). Stand-ins until Codex's HD art is approved
  // (art/characters/naruto/SKILLS_REVAMP.md): full color, drawn small, never tinted.
  rasengan(i, n, ctx) {
    ctx.translate(32, 32);
    sphere(ctx, 17, i / n);
    // wisps flaring off the rim in the spin direction
    ctx.strokeStyle = '#a8e2ff';
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 4; k++) {
      const a = (i / n) * Math.PI * 2 + k * (Math.PI / 2) + 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, 19 + (k % 2) * 2, a, a + 0.7);
      ctx.stroke();
    }
  },
  rasenganForm(i, n, ctx) {
    const t = i / (n - 1);
    ctx.translate(32, 32);
    // chakra wisps spiraling in, the ball growing at their center
    ctx.strokeStyle = '#6ec4ff';
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 5; k++) {
      const a0 = k * 1.2566 + t * 2.4;
      ctx.beginPath();
      for (let s = 0; s <= 1; s += 0.08) {
        const r = (28 - t * 12) * (1 - s * 0.85), a = a0 + s * 2.6;
        s ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.stroke();
    }
    if (t > 0.1) sphere(ctx, 3 + t * 14, t);
    else { ctx.fillStyle = '#ffffff'; ctx.fillRect(-2, -2, 4, 4); }
  },
  rasenganBurst(i, n, ctx) {
    const t = i / (n - 1);
    ctx.translate(32, 32);
    if (i === 0) {
      // pressed flat against the target, grinding
      ctx.save(); ctx.scale(1, 0.5); sphere(ctx, 20, 0); ctx.restore();
      ctx.fillStyle = '#ffffff';
      for (let k = 0; k < 8; k++) { const a = k * 0.785; ctx.fillRect(Math.cos(a) * 24, Math.sin(a) * 9, 2, 2); }
      return;
    }
    // spiral wind arms thrown outward, the core burning out
    const reach = 10 + t * 21;
    for (const [col, w] of [['#2259d0', 5], ['#6ec4ff', 3], ['#ddf6ff', 1.5]]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = w * (1 - t * 0.5);
      for (let k = 0; k < 5; k++) {
        const a0 = k * 1.2566 + t * 1.8;
        ctx.beginPath();
        for (let s = 0; s <= 1; s += 0.1) {
          const r = 3 + s * reach, a = a0 + s * 2.2;
          if (t > 0.6 && (s * 10) % 3 < 1) { ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); continue; }
          s ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
      }
    }
    const core = 9 * (1 - t);
    if (core > 1) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, core, 0, Math.PI * 2); ctx.fill(); }
  },
  rasenshuriken(i, n, ctx) {
    ctx.translate(32, 32);
    ctx.scale(1, 0.82); // the disc tilted toward the camera
    ctx.rotate((i / n) * (Math.PI / 2));
    for (let k = 0; k < 4; k++) {
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#bfe6ff';
      ctx.beginPath(); ctx.moveTo(8, -5); ctx.quadraticCurveTo(22, -8, 30, 2); ctx.quadraticCurveTo(20, 1, 8, 5); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(9, -4); ctx.quadraticCurveTo(21, -6, 29, 1); ctx.quadraticCurveTo(20, -2, 9, 0); ctx.fill();
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.stroke();
    sphere(ctx, 8, i / n);
  },
  rasenshurikenDome(i, n, ctx) {
    const R = rng(91 + (i % 3));
    ctx.translate(32, 32);
    const r = i < 2 ? 12 + i * 8 : i < 5 ? 29 : 29 + (i - 4) * 1.5;
    const fade = i < 5 ? 1 : 1 - (i - 4) / 4;
    if (i < 5) {
      ctx.fillStyle = '#9fd0f2';
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7fb8ec';
      ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2); ctx.fill();
    }
    // needles of wind crossing everywhere inside it, breaking apart at the end
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    const count = Math.round(40 * fade);
    for (let k = 0; k < count; k++) {
      const a = R() * Math.PI * 2, d = R() * r, l = 4 + R() * 6, b = R() * Math.PI;
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(b) * l, y + Math.sin(b) * l); ctx.stroke();
    }
    if (i === 0) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); }
  },
  poof(i, n, ctx) {
    const t = i / (n - 1);
    const R = rng(33);
    ctx.translate(32, 33);
    if (i === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
      for (let k = 0; k < 6; k++) { const a = k * 1.047; ctx.beginPath(); ctx.arc(Math.cos(a) * 14, Math.sin(a) * 11, 3, 0, Math.PI * 2); ctx.fill(); }
      return;
    }
    const size = t < 0.35 ? 0.75 + t : 1.1 - (t - 0.35) * 0.8;
    for (let k = 0; k < 11; k++) {
      const a = R() * Math.PI * 2, d = (5 + R() * 9) * (1 + t * 1.4);
      const r = (6 + R() * 5) * size;
      ctx.fillStyle = k % 4 === 0 ? '#9aa3b2' : k % 2 ? '#c9d0da' : '#e9edf2';
      ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d * 0.8 - t * 4, Math.max(1, r), 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    if (t < 0.6) { ctx.beginPath(); ctx.arc(-2, -3, 9 * size, 0, Math.PI * 2); ctx.fill(); }
  },
  subLog(i, n, ctx) {
    // bottom anchored: the floor is y = 60. Upright in a puff, then it tips over toward screen-right
    const tilt = [0, 0, 0.35, 1.05, Math.PI / 2][i] ?? Math.PI / 2;
    ctx.translate(36, 60);
    ctx.rotate(tilt);
    ctx.fillStyle = '#6a4326';
    ctx.fillRect(-10, -40, 10, 40);
    ctx.fillStyle = '#8c5a34';
    ctx.fillRect(-8, -40, 4, 40);
    ctx.fillStyle = '#e2c49a';
    ctx.fillRect(-10, -42, 10, 3);
    if (i === 1) { ctx.fillStyle = '#f2e2c4'; ctx.fillRect(-9, -24, 8, 2); } // where the hit landed
    if (i === 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#e9edf2';
      for (const [x, y, r] of [[28, 30, 12], [38, 22, 10], [34, 42, 12], [22, 44, 8]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    }
  },
  fourTailsRoar(i, n, ctx) {
    const t = i / (n - 1);
    const R = rng(55);
    ctx.translate(32, 32);
    if (i === 0) {
      ctx.fillStyle = '#c8281e'; ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a0204'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffe8dc'; ctx.fillRect(-1, -1, 3, 3);
      return;
    }
    // a ring of boiling red-black chakra, bubbles on its rim, then breaking into blobs
    const r = 10 + t * 20;
    const broken = t > 0.55;
    for (const [col, w] of [['#4a0606', 6], ['#c8281e', 3]]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = w * (1 - t * 0.5);
      for (let k = 0; k < 8; k++) {
        if (broken && k % 2) continue;
        const a = k * 0.785 + R() * 0.2;
        ctx.beginPath(); ctx.arc(0, 0, r, a, a + 0.8); ctx.stroke();
      }
    }
    for (let k = 0; k < 10; k++) {
      const a = R() * Math.PI * 2, d = r + (R() - 0.3) * 6;
      ctx.fillStyle = k % 3 ? '#7a0c0c' : '#ff4a2a';
      ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, Math.max(1, 2.5 * (1 - t * 0.6)), 0, Math.PI * 2); ctx.fill();
    }
  },
  // the Tailed Beast Ball gathering: a black-red core, red and blue orbs spiraling into it
  beastBall(i, n, ctx) {
    ctx.translate(32, 32);
    for (const [col, r] of [['#5a0606', 15], ['#1a0204', 12]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); }
    for (let k = 0; k < 8; k++) {
      const a = (i / n) * Math.PI * 2 + k * 0.785, r = 9 + (k % 3) * 4;
      ctx.fillStyle = k % 2 ? '#3a8aff' : '#ff3a2a';
      ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#c8281e';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, 15, (i / n) * 6.28, (i / n) * 6.28 + 4); ctx.stroke();
  },
  // the shock ring round the root of the beam, almost edge-on: a tall thin ellipse
  beastBeamRing(i, n, ctx) {
    const t = i / (n - 1);
    ctx.translate(32, 32);
    ctx.scale(0.25, 1);
    const r = 8 + t * 21;
    ctx.strokeStyle = '#ff6a3a';
    ctx.lineWidth = 8 * (1 - t * 0.6);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#fff4e6';
    ctx.lineWidth = 4 * (1 - t * 0.7);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  },
  // ---- Sasuke's signature techniques (ENG-SKL-SAS). Stand-ins until Codex's HD art is approved
  // (art/characters/sasuke/SKILLS_REVAMP.md): full color, drawn small, never tinted.
  // the Chidori in his hand: a crackling knot, its arcs streaming back (screen-left) behind the running hand
  chidori(i, n, ctx) {
    const R = rng(700 + i * 13);
    ctx.translate(34, 32);
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * Math.PI * 2 + R() * 0.5, back = Math.cos(a) < 0 ? 1.6 : 1;
      const l = (7 + R() * 9) * back;
      bolt(ctx, zigzag(R, 0, 0, Math.cos(a) * l, Math.sin(a) * l * 0.8, 4, 2.2), 2);
    }
    disc(ctx, 0, 0, 5, '#7cc8ff');
    disc(ctx, 0, 0, 3, '#ffffff');
  },
  chidoriForm(i, n, ctx) {
    const t = i / (n - 1), R = rng(720 + i * 7);
    ctx.translate(34, 32);
    for (let k = 0; k < 2 + i * 1.4; k++) {
      const a = R() * Math.PI * 2, l = 3 + t * 13 * R();
      bolt(ctx, zigzag(R, 0, 0, Math.cos(a) * l, Math.sin(a) * l, 3, 1.5), 1 + t);
    }
    if (i === 0) for (let k = 0; k < 5; k++) disc(ctx, (R() - 0.5) * 18, (R() - 0.5) * 18, 1, '#bfe8ff');
    else disc(ctx, 0, 0, 1 + t * 3, '#ffffff');
  },
  // the pierce: a spike of lightning straight through them (screen-right), then bolts bursting out and breaking up
  chidoriBurst(i, n, ctx) {
    const t = i / (n - 1), R = rng(740 + i * 5);
    ctx.translate(30, 32);
    if (i < 2) bolt(ctx, zigzag(R, 0, 0, 33, (R() - 0.5) * 4, 5, 2), 3 + i);
    const count = i < 2 ? 6 : 10, reach = i < 2 ? 14 : i < 4 ? 28 : 30;
    for (let k = 0; k < count; k++) {
      if (i > 4 && R() < 0.4 + (i - 5) * 0.2) continue;
      const a = (k / count) * Math.PI * 2 + R() * 0.4, l = reach * (0.6 + R() * 0.4);
      const r0 = i > 3 ? l * 0.5 : 0;
      bolt(ctx, zigzag(R, Math.cos(a) * r0, Math.sin(a) * r0, Math.cos(a) * l, Math.sin(a) * l, 4, 2.5), i > 4 ? 1 : 2);
    }
    const core = i < 2 ? 6 + i : 5 * (1 - t);
    if (core > 1) { disc(ctx, 0, 0, core + 2, '#7cc8ff'); disc(ctx, 0, 0, core, '#ffffff'); }
  },
  // Chidori Sharp Spear: the blade growing out of the hand (the left edge) to its point, crackling, then breaking up
  chidoriSpear(i, n, ctx) {
    const R = rng(760 + i * 11), len = [22, 42, 62, 62, 62, 62, 62, 62][i] ?? 62;
    disc(ctx, 4, 32, 4, '#7cc8ff');
    disc(ctx, 4, 32, 2, '#ffffff');
    if (i === 7) {
      for (let k = 0; k < 9; k++) disc(ctx, 4 + R() * 56, 32 + (R() - 0.5) * 4, 1, '#bfe8ff');
      return;
    }
    const pts = zigzag(R, 2, 32, len, 32, Math.max(3, len / 6), 1);
    if (i === 6) {
      for (let s = 0; s + 1 < pts.length; s += 2) bolt(ctx, [pts[s], pts[s + 1]], 2);
      return;
    }
    bolt(ctx, pts, 3);
    for (let k = 0; k < 3; k++) {
      const x = 8 + R() * (len - 12), sd = k % 2 ? -1 : 1;
      bolt(ctx, zigzag(R, x, 32, x + 3 + R() * 4, 32 + sd * (4 + R() * 4), 2, 1.5), 1);
    }
    if (i === 2) { disc(ctx, 62, 32, 3, '#ffffff'); }
  },
  // Chidori Current: bolts bursting outward from the edge of his body (left clear for the sprite), then snapping back
  chidoriCurrent(i, n, ctx) {
    const R = rng(780 + i * 3);
    ctx.translate(32, 32);
    const out = [6, 18, 26, 30, 14, 6, 4, 2][i] ?? 2;
    for (let k = 0; k < 12; k++) {
      if (i > 5 && k % 2) continue;
      const a = (k / 12) * Math.PI * 2 + R() * 0.3, ex = Math.cos(a) * 9, ey = Math.sin(a) * 22;
      const ox = Math.cos(a) * out, oy = Math.sin(a) * out * 0.6;
      bolt(ctx, zigzag(R, ex, ey, ex + ox, ey + oy, 3, 2), i < 4 ? 2 : 1);
    }
  },
  // Amaterasu's black flames on a burning body: tall black tongues with dark crimson rims, gaps between them
  amaterasu(i, n, ctx) {
    const ph = (i / n) * Math.PI * 2;
    ctx.translate(32, 60);
    const T = [[-12, 34, 9], [-6, 46, 10], [0, 54, 11], [6, 44, 10], [12, 32, 9], [-3, 26, 12], [8, 22, 10]];
    T.forEach(([x, h, w], k) => {
      const sway = 3 * Math.sin(ph + k * 1.7), hh = h * (0.85 + 0.15 * Math.sin(ph * 2 + k));
      tongue(ctx, x, 0, w + 2, hh + 2, sway, '#5c1226');
      tongue(ctx, x, 0, w, hh, sway, k % 3 ? '#07040a' : '#140a14');
    });
    ctx.fillStyle = '#22101c';
    for (let k = 0; k < 3; k++) ctx.fillRect(-14 + ((i * 7 + k * 11) % 28), -50 - ((i * 5 + k * 9) % 10), 2, 2);
  },
  amaterasuIgnite(i, n, ctx) {
    ctx.translate(32, 32);
    if (i === 0) {
      ctx.strokeStyle = '#5c1226'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.stroke();
      disc(ctx, 0, 0, 3, '#000000');
      return;
    }
    const r = [0, 12, 22, 28, 26, 22][i] ?? 22;
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * Math.PI * 2 - Math.PI / 2, up = i > 2 ? Math.max(0, -Math.sin(a)) : 0;
      ctx.save();
      ctx.rotate(a + Math.PI / 2 - up * 0.6 * Math.sign(Math.cos(a)));
      tongue(ctx, 0, 0, 9, r * (0.7 + up * 0.4), 0, '#5c1226');
      tongue(ctx, 0, 0, 7, r * (0.65 + up * 0.4), 0, '#07040a');
      ctx.restore();
    }
    disc(ctx, 0, 0, Math.max(2, 9 - i), '#000000');
  },
  // the Great Fireball flying screen-right: a rolling sphere, flame tongues streaming back
  greatFireball(i, n, ctx) {
    const ph = (i / n) * Math.PI * 2;
    ctx.translate(35, 32);
    for (let k = 0; k < 5; k++) {
      const y = (k - 2) * 5, l = 16 + 6 * Math.sin(ph + k * 1.3);
      ctx.fillStyle = k % 2 ? '#e8420e' : '#ff7a1a';
      ctx.beginPath(); ctx.moveTo(0, y - 4); ctx.lineTo(-l - 12, y + 2 * Math.sin(ph + k)); ctx.lineTo(0, y + 4); ctx.fill();
    }
    for (const [c, r] of [['#a81e0a', 17], ['#e8420e', 15], ['#ff7a1a', 12.5], ['#ffb43a', 9.5], ['#ffe07a', 6.5], ['#fff6c8', 3.5]]) disc(ctx, 0, 0, r + (r > 10 ? Math.sin(ph * 2 + r) : 0), c);
  },
  greatFireballBurst(i, n, ctx) {
    const R = rng(800);
    ctx.translate(32, 34);
    if (i === 0) {
      ctx.save(); ctx.scale(0.55, 1);
      for (const [c, r] of [['#e8420e', 17], ['#ffb43a', 12], ['#fff6c8', 6]]) disc(ctx, 0, 0, r, c);
      ctx.restore();
      return;
    }
    const size = [0, 0.75, 1, 1, 0.9, 0.7, 0.55, 0.4][i] ?? 0.4, smoke = i >= 4;
    for (let k = 0; k < 9; k++) {
      const a = R() * Math.PI * 2, d = (4 + R() * 12) * (0.6 + size), r = (6 + R() * 5) * size;
      disc(ctx, Math.cos(a) * d, Math.sin(a) * d - (smoke ? i * 1.5 : 0), r, smoke ? (k % 2 ? '#3a2a26' : '#6a5a54') : k % 3 ? '#e8420e' : '#a81e0a');
    }
    if (!smoke) for (const [c, r] of [['#ff7a1a', 12], ['#ffb43a', 8], ['#ffe07a', 4]]) disc(ctx, 0, 0, r * size, c);
    else if (i < 6) disc(ctx, 0, -2, 4, '#ff7a1a');
  },
  // the Kirin's storm: a dark thunderhead across the cell, lit from inside on f1 and f3
  stormCloud(i, n, ctx) {
    const R = rng(820), off = i * 1.5;
    const B = [[6, 36, 9], [16, 30, 12], [28, 27, 13], [40, 29, 12], [52, 33, 10], [60, 38, 7], [22, 38, 10], [44, 39, 10]];
    B.forEach(([x, y, r]) => disc(ctx, x + Math.sin(off + x) * 1.2, y, r, '#1a1e36'));
    B.forEach(([x, y, r]) => disc(ctx, x + Math.sin(off + x) * 1.2, y - r * 0.4, r * 0.6, '#2a3052'));
    B.slice(1, 5).forEach(([x, y, r]) => disc(ctx, x, y - r * 0.75, r * 0.3, '#3e4670'));
    ctx.fillStyle = '#0e1020';
    ctx.fillRect(4, 42, 56, 3);
    if (i % 2) {
      const cx = i === 1 ? 24 : 42;
      disc(ctx, cx, 33, 6, '#7cc8ff');
      disc(ctx, cx, 33, 3, '#bfe8ff');
      if (i === 3) bolt(ctx, zigzag(R, cx, 42, cx + 4, 58, 4, 2), 1.5);
    }
  },
  // the Kirin's body: a thick column of lightning that tiles top to bottom (its core leaves and enters at x 32)
  kirinBody(i, n, ctx) {
    const R = rng(840 + i * 17);
    const core = zigzag(R, 32, 0, 32, 64, 6, 4);
    bolt(ctx, core, 12, ['#141e78', '#3e8cff', '#bfe8ff']);
    bolt(ctx, core, 4, ['#ffffff']);
    for (let k = 0; k < 4; k++) {
      const [x, y] = core[1 + (k % 5)], s = k % 2 ? 1 : -1;
      bolt(ctx, zigzag(R, x, y, x + s * (10 + R() * 14), y + (R() - 0.5) * 12, 3, 2), 1.5);
    }
  },
  // the Kirin diving: a beast head of lightning, snout down, jaws open, its mane streaming up into the body
  kirinHead(i, n, ctx) {
    const R = rng(860 + i * 9);
    for (let k = 0; k < 5; k++) bolt(ctx, zigzag(R, 32 + (k - 2) * 4, 30, 32 + (k - 2) * 7, 0, 4, 3), 2.5);
    ctx.fillStyle = '#3e8cff';
    ctx.beginPath(); ctx.moveTo(18, 26); ctx.lineTo(46, 26); ctx.lineTo(42, 46); ctx.lineTo(36, 61); ctx.lineTo(32, 50); ctx.lineTo(27, 61); ctx.lineTo(22, 46); ctx.fill();
    ctx.fillStyle = '#bfe8ff';
    ctx.beginPath(); ctx.moveTo(22, 28); ctx.lineTo(42, 28); ctx.lineTo(39, 44); ctx.lineTo(35, 56); ctx.lineTo(32, 46); ctx.lineTo(29, 56); ctx.lineTo(25, 44); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(30, 30, 4, 14);
    disc(ctx, 38, 34, 2, '#ffffff');
    bolt(ctx, zigzag(R, 20, 27, 10, 18, 3, 2), 2);
    bolt(ctx, zigzag(R, 44, 27, 54, 18, 3, 2), 2);
  },
  // the Kirin hitting the floor (bottom anchored, the floor is y = 60): the column, the splash and a dome of arcs
  kirinStrike(i, n, ctx) {
    const R = rng(880 + i * 5);
    const colW = [8, 6, 5, 4, 0, 0, 0, 0][i] ?? 0;
    if (colW) bolt(ctx, zigzag(R, 32, 0, 32, 60, 6, 2), colW, ['#3e8cff', '#bfe8ff', '#ffffff']);
    const w = [18, 28, 30, 30, 26, 22, 18, 14][i] ?? 14, h = [4, 14, 20, 20, 14, 8, 5, 3][i] ?? 3;
    const arcs = i < 4 ? 9 : 6 - (i - 4);
    for (let k = 0; k < arcs; k++) {
      const a = Math.PI + (k / Math.max(1, arcs - 1)) * Math.PI, r = 0.6 + R() * 0.4;
      bolt(ctx, zigzag(R, 32, 60, 32 + Math.cos(a) * w * r, 60 + Math.sin(a) * h * r, 3, 2), i < 4 ? 2 : 1);
    }
    if (i < 2) { ctx.fillStyle = '#ffffff'; ctx.fillRect(32 - w * 0.7, 58, w * 1.4, 2); }
  },
  // ---- Luffy's signature techniques (ENG-SKL-LUF). Stand-ins until Codex's HD art is approved
  // (art/characters/luffy/SKILLS_REVAMP.md): full color in his sheet's skin palette, a quarter of the HD cell's pixels.
  // the stretched rubber arm: a tube 10.5 px thick on rows 27-37 like the approved gumArm v03 (rows 107-148 of 256),
  // the same in every column (the engine stretches it)
  gumArm(i, n, ctx) {
    const S = LUFFY_SKIN;
    rubberTube(ctx, 27, [S.line, S.light, S.light, S.base, S.base, S.base, S.base, S.shadow, S.shadow, S.deep, S.line]);
    if (i % 2) { ctx.fillStyle = '#f8e8d1'; ctx.fillRect(0, 24, 64, 1); ctx.fillRect(0, 40, 64, 1); }
  },
  // the Pistol's fist flying screen-right: the wrist cut flat at x 24 on the arm's rows, knuckles at x 40
  gumFist(i, n, ctx) {
    fist(ctx, 24, 32, 6, 1, LUFFY_SKIN);
    ctx.fillStyle = '#f8e8d1';
    for (let k = 0; k < 4; k++) ctx.fillRect(4 + ((i * 5 + k * 7) % 9), k < 2 ? 25 + k * 2 : 36 + (k - 2) * 2, 12 + ((i + k) % 3) * 3, 1);
  },
  // a rubber blow landing: a starburst of thick spikes in hard warm bands, then fragments flying out
  gumImpact(i, n, ctx) {
    ctx.translate(32, 32);
    starburst(ctx, rng(900), [6, 17, 26, 27, 24, 0, 0][i] ?? 0, 9, i < 2 ? 0.55 : 0.45, IMPACT);
    if (i < 3) disc(ctx, 0, 0, [3, 3, 2][i], IMPACT[0]);
    if (i >= 3) {
      const R = rng(910), reach = 18 + (i - 3) * 5;
      for (let k = 0; k < 9 - (i - 3) * 2; k++) {
        const a = R() * Math.PI * 2;
        ctx.fillStyle = k % 2 ? IMPACT[3] : IMPACT[2];
        ctx.fillRect(Math.round(Math.cos(a) * reach), Math.round(Math.sin(a) * reach), 2, 2);
      }
    }
  },
  // the double palm: two palm prints pressing the air, shock fronts curving out to screen-right
  bazookaBlast(i, n, ctx) {
    const t = i / (n - 1);
    if (i < 3) {
      disc(ctx, 30, 26, 4, '#e6dccb'); disc(ctx, 30, 38, 4, '#e6dccb');
      disc(ctx, 30, 26, 2.5, '#f8f4ec'); disc(ctx, 30, 38, 2.5, '#f8f4ec');
    }
    for (let k = 0; k < 4; k++) {
      const r = 6 + k * 7 + t * 16;
      if (r > 34 || (i > 5 && k < 2)) continue;
      ctx.strokeStyle = '#5e4e40'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(30, 32, r, -0.9, 0.9); ctx.stroke();
      ctx.strokeStyle = k % 2 ? '#e6dccb' : '#f8f4ec'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(30, 32, r, -0.9, 0.9); ctx.stroke();
    }
    if (i > 0 && i < 4) for (let k = 0; k < 5; k++) { ctx.fillStyle = k % 2 ? IMPACT[1] : IMPACT[2]; ctx.fillRect(32 + k * 2, 30 + ((k * 7) % 9) - 4, 3, 1); }
  },
  // the Rocket's take-off (bottom anchored, floor y 60): a dust ring, then speed lines shooting up out of a dust plume
  rocketSnap(i, n, ctx) {
    const w = [22, 26, 30, 31, 30, 28][i] ?? 28, h = [4, 7, 9, 8, 6, 4][i] ?? 4;
    for (let k = 0; k < 7; k++) {
      const u = (k / 6 - 0.5) * 2, x = 32 + u * w;
      disc(ctx, x, 60 - h * (1 - Math.abs(u) * 0.6), h * 0.7, i > 3 ? '#cdb9a2' : '#b9a28a');
      disc(ctx, x - 1, 59 - h * (1 - Math.abs(u) * 0.6), h * 0.45, '#e0d0bb');
    }
    if (i >= 1 && i <= 3) {
      ctx.fillStyle = '#f8f4ec';
      for (let k = 0; k < 5; k++) ctx.fillRect(24 + k * 4, 6 + ((k * 13 + i * 5) % 18), 1, 30 - i * 4);
      ctx.fillStyle = '#8a7560';
      for (const x of [21, 43]) for (let y = 20; y < 56; y += 4) ctx.fillRect(x + ((y / 4) % 2), y, 1, 3);
    }
  },
  // the Whip: his stretched shin lashing along y 32 to the sandal at the right, motion arcs sweeping behind it
  whipSweep(i, n, ctx) {
    const tip = [32, 60, 62, 61, 38, 15][i] ?? 15;
    if (i < 4) {
      ctx.strokeStyle = i === 2 ? '#e6dccb' : '#cdb9a2';
      ctx.lineWidth = 1;
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(tip * 0.55, 32, tip * 0.5 - k * 3, -Math.PI * 0.95, -Math.PI * 0.05); ctx.stroke(); }
    }
    rubberTube(ctx, 30, [LUFFY_SKIN.line, LUFFY_SKIN.light, LUFFY_SKIN.base, LUFFY_SKIN.line], tip - 8, i >= 4 ? 1 : 0);
    ctx.fillStyle = '#5a3820'; ctx.fillRect(tip - 9, 28, 3, 8);
    ctx.fillStyle = LUFFY_SKIN.base; ctx.fillRect(tip - 7, 29, 6, 6);
    ctx.fillStyle = '#8a5a34'; ctx.fillRect(tip - 6, 30, 2, 4);
    if (i === 2) { ctx.fillStyle = IMPACT[1]; ctx.fillRect(tip - 1, 26, 1, 3); ctx.fillRect(tip, 31, 3, 1); ctx.fillRect(tip - 1, 35, 1, 3); }
  },
  // Gear Second steam rising off a body (bottom anchored): wisps along both sides and over the head, the body left clear
  gear2Steam(i, n, ctx) {
    const ph = i / n;
    for (let k = 0; k < 9; k++) {
      const side = k % 3, x = side === 0 ? 18 : side === 1 ? 46 : 32, s = side === 2 ? 0 : 1;
      const y = 60 - ((k * 7 + ph * 56) % 56) - (side === 2 ? 4 : 0);
      if (side === 2 && y > 18) continue; // over the head only
      const r = 3 + ((k * 5) % 3) + (60 - y) * 0.04;
      disc(ctx, x + (s ? (side ? 2 : -2) * Math.sin(ph * 6.28 + k) : 0), y, r + 1, '#b87a7a');
      disc(ctx, x + (s ? (side ? 2 : -2) * Math.sin(ph * 6.28 + k) : 0), y - 0.5, r, k % 2 ? '#ffd8d8' : '#fff0f0');
    }
  },
  // Gear Second kicking in: steam bursting out of a body-shaped oval in every direction
  gear2Burst(i, n, ctx) {
    ctx.translate(32, 32);
    const out = [12, 20, 26, 28, 29, 30, 30][i] ?? 30, r = [2, 5, 7, 7, 6, 4, 2][i] ?? 2;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2, x = Math.cos(a) * out * 0.8, y = Math.sin(a) * out - (i > 2 ? i * 1.5 : 0);
      disc(ctx, x, y, r + 1, '#b87a7a');
      disc(ctx, x, y - 0.5, r, k % 2 ? '#ffd8d8' : '#fff0f0');
    }
  },
  // Jet Gatling: a fan of pink rubber arms from his shoulders (the left edge), fists at different reaches
  gatlingFists(i, n, ctx) {
    const R = rng(940 + i * 31);
    for (let k = 0; k < 10; k++) {
      const y0 = 26 + R() * 12, a = (R() - 0.5) * 0.9, len = 24 + R() * 32, x1 = len, y1 = y0 + Math.sin(a) * len * 0.5;
      ctx.strokeStyle = k % 2 ? GEAR2_SKIN.base : GEAR2_SKIN.light; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      fist(ctx, x1 - 2, y1, 2, 1.4, GEAR2_SKIN);
    }
    ctx.fillStyle = IMPACT[1];
    for (let k = 0; k < 3; k++) { const x = 52 + R() * 8, y = 22 + R() * 20; ctx.fillRect(x - 2, y, 5, 1); ctx.fillRect(x, y - 2, 1, 5); }
  },
  // Gear Third's Bone Balloon: rings of air rushing in, then cartoon puffs drifting away (never a solid cloud)
  gear3Puff(i, n, ctx) {
    ctx.translate(32, 32);
    if (i === 0) { disc(ctx, 0, 0, 3, '#c8b89a'); disc(ctx, 0, 0, 2, '#f8f4ec'); return; }
    if (i < 3) for (const r of [5, 9, 13].map((x) => x * (0.6 + i * 0.25))) {
      ctx.strokeStyle = '#8a7560'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#f8f4ec'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    }
    if (i >= 2) for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2, d = 12 + (i - 2) * 4;
      disc(ctx, Math.cos(a) * d, Math.sin(a) * d, 3.5 - (i - 2) * 0.6, '#c8b89a');
      disc(ctx, Math.cos(a) * d - 0.5, Math.sin(a) * d - 0.5, 2.5 - (i - 2) * 0.5, '#f8f4ec');
    }
  },
  // the giant arm: a tube 20 px thick on rows 22-41 (tube 79/256 in moves.js), the same in every column (stretched down the lane)
  gigantArm(i, n, ctx) {
    const S = LUFFY_SKIN;
    rubberTube(ctx, 22, [S.line, S.light, S.light, S.base, S.base, S.base, S.base, S.base, S.base, S.base, S.mid, S.mid, S.mid, S.shadow, S.shadow, S.shadow, S.shadow, S.deep, S.deep, S.line]);
    if (i % 2) { ctx.fillStyle = '#f8e8d1'; for (const y of [18, 20, 43, 45]) ctx.fillRect(0, y, 64, 1); }
  },
  // the giant fist: the wrist cut flat at x 10 on the arm's rows, knuckles at x 57
  gigantFist(i, n, ctx) {
    fist(ctx, 10, 32 + (i % 2), 24, 0.88, LUFFY_SKIN);
    ctx.fillStyle = '#f8e8d1';
    for (let k = 0; k < 4; k++) ctx.fillRect(0, k < 2 ? 12 + k * 3 + (i % 2) : 49 + (k - 2) * 3 - (i % 2), 6 + ((i + k) % 3) * 2, 1);
  },
  // the giant fist landing: a starburst most of the cell wide, stone chips and dust after
  gigantImpact(i, n, ctx) {
    ctx.translate(32, 32);
    starburst(ctx, rng(960), [10, 26, 30, 31, 26, 0, 0, 0][i] ?? 0, 12, 0.5, IMPACT);
    if (i < 2) disc(ctx, 0, 0, 3, IMPACT[0]);
    if (i >= 2) {
      const R = rng(970);
      for (let k = 0; k < 12; k++) {
        const a = R() * Math.PI * 2, d = 10 + (i - 2) * 4 + R() * 6, x = Math.cos(a) * d, y = Math.sin(a) * d + (i - 2) * 1.5;
        if (i >= 5) { disc(ctx, x, y, 3 - (i - 5) * 0.7, k % 2 ? '#cdb9a2' : '#b9a28a'); continue; }
        ctx.fillStyle = k % 3 ? '#8a7560' : '#cdb9a2';
        ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
      }
    }
  },
  // chibi Luffy after Gear Third (bottom anchored, floor y 60): the straw hat, a big head, vest and shorts, flailing
  luffyChibi(i, n, ctx) {
    const hop = i === 2 || i === 3 ? (i === 2 ? 2 : 1) : 0, y = 60 - hop, arm = i % 2 ? -1 : 1;
    ctx.fillStyle = '#100706';
    ctx.fillRect(28, y - 4, 3, 4); ctx.fillRect(33, y - (i >= 4 && i % 2 ? 6 : 4), 3, 4);
    ctx.fillStyle = '#3a64b8'; ctx.fillRect(27, y - 8, 10, 4);
    ctx.fillStyle = '#d8302a'; ctx.fillRect(27, y - 13, 10, 5);
    ctx.fillStyle = LUFFY_SKIN.base;
    ctx.fillRect(24, y - 13 - (arm > 0 ? 3 : 0), 3, 3); ctx.fillRect(37, y - 13 - (arm < 0 ? 3 : 0), 3, 3);
    disc(ctx, 32, y - 18, 6, LUFFY_SKIN.base);
    ctx.fillStyle = '#100706'; ctx.fillRect(34, y - 19, 1, 2); ctx.fillRect(37, y - 19, 1, 2);
    ctx.fillStyle = '#5a1a22'; ctx.fillRect(34, y - 16, 3, i < 2 ? 2 : 1);
    ctx.fillStyle = '#2a2630'; ctx.fillRect(26, y - 23, 12, 3);
    ctx.fillStyle = '#efa638'; ctx.fillRect(22, y - 23, 20, 2); ctx.fillRect(27, y - 27, 10, 4);
    ctx.fillStyle = '#ca2114'; ctx.fillRect(27, y - 24, 10, 1);
  },
  // ---- Killua's lightning (ENG-SKL-KIL): thin, sparse, kinked filaments with violet rims, never a knot or a ball (the
  // Chidori's look); art/characters/killua/SKILLS_REVAMP.md has the full briefs
  // Lightning Palm: a forked bolt flying screen-right, its head at the right edge, the channel trailing back
  lightningPalm(i, n, ctx) {
    const R = rng(900 + i * 7);
    const main = zigzag(R, 3, 32 + (R() - 0.5) * 8, 58, 32, 9, 5);
    bolt(ctx, main, 2.5, KIL);
    for (let k = 0; k < 3; k++) {
      const [x, y] = main[2 + k * 2], sd = k % 2 ? 1 : -1;
      bolt(ctx, zigzag(R, x, y, x - 6 - R() * 8, y + sd * (6 + R() * 8), 3, 2), 1, KIL);
    }
    for (let k = 0; k < 3; k++) bolt(ctx, [[58, 32], [61, 32 + (k - 1) * 3]], 1, KIL_HOT);
    disc(ctx, 58, 32, 1.5, '#ffffff');
  },
  // lightning gathering in an open palm: a small point and filaments snapping out of it
  palmCrackle(i, n, ctx) {
    const R = rng(920 + i * 5);
    ctx.translate(32, 32);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + R() * 0.8, l = 7 + R() * 7;
      bolt(ctx, zigzag(R, 0, 0, Math.cos(a) * l, Math.sin(a) * l, 3, 2), 1, KIL);
    }
    for (let k = 0; k < 4; k++) disc(ctx, (R() - 0.5) * 26, (R() - 0.5) * 26, 0.6, '#b4f0ff');
    disc(ctx, 0, 0, 1.5, '#ffffff');
  },
  // the shock jumping through a body (left clear): the impact on its left edge, filaments bursting off its outline
  palmShock(i, n, ctx) {
    const R = rng(940 + i * 3);
    ctx.translate(32, 32);
    if (i === 0) {
      bolt(ctx, zigzag(R, -32, -2, -9, 0, 4, 2), 2, KIL);
      disc(ctx, -9, 0, 2.5, '#ffffff');
      return;
    }
    const out = [0, 6, 18, 24, 12, 5, 3, 1][i] ?? 1;
    for (let k = 0; k < 10; k++) {
      if (i > 4 && k % 2) continue;
      const a = (k / 10) * Math.PI * 2 + R() * 0.4, ex = Math.cos(a) * 10, ey = Math.sin(a) * 22;
      const reach = out * (Math.cos(a) > 0.3 ? 1.25 : 1);
      bolt(ctx, zigzag(R, ex, ey, ex + Math.cos(a) * reach, ey + Math.sin(a) * reach * 0.6, 3, 2), i < 4 ? 1.5 : 1, KIL);
    }
    if (i === 1) for (let k = 0; k < 3; k++) bolt(ctx, zigzag(R, -9, 0, -9 + 6 + k * 5, (k - 1) * 14, 3, 2), 1, KIL);
  },
  // electrocuted (bottom anchored, the floor is y = 60): a few filaments hopping between points on a standing body
  shockCrawl(i, n, ctx) {
    const R = rng(960 + i * 13);
    const pt = () => { const a = R() * Math.PI * 2; return [32 + Math.cos(a) * 12, 36 + Math.sin(a) * 23]; };
    for (let k = 0; k < 4; k++) {
      const [x0, y0] = pt(), x1 = x0 + (R() - 0.5) * 14, y1 = Math.min(59, y0 + (R() - 0.5) * 14);
      bolt(ctx, zigzag(R, x0, y0, x1, y1, 3, 2), 1, KIL);
    }
    for (let k = 0; k < 5; k++) { const [x, y] = pt(); disc(ctx, x, y, 0.6, '#eafcff'); }
  },
  // Godspeed switching on: filaments bursting from the outline of his body (left clear), the longest straight up
  godspeedBurst(i, n, ctx) {
    const R = rng(980 + i * 3);
    ctx.translate(32, 32);
    const out = [5, 16, 24, 28, 13, 5, 3, 2][i] ?? 2;
    for (let k = 0; k < 12; k++) {
      if (i > 5 && k % 2) continue;
      const a = (k / 12) * Math.PI * 2 + R() * 0.3, ex = Math.cos(a) * 9, ey = Math.sin(a) * 22;
      const up = Math.sin(a) < -0.7 ? 1.4 : 1;
      bolt(ctx, zigzag(R, ex, ey, ex + Math.cos(a) * out, ey + Math.sin(a) * out * 0.6 * up, 3, 2), i < 4 ? 1.5 : 1, KIL);
    }
  },
  // Godspeed on the body (bottom anchored): filaments crawling up a loose field round a standing body, sparks and
  // short arcs bristling above the head (his hair standing up)
  godspeedAura(i, n, ctx) {
    const R = rng(1000 + i * 17);
    for (let k = 0; k < 5; k++) {
      const sd = k % 2 ? 1 : -1, y0 = 58 - R() * 40, x0 = 32 + sd * (10 + R() * 4);
      bolt(ctx, zigzag(R, x0, y0, x0 + sd * (R() - 0.3) * 6, y0 - 6 - R() * 10, 3, 2), 1, KIL);
    }
    bolt(ctx, zigzag(R, 22 + R() * 6, 30 + R() * 20, 38 + R() * 6, 26 + R() * 20, 3, 2), 1, KIL);
    for (let k = 0; k < 3; k++) {
      const x = 26 + R() * 12;
      bolt(ctx, zigzag(R, x, 15, x + (R() - 0.5) * 6, 5 + R() * 4, 2, 2), 1, KIL);
    }
    for (let k = 0; k < 6; k++) disc(ctx, 22 + R() * 20, 4 + R() * 54, 0.6, k % 2 ? '#eafcff' : '#62d8ff');
  },
  // the Godspeed streak: one thin channel edge to edge (laid along his path), then breaking up from both ends
  godspeedStreak(i, n, ctx) {
    const R = rng(1020 + i * 5);
    const pts = zigzag(R, 0, 32, 64, 32, 12, 3);
    pts[0][1] = pts[pts.length - 1][1] = 32; // streaks laid end to end join
    if (i >= 5) { for (let k = 0; k < 6; k++) disc(ctx, R() * 64, 32 + (R() - 0.5) * 6, 0.6, '#b4f0ff'); return; }
    if (i >= 3) {
      const keep = i === 3 ? 0.6 : 0.3;
      for (let s = 0; s + 1 < pts.length; s++) if (Math.abs(s / pts.length - 0.5) < keep / 2 + R() * 0.2) bolt(ctx, [pts[s], pts[s + 1]], 1, KIL);
      return;
    }
    bolt(ctx, pts, i === 2 ? 1.5 : 2, KIL);
    for (let k = 0; k < 3; k++) {
      const [x, y] = pts[2 + k * 3], sd = k % 2 ? 1 : -1;
      bolt(ctx, zigzag(R, x, y, x + 3 + R() * 4, y + sd * (3 + R() * 3), 2, 1), 1, KIL);
    }
  },
  // Narukami's bolt from the sky: a thin kinked column that tiles top to bottom (its core leaves and enters at x 32)
  narukamiBolt(i, n, ctx) {
    const R = rng(1040 + i * 19);
    const core = zigzag(R, 32, 0, 32, 64, 7, 4);
    bolt(ctx, core, 5, KIL);
    bolt(ctx, core, 1.5, ['#ffffff']);
    for (let k = 0; k < 4; k++) {
      const [x, y] = core[1 + (k % 6)], s = k % 2 ? 1 : -1;
      bolt(ctx, zigzag(R, x, y, x + s * (6 + R() * 7), y + (R() - 0.5) * 10, 3, 2), 1, KIL);
    }
  },
  // Narukami hitting the floor (bottom anchored, the floor is y = 60): the channel, the splash and a low dome of arcs
  narukamiStrike(i, n, ctx) {
    const R = rng(1060 + i * 5);
    const colW = [5, 4, 3, 2, 0, 0, 0, 0][i] ?? 0;
    if (colW) bolt(ctx, zigzag(R, 32, 0, 32, 60, 7, 2), colW, KIL);
    const w = [17, 25, 29, 29, 25, 21, 17, 13][i] ?? 13, h = [3, 13, 18, 18, 13, 7, 4, 2][i] ?? 2;
    const arcs = i < 4 ? 9 : 6 - (i - 4);
    for (let k = 0; k < arcs; k++) {
      const a = Math.PI + (k / Math.max(1, arcs - 1)) * Math.PI, r = 0.6 + R() * 0.4;
      bolt(ctx, zigzag(R, 32, 60, 32 + Math.cos(a) * w * r, 60 + Math.sin(a) * h * r, 3, 2), 1, KIL);
    }
    if (i < 2) { ctx.fillStyle = '#eafcff'; ctx.fillRect(32 - w * 0.6, 58, w * 1.2, 2); }
  },
  // his steel yo-yo, almost face-on, spinning, his lightning crackling round it (the string is drawn by the engine)
  yoyo(i, n, ctx) {
    const R = rng(1080 + i * 3);
    ctx.translate(32, 32);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2 + i * 0.9;
      bolt(ctx, zigzag(R, Math.cos(a) * 6, Math.sin(a) * 6, Math.cos(a) * 13, Math.sin(a) * 13, 3, 2), 1, KIL);
    }
    disc(ctx, 0, 0, 7, '#2c3242');
    disc(ctx, 0, 0, 6, '#8e9bb0');
    disc(ctx, -1, -1, 4.5, '#c9d3e0');
    disc(ctx, 0, 0, 2, '#5a6478');
    const a = (Math.floor(i / 2) / 4) * Math.PI * 2;
    for (const q of [a, a + Math.PI]) disc(ctx, Math.cos(q) * 5, Math.sin(q) * 5, 1, '#f4f8fc');
  },
  // ---- ground damage (ADR 0024)
  // side view: a low, wide wall of chunky dust rolling outward and up, then breaking apart (rings of these roll
  // out of big craters, see Effects.dustRing)
  dustWave(i, n, ctx) {
    const t = i / (n - 1);
    const R = rng(61);
    ctx.translate(32, 60);
    const puffs = 9;
    for (let k = 0; k < puffs; k++) {
      const u = k / (puffs - 1) - 0.5;
      const x = u * (30 + t * 22) + (R() - 0.5) * 3;
      const r = (5 + R() * 3) * (1 - t * 0.5) + t * 2;
      const y = -r * 0.7 - (1 - Math.abs(u) * 1.5) * (3 + t * 12);
      if (t > 0.55 && R() < (t - 0.55) * 2.2) continue; // breaking apart
      ctx.fillStyle = '#9c8370';
      ctx.beginPath(); ctx.arc(x, y + 1.5, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = k % 2 ? '#cdb9a2' : '#b39a80';
      ctx.beginPath(); ctx.arc(x, y, r * 0.92, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = k % 3 ? '#e4d2bb' : '#f3eadb';
      ctx.beginPath(); ctx.arc(x - r * 0.15, y - r * 0.3, r * 0.55, 0, Math.PI * 2); ctx.fill();
    }
  },
  // ---- beam clash (ADR 0034): stand-ins until the Codex art in art/vfx/EFFECTS.md is approved. The stream bands
  // tile horizontally (every shape is periodic over the cell width, ends on the center line) and are laid end to end
  // along a stream by Effects.streamBand
  // the knot where two streams meet: a roiling core spraying jagged spikes up and down and back along both streams
  clashBurst(i, n, ctx) {
    const R = rng(410 + i * 13);
    ctx.translate(32, 32);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2;
      const vert = Math.abs(Math.sin(a)); // spikes favour straight up and down: the spray off a collision
      const rr = k % 2 ? 7 + R() * 3 : 10 + vert * (8 + R() * 13) + R() * 4;
      ctx.lineTo(Math.cos(a) * rr * 1.1, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e6e6e6';
    ctx.beginPath(); ctx.arc(0, 0, 6 + (i % 3), 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
    for (let k = 0; k < 5; k++) ctx.fillRect(Math.round((R() - 0.5) * 50), Math.round((R() - 0.5) * 54), 2, 2);
  },
  // Narukami: a thick zigzag of lightning with forks, a different shape each frame
  streamBolt(i, n, ctx) {
    const R = rng(520 + i * 31);
    const zig = (amp, w, col) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(0, 32);
      const pts = [];
      for (let k = 1; k < 8; k++) pts.push([k * 8, 32 + (R() - 0.5) * amp]);
      pts.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(64, 32);
      ctx.stroke();
      return pts;
    };
    zig(12, 3, '#c8c8c8');
    const main = zig(18, 6, '#e6e6e6');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 32); main.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(64, 32); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    for (let k = 0; k < 3; k++) {
      const [x, y] = main[1 + Math.floor(R() * 5)], s = R() < 0.5 ? -1 : 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3 + R() * 4, y + s * (4 + R() * 4)); ctx.lineTo(x + 6 + R() * 4, y + s * (8 + R() * 5)); ctx.stroke();
    }
  },
  // Chidori Spear: a thin straight blade of lightning with crackle around it
  streamLance(i, n, ctx) {
    const R = rng(640 + i * 19);
    ctx.fillStyle = '#c8c8c8';
    ctx.fillRect(0, 26, 64, 12);
    ctx.fillStyle = '#e6e6e6';
    ctx.fillRect(0, 28, 64, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 30, 64, 4);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    for (let k = 0; k < 4; k++) {
      const x = 6 + R() * 48, s = k % 2 ? -1 : 1;
      ctx.beginPath(); ctx.moveTo(x, 32 + s * 6); ctx.lineTo(x + 2 + R() * 3, 32 + s * (9 + R() * 3)); ctx.lineTo(x + 5 + R() * 3, 32 + s * (8 + R() * 6)); ctx.stroke();
    }
  },
  // Great Fireball: a rolling torrent of fire (fixed colors); the bulges are periodic over the cell so it tiles
  streamFlame(i, n, ctx) {
    const cols = ['#c42a10', '#f05a14', '#ff9a24', '#ffd04a', '#fff4c0'];
    const ph = (i / n) * Math.PI * 2;
    cols.forEach((c, k) => {
      ctx.fillStyle = c;
      const base = 13 - k * 2.6;
      for (let x = 0; x < 64; x++) {
        const u = (x / 64) * Math.PI * 2;
        const h = Math.max(1, base + 3 * Math.sin(u * 2 - ph) + 2 * Math.sin(u * 3 + ph * 2 + k));
        ctx.fillRect(x, Math.round(32 - h), 1, Math.round(h * 2));
      }
    });
  },
  // Reversal: Red: a crimson sphere with a white-hot core, a ring pushing outward (fixed colors)
  redOrb(i, n, ctx) {
    ctx.translate(32, 32);
    const t = i / n;
    ctx.strokeStyle = '#ff3048';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 15 + t * 13, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#a00c22';
    ctx.beginPath(); ctx.arc(0, 0, 14 + (i % 2), 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff3048';
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd8dc';
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-1, -1, 3, 0, Math.PI * 2); ctx.fill();
  },
  // ---- Gojo's signature techniques (ENG-SKL-GOJ): stand-ins until the art in art/characters/gojo/SKILLS_REVAMP.md is
  // approved. Lapse: Blue: a small dense sphere, a navy-black eye, cyan bands spiralling in, broken rings of space
  // shrinking onto it
  lapseBlue(i, n, ctx) {
    const t = i / n, R = rng(900 + i);
    ctx.translate(32, 32);
    ctx.lineWidth = 1;
    for (let k = 0; k < 3; k++) {
      const r = 13 + ((k + 1 - t) / 3) * 16;
      ctx.strokeStyle = k % 2 ? '#3aa8ff' : '#7fe0ff';
      for (let s = 0; s < 4; s++) {
        const a0 = (s * Math.PI) / 2 + k * 0.7 + t * 1.6;
        ctx.beginPath(); ctx.arc(0, 0, r, a0, a0 + 0.9); ctx.stroke();
      }
    }
    disc(ctx, 0, 0, 11.5, '#12309a');
    disc(ctx, 0, 0, 10.5, '#1e64e6');
    ctx.strokeStyle = '#7fe0ff';
    ctx.lineWidth = 2;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      for (let s = 0; s <= 8; s++) {
        const u = s / 8, a = k * 2.094 - t * Math.PI * 0.67 + u * 2.4, r = 10 - u * 6;
        if (s) ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.stroke();
    }
    disc(ctx, 0, 0, 4.5, '#0a1650');
    disc(ctx, 0, 0, 3, '#050a24');
    ctx.strokeStyle = '#cff4ff';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#cff4ff';
    for (let k = 0; k < 7; k++) {
      const a = R() * Math.PI * 2, r = 16 + R() * 13;
      ctx.fillRect(Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r), 2, 1);
    }
  },
  // Blue's end: everything crushed into the point, a sharp star, then one thin shock ring (no white disc)
  blueCollapse(i, n, ctx) {
    ctx.translate(32, 32);
    if (i < 3) {
      const r = [11, 7, 3][i];
      ctx.strokeStyle = '#7fe0ff';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, r + [5, 2, 6][i], 0, Math.PI * 2); ctx.stroke();
      disc(ctx, 0, 0, r, i === 2 ? '#7fe0ff' : '#1e64e6');
      disc(ctx, 0, 0, r * 0.45, i === 2 ? '#ffffff' : '#050a24');
      return;
    }
    if (i < 5) star4(ctx, i === 3 ? 13 : 5, '#7fe0ff', '#ffffff');
    if (i === 3) return;
    const r = [0, 0, 0, 0, 20, 27, 29, 30][i];
    ctx.strokeStyle = i < 6 ? '#7fe0ff' : '#3aa8ff';
    ctx.lineWidth = i < 6 ? 2 : 1;
    const arcs = i < 5 ? 1 : 6, gap = i < 5 ? 0 : 0.3 + (i - 5) * 0.25;
    for (let s = 0; s < arcs; s++) {
      const a0 = (s / arcs) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(0, 0, r, a0, a0 + (Math.PI * 2) / arcs - gap); ctx.stroke();
    }
  },
  // Red forming on the raised fingertip: sparks jumping together into a small crimson orb that pushes out a ring
  redForm(i, n, ctx) {
    const R = rng(920);
    ctx.translate(32, 32);
    if (i === 0) {
      ctx.fillStyle = '#ff3a4a';
      for (let k = 0; k < 6; k++) { const a = R() * Math.PI * 2, r = 6 + R() * 10; ctx.fillRect(Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r), 1, 1); }
      return;
    }
    const r = [0, 2, 3, 4.5, 5, 5.5][i];
    if (i >= 2 && i <= 4) {
      ctx.strokeStyle = i === 2 ? '#a00c22' : '#ff3a4a';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, [0, 0, 6, 10, 14][i], 0, Math.PI * 2); ctx.stroke();
    }
    if (i >= 4) spikes(ctx, r, r + 3, 8, '#ff8a8a', i);
    disc(ctx, 0, 0, r + 1, '#5a0614');
    disc(ctx, 0, 0, r, '#e0122e');
    disc(ctx, 0, 0, r * 0.55, '#ffe0dc');
  },
  // Reversal: Red flying screen-right: a compact crimson orb with a white-hot core, a shell of spikes pulsing out, its
  // repulsion wake of half-rings streaming back
  reversalRed(i, n, ctx) {
    const t = i / n;
    ctx.translate(37, 32);
    ctx.lineWidth = 1;
    for (let k = 0; k < 3; k++) {
      const u = (k + t) / 3, x = -8 - u * 20;
      ctx.strokeStyle = u < 0.5 ? '#ff3a4a' : '#a00c22';
      ctx.beginPath(); ctx.arc(x + 12, 0, 6 + u * 9, Math.PI * 0.62, Math.PI * 1.38); ctx.stroke();
    }
    spikes(ctx, 9, 12 + (i % 2) * 2, 10, '#ff8a8a', i);
    disc(ctx, 0, 0, 9.5, '#5a0614');
    disc(ctx, 0, 0, 8.5, '#e0122e');
    disc(ctx, 0, 0, 6.5, '#ff3a4a');
    disc(ctx, 0, 0, 3.5, '#ffe0dc');
    disc(ctx, -0.5, -0.5, 2, '#ffffff');
  },
  // Red hitting: a crimson shock dome and straight spikes blasting out to screen-right, no white-out
  redBurst(i, n, ctx) {
    ctx.translate(30, 32);
    if (i === 0) {
      spikes(ctx, 6, 13, 8, '#ff3a4a', 0);
      disc(ctx, 0, 0, 7, '#e0122e');
      disc(ctx, 0, 0, 4, '#ffe0dc');
      return;
    }
    const r = [0, 16, 26, 31, 31, 31, 31, 31][i];
    if (i < 5) {
      ctx.lineWidth = i < 3 ? 3 : 2;
      ctx.strokeStyle = '#a00c22';
      ctx.beginPath(); ctx.arc(0, 0, r - 2, -1.2, 1.2); ctx.stroke();
      ctx.strokeStyle = '#ff3a4a';
      ctx.lineWidth = i < 3 ? 2 : 1;
      ctx.beginPath(); ctx.arc(0, 0, r, -1.25, 1.25); ctx.stroke();
      if (i > 1) { ctx.strokeStyle = '#ff8a8a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, r * 0.62, -1.1, 1.1); ctx.stroke(); }
    }
    const R = rng(940 + i);
    ctx.fillStyle = i < 4 ? '#ff3a4a' : '#a00c22';
    for (let k = 0; k < 12; k++) {
      const a = (R() - 0.5) * (k % 3 ? 1.8 : 5.6), l = (k % 3 ? 1 : 0.45) * (8 + R() * 24) * Math.min(1, i / 2);
      const d0 = i > 3 ? l * 0.6 : 2;
      if (i > 4) { ctx.fillRect(Math.round(Math.cos(a) * (l + i * 2)), Math.round(Math.sin(a) * (l + i * 2)), 1, 1); continue; }
      ctx.save(); ctx.rotate(a); ctx.fillRect(d0, 0, Math.max(1, l - d0), 1); ctx.restore();
    }
    if (i < 3) disc(ctx, 0, 0, 4 - i, '#ffe0dc');
  },
  // Infinity: hard thin rings of distorted space (slightly hexagonal) where a shot stops, the middle left clear
  infinityRipple(i, n, ctx) {
    ctx.translate(32, 32);
    if (i === 0) { disc(ctx, 0, 0, 2, '#e8f8ff'); hexRing(ctx, 5, '#bff6ff'); return; }
    const base = [0, 8, 12, 17, 19, 20][i], cols = ['#bff6ff', '#8fd0ff', '#4a90d8'];
    for (let k = 0; k < 3; k++) {
      if (i >= 3 && k === 0) continue;
      if (i >= 4 && (k + i) % 2) continue;
      hexRing(ctx, base * (0.5 + k * 0.25) * 1.6, cols[k], i >= 4 ? 0.5 : 0);
    }
  },
  // the Six Eyes: a sharp horizontal gleam with a small four-point star
  sixEyesGlint(i, n, ctx) {
    ctx.translate(32, 32);
    const L = [2, 8, 14, 15, 0, 0][i], S = [2, 4, 9, 7, 5, 1][i];
    if (L) {
      ctx.fillStyle = '#5fe2ff'; ctx.fillRect(-L, 0, L * 2, 1);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-L * 0.5, 0, L, 1);
      if (i === 2) { ctx.fillStyle = '#bff6ff'; ctx.fillRect(-L * 0.6, -1, L * 1.2, 1); }
    }
    star4(ctx, S, '#5fe2ff', '#ffffff', i === 3 ? 0.26 : 0);
  },
  // Red and Blue colliding between his hands: two orbs closing, a two-tone spiral, the violet sphere it becomes
  purpleForm(i, n, ctx) {
    ctx.translate(32, 32);
    if (i < 2) {
      const d = i ? 12 : 22, a = i * 0.6;
      const rx = -Math.cos(a) * d, ry = -Math.sin(a) * d * 0.5;
      disc(ctx, rx, ry, 5, '#e0122e'); disc(ctx, rx, ry, 2.5, '#ffe0dc');
      disc(ctx, -rx, -ry, 5, '#1e64e6'); disc(ctx, -rx, -ry, 2.5, '#050a24');
      return;
    }
    if (i === 2) {
      for (let k = 0; k < 2; k++) {
        ctx.strokeStyle = k ? '#3aa8ff' : '#ff3a4a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let s = 0; s <= 12; s++) { const u = s / 12, a = k * Math.PI + u * 4, r = 9 * (1 - u * 0.7); if (s) ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
        ctx.stroke();
      }
      disc(ctx, 0, 0, 3, '#d070ff');
      return;
    }
    const r = [0, 0, 0, 9, 12, 16, 18, 19][i];
    if (i === 4 || i === 5) { ctx.strokeStyle = '#b44cff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, i === 4 ? 20 : 27, 0, Math.PI * 2); ctx.stroke(); }
    purpleSphere(ctx, r, i / n);
  },
  // Hollow Purple: the huge imaginary mass, a white-pink core, violet bands, a dark indigo rim, crackling magenta arcs
  hollowPurple(i, n, ctx) {
    const R = rng(960 + i);
    ctx.translate(32, 32);
    purpleSphere(ctx, 26, i / n);
    for (let k = 0; k < 2; k++) {
      const a = R() * Math.PI * 2;
      bolt(ctx, zigzag(R, Math.cos(a) * 24, Math.sin(a) * 24, Math.cos(a) * 31, Math.sin(a) * 31, 3, 2), 1, ['#6a1cc8', '#f0a8ff']);
    }
    ctx.fillStyle = '#2a0a6a';
    for (let k = 0; k < 6; k++) { const a = R() * Math.PI * 2, r = 28 + R() * 3; ctx.fillRect(Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r), 2, 2); }
  },
  // Hollow Purple hitting: the target erased: a violet dome, shock rings, then a dark hole closing to nothing
  purpleBurst(i, n, ctx) {
    ctx.translate(32, 32);
    if (i === 0) {
      ctx.strokeStyle = '#d070ff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-10, 0, 24, -1.1, 1.1); ctx.stroke();
      ctx.strokeStyle = '#6a1cc8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-13, 0, 24, -1.1, 1.1); ctx.stroke();
      return;
    }
    if (i === 1) { purpleSphere(ctx, 16, 0.3); return; }
    const rings = [0, 0, [20, 27], [28, 31], [30], [], [], []][i];
    rings.forEach((r, k) => { ctx.strokeStyle = k ? '#b44cff' : '#d070ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); });
    const hole = [0, 0, 8, 12, 9, 6, 3, 0][i];
    if (hole) { disc(ctx, 0, 0, hole + 1.5, '#8a2ce8'); disc(ctx, 0, 0, hole, i === 2 ? '#d070ff' : '#2a0a6a'); }
    const R = rng(980 + i);
    ctx.fillStyle = '#b44cff';
    if (i >= 4) for (let k = 0; k < 10 - i; k++) { const a = R() * Math.PI * 2, r = 14 + i * 2 + R() * 6; ctx.fillRect(Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r), 2, 2); }
  },
  // Unlimited Void: streaks of light racing in from every side onto a bright point (the victim's head)
  voidFlood(i, n, ctx) {
    const R = rng(990), t = i / n;
    ctx.translate(32, 32);
    for (let k = 0; k < 24; k++) {
      const a = R() * Math.PI * 2, ph = (R() + t) % 1, r = 30 - ph * 20, l = 3 + R() * 5;
      if (r - l < 9) continue;
      ctx.strokeStyle = k % 4 ? '#8fc8ff' : '#5a6ce0';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); ctx.lineTo(Math.cos(a) * (r - l), Math.sin(a) * (r - l)); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.round(Math.cos(a) * (r - l)), Math.round(Math.sin(a) * (r - l)), 1, 1);
    }
    ctx.strokeStyle = '#bfe6ff';
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.stroke();
    disc(ctx, 0, 0, i % 2 ? 2.5 : 2, '#ffffff');
  },
  // the void breaking like glass: a black pane cracking from the middle, shards flying out, the middle opening
  voidShatter(i, n, ctx) {
    const R = rng(1000);
    const shards = [];
    for (let k = 0; k < 18; k++) {
      const a0 = (k / 18) * Math.PI * 2, a1 = ((k + 1) / 18) * Math.PI * 2, r0 = 6 + R() * 6, r1 = 34 + R() * 12;
      shards.push({ a0, a1, r0, r1, spin: (R() - 0.5) * 0.6 });
    }
    ctx.translate(32, 32);
    const open = [0, 0, 0, 10, 20, 30, 40, 46][i];
    shards.forEach((s, k) => {
      if (i >= 5 && k % (i - 3)) return;
      const mid = (s.a0 + s.a1) / 2, push = open * (0.8 + (k % 3) * 0.15);
      const ox = Math.cos(mid) * push, oy = Math.sin(mid) * push, r0 = Math.max(s.r0, open), sc = i >= 4 ? 1 - (i - 3) * 0.12 : 1;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(i >= 3 ? s.spin * (i - 2) : 0);
      ctx.scale(sc, sc);
      ctx.fillStyle = k % 2 ? '#05040c' : '#120c30';
      ctx.beginPath();
      ctx.moveTo(Math.cos(s.a0) * r0 - ox, Math.sin(s.a0) * r0 - oy); ctx.lineTo(Math.cos(s.a0) * s.r1 - ox, Math.sin(s.a0) * s.r1 - oy);
      ctx.lineTo(Math.cos(s.a1) * s.r1 - ox, Math.sin(s.a1) * s.r1 - oy); ctx.lineTo(Math.cos(s.a1) * r0 - ox, Math.sin(s.a1) * r0 - oy);
      ctx.closePath();
      ctx.fill();
      if (i >= 1) { ctx.strokeStyle = i >= 2 ? '#e8f8ff' : '#8fc8ff'; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.restore();
    });
    if (i === 0) {
      ctx.strokeStyle = '#8fc8ff';
      ctx.lineWidth = 1;
      for (let k = 0; k < 4; k++) { const a = k * 1.7; bolt(ctx, zigzag(R, 0, 0, Math.cos(a) * 20, Math.sin(a) * 20, 4, 2), 1, ['#8fc8ff', '#e8f8ff']); }
    }
  },
  crater(i, n, ctx) {
    const R = rng(5 + i);
    ctx.translate(32, 32);
    ctx.fillStyle = '#a08a76';
    ctx.beginPath(); ctx.ellipse(0, 0, 17, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b8a28c';
    ctx.beginPath(); ctx.ellipse(1.5, 1.5, 12, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8a735f';
    for (let k = 0; k < 7; k++) { const a = R() * 6.28; ctx.fillRect(Math.cos(a) * 9, Math.sin(a) * 9, 2, 2); }
    ctx.strokeStyle = '#8a735f';
    ctx.lineWidth = 1;
    for (let k = 0; k < 9; k++) {
      const a = R() * Math.PI * 2;
      let x = Math.cos(a) * 16, y = Math.sin(a) * 16;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let s = 0; s < 4; s++) { x += Math.cos(a + (R() - 0.5)) * 4; y += Math.sin(a + (R() - 0.5)) * 4; ctx.lineTo(x, y); }
      ctx.stroke();
    }
  },
};

export const VFX_ANIMS = {
  spark: { n: 5, ms: 30, levels: [0, 255] },
  burst: { n: 5, ms: 35, levels: [0, 255] },
  ring: { n: 6, ms: 35, levels: [0, 255] },
  dust: { n: 6, ms: 60, levels: [0, 255] },
  smoke: { n: 7, ms: 55, levels: [0, 255] },
  shuriken: { n: 4, ms: 40, levels: [0, 255] },
  fire: { n: 4, ms: 60, levels: [0, 255] },
  flame: { n: 7, ms: 55, levels: [0, 255] },
  lightning: { n: 6, ms: 40, levels: [0, 255] },
  orb: { n: 6, ms: 40, levels: [0, 255] },
  glow: { n: 2, ms: 60, levels: [0, 110, 200, 255] },
  streak: { n: 6, ms: 45, levels: [0, 255] },
  star: { n: 5, ms: 40, levels: [0, 255] },
  crater: { n: 3, ms: 1000, levels: [0, 255] },
  lines: { n: 4, ms: 40, levels: [0, 255] },
  // power-ups (ENG-069)
  bubble: { n: 6, ms: 50, levels: [0, 255] },
  wisp: { n: 7, ms: 55, levels: [0, 255] },
  arc: { n: 6, ms: 40, levels: [0, 255] },
  ripple: { n: 5, ms: 50, levels: [0, 255] },
  strand: { n: 1, ms: 100, levels: [0, 255] }, // a limb's string (ENG-SKL-LUF), procedural only
  naruto_chakraTail: { n: 6, ms: 60, levels: [0, 255] },
  // ground damage (ADR 0024)
  dustWave: { n: 6, ms: 60, levels: [0, 255] },
  // beam clash (ADR 0034)
  clashBurst: { n: 6, ms: 45, levels: [0, 255] },
  streamBolt: { n: 4, ms: 40, levels: [0, 255] },
  streamLance: { n: 4, ms: 40, levels: [0, 255] },
  streamFlame: { n: 4, ms: 50, levels: [0, 255] },
  redOrb: { n: 6, ms: 40, levels: [0, 255] },
  // Naruto's signature techniques (ENG-SKL-NAR): HD art cells when packed (ADR 0044), these small stand-ins until then
  rasengan: { n: 8, ms: 40, levels: [0, 255] },
  rasenganForm: { n: 6, ms: 45, levels: [0, 255] },
  rasenganBurst: { n: 8, ms: 45, levels: [0, 255] },
  rasenshuriken: { n: 8, ms: 35, levels: [0, 255] },
  rasenshurikenDome: { n: 8, ms: 50, levels: [0, 255] },
  poof: { n: 7, ms: 40, levels: [0, 255] },
  subLog: { n: 5, ms: 70, levels: [0, 255] },
  fourTailsRoar: { n: 8, ms: 45, levels: [0, 255] },
  beastBall: { n: 8, ms: 45, levels: [0, 255] },
  beastBeamRing: { n: 6, ms: 40, levels: [0, 255] },
  // Sasuke's signature techniques (ENG-SKL-SAS): HD art cells when packed (ADR 0044), these small stand-ins until then
  chidori: { n: 8, ms: 35, levels: [0, 255] },
  chidoriForm: { n: 6, ms: 40, levels: [0, 255] },
  chidoriBurst: { n: 8, ms: 40, levels: [0, 255] },
  chidoriSpear: { n: 8, ms: 35, levels: [0, 255] },
  chidoriCurrent: { n: 8, ms: 40, levels: [0, 255] },
  amaterasu: { n: 8, ms: 60, levels: [0, 255] },
  amaterasuIgnite: { n: 6, ms: 45, levels: [0, 255] },
  greatFireball: { n: 8, ms: 45, levels: [0, 255] },
  greatFireballBurst: { n: 8, ms: 50, levels: [0, 255] },
  stormCloud: { n: 4, ms: 120, levels: [0, 255] },
  kirinBody: { n: 4, ms: 40, levels: [0, 255] },
  kirinHead: { n: 6, ms: 40, levels: [0, 255] },
  kirinStrike: { n: 8, ms: 45, levels: [0, 255] },
  // Luffy's signature techniques (ENG-SKL-LUF): HD art cells when packed (ADR 0044), these small stand-ins until then
  gumArm: { n: 2, ms: 60, levels: [0, 255] },
  gumFist: { n: 4, ms: 40, levels: [0, 255] },
  gumImpact: { n: 7, ms: 35, levels: [0, 255] },
  bazookaBlast: { n: 8, ms: 45, levels: [0, 255] },
  rocketSnap: { n: 6, ms: 45, levels: [0, 255] },
  whipSweep: { n: 6, ms: 40, levels: [0, 255] },
  gear2Steam: { n: 8, ms: 60, levels: [0, 255] },
  gear2Burst: { n: 7, ms: 45, levels: [0, 255] },
  gatlingFists: { n: 6, ms: 35, levels: [0, 255] },
  gear3Puff: { n: 6, ms: 45, levels: [0, 255] },
  gigantArm: { n: 2, ms: 60, levels: [0, 255] },
  gigantFist: { n: 4, ms: 40, levels: [0, 255] },
  gigantImpact: { n: 8, ms: 50, levels: [0, 255] },
  luffyChibi: { n: 6, ms: 80, levels: [0, 255] },
  // Gojo's signature techniques (ENG-SKL-GOJ): HD art cells when packed (ADR 0044), these small stand-ins until then
  lapseBlue: { n: 8, ms: 40, levels: [0, 255] },
  blueCollapse: { n: 8, ms: 40, levels: [0, 255] },
  redForm: { n: 6, ms: 40, levels: [0, 255] },
  reversalRed: { n: 8, ms: 40, levels: [0, 255] },
  redBurst: { n: 8, ms: 40, levels: [0, 255] },
  infinityRipple: { n: 6, ms: 40, levels: [0, 255] },
  sixEyesGlint: { n: 6, ms: 35, levels: [0, 255] },
  purpleForm: { n: 8, ms: 40, levels: [0, 255] },
  hollowPurple: { n: 8, ms: 45, levels: [0, 255] },
  purpleBurst: { n: 8, ms: 45, levels: [0, 255] },
  voidFlood: { n: 8, ms: 40, levels: [0, 255] },
  voidShatter: { n: 8, ms: 50, levels: [0, 255] },
  // Killua's lightning (ENG-SKL-KIL): HD art cells when packed (ADR 0044), these small stand-ins until then
  lightningPalm: { n: 8, ms: 30, levels: [0, 255] },
  palmCrackle: { n: 6, ms: 35, levels: [0, 255] },
  palmShock: { n: 8, ms: 40, levels: [0, 255] },
  shockCrawl: { n: 6, ms: 50, levels: [0, 255] },
  godspeedBurst: { n: 8, ms: 40, levels: [0, 255] },
  godspeedAura: { n: 8, ms: 40, levels: [0, 255] },
  godspeedStreak: { n: 6, ms: 30, levels: [0, 255] },
  narukamiBolt: { n: 4, ms: 40, levels: [0, 255] },
  narukamiStrike: { n: 8, ms: 45, levels: [0, 255] },
  yoyo: { n: 8, ms: 30, levels: [0, 255] },
};

// Bake atlas: CELL px frames, each effect's strip in a block `cols` cells wide starting at cell column `col`, several
// blocks side by side in a 2048 px wide atlas, so it stays far under a phone's 4096 px texture limit however many
// stand-ins there are (one strip per row was 4608 px tall at 72 effects; ADR 0053).
export function bakeVfx() {
  const names = Object.keys(VFX_ANIMS);
  const cols = Math.max(...names.map((k) => VFX_ANIMS[k].n));
  const across = Math.max(1, Math.floor(2048 / (cols * CELL)));
  const atlas = document.createElement('canvas');
  atlas.width = across * cols * CELL;
  atlas.height = Math.ceil(names.length / across) * CELL;
  const actx = atlas.getContext('2d', { willReadFrequently: true });
  const meta = { cell: CELL, cols: across * cols, rows: atlas.height / CELL, anims: {} };
  names.forEach((name, k) => {
    const a = VFX_ANIMS[name], row = Math.floor(k / across), col = (k % across) * cols;
    for (let i = 0; i < a.n; i++) {
      const [c, ctx] = cell();
      ctx.save();
      PAINTERS[name](i, a.n, ctx);
      ctx.restore();
      threshold(ctx, CELL, CELL, a.levels);
      actx.drawImage(c, (col + i) * CELL, row * CELL);
    }
    meta.anims[name] = { row, col, n: a.n, ms: a.ms };
  });
  return { canvas: atlas, meta };
}
