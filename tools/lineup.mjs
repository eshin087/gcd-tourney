#!/usr/bin/env node
// Cast lineup (TOOL-023, art/CHARACTER_SCALE.md): every fighter's packed frames side by side on one floor line, at
// the same pixel density the game uses, with each one's standing height and shoulder width. A new character's
// model sheet and idle reviews attach this lineup, so a fighter who reads too small, too thin or too big next to
// the cast is caught before approval (Gojo shipped narrower than 12-year-old Killua).
//
//   npm run lineup                         all fighters in public/characters/, rows idle, run, heavy
//   npm run lineup -- naruto gojo          only these fighters
//   npm run lineup -- --anims idle,charge  other rows (first frame of each)
//   npm run lineup -- --out <file.png>     default art/scale/lineup.png (+ lineup.json next to it)
//
// The numbers are proxies (opaque pixels, not anatomy): height = soles to the top of the hair, shoulder = the
// widest row 15-30% below the top of the idle pose. art/scale/builds.json declares each fighter's build class;
// a shoulder/height ratio outside that class's band is flagged for a visual check. Read-only on art/ and public/
// except the output files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : dflt;
};
const OUT = path.resolve(ROOT, opt('--out', 'art/scale/lineup.png'));
const ANIMS = opt('--anims', 'idle,run,heavy').split(',').filter(Boolean);
const charDir = path.join(ROOT, 'public', 'characters');
const all = fs.readdirSync(charDir).filter((id) => fs.existsSync(path.join(charDir, id, 'anims.json')) && fs.existsSync(path.join(charDir, id, 'sheet.png')));
const IDS = args.length ? args : all;
for (const id of IDS) if (!all.includes(id)) { console.error(`[lineup] no packed sheet for "${id}" (public/characters/${id}/)`); process.exit(1); }

const buildsPath = path.join(ROOT, 'art', 'scale', 'builds.json');
const BUILDS = fs.existsSync(buildsPath) ? JSON.parse(fs.readFileSync(buildsPath, 'utf8')) : { bands: {}, fighters: {} };

const sets = Object.fromEntries(IDS.map((id) => [id, {
  meta: JSON.parse(fs.readFileSync(path.join(charDir, id, 'anims.json'), 'utf8')),
  png: PNG.sync.read(fs.readFileSync(path.join(charDir, id, 'sheet.png'))),
}]));

const cellOf = (S, i) => {
  const { frameWidth: W, frameHeight: H, columns } = S.meta;
  return { x0: (i % columns) * W, y0: Math.floor(i / columns) * H, W, H };
};

// opaque bounds of one frame, and the width of each row
function measure(S, i) {
  const c = cellOf(S, i), rowW = new Array(c.H).fill(0);
  let top = -1, bottom = -1;
  for (let y = 0; y < c.H; y++) {
    let lo = -1, hi = -1;
    for (let x = 0; x < c.W; x++) {
      if (S.png.data[((c.y0 + y) * S.png.width + c.x0 + x) * 4 + 3] > 0) {
        if (lo < 0) lo = x;
        hi = x;
      }
    }
    if (lo >= 0) {
      rowW[y] = hi - lo + 1;
      if (top < 0) top = y;
      bottom = y;
    }
  }
  const height = top < 0 ? 0 : bottom - top + 1;
  let shoulder = 0;
  for (let y = Math.round(top + height * 0.15); y <= Math.round(top + height * 0.3); y++) shoulder = Math.max(shoulder, rowW[y] || 0);
  return { height, shoulder, bottom };
}
const median = (v) => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];

const report = {};
let flagged = 0;
console.log('fighter   standing px  shoulder px  ratio   build       band');
for (const id of IDS) {
  const S = sets[id], idle = S.meta.animations.idle;
  if (!idle) { console.log(`${id.padEnd(9)} (no idle animation)`); continue; }
  const ms = idle.frames.map((i) => measure(S, i));
  const height = median(ms.map((m) => m.height)), shoulder = median(ms.map((m) => m.shoulder));
  const ratio = shoulder / Math.max(1, height);
  const decl = BUILDS.fighters?.[id], band = decl && BUILDS.bands?.[decl.build];
  const out = band && (ratio < band[0] || ratio > band[1]);
  if (out) flagged++;
  report[id] = { standingPx: height, shoulderPx: shoulder, ratio: +ratio.toFixed(3), build: decl?.build ?? null, band: band ?? null, outOfBand: !!out };
  console.log(`${id.padEnd(9)} ${String(height).padStart(11)}  ${String(shoulder).padStart(11)}  ${ratio.toFixed(3)}   ${(decl?.build ?? '?').padEnd(10)}  ${band ? `${band[0]}-${band[1]}` : 'undeclared'}${out ? '   <-- outside the band: check the build by eye' : ''}`);
}

// the picture: one row per animation (its first frame), fighters left to right, 2x, floor line + 32 px grid
const SC = 2, CW = 256, pad = 8;
const W = IDS.length * (CW + pad) * SC, H = ANIMS.length * (CW + pad) * SC;
const img = new PNG({ width: W, height: H });
for (let i = 0; i < img.data.length; i += 4) { img.data[i] = 34; img.data[i + 1] = 30; img.data[i + 2] = 48; img.data[i + 3] = 255; }
ANIMS.forEach((a, r) => IDS.forEach((id, k) => {
  const S = sets[id], A = S.meta.animations[a];
  if (!A) return;
  const c = cellOf(S, A.frames[0]);
  const ox = k * (CW + pad) * SC, oy = r * (CW + pad) * SC;
  for (let y = 0; y < CW; y++) for (let x = 0; x < CW; x++) {
    const si = ((c.y0 + y) * S.png.width + c.x0 + x) * 4, al = S.png.data[si + 3];
    for (let dy = 0; dy < SC; dy++) for (let dx = 0; dx < SC; dx++) {
      const di = ((oy + y * SC + dy) * W + ox + x * SC + dx) * 4;
      if (y === (S.meta.pivot?.[1] ?? 240) || (y % 32 === 0 && x % 4 === 0)) { img.data[di] = 90; img.data[di + 1] = 90; img.data[di + 2] = 120; }
      if (al > 0) {
        const f = al / 255;
        for (let ch = 0; ch < 3; ch++) img.data[di + ch] = Math.round(S.png.data[si + ch] * f + img.data[di + ch] * (1 - f));
      }
    }
  }
}));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, PNG.sync.write(img));
fs.writeFileSync(OUT.replace(/\.png$/i, '.json'), JSON.stringify({ rows: ANIMS, fighters: IDS, measured: report }, null, 2) + '\n');
console.log(`[lineup] wrote ${path.relative(ROOT, OUT)} (${W}x${H}; rows ${ANIMS.join(', ')}) and its .json${flagged ? `; ${flagged} fighter(s) outside their build band` : ''}`);
