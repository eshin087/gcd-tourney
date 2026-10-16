# Gojo run v14 — Astra final atlas audit

Date: 2026-10-15. Auditor: GPT-6 Astra / medium. Branch `art/gojo-run`; inspected commit `65ff1ea1`.
Worktree: `E:\Vibe Coding\Claude Code\gcdTourney\.worktrees\art-gojo-run`.

**Verdict: PASS for visible atlas anatomy and discrete-frame continuity, with the evidence limits below.** The v13 f6 arm-disappearance HOLD is resolved. No new visible defect was established in v14. This is not a claim of strict ±6% certification for hidden or foreshortened anatomy, live browser playback, runtime contacts, user approval, or merge readiness beyond this audit's scope.

The task explicitly accepts the same lead leg every step and the fist held forward every frame. Those choices are recorded, not failed. V14 duplicates Part A for the second half, so the previous B-half vertical mismatch is absent. No image approval is inferred from this technical verdict.

## Exact inspected evidence

| File | SHA256 |
|---|---|
| `art/characters/gojo/raw/run_v14.png` | `031A7DA4E5B7C670B5A55B0217C837E7D1CD05AAA017D16FE711C2A41E1DF170` |
| `public/characters/gojo/sheet.png` | `F20E42CB8DB1D7A1A109AFB2CF6FEF5B2548579DB5604797AA1C8F1C4D11094F` |
| `public/characters/gojo/anims.json` | `559F8DC7F4065970930D703A79DAB7E8990FD611B4B2C5ABE153AA2F632728FB` |
| `art/characters/gojo/raw/run_v14.json` | `ce071d9a2c536617a0a31ee5f5bc657a28e382e4550fe14d44eafeb3b641ffef` |
| `art/characters/gojo/reference/title_neutral_approved.png` | `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0` |
| `public/art-review/title-style-pilot/gojo-combat_v01.png` | `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656` |
| `art/characters/gojo/reference/idle_approved.png` | `6c1ec47c2c1e2b7df2d3aa6ccf2256e46dc93bdd8e426607f2990f6f963913bb` |
| `public/reviews/gojo-run-jkl/run_v14_loop_v01.gif` | `01f07a92d8e01877ba47eb395eaac92ae999023ccd299dbc027aeacce1197cb6` |

All hashes above were read during this audit. The approved neutral/combat and idle reference hashes are unchanged from the v13 audit. The current atlas, not old cached frame images, is the source of every run observation below. Its dimensions are 4096 x 2816; 256 px cells, 16 columns, pivot [128,240], ppu 128. Run metadata assigns slots 8–15, eight durations of 60 ms, loop true. F0 is crop (2048,0,256,256), f6 is (3584,0,256,256); general fN crop x=(8+N)*256,y=0. Packed idle f0 is slot 0.

I decoded and visually inspected all eight actual atlas cells at native density and nearest-neighbor 2x display, with the approved neutral/combat and current packed idle at the same density. The larger raw idle strip supplies identity/provenance, not a mismatched-resolution numeric comparator. Contract remains `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md` / ADR 0029, not old standing-height or universal head-ratio targets.

Only this report was written. No generated image, packer output, sidecar, manifest, approval row, shared body report or other file was changed by this audit. No packer run, generation, commit, ring, merge or deployment was performed.

## Frame measurements

Exact occupied bounds are inclusive. Envelope height is a posed extent, not a standing-body measurement. Palette hair-box dimensions and ratios are quoted from the current atlas metadata's `scaleAudit.anims.run`; they are not skull/bone dimensions or a full-anatomy pass.

