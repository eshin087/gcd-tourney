#!/usr/bin/env node
// Regression test for tools/pack-sprites.mjs.
//   npm run test:sprites            (add -- --keep to keep tools/.test-fixtures/ for inspection)
// Generates fake ChatGPT-style strips (magenta background, 6x "art pixels", noise, magenta fringe,
// specks, touching poses, a 2-row grid, single-frame files, human-cleaned frames, versioned _vNN
// candidates, rejected versions, UI, VFX), runs the packer into a scratch output folder and checks the
// result against spec v2 (docs/decisions/0007-art-spec-v2-shippuden-256.md). Never touches art/ or public/.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKER = path.join(TOOL_DIR, 'pack-sprites.mjs');
const FIX = path.join(TOOL_DIR, '.test-fixtures');
const ART = path.join(FIX, 'art');
const OUT = path.join(FIX, 'out');
const KEEP = process.argv.includes('--keep');

// spec v2 (ADR 0007); the test writes it into its own manifest fixture
const SPEC = { name: 'hi-res sprite spec v2', adr: 'docs/decisions/0007-art-spec-v2-shippuden-256.md', frameWidth: 256, frameHeight: 256, columns: 16,
  pivot: [128, 240], pixelsPerUnit: 128, facing: 'right', maxColors: 48, warnColors: 64, rawBackground: '#FF00FF', standingBodyPx: 200, cellMargin: 4, versionSuffix: '_vNN' };
const FW = SPEC.frameWidth, [PX, PY] = SPEC.pivot;
// box thresholds below were measured at spec v1 (body ~135 px); bodies are ~204/135 bigger now
const K = 204 / 135;
const v2px = (v) => Math.round(v * K);

let failures = 0, passes = 0;
const check = (ok, msg) => {
  if (ok) passes++;
  else { failures++; console.log(`  FAIL ${msg}`); }
};

// ---------------------------------------------------------------- image helpers
function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
function image(w, h, bg, rand, noise = 2) {
  const img = { w, h, data: new Uint8Array(w * h * 4), mask: new Uint8Array(w * h) };
  for (let i = 0; i < w * h; i++) {
    if (bg) {
      img.data[i * 4] = clamp(bg[0] + (rand() - 0.5) * 2 * noise);
      img.data[i * 4 + 1] = clamp(bg[1] + (rand() - 0.5) * 2 * noise);
      img.data[i * 4 + 2] = clamp(bg[2] + (rand() - 0.5) * 2 * noise);
      img.data[i * 4 + 3] = 255;
    }
  }
  return img;
}
function setPx(img, x, y, c, a = 255) {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
  const i = (y * img.w + x) * 4;
  img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = a;
  img.mask[y * img.w + x] = 1;
}
function rect(img, x0, y0, w, h, c, rand, noise = 3, a = 255) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    setPx(img, x, y, [clamp(c[0] + (rand() - 0.5) * 2 * noise), clamp(c[1] + (rand() - 0.5) * 2 * noise), clamp(c[2] + (rand() - 0.5) * 2 * noise)], a);
  }
}
function savePng(file, img) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const png = new PNG({ width: img.w, height: img.h });
  png.data = Buffer.from(img.data);
  fs.writeFileSync(file, PNG.sync.write(png));
}
function loadPng(file) {
  const p = PNG.sync.read(fs.readFileSync(file));
  return { w: p.width, h: p.height, data: p.data };
}
// magenta anti-alias fringe on figure edges (what ChatGPT really produces)
function fringe(img, rand) {
  const { w, h } = img;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = y * w + x;
    if (!img.mask[p]) continue;
    if (img.mask[p - 1] && img.mask[p + 1] && img.mask[p - w] && img.mask[p + w]) continue;
    if (rand() < 0.5) continue;
    const i = p * 4;
    img.data[i] = clamp((img.data[i] + 255) / 2); img.data[i + 1] = clamp(img.data[i + 1] / 2); img.data[i + 2] = clamp((img.data[i + 2] + 255) / 2);
  }
}

// ---------------------------------------------------------------- fake fighter (art px, x right / y up from the feet)
const S = 6;
const COL = { outline: [26, 22, 34], pants: [40, 52, 96], orange: [240, 120, 24], skin: [246, 200, 154], hair: [255, 210, 60], fist: [214, 150, 110] };
function figure(p = {}) {
  const b = p.bob || 0;
  if (p.lying) {
    const r = p.raise || 0;
    const R = [[-34, -10, r, 8 + r, COL.pants], [-10, 14, r, 10 + r, COL.orange], [14, 26, r, 11 + r, COL.skin], [26, 31, r, 12 + r, COL.hair], [-4, 6, 10 + r, 13 + r, COL.skin]];
    if (p.legUp) R.push([-34, -29, 8 + r, 8 + r + p.legUp, COL.pants]); // leg flung up while hitting the ground
    return R;
  }
  const R = [[-6, -2, 0, 28, COL.pants], [2, 6, 0, 28, COL.pants]];
  if (p.kick) R.push([6, 6 + p.kick, 18, 23, COL.pants]);
  R.push([-7, 7, 28 + b, 52 + b, COL.orange], [-6, 6, 52 + b, 64 + b, COL.skin], [-7, 7, 62 + b, 70 + b, COL.hair], [-5, -3, 70 + b, 74 + b, COL.hair], [1, 3, 70 + b, 75 + b, COL.hair]);
  R.push([-11, -7, 38 + b, 42 + b, COL.skin]);
  if (p.punch) R.push([7, 7 + p.punch, 42 + b, 46 + b, COL.skin], [7 + p.punch - 3, 7 + p.punch, 41 + b, 47 + b, COL.fist]);
  else R.push([7, 11, 42 + b, 46 + b, COL.skin]);
  if (p.up) R.push([3, 7, 64 + b, 64 + b + p.up, COL.fist]);
  if (p.smear) R.push([7 + p.punch + 2, 7 + p.punch + 5, 42 + b, 46 + b, [250, 250, 250]]); // detached smear, 1 art px gap
  return R;
}
function drawFigure(img, footX, floorY, p, rand) {
  const rects = figure(p);
  for (const [x0, x1, y0, y1, c] of rects) {
    if (c[0] === 250) continue;
    rect(img, footX + (x0 - 1) * S, floorY - (y1 + 1) * S, (x1 - x0 + 2) * S, (y1 - y0 + 2) * S, COL.outline, rand);
  }
  for (const [x0, x1, y0, y1, c] of rects) rect(img, footX + x0 * S, floorY - y1 * S, (x1 - x0) * S, (y1 - y0) * S, c, rand);
}
// a strip: poses left->right on magenta. spacing in art px (array or number)
function strip(poses, { spacing = 46, seed = 1, height = 100, specks = 4, rows = 1, bg = 'flat' } = {}) {
  const rand = mulberry(seed);
  const perRow = Math.ceil(poses.length / rows);
  const sp = Array.isArray(spacing) ? spacing : Array(perRow).fill(spacing);
  const width = (sp.slice(0, perRow - 1).reduce((a, c) => a + c, 0) + 60) * S;
  const img = image(width, height * S * rows, [255, 0, 255], rand);
  // ChatGPT sometimes paints a magenta gradient, or a fake "transparency" checkerboard
  if (bg !== 'flat') {
    for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
      const i = (y * img.w + x) * 4;
      const c = bg === 'gradient' ? [255 - (x / img.w) * 22, (y / img.h) * 24, 255 - (y / img.h) * 18] : ((x >> 4) + (y >> 4)) % 2 ? [255, 255, 255] : [204, 204, 204];
      img.data[i] = clamp(c[0]); img.data[i + 1] = clamp(c[1]); img.data[i + 2] = clamp(c[2]);
    }
  }
  poses.forEach((p, k) => {
    const row = Math.floor(k / perRow), col = k % perRow;
    const x = (30 + sp.slice(0, col).reduce((a, c) => a + c, 0)) * S;
    drawFigure(img, x, (row + 1) * height * S - 10 * S, p, rand);
  });
  if (bg !== 'checker') fringe(img, rand);
  for (let k = 0; k < specks; k++) rect(img, Math.floor(rand() * (img.w - 4)), 2 + Math.floor(rand() * 8), 2, 2, [128, 128, 128], rand, 0);
  return img;
}

