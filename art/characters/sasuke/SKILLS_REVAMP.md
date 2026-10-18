# Sasuke: skills revamp (specials, Kirin, Amaterasu)

> Brief for the Codex chat **"5 - Skills Effects"** (relay lane `skills`), written by the Claude chat "Revamp Sasuke's
> specials, super and ultimate" on 2026-10-18. Claude does all engine work (`src/game/**`, effect names and their
> procedural stand-ins, the storm, the dragon, the burn, the lance, the counter) on branch `feature/sasuke-skills`.
> Codex draws the art below. Everything in [art/SPEC.md](../../SPEC.md),
> [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md), the title-style contract
> ([ADR 0029](../../../docs/decisions/0029-title-style-scale-baseline.md)), [art/vfx/README.md](../../vfx/README.md) and
> the HD effect cell of [ADR 0044](../../../docs/decisions/0044-signature-techniques.md) still applies unless this file
> says otherwise. The Naruto revamp ([naruto/SKILLS_REVAMP.md](../naruto/SKILLS_REVAMP.md)) is the worked example.

## 1. The user's request and decisions

**Request (2026-10-18):** revamp the specials, supers and ultimates so they look like the iconic anime/manga moves;
Naruto is done and live, Sasuke is next.

**What Claude found in game (2026-10-18):**

- **Chidori** is the generic 128 px `lightning` tile and a big glow: a white blob over his hand, and its hit is the
  generic explosion, which whites out the screen. His `special` v13 ends in an upright palm push, not a stab.
- **Chidori Sharp Spear** is the `lightning` sprite flying out of his palm, not a blade growing out of his hand.
- **Lion's Barrage** is a rising kick and a slam; the anime's "Shadow of the Dancing Leaf" (kick them up, appear
  behind them in the air, a combo, the slam) is missing.
- **Sharingan counter** is a stance and a kick; no Chidori Current.
- **Air Fireball** is the generic `fire` sprite at 1.5x with the generic explosion.
- **Kirin** is a blue glow disc on the floor, a few small bolts and a white-out. No storm, no dragon. His `beamFire`
  v07 is the old Lightning Lance palm push, not the Kirin strike.
- **Amaterasu** shows the Mangekyō behind him (good), then a white hit flash and a black silhouette with a few small
  sprites; the move's color is purple.

**The user's answers (2026-10-18, question box in this Claude chat):**

| Question | Answer |
|---|---|
| Chidori | **Redraw + new effects:** he grips his right wrist while the lightning forms (the "thousand birds"), runs with the hand dragging the floor and tearing a trench, then stabs through them. New HD lightning ball, floor trench and a piercing blast instead of the white-out. |
| Kirin | **Full anime sequence:** a Great Fireball into the sky, storm clouds darken the stage, he raises his arm and a huge lightning dragon (beast head, bolt body) dives onto their spot. New strike strip: his arm swung down at them. |
| Ultimate | **Amaterasu, revamped:** Mangekyō flash and a blood tear, then black flames burst on them, cling to their whole body and keep burning. New HD black flames, no white flash or purple. |
| Also revamp | **All four:** Lion's Barrage (Shadow of the Dancing Leaf, engine only), Sharingan counter (Chidori Current + afterimage), Chidori Spear (an HD lightning blade growing out of his hand), Air Fireball (Great Fireball from the mouth). |

**Claude's calls on the details (no extra art):**

- **Air Fireball strip:** the shipped `throw` v07 is already the Great Fireball pose (hands together at the mouth in
  f0, two fingers at the lips and the mouth blowing in f1-f2; the projectile already leaves from the lips). It stays;
  the new fire effects (A8, A9) carry the revamp. Claude offers the user a `throw` redraw separately if they still
  want one.
- **Blood tear:** the approved ultimate splash `ui_ult_fg` v01 already shows it and plays in the flash. A tear is
  1-2 px at game scale (the Mangekyō pinwheel in `superPose` v03 did not resolve in the atlas, REVIEW 2026-10-11), so
  `superPose` v01 stays.
