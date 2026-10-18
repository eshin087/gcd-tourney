# Astra audit v03: Naruto beamCharge v12

Date: 2026-10-18 UTC. Auditor: GPT-6 Astra, medium. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-naruto-skills`, branch `art/naruto-skills`.

**HOLD.** Frame 2 contains a detached extra tail fragment and a straight horizontal patch join. This is not a final anatomy/scale pass. beamCharge v12 remains unapproved. The coordinator reports the user's approval via Claude for beamFire v14 and ui_ult_fg v04; this narrow audit does not revisit those decisions. fourTailsRoar v02 remains unapproved and outside this audit.

## Scope and direct evidence

Inspected all three raw v12 frames, all three raw v11 frames, the approved `public/art-review/title-style-pilot/naruto-neutral_v01.png` and `naruto-combat_v01.png`, the production contract, SKILLS_REVAMP brief and ASTRA_AUDIT_v01/v02. Inspected a native-resolution f2 crop spanning local x0..559/y80..449. Computed direct pixel differences and foreground components with Pillow; no image-generation calls, source-image edits, manifest edits, exemptions, packing or builds were performed. Only this audit record was added by this task.

Both source strips are 2172 x 724, split into three 724 x 724 frames. Coordinates below are zero-based frame-local source pixels, inclusive. Foreground measurements exclude near-magenta (R>200, B>200, G<80); these are silhouette measurements, not anatomical lengths.

| Frame | v12 occupied bounds | Changed pixels vs v11 | Changed bounding rectangle | Visual result |
|---|---|---|---|---|
| f0 | x41..690, y96..658 | 144107 | x0..499, y0..409 | Four connected tail tips, two ears, four connected limbs; no obvious detached fragment. |
| f1 | x41..691, y96..656 | 0 | None | Exact pixel identity with v11 f1; four connected tail tips and intact figure. |
| f2 | x41..691, y96..658 | 144184 | x0..499, y0..409 | Four connected tail tips PLUS an isolated tail-shaped remnant; straight horizontal join near y409/410. |

The changed rectangles include background pixels; their pixel counts do not measure the changed anatomy area. Every pixel outside those rectangles is unchanged from v11. In particular, lower body/limb geometry below y409 is unchanged. This is direct recomputation rather than reliance on the coordinator's earlier equality report.

## Tail/fan and seam findings

The old x400 vertical join through the tall tail is no longer apparent in the replacement fan. However, v12 does not clear the seam hold: f2 retains a separate old-tail fragment at **x500..534, y173..305**. Four-neighbor foreground connectivity yields a 3283-pixel isolated component there, separate from the main 157132-pixel figure component. The fragment's left boundary is straight at x500, exactly at the replacement rectangle's edge. It reads as a fifth, severed tail tip above the ears. This is a high-confidence raw defect, not an ambiguous overlap.

At f2's lower-left fan, a straight horizontal cut around y409/410 interrupts the curved contour and internal shading, visibly around x160..330 (visual span approximate, +/-10 source px). The native crop confirms it. Thus the earlier vertical patch discontinuity was replaced by a larger patch with residual exterior material and a lower-edge discontinuity. f0/f1 have four connected tips; that does not rescue f2 or establish a seamless f2 -> f0 loop. Static sequence inspection shows the fragment appearing only in f2. No playback smoothness pass is claimed.

## Anatomy and title-reference comparison

All three frames retain two ears, an open white roar mouth, complete crimson-black engulfment, a connected trunk, two forelimbs and two hindlimbs. No human hair, headband, skin, clothing or sandals is visible. The head, trunk and limbs are visually stable across the three frames. Near shoulder, bent elbow, wrist/claws and rear bent limb chains remain readable; the far limbs overlap, limiting measurements. No obvious new extra or severed limb was found.

The human neutral/combat reference cells show a slender underlying build partly concealed by clothing. The candidate's exposed deltoids and thighs read substantially muscled, as prior audits noted. This qualitative difference remains unresolved as an underlying-build comparison: shroud rendering, crouch, perspective and overlap prevent reliable raw-to-reference length or volume certification. The fan repair supplies no skull calibration sidecar or equal-density packed evidence.

Reference landmarks from the prior audit remain useful only as uncertain reference estimates: neutral skull crown-to-chin 27 +/-4 px; combat 25 +/-4 px; combat shoulder-to-hip 41 +/-7 px. Direct reference inspection is consistent with these estimates. They are not new precise anthropometry. The earlier B1 29-31 +/-4 px open-jaw and 39 +/-8 px torso estimates belonged to the v10 partial atlas and must not be relabeled as v12 measurements. Ears and open lower jaw cannot substitute for a closed human skull, and clawed feet cannot supply a footwear measurement. No +/-6% or other numeric anatomy pass is supportable here.

## Remaining holds and handoff

Correct or explicitly resolve the f2 isolated fragment and horizontal join before claiming the patch seam fixed. Preserve v12 as history. The actual newly quantized v12 atlas, version binding, packed idle/reference comparison, skull/torso/arm/leg/build measurements with uncertainty, all frame transitions and Claude's contact checks remain pending. An older partial atlas cannot certify this candidate. User image approval remains separate and has not been supplied for v12. No automatic exemption or manual scale override is recommended.

## Exact SHA-256 evidence

| File | SHA-256 |
|---|---|
| art/characters/naruto/raw/beamCharge_v12.png | 29ecc8694d78b152d0cb0ff8a86a76a38a970f121b60a70392eee0e1dbc05d10 |
| art/characters/naruto/raw/beamCharge_v11.png | 9a739a0b8a860c05e1099e739ea11b4757562a39a3fb8cc6491febad35ee8317 |
| public/art-review/title-style-pilot/naruto-neutral_v01.png | acfd7240f9ee7fbe71c1b6c50ea8a269ceedeb05de44b929850ca8de06a0610f |
| public/art-review/title-style-pilot/naruto-combat_v01.png | cdc6ff9838bbae102301b738ef7596be3b2cc8ecb6f24c98d27c02a0bb479751 |
