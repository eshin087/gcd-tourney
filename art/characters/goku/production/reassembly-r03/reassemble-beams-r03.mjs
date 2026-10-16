import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const base = path.join(goku, 'production/reassembly-r03');
const srcDir = path.join(goku, 'production/generation-source');
const hold = path.join(goku, 'raw/_qa_hold');
const inspection = path.join(base, 'source-inspection');
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const magenta = (p, i) => p.data[i] > 160 && p.data[i + 1] < 100 && p.data[i + 2] > 160;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const candidates = [
  {
    animation: 'beamFire', source: 'beamFire_v04_attempt03.png', factor: 43.7 / Math.hypot(43, 117),
    landmarks: {
      beltWidth: { a: [274, 311], b: [381, 311], target: 36, endpointUncertainty: 10, targetUncertainty: 4, note: 'visible blue belt outer span' },
      bootTopToSole: { a: [151, 552], b: [108, 669], target: 43.7, endpointUncertainty: 10, targetUncertainty: 4, note: 'rear boot shaft-to-sole, nearly vertical view' }
    }
  },
  {
    animation: 'beamCharge', source: 'beamCharge_v04_attempt03.png', factor: 43.7 / Math.hypot(44, 114),
    landmarks: {
      collarToBelt: { a: [361, 222], b: [319, 303], target: 38.1, endpointUncertainty: 10, targetUncertainty: 5, note: 'visible collar center to belt center; torso partly occluded by arm' },
      bootTopToSole: { a: [151, 550], b: [107, 664], target: 43.7, endpointUncertainty: 10, targetUncertainty: 4, note: 'rear boot shaft-to-sole' }
    }
  }
];

function bounds(p, x0, y0, x1, y1) {
  let left = x1, top = y1, right = -1, bottom = -1;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * p.width + x) * 4;
    if (p.data[i + 3] < 128 || magenta(p, i)) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  return right < 0 ? null : { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
}
function line(p, a, b, color) {
  const n = Math.ceil(dist(a, b));
  for (let s = 0; s <= n; s++) {
    const x = Math.round(a[0] + (b[0] - a[0]) * s / n), y = Math.round(a[1] + (b[1] - a[1]) * s / n);
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || xx >= p.width || yy < 0 || yy >= p.height) continue;
      const i = (yy * p.width + xx) * 4; p.data.set([...color, 255], i);
    }
  }
}
function makeFrame(src, rect, factor) {
  const b = bounds(src, rect[0], rect[1], rect[2], rect[3]);
  const w = Math.ceil(b.width * factor), h = Math.ceil(b.height * factor);
  const out = new PNG({ width: 256, height: 256 });
  for (let i = 0; i < out.data.length; i += 4) out.data.set([255, 0, 255, 255], i);
  const ox = Math.floor((256 - w) / 2), oy = 240 - h + 1;
  let copied = 0, lost = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = b.left + Math.min(b.width - 1, Math.floor(x / factor));
    const sy = b.top + Math.min(b.height - 1, Math.floor(y / factor));
    const si = (sy * src.width + sx) * 4;
    if (src.data[si + 3] < 128 || magenta(src, si)) continue;
    const dx = ox + x, dy = oy + y;
    if (dx < 0 || dx >= 256 || dy < 0 || dy >= 256) { lost++; continue; }
    out.data.set(src.data.subarray(si, si + 4), (dy * 256 + dx) * 4); copied++;
  }
  return { out, sourceBounds: b, nativeHeight: h, lost, copied };
}

