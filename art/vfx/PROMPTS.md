# VFX image prompts

Copy-paste prompts for every effect in [`EFFECTS.md`](EFFECTS.md), for Codex's built-in image
generator or a ChatGPT chat run by the user. Read [`README.md`](README.md) for the rules and the
workflow. VFX cells did not change in spec v2 (128 x 128, ppu 56); only the file names are versioned.

## How to use

1. Start a **new thread** (one thread per effect, or a few related effects, keeps it focused).
2. Give the **Preamble** (section 0) as the first message.
3. Give one **effect prompt**. If the approved `art/vfx/reference/vfx_style_sheet.png` exists
   (section 1), attach it to every effect prompt so all effects share one style.
4. Check the result against the QA list in `README.md`. If something is off, use a **fix-up prompt**
   (section 3) in the same thread.
5. Save the image under the "Save as" name with the **next free version** in place of `NN`
   (`spark_v01.png`, `spark_v02.png`, ...; never overwrite or reuse a number), add a `needs review`
   row to `art/REVIEW.md`, then run `node tools/pack-sprites.mjs vfx --candidates` (it packs the highest
   version into `public/preview/vfx/` for a `?art=custom` check; `npm run sprites vfx` ships approved effects only).

Tips:

- Image generators draw better pixel art when there are fewer frames per image. If a strip comes out
  mushy, ask for the first half and the second half as two images and stitch them left to right into
  one `raw/<effect>_vNN.png`, or save the single frames as `raw/<effect>_00.png`, `_01.png`... (same
  convention as characters; check the packer report to confirm they were picked up).
- Sizes in the prompts are given as **% of the frame's square cell**, because the packer scales the
  whole strip with one factor. Relative sizes between frames matter more than absolute pixels.
- "WHITE-ONLY" effects are tinted by the game (character color, hit color...). They must stay white
  and light grey.

---

## 0. Preamble (paste once at the start of every thread)

```text
You are drawing pixel-art visual-effect sprite strips for a 2.5D anime arena fighting game (anime fan-art style, modern anime fighting game hit effects, HD-2D pixel art). I will send one effect at a time. Follow these rules for every image:

LAYOUT
- One single wide landscape image (1536x1024).
- Exactly the number of frames I ask for, in ONE horizontal row, left to right in playback order.
- Each frame lives in its own imaginary square cell of the same size. Cells are evenly spaced, with wide empty gaps between frames and around the image border. Nothing touches another frame or the image edge.
- CENTER-ANCHORED effects: the effect's center is at the exact center of its cell in every frame. BOTTOM-ANCHORED effects: every frame stands on the same invisible ground line near the bottom of its cell, horizontally centered.
- Keep ONE scale for the whole strip. Sizes change between frames only as I describe (things grow, shrink, break apart). Never zoom a frame to fill its cell.

BACKGROUND
- Perfectly flat solid magenta #FF00FF everywhere outside the effect. No shadow, no glow haze, no vignette, no floor, no texture on the background.
- Never use magenta, hot pink, purple or violet inside the effect.

STYLE
- Hard-edged pixel art: crisp square pixels at a fine resolution (each frame is about 128 art pixels across), flat cel-shaded color bands with hard edges.
- No anti-aliasing, no blur, no soft gradients, no airbrush glow, no noise or dithering fills, no motion blur, no lens flare. Motion is shown with solid smear shapes and speed lines only.
- Bold, readable silhouettes like the impact effects in modern anime fighting games.
- No text, letters, numbers, labels, grid lines, frame borders or watermarks.

COLOR MODES
- When I say WHITE-ONLY: use only pure white #FFFFFF and light greys #E6E6E6, #C8C8C8 (and #A8A8A8 if needed). No color at all, no dark outline. The game tints these effects at runtime.
- When I say FULL COLOR: use only the hex palette I give, with hard bands between tones. An outline in the effect's own darkest tone is allowed; avoid pure black.

Reply only "Ready" and wait for the first effect.
```

---

## 1. VFX style sheet (optional, do this first)

Save as: `art/vfx/reference/vfx_style_sheet_vNN.png` (reference only, never packed). When the user
approves one, copy it to `art/vfx/reference/vfx_style_sheet.png` and attach that to every later
effect prompt.

