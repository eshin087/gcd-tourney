// Procedural pixel-art textures for the tournament grounds. Everything is drawn
// into small canvases and sampled with nearest filtering.
import * as THREE from 'three';
import { rng } from './pixel.js';

export function toTex(canvas, repeat = null) {
  const t = new THREE.CanvasTexture(canvas);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  return [c, ctx];
}

const shift = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt * 0.85));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
};

function speckle(ctx, x, y, w, h, base, R, density = 0.08, amt = 8) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (R() < density) {
      ctx.fillStyle = shift(base, (R() < 0.5 ? -1 : 1) * amt);
      ctx.fillRect(x + i, y + j, 1, 1);
    }
  }
}

// Pixel-crisp text: draw antialiased, then threshold alpha.
export function pixelText(ctx, text, x, y, size, color, font = '"Yu Gothic UI","Yu Gothic","Meiryo","Hiragino Sans","Noto Sans JP",sans-serif', weight = 900, align = 'center') {
  const [c, cx] = makeCanvas(ctx.canvas.width, ctx.canvas.height);
  cx.imageSmoothingEnabled = false;
  cx.font = `${weight} ${size}px ${font}`;
  cx.textAlign = align;
  cx.textBaseline = 'middle';
  cx.fillStyle = color;
  cx.fillText(text, x, y);
  const img = cx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 110 ? 255 : 0;
  cx.putImageData(img, 0, 0);
  ctx.drawImage(c, 0, 0);
}

// ---------------------------------------------------------------- ring tiles
export function ringTopTexture(tiles = 18, px = 24) {
  const R = rng(7);
  const S = tiles * px;
  const [c, ctx] = makeCanvas(S, S);
  const shades = ['#eadbc6', '#e4d2bb', '#ddc9b0', '#d6c0a6', '#cfb79c', '#e9dfcf', '#d9c4aa', '#c8ad92'];
  for (let ty = 0; ty < tiles; ty++) {
    for (let tx = 0; tx < tiles; tx++) {
      let base = shades[Math.floor(R() * shades.length)];
      if (R() < 0.06) base = '#bfa489';
      const x = tx * px, y = ty * px;
      ctx.fillStyle = base;
      ctx.fillRect(x, y, px, px);
      speckle(ctx, x, y, px, px, base, R, 0.05, 7);
      // bevel
      ctx.fillStyle = shift(base, 10);
      ctx.fillRect(x + 1, y + 1, px - 2, 1);
      ctx.fillRect(x + 1, y + 1, 1, px - 2);
      ctx.fillStyle = shift(base, -14);
      ctx.fillRect(x + 1, y + px - 2, px - 2, 1);
      ctx.fillRect(x + px - 2, y + 1, 1, px - 2);
      // grout
      ctx.fillStyle = '#a99079';
      ctx.fillRect(x, y, px, 1);
      ctx.fillRect(x, y, 1, px);
      // little chip marks like the reference arena
      if (R() < 0.13) {
        const cx = x + 5 + Math.floor(R() * (px - 10)), cy = y + 5 + Math.floor(R() * (px - 10));
        ctx.fillStyle = '#8f7663';
        const k = R() < 0.5;
        for (let i = -2; i <= 2; i++) {
          ctx.fillRect(cx + i, cy + (k ? i : -i), 1, 1);
          if (Math.abs(i) < 2) ctx.fillRect(cx + i, cy + (k ? -i : i), 1, 1);
        }
      }
    }
  }
  // a few long cracks
  ctx.fillStyle = '#9c8370';
  for (let k = 0; k < 7; k++) {
    let x = Math.floor(R() * S), y = Math.floor(R() * S);
    for (let i = 0; i < 18 + R() * 20; i++) {
      ctx.fillRect(x, y, 1, 1);
      x += R() < 0.6 ? 1 : 0;
      y += R() < 0.5 ? 1 : -1 * (R() < 0.3 ? 1 : 0);
    }
  }
  // outer border band
  ctx.fillStyle = '#b89c82';
  ctx.fillRect(0, 0, S, 2); ctx.fillRect(0, S - 2, S, 2); ctx.fillRect(0, 0, 2, S); ctx.fillRect(S - 2, 0, 2, S);
  return toTex(c);
}

