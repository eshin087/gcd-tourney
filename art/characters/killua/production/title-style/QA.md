# Killua title-style production trial — 2026-10-11

## Approved source and scope

The user approved `reference/title_style_draft_v01.png` and the shared-size pilot cells `neutral_v01.png` and `combat_v01.png`. The neutral occupies 82 x 186 px, with a 176 px body target. The combat stance occupies 148 x 145 px, including hair, at the same anatomical scale. These are the ground truth for this batch. The older 182/186 px standing targets and the rejected torso-redraw direction are not used as visual targets. Keep the original down/KO poses when later redrawing their appearance.

The title-style model is an approved visual reference; the new animations and UI below are candidates, not user-approved. Fixed-name model, idle and UI references were not replaced.

## Generation ledger

| Asset | Saved | Built-in attempts | Result |
|---|---|---:|---|
| idle Part A | `raw/_parts/idle_v04_A.png` | 3/3 | Best four-frame spacing, but f0 is shorter than the rest. |
| idle Part B | `raw/_parts/idle_v04_B.png` | 1/3 | Stitched v04; visible height pop, rejected as a working anchor. |
| idle Part B correction | `raw/_parts/idle_v05_B.png` | 2/3 | Improved source heights; Part A reused unchanged as `idle_v05_A.png`. Measured stitch factor 1.0144; post-stitch B/A head ratio 1.02. |
| guard | `raw/guard_v07.png` | 3/3 | First attempt differed by 50 raw px between poses; third attempt has identical 658 x 717 raw bounds for both. |
| portrait, cut-in, select | `raw/ui_portrait_v02.png`, `raw/ui_cutin_v03.png`, `raw/ui_select_v02.png` | 1/3 each | Candidate UI from approved title-style sheet. |

Historical Git filenames were checked before numbering: idle had v01–v03, guard v01–v06, portrait v01, cut-in v01–v02, select v01. No number was reused.

## Native-size comparison

The current mixed atlas was packed with `node tools/pack-sprites.mjs killua --quantize 48`. The packer reads idle v05 and guard v07. It reports 42 animations and 48 colors, but the other 40 animations are older art, so its 44 scale/baseline warnings are expected and this is not a clean cast-scale pass. The actual atlas cells were extracted from `public/characters/killua/sheet.png`; `frames/idle/` is stale under `--quantize` and was not used for this QA.

| Cell | Opaque bounds | Occupied size | Finding |
|---|---|---|---|
| Approved combat | x54–201, y96–240 | 148 x 145 | Approved pose-scale reference. |
| New idle f0 | x59–195, y101–240 | 137 x 140 | Same costume and broad pose; narrower than approved combat and 5 px shorter. |
| New idle f1–f7 | 132–136 wide, 144–146 high | — | Head/torso appearance is close, but 6 px height spread from f0 to peak is larger than the requested subtle breathing. Feet remain on y240. |
| New guard f0 | x62–189, y101–240 | 128 x 140 | Crossed-arm pose; a narrower silhouette is expected from the pose. |
| New guard f1 | x62–189, y102–240 | 128 x 139 | Same width and foot placement; no obvious size pop. Nearly static. |

Comparison image: `idle-v05-vs-approved-combat.png` (approved combat left; new idle f0 right). Guard contact image: `packed-guard-v07.png`. The apparent hair/head size is similar, but the idle f0 width and six-pixel loop height variation require closer anatomy and playback review before this idle can become the animation reference. A head-gate result alone would not establish torso and limb consistency. No numeric anatomy pass or exemption is claimed.

The trial `manifest.json` sets Killua `standingBodyPx` to 176, idle `bodyHeight` to 146 and guard `bodyHeight` to 140 to keep crouches below neutral height. These are provisional trial values. The old approved idle/UI files remain intact, and no later animation strip was generated from the provisional idle.

`npm run scale -- killua` produced `heads-trial.png` and reported 25 flagged strips in the mixed old/new atlas. `npm run lineup` produced `lineup-trial.png`; its build-band warning still assumes the older 182 px child baseline and cannot certify this user-approved title-style scale. The full strict scale gate and equal-depth game QA remain pending. Shared `art/scale` baseline/report outputs from this exploratory run are not production evidence.

