// Ground-damage decal packer (ADR 0024): art/decals/ -> public/decals/atlas.json + the PNG pages of each page set.
//
//   npm run sprites decals                            approved decals only -> public/decals/
//   node tools/pack-sprites.mjs decals --candidates   every latest candidate -> public/preview/decals/ (?art=custom)
//
// tools/pack-sprites.mjs owns the CLI, the options and the report header, and calls packDecals(env, H). H holds that
// file's image and file helpers: importing them would run its CLI, and a copy would let the two background removers
// drift apart. Briefs and prompts: art/decals/README.md, DECALS.md, PROMPTS.md. Engine side: src/game/ground.js and
// the procedural fallback src/art/decalPainter.js, which builds the same JSON shape in memory.

import fs from 'node:fs';
import path from 'node:path';

// ppu 64 matches the approved ringTop texture (64 px per world unit), so a decal's pixels sit at the floor's density.
// Pages stay <= 2048 px a side: the phone texture limit the rest of the game keeps to. matchPages: the most decal pages
// the engine uploads for one match, its procedural pages included (GROUND.caps.pages in src/game/ground.js, ADR 0024).
export const DECAL = Object.freeze({ ppu: 64, page: 2048, fill: 0.97, maxColors: 24, hotMin: 250, cool: 246, matchPages: 4 });
export const DECAL_GROUPS = Object.freeze(['base', 'edge', 'lightning', 'fire', 'chakra', 'cursed', 'ki']);

// Page sets: the style groups that share pages. Every match needs the floor set (base + edge) plus the element set of
// each fighter's looks, so with every name approved a pairing loads 2 floor pages + at most 2 element pages, which is
// the engine's cap. One page set per group made 8 pages, and the engine dropped most element art back to procedural.
// A new fighter's element names belong in one set, or its pairings cost a page more (the report checks the worst pair).
export const DECAL_PAGE_SETS = Object.freeze({
  base: Object.freeze(['base', 'edge']),
  chakra: Object.freeze(['chakra', 'ki']),
  lightning: Object.freeze(['lightning', 'fire']),
  cursed: Object.freeze(['cursed']),
});
const FLOOR_SET = 'base';
const SET_OF = Object.fromEntries(Object.entries(DECAL_PAGE_SETS).flatMap(([set, groups]) => groups.map((g) => [g, set])));

// The engine contract (ADR 0024): every name, its cell, images, page group, mode and color rule. Names, cells,
// groups and modes are fixed by the engine; the manifest restates them and drift is warned.
// - images: the brief's variants per image (art/decals/DECALS.md); their sum is the variant count. Each part of a raw
//   version is split into its own share, so a broken ring or a detached chip stays one variant and the variants keep
//   the brief's order (crater_wall: image A = the body-shaped holes, image B = the round holes);
// - directional: drawn with the motion left to right (the engine rotates the cell along the motion);
// - hotKey: pure #FFFFFF texels are glowing seams (the engine glows them in the tint, then cools them);
// - tinted: white/grey only, the engine multiplies the barrier color in (rendered additive);
// - tile: the engine repeats one variant along a path (`tile` in src/art/decalPainter.js), so every variant is
//   stretched to the full cell width.
const spec = (w, h, images, group, extra = {}) => Object.freeze({
  cell: Object.freeze([w, h]), images: Object.freeze(images), variants: images.reduce((a, b) => a + b, 0), group,
  mode: 'flat', tinted: false, directional: false, hotKey: false, tile: false, fill: DECAL.fill, ...extra,
});
export const DECAL_SPECS = Object.freeze({
  crack_s: spec(256, 256, [3, 3, 2], 'base'),
  crack: spec(256, 256, [3, 3, 2], 'base'),
  crater: spec(256, 256, [3, 3, 2], 'base'),
  crater_big: spec(512, 512, [2, 2, 2], 'base'),
  crater_huge: spec(512, 512, [2, 2], 'base'),
  fracture_ring: spec(512, 512, [2, 2], 'base'),
  scuff: spec(256, 128, [4, 4], 'base', { directional: true }),
  skid: spec(512, 128, [2, 2], 'base', { directional: true }),
  rubble: spec(256, 256, [3, 3], 'base'),
  dirt_crater: spec(256, 256, [2, 2], 'edge'),
  dirt_skid: spec(512, 128, [2, 1], 'edge', { directional: true }),
  barrier_crack: spec(256, 256, [3, 3], 'edge', { mode: 'wall', tinted: true }),
  crater_wall: spec(512, 512, [2, 2], 'edge', { mode: 'wall' }),
  burn_lightning: spec(256, 256, [3, 3], 'lightning', { hotKey: true }),
  burn_lightning_big: spec(512, 512, [2, 2], 'lightning', { hotKey: true }),
  fracture_lightning: spec(512, 512, [2], 'lightning', { hotKey: true }),
  burn_fire: spec(256, 256, [3, 3], 'fire', { hotKey: true }),
  burn_black: spec(256, 256, [2, 2], 'fire'),
  scour_spiral: spec(256, 256, [3, 3], 'chakra', { hotKey: true }),
  scour_spiral_big: spec(512, 512, [2, 1], 'chakra', { hotKey: true }),
  cut_wind: spec(256, 256, [3, 3], 'chakra', { hotKey: true }),
  claw: spec(512, 256, [2, 2], 'chakra', { directional: true, hotKey: true }),
  scorch_chakra: spec(512, 512, [2, 1], 'chakra', { directional: true, hotKey: true }),
  fracture_chakra: spec(512, 512, [2], 'chakra', { hotKey: true }),
  erasure: spec(256, 256, [3], 'cursed', { hotKey: true }),
  // the Hollow Purple path: one variant repeated along each straight run
  erasure_trench: spec(512, 256, [2, 1], 'cursed', { directional: true, hotKey: true, tile: true, fill: Object.freeze([1, DECAL.fill]) }),
  crush_implode: spec(256, 256, [2, 2], 'cursed'),
  gouge_repel: spec(512, 256, [2, 2], 'cursed', { directional: true, hotKey: true }),
  fracture_cursed: spec(256, 256, [2, 2], 'cursed', { hotKey: true }),
  fracture_cursed_big: spec(512, 512, [2], 'cursed', { hotKey: true }),
  scorch_ki: spec(256, 256, [2, 2], 'ki', { hotKey: true }),
});
for (const [name, s] of Object.entries(DECAL_SPECS)) if (!SET_OF[s.group]) throw new Error(`DECAL_SPECS.${name}: group "${s.group}" is in no DECAL_PAGE_SETS entry`);

