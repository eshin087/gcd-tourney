# Clash HD art: each move's own look in a beam clash (ART-CLASH-HD, 2026-10-19)

Brief for the Codex chat **"6 - beam clash"** (relay lane `beam-clash-6`). Engine side: the Claude chat "Beam clash
visual bugs" on `feature/beam-clash-r3` (ENG-122, ADR 0055). Older beam clash briefs: EFFECTS.md "Beam clash (ADR
0034)" and art/characters/BEAM_STRUGGLE_BRIEF.md (rounds 1-4, all live).

## 1. Why, and the user's decisions

The user (2026-10-19): "the beam clashes between all the characters are really buggy janky and not looking good. some
seem to have placeholder beams instead of the iconic ability they use." Claude frame-stepped every pairing in the lab.
Since the skills revamp every move has approved HD art, but a clash still draws the 128 px stand-ins from round 1:
the Chidori Spear is a thin laser, the Lightning Palm a small zigzag strip, Reversal: Red a long red laser, the Great
Fireball a low-res fire strip, the Dragon Fist a plain yellow glow, and the point where the two attacks meet a white
ball. In the ultimate clash the Kamehameha and the Four-Tails beam merge into one bar with no visible collision.

The user's answers to Claude's questions (2026-10-19, in Claude's chat):
- **New clash art:** Codex draws new HD pieces matching each move's approved art; the user approves every image.
- **Red:** the Red orb itself shoves forward into the other attack with repulsion shockwaves, no beam.
- **Luffy:** the Gigant Pistol clashes with the beam and orb ultimates (engine only: his approved `gigantArm` and
  `gigantFist` are reused, no new art).
- **Winner:** the attack blasts through the loser and stops in the move's own burst (engine only).

Claude fixes everything else in code (winner poses, the screen-long laser, the glow discs, Hollow Purple sinking into
the floor, the clipped names). Until an image is approved the game keeps today's stand-ins, so nothing waits on this.

## 2. Rules

- **Model:** generate and direct every image with `gpt-6-luna`, reasoning `medium` (CLAUDE.md "Agent model
  selection"). These are effects, not character strips: no Astra audit.
- **Budget:** at most 3 generation calls per image, cumulative across retries. One candidate inventory (every call,
  its prompt file and its verdict) in `art/vfx/production/clash-hd/`.
- **Versions:** every name below is new (none exists in `art/vfx/`, its subfolders or git history on 2026-10-19), so
  each starts at `_v01`. Never overwrite, reuse or delete a `_vNN` file.
- **Branch:** one worktree, branch `art/clash-hd` (`npm run pr -- start art/clash-hd --art vfx`, or the host's managed
  worktree plus `npm run pr -- art vfx`), dev server on port 5247. Commit only your own paths. Do not edit `src/` or
  `tools/`: Claude registers the names in the engine and the packer on `feature/beam-clash-r3`.
- **Manifest:** add each name under `vfx.effects` with `"hd": true`, `owner`, `frames`, `ms`, `fill`, `anchor`,
  `colorRule` and `tile` from the table in section 3 (that is all `node tools/pack-sprites.mjs vfx --candidates` needs).
  Change only these eight rows in `art/manifest.json`, `art/REVIEW.md` and `art/TRACKER.md`: other chats edit them too.
- **Approval:** the approvals desk is off. When the batch is ready, ring Claude once with
  `node tools/relay.mjs ring beam-clash-6 --for user --kind approval --note "<items, versions, review link>"` from main
  and stop. Claude asks the user and relays the answer word for word; nothing else counts as approval.

### The HD effect cell

256 x 256 px at 112 px per world unit (2.29 units across at scale 1). **A fighter standing is about 175-186 px tall in
these pixels.** Anchor **center** = the effect's center on pixel (128, 128) in every frame. The packer scales each strip
so its largest frame is `fill` x 256 px; only relative sizes between frames come from the art, so draw the sizes below at
that final scale. Every effect **flows screen-right** (left = the fighter's hand, right = toward the other attack); the
engine turns and mirrors it.

**Style:** crisp hard-edged pixel art like the approved HD effects it continues (section 4 names the exact files), flat
magenta background, no text, no black outline, no soft blur, airbrush, dithering noise or anti-aliased gradients;
shading in hard color bands; at most 16 colors per effect. A clash keeps both fighters readable, so these read by
**shape**, not brightness: a bright core, clear silhouettes, a dark rim. **No solid white discs or white-filled cells**:
white only in cores, thin edges and sparks.

### Tiling bands (the five `*Stream` effects)

The engine lays a band end to end along a stream from the hand to the meeting point and cuts the last copy. Each frame
is a horizontal band across the **full 256 px width**, centered on y 128, and **column 0 continues column 255
seamlessly** (the core crosses both edges at the same height and thickness). Generate the raw as usual
(`raw/<name>_v01.png`), then cut and clean each frame into an exact 256 x 256 tile in `frames/<name>/<name>_NN.png`, as
for `gigantArm` (the packer keeps exact tiles as they are and warns about a frame that does not reach both edges). Check
each seam by laying three copies side by side, and check the loop by playing the frames in order.

## 3. The eight effects

| # | Name | Owner | Frames | ms | Plays | Color | Anchor | fill | tile | Used for |
|---|---|---|---|---|---|---|---|---|---|---|
| C1 | `clashKnot` | shared | 8 | 40 | loop | white (tinted) | center | 0.95 | no | where two attacks collide, every clash (two layers, one tinted per side) |
| C2 | `spearStream` | sasuke | 4 | 35 | loop | full color | center | 1 | yes | the Chidori Spear held as a lightning lance into the clash |
| C3 | `palmStream` | killua | 4 | 30 | loop | full color | center | 1 | yes | the Lightning Palm bolt pouring into the clash |
| C4 | `fireballStream` | sasuke | 4 | 50 | loop | full color | center | 1 | yes | the Great Fireball as a torrent of fire (Sasuke from the air) |
| C5 | `kamehamehaStream` | goku | 4 | 40 | loop | full color | center | 1 | yes | the Kamehameha's beam body in an ultimate clash |
| C6 | `beastBeamStream` | naruto | 4 | 40 | loop | full color | center | 1 | yes | the Four-Tails' chakra beam body in an ultimate clash |
| C7 | `redPush` | gojo | 8 | 40 | loop | full color | center | 0.9 | no | Reversal: Red, the orb shoving forward into the other attack |
| C8 | `dragonFistPush` | goku | 8 | 45 | loop | full color | center | 0.98 | no | the golden dragon bursting from Goku's fist into the other attack |

`colorRule` in the manifest: `"tinted"` for C1, `"fullColor"` for the rest.

### C1 `clashKnot`: the collision (8 frames, seamless loop, white tinted)

The heart of every clash, held for 4-8 s between the fighters at chest height and pushed left and right as the rhythm
duel goes. Think Dragon Ball beam struggles: two forces grinding into each other. A **compact roiling core** (about
40-50 px, lumpy, never a clean circle) with **jagged energy spikes and arcs spraying up and down** (the spray off a
head-on collision), shorter ragged tongues back along both sides (where the two attacks enter), a few loose 2-4 px
sparks and chips flying off. The spikes carry the size: up to about 220 px tall in the biggest frame, about 120 px wide.
Drawn in **white and light greys only** (#FFFFFF, #E6E6E6, #C8C8C8, #9A9A9A for the darkest inner folds; alpha in 3-4
hard steps) because the engine draws it twice, tinted in each side's color, the second layer mirrored. The core folds
and churns every frame; spikes shoot out, fork and fall back so f7 flows into f0. Must not read as a round flash or a
star burst: it is a knot under pressure. (It replaces the 128 px `clashBurst` v01, which reads as a white ball.)

| Frame | Description |
|---|---|
| f0 | Core ~44 px, folded; 5-6 spikes up and down reaching ~70 px; side tongues ~30 px. |
| f1 | The core bulges up-left; a tall spike up (~95 px), a forked one down; 3 sparks. |
| f2 | Spikes ~85 px both ways, an arc looping over the top; side tongues flicker. |
| f3 | The biggest frame: spikes reach ~110 px up and down, the core swells to ~52 px, chips flying. |
| f4 | Spikes re-form in new places at ~80 px; the core folds the other way. |
| f5 | Core ~46 px, two long forked spikes down-right and up-left, sparks drifting out. |
| f6 | Spikes ~70 px, a short arc on each side. |
| f7 | Close to f0 with different spikes; loops into f0. |

### C2 `spearStream`: the Chidori Spear as a lance (4 frames, tile)

Continue the approved `chidoriSpear` v01 (`art/vfx/raw/chidoriSpear_v01.png`, f3-f5): its straight white-hot blade
with blue lightning around it, now running the full tile width. A **perfectly straight blade core** 10-14 px thick on
y 128 (white center, #BFE8FF edge), **wrapped in crackling blue lightning**: thin jagged arcs (1-3 px) jumping off the
blade above and below, a few hooking back onto it, different every frame. Band up to **96 px** tall (y 80-176), most of
the crackle within 30 px of the blade. Palette: Sasuke's lightning `#FFFFFF`, `#E8F7FF`, `#BFE8FF`, `#7CC8FF`,
`#3E8CFF`, `#2350D8`, `#141E78` (rim).

### C3 `palmStream`: the Lightning Palm bolt (4 frames, tile)

Continue the approved `lightningPalm` v01 (`art/vfx/raw/lightningPalm_v01.png`): Killua's forked white-violet bolt, now
a continuous stream. **One main bolt 6-10 px thick with sharp kinks** zigzagging along y 128 (never more than 30 px off
it), a thinner second bolt weaving around it, short forks off the kinks; a different zigzag every frame (it flickers),
always crossing both edges at y 128 at the same thickness. Wilder than the spear, never straight. Band up to **110 px**
tall. Palette: Killua's lightning `#FFFFFF`, `#EAFCFF`, `#B4F0FF`, `#62D8FF`, `#3A9BF0`, `#8C6BFF`, `#5534D0`,
`#24125E` (rim). White only in the bolt cores.

### C4 `fireballStream`: the Great Fireball torrent (4 frames, tile)

Continue the approved `greatFireball` v01 (`art/vfx/raw/greatFireball_v01.png`): the same fire, now a torrent pouring
left to right. **Billowing lobes along the top and bottom edges rolling forward** (to the right) frame by frame, a
yellow-white core line on y 128, licks of flame curling back off the edges, a few dark-red smoke flecks. The lobes repeat
across the 256 px width so the band tiles. Band up to **150 px** tall, widest in the middle of the tile. Palette: the
`greatFireball` colors (dark red rim, red, orange, yellow, pale yellow core; white only in the core line).

### C5 `kamehamehaStream`: the Kamehameha's body (4 frames, tile)

Continue the approved `kamehamehaHead` v01 (`art/vfx/raw/kamehamehaHead_v01.png`): its blue and white stripes swirling
forward, now as the beam body behind the head. A **solid beam about 130 px thick**: a white core about 50 px, then pale
blue, light blue and deep blue bands, the bands **twisting forward in long diagonal swirls** (like the head's) that move
right frame by frame; the top and bottom edges ripple with small curling tongues. Band up to **150 px** tall. Palette:
Goku's ki blue `#FFFFFF`, `#E6FAFF`, `#AEE8FF`, `#6CCBFF`, `#2E9BFF`, `#1A62E0`, `#123A9E` (rim). In a clash the
approved `kamehamehaHead` sits at its front, pressed into the knot, so the two must match.

### C6 `beastBeamStream`: the Four-Tails' beam body (4 frames, tile)

The chakra blast from the Four-Tails' mouth, matching the approved `beastBall` v01 and `beastBeamRing` v01
(`art/vfx/raw/beastBall_v01.png`, `beastBeamRing_v01.png`) and `fourTailsRoar` v02: **a boiling torrent of dark red-black
chakra about 180 px thick** with a hot orange-red core (about 60 px, a white-hot line in its middle), bubbles and blobs
of chakra boiling along the edges and rolling forward, a few blue chakra flecks (the ball's red and blue). Heavier and
more menacing than the Kamehameha. Band up to **200 px** tall. Palette: `#1A0204`, `#4A0606`, `#7A0C0C`, `#C8281E`,
`#FF4A2A`, `#FFB08A`, `#FFE8DC` (core line only), plus `#3A8AFF` for the flecks.

### C7 `redPush`: Reversal: Red shoving forward (8 frames, seamless loop)

Continue the approved `reversalRed` v01 (`art/vfx/raw/reversalRed_v01.png`) and `redBurst` v01: the same crimson sphere
with its white-hot core, but now **pressing forward against something**: the orb (about 72 px) centered a little left
of the cell center (x ~110, y 128), its front edge flattening slightly against an invisible wall at x ~150, and
**repulsion shockwaves bulging out in front of it**: 2-3 concentric crimson arcs (2-3 px) pushing to the right from the
orb's face toward x ~250, each one widening and breaking into dashes as it travels, a new one starting every few frames
so f7 flows into f0. A short, faint wake of 1-2 thin arcs behind the orb (to the left). Small red chips spray off the
contact point. Not fire, not a flame, not a beam. Palette: Gojo's red `#FFFFFF`, `#FFE0DC`, `#FF8A8A`, `#FF3A4A`,
`#E0122E`, `#A00C22`, `#5A0614` (rim).

### C8 `dragonFistPush`: the golden dragon driving forward (8 frames, seamless loop)

Continue the approved `dragonFistDragon` v01 and `dragonFistAura` v01 (`art/vfx/raw/dragonFistDragon_v01.png`,
`dragonFistAura_v01.png`): the same golden ki dragon, now **bursting straight forward out of the fist** and pushing into
the other attack. Its **head at the right** (x ~150-245, jaws wide open, roaring, horns and whiskers streaming back),
its neck and body **trailing back to the left edge in tight S-curves** (the tail end at x ~0-30 on y 128, where Goku's
fist is). The body writhes and the jaws snap open and shut a little over the loop; golden ki flames lick off the body.
Fill the cell's height no more than about 170 px. Palette: dragon gold `#FFFFFF`, `#FFF6C0`, `#FFE066`, `#FFC21A`,
`#F08C0A`, `#B85A06`, `#6A3004` (rim); white only in the eyes, teeth and core highlights.

## 4. QA and the review page

1. `node tools/pack-sprites.mjs vfx --candidates` packs all eight with no tile or fill warning.
2. Bands: three copies side by side show no seam; the loop shows no jump.
3. In the lab with `?art=custom` (dev server 5247): once Claude's engine branch is merged into yours (`git merge
   feature/beam-clash-r3` inside your worktree when the relay says it is ready), the scenarios "Beam clash", "Beam clash
   from the air" and "Ultimate clash" show them in place. Before that, judge them on the page.
4. One phone review page `public/reviews/clash-hd/`: each effect's frames at 2x plus a looping GIF; each band tiled three
   times end to end; each piece beside the approved effect it continues (C2 beside `chidoriSpear`, C3 `lightningPalm`,
   C4 `greatFireball`, C5 `kamehamehaHead`, C6 `beastBall`, C7 `reversalRed`, C8 `dragonFistDragon`) at one density.
   REVIEW.md rows (`needs review`), manifest and tracker rows, commit, `npm run pr -- open`, `npm run pr -- preview`.
5. Handoff at the top of `docs/agents/CLAUDE_ART_HANDOFF.md` (branch, commit, calls used, review link, anything held),
   then the approval ring (section 2) and stop.
