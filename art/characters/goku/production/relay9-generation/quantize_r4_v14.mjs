import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readPng, encodePng, newImage, crop, blit, removeBackground, quantizeFrames, bbox } from '../../../../../tools/pack-sprites.mjs';

const root = process.cwd();
const base = 'art/characters/goku';
const outDir = `${base}/production/relay9-generation`;
const specs = [
  { asset: 'light3', version: 11, frames: 7, width: 256, file: `${base}/raw/_qa_hold/light3_v11.png` },
  { asset: 'heavy', version: 14, frames: 8, width: 256, file: `${base}/raw/_qa_hold/heavy_v14.png` },
  { asset: 'light3-roomy', version: 11, frames: 7, width: 280, file: `${base}/raw/_qa_hold/light3_v11_roomy_280.png` },
];
const cells = [];
for (const spec of specs) {
  const strip = readPng(path.join(root, spec.file));
  removeBackground(strip, { mode: 'char' });
  if (strip.w !== spec.frames * spec.width || strip.h !== spec.width) throw new Error(`Unexpected dimensions for ${spec.file}: ${strip.w}x${strip.h}`);
  spec.cells = [];
  for (let i = 0; i < spec.frames; i++) {
    const cell = crop(strip, i * spec.width, 0, spec.width, spec.width);
    spec.cells.push(cell);
    cells.push(cell);
  }
}
const paletteSize = quantizeFrames(cells, 48);
const countColors = (images) => {
  const colors = new Set();
  for (const img of images) for (let i = 0; i < img.data.length; i += 4) if (img.data[i + 3]) colors.add((img.data[i] << 16) | (img.data[i + 1] << 8) | img.data[i + 2]);
  return colors.size;
};
if (paletteSize > 48 || countColors(cells) > 48) throw new Error('Quantization exceeded 48 visible colors');
const writeStrip = (name, frames, size) => {
  const out = newImage(frames.length * size, size);
  frames.forEach((frame, i) => blit(out, frame, i * size, 0));
  const p = path.join(root, outDir, name);
  fs.writeFileSync(p, encodePng(out));
  return { file: path.relative(root, p).replaceAll('\\', '/'), dimensions: [out.w, out.h], sha256: createHash('sha256').update(fs.readFileSync(p)).digest('hex'), frames: frames.length };
};
const diagLight = writeStrip('light3_v11_v14palette_48c_diagnostic.png', specs[0].cells, 256);
const diagHeavy = writeStrip('heavy_v14_48c_diagnostic.png', specs[1].cells, 256);
const diagBoth = writeStrip('light3-heavy_relay9_v14_48c_diagnostic.png', [...specs[0].cells, ...specs[1].cells], 256);
const roomy = writeStrip('light3_v11_roomy_280_v14palette_48c.png', specs[2].cells, 280);
const meta = {
  schema: 'goku-relay9-quantized-fixture-r4',
  status: 'isolated quantized diagnostic only; not a normal atlas, not audited, not approved; transparent backgrounds match character packer output',
  quantizer: 'tools/pack-sprites.mjs exported removeBackground(mode=char) and quantizeFrames(cells,48); median-cut palette computed jointly across 22 diagnostic and roomy cells',
  visibleColorCount: countColors(cells),
  paletteSizeReported: paletteSize,
  sourceInputs: specs.map((s) => ({ asset: s.asset, source: s.file, sourceSha256: createHash('sha256').update(fs.readFileSync(path.join(root, s.file))).digest('hex'), frameCount: s.frames, cellSize: s.width })),
  outputs: { light3: diagLight, heavy: diagHeavy, combined15: diagBoth, light3RoomyCompanion: roomy },
  notes: ['The 15-cell fixture contains exactly 7 light3 and 8 heavy frames at 256x256.', 'The roomy 280-cell companion shares the same 48-color palette.', 'The final normal atlas must be quantized and audited separately after candidate findings.'],
};
const metaPath = path.join(root, outDir, 'QUANTIZED_FIXTURE_R4_V14.json');
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
console.log(JSON.stringify({ visibleColorCount: meta.visibleColorCount, outputs: meta.outputs }, null, 2));



