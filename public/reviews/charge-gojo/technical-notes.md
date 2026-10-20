# Gojo charge v08 review notes

**Status: technical HOLD; user review pending.** This is a versioned review candidate, not a game-ready pack. Approved charge v07 remains in the game atlas.

## Packed-cell findings

- The post-merge strict pack refused to write the Gojo character atlas: charge v08 head scale is 0.89 of idle, with feet 1.00. The body sheet reports H median 0.886 and advisory garment-area B median 0.817.
- In f2-f5, main soles alternate y240/y222/y240/y222. The 18 px jump repeats at the loop seam. The head-mask center also moves 18.5 px vertically and 8 px horizontally. This exceeds the brief's locked-body allowance.
- Source warnings: background `#17002e` rather than `#FF00FF`, 159 specks removed, one frame flagged as clipped 29 px at the left, and the detector needed whole-figure grouping to extract six poses.
- A diagnostic-only `scaleGate: warn` pack was used to inspect the actual quantized cells after strict failure. It is not a scale pass or shipping atlas. Its sheet and metadata hashes match the version-bound Astra audit.
- The packed loop GIF shows the six cells at 70/90/110/110/110/110 ms, followed by four f2-f5 cycles and a pause. No game-lab playback was run because strict packing failed.

Identity and the calm open-hand pose read correctly. The audit does not certify head/body scale, torso/limb volume, fixed feet/hips/knees, or clean background. The existing technical holds and uncertainty are documented in [Astra's audit](ASTRA_AUDIT.md) and the [producer repack check](PACK_CHECK.md).

## Six Eyes glint point

Packed f2 estimate: **cell x=130, y=72**, approximately ±2 px. This is the projected eye centre under Gojo's blindfold; the eyes are not visible in the art. The coordinate applies to v08's current packed registration only.

## Decision requested

Please review v08 as drawn with these holds disclosed. Choose either:

1. Approve the visual direction as drawn, understanding v07 remains live and technical work is still required; or
2. Reject v08 and authorize a fresh three-call generation budget for a corrected version.

The three calls for v08 are exhausted. No new image was generated for this review.
