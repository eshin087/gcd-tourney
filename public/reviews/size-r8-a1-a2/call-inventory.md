# Sasuke ART-SIZE-R8 generation inventory (audit1)

This inventory records every image-generation call for A1-A2, including failed or unsaved calls. Maximum: 3 calls per image. These redraws are user-review candidates; the model waiver below is not image approval.

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

## A1 — Sasuke `jumpSquat` v08

- Current source: `art/characters/sasuke/raw/jumpSquat_v07.png`, 1536x1024, SHA-256 `8b8cb826e0d4105e5bc66dc1bd25e6c6e8399b1d7b8930f778b35428ed3ad1bb`.
- Contract: 1 frame, non-looping, 70 ms, manifest `bodyHeight` 162. Keep the crouch and head size; bring torso, arms and trousers back to idle's build.
- Calls: **1/3 used**. Call 1 was made with the current chat model under the relay #2 waiver. The image tool did not expose a model ID.
- Call 1 output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-00e27e34-48f1-4d3f-a2e7-d7f35d66c1e4.png`; copied without modifying the source to `art/characters/sasuke/raw/jumpSquat_v08.png`.
- Call 1 output SHA-256: `070d56d6b7d0ac8b9ac947958d098e7aed0a8c9dc52b25bd493da70c9e8eb9b3`; 1254x1254 px. The final 48-color pack selected v08 and exited 0 with no `scale gate:` line. Packed ratios: body B 0.925 (within the body proxy's ±10% noise), head H 1.059 (within ±6%; manual check because the crouch probe is low-confidence). Head width is 43 px, matching idle f0's 43 px; the pitched pose shortens its vertical projection. See the version-bound [scale record](scale-record.md) and [review page](index.html#a1).
- Calls used: **1/3**. Selected candidate remains v08; no retry call.

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
- The final 48-color pack selected v09 and exited 0 with no `scale gate:` line. Packed ratios: body B per frame 1.001, 0.993, 0.964, 1.010 (median 0.997); head H per frame 0.988, 0.974, 1.010, 0.994 (median 0.991). No body or head pop flagged. These are technical measurements only, not user approval.

## Final exact candidate atlas

- Sheet SHA-256: `3d0d86e8c4de5e4ce557fb780baf31fe6575c4b04e1e0d6d63abd89a7a25f0b3`.
- Metadata SHA-256: `99b178f3e511d867c6eea477b9ee4af06c61bbbe84e6be23943780992c9587e4`.
- Head sheet: `art/scale/heads-sasuke.png` (SHA-256 `9640ddcd362b9ca77678e1d0255faa6cefd4213ae022fb6b55ae735effbe32ec`).
- Body sheet: `art/scale/body-sasuke-jumpSquat-stagger.png` (SHA-256 `47952387442561388dc67dc34d9ec90622f327a5c62ae957e0dc61c81c9733c8`).
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