const PAGE_RE = /^decals_[a-z0-9]+(?:_\d+)?\.png$/i;
// raw/<name>_vNN.png, or parts raw/<name>_vNN_A.png, _B.png ... of one version (concatenated in letter order)
const RAW_RE = /^(.+?)_v(\d+)(?:_([a-z]))?\.png$/i;
const SIDE_RE = /^(.+?)(?:_v(\d+))?\.json$/i;
const natural = (a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
const listEntries = (p) => { try { return fs.readdirSync(p, { withFileTypes: true }); } catch { return []; } };
const listFiles = (p) => listEntries(p).filter((d) => d.isFile()).map((d) => d.name).sort(natural);
const listDirs = (p) => listEntries(p).filter((d) => d.isDirectory()).map((d) => d.name).sort(natural);
const listPngs = (p) => listFiles(p).filter((n) => /\.png$/i.test(n));
const vv = (n) => `v${String(n).padStart(2, '0')}`;
const fillOf = (f) => (Array.isArray(f) ? [f[0], f[1]] : [f, f]);
const validFill = (f) => (typeof f === 'number' && f >= 0.3 && f <= 1) || (Array.isArray(f) && f.length === 2 && f.every((v) => typeof v === 'number' && v >= 0.3 && v <= 1));

// ============================================================== manifest
// Per-name spec = DECAL_SPECS + the manifest's decals.items.<name> (approvedVersion, expected variants, fill) +
// approvals recorded on worldArt.decal batches (decal-<name>, decal-<name>-rN; highest wins), like the VFX gate.
function decalItems(raw, H, warn) {
  const items = {};
  for (const [name, s] of Object.entries(DECAL_SPECS)) items[name] = { name, ...s, approvedVersion: null };
  const m = raw?.decals?.items;
  for (const [name, v] of Object.entries(m && typeof m === 'object' && !Array.isArray(m) ? m : {})) {
    if (name.startsWith('_') || !v || typeof v !== 'object') continue;
    const it = items[name];
    if (!it) { warn(`manifest decals.items.${name}: not an engine decal name - ignored (the names are fixed by the engine contract, ADR 0024)`); continue; }
    if (Number.isInteger(v.approvedVersion) && v.approvedVersion > 0) it.approvedVersion = v.approvedVersion;
    if (Number.isInteger(v.variants) && v.variants > 0) it.variants = v.variants;
    if (v.fill !== undefined) {
      if (validFill(v.fill)) it.fill = v.fill;
      else warn(`manifest decals.items.${name}.fill is ${JSON.stringify(v.fill)} - must be 0.3-1 or [x, y]; using ${JSON.stringify(it.fill)}`);
    }
    const drift = [];
    if (v.cell !== undefined && JSON.stringify(v.cell) !== JSON.stringify(it.cell)) drift.push(`cell ${JSON.stringify(v.cell)} (packer ${JSON.stringify(it.cell)})`);
    for (const k of ['group', 'mode']) if (v[k] !== undefined && v[k] !== it[k]) drift.push(`${k} ${JSON.stringify(v[k])} (packer "${it[k]}")`);
    for (const k of ['tinted', 'hotKey', 'directional', 'tile']) if (typeof v[k] === 'boolean' && v[k] !== it[k]) drift.push(`${k} ${v[k]} (packer ${it[k]})`);
    if (typeof v.colorRule === 'string' && /tint/i.test(v.colorRule) !== it.tinted) drift.push(`colorRule "${v.colorRule}" (packer ${it.tinted ? 'tinted' : 'fullColor'})`);
    if (drift.length) warn(`manifest decals.items.${name}: ${drift.join(', ')} - the engine contract wins; fix the manifest`);
  }
  for (const [name, v] of H.worldApprovals(raw, 'decal')) {
    if (!items[name]) { if (name !== 'decal_style_sheet') warn(`manifest worldArt.decal: "${name}" is approved but is not an engine decal name - ignored`); continue; }
    if (v > (items[name].approvedVersion || 0)) items[name].approvedVersion = v;
  }
  return items;
}

// ============================================================== raw files
// Index art/decals/raw/ by name. Subfolders (_rejected/, _old/ ...) are never read.
function scanDecalRaw(dir, names, warn) {
  const byLower = new Map(names.map((n) => [n.toLowerCase(), n]));
  const idx = new Map();
  const get = (n) => {
    if (!idx.has(n)) idx.set(n, { versions: new Map(), sidecar: null, versionSidecars: new Map() });
    return idx.get(n);
  };
  for (const f of listFiles(dir)) {
    if (f.startsWith('.') || /^readme/i.test(f)) continue;
    if (/\.(jpe?g|webp|gif|bmp|avif)$/i.test(f)) { warn(`decals/raw/${f}: not a PNG - save it as .png`); continue; }
    if (/\.json$/i.test(f)) {
      const sm = SIDE_RE.exec(f);
      const name = sm && byLower.get(sm[1].toLowerCase());
      if (!name) { warn(`decals/raw/${f}: sidecar for an unknown decal name - ignored`); continue; }
      if (sm[2]) get(name).versionSidecars.set(Number(sm[2]), path.join(dir, f));
      else get(name).sidecar = path.join(dir, f);
      continue;
    }
    if (!/\.png$/i.test(f)) continue;
    const m = RAW_RE.exec(f);
    const name = m && byLower.get(m[1].toLowerCase());
    if (!name) {
      const plain = byLower.get(f.slice(0, -4).toLowerCase());
      if (plain) warn(`decals/raw/${f}: unversioned - rename it to ${plain}_vNN.png (the next free version)`);
      else warn(`decals/raw/${f}: unrecognized name - use <name>_vNN.png or the parts <name>_vNN_A.png, _B.png ... (names: art/decals/DECALS.md)`);
      continue;
    }
    const n = Number(m[2]);
    const part = m[3] ? m[3].toUpperCase() : null;
    const want = `${name}_${vv(n)}${part ? `_${part}` : ''}.png`;
    if (m[1] !== name || (m[3] && m[3] !== part)) warn(`decals/raw/${f}: rename to ${want} (case)`);
    else if (m[2].length < 2) warn(`decals/raw/${f}: use a two-digit version - rename to ${want}`);
    const e = get(name);
    if (!e.versions.has(n)) e.versions.set(n, { plain: null, parts: new Map() });
    const ver = e.versions.get(n);
    if (part ? ver.parts.has(part) : ver.plain) { warn(`decals/raw/${f}: ${want} is listed twice - ignored`); continue; }
    if (part) ver.parts.set(part, path.join(dir, f));
    else ver.plain = path.join(dir, f);
  }
  return idx;
}

// The raw source of one version (`want`, else the highest): its file list (a plain image, else its parts in letter
// order) in the shape chooseSource() expects.
function pickDecalRaw(entry, name, want, warn) {
  if (!entry?.versions.size) return null;
  const nums = [...entry.versions.keys()];
  const n = want != null && entry.versions.has(want) ? want : Math.max(...nums);
  if (want != null && n !== want) return null;
  const ver = entry.versions.get(n);
  const letters = [...ver.parts.keys()].sort();
  const sidecars = [entry.sidecar, entry.versionSidecars.get(n)].filter(Boolean);
  if (ver.plain) {
    if (letters.length) warn(`${name}: raw/${name}_${vv(n)}.png and its parts ${letters.join(', ')} both exist - using the whole image, parts ignored`);
    return { files: [ver.plain], strip: true, version: n, label: `raw/${path.basename(ver.plain)}`, sidecars, ignored: [], parts: null };
  }
  const gaps = letters.filter((l, k) => l !== String.fromCharCode(65 + k));
  if (gaps.length) warn(`${name}: ${vv(n)} has parts ${letters.join(', ')} - a letter is missing (parts are A, B, C ... in order)`);
  const label = letters.length === 1 ? `raw/${name}_${vv(n)}_${letters[0]}.png` : `raw/${name}_${vv(n)}_{${letters.join(',')}}.png`;
  return { files: letters.map((l) => ver.parts.get(l)), strip: true, version: n, label, sidecars, ignored: [], parts: letters };
}

// ============================================================== frames
const binarize = (img) => {
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] >= 128) d[i] = 255;
    else d[i - 3] = d[i - 2] = d[i - 1] = d[i] = 0;
  }
};

