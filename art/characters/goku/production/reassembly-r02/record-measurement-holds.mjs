import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const base = path.resolve('art/characters/goku');
const srcDir = path.join(base, 'production/generation-source');
const outDir = path.join(base, 'production/reassembly-r02');
const target = { collarToBelt: 38.1, beltWidth: 36, bootTopToSole: 43.7 };
const holds = [
  {
    name: 'airLight1', source: 'airLight1_v04_attempt04.png', dimensions: [1536, 1024], grid: [3, 2, 5], frame: 0, panel: [0, 0, 512, 512],
    points: { collarToBelt: [[255, 150], [249, 218]], beltWidth: [[206, 220], [291, 220]], bootTopToSole: [[154, 396], [132, 463]] },
    defs: ['collar center to belt center', 'outer blue belt span', 'left boot shaft top to sole along axis'],
    reason: 'Frame 0 is a tucked airborne guard with a raised leg; belt-width projection is short relative to collar/boot estimates. Other frames are airborne strikes and do not supply an upright independent check. Keep measured HOLD pending Astra review; no common factor asserted.'
  },
  {
    name: 'airHeavy', source: 'airHeavy_v04_attempt04.png', dimensions: [1536, 1024], grid: [3, 2, 6], frame: 5, panel: [1024, 512, 512, 512],
    points: { collarToBelt: [[1254, 641], [1241, 710]], beltWidth: [[1194, 710], [1286, 710]], bootTopToSole: [[1168, 881], [1175, 962]] },
    defs: ['collar center to belt center', 'outer belt edge span', 'rear boot shaft top to sole axis'],
    reason: 'The best recovery/guard frame 5 remains midair with bent legs; torso and belt measurements disagree, and boot perspective is only a secondary check. Frames 1-4 are increasingly tucked/rotated. Keep measured HOLD; no common factor asserted.'
  },
  {
    name: 'launched', source: 'launched_v06_attempt02.png', dimensions: [1774, 887], grid: [2, 1, 2], frame: 0, panel: [0, 0, 887, 887],
    points: { collarToBelt: [[246, 256], [320, 355]], beltWidth: [[282, 351], [415, 393]], bootTopToSole: [[705, 396], [822, 447]] },
    defs: ['neckline center to belt center along reclined torso', 'belt outer edge span under reclining perspective', 'foreground boot shaft top to sole axis'],
    reason: 'Both source frames are airborne recoil poses with body foreshortening and no planted neutral limb; frame-0 torso, belt and boot directions carry different projection. Preserve source and record HOLD, not a scale impossibility claim.'
  },
  {
    name: 'down', source: 'down_v04_attempt02.png', dimensions: [1774, 887], grid: [2, 1, 2], frame: 0, panel: [0, 0, 887, 887],
    points: { collarToBelt: [[306, 427], [304, 506]], beltWidth: [[255, 500], [352, 500]] },
    defs: ['neckline to belt along forward-folded torso', 'outer belt span in kneeling recovery pose'],
    reason: 'Frame 0 is a hands-and-knees fall pose and frame 1 is prone; neither offers an independent boot axis or a comparable neutral torso. The two recorded measurements are projection-sensitive, so no factor or resample is supported. Measured HOLD.'
  },
  {
    name: 'special', source: 'special_v02_attempt03.png', dimensions: [1774, 887], grid: [4, 2, 8], frame: 0, panel: [0, 0, 444, 444],
    points: { collarToBelt: [[226, 112], [207, 217]], beltWidth: [[153, 216], [263, 216]], bootTopToSole: [[75, 356], [37, 418]] },
    defs: ['collar center to belt center', 'outer belt edge span', 'rear boot top-to-sole along diagonal axis'],
    reason: 'Three directly marked frame-0 ratios are materially different, while all frames use a wide power-stance or extended-arm pose; source anatomy cannot be inferred from its bounds. Keep measured HOLD for Astra comparison; no factor selected.'
  }
];
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
function drawLine(png, a, b, color) {
  let [x0, y0] = a, [x1, y1] = b;
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    for (let oy = -2; oy <= 2; oy++) for (let ox = -2; ox <= 2; ox++) {
      const x = x0 + ox, y = y0 + oy;
      if (x >= 0 && x < png.width && y >= 0 && y < png.height) png.data.set(color, (y * png.width + x) * 4);
    }
    if (x0 === x1 && y0 === y1) break;
    const e = 2 * err; if (e >= dy) { err += dy; x0 += sx; } if (e <= dx) { err += dx; y0 += sy; }
  }
}
const rows = [];
for (const h of holds) {
  const sourcePath = path.join(srcDir, h.source), src = PNG.sync.read(fs.readFileSync(sourcePath));
  if (src.width !== h.dimensions[0] || src.height !== h.dimensions[1]) throw new Error(`${h.name}: dimensions changed`);
  const [x0, y0, w, hh] = h.panel, annotation = new PNG({ width: w, height: hh });
  for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) annotation.data.set(src.data.subarray(((y0 + y) * src.width + x0 + x) * 4, ((y0 + y) * src.width + x0 + x) * 4 + 4), (y * w + x) * 4);
  const landmarks = {};
  for (const [i, [name, points]] of Object.entries(Object.entries(h.points))) {
    const [a, b] = points, sourceLengthPx = len(a, b), targetPx = target[name];
    landmarks[name] = { a, b, sourceLengthPx: Number(sourceLengthPx.toFixed(2)), sourceEndpointUncertaintyPx: 18, targetPx, referenceUncertaintyPx: name === 'beltWidth' ? 4 : name === 'bootTopToSole' ? 6 : 5, ratio: Number((targetPx / sourceLengthPx).toFixed(4)), definition: h.defs[Number(i)] };
    drawLine(annotation, [a[0] - x0, a[1] - y0], [b[0] - x0, b[1] - y0], Number(i) === 0 ? [20, 245, 255, 255] : Number(i) === 1 ? [255, 230, 20, 255] : [255, 30, 30, 255]);
  }
  const annotationName = `${h.name}-source-f${h.frame}-hold-endpoints.png`;
  fs.writeFileSync(path.join(outDir, annotationName), PNG.sync.write(annotation));
  const record = {
    animation: h.name, status: 'measured technical HOLD; no factor and no resample', sourcePath: `art/characters/goku/production/generation-source/${h.source}`,
    sourceSha256: sha(sourcePath), sourceDimensions: h.dimensions, sourceGrid: h.grid, inspectedFrame: h.frame, sourcePanelRect: [x0, y0, x0 + w, y0 + hh],
    reference: { path: 'art/characters/goku/raw/idle_v02.png', sha256: sha(path.join(base, 'raw/idle_v02.png')), targetsPx: target, uncertaintyPx: { collarToBelt: 5, beltWidth: 4, bootTopToSole: 6 } },
    landmarks, annotation: `art/characters/goku/production/reassembly-r02/${annotationName}`, holdReason: h.reason
  };
  const file = path.join(outDir, `${h.name}-measurement-hold.json`);
  if (fs.existsSync(file)) throw new Error(`refusing overwrite ${file}`);
  fs.writeFileSync(file, JSON.stringify(record, null, 2) + '\n');
  rows.push({ animation: h.name, sourceSha256: record.sourceSha256, annotation: annotationName, factors: Object.fromEntries(Object.entries(landmarks).map(([k, v]) => [k, v.ratio])), holdReason: h.reason });
}
fs.writeFileSync(path.join(outDir, 'measured-holds-summary.json'), JSON.stringify({ rows }, null, 2) + '\n');
console.log(JSON.stringify(rows, null, 2));
