import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  readPng,
  encodePng,
  newImage,
  crop,
  blit,
  removeBackground,
  quantizeFrames,
} from '../../../../../tools/pack-sprites.mjs';

const root = process.cwd();
const source = 'art/characters/goku/raw/_qa_hold/light3_v13.png';
const output = 'art/characters/goku/production/relay11-generation/light3_v13_48c_diagnostic.png';
const metaPath = 'art/characters/goku/production/relay11-generation/QUANTIZED_V13.json';
const strip = readPng(path.join(root, source));
if (strip.w !== 7 * 256 || strip.h !== 256) {
  throw new Error(`Expected seven 256px cells; received ${strip.w}x${strip.h}`);
}
removeBackground(strip, { mode: 'char' });
const cells = Array.from({ length: 7 }, (_, i) => crop(strip, i * 256, 0, 256, 256));
const paletteSize = quantizeFrames(cells, 48);
const colors = new Set();
for (const image of cells) {
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3]) {
      colors.add((image.data[i] << 16) | (image.data[i + 1] << 8) | image.data[i + 2]);
    }
  }
}
if (paletteSize > 48 || colors.size > 48) {
  throw new Error(`48-color quantization produced ${colors.size} visible colors`);
}
const outputStrip = newImage(7 * 256, 256);
cells.forEach((cell, i) => blit(outputStrip, cell, i * 256, 0));
const outputPath = path.join(root, output);
fs.writeFileSync(outputPath, encodePng(outputStrip));
const sha = (p) => createHash('sha256').update(fs.readFileSync(p)).digest('hex').toUpperCase();
const meta = {
  schema: 'goku-relay11-light3-quantized-v13',
  status: 'isolated candidate diagnostic; exact quantized pixels for Astra review only; no manualQA or user drawing approval',
  quantizer: 'tools/pack-sprites.mjs exported removeBackground(mode=char) and quantizeFrames(cells,48), run jointly over all seven candidate cells',
  source,
  sourceSha256: sha(path.join(root, source)),
  frameCount: cells.length,
  cellSize: 256,
  paletteLimit: 48,
  visibleColorCount: colors.size,
  paletteSizeReported: paletteSize,
  output,
  outputDimensions: [outputStrip.w, outputStrip.h],
  outputSha256: sha(outputPath),
};
fs.writeFileSync(path.join(root, metaPath), JSON.stringify(meta, null, 2) + '\n');
console.log(JSON.stringify(meta, null, 2));
