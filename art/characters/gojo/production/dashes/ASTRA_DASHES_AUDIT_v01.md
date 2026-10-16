# Astra final audit: Gojo dashes v01

Date: 2026-10-15. Independent GPT-6 Astra audit. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-dashes`; branch `art/gojo-dashes`. Uncommitted packed state.

## Verdict: HOLD, scoped to backDash v07 in the hashed atlas

All three candidate frames retain a visible near fist and the far hand at the pocket, recognizable adult build, right-facing identity and intact cell margins. No missing limb or cross-cell fragment was observed. Nevertheless, this audit does **not** certify full anatomical agreement within +/-6%: bent/occluded limb landmarks and the compressed torso leave greater measurement uncertainty. The tucked middle pose also needs an explicit root/flight-placement and contact review. HOLD is an evidence/continuity hold, not a demonstrated need for another generation or permission to change scale.

This is not user image approval, a whole-atlas anatomy pass, approval of the other two new candidates, merge readiness, or gameplay/contact validation. Claude owns contact/hurtbox review. No art or configuration was changed by this audit.

## Exact scope and method

Inspected pixels came directly from `public/characters/gojo/sheet.png`, RGBA 4096x2816, cropped by the actual `anims.json` mapping. All three backDash cells were viewed at equal density beside the approved title-style neutral/combat cells, packed idle f0/f7, and all four unique packed run v14 poses (slots 8-11). The authorized source `run_v14_A.png` was also visually inspected. Run's second half repeats Part A per its sidecar. Native and nearest-neighbor enlarged comparisons were used, with no independent scaling of reference/candidate cells. Static ordered transition inspection was performed; no browser playback or gameplay movement test was performed.

`frames/backDash/.packer.json` still identifies v01 and its cached PNGs; these were deliberately not used as candidate evidence. The final pack pass was reported by the producing agent; this auditor did not repack. Current scale-report identifies backDash v7, dash v6, superDash v9. The manifest still records older candidate versions, so this report binds to pixels/hashes, not manifest status.

## Mapping and exact pixel bounds

Cell size 256x256; 16 columns; pivot [128,240]; PPU 128. Bounds below are inclusive; margins count transparent pixels left/top/right/bottom. Alpha bounds include hair and clothing and are not body stature.

| backDash frame | Atlas slot | Atlas origin | Duration | Local alpha bounds | Margins L/T/R/B |
|---|---|---|---|---|---|
| f0 | 18 | (512,256) | 60 ms | x69..195, y57..240 | 69/57/60/15 |
| f1 | 19 | (768,256) | 60 ms | x83..177, y66..240 | 83/66/78/15 |
| f2 | 20 | (1024,256) | 80 ms | x69..190, y53..240 | 69/53/65/15 |

`loop:false`: there is no backDash f2-to-f0 loop to certify. Review entry from idle/run and exit back to idle instead. Idle occupies slots 0-7; run 8-15; inherited approved dash v06 occupies 16-17; inherited approved superDash v09 occupies 21-22. Those inherited dash/superDash strips were not independently recertified here.

## Per-frame findings

| Frame | Hands/arms | Torso, build and clothing | Legs/feet | Result |
|---|---|---|---|---|
| f0 | Near clenched fist is visibly separated from torso; forearm connects to sleeve. Far hand's exposed wrist/hand enters pocket; no second free hand invented. | Leaning narrow adult torso; collar, zip and jacket hem readable. No shoulder inflation apparent. Jacket length is visibly shorter in projection than upright idle; bend/foreshortening prevents a precise length verdict. | Both leg chains readable: forward planted boot and rear lifted boot. No cut toes. Knee positions support a compressed takeoff pose. | Visual completeness passes; segment-scale certification held. |
| f1 | Fist remains visible with wrist connection; pocket hand persists. Bent arms do not merge into an absent limb. | Deep tuck compresses hem-to-hip area. Hip/thigh overlap makes pelvis and upper-leg landmarks low-confidence. | Two boots visible, rear shin partially occluded. Both legs tuck, but lowest toe is still y240. This could read as a ground-level crouched hop unless runtime/offset placement supplies height. | HOLD for flight/contact placement and occluded limb measurement. |
| f2 | Near fist remains in front of upper torso; far hand at pocket. | Torso opens relative to f1, with consistent collar and clothing mass; no sudden head enlargement apparent. | Both legs separate; forward boot extends right and rear boot trails. Recovery remains bent, not a neutral standing endpoint. Shoe silhouettes intact. | Visual completeness passes; recovery continuity and segment-scale certification held. |

## Scale evidence and uncertainty

Current automated report: head ratios f0/f1/f2 = **0.996 / 0.994 / 0.995**, feet ratios **0.928 / 0.911 / 0.931**; head range 0.002; report verdict `ok`. These are palette-based measures, not measured skull, limb or shoe lengths. Feet ratios are square-root matching-color area measures; the middle pose's occlusion/rotation makes them unsuitable for declaring a 9% shoe shrink. No blanket anatomy pass follows from this head result.

Manual native-pixel estimates: crown-to-chin approximately 39 +/-4 px for idle and 38 +/-4 px in each candidate; visible side-view boot long axis approximately 36 +/-4 px for idle and 34-38 +/-5 px in candidates. Head and shoe outlines are visually compatible at this resolution, but uncertainty is too broad to assert every measurement is within +/-6%.

The upright idle's collar-base-to-front-hem projected span is roughly 70-75 px; the candidates' bent collar-to-front-hem projected spans are roughly 55-65 px (landmark ambiguity about +/-5 px, larger in f1). This is a real projected shortening, but bending, zip curvature and hem foreshortening prevent treating it as a proven anatomical shrink. Candidate shoulder width/clothing volume appears compatible with run and combat. Upper arms, forearms, thighs and shins were visually checked in every cell; overlap and perspective prevent independent numerical +/-6% passes, especially f1's rear thigh/shin. Do not silently replace those unknowns with a pass. Approved title cells remain authoritative over idle/run.

## Transitions and offsets

Head-probe box centers are (169.5,69), (147.5,77.5), (135.5,65): f0-to-f1 moves -22 px horizontally/+8.5 vertically; f1-to-f2 moves -12 px/-12.5 vertically. These are palette-region centers, not skeleton pivots. Idle f0's corresponding center is (129,21.5), giving an entry shift of about +40.5/+47.5 px and a recovery-to-idle shift of -6.5/-43.5 px. Crouching explains much vertical change; it does not by itself establish the intended root trajectory.

The backDash v07 sidecar has `anatomy.measurement: auto-head` and no frameOffsets. Every frame's lowest alpha pixel is y240, including the airborne-looking tuck. By contrast, run v14 explicitly stabilizes its horizontal position and raises flight frames by 28 px. A backward-moving sequence may intentionally shift its head left, so **34 px total lateral change alone is not a defect**; Claude should verify whether engine movement plus this local displacement produces a double slide, and whether f1 needs a measured flight offset. Static evidence cannot settle that. f2-to-idle is a substantial rise from bent recovery, with no standing recovery cell in this three-frame strip; inspect the actual 80 ms exit before certifying continuity.

## Separate held candidates and next evidence

New dash v10 and superDash v12 remain in `raw/_qa_hold`; neither was audited as packed. Their attempt budgets and earlier strict-pack/clipping failures remain the producer's separately documented holds. No additional image calls are authorized by this report.

For backDash, resolve root/flight/contact placement using measured source ground-line/pose evidence and runtime review; retain exact source scale. Resolve torso/limb uncertainty with landmark evidence against approved neutral/combat and matching posed run cells. Any changed offsets/pack require a new hash-bound audit. User visual review remains through Claude `0 - Approvals`.

## SHA-256 inputs

The source PNGs and configuration hashes establish provenance; the visual verdict is specifically on the actual quantized atlas cells. `idle_approved.png` was hashed as reference provenance; detailed idle inspection used the packed f0/f7 pixels. No claim is made to have visually inspected every unrelated atlas animation.

- `public/characters/gojo/sheet.png`: `e9cb5a6ab5803993c0187e1069c3dfe8440ce1d8d5773e2fb280d3f60271a41a`
- `public/characters/gojo/anims.json`: `03c533ea87cc0c9a815ceabfc482d3a9b04007b3bd5c07b69170140e44a86d08`
- `art/characters/gojo/raw/backDash_v07.png`: `e8287f029e9e25e7284b611d4002a492d79f886fc6b489a5dea3ce4ac5604934`
- `art/characters/gojo/raw/backDash_v07.json`: `f9e11712e5a204f772bf227f43083144056b9940b22600a00429f0844469172f`
- `public/art-review/title-style-pilot/gojo-neutral_v01.png`: `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0`
- `public/art-review/title-style-pilot/gojo-combat_v01.png`: `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656`
- `art/characters/gojo/reference/idle_approved.png`: `6c1ec47c2c1e2b7df2d3aa6ccf2256e46dc93bdd8e426607f2990f6f963913bb`
- `art/characters/gojo/raw/_parts/run_v14_A.png`: `561951d6c1fe5da76abc3aeb5521eac662572c9c0e31897019bd6037e18dd0ce`
- `art/characters/gojo/raw/run_v14.json`: `ce071d9a2c536617a0a31ee5f5bc657a28e382e4550fe14d44eafeb3b641ffef`
- `art/scale/scale-report.json`: `20eabe400514d01986bfb746d4cdb303eab6a02ad462093f525403a3ad2d5a37`
- `art/manifest.json`: `72dab027546ffa49e28c7d2f2ea556b5ea4b5bb98206e6a4bfb583620a3b1f1a`

Decoded cell RGBA byte hashes (256x256, row-major, four bytes/pixel):

- slot 18: `11c974b7e6612ef25a53b42ddb94d3f2e25cc2480cc01768bad768834534feed`
- slot 19: `490d61dca95b6e59467ff0e37e760091e381516421721bdca8ef4a8582998a73`
- slot 20: `d77cc40a0b15b1a6ada960aa751a59c7b140e92dd09d81a1e4c37dc80799298d`
