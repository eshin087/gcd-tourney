// Reuse the generated idle v07 first pose as light4's canonical recovery endpoint.
// The source-to-source factor is measured from the actual packed scales, not eyeballed:
// idle raw x0.337, light4 raw x0.401, and light4 B was stitched x0.996.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const raw = path.resolve('art/characters/sasuke/raw');
const parts = path.join(raw, '_parts');
const oldA = path.join(parts, 'light4_v07_A.png');
const oldB = path.join(parts, 'light4_v07_B.png');
const nextA = path.join(parts, 'light4_v08_A.png');
const nextB = path.join(parts, 'light4_v08_B.png');
for (const next of [nextA, nextB]) {
  if (fs.existsSync(next)) throw new Error(`Refusing to overwrite ${next}`);
}

const b = PNG.sync.read(fs.readFileSync(oldB));
const idle = PNG.sync.read(fs.readFileSync(path.join(raw, 'idle_v07.png')));
if (b.width !== 2172 || b.height !== 724 || idle.width !== 4232 || idle.height !== 582) {
  throw new Error('Source geometry changed; remeasure the pose spans before patching');
}

// The original final pose starts at x1509; the previous pose ends at x1238.
for (let y = 0; y < b.height; y++) {
  for (let x = 1400; x < b.width; x++) {
    const q = (y * b.width + x) * 4;
    b.data[q] = 255;
    b.data[q + 1] = 0;
    b.data[q + 2] = 255;
    b.data[q + 3] = 255;
  }
}

// First idle pose's measured source bbox is x25..494, y35..558.
const idleBox = { x: 25, y: 35, w: 470, h: 524 };
const factor = 0.337 / (0.401 * 0.996);
const width = Math.round(idleBox.w * factor);
const height = Math.round(idleBox.h * factor);
const left = 1673 - Math.floor(width / 2);
const top = 642 - height; // feet finish at y641, the B-part ground baseline
if (left < 1400 || left + width > b.width || top < 0 || top + height > b.height) {
  throw new Error('Replacement idle pose does not fit its measured slot');
}

for (let y = 0; y < height; y++) {
  const srcY = idleBox.y + Math.min(idleBox.h - 1, Math.floor(y / factor));
  for (let x = 0; x < width; x++) {
    const srcX = idleBox.x + Math.min(idleBox.w - 1, Math.floor(x / factor));
    const src = (srcY * idle.width + srcX) * 4;
    const dst = ((top + y) * b.width + left + x) * 4;
    for (let k = 0; k < 4; k++) b.data[dst + k] = idle.data[src + k];
  }
}

fs.copyFileSync(oldA, nextA);
fs.writeFileSync(nextB, PNG.sync.write(b));
console.log(`light4 v08 B final pose: idle v07 f0 x${factor.toFixed(4)}, ${width}x${height}, at ${left},${top}`);
