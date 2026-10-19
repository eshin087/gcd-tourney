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
- **height** = trimmed height of the tallest frame in px. The packer scales each strip so its tallest frame equals this value
  (generated strips drift in scale between images); a row without a height takes idle's scale.

## Rules for every strip

1. Same head size (about 16 px), proportions and palette in every frame; 3/4 view toward the right.
2. Feet stay on the baseline in every frame. The standing animations keep them planted in one place;
   `walk` and `run` are cycles **in place** (like a treadmill): the engine slides the whole sprite along the
   ring side while they play (ENG-118) and mirrors it when he walks toward screen-left, so the strips always
   walk toward the right of the image.
3. The microphone stays in the R hand in every frame, near the mouth (except `cower`, where it is
   clutched beside the head, `run`, where it is clutched to the chest, and `micThrust`, where it is held out
   toward the fight).
4. Everything fits x 4..123, y 4..124 after packing. Raised arms go diagonally, never straight up.
5. No text, speech bubbles, sound-effect lettering, motion lines, ground shadow or effects. The one
   allowed extra is the small blue sweat drop in `cower`.
6. The two frames of a loop differ by a clear but small change (gesture, lean, mouth). Everything not
   described as changing stays identical, so the 2-frame loop does not pop. The 4-frame cycles (`walk`,
   `run`) change only the legs, the free arm, the bob and the mouth; head, hair, suit and mic stay the same.

## All animations

