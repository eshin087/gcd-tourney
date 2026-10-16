# Killua round 4 — Claude calibration and contact handoff

Date: 2026-10-14. Branch: `art/killua-title-r3`, worker HEAD `8c25da8178e8cf9a7875185d3108167c625f48f1` (`docs(art): record Killua gallery browser QA`). Scope: calibration evidence and requested owner actions only. All five selected versions remain unapproved HOLDs. This handoff does not certify full anatomy or authorize more generation.

## Reproducible inputs

The worktree's selected raw PNG SHA-256 values were recomputed on 2026-10-14 and agree with the main independent inventory's `sourceHashMatches` entries:

| Selected source | SHA-256 | Independent inventory |
|---|---|---|
| `art/characters/killua/raw/idle_v11.png` | `67e7016328a35ae12aaa2969f5e8c911d64b093039d9b1612583b21bff655aa9` | `idle_v11: true` |
| `art/characters/killua/raw/guard_v09.png` | `71444147e5840a8a7bf91aa1dc71693da0b19b2635a157ead5371dcb3a6bdd2e` | `guard_v09: true` |
| `art/characters/killua/raw/superDash_v08.png` | `810e986d1ef749aa08b45fda03c64f69a1cdd3bcaeb056251e61098e756c029a` | `superDash_v08: true` |
| `art/characters/killua/raw/stagger_v07.png` | `d747963987fccf4e8357e844a7f3a6b0cffa4c07c85c301ad6cdd9cc7ba921c5` | `stagger_v07: true` |
| `art/characters/killua/raw/win_v05.png` | `2cf3be95fe422b31c409d1c487be88e69c13753e7287a838376b4501ed51f1a6` | `win_v05: true` |

Astra's selected diagnostic atlas is `public/reviews/killua-round4/diagnostic-sheet.png`, SHA-256 `f9d0d80a7b0bbc9341fe909d5bf57bccdfb3f8c0297a16069453a6d772a0097a`; its metadata is `9ef60e70b94af486cb6ee1200593de62b8d0c35887e1854cf754feb3896fb746`. The current shipped `public/characters/killua/sheet.png` is still the baseline SHA-256 `771b510a9e82aa664abb936c597f416b2c3058e63dacf29efe5b7c9f0a062686` (metadata `e2dd023ad409b384f8910fb21785b2c7096dc9019a4d088689a2482ea13cb0e3`). Candidate and shipped atlases are distinct. `deliverables/round4-qa/atlas-hashes.json` and `independent-checks.json` are the source inventory; the latter confirms 48 opaque colors and exact candidate bounds.

The five PNG source hashes establish which inputs were inspected. They do not embed or independently prove raw-to-atlas lineage. The diagnostic atlas and its matching metadata hash identify the audited packed pixels. Do not describe this as a deterministic rebuild proof.

## Measured source versus fit

