# Monk B (young judge): image prompts (generation order)

> Paste-ready prompts for Codex's built-in image generator (or ChatGPT by hand). Each block is
> self-contained. Poses: [ANIMATIONS.md](ANIMATIONS.md). Look and palette: [CHARACTER.md](CHARACTER.md).
> File flow, naming, quick check: [art/npc/README.md](../README.md). ADR 0008 wins over this file.

## How to use

1. **Claim the batch** `npc-monk-b` (`npm run queue -- claim --type npc --agent <name>`). Work only on
   this NPC's files.
2. **One image thread for the whole batch**, so the generator keeps the design in context.
3. **S1 first** (model sheet), unless an approved `reference/model_sheet.png` already exists: then skip
   S1 and attach that file instead.
4. **Attach to every strip prompt:** the model sheet (the approved `reference/model_sheet.png`, or this
   batch's latest `reference/model_sheet_vNN.png` while none is approved). For A2 also attach the idle
   strip (`reference/idle_approved.png`, or this batch's `raw/idle_vNN.png`).
5. **Save to the exact path `claim` printed** (the index shows the pattern). If unsure about the
   number, run `npm run queue -- next-file art/npc/monk-b/raw/<anim>` (model sheet:
   `art/npc/monk-b/reference/model_sheet`). Never overwrite.
6. **Quick check** before saving ([README](../README.md#quick-check-before-saving)). When one frame is
   off, regenerate the whole 2-frame strip and add one line at the end of the prompt naming the problem,
   for example `FIX: in frame 2 the staff is shorter than in frame 1; keep the same staff length.`
7. He is an original character: no names to drop. If the generator drifts (hair appears, the robe turns
   orange like a stock Shaolin monk, the staff bends or gets metal tips), restate the drifting trait at
   the top of the prompt.
8. **Hand back** with `npm run queue -- done npc-monk-b --agent <name>` and one QA line per saved file.
   The lead queues the files in `art/REVIEW.md`; workers never edit shared files.

## Index

| id | asset | frames | attach | save as |
|---|---|---|---|---|
| S1 | model sheet (front, in-game 3/4, side, back + 21 swatches) | 4 figures | nothing | `reference/model_sheet_vNN.png` |
| A1 | `idle`: rigid watch with the staff planted (loop) | 2 | model sheet | `raw/idle_vNN.png` |
| A2 | `signal`: staff raised overhead, then thrust at the ring (one-shot) | 2 | model sheet + idle | `raw/signal_vNN.png` |

All paths are relative to `art/npc/monk-b/`.

---

## S1 · Model sheet

Attach: nothing (optionally monk-a's approved model sheet, for matching style and relative scale).
Save as: `reference/model_sheet_vNN.png`.

```text
Character model sheet for a hi-res pixel-art side character in a 2D anime arena fighting game (an original anime-style design).
CHARACTER: a young tournament judge monk: a tall, lean young man of about twenty with a cleanly shaved head, thick straight black eyebrows, sharp serious eyes and a strong jaw, wearing a slate-grey cross-collared martial robe that falls to the knees over loose grey trousers, a crimson collar band and a crimson sash tied at the waist with two short hanging ends, white cloth leg wraps from ankle to knee and black cloth shoes. He holds a long, plain, straight dark-wood staff, a little shorter than he is, with a crimson ribbon tied just below its top end.

Draw the same character 4 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear magenta gaps between them:
1. front view, upright stand, the staff planted vertically beside his right foot and gripped in his right hand at chest height, left fist resting on the sash at his hip;
2. THE IN-GAME VIEW (the most important figure): 3/4 view facing the viewer with the body turned about 30 degrees toward the RIGHT edge of the image and the head turned a little more to the right; the same pose: staff planted beside his right foot on the left side of the image, gripped in his right hand, left fist on the sash at his hip on the right side of the image; stern face, eyes on something off to the right;
3. side view facing RIGHT (full profile), staff planted in front of him, showing how straight he stands;
4. back view: the shaved head, the robe's back, the sash knot and its hanging ends, the staff beside him.
Below the figures, one row of 21 small square color swatches (no text), one per palette color, in the palette order listed below.

PROPORTIONS: tall, lean young man, about 7 heads tall, upright and rigid, natural anime proportions; not chibi, not super-deformed, not bulky, no big head, no oversized hands or feet. The staff is about as tall as his eyes.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing upright he is about 108 art pixels tall (about 430 px on the canvas).
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd). The shaved scalp is skin with a faint grey stubble tone, no hair shapes.
PALETTE (use only these colors): outline #1d1420; skin #ffdcbc #ecba90 #c68a64 #966048; scalp stubble #a89aa8; eyebrows and irises #2b2232; slate-grey robe, trousers and shoes #9aa4b8 #6a7488 #465066 #2c3344; crimson collar, sash and ribbon #ec5a62 #c8323c #861c28; white leg wraps #ffffff #e4e0ea #b0aac0; staff wood #cc965c #9c683a #6a4426; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no labels, no frame borders or grid lines, no extra characters.
```

Check before saving: shaved head (no hair), slate-grey robe (not orange), crimson collar + sash, white
leg wraps, one straight wooden staff with a crimson ribbon in his right hand (image-left in figure 2),
tall and lean (about 7 heads), 4 figures on one baseline.

---

## A1 · `idle`: rigid watch with the staff planted (loop)

Attach: model sheet. Save as: `raw/idle_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (an original anime-style design).
CHARACTER: a young tournament judge monk: a tall, lean young man of about twenty with a cleanly shaved head, thick straight black eyebrows, sharp serious eyes and a strong jaw, wearing a slate-grey cross-collared martial robe that falls to the knees over loose grey trousers, a crimson collar band and a crimson sash tied at the waist with two short hanging ends, white cloth leg wraps from ankle to knee and black cloth shoes. He holds a long, plain, straight dark-wood staff, a little shorter than he is, with a crimson ribbon tied just below its top end.
Match the attached model sheet exactly: same face, shaved head, robe, sash, leg wraps, staff, colors, proportions and scale. This idle strip becomes the reference for his other animation, so make it as clean and on-model as possible.

ANIMATION: "idle", the young judge keeping watch at the ring corner. 2 frames, left to right, looping slowly (frame 2 flows back into frame 1).
1. Upright, rigid stand, feet at shoulder width. His right hand grips the staff at chest height; the staff stands planted on the ground beside his right foot, perfectly vertical, its top at about his eye level, the crimson ribbon hanging just below the top. His left fist rests on the sash at his left hip. Face: stern, eyes narrowed and fixed on the ring off to the right, mouth a firm line.
2. A breath: chest 1 pixel higher. The ribbon tails and the sash ends stir slightly toward the right in a breeze. Feet, staff base and grip unchanged. Face: same.

PROPORTIONS: tall, lean young man, about 7 heads tall, upright and rigid, natural anime proportions; not chibi, not super-deformed, not bulky, no big head, no oversized hands or feet. The staff is about as tall as his eyes.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them. The two poses are the two frames of one looping animation: everything not described as changing stays identical.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing upright he is about 108 art pixels tall (about 430 px on the canvas).
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image as if watching a fight happening off to the right, head turned a little more toward the right, camera slightly above (about 10 degrees). Both eyes visible. Because he faces the viewer, his right hand (the staff hand) is on the LEFT side of the image and his left hand is on the RIGHT side, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd). The shaved scalp is skin with a faint grey stubble tone, no hair shapes.
PALETTE (use only these colors): outline #1d1420; skin #ffdcbc #ecba90 #c68a64 #966048; scalp stubble #a89aa8; eyebrows and irises #2b2232; slate-grey robe, trousers and shoes #9aa4b8 #6a7488 #465066 #2c3344; crimson collar, sash and ribbon #ec5a62 #c8323c #861c28; white leg wraps #ffffff #e4e0ea #b0aac0; staff wood #cc965c #9c683a #6a4426; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no labels, no speech bubbles, no motion lines, no frame borders or grid lines, no effects, no extra characters.
```

## A2 · `signal`: staff raised overhead, then thrust at the ring (one-shot)

Attach: model sheet + idle strip. Save as: `raw/signal_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#signal).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (an original anime-style design).
CHARACTER: a young tournament judge monk: a tall, lean young man of about twenty with a cleanly shaved head, thick straight black eyebrows, sharp serious eyes and a strong jaw, wearing a slate-grey cross-collared martial robe that falls to the knees over loose grey trousers, a crimson collar band and a crimson sash tied at the waist with two short hanging ends, white cloth leg wraps from ankle to knee and black cloth shoes. He holds a long, plain, straight dark-wood staff, a little shorter than he is, with a crimson ribbon tied just below its top end.
Match the attached model sheet and idle strip exactly: same face, shaved head, robe, sash, leg wraps, staff length, colors, proportions and character scale in both poses.

ANIMATION: "signal", the judge's official call (match start, ring-out, decision). 2 frames, left to right: a wind-up and the call.
1. Wind-up: both hands raise the staff horizontally just above his head, elbows bent out to the sides, hands about shoulder-width apart (NOT at a straight-up arm's length); the staff is centered over him with the ribbon end toward the right. Chest out, chin up. Face: alert, eyes wide, brows down, jaw set.
2. The call: he swings the staff down to point forward toward the RIGHT like a spear, gripping it with both hands: his left hand forward on the right side of the image, his right hand back near his right hip on the left side of the image. The staff angles about 20 degrees below horizontal and its ribbon end points at the ring off to the right at about waist height. His torso leans forward about 12 degrees; the robe hem and sash ends swing back. Face: a sharp shout, mouth wide open, brows hard down.
Feet stay planted in the same place in both frames. The staff keeps exactly the same length and stays perfectly straight.

PROPORTIONS: tall, lean young man, about 7 heads tall, upright and rigid, natural anime proportions; not chibi, not super-deformed, not bulky, no big head, no oversized hands or feet.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them; the horizontal staff in frame 1 must not reach into the other half.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing upright he is about 108 art pixels tall (about 430 px on the canvas); with the staff raised in frame 1 the figure is about 112 art pixels tall.
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image as if watching a fight happening off to the right, head turned a little more toward the right, camera slightly above (about 10 degrees). Both eyes visible. Because he faces the viewer, his right hand is on the LEFT side of the image and his left hand is on the RIGHT side, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd). The shaved scalp is skin with a faint grey stubble tone, no hair shapes.
PALETTE (use only these colors): outline #1d1420; skin #ffdcbc #ecba90 #c68a64 #966048; scalp stubble #a89aa8; eyebrows and irises #2b2232; slate-grey robe, trousers and shoes #9aa4b8 #6a7488 #465066 #2c3344; crimson collar, sash and ribbon #ec5a62 #c8323c #861c28; white leg wraps #ffffff #e4e0ea #b0aac0; staff wood #cc965c #9c683a #6a4426; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no labels, no speech bubbles, no sound-effect lettering, no motion lines or swoosh arcs, no frame borders or grid lines, no effects, no extra characters.
```
