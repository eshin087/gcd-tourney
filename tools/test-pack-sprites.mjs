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
import { decalTests } from './test-pack-decals.mjs';
import * as probe from './scale-probe.mjs';

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
      // scaleGate 'warn': these strips predate the scale gate (TOOL-025) and test other things; scaly tests the gate
      testy: { name: 'Testy', scaleGate: 'warn', animations: { idle: { frames: 8, loop: true, bodyHeight: 204, status: 'todo' }, light1: { frames: 7, phases: [2, 2, 3], bodyHeight: 204, status: 'approved' }, land: { frames: 2, status: 'todo' } }, ui: { portrait: { status: 'todo' } } },
      vers: { name: 'Vers', animations: { idle: { frames: 8, loop: true, status: 'todo', version: 0, approvedVersion: 2 },
        jumpSquat: { scaleManualQA: { version: 1, result: 'pass', by: 'test', note: 'one crouch frame compared with the idle at one scale' } } } },
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
  check(!anyWarn(W, /float above the floor line/) && meta.animations.down.frames.every((f) => meta.footprint?.[f]?.length === 2) && !meta.footprint?.[meta.animations.idle.frames[0]],
    'testy: the flat lying down passes the ground check and gets a footprint, idle none');
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

  // versions 3: hand edits made on v03 never ship as a newer v06: the new version is measured and the pack is refused,
  // with a warning naming both; archiving the edits (frames/_old/) packs v06
  const fe = loadPng(path.join(versIdle, 'idle_00.png'));
  fe.data[0] = 9; fe.data[1] = 9; fe.data[2] = 9; fe.data[3] = 255;
  savePng(path.join(versIdle, 'idle_00.png'), { w: fe.w, h: fe.h, data: fe.data });
  savePng(vraw('idle_v06.png'), strip([0, 0, 0, 0, 0, 0, 0, 0].map((bob) => ({ bob })), { seed: 321, specks: 0 }));
  const rv3 = pack(['--root', ART, '--out', OUT, '--json', '--update-manifest', 'vers']);
  const v3 = rv3.json?.characters[0];
  const vi3 = v3?.packed.find((p) => p.anim === 'idle');
  check(rv3.code === 1 && vi3?.source === 'raw/idle_v06.png' && v3.blocked?.join() === 'idle' && v3.refused, `versions 3: hand edits of v03 do not ship as v06: refused (exit ${rv3.code}, ${vi3?.source})`);
  check(anyWarn(v3?.warnings || [], /idle: frames\/idle\/ has hand edits made on v03 \(raw\/idle_v03\.png\), but raw\/idle_v06\.png is newer .* Move frames\/idle\/ to frames\/_old\/idle_v03\//), 'versions 3: warning names the new version and the edited source');
  const man3 = JSON.parse(fs.readFileSync(path.join(ART, 'manifest.json'), 'utf8'));
  check(man3.characters.vers.animations.idle.version === 6 && man3.characters.vers.animations.idle.approvedVersion === 2, 'versions 3: --update-manifest raises version to 6 (latest candidate), approvedVersion untouched');

  fs.mkdirSync(path.join(versDir, 'frames', '_old'), { recursive: true });
  fs.renameSync(versIdle, path.join(versDir, 'frames', '_old', 'idle_v03'));
  const rv3b = pack(['--root', ART, '--out', OUT, '--json', 'vers']);
  const v3b = rv3b.json?.characters[0];
  check(rv3b.code === 0 && v3b?.packed.find((p) => p.anim === 'idle')?.source === 'raw/idle_v06.png' && !v3b.blocked.length && !anyWarn(v3b.warnings, /_old/),
    `versions 3: archived edits (frames/_old/) are ignored silently and v06 packs (exit ${rv3b.code})`);

  // versions 4: rejecting the only version must not keep shipping its packer-made frames/
  fs.renameSync(vraw('jumpSquat_v1.png'), vraw(path.join('_rejected', 'jumpSquat_v1.png')));
  const rv4 = pack(['--root', ART, '--out', OUT, '--json', 'vers']);
  const v4 = rv4.json?.characters[0];
  check(v4 && !v4.packed.some((p) => p.anim === 'jumpSquat') && !JSON.parse(fs.readFileSync(path.join(OUT, 'characters', 'vers', 'anims.json'), 'utf8')).animations.jumpSquat,
    'versions 4: frames/ cleaned from a rejected (moved) raw are not packed');
  check(anyWarn(v4?.warnings || [], /jumpSquat: frames\/jumpSquat\/ were cleaned from raw\/jumpSquat_v1\.png, which is no longer in raw\//), 'versions 4: stale frames/ warned');
  check(/^(raw\/idle_v06\.png|frames\/idle\/)$/.test(v4?.packed.find((p) => p.anim === 'idle')?.source || ''), 'versions 4: the idle still packs (v06)');

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
    fs.writeFileSync(raw, JSON.stringify({ anatomy: { measurement: 'skull-to-chin', targetHeadPx: 20, sourceHeadPx: [62, 80] } }));
    const compact = pack([...base, 'anchor']);
    check(compact.code === 0 && !anyWarn(compact.json.characters[0].warnings, /anatomy requires/), 'anatomy: approved compact heads are valid without forcing a universal 31px target');
  }

  // Lying frames (ADR 0020): every frame's lowest pixel sits on the floor line, so the ground check asks whether the
  // BODY rests on it. A flat body passes, a body with one end on the line and the other up in the air warns; only
  // down's resting (last) frame is checked; ko, down and getup[0] get a `footprint` (their x span) for the engine's
  // contact shadow, standing animations none.
  {
    const lieRaw = (id, n) => path.join(ART, 'characters', id, 'raw', n);
    const rnd = mulberry(520);
    // raw art px, 3x the final size: a body `len` long and `thick` deep whose underside is `sag` px up at both ends and
    // on the floor in the middle (a body drawn from above: only the hips touch, the head and feet ends hang in the air)
    const body = (img, x0, floorY, len, thick, sag, c) => {
      for (let i = 0; i < len; i++) rect(img, x0 + i, floorY - thick - Math.round((Math.abs(2 * i - len) * sag) / len), 1, thick, c, rnd, 0);
    };
    const flatKo = image(900, 400, [255, 0, 255], rnd, 0);
    body(flatKo, 150, 330, 600, 192, 0, COL.orange); // 200 x 64 px once packed
    savePng(lieRaw('lyer', 'ko_v01.png'), flatKo);
    const down = image(1600, 500, [255, 0, 255], rnd, 0);
    body(down, 100, 430, 600, 120, 0, COL.pants); // [0] the bounce: back on the floor, a leg flung up (never checked)
    rect(down, 520, 430 - 288, 60, 168, COL.pants, rnd, 0);
    body(down, 900, 430, 600, 120, 0, COL.pants); // [1] at rest, flat
    savePng(lieRaw('lyer', 'down_v01.png'), down);
    const getup = image(1800, 800, [255, 0, 255], rnd, 0);
    body(getup, 60, 700, 330, 210, 0, COL.skin); // [0] lying, knees to the chest
    for (let k = 1; k < 5; k++) rect(getup, 300 + k * 300, 700 - 612, 120, 612, COL.skin, rnd, 0); // [1-4] up
    savePng(lieRaw('lyer', 'getup_v01.png'), getup);
    savePng(lieRaw('lyer', 'idle_v01.png'), strip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), { seed: 521, specks: 0 }));
    const tiltKo = image(900, 400, [255, 0, 255], rnd, 0);
    body(tiltKo, 150, 330, 600, 90, 102, COL.orange); // 200 px long, both ends 34 px up
    savePng(lieRaw('tilty', 'ko_v01.png'), tiltKo);
    const manifestPath = path.join(ART, 'manifest.json');
    const lm = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    lm.characters.tilty = { name: 'Tilty', animations: { ko: { frames: 1, status: 'approved', version: 1, approvedVersion: 1 } } };
    fs.writeFileSync(manifestPath, JSON.stringify(lm, null, 2));

    const lie = pack([...base, 'lyer', 'tilty']);
    const lyer = lie.json?.characters.find((c) => c.id === 'lyer'), tilty = lie.json?.characters.find((c) => c.id === 'tilty');
    const lyerOut = path.join(OUT, 'characters', 'lyer');
    const lmeta = JSON.parse(fs.readFileSync(path.join(lyerOut, 'anims.json'), 'utf8'));
    const lsheet = loadPng(path.join(lyerOut, 'sheet.png'));
    const span = (f) => { const b = bb(cell(lsheet, f)); return [b.x0, b.x1]; };
    const A = lmeta.animations;
    check(lie.code === 0 && !anyWarn(lyer.warnings, /float above the floor line/), `lying: a flat ko and a flat resting down pass the ground check (${lyer?.warnings.filter((w) => /float/.test(w))})`);
    check(lyer.ground.ko?.[0]?.ok && lyer.ground.ko[0].contact === 1 && lyer.ground.down?.length === 1 && lyer.ground.down[0].frame === 1 && lyer.ground.getup?.[0]?.frame === 0,
      'lying: the report measures ko, down[last] and getup[0] only');
    const lyingFrames = [...A.ko.frames, ...A.down.frames, A.getup.frames[0]];
    check(lmeta.footprint && Object.keys(lmeta.footprint).length === lyingFrames.length && lyingFrames.every((f) => JSON.stringify(lmeta.footprint[f]) === JSON.stringify(span(f))),
      `lying: footprint = the cell x span of every ko and down frame and getup[0] (${JSON.stringify(lmeta.footprint)})`);
    check(Math.abs(lmeta.footprint[A.ko.frames[0]][1] - lmeta.footprint[A.ko.frames[0]][0] + 1 - 200) <= 2, 'lying: the flat ko is about 200 px long');
    check(![...A.idle.frames, ...A.getup.frames.slice(1)].some((f) => lmeta.footprint[f]), 'lying: standing frames (idle, getup[1+]) get no footprint');
    const tg = tilty?.ground.ko?.[0];
    const tiltWarn = tg && `ko: 1 lying frame(s) float above the floor line (#0: ${Math.round(tg.contact * 100)}% of the body within 6px of y 240, worst fifth ${tg.worst}px above it) - draw lying poses side-on`;
    check(tg && !tg.ok && tg.contact < 0.4 && tg.worst > 12 && tilty.warnings.some((w) => w.startsWith(tiltWarn) && w.endsWith('ADR 0020); v01 is the approved version: queue a side-on redraw'))
      && !anyWarn(tilty.warnings, /clipped|cell margin/), `lying: a ko with its head and feet ends in the air warns, and names the approved version (${JSON.stringify(tg)} ${tilty?.warnings})`);
    const lyerSheet = fs.readFileSync(path.join(lyerOut, 'sheet.png')), lyerJson = fs.readFileSync(path.join(lyerOut, 'anims.json'));
    const again = pack([...base, 'lyer']);
    check(again.code === 0 && again.json.characters[0].packed.find((p) => p.anim === 'ko')?.source === 'frames/ko/'
      && Buffer.compare(lyerSheet, fs.readFileSync(path.join(lyerOut, 'sheet.png'))) === 0 && Buffer.compare(lyerJson, fs.readFileSync(path.join(lyerOut, 'anims.json'))) === 0,
    'lying: a second pack from the cached frames is byte-identical (sheet and footprint)');
    // anatomy sidecars bypass bodyHeight, so a pose drawn from above can also ship too tall: a flat but 91 px thick ko
    // (a candidate, not the approved version) warns for its height alone
    const thickKo = image(700, 400, [255, 0, 255], rnd, 0);
    body(thickKo, 150, 330, 400, 192, 0, COL.orange);
    savePng(lieRaw('tilty', 'ko_v02.png'), thickKo);
    fs.writeFileSync(lieRaw('tilty', 'ko_v02.json'), JSON.stringify({ anatomy: { measurement: 'skull-to-chin', targetHeadPx: 31, sourceHeadPx: [65.4] } }));
    const tall = pack([...base, 'tilty']);
    check(tall.code === 0 && anyWarn(tall.json.characters[0].warnings, /^ko: 1 lying frame\(s\) float above the floor line \(#0: 9\dpx tall > 64x1\.15\) - draw lying poses side-on .*ADR 0020\)$/),
      `lying: a lying frame taller than bodyHeight x1.15 says so (${tall.json?.characters[0].warnings})`);
  }

  scaleGateTests(base);
  techPoseTests(base);
  attackAltTests(base);
  standingHitBoxTests(base);
  sidecarEraseTests(base);
  approvedIdleRefTests(base);
  sidecarFlipTests(base);
  packScaleTests(base);

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

  // run 13d (TOOL-048): the shipped spark's raws are missing on disk (a sparse worktree without art/vfx/raw/), so its
  // frames/ are stale: the atlas is refused and left as it is, unless --allow-drop says the loss is intended
  const lostArt = path.join(FIX, 'art-lost-raw');
  fs.rmSync(lostArt, { recursive: true, force: true });
  fs.cpSync(path.join(ART, 'vfx'), path.join(lostArt, 'vfx'), { recursive: true });
  for (const f of ['spark_v01.png', 'spark_v02.png', 'spark.png']) fs.rmSync(path.join(lostArt, 'vfx', 'raw', f), { force: true });
  const atlas13 = path.join(FIX, 'out13', 'vfx', 'atlas.json');
  const before13 = fs.readFileSync(atlas13, 'utf8');
  const r13d = pack(['--root', lostArt, '--out', path.join(FIX, 'out13'), '--manifest', m13, '--no-writeback', '--json', 'vfx']);
  check(r13d.code === 1 && JSON.stringify(r13d.json?.vfx.refused) === '["spark"]' && anyWarn(r13d.json.vfx.warnings, /VFX ATLAS NOT WRITTEN: .*ships spark.*--allow-drop/)
    && fs.readFileSync(atlas13, 'utf8') === before13, `run 13d: a shipped effect whose raw is gone refuses the atlas and keeps it (exit ${r13d.code}, refused ${r13d.json?.vfx.refused})`);
  const r13dText = pack(['--root', lostArt, '--out', path.join(FIX, 'out13'), '--manifest', m13, '--no-writeback', '--dry-run', 'vfx']);
  check(r13dText.code === 1 && /VFX ATLAS NOT WRITTEN: it would lose spark/.test(r13dText.out), `run 13d: a dry run reports the refusal too (exit ${r13dText.code})`);
  const r13e = pack(['--root', lostArt, '--out', path.join(FIX, 'out13'), '--manifest', m13, '--no-writeback', '--json', '--allow-drop', 'vfx']);
  check(r13e.code === 0 && !r13e.json?.vfx.refused.length && !fs.existsSync(atlas13), `run 13e: --allow-drop lets the atlas lose it (exit ${r13e.code})`);

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

  // ground-damage decals (ADR 0024): their own fixtures in tools/.test-fixtures/decals/
  decalTests({ check, fix: FIX });
  return finish();
}

// ---------------------------------------------------------------- scale gate (TOOL-025, ADR 0021)
// A fighter with distinct shoes (the probe's feet proxy) drawn at any pixel size s, with options to draw his hair
// mass narrower than the idle's, in another colour, or a fist raised above the head (which shrinks the whole strip,
// because each strip is scaled so its tallest pose matches bodyHeight).
const SHOE = [150, 40, 40];
function scaleFigure(p = {}) {
  const b = p.bob || 0, hw = p.thinHair ? 4 : 7, hair = p.hairC || COL.hair, body = p.bodyC || COL.orange;
  const R = [[-7, -1, 0, 4, SHOE], [1, 7, 0, 4, SHOE], [-6, -2, 4, 28, COL.pants], [2, 6, 4, 28, COL.pants]];
  R.push([-7, 7, 28 + b, 52 + b, body], [-6, 6, 52 + b, 64 + b, COL.skin], [-hw, hw, 62 + b, 70 + b, hair], [-5, -3, 70 + b, 74 + b, hair], [1, 3, 70 + b, 75 + b, hair]);
  R.push([-11, -7, 38 + b, 42 + b, COL.skin], [7, 11, 42 + b, 46 + b, COL.skin]);
  if (p.up) R.push([3, 7, 64 + b, 64 + b + p.up, COL.fist]);
  if (p.reach) R.push([7, 7 + p.reach, 55 + b, 58 + b, COL.skin]); // a long arm at head height, over the next pose's hand
  return R;
}
function scaleStrip(poses, seed, { gap = 46 } = {}) {
  const rand = mulberry(seed);
  const img = image((poses.length * gap + 30) * S, 120 * S, [255, 0, 255], rand);
  poses.forEach((p, k) => {
    const s = S * (p.scale || 1), fx = (30 + k * gap) * S, floor = 110 * S;
    const X = (v) => Math.round(fx + v * s), Y = (v) => Math.round(floor - v * s);
    const rects = scaleFigure(p);
    for (const [x0, x1, y0, y1] of rects) rect(img, X(x0 - 1), Y(y1 + 1), X(x1 + 1) - X(x0 - 1), Y(y0 - 1) - Y(y1 + 1), COL.outline, rand);
    for (const [x0, x1, y0, y1, c] of rects) rect(img, X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1), c, rand);
  });
  fringe(img, rand);
  return img;
}

function scaleGateTests(base) {
  const SCALY = path.join(ART, 'characters', 'scaly');
  const sraw = (n) => path.join(SCALY, 'raw', n);
  const seven = (p) => Array.from({ length: 7 }, (_, k) => ({ ...(typeof p === 'function' ? p(k) : p) }));
  savePng(sraw('idle_v01.png'), scaleStrip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), 801));
  // light1: a fist raised high in frame 3 -> the whole strip packs ~12 % small (head AND feet): 'uniform'
  savePng(sraw('light1_v01.png'), scaleStrip(seven((k) => (k === 3 ? { up: 22 } : {})), 802));
  // light2: the same body with a narrower hair mass: 'drift' (never auto-fitted)
  savePng(sraw('light2_v01.png'), scaleStrip(seven({ thinHair: true }), 803));
  // light3: frames 4-6 drawn at 0.7x (a part B stitched at the wrong size): 'pop'
  savePng(sraw('light3_v01.png'), scaleStrip(seven((k) => (k >= 4 ? { scale: 0.7 } : {})), 804));
  // spin (a low-confidence pose by default) and taunt (exempt in the manifest) with a small head: no finding
  savePng(sraw('spin_v01.png'), scaleStrip([{ thinHair: true }, { thinHair: true }, { thinHair: true }, { thinHair: true }], 805));
  savePng(sraw('taunt_v01.png'), scaleStrip([{ thinHair: true }, { thinHair: true }], 806));
  fs.writeFileSync(path.join(SCALY, 'hitboxes.json'), JSON.stringify({ light1: { 3: { hit: [[180, 80, 40, 30]], hand: [200, 96] } } }));
  // the same parts for the stitch tool: A (3 poses) at 1x, B (4 poses) drawn at 0.7x
  savePng(sraw(path.join('_parts', 'light3_v02_A.png')), scaleStrip([{}, {}, {}], 807));
  savePng(sraw(path.join('_parts', 'light3_v02_B.png')), scaleStrip(Array.from({ length: 4 }, () => ({ scale: 0.7 })), 808));
  // darky / darkier: hair drawn in the body's colour (like Sasuke's outline-shade hair); only darkier declares it
  for (const id of ['darky', 'darkier']) {
    const d = (n) => path.join(ART, 'characters', id, 'raw', n);
    const dark = { hairC: COL.pants, bodyC: COL.pants };
    savePng(d('idle_v01.png'), scaleStrip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ ...dark, bob })), 811));
    savePng(d('light1_v01.png'), scaleStrip(seven({ ...dark, thinHair: true }), 812));
  }
  // fitty: a fist above the head on every frame packs the whole strip ~13 % small, and f0 is drawn at 0.7x: a 'pop'
  // (never auto-fitted) until f0 is exempted, then a 'uniform' strip the auto head fit can fix
  const fraw = (n) => path.join(ART, 'characters', 'fitty', 'raw', n);
  savePng(fraw('idle_v01.png'), scaleStrip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), 821));
  savePng(fraw('light1_v01.png'), scaleStrip(seven((k) => ({ up: 22, ...(k === 0 ? { scale: 0.7 } : {}) })), 822));
  fs.writeFileSync(fraw('light1_v01.json'), JSON.stringify({ anatomy: { measurement: 'auto-head' } }));
  const manPath = path.join(ART, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  const atk = { frames: 7, phases: [2, 2, 3], bodyHeight: 204, status: 'todo' };
  man.characters.scaly = { name: 'Scaly', animations: { idle: { frames: 8, loop: true, bodyHeight: 204 }, light1: atk, light2: atk, light3: atk,
    spin: { frames: 4, loop: true, bodyHeight: 204 }, taunt: { frames: 2, loop: true, bodyHeight: 204, scaleExempt: 'test: a pose the probe cannot read', scaleExemptVersion: 1 } } };
  for (const id of ['darky', 'darkier', 'fitty']) man.characters[id] = { name: id, scaleGate: 'warn', animations: { idle: { frames: 8, loop: true, bodyHeight: 204 }, light1: atk } };
  fs.writeFileSync(manPath, JSON.stringify(man, null, 2));
  fs.mkdirSync(path.join(ART, 'scale'), { recursive: true });
  fs.writeFileSync(path.join(ART, 'scale', 'builds.json'), JSON.stringify({ fighters: { darkier: { headColors: ['#283460'] } } }));
  fs.writeFileSync(path.join(ART, 'scale', 'scale-baseline.json'), JSON.stringify({ fighters: { scaly: { anims: { light1: { v: 1, head: 1 } } } } }));
  const scale = (rep, id) => rep?.characters.find((c) => c.id === id)?.scale;
  const sOut = path.join(OUT, 'characters', 'scaly');

  // (a)-(d): a new fighter (no approved strips) is gated strictly: uniform, drift and pop fail the pack
  const s1 = pack([...base, 'scaly', 'darky', 'darkier']);
  const g1 = scale(s1.json, 'scaly');
  check(s1.code === 1, `scale gate: a new fighter with off-size strips fails the pack (exit ${s1.code})`);
  const v = (n) => g1?.anims[n];
  check(v('light1')?.verdict === 'uniform' && v('light1').head > 0.82 && v('light1').head < 0.93 && v('light1').feet < 0.95, `scale gate: a fist above the head shrinks the strip -> 'uniform' (head ${v('light1')?.head}, feet ${v('light1')?.feet})`);
  check(v('light2')?.verdict === 'drift' && v('light2').head < 0.85 && Math.abs(v('light2').feet - 1) < 0.05, `scale gate: a narrower hair mass on the same body -> 'drift' (head ${v('light2')?.head}, feet ${v('light2')?.feet})`);
  check(v('light3')?.verdict === 'pop' && v('light3').range > 0.2, `scale gate: half the strip at 0.7x -> 'pop' (range ${v('light3')?.range})`);
  check(v('spin')?.verdict === 'unmeasured' && v('spin').strict && v('taunt')?.verdict === 'exempt' && v('idle')?.verdict === 'ref', `scale gate: low-confidence spin and exempt taunt are not judged (${v('spin')?.verdict}, ${v('taunt')?.verdict})`);
  check(g1?.failed.sort().join() === 'light1,light2,light3,spin' && g1.gate === 'auto', `scale gate: the three off strips and the unread candidate spin fail (${g1?.failed})`);
  const w1 = s1.json?.characters.find((c) => c.id === 'scaly')?.warnings || [];
  check(anyWarn(w1, /scale gate: light2 head 0\.\d\d of idle .*head\/hair drift/) && anyWarn(w1, /scale gate: light3 pops inside the strip/), 'scale gate: failures are named with the fix (redraw, re-stitch)');
  check(anyWarn(w1, /scale: light1 head 0\.\d\d was 1\.00 in art\/scale\/scale-baseline\.json at the same version v01/), 'scale gate: a strip that moved from its baseline at the same version is warned');
  // "strict" means refuse: a failing strict strip writes nothing (no sheet, no anims.json, no frames/ write-back)
  check(g1?.refused && !fs.existsSync(sOut) && !fs.existsSync(path.join(SCALY, 'frames')) && anyWarn(w1, /scale gate: did not write .*characters\/scaly\/ \(it keeps its last pack\)/),
    'scale gate: a failing strict strip refuses the pack: nothing is written for that fighter');
  // (g) hair in the body's colour: found only with a declared headColors
  const d1 = scale(s1.json, 'darky'), d2 = scale(s1.json, 'darkier');
  check(d1?.error && /declare headColors/.test(d1.error) && !d1.failed.length, `scale gate: hair drawn in body colours is not found automatically (${d1?.error})`);
  check(!d2?.error && d2?.ref?.source === 'declared' && d2.anims.light1?.verdict === 'drift', `scale gate: builds.json headColors finds it (${d2?.error || d2?.anims.light1?.verdict})`);
  check(fs.existsSync(path.join(OUT, 'characters', 'darkier', 'anims.json')), 'scale gate: a "warn" fighter is still written');

  // TOOL-ROTATED-ANATOMY: a person's check of that version accepts the unread spin as 'manual' (never 'ok'); a record
  // for another version does not
  const manQA = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  manQA.characters.scaly.animations.spin.scaleManualQA = { version: 2, result: 'pass', by: 'test', note: 'compared with the idle' };
  fs.writeFileSync(manPath, JSON.stringify(manQA, null, 2));
  const sq0 = pack([...base, '--dry-run', 'scaly']);
  check(scale(sq0.json, 'scaly')?.anims.spin.verdict === 'unmeasured' && scale(sq0.json, 'scaly').failed.includes('spin') && anyWarn(sq0.json.characters[0].warnings, /spin: the manual QA record \(scaleManualQA\) is for v02 but the packed strip is v01/),
    'manual QA: a record for another version does not accept the strip (warned)');
  manQA.characters.scaly.animations.spin.scaleManualQA.version = 1;
  fs.writeFileSync(manPath, JSON.stringify(manQA, null, 2));
  const sq1 = pack([...base, '--dry-run', 'scaly']);
  const sp1 = scale(sq1.json, 'scaly')?.anims.spin;
  check(sp1?.verdict === 'manual' && /manual QA by test/.test(sp1.reason) && !scale(sq1.json, 'scaly').failed.includes('spin'), `manual QA: the recorded version is accepted as 'manual' (${sp1?.verdict})`);

  // manifest variants: light2 and light3 approved (findings, not failures), so a pack that fits light1 is written
  const variant = (name, edit) => {
    const m = JSON.parse(fs.readFileSync(manPath, 'utf8'));
    edit(m.characters);
    const file = path.join(FIX, `manifest-${name}.json`);
    fs.writeFileSync(file, JSON.stringify(m));
    return file;
  };
  const approve = (a, names) => { for (const n of names) a[n] = { ...a[n], version: 1, approvedVersion: 1 }; };
  const mFit = variant('scaly-fit', (c) => approve(c.scaly.animations, ['light2', 'light3']));

  // auto head fit: only the 'uniform' strip is rescaled, once, from the raw; boxes follow the fit
  const s2 = pack([...base, '--manifest', mFit, 'scaly', '--fit-head', 'scaly:light1,scaly:light2']);
  const g2 = scale(s2.json, 'scaly');
  const p2 = s2.json?.characters.find((c) => c.id === 'scaly');
  const fit = p2?.packed.find((p) => p.anim === 'light1');
  const f = Number(/auto-head fit x([\d.]+)/.exec(fit?.notes.join(' ') || '')?.[1]);
  check(s2.code === 0 && fit?.source === 'raw/light1_v01.png' && f > 1.08 && f < 1.25 && Math.abs(g2.anims.light1.head - 1) <= 0.03 && g2.anims.light1.verdict === 'ok',
    `auto head fit: the uniform strip is rescaled x${f} and its head now matches the idle (${g2?.anims.light1.head}, exit ${s2.code})`);
  check(p2?.packed.find((p) => p.anim === 'light2')?.notes.some((n) => /auto-head: verdict drift .* not fitted/.test(n)) && g2.anims.light2.verdict === 'drift', 'auto head fit: a drift strip is never fitted');
  const mk1 = JSON.parse(fs.readFileSync(path.join(SCALY, 'frames', 'light1', '.packer.json'), 'utf8'));
  const mk2 = JSON.parse(fs.readFileSync(path.join(SCALY, 'frames', 'light2', '.packer.json'), 'utf8'));
  check(mk1.autoHead === f && !('autoHead' in mk2), `auto head fit: the frames/ marker records an applied factor only (${mk1.autoHead}, ${mk2.autoHead})`);
  const sm2 = JSON.parse(fs.readFileSync(path.join(sOut, 'anims.json'), 'utf8'));
  check(sm2.scaleAudit?.ref?.box?.length === 4 && sm2.scaleAudit.anims.light2?.verdict === 'drift' && sm2.scaleAudit.anims.light1.frames.length === 7 && sm2.scaleAudit.anims.light1.boxes.length === 7,
    'scale gate: anims.json carries meta.scaleAudit (reference head box, per-anim verdicts, per-frame heads and boxes)');
  const k3 = sm2.animations.light1.frames[3];
  const want = [128 + (180 - 128) * f, 240 + (80 - 240) * f, 40 * f, 30 * f].map(Math.round), wantHand = [128 + (200 - 128) * f, 240 + (96 - 240) * f].map(Math.round);
  check(JSON.stringify(sm2.boxes[k3].hit) === JSON.stringify([want]) && JSON.stringify(sm2.boxes[k3].hand) === JSON.stringify(wantHand) && p2.notes.some((n) => /hitboxes\.json light1: .* scaled x1\.\d+ about the pivot/.test(n)),
    `auto head fit: hitboxes.json boxes and hand anchors scale about the pivot (${JSON.stringify(sm2.boxes[k3].hit)} vs ${JSON.stringify([want])})`);
  const sheet2 = fs.readFileSync(path.join(sOut, 'sheet.png')), meta2 = fs.readFileSync(path.join(sOut, 'anims.json'));
  const s3 = pack([...base, '--manifest', mFit, 'scaly', '--fit-head', 'scaly:light1,scaly:light2']);
  const p3 = s3.json?.characters.find((c) => c.id === 'scaly');
  check(p3?.packed.find((p) => p.anim === 'light1')?.source === 'frames/light1/'
    && Buffer.compare(sheet2, fs.readFileSync(path.join(sOut, 'sheet.png'))) === 0 && Buffer.compare(meta2, fs.readFileSync(path.join(sOut, 'anims.json'))) === 0,
    'auto head fit: the next pack reads the fitted frames/ and is byte-identical');
  check(p3?.packed.find((p) => p.anim === 'light2')?.source === 'raw/light2_v01.png', 'auto head fit: a request that was not fitted is measured again from the raw on the next pack (not cached)');
  fs.writeFileSync(path.join(SCALY, 'hitboxes.json'), JSON.stringify({ light1: { _scale: f, 3: { hit: [[180, 80, 40, 30]] } } }));
  const s3b = pack([...base, '--manifest', mFit, 'scaly', '--fit-head', 'scaly:light1,scaly:light2']);
  const sm3b = JSON.parse(fs.readFileSync(path.join(sOut, 'anims.json'), 'utf8'));
  check(JSON.stringify(sm3b.boxes[sm3b.animations.light1.frames[3]].hit) === '[[180,80,40,30]]' && s3b.code === 0, 'auto head fit: boxes re-measured at the fit ("_scale") are not scaled again');
  // dropping the fit re-imports once, back to the raw size: light1 is a candidate again, so the pack is refused and
  // the last good sheet stays as it was
  const sheet3 = fs.readFileSync(path.join(sOut, 'sheet.png'));
  const s4 = pack([...base, '--manifest', mFit, 'scaly']);
  const l4 = s4.json?.characters.find((c) => c.id === 'scaly')?.packed.find((p) => p.anim === 'light1');
  check(l4?.source === 'raw/light1_v01.png' && scale(s4.json, 'scaly').anims.light1.verdict === 'uniform', 'auto head fit: removing it re-imports the raw at its packed size');
  check(s4.code === 1 && Buffer.compare(sheet3, fs.readFileSync(path.join(sOut, 'sheet.png'))) === 0, 'scale gate: a refused pack keeps the last written sheet byte for byte');

  // (e) staged strictness: an approved strip is a finding, not a failure; --strict-scale fails it anyway
  const mApproved = path.join(FIX, 'manifest-scaly-approved.json');
  const ma = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  approve(ma.characters.scaly.animations, ['light1', 'light2', 'light3']);
  fs.writeFileSync(mApproved, JSON.stringify(ma));
  const s4b = pack([...base, '--manifest', mApproved, 'scaly']); // written: the unfitted light1 for npm run scale below
  const s5 = pack([...base, '--manifest', mApproved, '--dry-run', 'scaly']);
  const g5 = scale(s5.json, 'scaly');
  check(s4b.code === 0 && s5.code === 0 && !g5.failed.length && g5.findings.length === 3 && !anyWarn(s5.json.characters[0].warnings, /scale gate:/), `staged gate: approved off-size strips are findings, the pack passes (exit ${s5.code}, ${g5?.findings.length} findings)`);
  const s6 = pack([...base, '--manifest', mApproved, '--dry-run', '--strict-scale', 'scaly']);
  check(s6.code === 1 && scale(s6.json, 'scaly').failed.length === 3, `--strict-scale: approved off-size strips fail too (exit ${s6.code})`);
  const r6t = pack(['--root', ART, '--out', OUT, '--manifest', mApproved, '--dry-run', '--strict-scale', 'scaly']);
  check(r6t.code === 1 && /SCALE GATE FAILED: scaly .* not written/.test(r6t.out) && /NOT WRITTEN/.test(r6t.out) && /~ light1 head|scale gate \(strict/.test(r6t.out), 'text report: the scale gate line and the failure summary');
  ma.characters.scaly.animations.light1 = { ...ma.characters.scaly.animations.light1, version: 1, approvedVersion: null };
  Object.assign(ma.characters.scaly.animations.light2, { scaleExempt: 'test', scaleExemptVersion: 1 });
  Object.assign(ma.characters.scaly.animations.light3, { scaleExempt: 'test', scaleExemptVersion: 1 });
  fs.writeFileSync(mApproved, JSON.stringify(ma));
  const s7 = pack([...base, '--manifest', mApproved, '--dry-run', '--strict-scale', '--fit-head', 'scaly:light1', 'scaly']);
  check(s7.code === 0 && !scale(s7.json, 'scaly').failed.length, `--strict-scale: exit 0 once every strip is ok or exempt (exit ${s7.code}, ${scale(s7.json, 'scaly')?.failed})`);
  // an exemption covers only the version it was written for: another version (or none given) is measured and warned
  ma.characters.scaly.animations.light2.scaleExemptVersion = 2;
  delete ma.characters.scaly.animations.light3.scaleExemptVersion;
  fs.writeFileSync(mApproved, JSON.stringify(ma));
  const s7b = pack([...base, '--manifest', mApproved, '--dry-run', '--strict-scale', '--fit-head', 'scaly:light1', 'scaly']);
  const g7b = scale(s7b.json, 'scaly'), w7b = s7b.json?.characters.find((c) => c.id === 'scaly')?.warnings || [];
  check(s7b.code === 1 && g7b?.anims.light2.verdict === 'drift' && g7b.anims.light3.verdict === 'pop' && g7b.failed.sort().join() === 'light2,light3'
    && anyWarn(w7b, /light2: the manifest's scale exemption was written for v02 but the packed strip is v01 - measured/) && anyWarn(w7b, /light3: the manifest's scale exemption has no "scaleExemptVersion"/),
    `exemptions are tied to their strip version: a redraw is measured until re-exempted (${g7b?.failed})`);

  // an auto-head request that was not fitted is not cached: exempting the misread frame lets the next pack fit it
  const fittyFrames = path.join(ART, 'characters', 'fitty', 'frames', 'light1');
  const fp1 = pack([...base, 'fitty']);
  const fl1 = fp1.json?.characters.find((c) => c.id === 'fitty')?.packed.find((p) => p.anim === 'light1');
  const fmk1 = JSON.parse(fs.readFileSync(path.join(fittyFrames, '.packer.json'), 'utf8'));
  check(scale(fp1.json, 'fitty')?.anims.light1.verdict === 'pop' && fl1?.notes.some((n) => /auto-head: verdict pop .* not fitted/.test(n)) && !('autoHead' in fmk1),
    `auto head fit: a 'pop' strip is not fitted and the request is not recorded (${scale(fp1.json, 'fitty')?.anims.light1.verdict})`);
  const mFitty = variant('fitty-exempt', (c) => Object.assign(c.fitty.animations.light1, { scaleExemptFrames: { 0: 'test: drawn at another size' }, scaleExemptVersion: 1 }));
  const fp2 = pack([...base, '--manifest', mFitty, 'fitty']);
  const fl2 = fp2.json?.characters.find((c) => c.id === 'fitty')?.packed.find((p) => p.anim === 'light1');
  const fmk2 = JSON.parse(fs.readFileSync(path.join(fittyFrames, '.packer.json'), 'utf8'));
  check(fl2?.source === 'raw/light1_v01.png' && fl2.notes.some((n) => /auto-head fit x1\.\d+/.test(n)) && scale(fp2.json, 'fitty')?.anims.light1.verdict === 'ok' && fmk2.autoHead > 1,
    `auto head fit: after an exemption the standing request is re-measured and fitted (${scale(fp2.json, 'fitty')?.anims.light1.verdict}, marker ${fmk2.autoHead})`);

  // npm run scale on the packed fixture: report, heads sheet, baseline, guide
  const sc = spawnSync(process.execPath, [path.join(TOOL_DIR, 'scale-audit.mjs'), '--root', ART, '--public', OUT, '--guide', 'scaly'], { encoding: 'utf8' });
  const rep = fs.existsSync(path.join(ART, 'scale', 'scale-report.json')) && JSON.parse(fs.readFileSync(path.join(ART, 'scale', 'scale-report.json'), 'utf8'));
  check(sc.status === 0 && rep?.fighters?.scaly?.anims?.light2?.verdict === 'drift' && /light2 .*DRIFT/.test(sc.stdout), `npm run scale: report written with the same verdicts (exit ${sc.status}) ${sc.stderr}`);
  const heads = fs.existsSync(path.join(ART, 'scale', 'heads-scaly.png')) && loadPng(path.join(ART, 'scale', 'heads-scaly.png'));
  check(heads && heads.h > 6 * 100 && heads.w > 8 * 100, `npm run scale: heads-scaly.png contact sheet (${heads?.w}x${heads?.h})`);
  check(fs.existsSync(path.join(SCALY, 'reference', 'head_scale_guide.png')), 'npm run scale --guide: reference/head_scale_guide.png');
  const bl = JSON.parse(fs.readFileSync(path.join(ART, 'scale', 'scale-baseline.json'), 'utf8'));
  check(bl.fighters.scaly.anims.light1.head === 1 && bl.fighters.scaly.anims.light2?.v === 1 && /light1 head 0\.\d\d vs 1\.00 in the baseline/.test(sc.stdout),
    'npm run scale: the baseline keeps a same-version row (and reports the move) and records new rows');

  // TOOL-008: stitch two parts with a measured factor; the result packs without a pop
  const stitch = (...a) => spawnSync(process.execPath, [path.join(TOOL_DIR, 'stitch-parts.mjs'), '--root', ART, '--public', OUT, ...a], { encoding: 'utf8' });
  const st = stitch('scaly', 'light3', '2');
  const side = fs.existsSync(sraw('light3_v02.json')) && JSON.parse(fs.readFileSync(sraw('light3_v02.json'), 'utf8')).stitch;
  check(st.status === 0 && fs.existsSync(sraw('light3_v02.png')) && side?.scaledPart === 'A' && side.bFactor > 1.3 && side.bFactor < 1.6 && Math.abs(side.afterB_vs_A - 1) < 0.06,
    `stitch: part B drawn at 0.7x measured x${side?.bFactor}; the bigger part A is scaled down (after ${side?.afterB_vs_A}) ${st.stderr}`);
  const s8 = pack([...base, '--dry-run', 'scaly']);
  const l3 = scale(s8.json, 'scaly')?.anims.light3;
  check(l3 && l3.verdict !== 'pop' && l3.range <= 0.12, `stitch: the stitched light3_v02 packs without a pop (${l3?.verdict}, range ${l3?.range})`);
  check(stitch('scaly', 'light3', '2').status === 1, 'stitch: never overwrites an existing version');
  check(stitch('scaly', 'light3', '3', '--parts', '2', '--factor', '0.8').status === 1, 'stitch: a manual factor needs a reason');
  const cnt = stitch('scaly', 'light3', '3', '--parts', '2', '--counts', '2,4', '--dry-run');
  check(cnt.status === 1 && /part A: found 3 pose\(s\), --counts says 2/.test(cnt.stderr), 'stitch: --counts must match the poses found');
  // the reference must be the idle the art has now, not an older packed one (Killua light1 v04 vs idle v01)
  fs.copyFileSync(sraw('idle_v01.png'), sraw('idle_v02.png'));
  const stale = stitch('scaly', 'light3', '3', '--parts', '2', '--dry-run');
  fs.rmSync(sraw('idle_v02.png'));
  check(stale.status === 1 && /packed idle .* is v01, but raw\/idle_v02\.png is the idle now/.test(stale.stderr), `stitch: refuses to measure against an older packed idle (${stale.stderr.trim().slice(0, 80)})`);

  // TITLE-STITCH: a pose's arm reaches over the next pose's column without touching it (Killua specialForward v12). A
  // vertical cut handed that piece of the arm to the neighbour; the stitch now cuts each figure out by its own pixels and
  // lays the figures out one by one, so the packed frames keep the arm whole and the neighbour clean.
  savePng(sraw(path.join('_parts', 'light3_v04_A.png')), scaleStrip([{}, { reach: 28 }, {}], 841));
  savePng(sraw(path.join('_parts', 'light3_v04_B.png')), scaleStrip(Array.from({ length: 4 }, () => ({ scale: 0.7 })), 842));
  const fg = stitch('scaly', 'light3', '4');
  const fgSide = fs.existsSync(sraw('light3_v04.json')) && JSON.parse(fs.readFileSync(sraw('light3_v04.json'), 'utf8')).stitch;
  check(fg.status === 0 && fgSide?.poses?.join() === '3,4' && fgSide.layout?.join() === 'figures,figures', `stitch: figures overlapping in projection are found whole (${fgSide?.poses}, ${fgSide?.layout}) ${fg.stderr}`);
  const figOut = path.join(FIX, 'out-figures');
  const mWarn = variant('scaly-warn', (c) => { c.scaly.scaleGate = 'warn'; }); // the fixture's other strips fail on purpose
  const fp = spawnSync(process.execPath, [PACKER, '--root', ART, '--out', figOut, '--manifest', mWarn, '--no-writeback', '--json', 'scaly'], { encoding: 'utf8' });
  const figMeta = fs.existsSync(path.join(figOut, 'characters', 'scaly', 'anims.json')) && JSON.parse(fs.readFileSync(path.join(figOut, 'characters', 'scaly', 'anims.json'), 'utf8'));
  const figSheet = figMeta && loadPng(path.join(figOut, 'characters', 'scaly', 'sheet.png'));
  const cellBox = (f) => bb(cell(figSheet, f));
  const lf = figMeta?.animations?.light3?.frames || [];
  const [b0, b1, b2] = lf.slice(0, 3).map(cellBox);
  check(fp.status === 0 && lf.length === 7 && b1 && b0 && b2 && b1.w > b0.w * 1.6 && Math.abs(b2.w - b0.w) <= 3,
    `stitch: the reaching arm stays in its own frame and the next frame is clean (widths ${b0?.w} / ${b1?.w} / ${b2?.w})`);
  for (const f of ['light3_v04.png', 'light3_v04.json']) fs.rmSync(sraw(f), { force: true });
  // a manual factor is honoured where the probe finds no head (hair in a colour the idle does not have), but only with
  // the measured landmarks and their uncertainty on record (Naruto specialUp v04)
  savePng(sraw(path.join('_parts', 'light3_v05_A.png')), scaleStrip([{ hairC: [40, 200, 200] }, { hairC: [40, 200, 200] }, { hairC: [40, 200, 200] }], 843));
  savePng(sraw(path.join('_parts', 'light3_v05_B.png')), scaleStrip(Array.from({ length: 4 }, () => ({ hairC: [40, 200, 200] })), 844));
  const noHead = stitch('scaly', 'light3', '5', '--dry-run');
  const noLm = stitch('scaly', 'light3', '5', '--factor', '1', '--reason', 'test', '--dry-run');
  const withLm = stitch('scaly', 'light3', '5', '--factor', '1', '--reason', 'test', '--landmarks', 'A f0 hair 14 px, B f0 14 px', '--uncertainty', '1 px', '--dry-run');
  check(noHead.status === 1 && /no head found in part A/.test(noHead.stderr) && noLm.status === 1 && /--landmarks/.test(noLm.stderr) && withLm.status === 0 && /landmarks: A f0 hair 14 px/.test(withLm.stdout),
    `stitch: an unmeasurable head needs --factor with --landmarks and --uncertainty, then it is honoured (${noHead.status}/${noLm.status}/${withLm.status})`);
  // by default the reference is the current idle packed fresh from art/ without --quantize (what the gate measures);
  // it agrees with the measurement against this test's own pack
  const fresh = spawnSync(process.execPath, [path.join(TOOL_DIR, 'stitch-parts.mjs'), '--root', ART, 'scaly', 'light3', '3', '--parts', '2', '--dry-run'], { encoding: 'utf8' });
  const fm = Number(/B factor x([\d.]+)/.exec(fresh.stdout)?.[1]);
  check(fresh.status === 0 && Math.abs(fm - side.bFactor) < 0.03, `stitch: the fresh unquantized idle reference measures like the packed one (x${fm} vs x${side?.bFactor}) ${fresh.stderr}`);

  // ART-KIL-PROBE: a strip's numbers come from its own pixels and the idle's only. A candidate that brings many new
  // colours between the hair and skin tones (a glowing prop) moved the fighter-wide median cut, and with it the
  // unchanged idle's head (Killua: 52x35 -> 52x43) and every other strip's verdict. Now nothing else moves.
  const glow = (seed) => {
    const img = scaleStrip([{}, {}, {}, {}], seed);
    const hue = (t) => [0, 1, 2].map((j) => Math.round(127.5 + 127.5 * Math.cos(2 * Math.PI * (t - j / 3))));
    for (let k = 0; k < 4; k++) {
      const x0 = (30 + k * 46 + 7) * S, y0 = (110 - 60) * S, w = 14 * S, h = 56 * S;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const c = hue((x / w + y / h * 7) % 1), i = (y0 + y) * img.w * 4 + (x0 + x) * 4;
        img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
      }
    }
    return img;
  };
  const mGlow = variant('scaly-glow', (c) => { c.scaly.animations.charge = { frames: 4, loop: true, bodyHeight: 204 }; });
  const sg0 = scale(pack([...base, '--manifest', mGlow, '--dry-run', 'scaly']).json, 'scaly');
  savePng(sraw('charge_v01.png'), glow(831));
  const sg1 = scale(pack([...base, '--manifest', mGlow, '--dry-run', 'scaly']).json, 'scaly');
  const moved = sg0 && sg1 ? Object.keys(sg0.anims).filter((n) => JSON.stringify(sg0.anims[n].frames) !== JSON.stringify(sg1.anims[n]?.frames)) : ['?'];
  check(sg1?.anims.charge && JSON.stringify(sg0?.ref?.headPx) === JSON.stringify(sg1.ref.headPx) && !moved.length,
    `scale probe: a new strip's colours move neither the idle head (${sg0?.ref?.headPx} / ${sg1?.ref?.headPx}) nor another strip (${moved})`);
  check(sg0?.ref && JSON.stringify(sg0.ref.palette) === JSON.stringify(sg1?.ref?.palette),
    `scale probe: the idle's head colours do not depend on the other strips (${sg0?.ref?.palette?.length} / ${sg1?.ref?.palette?.length} colours)`);
  // the same at the probe level, with Killua-like colours: silver-lavender hair shades just above light skin shades,
  // and a candidate with a broad rainbow prop (the fighter-wide median cut merged all his hair shades into one)
  {
    const W = 256;
    const cell = (paint) => { const data = new Uint8Array(W * W * 4); paint((x, y, c) => { const i = (y * W + x) * 4; data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255; }); return { w: W, h: W, data }; };
    const fig = (bob = 0, rainbow = false) => cell((p) => {
      const fill = (x0, x1, y0, y1, f) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) p(x, y, f(x, y)); };
      fill(104, 152, 232, 240, () => [150, 40, 40]);
      fill(108, 148, 150, 232, (x, y) => [40 + (y % 3), 52, 96 + (x % 2)]);
      fill(100, 156, 90 - bob, 150, (x, y) => [70 + (x % 4), 60 + (y % 3), 140]);
      fill(110, 146, 62 - bob, 90 - bob, (x, y) => [250 - (x % 2), 234 - (y % 4), 234 - (x % 3) * 2]);
      fill(104, 152, 36 - bob, 64 - bob, (x, y) => [242 + (x % 4), 238 - (y % 3) * 2, 250 - (x % 3)]);
      if (rainbow) fill(0, 100, 20, 250, (x, y) => { const t = (x / 100 + (y - 20) / 230 * 9) % 1; return [0, 1, 2].map((j) => Math.round(127.5 + 127.5 * Math.cos(2 * Math.PI * (t - j / 3)))); });
    });
    const idle = { name: 'idle', cells: [0, 0, 1, 1, 1, 0, 0, 1].map((b) => fig(b)) }, run = { name: 'run', cells: [0, 1, 0, 1].map((b) => fig(b)) };
    const a = probe.auditCharacter([idle, run]), b = probe.auditCharacter([idle, run, { name: 'charge', cells: [0, 1, 0, 1].map((k) => fig(k, true)) }]);
    const hexes = (A) => [...(A.palette?.head || [])].sort().join();
    check(!a.error && hexes(a) === hexes(b) && JSON.stringify(a.ref.headPx) === JSON.stringify(b.ref.headPx) && a.anims.run.head === b.anims.run.head,
      `scale probe: a rainbow candidate leaves the idle's ${a.palette?.head.size} head colours as they are (${b.palette?.head.size} with it)`);
  }
  const q1 = scale(pack([...base, '--manifest', mGlow, '--dry-run', '--quantize', '48', 'scaly']).json, 'scaly');
  check(sg1 && q1 && Object.keys(sg1.anims).every((n) => JSON.stringify(sg1.anims[n].frames) === JSON.stringify(q1.anims[n].frames)), 'scale probe: --quantize 48 does not change a single measurement');
  fs.rmSync(sraw('charge_v01.png'));
  // npm run scale reads the gate's own recorded numbers (meta.scaleAudit), not a re-measure of the quantized sheet
  pack([...base, '--manifest', mApproved, '--quantize', '48', 'scaly']);
  const smq = JSON.parse(fs.readFileSync(path.join(sOut, 'anims.json'), 'utf8')).scaleAudit;
  const scq = spawnSync(process.execPath, [path.join(TOOL_DIR, 'scale-audit.mjs'), '--root', ART, '--public', OUT, '--json', 'scaly'], { encoding: 'utf8' });
  let repq = null;
  try { repq = JSON.parse(scq.stdout).fighters.scaly; } catch { /* reported below */ }
  check(smq?.method === 'idle-palette' && repq && JSON.stringify(repq.ref.headPx) === JSON.stringify(smq.ref.headPx)
    && Object.keys(smq.anims).every((n) => repq.anims[n]?.head === smq.anims[n].head && repq.anims[n]?.verdict === smq.anims[n].verdict),
  `npm run scale: the report equals the packer gate's recorded audit (${scq.status}, ${repq?.ref?.headPx} / ${smq?.ref?.headPx})`);
  const st2 = stitch('scaly', 'light3', '3', '--parts', '2', '--factor', '0.8', '--reason', 'test', '--dry-run');
  check(st2.status === 0 && /manual: test/.test(st2.stdout) && !fs.existsSync(sraw('light3_v03.png')), 'stitch: --parts re-stitches older parts; --dry-run writes nothing');

  // builds.json scaleReference: an approved reference cell replaces the idle as the measure; the idle gets a real verdict
  // (and is gated), and a missing cell fails the gate instead of falling back to the idle (Killua's title-style idle)
  const refDir = path.join(SCALY, 'reference');
  fs.mkdirSync(refDir, { recursive: true });
  savePng(path.join(refDir, 'ref_cell_v01.png'), cell(figSheet, figMeta.animations.idle.frames[0]));
  const buildsPath = path.join(ART, 'scale', 'builds.json'), buildsBefore = fs.readFileSync(buildsPath, 'utf8');
  const withRef = (cells) => { const b = JSON.parse(buildsBefore); b.fighters.scaly = { ...(b.fighters.scaly || {}), scaleReference: { cells } }; fs.writeFileSync(buildsPath, JSON.stringify(b)); };
  withRef(['characters/scaly/reference/ref_cell_v01.png']);
  const sr = pack([...base, '--dry-run', '--strict-scale', 'scaly']);
  const gr = scale(sr.json, 'scaly');
  check(gr?.ref?.reference === 'characters/scaly/reference/ref_cell_v01.png' && gr.anims.idle?.verdict === 'ok' && gr.anims.idle.strict && gr.anims.light2?.verdict === 'drift',
    `scaleReference: the idle is measured against the approved cell (${gr?.anims?.idle?.verdict}, ${gr?.anims?.idle?.head}) and the strips still are (${gr?.anims?.light2?.verdict})`);
  withRef(['characters/scaly/reference/missing_v01.png']);
  const sm = pack([...base, '--dry-run', 'scaly']);
  const gm = scale(sm.json, 'scaly');
  check(sm.code === 1 && /scaleReference: characters\/scaly\/reference\/missing_v01\.png does not exist/.test(gm?.error || '') && gm.failed.length > 0,
    `scaleReference: a missing reference cell fails the gate (${gm?.error})`);
  fs.writeFileSync(buildsPath, buildsBefore);

  // the auto head fit places a fitted strip again: clip and margin warnings describe the cells that ship, not the
  // discarded pre-fit ones (Sasuke special v13 warned "clipped 15px" for a fitted frame inside the cell). widey's
  // light1 packs 13 % too big (bodyHeight 230 vs the idle's 204) and its f3 arm clips there; fitted it fits. light2
  // reads the idle's size (not fitted) and clips: that warning stays.
  const wraw = (n) => path.join(ART, 'characters', 'widey', 'raw', n);
  savePng(wraw('idle_v01.png'), scaleStrip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), 851, { gap: 70 }));
  savePng(wraw('light1_v01.png'), scaleStrip(seven((k) => (k === 3 ? { reach: 37 } : {})), 852, { gap: 70 }));
  savePng(wraw('light2_v01.png'), scaleStrip(seven((k) => (k === 3 ? { reach: 60 } : {})), 853, { gap: 100 }));
  for (const n of ['light1', 'light2']) fs.writeFileSync(wraw(`${n}_v01.json`), JSON.stringify({ anatomy: { measurement: 'auto-head' } }));
  const mw = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  mw.characters.widey = { name: 'widey', scaleGate: 'warn', animations: { idle: { frames: 8, loop: true, bodyHeight: 204 }, light1: { ...atk, bodyHeight: 230 }, light2: atk } };
  const mwPath = path.join(FIX, 'manifest-widey.json');
  fs.writeFileSync(mwPath, JSON.stringify(mw));
  const wp = pack([...base, '--manifest', mwPath, '--dry-run', 'widey']);
  const wr = wp.json?.characters.find((c) => c.id === 'widey');
  const wl1 = wr?.packed.find((p) => p.anim === 'light1');
  check(wl1?.notes.some((n) => /auto-head fit x0\.8\d/.test(n)) && !anyWarn(wr.warnings, /^light1: .*(clipped by the|cell margin)/) && anyWarn(wr.warnings, /^light2: 1 frame\(s\) clipped by the 256x256 cell \(#3 right \d+px\)/),
    `auto head fit: placement warnings are for the fitted cells (light1 fitted, none; light2 unfitted, kept) (${wr?.warnings.filter((w) => /clipped|margin/.test(w)).join(' | ')})`);
}

// Tech poses (ADR 0030): wallTech's cling and push-off frames are wall-anchored (leftmost pixel on the wall line x 8,
// anims.json wallLine + wallAnchor), so a full push-off fits the cell; a cling with only a thin arm on the wall line
// warns; a roll frame packed at a standing height warns; the scale gate leaves the tucked / rotated beats unread
// ('partial', not a pass) until a manual QA record of that version covers them, and its record keeps every unread frame.
function techPoseTests(base) {
  const traw = (n) => path.join(ART, 'characters', 'techy', 'raw', n);
  // poses as rect lists [x0, x1, y0, y1, colour, { rawH, bare }] in art px from the feet; `bare` skips the outline,
  // `rawH` sets a rect's height in raw px (a limb thinner than one art px)
  const poseStrip = (poses, seed, gap = 60) => {
    const rand = mulberry(seed);
    const img = image((poses.length * gap + 40) * S, 120 * S, [255, 0, 255], rand);
    poses.forEach((pose, k) => {
      const fx = (40 + k * gap) * S, floor = 110 * S;
      for (const [x0, x1, y0, y1, , o] of pose) if (!o?.bare) rect(img, fx + (x0 - 1) * S, floor - (y1 + 1) * S, (x1 - x0 + 2) * S, (y1 - y0 + 2) * S, COL.outline, rand);
      for (const [x0, x1, y0, y1, c, o] of pose) rect(img, fx + x0 * S, floor - y1 * S, (x1 - x0) * S, o?.rawH ?? (y1 - y0) * S, c, rand);
    });
    fringe(img, rand);
    return img;
  };
  const stand = () => scaleFigure({});
  savePng(traw('idle_v01.png'), scaleStrip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), 901));
  // wallTech: f0 soles flat on the wall (a tall block at the far left), f1 only a thin arm reaching the wall, f2 a full
  // diagonal push-off (legs out about 200 px from the wall: more than the old pivot anchoring left room for), f3-f4
  // ordinary airborne figures (centred on the feet, not anchored)
  const body = [[0, 14, 14, 44, COL.orange], [2, 12, 44, 56, COL.skin], [1, 13, 56, 64, COL.hair]];
  const cling = [[-22, -18, 6, 30, SHOE], [-18, 0, 14, 22, COL.pants], ...body];
  const reach = [[-18, 0, 30, 31, COL.skin, { rawH: 4, bare: true }], [-6, 0, 10, 22, COL.pants], ...body];
  const push = [[-60, -56, 20, 26, SHOE], [-56, 0, 18, 24, COL.pants], ...body];
  savePng(traw('wallTech_v01.png'), poseStrip([cling, reach, push, stand(), stand()], 902, 100));
  // techRoll: f0 the shoulder contact and f1-f4 the tumble, tucked balls about half the standing height (all unread by
  // the probe), except f3: a ball drawn at the full standing height (a pose packed like a standing one); f5 a readable
  // standing figure
  const ball = (h) => [[-h / 2, h / 2, 0, h, COL.orange], [-h / 4, h / 4, h * 0.6, h * 0.9, COL.hair]];
  savePng(traw('techRoll_v01.png'), poseStrip([ball(36), ball(36), ball(36), ball(72), ball(36), stand()], 904));
  const manPath = path.join(ART, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  man.characters.techy = { name: 'Techy', scaleGate: 'warn', animations: { idle: { frames: 8, loop: true, bodyHeight: 204 },
    wallTech: { frames: 5, phases: [2, 1, 2], bodyHeight: 204 }, techRoll: { frames: 6, phases: [1, 4, 1], bodyHeight: 204 } } };
  fs.writeFileSync(manPath, JSON.stringify(man, null, 2));

  const r = pack([...base, 'techy']);
  const C = r.json?.characters.find((c) => c.id === 'techy');
  const metaFile = path.join(OUT, 'characters', 'techy', 'anims.json');
  if (!fs.existsSync(metaFile)) { check(false, `tech poses: techy packed (${(C?.warnings || []).join(' | ').slice(0, 400)})`); return; }
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  const sheet = loadPng(path.join(OUT, 'characters', 'techy', 'sheet.png'));
  const wf = meta.animations.wallTech?.frames || [];
  const boxes = wf.map((i) => bb(cell(sheet, i)));
  const left = boxes.map((b) => b?.x0), WL = 8;
  check(wf.length === 5 && left[0] === WL && left[1] === WL && left[2] === WL && left[3] > WL && left[4] > WL && meta.wallLine === WL,
    `tech poses: the cling and push-off frames are wall-anchored on the wall line x ${WL} (anims.json wallLine ${meta.wallLine}), the airborne ones are not (${left})`);
  const W = C?.warnings || [];
  check(boxes[2]?.w > 180 && boxes[2].x1 <= FW - 1 - 4 && !anyWarn(W, /wallTech: \d+ frame\(s\) (clipped|reach into)/),
    `tech poses: a full diagonal push-off (${boxes[2]?.w} px wide) fits the cell without clipping or touching its margin`);
  const techFrames = [...(meta.animations.techRoll?.frames || []), ...wf];
  check(techFrames.length === 11 && techFrames.every((i) => meta.boxes[i] && !meta.boxes[i].hit && meta.boxes[i].hurt), 'tech poses: tech frames get hurt boxes but never hit boxes (their middle beat is no strike)');
  const wa = meta.wallAnchor || {};
  check(Object.keys(wa).sort().join() === wf.slice(0, 3).map(String).sort().join() &&
    wf.slice(0, 3).every((i, k) => wa[i] === Math.round((boxes[k].x0 + boxes[k].x1) / 2 - PX)),
    `tech poses: anims.json wallAnchor records the anchored frames' body centre against the pivot (${JSON.stringify(wa)})`);
  check(anyWarn(W, /wallTech: 1 cling frame\(s\) barely touch the wall line \(#1: \d+px/) && !anyWarn(W, /barely touch the wall line \(#0/),
    `tech poses: a cling with only a thin arm on the wall line warns; soles flat on it do not (${W.filter((w) => /wall line/.test(w)).join(' | ')})`);
  check(anyWarn(W, /techRoll: 1 tucked \/ braced frame\(s\) out of their size band \(#3 0\.\d\d of the idle's height/),
    `tech poses: a roll frame packed at a standing height warns; half-height balls (the contact included) do not (${W.filter((w) => /size band/.test(w)).join(' | ')})`);
  const g = C?.scale;
  check(g?.anims.techRoll?.verdict === 'partial' && g.anims.wallTech?.verdict === 'partial',
    `tech poses: the readable frames pass, the unread beats keep the strips 'partial' (${g?.anims.techRoll?.verdict} ${g?.anims.techRoll?.head}, ${g?.anims.wallTech?.verdict} ${g?.anims.wallTech?.head})`);
  const sx = pack([...base, '--dry-run', '--strict-scale', 'techy']);
  check(sx.json?.characters.find((c) => c.id === 'techy')?.scale?.failed.includes('techRoll'), "tech poses: 'partial' is not a pass for a strict strip");
  man.characters.techy.animations.techRoll.scaleManualQA = { version: 1, result: 'pass', by: 'test', note: 'tumble frames compared with the idle at one scale' };
  fs.writeFileSync(manPath, JSON.stringify(man, null, 2));
  const sq = pack([...base, '--dry-run', '--strict-scale', 'techy']);
  const gq = sq.json?.characters.find((c) => c.id === 'techy')?.scale;
  check(gq?.anims.techRoll?.verdict === 'manual' && !gq.failed.includes('techRoll') && gq.failed.includes('wallTech'),
    `tech poses: a manual QA record of that version accepts the unread beats as 'manual' (${gq?.anims.techRoll?.verdict}); wallTech still fails`);
  // unit: the unread frames follow the strip's beats, rescaled like the packer does for another frame count
  const G = probe.resolveGate(null);
  check(probe.lowConfFrames('techRoll', G, [1, 4, 1], 6).join() === '0,1,2,3,4' && probe.lowConfFrames('wallTech', G, [2, 1, 2], 5).join() === '0,1,2' &&
    probe.lowConfFrames('techRoll', G, [1, 4, 1], 8).join() === '0,1,2,3,4,5' &&probe.lowConfFrames('techRoll', G, null, 3).join() === '0,1,2' &&
    probe.lowConfFrames('techGround', G, [1, 2, 1], 4).length === 0,
    'tech poses: unread frames come from the beats (the roll\'s contact and tumble; rescaled; a listed strip without phases is entirely unread)');
  const bad = [];
  probe.resolveGate({ lowConfPhases: { techRoll: [5] } }, bad);
  check(bad.length === 1 && /lowConfPhases/.test(bad[0]), 'tech poses: a malformed spec.scaleGate.lowConfPhases is reported');
  // the recorded audit keeps every unread frame, also one a frame exemption skipped: judged again without that
  // exemption (auditFromCompact), it is still not read, never its probe number (here a 0.7 head, which would be a pop)
  const measured = [{ k: 0, head: 1, feet: 1 }, { k: 1, head: 0.7, feet: 1, low: true }, { k: 2, head: 1.01, feet: 1 }];
  const sx1 = { ...probe.judgeStrip('techRoll', measured, G, { frames: [1] }), version: 1 };
  const A = { anims: { techRoll: sx1 }, ref: { box: null, headPx: 30, hA: 1, hW: 1, hH: 1, feet: 1 }, palette: { headSource: 'idle', head: new Set(), feet: new Set() } };
  const rt = probe.auditFromCompact(probe.compactAudit(A, G), { gate: G })?.anims.techRoll;
  check(sx1.low?.join() === '1' && rt?.verdict === 'partial' && rt.low?.join() === '1' && rt.frames[1].low === true,
    `tech poses: the compact audit keeps an exempted unread frame unread (${sx1.low}; re-judged ${rt?.verdict}, low ${rt?.low})`);

  // TOOL-GOKU-PROBE: builds.json headProbe { mode: 'manual' } for a fighter the probe misreads. Its numbers neither pass
  // nor fail a strip: a measured 'uniform' and a measured 'ok' both become 'unmeasured' (a strict strip still fails),
  // a scaleManualQA record of that version accepts it as 'manual', an exemption stays an exemption, and the recorded
  // audit judged again (npm run scale) gives the same verdicts when it gets the fighter's builds row.
  const off = probe.gateFor(G, { headProbe: { mode: 'manual', why: 'test hair' } });
  const small = [{ k: 0, head: 0.8, feet: 0.8 }, { k: 1, head: 0.81, feet: 0.79 }], fine = [{ k: 0, head: 1, feet: 1 }];
  const hp = {
    plain: probe.judgeStrip('light1', small, G).verdict,
    off: probe.judgeStrip('light1', small, off),
    offFine: probe.judgeStrip('light1', fine, off).verdict,
    manual: probe.judgeStrip('light1', small, off, { manual: { v: 1, by: 'test', note: 'landmarks' } }).verdict,
    exempt: probe.judgeStrip('light1', small, off, { reason: 'hidden head' }).verdict,
    other: probe.gateFor(G, { headProbe: { mode: 'auto' } }) === G && probe.gateFor(G, {}) === G,
  };
  check(hp.plain === 'uniform' && hp.off.verdict === 'unmeasured' && /head probe off for this fighter: test hair/.test(hp.off.reason) &&
    hp.offFine === 'unmeasured' && hp.manual === 'manual' && hp.exempt === 'exempt' && hp.other,
    `headProbe manual: numbers never pass or fail, only a manual QA record does (${hp.plain}/${hp.off.verdict}/${hp.offFine}/${hp.manual}/${hp.exempt}/${hp.other})`);
  const Ahp = { anims: { light1: { ...probe.judgeStrip('light1', small, G), version: 1 } }, ref: { box: null, headPx: 30, hA: 1, hW: 1, hH: 1, feet: 1 }, palette: { headSource: 'idle', head: new Set(), feet: new Set() } };
  const reHp = probe.auditFromCompact(probe.compactAudit(Ahp, G), { gate: G, decl: { headProbe: { mode: 'manual', why: 'test hair' } } })?.anims.light1;
  check(reHp?.verdict === 'unmeasured', `headProbe manual: the recorded audit re-judged with the builds row is unmeasured too (${reHp?.verdict})`);
}

// Attack alts (ADR 0031): an alt packs like its base (the fighter's base bodyHeight when its own entry has none, the
// guide's frames and phases when the manifest has no entry) and ships its base's hit and hurt boxes frame for frame.
// The packer warns, never fails, when a drawn alt's frame count or phases differ from its base's, or its drawn strike
// lands more than 24 px (reach or height) from the base's hit. An alt entry with no art yet (status todo) stays silent.
function attackAltTests(base) {
  const araw = (n) => path.join(ART, 'characters', 'alty', 'raw', n);
  const jab = [{}, { punch: 2 }, { punch: 16 }, { punch: 16 }, { punch: 9 }, { punch: 4 }, {}];
  const kick = [{}, { kick: 4 }, { kick: 16 }, { kick: 16 }, { kick: 8 }, { kick: 3 }, {}];
  const upper = [{}, { bob: -1 }, { bob: -2 }, { up: 16 }, { up: 18 }, { up: 6 }, { bob: -1 }, {}];
  const opt = (seed) => ({ seed, specks: 0 });
  savePng(araw('idle_v01.png'), strip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), opt(951)));
  savePng(araw('light1_v01.png'), strip(jab, opt(952)));
  savePng(araw('light1Alt_v01.png'), strip(jab, opt(953))); // the same strike: silent
  savePng(araw('light2_v01.png'), strip(jab, opt(954)));
  savePng(araw('light2Alt_v01.png'), strip(jab.map((q) => (q.punch ? { punch: Math.min(q.punch, 3) } : q)), opt(955))); // falls short
  savePng(araw('light3_v01.png'), strip(kick, opt(956)));
  savePng(araw('light3Alt_v01.png'), strip(jab, opt(957))); // the low kick's alt punches at head height
  savePng(araw('heavy_v01.png'), strip(upper, opt(958)));
  savePng(araw('heavyAlt_v01.png'), strip(upper.filter((q, k) => k !== 6), opt(959))); // 7 frames: phases 3/2/2
  savePng(araw('hurtHigh_v01.png'), strip([{}, { bob: -1 }, { bob: -2 }], opt(960)));
  savePng(araw('hurtHighAlt_v01.png'), strip([{}, { bob: -2 }, { bob: -1 }], opt(961))); // no strike: frame count only
  savePng(araw('airLight1Alt_v01.png'), strip([{}, { punch: 16 }, { punch: 16 }, { punch: 8 }, {}], opt(962))); // no base drawn
  const manPath = path.join(ART, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  // light2Alt, heavyAlt, hurtHighAlt and airLight1Alt have no manifest entry: the guide gives frames, phases and altOf
  man.characters.alty = { name: 'Alty', scaleGate: 'warn', animations: {
    idle: { frames: 8, loop: true, bodyHeight: 204 },
    light1: { frames: 7, phases: [2, 2, 3], bodyHeight: 190 },
    light1Alt: { altOf: 'light1', status: 'todo' },
    light3Alt: { frames: 7, phases: [2, 2, 3], bodyHeight: 215, altOf: 'light3', status: 'todo' },
    airHeavyAlt: { frames: 6, phases: [2, 2, 2], altOf: 'airHeavy', status: 'todo', version: 0, approvedVersion: null },
  } };
  fs.writeFileSync(manPath, JSON.stringify(man, null, 2));

  const r = pack([...base, 'alty']);
  const C = r.json?.characters.find((c) => c.id === 'alty');
  const metaFile = path.join(OUT, 'characters', 'alty', 'anims.json');
  if (r.code !== 0 || !fs.existsSync(metaFile)) { check(false, `attack alts: alty packed, exit 0 (${r.code}; ${(C?.warnings || []).join(' | ').slice(0, 400)})`); return; }
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  const sheet = loadPng(path.join(OUT, 'characters', 'alty', 'sheet.png'));
  const W = C.warnings, A = C.alts || {};
  const about = (name) => W.filter((w) => w.startsWith(`${name}:`));
  const alts = ['light1Alt', 'light2Alt', 'light3Alt', 'heavyAlt', 'hurtHighAlt', 'airLight1Alt'];
  check(alts.every((n) => meta.animations[n]?.frames.length), `attack alts: every drawn alt is packed (${alts.filter((n) => !meta.animations[n]).join(', ') || 'all'})`);
  const tallest = Math.max(...(meta.animations.light1Alt?.frames || []).map((f) => bb(cell(sheet, f))?.h ?? 0));
  check(tallest >= 188 && tallest <= 190 && JSON.stringify(meta.animations.light1Alt?.phases) === '[2,2,3]',
    `attack alts: an alt entry without frames or bodyHeight packs like the fighter's base (light1Alt ${tallest}px, light1 bodyHeight 190)`);
  check(JSON.stringify(meta.animations.light2Alt?.durations) === JSON.stringify(meta.animations.light2?.durations) && JSON.stringify(meta.animations.light2Alt?.phases) === '[2,2,3]',
    'attack alts: an alt with no manifest entry takes its base\'s default timing and the guide\'s phases');
  check(!about('light1Alt').length && A.light1Alt?.base === 'light1' && Math.abs(A.light1Alt.strike.reach - A.light1Alt.baseStrike.reach) <= 12,
    `attack alts: an alt striking like its base is silent (${about('light1Alt').join(' | ')}; ${JSON.stringify(A.light1Alt)})`);
  check(anyWarn(W, /^light2Alt: drawn strike reach \d+px from the pivot, light2's hit \d+px \(-\d+(\.\d)?px, tolerance 24px\) - an alt plays its base's move data and hit boxes/),
    `attack alts: an alt drawn falling short warns with both reaches (a lower strike may warn too) (${about('light2Alt').join(' | ')})`);
  check(anyWarn(W, /^light3Alt: drawn strike height [\d.]+px above the floor, light3's hit [\d.]+px \(\+[\d.]+px, tolerance 24px\) - an alt plays/),
    `attack alts: an alt drawn striking far higher than its base warns with both heights (${about('light3Alt').join(' | ')})`);
  // the base's boxes ship on every alt frame (ADR 0031): same contact whatever the alt draws
  const boxesOf = (name) => meta.animations[name]?.frames.map((f) => JSON.stringify({ hit: meta.boxes[f]?.hit ?? null, hurt: meta.boxes[f]?.hurt ?? null }));
  const same = (alt, b) => JSON.stringify(boxesOf(alt)) === JSON.stringify(boxesOf(b));
  check(same('light2Alt', 'light2') && same('light3Alt', 'light3') && same('hurtHighAlt', 'hurtHigh') && A.light3Alt?.boxes === 'base',
    `attack alts: an alt with its base's frame count ships the base's hit and hurt boxes frame for frame (light3Alt ${JSON.stringify(boxesOf('light3Alt')?.slice(2, 4))} vs light3 ${JSON.stringify(boxesOf('light3')?.slice(2, 4))})`);
  check(!same('heavyAlt', 'heavy') && !A.heavyAlt?.boxes, 'attack alts: an alt with another frame count keeps its own boxes (no frame-for-frame match)');
  check((C.hitBoxes?.light3Alt || []).every((e) => e.rule === 'base light3') && JSON.stringify(C.hitBoxes?.light3Alt?.map((e) => e.hit)) === JSON.stringify(C.hitBoxes?.light3?.map((e) => e.hit)),
    `attack alts: the --json hit box report shows the inherited boxes (${JSON.stringify(C.hitBoxes?.light3Alt)})`);
  check(anyWarn(W, /^heavyAlt: 7 frame\(s\) \(phases 3\/2\/2\), its base heavy has 8 \(phases 3\/2\/3\)/) && !anyWarn(W, /^heavyAlt: strike/),
    `attack alts: an alt with another frame count warns (its strike still matches) (${about('heavyAlt').join(' | ')})`);
  check(!about('hurtHighAlt').length && A.hurtHighAlt?.base === 'hurtHigh' && !A.hurtHighAlt.strike, `attack alts: a hit reaction alt with its base's frame count is silent (${about('hurtHighAlt').join(' | ')})`);
  check(anyWarn(W, /^airLight1Alt: packed without its base airLight1/), 'attack alts: an alt packed without its base warns');
  check(!W.some((w) => /airHeavyAlt/.test(w)) && C.missing.includes('airHeavyAlt') && !C.missingCore.some((n) => /Alt$/.test(n)),
    'attack alts: an alt entry with no art yet is a silent missing optional, never core');
}

// Auto hit boxes against the approved standing pose (TOOL-037). The title-style idles are crouched combat stances, so
// "a fist above the idle head" fired on the hair of every upright strike. builds.json "standingReference" (the approved
// neutral cell) is the upright head the rising-strike rule measures against; without one the idle stays the measure.
// crouchy: idle drawn at 146 px, strikes at 204 px (the idle's top sits 58 px below an upright head).
function standingHitBoxTests(base) {
  const jab = [{}, { punch: 2 }, { punch: 16 }, { punch: 16 }, { punch: 9 }, { punch: 4 }, {}];
  const upper = [{}, { bob: -1 }, { bob: -2 }, { up: 16 }, { up: 18 }, { up: 6 }, { bob: -1 }, {}];
  const opt = (seed) => ({ seed, specks: 0 });
  const cr = (n) => path.join(ART, 'characters', 'crouchy', 'raw', n);
  savePng(cr('idle_v01.png'), strip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), opt(971)));
  savePng(cr('light1_v01.png'), strip(jab, opt(972)));
  savePng(cr('heavy_v01.png'), strip(upper, opt(973)));
  // fronty: an upright idle, and a light2 whose active frames show no striking limb at all (the "front 28%" rule)
  const fr = (n) => path.join(ART, 'characters', 'fronty', 'raw', n);
  savePng(fr('idle_v01.png'), strip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), opt(974)));
  savePng(fr('light2_v01.png'), strip(Array.from({ length: 7 }, () => ({})), opt(975)));
  fs.writeFileSync(path.join(ART, 'characters', 'fronty', 'hitboxes.json'), JSON.stringify({ light2: { 3: { hit: [[180, 80, 40, 30]] } } }));
  const manPath = path.join(ART, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  man.characters.crouchy = { name: 'Crouchy', scaleGate: 'warn', animations: { idle: { frames: 8, loop: true, bodyHeight: 146 } } };
  man.characters.fronty = { name: 'Fronty', scaleGate: 'warn', animations: { idle: { frames: 8, loop: true, bodyHeight: 204 } } };
  fs.writeFileSync(manPath, JSON.stringify(man, null, 2));

  // the approved neutral cell: an upright idle frame at the strikes' size (testy's idle is 204 px tall, packed in run 1)
  const tm = JSON.parse(fs.readFileSync(path.join(OUT, 'characters', 'testy', 'anims.json'), 'utf8'));
  const standing = cell(loadPng(path.join(OUT, 'characters', 'testy', 'sheet.png')), tm.animations.idle.frames[2]);
  const standTop = bb(standing).y0;
  savePng(path.join(ART, 'characters', 'crouchy', 'reference', 'standing_v01.png'), standing);
  const buildsPath = path.join(ART, 'scale', 'builds.json');
  const buildsBefore = fs.existsSync(buildsPath) ? fs.readFileSync(buildsPath, 'utf8') : null;
  const withStanding = (cells) => {
    const b = buildsBefore ? JSON.parse(buildsBefore) : { fighters: {} };
    b.fighters = { ...b.fighters, crouchy: cells ? { standingReference: { cells } } : {} };
    fs.mkdirSync(path.dirname(buildsPath), { recursive: true });
    fs.writeFileSync(buildsPath, JSON.stringify(b));
  };
  const packBoxes = (id) => {
    const r = pack([...base, id]);
    const C = r.json?.characters.find((c) => c.id === id);
    const metaFile = path.join(OUT, 'characters', id, 'anims.json');
    if (r.code !== 0 || !C || !fs.existsSync(metaFile)) { check(false, `hit boxes: ${id} packed, exit 0 (${r.code}; ${(C?.warnings || []).join(' | ').slice(0, 300)})`); return null; }
    return { C, meta: JSON.parse(fs.readFileSync(metaFile, 'utf8')), sheet: loadPng(path.join(OUT, 'characters', id, 'sheet.png')) };
  };
  const rules = (C, anim) => (C.hitBoxes[anim] || []).map((f) => f.rule).join('/');
  const hitOf = (R, anim, k) => R.C.hitBoxes[anim]?.[k]?.hit?.[0];

  // without a standing reference the idle is the measure: the upright jab's hair reads as a rising strike (the old behaviour)
  withStanding(null);
  const old = packBoxes('crouchy');
  if (old) {
    const fist = bb(cell(old.sheet, old.meta.animations.light1.frames[2])).x1;
    const h = hitOf(old, 'light1', 0);
    check(rules(old.C, 'light1') === 'up/up' && h && h[0] + h[2] < fist - 20 && !old.C.hitRef,
      `hit boxes: no standingReference -> measured against the crouched idle, the hair is the strike (${rules(old.C, 'light1')} ${JSON.stringify(h)}, fist x ${fist})`);
  }

  // with the approved neutral cell the jab is the fist, and an uppercut that clears the standing head still rises
  withStanding(['characters/crouchy/reference/standing_v01.png']);
  const fix = packBoxes('crouchy');
  if (fix) {
    const sheetOf = (a, k) => bb(cell(fix.sheet, fix.meta.animations[a].frames[k]));
    const h = hitOf(fix, 'light1', 0), fist = sheetOf('light1', 2).x1;
    check(rules(fix.C, 'light1') === 'forward/forward' && h && h[0] + h[2] >= fist && h[3] < v2px(30),
      `hit boxes: standingReference -> the upright jab is boxed on its fist, not the hair (${rules(fix.C, 'light1')} ${JSON.stringify(h)}, fist x ${fist})`);
    check(fix.C.hitRef?.minY === standTop && fix.C.hitRef.idleMinY > standTop + 40 && /standing_v01\.png$/.test(fix.C.hitRef.source),
      `hit boxes: the report records the reference top ${standTop} against the idle's ${fix.C.hitRef?.idleMinY} (${JSON.stringify(fix.C.hitRef)})`);
    const up = hitOf(fix, 'heavy', 0), top = sheetOf('heavy', 3).y0;
    check(rules(fix.C, 'heavy') === 'up/up' && up && up[1] <= top + 2 && up[1] + up[3] >= standTop && up[3] < v2px(40),
      `hit boxes: an uppercut that clears the standing head still gets the rising-strike box (${rules(fix.C, 'heavy')} ${JSON.stringify(up)}, top ${top}, standing head ${standTop})`);
  }

  // a missing reference cell warns and keeps the idle as the measure instead of failing the pack
  withStanding(['characters/crouchy/reference/missing_v01.png']);
  const miss = packBoxes('crouchy');
  if (miss) {
    check(anyWarn(miss.C.warnings, /standingReference: characters\/crouchy\/reference\/missing_v01\.png does not exist.*measured against the idle/) && rules(miss.C, 'light1') === 'up/up',
      `hit boxes: a missing standingReference cell warns and falls back to the idle (${miss.C.warnings.filter((w) => /standingReference/.test(w)).join(' | ')})`);
  }
  if (buildsBefore == null) fs.rmSync(buildsPath, { force: true });
  else fs.writeFileSync(buildsPath, buildsBefore);

  // the "no clear strike limb" note counts only the frames still on the auto box: light2 f3 is overridden by hitboxes.json
  const fro = packBoxes('fronty');
  if (fro) {
    const note = fro.C.notes.find((n) => /no clear strike limb/.test(n)) || '';
    check(/^1 active frame\(s\) had no clear strike limb/.test(note) && /light2#2\b/.test(note) && !/light2#3\b/.test(note) && rules(fro.C, 'light2') === 'front/override',
      `hit boxes: the no-strike-limb note skips frames hitboxes.json overrides (${note}; rules ${rules(fro.C, 'light2')})`);
  }
}

// sidecar "erase": a residue the stray cleanup keeps (close to the body) is cleared from the raw before packing
function sidecarEraseTests(base) {
  const eraw = (n) => path.join(ART, 'characters', 'erasy', 'raw', n);
  const img = strip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), { seed: 991, specks: 0 });
  const foot = (30 + 2 * 46) * S, floor = 90 * S; // pose 2 (strip(): x = 30 + k * 46 art px, floor 10 art px above the bottom)
  const rand = mulberry(992);
  rect(img, foot + 14 * S, floor - 6 * S, 4 * S, 7 * S, COL.outline, rand); // an old toe tip 8 art px right of the shoe
  rect(img, foot + 15 * S, floor - 5 * S, 2 * S, 5 * S, [250, 250, 250], rand);
  savePng(eraw('idle_v01.png'), img);
  const manPath = path.join(ART, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  man.characters.erasy = { name: 'Erasy', scaleGate: 'warn', animations: { idle: { frames: 8, loop: true, bodyHeight: 204 } } };
  fs.writeFileSync(manPath, JSON.stringify(man, null, 2));
  const packIdle = () => {
    const r = pack([...base, 'erasy']);
    const C = r.json?.characters.find((c) => c.id === 'erasy');
    const metaFile = path.join(OUT, 'characters', 'erasy', 'anims.json');
    if (r.code !== 0 || !C || !fs.existsSync(metaFile)) { check(false, `erase: erasy packed, exit 0 (${r.code})`); return null; }
    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    const sheet = loadPng(path.join(OUT, 'characters', 'erasy', 'sheet.png'));
    return { C, notes: C.packed.find((p) => p.anim === 'idle')?.notes || [], w: (k) => bb(cell(sheet, meta.animations.idle.frames[k])).w };
  };
  const kept = packIdle();
  if (kept) check(kept.w(2) > kept.w(3) + v2px(4), `erase: without a sidecar the residue next to the shoe stays in frame 2 (width ${kept.w(2)} vs ${kept.w(3)})`);
  fs.writeFileSync(eraw('idle_v01.json'), JSON.stringify({ erase: [[foot + 13 * S, floor - 7 * S, 6 * S, 8 * S], [1, 2, 3]] }));
  const gone = packIdle();
  if (gone) {
    check(Math.abs(gone.w(2) - gone.w(3)) <= 2 && gone.notes.some((n) => /erased 1 rect\(s\) of idle_v01\.png \(sidecar\)/.test(n)),
      `erase: the sidecar rect clears it and the report says so (width ${gone.w(2)} vs ${gone.w(3)}; ${gone.notes.filter((n) => /erase/.test(n)).join(' | ')})`);
    check(anyWarn(gone.C.warnings, /sidecar "erase" \[1,2,3\] ignored/), `erase: a malformed rect warns and is skipped (${gone.C.warnings.filter((w) => /erase/.test(w)).join(' | ')})`);
  }
}

