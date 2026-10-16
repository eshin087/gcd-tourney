# Luffy manual body audit r2 — Astra, 2026-10-15

## Supported decisions

Manual body-scale PASS within visible-landmark uncertainty: run v01, dash v02, jumpUp v01, jumpFall v03, land v01, light1 v02, light2 v01, light3 v02, light4 v02, heavy v01, airLight1 v01, airHeavy v01, guard v01, hurtHigh v01, charge v01, beamCharge v01, beamFire v02, win v03. Approved idle v01 remains the reference.

Overall HOLD: launched v01 (real body undersize), special v01 (severed recovery cells), down v01 and getup v01 (unaccepted cell loss/grounding; low-confidence recovery projections). Do not write pass records for these four from this report.

These are version-bound MANUAL BODY-SCALE findings under Claude's current main-inbox calibration criterion. They are not image approvals, automatic-probe passes, proof of hidden anatomy, runtime contact validation, or unconditional release certification. Only the exact quantized fixture pixels below are covered. Any final production repack must compare cell hashes and have changed pixels rechecked.

## Immutable pixel and input identity

Worktree E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-luffy-core, branch art/luffy-core. Input/sidecar/tool/manifest provenance is pinned by ../astra-audit-r2/inventory.json.

Atlas: ../astra-fixture-output/characters/luffy/sheet.png
SHA256 67152fadd32053fb70ab5682b9dde97df94a4c9d818edf233a6d1caa061d2f6e
Metadata: ../astra-fixture-output/characters/luffy/anims.json
SHA256 17e1b30bba502d6508ffd37e99d5fbbb8e31ab40a1cc4fc0aab4f5e3f01d711c

Command recorded in inventory: node tools/pack-sprites.mjs --root art/characters/luffy/production/astra-fixture-input --out art/characters/luffy/production/astra-fixture-output --quantize 48 --no-writeback luffy. Fixture-only scaleGate warn renders held pixels after original strict mode refused output. 256px cells,16 columns,pivot[128,240],pixelsPerUnit128. Actual distinct nontransparent RGB colors independently counted:48. All23 animations/108 cells were inspected. The complete flag is diagnostic inventory coverage only.

Reference hashes: title neutral8e9da76421c52e5fa449ce55b2dba1933b52e74d15ccd4a69090b9f97eb082b1; title combat439678e0a9689edc3cc9686d51a65f9d546e2e68aae20760de8e7f4391a306e0; approved idle-f0a26d94992f0c3ee5fcff26cc043bc6ba797f432ea9def450d6f6afafd90e522d. Title cells were independently viewed against the actual title-style draft. Reference neutral/combat were composed at256/724 source density, not fitted independently to occupied bounds.

pixel-hashes.json contains every extracted final cell hash and loop/duration metadata. Exact cells and integer3x enlargements are saved here; no interpolation or new artwork. measurements.json records manual native-coordinate endpoints, projected lengths, ratios and uncertainty. Annotated *-landmarks.png images make readings reviewable: cyan shin, green torso, magenta sash, white other landmarks. No hidden joint was filled in automatically.

## Method and limits

Manual knee-center→ankle-above-sandal projected distance is the most useful visible scale anchor. Approximate endpoint reading uncertainty is±3px each; conservative segment uncertainty±6px. Sash-width uncertainty±4px; sandal-top→sole±3px. Torso uncertainty is±6px (±7–8px for tilted/partly obscured poses). They are visual reading limits, not confidence intervals. Ratios use idle f0 left shin52.8px. Posture changes projection; a shorter projected tucked shin is not evidence of a smaller bone. Null means unmeasurable, never a numeric pass.

Independent baseline: idle shin52.8px, neck-base→sash41.5px, sash25px, projected left forearm32.3px, sandal top→sole12.4px. Title combat shin54.6px and torso40.5px, sash27px. Title neutral shin59.1px, torso43.1px, sash25px. Neutral and combat differ in posture; win is compared to neutral as well as idle, not forced to crouched idle height. Boots/sandals and bent forearms are short projections with relatively large pixel uncertainty; they support the body reading rather than dominate a scale factor.

The main five regions were visually reviewed in every cell: hat/head and neck, torso/build, arms, legs, footwear/clothing. Precise numerical endpoints for every concealed region in every pose are impossible; the report deliberately combines available per-frame shin readings, additional torso/sash/forearm/sandal readings and visual continuity. There is no claimed exact five-segment certificate. For airHeavy's tucked/rotated middle frames and jumpUp's tuck, shin projection is not usable: torso, complete limb topology, vest/shorts volume and transition continuity support their qualified manual body-scale pass. This does not certify concealed lengths numerically.

