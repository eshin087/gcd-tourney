#!/usr/bin/env node
// Scale audit (TOOL-025, ADR 0021, art/CHARACTER_SCALE.md "Scale gate (automatic)"): measures every packed frame of
// every fighter against his approved idle with tools/scale-probe.mjs (head silhouette with hair, and feet), the same
// numbers the packer's scale gate uses, and writes what a reviewer looks at:
//
//   npm run scale                     every packed fighter: art/scale/scale-report.json, art/scale/heads-<id>.png
//   npm run scale -- killua           one fighter (several ids allowed)
//   npm run scale -- --guide          also art/characters/<id>/reference/head_scale_guide.png: the idle at the
//                                     generation multiplier (--mult, default 2) with crown, chin and hair-width lines,
//                                     attached to every redraw prompt
//   npm run scale -- --baseline       rewrite every row of art/scale/scale-baseline.json (an intended change); without
//                                     it only new animations and changed versions are recorded
//   npm run scale -- --json           print the report as JSON
//
// heads-<id>.png: one row per animation, the approved idle f0 head first, then every frame's head at 2x. Green box =
// the probe's head blob, dotted grey box = the idle head's size centred on it; a frame outside the tolerance is
// boxed red. Its number is that frame's head scale (1.00 = the idle). Attach it to every strip's REVIEW row.
// Reads public/characters/<id>/ (packer output), art/manifest.json (exemptions, thresholds) and art/scale/builds.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { auditCharacter, auditFromCompact, resolveGate, exemptionsFrom, staleExemptText, bboxOf, isSkin, hex, FLAGGED, verdictText } from './scale-probe.mjs';
import { loadScaleReference } from './pack-sprites.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ------------------------------------------------------------------ loading
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')); } catch { return null; } };

// The packed sheet of one fighter as cells per animation (sheet order), or null when it is not packed.
export function loadPacked(id, publicDir = path.join(ROOT, 'public')) {
  const dir = path.join(publicDir, 'characters', id);
  const meta = readJson(path.join(dir, 'anims.json'));
  if (!meta?.animations || !fs.existsSync(path.join(dir, 'sheet.png'))) return null;
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, 'sheet.png')));
  const W = meta.frameWidth, H = meta.frameHeight, C = meta.columns || Math.floor(png.width / W);
  const cell = (f) => {
    const data = new Uint8Array(W * H * 4), ox = (f % C) * W, oy = Math.floor(f / C) * H;
    for (let y = 0; y < H; y++) data.set(png.data.subarray(((oy + y) * png.width + ox) * 4, ((oy + y) * png.width + ox + W) * 4), y * W * 4);
    return { w: W, h: H, data };
  };
  const anims = Object.entries(meta.animations).map(([name, A]) => ({ name, frames: A.frames, phases: A.phases ?? null, cells: A.frames.map(cell) }));
  return { id, meta, anims };
}

// The version of each packed strip: the packer records it in meta.scaleAudit; older packs fall back to the
// frames/<anim>/.packer.json marker the cells were written from.
function versionOf(id, name, meta, artDir) {
  const v = meta.scaleAudit?.anims?.[name]?.v;
  if (v !== undefined) return v;
  const m = readJson(path.join(artDir, 'characters', id, 'frames', name, '.packer.json'));
  return Number.isInteger(m?.version) ? m.version : null;
}

