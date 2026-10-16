import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPng, encodePng } from '../../../../../tools/pack-sprites.mjs';
const out = path.dirname(fileURLToPath(import.meta.url));
const input = JSON.parse(fs.readFileSync(path.join(out, 'landmarks.json')));
const rows = input.measurements.map(m => ({ ...m, projectedPx: +Math.hypot(m.points[1][0] - m.points[0][0], m.points[1][1] - m.points[0][1]).toFixed(1), uncertaintyPx: 6 }));
for (const file of new Set(rows.map(m => m.image))) {
  const im = readPng(path.join(out, file));
  const pixel = (x, y) => { if (x < 0 || y < 0 || x >= im.w || y >= im.h) return; const k = (y * im.w + x) * 4; im.data.set([0,255,255,255], k); };
  for (const m of rows.filter(m => m.image === file)) {
    const [[x0,y0],[x1,y1]] = m.points;
    const n = Math.ceil(Math.hypot(x1-x0,y1-y0));
    for (let t = 0; t <= n; t++) pixel(Math.round(x0+(x1-x0)*t/n), Math.round(y0+(y1-y0)*t/n));
    for (const [x,y] of m.points) for (let q=-3;q<=3;q++) {pixel(x+q,y);pixel(x,y+q);}
  }
  fs.writeFileSync(path.join(out, file.replace('.png','-landmarks.png')), encodePng(im));
}
fs.writeFileSync(path.join(out, 'measured-segments.json'), JSON.stringify({ method: input.method, rows },null,2)+'\n');
console.log(rows.map(m => `${m.image} | ${m.segment} | ${m.projectedPx} +/-6px`).join('\n'));
