# Luffy special v02 diagnostic atlas audit

Astra, 2026-10-16. **PASS within measurement uncertainty for special v02 anatomy, complete fit and static recovery sequence on the exact diagnostic pixels below.** All 108 diagnostic atlas frames were visually reviewed. Strict production-equivalent packing remains pending; this warn-mode fixture is not a strict gate pass or drawing approval.

## Identity and preservation

- Diagnostic sheet `relay11-generation/quantized-r6/characters/luffy/sheet.png`: SHA256 `e8d5ba9f95a833af82bd13441d3099d15cf44449573e15db5af404f01eb92ce0`.
- Metadata SHA256 `b88d3a7f180350055e1c11fecfc79358d1c897468c4f94c7a0dceb6ba132b0da`.
- Special v02 raw SHA256 `362ddaf4cd82c6bf13708cb54d855e8abdad9bec541d9c7b9b4811d148085853`.
- New returned B source SHA256 `5f3216c13285a791c76a6f5190c062cc2244f22264dc7505aaaea9bd710eb877`; fifth authorized call, no further generation.
- Original A and copied v02 A both independently hash to `7ec7381d83ca597c9e91f6c05bc7390c241a0fc24befa9a77e506828d1a55ceb`. The six original source poses are preserved byte for byte in A.
- Reviewed worker's registered native source-A comparison: corresponding crop origins and dimensions agree at 1.0x, opaque RGB differences are zero, 14 isolated source-only alpha pixels were removed by repeated normal speck cleanup. Thus cleaned assembled masks are not literally byte-identical, but no source pose geometry was redrawn or resized independently.
- Stitch B factor 0.5057; normal per-strip factor approximately 0.518; effective B-to-cell factor approximately 0.2619526. A-to-cell is approximately 0.518. The stitch's color-head result was not used as anatomy certification.

## Special: all eight frames

Frames 0–5 preserve the original guard, wind-up and increasing arm reach. Final atlas frames 96–103 were inspected individually and in sequence. Frame 5's stretched arm contracts visibly into the new bent-elbow frame 6; approximate shoulder-to-fist projected reach decreases from about 107 to 78 native pixels (endpoint uncertainty about 5px), then frame 7 returns to a compact guard. The elbow is visibly bent in frame 6. Its fist remaining forward is consistent with partial retraction, not another fully stretched active frame. Frame 7 to idle is a plausible guard transition. No missing forearm, cut hand or unsupported limb is visible.

The new B poses have a somewhat shorter posed silhouette than A. This alone does not establish body-density failure. Final frame 7 visible neck-base (120,104) to sash (112,142) is about 38.8 +/-5px; exposed shin from knee (72,181) to ankle (48,228) is about 52.8 +/-6px. Approved idle targets are 41.5 +/-6 and 52.8 +/-6. Frame 6 uses the same body with the arm changing. Face/head, shoulder/upper-arm breadth, chest, vest/shorts volume and sandals remain coherent with approved title/idle. The rear braced forearm is foreshortened; no numeric pass is invented for its hidden elbow. Knees partly under cuffs require explicit uncertainty.

Correction to an early rough source screen: the proposed source shin point around y604 was below the actual knee and is not used. Final native visible knee/ankle readings above are the audit evidence. No source-scale correction is justified solely by hat width, posed height or that discarded source point.

## Shared palette and retained frames

FINAL_PIXEL_HASHES.json contains all 108 extracted cell hashes, indices, loop flags and durations; contacts in final-cells/ were viewed in full. All 100 retained frame alpha masks match the current public baseline exactly. Their changed shared-palette RGB was independently checked: skin, vest, shorts, sash and sandals remain separated, with no new anatomical fragmentation or scale drift. Prior accepted run, light3, light4 and airLight1 placement exceptions remain unchanged. Claude's beamFire arm-continuation condition remains a runtime check. Charge tint and growing fist remain intentional move features.

Static consecutive poses and loop/recovery relationships were reviewed for all 23 rows. This does not certify timed playback, gameplay grounding, contact zones or engine effects. Prior detailed per-strip uncertainty remains in manual-audit-r5 and earlier reports.

## Next

This exact special v02 technical pass supports version-bound manualQA for a strict isolated repack. Supply that final sheet/metadata and pack outcome; if pixels are identical, bind the final strict result without another palette assumption. If pixels change, recheck them. User drawing approval remains pending. Parent owns publication and relay; auditor has edited evidence only.
