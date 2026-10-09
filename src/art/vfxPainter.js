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
};

// Bake atlas: one row per effect, CELL px frames.
export function bakeVfx() {
  const names = Object.keys(VFX_ANIMS);
  const cols = Math.max(...names.map((k) => VFX_ANIMS[k].n));
  const atlas = document.createElement('canvas');
  atlas.width = cols * CELL;
  atlas.height = names.length * CELL;
  const actx = atlas.getContext('2d', { willReadFrequently: true });
  const meta = { cell: CELL, cols, rows: names.length, anims: {} };
  names.forEach((name, row) => {
    const a = VFX_ANIMS[name];
    for (let i = 0; i < a.n; i++) {
      const [c, ctx] = cell();
      ctx.save();
      PAINTERS[name](i, a.n, ctx);
      ctx.restore();
      threshold(ctx, CELL, CELL, a.levels);
      actx.drawImage(c, i * CELL, row * CELL);
    }
    meta.anims[name] = { row, n: a.n, ms: a.ms };
  });
  return { canvas: atlas, meta };
}
