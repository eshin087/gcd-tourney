import fs from 'node:fs';
import { PNG } from 'pngjs';
const [name, version] = process.argv.slice(2);
if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name) || !/^\d{2}$/.test(version)) throw new Error('Expected animation name and two-digit version');
const base = 'art/characters/gojo/raw/';
const destination = `${base}${name}_v${version}.png`;
if (fs.existsSync(destination)) throw new Error(`Refusing to overwrite ${destination}`);
const parts = ['A', 'B'].map(part => PNG.sync.read(fs.readFileSync(`${base}_parts/${name}_v${version}_${part}.png`)));
const scale = Number(process.argv[4] || 1);
if (!(scale > 0.2 && scale < 3)) throw new Error('Invalid part B scale');
if (scale !== 1) {
  const src = parts[1], dst = new PNG({ width: Math.round(src.width * scale), height: Math.round(src.height * scale) });
  for (let y = 0; y < dst.height; y++) for (let x = 0; x < dst.width; x++) {
    const i = (Math.min(src.height - 1, Math.floor(y / scale)) * src.width + Math.min(src.width - 1, Math.floor(x / scale))) * 4;
    dst.data.set(src.data.subarray(i, i + 4), (y * dst.width + x) * 4);
  }
  parts[1] = dst;
}
const bottom = p => {
  for (let y = p.height - 1; y >= 0; y--) {
    let count = 0;
    for (let x = 0; x < p.width; x++) { const i = (y * p.width + x) * 4; if (p.data[i + 3] > 128 && !(p.data[i] > 170 && p.data[i + 2] > 170 && p.data[i + 1] < 150)) count++; }
    if (count > 8) return y;
  }
  throw new Error('Empty part');
};
const bottoms = parts.map(bottom);
const offsets = bottoms.map(b => Math.max(...bottoms) - b);
const out = new PNG({ width: parts[0].width + parts[1].width + 24, height: Math.max(...parts.map(p => p.height)) });
for (let i = 0; i < out.data.length; i += 4) out.data.set([255, 0, 255, 255], i);
let x = 0;
for (let j = 0; j < parts.length; j++) { const p = parts[j]; PNG.bitblt(p, out, 0, 0, p.width, Math.min(p.height, out.height - offsets[j]), x, offsets[j]); x += p.width + 24; }
fs.writeFileSync(destination, PNG.sync.write(out), { flag: 'wx' });
console.log(destination);
