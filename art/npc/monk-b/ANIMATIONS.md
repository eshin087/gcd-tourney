# Monk B (young judge): animations, frame by frame

> Look, palette and landmarks: [CHARACTER.md](CHARACTER.md). Prompts: [PROMPTS.md](PROMPTS.md).
> NPC spec and engine use: [art/npc/README.md](../README.md). ADR 0008 wins over this file.

## How to read this file

- **f0, f1** are 0-based frame numbers, left to right in the strip (f0 = `<anim>_00.png`). Prompts call
  them "frame 1" and "frame 2".
- **x / y** are packed-cell pixels (128 x 128, soles on y 124, feet centered on x 64) at the idle scale.
  QA numbers for the lead and Claude; the prompts describe the same poses in words.
- **R / L** are the monk's own right / left. He mostly faces the viewer, so **R is on the image's left**
  and **L is on the image's right**, the side the ring is on.
- **height** = trimmed height of the tallest frame in px (a check; the proposed packer rule scales the NPC once, from
  `idle`).

## Rules for every strip

1. Same head size (about 16 px), proportions and palette in both frames; 3/4 view toward the right.
2. Feet stay planted in the same place in both frames.
3. The staff is the same length in every frame (about 100 px, a little shorter than he is) and stays
   straight; the ribbon is always at the same end.
4. Everything fits x 4..123, y 4..124 after packing. The staff is raised horizontally just above the
   head, never at a straight-up arm's length.
5. No text, speech bubbles, sound-effect lettering, motion lines, ground shadow or effects.

**Packer note.** In `idle` the staff base touches the baseline beside his feet. Feet centering must use
the feet, not the staff (or one anchor for the whole NPC taken from `idle`), or the body will jump
sideways between `idle` and `signal`.

## All animations

| anim | what | frames | loop | ms per frame | height | engine trigger (proposed) | fallback |
|---|---|---|---|---|---|---|---|
| [`idle`](#idle) | rigid watch with the staff planted | 2 | yes | 800, 800 | 108 | default | (required) |
| [`signal`](#signal) | the call: staff raised overhead, then thrust at the ring | 2 | no (f0 wind-up, f1 held) | 180, 900 | 112 | round start (both monks), ring-out (the nearer monk), KO / time-up decision | `idle` |

`signal` is one-shot: the engine plays f0, holds f1 for the length of the call, then returns to `idle`.

---

## idle

2 frames, loop, 800 ms each. Save as `raw/idle_vNN.png`. Prompt A1.

| frame | pose | face |
|---|---|---|
| f0 | Upright, rigid stand, feet at shoulder width. R hand grips the staff at chest height; the staff stands planted on the ground beside his R foot (image-left), vertical, its top at about his eye level, the crimson ribbon hanging below the top. L fist rests on the sash at his L hip. Body turned about 30 degrees toward the right, eyes on the ring. | stern: eyes narrowed, mouth a firm line |
| f1 | A breath: chest 1 px higher. The ribbon tails and the sash ends stir 1-2 px toward the right in a breeze. Feet, staff base and grip unchanged. | same |

QA: trimmed height 106-110 (crown at about y 16); staff about x 44..48 from y 24 to y 124 in both
frames; feet identical.

## signal

2 frames, one-shot: f0 180 ms (wind-up), f1 900 ms (the call, held by the engine). Save as
`raw/signal_vNN.png`. Prompt A2.

| frame | pose | face |
|---|---|---|
| f0 | Wind-up: both hands raise the staff horizontally just above his head, elbows bent out to the sides, hands about shoulder-width apart; the staff is centered over him, the ribbon end toward the right. Chest out, chin up. | alert: eyes wide, brows down, jaw set |
| f1 | The call: the staff swung down to point forward toward the right like a spear, held in both hands (L hand forward on the image's right, R hand back near his R hip on the image's left), angled about 20 degrees below horizontal, the ribbon end pointing at the ring at about waist height. Torso leans forward about 12 degrees. Robe hem and sash ends swing back. Feet unchanged. | call: mouth wide open in a sharp shout, brows hard down |

QA: f0 hands at about y 10..14, staff spanning about x 14..114, trimmed height 110-114 (target 112);
f1 staff tip and ribbon at x 123 or less, back end of the staff at x 10 or more. Feet planted in both
frames.
