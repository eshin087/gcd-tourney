# Goku run v10 registration recheck

GPT-6 Astra (medium), read-only exact-atlas recheck, 2026-11-09. The user approved the drawing via Claude relay audit2 #8, quote **"Approve both"**. This recheck concerns the later registration-offset fix only; it does not change or extend that image approval.

## Result

| Strip | Disposition | Finding |
|---|---|---|
| B8 run v10 | **PASS: registration hold cleared; anatomy and visible scale remain acceptable** | The eight-frame torso/hip-region band centroids span 1.46 px around target x124 in the supplied quantized atlas. Manual comparison to approved idle f0 and title neutral/combat cells shows consistent head, torso, limb, clothing and footwear scale across the run poses. |

Claude may record this manual QA object in its manifest:

```json
{
  "version": 10,
  "result": "pass",
  "by": "GPT-6 Astra (medium), read-only exact-atlas recheck 2026-11-09",
  "note": "PASS after Claude's registration fix. In the exact supplied quantized production atlas, the opaque-pixel x centroid of each frame's 45%-62% torso/hip-region band is 123.19-124.65 (1.46 px total spread; target 124). All eight cells are contained. Manual comparison at a common 256 px cell density with approved idle f0 and title neutral/combat finds head, torso, limb, gi and boot proportions coherent; the corrected metadata changes position only, and packScale remains 0.92. Goku's automatic head probe is disabled and was not used as evidence. Static art QA only; runtime root/contact and hit/hurtbox behavior remain Claude-owned.",
  "evidence": "art/characters/goku/production/size-r8-b8-b11/ASTRA_RUN_V10_RECHECK.md; public/reviews/size-r8-audit2-goku-run-recheck/run-v10-registration-metrics.json; public/reviews/size-r8-audit2-goku-run-recheck/run-v10-exact-atlas-and-reference-cells.png; public/reviews/size-r8-audit2-goku-run-recheck/run-v10-hip-band-registration-guide.png",
  "atlasSha256": "145de80c6e48d1d85b0375474baa2a181795ef08790a99d8f05ed292d93c2d95"
}
```

## Exact target and method

- Claude supplied worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-size-r8-b3`; branch `art/size-r8-b3`, commit `1cab54a9a` as reported in relay #10. The target `.git` metadata was not readable from this worktree, so that branch/commit identity is reported from Claude's message rather than independently verified.
- The supplied `public/characters/goku/sheet.png` hash was independently verified as `145de80c6e48d1d85b0375474baa2a181795ef08790a99d8f05ed292d93c2d95`. The matching `anims.json` hash is `ef2fc347a7f95ad203cdb6000ee3a33a3f00182fc3de461299dde78209175bca`.
- Metadata maps run v10 to cells 8-15, eight 60 ms frames, looped; `packScale` is 0.92. The supplied raw offset metadata hash is `58bf1524c32593a658f2f90f75098c5ba092a3dac41ee369ea62e087b4894da8`.
- I inspected the exact quantized run cells beside approved runtime idle f0 and the approved title-style neutral/combat reference cells, each at 256 x 256 pixels. The evidence boards extract the supplied atlas cells; they are not cached frames or a repack.
- For registration, I measured the opaque-pixel x centroid in the 45%-62% vertical band of each cell's alpha bounding box. Per-frame bounds, band rows and centroids are recorded in `public/reviews/size-r8-audit2-goku-run-recheck/run-v10-registration-metrics.json`. The measured centers are 123.62, 123.97, 124.26, 123.19, 123.79, 123.93, 124.65 and 124.16; range 123.19-124.65, spread 1.46 px, maximum deviation from x124 is 0.81 px.
- The run frames contain 46 distinct opaque RGB colors after quantization.
- This broad-band centroid corroborates the requested registration target but is not a fitted hip-joint landmark; the band includes opaque clothing, arms and shadow pixels. The visual guide shows the centerline and band on all eight cells.
- Alpha bounds across the run are x43-214 and y23-240 inclusive; every cell is contained and soles reach the expected y240 floor. The poses retain their alternating leg and arm swing. Since the repair metadata applies translations only and leaves the 0.92 pack scale unchanged, the drawing's proportions are preserved. Direct visual inspection still finds the head/hair, shoulder and torso volume, limbs, gi and boots coherent with the approved idle and title-style anatomy. The Goku head probe is disabled, so no head-probe number is claimed as a scale pass.

This is static artwork and packed-atlas QA. It does not certify runtime playback, root motion, attack contact, or hit/hurt boxes; Claude retains those checks. The target worktree was not edited. The evidence and this report are on `art/size-r8-b`.

## Evidence

- `public/reviews/size-r8-audit2-goku-run-recheck/run-v10-exact-atlas-and-reference-cells.png`
- `public/reviews/size-r8-audit2-goku-run-recheck/run-v10-hip-band-registration-guide.png`
- `public/reviews/size-r8-audit2-goku-run-recheck/run-v10-registration-metrics.json`
