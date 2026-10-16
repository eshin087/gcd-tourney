# Gojo round 4 — Claude calibration and assembly handoff

Date: 2026-10-14  
Branch/worktree: `codex/gojo-run-def` / `.worktrees/art-gojo-title-r3`  
Scope: evidence handoff only. All round-four candidates remain unapproved. This note requests Claude's calibration and source-assembly diagnosis before any decision about another image call.

## Immutable evidence and hashes

The six-strip final diagnostic atlas is `final-candidate-public/characters/gojo/` (47 frames; warn-mode disposable fixture). Its exact hashes are:

| File | SHA-256 |
|---|---|
| `final-candidate-public/characters/gojo/sheet.png` | `89fd7021575060d70a065c620607d3a80fd526d6b8b6f709d2106766381f0b28` |
| `final-candidate-public/characters/gojo/anims.json` | `40a09f854da368550c4c158cc16350b7562cfa88030be79bf77002307ff3bdc9` |
| final fixture manifest | `3a75196e6b3a95ae49c34b20203ec970c04d604ff562b1bbd0436cea1f1dec24` |

The isolated idle-v07 diagnostic atlas is a different fixture, used only to inspect that candidate:

| File | SHA-256 |
|---|---|
| `diagnostic-public/characters/gojo/sheet.png` | `79d3407f91ef490e9c925151b412741f43e470e16da72e089affef0582cce7c9` |
| `diagnostic-public/characters/gojo/anims.json` | `c205a3d74f57fd18518d26ec5992c30e965bddcfb3d95d080d193ebb8e36f4c3` |

Saved raw candidate sources were re-hashed in this checkout. For entries with an attempt-ledger call hash, the selected file matches it exactly. Idle and superDash are retained candidates whose source choice is recorded in `inventory.json`; their file hashes below identify the assembled/saved candidates, not an individual generation call:

| Source | Selected call | SHA-256 |
|---|---:|---|
| `raw/idle_v07.png` | A2/B1 stitched candidate; source selection is recorded in `inventory.json` | `9ca926e70baf2dd4ad0720144011d8b35144ec4ee379c96c89323f6dae1437bc` |
| `raw/superDash_v09.png` | A3 | `401b2bb5d7b5ace9155f641e20412d1c75dedd37199f7c8fbeacc3d2009cb17f` |
| `raw/airLight1_v07.png` | call2 | `9f258845eb022b0fee0ae13125510fbfb7a78c75b06423874779d9923772ab30` |
| `raw/throw_v05.png` | call2 | `fccc76c4387a1c919d1f7ab37901871d01176be7c8da5c98799dd056560380c1` |
| `raw/_parts/light3_v05_A.png` | A call2 | `ec6d9b42fda2edb3425c7b1e2be84f49e793aa025871122ba753979deaa0a1b2` |
| `raw/_parts/light3_v05_B.png` | B call2 | `00d3e157b4529d885731de5de56618c2892c34945ac4f459d30eb15912e2f8dbe` |

Audit sources: `QA-FINAL.md`, `astra-audit/REPORT.md`, `astra-audit/FINAL-SEGMENTS.md`, `astra-audit/final-independent-landmarks.json`, `final-candidate-atlas-measurements.json`, `sources/attempt-ledger.json`, and `inventory.json`. The diagnostic pack is not a production strict-scale success. The full real-manifest strict dry run exited 1 and wrote no production atlas.

## Findings to resolve before any new generation decision

### Idle v07 — definite requested-size failure

The candidate's eight quantized frames are 234–236 px crown-to-sole and 135–138 px wide. The inbox target is 210–216 px tall and 145–160 px wide. Thus every frame is 18–26 px too tall and 7–25 px too narrow. This is a robust whole-pose envelope miss, separate from anatomy. The torso reads 83–85 px versus approved idle v06 at 79.2 px and approved combat at about 70.7 px, but pose/landmark uncertainty limits exact anatomical ratios. Its head is about 35–37 px against old idle's 36.2 px with ±4 px uncertainty, so the required ±2% head match is inconclusive. Keep idle v06 as scale denominator; do not use unapproved v07 to recalibrate the cast.

Claude ask: inspect `idle-all8-native.png`, `idle-f0-comparison-2x.png`, `idle-diagnostic-native.png`, and atlas evidence. Confirm that the measured envelope reflects the source assembly and pivot, then state whether any already-authorized runtime calibration can meet the user target without distorting approved anatomy. Do not apply a calibration in this handoff.

### SuperDash v09 — robust torso residual, pose-aware confirmation requested

Both frames have torso projection about 53.5±6 px (collar near `(156,136)` to hem near `(127,181)`). Against approved idle v06 torso 79.2±6 px, the most favorable ratio is 59.5/73.2 ≈ 0.813, below the 0.94 lower tolerance. This is a robust compact-torso residual against the idle reference. Against the combat torso 69.7±6 px, the favorable ratio is 59.5/63.7 ≈ 0.934, close enough that source/reference and pose uncertainty make the combat comparison inconclusive. Folded limbs, oblique shoes and hidden far-side segments do not independently prove a scale defect.

