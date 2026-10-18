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
