import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku/production/scale-qa/pilot-v01/fixture-output');
const modes = ['current', 'native-height'];
const names = ['guard', 'light2'];
const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const magenta = (p, i) => p.data[i] > 160 && p.data[i + 1] < 100 && p.data[i + 2] > 160;
function bounds(png) {
  let x0 = png.width, y0 = png.height, x1 = -1, y1 = -1;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
    const i = (y * png.width + x) * 4;
    if (!png.data[i + 3] || magenta(png, i)) continue;
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  return { x0, y0, x1, y1, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}
function cropAtlas(atlas, index) {
  const out = new PNG({ width: 256, height: 256 });
  const ox = index % 16 * 256, oy = Math.floor(index / 16) * 256;
  for (let y = 0; y < 256; y++) {
    const si = ((oy + y) * atlas.width + ox) * 4;
    out.data.set(atlas.data.subarray(si, si + 256 * 4), y * 256 * 4);
  }
  return out;
}
function contact(cells, idleCell, output) {
  const p = new PNG({ width: (cells.length + 1) * 256, height: 256 });
  for (let i = 0; i < p.data.length; i += 4) p.data.set([255, 0, 255, 255], i);
  const put = (img, col) => {
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const si = (y * 256 + x) * 4, di = (y * p.width + col * 256 + x) * 4;
      if (img.data[si + 3] && !magenta(img, si)) p.data.set(img.data.subarray(si, si + 4), di);
    }
  };
  put(idleCell, 0);
  cells.forEach((c, i) => put(c, i + 1));
  // The idle's hair top and canonical sole guide.
  for (let x = 0; x < p.width; x++) for (const y of [14, 240]) p.data.set([65, 235, 255, 255], (y * p.width + x) * 4);
  fs.writeFileSync(output, PNG.sync.write(p));
}
const evidence = { label: 'Exact 256x256 crops from 48-color quantized diagnostic atlases; neither mode is a production pass.', modes: {} };
for (const mode of modes) {
  const dir = path.join(base, mode);
  const atlasFile = path.join(dir, 'characters/goku/sheet.png');
  const metaFile = path.join(dir, 'characters/goku/anims.json');
  const atlasBytes = fs.readFileSync(atlasFile), atlas = PNG.sync.read(atlasBytes), meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  const idleIndex = meta.animations.idle.frames[0];
  const idleCell = cropAtlas(atlas, idleIndex);
  const idleOut = path.join(dir, 'frames/idle/f00.png');
  fs.mkdirSync(path.dirname(idleOut), { recursive: true });
  fs.writeFileSync(idleOut, PNG.sync.write(idleCell));
  const modeRecord = { sheet: path.relative(root, atlasFile).replaceAll('\\', '/'), sheetSha256: hash(atlasBytes), metadata: path.relative(root, metaFile).replaceAll('\\', '/'), metadataSha256: hash(fs.readFileSync(metaFile)), idle: { frame: 0, frameIndex: idleIndex, path: path.relative(root, idleOut).replaceAll('\\', '/'), sha256: hash(fs.readFileSync(idleOut)), bounds: bounds(idleCell), durationMs: meta.animations.idle.durations[0], loop: meta.animations.idle.loop }, animations: {} };
  for (const name of names) {
    const anim = meta.animations[name];
    const cells = [];
    const framesDir = path.join(dir, 'frames', name);
    fs.mkdirSync(framesDir, { recursive: true });
    for (let f = 0; f < anim.frames.length; f++) {
      const index = anim.frames[f], cell = cropAtlas(atlas, index), filename = `f${String(f).padStart(2, '0')}.png`, file = path.join(framesDir, filename);
      fs.writeFileSync(file, PNG.sync.write(cell));
      cells.push({ frame: f, atlasIndex: index, durationMs: anim.durations[f], path: path.relative(root, file).replaceAll('\\', '/'), sha256: hash(fs.readFileSync(file)), bounds: bounds(cell) });
    }
    const contactFile = path.join(dir, 'contacts', `${name}-one-density.png`);
    fs.mkdirSync(path.dirname(contactFile), { recursive: true });
    contact(cells.map((f) => PNG.sync.read(fs.readFileSync(path.join(root, f.path)))), idleCell, contactFile);
    modeRecord.animations[name] = { loop: anim.loop, durationsMs: anim.durations, frames: cells, contact: path.relative(root, contactFile).replaceAll('\\', '/'), contactSha256: hash(fs.readFileSync(contactFile)) };
  }
  evidence.modes[mode] = modeRecord;
}

