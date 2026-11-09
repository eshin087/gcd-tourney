# Sasuke ART-SIZE-R8 generation inventory (audit1)

This inventory records every image-generation call for A1-A3, including failed or unsaved calls, and the user-directed no-call A1 pixel cleanup. Maximum: 3 calls per generated image/part. Approvals are recorded separately below.

## Authorization and references

- User decision, relay `audit1 #2` (2026-11-08): “Use their current model”; the GPT-6 Luna requirement is waived for this chat for this round only. This is not approval of any drawing.
- Drawing contract: keep frame count, phase, action and timing; match Sasuke's approved idle f0 build and the approved title-style neutral at the same pixel density. Hair and pose silhouette are separate from anatomy scale. No `packScale` edits for A1-A2.
- Shared approved inputs:

| Role | File | SHA-256 |
|---|---|---|
| Identity, outfit and palette | `art/characters/sasuke/reference/model_sheet.png` | `821cd5592798a5885800ffa2c8987d0eb1c4657c21166981325782c9068153a5` |
| Face and expressions | `art/characters/sasuke/reference/expressions.png` | `55ebcb0e570327444f1a244d1b315861d0e159551fc68ed6aca51c220180a758` |
| Approved combat build and pixel density | `art/characters/sasuke/reference/idle_approved.png` | `e2a9a1f44bef56a16cfb4807f5539179e7140607e2056e08772649435fb1680c` |
| Approved neutral scale and anatomy | `public/art-review/title-style-pilot/sasuke-neutral_v01.png` | `fbc6b37701c9055b7e1349aec0b1f035ed1aa21638a66541ffbf71ba3e222352` |

## A1 — Sasuke `jumpSquat` v08 drawing and v09 cleanup

- Current source: `art/characters/sasuke/raw/jumpSquat_v07.png`, 1536x1024, SHA-256 `8b8cb826e0d4105e5bc66dc1bd25e6c6e8399b1d7b8930f778b35428ed3ad1bb`.
- Contract: 1 frame, non-looping, 70 ms, manifest `bodyHeight` 162. Keep the crouch and head size; bring torso, arms and trousers back to idle's build.
- Calls: **1/3 used**. Call 1 was made with the current chat model under the relay #2 waiver. The image tool did not expose a model ID.
- Call 1 output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-00e27e34-48f1-4d3f-a2e7-d7f35d66c1e4.png`; copied without modifying the source to `art/characters/sasuke/raw/jumpSquat_v08.png`.
- Call 1 output SHA-256: `070d56d6b7d0ac8b9ac947958d098e7aed0a8c9dc52b25bd493da70c9e8eb9b3`; 1254x1254 px. The initial 48-color pack selected v08 and exited 0 with no `scale gate:` line. Its packed ratios carried to the pixel-identical body/head in v09: body B 0.925 (within the body proxy's ±10% noise), head H 1.059 (within ±6%; manual check because the crouch probe is low-confidence). Head width is 43 px, matching idle f0's 43 px; the pitched pose shortens its vertical projection. See the version-bound [scale record](../../../../scale/size-r8/SASUKE_A1_A2.md) and [review page](../../../../../public/reviews/size-r8-a1-a2/index.html#a1).
- User decision via Claude relay `audit1 #3`: approve the v08 drawing and remove the dark-red trouser-knee specks with a script as v09, using the same pixels and no image call. The v08 source remains byte-for-byte preserved. The v09 source is SHA-256 `ca0be85ccfbfe23ec7c38b740c41c2cd86fce8c8bd10b658374f273a391fe370`; a pixel comparison confirms 54 pixels changed only inside two narrow knee-edge masks, with all other pixels unchanged.
- Final packed/approved candidate: v09. Its exact atlas H is 1.059 and body B is 0.925; see the current-atlas record below. Astra independently passed the visible anatomy/scale review at moderate confidence. Calls: **1/3 generated**; the cleanup used no image-generation call.

### A1 call 1 prompt

