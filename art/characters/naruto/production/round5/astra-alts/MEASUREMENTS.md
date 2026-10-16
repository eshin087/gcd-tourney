# Initial projected landmark samples

Supplement: [all 59 frame annotations](PER-FRAME-MEASUREMENTS.md) and [endpoint coordinates](per-frame-measurements.json) now cover every frame; the original reference samples below remain for comparison.

Fresh manual native-cell representative landmarks on exact final quantized pixels; all 59 frames visually inspected. Numeric samples do NOT stand in for all-frame numeric clearance. H_hair includes hair; H_skullEstimate estimates skull under hair and is low confidence. T consistently collar to black jacket hem, not to crotch/trouser folds. Segment coordinates are projected, not depth corrected.

Uncertainty: hair/skull head +/-4 px; torso +/-6; each arm segment +/-6; each leg segment +/-7; shoe +/-4. These bounds exceed many 6% tolerances. Hidden depth is additional and unbounded.

| Sample | H hair | H skull estimate | T | upper arm | forearm | thigh | shin | shoe |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| neutral | 36.1 | 22.1 | 49.1 | 32.9 | 27.5 | 34.9 | 46.3 | 28.0 |
| combat | 36.1 | 22.1 | 38.5 | 21.3 | 20.6 | 39.7 | 38.1 | 26.0 |
| idle:0 | 38.0 | 23.0 | 36.3 | 20.5 | 21.1 | 33.8 | 38.6 | 29.0 |
| airLight1Alt:0 | 42.0 | 25.1 | 40.6 | 18.8 | 19.7 | 33.1 | 43.9 | None |
| airLight2Alt:1 | 37.1 | 22.1 | 39.0 | 28.0 | 22.8 | 39.5 | 43.1 | 23.1 |
| airLight3Alt:2 | 40.0 | 27.0 | 41.4 | 26.2 | 22.8 | 42.7 | 46.7 | 22.4 |
| heavyAlt:3 | 36.1 | 21.2 | 40.1 | 31.9 | 19.7 | 42.4 | 36.9 | 21.4 |
| hurtHighAlt:2 | 37.4 | 23.4 | 44.3 | 23.6 | 24.7 | 29.7 | 42.4 | 32.0 |
| hurtLowAlt:0 | 41.0 | 27.1 | 37.5 | 24.2 | 22.1 | 30.8 | 39.1 | 33.0 |
| light1Alt:0 | 41.0 | 26.0 | 35.2 | 19.1 | 20.1 | 32.4 | 37.9 | 29.0 |
| light2Alt:2 | 38.0 | 25.0 | 42.1 | 18.4 | 24.1 | 42.2 | 35.2 | 28.0 |
| light3Alt:2 | 40.1 | 26.0 | 33.1 | 16.6 | 20.6 | 38.8 | 41.6 | 28.8 |
| light4Alt:3 | 40.0 | 26.0 | 43.5 | 29.1 | 21.0 | 37.0 | 46.4 | 29.0 |

## Every frame and adjacent transition

Read each animation in order. Its final entry also covers the last-to-first preview wrap. All ten metadata entries have loop=false; a preview repeat is not a gameplay loop.

### airLight1Alt

- f0: Guard, raised knee; far limbs overlap.
- f1: Straight punch; near arm lengthens in projection as expected.
- f2: Held extended punch, no detached wrist.
- f3: Retracts to guard without head jump.
- f4: Guard recovery; last-to-first near pose match.

### airLight2Alt

- f0: Knee chamber, compact guard.
- f1: Side kick; supporting thigh bent, striking knee under cloth.
- f2: Extended kick, stable head and torso; toe remains inside margin.
- f3: Knee retracts and both forearms converge; joints occluded.
- f4: Returns to chamber; last-to-first small stance change.

### airLight3Alt

- f0: Knee chamber, shorter silhouette than base; not scaled to standing.
- f1: Open arms/hips, no base back-spin pose.
- f2: Extended kick with crescent; exclude effect from body.
- f3: Extended kick without crescent, head/torso stable to f2.
- f4: Retracts and opens rear hand; no lost limb.
- f5: Guarded recovery, bent support leg; endpoint differs from base.

### heavyAlt

- f0: Low preload; garment compression expected.
- f1: Deeper preload, head lowered with torso.
- f2: Knee lift; rising torso, no global head jump.
- f3: High kick, head tipped back; striking knee not clearly localized.
- f4: High kick hold, hip fold and raised sandal rotate.
- f5: Retracts into airborne guard with raised fist; no scaled-down part B.
- f6: Landing turn, rear arm spread; projected shoulder width changes.
- f7: Guard recovery; last-to-first bends into startup.

### hurtHighAlt

- f0: Back lean/open arms; head rolls back.
- f1: Open-arm hit hold; far forearm occluded.
- f2: Guarded recovery; head angle differs from base, not a proven size jump.

### hurtLowAlt

- f0: Forward fold, both hands at abdomen.
- f1: One arm thrown behind; near sleeve overlaps waist.
- f2: Re-folds with hands at abdomen; last-to-first modest head rise.

### light1Alt

- f0: Guard startup, feet wider than base.
- f1: Guard/shoulder load.
- f2: Straight extended punch rather than compact hook.
- f3: Extended punch held, guard fist overlaps face.
- f4: Cross-body withdrawal; arms obscure torso.
- f5: Guard recovery.
- f6: Guard end; last-to-first close but not pixel-identical.

### light2Alt

- f0: Guard startup; base rear-fist load absent.
- f1: Knee lift, near leg folded.
- f2: Snap kick; foot lower/further than base fist.
- f3: Kick held; foot retracts horizontally while same low height remains.
- f4: Knee retraction, body near vertical.
- f5: Guard recovery.
- f6: Guard endpoint; slightly different stance/head tilt from base.

### light3Alt

- f0: Grounded guard differs from base knee-chamber start.
- f1: Knee lift, forearms guarding.
- f2: Side kick reaches mid torso; shoe intact at margin.
- f3: Held kick; no obvious head/torso pop.
- f4: Chamber crosses body, opposite support configuration; large pose reset from f3.
- f5: Wide guard recovery.
- f6: Guard end; last-to-first similar, base remains more upright.

### light4Alt

- f0: Guard startup.
- f1: Both palms raised, shoulders opening.
- f2: Double-palm extension, no lost fingers/forearms.
- f3: Full lunge, arms extended; torso lean lengthens projected hem distance.
- f4: Lower follow-through, palms still extended.
- f5: Rear step; one sandal oblique and largely edge-on.
- f6: Guard recovery.
- f7: Guard endpoint; last-to-first small chest/head-height shift.
