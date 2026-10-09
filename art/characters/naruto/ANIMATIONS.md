# Naruto: animations, frame by frame

> Every animation the engine knows, with the exact pose of every frame. Read
> [CHARACTER.md](CHARACTER.md) first (look, palette, landmarks, R/L convention).
> Technical rules: [art/SPEC.md](../../SPEC.md). If this file and SPEC.md disagree, **SPEC.md wins**.
> Frame counts and phases match the canonical list in `src/art/animGuide.js`. Gameplay timing (how
> long each phase lasts) lives in `src/game/moves.js`; the engine stretches the startup / active /
> recovery frames over those phases, so the art only has to put the right pose in the right phase.
> ChatGPT prompts for each strip: [PROMPTS.md](PROMPTS.md) (prompt ids in the table below).

## How to read this file

- **f0, f1, ...** are 0-based frame numbers in strip order, left to right, the same numbers as
  the file names (f0 = `<anim>_00.png`, f1 = `<anim>_01.png`, ...: the "file" column), the
  `hitboxes.json` frame keys and the SPEC.md contact-zone frames. In ChatGPT prompts, "frame 1" /
  "pose 1" is f0.
- **Phase** (attacks only): *startup* (wind-up, no hitbox), **active** (the hitbox is live; the limb is
  fully extended here), *recovery* (coming back). `key` / `loop` / `—` for everything else.
- **R / L** are Naruto's own right / left. Facing right in the 3/4 view, **R = near** (closest to the
  camera, drawn in front) and **L = far** (partly behind the torso). Stance: L foot and L fist lead.
- **x / y** numbers are final-cell pixels (192×192, x from the left, y from the top, soles on
  y = 180, body center line x = 96) at the idle scale from CHARACTER.md §3. They go in the **QA**
  notes for Codex and Claude when checking packed frames in the Sprite Lab. ChatGPT never sees pixel
  numbers; PROMPTS.md describes the same poses in words.
- **Smear**: a solid stretched shape in the limb's own colors that shows speed on the first active
  frame. Hard pixels, no blur, no transparency, one frame only.

## Rules for every strip

1. **Facing right, 3/4 view**, camera about 12° above. Body turned about 35° toward the camera,
   head a bit more so both eyes show. Same head size, proportions and palette in every frame.
2. **Baseline.** Grounded poses: soles on the floor line. Airborne and lying poses: the lowest body
   point sits on the floor line too. The packer aligns every frame's lowest opaque pixel to y 180
   and the engine moves the sprite in the air, so show height with the pose, not with position.
   In air attacks, never let a fist or foot go lower than the lowest foot, or the body jumps.
3. **Centering.** The packer centers the mean x of the bottom 20% of each frame on x 96. Keep the
   hips over the midpoint between the feet so the body does not slide between frames.
4. **Active frames: what you see is what hits.** The packer builds each active frame's hitbox from
   the part of the silhouette that reaches past the idle front edge (idle bbox right edge minus
   6 px, about x 126). A hit lands only when that box overlaps the opponent's hurtbox **and** both
   fighters are in the same depth lane. So:
   - the striking limb (fist, foot, palm) must be **fully extended** toward screen-right and must be
     the right-most thing in the frame;
   - head, hair bangs and headband tails stay behind about x 126 on active frames (tails trail
     left);
   - a limb that stops short whiffs, and a limb drawn through the opponent's body is exactly where
     the hit spark appears.
5. **Strike direction.** Punches, kicks and palms travel horizontally toward screen-right. The
   uppercut travels up-forward and the air hammer down-forward. Both end **in front of** his body.
6. **Stay inside the cell.** After packing, everything fits within x 4 to 187 and y 4 to 180
   (SPEC.md sheet margin). Reach per the SPEC.md contact zones: punch and palm tips x 150 to 172,
   kick tips x 166 to 186.
7. **No effects in body sprites.** No Rasengan orb, aura, beam, smoke, speed lines, impact
   sparks or ground shadow: the engine draws all of those (see MOVES_AND_VFX.md). The only prop is
   the three shuriken in his hand on `throw` f0.
8. **Loops** (`loop` = yes): the last frame flows back into f0 without a pop.
9. **Hair and cloth** follow CHARACTER.md §6: stiff spikes that squash and stretch 1 to 2 px,
   headband tails that lag one frame and react to motion.

## All animations

38 animations, 154 frames in total (10 rows of the 16-column sheet).
**CORE** animations must all exist before the game uses the custom sheet (`"complete": true`).
Everything else falls back to a similar animation when missing.
`bodyHeight` is the tallest trimmed frame of the strip in final pixels (the packer scales each strip
to it). "ms" is the intended per-frame feel. The defaults in `art/manifest.json` and the packer are
authoritative, and attacks are time-stretched over the move phases anyway.

