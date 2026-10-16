const fs = require('node:fs');
const path = require('node:path');
const { PNG } = require('pngjs');
const root = process.cwd();
const input = path.join(root, 'art/characters/luffy/production/relay11-generation/quantized-r6/characters/luffy');
const out = path.join(root, 'public/characters/luffy/calibration-r6');
const atlas = PNG.sync.read(fs.readFileSync(path.join(input, 'sheet.png')));
const meta = JSON.parse(fs.readFileSync(path.join(input, 'anims.json'), 'utf8'));
const frames = meta.animations.special.frames;
const durations = meta.animations.special.durations;
const cells = [];
for (let i = 0; i < frames.length; i++) {
  const n = frames[i], cell = new PNG({ width: 256, height: 256 });
  const sx = (n % 16) * 256, sy = Math.floor(n / 16) * 256;
  for (let y = 0; y < 256; y++) {
    const src = ((sy + y) * atlas.width + sx) * 4;
    const dst = y * 256 * 4;
    atlas.data.copy(cell.data, dst, src, src + 256 * 4);
  }
  const name = `special-${String(i).padStart(2, '0')}.png`;
  fs.writeFileSync(path.join(out, 'cells', name), PNG.sync.write(cell));
  cells.push(name);
}
const contact = new PNG({ width: 4 * 256 + 5 * 12, height: 2 * 256 + 3 * 12 });
for (let p = 0; p < contact.data.length; p += 4) { contact.data[p] = 255; contact.data[p+1] = 0; contact.data[p+2] = 255; contact.data[p+3] = 255; }
for (let i = 0; i < cells.length; i++) {
  const cell = PNG.sync.read(fs.readFileSync(path.join(out, 'cells', cells[i])));
  const x = 12 + (i % 4) * (256 + 12), y = 12 + Math.floor(i / 4) * (256 + 12);
  for (let yy = 0; yy < 256; yy++) cell.data.copy(contact.data, ((y + yy) * contact.width + x) * 4, yy * 256 * 4, (yy + 1) * 256 * 4);
}
fs.writeFileSync(path.join(out, 'special-contact-native.png'), PNG.sync.write(contact));
fs.writeFileSync(path.join(out, 'frames.json'), JSON.stringify({ sourceAtlas: 'diagnostic-only', frames: cells, durations, loop: meta.animations.special.loop, atlasFrameIndices: frames }, null, 2));
