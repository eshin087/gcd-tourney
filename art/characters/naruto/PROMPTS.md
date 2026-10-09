# Naruto: ChatGPT prompts (generation order)

> Copy-paste prompts for the ChatGPT image generator, in the order to run them. Each prompt is
> self-contained. The poses are the same as [ANIMATIONS.md](ANIMATIONS.md), described in words.
> Look, palette and fallback wording: [CHARACTER.md](CHARACTER.md). Pipeline and QA:
> [art/PIPELINE.md](../../PIPELINE.md). If anything here disagrees with [art/SPEC.md](../../SPEC.md),
> SPEC.md wins.

## How to use (user + Codex)

1. **One chat per character.** Name it "GCD Naruto sprites" and keep running the Naruto prompts in
   it, so the model keeps the design in context. Start a fresh chat (re-attach the references; every
   prompt below is self-contained) when it drifts or after about 6 strips.
2. **Run S1 and S2 first** (model sheet, expressions). Regenerate until the design is right, then
   save the keepers into `art/characters/naruto/reference/` (names below). Everything after that
   **attaches** `reference/model_sheet.png`, and from A02 on also `reference/idle_approved.png`.
3. **Run the strips in `step` order** (the index below = `art/manifest.json` steps). A01–A23 are the CORE set: the game switches to the new art only when
   all of them are packed. A24–A38 are optional polish.
4. **Save exactly as listed** ("Save as"). One strip per animation: `raw/<anim>.png`. Don't rename
   frames and don't crop. Codex and the packer do that.
5. **Pack and check:** `npm run sprites naruto`, then open the Sprite Lab
   (http://127.0.0.1:5188/sprites.html) and check the QA notes in ANIMATIONS.md. Codex updates
   `art/TRACKER.md` and `art/manifest.json` (`todo → raw → packed → approved`).
6. **If ChatGPT refuses** a prompt that names the character: replace the `CHARACTER:` line with the
   fallback below, and swap the technique names using the replacement table in CHARACTER.md §9
   (Rasengan → "a swirling sphere of blue wind-energy held in his open palm", and so on). Never name
   the original artist.
7. **If a 7–8 frame strip comes out cramped** (tiny figures, overlapping limbs), split it: send the
   same prompt twice, keeping only frames 1–4 in the first message and frames 5–8 in the second,
   and add "This is part 1 of 2 (part 2 of 2) of one strip: keep exactly the same character scale as
   part 1." Save as `raw/_parts/<anim>_A.png` and `raw/_parts/<anim>_B.png` (attach part A when
   asking for part B); Codex stitches them into `raw/<anim>.png` per PIPELINE "Long strips (parts)".
8. **One bad frame in a good strip:** use fix prompt F1 at the bottom instead of regenerating the
   whole strip.

### Fallback CHARACTER line (no names)

```text
CHARACTER: an original anime fan-art ninja boy, about 12 years old, scrappy and cocky, with a huge mass of thick spiky bright golden-blond hair that sticks out in every direction, big bright blue eyes, three thin whisker-like marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
```

## Index

Run the prompts top to bottom: `step` is the generation order from `art/manifest.json` (the same
steps as art/PIPELINE.md "Generation order" and art/TRACKER.md). Codex picks the lowest `step` whose
status is `todo`.

| step | id | asset | frames | CORE | save as |
|---|---|---|---|---|---|
| 1 | S1 | model sheet (turnaround + stance + swatches) | | | `reference/model_sheet.png` |
| 2 | S2 | expression sheet | | | `reference/expressions.png` |
| 3 | A01 | `idle`: fighting stance (breathing loop) | 8 | **CORE** | `raw/idle.png` |
| 4 | A02 | `run`: ninja run (loop) | 8 | **CORE** | `raw/run.png` |
| 5 | A03 | `light1`: jab with the lead (L) fist | 7 | **CORE** | `raw/light1.png` |
| 5 | A04 | `light2`: rear straight with the R (near) fist | 7 | **CORE** | `raw/light2.png` |
| 5 | A05 | `light3`: front push-kick with the R (rear) leg | 7 | **CORE** | `raw/light3.png` |
| 5 | A06 | `light4`: spinning roundhouse finisher with the R leg | 8 | **CORE** | `raw/light4.png` |
| 5 | A07 | `heavy`: rising uppercut launcher with the R fist | 8 | **CORE** | `raw/heavy.png` |
| 5 | A08 | `airLight1`: mid-air jab with the L fist | 5 | **CORE** | `raw/airLight1.png` |
| 5 | A09 | `airHeavy`: double-fist hammer spike | 6 | **CORE** | `raw/airHeavy.png` |
| 6 | A10 | `guard`: cross-arm block (loop) | 2 | **CORE** | `raw/guard.png` |
| 6 | A11 | `hurtHigh`: hit in the face | 3 | **CORE** | `raw/hurtHigh.png` |
| 6 | A12 | `launched`: knocked flying backward (loop) | 2 | **CORE** | `raw/launched.png` |
| 6 | A13 | `down`: slammed down, then lying on the back | 2 | **CORE** | `raw/down.png` |
| 6 | A14 | `getup`: kip-up | 5 | **CORE** | `raw/getup.png` |
| 7 | A15 | `charge`: powering up (loop) | 4 | **CORE** | `raw/charge.png` |
| 7 | A16 | `beamCharge`: charging the Rasen Cannon (loop) | 3 | **CORE** | `raw/beamCharge.png` |
| 7 | A17 | `beamFire`: firing the Rasen Cannon (loop) | 3 | **CORE** | `raw/beamFire.png` |
| 7 | A18 | `special`: RASENGAN rush | 8 | **CORE** | `raw/special.png` |
| 8 | A19 | `dash`: low forward dash (loop) | 2 | **CORE** | `raw/dash.png` |
| 8 | A20 | `jumpUp`: rising (loop) | 2 | **CORE** | `raw/jumpUp.png` |
| 8 | A21 | `jumpFall`: falling (loop) | 2 | **CORE** | `raw/jumpFall.png` |
| 8 | A22 | `land`: landing | 2 | **CORE** | `raw/land.png` |
| 8 | A23 | `win`: fist-pump victory (loop) | 4 | **CORE** | `raw/win.png` |
| 9 | A24 | `backDash`: quick hop backward | 3 |  | `raw/backDash.png` |
| 9 | A25 | `superDash`: homing super dash, flying like a missile (loop) | 2 |  | `raw/superDash.png` |
| 9 | A26 | `jumpSquat`: pre-jump crouch | 1 |  | `raw/jumpSquat.png` |
| 9 | A27 | `airLight2`: mid-air front kick with the R leg | 5 |  | `raw/airLight2.png` |
| 9 | A28 | `airLight3`: mid-air spinning kick with the L leg | 6 |  | `raw/airLight3.png` |
| 9 | A29 | `block`: pushed back while blocking | 2 |  | `raw/block.png` |
| 9 | A30 | `hurtLow`: hit in the stomach | 3 |  | `raw/hurtLow.png` |
| 9 | A31 | `spin`: tumbling backward (loop) | 4 |  | `raw/spin.png` |
| 9 | A32 | `airRecover`: mid-air backflip recovery | 3 |  | `raw/airRecover.png` |
| 9 | A33 | `throw`: mid-air shuriken throw (R hand) | 4 |  | `raw/throw.png` |
| 9 | A34 | `vanish`: crouch before teleporting | 2 |  | `raw/vanish.png` |
| 9 | A35 | `stagger`: dizzy stagger (loop) | 4 |  | `raw/stagger.png` |
| 9 | A36 | `ko`: knocked out | 1 |  | `raw/ko.png` |
| 9 | A37 | `intro`: shadow-clone hand seal (loop) | 4 |  | `raw/intro.png` |
| 9 | A38 | `taunt`: pointing "Believe it!" taunt (loop) | 2 |  | `raw/taunt.png` |
| 11 | U1 | portrait 96×96 | | | `ui/portrait.png` |
| 11 | U2 | super cut-in eye strip 480×128 | | | `ui/cutin.png` |
| 11 | U3 | character select art 384×384 | | | `ui/select.png` |

