# Astra final quantized-atlas audit: Gojo posture D

2026-10-17. GPT-6 Astra / medium. ART-GOJO-POSTURE-D.

**Technical result: HOLD for full anatomy/scale certification.** User approval of hurtHigh v04 and launched v08 via Claude relay gojo-run #14 is acknowledged and remains unchanged. hurtLow v04 remains the kept version. The approved drawings and the technical contract are separate evidence: this report neither rejects nor revokes the user's art decision.

Worktree: E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-proportions. Branch art/gojo-proportions. Inspected HEAD287e8f111552641718ce0ad9a8bf7f8f4585411d; atlas is the supplied review-only pack, not a verified production deployment.

## Binding and coverage

Verified exact SHA256:

- public/characters/gojo/sheet.png:5947C919AE88FBEB5371EA113A624E285B349D61BE0F67D417FAD1206BD32A4F
- public/characters/gojo/anims.json:1A8F886F683DDD0C397C217DACA8537D1974D18144926BAF99BED78E3A52B8C5
- raw/hurtHigh_v04.png:6FD33BCC49C554C5B6B2D307C725519B9B4810089D1B4A3C1807F206BED60796
- raw/launched_v08.png:8EC2242DA411EF38AFB3A77F2557FDF9D422527334793E6F3FA6A36CDBBD92E4
- raw/hurtHigh_v04.json:F9E11712E5A204F772BF227F43083144056B9940B22600A00429F0844469172F (auto-head)
- raw/launched_v08.json:0982B04DB0CC5392A54F182597D5E4A922F1B6F03B19B5F367923DFCD8D202BC (frameOffsets62/49)

anims.json scaleAudit binds hurtHigh v4, launched v8 and idle v8. Manifest agrees and preserves technicalHold=true for both approved new strips. The old launched scaleManualQA is bound to v6, not v8. No source hash provenance is embedded in anims.json; source-file hashes plus version metadata and visible source/atlas correspondence bind this inspection, not an independently repeated pack. Quantized outputs were inspected directly, never substituted with cached frames.

All three hurtHigh frames93/94/95 and both launched frames99/100 inspected at native density and nearest-neighbor3x beside actual atlas idle f0 and approved title-style neutral/combat. `final-atlas-native.png` columns are hurtHigh0/1/2, launched0/1, idle0, neutral, combat. `final-hurtHigh-3x.png` and `final-launched-3x.png` expose packed pixels. `final-atlas-measurements.json` records bounds, pixel counts and SHA256 of every decoded256x256 RGBA cell. Reference source hashes are in ASTRA_PREPACK.md and references were unchanged during this audit.

## Measured pack findings

| Strip/frame | Head probe | Feet color probe | Inclusive opaque bounds | Opaque pixels |
|---|---:|---:|---|---:|
| hurtHigh v04 f0 |0.961|1.145|[53,65,189,240]|8871|
| hurtHigh v04 f1 |1.000|1.104|[62,70,194,240]|8658|
| hurtHigh v04 f2 |1.029|1.055|[61,66,193,240]|8254|
| launched v08 f0 |0.893|0.868|[40,71,207,240]|8206|
| launched v08 f1 |0.924|0.899|[38,77,190,240]|8286|
| idle v08 f0 |1.000|1.001|[80,10,182,240]|10572|

hurtHigh median head1.000, feet1.104, verdict `ok`. Its auto-head sidecar has corrected the previously reported1.23 head failure. That older number is NOT the final atlas result. Individual f0 head0.961 misses the task's tighter0.97-1.03 requested band by0.009, while all three pass the ordinary +/-6% head gate. Feet is a color-area-derived ratio, not anatomical shoe width, and cannot itself certify footwear or uniform body scale.

launched median head0.909, feet0.884, verdict `unmeasured`. Its individual values are available in this final pack, unlike the initial blocked source pack, but the animation remains low confidence; these numbers are warning evidence, NOT a numeric gate result. They do not justify copying v6 manual QA to v8.

All five figures are complete and remain within x4..251/y4..251 margins. Lowest opaque row240 matches the pack pivot convention; this does not validate airborne world positioning or contacts. The launched f0 trailing shoe is intact: the final pack has handled the source's overlapping horizontal projections without the equal-width-slice truncation warned about in pre-pack notes. No disconnected shoe or missing hand observed.

## Anatomy and pose assessment