```text
Make a single style-reference sheet for all the effects of this game: a 5 x 3 grid of 15 effects on flat magenta #FF00FF, each in its own square cell with wide gaps, one representative frame each, all in one consistent hard-edged pixel-art style.
Row 1 (WHITE-ONLY): a fat crescent hit slash with a 4-point flare at its tip; a solid 10-spike comic impact starburst; a flat horizontal shockwave ring (oval, 1 : 0.55); a sharp 4-point star flare; a circle of ~14 thin radial impact spikes around an empty center.
Row 2: a sharp upward flame tongue (WHITE-ONLY); a thin vertical light streak (WHITE-ONLY); a cluster of jagged electric bolts radiating from a bright knot (WHITE-ONLY); a soft light disc made of 3 hard concentric rings white #FFFFFF / grey #B4B4B4 / dark grey #5A5A5A; a round ball of fire (FULL COLOR: #7A1A08 #C42A10 #F05A14 #FF9A24 #FFD04A #FFF4C0).
Row 3 (FULL COLOR): a sphere of spinning blue wind energy with spiral bands and a white core (#1C3FA8 #3A7CF0 #7AB8FF #BFE4FF #E8F6FF #FFFFFF); a steel 4-blade ninja throwing star seen face-on (#1A1A24 #3A3F4C #5A6070 #8A92A2 #C8D0DC #F0F4FA); a cluster of round sand-colored dust puffs on the ground (#F3EADB #E4D2BB #CDB9A2 #B39A80 #9C8370); a bulging anime smoke-bomb poof cloud (#FFFFFF #ECEEF2 #CFD3DC #A9AEBC #858A9A); a top-down crater smashed into beige stone floor tiles with radiating cracks (#EADBC6 #DDC9B0 #CFB79C #C8AD92 #A99079 #9C8370 #8F7663 #6E5A4A).
Light comes from the upper right. No text or labels.
```

---

## 2. Effect prompts

### spark: crescent hit slash

Save as: `art/vfx/raw/spark_vNN.png`

```text
Effect: HIT SLASH CRESCENT. WHITE-ONLY. 5 frames. CENTER-ANCHORED. Plays in 0.15 s when a punch or kick connects.
Shape: a fat, sharp-tipped crescent moon shape (thick in the middle, tapering to needle points), convex side facing RIGHT, centered on the cell center. A small sharp 4-point star flare sits on the crescent's right (outer) edge.
Frame 1: small, very bright, thick crescent; its height is about 35% of the cell. Big 4-point flare about 30% of the cell wide.
Frame 2: crescent grows (height about 45% of the cell), still thick. Flare about 23% of the cell.
Frame 3: height about 55%, the middle thins, tips get longer and sharper. Flare about 15%.
Frame 4: height about 65%, thin crescent. No flare.
Frame 5: height about 75%, broken into 2-3 thin arc fragments about to vanish.
Colors: white #FFFFFF body, #E6E6E6 band along the inner edge. No outline.
```

### burst: spiky impact starburst

Save as: `art/vfx/raw/burst_vNN.png`

```text
Effect: IMPACT STARBURST. WHITE-ONLY. 5 frames. CENTER-ANCHORED. Plays in 0.18 s on heavy hits.
Shape: a solid comic-book impact starburst with 10 spikes of uneven length, centered on the cell center, which gets hollowed out from the middle until only the spike tips remain.
Frame 1: compact solid starburst, about 70% of the cell across (spike tips), deep valleys between spikes.
Frame 2: bigger, about 75% of the cell, still solid.
Frame 3: biggest, about 80% of the cell; a small round hole opens in the exact center (about 20% of the cell across).
Frame 4: the hole grows to about 50% of the cell: it now reads as a jagged ring of spikes.
Frame 5: the hole reaches about 80% of the cell: only separate spike-tip shards remain.
Colors: solid white #FFFFFF, optional #E6E6E6 band near the spike bases. No outline.
```

### ring: shockwave ring

Save as: `art/vfx/raw/ring_vNN.png`

