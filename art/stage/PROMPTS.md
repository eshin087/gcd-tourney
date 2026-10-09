# Stage art: image prompts

One paste-ready prompt per slot for Codex's built-in image generator (the user can also paste them into
ChatGPT; same file names). Sizes, coverage and colors come from [ASSETS.md](ASSETS.md); the workflow, QA and
the fit script from [README.md](README.md).

**How to use a block**

1. Claim the slot (`npm run queue -- claim --type stage --agent <name>`) and get the file name
   (`npm run queue -- next-file art/stage/raw/<slot>` -> `art/stage/raw/<slot>_vNN.png`).
2. Set the generator canvas to the size in the block's header (1024 x 1024, 1536 x 1024 or 1024 x 1536).
3. Attach the approved neighbors listed in the header (from `art/stage/final/`) if they exist. Never attach an
   unapproved candidate.
4. Paste the block as it is. Every block repeats the shared rules on purpose, so each one stands alone.
5. Save the image untouched as the raw file, then run the fit command from the header into
   `art/stage/raw/_fit/<slot>_vNN.png` and do the QA in README.md.

Tips: one slot per thread. For a tiling slot, ask for 2-3 variants and keep the one with the calmest, most
even pattern: repetition shows more than detail. If a result is close, iterate with one change at a time
(Fix-ups at the end). Kanji: check every character; each lettered slot has a blank fallback block.

In the fit commands, `<raw>` is `art/stage/raw/<slot>_vNN.png`, `<fit>` is `art/stage/raw/_fit/<slot>_vNN.png`
and `<script>` is your saved copy of `stage-fit.mjs` (run from the repo root, quote paths).

---

## Ring

### `ringTop` (slab sheet)

Canvas **1024 x 1024** · final **1152 x 1152** (18 x 18 slabs, composed) · no tiling (the fit composes the
ring) · fit: `node <script> slabs <raw> <fit>` · attach: nothing.

```text
Hi-res pixel art texture sheet for an HD-2D anime fighting game: the stone floor slabs of a 1990s-anime World Martial Arts Tournament ring on a sunny tropical island.
Image: 1024 x 1024. A 4 x 4 grid of 16 square stone floor slabs seen straight from above, edge to edge, no gaps, no margins, each slab exactly 256 x 256 pixels. Draw it as pixel art on a 256 x 256 grid (every art pixel a clean 4 x 4 block of one color), so each slab is 64 x 64 art pixels.
Every slab: pale cream-white cut stone, each slab a slightly different tone (#eadbc6, #e4d2bb, #ddc9b0, #d6c0a6, #cfb79c, #e9dfcf), a thin warm grey-brown grout edge one art pixel wide on all four sides (#a99079), a soft bevel inside it (one art pixel lighter #f3eadb along the top and left, one art pixel darker along the bottom and right), a few subtle flecks.
Slabs in reading order (left to right, top to bottom): slabs 1 to 9 clean and calm; slabs 10 to 13 each with one small chipped corner or a scuff mark (#9c8370, #8f7663); slabs 14 to 16 each with a thin hairline crack across the slab (#8f7663), one of them with a small repaired patch.
Sun-bleached, flat even daylight: no cast shadows, no vignette, no perspective, no gradient across the image.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering, no photographic texture. No text, no symbols, no logo, no watermark, no signature, no frame.
```

### `ringSide`

Canvas **1536 x 1024** · final **256 x 40** · seamless **horizontally** · fit:
`node <script> fit <raw> <fit> 256 40` · attach: `ringTop.png`.

```text
Hi-res pixel art texture strip for an HD-2D anime fighting game: the vertical stone side of a 1990s-anime World Martial Arts Tournament ring.
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. In the middle, one horizontal strip that fills the full width and is exactly 240 pixels tall, centered vertically; everything above and below it stays magenta. Draw the strip as pixel art on a 256 x 40 grid (every art pixel a clean 6 x 6 block).
The strip, seen straight on, from top to bottom: a light cream coping edge 4 art pixels tall (#d8c6b0); then two courses of rectangular cut stone blocks, each course 12 art pixels tall, blocks about 40 art pixels wide, the lower course offset by half a block, cream-grey stone (#c7b4a1, #bba795, #b09c8a, #c1ad99) with thin darker joints and a light top edge on each block; at the bottom a plain, slightly darker stone plinth course 12 art pixels tall with only a few joints.
Seamless horizontally: the left end continues exactly into the right end, so copies placed side by side show no seam and no cut block. The top and bottom do not need to tile.
Flat even daylight, no cast shadows, no vignette, no perspective. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering. No text, no symbols, no watermark.
```

## Ground

### `grass`

