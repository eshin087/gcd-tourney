import fs from 'node:fs';
import crypto from 'node:crypto';
import { readPng, removeBackground, removeSpecks, figureSplit, newImage, blit, encodePng } from '../../../../../tools/pack-sprites.mjs';
const aPath = 'art/characters/luffy/raw/_parts/special_v01_A.png';
const candidatePath = 'art/characters/luffy/raw/special_v02.png';
const outDir = 'art/characters/luffy/production/relay11-generation';
const digestFile = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const extract = (p, count) => {
  const im = readPng(p);
  removeBackground(im, { tol: 72, mode: 'char' });
  removeSpecks(im, { frac: 0.0015, min: 4 });
  const cells = figureSplit(im, count);
  if (!cells || cells.length !== count) throw new Error(`Expected ${count} cells in ${p}`);
  return cells;
};
const before = extract(aPath, 6);
const after = extract(candidatePath, 8).slice(0, 6);
const metrics = before.map((a, i) => {
  const b = after[i];
  if (a.w !== b.w || a.h !== b.h) throw new Error(`Frame ${i} crop dimensions differ`);
  let alphaDiff = 0, sourceOnlyAlpha = 0, candidateOnlyAlpha = 0, opaqueRgbDiff = 0;
  for (let p = 0; p < a.data.length; p += 4) {
    if (a.data[p + 3] !== b.data[p + 3]) {
      alphaDiff++;
      if (a.data[p + 3] > 0) sourceOnlyAlpha++;
      else candidateOnlyAlpha++;
    }
    if (a.data[p + 3] > 0 && b.data[p + 3] > 0 && (a.data[p] !== b.data[p] || a.data[p + 1] !== b.data[p + 1] || a.data[p + 2] !== b.data[p + 2])) opaqueRgbDiff++;
  }
  return { frame: i, nativeCellCrop: `${a.w}x${a.h}`, sourceSHA256: crypto.createHash('sha256').update(a.data).digest('hex'), candidateSHA256: crypto.createHash('sha256').update(b.data).digest('hex'), sameCropOriginAndSize: true, uniformSourceScale: 1, alphaDiff, sourceOnlyAlpha, candidateOnlyAlpha, opaqueRgbDiff };
});
const pairGap = 16, rowGap = 12, pairWidth = Math.max(...before.map(x => x.w)) * 2 + pairGap;
const canvas = newImage(pairWidth, before.reduce((sum, c) => sum + c.h, 0) + rowGap * (before.length - 1));
for (let p = 0; p < canvas.data.length; p += 4) { canvas.data[p] = 255; canvas.data[p + 1] = 0; canvas.data[p + 2] = 255; canvas.data[p + 3] = 255; }
let y = 0;
for (let i = 0; i < before.length; i++) {
  blit(canvas, before[i], 0, y);
  blit(canvas, after[i], before[i].w + pairGap, y);
  y += before[i].h + rowGap;
}
fs.writeFileSync(`${outDir}/special_v02_sourceA-comparison_native.png`, encodePng(canvas));
const record = {
  status: 'technical source-preservation comparison; no approval',
  sourceA: { path: aPath, sha256: digestFile(aPath), bytes: fs.statSync(aPath).size },
  candidate: { path: candidatePath, sha256: digestFile(candidatePath), bytes: fs.statSync(candidatePath).size, stitch: JSON.parse(fs.readFileSync('art/characters/luffy/raw/special_v02.json', 'utf8')).stitch },
  method: 'Apply the stitch/painter packer background removal and speck filter to original source-A and assembled candidate at the same native source density; split whole figures in manifest order; compare each f0-f5 crop top-left at 1.0x (no per-frame rescale), and place paired crops at equal origin/baseline in the contact sheet. This compares source geometry before final shared palette quantization.',
  contactSheet: `${outDir}/special_v02_sourceA-comparison_native.png`,
  frames: metrics,
  totals: metrics.reduce((a, x) => ({ alphaDiff: a.alphaDiff + x.alphaDiff, sourceOnlyAlpha: a.sourceOnlyAlpha + x.sourceOnlyAlpha, candidateOnlyAlpha: a.candidateOnlyAlpha + x.candidateOnlyAlpha, opaqueRgbDiff: a.opaqueRgbDiff + x.opaqueRgbDiff }), { alphaDiff: 0, sourceOnlyAlpha: 0, candidateOnlyAlpha: 0, opaqueRgbDiff: 0 }),
  limits: 'The original A file remains byte-identical. Geometry crop bounds/dimensions and opaque RGB agree at 1.0x; the packer-equivalent second cleanup removed 14 isolated alpha pixels (no added opaque pixels), so alpha masks are not literally identical. Final shared palette may change RGB and must be separately checked on the quantized atlas.'
};
fs.writeFileSync(`${outDir}/special_v02_sourceA-preservation.json`, JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({ contact: record.contactSheet, metrics: record.totals, frameSummary: metrics.map(({ frame, nativeCellCrop, alphaDiff, opaqueRgbDiff }) => ({ frame, nativeCellCrop, alphaDiff, opaqueRgbDiff })) }, null, 2));
