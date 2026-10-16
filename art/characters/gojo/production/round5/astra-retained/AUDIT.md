# Gojo round5 retained-candidate audit — Astra / medium

Current actual quantized atlas `0298b272fde74f64412a0e7a40dbdbb86f2ebf683e4d585501d0eefa668daf3f`; animation metadata `6d53aac11d62e13df9305b7e566fcad01169f2d2345720d79ff2911676a207f0`. Source calibration remains commit941d8e0; audit extends035c3eb. All18 frames of these five strips were freshly extracted and inspected. No old candidate measurements were reused. Reference landmark estimates come from the immediately preceding round5 audit only after exact reference-image hash equality was verified.

## Current verdicts

- **airLight1 v07** — HOLD for full-segment ±6% certification: guarded/palm frames intact; f2 retracted arm overlaps torso; airborne limb and shoe projections lack matched references. [Current frames](airLight1-contact.png).
- **airLight2 v05** — HOLD for full-segment ±6% certification: f0→f1 crown lowers9px into kick, f2→f3 returns; kick extension and depth conceal comparable joint lengths. [Current frames](airLight2-contact.png).
- **jumpFall v06** — HOLD for full-segment ±6% certification: stable body across two-frame loop, but reaching hand swings about15px and elbows/airborne shoes remain projection-limited. [Current frames](jumpFall-contact.png).
- **superDash v09** — HOLD: projected torso ~52px vs combat71px is a current compact-trunk residual. Forward pitch prevents turning chord ratio into a definitive anatomical length; folded legs/shoes remain uncertified. [Current frames](superDash-contact.png).
- **throw v05** — HOLD for full-segment ±6% certification: four intact rotating gestures; no split/cut figure observed, but raised/retracted arms and airborne legs lack pose-matched length evidence. [Current frames](throw-contact.png).

These are current technical certification holds, not five proven drawing failures, user rejections or authorizations for new calls. A passing packer/head gate does not resolve hidden anatomy. No source, calibration, hitbox or public atlas changed.

## Measurement method

[All coordinates, per-frame exclusions, uncertainty intervals and hashes](measurements.json). Each `*-grid.png` is a nearest-neighbor2× atlas crop with native-coordinate16px grid. Coordinates are whole native pixels. H is hair crown to chin (true skull crown hidden); T collar-to-garment-hem chord; UA/FA approximate projected shoulder/elbow/wrist chain; thigh/shin approximate clothed joints; S visible heel/toe chord. Shoulder span is garment-center projection. Uncertainty applies to both reference and candidate: H±4,T±6,UA/FA±6,thigh/shin±8,S±4,shoulders±6px. Far-side limbs, depth rotation, concealed joints and nonmatching shoe orientation are explicit exclusions, not zero-error measurements. Point ratios inside[0.94,1.06] do not certify anatomy when intervals/projections remain uncertain.

| Frame | Reference | H | T | UA | FA | thigh | shin | S | shoulders |
|---|---|---|---|---|---|---|---|---|---|
| airLight1 0 | combat | 34.1 | 56.4 | 25.3 | 18.0 | 38.5 | 50.2 | 18.1 | 33.1 |
| airLight1 1 | combat | 35.1 | 57.3 | 25.0 | 23.0 | 38.5 | 50.2 | 18.1 | 41.0 |
| airLight1 2 | combat | 35.1 | 56.3 | 25.0 | 24.0 | 38.5 | 49.2 | 18.1 | 40.0 |
| airLight1 3 | combat | 35.1 | 56.3 | 24.7 | 18.8 | 38.5 | 49.2 | 18.1 | 34.1 |
| airLight1 4 | combat | 35.1 | 56.3 | 25.6 | 18.8 | 38.5 | 50.2 | 18.1 | 34.1 |
| airLight2 0 | combat | 37.2 | 55.2 | 29.1 | 19.3 | 41.2 | 54.1 | 18.4 | 37.0 |
| airLight2 1 | combat | 35.5 | 51.0 | 21.4 | 16.8 | 36.0 | 35.0 | 30.6 | 36.0 |
| airLight2 2 | combat | 36.3 | 50.6 | 20.0 | 10.8 | 37.0 | 41.0 | 30.8 | 38.0 |
| airLight2 3 | combat | 37.3 | 55.2 | 29.1 | 19.3 | 41.2 | 54.1 | 18.4 | 37.0 |
| airLight2 4 | combat | 37.2 | 55.3 | 29.1 | 19.3 | 41.2 | 54.1 | 18.4 | 37.0 |
| jumpFall 0 | combat | 37.1 | 60.0 | 34.5 | 25.6 | 30.4 | 58.2 | 26.8 | 44.1 |
| jumpFall 1 | combat | 37.1 | 60.0 | 34.5 | 25.6 | 30.4 | 59.1 | 26.8 | 44.1 |
| superDash 0 | combat | 38.0 | 51.9 | 27.0 | 20.6 | 29.1 | 48.4 | 18.0 | 43.0 |
| superDash 1 | combat | 38.0 | 51.9 | 27.0 | 20.6 | 29.1 | 48.5 | 18.0 | 43.0 |
| throw 0 | combat | 37.1 | 62.8 | 26.4 | 30.4 | 41.5 | 56.6 | 18.2 | 39.1 |
| throw 1 | combat | 37.1 | 62.4 | 33.2 | 20.2 | 47.5 | 55.5 | 15.1 | 17.0 |
| throw 2 | combat | 36.1 | 64.9 | 18.4 | 21.8 | 48.3 | 54.8 | 15.1 | 42.2 |
| throw 3 | neutral | 36.0 | 64.1 | 31.6 | 24.1 | 45.6 | 53.9 | 15.3 | 39.1 |

