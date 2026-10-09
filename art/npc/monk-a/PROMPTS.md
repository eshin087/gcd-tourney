# Monk A (elder judge): image prompts (generation order)

> Paste-ready prompts for Codex's built-in image generator (or ChatGPT by hand). Each block is
> self-contained. Poses: [ANIMATIONS.md](ANIMATIONS.md). Look and palette: [CHARACTER.md](CHARACTER.md).
> File flow, naming, quick check: [art/npc/README.md](../README.md). ADR 0008 wins over this file.

## How to use

1. **Claim the batch** `npc-monk-a` (`npm run queue -- claim --type npc --agent <name>`). Work only on
   this NPC's files.
2. **One image thread for the whole batch**, so the generator keeps the design in context.
3. **S1 first** (model sheet), unless an approved `reference/model_sheet.png` already exists: then skip
   S1 and attach that file instead.
4. **Attach to every strip prompt:** the model sheet (the approved `reference/model_sheet.png`, or this
   batch's latest `reference/model_sheet_vNN.png` while none is approved). For A2 also attach the idle
   strip (`reference/idle_approved.png`, or this batch's `raw/idle_vNN.png`).
5. **Save to the exact path `claim` printed** (the index shows the pattern). If unsure about the
   number, run `npm run queue -- next-file art/npc/monk-a/raw/<anim>` (model sheet:
   `art/npc/monk-a/reference/model_sheet`). Never overwrite.
6. **Quick check** before saving ([README](../README.md#quick-check-before-saving)). When one frame is
   off, regenerate the whole 2-frame strip and add one line at the end of the prompt naming the problem,
   for example `FIX: in frame 1 the fan is held straight up at arm's length; hold it beside his head
   with the elbow bent.`
7. He is an original character: no names to drop. If the generator drifts (hair appears, the robe turns
   orange-red, the beard gets short), restate the drifting trait at the top of the prompt.
8. **Hand back** with `npm run queue -- done npc-monk-a --agent <name>` and one QA line per saved file.
   The lead queues the files in `art/REVIEW.md`; workers never edit shared files.

## Index

| id | asset | frames | attach | save as |
|---|---|---|---|---|
| S1 | model sheet (front, in-game 3/4, side, back + 22 swatches) | 4 figures | nothing | `reference/model_sheet_vNN.png` |
| A1 | `idle`: serene stand with prayer beads (loop) | 2 | model sheet | `raw/idle_vNN.png` |
| A2 | `signal`: fan raised, then swept down at the ring (one-shot) | 2 | model sheet + idle | `raw/signal_vNN.png` |

All paths are relative to `art/npc/monk-a/`.

---

## S1 · Model sheet

Attach: nothing (optionally monk-b's approved model sheet, for matching style and relative scale).
Save as: `reference/model_sheet_vNN.png`.

```text
Character model sheet for a hi-res pixel-art side character in a 2D anime arena fighting game (an original anime-style design).
CHARACTER: an elderly tournament judge monk: a short, round, slightly stooped old man with a shiny bald head, long bushy white eyebrows that droop past his eyes, a white mustache and a long thin white beard reaching the middle of his chest, wearing an ankle-length saffron-yellow robe with wide sleeves and a crimson monk's mantle with a thin gold border draped diagonally over his left shoulder (his right shoulder and right sleeve stay saffron), a long necklace of big dark-wood prayer beads hanging to his belly, and straw sandals on bare feet. In his left hand he holds a referee's paddle-fan: a flat, rounded, slightly gourd-shaped paddle lacquered crimson with a plain gold circle in the middle and a short black handle.

Draw the same character 4 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear magenta gaps between them:
1. front view, calm stand, right hand on the prayer beads at his chest, left hand holding the fan paddle-down at his side;
2. THE IN-GAME VIEW (the most important figure): 3/4 view facing the viewer with the body turned about 30 degrees toward the RIGHT edge of the image and the head turned a little more to the right; slightly stooped; right hand on the prayer beads at his chest (on the left side of the image), left hand holding the fan paddle-down at his side (on the right side of the image); eyes closed as calm slits, a faint smile;
3. side view facing RIGHT (full profile), showing the stoop, the beard length and the flat fan seen edge-on;
4. back view: the bald head, the mantle crossing his back, the robe hem.
Below the figures, one row of 22 small square color swatches (no text), one per palette color, in the palette order listed below.

PROPORTIONS: short elderly man, about 5 heads tall in his stooped stance, round and bottom-heavy: the robe flares wide at the hem. Natural anime proportions for an old man; not chibi, not super-deformed, no oversized head, hands or feet.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. In his stooped stand he is about 92 art pixels tall (about 370 px on the canvas).
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd). The beard and brows are solid white shapes with simple shading, not thin hair strands.
PALETTE (use only these colors): outline #1d1420; skin #f6d0a8 #e0a87e #b87850 #86523a; white brows, mustache and beard #ffffff #e4e0ea #b0aac0; saffron robe #ffd67e #f4aa3c #c47a1e; crimson mantle and fan paddle #ec5a62 #c8323c #861c28; gold border and fan circle #ffe27a #c8982c; prayer beads #8c5c36 #5a3a22; fan handle #3a2a30; straw sandals #e4c47c #b08a4c; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no symbols on the fan, no labels, no frame borders or grid lines, no extra characters.
```

Check before saving: bald (no hair at all), long drooping white brows and a long beard, saffron robe +
crimson mantle on his left shoulder (image-right in figure 2), fan in the left hand with a plain gold
circle, short and round (clearly shorter than an average adult), 4 figures on one baseline.

---

## A1 · `idle`: serene stand with prayer beads (loop)

Attach: model sheet. Save as: `raw/idle_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (an original anime-style design).
CHARACTER: an elderly tournament judge monk: a short, round, slightly stooped old man with a shiny bald head, long bushy white eyebrows that droop past his eyes, a white mustache and a long thin white beard reaching the middle of his chest, wearing an ankle-length saffron-yellow robe with wide sleeves and a crimson monk's mantle with a thin gold border draped diagonally over his left shoulder (his right shoulder and right sleeve stay saffron), a long necklace of big dark-wood prayer beads hanging to his belly, and straw sandals on bare feet. In his left hand he holds a referee's paddle-fan: a flat, rounded, slightly gourd-shaped paddle lacquered crimson with a plain gold circle in the middle and a short black handle.
Match the attached model sheet exactly: same face, brows, beard, robe, mantle, fan, colors, proportions and scale. This idle strip becomes the reference for his other animation, so make it as clean and on-model as possible.

ANIMATION: "idle", the elder judge waiting calmly at the ring corner. 2 frames, left to right, looping slowly (frame 2 flows back into frame 1).
1. Calm, slightly stooped stand, feet together under the robe hem with the sandals showing. His right hand rests at his chest with the fingers on the prayer beads. His left arm hangs relaxed at his side, holding the fan paddle-down by its handle. Face: serene, eyes closed as calm slits, a faint smile under the mustache.
2. A slow breath and a small nod: shoulders 1 pixel higher, head tipped slightly forward so the beard tip swings a little; his fingers have moved one bead along the necklace; the fan swings very slightly. Feet unchanged. Face: same.

PROPORTIONS: short elderly man, about 5 heads tall in his stooped stance, round and bottom-heavy: the robe flares wide at the hem. Natural anime proportions for an old man; not chibi, not super-deformed, no oversized head, hands or feet.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them. The two poses are the two frames of one looping animation: everything not described as changing stays identical.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. In his stooped stand he is about 92 art pixels tall (about 370 px on the canvas).
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image as if watching a fight happening off to the right, head turned a little more toward the right, camera slightly above (about 10 degrees). Both eyes visible. Because he faces the viewer, his right hand (prayer beads) is on the LEFT side of the image and his left hand (the fan) is on the RIGHT side, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd). The beard and brows are solid white shapes with simple shading, not thin hair strands.
PALETTE (use only these colors): outline #1d1420; skin #f6d0a8 #e0a87e #b87850 #86523a; white brows, mustache and beard #ffffff #e4e0ea #b0aac0; saffron robe #ffd67e #f4aa3c #c47a1e; crimson mantle and fan paddle #ec5a62 #c8323c #861c28; gold border and fan circle #ffe27a #c8982c; prayer beads #8c5c36 #5a3a22; fan handle #3a2a30; straw sandals #e4c47c #b08a4c; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no symbols on the fan, no labels, no speech bubbles, no motion lines, no frame borders or grid lines, no effects, no extra characters.
```

## A2 · `signal`: fan raised, then swept down at the ring (one-shot)

Attach: model sheet + idle strip. Save as: `raw/signal_vNN.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#signal).

```text
Hi-res pixel-art sprite strip for a side character in a 2D anime arena fighting game (an original anime-style design).
CHARACTER: an elderly tournament judge monk: a short, round, slightly stooped old man with a shiny bald head, long bushy white eyebrows that droop past his eyes, a white mustache and a long thin white beard reaching the middle of his chest, wearing an ankle-length saffron-yellow robe with wide sleeves and a crimson monk's mantle with a thin gold border draped diagonally over his left shoulder (his right shoulder and right sleeve stay saffron), a long necklace of big dark-wood prayer beads hanging to his belly, and straw sandals on bare feet. In his left hand he holds a referee's paddle-fan: a flat, rounded, slightly gourd-shaped paddle lacquered crimson with a plain gold circle in the middle and a short black handle.
Match the attached model sheet and idle strip exactly: same face, brows, beard, robe, mantle, fan, colors, proportions and character scale in both poses.

ANIMATION: "signal", the judge's official call (match start, ring-out, decision). 2 frames, left to right: a wind-up and the call.
1. Wind-up: his left arm raises the fan up beside his head on the right side of the image, elbow bent at about shoulder height, the paddle held upright above his head (its top about one head-height above his bald crown; NOT at a straight-up arm's length). He straightens up and leans back slightly. His right hand clasps the prayer beads at his chest. The mantle edge swings. Face: alert, eyes snapped wide open, white brows lifted, mouth pressed shut.
2. The call: his left arm sweeps the fan forward and down toward the RIGHT, the arm extended at about 30 degrees below horizontal, the flat face of the paddle turned toward the viewer and pointing at the ring off to the right. His body leans forward about 10 degrees, back stooped again; the beard swings forward. His right hand stays at his chest. Face: commanding shout, mouth wide open, eyes wide, brows down.
Feet stay planted in the same place in both frames.

PROPORTIONS: short elderly man, about 5 heads tall in his stooped stance, round and bottom-heavy: the robe flares wide at the hem. Natural anime proportions for an old man; not chibi, not super-deformed, no oversized head, hands or feet.
LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal halves and center one pose in each half, frame 1 on the left, frame 2 on the right. Exactly the same character scale in both poses (same head size), feet on one shared horizontal baseline, a wide magenta gap between them.
SIZE: pixel art drawn at 4x: every art pixel is a crisp 4x4 block of identical screen pixels. In his stooped stand he is about 92 art pixels tall (about 370 px on the canvas); with the fan raised in frame 1 the figure is about 108 art pixels tall.
VIEW: he faces the viewer in a 3/4 view, body turned about 30 degrees toward the RIGHT edge of the image as if watching a fight happening off to the right, head turned a little more toward the right, camera slightly above (about 10 degrees). Both eyes visible. Because he faces the viewer, his right hand (prayer beads) is on the LEFT side of the image and his left hand (the fan) is on the RIGHT side, in both frames.
STYLE: crisp hard-edged hi-res pixel art with an anime/manga look: bold clean shapes, expressive face, flat cel shading. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. A dark outline (#1d1420) one art pixel thick (about 4 canvas px), closed around the whole figure. 3 to 4 tone flat cel shading, key light from the upper front, a little from the LEFT of the image (the arena sun, the same light as the crowd). The beard and brows are solid white shapes with simple shading, not thin hair strands.
PALETTE (use only these colors): outline #1d1420; skin #f6d0a8 #e0a87e #b87850 #86523a; white brows, mustache and beard #ffffff #e4e0ea #b0aac0; saffron robe #ffd67e #f4aa3c #c47a1e; crimson mantle and fan paddle #ec5a62 #c8323c #861c28; gold border and fan circle #ffe27a #c8982c; prayer beads #8c5c36 #5a3a22; fan handle #3a2a30; straw sandals #e4c47c #b08a4c; mouth #5a1a22.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no scenery, no text, no letters, no numbers, no symbols on the fan, no labels, no speech bubbles, no sound-effect lettering, no motion lines or swoosh arcs, no frame borders or grid lines, no effects, no extra characters.
```
