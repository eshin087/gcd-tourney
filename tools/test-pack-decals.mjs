#!/usr/bin/env node
// Regression test for the decal kind of the sprite packer (tools/pack-decals.mjs, ADR 0024).
//   npm run test:sprites runs it after the sprite tests (fixtures in tools/.test-fixtures/decals/).
//   node tools/test-pack-decals.mjs [--keep] runs it alone.
// Generates fake generator-style decal rows (magenta background, 4x "art pixels", per-pixel color noise, magenta
// fringe), packs them into a scratch output folder and checks the atlas contract the engine reads: cells, pages,
// approval gate, candidates, parts, hot key, greyscale, colors, binary alpha, write-back. Never touches art/ or public/.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { DECAL_SPECS } from './pack-decals.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKER = path.join(TOOL_DIR, 'pack-sprites.mjs');

function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
function savePng(file, img) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const png = new PNG({ width: img.w, height: img.h });
  png.data = Buffer.from(img.data);
  fs.writeFileSync(file, PNG.sync.write(png));
}
const loadPng = (file) => { const p = PNG.sync.read(fs.readFileSync(file)); return { w: p.width, h: p.height, data: p.data }; };

// palettes from art/decals/DECALS.md (a few tones each; the noise adds hundreds of near colors)
const STONE = [[87, 70, 56], [143, 118, 99], [176, 154, 130], [210, 193, 168], [227, 213, 191]];
const SOOT = [[30, 26, 24], [42, 36, 32], [58, 48, 42], [94, 107, 120], [140, 154, 168]];
const ICE = [[150, 205, 250], [180, 222, 255], [120, 190, 245]];

// One row of n variants on a 1536 x 1024 magenta canvas. Each variant is an ellipse of 4 px art pixels whose rings
// step through the palette (center = first tone), with +-10 noise per art pixel, sizes relative to the slot.
// seam: 'near' = a hot seam in near-white (#FCFBFD-ish), 'white' = pure #FFFFFF; purple: a violet patch.
function decalRow(sizes, { seed, aspect = 1, palette = STONE, seam = null, purple = false, w = 1536, h = 1024 }) {
  const S = 4;
  const rand = mulberry(seed);
  const img = { w, h, data: new Uint8Array(w * h * 4), mask: new Uint8Array(w * h) };
  for (let i = 0; i < w * h; i++) { img.data[i * 4] = clamp(255 - rand() * 3); img.data[i * 4 + 1] = clamp(rand() * 3); img.data[i * 4 + 2] = clamp(255 - rand() * 3); img.data[i * 4 + 3] = 255; }
  const put = (x, y, c) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 4;
    img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.mask[y * w + x] = 1;
  };
  const block = (x, y, c) => { for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) put(x + xx, y + yy, c); };
  const slot = w / sizes.length;
  sizes.forEach((sz, k) => {
    const rx = Math.floor((slot * 0.4 * sz) / S) * S, ry = Math.max(S, Math.floor((rx * aspect) / S) * S);
    const cx = Math.round(((k + 0.5) * slot) / S) * S, cy = Math.round(h / 2 / S) * S;
    for (let by = -ry; by < ry; by += S) for (let bx = -rx; bx < rx; bx += S) {
      const d = Math.hypot((bx + S / 2) / rx, (by + S / 2) / ry);
      if (d > 1) continue;
      const band = palette[Math.min(palette.length - 1, Math.floor(d * palette.length))];
      block(cx + bx, cy + by, band.map((v) => clamp(v + (rand() - 0.5) * 20)));
    }
    if (seam) for (let bx = -Math.floor(rx * 0.6 / S) * S; bx < rx * 0.6; bx += S) block(cx + bx, cy, seam === 'white' ? [255, 255, 255] : [252 + Math.floor(rand() * 3), 251 + Math.floor(rand() * 4), 252 + Math.floor(rand() * 3)]);
    if (purple) for (let by = 0; by < ry * 0.5; by += S) for (let bx = 0; bx < rx * 0.4; bx += S) block(cx + bx, cy - Math.round(ry * 0.4 / S) * S + by, [140, 50, 220]);
  });
  // magenta anti-alias fringe on the outline (what image generators really produce)
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = y * w + x;
    if (!img.mask[p] || (img.mask[p - 1] && img.mask[p + 1] && img.mask[p - w] && img.mask[p + w]) || rand() < 0.5) continue;
    const i = p * 4;
    img.data[i] = clamp((img.data[i] + 255) / 2); img.data[i + 1] = clamp(img.data[i + 1] / 2); img.data[i + 2] = clamp((img.data[i + 2] + 255) / 2);
  }
  return img;
}

