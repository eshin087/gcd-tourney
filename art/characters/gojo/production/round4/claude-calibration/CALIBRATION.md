# Gojo round 4: Claude calibration and assembly diagnosis (2026-10-14)

Requested in `../CLAUDE_RECALIBRATION_20261014.md` (Codex, `f9db974`). No generation, no budget change, no art approval,
no merge, no deploy. Measuring note: on this branch the newest idle is v07, and the packer measures every Gojo strip's
head against the newest idle. v07's head reads about 9 % small, so the branch's head numbers (superDash 0.47, throw
0.79, light3 0.85...) mostly measure the moving reference, not the strips. The readings below compare Gojo's white hair
directly (topmost light blob: width x height, pixel count) against the approved title cells (35 x 22) and the shipped
idle v06 (36-37 x 23-24) at one pixel density.

## idle v07: not calibratable (drawing residual)

At bodyHeight 236 the eight frames are 234-236 px tall and 135-138 wide, with hair 32 x 22 (about 0.91 of the approved
cells). Packing it to the 210-216 px target (k about 0.9) shrinks the hair to about 29 px (0.83). Matching the head
(k about 1.09) makes it about 258 px tall (the cell holds 237) with the torso about 90 px against the shipped idle's 79
and the combat cell's 71. Width at head scale (about 147-150) would fit the 145-160 target; height and torso cannot.
**The pose is drawn more upright and longer than the combat cell, with a small head**, so no uniform factor meets the
target without distorting the approved anatomy. Idle A's budget is spent (B has 2 calls left, but every frame shares
the problem). While v07 is the newest raw it is also the gate reference for every Gojo strip, so holding it
(`raw/_qa_hold/`) is what makes this branch's head numbers meaningful again. Claude also proposes (TOOL follow-up) to
give Gojo a fixed gate reference, the approved combat cell, as Killua has, so a new idle can never move the yardstick.

## superDash v09: calibrated (explicit size, no auto fit)

The auto head fit measured against idle v07 asked for x2.14 and clamped to x1.33: the strip packed about 1.4x too big
and clipped, which the 17 px offsets were hiding (`superDash-v09-auto-fit-vs-plain-2x.png`). `raw/superDash_v09.json`:
plain **bodyHeight 146**, no auto fit, no offset (Codex's values kept as `codexAnatomy` / `codexFrameOffsets`). The hair
then reads about 37-39 px and the figure matches the shipped superDash v07 (`superDash-v09-at-146-vs-shipped-3x.png`).
Codex's torso residual (53.5 px) was measured on the inflated pack's leaning pose; at the right size the leaning dash
torso projects like the approved v07's, a pose effect, not a robust drawing defect. If the dash still reads small in game,
it is the crouched flying pose; a bigger-looking dash needs a more extended pose (budget spent), not a size change.

## light3 v05: the seam is the stitch factor

Part A (f0-f3) hair 34-36 x 20, about 215 px; part B (f5-f6; f4's hair is hidden) about 185 px, a 10 px crown drop at
the join. The stitch shrank B by **0.9505**; working back from the hair, unscaled B is about 2.4 % *smaller* than A, so
the measured factor should be about **1.02-1.03** (scale B up). That accounts for the drop. Narrowest fix: re-stitch
`light3_v05` with a manual factor of about 1.024 measured on the hair (new raw version from the same parts, no
generation call), then Claude recalibrates. Light3 A and B each keep their 1 call.

## airLight1 v07 and throw v05

- Assembly: the packer reports "split by whole figures: the column split cut a figure between frames 1/2" (airLight1)
  and "... 0/1" (throw). The column boundary did cross a figure in the source, and the packer's whole-figure split
  re-cut both strips, so every packed frame holds exactly one complete pose. No cell clips, nothing to fix.
- airLight1 v07: hair 34-36 x 22-23, matching the approved cells at its bodyHeight 215. No change. Its compact torso and
  extended-arm reading stays with Astra's segment audit.
- throw v05: hair 31-33 x 19-21 at 207 (about 0.89): the whole figure was packed small. `raw/throw_v05.json`
  **bodyHeight 232** (k 1.12): hair 36-38 x 23-24, matching the shipped idle and throw; no clipping. The compact-torso
  reading was taken at the small size and scales by the same factor.

## Atlas

Not repacked on the branch: while idle v07 is the newest raw it is the gate reference (and fails its own target), and
light3 needs the re-stitch. Diagnostic warn-mode pack in Claude's scratch with these sidecars: superDash and throw sized
as above, no clipping. Claude repacks and reports hashes once idle v07 is held (or redrawn) and light3 is re-stitched.

# Round 2 (2026-10-15): the user-approved idle v08, light3 v06, airRecover v05

**idle v08** (user approved as drawn, lowered hands; Codex `7dd0a5d`). It is Gojo's scale-gate reference, so it should
keep the head where the shipped idle v06 put it. At 236 its hair read 38-39 x 22-23 (about 293 px) against v06's 37 x 23
(278 px), about 3.5 % larger at the same height. `raw/idle_v08.json` **bodyHeight 232** (k 0.983) splits it: head
about +1.7 %, standing height about -1.7 % against v06, so every other Gojo strip's head reading moves by under 2 %
(guard 0.983, run 0.994, heavy 0.942, airLight1 0.955 against it). `reference/idle_approved.png` is now a byte copy of
`raw/idle_v08.png` (it was a byte copy of `raw/idle_v06.png`, which stays in raw/).

**light3 v06** (Codex's re-stitch at 1.024, `a848ce3`): the seam is gone: both parts read 201-213 hair px. The strip as a
whole read 7 % small against idle v08 (probe 0.93), so `raw/light3_v06.json` **bodyHeight 231** (k 1.07): packed head 0.989.

**airRecover v05**: the gate needs a manual check for a tumble. The readable recovery frame f2 has a hair area 4.6 %
above idle v08 (the shipped v03 reads 3.5 %), and the tucked f0/f1 match the shipped v03's scale
(`airRecover-v05-vs-idle08-and-v03-2x.png`). The manifest `scaleManualQA` is now recorded for v05 (it was for v03).

superDash v09 (146) and throw v05 (232) from round 1 read 1.039 and 0.996 against idle v08.

**Atlas:** `node tools/pack-sprites.mjs gojo --quantize 48` passes (1 ref, 33 ok, 8 manual). `public/characters/gojo/sheet.png`
sha256 `0298b272fde74f64412a0e7a40dbdbb86f2ebf683e4d585501d0eefa668daf3f`, `anims.json` sha256
`6d53aac11d62e13df9305b7e566fcad01169f2d2345720d79ff2911676a207f0`. Codex's idle08 f7 shoe-edge concern is for Astra's
audit of this atlas (no clipping or margin warning here).