Claude ask: inspect `superDash-v09-native.png`, `superDash-v09-2x.png`, `superDash-landmarks.json`, and `superDash-v09-isolated-pack.txt`. Confirm landmarks and evaluate bodyHeight/offset fit against the approved idle and combat cells while preserving the bent pose. Separate a plausible calibration response from a drawing-proportion residual. No sidecar or runtime values are changed here.

### Light3 v05 — visible A/B seam, assembly check first

The final atlas audit measures a 9–11 px crown drop at the A-to-B transition; f5/f6 are more upright but remain shorter. This is a robust sequence discontinuity in the assembled candidate. Torso projections remain about 62–63 px versus old idle 79.2±6, but twist, pocket wrist and kicking-hip depth prevent certifying the exact anatomical deficit. It is a candidate hold, not by itself authority for an image call.

Claude ask: compare the immutable source parts (`raw/_parts/light3_v05_A.png`, `_B.png`), `idle-stitch.txt`, `light3-round4-2x.png`, `FINAL-SEGMENTS.md`, and the final atlas cell sequence. Verify the stitch factor and frame boundary (A f0–3, B f4–6), then identify whether the crown step is present in source B, caused by assembly scaling, or caused by the chosen part/frame boundary. Recommend the narrowest correction and required evidence before any further generation.

### AirLight1 v07 and throw v05 — robust visual concern; segmentation/column assembly unresolved

The Astra atlas report records that segmentation reports a column boundary passing through one figure group in each strip. This is an assembly concern, not proof that a visible production cell is physically clipped: the quantized atlas bounds are inside x=4..251 and no cell-boundary clipping was seen. Preserve that distinction while reviewing how the source columns were grouped.

AirLight1 torso projections are 55–57 px and arm chains 45–49 px versus old idle torso 79.2 and arm 70.0 px. The compact torso and extended arm are strong projected-scale concerns, but hidden heel/raised thigh, ±6 px torso and ±12 px chain uncertainty, and pose depth prevent a complete anatomy ratio pass. Throw torso projections are 56–61 px across frames, visibly compact for the head; twist/depth prevents converting this to an exact anatomical percentage, and no shoe length is measurable from its dangling heel fragment. Both remain HOLD.

Claude ask: inspect `airLight1-round4-2x.png`, `throw-round4-2x.png`, both baseline comparisons, the matching extracted frame sequences and pack report. Trace the source columns through segmentation into frames and the atlas. Report exact source coordinates, which figure group crosses each inferred column boundary, whether frames were split or merely grouped ambiguously, and whether the observed compact torso survives side-by-side comparison at one density. Do not change sources, hitboxes or runtime calibration during diagnosis.

## Cumulative image-call budget

Counts are per asset/part across all candidate versions. A remaining numeric call is not a standing instruction to render: first establish a residual that generation can address after the source, assembly and pose-aware calibration checks above. The airLight2 incident stays an overrun and grants no further calls.

| Asset/part | Calls recorded | Authorization | Remaining arithmetic | Current direction |
|---|---:|---:|---:|---|
| Idle A | 3/3 in round 4; inventory cumulative field records 4 including history | 3 round-4 calls | 0 | No more calls; v07 fails envelope/head-certification hold |
| Idle B | 1/3 in round 4 | 3 | 2 | Unused; do not spend before assembly/anatomy diagnosis |
| SuperDash | 3/3 round 4; 4 cumulative including v08 history | 3 round-4 calls | 0 | No more calls; confirm whether calibrated geometry can address torso residual |
| JumpFall | 3/3 cumulative (v05 and v06) | 3 | 0 | Preserve; hand swing needs playback review, no further call |
| AirRecover | 3/3 cumulative (v04 and v05) | 3 | 0 | Preserve; rotation/depth makes proportions inconclusive; refresh manual QA at v05 |
| Throw | 3/3 | 3 | 0 | No more calls; inspect segmentation and calibration first |
| AirLight1 | 3/3 | 3 | 0 | No more calls; inspect segmentation and calibration first |
| AirLight2 | 5/3 | 3 | over by 2 | Incident calls preserved; no more calls authorized |
| Light3 A | 2/3 | 3 | 1 | Hold unused pending seam/assembly diagnosis |
| Light3 B | 2/3 | 3 | 1 | Hold unused pending seam/assembly diagnosis |

The `measure` items guard v04, jumpUp v04, airLight3 v12 and hurtLow v04 remain HOLD for certification without a robust newly measured defect. Their pose/occlusion intervals overlap acceptance or cannot support a comparison; none currently supports a redraw call. See the Astra report for the specific skips and uncertainty.

## Requested Claude response

Please return: (1) confirmed hash/source and atlas identity; (2) per-asset calibration diagnosis for idle, superDash, light3, airLight1 and throw; (3) exact assembly findings for the light3 seam and airLight1/throw column grouping; (4) which residuals are robust defects versus inconclusive projections; and (5) the minimum next evidence needed before deciding whether any unused call is warranted. Keep all D/E/F/G/H/I run studies, round-three files, versioned source candidates and incident evidence intact.

No candidate is approved by this handoff. Any later bodyHeight, offset, sidecar, hitbox, packer or public-atlas change remains a separate Claude-owned calibration/integration step.
