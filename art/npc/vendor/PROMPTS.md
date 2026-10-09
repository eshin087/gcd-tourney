# Vendor (snack seller): image prompts (generation order)

> Paste-ready prompts for Codex's built-in image generator (or ChatGPT by hand). Each block is
> self-contained. Poses: [ANIMATIONS.md](ANIMATIONS.md). Look and palette: [CHARACTER.md](CHARACTER.md).
> File flow, naming, quick check: [art/npc/README.md](../README.md). ADR 0008 wins over this file.

## How to use

1. **Claim the batch** `npc-vendor` (`npm run queue -- claim --type npc --agent <name>`). Work only on
   this NPC's files.
2. **One image thread for the whole batch**, so the generator keeps the design in context.
3. **S1 first** (model sheet), unless an approved `reference/model_sheet.png` already exists: then skip
   S1 and attach that file instead.
4. **Attach to A1:** the model sheet (the approved `reference/model_sheet.png`, or this batch's latest
   `reference/model_sheet_vNN.png` while none is approved).
5. **Save to the exact path `claim` printed** (the index shows the pattern). If unsure about the
   number, run `npm run queue -- next-file art/npc/vendor/raw/<anim>` (model sheet:
   `art/npc/vendor/reference/model_sheet`). Never overwrite.
6. **Quick check** before saving ([README](../README.md#quick-check-before-saving)). When one frame is
   off, regenerate the whole 2-frame strip and add one line at the end of the prompt naming the problem,
   for example `FIX: the food on the tray changes between the frames; keep exactly the same bowls,
   skewers and buns in the same places.`
7. He is an original character: no names to drop. Generators like to write shop names or kanji on
   festival coats, bowls and trays: if any writing appears, regenerate and restate "plain, no letters,
   no symbols" at the top of the prompt.
8. **Hand back** with `npm run queue -- done npc-vendor --agent <name>` and one QA line per saved file.
   The lead queues the files in `art/REVIEW.md`; workers never edit shared files.

## Index

| id | asset | frames | attach | save as |
|---|---|---|---|---|
| S1 | model sheet (front, in-game 3/4, side, back + 27 swatches) | 4 figures | nothing | `reference/model_sheet_vNN.png` |
| A1 | `idle`: hawking his food (loop) | 2 | model sheet | `raw/idle_vNN.png` |

All paths are relative to `art/npc/vendor/`.

---

## S1 · Model sheet

Attach: nothing. Save as: `reference/model_sheet_vNN.png`.

```text
Character model sheet for a hi-res pixel-art side character in a 2D anime arena fighting game (an original anime-style design).
CHARACTER: a stocky, cheerful middle-aged snack vendor at a martial-arts tournament: a round friendly face, rosy cheeks, a small black mustache and short black hair, a twisted white towel tied around his forehead as a headband with the knot and two short ends on his left side, a short-sleeved indigo festival coat with white trim along the collar edges and the sleeves rolled to the elbows, tied with a dark belt over a white undershirt, dark-brown knee-length shorts and straw sandals. Hung from a rope strap around his neck he carries a shallow rectangular wooden tray at belly height holding two red lacquered bowls of noodles with chopsticks, three skewers of tri-color dumplings (pink, white and green balls) and three white steamed buns. The coat, bowls and tray are plain: no letters, no symbols.

Draw the same character 4 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear magenta gaps between them:
1. front view, standing with both hands on the edges of the tray, big grin;
2. THE IN-GAME VIEW (the most important figure): 3/4 view facing the viewer with the body turned about 30 degrees toward the RIGHT edge of the image and the head turned a little more to the right, camera slightly above so the food on the tray reads clearly; both hands on the tray edges; big grin;
3. side view facing RIGHT (full profile), showing the tray's depth, the neck strap and his round belly behind it;
4. back view: the towel knot, the back of the indigo coat (plain, no crest or writing), the strap over his neck.
Below the figures, one row of 27 small square color swatches (no text), one per palette color, in the palette order listed below.

PROPORTIONS: stocky middle-aged man, slightly short, broad shoulders and a round belly, about 5.5 heads tall, natural anime proportions; not chibi, not super-deformed, no oversized head, hands or feet.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing he is about 104 art pixels tall including the headband (about 415 px on the canvas).
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd). The food is a few bold, readable shapes, not tiny noise.
PALETTE (use only these colors): outline #1d1420; skin #ffd8b0 #eeb487 #c88560 #985a40; cheek blush #f08a7a; hair and mustache #4a3a3e #2a2028; white towel, trim, undershirt, buns and white dumplings #ffffff #e6e2ea #b8b2c4; indigo coat #4f70bc #30488c #1d2b5c; brown shorts and belt #7c5c42 #5a3e2a #3a2618; tray wood, rope strap, sandals, sticks and chopsticks #e2b27c #b8814a #84562f; red lacquer bowls #e44a4a #a82a32; noodles #ffe9a6 #eec45e; pink dumplings #ffb2c6; green dumplings #8cd27a; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no steam, no text, no letters, no kanji, no numbers, no labels, no frame borders or grid lines, no extra characters.
```

Check before saving: towel headband with the knot on his left side (image-right in figure 2), mustache
and rosy cheeks, indigo coat with white trim and no writing, tray on a neck strap with 2 red bowls, 3
tri-color skewers and 3 buns, stocky (about 5.5 heads, not chibi), 4 figures on one baseline.

---

## A1 · `idle`: hawking his food (loop)

Attach: model sheet. Save as: `raw/idle_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (an original anime-style design).
CHARACTER: a stocky, cheerful middle-aged snack vendor at a martial-arts tournament: a round friendly face, rosy cheeks, a small black mustache and short black hair, a twisted white towel tied around his forehead as a headband with the knot and two short ends on his left side, a short-sleeved indigo festival coat with white trim along the collar edges and the sleeves rolled to the elbows, tied with a dark belt over a white undershirt, dark-brown knee-length shorts and straw sandals. Hung from a rope strap around his neck he carries a shallow rectangular wooden tray at belly height holding two red lacquered bowls of noodles with chopsticks, three skewers of tri-color dumplings (pink, white and green balls) and three white steamed buns. The coat, bowls and tray are plain: no letters, no symbols.
Match the attached model sheet exactly: same face, headband, coat, tray, food, colors, proportions and scale.

ANIMATION: "idle", hawking his food in the stands. 2 frames, left to right, looping (frame 2 flows back into frame 1).
1. Calling out his food: upright, feet at hip width. His right hand is cupped beside his open mouth like a megaphone. His left hand steadies the right edge of the tray. The tray hangs at belly height on its neck strap, the food on top. Face: calling out, mouth wide open, eyes closed in happy arcs, brows up.
2. Both hands on the tray: his right hand is back on the tray's left edge. His knees soften so his body, the tray and the food dip 2 pixels lower; the headband knot ends swing slightly. Feet unchanged. Face: big closed-mouth grin, cheeks pushed up, eyes open and twinkling.
The tray keeps exactly the same shape, size and food (same bowls, skewers and buns in the same places) in both frames.

PROPORTIONS: stocky middle-aged man, slightly short, broad shoulders and a round belly, about 5.5 heads tall, natural anime proportions; not chibi, not super-deformed, no oversized head, hands or feet.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them. The two poses are the two frames of one looping animation: everything not described as changing stays identical.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. Standing he is about 104 art pixels tall including the headband (about 415 px on the canvas).
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image, head turned a little more toward the right, camera slightly above (about 10 degrees) so the food on the tray reads clearly. Both eyes visible. Because he faces the viewer, his right hand (the calling hand) is on the LEFT side of the image and his left hand is on the RIGHT side, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd). The food is a few bold, readable shapes, not tiny noise.
PALETTE (use only these colors): outline #1d1420; skin #ffd8b0 #eeb487 #c88560 #985a40; cheek blush #f08a7a; hair and mustache #4a3a3e #2a2028; white towel, trim, undershirt, buns and white dumplings #ffffff #e6e2ea #b8b2c4; indigo coat #4f70bc #30488c #1d2b5c; brown shorts and belt #7c5c42 #5a3e2a #3a2618; tray wood, rope strap, sandals, sticks and chopsticks #e2b27c #b8814a #84562f; red lacquer bowls #e44a4a #a82a32; noodles #ffe9a6 #eec45e; pink dumplings #ffb2c6; green dumplings #8cd27a; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no steam, no text, no letters, no kanji, no numbers, no labels, no speech bubbles, no sound-effect lettering, no motion lines, no frame borders or grid lines, no effects, no extra characters.
```
