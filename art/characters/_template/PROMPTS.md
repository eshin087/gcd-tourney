# {{NAME}}: ChatGPT prompts

> TEMPLATE. Every block below is a complete, copy-paste prompt for the ChatGPT image generator.
> When creating a character, Codex replaces `{{NAME}}`, `{{TRAITS}}`, `{{PALETTE}}` and every
> `{{...}}` with the text from `CHARACTER.md`, and adds the "{{NAME}} specifics" from
> `ANIMATIONS.md` to each pose line, so the user never has to assemble anything.

## How to use

1. Work in the order of `step` (see [PIPELINE.md](../../PIPELINE.md#generation-order)).
2. In ChatGPT, **attach first**: `reference/model_sheet.png` (from step 2 on) and, once idle is
   approved, `reference/idle_approved.png` (or the latest approved strip of the same move
   family). Then paste the block.
3. Save the result exactly as the block's **Save as** path.
4. One chat per character; start a fresh chat (re-attach the references) when it drifts or after
   about 6 strips. Every block restates the palette and rules, so it works in a fresh chat.
5. Wrong pose count, off-model, or drifting colors: use the [fix-up prompts](#fix-up-prompts).
   Refusal: use the [fallback wording](#fallback-wording).

## Shared pieces (fill once, reused everywhere)

**TRAITS** (from `CHARACTER.md`, "One-paragraph look"):

```text
{{TRAITS: e.g. "a teenage ninja boy with spiky golden-yellow hair, big blue eyes, three thin whisker marks on each cheek, a dark-blue cloth forehead protector with a polished metal plate, an orange tracksuit jacket with black shoulders and a white collar, orange pants, blue ninja sandals"}}
```

**PALETTE** (from `CHARACTER.md`, "Palette"; keep the hexes):

```text
{{PALETTE: e.g. "skin #f8c69b/#d98a66/#ffe2c6, hair #ffc935/#e0861c/#ffe36a/#fff6c2, jacket #f88320/#c44d14/#ffac48, black #2b2c42/#17182a/#474a72, outline #1d1420"}}
```

**NAME LINE** (optional; delete it if ChatGPT refuses, see fallback):

```text
Character: {{full name}} from {{series}} ({{outfit/version}}), drawn as fan art.
```

## Step 1: model sheet and turnaround

One image holds the turnaround, the fighting stance and the palette. Iterate until the user
approves it; it is attached to every later prompt.

Save as: `reference/model_sheet.png` · attach: nothing (don't upload official screenshots; the
TRAITS text carries the design).

```text
Hi-res pixel art character model sheet, anime fan-art 2D fighting game sprite reference, wide landscape image.
{{NAME LINE}}
The character: {{TRAITS}}.
Top row, all the same size, standing upright and relaxed: front view, 3/4 view facing right, side view facing right, back view (a turnaround). Bottom row: the same character in a fighting stance, body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), knees bent, fists up, lead fist in front; next to it a row of flat color swatches of the palette.
About 4 to 4.5 heads tall, anime-accurate face and proportions, faithful to the original character design. Every figure the same size.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering. Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF. No ground shadow, no text, no labels.
```

## Step 2: expression sheet

Save as: `reference/expressions.png` · attach: `reference/model_sheet.png`.

```text
Hi-res pixel art expression sheet of the attached character, anime fan-art sprite reference: 7 head-and-shoulders portraits in one horizontal row, all in 3/4 view facing right with both eyes visible: (1) determined neutral, (2) angry focused, (3) shouting with mouth wide open, (4) {{grin / smirk}}, (5) pain with eyes squeezed shut, (6) eyes closed knocked out, (7) {{special state, e.g. "red eyes with three black tomoe" / "dizzy swirl eyes"}}.
Match the attached model sheet exactly: same face, hair, colors and pixel density. The character: {{TRAITS}}.
Crisp hard pixel art, 1-pixel dark outline, 3-4 tone cel shading, no anti-aliasing, no blur, no gradients. Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF. No text, no labels.
```

## Animation strips

Each block: attach `reference/model_sheet.png` + `reference/idle_approved.png` (for idle itself:
the model sheet + expressions). When idle is approved, Codex copies `raw/idle.png` to
`reference/idle_approved.png`. Strips wider than
4-5 poses may come out cramped: generate poses 1-4 and 5-N separately (save as
`raw/_parts/<anim>_A.png` / `_B.png`) and let Codex stitch them.

### Step 3: idle

#### idle

Save as: `raw/idle.png` · 8 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 8 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "idle": fighting stance, fists up, breathing bob (loop). The last pose must flow back into the first (looping animation).
Pose 1: neutral fighting stance: knees bent, lead (far) fist up in front at chin height, rear (near) fist guarding the chin, weight centered between the feet{{; NAME specifics}}.
Pose 2: inhale: chest rises a tiny bit, shoulders lift slightly{{; NAME specifics}}.
Pose 3: top of breath: shoulders up slightly, hair/cloth tips lift{{; NAME specifics}}.
Pose 4: exhale begins: body a tiny bit down{{; NAME specifics}}.
Pose 5: bottom of breath: knees bend slightly more, shoulders drop{{; NAME specifics}}.
Pose 6: hold bottom: hair/cloth settle one frame late (secondary motion){{; NAME specifics}}.
Pose 7: rising slightly{{; NAME specifics}}.
Pose 8: almost back to pose 1 (must loop seamlessly into pose 1); feet never move{{; NAME specifics}}.
```

### Step 4: run

#### run

Save as: `raw/run.png` · 8 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 8 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "run": run cycle; ninja run with the torso leaned forward and arms trailing straight back (loop). The last pose must flow back into the first (looping animation).
Pose 1: CONTACT: near leg forward, heel touching, far leg back; torso leaned forward ~35-40 degrees; both arms trailing straight back{{; NAME specifics}}.
Pose 2: DOWN: weight on the near leg, knee bent, body at its lowest{{; NAME specifics}}.
Pose 3: PASSING: far leg swings forward under the body, near leg straightening{{; NAME specifics}}.
Pose 4: UP: push off the near toes, body at its highest, both feet nearly off the ground; hair/cloth stream back{{; NAME specifics}}.
Pose 5: CONTACT (like pose 1 with the legs swapped): far leg forward, near leg back{{; NAME specifics}}.
Pose 6: DOWN (like pose 2 with the legs swapped){{; NAME specifics}}.
Pose 7: PASSING (like pose 3 with the legs swapped){{; NAME specifics}}.
Pose 8: UP (like pose 4 with the legs swapped); flows back into pose 1{{; NAME specifics}}.
```

### Step 5: core attacks

#### light1

Save as: `raw/light1.png` · 7 poses · phases 2/2/3 · core · strike: lead (far) fist, fist tip x 150-162, y 70-84

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 7 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light1": jab: wind-up, lead fist fully extended (2 frames), recover.
On the STRIKE poses the lead (far) fist is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): anticipation: shoulders turn back slightly, lead fist pulls back slightly toward the chin, small step forward begins{{; NAME specifics}}.
Pose 2 (startup): lead foot slides forward, hips start turning, lead fist halfway out (a short SOLID smear shape behind the fist is allowed){{; NAME specifics}}.
Pose 3 (STRIKE / active): lead (far) arm fully extended HORIZONTALLY toward the right at face height; fist is the right-most point; shoulder rolled in, chin tucked{{; NAME specifics}}.
Pose 4 (STRIKE / active): hold the extension (tiny recoil, sleeve/hair follow-through){{; NAME specifics}}.
Pose 5 (recovery): fist retracting halfway{{; NAME specifics}}.
Pose 6 (recovery): back toward guard, weight returning{{; NAME specifics}}.
Pose 7 (recovery): fighting stance (close to the idle stance so the chain blends){{; NAME specifics}}.
```

#### light2

Save as: `raw/light2.png` · 7 poses · phases 2/2/3 · core · strike: rear (near) fist, fist tip x 158-172, y 76-92

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 7 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light2": straight punch with the rear arm: wind-up, extended (2 frames), recover.
On the STRIKE poses the rear (near) fist is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): weight shifts onto the rear (near) foot, rear fist cocked at the cheek, lead arm starting to pull back{{; NAME specifics}}.
Pose 2 (startup): hips and shoulders rotate toward the right, rear heel lifts, rear fist launches (solid smear allowed){{; NAME specifics}}.
Pose 3 (STRIKE / active): rear (near) arm fully extended HORIZONTALLY at face/upper-chest height, crossing IN FRONT of the torso; lead fist pulled back to the chin{{; NAME specifics}}.
Pose 4 (STRIKE / active): hold (rear shoulder fully forward, follow-through in hair/cloth){{; NAME specifics}}.
Pose 5 (recovery): arm retracting{{; NAME specifics}}.
Pose 6 (recovery): torso unwinding{{; NAME specifics}}.
Pose 7 (recovery): fighting stance{{; NAME specifics}}.
```

#### light3

Save as: `raw/light3.png` · 7 poses · phases 2/2/3 · core · strike: near foot (sole/heel), sole x 166-184, y 110-128

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 7 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "light3": front kick at stomach height: knee chambered, leg extended (2 frames), recover.
On the STRIKE poses the near foot (sole/heel) is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): weight onto the lead foot, arms up for balance{{; NAME specifics}}.
Pose 2 (startup): rear (near) knee chambered high in front of the body, foot cocked{{; NAME specifics}}.
Pose 3 (STRIKE / active): near leg snapped straight HORIZONTALLY toward the right at stomach height, sole/heel forward; torso leans back a little to counterbalance{{; NAME specifics}}.
Pose 4 (STRIKE / active): hold the extension{{; NAME specifics}}.
Pose 5 (recovery): knee re-chambers{{; NAME specifics}}.
Pose 6 (recovery): foot comes down a step forward{{; NAME specifics}}.
Pose 7 (recovery): fighting stance{{; NAME specifics}}.
```

#### light4

Save as: `raw/light4.png` · 8 poses · phases 3/2/3 · core · strike: kicking foot, foot x 170-186, y 64-88

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 8 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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
Pose 6 (recovery): leg sweeping down{{; NAME specifics}}.
Pose 7 (recovery): foot lands, body still turned{{; NAME specifics}}.
Pose 8 (recovery): back to fighting stance{{; NAME specifics}}.
```

#### heavy

Save as: `raw/heavy.png` · 8 poses · phases 3/2/3 · core · strike: rear (near) fist, F03 fist x 132-150, y 66-86; F04 fist overhead x 118-136, y 36-52

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 8 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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
Pose 6 (recovery): peak of the hop, arm still up{{; NAME specifics}}.
Pose 7 (recovery): descending, arm lowering{{; NAME specifics}}.
Pose 8 (recovery): land in fighting stance{{; NAME specifics}}.
```

#### airLight1

Save as: `raw/airLight1.png` · 5 poses · phases 1/2/2 · core · strike: lead fist, fist x 150-166, chest height of the attacker

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/airHeavy.png` · 6 poses · phases 2/2/2 · core · strike: both clasped fists, fists x 140-166, y 120-150 (below the attacker's chest, in front)

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 6 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airHeavy": double-fist hammer: both fists raised overhead, then smashed down-forward.
On the STRIKE poses both clasped fists are fully extended DOWN and forward and are the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): both hands clasped and raised overhead, back arched{{; NAME specifics}}.
Pose 2 (startup): highest wind-up: clasped fists behind the head, knees tucked{{; NAME specifics}}.
Pose 3 (STRIKE / active): SMASH: clasped fists swung down-forward in front of the body, below chest height{{; NAME specifics}}.
Pose 4 (STRIKE / active): follow-through, fists at their lowest{{; NAME specifics}}.
Pose 5 (recovery): recover, arms rising{{; NAME specifics}}.
Pose 6 (recovery): neutral air pose{{; NAME specifics}}.
```

### Step 6: reactions

#### guard

Save as: `raw/guard.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "guard": blocking, forearms crossed in front of the face (loop). The last pose must flow back into the first (looping animation).
Pose 1: forearms crossed in front of the face, knees bent, chin tucked, eyes visible over the arms{{; NAME specifics}}.
Pose 2: tiny breathing variation{{; NAME specifics}}.
```

#### hurtHigh

Save as: `raw/hurtHigh.png` · 3 poses · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "hurtHigh": hit in the face: head snapped back, arms flung back.
Pose 1: impact: head snapped back, chin up, eyes squeezed/shocked, arms flung back{{; NAME specifics}}.
Pose 2: deepest recoil, torso arched back{{; NAME specifics}}.
Pose 3: recovering, head coming forward{{; NAME specifics}}.
```

#### launched

Save as: `raw/launched.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "launched": knocked flying backwards, body arched back, limbs flailing (loop). The last pose must flow back into the first (looping animation).
Pose 1: flying backwards: body arched back, head trailing toward the left, limbs flailing forward{{; NAME specifics}}.
Pose 2: limb/hair variation{{; NAME specifics}}.
```

#### down

Save as: `raw/down.png` · 2 poses · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "down": hitting the ground, then lying flat on the back.
Pose 1: back slams the ground: arms and legs bounce up{{; NAME specifics}}.
Pose 2: lying flat on the back, head toward the left, limbs relaxed{{; NAME specifics}}.
```

#### getup

Save as: `raw/getup.png` · 5 poses · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/charge.png` · 4 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/beamCharge.png` · 3 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "beamCharge": charging a beam: both hands cupped together at the rear hip, shouting (loop). The last pose must flow back into the first (looping animation).
Pose 1: both hands cupped together at the rear hip (the left side of the body), knees bent, shouting{{; NAME specifics}}.
Pose 2: tiny shake variation{{; NAME specifics}}.
Pose 3: hair/cloth flicker variation{{; NAME specifics}}.
```

#### beamFire

Save as: `raw/beamFire.png` · 3 poses · loop · core · strike: both palms (beam origin), palms x 158-170, y 94-108

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/special.png` · 8 poses · phases 3/3/2 · core · strike: technique hand, thrust hand x 148-166, y 100-120

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 8 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "special": signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover.
On the THRUST pose the technique hand is fully extended horizontally and is the right-most point; on the run poses hold it as {{forward / trailing}} per MOVES_AND_VFX.md.
Pose 1 (startup): plant wide, hands start forming the technique (character-specific hand position){{; NAME specifics}}.
Pose 2 (startup): technique growing, shouting{{; NAME specifics}}.
Pose 3 (startup): technique fully formed, last frame before the rush{{; NAME specifics}}.
Pose 4 (STRIKE / active): RUN holding it (run contact pose), technique hand forward or trailing per character{{; NAME specifics}}.
Pose 5 (STRIKE / active): RUN passing pose, still holding{{; NAME specifics}}.
Pose 6 (STRIKE / active): THRUST: technique arm fully extended HORIZONTALLY toward the right at chest height (the hit frame){{; NAME specifics}}.
Pose 7 (recovery): follow-through{{; NAME specifics}}.
Pose 8 (recovery): recover to stance{{; NAME specifics}}.
```

### Step 8: rest (core)

#### dash

Save as: `raw/dash.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "dash": low fast forward dash, body leaning far forward, arms back (loop). The last pose must flow back into the first (looping animation).
Pose 1: low forward burst: torso almost horizontal, rear leg extended pushing off, lead knee bent forward, arms trailing back, hair streaming back{{; NAME specifics}}.
Pose 2: same pose, legs slightly alternated and cloth/hair flap changed (2-frame shimmer loop){{; NAME specifics}}.
```

#### jumpUp

Save as: `raw/jumpUp.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "jumpUp": rising in the air, knees tucked, one arm up (loop). The last pose must flow back into the first (looping animation).
Pose 1: rising: knees tucked up, one arm raised up-forward, other arm back, hair/cloth trailing downward{{; NAME specifics}}.
Pose 2: same pose with a cloth/hair flap variation{{; NAME specifics}}.
```

#### jumpFall

Save as: `raw/jumpFall.png` · 2 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "jumpFall": falling, legs extending down, arms out for balance (loop). The last pose must flow back into the first (looping animation).
Pose 1: falling: legs extending downward, arms spread out for balance, hair/cloth lifting up{{; NAME specifics}}.
Pose 2: same pose with a cloth/hair flap variation{{; NAME specifics}}.
```

#### land

Save as: `raw/land.png` · 2 poses · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "land": landing crouch, then rising.
Pose 1: impact crouch: knees deeply bent, arms down/out for balance, hair still lifted{{; NAME specifics}}.
Pose 2: rising halfway back toward the fighting stance, hair settling{{; NAME specifics}}.
```

#### win

Save as: `raw/win.png` · 4 poses · loop · core

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/backDash.png` · 3 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "backDash": quick hop backwards.
Pose 1: push off the lead foot, torso leaning back, guard up{{; NAME specifics}}.
Pose 2: airborne hop backward: knees tucked, body upright and tilted back, guard up{{; NAME specifics}}.
Pose 3: landing on the toes, knees bent, guard up (ready to blend into idle){{; NAME specifics}}.
```

#### superDash

Save as: `raw/superDash.png` · 2 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "superDash": flying horizontally like a missile, one fist thrust forward, legs trailing (loop). The last pose must flow back into the first (looping animation).
Pose 1: horizontal flight toward the right: body stretched flat, lead fist thrust forward at head level (forward-most point), other arm back along the body, legs together trailing{{; NAME specifics}}.
Pose 2: same pose, hair/cloth flap and a small limb variation{{; NAME specifics}}.
```

#### jumpSquat

Save as: `raw/jumpSquat.png` · 1 pose · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 1 pose of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "jumpSquat": crouch right before jumping.
Pose 1: compressed crouch: knees deeply bent, torso leaned forward, arms swung back, about to spring{{; NAME specifics}}.
```

#### airLight2

Save as: `raw/airLight2.png` · 5 poses · phases 1/2/2 · optional · strike: near foot, foot x 164-184, hip height of the attacker

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 5 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/airLight3.png` · 6 poses · phases 2/2/2 · optional · strike: kicking heel, heel x 166-186, chest/hip height

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 6 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airLight3": mid-air spinning kick that knocks away.
On the STRIKE poses the kicking heel is fully extended HORIZONTALLY toward the right edge and is the right-most point of the pose, clearly separated from the body.
Pose 1 (startup): turn away in the air, knees tucked{{; NAME specifics}}.
Pose 2 (startup): spin: back partly toward the camera{{; NAME specifics}}.
Pose 3 (STRIKE / active): spin kick: leg extended HORIZONTALLY, heel forward, body tilted{{; NAME specifics}}.
Pose 4 (STRIKE / active): follow-through{{; NAME specifics}}.
Pose 5 (recovery): tuck{{; NAME specifics}}.
Pose 6 (recovery): neutral air pose{{; NAME specifics}}.
```

#### block

Save as: `raw/block.png` · 2 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "block": blocking while being pushed back, eyes shut.
Pose 1: impact: pushed back, torso leaning back, eyes shut, arms still crossed, rear foot sliding{{; NAME specifics}}.
Pose 2: recovering into guard{{; NAME specifics}}.
```

#### hurtLow

Save as: `raw/hurtLow.png` · 3 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "hurtLow": hit in the stomach: doubled over.
Pose 1: impact to the stomach: doubled over, mouth open, hands toward the stomach{{; NAME specifics}}.
Pose 2: deepest fold{{; NAME specifics}}.
Pose 3: recovering upright{{; NAME specifics}}.
```

#### spin

Save as: `raw/spin.png` · 4 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/airRecover.png` · 3 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 3 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "airRecover": backflip recovery in mid-air.
Pose 1: tucked backflip start{{; NAME specifics}}.
Pose 2: upside-down tuck{{; NAME specifics}}.
Pose 3: upright, arms out, legs ready to land{{; NAME specifics}}.
```

#### throw

Save as: `raw/throw.png` · 4 poses · phases 1/1/2 · optional · strike: throwing hand (release point), hand x 140-160, y 92-110

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/vanish.png` · 2 poses · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "vanish": crouch and blur before teleporting.
Pose 1: quick crouch (squash){{; NAME specifics}}.
Pose 2: stretched tall upward, toes pointed (stretch; tallest frame){{; NAME specifics}}.
```

#### stagger

Save as: `raw/stagger.png` · 4 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/ko.png` · 1 pose · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 1 pose of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "ko": knocked out, lying flat on the back.
Pose 1: lying flat on the back, limbs loose, eyes closed, head toward the left{{; NAME specifics}}.
```

#### intro

Save as: `raw/intro.png` · 4 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 4 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
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

Save as: `raw/taunt.png` · 2 poses · loop · optional

```text
Hi-res pixel art sprite strip, anime fan-art 2D fighting game sprite. 2 poses of the SAME character in ONE horizontal row, left to right, evenly spaced, poses not touching. Wide landscape image.
Body facing RIGHT in 3/4 view (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), camera slightly above. Every pose at the same scale; feet on one shared baseline (airborne poses just float). About 4 to 4.5 heads tall, anime-accurate proportions. "Near" arm/leg = the one closer to the viewer, drawn in front of the body; "far" = the one partly behind the body; in the fighting stance the lead (far) side is forward.
Crisp hard pixel art: 1-pixel dark outline, 3-4 tone cel shading per color, light from the upper front right, no anti-aliasing, no blur, no gradients, no dithering, no motion blur (fast motion drawn as solid smear shapes). Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF everywhere. No ground shadow, no floor, no text, no labels, no numbers, no borders, no effects (no aura, no energy, no speed lines).
{{NAME LINE}}
The character: {{TRAITS}}. Match the attached reference images exactly.
Animation "taunt": confident taunt / pointing at the opponent (loop). The last pose must flow back into the first (looping animation).
Pose 1: signature taunt pose{{; NAME specifics}}.
Pose 2: small variation (cloth/hair){{; NAME specifics}}.
```

## Step 11: UI

Save each image straight into `ui/<name>.png`: the packer removes the magenta background and fits
it to the exact size (nearest-neighbor / mode, never smooth; SPEC.md "Per-character UI images").
Optionally keep the untouched original as `raw/ui_<name>.png` (the packer skips it).

#### portrait (96x96)

Save as: `ui/portrait.png` (packed to 96x96, transparent).

```text
Hi-res pixel art character portrait, anime fan-art fighting game HUD icon, square image. Head and shoulders of the attached character, 3/4 view facing RIGHT, both eyes visible, {{expression}} expression. Match the attached model sheet exactly. The character: {{TRAITS}}.
Crisp hard pixel art, 1-pixel dark outline, 3-4 tone cel shading, light from the upper front right, no anti-aliasing, no blur, no gradients. Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF. No text, no frame.
```

#### cutin (480x128)

Save as: `ui/cutin.png` (packed to 480x128, opaque).

```text
Hi-res pixel art super-move cut-in strip, like the super flashes of 2D anime fighting games: a very wide horizontal banner (ratio 15:4) filled edge to edge by a tight close-up of the attached character's eyes and eyebrows, both eyes visible, intense {{expression / special eye state}} expression, dramatic lighting from the right. The face fills the strip; a flat {{background band color: character color or dark navy}} may show only around the eyes and brows. No speed lines (the game adds them). Match the attached model sheet exactly. The character: {{TRAITS}}.
Crisp hard pixel art, dark outlines, 3-4 tone cel shading, no anti-aliasing, no blur, no gradients. Use only these colors: {{PALETTE}}.
No text, no frame, no logo.
```

#### select (384x384)

Save as: `ui/select.png` (packed to 384x384, transparent).

```text
Hi-res pixel art full-body character select art, anime fan-art fighting game, square image. The attached character in a confident signature pose ({{pose}}), 3/4 view facing RIGHT, filling most of the height. Match the attached model sheet exactly. The character: {{TRAITS}}.
Crisp hard pixel art, 1-pixel dark outline, 3-4 tone cel shading, light from the upper front right, no anti-aliasing, no blur, no gradients. Use only these colors: {{PALETTE}}.
Background: flat solid magenta #FF00FF. No ground shadow, no text.
```

## Fix-up prompts

Use in the same chat, right after a result (attach the strip if it's a new chat).

Redraw one pose (save it, then patch it into the raw strip, see PIPELINE "Fixing frames"):

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

Color drift:

```text
Same image, but use exactly these colors and no others: {{PALETTE}}. Keep the poses identical.
```

## Fallback wording

If ChatGPT refuses or keeps changing the design:

1. Delete the `{{NAME LINE}}` line (no character or series names anywhere).
2. Replace the first line with: "Hi-res pixel art sprite strip of an original character inspired by
   classic shonen ninja anime, fan-art sprite for a personal non-commercial game project."
3. Keep TRAITS, PALETTE and the pose lines unchanged: the description carries the design.
4. Never add "in the style of <artist>". If it still refuses, note it in TRACKER and ask Codex or
   Claude to rephrase the traits.