## Per-strip findings

All listed ranges are native projected shin pixels, generally±6px. Coordinates and each-frame values are in measurements.json; they are not estimates from total occupied height or hat color.

| Version, every frame inspected | Body-scale decision and anatomy/sequence evidence |
|---|---|
| idle01 f0–7 | Reference. Shins52.8–53.2. Breathing and f7→f0 continuous; adult slim build, shorts and sandals stable. |
| run01 f0–7 | PASS, with accepted placement exceptions. Visible front shin40.5–55.8 varies with oblique running projection; upright-support frames47.8–55.8 agree. Torso/arm build and clothing remain coherent through both leg leads. f7→f0 changes leg extension but no gross body-size pop. Rear-foot loss f3/f4/f7 is the user-accepted21/32/16px clip, not an anatomy pass for missing pixels. |
| dash02 f0–1 | PASS. Front shin50.2/47.0; lean shortens torso projection without a body-size collapse. Complete limbs, coherent two-frame loop. |
| jumpUp01 f0–1 | PASS with projection limits. f0 shin46.9; f1 deeply tucked shin unmeasurable. Torso38.9/34.0 vs41.5±6, latter partly foreshortened. Head/vest/limb thickness remain coherent. Extension/tuck loop requires runtime timing review, not a redraw on head probe. |
| jumpFall03 f0–1 | PASS. Visible right shin50.2/52.4; whole body and clothing maintain size. Repeated descent pair coherent. |
| land01 f0–1 | PASS. Shins55.9/48.6. Deep-crouch torso projected28.3 is not comparable to upright; recovery torso36.8±6 consistent with idle41.5±6. Crouch→guard readable, complete fingers/limbs. No uniform upscale justified from hat-to-sole height. |
| light1 v02 f0–6 | PASS. Shins51.9–55.6 (ratios.983–1.053); torso about42px, sash26px, sandal11.2px. Entire sequence retains slim build, connected jab arm and consistent shorts/sandals. Recovery→idle plausible. Numeric head1.10 is not evidence against these pixels. |
| light2 v01 f0–6 | PASS. Shins50.1–60.8; maximum is oblique extension during windup, others53–57.3. Torso rotation/arm projection explain changes; no disconnected limb or body-scale pop. Recovery coherent. |
| light3 v02 f0–6 | PASS with accepted placement exception. Planted shin51.2–53.2 across all frames; raised leg bends then extends without torso/boot change. f3 toe/right8px clip is user accepted. Recovery remains body-consistent. |
| light4 v02 f0–7 | PASS with accepted placement exception. Planted shins46.0–54.6; partB f5–7 now matches partA body density. Rear-facing torso/hat projection intentionally changes through spin. f4 right29px foot clip is user accepted; f5 enters left margin4px. No remaining half-size partB. |
| heavy v01 f0–7 | PASS within relatively broad projection uncertainty. Shins41.2–49.1 with deepest crouch in f1–2; upright/recovery readings46.6–49.1 vsidle52.8±6 overlap. Torso f0 38.3±6, f5 35.0±7 vsidle41.5±6. Mild apparent smallness is not resolved outside combined uncertainty, and no disproportionate A/B body jump is visible. Raised-arm/hat turns differ; hat-only warning cannot require redraw. Final timed/contact review still needed. |
| airLight1 v01 f0–4 | PASS with accepted placement exception. Visible bent back-leg chain50.8–54.2; vest/shorts/neck remain coherent. f2/f3 fist/right15px crop user accepted. Crouched airborne foot projection not forced to standing sandal width. |
| airHeavy v01 f0–5 | PASS with stated occlusion limits. f0 torso38±6 and f5 torso46±8, recovery shin54.4. Middle tuck/dive shins not defensibly measured; complete limbs, bent knees, vest/shorts volume and arm chains remain visually coherent through sequence. No apparent scale jump established. This is the weakest numerical coverage among passes; do not quote a precise hidden-limb ratio. |
| guard01 f0–1 | PASS. Visible shin48.5/47.2; sash26px, crossed forearm about29–31px. Torso mostly occluded by crossed arms; no invented neck/belt chain. Hands/shoulders and legs keep consistent size; cover loop is coherent. |
| hurtHigh01 f0–2 | PASS. Shins49.9–52.2; recoil bends neck/back while retaining torso and arm/leg thickness. Complete figures and readable reaction progression. |
| launched01 f0–1 | HOLD: confirmed undersize. Left shins36.7/39.8 vsidle52.8±6 (ratios.696/.754), and torsos29.8/27.8 vs41.5±6. Right shins also read about38–42; all visible body regions are smaller, not just a tilted hat. Both frames need roughly1.3–1.45x calibration trial, independently validated against source landmarks; this is a screening range, not an approved factor. f0 left3px clip would worsen on naive enlargement. Recover anchor/cell fit with Claude before applying a scale. |
| down01 f0–1 | HOLD overall. Visible shins46.2/58.5 and body shape can fit reference projection, but f1 loses right9px and its floor contour is flagged7px. Preserve original pose. No blanket scale correction justified; Claude grounding/placement review required. |
| getup01 f0–4 | HOLD overall. Measurable shins47–57.8, recovery roughly idle-sized, but f0 loses left6/right7px and has floor warning8px. f3 support pose heavily foreshortens legs and prevents defensible stable joint reading. Body is broadly plausible, but no pass record until placement/grounding and low-confidence frame resolved. |
| charge01 f0–3 | PASS body scale. Shins57.7–58.6 within combined title/idle uncertainty; torso40.6±6, stable sash/shorts. Pink skin f2–3 is required Gear Second, not color drift. f3→f0 changes flush and pumping pose; this is an intentional activation loop, needs runtime review. |
| beamCharge01 f0–2 | PASS body scale. Shins53.5 all frames, torso40.5±6. Hand/forearm enlarges intentionally for Gear Third per KIT; do not compare swollen fist to ordinary idle hand size. Body remains coherent. f2→f0 inflation reset is move-cycle behavior, not ordinary breathing. |
| beamFire02 f0–2 | PASS body scale with Claude's arm-only placement exception. Shins55.5–55.9, torso39.6±6; torso, head, shorts and legs stay in cell. The giant arm goes right44/130px off cell in f1/f2, explicitly accepted by CALIBRATION.md because engine fist continues the lane. This is NOT approval of arbitrary body crop. Runtime giant-fist continuation/contact remains Claude's check. |
| special01 f0–7 | HOLD. f0–5 shins49.7–50.2 and body scale broadly match, but recovery f6/f7 is split: f6 cut body at right, f7 contains other half/left cut. No per-strip pass despite six coherent frames. Reassembly from intact source, no new call merely for probe. |
| win03 f0–3 | PASS. Shins52.9 each (1.003 of idle; neutral59.1±6 overlaps), torso48.3±6 vsneutral43.1±6, sash31±4 vsneutral25±4, forearm34.9±6, sandal10.2±3. Both arms raised changes upper silhouette; all four cells preserve adult slim build/legs and have intact hands. Cheer/laugh loop and f3→f0 are coherent. bodyHeight236 at pack factor.992 corrects the earlier uniform shrink; no height-only pass used. |

