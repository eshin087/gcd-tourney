# Naruto alternate-animation final Astra audit

**Overall verdict: HOLD for all 11 selected alternatives.** This independent audit is complete for the frozen candidates; it is not image/design approval. All 65 candidate frames and their ordered sequences were inspected directly in the actual 48-color quantized pack output, beside approved base endpoints and approved title neutral/combat cells. All 65 paired-export cells were verified byte-for-byte equal to those pack cells.

## Exact scope and references

Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-naruto-alts`, branch `art/naruto-alts`. Only `production/alts/astra-audit/` was written by this auditor. No generation, calibration, hitbox, production, engine, browser or desktop changes were performed. The user requested in-app Codex browser only; no desktop fallback was used. This is pixel/sequence inspection, not runtime or in-app playback validation.

Approved production atlas snapshot: `approved-base-sheet.png` SHA-256 `8d33ba2116321822db29f76c6e6edd3433c155775e5cb599b3f1774aa2effe53`; metadata `334f92a6cf8237e83c664ea5c7b384ee3291d85ce509d39903d62f7c377abe7b`. Verified approved base versions: idle07; light1 04, light2 06, light3 04, light4 08, heavy12, airLight1 06, airLight2 05, airLight3 09, airHeavy09, hurtHigh04, hurtLow03. Title neutral/combat and fixed approved-idle hashes, cell bounds and manifest versions are in `baseline-evidence.json`. ADR0029/PRODUCTION_CONTRACT.md are the anatomy baseline; no historical universal height/head rule is used.

Frozen actual pack: `../frozen/packed/characters/naruto/sheet.png` SHA-256 `bddb6bfb78d2d71097e375875296f3b85dd697cf16873a699f875a9544f8310c`; metadata `bc8d81f9beb535151af926d9e8a5423603e918dc374f0407d9473cf0e037dd42`. Paired export `2d357e36178d015f30ec49fd80076b7fab0f8b669b425e30dba99a745f8e8402`; original audit manifest `2d00f4989dddb7a44dbbbeb722bab64be77c14b620a085ba3feb77096dfd1fa8`. All declared fixture inputs were hash-verified. Selected versions are listed below and in `verdicts.json`.

## Findings by selected version

### light1Alt v01 — HOLD

f3 auto box extends to y=241, not the base y=121. Source Part A exceeded its authorized generation limit.

FAIL: active f2/f3 read as straight extension rather than compact elbow-led hook; too similar to base jab. HOLD: f0 guard hand heights and wider foot spread differ; f6 returns to a broadly similar guard but not the base geometry.

### light2Alt v02 — HOLD

f2 loses 7px at right according to pack log. Both active contact rectangles are too low and extend too far right.

Distinct kick replacing punch; intended technique is recognizable. FAIL: f0 no longer has the base rear-fist loaded position; f6 head/stance height differs from base.

### light3Alt v01 — HOLD

Contact is about 104–106px below the base top edge; literal low sweep does not meet the authored live contact envelope.

Low forward sweep is recognizable; it remains low visually. FAIL: base f0 has a knee chamber; alt f0 plants both feet in guard. Last stance/clothing volume also differs.

### light4Alt v01 — HOLD

Both active rectangles exceed at least one approved edge tolerance, including f4 right edge 24px short.

Distinct double-palm shove with forward drive is recognizable. HOLD: first pose broadly similar; final head height, torso posture and stance differ from base recovery.

### heavyAlt v01 — HOLD

Both active rectangles fail approved upward-launch contact envelope. Pose mechanics do not justify changing engine boxes in this audit.

Distinct rising flip-kick with upward motion is recognizable. HOLD: opening coil broadly similar, final recovery more upright/higher than base; f5 raised-arm pose produces an abrupt recovery change.

### airLight1Alt v01 — HOLD

Contact edges pass, but f1 reaches x=254 and violates x<=251 margin. This is a margin failure, not separately confirmed loss of source pixels.

HOLD: active silhouette still reads as straight jab. Right-backfist hand/forearm rotation is not clearly demonstrated. Broadly similar air-base opening/recovery; exact fidelity not certified.

### airLight2Alt v01 — HOLD

Contact edges pass, but f2 reaches x=255. No pack overflow warning for this frame, so boundary contact/margin failure is proven, not quantified pixel loss.

HOLD: same visible front-kick mechanism as base; required opposite-leg/left snap distinction is not clearly demonstrable from the costume/pose sequence. Broadly similar air-base poses with hand/knee differences; exact fidelity not certified.

### airLight3Alt v01 — HOLD

f2/f3 lose 15/21px at right. Both contacts fail; f2 heuristic box targets a region far behind/above the required strike.

Forward kick motion present; intended right roundhouse versus base back-heel distinction remains unclear in active silhouettes. HOLD: f0 supporting-leg bend differs; final hips/leg spread differ from base air recovery.

### airHeavyAlt v02 — HOLD

Both active frames have no-clear-strike heuristic boxes far outside target. f5 loses 7px at left. A3 budget exhausted; active f2/f3 both from Part A.

Down-forward leg strike is distinct from base hammer fists, but clear axe-heel wind-up/contact is not certified. FAIL: f0 open separated hands differ from base clasp; f5 is another down-forward attack, not air-base recovery.

### hurtHighAlt v01 — HOLD

No attack hit boxes, correct timing. HOLD remains for all-segment anatomy precision and exact endpoint review, not an invented contact failure.

f1 head/shoulder lateral turn is visible and distinct from backward snap. f0/f2 preserve overall base reaction poses, but exact contour/hand/foot fidelity is not certified; nonidentical pixels alone are not a pose-failure criterion.

### hurtLowAlt v01 — HOLD

No attack hit boxes, correct timing. HOLD remains for all-segment anatomy precision and endpoint review.

f1 one-arm clutch and opposite arm drawn back create the requested side-fold variant. f0/f2 preserve overall base poses, with small outline/hand differences; exact fidelity not certified.

## Contact envelope: independently compared to approved production

All 11 counts, phase arrays and timing arrays match approved bases. All 11 are nonloops; every sequence and its first/last transitions were inspected, with no loop invented. Five of 18 active frames meet the four-edge tolerance; only airLight1Alt and airLight2Alt pass every active contact edge. Seven of nine attack alternatives fail contact. Reactions correctly have no attack rectangles.

The original diagnostic manifest repacked base auto boxes without eight production overrides (light2 f3; light4 f3; heavy f3/f4; airLight3 f2/f3; airHeavy f2/f3). Those repacked boxes are not the authoritative baseline. This audit computed candidate deltas against its pre-existing approved production snapshot. Worker added a separate corrected supplement, SHA-256 `796824896dabbe4e38d7911da66579cb7c9a3a669d1b1abbb55d9e2912105179`; the original frozen files remained unchanged.

|Alt/frame|Delta x,y,right,bottom (px)|Within 12px each?|
|---|---|---|
|light1Alt f2|[0, 3, -6, 2]|yes|
|light1Alt f3|[-31, 1, -9, 120]|NO|
|light2Alt f2|[0, 27, 33, 42]|NO|
|light2Alt f3|[-1, 25, 40, 45]|NO|
|light3Alt f2|[0, 106, -35, 87]|NO|
|light3Alt f3|[0, 104, -33, 88]|NO|
|light4Alt f3|[-8, -4, -4, 19]|NO|
|light4Alt f4|[0, 8, -24, 14]|NO|
|heavyAlt f3|[-57, -20, -10, -27]|NO|
|heavyAlt f4|[-31, 18, -13, 37]|NO|
|airLight1Alt f1|[1, 0, 7, -1]|yes|
|airLight1Alt f2|[3, -1, 12, 0]|yes|
|airLight2Alt f1|[0, -2, 7, -1]|yes|
|airLight2Alt f2|[0, -2, 11, -1]|yes|
|airLight3Alt f2|[-139, -57, -84, -18]|NO|
|airLight3Alt f3|[-26, 7, 10, 11]|NO|
|airHeavyAlt f2|[-111, -75, -93, 40]|NO|
|airHeavyAlt f3|[-114, -105, -95, 31]|NO|

## Anatomy and uncertainty

`ANATOMY-TABLE.md` contains all 65 per-frame H/T/A/L/S readings, separate upper/lower limb segments and compact strip ranges. `anatomy-measurements.json` contains each interval, nominal baseline percentage and per-frame exclusions. H is crown-to-chin; T collar-to-hem; A shoulder/elbow/wrist chain; L hip/knee/ankle chain; S heel-to-toe only where locatable. These are coarse independent manual projected measurements from the final coordinate grids. H/S ±4px, torso/single segment ±6px, chains ±12px. These are landmark bounds, not statistical confidence intervals or allowances. Unknown 3D foreshortening is additionally excluded. No unmeasured segment was converted to a pass.

Shoulder width is explicitly excluded in every frame: poses are oblique/three-quarter, not a frontal shoulder-width view. Clothing hides joint centers; far limbs overlap or recede. Several hanging sandals have no defensible heel landmark; their S is null rather than a toe-fragment length. Clipped feet and the airHeavyAlt f5 arm are also unmeasured. The crouched idle projects a shorter torso/arm than the standing neutral, so its raw projected ratio cannot be imposed as a universal anatomy formula. The neutral/combat/idle reference measurements are all retained.

The cast identity remains recognizable throughout: spiky blond hair, dark/orange uniform, headband tails, right-thigh equipment and sandals. Ground-alternative recoveries often broaden the stance/clothing or raise the head relative to their base. light3Alt and airLight3Alt show particularly large leg-chain projection ranges; heavyAlt rotates through large pose changes. These are anatomy/continuity review concerns, not proof that every nominal interval outlier is a malformed limb. No new redraw authorization is inferred from uncertain ratios, and no head-gate result substitutes for full anatomy certification.

## Technical limits and provenance

The pack has exactly 48 opaque RGB colors and binary alpha. Six candidate frames violate the prescribed x=4..251 margin: light2Alt f2, airLight1Alt f1, airLight2Alt f2, airLight3Alt f2/f3 and airHeavyAlt f5. Pack log confirms actual clipping in four: light2Alt f2 right7px; airLight3Alt f2 right15px/f3 right21px; airHeavyAlt f5 left7px. The other two are margin/boundary holds without separately quantified lost pixels. Exact per-frame bounds and colors are in `frozen-atlas-evidence.json`.

This is an isolated warning-mode pack, not a successful strict production gate. The log reports 13 warnings, scale categories 1 reference/15 ok/5 drift/2 pop over the paired set, and 5 active frames without a clear strike limb. Heuristic fallback rectangles can target torso/feet rather than the intended strike; no override was invented to conceal that. Anatomy, endpoint, technique and clipped-source problems remain even where a rectangle happens to pass. No runtime contact/hurtbox test, production delivery or user approval is claimed.

The final ledger documents light1Alt Part A: four successful image outputs against a limit of three, plus a rejected no-output preflight. That one-success overrun remains a provenance hold; v01 selection does not reset it. Coordinator independently reconciled the current continuation as 24 invocations/22 PNG outputs with all outputs in the ledger; two failures emitted no image. The final selected-call table shows no further successful-call overrun. This audit read that ledger and verified frozen input hashes, but does not claim to have independently replayed the entire generator session. AirHeavyAlt v02 uses A3+B1, four A frames plus two B; active f2/f3 are both A. Exhausted A budgets stay exhausted.

`provenance-verification.json` records all frozen hashes, all input matches, paired-cell equality and the eight baseline-override differences. `verdicts.json` provides concise machine-readable per-strip findings. All images remain unapproved. The candidate set is ready for an honest HOLD review/handoff, not production integration.