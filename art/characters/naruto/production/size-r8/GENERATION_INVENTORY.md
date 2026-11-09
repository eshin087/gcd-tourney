# Naruto ART-SIZE-R8 generation and pixel-repair inventory (audit1)

This is the single candidate inventory for A4-A8 and R1-R2. It records every image-generation call, including failed or unsaved calls. The original cap was 3 calls per image; the A7 history below records four call events if the tool-rejected invocation is counted. Pixel repairs use no image calls. The latest candidates remain unapproved pending the user's decision and review.

## Authorization and contract

- User decision, relay `audit1 #2` (2026-11-08): “Use their current model”; the GPT-6 Luna requirement is waived for this chat for this round only. The image tool exposes no rendering-model selector.
- Work authorized by relay `audit1 #6` (2026-11-09): Naruto A4 `light2`, A5 `stagger`, A6 `taunt`, A7 `light3Alt`, A8 `specialDown`, then pixel repairs R1 `airHeavyAlt` and R2 `jumpSquat`; one review ring after the complete Naruto batch.
- Drawing contract: keep each canonical animation's frame count, phase, action and strike frame/timing; match approved idle f0's build and pixel density. Compare upright poses to the approved title-style neutral. Do not use the superseded 200 px / 6.5-head targets. No packScale changes.
- R1/R2: create the next source version from the exact current pixels using scripts only; log changed pixel coordinates/masks and hashes; all unrelated pixels must remain identical.

## Approved and comparison references

| Role | File | SHA-256 |
|---|---|---|
| Identity, outfit and palette | `art/characters/naruto/reference/model_sheet.png` | `2481b65323264130937450774351f3bee8eeef5a3c845cc2910c185a11d40cd9` |
| Face and expression reference | `art/characters/naruto/reference/expressions.png` | `61a2914d6261b0a7160dcf24bb8a84eb44a1eb38766b2de52afc38b4cfd52bfe` |
| Approved combat build and pixel density | `art/characters/naruto/reference/idle_approved.png` | `eeb62e3d8981c168ccc48ffeb847ef8308e267c84f9b3b5e2b29a690d1a15db3` |
| Approved upright scale and anatomy | `public/art-review/title-style-pilot/naruto-neutral_v01.png` | `acfd7240f9ee7fbe71c1b6c50ea8a269ceedeb05de44b929850ca8de06a0610f` |
| Naruto light1 v04 (approved) | `art/characters/naruto/raw/light1_v04.png` | `4c98e072bf14607509de2fa55053f05c9c837eca8d740a690c727279c88a4a4b` |
| Naruto light2Alt v05 (approved pair comparison) | `art/characters/naruto/raw/light2Alt_v05.png` | `9bec0a0fffd2049c4e8084e487d34c7079a0be3e90bc832b20f00b90fede92b6` |

## Candidate sources and budgets

| Item | Original source SHA-256 | Latest candidate | Contract | Calls used |
|---|---|---|---|---|
| A4 `light2` | `1541327eaf6f2a01f0e10843040dcd13b2c721bae82484949ce205983a3372ce` | v08 (v07 stitched from A/B, then v08 redraw) | 7 frames, phases 2/2/3, active f2-f3; compare with approved `light2Alt` v05 | 3/3 total: two part calls + v08 |
| A5 `stagger` | `be43bf84a100d4b4e0e03eb794b48d941291f426ada8630f291f4b5dd6f11ac7` | v11 | 4-frame loop, 150 ms/frame | 3/3 |
| A6 `taunt` | `a7699b300b2600979e3fe11bb78ddfede0fe7f28f918433d6210e19f9180eb7f` | v13 | 2-frame loop, 250 ms/frame | 3/3 |
| A7 `light3Alt` | `d83954bfb36ee1fc5ac08c2d3ff6ea636ef2baa5002c5dd8ba06e18e93173249` | v06 (v03 parts, v04 redraw, v05/v06 background-only cleanup) | 7 frames, phases 2/2/3; sweep; kick frames f1-f4 standing leg restored to full length | 4 call events if counting failed path call: two parts + failed + v04; cleanup uses no calls |
| A8 `specialDown` | `fa2c9057a4f45376a0403343eecce3a673131cb1af37f0bcbeacb8eee2094ea8` | v08 | 4 frames, phases 2/1/1; roar f2-f3 match f0-f1 and idle | 3/3 |
| R1 `airHeavyAlt` | `c7411f1b739343984a5d54fb9d6c2b0907f9b9dc67d8e94b87ce9f66d12b68ac` | v05 | Script recolor of f2-f4 thigh pouch to black | no image call |
| R2 `jumpSquat` | `5c4c350e2322139711760581cf498813c227bc9febf02b4b144b73119f30042f` | v05 | Script remove three orange pixels beside rear fist in f0 | no image call |

## Call records

### A4 `light2` Part A — call 1/3