// TOOL-040: a new idle candidate (the newest raw) must not become the scale gate's reference while an approved idle exists
function approvedIdleRefTests(base) {
  const iraw = (n) => path.join(ART, 'characters', 'idley', 'raw', n);
  const bobs = [0, 0, 1, 1, 1, 0, 0, 1];
  savePng(iraw('idle_v01.png'), scaleStrip(bobs.map((bob) => ({ bob })), 1001)); // approved
  savePng(iraw('idle_v02.png'), scaleStrip(bobs.map((bob) => ({ bob, thinHair: true })), 1002)); // candidate: narrower hair
  savePng(iraw('light1_v01.png'), scaleStrip(Array.from({ length: 7 }, () => ({})), 1003));
  const manPath = path.join(ART, 'manifest.json');
  const setApproved = (v) => {
    const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
    man.characters.idley = { name: 'Idley', scaleGate: 'warn', animations: {
      idle: { frames: 8, loop: true, bodyHeight: 204, approvedVersion: v },
      light1: { frames: 7, phases: [2, 2, 3], bodyHeight: 204, approvedVersion: 1 } } };
    fs.writeFileSync(manPath, JSON.stringify(man, null, 2));
  };
  const run = () => pack([...base, 'idley']).json?.characters.find((c) => c.id === 'idley');
  setApproved(1);
  const c1 = run();
  const s1 = c1?.scale?.anims;
  check(s1 && Math.abs(s1.light1.head - 1) < 0.05 && s1.light1.verdict === 'ok' && s1.idle.verdict === 'drift',
    `approved idle ref: with candidate idle v02 packed, light1 is measured against approved v01 (${s1?.light1?.head} ${s1?.light1?.verdict}) and the candidate idle is gated (${s1?.idle?.verdict})`);
  check((c1?.notes || []).some((n) => /measured against the approved idle v01, not the packed candidate v02/.test(n)), 'approved idle ref: the report says which idle the strips were measured against');
  // control: once v02 is the approved idle it is the reference again, and light1's normal hair reads big against it
  setApproved(2);
  const s2 = run()?.scale?.anims;
  check(s2?.idle?.verdict === 'ref' && s2.light1.head > 1.1, `approved idle ref: an approved v02 is the reference again (idle ${s2?.idle?.verdict}, light1 ${s2?.light1?.head})`);
}

