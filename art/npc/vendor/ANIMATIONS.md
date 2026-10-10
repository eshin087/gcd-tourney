# Vendor (snack seller): animations, frame by frame

> Look, palette and landmarks: [CHARACTER.md](CHARACTER.md). Prompts: [PROMPTS.md](PROMPTS.md).
> NPC spec and engine use: [art/npc/README.md](../README.md). ADR 0008 wins over this file.

## How to read this file

- **f0, f1** are 0-based frame numbers, left to right in the strip (f0 = `idle_00.png`). Prompts call
  them "frame 1" and "frame 2".
- **x / y** are packed-cell pixels (128 x 128, soles on y 124, feet centered on x 64) at the idle scale.
  QA numbers for the lead and Claude; the prompt describes the same poses in words.
- **R / L** are the vendor's own right / left. He mostly faces the viewer, so **R is on the image's
  left** and **L is on the image's right**.
- **height** = trimmed height of the tallest frame in px. The packer scales each strip so its tallest frame equals this value
  (generated strips drift in scale between images); a row without a height takes idle's scale.

## Rules

1. Same head size (about 20 px), proportions and palette in both frames; 3/4 view toward the right.
2. Feet stay planted in the same place in both frames.
3. The tray keeps exactly the same shape, size and food layout in both frames; it only moves with his
   body (1-2 px).
4. Everything fits x 4..123, y 4..124 after packing.
5. No text (nothing written on the coat, the bowls or the tray), speech bubbles, sound-effect lettering,
   steam, motion lines or ground shadow.

## All animations

| anim | what | frames | loop | ms per frame | height | engine trigger (proposed) | fallback |
|---|---|---|---|---|---|---|---|
| [`idle`](#idle) | hawking his food: calling out, then a grin | 2 | yes | 600, 600 | 104 | always (also while the engine drifts him along the aisle) | (required) |

---

## idle

2 frames, loop, 600 ms each. Save as `raw/idle_vNN.png`. Prompt A1.

| frame | pose | face |
|---|---|---|
| f0 | Calling out his food: upright, feet at hip width. R hand (image-left) cupped beside his open mouth like a megaphone. L hand (image-right) steadies the right edge of the tray. Tray at belly height on its neck strap, food on top. | calling out: mouth wide open, eyes closed in happy arcs, brows up |
| f1 | Both hands on the tray: the R hand back on the tray's left edge. Knees soften so the body, tray and food dip 2 px. Headband knot ends swing 1 px. Feet unchanged. | big closed-mouth grin, cheeks pushed up, eyes open |

QA: trimmed height 102-106 (top of the headband at about y 20); tray front edge about x 38..90,
y 64..74 in f0 and 2 px lower in f1, same food in the same places; feet identical in both frames.