- Call event: `exec-f2e3d7d1-22fc-401e-afd8-806ef3449a42`; current chat model (the user waived the Luna rule for this round); the image tool exposed no rendering-model identifier.
- Output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-f2e3d7d1-22fc-401e-afd8-806ef3449a42.png`; copied unchanged to `art/characters/naruto/raw/_parts/light2_v07_A.png`.
- Output dimensions: 2172x724; SHA-256 `1b000847c9085ced088f45b642a378132befc630263b67c7853f7974d59c4f78`.
- Inputs, in order: approved model sheet, approved idle, approved `light1` v04, approved `light2Alt` v05, old `light2` v06 (action reference only).
- Result: the four requested poses are present in order and the active f2/f3 strikes extend to screen-right. Retain as the Part A candidate pending packed-cell inspection.

#### Exact call prompt

```text
Use case: stylized-concept. Asset type: high-resolution pixel-art game animation strip, Part A.
Primary request: redraw Naruto's existing light2 animation as v07 Part A. Four distinct full-body poses in one horizontal row, left to right, 4 equal slots, clear magenta gaps, nothing cropped. Exactly the same action sequence and active frames as the old light2 strip; Image 5 is pose/action only.
Input roles: Image 1 approved identity/outfit/palette; Image 2 approved idle build and pixel density; Image 3 approved light1 move-language reference; Image 4 approved light2Alt v05 for equal-density pair comparison; Image 5 old light2 v06 for exact pose/action only, not proportions.
Character: Naruto Shippuden-era young ninja with compact golden-blond spikes, short bangs, upper-ear temple tufts, black headband with two long tails, bright blue eyes, three whisker marks on each cheek, orange-and-black zip jacket, loose orange trousers cuffed above black open-toed sandals, black right-thigh kunai pouch. Preserve the approved design.
Anatomy and scale: Match Image 2's exact head size, torso length, shoulder width, limb thickness/length, realistic hand and sandal size, and clothing volume at the same pixel density. Compare upright portions to approved title-style neutral Image 6 if provided; do not use nominal body-height or head-count targets. The old light2 v06 has limbs, sandals, fists and torso too bulky; correct those proportions without changing its action or right-facing 3/4 pose. Every frame's head/build stay consistent. Leave empty space rather than enlarging a pose to fill a slot.
Frames: 1 wind-up, right fist cocked beside jaw, elbow back, torso turned, weight on rear/right leg, left guard forward; focused. 2 hips rotate first, right heel lifts and right elbow drives past chest at chest height, left arm pulls in; fierce. 3 ACTIVE IMPACT, right arm fully extended straight to screen-right at chin height, fist tip about x226 y82 in a final 256x256 cell, chest rotated and right shoulder leading, torso lean about 15 degrees, right heel raised, left fist tight to cheek; shouting. Add only a short solid 15-20 px pixel smear directly behind forearm. 4 second active hold, fist 2 px back from frame 3, no smear; fierce. Hair and headband tails follow through; tails remain behind the head.
Continuity: Preserve 7-frame move, 2/2/3 phases, timing and f2-f3 strike placement. All grounded frames share a baseline. Keep hands, hair and sandals inside the sprite cell.
Style: crisp hard-edged anime fan-art pixel art; hard pixel clusters, clean dark outline, 4-5 tone cel shading, approved title style. No anti-aliasing, blur, gradients, dithering, noise, painterly texture or glow. Use Naruto's approved palette from the identity reference, no more than 48 character colors. Exact flat #FF00FF background, never on the character.
Avoid: extra poses/figures, text, labels, borders, grid lines, floor, shadow, effects, pose changes, oversized fists/sandals, thick limbs, short legs, bulky torso, or any uniform rescaling by bounding-box height.
```

### A4 `light2` Part B — call 1/3

- Call event: `exec-ae9e1441-7e8e-442c-be94-548e4d1e8b82`; current chat model under relay #2 waiver; no model identifier exposed.
- Output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-ae9e1441-7e8e-442c-be94-548e4d1e8b82.png`; copied unchanged to `art/characters/naruto/raw/_parts/light2_v07_B.png`.
- Output dimensions: 2172x724; SHA-256 `2723b6d668cfe2704a14c9adfc7087bc2940ebc1411dd0445224d2f42e0c9e94`.
- Stitched `raw/light2_v07.png` using `npm run stitch -- naruto light2 v07`; measured Part B factor `0.8855`, post-fit B/A head ratio `1.01`. The source parts remain preserved. Scratch was redirected to the task's OS-temp directory because the default `E:\gcd-scratch` was not writable.
- Inputs, in order: approved model sheet, approved idle, approved neutral cell, newly generated `light2_v07_A.png`, old `light2_v06.png` (action reference only).
- Result: the three recovery frames follow the requested sequence and align in scale/style with Part A. Retain pending measured stitch and packed-cell inspection.

#### Exact call prompt

```text
Use case: stylized-concept. Asset type: high-resolution pixel-art game animation strip, Part B.
Primary request: create the final three frames, f4-f6, of Naruto's existing light2 animation as v07 Part B. Three distinct full-body poses in one horizontal row, left to right, 3 equal slots, clear magenta gaps, nothing cropped. These continue Part A and complete the seven-frame move.
Input roles: Image 1 approved identity/outfit/palette; Image 2 approved idle build and pixel density; Image 3 approved title-style neutral anatomy; Image 4 new light2 v07 Part A, exact new scale/style/continuity; Image 5 old light2 v06, exact f4-f6 pose/action only, not proportions.
Character: same Naruto Shippuden-era young ninja and approved design from Images 1-2: compact golden-blond spikes, short bangs, upper-ear temple tufts, black headband tails, blue eyes and whisker marks; orange-and-black zip jacket, loose orange cuffed trousers, right-thigh black pouch and black open-toed sandals.
Frames: 5 right arm retracting with elbow bent and fist halfway back, torso unwinding; fierce. 6 right fist returns to jaw, heel down; focused. 7 back in the original light2 stance, matching Part A frame 1; determined. Keep all three poses distinct and in sequence; do not repeat Part A frames.
Anatomy and scale: match Part A and approved idle exactly: same head, torso length, shoulder width, limb length/thickness, hand and sandal size, clothing volume, source scale and pixel density. Compare upright body landmarks with title-style neutral; do not use nominal body-height or head-count targets. Keep legs and sandals at idle's build; no inflated fists or thick limbs. Keep head, hair, hands and feet inside each cell.
Continuity: light2 is 7 frames, phases 2/2/3, active f2-f3 only; preserve timing and pose progression. Baseline matches Part A; no size pop when it returns to stance.
Style: crisp hard-edged anime fan-art pixel art; hard pixel clusters, clean dark outline, 4-5 tone cel shading, approved title style. No anti-aliasing, blur, gradients, dithering, noise, painterly texture or glow. Use Naruto's approved palette, no more than 48 character colors. Exact flat #FF00FF background, never on character.
Avoid: extra poses/figures, text, labels, borders, grid lines, floor, shadow, effects, clipping, pose changes, or uniform resizing by bounding-box height.
```