export function ringSideTexture() {
  const R = rng(11);
  const [c, ctx] = makeCanvas(96, 16);
  ctx.fillStyle = '#b6a290';
  ctx.fillRect(0, 0, 96, 16);
  for (let row = 0; row < 2; row++) {
    const off = row ? 8 : 0;
    for (let bx = -1; bx < 7; bx++) {
      const x = bx * 16 + off, y = row * 8;
      const base = ['#c7b4a1', '#bba795', '#b09c8a', '#c1ad99'][Math.floor(R() * 4)];
      ctx.fillStyle = base;
      ctx.fillRect(x + 1, y + 1, 15, 7);
      ctx.fillStyle = shift(base, 12);
      ctx.fillRect(x + 1, y + 1, 15, 1);
      ctx.fillStyle = shift(base, -16);
      ctx.fillRect(x + 1, y + 7, 15, 1);
    }
  }
  return toTex(c, [1, 1]);
}

// ---------------------------------------------------------------- grass
export function grassTexture() {
  const R = rng(21);
  const [c, ctx] = makeCanvas(64, 64);
  for (let x = 0; x < 64; x++) {
    const band = Math.floor(x / 32) % 2;
    ctx.fillStyle = band ? '#46a64e' : '#3c9846';
    ctx.fillRect(x, 0, 1, 64);
  }
  for (let i = 0; i < 260; i++) {
    const x = Math.floor(R() * 64), y = Math.floor(R() * 64);
    const band = Math.floor(x / 32) % 2;
    ctx.fillStyle = R() < 0.5 ? (band ? '#55b75c' : '#4aa952') : band ? '#3a9443' : '#33873c';
    ctx.fillRect(x, y, 1, 1);
    if (R() < 0.25) ctx.fillRect(x, y - 1, 1, 1);
  }
  // tufts
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(R() * 62), y = Math.floor(R() * 62);
    ctx.fillStyle = '#2f7f38';
    ctx.fillRect(x, y + 1, 3, 1);
    ctx.fillStyle = '#64c46a';
    ctx.fillRect(x + 1, y, 1, 1);
  }
  return toTex(c, [1, 1]);
}

export function pathTexture() {
  const R = rng(31);
  const [c, ctx] = makeCanvas(32, 32);
  ctx.fillStyle = '#b5ab9c';
  ctx.fillRect(0, 0, 32, 32);
  const slabs = [[0, 0, 16, 16], [16, 0, 16, 16], [0, 16, 16, 16], [16, 16, 16, 16]];
  for (const [x, y, w, h] of slabs) {
    const base = ['#e3ddd2', '#dbd4c7', '#d4ccbe', '#e7e2d8'][Math.floor(R() * 4)];
    ctx.fillStyle = base;
    ctx.fillRect(x + 1, y + 1, w - 1, h - 1);
    speckle(ctx, x + 1, y + 1, w - 1, h - 1, base, R, 0.06, 8);
    ctx.fillStyle = shift(base, -14);
    ctx.fillRect(x + 1, y + h - 1, w - 1, 1);
  }
  return toTex(c, [1, 1]);
}

// ---------------------------------------------------------------- walls & wood
export function plasterTexture() {
  const R = rng(41);
  const [c, ctx] = makeCanvas(32, 32);
  ctx.fillStyle = '#f2ead9';
  ctx.fillRect(0, 0, 32, 32);
  speckle(ctx, 0, 0, 32, 32, '#f2ead9', R, 0.08, 6);
  return toTex(c, [1, 1]);
}

export function stoneBaseTexture() {
  const R = rng(43);
  const [c, ctx] = makeCanvas(32, 16);
  ctx.fillStyle = '#9b8c80';
  ctx.fillRect(0, 0, 32, 16);
  for (let row = 0; row < 2; row++) {
    for (let bx = -1; bx < 3; bx++) {
      const x = bx * 12 + (row ? 6 : 0), y = row * 8;
      const base = ['#c9b9a9', '#bcab9a', '#d2c2b2', '#b3a190'][Math.floor(R() * 4)];
      ctx.fillStyle = base;
      ctx.fillRect(x + 1, y + 1, 11, 7);
      ctx.fillStyle = shift(base, 12);
      ctx.fillRect(x + 1, y + 1, 11, 1);
    }
  }
  return toTex(c, [1, 1]);
}

