#!/usr/bin/env node
// Cast lineup (TOOL-023, art/CHARACTER_SCALE.md "Lineup review" and "Build classes"): every fighter's packed frames
// side by side on one floor line, at the same pixel density the game uses, with each one's size and build numbers.
// A new character's model sheet, idle, run and heavy reviews attach this lineup, so a fighter who reads too small,
// too thin or too big next to the cast is caught before approval (Gojo shipped with a 13-year-old's shoulders).
//
//   npm run lineup                               the cast in roster order, rows idle f0, run f3, heavy f3, guard f0,
//                                                charge f0, airLight1 f2, hurtHigh f0 (the poses that drifted in size)
//   npm run lineup -- naruto gojo                only these fighters
//   npm run lineup -- --rows idle:0,charge:2     other rows (animation:frame index)
//   npm run lineup -- --candidate sheet.png --scale 0.5 --name gojo-v05
//                                                add an unpacked figure (a model sheet's 3/4 stance cropped to one
//                                                figure, magenta or transparent background) as the last column,
//                                                downscaled by the sheet's multiplier, soles on the floor line
//   npm run lineup -- --out art/scale/lineup-gojo-idle_v04.png    default art/scale/lineup.png (+ .json)
//
// Numbers (proxies on opaque pixels, see CHARACTER_SCALE.md): SBR = the widest row 15-30 % below the top of the idle
// (median over the loop) / the declared standing skeleton; MWR = the idle's max width / its height with hair. Each
// fighter's class, idle hand style and by-eye deltoid width (DR, the gate measure) come from art/scale/builds.json;
// a number outside its band is flagged for the reviewer. Each fighter's head scale per animation (the scale gate's
// measure, tools/scale-probe.mjs: head silhouette with hair vs the idle) is printed under the table, the off ones
// named. Writes only the output files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { auditPacked } from './scale-audit.mjs';
import { FLAGGED } from './scale-probe.mjs';
import { sheetFiles, frameCell } from '../src/art/sheetPages.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : dflt;
};
const OUT = path.resolve(ROOT, opt('--out', 'art/scale/lineup.png'));
const ROWS = opt('--rows', 'idle:0,run:3,heavy:3,guard:0,charge:0,airLight1:2,hurtHigh:0').split(',').filter(Boolean).map((r) => {
  const [anim, f] = r.split(':');
  return { anim, frame: Number(f ?? 0) };
});
const CAND = opt('--candidate', null);
const CAND_SCALE = Number(opt('--scale', '1'));
const CAND_NAME = opt('--name', CAND ? path.basename(CAND, path.extname(CAND)) : null);

const buildsPath = path.join(ROOT, 'art', 'scale', 'builds.json');
const BUILDS = fs.existsSync(buildsPath) ? JSON.parse(fs.readFileSync(buildsPath, 'utf8')) : { classes: {}, fighters: {} };
const charDir = path.join(ROOT, 'public', 'characters');
const packed = fs.readdirSync(charDir).filter((id) => fs.existsSync(path.join(charDir, id, 'anims.json')) && fs.existsSync(path.join(charDir, id, 'sheet.png')));
// roster order: the fighters builds.json declares, then any other packed ones
const order = [...Object.keys(BUILDS.fighters || {}).filter((id) => packed.includes(id)), ...packed.filter((id) => !BUILDS.fighters?.[id]).sort()];
const IDS = args.length ? args : order;
for (const id of IDS) if (!packed.includes(id)) { console.error(`[lineup] no packed sheet for "${id}" (public/characters/${id}/)`); process.exit(1); }

const readPng = (p) => PNG.sync.read(fs.readFileSync(p));
const sets = Object.fromEntries(IDS.map((id) => {
  const meta = JSON.parse(fs.readFileSync(path.join(charDir, id, 'anims.json'), 'utf8'));
  return [id, { meta, pages: sheetFiles(meta).map((f) => readPng(path.join(charDir, id, f))) }]; // every sheet page
}));