`node tools/pack-sprites.mjs killua --quantize 48 --strict-scale` exited 1 and wrote no atlas: the existing older strips differ from the new provisional idle, with 33 failing animation names in the strict report. This is a genuine blocked gate, not an exemption request.

## Next technical gate

Correct idle f0 and confirm all eight frames at native size and in a loop against the approved neutral/combat cells. Recheck head, torso, limbs, foot position, facing and contact proportions. Then run strict pack, heads sheet, lineup and equal-depth game QA as the rest of the set is produced. The 3 UI candidates can receive final review independently.

## Additional user-authorized correction round
The user allowed three more targeted attempts. Root generated A and B (one call each) and a single f0 fix (third call). Stitched v06 uses measured B factor0.9899. Diagnostic-only pack: actual heights145,146,145,145,143,144,143,144; widths118–120 vs approved148. This reduced loop pop but introduced a visibly narrower stance and fails independent baseline comparison. Strict candidate pack refuses guard head0.92 against this new idle. No exemption or passing anchor is claimed. Single f0 fix01 returns closer approved pose geometry but cannot fix all seven remaining frames by itself; not assembled/approved. All three extra image calls are used. Continue holding full Killua production pending a passing baseline animation.

## Independent poses from the approved reference
Full Killua production resumed for independent poses using approved title_style_approved.png, an exact copy of the user-approved pilot. Held idle v06 is not an image input. First built-in attempt each: dash v05, jumpUp v05, jumpFall v05, hurtHigh v06, land v04, intro v04, taunt v04, win v04. All are candidates; none is approved or a final atlas pass.

An isolated art-only QA fixture uses the exact approved combat cell as a ONE-frame reference-only idle, not a generated or proposed animation. It does not alter production idle. Strict 48-color pack gives dash/jumpUp/jumpFall/hurtHigh/land/intro ok; taunt uniform1.07head/1.11feet and win head drift1.09. Approved neutral itself measures1.008 head/0.997 feet against this combat, confirming this is a useful reference control. The taunt auto-fit trial reduced standing height to172–173 vs approved186, so it is NOT promoted: numeric head pass alone does not establish anatomy. Win may include adjacent white cuffs but needs manual hair ROI verification; no exemption claimed.

Native source-to-atlas factors: dash0.217, jumpUp0.220, jumpFall0.218, hurtHigh0.235, land0.208, intro0.246. Trial bodyHeights122/148/165/150/132/186 respectively; these are pose-specific candidates, not standing-height inflation. Dash source equal-slot head movement is about9px but automatic foot centering produces46px; offsets[-18,0],[18,0] remove36px of the artificial shift without resizing anatomy. Loop verification pending. Diagnostic comparisons: movement-reference-comparison.png and standing-reference-comparison.png. Second image includes failed win and non-promoted auto-fit taunt: not a passing atlas.

Validation: real `node tools/pack-sprites.mjs killua --quantize 48` exits1 against held idle v06; dash,jumpUp,jumpFall,land,guard,hurtHigh,intro,taunt,win fail relative to that wrong anchor. It writes no character atlas. This is not overridden. Local Vite production build passes80modules. Diagnostic reference heads live in reference-scale/heads-killua.png; they include the non-promoted taunt autofit and failed win, explicitly not full-production evidence. Full heads/lineup/game loops remain pending.

## Controlled idle re-evaluation and second source batch
Independent second-agent visual review found v05 head, torso and limb anatomy consistent; silhouette narrowing comes mainly from stance. Re-measuring with the SAME approved-combat palette gives mean head0.990 and feet1.004 (ok), per-frame head0.955–1.004. Purple center torso band23–27px vs25px reference, approximately +/-2px clothing uncertainty. Native browser f7→f0 comparison shows a small pose bob/head pitch, not clear uniform anatomical shrink. Retain v05 as a PROVISIONAL working candidate; user motion review remains required. v06 is technically rejected and archived for narrowed stance; extra3 image calls exhausted. Previous bbox-only hold is superseded by this controlled evidence, not a new approval. See idle-v05-approved-reference-audit.json and idle-v05-seam-enlarged.png.