```text
Use case: stylized-concept. Asset type: one-frame high-resolution pixel-art game sprite source.
Primary request: redraw Sasuke jumpSquat as the next version, v08. Create one new frame, preserving the exact action and pose of Image 5 while correcting the body build.
Input images: Image 1 is approved identity, outfit and color reference; Image 2 is approved face and expression reference; Image 3 is the approved idle build, head size and pixel-density reference; Image 4 is the approved title-style neutral anatomy and scale reference; Image 5 is the old jumpSquat v07 and is for pose/action reference only.
Subject: Sasuke in his approved Hebi-era outfit: pale young man, blue-black spiky hair with long cheek-framing bangs, open white high-collar shirt, purple rope belt and rear bow, knee-length navy waist cloth, navy pants and arm guards, black open-toed sandals, sheathed sword at the back of the belt. Keep his approved face and identity.
Composition: one full-body sprite, centered on a square canvas with clear magenta margin; facing screen-right in the established 3/4 view. Both feet and all hair stay inside the canvas.
Pose and timing: one deep pre-jump crouch. Knees bent about 80 degrees, left foot forward, torso leaning forward about 18 degrees, both arms swung down and back with open hands, head raised and looking forward/up, waist-cloth hem pooled over the knees, focused expression. Both feet flat. No stars or effects. Do not change the move or its single-frame timing.
Anatomy correction: keep the head exactly the approved idle size. Match idle f0's torso length, shoulder width, arm and leg thickness, hand and sandal size, and clothing volume at the same pixel density. The old v07 torso, arms and trousers are too bulky; correct those parts to idle's build without changing the crouch. Do not resize the whole pose, stretch the crouch to standing, or judge scale by its bounding-box height. Use the neutral cell as an upright anatomy comparison; the older nominal 200 px body, 31 px head and head-count targets are superseded by the approved title-style references.
Style: crisp hard-edged hi-res pixel art, same approved title style. Hard pixel clusters and clear 4-5 tone cel shading; dark clean outline; no anti-aliasing, blur, gradients, dithering, noise, glow or painterly texture.
Palette: use Sasuke's approved palette from Image 1 only (34 colors; never exceed 48 character colors). Flat solid #FF00FF background; do not use magenta on the character.
Avoid: extra poses or characters, effects, sword unsheathed, text, labels, borders, grid lines, floor or shadow, clipped anatomy, enlarged hands/feet, bulky clothing, or any change to the specified action.
```

## A2 — Sasuke `stagger` v09

- Current source: `art/characters/sasuke/raw/stagger_v08.png`, 2046x768, SHA-256 `449a85bf324debea17070eebb1a1bb88b4929c2a51babe3f01489fad59e8644d`.
- Contract: 4-frame loop, 150 ms per frame, manifest `bodyHeight` 216. Keep the dizzy action and timing; correct shoulders and torso to the approved neutral width while keeping the idle head size.
- Calls: **1/3 used**. Call 1 used the current chat model under relay #2; the image tool did not expose a model ID.
- Call 1 output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-c0d44670-fb8e-4b1c-8c9a-7e23a9c21dae.png`; copied without modifying the source to `art/characters/sasuke/raw/stagger_v09.png`.
- Call 1 output SHA-256: `074823f35e326544095ede3dbc0f31065457f3e9d709328427b239c643752751`; 1536x1024 px.
- The final 48-color pack selected v09 and exited 0 with no `scale gate:` line. Packed ratios: body B per frame 1.001, 0.993, 0.964, 1.010 (median 0.997); head H per frame 0.988, 0.974, 1.010, 0.994 (median 0.991). No body or head pop flagged. The user approved v09 as drawn via Claude relay `audit1 #3`; Astra's independent audit also passes.

## Final exact candidate atlas

- Sheet SHA-256: `f2cdb72288827e04f285e6fb4257aefa3e36ad5e6a16d4a9aec5563a8550d236`.
- Metadata SHA-256: `84791b2840ec878545694fcdc8909aff3e2ddfa4fdce7cbda7967982785d9da7`.
- Head sheet: `art/scale/heads-sasuke.png` (SHA-256 `1235d7937e17575a410752502e1b11be371dc130280afb66cdba8cb579a6da3c`).
- Body sheet: `art/scale/body-sasuke-jumpSquat-stagger.png` (SHA-256 `deb48126eabe8f477d366a443b87b9de6c4e60d0a633dd1119ea3f704d30c071`).
- Final audit: [`ASTRA_FINAL_AUDIT.md`](ASTRA_FINAL_AUDIT.md), PASS for A1 and A2; runtime contact/hurtbox validation remains separate.
- Review crops and old-atlas provenance: `public/reviews/size-r8-a1-a2/`.

