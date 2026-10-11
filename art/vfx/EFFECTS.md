# VFX brief: every effect, frame by frame

Single source of truth for effect art. Prompts live in [`PROMPTS.md`](PROMPTS.md); rules and workflow
in [`README.md`](README.md). Spec v2 (ADR 0007) did not change the VFX cell, anchors or sizes below;
raw candidates are versioned (`art/vfx/raw/<effect>_vNN.png`, highest version packed) and reviewed in
[`../REVIEW.md`](../REVIEW.md). The engine side is `src/game/effects.js` (recipes) and
`src/art/vfxPainter.js` (procedural fallback with the same names, frame counts and timing).

## Common spec

| Item | Value |
|---|---|
| Cell | 128 x 128 px, transparent PNG, one frame per cell |
| Center anchor | pixel (64, 64) |
| Bottom anchor | x = 64, base on y = 120 (8 px empty below) |
| World scale | atlas `ppu: 56` -> one cell = 2.29 world units at scale 1 (a fighter is ~1.6 units tall: a 200 px spec v2 body at ppu 128) |
| Pixel style | hard pixels, no anti-aliasing, no blur, no gradients, no dithering, no motion blur |
| Raw background | flat magenta #FF00FF; no magenta / hot pink / violet inside effects |
| Raw file names | `art/vfx/raw/<effect>_vNN.png` (v01, v02, ...; never reused); rejected ones move to `art/vfx/raw/_rejected/` |
| White (tinted) palette | #FFFFFF main, #E6E6E6 and #C8C8C8 shading steps, #A8A8A8 optional deepest step. No outline. |
| Packer output | `public/vfx/atlas.png` + `atlas.json` = `{ "cell":128, "cols":<max frames>, "rows":<n effects>, "ppu":56, "anims": { "<name>": { "row":r, "n":frames, "ms":ms } } }` |
| Fallback | Any effect without art keeps its procedural version |

**How the shader uses the pixels:** `final = pixel.rgb * tintColor * (1 + glow)`, alpha = pixel alpha x
opacity, pixels under 8% alpha are discarded. So a white effect turns fully into the tint color, a light
grey pixel becomes a darker shade of it, and anything brighter glows through the bloom pass. Full-color
effects are usually spawned with a white tint, so they show as drawn.

**Max extent** below = the size of the effect's biggest frame inside its 128 px cell. The packer sets it:
it scales each strip with one factor so its largest frame = `fill` x 128 px (`VFX_EFFECTS` in
`tools/pack-sprites.mjs`), which keeps in-game sizes identical to today's procedural art. So only the
relative sizes between frames come from the art; the per-frame sizes below are written at final scale so
line thicknesses come out as specified.

## Summary

| Effect | Frames | ms | Total | Playback | Color | Anchor | Max extent | Runtime transforms |
|---|---|---|---|---|---|---|---|---|
| spark | 5 | 30 | 150 ms | one-shot | white (tinted) | center | radius 56 | random rotation, scale 0.7-0.9 |
| burst | 5 | 35 | 175 ms | one-shot | white (tinted) | center | radius 54 | random rotation, scale 0.65-1.1 |
| ring | 6 | 35 | 210 ms | one-shot | white (tinted) | center | 120 x 66 | none (scale 0.6-2.2) |
| dust | 6 | 60 | 360 ms | one-shot | full color | bottom | 77 wide x ~45 tall | random horizontal flip, scale 0.25-2.2 |
| smoke | 7 | 55 | 385 ms | one-shot | full color | center | 90 x ~86 | random horizontal flip, scale 1.1-1.5 |
| shuriken | 4 | 40 | 160 ms | loop | full color | center | diameter 44 | none: the spin is in the art |
| fire | 4 | 60 | 240 ms | loop | full color | center | diameter 79 | none (scale 0.7 trail, 1.5 projectile) |
| flame | 7 | 55 | 385 ms | one-shot | white (tinted) | bottom | 32 wide x 100 tall | rises upward, scale 0.4-0.83 |
| lightning | 6 | 40 | random | random frame each tick | white (tinted) | center | radius 60 | random rotation every tick |
| orb | 6 | 40 | 240 ms | loop | full color | center | sphere 52, wisps <= 54 | grows 0.25 -> 0.72 while charging |
| glow | 2 | 60 | 120 ms | loop / held | white + alpha steps | center | radius 52 | grows, fades, pulses |
| streak | 6 | 45 | 270 ms | one-shot | white (tinted) | bottom | 8 wide x 100 tall | rises upward |
| star | 5 | 40 | 200 ms | one-shot; frame 2 as static particle | white (tinted) | center | radius 26 | scale 0.18-1.2 |
| crater | 3 | n/a | n/a | one random variant, static | full color, fully opaque | top-down decal | diameter 124 | random rotation on the floor; **superseded by the ground decals** (`art/decals/`) |
| lines | 4 | 40 | 160 ms | one-shot | white (tinted) | center | radius 62 | random rotation, scale 0.7-1.5 |

