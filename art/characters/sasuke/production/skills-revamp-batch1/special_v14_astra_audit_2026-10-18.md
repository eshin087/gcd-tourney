# Sasuke special v14 - Astra anatomy and scale audit, 2026-10-18

**Verdict: TECHNICAL HOLD.** Provisional visual audit of all eight cleaned candidate frames; **the required final audit of an actual quantized v14 atlas remains pending**. No user art approval is implied. Auditor: GPT-6 Astra, medium, delegated for this audit only.

## Evidence and scope

- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-sasuke-skills`, branch `art/sasuke-skills`.
- Candidate: `art/characters/sasuke/raw/special_v14.png`, SHA256 independently verified `6A34E5E4A76BBFA536487E06D81ABC2252EA2B71A1B44395D27BA1EA42CDEBE9`. This is preserved call 3, not a new generation; cumulative budget remains 3/3.
- Inspected individually: `art/characters/sasuke/frames/special/special_00.png` through `special_07.png`. `.packer.json` identifies source `raw/special_v14.png`, version 14, 256x256 cells, pivot [128,240], bodyHeight 204. These are cleaned frame artifacts, not proof of an accepted atlas.
- Approved references inspected: `public/art-review/title-style-pilot/sasuke-neutral_v01.png`, `sasuke-combat_v01.png`, and `art/characters/sasuke/reference/idle_approved.png`. Contract: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`; move brief: `art/characters/sasuke/SKILLS_REVAMP.md`, B1.
- Also inspected cached `frames/idle/idle_00.png`, whose metadata identifies `raw/idle_v01.png`. It is a diagnostic comparison only, not a certified fresh pack of the approved source.
- Coordinator reports `npm run sprites -- sasuke` refused the candidate atlas write at the strict scale gate: f3 head 1.14 versus f0 1.44 of idle; right clipping f3 55px, f4 6px, f5 44px, f6 20px; 91,233 source colors, no quantization, eight split warnings. This audit did not rerun or weaken the gate.
- Coordinator reports `npm run body -- sasuke special` found no packed idle and produced no v14 body measurement. Independently checked current `anims.json`: special only, no idle. Independently checked `body-report.json`: its Sasuke special entry is **v13**, median 0.937; it is stale for this candidate and cannot clear v14.

## Measurements and uncertainty

Direct pixel scan of the inspected PNGs, alpha > 0. Bounds are inclusive and exact for these files; occupied area includes hair, clothing and weapons. It is **not** skeletal height, garment-only area, or anatomical segment length. All frames have zero partially transparent pixels, but opaque RGB shading still contains thousands of colors, so this does not establish hard-pixel/48-color compliance.

| Image | Occupied x,y bounds | Width x height | Occupied pixels | RGB colors |
|---|---|---:|---:|---:|
| neutral v01 | 83,32 to 172,240 | 90 x 209 | 10170 | 5782 |
| combat v01 | 50,61 to 204,240 | 155 x 180 | 10097 | 5850 |
| cached idle f0 | 78,39 to 179,240 | 102 x 202 | 10235 | 6519 |
| special f0 | 47,56 to 215,240 | 169 x 185 | 15037 | 11119 |
| special f1 | 45,64 to 210,240 | 166 x 177 | 14689 | 11018 |
| special f2 | 49,57 to 250,240 | 202 x 184 | 15062 | 11892 |
| special f3 | 97,51 to 255,240 | 159 x 190, clipped | 13219 | 10179 |
| special f4 | 52,49 to 255,240 | 204 x 192, clipped | 13723 | 10738 |
| special f5 | 23,39 to 255,240 | 233 x 202, clipped | 17455 | 13490 |
| special f6 | 13,40 to 255,240 | 243 x 201, clipped | 17474 | 13437 |
| special f7 | 53,37 to 206,240 | 154 x 204 | 14170 | 11658 |

The reported head-probe change 1.44 to 1.14 is about a 20.8% drop relative to f0. Clipping contaminates f3, so it cannot be interpreted as a precise skull-size change. The visible, intact f0/f1 heads are also noticeably larger than the approved cells. Pose and projected area prevent deriving limb ratios from occupied bounds. Exact skull, shoulder-to-hip, upper/lower arm, thigh/shin and shoe ratios are **unmeasured**, with high uncertainty from foreshortening, garments and clipping; none is a numeric pass. The contract's crown landmark uncertainty is +/-12 source pixels, not +/-12 final-cell pixels. No common scale correction is inferred from these measurements.

## Frame-by-frame anatomy and motion inspection