function cellOf(page, x0, y0, cw, ch) {
  const c = { w: cw, h: ch, data: new Uint8Array(cw * ch * 4) };
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const si = ((y0 + y) * page.w + x0 + x) * 4, di = (y * cw + x) * 4;
    for (let k = 0; k < 4; k++) c.data[di + k] = page.data[si + k];
  }
  return c;
}
function bb(c) {
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (c.data[(y * c.w + x) * 4 + 3]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return x1 < 0 ? null : { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}
const anyWarn = (list, re) => (list || []).some((w) => re.test(w));

export function decalTests({ check, fix }) {
  console.log('pack-sprites decal test');
  const FIXD = path.join(fix, 'decals');
  const ART = path.join(FIXD, 'art'), OUT = path.join(FIXD, 'out');
  fs.rmSync(FIXD, { recursive: true, force: true });
  const RAW = path.join(ART, 'decals', 'raw');
  const raw = (n) => path.join(RAW, n);

  // crack: v01 approved (8 variants, one image, pure-white seam that must be toned down), v02 a newer candidate
  savePng(raw('crack_v01.png'), decalRow([1, 0.9, 0.85, 0.95, 0.8, 0.9, 1, 0.85], { seed: 1, seam: 'white' }));
  savePng(raw('crack_v02.png'), decalRow([1, 1, 1, 1, 1, 1, 1, 1], { seed: 2 }));
  // scuff: directional 256x128, delivered as two parts of v01 (4 + 4 variants), drawn 2:1
  savePng(raw('scuff_v01_A.png'), decalRow([1, 0.9, 0.95, 0.85], { seed: 3, aspect: 0.5 }));
  savePng(raw('scuff_v01_B.png'), decalRow([0.9, 1, 0.8, 0.9], { seed: 4, aspect: 0.5 }));
  // barrier_crack: tinted wall decal drawn in color (must become greyscale), approved through a worldArt.decal batch
  savePng(raw('barrier_crack_v01.png'), decalRow([1, 0.9, 0.95, 1, 0.85, 0.9], { seed: 5, palette: ICE }));
  // burn_lightning: hot key; near-white seams snap to #FFFFFF and survive the 24-color cut
  savePng(raw('burn_lightning_v01.png'), decalRow([1, 0.9, 0.95, 0.85, 1, 0.9], { seed: 6, palette: SOOT, seam: 'near' }));
  // big base decals: with crack + scuff + rubble they need two 2048 pages (page split)
  savePng(raw('crater_big_v01.png'), decalRow([1, 0.9, 0.95, 0.85, 1, 0.9], { seed: 7 }));
  savePng(raw('crater_huge_v01.png'), decalRow([1, 0.9, 0.95, 0.85], { seed: 8 }));
  savePng(raw('fracture_ring_v01.png'), decalRow([1, 0.95, 0.9, 1], { seed: 9 }));
  // rubble: parts A and C (B missing: warned, still packed)
  savePng(raw('rubble_v01_A.png'), decalRow([1, 0.9], { seed: 10 }));
  savePng(raw('rubble_v01_C.png'), decalRow([0.95], { seed: 11 }));
  // scorch_ki: a hot-key decal with no white at all and a violet patch: both warned
  savePng(raw('scorch_ki_v01.png'), decalRow([1, 0.9, 0.95, 1], { seed: 12, palette: SOOT, purple: true }));
  // skid: never approved -> only in --candidates
  savePng(raw('skid_v01.png'), decalRow([1, 0.9, 0.95, 1], { seed: 13, aspect: 0.25 }));
  // names the packer must reject with a warning
  savePng(raw('foo_v01.png'), decalRow([1], { seed: 14 }));
  savePng(raw('crater.png'), decalRow([1], { seed: 15 }));
  savePng(raw(path.join('_rejected', 'crack_v03.png')), decalRow([1], { seed: 16 }));
  savePng(path.join(ART, 'decals', 'frames', 'mystery', 'mystery_00.png'), decalRow([1], { seed: 17, w: 64, h: 64 }));

  const items = {};
  for (const [name, s] of Object.entries(DECAL_SPECS)) items[name] = { cell: [...s.cell], variants: s.variants, group: s.group, mode: s.mode, status: 'todo', version: 0, approvedVersion: null };
  for (const n of ['crack', 'scuff', 'burn_lightning', 'crater_big', 'crater_huge', 'fracture_ring', 'rubble', 'scorch_ki', 'crack_s']) items[n].approvedVersion = 1;
  items.crater.group = 'edge'; // drift from the engine contract: warned, contract wins
  items.bogus = { approvedVersion: 1 };
  const manifest = { version: 2, decals: { ppu: 64, items }, worldArt: { decal: { batches: { 'decal-barrier_crack': { items: { barrier_crack: { approvedVersion: 1 } } }, 'decal-style_sheet': { items: { decal_style_sheet: { approvedVersion: 1 } } } } } } };
  const manifestPath = path.join(ART, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const pack = (args) => {
    const r = spawnSync(process.execPath, [PACKER, '--root', ART, '--out', OUT, ...args], { encoding: 'utf8' });
    let json = null;
    if (args.includes('--json')) { try { json = JSON.parse(r.stdout); } catch { /* reported below */ } }
    return { code: r.status, out: r.stdout, err: r.stderr, json };
  };

  // run 1: approved decals ship -------------------------------------------------------------------------------
  const r1 = pack(['--json', '--update-manifest', 'decals']);
  const d1 = r1.json?.decals;
  check(r1.code === 0 && d1 && r1.json.characters.length === 0 && !r1.json.vfx, `decals 1: "decals" target packs only decals (exit ${r1.code}) ${r1.err}`);
  if (!d1) { console.log(r1.out.slice(0, 2000)); return; }
  const atlasPath = path.join(OUT, 'decals', 'atlas.json');
  check(fs.existsSync(atlasPath), 'decals 1: public/decals/atlas.json written');
  if (!fs.existsSync(atlasPath)) return;
  const am = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
  const shipped = Object.keys(am.decals).join();
  check(am.ppu === 64 && am.source === 'approved' && Array.isArray(am.pages) && am.pageSizes?.length === am.pages.length, `decals 1: atlas header (ppu ${am.ppu}, ${am.pages?.length} pages)`);
  check(shipped === 'crack,crater_big,crater_huge,fracture_ring,scuff,rubble,barrier_crack,burn_lightning,scorch_ki', `decals 1: approved names only, in contract order (${shipped})`);
  check(d1.unapproved.includes('skid') && !am.decals.skid, 'decals 1: the unapproved skid is not shipped');

  const pages = am.pages.map((f) => loadPng(path.join(OUT, 'decals', f)));
  check(am.pages.every((f) => /^decals_[a-z]+(_\d+)?\.png$/.test(f)), `decals 1: page names ${am.pages.join(', ')}`);
  check(pages.every((p, k) => p.w <= 2048 && p.h <= 2048 && p.w === am.pageSizes[k][0] && p.h === am.pageSizes[k][1]), `decals 1: every page <= 2048x2048 and matches pageSizes (${am.pageSizes.map((s) => s.join('x')).join(', ')})`);
  check(am.pages.includes('decals_base_1.png') && am.pages.includes('decals_base_2.png') && am.decals.crater_big.page !== am.decals.crack.page && am.pages[am.decals.crack.page] === 'decals_base_2.png',
    'decals 1: the base group splits into decals_base_1/_2 and no name spans two pages');
  check(am.pages[am.decals.barrier_crack.page] === 'decals_edge.png' && am.pages[am.decals.burn_lightning.page] === 'decals_lightning.png' && am.pages[am.decals.scorch_ki.page] === 'decals_ki.png',
    'decals 1: one page per style group (edge, lightning, ki)');
  {
    let inside = true, overlap = false;
    const rects = am.pages.map(() => []);
    for (const [n, e] of Object.entries(am.decals)) for (const [x, y] of e.frames) {
      const pg = pages[e.page];
      if (x < 0 || y < 0 || x + e.w > pg.w || y + e.h > pg.h) inside = false;
      for (const r of rects[e.page]) if (x < r[0] + r[2] && r[0] < x + e.w && y < r[1] + r[3] && r[1] < y + e.h) overlap = true;
      rects[e.page].push([x, y, e.w, e.h, n]);
    }
    check(inside && !overlap, 'decals 1: every variant cell lies inside its page, no two cells overlap');
    let binary = true;
    for (const p of pages) for (let i = 3; i < p.data.length; i += 4) if (p.data[i] !== 0 && p.data[i] !== 255) { binary = false; break; }
    check(binary, 'decals 1: alpha is binary (0 / 255) on every page');
  }
  const cellsOf = (n) => am.decals[n].frames.map(([x, y]) => cellOf(pages[am.decals[n].page], x, y, am.decals[n].w, am.decals[n].h));
  const colorsOf = (cells) => { const s = new Set(); for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) s.add((c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2]); return s; };
  const whites = (cells) => { let w = 0, near = 0; for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) { const m = Math.min(c.data[i], c.data[i + 1], c.data[i + 2]); if (m === 255) w++; else if (m >= 250) near++; } return { w, near }; };
  const e = (n) => am.decals[n];

  // contract fields per name
  check(e('crack').w === 256 && e('crack').h === 256 && e('crack').frames.length === 8 && e('crack').mode === 'flat' && e('crack').tinted === false && e('crack').group === 'base' && e('crack').version === 1,
    `decals 1: crack = 8 flat 256x256 variants at the approved v01 (${JSON.stringify({ ...e('crack'), frames: e('crack').frames.length })})`);
  check(d1.packed.find((p) => p.name === 'crack')?.notes.some((n) => /newer candidate v02 not shipped/.test(n)), 'decals 1: the newer crack v02 waits for approval (noted)');
  check(e('scuff').w === 256 && e('scuff').h === 128 && e('scuff').frames.length === 8 && e('scuff').directional === true && e('scuff').version === 1, 'decals 1: scuff = parts A + B packed as one version of 8 directional 256x128 variants');
  check(d1.packed.find((p) => p.name === 'scuff')?.source === 'raw/scuff_v01_{A,B}.png', `decals 1: the report names both parts (${d1.packed.find((p) => p.name === 'scuff')?.source})`);
  check(e('crater_big').w === 512 && e('crater_big').frames.length === 6 && e('crater_huge').frames.length === 4 && e('fracture_ring').frames.length === 4, 'decals 1: 512 cells and variant counts');
  check(e('barrier_crack').mode === 'wall' && e('barrier_crack').tinted === true && e('barrier_crack').group === 'edge', 'decals 1: barrier_crack is a tinted wall decal, approved via its worldArt.decal batch');
  check(e('burn_lightning').hotKey === true && !e('crack').hotKey, 'decals 1: hotKey flag only on hot-key names');
  check(e('rubble').frames.length === 3 && anyWarn(d1.warnings, /rubble: v01 has parts A, C - a letter is missing/), 'decals 1: parts A + C pack (3 variants), the missing B is warned');

  // fit: the largest variant of an image fills 97% of the cell, every variant centered
  {
    const sz = (n) => cellsOf(n).map(bb);
    const crack = sz('crack');
    const big = Math.max(...crack.map((b) => Math.max(b.w, b.h)));
    check(Math.abs(big - 248) <= 3 && crack.every((b) => Math.abs((b.x0 + b.x1) / 2 - 127.5) <= 1.5 && Math.abs((b.y0 + b.y1) / 2 - 127.5) <= 1.5), `decals 1: crack's largest variant fills 97% of the 256 cell (${big}px), all centered`);
    check(crack.some((b) => b.w < big - 15), 'decals 1: smaller crack variants keep their size relative to the largest');
    const scuff = sz('scuff');
    const sw = Math.max(...scuff.map((b) => b.w)), sh = Math.max(...scuff.map((b) => b.h));
    check(Math.abs(sw - 248) <= 3 && Math.abs(sh - 124) <= 3, `decals 1: scuff (2:1) fills its 256x128 cell (${sw}x${sh})`);
  }
  // colors
  {
    const per = Object.keys(am.decals).map((n) => [n, colorsOf(cellsOf(n)).size]);
    check(per.every(([, c]) => c <= 24), `decals 1: <= 24 colors per name (${per.map(([n, c]) => `${n} ${c}`).join(', ')})`);
    const bc = cellsOf('barrier_crack');
    let grey = true;
    for (const c of bc) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3] && (c.data[i] !== c.data[i + 1] || c.data[i] !== c.data[i + 2])) grey = false;
    check(grey && anyWarn(d1.warnings, /barrier_crack: drawn in color/), 'decals 1: the tinted barrier_crack is converted to greyscale (warned)');
    const bl = whites(cellsOf('burn_lightning'));
    check(bl.w > 50 && bl.near === 0 && d1.packed.find((p) => p.name === 'burn_lightning')?.hot === bl.w, `decals 1: burn_lightning's near-white seams are exact #FFFFFF after quantizing (${bl.w} hot px, ${bl.near} near-white)`);
    const cr = whites(cellsOf('crack'));
    check(cr.w === 0 && cr.near === 0 && d1.packed.find((p) => p.name === 'crack')?.notes.some((n) => /toned down/.test(n)), `decals 1: no hot key in crack: its white seam is toned down (${cr.w} white, ${cr.near} near-white)`);
    check(anyWarn(d1.warnings, /scorch_ki: no pure #FFFFFF hot-key pixels/) && anyWarn(d1.warnings, /scorch_ki: .*magenta\/pink\/purple/), 'decals 1: a hot-key decal without white and a violet patch are warned');
  }
  // other warnings
  check(anyWarn(d1.warnings, /raw\/foo_v01\.png: unrecognized name/) && anyWarn(d1.warnings, /raw\/crater\.png: unversioned - rename it to crater_vNN\.png/), 'decals 1: unknown and unversioned raw files are warned');
  check(anyWarn(d1.warnings, /frames\/mystery\/: unknown decal name/) && anyWarn(d1.warnings, /decals\.items\.bogus: not an engine decal name/), 'decals 1: unknown frames/ folder and manifest item are warned');
  check(anyWarn(d1.warnings, /crack_s: v01 is approved but raw\/crack_s_v01\.png \(or its parts\) is missing/) && d1.missing.includes('crack_s'), 'decals 1: an approved name without its raw is warned and stays procedural');
  check(anyWarn(d1.warnings, /decals\.items\.crater: group "edge" \(packer "base"\)/) && !anyWarn(d1.warnings, /crack_v03|style_sheet/), 'decals 1: manifest drift warned; _rejected/ and the style-sheet approval are silent');
  // write-back + manifest
  const crackFrames = path.join(ART, 'decals', 'frames', 'crack');
  const mk = fs.existsSync(path.join(crackFrames, '.packer.json')) && JSON.parse(fs.readFileSync(path.join(crackFrames, '.packer.json'), 'utf8'));
  check(mk && mk.sourceFile === 'raw/crack_v01.png' && mk.version === 1 && JSON.stringify(mk.cell) === '{"w":256,"h":256,"fill":[0.97,0.97]}' && fs.existsSync(path.join(crackFrames, 'crack_07.png')),
    'decals 1: cleaned cells written back to art/decals/frames/crack/ with a marker');
  const man = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  check(man.decals.items.crack.status === 'packed' && man.decals.items.crack.version === 2 && man.decals.items.crack.approvedVersion === 1
    && man.decals.items.skid.status === 'raw' && man.decals.items.skid.version === 1 && man.decals.items.claw.status === 'todo', '--update-manifest: decal status and version raised, approvedVersion untouched');
  check(/== decals =+/.test(pack(['decals', '--dry-run']).out), 'decals 1: text report has a decals section');

  // run 2: idempotent (written-back cells are final cells) -----------------------------------------------------
  const before = [atlasPath, ...am.pages.map((f) => path.join(OUT, 'decals', f))].map((f) => fs.readFileSync(f));
  const r2 = pack(['--json', 'decals']);
  const after = [atlasPath, ...am.pages.map((f) => path.join(OUT, 'decals', f))].map((f) => fs.readFileSync(f));
  check(r2.code === 0 && before.every((b, k) => Buffer.compare(b, after[k]) === 0), 'decals 2: re-running is byte-identical (atlas.json and every page)');
  check(r2.json?.decals.packed.find((p) => p.name === 'crack')?.source === 'frames/crack/', 'decals 2: crack now read from frames/crack/');

  // run 3: --candidates -> preview/decals, shipped files untouched ---------------------------------------------
  const r3 = pack(['--json', '--candidates', 'decals']);
  const pv = path.join(OUT, 'preview', 'decals', 'atlas.json');
  const pm = r3.code === 0 && fs.existsSync(pv) && JSON.parse(fs.readFileSync(pv, 'utf8'));
  check(pm && pm.source === 'candidates' && pm.decals.skid && pm.decals.crack.version === 2 && pm.decals.barrier_crack, `decals 3: candidates preview every name with a raw at its newest version (${pm && Object.keys(pm.decals).join()})`);
  check(Buffer.compare(before[0], fs.readFileSync(atlasPath)) === 0, 'decals 3: the shipped atlas is untouched');

  // run 3b: rejecting every part of the only version stops shipping its written-back cells
  fs.mkdirSync(path.join(RAW, '_rejected'), { recursive: true });
  for (const f of ['rubble_v01_A.png', 'rubble_v01_C.png']) fs.renameSync(raw(f), raw(path.join('_rejected', f)));
  const r3b = pack(['--json', 'decals']);
  const am3b = r3b.code === 0 && JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
  check(am3b && !am3b.decals.rubble && am3b.decals.crack && anyWarn(r3b.json?.decals.warnings, /rubble: frames\/rubble\/ were cleaned from raw\/rubble_v01_\{A,C\}\.png, which is no longer in raw\//),
    'decals 3b: rejected parts -> the stale frames/rubble/ is not shipped (warned)');

  // run 4: approvals withdrawn -> shipped outputs removed ------------------------------------------------------
  const m4 = path.join(FIXD, 'manifest-unapproved.json');
  const man4 = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const it of Object.values(man4.decals.items)) it.approvedVersion = null;
  delete man4.worldArt;
  fs.writeFileSync(m4, JSON.stringify(man4));
  const r4 = pack(['--json', '--manifest', m4, 'decals']);
  const left = fs.readdirSync(path.join(OUT, 'decals'));
  check(r4.code === 0 && !left.length && r4.json?.decals.removed.length === am.pages.length + 1, `decals 4: no approval left -> atlas.json and every page removed (left: ${left.join(', ') || 'none'})`);
}

// standalone: node tools/test-pack-decals.mjs [--keep]
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const FIX = path.join(TOOL_DIR, '.test-fixtures');
  let passes = 0, failures = 0;
  decalTests({ fix: FIX, check: (ok, msg) => { if (ok) passes++; else { failures++; console.log(`  FAIL ${msg}`); } } });
  if (!process.argv.includes('--keep')) fs.rmSync(path.join(FIX, 'decals'), { recursive: true, force: true });
  console.log(`${failures ? 'FAILED' : 'OK'}: ${passes} passed, ${failures} failed`);
  process.exitCode = failures ? 1 : 0;
}