All paths are relative to `art/characters/naruto/`.

---

## S1 · Model sheet

Attach: nothing the first time (optionally your own earlier attempts). Save as: `reference/model_sheet.png`.

```text
Character model sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.

Draw the same character 5 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear gaps between them:
1. front view, relaxed neutral stand, arms slightly away from the body;
2. 3/4 view facing RIGHT (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), relaxed neutral stand;
3. side view facing RIGHT (full profile);
4. back view: show the navy-black upper back with a red spiral emblem centered between the shoulder blades, and the headband knot with two long navy tails;
5. 3/4 view facing RIGHT in his fighting stance: left foot forward, right foot back, feet wider than the shoulders, knees bent, left fist up at chin height, right fist guarding the right cheek, cocky half-smirk.
Below the figures, one row of 31 small square color swatches (no text), one per palette color, in the palette order listed below.

PROPORTIONS: about 4.3 heads tall, round youthful face, compact torso, sturdy legs; the spiky hair adds about 40 percent of a head on top. Whisker marks: three thin lines on each cheek, always visible.
SIZE: pixel art drawn at 2x: every art pixel is a 2x2 block, and the standing body is about 270 px tall on the canvas.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no labels, no ground shadow, no floor.
```

Check before saving: blond spikes in every direction (not swept back), navy (not black) headband
with long tails, whiskers on both cheeks, orange jumpsuit with a navy-black yoke and big white
collar, blue sandals, right-thigh holster. Codex writes what changed between attempts in
`reference/notes.md`.

## S2 · Expression sheet

Attach: `reference/model_sheet.png`. Save as: `reference/expressions.png`.

```text
Expression sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet exactly (same face shape, hair spikes, headband, whisker marks and colors).

Draw 9 head-and-shoulders close-ups in a 3x3 grid on a 1024x1024 square canvas, every head facing RIGHT in 3/4 view (both eyes visible), all at the same scale, with clear gaps between them:
1. cocky half-smirk (one mouth corner up, confident eyes) - his default face;
2. focused (brows down, eyes narrowed, mouth closed);
3. angry (brows hard down, teeth gritted and showing);
4. shouting (mouth wide open showing teeth and dark mouth interior, brows down, intense eyes);
5. huge toothy grin with the eyes closed in happy arcs;
6. pain (eyes squeezed shut, teeth gritted);
7. gasp (eyes wide with tiny pupils, mouth open);
8. dizzy (comedic spiral swirl eyes, mouth hanging open);
9. knocked out (eyes closed as lines, mouth slightly open, relaxed brows).
Eyes: bright blue iris (#2f86ec) with a darker upper half (#1a3f8e), dark pupil, one white catch-light pixel. Three thin whisker marks on each cheek in every face.
SIZE: pixel art drawn at 4x: every art pixel is a 4x4 block.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything. No text, no numbers, no labels.
```

---

## Animation strips

Attach to every strip prompt: `reference/model_sheet.png` and, from A02 on,
`reference/idle_approved.png`. For a strip that continues another (`light2` after `light1`, the
air attacks, `getup` after `down`), also attach that approved strip.

**Step 3 · idle**

### A01 · `idle`: fighting stance (breathing loop) (CORE)

8 frames, loops. Save as: `raw/idle.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle). **After approval, Codex also copies it to `reference/idle_approved.png`.** Attach that file to every later prompt.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet exactly: same face, whisker marks, hair spikes, headband, outfit, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", fighting stance (breathing loop). 8 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. KEY POSE. Orthodox stance: left (lead) foot forward with the toes pointing right, right foot back and turned out 45°, feet wider than the shoulders, knees bent about 25°, weight centered. Torso leans slightly forward, chest turned about 35° toward the viewer. Left fist up in front at chin height, elbow down. Right fist guards beside the right cheek and collar. Face: cocky half-smirk, eyes locked on the opponent (right), brows slightly lowered. Hair/headband tails: neutral; headband tails hang down behind the head.
2. Exhale: knees bend a little more, shoulders and both fists drop slightly. Face: smirk. Hair/headband tails: spikes still at frame 1 height (lag); tails swing slightly left.
3. Lowest point: knees bent the most, torso sunk lowest, fists lowest, chest slightly compressed. Face: smirk. Hair/headband tails: spikes drop slightly.
4. Hold the lowest point; shoulders roll forward a touch. Face: smirk. Hair/headband tails: spikes settle slightly down (follow-through); tails at their furthest left.
5. Inhale: body rises (knees straighten a little), fists rise. Face: smirk. Hair/headband tails: spikes still low (lag).
6. Back to frame 1 height, chest lifted slightly. Face: smirk. Hair/headband tails: spikes rise; tails swing back.
7. Same as frame 1, but the left fist twitches forward slightly, a tiny "ready" flex. Face: smirk, eyes slightly narrower. Hair/headband tails: spikes slightly above neutral (overshoot).
8. Same as frame 1 (flows straight back into frame 1). Face: smirk. Hair/headband tails: spikes and tails back to the frame 1 position.
MOTION: A small breathing bob done with the knees only (feet never move). Hair spikes lag the body by one frame. Headband tails hang behind the head and sway gently.

LAYOUT: one single horizontal row of exactly 8 poses on a 1536x1024 landscape canvas. Split the width into 8 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 4 · run**

### A02 · `run`: ninja run (loop) (CORE)

8 frames, loops. Save as: `raw/run.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#run).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "run", ninja run. 8 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Contact: left foot reaching forward, heel touching down well ahead of the hips; right leg extended far back, toes pushing off. Arms straight back. Face: focused, mouth closed.
2. Down: left foot flat under the hips, left knee bent about 45° absorbing the weight; right leg swinging forward with the knee bent and the foot high behind. Body at its lowest. Arms slightly lower. Face: focused.
3. Passing: right knee drives forward past the left leg up to hip height; left leg straightening behind and pushing off; body rising. Face: focused.
4. Flight: both feet off the ground; right thigh horizontal in front, left leg extended straight back with pointed toes; longest stride. Arms slightly higher. Face: focused, mouth slightly open.
5. Contact (mirror of frame 1): right foot reaching forward to touch down; left leg extended back, pushing off. Face: focused.
6. Down (mirror of frame 2): right foot flat under the hips, knee bent; left leg swinging forward, foot high behind. Arms slightly lower. Face: focused.
7. Passing (mirror of frame 3): left knee drives forward to hip height; right leg pushing off behind. Face: focused.
8. Flight (mirror of frame 4): left thigh horizontal in front, right leg extended back. Flows back into frame 1. Face: focused, mouth slightly open.
MOTION: Torso pitched forward about 40° for the whole cycle, head raised and looking ahead. Both arms stay extended straight back behind the body, slightly raised, hands open and flat with fingers together; they bob up and down slightly. Hips stay over the midpoint between the feet. Hair and headband tails stream straight back (left) the whole time, tails waving up and down; jacket hem flaps back.