### A5 `stagger` — call 1/3

- Call event: `exec-ea10317b-cedb-47ef-85a7-4546a4b4739a`; current chat model under relay #2 waiver; no model identifier exposed.
- Output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-ea10317b-cedb-47ef-85a7-4546a4b4739a.png`; copied unchanged to `art/characters/naruto/raw/stagger_v09.png`.
- Dimensions: 2172x724; SHA-256 `a879efa1dec4af4d9779f45259ac0f2f610980ad4dc45401d1f9897e605de8a7`.
- Inputs: approved model sheet, approved expressions, approved idle, approved title-style neutral, old `stagger_v08` (action reference only).
- Result: four full-length sway poses are present. Packed height and segment proportions remain to be verified against idle and neutral.

#### Exact call prompt

```text
Use case: stylized-concept. Asset type: high-resolution pixel-art game animation strip.
Primary request: redraw Naruto's existing stagger as v09. Exactly four distinct full-body poses in one horizontal row, left to right, equal slots, clear magenta gaps, no cropping. Image 5 is the old stagger v08, for exact pose/action only; correct its undersized torso and legs.
Input roles: Image 1 approved identity/outfit/palette; Image 2 approved face/expression reference; Image 3 approved idle build and pixel density; Image 4 approved title-style neutral anatomy and upright stature; Image 5 old stagger v08 for exact action and sway sequence only.
Character: approved Naruto Shippuden design: compact golden-blond hair, short upper-ear temple tufts, black forehead protector with two tails, blue eyes, three whisker marks per cheek; orange-and-black jacket, loose orange trousers with cuffs, black thigh pouch and black open-toed sandals. Keep approved face and outfit.
Anatomy correction: the old stagger is about 87% of neutral height, with legs about 15% short and torso about 8% short. Keep the head exactly the size of approved idle. Restore the full idle/neutral torso length, shoulder width, arm/leg lengths and thickness, realistic hand/sandal size and clothing volume at the same pixel density. The only intended size correction is body segments under that same head; do not scale the whole pose or use its bounding-box height. Preserve the relaxed wobble and bent knees.
Animation: same 4-frame looping dazed stagger, 150 ms per frame. f0 upper body sways left about 8 degrees, head tilts with it, arms hang loosely, right knee bends inward; half-closed unfocused eyes, mouth slightly open. f1 sways upright through center, arms loose and swinging. f2 sways right about 8 degrees, left knee bends inward, head lolls. f3 returns through center and flows smoothly into f0. Keep all feet grounded and the frame-to-frame body build constant. Hair spikes droop slightly; headband tails swing naturally with the sway.
Composition and scale: right-facing 3/4 view; full body in each cell, same head scale and pixel density as idle. Upright f1/f3 body landmarks compare with title-style neutral. Feet share a baseline at y=240 in the packed 256 cells; no frame cropped, no pose enlarged to fill space.
Style: crisp hard-edged anime fan-art pixel art, hard pixel clusters, clean dark outline, 4-5 tone cel shading, approved title style. No anti-aliasing, blur, gradients, dithering, noise, painterly texture or glow. Naruto's approved palette only, max 48 character colors. Flat exact #FF00FF background, never on character.
Avoid: extra poses or characters, text, labels, borders, grid lines, floor, shadow, effects, chibi proportions, short legs, short torso, thick limbs, enlarged head/hands/feet, or any uniform resizing to match bounding-box height.
```


### A6 `taunt` — call 1/3

- Call event: `exec-1758d78d-dc4d-40d0-bc97-8d80d3700879`; current chat model under relay #2 waiver; no model identifier exposed.
- Output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-1758d78d-dc4d-40d0-bc97-8d80d3700879.png`; copied unchanged to `art/characters/naruto/raw/taunt_v11.png`.
- Dimensions: 1774x887; SHA-256 `c6c4349443f2fc5154ff7b3b5ef44cff036ca9a9f01d1e2946d7fbf9d66da9d1`.
- Inputs: approved model sheet, approved expressions, approved idle, approved title-style neutral, old `taunt_v10` (action reference only).
- Result: both pointing poses are clear and remain full-length; packed upright scale still requires measurement.

#### Exact call prompt