### A2 call 1 prompt

```text
Use case: stylized-concept. Asset type: four-frame high-resolution pixel-art game sprite strip.
Primary request: redraw Sasuke stagger as the next version, v09. Preserve the old v08 motion and the exact four-frame contract, while correcting the body build.
Input images: Image 1 is approved identity, outfit and color reference; Image 2 is approved face and expression reference; Image 3 is the approved idle build, head size and pixel-density reference; Image 4 is the approved title-style neutral anatomy and shoulder-width reference; Image 5 is the old stagger v08 and is for action, phase and loop reference only.
Subject: Sasuke in his approved Hebi-era outfit: pale young man, blue-black spiky hair with long cheek-framing bangs, open white high-collar shirt, purple rope belt and rear bow, knee-length navy waist cloth, navy pants and arm guards, black open-toed sandals, sheathed sword at the back of the belt. Keep his approved face and identity.
Composition: one horizontal row of exactly four full-body poses, evenly spaced in four equal slots on a 1536x1024 landscape canvas, in order left to right. Keep each pose inside its slot with clear magenta gaps; no overlaps. All feet share one baseline. Face screen-right in the established 3/4 view.
Action and timing: a four-frame looping dizzy stagger, 150 ms per frame, with the last pose returning smoothly to the first. Frame 0: almost upright, wobbly knees, loose arms, torso and head leaning about 8 degrees screen-right. Frame 1: centered and upright. Frame 2: lean about 8 degrees screen-left. Frame 3: centered. Eyes half-lidded and unfocused, mouth slightly open, bangs messy over the eyes. No stars or swirls; the game adds effects separately. Do not change frame count, phases, action or timing.
Anatomy correction: keep the head exactly the approved idle size. Match the approved neutral shoulder and torso width and idle f0's build, limb lengths and thickness, hand and sandal size, and clothing volume at the same pixel density. The old v08 shoulders and torso are too wide; correct that width without shrinking the head or slimming any other part below idle's build. Keep all four frames anatomically consistent. Do not resize poses to match their bounding boxes. The older nominal 200 px body, 31 px head and head-count targets are superseded by the approved title-style references.
Style: crisp hard-edged hi-res pixel art, same approved title style. Hard pixel clusters and clear 4-5 tone cel shading; dark clean outline; no anti-aliasing, blur, gradients, dithering, noise, glow or painterly texture.
Palette: use Sasuke's approved palette from Image 1 only (34 colors; never exceed 48 character colors). Flat solid #FF00FF background; do not use magenta on the character.
Avoid: extra frames or characters, effects, sword unsheathed, text, labels, borders, grid lines, floor or shadow, clipped anatomy, enlarged head/hands/feet, bulky shoulders/torso, or any change to the specified action.
```

## A3 — Sasuke `fTilt` v04 (candidate; user review pending)

