// Ground-damage decal packer (ADR 0024): art/decals/ -> public/decals/atlas.json + one PNG page per style group.
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
// Pages stay <= 2048 px a side: the phone texture limit the rest of the game keeps to.
export const DECAL = Object.freeze({ ppu: 64, page: 2048, fill: 0.97, maxColors: 24, hotMin: 250, cool: 246 });
export const DECAL_GROUPS = Object.freeze(['base', 'edge', 'lightning', 'fire', 'chakra', 'cursed', 'ki']);

// The engine contract (ADR 0024): every name, its cell, variant count, page group, mode and color rule. Names, cells,
// groups and modes are fixed by the engine; the manifest restates them and drift is warned.
// - directional: drawn with the motion left to right (the engine rotates the cell along the motion);
// - hotKey: pure #FFFFFF texels are glowing seams (the engine glows them in the tint, then cools them);
// - tinted: white/grey only, the engine multiplies the barrier color in (rendered additive).
const spec = (w, h, variants, group, extra = {}) => Object.freeze({
  cell: Object.freeze([w, h]), variants, group, mode: 'flat', tinted: false, directional: false, hotKey: false, fill: DECAL.fill, ...extra,
});
export const DECAL_SPECS = Object.freeze({
  crack_s: spec(256, 256, 8, 'base'),
  crack: spec(256, 256, 8, 'base'),
  crater: spec(256, 256, 8, 'base'),
  crater_big: spec(512, 512, 6, 'base'),
  crater_huge: spec(512, 512, 4, 'base'),
  fracture_ring: spec(512, 512, 4, 'base'),
  scuff: spec(256, 128, 8, 'base', { directional: true }),
  skid: spec(512, 128, 4, 'base', { directional: true }),
  rubble: spec(256, 256, 6, 'base'),
  dirt_crater: spec(256, 256, 4, 'edge'),
  dirt_skid: spec(512, 128, 3, 'edge', { directional: true }),
  barrier_crack: spec(256, 256, 6, 'edge', { mode: 'wall', tinted: true }),
  crater_wall: spec(512, 512, 4, 'edge', { mode: 'wall' }),
  burn_lightning: spec(256, 256, 6, 'lightning', { hotKey: true }),
  burn_lightning_big: spec(512, 512, 4, 'lightning', { hotKey: true }),
  fracture_lightning: spec(512, 512, 2, 'lightning', { hotKey: true }),
  burn_fire: spec(256, 256, 6, 'fire', { hotKey: true }),
  burn_black: spec(256, 256, 4, 'fire'),
  scour_spiral: spec(256, 256, 6, 'chakra', { hotKey: true }),
  scour_spiral_big: spec(512, 512, 3, 'chakra', { hotKey: true }),
  cut_wind: spec(256, 256, 6, 'chakra', { hotKey: true }),
  claw: spec(512, 256, 4, 'chakra', { directional: true, hotKey: true }),
  scorch_chakra: spec(512, 512, 3, 'chakra', { directional: true, hotKey: true }),
  fracture_chakra: spec(512, 512, 2, 'chakra', { hotKey: true }),
  erasure: spec(256, 256, 3, 'cursed', { hotKey: true }),
  // the Hollow Purple path is stamped as a chain of these: the trench must reach both cell ends to tile along x
  erasure_trench: spec(512, 256, 3, 'cursed', { directional: true, hotKey: true, fill: Object.freeze([1, DECAL.fill]) }),
  crush_implode: spec(256, 256, 4, 'cursed'),
  gouge_repel: spec(512, 256, 4, 'cursed', { directional: true, hotKey: true }),
  fracture_cursed: spec(256, 256, 4, 'cursed', { hotKey: true }),
  fracture_cursed_big: spec(512, 512, 2, 'cursed', { hotKey: true }),
  scorch_ki: spec(256, 256, 4, 'ki', { hotKey: true }),
});

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
    for (const k of ['tinted', 'hotKey', 'directional']) if (typeof v[k] === 'boolean' && v[k] !== it[k]) drift.push(`${k} ${v[k]} (packer ${it[k]})`);
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