---

## spark: crescent hit slash

- **In game:** the core of every hit spark (`Effects.hit()`): light hits (scale 0.7), heavy (0.9) and
  smash hits, beam ticks, projectile hits, wall bounces. Spawned exactly where the fist/foot met the body,
  drawn on top of the fighters, randomly rotated, tinted with the hit color (white by default, ice blue
  on wall bounces, the beam color on beam ticks).
- **Look:** an anime/DBFZ "slash crescent": a fat, sharp-tipped crescent moon shape (thick in the middle,
  tapering to needle points) with a small 4-point flare at its leading edge. Draw it with the convex side
  facing right (rotation is random at runtime, so the base orientation only needs to be consistent).
- **Color:** white (tinted). White body, #E6E6E6 inner edge band, flare pure white.
- **Anchor:** center (64, 64) = the impact point; the crescent's arc is centered there and grows outward.

| Frame | Description |
|---|---|
| 00 | Small, very bright crescent, outer radius ~24 px, thick (~22 px at the middle). Big 4-point flare (~40 px across) at the crescent's right edge. |
| 01 | Crescent grows to radius ~31 px, still thick. Flare ~30 px. |
| 02 | Radius ~38 px, middle thins to ~16 px, tips longer and sharper. Flare ~20 px. |
| 03 | Radius ~45 px, thin (~8 px middle). Flare gone. |
| 04 | Radius ~52 px, broken into 2-3 thin arc fragments about to vanish. |

## burst: spiky impact star

- **In game:** heavy and smash hits (behind the spark, warm-white/gold tint), the ki-bar-full flash while
  charging (character color), the super dash start (character color). Random rotation.
- **Look:** a solid 10-spike starburst (comic "BAM" shape) with uneven spike lengths, which then gets
  hollowed out from the center so the last frames are a ring of spike tips flying outward.
- **Color:** white (tinted). Solid white, optional #E6E6E6 band near the spike bases.
- **Anchor:** center.

| Frame | Description |
|---|---|
| 00 | Compact solid starburst: spike tips at radius 28-44 px, valleys between spikes at ~12 px. |
| 01 | Bigger: tips 32-48 px, valleys ~16 px. Still solid. |
| 02 | Biggest: tips 36-52 px. A round hole (radius ~12 px) opens in the center. |
| 03 | Hole grows to radius ~32 px; it now reads as a jagged ring of spikes. |
| 04 | Hole radius ~50 px: only the outer spike tips remain, as separate shards. |

## ring: shockwave ring

- **In game:** heavy/smash hits (gold tint), blocks (ice blue), ground ring on big impacts and explosions
  (scale 2.2), knockdown/ground bounce ring, air recovery (tech) ring, dash start at the feet, super dash,
  vanish reappearance, beam clash pulses. Never rotated.
- **Look:** a flat horizontal ellipse outline (width : height = 1 : 0.55, like a ring on the ground seen
  from the fight camera) that expands and thins out. Optional: slightly thicker at the bottom (front) edge.
- **Color:** white (tinted). White line, #C8C8C8 inner edge pixel row optional.
- **Anchor:** center.

| Frame | Ellipse half-width x half-height | Line thickness |
|---|---|---|
| 00 | 16 x 9 px | 12 px (almost a filled oval) |
| 01 | 25 x 14 | 10 |
| 02 | 34 x 19 | 7 |
| 03 | 42 x 23 | 5 |
| 04 | 51 x 28 | 3 |
| 05 | 60 x 33 | 2, broken into dashes |

## dust: ground dust puff

- **In game:** footsteps while running (small), dash start, jump/landing, knockdowns and ground slams
  (big, scale up to 2.2). Spawned in pairs with random horizontal flip, opacity 0.9. Sits on the floor.
- **Look:** a little cluster of round, cartoon dust puffs kicked up from the ground, spreading sideways
  and drifting up while shrinking. Chunky anime dust, not realistic smoke.