// More pieces than the image's share of variants: a broken ring, a hole with a detached chip. The brief draws the
// variants in one row of equal imaginary slots, so pieces stacked in one column belong together, and the cuts go into
// the gaps nearest the even slot boundaries. The widest gaps are not enough: a ring's empty middle can be wider than
// the gap between two rings. Returns the merged rects (left to right), or null when nothing to do or no clean answer.
function regroup(rects, n) {
  if (!(n > 0) || rects.length <= n) return null;
  const cols = [];
  for (const r of [...rects].sort((a, b) => a.x0 - b.x0)) {
    const c = cols[cols.length - 1];
    if (c && r.x0 < c.x1) Object.assign(c, { x1: Math.max(c.x1, r.x1), y0: Math.min(c.y0, r.y0), y1: Math.max(c.y1, r.y1) });
    else cols.push({ ...r });
  }
  if (cols.length <= n) return cols.length === n ? cols : null; // fewer columns: a grid of rows, left to the count warning
  // choose n - 1 of the m - 1 gaps (in order) closest to the even cuts; a wider gap wins a tie
  const m = cols.length, X0 = cols[0].x0, X1 = cols[m - 1].x1, K = n - 1;
  const cost = (j, g) => {
    const t = X0 + ((j + 1) * (X1 - X0)) / n, lo = cols[g].x1, hi = cols[g + 1].x0;
    return Math.max(0, lo - t, t - hi) - (hi - lo) * 1e-3;
  };
  const D = Array.from({ length: K }, () => new Float64Array(m - 1).fill(Infinity));
  const P = Array.from({ length: K }, () => new Int32Array(m - 1).fill(-1));
  for (let g = 0; g < m - 1; g++) D[0][g] = cost(0, g);
  for (let j = 1; j < K; j++) for (let g = j; g < m - 1; g++) for (let q = j - 1; q < g; q++) {
    const v = D[j - 1][q] + cost(j, g);
    if (v < D[j][g]) { D[j][g] = v; P[j][g] = q; }
  }
  const cuts = [];
  if (K > 0) {
    let g = 0;
    for (let q = 1; q < m - 1; q++) if (D[K - 1][q] < D[K - 1][g]) g = q;
    for (let j = K - 1; j >= 0; j--) { cuts.unshift(g); g = P[j][g]; }
  }
  const out = [];
  let from = 0;
  for (const g of [...cuts, m - 1]) {
    const part = cols.slice(from, g + 1);
    out.push({ x0: part[0].x0, x1: part[part.length - 1].x1, y0: Math.min(...part.map((c) => c.y0)), y1: Math.max(...part.map((c) => c.y1)) });
    from = g + 1;
  }
  return out;
}