| Frame / slot | Occupied x / y | Width x height | Opaque pixels | Hair probe W x H | Head ratio |
|---|---|---|---:|---|---:|
| f0 / 8 | 57..209 / 38..240 | 153 x 203 | 9225 | 36 x 21 | 0.993 |
| f1 / 9 | 71..193 / 36..240 | 123 x 205 | 8730 | 34 x 21 | 0.971 |
| f2 / 10 | 58..194 / 37..240 | 137 x 204 | 8852 | 34 x 21 | 0.971 |
| f3 / 11 | 51..193 / 31..212 | 143 x 182 | 8768 | 36 x 21 | 0.999 |
| f4 / 12 | 57..209 / 38..240 | 153 x 203 | 9225 | 36 x 21 | 0.993 |
| f5 / 13 | 71..193 / 36..240 | 123 x 205 | 8730 | 34 x 21 | 0.971 |
| f6 / 14 | 58..194 / 37..240 | 137 x 204 | 8852 | 34 x 21 | 0.971 |
| f7 / 15 | 51..193 / 31..212 | 143 x 182 | 8768 | 36 x 21 | 0.999 |

Run's recorded head median is 0.982, feet median 1.018, verdict `ok`, version 14. Feet-frame proxies are [1.047,1.010,1.021,1.015] repeated; these are palette/area-derived ratios, not measured shoe lengths. The atlas contains 48 opaque colors plus transparency. The existing head gate is supporting evidence only.

No clipping: minimum left margin 51 px, right margin 46 px, top margin 31 px, bottom margin 15 px. Grounded phases reach y240. Flight f3/f7 bottoms are y212, consistent with the sidecar's -28 px lift. Hair-probe x centers are [166.5,166.5,166.5,167.5] repeated, a 1 px range. Y centers are [50,49,50,43] repeated. There is no B-half vertical step and no previous large horizontal body slide.

### Manual anatomy estimates and uncertainty

These are rounded **projected visible landmark estimates**, not recovered skeletal lengths. Typical uncertainty is ±3 px for hair/shoes and ±6–8 px for clothed torso and limb chains. Pose rotation, bent joints, garment compression and overlap make direct standing-versus-running ratios insufficient to certify hidden anatomy.

Approved neutral/combat/packed-idle estimates remain: hair tip to chin about 39/40/40 ±3 px; collar base to central jacket hem about 70/68/69 ±6 px; visible shoulder-elbow-wrist chains about 70/62/66 ±7 px; more extended hip-knee-ankle chains about 111/109/105 ±8 px; side-facing heel-to-toe shoes about 34/34/34 ±3 px.

| Run frames (identical pairs) | Collar-to-hem axis ±6 | Visible pocket-side arm chain ±7 | More readable leg chain ±8 | Shoe estimate |
|---|---:|---:|---:|---|
| f0 / f4 | about 54 | about 61 | about 94, forward leg | forward heel-to-toe about 38 ±3 |
| f1 / f5 | about 54 | about 61 | about 90, support leg | forward shoe about 35 ±3 |
| f2 / f6 | about 53 | about 60 | about 91, extended leg | rotated/lifted shoes: skip strict length certification |
| f3 / f7 | about 52 | about 60 | about 82, projected rear chain | rotated/foreshortened: skip strict length certification |

Example run f0 garment landmarks: collar base near (159,84), central hem near (145,136), approximately 54 px; packed idle near (131,56) to (136,125), approximately 69 px. The run garment axis is shorter in projection; this does not prove a corresponding skeletal shrink. It is essentially the same posed-torso uncertainty documented for v13, not a newly established defect. Do not stretch the full pose to a standing height. These values do not demonstrate a strict ±6% full-body pass.

The free forward arm is visibly continuous in all four distinct poses and both halves, with a bent elbow and fist. Its shoulder origin overlaps the chest and is not clear enough for reliable separate upper-arm/forearm lengths; those segments are **not numerically certified**. Folded thighs/shins, far joint origins, pelvis under the jacket, pocketed fingers and rear shoe depth are likewise explicitly skipped for strict certification. Hair silhouette/head size appears consistent with the approved samples; no previously observed enlarged-hair passing phase is present. Clothed torso width/build and folds remain visually stable through the sequence, without a new swelling/collapse. No disconnected limb, extra leg, reversed knee or detached shoe was found.

## Every frame and loop transition

