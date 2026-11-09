# ART-SIZE-R8 Killua A9-A10 generation and QA inventory

Scope: A9 `superPose` v08 → v09 and A10 `getup` v07 → v08. One built-in image-generation call was used for each candidate (1/3 each); no further calls have been made. The user approved the current Codex chat model for this round through relay `audit1 #2`. The image-generation tool does not expose a rendering-model selector.

## A9 · `superPose` v09

- Saved source: `art/characters/killua/raw/superPose_v09.png`, 1536×1024.
- Previous source: `art/characters/killua/raw/superPose_v08.png` (SHA-256 `1F8C14D9516275188D118DCD7CA13EAEC7EE0B28DB436216B0BCDF17E0B668EF`).
- Generation output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-a4cbed0f-3a42-453a-924a-cb64043c11fa.png`.
- Saved SHA-256: `38F157FE91D297B120EDDB382EC4D87B7D0EA984F7B0CFADA25FF37546730249`.
- Inputs (all attached to the call): approved `reference/model_sheet.png` (SHA-256 `07F9AB5DCE6167044D84C52598E43F6E9A05944AA89DCFF86D339D9445FF149B`); approved `reference/expressions.png` (`D0CBF270247593AFE5D04F999F261E528001EEF4F6FF833892BBED31FF284450`); approved `reference/idle_approved.png` (`67E7016328A35AE12AAA2969F5E8C911D64B093039D9B1612583B21BFF655AA9`); approved title-style neutral `public/art-review/title-style-pilot/killua-neutral_v01.png` (`86278707BA8F0FCB78942CBCEDB3341D8AD8F559E95F8CBF48273D0BBDCA1855`); and source `superPose_v08.png` above as pose/action reference only.
- Exact prompt:

```text
Use case: illustration-story
Asset type: four-frame hi-res pixel-art animation strip for the GCD Tourney fighter.
Primary request: Redraw Killua's existing four-frame superPose v08 as the next candidate, superPose v09. Correct only the scale and body volume flagged by the size audit: shorts about 19% too wide and long, legs about 20% too thick, and hands too large. Match the approved Killua neutral and idle's slimmer shorts, narrow thighs, lean calves, and hand size. Keep the same character identity, face, hair, outfit, pose, action, four-frame count, and subtle loop timing as v08. Do not change the attack or add anything.
Input images: Image 1 model sheet = identity/outfit palette; Image 2 expressions sheet = face; Image 3 approved idle strip = exact approved body and hand build; Image 4 approved title-style neutral cell = scale and neutral anatomy reference; Image 5 superPose v08 = pose and action reference only. Do not copy v08's oversized shorts, legs, or hands.
Character: slim, wiry, pale 13-year-old boy with fluffy spiky silver-white hair, sharp catlike blue eyes, loose purple long-sleeved shirt with dark navy rolled collar and white cuffs/hem, baggy dark navy shorts just above the knees, bare shins, purple-and-white high-top sneakers. Serious anime proportions, narrow shoulders, long lean limbs. Match approved references exactly; no child-head exaggeration.
Animation: exactly four poses in one horizontal row, left to right, continuous subtle loop. Killua stands almost upright with knees slightly bent and feet shoulder-width apart, body turned toward camera about 50 degrees, chin down. In each frame the right hand is raised in front of the right side of his face at eye height, fingers spread and hooked with short pale claws; the left hand stays low at his side, also clawed. Dark assassin eyes in all frames. Hair bristles slightly upward and shirt hem/sleeves lift as if in an upward wind. Frame 1 base pose; frame 2 tiny claw flex and tuft change; frame 3 body rises one pixel with a different shirt flutter; frame 4 settles toward frame 1. Keep feet positions and head size stable. The raised hand must stay below the hair top.
Critical scale correction: preserve the exact slim proportions of the approved neutral/idle. Shorts should end above the knees and not balloon outward; upper legs and calves should be narrow and lean; bare hands should be compact, the raised hand naturally sized relative to his face, with only short claw tips. No enlarged clothing volume, no widened shorts silhouette, no thickened limbs, no oversized fingers, no bulk added to the torso.
Canvas and style: one 1536x1024 landscape image, exactly four equally spaced poses, one per equal-width slot, with clear flat-magenta gaps. Each game frame will be cropped to 256x256. Keep declared pixel scale consistent across all poses; leave unused space. Hard-edged hi-res pixel art, crisp square pixels, limited flat palette, dark one-pixel outline, clear cel-shaded anatomy and clothing folds. No anti-aliasing, blur, gradients, dithering, noise, painterly texture, text, labels, frame dividers, ground shadow, floor, lightning, electricity, sparks, glow, aura, effects, extra characters. Background flat solid #FF00FF; never put magenta on the character. Facing right in a 3/4 view.
```

## A10 · `getup` v08

- Saved source: `art/characters/killua/raw/getup_v08.png`, 1536×1024.
- Previous source: `art/characters/killua/raw/getup_v07.png` (SHA-256 `2851AD95D2424854FA0F856065142B57327FC4BF5EC7E4A807489E8CB86C3CDC`).
- Generation output: `E:\Vibe Coding\.codex\generated_images\01a1bdc6-197c-7b01-b15e-921d5c059ab8\exec-444bfe3b-117d-4755-8fa8-0b1ad60ba55f.png`.
- Saved SHA-256: `EDF559876438067861F7EAAF9D63E7CC4138CB29AD8EB74385D5D756312EED21`.
- Inputs: the same approved identity, idle and neutral references listed for A9, plus `getup_v07.png` as pose/action reference only. Reference hashes match the A9 call.
- Exact prompt:

```text
Use case: illustration-story
Asset type: five-frame hi-res pixel-art animation strip for the GCD Tourney fighter.
Primary request: Redraw Killua's existing five-frame getup v07 as the next candidate, getup v08. Correct only the body-build inconsistency flagged by the size audit: frames f1-f4 have a torso about 12% too large and thicker arms and legs. Match the approved Killua idle's narrow torso, slim sleeves and lean limbs in f1-f4, especially the final standing frame f4. Keep the exact five-frame kip-up action, pose order, identity, face, hair, outfit, and timing. Do not change frame count or gameplay.
Input images: Image 1 model sheet = identity/outfit palette; Image 2 expressions sheet = face; Image 3 approved idle strip = exact approved body build and standing scale; Image 4 approved title-style neutral cell = anatomy/scale reference; Image 5 getup v07 = pose/action reference only. Do not copy v07's oversized torso or thick limbs in f1-f4.
Character: slim, wiry, pale 13-year-old boy with fluffy spiky silver-white hair, blue catlike eyes, loose purple long-sleeved shirt with dark navy rolled collar and white cuffs/hem, baggy dark navy shorts just above the knees, bare shins, purple-and-white high-top sneakers. Serious anime proportions, narrow shoulders, long lean arms and legs. Match approved references exactly.
Animation: exactly five poses, left to right in one horizontal row. Preserve the existing kip-up: f0 lying on his back with head on screen-left, knees pulled to chest and palms planted beside his head; f1 legs kick up and over toward upper-right as he rolls onto shoulders and pushes off; f2 springs airborne with torso tilted back about 40 degrees, legs folding under him, arms out; f3 lands in a crouch on the balls of his feet with hands entering loose guard; f4 is the approved idle stance with left foot forward and cold glare. He faces right from f3 onward. Keep the current timing and movement flow; no extra pose, no change to the action.
Critical scale correction: frames f1-f4 use the same slim torso width and volume as approved idle. Reduce the chest and abdomen width about 12% from v07, narrow the shoulders, sleeves, upper arms, thighs and calves to the idle build, and keep the same natural head size. Frame f4 should transition to idle with no visible bulk or size pop. Keep shirt, collar, shorts, shoes and hands in their approved scale. f0 remains the same compact floor pose; do not enlarge it.
Canvas and style: one 1536x1024 landscape image, exactly five equally spaced poses, one per equal-width slot, with clear flat-magenta gaps. Each game frame is cropped to 256x256. Keep source pixel scale stable, leave unused space rather than enlarging poses. Hard-edged hi-res pixel art, crisp square pixels, limited flat palette, dark one-pixel outline, clear cel-shaded anatomy and clothing folds. No anti-aliasing, blur, gradients, dithering, noise, painterly texture, text, labels, frame dividers, ground shadow, floor, lightning, electricity, sparks, glow, aura, effects, extra characters. Background flat solid #FF00FF; never put magenta on the character.
```

## Packed-cell QA

- Diagnostic command: `node tools/pack-sprites.mjs killua --manifest <temporary diagnostic manifest> --out <isolated diagnostic output> --quantize 48 --no-writeback`. The temporary manifest marks v09/v08 approved **only inside the diagnostic copy** so the packer emits cells; repository `approvedVersion` remains v08/v07. The output is outside the repo under the Codex visualization scratch directory. Production output and `art/characters/killua/frames/` were not written.
- Candidate atlas: 54 animations, 253 frames, 4096×4096, 48 colors. No hitbox overrides exist for `superPose` or `getup` in `hitboxes.json`; no `_scale` or boxes were changed.
- A9 v09: head ratios by frame 1.000, 0.975, 1.029, 1.000 (median 1.000); body-area B ratios 0.938, 0.890, 0.900, 0.920 (median 0.910). The scale probe reads all four heads; body B is advisory and pose-sensitive. Candidate cells and comparison are in `public/reviews/size-r8-killua/`.
- A10 v08: head ratios f1-f4 1.019, 1.018, 1.050, 1.010; f0 reads 0.480 and is low-confidence for the lying pose. Body-area B by frame is 0.730, 0.866, 0.966, 0.831, 0.892 (median 0.866, below the ±10% advisory band). The ordinary pack therefore fails its strict candidate gate because the v07 manual QA does not cover v08 and f0 is an unmeasured lying frame. It also reports floor contact: 77% of f0 body pixels within 5 px of y=240, with the lowest fifth 13 px above the line. This is a technical hold; the diagnostic override is not a pass.
- The production sheet remains the approved v08/v07 art. Candidate approval is pending.