// One raw image (or each part) -> trimmed variants at source resolution, tagged with the image they came from: each
// image gets its own scale (generated images drift in scale from one to the next, a row inside one image does not).
function variantsFromRaw(name, it, files, parts, side, env, H, warn, notes) {
  const out = [];
  const sideTol = Number(side.tolerance ?? side.tol);
  const tol = sideTol > 0 ? sideTol : env.tol;
  // the brief's share per image (by part letter) when the delivery has the brief's number of images and the
  // manifest's variant count still matches it; otherwise each part is split at its gaps without a count
  const plan = it.images.reduce((a, b) => a + b, 0) === it.variants ? it.images : [];
  const byPlan = !!parts && parts.length === plan.length;
  if (parts && !byPlan) notes.push(`${parts.length} image(s), the brief has ${plan.length ? `${plan.length} (${plan.join('/')})` : 'another count'}: each split at its gaps (set the counts in raw/${name}.json "parts")`);
  files.forEach((f, k) => {
    const letter = parts ? parts[k] : null;
    const ps = (letter && side.parts && typeof side.parts === 'object' && side.parts[letter]) || {};
    let img;
    try { img = H.readPng(f); } catch (e) { warn(`${name}: cannot read ${path.basename(f)} (${e.message})`); return; }
    const bg = H.removeBackground(img, { tol, mode: 'char' });
    if (!bg.magentaBg && !bg.removed && !H.hasTransparency(img)) warn(`${name}: ${path.basename(f)} has no removable background (use flat magenta #FF00FF)`);
    else if (bg.foreign && bg.removed) warn(`${name}: ${path.basename(f)} background ${bg.foreign} is not magenta #FF00FF - removed with half tolerance; regenerate on magenta`);
    // pebbles are small on purpose: only single noise specks go
    const sp = H.removeSpecks(img, { frac: 0, min: 4 });
    if (sp.blobs > 3) notes.push(`removed ${sp.blobs} specks`);
    const one = files.length === 1;
    const share = !letter ? it.variants : byPlan ? plan[letter.charCodeAt(0) - 65] : 0;
    const expected = Number(ps.frames ?? (one ? side.frames : undefined)) || share || 0;
    const split = (ps.split ?? (one ? side.split : undefined)) === 'even' ? 'even' : 'auto';
    // split at every gap first: splitStrip's own count fitting joins the narrowest gaps, which can be the gap between
    // two rings rather than a ring's empty middle (regroup decides by slot instead). Its count is only for too few
    // pieces: touching variants cut at the valleys.
    let { rects, notes: n2 } = H.splitStrip(img, split === 'even' ? expected : 0, { split, mode: 'vfx' });
    if (split !== 'even' && expected > 0 && rects.length < expected) ({ rects, notes: n2 } = H.splitStrip(img, expected, { split, mode: 'vfx' }));
    const tag = letter ? `${letter}: ` : '';
    notes.push(...n2.map((n) => tag + n));
    const merged = regroup(rects, expected);
    if (merged) {
      notes.push(`${tag}${rects.length} pieces joined into ${expected} variants by slot (a broken outline or a detached chip; if this image really holds more, set ${letter ? `"parts": { "${letter}": { "frames": N } }` : '"frames"'} in raw/${name}.json)`);
      rects = merged;
    }
    let got = 0;
    for (const r of rects) {
      const piece = H.crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
      const b = H.bbox(piece);
      if (!b) continue;
      out.push({ img: H.crop(piece, b.x0, b.y0, b.w, b.h), final: false, group: k });
      got++;
    }
    if (!got) warn(`${name}: ${path.basename(f)} is empty after background removal`);
  });
  if (Array.isArray(side.drop) && side.drop.length) {
    const drop = new Set(side.drop.map(Number).filter((k) => Number.isInteger(k) && k >= 0 && k < out.length));
    const bad = side.drop.filter((k) => !drop.has(Number(k)));
    if (bad.length) warn(`${name}: sidecar "drop" ${JSON.stringify(bad)} ignored - variant indices are 0-${out.length - 1}`);
    if (drop.size) {
      notes.push(`dropped variant(s) ${[...drop].join(',')} (sidecar)`);
      return out.filter((_, k) => !drop.has(k));
    }
  }
  return out;
}

// frames/<name>/*.png: a file of exactly the cell size is a final cell (used as drawn); anything else is a hand-made
// variant that gets cleaned and fitted like a raw one (all of them on one shared scale).
function variantsFromFolder(name, it, dir, files, env, H, warn) {
  const [W, Hh] = it.cell;
  const out = [];
  for (const f of files) {
    let img;
    try { img = H.readPng(path.join(dir, f)); } catch (e) { warn(`${name}: cannot read frames/${name}/${f} (${e.message})`); continue; }
    if (img.w === W && img.h === Hh) { binarize(img); out.push({ img, final: true, group: 0 }); continue; }
    H.removeBackground(img, { tol: env.tol, mode: 'char' });
    const b = H.bbox(img);
    if (b) out.push({ img: H.crop(img, b.x0, b.y0, b.w, b.h), final: false, group: 0 });
    else warn(`${name}: frames/${name}/${f} is empty`);
  }
  return out;
}