- **Kirin prelude:** he breathes the fireball straight up while looking skyward in the Kirin call pose
  (`beamCharge` v05, his head is already tilted up). No new pose.
- **Lion's Barrage** uses his approved `specialUp`, `vanish`, air normals and `airHeavy`. **Chidori Current** and the
  afterimage are effects over his approved `specialDown`. No character art for either.

## 2. Rules for this task

- **Models:** generate and direct every image with `gpt-6-luna`, reasoning `medium` (CLAUDE.md "Agent model
  selection"); if this chat runs another model, spawn a Luna subagent (`model`, `reasoning_effort: "medium"`,
  `fork_turns: "none"`) for the generation. The final **Astra** anatomy/scale audit (`gpt-6-astra`, medium) applies to
  the two character strips (B1, B2) only. Effects (part A) need no Astra audit.
- **Budget:** at most 3 generation calls per image, cumulative across retries. One candidate inventory with every
  call, its prompt file and its verdict.
- **Versions:** never overwrite, reuse or delete a `_vNN` file. Next free versions (checked against disk, `_rejected/`,
  `_parts/`, REVIEW.md and git history on 2026-10-18): **`special_v14`**, **`beamFire_v08`**; every new effect starts
  at `_v01`.
- **Branch:** one worktree, branch `art/sasuke-skills`, sparse with the raw art you need
  (`npm run pr -- start art/sasuke-skills --art sasuke,vfx`, or the host's managed worktree plus
  `npm run pr -- art sasuke,vfx`). Dev server on a free port (52xx). Commit only your own paths.
- **Shared files:** the Codex chat "4 - Combat Overhaul" (lane `combat`, branch `art/normals-sasuke`) is editing
  Sasuke's directional normals at the same time. In `art/manifest.json`, `art/characters/sasuke/hitboxes.json`,
  `art/REVIEW.md` and `art/TRACKER.md` change only the rows of the animations and effects in this brief.
- **Packing:** the HD cell (256 px, 112 px per unit, `atlas_hd.png`) is on main since PR #151. A manifest entry
  `vfx.effects.<name>` with `"hd": true` plus `frames`, `ms`, `anchor` and `fill` from the tables below is all the
  packer needs, so `node tools/pack-sprites.mjs vfx --candidates` works for the new names right away. Claude
  registers the same names with procedural stand-ins on `feature/sasuke-skills`. Do not edit `src/` or `tools/`.
- **Approval:** the user approves every image version. The approvals desk is off: when a batch is ready, ring Claude
  with `node tools/relay.mjs ring skills --for user --kind approval --note "<items, versions, review link>"` from
  main and stop on that batch; Claude asks the user and relays the answer word for word. Never treat anything else as
  approval.

### The HD effect cell (every part A effect)

