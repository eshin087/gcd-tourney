// Review-only crop and measurements. The generated source is never altered.
const fs = require('node:fs');
const { PNG } = require('pngjs');
const base = 'art/characters/gojo/';
const src = PNG.sync.read(fs.readFileSync(base + 'reference/model_sheet_v06.png'));
const colors = new Set();
for (let i = 0; i < src.data.length; i += 4) colors.add(src.data.subarray(i, i + 3).toString('hex'));
const crop = new PNG({ width: 350, height: 790 });
PNG.bitblt(src, crop, 1170, 0, 350, 790, 0, 0);
fs.writeFileSync(base + 'reference/model_sheet_v06_view5.png', PNG.sync.write(crop));
const poses = [[60, 335], [365, 610], [685, 830], [905, 1135], [1170, 1460]];
const measurements = poses.map(([lo, hi], view) => {
  let left = 9999, right = -1, top = 9999, bottom = -1;
  for (let y = 150; y < 790; y++) for (let x = lo; x < hi; x++) {
    const i = (y * src.width + x) * 4;
    if (src.data[i] > 200 && src.data[i + 1] < 80 && src.data[i + 2] > 200) continue;
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  return { view: view + 1, left, right, top, bottom, totalHeight: bottom - top + 1, width: right - left + 1 };
});
const report = { source: 'model_sheet_v06.png', width: src.width, height: src.height, rgbColors: colors.size, measurements, note: 'Opaque bounds include hair. They are not skull or anatomical scale measurements.' };
fs.writeFileSync(base + 'production/model_sheet_v06-measurements.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
