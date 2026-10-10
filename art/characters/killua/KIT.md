# Killua: kit notes for the art

> The moveset brief for Killua, as far as the art needs it. His kit is ADR 0011 (cast table) and
> [ADR 0017](../../../docs/decisions/0017-ultimate-variety-and-rhythm-clashes.md) (ultimate); the numbers live in
> `src/game/moves.js`. Design facts are in [CHARACTER.md](CHARACTER.md); ADR 0007 and [art/SPEC.md](../../SPEC.md) win
> over this file. Written by Claude; Codex merges what changes into ANIMATIONS.md, PROMPTS.md and MOVES_AND_VFX.md.

## What changed (ADR 0017)

| button | before | now |
|---|---|---|
| SUPER (3 bars) | Godspeed: Whirlwind (flurry) | **Godspeed: Speed of Lightning**: the same dash, 8-hit afterimage flurry and slam, renamed after Godspeed's premeditated mode in the anime |
| Heavy + Special (3 bars) | Lightning Palm (beam) | **Godspeed: Whirlwind**: Godspeed's reflex mode. For 5 seconds his body answers up to 4 strikes or shots by itself: a lightning blink behind the attacker and the Rhythm Echo claw strike (`specialForward`). |

The Lightning Palm beam is gone. The anime's Whirlwind (Chimera Ant arc) is the mode where his body moves before
his mind: he reacts to an attack automatically, at lightning speed.

### Poses

- `superPose` (the Speed of Lightning flash) and `specialForward` (the counter strike) are unchanged.
- `beamCharge` is now the **Whirlwind activation** (the flash and a 12-frame recovery). The approved Lightning Palm
  charge (hands drawn back to the hip, crouched) works as a charge-up and needs no redraw. **Optional, for the anime
  look:** generate the next `_vNN` as the Whirlwind ready stance: standing low and relaxed on the balls of his feet,
  arms loose and slightly away from his body, hands open with the claws relaxed, assassin eyes fixed forward, his
  white hair bristling upward from the static. Same scale and feet as idle; no lightning in the sprite (the engine
  draws the crackle and afterimages).
- `beamFire` is no longer used by any move. Keep the approved frames: the name stays in the contract.

### Effects

The engine draws all of it: the activation burst, the crackle around him while Whirlwind runs, the afterimages, and
the blink.

## Redraws (2026-10-10): heavy and charge

The user's review of the packed sheet: "most heavy animations look unnatural". Killua's launcher is an arm raised
on the spot with a white swoosh drawn into the sprite, and his power-up is one pose that barely moves. Both strips
are redrawn as the next versions: **`heavy` v02** (A07) and **`charge` v04** (A15). The animation names, frame
counts, phases, his `bodyHeight` values (`heavy` 206, `charge` 180) and `ms` stay as they are in
`art/manifest.json`; only the poses change. Everything in [CHARACTER.md](CHARACTER.md),
[ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md),
[ADR 0010](../../../docs/decisions/0010-per-character-body-scale.md), [art/SPEC.md](../../SPEC.md) and
[art/CHARACTER_SCALE.md](../../CHARACTER_SCALE.md) still applies: about 6 heads, the 182 px standing skeleton, the
claw schedule of CHARACTER.md §6 (`heavy` f2-f5, `charge` all frames), no lightning in the sprite, facing right. The
approved `heavy` v01 and `charge` v03 stay approved until the user approves the new versions. Codex merges this
section into ANIMATIONS.md and PROMPTS.md (below).

The heavy stays a claw, but as an assassin's move instead of an uppercut: he drops into a low cat crouch with his
body twisted away and the claw hand hooked low behind him, then uncoils in one spiral, raking the claw up the front
of a taller opponent from the stomach to the chin and over his own head while he skips off the floor. It is the
cast's only launcher with a body turn and a skip: Naruto's is a planted power uppercut with a closed fist, Sasuke's
a straight-legged kick. It also stays apart from his own moves: `light2` is a horizontal swipe at eye height,
`specialForward` a straight thrust, `specialUp` a diagonal leap with the claw thrust up; the heavy is a vertical
rake that starts near the floor and ends in a small skip, not a leap.

### What is wrong now

