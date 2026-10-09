# Announcer: image prompts (generation order)

> Paste-ready prompts for Codex's built-in image generator (or ChatGPT by hand). Each block is
> self-contained. Poses: [ANIMATIONS.md](ANIMATIONS.md). Look and palette: [CHARACTER.md](CHARACTER.md).
> File flow, naming, quick check: [art/npc/README.md](../README.md). ADR 0008 wins over this file.

## How to use

1. **Claim the batch** `npc-announcer` (`npm run queue -- claim --type npc --agent <name>`). Work only
   on this NPC's files.
2. **One image thread for the whole batch**, so the generator keeps the design in context.
3. **S1 first** (model sheet), unless an approved `reference/model_sheet.png` already exists: then skip
   S1 and attach that file instead.
4. **Attach to every strip prompt:** the model sheet (the approved `reference/model_sheet.png`, or this
   batch's latest `reference/model_sheet_vNN.png` while none is approved). From A2 on, also attach the
   idle strip (`reference/idle_approved.png`, or this batch's `raw/idle_vNN.png`).
5. **Save to the exact path `claim` printed** (the index shows the pattern). If unsure about the
   number, run `npm run queue -- next-file art/npc/announcer/raw/<anim>` (model sheet:
   `art/npc/announcer/reference/model_sheet`). Never overwrite.
6. **Quick check** before saving ([README](../README.md#quick-check-before-saving)). A strip has only
   2 frames, so when one frame is off, regenerate the whole strip and add one line at the end of the
   prompt naming the problem, for example `FIX: in frame 2 the microphone moved to the other hand; keep it
   in his right hand (left side of the image).`
7. **If the generator refuses** or draws someone else: replace the `CHARACTER:` line with the fallback
   below and delete every mention of "Dragon Ball" and "World Martial Arts Tournament". Never name an
   artist or a studio.
8. **Hand back** with `npm run queue -- done npc-announcer --agent <name>` and one QA line per saved file.
   The lead queues the files in `art/REVIEW.md`; workers never edit shared files.

### Fallback CHARACTER line (no names)

```text
CHARACTER: an original anime tournament announcer, fan-art sprite for a personal non-commercial game project: an adult male announcer with a voluminous mop of curly golden-blond hair, black sunglasses, a clean-shaven friendly face with a wide expressive mouth, a black two-button suit with matching trousers, a crisp white shirt, a deep-red necktie and black dress shoes, holding a classic handheld microphone with a round silver mesh head and a black handle in his right hand.
```

## Index

| id | asset | frames | attach | save as |
|---|---|---|---|---|
| S1 | model sheet (front, in-game 3/4, side, back + 26 swatches) | 4 figures | nothing | `reference/model_sheet_vNN.png` |
| A1 | `idle`: talking at ringside (loop) | 2 | model sheet | `raw/idle_vNN.png` |
| A2 | `point`: pointing at the ring while announcing (loop) | 2 | model sheet + idle | `raw/point_vNN.png` |
| A3 | `shout`: fist-pumping hype shout (loop) | 2 | model sheet + idle | `raw/shout_vNN.png` |
| A4 | `cower`: ducking for cover, trembling (loop) | 2 | model sheet + idle | `raw/cower_vNN.png` |

All paths are relative to `art/npc/announcer/`.

---

## S1 · Model sheet

Attach: nothing. Save as: `reference/model_sheet_vNN.png`.

```text
Character model sheet for a hi-res pixel-art side character in a 2D anime arena fighting game (anime fan-art).
CHARACTER: the World Martial Arts Tournament announcer from Dragon Ball / Dragon Ball Z, drawn as an anime fan-art sprite (an homage): an adult male tournament announcer with a voluminous mop of curly golden-blond hair, black sunglasses, a clean-shaven friendly face with a wide expressive mouth, a black two-button suit with matching trousers, a crisp white shirt, a deep-red necktie and black dress shoes, holding a classic handheld microphone with a round silver mesh head and a black handle in his right hand.

Draw the same character 4 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear magenta gaps between them:
1. front view, relaxed stand, microphone held at chest height in his right hand, left hand relaxed at his side;
2. THE IN-GAME VIEW (the most important figure): 3/4 view facing the viewer with the body turned about 30 degrees toward the RIGHT edge of the image and the head turned a little more to the right; microphone just in front of and below his chin in his right hand (on the left side of the image), left hand on his left hip with the elbow out to the right; friendly talking half-grin, mouth open;
3. side view facing RIGHT (full profile), microphone at chest height;
4. back view: the back of the curly blond hair and the suit jacket, the microphone just visible at his side.
Below the figures, one row of 26 small square color swatches (no text), one per palette color, in the palette order listed below.

PROPORTIONS: slim adult man of average height, about 6.5 heads tall, natural anime proportions; not chibi, not super-deformed, no big head, no oversized hands or feet. The curly hair adds about half a head on top. His eyes are always hidden behind the dark sunglasses.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing upright he is about 112 art pixels tall including the hair (about 450 px on the canvas).
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd).
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f6c69e #d9946e #a8644a; golden-blond hair #fff3b0 #ffdd5c #f2b630 #c47f1a #8a5212; sunglasses #15131d #3b3a52; black suit, trousers and shoes #4c4b60 #2f2e3e #23222f; white shirt #ffffff #e9e7f1 #b6b2c6; red necktie #e85454 #c0303e #7e1828; microphone head #eef1f6 #aab2c2 #6c7488; mouth #5a1a22; sweat drop #8fd3ff.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no labels, no speech bubbles, no frame borders or grid lines, no extra characters.
```

Check before saving: curly golden-blond mop (not spiky, not brown), dark sunglasses with both lenses
showing in figure 2, black suit + white shirt + red tie, mic in the right hand (image-left in figures 1
and 2), about 6.5 heads (not chibi), 4 figures on one baseline, flat magenta.

---

## A1 · `idle`: talking at ringside (loop)

Attach: model sheet. Save as: `raw/idle_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: the World Martial Arts Tournament announcer from Dragon Ball / Dragon Ball Z, drawn as an anime fan-art sprite (an homage): an adult male tournament announcer with a voluminous mop of curly golden-blond hair, black sunglasses, a clean-shaven friendly face with a wide expressive mouth, a black two-button suit with matching trousers, a crisp white shirt, a deep-red necktie and black dress shoes, holding a classic handheld microphone with a round silver mesh head and a black handle in his right hand.
Match the attached model sheet exactly: same face, hair curls, sunglasses, suit, colors, proportions and scale. This idle strip becomes the reference for his other animations, so make it as clean and on-model as possible.

ANIMATION: "idle", talking at ringside. 2 frames, left to right, looping (frame 2 flows back into frame 1).
1. Relaxed stand, feet about shoulder width, weight slightly on his right leg so the hips tilt a little. Body turned about 30 degrees toward the right. His right hand holds the microphone just in front of and below his chin. His left hand rests on his left hip with the elbow bent out to the right. Face: friendly talking half-grin, mouth open, brows raised.
2. Same stance and same feet, knees softened so the body is 1 pixel lower, torso leaning very slightly toward the right. His left hand leaves the hip and opens palm-up at waist height, gesturing toward the right. Microphone unchanged. Face: closed-mouth grin.

PROPORTIONS: slim adult man of average height, about 6.5 heads tall, natural anime proportions; not chibi, not super-deformed, no big head, no oversized hands or feet. His eyes are always hidden behind the dark sunglasses.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them. The two poses are the two frames of one looping animation: everything not described as changing stays identical.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing upright he is about 112 art pixels tall including the hair (about 450 px on the canvas).
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image as if watching a fight happening off to the right, head turned a little more toward the right, camera slightly above (about 10 degrees). Both lenses of his sunglasses are visible. Because he faces the viewer, his right hand (the microphone hand) is on the LEFT side of the image and his left hand is on the RIGHT side, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd).
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f6c69e #d9946e #a8644a; golden-blond hair #fff3b0 #ffdd5c #f2b630 #c47f1a #8a5212; sunglasses #15131d #3b3a52; black suit, trousers and shoes #4c4b60 #2f2e3e #23222f; white shirt #ffffff #e9e7f1 #b6b2c6; red necktie #e85454 #c0303e #7e1828; microphone head #eef1f6 #aab2c2 #6c7488; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no labels, no speech bubbles, no sound-effect lettering, no motion lines, no frame borders or grid lines, no energy effects, no extra characters.
```

## A2 · `point`: pointing at the ring while announcing (loop)

Attach: model sheet + idle strip. Save as: `raw/point_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#point).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: the World Martial Arts Tournament announcer from Dragon Ball / Dragon Ball Z, drawn as an anime fan-art sprite (an homage): an adult male tournament announcer with a voluminous mop of curly golden-blond hair, black sunglasses, a clean-shaven friendly face with a wide expressive mouth, a black two-button suit with matching trousers, a crisp white shirt, a deep-red necktie and black dress shoes, holding a classic handheld microphone with a round silver mesh head and a black handle in his right hand.
Match the attached model sheet and idle strip exactly: same face, hair curls, sunglasses, suit, colors, proportions and character scale in both poses.

ANIMATION: "point", announcing a fighter and pointing at the ring. 2 frames, left to right, looping (frame 2 flows back into frame 1).
1. His left arm is extended toward the RIGHT edge of the image at shoulder height, elbow straight, index finger pointing, the other fingers curled; the arm is slightly foreshortened by the 3/4 turn. Torso leans about 8 degrees toward the right, weight on the right-hand foot in the image. His right hand holds the microphone at his mouth. Feet planted as in the idle strip. Face: announcing, mouth wide open, brows raised.
2. Same pose with an emphatic jab: the pointing arm about 10 degrees higher and the finger reaching a little further right, the lean a little stronger, the hair curls bouncing slightly. Feet unchanged. Face: mouth at its widest, head pushed slightly forward.
The pointing hand stays well inside the image slot, and nothing reaches higher than the top of his hair.

PROPORTIONS: slim adult man of average height, about 6.5 heads tall, natural anime proportions; not chibi, not super-deformed, no big head, no oversized hands or feet. His eyes are always hidden behind the dark sunglasses.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them. The two poses are the two frames of one looping animation: everything not described as changing stays identical.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing upright he is about 112 art pixels tall including the hair (about 450 px on the canvas).
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image as if watching a fight happening off to the right, head turned a little more toward the right, camera slightly above (about 10 degrees). Both lenses of his sunglasses are visible. Because he faces the viewer, his right hand (the microphone hand) is on the LEFT side of the image and his left hand (the pointing hand) is on the RIGHT side, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd).
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f6c69e #d9946e #a8644a; golden-blond hair #fff3b0 #ffdd5c #f2b630 #c47f1a #8a5212; sunglasses #15131d #3b3a52; black suit, trousers and shoes #4c4b60 #2f2e3e #23222f; white shirt #ffffff #e9e7f1 #b6b2c6; red necktie #e85454 #c0303e #7e1828; microphone head #eef1f6 #aab2c2 #6c7488; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no labels, no speech bubbles, no sound-effect lettering, no motion lines, no frame borders or grid lines, no energy effects, no extra characters.
```

## A3 · `shout`: fist-pumping hype shout (loop)

Attach: model sheet + idle strip. Save as: `raw/shout_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#shout).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: the World Martial Arts Tournament announcer from Dragon Ball / Dragon Ball Z, drawn as an anime fan-art sprite (an homage): an adult male tournament announcer with a voluminous mop of curly golden-blond hair, black sunglasses, a clean-shaven friendly face with a wide expressive mouth, a black two-button suit with matching trousers, a crisp white shirt, a deep-red necktie and black dress shoes, holding a classic handheld microphone with a round silver mesh head and a black handle in his right hand.
Match the attached model sheet and idle strip exactly: same face, hair curls, sunglasses, suit, colors, proportions and character scale in both poses.

ANIMATION: "shout", a hyped-up shout into the microphone with a fist pump. 2 frames, left to right, looping fast (frame 2 flows back into frame 1).
1. Leaning back about 10 degrees, knees slightly bent. His left arm is thrown up and out toward the upper RIGHT at about 40 degrees above horizontal (diagonal, NOT straight up), fist clenched; the fist ends to the right of his head, about level with the top of his hair. His right hand presses the microphone to his mouth. The suit jacket flares open a little. Face: hype shout, mouth at its widest, head tilted back, a white glint on the sunglasses.
2. Leaning forward about 6 degrees, knees bent a little more so the body is 2 pixels lower. His left fist is pumped down to shoulder height, elbow bent and pulled in beside his ribs. The microphone stays pressed to his mouth. Hair curls bounce up slightly. Feet unchanged. Face: same shout, chin pushed forward.
Feet stay planted in the same place in both frames.

PROPORTIONS: slim adult man of average height, about 6.5 heads tall, natural anime proportions; not chibi, not super-deformed, no big head, no oversized hands or feet. His eyes are always hidden behind the dark sunglasses.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them. The two poses are the two frames of one looping animation: everything not described as changing stays identical.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing upright he is about 112 art pixels tall including the hair (about 450 px on the canvas).
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image as if watching a fight happening off to the right, head turned a little more toward the right, camera slightly above (about 10 degrees). Both lenses of his sunglasses are visible. Because he faces the viewer, his right hand (the microphone hand) is on the LEFT side of the image and his left hand (the fist) is on the RIGHT side, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd).
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f6c69e #d9946e #a8644a; golden-blond hair #fff3b0 #ffdd5c #f2b630 #c47f1a #8a5212; sunglasses #15131d #3b3a52; black suit, trousers and shoes #4c4b60 #2f2e3e #23222f; white shirt #ffffff #e9e7f1 #b6b2c6; red necktie #e85454 #c0303e #7e1828; microphone head #eef1f6 #aab2c2 #6c7488; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no labels, no speech bubbles, no sound-effect lettering, no motion lines, no frame borders or grid lines, no energy effects, no extra characters.
```

## A4 · `cower`: ducking for cover, trembling (loop)

Attach: model sheet + idle strip. Save as: `raw/cower_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#cower).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: the World Martial Arts Tournament announcer from Dragon Ball / Dragon Ball Z, drawn as an anime fan-art sprite (an homage): an adult male tournament announcer with a voluminous mop of curly golden-blond hair, black sunglasses, a clean-shaven friendly face with a wide expressive mouth, a black two-button suit with matching trousers, a crisp white shirt, a deep-red necktie and black dress shoes, holding a classic handheld microphone with a round silver mesh head and a black handle in his right hand.
Match the attached model sheet and idle strip exactly: same face, hair curls, sunglasses, suit, colors, proportions and character scale in both poses (he is only crouching, not smaller).

ANIMATION: "cower", ducking for cover from a huge explosion, trembling comically. 2 frames, left to right, looping fast (frame 2 flows back into frame 1).
1. Deep crouch on the spot: knees bent sharply, heels lifted, back hunched, head ducked down between his shoulders. Both forearms are crossed over the top of his curly hair for cover; his right hand still clutches the microphone, which sticks up beside his head. The suit jacket hem flares out. His sunglasses are knocked slightly askew but still cover his eyes. One small light-blue sweat drop flies off toward the upper right of his head. Face: panic, teeth gritted in a wobbly grimace, brows pinched upward.
2. The identical pose, shaking: the whole body shifted 1 pixel left and 1 pixel down, arms pulled 1 pixel tighter over the head, the sweat drop a little further out. Feet in the same place.

PROPORTIONS: slim adult man of average height, about 6.5 heads tall, natural anime proportions; not chibi, not super-deformed, no big head, no oversized hands or feet. His eyes are always hidden behind the dark sunglasses.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them. The two poses are the two frames of one looping animation: everything not described as changing stays identical.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing upright he would be about 112 art pixels tall including the hair; crouched like this he is about 74 art pixels tall (about 300 px on the canvas).
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image, camera slightly above (about 10 degrees). Because he faces the viewer, his right hand (the microphone hand) is on the LEFT side of the image, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd).
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f6c69e #d9946e #a8644a; golden-blond hair #fff3b0 #ffdd5c #f2b630 #c47f1a #8a5212; sunglasses #15131d #3b3a52; black suit, trousers and shoes #4c4b60 #2f2e3e #23222f; white shirt #ffffff #e9e7f1 #b6b2c6; red necktie #e85454 #c0303e #7e1828; microphone head #eef1f6 #aab2c2 #6c7488; mouth #5a1a22; sweat drop #8fd3ff with a white highlight.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no labels, no speech bubbles, no sound-effect lettering, no motion lines or shake lines, no frame borders or grid lines, no explosion or energy effects (the single sweat drop is the only extra), no extra characters.
```