// One raw image (or each part) -> trimmed variants at source resolution, tagged with the image they came from: each
// image gets its own scale (generated images drift in scale from one to the next, a row inside one image does not).
function variantsFromRaw(name, it, files, parts, side, env, H, warn, notes) {
  const out = [];
  const sideTol = Number(side.tolerance ?? side.tol);
  const tol = sideTol > 0 ? sideTol : env.tol;
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
    const expected = Number(ps.frames ?? (one ? side.frames : undefined)) || (one ? it.variants : 0);
    const split = (ps.split ?? (one ? side.split : undefined)) === 'even' ? 'even' : 'auto';
    const { rects, notes: n2 } = H.splitStrip(img, expected, { split, mode: 'vfx' });
    notes.push(...n2.map((n) => (letter ? `${letter}: ${n}` : n)));
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

// Fit loose variants into cells: one scale per source image, so its largest variant fills `fill` of the cell (the
// engine sizes a decal by its whole cell, cracks included) while the other variants keep their size relative to it.
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
  let clipped = 0;
  const cells = items.map((x) => {
    if (x.final) return x.img;
    const s = H.resample(x.img, scales.get(x.group), { coverage: 0.34, alphaMin: 128 });
    binarize(s);
    const cell = H.newImage(W, Hh);
    clipped += H.blit(cell, s, Math.round((W - s.w) / 2), Math.round((Hh - s.h) / 2));
    return cell;
  });
  if (clipped) notes.push(`${clipped} px clipped by the ${W}x${Hh} cell`);
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

// ============================================================== pages
// Shelf packing per style group, tallest cells first. A name never spans two pages (the engine binds one texture per
// decal), so each name is placed whole on the first page whose shelves take every variant, else on a new page.
function shelfPlace(page, w, h, n) {
  const shelves = page.shelves.map((s) => ({ ...s }));
  let used = page.used;
  const at = [];
  for (let k = 0; k < n; k++) {
    let s = shelves.find((q) => h <= q.h && q.x + w <= DECAL.page);
    if (!s) {
      if (used + h > DECAL.page || w > DECAL.page) return null;
      s = { y: used, h, x: 0 };
      shelves.push(s);
      used += h;
    }
    at.push([s.x, s.y]);
    s.x += w;
  }
  page.shelves = shelves;
  page.used = used;
  return at;
}

function layoutPages(packed) {
  const pages = [];
  for (const g of DECAL_GROUPS) {
    const list = packed.filter((p) => p.it.group === g).sort((a, b) => b.it.cell[1] - a.it.cell[1] || a.order - b.order);
    const own = [];
    for (const p of list) {
      const [w, h] = p.it.cell;
      let at = null, page = null;
      for (const q of own) if ((at = shelfPlace(q, w, h, p.cells.length))) { page = q; break; }
      if (!at) {
        page = { group: g, shelves: [], used: 0, items: [] };
        at = shelfPlace(page, w, h, p.cells.length);
        if (!at) throw new Error(`${p.name}: ${p.cells.length} variants of ${w}x${h} do not fit one ${DECAL.page}x${DECAL.page} page`);
        own.push(page);
      }
      p.at = at;
      page.items.push(p);
    }
    own.forEach((q, k) => {
      q.file = own.length === 1 ? `decals_${g}.png` : `decals_${g}_${k + 1}.png`;
      q.w = Math.max(...q.shelves.map((s) => s.x));
      q.h = q.used;
      pages.push(q);
    });
  }
  return pages;
}

// ============================================================== pack
export function packDecals(env, H) {
  const R = { packed: [], missing: [], failed: [], unapproved: [], removed: [], preview: !!env.candidates, versions: {}, pages: [], variants: 0, warnings: [], notes: [], wrote: [], writeback: [] };
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
  const meta = { ppu: DECAL.ppu, source: env.candidates ? 'candidates' : 'approved', packer: H.PACKER_VERSION, pages: pages.map((p) => p.file), pageSizes: pages.map((p) => [p.w, p.h]), decals: {} };
  for (const [k, pg] of pages.entries()) {
    const img = H.newImage(pg.w, pg.h);
    for (const p of pg.items) { p.page = k; p.cells.forEach((c, i) => H.blit(img, c, p.at[i][0], p.at[i][1])); }
    H.writeFile(env, path.join(out, pg.file), H.encodePng(img), R);
    R.pages.push({ file: pg.file, group: pg.group, size: [pg.w, pg.h], decals: pg.items.map((p) => p.name) });
  }
  for (const p of [...packed].sort((a, b) => a.order - b.order)) {
    const it = p.it;
    meta.decals[p.name] = { page: p.page, w: it.cell[0], h: it.cell[1], frames: p.at, mode: it.mode, tinted: it.tinted, group: it.group,
      ...(it.directional ? { directional: true } : {}), ...(it.hotKey ? { hotKey: true } : {}), version: p.version };
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
    L(`  packed ${r.packed.length} decals, ${r.variants} variants -> ${r.pages.length} page(s): ${r.pages.map((p) => `${p.file} ${p.size.join('x')}`).join(', ')}`);
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
