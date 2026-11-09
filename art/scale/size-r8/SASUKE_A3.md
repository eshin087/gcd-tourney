# Sasuke ART-SIZE-R8 A3 — fTilt v04 review record

Date: 2026-11-08
Disposition: **candidate ready for user image review; not approved; Astra audit pending user approval**

## Candidate and provenance

- Previous approved drawing: `art/characters/sasuke/raw/fTilt_v03.png`, SHA-256 `8beadfcd2ff7d0490be491d123d55c5f1f25d0ed4e8019a12c5d7db3a8fcf440`, imported at `packScale: 0.92`.
- Candidate drawing: `art/characters/sasuke/raw/fTilt_v04.png`, SHA-256 `0c7dae4d7b44029e76befa3a2a97204c98ac049cce34bae012db0675812b8c5d3`. It was generated as two parts and stitched at a measured Part B factor of `0.9972`; the v04 sidecar retains the stitch measurements and `anatomy.measurement: "auto-head"`.
- Final 48-color atlas: `public/characters/sasuke/sheet.png`, SHA-256 `f044cb78d55b99ea46c85ded46c9aacf63d21326c51fbb719df25db7d64c98b4`.
- Metadata: `public/characters/sasuke/anims.json`, SHA-256 `808ae00d35dc8461875c23653516956122ec02ca1442974347c2c19c8ccdd418`.
- Prior atlas at base commit `085031024`: sheet SHA-256 `f2cdb72288827e04f285e6fb4257aefa3e36ad5e6a16d4a9aec5563a8550d236`; metadata SHA-256 `84791b2840ec878545694fcdc8909aff3e2ddfa4fdce7cbda7967982785d9da7`.
- The pixel comparison found exactly seven changed atlas cells: 183-189, which are fTilt v04. fTilt remains seven non-looping frames, phases `[3,2,2]`, durations `[35,30,40,50,60,50,30]` ms. Active frames remain f3/f4; no moveset or strike timing changed.
- `node tools/pack-sprites.mjs sasuke --quantize 48 --keep-palette` exited 0: 53 animations / 245 frames, 48 colors. fTilt v04 is selected at `packScale: 1`; its auto-head probe is `ok` at 1.00 with no fit and no fTilt scale-gate failure. This is a technical pack result only.

## Scale and visible-build evidence

- Head H by frame: `[0.977,0.999,0.981,1.003,0.997,1.002,1.003]`; median `0.999`. All seven are within the automatic ±6% band, with no detected within-strip head pop.
- Body garment-area B by frame: `[0.906,0.903,0.897,0.917,0.942,0.935,0.955]`; median `0.917`, no body-sheet flag. B is an advisory area proxy with about ±10% pose noise; f2 is only 0.003 below 0.90 and is not a calibrated segment-length measurement. Compare the torso, shoulder, arm, leg, hand, sandal and clothing volumes visually in [the body sheet](../../../public/reviews/size-r8-a3/body-sheet.png) beside approved idle f0 and the title-style combat cell.
- Shoe-area proxy by frame: `[1.057,1.161,1.055,1.085,1.210,1.251,1.302]`; median `1.161`. The latter recovery poses turn the sandals and change their visible area; this proxy is uncertain and is not treated as a foot-size pass. The seven packed cells remain for explicit visual review and the post-approval Astra anatomy comparison.
- The required `npm run lineup` check reported Sasuke heads `52/52` ok or not judged. Its image rows do not include fTilt, so those generated cross-cast files were not retained; the fTilt-specific comparison is the body sheet and review page.

## Hitbox and hand-point remeasurement

Measured from the final quantized active cells 186/187, with the visible lead-fist bounds padded by about 3 px:

| Frame | Atlas cell | Hit `[x,y,w,h]` | Hand point `[x,y]` |
|---|---:|---|---|
| f3 | 186 | `[184,106,17,16]` | `[197,111]` |
| f4 | 187 | `[193,105,18,16]` | `[207,111]` |

`art/characters/sasuke/hitboxes.json` now records `_scale: 1`. The hit regions follow the forward fist; the hand points are on the front knuckles. This has not been validated in runtime combat; Claude retains contact/hurtbox integration QA.

## Review status

The prior v03 remains the user-approved version. v04 is filed as a new candidate with `version: 4`, `approvedVersion: 3`, and `reviewStatus: "needs review"`. The candidate's visual anatomy/scale assessment by Astra is deliberately pending the user's drawing decision. Packed-cell comparisons, source parts, generation prompts, hashes and reference images are linked from the [A3 review page](../../../public/reviews/size-r8-a3/index.html) and [generation inventory](../../characters/sasuke/production/size-r8/GENERATION_INVENTORY.md).
