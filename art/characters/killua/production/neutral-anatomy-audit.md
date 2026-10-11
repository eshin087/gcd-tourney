# Neutral anatomy audit — 2026-10-11

All 42 animation sources are drawn, but source completion is not QA completion. No new strip is approved or ready for integration.

## Anchor correction

The art lead independently confirmed real torso/lower-leg compression and relatively enlarged hair in idle v02. Its head-only calibration is insufficient; do not use it as proof of matching anatomy. The v02 sources remain immutable.

Idle v03 A was drawn directly from the approved neutral, preserving long torso/shins and narrowing the stance. The art lead independently reviewed it as a materially improved candidate anchor, subject to numerical checks and B continuity. This is not user approval. A used two generation attempts total; B used three total including v02's rejected initial output. Both saved parts and the stitched v03 remain unapproved.

See `idle-landmark-board.png`: first-frame raw sources with source-y rulers, not production rescaling. The neutral has skull crown 176±10, chin298±5, soles1099. Candidate v03 A f0 crown approximately110±8, chin188±5, soles711. Thus skull-to-chin78±10, crown-to-sole601±8; reference ratio923/122=7.57 versus candidate601/78=7.71. The visual hair width relative to skeleton is about155/601=.258 versus neutral230/923=.249, within about4%; v02's approximately175/550=.318 was materially enlarged. Hair width and hidden skull estimates are uncertain, not exact segmentation measurements.

Approximate visible landmark comparison (source y, ±10–15px where clothing hides joints): neutral shoulder350, hip625, knee815, ankle975; v03 A shoulder230, hip402, knee518, ankle636. Normalized by estimated skull length, shoulder–hip2.25 vs2.21, hip–knee1.56 vs1.49, knee–ankle1.31 vs1.51. The knee/hip locations under clothing and slight bent-leg projection account for some uncertainty; retain those caveats. Check both legs and all frames before final endorsement.

## Whole-pack diagnostic before calibration

`full-redraw-pack-before-calibration.log` used main's packer with explicit worktree root/output and quantize48; it failed, with no new character atlas written. New failures: run,dash,backDash,land,airLight3,airHeavy,block,charge,beamFire,specialForward,specialUp. These are uncalibrated pose-bounds import results, not blanket evidence that every source is wrongly drawn. Clipping and getup floor-contact warnings are also recorded. Legacy manual frames cached light2/light3/spin; those folders were preserved in `legacy-frame-cache/` so final import can use new raws. No public output was patched by hand.

## Outstanding work

Audit all 175 candidate poses directly against approved neutral and corrected idle v03, with explicit per-frame skull/limb landmarks, uncertain rotated-head cases, and source attempt limits. Quarantine real proportional drift; do not fit heads to conceal short limbs. Then pack, inspect heads/lineup and in-game ground contact. Current 42 raw entries are not a review-ready batch.