256 x 256 px cell at 112 px per world unit (2.29 units across at scale 1; a standing fighter is about 175 px tall in
this cell's pixels). Anchors: **center** = the effect's center on pixel (128, 128) in every frame; **bottom** =
centered on x = 128, base on y = 240 (16 px empty below). The packer scales each strip so its largest frame is `fill`
x 256 px; only the relative sizes between frames come from the art. Draw the sizes below at that final scale.
Effects are drawn **facing screen-right** where they have a direction; the engine mirrors them.

**Style for every effect:** crisp hard-edged pixel art like the approved HD effects (`art/vfx/raw/rasengan_v01.png`,
`rasenganBurst_v01.png`, `fourTailsRoar_v02.png`), flat magenta background, no text, no black outline around the
effect, no soft blur, airbrush, dithering noise or anti-aliased gradients; shading in hard color bands; at most 16
colors per effect. Effects must read at small scale in a busy fight: a bright core, clear shapes, a dark rim for
contrast. **No effect may be a solid white disc or fill most of its cell with white**: the Chidori's old problem was
exactly that.

**Lightning palette (A1-A5, A11-A13):** `#FFFFFF`, `#E8F7FF`, `#BFE8FF`, `#7CC8FF`, `#3E8CFF`, `#2350D8`, `#141E78`
(rim). White only in thin cores and branch tips; most of each bolt is the pale blues.

## 3. Part A: new effects (art/vfx, HD cell, full color)

Raws: `art/vfx/raw/<name>_v01.png`, one row of frames left to right. Cleaned frames: `art/vfx/frames/<name>/<name>_00.png`
... at exactly 256 x 256.

| # | Name | Frames | ms | Plays | Anchor | fill | Used for |
|---|---|---|---|---|---|---|---|
| A1 | `chidori` | 8 | 35 | loop | center | 0.6 | the Chidori in his hand while he charges and runs |
| A2 | `chidoriForm` | 6 | 40 | once | center | 0.6 | the Chidori forming in his gripped hand (startup) |
| A3 | `chidoriBurst` | 8 | 40 | once | center | 0.98 | the Chidori piercing them: the hit blast |
| A4 | `chidoriSpear` | 8 | 35 | once, f3-f5 loop | center | 0.98 | Chidori Sharp Spear: the blade growing out of his hand |
| A5 | `chidoriCurrent` | 8 | 40 | once | center | 0.98 | Chidori Current: lightning bursting from his whole body (the counter) |
| A6 | `amaterasu` | 8 | 60 | loop | bottom | 0.95 | the black flames clinging to the burning opponent |
| A7 | `amaterasuIgnite` | 6 | 45 | once | center | 0.95 | the black flames bursting on them at the moment of the gaze |
| A8 | `greatFireball` | 8 | 45 | loop | center | 0.9 | the Great Fireball (the air special; the Kirin prelude) |
| A9 | `greatFireballBurst` | 8 | 50 | once | center | 0.98 | the Great Fireball hitting / exploding |
| A10 | `stormCloud` | 4 | 120 | loop | center | 0.98 | the storm clouds over the Kirin's target |
| A11 | `kirinBody` | 4 | 40 | loop | center | 1.0 | the Kirin's bolt body, stacked from the clouds down to the head |
| A12 | `kirinHead` | 6 | 40 | loop | center | 0.95 | the Kirin's dragon head diving down |
| A13 | `kirinStrike` | 8 | 45 | once | bottom | 0.98 | the Kirin hitting the floor |

### A1 `chidori`: the thousand birds (8 frames, seamless crackle loop)

The anime Chidori held in his hand: a **dense knot of crackling lightning about 110 px across** around a small
white-hot center (about 20 px; the engine puts his hand there), **many short jagged arcs** branching out of it in all
directions, the longest ones (up to about 150 px across in total) **streaming back toward screen-left** as if blown
behind a running hand, their ends splitting into forks. It chirps and flickers rather than spins: every frame shows a
different set of arcs (a new random-looking pattern, same density and silhouette size), so the loop reads as constant
crackling; f7 into f0 must not jump in size. A few 2-3 px sparks around the knot. Mostly `#BFE8FF` / `#7CC8FF` arcs
with `#FFFFFF` only in the center and on 2-3 arc cores per frame, `#2350D8` / `#141E78` rims on the thick arcs.

### A2 `chidoriForm`: forming (6 frames, once)

f0: a few separate 2-4 px sparks and two tiny arcs crackling in an area about 60 px across. f1: the sparks jump
together, a 16 px bright point with four short arcs. f2: a knot about 40 px with arcs snapping out to 80 px. f3: about
70 px, arcs to about 110 px, a few reaching down (toward the floor). f4: about 95 px, the first arcs streaming back.
f5: the size and look of `chidori` f0, with a one-frame white flicker along the arcs.

### A3 `chidoriBurst`: the pierce (8 frames, once)

Not a white-out: the hit must read as lightning **piercing through** the target. f0: a bright 50 px white-blue core
and a **straight spike of lightning shooting out to screen-right** to the cell edge (the blade passing through the
body), branching at its tip. f1: the core at 60 px, the spike thicker, a ring of short arcs bursting round the core.
f2-f3: jagged bolts exploding outward in all directions to near the cell edge (longest to the right), forked tips,
the core shrinking to 40 px. f4: the bolts thin to broken segments, a thin crackling ring at about 200 px. f5-f7:
scattered crackle fragments and sparks fading, nothing in the center by f7.

### A4 `chidoriSpear`: Chidori Sharp Spear (8 frames, once, f3-f5 loop)

The Chidori stretching out of his hand into a **long, straight, thin blade of lightning**, drawn horizontally on
y = 128 from the hand end at the left edge to the point at the right edge. The engine scales the strip so the blade
is about 4.5 world units long, so keep the blade thin: a white core line 6-8 px thick with 3-4 px pale blue edges,
slightly jagged (1-2 px zigzags along both edges, not a smooth beam), small forked arcs flicking off it every 40-60 px,
and a crackling knot about 40 px across at the hand end (x 0-40). f0: knot plus blade to x about 90. f1: to x about
170. f2: the full blade to a **sharp point at x about 250** with a small bright flash at the point. f3, f4, f5: the
full blade, the edge zigzags and side arcs changing each frame; these three loop while the move is active. f6: the
blade breaking into dashed segments from the point backward. f7: fading sparks along the line.

### A5 `chidoriCurrent`: Chidori Current (8 frames, once)

Lightning discharging from his **whole body** in all directions (the Hebi-era Chidori Nagashi). **Leave the body
area clear:** a vertical oval about 80 px wide and 180 px tall around the center (x 88-168, y 38-218) has only a few
thin arcs crossing it, so his sprite shows through. f0: crackling arcs hugging that oval's outline, a thin bright rim.
f1-f3: long jagged bolts shooting **outward from the outline** in every direction to near the cell edge, forked tips,
a crackling halo around the oval. f4: the bolts snapping back to half length. f5-f7: short arcs flickering on the
outline, fading.

### A6 `amaterasu`: the clinging black flames (8 frames, seamless loop, bottom anchor)

Amaterasu's black flames covering a burning body: a blaze about **130 px wide and 215 px tall** (a standing body is
about 175 px), its base on y = 240. Sharp, tall, licking flame tongues of **pure black and near-black**, with **thin
dark crimson inner rims** where the tongues overlap and along their edges, and a few 2-3 px black embers rising off
the tips. The silhouette must have **gaps between the tongues** (about a third of the area open) so the burning body
shows through, and the tongues are densest at the bottom. Tongues rise and change shape so f7 flows into f0. Palette:
`#000000`, `#07040A`, `#140A14`, `#22101C`, `#3A0E1E`, `#5C1226` (rims only), at most a few pixels of `#8A1A30` per frame.
**No purple, no orange, no glow.**