- **Color:** full color, warm sand matching the arena floor: highlight #F3EADB, light #E4D2BB,
  mid #CDB9A2, shadow #B39A80, darkest/outline #9C8370. Light from upper-right (highlights top-right).
- **Anchor:** bottom: the lowest puff sits on y = 120, cluster centered on x = 64.

| Frame | Description |
|---|---|
| 00 | Tight cluster of 3-4 round puffs, ~38 px wide, ~19 px tall, sitting on the ground line. |
| 01 | Spreads to ~51 px wide, puffs a bit bigger, top puffs lifting (~26 px tall). |
| 02 | ~64 px wide, ~35 px tall, the fullest frame. |
| 03 | ~72 px wide, puffs start to shrink and separate, gaps appear. |
| 04 | ~77 px wide (the widest frame), 4-5 smaller separate puffs drifting up/out. |
| 05 | 2-3 tiny puffs at the edges, almost gone. |

## smoke: vanish poof / explosion smoke

- **In game:** the ninja "poof" when a fighter vanishes (teleport), smoke around explosions (5 clouds),
  ambient smoke during beam clashes, KO explosion. Random horizontal flip.
- **Look:** a classic anime smoke-bomb poof: bulging, cloud-shaped cluster of round puffs that bursts
  out, then breaks into separate puffs that drift up and shrink away. Bold, cel-shaded, not wispy.
- **Color:** full color, cool neutral whites/greys (no pink or lavender): highlight #FFFFFF,
  light #ECEEF2, mid #CFD3DC, shadow #A9AEBC, darkest/outline #858A9A. Light from upper-right.
- **Anchor:** center.

| Frame | Description |
|---|---|
| 00 | Dense, compact round cloud ~42 px, very white. |
| 01 | Billows out to ~62 px, bumpy cloud outline, shading on the lower-left. |
| 02 | Full cloud ~80 px wide. |
| 03 | ~90 px (the biggest frame), starts splitting into 5-6 separate puffs, the whole thing rising ~5 px. |
| 04 | Puffs smaller, holes between them, rising ~9 px. |
| 05 | 3-4 small puffs drifting outward/up. |
| 06 | 2-3 tiny wisps, almost gone. |

## shuriken: thrown star (projectile)

- **In game:** the 4-blade ninja star projectile (3 thrown in a fan, scale 0.55). It is a camera-facing
  billboard that loops these frames while it flies. The engine does **not** rotate it: the spin must be
  in the art.
- **Look:** a classic 4-pointed ninja throwing star seen flat (face-on): four sharp blades, a round hole
  in the middle, bright bevel highlights along the blade edges. Optional: 1-2 px solid white speed arcs
  just behind the blade tips (no blur).
- **Color:** full color, steel: outline/hole #1A1A24, dark #3A3F4C, mid #5A6070, light #8A92A2,
  highlight #C8D0DC, glint #F0F4FA.
- **Anchor:** center: the hole is exactly on (64, 64) in every frame.
- **Spin:** a 4-blade star repeats every 90 degrees, so 4 frames x 22.5 degrees = a seamless loop.

| Frame | Description |
|---|---|
| 00 | Blades pointing straight up/right/down/left (0 deg). Diameter 40-44 px. |
| 01 | Rotated 22.5 deg clockwise. Same size. |
| 02 | Rotated 45 deg (an X shape). |
| 03 | Rotated 67.5 deg. Next frame (00) completes the loop. |

## fire: fireball projectile + flame trail

- **In game:** the big fireball breathed by the fire-style ninja (projectile at scale 1.5, with an orange
  glow halo under it), plus small trail puffs it leaves behind (scale 0.7, fading). Camera-facing, **not**
  rotated or flipped with the travel direction, so it must look right moving either way.
- **Look:** a round, roaring ball of fire: dense bright core, layered flame tongues licking outward all
  around the edge (slightly more upward), no directional tail. Each frame rearranges the tongues so the
  loop flickers.
- **Color:** full color: outline #7A1A08, deep red #C42A10, orange #F05A14, light orange #FF9A24,
  yellow #FFD04A, core #FFF4C0. Bands from outside in, hard edges between bands.
- **Anchor:** center: the core stays on (64, 64).

| Frame | Description |
|---|---|
| 00 | Ball body ~64 px diameter, 8-10 flame tongues reaching to ~79 px, core ~27 px. |
| 01 | Tongues shifted (different lengths/positions), core shifted 2-3 px. Same overall size. |
| 02 | Another tongue arrangement, a few small embers detached at the edge. |
| 03 | Another arrangement that blends back into frame 00 (seamless loop). |