Second batch: backDash04, superDash06, jumpSquat05, down07, ko08, airLight1_06, airLight2_07, hurtLow06. Exact attempt counts/prompts in generation-ledger.json. Air attacks and superDash second attempts remove invented detached white effects/neck flaps. Reference-only warning-mode fixture yields11ok,3unmeasured,1uniform,1drift plus reference; this is NOT a production pass. Down/KO retain user-selected original poses and need contact adjudication; KO offset9px avoids left clipping without resizing. JumpSquat low confidence requires manual anatomy review. All loops/contact checks remain pending.

Real production re-pack after retaining idle v05 still exits1: dash,backDash,superDash,jumpSquat,jumpUp,jumpFall,land,airLight1,airLight2,hurtHigh,hurtLow,down,ko,intro. Many new strips pass the approved-combat control but measure smaller against idle-derived probe palette. This reference/probe discrepancy remains unresolved; no manifest exemption or relaxed gate applied. Packer also detects old hand-edited airLight1 frames shadowing newer source. Character atlas/frames not written; UI outputs may be written. Claude tooling QA should inspect the controlled audit versus idle-derived probe before declaring anatomical shrink.

Additional candidates: block07 (2 attempts; removed skid effect), charge11 (1), beamCharge08 (1). Reference control: block head1.061/feet1.291 HOLD, charge head1.077/feet1.037 HOLD (bristling hair may contribute), beamCharge head1.050/feet1.123 ok. These trial heights160/125/170 are candidate fits; no production gate or user approval claimed.

Killua packer follow-up for Claude: controlled approved-combat palette measures idle v05 mean head0.990/feet1.004, but idle-derived production reference rejects many independently reference-matching strips. Evidence: art/characters/killua/production/title-style/idle-v05-approved-reference-audit.json and reference-audit.json. Investigate palette/head-region segmentation before treating every difference as anatomy. No tool thresholds were changed. Old airLight1 hand-edited frames are preserved under frames/_old/airLight1_pre_title so they cannot shadow the new source.

Spin trial fit125→136 is a uniform measured correction: visible f0/f3 heads0.914/0.926 average0.920, reciprocal1.087; foot-color linear proxy0.847 also indicated small scale. Inverted-head automatic probes remain unreliable. This does not confer a manual pass; compare the corrected contact sheet before promotion.

Reaction/utility batch: launched05(2 calls, lifted feet above hips), spin04(1), airRecover05(1), stagger04(3, corrected sway/right-facing), throw06(1), vanish04(1), beamFire08(2, removed invented scarf). Native reference sheets examined. Throw reference head0.983/feet1.023 ok. AirRecover/vanish low-confidence, not passes; launched probe selects the wrong region in rotated poses, manual anatomy pending; stagger head1.095/feet1.351 is a real HOLD at neutral height186, not an exemption. Full production pack still pending and no candidate approved.

BeamFire145→127 trial uniform fit measured from head1.143 (reciprocal0.875); feet proxy1.329 points in the same direction but is already a square-root count ratio, not an area ratio; native torso/limbs must confirm the fit. Recheck contact before promotion.

Long-strip checkpoint: run08 A1/B3, motion HOLD (leg alternation remains unclear; B exhausted). light1_10 A2/B1 raises impact hand, measured B0.8612; light2_05 A1/B1 B0.8702; light3_05 A1/B1 B0.9259; heavy11 A2/B1 removes white trails, B0.8207. These ratios reflect source-size differences and do not alone certify torso/limbs. Getup07 third/final attempt reduces oversized head/shoes while retaining all five phases; v06 rejected and preserved. At trial158 final head1.000, all poses need manual low-confidence/foot review; no manual pass. Full QA/gate still pending.

## Independent probe finding for Claude (read-only second-agent audit)
The SAME packed v05 pixels measure head0.990/feet1.004 against approved combat: reference40x31, area739. Recomputing with v05-derived palette changes the reference to45x34, area905 (+12.5% width,+22% area), even though pixels are unchanged. V05-palette boxes43–45px wide,32–35px high; approved-palette boxes40–44wide,28–30high. Lavender/purple/white shades can connect hair into lower face/collar. This denominator/ROI shift plausibly explains ~0.9 production results. Independent bright-hair ROI: approved~41wide, v05~42, v06~46. Evidence supports keeping v05 provisionally and rejecting v06. DO NOT waive the gate globally. Claude should compare same-version probes using a controlled approved palette or declared hair/foot colors, inspect native anatomy, and resolve palette contamination in tooling/spec before treating0.9 as a redraw mandate. No code/threshold/exemption change made by Codex.

