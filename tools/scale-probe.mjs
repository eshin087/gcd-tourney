// Scale probe (TOOL-025, ADR 0021, art/CHARACTER_SCALE.md "Scale gate (automatic)"): how big is the fighter drawn in
// each packed frame, compared with his approved idle? Pure functions on RGBA cells ({ w, h, data }, alpha >= 128 =
// opaque), shared by the packer (the gate and the auto head fit), `npm run scale` (report, heads sheets, baseline),
// `npm run stitch` (the measured part-B factor) and `npm run lineup`.
//
// Two proxies, both measured against the idle loop of the same pack:
//   head  the head SILHOUETTE including hair (hair is what makes Killua's head read big, so it must count): the
//         palette of colours that are much denser at the top of the idle figure than in its lower body, opened with a
//         3x3 cross (drops 1-2 px outlines and strands that weld the head to the body), split into 8-connected blobs;
//         the highest blob of at least 20 % of the idle head area is the head, holes (eyes, shading) filled.
//         head scale = median(sqrt(area ratio), width ratio, height ratio) against the idle median.
//   feet  sqrt(count of shoe colours / the idle's): a second, independent body-scale proxy. A strip whose head AND feet
//         are off in the same direction was drawn (or packed) at the wrong size: 'uniform', fixable by rescaling.
//         A head that is off while the feet match is a drawing problem: 'drift', fixed only by a redraw.
// They are proxies (a raised arm in hair colours or an afterimage fools them), so a flagged frame needs eyes, a pose
// they cannot read is exempted with a written reason, and every review attaches the heads contact sheet.

export const GATE_DEFAULTS = Object.freeze({
  stripTol: 0.06, // |median head of a strip - 1| above this flags it (CHARACTER_SCALE.md: within +-6 % of the idle)
  popTol: 0.12, // largest minus smallest head inside one strip above this = a size pop (two parts at two scales)
  feetAgree: 0.04, // feet off by more than this in the head's direction: the whole person is off ('uniform') ...
  feetShare: 0.33, // ... when the feet also confirm at least this share of the head's error (a head 34 % small with
  // feet 5 % small is a smaller head drawn on the same body, not a smaller person: rescaling it would grow the body)
  fitMin: 0.75, // the auto head fit never rescales a strip by less than this ...
  fitMax: 1.33, // ... or more than this (beyond that the art must be redrawn, not resampled)
  baselineTol: 0.03, // an approved strip whose head moved more than this at the same version is reported
  // tumbling, lying, tucked and afterimage poses: the head is upside down, hidden or doubled
  lowConf: Object.freeze(['launched', 'spin', 'down', 'ko', 'airRecover', 'getup', 'jumpSquat', 'vanish']),
});

// A manifest spec.scaleGate block -> the thresholds (a malformed key is reported in `issues` and keeps its default).
export function resolveGate(raw, issues = []) {
  const g = { ...GATE_DEFAULTS, lowConf: [...GATE_DEFAULTS.lowConf] };
  if (raw == null) return g;
  if (typeof raw !== 'object' || Array.isArray(raw)) { issues.push(`spec.scaleGate must be an object - using the defaults`); return g; }
  const num = (k, lo, hi) => {
    if (raw[k] === undefined) return;
    if (typeof raw[k] === 'number' && raw[k] >= lo && raw[k] <= hi) g[k] = raw[k];
    else issues.push(`spec.scaleGate.${k} is ${JSON.stringify(raw[k])} - must be a number ${lo}-${hi}; using ${g[k]}`);
  };
  num('stripTol', 0.01, 0.5); num('popTol', 0.02, 1); num('feetAgree', 0, 0.5); num('feetShare', 0, 1); num('fitMin', 0.3, 1); num('fitMax', 1, 3); num('baselineTol', 0.005, 0.5);
  if (raw.lowConf !== undefined) {
    if (Array.isArray(raw.lowConf) && raw.lowConf.every((n) => typeof n === 'string')) g.lowConf = [...raw.lowConf];
    else issues.push('spec.scaleGate.lowConf must be a list of animation names - using the defaults');
  }
  return g;
}

