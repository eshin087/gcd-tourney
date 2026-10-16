# Gojo dash v09 — final atlas anatomy audit

Date: 2026-10-15. Auditor: GPT-6 Astra, medium. Branch: `art/gojo-run`.
Worktree: `E:\Vibe Coding\Claude Code\gcdTourney\.worktrees\art-gojo-run`.

**Verdict: HOLD.** This is a technical audit of dash v09 only, not image approval. Direction K is not approval. A reported passing head/scale gate does not clear the anatomy, pose, or loop findings below.

## Exact inspected evidence

SHA256 independently checked during this audit:

| File | SHA256 |
|---|---|
| `art/characters/gojo/raw/dash_v09.png` | `56C50DC259FC60CE8D7791C7221F549B40E5E1ECDAB4155302FAABF563918727` |
| `public/characters/gojo/sheet.png` | `7CB18EB86F22FAAF9ABF05BEA18EC21C500CF51D1B7637B5CD4082B290C52252` |
| `art/characters/gojo/reference/title_neutral_approved.png` | `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0` |
| `public/art-review/title-style-pilot/gojo-combat_v01.png` | `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656` |
| `art/characters/gojo/reference/idle_approved.png` | `6c1ec47c2c1e2b7df2d3aa6ccf2256e46dc93bdd8e426607f2990f6f963913bb` |

`anims.json` assigns dash to atlas indices 16 and 17, durations 60/60 ms, loop true. The inspected 4096 x 2816 atlas has 256 px cells, 16 columns, pivot [128,240], ppu 128. Thus dash f0 is crop (0,256,256,256), f1 is (256,256,256,256). Idle f0 is atlas index 0. I decoded those pixels directly and displayed them beside the approved neutral/combat cells at the same density, using nearest-neighbor enlargement only. The raw approved idle was inspected for identity and garment construction; numerical idle comparisons below use its packed atlas f0, not raw source pixels at a different resolution.