// a 256x256 RGBA cell: a packed frame, or the candidate figure placed on the floor line
function packedCell(S, i) {
  const { frameWidth: W, frameHeight: H } = S.meta;
  const { page, x: x0, y: y0 } = frameCell(S.meta, i), png = S.pages[page], data = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const si = ((y0 + y) * png.width + x0 + x) * 4, di = (y * W + x) * 4;
    for (let c = 0; c < 4; c++) data[di + c] = png.data[si + c];
  }
  return { W, H, data, floor: S.meta.pivot?.[1] ?? 240 };
}
function candidateCell(file, scale) {
  const src = readPng(path.resolve(process.cwd(), file));
  const opaque = (x, y) => {
    const i = (y * src.width + x) * 4, [r, g, b, a] = [src.data[i], src.data[i + 1], src.data[i + 2], src.data[i + 3]];
    return a > 0 && !(r > 230 && g < 40 && b > 230); // flat magenta counts as background
  };
  let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) if (opaque(x, y)) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  if (maxX < 0) { console.error(`[lineup] ${file}: no figure found`); process.exit(1); }
  const W = 256, H = 256, floor = 240, data = new Uint8Array(W * H * 4);
  const w = Math.round((maxX - minX + 1) * scale), h = Math.round((maxY - minY + 1) * scale);
  if (w > W || h > floor) console.warn(`[lineup] candidate is ${w}x${h} px after --scale ${scale}: it will be cut to the cell`);
  const ox = Math.round((W - w) / 2), oy = floor + 1 - h;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = minX + Math.min(maxX - minX, Math.floor(x / scale)), sy = minY + Math.min(maxY - minY, Math.floor(y / scale));
    const dx = ox + x, dy = oy + y;
    if (dx < 0 || dy < 0 || dx >= W || dy >= H || !opaque(sx, sy)) continue;
    const si = (sy * src.width + sx) * 4, di = (dy * W + dx) * 4;
    data[di] = src.data[si]; data[di + 1] = src.data[si + 1]; data[di + 2] = src.data[si + 2]; data[di + 3] = 255;
  }
  return { W, H, data, floor };
}

// height (lowest to highest opaque row), max width, and the shoulder band
function measure(cell) {
  const { W, H, data } = cell, rowW = new Array(H).fill(0);
  let top = -1, bottom = -1, minX = 1e9, maxX = -1;
  for (let y = 0; y < H; y++) {
    let lo = -1, hi = -1;
    for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 0) { if (lo < 0) lo = x; hi = x; }
    if (lo >= 0) {
      rowW[y] = hi - lo + 1;
      minX = Math.min(minX, lo); maxX = Math.max(maxX, hi);
      if (top < 0) top = y;
      bottom = y;
    }
  }
  const height = top < 0 ? 0 : bottom - top + 1;
  let band = 0;
  for (let y = Math.round(top + height * 0.15); y <= Math.round(top + height * 0.3); y++) band = Math.max(band, rowW[y] || 0);
  return { height, width: maxX < 0 ? 0 : maxX - minX + 1, band };
}
const median = (v) => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];
const inBand = (v, b) => !b || (v >= b[0] && v <= b[1]);
const fmt = (b) => (b ? `${b[0]}-${b[1]}` : '-');