- Prior approved source: `art/characters/sasuke/raw/fTilt_v03.png`, SHA-256 `8beadfcd2ff7d0490be491d123d55c5f1f25d0ed4e8019a12c5d7db3a8fcf440`; prior `packScale` was 0.92. v03 remains the approved version until the user decides on v04.
- Contract: seven non-looping frames, phases `[3,2,2]`, durations `[35,30,40,50,60,50,30]` ms, manifest `bodyHeight` 180. f0-f2 prepare, f3-f4 are the two active straight-punch frames, f5-f6 recover. The moveset and strike timing were not changed.
- Generation model: current chat model under the user waiver in relay `audit1 #2`; the image tool exposes no rendering-model ID.
- Part A budget: **2/3 calls used**. Attempt 1 was rejected before generation because six reference paths exceeded the tool's five-image limit; no image was produced, and it is counted. Attempt 2 is completed image-generation event `exec-10f40ed0-bcf6-49f4-8c38-4e074c5132fc`.
- Part A output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-10f40ed0-bcf6-49f4-8c38-4e074c5132fc.png`, copied without pixel edits to `art/characters/sasuke/raw/_parts/fTilt_v04_A.png`; 2172x724 px; SHA-256 `6052f356788d6cc276e1c9174c82b9a99b39531b2c5c743fd0244666e583def9`.
- Part A references: Image 1 approved model sheet (identity/outfit/palette), Image 2 approved expressions, Image 3 approved idle (head/build/pixel density), Image 4 approved Sasuke neutral, Image 5 prior fTilt v03 (f0-f3 action and framing only).

### A3 Part A tool-recorded prompt

```text
Use case: stylized-concept. Asset type: one part of a high-resolution pixel-art game animation strip.
Primary request: create Part A containing exactly four consecutive full-body animation frames, f0-f3, in one horizontal row for a fighting-game sprite. Wide 4:1 strip layout, four equal slots, left to right. This is a new redraw of the same move.
Reference roles:
Image 1: approved identity, outfit and palette.
Image 2: approved face and expression guide.
Image 3: approved combat idle; match its head size, body build and pixel density.
Image 4: approved upright neutral anatomy and scale.
Image 5: prior animation strip, for exact f0-f3 pose, action, framing and sequence only. Do not copy its proportions; the old drawing's body-to-head balance is the problem being corrected.
Subject: the same lean, pale young male anime fighter shown in the approved references. Dark blue-black spiky hair with long cheek-framing bangs, open white high-collar shirt, thick purple rope belt and rear bow, navy waist cloth over navy pants, dark forearm guards, black open-toed sandals, straight sword sheathed across the lower back. Preserve his established face and outfit.
Action: reproduce exactly the first four poses from Image 5, in order: f0 ready guard, f1 stepping forward, f2 drawing the lead arm into the punch, f3 the lead-hand straight punch fully extended toward screen-right at chest height. Preserve the existing 3/4 view facing screen-right, stance, progression and frame spacing. f3 is the first active strike frame; do not move the strike earlier or later. Each pose is distinct and belongs to this sequence.
Anatomy: match Image 3's head, torso length, shoulder width, limb length and thickness, hands, feet and clothing volume at the same pixel density. Use Image 4 for upright body proportions. Keep the same anatomy through all four poses. Do not enlarge the head, thicken the arms or trousers, shorten the legs, inflate shoulders, or uniformly resize a pose to its bounding box. Keep the sword sheathed and consistent.
Style: crisp hard-edged HD pixel-art anime fan-art sprite, 3-5 cel-shading tones per material, clean 1 px dark outline, restricted consistent character palette of no more than 48 colors. Flat exact #FF00FF magenta background.
Output constraints: exactly four separate full-body poses, one row, equal-size slots with clear magenta gaps, no overlap, no cropping, hands and sandals fully visible. Hard pixels only: no anti-aliasing, blur, gradients, dithering, noise, glow or painterly texture. No text, labels, borders, floor, cast shadow, speed lines, hit sparks, effects, extra props or extra figures.
```

- Part B budget: **1/3 call used**. Completed image-generation event `exec-2050e735-0056-4d27-9751-759f160a987e`.
- Part B output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-2050e735-0056-4d27-9751-759f160a987e.png`, copied without pixel edits to `art/characters/sasuke/raw/_parts/fTilt_v04_B.png`; 2172x724 px; SHA-256 `fa5f997fa0159799ecfc8e52f8191deb724c838fb015d0086fda3147491de9af`.
- Part B references: Image 1 approved model sheet, Image 2 approved idle, Image 3 approved Sasuke neutral, Image 4 prior fTilt v03 (f4-f6 action only), Image 5 newly generated Part A (consistent v04 build and style).

### A3 Part B tool-recorded prompt