```text
Effect: SHOCKWAVE RING. WHITE-ONLY. 6 frames. CENTER-ANCHORED. Plays in 0.21 s.
Shape: a flat horizontal oval ring outline (width : height = 1 : 0.55, like a ring on the ground seen from a slightly raised camera), centered on the cell center, expanding and thinning out. Slightly thicker on its bottom (front) edge.
Frame widths (% of the cell) and line thickness: 1) 25%, very thick, almost a filled oval; 2) 39%, thick; 3) 53%; 4) 66%, medium-thin; 5) 80%, thin; 6) 94%, very thin and broken into dashes.
Colors: white #FFFFFF line, optional #C8C8C8 inner edge row. No outline.
```

### dust: ground dust puff

Save as: `art/vfx/raw/dust_vNN.png`

```text
Effect: GROUND DUST PUFF. FULL COLOR. 6 frames. BOTTOM-ANCHORED (all frames sit on the same ground line, horizontally centered). Plays in 0.36 s when a fighter runs, dashes or lands.
Shape: a small cluster of round, chunky cartoon dust puffs kicked up from the ground, spreading sideways and drifting up while shrinking. Anime style, not realistic smoke.
Frame 1: tight cluster of 3-4 round puffs sitting on the ground line, about 30% of the cell wide and 15% tall.
Frame 2: spreads to about 40% wide, top puffs lifting (20% tall).
Frame 3: fullest, about 50% wide, 27% tall.
Frame 4: about 56% wide, puffs shrinking and separating, gaps appear.
Frame 5: about 60% wide (the widest frame), 4-5 smaller separate puffs drifting up and out.
Frame 6: 2-3 tiny puffs at the edges, almost gone.
Palette (warm sand): highlight #F3EADB, light #E4D2BB, mid #CDB9A2, shadow #B39A80, outline #9C8370. Light from the upper right.
```

### smoke: vanish poof

Save as: `art/vfx/raw/smoke_vNN.png`

```text
Effect: SMOKE-BOMB POOF. FULL COLOR. 7 frames. CENTER-ANCHORED. Plays in 0.39 s when a ninja vanishes, and around explosions.
Shape: a classic anime smoke-bomb poof: a bulging cloud made of round puffs that bursts out from the center, then breaks into separate puffs that drift up and shrink away. Bold and cel-shaded, not wispy.
Frame 1: dense compact round cloud, about 33% of the cell, very white.
Frame 2: billows out to about 48%, bumpy cloud outline, shading on the lower left.
Frame 3: full cloud, about 62% of the cell.
Frame 4: about 70% (the biggest frame), starting to split into 5-6 separate puffs, rising slightly.
Frame 5: puffs smaller with holes between them, rising a bit more.
Frame 6: 3-4 small puffs drifting outward and up.
Frame 7: 2-3 tiny wisps, almost gone.
Palette (cool neutral, no pink or lavender): highlight #FFFFFF, light #ECEEF2, mid #CFD3DC, shadow #A9AEBC, outline #858A9A. Light from the upper right.
```

### shuriken: spinning throwing star

Save as: `art/vfx/raw/shuriken_vNN.png`

```text
Effect: SPINNING THROWING STAR. FULL COLOR. 4 frames. CENTER-ANCHORED. Loops while the projectile flies (0.16 s per loop).
Shape: a classic steel 4-blade ninja throwing star seen flat, face-on: four sharp pointed blades, a round hole in the exact center, bright bevel highlights along the blade edges. Optional 1-2 px solid white speed arcs just behind the blade tips (no blur). Same size in every frame, about 33% of the cell across. The center hole stays on the exact cell center.
Frame 1: blades pointing up, right, down, left (0 degrees).
Frame 2: rotated 22.5 degrees clockwise.
Frame 3: rotated 45 degrees (an X shape).
Frame 4: rotated 67.5 degrees clockwise (the next 22.5 degrees brings it back to frame 1, so the loop is seamless).
Palette (steel): outline and hole #1A1A24, dark #3A3F4C, mid #5A6070, light #8A92A2, highlight #C8D0DC, glint #F0F4FA.
```

### fire: fireball

Save as: `art/vfx/raw/fire_vNN.png`