// ------------------------------------------------------------------ small helpers
export const median = (v) => {
  const s = v.filter(Number.isFinite).sort((a, b) => a - b);
  if (!s.length) return NaN;
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const r3 = (v) => (Number.isFinite(v) ? Math.round(v * 1000) / 1000 : null);
// warm, light, red-over-green-over-blue colours: skin is never part of the head palette (faces change with the pose)
export const isSkin = (c) => { const r = c >> 16, g = (c >> 8) & 255, b = c & 255; return r > 170 && g > 110 && r > g && g > b && r - b > 22 && r - b < 130 && g - b < 80; };
export const hex = (k) => '#' + k.toString(16).padStart(6, '0');
const parseHex = (s) => (typeof s === 'string' && /^#?[0-9a-f]{6}$/i.test(s) ? parseInt(s.replace('#', ''), 16) : null);
const keyAt = (d, i) => (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
const dist = (a, b) => Math.hypot((a >> 16) - (b >> 16), ((a >> 8) & 255) - ((b >> 8) & 255), (a & 255) - (b & 255));

export function bboxOf(cell) {
  const { w, h, data: d } = cell;
  let x0 = w, y0 = h, x1 = -1, y1 = -1, area = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (d[(y * w + x) * 4 + 3] < 128) continue;
    area++;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return x1 < 0 ? null : { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1, area };
}

// The probe matches colours exactly, so unquantized art (a first raw import: tens of thousands of shades) is snapped to
// one palette shared by all its cells first: the packer's --quantize median cut over the same cells in the same order,
// so a pack measures the same with or without --quantize 48.
export function sharedPalette(cells, n = 48) {
  const colors = new Map();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) {
    const k = keyAt(c.data, i);
    colors.set(k, (colors.get(k) || 0) + 1);
  }
  if (colors.size <= n) return null; // already within the palette: exact colours
  let boxes = [[...colors.entries()].map(([k, cnt]) => [k >> 16, (k >> 8) & 255, k & 255, cnt])];
  while (boxes.length < n) {
    let bi = -1, bestRange = -1, ch = 0;
    boxes.forEach((bx, i) => {
      if (bx.length < 2) return;
      for (let c = 0; c < 3; c++) {
        let mn = 255, mx = 0;
        for (const p of bx) { if (p[c] < mn) mn = p[c]; if (p[c] > mx) mx = p[c]; }
        if (mx - mn > bestRange) { bestRange = mx - mn; bi = i; ch = c; }
      }
    });
    if (bi < 0 || bestRange <= 0) break;
    const bx = boxes[bi].sort((a, b) => a[ch] - b[ch]);
    const total = bx.reduce((s, p) => s + p[3], 0);
    let acc = 0, cut = 1;
    for (let i = 0; i < bx.length - 1; i++) { acc += bx[i][3]; if (acc >= total / 2) { cut = i + 1; break; } }
    boxes.splice(bi, 1, bx.slice(0, cut), bx.slice(cut));
  }
  return boxes.map((bx) => {
    let r = 0, g = 0, b = 0, t = 0;
    for (const p of bx) { r += p[0] * p[3]; g += p[1] * p[3]; b += p[2] * p[3]; t += p[3]; }
    return [Math.round(r / t), Math.round(g / t), Math.round(b / t)];
  });
}

export function applyPalette(cells, palette) {
  const out = cells.map((c) => ({ w: c.w, h: c.h, data: Uint8Array.from(c.data) }));
  if (!palette) return out;
  const cache = new Map();
  for (const c of out) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) {
    const k = keyAt(c.data, i);
    let p = cache.get(k);
    if (!p) {
      let bd = Infinity;
      for (const q of palette) { const dd = (q[0] - c.data[i]) ** 2 + (q[1] - c.data[i + 1]) ** 2 + (q[2] - c.data[i + 2]) ** 2; if (dd < bd) { bd = dd; p = q; } }
      cache.set(k, p);
    }
    c.data[i] = p[0]; c.data[i + 1] = p[1]; c.data[i + 2] = p[2];
  }
  return out;
}

export const quantizeCopies = (cells, n = 48) => applyPalette(cells, sharedPalette(cells, n));

// Raw art compared with an already packed idle (a stitch's parts): every colour is snapped to the nearest of the
// idle's colours, so "drawn in the idle's hair colours" holds for a fresh generation's own shades. The distance weighs
// brightness double over hue (luma + the two chroma axes): a more saturated hair yellow must still read as the hair,
// not as the jacket's darker orange. Colours farther than maxDist from every idle colour stay unmatched.
const yCbCr = (k) => { const r = k >> 16, g = (k >> 8) & 255, b = k & 255, y = 0.299 * r + 0.587 * g + 0.114 * b; return [y, b - y, r - y]; };
export function snapToPalette(cells, refCells, maxDist = 80) {
  const ref = [];
  const seen = new Set();
  for (const c of refCells) for (let i = 0; i < c.data.length; i += 4) {
    if (c.data[i + 3] < 128) continue;
    const k = keyAt(c.data, i);
    if (!seen.has(k)) { seen.add(k); ref.push([k, yCbCr(k)]); }
  }
  const cache = new Map();
  return cells.map((c) => {
    const out = { w: c.w, h: c.h, data: Uint8Array.from(c.data) }, d = out.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      const k = keyAt(d, i);
      let q = cache.get(k);
      if (q === undefined) {
        const [y, cb, cr] = yCbCr(k);
        let bd = Infinity;
        q = k;
        for (const [rk, [ry, rb, rr]] of ref) {
          const dd = (2 * (y - ry)) ** 2 + (cb - rb) ** 2 + (cr - rr) ** 2;
          if (dd < bd) { bd = dd; if (dd <= maxDist * maxDist) q = rk; }
        }
        cache.set(k, q);
      }
      d[i] = q >> 16; d[i + 1] = (q >> 8) & 255; d[i + 2] = q & 255;
    }
    return out;
  });
}

