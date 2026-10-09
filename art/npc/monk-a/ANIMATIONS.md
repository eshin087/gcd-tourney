# Monk A (elder judge): animations, frame by frame

> Look, palette and landmarks: [CHARACTER.md](CHARACTER.md). Prompts: [PROMPTS.md](PROMPTS.md).
> NPC spec and engine use: [art/npc/README.md](../README.md). ADR 0008 wins over this file.

## How to read this file

- **f0, f1** are 0-based frame numbers, left to right in the strip (f0 = `<anim>_00.png`). Prompts call
  them "frame 1" and "frame 2".
- **x / y** are packed-cell pixels (128 x 128, soles on y 124, feet centered on x 64) at the idle scale.
  QA numbers for the lead and Claude; the prompts describe the same poses in words.
- **R / L** are the monk's own right / left. He mostly faces the viewer, so **R (prayer beads) is on the
  image's left** and **L (fan) is on the image's right**, the side the ring is on.
- **height** = trimmed height of the tallest frame in px (a check; the proposed packer rule scales the NPC once, from
  `idle`).

## Rules for every strip

1. Same head size (about 18 px), proportions and palette in both frames; 3/4 view toward the right.
2. Feet stay planted in the same place in both frames.
3. The fan stays in the L hand in every frame; it never switches hands.
4. Everything fits x 4..123, y 4..124 after packing. The fan is raised beside the head, never at a
   straight-up arm's length.
5. No text, speech bubbles, sound-effect lettering, motion lines, ground shadow or effects.

## All animations

| anim | what | frames | loop | ms per frame | height | engine trigger (proposed) | fallback |
|---|---|---|---|---|---|---|---|
| [`idle`](#idle) | serene stand, telling his prayer beads | 2 | yes | 800, 800 | 92 | default | (required) |
| [`signal`](#signal) | the call: fan raised, then swept down at the ring | 2 | no (f0 wind-up, f1 held) | 180, 900 | 108 | round start (both monks), ring-out (the nearer monk), KO / time-up decision | `idle` |

`signal` is one-shot: the engine plays f0, holds f1 for the length of the call, then returns to `idle`.

---

## idle

2 frames, loop, 800 ms each (slow breathing). Save as `raw/idle_vNN.png`. Prompt A1.

| frame | pose | face |
|---|---|---|
| f0 | Calm, slightly stooped stand, feet together under the robe hem (sandals showing). R hand at the chest, fingers on the prayer beads. L arm hanging relaxed at his side holding the fan paddle-down by its handle. Body turned about 30 degrees toward the right. | serene: eyes closed as calm slits, faint smile |
| f1 | A slow breath and a small nod: shoulders 1 px higher, head tipped 1-2 px forward so the beard tip swings 1-2 px; the R fingers have moved one bead; the fan swings 1 px. Feet unchanged. | same |

QA: trimmed height 90-94 (crown at about y 32); robe hem and sandals identical in both frames; the fan
stays about x 84..96, y 86..110.

## signal

2 frames, one-shot: f0 180 ms (wind-up), f1 900 ms (the call, held by the engine). Save as
`raw/signal_vNN.png`. Prompt A2.

| frame | pose | face |
|---|---|---|
| f0 | Wind-up: the L arm raises the fan up beside his head on the image's right, elbow bent at about shoulder height, the paddle upright above his head (its top about one head-height above his crown). He straightens and leans back slightly. R hand clasps the prayer beads at his chest. The mantle edge swings. | alert: eyes snapped wide open, brows lifted, mouth pressed shut |
| f1 | The call: the L arm sweeps the fan forward and down toward the right, arm extended at about 30 degrees below horizontal, the flat face of the paddle toward the viewer, pointing at the ring. Body leans forward about 10 degrees, back stooped again. Beard swings forward 2 px. R hand still at the chest. Feet unchanged. | command: mouth wide open in a commanding shout, eyes wide, brows down |

QA: f0 top of the fan at about y 16 (never above y 8): trimmed height 104-110 (target 108). f1 fan
paddle about x 100..118, y 64..86, never past x 123. Feet planted in both frames.