```text
Use case: stylized-concept. Asset type: high-resolution pixel-art game animation strip.
Primary request: redraw Naruto's existing pointing taunt as v11. Exactly two distinct full-body poses in one horizontal row, left to right, clear magenta gap, no cropping. Image 5 is old taunt v10 for pose/action only; correct the undersized body.
Input roles: Image 1 approved identity/outfit/palette; Image 2 approved expressions; Image 3 approved idle build and pixel density; Image 4 approved title-style neutral anatomy and upright stature; Image 5 old taunt v10 for exact pointing pose and loop action only.
Character: Naruto Shippuden design exactly as approved: compact golden-blond spiky hair, short bangs and upper-ear temple tufts, black headband with long tails, blue eyes and whisker marks, orange-and-black zip jacket, loose orange cuffed trousers, black right-thigh pouch, black open-toed sandals. Keep outfit and face consistent with images 1-3.
Anatomy correction: old v10 is about 83% of neutral height. Keep the head the exact size of approved idle. Restore full upright torso and leg length and the idle build in shoulders, limb lengths/thickness, hands, sandals, and clothing volume at the same pixel density. Compare upright body landmarks against the title-style neutral. Do not enlarge the head or scale the full pose to match overall height; the correction is the torso and legs under the same head.
Animation: same 2-frame pointing-taunt loop, 250 ms per frame. f0 Naruto stands casually with feet planted, chest out and slight backward lean; right arm extended toward screen-right at shoulder height, index finger clearly pointing, left fist on hip; confident grin showing teeth. Finger tip about x220-230, y80-90 in final 256 cell. f1 repeats the same pose and anatomy, mouth open as if calling out, finger about 2 px higher. Hair bounces 1 px. Frames must loop cleanly.
Composition and scale: right-facing 3/4 view. Full body and pointing finger visible. Same head size, body build and pixel density as idle; neutral is the upright anatomy comparator. Feet align at y=240 in packed cell.
Style: crisp hard-edged anime fan-art pixel art, hard pixel clusters, clean dark outline, 4-5 tone cel shading, approved title style. No anti-aliasing, blur, gradients, dithering, noise, painterly texture or glow. Naruto's approved palette only, max 48 character colors. Exact flat #FF00FF background, never on character.
Avoid: extra poses/characters, text, labels, borders, grid lines, floor, shadow, effects, cropped finger, oversized head/hands/feet, short torso or legs, bulky limbs, or uniform resizing by bounding-box height.
```

### A7 `light3Alt` Part A — call 1/3

- Call event: `exec-776548b9-c1de-44cb-94e4-3f9d0125f838`; current chat model under relay #2 waiver; no model identifier exposed.
- Output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-776548b9-c1de-44cb-94e4-3f9d0125f838.png`; copied unchanged to `art/characters/naruto/raw/_parts/light3Alt_v03_A.png`.
- Dimensions 2172x724; SHA-256 `32dcdaf743f6eae136bd78d3953e262b1985619eaaa236f2f16d93656a507888`.
- Inputs: approved model sheet, idle, title neutral, approved `light3_v04`, old `light3Alt_v02` (action only).
- Result: f0-f3 are present in order with low active sweep at f2-f3; retain pending atlas/contact QA.

#### Exact call prompt

```text
Use case: stylized-concept. Asset type: high-resolution pixel-art game animation strip, Part A.
Primary request: redraw Naruto's low right shin sweep, light3Alt v03 Part A, as exactly four distinct full-body frames f0-f3 in one horizontal row. This is the first half of a seven-frame animation.
Input roles: Image 1 approved identity/outfit/palette; Image 2 approved idle build and pixel density; Image 3 approved title-style neutral anatomy; Image 4 approved light3 v04 is the correct body-size comparator and f0 stance reference; Image 5 old light3Alt v02 for exact action/pose progression only, not anatomy scale.
Character: Naruto Shippuden design as approved: compact golden-blond spiky hair and upper-ear temple tufts, black headband with long tails, bright blue eyes and three whisker marks, orange-and-black jacket, loose cuffed orange pants, right-thigh black pouch, black open-toed sandals. Preserve face and outfit.
Anatomy correction: In old light3Alt v02, kick frames f1-f4 have a support/standing leg that is about 20% too short. Keep the same approved idle head size, full idle-length torso and full-length support leg at equal pixel density to light3 v04 and title-style neutral. Restore the standing leg to full length in f1-f3 and maintain that length through f4 at the part boundary; keep the same head, torso, shoulders, arms, hands, support-shin thickness, sandals and clothing volume. Do not uniformly resize pose bounding boxes; crouched or airborne pose height is posed geometry, not scale.
Animation contract: 7 frames, phases 2/2/3, timing 40/35/45/60/60/60/30 ms; active f2-f3 only. f0 exactly light3 f0 stance: weight shifts onto left support leg, right heel lifting, guard tightens. f1 right knee folds and draws across low in front while torso remains upright enough to preserve head scale/position, left fist guarding chin. f2 ACTIVE low right-leg sweep forward across shin level, knee slightly bent, sandal leads, hips pivot and left support knee bends; keep the left standing leg full length. The inherited f2 contact box is [189,102,56,44]; keep the strike's sandal/ankle contact rectangle within 12 px. Small solid leg-color arc attached to the sweep only. f3 holds the extension with sandal 2 px back, contact should remain within 12 px of [189,98,65,47]. Keep the inherited hit timing.
Composition: full figures, right-facing 3/4 view. Four equal slots, 24px clear magenta gaps, same source scale and pixel density; do not enlarge to fill. Feet, hair and strike remain inside cell.
Style: hard-edged pixel-art anime fan-art in approved title style; clean dark outline, hard pixel clusters, 4-5 cel-shading tones. No anti-aliasing, blur, gradients, dithering, noise, glow or painterly texture. Approved Naruto palette, max 48 colors. Flat exact #FF00FF background, never on character.
Avoid: extra poses or characters, text, labels, borders, grid lines, floor, shadow, aura, exaggerated trail, chibi limbs, short support leg, bulky torso, oversized head/hands/sandals, or moving the active frames.
```

### A7 `light3Alt` Part B — call 1/3

- Call event: `exec-87d6a4e0-76da-4ae1-a2cd-99eba01cfdcb`; current chat model under relay #2 waiver; no model identifier exposed.
- Output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-87d6a4e0-76da-4ae1-a2cd-99eba01cfdcb.png`; copied unchanged to `art/characters/naruto/raw/_parts/light3Alt_v03_B.png`.
- Dimensions 2172x724; SHA-256 `6a193b772718e32b0e7fa66bd6b0a2806b6b1b593a3ec27d7d2be5725fbbf5e3`.
- Inputs: approved model sheet, idle, approved `light3_v04`, new Part A, old `light3Alt_v02` (recovery action only).
- Stitch: `npm run stitch -- naruto light3Alt v03`; measured Part B factor `0.9637`, post-fit B/A head ratio `1.036`; wrote `raw/light3Alt_v03.png` and sidecar. Scratch redirected to OS temp because default `E:\gcd-scratch` was not writable.

