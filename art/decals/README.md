# art/decals: ground damage (cracks, craters, scorches, scars, wall holes)

This folder holds the bitmap art for the **ground-damage decals**: the cracks, craters, burn marks and
scars a fight leaves on the ring, the grass, the invisible ki barrier and the stand walls. The engine
picks a decal by force and element: a light landing leaves a hairline `crack_s`, a strong ground bounce
a `crater_big`, a Kirin strike a `burn_lightning_big`, Hollow Purple an `erasure_trench`. Rules,
numbers and the engine side are in [ADR 0024](../../docs/decisions/0024-ground-damage-decals.md).

Today the game paints every decal procedurally (`src/art/decalPainter.js`). When custom art exists
here **and the user approved it** (`approvedVersion` in `art/manifest.json` -> `decals.items`, or a
`decal-<name>` batch in `worldArt.decal`), `npm run sprites decals` packs it into
`public/decals/atlas.json` + the PNG pages of its page set, and the game uses it for that name instead.
**Any name without approved art keeps its procedural version**, so decals can be replaced one at a
time. To see candidates in a match before approval: `node tools/pack-sprites.mjs decals --candidates`
(writes the git-ignored `public/preview/decals/`), then open the game with `?art=custom&debug` and run
`groundDemo()` in the console (every name and variant laid out on the ring).

Decals are **not** VFX: they have their own atlas, cells and pixel density. The old 3-variant VFX
`crater` (128 px cells) is superseded by the decal names below; see [`../vfx/EFFECTS.md`](../vfx/EFFECTS.md).

Who does what:

| Role | Job in this folder |
|---|---|
| **Codex** | Claims a `decal-<name>` batch (`npm run queue -- claim --type decal --agent <you>`), generates the images from `PROMPTS.md` with the approved style sheet attached, saves them as the next version, packs candidates, checks them in game, queues a `REVIEW.md` row, records the user's decision. |
| **User** | Approves the style sheet first, then each decal version in `../REVIEW.md` (approve / redo, in chat or in the table). |
| **Claude (Claude Code)** | Engine (`src/game/ground.js`, `src/art/decalPainter.js`), packer (`tools/pack-decals.mjs`), the contract below, new names. |

## Files

| File | What it is |
|---|---|
| `README.md` | This page: rules, folder layout, workflow, packing notes, QA. |
| [`DECALS.md`](DECALS.md) | The brief: common rules, palettes, the style sheet, and every decal name (cell, variants, images, look, what the game uses it for). |
| [`PROMPTS.md`](PROMPTS.md) | Paste-ready image prompts: the decal preamble, the style sheet, one prompt per name, fix-ups. |
| `reference/` | The style sheet: candidates `decal_style_sheet_vNN.png`, the approved one copied to `decal_style_sheet.png` and attached to every decal prompt. Never packed. |
| `raw/` | Generator output, versioned: `raw/<name>_vNN.png`, or **parts of one version** `raw/<name>_vNN_A.png`, `_B.png`, `_C.png` (the packer joins them in letter order; nobody stitches). Never overwritten or reused. |
| `raw/_rejected/` | Rejected candidates (names kept). Never packed. |
| `frames/<name>/` | Cleaned final cells written back by the packer: `frames/<name>/<name>_NN.png` at the exact cell size, plus a `.packer.json` marker. Hand touch-ups go here. |

## The decal contract (names are fixed: the engine looks them up)

`ppu` **64**: a 256 px cell is 4 world units, a 512 px cell 8 units (a fighter is about 1.6 units
tall). The engine scales each decal to the size the hit calls for, so a cell is the whole decal,
cracks included. Group = the style group; groups share PNG pages in **page sets**: the floor set
(`base` + `edge`, 2 pages, every match), `chakra` + `ki`, `lightning` + `fire`, and `cursed` (1 page
each). A match loads the floor pages plus one element set per fighter, so any pairing needs at most 4
pages, the engine's cap (`DECAL_PAGE_SETS` in `tools/pack-decals.mjs`).

