# Sasuke title-style corrections, round 2

**2026-10-12 approval update:** the user approved heavy v11, backDash v07, charge v12, block v07, throw v07, stagger v08, specialUp v09. These artworks are approved; technical/contact holds and other candidate decisions remain separate. See ../../round2-approvals/APPROVALS.md. Original QA findings below are retained as historical evidence.


2026-10-11. Existing worktree `art/sasuke-title-production`, PR71, port5222. Main was merged before production. User-authorized extra generation budget is two calls per image/part, cumulative with the earlier inventory. No candidate below is approved. Claude owns integration and contact/hurtbox migration.

## Recommended candidates

| Asset | Candidate | Native frames | Strict head median | Observations |
|---|---|---:|---:|---|
| heavy | v11 | 8 | 1.026 | f3/f4 retain a continuous thigh, shin and sandal; f4 raised leg does not become a stub. Measured B/A stitch factor0.9514, final B/A0.965. |
| backDash | v07 | 3 | 0.998 | Combat crouch 154–168px posed height, no upright pop. Uniform head-fit factor0.9328 is tool-measured. |
| charge | v12 | 4 | 1.047 | Lean torso and arm build, 176–180px combat height; loop has no added aura or camera zoom. |
| throw | v07 | 4 | 0.960 | Complete poses, small pose-dependent foreshortening; all pixels inside x4..251. |
| block | v07 | 2 | 1.031 | Both180px combat crouch poses replace the tall upright guard transition. Arms leave head readable. |
| specialUp | v09 | 6 | 1.009 | Strict ok on readable f0-f3; f4/f5 genuine wrist/raised-arm head misreads only. Measured stitch0.9735 and uniform auto-head fit1.0834. |
| stagger | v08 | 4 | 0.979 | Four right-facing phases; upright height205–216px versus209px neutral, no frontal turn. |

Combined unchanged strict fixture pack: exit0, `1 ref, 7 ok`, 39 frames,48 colors, every frame x4..251, y4..240. Actual quantized native contacts and loops were inspected; exact approved combat and neutral cells are visible alongside candidates. `metrics-strict.json` records every frame's bounds and pre-quantization head audit; head-gate success alone does not certify anatomy.

Native anatomy crosscheck: heavy f3/f4 are additionally enlarged with nearest pixels. Joint locations are estimated from visible costume folds, with ±4px uncertainty per landmark: f3 hip(134,127), knee(197,91), ankle(238,73); f4 hip(137,129), knee(173,77), ankle(192,39). Corresponding two-segment chain lengths are about118px and105px. Neutral hip(128,135), knee(117,186), ankle(111,230) gives about97px; combat idle bent thigh/shin landmarks give roughly105–115px. Pose projection and hidden joints make the f3 difference uncertain, but neither high-kick shin collapses into the former shortened chain. This is a manual plausibility comparison, not a precise skeleton certification. Raised sandals' major-axis lengths are roughly23–27px; reference forward sandal33px wide and rear sandal19px wide vary with rotation. Block/charge forward sandals are about33px wide, rear20–23px. The feet-color area proxy rises to1.37 on block/charge because toes expose more skin; it is not a foot-length measurement or exemption. Torso/shirt width and thigh/shin anatomy remain close to the approved lean build. Recheck these at native size during user review/contact QA.

The combined strict report's scale warning is a stale block exemption for v01. It is not applied to v07; v07 measures `ok`. Only the separately proved specialUp f4/f5 true probe-misread reasons were updated; no manual scale pass was invented.

## Held candidates: do not approve for shipping

| Asset | Latest saved | Reason |
|---|---|---|
| launched | v07 | Rotated head remains unmeasured/low confidence. Compact retry resolves clipping; numeric scale and manual anatomy certification remain absent. |
| down | v08 | Prone head remains unmeasured. Native original pose retained, but floor band warns9% within6px and worst fifth11px above floor. v08 merely separates intact figures from v07 at factor1; source SHA256 in sidecar. |
| ko | v07 | Prone head unmeasured; old64px body fit makes head/torso visibly too small beside new idle. Floor band18% within6px, worst fifth24px. Original pose retained; no guessed rescale. |

Full `node tools/pack-sprites.mjs sasuke --quantize 48 --strict-scale` exits1 on these three, leaves official sheet/frames at last pack. `reports/full-fighter-strict.txt` is the exact output. Approved original versions remain in manifest approvals, but the latest held raw files prevent a new full pack; Claude must resolve candidate selection/manual checks before integrating. The review's diagnostic atlas is explicitly WARN ONLY. Its disposable fixture records held versions as accepted solely to make diagnostic pixels viewable; production manifest approval, gate thresholds and manual records remain unchanged. Nothing in that diagnostic output proves a pass.