// sidecar "flipX": a pose drawn facing the other way is mirrored frame by frame, frame order kept
function sidecarFlipTests(base) {
  const fraw = (n) => path.join(ART, 'characters', 'flippy', 'raw', n);
  savePng(fraw('idle_v01.png'), strip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), { seed: 1101, specks: 0 }));
  savePng(fraw('light1_v01.png'), strip([{}, { punch: 2 }, { punch: 16 }, { punch: 16 }, { punch: 9 }, { punch: 4 }, {}], { seed: 1102, specks: 0 }));
  const manPath = path.join(ART, 'manifest.json');
  const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  man.characters.flippy = { name: 'Flippy', scaleGate: 'warn', animations: { idle: { frames: 8, loop: true, bodyHeight: 204 }, light1: { frames: 7, phases: [2, 2, 3], bodyHeight: 204 } } };
  fs.writeFileSync(manPath, JSON.stringify(man, null, 2));
  const reach = () => {
    const r = pack([...base, 'flippy']);
    const C = r.json?.characters.find((c) => c.id === 'flippy');
    const meta = JSON.parse(fs.readFileSync(path.join(OUT, 'characters', 'flippy', 'anims.json'), 'utf8'));
    const sheet = loadPng(path.join(OUT, 'characters', 'flippy', 'sheet.png'));
    const px = meta.pivot[0];
    // how far the pose reaches right and left of the pivot, per frame
    return { C, f: meta.animations.light1.frames.map((i) => { const b = bb(cell(sheet, i)); return { right: b.x1 - px, left: px - b.x0 }; }) };
  };
  const a = reach();
  check(a.f[2].right > a.f[2].left + 20, `flipX: without it the jab reaches right of the pivot (right ${a.f[2].right}, left ${a.f[2].left})`);
  fs.writeFileSync(fraw('light1_v01.json'), JSON.stringify({ flipX: true }));
  const b = reach();
  const notes = b.C?.packed.find((p) => p.anim === 'light1')?.notes || [];
  check(b.f[2].left > b.f[2].right + 20 && notes.some((n) => /mirrored left-right \(sidecar flipX\)/.test(n)), `flipX: the jab now reaches left and the report says so (right ${b.f[2].right}, left ${b.f[2].left})`);
  check(b.f[2].left > b.f[1].left + 10 && b.f[5].left < b.f[3].left, 'flipX: frame order is kept (the fist extends on f2-f3 and comes back on f5)');
}

