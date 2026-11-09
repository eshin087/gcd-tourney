# Luffy B9/B10 final Astra packed-atlas audit

GPT-6 Astra (medium), 2026-11-09. The user approved run v02 and down v04 as drawn via Claude relay audit2 #11 ("Approve both (Recommended)"). This report records technical anatomy/scale findings only; it does not change the user's image approval.

## Result

| Strip | Final disposition | Reason |
|---|---|---|
| B9 run v02 | **HOLD: internal registration**; visible anatomy and size are reference-consistent | Hat width stays within the approved reference range, but its horizontal center jumps 54.5 px from c8 to c9 in 60 ms and 43 px across the c15-to-c8 loop seam. The torso follows. No scale change would correct this placement discontinuity. |
| B10 down v04 | **PASS: visible anatomy/scale** | Both the crawl and recline retain Luffy's slim build and comparable head, vest, shorts, limb and sandal volume against the approved references. Bent posture and overlapping limbs make some projected segments uncertain; concealed lengths are not claimed as numeric passes. |

The automatic Luffy head probe is configured off and reports both strips as `unmeasured`. Its ratios are not used as evidence. Run v02 has a version-bound manual `hold`; down v04 has a version-bound manual `pass`. The run hold remains. Runtime grounding, hurtbox/contact and gameplay review remain Claude-owned.

## Exact artifacts and references

- Worktree: `E:/Vibe Coding/.codex/worktrees/art-size-r8-b/gcdTourney`; branch `art/size-r8-b`.
- Production atlas: `public/characters/luffy/sheet.png`, SHA-256 `4d0fa71916948303dcff65d75f2d1129bf0c224ed9890d748bdb180245fe41b1`.
- Matching metadata: `public/characters/luffy/anims.json`, SHA-256 `2cdfc780f78314b761be2d5861ae427957f26fb10efd6819940fd98ac118dd6c`.
- Run v02: cells 8–15, eight 60 ms frames, looped; manifest bodyHeight 204. Existing frame placement sidecar has final-cell offsets `[0,0]` for f0-f2, `[24,0]` for f3, `[23,0]` for f4, `[0,0]` for f5-f6, `[26,0]` for f7.
- Down v04: cells 79–80, durations `[80,420]` ms, not looped; manifest bodyHeight 106.
- Run raw: `art/characters/luffy/raw/run_v02.png`, SHA-256 `e719904a758dbc715558085c0e0f612abfc993dd4ffa9745d066ace54ce46d49`; retained contact sheet `raw/_parts/run_v02_grid.png`, SHA-256 `3ed6989ed2e499c939e1a4e793785a2070b01dbe3cb166000cd9695b2fb95046`.
- Down raw: `art/characters/luffy/raw/down_v04.png`, SHA-256 `91410326b72f1d64c9ec4545eaef731ffb559f399a77cd349ba9807e9c8458dd`; retained contact sheet `raw/_parts/down_v04_grid.png`, SHA-256 `10a8e084f68891d268451e5c8b06836c26c6e7e51a0b80d1e265b316ae78f67b`.
- Approved idle f0: `public/characters/luffy/calibration-r3/reference-approved-idle-f0.png`, SHA-256 `a26d94992f0c3ee5fcff26cc043bc6ba797f432ea9def450d6f6afafd90e522d`.
- Approved title neutral: `public/characters/luffy/calibration-r3/reference-neutral.png`, SHA-256 `8e9da76421c52e5fa449ce55b2dba1933b52e74d15ccd4a69090b9f97eb082b1`.
- Approved title combat: `public/characters/luffy/calibration-r3/reference-combat.png`, SHA-256 `439678e0a9689edc3cc9686d51a65f9d546e2e68aae20760de8e7f4391a306e0`.

The exact-atlas comparison boards extract the production cells and show them beside the three approved references at one displayed density: [run v02](../../../../../public/reviews/size-r8-audit2-luffy-b9-b10-r4/astra-run-v02-exact-atlas-references.png) (SHA-256 `19793b67df9525760bdbb3962e8ed7ad4e517879ab43021628a17ad6b8629956`) and [down v04](../../../../../public/reviews/size-r8-audit2-luffy-b9-b10-r4/astra-down-v04-exact-atlas-references.png) (SHA-256 `856589ee33fea13d14d7585ffb78fdcff11e62aa39cfe8ea9cb07a06c0909874`). The machine-readable pixel bounds and source hashes are in [astra-atlas-metrics.json](astra-atlas-metrics.json).

