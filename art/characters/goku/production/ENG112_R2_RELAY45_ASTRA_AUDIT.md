# ENG-112 Goku relay #45 — uTilt v04 final5 Astra audit

Date: 2026-10-18. Auditor: GPT-6 Astra, medium. Scope: every frame of uTilt v04 at strip `packScale: 1.09` in the exact 48-color whole-character atlas, compared with approved idle02 and live light2 at one pixel density. Static sequence inspection, not timed runtime validation.

- Source SHA-256: `9b9cda4a1aa1891f1ae7fc74d38a259f2c00fdfbc2e457592669587c50ad32f1`
- Packed sheet SHA-256: `3e0db06b7d14daab5c1d6eeecde20f5ba992b99caf01d5f9517f08baa67aef98`
- Packed metadata SHA-256: `9969677fd945ae986780cfb9493fd4dc5894ca3b6ab5756f4776ae8ed802fa58`
- Whole-fighter base scale: 0.92; strip scale: 1.09; effective import multiplier: 1.0028.
- Phases: `[3,2,2]` (active frames f3/f4).

## Verdict

**PASS — anatomy, scale and cell fit.** All seven quantized frames were inspected. Head, torso, exposed arms, legs, boots and clothing volume agree with idle02/light2 within visible-landmark uncertainty. No material color-boundary defect, detached limb, clipping or unexplained frame-to-frame scale jump was found. The recovery returns coherently to the initial guard. Boots remain toward the smaller end of the reference range, but combined anatomy supports a pass within uncertainty. Hidden knee positions are not certified measurements.

Approximate visible measurements in final-cell pixels use collar-center to belt-center, belt width and visible boot cuff to toe. Idle02 baseline is approximately `38±5 / 36±4 / 44±4 px`.

| Frame | Collar to belt | Belt width | Boot | Finding |
|---|---:|---:|---:|---|
| 0 | 39±5 | 35±4 | 40±4 | Guard matches reference within uncertainty. |
| 1 | 36±6 | 33±4 | 36±5 | Crouch and projection explain shortening; build coherent. |
| 2 | 40±7 | 34±5 | 39±5 | Rotated torso and bent striking arm remain connected. |
| 3 | 44±7 | 35±5 | 39±5 | Rising overhead strike; anatomy and fit pass. |
| 4 | 38±7 | 34±5 | 39±5 | Full extension; fist and shoulder chain intact. |
| 5 | 40±6 | 35±4 | 37±5 | Recovery body/clothing volume remains consistent. |
| 6 | 39±5 | 35±4 | 40±4 | Returns to guard without material size discontinuity. |

Boundary uncertainty is approximately ±2–3px for the active contacts; visible landmark uncertainty is ±4–7px depending on rotation and occlusion. No concealed joint is inferred.

| Frame | Packed cell | Occupied bounds (inclusive) |
|---|---:|---|
| 0 | 118 | x64–193, y35–240 |
| 1 | 119 | x59–197, y49–240 |
| 2 | 120 | x60–196, y35–240 |
| 3 | 121 | x64–193, y27–240 |
| 4 | 122 | x68–191, y5–240 |
| 5 | 123 | x58–197, y34–240 |
| 6 | 124 | x64–193, y35–240 |

Frame 4 retains five clear pixels above the fist. The 4px cell safety margin is preserved.

## Active strike contacts

The initial f3 body-fallback `[155,24,42,219]` extended over most of the body and was not an acceptable fist contact. Version-bound `hitboxes.json` overrides were packed and checked on the exact metadata:

- f3 / atlas cell 121: `[146,25,26,25]`, encloses the striking fist/wrist.
- f4 / atlas cell 122: `[157,2,29,33]`, encloses the raised fist/wrist.

Phases remain `[3,2,2]`. Contact boundaries are approximate ±2–3px. This is an art-scale/contact-box audit only; it does not establish runtime combat validation. The user separately approved the drawing and 1.09 strip scale via Claude relay #45.
