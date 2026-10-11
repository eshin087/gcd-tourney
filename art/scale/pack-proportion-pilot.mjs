// Review-only packing using the production packer's unchanged image helpers.
// One measured idle factor per fighter, reused unchanged for all four key poses.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { readPng, encodePng, newImage, crop, blit, bbox, removeBackground, removeSpecks, resample, placeCharFrame, quantizeFrames } from '../../tools/pack-sprites.mjs';
import { auditCharacter, compactAudit } from '../../tools/scale-probe.mjs';

const out = 'public/art-review/cast-proportion-pilot';
fs.mkdirSync(out, { recursive: true });
const ids = ['naruto', 'sasuke', 'killua', 'gojo'];
const poses = ['idle', 'guard', 'run', 'light1'];
const builds = JSON.parse(fs.readFileSync('art/scale/builds.json', 'utf8'));
const cfg = {
  naruto: { version: 1, target: 200, crown: 116, chin: 181, sole: 562, uncertainty: 8 },
  sasuke: { version: 1, target: 200, crown: 95, chin: 170, sole: 603, uncertainty: 8 },
  killua: { version: 1, target: 182, crown: 124, chin: 197, sole: 588, uncertainty: 12 },
  gojo: { version: 2, target: 215, crown: 50, chin: 119, sole: 607, uncertainty: 10 },
};
const spec = { frameWidth: 256, frameHeight: 256, pivot: [128, 240], cellMargin: 4 };
const lineup = newImage(1024, 1024), before = newImage(1024, 1024);
for (const board of [lineup, before]) for (let i = 0; i < board.data.length; i += 4) board.data.set([24, 29, 42, 255], i);
function grid(board) {
  for (let y = 0; y < 1024; y++) for (let x = 0; x < 1024; x++) if (y % 256 === 240 || x % 256 === 0) board.data.set([93, 110, 134, 255], (y * 1024 + x) * 4);
}
grid(lineup); grid(before);
const report = { date: '2026-10-10', scope: 'Four key poses per fighter; reference samples only, no gameplay animation or approval promotion.', method: 'One factor per fighter: nominal target divided by manually inferred idle crown-to-sole distance. Reused unchanged for all poses; no individual pose height fitting. Hidden crown and bent stance make anatomy estimates provisional.', poses, fighters: {} };
for (const [col, id] of ids.entries()) {
  const c = cfg[id], tag = 'v' + String(c.version).padStart(2, '0');
  const file = `art/characters/${id}/reference/${id === 'naruto' || id === 'gojo' ? '_rejected/' : ''}proportion_sample_${tag}.png`;
  const raw = readPng(file), cellW = raw.w / 2, cellH = raw.h / 2;
  if (!Number.isInteger(cellW) || !Number.isInteger(cellH)) throw new Error('Uneven source grid: ' + id);
  const factor = c.target / (c.sole - c.crown), cells = [], qa = [];
  for (let i = 0; i < 4; i++) {
    const part = crop(raw, i % 2 * cellW, Math.floor(i / 2) * cellH, cellW, cellH);
    const clean = removeBackground(part, { tol: 72, mode: 'char' });
    const specks = removeSpecks(part); const b = bbox(part);
    const scaled = resample(crop(part, b.x0, b.y0, b.w, b.h), factor);
    const placed = i === 2 ? { cell: newImage(256, 256), margin: [], lost: 0 } : placeCharFrame(scaled, spec);
    // A flight key has no planted foot: center the whole pose without changing its scale.
    if (i === 2) placed.lost = blit(placed.cell, scaled, Math.round((256 - scaled.w) / 2), 233 - scaled.h);
    if (placed.lost) throw new Error(id + '/' + poses[i] + ': clipped ' + placed.lost + ' pixels');
    cells.push(placed.cell); qa.push({ pose: poses[i], sourceBounds: b, background: clean, specks, lost: placed.lost, margin: placed.margin, packedBounds: bbox(placed.cell) });
  }
  const audit = auditCharacter(cells.map((cell, i) => ({ name: poses[i], cells: [cell], version: c.version })), { decl: builds.fighters[id] });
  const probe = audit.error ? audit : compactAudit(audit);
  const palette = quantizeFrames(cells, 48);
  const sheet = newImage(1024, 256);
  for (let i = 0; i < 4; i++) { blit(sheet, cells[i], i * 256, 0); blit(lineup, cells[i], col * 256, i * 256); fs.writeFileSync(path.join(out, `${id}-${poses[i]}_${tag}.png`), encodePng(cells[i])); }
  fs.writeFileSync(path.join(out, `${id}-samples_${tag}.png`), encodePng(sheet));
  fs.copyFileSync(file, path.join(out, `${id}-source_${tag}.png`));
  const meta = JSON.parse(fs.readFileSync(`public/characters/${id}/anims.json`, 'utf8')), atlas = readPng(`public/characters/${id}/sheet.png`);
  const old = newImage(1024,256);
  for (let row = 0; row < 4; row++) { const a = meta.animations[poses[row]], k = a.frames[row > 1 ? Math.min(3, a.frames.length - 1) : 0]; const cell = crop(atlas, k % meta.columns * 256, Math.floor(k / meta.columns) * 256, 256, 256); blit(before, cell, col * 256, row * 256); blit(old,cell,row*256,0); }
  fs.writeFileSync(path.join(out,`${id}-current.png`),encodePng(old));
  report.fighters[id] = { ...c, factor, source: file, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), canvas: [raw.w,raw.h], approximateSkullPx: (c.chin-c.crown)*factor, palette, probe, qa };
}
fs.writeFileSync(path.join(out, 'lineup_v02.png'), encodePng(lineup));
fs.writeFileSync(path.join(out, 'current-lineup.png'), encodePng(before));
fs.writeFileSync(path.join(out, 'qa.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.fighters).map(([id,v]) => [id, { factor:v.factor, skullPx:v.approximateSkullPx, palette:v.palette, poses:v.qa.map(q=>({pose:q.pose, h:q.packedBounds.h,w:q.packedBounds.w,lost:q.lost,margin:q.margin})) }])),null,2));
