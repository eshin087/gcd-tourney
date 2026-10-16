# Goku final4: all23 animations /108 quantized frames

2026-10-16. Astra manual anatomy/scale audit. **20 version-bound manual PASS recommendations, idle02 approved reference, 2 calibration HOLDs (light3v09/heavyv11).** No design approvals. No source generation is established as necessary by these holds.

## Exact artifact

- Sheet `production/reassembly-r03/final4-fixture-public/characters/goku/sheet.png`, SHA256 `c5017ea8067c35d2a956be1d11a306970ec20d507879b3208d56876ea2ef810f`.
- Metadata `production/reassembly-r03/final4-fixture-public/characters/goku/anims.json`, SHA256 `3e5d1714c2c809bd0c19fa0cae08d54c8f825e538e57f9d932031daa38949dda`.
- Diagnostic warn-only,48 colors,256 cells,16 columns,pivot128/240,ppu128. New candidate scales x1 in pack report. Independently counted48 opaque RGB colors and verified all108 extracted cells against exact atlas rectangles with zero RGBA differences. Per-cell PNG hashes/indices/durations/version map: `FINAL4_PIXEL_VERIFICATION.json`; extraction inventory: `production/reassembly-r03/final4-fixture-crops/inventory.json`.
- All108 frames and first/last relationships directly viewed at native density in all23 contacts. References reopened: exact approved title neutral/combat plus idle02. Shared-palette boundaries of hair/skin/gi/belt/boots remain legible. This is STATIC sequence/seam inspection, not timed playback or runtime hit/hurtbox certification.

## Baseline / interpretation

Idle02 collar-center(136,75)→belt(127,112)=38.1±5; belt(109,112)→(145,112)=36±4; boot(70,197)→(58,239)=43.7±4; short projected forearm19.4±6. Title neutral/combat torso37/37.4 supports the collar definition. Coordinates and source uncertainties are recorded in SOURCE_REPAIR_NOTES.md, CONSTRAINED_CALIBRATION_SCREEN.md, sidecar annotations, and earlier r2 measurements. Knees/shins concealed by trousers are not invented. Hair/posed extent alone never certifies density.

PASS means measurable visible anatomy agrees within uncertainty and remaining occluded segments are visually coherent. It does not claim every projected length equals an unforeshortened bone. Uniform factor feasibility is supporting evidence only: final appearance can remain indeterminate, as the two holds show.

## Final inventory

| Exact version | Frames | Native bodyHeight | Result | Final-pixel anatomy/sequence finding |
|---|---:|---:|---|---|
| idle02 |8|233|REFERENCE|Approved breathing poses; palette retains prior anatomy.|
| run09 |8|237|PASS|Factor.589; lower-confidence constrained calibration using source endpoint error. Head/torso/limbs/gi remain coherent through stride; previously cut rear feet/fist now complete. Loop end/start coherent.|
| dash09 |2|207|PASS|Factor.291; f1+35x restores foot; body and two stride poses agree within projection uncertainty.|
| jumpUp04 |2|206|PASS retained|Previously calibrated; tucked/rising poses and palette rechecked.|
| jumpFall04 |2|232|PASS retained|Previously calibrated; bent legs/open arms coherent in loop.|
| land07 |2|235|PASS|Factor.300; crouch→upright recovery, full hands/boots and matched volume.|
| light104 |7|237|PASS|Factor.383 preserves A/B relationship; both halves inspected. Punch/recovery heads, torso, arms and clothing match within uncertainty; no part-boundary size defect established.|
| light205 |7|236|PASS retained|All punch frames/recovery rechecked against pilot body landmarks.|
| light309 |7|237|HOLD body calibration; fit PASS|Factor.499 relies on source uncertainty and is12.1% below central.568. Neighbor-boot fragment removed; own arm/boot shapes complete. Recovery torso/belt/boot trend collectively small; insufficient support for unconditional body pass.|
| light409 |8|237|PASS|Factor.652; full kicking boots restored by x-only translations. Rotating torso, folded arms and gi volume coherent across kick/recovery.|
| heavy11 |8|237|HOLD body calibration; fit PASS|Factor.599 is10.1% below central.666. Complete fists/arms now preserved; recovery torso/belt/boot trend low together. Visible poses are plausible, but a precise body match remains unresolved; not a proven source defect.|
| airLight107 |5|237|PASS|Factor.539; full extended hands restored, tucked legs and torso density coherent through punch/recovery.|
| airHeavy06 |6|237|PASS|Factor.573; both-hand strike, tucked anticipation and recovery preserve head/build/gi volume. Occluded folded limbs assessed visually, not assigned hidden lengths.|
| guard05 |2|229|PASS retained|Both guard poses match pilot measurements; no new palette defect.|
| hurtHigh08 |3|223|PASS retained|Recoil projection and return coherent; exposed arms/boots preserved.|
| launched08 |2|200|PASS|Factor.258; x translations restore complete hair/head/hands. Reclining body/boot scale coherent within source/projected torso uncertainty; full loop silhouettes.|
| down05 |2|115|PASS|Factor.272; boot/forearm support density, complete kneeling→fallen poses. Hidden torso/knees remain unmeasured; runtime contact separate.|
| getup11 |5|237|PASS body/fit|Factor.532 supported by all three independent target intervals. Kneeling→crouched→guard proportions coherent; floor-contact warning belongs to Claude runtime assessment.|
| charge05 |4|237|PASS|Boot-derived.373354296; source map1,2,3,1 removes old neutral/combat seam. Breathing/combat body consistent; last equals first pose, no static loop snap.|
| beamCharge07 |3|236|PASS|Boot-derived.357620533; partly occluded belt limits torso precision, but head/build/arms/gi consistent across all three. Hands complete.|
| beamFire07 |3|233|PASS|Boot-derived.350577370; belt/boot independently agree; full extended arm/hand chain preserved.|
| special05 |8|237|PASS|Factor.596; grid contamination removed, all hair/hands/boots complete. Charge→palm strike→return preserves body/build; no source cut remains.|
| win05 |4|237|PASS|Factor.420; upright and raised-fist poses complete, anatomy/clothing consistent with title neutral within uncertainty.|