LAYOUT: one single horizontal row of exactly 8 poses on a 1536x1024 landscape canvas. Split the width into 8 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 5 · core attacks**

### A03 · `light1`: jab with the lead (L) fist (CORE)

7 frames, phases 2/2/3. Save as: `raw/light1.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light1).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light1", jab with the lead (left) fist. 7 frames, left to right. Frames 3 to 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. Anticipation: left fist pulls back toward the chin, shoulders turn slightly toward the viewer (coiling), weight shifts onto the right (rear) leg. Face: eyes narrowed, focused.
2. The left arm starts to fire: elbow rising to shoulder height and pointing forward, fist halfway out; left shoulder rolling forward, torso turning to lead with the left side; right fist still guarding the cheek. Face: angry, teeth gritted.
3. IMPACT: left arm fully extended horizontally at shoulder height, fist clenched with the knuckles forward; left shoulder raised to protect the chin; torso turned so the left side leads, leaning forward about 12°; left foot slid forward, right heel lifted; right fist guarding the jaw. Face: angry, mouth open in a short shout. SMEAR: the left forearm is stretched into a short, solid, tapered orange-and-skin streak behind the fist (hard pixels, no blur).
4. Hold the extension (fist slightly back from frame 3), clean arm without smear; sleeve folds snapped forward. Face: angry.
5. Retract: left elbow bends to about 90°, fist pulled halfway back; torso starts turning back. Face: angry.
6. Fist almost back at the chin, left foot sliding back, weight re-centering. Face: focused.
7. Back in the stance (same as idle frame 1). Face: cocky smirk.
MOTION: Hair spikes jolt slightly forward on frame 3 and settle on frame 5. Tails whip slightly on frame 3.

LAYOUT: one single horizontal row of exactly 7 poses on a 1536x1024 landscape canvas. Split the width into 7 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A04 · `light2`: rear straight with the R (near) fist (CORE)

7 frames, phases 2/2/3. Save as: `raw/light2.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light2).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light2", rear straight with the right (near) fist. 7 frames, left to right. Frames 3 to 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. Wind-up: right fist cocked back beside the right ear, elbow back; torso twists further toward the viewer (right shoulder back); weight on the right (rear) leg; left fist guarding forward. Face: focused.
2. Hips rotate first: right heel starts to lift, right elbow drives forward at chest height with the fist passing the chest; left arm begins pulling back toward the chest. Face: angry.
3. IMPACT: right arm fully extended straight forward at chest height, knuckles forward; torso rotated so the chest squares to the right side of the image and the right shoulder leads, leaning forward about 16°; right heel up, pivoting on the ball of the foot; left fist pulled back tight to the left chest. Face: angry shout, mouth wide. SMEAR: a short, solid, stretched streak behind the right forearm.
4. Hold (fist slightly back), no smear. Face: angry.
5. Right arm retracting, elbow bent, fist halfway back; torso unwinding. Face: angry.
6. Right fist returning to the cheek; right heel down. Face: focused.
7. Back in the stance. Face: smirk.
MOTION: Tails whip on frame 3; hair follow-through on frame 4.

LAYOUT: one single horizontal row of exactly 7 poses on a 1536x1024 landscape canvas. Split the width into 7 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A05 · `light3`: front push-kick with the R (rear) leg (CORE)

7 frames, phases 2/2/3. Save as: `raw/light3.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light3).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light3", front push-kick with the right (rear) leg. 7 frames, left to right. Frames 3 to 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. Weight shifts onto the left (lead) leg, which straightens; right heel lifts; arms tighten into the guard. Face: focused.
2. Chamber: right knee lifted to belly height in front, shin hanging down, foot flexed; torso leaning back slightly; left fist guarding forward, right arm swinging back a little for balance. Face: angry.
3. IMPACT: right leg thrust straight forward, horizontal at stomach height, the sole of the sandal facing the target (push kick); torso leaning back about 18°; left (support) leg straight and planted on the baseline; left fist guarding the chin, right arm flung back for balance. Face: angry shout. SMEAR: solid orange arc trailing below and behind the shin.
4. Hold the extension (foot slightly back), no smear; pant leg rippling. Face: angry.
5. Re-chamber: knee bends, foot pulled back halfway. Face: angry.
6. Right foot stepping down behind into the rear position, torso coming upright. Face: focused.
7. Back in the stance. Face: smirk.
MOTION: Pant leg ripples on frame 4; tails swing forward on frame 3 as the torso leans back.

LAYOUT: one single horizontal row of exactly 7 poses on a 1536x1024 landscape canvas. Split the width into 7 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A06 · `light4`: spinning roundhouse finisher with the R leg (CORE)

8 frames, phases 3/2/3. Save as: `raw/light4.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light4).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light4", spinning roundhouse finisher with the right leg. 8 frames, left to right. Frames 4 to 5 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. Wind-up: knees bend, torso twists toward the viewer (coil), right shoulder back, arms tucked near the chest, weight on the left (lead) foot. Face: determined grin.
2. Spin starts: pivoting on the left foot, the body turns away from the viewer so we see his right side and the navy upper back; right heel lifting behind. Face: eyes visible over the shoulder.
3. Mid-spin: back toward the viewer (navy-black upper back and red spiral emblem visible), head turned to look over the left shoulder toward the right side of the image, right knee chambered high at hip level, arms tucked. Face: one eye visible, fierce.
4. IMPACT: the body has come round to face the right side of the image again; right leg whipping horizontally at HEAD height, fully extended, instep and shin leading; torso leaning back about 28° away from the kick; left support leg straight; left arm swung forward-low and right arm flung back for balance. Face: shout. SMEAR: big solid crescent in the leg colors (orange, blue) sweeping behind the leg.
5. Hold the extension, smear gone. Face: shout.
6. Leg dropping and folding at the knee, torso coming upright. Face: focused.
7. Right foot lands behind, knees bent low, arms returning toward the guard. Face: focused.
8. Back in the stance. Face: smirk.
MOTION: Headband tails whip around with the spin: in front of the body on frame 3, trailing far right after the kick on frame 5. Hair spikes squash toward the spin direction on frame 4.

