import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root = process.cwd();
const base = 'art/characters/goku';
const idle = PNG.sync.read(fs.readFileSync(path.join(root, base, 'raw/idle_v02.png')));
const configs = [{ name: 'guard', version: 5, frames: 2 }, { name: 'light2', version: 5, frames: 7 }];
const mag = (p, i) => p.data[i] > 160 && p.data[i + 1] < 100 && p.data[i + 2] > 160;
for (const cfg of configs) {
  const strip = PNG.sync.read(fs.readFileSync(path.join(root, base, `raw/${cfg.name}_v05.png`)));
  const out = new PNG({ width: (cfg.frames + 1) * 256, height: 256 });
  for (let i = 0; i < out.data.length; i += 4) out.data.set([255, 0, 255, 255], i);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const si = (y * idle.width + x) * 4, di = (y * out.width + x) * 4;
    out.data.set(idle.data.subarray(si, si + 4), di);
  }
  for (let f = 0; f < cfg.frames; f++) for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const si = (y * strip.width + f * 256 + x) * 4, di = (y * out.width + (f + 1) * 256 + x) * 4;
    if (strip.data[si + 3] && !mag(strip, si)) out.data.set(strip.data.subarray(si, si + 4), di);
  }
  // Idle f0 hair top and sole guide.
  for (let x = 0; x < out.width; x++) for (const y of [7, 240]) {
    const i = (y * out.width + x) * 4;
    out.data.set([65, 235, 255, 255], i);
  }
  fs.writeFileSync(path.join(root, base, `production/reassembly-v01/${cfg.name}-v05-contact-v02.png`), PNG.sync.write(out));
}