- **Idle v11, 8 frames:** actual candidate bounds are 144 px high for f0–3 and 146 px for f4–7, against the explicit 156–162 px target. Height is short by 10–18 px (about 6.4–11.1% of target). The visible packed readings are head 36–38±2, torso 38±2, arm 35±4, leg chain 56–58±6, shoe 23±2. Against the shipped idle reference H38±2 / T38±2 / A39±4 / L61±6 / S25±2, torso is already centered on the baseline; head, arm, leg and shoe intervals are too wide or small to certify. A whole-cell fit to 156–162 would apply about 1.07–1.125 to these segments and would move the central torso estimate from 38 to roughly 41–43 px. That creates a torso-size conflict while head and leg estimates remain uncertain. Therefore the body-height miss is exact, but a global fit is not established as an anatomically safe correction. Do not call it solved by the head probe: the current probe is 0.966 overall (0.942–1.000 frame range) and measures neither the explicit height target nor the hidden joints.
- **Guard v09, 2 frames:** actual packed height is 132 px against 150–158 (18–26 px short); packed visible head is 34±2 versus combat about 40–41, torso 34±2, leg chain 56±6, shoe 23±2. In raw v09, visible crown `(493,146)` to chin `(511,340)` is about 195±6 px over a 754 px occupied figure; visible soles are at y900. Normalizing that source ratio to a 40 px head predicts about 155±5 px overall, which overlaps but does not fully fit the requested height band. Raw visible hip `(483,530)`, knee `(574,658)`, ankle `(632,792)` gives a 303±18 px leg chain; at head 40 this is about 62±5 px. The hip remains clothing-obscured. This is the strongest measurable **source-versus-fit** signal: the upright source proportions can plausibly meet target height, while the selected packed fit is 132 px with an undersized head. A hypothetical factor from 132 to 155 is about 1.174; it would also move the 23 px shoe to about 27 px, at or beyond the 25±1 px footwear center and outside the round-4 ±4% shoe band. Treat this as a calibration/contact investigation, not authorization for a blanket rescale or a numeric PASS.
- **superDash v08, 2 frames:** strict head gate is 0.832 and actual packed bounds are 99–100 px. Visible head is 34±2; leg chain 44–45±6, projected head-scaled estimate 52–53±8 versus baseline 61±6. These intervals overlap; shoulder/hip are concealed and the torso is pitched. The head fit is a robust calibration HOLD, but current evidence does not prove the body anatomy is the source defect. Keep its final one authorized call unused until Claude provides a definite visible segment/contact failure.
- **Stagger v07, 4 frames:** visible shoes 29–30±2 against idle 23±2 are a definite difference within the *candidate pair* (lower ratio at least 27/25 = 1.08), but not a robust failure against the approved/shipped shoe reference because its uncertainty interval overlaps. Arms/legs are partly occluded. Independently, the exact ordered atlas cells show a motion discontinuity: f2 dangling arms transitions to f3 recovered guard; the f3→f0 loop then abruptly drops back to dangling/slumped arms. This source sequence issue cannot be fixed by atlas calibration. Generation budget is exhausted; preserve it and request explicit pose-direction review rather than another call.
- **Win v05, 4 frames:** recorded fit used factor 0.8865 after an initial automatic reading of head 1.13 and feet 1.32; the packed head is now about 1.005, while footwear probe remains about 1.179. Visible packed shoe is 24±2 against 25±2, a wide overlapping interval, and hands behind the head hide wrists/elbows. Current evidence establishes that the fit corrected the head probe, but neither proves footwear failure nor certifies full-body anatomy. Keep the two calls unused pending segment-specific/contact evidence.

The candidate crop measurements above come from Astra's direct quantized-atlas bounds and the native-pixel hand audit in `art/characters/killua/production/round4/QA.md`. For ratio decisions use conservative intervals; hidden joints stay unknown. Garment-area/body-sheet flags and head-color probes are not segment measurements.

## Remaining call budget

| Asset | Cumulative recorded calls | Authorized remaining | Decision |
|---|---:|---:|---|
| idle v11 (A/B parts) | A9 + B9 + prior separate f0 fix 1 | 0 | Exhausted; no generation |
| guard v09 | 5 | 1 | Preserve pending calibration and contact evidence |
| superDash v08 | 4 | 1 | Preserve pending definite visible-segment evidence |
| stagger v07 | 7 | 0 | Exhausted; motion issue is not calibration |
| win v05 | 2 | 2 | Preserve pending segment/contact evidence |

Do not treat the unfiled stagger attempt as available budget. The complete call history and selected references are in `generation-record.json`; approved fixed-name references retain their recorded hashes.

## Requested Claude actions

1. Reproduce the two atlas hash checks above against the delivered review inputs and verify the candidate metadata is paired with the same diagnostic sheet. Keep the shipped atlas as the comparison baseline.
2. For idle and guard, report the source-to-packed transform and measured native contact points/segment lengths beside the approved combat cell and shipped idle at the same pixel density. Reconcile the exact 156–162 / 150–158 occupied-height targets with head, torso, leg-chain and footwear measurements. Show which values come from visible source landmarks and which come from fit/placement. Do not infer covered scalp, shoulder or hip points.
3. Decide whether the idle shortfall can be corrected by an evidenced fit while the torso remains within the contract, or whether the current drawing itself must be held for review. For guard, investigate why a source ratio predicting about 155±5 lands at 132 in the diagnostic atlas; demonstrate the output coordinates/fit that account for the difference. Any calibration result needs a fresh quantized diagnostic crop and the same segment/contact table before it can clear.
4. For superDash and win, check the depicted striking/supporting shoe and hand/foot contact landmarks against the move/stance reference. Distinguish source anatomy from frame fit. Do not spend their remaining calls without a named segment whose uncertainty interval is wholly outside tolerance.
5. Preserve stagger's 3→0 arm/pose reset as a separate motion HOLD for user direction. It has no generation calls left, and scale calibration cannot repair that pose transition.
6. Report per-frame contact/pose result and remaining uncertainty for each of the five strips. All five stay `needs review` / HOLD unless a later evidence pass clears the stated anatomy and technical conditions; no audit pass substitutes for user image approval.

This handoff makes no changes to source art, image versions, bodyHeight, offsets, raw sidecars, hitboxes, packer, public output, approval state, main inbox, or main NOW. No new-source failure has been established that would justify generation before Claude's calibration/contact pass.
