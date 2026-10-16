// Scratch-only contact sheet: idle f0 then every frame of each strip, native cells at `S` scale, guide lines at the
// idle's top (hat) and the floor (y 240), so a size change between strips is visible at one density.
const fs = require('fs'), path = require('path');
const { PNG } = require(path.resolve('node_modules/pngjs'));
const [dir, out, list] = process.argv.slice(2);
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'anims.json'), 'utf8'));
const sheet = PNG.sync.read(fs.readFileSync(path.join(dir, 'sheet.png')));
const C = 256, cols = sheet.width / C, S = 0.5, cw = C * S;
const names = list.split(',');
const maxN = Math.max(...names.map((n) => meta.animations[n].frames.length)) + 1;
const img = new PNG({ width: maxN * cw, height: names.length * cw });
img.data.fill(255);
const cell = (fr, cx, cy) => {
  const ox = (fr % cols) * C, oy = Math.floor(fr / cols) * C;
  for (let y = 0; y < cw; y++) for (let x = 0; x < cw; x++) {
    const sx = ox + Math.floor(x / S), sy = oy + Math.floor(y / S), si = (sy * sheet.width + sx) * 4;
    const di = ((cy + y) * img.width + cx + x) * 4;
    const a = sheet.data[si + 3];
    if (a >= 128) { img.data[di] = sheet.data[si]; img.data[di + 1] = sheet.data[si + 1]; img.data[di + 2] = sheet.data[si + 2]; }
    else if ((cx / cw) % 2) { img.data[di] = 240; img.data[di + 1] = 240; img.data[di + 2] = 246; }
  }
};
// idle top row
const idle0 = meta.animations.idle.frames[0];
let top = C;
{ const ox = (idle0 % cols) * C, oy = Math.floor(idle0 / cols) * C;
  for (let y = 0; y < C && top === C; y++) for (let x = 0; x < C; x++) if (sheet.data[((oy + y) * sheet.width + ox + x) * 4 + 3] >= 128) { top = y; break; } }
names.forEach((n, r) => {
  cell(idle0, 0, r * cw);
  meta.animations[n].frames.forEach((fr, k) => cell(fr, (k + 1) * cw, r * cw));
  for (const gy of [Math.round(top * S), Math.round(240 * S)]) for (let x = 0; x < img.width; x++) {
    const di = ((r * cw + gy) * img.width + x) * 4; img.data[di] = 255; img.data[di + 1] = 0; img.data[di + 2] = 0;
  }
});
fs.writeFileSync(out, PNG.sync.write(img));
console.log(out, img.width, img.height, 'idle top', top);