// manifest characters.<id>.packScale (ADR 0041): the whole fighter resized against the cast without new drawings
function packScaleTests(base) {
  const sraw = (n) => path.join(ART, 'characters', 'sizey', 'raw', n);
  savePng(sraw('idle_v01.png'), strip([0, 0, 1, 1, 1, 0, 0, 1].map((bob) => ({ bob })), { seed: 1201, specks: 0 }));
  savePng(sraw('light1_v01.png'), strip([{}, { punch: 2 }, { punch: 16 }, { punch: 16 }, { punch: 9 }, { punch: 4 }, {}], { seed: 1202, specks: 0 }));
  fs.writeFileSync(sraw('light1_v01.json'), JSON.stringify({ frameOffsets: [[0, 0], [0, 0], [-20, 0], [-20, 0], [0, 0], [0, 0], [0, 0]] }));
  fs.writeFileSync(path.join(ART, 'characters', 'sizey', 'hitboxes.json'), JSON.stringify({ light1: { 2: { hand: [228, 140] } } }));
  const manPath = path.join(ART, 'manifest.json');
  const setScale = (packScale) => {
    const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
    man.characters.sizey = { name: 'Sizey', scaleGate: 'warn', ...(packScale !== undefined ? { packScale } : {}),
      animations: { idle: { frames: 8, loop: true, bodyHeight: 204 }, light1: { frames: 7, phases: [2, 2, 3], bodyHeight: 204 } } };
    fs.writeFileSync(manPath, JSON.stringify(man, null, 2));
  };
  const run = () => {
    const r = pack([...base, 'sizey']);
    const C = r.json?.characters.find((c) => c.id === 'sizey');
    const meta = JSON.parse(fs.readFileSync(path.join(OUT, 'characters', 'sizey', 'anims.json'), 'utf8'));
    const sheet = loadPng(path.join(OUT, 'characters', 'sizey', 'sheet.png'));
    const box = (anim, k) => bb(cell(sheet, meta.animations[anim].frames[k]));
    return { r, C, meta, box, hand: meta.boxes?.[meta.animations.light1.frames[2]]?.hand };
  };
  setScale(undefined);
  const a = run();
  setScale(0.9);
  const b = run();
  const ha = a.box('idle', 0).h, hb = b.box('idle', 0).h;
  check(Math.abs(hb / ha - 0.9) < 0.02, `packScale: the idle packs at x0.9 (${ha} -> ${hb} px tall)`);
  const la = a.box('light1', 0).h, lb = b.box('light1', 0).h;
  check(Math.abs(lb / la - 0.9) < 0.02, `packScale: every strip follows, not just the idle (light1 ${la} -> ${lb} px)`);
  check(b.box('idle', 0).y1 === a.box('idle', 0).y1, `packScale: the feet stay on the floor line (y1 ${a.box('idle', 0).y1} vs ${b.box('idle', 0).y1})`);
  // frameOffsets shift by the same share of the size: -20 px at x1 is -18 px at x0.9 (frame 2 vs frame 1's resting x)
  const shift = (s) => s.box('light1', 2).x0 - s.box('light1', 1).x0;
  check(Math.abs(shift(b) - shift(a) * 0.9) <= 3, `packScale: frameOffsets scale with the fighter (frame 2 shift ${shift(a)} -> ${shift(b)} px)`);
  check(Array.isArray(b.hand) && b.hand[0] === Math.round(128 + 100 * 0.9) && b.hand[1] === Math.round(240 - 100 * 0.9),
    `packScale: a hitboxes.json hand anchor is scaled about the pivot ([228,140] -> ${JSON.stringify(b.hand)})`);
  check((b.C?.notes || []).some((n) => /packScale x0\.9/.test(n)), 'packScale: the report says the fighter was resized');
  setScale(3);
  const c = run();
  check(c.r.code === 0 && Math.abs(c.box('idle', 0).h - ha) <= 1 && /packScale is 3 - must be a number 0\.5-1\.5/.test(c.r.out + JSON.stringify(c.r.json ?? {})),
    `packScale: an out-of-range value is reported and ignored (idle ${c.box('idle', 0).h} px)`);
}

function finish() {
  if (!KEEP) fs.rmSync(FIX, { recursive: true, force: true });
  else console.log(`  fixtures kept in ${FIX}`);
  console.log(`${failures ? 'FAILED' : 'OK'}: ${passes} passed, ${failures} failed`);
  process.exitCode = failures ? 1 : 0;
}

main();
