# 0007. Art spec v2: Shippuden designs, ~6.5-head proportions, 256 px cells, versioned review

- Status: accepted
- Date: 2026-10-08
- Amends: [0006](0006-ai-art-pipeline.md) (pipeline roles, file naming). Supersedes the numbers of
  "hi-res sprite spec v1" in `art/SPEC.md`.

## Context

The first model-sheet candidates (spec v1: 192 px cells, ~4.3 heads tall, Part 1 genin outfits) came out
chibi. The user wants the fighters to look serious, with realistic anime proportions. Taller
proportions shrink the head inside the same cell (a 6.5-head body in a 136 px sprite has a ~21 px head), so
faces would lose their detail unless the sprite gets bigger. Codex also turned out to have a built-in image
generator and produced the first candidates itself, which makes Codex the natural generator. The user wants
every generated image to carry a version number so the latest candidate is easy to find and review.

## Decision

**Characters and proportions**

- Era: **Naruto Shippuden** (both fighters about 16). Naruto: black-and-orange Shippuden jacket; Sasuke:
  white open-chest Hebi-era shirt, purple rope belt, sword sheathed at the back of the belt (the sword is part
  of the design; the current moveset does not swing it).
- Proportions: **about 6.5 heads tall**, anime-accurate (the official Shippuden look, not chibi, not
  western-realistic). Serious, athletic, adult-leaning anatomy: longer legs, defined shoulders, smaller head.

**Character cell (spec v2)**

| property | v1 | **v2** |
|---|---|---|
| cell | 192 x 192 | **256 x 256** |
| sheet columns | 16 (3072 px wide) | **16 (4096 px wide; 154 frames = 10 rows = 2560 px tall)** |
| pivot | [96, 180] | **[128, 240]** (feet center, floor line; 16 px empty below) |
| pixelsPerUnit | 86 | **128** (world size stays about the same: a 200 px body = 1.56 units) |
| standing upright body (soles to top of skull) | ~136 px | **~200 px** (head ~31 px = 6.5 heads) |
| hair above the skull | up to ~16 px | **up to ~20 px** |
| idle stance total height incl. hair | ~135 px | **~204 px** |
| cell margin (every opaque pixel inside) | x 4..187, y 4..180 | **x 4..251, y 4..240** |
| colors per character | <= 32 (packer warns > 48) | **<= 48 (packer warns > 64)**, more tones for realistic shading |
| facing / view / pixel rules / magenta raw background | unchanged | unchanged |

VFX cells (128 px, ppu 56) and UI image sizes (portrait 96, cutin 480 x 128, select 384) do not change.

**Idle landmarks (y in the 256 cell, soles on y 240)**

| landmark | y |
|---|---|
| top of hair | 36 |
| top of skull | 52 |
| eyes | 66-70 |
| chin | 83 |
| shoulders | 92 |
| chest | 96-124 |
| stomach / belt | 124-150 |
| hips / crotch | 152 |
| knees | 196 |
| soles (floor) | 240 |

Strike height zones on a same-size opponent: **HIGH (face) y 58-90 · MID (chest) y 92-124 · LOW (stomach) y 122-152**.

**Contact zones (active frames, frame-local px, facing right)**

| anim | strike point | zone | contact zone (x, y) |
|---|---|---|---|
| light1 | lead (far) fist | HIGH | x 206-226, y 64-86 |
| light2 | rear (near) fist | HIGH | x 214-236, y 70-92 |
| light3 | near foot sole | LOW | x 222-246, y 122-148 |
| light4 | kicking foot | HIGH | x 224-248, y 56-88 |
| heavy | rear fist | HIGH, then overhead | F03 x 180-208, y 58-86; F04 x 160-188, y 22-46 (amended) |
| airLight1 | lead fist | MID | x 206-230, y 100-120 |
| airLight2 | near foot | LOW (amended) | x 220-246, y 130-155 |
| airLight3 | kicking heel | MID | x 222-248, y 105-150 |
| airHeavy | both clasped fists | down-forward | x 180-218, y 160-206 |
| throw | throwing hand (release) | release point | x 186-212, y 116-142 |
| beamFire | both palms | beam origin | x 222-238, y 112-132 |
| special | technique hand | LOW (amended) | x 194-222, y 128-158 |

Active-frame numbers per animation are unchanged from v1.

**Effect anchor points** (engine offsets in world units are unchanged; only their pixel position moves:
px = (128 + forward x 128, 240 - up x 128))

| what | engine offset (forward, up) | v2 cell px |
|---|---|---|
| Rasengan-type orb in hand | 0.6, 0.72 | (205, 148) |
| Chidori-type lightning, startup + run (hand low behind) | -0.5, 0.32 | (64, 199) |
| Chidori-type lightning, thrust / recovery | 0.7, 0.78 | (218, 140) |
| beam origin (beamFire palms) | 0.8, 0.92 | (230, 122) |
| projectile spawn (throw release) | 0.5, 0.9 | (192, 125) |
| projectile / beam aim point (chest) | up 0.8-0.85 | y 131-138 |

**Body heights (packer target = tallest trimmed frame incl. hair, px in the 256 cell)**

Upright poses scale v1 by 204/135; horizontal and lying poses are set so the pose also fits the 256 px
width (a realistic body lying flat or flying is ~210-240 px long). Both characters use the same table
(per-character overrides stay possible in the manifest).