## Pass records and final repack

For each listed pass version, recommended scaleManualQA note:

"Astra manual audit of exact 48-color atlas67152fadd32053fb70ab5682b9dde97df94a4c9d818edf233a6d1caa061d2f6e, every frame inspected. Visible shin/torso/sash/forearm/sandal landmarks agree with approved idle/title cells within recorded endpoint/projection uncertainty; see production/manual-audit-r2/measurements.json and AUDIT.md for per-frame coordinates and limits. Occluded segments are not numeric passes. Placement/contact exceptions and static-only timing limits remain as listed. Not user approval."

Use a concise per-animation summary (shin range plus relevant torso/occlusion/clip note) and link this evidence. Do not encode the generic note without the strip's limitations. Do not write pass for launched/down/getup/special. Worker may repack final public output only within the parent's authorized scope, then compare exact cell hashes and request recheck on changed quantization/placement.

## Evidence limits and handoff

All108 actual quantized cells and first/last relationships were reviewed statically; loop flags/durations were read from metadata. No timed browser animation or live gameplay contact check was performed by this auditor. Parent's UI load/controls check is separate evidence. A one-shot last→first replay is not assumed to be a runtime looping animation. The remaining release checks are final public pixel identity, gameplay contact/grounding/giant-arm continuation and user approvals. No automatic palette/head reading was used to certify anatomy.

Main current instructions and goku-luffy inbox/relay mapping checked. Parent owns committing the handoff and ringing goku-luffy; this subagent does not ring.

## Final-public recheck status

Worker attempted a strict production repack after recording the18 manual results. It still rejected11 automatic probe flags and wrote no public atlas. Consequently no new public pixels exist for identity verification. The manual findings remain bound only to diagnostic sheet67152fadd32053fb70ab5682b9dde97df94a4c9d818edf233a6d1caa061d2f6e; the previous public atlas is not newly certified. Parent/Claude must reconcile gate recognition/rendering without misreporting strict success. No gate threshold, exemption or production tool was changed by this auditor.
