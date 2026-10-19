# Killua: skills revamp (specials, Speed of Lightning, Whirlwind)

> Brief for the Codex chat **"5 - Killlua"** (relay lane `killua-skills`), written by the Claude chat "Killua skills
> revamp (ENG-SKL-KIL)" on 2026-10-18. Claude does all engine work (`src/game/**`, effect names and their procedural
> stand-ins, Godspeed on the body, the afterimages, the zigzag, the bolt from the sky, the yo-yo and its string) on
> branch `feature/killua-skills`. Codex draws the art below. Everything in [art/SPEC.md](../../SPEC.md),
> [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md), the title-style contract
> ([ADR 0029](../../../docs/decisions/0029-title-style-scale-baseline.md)), [art/vfx/README.md](../../vfx/README.md) and
> the HD effect cell of [ADR 0044](../../../docs/decisions/0044-signature-techniques.md) still applies unless this file
> says otherwise. The Sasuke revamp ([sasuke/SKILLS_REVAMP.md](../sasuke/SKILLS_REVAMP.md)) is the closest worked
> example.

## 1. The user's request and decisions

**Request (2026-10-18):** revamp the specials, supers and ultimates so they look like the iconic anime/manga moves;
Naruto and Sasuke are live, Killua, Gojo, Goku and Luffy run in parallel.

**What Claude found in game (2026-10-18):** almost every Killua effect is the generic 128 px `lightning` tile under a
big glow (a white-blue blob), and most hits end in the generic white-out explosion. His electricity has no look of
its own, so it can't be told from Sasuke's.

- **Narukami** (neutral and air special) is a palm push and a blurry white-blue ball flying out; the hit is a white
  explosion that hides the opponent. In the anime this palm move is **Lightning Palm** (雷掌, Ikazuchi); Narukami (落雷,
  "Thunderbolt") is the strike from above.
- **Rhythm Echo** is a ninja smoke puff, a teleport behind them and the claw strike. The anime's 肢曲 (Shikyoku) has no
  smoke: he walks with a changing rhythm and afterimages of him surround the target before the real one strikes.
- **Thunderbolt** is a plain leap (no lightning), the two-handed hammer `airHeavy` dive and a white-out on landing.
- **Godspeed** is a white flash, then now and then a white glow blob near his head for 8 s; nothing on his body.
- **Speed of Lightning** is a dash, 8 identical teleport hits (two poses) each with a white burst, and a slam from
  above with a white-out.
- **Whirlwind** shows white glow blobs around his ready stance; a counter is a white flash and a teleport.

**The user's answers (2026-10-18, question box in this Claude chat):**

| Question | Answer |
|---|---|
| Neutral special | **Lightning Palm:** renamed LIGHTNING PALM like the anime; a jagged forked bolt in his own lightning jumps from his open palm; on hit lightning bursts on them and keeps crawling over their body while they're stunned. No white-out. "Narukami" moves to the up special, as in the anime. |
| Super | **Zigzag + Narukami finish:** he becomes a streak; 8 different blows (his own normals) linked by jagged lightning streaks zigzagging round them, an electric shock on each hit; then he appears above them and a huge Narukami bolt from the sky slams them into the floor. Same damage and timing. |
| Ultimate | **New look, same rules:** lightning bursts out of his body on activation and crawls over him for the whole 5 s; each counter is a lightning streak to behind the attacker, an electrified afterimage left where he stood, a shock on the hit. Still 4 auto-counters in 300 frames. |
| Also revamp | **All four:** Godspeed on his body (down special), Narukami from above (up / air-down special, new `specialUp` strip), Rhythm Echo afterimages (forward special, engine only), and **electrified yo-yos** replacing the air palm bolt (new yo-yo effect and a new air `throw` strip). |

**Claude's calls on the details (no extra art):**

- **Lightning Palm strip:** the shipped `special` v07 is already the open-palm thrust (f3-f5 arm straight, palm
  forward, `hand` anchored on the palm). It stays; the new effects (A1-A4) carry the revamp.
