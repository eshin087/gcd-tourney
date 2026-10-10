# art/stage/: the tournament grounds

The stage set around the fighters: the white stone ring, the grass and flagstone paths, the temple, the
stands' walls and tiers, banners, the gate sign and lanterns, the gong, the vendor parasols, the trees, the
clouds and the sky. Today the engine paints every one of them in code (`src/art/textures.js`, placed by
`buildArena()` in `src/world/arena.js`). Each painted piece is a **slot**. Codex replaces slots one by one
with hand-made pixel art; any slot without art keeps its procedural version, so the arena always works.

**Source of truth:** [ADR 0008](../../docs/decisions/0008-world-art-and-parallel-production.md). If this
folder disagrees with it, the ADR wins. Slot list, sizes, tiling and world coverage:
[ASSETS.md](ASSETS.md). Paste-ready prompts: [PROMPTS.md](PROMPTS.md). Pixel craft: [art/STYLE_GUIDE.md](../STYLE_GUIDE.md).
Versioned file names and the review queue: [ADR 0007](../../docs/decisions/0007-art-spec-v2-shippuden-256.md).

> **Tooling status (2026-10-08).** The queue tool (`npm run queue`), the packer's stage mode
> (`npm run sprites stage`) and the engine's stage loader are being built by Claude in parallel (ADR 0008).
> The commands below are their agreed contract. Until a command exists, the Codex lead does that step by hand
> (assigns slots, copies approved files) and nothing else changes. The fit script at the end of this file is
> a tested reference until the packer grows a fit command.

## The look: the World Martial Arts Tournament

The authentic 1990s-anime tournament on a sunny tropical island, translated into crisp HD-2D pixel art:

- **The ring** is the hero: a big raised square of **pale cream-white stone slabs** with warm grout lines,
  sun-bleached, a few chips and hairline cracks. Fighters smash it; the engine draws the craters.
- **Around it**: bright mowed **green grass** with stadium stripes, pale **flagstone paths** to the temple and
  the gate.
- **Behind it**: a **Chinese-style temple**: warm white plaster, **red-lacquer pillars**, dark brown beams,
  lattice windows and shoji, huge dark doors with gold studs, sweeping dark glazed tile roofs.
- **Red and gold** everywhere: festival **banners** with single bold kanji (武 道 祭 闘), red paper
  **lanterns**, a bronze **gong**, red-and-white vendor **parasols**, the **gate sign** 天下一武闘祭.
- **The stands**: terracotta brick walls, stone tiers packed with 500+ spectators (the crowd is
  [art/crowd/](../crowd/README.md), not this folder).
- **Nature and sky**: round shade trees, tiered pines and **palm trees**; a **bright saturated blue sky** with
  puffy white anime cumulus.

Every slot follows the same craft: hard-edged pixels, 2-5 tones per material, no noise, no dithering fills, no
blur or photo texture, no text except the kanji a banner, the sign or a lantern is made of, and a target
density of **64 px per world unit** so the whole set has one pixel size. Details per slot: [ASSETS.md](ASSETS.md).

Not in this folder: the crowd ([art/crowd/](../crowd/README.md)), the announcer and other side characters
(`art/npc/`), UI art ([art/ui/](../ui/README.md)), effects ([art/vfx/](../vfx/README.md)).

## Folder layout

```
art/stage/
  README.md  ASSETS.md  PROMPTS.md
  raw/<slot>_vNN.png            generator output, untouched (two-digit version, never overwritten or reused)
  raw/_fit/<slot>_vNN.png       fitted candidate: exact final size, seamless, ready for review
  raw/_fit/<slot>_vNN_2x2.png   2 x 2 tiling preview (tiling slots only), for review
  raw/_rejected/                rejected raws and their fits (ignored by every tool)
  final/<slot>.png              the approved image, exact size (Codex lead only)
```