Native hand landmarks generally +/-3-5px per endpoint, hidden joints +/-5-8px. Diagonal chains and jacket folds add projection uncertainty. The following are estimates, not claimed precise bone lengths or numeric passes. The approved neutral jacket collar-to-lower-hem is approximately78+/-4px, working idle roughly78-80px; combat projection is roughly73-78px. The neutral's visible thigh/shin are roughly50-56px each, side-visible shoe33-38px. Hair/blindfold hide skull crown; hair-box numbers must not be relabelled skull size.

| Frame | Torso estimate, native collar to lower hem | Other anatomy / D posture |
|---|---|---|
| hurtHigh f0 | collar~(120,99), lower hem~(158,147), length61+/-7px | Thrown-back upper body, feet wide, front knee visibly bent; no pair of straight parallel legs. Near hip~(143,150), knee~(177,184), ankle~(164,224): projected thigh48, shin42px with hidden-joint uncertainty. Arms and both hands complete. |
| hurtHigh f1 | collar~(145,107), lower hem~(128,162), length58+/-7px | Forward recoil/fold, front knee bent, trailing leg diagonal. Sleeve/torso foreshortening prevents exact upper-arm/forearm certification. Hair size changes with head angle without a gross pop. |
| hurtHigh f2 | collar~(137,104), lower hem~(125,169), length66+/-7px | Recovery guard, broad stance and bent front knee; near hip~(132,165), knee~(176,188), ankle~(179,226): projected thigh50, shin38px, uncertain hidden joint centers. Near shoe around35-38px long. |
| launched f0 | transferred source landmarks checked on actual packed pixels: collar~(89,111), lower hem~(111,174), length67+/-5px | Raised knee and trailing bent leg, complete hands/feet. Head smaller-looking beside idle; exact skull axis obscured. Approximate raised thigh44px/shin47px, source-derived with fold/foreshortening uncertainty. |
| launched f1 | collar~(90,111), lower hem~(107,175), length66+/-5px | One knee up and one trailing leg, no straight pair. Raised shoe about32+/-5px; thigh42/shin36px are projected estimates, not bone-length certification. |

Torso central estimates for hurtHigh are ~0.74-0.85 of neutral and launched~0.85. Lean/fold and hem placement materially affect them, particularly hurtHigh f1; this report does not assert those ratios are exact anatomical shrinkage. They are sufficiently different, and uncertainty sufficiently large, that every visible segment cannot be certified within the task's +/-6%. Head agreement for hurtHigh is not a substitute for this check. Clothing silhouette and identity remain consistent; the packed torso/jacket and some limb projections read compact relative to the standing/approved cells. Neither a whole-body-area estimate nor posed bounding-box height resolves that concern. No body-sheet B numeric pass is claimed.

## Sequence and wrap

hurtHigh is non-looping, durations70/90/100ms: recoil back -> folded forward -> guard. All three frames retain the bent/wide stance. Head-probe span0.961..1.029 is about7.1% from smallest to largest, below the tool's12% pop tolerance, but orientation changes affect that comparison. Torso projections vary through the fold. End-to-idle transition may visibly lengthen the jacket/stance; runtime testing remains Claude's responsibility.

launched is70/70ms looping. Both ordered transitions, f0->f1 and f1->f0, were inspected from the exact extracted frame pair. The raised shoe shifts upward/right and trailing leg changes bend, while upper body/head remain broadly anchored. Hair-probe box moves from[58,85,84,112] to[55,84,82,112], about2.5px left/0.5px up at box center; opaque right edge changes207->190 as the trailing shoe swings. Opaque area changes less than1%, but that is not a body-size pass. The alternating leg shapes are legible; no disappearing limb or clipped loop frame. A two-frame140ms flutter is necessarily abrupt. This audit checks frame sequence/wrap visually, not timed browser/gameplay playback, contact boxes or perceived feel.

## Handoff

Retain both technical holds for full anatomy/scale; do not invent a v8 manual pass merely because the user approved the drawing. hurtHigh's head-only hold is resolved in this atlas, but full segment evidence remains insufficient. launched remains unmeasured with a smaller torso/head indication. Claude owns contact/hurtbox testing and any integration decision; this report does not authorize changing approved art, manifest policy, gameplay, merging or production deployment. No assets, manifest, sidecars, approval statuses or pack outputs were edited by this auditor. Only this report and derived diagnostic evidence were added.
