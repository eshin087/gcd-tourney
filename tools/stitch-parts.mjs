#!/usr/bin/env node
// Stitch a strip generated in two parts (TOOL-008, art/PIPELINE.md "Long strips (parts)"): joins
// art/characters/<id>/raw/_parts/<anim>_vNN_A.png and _B.png into raw/<anim>_vNN.png, with B brought to A's size by a
// MEASURED factor instead of one picked by eye (Naruto's specialUp was stitched at x0.7 and its last two frames packed
// 45 % too small; ADR 0021).
//
//   npm run stitch -- <id> <anim> <vNN>                       measure, stitch, write raw/<anim>_vNN.png + its sidecar
//   npm run stitch -- <id> <anim> <vNN> --dry-run             measure and report only
//   npm run stitch -- <id> <anim> <vMM> --parts <vNN>         re-stitch the parts of an older version as the new
//                                                              version MM (a scale fix without generating new images)
//   npm run stitch -- <id> <anim> <vNN> --factor 0.8 --reason "B's head is hidden by the raised arms"
//                                                              a manual factor needs a written reason
//
// How: both parts are cleaned like the packer cleans a strip (magenta removed, specks dropped, poses split), packed at
// one trial scale and measured with the scale probe (head silhouette with hair, tools/scale-probe.mjs) against the
// approved idle in public/characters/<id>/. factor = median head of A's poses / median head of B's. The part that is
// drawn bigger is scaled DOWN (palette-preserving mode sampling), so the stitch never upscales art. The parts are
// bottom-aligned on one floor line with at least 24 px of flat magenta between them. The factor, the measured heads
// and which part was scaled go into raw/<anim>_vNN.json as "stitch" (the packer ignores the key). Never overwrites an
// existing version. Then pack as usual; the packer's scale gate checks the result (no pop inside the strip).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPng, encodePng, newImage, crop, blit, bbox, removeBackground, removeSpecks, splitStrip, resample, placeCharFrame, readJson } from './pack-sprites.mjs';
import { palettesFromIdle, makeReference, measureFrame, snapToPalette, quantizeCopies, countColors, median, resolveGate } from './scale-probe.mjs';
import { loadPacked } from './scale-audit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAGENTA = [255, 0, 255];
const SPEC = { frameWidth: 256, frameHeight: 256, pivot: [128, 240], cellMargin: 4 };

function fail(msg) { console.error(`[stitch] ${msg}`); return 1; }

// a cleaned part: background removed, specks dropped, split into trimmed poses (source resolution)
function cleanPart(file) {
  const img = readPng(file);
  removeBackground(img, { tol: 72, mode: 'char' });
  removeSpecks(img, { frac: 0.0015, min: 4 });
  const { rects } = splitStrip(img, 0, { split: 'auto', mode: 'char' });
  const poses = [];
  for (const r of rects) {
    const piece = crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    const b = bbox(piece);
    if (b) poses.push(crop(piece, b.x0, b.y0, b.w, b.h));
  }
  return { img, poses, box: bbox(img) };
}

const cellsAt = (poses, s) => poses.map((p) => placeCharFrame(resample(p, s, { coverage: 0.5, alphaMin: 128 }), SPEC).cell);

// median head of some poses against the idle reference at resample scale s (cells placed like the packer's), their
// raw colours snapped to the packed idle's (snapToPalette)
function headsAt(poses, M, s) {
  const cells = snapToPalette(cellsAt(poses, s), M.idle);
  const heads = cells.map((c) => measureFrame(c, M.ref, M.pal).head);
  return { heads, head: median(heads.filter((h) => h != null)) };
}

// The resample scale at which a part's heads match the idle's. Measured at the part's own trial scale (its tallest
// pose = bodyHeight; bigger if the heads are too small for the probe), then once more at the scale that should bring
// them to 1.00, where the probe is most exact. Two parts' scales give the factor: B must be scaled by eB / eA.
function idleScaleOf(poses, M, bodyHeight) {
  const s = bodyHeight / Math.max(...poses.map((p) => p.h));
  const m = headsAt(poses, M, s);
  if (!Number.isFinite(m.head)) return { scale: NaN, heads: m.heads };
  const m2 = headsAt(poses, M, s / m.head);
  return Number.isFinite(m2.head) ? { scale: s / m.head / m2.head, heads: m2.heads } : { scale: s / m.head, heads: m.heads };
}

