#!/usr/bin/env node
// GCD Tourney sprite packer: art/ (ChatGPT output) -> public/ (what the game loads).
//
//   npm run sprites                 pack every character + every world-art kind (vfx, crowd, stage, npc, ui)
//   npm run sprites naruto          pack one character (several ids allowed)
//   npm run sprites vfx             pack only the VFX atlas (approved effects only)
//   npm run sprites crowd           pack only the crowd atlas (approved spectators only)
//   npm run sprites stage npc ui    pack the approved stage slots, NPC sheets and shared UI images
//   npm run sprites -- --candidates world art: pack every latest candidate into public/preview/ instead of the
//                                   shipped folders (git-ignored; the game shows it with ?art=custom)
//   npm run sprites -- --dry-run    report only, write nothing
//
// See tools/README.md for every option, art/SPEC.md for the sprite spec and
// docs/decisions/0007-art-spec-v2-shippuden-256.md for where the spec v2 numbers come from.
// Node ESM, single dependency: pngjs. Never throws on missing folders/animations: it reports them.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, '..');
const PACKER_VERSION = 2;

// ============================================================== spec (art/manifest.json "spec" block)
// The manifest's spec block is the authority. These are the spec v2 defaults (ADR 0007), used for any key
// the manifest leaves out or gets wrong (a malformed value is warned and replaced by its default).
const SPEC_DEFAULTS = Object.freeze({
  name: 'hi-res sprite spec v2', frameWidth: 256, frameHeight: 256, columns: 16, pivot: Object.freeze([128, 240]), pixelsPerUnit: 128,
  facing: 'right', maxColors: 48, warnColors: 64, cellMargin: 4, standingBodyPx: 200,
});
// The only version suffix the file scan understands (raw/<anim>_vNN.png).
const VERSION_SUFFIX = '_vNN';

// Max trimmed body height (px, hair included) per animation in the 256 cell: the ADR 0007 table. Upright poses are
// spec v1 x 204/135; lying and flying poses are set so they also fit the cell width. The manifest overrides these.
const BODY_HEIGHT = {
  idle: 204, run: 204, dash: 160, superDash: 120, backDash: 207, jumpSquat: 162, jumpUp: 198, jumpFall: 209, land: 174, airRecover: 180,
  light1: 204, light2: 204, light3: 215, light4: 207, heavy: 218, airLight1: 198, airLight2: 207, airLight3: 201, airHeavy: 198, throw: 201,
  guard: 198, block: 204, hurtHigh: 195, hurtLow: 183, launched: 136, spin: 160, down: 96, ko: 64, getup: 204, stagger: 207, charge: 198,
  beamCharge: 198, beamFire: 198, vanish: 221, special: 204, intro: 210, taunt: 212, win: 212,
};
const DEFAULT_BODY_HEIGHT = 204;

// The pixel thresholds of the hitbox heuristics were tuned on spec v1 art (standing body ~136 px). They scale
// with the spec's standing body so a bigger sprite behaves the same (spec v2: 200 / 136 = x1.47).
const V1_STANDING_BODY_PX = 136;

// The game only switches to a custom sheet when all of these exist ("complete": true).
const CORE = ['idle', 'run', 'dash', 'jumpUp', 'jumpFall', 'land', 'light1', 'light2', 'light3', 'light4', 'heavy', 'airLight1', 'airHeavy',
  'guard', 'hurtHigh', 'launched', 'down', 'getup', 'special', 'beamCharge', 'beamFire', 'charge', 'win'];

// Default ms per frame (number = every frame). Mirrors the placeholder bake timings (src/art/rig/anims.js).
// When the frame count differs, the total duration is kept and spread evenly.
const DEFAULT_MS = {
  idle: 150, run: 60, dash: 60, superDash: 50, backDash: [60, 60, 80], jumpSquat: [70], jumpUp: 80, jumpFall: 80, land: [50, 70], airRecover: [50, 50, 60],
  light1: [30, 30, 40, 50, 50, 50, 30], light2: [35, 30, 40, 50, 60, 50, 30], light3: [40, 35, 45, 60, 60, 60, 30], light4: [50, 45, 35, 40, 70, 70, 70, 40],
  heavy: [40, 35, 30, 50, 70, 70, 60, 30], airLight1: [45, 35, 50, 50, 30], airLight2: [45, 40, 50, 50, 30], airLight3: [50, 40, 50, 70, 60, 30],
  airHeavy: [50, 45, 45, 70, 70, 40], throw: [50, 60, 70, 50], guard: 300, block: [60, 80], hurtHigh: [70, 90, 100], hurtLow: [70, 90, 100],
  launched: 70, spin: 60, down: [80, 420], ko: [500], getup: [70, 60, 60, 80, 70], stagger: 150, charge: 50, beamCharge: 50, beamFire: 50,
  vanish: [50, 50], special: [120, 120, 120, 120, 120, 160, 110, 70], intro: 150, taunt: 250, win: 200,
};

// Attacks whose damage comes from something else (projectile): no melee hitbox.
const NO_HITBOX = new Set(['throw']);

// Used only if src/art/animGuide.js cannot be imported or parsed.
const FALLBACK_GUIDE = {
  idle: { frames: 8, loop: true }, run: { frames: 8, loop: true }, dash: { frames: 2, loop: true }, backDash: { frames: 3 },
  superDash: { frames: 2, loop: true }, jumpSquat: { frames: 1 }, jumpUp: { frames: 2, loop: true }, jumpFall: { frames: 2, loop: true },
  land: { frames: 2 }, light1: { frames: 7, phases: [2, 2, 3] }, light2: { frames: 7, phases: [2, 2, 3] }, light3: { frames: 7, phases: [2, 2, 3] },
  light4: { frames: 8, phases: [3, 2, 3] }, heavy: { frames: 8, phases: [3, 2, 3] }, airLight1: { frames: 5, phases: [1, 2, 2] },
  airLight2: { frames: 5, phases: [1, 2, 2] }, airLight3: { frames: 6, phases: [2, 2, 2] }, airHeavy: { frames: 6, phases: [2, 2, 2] },
  guard: { frames: 2, loop: true }, block: { frames: 2 }, hurtHigh: { frames: 3 }, hurtLow: { frames: 3 }, launched: { frames: 2, loop: true },
  spin: { frames: 4, loop: true }, airRecover: { frames: 3 }, down: { frames: 2 }, getup: { frames: 5 }, charge: { frames: 4, loop: true },
  throw: { frames: 4, phases: [1, 1, 2] }, beamCharge: { frames: 3, loop: true }, beamFire: { frames: 3, loop: true }, vanish: { frames: 2 },
  stagger: { frames: 4, loop: true }, ko: { frames: 1 }, special: { frames: 8, phases: [3, 3, 2] }, intro: { frames: 4, loop: true },
  taunt: { frames: 2, loop: true }, win: { frames: 4, loop: true },
};

// VFX atlas spec. fill = size of the largest frame of the strip as a fraction of the cell
// (matches the procedural effects in src/art/vfxPainter.js so world sizes stay the same).
// baseX: bottom effects centered on the mean x of their base rows (keeps a leaning tip leaning).
// lumaAlpha: drawn as opaque grey rings on magenta; packed as white with alpha = grey value.
const VFX = Object.freeze({ cell: 128, ppu: 56, baseline: 120 });
const VFX_EFFECTS = {
  spark: { frames: 5, ms: 30, tinted: true, fill: 0.85 },
  burst: { frames: 5, ms: 35, tinted: true, fill: 0.9 },
  ring: { frames: 6, ms: 35, tinted: true, fill: 0.94 },
  dust: { frames: 6, ms: 60, tinted: false, fill: 0.6 },
  smoke: { frames: 7, ms: 55, tinted: false, fill: 0.7 },
  shuriken: { frames: 4, ms: 40, tinted: false, fill: 0.3 },
  fire: { frames: 4, ms: 60, tinted: false, fill: 0.62 },
  flame: { frames: 7, ms: 55, tinted: true, fill: 0.75, anchor: 'bottom', baseX: true },
  lightning: { frames: 6, ms: 40, tinted: true, fill: 0.9 },
  orb: { frames: 6, ms: 40, tinted: false, fill: 0.42 },
  glow: { frames: 2, ms: 60, tinted: true, fill: 0.82, lumaAlpha: true },
  streak: { frames: 6, ms: 45, tinted: true, fill: 0.8, anchor: 'bottom' },
  star: { frames: 5, ms: 40, tinted: true, fill: 0.4 },
  crater: { frames: 3, ms: 1000, tinted: false, fill: 0.97 },
  lines: { frames: 4, ms: 40, tinted: true, fill: 0.95 },
  // canon power-ups (ENG-069, ADR 0023): drawn white, tinted per fighter at runtime
  bubble: { frames: 6, ms: 50, tinted: true, fill: 0.3 },
  wisp: { frames: 7, ms: 55, tinted: true, fill: 0.6, anchor: 'bottom', baseX: true },
  arc: { frames: 6, ms: 40, tinted: true, fill: 0.45 },
  ripple: { frames: 5, ms: 50, tinted: true, fill: 0.95 },
  naruto_chakraTail: { frames: 6, ms: 60, tinted: true, fill: 0.7, anchor: 'bottom' },
};
const VFX_ALPHA_LEVELS = [0, 110, 200, 255];

// Per-character UI images: art/characters/<id>/ui/<name>.png -> public/characters/<id>/<name>.png
const UI_ITEMS = {
  portrait: { w: 96, h: 96, align: 'bottom' },
  cutin: { w: 480, h: 128, align: 'center' },
  select: { w: 384, h: 384, align: 'bottom' },
};

const MAGENTA = [255, 0, 255];
const MARKER = '.packer.json';

// ============================================================== CLI
class UsageError extends Error {}

const HELP = `GCD Tourney sprite packer  (art/ -> public/)

usage: node tools/pack-sprites.mjs [targets...] [options]
       npm run sprites [targets...] [-- options]

targets   character ids (folder names under art/characters/), "vfx", "crowd", "stage", "npc", "ui", or "all"
          (default: every character + every world-art kind)

options
  --root <dir>      art folder to read (default: ./art). Aliases: --src, --art
  --out <dir>       public folder to write (default: ./public) -> <out>/characters/<id>/, <out>/vfx|crowd|stage|npc|ui/
  --manifest <file> manifest to read (default: <root>/manifest.json; falls back to src/art/animGuide.js)
  --guide <file>    animation guide module (default: src/art/animGuide.js)
  --dry-run         analyse and report, write nothing
  --no-writeback    do not write cleaned frames back to art/.../frames/<anim>/
  --quantize <n>    snap each character to an n-color palette (median cut over all its frames), e.g. 48
  --tolerance <n>   background color tolerance (RGB distance, default 72)
  --update-manifest raise "status" in art/manifest.json: packed anims/effects/ui -> "packed",
                    raw that could not be packed -> "raw". Never lowers a status ("approved" stays).
                    Also raises "version" to the highest raw/<anim>_vNN.png found ("approvedVersion" is never touched).
  --candidates      world art (vfx, crowd, stage, npc, ui) is approval-gated: by default only items with an
                    "approvedVersion" in the manifest are packed, and stale outputs are removed when their
                    approval is gone. --candidates packs every latest candidate into <out>/preview/<kind>/
                    instead (git-ignored, local review with ?art=custom); the shipped folders stay untouched.
  --json            print the report as JSON (for scripts/agents) instead of text
  --strict          exit code 2 when there are warnings
  -h, --help        this help
`;

function parseArgs(argv) {
  const o = { targets: [], root: null, out: null, manifest: null, guide: null, dryRun: false, writeback: true, json: false, strict: false, quantize: 0, tol: 72, updateManifest: false, candidates: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const eq = a.indexOf('=');
    const key = a.startsWith('--') && eq > 0 ? a.slice(0, eq) : a;
    const val = () => {
      const v = a.startsWith('--') && eq > 0 ? a.slice(eq + 1) : argv[++i];
      if (v == null || v === '') throw new UsageError(`${key} needs a value`);
      return v;
    };
    const num = () => {
      const v = Number(val());
      if (!Number.isFinite(v)) throw new UsageError(`${key} needs a number`);
      return v;
    };
    switch (key) {
      case '--root': case '--src': case '--art': o.root = val(); break;
      case '--out': o.out = val(); break;
      case '--manifest': o.manifest = val(); break;
      case '--guide': o.guide = val(); break;
      case '--dry-run': o.dryRun = true; break;
      case '--no-writeback': o.writeback = false; break;
      case '--json': o.json = true; break;
      case '--update-manifest': o.updateManifest = true; break;
      case '--candidates': o.candidates = true; break;
      case '--strict': o.strict = true; break;
      case '--quantize': o.quantize = Math.round(num()); break;
      case '--tolerance': case '--tol': o.tol = num(); break;
      case '-h': case '--help': o.help = true; break;
      default:
        if (a.startsWith('-')) throw new UsageError(`unknown option ${a}`);
        o.targets.push(a);
    }
  }
  if (o.quantize && (o.quantize < 2 || o.quantize > 256)) throw new UsageError('--quantize must be between 2 and 256');
  if (!(o.tol > 0 && o.tol <= 442)) throw new UsageError('--tolerance must be between 1 and 442 (RGB distance)');
  return o;
}

// ============================================================== fs helpers
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const listDir = (p) => { try { return fs.readdirSync(p, { withFileTypes: true }); } catch { return []; } };
const listDirs = (p) => listDir(p).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const listFiles = (p) => listDir(p).filter((d) => d.isFile()).map((d) => d.name);
const natural = (a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
const listPngs = (p) => listFiles(p).filter((n) => /\.png$/i.test(n)).sort(natural);
const sha1 = (buf) => crypto.createHash('sha1').update(buf).digest('hex');
const rel = (from, p) => path.relative(from, p).split(path.sep).join('/');

function readJson(file) {
  if (!isFile(file)) return { exists: false, data: null, error: null };
  try {
    return { exists: true, data: JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')), error: null };
  } catch (e) {
    return { exists: true, data: null, error: e.message };
  }
}

// ============================================================== image helpers (RGBA8)
function newImage(w, h) { return { w, h, data: new Uint8Array(w * h * 4) }; }

const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const MAX_PIXELS = 40e6; // ChatGPT images are ~2 MP; anything this big is a mistake and could exhaust memory

function readPng(file) {
  const buf = fs.readFileSync(file);
  if (!buf.length) throw new Error('empty file');
  if (buf.length < 24 || !buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('not a PNG file (wrong signature - re-save it as PNG)');
  const w0 = buf.readUInt32BE(16), h0 = buf.readUInt32BE(20);
  if (w0 * h0 > MAX_PIXELS) throw new Error(`image too large (${w0}x${h0})`);
  let png;
  try { png = PNG.sync.read(buf); } catch (e) { throw new Error(`corrupt PNG (${e.message})`); }
  return { w: png.width, h: png.height, data: new Uint8Array(png.data.buffer, png.data.byteOffset, png.data.length) };
}

function encodePng(img) {
  const png = new PNG({ width: img.w, height: img.h });
  png.data = Buffer.from(img.data.buffer, img.data.byteOffset, img.data.length);
  return PNG.sync.write(png, { colorType: 6 });
}

function crop(img, x0, y0, w, h) {
  const out = newImage(w, h);
  for (let y = 0; y < h; y++) {
    const sy = y0 + y;
    if (sy < 0 || sy >= img.h) continue;
    for (let x = 0; x < w; x++) {
      const sx = x0 + x;
      if (sx < 0 || sx >= img.w) continue;
      const si = (sy * img.w + sx) * 4, di = (y * w + x) * 4;
      out.data[di] = img.data[si]; out.data[di + 1] = img.data[si + 1]; out.data[di + 2] = img.data[si + 2]; out.data[di + 3] = img.data[si + 3];
    }
  }
  return out;
}

// Copy src into dst at (dx, dy). Returns how many opaque src pixels fell outside dst.
function blit(dst, src, dx, dy) {
  let lost = 0;
  for (let y = 0; y < src.h; y++) {
    for (let x = 0; x < src.w; x++) {
      const si = (y * src.w + x) * 4;
      if (!src.data[si + 3]) continue;
      const tx = x + dx, ty = y + dy;
      if (tx < 0 || ty < 0 || tx >= dst.w || ty >= dst.h) { lost++; continue; }
      const di = (ty * dst.w + tx) * 4;
      dst.data[di] = src.data[si]; dst.data[di + 1] = src.data[si + 1]; dst.data[di + 2] = src.data[si + 2]; dst.data[di + 3] = src.data[si + 3];
    }
  }
  return lost;
}

function bbox(img, x0 = 0, y0 = 0, x1 = img.w - 1, y1 = img.h - 1) {
  let bx0 = Infinity, by0 = Infinity, bx1 = -1, by1 = -1, n = 0;
  const d = img.data;
  for (let y = Math.max(0, y0); y <= Math.min(img.h - 1, y1); y++) {
    for (let x = Math.max(0, x0); x <= Math.min(img.w - 1, x1); x++) {
      if (!d[(y * img.w + x) * 4 + 3]) continue;
      n++;
      if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y;
    }
  }
  return n ? { x0: bx0, y0: by0, x1: bx1, y1: by1, w: bx1 - bx0 + 1, h: by1 - by0 + 1, n } : null;
}

function trim(img) {
  const b = bbox(img);
  return b ? crop(img, b.x0, b.y0, b.w, b.h) : null;
}

const dist2 = (d, i, c) => (d[i] - c[0]) ** 2 + (d[i + 1] - c[1]) ** 2 + (d[i + 2] - c[2]) ** 2;
const isMagentaish = (c) => c[0] > 170 && c[2] > 170 && c[1] < 100;
// Anti-aliased magenta fringe (magenta blended with the outline/body colors).
const isMagentaHue = (r, g, b) => {
  const mn = Math.min(r, b);
  return mn > 70 && mn - g > 60 && Math.abs(r - b) < 0.35 * Math.max(r, b) + 20;
};

// Remove a flat background: cluster the border colors, flood-fill them from the edges, then
// drop every near-magenta pixel (magenta never appears in characters) and magenta fringe.
// mode 'char' binarizes alpha (hard pixels); mode 'vfx' keeps alpha (quantized later).
// Already-transparent art (a transparent border) keeps every opaque color: a tightly cropped frame
// touches the border with its own outline, which must not be mistaken for a background.
// A non-magenta background (white, black, ...) is off-spec: in 'char' mode it is flooded with half
// the tolerance so the dark outline survives next to a dark background (reported as `foreign`).
function removeBackground(img, { tol = 72, mode = 'char' } = {}) {
  const { w, h, data: d } = img;
  const tol2 = tol * tol;
  const clusters = [];
  let borderN = 0, borderClear = 0;
  const addBorder = (x, y) => {
    const i = (y * w + x) * 4;
    borderN++;
    if (d[i + 3] < 16) { borderClear++; return; }
    const side = (y === 0 ? 1 : 0) | (y === h - 1 ? 2 : 0) | (x === 0 ? 4 : 0) | (x === w - 1 ? 8 : 0);
    let best = null, bd = Infinity;
    for (const c of clusters) {
      const dd = dist2(d, i, [c.r / c.n, c.g / c.n, c.b / c.n]);
      if (dd < bd) { bd = dd; best = c; }
    }
    if (best && bd <= tol2 / 4) { best.r += d[i]; best.g += d[i + 1]; best.b += d[i + 2]; best.n++; best.sides |= side; }
    else if (clusters.length < 24) clusters.push({ r: d[i], g: d[i + 1], b: d[i + 2], n: 1, sides: side });
  };
  for (let x = 0; x < w; x++) { addBorder(x, 0); if (h > 1) addBorder(x, h - 1); }
  for (let y = 1; y < h - 1; y++) { addBorder(0, y); if (w > 1) addBorder(w - 1, y); }
  const mean = (c) => [c.r / c.n, c.g / c.n, c.b / c.n];
  const magN = clusters.filter((c) => isMagentaish(mean(c))).reduce((s, c) => s + c.n, 0);
  // On a magenta strip, another border color is background only if it spans the image (a ground band,
  // a frame) - feet or hair cut by one edge of a tight crop are character, not background.
  const spans = (c) => (c.sides & 3) === 3 || (c.sides & 12) === 12;
  let seeds = clusters.filter((c) => c.n >= borderN * 0.08 && (magN < borderN * 0.5 || isMagentaish(mean(c)) || spans(c))).map(mean);
  if (borderClear >= borderN * 0.25) seeds = seeds.filter(isMagentaish);
  const magentaBg = seeds.some(isMagentaish);
  const foreignSeeds = seeds.filter((c) => !isMagentaish(c));
  const foreign = foreignSeeds.length ? '#' + foreignSeeds[0].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('') : null;
  seeds.push(MAGENTA);
  const seedTol2 = seeds.map((c) => (mode === 'char' && !isMagentaish(c) ? tol2 / 4 : tol2));
  const isBg = (i) => d[i + 3] < 16 || seeds.some((c, k) => dist2(d, i, c) <= seedTol2[k]);

  const N = w * h;
  const seen = new Uint8Array(N);
  const stack = new Int32Array(N);
  let sp = 0;
  const push = (p) => { if (!seen[p]) { seen[p] = 1; stack[sp++] = p; } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  let removed = 0;
  while (sp) {
    const p = stack[--sp];
    const i = p * 4;
    if (!isBg(i)) continue;
    if (d[i + 3]) removed++;
    d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < N - w) push(p + w);
  }
  // enclosed background (between arm and body...): anything still near the magenta seeds
  const mSeeds = [MAGENTA, ...seeds.filter(isMagentaish)];
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    if (d[i + 3] && mSeeds.some((c) => dist2(d, i, c) <= tol2)) { d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0; removed++; }
  }
  // fringe: magenta-hued pixels touching transparency (2 passes)
  if (magentaBg) {
    for (let pass = 0; pass < 2; pass++) {
      const kill = [];
      for (let p = 0; p < N; p++) {
        const i = p * 4;
        if (!d[i + 3] || !isMagentaHue(d[i], d[i + 1], d[i + 2])) continue;
        const x = p % w;
        if ((x > 0 && !d[i - 1]) || (x < w - 1 && !d[i + 7]) || (p >= w && !d[i - w * 4 + 3]) || (p < N - w && !d[i + w * 4 + 3])) kill.push(i);
      }
      for (const i of kill) d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      removed += kill.length;
      if (!kill.length) break;
    }
  }
  if (mode === 'char') {
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      else d[i + 3] = 255;
    }
  } else {
    quantizeAlpha(img);
  }
  return { removed, magentaBg, foreign, seeds: seeds.length - 1 };
}

function quantizeAlpha(img, levels = VFX_ALPHA_LEVELS) {
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    let best = levels[0];
    for (const l of levels) if (Math.abs(l - a) < Math.abs(best - a)) best = l;
    if (a < 40) best = 0;
    if (!best) d[i] = d[i + 1] = d[i + 2] = 0;
    d[i + 3] = best;
  }
}

