# R6 packed-strip triage and screening disposition

This report covers the 230 packed strips in the hash-bound baseline inventory. It excludes Gojo `dash` and `superDash` per the separate lane. The table below summarizes available B/H diagnostics only; it is **not** the complete revised candidate filter and does not certify anatomy. B is advisory body-color area, and H is the head probe. Box-axis width/height comparisons are absent from the inventory, so that part of the revised filter remains incomplete and must be checked from the packed `anims.json`/frames before calling candidate coverage complete.

| Fighter | Strips | Manual/unmeasured H | H outside 0.92–1.08 | B flagged (advisory only) | Known candidates before box-axis check |
|---|---:|---:|---:|---:|---:|
| Naruto | 54 | 8 | 11 | 23 | 15 |
| Sasuke | 44 | 10 | 9 | 13 | 12 |
| Killua | 44 | 9 | 6 | 19 | 10 |
| Gojo (excluding dash/superDash) | 42 | 8 | 7 | 19 | 11 |
| Goku (probe off) | 23 | 22 | 23 | 1 | 23 |
| Luffy (probe off) | 23 | 22 | 15 | 7 | 23 |
| **Total** | **230** | **79** | **71** | **82** | **94** |

The known-candidate count is the union of manual/unmeasured H, any per-frame H outside 0.92–1.08, and all strips for probe-off Goku/Luffy. B is kept as advisory context and does not add candidates by itself. Goku and Luffy are fully included as candidates (23 each), despite the 22 diagnostic rows whose saved H values are manual/unmeasured; the global probe-off rule takes precedence. This known count is provisional until box-axis width/height changes >15% are checked; those flags may add candidates. No claim of complete revised-filter coverage is made. All 230 are present in `all-strip-sheets/inventory.json` with raw input hash, packed animation/frame IDs, atlas/anims hashes, per-frame probe values, body-report outputs, approved reference provenance and per-strip page hashes. There are 40 comparison pages (up to six animations/page). Combat references are present on Naruto, Sasuke, Killua and Gojo pages; Goku and Luffy pilot pages are explicitly idle-only because their approved combat cells are not in that title-style pilot directory. Luffy's separate approved native audit combat reference is recorded in the reference inventory, not falsely shown on those pages.

## Visual screening versus endpoint evidence

Independent readers visually screened all six fighters' packed strips. Naruto/Sasuke and Gojo/Goku/Luffy reports found no additional strip with two pose-independent, homologous landmarks establishing a repeated size error. Luffy `jumpUp` was checked against the approved native audit: pixel-identical cells, no finding. These are screening outcomes, not 230 numeric segment passes.

Killua's 44 strips were screened and no additional redraw was justified. `airLight2` v07 remains unresolved: the available native grid suggests a one-leg airborne pose; earlier `.65–.76` leg and `.78–.90` shoe ratios were withdrawn. v08 is preserved in `_qa_hold` after its pack gate failed; no user approval is requested for it.

Known H/manual leads still needing segment-level disposition include Naruto launched/spin/down/getup/ko, light1Alt f4, heavyAlt f3-f5 and specialUp f4-f5; Sasuke jumpUp, airHeavy, guard/launched/spin/airRecover/down/getup, beamCharge and superDash f0. Reported head-box/box-size anomalies in these poses are not automatically size findings. No second homologous endpoint measurement confirmed them. The missing box-axis check may add further rows across all fighters. Sasuke `beamStruggle` is the only corrected-calibration candidate in this task branch; see [its technical hold](SASUKE_BEAMSTRUGGLE_V03.md).

Gojo `heavy` and `airLight1` remain visual leads only: no two-landmark segment measurements confirmed the earlier size claims. Gojo `hurtLow` stays unchanged as explicitly directed. Goku and Luffy have no confirmed size correction in this pass; the Goku/Luffy inventory screen uses their idle columns, with the approved native title references separately identified by hash.

## Sasuke v03 disposition

v03 is an immutable, byte-identical no-call copy of approved raw v01, held for calibration. The diagnostic atlas at bodyHeight 146 is not the working production atlas; the working `public/characters/sasuke/` output remains the approved baseline. The head probe overlaps a sleeve, and the required sash-band endpoints are ambiguous. Do not infer a manual-QA pass from B/H. See `SASUKE_BEAMSTRUGGLE_V03.md` and `public/reviews/size-r6/sasuke-beamStruggle-v03/index.html`.