const report = {};
let flagged = 0;
const line = (cols) => console.log(cols.map(([s, w]) => String(s).padEnd(w)).join(''));
line([['fighter', 16], ['class / hands', 24], ['standing', 10], ['idle h', 8], ['band', 6], ['SBR', 7], ['band ok', 14], ['MWR', 7], ['DR (by eye)', 18]]);
const check = (name, idleCells, decl) => {
  const ms = idleCells.map(measure);
  const height = median(ms.map((m) => m.height)), band = median(ms.map((m) => m.band)), width = median(ms.map((m) => m.width));
  const cls = decl && BUILDS.classes?.[decl.build];
  const standing = decl?.standingPx ?? height;
  const sbr = band / standing, mwr = width / Math.max(1, height);
  const sbrBand = cls?.sbr?.[decl.idleHands ?? 'guard'];
  const dr = decl?.deltoidPx ? decl.deltoidPx / standing : null;
  const bad = [];
  if (!inBand(sbr, sbrBand)) bad.push('SBR');
  if (cls && mwr < (cls.mwrMin ?? 0)) bad.push('MWR');
  if (dr != null && !inBand(dr, cls?.dr)) bad.push('DR');
  if (bad.length) flagged++;
  report[name] = { standingPx: standing, idleHeightPx: height, bandPx: band, maxWidthPx: width, sbr: +sbr.toFixed(3), mwr: +mwr.toFixed(3), dr: dr == null ? null : +dr.toFixed(3), build: decl?.build ?? null, idleHands: decl?.idleHands ?? null, flags: bad };
  line([[name, 16], [`${decl?.build ?? 'undeclared'} / ${decl?.idleHands ?? '?'}`, 24], [standing, 10], [height, 8], [band, 6], [sbr.toFixed(3), 7], [sbrBand ? `${fmt(sbrBand)}${bad.includes('SBR') ? ' X' : ''}` : '-', 14], [`${mwr.toFixed(2)}${bad.includes('MWR') ? ' X' : ''}`, 7], [dr == null ? '-' : `${dr.toFixed(2)} (${fmt(cls?.dr)})${bad.includes('DR') ? ' X' : ''}`, 18]]);
  if (bad.length) console.log(`  ^ ${name}: ${bad.join(', ')} outside the ${decl.build} bands: check the build by eye (CHARACTER_SCALE.md)`);
};
for (const id of IDS) {
  const S = sets[id], idle = S.meta.animations.idle;
  if (!idle) { console.log(`${id}: no idle animation`); continue; }
  check(id, idle.frames.map((i) => packedCell(S, i)), BUILDS.fighters?.[id]);
}
// head scale per animation (the scale gate), so a pose that reads small or big next to the fighter's own idle shows
const heads = {};
for (const id of IDS) {
  const R = auditPacked(id);
  if (!R || R.A.error) { console.log(`  ${id} heads: ${R?.A.error ?? 'not measured'}`); continue; }
  const rows = Object.entries(R.A.anims).filter(([n]) => n !== 'idle');
  heads[id] = Object.fromEntries(rows.map(([n, s]) => [n, { head: s.head, verdict: s.verdict }]));
  const off = rows.filter(([, s]) => FLAGGED.has(s.verdict));
  console.log(`  ${id} heads vs idle: ${rows.length - off.length}/${rows.length} strips ok or not judged${off.length ? `; off: ${off.map(([n, s]) => `${n} ${s.head?.toFixed(2)} (${s.verdict})`).join(', ')}` : ''}`);
}

let cand = null;
if (CAND) {
  cand = candidateCell(CAND, CAND_SCALE);
  check(CAND_NAME, [cand], BUILDS.fighters?.[CAND_NAME] ?? BUILDS.fighters?.[CAND_NAME.split('-')[0]]);
}

// the picture: one row per entry of --rows, fighters left to right (the candidate last, in the first row), 2x, the
// floor line and a 32 px grid
const cols = IDS.length + (cand ? 1 : 0), SC = 2, CW = 256, pad = 8;
const W = cols * (CW + pad) * SC, H = ROWS.length * (CW + pad) * SC;
const img = new PNG({ width: W, height: H });
for (let i = 0; i < img.data.length; i += 4) { img.data[i] = 34; img.data[i + 1] = 30; img.data[i + 2] = 48; img.data[i + 3] = 255; }
const blit = (cell, col, row) => {
  const ox = col * (CW + pad) * SC, oy = row * (CW + pad) * SC;
  for (let y = 0; y < cell.H; y++) for (let x = 0; x < cell.W; x++) {
    const si = (y * cell.W + x) * 4, al = cell.data[si + 3];
    for (let dy = 0; dy < SC; dy++) for (let dx = 0; dx < SC; dx++) {
      const di = ((oy + y * SC + dy) * W + ox + x * SC + dx) * 4;
      if (y === cell.floor || (y % 32 === 0 && x % 4 === 0)) { img.data[di] = 90; img.data[di + 1] = 90; img.data[di + 2] = 120; }
      if (al > 0) { const f = al / 255; for (let c = 0; c < 3; c++) img.data[di + c] = Math.round(cell.data[si + c] * f + img.data[di + c] * (1 - f)); }
    }
  }
};
ROWS.forEach(({ anim, frame }, r) => IDS.forEach((id, k) => {
  const S = sets[id], A = S.meta.animations[anim];
  if (A) blit(packedCell(S, A.frames[Math.min(frame, A.frames.length - 1)]), k, r);
}));
if (cand) blit(cand, IDS.length, 0);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, PNG.sync.write(img));
fs.writeFileSync(OUT.replace(/\.png$/i, '.json'), JSON.stringify({ rows: ROWS.map((r) => `${r.anim}:${r.frame}`), fighters: IDS, candidate: CAND_NAME, measured: report, heads }, null, 2) + '\n');
console.log(`[lineup] wrote ${path.relative(ROOT, OUT)} (${W}x${H}; rows ${ROWS.map((r) => `${r.anim} f${r.frame}`).join(', ')}) and its .json${flagged ? `; ${flagged} outside their build bands` : ''}`);