LAYOUT: one single horizontal row of exactly 8 poses on a 1536x1024 landscape canvas. Split the width into 8 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A07 · `heavy`: rising uppercut launcher with the R fist (CORE)

8 frames, phases 3/2/3. Save as: `raw/heavy.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#heavy).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "heavy", rising uppercut launcher with the right fist. 8 frames, left to right. Frames 4 to 5 are the HIT frames. On the HIT frames the right fist rises IN FRONT of the face: frame 4 at the opponent's chin height with the elbow bent, frame 5 overhead but still in front of the face; on frame 4 nothing reaches further right than the fist. Head, hair and headband tails stay behind it.
1. Anticipation crouch: knees bend deep, torso pitched forward about 24° and turned toward the viewer, right fist dropped low behind the right hip (cocked), left fist guarding forward at chest height. Face: focused, brows down.
2. Deepest squash: knees about 90°, right fist at its lowest near the right knee, eyes looking up at the target's chin. Face: angry.
3. The explosion begins: legs straightening, right fist rising forward past the belt, torso starting to rise. Face: angry, mouth opening.
4. IMPACT: stepping in and leaning into the target while rising onto the toes (heels off the ground); right upper arm driving forward with the elbow bent about 90° and the forearm nearly vertical, so the fist rises at chin height well IN FRONT of his body (a true uppercut, not a straight punch), knuckles toward him; left arm pulled down and back to the hip. Face: shout. SMEAR: solid tapered streak below and behind the fist, following its upward arc.
5. Follow-through: torso straightening and leaning back slightly, right arm extending up-forward at about 65°, fist above his head but still in front of his face; fully stretched on tiptoes. Face: shout.
6. Peak: right arm nearly vertical, fist only just above the hair tips; body fully stretched, legs together. Face: shout, eyes closed.
7. Coming down: knees bending, right arm lowering to shoulder height. Face: focused.
8. Back in the stance. Face: smirk.
MOTION: Hair spikes and tails flick UP on frames 4–6 and drop on frames 7–8.

LAYOUT: one single horizontal row of exactly 8 poses on a 1536x1024 landscape canvas. Split the width into 8 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A08 · `airLight1`: mid-air jab with the L fist (CORE)

5 frames, phases 1/2/2. Save as: `raw/airLight1.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight1).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airLight1", mid-air jab with the left fist. 5 frames, left to right. Frames 2 to 3 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. From the air base pose: left fist pulled back to the chin, shoulders coiling toward the viewer. Face: focused.
2. IMPACT: left arm fully extended horizontally at shoulder height; torso turned to lead with the left side, leaning forward about 10°; right fist guarding the jaw; legs stay tucked. Face: angry shout. SMEAR: solid streak behind the left forearm.
3. Hold the extension, no smear. Face: angry.
4. Left arm retracting, elbow bent. Face: focused.
5. Back to the air base pose. Face: focused.
MOTION: Tails trail behind and slightly down; hair jolts forward slightly on frame 2.
AIR BASE POSE: left knee tucked high in front, right knee lower and slightly behind, torso upright leaning slightly forward, both fists in a loose guard at chest height.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A09 · `airHeavy`: double-fist hammer spike (CORE)

6 frames, phases 2/2/2. Save as: `raw/airHeavy.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airheavy).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airHeavy", double-fist hammer spike. 6 frames, left to right. Frames 3 to 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. Wind-up: both arms raised overhead, fists clasped together (one hand wrapped over the other fist) above and slightly behind the head; torso arched back about 20°; knees tucked. Face: shout.
2. Maximum wind-up: clasped fists further behind the head, body bent back like a bow, legs folded back under him. Face: shout, eyes wide.
3. IMPACT: body jackknifes forward about 40°; both straight arms smash the clasped fists down-forward at 45°; legs trailing back and down (the right foot is the lowest point). Face: shout. SMEAR: large solid crescent above and behind the arms, tracing the overhead-to-down arc.
4. Hold the smash, no smear. Face: shout.
5. Arms rising back to chest height, body uncurling. Face: focused.
6. Back to the air base pose. Face: focused.
MOTION: Hair and tails lift on the wind-up and slam down-forward on frame 3.
AIR BASE POSE: left knee tucked high in front, right knee lower and slightly behind, torso upright leaning slightly forward, both fists in a loose guard at chest height.

LAYOUT: one single horizontal row of exactly 6 poses on a 1536x1024 landscape canvas. Split the width into 6 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 6 · reactions**

### A10 · `guard`: cross-arm block (loop) (CORE)

2 frames, loops. Save as: `raw/guard.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#guard).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "guard", cross-arm block. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Cross block: both forearms raised and crossed in an X in front of the face (wrists crossing in front of the nose, fists closed, right forearm in front), elbows tucked to protect the ribs; torso hunched forward about 12°; head ducked so the eyes peek over the forearms; knees bent wide and braced. Face: angry glare over the arms.
2. Same, slightly lower with the knees slightly deeper (breathing). Face: angry glare.
MOTION: Tails sway slightly between frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A11 · `hurtHigh`: hit in the face (CORE)

3 frames. Save as: `raw/hurtHigh.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurthigh).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "hurtHigh", hit in the face. 3 frames, left to right.
1. IMPACT: head snapped back hard (chin up about 30°), torso bent back about 24°, both arms flung back and out (right arm wide behind, left arm up), knees buckling, feet still planted. Face: eyes squeezed shut, mouth open in a grimace. Hair/headband tails: spikes and tails whip forward.
2. Recoil continues: head still back but a little less, arms dropping, torso leaning back about 20°. Face: one eye squinting, teeth gritted.
3. Starting to recover: head coming forward, torso back about 16°, arms coming down toward the guard. Face: pained, eyes open.
MOTION: The head snaps back (left), so the hair spikes and tails whip forward (right) on frame 1 and fall back on frames 2–3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A12 · `launched`: knocked flying backward (loop) (CORE)

2 frames, loops. Save as: `raw/launched.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#launched).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "launched", knocked flying backward. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Knocked flying back toward the left side of the image: whole body tilted back about 55° (head toward the upper-left, feet toward the right), back arched, both arms flung up and back past the head, legs trailing forward and bent at the knees. Face: eyes shut, mouth open (pain). Hair/headband tails: hair and tails stream right.
2. Same, tilted 6° more, arms and legs flailing into an alternate position (left arm higher, right knee bent more). Face: pain. Hair/headband tails: tails flutter to a second shape.
MOTION: He flies left, so hair and tails stream to the right.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A13 · `down`: slammed down, then lying on the back (CORE)