## Method and uncertainty

Every listed production cell was inspected at the same 256×256 cell density beside approved idle f0, neutral and combat. I compared the hat and visible face, neckline-to-sash torso, shoulder/vest volume, exposed shin and sandals, and connected limb chains. The hat is a repeatable clothing landmark, not a skull measurement. The comparisons use the production atlas rather than the candidate review pack or cached unquantized source frames. No posed bounding-box height was fitted to the standing idle.

Visible head/hat and torso endpoints carry roughly ±4–6 px uncertainty; limb lengths under the shorts, crossed poses and foreshortening carry roughly ±6–8 px uncertainty. Down f1's overlapping legs cannot support separate numeric segment measurements. The down pass means the visible body build and landmarks are coherent at one density within those limits; it is not a claim that every concealed segment is within a numeric ±6% band.

All ten sprites are fully inside their 256×256 cells, with no art on a boundary. All occupy row 240 at the shared pivot floor line. This is static atlas containment only, not runtime floor-contact validation.

## Run v02: all-frame findings

The approved idle/neutral/combat hat spans are 55/52/56 px using the same color landmark. Run spans are 53–56 px: consistent size, not an oversized head. The landmark centers below are the midpoint of each inclusive horizontal extent.

| Frame / cell | Alpha bounds `[x0,y0,x1-exclusive,y1-exclusive]` | Hat extent, inclusive | Center | Anatomy / placement |
|---|---|---|---:|---|
| f0 / 8 | `[53,55,211,241)` | 141–194 (54 px) | 167.5 | Forward stride; lean, vest and extended rear leg retain the slim reference build. |
| f1 / 9 | `[6,53,159,241)` | 86–140 (55 px) | 113.0 | Bent rear knee and leading shin are coherent; head and torso translate sharply left from f0. |
| f2 / 10 | `[31,56,217,241)` | 122–176 (55 px) | 149.0 | Extended stride with connected limbs; body moves right again. |
| f3 / 11 | `[4,61,193,241)` | 93–148 (56 px) | 120.5 | Folded rear leg and forward leg remain readable; offset addresses the left safe margin, not the cycle registration. |
| f4 / 12 | `[4,57,180,241)` | 91–144 (54 px) | 117.5 | Continues the stride without conspicuous head, shoulder or clothing inflation. |
| f5 / 13 | `[66,57,190,241)` | 126–178 (53 px) | 152.0 | More compressed stride; pose explains shorter box, while torso/head proportions remain consistent. |
| f6 / 14 | `[22,58,209,241)` | 110–163 (54 px) | 136.5 | Long stride; both sandals remain distinct and limbs are not truncated. |
| f7 / 15 | `[4,65,194,241)` | 98–151 (54 px) | 124.5 | Lower running pose returns to f0 with a 43 px horizontal landmark jump across the loop seam. |

The f0→f1 center moves −54.5 px in one 60 ms beat. The f7→f0 loop seam moves +43 px. The torso follows these shifts, so the finding is internal body registration, not merely hair movement or head size. The recorded f3/f4/f7 offsets were measured to clear the cell edge; they do not make this sequence consistently registered. No new offset or scale change is proposed here. The report does not decide whether a runtime root adjustment or a revised strip is the right correction.

## Down v04: all-frame findings

| Frame / cell | Alpha bounds `[x0,y0,x1-exclusive,y1-exclusive]` | Anatomy / scale |
|---|---|---|
| f0 / 79 | `[53,143,215,241)` | Low crawl: supporting arm, bent near leg and extended far shin remain connected. Torso folds with the pose instead of reading as a smaller standing body; head, vest, sash and sandals remain comparable to the references. |
| f1 / 80 | `[39,149,212,241)` | Recline: supporting forearm, torso, shorts and bent legs stay coherent. Head and clothing volume remain consistent; crossed legs obscure separate knee/shin landmarks. |

The low occupied y ranges are caused by the crawl/recline poses and are not a reason to rescale them to standing height. The direct landmarks support a manual visible-anatomy/scale pass, with the endpoint uncertainty above. Automatic head/feet ratios are not accepted as substitutes for this comparison.

## Scope boundary

This audit changed no sprite pixels, frame offsets, timing, bodyHeight, packScale, hitboxes or public atlas output. Run v02 remains technically held for registration. Down v04's manual anatomy/scale gate passes. Claude still owns runtime contact, root motion, grounding, hurtbox and integration checks; both user drawing approvals remain separate from these technical findings.
