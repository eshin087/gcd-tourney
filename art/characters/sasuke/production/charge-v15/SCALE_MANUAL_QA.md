# charge v15 focused landmark scaleManualQA — not cleared

Date: 2026-10-18 local. GPT-6 Astra / medium. This supplements AUDIT.md and is bound only to its exact v15 source and packed atlas:

- raw SHA256 `d9b4fb88c1b43b4499ba067cbf278e3c3cd76d8473d2cdd916d63c375ce46154`
- sheet SHA256 `edc26de0ba788f585a23c1b4e7f38db56248498e7d5ab11877984aa985811233`
- anims SHA256 `fd1afa3f762cae5df70362e7253b5fd4df007bfee00387e08e650a741cb06e24`

## Decision

**The evidence favors a hair-shape contribution, not visible skull growth, but does not support a strict manual clearance of the brief's 0.93–1.07 head condition. HOLD remains.** Do not turn this report into a manifest exemption or a numeric pass. H f3=1.077 stays visible in the record. No lab playback is claimed.

The probe is not a skull measurement. `tools/scale-probe.mjs` describes it as the median of square-root area ratio, width ratio and height ratio of a hair-inclusive connected silhouette against the idle median. Its compact measurements are made on idle-palette measurement cells before final quantization; the recorded box is diagnostic, not an exact segmentation of all final face pixels. Its f3 box [103,62,147,99] is 4 px wider on the left than f2 [107,62,147,100], and 1 px shorter vertically. A larger head scalar therefore does not demonstrate proportional skull enlargement. Comparing packed cells at 4x and 10x shows the extra projection at the trailing hair. The forehead/ear/jaw arrangement remains close to f2/f4/f5.

It is nevertheless too strong to call the entire 1.077 value **hair-only**: the skull contour is hidden beneath hair, the face changes with the shout, and the working pose is more frontal than idle and the two approved references. Those uncertainties prevent a direct anatomical separation with a reliable ±7% bound. The visible mouth is intentionally different, not a rigid landmark.

## Visible landmarks and uncertainty

`face-coordinate-grid.png` shows f2–f5 cropped at x115–155, y75–115, nearest-neighbor 10x. `reference-coordinate-grid.png` shows current idle and the approved neutral/combat cells with their own actual cell coordinates. Grid labels locate pixels; the measurements below are visual landmark estimates, not an automated semantic detector. Coordinate estimates have approximately ±1 px uncertainty each; length differences therefore have approximately ±2 px uncertainty.

| Image | Visible forehead top y | Lower chin/jaw y | Visible vertical extent |
|---|---:|---:|---:|
| f2 | 80 | 101 | about 21 px |
| f3 | 80 | 101 | about 21 px |
| f4 | 80 | 101 | about 21 px |
| f5 | 80 | 101 | about 21 px |
| idle f0 | 84 | 103 | about 19 px |
| approved neutral | 51 | 69 | about 18 px |
| approved combat | 81 | 99 | about 18 px |

These are **exposed skin extents**, not skull lengths. The top landmark is where bangs reveal forehead; its location changes with hair coverage and head angle. The larger exposed extent in charge cannot be substituted for a skull-scale ratio or ignored to manufacture a pass. Across the hold frames it provides evidence against a new f3-only vertical expansion.

The hold's ear tops are around y84–85 and lower jaws around y100–101, versus idle's ear around y87–88 and jaw around y102–103. That gives overlapping approximate 15–17 px ear-to-jaw spans, but ±2 px uncertainty exceeds a 7% tolerance on such a short span. The eyes are partly occluded by bangs; exact eye-to-eye or cranial width measurements are not reliable. The face center stays visually within approximately 1–2 px. No growing cranium or gross facial width pop is visible in f3, but no exact hidden skull measurement is available.

## Rigid sandals and feet

From actual atlas alpha occupancy in rows y220–240 inclusive:

- f2/f3/f4: left x[69,92), right x[162,190), soles y240; these whole foot-band pixel rectangles are byte-identical.
- f5: left x[69,92), right x[162,188), soles y240. 133 pixels differ from f2 in the foot band; the rightmost extent retracts 2 px. This is outline/sampling change, not a whole-foot translation. It meets the brief's revised 1–2 px outline allowance geometrically.
- The raw composite copied the lower-body donor, but the final atlas still has this small f5 difference; the packed result governs.
- Idle and the title-style combat pose have more oblique, widely spread feet. Their projected shoe width is not a rigid length directly comparable to the more frontal charge squat. All show recognizable complete sandals with stable toe/heel construction. No rescaling claim is based on the color-count feet proxy (1.375–1.427), which is not a shoe-width measure.

## Practical disposition

The focused check supports **no gross f3 skull growth** and **acceptable foot registration under the revised allowance**. It does not support a numeric manual scale pass against the approved baseline. A stronger independent skull/rigid landmark measurement, or a packed correction that brings the reported head value into range without distorting anatomy, is required to remove that hold. Preserve v15. This is not evidence that a full redraw is necessary. Temporal lab inspection remains a separate required check.

No manifest, candidate, atlas, engine or review status was changed. The prior audit commit is `dc9d98fb`; this supplement does not reverse its HOLD.