// 8-connected components of the opaque pixels: label per pixel + { n, x0, y0, x1, y1 } per id (comps[0] unused).
function components(img) {
  const { w, h, data: d } = img;
  const N = w * h;
  const label = new Int32Array(N);
  const stack = new Int32Array(N);
  const comps = [null];
  for (let p0 = 0; p0 < N; p0++) {
    if (label[p0] || !d[p0 * 4 + 3]) continue;
    const id = comps.length;
    const c = { n: 0, x0: w, y0: h, x1: -1, y1: -1 };
    let sp = 0;
    label[p0] = id;
    stack[sp++] = p0;
    while (sp) {
      const p = stack[--sp];
      const x = p % w, y = (p - x) / w;
      c.n++;
      if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x; if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w || (!dx && !dy)) continue;
          const q = yy * w + xx;
          if (!label[q] && d[q * 4 + 3]) { label[q] = id; stack[sp++] = q; }
        }
      }
    }
    comps.push(c);
  }
  return { label, comps };
}

function clearLabels(img, label, kill) {
  const d = img.data;
  for (let p = 0; p < label.length; p++) if (kill[label[p]]) { const i = p * 4; d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0; }
}

// Drop tiny disconnected blobs (noise, stray specks).
function removeSpecks(img, { frac = 0.0015, min = 4 } = {}) {
  const { label, comps } = components(img);
  // a loop, not Math.max(...): a noisy image can have 100k+ blobs (spread would overflow the stack)
  let largest = 0;
  for (let k = 1; k < comps.length; k++) if (comps[k].n > largest) largest = comps[k].n;
  const limit = Math.max(min, largest * frac);
  let removed = 0, blobs = 0;
  const kill = new Uint8Array(comps.length);
  for (let k = 1; k < comps.length; k++) if (comps[k].n < limit) { kill[k] = 1; blobs++; removed += comps[k].n; }
  if (blobs) clearLabels(img, label, kill);
  return { blobs, removed };
}

// Per-frame cleanup of a raw character pose: a small blob far from the body (a stray mark above the
// head) or below the soles would set the trimmed height (= the scale of the whole animation) or the
// floor line. Small blobs close to the body (smears, sweat drops, sparks at the fist) are kept.
function dropStrays(img, { frac = 0.02, far = 0.1 } = {}) {
  const { label, comps } = components(img);
  if (comps.length <= 2) return 0;
  let L = 0;
  for (let k = 1; k < comps.length; k++) if (comps[k].n > L) L = comps[k].n;
  const main = { x0: Infinity, y0: Infinity, x1: -1, y1: -1 };
  for (let k = 1; k < comps.length; k++) {
    const c = comps[k];
    if (c.n < L * 0.1) continue;
    main.x0 = Math.min(main.x0, c.x0); main.y0 = Math.min(main.y0, c.y0); main.x1 = Math.max(main.x1, c.x1); main.y1 = Math.max(main.y1, c.y1);
  }
  const reach = far * (main.y1 - main.y0 + 1);
  const kill = new Uint8Array(comps.length);
  let n = 0;
  for (let k = 1; k < comps.length; k++) {
    const c = comps[k];
    if (c.n >= L * frac) continue;
    const gap = Math.max(0, c.x0 - main.x1, main.x0 - c.x1, c.y0 - main.y1, main.y0 - c.y1);
    if (gap > reach || c.y0 > main.y1) { kill[k] = 1; n++; }
  }
  if (n) clearLabels(img, label, kill);
  return n;
}

// Downscale by taking the most common color of each source block (palette-preserving, no blur).
function downscaleMode(img, w2, h2, { coverage = 0.5, alphaMin = 128 } = {}) {
  const { w, h, data: s } = img;
  const out = newImage(w2, h2);
  const d = out.data;
  const buckets = new Map();
  const exact = new Map();
  for (let y = 0; y < h2; y++) {
    const sy0 = Math.floor((y * h) / h2), sy1 = Math.max(sy0 + 1, Math.floor(((y + 1) * h) / h2));
    for (let x = 0; x < w2; x++) {
      const sx0 = Math.floor((x * w) / w2), sx1 = Math.max(sx0 + 1, Math.floor(((x + 1) * w) / w2));
      buckets.clear();
      let opaque = 0, total = 0, bestKey = -1, bestN = 0;
      for (let yy = sy0; yy < sy1; yy++) {
        for (let xx = sx0; xx < sx1; xx++) {
          const i = (yy * w + xx) * 4;
          total++;
          if (s[i + 3] < alphaMin) continue;
          opaque++;
          const key = ((s[i] >> 3) << 10) | ((s[i + 1] >> 3) << 5) | (s[i + 2] >> 3);
          const n = (buckets.get(key) || 0) + 1;
          buckets.set(key, n);
          if (n > bestN) { bestN = n; bestKey = key; }
        }
      }
      if (!opaque || opaque < total * coverage) continue;
      // exact most common color inside the winning bucket (keeps the source palette exactly)
      exact.clear();
      let bestC = 0, bestCN = 0;
      for (let yy = sy0; yy < sy1; yy++) {
        for (let xx = sx0; xx < sx1; xx++) {
          const i = (yy * w + xx) * 4;
          if (s[i + 3] < alphaMin) continue;
          if ((((s[i] >> 3) << 10) | ((s[i + 1] >> 3) << 5) | (s[i + 2] >> 3)) !== bestKey) continue;
          const c = ((s[i] << 24) | (s[i + 1] << 16) | (s[i + 2] << 8) | s[i + 3]) >>> 0;
          const n = (exact.get(c) || 0) + 1;
          exact.set(c, n);
          if (n > bestCN) { bestCN = n; bestC = c; }
        }
      }
      const o = (y * w2 + x) * 4;
      d[o] = bestC >>> 24; d[o + 1] = (bestC >>> 16) & 255; d[o + 2] = (bestC >>> 8) & 255; d[o + 3] = bestC & 255;
    }
  }
  return out;
}

function upscaleNearest(img, w2, h2) {
  const out = newImage(w2, h2);
  for (let y = 0; y < h2; y++) {
    const sy = Math.min(img.h - 1, Math.floor((y * img.h) / h2));
    for (let x = 0; x < w2; x++) {
      const sx = Math.min(img.w - 1, Math.floor((x * img.w) / w2));
      const si = (sy * img.w + sx) * 4, di = (y * w2 + x) * 4;
      out.data[di] = img.data[si]; out.data[di + 1] = img.data[si + 1]; out.data[di + 2] = img.data[si + 2]; out.data[di + 3] = img.data[si + 3];
    }
  }
  return out;
}

function resample(img, s, opts) {
  if (s === 1) return img;
  const w2 = Math.max(1, Math.round(img.w * s)), h2 = Math.max(1, Math.round(img.h * s));
  return s < 1 ? downscaleMode(img, w2, h2, opts) : upscaleNearest(img, w2, h2);
}

// ChatGPT cannot draw partial transparency on magenta, so `glow` is drawn as opaque grey rings:
// white with alpha = brightness (#FFFFFF 100%, #B4B4B4 ~70%, #5A5A5A ~35%; quantizeAlpha snaps the steps).
// Multiplying by the existing alpha leaves already-converted (white + alpha) art unchanged.
function lumaToAlpha(img) {
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i + 3] = Math.round((d[i + 3] * l) / 255);
    d[i] = d[i + 1] = d[i + 2] = 255;
  }
}

function toGreyscale(img) {
  const d = img.data;
  let colored = 0, opaque = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    opaque++;
    const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]);
    if (mx - mn > 40) colored++;
    const l = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    d[i] = d[i + 1] = d[i + 2] = l;
  }
  return opaque ? colored / opaque : 0;
}

// ============================================================== strip splitting
// Runs of non-zero entries in occ, bridging zero-gaps shorter than minGap. Returns [[start, end)].
function runs(occ, minGap) {
  const out = [];
  let start = -1, lastOn = -1;
  for (let i = 0; i < occ.length; i++) {
    if (!occ[i]) continue;
    if (start < 0) start = i;
    else if (i - lastOn - 1 >= minGap) { out.push([start, lastOn + 1]); start = i; }
    lastOn = i;
  }
  if (start >= 0) out.push([start, lastOn + 1]);
  return out;
}

const median = (arr) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Split [a, b) into k parts, cutting at the emptiest column near each even cut.
function smartCuts(colOcc, a, b, k) {
  const parts = [];
  let prev = a;
  const step = (b - a) / k;
  for (let j = 1; j < k; j++) {
    const target = Math.round(a + j * step);
    const win = Math.max(1, Math.round(step * 0.2));
    let best = target, bestV = Infinity;
    for (let x = Math.max(prev + 1, target - win); x <= Math.min(b - 1, target + win); x++) {
      const v = colOcc[x];
      if (v < bestV || (v === bestV && Math.abs(x - target) < Math.abs(best - target))) { bestV = v; best = x; }
    }
    parts.push([prev, best]);
    prev = best;
  }
  parts.push([prev, b]);
  return parts.filter(([s, e]) => e > s);
}

const peakOf = (colOcc, a, b) => { let m = 0; for (let x = a; x < b; x++) if (colOcc[x] > m) m = colOcc[x]; return m; };

// Does [s, e) hold two bodies, i.e. a deep column valley between two tall peaks?
function twoBodies(colOcc, s, e, tall) {
  const n = e - s;
  if (n < 3) return false;
  const suf = new Int32Array(n);
  for (let i = n - 1; i >= 0; i--) suf[i] = Math.max(i < n - 1 ? suf[i + 1] : 0, colOcc[s + i]);
  let pre = colOcc[s];
  for (let i = 1; i < n - 1; i++) {
    const v = colOcc[s + i];
    if (pre >= tall && suf[i + 1] >= tall && v <= 0.5 * Math.min(pre, suf[i + 1])) return true;
    if (v > pre) pre = v;
  }
  return false;
}

// Strip-splitting thresholds. Characters: every pose is a body-sized piece, so small pieces are props
// to fold in and two bodies are never merged into one frame (`bodies`). VFX: frames grow (a first spark
// is a fraction of the last one) and are often made of separate pieces (rays), and a ring's hollow
// middle looks like a gap between two bodies, so a "body" may be smaller but a valley must be nearly empty.
const SPLIT = {
  char: { tall: 0.45, valley: 0.35, minW: 0.12, bodies: true },
  vfx: { tall: 0.2, valley: 0.15, minW: 0.05, bodies: false },
};

// Split a run of touching poses at the deep column valleys between bodies. A body is a column at least
// P.tall x as tall as the run's tallest; a valley is <= P.valley x the smaller of the tallest columns on
// each side. Valleys, not even slices: touching poses (or growing VFX frames) differ in width, and a
// single pose (a big 1-pose image, a punch with a long arm) has no such valley, so it is never sliced
// into slivers. Returns the slices (>= 2) or null.
function sliceRun(colOcc, a, b, bandH, P) {
  const n = b - a;
  if (n < 3) return null;
  const tall = P.tall * peakOf(colOcc, a, b), valley = P.valley;
  const L = new Int32Array(n), R = new Int32Array(n);
  for (let i = 0; i < n; i++) L[i] = Math.max(i ? L[i - 1] : 0, colOcc[a + i]);
  for (let i = n - 1; i >= 0; i--) R[i] = Math.max(i < n - 1 ? R[i + 1] : 0, colOcc[a + i]);
  const deep = (i) => L[i - 1] >= tall && R[i + 1] >= tall && colOcc[a + i] <= valley * Math.min(L[i - 1], R[i + 1]);
  const cuts = [];
  for (let i = 1; i < n - 1; i++) {
    if (!deep(i)) continue;
    let best = i;
    for (; i < n - 1 && deep(i); i++) if (colOcc[a + i] < colOcc[a + best]) best = i;
    const x = a + best;
    // two valleys with no body between them (forearm, then the gap after the fist) are one valley: keep the deeper
    const prev = cuts[cuts.length - 1];
    if (prev !== undefined && peakOf(colOcc, prev, x) < tall) { if (colOcc[x] <= colOcc[prev]) cuts[cuts.length - 1] = x; }
    else cuts.push(x);
  }
  if (!cuts.length) return null;
  const edges = [a, ...cuts, b];
  const parts = edges.slice(1).map((e, q) => [edges[q], e]);
  const minW = Math.max(3, bandH * P.minW);
  return parts.every(([s, e]) => e - s >= minW && peakOf(colOcc, s, e) >= tall) ? parts : null;
}

// Runs that are clearly not a pose (small area AND short) are merged into the nearest run when close,
// dropped when far: a detached prop or speed line must not become a frame of its own.
function absorbFragments(cols, colOcc, notes) {
  for (let guard = 0; cols.length > 1 && guard < 200; guard++) {
    const st = cols.map(([a, b]) => { let n = 0; for (let x = a; x < b; x++) n += colOcc[x]; return { n, pk: peakOf(colOcc, a, b), w: b - a }; });
    const maxN = Math.max(...st.map((s) => s.n)), maxP = Math.max(...st.map((s) => s.pk));
    const frag = st.map((s) => s.n < maxN * 0.2 && s.pk < maxP * 0.5);
    const k = frag.indexOf(true);
    if (k < 0) break;
    const medW = median(st.filter((_, q) => !frag[q]).map((s) => s.w));
    const gapL = k > 0 ? cols[k][0] - cols[k - 1][1] : Infinity;
    const gapR = k < cols.length - 1 ? cols[k + 1][0] - cols[k][1] : Infinity;
    if (Math.min(gapL, gapR) <= medW) {
      const lo = Math.min(k, gapL <= gapR ? k - 1 : k + 1);
      cols.splice(lo, 2, [cols[lo][0], cols[lo + 1][1]]);
    } else {
      notes.push(`dropped a detached piece at x=${cols[k][0]}`);
      cols.splice(k, 1);
    }
  }
  return cols;
}

