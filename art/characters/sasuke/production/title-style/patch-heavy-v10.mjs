// Keep generated launcher poses but reuse the generated idle source for its
// required canonical return. Ratio uses actual atlas and B stitch scales.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const raw = path.resolve('art/characters/sasuke/raw');
const parts = path.join(raw, '_parts');
const a = path.join(parts, 'heavy_v10_A.png');
const bPath = path.join(parts, 'heavy_v10_B.png');
if (fs.existsSync(a) || fs.existsSync(bPath)) throw new Error('Refusing to overwrite v10');
const b = PNG.sync.read(fs.readFileSync(path.join(parts, 'heavy_v09_B.png')));
const idle = PNG.sync.read(fs.readFileSync(path.join(raw, 'idle_v07.png')));
const factor = 0.337 / (0.371 * 0.9566);
const w = Math.round(470 * factor), h = Math.round(524 * factor);
const x0 = 1721 - Math.floor(w / 2), y0 = 663 - h;
if (x0 < 1400 || x0 + w > b.width || y0 < 0 || y0 + h > b.height) throw new Error('Measured pose does not fit');
for (let y = 0; y < b.height; y++) for (let x = 1400; x < b.width; x++) {
  const k = (y * b.width + x) * 4;
  b.data[k] = 255; b.data[k + 1] = 0; b.data[k + 2] = 255; b.data[k + 3] = 255;
}
for (let y = 0; y < h; y++) {
  const sy = 35 + Math.min(523, Math.floor(y / factor));
  for (let x = 0; x < w; x++) {
    const sx = 25 + Math.min(469, Math.floor(x / factor));
    const src = (sy * idle.width + sx) * 4, dst = ((y0 + y) * b.width + x0 + x) * 4;
    for (let k = 0; k < 4; k++) b.data[dst + k] = idle.data[src + k];
  }
}
fs.copyFileSync(path.join(parts, 'heavy_v09_A.png'), a);
fs.writeFileSync(bPath, PNG.sync.write(b));
console.log(`heavy v10 recovery: source idle v07 f0 x${factor.toFixed(4)}, ${w}x${h} at ${x0},${y0}`);