## flame: aura flame tongue

- **In game:** the charging / power-up ki aura. Many tongues spawn around and behind the fighter every
  frame, each rising upward (1.3 units/s), tinted with the character color or the aura core color,
  semi-transparent. Together they form the DBZ-style aura.
- **Look:** a single sharp, pointed flame tongue (teardrop with a long whipping tip), base on the ground,
  that shoots up, peaks, and thins out while its tip sways. Hard shapes, like anime aura flames.
- **Color:** white (tinted). White core, #E6E6E6 outer band (1-3 px), optional #C8C8C8 edge.
- **Anchor:** bottom: base on y = 120, centered on x = 64.

| Frame | Height | Base width | Tip |
|---|---|---|---|
| 00 | 44 px | 28 px | centered |
| 01 | 70 px | 26 px | leans 7 px right |
| 02 | 88 px | 23 px | leans 7 px right |
| 03 | 96 px (peak) | 21 px | centered |
| 04 | 88 px | 19 px | leans 6 px left |
| 05 | 70 px | 16 px | leans 8 px left, tip starting to detach |
| 06 | 44 px | 14 px | thin wisp, tip detached |

## lightning: lightning-blade crackle / clash bolts

- **In game:** the lightning-blade special held in one hand (pale-blue tint, scale 0.4-0.9) plus tiny
  extra crackles around it, and the big bolts at the center of a beam clash (scale 1.3). Shown in
  **random frame order with a new random rotation every game tick**, so it never "plays" as a sequence.
- **Look:** a cluster of jagged electric bolts radiating from a bright center knot: 5-7 thick zigzag bolts
  with sharp angular turns, each splitting into thin forks. Crackling, chaotic, very bright.
- **Color:** white (tinted). Thick bolts white with a 1-2 px #C8C8C8 edge; thin forks white; center knot
  solid white.
- **Anchor:** center: the knot is on (64, 64), bolts radiate outward.
- **Rule:** every frame is a different, self-contained bolt cluster (no continuity needed). Spread the
  bolts all around (not all on one side).

| Frame | Description |
|---|---|
| 00 | 6 thick bolts (4-6 px), lengths 36-60 px, + 4 thin forks (2 px). Knot ~12 px. |
| 01 | Different arrangement, 5 thick bolts, more forks. |
| 02 | 7 shorter bolts, dense and spiky. |
| 03 | 5 long bolts reaching ~60 px, few forks. |
| 04 | 6 bolts, one doubled back on itself (zigzag loop). |
| 05 | 6 bolts with many tiny 2-3 px sparks scattered between them. |

## orb: spiraling wind sphere (hand special)

- **In game:** the swirling chakra-sphere special held in the palm. It grows from scale 0.25 to 0.72 during
  startup, a light-blue glow sits behind it, and white sparkles fly off. Loops continuously.
- **Look:** a perfect sphere of compressed spinning wind energy: dark blue rim, bright blue body, pale
  inner layers, a hot white core, and 3-4 bright spiral wind bands wrapping around it. Optional: 2-3 short
  wind wisps hugging the edge in the spin direction (at most 1 px outside the sphere outline).
- **Color:** full color: rim/outline #1C3FA8, blue #3A7CF0, light blue #7AB8FF, pale #BFE4FF,
  near-white #E8F6FF, core #FFFFFF.
- **Anchor:** center (64, 64), sphere body diameter 52 px; wisps keep the total extent <= 54 px. The packer
  scales the largest extent to 54 px, so a wisp that sticks out further shrinks the sphere.
- **Spin:** the spiral bands rotate 60 deg clockwise per frame, so 6 frames = one full turn and the loop
  is seamless. The sphere outline stays the same size.

| Frame | Description |
|---|---|
| 00 | Sphere diameter 52, white core ~14 px, 4 spiral bands (4 px wide) at 0 deg. |
| 01 | Bands rotated 60 deg. Small wisp leaves the top edge. |
| 02 | 120 deg. |
| 03 | 180 deg. Wisp on the bottom edge. |
| 04 | 240 deg. |
| 05 | 300 deg; next frame (00) completes the turn. |

## glow: soft light disc