// Returns { rects: [{x0,x1,y0,y1}], notes: [] } in reading order. expected <= 0 means "auto".
function splitStrip(img, expected, { split = 'auto', mode = 'char' } = {}) {
  const P = SPLIT[mode] || SPLIT.char;
  const { w, h, data: d } = img;
  const notes = [];
  const rowOcc = new Int32Array(h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3]) rowOcc[y]++;
  let bands = runs(rowOcc, Math.max(2, Math.round(h * 0.01)));
  if (!bands.length) return { rects: [], notes };

  // merge thin bands (detached bits) into their nearest neighbour
  for (let guard = 0; bands.length > 1 && guard < 100; guard++) {
    const maxH = Math.max(...bands.map(([a, b]) => b - a));
    const k = bands.findIndex(([a, b]) => b - a < maxH * 0.3);
    if (k < 0) break;
    const gapL = k > 0 ? bands[k][0] - bands[k - 1][1] : Infinity;
    const gapR = k < bands.length - 1 ? bands[k + 1][0] - bands[k][1] : Infinity;
    const j = gapL <= gapR ? k - 1 : k + 1;
    const lo = Math.min(k, j);
    bands.splice(lo, 2, [bands[lo][0], bands[lo + 1][1]]);
  }

  const colOccOf = (y0, y1) => {
    const occ = new Int32Array(w);
    for (let y = y0; y < y1; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3]) occ[x]++;
    return occ;
  };

  // multi-row grid only if the bands span overlapping x ranges (a jump arc drawn in one row does not)
  if (bands.length > 1) {
    const ext = bands.map(([y0, y1]) => {
      const r = runs(colOccOf(y0, y1), 1);
      return [r[0][0], r[r.length - 1][1]];
    });
    let grid = true;
    for (let k = 1; k < ext.length; k++) {
      const ov = Math.min(ext[k][1], ext[k - 1][1]) - Math.max(ext[k][0], ext[k - 1][0]);
      const mn = Math.min(ext[k][1] - ext[k][0], ext[k - 1][1] - ext[k - 1][0]);
      if (ov < mn * 0.5) grid = false;
    }
    if (grid) notes.push(`grid of ${bands.length} rows detected`);
    else bands = [[bands[0][0], bands[bands.length - 1][1]]];
  }

  const rects = [];
  for (const [y0, y1] of bands) {
    const colOcc = colOccOf(y0, y1);
    let cols;
    if (split === 'even' && expected > 0 && bands.length === 1) {
      cols = smartCuts(colOcc, 0, w, expected);
    } else {
      cols = runs(colOcc, Math.max(2, Math.round((y1 - y0) * 0.01)));
      // tiny runs: merge into the closer neighbour, or drop if far away
      for (let guard = 0; cols.length > 1 && guard < 200; guard++) {
        const maxW = Math.max(...cols.map(([a, b]) => b - a));
        const medW = median(cols.map(([a, b]) => b - a));
        const k = cols.findIndex(([a, b]) => b - a < maxW * 0.12);
        if (k < 0) break;
        const gapL = k > 0 ? cols[k][0] - cols[k - 1][1] : Infinity;
        const gapR = k < cols.length - 1 ? cols[k + 1][0] - cols[k][1] : Infinity;
        if (Math.min(gapL, gapR) < medW * 0.5) {
          const j = gapL <= gapR ? k - 1 : k + 1;
          const lo = Math.min(k, j);
          cols.splice(lo, 2, [cols[lo][0], cols[lo + 1][1]]);
        } else {
          notes.push(`dropped a small detached blob at x=${cols[k][0]}`);
          cols.splice(k, 1);
        }
      }
      if (bands.length === 1 && expected > 0) {
        // too many pieces: first fold in detached props/smears, then merge the clearly-smaller gaps,
        // but never two bodies into one frame (punch poses sit closer together than idle poses)
        if (cols.length > expected && P.bodies) absorbFragments(cols, colOcc, notes);
        const tall = P.tall * peakOf(colOcc, 0, w);
        while (cols.length > expected) {
          const gaps = cols.slice(1).map((c, k) => c[0] - cols[k][1]);
          const mg = median(gaps);
          let k = 0;
          for (let q = 1; q < gaps.length; q++) if (gaps[q] < gaps[k]) k = q;
          if (!(gaps[k] < mg * 0.5) || (P.bodies && twoBodies(colOcc, cols[k][0], cols[k + 1][1], tall))) break;
          cols.splice(k, 2, [cols[k][0], cols[k + 1][1]]);
        }
        // too few: poses touch each other -> cut the (wide) runs at the valleys between bodies (sliceRun)
        if (cols.length < expected) {
          if (cols.length === 1) {
            const parts = sliceRun(colOcc, cols[0][0], cols[0][1], y1 - y0, P);
            if (parts) {
              cols = parts;
              notes.push(`poses touch: split into ${parts.length}`);
            } else notes.push(`found 1 pose, expected ${expected} - not sliced (leave a gap between poses, or add raw/<anim>.json { "split": "even" })`);
          } else {
            const refW = median(cols.map(([a, b]) => b - a));
            const out = [];
            let groups = 0, whole = 0;
            for (const [a, b] of cols) {
              if (b - a >= refW * 1.6) {
                const parts = sliceRun(colOcc, a, b, y1 - y0, P);
                if (parts) { out.push(...parts); groups++; continue; }
                whole++;
              }
              out.push([a, b]);
            }
            if (groups) notes.push(`split ${groups} touching pose group(s)`);
            if (whole) notes.push(`kept ${whole} wide pose(s) whole (a long limb, not touching poses)`);
            cols = out;
          }
        }
      }
    }
    for (const [x0, x1] of cols) rects.push({ x0, x1, y0, y1 });
  }
  return { rects, notes };
}

// ============================================================== guide + manifest
async function loadGuide(file) {
  try {
    const mod = await import(pathToFileURL(file).href);
    if (mod && mod.ANIM_GUIDE && typeof mod.ANIM_GUIDE === 'object') return { guide: normalizeGuide(mod.ANIM_GUIDE), source: 'animGuide.js' };
  } catch { /* fall through to text parsing */ }
  try {
    const text = fs.readFileSync(file, 'utf8');
    const block = text.slice(text.indexOf('ANIM_GUIDE'));
    const g = {};
    const re = /^\s*([A-Za-z]\w*)\s*:\s*\{([^}]*)\}/gm;
    let m;
    while ((m = re.exec(block))) {
      const body = m[2];
      const frames = /frames\s*:\s*(\d+)/.exec(body);
      if (!frames) continue;
      const phases = /phases\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]/.exec(body);
      g[m[1]] = { frames: +frames[1], loop: /loop\s*:\s*true/.test(body) };
      if (phases) g[m[1]].phases = [+phases[1], +phases[2], +phases[3]];
    }
    if (Object.keys(g).length >= 10) return { guide: g, source: 'animGuide.js (parsed)' };
  } catch { /* fall through */ }
  return { guide: normalizeGuide(FALLBACK_GUIDE), source: 'built-in fallback' };
}

function normalizeGuide(g) {
  const out = {};
  for (const [name, a] of Object.entries(g)) {
    if (!a || typeof a !== 'object') continue;
    out[name] = { frames: a.frames | 0 || 1, loop: !!a.loop };
    if (Array.isArray(a.phases) && a.phases.length === 3) out[name].phases = a.phases.map((v) => v | 0);
    if (a.durations) out[name].durations = a.durations;
    if (a.ms) out[name].ms = a.ms;
  }
  return out;
}

// Accepts objects keyed by name or arrays of { id|name, ... }.
function entries(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x.filter((v) => v && typeof v === 'object').map((v) => [String(v.id ?? v.name ?? v.anim ?? v.effect ?? ''), v]).filter(([k]) => k);
  if (typeof x === 'object') return Object.entries(x).filter(([k, v]) => !k.startsWith('_') && v && typeof v === 'object');
  return [];
}

function normalizeAnimEntry(v) {
  const o = {};
  if (typeof v.frames === 'number') o.frames = v.frames;
  else if (Array.isArray(v.frames)) o.frames = v.frames.length;
  else if (typeof v.frameCount === 'number') o.frames = v.frameCount;
  if (Array.isArray(v.phases) && v.phases.length === 3) o.phases = v.phases.map((n) => n | 0);
  const bh = v.bodyHeight ?? v.body_height ?? v.height;
  if (typeof bh === 'number' && bh > 0) o.bodyHeight = bh;
  if (typeof v.required === 'boolean') o.required = v.required;
  if (typeof v.core === 'boolean') o.required = o.required || v.core;
  if (typeof v.loop === 'boolean') o.loop = v.loop;
  if (Array.isArray(v.durations)) o.durations = v.durations;
  else if (Array.isArray(v.ms)) o.durations = v.ms;
  else if (typeof v.ms === 'number') o.ms = v.ms;
  if (typeof v.hitbox === 'boolean') o.hitbox = v.hitbox;
  if (typeof v.status === 'string') o.status = v.status;
  if (Number.isInteger(v.approvedVersion) && v.approvedVersion > 0) o.approvedVersion = v.approvedVersion;
  return o;
}

// The manifest "spec" block -> the spec the packer follows. Missing keys take the spec v2 default silently;
// malformed ones are reported (issues) and take the default. Informational keys (adr, rawBackground) are not used.
function resolveSpec(raw, issues) {
  const s = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const D = SPEC_DEFAULTS;
  // a spec block without a name is not necessarily v2: do not label it as such in the report
  const out = { ...D, pivot: [...D.pivot], name: s === raw ? 'unnamed manifest spec' : D.name };
  const int = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
  const take = (k, ok, want) => {
    if (s[k] === undefined) return;
    if (ok(s[k])) out[k] = s[k];
    else issues.push(`spec.${k} is ${JSON.stringify(s[k])} - must be ${want}; using ${JSON.stringify(out[k])}`);
  };
  take('name', (v) => typeof v === 'string' && v.trim() !== '', 'a non-empty string');
  take('frameWidth', (v) => int(v, 16, 2048), 'an integer 16-2048');
  take('frameHeight', (v) => int(v, 16, 2048), 'an integer 16-2048');
  take('columns', (v) => int(v, 1, 64), 'an integer 1-64');
  // checked against the frame size actually in use (a default pivot may not fit a non-default cell)
  const pivotOk = (v) => Array.isArray(v) && v.length === 2 && int(v[0], 0, out.frameWidth - 1) && int(v[1], 0, out.frameHeight - 1);
  take('pivot', pivotOk, `[x, y] integers inside the ${out.frameWidth}x${out.frameHeight} cell`);
  if (!pivotOk(out.pivot)) {
    const fixed = [Math.floor(out.frameWidth / 2), out.frameHeight - 1 - Math.round(out.frameHeight / 16)];
    issues.push(`spec.pivot ${JSON.stringify(out.pivot)} does not fit the ${out.frameWidth}x${out.frameHeight} cell - using ${JSON.stringify(fixed)}`);
    out.pivot = fixed;
  }
  take('pixelsPerUnit', (v) => typeof v === 'number' && Number.isFinite(v) && v > 0, 'a positive number');
  take('facing', (v) => v === 'right' || v === 'left', '"right" or "left"');
  take('maxColors', (v) => int(v, 2, 256), 'an integer 2-256');
  take('warnColors', (v) => int(v, 2, 1 << 24), 'an integer >= 2');
  take('cellMargin', (v) => int(v, 0, Math.floor(Math.min(out.frameWidth, out.frameHeight) / 4)), `an integer 0-${Math.floor(Math.min(out.frameWidth, out.frameHeight) / 4)}`);
  take('standingBodyPx', (v) => typeof v === 'number' && v >= 8 && v <= out.frameHeight, `a number 8-${out.frameHeight}`);
  if (s.versionSuffix !== undefined && s.versionSuffix !== VERSION_SUFFIX) issues.push(`spec.versionSuffix is ${JSON.stringify(s.versionSuffix)} - the packer only reads ${VERSION_SUFFIX} file names`);
  return out;
}

function normalizeManifest(raw) {
  const m = { characters: {}, vfx: {}, defaults: {}, core: [], specIssues: [], spec: null };
  m.spec = resolveSpec(raw && typeof raw === 'object' ? raw.spec : null, m.specIssues);
  if (!raw || typeof raw !== 'object') return m;
  const defAnims = raw.animationDefaults ?? raw.animations ?? raw.defaults?.animations ?? raw.spec?.animations;
  for (const [name, v] of entries(defAnims)) m.defaults[name] = normalizeAnimEntry(v);
  if (Array.isArray(raw.coreAnimations)) m.core = raw.coreAnimations.filter((n) => typeof n === 'string');
  for (const [id, c] of entries(raw.characters)) {
    const anims = {};
    for (const [name, v] of entries(c.animations ?? c.anims)) anims[name] = normalizeAnimEntry(v);
    // standingBodyPx: a genuinely taller/shorter fighter (ADR 0010) scales the hitbox heuristics with its body
    const sb = Number(c.standingBodyPx);
    m.characters[id] = { name: c.name, animations: anims, standingBodyPx: sb >= 8 && sb <= m.spec.frameHeight ? sb : null };
  }
  const vfx = raw.vfx?.effects ?? raw.vfx ?? raw.effects;
  for (const [name, v] of entries(vfx)) {
    const e = {};
    const n = typeof v.frames === 'number' ? v.frames : Array.isArray(v.frames) ? v.frames.length : typeof v.n === 'number' ? v.n : undefined;
    if (n) e.frames = n;
    if (typeof v.ms === 'number') e.ms = v.ms;
    if (typeof v.tinted === 'boolean') e.tinted = v.tinted;
    else if (typeof v.tint === 'boolean') e.tinted = v.tint;
    else if (typeof v.colorRule === 'string') e.tinted = /tint|white/i.test(v.colorRule);
    else if (typeof v.color === 'string') e.tinted = /white|tint/i.test(v.color);
    if (typeof v.fill === 'number') e.fill = v.fill;
    for (const k of ['lumaAlpha', 'baseX']) if (typeof v[k] === 'boolean') e[k] = v[k];
    if (v.anchor === 'bottom' || v.bottomAnchored === true) e.anchor = 'bottom';
    else if (v.anchor === 'center') e.anchor = 'center';
    if (Number.isInteger(v.approvedVersion) && v.approvedVersion > 0) e.approvedVersion = v.approvedVersion;
    m.vfx[name] = e;
  }
  // the VFX cell is still a packer constant (the effects' fill sizes are tuned to it): flag drift
  const v = raw.vfx;
  if (v && typeof v === 'object') {
    for (const [k, want] of [['cell', VFX.cell], ['ppu', VFX.ppu], ['baseline', VFX.baseline]]) if (v[k] !== undefined && v[k] !== want) m.specIssues.push(`vfx.${k} is ${v[k]}, packer uses ${want}`);
  }
  return m;
}

// Ordered animation definitions for one character: guide order, then manifest-only extras.
function animDefsFor(id, env) {
  const mc = env.manifest.characters[id]?.animations || {};
  const names = [...Object.keys(env.guide)];
  for (const n of [...Object.keys(env.manifest.defaults), ...Object.keys(mc)]) if (!names.includes(n)) names.push(n);
  return names.map((name) => {
    const g = env.guide[name] || {};
    const d = env.manifest.defaults[name] || {};
    const c = mc[name] || {};
    const pick = (k) => c[k] ?? d[k] ?? g[k];
    return {
      name,
      frames: pick('frames') || 1,
      phases: pick('phases') || null,
      loop: !!pick('loop'),
      bodyHeight: c.bodyHeight ?? d.bodyHeight ?? BODY_HEIGHT[name] ?? DEFAULT_BODY_HEIGHT,
      required: CORE.includes(name) || env.manifest.core.includes(name) || c.required === true || (c.required === undefined && d.required === true),
      durations: c.durations ?? (c.ms != null ? c.ms : undefined) ?? d.durations ?? (d.ms != null ? d.ms : undefined) ?? g.durations ?? g.ms ?? DEFAULT_MS[name] ?? 100,
      hitbox: (c.hitbox ?? d.hitbox ?? !NO_HITBOX.has(name)) !== false,
      approvedVersion: c.approvedVersion ?? null,
    };
  });
}

function resolveDurations(spec, n) {
  let arr = typeof spec === 'number' ? Array(n).fill(spec) : Array.isArray(spec) ? spec.map(Number).filter(Number.isFinite) : [];
  if (!arr.length) arr = Array(n).fill(100);
  if (arr.length !== n) {
    const total = arr.reduce((p, c) => p + c, 0);
    arr = Array(n).fill(total / n);
  }
  return arr.map((v) => Math.max(16, Math.round(v)));
}

function rescalePhases(ph, n) {
  if (!ph) return null;
  const T = ph[0] + ph[1] + ph[2];
  if (T === n) return ph.slice();
  if (n <= 1) return [0, 1, 0];
  if (n === 2) return [1, 1, 0];
  const s0 = Math.min(n - 1, Math.max(1, Math.round((n * ph[0]) / T)));
  const s1 = Math.max(1, Math.min(n - s0, Math.round((n * ph[1]) / T)));
  return [s0, s1, Math.max(0, n - s0 - s1)];
}

// ============================================================== frame sources
const SINGLE_RE = /^(.+?)_(\d+)\.png$/i;
// Versioned candidates (ADR 0007): <anim>_vNN.png and their optional sidecar <anim>_vNN.json. Highest NN = latest.
const VERSION_RE = /^(.+?)_v(\d+)\.png$/i;
const VERSION_JSON_RE = /^(.+?)_v(\d+)\.json$/i;
// One half of a strip that was generated in parts (it belongs in raw/_parts/, joined into <anim>_vNN.png).
const PART_RE = /^(.+?)_v\d+_[a-z]\.png$/i;

// Index raw/ files by animation name (case-insensitive). Unrecognized files become warnings.
// Skipped silently: ui_* (UI raws such as ui_portrait_v02.png; the fitted UI lives in ui/), fx_* (effect art
// left in a character's raw/), <anim>_fixNN.png (fix-up attempts) and every subfolder: raw/_rejected/,
// raw/_parts/, raw/_old/, raw/_proposed/ ... are never read (listFiles does not descend).
function scanRaw(rawDir, knownNames, warn, label) {
  const byLower = new Map(knownNames.map((n) => [n.toLowerCase(), n]));
  const idx = new Map();
  const get = (n) => {
    if (!idx.has(n)) idx.set(n, { strip: null, versions: [], singles: [], sidecar: null, versionSidecars: new Map() });
    return idx.get(n);
  };
  for (const f of listFiles(rawDir).sort(natural)) {
    if (f.startsWith('.') || /^readme/i.test(f)) continue;
    if (/^(ui|fx)_/i.test(f) || /_fix\d+\.png$/i.test(f)) continue;
    if (/\.(jpe?g|webp|gif|bmp|avif)$/i.test(f)) { warn(`${label}/${f}: not a PNG - save it as .png`); continue; }
    if (/\.json$/i.test(f)) {
      const vm = VERSION_JSON_RE.exec(f);
      const vname = vm && byLower.get(vm[1].toLowerCase());
      if (vname) { get(vname).versionSidecars.set(Number(vm[2]), path.join(rawDir, f)); continue; }
      const name = byLower.get(f.slice(0, -5).toLowerCase());
      if (name) get(name).sidecar = path.join(rawDir, f);
      continue;
    }
    if (!/\.png$/i.test(f)) continue;
    const base = f.slice(0, -4);
    let name = byLower.get(base.toLowerCase());
    if (name) {
      if (name !== base) warn(`${label}/${f}: rename to ${name}.png (case)`);
      get(name).strip = path.join(rawDir, f);
      continue;
    }
    const vm = VERSION_RE.exec(f);
    name = vm && byLower.get(vm[1].toLowerCase());
    if (name) {
      const n = Number(vm[2]);
      const want = `${name}_v${String(n).padStart(2, '0')}.png`;
      if (vm[1] !== name) warn(`${label}/${f}: rename to ${want} (case)`);
      else if (vm[2].length < 2) warn(`${label}/${f}: use a two-digit version - rename to ${want}`);
      const e = get(name);
      const dup = e.versions.find((v) => v.n === n);
      if (dup) warn(`${label}/${f}: version ${n} already exists as ${path.basename(dup.file)} - ignored (versions are never reused; give it the next free number)`);
      else e.versions.push({ n, file: path.join(rawDir, f) });
      continue;
    }
    const m = SINGLE_RE.exec(f);
    name = m && byLower.get(m[1].toLowerCase());
    if (name) { get(name).singles.push(path.join(rawDir, f)); continue; }
    const pm = PART_RE.exec(f);
    if (pm && byLower.has(pm[1].toLowerCase())) { warn(`${label}/${f}: strip part - move it to raw/_parts/ (the packer reads only the joined <anim>_vNN.png)`); continue; }
    warn(`${label}/${f}: unrecognized name - use <anim>_vNN.png (versioned strip), <anim>.png (strip) or <anim>_NN.png (single frame)`);
  }
  return idx;
}

// The raw source of one animation, in order: the highest raw/<anim>_vNN.png (or version `want` when it exists, e.g.
// the approved one), else raw/<anim>.png, else the raw/<anim>_NN.png singles. Sidecars: raw/<anim>.json applies to
// every source of the animation; a versioned strip's own raw/<anim>_vNN.json is merged on top (its keys win).
function pickRaw(entry, name, want = null) {
  if (!entry) return null;
  const sidecars = entry.sidecar ? [entry.sidecar] : [];
  if (entry.versions.length) {
    const top = entry.versions.find((v) => v.n === want) || entry.versions.reduce((a, b) => (b.n > a.n ? b : a));
    const own = entry.versionSidecars.get(top.n);
    const ignored = [];
    if (entry.strip) ignored.push(`raw/${path.basename(entry.strip)}`);
    if (entry.singles.length) ignored.push(`${entry.singles.length} raw/${name}_NN.png single(s)`);
    return { files: [top.file], strip: true, version: top.n, label: `raw/${path.basename(top.file)}`, sidecars: own ? [...sidecars, own] : sidecars, ignored };
  }
  if (entry.strip) return { files: [entry.strip], strip: true, version: null, label: `raw/${path.basename(entry.strip)}`, sidecars, ignored: [], conflict: entry.singles.length };
  if (entry.singles.length) {
    const label = entry.singles.length === 1 ? `raw/${path.basename(entry.singles[0])}` : `raw/${name}_NN.png x${entry.singles.length}`;
    return { files: entry.singles, strip: false, version: null, label, sidecars, ignored: [] };
  }
  return null; // only a sidecar
}

