# Decal image prompts

Paste-ready prompts for every name in [`DECALS.md`](DECALS.md), for Codex's built-in image generator
or a ChatGPT chat run by the user. Rules, workflow and QA: [`README.md`](README.md).

## How to use

1. Start a **new thread** per decal name (or per group of related names).
2. Give the **Preamble** (section 0) as the first message.
3. Attach the approved **`art/decals/reference/decal_style_sheet.png`** and give the name's prompt
   (section 2). Every prompt says how many images the name needs and what goes in each. The generator
   draws **IMAGE A** first; for the next one, reply `next: IMAGE B` (then `next: IMAGE C`) in the same
   thread so the style and scale stay the same.
4. Check each image against the QA list in `README.md`; use a **fix-up prompt** (section 3) if needed.
5. Save every image of the name as **one version**: `art/decals/raw/<name>_vNN.png` when the name has a
   single image, else `art/decals/raw/<name>_vNN_A.png`, `_B.png`, `_C.png` (same `NN`; `npm run queue --
   next-file art/decals/raw/<name>` prints it). Never overwrite or reuse a number.
6. `node tools/pack-sprites.mjs decals --candidates`, check in game (`?art=custom&debug`, `groundDemo()`),
   then queue a `REVIEW.md` row (area `decal`).

Tips:

- Sizes are given as **% of the variant's own square (or 2:1 / 4:1) cell**, because the packer scales
  each image so its largest variant fills the cell. Relative sizes inside one image matter; absolute
  pixels do not.
- Image generators love perspective and side light. If a crater shows its bowl wall from the side or one
  side is brighter, use the fix-ups "Not top-down" or "Side light".
- Pure white is the hot key: only the names marked **HOT KEY** may use #FFFFFF, and only where the prompt
  says. The packer snaps near-white to it in those names and tones it down everywhere else.

---

## 0. Preamble (paste once at the start of every thread)

```text
You are drawing top-down ground-damage decals for a 2.5D anime arena fighting game (HD-2D pixel art, like the floor damage in modern anime fighting games). The decals are laid flat on a light stone tournament ring (or grass, or a wall) by the game engine. I will send one decal type at a time. Follow these rules for every image:

LAYOUT
- One single wide landscape image, 1536 x 1024.
- Exactly the number of variants I ask for, in ONE horizontal row, left to right. Each variant lives in its own imaginary cell of the same size (square unless I say 2:1 or 4:1). Wide empty gaps between variants and around the image border. Nothing touches another variant or the image edge.
- Each variant is a different design of the same decal type (different crack layout, different shape), never a copy.
- Fill each cell well: the biggest variant reaches about 90% of its cell.

VIEW AND LIGHT
- FLOOR decals are seen STRAIGHT FROM ABOVE: orthographic, no perspective, no horizon, never the side wall of a bowl. The game camera adds the perspective.
- Shading is RADIAL ONLY: darker toward the pit or center, lighter on rim tops and lifted edges. NO directional light, no side brighter than another: the game rotates every decal at random and lights it itself.
- WALL decals (only when I say WALL) are seen face-on, flat against the wall.

SHAPE
- No regular tile or grout grid lines inside a decal. Broken pieces and slabs are irregular.
- The outer ~10% of each variant holds only thin crack tips and loose pebbles, so decals blend into the floor and into each other.
- DIRECTIONAL decals (only when I say so): the motion goes from LEFT to RIGHT, and the decal keeps the cell proportions I give (2:1 or 4:1).

BACKGROUND
- Perfectly flat solid magenta #FF00FF everywhere outside the decal. No shadow, no floor texture, no haze, no vignette on the background.
- Never use magenta, hot pink, purple or violet inside a decal.

STYLE
- Hard-edged pixel art: crisp square pixels at a fine resolution, flat color bands with hard edges, every pixel fully opaque (no half-transparent pixels).
- No anti-aliasing, no blur, no soft gradients, no airbrush glow, no noise or dithering fills.
- At most 24 colors, taken from the hex palette I give.
- No text, letters, numbers, labels, grid lines, frame borders or watermarks.

HOT KEY
- Pure white #FFFFFF is reserved: use it ONLY when I say HOT KEY, and only for the glowing hot seams I describe. Everywhere else the lightest tone is #F6F0E4.

Reply only "Ready" and wait for the first decal.
```

