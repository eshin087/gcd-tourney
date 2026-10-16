# Sasuke post-calibration audit, 2026-10-15

**Final anatomy verdict: HOLD on all four candidates.** The prior superDash fist clipping is resolved. jumpSquat06 has an extended-arm proportion concern supported by the conservative whole-chain comparison below; the other three have unresolved measurement uncertainty rather than a demonstrated redraw-level failure. This audit does not approve art or change Claude's jumpSquat v06 manual QA.

## Identity and evidence

Audited branch art/sasuke-title-r3 at ffb6abfd94ed30ad1fac277f5b6833e7709b8e1b. Actual quantized production atlas sheet SHA256 a2a8faed1e07f105bfa0db9e3bb401217a3e47b43363ff5aad9ea82c8822f55e; anims SHA256 3e6cc01adaffda8bf101e1412ad708af3c65d9f3a4d4d9a303c3756c593334bb. Both match Claude's calibration handoff exactly. [provenance.json](provenance.json) hashes all four selected raw PNGs, both exact approved title-style cells and the approved fixed-name idle. Manifest identifies idle v07 as approved. Strict pack PASS is Claude's recorded result, not a command rerun by this audit.

All eight scoped cells were extracted directly from those atlas indices, not cached frames: superDash07 f0/f1, jumpSquat06 f0, beamFire07 f0/f1/f2, dash07 f0/f1. Native PNGs, nearest-neighbor 3x versions and coordinate grids are saved here. [All frames, 2x](all-2x.png): row1 idle/superDash0/superDash1; row2 jumpSquat0/beamFire0/beamFire1; row3 beamFire2/dash0/dash1. Reference neutral/combat grids are at exactly the same pixel density. No fit-to-height normalization was used.

## Measurement method and limits

[measurements.json](measurements.json) contains every manually selected endpoint. H is the **visible outer hair-tip-to-chin axis**, retaining the prior audit's convention; hidden skull crown is not measurable here and H is not a skull-size certification. T is the projected collar-base-to-belt-center axis. NA/FA are near/far visible upper-arm / forearm lengths; NL/FL are corresponding thigh / shin lengths. N/F describe visible chains, not confident anatomical left/right assignment. S is the side-facing sandal heel-to-toe horizontal extent including endpoints. Garment area is not used as a limb measurement.

Per-length uncertainty: H ±5 px; T ±7; each arm segment ±10; thigh ±12; shin ±10; S ±2. Joint estimates are deliberately low confidence where shirt/trousers conceal the joint. The summed shoulder-to-wrist chain uses ±10 px total for the nearly straight jumpSquat and neutral arms: elbow displacement trades upper/lower lengths and is not counted twice; endpoints dominate. This narrower whole-chain interval must not be substituted for individual-segment precision. Numeric success requires the entire relevant ratio interval inside 0.94–1.06; central-value agreement alone is insufficient.

| cell | H | T | near upper arm / forearm | far upper arm / forearm | near thigh / shin | far thigh / shin | S |
|---|---:|---:|---|---|---|---|---:|
| neutral | 42.2 | 46.1 | 36.8 / 25.7 | 35.9 / 24 | 45.4 / 30.1 | 43.6 / 32.8 | 28 |
| combat | 40.9 | 43 | 27.7 / 18 | 26.9 / 26.6 | 38.9 / 35.8 | 41 / 35.3 | 29 |
| idle-0 | 43 | 45 | 23.7 / 19.9 | 27.7 / 25.3 | 43.9 / 35.8 | 43.1 / 34.4 | 32 |
| superDash-0 | 40.5 | 47 | 29.2 / 23.3 | 24.2 / 18.9 | 31.9 / 30.1 | 35.6 / 37 | excluded |
| superDash-1 | 40.5 | 47 | 28.6 / 22.8 | 25.1 / 13.6 | 28.6 / 37.1 | 35.6 / 38.6 | excluded |
| jumpSquat-0 | 44.1 | 47 | 45.2 / 43.5 | excluded | 35.9 / 43.5 | 31.9 / 34.2 | 34 |
| beamFire-0 | 43.8 | 37.5 | 28.6 / 22.2 | 25.1 / 22.8 | 44.8 / 31.8 | 40.3 / 31.3 | 33 |
| beamFire-1 | 44.3 | 37.5 | 28.6 / 23.2 | 27.2 / 21.5 | 44.8 / 31.8 | 40.3 / 31.8 | 33 |
| beamFire-2 | 43.8 | 37.5 | 27.7 / 21.2 | 25.1 / 24.2 | 44 / 31.8 | 40.3 / 31.3 | 33 |
| dash-0 | 43.5 | 45.3 | 37.1 / 37.2 | excluded | 25.6 / 50.6 | 49.2 / 38.9 | 31 |
| dash-1 | 43.5 | 45.3 | 37.1 / 37.2 | excluded | 25.6 / 50.6 | 49.2 / 38.9 | 30 |

## Pose-appropriate comparison and decisions