export function woodTexture(base = '#9a6a3e') {
  const R = rng(51);
  const [c, ctx] = makeCanvas(16, 32);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 16, 32);
  for (let x = 0; x < 16; x += 4) {
    ctx.fillStyle = shift(base, -22);
    ctx.fillRect(x, 0, 1, 32);
    ctx.fillStyle = shift(base, 10);
    ctx.fillRect(x + 1, 0, 1, 32);
  }
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = shift(base, -12);
    ctx.fillRect(Math.floor(R() * 16), Math.floor(R() * 30), 1, 2 + Math.floor(R() * 3));
  }
  return toTex(c, [1, 1]);
}

export function roofTexture(base = '#6b4a3a') {
  const [c, ctx] = makeCanvas(16, 16);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 16, 16);
  for (let y = 0; y < 16; y += 4) {
    ctx.fillStyle = shift(base, 18);
    ctx.fillRect(0, y, 16, 1);
    ctx.fillStyle = shift(base, -20);
    ctx.fillRect(0, y + 3, 16, 1);
  }
  for (let x = 0; x < 16; x += 4) {
    ctx.fillStyle = shift(base, -12);
    ctx.fillRect(x, 0, 1, 16);
  }
  return toTex(c, [1, 1]);
}

export function brickTexture() {
  const R = rng(61);
  const [c, ctx] = makeCanvas(32, 16);
  ctx.fillStyle = '#8f7466';
  ctx.fillRect(0, 0, 32, 16);
  for (let row = 0; row < 4; row++) {
    for (let bx = -1; bx < 5; bx++) {
      const x = bx * 8 + (row % 2 ? 4 : 0), y = row * 4;
      const base = ['#c08a76', '#b57d6a', '#c99a86', '#ad7462', '#c4a08e'][Math.floor(R() * 5)];
      ctx.fillStyle = base;
      ctx.fillRect(x + 1, y + 1, 7, 3);
      ctx.fillStyle = shift(base, 14);
      ctx.fillRect(x + 1, y + 1, 7, 1);
    }
  }
  return toTex(c, [1, 1]);
}

export function stepsTexture() {
  const [c, ctx] = makeCanvas(16, 16);
  ctx.fillStyle = '#d9d2c6';
  ctx.fillRect(0, 0, 16, 16);
  for (let y = 0; y < 16; y += 4) {
    ctx.fillStyle = '#eee8de';
    ctx.fillRect(0, y, 16, 1);
    ctx.fillStyle = '#a99f92';
    ctx.fillRect(0, y + 3, 16, 1);
  }
  return toTex(c, [1, 1]);
}

