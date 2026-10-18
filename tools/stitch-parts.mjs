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
//   npm run stitch -- <id> <anim> <vNN> --counts 5,3           the poses in part A and B; without it the stitch checks
//                                                              the sum against the manifest's frame count
//   npm run stitch -- <id> <anim> <vNN> --factor 0.69 --reason "..." --landmarks "A f0 hair 90 px, B f0 130 px"
//                    --uncertainty "2 px"                      a manual factor where the probe finds no head (raised
//                                                              hands over the hair): the measured landmarks and their
//                                                              uncertainty are required and recorded
//
// How: both parts are cleaned like the packer cleans a strip (magenta removed, specks dropped, poses split), packed at
// one trial scale and measured with the scale probe (head silhouette with hair, tools/scale-probe.mjs) against the
// fighter's current idle, packed fresh from art/ without --quantize: exactly the cells the packer's gate measures
// against. (The shipped public/ sheet is quantized over the whole fighter, and a part generated with a slightly
// different hair yellow then found no head at all: Naruto's title-style aerials.) --public <dir> measures against an
// existing pack instead. factor = median head of A's poses / median head of B's. The part that is
// drawn bigger is scaled DOWN (palette-preserving mode sampling), so the stitch never upscales art. The parts are
// bottom-aligned on one floor line with at least 24 px of flat magenta between them. The factor, the measured heads
// and which part was scaled go into raw/<anim>_vNN.json as "stitch" (the packer ignores the key). Never overwrites an
// existing version. Then pack as usual; the packer's scale gate checks the result (no pop inside the strip).
//
// Poses are whole figures (connected components), not vertical slices: two figures may overlap in horizontal
// projection without touching (Killua specialForward v12: pose 2's hand reaches over pose 3's rear shoe), and a
// vertical cut hands that piece of one figure to its neighbour, in the stitch and again when the packer splits the
// strip. So each figure is cut out by its own pixels and the stitched strip lays the figures out one by one with a
// clean gap, which the packer's column split cannot get wrong. Only when two figures really touch does the stitch
// fall back to the projection split (and keep the parts' own layout), and it says so.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { removeCopy, scratchDir, sweepStale } from './scratch-dir.mjs';
import { readPng, encodePng, newImage, crop, blit, bbox, removeBackground, removeSpecks, splitStrip, figureSplit, resample, placeCharFrame, readJson, loadScaleReference } from './pack-sprites.mjs';
import { palettesFromIdle, makeReference, measureFrame, measurementCells, median, resolveGate } from './scale-probe.mjs';
import { loadPacked } from './scale-audit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAGENTA = [255, 0, 255];
const SPEC = { frameWidth: 256, frameHeight: 256, pivot: [128, 240], cellMargin: 4 };

function fail(msg) { console.error(`[stitch] ${msg}`); return 1; }

// The fighter's current idle as the packer's gate sees it: a temporary art tree with only that idle (its newest raw,
// sidecars and frames/idle/), packed without --quantize in warn mode. Returns the loadPacked() result or { error }.
function freshIdle(id, artDir) {
  const charDir = path.join(artDir, 'characters', id), rawDir = path.join(charDir, 'raw');
  sweepStale({ log: () => {} });
  const tmp = fs.mkdtempSync(path.join(scratchDir(), 'gcd-stitch-ref-'));
  try {
    const tArt = path.join(tmp, 'art'), tChar = path.join(tArt, 'characters', id);
    fs.mkdirSync(path.join(tChar, 'raw'), { recursive: true });
    for (const f of fs.existsSync(rawDir) ? fs.readdirSync(rawDir) : []) if (/^idle(_v\d+)?\.(png|json)$/.test(f) || f === 'idle.json') fs.copyFileSync(path.join(rawDir, f), path.join(tChar, 'raw', f));
    const fIdle = path.join(charDir, 'frames', 'idle');
    if (fs.existsSync(fIdle)) fs.cpSync(fIdle, path.join(tChar, 'frames', 'idle'), { recursive: true });
    const m = readJson(path.join(artDir, 'manifest.json')).data;
    if (!m?.characters?.[id]) return { error: `no characters.${id} in ${path.join(artDir, 'manifest.json')}` };
    m.characters[id].scaleGate = 'warn';
    fs.writeFileSync(path.join(tArt, 'manifest.json'), JSON.stringify(m));
    const builds = path.join(artDir, 'scale', 'builds.json');
    if (fs.existsSync(builds)) { fs.mkdirSync(path.join(tArt, 'scale'), { recursive: true }); fs.copyFileSync(builds, path.join(tArt, 'scale', 'builds.json')); }
    const out = path.join(tmp, 'public');
    const r = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'pack-sprites.mjs'), id, '--root', tArt, '--out', out, '--no-writeback'], { encoding: 'utf8' });
    const packed = loadPacked(id, out);
    if (!packed) return { error: `packing the idle failed: ${(r.stderr || r.stdout || '').trim().split('\n').slice(-2).join(' ')}` };
    return packed;
  } finally { removeCopy(tmp); }
}

