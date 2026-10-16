// Read-only source diagnostic. Writes only this audit directory; never invokes a pack or changes a gate.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readPng, encodePng, newImage, crop, blit, bbox, removeBackground, removeSpecks, dropStrays, figureSplit, resample, placeCharFrame, quantizeFrames } from '../../../../../tools/pack-sprites.mjs';
const out = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(out, '../../../../..');
const char = path.join(root, 'art/characters/luffy');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'art/manifest.json')));
const defs = manifest.characters.luffy.animations;
const spec = { frameWidth: 256, frameHeight: 256, pivot: [128, 240], cellMargin: 4 };
const selected = { idle: 1, guard: 1, charge: 1, land: 1, jumpUp: 1, jumpFall: 3, dash: 2, run: 1, light2: 1, light3: 2, airLight1: 1, airHeavy: 1, hurtHigh: 1, beamCharge: 1, light4: 2, win: 2 };
const records = [];
const all = [];
for (const [name, version] of Object.entries(selected)) {
  const filename = `${name}_v${String(version).padStart(2, '0')}.png`;
  let source = path.join(char, 'raw', filename);
  if (!fs.existsSync(source)) source = path.join(char, 'raw/_qa_hold', filename);
  const sidePath = source.replace(/\.png$/, '.json');
  const side = fs.existsSync(sidePath) ? JSON.parse(fs.readFileSync(sidePath)) : {};
  if (side.anatomy) throw new Error(`${name}: anatomy sidecar requires explicit diagnostic implementation`);
  const im = readPng(source);
  removeBackground(im, { tol: side.tolerance ?? side.tol ?? 72, mode: 'char' });
  removeSpecks(im);
  const figures = figureSplit(im, defs[name].frames);
  if (!figures || figures.length !== defs[name].frames) throw new Error(`${name}: cannot isolate exact whole figures`);
  const trimmed = figures.map(im => { dropStrays(im); const b = bbox(im); return crop(im, b.x0, b.y0, b.w, b.h); });
  const maxH = Math.max(...trimmed.map(im => im.h));
  const target = Math.min(237, side.bodyHeight ?? defs[name].bodyHeight);
  const scale = Math.abs(maxH - target) <= 1 ? 1 : target / maxH;
  const record = { name, version, source: path.relative(root, source).replaceAll('\\', '/'), sha256: hash(source), sidecarSha256: fs.existsSync(sidePath) ? hash(sidePath) : null, bodyHeight: target, sourceMaxHeight: maxH, scale, split: 'whole figures, exact expected count', frames: [] };
  trimmed.forEach((im, f) => {
    const small = resample(im, scale, { coverage: 0.5, alphaMin: 128 });
    const placed = placeCharFrame(small, spec, side.frameOffsets?.[f]);
    const item = { frame: f, sourceTrim: [im.w, im.h], normalizedSize: [small.w, small.h], lostPixels: placed.lost, clip: placed.clip, margin: placed.margin, occupied: bbox(placed.cell) };
    record.frames.push(item);
    all.push({ name, version, f, cell: placed.cell, full: small, item });
  });
  records.push(record);
}
// Shared diagnostic palette, independent of any production pack's selected inventory.
quantizeFrames(all.map(x => x.cell), 48);
const refPath = path.join(char, 'reference/title_style_draft.png');
const ref = readPng(refPath);
removeBackground(ref);
const anchors = [0, 1448].map(x => resample(crop(ref, x, 0, 724, 724), 256 / 724, { coverage: 0.5, alphaMin: 128 }));
anchors.push(all.find(x => x.name === 'idle' && x.f === 0).cell);
for (const [i, im] of anchors.entries()) fs.writeFileSync(path.join(out, ['neutral.png', 'combat.png', 'idle-f0.png'][i]), encodePng(im));
for (const record of records) {
  const own = all.filter(x => x.name === record.name);
  for (const item of own) {
    const stem = `${record.name}-v${String(record.version).padStart(2, '0')}-f${item.f}`;
    fs.writeFileSync(path.join(out, `${stem}.png`), encodePng(item.cell));
    fs.writeFileSync(path.join(out, `${stem}-unclipped.png`), encodePng(item.full));
    item.item.cellSha256 = hash(path.join(out, `${stem}.png`));
  }
  for (let start = 0; start < own.length; start += 4) {
    const chunk = own.slice(start, start + 4);
    const comparison = newImage(256 * (3 + chunk.length), 256);
    anchors.forEach((im, i) => blit(comparison, im, i * 256, 0));
    chunk.forEach((item, i) => blit(comparison, item.cell, (i + 3) * 256, 0));
    fs.writeFileSync(path.join(out, `${record.name}-v${String(record.version).padStart(2, '0')}-compare-${start}.png`), encodePng(comparison));
  }
}
fs.writeFileSync(path.join(out, 'inventory.json'), JSON.stringify({ diagnosticOnly: true, method: 'Whole-figure extraction; existing bodyHeight and offsets; resample and placement from packer; 48-color diagnostic palette; no gate or public output; not a production pack certification', manifestSha256: hash(path.join(root, 'art/manifest.json')), referenceSha256: hash(refPath), records }, null, 2) + '\n');
console.log(JSON.stringify(records.map(r => ({ name: r.name, version: r.version, scale: r.scale, clips: r.frames.filter(f => f.lostPixels).map(f => ({ frame: f.frame, clip: f.clip })) })), null, 2));
