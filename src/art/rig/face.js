// Facial features are stamped as hand-designed pixel patterns after the 3D render,
// so anime eyes stay crisp at sprite scale. Stamps only land on head-skin pixels,
// which lets hair, arms and hands occlude them naturally.
import { hex } from '../pixel.js';

// Pattern legend: K lash/outline, I iris, D iris dark, W highlight, S sclera,
// M mouth dark, T tongue/teeth, B brow, '.' skip
const EYES = {
  // near eye 3 wide x 5 tall: thick upper lash, sclera toward the back, iris toward the front
  n3: ['KKK', 'SWI', 'SII', 'SDD', '.KK'],
  n2: ['KK', 'WI', 'II', 'DD'],
  n1: ['K', 'I', 'D'],
  // wide-open (shouting / powering up): smaller iris, more white
  w3: ['KKK', 'SSI', 'SID', 'SSS', '.KK'],
  w2: ['KK', 'SI', 'SD', 'K.'],
  // narrowed / determined: lid cuts the top of the iris
  a3: ['KKK', 'KKI', 'SII', '.DD'],
  a2: ['KK', 'KI', 'ID'],
  closed3: ['...', 'KKK', '.KK'],
  closed2: ['..', 'KK'],
  hurt3: ['K..', '.KK', 'K..'],
  hurt2: ['K.', '.K', 'K.'],
  // portrait-size (bigger heads)
  n4: ['.KKK', 'KSWI', 'KSII', 'KSID', 'KSDD', '.KKK'],
  w4: ['.KKK', 'KSSI', 'KSID', 'KSSD', 'KSSS', '.KKK'],
  a4: ['KKKK', 'KKKI', 'KSII', '.SDD', '..KK'],
  closed4: ['....', 'KKKK', '.KKK'],
  hurt4: ['K...', '.KKK', 'K...'],
};

function pick(kind, w, big) {
  const size = big ? 4 : w;
  const key = { normal: 'n', shout: 'w', angry: 'a', grin: 'n', closed: 'closed', hurt: 'hurt', smirk: 'a' }[kind] || 'n';
  return EYES[key + size] || EYES[key + 3] || EYES.n3;
}

const pack = (rgb) => ((255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0;

// px: Uint32Array of the frame, id: Uint8Array of part ids, skinIds: Set of ids
// allowed to receive face pixels.
export function stampFace(px, id, W, H, skinIds, f, opt) {
  const C = opt.colors;
  const col = {
    K: pack(hex(C.line || '#1a1220')),
    I: pack(hex(f.eyes === 'red' ? '#d21c2c' : C.iris)),
    D: pack(hex(f.eyes === 'red' ? '#600812' : C.irisDark)),
    W: pack(hex('#ffffff')),
    S: pack(hex(C.sclera || '#f6f2f4')),
    M: pack(hex(C.mouth || '#5a1a22')),
    T: pack(hex('#e0606a')),
    B: pack(hex(C.brow || C.line || '#1a1220')),
    L: pack(hex(C.skinLine || '#b8705a')),
  };
  const put = (x, y, c) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (!skinIds.has(id[i])) return;
    px[i] = c;
  };
  const stamp = (pat, cx, cy, mirror = false) => {
    const h = pat.length, w = pat[0].length;
    const x0 = Math.round(cx - w / 2), y0 = Math.round(cy - h / 2);
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const ch = pat[r][mirror ? w - 1 - c : c];
      if (ch !== '.') put(x0 + c, y0 + r, col[ch]);
    }
  };
  const big = opt.big;
  const face = f.face || 'normal';
  for (const e of opt.eyes) {
    if (e.facing < 0.18) continue;
    const w = e.facing > 0.62 ? 3 : e.facing > 0.38 ? 2 : 1;
    stamp(pick(face, w, big), e.x, e.y, false);
    if (face === 'angry' || face === 'shout' || f.brows) {
      // brow slanting down toward the nose (screen right for a right-facing sprite)
      const bx = Math.round(e.x - 1), by = Math.round(e.y - (big ? 4 : 3));
      put(bx, by, col.B); put(bx + 1, by + 1, col.B); if (w > 1) put(bx + 2, by + 1, col.B);
    }
  }
  const m = opt.mouth;
  if (m && m.facing > 0.15) {
    const x = Math.round(m.x), y = Math.round(m.y);
    if (face === 'shout' || face === 'hurt') {
      put(x - 1, y, col.M); put(x, y, col.M); put(x + 1, y, col.M);
      put(x - 1, y + 1, col.M); put(x, y + 1, col.T); put(x + 1, y + 1, col.M);
      if (big) { put(x - 1, y + 2, col.M); put(x, y + 2, col.M); put(x + 1, y + 2, col.M); }
    } else if (face === 'grin') {
      put(x - 1, y, col.M); put(x, y + 1, col.M); put(x + 1, y, col.M); put(x, y, col.W);
    } else if (face === 'smirk') {
      put(x, y, col.L); put(x + 1, y - 1, col.L);
    } else {
      put(x, y, col.L); put(x + 1, y, col.L);
    }
  }
  if (opt.whiskers) {
    for (const c of opt.cheeks) {
      if (c.facing < 0.3) continue;
      for (let k = -1; k <= 1; k++) { put(c.x - 1, c.y + k * 1.4, col.L); put(c.x, c.y + k * 1.4 - 0.4, col.L); }
    }
  }
}