const SAMPLE = Object.freeze({ coverage: 0.34, alphaMin: 128 });
// Resize to an exact size (x and y apart): mode sampling when either axis shrinks (it is nearest on a growing axis).
const resizeTo = (img, w2, h2, H) => (w2 === img.w && h2 === img.h ? img
  : w2 >= img.w && h2 >= img.h ? H.upscaleNearest(img, w2, h2) : H.downscaleMode(img, w2, h2, SAMPLE));

// Mode sampling can drop a sparse end column: stretch the opaque columns back over the full width (a few px at most).
function spanWidth(img, H) {
  const b = H.bbox(img);
  if (!b || (b.x0 === 0 && b.x1 === img.w - 1)) return img;
  return H.upscaleNearest(H.crop(img, b.x0, 0, b.w, img.h), img.w, img.h);
}

// Fit loose variants into cells: one scale per source image, so its largest variant fills `fill` of the cell (the
// engine sizes a decal by its whole cell, cracks included) while the other variants keep their size relative to it.
// Tiling names: the engine repeats one variant along a path (fract(u * reps)), so each variant spans the full cell
// width on its own (its own x scale; the height keeps the image's scale), or every repeat would show a gap.
function fitCells(items, it, H, notes) {
  const [W, Hh] = it.cell;
  const [fx, fy] = fillOf(it.fill);
  const scales = new Map();
  for (const g of new Set(items.filter((x) => !x.final).map((x) => x.group))) {
    const list = items.filter((x) => !x.final && x.group === g).map((x) => x.img);
    const mw = Math.max(...list.map((s) => s.w)), mh = Math.max(...list.map((s) => s.h));
    let s = Math.min((fx * W) / mw, (fy * Hh) / mh);
    if (Math.abs(s - 1) < 0.005) s = 1;
    scales.set(g, s);
  }
  let clipped = 0, stretch = 1;
  const cells = items.map((x) => {
    if (x.final) return x.img;
    const sc = scales.get(x.group);
    let s;
    if (it.tile) {
      const h2 = Math.max(1, Math.round(x.img.h * sc));
      s = resizeTo(x.img, W, h2, H);
      const r = (W / x.img.w) / (h2 / x.img.h);
      stretch = Math.max(stretch, r, 1 / r);
    } else s = H.resample(x.img, sc, SAMPLE);
    binarize(s);
    if (it.tile) s = spanWidth(s, H);
    const cell = H.newImage(W, Hh);
    clipped += H.blit(cell, s, it.tile ? 0 : Math.round((W - s.w) / 2), Math.round((Hh - s.h) / 2));
    return cell;
  });
  if (clipped) notes.push(`${clipped} px clipped by the ${W}x${Hh} cell`);
  if (stretch > 1.1) notes.push(`stretched up to x${stretch.toFixed(2)} along one axis to span the cell (draw it about ${W / Hh}:1)`);
  const up = [...scales.values()].filter((s) => s > 1.05);
  if (up.length) notes.push(`upscaled x${Math.max(...up).toFixed(2)} (the art is smaller than the cell: fewer variants per image give more detail)`);
  return { cells, scales: [...scales.values()].map((s) => +s.toFixed(3)) };
}

// ============================================================== colors
const isWhite = (d, i) => d[i] === 255 && d[i + 1] === 255 && d[i + 2] === 255;
const nearWhite = (d, i) => d[i] >= DECAL.hotMin && d[i + 1] >= DECAL.hotMin && d[i + 2] >= DECAL.hotMin;

// Only pure #FFFFFF glows (the hot key). Hot-key decals: near-white snaps to it. Everything else that is (or a
// palette average turns) near-white is toned down to #F6F6F6, so the engine never glows a pixel by accident.
function toneWhites(cells, hotKey, { snap }) {
  let n = 0;
  for (const c of cells) {
    const d = c.data;
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3] || !nearWhite(d, i)) continue;
      if (hotKey && (snap || isWhite(d, i))) { if (!isWhite(d, i)) { d[i] = d[i + 1] = d[i + 2] = 255; n++; } continue; }
      d[i] = Math.min(d[i], DECAL.cool); d[i + 1] = Math.min(d[i + 1], DECAL.cool); d[i + 2] = Math.min(d[i + 2], DECAL.cool);
      n++;
    }
  }
  return n;
}

// Median cut to <= n colors per name. The hot key is hidden from the cut (alpha 0 = skipped by quantizeFrames) and
// restored untouched, so averaging never turns the seams into an off-white that would not glow.
function quantizeKeepingKey(cells, n, keepWhite, H) {
  const masks = cells.map((c) => {
    const idx = [];
    if (keepWhite) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3] && isWhite(c.data, i)) { idx.push(i); c.data[i + 3] = 0; }
    return idx;
  });
  const hidden = masks.some((m) => m.length);
  H.quantizeFrames(cells, hidden ? n - 1 : n);
  cells.forEach((c, k) => { for (const i of masks[k]) c.data[i + 3] = 255; });
}

// Magenta, hot pink, purple and violet never belong in a decal (the engine tints Gojo's and Amaterasu's marks).
function purpleShare(cells) {
  let p = 0, o = 0;
  for (const c of cells) {
    const d = c.data;
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      o++;
      if (Math.min(d[i], d[i + 2]) - d[i + 1] > 30 && d[i + 2] - d[i + 1] > 50) p++;
    }
  }
  return o ? p / o : 0;
}

function countWhite(cells) {
  let n = 0;
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3] && isWhite(c.data, i)) n++;
  return n;
}