function hashFiles(files) {
  const h = crypto.createHash('sha1');
  for (const f of files) { h.update(path.basename(f)); h.update(fs.readFileSync(f)); }
  return h.digest('hex');
}

// Which raw file packer-written frames were cleaned from (markers before packer v2 only list the source paths).
function markerOrigin(marker) {
  const src = Array.isArray(marker.source) ? marker.source.filter((s) => typeof s === 'string' && /\.png$/i.test(s)) : [];
  const file = typeof marker.sourceFile === 'string' ? marker.sourceFile : src.length === 1 ? `raw/${path.basename(src[0])}` : src.length ? `raw/ (${src.length} files)` : null;
  return { file, version: Number.isInteger(marker.version) ? marker.version : null };
}

// Decide where an animation's frames come from: frames/<anim>/ (cleaned frames) or raw/ (pickRaw).
// Packer-written frames carry a marker (.packer.json: source file name + hash, bodyHeight, cell). When the source
// changed (a newer _vNN, an edited raw or sidecar, another bodyHeight or cell size) and nobody edited the frames,
// they are re-imported; hand-edited frames always win (warned). Frames without a marker are hand-made: they win.
// Untouched packer-made frames whose raw source is gone (its only version moved to raw/_rejected/) are 'stale':
// packing them would ship rejected art, so the animation counts as missing.
// ctx: { bodyHeight, cell, artDir } - what the frames must have been written for.
function chooseSource(framesDir, raw, ctx, warn, label) {
  if (raw?.conflict) warn(`${label}: raw strip and ${raw.conflict} single frame(s) both exist - using the strip`);
  // the sidecars are part of the source: editing one re-imports too
  const fromRaw = raw && { kind: 'raw', rawFiles: raw.files, hashInputs: [...raw.files, ...raw.sidecars], version: raw.version, label: raw.label, strip: raw.strip };
  const framePngs = listPngs(framesDir);
  if (!framePngs.length) return fromRaw;
  const marker = readJson(path.join(framesDir, MARKER)).data;
  if (!marker) return { kind: 'frames', framePngs, packerMade: false, origin: null };
  const origin = markerOrigin(marker);
  const files = marker.files || {};
  const isEdited = () => framePngs.length !== Object.keys(files).length ||
    framePngs.some((f) => files[f] !== sha1(fs.readFileSync(path.join(framesDir, f))));
  if (!raw) {
    const srcPngs = Array.isArray(marker.source) ? marker.source.filter((s) => typeof s === 'string' && /\.png$/i.test(s)) : [];
    const gone = srcPngs.length > 0 && srcPngs.some((s) => !isFile(path.join(ctx.artDir, s)));
    const edited = isEdited();
    if (gone && !edited) return { kind: 'stale', origin };
    return { kind: 'frames', framePngs, packerMade: true, edited, origin };
  }
  const cellOf = (c) => JSON.stringify(c ?? null);
  const why = [];
  if (hashFiles(fromRaw.hashInputs) !== marker.sourceHash) {
    why.push(origin.file && origin.file !== raw.label ? `newer source ${raw.label} (frames/ came from ${origin.file})` : `${raw.label} or its sidecar changed`);
  }
  if ((marker.bodyHeight ?? null) !== (ctx.bodyHeight ?? null)) why.push(`bodyHeight changed (${marker.bodyHeight ?? 'none'} -> ${ctx.bodyHeight})`);
  if (cellOf(marker.cell) !== cellOf(ctx.cell)) why.push('the spec cell changed');
  if (!why.length) return { kind: 'frames', framePngs, packerMade: true, origin };
  const edited = isEdited();
  if (!edited) return { ...fromRaw, replaced: origin.file && origin.file !== raw.label ? origin.file : null };
  warn(`${label}: ${why.join(', ')} but frames/${path.basename(framesDir)}/ has manual edits - using frames/ (delete that folder to re-import from raw/)`);
  return { kind: 'frames', framePngs, packerMade: true, edited: true, origin };
}

const staleText = (label, dir, src) => `${label}: frames/${dir}/ were cleaned from ${src.origin.file || 'a raw file'}, which is no longer in raw/ (rejected?) - not packed. Delete frames/${dir}/ or add a new raw version`;

// Merged sidecar keys (later files win). A broken file is warned and skipped.
function readSidecars(files, warn, label) {
  const out = {};
  for (const file of files || []) {
    const r = readJson(file);
    if (r.error) { warn(`${label}: ${path.basename(file)} is not valid JSON (${r.error}) - ignored`); continue; }
    if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) Object.assign(out, r.data);
  }
  return out;
}

// Load + clean raw images into trimmed frame images (source resolution). strip: one image holding every pose
// (split it) rather than one image per frame.
function framesFromRaw(rawFiles, expected, side, env, mode, warn, label, strip) {
  const notes = [];
  const out = [];
  const sideTol = Number(side.tolerance ?? side.tol);
  const tol = sideTol > 0 ? sideTol : env.tol;
  const speck = mode === 'vfx' ? { frac: 0.0002, min: 3 } : { frac: 0.0015, min: 4 };
  let unreadable = 0, strays = 0;
  const foreign = new Set();
  for (const f of rawFiles) {
    let img;
    try { img = readPng(f); } catch (e) { warn(`${label}: cannot read ${path.basename(f)} (${e.message})`); unreadable++; continue; }
    const bg = removeBackground(img, { tol, mode });
    if (!bg.magentaBg && bg.removed === 0 && !hasTransparency(img)) warn(`${label}: ${path.basename(f)} has no removable background (use flat magenta #FF00FF)`);
    else if (mode === 'char' && bg.foreign && bg.removed) foreign.add(bg.foreign);
    const sp = removeSpecks(img, speck);
    if (sp.blobs > 3) notes.push(`removed ${sp.blobs} specks`);
    if (strip) {
      const want = Number(side.frames) > 0 ? Number(side.frames) : expected;
      const { rects, notes: n2 } = splitStrip(img, want, { split: side.split === 'even' ? 'even' : 'auto', mode });
      notes.push(...n2);
      for (const r of rects) {
        const piece = crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
        if (mode === 'char') strays += dropStrays(piece);
        const b = bbox(piece);
        if (!b) continue;
        const t = crop(piece, b.x0, b.y0, b.w, b.h);
        // where the frame sat in the strip (VFX keep their offset inside the strip row, see vfxAnchors)
        if (mode === 'vfx') t.at = { row: `${r.y0}:${r.y1}`, slotCx: (r.x0 + r.x1) / 2, left: r.x0 + b.x0, top: r.y0 + b.y0, bottom: r.y0 + b.y1 };
        out.push(t);
      }
    } else {
      if (mode === 'char') strays += dropStrays(img);
      const b = bbox(img);
      if (b) {
        const t = crop(img, b.x0, b.y0, b.w, b.h);
        if (mode === 'vfx') t.at = { row: 'single', canvas: `${img.w}x${img.h}`, left: b.x0, right: b.x1, top: b.y0, bottom: b.y1 };
        out.push(t);
      } else warn(`${label}: ${path.basename(f)} is empty after background removal`);
    }
  }
  if (strays) notes.push(`dropped ${strays} stray mark(s) far from the body`);
  if (foreign.size) warn(`${label}: background ${[...foreign].join('/')} is not magenta #FF00FF - removed with half tolerance; gaps enclosed by the body (between arm and torso) stay filled. Regenerate on magenta`);
  let frames = out;
  if (Array.isArray(side.drop) && side.drop.length) {
    const drop = new Set(side.drop.map(Number).filter((k) => Number.isInteger(k) && k >= 0 && k < frames.length));
    const bad = side.drop.filter((k) => !drop.has(Number(k)));
    if (bad.length) warn(`${label}: sidecar "drop" ${JSON.stringify(bad)} ignored - frame indices are 0-${frames.length - 1}`);
    if (drop.size) {
      frames = frames.filter((_, k) => !drop.has(k));
      notes.push(`dropped frame(s) ${[...drop].join(',')} (sidecar)`);
    }
  }
  if (mode === 'vfx') vfxAnchors(frames, notes);
  return { frames, notes, unreadable: unreadable === rawFiles.length };
}

// Effects grow, shrink, rise and lean on purpose, so a VFX frame must not be re-centered on its own
// bbox (a spark flare that disappears would make the crescent jump, a rising puff would not rise).
// Sets frame.anchor = { cx, cy, gap } in source px, relative to the trimmed frame's top-left:
//  - strip: cy = center of the union of the row's frames (all frames share the row's center line),
//    gap = how far the frame's lowest pixel sits above the row's lowest pixel (bottom effects),
//    cx = center of the frame's split slot (its own columns, or an even slot with { "split": "even" });
//  - single files of one canvas size: the union of all frames on that shared canvas, in x and y.
// Single files of different sizes have no common reference: they stay centered per frame.
function vfxAnchors(frames, notes) {
  const singles = frames.filter((f) => f.at?.row === 'single');
  if (singles.length > 1 && new Set(singles.map((f) => f.at.canvas)).size > 1) {
    for (const f of singles) delete f.at;
    notes.push('single frames have different canvas sizes - each frame centered on its own bbox');
  }
  const rows = new Map();
  for (const f of frames) if (f.at) { if (!rows.has(f.at.row)) rows.set(f.at.row, []); rows.get(f.at.row).push(f); }
  for (const [row, list] of rows) {
    const uy0 = Math.min(...list.map((f) => f.at.top)), uy1 = Math.max(...list.map((f) => f.at.bottom));
    const ux = row === 'single' ? (Math.min(...list.map((f) => f.at.left)) + Math.max(...list.map((f) => f.at.right)) + 1) / 2 : null;
    for (const f of list) {
      f.anchor = { cx: (ux ?? f.at.slotCx) - f.at.left, cy: (uy0 + uy1 + 1) / 2 - f.at.top, gap: uy1 - f.at.bottom };
      delete f.at;
    }
  }
}

function hasTransparency(img) {
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 128) return true;
  return false;
}

function framesFromFolder(dir, files, mode, env, warn, label) {
  const out = [];
  for (const f of files) {
    let img;
    try { img = readPng(path.join(dir, f)); } catch (e) { warn(`${label}: cannot read frames/${f} (${e.message})`); continue; }
    if (mode === 'vfx' && img.w === VFX.cell && img.h === VFX.cell) { quantizeAlpha(img); out.push({ img, final: true }); continue; }
    removeBackground(img, { tol: env.tol, mode });
    // a forgotten stray pixel would change the trimmed size (and so the scale of the whole anim)
    const stray = mode === 'char' ? removeSpecks(img, { frac: 0, min: 3 }).removed : 0;
    const t = trim(img);
    if (t) out.push({ img: t, final: false, stray });
    else warn(`${label}: frames/${f} is empty`);
  }
  return out;
}

// ============================================================== character packing
function footAnchor(img) {
  const y0 = Math.min(img.h - 1, Math.floor(img.h * 0.8));
  let sx = 0, n = 0;
  for (let y = y0; y < img.h; y++) for (let x = 0; x < img.w; x++) if (img.data[(y * img.w + x) * 4 + 3]) { sx += x; n++; }
  return n ? sx / n : img.w / 2;
}

// A versioned sidecar can correct a pose's gait center and lift flight frames without changing the
// shared cell pivot or the raw art. Offsets are final-cell pixels, after the animation's common scale.
function frameOffsetsFor(side, count, spec, warn, label) {
  if (!Object.hasOwn(side, 'frameOffsets')) return null;
  const offsets = side.frameOffsets;
  const valid = Array.isArray(offsets) && offsets.length === count && offsets.every((pair) =>
    Array.isArray(pair) && pair.length === 2 && pair.every(Number.isInteger) &&
    Math.abs(pair[0]) <= spec.frameWidth && Math.abs(pair[1]) <= spec.frameHeight);
  if (!valid) {
    warn(`${label}: frameOffsets must have ${count} [dx,dy] integer pair(s) within the cell size - ignored`);
    return null;
  }
  return offsets;
}

// Anatomical calibration measures skull-to-chin in each raw pose, along the head axis.
// Hair, raised hands and crouching change bounds without changing the person's scale.
function anatomicalScalesFor(side, count, warn, label) {
  if (!Object.hasOwn(side, 'anatomy')) return null;
  const a = side.anatomy;
  if (!a || a.measurement !== 'skull-to-chin' || !Number.isFinite(a.targetHeadPx) ||
      a.targetHeadPx < 8 || a.targetHeadPx > 64 || !Array.isArray(a.sourceHeadPx) ||
      a.sourceHeadPx.length !== count || !a.sourceHeadPx.every((n) => Number.isFinite(n) && n >= 8 && n <= 2048)) {
    warn(label + ': anatomy requires measurement skull-to-chin, targetHeadPx 8..64, and ' + count + ' sourceHeadPx measurements (8..2048) - ignored');
    return null;
  }
  return a.sourceHeadPx.map((n) => a.targetHeadPx / n);
}

// Feet center on the pivot x, lowest row on the pivot y (the floor line) before any per-frame correction.
// clip = pixels lost outside the cell; margin = pixels inside its safe margin (including below the floor).
function placeCharFrame(sprite, spec, offset = [0, 0]) {
  const W = spec.frameWidth, H = spec.frameHeight, m = spec.cellMargin;
  const cell = newImage(W, H);
  const dx = Math.round(spec.pivot[0] - footAnchor(sprite)) + offset[0];
  const dy = spec.pivot[1] - (sprite.h - 1) + offset[1];
  const lost = blit(cell, sprite, dx, dy);
  const clip = [];
  if (dx < 0) clip.push(`left ${-dx}px`);
  if (dx + sprite.w > W) clip.push(`right ${dx + sprite.w - W}px`);
  if (dy < 0) clip.push(`top ${-dy}px`);
  if (dy + sprite.h > H) clip.push(`bottom ${dy + sprite.h - H}px`);
  const margin = [];
  const b = !lost && m ? bbox(sprite) : null;
  if (b) {
    const x0 = b.x0 + dx, x1 = b.x1 + dx, y0 = b.y0 + dy;
    if (x0 < m) margin.push(`left ${m - x0}px`);
    if (x1 > W - 1 - m) margin.push(`right ${x1 - (W - 1 - m)}px`);
    if (y0 < m) margin.push(`top ${m - y0}px`);
    if (b.y1 + dy > spec.pivot[1]) margin.push(`below floor ${b.y1 + dy - spec.pivot[1]}px`);
  }
  return { cell, lost, clip, margin };
}

// Pixel thresholds for the box heuristics, scaled from their spec v1 tuning (see V1_STANDING_BODY_PX).
function boxTuning(spec) {
  const k = spec.standingBodyPx / V1_STANDING_BODY_PX;
  const px = (v) => Math.max(1, Math.round(v * k));
  return { band: px(40), slack: px(6), thick: px(16), tipLen: px(6), blobN: Math.max(4, Math.round(12 * k * k)), fwdExt: px(4), upExt: px(6), upSlack: px(2), pad: px(2), near: px(6) };
}

const clampBox = ([x, y, w, h], W, H) => {
  const x0 = Math.max(0, x), y0 = Math.max(0, y), x1 = Math.min(W, x + w), y1 = Math.min(H, y + h);
  return [x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0)];
};

function hurtBox(cell) {
  const b = bbox(cell);
  if (!b) return null;
  const ix = Math.round(b.w * 0.18), it = Math.round(b.h * 0.04);
  return [b.x0 + ix, b.y0 + it, Math.max(2, b.w - 2 * ix), Math.max(2, b.h - it)];
}

// The striking part: the 8-connected blob containing (sx, sy) inside a region, plus any other blob
// of the region within `near` px of it (a smear or spark drawn just in front of the fist).
function strikeBox(img, sx, sy, x0, y0, x1, y1, near = 6) {
  x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(img.w - 1, x1); y1 = Math.min(img.h - 1, y1);
  if (sx < x0 || sx > x1 || sy < y0 || sy > y1 || x1 < x0 || y1 < y0) return null;
  const W = x1 - x0 + 1, H = y1 - y0 + 1;
  const op = (x, y) => img.data[(y * img.w + x) * 4 + 3] !== 0;
  const label = new Int32Array(W * H);
  const blobs = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (label[(y - y0) * W + x - x0] || !op(x, y)) continue;
    const id = blobs.length + 1;
    const b = { x0: x, y0: y, x1: x, y1: y, n: 0 };
    const stack = [[x, y]];
    label[(y - y0) * W + x - x0] = id;
    while (stack.length) {
      const [px, py] = stack.pop();
      b.n++;
      if (px < b.x0) b.x0 = px; if (px > b.x1) b.x1 = px; if (py < b.y0) b.y0 = py; if (py > b.y1) b.y1 = py;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = px + dx, yy = py + dy;
        if (xx < x0 || xx > x1 || yy < y0 || yy > y1) continue;
        const k = (yy - y0) * W + xx - x0;
        if (label[k] || !op(xx, yy)) continue;
        label[k] = id;
        stack.push([xx, yy]);
      }
    }
    blobs.push(b);
  }
  const start = label[(sy - y0) * W + sx - x0] - 1;
  if (start < 0) return null;
  const box = { ...blobs[start] };
  const used = new Set([start]);
  for (let grown = true; grown;) {
    grown = false;
    blobs.forEach((b, i) => {
      if (used.has(i) || b.x0 > box.x1 + near || b.x1 < box.x0 - near || b.y0 > box.y1 + near || b.y1 < box.y0 - near) return;
      used.add(i);
      box.x0 = Math.min(box.x0, b.x0); box.y0 = Math.min(box.y0, b.y0); box.x1 = Math.max(box.x1, b.x1); box.y1 = Math.max(box.y1, b.y1); box.n += b.n;
      grown = true;
    });
  }
  return { ...box, w: box.x1 - box.x0 + 1, h: box.y1 - box.y0 + 1 };
}

// Opaque pixel of column x (or row y) closest to the middle of its opaque run.
function midOpaque(img, { x, y }) {
  const hits = [];
  if (x !== undefined) { for (let yy = 0; yy < img.h; yy++) if (img.data[(yy * img.w + x) * 4 + 3]) hits.push(yy); }
  else for (let xx = 0; xx < img.w; xx++) if (img.data[(y * img.w + xx) * 4 + 3]) hits.push(xx);
  return hits.length ? hits[hits.length >> 1] : -1;
}

function colCount(img, x) {
  let n = 0;
  for (let y = 0; y < img.h; y++) if (img.data[(y * img.w + x) * 4 + 3]) n++;
  return n;
}

