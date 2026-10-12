// Reuse generated idle v07 frame 0 where a canonical attack ends in the
// approved open-palm stance. Factors derive from actual pack/stitch scales.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const raw = path.resolve('art/characters/sasuke/raw');
const parts = path.join(raw, '_parts');
const idle = PNG.sync.read(fs.readFileSync(path.join(raw, 'idle_v07.png')));
const box = { x: 25, y: 35, w: 470, h: 524 };

function copyUnique(source, target) {
  if (fs.existsSync(target)) throw new Error(`Refusing to overwrite ${target}`);
  fs.copyFileSync(source, target);
}

// light1 v06 B already generated the matching open-palm endpoint; its early
// startup in A was the defect, so pair it with the corrected v07 A.
copyUnique(path.join(parts, 'light1_v07_A.png'), path.join(parts, 'light1_v08_A.png'));
copyUnique(path.join(parts, '_rejected', 'light1_v06_B.png'), path.join(parts, 'light1_v08_B.png'));

for (const row of [
  { name: 'light2', old: 6, next: 7, pack: 0.359, stitch: 0.9686, left: 1400, center: 1664, sole: 679 },
  { name: 'light3', old: 7, next: 8, pack: 0.346, stitch: 0.9984, left: 1400, center: 1654, sole: 709 },
]) {
  const oldA = path.join(parts, `${row.name}_v${String(row.old).padStart(2, '0')}_A.png`);
  const oldB = path.join(parts, `${row.name}_v${String(row.old).padStart(2, '0')}_B.png`);
  const nextA = path.join(parts, `${row.name}_v${String(row.next).padStart(2, '0')}_A.png`);
  const nextB = path.join(parts, `${row.name}_v${String(row.next).padStart(2, '0')}_B.png`);
  if (fs.existsSync(nextA) || fs.existsSync(nextB)) throw new Error(`Refusing to overwrite ${row.name}`);
  const b = PNG.sync.read(fs.readFileSync(oldB));
  for (let y = 0; y < b.height; y++) {
    for (let x = row.left; x < b.width; x++) {
      const k = (y * b.width + x) * 4;
      b.data[k] = 255;
      b.data[k + 1] = 0;
      b.data[k + 2] = 255;
      b.data[k + 3] = 255;
    }
  }
  const factor = 0.337 / (row.pack * row.stitch);
  const w = Math.round(box.w * factor);
  const h = Math.round(box.h * factor);
  const x0 = row.center - Math.floor(w / 2);
  const y0 = row.sole + 1 - h;
  if (x0 < row.left || x0 + w > b.width || y0 < 0 || y0 + h > b.height) {
    throw new Error(`${row.name}: replacement does not fit the measured slot`);
  }
  for (let y = 0; y < h; y++) {
    const sy = box.y + Math.min(box.h - 1, Math.floor(y / factor));
    for (let x = 0; x < w; x++) {
      const sx = box.x + Math.min(box.w - 1, Math.floor(x / factor));
      const src = (sy * idle.width + sx) * 4;
      const dst = ((y0 + y) * b.width + x0 + x) * 4;
      for (let k = 0; k < 4; k++) b.data[dst + k] = idle.data[src + k];
    }
  }
  fs.copyFileSync(oldA, nextA);
  fs.writeFileSync(nextB, PNG.sync.write(b));
  console.log(`${row.name} v${row.next}: idle f0 x${factor.toFixed(4)}, ${w}x${h}, at ${x0},${y0}`);
}
