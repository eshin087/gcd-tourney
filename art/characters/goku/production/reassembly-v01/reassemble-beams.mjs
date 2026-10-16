import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku');
const outDir = path.join(base, 'production/reassembly-v01');
const qaDir = path.join(base, 'production/scale-qa/reassembly-v01');
const idleFile = path.join(base, 'raw/idle_v02.png');
const bg = [255, 0, 255, 255];
const configs = [
  {
    name: 'beamCharge', source: 'beamCharge_v04_attempt03.png', previous: 'raw/_qa_hold/beamCharge_v04.png', factor: 0.320, uncertainty: 0.040,
    endpoints: {
      eyeToChin: { from: [407, 145], to: [438, 185], sourceLengthPx: 51, idleLengthPx: 17, ratio: 0.333, uncertaintyPx: 8 },
      leftBootTopToSole: { from: [133, 535], to: [97, 660], sourceLengthPx: 130, idleLengthPx: 40, ratio: 0.308, uncertaintyPx: 12 },
      note: 'Direct inspection/marking on original 724x724 panel 0. Measurements are approximate projected spans; boot axis is diagonal and face is three-quarter view. Ratios are independent checks, not a numeric pass.'
    }
  },
  {
    name: 'beamFire', source: 'beamFire_v04_attempt03.png', previous: 'raw/_qa_hold/beamFire_v04.png', factor: 0.320, uncertainty: 0.045,
    endpoints: {
      eyeToChin: { from: [365, 145], to: [397, 184], sourceLengthPx: 50, idleLengthPx: 17, ratio: 0.333, uncertaintyPx: 8 },
      leftBootTopToSole: { from: [134, 535], to: [97, 660], sourceLengthPx: 130, idleLengthPx: 40, ratio: 0.308, uncertaintyPx: 12 },
      note: 'Direct inspection/marking on original 724x724 panel 0. Measurements are approximate projected spans; boot axis is diagonal and face is three-quarter view. Ratios are independent checks, not a numeric pass.'
    }
  }
];
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const magenta = (p, i) => p.data[i] > 160 && p.data[i + 1] < 100 && p.data[i + 2] > 160;
function bounds(p, x0, y0, x1, y1) {
  let minX = x1, minY = y1, maxX = -1, maxY = -1;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * p.width + x) * 4;
    if (p.data[i + 3] < 128 || magenta(p, i)) continue;
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  if (maxX < 0) throw new Error(`empty panel ${x0},${y0}`);
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}
function line(p, a, b, color) {
  let [x0, y0] = a, [x1, y1] = b;
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    for (let oy = -2; oy <= 2; oy++) for (let ox = -2; ox <= 2; ox++) {
      const x = x0 + ox, y = y0 + oy;
      if (x < 0 || x >= p.width || y < 0 || y >= p.height) continue;
      p.data.set(color, (y * p.width + x) * 4);
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}
function scaledBlit(src, b, dst, frame, factor) {
  const w = Math.ceil(b.width * factor), h = Math.ceil(b.height * factor);
  const ox = Math.round(128 - (w - 1) / 2), oy = 240 - h + 1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = b.minX + Math.min(b.width - 1, Math.floor(x / factor));
    const sy = b.minY + Math.min(b.height - 1, Math.floor(y / factor));
    const si = (sy * src.width + sx) * 4;
    if (src.data[si + 3] < 128 || magenta(src, si)) continue;
    const tx = ox + x, ty = oy + y;
    if (tx < 0 || tx >= 256 || ty < 0 || ty >= 256) continue;
    dst.data.set(src.data.subarray(si, si + 4), (ty * dst.width + frame * 256 + tx) * 4);
  }
  return { x: ox, y: oy, width: w, height: h, overflow: { left: Math.max(0, -ox), right: Math.max(0, ox + w - 256), top: Math.max(0, -oy), bottom: Math.max(0, oy + h - 256) } };
}
function inventoryNext(name) {
  const dirs = ['raw', 'raw/_parts', 'raw/_qa_hold', 'raw/_rejected'];
  let high = 0;
  for (const rel of dirs) {
    const d = path.join(base, rel);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      const m = f.match(new RegExp(`^${name}_v(\\d{2})(?:_|\\.|$)`, 'i'));
      if (m) high = Math.max(high, Number(m[1]));
    }
  }
  const review = path.join(base, 'REVIEW_ROWS.md');
  if (fs.existsSync(review)) for (const m of fs.readFileSync(review, 'utf8').matchAll(new RegExp(`\\b${name}_v(\\d{2})`, 'ig'))) high = Math.max(high, Number(m[1]));
  return high + 1;
}
const idle = PNG.sync.read(fs.readFileSync(idleFile));
const idleHash = sha(idleFile);
fs.mkdirSync(qaDir, { recursive: true });
const rows = [];
for (const c of configs) {
  const version = inventoryNext(c.name);
  const sourceFile = path.join(base, 'production/generation-source', c.source);
  const source = PNG.sync.read(fs.readFileSync(sourceFile));
  if (source.width !== 2172 || source.height !== 724) throw new Error(`${c.name}: unexpected source dimensions ${source.width}x${source.height}`);
  const strip = new PNG({ width: 3 * 256, height: 256 });
  for (let i = 0; i < strip.data.length; i += 4) strip.data.set(bg, i);
  const panels = [];
  for (let frame = 0; frame < 3; frame++) {
    const x0 = frame * 724, x1 = (frame + 1) * 724;
    const b = bounds(source, x0, 0, x1, source.height);
    panels.push({ frame, crop: [x0, 0, x1, source.height], sourceBounds: b, output: scaledBlit(source, b, strip, frame, c.factor) });
  }
  const out = path.join(base, `raw/_qa_hold/${c.name}_v${String(version).padStart(2, '0')}.png`);
  const sidecarFile = out.replace(/\.png$/, '.json');
  if (fs.existsSync(out) || fs.existsSync(sidecarFile)) throw new Error(`refusing overwrite ${out}`);
  fs.writeFileSync(out, PNG.sync.write(strip));
  const sourceHash = sha(sourceFile), outputHash = sha(out);
  const sidecar = {
    reassembly: {
      measurement: 'direct source frame 0 landmark estimate', factor: c.factor, uncertainty: `±${c.uncertainty}`,
      source: `art/characters/goku/production/generation-source/${c.source}`, sourceSha256: sourceHash,
      previousCandidate: `art/characters/goku/${c.previous}`, grid: { columns: 3, rows: 1, frames: 3 },
      landmarks: c.endpoints, panels,
      idleReference: { path: 'art/characters/goku/raw/idle_v02.png', sha256: idleHash, targetSpansPx: { eyeToChin: 17, leftBootTopToSole: 40 } },
      review: 'Technical hold. Factor is a manual estimate with projection and endpoint uncertainty; not a numeric pass and not an image approval.'
    }
  };
  fs.writeFileSync(sidecarFile, JSON.stringify(sidecar, null, 2) + '\n');

  // Annotate the original frame-0 source and draw the two measured spans.
  const annotated = new PNG({ width: 724, height: 724 });
  for (let y = 0; y < 724; y++) for (let x = 0; x < 724; x++) {
    const si = (y * source.width + x) * 4;
    annotated.data.set(source.data.subarray(si, si + 4), (y * 724 + x) * 4);
  }
  line(annotated, c.endpoints.eyeToChin.from, c.endpoints.eyeToChin.to, [20, 245, 255, 255]);
  line(annotated, c.endpoints.leftBootTopToSole.from, c.endpoints.leftBootTopToSole.to, [255, 30, 30, 255]);
  const annotationFile = path.join(qaDir, `${c.name}-source-f0-endpoints.png`);
  fs.writeFileSync(annotationFile, PNG.sync.write(annotated));

  // One-scale sheet: idle f0 and all frames with idle top and sole guides.
  const contact = new PNG({ width: 4 * 256, height: 256 });
  for (let i = 0; i < contact.data.length; i += 4) contact.data.set(bg, i);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) contact.data.set(idle.data.subarray((y * idle.width + x) * 4, (y * idle.width + x) * 4 + 4), (y * contact.width + x) * 4);
  for (let f = 0; f < 3; f++) for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const si = (y * strip.width + f * 256 + x) * 4, di = (y * contact.width + (f + 1) * 256 + x) * 4;
    if (strip.data[si + 3] && !magenta(strip, si)) contact.data.set(strip.data.subarray(si, si + 4), di);
  }
  for (let x = 0; x < contact.width; x++) for (const y of [7, 240]) contact.data.set([65, 235, 255, 255], (y * contact.width + x) * 4);
  const contactFile = path.join(qaDir, `${c.name}-v${String(version).padStart(2, '0')}-contact.png`);
  fs.writeFileSync(contactFile, PNG.sync.write(contact));
  rows.push({ animation: c.name, version, factor: c.factor, uncertainty: c.uncertainty, source: c.source, sourceSha256: sourceHash, output: `raw/_qa_hold/${c.name}_v${String(version).padStart(2, '0')}.png`, outputSha256: outputHash, endpoints: c.endpoints, panels, annotation: path.relative(base, annotationFile), contact: path.relative(base, contactFile) });
}
const outReport = path.join(outDir, 'beam-measurements.json');
if (fs.existsSync(outReport)) throw new Error(`refusing overwrite ${outReport}`);
fs.writeFileSync(outReport, JSON.stringify({ note: 'Two additional direct-source-frame estimates. Both remain technical holds pending Claude calibration and user review where applicable.', idleReference: { path: 'raw/idle_v02.png', sha256: idleHash, eyeToChinPx: 17, leftBootTopToSolePx: 40 }, strips: rows }, null, 2) + '\n');
console.log(rows.map((r) => `${r.animation} v${String(r.version).padStart(2, '0')} factor=${r.factor}±${r.uncertainty} src=${r.sourceSha256}`).join('\n'));
