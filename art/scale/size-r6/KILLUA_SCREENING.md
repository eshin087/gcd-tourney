# Killua: six-strip-family size screening

Scope is all 44 packed Killua strips in the hash-bound atlas inventory. The 8 comparison pages show every packed frame for each strip beside idle f0 and the approved title-style combat cell at identical cell scale; hashes and packed/raw provenance are in `all-strip-sheets/inventory.json` and `PACKED_INVENTORY.md`. This is a visual screen, not a certified all-segment pass. It found no defensible redraw case. The prior B-only suspicion on `airLight2` is withdrawn per Claude's calibration; its v08 remains held and must not receive another generation call.

## Coverage and screening

| Page | Strips / total packed frames | Visual screen |
|---|---:|---|
| 01 `idle` through `jumpSquat` | 6 / 24 | Dash/backDash/jumpSquat compress or foreshorten poses; no uniform scale drift visible. |
| 02 `jumpUp` through `light3` | 6 / 27 | Head and clothing volumes appear stable across the sampled loops; low B values in light3 are frame/pose-specific, no confirmed segment mismatch. |
| 03 `light4` through `airHeavy` | 6 / 38 | `airLight1`/`airLight2` show one-leg raised/extended poses that reduce clothing-area proxy; no obvious uniform shrink. `airLight2` f0/f1 received the coordinate probe below; unresolved. |
| 04 `guard` through `spin` | 6 / 16 | Crossed-arm guard/block, folded hurtLow, and rotating spin make B low; no visible whole-body size discontinuity. |
| 05 `airRecover` through `beamCharge` | 6 / 21 | Fallen/recovery/crouched charge poses explain lower area proxy; no visible uniform scale discontinuity. |
| 06 `beamFire` through `intro` | 6 / 22 | Extended arms, vanish, prone KO and standing intro all read as pose changes; no confirmed mismatch. |
| 07 `taunt` through `superPose` | 6 / 27 | Win is flagged large by B, but raised arms/standing pose do not establish oversized torso/limbs; no confirmed segment error. |
| 08 `beamStruggle` and `beamStruggleAir` | 2 / 6 | Both appear consistent with idle/combat; no confirmed mismatch. |

## Coordinate probe: `airLight2` v07

Source comparison: `coords-killua-airLight2-f0.png` and `coords-killua-airLight2-f1.png` (32 px grid, native packed 256-cell coordinates). Idle f0 is the reference. Approximate visible landmarks below use ±4 px per endpoint because collar/belt and joint boundaries are partly occluded by pose/clothing; coordinates are read from the native coordinate grid, not from the resized screenshot.

| Segment / frame | Reference endpoints and length | Candidate endpoints and length | Ratio | Interpretation |
|---|---|---|---:|---|
| Collar center to waistband center, idle f0 vs airLight2 f0 | (127,118)→(129,161), 43.0 px | (130,110)→(131,151), 41.0 px | 0.95 | Torso appears close in the upright raised-knee frame; uncertainty interval is too broad for a pass or failure. |
| Hip to ankle, idle f0 planted leg vs airLight2 f1 extended leg | (116,165)→(82,221), 65.5 px | (147,163)→(195,152), 49.4 px | 0.75 | Different side and strong foreshortening/projection; endpoint uncertainty expands the candidate/reference ratio across the tolerance band. Not evidence of shorter anatomy. |
| Shoe heel-to-toe, idle f0 vs airLight2 f1 | (76,229)→(94,227), 18.1 px | (190,157)→(211,154), 21.2 px | 1.17 | Shoe is visible and not smaller; toe/heel bounds uncertain ±3 px, pose/perspective differs. |

These measurements explain why the B=0.68 area flag cannot be read as a limb-chain ratio. The head, torso, extended leg and shoe do not jointly establish a size error. `airLight2` remains unresolved by numeric segment certification, with no justified corrective image or reassembly.

## Limits and next review

All 44 packed strips have been visually screened. Exact head/torso/arm/leg/shoe measurements were not taken for every posed frame; the evidence is therefore a screen with no demonstrated error, not a certified pass. If later review finds a homologous segment error, record frame IDs and endpoints before changing the art. Preserve v08 and the cumulative call ledger; do not spend call 3 on the current evidence.

