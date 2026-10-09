# Stage slots: what the engine paints, and what replaces it

Every texture and billboard the engine paints for the tournament grounds today is a **slot**. Each slot
can be replaced by `public/stage/<slot>.png` (packed from `art/stage/final/<slot>.png`); a slot without an
image keeps its procedural painter. This file lists all **30 slots** with their size, tiling and world
coverage, read from the code on 2026-10-08:

- painters: `src/art/textures.js` (`ringTopTexture`, `grassTexture`, ..., `treeCanvas`, `cloudCanvas`)
- placement and repeat counts: `buildArena()` in `src/world/arena.js`
- spec: [ADR 0008](../../docs/decisions/0008-world-art-and-parallel-production.md) (it wins over this file)

Workflow, QA and the fit script: [README.md](README.md). Paste-ready prompts: [PROMPTS.md](PROMPTS.md).
A worker who claimed `stage-<slot>` needs the **rules below** plus that slot's section.

## Rules for every slot

**Size and density.** The engine maps the image onto the same geometry and repeat count as the procedural
texture, so the **world coverage never depends on the image size**; the pixel size only sets the detail.
Target density is **64 px per world unit** on the slot's main use (the upper end of ADR 0008's 32-64),
rounded to a size that keeps the pattern whole. That is 4x the procedural resolution for most slots, 2.67x
for the ring (its painter already uses 24 px per unit) and more for the parasol and lanterns (painted at
under 16 px per unit). One exception: the temple facade uses about 55 px per unit so it never needs an
upscale. The final size in each section is **exact**: same width, same height, never just the same aspect
ratio.

**Two kinds of slot.**

| kind | slots | image | rules |
|---|---|---|---|
| texture | everything except the ones below | opaque, full-bleed | covers the whole canvas edge to edge; no border, frame or outline around the image edge; seamless where the section says so |
| cutout / sprite | banners, parasol, trees, clouds | RGBA, alpha only 0 or 255 | the engine uses alpha-test 0.5, so no soft or semi-transparent edges; raw background is flat magenta `#FF00FF`; sprites (trees, clouds) get a closed 1 px dark outline |

**Light.** The engine lights every surface (sun from the upper left-front, blue sky fill, dimmed during
supers). Textures carry only local form: bevels, grout and mortar joints, plank edges, a light top-left edge
on each stone. No global gradient across the image, no vignette, no cast shadows from things outside the
tile, no ground shadows under sprites.

**Camera.** The fight camera sits on the gate side looking at the temple, about 25 degrees down, 11-21
units from the fighters. Floors (ring, grass, paths, tier tops) are seen squashed about 2x front to back,
so avoid thin 1 px horizontal lines and fine stripes on them (they shimmer). In fights you see the ring, the
stands, the temple platform and steps; the temple facade, roofs, banners, sky, clouds and trees show in the
intro, orbit and wide shots.

**Orientation.**

| surface | image top is | image left is |
|---|---|---|
| ring top, grass, paths (ground planes) | toward the temple (world -z, the back of the arena in fights) | world -x (screen-left in fights) |
| walls, risers, facade, banners, sign | up | the left end of the wall as you face it |
| roof slopes | the ridge (top of the slope) | along the roof |
| lanterns, parasol (wrapped around a cylinder or cone) | the top of the lantern / the parasol tip | the image wraps: x = 0 and the right edge meet at the front (facing the gate, +z) |
| gong | the top of the disc, seen face-on | - |
| trees, clouds (camera-facing billboards) | up | - |

**Style.** Hard-edged hi-res pixel art matching the fighters: 1990s-anime tournament background art turned
into crisp pixels, bright and sunny, cel-shaded, 2-5 tones per material, no noise, no dithering fills, no
photo texture, no blur. **No text**, except the kanji the banners, sign and lanterns are made of. Palette
budgets per slot are below (the fit step merges near-identical colors; `tile` reports the count).

**Look anchors.** The procedural painters' hex colors are listed per slot so the set stays coherent and
matches the scene lighting. Small shifts are fine; a hue change is an art-direction decision (two are made
on purpose below: red-lacquer pillars and a palm tree).

## All slots

P = priority: **1** seen in every fight shot, **2** intro / orbit / wide shots, **3** rarely seen up close.

