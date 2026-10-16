# Gojo round-5 final-atlas audit — Astra / medium

Audited commit `941d8e08f85b79d47ffaae1774e14530613ad856`. Scope: idle v08 (8 frames), light3 v06 (7), airRecover v05 (3), directly extracted from the actual quantized atlas. This is a technical audit, not an approval. User approval of idle08 and its hands-down stance is preserved.

## Verdicts

- **idle v08: HOLD** — User-approved design retained. Stable eight-frame silhouette, but source f7 right toe is cut at image edge; missing extent unknown. Full ±6% segment certification inconclusive.
- **light3 v06: HOLD** — Seven complete poses; f3→f4 crown rises about11px during recoil. Torso/arm projection and shoe orientation prevent full ±6% certification; no new robust bone-length defect established.
- **airRecover v05: HOLD** — Three intact rotation phases; tucked/foreshortened torso, limbs and footwear lack matched pose references. Projected numbers cannot certify ±6%; no robust new defect established.

HOLD means certification incomplete; it does not by itself justify regeneration or revoke user visual acceptance. No new generation, packing, calibration or public-output edits were performed.

## Evidence and method

[Complete coordinates, hashes, exclusions and intervals](measurements.json). [Idle frames](idle-contact.png), [light3 frames](light3-contact.png), [airRecover frames](airRecover-contact.png). All comparisons use the exact neutral/combat cells at native density. Grid renderings use nearest-neighbor enlargement, no geometry adjustment.

H below is hair-crown to chin, not an inferred skull height; skull crown is hidden. T is collar-to-garment-hem chord. UA/FA and thigh/shin are projected joint chains under clothing. S is visible heel-to-toe projection. Shoulder span is approximate garment/joint-center width. Individual endpoint choices can change a result by several pixels; uncertainties are H±4, T±6, UA/FA±6, thigh/shin±8, S±4 and shoulders±6 px, on both candidate and reference. Intervals propagate this uncertainty conservatively. A point ratio inside ±6% is never automatically a pass. Far-side chains and oblique/hidden joints are excluded explicitly per frame.

Baseline H/T/UA/FA/thigh/shin/S/shoulders (px):
- neutral: 34.4/79.4/35.4/31.0/48.0/46.2/35.0/39.0
- combat: 38.3/71.0/32.2/26.2/43.9/56.5/36.0/38.1

| Strip/frame | Ref | H | T | UA | FA | Thigh | Shin | S | Shoulders |
|---|---|---|---|---|---|---|---|---|---|
| idle 0 | neutral | 38.1 | 76.4 | 32.3 | 28.4 | 47.0 | 53.1 | 32.0 | 42.0 |
| idle 1 | neutral | 38.1 | 76.3 | 32.3 | 28.4 | 47.0 | 54.1 | 32.0 | 42.0 |
| idle 2 | neutral | 37.9 | 76.4 | 32.3 | 28.4 | 47.0 | 53.1 | 32.0 | 42.0 |
| idle 3 | neutral | 37.9 | 76.4 | 32.3 | 28.4 | 47.0 | 53.1 | 32.0 | 43.0 |
| idle 4 | neutral | 37.9 | 76.4 | 32.3 | 28.4 | 47.0 | 53.1 | 32.0 | 43.0 |
| idle 5 | neutral | 37.9 | 76.4 | 32.3 | 28.4 | 47.0 | 54.1 | 32.0 | 43.0 |
| idle 6 | neutral | 37.9 | 76.4 | 32.3 | 28.4 | 47.0 | 53.1 | 32.0 | 43.0 |
| idle 7 | neutral | 37.9 | 76.4 | 32.3 | 28.4 | 47.0 | 54.1 | 31.0 | 43.0 |
| light3 0 | neutral | 34.1 | 61.8 | 31.6 | 22.7 | 31.0 | 40.7 | 24.8 | 34.1 |
| light3 1 | combat | 34.0 | 63.0 | 31.4 | 23.4 | 48.4 | 44.4 | 29.7 | 35.0 |
| light3 2 | combat | 31.0 | 61.8 | 29.6 | 24.2 | 49.3 | 41.1 | 31.6 | 35.1 |
| light3 3 | combat | 31.0 | 61.8 | 29.6 | 24.2 | 49.3 | 41.1 | 31.6 | 35.1 |
| light3 4 | combat | 34.0 | 66.5 | 32.0 | 24.8 | 46.6 | 41.4 | 30.5 | 36.1 |
| light3 5 | neutral | 35.0 | 69.7 | 32.6 | 27.2 | 35.1 | 59.3 | 39.0 | 35.0 |
| light3 6 | neutral | 35.0 | 69.7 | 32.6 | 27.2 | 35.1 | 59.3 | 39.0 | 35.0 |
| airRecover 0 | combat | 41.9 | 68.2 | 32.8 | 40.5 | 48.0 | 60.2 | 42.5 | 29.0 |
| airRecover 1 | combat | 32.1 | 49.4 | 41.2 | 22.1 | 25.5 | 62.1 | 43.7 | 19.1 |
| airRecover 2 | combat | 36.2 | 54.6 | 29.8 | 26.9 | 23.3 | 50.8 | 19.8 | 42.0 |