export function countColors(cells) {
  const s = new Set();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3] >= 128) s.add(keyAt(c.data, i));
  return s.size;
}

// ------------------------------------------------------------------ palettes
// Declared colours (art/scale/builds.json headColors / feetColors, e.g. Sasuke's hair drawn in outline shades): each
// selects the idle colours within RGB distance 10 of it (the same paint split into near shades) and always the nearest
// one within 40, so a palette that shifted a little after a repack (a new strip changes the shared median cut) still
// matches.
function matchDeclared(list, idleColors) {
  const out = new Set();
  for (const s of list) {
    const want = parseHex(s);
    if (want == null) continue;
    let best = null, bd = Infinity;
    for (const k of idleColors) {
      const dd = dist(k, want);
      if (dd <= 10) out.add(k);
      if (dd < bd) { bd = dd; best = k; }
    }
    if (best != null && bd <= 40) out.add(best);
  }
  return out;
}

// Head and feet palettes from the idle loop: head = non-skin colours >= 1.5x denser in the top 12 % of the figure than
// in its lower 60 %; feet = non-skin colours >= 3x denser in the bottom 7 % than above it. decl overrides either.
export function palettesFromIdle(idleCells, decl = {}) {
  const zones = { top: new Map(), low: new Map(), feet: new Map(), above: new Map() }, N = { top: 0, low: 0, feet: 0, above: 0 };
  const add = (z, k) => { zones[z].set(k, (zones[z].get(k) || 0) + 1); N[z]++; };
  const all = new Set();
  for (const c of idleCells) {
    const b = bboxOf(c);
    if (!b) continue;
    for (let y = b.y0; y <= b.y1; y++) for (let x = b.x0; x <= b.x1; x++) {
      const i = (y * c.w + x) * 4;
      if (c.data[i + 3] < 128) continue;
      const k = keyAt(c.data, i);
      all.add(k);
      const r = (y - b.y0) / b.h;
      if (r < 0.12) add('top', k); else if (r >= 0.4) add('low', k);
      if (r >= 0.93) add('feet', k); else add('above', k);
    }
  }
  const dens = (z, k) => (zones[z].get(k) || 0) / Math.max(1, N[z]);
  let head = new Set(), feet = new Set();
  for (const [k, n] of zones.top) if (!isSkin(k) && n >= N.top * 0.01 && dens('top', k) >= 1.5 * dens('low', k)) head.add(k);
  for (const [k, n] of zones.feet) if (!isSkin(k) && n >= N.feet * 0.01 && dens('feet', k) >= 3 * dens('above', k)) feet.add(k);
  let headSource = 'auto', feetSource = 'auto';
  if (Array.isArray(decl.headColors) && decl.headColors.length) { head = matchDeclared(decl.headColors, all); headSource = 'declared'; }
  if (Array.isArray(decl.feetColors) && decl.feetColors.length) { feet = matchDeclared(decl.feetColors, all); feetSource = 'declared'; }
  return { head, feet, headSource, feetSource };
}

