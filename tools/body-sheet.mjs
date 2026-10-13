#!/usr/bin/env node
// Body sheet (TOOL-036, art/CHARACTER_SCALE.md "Body sheet (TOOL-036)"): how big is the BODY drawn in each packed frame,
// next to the idle and the approved combat cell? Every strip is a separately generated drawing with its own head-to-body
// ratio, and the packer sizes a strip so its head matches the idle, so the head probe (npm run scale) reads 1.00 while
// the body is 10-25 % off (Sasuke superDash about 0.80, Naruto stagger about 1.2) and the fighter morphs between moves.
// This sheet shows the body beside the references so a redraw can be judged by eye.
//
//   npm run body                              every packed fighter: art/scale/body-<id>.png + art/scale/body-report.json
//   npm run body -- killua                    one fighter (several ids allowed)
//   npm run body -- sasuke superDash jumpSquat   only those animations: art/scale/body-sasuke-superDash-jumpSquat.png
//   npm run body -- --scale 2                 integer upscale of the cells (default 1, the game's pixel density)
//   npm run body -- --json                    print the report as JSON
//
// B (body) = sqrt(garment px of the frame / garment px of idle f0): garment px = opaque pixels in the fighter's main
// garment colours (art/scale/builds.json bodyColors, the garment visible in almost every pose). H (head) = the scale
// gate's own per-frame head number from anims.json meta.scaleAudit ('-' when it was not read).
// B is a NOISY, ADVISORY proxy (about +-10 %, pose dependent: a back view or arms crossing over the garment lower it,
// an open coat or a sleeve swinging clear raise it). A flagged strip is confirmed by measuring its body segments (head,
// collar to belt, arm, leg, shoe length) against the idle; a clean B never approves a strip, and a passing head probe
// alone never certifies one.
//
// Sheet: one row per animation in sheet order: idle f0, the approved combat cell (shown in the packed palette), then
// every frame, all at the same pixel density, cropped to 200 px around the pivot. Solid line = the floor (y 240),
// dashed line = idle f0's crown.
// Labels: red when |B - 1| > 0.12, amber when > 0.08. Reads public/characters/<id>/ (packer output),
// public/art-review/title-style-pilot/<id>-combat_v01.png and art/scale/builds.json; writes only the output files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { loadPacked, canvas, px, text, blitCell } from './scale-audit.mjs';
import { bboxOf, median, hex } from './scale-probe.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')); } catch { return null; } };
const r3 = (v) => (Number.isFinite(v) ? Math.round(v * 1000) / 1000 : null);

export const RED_TOL = 0.12; // |B - 1| above this: red label; a strip median beyond it is flagged 'big' / 'small'
export const AMBER_TOL = 0.08;
// bodyColors are exact shipped shades; a repack's median cut moves them a little, so a sheet colour within this RGB
// distance of a declared one still counts. The nearest non-garment shade of the 2026-10-12 palettes is 9.6 away
// (Killua's darker purple), so this keeps today's sets exact.
export const BODY_SNAP = 8;
const CROP_W = 200;
const COMBAT = (publicDir, id) => path.join(publicDir, 'art-review', 'title-style-pilot', `${id}-combat_v01.png`);