// ---------------------------------------------------------------- fixtures
function makeFixtures() {
  fs.rmSync(FIX, { recursive: true, force: true });
  const T = path.join(ART, 'characters', 'testy');
  const raw = (n) => path.join(T, 'raw', n);
  savePng(raw('idle.png'), strip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), { seed: 11 }));
  // run: poses 3 and 4 overlap (touching poses)
  savePng(raw('run.png'), strip([0, 1, 0, 1, 0, 1, 0, 1].map((bob) => ({ bob })), { seed: 12, spacing: [34, 34, 22, 34, 34, 34, 34] }));
  // light1: active frames 2,3 extend the fist; frame 2 also has a detached smear block
  savePng(raw('light1.png'), strip([{}, { punch: 2 }, { punch: 16, smear: true }, { punch: 16 }, { punch: 9 }, { punch: 4 }, {}], { seed: 13 }));
  // light2: 7 single-frame files of different canvas sizes
  [{}, { punch: 2 }, { punch: 14 }, { punch: 14 }, { punch: 8 }, { punch: 3 }, {}].forEach((p, k) => {
    const rand = mulberry(100 + k);
    const img = image(70 * S + k * 13, 95 * S + k * 7, [255, 0, 255], rand);
    drawFigure(img, (28 + k) * S, 88 * S, p, rand);
    fringe(img, rand);
    savePng(raw(`light2_${String(k).padStart(2, '0')}.png`), img);
  });
  // light3: human-cleaned frames (256x256 transparent, drawn at 3x art scale -> ~231px tall, rescaled to 215)
  [{}, { kick: 4 }, { kick: 16 }, { kick: 16 }, { kick: 8 }, { kick: 3 }, {}].forEach((p, k) => {
    const rand = mulberry(200 + k);
    const img = image(FW, FW, null, rand);
    const s3 = 3;
    const rects = figure(p);
    for (const [x0, x1, y0, y1] of rects) rect(img, 110 + (x0 - 1) * s3, 246 - (y1 + 1) * s3, (x1 - x0 + 2) * s3, (y1 - y0 + 2) * s3, COL.outline, rand, 0);
    for (const [x0, x1, y0, y1, c] of rects) rect(img, 110 + x0 * s3, 246 - y1 * s3, (x1 - x0) * s3, (y1 - y0) * s3, c, rand, 0);
    savePng(path.join(T, 'frames', 'light3', `light3_${String(k).padStart(2, '0')}.png`), img);
  });
  // heavy: 2-row grid, frames 3,4 = uppercut (fist straight up)
  savePng(raw('heavy.png'), strip([{}, { bob: -1 }, { bob: -2 }, { up: 16 }, { up: 18 }, { up: 6 }, { bob: -1 }, {}], { seed: 14, rows: 2 }));
  savePng(raw('down.png'), strip([{ lying: true, raise: 2, legUp: 24 }, { lying: true }], { seed: 15, spacing: 80 }));
  savePng(raw('guard.png'), strip([{}, { bob: 1 }, {}], { seed: 16, bg: 'checker' })); // 3 poses (manifest expects 2), fake-transparency checkerboard
  savePng(raw('jumpSquat.png'), strip([{ bob: -3 }], { seed: 17, bg: 'gradient' }));
  fs.writeFileSync(raw('land.png'), 'this is not a png');
  savePng(raw('ChatGPT Image Oct 8, 2026.png'), strip([{}], { seed: 18 }));
  savePng(raw('foo.png'), strip([{}], { seed: 19 }));
  fs.writeFileSync(raw('win.jpg'), 'jpeg bytes');
  // documented side files the packer must skip silently (UI raws, effect art, fix-up attempts, subfolders)
  for (const n of ['ui_portrait.png', 'ui_portrait_v02.png', 'fx_chidoriBall.png', 'light1_fix01.png', path.join('_proposed', 'cloneAssist.png')]) savePng(raw(n), strip([{}], { seed: 21 }));
  fs.writeFileSync(path.join(T, 'hitboxes.json'), JSON.stringify({
    _comment: 'test overrides',
    light1: { 3: { hit: [[180, 80, 45, 30]], hand: [214.4, 95] }, 4: { hand: 'oops' } },
    idle: { 9: { hit: [[1, 1, 1, 1]] } },
  }, null, 2));

  // vers: versioned candidates (ADR 0007). The pose count tells which file was packed:
  // plain 5, v01 6, v02 7, v03 9 (its own sidecar drops one -> 8), rejected v04 3.
  {
    const V = (n) => path.join(ART, 'characters', 'vers', 'raw', n);
    const idle = (n, seed) => strip(Array.from({ length: n }, (_, i) => ({ bob: i % 2 })), { seed, specks: 0 });
    savePng(V('idle.png'), idle(5, 301));
    savePng(V('idle_v01.png'), idle(6, 302));
    savePng(V('idle_v02.png'), idle(7, 303));
    savePng(V('idle_v03.png'), idle(9, 304));
    fs.writeFileSync(V('idle.json'), JSON.stringify({ bodyHeight: 190 })); // every version of idle
    fs.writeFileSync(V('idle_v03.json'), JSON.stringify({ drop: [8] })); // v03 only, merged on top
    fs.writeFileSync(V('idle_v02.json'), JSON.stringify({ drop: [0, 1, 2] })); // not the packed version: unused
    savePng(V(path.join('_rejected', 'idle_v04.png')), idle(3, 305));
    savePng(V(path.join('_parts', 'idle_v05_A.png')), idle(2, 306));
    savePng(V(path.join('_old', 'idle_v06.png')), idle(2, 307));
    savePng(V(path.join('_proposed', 'idle_v07.png')), idle(2, 308));
    savePng(V('idle_v03_B.png'), idle(2, 309)); // a strip half left in raw/ root
    savePng(V('jumpSquat_v1.png'), strip([{ bob: -3 }], { seed: 310, specks: 0 })); // one-digit version: used, warned
    savePng(V('foo_v01.png'), idle(1, 311));
  }

  // pal64 / pal65: hand-made frames at exactly the target size (not resampled, so colors are kept exactly)
  for (const n of [64, 65]) {
    const img = image(FW, FW, null, mulberry(400 + n));
    for (let y = 0; y < 204; y++) for (let x = 108; x < 148; x++) {
      const c = y % n;
      setPx(img, x, PY - y, [20 + 3 * c, 60 + (c % 7) * 10, 40 + (c % 5) * 20]);
    }
    savePng(path.join(ART, 'characters', `pal${n}`, 'frames', 'idle', 'idle_00.png'), img);
  }
  // UI: magenta-backed portrait (needs fitting) + opaque cut-in (needs crop/downscale)
  {
    const rand = mulberry(30);
    const p = image(400, 400, [255, 0, 255], rand);
    rect(p, 120, 120, 160, 160, COL.skin, rand); rect(p, 110, 80, 180, 60, COL.hair, rand); rect(p, 80, 280, 240, 120, COL.orange, rand);
    savePng(path.join(T, 'ui', 'portrait.png'), p);
    const c = image(1000, 300, [30, 20, 40], rand);
    rect(c, 250, 120, 120, 50, [255, 255, 255], rand); rect(c, 630, 120, 120, 50, [255, 255, 255], rand);
    savePng(path.join(T, 'ui', 'cutin.png'), c);
  }
  // edgy: adversarial raw art (each anim exercises one failure mode that once broke the packer)
  {
    const E = path.join(ART, 'characters', 'edgy', 'raw');
    const onBg = (poses, bg, opt = {}) => { const s = strip(poses, { specks: 0, bg: 'checker', ...opt }); for (let i = 0; i < s.w * s.h; i++) if (!s.mask[i]) { s.data[i * 4] = bg[0]; s.data[i * 4 + 1] = bg[1]; s.data[i * 4 + 2] = bg[2]; } return s; };
    // idle: black background (dark outline must survive) + a speck above pose 3 + a speck under pose 6's feet
    const idle = onBg([0, 0, 0, 0, 0, 0, 0, 0].map((bob) => ({ bob })), [0, 0, 0], { seed: 61 });
    rect(idle, (30 + 3 * 46) * S - 4, 4, 8, 8, [128, 128, 128], mulberry(1), 0);
    rect(idle, (30 + 6 * 46) * S - 4, 100 * S - 10 * S + 3 * S, 9, 9, [90, 90, 90], mulberry(2), 0);
    savePng(path.join(E, 'idle.png'), idle);
    // light1: tightly trimmed transparent single frames (the outline touches every border)
    [{}, { punch: 2 }, { punch: 16 }, { punch: 16 }, { punch: 9 }, { punch: 4 }, {}].forEach((p, k) => {
      const img = image(80 * S, 90 * S, null, mulberry(70 + k));
      drawFigure(img, 30 * S, 85 * S, p, mulberry(80 + k));
      const b = bb(img);
      const t = { w: b.w, h: b.h, data: new Uint8Array(b.w * b.h * 4) };
      for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) for (let c = 0; c < 4; c++) t.data[(y * b.w + x) * 4 + c] = img.data[((y + b.y0) * img.w + x + b.x0) * 4 + c];
      savePng(path.join(E, `light1_${String(k).padStart(2, '0')}.png`), t);
    });
    // light2: 5 poses (manifest 7), one with a very long arm: must not be cut in half
    savePng(path.join(E, 'light2.png'), strip([{}, {}, { punch: 30 }, {}, {}], { seed: 62, spacing: [50, 50, 75, 50], specks: 0 }));
    // light4: 9 poses for an 8-frame anim; punch poses sit closer together: never merge two bodies into one frame
    savePng(path.join(E, 'light4.png'), strip([{}, { punch: 2 }, { punch: 20 }, { punch: 20 }, { punch: 20 }, { punch: 9 }, { punch: 4 }, {}, {}], { seed: 63, specks: 0 }));
    // jumpSquat: 2 poses for a 1-frame anim -> 2 frames, not one frame holding both
    savePng(path.join(E, 'jumpSquat.png'), strip([{ bob: -3 }, { bob: -3 }], { seed: 64, specks: 0 }));
    // heavy: one big pose for an 8-frame anim -> 1 frame, not 8 slivers
    { const h = image(1024, 1024, [255, 0, 255], mulberry(65)); drawFigure(h, 512, 1000, { up: 10 }, mulberry(66)); savePng(path.join(E, 'heavy.png'), h); }
    // special: tight crop, feet cut by the bottom edge and hair by the top (legs touch the border: not background)
    { const g = image(250 * S, 76 * S, [255, 0, 255], mulberry(67)); for (let k = 0; k < 8; k++) drawFigure(g, (17 + k * 30) * S, 77 * S, { bob: k % 2 }, mulberry(68 + k)); savePng(path.join(E, 'special.png'), g); }
  }

  // characters that must not produce output
  for (const id of ['emptyguy', 'emptyguy2']) {
    fs.mkdirSync(path.join(ART, 'characters', id, 'raw'), { recursive: true });
    fs.mkdirSync(path.join(ART, 'characters', id, 'frames', 'idle'), { recursive: true });
    fs.writeFileSync(path.join(ART, 'characters', id, 'raw', '.gitkeep'), '');
    fs.writeFileSync(path.join(ART, 'characters', id, 'frames', 'idle', '.gitkeep'), '');
  }
  fs.mkdirSync(path.join(OUT, 'characters', 'emptyguy'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'characters', 'emptyguy', 'anims.json'), '{"SENTINEL":true}');
  savePng(path.join(ART, 'characters', '_template', 'raw', 'idle.png'), strip([{}], { seed: 20 }));

  // VFX: white spark strip, colored flame strip (must become greyscale), final orb cells used as-is
  const V = path.join(ART, 'vfx');
  {
    const rand = mulberry(40);
    const s4 = 4;
    // spark: hollow squares growing frame to frame. Versioned like character strips: v02 (5 frames) must win over
    // v01 (4), the plain spark.png (3) and the rejected v03 (2)
    const sparkStrip = (n, rnd) => {
      const img = image(n * 60 * s4, 70 * s4, [255, 0, 255], rnd);
      for (let k = 0; k < n; k++) {
        const r = 8 + k * 5, cx = (30 + k * 60) * s4, cy = 35 * s4;
        rect(img, cx - r * s4, cy - r * s4, 2 * r * s4, 3 * s4, [250, 250, 250], rnd);
        rect(img, cx - r * s4, cy + (r - 3) * s4, 2 * r * s4, 3 * s4, [250, 250, 250], rnd);
        rect(img, cx - r * s4, cy - r * s4, 3 * s4, 2 * r * s4, [250, 250, 250], rnd);
        rect(img, cx + (r - 3) * s4, cy - r * s4, 3 * s4, 2 * r * s4, [250, 250, 250], rnd);
      }
      return img;
    };
    savePng(path.join(V, 'raw', 'spark_v02.png'), sparkStrip(5, rand));
    const other = mulberry(41);
    savePng(path.join(V, 'raw', 'spark_v01.png'), sparkStrip(4, other));
    savePng(path.join(V, 'raw', 'spark.png'), sparkStrip(3, other));
    savePng(path.join(V, 'raw', '_rejected', 'spark_v03.png'), sparkStrip(2, other));
    // flame: the upper half leans (tip sway) while the base stays put
    const fl = image(7 * 40 * s4, 80 * s4, [255, 0, 255], rand);
    const lean = [0, 14, 14, 0, -14, -16, 0]; // art px at the tip: past the base edge, so a bbox center would move the base
    for (let k = 0; k < 7; k++) {
      const hgt = 20 + k * 6, cx = (20 + k * 40) * s4, floor = 75 * s4;
      for (let j = 0; j < hgt; j += 4) {
        const wdt = Math.max(2, 12 - Math.floor((j / hgt) * 10));
        const sx = j >= hgt / 2 ? Math.round((lean[k] * (j - hgt / 2)) / (hgt / 2)) * s4 : 0;
        rect(fl, cx - wdt * s4 + sx, floor - (j + 4) * s4, wdt * 2 * s4, 4 * s4, j < hgt / 2 ? [255, 140, 30] : [255, 220, 80], rand);
      }
    }
    savePng(path.join(V, 'raw', 'flame.png'), fl);
    // star (center): same square in every frame on one center line; frames 0-1 add a ray on top
    const st = image(5 * 60 * s4, 70 * s4, [255, 0, 255], rand);
    for (let k = 0; k < 5; k++) {
      const cx = (30 + k * 60) * s4, cy = 40 * s4;
      rect(st, cx - 10 * s4, cy - 10 * s4, 20 * s4, 20 * s4, [250, 250, 250], rand);
      if (k < 2) rect(st, cx - 2 * s4, cy - 22 * s4, 4 * s4, 12 * s4, [250, 250, 250], rand);
    }
    savePng(path.join(V, 'raw', 'star.png'), st);
    // streak (bottom): thin bars whose bottom lifts 2 art px per frame
    const sk = image(6 * 40 * s4, 80 * s4, [255, 0, 255], rand);
    [6, 30, 44, 44, 30, 6].forEach((hgt, k) => {
      const cx = (20 + k * 40) * s4, floor = 75 * s4 - k * 2 * s4;
      rect(sk, cx - s4, floor - hgt * s4, 2 * s4, hgt * s4, [250, 250, 250], rand);
    });
    savePng(path.join(V, 'raw', 'streak.png'), sk);
    // glow: opaque grey rings on magenta (#FFFFFF / #B4B4B4 / #5A5A5A) -> white + alpha steps
    const gl = image(600, 300, [255, 0, 255], rand, 0);
    for (let k = 0; k < 2; k++) {
      const R = 100 - k * 8, cx = 150 + k * 300;
      for (let y = 0; y < 300; y++) for (let x = 0; x < 600; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - 150);
        if (d < R * 0.42) setPx(gl, x, y, [255, 255, 255]);
        else if (d < R * 0.7) setPx(gl, x, y, [180, 180, 180]);
        else if (d < R) setPx(gl, x, y, [90, 90, 90]);
      }
    }
    savePng(path.join(V, 'raw', 'glow.png'), gl);
    for (let k = 0; k < 6; k++) {
      const o = image(128, 128, null, rand);
      for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
        const d = Math.hypot(x - 64, y - 64);
        if (d < 18 + k) setPx(o, x, y, [58, 124, 240]);
        else if (d < 26 + k) setPx(o, x, y, [255, 255, 255], 110);
      }
      savePng(path.join(V, 'frames', 'orb', `orb_${String(k).padStart(2, '0')}.png`), o);
    }
  }

  // crowd (ADR 0008): one raw per spectator, 3 poses (idle, cheer, shocked) on a 1536 x 1024 magenta canvas
  const C = path.join(ART, 'crowd');
  {
    const crowdRaw = (poses, seed) => {
      const rand = mulberry(seed);
      const img = image(1536, 1024, [252, 3, 252], rand);
      poses.forEach((p, k) => drawFigure(img, 256 + k * 512, 900, p, rand));
      fringe(img, rand);
      return img;
    };
    fs.mkdirSync(path.join(C, 'roster'), { recursive: true });
    fs.writeFileSync(path.join(C, 'roster', 'testers.json'), JSON.stringify({ group: 'testers', kind: 'original', spectators: [
      { id: 'c-001', label: 'medium adult', heightClass: 'medium', tags: ['adult'] },
      { id: 'c-002', label: 'not approved', heightClass: 'tall', tags: [] },
      { id: 'c-003', label: 'kid, redone', heightClass: 'tiny', tags: ['kid'] },
      { id: 'c-004', label: 'approved, raw missing', heightClass: 'short', tags: [] },
      { id: 'c-006', label: 'huge, arm far up', heightClass: 'huge', tags: [] },
    ] }));
    savePng(path.join(C, 'raw', 'c-001_v01.png'), crowdRaw([{}, { up: 20 }, { bob: -2 }], 60));
    savePng(path.join(C, 'raw', 'c-002_v01.png'), crowdRaw([{}, { up: 10 }, {}], 61));
    savePng(path.join(C, 'raw', 'c-003_v01.png'), crowdRaw([{}, {}], 62)); // only 2 poses: must not be the one packed
    savePng(path.join(C, 'raw', 'c-003_v02.png'), crowdRaw([{}, { up: 12 }, { bob: -3 }], 63));
    savePng(path.join(C, 'raw', 'c-006_v01.png'), crowdRaw([{}, { up: 70 }, {}], 64));
    savePng(path.join(C, 'raw', '_rejected', 'c-002_v02.png'), crowdRaw([{}, {}, {}], 65));
  }

  // stage slots, NPCs and shared UI (ADR 0012): approved items ship, the rest only with --candidates
  {
    const rand = mulberry(70);
    const STG = path.join(ART, 'stage');
    savePng(path.join(STG, 'review', 'grass_palette_v01.png'), image(256, 256, [70, 150, 60], rand, 6));
    savePng(path.join(STG, 'raw', '_fit', 'grass_v02.png'), image(256, 256, [90, 170, 70], rand, 6)); // newer, not approved
    const tree = image(192, 256, [255, 0, 255], rand, 1); // a sprite slot still on magenta: the packer keys it
    rect(tree, 60, 40, 72, 180, [40, 110, 50], rand, 4);
    savePng(path.join(STG, 'final', 'treePine.png'), tree);
    savePng(path.join(STG, 'raw', '_fit', 'sky_v01.png'), image(20, 512, [120, 180, 240], rand, 2)); // wrong size: 16 x 512
    const NP = path.join(ART, 'npc');
    const npcStrip = (poses, seed) => {
      const r = mulberry(seed);
      const img = image(1536, 1024, [252, 3, 252], r);
      poses.forEach((p, k) => drawFigure(img, 384 + k * 768, 900, p, r));
      fringe(img, r);
      return img;
    };
    const table = (rows) => `# test NPC\n\n| anim | what | frames | loop | ms per frame | height | engine trigger | fallback |\n|---|---|---|---|---|---|---|---|\n${rows}\n\nprose after the table | not a row |\n`;
    fs.mkdirSync(path.join(NP, 'tester'), { recursive: true });
    fs.writeFileSync(path.join(NP, 'tester', 'ANIMATIONS.md'), table('| [`idle`](#idle) | standing | 2 | yes | 520, 520 | 100 | default | - |\n| [`wave`](#wave) | arm up | 2 | no (f0 wind-up, f1 held) | 180, 900 | 110 | round start | `idle` |\n| [`broken`](#broken) | half-written row | 2 |'));
    savePng(path.join(NP, 'tester', 'raw', 'idle_v01.png'), npcStrip([{}, { bob: -1 }], 71));
    savePng(path.join(NP, 'tester', 'raw', 'wave_v01.png'), npcStrip([{ up: 8 }, { up: 16 }], 72));
    savePng(path.join(NP, 'tester', 'raw', 'idle_v02.png'), npcStrip([{ up: 30 }, { up: 30 }], 75)); // newer, not approved
    fs.mkdirSync(path.join(NP, 'ghost'), { recursive: true });
    fs.writeFileSync(path.join(NP, 'ghost', 'ANIMATIONS.md'), table('| [`idle`](#idle) | standing | 2 | yes | 600, 600 | 90 | default | - |'));
    savePng(path.join(NP, 'ghost', 'raw', 'idle_v01.png'), npcStrip([{}, {}], 73));
    fs.mkdirSync(path.join(NP, 'redo'), { recursive: true });
    fs.writeFileSync(path.join(NP, 'redo', 'ANIMATIONS.md'), table('| [`idle`](#idle) | standing | 2 | yes | 600, 600 | 96 | default | - |'));
    savePng(path.join(NP, 'redo', 'raw', 'idle_v02.png'), npcStrip([{}, { bob: -1 }], 74));
    const UI = path.join(ART, 'ui');
    const logo = image(300, 100, [0, 0, 0], rand, 0);
    for (let i = 3; i < logo.data.length; i += 4) logo.data[i] = 0;
    rect(logo, 19, 19, 262, 62, [171, 5, 196], rand, 0); // a 1 px magenta-blend fringe left by a fit script
    rect(logo, 20, 20, 260, 60, [255, 176, 0], rand, 2);
    savePng(path.join(UI, 'review', 'logo_palette_v01.png'), logo);
    savePng(path.join(UI, 'review', 'title_art_fit_v01.png'), image(640, 360, [200, 140, 80], rand, 4));
  }

  fs.writeFileSync(path.join(ART, 'manifest.json'), JSON.stringify({
    version: 1,
    spec: SPEC,
    coreAnimations: ['idle', 'run'],
    animationDefaults: { idle: { frames: 8, loop: true, bodyHeight: 204, ms: [150, 150, 150, 150, 150, 150, 150, 150], required: true, status: 'todo', version: 0, approvedVersion: null } },
    characters: {
      testy: { name: 'Testy', animations: { idle: { frames: 8, loop: true, bodyHeight: 204, status: 'todo' }, light1: { frames: 7, phases: [2, 2, 3], bodyHeight: 204, status: 'approved' }, land: { frames: 2, status: 'todo' } }, ui: { portrait: { status: 'todo' } } },
      vers: { name: 'Vers', animations: { idle: { frames: 8, loop: true, status: 'todo', version: 0, approvedVersion: 2 } } },
    },
    // world art is approval-gated: every fixture effect is approved (spark at v02, its highest version)
    vfx: { cell: 128, ppu: 56, baseline: 120, effects: { spark: { frames: 5, ms: 30, colorRule: 'tinted', anchor: 'center', status: 'todo', version: 0, approvedVersion: 2 }, flame: { frames: 7, ms: 55, colorRule: 'tinted', anchor: 'bottom', status: 'todo', approvedVersion: 1 },
      orb: { approvedVersion: 1 }, glow: { approvedVersion: 1 }, streak: { approvedVersion: 1 }, star: { approvedVersion: 1 } } },
    worldArt: { crowd: { batches: {
      'crowd-testers-01': { status: 'approved', items: { 'c-001': { approvedVersion: 1 }, 'c-002': { approvedVersion: null }, 'c-003': { approvedVersion: 1 }, 'c-004': { approvedVersion: 1 }, 'c-005': { approvedVersion: 1 }, 'c-006': { approvedVersion: 1 } } },
      'crowd-testers-01-r1': { status: 'approved', items: { 'c-003': { approvedVersion: 2 } } },
    } },
    stage: { batches: { 'stage-grass': { items: { grass: { approvedVersion: 1 } } }, 'stage-treePine': { items: { treePine: { approvedVersion: 1 } } }, 'stage-sky': { items: { sky: { approvedVersion: 1 } } } } },
    npc: { batches: { 'npc-tester': { items: { model_sheet: { approvedVersion: 1 }, idle: { approvedVersion: 1 }, wave: { approvedVersion: 1 } } }, 'npc-ghost': { items: { idle: { approvedVersion: null } } }, 'npc-redo': { items: { idle: { approvedVersion: null } } }, 'npc-redo-r1': { items: { idle: { approvedVersion: 2 } } } } },
    ui: { batches: { 'ui-title_art': { items: { title_art: { approvedVersion: 1 } } } } } },
    sharedUi: { logo: { approvedVersion: 1 }, titleArt: { approvedVersion: null } },
  }, null, 2));
}

