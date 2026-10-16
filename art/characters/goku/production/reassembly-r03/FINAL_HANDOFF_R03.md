# Goku r03 final handoff

## Exact strict branch-preview pack and audit

- Strict pack exit: **0**. 21 animations / 93 frames / 48 colors; all selected animation and frame scales are x1.
- Branch-preview atlas SHA256: fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054; Astra final5 audit hash: fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054.
- Branch-preview metadata SHA256: e98d7a2addcdbf932438ac43b89f507177b9071194359a40e042bab68fdfdc9f; Astra final5 audit hash: e98d7a2addcdbf932438ac43b89f507177b9071194359a40e042bab68fdfdc9f.
- The branch-preview hashes equal Astra's exact audited hashes. The final5 quantized review is [FINAL5_STRICT_AUDIT.md](../manual-audit-r3/FINAL5_STRICT_AUDIT.md), with per-frame extraction evidence [FINAL5_PIXEL_VERIFICATION.json](../manual-audit-r3/FINAL5_PIXEL_VERIFICATION.json).
- The only pack warning is the getup lying-frame floor/contact warning; Claude owns runtime grounding/contact disposition. This pack intentionally reports missing core `light3` and `heavy`; neither falls back to its older approved drawing.
- The strict head probe is configured by the real `art/scale/builds.json`; the isolated fixture copied it byte-for-byte and recorded the hash. It returned manual verdicts for the exact versions under Astra review; no probe policy/tool changes were made.

## All23 core animation inventory

| Animation | Exact version | Frames | Native bodyHeight | Source factor | Pack scale | Technical state |
|---|---:|---:|---:|---:|---:|---|
| idle | v02 | 8 | 233 | reference | x1 | Approved reference |
| run | v09 | 8 | 237 | 0.589 | x1 | Astra PASS, exact final5 pixels |
| dash | v09 | 2 | 207 | 0.291 | x1 | Astra PASS, exact final5 pixels |
| jumpUp | v04 | 2 | 206 | 0.257 | x1 | Astra PASS, exact final5 pixels |
| jumpFall | v04 | 2 | 232 | 0.356 | x1 | Astra PASS, exact final5 pixels |
| land | v07 | 2 | 235 | 0.3 | x1 | Astra PASS, exact final5 pixels |
| light1 | v04 | 7 | 237 | 0.383 | x1 | Astra PASS, exact final5 pixels |
| light2 | v05 | 7 | 236 | 0.613 | x1 | Astra PASS, exact final5 pixels |
| light4 | v09 | 8 | 237 | 0.652 | x1 | Astra PASS, exact final5 pixels |
| airLight1 | v07 | 5 | 237 | 0.539 | x1 | Astra PASS, exact final5 pixels |
| airHeavy | v06 | 6 | 237 | 0.573 | x1 | Astra PASS, exact final5 pixels |
| guard | v05 | 2 | 229 | 0.282 | x1 | Astra PASS, exact final5 pixels |
| hurtHigh | v08 | 3 | 223 | 0.335 | x1 | Astra PASS, exact final5 pixels |
| launched | v08 | 2 | 200 | 0.258 | x1 | Astra PASS, exact final5 pixels |
| down | v05 | 2 | 115 | 0.272 | x1 | Astra PASS, exact final5 pixels |
| getup | v11 | 5 | 237 | 0.532 | x1 | Astra PASS, exact final5 pixels |
| charge | v05 | 4 | 237 | 0.373354296 | x1 | Astra PASS, exact final5 pixels |
| beamCharge | v07 | 3 | 236 | 0.357620533 | x1 | Astra PASS, exact final5 pixels |
| beamFire | v07 | 3 | 233 | 0.35057737 | x1 | Astra PASS, exact final5 pixels |
| special | v05 | 8 | 237 | 0.596 | x1 | Astra PASS, exact final5 pixels |
| win | v05 | 4 | 237 | 0.42 | x1 | Astra PASS, exact final5 pixels |
| light3 | v09 | 7 | 237 | 0.499 | not packed | **HOLD** body calibration unresolved; assembly and fit pass; absent from selection. No missing source drawing established. |
| heavy | v11 | 8 | 237 | 0.599 | not packed | **HOLD** body calibration unresolved; assembly and fit pass; absent from selection. No missing source drawing established. |

This inventory is the complete 23-row core status: approved idle reference, 20 exact pass candidates, and two holds. The user-approved v04 drawings remain historical design approvals on their original versions; uniform reassembly does not create new design approval. Conversely, those original approvals do not bypass technical holds. All other candidate design review remains separate.

## Source, crop, and calibration evidence

- The selected candidate PNGs and sidecars are in `art/characters/goku/raw/`; all superseded versions remain under `raw/_qa_hold/`. Approved `light3_v04` and `heavy_v04` PNGs/sidecars were moved into `_qa_hold` so the production pack cannot silently fall back to them. No versioned file was overwritten or deleted.
- The complete generated version catalog is [R03_REVIEW_ROWS.md](R03_REVIEW_ROWS.md); it lists each immutable PNG with its hash, sidecar, current selection/hold/superseded state, and source provenance when available.
- Landmark endpoints, source hashes, interval uncertainty, full source extent, corrected extraction rectangles, and frame offsets are in [FINAL4_AUDIT.md](../manual-audit-r3/FINAL4_AUDIT.md), the sidecars, and [WORKFLOW.md](WORKFLOW.md).
- `run`, `light4`, `heavy`, `airLight1`, `launched`, and `dash` use recorded horizontal `frameOffsets`; these affect placement, not anatomy or density. Claude should verify runtime grounding/contact and hitbox alignment before integration.
- `special_v05` corrects verified black grid separators in the source rectangles; `light3_v09` removes only the verified neighboring-boot fragment. Source art and earlier assemblies are preserved.
- The final4→final5 mask comparison is in [final4-final5-mask-comparison.json](final4-final5-mask-comparison.json): 93 frames, zero silhouette-mask or alpha differences; RGB differences are separately recorded because removing the two holds changed the shared palette. Astra directly rechecked all final5 pixels.

## Workflow result and remaining owners

- Reassembly this round used zero image-generation calls. Exact source anatomy/placement issues were repaired where possible; complete source drawings were not redrawn.
- Astra completed the final exact-palette pass for20 versions plus idle. The two calibration holds are not established mandatory redraws. Claude owns the next calibration/compact-pose decision for light3/heavy and the getup floor-contact warning.
- Claude also owns runtime contact/hurtbox and timed-loop review, final production integration, and merge/deploy. User design approval remains a separate gate for unapproved drawings.