// Audit one packed fighter with the packer gate's own numbers: the per-frame measurements it recorded in anims.json
// (meta.scaleAudit, taken before --quantize against the idle's palette), judged with today's manifest. A pack that
// predates them is measured from the sheet (A.legacy): close, but the shipped palette is the whole fighter's median
// cut, so a borderline strip can read differently from the gate until it is repacked.
export function auditPacked(id, { artDir = path.join(ROOT, 'art'), publicDir = path.join(ROOT, 'public'), manifest = null, builds = null } = {}) {
  const P = loadPacked(id, publicDir);
  if (!P) return null;
  manifest = manifest ?? readJson(path.join(artDir, 'manifest.json')) ?? {};
  builds = builds ?? readJson(path.join(artDir, 'scale', 'builds.json'))?.fighters ?? {};
  const gate = resolveGate(manifest.spec?.scaleGate);
  const exempt = exemptionsFrom(manifest.characters?.[id]?.animations);
  let A = auditFromCompact(P.meta.scaleAudit, { gate, exempt });
  if (!A) {
    A = auditCharacter(P.anims.map((a) => ({ name: a.name, cells: a.cells, phases: a.phases, version: versionOf(id, a.name, P.meta, artDir) })), {
      decl: builds[id] || {}, gate, exempt, maxColors: manifest.spec?.maxColors ?? 48, reference: loadScaleReference(artDir, builds[id] || {}),
    });
    A.legacy = true;
  }
  return { P, A, gate, mc: manifest.characters?.[id] || {} };
}

// ------------------------------------------------------------------ drawing
// 3x5 pixel font for labels (digits, capitals and a few signs), so the sheets need no font files. Shared with
// tools/body-sheet.mjs, as are the drawing helpers below.
export const GLYPHS = {
  0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111',
  6: '111100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001111', '.': '000000000000010', '-': '000000111000000',
  '+': '000010111010000', ',': '000000000010100', ':': '000010000010000', '/': '001001010100100', '%': '101001010100101', ' ': '000000000000000', '?': '111001011000010',
  '(': '010100100100010', ')': '010001001001010', '=': '000111000111000', '<': '001010100010001', '>': '100010001010100',
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
  G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
  M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101',
  S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
  Y: '101101010010010', Z: '111001010100111',
};

export function canvas(w, h, bg) {
  const img = new PNG({ width: w, height: h });
  for (let i = 0; i < img.data.length; i += 4) { img.data[i] = bg[0]; img.data[i + 1] = bg[1]; img.data[i + 2] = bg[2]; img.data[i + 3] = 255; }
  return img;
}
export function px(img, x, y, c) {
  if (x < 0 || y < 0 || x >= img.width || y >= img.height) return;
  const i = (y * img.width + x) * 4;
  img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
}
export function text(img, x, y, s, c, sc = 2) {
  for (const ch of String(s).toUpperCase()) {
    const g = GLYPHS[ch] ?? GLYPHS['?'];
    for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (g[r * 3 + q] === '1') for (let dy = 0; dy < sc; dy++) for (let dx = 0; dx < sc; dx++) px(img, x + q * sc + dx, y + r * sc + dy, c);
    x += 4 * sc;
  }
}
// rectangle outline in canvas px, clipped to `clip` ([x0, y0, x1, y1]); dotted draws every other pixel
function frame(img, x0, y0, x1, y1, c, dotted = false, clip = null) {
  const dot = (x, y) => { if (!clip || (x >= clip[0] && y >= clip[1] && x <= clip[2] && y <= clip[3])) px(img, x, y, c); };
  for (let x = x0; x <= x1; x++) if (!dotted || x % 2 === 0) { dot(x, y0); dot(x, y1); }
  for (let y = y0; y <= y1; y++) if (!dotted || y % 2 === 0) { dot(x0, y); dot(x1, y); }
}
// a cell region (sx, sy, w, h) at scale sc into the canvas at (ox, oy); transparent pixels stay background
export function blitCell(img, cell, sx, sy, w, h, ox, oy, sc) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const X = sx + x, Y = sy + y;
    if (X < 0 || Y < 0 || X >= cell.w || Y >= cell.h) continue;
    const i = (Y * cell.w + X) * 4;
    if (cell.data[i + 3] < 128) continue;
    const c = [cell.data[i], cell.data[i + 1], cell.data[i + 2]];
    for (let dy = 0; dy < sc; dy++) for (let dx = 0; dx < sc; dx++) px(img, ox + x * sc + dx, oy + y * sc + dy, c);
  }
}

const BG = [34, 30, 48], GREEN = [0, 230, 110], RED = [255, 60, 70], GREY = [150, 150, 175], WHITE = [235, 235, 245], AMBER = [255, 190, 60];
const CROP = 64, SC = 2, CW = CROP * SC + 6, LABEL = 14, LABW = 136, RH = CROP * SC + LABEL + 6;

