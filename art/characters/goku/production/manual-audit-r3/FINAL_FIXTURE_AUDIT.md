# Goku r3 combined fixture anatomy audit

2026-10-16. Astra manual audit; no generation or design approval. This report applies ONLY to the frozen diagnostic pixels below. Proposed manual records require the same geometry and a final shared-palette recheck after production selection.

- Atlas SHA256: `d7d8ce0cc7c920dea794c87daf9a27c5d3cda11805f7cb3d1621719a4526ccac`
- Metadata SHA256: `97bf6026f2865f9f115e1e27826a72b67a6cb6fbcf9bde52c6dde36dc0422c12`
- Paths: `production/reassembly-r03/final-fixture-public/characters/goku/{sheet.png,anims.json}`.
- Pack: diagnostic warn-only, quantize48, 256 cells,16 columns,pivot128/240,ppu128. Independently counted48 opaque RGB colors. All71 extracted cells were compared byte-for-byte to their atlas rectangles: zero RGBA differences. Exact per-frame PNG hashes,indices,durations,versions in `FINAL_FIXTURE_PIXEL_VERIFICATION.json`.
- Every frame was visually inspected in the native-density contacts, including first/last relationships. Down additionally inspected at3x nearest neighbor. This is static sequence/seam inspection, not timed playback or runtime contact certification.

## Baseline and uncertainty

Approved idle02 f0 collar(136,75)→belt(127,112)=38.1±5; belt(109,112)→(145,112)=36±4; rear boot(70,197)→(58,239)=43.7±4; forearm(88,103)→(107,99)=19.4±6 native pixels. Approved title neutral/combat torso37/37.4 supports that definition. Prior independently recorded reference and r2 measurements remain in manual-audit-r2; source endpoint corrections and uncertainties in this directory's SOURCE_REPAIR_NOTES.md. Hair extent, overall posed height, clothing area and hidden joints do not independently certify scale.

## Per-strip result on this atlas

| Exact version | Frames | Body/fit result | Evidence and static sequence finding |
|---|---:|---|---|
| idle02 |8|Approved reference retained|Head/gi/boots remain coherent across breathing loop; palette preserves boundaries.|
| dash09 |2|PASS within uncertainty; fit PASS|Source factor.291, packx1/body207; f1 offset+35x/0y repairs rear-foot cut. Head, torso, arm chains and clothing volume coherent; loop alternates stride without amputated foot. Projected boot lengths differ with orientation and are not treated as exact anatomical lengths.|
| jumpUp04 |2|Prior manual PASS retained|Packx1/body206; both tucked/rising poses preserve head/torso/limbs within prior recorded uncertainty; no new RGB segmentation defect.|
| jumpFall04 |2|Prior manual PASS retained|Packx1/body232; open arms/bent legs coherent through loop, no new crop.|
| land07 |2|PASS within uncertainty; fit PASS|Source.300, packx1/body235; crouch→upright recovery coherent. See measurements below.|
| light205 |7|Prior manual PASS retained|Packx1/body236; punch extension/recovery limb chains and gi volume coherent; shared palette does not fragment body.|
| light304 |7|HOLD|Inherited old assembly, not newer component-recovered candidate. Detached/truncated arms in f1–f3 and smaller body remain. Complete original source can be recut; no missing-source conclusion.|
| light404 |8|HOLD|Inherited old assembly; active raised foot extends beyond right cell in f4/f5. Prior body-scale concerns remain. New reassembly is a different unaudited version.|
| heavy04 |8|HOLD|Inherited old assembly; f3–f5 fists cut/detached at cell edges. New component-preserving source extraction can repair the cuts, but capacity/calibration requires its own pixels.|
| airLight104 |5|HOLD|Inherited old assembly; extension arm cropped at right f2/f3. No proof of missing source drawing; placement correction remains possible.|
| airHeavy04 |6|HOLD|Inherited old source fitting; visibly smaller than idle, especially recovery head/build. New measured05 is not this atlas. No factor correction inferred from posed overall height.|
| guard05 |2|Prior manual PASS retained|Packx1/body229; raised forearms/torso/belt/boots consistent within pilot uncertainties; clean guard loop.|
| hurtHigh08 |3|Prior manual PASS retained|Packx1/body223; recoil projection and return coherent, no new palette/crop defect.|
| launched06 |2|HOLD|Inherited undersized assembly; no transfer of findings to later measured versions. Complete original is available for reassembly/placement.|
| down05 |2|PASS within uncertainty; fit PASS|Source.272, packx1/body115. Complete kneeling→fallen sequence; head/build/clothing consistent with pose compression. Measurable boot/forearm support density; folded torso and knees remain unmeasured.|
| getup03 |5|HOLD|Inherited old smaller assembly. New grid-cleaned08 and prospective collar-refined candidate are not represented here. No source redraw necessity established.|

PASS means visible body landmarks match within stated uncertainty and the remaining occluded anatomy is visually coherent, not that invisible segments have exact measured lengths. User design approval and Claude runtime contact/grounding decisions remain separate.

## New-pass landmarks

Dash09 f0: collar(202,107)→(177,131)=34.66±6; belt(155,123)→(186,136)=33.62±4; rear boot(85,204)→(74,238)=35.74±6 with strong projection uncertainty. f1 is the same prior measured geometry translated+35x: collar(145,107)→(121,132)=34.66±6; belt(100,124)→(131,137)=33.62±4. Its bent front boot is not compared as an unforeshortened shaft. Independent source rear boot150.137*.291=43.69 and collar131.370*.291=38.23 support the source density; raster/pose readings have lower confidence. No numeric hidden shin pass. Final foot completeness now directly inspected.

Land07 f0 collar(164,112)→(140,138)=35.38±6; belt(120,132)→(151,142)=32.57±4; boot(73,199)→(58,238)=41.79±4. f1 collar(136,76)→(125,110)=35.74±6; belt(110,110)→(146,110)=36±4; boot(68,198)→(56,238)=41.76±4. Prior endpoint overlays in DASH_LAND_MEASUREMENTS.json apply geometrically, while this report binds the final palette.

Down05 f1 visible foreground boot shaft-center approximately(205,222)→sole(248,232)=44.1±5, ratio1.01 to idle43.7±4. f0 exposed forearm approximately(58,190)→(56,213)=23.1±5, ratio1.19 to short idle19.4±6; uncertainty overlaps substantially, so the central ratio alone does not establish enlargement. Boot source158.8*.272=43.2 independently agrees. Folded collar/belt/knees are occluded and have no invented numeric measurements. Facial mass, exposed arms and gi volume remain visually coherent across both frames. Ground contact/hurtbox behavior requires Claude's runtime check.

## Remaining repair uncertainty

Run/light3/light4/heavy/getup/airHeavy newer assemblies, charge remap and both beam candidates are outside this frozen selection. Their overflow at one estimated median is a capacity finding at that factor, not proof no anatomically supported factor exists. Getup collar-derived.5371 independently yields torso38.1,belt35.47,boot42.81 and may fit237; Luna has been asked to evaluate. BeamFire.350 and BeamCharge.358 have source-landmark support with explicit intervals in SOURCE_REPAIR_NOTES.md. No new generation is justified solely by old probe failure, old grid cuts or uncertain median overflow.

Final production release audit remains pending: this is warn-only diagnostic output, seven core animations are absent, inherited holds remain, and any newly selected production atlas recomputes the shared palette. Parent owns manifest selection, final runtime checks, commits/previews and Claude handoff on goku-luffy. No approval fields or production files were changed by this auditor.