| name | cell (px) | variants | group | mode | color rule |
|---|---|---|---|---|---|
| `crack_s` | 256 x 256 | 8 | base | flat | full color |
| `crack` | 256 x 256 | 8 | base | flat | full color |
| `crater` | 256 x 256 | 8 | base | flat | full color |
| `crater_big` | 512 x 512 | 6 | base | flat | full color |
| `crater_huge` | 512 x 512 | 4 | base | flat | full color |
| `fracture_ring` | 512 x 512 | 4 | base | flat | full color |
| `scuff` | 256 x 128 | 8 | base | flat, directional | full color |
| `skid` | 512 x 128 | 4 | base | flat, directional | full color |
| `rubble` | 256 x 256 | 6 | base | flat | full color |
| `dirt_crater` | 256 x 256 | 4 | edge | flat | full color |
| `dirt_skid` | 512 x 128 | 3 | edge | flat, directional | full color |
| `barrier_crack` | 256 x 256 | 6 | edge | wall | white only (tinted) |
| `crater_wall` | 512 x 512 | 4 | edge | wall | full color |
| `burn_lightning` | 256 x 256 | 6 | lightning | flat | full color + hot key |
| `burn_lightning_big` | 512 x 512 | 4 | lightning | flat | full color + hot key |
| `fracture_lightning` | 512 x 512 | 2 | lightning | flat | full color + hot key |
| `burn_fire` | 256 x 256 | 6 | fire | flat | full color + hot key |
| `burn_black` | 256 x 256 | 4 | fire | flat | full color |
| `scour_spiral` | 256 x 256 | 6 | chakra | flat | full color + hot key |
| `scour_spiral_big` | 512 x 512 | 3 | chakra | flat | full color + hot key |
| `cut_wind` | 256 x 256 | 6 | chakra | flat | full color + hot key |
| `claw` | 512 x 256 | 4 | chakra | flat, directional | full color + hot key |
| `scorch_chakra` | 512 x 512 | 3 | chakra | flat, directional | full color + hot key |
| `fracture_chakra` | 512 x 512 | 2 | chakra | flat | full color + hot key |
| `erasure` | 256 x 256 | 3 | cursed | flat | full color + hot key |
| `erasure_trench` | 512 x 256 | 3 | cursed | flat, directional, tiles along x | full color + hot key |
| `crush_implode` | 256 x 256 | 4 | cursed | flat | full color |
| `gouge_repel` | 512 x 256 | 4 | cursed | flat, directional | full color + hot key |
| `fracture_cursed` | 256 x 256 | 4 | cursed | flat | full color + hot key |
| `fracture_cursed_big` | 512 x 512 | 2 | cursed | flat | full color + hot key |
| `scorch_ki` | 256 x 256 | 4 | ki | flat | full color + hot key |

- **flat**: laid on the floor, seen straight from above, rotated freely by the engine.
- **wall**: shown face-on on a vertical surface (the barrier or a stand wall), never rotated.
- **directional**: drawn with the motion going **left to right**; the engine turns the cell along the
  real motion.
- **hot key**: pure **#FFFFFF** marks glowing hot seams. The engine makes those pixels glow in the
  fighter's tint, then cools them to soot. No other pixel may be pure white.
- **white only (tinted)**: `barrier_crack` is drawn in white and greys only; the engine multiplies the
  barrier color in and draws it additive.

## Hard rules (every decal)

Full wording in [`DECALS.md`](DECALS.md) -> Common rules. In short:

1. **Raw canvas 1536 x 1024 on flat #FF00FF**, the variants of one image in ONE row, left to right,
   with wide magenta gaps, nothing touching the border or another variant.
2. **Floor decals are straight top-down**, orthographic: no perspective, no bowl walls seen from the
   side. **Shading is radial only** (darker toward the pit, lighter rim tops), never a directional
   light: the engine rotates decals and lights them with the scene. Wall decals (`crater_wall`) may
   take light from above.
