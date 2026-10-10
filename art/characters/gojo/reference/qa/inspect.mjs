// Read the packed atlas; produce review evidence without changing source art.
import fs from 'node:fs';
import { PNG } from 'pngjs';

const root = 'art/characters/gojo/reference/qa/';
const atlas = PNG.sync.read(fs.readFileSync('public/characters/gojo/sheet.png'));
const meta = JSON.parse(fs.readFileSync('public/characters/gojo/anims.json', 'utf8'));
const contact = new PNG({ width: 1024, height: 1024 });
for (let i = 0; i < contact.data.length; i += 4) contact.data.set([34, 39, 53, 255], i);
const report = { complete: meta.complete, animations: {}, colors: 0, softAlpha: 0, magenta: 0 };
const colors = new Set();
let tile = 0;
for (const name of ['idle', 'run']) {
  const frames = [];
  for (const index of meta.animations[name].frames) {
    let x0 = 256, y0 = 256, x1 = -1, y1 = -1, footSum = 0, footN = 0;
    const sx = index % meta.columns * 256, sy = Math.floor(index / meta.columns) * 256;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const i = ((sy + y) * atlas.width + sx + x) * 4;
      const [r, g, b, a] = atlas.data.subarray(i, i + 4);
      if (!a) continue;
      colors.add(`${r},${g},${b}`);
      if (a !== 255) report.softAlpha++;
      if (r > 200 && b > 200 && g < 80) report.magenta++;
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      if (y >= 235) { footSum += x; footN++; }
      const j = ((Math.floor(tile / 4) * 256 + y) * 1024 + tile % 4 * 256 + x) * 4;
      contact.data.set([r, g, b, 255], j);
    }
    frames.push({ index, bounds: [x0, y0, x1, y1], height: y1 - y0 + 1, footCenter: footN ? +(footSum / footN).toFixed(2) : null });
    tile++;
  }
  report.animations[name] = frames;
}
report.colors = colors.size;
fs.writeFileSync(root + 'packed-metrics.json', JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(root + 'movement-contact.png', PNG.sync.write(contact));
console.log(JSON.stringify(report));
if (report.colors > 48 || report.softAlpha || report.magenta) process.exitCode = 1;
