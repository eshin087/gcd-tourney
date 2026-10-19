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
| [`blownAway`](#blownaway) | knocked flat on his back by a blast or a flying fighter | 2 | no (f0 flying back, f1 held flat) | 140, 900 | 98 | an ultimate, beam or blast that reaches him; a fighter launched into him (ENG-119) | `cower` |
| [`popUp`](#popup) | springs back up dazed, straightens his tie | 2 | no (f0 sitting up, f1 held) | 380, 600 | 112 | after `blownAway` | `idle` |
| [`cheer`](#cheer) | jumping celebration, both arms up | 2 | yes | 160, 160 | 118 | huge combos, comebacks, the match winner | `shout` |
| [`facepalm`](#facepalm) | slow facepalm, head shaking | 2 | yes | 420, 420 | 110 | a super or ultimate that misses, a draw | `idle` |
| [`micTap`](#mictap) | taps the mic: is this thing on? | 2 | yes | 260, 260 | 112 | idle fidget in quiet moments | none (skipped) |
| [`checkWatch`](#checkwatch) | checks his wristwatch | 2 | yes | 420, 420 | 112 | idle fidget; the last 30 seconds of a round | none (skipped) |
| [`patHair`](#pathair) | pats his curly hair, smug | 2 | yes | 320, 320 | 114 | idle fidget | none (skipped) |
| [`sooty`](#sooty) | charred black face, frizzed smoking hair, coughing | 2 | yes | 200, 200 | 116 | after a blast caught him | `shocked` |
| [`wince`](#wince) | peeks through his fingers, cringing | 2 | yes | 180, 180 | 106 | brutal hits, KO crashes | `cower` |
| [`mopBrow`](#mopbrow) | mops his brow with a handkerchief, tired | 2 | yes | 400, 400 | 108 | a long round tires him | `idle` |

All of them loop: the engine decides how long each plays, then returns to `idle`. `idle` is the only
required animation (the sheet is `complete` when it exists); a missing one plays its fallback.
`walk` .. `micThrust` were added on 2026-10-18 for the live announcer (ENG-118, batch `npc-announcer-r1`):
he walks the ring edge to stay behind the fight, hops onto the ring to call a KO and comments the fight in
small captions. The engine draws them; never draw text or a speech bubble in a strip.
`blownAway` .. `mopBrow` (batch `npc-announcer-r2`, 2026-10-18, ENG-119) make him a living character: he gets
knocked over and pops back up, cheers, facepalms, fidgets in quiet moments, gets sooty, winces and tires. The
engine adds the manga symbols (sweat drops, !!, ?, anger veins, dizzy stars, music notes) as its own small sprites:
never draw a symbol in a strip, except the sweat drops and smoke wisps their rows describe.

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

---

## blownAway

2 frames, one-shot (f0 140 ms, then f1 held), height 98. Save as `raw/blownAway_vNN.png`. Prompt A9. The engine slides
him backward (to the left of the image) during f0 and keeps him down on f1 until `popUp`.

| frame | pose | face |
|---|---|---|
| f0 | Blown backward off his feet toward the LEFT of the image: body tilted back about 45 degrees, both feet kicked up off the ground, arms flailing up, the microphone flung high in his R hand, jacket and tie flapping toward the right, hair blown back. The lowest point is a heel. | yelling in surprise, mouth a wide O |
| f1 | Flat on his back on the floor, head toward the LEFT of the image, both legs sticking straight up in a V, arms splayed out, microphone still in the R hand on the floor, sunglasses knocked crooked (eyes still hidden). | dazed, tongue out a little |

QA: f1 is a low pose (about 56 px tall with the legs up); f0 is the tallest frame. Head size as idle.

## popUp

2 frames, one-shot (f0 380 ms, then f1 held), height 112. Save as `raw/popUp_vNN.png`. Prompt A10.

| frame | pose | face |
|---|---|---|
| f0 | Sitting up on the floor, legs out toward the right, one hand rubbing the back of his head, hair messed up, tie flipped over his shoulder, sunglasses crooked. | dazed, wobbly mouth |
| f1 | Standing again, feet planted as in idle, straightening his tie with the L hand, microphone in the R hand at chest height, hair still a little messy. | sheepish grin |

QA: f1 matches idle's height and feet. f0 is about 70 px tall.

## cheer

2 frames, loop, 160 ms each, height 118. Save as `raw/cheer_vNN.png`. Prompt A11.

| frame | pose | face |
|---|---|---|
| f0 | Knees bent, crouched for a jump, both fists pumped down to chest height, microphone in the R fist. | huge open-mouth grin |
| f1 | Jumping: feet together and tucked up a little, both arms thrown up in a wide V (diagonal, NOT straight up), microphone raised in the R hand, jacket flying open. | shouting with joy, sunglasses glinting |

QA: raised hands inside the cell (y >= 6). The engine lifts him a little during f1; draw f1 with his feet at the bottom
of the pose as usual.

## facepalm

2 frames, loop, 420 ms each, height 110. Save as `raw/facepalm_vNN.png`. Prompt A12.

| frame | pose | face |
|---|---|---|
| f0 | Slumped shoulders, head bowed, the L hand flat over his sunglasses and forehead, microphone hanging at his R side. Feet planted as in idle. | mouth a flat line under the hand |
| f1 | Same, the head turned slightly the other way (a slow head shake), the hand sliding down 1-2 px. | small sigh, mouth open a crack |

## micTap

2 frames, loop, 260 ms each, height 112. Save as `raw/micTap_vNN.png`. Prompt A13.

| frame | pose | face |
|---|---|---|
| f0 | Holding the microphone in front of his chest in the R hand, tapping its mesh head with the L index finger, head tilted toward the mic, listening. | brows raised, mouth pursed |
| f1 | The finger lifted for the next tap, head tilted a little more. | puzzled half-frown |

## checkWatch

2 frames, loop, 420 ms each, height 112. Save as `raw/checkWatch_vNN.png`. Prompt A14.

| frame | pose | face |
|---|---|---|
| f0 | L forearm raised in front of his chest, looking down at a gold wristwatch on the L wrist; microphone in the R hand at his side. | mouth pursed, impatient |
| f1 | Tapping the watch face with the end of the microphone handle. | brows up, mouth open |

## patHair

2 frames, loop, 320 ms each, height 114. Save as `raw/patHair_vNN.png`. Prompt A15.

| frame | pose | face |
|---|---|---|
| f0 | L hand fluffing the top curls of his hair, chin up, microphone at his chest. | proud grin |
| f1 | L hand patting the side curls, a white glint on the sunglasses. | smug closed-mouth smile |

## sooty

2 frames, loop, 200 ms each, height 116. Save as `raw/sooty_vNN.png`. Prompt A16.

| frame | pose | face |
|---|---|---|
| f0 | Standing stiff, arms at his sides, face and suit blackened with soot, hair frizzed into a puffed, singed mop with two thin grey smoke wisps rising from it, tie frayed, sunglasses still on (eyes hidden). | coughing a small grey puff |
| f1 | Same, the smoke wisps shifted, one shoulder dropped, a cough. | mouth open, teeth showing white in the soot |

QA: soot uses the outline and suit darks; smoke wisps only in the two smoke greys; still clearly him (hair shape, glasses).

## wince

2 frames, loop, 180 ms each, height 106. Save as `raw/wince_vNN.png`. Prompt A17.

| frame | pose | face |
|---|---|---|
| f0 | Hunched, both hands over his sunglasses with the fingers spread, peeking through them toward the right; microphone still in the R hand. | teeth gritted in a cringe |
| f1 | Recoiled a little further, one knee lifted toward his chest. | same cringe, mouth stretched |

## mopBrow

2 frames, loop, 400 ms each, height 108. Save as `raw/mopBrow_vNN.png`. Prompt A18.

| frame | pose | face |
|---|---|---|
| f0 | Tired slouch, wiping his forehead with a white handkerchief in the L hand, microphone hanging in the R hand, one small blue sweat drop flying off. | panting, mouth open |
| f1 | The handkerchief lowered to his cheek, shoulders dropping. | exhausted sigh |