// a cleaned part: background removed, specks dropped, its poses as whole figures (source resolution). layout
// 'figures' = laid out again one by one when stitched; 'projection' = the fallback vertical split (figures touch),
// stitched with the part's own layout so no pixel is duplicated
function cleanPart(file, expected = 0) {
  const img = readPng(file);
  removeBackground(img, { tol: 72, mode: 'char' });
  removeSpecks(img, { frac: 0.0015, min: 4 });
  const figs = figureSplit(img, expected);
  if (figs) return { img, poses: figs, box: bbox(img), layout: 'figures' };
  const { rects } = splitStrip(img, expected, { split: 'auto', mode: 'char' });
  const poses = [];
  for (const r of rects) {
    const piece = crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    const b = bbox(piece);
    if (b) poses.push(crop(piece, b.x0, b.y0, b.w, b.h));
  }
  return { img, poses, box: bbox(img), layout: 'projection' };
}

// poses resampled by s and placed in cells like the packer's; clipped = poses cut at the TOP of the cell: a trial scale
// that pushes the crown above the cell makes the probe read whatever is left (a shirt hem). An arm cut at the side does
// not touch the head.
const cellsAt = (poses, s) => {
  const placed = poses.map((p) => placeCharFrame(resample(p, s, { coverage: 0.5, alphaMin: 128 }), SPEC));
  return { cells: placed.map((x) => x.cell), clipped: placed.filter((x) => x.lost && x.clip.some((c) => c.startsWith('top'))).length };
};

// median head of some poses against the idle reference at resample scale s, their colours reduced to the idle's
// palette exactly as the packer's gate does (measurementCells). A trial that clips a pose is not a measurement.
function headsAt(poses, M, s) {
  const { cells, clipped } = cellsAt(poses, s);
  if (clipped) return { heads: [], head: NaN, clipped };
  const [, part] = measurementCells([{ name: 'idle', cells: M.idle }, { name: 'part', cells }], { name: 'idle', cells: M.idle }, 48, M.decl);
  const heads = part.cells.map((c) => measureFrame(c, M.ref, M.pal).head);
  return { heads, head: median(heads.filter((h) => h != null)), clipped: 0 };
}

// The resample scale at which a part's heads match the idle's. Measured at the part's own trial scale (its tallest
// pose = bodyHeight; bigger if the heads are too small for the probe), then once more at the scale that should bring
// them to 1.00, where the probe is most exact. Two parts' scales give the factor: B must be scaled by eB / eA.
// The refinement is only taken when it measures cleanly: if the trial at s / head clips a pose (the head pushed out
// of the cell), the first trial's estimate stands and the result says so (refinedClipped).
function idleScaleOf(poses, M, bodyHeight) {
  const s = bodyHeight / Math.max(...poses.map((p) => p.h));
  const m = headsAt(poses, M, s);
  if (!Number.isFinite(m.head)) return { scale: NaN, heads: m.heads, clipped: m.clipped };
  const m2 = headsAt(poses, M, s / m.head);
  if (m2.clipped) return { scale: s / m.head, heads: m.heads, refinedClipped: m2.clipped };
  return Number.isFinite(m2.head) ? { scale: s / m.head / m2.head, heads: m2.heads } : { scale: s / m.head, heads: m.heads };
}