// heads-<id>.png: one row per animation (name, verdict, median head, version), the approved idle f0 head, then each
// frame's head crop with its probe box and number
export function headsSheet({ P, A, gate }) {
  const idle = P.anims.find((a) => a.name === 'idle');
  const cols = 1 + Math.max(...P.anims.map((a) => a.cells.length));
  const img = canvas(LABW + cols * CW, P.anims.length * RH, BG);
  const [rw, rh] = [A.ref.hW, A.ref.hH];
  const crop = (cell, box, ox, oy, head, out) => {
    const b = box || (() => { const bb = bboxOf(cell); return bb ? [bb.x0, bb.y0, bb.x1, bb.y0 + 30] : [96, 20, 160, 60]; })();
    const cx = Math.round((b[0] + b[2]) / 2), cy = Math.round((b[1] + b[3]) / 2);
    const sx = Math.max(0, Math.min(cell.w - CROP, cx - CROP / 2)), sy = Math.max(0, Math.min(cell.h - CROP, cy - CROP / 2));
    blitCell(img, cell, sx, sy, CROP, CROP, ox, oy, SC);
    const tx = (x) => ox + (x - sx) * SC, ty = (y) => oy + (y - sy) * SC, clip = [ox, oy, ox + CROP * SC - 1, oy + CROP * SC - 1];
    // the idle head's size centred on this frame's head: the ghost the reviewer compares against
    frame(img, tx(cx - rw / 2) | 0, ty(cy - rh / 2) | 0, tx(cx + rw / 2) | 0, ty(cy + rh / 2) | 0, GREY, true, clip);
    if (box) frame(img, tx(box[0]) - 1, ty(box[1]) - 1, tx(box[2] + 1), ty(box[3] + 1), out ? RED : GREEN, false, clip);
    if (head === undefined) return;
    if (head != null) text(img, ox + 2, oy + CROP * SC + 3, head.toFixed(2), out ? RED : WHITE);
    else text(img, ox + 2, oy + CROP * SC + 3, 'NO HEAD', AMBER);
  };
  P.anims.forEach((a, r) => {
    const s = A.anims[a.name], oy = r * RH, flagged = FLAGGED.has(s.verdict);
    // label column, then the reference (idle f0) and every frame of the strip
    text(img, 4, oy + 6, a.name.slice(0, 16), flagged ? RED : WHITE);
    text(img, 4, oy + 24, s.verdict === 'ref' ? 'reference' : s.verdict, flagged ? RED : AMBER);
    if (s.head != null) text(img, 4, oy + 42, `head ${s.head.toFixed(2)}`, WHITE);
    if (s.feet != null) text(img, 4, oy + 60, `feet ${s.feet.toFixed(2)}`, GREY);
    if (s.version != null) text(img, 4, oy + 78, `v${String(s.version).padStart(2, '0')}`, GREY);
    crop(idle.cells[0], A.anims.idle.frames[0].box, LABW, oy, undefined, false);
    text(img, LABW + 2, oy + CROP * SC + 3, 'idle f0', GREY);
    a.cells.forEach((c, k) => {
      const f = s.frames[k], ox = LABW + (k + 1) * CW;
      const out = !f.skipped && !f.low && f.head != null && s.verdict !== 'ref' && FLAGGED.has(s.verdict) && Math.abs(f.head - 1) > gate.stripTol;
      crop(c, f.box, ox, oy, f.skipped || f.low ? undefined : f.head, out);
      if (f.skipped) text(img, ox + 2, oy + CROP * SC + 3, 'exempt', GREY);
      else if (f.low) text(img, ox + 2, oy + CROP * SC + 3, 'not read', GREY);
    });
  });
  return img;
}

