import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root = path.resolve('art/characters/goku');
const animations = [
  ['run', 4], ['dash', 3], ['jumpUp', 3], ['jumpFall', 2], ['land', 3],
  ['light1', 2], ['light2', 4], ['light3', 4], ['light4', 4], ['heavy', 4],
  ['airLight1', 4], ['airHeavy', 4], ['guard', 4], ['hurtHigh', 7],
  ['launched', 6], ['down', 4], ['getup', 3], ['charge', 4],
  ['beamCharge', 4], ['beamFire', 4], ['special', 2], ['win', 3],
];
const manifest = JSON.parse(fs.readFileSync(path.resolve('art/manifest.json'), 'utf8'));
const cell = 128;
const out = new PNG({ width: cell * 9, height: cell * animations.length });
for (let i = 0; i < out.data.length; i += 4) {
  out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 255; out.data[i + 3] = 255;
}
const idle = PNG.sync.read(fs.readFileSync(path.join(root, 'reference/idle_approved.png')));
function paste(source, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY) {
  const scale = Math.min(0.5, cell / sourceWidth, cell / sourceHeight);
  const drawnWidth = Math.round(sourceWidth * scale), drawnHeight = Math.round(sourceHeight * scale);
  const padX = Math.floor((cell - drawnWidth) / 2), padY = Math.floor((cell - drawnHeight) / 2);
  for (let y = 0; y < drawnHeight; y++) for (let x = 0; x < drawnWidth; x++) {
    const sx = sourceX + Math.min(sourceWidth - 1, Math.floor(x / scale));
    const sy = sourceY + Math.min(sourceHeight - 1, Math.floor(y / scale));
    const si = (sy * source.width + sx) * 4;
    const di = ((targetY + padY + y) * out.width + targetX + padX + x) * 4;
    out.data[di] = source.data[si]; out.data[di + 1] = source.data[si + 1]; out.data[di + 2] = source.data[si + 2]; out.data[di + 3] = source.data[si + 3];
  }
}
for (let row = 0; row < animations.length; row++) {
  const [name, version] = animations[row];
  paste(idle, 0, 0, 256, 256, 0, row * cell);
  const versionName = `${name}_v${String(version).padStart(2, '0')}.png`;
  const rawPath = path.join(root, 'raw', versionName);
  const sourcePath = fs.existsSync(rawPath) ? rawPath : path.join(root, 'raw/_qa_hold', versionName);
  const strip = PNG.sync.read(fs.readFileSync(sourcePath));
  const frames = manifest.characters.goku.animations[name].frames;
  const frameWidth = strip.width / frames;
  for (let frame = 0; frame < frames; frame++) {
    const x0 = Math.floor(frame * frameWidth), x1 = Math.floor((frame + 1) * frameWidth);
    paste(strip, x0, 0, x1 - x0, strip.height, (frame + 1) * cell, row * cell);
  }
}
const output = path.join(root, 'production/scale-qa/goku-core-contact-v01.png');
fs.writeFileSync(output, PNG.sync.write(out));
console.log(`${output} (${out.width}x${out.height}); first column is approved idle f0, remaining columns are animation frames in order. Cells are nearest-neighbor reduced to at most half size; source cells with non-native dimensions are fit into the display cell for review only.`);