#### Exact call prompt

```text
Use case: stylized-concept. Asset type: high-resolution pixel-art game animation strip, Part B.
Primary request: create the last three frames f4-f6 of Naruto's light3Alt v03 low right shin sweep. Exactly three full-body poses in one horizontal row, left to right. These follow the attached new Part A and complete the existing seven-frame move.
Input roles: Image 1 approved Naruto identity/outfit/palette; Image 2 approved idle build and pixel density; Image 3 approved light3 v04 for the exact returning f6 stance and body scale; Image 4 newly generated light3Alt v03 Part A for the new scale, drawing style and continuity; Image 5 old light3Alt v02 for exact f4-f6 recovery/action only, not anatomy.
Character: same approved Naruto Shippuden design: compact golden hair and short temple tufts, two black headband tails, blue eyes, whisker marks, orange-and-black jacket, cuffed orange trousers, black right-thigh pouch, black open-toed sandals.
Frames: f4: right knee folds under hips, body rises slightly, left support leg remains full length and straight enough to match idle; fierce. f5: right foot steps back to rear stance, hips square to front; focused. f6: exact light3 f6 guard stance, determined. Keep separate, ordered poses. Smooth recovery from the low kick.
Anatomy and scale: match new Part A and approved idle exactly in head size, torso length, shoulder width, arm/leg thickness and length, hands, sandals and clothing volume at equal pixel density. The old standing/support leg in kick frames f1-f4 is about 20% short; restore full idle length at f4 too. Compare the upright frame with light3 v04 and approved neutral; do not use nominal body-height or head-count targets, and do not uniformly resize to fit pose bounds.
Continuity: seven frames total, phases 2/2/3, 40/35/45/60/60/60/30 ms, active f2-f3 only. Preserve the exact move and timing. Align the f6 return to the approved light3 f6 stance. Baseline and scale match Part A.
Composition: full bodies in three equal slots, right-facing 3/4 view, no overlaps, magenta gutters, no clipping.
Style: crisp hard-edged pixel-art anime fan-art in approved title style; hard pixel clusters, clean dark outline, 4-5 tone cel shading. No anti-aliasing, blur, gradients, dithering, noise, glow or painterly texture. Approved Naruto palette only, max 48 character colors. Flat exact #FF00FF background, never on the character.
Avoid: extra figures/poses, text, labels, borders, grid lines, floor, shadow, effects, oversized limbs/feet/head, short support leg, incorrect f6 stance or changed active timing.
```

### A8 `specialDown` — call 1/3