---

## 1. Decal style sheet (do this first; needs the user's approval)

Save as: `art/decals/reference/decal_style_sheet_vNN.png` (reference only, never packed). When the user
approves one, copy it to `art/decals/reference/decal_style_sheet.png` and attach that to every decal
prompt.

```text
Make one style-reference sheet for all the ground-damage decals of this game: a 3 x 2 grid of six decal samples on flat magenta #FF00FF, each centered in its own square cell with wide gaps, all seen straight from above, all in one consistent hard-edged pixel-art style with radial shading only (no side light).
Row 1 (stone ring tones #F6F0E4 #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #B09A82 #A58D75 #8F7663 #6E5A4A #574638):
1) a medium radial crack web around a small shattered center: 8 branching hairline cracks, a few chipped shards and pebbles;
2) a shallow crater: an irregular bowl about half the cell with a broken rim of chunky shards, the inside darker toward the middle, 8 cracks radiating to the cell edge, pebbles;
3) a big deep crater: a terraced broken rim, 4 large tilted slab fragments around it, long cracks, a rubble field.
Row 2:
4) a lightning burn: a fern-like branching soot scorch (#4A3F37 #3A302A #2A2420 #1E1A18) with a small glassy grey center (#5E6B78 #8C9AA8); the center seams of the main branches in pure white #FFFFFF;
5) a spiral scour: a bowl ground into 5 concentric spiral grooves all turning the same way, a polished pale interior (#F2EADC #E8DCC8 #B8A48C), a chipped rim, the innermost groove in pure white #FFFFFF;
6) an erased hollow: a perfectly smooth circular hollow with a clean cut rim (a thin #F6F0E4 highlight and a pure white #FFFFFF rim line) and a smooth dark slate interior (#3C3A40 #2E2C33 #232128), no rubble, no cracks.
Pure white appears only in samples 4-6, only where described. No text, no labels, no grid lines.
```

---

## 2. Decal prompts

### crack_s: hairline crack star

Save as: `art/decals/raw/crack_s_vNN_A.png`, `_B.png`, `_C.png` (one version, 3 images)

```text
Decal: HAIRLINE CRACK STAR. FULL COLOR. Floor decal, TOP-DOWN, square cells. 8 variants over 3 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6, IMAGE C = variants 7-8. Draw IMAGE A now; when I say "next", draw the next image with the same scale and style.
Shape: a hairline crack star with NO bowl: 3-6 thin jagged cracks (1-2 pixels wide) running out from a tiny chipped point, 1-3 tiny chips beside the point. The cracks reach 70-95% of the cell; vary the reach and the number of cracks per variant.
Variants: 1) 3 long cracks; 2) 5 short forked cracks; 3) 4 cracks, one much longer; 4) 6 cracks, two chips; 5) 3 cracks bending sharply; 6) 4 cracks with tiny side forks; 7) 5 cracks, uneven lengths; 8) 4 cracks, a slightly bigger chipped point.
Palette (stone ring): crack #8F7663, deep crack #6E5A4A, chip #C4B29E, chip highlight #F6F0E4, broken mid #D2C1A8. No hot key.
```

### crack: radial crack web

Save as: `art/decals/raw/crack_vNN_A.png`, `_B.png`, `_C.png` (one version, 3 images)

```text
Decal: RADIAL CRACK WEB. FULL COLOR. Floor decal, TOP-DOWN, square cells. 8 variants over 3 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6, IMAGE C = variants 7-8. Draw IMAGE A now; when I say "next", draw the next image with the same scale and style.
Shape: a small shattered center (a dent about 15% of the cell made of 4-8 chipped shards, darker in the middle), 6-10 branching cracks running out to 90-97% of the cell, a few loose pebbles near the tips.
Variants: 1) 6 cracks, round dent; 2) 8 cracks, oval dent; 3) 10 thin cracks with many forks; 4) 7 cracks, two long ones; 5) 6 cracks, a pebble cluster; 6) 9 cracks, a lopsided dent; 7) 8 cracks, shards pushed outward; 8) 7 cracks, a double dent.
Palette (stone ring): surface #E3D5BF, light #EFE6D7, chip highlight #F6F0E4, broken mid #D2C1A8, shade #C4B29E, deep shade #B09A82, rim #A58D75, crack #8F7663, deep crack #6E5A4A, pit #574638. No hot key.
```