// Estimated chin row under a head box: the lowest row of the face's skin run (the neck is narrower than the face). A
// face that never narrows within 1.4 hair widths of the crown (an open collar shows the chest, hair hides the cheeks)
// gives no chin rather than a wrong one.
function estimateChin(cell, box) {
  const x0 = Math.max(0, box[0] - 2), x1 = Math.min(cell.w - 1, box[2] + 2);
  const w = [], last = Math.min(cell.h - 1, box[1] + Math.round(1.4 * (box[2] - box[0] + 1)));
  for (let y = box[1]; y <= last; y++) {
    let n = 0;
    for (let x = x0; x <= x1; x++) { const i = (y * cell.w + x) * 4; if (cell.data[i + 3] >= 128 && isSkin((cell.data[i] << 16) | (cell.data[i + 1] << 8) | cell.data[i + 2])) n++; }
    w.push(n);
  }
  const M = Math.max(...w);
  if (M < 3) return null;
  let y = w.indexOf(M), gap = 0;
  while (y + 1 < w.length && (w[y + 1] >= 0.6 * M || (gap++ < 1 && w[y + 2] >= 0.6 * M))) y++;
  return y + 1 < w.length ? box[1] + y : null;
}

// head_scale_guide.png: the approved idle f0 at the generation multiplier with the lines a redraw must match
export function headGuide({ P, A }, mult = 2) {
  const idle = P.anims.find((a) => a.name === 'idle'), cell = idle.cells[0], box = A.anims.idle.frames[0].box || A.ref.box;
  const bb = bboxOf(cell), floor = P.meta.pivot?.[1] ?? 240, chin = estimateChin(cell, box);
  const ZOOM = 6, HC = 72, figW = cell.w * mult, panelX = figW + 24;
  const img = canvas(panelX + HC * ZOOM + 16, Math.max(cell.h * mult, HC * ZOOM) + 120, [232, 232, 238]);
  const INK = [40, 40, 60], LINE = [0, 170, 90], CHIN = [0, 150, 220], WIDTH = [235, 120, 0];
  blitCell(img, cell, 0, 0, cell.w, cell.h, 0, 0, mult);
  const hline = (y, x0, x1, c, dotted) => { for (let x = x0; x <= x1; x++) if (!dotted || x % 4 < 2) px(img, x, y, c); };
  const vline = (x, y0, y1, c) => { for (let y = y0; y <= y1; y++) px(img, x, y, c); };
  // left: the whole figure, lines at the multiplier
  hline(box[1] * mult, 0, figW - 1, LINE); hline((box[3] + 1) * mult, 0, figW - 1, LINE, true);
  if (chin != null) hline((chin + 1) * mult, 0, figW - 1, CHIN);
  vline(box[0] * mult, box[1] * mult, ((chin ?? box[3]) + 1) * mult, WIDTH); vline((box[2] + 1) * mult, box[1] * mult, ((chin ?? box[3]) + 1) * mult, WIDTH);
  hline((floor + 1) * mult, 0, figW - 1, INK);
  // right: the head at 6x with the same lines
  const sx = Math.max(0, Math.round((box[0] + box[2]) / 2 - HC / 2)), sy = Math.max(0, box[1] - 6);
  blitCell(img, cell, sx, sy, HC, HC, panelX, 0, ZOOM);
  const tx = (x) => panelX + (x - sx) * ZOOM, ty = (y) => (y - sy) * ZOOM;
  hline(ty(box[1]), panelX, panelX + HC * ZOOM - 1, LINE); hline(ty(box[3] + 1), panelX, panelX + HC * ZOOM - 1, LINE, true);
  if (chin != null) hline(ty(chin + 1), panelX, panelX + HC * ZOOM - 1, CHIN);
  vline(tx(box[0]), ty(box[1]), ty((chin ?? box[3]) + 1), WIDTH); vline(tx(box[2] + 1), ty(box[1]), ty((chin ?? box[3]) + 1), WIDTH);
  const hw = box[2] - box[0] + 1, hh = box[3] - box[1] + 1, cc = chin != null ? chin - box[1] + 1 : null, stand = bb ? floor - bb.y0 + 1 : null;
  const y0 = Math.max(cell.h * mult, HC * ZOOM) + 8;
  const lines = [
    [`${P.id} idle f0 at x${mult}: draw every pose at this head size`, INK],
    [`green: crown (hair top) and hair mass bottom - hair mass ${hh} px tall (x${mult} = ${hh * mult})`, LINE],
    [`orange: hair width ${hw} px (x${mult} = ${hw * mult})`, WIDTH],
    [chin != null ? `blue: chin (est.) - crown to chin ${cc} px (x${mult} = ${cc * mult})` : 'chin not found (no skin under the hair)', CHIN],
    [`standing with hair ${stand} px (x${mult} = ${stand * mult}); floor = black line`, INK],
  ];
  lines.forEach(([s, c], k) => text(img, 8, y0 + k * 22, s.replace(/[^0-9a-z .:/%()=+<>-]/gi, ' '), c, 3));
  return { img, numbers: { hairWidth: hw, hairHeight: hh, crownToChin: cc, standing: stand, mult } };
}