- **In game:** held glows: behind the aura (character color), behind the orb and lightning hands, the
  bulbs at a beam's origin and head, the beam clash core, the fireball halo, and a quick growing flash on
  explosions and smash hits. Pulses between its 2 frames.
- **Look:** a round disc of light made of **3 hard concentric steps**: outer ring ~35% alpha, middle
  ring ~70%, core 100%. No smooth gradient.
- **Color:** white (tinted), **with real alpha**.
- **Anchor:** center.
- **Alpha note:** image generators cannot output partial transparency on magenta. Draw the raw strip as three
  flat opaque rings: core #FFFFFF, middle #B4B4B4, outer #5A5A5A. The packer converts `glow` "luma to
  alpha": every pixel becomes white with alpha = its grey value, snapped to the atlas alpha steps
  (255 / 200 / 110, the same steps as the procedural glow). Hand-made 128x128 frames in
  `frames/glow/glow_NN.png` (already white + alpha) are used as final with their alpha kept. Low priority:
  the procedural glow already looks fine.

| Frame | Outer radius | Middle radius | Core radius |
|---|---|---|---|
| 00 | 52 px | 36 px | 22 px |
| 01 | 48 px | 34 px | 20 px |

## streak: aura light streak

- **In game:** thin vertical streaks of light shooting up through the charging aura (aura core tint,
  rising at 2.6 units/s). Mixed with the `flame` tongues.
- **Look:** a thin vertical beam of light that stretches up and collapses, with a brighter, wider
  segment in its lower-middle part.
- **Color:** white (tinted). Line white, the wider segment white with #E6E6E6 sides.
- **Anchor:** bottom: centered on x = 64; the bottom of the streak starts on y = 120 and lifts a little
  each frame.

| Frame | Bottom y | Height | Notes |
|---|---|---|---|
| 00 | 120 | 12 px | 4 px wide stub |
| 01 | 116 | 59 px | 4 px line, 8 px wide segment from 30% to 60% of its height |
| 02 | 112 | 88 px | same proportions |
| 03 | 108 | 88 px | same |
| 04 | 104 | 59 px | thinner segment |
| 05 | 100 | 12 px | small stub, fading |

## star: 4-point flare / sparkle particle

- **In game:** the bright flare at the center of every hit (scale 0.5-1.0), the vanish reappearance
  flash, and **frame 02 alone** is used as a tiny static particle (scale 0.18-0.3): hit sparkles flying
  out, sparks around the orb, beam-clash sparks, and pebble specks rising from the floor during auras.
- **Look:** a sharp 4-point star cross (vertical and horizontal arms tapering to points) with a solid
  square-ish core, shrinking over time. Optional short diagonal rays on frames 00-01 for a twinkle.
- **Color:** white (tinted). Arms white, core white, optional #E6E6E6 on the tapered arm ends.
- **Anchor:** center.
- **Rule:** frame 02 must read as a clean little sparkle on its own when shrunk to ~6 px.

| Frame | Arm half-length | Arm thickness | Core |
|---|---|---|---|
| 00 | 24 px | 4 px | 8 x 8 px, + short diagonal rays (8 px) |
| 01 | 19 px | 4 px | 8 x 8, short diagonal rays (5 px) |
| 02 | 14 px | 4 px | 8 x 8, no diagonals (the particle frame) |
| 03 | 9 px | 2-4 px | 6 x 6 |
| 04 | 4 px | 2 px | 4 x 4 |

## crater: floor crater decal

