# Sasuke charge v14 — final Astra packed-atlas audit

Date: 2026-10-18. Auditor: GPT-6 Astra, medium. Task: ART-CHARGE.

**Result: HOLD for loop expression/motion correction.** No user approval is implied. Anatomy is broadly consistent by visual inspection; the feet probe is not evidence of 41% wider footwear. No scaleManualQA or exemption was created or recommended as a substitute for the loop fixes.

## Exact candidate and evidence

Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-charge-sasuke`; branch `art/charge-sasuke`.

- Raw charge_v14.png SHA256 `CEE1E0D93999FFBC6D97358D3710A8F3B47F65CA49D64D968AF7D0468482156C`.
- Actual quantized sheet.png SHA256 `0FE0DC73A51F3E583179D150D1BD889D4FA7B0BB6A5C4E5D99A55551E8BBC094`.
- anims.json SHA256 `BE281EFC418758387AAB8C454B905F75C8CEC92C3397AE1C2A944CF80838AA41`.
- Read actual cells 115–120; idle f0 is cell 0. Metadata: 70/90/110/110/110/110 ms, loopFrom 2.
- `atlas-comparison-2x.png`: approved title neutral/combat, current idle f0, all six packed cells at identical pixel density, nearest-neighbor display only.
- `packed-f0.png` through `packed-f5.png`: unmodified atlas crops.
- `faces-4x.png`, `footwear-2x.png`, `registration-differences.png`, `region-evidence.json`, `source-hashes.json`.
- `atlas-timing-preview.gif`: metadata-timed gather/release and four hold cycles. This artifact was generated for review; this audit inspected the exact ordered frame sequence and transition pairs, not real-time browser playback. No lab, in-game, or runtime validation is claimed.

## Anatomy and identity

Head/hair: all six frames retain Sasuke silhouette, face placement, and adult proportions. Gather tucks the head rather than shrinking the whole figure. The supplied head probe is median 1.05, range 1.034–1.077; this is not an all-frame 0.93–1.07 numeric pass (the maximum slightly exceeds it). I did not rerun the probe. Visual comparison does not support a gross head-size correction; fringe and pose alter its occupied bounds. Exact skull dimensions are partly occluded, so do not certify a hidden skull-length percentage.

Torso/build: the open light shirt, forearm guards, purple rope, blue waist cloth, dark trousers and open sandals read consistently across f0–f5. Shoulder-to-rope proportions and narrow torso remain plausible against both approved cells and idle. Gather is compressed by bending, not globally scaled. Supplied garment B median 0.989, range 0.970–1.010 is consistent with the visual impression but is garment area, not a segment-length measurement.

Arms: right hand makes the vertical seal near the chin in f1–f5; left fist hangs down and back. No severed/extra limbs or obvious arm inflation. The tiny fingers are partly merged by pixel scale: two raised fingers read as a narrow seal silhouette, not separately measurable anatomy.

Legs: upper legs are bent outward and overlap the waist garment; lower legs are substantially vertical. Their projected lengths differ from the wider approved combat stance as expected. No obvious calf/thigh inflation or shortened limb is visible. Hip and knee centers cannot be measured to +/-1 px from draped trousers; estimated landmark uncertainty is about +/-2–4 native px, with more uncertainty at covered hips. This is a visual anatomy judgment, not a fabricated numeric segment pass.

Sword: a dark sheathed sword/hilt protrudes behind the waist on screen-left in every frame. No drawn blade. Identity/outfit are otherwise coherent.

Face: f0 is tucked and closed; f1 opens; f2 closes; f3 opens clearly; f4 and f5 close again. The requested Sharingan glare is not distinctly readable as red in the quantized face detail. At this scale/palette this is uncertain rather than proof of the wrong eye design; inspect the original approved expression beside a corrected packed crop before claiming it passes.

## Footwear: geometry versus probe

The supplied matching-color foot metric is median 1.409, range 1.369–1.451. The production contract states this is the square root of a color-area ratio, not shoe width. Direct alpha geometry of rows y230–240 gives the following native occupied x-span widths (left/right on screen):

| reference/frame | left | right |
|---|---:|---:|
| title neutral | 19 | 30 |
| title combat | 21 | 33 |
| idle f0 | 21 | 34 |
| charge f0 | 23 | 28 |
| charge f1 | 23 | 27 |
| charge f2 | 23 | 27 |
| charge f3 | 23 | 28 |
| charge f4 | 23 | 27 |
| charge f5 | 23 | 26 |

These are occupied lower-foot row spans, not inferred anatomical foot lengths; projected toe angle and ankle occlusion differ. The left is about 10% wider than idle by this measure while the right is narrower. The sandals therefore are not uniformly 41% too large. No blanket footwear rescale is justified. A fully explained color-probe exception would require tracing exactly which palette-matched regions inflate the metric, which was not done here; do not call that diagnosis proven.

## Every frame and actual loop order

| frame | finding |
|---|---|
| f0 | Gather reads: torso lower, chin tucked, hand draws toward chest. Complete anatomy, planted feet; no clipping. |
| f1 | Release raises torso/head and presents the seal; mouth open; complete silhouette. |
| f2 | Stable held base; mouth closed, cloth relatively low. |
| f3 | Most strained/open mouth, cloth swept outward/up, small shoulder/head motion. |
| f4 | Returns to closed mouth and nearly f2 upper-body state. This does not sustain the brief's f3 strain into f4. |
| f5 | Closed mouth, settled body; waist fabric changes. f5→f2 has small outline changes but widespread shading replacement. |

Registration is substantially improved over unrelated poses. Both soles reach y240 in every hold cell. Left foot y220–240 bounds are identical (x69–91); right bounds change only x162–163 at the rear and x187–189 at the toe. This falls within the brief's revised 1–2 px outline allowance. Do not hold for this small boundary change alone.

However, the supposedly locked feet redraw internally: left-foot ROI has 176–191 changed RGBA pixels against f2 out of roughly 347–350 occupied; right has 190–283 changed pixels out of 370–382 occupied. These counts include shading/color replacement, not just motion, and do not measure perceived flicker by themselves. The difference image also shows broad pants/leg repainting. This is avoidable temporal texture noise on the part intended to stay locked; inspect its visibility in the lab before claiming the original spasm problem solved.

The head and fist stay visually close (approximately 1–2 px landmarks; hair edges and occlusion make this estimate uncertain). No large translation is evident. Waist cloth/rope has several silhouettes, but hair mainly retains the same profile with small pixel changes. The clearest motion is a single open-mouth/outward-cloth pulse at f3; a distinct four-stage upward cloth/hair cycle and sustained f3–f4 strain are not convincingly established. Do not label the stationary shading repaint itself as an updraft cycle.

## Concrete repair priorities for Luna

1. Keep the successful body scale, pose and planted stance. Composite the exact same lower-body/feet pixels through f2–f5, preserving intended moving waist fabric separately. This targets texture shimmer without arbitrary resizing.
2. Sustain the strained/shouting expression into f4, then settle in f5; retain a readable Sharingan eye if the final quantized palette supports it. Make f2→f3→f4→f5→f2 breathing and hair/cloth progression intentional, with small movements only.
3. Repack the corrected version; inspect every actual cell again. Recheck the largest head probe frame and trace the foot color metric before proposing any manual exception. Do not shrink the whole crouch to satisfy it.
4. Parent must inspect timed lab playback and obtain the user's image approval separately. This audit leaves those steps pending.

This audit changed only its evidence/report directory. It did not edit raw art, public outputs, manifest, REVIEW, TRACKER, engine code, or Git history.