export function main(argv) {
  const args = argv.slice();
  const flag = (n) => { const i = args.indexOf(n); if (i >= 0) { args.splice(i, 1); return true; } return false; };
  const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : d; };
  const DRY = flag('--dry-run');
  const artDir = path.resolve(opt('--root', path.join(ROOT, 'art')));
  const publicArg = opt('--public', null), publicDir = publicArg && path.resolve(publicArg);
  const manual = opt('--factor', null), reason = opt('--reason', null), partsArg = opt('--parts', null), countsArg = opt('--counts', null);
  const landmarks = opt('--landmarks', null), uncertainty = opt('--uncertainty', null);
  const counts = countsArg == null ? [0, 0] : String(countsArg).split(',').map(Number);
  if (counts.length !== 2 || counts.some((n) => !Number.isInteger(n) || n < 0)) return fail(`--counts "${countsArg}" must be two pose counts like 5,3`);
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

  const packed = publicDir ? loadPacked(id, publicDir) : freshIdle(id, artDir);
  if (packed?.error) return fail(packed.error);
  const idle = packed?.anims.find((a) => a.name === 'idle');
  if (!idle) return fail(publicDir ? `no packed idle in ${publicDir}/characters/${id}/ to measure against` : `no idle in art/characters/${id}/raw/ to measure against`);
  // the reference must be the idle the art now has: a refused pack leaves an older idle in public/, and measuring a
  // redraw against it gives a wrong factor (Killua light1 v04 against idle v01, STITCH_TOOLING_HANDOFF.md)
  const packedIdleV = packed.meta.scaleAudit?.anims?.idle?.v ?? null;
  const rawIdleV = fs.existsSync(rawDir) ? Math.max(0, ...fs.readdirSync(rawDir).map((f) => /^idle_v(\d+)\.png$/.exec(f)?.[1]).filter(Boolean).map(Number)) : 0;
  if (publicDir && rawIdleV && packedIdleV !== rawIdleV) {
    return fail(`the packed idle in ${path.relative(process.cwd(), publicDir) || '.'}/characters/${id}/ is ${packedIdleV == null ? 'unversioned' : `v${String(packedIdleV).padStart(2, '0')}`}, but raw/idle_v${String(rawIdleV).padStart(2, '0')}.png is the idle now - pack it first (if the whole fighter is refused, pack into a scratch folder with a "scaleGate": "warn" copy of the manifest: node tools/pack-sprites.mjs ${id} --quantize 48 --no-writeback --manifest <copy> --out <dir>) and pass --public <dir>`);
  }
  const manifest = readJson(path.join(artDir, 'manifest.json')).data || {};
  const decl = readJson(path.join(artDir, 'scale', 'builds.json')).data?.fighters?.[id] || {};
  // a fighter whose gate measures against approved reference cells (builds.json scaleReference) is stitched against them
  const sref = loadScaleReference(artDir, decl);
  if (sref?.error) return fail(sref.error);
  if (sref) { idle.cells = sref.cells; console.log(`[stitch] measuring against the approved reference ${sref.label} (builds.json scaleReference)`); }
  const mc = manifest.characters?.[id]?.animations?.[anim] || {}, md = manifest.animationDefaults?.[anim] || {};
  const bodyHeight = Number(mc.bodyHeight ?? md.bodyHeight) || 204;

  const parts = ['A', 'B'].map((p, k) => ({ name: p, ...cleanPart(partFile(p), counts[k]), factor: 1 }));
  for (const p of parts) if (!p.poses.length) return fail(`part ${p.name} has no poses after background removal (flat magenta #FF00FF?)`);
  for (const [k, p] of parts.entries()) if (counts[k] && p.poses.length !== counts[k]) return fail(`part ${p.name}: found ${p.poses.length} pose(s), --counts says ${counts[k]} - leave a gap between the poses`);
  const want = Number(mc.frames ?? md.frames) || 0, got = parts[0].poses.length + parts[1].poses.length;
  if (want && got !== want) return fail(`parts A + B have ${parts[0].poses.length} + ${parts[1].poses.length} = ${got} pose(s), the manifest's ${anim} has ${want} frames - two poses touch? pass --counts <A>,<B>`);
  // the idle as packed, reduced to its own palette like the gate does
  const [idleQ] = measurementCells([{ name: 'idle', cells: idle.cells }], { name: 'idle', cells: idle.cells }, 48, decl);
  const idleCells = idleQ.cells;
  const M = { idle: idle.cells, decl, pal: palettesFromIdle(idleCells, decl) };
  M.ref = makeReference(idleCells, M.pal);
  if (!M.ref) return fail('no head found in the packed idle - declare headColors in art/scale/builds.json');
  for (const p of parts) if (p.layout === 'projection') console.warn(`[stitch] part ${p.name}: its figures touch (or a big detached piece), so it is split by columns and keeps its own layout - check the packed frames for a limb cut into the neighbour`);
  const [eA, eB] = parts.map((p) => idleScaleOf(p.poses, M, bodyHeight));
  const bad = [eA, eB].findIndex((e) => !Number.isFinite(e.scale));
  const why = bad >= 0 ? `no head found in part ${'AB'[bad]} (${[eA, eB][bad].clipped ? 'every trial scale clips a pose out of the cell' : "the head is hidden or not in the idle's hair colours"})` : null;
  // a manual factor is the answer to an unmeasurable head, so it is honoured without one, but only with the measured
  // landmarks and their uncertainty on record (Naruto specialUp v04: hair widths A 90 / B 130 px, +-2 px)
  if (why && manual == null) return fail(`${why} - measure a landmark by eye in both parts and pass --factor <B/A> --reason "..." --landmarks "..." --uncertainty "..."`);
  if (why && !(landmarks && landmarks.trim() && uncertainty && uncertainty.trim())) return fail(`${why}: a manual --factor without a probed head also needs --landmarks "<what was measured, in both parts>" and --uncertainty "<+- px>"`);
  for (const [k, e] of [eA, eB].entries()) if (e.refinedClipped) console.warn(`[stitch] part ${'AB'[k]}: the refined trial clipped ${e.refinedClipped} pose(s) out of the cell, so its first estimate is used`);
  const measured = why ? null : +(eB.scale / eA.scale).toFixed(4);
  const factor = manual != null ? Number(manual) : measured;
  const gateCfg = resolveGate(manifest.spec?.scaleGate);
  if (manual == null && (factor < gateCfg.fitMin || factor > 1 / gateCfg.fitMin)) console.warn(`[stitch] the parts differ by x${factor}: regenerate part B at part A's size rather than resampling that far`);
  // scale the bigger part down, never the smaller one up (nearest upscaling turns 1 px outlines into blocks)
  const scaled = factor < 1 ? 'B' : factor > 1 ? 'A' : null;
  const k = factor < 1 ? factor : 1 / factor;
  parts.forEach((p) => { p.factor = p.name === scaled ? k : 1; });
  // check: both parts as they will be stitched, at the scale that puts A at the idle's size (when A can be measured)
  let after = null;
  if (Number.isFinite(eA.scale)) {
    const common = eA.scale / parts[0].factor;
    const [a1, b1] = parts.map((p) => headsAt(p.poses, M, common * p.factor));
    after = Number.isFinite(a1.head) && Number.isFinite(b1.head) ? +(b1.head / a1.head).toFixed(3) : null;
  }
  if (after == null || Math.abs(after - 1) > gateCfg.stripTol) console.warn(`[stitch] check: after scaling, part B's heads read ${after ?? '?'} of part A's - the two parts' poses are hard to compare (a raised arm, a hidden head): check the stitched strip by eye before packing`);

  // compose on flat magenta, soles on one floor line: whole figures one by one with a clean gap (the scaled part's
  // figures resampled), or, for a part split by columns, the part's own layout trimmed to its poses
  const opaque = (img) => { const o = newImage(img.w, img.h); for (let i = 0; i < img.data.length; i += 4) if (img.data[i + 3] >= 128) { o.data[i] = img.data[i]; o.data[i + 1] = img.data[i + 1]; o.data[i + 2] = img.data[i + 2]; o.data[i + 3] = 255; } return o; };
  const blocks = parts.flatMap((p) => {
    const src = p.layout === 'figures' ? p.poses : [crop(p.img, p.box.x0, p.box.y0, p.box.w, p.box.h)];
    return src.map((t) => opaque(p.factor === 1 ? t : resample(t, p.factor, { coverage: 0.5, alphaMin: 128 })));
  });
  const pad = 24, H = Math.max(...blocks.map((i) => i.h)) + 2 * pad;
  const out = newImage(2 * pad + blocks.reduce((sum, b) => sum + b.w, 0) + gap * (blocks.length - 1), H);
  for (let i = 0; i < out.data.length; i += 4) { out.data[i] = MAGENTA[0]; out.data[i + 1] = MAGENTA[1]; out.data[i + 2] = MAGENTA[2]; out.data[i + 3] = 255; }
  const floor = H - pad; // every block's lowest opaque row lands here
  let x = pad;
  for (const b of blocks) { blit(out, b, x, floor - (bbox(b).y1)); x += b.w + gap; }

  const record = {
    bFactor: factor, measured, manual: manual != null ? { factor: Number(manual), reason: reason.trim(), landmarks: landmarks?.trim() || undefined, uncertainty: uncertainty?.trim() || undefined } : undefined,
    scaledPart: scaled, scaledBy: scaled ? +k.toFixed(4) : 1, idleScaleA: Number.isFinite(eA.scale) ? +eA.scale.toFixed(4) : null, idleScaleB: Number.isFinite(eB.scale) ? +eB.scale.toFixed(4) : null, afterB_vs_A: after,
    parts: ['A', 'B'].map((p) => `raw/_parts/${anim}_v${pv}_${p}.png`), poses: [parts[0].poses.length, parts[1].poses.length], layout: parts.map((p) => p.layout), gapPx: gap, tool: 'tools/stitch-parts.mjs',
  };
  console.log(`[stitch] ${id} ${anim} v${vv}${pv !== vv ? ` (parts of v${pv})` : ''}: part A ${parts[0].poses.length} pose(s), part B ${parts[1].poses.length} pose(s) (${parts.map((p) => p.layout).join(' / ')}); each matches the idle head at x${record.idleScaleA ?? '?'} / x${record.idleScaleB ?? '?'} of its raw size`);
  console.log(`[stitch] B factor x${factor}${manual != null ? ` (manual: ${reason.trim()}${landmarks ? `; landmarks: ${landmarks.trim()}, +-${uncertainty.trim()}` : ''}; measured x${measured ?? 'n/a'})` : ' (measured)'}: ${scaled ? `part ${scaled} scaled by x${record.scaledBy}` : 'no rescale'}; after: B/A ${after ?? '?'}`);
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
