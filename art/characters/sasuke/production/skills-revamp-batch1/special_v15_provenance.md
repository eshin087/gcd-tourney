# Sasuke special v15 provenance and QA

Date: 2026-10-18. User decision via Claude relay skills #18 authorized one additional image call, cumulative budget 4, to redraw the same eight Chidori poses at Sasuke's approved idle build. The user later approved v15 via Claude relay send #20; v14 remains held under `raw/_qa_hold/` while Claude integrates v15.

- Selected image: `art/characters/sasuke/raw/special_v15.png`
- Dimensions: 2172x724
- SHA-256: `754E3CCF20A8071F00CD228C9B6CCED94DF79D67705FD8C02E8D14F512D7E232`
- Generation output: `E:\Vibe Coding\.codex\generated_images\01a14fd6-1a54-7682-8c00-51702d1d97e0\exec-0f1c103e-9ea6-4647-a780-865a1bd52eb7.png`
- Successful image calls used: 1 for v15; cumulative special budget 4/4. A preceding request rejected at input validation due to more than five image references and generated no image.
- References attached: `reference/model_sheet.png` (approved identity/anatomy), `reference/idle_approved.png` (approved body scale and build), `public/art-review/title-style-pilot/sasuke-neutral_v01.png` and `sasuke-combat_v01.png` (approved style/anatomy), and `raw/_qa_hold/special_v14.png` (pose sequence only; explicitly not a proportion reference). The approved expressions sheet was omitted because the image API accepts at most five references.

## Exact successful prompt

Create one complete sprite strip: Sasuke Uchiha, eight sequential poses in one horizontal row, 256x256 pixels per cell, 2048x256 total. Crisp high-resolution pixel art, matching approved serious anime title style and the exact approved idle body build and proportions at 180 px body height. Right-facing 3/4 view. Pure flat #FF00FF magenta background, no shadow, no text, no borders.

Reference roles: approved model sheet, idle and title-style neutral/combat images govern identity, anatomy, scale, outfit, palette and rendering. Match approved idle skull/head, torso, shoulders, arms and legs exactly. The v14 sequence image is for pose sequence only; do not copy its proportions. Each full pose fits inside its own cell around pivot [128,240]; soles at y=240 except pushing rear foot during running. Hebi outfit unchanged: white open-front short-sleeved top, dark blue trousers, purple rope belt, dark forearm guards and sandals. Sword sheathed at small of back in every frame. Sharingan red in every frame. No lightning, glow, energy, sparks or effects.

Eight poses, left to right:
0) Wide low forward crouch; left hand gripping right wrist; right arm down past front knee, open spread fingers aimed at floor; head down, eyes on opponent.
1) Same crouch deeper, right hand lower with fingertips ~20 px above floor, grip tight.
2) Release grip; left arm swings forward for balance, right arm sweeps back and down behind, open hand near floor behind rear foot; coiled low to sprint.
3) Low ninja sprint, torso leaning ~45 degrees forward; right arm straight trailing low behind with fingertips skimming floor (within cell x40-70, y225-235); left arm forward, front foot planted, rear leg pushing off.
4) Next stride with legs swapped, same low lean and trailing right arm.
5) Deep lunge, front knee bent and rear leg straight; right arm thrust straight forward at chest height in a spear-hand, fingers straight together, fingertips at x220-236 y118-136 within cell and not clipped; left arm pulled back to hip, chin behind right shoulder, mouth open shouting.
6) Same lunge follow-through, right arm extended, body 4-6 px further forward, cloth and rope ends flowing forward; all contained.
7) Recovery rising from lunge, right arm drawn toward chest.

Preserve exact head and body proportions across all poses. Readable distinct silhouettes and separated limbs. Hard pixel clusters, no anti-aliasing, blur, gradients, or dithering.

## QA result

`node tools/pack-sprites.mjs sasuke --quantize 48` selected v15 and detected eight frames but exited 1 and wrote no atlas. Its whole-figure splitter cuts pose boundaries across f2/f3, f3/f4, f4/f5, f5/f6 and f6/f7. Scale gate failed for v15 f7 head 1.23 relative to f1 1.36 of idle. Reported right-edge clipping: f3 6 px, f5 25 px, f6 3 px into the safety margin. The same run also failed on the pre-existing `beamFire` v08. `npm run body -- sasuke special` measured v13, not v15; its generated report/image are not v15 evidence. No final Astra quantized-atlas audit is available because no atlas was written. Candidate remains visually unapproved and technically held under `_qa_hold/`, so the packer keeps selecting approved v13.


## Approval record

Historical unadjusted result: strict pack failed before Claude's later trial. Claude reports a trial using a whole-figure split and `special_v15.json` (`anatomy: auto-head`, `bodyHeight: 157`): auto-head x0.905, head 1.10, no clipping and passing scale gate. The user approved v15 via Claude skills lane send #20. Exact user quote: “Approve v15 (Recommended): I ship it with the size fit that clears Codex’s holds; it replaces v13 in game.” No image calls or pixel edits were made after v15. Claude owns applying the pack-time sidecar/bodyHeight, remeasuring hand anchors and integration; final atlas/Astra/runtime verification is not claimed here.
