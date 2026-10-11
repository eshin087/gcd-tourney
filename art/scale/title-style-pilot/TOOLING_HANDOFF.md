# Title-style art tooling handoff for Claude

These are reproducible technical holds, not image approvals or requests to merge incomplete art. Claude alone owns tooling, integration and production.

## Killua reference palette changes the measurement denominator

Branch art/killua-title-production, source checkpoint280a010, worktree .worktrees/art-killua-title-production. Run node tools/pack-sprites.mjs killua --quantize48 (use separate arguments: --quantize 48); it fails and preserves the previous character atlas. Controlled evidence lives in art/characters/killua/production/title-style/idle-v05-approved-reference-audit.json, probe-color-experiment.json and QA.md. The same v05 packed pixels read head0.990/feet1.004 with the approved combat reference palette, versus an inflated idle-derived head region that includes face/collar. The experimental declared-hair-color list shifts the denominator toward the approved value but misses shadows and introduces other false pops, so it was not promoted.

Use same-version, same-pixel native comparisons. Do not lower thresholds or add a blanket exemption. Fix or configure region measurement only with evidence, then rerun every candidate against the approved baseline, inspecting torso and limbs independently.

## Complete source figures get sliced during stitching

Killua raw/_parts/specialForward_v12_A.png contains four intact figures. Pose2 hand extends to~1128 while pose3 rear shoe begins~1082 at a different vertical region. The vertical-projection stitch splits that hand and places it in the next frame. Review raw/specialForward_v12.png and production/title-style/contact-specialForward.png. All A/B image budgets are exhausted; preserve the source. A 2D component separator or explicit per-pose mask may be more appropriate than more generation.

Naruto has the same class of hold: light2v06 Part A has four distinct opaque figures, confirmed by its worker, but stitch returns3 automatically or5 with4,3 forced counts. See that character branch QA and preserved source parts.

## Review and release boundaries

The native diagnostic workbench is a separate output from the currently packed game atlas. Killua preview at checkpoint280a010: https://gcd-tourney-8m9zjk59l-eshin087s-projects.vercel.app/reviews/killua-title-production/animations.html . The full pack fails; do not treat source coverage or application build success as a final art gate. Original down/KO pose direction remains authoritative. Formal runtime contacts/hurtboxes and grounded/fallen playback are Claude QA after art assembly is correct.
