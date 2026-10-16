import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

// Reassembles the two measured pilot sources with a single landmark-derived factor.
// This deliberately does not fit the art to the cell. Candidate sources and outputs are versioned.
const root = process.cwd();
const character = path.join(root, 'art/characters/goku');
const outDir = path.join(character, 'production/reassembly-v01');
const rgba = (r, g, b, a = 255) => [r, g, b, a];
const bg = [255, 0, 255, 255];
const configs = [
  {
    name: 'guard', version: 5, source: 'guard_v04_attempt03.png', previous: 'raw/_qa_hold/guard_v04.png', cols: 2, rows: 1, frames: 2,
    factor: 0.282, uncertainty: 0.030,
    landmarks: {
      method: 'inverse-map of Astra-marked v04 native-control frame 0 through the recorded old grid-to-cells transform; source coordinates are approximate and include prior raster resampling uncertainty',
      sourceFrame0: {
        neckBaseToBeltCenter: { from: [411, 224], to: [425, 387], lengthPx: 164, idleTargetPx: 46, factor: 0.280, uncertaintyPx: 18 },
        beltWidth: { from: [360, 387], to: [492, 387], lengthPx: 132, idleTargetPx: 36, factor: 0.273, uncertaintyPx: 12 },
        leftBootTopToSole: { from: [214, 693], to: [160, 831], lengthPx: 148, idleTargetPx: 45, factor: 0.304, uncertaintyPx: 12 },
      },
      validationFrames: 'guard source frames 0 and 1 show the same broad planted guard; frame 1 has greater arm occlusion, so frame 0 drives the estimate.',
      decision: 'factor is the median of torso, belt and boot ratios. Combined spread and inverse-map uncertainty are about ±0.030; not a numeric pass.'
    },
    description: 'Reassembled from the existing v04 source at the measured idle density; design and approval state unchanged.'
  },
  {
    name: 'light2', version: 5, source: 'light2_v04_attempt05.png', previous: 'raw/light2_v04.png', cols: 4, rows: 2, frames: 7,
    factor: 0.613, uncertainty: 0.075,
    landmarks: {
      method: 'inverse-map of Astra-marked v04 native-control frame 0 through the recorded old grid-to-cells transform; source coordinates are approximate and include prior raster resampling uncertainty',
      sourceFrame0: {
        neckBaseToBeltCenter: { from: [189, 123], to: [190, 198], lengthPx: 75, idleTargetPx: 46, factor: 0.613, uncertaintyPx: 8 },
        beltWidth: { from: [166, 198], to: [224, 198], lengthPx: 58, idleTargetPx: 36, factor: 0.621, uncertaintyPx: 7 },
        leftBootTopToSole: { from: [107, 341], to: [86, 410], lengthPx: 72, idleTargetPx: 45, factor: 0.625, uncertaintyPx: 8 },
      },
      validationFrames: 'the source includes readable guard/recovery frames 0, 1 and 6; belt spans in those rows are approximately 57, 58 and 59 source px. Attack frames turn/foreshorten the torso and are not treated as independent scale measurements.',
      decision: 'factor is the median of frame-0 torso, belt and boot ratios; landmarks agree within about 2%. Endpoint and perspective uncertainty dominate (±0.075); not a numeric pass.'
    },
    description: 'Reassembled from user-approved v04 drawing at measured idle density; this is a uniform calibration candidate, not a new design approval.'
  }
];

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const magenta = (d, i) => d[i] > 160 && d[i + 1] < 100 && d[i + 2] > 160;
function bounds(png, x0, y0, x1, y1) {
  let minX = x1, minY = y1, maxX = -1, maxY = -1;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * png.width + x) * 4;
    if (png.data[i + 3] < 128 || magenta(png.data, i)) continue;
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  if (maxX < 0) throw new Error(`empty source cell ${x0},${y0}`);
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}
function setMagenta(png) {
  for (let i = 0; i < png.data.length; i += 4) png.data.set(bg, i);
}
function blitScaled(source, sourceBounds, destination, frame, factor) {
  const width = Math.ceil(sourceBounds.width * factor), height = Math.ceil(sourceBounds.height * factor);
  const ox = Math.round(128 - (width - 1) / 2), oy = 240 - height + 1;
  const overflow = { left: Math.max(0, -ox), right: Math.max(0, ox + width - 256), top: Math.max(0, -oy), bottom: Math.max(0, oy + height - 256) };
  for (let dy = 0; dy < height; dy++) for (let dx = 0; dx < width; dx++) {
    const sx = sourceBounds.minX + Math.min(sourceBounds.width - 1, Math.floor(dx / factor));
    const sy = sourceBounds.minY + Math.min(sourceBounds.height - 1, Math.floor(dy / factor));
    const si = (sy * source.width + sx) * 4;
    if (source.data[si + 3] < 128 || magenta(source.data, si)) continue;
    const tx = ox + dx, ty = oy + dy;
    if (tx < 0 || tx >= 256 || ty < 0 || ty >= 256) continue;
    const ti = (ty * destination.width + frame * 256 + tx) * 4;
    destination.data.set(source.data.subarray(si, si + 4), ti);
  }
  return { x: ox, y: oy, width, height, overflow };
}
function cellBounds(png, frame) {
  return bounds(png, frame * 256, 0, (frame + 1) * 256, 256);
}