### crater: shallow crater

Save as: `art/decals/raw/crater_vNN_A.png`, `_B.png`, `_C.png` (one version, 3 images)

```text
Decal: SHALLOW CRATER. FULL COLOR. Floor decal, TOP-DOWN, square cells. 8 variants over 3 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6, IMAGE C = variants 7-8. Draw IMAGE A now; when I say "next", draw the next image with the same scale and style.
Shape: a shallow bowl 40-55% of the cell, a broken irregular rim of 6-12 chunky shards, the inside radially darker toward the pit (no side light), 7-10 jagged cracks reaching 95% of the cell, pebbles around the rim.
Variants: 1) round bowl; 2) oval bowl; 3) lopsided bowl with a long crack on one side; 4) double dent (two overlapping bowls); 5) small deep bowl, many cracks; 6) wide shallow bowl, few cracks; 7) round bowl with 3 big rim shards; 8) oval bowl with a rubble spill.
Palette (stone ring): surface #E3D5BF, light #EFE6D7, chip highlight #F6F0E4, broken mid #D2C1A8, shade #C4B29E, deep shade #B09A82, rim #A58D75, crack #8F7663, deep crack #6E5A4A, pit #574638. No hot key.
```

### crater_big: deep crater

Save as: `art/decals/raw/crater_big_vNN_A.png`, `_B.png`, `_C.png` (one version, 3 images)

```text
Decal: DEEP CRATER. FULL COLOR. Floor decal, TOP-DOWN, square cells. 6 variants over 3 images: 2 variants per image (IMAGE A = 1-2, IMAGE B = 3-4, IMAGE C = 5-6), drawn large with fine detail. Draw IMAGE A now; when I say "next", draw the next image with the same scale and style.
Shape: a deep bowl 40-50% of the cell with a terraced, broken rim (two or three stepped rings of broken stone), 3-5 large tilted slab fragments lying around the rim (their raised edges lighter), long cracks crossing toward the cell edge, a rubble field of pebbles and chips. Radial shading only: the pit darkest.
Variants: 1) round, 4 slabs; 2) oval, 3 slabs; 3) lopsided, rubble spill on one side; 4) round, 5 slabs, many cracks; 5) wide terraced rim, few slabs; 6) double-dent bowl.
Palette (stone ring): surface #E3D5BF, light #EFE6D7, chip highlight #F6F0E4, broken mid #D2C1A8, shade #C4B29E, deep shade #B09A82, rim #A58D75, crack #8F7663, deep crack #6E5A4A, pit #574638. No hot key.
```

### crater_huge: massive impact

Save as: `art/decals/raw/crater_huge_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: MASSIVE IMPACT CRATER. FULL COLOR. Floor decal, TOP-DOWN, square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4, drawn large with fine detail. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a huge bowl 55-70% of the cell, an inner and an outer fracture ring, 8-12 wide fissures reaching the cell edge, heavy rubble on the rim, a dark pit at the center. Radial shading only.
Variants: 1) round, 10 fissures; 2) slightly oval, 8 wide fissures; 3) round with a cracked raised inner ring; 4) jagged, 12 fissures, heavy rubble.
Palette: stone ring #F6F0E4 #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #B09A82 #A58D75 #8F7663 #6E5A4A #574638, pit soot #3A302A #2A2420. No hot key.
```

### fracture_ring: power-up pressure

Save as: `art/decals/raw/fracture_ring_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: POWER-UP PRESSURE FRACTURE. FULL COLOR. Floor decal, TOP-DOWN, square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: NO bowl. A slightly flattened center disc (about 30% of the cell, a little darker) with hairline concentric ring cracks around it, short radial cracks between the rings, and lifted slab edges on the outer ring (at about 85% of the cell, their raised edges lighter).
Variants: 1) two rings, 12 radial cracks; 2) three rings, sparse cracks; 3) two rings, the outer one broken into lifted slabs; 4) one wide ring with many short radial cracks.
Palette (stone ring): #F6F0E4 #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #B09A82 #A58D75 #8F7663 #6E5A4A. No hot key.
```

### scuff: dash scrape

