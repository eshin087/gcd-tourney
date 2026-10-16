import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku');
const sources = [
  { part: 'A', file: 'light1_v01_attempt01_A.png', frames: 4, landmarks: 'source A f0 and source B f6 direct belt/boot landmark intervals from light1_v03 sidecar; source identity preserved' },
  { part: 'B', file: 'light1_v01_attempt03_B.png', frames: 3, landmarks: 'source A f0 and source B f6 direct belt/boot landmark intervals from light1_v03 sidecar; source identity preserved' }
];
const factor = 0.383;
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const magenta = (d, i) => d[i] > 160 && d[i + 1] < 100 && d[i + 2] > 160;
const hold = path.join(base, 'raw/_qa_hold');
fs.mkdirSync(hold, { recursive: true });
const outPath = path.join(hold, 'light1_v04.png');
if (fs.existsSync(outPath) || fs.existsSync(outPath.replace(/\.png$/, '.json'))) throw new Error('refusing to overwrite light1_v04');
const panels = [];
const sourceRecords = [];
for (const src of sources) {
  const srcPath = path.join(base, 'production/generation-source', src.file);
  const bytes = fs.readFileSync(srcPath), image = PNG.sync.read(bytes);
  const panelW = image.width / src.frames;
  if (image.width !== panelW * src.frames || image.height !== 724) throw new Error(`unexpected source dimensions ${src.file}: ${image.width}x${image.height}`);
  sourceRecords.push({ part: src.part, path: `art/characters/goku/production/generation-source/${src.file}`, sha256: sha(bytes), dimensions: [image.width, image.height], grid: [src.frames, 1], mapping: `frames ${panels.length}-${panels.length + src.frames - 1}`, landmarkEvidence: src.landmarks });
  for (let f = 0; f < src.frames; f++) {
    const x0 = f * panelW, x1 = x0 + panelW;
    let left = panelW, top = image.height, right = -1, bottom = -1;
    for (let y = 0; y < image.height; y++) for (let x = x0; x < x1; x++) {
      const i = (y * image.width + x) * 4;
      if (image.data[i + 3] < 128 || magenta(image.data, i)) continue;
      left = Math.min(left, x - x0); top = Math.min(top, y); right = Math.max(right, x - x0); bottom = Math.max(bottom, y);
    }
    if (right < 0) throw new Error(`empty ${src.part} frame ${f}`);
    const w = Math.ceil((right - left + 1) * factor), h = Math.ceil((bottom - top + 1) * factor);
    const ox = Math.round((256 - w) / 2), oy = 240 - h + 1;
    const cell = new PNG({ width: 256, height: 256 });
    for (let i = 0; i < cell.data.length; i += 4) cell.data.set([255, 0, 255, 255], i);
    let copied = 0, lost = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const sx = left + Math.min(right - left, Math.floor(x / factor)), sy = top + Math.min(bottom - top, Math.floor(y / factor));
      const si = (sy * image.width + x0 + sx) * 4;
      if (image.data[si + 3] < 128 || magenta(image.data, si)) continue;
      const tx = ox + x, ty = oy + y;
      if (tx < 0 || tx >= 256 || ty < 0 || ty >= 256) { lost++; continue; }
      cell.data.set(image.data.subarray(si, si + 4), (ty * 256 + tx) * 4); copied++;
    }
    panels.push({ image: cell, part: src.part, sourceFrame: f, sourceRect: [x0, 0, x1, image.height], sourceBounds: [left, top, right, bottom], scaledBounds: [ox, oy, ox + w - 1, oy + h - 1], nativeBodyHeight: h, copied, lost, frameSha256: sha(PNG.sync.write(cell)) });
  }
}
const strip = new PNG({ width: 256 * panels.length, height: 256 });
for (let i = 0; i < strip.data.length; i += 4) strip.data.set([255, 0, 255, 255], i);
panels.forEach((p, f) => { for (let y = 0; y < 256; y++) strip.data.set(p.image.data.subarray(y * 1024, (y + 1) * 1024), (y * strip.width + f * 256) * 4); });
const out = PNG.sync.write(strip); fs.writeFileSync(outPath, out);
const record = {
  animation: 'light1', version: 4, status: 'diagnostic technical hold; exact packed audit pending; no new design approval requested for uniform calibration of the existing approved drawing',
  sourceParts: sourceRecords, selectedFactor: factor, factorMethod: 'single uniform factor .383 constrained by recorded idle-target uncertainty intervals; follows the source A/B factor relation in v03 (.385), reduced by 0.52% to fit the 237px packer body-height ceiling; not a bounds-selected art rescale',
  factorUncertainty: '±0.050; source A/B endpoint uncertainty retained separately from reference uncertainty; v03 used median .385 from belt/boot observations, and this one constrained candidate changes that factor by only 0.002',
  landmarks: JSON.parse(fs.readFileSync(path.join(base, 'raw/_qa_hold/light1_v03.json'), 'utf8')).frame0AndFrame6Landmarks,
  transform: 'nearest-neighbor uniform scale .383 on all seven original A/B panels; center each silhouette and ground its lowest non-magenta pixel to y=240; no per-frame scaling',
  nativeBodyHeight: Math.max(...panels.map((p) => p.nativeBodyHeight)), frames: panels.map(({ image, ...p }) => p),
  sourcePixelsLostAtRawAssembly: panels.reduce((n, p) => n + p.lost, 0), outputPath: 'art/characters/goku/raw/_qa_hold/light1_v04.png', outputSha256: sha(out),
  candidateBodyHeightForX1Pack: Math.max(...panels.map((p) => p.nativeBodyHeight)), note: 'Deterministic reassembly from the same previously reviewed source parts. No image generation call and no new drawing design. Exact quantized combined-palette pixels require Astra audit.'
};
fs.writeFileSync(outPath.replace(/\.png$/, '.json'), JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({ version: 4, factor, maxBodyHeight: record.nativeBodyHeight, lost: record.sourcePixelsLostAtRawAssembly, sourceParts: sourceRecords, outputSha256: record.outputSha256 }, null, 2));