// ============================================================== tiling
const colSpan = (c, x) => {
  let y0 = -1, y1 = -1;
  for (let y = 0; y < c.h; y++) if (c.data[(y * c.w + x) * 4 + 3]) { if (y0 < 0) y0 = y; y1 = y; }
  return [y0, y1];
};

// A tiling variant must reach both cell ends (a hand-edited frame may not), and its two ends should have the same
// profile (same width, same rim height), or the seam shows at every repeat.
function tileCheck(cells, H) {
  const gaps = [], seams = [];
  cells.forEach((c, k) => {
    const b = H.bbox(c);
    if (!b || b.x0 > 0 || b.x1 < c.w - 1) { gaps.push(b ? `${k} (x ${b.x0}-${b.x1})` : `${k} (empty)`); return; }
    const L = colSpan(c, 0), R = colSpan(c, c.w - 1), tol = Math.max(4, Math.round(c.h * 0.06));
    if (Math.abs(L[0] - R[0]) > tol || Math.abs(L[1] - R[1]) > tol) seams.push(`${k} (rows ${L[0]}-${L[1]} | ${R[0]}-${R[1]})`);
  });
  return { gaps, seams };
}

// ============================================================== pages
// Every contract cell is a multiple of UNIT (128 px), so a page is a small occupancy grid. First fit in reading order,
// biggest cells first, fills pages edge to edge: the whole floor set (base + edge, the area of 123 of the 128 256-px
// slots two pages hold) fits 2 pages this way, where shelves left holes under the short cells and needed 3.
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const UNIT = Object.values(DECAL_SPECS).reduce((g, s) => gcd(gcd(g, s.cell[0]), s.cell[1]), DECAL.page);
const GRID = DECAL.page / UNIT;

// n cells of w x h on one page, each at the first free spot in reading order; all or nothing.
function gridPlace(page, w, h, n) {
  const bw = w / UNIT, bh = h / UNIT;
  const g = page.grid.slice();
  const free = (bx, by) => {
    for (let y = by; y < by + bh; y++) for (let x = bx; x < bx + bw; x++) if (g[y * GRID + x]) return false;
    return true;
  };
  const at = [];
  for (let k = 0; k < n; k++) {
    let spot = null;
    for (let by = 0; by + bh <= GRID && !spot; by++) for (let bx = 0; bx + bw <= GRID; bx++) if (free(bx, by)) { spot = [bx, by]; break; }
    if (!spot) return null;
    for (let y = spot[1]; y < spot[1] + bh; y++) g.fill(1, y * GRID + spot[0], y * GRID + spot[0] + bw);
    at.push([spot[0] * UNIT, spot[1] * UNIT]);
  }
  page.grid = g;
  return at;
}

// Per page set. A name never spans two pages (the engine binds one texture per decal), so each name goes whole onto
// the first page with room for every variant, else onto a new page.
function layoutPages(packed) {
  const pages = [];
  for (const set of Object.keys(DECAL_PAGE_SETS)) {
    const area = (p) => p.it.cell[0] * p.it.cell[1];
    const list = packed.filter((p) => SET_OF[p.it.group] === set).sort((a, b) => area(b) - area(a) || b.it.cell[1] - a.it.cell[1] || a.order - b.order);
    const own = [];
    for (const p of list) {
      const [w, h] = p.it.cell;
      let at = null, page = null;
      for (const q of own) if ((at = gridPlace(q, w, h, p.cells.length))) { page = q; break; }
      if (!at) {
        page = { set, grid: new Uint8Array(GRID * GRID), items: [] };
        at = gridPlace(page, w, h, p.cells.length);
        if (!at) throw new Error(`${p.name}: ${p.cells.length} variants of ${w}x${h} do not fit one ${DECAL.page}x${DECAL.page} page`);
        own.push(page);
      }
      p.at = at;
      page.items.push(p);
    }
    own.forEach((q, k) => {
      q.file = own.length === 1 ? `decals_${set}.png` : `decals_${set}_${k + 1}.png`;
      q.w = Math.max(...q.items.flatMap((p) => p.at.map(([x]) => x + p.it.cell[0])));
      q.h = Math.max(...q.items.flatMap((p) => p.at.map(([, y]) => y + p.it.cell[1])));
      q.groups = DECAL_PAGE_SETS[set].filter((g) => q.items.some((p) => p.it.group === g));
      pages.push(q);
    });
  }
  return pages;
}

// Custom pages one match uploads: the floor set's always, plus the element set of each fighter's looks. The worst
// pairing is the floor pages + the two biggest element sets; over the engine's cap it drops pages and their approved
// art falls back to procedural (src/game/ground.js use()).
function pageBudget(pages) {
  const sets = {};
  for (const p of pages) sets[p.set] = (sets[p.set] || 0) + 1;
  const floor = sets[FLOOR_SET] || 0;
  const two = Object.entries(sets).filter(([s]) => s !== FLOOR_SET).sort((a, b) => b[1] - a[1]).slice(0, 2);
  return { cap: DECAL.matchPages, floor, sets, worst: floor + two.reduce((a, [, n]) => a + n, 0), worstPair: two.map(([s]) => s) };
}

