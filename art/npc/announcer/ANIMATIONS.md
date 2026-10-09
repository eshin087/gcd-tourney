# Announcer: animations, frame by frame

> Look, palette and landmarks: [CHARACTER.md](CHARACTER.md). Prompts: [PROMPTS.md](PROMPTS.md).
> NPC spec and engine use: [art/npc/README.md](../README.md). ADR 0008 wins over this file.

## How to read this file

- **f0, f1** are 0-based frame numbers, left to right in the strip (f0 = `<anim>_00.png`). Prompts call
  them "frame 1" and "frame 2".
- **x / y** are packed-cell pixels (128 x 128, x from the left, y from the top, soles on y 124, feet
  centered on x 64) at the idle scale. They are QA numbers for the lead and Claude; the generator never
  sees pixel numbers (the prompts describe the same poses in words).
- **R / L** are the announcer's own right / left. He mostly faces the viewer, so **R (microphone hand)
  is on the image's left** and **L (gesture / pointing hand) is on the image's right**, the side the
  fight is on.
- **height** = trimmed height of the tallest frame in px. The proposed packer rule scales the whole NPC once (from
  `idle`), so these are checks, not per-strip scale targets.

## Rules for every strip

1. Same head size (about 16 px), proportions and palette in both frames; 3/4 view toward the right.
2. Feet stay planted on the baseline in both frames (the engine never moves him during an animation).
   Only `cower` changes the stance, and it keeps the feet in place.
3. The microphone stays in the R hand in every frame, near the mouth (except `cower`, where it is
   clutched beside the head).
4. Everything fits x 4..123, y 4..124 after packing. Raised arms go diagonally, never straight up.
5. No text, speech bubbles, sound-effect lettering, motion lines, ground shadow or effects. The one
   allowed extra is the small blue sweat drop in `cower`.
6. The two frames of a loop differ by a clear but small change (gesture, lean, mouth). Everything not
   described as changing stays identical, so the 2-frame loop does not pop.

## All animations

| anim | what | frames | loop | ms per frame | height | engine trigger (proposed) | fallback |
|---|---|---|---|---|---|---|---|
| [`idle`](#idle) | talking at ringside, hand on hip / open-palm gesture | 2 | yes | 520, 520 | 112 | default | (required) |
| [`point`](#point) | pointing at the ring while announcing | 2 | yes | 240, 240 | 112 | intro (calling each fighter), the winner at KO / round end, ring-out | `idle` |
| [`shout`](#shout) | fist-pumping hype shout into the mic | 2 | yes | 140, 140 | 116 | round start ("Begin!"), super / ultimate activation, long combos | `point`, then `idle` |
| [`cower`](#cower) | ducking for cover, trembling | 2 | yes | 90, 90 | 74 | ultimate beams, beam clashes, explosion-size KOs, hard camera shakes (priority over `shout` / `point`) | `idle` |

All four loop: the engine decides how long each plays, then returns to `idle`. `idle` is the only
required animation (the sheet is `complete` when all four exist).

---

## idle

2 frames, loop, 520 ms each. Save as `raw/idle_vNN.png`. Prompt A1.

| frame | pose | face |
|---|---|---|
| f0 | Relaxed stand, feet about shoulder width, weight slightly on the R leg (image-left) so the hips tilt a little. Torso turned about 30 degrees toward the right. R hand holds the microphone just in front of and below his chin. L hand rests on the L hip, elbow bent out to the right. | talking half-grin, mouth open, brows up |
| f1 | Same stance, knees softened (body 1 px lower), torso leaning 1-2 px toward the right. L hand leaves the hip and opens palm-up at waist height, gesturing toward the right. Hair curls settle 1 px. Mic unchanged. | closed-mouth grin |

QA: feet identical in both frames (about x 54..74). Mic head about x 54-58, y 32-37 in both frames
(within 2 px). L elbow / palm never past x 98. Trimmed height 111-112.

## point

2 frames, loop, 240 ms each. Save as `raw/point_vNN.png`. Prompt A2.

| frame | pose | face |
|---|---|---|
| f0 | L arm extended toward the right at shoulder height, elbow straight, index finger pointing, the other fingers curled; arm slightly foreshortened by the 3/4 turn. Torso leans about 8 degrees toward the right, weight on the L (image-right) foot. Mic at the mouth. | announcing: mouth wide open, brows raised |
| f1 | Same, with a jab: pointing arm about 10 degrees higher and the finger 2-3 px further right, lean 2 px further, hair curls bounce 1 px. Feet unchanged. | mouth at its widest, head pushed slightly forward |

QA: fingertip x 112..120, y about 36..44 (never past x 123, never above the hair). Feet planted
(identical to idle). Trimmed height about 112.

## shout

2 frames, loop, 140 ms each (a fast fist pump). Save as `raw/shout_vNN.png`. Prompt A3.

| frame | pose | face |
|---|---|---|
| f0 | Leaning back about 10 degrees, knees slightly bent. L arm thrown up and out to the right at about 40 degrees above horizontal, fist clenched (the fist ends to the right of his head, about level with the top of the hair). Mic pressed to the mouth. Jacket open and flaring a little. | hype shout: mouth at its widest, head tilted back, sunglasses glint |
| f1 | Leaning forward about 6 degrees, body 2 px lower (knees bend more). L fist pumped down to shoulder height, elbow bent and pulled in beside the ribs. Mic still pressed to the mouth. Hair curls bounce up 1-2 px (lag). | same shout, chin forward |

QA: f0 fist about x 104..114, top of fist at y 8 or lower in the cell (y >= 8); trimmed height
114-118 (target 116). Feet planted in both frames.

## cower

2 frames, loop, 90 ms each (trembling). Save as `raw/cower_vNN.png`. Prompt A4.

| frame | pose | face |
|---|---|---|
| f0 | Deep crouch on the spot: knees bent sharply, heels up, back hunched, head ducked between the shoulders. Both forearms crossed over the top of his hair for cover; the R hand still clutches the microphone, which sticks up beside his head. Jacket hem flared out. Sunglasses knocked askew (still covering the eyes). One small blue sweat drop flying off to the upper right of his head. | panic: teeth gritted in a wobbly grimace, brows pinched up |
| f1 | Identical pose shaking: whole body 1 px left and 1 px down, arms 1 px tighter over the head, sweat drop 2 px further out. | same |

QA: trimmed height 72-76 (top at about y 50); feet stay within x 50..78; the sweat drop is the only
non-body element and stays inside the cell.