> **Superseded by the ground decals** ([`../decals/DECALS.md`](../decals/DECALS.md),
> [ADR 0024](../../docs/decisions/0024-ground-damage-decals.md)): ground damage now comes from its own
> decal atlas (ppu 64, 256-512 px cells, 31 names picked by force and element: `crack_s` ... `crater`,
> `crater_big`, `crater_huge`, element scorches). Do not generate new `crater` VFX art; the approved v01
> stays in the VFX atlas only while the engine still reads it. Its baked side light ("lighter toward one
> side") is exactly what the decal brief forbids, because decals are rotated at random.

- **In game:** a static decal laid flat on the arena floor after ground bounces, knockdowns, specials,
  ultimate hits and KOs (scale 0.85, randomly rotated, fades out after ~9 s). **One random frame is
  picked**: the 3 frames are 3 variants, not an animation.
- **Look:** seen straight from above: a shallow bowl smashed into stone floor tiles: a darker broken rim,
  a lighter floor inside (lighter toward one side), loose chunks and pebbles around the rim, and 7-9
  jagged cracks radiating outward.
- **Color:** full color matching the arena tiles: tile tones #EADBC6, #DDC9B0, #CFB79C, #C8AD92,
  grout/rim #A99079, crack #9C8370, chip shadow #8F7663, deepest #6E5A4A.
- **Alpha:** **fully opaque or fully transparent pixels only** (the floor material uses an alpha
  cutoff). No semi-transparent edges.
- **Anchor:** center (64, 64), top-down (no perspective; the 3D camera adds it).

| Frame | Description |
|---|---|
| 00 | Round bowl ~68 px across, 7 cracks reaching ~110 px total, a few pebbles. |
| 01 | Slightly oval, irregular bowl ~72 x 60 px, 8 cracks, 2 broken tile chunks on the rim. |
| 02 | Biggest: bowl ~76 px, 9 long cracks reaching ~124 px total, more debris. |

## lines: radial impact lines

- **In game:** on every hit (scale 0.75 light, 1.1 heavy, 1.5 smash), blocks (pale blue), the vanish-out
  flash, and the super dash (character color). Random rotation. This is the DBFZ-style "impact lines"
  burst around the contact point.
- **Look:** ~14 long thin spikes arranged in a circle around an empty center: each spike is a narrow
  triangle with its wide base on an inner circle and its sharp tip pointing outward. Uneven lengths and
  slightly uneven spacing. Over the frames the empty center grows and the spikes move outward and get shorter.
- **Color:** white (tinted). Solid white only.
- **Anchor:** center.

| Frame | Empty center radius | Spike tips reach | Spike base width |
|---|---|---|---|
| 00 | 14 px | 38-62 px | ~5 px |
| 01 | 22 px | 42-61 px | ~5 px |
| 02 | 30 px | 45-60 px | ~4 px |
| 03 | 38 px | 49-60 px | ~3 px, a few spikes missing |

---

## Beams (future)

**Today the super/ultimate beams are drawn by a shader, not sprites** (`BEAM_FRAG` in
`src/game/projectiles.js`): a ribbon from the hands to the target with three hard color bands (white-hot
core, bright mid, colored rim), wobbling edges and scrolling streaks, plus `glow` bulbs at the origin and
at the head. Per-character colors come from `def.beam` in `src/characters/<id>.js`
(Naruto: core #FFF6D8, mid #FFB43A, edge #FF6A10; Sasuke: core #F0FBFF, mid #62B8FF, edge #3A54FF).

Optional pixel-art beams are planned but **not consumed by the engine or the packer yet**. Using them
needs a Claude task + ADR (textured ribbon that repeats the body segment along the beam length, two
billboard caps). If you want to prepare art ahead of time, use this spec:

| Piece | Cell | Frames | ms | Anchor / rule |
|---|---|---|---|---|
| `<charId>_beamBody` | 64 wide x 96 tall | 4 | 40 | Horizontal segment of the beam running left to right, centered on y = 48, max thickness 72 px (12 px free above/below for wobble). **Must tile horizontally**: column 0 continues column 63 seamlessly. Each frame shifts the energy streaks 16 px to the right, so 4 frames = one seamless 64 px scroll. |
| `<charId>_beamOrigin` | 96 x 96 | 4 | 40 | The flare at the hands: a bright star-shaped bloom centered on (48, 48); the beam leaves it to the right at y = 48 with the body's thickness. Flickers. |
| `<charId>_beamHead` | 96 x 96 | 4 | 40 | The beam's front: a big rounded, churning energy blob centered on (48, 48); the beam enters from the left at y = 48 with the body's thickness. Pulses. |

- Color: full color in the character's three beam tones (core / mid / edge), hard bands, no gradients.
- Style: like the anime: a dense white core, a thick bright band, a jagged outer rim with small energy
  flecks; the body has 2-3 brighter streaks racing forward.
- Names follow the character-effect rule in [`README.md`](README.md) ("Adding a new effect"):
  `<charId>_<effect>`. Until the engine task exists, save raws as
  `art/vfx/raw/_proposed/<charId>_beamBody_vNN.png` etc. (the packer never reads `_proposed/`) and do not
  create `frames/<charId>_beamBody/` folders (keeps the tracker honest).

## Not in the atlas (no art needed)

- Fullscreen anime speed lines, color flashes and invert impact frames (`Overlay`, screen-space).
- Hexagon ki-barrier wall flash at the ring edge (procedural hex texture).
- Flying rock debris (low-poly 3D meshes).