// ============================================================== pack
export function packDecals(env, H) {
  const R = { packed: [], missing: [], failed: [], unapproved: [], removed: [], preview: !!env.candidates, versions: {}, pages: [], budget: null, variants: 0, warnings: [], notes: [], wrote: [], writeback: [] };
  const warn = (m) => R.warnings.push(m);
  const root = path.join(env.artDir, 'decals');
  const out = H.worldOut(env, 'decals');
  const stalePages = (keep) => listPngs(out).filter((f) => PAGE_RE.test(f) && !keep.includes(f));
  const items = decalItems(env.manifestRaw, H, warn);
  const names = Object.keys(items);
  const rawIdx = scanDecalRaw(path.join(root, 'raw'), names, warn);
  const framesRoot = path.join(root, 'frames');
  for (const d of listDirs(framesRoot)) if (!names.includes(d) && listPngs(path.join(framesRoot, d)).length) warn(`decals/frames/${d}/: unknown decal name - ignored (the engine names are fixed)`);

  const packed = [];
  names.forEach((name, order) => {
    const it = items[name];
    try {
      const entry = rawIdx.get(name);
      const latest = pickDecalRaw(entry, name, null, () => {});
      if (latest) R.versions[name] = latest.version;
      if (!env.candidates && !it.approvedVersion) { R.unapproved.push(name); return; }
      // ship the approved version even when a newer candidate waits for review
      const raw = env.candidates ? pickDecalRaw(entry, name, null, warn) : pickDecalRaw(entry, name, it.approvedVersion, warn);
      const framesDir = path.join(framesRoot, name);
      const [fx, fy] = fillOf(it.fill);
      const cell = { w: it.cell[0], h: it.cell[1], fill: [fx, fy] };
      const src = H.chooseSource(framesDir, raw, { bodyHeight: null, cell, artDir: env.artDir }, warn, name);
      if (!src) {
        if (!env.candidates) warn(`${name}: ${vv(it.approvedVersion)} is approved but raw/${name}_${vv(it.approvedVersion)}.png (or its parts) is missing`);
        R.missing.push(name);
        return;
      }
      if (src.kind === 'stale') { warn(H.staleText(name, name, src)); R.missing.push(name); return; }
      const notes = [];
      let items2, sourceLabel, origin = null, version = null;
      if (src.kind === 'frames') {
        items2 = variantsFromFolder(name, it, framesDir, src.framePngs, env, H, warn);
        sourceLabel = `frames/${name}/`;
        if (src.origin) ({ file: origin, version } = src.origin);
      } else {
        const side = H.readSidecars(raw.sidecars, warn, name);
        items2 = variantsFromRaw(name, it, src.rawFiles, raw.parts, side, env, H, warn, notes);
        sourceLabel = origin = src.label;
        version = src.version;
        if (src.replaced) notes.push(`re-imported: replaces frames/ cleaned from ${src.replaced}`);
      }
      if (!items2.length) { warn(`${name}: no pixels found in ${sourceLabel}`); R.missing.push(name); R.failed.push(name); return; }
      if (!env.candidates && latest?.version > (version ?? 0)) notes.push(`newer candidate ${vv(latest.version)} not shipped (approve it to ship it)`);
      if (!env.candidates && version != null && version !== it.approvedVersion) {
        warn(`${name}: the source is ${vv(version)} but ${vv(it.approvedVersion)} is approved - not packed (approve ${vv(version)} or move it to raw/_rejected/)`);
        R.unapproved.push(name);
        return;
      }
      const { cells, scales } = fitCells(items2, it, H, notes);
      if (it.tile) {
        const { gaps, seams } = tileCheck(cells, H);
        if (gaps.length) warn(`${name}: variant(s) ${gaps.join(', ')} do not reach both ends of the ${it.cell[0]} px cell - the engine repeats it along a path, so every repeat shows a gap (fix frames/${name}/ or draw it the full width of its slot)`);
        if (seams.length) notes.push(`ends differ in variant(s) ${seams.join(', ')}: the seam shows at every repeat`);
      }
      if (it.tinted) {
        const colored = Math.max(...cells.map(H.toGreyscale));
        if (colored > 0.05) warn(`${name}: drawn in color but the engine tints it - converted to greyscale (draw it white/grey only)`);
      } else {
        const purple = purpleShare(cells);
        if (purple > 0.002) warn(`${name}: ${(purple * 100).toFixed(1)}% of the pixels are magenta/pink/purple - never inside a decal (the engine tints purple at runtime); redraw in the DECALS.md palette`);
        const toned = toneWhites(cells, it.hotKey, { snap: true });
        if (toned) notes.push(it.hotKey ? `${toned} near-white px snapped to the #FFFFFF hot key` : `${toned} near-white px toned down to #F6F6F6 (no hot key in ${name})`);
      }
      quantizeKeepingKey(cells, DECAL.maxColors, it.hotKey, H);
      if (!it.tinted) toneWhites(cells, it.hotKey, { snap: false });
      const hot = it.hotKey ? countWhite(cells) : 0;
      if (it.hotKey && !hot) warn(`${name}: no pure #FFFFFF hot-key pixels - the engine has no seams to glow (draw the hot seams in #FFFFFF)`);
      if (cells.length !== it.variants) warn(`${name}: ${cells.length} variant(s), expected ${it.variants}`);
      packed.push({ name, it, order, cells, src, sourceLabel, origin, version, notes, scales, hot, colors: H.countColors(cells), edited: !!src.edited, handMade: src.kind === 'frames' && !src.packerMade });
    } catch (err) {
      warn(`${name}: failed - ${err.message}`);
      R.missing.push(name);
      R.failed.push(name);
    }
  });

  if (!packed.length) { H.removeOutputs(env, out, ['atlas.json', ...stalePages([])], R); return R; }
  let pages;
  try { pages = layoutPages(packed); } catch (e) { warn(`page layout failed - ${e.message}; nothing written`); return R; }
  R.budget = pageBudget(pages);
  if (R.budget.worst > R.budget.cap) {
    warn(`a match can need ${R.budget.worst} decal pages (floor ${R.budget.floor} + ${R.budget.worstPair.map((s) => `${s} ${R.budget.sets[s]}`).join(' + ')}) - over the engine's ${R.budget.cap}-page cap, so it drops pages and their approved art stays procedural (fewer variants, or rethink DECAL_PAGE_SETS)`);
  }
  const meta = { ppu: DECAL.ppu, source: env.candidates ? 'candidates' : 'approved', packer: H.PACKER_VERSION, pages: pages.map((p) => p.file), pageSizes: pages.map((p) => [p.w, p.h]), decals: {} };
  for (const [k, pg] of pages.entries()) {
    const img = H.newImage(pg.w, pg.h);
    for (const p of pg.items) { p.page = k; p.cells.forEach((c, i) => H.blit(img, c, p.at[i][0], p.at[i][1])); }
    H.writeFile(env, path.join(out, pg.file), H.encodePng(img), R);
    R.pages.push({ file: pg.file, set: pg.set, groups: pg.groups, size: [pg.w, pg.h], decals: pg.items.map((p) => p.name) });
  }
  for (const p of [...packed].sort((a, b) => a.order - b.order)) {
    const it = p.it;
    meta.decals[p.name] = { page: p.page, w: it.cell[0], h: it.cell[1], frames: p.at, mode: it.mode, tinted: it.tinted, group: it.group,
      ...(it.directional ? { directional: true } : {}), ...(it.hotKey ? { hotKey: true } : {}), ...(it.tile ? { tile: true } : {}), version: p.version };
    R.packed.push({ name: p.name, group: it.group, page: pages[p.page].file, variants: p.cells.length, expected: it.variants, source: p.sourceLabel, from: p.origin, version: p.version,
      edited: p.edited, handMade: p.handMade, scale: p.scales, colors: p.colors, hot: p.hot, notes: [...new Set(p.notes)] });
    R.variants += p.cells.length;
  }
  H.writeFile(env, path.join(out, 'atlas.json'), Buffer.from(H.stringifyCompact(meta) + '\n'), R);
  // public/ only holds this run's pages: a page whose decals lost their approval (or moved) stops shipping
  H.removeOutputs(env, out, stalePages(pages.map((p) => p.file)), R);
  for (const p of packed) if (p.src.kind === 'raw') {
    const [fx, fy] = fillOf(p.it.fill);
    H.writeBack(env, path.join(framesRoot, p.name), p.name, p.cells, p.src, R, { cell: { w: p.it.cell[0], h: p.it.cell[1], fill: [fx, fy] } });
  }
  return R;
}

