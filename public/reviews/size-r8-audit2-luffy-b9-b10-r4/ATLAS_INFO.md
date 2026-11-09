# Luffy B9/B10/R4 review atlas

This is a 48-color candidate atlas prepared for visual review. It is not the production atlas and must not be treated as an Astra scale/anatomy pass.

- Source pack: temporary candidate pack from this branch's current candidate raws, built with the existing Luffy character pack scale and unchanged move timings. The temporary QA overrides and precheck outputs are excluded from this review payload.
- Candidate atlas: `atlas/characters/luffy/sheet.png` (4096×2816), SHA-256 `8ae12ad6b90a4fd4e9686d5df2608290831c099c3cbda66e00308bb9aaad141a`.
- Candidate metadata: `atlas/characters/luffy/anims.json`, SHA-256 `baabbabe39e94f97282290f13382d1646a95a83a5759bc1d66d665be03c4f704`.
- It contains 33 animations / 174 frames. The candidate rows are run v02 in frames 8–15, down v04 in frames 79–80, and specialForward v02 in frames 114–120.
- Temporary `scaleManualQA` pass values were supplied only to let the review packer create the candidate atlas. Those values are not in the production manifest. Final Astra audit remains pending until after visual approval.
- `specialForward` remains at the existing packScale 1.08 and keeps its diagnostic exemption. The v02 pixel repair only removes the f5 detached orange speck; the earlier arm/palm technical hold is not cleared.

Comparison boards extract the exact old and candidate cells from their respective atlases: `run-compare.png`, `down-compare.png`, and `specialForward-f5-compare.png`.
