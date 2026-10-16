import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const base = path.resolve('art/characters/goku');
const out = path.join(base, 'production/reassembly-r02');
const picks = [
  ['heavy', 'heavy_v04_attempt04.png', 1152, 512, 384, 512],
  ['airLight1', 'airLight1_v04_attempt04.png', 0, 0, 512, 512],
  ['airHeavy', 'airHeavy_v04_attempt04.png', 1024, 512, 512, 512],
  ['getup', 'getup_v03_attempt02.png', 512, 512, 512, 512],
  ['special', 'special_v02_attempt03.png', 0, 0, 444, 444],
  ['launched', 'launched_v06_attempt02.png', 0, 0, 887, 887],
  ['down', 'down_v04_attempt02.png', 0, 0, 887, 887],
];
for (const [name, sourceName, x0, y0, w, h] of picks) {
  const sourcePath = path.join(base, 'production/generation-source', sourceName);
  const src = PNG.sync.read(fs.readFileSync(sourcePath));
  const outPng = new PNG({ width: w * 2, height: h * 2 });
  for (let y = 0; y < outPng.height; y++) for (let x = 0; x < outPng.width; x++) {
    const sx = x0 + (x >> 1), sy = y0 + (y >> 1);
    const si = (sy * src.width + sx) * 4, di = (y * outPng.width + x) * 4;
    outPng.data.set(src.data.subarray(si, si + 4), di);
  }
  for (let x = 0; x < outPng.width; x += 40) for (let y = 0; y < outPng.height; y++) {
    const i = (y * outPng.width + x) * 4;
    outPng.data[i] = outPng.data[i + 1] = outPng.data[i + 2] = 100;
  }
  for (let y = 0; y < outPng.height; y += 40) for (let x = 0; x < outPng.width; x++) {
    const i = (y * outPng.width + x) * 4;
    outPng.data[i] = outPng.data[i + 1] = outPng.data[i + 2] = 100;
  }
  fs.writeFileSync(path.join(out, `${name}-source-f0-or-selected-grid.png`), PNG.sync.write(outPng));
}