// ============================================================== --update-manifest + report
// Raises decals.items.<name>.status (packed / raw) and version (highest raw _vNN), like the VFX effects.
export function updateDecalStatus(raw, rep, raiseStatus, raiseVersion) {
  const items = raw?.decals?.items;
  if (!rep || !items || typeof items !== 'object') return 0;
  let n = 0;
  for (const p of rep.packed) n += raiseStatus(items[p.name], 'packed');
  for (const e of rep.failed) n += raiseStatus(items[e], 'raw');
  for (const [e, v] of Object.entries(rep.versions || {})) { n += raiseVersion(items[e], v); n += raiseStatus(items[e], 'raw'); }
  return n;
}

export function printDecalReport(r, { dryRun = false, L = console.log } = {}) {
  if (!r) return;
  const unapproved = Array.isArray(r.unapproved) ? r.unapproved : [];
  L('');
  L(`== decals ${'='.repeat(54)}`);
  if (r.preview) L('  candidates: every decal with a raw, approved or not -> preview/decals/ (the game shows it with ?art=custom)');
  else if (unapproved.length) L(`  not approved yet (${unapproved.length}, procedural in game; preview with --candidates): ${unapproved.join(', ')}`);
  if (!r.packed?.length) L(`  nothing packed${unapproved.length && !r.preview ? ' (no approved decals)' : ' (no PNGs in art/decals/raw/ or art/decals/frames/<name>/)'} - the game keeps its procedural decals`);
  else {
    L(`  packed ${r.packed.length} decals, ${r.variants} variants -> ${r.pages.length} page(s): ${r.pages.map((p) => `${p.file} ${p.size.join('x')}${p.groups?.length > 1 ? ` (${p.groups.join('+')})` : ''}`).join(', ')}`);
    const b = r.budget;
    if (b) L(`  pages per match: floor ${b.floor} + one element set per fighter (${Object.entries(b.sets).filter(([s]) => s !== FLOOR_SET).map(([s, n]) => `${s} ${n}`).join(', ') || 'none packed'}); worst pairing ${b.worst} of the engine's ${b.cap}${b.worst > b.cap ? ' - OVER' : ''}`);
    for (const p of r.packed) {
      const n = `${p.variants}`.padStart(2) + (p.variants !== p.expected ? `/${p.expected}` : '');
      const from = !p.source.startsWith('frames/') ? p.source : p.handMade ? `${p.source} (hand-made)` : p.edited ? `${p.source} (hand-edited${p.from ? `, from ${p.from}` : ''})` : p.from ? `${p.source} (${p.from})` : p.source;
      const extra = [`${p.colors} colors`, ...(p.hot ? [`${p.hot} hot px`] : []), ...p.notes];
      L(`    ${p.name.padEnd(19)} ${n.padEnd(5)} <- ${from.padEnd(30)} x${p.scale.join('/') || '1'}  (${extra.join('; ')})`);
    }
  }
  if (r.missing?.length && r.packed?.length) L(`  missing (procedural fallback): ${r.missing.join(', ')}`);
  for (const w of r.warnings) L(`  ! ${w}`);
  for (const f of r.wrote) L(`  wrote ${f}`);
  if (r.writeback?.length) L(`  cleaned variants written back to ${r.writeback.length} folder(s) under art/decals/frames/`);
  for (const f of r.removed) L(`  ${dryRun ? 'would remove' : 'removed'} ${f} (not approved / no source any more)`);
}