| Frame | Observation |
|---|---|
| f0 | Forward contact/extension; separate bent rear leg. Pocket hand remains at hip and forward free fist is visible. |
| f1 | Down/support pose; rear knee folds. Pocket sleeve/hand and forward sleeve/forearm/fist remain separately readable. |
| f2 | Passing/high-knee pose; both legs distinguishable despite overlap. Free arm and fist remain visible. |
| f3 | Flight pose; both feet above the floor after the explicit offset. Both arms retained; no cell clipping. |
| f4 | Exact RGBA duplicate of f0. Same leading leg is an accepted choice. |
| f5 | Exact RGBA duplicate of f1. No second-half body-scale or vertical-registration change. |
| f6 | Exact RGBA duplicate of f2. **The v13 missing free arm/fist is resolved:** the forward sleeve, forearm and fist are present. |
| f7 | Exact RGBA duplicate of f3. Pocket hand remains at the hip; free fist remains visible through return to f0. |

Pocket-side hand stays at the pocket opening throughout; no frame shows it swinging away. Fingers/insertion depth and anatomical L/R origins remain partly obscured by the 3/4 overlap, so these are visual continuity findings rather than hidden-joint measurements. Two legs remain readable. Same leading leg and persistent forward fist are preserved as explicitly accepted.

Transitions inspected: 0→1, 1→2, 2→3, 3→4, 4→5, 5→6, 6→7, 7→0. The 3→4 and 7→0 seams are pixel-identical transitions from flight back to contact. Their hair center moves roughly (-1,+7) px, with the feet returning to y240; no additional second-half pop occurs. The step pattern is four distinct poses repeated twice, not an alternating eight-pose gait. That is disclosed and accepted; it is not a newly invented smoothness guarantee. The 5→6→7 arm dropout from v13 is absent. No new visible seam defect was established in discrete-frame inspection.

Decoded crop hashes, SHA256 over row-major 256 x 256 RGBA bytes (not encoded PNG bytes):

| Frames / slots | RGBA SHA256 |
|---|---|
| f0/f4, slots 8/12 | `bf7f58851a99069b41aa07381ef6ae61a1f04bb2ea195fce01fdb5ea3608ed3c` |
| f1/f5, slots 9/13 | `4cbb652d3d71e3dcc4b41830e47762a94aed7f0249323ab377c49c3cc5f84c65` |
| f2/f6, slots 10/14 | `ac9ee427aa2be91d96ca162820cf3a5b3d130ed11cc6a75a9ba22de19da12ba7` |
| f3/f7, slots 11/15 | `bf9563b11e5d14878a18187de9f5bae1bad51f1ad0fd3cbe9a14f1abed2142fe` |

## 60 ms loop evidence and limits

The v14 review GIF is eight frames at 60 ms each (480 ms metadata loop; 240 ms distinct repeated visual cycle). I decoded every GIF frame, sampled its 512 x 512 image at native 256 px density, and compared every opaque atlas pixel: **zero RGB differences in all eight frames**. The GIF therefore depicts the exact audited sprites and timing, rather than another candidate or cached frame set.

Live playback remains **unverified**. The same browser route failed during the immediately preceding v13 audit (IAB unavailable; Chrome localhost `net::ERR_CONNECTION_TIMED_OUT`). This v14 audit verifies GIF timing, pixel correspondence, all frames and all discrete transitions; it does not claim a successful new live-browser playback, real-time smoothness observation or in-game contact/hurtbox check. Parent/Claude should preserve that distinction when handing off the PASS. Passing this visible-atlas audit is not a strict numeric certification of every occluded segment.

## Handoff

PASS of the inspected visible art: v13's demonstrable arm-disappearance defect is fixed, with no new visible defect found. No further image call or art edit is recommended by this audit. Parent owns committing the report and sending the scoped `gojo-run` handoff; Claude owns technical disposition, live playback/runtime checks and integration. User approval remains its separate process.

Main's current AGENTS relay/status rules, Gojo inbox, Every thread and coordination records were checked. Lane `gojo-run` is mapped, relay #7 is current, watcher reported on. This subagent did not ring. The central approvals/status chat is Claude `0 - Approvals`; no new coordinator or monitor was started.
