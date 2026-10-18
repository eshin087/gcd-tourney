# ENG-112 Goku import and scale recheck — relay #39 disposition

2026-10-18. Final reviewer: GPT-6 Astra, medium. This update supersedes the earlier blanket HOLD under a stricter numerical interpretation. Per Claude's delivered relay combat #39, the accepted bar is a frame-by-frame visual comparison at one density against idle02 and the live move of the same kind. PASS means no visible body-proportion, clothing-volume, color-boundary or clipped-limb defect remains within the stated measurement uncertainty. Hidden skull, hip and knee landmarks are recorded as uncertainty, not used as automatic holds. No per-segment ±6% certification is claimed.

This is a technical audit only. It does not approve any drawing, certify gameplay contact/timing, or establish that the strict production gate passed. The seven PASS results support version-bound `scaleManualQA` records for the exact candidate pixels/configuration below. uTilt, uSmash and dSmash remain technical holds. Relay #54's user decision on their next disposition is separate and pending.

## Exact inspected atlas

- Quantized diagnostic atlas: `production/eng112-dsmash-v02-diagnostic/characters/goku/sheet.png`
- Sheet SHA-256: `d4e3dea2b0ec19871e3b7d90f4b51942f0f69247352e70f9b94d5a51bb6665e9`
- `anims.json` SHA-256: `9059fbc09ef84b06e31f0ea99c636a90466284cc56ae5841df26c5868a0d91c9`
- Report: `production/eng112-dsmash-v02-report.json`
- Compared every frame with idle f0 and same-kind live references (`light2`/`light4`/`heavy`/`airLight1`) at one 256px cell density.
- The fighter-level fit is `.92`; values below are the strip packScale and actual source-to-atlas `frameScales` from the report, not another multiplier.
- Landmark uncertainty: clear ground contours ±3–4px; rotated aerial contours ±5–6px. No hidden joint or skull center is asserted as measured.

## Results

| Move/version | Cells | Strip scale / import factor | Result and evidence |
|---|---:|---:|---|
| fTilt v01 | 111–117 | 1 / .64776 | **PASS.** Adult build, torso, boots and gi match idle/light2 within uncertainty. No visible defect. Cell 113's bent-arm phase is a separate contact-timing check. |
| uTilt v01 | 118–124 | 1 / .41699 | **HOLD.** Clear guard cells 118/124 show reduced boots, torso, arms and clothing; boots about 26–31px vs idle 36–41px (±3px). Cell 122 has 25px top margin, so enlargement also needs placement review. |
| dTilt v01 | 125–130 | 1 / .55051 | **PASS.** Guard endpoints, crouch, low strike and recovery are coherent. Hidden knee/hip positions are uncertainty only; no visible clipping, color-boundary or clothing-volume defect. |
| dashAttack v01 | 131–137 | 1 / .54364 | **PASS.** Repaired import restores complete figures, including the extended boot; body/clothing stay plausible through travel and recoil. Tightest right margin 9px. Runtime travel/contact remains separate. |
| fSmash v01 | 138–146 | 1 / .56331 | **PASS.** Cleanup restores row-major order and preserves full fists/boots. Slightly fuller torso/trousers do not establish a visible defect beyond pose and measurement uncertainty; minimum right margin 8px. |
| uSmash v01 | 147–154 | 1 / .41300 | **HOLD.** Recovery/preparation remain visibly reduced: boots about 25–30px and torso about 29–35px vs idle 36–41px and 37–43px (±3px); arms/gi corroborate. Strike cell 151 begins at y25. |
| dSmash v02 | 155–162 | 1 / .85827 | **HOLD.** Bilateral strikes 158/159 are complete after cleanup, but head/upper-body/arm and gi volume is visibly enlarged in 155/161/162. Belt about 47–56px vs idle 36–42px; torso 44–53px vs 37–43px (±4–5px). |
| fair v01 | 163–168 | .92 / .40698 | **PASS.** Complete limbs, credible body proportions and gi volume; no defect beyond rotation/occlusion uncertainty. Active boots have 11px margin. This is the calibrated .92 strip fit. |
| bair v01 | 169–174 | 1 / .41387 | **PASS, lower confidence.** Rearward kicks 171/172 are complete with 5px left margin. Projected torso-width difference does not establish a visible defect within approximately ±5–6px uncertainty. |
| uair v01 | 175–180 | 1 / .36120 | **PASS, lower confidence.** Vertical kicks and recovery are complete, with no clipped limb or color-boundary issue. Projected torso difference is within rotated-pose uncertainty. |

The atlas report records the source-divider cleanup and offset repairs. dSmash v02's source remains unchanged (SHA-256 `A553402373AE19C6BEC4FD31F99A89501D84607B80655E6AB035856D23FB9B82`). Import factors are evidence about this exact diagnostic build, not instructions for additional scaling.

## Remaining work and boundaries

- Seven passes are recorded version-bound in `art/manifest.json`. User image approval is still pending for all ten.
- uTilt v01, uSmash v01 and dSmash v02 remain on technical hold pending the user's separate relay #54 decision. Their previous candidate versions and attempts remain preserved.
- A strict scale-gate result, contact/hurtbox review, timing and runtime/gameplay checks are not claimed by this audit.