### A7 `amaterasuIgnite`: the black flames bursting on them (6 frames, once)

The instant the gaze lands. f0: a small black point with a thin dark crimson ring around it (about 30 px). f1: black
flames erupting from the point in a burst about 120 px across, tongues pointing outward. f2: about 200 px, the
tongues curling upward. f3: the burst at full size (about 240 px), the lower half settling into upward flames.
f4-f5: the outer tongues breaking into black embers, the center becoming the base of an upward blaze (the engine
crossfades into A6). Same palette as A6.

### A8 `greatFireball`: the Great Fireball (8 frames, seamless loop)

Fire Style: Great Fireball, flying to screen-right: a **roiling sphere of fire about 150 px across**, its center on
(140, 128), a bright yellow-white core (about 50 px), orange and red rolling flame layers wrapping it, and **flame
tongues streaming back to screen-left** to about x 20. The flame layers roll forward over the sphere (the surface
advances about 1/8 turn per frame) so f7 flows into f0. Palette: `#FFF6C8`, `#FFE07A`, `#FFB43A`, `#FF7A1A`,
`#E8420E`, `#A81E0A`, `#5A0E06` (rim).

### A9 `greatFireballBurst`: the fireball exploding (8 frames, once)

Not a white-out. f0: the sphere squashed against the target, about 140 px wide, flames splashing sideways. f1: a
roiling ball of fire about 190 px, yellow core. f2-f3: the explosion filling the cell: billowing fire lobes, the
yellow core fading to orange. f4: the lobes breaking apart, dark red edges, the first dark smoke puffs
(`#3A2A26`, `#6A5A54`). f5-f7: smoke puffs and embers drifting up and fading.