SpecialUp remaining A call would not resolve B's raised-arm head misread; do not burn it to compensate for tooling. v09 is a measured re-stitch with unchanged v08 source images: A f0 crown435/chin565 =130px, A f3 crown192/chin319 =127px; B f0 crown256/chin395 =139px, B f1 crown223/chin348 =125px in native1672x941 source coordinates (B width1671). Median128.5/132 gives0.9735; ±6px per landmark accounts for spiky crown and tilted jaw. These manual source measurements are separate from the failed color probe. Native v09 shows broadly consistent heads/torso/limbs across parts. With two versioned frame-only true probe-misread reasons, the remaining readable heads initially measured uniform0.923; the tool-measured whole-figure fit1.0834 then gives strict ok1.009. This is a numeric pass for readable frames only, not a numeric certification of hidden f4/f5. No whole-strip exemption or manual pass is applied. Claude reproduction: use the factor/reason/landmarks/uncertainty recorded in `raw/specialUp_v09.json` with `npm run stitch -- sasuke specialUp v09` (dry-run to avoid overwriting), then the full strict command above. Sources `_parts/specialUp_v09_A.png` and `_B.png` are identical to v08. See sidecar and native diagnostic contact. No tools were edited. Only f4/f5 have version9 probe-misread exemptions.

ROI proof: `specialUp-v09-probe-rois.png` has prefit row on top and final fit below; columns idle, f4, f5. Red boxes are the actual automated wrong hair bounds; green boxes manually enclose real crown-to-chin heads with ±4px uncertainty. Final f4 actual head roughly41x41px, f5 roughly42x40px, against idle39x38px; partial occlusion/tilted jaw means these are approximate only. f4 probe x131..152,y79..104 encloses navy wrists above real head x139..179,y105..145; f5 merged x109..164,y28..85 includes raised arms above real head x123..164,y50..89. Source posture changes explain their exposed silhouette, not a head resize. Endpoint contact `specialUp-v09-airHeavy-v04-endpoint.png` is idle/newf5/approvedairHeavyf0: clasped hands, arch, tucked lead knee and hanging leg match. Approximate shoulder-to-rope span47–50px versus neutral about50px, hanging hip-to-knee-to-ankle chain about82px versus airHeavyf0 about74px with ±4px joint uncertainty. Pose projection limits exact skeleton inference. Postfit all six frames inside x4..251,y4..240; no clipping or margins. One active frame still falls back to inferred front strike box; Claude must check contact boxes before integration.

## Cumulative generation inventory

| Asset/part | Before this round | Calls this round | Saved versions | Remaining extra authorization |
|---|---:|---:|---|---:|
| heavy A | 3 | 1 | v11 A | 1 |
| heavy B | 2 | 1 | v11 B | 1 |
| backDash | 2 | 2 | v06,v07 | 0 |
| charge | 2 | 1 | v12 | 1 |
| throw | 3 | 2 | v06,v07 | 0 |
| block | 3 | 2 | v06,v07 | 0 |
| launched | 3 | 2 | v06,v07 | 0 |
| down | 3 | 2 | v06,v07; v08 assembly, no call | 0 |
| ko | 3 | 2 | v06,v07 | 0 |
| specialUp A | 3 | 1 | v07 A; v08/v09 A identical copies | 1 |
| specialUp B | 3 | 2 | v07 B,v08 B; v09 B identical copy | 0 |
| stagger | 3 | 2 | v07,v08 | 0 |

All20 calls, source paths and complete prompt blocks are in `generation-calls.json`; the current asset inventory is `jobs.json`. Each saved strip has a REVIEW row, including failed/intermediate versions; none deleted or overwritten. Sidecar-only measured fits and factor1 assembly consume no generation call. Prior claims/counts are from the existing title-style QA/attempt history. Unused calls remain unused once an asset passes or the remaining call cannot address the evidenced failure.

## Evidence and limits

`finish.mjs` and `probe.mjs` reproduce isolated fixtures from canonical raw inputs and approved idle v07 with unchanged thresholds. Duplicate fixture/pack directories are disposable and excluded from commits. All review atlas images are packer outputs, not hand edits. `npm run scale` against the strict fixture reports zero flagged strips; linked heads are exactly that candidate atlas. `npm run lineup -- --candidate ...charge-f0.png --scale1 ...` appends the actual new charge cell at factor1. Existing cast columns are the currently packed mixed/older files in this worktree; old shoulder-class/common-height warnings are superseded by ADR0029 and do not certify the new title-style cast. New character build decisions must use the four approved title cells, not those historical numerical class bands.

No spin, airRecover, superPose, UI, other fighter or ART-TECH-01 sources changed. Reference approval does not approve these strips. Runtime scaling/contact data remains for Claude's QA.

Final verification: local Vite adapter production build passes. The candidate review page provides native-size playback and frame stepping, with every quantized contact inspected offline. Browser/gameplay validation remains a limitation: the in-app browser cannot reach localhost5222 (connection timeout), and the sandbox HTTP probe reports forbidden socket access. This is not a gameplay pass; Claude still checks visual transitions, grounding and contact/hurtboxes in game. Preview publication is separate from image approval and production integration.