const refDir = path.join(base, 'references');
const refIdle = PNG.sync.read(fs.readFileSync(path.join(base, 'current/frames/idle/f00.png')));
const approvedCells = PNG.sync.read(fs.readFileSync(path.join(root, 'art/characters/goku/reference/title_style_draft.png')));
const neutral = new PNG({ width: 256, height: 256 }), combat = new PNG({ width: 256, height: 256 });
for (let y = 0; y < 256; y++) {
  neutral.data.set(approvedCells.data.subarray(y * 512 * 4, y * 512 * 4 + 256 * 4), y * 256 * 4);
  combat.data.set(approvedCells.data.subarray((y * 512 + 256) * 4, (y * 512 + 512) * 4), y * 256 * 4);
}
for (const [name, image] of [['title-neutral-v02.png', neutral], ['title-combat-v02.png', combat]]) {
  const file = path.join(refDir, name);
  fs.writeFileSync(file, PNG.sync.write(image));
}
const refContact = new PNG({ width: 3 * 256, height: 256 });
for (let i = 0; i < refContact.data.length; i += 4) refContact.data.set([255, 0, 255, 255], i);
for (const [col, image] of [[0, refIdle], [1, neutral], [2, combat]]) for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
  const si = (y * 256 + x) * 4, di = (y * refContact.width + col * 256 + x) * 4;
  if (image.data[si + 3] && !magenta(image, si)) refContact.data.set(image.data.subarray(si, si + 4), di);
}
for (let x = 0; x < refContact.width; x++) for (const y of [14, 240]) refContact.data.set([65, 235, 255, 255], (y * refContact.width + x) * 4);
const refContactFile = path.join(base, 'contacts/approved-reference-lineup.png');
fs.mkdirSync(path.dirname(refContactFile), { recursive: true });
fs.writeFileSync(refContactFile, PNG.sync.write(refContact));
evidence.approvedComparison = {
  idleSource: { path: 'art/characters/goku/raw/idle_v02.png', sha256: hash(fs.readFileSync(path.join(root, 'art/characters/goku/raw/idle_v02.png'))) },
  approvedFixedIdle: { path: 'art/characters/goku/reference/idle_approved.png', sha256: hash(fs.readFileSync(path.join(root, 'art/characters/goku/reference/idle_approved.png'))) },
  titleStyleSource: { path: 'art/characters/goku/reference/title_style_draft.png', sha256: hash(fs.readFileSync(path.join(root, 'art/characters/goku/reference/title_style_draft.png'))), split: 'first 256x256 neutral, second 256x256 combat' },
  titleLineup: { path: 'art/characters/goku/reference/title_style_lineup_v02.png', sha256: hash(fs.readFileSync(path.join(root, 'art/characters/goku/reference/title_style_lineup_v02.png'))) },
  extractedCells: ['references/title-neutral-v02.png', 'references/title-combat-v02.png'],
  contact: path.relative(root, refContactFile).replaceAll('\\', '/'),
  contactSha256: hash(fs.readFileSync(refContactFile))
};
fs.writeFileSync(path.join(base, 'packed-frames.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ outputs: Object.fromEntries(Object.entries(evidence.modes).map(([mode, x]) => [mode, Object.fromEntries(Object.entries(x.animations).map(([name, a]) => [name, { contact: a.contact, hashes: a.frames.map((f) => f.sha256), durations: a.durationsMs, loop: a.loop }]))])), references: evidence.approvedComparison }, null, 2));
