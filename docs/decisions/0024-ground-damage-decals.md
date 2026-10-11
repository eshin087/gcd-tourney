# 0024. Ground damage: force tiers, element styles and a separate decal atlas kind

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0008](0008-world-art-and-parallel-production.md) (world art), [0012](0012-art-integration-gates-and-hand-anchors.md) (approval-gated world art)

## Context

Every kind of ground damage used one call, `Effects.crater(pos)`: one 128 px VFX-atlas row with 3 variants, always
the same size (about 1.9 units, smaller than a fighter is tall), unlit, rotated half a turn at most. Ground bounces,
specials, Kirin, the Four-Tails maul, the Hollow Purple path, dive slams, KOs and the power-up all left the same
beige crater, so nothing read as bigger for a stronger hit or a longer charge. It was also buggy: craters floated
0.6 above the grass for off-ring KOs, hung over the ring edge, stayed full-bright in super flashes, hid the fighter's
shadow, popped out at half fade and sorted over the blob shadow. Wall bounces and KO crashes into the stands left
nothing. The user asked for ground damage that is "more varied (not the same art), much bigger for stronger attacks
or longer charge-ups", with as much art as needed from Codex.

The VFX atlas had one free 128 px row left (1920 of 2048 px), and 128 px cells are far too coarse for 4 to 8 unit
decals next to a floor drawn at 64 px per unit.

## Decision

### 1. A ground-damage module driven by force and style

`src/game/ground.js` (`GroundDamage`, owned by `Effects` as `fx.ground`) takes every floor-marking event:

- **Force** (0 to 1.6) comes from what happened: the fall speed of a landing (`clamp((vy - 8) / 26)`, +0.25 for a
  ground bounce, +0.35 for a KO), the hit (spark weight, damage, special, super), a dive slam (0.7, 0.9 when it
  caught someone), or a fixed value per event (special trade, clash win and draw, Kirin, maul slams, chakra roar).
  All numbers live in the `GROUND` table at the top of ground.js.
