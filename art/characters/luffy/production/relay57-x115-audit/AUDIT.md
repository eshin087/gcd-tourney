# Luffy uSmash v05 x1.15 — final packed anatomy/scale audit

2026-10-19. Auditor: GPT-6 Astra, medium. **PASS within visible-landmark/projection uncertainty** for all eight uSmash v05 frames in the exact atlas below. This is a technical anatomy finding, not user image approval, automatic scale-gate certification, runtime contact validation, or merge authorization.

## Exact scope

- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-normals-luffy-r2`; branch `art/normals-luffy-r2`; HEAD `f7bb1487599f63d98ad9b0e73a98494a7ce1ebfa`.
- Actual `public/characters/luffy/sheet.png`: SHA256 `4c776508cd6c9ca5a6a84cfc4ed22ccc8837e9eb53984e4622c8773a30a85640`.
- Actual `public/characters/luffy/anims.json`: SHA256 `722a153352e4458481abd4ebab4c39def034658cafa31d969cbfcbb963324666`.
- Both requested hashes independently matched. Initial worktree status was clean. This audit covers the requested x1.15 import, not the prior pre-scale atlas.
- uSmash cells 154–161; durations 50,40,30,50,70,70,60,30 ms; non-looping, total 400 ms. Idle cell 0 is primary comparison, cell 7 additionally inspected.
- 256px cells, 16 columns; actual atlas independently counted at 48 opaque RGB colors. No re-pack or source/public modification performed.
- Exact approved/accepted title crops: `../native-audit-20261015/neutral.png` SHA256 `8e9da76421c52e5fa449ce55b2dba1933b52e74d15ccd4a69090b9f97eb082b1`; `combat.png` SHA256 `439678e0a9689edc3cc9686d51a65f9d546e2e68aae20760de8e7f4391a306e0`.

## Evidence and method

`contact-native.png` places all cells at their original 256px density without individual fitting. Read left to right: row 1 neutral, combat, idle f0, idle f7; row 2 uSmash f0–3; row 3 uSmash f4–7. `contact-2x.png` is the identical arrangement at nearest-neighbor 2x. Separate extracted cell PNGs, recovery/idle 3x details, hashes and occupied bounds are retained; `evidence.json` includes PNG and raw-RGBA SHA256 for each exact extracted cell. Transparent pixels are composited onto gray only in the contacts.

Applied the whole-figure standard documented by manual-audit-r3/AUDIT.md and manual-audit-r2/AUDIT.md: independently inspect actual quantized pixels, visible segment proportions, joints/clothing, all frames and sequence endpoints. No head-only or pose-bounding-height certification. The requested FINAL5 label is not a standalone Luffy file in that directory; the complete actual-public-pixel methodology in its AUDIT.md was used.

## Findings by frame

| Frame / cell | Whole-figure finding |
|---|---|
| f0 /154 | Crouched windup retains adult slim torso, hat/head, both connected arms and legs. Reduced occupied height follows knee/hip bend. Cuffs and sandals remain complete. |
| f1 /155 | Rising windup preserves vest/shorts volume and connected shoulder/elbow/hand chains; no local head or limb jump from f0. |
| f2 /156 | Upright preparation retains torso and leg thickness, two fists and visible neck. Sash/cuff boundaries stay separated. |
| f3 /157 | Rotating uppercut has clear connected shoulder–upper arm–elbow–forearm–fist; arm overlaps torso intentionally. No severed recovery fragment or cell seam. |
| f4 /158 | Overhead extension preserves head and torso size. Raised arm is elongated in projection by extension, not a swollen limb. Both legs/feet and fist intact. Highest occupied y=10, leaving 10px top margin. |
| f5 /159 | Follow-through arm overlaps face/hat; facial/neck visibility decreases through occlusion, not a lost head. Red vest, skin and hair boundaries remain readable; limbs connect. Concealed shoulder/face segments are not numeric passes. |
| f6 /160 | Guard recovery restores the slim torso, bent arms, shorts/cuffs and sandals without a new body-size jump. Stance is narrower than idle. |
| f7 /161 | Stable recovery follows f6. Head/face and torso match idle in size; legs spread on entry to idle, with no resolved anatomical shrinking/growing. |

Across all eight: face/hair/hat relationship, narrow waist, long exposed shins, open vest, blue shorts, white cuffs, yellow sash and sandal volume remain coherent with the title neutral/combat cells. No missing/disconnected limb, malformed extra joint, unexplained clothing inflation, or new clipping is visible. All occupied x coordinates lie 60–198 and y 10–240; no boundary at x=0/255 or y=0/255 is touched. Soles remain at y=240. These bounds establish placement only, not anatomy.

## Measurements and uncertainty

`measurements.json` records independently estimated native screen-left knee-to-ankle endpoints for all eight frames, with +/-8px length uncertainty because cuff coverage and knee localization are imprecise. Projected uSmash shins are 45.7–49.2px versus current idle f0 52.4+/-8px. The shorter projections accompany a narrower/bent stance; their uncertainty overlaps idle. Prior reference readings (r2, reviewed again against the exact crops) are neutral 59.1+/-6 and combat 54.6+/-6. This does not claim reconstructed bone lengths or a precise percentage pass.

Additional recovery/idle landmark check: f7 neck base about (128,98) to waist top (120,137), projected torso 39.8+/-8px; idle about (122,98) to (112,137), 40.3+/-8px. These agree with title torso ~43.1/40.5px within endpoint uncertainty. Approximate visible face/head excluding hat/hair is ~22–25px through the readable orientations, +/-4px; no resolved head-size drift. Hat angle and brim projection change during the uppercut and are not skull measurements. Forearms, thighs beneath shorts, and the occluded f5 shoulder are visually checked for plausible connected build; their hidden lengths are not claimed measured. Shorts and cuffs retain comparable volume after allowing for the narrower thigh spread.

f7→idle f0: sole baseline stays y=240; head top y55→54. Occupied width expands 131→169px from stance and arm spread. This is a visible pose transition, not evidence of uniform scale mismatch. Static sequence inspection supports the anatomy pass; whether the 30ms final recovery-to-idle stance change feels smooth requires timed playback. uSmash is not a loop, so f7→f0 is not treated as a required breathing seam.

## Handoff

No anatomy redraw or additional scale correction is justified by this inspection. Continue Claude's contact/grounding and timed-playback checks for relay combat #59. A later repack must compare exact cell pixels and re-audit changed geometry/palette. User design approval remains separate. Parent owns bookkeeping, commit and relay; this auditor changed only this evidence directory.