// ------------------------------------------------------------------ blobs
const CROSS = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
function open(mask, W, H) {
  const er = new Uint8Array(W * H), di = new Uint8Array(W * H);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const p = y * W + x;
    if (mask[p] && mask[p - 1] && mask[p + 1] && mask[p - W] && mask[p + W]) er[p] = 1;
  }
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (er[y * W + x]) for (const [dx, dy] of CROSS) di[(y + dy) * W + x + dx] = 1;
  return di;
}

function blobs(mask, W, H) {
  const lab = new Int32Array(W * H).fill(-1), q = new Int32Array(W * H), out = [];
  for (let s = 0; s < W * H; s++) {
    if (!mask[s] || lab[s] >= 0) continue;
    const id = out.length;
    let qh = 0, qn = 0, x0 = W, y0 = H, x1 = -1, y1 = -1, sy = 0;
    q[qn++] = s; lab[s] = id;
    while (qh < qn) {
      const v = q[qh++], x = v % W, y = (v / W) | 0;
      sy += y; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const j = yy * W + xx;
        if (mask[j] && lab[j] < 0) { lab[j] = id; q[qn++] = j; }
      }
    }
    out.push({ id, area: qn, x0, y0, x1, y1, cy: sy / qn });
  }
  return { lab, out };
}

// area of a blob with its holes filled (a hole = background not reachable from the border of the blob's box)
function filledArea(b, lab, W) {
  const bw = b.x1 - b.x0 + 3, bh = b.y1 - b.y0 + 3, seen = new Uint8Array(bw * bh), q = new Int32Array(bw * bh);
  const inBlob = (x, y) => { const X = x + b.x0 - 1, Y = y + b.y0 - 1; return X >= 0 && Y >= 0 && X < W && lab[Y * W + X] === b.id; };
  let qn = 0, outside = 0;
  q[qn++] = 0; seen[0] = 1;
  while (qn) {
    const v = q[--qn], x = v % bw, y = (v / bw) | 0;
    outside++;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= bw || yy >= bh) continue;
      const j = yy * bw + xx;
      if (!seen[j] && !inBlob(xx, yy)) { seen[j] = 1; q[qn++] = j; }
    }
  }
  return bw * bh - outside;
}

// ------------------------------------------------------------------ probes
// The head blob of one cell: { area (holes filled), w, h, box: [x0, y0, x1, y1] } or null.
export function probeHead(cell, pal, refArea = null) {
  const { w: W, h: H, data: d } = cell, m = new Uint8Array(W * H);
  if (!pal.head.size) return null;
  for (let p = 0; p < W * H; p++) { const i = p * 4; if (d[i + 3] >= 128 && pal.head.has(keyAt(d, i))) m[p] = 1; }
  const { lab, out } = blobs(open(m, W, H), W, H);
  const min = refArea ? refArea * 0.2 : 40;
  let best = null;
  for (const b of out) if (b.area >= min && (!best || b.cy < best.cy)) best = b;
  if (!best) return null;
  return { area: filledArea(best, lab, W), w: best.x1 - best.x0 + 1, h: best.y1 - best.y0 + 1, box: [best.x0, best.y0, best.x1, best.y1] };
}

export function probeFeet(cell, pal) {
  const d = cell.data;
  let n = 0;
  if (!pal.feet.size) return 0;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] >= 128 && pal.feet.has(keyAt(d, i))) n++;
  return n;
}

// The idle reference: median head blob over the loop (a first pass finds the typical area, so a stray small blob on
// one frame cannot become the head), the shoe count, and idle f0's head box (drawn as the ghost in the lab and sheets).
export function makeReference(idleCells, pal) {
  const h0 = median(idleCells.map((c) => probeHead(c, pal, null)?.area));
  if (!Number.isFinite(h0)) return null;
  const ih = idleCells.map((c) => probeHead(c, pal, h0));
  const ref = {
    hA: median(ih.map((h) => h?.area)), hW: median(ih.map((h) => h?.w)), hH: median(ih.map((h) => h?.h)),
    feet: median(idleCells.map((c) => probeFeet(c, pal))),
  };
  if (!Number.isFinite(ref.hA)) return null;
  ref.box = ih.find(Boolean)?.box ?? null;
  ref.headPx = [Math.round(ref.hW), Math.round(ref.hH)];
  return ref;
}