- **Approved references versus idle:** neutral T46.1 versus combat43 and idle45; all intervals overlap. H42.2/40.9 versus idle43 also overlaps. The neutral profile sandal28, combat29 and idle32 illustrate yaw/edge differences: even the working idle is not an exact numerical surrogate for every approved-cell segment. Preserve those differences as uncertainty, not permission to redefine the approved contract. No reference or idle is newly approved here.
- **superDash07 — HOLD (uncertainty):** H40.5 both frames versus idle43 (central −5.8%); T47 versus combat43 / idle45 (+9.3% / +4.4%). Bent flying posture changes projected leg lengths. Far forearm f1 is folded in depth; near leg f1 crosses the other leg; both shoes are oblique and excluded from a side-sole test. Both arm chains are recorded, but covered shoulders/elbows and folded knees defeat individual ±6% certification. Shirt/sash volume is visually coherent with the approved combat build, with no independently robust new proportion defect established.
- **jumpSquat06 — HOLD (extended-arm concern plus uncertainty):** H44.1 versus idle43 (+2.6%); T47 versus combat43 (+9.3%) / idle45 (+4.4%); S34 versus idle32 (+6.3%, interval32/34 to36/30 =0.941–1.200, inconclusive). Deep squat legitimately shortens the leg projection; do not resize its total height to standing. **Near arm shoulder(145,125)→elbow(102,139)→wrist(62,156) totals88.7px**, compared with neutral near62.5 and far59.9. Against the larger neutral chain, conservative intervals78.7–98.7 versus52.5–72.5 give ratio **1.086–1.880**, above the +6% bound even at the favorable end. The chain is almost straight in the image plane, as are the neutral hanging arms; it is not explained by comparing a straight arm with the foreshortened combat guard. This supports a robust **projected drawing-length concern**, not an exact bone-length claim. The result is conditional on the stated endpoint envelope, only 2.6 percentage points beyond the bound at its favorable edge. [Marked jumpSquat landmarks](jumpSquat-0-arm-landmarks.png) and [marked neutral landmarks](neutral-arm-landmarks.png) show homologous estimated shoulder centers, elbow centers and wrist joints, not the outermost sleeve tips. Hidden shoulder placement could require widening that envelope; recheck those endpoints before deciding on any redraw; no new call is authorized by this audit. Far arm is torso-occluded and excluded. Covered leg centers and torso endpoints remain uncertain. Claude's v06 manualQA concerns head/body/sole and is preserved verbatim; it does not resolve this independent arm comparison.
- **beamFire07 — HOLD (uncertainty):** H43.8/44.3/43.8 versus idle43 (+1.9/+3.0/+1.9%); T37.5 versus bent combat43 (−12.8%), not upright-neutral46.1; interval30.5–44.5 overlaps combat36–50 and idle38–52. This is a shorter central torso estimate, not a robust shortening failure. Near arm28/21–23, far25–27/22–24; leg estimates tabulated. S33 throughout versus idle32 (+3.1%), conservative interval0.912–1.167 cannot certify ±6%. f1/f2 strap gaps do not remove the outer heel/toe silhouette, but warrant the stated ±2px and yaw caveat. Shirt volume, pant volume and silhouette remain coherent across frames.
- **dash07 — HOLD (uncertainty):** H43.5 versus idle43 (+1.2%); T45.3 versus combat43 (+5.3%) / idle45 (+0.7%). Near arm37.1/37.2 totals74.3, longer than neutral62.5 centrally (+18.9%), but chain intervals64.3–84.3 versus52.5–72.5 overlap tolerance; shoulder is under the long sleeve and torso rotates. Flag the long trailing forearm silhouette for review, not a proven defect. Far arm is overlapping/foreshortened and excluded. The forward thigh is strongly projected into depth (25.6) while the shin is diagonal (50.6); these do not establish a bone-length change. S31/30 versus idle32 (−3.1/−6.3%) likewise remains uncertain.

All reference and candidate shoulders are 3/4, twisted or leaning; no frontal deltoid-width measurement is available. Every excluded segment is a limitation, never a numeric pass. All four candidates retain needs review status.

## Assembly, margins and sequence inspection

Every cell has a complete silhouette and no opaque pixel on a cell edge. superDash07 bounds are f0 [69,89,251,240], f1 [67,88,245,240]; right margins **4/10 px**, bottom15. Both fists now close within the cell, and both wrists connect to their forearms; the earlier cell-cut defect is resolved. Other min margins: jumpSquat15, beamFire15 in all3, dash15 in both. Exact four-edge margins are in provenance.json. No neighboring-frame fragment is visible.

Inspected transitions and return-to-start in the extracted frame sequence: superDash0→1→0 (50/50ms), beamFire0→1→2→0 (50/50/50ms), dash0→1→0 (60/60ms). No whole-body scale jump is evident. superDash rear arm/knee alternation is substantial but intentional pose motion; beamFire's sleeve/sash flutter changes outline while head/stance remain stable; dash has only small contour/breathing changes. jumpSquat is one70ms nonloop cell; no internal transition exists. This is frame-by-frame sequence inspection, not browser/gameplay timing or contact verification. Claude owns runtime contact checks.

No raw source, calibration sidecar, manifest, manualQA, hitbox, atlas, packer or approval was edited. No generation, repack, merge or deploy. Documentation/evidence-only change: build intentionally not rerun under the coordinator's scope.