| slot | what | P | procedural | final | seamless | kind | palette |
|---|---|---|---|---|---|---|---|
| `ringTop` | ring fighting surface | 1 | 432 x 432 | **1152 x 1152** | none (one image) | texture | <= 32 |
| `ringSide` | ring sides + base lip | 1 | 96 x 16 | **256 x 40** | horizontal | texture | <= 16 |
| `grass` | ground everywhere | 1 | 64 x 64 | **256 x 256** | both | texture | <= 16 |
| `steps` | stand tier tops, temple steps, aisles | 1 | 16 x 16 | **64 x 64** | both | texture | <= 12 |
| `stoneBase` | temple platform, wall base, tier risers | 1 | 32 x 16 | **128 x 64** | both | texture | <= 16 |
| `brick` | low front walls of the stands | 1 | 32 x 16 | **128 x 64** | both | texture | <= 16 |
| `path` | flagstone paths | 1 | 32 x 32 | **128 x 128** | both | texture | <= 16 |
| `templeFacade` | temple front wall | 2 | 448 x 112 | **1536 x 384** | none | texture | <= 32 |
| `roof` | temple roof, awning, wall caps, gate roof | 2 | 16 x 16 | **128 x 80** | both | texture | <= 16 |
| `bannerBu` | red banner 武 | 2 | 16 x 48 | **64 x 192** | none | cutout | <= 12 |
| `bannerDo` | blue banner 道 | 2 | 16 x 48 | **64 x 192** | none | cutout | <= 12 |
| `bannerSai` | blue banner 祭 | 2 | 16 x 48 | **64 x 192** | none | cutout | <= 12 |
| `bannerTo` | red banner 闘 | 2 | 16 x 48 | **64 x 192** | none | cutout | <= 12 |
| `plaster` | white walls (temple, compound) | 2 | 32 x 32 | **128 x 128** | both | texture | <= 8 |
| `sky` | sky dome | 2 | 4 x 128 | **16 x 512** | horizontal (flat rows) | texture | <= 16 |
| `cloudA` | cloud billboard | 2 | 64 x 24 | **256 x 96** | none | sprite | <= 6 |
| `cloudB` | cloud billboard | 2 | 64 x 24 | **256 x 96** | none | sprite | <= 6 |
| `cloudC` | cloud billboard | 2 | 64 x 24 | **256 x 96** | none | sprite | <= 6 |
| `gong` | bronze gong disc | 2 | 32 x 32 | **128 x 128** | none | texture | <= 12 |
| `parasol` | vendor parasol canopy | 2 | 32 x 8 | **256 x 96** | horizontal | cutout | <= 12 |
| `woodDark` | dark beams, posts, frames | 2 | 16 x 32 | **64 x 128** | both | texture | <= 12 |
| `treeRoundA` | broadleaf tree | 3 | 48 x 64 | **192 x 256** | none | sprite | <= 24 |
| `treeRoundB` | umbrella tree | 3 | 48 x 64 | **192 x 256** | none | sprite | <= 24 |
| `treePine` | tiered pine | 3 | 48 x 64 | **192 x 256** | none | sprite | <= 24 |
| `treePalm` | coconut palm | 3 | 48 x 64 (round tree today) | **192 x 256** | none | sprite | <= 24 |
| `sign` | gate name board 天下一武闘祭 | 3 | 112 x 28 | **288 x 72** | none | texture | <= 16 |
| `lanternBu` | gate lantern 武 | 3 | 32 x 16 | **128 x 64** | horizontal | texture | <= 12 |
| `lanternSai` | gate lantern 祭 | 3 | 32 x 16 | **128 x 64** | horizontal | texture | <= 12 |
| `woodPillar` | gate pillars | 3 | 16 x 32 | **64 x 128** | both | texture | <= 12 |
| `wood` | parasol table tops | 3 | 16 x 32 | **64 x 128** | both | texture | <= 12 |

Slot ids are case-sensitive and are also the file names (`raw/<slot>_vNN.png`, `final/<slot>.png`) and the
queue batch ids (`stage-<slot>`).

