import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

// Diagnostic-only nearest-neighbor crops from the actual quantized atlas.
const [input = 'public/characters/sasuke', dest = 'art/characters/sasuke/production/round4/baseline'] = process.argv.slice(2);
fs.mkdirSync(dest, { recursive: true });
const sheet = PNG.sync.read(fs.readFileSync(path.join(input, 'sheet.png')));
const metadata = JSON.parse(fs.readFileSync(path.join(input, 'anims.json')));
const names = ['superDash', 'jumpSquat', 'beamFire', 'airLight3', 'dash', 'run', 'specialUp', 'hurtLow', 'airRecover'];
const digits = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111'];
function pixel(out, x, y, rgb) {
  if (x < 0 || x >= out.width || y < 0 || y >= out.height) return;
  const j = (y * out.width + x) * 4;
  out.data.set([...rgb, 255], j);
}
function number(out, value, x, y) {
  for (const [n, char] of String(value).split('').entries()) {
    for (let k = 0; k < 15; k++) if (digits[+char][k] === '1') pixel(out, x + n * 4 + k % 3, y + Math.floor(k / 3), [255, 245, 30]);
  }
}
function cell(index) {
  const out = new PNG({ width: 288, height: 288 });
  for (let y = 0; y < 288; y++) for (let x = 0; x < 288; x++) pixel(out, x, y, [45, 45, 45]);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const j = ((Math.floor(index / 16) * 256 + y) * sheet.width + index % 16 * 256 + x) * 4;
    if (sheet.data[j + 3]) pixel(out, x + 16, y + 16, [...sheet.data.subarray(j, j + 3)]);
  }
  for (let n = 0; n < 256; n += 16) {
    number(out, n, n + 16, 5); number(out, n, 1, n + 16);
    for (let m = 0; m < 256; m += 16) pixel(out, n + 16, m + 16, [80, 150, 80]);
  }
  return out;
}
function enlargedPair(left, right) {
  const out = new PNG({ width: 1728, height: 864 });
  for (let t = 0; t < 2; t++) {
    const img = t ? right : left;
    for (let y = 0; y < 288; y++) for (let x = 0; x < 288; x++) for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++) {
      const from = (y * 288 + x) * 4;
      const to = ((y * 3 + dy) * 1728 + t * 864 + x * 3 + dx) * 4;
      out.data.set(img.data.subarray(from, from + 4), to);
    }
  }
  return out;
}
const idle = cell(metadata.animations.idle.frames[0]);
for (const name of names) for (const [f, index] of metadata.animations[name].frames.entries()) {
  fs.writeFileSync(path.join(dest, `${name}-${f}.png`), PNG.sync.write(enlargedPair(idle, cell(index))));
}
fs.writeFileSync(path.join(dest, 'atlas-metadata.json'), JSON.stringify({ input, atlasSha256: (await import('node:crypto')).createHash('sha256').update(fs.readFileSync(path.join(input, 'sheet.png'))).digest('hex'), metadata }, null, 2));
console.log(dest);