// ------------------------------------------------------------------ measuring
const keyAt = (d, i) => (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
const dist = (a, b) => Math.hypot((a >> 16) - (b >> 16), ((a >> 8) & 255) - ((b >> 8) & 255), (a & 255) - (b & 255));

// The sheet colours that are garment, and the declared colours no sheet colour matches (a stale list after a repack).
export function garmentPalette(cells, bodyColors) {
  const want = bodyColors.map((s) => (/^#?[0-9a-f]{6}$/i.test(s) ? parseInt(s.replace('#', ''), 16) : null)).filter((k) => k != null);
  const seen = new Set();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3] > 127) seen.add(keyAt(c.data, i));
  const set = new Set(), hit = new Set();
  for (const k of seen) for (const w of want) if (dist(k, w) <= BODY_SNAP) { set.add(k); hit.add(w); }
  return { set, missing: want.filter((w) => !hit.has(w)).map(hex) };
}

export function garmentPx(cell, set) {
  let n = 0;
  for (let i = 0; i < cell.data.length; i += 4) if (cell.data[i + 3] > 127 && set.has(keyAt(cell.data, i))) n++;
  return n;
}

// One fighter: B and H per frame of each (selected) animation against idle f0. A frame with no garment pixel (a
// vanish frame, an empty cell) has no body number rather than 0.
export function measureBody(P, bodyColors, only = null) {
  const idle = P.anims.find((a) => a.name === 'idle');
  if (!idle) return { error: 'no idle packed - nothing to measure against' };
  const { set, missing } = garmentPalette(P.anims.flatMap((a) => a.cells), bodyColors);
  const ref = garmentPx(idle.cells[0], set);
  if (!ref) return { error: `idle f0 has no pixel in the bodyColors (${bodyColors.length} declared) - re-derive them from the packed palette`, missing };
  const sa = P.meta.scaleAudit?.anims || {};
  const anims = {};
  for (const a of P.anims) {
    if (only && !only.includes(a.name)) continue;
    const rec = sa[a.name] || {}, low = new Set(rec.low || []);
    const body = a.cells.map((c) => { const n = garmentPx(c, set); return n ? r3(Math.sqrt(n / ref)) : null; });
    const head = a.cells.map((_, k) => (low.has(k) || !Number.isFinite(rec.frames?.[k]) ? null : rec.frames[k]));
    const m = r3(median(body));
    anims[a.name] = { v: rec.v ?? null, body, head, median: m, headMedian: r3(median(head)), verdict: rec.verdict ?? null, flag: m == null ? null : m > 1 + RED_TOL ? 'big' : m < 1 - RED_TOL ? 'small' : null };
  }
  return { idleGarmentPx: ref, garmentColors: set.size, missing, anims };
}

// The approved combat cell in the fighter's packed palette (nearest colour), for display only: its thousands of
// unquantized shades, repeated on every row, tripled the sheet's file size. Pixel positions, and so its size, are
// the approved cell's.
export function inPalette(cell, cells) {
  const pal = new Set();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3] > 127) pal.add(keyAt(c.data, i));
  const list = [...pal], cache = new Map(), d = Uint8Array.from(cell.data);
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] <= 127) continue;
    const k = keyAt(d, i);
    let q = cache.get(k);
    if (q === undefined) { let bd = Infinity; for (const p of list) { const dd = dist(k, p); if (dd < bd) { bd = dd; q = p; } } cache.set(k, q); }
    d[i] = q >> 16; d[i + 1] = (q >> 8) & 255; d[i + 2] = q & 255;
  }
  return { w: cell.w, h: cell.h, data: d };
}

// ------------------------------------------------------------------ drawing
const BG = [22, 20, 32], CELL = [40, 37, 56], FLOOR = [130, 130, 150], CROWN = [80, 200, 235];
const WHITE = [235, 235, 245], LIGHT = [195, 195, 210], GREY = [130, 130, 155], AMBER = [255, 190, 60], RED = [255, 60, 70];
const tone = (b) => (b == null ? GREY : Math.abs(b - 1) > RED_TOL ? RED : Math.abs(b - 1) > AMBER_TOL ? AMBER : LIGHT);
const num = (v) => (v == null ? '-' : v.toFixed(2));

