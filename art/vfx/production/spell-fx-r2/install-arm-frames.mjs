import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const cwd = process.cwd();
const dir = path.join(cwd, 'art/vfx/frames/gigantArm');
const backup = path.join(cwd, 'art/vfx/production/spell-fx-r2/references/gigantArm_v01');
const rawPath = path.join(cwd, 'art/vfx/raw/gigantArm_v02.png');
fs.mkdirSync(backup, { recursive: true });
const old = [];
for (let n = 0; n < 2; n++) {
  const name = 'gigantArm_' + String(n).padStart(2, '0') + '.png';
  const source = path.join(dir, name);
  const archived = path.join(backup, name);
  if (!fs.existsSync(source)) throw new Error('Missing previous frame ' + source);
  if (!fs.existsSync(archived)) fs.copyFileSync(source, archived);
  old.push({ name, sha256: crypto.createHash('sha256').update(fs.readFileSync(archived)).digest('hex') });
}
const raw = PNG.sync.read(fs.readFileSync(rawPath));
if (raw.width !== 512 || raw.height !== 256) throw new Error('Expected 512x256 gigantArm v02 strip.');
for (let n = 0; n < 2; n++) {
  const out = new PNG({ width: 256, height: 256 });
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const si = (y * raw.width + (n * 256 + x)) * 4;
    const di = (y * 256 + x) * 4;
    raw.data.copy(out.data, di, si, si + 4);
  }
  fs.writeFileSync(path.join(dir, 'gigantArm_' + String(n).padStart(2, '0') + '.png'), PNG.sync.write(out));
}
const note = {
  candidate: 'gigantArm v02',
  reason: 'The candidate packer selects hand-made art/vfx/frames/gigantArm/ ahead of raw v02, so those two active frame cells now mirror the v02 raw strip.',
  previousV01FramesCopiedTo: 'art/vfx/production/spell-fx-r2/references/gigantArm_v01/',
  previousV01FrameSha256: old,
  activeFrameSource: 'art/vfx/raw/gigantArm_v02.png'
};
const notePath = path.join(backup, 'README.md');
fs.writeFileSync(notePath, '# gigantArm v01 frame preservation\n\n' + JSON.stringify(note, null, 2) + '\n');
console.log(JSON.stringify(note, null, 2));
