# Gojo dash family — Astra final atlas audit v02

Date: 2026-10-15. Auditor: GPT-6 Astra / medium. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-dashes`; branch `art/gojo-dashes`.

## Verdicts

| Candidate | Verdict | Scope and reason |
|---|---|---|
| dash v10 | **HOLD: body/clothing-volume comparison** | Clipping and horizontal registration are resolved; both frames are complete and internally consistent. At equal density, the sleeves and jacket read heavier than run v14 at a similar lean. The head pass does not settle that discrepancy. This is a comparison/evidence hold, not a demonstrated numerical skeletal failure or an instruction to regenerate. |
| backDash v07 | **PASS for visible atlas anatomy and discrete transitions** | The middle tuck is now lifted 25 px; its previously identified floor-pin issue is resolved. All three figures are complete, with stable identity and no newly established anatomy defect. Runtime travel/contact remains Claude's check. |
| superDash v12 | **PASS for visible atlas anatomy and discrete loop continuity** | Both figures are complete with intact margins and nearly stationary heads. The extended fist, pocket hand, tucked leg and trailing leg remain readable through both directions of the two-frame loop. |

These scoped visible-art verdicts follow the distinction used in `../run-jkl/ASTRA_RUN_V14_AUDIT_v01.md`: they do not certify hidden/foreshortened segments within +/-6%, live playback, runtime contacts, merge readiness or user approval. Forward fist and same-lead-leg appearance are accepted choices, not failures. No new image calls are recommended by this report.

## Commit and evidence boundary

The requested abbreviated commit **86c0acf was absent from the local object database** (`git show 86c0acf --no-patch` failed). After the static audit, GitHub's commit/blob API confirmed that the exact SHA resolves to `86c0acf036e43adda7fcd8f98f75a2d8d36df185`; its `public/characters/gojo/sheet.png` SHA256 is `e5546329c470738a46537fb754ea55887b418c9dbbe7e00e6b7af8684c6f0ca0` and its `anims.json` SHA256 is `4fd805c2380a2d7bad933e679b838c850c2fc58e7044d0b06b45e748cc9bd1fb`, exact matches for the audited files below. Thus the visual audit is pixel-bound to the requested commit's atlas/mapping. Initial clean local HEAD was `78e8db86db356d92403d44ee4cf8592a43790eda`, containing calibration commit `9bbc49b6`. During inspection another actor advanced local HEAD to `349fc1bcbaf59425c11320682781fba23ead74c3`, tree `2159a8b99c6326f2a43b4618b661bf9dae15ff8e`, whose message states dash v10 was user-approved; its atlas/mapping are the same. This report neither validates approval provenance nor changes approval metadata; approval state and this independent technical finding are separate records.

Actual decoded `public/characters/gojo/sheet.png` cells, located through `anims.json`, supplied the visual evidence. References were the approved title-style neutral/combat cells, current packed idle f0/f7, and run v14 f0-f3 (its four distinct poses). Native-density contact comparisons and nearest-neighbor 2x views were inspected. No cached `frames/` PNG was substituted. The contract remains `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`, not an older universal head ratio or standing-height target.

No generation, packing, sidecar edit, gameplay test, commit or relay was performed. Only this report was written. Static frames and ordered seams were inspected; smoothness in real-time playback was not verified.

## Exact occupied bounds

4096x2816 RGBA atlas; 256x256 cells, 16 columns, pivot [128,240], PPU 128. Bounds are inclusive and include hair/clothing; they are not standing-body dimensions. All seven cells have transparent margins and no observed cut limb or foreign cross-cell fragment.

| Strip/frame | Slot; atlas origin | Duration | Local x / y bounds | Margins L/T/R/B | Opaque pixels |
|---|---|---|---|---|---:|
| dash f0 | 16; (0,256) | 60 ms | 14..200 / 22..240 | 14/22/55/15 | 12387 |
| dash f1 | 17; (256,256) | 60 ms | 20..197 / 22..240 | 20/22/58/15 | 12274 |
| backDash f0 | 18; (512,256) | 60 ms | 69..195 / 57..240 | 69/57/60/15 | 8363 |
| backDash f1 | 19; (768,256) | 60 ms | 83..177 / 41..215 | 83/41/78/40 | 7361 |
| backDash f2 | 20; (1024,256) | 80 ms | 69..190 / 53..240 | 69/53/65/15 | 8544 |
| superDash f0 | 21; (1280,256) | 50 ms | 48..204 / 81..240 | 48/81/51/15 | 7841 |
| superDash f1 | 22; (1536,256) | 50 ms | 38..212 / 80..240 | 38/80/43/15 | 8146 |

## Every frame and transition

| Frame | Anatomy and continuity observation |
|---|---|
| dash f0 | White hair/blindfold retained, fist connected through the bent forearm, other hand at pocket. Extended front shin and trailing bent leg terminate in complete boots. Jacket and upper sleeves visibly fuller than run f0; this continues in f1 rather than popping within the loop. |
| dash f1 | Same head position and retained arms. Raised forward knee, bent shin and rear extended leg are readable; both boots intact. Raised knee's overlap hides pelvis/upper-thigh origin. No disappearing limb or reversed joint established. |
| backDash f0 | Compressed takeoff with near fist and pocket hand present. Forward boot supports the pose, rear boot lifts. Collar, jacket hem and two leg chains remain readable. |
| backDash f1 | Both legs tuck, with rear shin partly obscured; both boots remain visible. Whole figure is now lifted: lowest toe y215 rather than the prior audit's y240. Hip/thigh overlap prevents exact segment reconstruction, but no missing limb is visible. |
| backDash f2 | Torso opens and forward boot reaches out; rear leg remains bent. Both hands retain their roles. Recovery is still crouched rather than an upright idle endpoint. |
| superDash f0 | Low forward lean, continuous bent free arm/fist, pocket hand at hip, forward knee folded with boot below it, long trailing leg and boot intact. Jacket flares backward; no separate limb mistaken for that flap. |
| superDash f1 | Fist reaches farther ahead; forearm straightens without losing the wrist/hand. Trailing leg extends left and raised knee remains folded. Head and torso keep comparable volume to f0, with no abrupt swelling or disappearance. |

Dash has `loop:true`: inspected f0->f1 and f1->f0. Palette head centers are exactly (166.5,32.5) in both frames, resolving the previous large horizontal slide. Lowest alpha remains y240 in both, consistent with this sidecar's grounded registration. Leg reconfiguration is large over 60 ms; this is disclosed, not a verified real-time smoothness claim.

BackDash has `loop:false`: inspected f0->f1->f2, plus static idle/run entry and idle exit comparison. Head centers are (169.5,69), (147.5,52.5), (135.5,65): the tuck now rises 16.5 px then falls 12.5 px, while moving left 22 then 12 px. This is consistent with a backward hop in discrete poses; engine displacement may add to it and must be checked by Claude. F2-to-idle still rises substantially (idle head center approximately (129,21.5)); no upright recovery cell exists. That known transition requires runtime review, not an invented f2-to-f0 loop or a static claim of double sliding.

SuperDash has `loop:true`: inspected f0->f1 and f1->f0. Head centers (168.5,92.5) and (167.5,92) differ only (-1,-0.5) px. Fist and trailing boot move while the upper body stays registered. Both lowest toes are y240; this is an airborne animation's local coordinate, not proof of grounding in game. Runtime elevation/contact is outside this audit.

## Scale, build and uncertainty

The current atlas metadata reports dash v10 head ratios 0.996/1.002, backDash v07 0.996/0.994/0.995, superDash v12 0.989/1.022; all have probe verdict `ok`. Hair-box dimensions are respectively 36x20 each, 36x21 / 36x20 / 36x21, and 36x20 / 38x21. These are palette regions, not skull dimensions. Manual hair-tip-to-chin estimates are roughly 38-42 px across these cells and the approximately 39-40 px references, with +/-3-4 px uncertainty. No visible head-size fault is established.

Dash warrants a narrower body-volume follow-up: visually estimated pocket-side shoulder/elbow/wrist points in f0 are about (111,57), (78,80), (94,111), giving a projected chain around 75 px. The similarly leaning run f0 landmarks are approximately (132,75), (102,93), (114,120), around 65 px. Dash f1 retains a comparable pocket arm. Each chain has at least +/-7 px uncertainty because shoulder and elbow are clothed, so these estimates **do not prove** a >6% skeletal error. The sleeve thickness also reads about 22 +/-3 px versus roughly 18 +/-3 px in run. Dash occupied area is 34% above run f0 (12387 vs 9225), but pose/overlap and jacket flare affect area; that statistic is only corroborating context, never a scale factor. Approved neutral/combat remain the authority; run is a useful matched-pose comparator, not a replacement baseline.

Dash's jacket/arm bulk is therefore unresolved rather than numerically failed. Have Claude reconcile those visible landmarks and clothing volume with the approved title cells and the run before treating dash as a full anatomical pass. Do not shrink the whole pose to its bounding height or use the passing head probe to close this item. Any existing visual approval remains a separate record; this report neither grants nor revokes approval.

BackDash and superDash show a more compressed jacket/leg projection than upright references, consistent with their bends and foreshortening. Manual collar-to-front-hem spans are roughly 55-65 px for backDash and 50-60 px for superDash, uncertainty at least +/-6 px; upright reference spans are roughly 68-75 px. Those projected differences cannot alone establish anatomical shrink. Heads, clothed builds, sleeve connections, both leg chains and complete shoe silhouettes were visually checked in all frames. No additional definite defect was established. Pocketed fingers, far joint origins, overlapped hips/thighs, foreshortened shins and shoe depth remain unmeasured for strict +/-6% certification.

Feet proxy ratios are dash 1.125/1.138, backDash 0.928/0.911/0.931, superDash 0.876/0.894. These are square-root matching-color area measures, not shoe lengths; they neither prove enlarged dash shoes nor shrunken superDash shoes. Rotation and overlap are substantial. Shoe silhouettes remain connected and complete in every candidate.

## Handoff

Keep the resolved clipping/offset findings separate from the dash volume hold. Parent owns committing this report and the handoff to Claude `0 - Approvals`; Claude owns technical disposition and live movement/contact validation. User art approval remains a separate decision. This audit supplies no authorization for new art, resizing or integration.

## SHA-256 evidence

The following hashes bind this report to the actual inputs, rather than an unavailable requested revision.

| File | SHA-256 |
|---|---|
| `public/characters/gojo/sheet.png` | `e5546329c470738a46537fb754ea55887b418c9dbbe7e00e6b7af8684c6f0ca0` |
| `public/characters/gojo/anims.json` | `4fd805c2380a2d7bad933e679b838c850c2fc58e7044d0b06b45e748cc9bd1fb` |
| `art/characters/gojo/raw/dash_v10.png` | `6132e315714021f32bad7d80f46e5c42b5a050a38c0e53ad5e56c9cd713c34fe` |
| `art/characters/gojo/raw/dash_v10.json` | `cfbff33eb3b93f70c516cdcb79cc5e6f5655546332c42c8db26d0c19f6ff030d` |
| `art/characters/gojo/raw/backDash_v07.png` | `e8287f029e9e25e7284b611d4002a492d79f886fc6b489a5dea3ce4ac5604934` |
| `art/characters/gojo/raw/backDash_v07.json` | `dd0bd70764f3304f59ad7b976bc365c17b263f9e69ecf0a6498e05b768519826` |
| `art/characters/gojo/raw/superDash_v12.png` | `c953a5d0f01a23a393590c4a5767f4996aa739f9fda272e723b8cd6c2b08e1f4` |
| `art/characters/gojo/raw/superDash_v12.json` | `a0346676697531f1dc7ffbc48887c03ca0aa94a887d981cd87a0bf55ff6a01a1` |
| `art/characters/gojo/raw/run_v14.png` | `031a7da4e5b7c670b5a55b0217c837e7d1cd05aaa017d16fe711c2a41e1df170` |
| `art/characters/gojo/raw/run_v14.json` | `ce071d9a2c536617a0a31ee5f5bc657a28e382e4550fe14d44eafeb3b641ffef` |
| `public/art-review/title-style-pilot/gojo-neutral_v01.png` | `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0` |
| `public/art-review/title-style-pilot/gojo-combat_v01.png` | `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656` |

Decoded cell hashes are SHA-256 over row-major 256x256 RGBA bytes, including transparent RGB.

| Slot | RGBA SHA-256 |
|---|---|
| 16 | `581ef21d3b1462bff8bbac2cd6e2f5a060b133c7e0bfce209d235db164a4c27c` |
| 17 | `1eb770be8c14d80e9849ef4d03e2052e4459feca1694f53d30be70a56eeda14b` |
| 18 | `6908e0f773cdb145848777ee27f1ec594a6fe4f53c39a112ac5cf336c4619a43` |
| 19 | `776a454c78fa4ff1b6f339a2314f81d2a1ea380a75dbff74fba8dd4679bf6f3a` |
| 20 | `4279695bb6defe834cf46b651ff1bf034b26837975f2867769fc68d155eaf7f0` |
| 21 | `d0132b050536e9d3b7cc710d94fc30735f0e464e699da6d9b206df1f11ca43c3` |
| 22 | `53f343752d131059d7f84a28837f5c3d4f68a828af70c03e180eb7c3920f58c6` |
