import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku/production/reassembly-r03');
const oldDir = path.join(base, 'final4-fixture-crops');
const newDir = path.join(base, 'final5-fixture-crops');
const oldInv = JSON.parse(fs.readFileSync(path.join(oldDir, 'inventory.json'), 'utf8'));
const newInv = JSON.parse(fs.readFileSync(path.join(newDir, 'inventory.json'), 'utf8'));
const compare = (aPath, bPath) => {
  const aBytes = fs.readFileSync(aPath), bBytes = fs.readFileSync(bPath);
  const a = PNG.sync.read(aBytes), b = PNG.sync.read(bBytes);
  if (a.width !== b.width || a.height !== b.height) throw new Error(`dimension mismatch: ${aPath} vs ${bPath}`);
  let maskDiff = 0, rgbDiff = 0, alphaDiff = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const ao = a.data[i + 3] >= 128, bo = b.data[i + 3] >= 128;
    if (ao !== bo) maskDiff++;
    if (a.data[i] !== b.data[i] || a.data[i + 1] !== b.data[i + 1] || a.data[i + 2] !== b.data[i + 2]) rgbDiff++;
    if (a.data[i + 3] !== b.data[i + 3]) alphaDiff++;
  }
  return { maskDiff, rgbDiff, alphaDiff, sourceSha256: crypto.createHash('sha256').update(aBytes).digest('hex'), finalSha256: crypto.createHash('sha256').update(bBytes).digest('hex') };
};
const animations = {};
for (const [name, newAnim] of Object.entries(newInv.animations)) {
  const oldAnim = oldInv.animations[name];
  if (!oldAnim) throw new Error(`final4 is missing ${name}`);
  if (oldAnim.frames.length !== newAnim.frames.length) throw new Error(`frame count differs for ${name}`);
  animations[name] = newAnim.frames.map((frame, i) => ({ frame: i, ...compare(path.join(oldDir, frame.path), path.join(newDir, frame.path)) }));
}
const result = {
  label: 'Per-frame mask and RGB comparison between Astra-audited final4 and strict final5 selected atlas.',
  final4AtlasSha256: oldInv.atlasSha256,
  final4MetadataSha256: oldInv.metadataSha256,
  final5AtlasSha256: newInv.atlasSha256,
  final5MetadataSha256: newInv.metadataSha256,
  animationCount: Object.keys(animations).length,
  frameCount: Object.values(animations).reduce((n, rows) => n + rows.length, 0),
  maskDifferentPixels: Object.values(animations).flat().reduce((n, f) => n + f.maskDiff, 0),
  rgbDifferentPixels: Object.values(animations).flat().reduce((n, f) => n + f.rgbDiff, 0),
  alphaDifferentPixels: Object.values(animations).flat().reduce((n, f) => n + f.alphaDiff, 0),
  animations
};
fs.writeFileSync(path.join(base, 'final4-final5-mask-comparison.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ animationCount: result.animationCount, frameCount: result.frameCount, maskDifferentPixels: result.maskDifferentPixels, rgbDifferentPixels: result.rgbDifferentPixels, alphaDifferentPixels: result.alphaDifferentPixels }, null, 2));