### A10 `stormCloud`: the Kirin's storm (4 frames, loop)

A heavy thundercloud bank seen from below and the side: **fills the cell width, about 150 px tall** with a flat-ish
dark underside around y 180, billowing tops, irregular left and right ends (the engine lays several copies side by
side, overlapping by about a quarter, so the ends must blend). Dark slate and indigo: `#0E1020`, `#1A1E36`,
`#2A3052`, `#3E4670`, `#5A6496` (the lit tops). f0: dark. f1: a flash of lightning **inside** the cloud lights a
patch of it from within (`#7CC8FF`, `#BFE8FF`). f2: dark, the billows shifted a few px. f3: a different patch flashes
with a short fork of lightning dropping out of the underside.

### A11 `kirinBody`: the Kirin's body (4 frames, loop, tiles vertically)

A **vertical column of lightning about 100 px wide** that **tiles seamlessly top to bottom** (row y = 0 continues
row y = 255 exactly), so the engine can stack copies from the clouds down to the head: a thick white-blue core about
30 px wide that zigzags slightly, pale blue and blue outer bands, jagged edges, and forked side arcs snapping out to
the cell edges. Each frame a different crackle pattern on the same column (the core keeps its path at the top and
bottom edges so the stack joins in every frame).

### A12 `kirinHead`: the Kirin diving (6 frames, crackle loop)

The Kirin: a gigantic beast **head made of lightning, diving straight down**, about 160 px wide and 240 px tall. Seen
in profile facing screen-right with the snout **pointing down**: a long dragon-like snout with **wide open jaws**
(jagged lightning teeth), a fierce glowing white eye, swept-back horns, and a **mane of crackling bolts streaming
upward** to the top edge, where it joins `kirinBody` (a column about 100 px wide centered on x = 128 at y = 0).
Blinding white core along the jaw and the eye, pale blue and blue bands, a dark blue rim so it reads against the sky.
Every frame the crackle on the mane and the outline changes slightly; the head shape stays.

### A13 `kirinStrike`: the Kirin hitting the floor (8 frames, once, bottom anchor)

Readable, not a white-out. f0: the blinding column hitting the floor: a 60 px wide vertical white-blue bar from the
top edge to the floor line, a flat bright splash about 150 px wide along y = 240. f1: the splash spreading to the cell
width, lightning arcs racing out along the floor and up in branching forks, a dome of crackling arcs about 200 px wide
and 120 px tall. f2-f3: the dome at full size (about 240 x 160), the column thinning to 30 px, forked bolts leaping
from the dome. f4: the column gone, the dome breaking into separate arcs. f5-f7: arcs and sparks crackling low along
the floor, fading out.

## 4. Part B: Sasuke character art

Scale and anatomy follow the title-style contract: the same pixel density as his approved idle and combat cell, 256 px
cells, pivot `[128, 240]`, facing right, 48-color sheet palette, the sword sheathed at the small of his back in every
frame. Attach his approved title-style neutral/combat cells and his approved idle as references. **No lightning,
fire, glow or energy in any sprite:** the engine draws every effect. Eyes: Sharingan (red, as approved) in every
frame of both strips.

### B1 `special` v14: CHIDORI (8 frames, phases 3/3/2, bodyHeight 204, ms unchanged in the manifest)

The anime Chidori, R (near) hand. Frame count and phases stay (S = startup, A = active, R = recovery); the engine
stretches them over the move and keeps the run's distance.

- **f0 · S, the grip:** he drops into a wide low crouch, weight forward. **The L hand grips the R wrist**; the R arm
  points down past the front knee, **R hand open, fingers spread and pointing at the floor** (the Chidori forms in
  it). Head down, eyes on the opponent.
- **f1 · S:** the same crouch a little deeper, the R hand lower (fingertips about 20 px above the floor line), the
  grip tight, shoulders hunched, the waist cloth and rope ends stirring.
