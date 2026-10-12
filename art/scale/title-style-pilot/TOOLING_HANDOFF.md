# Title-style art tooling handoff for Claude

Latest review checkpoints: Naruto04a3d8c (PR69), Killua4ec4337 (PR70), Gojo dc68a1c (PR72). Sasuke3822049 (PR71) completes its bounded correction round. Its strict pack passes with 33 new candidates and 9 older fallbacks; the diagnostic player includes held source attempts. All animation/UI candidates remain unapproved. Earlier checkpoint links below are retained as evidence history; use the newest link for each fighter.

These are reproducible technical holds, not image approvals or requests to merge incomplete art. Claude alone owns tooling, integration and production.

## Killua reference palette changes the measurement denominator

Branch art/killua-title-production, source checkpoint280a010, worktree .worktrees/art-killua-title-production. Run node tools/pack-sprites.mjs killua --quantize48 (use separate arguments: --quantize 48); it fails and preserves the previous character atlas. Controlled evidence lives in art/characters/killua/production/title-style/idle-v05-approved-reference-audit.json, probe-color-experiment.json and QA.md. The same v05 packed pixels read head0.990/feet1.004 with the approved combat reference palette, versus an inflated idle-derived head region that includes face/collar. The experimental declared-hair-color list shifts the denominator toward the approved value but misses shadows and introduces other false pops, so it was not promoted.

Use same-version, same-pixel native comparisons. Do not lower thresholds or add a blanket exemption. Fix or configure region measurement only with evidence, then rerun every candidate against the approved baseline, inspecting torso and limbs independently.

## Complete source figures get sliced during stitching

Killua raw/_parts/specialForward_v12_A.png contains four intact figures. Pose2 hand extends to~1128 while pose3 rear shoe begins~1082 at a different vertical region. The vertical-projection stitch splits that hand and places it in the next frame. Review raw/specialForward_v12.png and production/title-style/contact-specialForward.png. All A/B image budgets are exhausted; preserve the source. A 2D component separator or explicit per-pose mask may be more appropriate than more generation.

Naruto has the same class of hold: light2v06 Part A has four distinct opaque figures, confirmed by its worker, but stitch returns3 automatically or5 with4,3 forced counts. See that character branch QA and preserved source parts.

## Review and release boundaries

The native diagnostic workbench is a separate output from the currently packed game atlas. Killua preview at checkpoint280a010: https://gcd-tourney-8m9zjk59l-eshin087s-projects.vercel.app/reviews/killua-title-production/animations.html . The full pack fails; do not treat source coverage or application build success as a final art gate. Original down/KO pose direction remains authoritative. Formal runtime contacts/hurtboxes and grounded/fallen playback are Claude QA after art assembly is correct.

## Manual measured stitch factor is rejected before it can be used

Naruto specialUpv04 source has4+2 complete poses. Its worker measured first-head golden-hair widths A90px/B130px (about2px uncertainty) and supplied --factor0.692 with a written reason. tools/stitch-parts.mjs aborts on no detected PartA head before honoring the manual factor (around line140 in the worker checkout). See preserved parts and exact command/error in the Naruto branch. No tool patch or additional image call was used to disguise this assembly blocker.

Additional reproductions from Naruto production: specialForward A/B sources also abort on no detected PartA head when raised hands occlude the probe. Special v07 assembles with forced3+5 counts but the f5 right palm becomes detached after vertical cuts; its source PartB palm is connected. Inspect the raw parts before spending another generation call.

## Foot-color ratio is not a shoe-size measurement

The scale probe returns sqrt(matching shoe-color pixel count/reference count), already a linear proxy. It counts matching colors anywhere in a frame. Purple clothing, white cuffs and pose occlusion affect Killua's result. Native fixed-scale shoe widths disprove the earlier inference that a1.35 proxy proves35% larger shoes: approved neutral20/31px left/right versus superPose18/28 and stagger20/31 (about2px pose/ankle uncertainty). Evidence is in Killua production/title-style/footwear-native-3x.png and footwear-width-check.json. Do not apply another square root, resize shoes to chase this proxy, or infer anatomy from a color-count pass.

## Source coverage and integration status

Killua local f00b253 has42 assembled candidates and3UI; full production pack still exits1 on32 animations. Approved-reference diagnostic comparison28ok/8unmeasured/5flagged does not override the gate. SpecialDown07 hair-only correction improves its controlled head ratio to1.010 while preserving body scale. Four low-confidence poses have individually documented manual scale QA; all other holds stay explicit.