export function bodySheet(P, M, { combat = null, scale = 1, only = null } = {}) {
  const S = scale, LS = 2 * S, GAP = 4 * S, TXT = 6 * LS;
  const idle = P.anims.find((a) => a.name === 'idle'), idle0 = idle.cells[0];
  const rows = P.anims.filter((a) => M.anims[a.name]);
  const pivotX = P.meta.pivot?.[0] ?? 128, floor = P.meta.pivot?.[1] ?? 240;
  const sx = pivotX - CROP_W / 2;
  // one vertical crop for the whole sheet, so every cell shares the floor and crown rows
  const shown = [idle0, ...(combat ? [combat] : []), ...rows.flatMap((a) => a.cells)].map(bboxOf).filter(Boolean);
  const Y0 = Math.max(0, Math.min(...shown.map((b) => b.y0)) - 3), Y1 = Math.min(idle0.h - 1, Math.max(floor + 3, ...shown.map((b) => b.y1)));
  const CW = CROP_W * S, CH = (Y1 - Y0 + 1) * S, RH = 4 * S + CH + TXT + 4 * S;
  const LABW = 70 * LS, HEAD = 2 * TXT + 6 * S;
  const cols = (combat ? 2 : 1) + Math.max(...rows.map((a) => a.cells.length));
  const img = canvas(LABW + cols * (CW + GAP), HEAD + rows.length * RH, BG);
  const crownY = bboxOf(idle0)?.y0 ?? Y0;
  const fill = (x0, y0, w, h, c) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(img, x, y, c); };

  text(img, 4 * S, 3 * S, `${P.id} body sheet${only ? ' ' + only.join(' ') : ''}: B = sqrt(garment px / idle f0), H = head probe (scale gate)`, WHITE, LS);
  text(img, 4 * S, 3 * S + TXT, `solid = floor y ${floor}, dashed = idle f0 crown y ${crownY}. B is advisory (+-10 %): confirm by body segments`, GREY, LS);

  rows.forEach((a, r) => {
    const s = M.anims[a.name], oy = HEAD + r * RH, cy = oy + 4 * S;
    const cells = [{ cell: idle0, label: 'idle f0', c: GREY }, ...(combat ? [{ cell: combat, label: 'combat v01', c: GREY }] : []),
      ...a.cells.map((cell, k) => ({ cell, label: `B${num(s.body[k])} H${num(s.head[k])}`, c: tone(s.body[k]) }))];
    // guides first, so the sprites sit on top of them: the floor under each cell, the idle crown across the row
    cells.forEach((_, k) => {
      const ox = LABW + k * (CW + GAP);
      fill(ox, cy, CW, CH, CELL);
      fill(ox, cy + (floor - Y0) * S, CW, S, FLOOR);
    });
    for (let x = LABW; x < LABW + cells.length * (CW + GAP) - GAP; x++) if (x % (8 * S) < 5 * S) fill(x, cy + (crownY - Y0) * S, 1, S, CROWN);
    cells.forEach(({ cell, label, c }, k) => {
      const ox = LABW + k * (CW + GAP);
      blitCell(img, cell, sx, Y0, CROP_W, Y1 - Y0 + 1, ox, cy, S);
      text(img, ox + 2 * S, cy + CH + 3 * S, label, c, LS);
    });
    const flagged = s.flag != null;
    text(img, 4 * S, cy + 2 * S, a.name.slice(0, 16), flagged ? RED : WHITE, LS);
    text(img, 4 * S, cy + 2 * S + TXT, s.v != null ? `v${String(s.v).padStart(2, '0')}` : 'v-', GREY, LS);
    text(img, 4 * S, cy + 2 * S + 2 * TXT, `B ${num(s.median)}${s.flag ? ' ' + s.flag : ''}`, tone(s.median), LS);
    text(img, 4 * S, cy + 2 * S + 3 * TXT, `H ${num(s.headMedian)}`, LIGHT, LS);
    if (s.verdict && s.verdict !== 'ok') text(img, 4 * S, cy + 2 * S + 4 * TXT, s.verdict.slice(0, 16), GREY, LS);
  });
  return img;
}

