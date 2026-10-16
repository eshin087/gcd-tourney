const fs = require('fs');
const { PNG } = require('pngjs');
for (const name of ['down', 'getup']) {
  const p = `art/characters/luffy/raw/_qa_hold/${name}_v01.png`;
  const b = PNG.sync.read(fs.readFileSync(p));
  const frames = name === 'down' ? 2 : 5;
  const cellW = b.width / frames;
  console.log(name, b.width, b.height, 'cell', cellW, b.height);
  for (let f = 0; f < frames; f++) {
    let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1, count = 0;
    for (let y = 0; y < b.height; y++) for (let x = f * cellW; x < (f + 1) * cellW; x++) {
      const k = (y * b.width + x) * 4, r = b.data[k], g = b.data[k + 1], bl = b.data[k + 2], a = b.data[k + 3];
      if (a > 0 && !(r > 170 && bl > 170 && g < 100)) {
        const lx = x - f * cellW;
        minX = Math.min(minX, lx); maxX = Math.max(maxX, lx); minY = Math.min(minY, y); maxY = Math.max(maxY, y); count++;
      }
    }
    console.log({ frame: f, nonBg: count, bounds: [minX, minY, maxX, maxY], rightMargin: cellW - 1 - maxX, leftMargin: minX, bottomMargin: b.height - 1 - maxY });
  }
}