export function main(argv) {
  const args = argv.slice();
  const flag = (n) => { const i = args.indexOf(n); if (i >= 0) { args.splice(i, 1); return true; } return false; };
  const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : d; };
  const DRY = flag('--dry-run');
  const artDir = path.resolve(opt('--root', path.join(ROOT, 'art')));
  const publicDir = path.resolve(opt('--public', path.join(ROOT, 'public')));
  const manual = opt('--factor', null), reason = opt('--reason', null), partsArg = opt('--parts', null);
  const gap = Math.max(24, Number(opt('--gap', '24')) || 24);
  if (args.some((a) => a.startsWith('-'))) return fail(`unknown option ${args.find((a) => a.startsWith('-'))}`);
  const [id, anim, vArg] = args;
  if (!id || !anim || !vArg) return fail('usage: npm run stitch -- <id> <anim> <vNN> [--factor f --reason "..."] [--dry-run]');
  const n = Number(String(vArg).replace(/^v/i, ''));
  if (!Number.isInteger(n) || n < 1) return fail(`version "${vArg}" must be a number like 03`);
  const vv = String(n).padStart(2, '0');
  const pn = partsArg == null ? n : Number(String(partsArg).replace(/^v/i, ''));
  if (!Number.isInteger(pn) || pn < 1) return fail(`--parts "${partsArg}" must be a version number like 01`);
  const pv = String(pn).padStart(2, '0');
  if (manual != null && !(Number(manual) > 0)) return fail('--factor must be a positive number');
  if (manual != null && !(reason && reason.trim())) return fail('a manual --factor needs --reason "why the measured factor is wrong"');
  const charDir = path.join(artDir, 'characters', id), rawDir = path.join(charDir, 'raw');
  const partFile = (p) => path.join(rawDir, '_parts', `${anim}_v${pv}_${p}.png`);
  for (const p of ['A', 'B']) if (!fs.existsSync(partFile(p))) return fail(`missing ${path.relative(artDir, partFile(p))}`);
  const outFile = path.join(rawDir, `${anim}_v${vv}.png`), sideFile = path.join(rawDir, `${anim}_v${vv}.json`);
  if (!DRY && (fs.existsSync(outFile) || fs.existsSync(path.join(rawDir, '_rejected', `${anim}_v${vv}.png`)))) return fail(`${anim}_v${vv}.png already exists (versions are never overwritten or reused)`);

  const packed = loadPacked(id, publicDir);
  const idle = packed?.anims.find((a) => a.name === 'idle');
  if (!idle) return fail(`no packed idle in public/characters/${id}/ to measure against - pack the approved idle first`);
  const manifest = readJson(path.join(artDir, 'manifest.json')).data || {};
  const decl = readJson(path.join(artDir, 'scale', 'builds.json')).data?.fighters?.[id] || {};
  const mc = manifest.characters?.[id]?.animations?.[anim] || {}, md = manifest.animationDefaults?.[anim] || {};
  const bodyHeight = Number(mc.bodyHeight ?? md.bodyHeight) || 204;

  const parts = ['A', 'B'].map((p) => ({ name: p, ...cleanPart(partFile(p)), factor: 1 }));
  for (const p of parts) if (!p.poses.length) return fail(`part ${p.name} has no poses after background removal (flat magenta #FF00FF?)`);
  // the idle as packed (an unquantized pack is snapped to 48 colours first, as the packer's gate does)
  const idleCells = countColors(idle.cells) > 48 ? quantizeCopies(idle.cells, 48) : idle.cells;
  const M = { idle: idleCells, pal: palettesFromIdle(idleCells, decl) };
  M.ref = makeReference(idleCells, M.pal);
  if (!M.ref) return fail('no head found in the packed idle - declare headColors in art/scale/builds.json');
  const [eA, eB] = parts.map((p) => idleScaleOf(p.poses, M, bodyHeight));
  const bad = [eA, eB].findIndex((e) => !Number.isFinite(e.scale));
  if (bad >= 0) return fail(`no head found in part ${'AB'[bad]} (the head is hidden or not in the idle's hair colours) - check it by eye and use --factor with --reason`);
  const measured = +(eB.scale / eA.scale).toFixed(4);
  const factor = manual != null ? Number(manual) : measured;
  const gateCfg = resolveGate(manifest.spec?.scaleGate);
  if (manual == null && (factor < gateCfg.fitMin || factor > 1 / gateCfg.fitMin)) console.warn(`[stitch] the parts differ by x${factor}: regenerate part B at part A's size rather than resampling that far`);
  // scale the bigger part down, never the smaller one up (nearest upscaling turns 1 px outlines into blocks)
  const scaled = factor < 1 ? 'B' : factor > 1 ? 'A' : null;
  const k = factor < 1 ? factor : 1 / factor;
  parts.forEach((p) => { p.factor = p.name === scaled ? k : 1; });
  // check: both parts as they will be stitched, at the scale that puts A at the idle's size
  const common = eA.scale / parts[0].factor;
  const [a1, b1] = parts.map((p) => headsAt(p.poses, M, common * p.factor));
  const after = Number.isFinite(a1.head) && Number.isFinite(b1.head) ? +(b1.head / a1.head).toFixed(3) : null;
  if (after == null || Math.abs(after - 1) > gateCfg.stripTol) console.warn(`[stitch] check: after scaling, part B's heads read ${after ?? '?'} of part A's - the two parts' poses are hard to compare (a raised arm, a hidden head): check the stitched strip by eye before packing`);

  // compose: each part trimmed to its poses, the scaled one resampled, soles on one floor line, flat magenta around
  const imgs = parts.map((p) => {
    const t = crop(p.img, p.box.x0, p.box.y0, p.box.w, p.box.h);
    return p.factor === 1 ? t : resample(t, p.factor, { coverage: 0.5, alphaMin: 128 });
  });
  const pad = 24, H = Math.max(...imgs.map((i) => i.h)) + 2 * pad;
  const out = newImage(pad + imgs[0].w + gap + imgs[1].w + pad, H);
  for (let i = 0; i < out.data.length; i += 4) { out.data[i] = MAGENTA[0]; out.data[i + 1] = MAGENTA[1]; out.data[i + 2] = MAGENTA[2]; out.data[i + 3] = 255; }
  const floor = H - pad; // every part's lowest opaque row lands here
  const place = (img, x) => {
    const b = bbox(img);
    const solid = newImage(img.w, img.h); // keep the magenta under transparent pixels: copy opaque ones only
    for (let i = 0; i < img.data.length; i += 4) if (img.data[i + 3] >= 128) { solid.data[i] = img.data[i]; solid.data[i + 1] = img.data[i + 1]; solid.data[i + 2] = img.data[i + 2]; solid.data[i + 3] = 255; }
    blit(out, solid, x, floor - b.y1);
  };
  place(imgs[0], pad);
  place(imgs[1], pad + imgs[0].w + gap);

  const record = {
    bFactor: factor, measured, manual: manual != null ? { factor: Number(manual), reason: reason.trim() } : undefined,
    scaledPart: scaled, scaledBy: scaled ? +k.toFixed(4) : 1, idleScaleA: +eA.scale.toFixed(4), idleScaleB: +eB.scale.toFixed(4), afterB_vs_A: after,
    parts: ['A', 'B'].map((p) => `raw/_parts/${anim}_v${pv}_${p}.png`), poses: [parts[0].poses.length, parts[1].poses.length], gapPx: gap, tool: 'tools/stitch-parts.mjs',
  };
  console.log(`[stitch] ${id} ${anim} v${vv}${pv !== vv ? ` (parts of v${pv})` : ''}: part A ${parts[0].poses.length} pose(s), part B ${parts[1].poses.length} pose(s); each matches the idle head at x${record.idleScaleA} / x${record.idleScaleB} of its raw size`);
  console.log(`[stitch] B factor x${factor}${manual != null ? ` (manual: ${reason.trim()}; measured x${measured})` : ' (measured)'}: ${scaled ? `part ${scaled} scaled by x${record.scaledBy}` : 'no rescale'}; after: B/A ${after ?? '?'}`);
  if (DRY) { console.log('[stitch] dry run - nothing written'); return 0; }
  fs.writeFileSync(outFile, encodePng(out));
  const side = readJson(sideFile).data || {};
  fs.writeFileSync(sideFile, JSON.stringify({ ...side, stitch: record }, null, 2) + '\n');
  console.log(`[stitch] wrote ${path.relative(process.cwd(), outFile)} (${out.w}x${out.h}) and ${path.basename(sideFile)}; next: npm run sprites ${id}, then npm run scale -- ${id} and attach heads-${id}.png`);
  return 0;
}

const samePath = (a, b) => (process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b);
if (process.argv[1] && samePath(path.resolve(process.argv[1]), fileURLToPath(import.meta.url))) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) { console.error(`[stitch] failed: ${e.stack || e.message}`); process.exitCode = 1; }
}