## Full sequence inspection

- airLight1: f0 guard→f1 palm extension→f2 held palm/retracted rear arm→f3 guard→f4 settling guard. Torso/legs remain recognizably continuous; f2 far forearm disappears into the back silhouette, so its length cannot be certified. f4→f0 replay is close in silhouette but not an engine loop (`loop:false`).
- airLight2: f0 knee lift→f1 horizontal kick and lowered hand→f2 kick hold with slight reach→f3 recoil knee lift→f4 hold. Crown bound shifts y17→26→25→17→17, approximately9px on extension/retraction. This accompanies pose rotation; it is positional motion, not by itself proof of global size drift. f4→f0 replay is visually similar; strip is non-looping.
- jumpFall: f0→f1 and f1→f0 preserve the bent legs and torso, with roughly1px breathing shift. Extended hand changes from around(219,78) to(219,63), about15px; this oscillation remains visible on the true two-frame loop. Body scale stays visually stable; joint/foot orientation prevents strict whole-body certification. User can assess the hand motion.
- superDash: f0→f1 and f1→f0 preserve forward palm, bent torso and folded legs with about1px displacement. True two-frame loop shows no gross reset. Torso collar(174,138)→hem(157,187) is51.9px vs combat71.0px: point ratio0.73, conservative interval about0.60–0.89. That is a robust SHORT PROJECTED CHORD relative to combat, but pitching/flexion/hem placement precludes declaring the same deficit in anatomical trunk length. Preserve as current residual; no invented numeric pass.
- throw: f0 raised near-face fingers→f1 forward point/retracted rear elbow→f2 raised reverse hand→f3 relaxed lowered hand. Each figure remains intact; actual alpha bounds stay inside the cell (f1 rightmost occupiedx250, five-pixel margin to boundary). No apparent source-column split remains in these actual packed frames. Turning moves the head/shoulders laterally; hand shapes and occluded arm chains do not support a strict segment pass. f3→f0 replay raises the hand; the animation is non-looping.

Ordered-frame transition review is not a live game playback or contact/hurtbox test. Foot pivot positioning of airborne art is packer behavior, not evidence of grounding. Neither a source size nor an old diagnostic atlas was substituted for the current quantized sheet.

## Exact provenance

- `public/characters/gojo/sheet.png`: `0298b272fde74f64412a0e7a40dbdbb86f2ebf683e4d585501d0eefa668daf3f`
- `public/characters/gojo/anims.json`: `6d53aac11d62e13df9305b7e566fcad01169f2d2345720d79ff2911676a207f0`
- `public/art-review/title-style-pilot/gojo-neutral_v01.png`: `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0`
- `public/art-review/title-style-pilot/gojo-combat_v01.png`: `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656`
- `art/characters/gojo/raw/airLight1_v07.png`: `9f258845eb022b0fee0ae13125510fbfb7a78c75b06423874779d9923772ab30`
- `art/characters/gojo/raw/airLight2_v05.png`: `84a80437cc13504a6c34567eeaab84f71e22d510ea0aaada0ad077bf5491f989`
- `art/characters/gojo/raw/jumpFall_v06.png`: `05e864ec3d006dcf77d5510b87c477d55aa206bae4aef4164b22a05cdc0b8b3f`
- `art/characters/gojo/raw/superDash_v09.png`: `401b2bb5d7b5ace9155f641e20412d1c75dedd37199f7c8fbeacc3d2009cb17f`
- `art/characters/gojo/raw/throw_v05.png`: `fccc76c4387a1c919d1f7ab37901871d01176be7c8da5c98799dd056560380c1`