// ---------------------------------------------------------------- temple facade
export function templeFacadeTexture() {
  const R = rng(71);
  const W = 448, H = 112; // 28 x 7 units at 16 px/unit
  const [c, ctx] = makeCanvas(W, H);
  ctx.fillStyle = '#f1e8d6';
  ctx.fillRect(0, 0, W, H);
  speckle(ctx, 0, 0, W, H, '#f1e8d6', R, 0.03, 5);
  const wood = '#8a5a34', woodD = '#5e3a22', woodL = '#a87446';
  // horizontal beams
  const beam = (y, h) => {
    ctx.fillStyle = wood; ctx.fillRect(0, y, W, h);
    ctx.fillStyle = woodL; ctx.fillRect(0, y, W, 1);
    ctx.fillStyle = woodD; ctx.fillRect(0, y + h - 1, W, 1);
  };
  beam(0, 6); beam(46, 7); beam(H - 8, 8);
  // balcony railing (upper floor)
  for (let x = 0; x < W; x += 6) { ctx.fillStyle = woodD; ctx.fillRect(x, 38, 2, 8); }
  ctx.fillStyle = wood; ctx.fillRect(0, 36, W, 3);
  // upper windows (lattice)
  for (let i = 0; i < 9; i++) {
    const x = 18 + i * 47, y = 10;
    ctx.fillStyle = '#e8dcc2'; ctx.fillRect(x, y, 30, 24);
    ctx.fillStyle = '#b89870';
    for (let k = 0; k <= 30; k += 5) ctx.fillRect(x + k, y, 1, 24);
    for (let k = 0; k <= 24; k += 6) ctx.fillRect(x, y + k, 30, 1);
    ctx.fillStyle = woodD; ctx.strokeStyle = woodD;
    ctx.fillRect(x - 1, y - 1, 32, 1); ctx.fillRect(x - 1, y + 24, 32, 1);
  }
  // pillars
  for (let i = 0; i <= 8; i++) {
    const x = i * 55 + 4;
    ctx.fillStyle = wood; ctx.fillRect(x, 0, 7, H);
    ctx.fillStyle = woodL; ctx.fillRect(x, 0, 1, H);
    ctx.fillStyle = woodD; ctx.fillRect(x + 6, 0, 1, H);
  }
  // lower shoji panels
  for (let i = 0; i < 8; i++) {
    const x = i * 55 + 14, y = 56;
    if (i === 3 || i === 4) continue;
    ctx.fillStyle = '#efe6d2'; ctx.fillRect(x, y, 40, 46);
    ctx.fillStyle = '#c4a47c';
    for (let k = 0; k <= 40; k += 8) ctx.fillRect(x + k, y, 1, 46);
    for (let k = 0; k <= 46; k += 9) ctx.fillRect(x, y + k, 40, 1);
  }
  // big doors
  const dx = 3 * 55 + 12, dw = 2 * 55 - 14;
  ctx.fillStyle = '#6e4428'; ctx.fillRect(dx, 54, dw, 50);
  ctx.fillStyle = '#82522f';
  for (let k = 0; k < dw; k += 6) ctx.fillRect(dx + k, 54, 4, 50);
  ctx.fillStyle = '#4a2c1a'; ctx.fillRect(dx + dw / 2 - 1, 54, 2, 50);
  ctx.fillStyle = '#d6b85a';
  for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) {
    ctx.fillRect(dx + 6 + k * 7, 60 + r * 11, 2, 2);
    ctx.fillRect(dx + dw - 8 - k * 7, 60 + r * 11, 2, 2);
  }
  return toTex(c);
}

export function bannerTexture(bg, fg, glyph, sub = '') {
  const [c, ctx] = makeCanvas(16, 48);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 16, 48);
  ctx.fillStyle = shift(bg, -30);
  ctx.fillRect(0, 0, 1, 48); ctx.fillRect(15, 0, 1, 48);
  ctx.fillStyle = shift(bg, 25);
  ctx.fillRect(1, 0, 1, 48);
  ctx.fillStyle = '#d8b04a';
  ctx.fillRect(0, 0, 16, 2);
  // swallowtail bottom
  ctx.clearRect(6, 44, 4, 4); ctx.clearRect(7, 42, 2, 2);
  pixelText(ctx, glyph, 8, 12, 12, fg);
  if (sub) pixelText(ctx, sub, 8, 28, 12, fg);
  return toTex(c);
}