Save as: `art/decals/raw/scuff_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: DASH SCRAPE. FULL COLOR. Floor decal, TOP-DOWN, DIRECTIONAL (motion left to right), cells 2:1 (twice as wide as tall). 8 variants over 2 images: IMAGE A = variants 1-4, IMAGE B = variants 5-8, in one row each. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: shoe and slide scrape streaks on stone: 2-5 pale scraped lines running left to right, smeared grit between them, a small grit pile at the right end. Each variant about twice as wide as tall.
Variants: 1) two long parallel streaks; 2) three short streaks; 3) one wide smear; 4) streaks that fan slightly; 5) a double footprint scrape; 6) a long thin streak with a big grit pile; 7) wavy streaks; 8) short heavy scrape.
Palette (stone ring): scraped pale #EFE6D7, #F6F0E4, grit #C4B29E #B09A82 #A58D75, shadow #8F7663. No hot key.
```

### skid: body drag groove

Save as: `art/decals/raw/skid_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: BODY DRAG GROOVE. FULL COLOR. Floor decal, TOP-DOWN, DIRECTIONAL (motion left to right), cells 4:1 (four times as wide as tall). 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4, each variant a long horizontal band. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a groove dragged into stone by a sliding body, narrow at the left and widening toward the right, chipped edges, a pushed-up pile of grit and rubble at the right end. Radial-style shading across the groove (darker in its bottom), no side light.
Variants: 1) straight groove; 2) slightly curving groove; 3) groove with a bounce gap in the middle; 4) wide groove with a big rubble pile.
Palette (stone ring): #F6F0E4 #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #B09A82 #A58D75 #8F7663 #6E5A4A. No hot key.
```

### rubble: settled debris

Save as: `art/decals/raw/rubble_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: SETTLED RUBBLE RING. FULL COLOR. Floor decal, TOP-DOWN, square cells. 6 variants over 2 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: loose pebbles and stone chips scattered in a broken ring shape: no cracks, no bowl, the center (about 40% of the cell) empty. Small pebbles and a few bigger chips, each lit evenly from straight above (a lighter top, a darker edge all around), never brighter on one side.
Variants: 1) dense ring; 2) sparse ring; 3) ring with a gap; 4) lopsided ring, heavier on one side; 5) two loose arcs; 6) many tiny pebbles.
Palette (stone ring): #F6F0E4 #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #B09A82 #A58D75 #8F7663. No hot key.
```

### dirt_crater: crater in the lawn

Save as: `art/decals/raw/dirt_crater_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: CRATER IN A GRASS LAWN. FULL COLOR. Floor decal, TOP-DOWN, square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a crater gouged into a lawn: a torn turf edge, an exposed brown earth bowl (darker toward the middle), flung dirt clods and grass clumps scattered around it.
Variants: 1) round; 2) oval with a long dirt spray; 3) lopsided with torn turf flaps; 4) deep with many clods.
Palette: grass #73CE63 #52AD4C #4CA649 #429843 #32743A #2D7335, earth #8A6A48 #6E5236 #54402A #3E2F20. No hot key.
```

### dirt_skid: furrow in the lawn

Save as: `art/decals/raw/dirt_skid_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: FURROW IN A GRASS LAWN. FULL COLOR. Floor decal, TOP-DOWN, DIRECTIONAL (motion left to right), cells 4:1. 3 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variant 3, each a long horizontal band. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a furrow plowed through grass by a sliding body: torn turf curled up along both sides, exposed earth in the furrow, an earth pile at the right end.
Variants: 1) straight furrow; 2) slightly curving furrow; 3) wide furrow with a big earth pile.
Palette: grass #73CE63 #52AD4C #4CA649 #429843 #32743A #2D7335, earth #8A6A48 #6E5236 #54402A #3E2F20. No hot key.
```

### barrier_crack: cracked ki barrier

Save as: `art/decals/raw/barrier_crack_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: CRACKED ENERGY BARRIER. WHITE-ONLY. WALL decal seen face-on (on an invisible wall of hexagon energy cells), square cells. 6 variants over 2 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a spiderweb crack spreading from an impact point: near the center the crack lines follow the edges of hexagon cells, further out they become straight radial fractures. 2-4 hexagon cells next to the center are knocked out and filled flat white.
Variants: 1) 3 knocked-out cells, 8 fractures; 2) 2 cells, long fractures; 3) 4 cells, dense web; 4) off-center impact; 5) a ring of hex cracks, few fractures; 6) 3 cells, many short fractures.
Colors: white #FFFFFF, light greys #E6E6E6 #C8C8C8 (and #A8A8A8 if needed). No color at all, no dark outline. The game tints it.
```