- **Tiers** by force: `crack_s` (0.15), `crack` (0.35), `crater` (0.55), `crater_big` (0.85), `crater_huge` (1.15),
  each with a diameter range (1.4 to 7.6 units, cracks included) and a lifetime (6 s up to "until the round
  resets"). Size jitters ±10%, rotation covers the full circle, half are mirrored, and a shuffle bag never repeats a
  variant back to back.
- **Styles** (`GROUND_STYLES`): an element look drawn over the tier's crater (`overlay`) or instead of it
  (`replace`), with `big` variants from `crater_big` up, satellite marks, a path decal (`trail`) and a glow time
  (`heat`). Data says which style a hit leaves: `ground` on specials, shots, supers and vortices in moves.js
  (`roarGround` for the Four-Tails roar), and `ground: { style, tint, charge }` on each character for specials
  without their own and for the charge. Normals and throws stay stone. No code checks a character id.
- **Clusters.** One impact draws, in order: an underlay fracture ring and satellite cracks (force >= 0.85 / 1.15),
  the crater or the style's own decal, the style's overlay, rubble (>= 0.7). Then a little 3D: partly sunk rim chunks
  (one InstancedMesh of 128), floor slabs jutting up at 12 to 30 degrees that use the ring's own top and side
  materials (>= 0.85, at most 20, never within 0.6 units of a fighter: a slab sinks at once when one comes close),
  flying rocks, a ring of rolling `dustWave` sprites (a new VFX row) and smoke for the biggest.
- **Merging.** An impact at most one tier weaker than a younger (< 4 s) crater within 0.45 D adds 0.15 per tier of
  that crater to its own force. When that reaches a bigger tier, the old crater dissolves and the grown one appears
  between the two, weighted toward the harder hit; otherwise nothing new is drawn (the floor is already broken that
  much). So repeated slams (the maul, juggle bounces) grow one crater instead of stacking copies. A hit two or more
  tiers weaker (a super-jump crack or a launcher's landing beside a fresh big crater) never grows it: inside 0.3 D it
  adds nothing, further out it leaves its own small mark.
- **Impact debt.** A special, styled shot, smash or big launcher that hits an airborne victim (higher than 0.3)
  records `groundMark` on them; their next floor contact within 90 frames (a landing, ground bounce or KO landing)
  makes the crater there, in that style, so it appears where they crash and not under a mid-air hit. A grounded
  victim of a special or styled shot (Narukami, Chidori Spear: a burned crack) is marked at once, and a styled shot
  that reaches the floor marks it there (0.6, or 0.4 for a shot that is not `big`).
- **Surfaces.** The ring (stone; decals clip at the ring edge), the grass around it (decals sit just above the grass
  and path, clip inside the ring footprint and use the dirt names), the brick stand walls (a KO crash leaves a hole,
  body-shaped when it was fast, until the round resets), and the ki barrier (a wall bounce cracks it in the barrier's
  color; it flickers, dissolves and sheds falling shards). The training room draws decals as holographic outlines in
  the grid's color (no 3D rubble); the domain hides the arena's decals and skips new ones.
- **Charge.** One decal per charging fighter upgrades in place (crack_s, crack 50 frames later, fracture_ring 110
  frames after crack_s, then the fighter's own fracture when the gauge fills, with chunks and slabs).
  `ground.charge: false` keeps the floor still (Gojo: Infinity). The power-up effects (`src/game/chargeFx.js`, ADR 0023) call
  `fx.ground.chargeTick(f, t, level, crackAt)` every live charge frame and `chargeMax(f)` on the full gauge, only
  for a charge style whose `ground.crackAt` is above 0; crack_s appears when the charge reaches that level (Naruto
  from bar 2, Sasuke at MAX; Killua's and Gojo's power-ups never crack the floor) and the stages are timed from it.
- **Round reset.** The ring is clean every round.

### 2. Rendering

Floor and wall decals are flat quads with a Lambert material, so they are lit like the floor: they dim in super
flashes and receive the sun's shadow. One shared program per kind (`customProgramCacheKey`) gets per-decal uniforms
through `onBeforeCompile`: the variant's cell on its page, a world-position clip (ring edge, grass, wall face), a
radial reveal (cracks spread out in 0.08 to 0.35 s; along the path for directional decals), a pixel dissolve
(whole texels drop out over 0.6 s, never a soft fade) and the **hot key**. Decals draw transparent with renderOrder
just under 0, older first, so the fighters' blob shadows draw over them. Caps: 40 floor decal meshes (the oldest
timed cluster dissolves past 34; past 40 the oldest already-dissolving ones go), 8 permanent clusters, 4 barrier
cracks, 4 wall holes, 128 chunks, 20 slabs, 24 runs per trail.

**Hot key:** pure `#FFFFFF` texels in a decal are hot seams. The engine glows them in the tint (the move's color or
the fighter's `ground.tint`) and cools them to soot (`#3a302a`) over the style's `heat` seconds. No other texel of a
decal may be pure white, and the packer snaps near-white (>= 250) to `#FFFFFF` in decal art so the key survives
quantization. Directional decals are drawn with the motion going left to right.

### 3. A separate decal atlas kind

Decal art is its own world-art kind (`npm run sprites decals`, `tools/pack-decals.mjs`, TOOL-026), not more VFX rows:

- `public/decals/atlas.json` + the PNG pages of each **page set** (`decals_<set>.png`, or `_<n>` when a set needs
  several; each page at most 2048 x 2048). The style groups share pages by set (`DECAL_PAGE_SETS`: base + edge,
  chakra + ki, lightning + fire, cursed), so a pairing loads the floor set plus the element set of each fighter's
  looks and stays within the 4-page cap. A name never spans two pages. Shape: `{ ppu: 64, pages: [...],
  decals: { <name>: { page, w, h, frames: [[x, y], ...], mode: 'flat' | 'wall', tinted, group } } }` (the packer
  adds `directional`, `hotKey`, `tile` and `version`; the engine ignores them). Only approved names ship;
  `--candidates` writes the same shape to `public/preview/decals/` (`?art=custom`).
- **ppu 64**, the approved ring top's density: a 256 px cell is 4 units, a 512 px cell 8 units.
- The 31 names, their cell sizes, variant counts and groups (base, edge, lightning, fire, chakra, cursed, ki) are
  the contract in `DECALS` (src/art/decalPainter.js). The packer restates it in `DECAL_SPECS` (with each brief's
  image split), and the manifest's `decals.items` restates it again; the packer warns on any drift.
- `src/art/decalPainter.js` paints every name procedurally at half density (5 seeded painters: crack webs, bowls,
  scorches, grooves, wall holes) into the same shape, behind the loading screen. `GroundDamage.loadCustom()` reads
  the packed JSON and merges it over the procedural decals name by name, with one `[decals]` info line; any error
  keeps the procedural decals.
- **Texture memory.** A match uploads at most 4 decal pages: the hand-made pages holding the names its two fighters
  can produce (floor tiers first), loaded when the match starts and freed when they are not needed, plus the
  procedural page(s) for everything else (about 2048 x 1216 for a typical pairing).

## Alternatives considered

- **More rows in the VFX atlas.** Rejected: one row fits, and 128 px cells are 16 to 30 px per unit at crater sizes.
- **Procedural decals only.** Endless variety and no art work, but less hand-made than the user asked for. Kept as
  the mandatory fallback.
- **A damage map** (blit decals into a copy of the ring texture). Rejected as the main path: every impact re-uploads
  a 1152 x 1152 texture and loses the reveal, glow and dissolve. A later hybrid could bake expired permanent marks.
- **Projected (deferred) decals.** Overkill for a flat floor: flat quads with a world-position clip do the job.
- **Lower ppu (48) or palette-indexed pages** to cut memory. Kept in reserve if the phone check fails.

## Consequences

- Every floor-marking call goes through `fx.ground` (`impact`, `hit`, `land`, `koMark`, `slide`, `dive`, `trail`,
  `scuff`, `wall`, `wallCrater`, `chargeTick`, `chargeMax`); `Effects.crater(pos)` stays as a plain-crater wrapper.
- A new move or fighter gets its look from data (`ground` fields); a new look is a `GROUND_STYLES` entry plus decal
  names in the contract (and their art).
- The onBeforeCompile hooks depend on three.js chunk names (`<project_vertex>`, `<map_fragment>`,
  `<emissivemap_fragment>`); after a three upgrade, check `groundDemo()`.
- `?debug` adds `groundDemo(group)` (every name and variant laid out on the ring) and `groundTest(force, style)`;
  the lab has a "Ground damage" scenario; `fx.ground.stats()` gives the live counts for soaks.
- Until hand-made decals are approved, the game shows the procedural ones.
