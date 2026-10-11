// Review-only layout: measured neutral landmarks set one uniform scale per character.
// No animation inputs, game atlas, identity pixels or body parts are edited.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const out = 'public/art-review/title-style-pilot';
fs.mkdirSync(out, { recursive: true });
const configs = [
  { id: 'naruto', crownY: 70, bodyPx: 195 },
  { id: 'sasuke', crownY: 88, bodyPx: 197 },
  { id: 'killua', crownY: 95, bodyPx: 176 },
  { id: 'gojo', crownY: 92, bodyPx: 222 },
];
function bounds(p, x0, x1) {
  let minX = p.width, minY = p.height, maxX = -1, maxY = -1;
  for (let y = 0; y < p.height; y++) for (let x = x0; x < x1; x++) {
    if (p.data[(y * p.width + x) * 4 + 3] < 192) continue;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, soleY: maxY };
}
function cell(p, b, scale) {
  const c = new PNG({ width: 256, height: 256 });
  const w = Math.round(b.w * scale), h = Math.round(b.h * scale);
  const left = Math.floor((256 - w) / 2), top = 241 - h;
  if (left < 4 || top < 4 || left + w > 252) throw new Error(`Candidate exceeds review cell: ${left},${top},${w},${h}`);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = b.x + Math.min(b.w - 1, Math.floor(x / scale));
    const sy = b.y + Math.min(b.h - 1, Math.floor(y / scale));
    const si = (sy * p.width + sx) * 4;
    if (p.data[si + 3] < 128) continue;
    const di = ((top + y) * 256 + left + x) * 4;
    c.data[di] = p.data[si]; c.data[di + 1] = p.data[si + 1]; c.data[di + 2] = p.data[si + 2]; c.data[di + 3] = 255;
  }
  return { png: c, width: w, height: h, left, top };
}
const rows = [new PNG({ width: 1024, height: 256 }), new PNG({ width: 1024, height: 256 })];
const records = [];
for (const [col, c] of configs.entries()) {
  const source = `art/characters/${c.id}/reference/title_style_draft_v01.png`;
  const p = PNG.sync.read(fs.readFileSync(source));
  const halves = [bounds(p, 0, Math.floor(p.width / 2)), bounds(p, Math.floor(p.width / 2), p.width)];
  const scale = (236 / 238) * c.bodyPx / (halves[0].soleY - c.crownY);
  const poses = [];
  for (let row = 0; row < 2; row++) {
    const result = cell(p, halves[row], scale);
    fs.writeFileSync(`${out}/${c.id}-${row === 0 ? 'neutral' : 'combat'}_v01.png`, PNG.sync.write(result.png));
    result.png.bitblt(rows[row], 0, 0, 256, 256, col * 256, 0);
    poses.push({ pose: row === 0 ? 'neutral' : 'combat', sourceBounds: halves[row], packedBounds: { width: result.width, height: result.height, left: result.left, top: result.top } });
  }
  fs.copyFileSync(source, `${out}/${c.id}-source_v01.png`);
  records.push({ ...c, crownUncertaintySourcePx: 12, source, uniformScale: scale, poses });
}
for (let i = 0; i < rows.length; i++) fs.writeFileSync(`${out}/${i ? 'combat' : 'neutral'}-lineup_v01.png`, PNG.sync.write(rows[i]));
fs.copyFileSync('public/ui/title_art.png', `${out}/title-reference.png`);
fs.writeFileSync(`${out}/measurements.json`, JSON.stringify(records, null, 2) + '\n');
fs.writeFileSync('art/scale/title-style-pilot/measurements.json', JSON.stringify(records, null, 2) + '\n');
console.log(JSON.stringify(records.map(r => ({ id: r.id, scale: r.uniformScale, poses: r.poses.map(p => p.packedBounds) })), null, 2));