## Every transition and wrap

- Idle f0→1→2→3→4→5→6→7: consistently lowered hands, similar torso volume, arms and leg bend. Small breathing shifts of roughly 1–2px; no obvious global scale jump. f7→f0 returns smoothly in the ordered frame comparison, except the unresolved source toe contour. This is frame-by-frame sequence review, not in-game playback or a runtime contact check.
- light3 f0→1 lifts the bent knee; 1→2 extends the kick; 2→3 holds the extension; 3→4 retracts and raises the crown from about y23 to y12; 4→5 plants the foot; 5→6 settles. H estimates stay 31–35px through these poses. The 11px positional change remains visible but is not itself a proven size change: head lengths and body orientation must be considered separately. Endpoint f6→f0 changes from two feet planted to knee lift; anims.json declares this non-looping, so that is a preview replay seam, not an engine wrap defect. Hand-pocket pose and twisted torso prevent a strict full-segment pass.
- airRecover f0→1 rotates from tucked back pose to inverted tuck; 1→2 opens arms and legs for recovery. Each frame is an intact figure. The dramatic projected torso/limb differences track rotation and occlusion; no equivalent reference view exists to certify exact lengths. f2→f0 resets from open recovery to tuck; this strip is non-looping. No seamless looping claim is made.

## Idle f7 shoe edge recheck

[Source boundary crop](idle-source-f7-edge.png): original source is 2172×724. Crop is x1892:2172,y480:724, enlarged3×. The right shoe visibly intersects x2171; it is not merely a detached background speck. Its missing extent cannot be inferred from the clipped source. Actual packed f7 has transparent margins and surviving shoe endpoints around (150,235)→(181,235), so it is not a new atlas-edge clip. Atlas margin does not restore a source-cut toe. Retain technical HOLD; this does not reject the accepted stance.

## Interpretation

Idle torso and general build visually track the neutral cell; no old guard-envelope requirement is applied. Different stance changes leg projections and shoulder presentation. Light3 upright recovery torso chord is about70px versus neutral79px, while bent frames are about62–65px versus combat71px: these differences are residual projections under uncertain garment landmarks, not a certified anatomical shortening. AirRecover lacks pose-matched length evidence throughout; shoe lengths vary with viewing angle and overlapping soles. The supplied 6% criterion cannot be certified for all requested segments on any strip from these rasters; no fabricated numeric passes or new calibration overrides are issued.

Other Gojo strips were not re-audited. Older round4 numbers belong to their recorded atlas/calibration and must not be silently attributed to this atlas. Runtime contacts/hurtboxes remain Claude-owned. Build is not an anatomy test and was not rerun for these audit-only evidence files.

## Immutable input hashes

- `public/characters/gojo/sheet.png`: `0298b272fde74f64412a0e7a40dbdbb86f2ebf683e4d585501d0eefa668daf3f`
- `public/characters/gojo/anims.json`: `6d53aac11d62e13df9305b7e566fcad01169f2d2345720d79ff2911676a207f0`
- `public/art-review/title-style-pilot/gojo-neutral_v01.png`: `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0`
- `public/art-review/title-style-pilot/gojo-combat_v01.png`: `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656`
- `art/characters/gojo/raw/idle_v08.png`: `6c1ec47c2c1e2b7df2d3aa6ccf2256e46dc93bdd8e426607f2990f6f963913bb`
- `art/characters/gojo/raw/light3_v06.png`: `b6553f61c1c0e330343cbb80408da7cb252ac6de02c40b5516281927f9904faa`
- `art/characters/gojo/raw/airRecover_v05.png`: `74656fc7e548ecff9b0fd0701da8523cdbd65959dce2bf611072238672bf7b3e`