export function measureFrame(cell, ref, pal) {
  const h = probeHead(cell, pal, ref.hA), ft = probeFeet(cell, pal);
  const head = h ? median([Math.sqrt(h.area / ref.hA), h.w / ref.hW, h.h / ref.hH]) : NaN;
  const feet = ref.feet > 0 && ft > ref.feet * 0.3 ? Math.sqrt(ft / ref.feet) : NaN;
  return { head: r3(head), feet: r3(feet), box: h?.box ?? null };
}

// One strip against the reference. exempt: { reason, frames: [k] } from the manifest (scaleExempt / scaleExemptFrames).
// Verdicts: ok | uniform (head and feet off together: rescale) | drift (head off, body not: redraw) | pop (two sizes
// inside the strip: re-stitch or redraw) | unmeasured (a low-confidence pose or no head found) | exempt.
export function auditStrip(name, cells, ref, pal, gate = GATE_DEFAULTS, exempt = {}) {
  const skip = new Set(Array.isArray(exempt.frames) ? exempt.frames : []);
  const frames = cells.map((c, k) => ({ k, ...measureFrame(c, ref, pal), skipped: skip.has(k) || undefined }));
  const use = frames.filter((f) => !f.skipped && f.head != null);
  const heads = use.map((f) => f.head);
  const head = r3(median(heads)), feet = r3(median(use.map((f) => f.feet)));
  let lo = null, hi = null;
  for (const f of use) { if (!lo || f.head < lo.head) lo = f; if (!hi || f.head > hi.head) hi = f; }
  const range = heads.length > 1 ? r3(hi.head - lo.head) : 0;
  let verdict, reason = null;
  if (exempt.reason) { verdict = 'exempt'; reason = exempt.reason; }
  else if (gate.lowConf.includes(name)) { verdict = 'unmeasured'; reason = 'low-confidence pose (tumbling, lying, tucked or afterimage)'; }
  else if (!heads.length) { verdict = 'unmeasured'; reason = 'no head found in any frame'; }
  else if (range > gate.popTol) verdict = 'pop';
  else if (Math.abs(head - 1) <= gate.stripTol) verdict = 'ok';
  else if (feet != null && Math.sign(head - 1) === Math.sign(feet - 1) && Math.abs(feet - 1) > gate.feetAgree &&
    Math.abs(feet - 1) >= gate.feetShare * Math.abs(head - 1)) verdict = 'uniform';
  else verdict = 'drift';
  return { head, feet, range, verdict, reason, lo: lo && { k: lo.k, head: lo.head }, hi: hi && { k: hi.k, head: hi.head }, frames };
}

export const FLAGGED = new Set(['uniform', 'drift', 'pop']);

// One-line explanation and fix for a flagged strip (packer warnings, `npm run scale`).
export function verdictText(name, s) {
  const p = (v) => (v == null ? '-' : v.toFixed(2));
  if (s.verdict === 'pop') return `${name} pops inside the strip: f${s.lo.k} ${p(s.lo.head)} vs f${s.hi.k} ${p(s.hi.head)} of the idle head (two parts at two scales?) - re-stitch with a measured factor (npm run stitch) or redraw`;
  if (s.verdict === 'uniform') return `${name} head ${p(s.head)} of idle (feet ${p(s.feet)}): the whole figure is off - re-import with the auto head fit (sidecar anatomy { "measurement": "auto-head" }) or fix the strip's bodyHeight`;
  if (s.verdict === 'drift') return `${name} head ${p(s.head)} of idle (feet ${s.feet == null ? 'not measurable' : p(s.feet)}): head/hair drift - redraw to the approved idle head (head_scale_guide.png)`;
  if (s.verdict === 'unmeasured') return `${name}: ${s.reason || 'not measured'} - check it on the heads sheet (npm run scale); if the head is really hidden, exempt the strip with a reason ("scaleExempt" and "scaleExemptVersion" in the manifest)`;
  return `${name}: ${s.verdict}`;
}