// Hitbox for an active frame. Spec rule ("the part of the silhouette beyond the idle pose's maxX - 6px",
// px at spec v1 scale; T scales every px threshold to the spec's body size), made robust for real art:
//  1. forward strike (reaches past the idle front): walk back from the tip until the columns get
//     torso-thick, so only the limb counts; take the blob holding the forward-most pixel (+ smears
//     touching it) within +-T.band px of the tip row (a guard fist next to a kick is excluded);
//  2. rising strike (uppercut, rises above the idle head): the same idea around the highest pixel;
//     whichever of 1/2 reaches further past the idle pose is tried first;
//  3. otherwise the forward-most 28% of the body at strike height.
function hitBox(cell, ref, T) {
  const b = bbox(cell);
  if (!b) return null;
  const pad = (bb) => clampBox([bb.x0 - T.pad, bb.y0 - T.pad, bb.w + 2 * T.pad, bb.h + 2 * T.pad], cell.w, cell.h);
  const forward = () => {
    let start = ref.maxX - T.slack + 1;
    const thick = Math.max(T.thick, Math.round(b.h * 0.25));
    for (let x = b.x1; x >= Math.max(start, b.x0); x--) if (colCount(cell, x) > thick) { start = x + 1; break; }
    if (b.x1 - start + 1 < T.tipLen) return null;
    const ty = midOpaque(cell, { x: b.x1 });
    const tip = strikeBox(cell, b.x1, ty, start, ty - T.band, cell.w - 1, ty + T.band, T.near);
    if (tip && tip.n >= T.blobN) return { box: pad(tip), rule: 'forward' };
    const fwd = bbox(cell, start, 0, cell.w - 1, cell.h - 1);
    return fwd && fwd.n >= T.blobN ? { box: pad(fwd), rule: 'forward' } : null;
  };
  const up = () => {
    // walk down from the top until the rows get head-thick: fist + forearm only
    let bottom = ref.minY - T.upSlack;
    const thick = Math.max(T.thick, Math.round(b.w * 0.45));
    for (let y = b.y0; y <= b.y0 + b.h * 0.5; y++) {
      let n = 0;
      for (let x = b.x0; x <= b.x1; x++) if (cell.data[(y * cell.w + x) * 4 + 3]) n++;
      if (n > thick) { bottom = Math.max(bottom, y - 1); break; }
    }
    const tx = midOpaque(cell, { y: b.y0 });
    const top = strikeBox(cell, tx, b.y0, tx - T.band, 0, tx + T.band, bottom, T.near);
    return top && top.n >= T.blobN ? { box: pad(top), rule: 'up' } : null;
  };
  const fwdExt = b.x1 - ref.maxX, upExt = ref.minY - b.y0;
  const tries = [];
  if (fwdExt >= T.fwdExt) tries.push([fwdExt, forward]);
  if (upExt >= T.upExt) tries.push([upExt, up]);
  tries.sort((p, q) => q[0] - p[0]);
  for (const [, fn] of tries) { const h = fn(); if (h) return h; }
  const cw = Math.max(1, Math.round(b.w * 0.28));
  const front = bbox(cell, b.x1 - cw + 1, 0, b.x1, cell.h - 1);
  return { box: pad(front), rule: 'front' };
}

function validBox(b) { return Array.isArray(b) && b.length === 4 && b.every((v) => Number.isFinite(v)); }

function applyOverrides(file, packed, boxes, warn, label) {
  const r = readJson(file);
  if (!r.exists) return 0;
  if (r.error) { warn(`${label}/hitboxes.json is not valid JSON (${r.error}) - ignored`); return 0; }
  let n = 0;
  for (const [anim, frames] of Object.entries(r.data || {})) {
    if (anim.startsWith('_') || !frames || typeof frames !== 'object') continue;
    const p = packed.find((a) => a.name === anim);
    if (!p) { warn(`hitboxes.json: "${anim}" is not packed - override skipped`); continue; }
    const keys = Object.keys(frames).filter((k) => !k.startsWith('_')).sort((a, b) => (a === '*' ? -1 : b === '*' ? 1 : 0));
    for (const k of keys) {
      const ov = frames[k];
      const targets = k === '*' ? p.indices.map((_, i) => i) : [Number(k)];
      if (!targets.every((i) => Number.isInteger(i) && i >= 0 && i < p.indices.length)) { warn(`hitboxes.json: ${anim} frame "${k}" out of range (0-${p.indices.length - 1})`); continue; }
      for (const i of targets) {
        const key = String(p.indices[i]);
        boxes[key] = boxes[key] || {};
        for (const kind of ['hit', 'hurt']) {
          if (!(kind in (ov || {}))) continue;
          const list = ov[kind];
          if (!Array.isArray(list) || !list.every(validBox)) { warn(`hitboxes.json: ${anim}[${k}].${kind} must be [[x,y,w,h], ...]`); continue; }
          // an explicit empty `hit` list is kept: the engine reads it as "this frame cannot hit"
          // (a missing list falls back to the move's reach); an empty `hurt` list means "use the default body box"
          if (list.length) boxes[key][kind] = list.map((bx) => bx.map((v) => Math.round(v)));
          else if (kind === 'hit') boxes[key].hit = [];
          else delete boxes[key][kind];
        }
        // hand: the palm/fingertip point the engine anchors hand effects, shots and beams to
        // ([x, y] in the 256 cell; the engine falls back to the hit box, then fixed offsets)
        if ('hand' in (ov || {})) {
          const h = ov.hand;
          if (Array.isArray(h) && h.length === 2 && h.every((v) => Number.isFinite(v))) boxes[key].hand = h.map((v) => Math.round(v));
          else if (h === null) delete boxes[key].hand;
          else warn(`hitboxes.json: ${anim}[${k}].hand must be [x, y]`);
        }
        n++;
      }
    }
  }
  return n;
}

// Median-cut palette over all opaque pixels, then snap every pixel to it.
function quantizeFrames(cells, n) {
  const colors = new Map();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) {
    const k = (c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2];
    colors.set(k, (colors.get(k) || 0) + 1);
  }
  if (colors.size <= n) return colors.size;
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
  const palette = boxes.map((bx) => {
    let r = 0, g = 0, b = 0, t = 0;
    for (const p of bx) { r += p[0] * p[3]; g += p[1] * p[3]; b += p[2] * p[3]; t += p[3]; }
    return [Math.round(r / t), Math.round(g / t), Math.round(b / t)];
  });
  const cache = new Map();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) {
    const k = (c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2];
    let p = cache.get(k);
    if (!p) {
      let bd = Infinity;
      for (const q of palette) { const dd = (q[0] - c.data[i]) ** 2 + (q[1] - c.data[i + 1]) ** 2 + (q[2] - c.data[i + 2]) ** 2; if (dd < bd) { bd = dd; p = q; } }
      cache.set(k, p);
    }
    c.data[i] = p[0]; c.data[i + 1] = p[1]; c.data[i + 2] = p[2];
  }
  return palette.length;
}

function countColors(cells) {
  const s = new Set();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) s.add((c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2]);
  return s.size;
}

function writeFile(env, file, buf, R) {
  if (env.dryRun) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
  R.wrote.push(rel(env.cwd, file));
}

// Clean frames written back to art/.../frames/<anim>/ so humans can touch them up.
function writeBack(env, dir, prefix, cells, src, R, extra = {}) {
  if (env.dryRun || !env.writeback) return;
  fs.mkdirSync(dir, { recursive: true });
  const old = readJson(path.join(dir, MARKER)).data;
  if (old?.files) for (const f of Object.keys(old.files)) if (new RegExp(`^${prefix}_\\d+\\.png$`, 'i').test(f)) { try { fs.unlinkSync(path.join(dir, f)); } catch { /* gone */ } }
  const files = {};
  cells.forEach((c, k) => {
    const name = `${prefix}_${String(k).padStart(2, '0')}.png`;
    const buf = encodePng(c);
    fs.writeFileSync(path.join(dir, name), buf);
    files[name] = sha1(buf);
  });
  const marker = {
    generatedBy: 'tools/pack-sprites.mjs', note: 'Frames cleaned from raw/. Edit freely: edited frames are never overwritten.',
    sourceFile: src.label, version: src.version ?? null, source: src.hashInputs.map((f) => rel(env.artDir, f)), sourceHash: hashFiles(src.hashInputs), ...extra, files,
  };
  fs.writeFileSync(path.join(dir, MARKER), JSON.stringify(marker, null, 2) + '\n');
  R.writeback.push(rel(env.cwd, dir));
}

function packCharacter(id, env) {
  const R = { id, packed: [], missing: [], missingCore: [], failed: [], versions: {}, complete: false, frames: 0, sheet: null, colors: 0, warnings: [], notes: [], wrote: [], writeback: [], ui: [], uiItems: [] };
  const warn = (m) => R.warnings.push(m);
  const spec = env.spec;
  const charDir = path.join(env.artDir, 'characters', id);
  const label = `characters/${id}`;
  if (!isDir(charDir)) {
    warn(`no folder art/characters/${id}/ - copy art/characters/_template/ to start it`);
    R.missingCore = [...CORE];
    return R;
  }
  const defs = animDefsFor(id, env);
  const names = defs.map((d) => d.name);
  const rawIdx = scanRaw(path.join(charDir, 'raw'), names, warn, `${label}/raw`);
  const framesRoot = path.join(charDir, 'frames');
  for (const d of listDirs(framesRoot)) {
    if (!names.includes(d) && listPngs(path.join(framesRoot, d)).length) warn(`${label}/frames/${d}/: unknown animation (not in manifest or animGuide) - ignored`);
  }
  // written into every frames/<anim>/.packer.json: a different cell (spec change) re-imports untouched frames
  const cellKey = { frameWidth: spec.frameWidth, frameHeight: spec.frameHeight, pivot: [...spec.pivot] };
  // the tallest pose must fit between the top margin of the cell and the floor line (pivot y)
  const maxBody = spec.pivot[1] + 1 - spec.cellMargin;

  // 1) gather + normalize every animation
  const anims = [];
  for (const def of defs) {
    const alabel = `${def.name}`;
    try {
      const framesDir = path.join(framesRoot, def.name);
      const raw = pickRaw(rawIdx.get(def.name), def.name);
      if (raw?.version != null) R.versions[def.name] = raw.version;
      const side = readSidecars(raw?.sidecars, warn, alabel);
      let bodyHeight = Math.round(Number(side.bodyHeight) > 0 ? Number(side.bodyHeight) : def.bodyHeight);
      let tooTall = null;
      if (!(bodyHeight >= 8 && bodyHeight <= maxBody)) {
        const fixed = Math.min(maxBody, Math.max(8, bodyHeight || DEFAULT_BODY_HEIGHT));
        tooTall = `${alabel}: bodyHeight ${bodyHeight} does not fit the ${spec.frameHeight}px cell (8-${maxBody}px: floor line y ${spec.pivot[1]}, ${spec.cellMargin}px top margin) - using ${fixed}`;
        bodyHeight = fixed;
      }
      const src = chooseSource(framesDir, raw, { bodyHeight, cell: cellKey, artDir: env.artDir }, warn, alabel);
      if (!src) { R.missing.push(def.name); continue; }
      if (src.kind === 'stale') { warn(staleText(alabel, def.name, src)); R.missing.push(def.name); continue; }
      if (tooTall) warn(tooTall); // only for animations that have art: the rest would be noise
      let sprites, notes = [], sourceLabel, unreadable = false;
      // what the art came from: the raw file (also behind packer-written frames/), its version, hand edits
      let origin = null, version = null, edited = false, handMade = false;
      if (src.kind === 'frames') {
        const items = framesFromFolder(framesDir, src.framePngs, 'char', env, warn, alabel);
        sprites = items.map((f) => f.img);
        const stray = items.reduce((s, f) => s + f.stray, 0);
        if (stray) notes.push(`ignored ${stray} stray pixel(s) - clean them in frames/${def.name}/`);
        sourceLabel = `frames/${def.name}/`;
        if (src.origin) ({ file: origin, version } = src.origin);
        edited = !!src.edited;
        handMade = !src.packerMade;
      } else {
        ({ frames: sprites, notes, unreadable } = framesFromRaw(src.rawFiles, def.frames, side, env, 'char', warn, alabel, src.strip));
        sourceLabel = origin = src.label;
        version = src.version;
        if (src.replaced) notes.push(`re-imported: replaces frames/ cleaned from ${src.replaced}`);
      }
      if (raw?.ignored.length) notes.push(`ignored ${raw.ignored.join(' and ')} (a _vNN version exists)`);
      if (def.approvedVersion && version != null && version !== def.approvedVersion) notes.push(`candidate v${String(version).padStart(2, '0')} (approved: v${String(def.approvedVersion).padStart(2, '0')})`);
      if (!sprites.length) {
        if (!unreadable) warn(`${alabel}: no sprite pixels found in ${sourceLabel}`);
        R.missing.push(def.name); R.failed.push(def.name); continue;
      }
      const maxH = Math.max(...sprites.map((s) => s.h));
      let scale = bodyHeight / maxH;
      // raw art is scaled exactly; already-clean frames are only resampled when clearly off-size
      // (mode-downscaling can lose a partial top row, so a clean frame may be 1-2px short)
      const keep = src.kind === 'frames' ? Math.max(2, Math.round(bodyHeight * 0.04)) : 1;
      if (Math.abs(maxH - bodyHeight) <= keep) {
        if (maxH !== bodyHeight && src.kind === 'frames' && !src.packerMade) notes.push(`kept native size (${maxH}px vs ${bodyHeight}px)`);
        scale = 1;
      }
      const anatomyScales = anatomicalScalesFor(side, sprites.length, warn, alabel);
      if (anatomyScales) {
        // Cached or hand-edited cells already have their final anatomy. Never normalize them
        // to bodyHeight again; source/sidecar hash invalidation handles fresh raw imports.
        scale = 1;
        notes.push('anatomical scale: skull-to-chin ' + side.anatomy.targetHeadPx + 'px; bounds are pose-dependent');
        if (src.kind !== 'frames' && anatomyScales.some((n) => n > 1)) warn(alabel + ': anatomical calibration upscales raw art - generate larger source poses');
      }
      if (scale > 1) warn(`${alabel}: art is smaller than the target (${maxH}px < ${bodyHeight}px) - upscaled x${scale.toFixed(2)} (nearest); generate it bigger`);
      const frameOffsets = frameOffsetsFor(side, sprites.length, spec, warn, alabel);
      const cells = [];
      const frameScales = [];
      const clipped = [], tight = [];
      sprites.forEach((s, k) => {
        const poseScale = anatomyScales && src.kind !== 'frames' ? anatomyScales[k] : scale;
        frameScales.push(+poseScale.toFixed(5));
        const small = resample(s, poseScale, { coverage: 0.5, alphaMin: 128 });
        const { cell, lost, clip, margin } = placeCharFrame(small, spec, frameOffsets?.[k]);
        if (lost) clipped.push(`#${k} ${clip.join('/')}`);
        else if (margin.length) tight.push(`#${k} ${margin.join('/')}`);
        cells.push(cell);
      });
      const fitAdvice = anatomyScales ? 'repose or reposition while preserving anatomical scale' : 'lower bodyHeight or redraw';
      if (clipped.length) warn(`${alabel}: ${clipped.length} frame(s) clipped by the ${spec.frameWidth}x${spec.frameHeight} cell (${clipped.join(', ')}) - pose too wide/tall for the pivot; ${fitAdvice}`);
      if (tight.length) warn(`${alabel}: ${tight.length} frame(s) reach into the ${spec.cellMargin}px cell margin (${tight.join(', ')}) - keep every pixel inside x ${spec.cellMargin}..${spec.frameWidth - 1 - spec.cellMargin}, y >= ${spec.cellMargin}; ${fitAdvice}`);
      if (cells.length !== def.frames) warn(`${alabel}: ${cells.length} frame(s), manifest expects ${def.frames}${def.phases ? ` (phases rescaled to ${rescalePhases(def.phases, cells.length).join('/')})` : ''}`);
      anims.push({ def, cells, scale, frameScales, sourceLabel, src, notes, bodyHeight, origin, version, edited, handMade });
    } catch (e) {
      warn(`${alabel}: failed - ${e.message}`);
      R.missing.push(def.name);
      R.failed.push(def.name);
    }
  }

  // UI images are independent of the sheet
  packUi(id, charDir, env, R);

  R.missingCore = defs.filter((d) => d.required && !anims.some((a) => a.def.name === d.name)).map((d) => d.name);
  if (!anims.length) {
    // A pack this packer made earlier, whose every source is gone (e.g. the only idle version moved to
    // raw/_rejected/), must not keep shipping the rejected art: remove it so the game falls back to the
    // placeholder. A sheet that did not come from the packer (Sprite Lab download, hand-made) is left alone.
    const outChar = path.join(env.outDir, 'characters', id);
    const existing = path.join(outChar, 'anims.json');
    if (isFile(existing)) {
      const old = readJson(existing).data;
      if (old?.source === 'art-pack') {
        const stale = [existing, path.join(outChar, 'sheet.png')].filter(isFile);
        if (!env.dryRun) for (const f of stale) fs.unlinkSync(f);
        R.removed = stale.map((f) => rel(env.cwd, f));
        R.notes.push(`${env.dryRun ? 'would remove' : 'removed'} the stale art pack (nothing packable left): ${R.removed.join(', ')}; the game uses the placeholder`);
      } else {
        R.notes.push(`no frames in art/ - left the existing ${rel(env.cwd, existing)} untouched (not made by the packer)`);
      }
    }
    return R;
  }

  // 2) optional palette snap (across the whole character so colors stay consistent)
  const allCells = anims.flatMap((a) => a.cells);
  if (env.quantize) R.notes.push(`palette snapped to ${quantizeFrames(allCells, env.quantize)} colors`);
  R.colors = countColors(allCells);
  if (R.colors > spec.warnColors) warn(`palette has ${R.colors} colors (> ${spec.warnColors}; spec target <= ${spec.maxColors}) - clean the art or re-run with --quantize ${spec.maxColors}`);
  else if (R.colors > spec.maxColors) R.notes.push(`palette has ${R.colors} colors: above the spec target of ${spec.maxColors} (warned above ${spec.warnColors})`);

  // 3) sheet layout + metadata (the engine reads frame size, pivot and ppu from here)
  const meta = {
    frameWidth: spec.frameWidth, frameHeight: spec.frameHeight, columns: spec.columns, pivot: [...spec.pivot], pixelsPerUnit: spec.pixelsPerUnit,
    facing: spec.facing, spec: spec.name, source: 'art-pack', character: id, packer: PACKER_VERSION, complete: R.missingCore.length === 0,
    missingCore: R.missingCore, animations: {}, boxes: {},
  };
  let idx = 0;
  const packed = [];
  for (const a of anims) {
    const indices = a.cells.map(() => idx++);
    const m = { frames: indices, durations: resolveDurations(a.def.durations, indices.length), loop: a.def.loop };
    const ph = rescalePhases(a.def.phases, indices.length);
    if (ph) m.phases = ph;
    meta.animations[a.def.name] = m;
    packed.push({ name: a.def.name, indices, cells: a.cells, phases: ph, def: a.def });
  }

  // 4) boxes: hurt on every frame, hit on active attack frames
  const idle = packed.find((p) => p.name === 'idle');
  let ref;
  if (idle) {
    const bs = idle.cells.map((c) => bbox(c)).filter(Boolean);
    ref = { maxX: Math.max(...bs.map((b) => b.x1)), minY: Math.min(...bs.map((b) => b.y0)) };
  } else {
    const bh = defs.find((d) => d.name === 'idle')?.bodyHeight ?? DEFAULT_BODY_HEIGHT;
    ref = { maxX: spec.pivot[0] + Math.round(bh * 0.26), minY: spec.pivot[1] - bh };
    warn('idle is not packed yet - hitboxes estimated from the idle bodyHeight');
  }
  const T = boxTuning({ ...spec, standingBodyPx: env.manifest.characters[id]?.standingBodyPx ?? spec.standingBodyPx });
  const rules = {};
  const big = [];
  for (const p of packed) {
    p.cells.forEach((cell, k) => {
      const key = String(p.indices[k]);
      const hb = hurtBox(cell);
      meta.boxes[key] = hb ? { hurt: [hb] } : {};
      const active = p.phases && p.def.hitbox && k >= p.phases[0] && k < p.phases[0] + p.phases[1];
      if (active) {
        const h = hitBox(cell, ref, T);
        if (h?.box) {
          meta.boxes[key].hit = [h.box];
          rules[h.rule] = (rules[h.rule] || 0) + 1;
          const b = bbox(cell);
          if (h.box[2] * h.box[3] > 0.4 * b.w * b.h) big.push(`${p.name}#${k}`);
        }
      }
    });
  }
  if (big.length) warn(`large auto hitbox (> 40% of the body) on ${big.join(', ')} - check in the Sprite Lab, add hitboxes.json overrides if needed`);
  const ov = applyOverrides(path.join(charDir, 'hitboxes.json'), packed, meta.boxes, warn, label);
  if (ov) R.notes.push(`${ov} hitbox override(s) from hitboxes.json`);
  if (rules.front) R.notes.push(`${rules.front} active frame(s) had no clear strike limb - hitbox = front 28% of the body (check them in the Sprite Lab or add hitboxes.json overrides)`);

  // 5) write sheet + json (+ write-back of cleaned frames)
  const cols = spec.columns;
  const rows = Math.ceil(idx / cols);
  const sheet = newImage(cols * spec.frameWidth, rows * spec.frameHeight);
  for (const p of packed) p.cells.forEach((cell, k) => {
    const f = p.indices[k];
    blit(sheet, cell, (f % cols) * spec.frameWidth, Math.floor(f / cols) * spec.frameHeight);
  });
  R.frames = idx;
  R.sheet = `${sheet.w}x${sheet.h}`;
  R.complete = meta.complete;
  const outDir = path.join(env.outDir, 'characters', id);
  writeFile(env, path.join(outDir, 'sheet.png'), encodePng(sheet), R);
  writeFile(env, path.join(outDir, 'anims.json'), Buffer.from(stringifyCompact(meta) + '\n'), R);
  for (const a of anims) {
    R.packed.push({
      anim: a.def.name, frames: a.cells.length, expected: a.def.frames, source: a.sourceLabel, from: a.origin, version: a.version,
      edited: a.edited, handMade: a.handMade, scale: +a.scale.toFixed(3), frameScales: a.frameScales, notes: a.notes,
    });
    if (a.src.kind === 'raw' && !env.quantize) writeBack(env, path.join(framesRoot, a.def.name), a.def.name, a.cells, a.src, R, { bodyHeight: a.bodyHeight, cell: cellKey });
  }
  return R;
}

