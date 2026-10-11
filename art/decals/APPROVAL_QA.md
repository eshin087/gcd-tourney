# Core decal approval — 2026-10-11

The user explicitly approved all three decal previews. This branch records approval of its latest 19 core decal sets / 99 variants exactly as shown in the reviewed preview. The user accepted the documented fringe, antialiasing and directional facet deviations in [CORRECTION_QA.md](CORRECTION_QA.md); those findings remain historical evidence, not clean-art claims. The separate provisional style sheet was not part of the current gallery and remains pending.

Approved v02: crack_s, scuff, skid, barrier_crack, burn_lightning, burn_lightning_big. Approved v01: crack, crater, crater_big, crater_huge, fracture_ring, rubble, dirt_crater, dirt_skid, crater_wall, fracture_lightning, burn_fire, burn_black, scorch_ki.

Six superseded v01 sets were marked rejected and archived under raw/_rejected with their sidecars, preserving filenames and REVIEW links: crack_s, scuff, skid, barrier_crack, burn_lightning and burn_lightning_big. No latest source image was changed or regenerated.

`node tools/pack-sprites.mjs decals` succeeded: 19 names / 99 variants / four pages, approved-only source. The normal cached-frame pack reports 12 residual packed-color warnings; the earlier fresh-source pack's 18 warnings remain documented. This is not evidence of additional cleanup.

[approved-comparison.json](approved-comparison.json) verifies SHA-256 equality for all four approved PNG pages against the reviewed candidate pages. **Zero changed image bytes.** Atlas metadata is identical except `source: candidates` becomes `source: approved`. Variant counts, order, dimensions, hot-key flags and page placement are identical. The reviewed palette, binary alpha and hot-key checks therefore still apply.

Production build passed with the project Vite adapter: 80 modules, exit 0. No new preview is required because rendered art is byte-identical. The existing hosted gallery/game verification remains applicable to the reviewed images; coordinator integration must verify the combined approved atlas after merging all three batches.

This approval commit does not merge or deploy production. The designated coordinator owns integration.