2 frames. Save as: `raw/down.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#down).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "down", slammed down, then lying on the back. 2 frames, left to right.
1. Ground impact: lying on his back, head toward the left side of the image and feet toward the right side of the image; his back has slammed into the floor but the shoulders and legs bounce up about 18° from flat; arms flung out wide. Face: eyes squeezed shut, mouth open.
2. Lying flat on the back: arms out to the sides, left knee slightly raised, head turned toward the viewer. Face: eyes closed, dazed.
MOTION: Hair spikes splay out on the floor; tails flung up on frame 1 and lying flat on frame 2.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A14 · `getup`: kip-up (CORE)

5 frames. Save as: `raw/getup.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#getup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "getup", kip-up. 5 frames, left to right.
1. Lying on the back (head left, feet right), knees pulled up to the chest, palms planted on the floor beside the head (fingers pointing toward the shoulders). Face: angry, eyes open.
2. Legs kick up and over: rocked back onto the shoulders, hips high, legs pointing up-right. Face: angry.
3. Spring: body launched up off the hands, torso tilted back about 40°, legs tucked underneath, arms out. Face: angry shout.
4. Lands in a crouch (squash): knees deep, feet planted in the stance, arms coming up to the guard. Face: focused.
5. Back in the stance. Face: smirk.
MOTION: Tails follow one frame behind the body; hair squashes on frame 4.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 7 · specials**

### A15 · `charge`: powering up (loop) (CORE)

4 frames, loops. Save as: `raw/charge.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#charge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "charge", powering up. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Powering up: wide stance (feet well apart, knees bent about 35°), fists clenched at his sides pushed down and slightly out, elbows slightly bent, chest out, torso arched back about 10°, head tilted up, shouting. Face: shout, eyes intense and narrowed. Hair/headband tails: spikes and tails blown up.
2. Same, whole body trembling slightly to the left; arms flexed slightly further out. Face: shout. Hair/headband tails: second flicker shape.
3. Same as frame 1 (tremble right). Face: shout. Hair/headband tails: first flicker shape.
4. Same as frame 2. Face: shout. Hair/headband tails: second flicker shape.
MOTION: An updraft blows the hair spikes and headband tails UP; they flicker between two shapes.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A16 · `beamCharge`: charging the Rasen Cannon (loop) (CORE)

3 frames, loops. Save as: `raw/beamCharge.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamcharge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "beamCharge", charging the Rasen Cannon. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Low wide stance (left leg forward and bent, right leg back); torso twisted away toward the viewer (about 36°); both hands cupped together at the right (rear) hip, palms facing each other as if holding a ball, but EMPTY (no energy drawn); elbows bent back; head turned toward the target (the right side of the image). Face: shout.
2. Same, trembling slightly, hands slightly further apart. Face: shout. Hair/headband tails: second flicker shape.
3. Same, trembling back. Face: shout.
MOTION: Hair spikes and tails blown upward and back.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A17 · `beamFire`: firing the Rasen Cannon (loop) (CORE)

3 frames, loops. Save as: `raw/beamFire.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamfire).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "beamFire", firing the Rasen Cannon. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Firing: both arms thrust straight forward horizontally at chest height, heels of the palms together, palms open and facing the target, fingers spread; wide braced stance (left leg forward and bent, right leg straight behind pushing against the recoil); torso leaning forward about 14°; head between the arms, eyes on the target. Face: shout.
2. Same, recoil tremble: arms slightly back, rear heel slides slightly. Face: shout.
3. Same, tremble forward. Face: shout.
MOTION: Recoil wind: hair and tails blown straight back hard.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A18 · `special`: RASENGAN rush (CORE)

8 frames, phases 3/3/2. Save as: `raw/special.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#special). Leave the palm EMPTY: the engine draws the Rasengan orb. If refused, replace "Rasengan" wording per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "special", RASENGAN rush. 8 frames, left to right. Frames 4 to 6 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. Forming: wide low stance, torso leaning forward about 16°; right hand held out in front at belt height, palm UP and cupped; left hand hovering just above it palm DOWN, fingers spread, circling over the right palm (kneading the chakra). Face: focused shout, eyes intense.
2. Still forming: the left hand has circled to the far side of the right palm; knees deeper, body leaning forward about 18°. Face: shout.
3. Ready: left hand pulled away and back; right palm now turned FORWARD, cupped as if holding a ball about the size of his head; body coiled low to sprint, left foot forward. Face: confident determined grin.
4. Rush (ninja run): torso pitched forward about 32°; right arm extended forward at waist/chest height with the cupped palm facing forward; left arm trailing straight back; legs in the run contact pose (left foot forward). Face: shout.
5. Rush: same arms, legs in the passing/flight position (right knee forward). Face: shout.
6. THRUST: short planted lunge with the left leg forward and the right leg straight behind, the palm only about a forearm's length in front of the chest; torso rotated so the right shoulder leads (chest toward the viewer); right arm fully extended palm-first into the opponent's stomach/chest; left arm flung back. Face: shout ("RASENGAN!"). SMEAR: solid streak behind the right forearm.
7. Follow-through: right arm still extended but relaxing, torso rising, weight on the front leg. Face: fierce.
8. Recovering toward the stance, right arm pulling back into the guard. Face: cocky smirk.
MOTION: Chakra wind lifts the hair and tails on frames 1–3; they stream back on frames 4–6.

LAYOUT: one single horizontal row of exactly 8 poses on a 1536x1024 landscape canvas. Split the width into 8 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 8 · rest of the core**

### A19 · `dash`: low forward dash (loop) (CORE)

