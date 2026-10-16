import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku');
const sourceDir = path.join(base, 'production/generation-source');
const outDir = path.join(base, 'raw/_qa_hold');
const qaDir = path.join(base, 'production/reassembly-r02');
const bg = [255, 0, 255, 255];
const targets = { collarToBelt: 38.1, beltWidth: 36, bootTopToSole: 43.7 };
const configs = [
  {
    name: 'heavy', version: 5, source: 'heavy_v04_attempt04.png', cols: 4, rows: 2, frames: 8,
    cellW: 384, cellH: 512, sampleFrame: 7,
    marks: {
      collarToBelt: { a: [1340, 675], b: [1315, 742], sourceUncertaintyPx: 10, targetUncertaintyPx: 5, definition: 'neckline/collar center to belt center, planted guard frame 7' },
      beltWidth: { a: [1285, 740], b: [1344, 740], sourceUncertaintyPx: 8, targetUncertaintyPx: 4, definition: 'outer belt edge span, frame 7' },
      bootTopToSole: { a: [1223, 882], b: [1182, 954], sourceUncertaintyPx: 10, targetUncertaintyPx: 6, definition: 'rear-left boot shaft top to sole along boot axis, frame 7' }
    }
  },
  {
    name: 'getup', version: 5, source: 'getup_v03_attempt02.png', cols: 3, rows: 2, frames: 5, dividerInset: 4,
    cellW: 512, cellH: 512, sampleFrame: 4,
    marks: {
      collarToBelt: { a: [772, 640], b: [777, 731], sourceUncertaintyPx: 12, targetUncertaintyPx: 5, definition: 'collar center to belt center, recovered neutral frame 4' },
      beltWidth: { a: [719, 731], b: [823, 731], sourceUncertaintyPx: 10, targetUncertaintyPx: 4, definition: 'outer belt edges, frame 4' },
      bootTopToSole: { a: [637, 930], b: [650, 976], sourceUncertaintyPx: 12, targetUncertaintyPx: 6, definition: 'left boot shaft-to-sole diagonal, frame 4' }
    }
  },
  {
    name: 'jumpFall', version: 4, source: 'jumpFall_v02_attempt03.png', cols: 2, rows: 1, frames: 2,
    cellW: 887, cellH: 887, sampleFrame: 0,
    marks: {
      collarToBelt: { a: [477, 267], b: [446, 365], sourceUncertaintyPx: 10, targetUncertaintyPx: 5, definition: 'neckline center to belt center, rotated airborne frame 0' },
      beltWidth: { a: [395, 365], b: [496, 365], sourceUncertaintyPx: 8, targetUncertaintyPx: 4, definition: 'visible outer belt edge span, frame 0' },
      bootTopToSole: { a: [357, 605], b: [349, 736], sourceUncertaintyPx: 12, targetUncertaintyPx: 6, definition: 'dangling boot shaft top to sole along near-vertical axis, frame 0' }
    }
  }
];

