import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const isMagenta = (data, i) => data[i] > 160 && data[i + 1] < 100 && data[i + 2] > 160;

const [input, output, colsText, rowsText, framesText] = process.argv.slice(2);
if (!input || !output || !colsText || !rowsText || !framesText) {
  throw new Error('usage: node grid-to-cells.mjs input.png output.png cols rows frames');
}
const cols = Number(colsText), rows = Number(rowsText), frames = Number(framesText);
const src = PNG.sync.read(fs.readFileSync(input));
if (cols * rows < frames || src.width < cols || src.height < rows) throw new Error('grid does not fit source');
const cellW = src.width / cols, cellH = src.height / rows;
const out = new PNG({ width: frames * 256, height: 256 });
for (let i = 0; i < out.data.length; i += 4) {
  out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 255; out.data[i + 3] = 255;
}
const linePositions = (vertical) => {
  const length = vertical ? src.height : src.width;
  const count = vertical ? src.width : src.height;
  const ratios = new Array(count).fill(0);
  for (let p = 0; p < count; p++) {
    let dark = 0;
    for (let q = 0; q < length; q++) {
      const i = vertical ? (q * src.width + p) * 4 : (p * src.width + q) * 4;
      if (src.data[i] < 230 && src.data[i + 1] < 80 && src.data[i + 2] < 230) dark++;
    }
    ratios[p] = dark / length;
  }
  const strong = new Set(ratios.flatMap((r, i) => r > 0.8 ? [i] : []));
  const lines = new Set(strong);
  for (const p of strong) for (let d = -2; d <= 2; d++) {
    const n = p + d;
    if (n >= 0 && n < count && ratios[n] > 0.2) lines.add(n);
  }
  return lines;
};
const separatorX = linePositions(true), separatorY = linePositions(false);
const isDivider = (x, y) => separatorX.has(x) || separatorY.has(y);
const regions = [];
let widest = 0, tallest = 0;
for (let frame = 0; frame < frames; frame++) {
  const gx = frame % cols, gy = Math.floor(frame / cols);
  const x0 = Math.floor(gx * cellW), x1 = Math.floor((gx + 1) * cellW);
  const y0 = Math.floor(gy * cellH), y1 = Math.floor((gy + 1) * cellH);
  let minX = x1, minY = y1, maxX = -1, maxY = -1;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const k = (y * src.width + x) * 4;
    if (isMagenta(src.data, k) || isDivider(x, y)) continue;
    const lx = x - x0, ly = y - y0;
    minX = Math.min(minX, lx); minY = Math.min(minY, ly);
    maxX = Math.max(maxX, lx); maxY = Math.max(maxY, ly);
  }
  if (maxX < 0) throw new Error(`frame ${frame} has no figure`);
  widest = Math.max(widest, maxX - minX + 1);
  tallest = Math.max(tallest, maxY - minY + 1);
  regions.push({ gx, gy, x0, x1, y0, y1, minX, minY, maxX, maxY });
}
// One common scale per strip fits the largest complete figure in every pose. This uses the drawn subject bounds
// rather than blank generator panel margins, and never changes scale pose by pose.
const scale = Math.min(240 / tallest, 248 / widest);
const details = [];
for (let frame = 0; frame < frames; frame++) {
  const { gx, gy, x0, x1, y0, y1, minX, minY, maxX, maxY } = regions[frame];
  const ox = Math.round(128 - ((minX + maxX) / 2) * scale);
  const oy = Math.round(240 - maxY * scale);
  const sw = Math.ceil((x1 - x0) * scale), sh = Math.ceil((y1 - y0) * scale);
  let transformed = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (let dy = 0; dy < sh; dy++) for (let dx = 0; dx < sw; dx++) {
    const tx = ox + dx, ty = oy + dy;
    if (tx < 0 || tx >= 256 || ty < 0 || ty >= 256) continue;
    const sx = x0 + Math.min(x1 - x0 - 1, Math.floor(dx / scale));
    const sy = y0 + Math.min(y1 - y0 - 1, Math.floor(dy / scale));
    const si = (sy * src.width + sx) * 4;
    if (isMagenta(src.data, si) || isDivider(sx, sy)) continue;
    const oi = (ty * out.width + frame * 256 + tx) * 4;
    out.data[oi] = src.data[si]; out.data[oi + 1] = src.data[si + 1]; out.data[oi + 2] = src.data[si + 2]; out.data[oi + 3] = 255;
    if (!isMagenta(src.data, si) && !isDivider(sx, sy)) {
      transformed.minX = Math.min(transformed.minX, tx); transformed.minY = Math.min(transformed.minY, ty);
      transformed.maxX = Math.max(transformed.maxX, tx); transformed.maxY = Math.max(transformed.maxY, ty);
    }
  }
  details.push({ frame, grid: [gx, gy], inputBounds: [minX, minY, maxX, maxY], scale, pivotShift: [ox, oy], outputBounds: [transformed.minX, transformed.minY, transformed.maxX, transformed.maxY] });
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, PNG.sync.write(out));
console.log(JSON.stringify({ input: src.width + 'x' + src.height, output: out.width + 'x' + out.height, scale, frames: details }, null, 2));