### crater_wall: hole in the stand wall

Save as: `art/decals/raw/crater_wall_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: IMPACT HOLE IN A BRICK WALL. FULL COLOR. WALL decal seen face-on (light from above is fine), square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
IMAGE A: a crater imprint shaped like a human body slammed into the wall, arms and legs spread out (the classic comedy anime "person-shaped hole"), seen face-on.
IMAGE B: a round blast hole.
All variants: a jagged broken-brick outline, a dark rubble interior, cracks running through the brick courses around the hole, a few loose bricks.
Palette (brick): #DDB5A1 #C08C74 #A87660 #8B7669 #6E5A50 #4A3A34 #B89C82. No hot key.
```

### burn_lightning: lightning burn

Save as: `art/decals/raw/burn_lightning_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: LIGHTNING BURN. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 6 variants over 2 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a Lichtenberg-figure scorch like a fern: dark soot branches forking outward from a small fused glassy center, reaching 95% of the cell, thinner and lighter at the tips. HOT KEY: the center seam of each main branch is pure white #FFFFFF.
Variants: 1) 5 main branches; 2) 7 thin branches; 3) 4 thick branches with many forks; 4) lopsided, long branches on one side; 5) 6 branches, a bigger glassy center; 6) dense small burn.
Palette: soot #4A3F37 #3A302A #2A2420 #1E1A18, glass #5E6B78 #8C9AA8, hot key #FFFFFF (seams only).
```

### burn_lightning_big: lightning strike scar

Save as: `art/decals/raw/burn_lightning_big_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: GIANT LIGHTNING STRIKE SCAR. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4, drawn large with fine detail. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a blasted pit (about 35% of the cell) with a glassy rim, a huge Lichtenberg starburst of 8-12 main branches reaching the cell edge, a soot halo around the pit. HOT KEY: pure white #FFFFFF seams along the main branches.
Variants: 1) 10 branches; 2) 8 thick branches; 3) 12 thin branches; 4) off-center pit, long branches.
Palette: soot #4A3F37 #3A302A #2A2420 #1E1A18, glass #5E6B78 #8C9AA8, stone rim #A58D75 #8F7663, hot key #FFFFFF (seams only).
```

### fracture_lightning: lightning power-up

Save as: `art/decals/raw/fracture_lightning_vNN.png` (one image)

```text
Decal: LIGHTNING POWER-UP FRACTURE. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 2 variants in one image.
Shape: a flattened center disc (about 30%) with concentric ring cracks, radial cracks between the rings and lifted slab edges on the outer ring, plus thin electric burn tracks zig-zagging between the ring cracks and soot specks. HOT KEY: a few segments of the burn tracks are pure white #FFFFFF.
Variants: 1) two rings, 6 burn tracks; 2) three rings, dense tracks.
Palette: stone #F6F0E4 #E3D5BF #D2C1A8 #C4B29E #A58D75 #8F7663 #6E5A4A, soot #3A302A #2A2420, hot key #FFFFFF (track segments only).
```

### burn_fire: fire scorch

Save as: `art/decals/raw/burn_fire_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: FIRE SCORCH. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 6 variants over 2 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a round blackened soot blot with irregular flame-tongue edges, ash flecks, an ember rim in fire tones. HOT KEY: a few hot embers in pure white #FFFFFF.
Variants: 1) round blot; 2) oval with long flame tongues; 3) splashed blot; 4) ring of embers around a dark center; 5) small dense blot; 6) lopsided blot with ash trail.
Palette: soot #4A3F37 #3A302A #2A2420 #1E1A18, embers #7A2A10 #C4501A #F08A2A, hot key #FFFFFF (embers only).
```

### burn_black: black flame residue

Save as: `art/decals/raw/burn_black_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: BLACK FLAME RESIDUE. FULL COLOR. Floor decal, TOP-DOWN, square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: inky black-flame residue: irregular charred blotches with licking flame-shaped edges, dark crimson ember edges. No white at all, NO purple.
Variants: 1) one big blotch; 2) several merged blotches; 3) blotch with long licking flames; 4) ring-shaped residue.
Palette (black fire): #141012 #221A1C #3A2226 #5A1E1E. No hot key.
```