2 frames, loops. Save as: `raw/dash.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#dash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "dash", low forward dash. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Torso pitched forward about 50° (chest low), head up looking at the opponent; arms trailing straight back like the ninja run but lower and closer to the body; left leg reaching far forward with the knee bent about 60°, foot skimming the ground; right leg extended straight back, toes dragging. A very long, low silhouette. Face: angry-focused, teeth just showing.
2. Same, legs a little wider apart and the right toes lifted (pushing again); arms slightly higher. Face: angry-focused. Hair/headband tails: tails flutter to a second shape.
MOTION: Hair spikes and headband tails swept flat back; jacket flapping.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A20 · `jumpUp`: rising (loop) (CORE)

2 frames, loops. Save as: `raw/jumpUp.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "jumpUp", rising. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Rising: body stretched upward; left knee pulled high in front (thigh above horizontal), right leg bent below and behind; right arm swung up-forward (fist above head height, about 35° above horizontal), left arm swung down and back; torso upright. Face: focused, mouth closed. Hair/headband tails: tails dragged down-left.
2. Same, right arm slightly higher, legs tucked slightly tighter. Face: focused. Hair/headband tails: tails flutter to a second shape.
MOTION: Air rushes past while rising: hair spikes and tails are dragged DOWN-left.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A21 · `jumpFall`: falling (loop) (CORE)

2 frames, loops. Save as: `raw/jumpFall.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpfall).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "jumpFall", falling. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Falling: legs extending down toward the floor, left leg in front slightly bent, right leg behind and straighter, toes pointing down; both arms spread out sideways for balance (right arm forward and up, left arm back), elbows soft; torso upright. Face: focused, looking down-forward. Hair/headband tails: tails lifted up.
2. Same, arms slightly higher and feet slightly further apart. Face: focused. Hair/headband tails: tails flutter to a second shape.
MOTION: Falling: hair spikes and headband tails float UP.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A22 · `land`: landing (CORE)

2 frames. Save as: `raw/land.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#land).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "land", landing. 2 frames, left to right.
1. Impact squash: knees deeply bent, feet planted wide (left forward, right back), torso pitched forward about 20°, arms flung out low to the sides for balance, head tucked. Face: eyes half closed, teeth gritted (impact). Hair/headband tails: spikes squashed slightly, tails slap down.
2. Rising halfway back to the stance: knees bent about 40°, arms coming back up toward the guard, head up. Face: focused. Hair/headband tails: spikes rebound slightly.
MOTION: Squash and settle: hair spikes squash down slightly on frame 1, rebound slightly on frame 2; tails slap down.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A23 · `win`: fist-pump victory (loop) (CORE)

4 frames, loops. Save as: `raw/win.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#win).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "win", fist-pump victory. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Chamber: right fist pulled down to the chest, elbow bent down, knees dipping slightly; left fist clenched low at his side. Face: big grin, eyes squinting.
2. Pump: right arm punches straight up overhead; body stretched up on the toes. Face: mouth wide open shouting ("Yosh!").
3. Hold the raised fist. Face: eyes closed in happy arcs, huge grin. Hair/headband tails: spikes bounce up slightly.
4. Arm lowering slightly (fist at head height), settling. Flows back into the chamber. Face: grin.
MOTION: Hair spikes bounce up slightly on frame 3; tails swing.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 9 · optional**

### A24 · `backDash`: quick hop backward

3 frames. Save as: `raw/backDash.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#backdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "backDash", quick hop backward. 3 frames, left to right.
1. Push-off: weight on the left (lead) foot, which shoves backward; torso upright and leaning back slightly; right leg already lifting behind; arms in a tight guard close to the chest. Face: alert, eyes on the opponent.
2. Airborne hop backward: both knees tucked (left knee higher), torso leaning back, arms opening a little for balance (left arm forward, right arm back and down). Face: focused. Hair/headband tails: hair and tails flow forward (right).
3. Descending: legs extending down to land, right (rear) foot reaching back and down for the landing, left leg slightly bent in front; arms returning to the guard. Face: smirk. Hair/headband tails: tails dropping back behind the head.
MOTION: He moves left, so hair and tails flow forward (right) in the air.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A25 · `superDash`: homing super dash, flying like a missile (loop)

2 frames, loops. Save as: `raw/superDash.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "superDash", homing super dash, flying like a missile. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Flying horizontally toward the right side of the image: whole body almost horizontal (tilted about 70° forward); right arm thrust straight ahead past the head, fist leading; left arm tucked back along his side; head tucked between the shoulders, looking forward; legs trailing together behind, knees bent 30 to 40° so the shins angle upward. Face: angry, teeth gritted.
2. Same, knees bent a little more and the legs slightly scissored (right shin higher); left arm slightly lower. Face: angry, teeth gritted. Hair/headband tails: tails flutter to a second shape.
MOTION: Hair spikes and headband tails swept flat back (left) and fluttering between frames; jacket hem flapping.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A26 · `jumpSquat`: pre-jump crouch

1 frame. Save as: `raw/jumpSquat.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpsquat).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "jumpSquat", pre-jump crouch. 1 frame, left to right.
1. Deep crouch: knees bent about 90°, torso leaning forward, both arms swung down and back behind the hips (ready to swing up), heels down, head up looking at the target. Face: focused.
MOTION: Hair spikes compressed slightly; tails droop.

LAYOUT: one single horizontal row of exactly 1 pose on a 1024x1024 square canvas, the pose centered. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A27 · `airLight2`: mid-air front kick with the R leg

5 frames, phases 1/2/2. Save as: `raw/airLight2.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight2).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airLight2", mid-air front kick with the right leg. 5 frames, left to right. Frames 2 to 3 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. From the air base pose: right knee chambered up to the chest, torso leaning back slightly. Face: focused.
2. IMPACT: right leg extended straight forward at hip height, sole facing the target; torso leaning back about 12°; left leg hanging bent below; arms pulled back and out for balance. Face: angry shout. SMEAR: solid arc behind the shin.
3. Hold the extension, no smear. Face: angry.
4. Knee folds back toward the chest. Face: focused.
5. Back to the air base pose. Face: focused.
MOTION: Tails swing forward slightly as the torso leans back on frame 2.
AIR BASE POSE: left knee tucked high in front, right knee lower and slightly behind, torso upright leaning slightly forward, both fists in a loose guard at chest height.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A28 · `airLight3`: mid-air spinning kick with the L leg

6 frames, phases 2/2/2. Save as: `raw/airLight3.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight3).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airLight3", mid-air spinning kick with the left leg. 6 frames, left to right. Frames 3 to 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. Twist: torso and hips turn away from the viewer (more of the back shows), left knee tucked to the chest, arms tight. Face: focused.
2. Back fully toward the viewer (red spiral emblem visible), head turned looking over the shoulder at the target, both legs tucked. Face: one eye visible, fierce.
3. IMPACT: spun back round, the left leg whips out horizontally, fully extended at chest height; torso leaning back about 18°; right leg tucked underneath; arms flung wide. Face: shout. SMEAR: big solid crescent behind the leg.
4. Hold the extension, no smear. Face: shout.
5. Leg folding back in, body re-centering. Face: focused.
6. Back to the air base pose. Face: focused.
MOTION: Tails whip around with the spin, trailing far behind on frame 3.
AIR BASE POSE: left knee tucked high in front, right knee lower and slightly behind, torso upright leaning slightly forward, both fists in a loose guard at chest height.

