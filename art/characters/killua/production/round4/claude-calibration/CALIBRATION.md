# Killua round 4: Claude calibration (2026-10-14)

Requested in `../CLAUDE_RECALIBRATION_20261014.md` (Codex, `a7389a7`). No generation, no budget change, no art approval,
no merge, no deploy. Gate reference: the approved title-style combat cell (`art/scale/builds.json` scaleReference).

## Why idle and guard landed short: the old crouched bodyHeight, not the drawing

The packer scales a strip so its tallest frame equals its bodyHeight. The taller-stance redraws were still packed at the
old crouched values (idle 146, guard 133), so they came out 144-146 / 132 px and small everywhere: head probe 0.966 /
0.904, Codex's visible heads 36-38 / 34 against about 40-41, leg chain 56-58 against 61, shoe 23 against 25. Every rigid
segment was short by the same factor, so one uniform factor fixes all of them and the occupied height together.

| strip | bodyHeight | factor | packed height (target) | head probe | notes |
|---|---|---|---|---|---|
| idle v11 | 146 -> **158** | 1.08 | 156-158 (156-162) | 1.038 (frames 1.015-1.05) | foot span 120 px (target 110-125); head, legs about 61 and shoe about 25 now match the references |
| guard v09 | 133 -> **152** | 1.14 | 151 (150-158) | 1.036 | replaces the auto head fit (it never engaged: head and feet were not off together) |
| superDash v08 | 101 -> **121** | 1.20 | 119-120 | 1.005 | replaces the auto head fit; bounds x 54-233, no clipping; leg chain about 53-54, inside Codex's projected 52-53 +-8 |
| stagger v07 | unchanged | - | - | 1.041 (f0 1.097) | the f2 -> f3 arm/pose reset is a motion HOLD for the user; scale cannot fix it. Shoes still read 29-30 vs 23-25 at this size |
| win v05 | unchanged (auto head fit x0.8865) | - | - | 1.005 | the stale v04 `scaleManualQA` / exemption warnings are bookkeeping, not a size error |

Sidecars hold the calibration (Codex's `anatomy` kept as `codexAnatomy` where it was replaced). superDash and win have no
art-box contact (superDash connects by the dash's move data; win is not a combat state), so there is no strike landmark
to check.

## Atlas

`node tools/pack-sprites.mjs killua --quantize 48` passes. `--strict-scale` fails only on **charge v13** (head 0.92), the
recorded round-3 stand-in live in production, untouched here. `public/characters/killua/sheet.png` sha256
`32526013d6d786c800c2c477b26519796340afc21a089c7a7051ce5ae91dce95`, `anims.json` sha256
`423120ff1c66e0ed2fbab8803dcfefe8e374f814bda61d7bde74414912168ca5`. Evidence: `idle-guard-vs-references-2x.png` (neutral,
combat, idle f0/f4, guard f0, superDash f0 on one floor line), `body-killua-*.png` + `body-report.json`.

# Round 5 (2026-10-15): win v05 held, approved v04 ships

Astra's calibrated audit (`../post-calibration-20261015/AUDIT.md`) put win v05's upright torso at T 37 +/- 3 px against
the neutral cell's 50 +/- 3. Claude's band profile of the packed frames agrees: v05 runs collar ~116 to shirt hem ~153
(about 37 px) where the neutral runs 94 to 148 (54), while its head (crown to collar 39 px) equals the neutral's. With
the head right, no bodyHeight can lengthen the trunk; the drawing is short. Cause: the round-4 brief compared v04's
trunk (46-47 px) with the crouched idle (38 +/- 2) instead of the upright neutral, so v05 was redrawn short on purpose.
The raised-arm shirt lift cannot explain it: lifting the arms raises the collar and the hem, it does not shorten the
gap by a quarter.

v04 is the approved version and carries a manual scale QA for v4 (standing 185-186 px vs 186, collar to shorts hem
73-75 vs 76). `raw/win_v05.png` and its sidecar are now in `raw/_qa_hold/` (moved byte for byte; reversible with
`git mv` if the user approves v05), so the packer ships v04 at manifest bodyHeight 186. Packed v04 frames: crown y 55-56
(neutral 55), shirt hem 140-141 (neutral 142-145), shorts top 146-148 (neutral 148).

Normal gate: 32 ok, 9 manual, 1 drift (charge 0.92, the recorded pre-existing exception). Atlas: sheet sha256
`16b78e56bbcda15d5d9490fb3459f08fc8edf27fe948326275ab198411c4fb02`, anims.json sha256
`ca1e81d9f8a8f9f8485e50adc5c2cd3d4cc056f117b4bf606afa4eb0e3074861`.
