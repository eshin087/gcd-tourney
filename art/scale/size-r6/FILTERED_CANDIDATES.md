# R6 packed-strip filter and screening disposition

This filter covers the 230 packed strips in the hash-bound baseline inventory. It excludes Gojo `dash` and `superDash` per the separate lane. Numeric tool flags are triage only: B is the body-color-area proxy, H is the packer head probe, and neither is a segment measurement or a pass/fail anatomy judgment. The independent screening notes below are visual leads; exact segment findings remain separate.

| Fighter | Strips | Manual/unmeasured H | H outside 0.92–1.08 | B flagged | Union of numeric flags |
|---|---:|---:|---:|---:|---:|
| Naruto | 54 | 8 | 11 | 23 | 29 |
| Sasuke | 44 | 10 | 9 | 13 | 18 |
| Killua | 44 | 9 | 6 | 19 | 23 |
| Gojo (excluding dash/superDash) | 42 | 8 | 7 | 19 | 22 |
| Goku | 23 | 22 | 23 | 1 | 23 |
| Luffy | 23 | 22 | 15 | 7 | 22 |
| **Total** | **230** | **79** | **71** | **82** | **137** |

The flags overlap. “Manual/unmeasured H” counts probe verdicts, “H outside” counts any per-frame head probe value outside 0.92–1.08, and B counts the advisory body-color-area flag. The union includes each strip flagged by any of those conditions; it is triage, not anatomy confirmation. All 230 are present in `all-strip-sheets/inventory.json` with the raw input hash, packed animation/frame IDs, atlas/anims hashes, per-frame probe values, body-report outputs, approved reference provenance and per-strip page hashes. There are 40 comparison pages (up to six animations/page). Combat references are present on Naruto, Sasuke, Killua and Gojo pages; Goku and Luffy pilot pages are explicitly idle-only because their approved combat cells are not in that title-style pilot directory. Luffy's separate approved native audit combat reference is recorded in the reference inventory, not falsely shown on those pages.

## Visual screening versus endpoint evidence

Independent readers visually screened all six fighters' packed strips. Naruto/Sasuke and Gojo/Goku/Luffy reports found no additional strip with two pose-independent, homologous landmarks establishing a repeated size error. Luffy `jumpUp` was checked against the approved native audit: pixel-identical cells, no finding. These are screening outcomes, not 230 numeric segment passes.

Killua's 44 strips were screened and no additional redraw was justified. `airLight2` v07 remains unresolved: the available native grid suggests a one-leg airborne pose; earlier `.65–.76` leg and `.78–.90` shoe ratios were withdrawn. v08 is preserved in `_qa_hold` after its pack gate failed; no user approval is requested for it.

Filter leads still needing segment-level disposition include Naruto launched/spin/down/getup/ko, light1Alt f4, heavyAlt f3-f5 and specialUp f4-f5; Sasuke jumpUp, airHeavy, guard/launched/spin/airRecover/down/getup, beamCharge and superDash f0. Reported head-box/box-size anomalies in these poses are not automatically size findings. No second homologous endpoint measurement confirmed them. Sasuke `beamStruggle` is the only corrected-calibration candidate in this task branch; see [its technical hold](SASUKE_BEAMSTRUGGLE_V03.md).

Gojo `heavy` and `airLight1` remain visual leads only: no two-landmark segment measurements confirmed the earlier size claims. Gojo `hurtLow` stays unchanged as explicitly directed. Goku and Luffy have no confirmed size correction in this pass; the Goku/Luffy inventory screen uses their idle columns, with the approved native title references separately identified by hash.

## Sasuke v03 disposition

v03 is an immutable, byte-identical no-call copy of approved raw v01, held for calibration. The diagnostic atlas at bodyHeight 146 is not the working production atlas; the working `public/characters/sasuke/` output remains the approved baseline. The head probe overlaps a sleeve, and the required sash-band endpoints are ambiguous. Do not infer a manual-QA pass from B/H. See `SASUKE_BEAMSTRUGGLE_V03.md` and `public/reviews/size-r6/sasuke-beamStruggle-v03/index.html`.
