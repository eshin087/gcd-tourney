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

The initial known-candidate count is the union of manual/unmeasured H, any per-frame H outside 0.92–1.08, and all non-idle strips for probe-off Goku/Luffy. B is advisory and does not add candidates. This gives 92 candidate strips before box-axis screening. The idle strip is the reference, not its own candidate.

## Packed box-axis screening (2026-10-18)

I compared each animation frame's saved `scaleAudit.anims.<name>.boxes` width and height with the same fighter's idle reference box. A frame is an additional candidate when either axis differs by more than 15% while its head ratio remains in 0.92–1.08. This test is a screening signal only: head rotation, pose, and probe-region contamination can change the bounding box without changing anatomy. Those strips require the two-landmark check; a box-axis flag is never itself a finding.

| Fighter | Additional box-axis candidates before withdrawals | New candidates after overlap with base candidate set and Claude withdrawals |
|---|---:|---:|
| Naruto | 8 | 8 |
| Sasuke | 5 | 4 |
| Killua | 4 | 4 |
| Gojo (excluding dash/superDash) | 5 | 4 |
| Goku | 0 (all 22 non-idle strips already candidates: probe off) | 0 |
| Luffy | 0 (all 22 non-idle strips already candidates: probe off) | 0 |
| **Total** | **22** | **20** |

New box-axis leads: Naruto `run` f2, `dash` f0, `land` f0, `light2` f6, `heavy` f4, `hurtHigh` f0-f1, `specialDown` f2, `light1Alt` f4; Sasuke `backDash` f1, `superDash` f0, `light4` f1, `beamCharge` f0-f2; Killua `jumpUp` f0, `hurtHigh` f0, `specialForward` f3, `specialUp` f4-f5; Gojo `jumpUp` f0, `hurtHigh` f0, `charge` f0-f3, `beamStruggleAir` f2. Sasuke `airLight3` and Gojo `hurtLow` were in the raw box-axis list but are excluded per Claude's explicit withdrawals. The confirmed Sasuke `beamStruggle` sleeve contamination is an additional candidate reason even though its saved box axes do not exceed this threshold. The resulting candidate set is 113 strips (92 base + 20 new box-axis leads + Sasuke `beamStruggle`); candidates are not confirmed defects.

All 230 strips are present in `all-strip-sheets/inventory.json` with raw input hash, packed animation/frame IDs, atlas/anims hashes, per-frame probe values, body-report outputs, approved reference provenance and per-strip page hashes. There are 40 comparison pages (up to six animations/page). Combat references are present on Naruto, Sasuke, Killua and Gojo pages; Goku and Luffy pilot pages are explicitly idle-only because their approved combat cells are not in that title-style pilot directory. Luffy's separate approved native audit combat reference is recorded in the reference inventory, not falsely shown on those pages.

## Visual screening versus endpoint evidence

Independent readers visually screened all six fighters' packed strips. Naruto/Sasuke and Gojo/Goku/Luffy reports found no additional strip with two pose-independent, homologous landmarks establishing a repeated size error. Luffy `jumpUp` was checked against the approved native audit: pixel-identical cells, no finding. These are screening outcomes, not 230 numeric segment passes.

Killua's 44 strips were screened and no additional redraw was justified. `airLight2` v07 remains unresolved: the available native grid suggests a one-leg airborne pose; earlier `.65–.76` leg and `.78–.90` shoe ratios were withdrawn. v08 is preserved in `_qa_hold` after its pack gate failed; no user approval is requested for it.

Known H/manual leads still needing segment-level disposition include Naruto launched/spin/down/getup/ko, light1Alt f4, heavyAlt f3-f5 and specialUp f4-f5; Sasuke jumpUp, airHeavy, guard/launched/spin/airRecover/down/getup, beamCharge and superDash f0. Reported head-box/box-size anomalies in these poses are not automatically size findings. No second homologous endpoint measurement confirmed them. The missing box-axis check may add further rows across all fighters. Sasuke `beamStruggle` is the only corrected-calibration candidate in this task branch; see [its technical hold](SASUKE_BEAMSTRUGGLE_V03.md).

Gojo `heavy` and `airLight1` remain visual leads only: no two-landmark segment measurements confirmed the earlier size claims. Gojo `hurtLow` stays unchanged as explicitly directed. Goku and Luffy have no confirmed size correction in this pass; the Goku/Luffy inventory screen uses their idle columns, with the approved native title references separately identified by hash.

## Sasuke v03 disposition

v03 is an immutable, byte-identical no-call copy of approved raw v01, held for calibration. The diagnostic atlas at bodyHeight 146 is not the working production atlas; the working `public/characters/sasuke/` output remains the approved baseline. The head probe overlaps a sleeve, and the required sash-band endpoints are ambiguous. Do not infer a manual-QA pass from B/H. See `SASUKE_BEAMSTRUGGLE_V03.md` and `public/reviews/size-r6/sasuke-beamStruggle-v03/index.html`.