The game never reads `art/`. `npm run sprites stage` ships the **approved** slots only (`approvedVersion` in the
manifest's `worldArt.stage` batches): it takes `final/<slot>.png`, else the approved version's
`review/<slot>_palette_vNN.png` or `raw/_fit/<slot>_vNN.png`, checks the exact size, keys cutouts to alpha 0/255 and
writes `public/stage/<slot>.png` + `public/stage/manifest.json` (`{ "slots": { "<slot>": { "file", "size", "kind",
"version" } } }`). `node tools/pack-sprites.mjs stage --candidates` packs the latest candidate of every slot into the
git-ignored `public/preview/stage/` instead; open the game with `?art=custom` to see them in the arena.
`raw/_fit/` is created on first use (the fit script makes it).

## How a slot flows

One slot per batch; the batch id is `stage-<slot>` (for example `stage-grass`).

**Worker (one Codex agent):**

1. **Claim:** `npm run queue -- claim --type stage --agent <name>`. It prints the batch, this folder's files and
   the output name. Only touch that slot's files.
2. **Read** the rules at the top of [ASSETS.md](ASSETS.md) and your slot's section (size, coverage, tiling,
   look, colors, what to attach).
3. **Name:** use the exact raw path `claim` printed, for example `art/stage/raw/grass_v01.png` (if unsure,
   `npm run queue -- next-file art/stage/raw/<slot>`). Its `_fit` files reuse that version number.
4. **Generate** with the slot's block in [PROMPTS.md](PROMPTS.md) (canvas size as stated there; attach the
   approved neighbors the section lists, never an unapproved candidate). Keep the attempt **outside the repo**
   for now (your scratch or temp folder, e.g. `<scratch>/grass_try.png`).
