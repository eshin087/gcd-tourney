# Decal brief: every ground-damage decal, variant by variant

Single source of truth for decal art. Prompts live in [`PROMPTS.md`](PROMPTS.md); the workflow,
packing notes and QA list in [`README.md`](README.md); the engine side and the reasons in
[ADR 0024](../../docs/decisions/0024-ground-damage-decals.md). The packer's copy of the contract is
`DECAL_SPECS` in `tools/pack-decals.mjs`; the procedural fallback with the same names is
`src/art/decalPainter.js`.

Contents: [Common rules](#common-rules) · [Palettes](#palettes) · [Style sheet](#decal_style_sheet-do-this-first) ·
base: [crack_s](#crack_s) [crack](#crack) [crater](#crater) [crater_big](#crater_big) [crater_huge](#crater_huge)
[fracture_ring](#fracture_ring) [scuff](#scuff) [skid](#skid) [rubble](#rubble) ·
edge: [dirt_crater](#dirt_crater) [dirt_skid](#dirt_skid) [barrier_crack](#barrier_crack) [crater_wall](#crater_wall) ·
lightning: [burn_lightning](#burn_lightning) [burn_lightning_big](#burn_lightning_big) [fracture_lightning](#fracture_lightning) ·
fire: [burn_fire](#burn_fire) [burn_black](#burn_black) ·
chakra: [scour_spiral](#scour_spiral) [scour_spiral_big](#scour_spiral_big) [cut_wind](#cut_wind) [claw](#claw)
[scorch_chakra](#scorch_chakra) [fracture_chakra](#fracture_chakra) ·
cursed: [erasure](#erasure) [erasure_trench](#erasure_trench) [crush_implode](#crush_implode) [gouge_repel](#gouge_repel)
[fracture_cursed](#fracture_cursed) [fracture_cursed_big](#fracture_cursed_big) · ki: [scorch_ki](#scorch_ki) ·
[Not in the contract yet](#not-in-the-contract-yet)

## How the game uses decals

- **Force picks the size.** Every impact has a force: a fall speed, a hit's weight and damage, a charge
  length. Small forces leave `crack_s` (about 1.4-2.2 world units across), then `crack`, `crater`,
  `crater_big`, and the biggest hits `crater_huge` (about 5.4-7.6 units, four or five fighters wide).
  Big impacts add satellites (`crack_s`, `crack`), a `fracture_ring` underlay and `rubble` around the
  rim, plus 3D rock chunks and dust. So each variant must read on its own **and** under or over others.
- **Element picks the overlay.** A fighter's style draws an element decal over or instead of the stone
  crater: lightning burns for Killua and Sasuke, chakra scours for Naruto, cursed fractures for Gojo,
  fire for Sasuke's fireball. The tint (the fighter's color) comes from the engine.
- **Variety.** The engine cycles through every variant before repeating, rotates flat decals a full
  360 degrees, mirrors half of them and jitters size by +-10%. More distinct variants = less repetition.
- **Fade.** Decals fade out pixel by pixel (a dithered dissolve), hot seams cool from the tint to soot.

## Common rules

Every decal image follows these, without exception.

- **Canvas**: one wide image **1536 x 1024** on perfectly flat magenta **#FF00FF**. The variants of
  that image sit in **ONE horizontal row**, left to right, each in its own imaginary cell of the
  same size, with **wide magenta gaps** between them and around the border. Nothing touches the image
  edge or another variant.
- **Save as** `art/decals/raw/<name>_vNN.png`, or, when a name needs several images (most do, see each
  section), as **parts of one version**: `<name>_vNN_A.png`, `_B.png`, `_C.png` (same `NN`, letters in
  order). The packer joins the parts; nobody stitches.
- **Floor decals are drawn STRAIGHT TOP-DOWN**: orthographic, no perspective, no horizon, no bowl walls
  seen from the side. The 3D camera adds the perspective in game.
- **Shading is RADIAL ONLY**: darker toward the pit, lighter on the rim tops and lifted edges. **No
  directional light** (no "lit from the upper left"): the engine rotates every floor decal at random
  and lights it with the scene. Wall decals (`crater_wall`) are never rotated and may take light from above.
- **No tile grid**: no regular tile or grout lines inside a decal; the floor's grid shows around it.
  Broken pieces and slabs are irregular.
- **Soft outer edge in shape, hard in pixels**: the outer ~10% of each variant holds only thin crack
  tips and loose pebbles, so overlapping decals blend into each other and into the floor.
- **Hard pixel art**: crisp square pixels, fully opaque or fully transparent (no half-transparent
  pixels, no blur, no soft gradients, no glow haze, no dithering fills), **<= 24 colors per name**, no
  text, no shadow on the background.
- **HOT KEY**: pure **#FFFFFF** is reserved for glowing hot seams. The engine makes those pixels glow
  in the fighter's tint, then cools them. Only the names marked **hot key** use it, only where their
  section says; **no other pixel may be pure white** (the lightest stone tone is #F6F0E4).
- **Never magenta, hot pink, purple or violet inside a decal.** Gojo's and Amaterasu's purple comes
  from the runtime tint.
- **Directional** decals are drawn with the motion going **left to right** and keep their cell's
  proportions (256 x 128 and 512 x 256 = 2:1, 512 x 128 = 4:1).
- **Size**: final cells use **ppu 64** (256 px = 4 world units, 512 px = 8 world units). The packer
  scales each image so its largest variant fills 97% of its cell and centers every variant; only the
  sizes relative to each other within one image come from the art. Fill the image well: about 400-450
  px per 256-class variant and 600-700 px per 512-class variant.

## Palettes

Hex tones to use (each name lists which). Hard bands between tones; pick at most 24 per name.

| palette | tones |
|---|---|
| **Stone ring** (matches the approved `public/stage/ringTop.png`) | surface #E3D5BF, light #EFE6D7, chip highlight #F6F0E4, broken mid #D2C1A8, shade #C4B29E, deep shade #B09A82, rim / grout #A58D75, crack #8F7663, deep crack #6E5A4A, pit #574638 |
| **Soot** | #4A3F37, #3A302A, #2A2420, #1E1A18 |
| **Lightning glass** | #5E6B78, #8C9AA8 |
| **Fire embers** | #7A2A10, #C4501A, #F08A2A |
| **Black fire** | #141012, #221A1C, #3A2226, #5A1E1E |
| **Polished scour** | #F2EADC, #E8DCC8, #B8A48C |
| **Cursed void** | #3C3A40, #2E2C33, #232128, with a #F6F0E4 rim |
| **Grass** | #73CE63, #52AD4C, #4CA649, #429843, #32743A, #2D7335 |
| **Earth** | #8A6A48, #6E5236, #54402A, #3E2F20 |
| **Brick wall** | #DDB5A1, #C08C74, #A87660, #8B7669, #6E5A50, #4A3A34, #B89C82 |
| **White only** (tinted) | #FFFFFF, #E6E6E6, #C8C8C8, #A8A8A8 |
| **Hot key** | #FFFFFF (glowing seams only) |

## Summary

| name | group | cell | variants | images (variants each) | color | used for |
|---|---|---|---|---|---|---|
| `crack_s` | base | 256 x 256 | 8 | 3 (3/3/2) | stone | light landings, super-jump takeoff, charge stage 1, satellites |
| `crack` | base | 256 x 256 | 8 | 3 (3/3/2) | stone | hard landings, weak ground bounces, satellites |
| `crater` | base | 256 x 256 | 8 | 3 (3/3/2) | stone | ground bounces, dive slams, specials on a grounded victim |
| `crater_big` | base | 512 x 512 | 6 | 3 (2/2/2) | stone | strong ground bounces, KO landings, super finishers, special trades |
| `crater_huge` | base | 512 x 512 | 4 | 2 (2/2) | stone + soot | ultimate clash win/draw, max KO slams |
| `fracture_ring` | base | 512 x 512 | 4 | 2 (2/2) | stone | max charge (characters without their own fracture), big-impact underlay |
| `scuff` | base | 256 x 128, directional | 8 | 2 (4/4) | stone | dashes, wavedash slides, landing slides |
| `skid` | base | 512 x 128, directional | 4 | 2 (2/2) | stone | knockdown and KO slides |
| `rubble` | base | 256 x 256 | 6 | 2 (3/3) | stone | settled debris around big crater rims |
| `dirt_crater` | edge | 256 x 256 | 4 | 2 (2/2) | grass + earth | KO landings off the ring, Hollow Purple past the edge |
| `dirt_skid` | edge | 512 x 128, directional | 3 | 2 (2/1) | grass + earth | KO slides on grass |
| `barrier_crack` | edge | 256 x 256, wall | 6 | 2 (3/3) | white only (tinted) | wall bounces on the ki barrier |
| `crater_wall` | edge | 512 x 512, wall | 4 | 2 (2/2) | brick | KO crashes into the stands |
| `burn_lightning` | lightning | 256 x 256 | 6 | 2 (3/3) | soot + glass + hot key | Thunderbolt landings, Narukami / Chidori Spear floor hits, Speed of Lightning |
| `burn_lightning_big` | lightning | 512 x 512 | 4 | 2 (2/2) | soot + glass + hot key | Kirin |
| `fracture_lightning` | lightning | 512 x 512 | 2 | 1 (2) | stone + soot + hot key | lightning max power-up (Killua, Sasuke) |
| `burn_fire` | fire | 256 x 256 | 6 | 2 (3/3) | soot + embers + hot key | Sasuke's fireball |
| `burn_black` | fire | 256 x 256 | 4 | 2 (2/2) | black fire | Amaterasu |
| `scour_spiral` | chakra | 256 x 256 | 6 | 2 (3/3) | stone + scour + hot key | Rasengan |
| `scour_spiral_big` | chakra | 512 x 512 | 3 | 2 (2/1) | stone + scour + hot key | Giant Rasengan finish, Shadow Clone Barrage |
| `cut_wind` | chakra | 256 x 256 | 6 | 2 (3/3) | stone + hot key | Rasenshuriken |
| `claw` | chakra | 512 x 256, directional | 4 | 2 (2/2) | stone + soot + hot key | Four-Tails maul |
| `scorch_chakra` | chakra | 512 x 512, directional | 3 | 2 (2/1) | stone + soot + hot key | Four-Tails chakra roar |
| `fracture_chakra` | chakra | 512 x 512 | 2 | 1 (2) | stone + hot key | Naruto's max power-up |
| `erasure` | cursed | 256 x 256 | 3 | 1 (3) | cursed void + hot key | Hollow Purple caps |
| `erasure_trench` | cursed | 512 x 256, directional, tiles along x | 3 | 2 (2/1) | cursed void + hot key | Hollow Purple path |
| `crush_implode` | cursed | 256 x 256 | 4 | 2 (2/2) | stone | Lapse: Blue |
| `gouge_repel` | cursed | 512 x 256, directional | 4 | 2 (2/2) | stone + hot key | Reversal: Red |
| `fracture_cursed` | cursed | 256 x 256 | 4 | 2 (2/2) | stone + hot key | Gojo's specials and charge |
| `fracture_cursed_big` | cursed | 512 x 512 | 2 | 1 (2) | stone + hot key | Gojo's max power-up |
| `scorch_ki` | ki | 256 x 256 | 4 | 2 (2/2) | soot + glass + hot key | chakra overlay, generic ki (future fighters) |

Altogether **31 names, 143 variants, about 62 images**, plus the style sheet.

---

## decal_style_sheet (do this first)

- **Needs the user's approval before any other decal batch** (the queue holds them back until the
  approved copy exists).
- **Save as** `art/decals/reference/decal_style_sheet_vNN.png`; when approved, copy it to
  `art/decals/reference/decal_style_sheet.png` and attach that to every decal prompt.
- **Look:** 1536 x 1024 on #FF00FF, a 3 x 2 grid of top-down samples in the palettes above, one per
  cell with wide gaps: `crack`, `crater`, `crater_big` (top row), `burn_lightning`, `scour_spiral`,
  `erasure` (bottom row). It fixes the pixel density, the radial shading, the stone tones and the hot-key
  use for everything after it.

## base group (stone ring)

### crack_s

- **Cell** 256 x 256 (4 units), **8 variants**, 3 images (3/3/2). Stone palette. No hot key.
- **Look:** a hairline crack star with **no bowl**: 3-6 thin jagged cracks from a tiny chipped point,
  1-3 tiny chips beside it. Cracks reach 70-95% of the cell (vary it per variant).
- **In game:** light landings, super-jump takeoff, charge stage 1, satellites around big craters.

### crack

- **Cell** 256 x 256, **8 variants**, 3 images (3/3/2). Stone palette. No hot key.
- **Look:** a medium radial crack web around a small shattered center: a dent about 15% of the cell
  with 4-8 chipped shards, 6-10 branching cracks reaching 90-97%, a few loose pebbles.
- **In game:** hard landings, weak ground bounces, satellites.

### crater

- **Cell** 256 x 256, **8 variants** (replaces the old 3-variant VFX crater), 3 images (3/3/2). Stone
  palette. No hot key.
- **Look:** a shallow bowl 40-55% of the cell, a broken irregular rim of 6-12 chunky shards, the
  interior radially darker toward the pit (no side light), 7-10 cracks reaching 95%, pebbles. Vary the
  shape: round, oval, lopsided, double dent.
- **In game:** ground bounces, dive slams, specials on a grounded victim.

### crater_big

- **Cell** 512 x 512 (8 units), **6 variants**, 3 images (2 per image). Stone palette. No hot key.
- **Look:** a deep bowl 40-50% of the cell with a terraced, broken rim and 3-5 large tilted slab
  fragments around it, long cracks crossing toward the edge, a rubble field.
- **In game:** strong ground bounces, KO landings, super finishers, special trades.

### crater_huge

- **Cell** 512 x 512, **4 variants**, 2 images (2 per image). Stone palette, soot for the pit.
- **Look:** a massive impact: bowl 55-70% of the cell, inner and outer fracture rings, 8-12 wide
  fissures reaching the cell edge, heavy rubble, a dark pit center (#574638 to #2A2420).
- **In game:** ultimate clash win and draw, max KO slams.

### fracture_ring

- **Cell** 512 x 512, **4 variants**, 2 images (2 per image). Stone palette. No hot key.
- **Look:** generic power-up pressure with **no bowl**: a slightly flattened center disc (about 30%)
  with hairline concentric ring cracks, radial cracks between the rings, lifted slab edges on the outer
  ring (about 85% of the cell).
- **In game:** max charge for characters without their own fracture; underlay of the biggest impacts.

### scuff

- **Cell** 256 x 128 (4 x 2 units), **DIRECTIONAL** (motion left to right), **8 variants**, 2 images
  (4 per row). Stone palette. No hot key.
- **Look:** shoe and slide scrape streaks: pale scraped lines along the motion, smeared grit, a small
  grit pile at the right end. Draw each variant about twice as wide as tall.
- **In game:** dashes, wavedash slides, landing slides.

### skid

- **Cell** 512 x 128 (8 x 2 units), **DIRECTIONAL**, **4 variants**, 2 images (2 per row). Stone palette.
- **Look:** a body-drag groove that widens from left to right, chipped edges, a pushed-up grit and
  rubble pile at the right end. Each variant about four times as wide as tall.
- **In game:** knockdown and KO slides.

### rubble

- **Cell** 256 x 256, **6 variants**, 2 images (3 per image). Stone palette. No hot key.
- **Look:** loose pebbles and chips scattered in a broken ring (no cracks, no bowl), the center about
  40% empty. Pebbles 2-8 final pixels, a few bigger chips.
- **In game:** settled debris laid around big crater rims.

## edge group (grass, barrier, stand walls)

### dirt_crater

- **Cell** 256 x 256, **4 variants**, 2 images (2 per image). Grass + earth palettes. No hot key.
- **Look:** a crater gouged into a grass lawn, top-down: torn turf edge, an exposed brown earth bowl,
  flung dirt and grass clumps around it.
- **In game:** KO landings off the ring, Hollow Purple past the ring edge.

### dirt_skid

- **Cell** 512 x 128, **DIRECTIONAL**, **3 variants**, 2 images (2 + 1). Grass + earth palettes.
- **Look:** a furrow plowed through grass, torn turf curled up along both sides, an earth pile at the
  right end. About four times as wide as tall.
- **In game:** KO slides on grass.

### barrier_crack

- **Cell** 256 x 256, **WALL** decal seen **FACE-ON** on the invisible hexagonal ki barrier,
  **6 variants**, 2 images (3 per image). **WHITE ONLY** (tinted): #FFFFFF, #E6E6E6, #C8C8C8,
  #A8A8A8; no outline, no color.
- **Look:** a spiderweb crack from the impact point: near the center the lines follow hexagon-cell
  edges, then turn into straight radial fractures. 2-4 hex cells near the center are knocked out
  (filled flat #FFFFFF).
- **In game:** wall bounces; drawn additive in the barrier color (#7AD8FF; cyan #3FD6FF in the training
  room), it flickers and dissolves into falling shards after about 2.4 s.

### crater_wall

- **Cell** 512 x 512, **WALL** decal seen **FACE-ON** on the brick stand wall, **4 variants**, 2 images
  (2 per image: image A = variants 1-2, image B = variants 3-4). Brick palette. No hot key. Light from
  above is allowed (walls are never rotated).
- **Look:** variants 1-2: a body-silhouette crater imprint, arms and legs spread (the classic anime
  person-shaped hole). Variants 3-4: a round blast hole. Jagged broken-brick outline, a dark rubble
  interior, cracks running through the brick courses.
- **In game:** KO crashes into the stands; stays until the round resets.

## lightning group (Killua, Sasuke)

### burn_lightning

- **Cell** 256 x 256, **6 variants**, 2 images (3 per image). Soot + lightning glass. **Hot key.**
- **Look:** a Lichtenberg-figure fern scorch: dark soot branches forking outward to 95% of the cell, a
  small fused glassy center in cool grey glass tones, and the main branches' center seams in pure
  **#FFFFFF** (hot key).
- **In game:** Thunderbolt landings, Narukami / Chidori Spear floor hits, Speed of Lightning finishes;
  the overlay of every lightning-style impact.

### burn_lightning_big

- **Cell** 512 x 512, **4 variants**, 2 images (2 per image). Soot + lightning glass. **Hot key.**
- **Look:** a Kirin strike: a blasted pit (about 35%) with a glassy rim, a huge Lichtenberg starburst of
  8-12 main branches reaching the cell edge, a soot halo, hot-key seams along the main branches.
- **In game:** Kirin.

### fracture_lightning

- **Cell** 512 x 512, **2 variants**, 1 image. Stone + soot. **Hot key.**
- **Look:** the `fracture_ring` layout (flattened center, ring cracks, radial cracks, lifted outer
  slabs) with thin electric burn tracks zig-zagging between the ring cracks, soot specks, hot key on a
  few track segments.
- **In game:** lightning max power-up (Killua, Sasuke).

## fire group (Sasuke)

### burn_fire

- **Cell** 256 x 256, **6 variants**, 2 images (3 per image). Soot + fire embers. **Hot key.**
- **Look:** a round blackened soot blot with irregular flame-tongue edges, ash flecks, an ember rim in
  fire tones, a few **#FFFFFF** hot embers.
- **In game:** Sasuke's fireball hitting the floor.

### burn_black

- **Cell** 256 x 256, **4 variants**, 2 images (2 per image). Black fire palette. **No hot key, NO purple.**
- **Look:** inky black-flame residue: irregular charred blotches with licking flame-shaped edges, dark
  crimson ember edges.
- **In game:** Amaterasu; lingers under the burning victim.

## chakra group (Naruto)

### scour_spiral

- **Cell** 256 x 256, **6 variants**, 2 images (3 per image). Stone + polished scour. **Hot key.**
- **Look:** a bowl ground into a clean spiral: 4-6 concentric spiral grooves all turning the same way,
  a polished pale interior, a chipped outer rim, cracks to 90%, the freshest inner groove in
  **#FFFFFF** (hot key).
- **In game:** Rasengan.

### scour_spiral_big

- **Cell** 512 x 512, **3 variants**, 2 images (2 + 1). Stone + polished scour. **Hot key.**
- **Look:** a large spiral-ground crater: bowl about 50%, 6-8 spiral grooves, rim slabs pushed outward,
  long cracks, a hot-key inner groove.
- **In game:** Giant Rasengan finish, Shadow Clone Barrage.

### cut_wind

- **Cell** 256 x 256, **6 variants**, 2 images (3 per image). Stone. **Hot key.**
- **Look:** dozens of razor-straight hairline cuts radiating and crossing (wind blades), 3-6 sliced slab
  pieces slightly displaced along the cuts, a few cuts in **#FFFFFF**. No bowl.
- **In game:** Rasenshuriken.

### claw

- **Cell** 512 x 256 (8 x 4 units), **DIRECTIONAL**, **4 variants**, 2 images (2 per row). Stone + soot.
  **Hot key.**
- **Look:** 4 parallel, slightly curved deep claw furrows running left to right, gouged rubble pushed to
  the right end, burnt dark red-brown edges (#5A1E1E / #3A302A), short **#FFFFFF** streaks along the
  furrow bottoms (tinted chakra red at runtime). About twice as wide as tall.
- **In game:** the Four-Tails maul (repeated slams grow one claw mark).

### scorch_chakra

- **Cell** 512 x 512, **DIRECTIONAL**, **3 variants**, 2 images (2 + 1). Stone + soot. **Hot key.**
- **Look:** a forward fan-shaped blast scar opening from the middle of the left edge toward the right:
  blistered, scoured stone, radial streaks along the blast, rubble thrown to the right edge, hot-key
  seams near the origin.
- **In game:** the Four-Tails chakra roar, pointing at the victim.

### fracture_chakra

- **Cell** 512 x 512, **2 variants**, 1 image. Stone. **Hot key** (faint).
- **Look:** a flattened circular dish (about 40%) with dust and grit swept outward in radial streaks
  (wind pressure), an outer crack ring with lifted slab edges, a few faint **#FFFFFF** specks at the
  center.
- **In game:** Naruto's max power-up.

## cursed group (Gojo)

### erasure

- **Cell** 256 x 256, **3 variants**, 1 image. Cursed void palette. **Hot key.**
- **Look:** a perfectly smooth-edged circular hollow: a clean cut rim (a thin #F6F0E4 highlight and a
  **#FFFFFF** hot-key rim line), a smooth dark slate interior. **No rubble, no cracks** (the matter is
  erased). No purple.
- **In game:** Hollow Purple's start and end caps.

### erasure_trench

- **Cell** 512 x 256, **DIRECTIONAL**, **TILES ALONG X**, **3 variants**, 2 images (2 + 1). Cursed void
  palette. **Hot key.**
- **Look:** a straight smooth-walled trench segment running left to right with perfectly parallel edges
  at the same height, a dark slate interior, hot-key rim lines, no rubble. **It must tile**: the left
  and right ends continue each other seamlessly (same width, same rim height, nothing that stops at the
  ends). Draw it touching neither image border but running the full width of its slot; the packer
  stretches it edge to edge of the cell.
- **In game:** the Hollow Purple path, stamped as a chain of segments.

### crush_implode

- **Cell** 256 x 256, **4 variants**, 2 images (2 per image). Stone. **No hot key.**
- **Look:** inward-curling cracks spiraling into a central pit, slabs broken and dragged toward the
  center, rubble piled in the middle.
- **In game:** Lapse: Blue.

### gouge_repel

- **Cell** 512 x 256, **DIRECTIONAL**, **4 variants**, 2 images (2 per image). Stone. **Hot key.**
- **Look:** 5-8 straight gouges fanning out from the left edge to the right, rubble flung to the right
  end, thin **#FFFFFF** edges near the origin. About twice as wide as tall.
- **In game:** Reversal: Red.

### fracture_cursed

- **Cell** 256 x 256, **4 variants**, 2 images (2 per image). Stone. **Hot key.**
- **Look:** an angular, glass-like fracture: perfectly straight crack segments meeting at sharp angles,
  a perfectly circular flattened center, very clean (almost no rubble), 2-3 **#FFFFFF** segments.
- **In game:** Gojo's specials and charge.

### fracture_cursed_big

- **Cell** 512 x 512, **2 variants**, 1 image. Stone. **Hot key.**
- **Look:** a large, calm geometric fracture: concentric perfect circles plus straight radial cuts, a
  polished flattened center, no rubble, a few **#FFFFFF** cut lines.
- **In game:** Gojo's max power-up.

## ki group (generic)

### scorch_ki

- **Cell** 256 x 256, **4 variants**, 2 images (2 per image). Soot + lightning glass. **Hot key.**
- **Look:** a radial soot starburst with a scorched glassy core, a **#FFFFFF** hot-key core ring, soot
  rays reaching 90% of the cell.
- **In game:** the chakra-style overlay (Naruto's normal specials) and generic ki fighters to come.

## Not in the contract yet

- `scour_beam` (ki, optional, low priority, for a future beam ultimate): top-down DIRECTIONAL 512 x 256,
  3 variants, 2 images: a shallow scoured groove under a beam, tileable along x, soot edges, a hot-key
  center line. The engine and the packer do not know this name yet: art made ahead of time goes in
  `raw/_proposed/` until a Claude task adds it (see [README.md](README.md#adding-a-new-decal-name)).
- `dustWave` (the rolling dust ring around big craters) is a **VFX** effect, not a decal: it is briefed
  with the effects in `art/vfx/` once the engine adds it.
