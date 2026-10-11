// Review-only revision: retain Sasuke, correct Naruto's build, restore cast height separation.
// A larger review canvas avoids the production cell cap; no gameplay assets are written.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { readPng, encodePng, newImage, crop, blit, bbox, removeBackground, removeSpecks, resample, placeCharFrame, quantizeFrames } from '../../tools/pack-sprites.mjs';

const out = 'public/art-review/cast-proportion-pilot';
const ids = ['naruto', 'sasuke', 'killua', 'gojo'];
const poses = ['idle', 'guard', 'run', 'light1'];
// These are occupied idle crown-to-floor targets, NOT measured upright skeleton heights.
// Keep Sasuke's exact source/factor. Naruto uses the old body's factor, so editing his head
// cannot inadvertently shrink his whole body. Height-only corrections uniformly scale all poses.
const config = {
  naruto: { sourceVersion: 2, factor: 200 / 446, intent: 'Lean build closer to Sasuke; subtly larger head; original body lengths preserved.' },
  sasuke: { sourceVersion: 1, factor: 200 / 508, intent: 'User preferred reference: source and scale unchanged.' },
  killua: { sourceVersion: 1, factor: 170 / 464, intent: 'Reduce previous pose-height normalization; lighter child stature, same anatomy.' },
  gojo: { sourceVersion: 2, factor: 228 / 557, intent: 'Remove 215px adult cap for review; retain athletic build and all proportions.' },
};
const cell = 320, floor = 304;
const spec = { frameWidth: cell, frameHeight: cell, pivot: [160, floor], cellMargin: 4 };
const board = newImage(cell * 4, cell * 4);
const previous = newImage(cell * 4, cell * 4);
for (const b of [board, previous]) for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) {
  const line = y % cell === floor || x % cell === 0;
  b.data.set(line ? [93, 110, 134, 255] : [24, 29, 42, 255], (y * b.w + x) * 4);
}
const report = { round: 3, date: '2026-10-10', status: 'needs review', cell, floor, method: 'One uniform measured factor per fighter across all four poses; no per-pose fitting. 320px reference canvas removes the production cap. Occupied heights are not upright body measurements. Weight is judged through similar lean teen builds, not inferred kilograms.', fighters: {} };
for (const [col, id] of ids.entries()) {
  const cfg = config[id], tag = 'v' + String(cfg.sourceVersion).padStart(2, '0');
  let source = `art/characters/${id}/reference/proportion_sample_${tag}.png`;
  if (!fs.existsSync(source)) source = source.replace('/reference/', '/reference/_rejected/');
  const raw = readPng(source), side = raw.w / 2;
  if (raw.w !== raw.h || !Number.isInteger(side)) throw Error('Invalid source grid: ' + id);
  const cells = [], measurements = [];
  for (let i = 0; i < 4; i++) {
    const img = crop(raw, (i % 2) * side, Math.floor(i / 2) * side, side, side);
    removeBackground(img, { tol: 72, mode: 'char' }); removeSpecks(img);
    const bounds = bbox(img), scaled = resample(crop(img, bounds.x0, bounds.y0, bounds.w, bounds.h), cfg.factor);
    const placed = i === 2 ? { cell: newImage(cell, cell), margin: [], lost: 0 } : placeCharFrame(scaled, spec);
    if (i === 2) placed.lost = blit(placed.cell, scaled, Math.round((cell - scaled.w) / 2), floor - 7 - scaled.h);
    if (placed.lost || placed.margin.length) throw Error(id + '/' + poses[i] + ': clipping/margin');
    cells.push(placed.cell); measurements.push({ pose: poses[i], sourceBounds: bounds, bounds: bbox(placed.cell), clipped: placed.lost });
  }
  const palette = quantizeFrames(cells, 48);
  const sheet = newImage(cell * 4, cell), before = newImage(cell * 4, cell);
  const oldTag = id === 'gojo' ? 'v02' : 'v01';
  const old = readPng(`${out}/${id}-samples_${oldTag}.png`);
  for (let row = 0; row < 4; row++) {
    blit(sheet, cells[row], row * cell, 0); blit(board, cells[row], col * cell, row * cell);
    const prev = crop(old, row * 256, 0, 256, 256);
    blit(before, prev, row * cell + 32, 64); blit(previous, prev, col * cell + 32, row * cell + 64);
  }
  for (const [name, img] of [[`${id}-round_v03.png`, sheet], [`${id}-previous_v03.png`, before]]) {
    const dest = `${out}/${name}`; if (fs.existsSync(dest)) throw Error('Refusing to overwrite ' + dest);
    fs.writeFileSync(dest, encodePng(img));
  }
  report.fighters[id] = { ...cfg, source, sha256: crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'), palette, measurements };
}
for (const [name, img] of [['lineup_v03.png', board], ['comparison_v03.png', previous]]) {
  const dest = `${out}/${name}`; if (fs.existsSync(dest)) throw Error('Refusing to overwrite ' + dest);
  fs.writeFileSync(dest, encodePng(img));
}
fs.writeFileSync(`${out}/qa_v03.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(Object.fromEntries(ids.map(id => [id, { factor: config[id].factor, palette: report.fighters[id].palette, bounds: report.fighters[id].measurements.map(m => ({ pose: m.pose, w: m.bounds.w, h: m.bounds.h, clipped: m.clipped })) }])), null, 2));
