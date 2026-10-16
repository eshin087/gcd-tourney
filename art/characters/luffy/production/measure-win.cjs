const fs = require('fs');
const { PNG } = require('pngjs');
const path = require('path');
const file = path.resolve('art/characters/luffy/production/generation-source/win_v03_attempt02_source.png');
const png = PNG.sync.read(fs.readFileSync(file));
const bg = (i) => png.data[i] > 110 && png.data[i + 2] > 110 && png.data[i + 1] < 115 && Math.abs(png.data[i] - png.data[i + 2]) < 100;
const col = new Uint32Array(png.width);
for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
  const i = (y * png.width + x) * 4;
  if (!bg(i)) col[x]++;
}
const spans = [];
let start = -1;
for (let x = 0; x < png.width; x++) {
  if (col[x] >= 3 && start < 0) start = x;
  if ((col[x] < 3 || x === png.width - 1) && start >= 0) {
    const end = col[x] >= 3 && x === png.width - 1 ? x : x - 1;
    if (end - start > 80) spans.push([start, end]);
    start = -1;
  }
}
const frames = spans.map(([x0, x1], k) => {
  let y0 = png.height, y1 = -1, n = 0;
  for (let y = 0; y < png.height; y++) for (let x = x0; x <= x1; x++) {
    const i = (y * png.width + x) * 4;
    if (!bg(i)) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); n++; }
  }
  return { frame: k, x: [x0, x1], y: [y0, y1], width: x1 - x0 + 1, height: y1 - y0 + 1, pixels: n };
});
console.log(JSON.stringify({ size: [png.width, png.height], spans: frames }, null, 2));