- **Godspeed activation:** the shipped `specialDown` v07 (clench, then arms flung out with a shout) is the anime's
  activation. It stays; A5-A7 carry the revamp. His hair standing up in Godspeed is drawn by the effect (A6's sparks
  bristling above the head), not by a redraw of every strip.
- **Rhythm Echo** uses his approved `beamCharge` v08 (the loose Whirlwind ready stance: arms hanging, hands relaxed,
  the anime's Rhythm Echo walk) for the afterimages and the approved `specialForward` v12 claw for the strike. No
  character art.
- **Speed of Lightning** strikes with his approved normals (`light1`-`light4`, `heavy`, `fair`, `bair`, `uair`;
  missing ones fall back) and finishes with the new `specialUp` v09 dive frame (B1). **Whirlwind** keeps
  `beamCharge` v08 and `specialForward` v12.
- **Names:** the neutral special and its HUD callout become **LIGHTNING PALM**, the up / air-down special
  **NARUKAMI**, the air special **YO-YO**. The super and ultimate keep their names.

## 2. Rules for this task

- **Models:** generate and direct every image with `gpt-6-luna`, reasoning `medium` (CLAUDE.md "Agent model
  selection"); if this chat runs another model, spawn a Luna subagent (`model`, `reasoning_effort: "medium"`,
  `fork_turns: "none"`) for the generation. The final **Astra** anatomy/scale audit (`gpt-6-astra`, medium) applies to
  the two character strips (B1, B2) only. Effects (part A) need no Astra audit.
- **Budget:** at most 3 generation calls per image, cumulative across retries. One candidate inventory with every
  call, its prompt file and its verdict.
- **Versions:** never overwrite, reuse or delete a `_vNN` file. Next free versions (checked against disk, `_rejected/`,
  `_parts/`, `_qa_hold/`, REVIEW.md, the Codex worktrees and git history of every branch on 2026-10-18; the reverted
  `art/scale-fix-killua` history holds `specialUp` v03-v07 and `throw` v03-v05): **`specialUp_v09`**,
  **`throw_v07`**; every new effect starts at `_v01` (none of the ten names below exists in `art/vfx/raw/`).
- **Branch:** one worktree, branch `art/killua-skills`, sparse with the raw art you need
  (`npm run pr -- start art/killua-skills --art killua,vfx`, or the host's managed worktree plus
  `npm run pr -- art killua,vfx`). Dev server on a free port (52xx). Commit only your own paths.
- **Shared files:** the Codex chat "4 - Combat Overhaul" (lane `combat`, branch `art/normals-killua`) is editing
  Killua's directional normals and Smash moves (ENG-112) at the same time. In `art/manifest.json`,
  `art/characters/killua/hitboxes.json`, `art/REVIEW.md` and `art/TRACKER.md` change only the rows of the animations
  and effects in this brief.
- **Packing:** the HD cell (256 px, 112 px per unit, `atlas_hd.png`) is on main since PR #151. A manifest entry
  `vfx.effects.<name>` with `"hd": true` plus `frames`, `ms`, `anchor` and `fill` from the table below is all the
  packer needs, so `node tools/pack-sprites.mjs vfx --candidates` works for the new names right away. Claude
  registers the same names with procedural stand-ins on `feature/killua-skills`. Do not edit `src/` or `tools/`.
- **Approval:** the user approves every image version. The approvals desk is off: when a batch is ready, ring Claude
  with `node tools/relay.mjs ring killua-skills --for user --kind approval --note "<items, versions, review link>"`
  from main and stop on that batch; Claude packs the candidates in game, asks the user and relays the answer word for
  word. For a technical question or a finished non-image step, ring `killua-skills` without `--for user`. Never treat
  anything else as approval.

### The HD effect cell (every part A effect)

256 x 256 px cell at 112 px per world unit (2.29 units across at scale 1; a standing fighter is about 175 px tall in
this cell's pixels). Anchors: **center** = the effect's center on pixel (128, 128) in every frame; **bottom** =
centered on x = 128, base on y = 240 (16 px empty below). The packer scales each strip so its largest frame is `fill`
x 256 px; only the relative sizes between frames come from the art. Draw the sizes below at that final scale.
Effects are drawn **facing screen-right** where they have a direction; the engine mirrors and turns them.

**Style for every effect:** crisp hard-edged pixel art like the approved HD effects (`art/vfx/raw/rasengan_v01.png`,
`chidoriCurrent_v01.png`, `kirinStrike_v01.png`), flat magenta background, no text, no black outline around the
effect, no soft blur, airbrush, dithering noise or anti-aliased gradients; shading in hard color bands; at most 16
colors per effect. Effects must read at small scale in a busy fight: a bright core, clear shapes, a dark rim for
contrast. **No effect may be a solid white disc or fill most of its cell with white**: that is exactly what Killua's
lightning looks like today.

### Killua's lightning (A1-A9, A10's arcs): his own, not the Chidori

Sasuke's Chidori (`chidori*`, `kirin*`) is a **dense knot of short blue arcs with dark-blue rims**. Killua's
Transmutation lightning in the 2011 anime is the opposite, and every Killua effect keeps to it:

- **Thin, long, angular filaments:** 1-3 px white or near-white cores with 1-2 px pale cyan edges, running in long
  branching paths with **sharp kinks** (short straight runs and abrupt turns, like static), never round or wavy.
- **Sparse:** lots of empty space between filaments; small 1-2 px sparks and short broken dashes along them. Never a
  ball, a knot or a filled glow.
- **Violet rims:** the outer 1-2 px band of the thicker filaments, and every rim, are violet / deep violet instead of
  the Chidori's dark blue.
- **Palette:** `#FFFFFF`, `#EAFCFF`, `#B4F0FF`, `#62D8FF`, `#3A9BF0`, `#8C6BFF`, `#5534D0`, `#24125E` (rim). White only
  in the thin cores and the brightest tips; most of each filament is the pale cyans.

## 3. Part A: new effects (art/vfx, HD cell, full color)

Raws: `art/vfx/raw/<name>_v01.png`, one row of frames left to right. Cleaned frames: `art/vfx/frames/<name>/<name>_00.png`
... at exactly 256 x 256.

| # | Name | Frames | ms | Plays | Anchor | fill | Used for |
|---|---|---|---|---|---|---|---|
| A1 | `lightningPalm` | 8 | 30 | loop | center | 0.95 | Lightning Palm: the bolt flying from his palm (turned along its flight) |
| A2 | `palmCrackle` | 6 | 35 | loop | center | 0.5 | lightning gathering in his open palm (Lightning Palm's startup, Narukami's apex, Speed of Lightning's flash) |
| A3 | `palmShock` | 8 | 40 | once | center | 0.98 | the shock bursting through them on a hit (Lightning Palm, the super's blows, Whirlwind's counter, the yo-yo at a small scale) |
| A4 | `shockCrawl` | 6 | 50 | loop | bottom | 0.85 | electricity crawling over a paralysed body while they're stunned |
| A5 | `godspeedBurst` | 8 | 40 | once | center | 0.98 | Godspeed switching on: lightning discharging from his whole body (Godspeed, Whirlwind, the super's flash) |
| A6 | `godspeedAura` | 8 | 40 | loop | bottom | 0.95 | Godspeed on his body for the whole mode (and all of Whirlwind) |
| A7 | `godspeedStreak` | 6 | 30 | once | center | 1.0 | the lightning streak he leaves when he moves at Godspeed (blink dash, the super's zigzag, Whirlwind's counter), laid along the path |
| A8 | `narukamiBolt` | 4 | 40 | loop | center | 1.0 | Narukami's bolt from the sky, stacked from the top of the screen down to him and the target |
| A9 | `narukamiStrike` | 8 | 45 | once | bottom | 0.98 | Narukami hitting the floor |
| A10 | `yoyo` | 8 | 30 | loop | center | 0.42 | his electrified steel yo-yo flying out and back on its string (the engine draws the string) |

### A1 `lightningPalm`: the bolt (8 frames, seamless crackle loop)

A **jagged lightning bolt flying to screen-right**, drawn horizontally across the cell: its **head** is a bright
forked tip at x about 236 (a 10 px white point with 3-4 short forks splaying forward), its **main channel** runs back
to the left edge (x about 12) within y 100-156, zigzagging in sharp kinks (straight runs of 15-30 px, abrupt turns),
with 2-3 **side branches** splitting off backward and outward (up to y 70 and y 186) and ending in tiny forks. Core
3-4 px white near the head thinning to 1-2 px toward the tail, pale cyan edges, violet rim on the thick part, a few
sparks along it. Each frame a different channel path and different branches (same length and head position), so it
flickers like real lightning; f7 flows into f0. No glow disc at the head.

### A2 `palmCrackle`: lightning in his palm (6 frames, loop)

Electricity gathering in an open palm (the engine puts the palm at the cell center): a small bright point (about 12
px) and **5-8 thin filaments snapping out of it** in all directions to about 60-120 px across, kinked and forked,
plus 4-6 loose 2 px sparks around them. Each frame a new set of filaments (same overall size). Mostly pale cyan with
white cores and violet tips. No ball or knot: the point stays small.

### A3 `palmShock`: the shock (8 frames, once)

Not a white-out: the hit must read as **electricity jumping into and through the body**. Leave the body area mostly
clear: a vertical oval about 80 px wide and 180 px tall around the center (x 88-168, y 38-218) has only thin
filaments crossing it, so the victim shows through. f0: a bright 20 px point on the oval's left edge (the impact, on
x about 92, y 120) with a straight spike of lightning entering from the left edge. f1: filaments racing from the point
across and around the oval in kinked paths, a thin ring of sparks. f2-f3: long thin filaments **bursting outward
from the oval's outline** in every direction to near the cell edge, longest to the right (the far side), forked
tips. f4: the filaments snapping back to half length, broken into dashes. f5-f7: short crackles on the outline and
scattered sparks fading, nothing left by f7.

### A4 `shockCrawl`: the paralysed body (6 frames, seamless loop, bottom anchor)

The anime's electrocution while they're stunned: **thin crackling filaments crawling over a standing body**, base on
y = 240. The body area is an upright oval about 100 px wide and 190 px tall (x 78-178, y 50-240); every frame shows
**3-5 filaments** jumping between points on and just outside that outline (shoulder to elbow, hip to knee, across the
chest, from the head up), each 20-60 px long with sharp kinks, plus 4-8 sparks. Nothing fills the body: at most a
fifth of the oval is covered in any frame. Each frame a different set; the loop must not jump in size.

### A5 `godspeedBurst`: Godspeed switching on (8 frames, once)

Lightning discharging from his **whole body** at once, the anime's "Kanmuru" moment. **Leave the body area clear**
(the same oval as A3: x 88-168, y 38-218, only a few thin filaments crossing it). f0: crackling filaments hugging the
oval's outline, a thin bright rim. f1-f3: long jagged filaments shooting **outward from the outline in every
direction** to near the cell edge, forked tips, **the longest straight up from the top of the oval** (his hair
standing on end), a crackling halo round the oval. f4: the filaments snapping back to half length. f5-f7: short
crackles on the outline fading. Different from Sasuke's `chidoriCurrent`: thin and sparse, violet rims, the upward
burst.

### A6 `godspeedAura`: Godspeed on his body (8 frames, seamless loop, bottom anchor)

Godspeed held for 8 seconds while he fights: an **upright crackling field around a standing body**, base on y = 240,
about 130 px wide and 230 px tall. The body oval (x 84-172, y 58-240) shows his sprite through it: each frame only
2-3 thin filaments cross it. Around it: **long thin filaments crawling up the outline from the feet to the head**, short
arcs jumping off the hands' height (x 70-90 and x 166-186 at y 130-160), and **sparks and short upward arcs
bristling above the head** (y 18-60, his electrified hair). Each frame a different crackle, same silhouette size. It
must also look right when the engine lays it over a running, jumping or crouching body, so keep it loose: a field of
filaments, not a traced outline.

### A7 `godspeedStreak`: the Godspeed streak (6 frames, once)

The trail of lightning he leaves when he moves faster than the eye: **one thin jagged channel across the whole cell
width on y = 128**, from x 0 to x 255, its kinks within y 112-144, small forks every 30-50 px. The engine stretches it
along his path (2-7 world units) without making it thicker, so keep it thin. f0: the full channel bright, a 3-4 px
white core with pale cyan edges and violet rims. f1: the same channel, forks changed, a few sparks off it. f2: thinner
(2 px core), more sparks. f3: breaking into dashes from both ends toward the middle. f4: scattered short dashes. f5:
a few sparks. Both ends must reach the cell edges in f0-f2 so streaks laid end to end join.

### A8 `narukamiBolt`: the bolt from the sky (4 frames, loop, tiles vertically)

A **vertical column of lightning about 70 px wide** that **tiles seamlessly top to bottom** (row y = 0 continues row
y = 255 exactly), so the engine can stack copies from the top of the screen down to the floor: a white-cyan core 10-14
px wide zigzagging in sharp kinks down the cell, pale cyan and cyan bands, violet rims, and thin forked filaments
snapping off the sides to about 50 px out. Each frame a different crackle on the same column (the core keeps its path
at the top and bottom edges so the stack joins in every frame). Thinner and sharper than Sasuke's `kirinBody`, never a
smooth beam.

### A9 `narukamiStrike`: Narukami hitting the floor (8 frames, once, bottom anchor)

Readable, not a white-out. f0: the bolt hitting: a 40 px wide vertical white-cyan channel from the top edge to the
floor line, a flat bright splash about 140 px wide along y = 240. f1: thin filaments racing out along the floor both
ways and up in branching forks, a low crackling dome about 200 px wide and 110 px tall. f2-f3: the dome at full size
(about 236 x 150), the channel thinning to 20 px, forked filaments leaping from the dome, violet rims. f4: the channel
gone, the dome breaking into separate arcs. f5-f7: arcs and sparks crackling low along the floor, fading out.

### A10 `yoyo`: the electrified yo-yo (8 frames, seamless loop)

Killua's **steel yo-yo** charged with his lightning, flying: the yo-yo seen almost face-on, a **disc about 52 px
across** centered on (128, 128): two heavy polished steel halves (a bright rim highlight, a darker groove ring, a hub
in the middle), spinning (the hub's highlight and two notches on the rim advance a quarter turn every two frames), with
**3-4 thin filaments of his lightning crackling round it** out to about 105 px across and a few sparks. No string (the
engine draws it from his finger). Steel palette: `#F4F8FC`, `#C9D3E0`, `#8E9BB0`, `#5A6478`, `#2C3242` (rim), plus the
lightning palette above.

## 4. Part B: Killua character art

Scale and anatomy follow the title-style contract: the same pixel density as his approved idle and combat cell, 256 px
cells, pivot `[128, 240]`, facing right, 48-color sheet palette, his purple long-sleeved shirt over the white
undershirt, dark navy shorts and purple high-tops as approved. Attach his approved title-style neutral/combat cells and
his approved idle as references. **No lightning, glow or energy in any sprite:** the engine draws every effect.

### B1 `specialUp` v09: NARUKAMI (6 frames, phases 2/2/2, bodyHeight 197, ms unchanged in the manifest)

Narukami, the strike from above (落雷), as in his fight with Youpi: he leaps over the target, gathers lightning in his
hand above them and dives down **palm first**. Frame count and phases stay (S = rise, A = rise / anti-air, R = apex and
dive); the engine stretches them over the move.

- **f0 · S, the coil:** a deep low crouch, weight forward, both hands low and open (claws), eyes up at a target above
  and in front of him.
- **f1 · S, the launch:** springing up and forward, legs extending below him, the R arm rising.
- **f2 · A, the rise (1):** rising diagonally, the **R claw thrust up and forward above his head** (the anti-air hit),
  the L arm back, knees bent, the hair and shirt swept down by the climb.
- **f3 · A, the rise (2):** the same, higher, the legs trailing.
- **f4 · R, the gather:** at the apex, above the target: his body tipping forward over them, the **R arm drawn up and
  back over his head, hand open, palm facing forward** (the lightning gathers in it), the L arm reaching forward and
  down toward the target as if aiming, knees tucked, eyes down on them.
- **f5 · R, the dive:** **pitched head-first down and forward at about 45 degrees**, the **R arm thrust straight ahead
  of his head, down-forward, palm open and facing the floor, fingers spread**, the L arm swept back along his side,
  the legs trailing up behind him, the hair and shirt blown back up by the fall, face fierce, mouth open shouting.
  **The engine holds this frame for the whole dive** (and for the finish of Speed of Lightning), so it must read on its
  own.

**Anchors (hitboxes.json `specialUp`):** record the **R palm** as `hand` in every frame (f4: the raised palm where
the lightning gathers; f5: the thrust palm where the bolt leaves), measured on the packed cells. `hit` boxes on **f2
and f3** on the rising claw, like v08's `[188, 41, 26, 29]`; the dive's hit is the landing area in the engine, so f4-f5
need no box. Keep his head within the strict scale gate against idle (the packer's auto head fit) and keep the same
body proportions in the flipped dive frame (no shrinking to fit the cell: let the trailing feet reach toward the top
corner if they must, inside the cell).

### B2 `throw` v07: YO-YO (4 frames, phases 1/1/2, bodyHeight 173, ms unchanged in the manifest)

The air special: in mid-air he snaps his steel yo-yo down at them at about 30 degrees below horizontal (it flies out
and comes back on its string; the engine draws the yo-yo after f0 and the string).

- **f0 · S, the wind-up:** airborne, body coiled, knees tucked, the **R arm cocked back beside his head with the steel
  yo-yo in his R hand** (a fist-sized polished steel yo-yo, `#C9D3E0` / `#8E9BB0` with a bright rim; a prop, so it is
  drawn here), the L arm forward pointing at the target.
- **f1 · A, the snap:** the **R arm whipped forward and down** at about 30 degrees below horizontal, wrist flicked, the
  hand open with the **middle finger crooked** (the string's loop is on it), the yo-yo gone from the hand; body leaning
  into the throw, the L arm pulled back.
- **f2 · R, follow-through:** the R arm still extended down-forward, the hand turned palm up as he tugs the string, the
  legs swinging forward.
- **f3 · R, the catch:** the R arm pulled back toward the chest, hand open to catch the returning yo-yo (empty: the
  engine's yo-yo arrives there), knees tucked.

**Anchors (hitboxes.json `throw`):** record the **R middle finger** as `hand` in all four frames (f0: the yo-yo in the
hand; the engine launches the yo-yo from f1's anchor and draws the string from the current frame's anchor). No `hit`
boxes (the yo-yo is the hit).

## 5. Order, review and handback

1. **Batch 1, his lightning:** A1 `lightningPalm`, A2 `palmCrackle`, A3 `palmShock`, A4 `shockCrawl`,
   A5 `godspeedBurst`, A6 `godspeedAura`, A7 `godspeedStreak`. One review page: the raw strips, the effects at game
   scale as GIFs over a stage-colored background, A4 and A6 over a Killua idle silhouette, and A1 / A3 side by side
   with Sasuke's `chidori` / `chidoriBurst` at the same scale (they must not look alike). Ring Claude.
2. **Batch 2, Narukami:** B1 `specialUp` v09 (with `npm run body killua specialUp` and the Astra audit), A8
   `narukamiBolt`, A9 `narukamiStrike`. One review page (show the dive frame f5 under a stack of three bolt tiles,
   and the strike beside it); ring Claude.
3. **Batch 3, the yo-yo:** B2 `throw` v07 (with `npm run body killua throw` and the Astra audit), A10 `yoyo`. One
   review page (the yo-yo at game scale beside the f1 hand); ring Claude.

Each ring names the versions, any holds and the review URL. Record each candidate in `art/REVIEW.md`, the effect
entries in `art/manifest.json` (`vfx.effects.<name>`: frames, ms, colorRule `fullColor`, anchor, fill, `hd: true`,
step, status, version) and `art/TRACKER.md`. Claude integrates each approved batch in game and shows the user an
in-game preview.
