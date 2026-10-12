# Approved title-style production contract

Approved by the user 2026-10-11: all four title_style_draft_v01 sheets and their displayed neutral/combat lineups. This is the current visual contract for this batch, superseding the rejected cast-proportion redraw. These are approved visual relationships, not a claim of exact canon anthropometry.

| Fighter | Neutral occupied bounds incl. hair | Pre-common-fit body target |
|---|---|---|
| Naruto | 94 x 205 px | 195 px |
| Sasuke | 90 x 209 px | 197 px |
| Killua | 82 x 186 px | 176 px |
| Gojo | 91 x 236 px | 222 px |

Exact neutral/combat cells in public/art-review/title-style-pilot are ground truth. Source crown landmarks have +/-12 source-pixel uncertainty. compose.mjs and measurements.json record the one common236/238 fit and per-source scaling. Preserve each fighter's head, torso, limb lengths and clothing volume from these images. No additional child discounts, shoulder inflation, tall-character caps or universal head ratio. The same anatomical scale applies to every pose; never fit a crouch, run or fallen pose to standing height.

Produce all42 canonical animations and3UI per fighter. First independently compare generated idle and guard with the approved neutral/combat samples at native size and equal depth before the remaining strips. Working idle is provisional until user final review. User specifically chose: preserve original down/KO poses, match the new style. Do not restore rejected torso-redraw poses.

Every new image remains a versioned candidate. Preserve history including filenames removed by rollback; inspect Git history before numbering. Up to3attempts perimage. Inspect every frame and loop for head, torso, limbs and pose consistency; a passing head probe alone is insufficient. Strict pack plus heads sheet and lineup required. Unmeasured probes are not passes. No exemption merely to hide anatomy failures. Claude owns tooling corrections and runtime contact/hurtbox checks.

Claude alone integrates, merges main, and deploys production. Workers may publish committed previews. Original game stays live until the new set is reviewed and integrated.