### scour_spiral: spiral-ground bowl

Save as: `art/decals/raw/scour_spiral_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: SPIRAL-GROUND BOWL. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 6 variants over 2 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a bowl ground into the stone in a clean spiral: 4-6 concentric spiral grooves all turning the same way, a polished pale interior, a chipped outer rim, cracks reaching 90% of the cell. HOT KEY: the freshest innermost groove is pure white #FFFFFF.
Variants: 1) 4 grooves; 2) 6 tight grooves; 3) wide bowl, 5 grooves; 4) small deep bowl; 5) grooves with chipped breaks; 6) slightly oval spiral.
Palette: stone #E3D5BF #D2C1A8 #C4B29E #A58D75 #8F7663 #6E5A4A, polished scour #F2EADC #E8DCC8 #B8A48C, hot key #FFFFFF (inner groove only).
```

### scour_spiral_big: giant spiral crater

Save as: `art/decals/raw/scour_spiral_big_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: GIANT SPIRAL-GROUND CRATER. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 3 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variant 3, drawn large with fine detail. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a large crater ground in a spiral: bowl about 50% of the cell, 6-8 spiral grooves turning the same way, rim slabs pushed outward, long cracks to the edge. HOT KEY: the innermost groove is pure white #FFFFFF.
Variants: 1) 6 grooves, 4 rim slabs; 2) 8 tight grooves; 3) wide bowl, many cracks.
Palette: stone #E3D5BF #D2C1A8 #C4B29E #B09A82 #A58D75 #8F7663 #6E5A4A, polished scour #F2EADC #E8DCC8 #B8A48C, hot key #FFFFFF (inner groove only).
```

### cut_wind: wind blade cuts

Save as: `art/decals/raw/cut_wind_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: WIND BLADE CUTS. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 6 variants over 2 images: IMAGE A = variants 1-3, IMAGE B = variants 4-6. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: dozens of razor-straight hairline cuts radiating from a center and crossing each other, like slashes from spinning wind blades; 3-6 sliced slab pieces slightly displaced along the cuts. No bowl. HOT KEY: a few of the cuts are pure white #FFFFFF.
Variants: 1) dense radial cuts; 2) crossing cuts in two directions; 3) long cuts with 4 displaced slabs; 4) a ring of short cuts; 5) sparse long cuts; 6) cuts with 6 small displaced slabs.
Palette: stone #F6F0E4 #E3D5BF #D2C1A8 #C4B29E #A58D75 #8F7663 #6E5A4A, hot key #FFFFFF (a few cuts only).
```

### claw: claw furrows

Save as: `art/decals/raw/claw_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: CLAW FURROWS. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, DIRECTIONAL (motion left to right), cells 2:1. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: 4 parallel, slightly curved deep claw furrows raked from left to right, gouged rubble pushed to the right end, burnt dark red-brown edges. HOT KEY: short pure white #FFFFFF streaks along the furrow bottoms.
Variants: 1) straight furrows; 2) furrows curving slightly up; 3) furrows curving slightly down; 4) deep short furrows with a big rubble pile.
Palette: stone #E3D5BF #C4B29E #A58D75 #8F7663 #6E5A4A #574638, burnt edges #5A1E1E #3A302A, hot key #FFFFFF (furrow streaks only).
```

### scorch_chakra: blast fan scar

Save as: `art/decals/raw/scorch_chakra_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: FORWARD BLAST SCAR. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, DIRECTIONAL (the blast travels left to right), square cells. 3 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variant 3, drawn large with fine detail. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a fan-shaped blast scar opening from the middle of the cell's left edge toward the right: blistered, scoured stone, radial streaks along the blast, rubble thrown to the right edge. HOT KEY: pure white #FFFFFF seams near the origin.
Variants: 1) narrow fan; 2) wide fan; 3) fan with a deep central groove.
Palette: stone #EFE6D7 #E3D5BF #C4B29E #A58D75 #8F7663 #6E5A4A, soot #4A3F37 #3A302A, hot key #FFFFFF (seams near the origin only).
```

### fracture_chakra: chakra pressure dish