- Call event: `exec-e5e3e2a8-0dbf-49b1-b999-bc10057da12b`; current chat model under relay #2 waiver; no model identifier exposed.
- Output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-e5e3e2a8-0dbf-49b1-b999-bc10057da12b.png`; copied unchanged to `art/characters/naruto/raw/specialDown_v06.png`.
- Dimensions 2172x724; SHA-256 `4c51e6188724008443b7fe4ecd139cae452e0ab4039a812dfb722cf9b62a195b`.
- Inputs: approved model sheet, expressions, idle, title-style neutral and old `specialDown_v05` (action only).
- Result: all four specified poses are present, including f2 roar and f3 recovery. Packed scale and registration remain to be verified.

#### Exact call prompt

```text
Use case: stylized-concept. Asset type: high-resolution pixel-art game animation strip.
Primary request: redraw Naruto's existing specialDown as v06, exactly four distinct full-body poses in one horizontal row, left to right, equal slots, clear magenta gaps, no cropping. Image 5 is old specialDown v05 for exact action and pose reference only, not for proportions.
Input roles: Image 1 approved identity/outfit/palette; Image 2 approved expression and face reference; Image 3 approved idle head/build and pixel density; Image 4 approved title-style neutral anatomy; Image 5 old specialDown v05 for exact action sequence only.
Character: Naruto in his approved Shippuden outfit and face design: compact golden-blond hair, short bangs and upper-ear temple tufts, black forehead protector and tails, orange-and-black jacket, orange trousers, right-thigh pouch, black open-toed sandals. Only this animation uses red slit-pupil eyes, sharper canines, thicker dark whisker marks and short pale claws. Keep his short compact approved hair shape.
Anatomy correction: old v05's roar frames f2-f3 are 10-12% larger than f0-f1 and idle, with longer/thicker legs and broader torso. Match the approved idle head size and anatomy at the same pixel density in all poses: same torso length and width, shoulder breadth, limb lengths/thickness, hand and foot size, and clothing volume. Keep body proportions stable from f0 through f3. Frames f0-f1 are deliberately crouched; their shorter silhouette comes from bent knees and forward posture. Frames f2-f3 are posed taller by rising and spreading, not by enlarging body parts. Compare upright anatomy to title-style neutral; do not use a bounding-box resize or obsolete nominal height targets.
Animation: keep exact 4-frame move, phases 2/1/1, 80/80/220/90 ms, no hitbox. f0 drops into feral crouch: feet planted wide, knees about 80 degrees, torso forward about 40 degrees, hands low in front of knees with curled claws, head down/bangs shade eyes, teeth gritted, tails beginning to lift. f1 deeper trembling crouch, claw hands nearly touch floor, whiskers thicken, nails start to grow, tiny red eye glint. f2 held ROAR: torso rises and arches, chest out, knees remain bent and wide; both arms spread down/out, open claw hands; head thrown back, mouth wide with canines, red slit eyes and thick dark whiskers; hair and tails blown upward. f3 rises toward stance, still feral, slight forward lean, open claws in front of chest, head level, red slit eyes and snarling canines; hair/tails settle. Feet stay planted in the same positions across all frames. The roar frame is the tallest pose, but the character is not enlarged.
Style: crisp hard-edged pixel-art anime fan-art in the approved title style; hard pixel clusters, clean dark outline, clear 4-5 tone cel shading. No anti-aliasing, blur, gradients, dithering, noise, glow or painterly texture. Use the approved Naruto palette plus only red-eye colors #e0302a and #ff6a4d; no more than 48 colors. Exact flat #FF00FF background, never on the character.
Avoid: red chakra cloak, aura, glow, bubbles, energy, chakra tail, red skin tint, smoke, extra effects, extra poses/characters, text, labels, borders, grid lines, floor, shadow, shortened legs, enlarged torso, bulky roar frames, changed timing or cropped hair/claws/feet.
```

## Script repair records

### R1 `airHeavyAlt` v05 (derived from v04; no image call)

- Source v04 SHA-256: `c7411f1b739343984a5d54fb9d6c2b0907f9b9dc67d8e94b87ce9f66d12b68ac`; output v05 SHA-256: `b673adb8dd4db7d33bf4d980c823a1558f197064bb9deb7e29104aee07b7f476`; both are 2172x724.
- Script recolored only source pixels inside these frame-local raw masks: f2 `[735,395,50,90]`, f3 `[1110,455,55,70]`, f4 `[1540,400,50,110]`. Selected blue pouch pixels satisfy alpha > 200, B > 65, B > R + 25, B > G + 20. Each pixel was mapped by luminance to the neutral dark gray color ramp sampled from unaffected black pouches in f0, f1 and f5.
- Changed 2,253 source pixels total: f2 780, f3 698, f4 775. A full source comparison found zero pixel differences outside the masks. Blue covers now read black/charcoal like the unaffected pouch frames. Exact 48-color packed-cell QA remains pending.

### R2 `jumpSquat` v05 (derived from v04; no image call)

- Source v04 SHA-256: `5c4c350e2322139711760581cf498813c227bc9febf02b4b144b73119f30042f`; output v05 SHA-256: `184b346974fe2945eccd81d4a598d7c598f9d5e6175008f160089e188ffd687f`; both are 1254x1254.
- Script set RGBA to transparent black at the three orange stray pixels beside the rear fist, coordinates `(481,862)`, `(480,863)`, `(479,864)`. Exactly 3 pixels / 12 channel bytes changed; all other pixels are byte-identical.
- Exact 48-color packed-cell QA remains pending.

## Approval and final packed audit

- Pending user review for all seven Naruto candidates; do not set an `approvedVersion` until a delivered user approval authorizes it.
- After approval, run the independent final anatomy/scale audit on the exact quantized atlas (GPT-6 Astra medium if it can be started); record visible measurements, uncertainty, and any holds. The audit does not replace user approval.

### A5 correction attempt 2: `stagger` v10

- Call `exec-0baffb2f-639c-40c6-942a-9bdce133f45c`; generated output `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-0baffb2f-639c-40c6-942a-9bdce133f45c.png`, copied unchanged to `art/characters/naruto/raw/stagger_v10.png`.
- Dimensions 2172x724; SHA-256 `f2fcd92293daabc5431f4e381cb1dbde620914322b8683ad7a5c07ac5d462c87`.
- Inputs: approved model sheet, expressions, idle, title-style neutral and candidate `stagger_v09` for exact sequence.
- Result: four-frame same-action redraw; constant head scale and restored body proportions are requested. Packer and packed-cell QA pending.

#### Exact call prompt

```text
Correct the supplied Naruto four-frame horizontal anime fan-art stagger strip as one new candidate. Images 1-4 set identity, exact head size, body build and anatomy; image 5 gives the four-frame wobble sequence. Preserve exactly four evenly spaced left-to-right poses, same mild dizzy stagger, bent knees, hanging hands, expressions and timing. Match the approved idle head/hair silhouette and size exactly in every frame. The last candidate's head probe popped inside the strip: ensure f0-f3 are the same physical head size and pixel density with no zoom, especially make f3 match f2. Restore full idle-length torso, arms and legs below that same head; relaxed stagger and bent knees create the pose, not shortened limbs or altered scale. Compare upright proportions to the approved title neutral. Right-facing 3/4 view, whole body in every slot, no cropping, flat #FF00FF background, hard pixels, no blur, anti-aliasing, gradients, extra poses, effects, text, labels or grid.
```


### A6 correction attempt 2: `taunt` v12

- Call `exec-b149703e-e384-46bf-b47f-7d809530f82b`; generated output `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-b149703e-e384-46bf-b47f-7d809530f82b.png`, copied unchanged to `art/characters/naruto/raw/taunt_v12.png`.
- Dimensions 1774x887; SHA-256 `d1e89f2813c0213b6a478dabb3ad554a72c08b29e9275bc615b79f8ba201fb4e`.
- Inputs: approved model sheet, expressions, idle, title-style neutral and candidate `taunt_v11` for the same taunt.
- Result: two-frame redraw, reducing the head to the approved idle's scale while retaining full-length torso/legs and fingertip target; packed QA pending.

#### Exact call prompt

```text
Correct the supplied two-frame Naruto horizontal anime fan-art taunt strip as one new candidate. Images 1-4 set exact identity, head scale, outfit and body build; image 5 gives the same confident pointing taunt. Preserve exactly two poses and the same finger-pointing / grin then open-mouth laugh. Match the approved idle head and hair silhouette to the exact same pixel size; v11's head was 9% above idle, so reduce the head/headband/hair together without changing facial identity. Keep the full-length torso, arms and legs, shoulders, hands and sandals at idle's proportions; do not enlarge the overall figure to fill the slot. Pointing fingertip must stay near cell coordinate x225 y85 after packing. Right-facing 3/4 view, both complete poses including finger and soles inside their frames, flat #FF00FF background, hard pixels, no blur, antialiasing, gradients, extra frames, text, labels or grid.
```


### A8 correction attempt 2: `specialDown` v07

- Call `exec-0f91b663-d12c-45bb-96a9-ce6b5ab7f14c`; generated output `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-0f91b663-d12c-45bb-96a9-ce6b5ab7f14c.png`, copied unchanged to `art/characters/naruto/raw/specialDown_v07.png`.
- Dimensions 2172x724; SHA-256 `5cf7c9b8887c14c0f400b6c7ac14000144f7c890b1156e993208b3740af79a65`.
- Inputs: approved model sheet, expressions, idle, title-style neutral and candidate `specialDown_v06` for its exact action.
- Result: four-frame redraw retaining feral gather/roar/recovery; f2-f3 head size and body scale explicitly corrected to match idle. Packed QA pending.

#### Exact call prompt

```text
Correct the supplied four-frame horizontal Naruto specialDown fan-art strip as one new candidate. Images 1-4 define exact identity, expressions, approved idle head/build and upright anatomy. Image 5 defines the move's four poses and timing. Preserve f0-f1 crouched feral gather, f2 held wide rising roar, f3 recovery. Match the exact same head/hair/headband physical size to approved idle in all four frames; the last candidate's f2 head measured 14% larger than idle and larger than f0-f1, so reduce only head/headband/hair on f2-f3 to match the consistent idle-size head. Keep neck placement natural. Keep torso, shoulders, arms, legs, hands and sandals at idle's body-part scale; f0-f1 crouch via bent joints, f2-f3 rise by opening posture, never by enlarging the head or limbs. Retain the red slit eyes, sharper canines, thick whiskers and short pale claws only on these special poses. Keep frame count, phases and action exactly. Full body and claws inside each equal slot; right-facing 3/4 view, flat #FF00FF background, hard pixel edges, no gradients/blur/antialiasing, aura or extra effects, text, labels or grid.
```


### A5 correction attempt 3: `stagger` v11

- Call `exec-73aefb2f-6dfe-435b-899f-169dbf130705`; generated output `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-73aefb2f-6dfe-435b-899f-169dbf130705.png`, copied unchanged to `art/characters/naruto/raw/stagger_v11.png`.
- Dimensions 2172x724; SHA-256 `f5850a49746b17ca795837f81f42cdcf953086b894969658a6c72859bc1b4dfb`.
- Inputs: approved model sheet, idle, title-style neutral and candidate `stagger_v10` for action.
- Result: final generation attempt; keeps four mild dizzy frames, makes head smaller and restores body length beneath it. Packed scale/pose QA pending.

#### Exact call prompt

```text
Make the third and final generation attempt for Naruto's four-frame stagger strip. Preserve v10's exact mild dizzy four-pose wobble and frame order. Use references 1-3 for Naruto identity and exact approved idle/neutral anatomy; reference 4 is only the action guide. Quantized pack measurements of v10 were head 1.19 of idle, feet 0.75, proving an enlarged head over a short body. Correct that: match the physical head/hair/headband size to approved idle exactly in all frames, about 16% smaller than the v10 head; restore full-length torso, upper/lower legs and sandal size to idle's build under that same head. Do not enlarge head or shorten limbs. Keep the small relaxed stagger, gently bent knees and hanging arms; preserve the same frame-to-frame wobble without changing the actual head size between f0-f3. Compare upright poses to neutral anatomy, not bounding-box height. Same four frames, equal slots, right-facing 3/4 view, complete figures, flat #FF00FF background, hard clean pixels. No text, grid, extra poses, shading gradients, blur, antialiasing or extra figures.
```


### A6 correction attempt 3: `taunt` v13

- Call `exec-e6cf65ab-1934-429e-a190-acf88a5f189f`; generated output `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-e6cf65ab-1934-429e-a190-acf88a5f189f.png`, copied unchanged to `art/characters/naruto/raw/taunt_v13.png`.
- Dimensions 1774x887; SHA-256 `a31a0c389c4e5d4c76da130100159daac196fe21fc9047eb686b7bb971ac4d76`.
- Inputs: approved model sheet, idle, title-style neutral and candidate `taunt_v12` for the same two poses.
- Result: final generation attempt; measured prompt corrected the head smaller-than-idle issue while retaining the body and finger target. Packed QA pending.

#### Exact call prompt

```text
Make the third and final generation attempt for Naruto's two-frame pointing taunt. Preserve the same two full-body poses, pointing action, grin then open-mouth laugh and order. Images 1-3 define exact identity and approved idle/neutral; image 4 is the action guide only. The quantized v12 pack measured the head/hair at 0.88 of idle, too small. Increase only the head, hair and headband together by about 14% to exactly match the approved idle f0 head silhouette and size in both poses; keep neck connection natural and both frames identical in head scale. Do not change the already full-length body: torso, shoulders, pointing arm, bent arm, legs, fingers and sandals remain at idle proportions. Keep the fingertip near final packed x225 y85, and the whole figure and finger inside the cell. Right-facing 3/4 view, flat #FF00FF background, hard pixels, no blur/antialiasing/gradients, no extra frame, text, label or grid.
```


### A8 correction attempt 3: `specialDown` v08

- Call `exec-ab2bd323-7e83-4e5a-8265-f17d37854ead`; generated output `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-ab2bd323-7e83-4e5a-8265-f17d37854ead.png`, copied unchanged to `art/characters/naruto/raw/specialDown_v08.png`.
- Dimensions 2172x724; SHA-256 `32a04a0e86c7d16d3c78db9fbd0b71171241db45d8ebe6b8bfd7991ef0b20874`.
- Inputs: approved model sheet, expressions, idle, title-style neutral and candidate `specialDown_v07` for its exact four-pose action.
- Result: final generation attempt; keeps crouched gather and roar while correcting the measured head/body proportions. Packed QA pending.

#### Exact call prompt

```text
Make the third and final generation attempt for Naruto's four-frame specialDown anime fan-art strip. Images 1-4 define approved identity, head scale, idle build and upright neutral anatomy; image 5 is only the four-pose feral action guide. Preserve exactly f0-f1 low crouched gather, f2 wide rising roar, f3 recovering stance, same timing. Packed v07 measured head 1.11 of idle and feet 0.73; fix the anatomy under the approved head: reduce all four heads/headband/hair to exactly the approved idle f0 size, keeping one constant head size from f0 through f3, and restore full-length torso, legs and sandals under that head. f0-f1 are lower only from bent joints; f2-f3 rise by opening the body and spreading arms, not by enlarging head or shortening legs. Keep Naruto's special red eyes, sharp canines, thick whiskers and short pale claws on all four poses. Whole figure and claws inside every equal slot, right-facing 3/4 view, flat #FF00FF, hard clean pixels. No extra poses, effects, labels, text, grids, blur or gradients.
```

## Later A4/A7 calls and script derivatives

### A4 `light2` correction: v08

- Call `exec-dc93e5a1-6eec-4a8b-bfed-160d16e30e39`, using the current chat model under the one-round waiver in relay #2; the image tool supplied no rendering-model identifier.
- Output `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-dc93e5a1-6eec-4a8b-bfed-160d16e30e39.png`, copied unchanged to `art/characters/naruto/raw/light2_v08.png`.
- Dimensions 2170x725; SHA-256 `a57d5c8170878a80736f207825ba753c96fad6ca4c87b5db5dc3244c0a207cf4`.
- The generation prompt requested the same seven-frame action and timing, corrected limb/sandal/fist/torso size against the approved idle and kept strike reach. The verbatim prompt and full input list were not retained in the inventory before the context handoff; this summary is not a verbatim prompt record.
- Packed evidence: auto-head fit x1.1403 makes the head probe pass; body B remains 0.716-0.734 and the `light2Alt` contact mismatch is 38 px. See `art/scale/size-r8/NARUTO_A4_A8_R1_R2.md`.

### A7 `light3Alt` failed tool call and v04

- A tool invocation asking the image generator to use six reference paths was rejected before generation because the tool accepts at most five image paths. It returned no image. The exact tool event id was not retained in the current continuation context. Count it as a failed call event for the attempt budget.
- Successful full-strip call `exec-93bf2f04-9d0d-4ad4-9f64-93ab14042ae2`; copied unchanged from `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-93bf2f04-9d0d-4ad4-9f64-93ab14042ae2.png` to `art/characters/naruto/raw/light3Alt_v04.png`.
- Dimensions 2172x724; SHA-256 `39166f3f37c8e37f874e8e5bfc520ee56d2fad9229716c3356bff361c3ac10ec`.
- Prompt summary: preserve the seven-frame sweep and active kick frames while restoring the straight supporting leg to idle build; retain facing, pixel style and flat background. Verbatim prompt and exact input order were not retained in the inventory before the context handoff.
- v04 included black letterbox bars. A script created v05 by replacing 436,572 edge-connected black background pixels with magenta; no character pixels changed. SHA-256 `d70884c882ce8c09d94ad772e8feb9856494d9032bf88615574e3a86cbdf2e5b`.
- A second background-only script created v06 by replacing horizontal transition rows 109-111 and 630-631 with magenta (10,860 pixels); no character pixels changed. SHA-256 `f1ef5bf6a0207e017435be023ef574d54893fffc039d6116eb3b786a90a7f65b`.
- The latest packed v06 has head ratios 0.960-1.002 but body B 0.555-0.616 and its active strike remains 51 px below the base move's hit height. It remains held.

## Final candidate QA and review

The exact per-frame measurements, technical holds, strict-pack outcome and remeasured `light2` hit boxes are recorded in `art/scale/size-r8/NARUTO_A4_A8_R1_R2.md`. The review page is `public/reviews/size-r8-naruto/index.html`; it labels its images as candidate-only warning-mode diagnostics. No Naruto version in this batch is user-approved yet.