**Generate / fit** in each section: the generator canvas (1024 x 1024, 1536 x 1024 or 1024 x 1536), the art
area on it, and the fit command of the reference script in [README.md](README.md#reference-fit-script).
Asking the generator for an art-pixel grid ("pixel art on a 128 x 64 grid, every art pixel a 12 x 12
block") makes the downscale clean.

---

## Ring

### `ringTop`

- **What / where:** the fighting surface: the top of the ring box, 18 x 18 units at height 0.6, centered on
  the origin. On screen in every fight, usually filling the lower half of the frame.
- **Procedural:** `ringTopTexture(18, 24)`: 432 x 432 px, one 24 px stone tile per world unit, grout lines,
  bevels, chip marks, a few long cracks, a 2 px border band. Mapped once (no repeat, clamped).
- **Coverage:** the whole image = the whole 18 x 18 ring top. 1 slab = 1 x 1 unit.
- **Final:** **1152 x 1152** (64 px per unit, 18 x 18 slabs of 64 px). Not tiled.
- **Generate / fit:** a **slab sheet**, not the whole ring (one generated image cannot hold 1152 px of real
  detail). 1024 x 1024: a 4 x 4 grid of 16 square slabs, each 256 x 256 px, edge to edge, no gaps or
  margins. Order, row by row: 9 clean slabs (#0-8), 4 chipped or scuffed (#9-12), 3 cracked (#13-15). Each
  slab has a thin grout edge on all four sides (two neighbours make one 2 px joint after the fit) and a soft
  bevel (light top and left edge, darker bottom and right edge). Fit: `slabs raw out` composes 18 x 18 slabs
  (seeded, no slab next to its twin, damaged ones rarer) and draws the 5 px border band.
- **Look:** a big square tournament stage of **pale cream-white stone slabs**, sun-bleached and clean, with
  small tone differences per slab, warm grey-brown grout, a few chips at the corners, scuffs, hairline cracks
  on a few slabs, maybe one repaired slab. Fights smash it, but big craters are VFX, never painted.
- **Anchors:** slabs `#eadbc6` `#e4d2bb` `#ddc9b0` `#d6c0a6` `#cfb79c` `#e9dfcf`, light edge about `#f3eadb`,
  rare darker slab `#bfa489`, grout `#a99079`, chips and cracks `#9c8370` `#8f7663`, border band `#b89c82`.
- **Attach:** nothing (this slot is the style anchor for the other stone slots).

### `ringSide`

- **What / where:** the four vertical sides of the ring (18 x 0.6 units each) and the plinth ("lip") around
  its base (18.7 x 0.18 units, plus a 0.35-unit strip around the ring on the ground).
- **Procedural:** `ringSideTexture()`: 96 x 16 px, two staggered courses of cut stone blocks.
- **Coverage:** ring sides: repeat 4.5 x 1, so one image = **4 x 0.6 units**. Lip: repeat 6 x 0.3, so the lip
  shows only the **bottom 30 % of the image** (rows 28-39), stretched; the lip top stretches those rows over
  its strip.
- **Final:** **256 x 40**, seamless **horizontally** (left edge continues into the right edge). The top and
  bottom edges do not tile.
- **Generate / fit:** 1536 x 1024, a full-width strip 1536 x 240 centered vertically, magenta above and
  below (art pixel = 6 x 6 block). Fit: `fit raw out 256 40`.
- **Look:** rows 0-3: a lighter coping edge (the slab edges seen from the side); rows 4-27: two courses of
  rectangular cut stone blocks about 40 px wide, staggered by half a block, slightly darker and greyer than
  the ring top; rows 28-39: a plain darker plinth course with few joints (it becomes the lip).
- **Anchors:** blocks `#c7b4a1` `#bba795` `#b09c8a` `#c1ad99`, joints `#b6a290` and darker, coping about
  `#d8c6b0`.
- **Attach:** `final/ringTop.png` if approved.

## Ground

### `grass`

- **What / where:** the ground plane under everything, 200 x 200 units.
- **Procedural:** `grassTexture()`: 64 x 64 px, two mowing stripes (left half darker), speckles, tufts.
- **Coverage:** repeat 50 x 50, one image = **4 x 4 units**. Image top = toward the temple, so the stripes run
  away from the fight camera, like a mowed stadium lawn.
- **Final:** **256 x 256**, seamless **both ways**.
- **Generate / fit:** 1024 x 1024, full-bleed (art pixel = 4 x 4 block). Fit: `fit raw out 256 256`.
- **Look:** short, bright, well-kept tropical lawn. Two mowing stripes per tile, each 128 px wide: x 0-127
  slightly darker, x 128-255 slightly lighter. Small blade clusters and a few tiny clover dots, evenly spread.
  No flowers, stones, dirt patches or anything distinctive: the tile repeats 2,500 times and any feature
  becomes a visible grid.
- **Anchors:** stripes `#3c9846` / `#46a64e`, light blades `#55b75c` `#4aa952`, dark blades `#3a9443`
  `#33873c`, tuft shadow `#2f7f38`, tips `#64c46a`.

### `path`

- **What / where:** three flagstone paths, 4 units wide: temple to ring (12 long), ring to gate (32 long),
  outside the gate (20 long). Just above the grass.
- **Procedural:** `pathTexture()`: 32 x 32 px, 2 x 2 square slabs with grout.
- **Coverage:** repeat 2 across the width and len / 2 along, one image = **2 x 2 units** (2 x 2 slabs of 1
  unit).
- **Final:** **128 x 128**, seamless **both ways**.
- **Generate / fit:** 1024 x 1024, full-bleed (art pixel = 8 x 8 block). Fit: `fit raw out 128 128`.
- **Look:** pale cream-grey flagstones, 2 x 2 large slabs per tile (about 64 px each, edges may be slightly
  irregular as long as the tile stays seamless), 2 px grey grout, gentle tone variation, a chip or two.
  Lighter and greyer than the ring so the ring stays the hero.
- **Anchors:** slabs `#e3ddd2` `#dbd4c7` `#d4ccbe` `#e7e2d8`, grout `#b5ab9c`.
- **Attach:** `final/ringTop.png` if approved.

## Temple and walls

### `templeFacade`

- **What / where:** the front wall of the temple behind the far side of the ring (28 x 7 units, from height
  0.9 to 7.9, at z -21). The banners hang in front of it; the steps (6 wide) sit in front of its doors; the
  awning roof juts out over its middle beam.
- **Procedural:** `templeFacadeTexture()`: 448 x 112 px (16 px per unit): beams, a balcony railing, 9 lattice
  windows, 9 pillars, shoji panels and big studded double doors in the middle. Mapped once.
- **Coverage:** the whole image = the whole 28 x 7 front.
- **Final:** **1536 x 384** (about 55 px per unit, the one slot below 64: one generated image per half at
  exactly 2 x 2 art pixels; 64 px per unit would need an upscale). Not tiled.
- **Generate / fit:** generate the **left half** only (14 x 7 units, ending exactly on the center line where
  the two door leaves meet): 1536 x 1024 with the facade in a 1536 x 768 band, magenta above and below, art
  pixel = 2 x 2. Fit: `fit raw out 1536 384 --mirror` (fits the half to 768 x 384 and mirrors it into the
  right half; the door split is the seam). A temple front is symmetric and the engine lights it, so the mirror
  does not show.
- **Layout (px in the final 1536 x 384 image; y from the top):**
  - 8 equal bays of 192 px separated by pillars at x 0, 192, 384, ..., 1536 (half a pillar at each edge).
  - y 0-20: top beam. y 20-123: upper floor, a lattice window in each bay. y 123-157: balcony railing across
    the whole width. y 157-180: middle beam. y 180-357: lower floor, a shoji panel in each side bay.
    y 357-384: bottom beam / sill.
  - The two center bays (x 576-960): **big double doors** on the lower floor, dark wood planks, rows of gold
    studs, the leaves meeting at x 768.
  - The banners hang over about x 162-222, 381-441, 1095-1155 and 1314-1374 at y 44-219: keep those areas
    simple (pillars and plaster, no key detail).
- **Look:** a Chinese-style temple front for a martial-arts tournament: warm white plaster, **red-lacquer
  pillars** (upgrade over the brown painter, to match the gate and the red/gold theme), dark brown beams and
  railing, pale paper lattice windows and shoji, heavy dark doors with gold studs. Clean and grand, not
  ruined.
- **Anchors:** plaster `#f1e8d6`, pillars red lacquer about `#b23a2a` / shadow `#7e2419` / light `#d0563e`,
  beams `#8a5a34` / `#5e3a22` / `#a87446`, lattice `#e8dcc2` with `#b89870` bars, shoji `#efe6d2` with
  `#c4a47c` frames, doors `#6e4428` `#82522f` `#4a2c1a`, studs `#d6b85a`.
- **Attach:** `final/woodPillar.png`, `final/plaster.png`, `final/roof.png` if approved.

### `plaster`

- **What / where:** the temple's side, back and top faces (28 x 7 x 6 box) and the middle band (2.1 tall) of
  the outer compound walls (62 long on each side, 50 at the back, 21.4 either side of the gate).
- **Procedural:** `plasterTexture()`: 32 x 32 px, warm white with faint speckle.
- **Coverage:** walls: repeat len / 2 x 1, one image = **2 x 2.1 units**. Temple sides: repeat 3 x 3 (2 x
  2.33). Temple top: repeat 14 x 3 (2 x 2).
- **Final:** **128 x 128**, seamless **both ways**.
- **Generate / fit:** 1024 x 1024, full-bleed (art pixel = 8 x 8). Fit: `fit raw out 128 128`.
- **Look:** smooth warm-white lime plaster, very subtle mottling, two or three faint hairline cracks, low
  contrast. It covers about 300 square units of wall: nothing that catches the eye.
- **Anchors:** `#f2ead9` base, `#ebe1cd` and `#f8f2e6` for the mottling.

### `stoneBase`

- **What / where:** the temple platform (32 x 0.9 x 8), the bottom band (0.9 tall) of the outer walls, and the
  risers and end faces of the stand tiers (6 tiers per stand).
- **Procedural:** `stoneBaseTexture()`: 32 x 16 px, two staggered courses of ashlar blocks.
- **Coverage:** main use (temple platform front, outer wall base): repeat len / 2 x 1, one image = **2 x 0.9
  units**. Front-stand risers: 1 x 1 unit per image. (Some faces are stretched today; see Engine notes.)
- **Final:** **128 x 64**, seamless **both ways** (two courses, the second offset by half a block, so the
  stagger continues across the wrap).
- **Generate / fit:** 1536 x 1024, a 1536 x 768 band centered (art pixel = 12 x 12). Fit:
  `fit raw out 128 64`.
- **Look:** rough-cut ashlar blocks in two courses of 32 px, blocks about 48 px wide, warm grey-beige, 2-3 px
  darker mortar, a light top edge on each block, a few weathered corners.
- **Anchors:** blocks `#c9b9a9` `#bcab9a` `#d2c2b2` `#b3a190`, mortar `#9b8c80`.
- **Attach:** `final/ringSide.png` if approved.

### `roof`

- **What / where:** the temple's gable roof (two slopes 30.4 x 5.05 and the ridge beam), the awning over the
  temple's lower floor, the caps on top of the outer walls and the gate's small roof.
- **Procedural:** `roofTexture('#5e4436')`: 16 x 16 px, horizontal tile courses and vertical joints.
- **Coverage:** temple slopes: repeat 16 x 4, one image = **1.9 x 1.26 units** (image top = ridge, bottom =
  eave). Gate roof: 1.6 x 0.83. Awning: 1.79 x 0.44. Caps on the back and gate walls: 0.54-1.26 x 1.3 (the
  side walls' caps are mapped wrong today, see Engine notes).
- **Final:** **128 x 80**, seamless **both ways** (it repeats 4 times down each slope).
- **Generate / fit:** 1536 x 1024, a 1536 x 960 band centered (art pixel = 12 x 12). Fit:
  `fit raw out 128 80`.
- **Look:** glazed Chinese barrel-tile roofing seen from above the slope: 8 columns of half-round barrel tiles
  (16 px each) running from the ridge down to the eave (vertical in the image), with a light top and a dark
  gutter between columns, and 4 overlap lines across (every 20 px). Deep warm brown-charcoal glaze with a
  slight sheen on the tile tops. No eave end-caps (the tile repeats).
- **Anchors:** base `#5e4436`, tops `#7a5a48`, gutters `#3e2c24`, sheen `#8c6e5a`.

## Stands

### `brick`

- **What / where:** the low front walls (1.25 tall) of the four stands: two 26 long along the ring's sides,
  two about 9.2 long either side of the entrance path.
- **Procedural:** `brickTexture()`: 32 x 16 px, 4 courses of running-bond bricks.
- **Coverage:** repeat len / 2 x 1, one image = **2 x 1.25 units**.
- **Final:** **128 x 64**, seamless **both ways** (4 courses, alternate courses offset by half a brick).
- **Generate / fit:** 1536 x 1024, a 1536 x 768 band centered (art pixel = 12 x 12). Fit:
  `fit raw out 128 64`.
- **Look:** warm terracotta bricks, 32 x 16 px each including a 2 px mortar joint, running bond, a light top
  edge per brick, mild tone variation, a few worn bricks.
- **Anchors:** bricks `#c08a76` `#b57d6a` `#c99a86` `#ad7462` `#c4a08e`, mortar `#8f7466`.

### `steps`

- **What / where:** the top of every stand tier (where the crowd stands), the temple's three front steps and
  the stands' aisle stairs.
- **Procedural:** `stepsTexture()`: 16 x 16 px, 4 pale stone courses with a light edge and a dark joint.
- **Coverage:** tier tops: about **1 x 1.25 units** per image (1.25 x 1 on the side stands). Temple steps: 2
  x 0.7 on the treads, 2 x step height on the risers. Aisle stairs: 3.75 x 1.
- **Final:** **64 x 64**, seamless **both ways**.
- **Generate / fit:** 1024 x 1024, full-bleed (art pixel = 16 x 16). Fit: `fit raw out 64 64`.
- **Look:** pale worn stone bench slabs: 4 horizontal courses of 16 px, each with a 2 px lighter front edge on
  top and a 2 px dark joint at the bottom, slight tone variation, worn smooth by thousands of spectators.
- **Anchors:** `#d9d2c6` base, edge `#eee8de`, joint `#a99f92`.

## Wood

The painter `woodTexture(base)` makes three tints of the same 16 x 32 plank texture; each tint is its own
slot. Wood is mapped **one image per box face**, stretched to the face (repeat 1 x 1; the gate pillars use 1
x 3), so the pattern must survive stretching: even, low-contrast grain, no knots or features.

### `woodDark`

- **What / where:** the gong frame (posts 0.25 x 2.8, crossbar 2.7), the gate lintels (8.6 and 7.4 long),
  the beams on top of the outer walls, the lantern caps and hangers, the parasol poles and table legs.
- **Procedural:** `woodTexture('#6e4a2e')`: 16 x 32 px, vertical planks every 4 px with grain.
- **Coverage:** one image per face (posts: about 0.25 x 2.8; beams: stretched along their length).
- **Final:** **64 x 128**, seamless **both ways**.
- **Generate / fit:** 1024 x 1536, a 768 x 1536 band centered (art pixel = 12 x 12). Fit:
  `fit raw out 64 128`.
- **Look:** dark stained hardwood, 4 vertical boards of 16 px, fine vertical grain, a slightly darker joint
  between boards, a satin sheen line. Even and calm.
- **Anchors:** `#6e4a2e` base, `#4e3220` joints, `#82593a` sheen.

### `woodPillar`

- **What / where:** the two gate pillars (0.7 x 5.4 x 0.7) at the arena entrance.
- **Procedural:** `woodTexture('#8a5634')` with repeat 1 x 3.
- **Coverage:** one image = **0.7 x 1.8 units** of each pillar face, 3 times up the pillar.
- **Final:** **64 x 128**, seamless **both ways** (it repeats up the pillar and wraps around its corners).
- **Generate / fit:** 1024 x 1536, a 768 x 1536 band centered (art pixel = 12 x 12). Fit:
  `fit raw out 64 128`.
- **Look:** **red-lacquered wood** (upgrade over the brown painter: the classic Chinese gate pillar), smooth
  lacquer with a soft vertical sheen, faint vertical grain, a few tiny worn spots where dark wood shows. No
  horizontal bands (they would repeat 3 times).
- **Anchors:** lacquer `#b23a2a`, shadow `#7e2419`, light `#d0563e`, worn wood `#5e3a22`.

### `wood`

- **What / where:** only the table tops under the two vendor parasols (1.9 x 0.12 x 0.9).
- **Procedural:** `woodTexture()` (default `#9a6a3e`).
- **Coverage:** one image per face.
- **Final:** **64 x 128**, seamless **both ways**.
- **Generate / fit:** as `woodDark`. Fit: `fit raw out 64 128`.
- **Look:** medium honey-brown planks, 4 vertical boards, fine grain, a light worn edge.
- **Anchors:** `#9a6a3e` base, `#7a4e2c` joints, `#b0804e` light.

## Decorations

### `bannerBu`, `bannerDo`, `bannerSai`, `bannerTo`

- **What / where:** four cloth banners hanging on the temple front at x -10.5, -6.5, 6.5 and 10.5, each 1.1 x
  3.2 units, centered 5.5 high. Double-sided (the back is never seen).
- **Procedural:** `bannerTexture(bg, fg, glyph)`: 16 x 48 px: cloth color, darker side hems, a gold top band,
  one kanji in the upper part, a small swallowtail notch cut out at the bottom center (transparent).
- **Coverage:** the whole image = the whole banner (1.1 x 3.2 units). Not tiled.
- **Final:** **64 x 192**, cutout (the notch and anything outside the cloth is transparent).
- **Variants:**

| slot | position (left to right) | cloth | glyph color | kanji | meaning |
|---|---|---|---|---|---|
| `bannerBu` | 1st (x -10.5) | red `#c8323c` | cream `#fff0d0` | 武 | martial |
| `bannerDo` | 2nd (x -6.5) | blue `#2a4a8a` | white `#f4f4ff` | 道 | the way |
| `bannerSai` | 3rd (x 6.5) | blue `#2a4a8a` | white `#f4f4ff` | 祭 | festival |
| `bannerTo` | 4th (x 10.5) | red `#c8323c` | cream `#fff0d0` | 闘 | fight |

- **Generate / fit:** 1024 x 1536, the banner filling a 512 x 1536 band centered (top edge at the top of the
  image, notch tip near the bottom), magenta left and right and inside the notch (art pixel = 8 x 8). Fit:
  `fit raw out 64 192 --cutout` (stretches the banner to exactly 64 x 192, magenta becomes transparent).
- **Look:** heavy festival cloth: a gold `#d8b04a` top band about 8 px (the hanging rod), the cloth color with
  2-3 px darker hems down both long sides and a 1 px lighter fold line, the kanji large and bold (about 40-44 px
  tall), centered horizontally with its center about 30 % down from the top, a swallowtail notch at the bottom
  center (about 20 px wide at the bottom edge, about 20 px deep). Hard pixel edges.
- **Kanji check:** the generator often garbles CJK. Compare the glyph stroke by stroke with the table. If it
  is wrong, use the blank variant in PROMPTS.md and set the kanji yourself with a real font (Dela Gothic One
  or Noto Sans JP Black, both SIL Open Font License) at about 44 px, no anti-aliasing, in the glyph color.
- **Attach:** an approved banner (any of the four) for the other three, so the set matches.

### `sign`

- **What / where:** the tournament name board on the gate, 4.4 x 1.1 units at 3.5 high, on both faces of the
  gate (the same image on each; it reads correctly from both sides).
- **Procedural:** `signTexture('天下一武闘祭')`: 112 x 28 px: dark wood frame, cream panel, a round emblem on
  the left, the six kanji.
- **Coverage:** the whole image = the whole board. Not tiled.
- **Final:** **288 x 72** (65 px per unit).
- **Generate / fit:** 1536 x 1024, the board filling a 1440 x 360 band centered (art pixel = 5 x 5). Fit:
  `fit raw out 288 72`.
- **Look:** a carved wooden signboard: dark brown frame about 6 px, a cream lacquered panel, a round emblem
  about 40 px across at the left end (navy disc, cream inner ring, a small red sun dot), then
  **天下一武闘祭** (Tenka-ichi Budōsai, "the greatest martial-arts festival under heaven"): six bold dark kanji
  about 34 px tall, evenly spaced left to right in the ~225 px of panel right of the emblem (centers near x 75,
  112, 150, 188, 225 and 263, y 36).
- **Kanji check:** exactly these six, in this order: 天 下 一 武 闘 祭. If any is wrong, use the blank variant
  and set the text with a real font (as for the banners) in `#2a1c14`, about 34 px, no anti-aliasing, at the
  centers above.
- **Anchors:** frame `#5a3a24`, panel `#f4ead2`, panel shade `#d8c9a6`, text `#2a1c14`, emblem `#2a3e66`,
  red dot `#e04050`.

### `lanternBu`, `lanternSai`

- **What / where:** two red paper lanterns hanging on the outer side of the gate pillars (x -3.4: 武, x +3.4:
  祭), each a cylinder 0.84 wide and 0.95 tall between dark wooden caps.
- **Procedural:** `lanternTexture(glyph)`: 32 x 16 px: red body, thin darker ribs, a light band, the glyph
  twice.
- **Coverage:** the image wraps once around the cylinder (about 2.64 units around, 0.95 tall). Not repeated.
- **Final:** **128 x 64**, seamless **horizontally** (the left edge meets the right edge on the lantern).
- **Generate / fit:** 1536 x 1024, a 1536 x 768 band centered (art pixel = 12 x 12). Fit:
  `fit raw out 128 64`.
- **Look:** the unwrapped, flat surface of a red paper lantern: bright red paper, thin darker horizontal
  bamboo ribs every 8 px, a soft lighter band near the top, a darker band 4 px at the top and bottom edges
  (under the caps), and the kanji in cream **twice**, centered at x 32 and x 96 (25 % and 75 % of the width),
  about 40 px tall. Do not draw the lantern's 3D shape (no curved outline, no shading toward the sides).
- **Kanji:** `lanternBu` 武, `lanternSai` 祭. Same check and font fallback as the banners, color `#fff2d8`.
- **Anchors:** paper `#d8323a`, ribs `#b22630`, light band `#f05860`, glyph `#fff2d8`, rim `#6a1a1e`.

### `gong`

- **What / where:** the bronze gong disc (1.7 units across) in its dark wood frame at the back-left of the
  ring, next to the announcer.
- **Procedural:** `gongTexture()`: 32 x 32 px: dark rim, concentric rings, a bright center, a highlight.
- **Coverage:** the disc shows the circle inscribed in the image (touching all four edges); the corners never
  show.
- **Final:** **128 x 128**, opaque (fill the corners with the rim color).
- **Generate / fit:** 1024 x 1024, the disc touching all four edges (art pixel = 8 x 8). Fit:
  `fit raw out 128 128`.
- **Look:** face-on polished bronze gong: an 8 px dark bronze rim, hammered concentric rings, a warm gold body,
  a raised boss in the center with a small bright highlight on its upper left. No characters or symbols.
- **Anchors:** rim `#7a5a1c`, rings `#c8962e`, body `#e2b648`, boss `#f4d070`, highlight `#fff2b0`.

### `parasol`

- **What / where:** the canopy of the two vendor parasols at the back corners of the ring (x +-13.2, z -15):
  open cones 3.4 units across and 0.8 tall, over a small table.
- **Procedural:** `parasolTexture()`: 32 x 8 px: 8 alternating red and white stripes.
- **Coverage:** repeat 2 around the cone, so one image = **half the canopy** (about 5.3 units around at the rim,
  1.9 units from rim to tip). Image top = the tip, bottom = the rim. The circumference shrinks to zero at the
  tip, so the top rows get squeezed.
- **Final:** **256 x 96**, seamless **horizontally**, cutout (only for the scalloped rim).
- **Generate / fit:** 1536 x 1024, a 1536 x 576 band centered (art pixel = 6 x 6), magenta below the scallops.
  Fit: `fit raw out 256 96 --cutout`.
- **Look:** the unwrapped canopy of a red-and-white market parasol: 8 vertical panels of 32 px alternating red
  and cream-white, a thin dark seam between panels, a small gold finial band in the top 8 rows (keeps the
  squeezed tip clean), and a **scalloped valance** along the bottom: each panel ends in a rounded scallop, with
  transparent (magenta) pixels below the scallop curve in the bottom 10 rows. Flat colors, no cone shading.
- **Anchors:** red `#d23a3a`, cream `#f4efe6`, seams `#8a2a2a`, finial `#d8b04a`.

## Sky and nature

### `sky`

- **What / where:** the inside of the sky sphere (radius 400) around the whole world. Seen in intro, orbit and
  wide shots; the fight camera looks down and mostly misses it.
- **Procedural:** `skyTexture()`: 4 x 128 px vertical gradient, `#5aa7f0` at the top, `#8cc6f7` at 45 %,
  `#cfe8fb` at 62 %, `#e8f4fb` at the bottom.
- **Coverage:** the image wraps once around the horizon (x) and spans zenith to nadir (y): row 0 = straight up,
  **row 256 = the horizon**, row 511 = straight down (only seen past the edge of the grass). One row is about
  0.35 degrees of elevation; the part that shows most is rows 170-256 (0-30 degrees above the horizon).
- **Final:** **16 x 512**, every row one flat color (so it wraps seamlessly).
- **Generate / fit:** 1024 x 1536, full-bleed horizontal bands. Fit: `sky raw out` (each output row becomes
  the average color of its raw rows).
- **Look:** a bright, saturated tropical-island sky in **10-14 hard stepped bands** (pixel-art banding, not a
  smooth gradient): deep blue high up, bands getting closer together and lighter toward the horizon, a pale
  cyan-white haze band right at the horizon line (half height), and the lower half a flat pale haze. No clouds,
  no sun, no objects (clouds are separate slots).
- **Anchors:** zenith about `#3f8fe6` to `#5aa7f0`, mid `#8cc6f7`, low `#b4dcf9`, horizon `#cfe8fb`, below
  `#e8f4fb`.

### `cloudA`, `cloudB`, `cloudC`

- **What / where:** 9 camera-facing cloud billboards around the horizon (radius 220, heights 40, 58 and 76).
  The engine cycles the three slots over the 9 positions (each slot 3 times, 120 degrees apart, so twins are
  never in one view).
- **Procedural:** `cloudCanvas(seed)`: 64 x 24 px, white puffs over a pale blue base, hard alpha.
- **Coverage:** each cloud is **45.7 x 17.1 world units**, anchored at its bottom center, whatever the image
  size.
- **Final:** **256 x 96**, sprite (transparent around the cloud), the cloud filling the frame with 2-6 px of
  margin, its flat base near the bottom.
- **Generate / fit:** 1536 x 1024 magenta canvas, the cloud centered and filling most of the width (art pixel
  = 6 x 6). Fit: `fit raw out 256 96 --sprite bottom`.
- **Look:** puffy anime cumulus with a flat base: white tops, pale blue-grey shading underneath, and a 1 px
  outline in a **darker blue-grey** (not black: a black outline makes clouds look like stickers). Hard edges.
  - `cloudA`: a wide, low cumulus bank with 5-6 rounded puffs.
  - `cloudB`: one tall billowing puff on the left trailing into a long low tail on the right.
  - `cloudC`: two or three separate small puffs joined by a thin flat base.
- **Anchors:** white `#ffffff`, shade `#d6e6f4`, deep shade `#b8cde0`, outline `#9fb8d0`.
- **Attach:** an approved cloud for the other two.

### `treeRoundA`, `treeRoundB`, `treePine`, `treePalm`

- **What / where:** about 75 camera-facing tree billboards: up to 70 scattered in a ring 36-76 units out
  (outside the compound walls), 10 near the gate and the corners. Each tree picks one of the four slots at
  random.
- **Procedural:** `treeCanvas(seed, kind)`: 48 x 64 px. The engine's four variants are round (seed 3), round
  (seed 4), pine (seed 5) and round (seed 6).
- **Coverage:** each tree is **3s x 4s world units** (s = 1.3-2.8, so 3.9-8.4 wide and 5.2-11.2 tall), anchored
  at the bottom center of the image.
- **Final:** **192 x 256**, sprite. The **trunk base sits on the bottom row, centered** (x about 96), with no
  empty rows under it (or the tree floats); the crown fills the frame with 2-6 px of margin at the top and
  sides.
- **Slot to variant:**

| slot | engine variant | look |
|---|---|---|
| `treeRoundA` | 0 (round, seed 3) | broadleaf shade tree: a full round crown of 5-7 big leaf clumps, a short brown trunk in the bottom quarter |
| `treeRoundB` | 1 (round, seed 4) | a wide, flatter umbrella-shaped crown (rain-tree type) with visible forked branches under it |
| `treePine` | 2 (pine, seed 5) | a tall tiered pine: 4-5 layered tiers of dark needle foliage, narrow top, short trunk |
| `treePalm` | 3 (round, seed 6, **becomes a palm**) | coconut palm: a slender, gently curving ringed trunk (base centered), a crown of 7-9 long arching fronds, a cluster of coconuts under the crown |

  The palm is a deliberate change (ADR 0008: "palms and pines"; the tournament sits on a tropical island).
  Without `treePalm` the engine keeps its round tree for variant 3.
- **Generate / fit:** 1024 x 1536 magenta canvas, one tree, trunk base near the bottom of the canvas (art pixel
  = 5 x 5). Fit: `fit raw out 192 256 --sprite bottom`.
- **Look:** chunky readable clumps with 4 greens, a closed 1 px dark green outline, light from the upper left,
  no ground, no shadow, no grass tuft at the base.
- **Anchors:** greens `#2f7a3a` `#3b9147` `#52aa58` `#6cc06a`, dark `#2a6a33`, light `#78cc72`, outline
  `#1a2c1e`, trunk `#6a4630` / `#4e3222`; palm trunk `#8a7458` / `#6a5640`, coconuts `#5a4a2a`.
- **Attach:** an approved tree for the others (same greens, outline and pixel size).

---

## Queue sources (for the lead / Claude)

`art/queue/sources.json` has `"stage": []`. The 30 slots in priority order, ready to paste (then
`npm run queue -- build`):

```json
"stage": [
  { "id": "ringTop" }, { "id": "ringSide" }, { "id": "grass" }, { "id": "steps" }, { "id": "stoneBase" },
  { "id": "brick" }, { "id": "path" },
  { "id": "templeFacade" }, { "id": "roof" },
  { "id": "bannerBu" }, { "id": "bannerDo" }, { "id": "bannerSai" }, { "id": "bannerTo" },
  { "id": "plaster" }, { "id": "sky" }, { "id": "cloudA" }, { "id": "cloudB" }, { "id": "cloudC" },
  { "id": "gong" }, { "id": "parasol" }, { "id": "woodDark" },
  { "id": "treeRoundA" }, { "id": "treeRoundB" }, { "id": "treePine" }, { "id": "treePalm" },
  { "id": "sign" }, { "id": "lanternBu" }, { "id": "lanternSai" }, { "id": "woodPillar" }, { "id": "wood" }
]
```

## Engine notes (for Claude)

What the loader needs to do so the art above lands as specified, plus mapping quirks found while measuring
the slots. The art follows this file; fix quirks in code, never by distorting the art.

- **Mapping:** keep every slot's geometry and repeat counts; the image size must not change world coverage.
  `NearestFilter`, sRGB, the same wrap mode as the painter (repeat for tiling slots, clamp for `ringTop`,
  `templeFacade`, `sign`, `gong`, `sky`). `sky` switches from linear to nearest so its bands stay hard.
- **Fallback:** per slot. Unlisted slots keep the painter silently; a listed file that is missing or
  unreadable keeps the painter with one `[stage]` console line.
- **Clouds:** `billboard()` sizes sprites by `canvas.width / ppu`; custom clouds need the explicit world size
  45.7 x 17.1. The engine cycles `cloudA/B/C` with `i % 3`.
- **Trees:** variant index 3 maps to `treePalm`; trees keep `scale(3s, 4s)` and bottom-center anchoring.
- **Wood:** three slots for the three `woodTexture()` tints (`wood` default, `woodDark` `#6e4a2e`,
  `woodPillar` `#8a5634`).
- **Parasol:** the canopy needs `alphaTest: 0.5` (it has no alpha test today) for the scalloped rim.
- **Lantern glyphs face sideways:** `CylinderGeometry` puts u = 0 at +z, so glyphs drawn at 25 % / 75 % (both
  the painter's and the custom art's) face +-x. Rotate the lantern mesh by pi / 2 (or offset the texture by
  0.25) so they face the path.
- **Stretched faces today** (painter and custom art alike):
  - side-stand tier risers facing the ring use `stoneMat(1, 1)` on 26-unit faces: one stone image smeared over
    26 units;
  - the side outer walls (along z) get the wall-cap roof texture repeated 40 x along their 1.3-unit width
    instead of their length, and their top beam stretches one wood image over 62 units;
  - every `woodDark` beam stretches one image over its length (gate lintels 8.6 and 7.4);
  - the temple platform top uses `stoneMat(16, 1)` over 32 x 8 (each image 2 x 8 units);
  - side-stand tier tops (`repeat(1, L)`) run the step courses across the tier instead of along it (the front
    stands run along).
- **Shimmer:** the hi-res ground tiles repeated 50 x 50 (`grass`) and the long paths and walls will alias at
  grazing angles with nearest filtering and no mipmaps; consider mipmaps (nearest-mipmap) for repeated
  ground and wall textures.

## Ideas not wired yet

Ask Claude to add the engine side before generating any of these (they are not in the queue): a distant
horizon band (sea, islands, mountains) on a cylinder inside the sky; a pixel sun; pennant strings and flags
over the stands; food-stall props near the parasols.
