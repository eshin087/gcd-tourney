# ART-GOJO-DASH-SIZE: Astra atlas audit

Date: 2026-10-17. Auditor: GPT-6 Astra, medium reasoning. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-dash-size`; branch `art/gojo-dash-size`; base HEAD `0c04b89e34339584db067ebcbd54679f8c68dde4`. Candidates: **dash v11 and superDash v13**, unapproved. This report grants no art approval or integration authorization.

## Verdict

**HOLD both candidates against the task-specific size contract.** Head proxies pass in all four frames, but head agreement does not clear the body and shoe requirements. Dash exceeds the feet-proxy ceiling in both frames; its second frame narrowly misses the body floor. SuperDash misses the body floor in both frames and required corrective auto-head fitting outside the permitted factor. Several covered/foreshortened skeletal segments cannot be certified within +/-6%. Those are unmeasured, not passes.

Identity and limb completeness are visually consistent: white hair, blindfold, navy jacket/trousers, black shoes, far hand at pocket and near bent arm ending in a visible fist. No missing limb, detached fist, cross-cell fragment or clipped silhouette was established in any of the four decoded atlas cells. These scoped observations do not override the size holds.

## Evidence and method

Inspected actual `public/characters/gojo/sheet.png` cells located by `anims.json`, at native density and nearest-neighbor magnification; no cached `frames/` image substituted for atlas pixels. Also inspected approved `gojo-neutral_v01.png`, `gojo-combat_v01.png`, and packed idle v08 f0. Read the production contract, main's current task inbox and older `production/dashes/ASTRA_DASHES_AUDIT_v02.md`. The older audit is context, not a transfer of its verdict to new art.

Body values were independently recomputed from the atlas with `loadPacked` and `measureBody`: idle f0 garment count 7,685 pixels, 25 matched garment colors, no missing declared body colors. B is the square root of garment-area ratio; head/feet figures are the version-bound `scaleAudit` probes. The feet probe is a square-root matching-color area proxy, not shoe length. The general body tool's +/-12% flag is looser than this task's 0.93-1.07 target: `flag:null` does not clear this task. Pose/overlap/palette effects remain relevant when interpreting numeric misses anatomically.

Manual measurements below are projected pixel estimates from visible landmarks. Covered belt/joint centers and depth cannot be reconstructed reliably from these cells. Posed occupied bounds include hair and clothing and are not standing body height. No scaling to standing height is recommended.

## Task-specific numeric findings

| Candidate/frame | Head (target .97-1.03) | Feet (.94-1.06) | B (.93-1.07) | Finding |
|---|---:|---:|---:|---|
| dash v11 f0 | .995 | 1.091 | .957 | Head/B within target; feet above target |
| dash v11 f1 | .971 | 1.094 | .929 | Head within target; feet above target; B .001 below floor, marginal at reported precision |
| superDash v13 f0 | 1.003 | .985 | .903 | Head/feet within target; B below target |
| superDash v13 f1 | 1.019 | .953 | .906 | Head/feet within target; B below target |

Dash B median .943 versus superDash .905: difference .038 passes a median interpretation of the .05 cross-strip criterion. Per corresponding frame, the differences are .054 and .023; f0 fails a per-frame interpretation. Across arbitrary phases, the largest reported difference is .054. The inbox specifies every frame, so do not substitute the passing median for the per-frame concern.

The producing agent reports dash needed no corrective auto-head fit (effectively x1.0), while superDash needed **x1.1455**, starting at head .87 and feet .84. That superDash factor fails the explicit .93-1.07 density-fit target. Reported split/base-fit factors x.256 and x.230 are separate operations and must not be compared with the auto-head target. These log facts were supplied by the producing agent; this auditor did not rerun the packer.

## Anatomy, clothing and uncertainty

All lengths below are in final atlas pixels, rounded estimates; translation-only offset corrections do not change them. These measurements are diagnostic evidence, not certified underlying bone lengths.

| Feature | Idle f0 comparator | dash f0 / f1 | superDash f0 / f1 | Interpretation |
|---|---|---|---|---|
| Collar to front jacket hem | ~70 +/-5 | ~52 +/-6 / 49 +/-6 | ~43 +/-6 / 42 +/-6 | Jacket front visibly compresses in the lean, most strongly in superDash. The actual belt is covered and torso depth/foreshortening is unresolved: collar-to-belt skeletal scale **unmeasured**, not +/-6% pass. |
| Pocket-side shoulder to elbow | ~34 +/-5 | ~34 +/-6 / 37 +/-6 | ~33 +/-6 / 34 +/-6 | Garment landmarks support comparable projected upper-arm size, but uncertainty exceeds a strict +/-6% certification. |
| Pocket-side elbow to wrist | ~31 +/-5 | ~27 +/-6 / 27 +/-6 | ~27 +/-6 / 30 +/-6 | Wrist enters pocket/hem overlap. No broken chain; hidden endpoint and projection prevent strict pass. |
| Near thigh, inferred hip to knee | ~50 +/-6 | ~49 +/-7 / 57 +/-8 | ~54 +/-8 / 55 +/-8 | Hip hidden by jacket and raised thigh; projected only. Far thigh roots overlap the pelvis and remain unmeasured. |
| Near shin, knee to ankle | ~52 +/-5 | ~47 +/-6 / 40 +/-7 | ~45 +/-7 / 43 +/-7 | Knee fold/rotation and boot cuffs obscure endpoints, particularly tucked frames. No strict segment pass; apparent shortening alone does not establish bone shrink. |
| Side-view near shoe heel-to-toe | ~34 +/-3 | f0 ~40 +/-3; f1 rotated | both rotated | Dash f0 looks longer/full-bodied than idle footwear and corroborates its high feet proxy. Pose difference and endpoint uncertainty prevent asserting an exact percentage skeletal error. Other shoe lengths/depth are unmeasured. |

Head/hair/blindfold silhouettes remain comparable to approved references in every frame; no definite independent head-size defect was established beyond the passing probes. Hair boxes measure colored hair regions, not skull length. Near upper-arm/forearm depths are partly foreshortened in all four bent-arm poses: wrists connect to clearly visible fists, but underlying lengths are unmeasured. Trailing shins are visible yet rotated with overlapping cuff/ankle endpoints; no false numerical certification is assigned.

Jacket/sleeve volume is less inflated than the old dash described in audit v02. Pocket-side sleeves retain readable folds and comparable overall weight across the two new strips. SuperDash's shorter/compressed front torso and lower garment area remain an unresolved comparison hold against upright/combat references. Sleeve and jacket measurements are clothing measurements, not a license to change shoulders or stretch a whole pose. B alone cannot settle whether the compact torso is legitimate foreshortening; the task targets are still missed.

## Every frame and ordered seam

| Frame | Inspection |
|---|---|
| dash f0 | Low forward lunge, front shin extended to a complete planted shoe; trailing leg and shoe intact. Near fist is closed and connected; far hand enters pocket. Continuous collar/zipper/hem; no seam break. Large side-view shoe is the clearest visible size concern. |
| dash f1 | Raised forward knee and bent shin ending in a complete downward-turned shoe; trailing leg extends back. Both hands retain their roles. Hip and thigh overlap hide anatomical origins. No limb disappearance or reversed joint established. |
| superDash f0 | Forward-leaning flight pose, folded near knee and trailing leg; both shoes complete. Fist remains forward and visible, far wrist at pocket. Shorter projected torso and compact garment volume match the B concern. |
| superDash f1 | Fist reaches farther forward as elbow opens slightly; pocket hand remains at hip. Both leg chains and shoes remain connected. Torso/garment volume is consistent with f0, so the low B is persistent rather than a single-frame pop. |

Both animations are two-frame loops: dash 60/60 ms, superDash 50/50 ms. Inspected f0->f1 and f1->f0 for each, including return seams; no hand, shoe or jacket-flap disappearance. Dash changes between a planted and tucked leg configuration sharply; superDash makes a smaller extension change. Smoothness at runtime, movement displacement, airborne height and contacts were not tested. All four cells have lowest alpha y240; that is registration, not evidence that airborne feet touch the runtime floor.

The first inspected pack reused older offsets and had dash hair centers (185.5,78.5) -> (154.5,82), a **31 px horizontal jump**, with neither frame centered at the requested x~166. SuperDash centers were (164,86.5) -> (158.5,86), also left of x~168. Producer corrected registration; the final binding/recheck below resolves those offset findings, not the anatomical/size holds.

## Initial inspected atlas binding

Atlas SHA256 `e1f7e2adb80d2144f8d55d058165c18b83d2d54c0748df195bf6247b333f8934`; mapping SHA256 `4418c2c616cfdd5915392927050a1075aa2673b11f09d4b1d5d0246f557629cc`. This is the pre-registration-correction pack; the final rechecked binding is below.

| Frame | Atlas slot; origin | Initial inclusive bounds x/y | Initial decoded RGBA SHA256 |
|---|---|---|---|
| idle f0 | 0; (0,0) | 80..182 / 10..240 | `83253269a02c677a68b90523bc183c1a19212ac32a213e2d5d44ca1156d18496` |
| dash f0 | 16; (0,256) | 29..218 / 68..240 | `59f8b0308fef5470aabd3c1da861ff08b7d00a3eabf8c8bd755f69b86144b88d` |
| dash f1 | 17; (256,256) | 7..183 / 71..240 | `b7619c897c0010007f13dc561ea5fb486fefcf895a81b3848a2496373513fdc1` |
| superDash f0 | 21; (1280,256) | 41..200 / 74..240 | `175f14fea74c574487ae87ad86c9b56920a0ee021357c05471af152f495e2338` |
| superDash f1 | 22; (1536,256) | 36..201 / 75..240 | `1aac23e7c1e62f1a52318f1df76ec161c033c7ee1bcae34aec06da9ae6a4092c` |

| Source/reference | SHA256 |
|---|---|
| `raw/dash_v11.png` | `0c2949ba6abbd693975f2f21ded6709e136792c4224aa8db367da24ae801b59d` |
| `raw/superDash_v13.png` | `ed94a2a7267842054f10d5d6558f6a468c32ec0ee2d0b9bff151f095fc6df7a5` |
| `raw/idle_v08.png` | `6c1ec47c2c1e2b7df2d3aa6ccf2256e46dc93bdd8e426607f2990f6f963913bb` |
| `public/art-review/title-style-pilot/gojo-neutral_v01.png` | `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0` |
| `public/art-review/title-style-pilot/gojo-combat_v01.png` | `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656` |

## Final registration recheck and binding

Independently re-read and decoded the producer's final pack after offset correction. Visually rechecked all four affected cells at 3x nearest-neighbor scale, including complete margins and ordered return seams. The final atlas SHA256 is **`ce87cc8d31f6ca7336be020f477a178bc909a4804bd16002d7a70b96f9de7ef7`**; final `anims.json` SHA256 is **`0134ec68b48889310bd6fe85711c4ffe1126d120751fad9f96aeb4e9eadacb6c`**. These match the producer's supplied hashes.

Dash hair centers are now (165.5,78.5) -> (166.5,82), a 1 px horizontal change. SuperDash centers are (168,86.5) -> (168.5,86), a .5 px horizontal change. Both meet the requested approximate horizontal registration and remove the earlier horizontal jumps. No new clipping or limb loss is visible. Opaque counts are unchanged. All size-proxy values and anatomical holds above remain applicable. **Registration passes; overall candidates remain HOLD.**

| Final frame | Slot; atlas origin | Inclusive bounds x/y | Opaque px | Final decoded 256x256 RGBA SHA256 |
|---|---|---|---:|---|
| dash f0 | 16; (0,256) | 9..198 / 68..240 | 10204 | `c5a3b126d37badeefa39c412d683a35a40ea7a675bb15fbbdee94b34db339fd1` |
| dash f1 | 17; (256,256) | 19..195 / 71..240 | 9729 | `cfa18c5db85c552273613259195c99c35b2a30d998537cf27e6f1d2b32614ea8` |
| superDash f0 | 21; (1280,256) | 45..204 / 74..240 | 8885 | `1dad2cbc2183ea37685bcfcc52b15b6a12dbdde35e5c6b3203833cf6db850214` |
| superDash f1 | 22; (1536,256) | 46..211 / 75..240 | 8904 | `4147339563ccd63f0261f5ae231e1e8840a0b075a6279e7d04f8437c2e3ee67b` |

Final sidecar SHA256: `raw/dash_v11.json` = `f5479cd25ba928ffd9d36319c95c1274c862091f6f2628b9f3bb4c9eea3e468d`; `raw/superDash_v13.json` = `b2be4699f0cc33cfe50b6254f81d463b59db3f48451501356470cc0bb9a69132`.

Only this report is edited by the auditor; temporary decoded comparison images live outside the repository. No art generation, repair, repack, manifest/REVIEW edits, build, commit or relay is performed by this auditor. Parent owns further corrections within authorized budget, bookkeeping and Claude handoff. New pixels require re-audit; user approval remains separate.

## Post-audit user decision

After this technical audit was completed, Claude relay `gojo-run` #11 delivered the user's exact quote **“Approve both (Recommended)”** for dash v11 and superDash v13, explicitly despite the numeric holds. This is art approval only; all measurement findings above remain unchanged. The repacked production-atlas candidate was hash-identical to the audited corrected candidate atlas. Exact approval receipt: [USER_DECISION.md](USER_DECISION.md).