// Big DBFZ-style eye for the super cut-in banner, drawn with canvas 2D then hard-edged.
export function drawBigEye(ctx, cx, cy, w, h, C, mirror, eyesRed = false) {
  ctx.save();
  ctx.translate(cx, cy);
  if (mirror) ctx.scale(-1, 1);
  const iris = eyesRed ? '#d21c2c' : C.iris, irisD = eyesRed ? '#5a0610' : C.irisDark;
  // sclera
  ctx.fillStyle = '#f8f4f6';
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.quadraticCurveTo(-w * 0.15, -h * 0.62, w / 2, -h * 0.22);
  ctx.quadraticCurveTo(w * 0.3, h * 0.55, -w / 2, 0);
  ctx.fill();
  // iris
  ctx.fillStyle = irisD;
  ctx.beginPath(); ctx.ellipse(w * 0.06, -h * 0.02, w * 0.24, h * 0.36, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = iris;
  ctx.beginPath(); ctx.ellipse(w * 0.06, h * 0.06, w * 0.19, h * 0.26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0c0812';
  ctx.beginPath(); ctx.ellipse(w * 0.06, h * 0.0, w * 0.09, h * 0.14, 0, 0, Math.PI * 2); ctx.fill();
  if (eyesRed) {
    ctx.fillStyle = '#0c0812';
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2 + 0.4;
      ctx.beginPath(); ctx.arc(w * 0.06 + Math.cos(a) * w * 0.15, Math.sin(a) * h * 0.18, w * 0.035, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(-w * 0.04, -h * 0.12, w * 0.06, h * 0.09, 0, 0, Math.PI * 2); ctx.fill();
  // upper lash (thick, flicked at the outer corner)
  ctx.strokeStyle = '#140c18';
  ctx.lineWidth = Math.max(2, h * 0.16);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-w * 0.62, h * 0.08);
  ctx.quadraticCurveTo(-w * 0.15, -h * 0.66, w * 0.52, -h * 0.26);
  ctx.stroke();
  ctx.lineWidth = Math.max(1, h * 0.06);
  ctx.beginPath();
  ctx.moveTo(-w * 0.3, h * 0.24);
  ctx.quadraticCurveTo(w * 0.1, h * 0.42, w * 0.42, h * 0.08);
  ctx.stroke();
  // angry brow
  ctx.lineWidth = Math.max(2, h * 0.15);
  ctx.beginPath();
  ctx.moveTo(-w * 0.55, -h * 0.95);
  ctx.lineTo(w * 0.5, -h * 0.58);
  ctx.stroke();
  ctx.restore();
}
