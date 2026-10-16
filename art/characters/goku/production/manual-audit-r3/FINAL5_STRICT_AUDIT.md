# Goku final strict selected-pixel recheck

2026-10-16, Astra. **PASS retained for all20 selected manual versions plus approved idle02 reference.** Every one of93 final quantized frames was visually rechecked across21 native contacts after removing light3/heavy and recomputing the shared palette. No new color-boundary, body-proportion, clothing-volume, clipped-limb or static sequence defect was found. All uncertainty and runtime limits in FINAL4_AUDIT.md remain applicable.

## Immutable final output

- Sheet: `production/reassembly-r03/final5-fixture-public/characters/goku/sheet.png`
- Sheet SHA256: `fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054`
- Metadata: same directory, `anims.json`
- Metadata SHA256: `e98d7a2addcdbf932438ac43b89f507177b9071194359a40e042bab68fdfdc9f`
- Strict pack exit0;21animations/93frames,48 colors; selected scales x1. Independent check counted48 opaque RGB colors and matched every extracted cell to its atlas rectangle with zero RGBA differences. Exact frame hashes/indices/durations: FINAL5_PIXEL_VERIFICATION.json.
- Frozen inputs/configuration in `production/reassembly-r03/final5-fixture-inventory.json`. Copied unchanged scale/builds.json SHA256 `ef0a6b9b5debd11ae5382d79a4e0c99b3cc8ddc006d6a51040a2b2adad2d73b7`. An earlier private-root strict attempt omitted that policy dependency; the corrected strict result is the artifact audited here. No tool/policy workaround was used.

Selected PASS versions: run09,dash09,jumpUp04,jumpFall04,land07,light104,light205,light409,airLight107,airHeavy06,guard05,hurtHigh08,launched08,down05,getup11,charge05,beamCharge07,beamFire07,special05,win05. Idle02 is the approved reference. BodyHeights/factors/offsets and detailed per-strip anatomy findings are in FINAL4_AUDIT.md; selected geometry is unchanged and the new palette was directly reviewed, not inferred from mask equality.

## Remaining boundaries

Light309 and heavy11 remain excluded technical calibration holds. Their complete source drawings and central-factor capacity conflicts are documented in FINAL4_AUDIT.md. Neither missing drawing nor mandatory new generation is established; Claude can resolve calibration/compact-pose handling without another scale iteration this round. Do not fall back to older approved drawings with unresolved technical defects.

Getup's floor/contact warning remains for Claude runtime review. Timed animation playback, gameplay hit/hurtboxes, design approval and production merge/deploy are separate. This audit certifies the selected exact strict output within measurement uncertainty, not a complete23-animation release.

Public adoption must preserve these exact hashes or receive a changed-artifact recheck. If production repack produces identical sheet and metadata, this audit applies without repeating image review. Parent owns commits/previews and goku-luffy handoff. Auditor edited evidence only and did not approve designs or change production inputs.