Contract: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`, ADR 0029, and main's current Gojo phase-2 inbox. The title-style cells govern anatomy; posed height is not standing body height.

**Cached frame mismatch:** `frames/dash/dash_00.png` and `_01.png` are not pixel-equal to atlas cells 16/17. Their occupied bounds are respectively x72..235/y67..240 and x47..207/y68..240, versus the actual atlas bounds below. Their poses also differ visibly. They must not be presented as the audited quantized frames. This audit does not infer how that mismatch arose or alter those files.

## Measurements and uncertainty

Exact alpha extents from the decoded atlas, inclusive endpoints:

| Frame | Bounds x/y | Occupied width x height |
|---|---|---|
| Idle f0 | x80..182, y10..240 | 103 x 231 px |
| Dash f0 / index 16 | x54..196, y67..240 | 143 x 174 px |
| Dash f1 / index 17 | x30..163, y67..240 | 134 x 174 px |

No dash clipping at the cell edges. Both reach y240. These are pose envelopes, not skeleton scale measurements. Exact envelope width decreases 9 px in f1; it does not demonstrate the requested 6 px wider stride.

The following are **manual projected landmark estimates in native atlas/reference pixels**, not automated anatomical passes. Visible endpoints and overlap ambiguity give roughly ±3 px for head/shoes, ±5–7 px for clothed torso and limb chains. Values are rounded; a range overlapping a tolerance is inconclusive. Shoulders/pelvis are hidden by clothing; no inferred bone length is claimed.

| Feature | Approved neutral | Approved combat | Packed idle f0 | Dash f0 | Dash f1 |
|---|---:|---:|---:|---:|---:|
| Head including hair, approximate width | 38 ±3 | 39 ±3 | 39 ±3 | 37 ±3 | 37 ±3 |
| Hair tip to chin, approximate height | 39 ±3 | 40 ±3 | 40 ±3 | 38 ±3 | 38 ±3 |
| Collar base to central jacket hem, projected axis | 70 ±6 | 68 ±6 | 69 ±6 | 51 ±6 | 52 ±6 |
| Visible bent pocket-side upper arm + forearm, projected chain | 70 ±7 (relaxed) | 62 ±7 (bent) | 66 ±7 (relaxed) | 62 ±7 | 59 ±7 |
| Forward leg hip/knee/ankle projected chain | 111 ±7 (straighter leg) | 109 ±7 | 105 ±7 | 99 ±7 | 101 ±7 |
| Forward shoe, heel-to-toe silhouette | 34 ±3 | 34 ±3 | 34 ±3 | 34 ±3 | 34 ±3 |

Torso measurement anchors, approximately: neutral collar (126,52) to hem (129,122); combat (130,72) to (124,140); idle (131,56) to (136,125); dash f0 (159,107) to (130,149); dash f1 (123,108) to (95,152). These track visible garment landmarks rather than a hidden spine. Dash axes are about 24–26% shorter than idle in projection. Hunch, rotation and hem movement contribute uncertainty, but the drawn torso appears compressed between head and pelvis; it cannot be certified within ±6% or treated as a clean scale match. Do not fix it by stretching the whole leaning pose.

The forward leg chains overlap the idle uncertainty interval, so there is no defensible isolated leg-scale failure from those numbers. Equally, the uncertainty exceeds a strict ±6% certification. The bent rear leg and rear shoe are foreshortened/overlapped and are **skipped for anatomical length certification**. The free right upper arm/forearm in f1 is hidden and is **unmeasured**, not a numeric pass. Shoulder breadth, torso depth and hidden left/right joint origins are likewise not numerically certified. No silhouette-area proxy is used as proof of clothing or body volume.

## Frame and loop findings

1. **Arm identity / K pose — HOLD.** In f0 the visually foreground arm bends back to a visible wrist/hand at the hip, while the opposite arm reaches forward with a fist. In f1 the same foreground pocket-side arm remains, and the free pumping arm is no longer separately visible. This does not demonstrate the prescribed far L hand pocketed continuously and near/camera-side R arm visibly bent and pumping. Occlusion might explain a hidden limb, but is not proof of the requested identity. The pocket hand remains at the hip in both frames; whether it is actually inserted rather than resting on the pocket edge is low confidence. f0's visible free fist is forward, not the requested hard backward pump.

2. **Torso / build / clothing — HOLD for scale confidence.** Head/hair size is visually consistent with the approved cells; no K-study-style hair inflation is apparent. The adult face, blindfold, high collar, dark jacket, trousers and shoes remain recognizable. However the shoulder-to-pelvis region reads shorter and more compact than the references. Bending explains the lower overall height but does not by itself certify the shortened garment axis. Jacket hem and waist overlap obscure a clean pelvis landmark. Clothing volume is not visibly ballooned, but full build preservation is not established by head agreement.

3. **Legs — structurally plausible, identity unverified.** Both frames have two readable legs with plausible knees/ankles and no obvious extra limb. The same prominent forward leg and darker bent rear leg persist; shade/overlap do not establish anatomical L/R independently of the arm ambiguity. Dash need not reproduce the run's eight-frame alternating gait, but these two cells also do not show a simple 6 px stride extension: the leading knee changes substantially from tucked/horizontal thigh to lowered diagonal thigh.

4. **Loop / registration — HOLD.** Head center moves approximately x169 to x133 (−36 ±3 px), at essentially the same y. The hip/pocket region also moves left about 34 ±5 px. At 60 ms per frame, the repeated 0→1→0 sequence therefore makes a large horizontal upper-body jump in pivot coordinates. Width decreases while the forward knee opens considerably and the free fist disappears. This exceeds the requested subtle wider-stride/hem-flutter pair and is not a smooth two-frame loop. This judgment is from both actual atlas cells and their timing/placement data; no live game playback or runtime contact check was performed.

5. **Technical distinction.** `phase2_dash_qa_v01.json` reports a successful quantized pack and 48-color palette. This audit did not rerun or change the packer. That reported gate result is separate from this anatomy/pose HOLD. Existing down/KO/light2 warnings are outside this audit's dash-only scope.

## Required disposition

Keep dash v09 unapproved and on technical hold. Parent/coordinator should reconcile cached-frame evidence, route the torso/registration/pocket-arm findings to Luna/Claude within the existing cumulative attempt budget, and obtain another Astra audit of the exact final atlas after any permitted correction. Do not generate another attempt merely because this audit failed; remaining authorization/budget must be checked. Claude owns runtime contact and tooling/calibration decisions. User review remains required after technical resolution.

Main handoff rules and inbox were checked; lane is `gojo-run`. As a subagent I do not ring the lane. The parent owns the committed handoff and any single notification, preserving the inbox BLOCKED brake and any explicitly authorized review-package notification. No asset, manifest, review row, animation metadata, or runtime output was changed by this audit.