| anim | what | frames | loop | ms per frame | height | engine trigger (proposed) | fallback |
|---|---|---|---|---|---|---|---|
| [`idle`](#idle) | talking at ringside, hand on hip / open-palm gesture | 2 | yes | 520, 520 | 112 | default | (required) |
| [`point`](#point) | pointing at the ring while announcing | 2 | yes | 240, 240 | 112 | intro (calling each fighter), the winner at KO / round end, ring-out | `idle` |
| [`shout`](#shout) | fist-pumping hype shout into the mic | 2 | yes | 140, 140 | 116 | round start ("Begin!"), super / ultimate activation, long combos | `point`, then `idle` |
| [`cower`](#cower) | ducking for cover, trembling | 2 | yes | 90, 90 | 74 | ultimate beams, beam clashes, explosion-size KOs, hard camera shakes (priority over `shout` / `point`) | `idle` |
| [`walk`](#walk) | strolling along the ring side, still talking into the mic | 4 | yes | 150, 150, 150, 150 | 112 | moving along the ring edge to keep the fight in view (ENG-118) | `idle` (the engine bobs him) |
| [`run`](#run) | panicked scurry, leaning forward | 4 | yes | 90, 90, 90, 90 | 106 | getting out of the fighters' way, long crossings, hopping onto and off the ring | `walk`, then `idle` |
| [`shocked`](#shocked) | jaw-drop recoil | 2 | yes | 150, 150 | 116 | huge hits, comebacks, a fighter surviving on a sliver of health, surprise KOs | `shout`, then `idle` |
| [`micThrust`](#micthrust) | leaning in, holding the mic out toward the fight | 2 | yes | 260, 260 | 110 | the KO call over the downed fighter, close calls, asking the winner for a word | `point`, then `idle` |

All of them loop: the engine decides how long each plays, then returns to `idle`. `idle` is the only
required animation (the sheet is `complete` when it exists); a missing one plays its fallback.
`walk` .. `micThrust` were added on 2026-10-18 for the live announcer (ENG-118, batch `npc-announcer-r1`):
he walks the ring edge to stay behind the fight, hops onto the ring to call a KO and comments the fight in
small captions. The engine draws them; never draw text or a speech bubble in a strip.

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

---

## walk

4 frames, loop, 150 ms each. Save as `raw/walk_vNN.png`. Prompt A5. A walk **in place**, stepping toward
the right of the image (the engine slides the sprite and mirrors it for leftward walks). He keeps talking.

| frame | pose | face |
|---|---|---|
| f0 | Contact: the image-right leg (his L) reaches forward to the right, heel down; the image-left leg (R) trails behind on the toes; heels about 22 px apart. Torso upright, leaning about 3 degrees toward the right. Mic at the mouth (R hand). The free L arm swings back behind the hip. | talking, mouth open |
| f1 | Passing: the trailing R leg swings through beside the planted L leg, knee a little raised; body 2 px higher. L arm hangs at the side. Mic unchanged. | closed-mouth grin |
| f2 | Contact, the other leg: the R leg forward to the right, heel down; the L leg behind on the toes. The free L hand swings forward to waist height, palm open, gesturing toward the right. | talking, mouth wide |
| f3 | Passing: the L leg swings through beside the planted R leg; body 2 px higher. L arm returning to the side. | closed-mouth grin |

QA: head size, hair and mic identical in all four frames (mic head within 3 px of its idle place
relative to the face). Contact frames 1 px lower than passing frames by design (the bob), never more than
2 px. Feet within x 42..86. Trimmed height 110-112.

## run

4 frames, loop, 90 ms each. Save as `raw/run_vNN.png`. Prompt A6. A comic, panicked scurry **in place**
toward the right of the image (the engine slides him), the way an MC runs out of the line of fire.

| frame | pose | face |
|---|---|---|
| f0 | Contact: torso leaning about 20 degrees forward toward the right, head pushed forward. The image-right leg (L) lands forward on the heel, knee bent; the R leg pushes off behind. The R hand clutches the microphone against his chest. The free L arm pumps back, elbow bent. Jacket tails flare back. | panicked yell: mouth wide, brows pinched up |
| f1 | Passing: the R leg drives forward with the knee raised high; the L foot on its toes under the body; body 2 px higher. L arm swinging forward. | same yell |
| f2 | Contact, the other leg: the R leg lands forward, the L leg pushes off behind. The L arm pumps forward, fist at chin height. | teeth gritted |
| f3 | Passing: the L knee drives forward high; body 2 px higher. L arm swinging back. | same yell |

QA: the lean and head size stay the same in all four frames; the mic stays at the chest in the R hand.
Trimmed height 104-106; feet within x 34..94.

## shocked

2 frames, loop, 150 ms each. Save as `raw/shocked_vNN.png`. Prompt A7.

| frame | pose | face |
|---|---|---|
| f0 | Recoiling: leaning back about 12 degrees, weight on the image-left (R) foot, the other foot lifted a little off the ground at the toe. The free L hand is flung up beside his head, palm out, fingers spread, diagonally up and to the right. The mic is jerked away from the mouth to chest height. Hair curls puffed out about 2 px all round (startle). | jaw drop: mouth a tall open oval, brows shot up above the glasses (glasses jolted 1 px up, the eyes stay hidden) |
| f1 | Same, trembling: body 1 px further back, hair puffed 1 px more, jaw 1 px wider. Feet unchanged. | same |

QA: the eyes are never visible. Raised hand inside x 4..123 and no higher than y 8; trimmed height
114-116.

## micThrust

2 frames, loop, 260 ms each. Save as `raw/micThrust_vNN.png`. Prompt A8.

| frame | pose | face |
|---|---|---|
| f0 | Leaning in about 15 degrees toward the right, knees slightly bent. His R arm reaches **across his body** toward the right at chest height, holding the microphone out with the mesh head pointing right (offering it to a fighter off to the right). The free L hand is cupped behind his L ear, listening. Feet planted as in idle. | eager grin, mouth open |
| f1 | Same, with the mic pushed about 3 px further right and the lean 1 px stronger. | eager closed-mouth grin, listening |

QA: the mic never switches hands (the R arm crosses in front of the torso). Mic head about x 100..118,
y 40..56. Trimmed height 108-110; feet planted (identical to idle).