New checkpoint: light1 v11 A3/B2 stitched B0.8485; airLight3 v09 A1/B1 B0.8155; airHeavy v07 A1/B1 B0.9082; specialDown v05 and superPose v07 one call each. light4 v07 A segmentation3/5 HOLD; A retry2 underway as v08, preserving v07. Native aerial hammer has visible head/torso pop at impact/end; no pass. New sources remain unapproved and strict production gate pending.

light1 v11 correction overshot: measuredhead0.825 vs v10~1.096 at samebody165, shoes still1.346. Rejected v11 and preserved raw/parts; v10 is better but HOLD, A3 attempts exhausted/B2 used. Do not rename to reset. special v06 and specialForward v10 actual atlas show sliced hand fragments across cells despite source separation count; A2 source spacing correction underway. airHeavy v07 true head pop1.30/1.344 impact, A2 correction underway.

Checkpoint build passes80 modules. Production48-color pack fails; preserved previous atlas. Old hand-edited frames for airLight1/light2/light3/spin/throw/specialUp archived under frames/_old/*_pre_title to prevent shadowing the new raw sources. Light4v08 A2/B1 now segments5+3, but B factor0.7207 warning: B2 regeneration in progress. All42 source coverage does not mean accepted production quality.

Trial fits to inspect: airHeavy205->164 from unoccluded f2/f3/f5 head1.25/1.30/1.231; raised-arm f0/f1 falsely reduce visible hair width. No manual exemption yet. light4 180->166 from medianhead1.085; must recheck recovery stature/limbs, not automatic promotion. SuperPose08 head0.996 but feet proxy1.350: final footwear-only correction attempt3 underway.

RunA retry2 still near-leg-forward; retry3 repeats the same phase and changes hands to fists. Neither improves v08; kept only best v08. Total runA3/B3 exhausted, motion HOLD persists. SuperPose09 third/final footwear edit saved for comparison; head08 already matched, feet still need native check.

Down07/KO08 compared directly to down01/KO02: original oblique poses preserved. A single horizontal ground-band criterion belongs to rejected side-on direction and is not a redraw mandate. Claude should verify in-game grounding plus anatomy; source style still candidate. SuperPose09 rejected because feet1.448 worsened vs08 1.350; both actual atlas and head metrics retained, no further generation budget. Trial light2 180->160 from head1.125; heavy198->214 from head0.925; specialForward175->139 from head1.258. Independently inspect posed body/stature, no promotion by ratios alone.

Revisit light1v10 whole-figure fit165->151: head1.096 reciprocal0.912; feet proxy1.350 points in the same direction but can include matching colors outside shoes; native anatomy, not an extra square root, must confirm uniform fit. Earlier hold based on matching end bbox height alone was insufficient: recovery crouch differs from neutral. Trial needs independent torso/limb/loop check; no pass claimed.

Latest recovery corrections: light2v06 A1/B2 measured B0.8117 (after0.983), light4v10 A2/B3 measured B0.6863 (after1.011). Final poses now use the approved wide low combat stance. Light4 large source-part scale warning remains; B budget exhausted. All strips are unapproved and native anatomy/motion review remains required.

Existing declared-hair-color experiment is NOT promoted: probe-color-experiment.json compares the exact same atlas bytes (SHA25699751f209cd3c8334c884b9387491b48073a0f4324042f7a7ce5129261527533). Automatic idle reference45x34.5/974.5area changes to40.5x29.5/733area with a four-color approved-hair list, close to approved40x31/739. Several false undersize results clear, but omitted dark hair shadows create new false pops (light1~0.699, airLight2~0.752). This is evidence of probe sensitivity, NOT a safe final configuration. Real builds.json, tool thresholds and exemptions unchanged. Claude tooling investigation remains open.

Native corrected contacts inspected: light1v10 at151, light2v06 at160, light4v10 at166 and heavy11 at214 are closer to the approved head/body scale. This is a visual comparison, not formal production-gate approval. Special07 hand fragments are resolved. SpecialForward12 source A has intact fingers, but the x projections of f2 extended hand and f3 rear shoe overlap without touching in 2D; vertical stitching cuts off the hand and places it in the next frame. This is an assembly/tooling HOLD for Claude, not proof that another source redraw is needed. AirHeavy08 raised-arm head boxes omit occluded hair; remaining manual native geometry review required.

Four version-scoped manual pose-scale reviews recorded for jumpSquat05, spin04, airRecover05 and vanish04. See MANUAL_POSE_QA.md for observed native anatomy, controlled metrics and exact probe limitation. These are manual checks, not numerical passes or image approval. Other low-confidence strips remain held.

Measured whole-figure fit trials: block160->151 from approved-control head1.061 (reciprocal0.943); feet proxy1.291 also indicates excess scale. specialUp215->197 from head1.091 (reciprocal0.917); feet proxy1.151 supports a whole-figure mismatch. Native torso/limb/contact review is required before retaining these fits. No standing neutral target or source image changed.

Retained measured block151 and specialUp197 fits after native all-frame contact review: control blockhead1.015/feet1.227, specialUphead0.993/feet1.068; head, torso and bent limb shapes read closer to approved anatomy without enlarging crouches. Footwear/contact and final animation review remain pending. Updated control totals26ok/8unmeasured/6flagged, not a full production pass.

Measurement correction: earlier notes incorrectly described feet ratios as area ratios. tools/scale-probe.mjs reports sqrt(shoe-color pixel count / reference count), already a linear proxy, and counts matching colors anywhere in the frame. Values such as1.350 are NOT direct footwear measurements. They can be affected by clothing/cuff colors and pose occlusion. Earlier footwear holds remain unresolved observations, not proven shoe-size failures; no further regeneration solely to chase this proxy. Fits above were derived from head ratios and rechecked visually, not from the incorrect extra square root.

Native footwear evidence supersedes the earlier physical-oversize claim: footwear-native-3x.png and footwear-width-check.json compare the bottom foot band at one scale. Approved neutral left/right widths20/31px, superPose18/28, stagger20/31, taunt21/32, block17/30, intro18/30 (about +/-2px from pose/ankle inclusion). There is no demonstrated35% shoe enlargement in superPose or stagger. Keep probe/head/motion review separate; do not regenerate on the foot-color proxy alone. head-native-3x.png shows equally enlarged head crops for independent review. Added guard07 to the diagnostic inventory so the workbench covers all41 non-idle animations; idle05 has its separate page.

Independent read-only peer review (Gojo worker) agrees: airHeavy raised-arm occlusion, charge bristled hair, stagger slightly wider hair, taunt hand/hair overlap and win sleeve/cuff proximity prevent treating these as uniform body errors. Actual footwear widths confirm no shoe-redraw basis. SpecialDown has the strongest possible true hair-mass expansion, especially f2; targeted second generation is reducing only excess hair volume, preserving face/body/poses. These six checks are not waived, and no numeric pass is claimed for a manual hold.

Final specialDown07 hair-only correction (third cumulative call) retains face/body/limb geometry. Raw tallest envelope621->587, measured bodyHeight179.597 preserves the original body scale. Controlled reference head1.010, frames1.00/1.02/1.05/1.00; native all-frame comparison improved the excessive hair. V06 preserved as technical rejection. Foot-color proxy remains contaminated; this is not a full production pass or user approval.

Independent peer anatomy check of light1, light2, light4, heavy, block and specialUp found coherent torso/limb thickness and no demonstrated uniform scale drift. Different crouch/airborne envelopes are legitimate pose changes. Light1 f3->f4 and light2 f3->f4 have abrupt strike-to-recovery changes requiring runtime timing QA. No cell clipping in these sheets. No further redraw is justified solely by their current static anatomy.

Latest full production check after specialDown07: exit1,32 listed animation failures (production-pack-checkpoint.txt); character atlas not written. Diagnostic28ok/8unmeasured/5flagged excludes idle reference. Separate UI outputs are still written by the packer on character-gate failure; do not interpret UI output as a successful atlas. Build passes80modules.