// ------------------------------------------------------------------ main
function main(argv) {
  const args = argv.slice();
  const flag = (n) => { const i = args.indexOf(n); if (i >= 0) { args.splice(i, 1); return true; } return false; };
  const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : d; };
  const GUIDE = flag('--guide'), BASELINE = flag('--baseline'), JSON_OUT = flag('--json');
  const artDir = path.resolve(opt('--root', path.join(ROOT, 'art')));
  const publicDir = path.resolve(opt('--public', path.join(ROOT, 'public')));
  const outDir = path.resolve(opt('--out', path.join(artDir, 'scale')));
  const mult = Number(opt('--mult', '2'));
  const unknown = args.find((a) => a.startsWith('-'));
  if (unknown) { console.error(`[scale] unknown option ${unknown}`); return 1; }
  const manifest = readJson(path.join(artDir, 'manifest.json')) ?? {};
  const builds = readJson(path.join(artDir, 'scale', 'builds.json'))?.fighters ?? {};
  const charDir = path.join(publicDir, 'characters');
  const packed = fs.existsSync(charDir) ? fs.readdirSync(charDir).filter((id) => fs.existsSync(path.join(charDir, id, 'anims.json'))).sort() : [];
  const order = [...Object.keys(builds).filter((id) => packed.includes(id)), ...packed.filter((id) => !builds[id])];
  const ids = args.length ? args : order;
  const report = { _doc: 'npm run scale (tools/scale-audit.mjs): every packed frame against the approved idle. head = head silhouette with hair, feet = shoe area (1.00 = the idle). Verdicts: art/CHARACTER_SCALE.md "Scale gate (automatic)".', fighters: {} };
  const basePath = path.join(outDir, 'scale-baseline.json');
  const baseline = readJson(basePath) ?? { _doc: 'Head scale per approved strip at its version (tools/scale-audit.mjs). The packer warns when a strip moves more than spec.scaleGate.baselineTol at the same version. npm run scale records new animations and changed versions; npm run scale -- --baseline rewrites every row (an intended change).', fighters: {} };
  let flaggedTotal = 0;
  const L = (s = '') => { if (!JSON_OUT) console.log(s); };
  for (const id of ids) {
    const R = auditPacked(id, { artDir, publicDir, manifest, builds });
    if (!R) { console.error(`[scale] no packed sheet for "${id}" (public/characters/${id}/)`); return 1; }
    const { A, gate } = R;
    if (A.error) { L(`== ${id}: ${A.error}`); report.fighters[id] = { error: A.error }; continue; }
    const counts = {};
    const anims = {};
    for (const [name, s] of Object.entries(A.anims)) {
      counts[s.verdict] = (counts[s.verdict] || 0) + 1;
      anims[name] = { v: s.version, head: s.head, feet: s.feet, range: s.range, verdict: s.verdict, reason: s.reason ?? undefined, staleExempt: s.staleExempt, frames: s.frames.map((f) => ({ head: f.head, feet: f.feet, box: f.box, ...(f.skipped ? { exempt: true } : {}), ...(f.low ? { notRead: true } : {}) })) };
    }
    report.fighters[id] = { palette: { head: [...A.palette.head].map(hex), feet: [...A.palette.feet].map(hex), source: A.palette.headSource }, ref: { headPx: A.ref.headPx, box: A.ref.box, feetPx: A.ref.feet }, counts, anims };
    L(`\n== ${id}: idle head ${A.ref.headPx.join('x')} px (${A.palette.headSource} palette ${[...A.palette.head].map(hex).join(' ')})`);
    if (A.legacy) L(`   (measured from the sheet: this pack predates the recorded gate numbers; repack with npm run sprites ${id} for the gate's own)`);
    L(`   ${Object.entries(counts).map(([k, n]) => `${n} ${k}`).join(', ')}`);
    const pct = (v) => (v == null ? '   -' : `${v >= 1 ? '+' : ''}${Math.round((v - 1) * 100)}%`.padStart(4));
    for (const [name, s] of Object.entries(A.anims)) {
      if (!FLAGGED.has(s.verdict)) continue;
      flaggedTotal++;
      L(`   ${name.padEnd(15)} ${s.version != null ? 'v' + String(s.version).padStart(2, '0') : '   '}  head ${pct(s.head)}  feet ${pct(s.feet)}  ${s.verdict.toUpperCase().padEnd(8)} f: ${s.frames.map((f) => (f.head == null ? '-' : f.head.toFixed(2))).join(' ')}`);
    }
    for (const [name, s] of Object.entries(A.anims)) if (s.staleExempt) L(`   ! ${staleExemptText(name, s.staleExempt)}`);
    // baseline: a strip whose head moved at the same version is reported; new rows and new versions are recorded
    const B = (baseline.fighters[id] = baseline.fighters[id] || { ref: null, anims: {} });
    if (BASELINE || !B.ref) B.ref = { headPx: A.ref.headPx };
    for (const [name, s] of Object.entries(A.anims)) {
      const b = B.anims[name];
      if (s.head == null) continue;
      if (b && !BASELINE && b.v === s.version && Math.abs(s.head - b.head) > gate.baselineTol) L(`   ! ${name} head ${s.head.toFixed(2)} vs ${b.head.toFixed(2)} in the baseline at the same version: something resized it (--baseline accepts it)`);
      if (BASELINE || !b || b.v !== s.version) B.anims[name] = { v: s.version, head: s.head };
    }
    fs.mkdirSync(outDir, { recursive: true });
    const sheetPath = path.join(outDir, `heads-${id}.png`);
    fs.writeFileSync(sheetPath, PNG.sync.write(headsSheet(R)));
    L(`   wrote ${path.relative(process.cwd(), sheetPath)}`);
    if (GUIDE) {
      const { img, numbers } = headGuide(R, mult);
      const gp = path.join(artDir, 'characters', id, 'reference', 'head_scale_guide.png');
      fs.mkdirSync(path.dirname(gp), { recursive: true });
      fs.writeFileSync(gp, PNG.sync.write(img));
      report.fighters[id].guide = numbers;
      L(`   wrote ${path.relative(process.cwd(), gp)} (hair ${numbers.hairWidth}x${numbers.hairHeight} px, crown to chin ${numbers.crownToChin ?? '?'} px, x${mult})`);
    }
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'scale-report.json'), JSON.stringify(report, null, 1) + '\n');
  fs.writeFileSync(basePath, JSON.stringify(baseline, null, 1) + '\n');
  if (JSON_OUT) console.log(JSON.stringify(report, null, 1));
  else L(`\n[scale] ${flaggedTotal} flagged strip(s); wrote ${path.relative(process.cwd(), path.join(outDir, 'scale-report.json'))} and scale-baseline.json. Fixes: art/scale/SCALE_FIX_BRIEF.md`);
  return 0;
}

const samePath = (a, b) => (process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b);
if (process.argv[1] && samePath(path.resolve(process.argv[1]), fileURLToPath(import.meta.url))) process.exitCode = main(process.argv.slice(2));
export { verdictText };