| anim | what | frames | phases S/A/R | loop | CORE | bodyHeight | ms per frame | prompt |
|---|---|---|---|---|---|---|---|---|
| A01 || [`idle`](#idle) | fighting stance (breathing loop) | 8 |  | yes | **CORE** | 135 | 150, 150, 150, 150, 150, 150, 150, 150 | A01 |
| A02 || [`run`](#run) | ninja run (loop) | 8 |  | yes | **CORE** | 135 | 60, 60, 60, 60, 60, 60, 60, 60 | A02 |
| A19 || [`dash`](#dash) | low forward dash (loop) | 2 |  | yes | **CORE** | 111 | 60, 60 | A13 |
| A25 || [`superDash`](#superdash) | homing super dash, flying like a missile (loop) | 2 |  | yes |  | 70 | 50, 50 | A25 |
| A24 || [`backDash`](#backdash) | quick hop backward | 3 |  |  |  | 137 | 60, 60, 80 | A26 |
| A26 || [`jumpSquat`](#jumpsquat) | pre-jump crouch | 1 |  |  |  | 107 | 70 | A27 |
| A20 || [`jumpUp`](#jumpup) | rising (loop) | 2 |  | yes | **CORE** | 131 | 80, 80 | A10 |
| A21 || [`jumpFall`](#jumpfall) | falling (loop) | 2 |  | yes | **CORE** | 138 | 80, 80 | A11 |
| A22 || [`land`](#land) | landing | 2 |  |  | **CORE** | 115 | 50, 70 | A12 |
| A32 || [`airRecover`](#airrecover) | mid-air backflip recovery | 3 |  |  |  | 119 | 50, 50, 60 | A30 |
| A03 || [`light1`](#light1) | jab with the lead (L) fist | 7 | 2/2/3 |  | **CORE** | 135 | 30, 30, 40, 50, 50, 50, 30 | A03 |
| A04 || [`light2`](#light2) | rear straight with the R (near) fist | 7 | 2/2/3 |  | **CORE** | 135 | 35, 30, 40, 50, 60, 50, 30 | A04 |
| A05 || [`light3`](#light3) | front push-kick with the R (rear) leg | 7 | 2/2/3 |  | **CORE** | 142 | 40, 35, 45, 60, 60, 60, 30 | A05 |
| A06 || [`light4`](#light4) | spinning roundhouse finisher with the R leg | 8 | 3/2/3 |  | **CORE** | 137 | 50, 45, 35, 40, 70, 70, 70, 40 | A06 |
| A07 || [`heavy`](#heavy) | rising uppercut launcher with the R fist | 8 | 3/2/3 |  | **CORE** | 144 | 40, 35, 30, 50, 70, 70, 60, 30 | A07 |
| A08 || [`airLight1`](#airlight1) | mid-air jab with the L fist | 5 | 1/2/2 |  | **CORE** | 131 | 45, 35, 50, 50, 30 | A14 |
| A27 || [`airLight2`](#airlight2) | mid-air front kick with the R leg | 5 | 1/2/2 |  |  | 137 | 45, 40, 50, 50, 30 | A28 |
| A28 || [`airLight3`](#airlight3) | mid-air spinning kick with the L leg | 6 | 2/2/2 |  |  | 133 | 50, 40, 50, 70, 60, 30 | A29 |
| A09 || [`airHeavy`](#airheavy) | double-fist hammer spike | 6 | 2/2/2 |  | **CORE** | 131 | 50, 45, 45, 70, 70, 40 | A15 |
| A33 || [`throw`](#throw) | mid-air shuriken throw (R hand) | 4 | 1/1/2 |  |  | 133 | 50, 60, 70, 50 | A24 |
| A10 || [`guard`](#guard) | cross-arm block (loop) | 2 |  | yes | **CORE** | 131 | 300, 300 | A08 |
| A29 || [`block`](#block) | pushed back while blocking | 2 |  |  |  | 135 | 60, 80 | A31 |
| A11 || [`hurtHigh`](#hurthigh) | hit in the face | 3 |  |  | **CORE** | 129 | 70, 90, 100 | A09 |
| A30 || [`hurtLow`](#hurtlow) | hit in the stomach | 3 |  |  |  | 121 | 70, 90, 100 | A32 |
| A12 || [`launched`](#launched) | knocked flying backward (loop) | 2 |  | yes | **CORE** | 94 | 70, 70 | A17 |
| A31 || [`spin`](#spin) | tumbling backward (loop) | 4 |  | yes |  | 123 | 60, 60, 60, 60 | A33 |
| A13 || [`down`](#down) | slammed down, then lying on the back | 2 |  |  | **CORE** | 68 | 80, 420 | A18 |
| A36 || [`ko`](#ko) | knocked out | 1 |  |  |  | 62 | 500 | A34 |
| A14 || [`getup`](#getup) | kip-up | 5 |  |  | **CORE** | 135 | 70, 60, 60, 80, 70 | A19 |
| A35 || [`stagger`](#stagger) | dizzy stagger (loop) | 4 |  | yes |  | 137 | 150, 150, 150, 150 | A35 |
| A15 || [`charge`](#charge) | powering up (loop) | 4 |  | yes | **CORE** | 131 | 50, 50, 50, 50 | A20 |
| A16 || [`beamCharge`](#beamcharge) | charging the Rasen Cannon (loop) | 3 |  | yes | **CORE** | 131 | 50, 50, 50 | A21 |
| A17 || [`beamFire`](#beamfire) | firing the Rasen Cannon (loop) | 3 |  | yes | **CORE** | 131 | 50, 50, 50 | A22 |
| A34 || [`vanish`](#vanish) | crouch before teleporting | 2 |  |  |  | 146 | 50, 50 | A36 |
| A18 || [`special`](#special) | RASENGAN rush | 8 | 3/3/2 |  | **CORE** | 135 | 120, 120, 120, 120, 120, 160, 110, 70 | A16 |
| A37 || [`intro`](#intro) | shadow-clone hand seal (loop) | 4 |  | yes |  | 139 | 150, 150, 150, 150 | A37 |
| A38 || [`taunt`](#taunt) | pointing "Believe it!" taunt (loop) | 2 |  | yes |  | 140 | 250, 250 | A38 |
| A23 || [`win`](#win) | fist-pump victory (loop) | 4 |  | yes | **CORE** | 140 | 110, 90, 260, 180 | A23 |

## Air base pose

All air attacks (`airLight1`, `airLight2`, `airLight3`, `airHeavy`, `throw`) start and end in the
same **air base pose**: L knee tucked high in front, R knee lower and slightly behind, torso upright leaning slightly forward, both fists in a loose guard at chest height. Headband tails trail behind and slightly up. Draw it as the first
and last frame of each air strip so the air combo chains smoothly.

---

## Locomotion

<a id="idle"></a>

### `idle`: fighting stance (breathing loop)

8 frames · loops · **CORE** · bodyHeight 135 · ms 150/150/150/150/150/150/150/150 · prompt A01

The neutral stance and the key pose for the whole sheet. Every other animation starts and ends close to f0. It must read instantly as a cocky brawler-ninja.

- **Hair and cloth:** A small breathing bob done with the knees only (feet never move). Hair spikes lag the body by one frame. Headband tails hang behind the head and sway gently.
- **QA:** Lead (L) fist at about x 128, y 92: this is the idle front edge that the packer uses to find hitboxes, so nothing in idle may reach further right than about x 132. Feet: L toes ~x 124, R heel ~x 70.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `idle_00` | key | KEY POSE. Orthodox stance: L (lead) foot forward with the toes pointing right, R foot back and turned out 45°, feet wider than the shoulders, knees bent about 25°, weight centered. Torso leans slightly forward, chest turned about 35° toward the viewer. L fist up in front at chin height, elbow down. R fist guards beside the right cheek and collar. | cocky half-smirk, eyes locked on the opponent (right), brows slightly lowered | Hair/tails: neutral; headband tails hang down behind the head |
| f1 | `idle_01` | loop | Exhale: knees bend a little more, shoulders and both fists drop slightly. | smirk | Hair/tails: spikes still at f0 height (lag); tails swing slightly left |
| f2 | `idle_02` | loop | Lowest point: knees bent the most, torso sunk lowest, fists lowest, chest slightly compressed. | smirk | Hair/tails: spikes drop 1 px |
| f3 | `idle_03` | loop | Hold the lowest point; shoulders roll forward a touch. | smirk | Hair/tails: spikes settle 2 px down (follow-through); tails at their furthest left |
| f4 | `idle_04` | loop | Inhale: body rises (knees straighten a little), fists rise. | smirk | Hair/tails: spikes still low (lag) |
| f5 | `idle_05` | loop | Back to f0 height, chest lifted slightly. | smirk | Hair/tails: spikes rise; tails swing back |
| f6 | `idle_06` | loop | Same as f0, but the L fist twitches forward slightly, a tiny "ready" flex. | smirk, eyes slightly narrower | Hair/tails: spikes 1 px above neutral (overshoot) |
| f7 | `idle_07` | loop | Same as f0 (flows straight back into f0). | smirk | Hair/tails: spikes and tails back to the f0 position |

<a id="run"></a>

### `run`: ninja run (loop)

8 frames · loops · **CORE** · bodyHeight 135 · ms 60/60/60/60/60/60/60/60 · prompt A02

Naruto's signature ninja run. Torso pitched far forward, both arms trailing straight back, long sprinting strides.

- **Hair and cloth:** Torso pitched forward about 40° for the whole cycle, head raised and looking ahead. Both arms stay extended straight back behind the body, slightly raised, hands open and flat with fingers together; they bob up and down 2 px. Hips stay over the midpoint between the feet. Hair and headband tails stream straight back (left) the whole time, tails waving up and down; jacket hem flaps back.
- **QA:** The R leg (near) is drawn over the L leg where they overlap. Keep the hips over the midpoint between the feet so the packer's feet-center alignment does not make the body slide between frames.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `run_00` | loop | Contact: L foot reaching forward, heel touching down well ahead of the hips; R leg extended far back, toes pushing off. Arms straight back. | focused, mouth closed |  |
| f1 | `run_01` | loop | Down: L foot flat under the hips, L knee bent about 45° absorbing the weight; R leg swinging forward with the knee bent and the foot high behind. Body at its lowest. Arms 2 px lower. | focused |  |
| f2 | `run_02` | loop | Passing: R knee drives forward past the L leg up to hip height; L leg straightening behind and pushing off; body rising. | focused |  |
| f3 | `run_03` | loop | Flight: both feet off the ground; R thigh horizontal in front, L leg extended straight back with pointed toes; longest stride. Arms 2 px higher. | focused, mouth slightly open |  |
| f4 | `run_04` | loop | Contact (mirror of f0): R foot reaching forward to touch down; L leg extended back, pushing off. | focused |  |
| f5 | `run_05` | loop | Down (mirror of f1): R foot flat under the hips, knee bent; L leg swinging forward, foot high behind. Arms 2 px lower. | focused |  |
| f6 | `run_06` | loop | Passing (mirror of f2): L knee drives forward to hip height; R leg pushing off behind. | focused |  |
| f7 | `run_07` | loop | Flight (mirror of f3): L thigh horizontal in front, R leg extended back. Flows back into f0. | focused, mouth slightly open |  |

<a id="dash"></a>

### `dash`: low forward dash (loop)

2 frames · loops · **CORE** · bodyHeight 111 · ms 60/60 · prompt A19

Fast forward dash along the ground. The engine adds dust and a ring burst.

- **Hair and cloth:** Hair spikes and headband tails swept flat back; jacket flapping.
- **QA:** Height about 111 px (lower than idle). Total length 170 px or less.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `dash_00` | loop | Torso pitched forward about 50° (chest low), head up looking at the opponent; arms trailing straight back like the ninja run but lower and closer to the body; L leg reaching far forward with the knee bent about 60°, foot skimming the ground; R leg extended straight back, toes dragging. A very long, low silhouette. | angry-focused, teeth just showing |  |
| f1 | `dash_01` | loop | Same, legs a little wider apart and the R toes lifted (pushing again); arms 2 px higher. | angry-focused | Hair/tails: tails flutter to a second shape |

<a id="superdash"></a>

### `superDash`: homing super dash, flying like a missile (loop)

2 frames · loops · optional · bodyHeight 70 · ms 50/50 · prompt A25

DBFZ-style homing flight that hits on contact. The engine moves him through the air and adds dash bursts.

- **Hair and cloth:** Hair spikes and headband tails swept flat back (left) and fluttering between frames; jacket hem flapping.
- **QA:** R fist is the front-most point (about x 178). Bend the knees so the whole pose is at most ~176 px long, or it will clip the 192 px cell. Height about 70 px.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `superDash_00` | loop | Flying horizontally toward screen-right: whole body almost horizontal (tilted about 70° forward); R arm thrust straight ahead past the head, fist leading; L arm tucked back along his side; head tucked between the shoulders, looking forward; legs trailing together behind, knees bent 30 to 40° so the shins angle upward. | angry, teeth gritted |  |
| f1 | `superDash_01` | loop | Same, knees bent a little more and the legs slightly scissored (R shin higher); L arm 2 px lower. | angry, teeth gritted | Hair/tails: tails flutter to a second shape |

<a id="backdash"></a>

### `backDash`: quick hop backward

3 frames · plays once · optional · bodyHeight 137 · ms 60/60/80 · prompt A24

Short evasive hop away from the opponent.

- **Hair and cloth:** He moves left, so hair and tails flow forward (right) in the air.
- **QA:** Lowest point always on the baseline. Show the direction with the lean, not with height.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `backDash_00` | — | Push-off: weight on the L (lead) foot, which shoves backward; torso upright and leaning back slightly; R leg already lifting behind; arms in a tight guard close to the chest. | alert, eyes on the opponent |  |
| f1 | `backDash_01` | — | Airborne hop backward: both knees tucked (L knee higher), torso leaning back, arms opening a little for balance (L arm forward, R arm back and down). | focused | Hair/tails: hair and tails flow forward (right) |
| f2 | `backDash_02` | — | Descending: legs extending down to land, R (rear) foot reaching back and down for the landing, L leg slightly bent in front; arms returning to the guard. | smirk | Hair/tails: tails dropping back behind the head |

<a id="jumpsquat"></a>

### `jumpSquat`: pre-jump crouch

1 frame · plays once · optional · bodyHeight 107 · ms 70 · prompt A26

One-frame crouch right before leaving the ground.

- **Hair and cloth:** Hair spikes compressed 2 px; tails droop.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `jumpSquat_00` | — | Deep crouch: knees bent about 90°, torso leaning forward, both arms swung down and back behind the hips (ready to swing up), heels down, head up looking at the target. | focused |  |

<a id="jumpup"></a>

### `jumpUp`: rising (loop)

2 frames · loops · **CORE** · bodyHeight 131 · ms 80/80 · prompt A20

Going up during a jump or super jump.

- **Hair and cloth:** Air rushes past while rising: hair spikes and tails are dragged DOWN-left.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `jumpUp_00` | loop | Rising: body stretched upward; L knee pulled high in front (thigh above horizontal), R leg bent below and behind; R arm swung up-forward (fist above head height, about 35° above horizontal), L arm swung down and back; torso upright. | focused, mouth closed | Hair/tails: tails dragged down-left |
| f1 | `jumpUp_01` | loop | Same, R arm 2 px higher, legs tucked 2 px tighter. | focused | Hair/tails: tails flutter to a second shape |

<a id="jumpfall"></a>

### `jumpFall`: falling (loop)

2 frames · loops · **CORE** · bodyHeight 138 · ms 80/80 · prompt A21

Coming down from a jump.

- **Hair and cloth:** Falling: hair spikes and headband tails float UP.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `jumpFall_00` | loop | Falling: legs extending down toward the floor, L leg in front slightly bent, R leg behind and straighter, toes pointing down; both arms spread out sideways for balance (R arm forward and up, L arm back), elbows soft; torso upright. | focused, looking down-forward | Hair/tails: tails lifted up |
| f1 | `jumpFall_01` | loop | Same, arms 2 px higher and feet 2 px further apart. | focused | Hair/tails: tails flutter to a second shape |

<a id="land"></a>

### `land`: landing

2 frames · plays once · **CORE** · bodyHeight 115 · ms 50/70 · prompt A22

Touch-down from any jump.

- **Hair and cloth:** Squash and settle: hair spikes squash down 2 px on f0, rebound 1 px on f1; tails slap down.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `land_00` | — | Impact squash: knees deeply bent, feet planted wide (L forward, R back), torso pitched forward about 20°, arms flung out low to the sides for balance, head tucked. | eyes half closed, teeth gritted (impact) | Hair/tails: spikes squashed 2 px, tails slap down |
| f1 | `land_01` | — | Rising halfway back to the stance: knees bent about 40°, arms coming back up toward the guard, head up. | focused | Hair/tails: spikes rebound 1 px |

<a id="airrecover"></a>

### `airRecover`: mid-air backflip recovery

3 frames · plays once · optional · bodyHeight 119 · ms 50/50/60 · prompt A32

Breaking out of a juggle: a tight backflip back to control.

- **Hair and cloth:** Hair and tails trail opposite to the spin.
- **QA:** Lowest point of every frame on the baseline; keep the tucked ball compact (about 110 px).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airRecover_00` | — | Backflip starts: body curled into a ball (knees to chest, arms hugging the shins), rotated about 60° backward (head tilting toward screen-left). | eyes shut tight |  |
| f1 | `airRecover_01` | — | Upside down: the same tuck rotated about 200° (head at the bottom-left, feet up-right). | eyes squeezed |  |
| f2 | `airRecover_02` | — | Almost upright (about 340°): legs extending down, arms opening out to the sides, ready to land. | smirk, eyes open |  |

---

## Ground attacks (auto combo and launcher)

<a id="light1"></a>

### `light1`: jab with the lead (L) fist

7 frames · phases 2/2/3 (startup f0–f1, active f2–f3, recovery f4–f6) · plays once · **CORE** · bodyHeight 135 · ms 30/30/40/50/50/50/30 · prompt A03

First hit of the auto combo (Light ×4). Fast and snappy. The engine lunges him forward a little.

- **Strike target:** f2–f3: L fist tip at about x 156, y 78 (the opponent's face / chin; SPEC zone x 150-162, y 70-84). Only the L forearm and fist go past x 132.
- **Hair and cloth:** Hair spikes jolt 1 px forward on f2 and settle on f4. Tails whip 2 px on f2.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `light1_00` | startup | Anticipation: L fist pulls back toward the chin, shoulders turn slightly toward the viewer (coiling), weight shifts onto the R (rear) leg. | eyes narrowed, focused |  |
| f1 | `light1_01` | startup | The L arm starts to fire: elbow rising to shoulder height and pointing forward, fist halfway out; L shoulder rolling forward, torso turning to lead with the left side; R fist still guarding the cheek. | angry, teeth gritted | QA: L fist ~x 142, y 80 |
| f2 | `light1_02` | **active** | IMPACT: L arm fully extended horizontally at shoulder height, fist clenched with the knuckles forward; L shoulder raised to protect the chin; torso turned so the left side leads, leaning forward about 12°; L foot slid forward, R heel lifted; R fist guarding the jaw. | angry, mouth open in a short shout | **Smear:** the L forearm is stretched into a short, solid, tapered orange-and-skin streak behind the fist (hard pixels, no blur) · QA: L fist tip x 156 ±6, y 78; smear 10–14 px |
| f3 | `light1_03` | **active** | Hold the extension (fist 1 to 2 px back from f2), clean arm without smear; sleeve folds snapped forward. | angry | QA: fist tip ~x 154 |
| f4 | `light1_04` | recovery | Retract: L elbow bends to about 90°, fist pulled halfway back; torso starts turning back. | angry | QA: fist ~x 142 |
| f5 | `light1_05` | recovery | Fist almost back at the chin, L foot sliding back, weight re-centering. | focused |  |
| f6 | `light1_06` | recovery | Back in the stance (same as idle f0). | cocky smirk | QA: within 1–2 px of idle f0 |

<a id="light2"></a>

### `light2`: rear straight with the R (near) fist

7 frames · phases 2/2/3 (startup f0–f1, active f2–f3, recovery f4–f6) · plays once · **CORE** · bodyHeight 135 · ms 35/30/40/50/60/50/30 · prompt A04

Second hit of the auto combo. A heavier, fully rotated straight punch.

- **Strike target:** f2–f3: R fist tip at about x 166, y 86 (the opponent's chin / upper chest; SPEC zone x 158-172, y 76-92). Only the R forearm and fist go past x 132.
- **Hair and cloth:** Tails whip on f2; hair follow-through on f3.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `light2_00` | startup | Wind-up: R fist cocked back beside the right ear, elbow back; torso twists further toward the viewer (right shoulder back); weight on the R (rear) leg; L fist guarding forward. | focused |  |
| f1 | `light2_01` | startup | Hips rotate first: R heel starts to lift, R elbow drives forward at chest height with the fist passing the chest; L arm begins pulling back toward the chest. | angry | QA: R fist ~x 122 |
| f2 | `light2_02` | **active** | IMPACT: R arm fully extended straight forward at shoulder height (the opponent's chin / upper chest), knuckles forward; torso rotated so the chest squares to screen-right and the right shoulder leads, leaning forward about 16°; R heel up, pivoting on the ball of the foot; L fist pulled back tight to the left chest. | angry shout, mouth wide | **Smear:** a short, solid, stretched streak behind the R forearm · QA: R fist tip x 166 ±6, y 86; smear 10–14 px |
| f3 | `light2_03` | **active** | Hold (fist 1 to 2 px back), no smear. | angry | QA: fist tip ~x 164 |
| f4 | `light2_04` | recovery | R arm retracting, elbow bent, fist halfway back; torso unwinding. | angry | QA: fist ~x 146 |
| f5 | `light2_05` | recovery | R fist returning to the cheek; R heel down. | focused |  |
| f6 | `light2_06` | recovery | Back in the stance. | smirk |  |

<a id="light3"></a>

### `light3`: front push-kick with the R (rear) leg

7 frames · phases 2/2/3 (startup f0–f1, active f2–f3, recovery f4–f6) · plays once · **CORE** · bodyHeight 142 · ms 40/35/45/60/60/60/30 · prompt A05

Third hit of the auto combo, aimed at the stomach (the engine treats it as a low-ish hit).

- **Strike target:** f2–f3: R sandal sole at about x 170, y 120 (the opponent's stomach). Only the R leg goes past x 132.
- **Hair and cloth:** Pant leg ripples on f3; tails swing forward on f2 as the torso leans back.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `light3_00` | startup | Weight shifts onto the L (lead) leg, which straightens; R heel lifts; arms tighten into the guard. | focused |  |
| f1 | `light3_01` | startup | Chamber: R knee lifted to belly height in front, shin hanging down, foot flexed; torso leaning back slightly; L fist guarding forward, R arm swinging back a little for balance. | angry |  |
| f2 | `light3_02` | **active** | IMPACT: R leg thrust straight forward, horizontal at stomach height, the sole of the sandal facing the target (push kick); torso leaning back about 18°; L (support) leg straight and planted on the baseline; L fist guarding the chin, R arm flung back for balance. | angry shout | **Smear:** solid orange arc trailing below and behind the shin · QA: R sole x 170 ±6, y 120 |
| f3 | `light3_03` | **active** | Hold the extension (foot 1 to 2 px back), no smear; pant leg rippling. | angry | QA: sole ~x 168 |
| f4 | `light3_04` | recovery | Re-chamber: knee bends, foot pulled back halfway. | angry | QA: foot ~x 140 |
| f5 | `light3_05` | recovery | R foot stepping down behind into the rear position, torso coming upright. | focused |  |
| f6 | `light3_06` | recovery | Back in the stance. | smirk |  |

<a id="light4"></a>

### `light4`: spinning roundhouse finisher with the R leg

8 frames · phases 3/2/3 (startup f0–f2, active f3–f4, recovery f5–f7) · plays once · **CORE** · bodyHeight 137 · ms 50/45/35/40/70/70/70/40 · prompt A06

Last hit of the auto combo: a big spinning kick that launches and wall-bounces. Also used by the vanish kick.

- **Strike target:** f3–f4: R foot and shin at about x 178, y 76 (the opponent's head and neck; SPEC zone x 170-186, y 64-88). A head-high kick needs the torso to lean far back so the hip moves forward; the foot must still be the right-most point. Only the R leg goes past x 132.
- **Hair and cloth:** Headband tails whip around with the spin: in front of the body on f2, trailing far right after the kick on f4. Hair spikes squash toward the spin direction on f3.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `light4_00` | startup | Wind-up: knees bend, torso twists toward the viewer (coil), R shoulder back, arms tucked near the chest, weight on the L (lead) foot. | determined grin |  |
| f1 | `light4_01` | startup | Spin starts: pivoting on the L foot, the body turns away from the viewer so we see his right side and the navy upper back; R heel lifting behind. | eyes visible over the shoulder |  |
| f2 | `light4_02` | startup | Mid-spin: back toward the viewer (navy-black upper back and red spiral emblem visible), head turned to look over the left shoulder toward screen-right, R knee chambered high at hip level, arms tucked. | one eye visible, fierce |  |
| f3 | `light4_03` | **active** | IMPACT: the body has come round to face screen-right again; R leg whipping horizontally at HEAD height, fully extended, instep and shin leading; torso leaning back about 28° away from the kick; L support leg straight; L arm swung forward-low and R arm flung back for balance. | shout | **Smear:** big solid crescent in the leg colors (orange, blue) sweeping behind the leg · QA: R foot x 178 ±6, y 76 |
| f4 | `light4_04` | **active** | Hold the extension, smear gone. | shout | QA: R foot ~x 176, y 78 |
| f5 | `light4_05` | recovery | Leg dropping and folding at the knee, torso coming upright. | focused |  |
| f6 | `light4_06` | recovery | R foot lands behind, knees bent low, arms returning toward the guard. | focused |  |
| f7 | `light4_07` | recovery | Back in the stance. | smirk |  |

<a id="heavy"></a>

### `heavy`: rising uppercut launcher with the R fist

8 frames · phases 3/2/3 (startup f0–f2, active f3–f4, recovery f5–f7) · plays once · **CORE** · bodyHeight 144 · ms 40/35/30/50/70/70/60/30 · prompt A07

The launcher. Knocks the opponent straight up for an air combo. The engine adds a small hop.

- **Strike target:** f3: R fist at about x 148, y 82 (driving up into the opponent's chin, forearm nearly vertical). f4: fist at about x 136, y 48 (follow-through, still in front of his face). The fist must stay IN FRONT of his body on the active frames: an uppercut that only goes straight up over his own head cannot hit anyone.
- **Hair and cloth:** Hair spikes and tails flick UP on f3–f5 and drop on f6–f7.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `heavy_00` | startup | Anticipation crouch: knees bend deep, torso pitched forward about 24° and turned toward the viewer, R fist dropped low behind the R hip (cocked), L fist guarding forward at chest height. | focused, brows down |  |
| f1 | `heavy_01` | startup | Deepest squash: knees about 90°, R fist at its lowest near the R knee, eyes looking up at the target's chin. | angry |  |
| f2 | `heavy_02` | startup | The explosion begins: legs straightening, R fist rising forward past the belt, torso starting to rise. | angry, mouth opening | QA: R fist ~x 128, y 118 |
| f3 | `heavy_03` | **active** | IMPACT: stepping in and leaning into the target while rising onto the toes (heels off the ground); R upper arm driving forward with the elbow bent about 90° and the forearm nearly vertical, so the fist rises at chin height well IN FRONT of his body (a true uppercut, not a straight punch), knuckles toward him; L arm pulled down and back to the hip. | shout | **Smear:** solid tapered streak below and behind the fist, following its upward arc · QA: R fist x 148 ±6, y 82 |
| f4 | `heavy_04` | **active** | Follow-through: torso straightening and leaning back slightly, R arm extending up-forward at about 65°, fist above his head but still in front of his face; fully stretched on tiptoes. | shout | QA: R fist ~x 136, y 48 |
| f5 | `heavy_05` | recovery | Peak: R arm nearly vertical, fist only just above the hair tips; body fully stretched, legs together. | shout, eyes closed | QA: fist top ≤ 6 px above the hair tips (bodyHeight 144) |
| f6 | `heavy_06` | recovery | Coming down: knees bending, R arm lowering to shoulder height. | focused |  |
| f7 | `heavy_07` | recovery | Back in the stance. | smirk |  |

---

## Air attacks

<a id="airlight1"></a>

### `airLight1`: mid-air jab with the L fist

5 frames · phases 1/2/2 (startup f0–f0, active f1–f2, recovery f3–f4) · plays once · **CORE** · bodyHeight 131 · ms 45/35/50/50/30 · prompt A08

First hit of the air combo (Light ×3 in the air).

- **Strike target:** f1–f2: L fist tip at about x 158 at his own shoulder height (SPEC zone x 150-166).
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Tails trail behind and slightly down; hair jolts forward 1 px on f1.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airLight1_00` | startup | From the AIR BASE POSE: L fist pulled back to the chin, shoulders coiling toward the viewer. | focused |  |
| f1 | `airLight1_01` | **active** | IMPACT: L arm fully extended horizontally at shoulder height; torso turned to lead with the left side, leaning forward about 10°; R fist guarding the jaw; legs stay tucked. | angry shout | **Smear:** solid streak behind the L forearm · QA: L fist tip x 158 ±6 |
| f2 | `airLight1_02` | **active** | Hold the extension, no smear. | angry | QA: fist tip ~x 156 |
| f3 | `airLight1_03` | recovery | L arm retracting, elbow bent. | focused |  |
| f4 | `airLight1_04` | recovery | Back to the AIR BASE POSE. | focused |  |

<a id="airlight2"></a>

### `airLight2`: mid-air front kick with the R leg

5 frames · phases 1/2/2 (startup f0–f0, active f1–f2, recovery f3–f4) · plays once · optional · bodyHeight 137 · ms 45/40/50/50/30 · prompt A27

Second hit of the air combo.

- **Strike target:** f1–f2: R sole at about x 170, at his own hip height.
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Tails swing forward slightly as the torso leans back on f1.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airLight2_00` | startup | From the AIR BASE POSE: R knee chambered up to the chest, torso leaning back slightly. | focused |  |
| f1 | `airLight2_01` | **active** | IMPACT: R leg extended straight forward at hip height, sole facing the target; torso leaning back about 12°; L leg hanging bent below; arms pulled back and out for balance. | angry shout | **Smear:** solid arc behind the shin · QA: R sole x 170 ±6 |
| f2 | `airLight2_02` | **active** | Hold the extension, no smear. | angry | QA: sole ~x 168 |
| f3 | `airLight2_03` | recovery | Knee folds back toward the chest. | focused |  |
| f4 | `airLight2_04` | recovery | Back to the AIR BASE POSE. | focused |  |

<a id="airlight3"></a>

### `airLight3`: mid-air spinning kick with the L leg

6 frames · phases 2/2/2 (startup f0–f1, active f2–f3, recovery f4–f5) · plays once · optional · bodyHeight 133 · ms 50/40/50/70/60/30 · prompt A28

Third air hit: knocks the opponent away (wall bounce).

- **Strike target:** f2–f3: L foot at about x 172, at his own chest height.
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Tails whip around with the spin, trailing far behind on f2.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airLight3_00` | startup | Twist: torso and hips turn away from the viewer (more of the back shows), L knee tucked to the chest, arms tight. | focused |  |
| f1 | `airLight3_01` | startup | Back fully toward the viewer (red spiral emblem visible), head turned looking over the shoulder at the target, both legs tucked. | one eye visible, fierce |  |
| f2 | `airLight3_02` | **active** | IMPACT: spun back round, the L leg whips out horizontally, fully extended at chest height; torso leaning back about 18°; R leg tucked underneath; arms flung wide. | shout | **Smear:** big solid crescent behind the leg · QA: L foot x 172 ±6 |
| f3 | `airLight3_03` | **active** | Hold the extension, no smear. | shout | QA: foot ~x 170 |
| f4 | `airLight3_04` | recovery | Leg folding back in, body re-centering. | focused |  |
| f5 | `airLight3_05` | recovery | Back to the AIR BASE POSE. | focused |  |

<a id="airheavy"></a>

### `airHeavy`: double-fist hammer spike

6 frames · phases 2/2/2 (startup f0–f1, active f2–f3, recovery f4–f5) · plays once · **CORE** · bodyHeight 131 · ms 50/45/45/70/70/40 · prompt A09

Air finisher: smashes the opponent into the floor (ground bounce).

- **Strike target:** f2–f3: clasped fists at about x 156, at about his own knee height (down-forward 45°). The fists must not go lower than his lowest foot, or the packer's floor alignment makes the body jump up.
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Hair and tails lift on the wind-up and slam down-forward on f2.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airHeavy_00` | startup | Wind-up: both arms raised overhead, fists clasped together (one hand wrapped over the other fist) above and slightly behind the head; torso arched back about 20°; knees tucked. | shout |  |
| f1 | `airHeavy_01` | startup | Maximum wind-up: clasped fists further behind the head, body bent back like a bow, legs folded back under him. | shout, eyes wide |  |
| f2 | `airHeavy_02` | **active** | IMPACT: body jackknifes forward about 40°; both straight arms smash the clasped fists down-forward at 45°; legs trailing back and down (the R foot is the lowest point). | shout | **Smear:** large solid crescent above and behind the arms, tracing the overhead-to-down arc · QA: fists x 156 ±6, at knee height, above the lowest foot |
| f3 | `airHeavy_03` | **active** | Hold the smash, no smear. | shout | QA: fists ~x 154 |
| f4 | `airHeavy_04` | recovery | Arms rising back to chest height, body uncurling. | focused |  |
| f5 | `airHeavy_05` | recovery | Back to the AIR BASE POSE. | focused |  |

<a id="throw"></a>

### `throw`: mid-air shuriken throw (R hand)

4 frames · phases 1/1/2 (startup f0–f0, active f1–f1, recovery f2–f3) · plays once · optional · bodyHeight 133 · ms 50/60/70/50 · prompt A33

Air projectile: three shuriken in a fan. The engine spawns and flies the shuriken.

- **Strike target:** The engine spawns the shuriken about 0.5 units in front of him at chest height (about x 139, y 103 at idle scale). The R hand should pass that point on f1.
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Tails whip forward on f1.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `throw_00` | startup | Cocked: R arm drawn back behind the head, holding three small steel four-pointed shuriken fanned between the fingers; torso twisted toward the viewer and leaning back slightly; L arm extended forward, open hand aiming at the target; legs in the AIR BASE POSE. | smirk, one eye aiming |  |
| f1 | `throw_01` | **active** | RELEASE: R arm whipped forward to horizontal at shoulder height, hand open, palm down, fingers pointing at the target; NO shuriken in the hand anymore (the engine spawns them); torso turned forward; L arm pulled back. | angry shout | **Smear:** solid streak behind the R forearm · QA: R hand ~x 150 |
| f2 | `throw_02` | recovery | Follow-through: R arm continues down-forward across the body, L arm back. | focused |  |
| f3 | `throw_03` | recovery | Back to the AIR BASE POSE. | smirk |  |

---

## Defense and reactions

<a id="guard"></a>

### `guard`: cross-arm block (loop)

2 frames · loops · **CORE** · bodyHeight 131 · ms 300/300 · prompt A10

Holding guard.

- **Hair and cloth:** Tails sway 1 px between frames.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `guard_00` | loop | Cross block: both forearms raised and crossed in an X in front of the face (wrists crossing in front of the nose, fists closed, R forearm in front), elbows tucked to protect the ribs; torso hunched forward about 12°; head ducked so the eyes peek over the forearms; knees bent wide and braced. | angry glare over the arms |  |
| f1 | `guard_01` | loop | Same, 1 px lower with the knees 1 px deeper (breathing). | angry glare |  |

<a id="block"></a>

### `block`: pushed back while blocking

2 frames · plays once · optional · bodyHeight 135 · ms 60/80 · prompt A29

Blockstun: the guard absorbing a hit.

- **Hair and cloth:** Hair and tails jolt forward (right) on f0.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `block_00` | — | Same crossed-arm guard, but the torso is pushed upright and back, head snapped down behind the arms, rear (R) foot sliding back with the heel lifted, sandals skidding. | eyes squeezed shut, teeth gritted | Hair/tails: hair and tails jolt forward |
| f1 | `block_01` | — | Recovering into the guard pose (like guard f0). | angry |  |

<a id="hurthigh"></a>

### `hurtHigh`: hit in the face

3 frames · plays once · **CORE** · bodyHeight 129 · ms 70/90/100 · prompt A11

Standard hitstun reaction for high and mid hits.

- **Hair and cloth:** The head snaps back (left), so the hair spikes and tails whip forward (right) on f0 and fall back on f1–f2.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `hurtHigh_00` | — | IMPACT: head snapped back hard (chin up about 30°), torso bent back about 24°, both arms flung back and out (R arm wide behind, L arm up), knees buckling, feet still planted. | eyes squeezed shut, mouth open in a grimace | Hair/tails: spikes and tails whip forward |
| f1 | `hurtHigh_01` | — | Recoil continues: head still back but a little less, arms dropping, torso leaning back about 20°. | one eye squinting, teeth gritted |  |
| f2 | `hurtHigh_02` | — | Starting to recover: head coming forward, torso back about 16°, arms coming down toward the guard. | pained, eyes open |  |

<a id="hurtlow"></a>

### `hurtLow`: hit in the stomach

3 frames · plays once · optional · bodyHeight 121 · ms 70/90/100 · prompt A30

Hitstun for low and stomach hits.

- **Hair and cloth:** Hair spikes and tails flung forward and down on f0.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `hurtLow_00` | — | IMPACT: doubled over forward about 40°, both arms pulled in toward the stomach (fists near the belly), knees bent, feet pushed back; head down. | gasp: eyes wide with tiny pupils, mouth open |  |
| f1 | `hurtLow_01` | — | Still doubled over (about 34°), arms slightly lower. | teeth gritted, one eye shut |  |
| f2 | `hurtLow_02` | — | Recovering: torso about 28°, head lifting. | pained |  |

<a id="launched"></a>

### `launched`: knocked flying backward (loop)

2 frames · loops · **CORE** · bodyHeight 94 · ms 70/70 · prompt A12

Airborne after a launcher or a big hit. The engine flies the sprite.

- **Hair and cloth:** He flies left, so hair and tails stream to the right.
- **QA:** Lowest point on the baseline; total height about 94 px.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `launched_00` | loop | Knocked flying back toward screen-left: whole body tilted back about 55° (head toward the upper-left, feet toward the right), back arched, both arms flung up and back past the head, legs trailing forward and bent at the knees. | eyes shut, mouth open (pain) | Hair/tails: hair and tails stream right |
| f1 | `launched_01` | loop | Same, tilted 6° more, arms and legs flailing into an alternate position (L arm higher, R knee bent more). | pain | Hair/tails: tails flutter to a second shape |

<a id="spin"></a>

### `spin`: tumbling backward (loop)

4 frames · loops · optional · bodyHeight 123 · ms 60/60/60/60 · prompt A31

Tumbling through the air after big launches.

- **Hair and cloth:** Tails trail opposite to the rotation.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `spin_00` | loop | Loose tuck (knees bent toward the chest, arms bent in front), rotated about 30° backward. | pain, eyes shut |  |
| f1 | `spin_01` | loop | Same tuck rotated about 120° (back toward the floor, head to the left). | pain |  |
| f2 | `spin_02` | loop | Rotated about 210° (upside down, head down). | pain |  |
| f3 | `spin_03` | loop | Rotated about 300° (feet coming round over the top). Flows into f0. | pain |  |

<a id="down"></a>

### `down`: slammed down, then lying on the back

2 frames · plays once · **CORE** · bodyHeight 68 · ms 80/420 · prompt A13

Knockdown. The engine adds dust and sometimes a crater.

- **Hair and cloth:** Hair spikes splay out on the floor; tails flung up on f0 and lying flat on f1.
- **QA:** Height about 68 px (lying, seen from slightly above). Head toward screen-left, feet toward screen-right.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `down_00` | — | Ground impact: lying on his back, head toward screen-left and feet toward screen-right; his back has slammed into the floor but the shoulders and legs bounce up about 18° from flat; arms flung out wide. | eyes squeezed shut, mouth open |  |
| f1 | `down_01` | — | Lying flat on the back: arms out to the sides, L knee slightly raised, head turned toward the viewer. | eyes closed, dazed |  |

<a id="ko"></a>

### `ko`: knocked out

1 frame · plays once · optional · bodyHeight 62 · ms 500 · prompt A36

Final KO pose (held).


| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `ko_00` | — | Lying flat on the back like down f1 but completely limp: arms splayed, legs straight, head tilted toward the viewer. Head toward screen-left. | eyes closed (or comedic spiral eyes), mouth slightly open |  |

<a id="getup"></a>

### `getup`: kip-up

5 frames · plays once · **CORE** · bodyHeight 135 · ms 70/60/60/80/70 · prompt A14

Getting back up after a knockdown, scrappy and fast.

- **Hair and cloth:** Tails follow one frame behind the body; hair squashes on f3.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `getup_00` | — | Lying on the back (head left, feet right), knees pulled up to the chest, palms planted on the floor beside the head (fingers pointing toward the shoulders). | angry, eyes open |  |
| f1 | `getup_01` | — | Legs kick up and over: rocked back onto the shoulders, hips high, legs pointing up-right. | angry |  |
| f2 | `getup_02` | — | Spring: body launched up off the hands, torso tilted back about 40°, legs tucked underneath, arms out. | angry shout |  |
| f3 | `getup_03` | — | Lands in a crouch (squash): knees deep, feet planted in the stance, arms coming up to the guard. | focused |  |
| f4 | `getup_04` | — | Back in the stance. | smirk |  |

<a id="stagger"></a>

### `stagger`: dizzy stagger (loop)

4 frames · loops · optional · bodyHeight 137 · ms 150/150/150/150 · prompt A35

Dizzy state.

- **Hair and cloth:** Hair spikes droop slightly; tails swing with the sway.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `stagger_00` | loop | Dizzy wobble: standing loosely, upper body swaying to screen-left (rolled about 8°), head tilted the same way, arms hanging loose, knees wobbly (R knee bent inward). | spiral dizzy eyes, mouth hanging open |  |
| f1 | `stagger_01` | loop | Swaying back through center (upright), arms swinging. | spiral eyes |  |
| f2 | `stagger_02` | loop | Swaying to screen-right (rolled about 8° the other way), L knee bent inward. | spiral eyes, tongue slightly out |  |
| f3 | `stagger_03` | loop | Back through center. Flows into f0. | spiral eyes |  |

---

## Ki, beam and signature

<a id="charge"></a>

### `charge`: powering up (loop)

4 frames · loops · **CORE** · bodyHeight 131 · ms 50/50/50/50 · prompt A15

Holding the special button charges ki. The engine draws the orange flame aura around him: do NOT draw any aura.

- **Hair and cloth:** An updraft blows the hair spikes and headband tails UP; they flicker between two shapes.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `charge_00` | loop | Powering up: wide stance (feet well apart, knees bent about 35°), fists clenched at his sides pushed down and slightly out, elbows slightly bent, chest out, torso arched back about 10°, head tilted up, shouting. | shout, eyes intense and narrowed | Hair/tails: spikes and tails blown up |
| f1 | `charge_01` | loop | Same, whole body trembling 1 px to the left; arms flexed 1 px further out. | shout | Hair/tails: second flicker shape |
| f2 | `charge_02` | loop | Same as f0 (tremble right). | shout | Hair/tails: first flicker shape |
| f3 | `charge_03` | loop | Same as f1. | shout | Hair/tails: second flicker shape |

<a id="beamcharge"></a>

### `beamCharge`: charging the Rasen Cannon (loop)

3 frames · loops · **CORE** · bodyHeight 131 · ms 50/50/50 · prompt A16

Ultimate wind-up during the super flash. The engine draws the aura and speed lines; the hands stay empty.

- **Hair and cloth:** Hair spikes and tails blown upward and back.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `beamCharge_00` | loop | Low wide stance (L leg forward and bent, R leg back); torso twisted away toward the viewer (about 36°); both hands cupped together at the R (rear) hip, palms facing each other as if holding a ball, but EMPTY (no energy drawn); elbows bent back; head turned toward the target (screen-right). | shout |  |
| f1 | `beamCharge_01` | loop | Same, trembling 1 px, hands 1 px further apart. | shout | Hair/tails: second flicker shape |
| f2 | `beamCharge_02` | loop | Same, trembling back. | shout |  |

<a id="beamfire"></a>

### `beamFire`: firing the Rasen Cannon (loop)

3 frames · loops · **CORE** · bodyHeight 131 · ms 50/50/50 · prompt A17

Holding the beam. The engine draws the beam from just in front of his palms.

- **Strike target:** The beam starts about 0.8 units in front of him at chest height: palms at about x 162, y 100.
- **Hair and cloth:** Recoil wind: hair and tails blown straight back hard.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `beamFire_00` | loop | Firing: both arms thrust straight forward horizontally at chest height, heels of the palms together, palms open and facing the target, fingers spread; wide braced stance (L leg forward and bent, R leg straight behind pushing against the recoil); torso leaning forward about 14°; head between the arms, eyes on the target. | shout | QA: palms x 162 ±6, y 100 |
| f1 | `beamFire_01` | loop | Same, recoil tremble: arms 1 px back, rear heel slides 1 px. | shout |  |
| f2 | `beamFire_02` | loop | Same, tremble forward. | shout |  |

<a id="vanish"></a>

### `vanish`: crouch before teleporting

2 frames · plays once · optional · bodyHeight 146 · ms 50/50 · prompt A34

Vanish (1 bar): he blinks out in a smoke puff and reappears behind the opponent with the spinning kick (light4). The engine adds the smoke, lines and afterimage.

- **Hair and cloth:** Hair and tails flick upward on f1.
- **QA:** Height 146 because f1 is stretched up on the toes.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `vanish_00` | — | Quick crouch: knees bent about 60°, torso pitched forward about 20°, arms tucked close, eyes locked on the target. | focused, sharp |  |
| f1 | `vanish_01` | — | Snap stretch: up on the toes, body stretched tall, arms straight down at the sides, about to blink out. | smirk | Hair/tails: hair and tails flick up |

<a id="special"></a>

### `special`: RASENGAN rush

8 frames · phases 3/3/2 (startup f0–f2, active f3–f5, recovery f6–f7) · plays once · **CORE** · bodyHeight 135 · ms 120/120/120/120/120/160/110/70 · prompt A18

Signature rush (1 bar): form the Rasengan in the R palm, ninja-run in, and thrust it into the opponent. The engine draws the spinning orb at his palm, so the hand stays EMPTY in these frames.

- **Strike target:** f0–f4: R palm held at about x 148, y 116 (where the engine draws the orb). f5 thrust: arm extended, body lunging, R palm at about x 152 to 158, y 112 to 118 (aim (156, 112)). The engine keeps the orb at (148, 118) on every frame, thrust included, and the full-size orb is about 58 px across, so the palm must stay within ~10 px of that point or the orb floats on the forearm. Do NOT draw the Rasengan sphere: leave the cupped palm empty.
- **Hair and cloth:** Chakra wind lifts the hair and tails on f0–f2; they stream back on f3–f5.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `special_00` | startup | Forming: wide low stance, torso leaning forward about 16°; R hand held out in front at belt height, palm UP and cupped; L hand hovering just above it palm DOWN, fingers spread, circling over the R palm (kneading the chakra). | focused shout, eyes intense | QA: R palm ~x 146, y 118 |
| f1 | `special_01` | startup | Still forming: the L hand has circled to the far side of the R palm; knees deeper, body leaning forward about 18°. | shout |  |
| f2 | `special_02` | startup | Ready: L hand pulled away and back; R palm now turned FORWARD, cupped as if holding a ball about the size of his head; body coiled low to sprint, L foot forward. | confident determined grin |  |
| f3 | `special_03` | **active** | Rush (ninja run): torso pitched forward about 32°; R arm extended forward at waist/chest height with the cupped palm facing forward; L arm trailing straight back; legs in the run contact pose (L foot forward). | shout | QA: R palm ~x 152, y 114 |
| f4 | `special_04` | **active** | Rush: same arms, legs in the passing/flight position (R knee forward). | shout |  |
| f5 | `special_05` | **active** | THRUST: short planted lunge with the L leg forward and the R leg straight behind (the palm must not travel past the orb point); torso rotated so the right shoulder leads (chest toward the viewer); R arm fully extended palm-first into the opponent's stomach/chest; L arm flung back. | shout ("RASENGAN!") | **Smear:** solid streak behind the R forearm · QA: R palm x 152–158 (aim 156), y 112–118 (aim 112) |
| f6 | `special_06` | recovery | Follow-through: R arm still extended but relaxing, torso rising, weight on the front leg. | fierce |  |
| f7 | `special_07` | recovery | Recovering toward the stance, R arm pulling back into the guard. | cocky smirk |  |

---

## Attitude

<a id="intro"></a>

### `intro`: shadow-clone hand seal (loop)

4 frames · loops · optional · bodyHeight 139 · ms 150/150/150/150 · prompt A37

Pre-fight intro pose. (A future engine hook can poof shadow clones in beside him; see MOVES_AND_VFX.md.)

- **Hair and cloth:** Headband tails and jacket hem flapping in the wind; hair spikes bob 1 px.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `intro_00` | loop | Shadow-clone seal: feet planted about shoulder width (L forward), slight forward lean; both hands in front of the chest forming the cross-shaped seal: index and middle fingers of both hands extended and crossed in a "+" (R hand fingers vertical, L hand fingers horizontal), other fingers curled; elbows out. | determined smirk, eyes on the opponent |  |
| f1 | `intro_01` | loop | Same, body 1 px lower (breath). | determined smirk | Hair/tails: tails flip to a second shape |
| f2 | `intro_02` | loop | Same as f0, hair spikes 1 px up. | determined smirk |  |
| f3 | `intro_03` | loop | Same as f1 with the jacket hem fluttering. Flows into f0. | determined smirk |  |

<a id="taunt"></a>

### `taunt`: pointing "Believe it!" taunt (loop)

2 frames · loops · optional · bodyHeight 140 · ms 250/250 · prompt A38

Taunt.

- **Hair and cloth:** Hair bounce 1 px on f1.
- **QA:** Finger tip about x 168, y 90.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `taunt_00` | loop | Pointing: R arm thrust straight forward, index finger pointing at the opponent, L fist planted on the hip; chest out, leaning back slightly; feet planted casually. | huge confident grin, teeth showing |  |
| f1 | `taunt_01` | loop | Same, mouth open shouting, finger 2 px higher. | grin, shouting |  |

<a id="win"></a>

### `win`: fist-pump victory (loop)

4 frames · loops · **CORE** · bodyHeight 140 · ms 110/90/260/180 · prompt A23

Victory pose after the match.

- **Hair and cloth:** Hair spikes bounce up 2 px on f2; tails swing.
- **QA:** At the top of the pump the fist is no more than ~5 px above the hair tips (keeps the 140 px bodyHeight).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `win_00` | loop | Chamber: R fist pulled down to the chest, elbow bent down, knees dipping slightly; L fist clenched low at his side. | big grin, eyes squinting |  |
| f1 | `win_01` | loop | Pump: R arm punches straight up overhead; body stretched up on the toes. | mouth wide open shouting ("Yosh!") |  |
| f2 | `win_02` | loop | Hold the raised fist. | eyes closed in happy arcs, huge grin | Hair/tails: spikes bounce up 2 px |
| f3 | `win_03` | loop | Arm lowering slightly (fist at head height), settling. Flows back into the chamber. | grin |  |

---

## Changing an animation

- Frame counts and phases come from `src/art/animGuide.js` and `art/manifest.json`. If a strip comes
  out better with a different frame count, that's allowed (the engine spreads frames over the move
  phases), but update the manifest entry (`frames`, `phases`) and this file together, and say so
  in CHANGELOG.md.
- Keep the active frames' strike targets. They are tuned to the move ranges in
  `src/game/moves.js`. If a move feels like it whiffs at close range, check the hitbox in the
  Sprite Lab before redrawing. A `hitboxes.json` override may be all it needs (MOVES_AND_VFX.md §6).