const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const isMagenta = (p, i) => p.data[i] > 160 && p.data[i + 1] < 100 && p.data[i + 2] > 160;
function measure(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
function median(values) { const s = [...values].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function bounds(p, x0, y0, x1, y1) {
  let minX = x1, minY = y1, maxX = -1, maxY = -1;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * p.width + x) * 4;
    if (p.data[i + 3] < 128 || isMagenta(p, i)) continue;
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  if (maxX < 0) throw new Error(`empty panel at ${x0},${y0}`);
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}
function line(p, a, b, rgba) {
  let [x0, y0] = a, [x1, y1] = b;
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    for (let oy = -2; oy <= 2; oy++) for (let ox = -2; ox <= 2; ox++) {
      const x = x0 + ox, y = y0 + oy;
      if (x >= 0 && x < p.width && y >= 0 && y < p.height) p.data.set(rgba, (y * p.width + x) * 4);
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}
function blit(source, b, out, frame, factor) {
  const w = Math.ceil(b.width * factor), h = Math.ceil(b.height * factor);
  const ox = Math.round(128 - (w - 1) / 2), oy = 240 - h + 1;
  const overflow = { left: Math.max(0, -ox), right: Math.max(0, ox + w - 256), top: Math.max(0, -oy), bottom: Math.max(0, oy + h - 256) };
  let lostNonMagenta = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = b.minX + Math.min(b.width - 1, Math.floor(x / factor));
    const sy = b.minY + Math.min(b.height - 1, Math.floor(y / factor));
    const si = (sy * source.width + sx) * 4, tx = ox + x, ty = oy + y;
    if (source.data[si + 3] < 128 || isMagenta(source, si)) continue;
    if (tx < 0 || tx >= 256 || ty < 0 || ty >= 256) { lostNonMagenta++; continue; }
    out.data.set(source.data.subarray(si, si + 4), (ty * out.width + frame * 256 + tx) * 4);
  }
  return { x: ox, y: oy, width: w, height: h, overflow, lostNonMagenta };
}

const rows = [];
for (const c of configs) {
  const frozenName = `${c.name}_v${String(c.version).padStart(2, '0')}.png`;
  if (fs.existsSync(path.join(outDir, frozenName))) continue;
  const sourcePath = path.join(sourceDir, c.source), source = PNG.sync.read(fs.readFileSync(sourcePath));
  if (source.width !== c.cols * c.cellW || source.height !== c.rows * c.cellH) throw new Error(`${c.name}: source grid mismatch ${source.width}x${source.height}`);
  const lengths = Object.fromEntries(Object.entries(c.marks).map(([k, m]) => [k, measure(m.a, m.b)]));
  const ratios = Object.fromEntries(Object.entries(c.marks).map(([k, m]) => [k, targets[k] / lengths[k]]));
  const factor = Number(median(Object.values(ratios)).toFixed(3));
  const strip = new PNG({ width: c.frames * 256, height: 256 });
  for (let i = 0; i < strip.data.length; i += 4) strip.data.set(bg, i);
  const frames = [];
  for (let f = 0; f < c.frames; f++) {
    const col = f % c.cols, row = Math.floor(f / c.cols), x0 = col * c.cellW, y0 = row * c.cellH;
    const inset = c.dividerInset ?? 0;
    const b = bounds(source, x0 + inset, y0 + inset, x0 + c.cellW - inset, y0 + c.cellH - inset);
    frames.push({ frame: f, sourceRect: [x0, y0, x0 + c.cellW, y0 + c.cellH], excludedGridDividerInset: inset, sourceBounds: b, output: blit(source, b, strip, f, factor) });
  }
  const outName = `${c.name}_v${String(c.version).padStart(2, '0')}.png`, outPath = path.join(outDir, outName);
  if (fs.existsSync(outPath) || fs.existsSync(outPath.replace(/\.png$/, '.json'))) throw new Error(`refusing overwrite ${outPath}`);
  fs.writeFileSync(outPath, PNG.sync.write(strip));
  const sourceSha256 = sha(sourcePath), outputSha256 = sha(outPath);
  const annotation = new PNG({ width: c.cellW, height: c.cellH });
  for (let y = 0; y < c.cellH; y++) for (let x = 0; x < c.cellW; x++) {
    const si = (y * source.width + x) * 4; annotation.data.set(source.data.subarray(si, si + 4), (y * c.cellW + x) * 4);
  }
  const panelX = (c.sampleFrame % c.cols) * c.cellW, panelY = Math.floor(c.sampleFrame / c.cols) * c.cellH;
  const sampleAnnotation = new PNG({ width: c.cellW, height: c.cellH });
  for (let y = 0; y < c.cellH; y++) for (let x = 0; x < c.cellW; x++) {
    const si = ((panelY + y) * source.width + panelX + x) * 4;
    sampleAnnotation.data.set(source.data.subarray(si, si + 4), (y * c.cellW + x) * 4);
  }
  for (const [i, [, mark]] of Object.entries(Object.entries(c.marks))) line(sampleAnnotation, [mark.a[0] - panelX, mark.a[1] - panelY], [mark.b[0] - panelX, mark.b[1] - panelY], Number(i) === 0 ? [20, 245, 255, 255] : Number(i) === 1 ? [255, 230, 20, 255] : [255, 30, 30, 255]);
  const annotationName = `${c.name}-source-f${c.sampleFrame}-endpoints.png`;
  fs.writeFileSync(path.join(qaDir, annotationName), PNG.sync.write(sampleAnnotation));
  const landmarks = Object.fromEntries(Object.entries(c.marks).map(([k, m]) => [k, { ...m, sourceLengthPx: Number(lengths[k].toFixed(2)), targetPx: targets[k], targetUncertaintyPx: m.targetUncertaintyPx, ratio: Number(ratios[k].toFixed(6)) }]));
  const record = {
    animation: c.name, version: c.version, status: 'technical HOLD; source-derived uniform scale candidate, pending Astra final quantized anatomy review',
    sourcePath: `art/characters/goku/production/generation-source/${c.source}`, sourceSha256, sourceDimensions: [source.width, source.height], sourceFrameGrid: [c.cols, c.rows, c.frames],
    reference: { path: 'art/characters/goku/raw/idle_v02.png', sha256: sha(path.join(base, 'raw/idle_v02.png')), targets, referenceUncertaintyPx: { collarToBelt: 5, beltWidth: 4, bootTopToSole: 6 } },
    sourceEndpointUncertaintyPx: Object.fromEntries(Object.entries(c.marks).map(([k, m]) => [k, m.sourceUncertaintyPx])),
    landmarks, factor, factorMethod: `exact median of all three source landmark ratios in inspected frame ${c.sampleFrame}, calculated programmatically and rounded to 0.001; nearest-neighbor uniform scale, no framewise or bounds-fit normalization`,
    factorUncertainty: '±0.040 selected from source endpoint uncertainty (10–12 source px) and independent reference landmark uncertainty; separate from target uncertainty values above',
    frames, outputPath: `art/characters/goku/raw/_qa_hold/${outName}`, outputSha256, annotation: `art/characters/goku/production/reassembly-r02/${annotationName}`,
    clipping: frames.map(f => ({ frame: f.frame, overflow: f.output.overflow, lostNonMagenta: f.output.lostNonMagenta })),
    reviewNote: 'This is a measured source reassembly for technical review only. It is not an art approval or a scale pass.'
  };
  fs.writeFileSync(outPath.replace(/\.png$/, '.json'), JSON.stringify(record, null, 2) + '\n');
  rows.push({ animation: c.name, version: c.version, factor, sourceSha256, outputSha256, annotation: annotationName, factorUncertainty: record.factorUncertainty, clipping: record.clipping });
}
fs.writeFileSync(path.join(qaDir, 'selected-reassembly-summary.json'), JSON.stringify({ method: 'Measured f0 endpoint reassembly; fixture/atlas still pending.', rows }, null, 2) + '\n');
console.log(JSON.stringify(rows, null, 2));