```text
Effect: ROARING FIREBALL. FULL COLOR. 4 frames. CENTER-ANCHORED. Loops (0.24 s) while a big breathed fireball flies; small copies also form its trail.
Shape: a round ball of fire with a dense bright core and layered flame tongues licking outward all around its edge (slightly more upward). NO directional tail: it must look right moving left or right. The core stays on the exact cell center.
Size: ball body about 50% of the cell across, tongues reaching about 62%, core about 21%.
Frame 1: 8-10 flame tongues around the edge.
Frame 2: same size, tongues rearranged (different lengths and positions), core shifted slightly.
Frame 3: another tongue arrangement, a few small embers detached at the edge.
Frame 4: another arrangement that flows back into frame 1 (seamless flicker loop).
Palette (hard bands from outside in): outline #7A1A08, deep red #C42A10, orange #F05A14, light orange #FF9A24, yellow #FFD04A, core #FFF4C0.
```

### flame: aura flame tongue

Save as: `art/vfx/raw/flame_vNN.png`

```text
Effect: AURA FLAME TONGUE. WHITE-ONLY. 7 frames. BOTTOM-ANCHORED (the base of every frame sits on the same ground line, horizontally centered). Plays in 0.39 s; many of these together form a fighter's power-up aura.
Shape: one sharp, pointed flame tongue (a teardrop with a long whipping tip) that shoots up, peaks, and thins out while its tip sways. Hard shapes like anime power-up aura flames.
Height (% of the cell) / base width / tip:
Frame 1: 34% tall, 22% wide, tip centered.
Frame 2: 55% tall, 20% wide, tip leaning right.
Frame 3: 69% tall, 18% wide, tip leaning right.
Frame 4: 75% tall (peak), 16% wide, tip centered.
Frame 5: 69% tall, 15% wide, tip leaning left.
Frame 6: 55% tall, 13% wide, tip leaning further left and starting to detach.
Frame 7: 34% tall, 11% wide, a thin wisp with the tip detached.
Colors: white #FFFFFF core, #E6E6E6 outer band, optional #C8C8C8 edge. No outline.
```

### lightning: crackling electric bolts

Save as: `art/vfx/raw/lightning_vNN.png`

```text
Effect: CRACKLING LIGHTNING CLUSTER. WHITE-ONLY. 6 frames. CENTER-ANCHORED. The game shows these frames in random order and random rotation, so every frame is a different, self-contained cluster (no continuity needed).
Shape: jagged electric bolts radiating in all directions from a bright solid knot at the exact cell center. Thick zigzag bolts with sharp angular turns, each splitting into thin forks. Chaotic, crackling, very bright. Bolts reach at most about 45% of the cell from the center.
Frame 1: 6 thick bolts, 4 thin forks.
Frame 2: 5 thick bolts, more forks.
Frame 3: 7 shorter bolts, dense and spiky.
Frame 4: 5 long bolts reaching the maximum length, few forks.
Frame 5: 6 bolts, one doubling back on itself in a zigzag loop.
Frame 6: 6 bolts with many tiny sparks scattered between them.
Colors: thick bolts white #FFFFFF with a 1-2 px #C8C8C8 edge; thin forks and the knot pure white. No outline.
```

### orb: spinning wind sphere

Save as: `art/vfx/raw/orb_vNN.png`

```text
Effect: SPINNING WIND-ENERGY SPHERE held in a ninja's palm. FULL COLOR. 6 frames. CENTER-ANCHORED. Loops (0.24 s per turn).
Shape: a perfect sphere of compressed, spinning blue wind energy: dark blue rim, bright blue body, pale inner layers, a hot white core, and 3-4 bright spiral wind bands wrapping around it. Optional 2-3 short wind wisps hugging the edge in the spin direction, never sticking out more than a pixel past the sphere outline. The sphere is the same size in every frame, about 41% of the cell across (wisps included: at most 42%), centered on the cell center. White core about 11% of the cell.
Spin: the spiral bands rotate 60 degrees clockwise per frame, so frame 6 flows back into frame 1 (one full seamless turn).
Frame 1: bands at 0 degrees. Frame 2: 60. Frame 3: 120 (wisp at the top edge). Frame 4: 180 (wisp at the bottom edge). Frame 5: 240. Frame 6: 300.
Palette: rim #1C3FA8, blue #3A7CF0, light blue #7AB8FF, pale #BFE4FF, near-white #E8F6FF, core #FFFFFF.
```

### glow: light disc