Gojo local dc68a1c has42 candidates and3UI, but strict pack retains10 holds. Native review: https://gcd-tourney-l6ciloo1x-eshin087s-projects.vercel.app/qa-gojo/ . Run's repeated lead leg is a motion problem, not clipping (f7 has45px right margin). Do not merge either WIP branch because sources exist or a preview builds.

## Independent native QA, final peer pass

Killua launched/getup/down/KO retain manual holds. Two reviewers found no clear disconnected anatomy or cell clipping; foreshortening/occlusion prevent a confident all-frame anatomical measurement. Getup f1 inverted->f2 rising is an abrupt orientation change to inspect at runtime. Down f0 bboxx61-248 and f1x40-235, KOx5-208: these are inside the cell, not clipped. Preserve the original oblique poses; do not force side-on redraws to satisfy an outdated floor-band rule.

The six measured Killua fits (light1/light2/light4/heavy/block/specialUp) independently retain coherent head-to-torso ratio, limb thickness and build. Light1/light2 strike-to-recovery changes are abrupt but not proven scale errors. All remain candidates; static anatomy agreement does not approve timing, contacts or the full pack.

Current Killua committed native review (c54361f): https://gcd-tourney-8q7xuomgx-eshin087s-projects.vercel.app/reviews/killua-title-production/animations.html . Browser verified41 non-idle options, current specialDown07, packed-duration and slow playback controls, pause/step, canvas output and no console errors.

Naruto's final targeted within-budget corrections also hit this same no-head assembly blocker: `npm.cmd run stitch -- naruto airLight3 v07` and `npm.cmd run stitch -- naruto airHeavy v09`. New airLight3 A/B sources reduce excess head size while preserving body; new airHeavy A/B sources separate previously duplicated phases. The sources are saved, but no assembled correction or passing atlas is claimed. Inspect exact latest raw parts and worker QA before treating older diagnostic playback as the corrected version.

Gojo latest preview dc68a1c was also rechecked in-browser: all42 choices, held-run warning accurately states repeated lead leg rather than clipping, frame controls and all3 UI figures are present, no console errors. This is review-page verification, not gameplay/contact approval.

Naruto local880719f / PR69 remote d234f18: https://gcd-tourney-gylq55k1q-eshin087s-projects.vercel.app/art-review/title-style-production/naruto-native/ . Root browser check confirmed42 selectors, packed durations/pause/frame step, approved reference anchors, explicit airHeavy08 playback versus corrected source-only09 with A/B links, new portrait02 source link and no console errors. Full candidate approval and production pack remain incomplete.

Killua final review-gallery checkpoint4ec4337 supersedes the earlier preview: https://gcd-tourney-ao6niydpj-eshin087s-projects.vercel.app/reviews/killua-title-production/animations.html . Browser verified41 choices and all3 newly fitted UI candidates load at96x96/480x128/384x384 with no errors. These use versioned raw portrait02/cutin03/select02 only in a diagnostic fixture; official fixed-name UI was not changed.

Naruto normal strict check at880719f names9 failures: jumpUp, airLight3 (older assembled06; improved07 is source-only), launched, spin, airRecover, down, beamFire, ko, specialDown. These are gate outcomes, not9 confirmed drawing defects. Original down/KO floor contours require Claude runtime grounding. Land/launched/spin/airRecover/taunt footwear concerns combine native visual uncertainty and palette-dependent probes; no established shoe-geometry failure should be inferred from those ratios alone. Confirmed open issues include idle6px seam, run phase/anatomy mismatch, older airLight3 clipping and older airHeavy repeated phases; the newest corrected aerial sources still need safe assembly.

Naruto final UI checkpoint04a3d8c / PR69 export0e89276 supersedes880719f: https://gcd-tourney-5yl11mwjm-eshin087s-projects.vercel.app/art-review/title-style-production/naruto-native/ . Root verified all42 choices and all3 fitted UI images at96x96/480x128/384x384, anchors and no console errors. Mixed diagnostic still plays historical light1v02, specialv03, specialForwardv02, specialUpv01, clearly labelled; corrected aerial07/09 source parts are linked while older assembled versions play. No full-new-set pass.

Sasuke final corrected review player: https://gcd-tourney-4o9c0q48t-eshin087s-projects.vercel.app/art-review/title-production/sasuke-candidate/index.html . Diagnostic atlas uses35 title-style sources including held throw05/stagger06 and7 older fallbacks: launched, down, ko, spin, airRecover, specialUp, superPose. Ordinary strict atlas uses33 new candidates and9 fallbacks (also throw/stagger). Player includes pause and previous/next frame controls; no full-new-set pass or approval is claimed.