Save as: `art/decals/raw/fracture_chakra_vNN.png` (one image)

```text
Decal: CHAKRA PRESSURE DISH. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 2 variants in one image.
Shape: a flattened circular dish (about 40% of the cell) with dust and grit swept outward in radial streaks (wind pressure), an outer crack ring with lifted slab edges. HOT KEY: a few faint specks of pure white #FFFFFF at the center.
Variants: 1) smooth dish, long streaks; 2) dish with a cracked rim, short streaks.
Palette: stone #F6F0E4 #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #A58D75 #8F7663, hot key #FFFFFF (center specks only).
```

### erasure: erased hollow

Save as: `art/decals/raw/erasure_vNN.png` (one image)

```text
Decal: ERASED HOLLOW. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 3 variants in one image.
Shape: a perfectly smooth-edged circular hollow, as if the stone was erased: a clean cut rim with a thin light highlight and a pure white #FFFFFF rim line (HOT KEY), a smooth dark slate interior. NO rubble, NO cracks. No purple.
Variants: 1) perfect circle; 2) slightly bigger circle with a double rim line; 3) circle with a faint inner ring.
Palette: cursed void #3C3A40 #2E2C33 #232128, rim highlight #F6F0E4, stone edge #C4B29E #A58D75, hot key #FFFFFF (rim line only).
```

### erasure_trench: erased trench segment

Save as: `art/decals/raw/erasure_trench_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: ERASED TRENCH SEGMENT. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, DIRECTIONAL (left to right), cells 2:1. 3 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variant 3. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a straight, smooth-walled trench segment running left to right across its whole cell, with perfectly parallel edges at the same height, a smooth dark slate interior and a clean cut rim with a pure white #FFFFFF rim line on both edges (HOT KEY). No rubble, no cracks, no purple. IT MUST TILE: the left end and the right end continue each other seamlessly (same width, same rim height, nothing that stops at the ends).
Variants: 1) plain trench; 2) trench with a faint center line; 3) slightly wider trench.
Palette: cursed void #3C3A40 #2E2C33 #232128, rim highlight #F6F0E4, stone edge #C4B29E #A58D75, hot key #FFFFFF (rim lines only).
```

### crush_implode: imploded floor

Save as: `art/decals/raw/crush_implode_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: IMPLODED FLOOR. FULL COLOR. Floor decal, TOP-DOWN, square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: cracks curling inward in a spiral into a central pit, slabs broken and dragged toward the center, rubble piled in the middle. No white.
Variants: 1) tight spiral; 2) loose spiral with big slabs; 3) deep pit, heavy rubble; 4) shallow pit, many curling cracks.
Palette (stone ring): #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #B09A82 #A58D75 #8F7663 #6E5A4A #574638. No hot key.
```

### gouge_repel: repelled gouges

Save as: `art/decals/raw/gouge_repel_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: REPELLED GOUGES. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, DIRECTIONAL (the force pushes left to right), cells 2:1. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: 5-8 straight gouges fanning out from the left edge to the right, rubble flung to the right end. HOT KEY: thin pure white #FFFFFF edges on the gouges near the origin.
Variants: 1) 5 wide gouges; 2) 8 thin gouges; 3) narrow fan; 4) wide fan with heavy rubble.
Palette: stone #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #A58D75 #8F7663 #6E5A4A, hot key #FFFFFF (edges near the origin only).
```

### fracture_cursed: glass fracture

Save as: `art/decals/raw/fracture_cursed_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: GLASS-LIKE FRACTURE. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: an angular fracture like broken glass: perfectly straight crack segments meeting at sharp angles, a perfectly circular flattened center, very clean, almost no rubble. HOT KEY: 2-3 crack segments are pure white #FFFFFF.
Variants: 1) 6 straight radial cracks with angled branches; 2) a triangular web; 3) long straight cracks, small center; 4) dense angular web.
Palette: stone #F6F0E4 #E3D5BF #D2C1A8 #C4B29E #A58D75 #8F7663 #6E5A4A, hot key #FFFFFF (2-3 segments only).
```

### fracture_cursed_big: geometric fracture

Save as: `art/decals/raw/fracture_cursed_big_vNN.png` (one image)