// portrait / cutin / select: remove magenta bg, fit to the spec size, write next to the sheet.
function packUi(id, charDir, env, R) {
  const uiDir = path.join(charDir, 'ui');
  for (const [name, spec] of Object.entries(UI_ITEMS)) {
    const file = path.join(uiDir, `${name}.png`);
    if (!isFile(file)) continue;
    try {
      let img = readPng(file);
      const corner = [0, (img.w - 1) * 4, (img.h - 1) * img.w * 4, ((img.h - 1) * img.w + img.w - 1) * 4];
      if (corner.some((i) => isMagentaish([img.data[i], img.data[i + 1], img.data[i + 2]]) && img.data[i + 3] > 128)) removeBackground(img, { tol: env.tol, mode: 'char' });
      // a blank image would replace the game's fallback portrait/cut-in with nothing
      if (!bbox(img)) { R.warnings.push(`ui/${name}.png: empty after background removal - not written`); continue; }
      let note = 'copied';
      if (img.w !== spec.w || img.h !== spec.h) {
        const t = hasTransparency(img) ? trim(img) : null;
        if (t) {
          // contain-fit the trimmed art
          const s = Math.min(spec.w / t.w, spec.h / t.h);
          const small = resample(t, Math.abs(s - 1) < 0.005 ? 1 : s, { coverage: 0.5 });
          const out = newImage(spec.w, spec.h);
          const dx = Math.round((spec.w - small.w) / 2);
          const dy = spec.align === 'bottom' ? spec.h - small.h : Math.round((spec.h - small.h) / 2);
          blit(out, small, dx, dy);
          img = out;
        } else {
          // opaque art: center-crop to the aspect ratio, then downscale
          const ar = spec.w / spec.h;
          let cw = img.w, ch = Math.round(img.w / ar);
          if (ch > img.h) { ch = img.h; cw = Math.round(img.h * ar); }
          const c = crop(img, Math.floor((img.w - cw) / 2), Math.floor((img.h - ch) / 2), cw, ch);
          img = cw > spec.w ? downscaleMode(c, spec.w, spec.h, { coverage: 0.5 }) : upscaleNearest(c, spec.w, spec.h);
        }
        note = `fitted to ${spec.w}x${spec.h}`;
      }
      writeFile(env, path.join(env.outDir, 'characters', id, `${name}.png`), encodePng(img), R);
      R.ui.push(`${name} (${note})`);
      R.uiItems.push(name);
    } catch (e) {
      R.warnings.push(`ui/${name}.png: failed - ${e.message}`);
    }
  }
}

// ============================================================== world art approval gate
// World art (effects, spectators) ships only once the user approved it (ADR 0007/0008: "approvedVersion" in the
// manifest). Candidates are packed with --candidates into <out>/preview/ (git-ignored; the game shows them with
// ?art=custom), so the shipped public/vfx|crowd never holds unapproved art.
const worldOut = (env, kind) => path.join(env.candidates ? path.join(env.outDir, 'preview') : env.outDir, kind);

// An output whose inputs are no longer approved (or gone) is removed: public/ is packer output only (CLAUDE.md rule 3).
function removeOutputs(env, dir, names, R) {
  for (const n of names) {
    const f = path.join(dir, n);
    if (!fs.existsSync(f)) continue;
    if (!env.dryRun) fs.unlinkSync(f);
    R.removed.push(rel(env.cwd, f));
  }
}

const vv = (n) => `v${String(n).padStart(2, '0')}`;

// ============================================================== VFX packing
function packVfx(env) {
  const R = { packed: [], missing: [], failed: [], unapproved: [], removed: [], preview: !!env.candidates, versions: {}, frames: 0, atlas: null, warnings: [], notes: [], wrote: [], writeback: [] };
  const warn = (m) => R.warnings.push(m);
  const vfxDir = path.join(env.artDir, 'vfx');
  const outVfx = worldOut(env, 'vfx');
  const effects = { ...VFX_EFFECTS };
  for (const [name, e] of Object.entries(env.manifest.vfx)) effects[name] = { ...(VFX_EFFECTS[name] || { frames: e.frames || 4, ms: 50, tinted: false, fill: 0.8 }), ...e };
  // an approval recorded on a worldArt.vfx batch (vfx-<effect>, vfx-<effect>-rN) counts like vfx.effects (highest wins)
  for (const [name, v] of worldApprovals(env.manifestRaw, 'vfx')) if (effects[name] && v > (effects[name].approvedVersion || 0)) effects[name].approvedVersion = v;
  if (!isDir(vfxDir)) { R.missing = Object.keys(effects); removeOutputs(env, outVfx, ['atlas.png', 'atlas.json'], R); return R; }
  const names = Object.keys(effects);
  const rawIdx = scanRaw(path.join(vfxDir, 'raw'), names, warn, 'vfx/raw');
  const framesRoot = path.join(vfxDir, 'frames');
  for (const d of listDirs(framesRoot)) if (!names.includes(d) && listPngs(path.join(framesRoot, d)).length) warn(`vfx/frames/${d}/: unknown effect - ignored (engine names are fixed)`);

  const packed = [];
  for (const name of names) {
    const e = effects[name];
    try {
      const framesDir = path.join(framesRoot, name);
      const latest = pickRaw(rawIdx.get(name), name);
      if (latest?.version != null) R.versions[name] = latest.version;
      if (!env.candidates && !e.approvedVersion) { R.unapproved.push(name); continue; }
      // ship the approved version even when a newer candidate is waiting for review
      const raw = env.candidates ? latest : pickRaw(rawIdx.get(name), name, e.approvedVersion);
      const src = chooseSource(framesDir, raw, { bodyHeight: null, cell: null, artDir: env.artDir }, warn, name);
      if (!src) { R.missing.push(name); continue; }
      if (src.kind === 'stale') { warn(staleText(name, name, src)); R.missing.push(name); continue; }
      let items, notes = [], sourceLabel, origin = null, version = null;
      if (src.kind === 'frames') {
        items = framesFromFolder(framesDir, src.framePngs, 'vfx', env, warn, name);
        sourceLabel = `frames/${name}/`;
        if (src.origin) ({ file: origin, version } = src.origin);
      } else {
        const side = readSidecars(raw.sidecars, warn, name);
        const r = framesFromRaw(src.rawFiles, e.frames, side, env, 'vfx', warn, name, src.strip);
        items = r.frames.map((img) => ({ img, final: false }));
        notes = r.notes;
        sourceLabel = origin = src.label;
        version = src.version;
        if (src.replaced) notes.push(`re-imported: replaces frames/ cleaned from ${src.replaced}`);
        if (!items.length && r.unreadable) { R.missing.push(name); R.failed.push(name); continue; }
      }
      if (raw?.ignored.length) notes.push(`ignored ${raw.ignored.join(' and ')} (a _vNN version exists)`);
      if (!items.length) { warn(`${name}: no pixels found in ${sourceLabel}`); R.missing.push(name); R.failed.push(name); continue; }
      if (!env.candidates && latest?.version > (version ?? 0)) notes.push(`newer candidate ${vv(latest.version)} not shipped (approve it to ship it)`);
      if (!env.candidates && version != null && version !== e.approvedVersion) {
        warn(`${name}: the source is ${vv(version)} but ${vv(e.approvedVersion)} is approved - not packed (approve ${vv(version)} or move it to raw/_rejected/)`);
        R.unapproved.push(name);
        continue;
      }
      const loose = items.filter((it) => !it.final).map((it) => it.img);
      const target = Math.round(VFX.cell * (e.fill || 0.8));
      const maxDim = loose.length ? Math.max(...loose.map((s) => Math.max(s.w, s.h))) : 0;
      let scale = loose.length ? target / maxDim : 1;
      if (Math.abs(maxDim - target) <= 1) scale = 1;
      const cells = items.map((it) => {
        if (it.final) return it.img;
        const s = resample(it.img, scale, { coverage: 0.34, alphaMin: 40 });
        const cell = newImage(VFX.cell, VFX.cell);
        // keep the frame's offset inside its strip row (vfxAnchors); no anchor = center on its own bbox
        const a = it.img.anchor;
        const half = VFX.cell / 2;
        let dx = a ? Math.round(half - a.cx * scale) : Math.round((VFX.cell - s.w) / 2);
        let dy = a ? Math.round(half - a.cy * scale) : Math.round((VFX.cell - s.h) / 2);
        if (e.anchor === 'bottom') {
          dy = VFX.baseline - (s.h - 1) - (a ? Math.round(a.gap * scale) : 0);
          if (e.baseX) dx = Math.round(half - (footAnchor(s) + 0.5));
        }
        if (blit(cell, s, dx, dy)) notes.push('clipped');
        return cell;
      });
      if (e.tinted) {
        const colored = Math.max(...cells.map(toGreyscale));
        if (colored > 0.05) warn(`${name}: drawn in color but the engine tints it - converted to greyscale (draw it white/grey)`);
      }
      if (e.lumaAlpha) cells.forEach((c, k) => { if (!items[k].final) lumaToAlpha(c); });
      for (const c of cells) quantizeAlpha(c);
      if (cells.length !== e.frames) warn(`${name}: ${cells.length} frame(s), expected ${e.frames}`);
      packed.push({ name, e, cells, src, sourceLabel, notes, scale, origin, version, edited: !!src.edited, handMade: src.kind === 'frames' && !src.packerMade });
    } catch (err) {
      warn(`${name}: failed - ${err.message}`);
      R.missing.push(name);
      R.failed.push(name);
    }
  }
  if (!packed.length) { removeOutputs(env, outVfx, ['atlas.png', 'atlas.json'], R); return R; }

  const cols = Math.max(...packed.map((p) => p.cells.length));
  const atlas = newImage(cols * VFX.cell, packed.length * VFX.cell);
  const meta = { cell: VFX.cell, cols, rows: packed.length, ppu: VFX.ppu, source: 'art-pack', packer: PACKER_VERSION, anims: {} };
  packed.forEach((p, row) => {
    p.cells.forEach((c, i) => blit(atlas, c, i * VFX.cell, row * VFX.cell));
    meta.anims[p.name] = { row, n: p.cells.length, ms: p.e.ms ?? 50 };
    R.packed.push({ effect: p.name, frames: p.cells.length, expected: p.e.frames, source: p.sourceLabel, from: p.origin, version: p.version, edited: p.edited, handMade: p.handMade, scale: +p.scale.toFixed(3), notes: [...new Set(p.notes)] });
    R.frames += p.cells.length;
  });
  R.atlas = `${atlas.w}x${atlas.h}`;
  writeFile(env, path.join(outVfx, 'atlas.png'), encodePng(atlas), R);
  writeFile(env, path.join(outVfx, 'atlas.json'), Buffer.from(stringifyCompact(meta) + '\n'), R);
  for (const p of packed) if (p.src.kind === 'raw') writeBack(env, path.join(framesRoot, p.name), p.name, p.cells, p.src, R, {});
  return R;
}

// ============================================================== crowd packing (ADR 0008)
// art/crowd/raw/<id>_vNN.png (3 poses on magenta) -> public/crowd/atlas.{png,json}: each spectator = 3 consecutive
// 64 x 96 cells (idle, cheer, shocked) in one row, idle scaled to its height class, feet on the pivot.
const CROWD = Object.freeze({ cell: [64, 96], cols: 64, ppu: 50, pivot: [32, 94], top: 2, frames: ['idle', 'cheer', 'shocked'], maxColors: 24 });
const CROWD_HEIGHT = { tiny: 44, short: 58, medium: 70, tall: 78, huge: 84 };
const CROWD_PER_ROW = Math.floor(CROWD.cols / CROWD.frames.length); // 21: a spectator's cells never wrap a row

// Every roster entry (art/crowd/roster/*.json, file order): who may appear and at which height class.
function crowdRoster(crowdDir, warn) {
  const out = [], seen = new Set();
  const dir = path.join(crowdDir, 'roster');
  if (!isDir(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((n) => n.toLowerCase().endsWith('.json')).sort()) {
    const j = readJson(path.join(dir, f));
    if (!j.data) { warn(`crowd/roster/${f}: ${j.error || 'unreadable'} - skipped`); continue; }
    for (const sp of j.data.spectators || []) {
      if (!sp?.id) continue;
      if (seen.has(sp.id)) { warn(`crowd: ${sp.id} is listed twice (roster/${f}) - the first entry is used`); continue; }
      seen.add(sp.id);
      out.push({ id: sp.id, group: j.data.group || f.replace(/\.json$/i, ''), kind: sp.kind || j.data.kind || 'original', heightClass: sp.heightClass, tags: Array.isArray(sp.tags) ? sp.tags : [] });
    }
  }
  return out;
}

// Approved version per spectator (manifest worldArt.crowd.batches.*.items): a redo batch may approve a later one.
function crowdApprovals(rawManifest) {
  const m = new Map();
  for (const b of Object.values(rawManifest?.worldArt?.crowd?.batches || {})) {
    for (const [id, it] of Object.entries(b?.items || {})) {
      const v = it?.approvedVersion;
      if (Number.isInteger(v) && v > 0 && v > (m.get(id) || 0)) m.set(id, v);
    }
  }
  return m;
}

// One raw -> the 3 cells. The idle frame sets the scale (its height = the class height); the other two share it,
// shrunk only if a pose would leave the cell (arms above y 2, wider than 64). Each pose stands on the pivot line,
// centered on its feet.
function crowdCells(file, classPx, env, notes) {
  const [CW, CH] = CROWD.cell;
  const img = readPng(file);
  const bg = removeBackground(img, { tol: env.tol, mode: 'char' });
  if (!bg.magentaBg && !bg.removed && !hasTransparency(img)) throw new Error('no removable background (flat magenta #FF00FF expected)');
  if (bg.foreign) notes.push(`background ${bg.foreign} is not magenta`);
  const sp = removeSpecks(img, { frac: 0.0015, min: 4 });
  if (sp.blobs > 3) notes.push(`removed ${sp.blobs} specks`);
  let { rects } = splitStrip(img, 3, { mode: 'char' });
  if (rects.length !== 3) {
    const n = rects.length;
    ({ rects } = splitStrip(img, 3, { split: 'even', mode: 'char' }));
    notes.push(`${n} pose(s) found, split into even thirds`);
  }
  if (rects.length !== 3) throw new Error(`${rects.length} pose(s) found, expected 3 (idle, cheer, shocked)`);
  const poses = rects.map((r) => {
    const piece = crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    dropStrays(piece);
    const b = bbox(piece);
    if (!b) throw new Error('a pose is empty after background removal');
    return crop(piece, b.x0, b.y0, b.w, b.h);
  });
  const room = CROWD.pivot[1] - CROWD.top + 1;
  let s = classPx / poses[0].h;
  const fit = Math.min(s, ...poses.map((p) => room / p.h), ...poses.map((p) => CW / p.w));
  if (fit < s - 1e-9) { notes.push(`shrunk to fit the cell (idle ${Math.round(poses[0].h * fit)} px, class ${classPx})`); s = fit; }
  const cells = poses.map((p) => {
    const small = resample(p, s, { coverage: 0.5, alphaMin: 128 });
    for (let i = 3; i < small.data.length; i += 4) small.data[i] = small.data[i] >= 128 ? 255 : 0;
    const b = bbox(small);
    const t = b ? crop(small, b.x0, b.y0, b.w, b.h) : small;
    const cell = newImage(CW, CH);
    const dx = Math.max(0, Math.min(CW - t.w, Math.round(CROWD.pivot[0] - (footAnchor(t) + 0.5))));
    const dy = CROWD.pivot[1] - (t.h - 1);
    if (blit(cell, t, dx, dy)) notes.push('clipped');
    return cell;
  });
  const colors = quantizeFrames(cells, CROWD.maxColors);
  return { cells, colors, scale: s };
}

function packCrowd(env) {
  const R = { packed: [], missing: [], failed: [], unapproved: 0, removed: [], preview: !!env.candidates, spectators: 0, atlas: null, warnings: [], notes: [], wrote: [] };
  const warn = (m) => R.warnings.push(m);
  const crowdDir = path.join(env.artDir, 'crowd');
  const outCrowd = worldOut(env, 'crowd');
  const roster = crowdRoster(crowdDir, warn);
  const approved = crowdApprovals(env.manifestRaw);
  const rosterIds = new Set(roster.map((r) => r.id));
  for (const id of approved.keys()) if (!rosterIds.has(id)) warn(`crowd: ${id} is approved in the manifest but not in any roster - skipped (no height class)`);

  // raw/<id>_vNN.png per id (raw/_rejected/ is not scanned)
  const raws = new Map();
  const rawDir = path.join(crowdDir, 'raw');
  if (isDir(rawDir)) {
    for (const f of fs.readdirSync(rawDir)) {
      const m = VERSION_RE.exec(f);
      if (!m) continue;
      if (!raws.has(m[1])) raws.set(m[1], new Map());
      raws.get(m[1]).set(Number(m[2]), path.join(rawDir, f));
    }
  }

  const packed = [];
  for (const sp of roster) {
    const want = env.candidates ? Math.max(0, ...(raws.get(sp.id)?.keys() || [])) || null : approved.get(sp.id) || null;
    if (!want) { if (!env.candidates) R.unapproved++; continue; }
    const file = raws.get(sp.id)?.get(want);
    if (!file) { warn(`crowd: ${sp.id} ${vv(want)} is ${env.candidates ? 'the latest' : 'approved'} but raw/${sp.id}_${vv(want)}.png is missing`); R.missing.push(sp.id); continue; }
    let classPx = CROWD_HEIGHT[sp.heightClass];
    if (!classPx) { warn(`crowd: ${sp.id} has heightClass ${JSON.stringify(sp.heightClass)} - packed as medium`); classPx = CROWD_HEIGHT.medium; }
    const notes = [];
    const newest = Math.max(0, ...(raws.get(sp.id)?.keys() || []));
    if (newest > want) notes.push(`newer candidate ${vv(newest)} not shipped (approve it to ship it)`);
    try {
      const r = crowdCells(file, classPx, env, notes);
      packed.push({ ...sp, version: want, ...r, notes });
    } catch (e) {
      warn(`crowd: ${sp.id} ${vv(want)}: ${e.message} - skipped`);
      R.failed.push(sp.id);
    }
  }
  if (!packed.length) { removeOutputs(env, outCrowd, ['atlas.png', 'atlas.json'], R); return R; }

  const [CW, CH] = CROWD.cell;
  const rows = Math.ceil(packed.length / CROWD_PER_ROW);
  const atlas = newImage(CROWD.cols * CW, rows * CH);
  const meta = { cell: [CW, CH], cols: CROWD.cols, ppu: CROWD.ppu, pivot: [...CROWD.pivot], frames: [...CROWD.frames], source: env.candidates ? 'candidates' : 'approved', packer: PACKER_VERSION, spectators: [] };
  packed.forEach((p, k) => {
    const row = Math.floor(k / CROWD_PER_ROW), col = (k % CROWD_PER_ROW) * CROWD.frames.length;
    p.cells.forEach((c, f) => blit(atlas, c, (col + f) * CW, row * CH));
    meta.spectators.push({ id: p.id, cell: row * CROWD.cols + col, heightClass: p.heightClass, kind: p.kind, tags: p.tags, version: p.version });
    R.packed.push({ id: p.id, group: p.group, version: p.version, colors: p.colors, scale: +p.scale.toFixed(4), notes: [...new Set(p.notes)] });
  });
  R.spectators = packed.length;
  R.atlas = `${atlas.w}x${atlas.h}`;
  writeFile(env, path.join(outCrowd, 'atlas.png'), encodePng(atlas), R);
  writeFile(env, path.join(outCrowd, 'atlas.json'), Buffer.from(stringifyCompact(meta) + '\n'), R);
  return R;
}

// ============================================================== stage, NPC and UI packing (ADR 0008, ADR 0012)
// Approved version per item of a world-art kind: manifest worldArt.<kind>.batches.<batch>.items.<item>.approvedVersion
// (highest wins when a redo batch approves a later one). `key(batchId, item)` names the item.
function worldApprovals(rawManifest, kind, key = (b, item) => item) {
  const m = new Map();
  for (const [bid, b] of Object.entries(rawManifest?.worldArt?.[kind]?.batches || {})) {
    for (const [item, it] of Object.entries(b?.items || {})) {
      const v = it?.approvedVersion;
      const k = key(bid, item);
      if (Number.isInteger(v) && v > 0 && v > (m.get(k) || 0)) m.set(k, v);
    }
  }
  return m;
}

// Highest version of `<prefix>_vNN.png` (or `<prefix><infix>_vNN.png`) in a folder; { version, file } or null.
function latestVersion(dir, re) {
  let best = null;
  for (const f of listPngs(dir)) {
    const m = re.exec(f);
    if (m && (!best || Number(m[1]) > best.version)) best = { version: Number(m[1]), file: path.join(dir, f) };
  }
  return best;
}
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Opaque texture: alpha forced to 255. Cutout / sprite: magenta removed if the image still has it, alpha 0 or 255.
function cleanWorldImage(img, cutout, env) {
  const notes = [];
  if (!cutout) {
    let soft = 0;
    for (let i = 3; i < img.data.length; i += 4) if (img.data[i] !== 255) { soft++; img.data[i] = 255; }
    if (soft) notes.push(`${soft} transparent px made opaque (texture slot)`);
    return notes;
  }
  if (!hasTransparency(img)) {
    const bg = removeBackground(img, { tol: env.tol, mode: 'char' });
    if (bg.removed) notes.push('magenta background removed');
  }
  // fit scripts key the background but can leave a 1 px magenta-blend fringe on the edge (2 passes)
  const { w, data: d } = img;
  let fringe = 0;
  for (let pass = 0; pass < 2; pass++) {
    const kill = [];
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128 || !isMagentaHue(d[i], d[i + 1], d[i + 2])) continue;
      const p = i >> 2, x = p % w;
      const clear = (q) => q < 0 || q >= d.length || d[q + 3] < 128;
      if ((x > 0 && clear(i - 4)) || (x < w - 1 && clear(i + 4)) || clear(i - w * 4) || clear(i + w * 4)) kill.push(i);
    }
    for (const i of kill) d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
    fringe += kill.length;
    if (!kill.length) break;
  }
  if (fringe) notes.push(`${fringe} magenta fringe px removed`);
  let soft = 0;
  for (let i = 3; i < img.data.length; i += 4) {
    const a = img.data[i];
    if (a !== 0 && a !== 255) soft++;
    img.data[i] = a >= 128 ? 255 : 0;
    if (!img.data[i]) img.data[i - 3] = img.data[i - 2] = img.data[i - 1] = 0;
  }
  if (soft) notes.push(`${soft} soft-alpha px snapped to 0/255`);
  return notes;
}