LAYOUT: one single horizontal row of exactly 6 poses on a 1536x1024 landscape canvas. Split the width into 6 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A29 · `block`: pushed back while blocking

2 frames. Save as: `raw/block.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#block).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "block", pushed back while blocking. 2 frames, left to right.
1. Same crossed-arm guard, but the torso is pushed upright and back, head snapped down behind the arms, rear (right) foot sliding back with the heel lifted, sandals skidding. Face: eyes squeezed shut, teeth gritted. Hair/headband tails: hair and tails jolt forward.
2. Recovering into the guard pose (like guard frame 1). Face: angry.
MOTION: Hair and tails jolt forward (right) on frame 1.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A30 · `hurtLow`: hit in the stomach

3 frames. Save as: `raw/hurtLow.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurtlow).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "hurtLow", hit in the stomach. 3 frames, left to right.
1. IMPACT: doubled over forward about 40°, both arms pulled in toward the stomach (fists near the belly), knees bent, feet pushed back; head down. Face: gasp: eyes wide with tiny pupils, mouth open.
2. Still doubled over (about 34°), arms slightly lower. Face: teeth gritted, one eye shut.
3. Recovering: torso about 28°, head lifting. Face: pained.
MOTION: Hair spikes and tails flung forward and down on frame 1.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A31 · `spin`: tumbling backward (loop)

4 frames, loops. Save as: `raw/spin.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#spin).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "spin", tumbling backward. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Loose tuck (knees bent toward the chest, arms bent in front), rotated about 30° backward. Face: pain, eyes shut.
2. Same tuck rotated about 120° (back toward the floor, head to the left). Face: pain.
3. Rotated about 210° (upside down, head down). Face: pain.
4. Rotated about 300° (feet coming round over the top). Flows into frame 1. Face: pain.
MOTION: Tails trail opposite to the rotation.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A32 · `airRecover`: mid-air backflip recovery

3 frames. Save as: `raw/airRecover.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airrecover).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airRecover", mid-air backflip recovery. 3 frames, left to right.
1. Backflip starts: body curled into a ball (knees to chest, arms hugging the shins), rotated about 60° backward (head tilting toward the left side of the image). Face: eyes shut tight.
2. Upside down: the same tuck rotated about 200° (head at the bottom-left, feet up-right). Face: eyes squeezed.
3. Almost upright (about 340°): legs extending down, arms opening out to the sides, ready to land. Face: smirk, eyes open.
MOTION: Hair and tails trail opposite to the spin.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A33 · `throw`: mid-air shuriken throw (R hand)

4 frames, phases 1/1/2. Save as: `raw/throw.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#throw). The three shuriken appear only in frame 1 (in his hand). The engine draws the flying ones.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "throw", mid-air shuriken throw (right hand). 4 frames, left to right. Frame 2 is the HIT frame: the striking limb (fist, foot or palm) is fully extended and is the right-most part of the character; head, hair and headband tails stay behind it.
1. Cocked: right arm drawn back behind the head, holding three small steel four-pointed shuriken fanned between the fingers; torso twisted toward the viewer and leaning back slightly; left arm extended forward, open hand aiming at the target; legs in the air base pose. Face: smirk, one eye aiming.
2. RELEASE: right arm whipped forward to horizontal at shoulder height, hand open, palm down, fingers pointing at the target; NO shuriken in the hand anymore (the engine spawns them); torso turned forward; left arm pulled back. Face: angry shout. SMEAR: solid streak behind the right forearm.
3. Follow-through: right arm continues down-forward across the body, left arm back. Face: focused.
4. Back to the air base pose. Face: smirk.
MOTION: Tails whip forward on frame 2.
AIR BASE POSE: left knee tucked high in front, right knee lower and slightly behind, torso upright leaning slightly forward, both fists in a loose guard at chest height.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A34 · `vanish`: crouch before teleporting

2 frames. Save as: `raw/vanish.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#vanish).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "vanish", crouch before teleporting. 2 frames, left to right.
1. Quick crouch: knees bent about 60°, torso pitched forward about 20°, arms tucked close, eyes locked on the target. Face: focused, sharp.
2. Snap stretch: up on the toes, body stretched tall, arms straight down at the sides, about to blink out. Face: smirk. Hair/headband tails: hair and tails flick up.
MOTION: Hair and tails flick upward on frame 2.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A35 · `stagger`: dizzy stagger (loop)

4 frames, loops. Save as: `raw/stagger.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#stagger).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "stagger", dizzy stagger. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Dizzy wobble: standing loosely, upper body swaying to the left side of the image (rolled about 8°), head tilted the same way, arms hanging loose, knees wobbly (right knee bent inward). Face: spiral dizzy eyes, mouth hanging open.
2. Swaying back through center (upright), arms swinging. Face: spiral eyes.
3. Swaying to the right side of the image (rolled about 8° the other way), left knee bent inward. Face: spiral eyes, tongue slightly out.
4. Back through center. Flows into frame 1. Face: spiral eyes.
MOTION: Hair spikes droop slightly; tails swing with the sway.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A36 · `ko`: knocked out

1 frame. Save as: `raw/ko.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#ko).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "ko", knocked out. 1 frame, left to right.
1. Lying flat on the back like down frame 2 but completely limp: arms splayed, legs straight, head tilted toward the viewer. Head toward the left side of the image. Face: eyes closed (or comedic spiral eyes), mouth slightly open.

LAYOUT: one single horizontal row of exactly 1 pose on a 1024x1024 square canvas, the pose centered. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A37 · `intro`: shadow-clone hand seal (loop)

4 frames, loops. Save as: `raw/intro.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#intro).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "intro", shadow-clone hand seal. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Shadow-clone seal: feet planted about shoulder width (left forward), slight forward lean; both hands in front of the chest forming the cross-shaped seal: index and middle fingers of both hands extended and crossed in a "+" (right hand fingers vertical, left hand fingers horizontal), other fingers curled; elbows out. Face: determined smirk, eyes on the opponent.
2. Same, body slightly lower (breath). Face: determined smirk. Hair/headband tails: tails flip to a second shape.
3. Same as frame 1, hair spikes slightly up. Face: determined smirk.
4. Same as frame 2 with the jacket hem fluttering. Flows into frame 1. Face: determined smirk.
MOTION: Headband tails and jacket hem flapping in the wind; hair spikes bob slightly.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A38 · `taunt`: pointing "Believe it!" taunt (loop)

2 frames, loops. Save as: `raw/taunt.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#taunt).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair spikes, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "taunt", pointing "Believe it!" taunt. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Pointing: right arm thrust straight forward, index finger pointing at the opponent, left fist planted on the hip; chest out, leaning back slightly; feet planted casually. Face: huge confident grin, teeth showing.
2. Same, mouth open shouting, finger slightly higher. Face: grin, shouting.
MOTION: Hair bounce slightly on frame 2.

