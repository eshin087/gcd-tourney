import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd(), goku = path.join(root, 'art/characters/goku');
const raw = path.join(goku, 'raw/_qa_hold'), out = path.join(goku, 'production/reassembly-r03/roomy');
const candidates = ['run_v06', 'dash_v07', 'land_v07', 'light4_v06', 'heavy_v08', 'getup_v08', 'light3_v07'];
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const mag = (d, i) => d[i] > 160 && d[i + 1] < 100 && d[i + 2] > 160;
fs.mkdirSync(out, { recursive: true });
const summary = [];
for (const key of candidates) {
  const jsonPath = path.join(raw, `${key}.json`), record = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const sourcePath = path.join(root, record.sourcePath.replaceAll('\\', '/'));
  const source = PNG.sync.read(fs.readFileSync(sourcePath)), factor = record.selectedFactor;
  const made = [];
  for (const f of record.frames) {
    const [x0, y0, x1, y1] = f.sourceRect, b = f.sourceBounds;
    const w = Math.ceil(b.width * factor), h = Math.ceil(b.height * factor);
    const image = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const sx = b.minX + Math.min(b.width - 1, Math.floor(x / factor));
      const sy = b.minY + Math.min(b.height - 1, Math.floor(y / factor));
      if (sx < x0 || sx >= x1 || sy < y0 || sy >= y1) continue;
      const si = (sy * source.width + sx) * 4;
      if (source.data[si + 3] < 128 || mag(source.data, si)) continue;
      image.data.set(source.data.subarray(si, si + 4), (y * w + x) * 4);
    }
    made.push({ frame: f.frame, image, width: w, height: h, nativeHeight: h });
  }
  const gap = 8, contactW = made.reduce((n, f) => n + f.width, gap * (made.length - 1)), contactH = Math.max(...made.map((f) => f.height));
  const contact = new PNG({ width: contactW, height: contactH });
  for (let i = 0; i < contact.data.length; i += 4) contact.data.set([255, 0, 255, 255], i);
  const frames = []; let cursor = 0;
  for (const f of made) {
    const individual = path.join(out, `${key}-f${String(f.frame).padStart(2, '0')}.png`);
    const individualBytes = PNG.sync.write(f.image); fs.writeFileSync(individual, individualBytes);
    const yoff = contactH - f.height;
    for (let y = 0; y < f.height; y++) contact.data.set(f.image.data.subarray(y * f.width * 4, (y + 1) * f.width * 4), ((yoff + y) * contactW + cursor) * 4);
    frames.push({ frame: f.frame, dimensions: [f.width, f.height], nativeHeight: f.nativeHeight, path: path.relative(root, individual).replaceAll('\\', '/'), sha256: hash(individualBytes) });
    cursor += f.width + gap;
  }
  const contactPath = path.join(out, `${key}-contact.png`), contactBytes = PNG.sync.write(contact); fs.writeFileSync(contactPath, contactBytes);
  const row = { animation: record.animation, version: record.version, factor, sourcePath: record.sourcePath, sourceSha256: record.sourceSha256, standardStrip: record.outputPath, standardStripSha256: record.outputSha256, standardStripLostSourcePixels: record.frames.reduce((n, f) => n + f.lost, 0), method: 'unclipped nearest-neighbor diagnostic rendering from exact per-frame source rectangles; no palette quantization, no approval, not pack-ready', frames, contactPath: path.relative(root, contactPath).replaceAll('\\', '/'), contactSha256: hash(contactBytes) };
  fs.writeFileSync(path.join(out, `${key}.json`), JSON.stringify(row, null, 2) + '\n'); summary.push(row);
}
fs.writeFileSync(path.join(out, 'inventory.json'), JSON.stringify({ label: 'R03 roomy source-scale diagnostic gallery; complete per selected source rectangles, separate from 256x256 quantized fixture.', candidates: summary }, null, 2) + '\n');
console.log(JSON.stringify(summary.map(({ animation, version, factor, standardStripLostSourcePixels, contactPath, contactSha256 }) => ({ animation, version, factor, standardStripLostSourcePixels, contactPath, contactSha256 })), null, 2));