export function signTexture(text) {
  const [c, ctx] = makeCanvas(112, 28);
  ctx.fillStyle = '#5a3a24';
  ctx.fillRect(0, 0, 112, 28);
  ctx.fillStyle = '#f4ead2';
  ctx.fillRect(3, 3, 106, 22);
  ctx.fillStyle = '#d8c9a6';
  ctx.fillRect(3, 23, 106, 2);
  // emblem circle on the left
  ctx.fillStyle = '#2a3e66';
  ctx.beginPath(); ctx.arc(14, 14, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f4ead2';
  ctx.fillRect(10, 13, 9, 6);
  ctx.fillStyle = '#e04050';
  ctx.fillRect(13, 7, 3, 3);
  pixelText(ctx, text, 64, 14, 17, '#2a1c14');
  return toTex(c);
}

export function lanternTexture(glyph) {
  const [c, ctx] = makeCanvas(32, 16);
  ctx.fillStyle = '#d8323a';
  ctx.fillRect(0, 0, 32, 16);
  for (let y = 1; y < 16; y += 3) { ctx.fillStyle = '#b22630'; ctx.fillRect(0, y, 32, 1); }
  ctx.fillStyle = '#f05860';
  ctx.fillRect(0, 2, 32, 1);
  pixelText(ctx, glyph, 8, 8, 11, '#fff2d8');
  pixelText(ctx, glyph, 24, 8, 11, '#fff2d8');
  return toTex(c);
}

export function gongTexture() {
  const [c, ctx] = makeCanvas(32, 32);
  for (let r = 16; r > 0; r--) {
    const t = r / 16;
    ctx.fillStyle = r > 14 ? '#7a5a1c' : r % 3 === 0 ? '#c8962e' : t > 0.4 ? '#e2b648' : '#f4d070';
    ctx.beginPath(); ctx.arc(16, 16, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#fff2b0';
  ctx.fillRect(11, 10, 3, 2);
  return toTex(c);
}

export function parasolTexture() {
  const [c, ctx] = makeCanvas(32, 8);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? '#f4efe6' : '#d23a3a';
    ctx.fillRect(i * 4, 0, 4, 8);
  }
  return toTex(c, [1, 1]);
}

export function skyTexture() {
  const [c, ctx] = makeCanvas(4, 128);
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, '#5aa7f0');
  g.addColorStop(0.45, '#8cc6f7');
  g.addColorStop(0.62, '#cfe8fb');
  g.addColorStop(1, '#e8f4fb');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Billboard props
export function treeCanvas(seed, kind = 'round') {
  const R = rng(seed);
  const [c, ctx] = makeCanvas(48, 64);
  ctx.fillStyle = '#6a4630';
  ctx.fillRect(21, 40, 6, 24);
  ctx.fillStyle = '#4e3222';
  ctx.fillRect(25, 40, 2, 24);
  const blobs = kind === 'pine'
    ? [[24, 14, 8], [24, 24, 12], [24, 34, 15]]
    : [[24, 22, 14], [14, 30, 10], [34, 30, 10], [24, 12, 10], [18, 18, 8], [31, 18, 8]];
  const cols = ['#2f7a3a', '#3b9147', '#52aa58', '#6cc06a'];
  for (let layer = 0; layer < 4; layer++) {
    for (const [x, y, r] of blobs) {
      ctx.fillStyle = cols[layer];
      const off = layer * 1.6;
      ctx.beginPath();
      if (kind === 'pine') {
        ctx.moveTo(x, y - r - 2 + off);
        ctx.lineTo(x + r - off, y + r * 0.5);
        ctx.lineTo(x - r + off, y + r * 0.5);
      } else ctx.arc(x - off * 0.5, y - off * 0.7, Math.max(1, r - off * 1.3), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = R() < 0.5 ? '#2a6a33' : '#78cc72';
    const x = 6 + R() * 36, y = 4 + R() * 40;
    const p = ctx.getImageData(x, y, 1, 1).data;
    if (p[3]) ctx.fillRect(x | 0, y | 0, 1, 1);
  }
  // threshold alpha + dark outline
  const img = ctx.getImageData(0, 0, 48, 64);
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 120 ? 255 : 0;
  const out = new Uint8ClampedArray(d);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 48; x++) {
    const i = (y * 48 + x) * 4;
    if (d[i + 3]) continue;
    const n = (xx, yy) => xx >= 0 && yy >= 0 && xx < 48 && yy < 64 && d[(yy * 48 + xx) * 4 + 3];
    if (n(x - 1, y) || n(x + 1, y) || n(x, y - 1) || n(x, y + 1)) { out[i] = 26; out[i + 1] = 44; out[i + 2] = 30; out[i + 3] = 255; }
  }
  img.data.set(out);
  ctx.putImageData(img, 0, 0);
  return c;
}

export function cloudCanvas(seed) {
  const R = rng(seed);
  const [c, ctx] = makeCanvas(64, 24);
  const blobs = [];
  for (let i = 0; i < 6; i++) blobs.push([10 + R() * 44, 12 + R() * 4, 5 + R() * 6]);
  for (const [layer, col] of [[0, '#d6e6f4'], [1, '#ffffff']]) {
    ctx.fillStyle = col;
    for (const [x, y, r] of blobs) { ctx.beginPath(); ctx.arc(x, y - layer * 1.5, r - layer, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.fillStyle = '#d6e6f4';
  ctx.fillRect(4, 17, 56, 3);
  const img = ctx.getImageData(0, 0, 64, 24);
  for (let i = 3; i < img.data.length; i += 4) img.data[i] = img.data[i] > 120 ? 255 : 0;
  ctx.putImageData(img, 0, 0);
  return c;
}