LAYOUT: one single horizontal row of exactly 2 poses on a 1024x1024 square canvas, each pose centered in its own half of the width, with a clear magenta gap between them. Make the character as large as fits with a margin.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. Each pose will be cut out and packed into a 192x192 game sprite where the standing body is about 135 px tall, so draw hi-res pixel art with roughly twice the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

---

## UI art

UI images are not packed into the sheet. Save each image straight into `ui/<name>.png`: the packer
removes the magenta, crops and fits it to the exact size (nearest / palette-preserving "mode"
sampling) and writes it to `public/characters/naruto/` (SPEC.md "Per-character UI images").
Optionally keep the untouched original as `raw/ui_<name>.png` (the packer skips it). Attach
`reference/model_sheet.png` and `reference/expressions.png`.

### U1 · Portrait (96×96)

Save as: `ui/portrait.png` (packed to 96×96, transparent background).

```text
Pixel-art character portrait for a fighting-game HUD (anime fan-art).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and expression sheet exactly.

Head and shoulders, facing RIGHT in 3/4 view (both eyes visible), cropped at the upper chest; the head fills most of the frame. Cocky confident half-smirk, eyes looking right toward the opponent. Whisker marks on both cheeks, headband plate with the leaf-swirl symbol clearly readable, a bit of the white collar and orange jacket at the bottom.
SIZE: a 1024x1024 square canvas showing pixel art on a 96x96 art-pixel grid (every art pixel is a crisp square block about 10x10 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### U2 · Super cut-in eye strip (480×128)

The DBFZ-style super-flash strip that slides across the screen before the Rasen Cannon. Save as:
`ui/cutin.png`. The packer removes the magenta above and below the band and fits the band to
480×128. The face fills the strip edge to edge, so there is no background to remove inside the band.

```text
Pixel-art "super move cut-in" for a fighting game (anime fan-art), an extreme close-up of the character's eyes.
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and expression sheet exactly.

On a 1536x1024 landscape canvas, draw one horizontal band 1536 px wide and 410 px tall across the middle (ratio 3.75 to 1). Inside the band: an extreme close-up of his face from just above the eyebrows to just below the nose, both eyes visible, face turned slightly toward the right. Expression: furious determination, brows hard down, bright blue eyes with tiny intense pupils and sharp white catch-lights, the three whisker marks on both cheeks, the lower edge of the steel headband plate at the very top of the band, a few blond hair spikes crossing the forehead. The face fills the band completely edge to edge.
SIZE: pixel art on a 480x128 art-pixel grid inside the band (every art pixel is a crisp square block about 3x3 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
Colors: use the palette below; the eyes may glow slightly brighter (#ffffff catch-lights), still with hard pixels.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a.
BACKGROUND: flat solid magenta #FF00FF above and below the band only. No text, no speed lines, no borders.
```

### U3 · Character select art (384×384)

Save as: `ui/select.png` (packed to 384×384, transparent background). The
Rasengan **is** allowed here (UI art, not a sprite).

```text
Pixel-art full-body character select illustration for a fighting game (anime fan-art).
CHARACTER: Naruto Uzumaki in his Part 1 (genin) outfit, drawn as an anime fan-art sprite: a scrappy 12-year-old ninja boy with a huge mass of thick spiky bright golden-blond hair sticking out in every direction, big bright blue eyes, three thin whisker marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals.
Match the attached model sheet and expression sheet exactly.

Dynamic hero pose facing RIGHT in 3/4 view: low wide stance, right arm thrust forward holding a glowing, swirling sphere of blue wind-chakra (a Rasengan: blue #3a7cf0 and #7ab8ff with white #e8f6ff swirl bands, hard-edged pixels, no blur) in his open palm, left fist clenched back at his hip, headband tails and jacket hem blowing back, big determined grin. The whole body fits inside the frame with a small margin.
SIZE: a 1024x1024 square canvas showing pixel art on a 384x384 art-pixel grid (every art pixel is a crisp square block, about 2.7x2.7 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow. 1-pixel dark outline (#1d1420). 3 to 4 tone flat cel shading, key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these colors): outline #1d1420; skin #ffe2c6 #f8c69b #d98a66, whiskers #b9704f; hair #fff6c2 #ffe36a #ffc935 #e0861c; orange jumpsuit #ffac48 #f88320 #c44d14; navy-black shoulders #474a72 #2b2c42 #17182a; white collar #ffffff #f1eef6 #bbb5cc; sandals #5a88e2 #2d55b4 #1b3376; headband cloth #3e4fa0 #25306e #141a46; headband plate #e4eaf4 #b8c2d2 #76829a; eyes #2f86ec #1a3f8e; mouth #5a1a22; back spiral #c8282a. Plus for the sphere only: #3a7cf0 #7ab8ff #e8f6ff.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no logo, no ground shadow.
```

---

## Fix-up prompts

### F1 · Redraw one frame

Attach the strip that has the bad frame. Save as `raw/<anim>_fixNN.png` (NN = the frame's file
number, 00-based; the packer skips `*_fixNN.png` files). Codex removes the background, scales it to the same head size as its neighbours
and replaces `frames/<anim>/<anim>_NN.png`, then re-runs `npm run sprites naruto`. Files in
`frames/` win over `raw/`.

```text
Using the attached sprite strip, redraw ONLY frame <N> as a single pose on a 1024x1024 flat solid magenta (#FF00FF) canvas, at exactly the same character scale, design and palette as the other frames. Fix: <describe the problem, e.g. "the left fist must be fully extended horizontally toward the right; it is the right-most point of the character">. Keep everything else about the pose identical. Facing right, 3/4 view, crisp hard pixels, no anti-aliasing, no text, no ground shadow.
```

### F2 · Character drifted off-model

```text
In the attached strip the character drifted from the attached model sheet: <list, e.g. "headband is black instead of navy blue", "whisker marks missing in frames 4-6", "hair spikes swept back instead of sticking out in every direction", "jacket turned red">. Redraw the whole strip with exactly the same poses, fixing only those details. Same layout, scale, palette and magenta background.
```

### F3 · Hit frames don't reach

```text
In the attached strip, frames <a>-<b> are the hit frames but the <fist / foot / palm> stops short. Redraw the strip with the same poses, except that in frames <a>-<b> the <limb> is fully extended horizontally toward the right edge of the image and is clearly the right-most part of the character. Head, hair and headband tails stay behind it. Same scale, palette and magenta background.
```

### F4 · Inconsistent scale or baseline

```text
In the attached strip the character changes size between frames and the feet are not on one baseline. Redraw it with exactly the same poses, the same head size in every frame, and every grounded foot on one shared horizontal line. Same palette and magenta background.
```