3. **No tile grid lines** inside a decal: the floor's own grid shows around it. Broken pieces are irregular.
4. **The outer ~10%** of each variant holds only thin crack tips and pebbles, so overlapping decals blend.
5. **Hard pixel art**: fully opaque or fully transparent pixels, no blur, no soft glow, no text, no
   shadow on the background, <= 24 colors per name.
6. **Hot key** as above. **Never magenta, hot pink, purple or violet** inside a decal (Gojo's and
   Amaterasu's purple comes from the runtime tint).
7. **Directional** decals keep the cell's proportions (2:1 or 4:1) with the motion left to right.

## Workflow (one decal)

1. **Style sheet first (once, gate).** Claim `decal-style_sheet`, generate it from `PROMPTS.md`
   section 1, save `reference/decal_style_sheet_vNN.png`, queue it in `../REVIEW.md` (area `decal`).
   When the user approves it, copy it to `reference/decal_style_sheet.png`. The queue hands out the
   other `decal-<name>` batches only once that file exists.
2. **Claim** `npm run queue -- claim --type decal --agent <you>`: it prints the batch, this folder's
   brief and prompts, and the next free version.
3. **Generate** each image of the name (preamble + the name's prompt + the style sheet attached).
   `DECALS.md` says how many images and how many variants per image.
4. **Save** them as one version: `raw/<name>_vNN.png` when one image holds every variant, else
   `raw/<name>_vNN_A.png`, `_B.png`, `_C.png` (same `NN`, letters in order). `npm run queue -- next-file
   art/decals/raw/<name>` prints the next free number (it counts parts and `_rejected/` too).
5. **Pack candidates**: `node tools/pack-sprites.mjs decals --candidates`. Read the report (variant
   count, colors, hot-key pixels, warnings). Fix-ups: `PROMPTS.md` section 3.
6. **Check in game**: `npm run dev`, open `/?fight=naruto,gojo&mode=solo&art=custom&debug`, run
   `groundDemo()` (and `groundDemo('<group>')`), take a screenshot. Check size next to a fighter, clean
   hard edges, no baked side light when rotated, hot seams glowing then cooling.
7. **Queue the review**: a `needs review` row in `../REVIEW.md` (area `decal`), `version` in
   `../manifest.json` -> `decals.items.<name>` with status `raw` (`--update-manifest` raises both), then
   `npm run queue -- done decal-<name> --agent <you>`.
8. **After the user approves**: set `approvedVersion` (in `decals.items.<name>` or on the
   `worldArt.decal` batch), status `approved`, then `npm run sprites decals` ships it into
   `public/decals/`. Rejected: move every image of that version to `raw/_rejected/` and generate the
   next version.

### Packing notes (tools/pack-decals.mjs)

- **Parts**: `<name>_vNN_A.png`, `_B.png` ... are one version; their variants are concatenated in
  letter order (A's left to right, then B's ...). A missing letter is warned. When both a whole
  `<name>_vNN.png` and parts exist, the whole image wins (warned).
- **Background**: flat magenta removed with the character rules (flood fill, enclosed holes, magenta
  fringe); alpha is binary. Only specks under 4 px are dropped, so small pebbles survive.
- **Split**: each image is split at the magenta gaps into its count from `DECALS.md` (part A gets the
  first image's count, B the second's ...; a single whole image gets every variant). Pieces beyond the
  count (a ring broken at its top and bottom, a detached chip) are joined by slot: the cuts go into the
  gaps nearest the image's even slot boundaries, so the brief's order holds (`crater_wall`: A = body
  holes, B = round holes). The report notes every join; an image that really holds more variants than
  the brief says needs `"parts": { "A": { "frames": N } }` in the sidecar. When the number of parts
  differs from the brief, each part is split at its gaps without a count (noted).
- **Scale**: one scale per image: its largest variant fills **97%** of the cell, the other variants of
  that image keep their size relative to it. Each variant is centered in its cell. Downscaling keeps the
  palette (mode sampling); upscaling is noted (draw fewer variants per image for more detail).
  **Tiling** (`erasure_trench`, `tile` in the contract): the engine repeats one variant along a path, so
  every variant is stretched on its own to the full cell width (the height keeps the image's 97% scale).
  A variant that does not reach both cell ends (e.g. a hand-edited frame) is warned; ends with different
  profiles (the seam shows) and a stretch over 10% are noted.
- **Colors**: <= 24 per name (median cut over all its variants). Hot-key names: every near-white pixel
  (all channels >= 250) snaps to #FFFFFF and the hot key is kept out of the color cut, so it survives
  exactly. Other names: near-white is toned down to #F6F6F6 so nothing glows by accident. The tinted
  `barrier_crack` is converted to greyscale (warned when drawn in color). Magenta/pink/purple pixels
  and a hot-key name without any #FFFFFF are warned.
- **Pages**: one PNG per page set (`decals_<set>.png`, or `decals_<set>_1.png`, `_2.png` when a set
  needs more than one: the floor set is `decals_base_1.png` + `_2.png`), each at most 2048 x 2048,
  biggest cells first, each at the first free 128 px spot in reading order, cells edge to edge, a name
  never split across pages. Page sizes are the used extent (also in `pageSizes`). With all 31 names
  approved: base 2048 x 2048 + 2048 x 1920, chakra 2048 x 1792, lightning 2048 x 1280, cursed 2048 x 1280.
- **Page budget**: the report prints the pages per match (floor pages + the two biggest element sets)
  against the engine's cap of 4, and warns when a pairing would need more (the engine would then drop
  pages and keep that approved art procedural).
- **Output** `public/decals/atlas.json`:
  `{ "ppu": 64, "source": "approved"|"candidates", "packer": 2, "pages": ["decals_base_1.png", ...], "pageSizes": [[w, h], ...],
  "decals": { "<name>": { "page": i, "w": 256, "h": 256, "frames": [[x, y], ...], "mode": "flat"|"wall", "tinted": false, "group": "base",
  "directional": true, "hotKey": true, "tile": true, "version": 1 } } }` (`frames` = top-left of each variant cell on its page;
  `directional`, `hotKey` and `tile` only when true).
- **Write-back**: cleaned cells go to `frames/<name>/<name>_NN.png` with a `.packer.json` marker, exactly
  like VFX: untouched frames are re-imported when a new version (or sidecar) appears, hand-edited frames
  win (warned), frames whose raw was rejected stop shipping. A `frames/<name>/` file of exactly the cell
  size is used as drawn.
- **Sidecar** `raw/<name>.json` (every version) or `raw/<name>_vNN.json` (that version):
  `{ "tolerance": 90, "drop": [3], "frames": 3, "split": "even", "parts": { "B": { "frames": 2, "split": "even" } } }`
  (`drop` = indices into the joined variant list; `frames` / `split` for a single image, `parts.<letter>`
  for one part).
- If this page and the code disagree, the code is the truth: update this page.

## QA checklist (per decal)

- [ ] Right number of variants per image, one row, wide magenta gaps, nothing touching the border.
- [ ] Straight top-down (floor decals): no perspective, no visible bowl walls, no directional light.
- [ ] No tile grid inside the decal; the outer ~10% is only crack tips and pebbles.
- [ ] Hard pixels, no blur or glow haze, no magenta/pink/purple, no pink fringe after packing.
- [ ] Hot-key names: the report shows hot px > 0; only the seams the brief names are white.
- [ ] Directional names: motion left to right, the cell's proportions (2:1, 4:1).
- [ ] `erasure_trench`: the left and right ends continue each other when two cells sit side by side.
- [ ] In game (`groundDemo()`): the size reads right next to a fighter, variants look different from
      each other, nothing looks lit from one side when rotated.

## Adding a new decal name

New names need engine support (the engine looks names up and picks them by style): open a task in
`docs/TASKS.md` (owner Claude). Claude adds the name to `DECAL_SPECS` in `tools/pack-decals.mjs`, the
procedural painter (`src/art/decalPainter.js`), the style table in `src/game/ground.js`, the manifest
`decals.items` entry, `art/queue/sources.json`, and its brief and prompt here. Until then, art made
ahead of time waits in `raw/_proposed/` (never read by the packer).