// The 30 stage slots (art/stage/ASSETS.md "All slots"): exact final size and kind. The engine maps each image on
// the painter's geometry and repeat counts, so the size only sets the detail, never the world coverage.
const STAGE_SLOTS = {
  ringTop: [1152, 1152, 'texture'], ringSide: [256, 40, 'texture'], grass: [256, 256, 'texture'], steps: [64, 64, 'texture'],
  stoneBase: [128, 64, 'texture'], brick: [128, 64, 'texture'], path: [128, 128, 'texture'], templeFacade: [1536, 384, 'texture'],
  roof: [128, 80, 'texture'], bannerBu: [64, 192, 'cutout'], bannerDo: [64, 192, 'cutout'], bannerSai: [64, 192, 'cutout'],
  bannerTo: [64, 192, 'cutout'], plaster: [128, 128, 'texture'], sky: [16, 512, 'texture'], cloudA: [256, 96, 'sprite'],
  cloudB: [256, 96, 'sprite'], cloudC: [256, 96, 'sprite'], gong: [128, 128, 'texture'], parasol: [256, 96, 'cutout'],
  woodDark: [64, 128, 'texture'], treeRoundA: [192, 256, 'sprite'], treeRoundB: [192, 256, 'sprite'], treePine: [192, 256, 'sprite'],
  treePalm: [192, 256, 'sprite'], sign: [288, 72, 'texture'], lanternBu: [128, 64, 'texture'], lanternSai: [128, 64, 'texture'],
  woodPillar: [64, 128, 'texture'], wood: [64, 128, 'texture'],
};

// Source of a stage slot. Approved: final/<slot>.png (the lead's approved copy), else the approved version's
// palette-cleaned or fitted candidate. Candidates: the highest version of review/<slot>_palette_vNN.png or
// raw/_fit/<slot>_vNN.png (palette-cleaned wins on a tie); a slot with no candidate previews its approved image.
function stageSource(dir, slot, version, candidates) {
  const pal = (v) => path.join(dir, 'review', `${slot}_palette_v${String(v).padStart(2, '0')}.png`);
  const fit = (v) => path.join(dir, 'raw', '_fit', `${slot}_v${String(v).padStart(2, '0')}.png`);
  if (!candidates) {
    const fin = path.join(dir, 'final', `${slot}.png`);
    return [fin, pal(version), fit(version)].find((f) => fs.existsSync(f)) || null;
  }
  return [pal(version), fit(version)].find((f) => fs.existsSync(f)) || null;
}

function packStage(env) {
  const R = { packed: [], missing: [], failed: [], unapproved: 0, removed: [], preview: !!env.candidates, warnings: [], wrote: [] };
  const warn = (m) => R.warnings.push(m);
  const dir = path.join(env.artDir, 'stage');
  const out = worldOut(env, 'stage');
  const approved = worldApprovals(env.manifestRaw, 'stage');
  for (const s of approved.keys()) if (!STAGE_SLOTS[s]) warn(`stage: "${s}" is approved but is not a stage slot - ignored`);
  const slots = {};
  for (const [slot, [w, h, kind]] of Object.entries(STAGE_SLOTS)) {
    let version = approved.get(slot) || null, candidate = false;
    const re = (inf) => new RegExp(`^${escRe(slot)}${inf}_v(\\d+)\\.png$`, 'i');
    const latest = Math.max(latestVersion(path.join(dir, 'review'), re('_palette'))?.version || 0, latestVersion(path.join(dir, 'raw', '_fit'), re(''))?.version || 0);
    if (env.candidates && latest) { version = latest; candidate = true; }
    if (!version) { if (!env.candidates) R.unapproved++; continue; }
    const file = stageSource(dir, slot, version, candidate);
    if (!file) { warn(`stage: ${slot} ${vv(version)} is ${env.candidates ? 'the latest' : 'approved'} but no final/, review/ or raw/_fit/ file exists`); R.missing.push(slot); continue; }
    try {
      const img = readPng(file);
      if (img.w !== w || img.h !== h) { warn(`stage: ${rel(env.artDir, file)} is ${img.w}x${img.h}, the ${slot} slot needs exactly ${w}x${h} - skipped`); R.failed.push(slot); continue; }
      const notes = cleanWorldImage(img, kind !== 'texture', env);
      if (!candidate && latest > version) notes.push(`newer candidate ${vv(latest)} not shipped (approve it to ship it)`);
      const colors = countColors([img]);
      writeFile(env, path.join(out, `${slot}.png`), encodePng(img), R);
      slots[slot] = { file: `${slot}.png`, size: [w, h], kind, version };
      R.packed.push({ slot, version, from: rel(env.artDir, file), colors, notes });
    } catch (e) {
      warn(`stage: ${slot}: ${e.message} - skipped`);
      R.failed.push(slot);
    }
  }
  // public/ only holds what this run packed: an image whose approval was withdrawn stops shipping
  removeOutputs(env, out, Object.keys(STAGE_SLOTS).filter((s) => !slots[s]).map((s) => `${s}.png`), R);
  if (!R.packed.length) removeOutputs(env, out, ['manifest.json'], R);
  else writeFile(env, path.join(out, 'manifest.json'), Buffer.from(stringifyCompact({ source: env.candidates ? 'candidates' : 'approved', packer: PACKER_VERSION, slots }) + '\n'), R);
  return R;
}

// NPC cells (art/npc/README.md "NPC spec").
const NPC = Object.freeze({ cell: 128, columns: 8, pivot: [64, 124], ppu: 80, margin: 4, maxColors: 32, frames: 2 });

// The animation table of art/npc/<id>/ANIMATIONS.md (anim | what | frames | loop | ms per frame | height ...) is the
// one source for an NPC's animations, timing and target heights; idle first.
function npcSpecs(npcDir, warn, id) {
  const file = path.join(npcDir, 'ANIMATIONS.md');
  if (!fs.existsSync(file)) { warn(`npc ${id}: no ANIMATIONS.md - skipped`); return null; }
  const specs = [];
  let inTable = false;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (/^\|\s*anim\s*\|/i.test(line)) { inTable = true; continue; }
    if (!inTable) continue;
    if (!line.startsWith('|')) { if (specs.length) break; continue; }
    const c = line.split('|').slice(1, -1).map((s) => s.trim());
    const name = (c[0].match(/`([A-Za-z0-9]+)`/) || [])[1];
    if (!name) continue;
    if (c.length < 6) { warn(`npc ${id}: the ANIMATIONS.md row for ${name} has ${c.length} columns (needs anim, what, frames, loop, ms, height) - skipped`); continue; }
    const ms = (c[4].match(/\d+/g) || []).map(Number);
    specs.push({ name, loop: /^yes/i.test(c[3]), ms: ms.length ? ms : [500, 500], height: Number((c[5].match(/\d+/) || [])[0]) || null });
  }
  if (!specs.find((s) => s.name === 'idle')) { warn(`npc ${id}: ANIMATIONS.md has no idle row in its animation table - skipped`); return null; }
  return specs.sort((a, b) => (a.name === 'idle' ? -1 : b.name === 'idle' ? 1 : 0));
}

// One strip -> its trimmed poses (magenta, specks and stray marks removed).
function npcPoses(file, env, notes) {
  const img = readPng(file);
  const bg = removeBackground(img, { tol: env.tol, mode: 'char' });
  if (!bg.magentaBg && !bg.removed && !hasTransparency(img)) throw new Error('no removable background (flat magenta #FF00FF expected)');
  const sp = removeSpecks(img, { frac: 0.0015, min: 4 });
  if (sp.blobs > 3) notes.push(`removed ${sp.blobs} specks`);
  let { rects } = splitStrip(img, NPC.frames, { mode: 'char' });
  if (rects.length !== NPC.frames) {
    const n = rects.length;
    ({ rects } = splitStrip(img, NPC.frames, { split: 'even', mode: 'char' }));
    notes.push(`${n} pose(s) found, split into even halves`);
  }
  if (rects.length !== NPC.frames) throw new Error(`${rects.length} pose(s) found, expected ${NPC.frames}`);
  return rects.map((r) => {
    const piece = crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    dropStrays(piece);
    const b = bbox(piece);
    if (!b) throw new Error('a pose is empty after background removal');
    return crop(piece, b.x0, b.y0, b.w, b.h);
  });
}

function packNpcs(env) {
  const R = { packed: [], skipped: [], unapproved: 0, removed: [], preview: !!env.candidates, warnings: [], wrote: [] };
  const warn = (m) => R.warnings.push(m);
  const root = path.join(env.artDir, 'npc');
  const outRoot = worldOut(env, 'npc');
  // npc-<id> and its redo batches npc-<id>-rN approve the same NPC (highest approved version wins)
  const approved = worldApprovals(env.manifestRaw, 'npc', (b, item) => `${b.replace(/^npc-/, '').replace(/-r\d+$/, '')}/${item}`);
  for (const k of approved.keys()) if (!isDir(path.join(root, k.split('/')[0]))) warn(`npc: ${k} is approved but art/npc/${k.split('/')[0]}/ does not exist`);
  const C = NPC.cell, [PX, PY] = NPC.pivot, M = NPC.margin;
  for (const id of listDirs(root).filter((n) => !n.startsWith('_') && !n.startsWith('.'))) {
    const dir = path.join(root, id), out = path.join(outRoot, id);
    const drop = (why) => { if (why) R.skipped.push(`${id}: ${why}`); removeOutputs(env, out, ['sheet.png', 'anims.json'], R); };
    const specs = npcSpecs(dir, warn, id);
    if (!specs) { drop(null); continue; }
    const anims = [];
    for (const s of specs) {
      const re = new RegExp(`^${escRe(s.name)}_v(\\d+)\\.png$`, 'i');
      const newest = latestVersion(path.join(dir, 'raw'), re)?.version;
      const version = env.candidates ? newest : approved.get(`${id}/${s.name}`);
      if (!version) { if (!env.candidates) R.unapproved++; continue; }
      const file = path.join(dir, 'raw', `${s.name}_${vv(version)}.png`);
      if (!fs.existsSync(file)) { warn(`npc ${id}: ${s.name} ${vv(version)} is ${env.candidates ? 'the latest' : 'approved'} but raw/${s.name}_${vv(version)}.png is missing`); continue; }
      const notes = [];
      if (newest > version) notes.push(`newer candidate ${vv(newest)} not shipped (approve it to ship it)`);
      try {
        anims.push({ ...s, version, poses: npcPoses(file, env, notes), notes });
      } catch (e) {
        warn(`npc ${id}: ${s.name} ${vv(version)}: ${e.message} - skipped`);
      }
    }
    if (!anims.find((a) => a.name === 'idle')) { drop(anims.length ? 'no usable idle (it sets the scale) - not packed' : null); continue; }
    // Each strip is scaled to its own target height from ANIMATIONS.md (the trimmed height of its tallest frame):
    // generated strips drift in scale from one image to the next, and the per-animation heights already encode
    // the poses (a crouch is shorter, a raised fist taller), so the head stays the same size across animations.
    // An animation without a height row takes idle's scale. Feet always land on the pivot line.
    const tallest = (a) => Math.max(...a.poses.map((p) => p.h));
    const npcNotes = [];
    const fitted = (a, sc) => {
      const fit = Math.min(sc, ...a.poses.map((p) => (PY - M + 1) / p.h), ...a.poses.map((p) => (C - 2 * M) / p.w));
      if (fit < sc - 1e-9) { a.notes.push(`shrunk to fit the cell margin (${Math.round(tallest(a) * fit)} px, target ${a.height ?? Math.round(tallest(a) * sc)})`); return fit; }
      return sc;
    };
    anims[0].scale = fitted(anims[0], (anims[0].height || tallest(anims[0])) / tallest(anims[0]));
    for (const a of anims.slice(1)) a.scale = fitted(a, a.height ? a.height / tallest(a) : anims[0].scale);
    const s = anims[0].scale;
    const cells = [];
    const meta = { frameWidth: C, frameHeight: C, columns: NPC.columns, pivot: [PX, PY], pixelsPerUnit: NPC.ppu, facing: 'viewer-right', source: env.candidates ? 'candidates' : 'art-pack', npc: id, packer: PACKER_VERSION, complete: true, animations: {} };
    for (const a of anims) {
      const frames = [];
      for (const p of a.poses) {
        const small = resample(p, a.scale, { coverage: 0.5, alphaMin: 128 });
        for (let i = 3; i < small.data.length; i += 4) small.data[i] = small.data[i] >= 128 ? 255 : 0;
        const b = bbox(small);
        const t = b ? crop(small, b.x0, b.y0, b.w, b.h) : small;
        const cell = newImage(C, C);
        const dx = Math.max(M, Math.min(C - M - t.w, Math.round(PX - (footAnchor(t) + 0.5))));
        if (blit(cell, t, dx, PY - (t.h - 1))) a.notes.push('clipped');
        frames.push(cells.length);
        cells.push(cell);
      }
      meta.animations[a.name] = { frames, durations: frames.map((_, k) => a.ms[k] ?? a.ms[a.ms.length - 1]), loop: a.loop, version: a.version };
    }
    const colors = quantizeFrames(cells, NPC.maxColors);
    const sheet = newImage(NPC.columns * C, Math.ceil(cells.length / NPC.columns) * C);
    cells.forEach((c, k) => blit(sheet, c, (k % NPC.columns) * C, Math.floor(k / NPC.columns) * C));
    writeFile(env, path.join(out, 'sheet.png'), encodePng(sheet), R);
    writeFile(env, path.join(out, 'anims.json'), Buffer.from(stringifyCompact(meta) + '\n'), R);
    const missing = specs.filter((sp) => !meta.animations[sp.name]).map((sp) => sp.name);
    R.packed.push({ id, anims: anims.map((a) => `${a.name} ${vv(a.version)}`), missing, colors, scale: +s.toFixed(4), notes: [...npcNotes, ...new Set(anims.flatMap((a) => a.notes.map((n) => `${a.name}: ${n}`)))] });
  }
  return R;
}

// Shared UI (art/ui/README.md): the logo keeps its size (at most 640 x 240) and transparency, the title art is
// exactly 640 x 360 and opaque. Manifest approval: worldArt.ui (ui-<asset> batches) or sharedUi.<key>.
const UI_ASSETS = { logo: { key: 'logo', size: null, max: [640, 240], cutout: true }, title_art: { key: 'titleArt', size: [640, 360], max: [640, 360], cutout: false } };

