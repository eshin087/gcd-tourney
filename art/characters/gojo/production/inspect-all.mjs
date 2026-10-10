import fs from 'node:fs';
import { PNG } from 'pngjs';
const base = 'art/characters/gojo/production/';
fs.mkdirSync(base + 'contact', { recursive: true });
const atlas = PNG.sync.read(fs.readFileSync('public/characters/gojo/sheet.png'));
const meta = JSON.parse(fs.readFileSync('public/characters/gojo/anims.json'));
const defs = JSON.parse(fs.readFileSync('art/manifest.json')).characters.gojo.animations;
const report = { complete: meta.complete, animations: {}, colors: 0, softAlpha: 0, magenta: 0 };
const colors = new Set();
for (const [name, anim] of Object.entries(meta.animations)) {
  const contact = new PNG({ width: 256 * anim.frames.length, height: 256 });
  for (let i = 0; i < contact.data.length; i += 4) contact.data.set([34, 39, 53, 255], i);
  const frames = [];
  anim.frames.forEach((index, k) => {
    const sx = index % meta.columns * 256, sy = Math.floor(index / meta.columns) * 256;
    const bounds = [256, 256, -1, -1];
    let pixels = 0;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const i = ((sy + y) * atlas.width + sx + x) * 4;
      const [r, g, b, a] = atlas.data.subarray(i, i + 4);
      if (!a) continue;
      pixels++; colors.add(`${r},${g},${b}`);
      if (a !== 255) report.softAlpha++;
      if (r > 200 && b > 200 && g < 80) report.magenta++;
      bounds[0] = Math.min(bounds[0], x); bounds[1] = Math.min(bounds[1], y);
      bounds[2] = Math.max(bounds[2], x); bounds[3] = Math.max(bounds[3], y);
      contact.data.set([r, g, b, 255], (y * contact.width + k * 256 + x) * 4);
    }
    frames.push({ index, bounds, pixels });
  });
  fs.writeFileSync(base + `contact/${name}.png`, PNG.sync.write(contact));
  report.animations[name] = { expected: defs[name].frames, actual: frames.length, frames };
}
report.colors = colors.size;
fs.writeFileSync(base + 'metrics.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ complete: report.complete, animations: Object.keys(report.animations).length, colors: report.colors, softAlpha: report.softAlpha, magenta: report.magenta, mismatches: Object.entries(report.animations).filter(([, a]) => a.expected !== a.actual).map(([n]) => n) }));