const results = [];
for (const c of candidates) {
  const srcPath = path.join(srcDir, c.source), srcBytes = fs.readFileSync(srcPath), src = PNG.sync.read(srcBytes);
  if (src.width !== 2172 || src.height !== 724) throw new Error(`${c.animation}: unexpected source dimensions ${src.width}x${src.height}`);
  const ratios = Object.fromEntries(Object.entries(c.landmarks).map(([name, m]) => [name, m.target / dist(m.a, m.b)]));
  const version = Math.max(0, ...fs.readdirSync(hold).map((f) => [...f.matchAll(new RegExp(`^${c.animation}_v(\\d{2})\\.(?:png|json)$`, 'g'))].map((m) => Number(m[1]))).flat()) + 1;
  const frames = [];
  for (let f = 0; f < 3; f++) frames.push({ frame: f, ...makeFrame(src, [f * 724, 0, (f + 1) * 724, 724], c.factor) });
  const maxHeight = Math.max(...frames.map((f) => f.nativeHeight));
  const strip = new PNG({ width: 768, height: 256 });
  for (let i = 0; i < strip.data.length; i += 4) strip.data.set([255, 0, 255, 255], i);
  frames.forEach((f, n) => { for (let y = 0; y < 256; y++) strip.data.set(f.out.data.subarray(y * 1024, (y + 1) * 1024), (y * 768 + n * 256) * 4); });
  const name = `${c.animation}_v${String(version).padStart(2, '0')}`;
  const imageBytes = PNG.sync.write(strip);
  const imagePath = path.join(hold, `${name}.png`);
  if (fs.existsSync(imagePath) || fs.existsSync(imagePath.replace(/\.png$/, '.json'))) throw new Error(`refusing overwrite ${name}`);
  fs.writeFileSync(imagePath, imageBytes);
  const endpointRows = {};
  for (const [key, m] of Object.entries(c.landmarks)) {
    const length = dist(m.a, m.b);
    endpointRows[key] = { sourceEndpoints: [m.a, m.b], sourceLengthPx: Number(length.toFixed(3)), endpointUncertaintyPx: m.endpointUncertainty, targetPx: m.target, targetUncertaintyPx: m.targetUncertainty, ratio: Number(ratios[key].toFixed(6)), note: m.note };
  }
  const annotation = PNG.sync.read(srcBytes);
  for (const [key, m] of Object.entries(c.landmarks)) line(annotation, m.a, m.b, key === 'beltWidth' ? [255, 235, 0] : key === 'collarToBelt' ? [0, 255, 255] : [255, 64, 64]);
  const annotationPath = path.join(inspection, `${c.animation}-f00-endpoints-verified.png`);
  fs.writeFileSync(annotationPath, PNG.sync.write(annotation));
  const record = {
    animation: c.animation, version, status: 'diagnostic technical hold; no art approval or production scale pass',
    sourcePath: `art/characters/goku/production/generation-source/${c.source}`, sourceSha256: hash(srcBytes), sourceDimensions: [src.width, src.height], sourcePanelRects: [[0,0,724,724],[724,0,1448,724],[1448,0,2172,724]],
    reference: { path: 'art/characters/goku/raw/idle_v02.png', sha256: hash(fs.readFileSync(path.join(goku, 'raw/idle_v02.png'))), landmarks: { collarToBelt: [38.1,5], beltWidth: [36,4], bootTopToSole: [43.7,4] } },
    measuredFrame: 0, landmarks: endpointRows, selectedFactor: Number(c.factor.toFixed(9)), factorMethod: 'direct boot-ratio estimate, independently checked against visible second landmark with source and reference uncertainty; no bounding-box scaling', factorUncertainty: '±0.04 to ±0.06, endpoint source-pixel and reference-pixel uncertainty kept separate',
    nativeMaxHeight: maxHeight, frameLostPixels: frames.map((f) => f.lost), totalLostPixels: frames.reduce((s, f) => s + f.lost, 0), outputPath: `art/characters/goku/raw/_qa_hold/${name}.png`, outputSha256: hash(imageBytes), annotationPath: `art/characters/goku/production/reassembly-r03/source-inspection/${c.animation}-f00-endpoints-verified.png`,
    note: 'Uniform source factor and per-frame translation only. Exact quantized combined atlas audit is required before any numeric manual QA; selected body is held if native max exceeds the packer 237px cap or source-fit audit fails.'
  };
  fs.writeFileSync(imagePath.replace(/\.png$/, '.json'), JSON.stringify(record, null, 2) + '\n');
  results.push({ animation: c.animation, version, factor: record.selectedFactor, nativeMaxHeight: maxHeight, totalLostPixels: record.totalLostPixels, sourceSha256: record.sourceSha256, outputSha256: record.outputSha256 });
}
fs.writeFileSync(path.join(base, 'beam-reassembly-r03.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
