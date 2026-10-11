# Cast proportion sample checkpoint

User direction, 2026-10-11: before the full frame audit or redraw, provide quick samples from multiple angles. Full production is paused for this review.

Confirmed references: title-screen Naruto/Killua visual relationship; Naruto guard/block and spot dodge head proportions; approved broader Gojo model v06. Preserve character identity and separate build, head proportion and whole-body scale.

Gallery: `/art-review/cast-scale-samples/index.html`. Static samples are QA composites of existing images, not new generated art candidates. No approvals changed. Sources use local main snapshot `1bb2d948c212ffd4594b6fa400b6ef320bd7d9a4`. All four deployed `sheet.png` and `anims.json` SHA256 values matched the worktree on 2026-10-11; see the gallery's `source-hashes.json`.

Naruto and Sasuke model v03/v02 approvals are already in main; their gameplay still uses earlier idles. Gojo v06 model is approved, but broader gameplay build is pending. Killua model v01 remains the approved reference. Pending Naruto idle v04 and Sasuke idle v03/v04 are explicitly separate, unapproved comparisons.

Naruto spot dodge maps to `vanish` in `src/game/fighter.js`. The quick head panel uses idle f0, guard f0, block f0 and upright vanish f1, equally enlarged 64x64 pixel windows. These crops locate visible heads without claiming an anatomical measurement. Agent sample boards include additional frames.

Preliminary observations: Naruto guard/block/dodge read with smaller heads than current idle; pending v04 does not establish a corrected target. Gojo's current gameplay build reads narrower than the teens. Killua charge reads oversized and heavy recovery changes scale. Pose/occlusion and hair movement are not automatically errors. Title-art poses and perspective cannot establish a precise standing-height ratio.

Next checkpoint: user chooses preferred Naruto head and confirms Gojo's 3/4 build. Then create a small versioned redraw sample before propagating across all 42 animations. The exhaustive audit is not complete. No engine/tooling fixes, main writes or production deployments are part of this branch.
