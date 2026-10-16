import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku');
const sourceDir = path.join(base, 'production/generation-source');
const rawDir = path.join(base, 'raw');
const holdDir = path.join(rawDir, '_qa_hold');
const outDir = path.join(base, 'production/reassembly-r03');
const inspectionDir = path.join(outDir, 'source-inspection');
const targets = { collarToBelt: 38.1, beltWidth: 36, bootTopToSole: 43.7 };
const records = [
  { name: 'run', source: 'run_v02_attempt04.png', cols: 4, rows: 2, frames: 8, sample: 0, factor: 0.589, factorMethod: 'Astra interval-constrained diagnostic candidate using source endpoint uncertainty; one-factor density remains unverified against every pose',
    marks: { collarToBelt: { a: [257,147], b: [214,192], uncertainty: 8 }, beltWidth: { a: [181,184], b: [237,201], uncertainty: 8 }, bootTopToSole: { a: [280,344], b: [293,409], uncertainty: 8 } } },
  { name: 'airLight1', source: 'airLight1_v04_attempt04.png', cols: 3, rows: 2, frames: 5, sample: 0, factor: 0.539, factorMethod: 'Astra interval-constrained candidate supported by three direct source lengths; old arm clipping was after packing/anchoring, not source loss',
    marks: { collarToBelt: { a: [278,147], b: [251,212], uncertainty: 8 }, beltWidth: { a: [218,213], b: [279,213], uncertainty: 6 }, bootTopToSole: { a: [150,386], b: [132,464], uncertainty: 8 } } },
  { name: 'airHeavy', source: 'airHeavy_v04_attempt04.png', cols: 3, rows: 2, frames: 6, sample: 5, factor: 0.573, factorMethod: 'Astra interval-constrained diagnostic candidate; three independent target intervals overlap, source endpoint uncertainty retained; not a bounds fit',
    marks: { collarToBelt: { a: [1269,667], b: [1240,719], uncertainty: 8 }, beltWidth: { a: [1205,719], b: [1269,726], uncertainty: 8 }, bootTopToSole: { a: [1178,842], b: [1168,911], uncertainty: 8 } } },
  { name: 'down', source: 'down_v04_attempt02.png', cols: 2, rows: 1, frames: 2, sample: 1, factor: 0.272,
    marks: { bootTopToSole: { a: [1590,705], b: [1742,751], uncertainty: 12, frame: 1 }, forearmSpan: { a: [386,623], b: [379,695], uncertainty: 12, targetPx: 19.4, targetUncertaintyPx: 6, frame: 0 } } },
  { name: 'heavy', source: 'heavy_v04_attempt04.png', cols: 4, rows: 2, frames: 8, sample: 7, factor: 0.599, factorMethod: 'Astra interval-constrained diagnostic candidate within endpoint/reference uncertainty; near capacity threshold, not a bounds fit', dividers: false,
    customRects: { 4: [0,512,404,1024], 5: [404,512,778,1024], 6: [778,512,1152,1024] },
    marks: { collarToBelt: { a: [1337,691], b: [1316,742], uncertainty: 8 }, beltWidth: { a: [1287,741], b: [1341,743], uncertainty: 8 }, bootTopToSole: { a: [1221,883], b: [1196,946], uncertainty: 8 } } },
  { name: 'getup', source: 'getup_v03_attempt02.png', cols: 3, rows: 2, frames: 5, sample: 4, factor: 0.532, factorMethod: 'uncertainty-compatible constrained candidate within all three direct landmark intervals; exact density remains uncertain and factor is not selected by image bounds', dividerInset: 4,
    marks: { collarToBelt: { a: [777,659], b: [751,725], uncertainty: 8 }, beltWidth: { a: [719,724], b: [785,726], uncertainty: 8 }, bootTopToSole: { a: [654,898], b: [627,973], uncertainty: 8 } } },
  { name: 'light3', source: 'light3_v04_attempt04.png', cols: 4, rows: 2, frames: 7, sample: 6, factor: 0.499, factorMethod: 'Astra interval-constrained diagnostic candidate using source endpoint uncertainty; not a bounds fit and undersizing must be reviewed', dividers: false,
    customRects: { 1: [313,0,605,627], 2: [605,0,887,627], 3: [887,0,1254,627], 6: [627,627,940,1254] },
    marks: { collarToBelt: { a: [795,857], b: [772,920], uncertainty: 8 }, beltWidth: { a: [737,919], b: [799,921], uncertainty: 8 }, bootTopToSole: { a: [679,1077], b: [657,1151], uncertainty: 8 } } },
  { name: 'light4', source: 'light4_v04_attempt04.png', cols: 4, rows: 2, frames: 8, sample: 7, factor: 0.652, factorMethod: 'Astra interval-constrained candidate; three independent targets overlap within endpoint/reference uncertainty; not a bounds fit',
    marks: { collarToBelt: { a: [1547,577], b: [1531,630], uncertainty: 8 }, beltWidth: { a: [1501,628], b: [1558,630], uncertainty: 8 }, bootTopToSole: { a: [1445,766], b: [1429,826], uncertainty: 8 } } },
  { name: 'special', source: 'special_v02_attempt03.png', cols: 4, rows: 2, frames: 8, sample: 0, factor: 0.596, factorMethod: 'Astra uncertainty-constrained candidate from two visible landmarks; high uncertainty and no bounds fit',
    customRects: { 0: [3,3,440,440], 1: [446,3,883,440], 2: [889,3,1326,440], 3: [1332,3,1769,440], 4: [3,447,440,884], 5: [446,447,883,884], 6: [889,447,1326,884], 7: [1332,447,1769,884] },
    marks: { collarToBelt: { a: [227,145], b: [211,201], uncertainty: 8 }, bootTopToSole: { a: [75,356], b: [37,418], uncertainty: 6 } } },
  { name: 'win', source: 'win_v03_attempt03.png', cols: 2, rows: 2, frames: 4, sample: 0, factor: 0.420, factorMethod: 'Astra uncertainty-constrained candidate from torso/belt/boot intervals; source-complete, no bounds fit',
    customRects: { 0: [3,3,629,620], 1: [634,3,1260,620], 2: [3,626,629,1243], 3: [634,626,1260,1243] },
    marks: { collarToBelt: { a: [317,155], b: [323,239], uncertainty: 8 }, beltWidth: { a: [279,243], b: [361,243], uncertainty: 8 }, bootTopToSole: { a: [213,483], b: [193,579], uncertainty: 8 } } }
];

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const magenta = (d, i) => d[i] > 160 && d[i + 1] < 100 && d[i + 2] > 160;
const distance = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const median = (vs) => { const s = [...vs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

function nextVersion(name) {
  const files = [];
  for (const dir of [rawDir, path.join(rawDir, '_parts'), path.join(rawDir, '_qa_hold'), path.join(rawDir, '_rejected')]) {
    if (fs.existsSync(dir)) files.push(...fs.readdirSync(dir).map((f) => path.join(dir, f)));
  }
  const review = path.join(base, 'production/reassembly-r02/REVIEW_ROWS.md');
  if (fs.existsSync(review)) files.push(fs.readFileSync(review, 'utf8'));
  const re = new RegExp(`${name}_v(\\d{2})`, 'g');
  let max = 0;
  for (const f of files) {
    const text = f.includes('\n') ? f : path.basename(f);
    for (const m of text.matchAll(re)) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

function labelComponents(p) {
  const labels = new Int32Array(p.width * p.height), stack = new Int32Array(p.width * p.height);
  const boxes = [null];
  let label = 0;
  for (let start = 0; start < labels.length; start++) {
    const si = start * 4;
    if (labels[start] || p.data[si + 3] < 128 || magenta(p.data, si)) continue;
    label++;
    let top = Math.floor(start / p.width), left = start % p.width, bottom = top, right = left, count = 0;
    let head = 0, tail = 0; stack[tail++] = start; labels[start] = label;
    while (head < tail) {
      const index = stack[head++], x = index % p.width, y = Math.floor(index / p.width);
      count++; left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
      for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
        if (!ox && !oy) continue;
        const nx = x + ox, ny = y + oy;
        if (nx < 0 || nx >= p.width || ny < 0 || ny >= p.height) continue;
        const ni = ny * p.width + nx, pi = ni * 4;
        if (labels[ni] || p.data[pi + 3] < 128 || magenta(p.data, pi)) continue;
        labels[ni] = label; stack[tail++] = ni;
      }
    }
    boxes.push({ label, left, top, right, bottom, count });
  }
  return { labels, boxes };
}

function componentsForPanel(source, labels, boxes, x0, y0, x1, y1) {
  const selected = new Set();
  for (const b of boxes) if (b && b.right >= x0 && b.left < x1 && b.bottom >= y0 && b.top < y1) selected.add(b.label);
  let left = source.width, top = source.height, right = -1, bottom = -1;
  for (const id of selected) { const b = boxes[id]; left = Math.min(left, b.left); top = Math.min(top, b.top); right = Math.max(right, b.right); bottom = Math.max(bottom, b.bottom); }
  if (right < 0) return null;
  return { selected, bounds: { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 } };
}

function panelBounds(p, x0, y0, x1, y1) {
  let left = x1, top = y1, right = -1, bottom = -1;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * p.width + x) * 4;
    if (p.data[i + 3] < 128 || magenta(p.data, i)) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  return right < 0 ? null : { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
}

function makeFrame(source, rect, factor) {
  const b = panelBounds(source, rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
  if (!b) throw new Error(`empty source frame ${rect.frame}`);
  const w = Math.ceil(b.width * factor), h = Math.ceil(b.height * factor);
  const ox = Math.round((256 - w) / 2), oy = 240 - h + 1;
  let lost = 0, copied = 0, maxY = -1;
  const image = new PNG({ width: 256, height: 256 });
  for (let i = 0; i < image.data.length; i += 4) image.data.set([255, 0, 255, 255], i);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = b.left + Math.min(b.width - 1, Math.floor(x / factor));
    const sy = b.top + Math.min(b.height - 1, Math.floor(y / factor));
    const si = (sy * source.width + sx) * 4;
    if (source.data[si + 3] < 128 || magenta(source.data, si)) continue;
    const tx = ox + x, ty = oy + y;
    if (tx < 0 || tx >= 256 || ty < 0 || ty >= 256) { lost++; continue; }
    image.data.set(source.data.subarray(si, si + 4), (ty * 256 + tx) * 4);
    copied++; maxY = Math.max(maxY, ty);
  }
  const placed = panelBounds(image, 0, 0, 256, 256);
  return { image, sourceBounds: b, placement: { x: ox - b.left * factor, y: oy - b.top * factor, rule: 'uniform nearest-neighbor scale; translate visible bounds to x-center and sole/bottom line y=240; no per-frame scale adjustment' }, placedBounds: placed, nativeBodyHeight: placed?.height ?? 0, copied, lost };
}

fs.mkdirSync(holdDir, { recursive: true });
fs.mkdirSync(inspectionDir, { recursive: true });
const selectedNames = process.argv.slice(2);
const selected = selectedNames.length ? records.filter((c) => selectedNames.includes(c.name)) : records;
const results = [];
for (const c of selected) {
  const version = nextVersion(c.name);
  const sourcePath = path.join(sourceDir, c.source), sourceBytes = fs.readFileSync(sourcePath), source = PNG.sync.read(sourceBytes);
  const pw = Math.floor(source.width / c.cols), ph = Math.floor(source.height / c.rows);
  if (source.width - pw * c.cols > c.cols || source.height - ph * c.rows > c.rows) throw new Error(`${c.name}: unexpected source remainder outside grid panels`);
  const ratios = Object.fromEntries(Object.entries(c.marks).map(([k, m]) => [k, (m.targetPx ?? targets[k]) / distance(m.a, m.b)]));
  const exactMedian = median(Object.values(ratios));
  if (!c.factorMethod && Math.abs(exactMedian - c.factor) > 0.0011) throw new Error(`${c.name}: manually entered factor ${c.factor} differs from measured median ${exactMedian}`);
  const frames = [];
  for (let f = 0; f < c.frames; f++) {
    const col = f % c.cols, row = Math.floor(f / c.cols);
    const inset = c.dividerInset ?? 0;
    const custom = c.customRects?.[f];
    const rect = custom
      ? { frame: f, x: custom[0], y: custom[1], w: custom[2] - custom[0], h: custom[3] - custom[1] }
      : { frame: f, x: col * pw + inset, y: row * ph + inset, w: pw - inset * 2, h: ph - inset * 2 };
    const placed = makeFrame(source, rect, c.factor);
    frames.push({ ...placed, frame: f, sourceRect: [rect.x, rect.y, rect.x + rect.w, rect.y + rect.h] });
  }
  const maxBodyHeight = Math.max(...frames.map((f) => f.nativeBodyHeight));
  const strip = new PNG({ width: 256 * frames.length, height: 256 });
  for (let i = 0; i < strip.data.length; i += 4) strip.data.set([255, 0, 255, 255], i);
  frames.forEach((f, n) => {
    for (let y = 0; y < 256; y++) strip.data.set(f.image.data.subarray(y * 1024, (y + 1) * 1024), (y * strip.width + n * 256) * 4);
  });
  const outName = `${c.name}_v${String(version).padStart(2, '0')}.png`;
  const outPath = path.join(holdDir, outName);
  if (fs.existsSync(outPath) || fs.existsSync(outPath.replace(/\.png$/, '.json'))) throw new Error(`refusing overwrite ${outName}`);
  const outBytes = PNG.sync.write(strip);
  fs.writeFileSync(outPath, outBytes);
  const landmarks = Object.fromEntries(Object.entries(c.marks).map(([k, m]) => [k, {
    measuredFrame: m.frame ?? c.sample,
    sourceEndpoints: [m.a, m.b], sourceLengthPx: Number(distance(m.a, m.b).toFixed(3)), sourceEndpointUncertaintyPx: m.uncertainty,
    referenceTargetPx: m.targetPx ?? targets[k], referenceTargetUncertaintyPx: m.targetUncertaintyPx ?? (k === 'collarToBelt' ? 5 : k === 'beltWidth' ? 4 : 4),
    ratio: Number(ratios[k].toFixed(6))
  }]));
  const record = {
    animation: c.name, version, status: 'diagnostic technical hold; no art approval or scale pass',
    sourcePath: `art/characters/goku/production/generation-source/${c.source}`, sourceSha256: sha(sourceBytes), sourceDimensions: [source.width, source.height], sourceGrid: [c.cols, c.rows, c.frames],
    reference: { path: 'art/characters/goku/raw/idle_v02.png', sha256: sha(fs.readFileSync(path.join(base, 'raw/idle_v02.png'))), targets, uncertaintyPx: { collarToBelt: 5, beltWidth: 4, bootTopToSole: 4, forearmSpan: 6 } },
    measuredFrame: c.sample, landmarks, exactMedianFactor: exactMedian, selectedFactor: c.factor, factorMethod: c.factorMethod ?? 'exact median of recorded landmark ratios', factorUncertainty: '±0.04 to ±0.06; source endpoint uncertainty is recorded separately from reference target uncertainty',
    transform: 'single uniform nearest-neighbor factor for every source frame; each frame translated without rescaling to center the visible silhouette and place its lowest visible pixel on y=240; this is a diagnostic placement convention, not runtime contact certification',
    nativeBodyHeight: maxBodyHeight, frames: frames.map(({ image, ...f }) => ({ ...f, lostNonMagenta: f.lost, frameSha256: sha(PNG.sync.write(image)) })),
    outputPath: `art/characters/goku/raw/_qa_hold/${outName}`, outputSha256: sha(outBytes),
    annotationPath: `art/characters/goku/production/reassembly-r03/source-inspection/${c.name}-f${String(c.sample).padStart(2, '0')}-endpoints.png`,
    allSourcePixels: frames.every((f) => f.lost === 0), fitWarning: frames.some((f) => f.lost > 0) ? 'one or more frames lost non-magenta pixels at 256x256; inspect per-frame counts' : null,
    candidateBodyHeightForX1Pack: maxBodyHeight,
    note: 'Candidate source-only rescale; exact quantized atlas recheck is still required before any manual QA record. Versioned source generations are unchanged.'
  };
  fs.writeFileSync(outPath.replace(/\.png$/, '.json'), JSON.stringify(record, null, 2) + '\n');
  results.push({ animation: c.name, version, factor: c.factor, bodyHeight: maxBodyHeight, sourceSha256: record.sourceSha256, outputSha256: record.outputSha256, lost: frames.reduce((s, f) => s + f.lost, 0), file: record.outputPath });
}
fs.writeFileSync(path.join(outDir, 'r03-measured-batch.json'), JSON.stringify({ method: 'Astra-checked source endpoint median; common nearest-neighbor factor across all frames; per-frame translation only; diagnostic hold pending exact packed-pixel audit', results }, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