- **f2 · S, set to sprint:** he releases the grip: the L arm swings forward for balance, the **R arm sweeps back and
  down behind him**, hand open near the floor behind the rear foot. Body coiled low, ready to explode forward.
- **f3 · A, the run (1):** a low ninja sprint, torso leaning far forward (about 45 degrees), the **R arm trailing
  straight back and low, fingertips skimming the floor behind him** (y about 225-235, x about 40-70), L arm forward.
  Front foot planted, rear leg pushing off.
- **f4 · A, the run (2):** the next stride (legs swapped), the same trailing R arm and low lean.
- **f5 · A, the stab:** a deep lunge, front knee bent, rear leg straight; the **R arm thrust straight forward at chest
  height, fingers straight and together, pointing forward (a spear-hand)**, fingertips at about x 220-236, y 118-136
  (the opponent's chest); the L arm pulled back to the hip, chin behind the R shoulder, mouth open shouting. This is the
  frame the engine holds when the Chidori connects.
- **f6 · R, follow-through:** the same lunge, the R arm still extended, the body pushed 4-6 px further forward, the
  cloth and rope ends flying forward.
- **f7 · R:** recovering: the R arm drawn back to the chest, rising out of the lunge toward the stance.

**Anchors (hitboxes.json `special`):** record the **open R palm** (the center of the Chidori) as `hand` in every
frame, measured on the packed cells. `hit` boxes on **f3, f4, f5 and f6**: f5-f6 on the stab's fingertips; f3-f4 keep
a box in front of his chest at the stab's height and reach (like v13's f3 box `[176, 92, 36, 44]`), because the
Chidori connects whenever the run reaches them and the engine then jumps to the f5 stab. Keep his head within the strict
scale gate against idle (the packer's auto head fit), and keep every foot on the floor line (y = 240) except the
pushing rear foot in f3-f4.

### B2 `beamFire` v08: KIRIN, the strike (3 frames, loop, bodyHeight 198, ms 50 each)

The moment he brings Kirin down, after the raised-arm call (`beamCharge` v05, unchanged). **f0:** the **R arm swung
down and forward** from overhead, straight, pointing down-forward at about 40 degrees below horizontal, **open hand
palm down, fingers pointing at the floor about one body length in front of him** (where the dragon lands); body
leaning forward over a bent front knee, rear leg extended back, head turned down toward the target, mouth set,
Sharingan; the L arm back and low for balance. The hair, sleeves, rope ends and waist cloth **blown upward and back**
by the strike's wind. **f1, f2:** the same pose trembling 1-2 px, the hair and cloth whipping to new shapes. Record the
**R fingertips** as `hand` in all three frames (the engine draws a crackle there).

## 5. Order, review and handback

1. **Batch 1, the Chidori family:** B1 `special` v14, A1 `chidori`, A2 `chidoriForm`, A3 `chidoriBurst`,
   A4 `chidoriSpear`, A5 `chidoriCurrent`. Pack Sasuke with the candidate, run `npm run body sasuke special` and the
   Astra audit on B1, then one review page (the raw strips, packed frames beside idle f0 and the approved combat cell,
   the effects at game scale as GIFs over a stage-colored background); ring Claude for the user's approval.
2. **Batch 2, Amaterasu:** A6 `amaterasu`, A7 `amaterasuIgnite`. One review page (show A6 over a body silhouette);
   ring Claude.
3. **Batch 3, Kirin and the Great Fireball:** B2 `beamFire` v08 (with `npm run body sasuke beamFire` and the Astra
   audit), A8 `greatFireball`, A9 `greatFireballBurst`, A10 `stormCloud`, A11 `kirinBody`, A12 `kirinHead`,
   A13 `kirinStrike`. One review page (show the head on a stack of three body tiles under the clouds); ring Claude.

Each ring names the versions, any holds and the review URL. Record each candidate in `art/REVIEW.md`, the effect
entries in `art/manifest.json` (`vfx.effects.<name>`: frames, ms, colorRule `fullColor`, anchor, fill, `hd: true`,
step, status, version) and `art/TRACKER.md`. Claude integrates each approved batch in game and shows the user an
in-game preview.
