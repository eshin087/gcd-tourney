# Independent Astra audit: Naruto charge v08

2026-10-18. GPT-6 Astra / medium. **Overall: HOLD against the charge-loop contract.** User approval of the drawing is recorded separately: Claude relay #8, “Approve v08 as drawn”. No source art, atlas, manifest or approval metadata was changed by this audit.

## Exact inputs

- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-charge-naruto`; branch `art/charge-naruto`.
- Actual quantized `public/characters/naruto/sheet.png`: SHA256 `4e41aac3983d8e1ce8bf100415e2ab63f0e9f5985293cf9b66c58e4955573878`.
- `anims.json`: SHA256 `6d77dabaed171ba27df78924b889fd03e21a5a0156ce90126f7d8c84e3f8d568`.
- Source charge_v08 SHA256 `A7DBA8D21FFD4A122111E599C2C804DD1E857F56359BE4E66E4FF9687A88F320`; generation record in `../charge-v08-generation.md`.
- Atlas indices 115–120, native 256x256 cells, 16 columns. Idle reference is atlas index 0. Exact title-style neutral/combat cells are `public/art-review/title-style-pilot/naruto-neutral_v01.png` and `naruto-combat_v01.png`, compared at their original pixel density without fitting or resizing individual figures.
- Metadata: six frames, loopFrom 2, durations 70/90/110/110/110/110 ms. PASS. Manifest bodyHeight 167; approval/version 8. No changes recommended to gameplay.

## Findings

| Criterion | Result | Evidence |
|---|---|---|
| Identity, outfit, readable gather/charge | PASS visual | All six have the same blond ninja identity, jacket, pants and sandals; bowed gather opens into chest-level joined seal and shout. No extra limbs or missing hands. Fine interlaced finger topology is too small/occluded to certify independently. |
| Head lock f2–f5, maximum 2 px | **HOLD** | f3 best head registration is x0/y−3 relative to f2. Independent face ROI also returns x0/y−3. f4/f5 return x0/y0. This is movement of the face, not only rising hair. Hair-inclusive top y77/74/77/77 supports the same displacement. Registration uncertainty approximately 1 px; the best estimate exceeds the limit and does not establish a pass. |
| Identical feet at floor y240 | **HOLD** | Exact alpha floor spans: f2 left 59–77/right 181–193; f3 59–77/182–193; f4 60–77/183–193; f5 59–77/181–193. Sole y240 is aligned, but pixels are not locked. Band y220–240 changes 490/514/444 RGBA pixels for f3/f4/f5 versus f2. Some are shading changes; the floor-alpha shifts independently prove contour changes. |
| Hip and knee lock | PARTIAL / HOLD for literal lock | Hip ROI best translation 0/0 throughout held loop. f4 knee ROIs fit +1/0, with approximately 2–4 px anatomical-center uncertainty. No major body displacement, but exact knee lock is not demonstrated. |
| Shoulder breath and joined hands | PASS visual, limited | Shoulder ROI f3 best shift 0/−1; others 0/0. Broad chest/arm position is stable. Joined hands remain central; projected finger details vary. Hidden wrist centers prevent a certified subpixel tremor measurement. |
| Full-body proportions vs idle/title cells | VISUALLY CONSISTENT; quantitative certification HOLD | Head, torso, arms, legs and shoe forms were inspected in every frame. No obvious chibi conversion, lost limb, or gross head inflation. Charge has a slightly longer-looking exposed jacket and more horizontal forearms than idle; pose/occlusion prevents certifying every segment within ±6%. Manual approximate shoulder-to-hip center span is 38 px idle versus 43 px hold, with roughly ±6 px combined landmark uncertainty. This is not a numeric pass or evidence for rescaling. |
| Clothing volume and body metric | INCONCLUSIVE numeric | Supplied B median .54 is not a body-length ratio; missing declared palette colors and occlusion make it unsuitable as a direct anatomical verdict. Visual silhouette remains plausible. The report does not declare B .54 a pass. |
| Updraft shapes and loop closure | PARTIAL | Four held cells have distinct hair/tail/cloth pixel patterns. f5→f2 has no whole-head translation, but floor and clothing pixels differ; f2→f3→f4 contains the verified head lift/drop. Full held-loop cycle inspected through all adjacent frame comparisons including wrap. GIF is supplied for playback; no in-game/browser observation claimed. |
| Clipping/effects/palette | PASS visual | All six occupied bounds stay within cell, soles y240. No aura, dust or other effects baked into sprites. Shared quantized palette; no obvious color strobe. |

## Every-frame anatomy notes

- f0: bowed, knees bent, hands together low; body is posed shorter (occupied top y109), not evidence that it should be enlarged. Hair/headband projected forward and face compressed by bow. Both shoes and limbs remain present; far arm and upper-leg joint centers are occluded. Automatic H1.203 cannot be independently certified as a pure misread from the present landmark evidence.
- f1: release top y78, head/torso open; joined seal and both forearms readable; knee bend and sandals consistent with hold. Full projected height 163 px, inclusive.
- f2: held baseline top y77, 164 px inclusive; broad stance and joined hands, intact torso and limbs. Reference joint estimates and all masks recorded in landmarks.json.
- f3: top y74, 167 px inclusive. Face/head rise 3 px; hip and knee blocks do not follow. This is the principal visible pop in the held cycle. No gross limb-length change.
- f4: top y77, returns from f3; small knee/foot contour differences. Hands and sleeves vary but remain anatomically readable.
- f5: top y77, close to f2; no whole-head registration shift on wrap, although feet/cloth pixels are not identical.

## Scale probe and manifest recommendation

Supplied H ratios: 1.203/1.013/.992/.992/1.001/.985; supplied feet ratios .600/.643/.657/.659/.643/.653. These are probe-derived size measures, not measured limb lengths. The f0 bow plausibly affects the head probe, but this audit does **not** conclusively isolate a probe-only error while numerically clearing all anatomy.

**Do not add scaleManualQA for this audit.** It covers unmeasured/partial cases and cannot turn the reported measured `pop` into a pass. A proven f0 probe misread would technically require a narrowly version-bound `scaleExemptFrames: { "0": "specific demonstrated probe contamination/foreshortening evidence" }` with `scaleExemptVersion: 8`; it would still leave partial/manual review as applicable. That record is **not recommended or authorized here**, because the proof is incomplete and independent loop defects remain. Never exempt f3 to excuse actual head movement. No ready-to-apply pass JSON is issued.

The user's “as drawn” approval is valid drawing approval; the approval quote does not explicitly waive these numeric loop constraints. Route the concrete hold findings to Claude for resolution or an explicit recorded contract exception. Do not silently claim strict technical success.

## Evidence and measurement limits

- `contact-2x.png`: every packed frame.
- `full-body-comparison.png`: idle, exact neutral/combat and all six at common density.
- `segments-2x.png`: idle/gather/held anatomy comparison.
- `registration-diff-2x.png`: native coordinate registration and RGBA difference at 2x; cyan feet band y220–240, yellow head region.
- `onion-2x.png`: tinted held-frame overlay, same markers.
- `measurement-grid.png`: coordinate guides.
- `full-loop.gif`: gather/release once, held cycle four times, repeating presentation. Native timings retained.
- `landmarks.json`: exact floor masks, occupied bounds, local registration and approximate manual joint centers. Pixel masks exact; face registration about ±1 px; clothed/hidden joint centers ±3 px or worse. Manual centers are estimates, not six-percent certification.

Evidence was extracted directly from the named atlas. Source dimensions were not treated as atlas dimensions. No pixel correction, repack, new generation, manifest edit, commit, build or production deploy was performed by this audit.