// ------------------------------------------------------------------ main
function main(argv) {
  const args = argv.slice();
  const flag = (n) => { const i = args.indexOf(n); if (i >= 0) { args.splice(i, 1); return true; } return false; };
  const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : d; };
  const JSON_OUT = flag('--json');
  const scale = Number(opt('--scale', '1'));
  const artDir = path.resolve(opt('--root', path.join(ROOT, 'art')));
  const publicDir = path.resolve(opt('--public', path.join(ROOT, 'public')));
  const outDir = path.resolve(opt('--out', path.join(artDir, 'scale')));
  const unknown = args.find((a) => a.startsWith('-'));
  if (unknown) { console.error(`[body] unknown option ${unknown}`); return 1; }
  if (!Number.isInteger(scale) || scale < 1 || scale > 8) { console.error('[body] --scale must be an integer 1-8'); return 1; }
  const L = (s = '') => { if (!JSON_OUT) console.log(s); };

  const builds = readJson(path.join(artDir, 'scale', 'builds.json'))?.fighters ?? {};
  const charDir = path.join(publicDir, 'characters');
  const packed = fs.existsSync(charDir) ? fs.readdirSync(charDir).filter((id) => fs.existsSync(path.join(charDir, id, 'anims.json')) && fs.existsSync(path.join(charDir, id, 'sheet.png'))).sort() : [];
  const order = [...Object.keys(builds).filter((id) => packed.includes(id)), ...packed.filter((id) => !builds[id])];
  // positional words: packed fighter ids, the rest animation names
  const ids = args.filter((a) => packed.includes(a)), only = args.filter((a) => !packed.includes(a));
  const run = ids.length ? ids : order;
  const anim = only.length ? only : null;
  const known = new Set(run.flatMap((id) => Object.keys(readJson(path.join(charDir, id, 'anims.json'))?.animations ?? {})));
  const bad = (anim || []).filter((n) => !known.has(n));
  if (bad.length) { console.error(`[body] ${bad.map((n) => `"${n}"`).join(', ')}: neither a packed fighter nor an animation of ${run.join(', ')}`); return 1; }

  const reportPath = path.join(outDir, 'body-report.json');
  // a partial run (some fighters or animations) updates its rows and keeps the others' last numbers
  const report = {
    tool: 'tools/body-sheet.mjs',
    method: `B = sqrt(opaque px in the fighter's bodyColors (art/scale/builds.json, sheet colours within RGB ${BODY_SNAP}) / the same on idle f0), per packed frame; head = anims.json scaleAudit frame head (null = not read). median = median B of the strip; flag big > ${1 + RED_TOL}, small < ${1 - RED_TOL}. Advisory: +-10 % pose noise, confirm by body segments (art/CHARACTER_SCALE.md Body sheet).`,
    generated: new Date().toISOString(),
    fighters: readJson(reportPath)?.fighters ?? {},
  };
  let flaggedTotal = 0, failed = false;
  for (const id of run) {
    const decl = builds[id];
    if (!decl?.bodyColors?.length) { L(`\n== ${id}: no bodyColors in art/scale/builds.json - skipped`); continue; }
    const P = loadPacked(id, publicDir);
    if (!P) { console.error(`[body] no packed sheet for "${id}" (public/characters/${id}/)`); failed = true; continue; }
    const present = anim ? anim.filter((n) => P.anims.some((a) => a.name === n)) : null;
    if (anim && !present.length) { L(`\n== ${id}: none of ${anim.join(', ')} is packed - skipped`); continue; }
    const M = measureBody(P, decl.bodyColors, present);
    if (M.error) { L(`\n== ${id}: ${M.error}`); failed = true; continue; }
    const prev = anim ? report.fighters[id]?.anims ?? {} : {};
    report.fighters[id] = { idleGarmentPx: M.idleGarmentPx, anims: { ...prev } };
    for (const [name, s] of Object.entries(M.anims)) report.fighters[id].anims[name] = { v: s.v, body: s.body, head: s.head, median: s.median, headMedian: s.headMedian, flag: s.flag };

    const flagged = Object.entries(M.anims).filter(([, s]) => s.flag);
    flaggedTotal += flagged.length;
    L(`\n== ${id}: idle f0 garment ${M.idleGarmentPx} px (${M.garmentColors} sheet colours); ${flagged.length} of ${Object.keys(M.anims).length} strip(s) off by more than ${Math.round(RED_TOL * 100)} %`);
    if (M.missing.length) L(`   ! bodyColors not in the packed palette: ${M.missing.join(' ')} - re-derive the list (builds.json _bodyColors rule)`);
    for (const [name, s] of flagged) {
      L(`   ${name.padEnd(15)} ${s.v != null ? 'v' + String(s.v).padStart(2, '0') : '   '}  B ${num(s.median)}  H ${num(s.headMedian)}  ${s.flag.toUpperCase().padEnd(5)}  f: ${s.body.map(num).join(' ')}`);
    }
    const cp = COMBAT(publicDir, id);
    let combat = null;
    if (fs.existsSync(cp)) {
      const png = PNG.sync.read(fs.readFileSync(cp));
      if (png.width === P.meta.frameWidth && png.height === P.meta.frameHeight) combat = inPalette({ w: png.width, h: png.height, data: png.data }, P.anims.flatMap((a) => a.cells));
      else L(`   ! ${path.relative(ROOT, cp)} is ${png.width}x${png.height}, not the ${P.meta.frameWidth}x${P.meta.frameHeight} cell - combat column skipped`);
    } else L(`   ! no approved combat cell (${path.relative(ROOT, cp)}) - combat column skipped`);
    const img = bodySheet(P, M, { combat, scale, only: present });
    fs.mkdirSync(outDir, { recursive: true });
    const sheetPath = path.join(outDir, `body-${id}${present ? '-' + present.join('-') : ''}.png`);
    // RGB, no filter, plain deflate: about a third of pngjs's default size for flat pixel art
    const buf = PNG.sync.write(img, { colorType: 2, filterType: 0, deflateStrategy: 0 });
    fs.writeFileSync(sheetPath, buf);
    L(`   wrote ${path.relative(process.cwd(), sheetPath)} (${img.width}x${img.height}, ${(buf.length / 1e6).toFixed(1)} MB)`);
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 1) + '\n');
  if (JSON_OUT) console.log(JSON.stringify(report, null, 1));
  else L(`\n[body] ${flaggedTotal} flagged strip(s); wrote ${path.relative(process.cwd(), reportPath)}. B is advisory (+-10 %): confirm a flagged strip by measuring head, collar to belt, arm, leg and shoe against the idle.`);
  return failed ? 1 : 0;
}

const samePath = (a, b) => (process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b);
if (process.argv[1] && samePath(path.resolve(process.argv[1]), fileURLToPath(import.meta.url))) process.exitCode = main(process.argv.slice(2));