Save as: `art/vfx/raw/glow_vNN.png` (the packer converts the grey rings luma-to-alpha; see `EFFECTS.md` -> glow)

```text
Effect: LIGHT DISC. 2 frames. CENTER-ANCHORED. Pulses between the two frames.
Shape: a perfectly round disc made of exactly 3 hard concentric flat rings, centered on the cell center. No gradient, no blur, crisp pixel edges between the rings.
Colors: core #FFFFFF, middle ring #B4B4B4, outer ring #5A5A5A. Nothing else.
Frame 1: outer diameter about 81% of the cell, middle ring 56%, core 34%.
Frame 2: slightly smaller: outer 75%, middle 53%, core 31%.
```

### streak: aura light streak

Save as: `art/vfx/raw/streak_vNN.png`

```text
Effect: AURA LIGHT STREAK. WHITE-ONLY. 6 frames. BOTTOM-ANCHORED (horizontally centered; the bottom of the streak starts on the ground line and lifts a little each frame). Plays in 0.27 s inside a power-up aura.
Shape: a very thin vertical line of light (about 3% of the cell wide) that stretches up and collapses, with a brighter, twice-as-wide segment between 30% and 60% of its height.
Height (% of the cell) and bottom lift:
Frame 1: 9% tall stub, on the ground line.
Frame 2: 46% tall, bottom lifted 3%.
Frame 3: 69% tall, bottom lifted 6%.
Frame 4: 69% tall, bottom lifted 9%.
Frame 5: 46% tall, bottom lifted 12%, thinner wide segment.
Frame 6: 9% tall stub, bottom lifted 16%.
Colors: white #FFFFFF line, the wide segment white with #E6E6E6 sides. No outline.
```

### star: 4-point flare

Save as: `art/vfx/raw/star_vNN.png`

```text
Effect: 4-POINT STAR FLARE. WHITE-ONLY. 5 frames. CENTER-ANCHORED. Plays in 0.2 s at the center of every hit. Frame 3 is also used alone as a tiny sparkle particle, so it must read cleanly when shrunk very small.
Shape: a sharp 4-point star cross (vertical and horizontal arms tapering to points) with a solid square-ish core on the exact cell center, shrinking over time.
Total span of the cross (% of the cell):
Frame 1: 38%, plus short diagonal twinkle rays.
Frame 2: 30%, short diagonal rays.
Frame 3: 22%, no diagonal rays (clean particle frame).
Frame 4: 14%, thinner arms.
Frame 5: 6%, a tiny dot-cross.
Colors: white #FFFFFF arms and core, optional #E6E6E6 on the tapered arm ends. No outline.
```

### crater: floor crater decal

Superseded by the ground-damage decals (ADR 0024, `art/decals/`); no new versions needed.

Save as: `art/vfx/raw/crater_vNN.png`

```text
Effect: FLOOR CRATER DECAL. FULL COLOR. 3 frames = 3 different VARIANTS (not an animation). CENTER-ANCHORED. Seen STRAIGHT FROM ABOVE (top-down, no perspective): it is laid flat on the arena floor in the game.
Shape: a shallow bowl smashed into beige stone floor tiles: a darker broken rim, a lighter floor inside (lighter toward the lower right), loose chunks and pebbles around the rim, and jagged cracks radiating outward. Only fully opaque pixels: no transparency, no soft edges, no shadow on the background.
Variant 1: round bowl about 53% of the cell across, 7 cracks reaching about 86% of the cell, a few pebbles.
Variant 2: slightly oval, irregular bowl (56% x 47%), 8 cracks, 2 broken tile chunks on the rim.
Variant 3: biggest bowl (about 60%), 9 long cracks reaching about 97% of the cell, more debris.
Palette: tile tones #EADBC6, #DDC9B0, #CFB79C, #C8AD92; rim/grout #A99079; cracks #9C8370; chip shadow #8F7663; deepest #6E5A4A.
```

### lines: radial impact lines

Save as: `art/vfx/raw/lines_vNN.png`

