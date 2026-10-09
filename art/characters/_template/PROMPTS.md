# {{NAME}}: image prompts

> TEMPLATE. Every block below is a complete, copy-paste prompt for an image generator: Codex's
> built-in image generator (the default) or ChatGPT run by the user. Spec: hi-res sprite spec v2
> (`art/SPEC.md`, ADR 0007): Shippuden-era design, about 6.5 heads tall, 256 px cells.
> When creating a character, Codex replaces `{{NAME}}`, `{{TRAITS}}`, `{{PALETTE}}` and every
> `{{...}}` with the text from `CHARACTER.md`, and adds the "{{NAME}} specifics" from
> `ANIMATIONS.md` to each pose line, so nobody has to assemble anything.

## How to use

1. Work in the order of `step` (see [PIPELINE.md](../../PIPELINE.md#generation-order)).
2. **Attach the approved references as image inputs first**: `reference/model_sheet.png` (from
   step 2 on), `reference/expressions.png` (every prompt after step 2) and, once idle is approved,
   `reference/idle_approved.png` (or the latest approved strip of the same move family). As identity
   references, attach only approved fixed-name files. Two exceptions: (a) a Part B block attaches
   Part A of the same version; (b) a retry of S1/S2 or a strip fix may attach the candidate being
   corrected, together with the list of changes. Never attach `reference/source/` (copyrighted),
   `reference/_old/` or a v1 image. Then paste the block.
3. Make up to 3 attempts, then save only the best one under the block's **Save as** path with the
   **next free version** in place of `NN` (`v01`, `v02`, ...: 1 + the highest number used for that
   asset in the folder, `raw/_parts/`, its `_rejected/` folder and `art/REVIEW.md`). Never overwrite
   an earlier version.
4. Add a `needs review` row at the top of `art/REVIEW.md` and set the asset's `version` in
   `art/manifest.json` (see [REVIEW.md](../../REVIEW.md)). The user approves or rejects it there or
   in chat.
5. One thread per character (Naruto and Sasuke can run in parallel in separate threads, never in
   one image); start a fresh thread (re-attach the references) when it drifts or after about 6
   strips. Every block restates the palette, proportions and rules, so it works in a fresh thread.
6. Wrong pose count, off-model, chibi proportions or drifting colors: use the
   [fix-up prompts](#fix-up-prompts). Refusal: use the [fallback wording](#fallback-wording).

## Shared pieces (fill once, reused everywhere)

**TRAITS** (from `CHARACTER.md`, "One-paragraph look"):

```text
{{TRAITS: e.g. "a lean, athletic 16-year-old ninja with spiky golden-yellow hair, blue eyes, three thin whisker marks on each cheek, a black cloth forehead protector with a polished metal plate, a black-and-orange zip-up jacket with a high collar, orange pants, black ninja sandals"}}
```

**PALETTE** (from `CHARACTER.md`, "Palette"; keep the hexes):

```text
{{PALETTE: e.g. "skin #f8c69b/#d98a66/#ffe2c6, hair #ffc935/#e0861c/#ffe36a/#fff6c2, jacket #f88320/#c44d14/#ffac48, black #2b2c42/#17182a/#474a72, outline #1d1420"}}
```

**NAME LINE** (optional; delete it if the image generator refuses, see fallback):

```text
Character: {{full name}} from {{series}} ({{outfit/version, e.g. "Shippuden era, about 16"}}), drawn as fan art.
```

## Step 1: model sheet and turnaround

One image holds the turnaround, the fighting stance and the palette. Iterate until the user
approves it; it is attached to every later prompt.

Save as: `reference/model_sheet_vNN.png` (approved one copied to `reference/model_sheet.png`) ·
attach: nothing (don't upload official screenshots or the archived spec v1 sheet; the TRAITS text
carries the design).

```text
Hi-res pixel art character model sheet, anime fan-art 2D fighting game sprite reference, wide landscape image.
{{NAME LINE}}
The character: {{TRAITS}}.
Top row, all the same size, standing upright and relaxed: front view, 3/4 view facing right, a TRUE SIDE PROFILE facing RIGHT (the body seen exactly from the side, only one eye visible, the nose, lips and chin in silhouette, the shoulders seen edge-on; a real profile, not a 3/4 view), back view (a turnaround). Bottom row: the same character in a fighting stance, body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), knees bent, fists up, lead fist in front; next to it a row of flat color swatches of the palette.
About 6.5 heads tall: anime-accurate Shippuden-era face and proportions, faithful to the official character design; athletic teenage build, long legs, defined shoulders, small head; serious expression. Not chibi, not super-deformed, no big head, no oversized hands or feet. Every figure the same size.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. On this sheet draw at 2x: every art pixel is a 2x2 block, so the standing body (soles to top of the skull) is about 400 px tall on the canvas, the hair on top of that.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering. Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF. No ground shadow, no text, no labels.
```

## Step 2: expression sheet

Save as: `reference/expressions_vNN.png` (approved one copied to `reference/expressions.png`) · attach: `reference/model_sheet.png`.

```text
Hi-res pixel art expression sheet of the attached character, anime fan-art sprite reference: 7 head-and-shoulders portraits in one horizontal row, all in 3/4 view facing right with both eyes visible: (1) determined neutral, (2) angry focused, (3) shouting with mouth wide open, (4) {{grin / smirk}}, (5) pain with eyes squeezed shut, (6) eyes closed knocked out, (7) {{special state, e.g. "red eyes with three black tomoe" / "dizzy swirl eyes"}}.
Match the attached model sheet exactly: same face, hair, colors, proportions and pixel density; serious, anime-accurate Shippuden-era faces, not chibi. The character: {{TRAITS}}.
Crisp hard pixel art, 1-pixel dark outline, 3-5 tone cel shading, no anti-aliasing, no blur, no gradients. Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF. No text, no labels.
```

## Animation strips

Each block: attach `reference/model_sheet.png` + `reference/expressions.png` +
`reference/idle_approved.png` (for idle itself: the model sheet + expressions). When an idle version
is approved, Codex copies that `raw/idle_vNN.png` to `reference/idle_approved.png`. With 6.5-head
bodies, strips wider than 4-5 poses come out small and cramped, so **every strip with 6 or more
frames has a Part A and a Part B block**: save them as `raw/_parts/<anim>_vNN_A.png` and `_B.png`
(same NN; run Part B with Part A attached) and Codex stitches them into `raw/<anim>_vNN.png`
(art/PIPELINE.md "Long strips (parts)"). The split keeps all active (hit) frames in the same image.

### Step 3: idle

#### idle

Save as: `raw/_parts/idle_vNN_A.png` + `raw/_parts/idle_vNN_B.png` (same NN; Codex stitches them into `raw/idle_vNN.png`) · 8 poses in **two images** (poses 1-4, then 5-8) · loop · core

Part A (save as `raw/_parts/idle_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART A of 2: poses 1 to 4 of a 8-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "idle": fighting stance, fists up, breathing bob (loop). The last pose must flow back into the first (looping animation).
Pose 1: neutral fighting stance: knees bent, lead (far) fist up in front at chin height, rear (near) fist guarding the chin, weight centered between the feet{{; NAME specifics}}.
Pose 2: inhale: chest rises a tiny bit, shoulders lift slightly{{; NAME specifics}}.
Pose 3: top of breath: shoulders up slightly, hair/cloth tips lift{{; NAME specifics}}.
Pose 4: exhale begins: body a tiny bit down{{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/idle_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART B of 2: poses 5 to 8 of a 8-pose animation; the attached part A shows poses 1 to 4: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "idle": fighting stance, fists up, breathing bob (loop). The last pose must flow back into the first (looping animation).
Pose 5: bottom of breath: knees bend slightly more, shoulders drop{{; NAME specifics}}.
Pose 6: hold bottom: hair/cloth settle one frame late (secondary motion){{; NAME specifics}}.
Pose 7: rising slightly{{; NAME specifics}}.
Pose 8: almost back to pose 1 (must loop seamlessly into pose 1); feet never move{{; NAME specifics}}.
```

### Step 4: run

#### run

Save as: `raw/_parts/run_vNN_A.png` + `raw/_parts/run_vNN_B.png` (same NN; Codex stitches them into `raw/run_vNN.png`) · 8 poses in **two images** (poses 1-4, then 5-8) · loop · core

Part A (save as `raw/_parts/run_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART A of 2: poses 1 to 4 of a 8-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "run": run cycle; ninja run with the torso leaned forward and arms trailing straight back (loop). The last pose must flow back into the first (looping animation).
Pose 1: CONTACT: near leg forward, heel touching, far leg back; torso leaned forward ~35-40 degrees; both arms trailing straight back{{; NAME specifics}}.
Pose 2: DOWN: weight on the near leg, knee bent, body at its lowest{{; NAME specifics}}.
Pose 3: PASSING: far leg swings forward under the body, near leg straightening{{; NAME specifics}}.
Pose 4: UP: push off the near toes, body at its highest, both feet nearly off the ground; hair/cloth stream back{{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/run_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART B of 2: poses 5 to 8 of a 8-pose animation; the attached part A shows poses 1 to 4: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "run": run cycle; ninja run with the torso leaned forward and arms trailing straight back (loop). The last pose must flow back into the first (looping animation).
Pose 5: CONTACT (like pose 1 with the legs swapped): far leg forward, near leg back{{; NAME specifics}}.
Pose 6: DOWN (like pose 2 with the legs swapped){{; NAME specifics}}.
Pose 7: PASSING (like pose 3 with the legs swapped){{; NAME specifics}}.
Pose 8: UP (like pose 4 with the legs swapped); flows back into pose 1{{; NAME specifics}}.
```

### Step 5: core attacks

#### light1

Save as: `raw/_parts/light1_vNN_A.png` + `raw/_parts/light1_vNN_B.png` (same NN; Codex stitches them into `raw/light1_vNN.png`) · 7 poses in **two images** (poses 1-4, then 5-7) · phases 2/2/3 · core · strike: lead (far) fist, contact x 206-226, y 64-86 (256 cell)

Part A (save as `raw/_parts/light1_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART A of 2: poses 1 to 4 of a 7-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light1": jab: wind-up, lead fist fully extended (2 frames), recover.
On the STRIKE poses the lead (far) fist is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): anticipation: shoulders turn back slightly, lead fist pulls back slightly toward the chin, small step forward begins{{; NAME specifics}}.
Pose 2 (startup): lead foot slides forward, hips start turning, lead fist halfway out (a short SOLID smear shape behind the fist is allowed){{; NAME specifics}}.
Pose 3 (STRIKE / active): lead (far) arm fully extended HORIZONTALLY toward the right at face height; fist is the right-most point; shoulder rolled in, chin tucked{{; NAME specifics}}.
Pose 4 (STRIKE / active): hold the extension (tiny recoil, sleeve/hair follow-through){{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/light1_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character (PART B of 2: poses 5 to 7 of a 7-pose animation; the attached part A shows poses 1 to 4: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light1": jab: wind-up, lead fist fully extended (2 frames), recover.
Pose 5 (recovery): fist retracting halfway{{; NAME specifics}}.
Pose 6 (recovery): back toward guard, weight returning{{; NAME specifics}}.
Pose 7 (recovery): fighting stance (close to the idle stance so the chain blends){{; NAME specifics}}.
```

#### light2

Save as: `raw/_parts/light2_vNN_A.png` + `raw/_parts/light2_vNN_B.png` (same NN; Codex stitches them into `raw/light2_vNN.png`) · 7 poses in **two images** (poses 1-4, then 5-7) · phases 2/2/3 · core · strike: rear (near) fist, contact x 214-236, y 70-92 (256 cell)

Part A (save as `raw/_parts/light2_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART A of 2: poses 1 to 4 of a 7-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light2": straight punch with the rear arm: wind-up, extended (2 frames), recover.
On the STRIKE poses the rear (near) fist is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): weight shifts onto the rear (near) foot, rear fist cocked at the cheek, lead arm starting to pull back{{; NAME specifics}}.
Pose 2 (startup): hips and shoulders rotate toward the right, rear heel lifts, rear fist launches (solid smear allowed){{; NAME specifics}}.
Pose 3 (STRIKE / active): rear (near) arm fully extended HORIZONTALLY at face/upper-chest height, crossing IN FRONT of the torso; lead fist pulled back to the chin{{; NAME specifics}}.
Pose 4 (STRIKE / active): hold (rear shoulder fully forward, follow-through in hair/cloth){{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/light2_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character (PART B of 2: poses 5 to 7 of a 7-pose animation; the attached part A shows poses 1 to 4: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light2": straight punch with the rear arm: wind-up, extended (2 frames), recover.
Pose 5 (recovery): arm retracting{{; NAME specifics}}.
Pose 6 (recovery): torso unwinding{{; NAME specifics}}.
Pose 7 (recovery): fighting stance{{; NAME specifics}}.
```

#### light3

Save as: `raw/_parts/light3_vNN_A.png` + `raw/_parts/light3_vNN_B.png` (same NN; Codex stitches them into `raw/light3_vNN.png`) · 7 poses in **two images** (poses 1-4, then 5-7) · phases 2/2/3 · core · strike: near foot (sole/heel), contact x 222-246, y 122-148 (256 cell)

Part A (save as `raw/_parts/light3_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART A of 2: poses 1 to 4 of a 7-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light3": front kick at stomach height: knee chambered, leg extended (2 frames), recover.
On the STRIKE poses the near foot (sole/heel) is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): weight onto the lead foot, arms up for balance{{; NAME specifics}}.
Pose 2 (startup): rear (near) knee chambered high in front of the body, foot cocked{{; NAME specifics}}.
Pose 3 (STRIKE / active): near leg snapped straight HORIZONTALLY toward the right at stomach height, sole/heel forward; torso leans back a little to counterbalance{{; NAME specifics}}.
Pose 4 (STRIKE / active): hold the extension{{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/light3_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character (PART B of 2: poses 5 to 7 of a 7-pose animation; the attached part A shows poses 1 to 4: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light3": front kick at stomach height: knee chambered, leg extended (2 frames), recover.
Pose 5 (recovery): knee re-chambers{{; NAME specifics}}.
Pose 6 (recovery): foot comes down a step forward{{; NAME specifics}}.
Pose 7 (recovery): fighting stance{{; NAME specifics}}.
```

#### light4

Save as: `raw/_parts/light4_vNN_A.png` + `raw/_parts/light4_vNN_B.png` (same NN; Codex stitches them into `raw/light4_vNN.png`) · 8 poses in **two images** (poses 1-5, then 6-8) · phases 3/2/3 · core · strike: kicking foot, contact x 224-248, y 56-88 (256 cell)

Part A (save as `raw/_parts/light4_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character (PART A of 2: poses 1 to 5 of a 8-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light4": spinning roundhouse finisher: wind-up and spin, leg high and extended (2 frames), recover.
On the STRIKE poses the kicking foot is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): step in: lead foot plants, torso starts turning away{{; NAME specifics}}.
Pose 2 (startup): spin: back partly toward the camera, arms pulled in, head turned to keep eyes on the target{{; NAME specifics}}.
Pose 3 (startup): coming around: kicking knee chambered high, hips rotating toward the right{{; NAME specifics}}.
Pose 4 (STRIKE / active): kicking leg fully extended HORIZONTALLY at head height; foot is the right-most point (solid smear arc behind the foot allowed){{; NAME specifics}}.
Pose 5 (STRIKE / active): follow-through: leg still extended, a little further{{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/light4_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character (PART B of 2: poses 6 to 8 of a 8-pose animation; the attached part A shows poses 1 to 5: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light4": spinning roundhouse finisher: wind-up and spin, leg high and extended (2 frames), recover.
Pose 6 (recovery): leg sweeping down{{; NAME specifics}}.
Pose 7 (recovery): foot lands, body still turned{{; NAME specifics}}.
Pose 8 (recovery): back to fighting stance{{; NAME specifics}}.
```

#### heavy

Save as: `raw/_parts/heavy_vNN_A.png` + `raw/_parts/heavy_vNN_B.png` (same NN; Codex stitches them into `raw/heavy_vNN.png`) · 8 poses in **two images** (poses 1-5, then 6-8) · phases 3/2/3 · core · strike: rear (near) fist, F03 contact x 180-208, y 58-86; F04 overhead x 160-188, y 22-46 (256 cell)

Part A (save as `raw/_parts/heavy_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character (PART A of 2: poses 1 to 5 of a 8-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "heavy": rising uppercut launcher: deep crouch, explode upward with the fist straight up (2 frames), land.
On the HIT poses the rear (near, right) fist rises IN FRONT of the face: pose 4 at the opponent's chin height with the elbow bent, pose 5 overhead but still in front of the face; on pose 4 nothing reaches further right than the fist.
Pose 1 (startup): drop into a crouch, rear fist drops to the hip{{; NAME specifics}}.
Pose 2 (startup): deepest crouch, coiled; rear (near) fist low by the knee, eyes on the target{{; NAME specifics}}.
Pose 3 (startup): explode: legs drive up, fist starts rising in front of the body{{; NAME specifics}}.
Pose 4 (STRIKE / active): CONTACT: fist rising through the opponent's chin height IN FRONT of the body, body extending upward{{; NAME specifics}}.
Pose 5 (STRIKE / active): fist overhead but still in front of the face, body fully stretched, toes leaving the ground (tallest frame of the strip){{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/heavy_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character (PART B of 2: poses 6 to 8 of a 8-pose animation; the attached part A shows poses 1 to 5: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "heavy": rising uppercut launcher: deep crouch, explode upward with the fist straight up (2 frames), land.
On the HIT poses the rear (near, right) fist rises IN FRONT of the face: pose 4 at the opponent's chin height with the elbow bent, pose 5 overhead but still in front of the face; on pose 4 nothing reaches further right than the fist.
Pose 6 (recovery): peak of the hop, arm still up{{; NAME specifics}}.
Pose 7 (recovery): descending, arm lowering{{; NAME specifics}}.
Pose 8 (recovery): land in fighting stance{{; NAME specifics}}.
```

#### airLight1

Save as: `raw/airLight1_vNN.png` · 5 poses · phases 1/2/2 · core · strike: lead fist, contact x 206-230, y 100-120 (256 cell)

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airLight1": mid-air jab.
On the STRIKE poses the lead fist is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): air pose (knees tucked), lead fist cocked{{; NAME specifics}}.
Pose 2 (STRIKE / active): air jab: lead arm extended HORIZONTALLY at chest height, legs tucked{{; NAME specifics}}.
Pose 3 (STRIKE / active): hold{{; NAME specifics}}.
Pose 4 (recovery): retract{{; NAME specifics}}.
Pose 5 (recovery): neutral air pose (knees tucked){{; NAME specifics}}.
```

#### airHeavy

Save as: `raw/_parts/airHeavy_vNN_A.png` + `raw/_parts/airHeavy_vNN_B.png` (same NN; Codex stitches them into `raw/airHeavy_vNN.png`) · 6 poses in **two images** (poses 1-4, then 5-6) · phases 2/2/2 · core · strike: both clasped fists, contact x 180-218, y 160-206 (below the attacker's chest, in front) (256 cell)

Part A (save as `raw/_parts/airHeavy_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART A of 2: poses 1 to 4 of a 6-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airHeavy": double-fist hammer: both fists raised overhead, then smashed down-forward.
On the STRIKE poses both clasped fists are fully extended DOWN and forward and are the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): both hands clasped and raised overhead, back arched{{; NAME specifics}}.
Pose 2 (startup): highest wind-up: clasped fists behind the head, knees tucked{{; NAME specifics}}.
Pose 3 (STRIKE / active): SMASH: clasped fists swung down-forward in front of the body, below chest height{{; NAME specifics}}.
Pose 4 (STRIKE / active): follow-through, fists at their lowest{{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/airHeavy_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character (PART B of 2: poses 5 to 6 of a 6-pose animation; the attached part A shows poses 1 to 4: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airHeavy": double-fist hammer: both fists raised overhead, then smashed down-forward.
Pose 5 (recovery): recover, arms rising{{; NAME specifics}}.
Pose 6 (recovery): neutral air pose{{; NAME specifics}}.
```

### Step 6: reactions

#### guard

Save as: `raw/guard_vNN.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "guard": blocking, forearms crossed in front of the face (loop). The last pose must flow back into the first (looping animation).
Pose 1: forearms crossed in front of the face, knees bent, chin tucked, eyes visible over the arms{{; NAME specifics}}.
Pose 2: tiny breathing variation{{; NAME specifics}}.
```

#### hurtHigh

Save as: `raw/hurtHigh_vNN.png` · 3 poses · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "hurtHigh": hit in the face: head snapped back, arms flung back.
Pose 1: impact: head snapped back, chin up, eyes squeezed/shocked, arms flung back{{; NAME specifics}}.
Pose 2: deepest recoil, torso arched back{{; NAME specifics}}.
Pose 3: recovering, head coming forward{{; NAME specifics}}.
```

#### launched

Save as: `raw/launched_vNN.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "launched": knocked flying backwards, body arched back, limbs flailing (loop). The last pose must flow back into the first (looping animation).
Pose 1: flying backwards: body arched back diagonally (not fully horizontal), head trailing up and to the left, limbs flailing forward{{; NAME specifics}}.
Pose 2: limb/hair variation{{; NAME specifics}}.
```

#### down

Save as: `raw/down_vNN.png` · 2 poses · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "down": hitting the ground, then lying flat on the back.
Pose 1: back slams the ground: arms and legs bounce up{{; NAME specifics}}.
Pose 2: lying flat on the back, head toward the left, feet toward the right, limbs relaxed and close to the body (not spread wide){{; NAME specifics}}.
```

#### getup

Save as: `raw/getup_vNN.png` · 5 poses · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "getup": kip-up from lying on the back to standing.
Pose 1: lying on the back, knees pulled to the chest, hands by the head{{; NAME specifics}}.
Pose 2: legs kicked up and forward{{; NAME specifics}}.
Pose 3: kip-up spring: body airborne, rotating upright{{; NAME specifics}}.
Pose 4: landing crouch{{; NAME specifics}}.
Pose 5: fighting stance{{; NAME specifics}}.
```

### Step 7: specials

#### charge

Save as: `raw/charge_vNN.png` · 4 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "charge": powering up: wide stance, fists clenched at the sides, shouting upward (loop). The last pose must flow back into the first (looping animation).
Pose 1: wide stance, fists clenched at the sides, head tilted up shouting, hair/cloth blown upward{{; NAME specifics}}.
Pose 2: tiny shake to the left, cloth variation{{; NAME specifics}}.
Pose 3: like pose 1 with a hair flicker{{; NAME specifics}}.
Pose 4: tiny shake to the right{{; NAME specifics}}.
```

#### beamCharge

Save as: `raw/beamCharge_vNN.png` · 3 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "beamCharge": charging a beam: both hands cupped together at the rear hip, shouting (loop). The last pose must flow back into the first (looping animation).
Pose 1: both hands cupped together at the rear hip (the left side of the body), knees bent, shouting{{; NAME specifics}}.
Pose 2: tiny shake variation{{; NAME specifics}}.
Pose 3: hair/cloth flicker variation{{; NAME specifics}}.
```

#### beamFire

Save as: `raw/beamFire_vNN.png` · 3 poses · loop · core · strike: both palms (beam origin), beam origin x 222-238, y 112-132 (256 cell)

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "beamFire": firing a beam: both arms thrust straight forward, palms open, shouting (loop). The last pose must flow back into the first (looping animation).
On the STRIKE poses both palms (beam origin) are fully extended HORIZONTALLY toward the right edge and are the right-most point of the pose, clearly separated from the body.
Pose 1: both arms thrust straight forward HORIZONTALLY, palms open together facing the right, wide braced stance{{; NAME specifics}}.
Pose 2: small recoil shake{{; NAME specifics}}.
Pose 3: hair/cloth variation{{; NAME specifics}}.
```

#### special

Save as: `raw/_parts/special_vNN_A.png` + `raw/_parts/special_vNN_B.png` (same NN; Codex stitches them into `raw/special_vNN.png`) · 8 poses in **two images** (poses 1-3, then 4-8) · phases 3/3/2 · core · strike: technique hand, contact x 194-222, y 128-158 (256 cell)

Part A (save as `raw/_parts/special_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character (PART A of 2: poses 1 to 3 of a 8-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "special": signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover.
Pose 1 (startup): plant wide, hands start forming the technique (character-specific hand position){{; NAME specifics}}.
Pose 2 (startup): technique growing, shouting{{; NAME specifics}}.
Pose 3 (startup): technique fully formed, last frame before the rush{{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/special_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character (PART B of 2: poses 4 to 8 of a 8-pose animation; the attached part A shows poses 1 to 3: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "special": signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover.
On the THRUST pose the technique hand is fully extended horizontally and is the right-most point; on the run poses hold it as {{forward / trailing}} per MOVES_AND_VFX.md.
Pose 4 (STRIKE / active): RUN holding it (run contact pose), technique hand forward or trailing per character{{; NAME specifics}}.
Pose 5 (STRIKE / active): RUN passing pose, still holding{{; NAME specifics}}.
Pose 6 (STRIKE / active): THRUST: technique arm fully extended HORIZONTALLY toward the right at chest height (the hit frame){{; NAME specifics}}.
Pose 7 (recovery): follow-through{{; NAME specifics}}.
Pose 8 (recovery): recover to stance{{; NAME specifics}}.
```

### Step 8: rest (core)

#### dash

Save as: `raw/dash_vNN.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "dash": low fast forward dash, body leaning far forward, arms back (loop). The last pose must flow back into the first (looping animation).
Pose 1: low forward burst: torso almost horizontal, rear leg extended pushing off, lead knee bent forward, arms trailing back, hair streaming back{{; NAME specifics}}.
Pose 2: same pose, legs slightly alternated and cloth/hair flap changed (2-frame shimmer loop){{; NAME specifics}}.
```

#### jumpUp

Save as: `raw/jumpUp_vNN.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "jumpUp": rising in the air, knees tucked, one arm up (loop). The last pose must flow back into the first (looping animation).
Pose 1: rising: knees tucked up, one arm raised up-forward, other arm back, hair/cloth trailing downward{{; NAME specifics}}.
Pose 2: same pose with a cloth/hair flap variation{{; NAME specifics}}.
```

#### jumpFall

Save as: `raw/jumpFall_vNN.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "jumpFall": falling, legs extending down, arms out for balance (loop). The last pose must flow back into the first (looping animation).
Pose 1: falling: legs extending downward, arms spread out for balance, hair/cloth lifting up{{; NAME specifics}}.
Pose 2: same pose with a cloth/hair flap variation{{; NAME specifics}}.
```

#### land

Save as: `raw/land_vNN.png` · 2 poses · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "land": landing crouch, then rising.
Pose 1: impact crouch: knees deeply bent, arms down/out for balance, hair still lifted{{; NAME specifics}}.
Pose 2: rising halfway back toward the fighting stance, hair settling{{; NAME specifics}}.
```

#### win

Save as: `raw/win_vNN.png` · 4 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "win": victory pose (loop). The last pose must flow back into the first (looping animation).
Pose 1: signature victory pose{{; NAME specifics}}.
Pose 2: variation (cloth/hair, small body motion){{; NAME specifics}}.
Pose 3: like pose 1 with hair variation{{; NAME specifics}}.
Pose 4: variation, flows back into pose 1{{; NAME specifics}}.
```

### Step 9: rest (optional)

#### backDash

Save as: `raw/backDash_vNN.png` · 3 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "backDash": quick hop backwards.
Pose 1: push off the lead foot, torso leaning back, guard up{{; NAME specifics}}.
Pose 2: airborne hop backward: knees tucked, body upright and tilted back, guard up{{; NAME specifics}}.
Pose 3: landing on the toes, knees bent, guard up (ready to blend into idle){{; NAME specifics}}.
```

#### superDash

Save as: `raw/superDash_vNN.png` · 2 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "superDash": flying like a missile, angled about 25 degrees upward, knees bent, one fist thrust forward (loop). The last pose must flow back into the first (looping animation).
Pose 1: flight toward the right with the body angled about 25 degrees upward (not stretched flat): lead fist thrust forward at head level (forward-most point), other arm back along the body, knees bent, legs together trailing below and behind{{; NAME specifics}}.
Pose 2: same pose, hair/cloth flap and a small limb variation{{; NAME specifics}}.
```

#### jumpSquat

Save as: `raw/jumpSquat_vNN.png` · 1 pose · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 1 pose of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "jumpSquat": crouch right before jumping.
Pose 1: compressed crouch: knees deeply bent, torso leaned forward, arms swung back, about to spring{{; NAME specifics}}.
```

#### airLight2

Save as: `raw/airLight2_vNN.png` · 5 poses · phases 1/2/2 · optional · strike: near foot, contact x 220-246, y 130-155 (256 cell)

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airLight2": mid-air front kick.
On the STRIKE poses the near foot is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): knee chambered in the air{{; NAME specifics}}.
Pose 2 (STRIKE / active): air front kick: near leg extended HORIZONTALLY, sole forward, at hip height{{; NAME specifics}}.
Pose 3 (STRIKE / active): hold{{; NAME specifics}}.
Pose 4 (recovery): retract{{; NAME specifics}}.
Pose 5 (recovery): neutral air pose{{; NAME specifics}}.
```

#### airLight3

Save as: `raw/_parts/airLight3_vNN_A.png` + `raw/_parts/airLight3_vNN_B.png` (same NN; Codex stitches them into `raw/airLight3_vNN.png`) · 6 poses in **two images** (poses 1-4, then 5-6) · phases 2/2/2 · optional · strike: kicking heel, contact x 222-248, y 105-150 (256 cell)

Part A (save as `raw/_parts/airLight3_vNN_A.png`):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character (PART A of 2: poses 1 to 4 of a 6-pose animation) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airLight3": mid-air spinning kick that knocks away.
On the STRIKE poses the kicking heel is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): turn away in the air, knees tucked{{; NAME specifics}}.
Pose 2 (startup): spin: back partly toward the camera{{; NAME specifics}}.
Pose 3 (STRIKE / active): spin kick: leg extended HORIZONTALLY, heel forward, body tilted{{; NAME specifics}}.
Pose 4 (STRIKE / active): follow-through{{; NAME specifics}}.
```

Part B (attach part A too; save as `raw/_parts/airLight3_vNN_B.png`, same NN):

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character (PART B of 2: poses 5 to 6 of a 6-pose animation; the attached part A shows poses 1 to 4: use exactly the same head size, baseline and design as part A) in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airLight3": mid-air spinning kick that knocks away.
Pose 5 (recovery): tuck{{; NAME specifics}}.
Pose 6 (recovery): neutral air pose{{; NAME specifics}}.
```

#### block

Save as: `raw/block_vNN.png` · 2 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "block": blocking while being pushed back, eyes shut.
Pose 1: impact: pushed back, torso leaning back, eyes shut, arms still crossed, rear foot sliding{{; NAME specifics}}.
Pose 2: recovering into guard{{; NAME specifics}}.
```

#### hurtLow

Save as: `raw/hurtLow_vNN.png` · 3 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "hurtLow": hit in the stomach: doubled over.
Pose 1: impact to the stomach: doubled over, mouth open, hands toward the stomach{{; NAME specifics}}.
Pose 2: deepest fold{{; NAME specifics}}.
Pose 3: recovering upright{{; NAME specifics}}.
```

#### spin

Save as: `raw/spin_vNN.png` · 4 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "spin": tumbling head over heels through the air (one full backward rotation, loop). The last pose must flow back into the first (looping animation).
Pose 1: tucked, tilted back ~30 degrees{{; NAME specifics}}.
Pose 2: rotated to horizontal (head toward the left){{; NAME specifics}}.
Pose 3: upside down{{; NAME specifics}}.
Pose 4: rotated 270 degrees (head toward the right), flows back into pose 1{{; NAME specifics}}.
```

#### airRecover

Save as: `raw/airRecover_vNN.png` · 3 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airRecover": backflip recovery in mid-air.
Pose 1: tucked backflip start{{; NAME specifics}}.
Pose 2: upside-down tuck{{; NAME specifics}}.
Pose 3: upright, arms out, legs ready to land{{; NAME specifics}}.
```

#### throw

Save as: `raw/throw_vNN.png` · 4 poses · phases 1/1/2 · optional · strike: throwing hand (release point), release x 186-212, y 116-142 (256 cell)

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "throw": throwing a projectile in mid-air: arm cocked back, whipped forward, follow-through.
On the STRIKE poses the throwing hand (release point) is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): arm cocked back behind the head (a small held weapon may be drawn in the hand){{; NAME specifics}}.
Pose 2 (STRIKE / active): arm whipped forward HORIZONTALLY, hand open at the release point{{; NAME specifics}}.
Pose 3 (recovery): follow-through: arm across the body{{; NAME specifics}}.
Pose 4 (recovery): neutral air pose{{; NAME specifics}}.
```

#### vanish

Save as: `raw/vanish_vNN.png` · 2 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "vanish": crouch and blur before teleporting.
Pose 1: quick crouch (squash){{; NAME specifics}}.
Pose 2: stretched tall upward, toes pointed (stretch; tallest frame){{; NAME specifics}}.
```

#### stagger

Save as: `raw/stagger_vNN.png` · 4 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "stagger": dizzy stagger (loop). The last pose must flow back into the first (looping animation).
Pose 1: wobbly knees, leaning left, arms dangling, unfocused eyes{{; NAME specifics}}.
Pose 2: center{{; NAME specifics}}.
Pose 3: leaning right{{; NAME specifics}}.
Pose 4: center{{; NAME specifics}}.
```

#### ko

Save as: `raw/ko_vNN.png` · 1 pose · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 1 pose of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "ko": knocked out, lying flat on the back.
Pose 1: lying flat on the back, limbs loose and close to the body, eyes closed, head toward the left{{; NAME specifics}}.
```

#### intro

Save as: `raw/intro_vNN.png` · 4 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "intro": pre-fight intro pose (character-specific attitude, loop). The last pose must flow back into the first (looping animation).
Pose 1: signature pre-fight attitude pose{{; NAME specifics}}.
Pose 2: breathing / cloth flutter variation{{; NAME specifics}}.
Pose 3: like pose 1 with hair variation{{; NAME specifics}}.
Pose 4: breathing variation, flows back into pose 1{{; NAME specifics}}.
```

#### taunt

Save as: `raw/taunt_vNN.png` · 2 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 6.5 heads tall: anime-accurate Shippuden-era proportions, athletic teenage build, long legs, defined shoulders, small head; serious tone. Not chibi, not super-deformed, no big head, no oversized hands or feet. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-5 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "taunt": confident taunt / pointing at the opponent (loop). The last pose must flow back into the first (looping animation).
Pose 1: signature taunt pose{{; NAME specifics}}.
Pose 2: small variation (cloth/hair){{; NAME specifics}}.
```

#### Kit animations (only if this fighter's kit uses them)

`specialForward` (7 poses, 2/2/3), `specialUp` (6, 2/2/2), `specialDown` (4, 2/1/1) and `superPose`
(4, loop) are drawn only for a fighter whose kit maps moves to them
([ADR 0009](../../../docs/decisions/0009-move-system-v2.md), [ANIMATIONS.md](ANIMATIONS.md#specialforward)).
Write each block like the `taunt` block above: same SIZE/BODY/PIXEL/BACKGROUND lines, then
`Animation "<name>": <description>` and one `Pose N:` line per frame from ANIMATIONS.md. Save as
`raw/<name>_vNN.png`. Paste-ready examples: [killua/PROMPTS.md](../killua/PROMPTS.md) (A39-A42) and
[gojo/PROMPTS.md](../gojo/PROMPTS.md) (A39-A42). A shorter or taller fighter
([ADR 0010](../../../docs/decisions/0010-per-character-body-scale.md)) changes the SIZE line's body
height in every block.

## Step 11: UI

Save each candidate as `raw/ui_<name>_vNN.png` (the sheet packer skips `ui_*`) and queue it in
`art/REVIEW.md`. When the user approves one, Codex copies it to `ui/<name>.png`; the packer removes
the magenta background and fits it to the exact size (nearest-neighbor / mode, never smooth; SPEC.md
"Per-character UI images"). Same Shippuden design and proportions as the sprites.

#### portrait (96x96)

Save as: `raw/ui_portrait_vNN.png` -> approved copy `ui/portrait.png` (packed to 96x96, transparent).

```text
Hi-res pixel art character portrait, anime fan-art fighting game HUD icon, square image. Head and shoulders of the attached character, 3/4 view facing RIGHT, both eyes visible, {{expression}} expression. Match the attached model sheet exactly. The character: {{TRAITS}}.
Crisp hard pixel art, 1-pixel dark outline, 3-5 tone cel shading, light from the upper front right, no anti-aliasing, no blur, no gradients. Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF. No text, no frame.
```

#### cutin (480x128)

Save as: `raw/ui_cutin_vNN.png` -> approved copy `ui/cutin.png` (packed to 480x128, opaque).

```text
Hi-res pixel art super-move cut-in strip, like the super flashes of 2D anime fighting games: a very wide horizontal banner (ratio 15:4) filled edge to edge by a tight close-up of the attached character's eyes and eyebrows, both eyes visible, intense {{expression / special eye state}} expression, dramatic lighting from the right. The face fills the strip; a flat {{background band color: character color or dark navy}} may show only around the eyes and brows. No speed lines (the game adds them). Match the attached model sheet exactly. The character: {{TRAITS}}.
Crisp hard pixel art, dark outlines, 3-5 tone cel shading, no anti-aliasing, no blur, no gradients. Use only these colors: {{PALETTE}}.
No text, no frame, no logo.
```

#### select (384x384)

Save as: `raw/ui_select_vNN.png` -> approved copy `ui/select.png` (packed to 384x384, transparent).

```text
Hi-res pixel art full-body character select art, anime fan-art fighting game, square image. The attached character in a confident signature pose ({{pose}}), 3/4 view facing RIGHT, filling most of the height. About 6.5 heads tall, anime-accurate Shippuden-era proportions, not chibi. Match the attached model sheet exactly. The character: {{TRAITS}}.
Crisp hard pixel art, 1-pixel dark outline, 3-5 tone cel shading, light from the upper front right, no anti-aliasing, no blur, no gradients. Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF. No ground shadow, no text.
```

## Fix-up prompts

Use in the same thread, right after a result (attach the strip if it's a new thread). Every result
you keep is saved as the next `_vNN` and gets its own REVIEW.md row.

Redraw one pose (save attempts as `raw/<anim>_NN_fixMM.png`, NN = frame, MM = attempt; patch the keeper into the strip and save the
patched strip as the next `raw/<anim>_vNN.png`; see PIPELINE "Fixing frames"):

```text
Redraw only pose {{N}} of the attached strip as a single image: same character, same scale, same colors, same pixel style, flat magenta #FF00FF background, facing right. Pose: {{pose description}}. No shadow, no text.
```

One correction to the whole strip:

```text
Same strip, same character and poses, but {{one change, e.g. "in poses 3 and 4 the fist is fully extended horizontally to the right at face height"}}. Keep everything else identical. Flat magenta #FF00FF background, no shadow, no text.
```

Second half of a long strip:

```text
Continue the attached strip: draw poses {{5-8}} of the same animation in one horizontal row at exactly the same scale, style and colors. {{pose lines 5-8}}. Flat magenta #FF00FF background, no shadow, no text.
```

Chibi drift (head too big, legs too short):

```text
Same strip, same poses and colors, but redraw the character at about 6.5 heads tall: smaller head, longer legs and arms, defined shoulders, anime-accurate Shippuden-era proportions matching the attached model sheet. Not chibi, not super-deformed. Keep everything else identical. Flat magenta #FF00FF background, no shadow, no text.
```

Color drift:

```text
Same image, but use exactly these colors and no others: {{PALETTE}}. Keep the poses identical.
```

## Fallback wording

If the image generator refuses or keeps changing the design:

1. Delete the `{{NAME LINE}}` line (no character or series names anywhere).
2. Replace the first line with: "Hi-res pixel art sprite strip of an original character inspired by
   classic shonen ninja anime, fan-art sprite for a personal non-commercial game project."
3. Keep TRAITS, PALETTE and the pose lines unchanged: the description carries the design.
4. Keep the proportion sentence ("about 6.5 heads tall ... not chibi"): it carries no names.
5. Never add "in the style of <artist>". If it still refuses, note it in the REVIEW row or TRACKER and
   ask Codex or Claude to rephrase the traits.