```text
Decal: LARGE GEOMETRIC FRACTURE. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 2 variants in one image, drawn large with fine detail.
Shape: a calm geometric fracture: concentric perfect circles plus straight radial cuts, a polished flattened center, no rubble. HOT KEY: a few cut lines are pure white #FFFFFF.
Variants: 1) three circles, 8 radial cuts; 2) four circles, 12 radial cuts.
Palette: stone #F6F0E4 #EFE6D7 #E3D5BF #D2C1A8 #C4B29E #A58D75 #8F7663, hot key #FFFFFF (a few cut lines only).
```

### scorch_ki: ki scorch

Save as: `art/decals/raw/scorch_ki_vNN_A.png`, `_B.png` (one version, 2 images)

```text
Decal: KI SCORCH. FULL COLOR + HOT KEY. Floor decal, TOP-DOWN, square cells. 4 variants over 2 images: IMAGE A = variants 1-2, IMAGE B = variants 3-4. Draw IMAGE A now; when I say "next", draw IMAGE B with the same scale and style.
Shape: a radial soot starburst: a scorched glassy core, soot rays reaching 90% of the cell. HOT KEY: a ring around the core in pure white #FFFFFF.
Variants: 1) 12 even rays; 2) uneven long and short rays; 3) dense short rays; 4) a lopsided burst.
Palette: soot #4A3F37 #3A302A #2A2420 #1E1A18, glass #5E6B78 #8C9AA8, hot key #FFFFFF (core ring only).
```

---

## 3. Fix-up prompts (paste in the same thread; save each result you keep as the next version)

**Not top-down (perspective, bowl wall visible)**

```text
Redraw the same decals seen exactly straight from above (orthographic, like a map). No perspective, no horizon, no visible side walls of the bowl: the pit is just a darker area in the middle. Keep everything else identical.
```

**Side light (one side brighter)**

```text
Remove the directional lighting. Shade radially only: darker toward the center and pit, lighter on the rim tops and lifted edges, the same on every side, so the decal looks right when rotated. Keep the shapes identical.
```

**Tile grid inside the decal**

```text
Remove every regular tile or grout line inside the decals. Broken pieces and slabs are irregular; the floor's own tile grid is added by the game. Keep everything else identical.
```

**Too soft / blurry / glowing**

```text
Redraw the same image as strict hard-edged pixel art: crisp square pixels, flat color bands, every pixel fully opaque, no glow haze, no gradients, no blur, no anti-aliasing. Background perfectly flat #FF00FF. Keep everything else identical.
```

**White where it does not belong**

```text
Pure white #FFFFFF may appear only on the hot seams I described. Replace every other white or near-white pixel with #F6F0E4 (or the lightest tone of the palette). Keep the shapes identical.
```

**Hot seams missing (HOT KEY names)**

```text
Draw the hot seams I described in pure white #FFFFFF (exactly #FFFFFF, not off-white), only there. Keep everything else identical.
```

**Wrong number of variants / touching / cropped**

```text
Redraw with exactly <N> variants in a single horizontal row, each fully inside its own equal cell, with wide flat #FF00FF gaps between them and around the image border. Nothing may touch the edge or another variant.
```

**Variants look the same**

```text
Make every variant clearly different: a different crack layout, a different outline shape and a different number of pieces, while keeping the same style, palette and scale.
```

**Pink, purple or violet inside a decal**

```text
Remove every pink, magenta, purple and violet pixel from the decals (use the palette tones instead), and make the background one perfectly flat #FF00FF with no shading.
```

**Directional decal wrong**

```text
The decal must go from LEFT to RIGHT (the motion starts at the left and ends at the right, with the pile or the widest part on the right) and each variant must be <2 / 4> times as wide as it is tall. Keep the style identical.
```

**Trench does not tile (erasure_trench)**

```text
Make each trench segment run straight across its whole cell with exactly the same width and rim height at the left end and the right end, so two segments placed side by side join seamlessly. Nothing may end, narrow or curve at the ends.
```

## 4. If the image generator refuses

These prompts describe shapes and colors only, with no franchise or artist names, so refusals should be
rare. If one happens: start a new thread, paste the preamble, then the prompt again. The body-shaped
hole in `crater_wall` can be worded as "a cartoon silhouette-shaped dent where a figure hit the wall".
Never add "in the style of <artist>" or character names; describe the look instead.
