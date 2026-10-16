// Scratch-only: per frame, the hat top (topmost row with >= 3 straw-yellow pixels, the hat's main shade #fbbd51 within
// RGB distance 30) and the lowest opaque row; reports hat-top-to-sole height and the hat's widest row (brim width).
const fs = require('fs'), path = require('path');
const { PNG } = require(path.resolve('node_modules/pngjs'));
const [dir, list] = process.argv.slice(2);
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'anims.json'), 'utf8'));
const sh = PNG.sync.read(fs.readFileSync(path.join(dir, 'sheet.png')));
const C = 256, cols = sh.width / C, straw = [0xfb, 0xbd, 0x51];
const near = (d, i) => Math.hypot(d[i] - straw[0], d[i + 1] - straw[1], d[i + 2] - straw[2]) < 30;
function measure(fr) {
  const ox = (fr % cols) * C, oy = Math.floor(fr / cols) * C;
  let hatTop = null, sole = null, brim = 0;
  for (let y = 0; y < C; y++) {
    let n = 0, x0 = C, x1 = -1, any = false;
    for (let x = 0; x < C; x++) {
      const i = ((oy + y) * sh.width + ox + x) * 4;
      if (sh.data[i + 3] < 128) continue;
      any = true;
      if (near(sh.data, i)) { n++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
    }
    if (any) sole = y;
    if (n >= 3 && hatTop == null) hatTop = y;
    if (hatTop != null && y < hatTop + 30 && n >= 3) brim = Math.max(brim, x1 - x0 + 1);
  }
  return { h: hatTop == null ? null : sole - hatTop + 1, brim };
}
for (const n of list.split(',')) {
  const r = meta.animations[n].frames.map(measure);
  console.log(n.padEnd(11), r.map((m) => `${m.h ?? '-'}/${m.brim}`).join(' '));
}
