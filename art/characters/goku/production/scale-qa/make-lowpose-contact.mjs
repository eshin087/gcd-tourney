import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root = path.resolve('art/characters/goku');
const rows = [['launched', 6], ['down', 4], ['getup', 3]];
const cell = 256;
const out = new PNG({ width: cell * 9, height: cell * rows.length });
for (let i = 0; i < out.data.length; i += 4) {
  out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 255; out.data[i + 3] = 255;
}
function paste(src, srcX, targetX, targetY) {
  for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) {
    const si = (y * src.width + srcX + x) * 4;
    const di = ((targetY + y) * out.width + targetX + x) * 4;
    out.data[di] = src.data[si]; out.data[di + 1] = src.data[si + 1]; out.data[di + 2] = src.data[si + 2]; out.data[di + 3] = src.data[si + 3];
  }
}
const idle = PNG.sync.read(fs.readFileSync(path.join(root, 'reference/idle_approved.png')));
for (let i = 0; i < rows.length; i++) {
  const [name, version] = rows[i];
  paste(idle, 0, 0, i * cell);
  const file = `${name}_v${String(version).padStart(2, '0')}.png`;
  const raw = path.join(root, 'raw', file);
  const srcPath = fs.existsSync(raw) ? raw : path.join(root, 'raw/_qa_hold', file);
  const src = PNG.sync.read(fs.readFileSync(srcPath));
  const expectedFrames = JSON.parse(fs.readFileSync(path.resolve('art/manifest.json'), 'utf8')).characters.goku.animations[name].frames;
  for (let frame = 0; frame < expectedFrames; frame++) paste(src, frame * cell, (frame + 1) * cell, i * cell);
}
const output = path.join(root, 'production/scale-qa/goku-lowpose-contact-v01.png');
fs.writeFileSync(output, PNG.sync.write(out));
console.log(`${output} (${out.width}x${out.height}); each row begins with approved idle f0, followed by frames in order.`);