```text
Use case: stylized-concept. Asset type: the second part of a high-resolution pixel-art game animation strip.
Primary request: create Part B containing exactly three consecutive full-body frames, f4-f6, in one horizontal row. These follow immediately after the four frames in Image 5, and finish the existing seven-frame move. Wide 3:1 layout, three equal slots, left to right.
Reference roles:
Image 1: approved identity, outfit and palette.
Image 2: approved combat idle; match its head size, build and pixel density.
Image 3: approved upright neutral anatomy and scale.
Image 4: previous animation strip, for exact f4-f6 pose, action and sequence only. Do not copy its proportions; they are being corrected.
Image 5: newly generated Part A, for the exact new body build, face, colors, line weight, shading, scale and spacing. Do not repeat its f0-f3 actions.
Subject: continue the same lean, pale young male anime fighter in the references. Dark blue-black spiky hair with long cheek-framing bangs, open white high-collar shirt, thick purple rope belt and rear bow, navy waist cloth over navy pants, dark forearm guards, black open-toed sandals, straight sword sheathed across the lower back. Preserve his face and outfit from Image 5.
Action: exactly the final three poses from Image 4 in order: f4 holds the lead-hand chest-height straight punch fully extended toward screen-right (the second and final active strike frame); f5 retracts the lead arm into recovery; f6 returns to the original ready guard, matching the starting stance of Image 5 frame 0. Preserve the existing 3/4 view facing screen-right. Do not add or omit poses, duplicate frames, change timing, or move the strike frames.
Anatomy: match Image 5 and Image 2 exactly in head size, torso length, shoulder width, limb thickness and length, hand and foot size, and clothing volume at the same pixel density. Keep anatomy consistent across all three poses. Do not enlarge the head, thicken arms or trousers, shorten legs, inflate shoulders, or resize poses by their bounding boxes. Keep the sword sheathed.
Style: crisp hard-edged HD pixel-art anime fan-art sprite, 3-5 cel-shading tones per material, clean 1 px dark outline, restricted consistent character palette of no more than 48 colors. Flat exact #FF00FF magenta background.
Output constraints: exactly three separate full-body poses in one row, equal-size slots, clear magenta gaps, no overlap, no cropping; hands and sandals fully visible. Hard pixels only: no anti-aliasing, blur, gradients, dithering, noise, glow or painterly texture. No text, labels, borders, floor, cast shadow, speed lines, hit sparks, effects, extra props or extra figures.
```

- Stitch: `npm run stitch -- sasuke fTilt v04` measured Part B at factor `0.9972` against Part A; Part B was scaled by that measured factor. The retained sidecar records `[4,3]` poses, the 24 px gap, and `anatomy.measurement: auto-head`. Stitched source is `art/characters/sasuke/raw/fTilt_v04.png`, SHA-256 `0c7dae4d7b44029e76bef3a2a97204c98ac049cce34bae012db0675812b8c5d3`.
- Final candidate pack: `node tools/pack-sprites.mjs sasuke --quantize 48 --keep-palette` exited 0: 53 animations / 245 frames, 48 colors. fTilt v04 is in cells 183-189, phases `[3,2,2]`, and the auto-head probe is `ok` at H 1.00 with no fit and no fTilt scale-gate failure. The only changed atlas cells versus branch base `085031024` are 183-189. Candidate sheet SHA-256 `f044cb78d55b99ea46c85ded46c9aacf63d21326c51fbb719df25db7d64c98b4`; metadata SHA-256 `808ae00d35dc8461875c23653516956122ec02ca1442974347c2c19c8ccdd418`.
- Packed measurements: H per frame `[0.977,0.999,0.981,1.003,0.997,1.002,1.003]`, median `0.999`. Body garment-area B `[0.906,0.903,0.897,0.917,0.942,0.935,0.955]`, median `0.917`, no body-sheet flag; this is an advisory proxy, with one frame just below 0.90. Shoe-area proxy is `[1.057,1.161,1.055,1.085,1.210,1.251,1.302]`, median `1.161`; the wide/angled stride makes this proxy uncertain, so it is not treated as a foot-size pass. The equal-density body sheet and approved neutral/combat/idle comparisons are in the review page. The cast lineup command reported Sasuke heads 52/52 ok or not judged; its generated cross-cast files were restored afterward because it does not contain fTilt.
- `hitboxes.json` was remeasured on packed active frames f3/f4 (cells 186/187): f3 hit `[184,106,17,16]`, hand `[197,111]`; f4 hit `[193,105,18,16]`, hand `[207,111]`; `_scale: 1`. No runtime contact/hurtbox validation is claimed.
- **Approval:** not yet approved. Keep `approvedVersion: 3`; user image approval and the final independent anatomy/scale audit remain pending.
