# Sasuke ART-SIZE-R8 A3 — fTilt v04 review record

Date: 2026-11-08
Disposition: **user-approved via Claude relay `audit1 #5` (“Approve v04, keep reach”); Astra anatomy/visible-scale PASS at moderate confidence; runtime contact/hurtbox QA pending Claude**

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
- Shoe-area proxy by frame: `[1.057,1.161,1.055,1.085,1.210,1.251,1.302]`; median `1.161`. The latter recovery poses turn the sandals and change their visible area; this proxy is uncertain and is not treated as a foot-size pass. The later user approval and Astra result are documented below; this proxy did not drive a numerical size change.
- The required `npm run lineup` check reported Sasuke heads `52/52` ok or not judged. Its image rows do not include fTilt, so those generated cross-cast files were not retained; the fTilt-specific comparison is the body sheet and review page.

## Hitbox and hand-point remeasurement

Measured from the final quantized active cells 186/187, with the visible lead-fist bounds padded by about 3 px:

| Frame | Atlas cell | Hit `[x,y,w,h]` | Hand point `[x,y]` |
|---|---:|---|---|
| f3 | 186 | `[184,106,17,16]` | `[197,111]` |
| f4 | 187 | `[193,105,18,16]` | `[207,111]` |

`art/characters/sasuke/hitboxes.json` now records `_scale: 1`. The hit regions follow the forward fist; the hand points are on the front knuckles. This has not been validated in runtime combat; Claude retains contact/hurtbox integration QA.

## Review status

The user approved v04 by Claude relay `audit1 #5` (“Approve v04, keep reach”). The manifest records `version: 4`, `approvedVersion: 4`, and `reviewStatus: "approved"`; the version-bound Astra scale/anatomy result is PASS. v03 remains preserved as the prior approved version. Runtime contact/hurtbox QA remains Claude's responsibility. Packed-cell comparisons, source parts, generation prompts, hashes and reference images are linked from the [A3 review page](../../../public/reviews/size-r8-a3/index.html) and [generation inventory](../../characters/sasuke/production/size-r8/GENERATION_INVENTORY.md).

## Post-approval Astra anatomy and scale audit — 2026-11-09

User approval relayed by Claude: `audit1 #5`, **"Approve v04, keep reach."** The pre-approval preparation notes above are historical evidence. The final technical result is recorded separately from user approval; it does not certify runtime contact or authorize integration by this worker.

**Anatomy: PASS. Scale: PASS by visible packed-cell comparison, moderate confidence.** No new drawing correction or reach adjustment is required by this audit. This is not a numerical certification that every obscured skeletal segment is within +/-6%; head and garment-area proxies do not establish that claim.

### Exact inputs and comparison method

- Independently verified sheet SHA-256 `f044cb78d55b99ea46c85ded46c9aacf63d21326c51fbb719df25db7d64c98b4`, metadata SHA-256 `808ae00d35dc8461875c23653516956122ec02ca1442974347c2c19c8ccdd418`, and raw `fTilt_v04.png` SHA-256 `0c7dae4d7b44029e76befa3a2a97204c98ac049cce34bae012db0675812b8c5d3`.
- Inspected actual quantized atlas cells **183-189**, all seven frames. Metadata confirms non-looping `[35,30,40,50,60,50,30]` ms and phases `[3,2,2]`; f3/f4 remain the active punch. This is a sequential-frame continuity check, not an in-game playback test.
- Inspected `reference/idle_approved.png` for the approved stance/design, then compared the candidate cells at native 256px density with the current packed idle cell 0 and the exact approved `sasuke-neutral_v01.png` / `sasuke-combat_v01.png` cells. The raw idle is 4232x582 and is not a same-density measuring canvas. The cached `frames/idle/idle_00.png` differs from the current packed idle; it was not used as the final numeric baseline. The existing A3 body sheet provides the matching packed-idle/combat comparison.

### Frame evidence

Bounds are inclusive opaque-pixel extents `[left,top,right,bottom]` measured directly from the exact atlas. They include hair, garment and pose projection and are **not** anatomical height measurements. Head H comes from this atlas's embedded `scaleAudit`; B below is the current `body-report.json` advisory value.

| Frame / cell | Occupied bounds | H | B | Visible anatomy and continuity |
|---|---|---:|---:|---|
| f0 / 183 | `[73,61,183,240]` | .977 | .906 | Narrower preparation stance; bent arms remain attached and proportionate, with consistent head, shoulder and waist build. |
| f1 / 184 | `[72,64,191,240]` | .999 | .903 | Step/weight shift changes leg projection; sleeves and trouser folds remain compatible with the reference build. No head-size jump. |
| f2 / 185 | `[67,64,189,240]` | .981 | .897 | Lead hand closes and chamber advances. Reduced garment area follows the narrow upper-body projection and cloth overlap; no visible missing torso or shortened limb is established. |
| f3 / 186 | `[67,64,197,240]` | 1.003 | .917 | Active straight punch: shoulder, sleeve, forearm and fist form a continuous chain. Rear bent arm remains legible. Head/torso volume stays consistent. |
| f4 / 187 | `[64,63,207,240]` | .997 | .942 | Further extension/weight shift preserves the approved reach. Lead arm has no visible break or disproportionate swelling; legs and sandals support the pose without clipping. |
| f5 / 188 | `[64,63,190,240]` | 1.002 | .935 | Recovery retracts the fist and folds the elbow. Larger visible sandal surface accompanies foot angle and stance changes; no persuasive physical foot-size jump. |
| f6 / 189 | `[65,63,191,240]` | 1.003 | .955 | Open-hand recovery restores the guard gesture. Head, torso, garment volume and limb thickness remain consistent with f5 and the approved references. |

Current idle cell 0 occupied bounds are `[46,64,204,240]`. All seven candidate soles remain at y240; no cell-edge clipping or isolated disconnected remnant was seen. The narrower stance than idle explains much of the reduced overall width; it must not be enlarged to match idle's posed bounding box.

### Measurement uncertainty and holds

- Embedded head boxes use endpoint differences of 34-37px wide and 37-40px high across f0-f6; H median is .999 and the range is .977-1.003. These are palette/projection probes, not skull measurements. Hair, turned faces and the collar limit exact landmark interpretation.
- Torso, sleeve, thigh, calf and sandal silhouettes were checked in every frame against both title-style cells and current packed idle. No material build drift or disconnected/missing limb is visible. Loose sleeves/apron conceal shoulder, elbow and hip endpoints; bent knees and the far-side leg overlap prevent reliable segment-length ratios. Typical manual contour uncertainty is about +/-2-3 packed pixels, greater at hidden joints. No invented segment-length percentages are asserted.
- The refreshed supporting body report on the exact retained-palette atlas reads B `[.906,.903,.897,.917,.942,.935,.955]`, median .917, v4, no flag. B is advisory with about +/-10% pose noise, not a calibrated limb measure. f2 is just below .90, but its visible anatomy does not substantiate a shrinkage defect.
- The embedded shoe-area proxy reaches 1.302 in f6. It is not a shoe-length ratio; foot orientation, exposed toe surface and matching palette pixels affect it. Visual footwear inspection does not support a mandatory rescale or redraw. A precise hidden-foot/segment certification remains unavailable from these silhouettes.
- **No new anatomy or visible-scale HOLD.** Runtime reach/contact/hurtbox validation remains with Claude; no runtime pass, production merge or deployment is claimed. The user's approved current reach is preserved. The audit made no changes to art, hitboxes, atlas, metadata, manifest or review/tracker status.