| Frame | Head and torso | Arms, legs, clothing and footwear | Pose/contact finding |
|---|---|---|---|
| f0 | Intact but oversized-looking hair/head relative to both title cells; broad sleeves and open-chest torso make the lean reference build read fuller. | Wrist grip is legible; hanging forearm/hand is long and conspicuous. Wide bent legs are plausible in silhouette, but thighs/pants have substantially more projected volume. Sandals intact. | Low charge reads clearly. Fingers extend to the floor area, leaving no clear hand clearance. Do not normalize this crouch to standing height. |
| f1 | Head drops approximately 8px in top-of-silhouette position; fuller head/torso persists. | Wrist grip persists; bent knee volumes shift, both sandals remain visible. Hanging fingers still reach the floor region. | Deeper crouch is distinguishable, but brief's roughly 20px fingertip clearance is not present visually. |
| f2 | Head remains large; leaning torso is readable but chest and sleeves remain fuller than reference. | Rear lowered arm and fingers visible; opposite hand extends right and is intact. One knee tucked, other leg trailing; foreshortening prevents length certification. Rope becomes prominent. | Release/coil reads; forward hand ends at x250, close to edge. Hand identity/anchors need Claude confirmation. |
| f3 | Head, face and front torso intersect the right crop: skull/neck/torso proportions cannot be audited completely. | Trailing arm/hand and rear sandal survive; front limbs are incomplete. Rope and pants occupy much of the surviving silhouette. | Severe crop makes stride/contact unreadable; reported 55px overflow. No anatomy or hand-anchor pass possible. |
| f4 | Head visible, torso leans forward; garment volume remains broad. | Rear leg extends and front knee bends; rear hand rests visually near thigh rather than skimming the floor. Front hand is cut at right edge. Shoes visible. | Stride differs from f3, but a full leg-swap check is compromised by f3's crop. Reported 6px overflow. |
| f5 | Intact shouting face/head and broad chest; head is behind extended arm. | Extended arm exits cell with hand absent; rear fist sits near chest rather than clearly at hip. Deep lunge has readable straight rear leg and bent front leg; large rope/pants volume; shoes intact. | Cannot inspect spear-hand fingers or hit contact. Right crop reportedly 44px. Missing hand cannot meet brief's x220-236, y118-136 fingertip evidence. |
| f6 | Similar head/torso pose, positioned left of f5 rather than a clear 4-6px forward follow-through. | Extended arm/hand again exits right. Legs and rope visibly change, so it is not byte-identical duplication; lower-body stance widens. Footwear intact. | Distinct drawing, but requested forward progression is not established; reported 20px overflow. Cannot certify hand anchor/contact. |
| f7 | Upright recovery preserves identity but head and jacket still read fuller than approved title cells. | Bent arms are visible; broad pants/rope and spread legs narrow toward a recoverable stance. Sandals complete. | Recovery readable. Return to approved idle is not tested in motion; cached idle has markedly narrower silhouette and different guarding hands, so a transition pop remains a concern. |

Identity is recognizable across all visible faces: dark spiky hair, white open shirt, purple rope, navy lower clothing and sandals. Exact red eye detail and sheath continuity are not certifiable in clipped/occluded frames. The anatomy concerns are not resolved by identity recognition.

## Loop, pixel density and contact conclusion

The inspected metadata says `loop: false`; do not call this a seamless loop. All eight poses were inspected statically, including f7-to-idle and f5-to-f6 progression concerns; no runtime timing/contact or playback verification was performed. Four clipped frames already prevent approval of complete pose geometry. Claude must confirm runtime phase/contact data and palm anchors from a complete atlas.

Every inspected cell is 256x256 and its lowest occupied row is 240, but that does not prove skeletal pivot/foot alignment or equal anatomy density. The approved combat pose is 180px tall including hair while the candidate crouches are 177-185px; matching silhouette heights would conceal the visibly larger head/clothing mass. The thousands of candidate RGB values and soft internal shading require evaluation after the actual 48-color quantization; quantization alone cannot restore clipped hands or fix anatomy.

## Required disposition

Keep v14 on technical hold. Preserve source and all history. Claude/tooling review must first resolve splitting, placement and clipping without silently scaling crouches to standing height, then produce a strict accepted 48-color candidate atlas and fresh body/head evidence tied to v14 and the approved idle. Astra must recheck every final atlas frame, full limb/torso/footwear geometry, contact and recovery transition. Any image repair remains subject to the cumulative 3/3 generation budget and scoped user authorization. A technical pass, if achieved later, still requires separate user art approval.


## User visual approval (2026-10-18, relay skills #17)

The user approved special v14 as drawn, explicitly keeping the head and clothing fullness, and asked Claude to fix the frame split. This is a visual design decision only. All technical findings above remain: no valid quantized atlas/body measurement, clipped frames, missing thrust hands, and Astra hold. Do not reinterpret the approval as a scale or shipping pass.