```text
Effect: RADIAL IMPACT LINES. WHITE-ONLY. 4 frames. CENTER-ANCHORED. Plays in 0.16 s around every hit, like the impact lines in modern anime fighting games.
Shape: about 14 long thin spikes arranged in a circle around an empty center. Each spike is a narrow triangle: wide base on the inner circle, sharp tip pointing outward. Uneven spike lengths and slightly uneven spacing. Over the frames the empty center grows and the spikes move outward and get shorter.
Frame 1: empty center about 22% of the cell across; spike tips reach 60-97% of the cell (diameter).
Frame 2: empty center 34%; tips 66-95%.
Frame 3: empty center 47%; tips 70-94%.
Frame 4: empty center 59%; tips 77-94%, thin, a few spikes missing.
Colors: solid white #FFFFFF only. No outline.
```

### dustWave: rolling dust wall

Save as: `art/vfx/raw/dustWave_vNN.png`

```text
Effect: ROLLING DUST WALL. FULL COLOR. 6 frames. BOTTOM-ANCHORED (all frames sit on the same ground line, horizontally centered). SIDE VIEW. Plays in 0.36 s; a ring of these rolls out of a big crater.
Shape: a low, wide wall of chunky cartoon dust puffs rolling outward and up, then breaking apart. Anime style, not realistic smoke. Wider and lower than a dust puff.
Frame 1: a low band of 7-9 round puffs on the ground line, about 47% of the cell wide and 17% tall.
Frame 2: about 55% wide, the middle rising (23% tall), puffs rolling.
Frame 3: fullest, about 62% wide, 30% tall.
Frame 4: about 67% wide, puffs separating, gaps in the middle.
Frame 5: about 70% wide (the widest frame), 5-6 smaller puffs drifting up and out.
Frame 6: 2-4 small puffs left at the ends, almost gone.
Palette (warm sand): highlight #F3EADB, light #E4D2BB, mid #CDB9A2, shadow #B39A80, outline #9C8370. Light from above.
```

---

## 3. Fix-up prompts (paste in the same thread; save each result you keep as the next version)

**Too soft / glowy / blurry**

```text
Redraw the same strip as strict hard-edged pixel art: crisp square pixels, flat color bands, no glow haze, no gradients, no blur, no anti-aliasing. Background perfectly flat #FF00FF. Keep everything else identical.
```

**Wrong number of frames**

```text
Redraw it with exactly <N> frames in a single horizontal row, evenly spaced, with wide magenta gaps between them. Same design, same frame descriptions.
```

**Frames touching, cropped or unevenly spaced**

```text
Redraw the same frames with more space: every frame fully inside its own equal square cell, evenly spaced, wide empty #FF00FF gaps between frames and around the image border. Nothing may touch the edge.
```

**Frames zoomed to fill / sizes wrong**

```text
Keep one scale for the whole strip. The sizes must change exactly as described: frame 1 is the size I gave, and the later frames grow/shrink relative to it. Do not enlarge frames to fill their cells.
```

**Center jumps around (jitter)**

```text
Redraw so the effect's center sits at exactly the same point (the center of its cell) in every frame. Only the shape changes between frames, never the position.
```

**Colors appeared in a WHITE-ONLY effect**

```text
This effect must be WHITE-ONLY: use only #FFFFFF, #E6E6E6 and #C8C8C8. Remove every color, tint and dark outline. Keep the shapes identical.
```

**Pink or purple inside the effect / background not flat**

```text
Remove every pink, purple and violet pixel from the effect, and make the background one perfectly flat #FF00FF with no shading, haze or shadow.
```

**Text, numbers or borders appeared**

```text
Redraw without any text, numbers, labels, grid lines or frame borders. Only the effect frames on flat #FF00FF.
```

**Not enough detail**

```text
Draw only frames 1 to <K> of this strip in a new image, larger and with finer pixel detail, same rules and same scale relationship between frames.
```
(Then ask for the remaining frames, and stitch the two images left to right before saving.)

## 4. If the image generator refuses

These prompts describe shapes and colors only, with no franchise or artist names, so refusals should
be rare. If one happens:

- Start a new thread, paste the preamble, then the effect prompt again.
- For the signature effects, use the neutral wording: `orb` -> "a magical sphere of swirling blue wind",
  `lightning` -> "a cluster of electric sparks", `fire` -> "a round fire spell projectile",
  `shuriken` -> "a 4-pointed metal throwing star".
- Never add "in the style of <artist>" or character names; describe the look instead.