| anim | v2 | anim | v2 | anim | v2 |
|---|---|---|---|---|---|
| idle | 204 | light4 | 207 | hurtHigh | 195 |
| run | 204 | heavy | 218 | hurtLow | 183 |
| dash | 160 | airLight1 | 198 | launched | 136 |
| backDash | 207 | airLight2 | 207 | spin | 160 |
| superDash | 120 | airLight3 | 201 | airRecover | 180 |
| jumpSquat | 162 | airHeavy | 198 | down | 96 |
| jumpUp | 198 | guard | 198 | getup | 204 |
| jumpFall | 209 | block | 204 | charge | 198 |
| land | 174 | throw | 201 | beamCharge | 198 |
| light1 | 204 | vanish | 221 | beamFire | 198 |
| light2 | 204 | stagger | 207 | ko | 64 |
| light3 | 215 | special | 204 | intro | 210 |
| taunt | 212 | win | 212 | | |

Pose notes forced by the width: `superDash` flies angled ~25 degrees upward with the knees bent (fits ~230
px wide); `down` / `ko` lie flat with the head toward screen-left (~210 px long); `launched` is arched
diagonally, not fully horizontal.

**Versioned review naming (every generated image)**

- Every generated image gets a two-digit version suffix `_vNN` (v01, v02, ...). Versions are never
  overwritten or reused; the highest number is always the latest candidate.
- Reference: `reference/model_sheet_vNN.png`, `reference/expressions_vNN.png`. The approved one is
  **copied** to the fixed name `reference/model_sheet.png` / `expressions.png` (what later prompts
  attach); the approved idle strip is copied to `reference/idle_approved.png`.
- Animation strips: `raw/<anim>_vNN.png`. The packer uses the **highest** `_vNN` file for each animation
  (a plain `raw/<anim>.png` is used only when no versioned file exists) and prints which file it used.
  Rejected versions move to `raw/_rejected/` (ignored by the packer) so the highest file left is always the
  current candidate. Parts: `raw/_parts/<anim>_vNN_A.png`, `_B.png`. Single-frame fix attempts are
  `raw/<anim>_NN_fixMM.png` (amended; NN = frame, MM = attempt, skipped by the packer); the patched strip
  is saved as the next `raw/<anim>_vNN.png`. `raw/<anim>_NN.png` is only for an animation delivered frame
  by frame.
- VFX: `art/vfx/raw/<effect>_vNN.png` (same highest-version rule). UI: `raw/ui_<name>_vNN.png`; the approved
  one is fitted and saved as `ui/<name>.png`.
- `art/REVIEW.md` is the review queue: newest first, one row per candidate (date, character, asset, file
  link, version, status `needs review` / `approved` / `rejected`, what changed, QA notes). Codex adds a row
  for every image it saves; the user approves or rejects there or in chat; Codex updates the row,
  `TRACKER.md` and `manifest.json` (which record `version` and `approvedVersion`).

**Roles**

- **Codex generates the images** with its built-in image generator, attaching the approved references as
  image inputs, saves versioned files, runs `npm run sprites`, QAs, and queues them in `REVIEW.md`.
- **The user reviews and approves** (and can still generate in ChatGPT by hand; same naming).
- Claude owns the packer, engine integration and this spec.

## Consequences

- `art/SPEC.md`, `art/manifest.json` (`spec` block + body heights), `tools/pack-sprites.mjs` (reads the spec
  block from the manifest; v2 defaults), the briefs, prompts, template, pipeline and agent docs all move to v2
  in one change.
- The engine needs no code change: `SheetAsset` / `SpriteActor` read frame size, pivot and ppu from
  `anims.json`; ppu 128 triggers the HD render mode automatically. Sheets are 4096 x 2560 (4096 x 2816 since the ADR 0011 kit animations: 175 frames, 11 rows): fine on desktop
  GPUs; a GPU with a 2048 texture limit would get a downscaled sheet (three.js warns). Revisit with a
  per-animation atlas if mobile ever matters.
- The in-game 3D-baked placeholder stays chibi (112 px, ppu 44) until the art packs land; restyling it is a
  separate task.
- The spec v1 candidate is archived in `reference/_old/`; all v1 statuses reset to `todo`.

## Amendments

- 2026-10-08: **heavy F04 contact zone** changed from y 8-32 to **y 22-46** (x 160-188 unchanged). The
  packer puts the soles on y 240 and scales the tallest heavy frame to bodyHeight 218, so no pixel can be
  above about y 22; y 22-46 is the v1 zone (y 36-52) scaled by 204/135 around the floor line. bodyHeight 218
  stays.
- 2026-10-08: **airLight2** (y 130-155) and **special** (y 128-158) are labeled **LOW (stomach)**, not MID:
  both ranges lie in LOW (y 122-152). Coordinates unchanged. Chidori-type specials hit with the leading
  shoulder/head on frames 03-04 (hitboxes.json override); only frame 05 uses the hand zone (art/SPEC.md).
- 2026-10-08: **single-frame fix attempts** are `raw/<anim>_NN_fixMM.png` (skipped by the packer), not
  `raw/<anim>_NN.png`: the packer ignores `_NN` singles whenever a `_vNN` strip exists, and reads them as
  an animation delivered frame by frame otherwise.
- 2026-10-08: the auto-hitbox idle slack is **9 px** at v2 (6 px at v1, scaled by standingBodyPx / 136), so
  strike boxes start at about x 174 for an idle front edge at x 182.