5. **Fit and QA the attempt in scratch** with the reference script (the command is in the slot's section):
   fit it to `<scratch>/grass_fit.png`, and for a tiling slot run `tile` on that fit. Check it against the
   checklist below. A failed attempt is deleted, is never saved in the repo and uses no version number
   (the [queue rule](../queue/README.md#worker-loop)); regenerate (up to 3 attempts, then keep the best and
   say so in the note).
6. **Save the keeper:** copy the untouched raw to the printed path (`art/stage/raw/<slot>_vNN.png`), then
   write its fit and (tiling slots) preview with the same version:
   `node <script> fit <raw> art/stage/raw/_fit/<slot>_vNN.png W H ...` and
   `node <script> tile art/stage/raw/_fit/<slot>_vNN.png art/stage/raw/_fit/<slot>_vNN_2x2.png`.
   These two derived files are the stage exception to "write only the printed paths" (see
   [art/queue/README.md](../queue/README.md#workers-never)). Workers never move files to `raw/_rejected/`
   except on their own redo batch, as the queue README says.
7. **Done:** `npm run queue -- done stage-<slot> --agent <name> --note "<what to look at>"`. Never commit and
   never edit shared files (`art/REVIEW.md`, `TRACKER.md`, manifests, `art/queue/sources.json`).

**Codex lead:**

1. Adds one `art/REVIEW.md` row per finished batch (links to the fit and its 2 x 2 preview).
2. **Never put an unapproved candidate in `final/`** (final = approved only; the packer copies it to
   `public/stage/`, where it could be committed). Review candidates from `raw/_fit/` (fit + 2 x 2 preview).
   To see unapproved fits in the arena: `node tools/pack-sprites.mjs stage --candidates`, then open the game
   with `?art=custom` (local only; `public/preview/` is never committed or deployed).
3. When the user approves: copy `raw/_fit/<slot>_vNN.png` to `final/<slot>.png`, set `approvedVersion` in the
   manifest (the packer ships approved slots only), run `npm run sprites stage`,
   update REVIEW / TRACKER, and commit with explicit paths only (`art/stage/...`,
   `public/stage/...`; never `git add -A`; retry on `index.lock`).
4. On a rejection: move the rejected raw, its fit, its preview and its `review/<slot>_palette_vNN.png` to `raw/_rejected/` (the queue README's
   [redo steps](../queue/README.md#rejections-and-redo)), then
   `npm run queue -- reopen stage-<slot> --note "<what to change>"`. The redo worker makes the next version
   (if a rejected file is still in `raw/`, it moves it first, per queue worker-loop step 3).

## QA checklist (every fit)

- [ ] **Exact size** from ASSETS.md (not just the aspect ratio).
- [ ] **Look:** reads as the slot at 1x zoom; colors near the slot's anchors; matches approved neighbors.
- [ ] **Pixels:** hard edges, no blur, no anti-aliased fringe, no noise or dithering fills, no JPEG-like
      speckle (the fit merges near-identical colors; re-generate if it still looks noisy).
- [ ] **Palette** within the slot's budget (`tile` prints the color count).
- [ ] **No text** except the slot's own kanji, checked character by character; no signature, no watermark,
      no logo.
- [ ] **Texture slots:** full-bleed and opaque; no border, frame or outline around the image edge; no
      vignette, no directional gradient across the image, no cast shadows.
- [ ] **Cutout and sprite slots:** alpha only 0 or 255, no magenta fringe, closed 1 px outline (sprites);
      trees stand on the bottom row, centered.
- [ ] **Seamless** where the slot tiles (next section).

## Seamless-texture QA

Most slots repeat many times (the grass tile 2,500 times), so any seam turns into a visible grid.

1. **Tile 2 x 2** with the script's `tile` command and look at the preview at 1x and zoomed in: no line, no
   brightness step and no broken pattern (a cut brick, a half slab, a stripe that jumps) where the copies meet
   in the middle cross. For a horizontal-only slot (`ringSide`, `lanternBu`, `lanternSai`, `parasol`), check
   only the vertical seam.
2. **Read the seam hint** the command prints: `wrap` is the average color jump across the wrap edge, `inner`
   the average jump between neighboring columns or rows inside the image. A `wrap` well above `inner` (about 2x
   or more) usually means a visible seam. It is a hint; the preview decides.
3. **Look for repetition** in a 3 x 3 preview (`tile ... 3`): one distinctive feature (a dark stone, a flower, a
   crack) turns into an obvious grid. Calm it down or remove it.
4. **Fixing a seam:** regenerate with the seamless wording first. Otherwise `offset` the fit (wrap-shift by half,
   so the seams cross in the middle), repair the cross (pixel editor, or attach the offset image to the image
   generator: "repair only the seams in the middle cross, keep everything else identical"), fit it again to the
   same size if the generator changed the size, then `offset` back.

## Fallback

The engine loads `public/stage/manifest.json` and replaces each listed slot with its image. A slot that is
not listed keeps its procedural painter silently (most slots start that way). A listed file that is missing
or unreadable also falls back to the painter, with one `[stage]` console line; the arena never breaks because
of art. To go back to the procedural version of a slot, clear its `approvedVersion` in the manifest (and delete
`final/<slot>.png`), then re-pack: the packer removes `public/stage/<slot>.png`.

## Reference fit script

Save the block below as `stage-fit.mjs` **outside the repository** (for example in your temp or scratch
folder) and run it **from the repo root**, so it finds `pngjs` in the repo's `node_modules`:

```
node "<scratch>/stage-fit.mjs" fit art/stage/raw/grass_v01.png art/stage/raw/_fit/grass_v01.png 256 256
```

The project path contains a space: quote paths. What the commands do:

| command | use |
|---|---|
| `fit <raw> <out> W H` | opaque texture: crops the non-magenta art area and mode-downscales it to exactly W x H |
| `fit ... --cutout` | the same, magenta becomes transparent (banners, parasol) |
| `fit ... --sprite bottom` / `center` | keeps the drawing's aspect, scales it to fit W x H, anchors it bottom-center / center (trees, clouds) |
| `fit ... --mirror` | the raw is the left half: fits it to W/2 x H and mirrors it into the right half (templeFacade) |
| `fit ... --crop x,y,w,h` | use this raw rectangle instead of the automatic crop |
| `slabs <raw> <out>` | ringTop: 4 x 4 slab sheet -> 18 x 18 slab ring top, 1152 x 1152, with the border band |
| `sky <raw> <out>` | sky: one flat color per row -> 16 x 512 |
| `tile <fit> <preview> [n]` | n x n preview (default 2) + seam hint + color count |
| `offset <in> <out>` | wrap-shift by half the size (seam repair); run it again to undo |

Mode-downscaling picks the most common color in each block (colors binned at 5 bits per channel), then gives
every pixel in a bin the same color, so flat areas stay flat and the palette stays small. It needs `pngjs`
(already a dev dependency) and Node 18+.

<details>
<summary>stage-fit.mjs (tested 2026-10-08 with Node 22 and pngjs 7)</summary>

```js
// stage-fit.mjs: reference fit + QA helper for art/stage (art/stage/README.md). Run it from the repo root
// (it loads pngjs from the repo's node_modules); keep the script itself outside the repo.
//   node stage-fit.mjs fit   <raw.png> <out.png> <W> <H> [--sprite bottom|center | --cutout | --mirror] [--crop x,y,w,h]
//        (default: opaque texture, the art area is stretched to exactly W x H; --cutout: same but magenta
//        becomes transparent; --sprite: keeps the drawing's aspect and anchors it; --mirror: left half -> both)
//   node stage-fit.mjs slabs <raw.png> <out.png>       ringTop: 4x4 slab sheet -> 1152 x 1152 ring top
//   node stage-fit.mjs sky   <raw.png> <out.png>       sky: one flat color per row -> 16 x 512 strip
//   node stage-fit.mjs tile  <fit.png> <preview.png> [n]  n x n tiling preview (default 2) + seam/color report
//   node stage-fit.mjs offset <in.png> <out.png>       wrap-shift by half (seam repair; run twice to undo)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const { PNG } = createRequire(process.cwd() + '/')('pngjs');

const read = (f) => PNG.sync.read(fs.readFileSync(f));
const write = (f, p) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, PNG.sync.write(p));
};
const isMagenta = (d, i) => d[i + 3] < 128 || (d[i] > 190 && d[i + 1] < 90 && d[i + 2] > 190);

// bounding box of everything that is not magenta / transparent
function bbox(src) {
  let x0 = src.width, y0 = src.height, x1 = -1, y1 = -1;
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) {
    if (isMagenta(src.data, (y * src.width + x) * 4)) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 < 0) throw new Error('image is all magenta');
  return [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
}

// Mode (majority) downscale of the src box [bx, by, bw, bh] to W x H. Colors are binned at 5 bits so
// generator noise doesn't split a flat area; the output is the mean of the winning bin. Magenta is
// "empty": sprites get alpha 0 where it wins, textures ignore it.
function modeScale(src, [bx, by, bw, bh], W, H, sprite) {
  const out = new PNG({ width: W, height: H });
  const d = src.data;
  for (let oy = 0; oy < H; oy++) for (let ox = 0; ox < W; ox++) {
    const sx0 = bx + Math.floor((ox * bw) / W), sx1 = Math.max(sx0 + 1, bx + Math.floor(((ox + 1) * bw) / W));
    const sy0 = by + Math.floor((oy * bh) / H), sy1 = Math.max(sy0 + 1, by + Math.floor(((oy + 1) * bh) / H));
    const bins = new Map();
    let empty = 0;
    for (let y = sy0; y < sy1; y++) for (let x = sx0; x < sx1; x++) {
      const i = (y * src.width + x) * 4;
      if (isMagenta(d, i)) { empty++; continue; }
      const k = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3);
      const b = bins.get(k) || [0, 0, 0, 0];
      b[0]++; b[1] += d[i]; b[2] += d[i + 1]; b[3] += d[i + 2];
      bins.set(k, b);
    }
    let best = null;
    for (const b of bins.values()) if (!best || b[0] > best[0]) best = b;
    const o = (oy * W + ox) * 4;
    if (!best || (sprite && empty > best[0])) continue; // stays 0,0,0,0
    out.data[o] = Math.round(best[1] / best[0]);
    out.data[o + 1] = Math.round(best[2] / best[0]);
    out.data[o + 2] = Math.round(best[3] / best[0]);
    out.data[o + 3] = 255;
  }
  // one color per bin across the whole image, so flat areas stay flat and the palette stays small
  const o = out.data, glob = new Map();
  const key = (i) => ((o[i] >> 3) << 10) | ((o[i + 1] >> 3) << 5) | (o[i + 2] >> 3);
  for (let i = 0; i < o.length; i += 4) {
    if (!o[i + 3]) continue;
    const g = glob.get(key(i)) || [0, 0, 0, 0];
    g[0]++; g[1] += o[i]; g[2] += o[i + 1]; g[3] += o[i + 2];
    glob.set(key(i), g);
  }
  for (let i = 0; i < o.length; i += 4) {
    if (!o[i + 3]) continue;
    const g = glob.get(key(i));
    o[i] = Math.round(g[1] / g[0]); o[i + 1] = Math.round(g[2] / g[0]); o[i + 2] = Math.round(g[3] / g[0]);
  }
  return out;
}

function fit(inFile, outFile, W, H, flags) {
  const src = read(inFile);
  const box = flags.crop || bbox(src);
  let out;
  if (flags.sprite) {
    // keep the drawing's aspect, scale it to fit inside W x H, anchor bottom-center or center
    const s = Math.min(W / box[2], H / box[3]);
    const w = Math.max(1, Math.round(box[2] * s)), h = Math.max(1, Math.round(box[3] * s));
    const fitted = modeScale(src, box, w, h, true);
    out = new PNG({ width: W, height: H });
    const dx = Math.floor((W - w) / 2), dy = flags.sprite === 'bottom' ? H - h : Math.floor((H - h) / 2);
    PNG.bitblt(fitted, out, 0, 0, w, h, dx, dy);
  } else if (flags.mirror) {
    // the raw is the LEFT half: fit it to W/2 x H, the right half is its mirror (templeFacade)
    const hw = W / 2, half = modeScale(src, box, hw, H, false);
    out = new PNG({ width: W, height: H });
    for (let y = 0; y < H; y++) for (let x = 0; x < hw; x++) {
      const s = (y * hw + x) * 4;
      for (const ox of [x, W - 1 - x]) half.data.copy(out.data, (y * W + ox) * 4, s, s + 4);
    }
  } else {
    out = modeScale(src, box, W, H, !!flags.cutout);
  }
  write(outFile, out);
  console.log(`fit ${inFile} [crop ${box.join(',')}] -> ${outFile} ${W}x${H}`);
}

// ringTop: the raw is a 4 x 4 sheet of slab variants (0-8 clean, 9-12 chipped, 13-15 cracked, row by
// row). Fit it to 256 x 256 (64 px slabs), lay 18 x 18 slabs with a seeded weighted pick (no slab next
// to its twin, damaged ones rarer) and draw the 5 px border band.
function slabs(inFile, outFile) {
  const src = read(inFile);
  const sheet = modeScale(src, bbox(src), 256, 256, false);
  const T = 64, N = 18, S = T * N;
  const out = new PNG({ width: S, height: S });
  let seed = 7;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const weight = (v) => (v < 9 ? 3 : v < 13 ? 1.5 : 0.6);
  let total = 0;
  for (let v = 0; v < 16; v++) total += weight(v);
  const pick = (avoid) => {
    for (;;) {
      let r = R() * total, v = 0;
      for (; v < 15; v++) { r -= weight(v); if (r <= 0) break; }
      if (!avoid.includes(v)) return v;
    }
  };
  const grid = [];
  for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
    const v = pick([tx ? grid[ty * N + tx - 1] : -1, ty ? grid[(ty - 1) * N + tx] : -1]);
    grid.push(v);
    PNG.bitblt(sheet, out, (v % 4) * T, Math.floor(v / 4) * T, T, T, tx * T, ty * T);
  }
  const line = (x, y, w, h, c) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
      const o = (j * S + i) * 4;
      out.data[o] = c[0]; out.data[o + 1] = c[1]; out.data[o + 2] = c[2]; out.data[o + 3] = 255;
    }
  };
  const ring = [[0x8f, 0x76, 0x63], [0xb8, 0x9c, 0x82], [0xb8, 0x9c, 0x82], [0xc8, 0xb0, 0x96], [0xa9, 0x90, 0x79]];
  ring.forEach((c, k) => {
    line(k, k, S - 2 * k, 1, c); line(k, S - 1 - k, S - 2 * k, 1, c);
    line(k, k, 1, S - 2 * k, c); line(S - 1 - k, k, 1, S - 2 * k, c);
  });
  write(outFile, out);
  console.log(`slabs ${inFile} -> ${outFile} ${S}x${S}`);
}

// sky: each output row = the mean color of the matching raw rows (magenta ignored), 16 px wide
function sky(inFile, outFile) {
  const src = read(inFile);
  const [bx, by, bw, bh] = bbox(src);
  const W = 16, H = 512, out = new PNG({ width: W, height: H });
  for (let oy = 0; oy < H; oy++) {
    const y0 = by + Math.floor((oy * bh) / H), y1 = Math.max(y0 + 1, by + Math.floor(((oy + 1) * bh) / H));
    const sum = [0, 0, 0];
    let n = 0;
    for (let y = y0; y < y1; y++) for (let x = bx; x < bx + bw; x++) {
      const i = (y * src.width + x) * 4;
      if (isMagenta(src.data, i)) continue;
      sum[0] += src.data[i]; sum[1] += src.data[i + 1]; sum[2] += src.data[i + 2]; n++;
    }
    for (let x = 0; x < W; x++) {
      const o = (oy * W + x) * 4;
      for (let c = 0; c < 3; c++) out.data[o + c] = Math.round(sum[c] / Math.max(1, n));
      out.data[o + 3] = 255;
    }
  }
  write(outFile, out);
  console.log(`sky ${inFile} -> ${outFile} ${W}x${H}`);
}

// n x n preview plus a seam hint: wrap = mean color jump across the wrap edge, inner = mean jump between
// neighbouring columns/rows inside the image. wrap well above inner usually means a visible seam.
function tile(inFile, outFile, n = 2) {
  const src = read(inFile), { width: W, height: H, data: d } = src;
  const out = new PNG({ width: W * n, height: H * n });
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) PNG.bitblt(src, out, 0, 0, W, H, i * W, j * H);
  write(outFile, out);
  const px = (x, y) => (y * W + x) * 4;
  const diff = (a, b) => Math.abs(d[a] - d[b]) + Math.abs(d[a + 1] - d[b + 1]) + Math.abs(d[a + 2] - d[b + 2]);
  const colJump = (x0, x1) => { let s = 0; for (let y = 0; y < H; y++) s += diff(px(x0, y), px(x1, y)); return s / H; };
  const rowJump = (y0, y1) => { let s = 0; for (let x = 0; x < W; x++) s += diff(px(x, y0), px(x, y1)); return s / W; };
  let ix = 0, iy = 0;
  for (let x = 0; x < W - 1; x++) ix += colJump(x, x + 1);
  for (let y = 0; y < H - 1; y++) iy += rowJump(y, y + 1);
  const colors = new Set();
  let clear = 0;
  for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 255) clear++; else colors.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]); }
  const f = (v) => v.toFixed(1);
  console.log(`tile ${inFile} ${W}x${H} -> ${outFile} (${n}x${n}); colors ${colors.size}; transparent px ${clear}`);
  console.log(`  left|right wrap ${f(colJump(W - 1, 0))} vs inner ${f(ix / (W - 1))}; top|bottom wrap ${f(rowJump(H - 1, 0))} vs inner ${f(iy / (H - 1))}`);
}

// wrap-shift by half the width and height: the tile's edges meet in a cross in the middle, where a
// seam is easy to see and repair; running it twice restores the original
function offset(inFile, outFile) {
  const src = read(inFile), { width: W, height: H } = src;
  const out = new PNG({ width: W, height: H });
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const s = (y * W + x) * 4, t = (((y + (H >> 1)) % H) * W + ((x + (W >> 1)) % W)) * 4;
    src.data.copy(out.data, t, s, s + 4);
  }
  write(outFile, out);
  console.log(`offset ${inFile} -> ${outFile}`);
}

const [cmd, a, b, ...rest] = process.argv.slice(2);
const flags = {};
const nums = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--sprite') flags.sprite = rest[++i];
  else if (rest[i] === '--mirror') flags.mirror = true;
  else if (rest[i] === '--cutout') flags.cutout = true;
  else if (rest[i] === '--crop') flags.crop = rest[++i].split(',').map(Number);
  else if (/^\d+$/.test(rest[i])) nums.push(Number(rest[i]));
}
if (cmd === 'fit') fit(a, b, nums[0], nums[1], flags);
else if (cmd === 'slabs') slabs(a, b);
else if (cmd === 'sky') sky(a, b);
else if (cmd === 'tile') tile(a, b, nums[0] || 2);
else if (cmd === 'offset') offset(a, b);
else console.log('usage: node stage-fit.mjs fit|slabs|sky|tile|offset ... (see the header)');
```

</details>