const idlePath = path.join(character, 'raw/idle_v02.png');
const idle = PNG.sync.read(fs.readFileSync(idlePath));
const idleBox = cellBounds(idle, 0);
const idleBeltWidth = 36;
const rows = [];
for (const cfg of configs) {
  const sourcePath = path.join(character, 'production/generation-source', cfg.source);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing source ${sourcePath}`);
  const rawDir = path.join(character, 'raw');
  const holdDir = path.join(rawDir, '_qa_hold');
  const partsDir = path.join(rawDir, '_parts');
  const rejectedDir = path.join(rawDir, '_rejected');
  const namePattern = new RegExp(`^${cfg.name}_v(\\d{2})(?:_|\\.|$)`, 'i');
  const inventoryPaths = [rawDir, partsDir, holdDir, rejectedDir, path.join(character, 'REVIEW_ROWS.md')];
  let highest = 0;
  for (const p of inventoryPaths) {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) for (const f of fs.readdirSync(p)) {
      const m = f.match(namePattern); if (m) highest = Math.max(highest, Number(m[1]));
    }
    else if (fs.existsSync(p)) for (const m of fs.readFileSync(p, 'utf8').matchAll(new RegExp(`\\b${cfg.name}_v(\\d{2})`, 'ig'))) highest = Math.max(highest, Number(m[1]));
  }
  if (cfg.version <= highest) throw new Error(`${cfg.name}: requested v${cfg.version} is not next-free (highest ${highest})`);
  const source = PNG.sync.read(fs.readFileSync(sourcePath));
  const sheet = new PNG({ width: cfg.frames * 256, height: 256 }); setMagenta(sheet);
  const panels = [];
  for (let frame = 0; frame < cfg.frames; frame++) {
    const col = frame % cfg.cols, row = Math.floor(frame / cfg.cols);
    const x0 = Math.floor(col * source.width / cfg.cols), x1 = Math.floor((col + 1) * source.width / cfg.cols);
    const y0 = Math.floor(row * source.height / cfg.rows), y1 = Math.floor((row + 1) * source.height / cfg.rows);
    const b = bounds(source, x0, y0, x1, y1);
    const local = { ...b, minX: b.minX - x0, maxX: b.maxX - x0, minY: b.minY - y0, maxY: b.maxY - y0 };
    const scaled = blitScaled(source, { ...local, minX: local.minX + x0, maxX: local.maxX + x0, minY: local.minY + y0, maxY: local.maxY + y0 }, sheet, frame, cfg.factor);
    const actual = cellBounds(sheet, frame);
    panels.push({ frame, crop: { x0, y0, x1, y1 }, sourceBounds: b, output: scaled, occupied: { ...actual, height: actual.height, width: actual.width } });
  }
  const outFile = path.join(rawDir, `${cfg.name}_v${String(cfg.version).padStart(2, '0')}.png`);
  const sideFile = outFile.replace(/\.png$/, '.json');
  if (fs.existsSync(outFile) || fs.existsSync(sideFile)) throw new Error(`Refusing to overwrite ${outFile}`);
  fs.writeFileSync(outFile, PNG.sync.write(sheet));
  const sidecar = {
    reassembly: {
      measurement: 'manual', factor: cfg.factor, uncertainty: `±${cfg.uncertainty}`,
      reason: 'single common source-to-cell factor measured from stable anatomical landmarks against approved idle v02; no whole-figure fit or pose-specific scaling',
      landmarks: cfg.landmarks,
      source: `art/characters/goku/production/generation-source/${cfg.source}`,
      sourceSha256: sha256(sourcePath),
      previousCandidate: `art/characters/goku/${cfg.previous}`,
      previousSourceTransform: 'The inverse-map used only to express measured landmarks in original-source coordinates; not used to select the new scale.',
      grid: { columns: cfg.cols, rows: cfg.rows, frames: cfg.frames },
      idleReference: { path: 'art/characters/goku/raw/idle_v02.png', sha256: sha256(idlePath), frame: 0, bounds: idleBox, measuredLandmarksPx: { neckBaseToBeltCenter: 46, beltWidth: idleBeltWidth, leftBootTopToSole: 45 } },
      panels,
      review: 'Technical hold pending Claude calibration and pack/contact review; this does not record or imply image approval.'
    }
  };
  fs.writeFileSync(sideFile, JSON.stringify(sidecar, null, 2) + '\n');
  rows.push({ ...cfg, sourcePath: `art/characters/goku/production/generation-source/${cfg.source}`, sourceSha256: sha256(sourcePath), output: `art/characters/goku/raw/${cfg.name}_v${String(cfg.version).padStart(2, '0')}.png`, outputSha256: sha256(outFile), panels });
}

// Contact sheets: approved idle f0 at left, all reassembled frames at one scale, guides at idle top and y=240.
for (const cfg of configs) {
  const file = path.join(character, 'raw', `${cfg.name}_v${String(cfg.version).padStart(2, '0')}.png`);
  const strip = PNG.sync.read(fs.readFileSync(file));
  const contact = new PNG({ width: (cfg.frames + 1) * 256, height: 256 }); setMagenta(contact);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const si = (y * 256 + x) * 4, di = (y * contact.width + x) * 4; contact.data.set(idle.data.subarray(si, si + 4), di);
  }
  for (let f = 0; f < cfg.frames; f++) for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const si = (y * strip.width + f * 256 + x) * 4, di = (y * contact.width + (f + 1) * 256 + x) * 4;
    if (strip.data[si + 3] && !magenta(strip.data, si)) contact.data.set(strip.data.subarray(si, si + 4), di);
  }
  const top = idleBox.minY;
  for (let x = 0; x < contact.width; x++) for (const y of [top, 240]) {
    const i = (y * contact.width + x) * 4; contact.data.set(rgba(65, 235, 255), i);
  }
  const out = path.join(outDir, `${cfg.name}-v${String(cfg.version).padStart(2, '0')}-contact.png`);
  if (fs.existsSync(out)) throw new Error(`Refusing to overwrite ${out}`);
  fs.writeFileSync(out, PNG.sync.write(contact));
}
const manifest = path.join(outDir, 'measurements.json');
if (fs.existsSync(manifest)) throw new Error(`Refusing to overwrite ${manifest}`);
fs.writeFileSync(manifest, JSON.stringify({ label: 'Two pilot reassemblies; estimates carry uncertainty and remain on technical hold.', idleReference: { sha256: sha256(idlePath), beltWidthPx: idleBeltWidth }, strips: rows }, null, 2) + '\n');
console.log(`Wrote ${rows.map((r) => `${r.name} v${String(r.version).padStart(2, '0')}`).join(', ')} and evidence under ${path.relative(root, outDir)}`);
