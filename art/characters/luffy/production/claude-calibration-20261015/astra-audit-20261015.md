# Luffy core calibration Astra review (2026-10-15)

Scope: inbox item 5 requested manual scale/anatomy checks for 13 strips, plus review of light4 v02 and win v02. No files, manifest entries, pack, PR or approval were changed by the auditor.

Evidence: `onescale_1_stance-jump-run.png`, `onescale_2_attacks.png`, `onescale_3_special-beam-fall.png`, `heights.txt`, current raw candidates, approved `idle_approved.png`, and the approved neutral/combat cells embedded in `reference/title_style_lineup_v01.svg`. Contact sheets show 256px cells at 0.5x. H/B below is hat-top to lowest opaque pixel / sampled straw brim width in native pixels. Claude's uncertainty is about ±3px, higher with hat tilt/overlap; visible joint endpoints in these half-resolution sheets carry roughly ±3–5px or more. Hat and height agreement alone do not prove body segment equality.

Approved idle H/B: 202/41, 200/39, 202/39, 199/39, 201/41, 200/40, 201/40, 202/41.

| Strip/version | H/B by frame | Findings | Result |
|---|---|---|---|
| guard v01 | 197/44, 192/43 | Both figures complete; torso/waist, shorts, visible shins and sandals look consistent. Crossed arms conceal chest, shoulders and elbows; skull crown is under hat. | HOLD, unmeasured: no numerical anatomy pass. |
| charge v01 | 196/48, 197/47, 197/48, 196/46 | Complete and stable vest/sash, shorts and leg build; arms pump consistently. f3-to-f0 changes skin color, visible in loop. Hat tilt/color makes brim comparison weak. | HOLD, unmeasured: hidden hip/skull landmarks and arm overlap. |
| land v01 | 129/36, 173/38 | Complete crouch then recovery; f0 floor hand and compressed pose shorten projected height. Raw source limbs intact. | HOLD, unmeasured: cannot separate foreshortening from scale using height alone. |
| jumpUp v01 | 179/50, 197/50 | Complete takeoff; sampled brim 50px both frames vs idle 39–41; f1 crossed/tucked legs conceal boundaries. | HOLD, unmeasured: hat/leg landmarks insufficient. |
| jumpFall v03 | 191/42, 208/40 | Complete limbs/sandals; previously measured 17px crown rise f0-to-f1 and reversal on loop. | HOLD: continuity concern and tucked legs/covered hips. |
| dash v02 | 159/42, 155/42 | Complete; previous native audit bounds f0 x40–242,y81–240; f1 x23–221,y85–240. Rear sandal clipping fixed; lean and overlap foreshorten trailing limbs. | Clipping PASS only; anatomy HOLD, unmeasured. |
| run v01 | 199/44, 202/44, 199/46, 183/44, 194/45, 191/43, 193/45, 179/43 | Raw source feet intact, but current calibrated cells truncate rear leg/foot in f3,f4,f7 at left edge; f7-to-f0 cannot be cleared. | HOLD: assembly mismatch. |
| light2 v01 | 198/41, 196/40, 195/40, 194/41, 201/40, 202/41, 202/40 | Complete; torso rotation and recovery consistent. Shoulder/elbow landmarks obscured by punches. | HOLD, unmeasured: no arm-segment measurement. |
| light3 v02 | The listed H/B values 208/39,214/40,204/40,206/32,205/39,210/38,209/39 belong to an older sheet sequence, not current v02. | Sheet f4 has extended/clipped leg; current raw v02 f4 is tucked recovery knee. Current raw v02 has complete kick/recovery feet. | HOLD: version-bound evidence mismatch. |
| airLight1 v01 | 197/42, 176/44, 184/47, 184/45, 197/46 | Raw f2–3 fists complete; calibrated cells truncate punching arm at right edge. Bent knees/sandals otherwise connected. | HOLD: assembly mismatch. |
| airHeavy v01 | 197/36,114/42,130/51,144/85,123/70,148/44 | Strong tuck/rotation and foreshortening; shoulder, hip, thigh and far shin obscured. Hat widths 85/70 include unsuitable geometry/colors. | HOLD, unmeasured: substantial occlusion. |
| hurtHigh v01 | 190/39,194/29,186/33 | Complete and coherent; backward arch and head turn alter projection and brim width. | HOLD, unmeasured: skull/torso/shoulder projections change. |
| beamCharge v01 | 184/39,184/37,184/36 | Complete; non-transforming body appears stable, near arm intentionally enlarges, abrupt normal-arm reset f2-to-f0. | HOLD: loop continuity and anatomy remain unmeasured. |

## New calibration derivatives

- **light4 v02**: all eight figures inspected; factor 0.84 is within landmark interval 0.817–0.875, but stitcher's head ratio 1.303 conflicts with body-height calibration. Turns obscure shoulder/torso landmarks; no calibrated packed evidence. SHA-256 `2547d41f81656b9755ce9eafba50bed1ad416b1c4a9ec4f1f43bf9b5611e826b`. **HOLD; no scaleManualQA.**
- **win v02**: four figures intact. Exact embedded native neutral target 237.2597px, measured rescale 1.3145 ±0.023 from old v01 median 180.5px. Resampling alone does not establish packed stature. SHA-256 `9b49d44e5a48bf3b60aad3a84ecae217f65dc32b869f1ed09be1cc6fa8c6c444`. **HOLD; no scaleManualQA.**
- **heavy v01**: brim ratio 0.971 and conservative uncertainty 0.811–1.161 include existing factor 0.900; no re-stitch warranted, but this is not an anatomy pass.
- **special v02 blocked**: existing B sources are byte-identical; seam removes pixels through f6. No intact source pixels exist to reconstruct the frame, and this round authorized no new image.

No item 5 candidate earned `scaleManualQA: pass`. These holds are not user image approvals and do not certify production atlas anatomy/contact.
