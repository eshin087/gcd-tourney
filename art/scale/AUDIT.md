# Fighter scale audit — candidate pass complete

Current result: [FINAL_QA.md](FINAL_QA.md). Historical checkpoints below are retained as the investigation record; final visual approval and the documented measurement limits remain explicit.

# Fighter scale audit — in progress

User direction: preserve the cast's height differences, match anatomical scale, and remove animation-to-animation growth/shrinkage. ART-SCALE-01 owns this work.

## Confirmed findings

- All four custom sheets use 256px cells and 128 pixels/unit. SpriteActor constructs geometry directly from those values; no per-animation actor scale is applied. The visible drift is present in the source/packed art, before perspective rendering.
- ADR 0010 already requires comparable 31px heads, with standing bodies Naruto/Sasuke 200px, Killua 182px, Gojo 215px. The rule existed but had no measured production gate.
- The legacy packer normalizes each strip by its tallest opaque bounds. A raised fist, tucked body, hair spikes or a lying pose can therefore alter the character's scale.
- USER CORRECTION: original approved Gojo head size is preferred. Enlarged model v04 and all pending Gojo strips are rejected and removed from packer selection. The 31px interpretation was an overcorrection; original Gojo proportions now anchor the visual comparison.
- Naruto run/dash/crouch heads visibly grow relative to idle; heavy/win and several airborne/recovery frames shrink. Killua has similar run/dash/guard/charge growth and several small aerial/KO poses. These require calibrated repacking and selective redraws if correct anatomy no longer fits.
- Sasuke now has candidates for all 42 animations (175 packed frames) and three UI images, from the current ADR 0011 kit. Only the historical idle/run approvals remain approved. Several pose-scale corrections and fit checks are still in progress; UI fixed-name approval copies have not been created.

## Evidence files

- cast-before.png: columns Naruto, Sasuke, Killua, Gojo; idle above run; identical pixel scale and floor line.
- neutral-heads-before.png: same columns, 4x nearest-neighbor diagnostic crops. Grid increments 10 native pixels. Hair is not the skull.
- bounds-before.json: every existing packed frame's bounds and sheet cell/ppu metadata.
- <fighter>-before.png: first frame of each animation in canonical sheet order, seven columns.
- <fighter>-heads-1/2/3.png: every frame's head-area diagnostic crop. Rows follow the lists printed by head-sheets.mjs.
- head-proxies.json: hair color-component proxies ONLY. They are NOT skull measurements; bright attack smears and overlapping limbs produce false positives. Never use these as an automatic anatomical pass.
- raw-scale-report.json: raw-only isolated pack, useful for tracing source pixel lengths to packed pixels. It does not certify anatomy.

## Implemented guardrails

art/CHARACTER_SCALE.md now defines the shared anatomical gate and is linked from the art entry point, style guide, pipeline, and character onboarding. The packer supports explicit measured source skull-to-chin lengths in versioned sidecars. Calibrated cached frames are no longer normalized back to the legacy pose height. 206 packer regression checks passed after that change.

## Still required

Complete source landmark review, corrective candidates, all Sasuke art, strict packs, hitbox/hand-anchor rechecks, same-depth browser comparison and motion QA. Existing approvals remain historical approvals; new corrections await one final user review. Do not treat this audit or the passing tooling tests as completion of the visual corrections.

## Latest working checkpoint

- `npm run build` passed; `npm run test:sprites` passed 206 checks after the anatomical packing and warning changes.
- Sasuke's complete uncalibrated candidate set packed at 48 colors with no structural warnings. Calibrating the visibly small poses exposed clipping in superDash, airHeavy, launched, down and KO. This is a failed anatomical acceptance gate, not a final playable release. Placement corrections and two artistic repairs are in progress.
- `sasuke-heads-1..4.png` show all 175 candidate head-area crops. Automated crop placement sometimes chooses a hand/chest or misses a rotated head. `sasuke-packing-estimates.json` records provisional visual scale estimates, explicitly not certified measurements.
- Gojo enlarged-head candidates rejected following user feedback. Restore the approved set; review animation drift while preserving its original proportions. Naruto/Killua secondary calibration remains provisional and needs re-evaluation.
- Browser comparison UI smoke passed all 42 selectors with no page errors and no horizontal overflow at 390px width. This does not certify gameplay or anatomy.
- Removed the contradictory instruction to enlarge figures to fill their slots from fighter prompt files. The shared scale contract takes precedence.

## Gojo restoration verification

Rejected 14 saved enlarged-head candidates following user feedback; preserved their versions under _rejected and original generation parts. The approved model v03 and idle v02 references were never replaced. Strict 48-color pack now selects the prior approved strips for all 42 animations / 175 frames with zero warnings. Local browser confirmed custom Gojo sheet loading and no page errors. Build passed. This restores preferred proportions; it does not certify the remaining cast audit. Evidence: gojo-restored-pack.json, gojo-restored-browser.json, gojo-restored-game.png.