`heavy` v01 (packed frames, final-cell px). The whole strip packs about 9 % smaller than idle (the hair mass about
48 px wide against idle's 53; there is no anatomy sidecar, so the raised claw of f4 set the scale):

| f | now | problem |
|---|---|---|
| f0 | a crouch with both hands up near the chest | no coil and no twist; the claw hand is not loaded low |
| f1 | the same crouch, deeper | a squash with nothing behind it |
| f2 | upright, the R claw pushed out horizontally at chest height | a jab, not the start of a rising arc |
| f3 | the claw raised beside his head (about x 172, y 57) | short of the zone x 180-208; a detached white crescent swoosh is drawn from the claw down to the hip (an effect, SPEC "No effects in body sprites") and the packer put the hit box on the swoosh [177, 51, 14, 75], not on the claw |
| f4 | the arm straight up, vertical, a small hop | the box on the claw [149, 32, 31, 30] is only partly inside the zone x 160-188; the body doesn't rotate or drive |
| f5 | back on the floor in a crouch | no airborne apex: the engine's hop is not in the pose |
| f6 | a deep landing crouch with a hand on the floor | good as a landing |
| f7 | the stance, 164 px tall | 22 px shorter than idle (186): a smaller, lower stance that pops into idle |

`charge` v03: the low crouch with the claws out and the tufts bristling is the right silhouette, but the four
frames are the same pose shifted 1 to 2 px with small tuft changes. No shoulder or hand motion, no twitch: it reads
as a still image, not as current running through him.

### Gameplay facts the frames must fit

From `MOVES.heavy` in `src/game/moves.js` and the attack, hop and landing code in `src/game/fighter.js`:

| fact | value | what it means for the art |
|---|---|---|
| frames, phases | 8 frames, `[3, 2, 3]`: f0-f2 startup, f3-f4 active, f5-f7 recovery | only f3 and f4 get a hit box |
| startup | 12 game frames (about 4 per frame, 67 ms each) | three clear keys: drop and twist, coil, uncoil |
| active | 5 game frames (f3 about 3, f4 about 2); on a hit, 12 frames of hitstop freeze the active frame | f3 and f4 are the poses players see frozen: make them sharp and readable |
| recovery | 22 game frames, but the hop lands about 3 game frames into f6 and the engine then plays `land` (8 frames of land lag) | f5 (the top of the hop) is the longest recovery frame; f6 is a pre-landing frame that hands over to `land` f0; f7 mostly shows in previews and the Sprite Lab |
| lunge | 5.5 units/s forward, falling to 0 by the end of the active phase; it stops on contact | about 0.8 units (about 100 px) of travel on a whiff: draw the drop and the uncoil, in place; feet never slide across the cell |
| hop | 5 units/s up on the first active frame: airborne from f3 to early f6, highest (about 0.34 units, about 43 px) during f5 | f3 up on the ball of the L foot with the R knee skipping up, f4-f5 airborne with the lowest point (the L toes) under the hips, f6 reaching for the floor. The engine does the lift: **no negative `frameOffsets` dy** |
| launch | `[2.4, 15.5]`, nearly straight up; `launcher: true` (a jump or dash after the hit chases the victim) | the claw travels UP the opponent's body (f3 at the chin) and finishes overhead (f4), in front of his body |
| hit test | the packed box of f3 / f4, grown by `boxPad` [0.14, 0.3] world units (about 18 × 38 px), same lane | the claw tips are the forward-most pixels on f3 and the highest pixels of the strip on f4 |
| contact zones (SPEC, unchanged for him) | f3 x 180-208, y 58-86 (his own eye height); f4 x 160-188, y 22-46 (claw top about y 34, his `bodyHeight` 206) | the hop lifts the sprite about 11 to 28 px while f3 shows, so aim the f3 claw low in its zone (y about 78-86): in game it meets a standard opponent's chin |
| effects | the engine draws the hit spark, dust and sound | no swoosh, crescent, lightning or sparks in the sprite |

`charge` (`state 'charge'`): a 4-frame loop played free-running at the manifest `ms` (50 each, a 200 ms cycle) for as
long as Special is held. He stands still and gains ki; releasing Special (or pressing Guard or Jump) returns to idle, Heavy with 3
bars starts the ultimate. The engine draws the aura flames, light streaks, small floor pebbles flying up and a glow
behind him, and pulses his sprite with the character color. So the loop is a fast **static twitch**, not a breath,
and the sprite draws no aura, lightning, sparks or glow. Normal blue eyes; claws out (CHARACTER.md §5, §6).

<a id="heavy-v02"></a>

### `heavy`: ASSASSIN'S RISING RAKE, spiraling claw launcher with the R hand

8 frames · phases 3/2/3 (startup f0-f2, active f3-f4, recovery f5-f7) · plays once · **CORE** · bodyHeight **206** ·
ms 40/35/30/50/70/70/60/30 · prompt A07 (2 images: f0-f4 + f5-f7) · claws f2-f5 · next version **v02**

- **Strike target:** f3: the R claw tips in **x 180-208, y 58-86**, aim about x 194, y 82, raking up in front of his
  face with the arm at about 45° above horizontal. f4: the claw in **x 160-188, y 22-46**, over his head but still
  in front of his face, its top at about y 34 (about two thirds of a head above his hair top), the highest pixel of
  the strip.
- **Forward-most and highest:** on f3 and f4 the hair tufts, the rolled collar, the loose shirt and its white hem,
  and the L arm stay behind about x 165 and below the claw.
- **Smear:** allowed on f3 only: one solid tapered streak in the sleeve purple, white cuff and skin colors from the
  knee-height start up to the hand, plus four thin solid claw-trail streaks in the nail colors along the fingertips'
  path (CHARACTER.md §6), all attached to the hand and below and behind the claw tips. No separate white crescent:
  v01's swoosh became the hit box.
- **Hair and cloth:** tufts compress 1-2 px on f0-f1, sweep back on f2-f3, press down on f4 (rising), float on f5,
  lift 1 px on f6 and settle on f7. The shirt hem pools on f1, twists with the turn on f2-f3 and rides up on f4-f5
  (more white hem shows); the shorts' leg openings flap on the skip.
- **Centering:** on f1 the claw hand stays about 10 px above the floor (out of the bottom rows), so the packer's foot
  centering doesn't shift him; on f4-f5 the lowest point (the L toes) sits under the hips.
- **Scale:** pack with an anatomy sidecar (`raw/heavy_v02.json`, skull-to-chin per frame) so the strip keeps idle's
  head size (v01 packed by bounds and came out about 9 % small).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `heavy_00` | startup | DROP AND TWIST: in one beat he sinks into a low cat crouch on the balls of his feet (knees bent about 80°), weight forward on the bent L leg; torso pitched forward about 35° and twisted away from the target so more of his back shows (R shoulder pulled back); the R hand dropped low behind the R hip, fingers starting to hook (normal fingertips); the L hand low in front, open. | cold | Tufts compressed 1-2 px · QA: hips over the midpoint between the feet |
| f1 | `heavy_01` | startup | COIL (the lowest frame): lower still, the torso twisted furthest, the R hand at its lowest behind the R heel (about 10 px above the floor), fingers hooked; the L hand forward low; head low, eyes up on the target. | focused | Shirt hem pooled over the thighs · QA: the shortest frame (about 125-135 px) |
| f2 | `heavy_02` | startup | UNCOIL (CLAW): legs driving up, hips and shoulders turning back toward the viewer (the chest opening), the R claw sweeping forward past the R knee at knee height in front of him; the L arm swinging back. | focused | Tufts swept back · QA: claw about x 156, y 186 |
| f3 | `heavy_03` | **active** | RAKE (CLAW): the R claw rakes UP in front of his body through a taller opponent's chin height, arm up and forward at about 45°, fingers hooked with the nails leading upward; the body turned toward the viewer with the chest open; up on the ball of the L foot, the R knee lifting forward toward hip height (a skip); the L arm swung down and back. | fierce, one small fang | **Smear** (above) · QA: claw tips x 194 ±8, y 82 ±6; the claw tips are the right-most pixels |
| f4 | `heavy_04` | **active** | OVER THE TOP (CLAW): the claw carries on up over his head, still in front of his face, the arm up and forward at about 70°; airborne in the skip: the R knee driven up to hip height, the L leg trailing straight down with the toes pointed (the lowest point, under the hips); torso upright to leaning back about 10°. | fierce | Tufts pressed down, shirt riding up · QA: claw x 160-188, top about y 34, the highest pixel of the strip (`bodyHeight` 206) |
| f5 | `heavy_05` | recovery | APEX, airborne (CLAW; the frame held longest): tucked compact in the air, both knees drawn up (the R higher), the R claw lowering to shoulder height with the nails still out, the L hand low; head up at the launched opponent. | focused | Tufts floating · QA: the lowest point under the hips |
| f6 | `heavy_06` | recovery | SILENT LANDING: the feet reaching down toes first, the knees bending into a low catch, the R hand opening with normal fingertips again, arms loose. | cold | Tufts lift 1 px · QA: close to `land` f0, which the engine plays right after touchdown |
| f7 | `heavy_07` | recovery | Idle stance (matches idle f0). | cold | QA: within 1-2 px of idle f0 in height (186), width and feet |

<a id="charge-v04"></a>

### `charge`: powering up (hold Special) · 4 frames, loop

4 frames · loops · **CORE** · bodyHeight 180 · ms 50/50/50/50 · prompt A15 · claws on · next version **v04**

Charging his body with electricity, read through the body: a low crouch on the balls of his feet, the claws spread
rigid, and short **asymmetric twitches** (one shoulder, then the other) as if current jolts through him. Loop rules:
the **feet are identical in all four frames** (soles on y 240); each frame moves a different part by 2 px (f1 the far
shoulder, f2 the near shoulder, f3 both settle); the hands twitch 1 to 2 px; the **head moves at most 2 px**; the
tufts bristle 2 to 4 px above idle and change shape every frame; the shirt hem and sleeves flick upward. f3 flows back
into f0 without a pop. No lightning, sparks or glow in the sprite.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `charge_00` | loop | CROUCH: wide low stance on the balls of his feet (heels just off the floor), knees bent about 50°, torso hunched slightly forward; both arms down and away from his sides, hands open with the fingers spread rigid, claws out; shoulders hunched up; head up. | fierce grimace, one small fang; blue eyes wide | Tufts bristling 2 px above idle; shirt hem and sleeves lifting |
| f1 | `charge_01` | loop | TWITCH: the L (far) shoulder jerks up about 2 px, the R hand's fingers splay wider. | fierce | Tufts bristle 1-2 px higher on one side; the shirt hem flicks up |
| f2 | `charge_02` | loop | TWITCH: the R (near) shoulder jerks up about 2 px while the L drops back, the L hand twitches, the whole body shivers 1 px. | fierce, teeth clenched | Tufts at their highest (about 4 px above idle) |
| f3 | `charge_03` | loop | SETTLE: both shoulders drop 1 px, the hands ease 1 px; flows into f0. | fierce | A fourth tuft shape; the hem settles 2 px |

### Prompts (replace A07 and A15 in PROMPTS.md)

The blocks keep the structure, layout, size, palette and background lines of the current A07 / A15 and add the
**SCALE LOCK** line required by [CHARACTER_SCALE.md](../../CHARACTER_SCALE.md) ("Prompt paragraph"); its sentence
about another fighter is left out on purpose, because naming him in a Killua prompt can leak his features.

#### A07 · `heavy`: ASSASSIN'S RISING RAKE, spiraling claw launcher with the R hand (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). **Save as: `raw/_parts/heavy_vNN_A.png` and `raw/_parts/heavy_vNN_B.png`** (same NN = the next free version; today 02); Codex stitches them into `raw/heavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A and the approved `land` strip (`raw/land_v01.png`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#heavy).

Part A (save as `raw/_parts/heavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "heavy", an assassin's rising claw launcher with the right hand: he drops into a low cat crouch with his body twisted away and the right hand hooked low behind him, then uncoils in one spiral, raking the claw up the front of a taller opponent from the stomach to the chin and on over his own head while he skips off the floor, so the opponent is launched straight up. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5.
Poses 4 and 5 are HIT frames. Pose 4: the right claw rakes UP in front of his face at the chin height of a taller opponent standing on the right, well in front of his body; the claw tips are the right-most part of the character. Pose 5: the claw has carried on up over his head, still in front of his face; it is the highest point of the whole strip, about two thirds of a head above the top of his hair and no higher. Hair tufts, the collar, the loose shirt and the left arm stay behind and below the claw.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Drop and twist: in one beat he sinks into a low cat crouch on the balls of his feet, knees bent deep, weight forward on the bent left leg; torso pitched forward and twisted away from the opponent so more of his back shows (right shoulder pulled back); the right hand dropped low behind the right hip, fingers starting to hook; the left hand low in front, open. Face: cold. Hair tufts compressed slightly.
2. Coil, the lowest pose: lower still, the torso twisted furthest, the right hand at its lowest behind the right heel, just above the floor, fingers hooked; the left hand forward and low; head low, eyes up on the target. Face: focused. The shirt hem pooled over the thighs.
3. Uncoil (CLAW): the legs drive up, the hips and shoulders turn back toward the viewer so the chest opens; the right claw sweeps forward past the right knee at knee height in front of him; the left arm swings back. Face: focused. Tufts swept back.
4. IMPACT (CLAW): the right claw rakes UP in front of his body through the chin height of a taller opponent on the right, the arm up and forward at about 45 degrees, the fingers hooked with the nails leading upward; his body turned toward the viewer with the chest open; up on the ball of the left foot, the right knee lifting forward toward hip height in a skip; the left arm swung down and back. Face: fierce, one small fang. SMEAR: one solid tapered streak in the purple sleeve, white cuff and skin colors from the knee-height start up to the hand, with four thin solid claw-trail streaks in the nail colors along the fingertips' path, all attached to the hand and below and behind the claw tips (hard pixels; no separate white crescent, no blur).
5. Over the top (CLAW): the claw carries on up over his head, still in front of his face, the arm up and forward at about 70 degrees; he is in the air in the skip: the right knee driven up to hip height, the left leg trailing straight down with the toes pointed, the lowest point, under his hips; torso upright to leaning back slightly. Face: fierce. Tufts pressed down, the shirt riding up so more white hem shows.
MOTION: The claw travels up IN FRONT of his body in one spiral (it rakes a chin on the right), not straight up beside his own head; the body turns from twisted-away to chest-open as it rises, and he skips off the floor at the top. Light and fast, on the balls of his feet. Draw everything in place: the game moves him forward and adds the hop.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 182 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 182 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A and the approved `land` strip too; save as `raw/_parts/heavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose. Also attached: the approved "land" strip, for continuity: pose 7 must flow into its first pose.

ANIMATION: "heavy", an assassin's rising claw launcher with the right hand. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
6. Top of the skip, the pose held longest (CLAW): tucked compact in the air, both knees drawn up with the right knee higher, the right claw lowering to shoulder height with the nails still out, the left hand low; head up toward the opponent he launched. Face: focused. Tufts floating.
7. Silent landing: the feet reaching down toes first, the knees bending into a low catch; the right hand opening with normal fingertips again; arms loose. Face: cold. Tufts lifted slightly by the fall.
8. Back in his loose fighting stance, the same as idle frame 1. Face: cold.
MOTION: The claw travels up IN FRONT of his body in one spiral (it rakes a chin on the right), not straight up beside his own head; the body turns from twisted-away to chest-open as it rises, and he skips off the floor at the top. Light and fast, on the balls of his feet. Draw everything in place: the game moves him forward and adds the hop.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 182 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 182 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

#### A15 · `charge`: powering up (loop) (CORE)

4 frames, loops. **Save as: `raw/charge_vNN.png`** (next free version; today 04). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#charge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "charge", powering up: charging his body with electricity, shown only through his body: a low crouch on the balls of his feet, claws spread rigid, and short jolting twitches as if current runs through him. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Crouch (CLAW): wide low stance on the balls of his feet with the heels just off the floor, knees bent about 50 degrees, torso hunched slightly forward; both arms held down and away from his sides, hands open with the fingers spread rigid and the claws out; shoulders hunched up; head up. Face: fierce grimace showing one small fang; normal blue eyes, wide and intense. Hair tufts BRISTLING UPWARD with static; the shirt hem and sleeves lifting.
2. Twitch (CLAW): his left (far) shoulder jerks up while the fingers of his right hand splay wider. Face: fierce. The tufts bristle higher on one side; the shirt hem flicks up.
3. Twitch (CLAW): now his right (near) shoulder jerks up while the left drops back, the left hand twitches, the whole body shivers very slightly. Face: fierce, teeth clenched. The tufts at their highest.
4. Settle (CLAW): both shoulders drop slightly, the hands ease a little; a fourth tuft shape; it flows straight back into pose 1. Face: fierce.
MOTION: A jolting, electric loop: each pose moves a different part (one shoulder, then the other, then both settle), the hands twitch, the head moves only slightly. The feet stay planted in exactly the same place in all 4 poses. NO lightning, NO aura, NO sparks: the game adds them.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 182 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 182 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### QA after `npm run sprites killua`

**`heavy` v02**

- The report packs `raw/heavy_v02.png` with no clipped or upscaled frames. The sidecar `raw/heavy_v02.json` carries
  the `anatomy` skull-to-chin values per frame (head about 30 px, CHARACTER_SCALE.md "Measurement and packing").
- Head size: every frame within 2 px of idle; f7 within 1-2 px of idle f0 (v01's whole strip packed about 9 % small
  and its f7 was 22 px short).
- Hit boxes: f3's box sits on the claw inside x 180-208, y 58-86 (claw tips about y 78-86); f4's box sits on the claw
  inside x 160-188, y 22-46 and its top is the highest pixel of the strip. No box on a smear, the tufts, the collar,
  the shirt or the skipping knee. Add `hitboxes.json` overrides for `heavy` 3 / 4 only if the automatic boxes miss
  the claw.
- Claws exactly on f2-f5; normal fingertips on f0, f1, f6, f7.
- Feet: f0-f1 on the balls of the feet on y 240 with no sliding; the R hand stays clear of the floor on f1; f3 pivots
  on the L ball; f4-f5 keep the L toes under the hips (no sideways jump of more than about 6 px against f3); f6
  reaches down toes first. No negative `frameOffsets` dy.
- No detached swoosh, crescent, lightning or sparks; the only smear is on f3, attached to the hand.
- In game (`?fight=killua,naruto&mode=solo&art=custom&debug`, `freezeCpu()`): Heavy after light1 x3 and as a poke at
  normal spacing. The claw visibly rakes the opponent's chin on f3, the opponent pops straight up, a jump right after
  the hit chases them, and the landing hands to `land` without a pop. Check against `specialUp` in the Sprite Lab: the
  heavy reads as a grounded spiral rake, the specialUp as a diagonal leap.

**`charge` v04**

- 4 frames packed from `raw/charge_v04.png`; the head within 2 px of idle; claws on in all 4 frames; blue eyes.
- The feet are identical in all four frames (within 1 px) on y 240; the loop f3 → f0 has no pop.
- Visible motion: f1 and f2 each raise a different shoulder by about 2 px; the tufts sit 2 to 4 px above idle and
  change in every frame; the head moves no more than 2 px.
- No lightning, sparks or glow in the sprite. In game, hold Special: the aura surrounds a twitching, charged body. If
  the 50 ms loop reads frantic, tell Claude (the manifest `ms` can go to 60-70; a data change, not a redraw).

### Merge (Codex)

1. **ANIMATIONS.md:** replace the `heavy` and `charge` entries with the two subsections above, in that file's bullet
   format (one bullet per frame; keep the `<a id="heavy">` and `<a id="charge">` anchors). In the Summary table the
   `heavy` row keeps `bodyHeight` 206 and its "tallest frame" cell becomes "f4 (claw top about y 34, over the head)".
2. **PROMPTS.md:** replace the A07 and A15 blocks with the blocks above and the Index title of A07.
3. **CHARACTER.md:** nothing changes (the claw schedule `heavy` f2-f5 and `charge` stay).
4. **manifest / TRACKER / REVIEW:** per AGENTS.md (new versions, REVIEW rows with the QA results). No manifest
   numbers change (frames, phases, `bodyHeight` 206 / 180, `ms`).