// ---------------------------------------------------------------- run + verify helpers
function pack(args) {
  const r = spawnSync(process.execPath, [PACKER, ...args], { encoding: 'utf8' });
  let json = null;
  if (args.includes('--json')) { try { json = JSON.parse(r.stdout); } catch { /* reported below */ } }
  return { code: r.status, out: r.stdout, err: r.stderr, json };
}
function cell(sheet, idx, fw = FW, cols = 16) {
  const x0 = (idx % cols) * fw, y0 = Math.floor(idx / cols) * fw;
  const c = { w: fw, h: fw, data: new Uint8Array(fw * fw * 4) };
  for (let y = 0; y < fw; y++) for (let x = 0; x < fw; x++) {
    const si = ((y0 + y) * sheet.w + x0 + x) * 4, di = (y * fw + x) * 4;
    for (let k = 0; k < 4; k++) c.data[di + k] = sheet.data[si + k];
  }
  return c;
}
function bb(c) {
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (c.data[(y * c.w + x) * 4 + 3]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return x1 < 0 ? null : { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}
function footX(c, b) {
  let s = 0, n = 0;
  for (let y = b.y0 + Math.floor(b.h * 0.8); y <= b.y1; y++) for (let x = 0; x < c.w; x++) if (c.data[(y * c.w + x) * 4 + 3]) { s += x; n++; }
  return s / n;
}
const overlap = (a, b) => a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];
const anyWarn = (list, re) => list.some((w) => re.test(w));

// ---------------------------------------------------------------- tests
function main() {
  console.log('pack-sprites regression test');
  makeFixtures();
  const base = ['--root', ART, '--out', OUT, '--json'];

  // run 1 ------------------------------------------------------------
  const r1 = pack([...base, '--update-manifest']);
  check(r1.code === 0, `run 1 exit code 0 (got ${r1.code}) ${r1.err}`);
  check(!!r1.json, 'run 1 printed a JSON report');
  if (!r1.json) { console.log(r1.out.slice(0, 2000), r1.err); return finish(); }
  const rep = r1.json;
  const testy = rep.characters.find((c) => c.id === 'testy');
  check(!!testy, 'testy reported');
  check(!rep.characters.some((c) => c.id === '_template'), '_template skipped');
  const metaPath = path.join(OUT, 'characters', 'testy', 'anims.json');
  check(fs.existsSync(metaPath), 'testy anims.json written');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const sheet = loadPng(path.join(OUT, 'characters', 'testy', 'sheet.png'));
  const total = Object.values(meta.animations).reduce((s, a) => s + a.frames.length, 0);
  check(sheet.w === 16 * 256 && sheet.h === Math.ceil(total / 16) * 256, `sheet ${sheet.w}x${sheet.h} for ${total} frames`);
  check(meta.frameWidth === 256 && meta.frameHeight === 256 && meta.columns === 16 && meta.pivot[0] === 128 && meta.pivot[1] === 240 && meta.pixelsPerUnit === 128
    && meta.facing === 'right' && meta.spec === 'hi-res sprite spec v2' && meta.source === 'art-pack' && meta.packer === 2, 'anims.json header matches spec v2');
  check(rep.spec?.frameWidth === 256 && rep.spec.warnColors === 64 && !anyWarn(rep.warnings, /spec/), 'spec v2 read from the manifest, no spec warnings');
  check(meta.complete === false && meta.missingCore.includes('special'), 'complete=false while core anims are missing');

  const expectCounts = { idle: 8, run: 8, light1: 7, light2: 7, light3: 7, heavy: 8, down: 2, guard: 3, jumpSquat: 1 };
  for (const [a, n] of Object.entries(expectCounts)) check(meta.animations[a]?.frames.length === n, `${a}: ${n} frames (got ${meta.animations[a]?.frames.length})`);
  check(!meta.animations.land, 'corrupt land.png skipped');
  check(JSON.stringify(meta.animations.idle.durations) === JSON.stringify([150, 150, 150, 150, 150, 150, 150, 150]) && meta.animations.idle.loop === true, 'idle durations/loop from manifest');
  check(JSON.stringify(meta.animations.light1.phases) === '[2,2,3]' && JSON.stringify(meta.animations.heavy.phases) === '[3,2,3]', 'attack phases');

  // ADR 0007 body heights (light1 from the manifest, the rest from the packer's default table)
  const BH = { idle: 204, run: 204, light1: 204, light2: 204, light3: 215, heavy: 218, down: 96, guard: 198, jumpSquat: 162 };
  let pivotOk = true, footOk = true;
  for (const [a, info] of Object.entries(meta.animations)) {
    let maxH = 0;
    for (const f of info.frames) {
      const c = cell(sheet, f);
      const b = bb(c);
      if (!b) { pivotOk = false; continue; }
      maxH = Math.max(maxH, b.h);
      if (b.y1 !== PY) { pivotOk = false; console.log(`    ${a} frame ${f}: lowest row ${b.y1}`); }
      const fx = footX(c, b);
      if (Math.abs(fx - PX) > 0.51) { footOk = false; console.log(`    ${a} frame ${f}: foot center ${fx.toFixed(2)}`); }
    }
    if (BH[a]) check(maxH >= BH[a] - 2 && maxH <= BH[a], `${a}: tallest frame ${maxH}px ~ bodyHeight ${BH[a]}`);
  }
  check(pivotOk, `every frame: lowest opaque pixel on y=${PY}`);
  check(footOk, `every frame: feet center on x=${PX} (+-0.5)`);
  check(!anyWarn(testy.warnings, /clipped|cell margin/), 'no frame clipped or inside the 4px cell margin');

  // boxes
  const activeOf = (a) => { const m = meta.animations[a]; return m.phases ? m.frames.slice(m.phases[0], m.phases[0] + m.phases[1]) : []; };
  const allFrames = Object.values(meta.animations).flatMap((a) => a.frames);
  check(allFrames.every((f) => meta.boxes[f]?.hurt?.length === 1), 'every frame has a hurtbox');
  const active = new Set(['light1', 'light2', 'light3', 'heavy'].flatMap(activeOf));
  const withHit = allFrames.filter((f) => meta.boxes[f]?.hit);
  check(withHit.length === active.size && withHit.every((f) => active.has(f)), `hitboxes only on active frames (${withHit.length} vs ${active.size})`);
  const idleCells = meta.animations.idle.frames.map((f) => bb(cell(sheet, f)));
  const idleMaxX = Math.max(...idleCells.map((b) => b.x1)), idleMinY = Math.min(...idleCells.map((b) => b.y0));
  {
    const f = meta.animations.light1.frames[2];
    const hit = meta.boxes[f].hit[0];
    const b = bb(cell(sheet, f));
    check(hit[0] >= idleMaxX - v2px(8) && hit[0] + hit[2] >= b.x1 && hit[2] >= v2px(20) && hit[2] < v2px(60) && hit[3] < v2px(30), `light1 #2 hitbox ${JSON.stringify(hit)} covers forearm + fist + smear (idle maxX ${idleMaxX}, frame maxX ${b.x1})`);
    check(JSON.stringify(meta.boxes[meta.animations.light1.frames[3]].hit) === '[[180,80,45,30]]', 'hitboxes.json override applied to light1 #3');
    check(JSON.stringify(meta.boxes[meta.animations.light1.frames[3]].hand) === '[214,95]', 'hitboxes.json hand anchor written (rounded) for light1 #3');
    check(!meta.boxes[meta.animations.light1.frames[4]]?.hand, 'invalid hand anchor ignored');
    const hurt = meta.boxes[f].hurt[0];
    check(!overlap(hurt, [b.x1 - 2, hit[1], 2, hit[3]]) || hurt[0] + hurt[2] < b.x1, 'light1 #2 hurtbox does not reach the fist tip');
  }
  for (const k of [3, 4]) {
    const hit = meta.boxes[meta.animations.heavy.frames[k]].hit[0];
    check(hit[1] < idleMinY - v2px(4) && hit[3] < v2px(40) && hit[1] + hit[3] >= idleMinY, `heavy #${k} (uppercut) hitbox is the raised fist + forearm: ${JSON.stringify(hit)} vs idle top ${idleMinY}`);
  }
  for (const k of [2, 3]) {
    const f = meta.animations.light3.frames[k];
    const hit = meta.boxes[f].hit[0];
    // v1: below y 120 of 180 = less than 60 px above the floor
    check(hit[1] > PY - v2px(60) && hit[3] < v2px(30) && hit[0] >= idleMaxX - v2px(8), `light3 #${k} (kick) hitbox is the leg at kick height, not the guard fist ${JSON.stringify(hit)}`);
  }
  check(!anyWarn(testy.warnings, /large auto hitbox/), 'no oversized auto hitboxes');
  check(!meta.boxes[meta.animations.idle.frames[0]].hit, 'idle has no hitbox');

  // warnings / notes
  const W = testy.warnings;
  check(anyWarn(W, /guard: 3 frame\(s\), manifest expects 2/), 'warning: guard frame count');
  check(anyWarn(W, /ChatGPT Image.*unrecognized/), 'warning: unrecognized ChatGPT file name');
  check(anyWarn(W, /foo\.png: unrecognized/), 'warning: unknown anim file');
  check(anyWarn(W, /win\.jpg: not a PNG/), 'warning: jpg');
  check(anyWarn(W, /land: cannot read/), 'warning: corrupt PNG');
  check(anyWarn(W, /idle frame "9" out of range/), 'warning: override out of range');
  check(!anyWarn(W, /ui_portrait|fx_chidoriBall|light1_fix01|cloneAssist/), 'ui_* (also ui_<name>_vNN), fx_*, <anim>_fixNN and raw/ subfolders skipped silently');
  check(testy.packed.find((p) => p.anim === 'idle')?.source === 'raw/idle.png' && testy.packed.find((p) => p.anim === 'idle').version === null, 'plain raw/idle.png used when no versioned file exists');
  check(testy.packed.find((p) => p.anim === 'run')?.notes.some((n) => /touching/.test(n)), 'run: touching poses split');
  check(testy.packed.find((p) => p.anim === 'heavy')?.notes.some((n) => /grid of 2 rows/.test(n)), 'heavy: 2-row grid detected');

  // empty characters + template
  check(fs.readFileSync(path.join(OUT, 'characters', 'emptyguy', 'anims.json'), 'utf8') === '{"SENTINEL":true}', 'emptyguy: existing anims.json untouched');
  check(!fs.existsSync(path.join(OUT, 'characters', 'emptyguy2')), 'emptyguy2: nothing created');
  check(!fs.existsSync(path.join(OUT, 'characters', '_template')), '_template: nothing created');

  // write-back
  const idleDir = path.join(ART, 'characters', 'testy', 'frames', 'idle');
  check(fs.existsSync(path.join(idleDir, 'idle_07.png')) && fs.existsSync(path.join(idleDir, '.packer.json')), 'cleaned idle frames written back + marker');
  check(!fs.existsSync(path.join(ART, 'characters', 'testy', 'frames', 'light3', '.packer.json')), 'human frames (light3) not overwritten');

  // UI
  const por = loadPng(path.join(OUT, 'characters', 'testy', 'portrait.png'));
  const cut = loadPng(path.join(OUT, 'characters', 'testy', 'cutin.png'));
  check(por.w === 96 && por.h === 96 && por.data[3] === 0, 'portrait fitted to 96x96 with transparent background');
  check(cut.w === 480 && cut.h === 128, 'cutin fitted to 480x128');

  // VFX
  const am = JSON.parse(fs.readFileSync(path.join(OUT, 'vfx', 'atlas.json'), 'utf8'));
  const atlas = loadPng(path.join(OUT, 'vfx', 'atlas.png'));
  check(am.cell === 128 && am.ppu === 56 && am.rows === 6 && am.cols === 7, `atlas.json shape ${JSON.stringify({ cell: am.cell, ppu: am.ppu, rows: am.rows, cols: am.cols })}`);
  check(am.anims.spark?.row === 0 && am.anims.spark.n === 5 && am.anims.spark.ms === 30 && am.anims.flame?.row === 1 && am.anims.flame.n === 7 && am.anims.orb?.row === 2 && am.anims.orb.n === 6
    && am.anims.glow?.row === 3 && am.anims.streak?.row === 4 && am.anims.star?.row === 5, 'atlas rows/frames/ms');
  check(atlas.w === 7 * 128 && atlas.h === 6 * 128, `atlas.png ${atlas.w}x${atlas.h}`);
  {
    let grey = true, bottomOk = true, baseOk = true;
    for (let i = 0; i < 7; i++) {
      const c = cell(atlas, 7 + i, 128, 7);
      const b = bb(c);
      if (!b || b.y1 !== 120) bottomOk = false;
      else if (Math.abs(footX(c, b) - 63.5) > 1) { baseOk = false; console.log(`    flame #${i}: base center ${footX(c, b).toFixed(2)}`); }
      for (let p = 0; p < c.data.length; p += 4) if (c.data[p + 3] && (c.data[p] !== c.data[p + 1] || c.data[p] !== c.data[p + 2])) grey = false;
    }
    check(grey, 'flame (tinted) converted to greyscale');
    check(bottomOk, 'flame bottom-anchored on y=120');
    check(baseOk, 'flame base centered on x=64 in every frame (the leaning tip keeps its lean)');
    // star: the square sits on one center line, the extra ray on frames 0-1 does not push it down
    const starBottoms = [0, 1, 2, 3, 4].map((i) => bb(cell(atlas, 5 * 7 + i, 128, 7))?.y1);
    check(Math.max(...starBottoms) - Math.min(...starBottoms) <= 1, `star: same center line in every frame (square bottoms ${starBottoms.join(',')})`);
    // streak: frame 0 on the baseline, later frames keep their lift
    const sb = [0, 1, 2, 3, 4, 5].map((i) => bb(cell(atlas, 4 * 7 + i, 128, 7))?.y1);
    check(sb[0] === 120 && sb.every((y, k) => !k || y < sb[k - 1]) && sb[5] <= 120 - 20, `streak: bottom lifts frame to frame (${sb.join(',')})`);
    // glow: luma -> alpha (white, 3 hard steps)
    const g0 = cell(atlas, 3 * 7, 128, 7);
    const alphas = new Set();
    let white = true;
    for (let p = 0; p < g0.data.length; p += 4) if (g0.data[p + 3]) { alphas.add(g0.data[p + 3]); if (g0.data[p] !== 255 || g0.data[p + 1] !== 255 || g0.data[p + 2] !== 255) white = false; }
    const ga = (x, y) => g0.data[(y * 128 + x) * 4 + 3];
    check(white && [...alphas].sort((a, b) => a - b).join(',') === '110,200,255' && ga(64, 64) === 255, `glow: grey rings packed as white with alpha 110/200/255 (got ${[...alphas].join(',')})`);
    check(anyWarn(rep.vfx.warnings, /flame: drawn in color/), 'warning: colored tinted effect');
    const orb0 = loadPng(path.join(ART, 'vfx', 'frames', 'orb', 'orb_00.png'));
    const c0 = cell(atlas, 14, 128, 7);
    check(Buffer.compare(Buffer.from(orb0.data), Buffer.from(c0.data)) === 0, 'final 128x128 orb cells used as-is (alpha steps kept)');
    const spark = bb(cell(atlas, 4, 128, 7));
    check(spark && Math.abs(Math.max(spark.w, spark.h) - Math.round(128 * 0.85)) <= 2 && Math.abs((spark.x0 + spark.x1) / 2 - 63.5) <= 1, `spark largest frame fills ~85% of the cell, centered (${spark?.w}x${spark?.h})`);
    const sp = rep.vfx.packed.find((p) => p.effect === 'spark');
    check(sp?.source === 'raw/spark_v02.png' && sp.version === 2 && sp.notes.some((n) => /ignored raw\/spark\.png/.test(n)), `vfx: highest spark_vNN wins over v01, plain spark.png and _rejected/ (${sp?.source}, ${sp?.frames} frames)`);
    check(!anyWarn(rep.vfx.warnings, /spark/), 'vfx: versioned spark files accepted silently');
  }

  // edgy: adversarial raw art
  {
    const edgy = rep.characters.find((c) => c.id === 'edgy');
    const em = JSON.parse(fs.readFileSync(path.join(OUT, 'characters', 'edgy', 'anims.json'), 'utf8'));
    const es = loadPng(path.join(OUT, 'characters', 'edgy', 'sheet.png'));
    const n = (a) => em.animations[a]?.frames.length;
    const cells = (a) => (em.animations[a]?.frames || []).map((f) => cell(es, f));
    const near = (c, i, col, t) => Math.hypot(c.data[i] - col[0], c.data[i + 1] - col[1], c.data[i + 2] - col[2]) < t;
    // share of silhouette-edge pixels drawn in the outline color
    const darkEdge = (c) => {
      let e = 0, k = 0;
      const op = (x, y) => x >= 0 && y >= 0 && x < c.w && y < c.h && c.data[(y * c.w + x) * 4 + 3];
      for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) {
        if (!op(x, y) || (op(x - 1, y) && op(x + 1, y) && op(x, y - 1) && op(x, y + 1))) continue;
        e++; if (near(c, (y * c.w + x) * 4, COL.outline, 30)) k++;
      }
      return e ? k / e : 0;
    };
    // one figure = one run of columns holding hair pixels
    const heads = (c) => {
      let runs = 0, last = -100;
      for (let x = 0; x < c.w; x++) {
        let hit = false;
        for (let y = 0; y < c.h && !hit; y++) { const i = (y * c.w + x) * 4; hit = c.data[i + 3] && near(c, i, COL.hair, 40); }
        if (hit) { if (x - last > 6) runs++; last = x; }
      }
      return runs;
    };
    const count = (c, col) => { let k = 0; for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3] && near(c, i, col, 30)) k++; return k; };
    const hs = cells('idle').map((c) => bb(c).h);
    check(n('idle') === 8 && Math.max(...hs) - Math.min(...hs) <= 1 && Math.max(...hs) >= 202, `edgy idle: specks above/below a pose do not change the anim's size (${hs.join(',')})`);
    check(cells('idle').every((c) => darkEdge(c) > 0.85), 'edgy idle: dark outline survives a black background');
    check(anyWarn(edgy.warnings, /idle: background #[0-9a-f]{6} is not magenta/), 'edgy idle: off-spec background warned');
    check(n('light1') === 7 && cells('light1').every((c) => darkEdge(c) > 0.85 && count(c, COL.pants) > 200), 'edgy light1: tightly trimmed transparent frames keep outline + dark colors');
    check(n('light2') === 5 && cells('light2').every((c) => heads(c) === 1), `edgy light2: long-arm pose not cut in half (${n('light2')} frames)`);
    check(n('light4') === 9 && cells('light4').every((c) => heads(c) === 1), `edgy light4: an extra pose is not merged into its neighbour (${n('light4')} frames)`);
    check(n('jumpSquat') === 2 && cells('jumpSquat').every((c) => heads(c) === 1), `edgy jumpSquat: 2 poses for a 1-frame anim stay separate (${n('jumpSquat')} frames)`);
    check(n('heavy') === 1 && bb(cells('heavy')[0]).w > 30, `edgy heavy: one big pose is not sliced into slivers (${n('heavy')} frames)`);
    check(n('special') === 8 && cells('special').every((c) => count(c, COL.pants) > 200) && !anyWarn(edgy.warnings, /special: background/), 'edgy special: legs cut by the image edge are kept');
  }

  // manifest status sync
  const man = JSON.parse(fs.readFileSync(path.join(ART, 'manifest.json'), 'utf8'));
  check(man.characters.testy.animations.idle.status === 'packed', 'manifest: idle -> packed');
  check(man.characters.testy.animations.light1.status === 'approved', 'manifest: approved light1 not lowered');
  check(man.characters.testy.animations.land.status === 'raw', 'manifest: unreadable land raw -> raw');
  check(man.characters.testy.ui.portrait.status === 'packed', 'manifest: ui portrait -> packed');
  check(man.vfx.effects.spark.status === 'packed' && man.vfx.effects.flame.status === 'packed', 'manifest: vfx -> packed');
  check(man.characters.vers.animations.idle.version === 3 && man.characters.vers.animations.idle.approvedVersion === 2, 'manifest: version raised to the highest raw _vNN (not the rejected one), approvedVersion untouched');
  check(man.vfx.effects.spark.version === 2, 'manifest: vfx spark version raised to 2');
  check(man.characters.testy.animations.idle.version === undefined, 'manifest: no version added for unversioned raws');

  // versioned candidates (ADR 0007)
  const versDir = path.join(ART, 'characters', 'vers');
  const versIdle = path.join(versDir, 'frames', 'idle');
  {
    const vers = rep.characters.find((c) => c.id === 'vers');
    const vm = JSON.parse(fs.readFileSync(path.join(OUT, 'characters', 'vers', 'anims.json'), 'utf8'));
    const vs = loadPng(path.join(OUT, 'characters', 'vers', 'sheet.png'));
    const vi = vers.packed.find((p) => p.anim === 'idle');
    check(vi?.source === 'raw/idle_v03.png' && vi.version === 3 && vi.from === 'raw/idle_v03.png', `vers idle: highest version packed and named in the report (${vi?.source}, v${vi?.version})`);
    check(vm.animations.idle.frames.length === 8 && vi.notes.some((n) => /dropped frame\(s\) 8 \(sidecar\)/.test(n)), `vers idle: v03 (9 poses) + its own sidecar drop -> 8 frames, not plain/v01/v02/_rejected v04 (${vm.animations.idle.frames.length})`);
    const vh = Math.max(...vm.animations.idle.frames.map((f) => bb(cell(vs, f)).h));
    check(vh >= 188 && vh <= 190, `vers idle: raw/idle.json bodyHeight 190 merged under raw/idle_v03.json (${vh}px)`);
    check(vi.notes.some((n) => /ignored raw\/idle\.png/.test(n)) && vi.notes.some((n) => /candidate v03 \(approved: v02\)/.test(n)), 'vers idle: notes name the ignored plain strip and the approved version');
    const unexpected = vers.warnings.filter((w) => !/foo_v01\.png|idle_v03_B\.png|jumpSquat_v1\.png|palette has/.test(w));
    check(!unexpected.length, `vers: _vNN files accepted silently, _rejected/ _parts/ _old/ _proposed/ ignored (${unexpected.join(' | ')})`);
    check(anyWarn(vers.warnings, /idle_v03_B\.png: strip part - move it to raw\/_parts\//), 'vers: a strip part in raw/ root is warned');
    check(anyWarn(vers.warnings, /jumpSquat_v1\.png: use a two-digit version - rename to jumpSquat_v01\.png/) && vers.packed.find((p) => p.anim === 'jumpSquat')?.version === 1, 'vers: one-digit version used and warned');
    check(anyWarn(vers.warnings, /foo_v01\.png: unrecognized name/), 'vers: unknown animation with a version suffix is warned');
    const mk = JSON.parse(fs.readFileSync(path.join(versIdle, '.packer.json'), 'utf8'));
    check(mk.sourceFile === 'raw/idle_v03.png' && mk.version === 3 && mk.cell?.frameWidth === 256 && mk.source.some((s) => /idle_v03\.json$/.test(s)), 'vers idle: marker records source file, version, cell and both sidecars');

    // pal64 / pal65: the palette warning starts above spec.warnColors (64)
    const p64 = rep.characters.find((c) => c.id === 'pal64'), p65 = rep.characters.find((c) => c.id === 'pal65');
    check(p64?.colors === 64 && !anyWarn(p64.warnings, /palette/) && p64.notes.some((n) => /above the spec target of 48/.test(n)), `64 colors: note only, no warning (${p64?.colors})`);
    check(p65?.colors === 65 && anyWarn(p65.warnings, /palette has 65 colors \(> 64; spec target <= 48\) - .*--quantize 48/), `65 colors: warned (${p65?.colors})`);
    check(p64.packed[0]?.handMade === true && p64.packed[0].scale === 1, 'hand-made frames at the target size are not resampled');
  }

  // run 2: idempotent (frames/ written back are re-read without resampling)
  const sheet1 = fs.readFileSync(path.join(OUT, 'characters', 'testy', 'sheet.png'));
  const meta1 = fs.readFileSync(metaPath, 'utf8');
  const atlas1 = fs.readFileSync(path.join(OUT, 'vfx', 'atlas.png'));
  const r2 = pack(base);
  check(r2.code === 0, 'run 2 exit 0');
  check(Buffer.compare(sheet1, fs.readFileSync(path.join(OUT, 'characters', 'testy', 'sheet.png'))) === 0, 'run 2: sheet.png identical (idempotent)');
  check(meta1 === fs.readFileSync(metaPath, 'utf8'), 'run 2: anims.json identical');
  check(Buffer.compare(atlas1, fs.readFileSync(path.join(OUT, 'vfx', 'atlas.png'))) === 0, 'run 2: atlas.png identical');
  check(r2.json.characters.find((c) => c.id === 'testy').packed.find((p) => p.anim === 'idle').source === 'frames/idle/', 'run 2: idle now read from frames/');

  // run 3: a new raw idle replaces untouched written-back frames
  const before = fs.readFileSync(path.join(idleDir, 'idle_00.png'));
  savePng(path.join(ART, 'characters', 'testy', 'raw', 'idle.png'), strip([1, 1, 0, 0, 0, 1, 1, 0].map((bob) => ({ bob, punch: 1 })), { seed: 99 }));
  const r3 = pack(base);
  const t3 = r3.json.characters.find((c) => c.id === 'testy');
  check(t3.packed.find((p) => p.anim === 'idle').source === 'raw/idle.png', 'run 3: changed raw re-imported');
  check(Buffer.compare(before, fs.readFileSync(path.join(idleDir, 'idle_00.png'))) !== 0, 'run 3: frames/idle refreshed');

  // run 4: hand-edited frames win over a newer raw
  const f0 = loadPng(path.join(idleDir, 'idle_00.png'));
  f0.data[0] = 1; f0.data[1] = 2; f0.data[2] = 3; f0.data[3] = 255;
  savePng(path.join(idleDir, 'idle_00.png'), { w: f0.w, h: f0.h, data: f0.data });
  const edited = fs.readFileSync(path.join(idleDir, 'idle_00.png'));
  savePng(path.join(ART, 'characters', 'testy', 'raw', 'idle.png'), strip([0, 0, 0, 0, 0, 0, 0, 0].map((bob) => ({ bob })), { seed: 7 }));
  const r4 = pack(base);
  const t4 = r4.json.characters.find((c) => c.id === 'testy');
  check(t4.packed.find((p) => p.anim === 'idle').source === 'frames/idle/' && t4.packed.find((p) => p.anim === 'idle').edited === true, 'run 4: edited frames used');
  check(anyWarn(t4.warnings, /idle: raw\/idle\.png or its sidecar changed but frames\/idle\/ has manual edits/), 'run 4: manual-edit warning');
  check(Buffer.compare(edited, fs.readFileSync(path.join(idleDir, 'idle_00.png'))) === 0, 'run 4: edited frame preserved');
  const idle4 = t4.packed.find((p) => p.anim === 'idle');
  check(idle4.scale === 1 && idle4.notes.some((n) => /stray pixel/.test(n)), `run 4: stray pixel ignored, idle not rescaled (x${idle4.scale})`);
  // the idle now keeps its fists close to the body (run 3 art): hitboxes must still isolate the limb
  const meta4 = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const sheet4 = loadPng(path.join(OUT, 'characters', 'testy', 'sheet.png'));
  const minY4 = Math.min(...meta4.animations.idle.frames.map((f) => bb(cell(sheet4, f)).y0));
  for (const [a, k] of [['light1', 2], ['light3', 2], ['light3', 3]]) {
    const hit = meta4.boxes[meta4.animations[a].frames[k]].hit[0];
    check(hit[3] < v2px(30), `run 4 (tight idle stance): ${a} #${k} hitbox is just the limb ${JSON.stringify(hit)}`);
  }
  for (const k of [3, 4]) {
    const hit = meta4.boxes[meta4.animations.heavy.frames[k]].hit[0];
    check(hit[1] < minY4 && hit[3] < v2px(40) && hit[1] + hit[3] >= minY4, `run 4 (tight idle stance): heavy #${k} hitbox is the raised fist + forearm ${JSON.stringify(hit)}`);
  }

  // versions 1: a newer _vNN re-imports over untouched packer-made frames; the text report names it
  const vraw = (n) => path.join(versDir, 'raw', n);
  const vIdle0 = fs.readFileSync(path.join(versIdle, 'idle_00.png'));
  savePng(vraw('idle_v05.png'), strip([1, 1, 0, 0, 1, 1, 0, 0].map((bob) => ({ bob, punch: 2 })), { seed: 320, specks: 0 }));
  const rv1 = pack(['--root', ART, '--out', OUT, 'vers']);
  check(rv1.code === 0 && /idle\s+8\s+<- raw\/idle_v05\.png/.test(rv1.out) && /re-imported: replaces frames\/ cleaned from raw\/idle_v03\.png/.test(rv1.out), 'versions 1: text report shows "idle 8 <- raw/idle_v05.png" and the re-import');
  check(Buffer.compare(vIdle0, fs.readFileSync(path.join(versIdle, 'idle_00.png'))) !== 0, 'versions 1: frames/idle refreshed from v05');
  const mk5 = JSON.parse(fs.readFileSync(path.join(versIdle, '.packer.json'), 'utf8'));
  check(mk5.sourceFile === 'raw/idle_v05.png' && mk5.version === 5, 'versions 1: marker now points at v05');
  const rv1b = pack(['--root', ART, '--out', OUT, '--json', 'vers']);
  const vi1b = rv1b.json?.characters[0]?.packed.find((p) => p.anim === 'idle');
  check(vi1b?.source === 'frames/idle/' && vi1b.from === 'raw/idle_v05.png' && vi1b.version === 5 && !vi1b.edited, 'versions 1: next run reads the cleaned frames and still reports v05');

  // versions 2: rejecting the newest (moved to raw/_rejected/) falls back to the highest version left
  fs.renameSync(vraw('idle_v05.png'), vraw(path.join('_rejected', 'idle_v05.png')));
  const rv2 = pack(['--root', ART, '--out', OUT, '--json', 'vers']);
  const vi2 = rv2.json?.characters[0]?.packed.find((p) => p.anim === 'idle');
  check(vi2?.source === 'raw/idle_v03.png' && vi2.version === 3 && rv2.json.characters[0].packed.length && JSON.parse(fs.readFileSync(path.join(OUT, 'characters', 'vers', 'anims.json'), 'utf8')).animations.idle.frames.length === 8,
    `versions 2: rejected v05 ignored, v03 re-imported (${vi2?.source})`);

  // versions 3: hand-edited frames win over a newer version, with a warning naming both files
  const fe = loadPng(path.join(versIdle, 'idle_00.png'));
  fe.data[0] = 9; fe.data[1] = 9; fe.data[2] = 9; fe.data[3] = 255;
  savePng(path.join(versIdle, 'idle_00.png'), { w: fe.w, h: fe.h, data: fe.data });
  savePng(vraw('idle_v06.png'), strip([0, 0, 0, 0, 0, 0, 0, 0].map((bob) => ({ bob })), { seed: 321, specks: 0 }));
  const rv3 = pack(['--root', ART, '--out', OUT, '--json', '--update-manifest', 'vers']);
  const v3 = rv3.json?.characters[0];
  const vi3 = v3?.packed.find((p) => p.anim === 'idle');
  check(vi3?.source === 'frames/idle/' && vi3.edited === true && vi3.from === 'raw/idle_v03.png', 'versions 3: hand-edited frames used');
  check(anyWarn(v3?.warnings || [], /idle: newer source raw\/idle_v06\.png \(frames\/ came from raw\/idle_v03\.png\) but frames\/idle\/ has manual edits/), 'versions 3: warning names the new version and the edited source');
  const man3 = JSON.parse(fs.readFileSync(path.join(ART, 'manifest.json'), 'utf8'));
  check(man3.characters.vers.animations.idle.version === 6 && man3.characters.vers.animations.idle.approvedVersion === 2, 'versions 3: --update-manifest raises version to 6 (latest candidate), approvedVersion untouched');

  // versions 4: rejecting the only version must not keep shipping its packer-made frames/
  fs.renameSync(vraw('jumpSquat_v1.png'), vraw(path.join('_rejected', 'jumpSquat_v1.png')));
  const rv4 = pack(['--root', ART, '--out', OUT, '--json', 'vers']);
  const v4 = rv4.json?.characters[0];
  check(v4 && !v4.packed.some((p) => p.anim === 'jumpSquat') && !JSON.parse(fs.readFileSync(path.join(OUT, 'characters', 'vers', 'anims.json'), 'utf8')).animations.jumpSquat,
    'versions 4: frames/ cleaned from a rejected (moved) raw are not packed');
  check(anyWarn(v4?.warnings || [], /jumpSquat: frames\/jumpSquat\/ were cleaned from raw\/jumpSquat_v1\.png, which is no longer in raw\//), 'versions 4: stale frames/ warned');
  check(v4?.packed.find((p) => p.anim === 'idle')?.source === 'frames/idle/', 'versions 4: hand-edited idle frames still used');

  // versions 5: rejecting the only version of a character's only strip removes its stale art pack from public/
  const loneRaw = (n) => path.join(ART, 'characters', 'lone', 'raw', n);
  const loneOut = path.join(OUT, 'characters', 'lone');
  savePng(loneRaw('idle_v01.png'), strip([0, 1, 0, 1].map((bob) => ({ bob })), { seed: 330, specks: 0 }));
  const rl1 = pack(['--root', ART, '--out', OUT, '--json', 'lone']);
  check(rl1.code === 0 && fs.existsSync(path.join(loneOut, 'anims.json')) && fs.existsSync(path.join(loneOut, 'sheet.png')), 'versions 5: lone idle_v01 packed');
  fs.mkdirSync(path.dirname(loneRaw(path.join('_rejected', 'x'))), { recursive: true });
  fs.renameSync(loneRaw('idle_v01.png'), loneRaw(path.join('_rejected', 'idle_v01.png')));
  const rl2dry = pack(['--root', ART, '--out', OUT, '--json', '--dry-run', 'lone']);
  check(rl2dry.code === 0 && fs.existsSync(path.join(loneOut, 'anims.json')) && rl2dry.json?.characters[0]?.notes.some((n) => /would remove the stale art pack/.test(n)), 'versions 5: --dry-run only reports the stale pack');
  const rl2 = pack(['--root', ART, '--out', OUT, '--json', 'lone']);
  check(rl2.code === 0 && !fs.existsSync(path.join(loneOut, 'anims.json')) && !fs.existsSync(path.join(loneOut, 'sheet.png'))
    && rl2.json?.characters[0]?.notes.some((n) => /removed the stale art pack/.test(n)), 'versions 5: rejected only version -> stale anims.json + sheet.png removed');
  fs.mkdirSync(loneOut, { recursive: true });
  fs.writeFileSync(path.join(loneOut, 'anims.json'), JSON.stringify({ source: 'sprite-lab', animations: {} }));
  pack(['--root', ART, '--out', OUT, 'lone']);
  check(fs.existsSync(path.join(loneOut, 'anims.json')), 'versions 5: a sheet the packer did not make is left alone');

  // Per-frame offsets re-import the original raw pixels after an uncorrected pack clipped a leaning pose.
  // They must also survive a later pack from the cached cleaned frames without accumulating twice.
  {
    const anchorDir = path.join(ART, 'characters', 'anchor');
    const anchorRaw = path.join(anchorDir, 'raw');
    const rnd = mulberry(510);
    const run = image(1100, 650, [255, 0, 255], rnd, 0);
    const pose = (baseX, headX) => {
      rect(run, baseX + 75, 530, 50, 30, COL.outline, rnd, 0);
      rect(run, baseX + 90, 370, 40, 175, COL.pants, rnd, 0);
      rect(run, baseX + 110, 245, headX - 85, 155, COL.orange, rnd, 0);
      rect(run, baseX + headX + 15, 195, 30, 75, COL.skin, rnd, 0);
      rect(run, baseX + headX, 100, 70, 110, COL.hair, rnd, 0);
    };
    pose(0, 160);
    pose(550, 350);
    savePng(path.join(anchorRaw, 'run_v01.png'), run);
    const manifestPath = path.join(ART, 'manifest.json');
    const anchorManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    anchorManifest.characters.anchor = { name: 'Anchor', animations: { run: { frames: 2, loop: true, bodyHeight: 204, status: 'todo' } } };
    fs.writeFileSync(manifestPath, JSON.stringify(anchorManifest, null, 2));
    const anchorOut = path.join(OUT, 'characters', 'anchor');
    const anchorSidecar = path.join(anchorRaw, 'run_v01.json');
    const packedRun = () => {
      const meta = JSON.parse(fs.readFileSync(path.join(anchorOut, 'anims.json'), 'utf8'));
      const sheet = loadPng(path.join(anchorOut, 'sheet.png'));
      return meta.animations.run.frames.map((f) => cell(sheet, f));
    };
    const hairX = (c) => {
      let sum = 0, count = 0;
      for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) {
        const i = (y * c.w + x) * 4;
        if (c.data[i + 3] && c.data[i] === COL.hair[0] && c.data[i + 1] === COL.hair[1] && c.data[i + 2] === COL.hair[2]) { sum += x; count++; }
      }
      return count ? sum / count : NaN;
    };
    const hairCount = (c) => {
      let n = 0;
      for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3] && c.data[i] === COL.hair[0] && c.data[i + 1] === COL.hair[1] && c.data[i + 2] === COL.hair[2]) n++;
      return n;
    };
    const before = pack([...base, 'anchor']);
    const beforeCells = packedRun();
    check(before.code === 0 && anyWarn(before.json.characters[0].warnings, /run: 1 frame\(s\) clipped/) && bb(beforeCells[1]).x1 === 255,
      'frameOffsets: no sidecar preserves default foot pivot and reports a clipped forward pose');
    check(Math.abs(footX(beforeCells[0], bb(beforeCells[0])) - PX) <= 0.51, 'frameOffsets: no-offset placement is unchanged');

    fs.writeFileSync(anchorSidecar, JSON.stringify({ frameOffsets: [[0, 0], [-84, -12]] }));
    const corrected = pack([...base, 'anchor']);
    const correctedCells = packedRun();
    const correctedSheet = fs.readFileSync(path.join(anchorOut, 'sheet.png'));
    const correctedMeta = JSON.parse(fs.readFileSync(path.join(anchorOut, 'anims.json'), 'utf8'));
    check(corrected.code === 0 && corrected.json.characters[0].packed.find((p) => p.anim === 'run')?.source === 'raw/run_v01.png'
      && !anyWarn(corrected.json.characters[0].warnings, /clipped|cell margin/), 'frameOffsets: sidecar change re-imports uncut raw pixels with no clip/margin warning');
    check(hairCount(correctedCells[1]) > hairCount(beforeCells[1]) && bb(correctedCells[1]).x1 < FW - SPEC.cellMargin
      && Math.abs(hairX(correctedCells[1]) - hairX(correctedCells[0])) <= 2, 'frameOffsets: forward head restored and aligned to the contact pose');
    check(bb(correctedCells[0]).y1 === PY && bb(correctedCells[1]).y1 === PY - 12 && correctedMeta.pivot.join() === '128,240',
      'frameOffsets: flight lifts 12px, contact stays grounded, metadata pivot unchanged');

    const cached = pack([...base, 'anchor']);
    check(cached.code === 0 && cached.json.characters[0].packed.find((p) => p.anim === 'run')?.source === 'frames/run/'
      && Buffer.compare(correctedSheet, fs.readFileSync(path.join(anchorOut, 'sheet.png'))) === 0,
    'frameOffsets: second pack from cached frames is byte-identical (offsets do not accumulate)');

    fs.writeFileSync(anchorSidecar, JSON.stringify({ frameOffsets: [[0, 0], [-80, -12]] }));
    const changed = pack([...base, 'anchor']);
    const changedCells = packedRun();
    check(changed.code === 0 && changed.json.characters[0].packed.find((p) => p.anim === 'run')?.source === 'raw/run_v01.png'
      && Math.abs(hairX(changedCells[1]) - hairX(correctedCells[1]) - 4) <= 1,
      'frameOffsets: changing only the sidecar re-imports raw and moves the pose by four final pixels');

    fs.writeFileSync(anchorSidecar, JSON.stringify({ frameOffsets: [[0, 0], [256, 0]] }));
    const overflow = pack([...base, 'anchor']);
    check(overflow.code === 0 && anyWarn(overflow.json.characters[0].warnings, /run: 1 frame\(s\) clipped.*right/),
      'frameOffsets: a valid but overflowing offset emits the normal clipping warning');
    fs.writeFileSync(anchorSidecar, JSON.stringify({ frameOffsets: [[0, 0], ['bad', 0]] }));
    const malformed = pack([...base, 'anchor']);
    check(malformed.code === 0 && anyWarn(malformed.json.characters[0].warnings, /frameOffsets must have 2 \[dx,dy\] integer pair/)
      && anyWarn(malformed.json.characters[0].warnings, /run: 1 frame\(s\) clipped/),
      'frameOffsets: malformed sidecar warns, is ignored, and falls back to legacy placement');
  }

  // Anatomical size is independent of a pose's outer bounds, and cached packs must not
  // grow the normalized cells back to the legacy bodyHeight on the next invocation.
  {
    const raw = path.join(ART, 'characters', 'anchor', 'raw', 'run_v01.json');
    fs.writeFileSync(raw, JSON.stringify({ anatomy: { measurement: 'skull-to-chin', targetHeadPx: 31, sourceHeadPx: [62, 80] } }));
    const first = pack([...base, 'anchor']);
    const file = path.join(OUT, 'characters', 'anchor', 'sheet.png');
    const bytes = fs.readFileSync(file);
    check(first.code === 0 && first.json.characters[0].packed.find((p) => p.anim === 'run').notes.some((n) => n.includes('anatomical scale')), 'anatomy: explicit source head lengths select anatomical normalization');
    const again = pack([...base, 'anchor']);
    check(again.code === 0 && Buffer.compare(bytes, fs.readFileSync(file)) === 0, 'anatomy: cached pack is byte-identical instead of renormalizing to pose height');
    fs.writeFileSync(raw, JSON.stringify({ anatomy: { measurement: 'skull-to-chin', targetHeadPx: 31, sourceHeadPx: [80, 100] } }));
    const changed = pack([...base, 'anchor']);
    check(changed.code === 0 && changed.json.characters[0].packed.find((p) => p.anim === 'run').source === 'raw/run_v01.png' && Buffer.compare(bytes, fs.readFileSync(file)) !== 0, 'anatomy: changed measurements reimport original art');
    fs.writeFileSync(raw, JSON.stringify({ anatomy: { measurement: 'skull-to-chin', targetHeadPx: 31, sourceHeadPx: [0] } }));
    const invalid = pack([...base, 'anchor']);
    check(anyWarn(invalid.json.characters[0].warnings, /anatomy requires/), 'anatomy: invalid or incomplete measurements warn instead of silently claiming calibration');
  }

  // run 5: missing art root, dry run
  const ghostOut = path.join(FIX, 'ghost-out');
  const r5 = pack(['--src', path.join(FIX, 'does-not-exist'), '--out', ghostOut]);
  check(r5.code === 0 && /\(missing\)/.test(r5.out) && /0\/0 character/.test(r5.out), `run 5: missing art root handled (exit ${r5.code})`);
  check(!fs.existsSync(ghostOut), 'run 5: no output folder created');

  // run 6: no manifest -> animGuide fallback
  fs.renameSync(path.join(ART, 'manifest.json'), path.join(FIX, 'manifest.bak'));
  const r6 = pack([...base, '--dry-run', 'testy']);
  check(r6.code === 0 && r6.json?.characters[0]?.packed.length >= 8, 'run 6: works without manifest.json (dry run)');
  check(r6.json?.spec?.name === 'hi-res sprite spec v2' && r6.json.spec.frameWidth === 256 && r6.json.spec.pivot.join() === '128,240' && r6.json.spec.pixelsPerUnit === 128
    && r6.json.spec.maxColors === 48 && r6.json.spec.warnColors === 64 && r6.json.spec.cellMargin === 4 && !anyWarn(r6.json.warnings, /spec/), 'run 6: no manifest -> spec v2 defaults, silently');
  // run 7: corrupt manifest
  fs.writeFileSync(path.join(ART, 'manifest.json'), '{ broken');
  const r7 = pack([...base, '--dry-run', 'vfx']);
  check(r7.code === 0 && anyWarn(r7.json?.warnings || [], /not valid JSON/), 'run 7: corrupt manifest -> warning, exit 0');
  check(r7.json && r7.json.characters.length === 0 && r7.json.vfx, 'run 7: "vfx" target packs only vfx');
  // run 8: unknown target / bad option
  check(pack([...base, 'nobody']).code === 1, 'run 8: unknown character -> exit 1');
  check(pack(['--bogus']).code === 1, 'run 8: unknown option -> exit 1');
  // run 9: text report + --strict
  const r9 = pack(['--root', ART, '--out', OUT, '--dry-run', '--strict', 'testy']);
  check(r9.code === 2 && /== testy/.test(r9.out) && /missing core/.test(r9.out) && /spec: hi-res sprite spec v2 \(256x256 cells, pivot \[128,240\], ppu 128/.test(r9.out), 'run 9: text report, --strict exits 2 on warnings');

  // run 10: the manifest spec is the authority - a different (valid) spec is followed without "mismatch" warnings
  const m10 = path.join(FIX, 'manifest-v1.json');
  fs.writeFileSync(m10, JSON.stringify({ spec: { name: 'old 192 spec', frameWidth: 192, frameHeight: 192, columns: 8, pivot: [96, 180], pixelsPerUnit: 86, facing: 'right', maxColors: 32, warnColors: 48, cellMargin: 2, standingBodyPx: 136 },
    animationDefaults: { idle: { frames: 8, loop: true, bodyHeight: 135 }, run: { frames: 8, loop: true, bodyHeight: 135 } } }));
  const out10 = path.join(FIX, 'out10');
  const r10 = pack(['--root', ART, '--out', out10, '--manifest', m10, '--no-writeback', '--json', 'testy']);
  const meta10 = r10.json && JSON.parse(fs.readFileSync(path.join(out10, 'characters', 'testy', 'anims.json'), 'utf8'));
  const sheet10 = loadPng(path.join(out10, 'characters', 'testy', 'sheet.png'));
  check(r10.code === 0 && meta10?.frameWidth === 192 && meta10.pivot.join() === '96,180' && meta10.pixelsPerUnit === 86 && meta10.columns === 8 && meta10.spec === 'old 192 spec' && sheet10.w === 8 * 192,
    `run 10: anims.json + sheet follow the manifest spec (${meta10?.frameWidth}, [${meta10?.pivot}], cols ${meta10?.columns}, sheet ${sheet10.w}px)`);
  check(!anyWarn(r10.json?.warnings || [], /spec/), 'run 10: no spec mismatch warnings');
  const idle10 = meta10.animations.idle.frames.map((f) => bb(cell(sheet10, f, 192, 8)));
  check(idle10.every((b) => b.y1 === 180) && Math.max(...idle10.map((b) => b.h)) <= 135, 'run 10: idle on the manifest pivot at the manifest bodyHeight');
  // run: packer-made frames/ from run 1, untouched (idle was hand-edited in run 4 and keeps its frames/)
  check(r10.json.characters[0].packed.find((p) => p.anim === 'run')?.source === 'raw/run.png', 'run 10: untouched frames/ written at another cell size are re-imported from raw');
  const w10 = r10.json.characters[0].warnings;
  check(anyWarn(w10, /light3: bodyHeight 215 does not fit the 192px cell \(8-179px/) && !anyWarn(w10, /backDash: bodyHeight/), 'run 10: a body height too tall for the cell (minus the margin) is clamped and warned, only for animations with art');
  // run 11: malformed spec values are warned and replaced by the v2 default
  const m11 = path.join(FIX, 'manifest-bad.json');
  fs.writeFileSync(m11, JSON.stringify({ spec: { frameWidth: 'wide', pivot: [300, 240], warnColors: -1, cellMargin: 'x', versionSuffix: '_rNN' } }));
  const r11 = pack(['--root', ART, '--out', OUT, '--manifest', m11, '--dry-run', '--json', 'testy']);
  const w11 = r11.json?.warnings || [];
  check(r11.code === 0 && anyWarn(w11, /spec\.frameWidth is "wide"/) && anyWarn(w11, /spec\.pivot is \[300,240\]/) && anyWarn(w11, /spec\.warnColors is -1/) && anyWarn(w11, /spec\.cellMargin is "x"/) && anyWarn(w11, /versionSuffix/),
    'run 11: malformed spec values warned');
  check(r11.json?.spec.frameWidth === 256 && r11.json.spec.pivot.join() === '128,240' && r11.json.spec.warnColors === 64 && r11.json.spec.cellMargin === 4, 'run 11: malformed values fall back to the spec v2 defaults');

  // run 12: crowd (ADR 0008) - approved spectators only, idle at the class height, feet on the pivot
  fs.copyFileSync(path.join(FIX, 'manifest.bak'), path.join(ART, 'manifest.json')); // runs 6-7 moved/corrupted it
  const out12 = path.join(FIX, 'out12');
  const r12 = pack(['--root', ART, '--out', out12, '--json', 'crowd']);
  const cr = r12.json?.crowd;
  check(r12.code === 0 && cr && r12.json.characters.length === 0 && !r12.json.vfx, `run 12: "crowd" target packs only the crowd (exit ${r12.code}) ${r12.err}`);
  if (cr) {
    const cm = JSON.parse(fs.readFileSync(path.join(out12, 'crowd', 'atlas.json'), 'utf8'));
    const ca = loadPng(path.join(out12, 'crowd', 'atlas.png'));
    check(cm.cell.join() === '64,96' && cm.cols === 64 && cm.ppu === 50 && cm.pivot.join() === '32,94' && cm.frames.join() === 'idle,cheer,shocked' && ca.w === 4096 && ca.h === 96,
      `run 12: atlas shape (${cm.cell} cols ${cm.cols} ppu ${cm.ppu} pivot ${cm.pivot}, ${ca.w}x${ca.h})`);
    const ids = cm.spectators.map((p) => `${p.id}@${p.cell}v${p.version}`).join();
    check(ids === 'c-001@0v1,c-003@3v2,c-006@6v1', `run 12: approved spectators in roster order, 3 cells each, the redo batch's version wins (${ids})`);
    check(cm.spectators[0].heightClass === 'medium' && cm.spectators[0].kind === 'original' && cm.spectators[0].tags.join() === 'adult', 'run 12: heightClass, kind and tags copied from the roster');
    check(cr.unapproved === 1 && anyWarn(cr.warnings, /c-004 v01 is approved but raw\/c-004_v01\.png is missing/) && anyWarn(cr.warnings, /c-005 is approved in the manifest but not in any roster/),
      'run 12: unapproved spectator skipped silently; missing raw and roster-less approval warned');
    // one 64 x 96 cell of the first atlas row
    const crowdCell = (i) => {
      const c = { w: 64, h: 96, data: new Uint8Array(64 * 96 * 4) };
      for (let y = 0; y < 96; y++) for (let x = 0; x < 64; x++) {
        const si = (y * ca.w + i * 64 + x) * 4, di = (y * 64 + x) * 4;
        for (let k = 0; k < 4; k++) c.data[di + k] = ca.data[si + k];
      }
      return c;
    };
    const boxes = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => bb(crowdCell(i)));
    check(boxes.every((b) => b && b.y1 === 94), `run 12: every pose stands on y 94 (${boxes.map((b) => b?.y1)})`);
    check(boxes[0].h === 70 && boxes[3].h === 44, `run 12: idle scaled to its class (medium ${boxes[0].h}/70, tiny ${boxes[3].h}/44)`);
    check(boxes[1].h > boxes[0].h && boxes[1].y0 >= 2, `run 12: cheer keeps the shared scale, raised arm taller than idle (${boxes[1].h})`);
    check([0, 1, 2].every((i) => Math.abs(footX(crowdCell(i), boxes[i]) - 32) <= 1.5), 'run 12: centered on the feet (x 32)');
    const huge = cr.packed.find((p) => p.id === 'c-006');
    check(huge?.notes.some((n) => /shrunk to fit the cell/.test(n)) && boxes[7].y0 >= 2 && boxes[6].h < 84, `run 12: a cheer that would leave the cell shrinks the whole spectator (idle ${boxes[6].h}, cheer top ${boxes[7].y0})`);
    check(!cr.packed.find((p) => p.id === 'c-003').notes.some((n) => /pose/.test(n)), 'run 12: the 2-pose v01 is not used when v02 is approved');
    const cols = new Set();
    for (let i = 0; i < 3; i++) { const c = crowdCell(i); for (let q = 0; q < c.data.length; q += 4) if (c.data[q + 3]) cols.add((c.data[q] << 16) | (c.data[q + 1] << 8) | c.data[q + 2]); }
    let alphaOk = true;
    for (let q = 3; q < ca.data.length; q += 4) if (ca.data[q] !== 0 && ca.data[q] !== 255) alphaOk = false;
    check(cols.size <= 24 && alphaOk, `run 12: <= 24 colors per spectator (${cols.size}), binary alpha`);
  }

  // run 13: --candidates packs every latest version into preview/ and leaves the shipped atlases alone
  const shipped = fs.readFileSync(path.join(out12, 'crowd', 'atlas.png'));
  const r13 = pack(['--root', ART, '--out', out12, '--json', '--candidates', 'crowd', 'vfx']);
  const pm = r13.code === 0 && JSON.parse(fs.readFileSync(path.join(out12, 'preview', 'crowd', 'atlas.json'), 'utf8'));
  const pids = pm && pm.spectators.map((p) => `${p.id}v${p.version}`).join();
  check(pids === 'c-001v1,c-002v1,c-003v2,c-006v1' && pm.source === 'candidates', `run 13: candidates = the highest version of every roster spectator (${pids})`);
  check(fs.existsSync(path.join(out12, 'preview', 'vfx', 'atlas.json')) && !fs.existsSync(path.join(out12, 'vfx')), 'run 13: candidate effects go to preview/vfx only');
  check(Buffer.compare(shipped, fs.readFileSync(path.join(out12, 'crowd', 'atlas.png'))) === 0, 'run 13: the shipped crowd atlas is untouched');

  // run 15: stage, NPC and UI modes ship approved items only
  const out15 = path.join(FIX, 'out15');
  const r15 = pack(['--root', ART, '--out', out15, '--json', 'stage', 'npc', 'ui']);
  const j15 = r15.json;
  check(r15.code === 0 && j15?.stage && j15.npc && j15.ui && !j15.vfx && !j15.crowd && j15.characters.length === 0, `run 15: "stage npc ui" targets pack only those (exit ${r15.code}) ${r15.err}`);
  if (j15?.stage) {
    const sm = JSON.parse(fs.readFileSync(path.join(out15, 'stage', 'manifest.json'), 'utf8'));
    check(Object.keys(sm.slots).sort().join() === 'grass,treePine' && sm.slots.grass.version === 1 && sm.slots.grass.size.join() === '256,256' && sm.source === 'approved',
      `run 15: approved stage slots only, at the approved version (${Object.keys(sm.slots)}; grass v${sm.slots.grass?.version})`);
    check(j15.stage.packed.find((p) => p.slot === 'grass')?.from === 'stage/review/grass_palette_v01.png', 'run 15: the approved version is packed, not the newer raw/_fit/grass_v02.png');
    check(anyWarn(j15.stage.warnings, /sky_v01\.png is 20x512, the sky slot needs exactly 16x512/) && !fs.existsSync(path.join(out15, 'stage', 'sky.png')), 'run 15: a wrong-size slot image is warned and not shipped');
    const tp = loadPng(path.join(out15, 'stage', 'treePine.png'));
    let corner = tp.data[3], alphas = new Set();
    for (let i = 3; i < tp.data.length; i += 4) alphas.add(tp.data[i]);
    check(corner === 0 && [...alphas].sort((a, b) => a - b).join() === '0,255', 'run 15: a sprite slot on magenta is keyed to alpha 0/255');
    const nm = JSON.parse(fs.readFileSync(path.join(out15, 'npc', 'tester', 'anims.json'), 'utf8'));
    const ns = loadPng(path.join(out15, 'npc', 'tester', 'sheet.png'));
    check(nm.frameWidth === 128 && nm.pivot.join() === '64,124' && nm.pixelsPerUnit === 80 && nm.columns === 8 && ns.w === 1024 && ns.h === 128, `run 15: NPC sheet shape (${ns.w}x${ns.h}, pivot ${nm.pivot})`);
    check(JSON.stringify(nm.animations.idle) === JSON.stringify({ frames: [0, 1], durations: [520, 520], loop: true, version: 1 }) && nm.animations.wave.loop === false && nm.animations.wave.durations.join() === '180,900',
      'run 15: animations, timing and loop flags come from the ANIMATIONS.md table');
    const nb = [0, 1, 2, 3].map((i) => bb(cell(ns, i, 128, 8)));
    check(nb.every((b) => b && b.y1 === 124 && b.x0 >= 4 && b.x1 <= 123 && b.y0 >= 4), `run 15: NPC feet on y 124, inside the 4 px margin (${nb.map((b) => `${b?.x0}-${b?.x1}/${b?.y0}-${b?.y1}`)})`);
    check(Math.max(nb[0].h, nb[1].h) === 100 && Math.max(nb[2].h, nb[3].h) === 110, `run 15: each animation is scaled to its own target height (idle ${Math.max(nb[0].h, nb[1].h)}/100, wave ${Math.max(nb[2].h, nb[3].h)}/110)`);
    check(!fs.existsSync(path.join(out15, 'npc', 'ghost')) && j15.npc.unapproved === 1, 'run 15: an NPC without an approved idle is not packed');
    check(fs.existsSync(path.join(out15, 'npc', 'redo', 'anims.json')), 'run 15: an NPC approved only in its redo batch (npc-<id>-r1) is packed');
    check(anyWarn(j15.npc.warnings, /tester: the ANIMATIONS\.md row for broken has 3 columns/) && !nm.animations.broken, 'run 15: a short ANIMATIONS.md row is warned and skipped, not fatal');
    const lg = loadPng(path.join(out15, 'ui', 'logo.png'));
    let magenta = 0;
    for (let i = 0; i < lg.data.length; i += 4) if (lg.data[i + 3] && lg.data[i] > 150 && lg.data[i + 1] < 40 && lg.data[i + 2] > 150) magenta++;
    check(magenta === 0 && j15.ui.packed.find((p) => p.asset === 'logo')?.notes.some((n) => /magenta fringe px removed/.test(n)), `run 15: the magenta fringe on a keyed cutout is removed (${magenta} left)`);
    const um = JSON.parse(fs.readFileSync(path.join(out15, 'ui', 'manifest.json'), 'utf8'));
    check(Object.keys(um.assets).join() === 'logo,title_art' && um.assets.logo.size.join() === '300,100' && um.assets.title_art.size.join() === '640,360',
      'run 15: approved UI images ship (logo via sharedUi.logo, title_art via its worldArt.ui batch)');
    const tester = j15.npc.packed.find((p) => p.id === 'tester');
    check(nm.animations.idle.version === 1 && tester?.notes.some((n) => /idle: newer candidate v02 not shipped/.test(n)), 'run 15: an NPC ships its approved idle v01 while a newer v02 waits (noted)');
  }
  // run 16: --candidates packs every latest candidate into preview/ and leaves out15's shipped files alone
  const grassShipped = fs.readFileSync(path.join(out15, 'stage', 'grass.png'));
  const r16 = pack(['--root', ART, '--out', out15, '--json', '--candidates', 'stage', 'npc', 'ui']);
  const pm16 = r16.code === 0 && JSON.parse(fs.readFileSync(path.join(out15, 'preview', 'stage', 'manifest.json'), 'utf8'));
  check(pm16 && pm16.slots.grass.version === 2 && pm16.slots.treePine?.version === 1 && pm16.source === 'candidates', `run 16: stage candidates = the highest review/ or raw/_fit/ version; a slot without one previews its approved final/ (${pm16 && Object.keys(pm16.slots)})`);
  check(fs.existsSync(path.join(out15, 'preview', 'npc', 'ghost', 'anims.json')) && fs.existsSync(path.join(out15, 'preview', 'ui', 'title_art.png')), 'run 16: unapproved NPCs and UI images are previewed');
  check(Buffer.compare(grassShipped, fs.readFileSync(path.join(out15, 'stage', 'grass.png'))) === 0, 'run 16: the shipped stage image is untouched');
  // run 17: an unreadable manifest means unknown approvals - shipped world art is left as it is
  const m17 = path.join(FIX, 'manifest-conflict.json');
  fs.writeFileSync(m17, '<<<<<<< HEAD\n{ "broken": ');
  const r17 = pack(['--root', ART, '--out', out15, '--manifest', m17, '--json', 'stage', 'npc', 'ui']);
  check(r17.code === 0 && anyWarn(r17.json?.stage?.warnings || [], /approvals unknown, stage output left untouched/) && !r17.json.stage.removed.length
    && ['stage/grass.png', 'stage/manifest.json', 'npc/tester/sheet.png', 'ui/logo.png'].every((f) => fs.existsSync(path.join(out15, f))), 'run 17: an unreadable manifest never removes shipped world art');

  // run 13b: an approved effect ships at its approved version while a newer candidate waits for review
  const m13 = path.join(FIX, 'manifest-spark-v1.json');
  const man13 = JSON.parse(fs.readFileSync(path.join(ART, 'manifest.json'), 'utf8'));
  for (const e of Object.values(man13.vfx.effects)) delete e.approvedVersion;
  man13.vfx.effects.spark.approvedVersion = 1;
  fs.writeFileSync(m13, JSON.stringify(man13));
  const r13b = pack(['--root', ART, '--out', path.join(FIX, 'out13'), '--manifest', m13, '--no-writeback', '--json', 'vfx']);
  const sp13 = r13b.json?.vfx.packed.find((p) => p.effect === 'spark');
  check(sp13?.source === 'raw/spark_v01.png' && sp13.version === 1 && sp13.notes.some((n) => /newer candidate v02 not shipped/.test(n)) && r13b.json.vfx.unapproved.includes('flame') && !r13b.json.vfx.unapproved.includes('spark'),
    `run 13b: the approved spark v01 ships although v02 exists (${sp13?.source})`);

  // run 13c: --candidates ignores the gate: an unapproved effect and the newest spark are previewed
  const r13c = pack(['--root', ART, '--out', path.join(FIX, 'out13'), '--manifest', m13, '--no-writeback', '--json', '--candidates', 'vfx']);
  const pa13 = r13c.code === 0 && JSON.parse(fs.readFileSync(path.join(FIX, 'out13', 'preview', 'vfx', 'atlas.json'), 'utf8'));
  check(pa13 && pa13.anims.flame && pa13.anims.spark?.n === 5 && r13c.json.vfx.unapproved.length === 0, `run 13c: candidates preview every effect at its newest version (spark ${pa13 && pa13.anims.spark?.n} frames)`);

  // run 14: nothing approved any more -> the shipped outputs are removed
  const m14 = path.join(FIX, 'manifest-unapproved.json');
  const man14 = JSON.parse(fs.readFileSync(path.join(ART, 'manifest.json'), 'utf8'));
  for (const e of Object.values(man14.vfx.effects)) delete e.approvedVersion;
  delete man14.worldArt;
  delete man14.sharedUi;
  fs.writeFileSync(m14, JSON.stringify(man14));
  const r14dry = pack(['--root', ART, '--out', OUT, '--manifest', m14, '--json', '--dry-run', 'vfx', 'crowd']);
  check(r14dry.json?.vfx.removed.length === 2 && fs.existsSync(path.join(OUT, 'vfx', 'atlas.png')), 'run 14: --dry-run only reports the stale atlas');
  const shippedBefore = ['stage/grass.png', 'npc/tester/sheet.png', 'ui/logo.png'].every((f) => fs.existsSync(path.join(OUT, f)));
  const r14 = pack(['--root', ART, '--out', OUT, '--manifest', m14, '--json', 'vfx', 'crowd', 'stage', 'npc', 'ui']);
  const v14 = r14.json?.vfx;
  check(v14 && v14.packed.length === 0 && v14.unapproved.includes('flame') && v14.unapproved.includes('spark'), `run 14: unapproved effects are not packed (${v14?.unapproved})`);
  check(!fs.existsSync(path.join(OUT, 'vfx', 'atlas.png')) && !fs.existsSync(path.join(OUT, 'vfx', 'atlas.json')) && !fs.existsSync(path.join(OUT, 'crowd', 'atlas.png')),
    'run 14: stale vfx and crowd atlases removed (the game falls back to procedural art)');
  check(shippedBefore && ['stage/grass.png', 'stage/manifest.json', 'npc/tester/sheet.png', 'npc/tester/anims.json', 'ui/logo.png', 'ui/manifest.json'].every((f) => !fs.existsSync(path.join(OUT, f))),
    'run 14: stage, NPC and UI outputs whose approval is gone are removed');

  return finish();
}

function finish() {
  if (!KEEP) fs.rmSync(FIX, { recursive: true, force: true });
  else console.log(`  fixtures kept in ${FIX}`);
  console.log(`${failures ? 'FAILED' : 'OK'}: ${passes} passed, ${failures} failed`);
  process.exitCode = failures ? 1 : 0;
}

main();
