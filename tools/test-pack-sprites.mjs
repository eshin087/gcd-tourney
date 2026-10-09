#!/usr/bin/env node
// Regression test for tools/pack-sprites.mjs.
//   npm run test:sprites            (add -- --keep to keep tools/.test-fixtures/ for inspection)
// Generates fake ChatGPT-style strips (magenta background, 6x "art pixels", noise, magenta fringe,
// specks, touching poses, a 2-row grid, single-frame files, human-cleaned frames, UI, VFX), runs the
// packer into a scratch output folder and checks the result. Never touches art/ or public/.

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
  // light3: human-cleaned frames (192x192 transparent, drawn at 2x art scale -> ~152px tall, rescaled to 142)
  [{}, { kick: 4 }, { kick: 16 }, { kick: 16 }, { kick: 8 }, { kick: 3 }, {}].forEach((p, k) => {
    const rand = mulberry(200 + k);
    const img = image(192, 192, null, rand);
    const s2 = 2;
    const rects = figure(p);
    for (const [x0, x1, y0, y1] of rects) rect(img, 80 + (x0 - 1) * s2, 186 - (y1 + 1) * s2, (x1 - x0 + 2) * s2, (y1 - y0 + 2) * s2, COL.outline, rand, 0);
    for (const [x0, x1, y0, y1, c] of rects) rect(img, 80 + x0 * s2, 186 - y1 * s2, (x1 - x0) * s2, (y1 - y0) * s2, c, rand, 0);
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
  for (const n of ['ui_portrait.png', 'fx_chidoriBall.png', 'light1_fix01.png', path.join('_proposed', 'cloneAssist.png')]) savePng(raw(n), strip([{}], { seed: 21 }));
  fs.writeFileSync(path.join(T, 'hitboxes.json'), JSON.stringify({
    _comment: 'test overrides',
    light1: { 3: { hit: [[120, 60, 30, 20]] } },
    idle: { 9: { hit: [[1, 1, 1, 1]] } },
  }, null, 2));
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
    const img = image(5 * 60 * s4, 70 * s4, [255, 0, 255], rand);
    for (let k = 0; k < 5; k++) {
      const r = 8 + k * 5, cx = (30 + k * 60) * s4, cy = 35 * s4;
      rect(img, cx - r * s4, cy - r * s4, 2 * r * s4, 3 * s4, [250, 250, 250], rand);
      rect(img, cx - r * s4, cy + (r - 3) * s4, 2 * r * s4, 3 * s4, [250, 250, 250], rand);
      rect(img, cx - r * s4, cy - r * s4, 3 * s4, 2 * r * s4, [250, 250, 250], rand);
      rect(img, cx + (r - 3) * s4, cy - r * s4, 3 * s4, 2 * r * s4, [250, 250, 250], rand);
    }
    savePng(path.join(V, 'raw', 'spark.png'), img);
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

  fs.writeFileSync(path.join(ART, 'manifest.json'), JSON.stringify({
    version: 1,
    spec: { frameWidth: 192, frameHeight: 192, columns: 16, pivot: [96, 180], pixelsPerUnit: 86, facing: 'right' },
    coreAnimations: ['idle', 'run'],
    animationDefaults: { idle: { frames: 8, loop: true, bodyHeight: 135, ms: [150, 150, 150, 150, 150, 150, 150, 150], required: true, status: 'todo' } },
    characters: {
      testy: { name: 'Testy', animations: { idle: { frames: 8, loop: true, bodyHeight: 135, status: 'todo' }, light1: { frames: 7, phases: [2, 2, 3], bodyHeight: 135, status: 'approved' }, land: { frames: 2, status: 'todo' } }, ui: { portrait: { status: 'todo' } } },
    },
    vfx: { cell: 128, ppu: 56, baseline: 120, effects: { spark: { frames: 5, ms: 30, colorRule: 'tinted', anchor: 'center', status: 'todo' }, flame: { frames: 7, ms: 55, colorRule: 'tinted', anchor: 'bottom', status: 'todo' } } },
  }, null, 2));
}

// ---------------------------------------------------------------- run + verify helpers
function pack(args) {
  const r = spawnSync(process.execPath, [PACKER, ...args], { encoding: 'utf8' });
  let json = null;
  if (args.includes('--json')) { try { json = JSON.parse(r.stdout); } catch { /* reported below */ } }
  return { code: r.status, out: r.stdout, err: r.stderr, json };
}
function cell(sheet, idx, fw = 192, cols = 16) {
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
  check(sheet.w === 16 * 192 && sheet.h === Math.ceil(total / 16) * 192, `sheet ${sheet.w}x${sheet.h} for ${total} frames`);
  check(meta.frameWidth === 192 && meta.frameHeight === 192 && meta.columns === 16 && meta.pivot[0] === 96 && meta.pivot[1] === 180 && meta.pixelsPerUnit === 86 && meta.facing === 'right' && meta.source === 'art-pack', 'anims.json header matches SPEC v1');
  check(meta.complete === false && meta.missingCore.includes('special'), 'complete=false while core anims are missing');

  const expectCounts = { idle: 8, run: 8, light1: 7, light2: 7, light3: 7, heavy: 8, down: 2, guard: 3, jumpSquat: 1 };
  for (const [a, n] of Object.entries(expectCounts)) check(meta.animations[a]?.frames.length === n, `${a}: ${n} frames (got ${meta.animations[a]?.frames.length})`);
  check(!meta.animations.land, 'corrupt land.png skipped');
  check(JSON.stringify(meta.animations.idle.durations) === JSON.stringify([150, 150, 150, 150, 150, 150, 150, 150]) && meta.animations.idle.loop === true, 'idle durations/loop from manifest');
  check(JSON.stringify(meta.animations.light1.phases) === '[2,2,3]' && JSON.stringify(meta.animations.heavy.phases) === '[3,2,3]', 'attack phases');

  const BH = { idle: 135, run: 135, light1: 135, light2: 135, light3: 142, heavy: 144, down: 68, guard: 131, jumpSquat: 107 };
  let pivotOk = true, footOk = true;
  for (const [a, info] of Object.entries(meta.animations)) {
    let maxH = 0;
    for (const f of info.frames) {
      const c = cell(sheet, f);
      const b = bb(c);
      if (!b) { pivotOk = false; continue; }
      maxH = Math.max(maxH, b.h);
      if (b.y1 !== 180) { pivotOk = false; console.log(`    ${a} frame ${f}: lowest row ${b.y1}`); }
      const fx = footX(c, b);
      if (Math.abs(fx - 96) > 0.51) { footOk = false; console.log(`    ${a} frame ${f}: foot center ${fx.toFixed(2)}`); }
    }
    if (BH[a]) check(maxH >= BH[a] - 2 && maxH <= BH[a], `${a}: tallest frame ${maxH}px ~ bodyHeight ${BH[a]}`);
  }
  check(pivotOk, 'every frame: lowest opaque pixel on y=180');
  check(footOk, 'every frame: feet center on x=96 (+-0.5)');

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
    check(hit[0] >= idleMaxX - 8 && hit[0] + hit[2] >= b.x1 && hit[2] >= 20 && hit[2] < 60 && hit[3] < 30, `light1 #2 hitbox ${JSON.stringify(hit)} covers forearm + fist + smear (idle maxX ${idleMaxX}, frame maxX ${b.x1})`);
    check(JSON.stringify(meta.boxes[meta.animations.light1.frames[3]].hit) === '[[120,60,30,20]]', 'hitboxes.json override applied to light1 #3');
    const hurt = meta.boxes[f].hurt[0];
    check(!overlap(hurt, [b.x1 - 2, hit[1], 2, hit[3]]) || hurt[0] + hurt[2] < b.x1, 'light1 #2 hurtbox does not reach the fist tip');
  }
  for (const k of [3, 4]) {
    const hit = meta.boxes[meta.animations.heavy.frames[k]].hit[0];
    check(hit[1] < idleMinY - 4 && hit[3] < 40 && hit[1] + hit[3] >= idleMinY, `heavy #${k} (uppercut) hitbox is the raised fist + forearm: ${JSON.stringify(hit)} vs idle top ${idleMinY}`);
  }
  for (const k of [2, 3]) {
    const f = meta.animations.light3.frames[k];
    const hit = meta.boxes[f].hit[0];
    check(hit[1] > 120 && hit[3] < 30 && hit[0] >= idleMaxX - 8, `light3 #${k} (kick) hitbox is the leg at kick height, not the guard fist ${JSON.stringify(hit)}`);
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
  check(!anyWarn(W, /ui_portrait|fx_chidoriBall|light1_fix01|cloneAssist/), 'ui_*, fx_*, <anim>_fixNN and raw/ subfolders skipped silently');
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
    check(n('idle') === 8 && Math.max(...hs) - Math.min(...hs) <= 1 && Math.max(...hs) >= 133, `edgy idle: specks above/below a pose do not change the anim's size (${hs.join(',')})`);
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
  check(t4.packed.find((p) => p.anim === 'idle').source === 'frames/idle/', 'run 4: edited frames used');
  check(anyWarn(t4.warnings, /idle: raw\/ or bodyHeight changed but frames\/idle\/ has manual edits/), 'run 4: manual-edit warning');
  check(Buffer.compare(edited, fs.readFileSync(path.join(idleDir, 'idle_00.png'))) === 0, 'run 4: edited frame preserved');
  const idle4 = t4.packed.find((p) => p.anim === 'idle');
  check(idle4.scale === 1 && idle4.notes.some((n) => /stray pixel/.test(n)), `run 4: stray pixel ignored, idle not rescaled (x${idle4.scale})`);
  // the idle now keeps its fists close to the body (run 3 art): hitboxes must still isolate the limb
  const meta4 = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const sheet4 = loadPng(path.join(OUT, 'characters', 'testy', 'sheet.png'));
  const minY4 = Math.min(...meta4.animations.idle.frames.map((f) => bb(cell(sheet4, f)).y0));
  for (const [a, k] of [['light1', 2], ['light3', 2], ['light3', 3]]) {
    const hit = meta4.boxes[meta4.animations[a].frames[k]].hit[0];
    check(hit[3] < 30, `run 4 (tight idle stance): ${a} #${k} hitbox is just the limb ${JSON.stringify(hit)}`);
  }
  for (const k of [3, 4]) {
    const hit = meta4.boxes[meta4.animations.heavy.frames[k]].hit[0];
    check(hit[1] < minY4 && hit[3] < 40 && hit[1] + hit[3] >= minY4, `run 4 (tight idle stance): heavy #${k} hitbox is the raised fist + forearm ${JSON.stringify(hit)}`);
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
  check(r9.code === 2 && /== testy/.test(r9.out) && /missing core/.test(r9.out), 'run 9: text report, --strict exits 2 on warnings');

  return finish();
}

function finish() {
  if (!KEEP) fs.rmSync(FIX, { recursive: true, force: true });
  else console.log(`  fixtures kept in ${FIX}`);
  console.log(`${failures ? 'FAILED' : 'OK'}: ${passes} passed, ${failures} failed`);
  process.exitCode = failures ? 1 : 0;
}

main();