function packSharedUi(env) {
  const R = { packed: [], missing: [], failed: [], unapproved: 0, removed: [], preview: !!env.candidates, warnings: [], wrote: [] };
  const warn = (m) => R.warnings.push(m);
  const dir = path.join(env.artDir, 'ui');
  const out = worldOut(env, 'ui');
  const approved = worldApprovals(env.manifestRaw, 'ui');
  const assets = {};
  for (const [name, A] of Object.entries(UI_ASSETS)) {
    const shared = env.manifestRaw?.sharedUi?.[A.key]?.approvedVersion;
    const ok = (v) => Number.isInteger(v) && v > 0;
    let version = Math.max(approved.get(name) || 0, ok(shared) ? shared : 0) || null, candidate = false;
    const re = (inf) => new RegExp(`^${escRe(name)}${inf}_v(\\d+)\\.png$`, 'i');
    // the latest review candidate; with --candidates an asset without one previews its approved image
    const latest = Math.max(latestVersion(path.join(dir, 'review'), re('_palette'))?.version || 0, latestVersion(path.join(dir, 'review'), re('_fit'))?.version || 0);
    if (env.candidates && latest) { version = latest; candidate = true; }
    if (!version) { if (!env.candidates) R.unapproved++; continue; }
    const pal = path.join(dir, 'review', `${name}_palette_${vv(version)}.png`), fit = path.join(dir, 'review', `${name}_fit_${vv(version)}.png`);
    const file = [...(candidate ? [] : [path.join(dir, 'final', `${name}.png`)]), pal, fit].find((f) => fs.existsSync(f));
    if (!file) { warn(`ui: ${name} ${vv(version)} is ${env.candidates ? 'the latest' : 'approved'} but no final/ or review/ file exists`); R.missing.push(name); continue; }
    try {
      const img = readPng(file);
      if (A.size ? img.w !== A.size[0] || img.h !== A.size[1] : img.w > A.max[0] || img.h > A.max[1]) {
        warn(`ui: ${rel(env.artDir, file)} is ${img.w}x${img.h}; ${name} needs ${A.size ? `exactly ${A.size.join('x')}` : `at most ${A.max.join('x')}`} - skipped`);
        R.failed.push(name);
        continue;
      }
      const notes = cleanWorldImage(img, A.cutout, env);
      if (!candidate && latest > version) notes.push(`newer candidate ${vv(latest)} not shipped (approve it to ship it)`);
      writeFile(env, path.join(out, `${name}.png`), encodePng(img), R);
      assets[name] = { file: `${name}.png`, size: [img.w, img.h], version };
      R.packed.push({ asset: name, version, from: rel(env.artDir, file), colors: countColors([img]), notes });
    } catch (e) {
      warn(`ui: ${name}: ${e.message} - skipped`);
      R.failed.push(name);
    }
  }
  removeOutputs(env, out, Object.keys(UI_ASSETS).filter((n) => !assets[n]).map((n) => `${n}.png`), R);
  if (!R.packed.length) removeOutputs(env, out, ['manifest.json'], R);
  else writeFile(env, path.join(out, 'manifest.json'), Buffer.from(stringifyCompact({ source: env.candidates ? 'candidates' : 'approved', packer: PACKER_VERSION, assets }) + '\n'), R);
  return R;
}

// ============================================================== manifest status sync (--update-manifest)
const STATUS_ORDER = ['todo', 'raw', 'packed', 'approved'];

function raiseStatus(obj, status) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return 0;
  const cur = STATUS_ORDER.indexOf(obj.status);
  if (cur >= STATUS_ORDER.indexOf(status)) return 0;
  obj.status = status;
  return 1;
}

// "version" = the latest candidate number (ADR 0007): raised to the highest raw/<anim>_vNN.png found, never lowered
// (a rejected version moved to raw/_rejected/ was still a candidate). "approvedVersion" is the reviewer's: never touched.
function raiseVersion(obj, v) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj) || !Number.isInteger(v)) return 0;
  if (Number.isInteger(obj.version) && obj.version >= v) return 0;
  obj.version = v;
  return 1;
}

function updateManifestStatus(raw, rep) {
  let n = 0;
  for (const c of rep.characters) {
    const mc = raw.characters?.[c.id];
    if (!mc || typeof mc !== 'object') continue;
    const anims = mc.animations || {};
    for (const p of c.packed) n += raiseStatus(anims[p.anim], 'packed');
    for (const a of c.failed) n += raiseStatus(anims[a], 'raw');
    for (const [a, v] of Object.entries(c.versions || {})) n += raiseVersion(anims[a], v);
    for (const u of c.uiItems) n += raiseStatus(mc.ui?.[u], 'packed');
  }
  const fx = raw.vfx?.effects;
  if (rep.vfx && fx && typeof fx === 'object') {
    for (const p of rep.vfx.packed) n += raiseStatus(fx[p.effect], 'packed');
    for (const e of rep.vfx.failed) n += raiseStatus(fx[e], 'raw');
    for (const [e, v] of Object.entries(rep.vfx.versions || {})) n += raiseVersion(fx[e], v);
  }
  return n;
}

// JSON with small leaf objects/arrays on one line (the manifest's hand-written style; small git diffs).
function stringifyCompact(v, indent = '') {
  const inner = indent + '  ';
  const prim = (x) => x === null || typeof x !== 'object';
  const primArr = (x) => Array.isArray(x) && x.every(prim);
  const leaf = (x) => prim(x) || primArr(x) || (Array.isArray(x) && x.every(primArr));
  if (prim(v)) return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (leaf(v)) {
      const one = `[${v.map((x) => (prim(x) ? JSON.stringify(x) : stringifyCompact(x, inner))).join(', ')}]`;
      if (one.length <= 140) return one;
    }
    if (!v.length) return '[]';
    return `[\n${v.map((x) => inner + stringifyCompact(x, inner)).join(',\n')}\n${indent}]`;
  }
  const keys = Object.keys(v);
  if (!keys.length) return '{}';
  if (keys.every((k) => leaf(v[k]))) {
    const one = `{ ${keys.map((k) => `${JSON.stringify(k)}: ${stringifyCompact(v[k], inner)}`).join(', ')} }`;
    if (one.length <= 160 && !one.includes('\n')) return one;
  }
  return `{\n${keys.map((k) => `${inner}${JSON.stringify(k)}: ${stringifyCompact(v[k], inner)}`).join(',\n')}\n${indent}}`;
}

// ============================================================== report
// Where an animation's pixels came from, for the report: "raw/idle_v03.png", "frames/idle/ (raw/idle_v03.png)",
// "frames/idle/ (hand-edited, from raw/idle_v02.png)", "frames/light3/ (hand-made)".
function originText(p) {
  if (!p.source.startsWith('frames/')) return p.source;
  if (p.handMade) return `${p.source} (hand-made)`;
  if (p.edited) return `${p.source} (hand-edited${p.from ? `, from ${p.from}` : ''})`;
  return p.from ? `${p.source} (${p.from})` : p.source;
}

function printReport(rep, env) {
  const L = (s = '') => console.log(s);
  const S = rep.spec;
  L(`GCD Tourney sprite packer v${PACKER_VERSION}${env.dryRun ? '  (dry run - nothing written)' : ''}`);
  L(`  art:  ${rep.art}${rep.artExists ? '' : '  (missing)'}`);
  L(`  out:  ${rep.out}`);
  L(`  anims: ${rep.guideSource}${rep.manifest}`);
  L(`  spec: ${S.name} (${S.frameWidth}x${S.frameHeight} cells, pivot [${S.pivot.join(',')}], ppu ${S.pixelsPerUnit}, <= ${S.maxColors} colors)`);
  for (const w of rep.warnings) L(`  ! ${w}`);
  for (const c of rep.characters) {
    L('');
    L(`== ${c.id} ${'='.repeat(Math.max(3, 60 - c.id.length))}`);
    if (!c.packed.length) {
      L('  nothing packed yet (no PNGs in raw/ or frames/<anim>/) - see art/PIPELINE.md');
      if (!c.removed?.length) L('  public/ was not touched for the sheet.');
    } else {
      L(`  packed ${c.packed.length} anims, ${c.frames} frames -> sheet ${c.sheet}, ${c.colors} colors, ${c.complete ? 'COMPLETE (game will use it)' : 'PARTIAL (complete=false; preview with ?art=custom)'}`);
      for (const p of c.packed) {
        const n = `${p.frames}`.padStart(2) + (p.frames !== p.expected ? `/${p.expected}` : '');
        L(`    ${p.anim.padEnd(11)} ${n.padEnd(6)} <- ${originText(p).padEnd(28)} x${p.scale}${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
      }
    }
    if (c.missingCore.length) L(`  missing core (${c.missingCore.length}): ${c.missingCore.join(', ')}`);
    const opt = c.missing.filter((m) => !c.missingCore.includes(m));
    if (opt.length) L(`  missing optional (${opt.length}): ${opt.join(', ')}`);
    if (c.ui.length) L(`  ui: ${c.ui.join(', ')}`);
    for (const n of c.notes) L(`  - ${n}`);
    for (const w of c.warnings) L(`  ! ${w}`);
    if (c.writeback.length) L(`  cleaned frames written back to ${c.writeback.length} folder(s) under art/characters/${c.id}/frames/`);
    for (const f of c.wrote) L(`  wrote ${f}`);
  }
  if (rep.vfx) {
    const v = rep.vfx;
    L('');
    L(`== vfx ${'='.repeat(57)}`);
    if (v.preview) L('  candidates: every effect, approved or not -> preview/vfx/ (the game shows it with ?art=custom)');
    else if (v.unapproved.length) L(`  not approved yet (${v.unapproved.length}, procedural in game; preview with --candidates): ${v.unapproved.join(', ')}`);
    if (!v.packed.length) L(`  nothing packed${v.unapproved.length && !v.preview ? ' (no approved effects)' : ' (no PNGs in art/vfx/raw/ or art/vfx/frames/<effect>/)'} - the game keeps its procedural effects`);
    else {
      L(`  packed ${v.packed.length} effects, ${v.frames} frames -> atlas ${v.atlas} (missing ones stay procedural)`);
      for (const p of v.packed) L(`    ${p.effect.padEnd(11)} ${(String(p.frames).padStart(2) + (p.frames !== p.expected ? '/' + p.expected : '')).padEnd(6)} <- ${originText(p).padEnd(28)} x${p.scale}${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
    }
    if (v.missing.length && v.packed.length) L(`  missing (procedural fallback): ${v.missing.join(', ')}`);
    for (const w of v.warnings) L(`  ! ${w}`);
    for (const f of v.wrote) L(`  wrote ${f}`);
    for (const f of v.removed) L(`  ${env.dryRun ? 'would remove' : 'removed'} ${f} (no approved effects left to ship)`);
  }
  if (rep.crowd) {
    const c = rep.crowd;
    L('');
    L(`== crowd ${'='.repeat(55)}`);
    if (c.preview) L('  candidates: the latest version of every spectator -> preview/crowd/ (the game shows it with ?art=custom)');
    else if (c.unapproved) L(`  ${c.unapproved} roster spectator(s) not approved yet (not shipped; preview with --candidates)`);
    if (!c.packed.length) L('  nothing packed - the game keeps its procedural crowd');
    else {
      const colors = c.packed.map((p) => p.colors);
      L(`  packed ${c.spectators} spectators (${c.spectators * CROWD.frames.length} cells) -> atlas ${c.atlas}, ${Math.min(...colors)}-${Math.max(...colors)} colors each`);
      const groups = new Map();
      for (const p of c.packed) groups.set(p.group, (groups.get(p.group) || 0) + 1);
      L(`    ${[...groups].map(([g, n]) => `${g} ${n}`).join(', ')}`);
      for (const p of c.packed) if (p.notes.length) L(`    ${p.id} ${vv(p.version)}: ${p.notes.join('; ')}`);
    }
    for (const w of c.warnings) L(`  ! ${w}`);
    for (const f of c.wrote) L(`  wrote ${f}`);
    for (const f of c.removed) L(`  ${env.dryRun ? 'would remove' : 'removed'} ${f} (no approved spectators left to ship)`);
  }
  const worldSection = (title, r, what, rows) => {
    if (!r) return;
    L('');
    L(`== ${title} ${'='.repeat(Math.max(3, 60 - title.length))}`);
    if (r.preview) L(`  candidates: the latest version of every ${what} -> preview/ (the game shows it with ?art=custom)`);
    else if (r.unapproved) L(`  ${r.unapproved} ${what}(s) not approved yet (not shipped; preview with --candidates)`);
    if (!r.packed.length) L('  nothing packed - the game keeps its fallback art');
    for (const row of r.packed) L(`    ${rows(row)}`);
    for (const x of r.skipped || []) L(`  - ${x}`);
    for (const w of r.warnings) L(`  ! ${w}`);
    for (const f of r.wrote) L(`  wrote ${f}`);
    for (const f of r.removed) L(`  ${env.dryRun ? 'would remove' : 'removed'} ${f} (not approved / no source any more)`);
  };
  worldSection('stage', rep.stage, 'stage slot', (p) => `${p.slot.padEnd(13)} ${vv(p.version)} <- ${p.from} (${p.colors} colors)${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
  worldSection('npc', rep.npc, 'NPC animation', (p) => `${p.id.padEnd(10)} ${p.anims.join(', ')}${p.missing.length ? ` (missing: ${p.missing.join(', ')})` : ''}, ${p.colors} colors, x${p.scale}${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
  worldSection('ui', rep.ui, 'UI image', (p) => `${p.asset.padEnd(10)} ${vv(p.version)} <- ${p.from} (${p.colors} colors)${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
  if (rep.manifestUpdates !== undefined) L(`\nmanifest: ${rep.manifestUpdates} status/version value(s) raised${env.dryRun ? ' (dry run: not saved)' : ''}${rep.manifestUpdates ? ' - sync art/TRACKER.md' : ''}`);
  L('');
  const nw = rep.totalWarnings;
  const crowdLine = rep.crowd ? (rep.crowd.packed.length ? `crowd atlas packed (${rep.crowd.spectators})` : 'no crowd art') : 'crowd skipped';
  const more = [['stage', 'stage slot'], ['npc', 'NPC'], ['ui', 'UI image']].filter(([k]) => rep[k]).map(([k, n]) => `${rep[k].packed.length} ${n}(s)`);
  L(`done: ${rep.characters.filter((c) => c.packed.length).length}/${rep.characters.length} character(s) packed, ${rep.vfx ? (rep.vfx.packed.length ? 'vfx atlas packed' : 'no vfx art') : 'vfx skipped'}, ${crowdLine}${more.length ? ', ' + more.join(', ') : ''}, ${nw} warning(s).`);
}

// ============================================================== main
async function main() {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) {
    if (e instanceof UsageError) { console.error(`error: ${e.message}\n\n${HELP}`); return 1; }
    throw e;
  }
  if (opts.help) { console.log(HELP); return 0; }
  const cwd = process.cwd();
  const artDir = path.resolve(opts.root || path.join(PROJECT_ROOT, 'art'));
  const outDir = path.resolve(opts.out || path.join(PROJECT_ROOT, 'public'));
  const manifestPath = path.resolve(opts.manifest || path.join(artDir, 'manifest.json'));
  const guidePath = path.resolve(opts.guide || path.join(PROJECT_ROOT, 'src', 'art', 'animGuide.js'));
  const rep = { art: rel(cwd, artDir) || '.', artExists: isDir(artDir), out: rel(cwd, outDir) || '.', warnings: [], characters: [], vfx: null, crowd: null, stage: null, npc: null, ui: null };

  const { guide, source: guideSource } = await loadGuide(guidePath);
  rep.guideSource = guideSource;
  const mj = readJson(manifestPath);
  if (mj.error) rep.warnings.push(`${rel(cwd, manifestPath)} is not valid JSON (${mj.error}) - using animGuide.js + spec defaults`);
  const manifest = normalizeManifest(mj.data);
  for (const s of manifest.specIssues) rep.warnings.push(`manifest ${s}`);
  rep.manifest = mj.data ? ` + ${rel(cwd, manifestPath)}` : mj.exists ? '' : ' (no manifest.json yet - spec defaults)';
  rep.spec = manifest.spec;
  const env = { cwd, artDir, outDir, guide, manifest, manifestRaw: mj.data, spec: manifest.spec, dryRun: opts.dryRun, writeback: opts.writeback, quantize: opts.quantize, tol: opts.tol, candidates: opts.candidates };

  const folderIds = listDirs(path.join(artDir, 'characters')).filter((n) => !n.startsWith('_') && !n.startsWith('.'));
  const allIds = [...folderIds, ...Object.keys(manifest.characters).filter((n) => !n.startsWith('_') && !folderIds.includes(n))];
  let ids = [], doVfx = false;
  const world = new Set();
  const targets = opts.targets.length ? opts.targets : ['all'];
  for (const t of targets) {
    if (t === 'all') { ids.push(...allIds); doVfx = true; ['crowd', 'stage', 'npc', 'ui'].forEach((k) => world.add(k)); }
    else if (t === 'vfx') doVfx = true;
    else if (['crowd', 'stage', 'npc', 'ui'].includes(t)) world.add(t);
    else if (allIds.includes(t)) ids.push(t);
    else {
      console.error(`error: unknown character "${t}". Known: ${allIds.join(', ') || '(none - create art/characters/<id>/ from _template)'}`);
      return 1;
    }
  }
  ids = [...new Set(ids)];

  for (const id of ids) rep.characters.push(packCharacter(id, env));
  // World art ships by approval. Without a readable manifest the approvals are unknown: a half-edited or
  // conflicted manifest must not un-ship approved art, so every world-art output is left as it is.
  const untouched = (kind) => ({
    packed: [], missing: [], failed: [], skipped: [], removed: [], wrote: [], writeback: [], preview: false, frames: 0, spectators: 0,
    unapproved: kind === 'vfx' ? [] : 0,
    warnings: [`${rel(cwd, manifestPath)} is missing or not valid JSON: approvals unknown, ${kind} output left untouched (fix the manifest and re-run)`],
  });
  const worldPack = (kind, fn) => (mj.data ? fn(env) : untouched(kind));
  if (doVfx) rep.vfx = worldPack('vfx', packVfx);
  if (world.has('crowd')) rep.crowd = worldPack('crowd', packCrowd);
  if (world.has('stage')) rep.stage = worldPack('stage', packStage);
  if (world.has('npc')) rep.npc = worldPack('npc', packNpcs);
  if (world.has('ui')) rep.ui = worldPack('ui', packSharedUi);
  if (opts.updateManifest) {
    if (!mj.data) rep.warnings.push('--update-manifest: no readable manifest.json - nothing updated');
    else {
      const n = updateManifestStatus(mj.data, rep);
      rep.manifestUpdates = n;
      if (n && !opts.dryRun) fs.writeFileSync(manifestPath, stringifyCompact(mj.data) + '\n');
    }
  }
  rep.totalWarnings = rep.warnings.length + rep.characters.reduce((s, c) => s + c.warnings.length, 0) + ['vfx', 'crowd', 'stage', 'npc', 'ui'].reduce((s, k) => s + (rep[k]?.warnings.length || 0), 0);

  if (opts.json) console.log(JSON.stringify(rep, null, 2));
  else printReport(rep, env);
  return opts.strict && rep.totalWarnings ? 2 : 0;
}

main().then((code) => { process.exitCode = code; }).catch((e) => {
  console.error(`pack-sprites failed: ${e.stack || e.message}`);
  process.exitCode = 1;
});