// Per-animation exemptions from a manifest character's animations: "scaleExempt": "reason" exempts the whole strip,
// "scaleExemptFrames": { "4": "reason" } (or a plain list of frame numbers) leaves those frames out of the median.
// "scaleExemptVersion": N ties both to the drawing they were written for: a redraw (any other version) is measured
// again until someone looks at it and re-exempts it on purpose. Without it they only cover an unversioned strip.
export function exemptionsFrom(animations) {
  const out = {};
  for (const [name, v] of Object.entries(animations && typeof animations === 'object' ? animations : {})) {
    if (!v || typeof v !== 'object') continue;
    const reason = typeof v.scaleExempt === 'string' && v.scaleExempt.trim() ? v.scaleExempt.trim() : null;
    const fr = v.scaleExemptFrames;
    const frames = (Array.isArray(fr) ? fr : fr && typeof fr === 'object' ? Object.keys(fr) : []).map(Number).filter((k) => Number.isInteger(k) && k >= 0);
    if (reason || frames.length) out[name] = { reason, frames, v: Number.isInteger(v.scaleExemptVersion) ? v.scaleExemptVersion : null };
  }
  return out;
}

// One-line explanation for an exemption that does not cover the packed version (packer warnings, `npm run scale`).
export function staleExemptText(name, x) {
  const vv = (n) => `v${String(n).padStart(2, '0')}`;
  return `${name}: the manifest's scale exemption ${x.v == null ? 'has no "scaleExemptVersion"' : `was written for ${vv(x.v)}`} but the packed strip is ${x.version == null ? 'unversioned' : vv(x.version)} - measured; if this drawing hides the head too (check the heads sheet), re-exempt it with "scaleExemptVersion": ${x.version ?? 'null'}`;
}

// A whole character: anims = [{ name, cells, version }] with idle among them; decl = builds.json fighter entry;
// exempt = { anim: { reason, frames, v } } (exemptionsFrom): it applies only to the strip version v; another version
// is measured and carries `staleExempt` instead. Unquantized cells are snapped to one shared palette first
// (sharedPalette). Returns { error } when there is no idle or no head can be found in it.
export function auditCharacter(anims, { decl = {}, gate = GATE_DEFAULTS, exempt = {}, maxColors = 48 } = {}) {
  const all = anims.flatMap((a) => a.cells);
  if (countColors(all) > maxColors) {
    const q = quantizeCopies(all, maxColors);
    let i = 0;
    anims = anims.map((a) => ({ ...a, cells: a.cells.map(() => q[i++]) }));
  }
  const idle = anims.find((a) => a.name === 'idle');
  if (!idle?.cells.length) return { error: 'no idle packed - nothing to measure against' };
  const pal = palettesFromIdle(idle.cells, decl);
  const ref = makeReference(idle.cells, pal);
  if (!ref) return { error: `no head found in the idle (${pal.head.size} head colour(s), ${pal.headSource}) - declare headColors in art/scale/builds.json`, palette: pal };
  const out = { palette: pal, ref, anims: {} };
  for (const a of anims) {
    const x = a.name === 'idle' ? null : exempt[a.name], own = x && x.v === (a.version ?? null);
    const s = a.name === 'idle' ? { ...auditStrip('idle', a.cells, ref, pal, { ...gate, lowConf: [] }), verdict: 'ref', reason: null } : auditStrip(a.name, a.cells, ref, pal, gate, own ? x : {});
    if (x && !own) s.staleExempt = { v: x.v, version: a.version ?? null };
    s.version = a.version ?? null;
    out.anims[a.name] = s;
  }
  return out;
}

// The compact audit the packer writes into anims.json (meta.scaleAudit) for the runtime check (?scaleaudit) and the
// lab's ghost head box: per animation its head, feet, verdict, version and each frame's head and probe box.
export function compactAudit(A, gate = GATE_DEFAULTS) {
  const anims = {};
  for (const [name, s] of Object.entries(A.anims)) {
    anims[name] = { head: s.head, feet: s.feet, verdict: s.verdict, v: s.version, frames: s.frames.map((f) => f.head), boxes: s.frames.map((f) => f.box) };
  }
  return { tool: 'tools/scale-probe.mjs', tol: gate.stripTol, pop: gate.popTol, ref: { box: A.ref.box, headPx: A.ref.headPx, palette: A.palette.headSource }, anims };
}