All PASS recommendations apply only to these exact versions at x1 and the inspected pixels. FrameOffsets are part of that identity: run09=[0,0],[0,0],[-1,0],[40,0],[-15,0],[18,0],[37,0],[0,0]; dash09 f1+35x; light409 f4−32/f5−25; heavy11 f3−27/f4−39/f5−36; airLight107 f1−4/f2−74/f3−66; launched08 f0+24/f1+42; all dy0. No future rescale inherits a pass automatically.

## Measurement evidence and limits

The source endpoints were independently inspected before assembly. Their x1 predicted segment lengths are checks on density; final heads, torso, limb chains, build and clothing were then visually compared in every frame. Source uncertainty remains separate from target uncertainty.

| New constrained/source candidate | Collar / belt / boot predicted native px | Interpretation |
|---|---|---|
| run09 |36.66 /34.47 /39.04|Source endpoint uncertainty supports boot; intact stride passes visually.|
| light409 |36.10 /37.19 /40.49|All three target intervals support density.|
| airLight107 |37.94 /32.88 /43.15|Stable collar/boot, belt near low range but within uncertainty.|
| airHeavy06 |34.12 /36.89 /39.95|Within target intervals; poses visually coherent.|
| getup11 |37.74 /35.13 /42.41|Three independent intervals; refined factor supported without invoking source error.|
| charge05 |40.2 /34.3 /43.7|Boot-derived and independent torso/belt corroboration.|
| beamCharge07 |32.62 /unmeasured /43.7|Torso belt endpoint partly occluded; source±10px length contribution overlaps reference interval. No hidden full belt claim.|
| beamFire07 |unmeasured /37.51 /43.7|Extended arms hide neckline; independent belt and boot agree.|
| special05 |34.71 /unmeasured /43.34|Two visible independent landmarks; body/limb/gi review supports within uncertainty.|
| win05 |35.37 /34.44 /41.19|All three within target intervals; upright build matches reference.|

Direct final-pixel representative readings: land f0 collar35.38±6,belt32.57±4,boot41.79±4; f1 collar35.74±6,belt36±4,boot41.76±4. Dash f0 collar34.66±6,belt33.62±4; rear boot35.74±6 strongly projected, corroborated by source boot43.69. Down f1 boot approximately(205,222)→(248,232)=44.1±5; f0 forearm(58,190)→(56,213)=23.1±5 versus short idle19.4±6. Prior FINAL_FIXTURE_AUDIT.md gives full endpoints. Translations change coordinates, not lengths; final restored limbs were directly viewed.

Light3 recovery f6 approximately collar(135,91)→belt(123,122)=33.2±5; belt~31±4; rear boot~40±4. Heavy source-supported recovery predicts33.04/32.37/40.60. These estimates overlap broad intervals, so neither strip is proved anatomically impossible. However the collective low tendency and visual recovery-size uncertainty prevent treating feasibility as certainty. Keep both on calibration hold rather than averaging their discrepancies into a numeric pass.

## What the two holds actually establish

At the source central estimates, body-correctness is still uncertain but the capacity conflict is measurable:

- light3 at.568: f0/1 heights229/224; f2/f3 248; f4 raised-knee recovery270; f5/f6 241. Main conflict is complete source f4 (474px high). A more compact planted/raised-knee recovery plus modest reduction of high-kick extents could address pose capacity while retaining other source poses, if Claude/user chooses a targeted pose repair.
- heavy at.666: f0/1 233/229; f2 240; f3 airborne extended punch264; f4/f5 254/256; f6/f7 241/242. Main conflict is the complete source f3 (395px high), whose rear leg extends downward while head stays high. A more tucked airborne leg/compact punch could reduce extent without changing body density; other poses need separate minor capacity consideration.

Original source crops `light3-capacity-source.png` and `heavy-capacity-source.png` show complete drawings. These are conflicts at central estimates, NOT a proof that no valid factor exists across measurement uncertainty. No additional scale iteration this round. Claude should decide calibration/compact-pose handling; a new-image call is not automatically necessary or authorized. The old roomy contact generator produced blank transparent subject panels and is not used as visual evidence here; numeric dimensions were cross-checked against source bounds and actual original crops.

## Handoff / release boundary

Select the20 passed versions plus idle, retain light309/heavy11 on technical hold. Strict repack will change shared palette when those two rows are removed; inspect that exact selected atlas once before claiming final production-pixel pass. Claude owns floor/contact/hurtbox and timed runtime review. User approvals remain separate; old design approval is not invented for new drawings. This diagnostic atlas is not a release pass. Parent owns commits/previews and goku-luffy handoff; no manifest, approval, tool or production output was edited by this auditor.