Canvas **1024 x 1024** · final **256 x 256** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 256 256` · attach: nothing.

```text
Seamless tileable hi-res pixel art ground texture for an HD-2D anime fighting game: the mowed lawn around a 1990s-anime World Martial Arts Tournament ring on a sunny tropical island, seen straight from above.
Image: 1024 x 1024, full-bleed. Draw it as pixel art on a 256 x 256 grid (every art pixel a clean 4 x 4 block).
Short, bright, well-kept grass with two vertical mowing stripes: the left half slightly darker green (#3c9846), the right half slightly lighter green (#46a64e). Evenly scattered small blade clusters in lighter greens (#55b75c, #4aa952, tips #64c46a) and darker greens (#3a9443, #33873c, #2f7f38), and a few tiny clover dots. The same density everywhere: no flowers, no stones, no dirt patches, no single feature that stands out (the tile repeats thousands of times).
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge continues exactly into the bottom edge, so tiled copies show no seam.
Flat even lighting: no shadows, no vignette, no gradient across the image. Full-bleed, no border, no frame. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no photographic texture. No text, no watermark.
```

### `path`

Canvas **1024 x 1024** · final **128 x 128** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 128 128` · attach: `ringTop.png`.

```text
Seamless tileable hi-res pixel art ground texture for an HD-2D anime fighting game: a pale flagstone path at a 1990s-anime World Martial Arts Tournament, seen straight from above.
Image: 1024 x 1024, full-bleed. Draw it as pixel art on a 128 x 128 grid (every art pixel a clean 8 x 8 block).
Exactly 2 x 2 large square-ish flagstones per tile, each about 64 x 64 art pixels, cream-grey stone (#e3ddd2, #dbd4c7, #d4ccbe, #e7e2d8), each stone a slightly different tone, edges slightly irregular, joined by 2-art-pixel grey grout (#b5ab9c), a light top edge on each stone, one or two small chips. Calm and even, a little greyer than a white stone ring.
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge; stones cut by an edge continue on the opposite edge.
Flat even lighting, no cast shadows, no vignette. Full-bleed, no border. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no watermark.
```

## Temple and walls

### `templeFacade` (left half)

Canvas **1536 x 1024** · final **1536 x 384** (left half mirrored) · no tiling · fit:
`node <script> fit <raw> <fit> 1536 384 --mirror` · attach: `woodPillar.png`, `plaster.png`, `roof.png`.

```text
Hi-res pixel art texture for an HD-2D anime fighting game: the LEFT HALF of the front wall of a grand Chinese-style temple at a 1990s-anime World Martial Arts Tournament, seen perfectly straight on as a flat elevation (no perspective, no roof, no ground, no sky).
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The wall fills a band across the full width, exactly 768 pixels tall, centered vertically; the top 128 and bottom 128 pixel rows stay magenta. Draw the band as pixel art on a 768 x 384 grid (every art pixel a clean 2 x 2 block): fine, detailed hi-res pixel art.
Vertical layout: four bays of equal width separated by thick red-lacquer pillars: a pillar on the left edge, and at one quarter, one half and three quarters of the width. There is no pillar on the right edge: the right edge is the exact center of the temple, where two door leaves meet.
Horizontal layout, from the top of the band: a dark wooden top beam (top 5 %), the upper floor (to 32 %) with a pale paper lattice window in every bay, a wooden balcony railing with small balusters across the whole width (32-41 %), a dark middle beam (41-47 %), the lower floor (47-93 %), a dark wooden sill beam at the bottom (93-100 %). All beams run the full width.
Lower floor: in bays 1, 2 and 3 (from the left) a sliding paper shoji panel with a light wooden grid; in bay 4 (the right quarter) the LEFT LEAF of a huge double door: heavy dark brown wooden planks with rows of round gold studs, the leaf's right edge on the image's right edge.
Colors: warm white plaster #f1e8d6 between the wood, pillars red lacquer #b23a2a with shadow #7e2419 and light #d0563e, beams and railing brown #8a5a34 with dark #5e3a22 and light #a87446, lattice #e8dcc2 with #b89870 bars, shoji #efe6d2 with #c4a47c frames, door planks #6e4428 / #82522f with dark seams #4a2c1a, gold studs #d6b85a.
Clean, grand and symmetric-feeling; flat even daylight with only small shadows under the beams; no cast shadows from outside, no vignette.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering. No text, no signs, no kanji, no symbols on the doors, no people, no banners, no watermark.
```

### `plaster`

Canvas **1024 x 1024** · final **128 x 128** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 128 128` · attach: nothing.

```text
Seamless tileable hi-res pixel art wall texture for an HD-2D anime fighting game: the smooth white lime plaster of a Chinese-style temple and its compound walls, seen straight on.
Image: 1024 x 1024, full-bleed. Draw it as pixel art on a 128 x 128 grid (every art pixel a clean 8 x 8 block).
Warm white plaster (#f2ead9) with very subtle, low-contrast mottling in two nearby tones (#ebe1cd, #f8f2e6) and two or three faint, short hairline cracks. Nothing that catches the eye: this tile covers large walls and repeats many times.
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge.
Flat even lighting, no shadows, no stains, no vignette, no gradient. Full-bleed, no border. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no watermark.
```

### `stoneBase`

Canvas **1536 x 1024** · final **128 x 64** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 128 64` · attach: `ringSide.png`.

```text
Seamless tileable hi-res pixel art wall texture for an HD-2D anime fighting game: the rough-cut stone base of a temple platform and of a tournament's stands and walls, seen straight on.
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The texture fills a band across the full width, exactly 768 pixels tall, centered vertically; the top and bottom 128 pixel rows stay magenta. Draw the band as pixel art on a 128 x 64 grid (every art pixel a clean 12 x 12 block).
Two courses of ashlar blocks, each course 32 art pixels tall, exactly 3 blocks per course across the width (about 42 art pixels each), the upper course offset by half a block from the lower one. Warm grey-beige stone (#c9b9a9, #bcab9a, #d2c2b2, #b3a190), each block a slightly different tone, 2-3 art pixel darker mortar joints (#9b8c80), a light top edge on each block, a few weathered corners.
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge, so the staggered courses continue without a break when tiled.
Flat even lighting, no cast shadows, no vignette. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no watermark.
```

### `roof`

Canvas **1536 x 1024** · final **128 x 80** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 128 80` · attach: nothing.

```text
Seamless tileable hi-res pixel art roof texture for an HD-2D anime fighting game: glazed Chinese barrel-tile roofing of a temple, seen straight down onto the roof slope (the ridge is at the top of the image, the eave at the bottom).
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The texture fills a band across the full width, exactly 960 pixels tall, centered vertically; the top and bottom 32 pixel rows stay magenta. Draw the band as pixel art on a 128 x 80 grid (every art pixel a clean 12 x 12 block).
Exactly 8 columns of half-round barrel tiles, 16 art pixels wide each, running from top to bottom: each column has a lit rounded top and dark gutters between columns. Exactly 4 overlap lines across the image (every 20 art pixels), where one tile overlaps the next. Deep warm brown-charcoal glaze (#5e4436), tile tops #7a5a48 with a small sheen #8c6e5a, gutters #3e2c24. No eave end caps, no ridge tiles.
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge.
Flat even lighting, no cast shadows, no vignette. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no watermark.
```

## Stands

### `brick`

Canvas **1536 x 1024** · final **128 x 64** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 128 64` · attach: nothing.

```text
Seamless tileable hi-res pixel art wall texture for an HD-2D anime fighting game: the low terracotta brick front wall of a tournament's spectator stands, seen straight on.
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The texture fills a band across the full width, exactly 768 pixels tall, centered vertically; the top and bottom 128 pixel rows stay magenta. Draw the band as pixel art on a 128 x 64 grid (every art pixel a clean 12 x 12 block).
Running-bond brickwork: exactly 4 courses of 16 art pixels, exactly 4 bricks per course (32 art pixels each, including a 2 art pixel mortar joint), every second course offset by half a brick. Warm terracotta bricks (#c08a76, #b57d6a, #c99a86, #ad7462, #c4a08e), each brick a slightly different tone with a light top edge, mortar #8f7466, two or three slightly worn bricks.
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge, so the bond pattern never breaks when tiled.
Flat even lighting, no cast shadows, no vignette. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no graffiti, no watermark.
```

### `steps`

Canvas **1024 x 1024** · final **64 x 64** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 64 64` · attach: `stoneBase.png`.

```text
Seamless tileable hi-res pixel art texture for an HD-2D anime fighting game: the pale worn stone bench slabs of a tournament's stands and a temple's front steps, seen straight on.
Image: 1024 x 1024, full-bleed. Draw it as pixel art on a 64 x 64 grid (every art pixel a clean 16 x 16 block).
Exactly 4 horizontal courses of pale stone, 16 art pixels tall each: on top of each course a 2 art pixel lighter front edge (#eee8de), then the stone face (#d9d2c6) with very slight tone variation and one vertical joint per course (staggered between courses), and a 2 art pixel dark joint at the bottom (#a99f92). A few faint wear marks. Calm and even.
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge.
Flat even lighting, no cast shadows, no vignette. Full-bleed, no border. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no watermark.
```

## Wood

### `woodDark`

Canvas **1024 x 1536** · final **64 x 128** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 64 128` · attach: nothing.

```text
Seamless tileable hi-res pixel art wood texture for an HD-2D anime fighting game: dark stained hardwood for the beams, posts and gong frame of a tournament temple, seen straight on.
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. The texture fills a band the full height of the image and exactly 768 pixels wide, centered horizontally; the left and right 128 pixel columns stay magenta. Draw the band as pixel art on a 64 x 128 grid (every art pixel a clean 12 x 12 block).
Exactly 4 vertical boards of 16 art pixels, fine straight vertical grain, a slightly darker joint between boards (#4e3220), base color #6e4a2e, a thin satin sheen line on each board (#82593a). Even and calm: no knots, no nails, no features (the texture gets stretched over long beams).
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge.
Flat even lighting, no cast shadows, no vignette. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no watermark.
```

### `woodPillar`

Canvas **1024 x 1536** · final **64 x 128** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 64 128` · attach: nothing.

```text
Seamless tileable hi-res pixel art texture for an HD-2D anime fighting game: the red-lacquered wood of a Chinese-style gate pillar at a 1990s-anime World Martial Arts Tournament, seen straight on.
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. The texture fills a band the full height of the image and exactly 768 pixels wide, centered horizontally; the left and right 128 pixel columns stay magenta. Draw the band as pixel art on a 64 x 128 grid (every art pixel a clean 12 x 12 block).
Smooth vermilion-red lacquer (#b23a2a) with a soft vertical sheen stripe (#d0563e), a darker vertical shadow band (#7e2419), faint vertical wood grain under the lacquer, and two or three tiny worn spots where dark wood shows (#5e3a22). No horizontal bands, no rings, no carvings, no gold (the texture repeats three times up the pillar).
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge.
Flat even lighting, no cast shadows, no vignette. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no watermark.
```

### `wood`

Canvas **1024 x 1536** · final **64 x 128** · seamless **both ways** · fit:
`node <script> fit <raw> <fit> 64 128` · attach: `woodDark.png`.

```text
Seamless tileable hi-res pixel art wood texture for an HD-2D anime fighting game: honey-brown planks of a market vendor's table, seen straight on.
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. The texture fills a band the full height of the image and exactly 768 pixels wide, centered horizontally; the left and right 128 pixel columns stay magenta. Draw the band as pixel art on a 64 x 128 grid (every art pixel a clean 12 x 12 block).
Exactly 4 vertical boards of 16 art pixels, fine straight vertical grain, darker joints between boards (#7a4e2c), base color #9a6a3e, a light worn edge on each board (#b0804e). Even and calm: no knots, no nails.
Seamless tileable texture: the left edge continues exactly into the right edge and the top edge into the bottom edge.
Flat even lighting, no cast shadows, no vignette. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no watermark.
```

## Decorations

### `bannerBu` (red, 武)

Canvas **1024 x 1536** · final **64 x 192** (cutout) · no tiling · fit:
`node <script> fit <raw> <fit> 64 192 --cutout` · attach: an approved banner, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: a vertical festival cloth banner hanging on a temple at a 1990s-anime World Martial Arts Tournament, seen straight on, flat (no perspective, no wind).
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. The banner fills a band the full height of the image and exactly 512 pixels wide, centered horizontally; the left and right 256 pixel columns stay magenta. Draw it as pixel art on a 64 x 192 grid (every art pixel a clean 8 x 8 block).
The banner: a gold band 8 art pixels tall across the very top (#d8b04a, the hanging rod), then deep red cloth (#c8323c) with 2-3 art pixel darker red hems down both long sides and a 1 art pixel lighter fold line, and a swallowtail notch cut into the bottom center (about 20 art pixels wide at the bottom edge and 20 art pixels deep, magenta inside the notch).
On the cloth, one single large bold kanji: 武 (exactly this character, meaning "martial"), in cream (#fff0d0), about 42 art pixels tall, centered horizontally, its center about 30 % down from the top. Bold brush-like strokes drawn with hard pixel edges.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering, no gradients, no shadow behind the banner. No other text, no latin letters, no watermark, no signature.
```

### `bannerDo` (blue, 道)

Canvas **1024 x 1536** · final **64 x 192** (cutout) · no tiling · fit:
`node <script> fit <raw> <fit> 64 192 --cutout` · attach: an approved banner, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: a vertical festival cloth banner hanging on a temple at a 1990s-anime World Martial Arts Tournament, seen straight on, flat (no perspective, no wind).
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. The banner fills a band the full height of the image and exactly 512 pixels wide, centered horizontally; the left and right 256 pixel columns stay magenta. Draw it as pixel art on a 64 x 192 grid (every art pixel a clean 8 x 8 block).
The banner: a gold band 8 art pixels tall across the very top (#d8b04a, the hanging rod), then deep royal blue cloth (#2a4a8a) with 2-3 art pixel darker blue hems down both long sides and a 1 art pixel lighter fold line, and a swallowtail notch cut into the bottom center (about 20 art pixels wide at the bottom edge and 20 art pixels deep, magenta inside the notch).
On the cloth, one single large bold kanji: 道 (exactly this character, meaning "the way"), in white (#f4f4ff), about 42 art pixels tall, centered horizontally, its center about 30 % down from the top. Bold brush-like strokes drawn with hard pixel edges.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering, no gradients, no shadow behind the banner. No other text, no latin letters, no watermark, no signature.
```

### `bannerSai` (blue, 祭)

Canvas **1024 x 1536** · final **64 x 192** (cutout) · no tiling · fit:
`node <script> fit <raw> <fit> 64 192 --cutout` · attach: an approved banner, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: a vertical festival cloth banner hanging on a temple at a 1990s-anime World Martial Arts Tournament, seen straight on, flat (no perspective, no wind).
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. The banner fills a band the full height of the image and exactly 512 pixels wide, centered horizontally; the left and right 256 pixel columns stay magenta. Draw it as pixel art on a 64 x 192 grid (every art pixel a clean 8 x 8 block).
The banner: a gold band 8 art pixels tall across the very top (#d8b04a, the hanging rod), then deep royal blue cloth (#2a4a8a) with 2-3 art pixel darker blue hems down both long sides and a 1 art pixel lighter fold line, and a swallowtail notch cut into the bottom center (about 20 art pixels wide at the bottom edge and 20 art pixels deep, magenta inside the notch).
On the cloth, one single large bold kanji: 祭 (exactly this character, meaning "festival"), in white (#f4f4ff), about 42 art pixels tall, centered horizontally, its center about 30 % down from the top. Bold brush-like strokes drawn with hard pixel edges.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering, no gradients, no shadow behind the banner. No other text, no latin letters, no watermark, no signature.
```

### `bannerTo` (red, 闘)

Canvas **1024 x 1536** · final **64 x 192** (cutout) · no tiling · fit:
`node <script> fit <raw> <fit> 64 192 --cutout` · attach: an approved banner, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: a vertical festival cloth banner hanging on a temple at a 1990s-anime World Martial Arts Tournament, seen straight on, flat (no perspective, no wind).
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. The banner fills a band the full height of the image and exactly 512 pixels wide, centered horizontally; the left and right 256 pixel columns stay magenta. Draw it as pixel art on a 64 x 192 grid (every art pixel a clean 8 x 8 block).
The banner: a gold band 8 art pixels tall across the very top (#d8b04a, the hanging rod), then deep red cloth (#c8323c) with 2-3 art pixel darker red hems down both long sides and a 1 art pixel lighter fold line, and a swallowtail notch cut into the bottom center (about 20 art pixels wide at the bottom edge and 20 art pixels deep, magenta inside the notch).
On the cloth, one single large bold kanji: 闘 (exactly this character, meaning "fight"), in cream (#fff0d0), about 42 art pixels tall, centered horizontally, its center about 30 % down from the top. Bold brush-like strokes drawn with hard pixel edges.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering, no gradients, no shadow behind the banner. No other text, no latin letters, no watermark, no signature.
```

### Banner blank fallback (any banner whose kanji comes out wrong)

Same canvas, save name and fit as the slot. Replace `{{CLOTH}}` with the slot's cloth: `deep red cloth
(#c8323c) with darker red hems` (`bannerBu`, `bannerTo`) or `deep royal blue cloth (#2a4a8a) with darker
blue hems` (`bannerDo`, `bannerSai`). After the fit, set the kanji with Dela Gothic One or Noto Sans JP Black
(SIL Open Font License) at about 44 px, no anti-aliasing, in the slot's glyph color, centered horizontally
with its center about 58 px from the top of the 64 x 192 image.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: a vertical festival cloth banner hanging on a temple, seen straight on, flat (no perspective, no wind).
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. The banner fills a band the full height of the image and exactly 512 pixels wide, centered horizontally; the left and right 256 pixel columns stay magenta. Draw it as pixel art on a 64 x 192 grid (every art pixel a clean 8 x 8 block).
The banner: a gold band 8 art pixels tall across the very top (#d8b04a, the hanging rod), then {{CLOTH}} down both long sides and a 1 art pixel lighter fold line, and a swallowtail notch cut into the bottom center (about 20 art pixels wide at the bottom edge and 20 art pixels deep, magenta inside the notch). The cloth is completely plain: leave the whole cloth field empty, no character, no emblem, no pattern.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering, no gradients, no shadow. No text of any kind, no watermark, no signature.
```

### `sign`

Canvas **1536 x 1024** · final **288 x 72** · no tiling · fit:
`node <script> fit <raw> <fit> 288 72` · attach: `woodDark.png` if approved.

```text
Hi-res pixel art texture for an HD-2D anime fighting game: the wooden name board over the entrance gate of a 1990s-anime World Martial Arts Tournament, seen perfectly straight on, flat (no perspective).
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The board fills a band exactly 1440 pixels wide and 360 pixels tall, centered; everything around it stays magenta. Draw it as pixel art on a 288 x 72 grid (every art pixel a clean 5 x 5 block).
The board: a carved dark brown wooden frame about 6 art pixels thick (#5a3a24, with a lighter top edge), a cream lacquered panel inside (#f4ead2, a slightly darker shade #d8c9a6 along its bottom edge). At the left end of the panel a round emblem about 40 art pixels across: a navy disc (#2a3e66) with a cream inner ring and a small red sun dot (#e04050). To the right of the emblem, filling the rest of the panel, exactly these six kanji in this order, left to right, evenly spaced about 37 art pixels apart, bold and dark (#2a1c14), each about 34 art pixels tall: 天下一武闘祭
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering. No other text, no latin letters, no furigana, no watermark, no signature.
```

Blank fallback (if any kanji is wrong): same canvas, save name and fit. Afterwards set 天下一武闘祭 with Dela
Gothic One or Noto Sans JP Black at about 34 px, no anti-aliasing, color `#2a1c14`, one glyph centered on
each of x 75, 112, 150, 188, 225 and 263 at y 36.

```text
Hi-res pixel art texture for an HD-2D anime fighting game: a wooden name board over the entrance gate of a martial-arts tournament, seen perfectly straight on, flat (no perspective).
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The board fills a band exactly 1440 pixels wide and 360 pixels tall, centered; everything around it stays magenta. Draw it as pixel art on a 288 x 72 grid (every art pixel a clean 5 x 5 block).
The board: a carved dark brown wooden frame about 6 art pixels thick (#5a3a24, with a lighter top edge), a cream lacquered panel inside (#f4ead2, a slightly darker shade #d8c9a6 along its bottom edge). At the left end of the panel a round emblem about 40 art pixels across: a navy disc (#2a3e66) with a cream inner ring and a small red sun dot (#e04050). The rest of the panel is completely empty.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text of any kind, no watermark, no signature.
```

### `lanternBu` (武)

Canvas **1536 x 1024** · final **128 x 64** · seamless **horizontally** · fit:
`node <script> fit <raw> <fit> 128 64` · attach: an approved lantern, if any.

```text
Hi-res pixel art texture for an HD-2D anime fighting game: the UNWRAPPED surface of a red paper lantern (a cylindrical festival lantern) at a 1990s-anime World Martial Arts Tournament gate, laid out flat as a rectangle, like a label peeled off a can.
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The texture fills a band across the full width, exactly 768 pixels tall, centered vertically; the top and bottom 128 pixel rows stay magenta. Draw the band as pixel art on a 128 x 64 grid (every art pixel a clean 12 x 12 block).
Bright red paper (#d8323a) with thin darker horizontal bamboo ribs every 8 art pixels (#b22630), a soft lighter red band near the top (#f05860), and a dark red-black band 4 art pixels tall along the very top and the very bottom (#6a1a1e, where the wooden caps sit). The kanji 武 (exactly this character, meaning "martial") appears TWICE, in cream (#fff2d8), each about 40 art pixels tall: one centered at one quarter of the width, one centered at three quarters of the width.
Flat: do not draw the lantern's 3D shape, no curved outline, no shading toward the sides, no glow.
Seamless horizontally: the left edge continues exactly into the right edge (they meet when wrapped around the lantern).
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No other text, no latin letters, no watermark.
```

### `lanternSai` (祭)

Canvas **1536 x 1024** · final **128 x 64** · seamless **horizontally** · fit:
`node <script> fit <raw> <fit> 128 64` · attach: an approved lantern, if any.

```text
Hi-res pixel art texture for an HD-2D anime fighting game: the UNWRAPPED surface of a red paper lantern (a cylindrical festival lantern) at a 1990s-anime World Martial Arts Tournament gate, laid out flat as a rectangle, like a label peeled off a can.
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The texture fills a band across the full width, exactly 768 pixels tall, centered vertically; the top and bottom 128 pixel rows stay magenta. Draw the band as pixel art on a 128 x 64 grid (every art pixel a clean 12 x 12 block).
Bright red paper (#d8323a) with thin darker horizontal bamboo ribs every 8 art pixels (#b22630), a soft lighter red band near the top (#f05860), and a dark red-black band 4 art pixels tall along the very top and the very bottom (#6a1a1e, where the wooden caps sit). The kanji 祭 (exactly this character, meaning "festival") appears TWICE, in cream (#fff2d8), each about 40 art pixels tall: one centered at one quarter of the width, one centered at three quarters of the width.
Flat: do not draw the lantern's 3D shape, no curved outline, no shading toward the sides, no glow.
Seamless horizontally: the left edge continues exactly into the right edge (they meet when wrapped around the lantern).
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No other text, no latin letters, no watermark.
```

Blank fallback: the same block with the kanji sentence replaced by "No characters: the paper between the ribs
is plain." Afterwards set the kanji twice with Dela Gothic One or Noto Sans JP Black at about 40 px, no
anti-aliasing, color `#fff2d8`, centered on (32, 32) and (96, 32).

### `gong`

Canvas **1024 x 1024** · final **128 x 128** · no tiling · fit:
`node <script> fit <raw> <fit> 128 128` · attach: nothing.

```text
Hi-res pixel art texture for an HD-2D anime fighting game: the face of a polished bronze gong at a 1990s-anime World Martial Arts Tournament, seen perfectly face-on.
Image: 1024 x 1024. The round gong disc touches all four edges of the image exactly (its diameter equals the image width); the four corners outside the disc are filled with the dark rim color #7a5a1c. Draw it as pixel art on a 128 x 128 grid (every art pixel a clean 8 x 8 block).
The disc: a dark bronze rim about 8 art pixels wide (#7a5a1c), hammered concentric rings (#c8962e) on a warm golden body (#e2b648), a raised round boss in the center (#f4d070) with a small bright highlight on its upper left (#fff2b0). Clean, polished, ceremonial.
No frame, no stand, no mallet, no characters, no symbols. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no soft glow. No text, no watermark.
```

### `parasol`

Canvas **1536 x 1024** · final **256 x 96** (cutout) · seamless **horizontally** · fit:
`node <script> fit <raw> <fit> 256 96 --cutout` · attach: nothing.

```text
Hi-res pixel art texture for an HD-2D anime fighting game: the UNWRAPPED canopy fabric of a red-and-white striped market parasol at a 1990s-anime World Martial Arts Tournament, laid out flat as a rectangle (the top edge is the tip of the parasol, the bottom edge is its rim).
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The texture fills a band across the full width, exactly 576 pixels tall, centered vertically; the rows above and below stay magenta. Draw the band as pixel art on a 256 x 96 grid (every art pixel a clean 6 x 6 block).
Exactly 8 vertical panels of 32 art pixels, alternating red (#d23a3a) and cream-white (#f4efe6), starting with red on the left, a thin dark seam between panels (#8a2a2a), a small gold band along the top 8 art pixels (#d8b04a, the finial). Along the bottom, a scalloped valance: each panel ends in one rounded scallop, and below each scallop curve the image is magenta (the scallops reach down to the bottom edge at their centers and rise about 10 art pixels between them).
Flat colors, no cone shading, no folds, no shadows, no pole.
Seamless horizontally: the left edge continues exactly into the right edge.
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise. No text, no logo, no watermark.
```

## Sky and nature

### `sky`

Canvas **1024 x 1536** · final **16 x 512** · flat rows (wraps horizontally) · fit:
`node <script> sky <raw> <fit>` · attach: nothing.

```text
Hi-res pixel art sky gradient for an HD-2D anime fighting game: the bright, saturated blue sky over a sunny tropical island tournament, drawn as hard stepped color bands.
Image: 1024 x 1536, full-bleed. Only perfectly flat horizontal color bands that each span the full width: every row of pixels is one single color. No clouds, no sun, no birds, no objects, no texture, no dithering, no smooth gradient.
The horizon line is at exactly half the image height. Above it, 10 to 14 bands from top to bottom: wide deep saturated blue bands at the top (#3f8fe6, #5aa7f0), then medium blues (#8cc6f7), getting thinner and lighter toward the horizon (#b4dcf9), ending in a thin pale cyan-white haze band just above the horizon line (#cfe8fb). The whole lower half, below the horizon, is one flat pale haze color (#e8f4fb).
Crisp hard band edges, no anti-aliasing, no blur. No text, no watermark.
```

### `cloudA`

Canvas **1536 x 1024** · final **256 x 96** (sprite) · no tiling · fit:
`node <script> fit <raw> <fit> 256 96 --sprite bottom` · attach: an approved cloud, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: one puffy anime cumulus cloud in the sky over a sunny tropical tournament.
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. One cloud, centered, filling most of the width; its shape is wide and low, about 2.7 times wider than tall. Draw it as pixel art with art pixels of 6 x 6 output pixels.
The cloud: a wide, low cumulus bank of 5 or 6 rounded puffs on a flat base. White tops (#ffffff), pale blue-grey shading underneath and between the puffs (#d6e6f4, #b8cde0), and a closed 1 art pixel outline in a darker blue-grey (#9fb8d0, not black).
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no soft edges, no transparency gradients, no glow. No sky color behind it (only magenta), no sun, no other clouds, no text, no watermark.
```

### `cloudB`

Canvas **1536 x 1024** · final **256 x 96** (sprite) · no tiling · fit:
`node <script> fit <raw> <fit> 256 96 --sprite bottom` · attach: an approved cloud, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: one puffy anime cumulus cloud in the sky over a sunny tropical tournament.
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. One cloud, centered, filling most of the width; its overall shape is about 2.7 times wider than tall. Draw it as pixel art with art pixels of 6 x 6 output pixels.
The cloud: one tall billowing puff on the left that trails off into a long, low, flat tail of smaller puffs on the right, all on a flat base. White tops (#ffffff), pale blue-grey shading underneath and between the puffs (#d6e6f4, #b8cde0), and a closed 1 art pixel outline in a darker blue-grey (#9fb8d0, not black).
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no soft edges, no transparency gradients, no glow. No sky color behind it (only magenta), no sun, no other clouds, no text, no watermark.
```

### `cloudC`

Canvas **1536 x 1024** · final **256 x 96** (sprite) · no tiling · fit:
`node <script> fit <raw> <fit> 256 96 --sprite bottom` · attach: an approved cloud, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: a small group of puffy anime cumulus clouds in the sky over a sunny tropical tournament.
Image: 1536 x 1024 with a flat solid magenta #FF00FF background. The group is centered and fills most of the width; its overall shape is about 2.7 times wider than tall. Draw it as pixel art with art pixels of 6 x 6 output pixels.
The clouds: two or three separate rounded puffs of different sizes, joined near the bottom by one thin, flat cloud base. White tops (#ffffff), pale blue-grey shading underneath (#d6e6f4, #b8cde0), and a closed 1 art pixel outline in a darker blue-grey (#9fb8d0, not black).
Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no soft edges, no transparency gradients, no glow. No sky color behind it (only magenta), no sun, no text, no watermark.
```

### `treeRoundA`

Canvas **1024 x 1536** · final **192 x 256** (sprite) · no tiling · fit:
`node <script> fit <raw> <fit> 192 256 --sprite bottom` · attach: an approved tree, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: one broadleaf shade tree growing around a 1990s-anime World Martial Arts Tournament on a sunny tropical island, seen from the front at eye level.
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. One tree, centered, as large as possible: the crown nearly touches the top and sides, and the trunk base stands near the bottom edge, centered. The whole tree is about 3 wide by 4 tall. Draw it as pixel art with art pixels of 5 x 5 output pixels.
The tree: a full, round crown built from 5 to 7 big leaf clumps, in 4 greens (#2f7a3a, #3b9147, #52aa58, #6cc06a) with darker gaps (#2a6a33) and light leaf tips (#78cc72), lit from the upper left; a short sturdy brown trunk (#6a4630, shadow side #4e3222) visible in the bottom quarter. A closed 1 art pixel dark green outline (#1a2c1e) around the whole silhouette.
No ground, no grass, no shadow under the tree, no roots spreading on the ground, no other objects. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering. No text, no watermark.
```

### `treeRoundB`

Canvas **1024 x 1536** · final **192 x 256** (sprite) · no tiling · fit:
`node <script> fit <raw> <fit> 192 256 --sprite bottom` · attach: an approved tree, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: one wide umbrella-shaped tropical shade tree (a rain-tree type) growing around a 1990s-anime World Martial Arts Tournament on a sunny island, seen from the front at eye level.
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. One tree, centered, as large as possible: the crown nearly touches the top and sides, and the trunk base stands near the bottom edge, centered. The whole tree is about 3 wide by 4 tall. Draw it as pixel art with art pixels of 5 x 5 output pixels.
The tree: a wide, flatter, umbrella-shaped crown of leafy clumps in 4 greens (#2f7a3a, #3b9147, #52aa58, #6cc06a) with darker gaps (#2a6a33) and light tips (#78cc72), lit from the upper left; under the crown a brown trunk (#6a4630, shadow #4e3222) that forks into two or three visible branches. A closed 1 art pixel dark green outline (#1a2c1e) around the whole silhouette.
No ground, no grass, no shadow under the tree, no other objects. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering. No text, no watermark.
```

### `treePine`

Canvas **1024 x 1536** · final **192 x 256** (sprite) · no tiling · fit:
`node <script> fit <raw> <fit> 192 256 --sprite bottom` · attach: an approved tree, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: one tall tiered pine tree growing around a 1990s-anime World Martial Arts Tournament, seen from the front at eye level.
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. One tree, centered, as large as possible: the top nearly touches the top edge, and the trunk base stands near the bottom edge, centered. The whole tree is about 3 wide by 4 tall, narrower toward the top. Draw it as pixel art with art pixels of 5 x 5 output pixels.
The tree: 4 or 5 layered tiers of dark needle foliage, each tier wider than the one above, slightly irregular edges, in deep greens (#2a6a33, #2f7a3a, #3b9147) with lighter needle tips (#52aa58), lit from the upper left; a short brown trunk (#6a4630, shadow #4e3222) at the bottom. A closed 1 art pixel dark green outline (#1a2c1e) around the whole silhouette.
No ground, no grass, no shadow under the tree, no other objects. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering. No text, no watermark.
```

### `treePalm`

Canvas **1024 x 1536** · final **192 x 256** (sprite) · no tiling · fit:
`node <script> fit <raw> <fit> 192 256 --sprite bottom` · attach: an approved tree, if any.

```text
Hi-res pixel art game sprite for an HD-2D anime fighting game: one coconut palm tree growing around a 1990s-anime World Martial Arts Tournament on a sunny tropical island, seen from the front at eye level.
Image: 1024 x 1536 with a flat solid magenta #FF00FF background. One palm, as large as possible: the fronds nearly touch the top and sides, and the base of the trunk stands near the bottom edge, exactly centered horizontally. The whole palm fits a frame about 3 wide by 4 tall. Draw it as pixel art with art pixels of 5 x 5 output pixels.
The palm: a slender trunk with ring segments (#8a7458, shadow #6a5640) that curves gently to one side and back so the crown sits roughly above the base; a crown of 7 to 9 long arching fronds with clear leaflets in greens (#2f7a3a, #3b9147, #52aa58, #6cc06a), lit from the upper left; a small cluster of brown coconuts under the crown (#5a4a2a). A closed 1 art pixel dark green outline (#1a2c1e) around the whole silhouette.
No ground, no sand, no shadow under the palm, no other objects. Crisp hard-edged pixel art: clean square pixels, no anti-aliasing, no blur, no noise, no dithering. No text, no watermark.
```

---

## Fix-ups

Attach the previous version and change one thing at a time. Save every result as the next `_vNN`.

```text
Same image, but {{one change, for example: "the left and right edges must continue seamlessly into each other" / "calmer, less contrast, no stand-out stones" / "bigger, cleaner pixels, fewer colors" / "the kanji must be exactly 武" / "no border around the edge" / "the trunk base must touch the bottom of the drawing, centered"}}. Keep everything else identical: same layout, same colors, same pixel size, flat magenta #FF00FF where it was magenta.
```

Seam repair on an `offset` image (README, "Seamless-texture QA"):

```text
This is a tileable pixel art texture shifted by half its size, so its old edges now meet in a cross through the middle. Repair only that middle cross: make the pattern continue smoothly across it, with no visible line or broken shapes. Keep every pixel away from the cross exactly as it is, same colors, same pixel size, same image size. No border, no text.
```
