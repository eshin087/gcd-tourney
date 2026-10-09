# Naruto: animations, frame by frame

> Every animation the engine knows, with the exact pose of every frame, for **art spec v2**
> (Shippuden design, about 6.5 heads tall, 256×256 cells). Read [CHARACTER.md](CHARACTER.md) first
> (look, palette, landmarks, R/L convention). Technical rules:
> [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md) and [art/SPEC.md](../../SPEC.md).
> If this file disagrees with them, **ADR 0007 / SPEC.md win**. Fix this file.
> Frame counts and phases match the canonical list in `src/art/animGuide.js`. Gameplay timing (how
> long each phase lasts) lives in `src/game/moves.js`; the engine stretches the startup / active /
> recovery frames over those phases, so the art only has to put the right pose in the right phase.
> Image prompts for each strip: [PROMPTS.md](PROMPTS.md) (prompt ids in the table below).

## How to read this file

- **f0, f1, ...** are 0-based frame numbers in strip order, left to right: the same numbers as the
  file names (f0 = `<anim>_00.png`, f1 = `<anim>_01.png`, ...: the "file" column), the
  `hitboxes.json` frame keys and the SPEC.md active-frame numbers. In the image prompts, "pose 1" /
  "frame 1" is f0.
- **Phase** (attacks only): *startup* (wind-up, no hitbox), **active** (the hitbox is live; the limb is
  fully extended here), *recovery* (coming back). `key` / `loop` / `—` for everything else.
- **R / L** are Naruto's own right / left. Facing right in the 3/4 view, **R = near** (closest to the
  camera, drawn in front) and **L = far** (partly behind the torso). Stance: L foot and L fist lead.
- **x / y** numbers are final-cell pixels (256×256, x from the left, y from the top, soles on
  y 240, body center line x 128) at the idle scale from CHARACTER.md §3. They go in the **QA** notes
  for Codex and Claude when checking packed frames in the Sprite Lab. The image generator never sees
  pixel numbers; PROMPTS.md describes the same poses in words.
- **Contact zone** (bold in "Strike target"): the ADR 0007 box the striking point must reach on the
  active frames (the same table as SPEC.md "Strikes and contact zones").
- **Smear**: a solid stretched shape in the limb's own colors that shows speed on the first active
  frame. Hard pixels, no blur, no transparency, one frame only.
- **2 images**: strips with 6 or more frames are generated in two parts (part A, part B) and
  stitched, so each 6.5-head figure stays big enough (PROMPTS.md, art/PIPELINE.md "Long strips").

## Rules for every strip

1. **Facing right, 3/4 view**, camera about 12° above. Body turned about 35° toward the camera,
   head a bit more so both eyes show. The same head size (about 31 px), the same **~6.5-head
   proportions** (never chibi), the same Shippuden outfit and palette in every frame.
2. **Baseline.** Grounded poses: soles on the floor line. Airborne and lying poses: the lowest body
   point sits on the floor line too. The packer aligns every frame's lowest opaque pixel to y 240
   and the engine moves the sprite in the air, so show height with the pose, not with position.
   In air attacks, never let a fist or foot go lower than the lowest foot, or the body jumps.
3. **Centering.** The packer puts the mean x of the bottom 20% of each frame on x 128. Keep the
   hips over the midpoint between the feet so the body does not slide between frames. In airborne
   and lying poses put the lowest part of the body near the **middle** of the shape (the knees in
   `superDash`, the hips in `launched`, the whole back in `down` / `ko`), or the packer shifts the
   frame sideways and clips it.
4. **Active frames: what you see is what hits.** The packer builds each active frame's hitbox from
   the part of the silhouette that reaches past the idle front edge (idle bbox right edge minus
   9 px, about x 174). A hit lands only when that box overlaps the opponent's hurtbox **and** both
   fighters are in the same depth lane. So:
   - the striking limb (fist, foot, palm) must be **fully extended** toward screen-right, inside its
     contact zone, and must be the right-most thing in the frame;
   - head, bangs, side locks and headband tails stay behind about x 172 on active frames (tails
     trail left);
   - a limb that stops short whiffs, and a limb drawn through the opponent's body is exactly where
     the hit spark appears.
5. **Strike direction.** Punches, kicks and palms travel horizontally toward screen-right. The
   uppercut travels up-forward and the air hammer down-forward. Both end **in front of** his body.
6. **Stay inside the cell.** After packing, every opaque pixel fits within **x 4 to 251 and y 4 to
   240** (the cell margin). Realistic limbs are long: the contact zones already fit the cell, and the
   ADR 0007 pose notes keep the wide poses inside (`superDash` angled about 25° up with bent knees,
   about 230 px long; `down` / `ko` lying flat with the head toward screen-left, about 210 px long;
   `launched` arched diagonally). On wide poses bend knees and elbows; never shrink the body.
7. **Realistic anatomy.** Hands about the size of the face, feet about the length of the forearm,
   long legs (the crotch at about half the body height), defined shoulders. No oversized head, hands
   or feet, and no rubbery limbs: squash and stretch only by the 1 to 2 px noted per frame.
8. **No effects in body sprites.** No Rasengan orb, aura, beam, smoke, speed lines, impact
   sparks or ground shadow: the engine draws all of those (see MOVES_AND_VFX.md). The only prop is
   the three shuriken in his hand on `throw` f0.
9. **Loops** (`loop` = yes): the last frame flows back into f0 without a pop.
10. **Hair and cloth** follow CHARACTER.md §6: stiff spikes that squash and stretch 1 to 2 px, side
    locks and headband tails that lag one frame and react to motion, a stiff collar.

## All animations

38 animations, 154 frames in total (10 rows of the 16-column sheet).
**CORE** animations must all exist before the game uses the custom sheet (`"complete": true`).
Everything else falls back to a similar animation when missing.
`bodyHeight` is the tallest trimmed frame of the strip in final pixels (the packer scales each strip
to it; values from ADR 0007). "ms" is the intended per-frame feel. The values in `art/manifest.json`
are authoritative, and attacks are time-stretched over the move phases anyway.

| anim | what | frames | phases S/A/R | loop | CORE | bodyHeight | ms per frame | prompt | images |
|---|---|---|---|---|---|---|---|---|---|
| [`idle`](#idle) | fighting stance (breathing loop) | 8 |  | yes | **CORE** | 204 | 150, 150, 150, 150, 150, 150, 150, 150 | A01 | 2 (A + B) |
| [`run`](#run) | ninja run (loop) | 8 |  | yes | **CORE** | 204 | 60, 60, 60, 60, 60, 60, 60, 60 | A02 | 2 (A + B) |
| [`dash`](#dash) | low forward dash (loop) | 2 |  | yes | **CORE** | 160 | 60, 60 | A19 | 1 |
| [`superDash`](#superdash) | homing super dash, flying like a missile (loop) | 2 |  | yes |  | 120 | 50, 50 | A25 | 1 |
| [`backDash`](#backdash) | quick hop backward | 3 |  |  |  | 207 | 60, 60, 80 | A24 | 1 |
| [`jumpSquat`](#jumpsquat) | pre-jump crouch | 1 |  |  |  | 162 | 70 | A26 | 1 |
| [`jumpUp`](#jumpup) | rising (loop) | 2 |  | yes | **CORE** | 198 | 80, 80 | A20 | 1 |
| [`jumpFall`](#jumpfall) | falling (loop) | 2 |  | yes | **CORE** | 209 | 80, 80 | A21 | 1 |
| [`land`](#land) | landing | 2 |  |  | **CORE** | 174 | 50, 70 | A22 | 1 |
| [`airRecover`](#airrecover) | mid-air backflip recovery | 3 |  |  |  | 180 | 50, 50, 60 | A32 | 1 |
| [`light1`](#light1) | jab with the lead (L) fist | 7 | 2/2/3 |  | **CORE** | 204 | 30, 30, 40, 50, 50, 50, 30 | A03 | 2 (A + B) |
| [`light2`](#light2) | rear straight with the R (near) fist | 7 | 2/2/3 |  | **CORE** | 204 | 35, 30, 40, 50, 60, 50, 30 | A04 | 2 (A + B) |
| [`light3`](#light3) | front push-kick with the R (rear) leg | 7 | 2/2/3 |  | **CORE** | 215 | 40, 35, 45, 60, 60, 60, 30 | A05 | 2 (A + B) |
| [`light4`](#light4) | spinning roundhouse finisher with the R leg | 8 | 3/2/3 |  | **CORE** | 207 | 50, 45, 35, 40, 70, 70, 70, 40 | A06 | 2 (A + B) |
| [`heavy`](#heavy) | rising uppercut launcher with the R fist | 8 | 3/2/3 |  | **CORE** | 218 | 40, 35, 30, 50, 70, 70, 60, 30 | A07 | 2 (A + B) |
| [`airLight1`](#airlight1) | mid-air jab with the L fist | 5 | 1/2/2 |  | **CORE** | 198 | 45, 35, 50, 50, 30 | A08 | 1 |
| [`airLight2`](#airlight2) | mid-air front kick with the R leg | 5 | 1/2/2 |  |  | 207 | 45, 40, 50, 50, 30 | A27 | 1 |
| [`airLight3`](#airlight3) | mid-air spinning back-heel kick with the L leg | 6 | 2/2/2 |  |  | 201 | 50, 40, 50, 70, 60, 30 | A28 | 2 (A + B) |
| [`airHeavy`](#airheavy) | double-fist hammer spike | 6 | 2/2/2 |  | **CORE** | 198 | 50, 45, 45, 70, 70, 40 | A09 | 2 (A + B) |
| [`throw`](#throw) | mid-air shuriken throw (R hand) | 4 | 1/1/2 |  |  | 201 | 50, 60, 70, 50 | A33 | 1 |
| [`guard`](#guard) | cross-arm block (loop) | 2 |  | yes | **CORE** | 198 | 300, 300 | A10 | 1 |
| [`block`](#block) | pushed back while blocking | 2 |  |  |  | 204 | 60, 80 | A29 | 1 |
| [`hurtHigh`](#hurthigh) | hit in the face | 3 |  |  | **CORE** | 195 | 70, 90, 100 | A11 | 1 |
| [`hurtLow`](#hurtlow) | hit in the stomach | 3 |  |  |  | 183 | 70, 90, 100 | A30 | 1 |
| [`launched`](#launched) | knocked flying backward (loop) | 2 |  | yes | **CORE** | 136 | 70, 70 | A12 | 1 |
| [`spin`](#spin) | tumbling backward (loop) | 4 |  | yes |  | 160 | 60, 60, 60, 60 | A31 | 1 |
| [`down`](#down) | slammed down, then lying on the back | 2 |  |  | **CORE** | 96 | 80, 420 | A13 | 1 |
| [`ko`](#ko) | knocked out | 1 |  |  |  | 64 | 500 | A36 | 1 |
| [`getup`](#getup) | kip-up | 5 |  |  | **CORE** | 204 | 70, 60, 60, 80, 70 | A14 | 1 |
| [`stagger`](#stagger) | dazed stagger (loop) | 4 |  | yes |  | 207 | 150, 150, 150, 150 | A35 | 1 |
| [`charge`](#charge) | powering up (loop) | 4 |  | yes | **CORE** | 198 | 50, 50, 50, 50 | A15 | 1 |
| [`beamCharge`](#beamcharge) | charging the Rasen Cannon (loop) | 3 |  | yes | **CORE** | 198 | 50, 50, 50 | A16 | 1 |
| [`beamFire`](#beamfire) | firing the Rasen Cannon (loop) | 3 |  | yes | **CORE** | 198 | 50, 50, 50 | A17 | 1 |
| [`vanish`](#vanish) | crouch before teleporting | 2 |  |  |  | 221 | 50, 50 | A34 | 1 |
| [`special`](#special) | RASENGAN rush | 8 | 3/3/2 |  | **CORE** | 204 | 120, 120, 120, 120, 120, 160, 110, 70 | A18 | 2 (A + B) |
| [`intro`](#intro) | shadow-clone hand seal (loop) | 4 |  | yes |  | 210 | 150, 150, 150, 150 | A37 | 1 |
| [`taunt`](#taunt) | pointing taunt (loop) | 2 |  | yes |  | 212 | 250, 250 | A38 | 1 |
| [`win`](#win) | fist-pump victory (loop) | 4 |  | yes | **CORE** | 212 | 110, 90, 260, 180 | A23 | 1 |

## Air base pose

All air attacks (`airLight1`, `airLight2`, `airLight3`, `airHeavy`, `throw`) start and end in the
same **air base pose**: L knee drawn up high in front, R leg hanging lower and slightly behind with the knee bent, torso upright and leaning slightly forward, both fists in a loose guard at chest height, headband tails trailing behind and slightly up. Draw it as the first and last frame of each air strip so the air
combo chains smoothly. The lowest point (the hanging R foot) sits on the baseline.

---

## Locomotion

<a id="idle"></a>

### `idle`: fighting stance (breathing loop)

8 frames · loops · **CORE** · bodyHeight 204 · ms 150/150/150/150/150/150/150/150 · prompt A01 (2 images: f0–f3 + f4–f7)

The neutral stance and the key pose for the whole sheet. Every other animation starts and ends close to f0. It must read instantly as a serious, athletic fighter: grounded, balanced, ready to drive forward.

- **Hair and cloth:** A small breathing bob done with the knees only (feet never move). Hair spikes and side locks lag the body by one frame. Headband tails hang behind the head and sway gently; the jacket hem moves 1 px with the breath.
- **QA:** Landmarks per CHARACTER.md §3: hair top y 36, skull top y 52, eyes y 66-70, chin y 83, shoulders y 92, crotch y 152, knees y 196, soles y 240 (trimmed height about 204 px, head about 31 px). L (lead) fist about (176, 86), R fist about (154, 98). Idle front edge about x 182: nothing in idle reaches further right (the packer finds attack hitboxes from this edge minus 9 px, about x 174). Feet: L toes about x 176, R heel about x 84.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `idle_00` | key | KEY POSE. Orthodox fighting stance: L (lead) foot forward with the toes pointing right, R foot back and turned out about 45°, feet a little wider than the shoulders, knees bent about 20°, weight centered on the balls of the feet. Torso upright with a slight forward lean, chest turned about 35° toward the viewer, shoulders relaxed and broad. L fist up in front at chin height, elbow down and tucked; R fist guarding beside the right jaw, elbow covering the ribs. | determined: brows slightly lowered, eyes locked on the opponent (right), mouth closed in a firm line | Hair/tails: neutral; headband tails hang behind the head to about the middle of the back |
| f1 | `idle_01` | loop | Exhale: knees bend a little more, shoulders and both fists drop slightly. | determined | Hair/tails: spikes still at f0 height (lag); tails swing slightly left |
| f2 | `idle_02` | loop | Lowest point: knees bent the most, torso sunk lowest, fists lowest, chest slightly compressed. | determined | Hair/tails: spikes drop 1 px |
| f3 | `idle_03` | loop | Hold the lowest point; shoulders roll forward a touch. | determined | Hair/tails: spikes settle 1 px more (follow-through); tails at their furthest left |
| f4 | `idle_04` | loop | Inhale: body rises (knees straighten a little), fists rise. | determined | Hair/tails: spikes still low (lag) |
| f5 | `idle_05` | loop | Back to f0 height, chest lifted slightly. | determined | Hair/tails: spikes rise; tails swing back |
| f6 | `idle_06` | loop | Same as f0, but the L fist flicks forward a little, a small ready twitch (no further right than in f0). | determined, eyes slightly narrower | Hair/tails: spikes 1 px above neutral (overshoot) · QA: L fist still ≤ x 182 |
| f7 | `idle_07` | loop | Same as f0 (flows straight back into f0). | determined | Hair/tails: spikes and tails back to the f0 position |

<a id="run"></a>

### `run`: ninja run (loop)

8 frames · loops · **CORE** · bodyHeight 204 · ms 60/60/60/60/60/60/60/60 · prompt A02 (2 images: f0–f3 + f4–f7)

His ninja run: torso pitched far forward, both arms trailing straight back, long powerful strides. With 6.5-head proportions the stride is long, so keep it inside the cell.

- **Hair and cloth:** Torso pitched forward about 40° for the whole cycle, head raised and looking ahead. Both arms stay extended straight back behind the body, slightly raised, hands open and flat with fingers together; they bob up and down 2 px. Hips stay over the midpoint between the feet. Hair, side locks and headband tails stream straight back (left) the whole time, tails waving up and down; the jacket hem and pant legs flap back.
- **QA:** The R leg (near) is drawn over the L leg where they overlap. Keep the hips over the midpoint between the feet so the packer's feet-center alignment does not make the body slide between frames. The longest frames (f3, f7) stay inside x 4-251: front knee or foot and head reach about x 200-215, the trailing arms and the back foot about x 30-60.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `run_00` | loop | Contact: L foot reaching forward, heel touching down well ahead of the hips; R leg extended far back, toes pushing off. Arms straight back. | focused, mouth closed |  |
| f1 | `run_01` | loop | Down: L foot flat under the hips, L knee bent about 45° absorbing the weight; R leg swinging forward with the knee bent and the foot high behind. Body at its lowest. Arms 2 px lower. | focused |  |
| f2 | `run_02` | loop | Passing: R knee drives forward past the L leg up to hip height; L leg straightening behind and pushing off; body rising. | focused |  |
| f3 | `run_03` | loop | Flight: both feet off the ground; R thigh horizontal in front, L leg extended straight back with pointed toes; longest stride. Arms 2 px higher. | focused, mouth slightly open | QA: longest frame: inside x 4-251 |
| f4 | `run_04` | loop | Contact (mirror of f0): R foot reaching forward to touch down; L leg extended back, pushing off. | focused |  |
| f5 | `run_05` | loop | Down (mirror of f1): R foot flat under the hips, knee bent; L leg swinging forward, foot high behind. Arms 2 px lower. | focused |  |
| f6 | `run_06` | loop | Passing (mirror of f2): L knee drives forward to hip height; R leg pushing off behind. | focused |  |
| f7 | `run_07` | loop | Flight (mirror of f3): L thigh horizontal in front, R leg extended back. Flows back into f0. | focused, mouth slightly open | QA: longest frame: inside x 4-251 |

<a id="dash"></a>

### `dash`: low forward dash (loop)

2 frames · loops · **CORE** · bodyHeight 160 · ms 60/60 · prompt A19

Fast forward dash along the ground. The engine adds dust and a ring burst.

- **Hair and cloth:** Hair spikes, side locks and headband tails swept flat back; jacket hem flapping.
- **QA:** Height about 160 px (lower than idle). Total length about 235 px or less (inside x 4-251).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `dash_00` | loop | Torso pitched forward about 50° (chest low), head up looking at the opponent; arms trailing straight back like the ninja run but lower and closer to the body; L leg reaching far forward with the knee bent about 60°, foot skimming the ground; R leg extended straight back, toes dragging. A long, low, driving silhouette. | fierce, teeth just showing | QA: length ≤ ~235 px |
| f1 | `dash_01` | loop | Same, legs a little wider apart and the R toes lifted (pushing again); arms 2 px higher. | fierce | Hair/tails: tails flutter to a second shape |

<a id="superdash"></a>

### `superDash`: homing super dash, flying like a missile (loop)

2 frames · loops · optional · bodyHeight 120 · ms 50/50 · prompt A25

DBFZ-style homing flight that hits on contact. The engine moves him through the air and adds dash bursts. ADR 0007 pose note: angled about 25° upward with the knees bent, so the realistic body fits the 256 cell.

- **Hair and cloth:** Hair spikes, side locks and headband tails swept flat back (left) and fluttering between frames; jacket hem flapping.
- **QA:** R fist is the front-most point (about x 240). The whole pose is about 230 px long and 120 px tall: bend the knees, never stretch the legs out straight, or it clips the 256 cell.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `superDash_00` | loop | Flying toward the upper right like a missile: body angled about 25° upward (head higher than the hips), R arm thrust straight ahead past the head with the fist leading, L arm tucked back along his side, head tucked between the shoulders looking forward; knees bent sharply under the hips as if kneeling in the air, so the knees are the lowest point, under the middle of the shape; shins and feet trail back and up. | fierce, teeth gritted | QA: R fist ~x 240; length ~230 px; if the packed frame shifts sideways, the lowest point is not near the middle |
| f1 | `superDash_01` | loop | Same, the knees still the lowest point under the middle, the shins slightly scissored (R shin higher); L arm 2 px lower. | fierce, teeth gritted | Hair/tails: tails flutter to a second shape |

<a id="backdash"></a>

### `backDash`: quick hop backward

3 frames · plays once · optional · bodyHeight 207 · ms 60/60/80 · prompt A24

Short evasive hop away from the opponent.

- **Hair and cloth:** He moves left, so hair, side locks and tails flow forward (right) in the air.
- **QA:** Lowest point always on the baseline. Show the direction with the lean, not with height.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `backDash_00` | — | Push-off: weight on the L (lead) foot, which shoves backward; torso upright and leaning back slightly; R leg already lifting behind; arms in a tight guard close to the chest. | alert, eyes on the opponent |  |
| f1 | `backDash_01` | — | Airborne hop backward: both knees tucked (L knee higher), torso leaning back, arms opening a little for balance (L arm forward, R arm back and down). | focused | Hair/tails: hair and tails flow forward (right) |
| f2 | `backDash_02` | — | Descending: legs extending down to land, R (rear) foot reaching back and down for the landing, L leg slightly bent in front; arms returning to the guard. | determined | Hair/tails: tails dropping back behind the head |

<a id="jumpsquat"></a>

### `jumpSquat`: pre-jump crouch

1 frame · plays once · optional · bodyHeight 162 · ms 70 · prompt A26

One-frame crouch right before leaving the ground.

- **Hair and cloth:** Hair spikes compressed 2 px; tails droop.
- **QA:** Height about 162 px.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `jumpSquat_00` | — | Deep crouch: knees bent about 90°, torso leaning forward, both arms swung down and back behind the hips (ready to swing up), heels down, head up looking at the target. | focused |  |

<a id="jumpup"></a>

### `jumpUp`: rising (loop)

2 frames · loops · **CORE** · bodyHeight 198 · ms 80/80 · prompt A20

Going up during a jump or super jump.

- **Hair and cloth:** Air rushes past while rising: hair spikes and tails are dragged DOWN-left.
- **QA:** Lowest point (the hanging R foot) on the baseline; the raised R fist must not end far above the hair (bodyHeight 198).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `jumpUp_00` | loop | Rising: body stretched upward; L knee pulled high in front (thigh above horizontal), R leg bent below and behind; R arm swung up-forward (fist at about head height, in front of the face), L arm swung down and back; torso upright. | focused, mouth closed | Hair/tails: tails dragged down-left |
| f1 | `jumpUp_01` | loop | Same, R arm 2 px higher, legs tucked 2 px tighter. | focused | Hair/tails: tails flutter to a second shape |

<a id="jumpfall"></a>

### `jumpFall`: falling (loop)

2 frames · loops · **CORE** · bodyHeight 209 · ms 80/80 · prompt A21

Coming down from a jump.

- **Hair and cloth:** Falling: hair spikes, side locks and headband tails float UP.
- **QA:** Lowest point (the toes) on the baseline.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `jumpFall_00` | loop | Falling: legs extending down toward the floor, L leg in front slightly bent, R leg behind and straighter, toes pointing down; both arms spread out sideways for balance (R arm forward and up, L arm back), elbows soft; torso upright. | focused, looking down-forward | Hair/tails: tails lifted up |
| f1 | `jumpFall_01` | loop | Same, arms 2 px higher and feet 2 px further apart. | focused | Hair/tails: tails flutter to a second shape |

<a id="land"></a>

### `land`: landing

2 frames · plays once · **CORE** · bodyHeight 174 · ms 50/70 · prompt A22

Touch-down from any jump.

- **Hair and cloth:** Squash and settle: hair spikes squash down 2 px on f0, rebound 1 px on f1; tails slap down.
- **QA:** Height about 174 px on f1 (f0 is lower).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `land_00` | — | Impact squash: knees deeply bent, feet planted wide (L forward, R back), torso pitched forward about 20°, arms out low to the sides for balance, head tucked. | eyes half closed, teeth gritted (impact) | Hair/tails: spikes squashed 2 px, tails slap down |
| f1 | `land_01` | — | Rising halfway back to the stance: knees bent about 40°, arms coming back up toward the guard, head up. | focused | Hair/tails: spikes rebound 1 px |

<a id="airrecover"></a>

### `airRecover`: mid-air backflip recovery

3 frames · plays once · optional · bodyHeight 180 · ms 50/50/60 · prompt A32

Breaking out of a juggle: a tight backflip back to control.

- **Hair and cloth:** Hair and tails trail opposite to the spin.
- **QA:** Lowest point of every frame on the baseline; keep the tuck compact (about 120-130 px across); f2 (legs extending) is the tallest frame (bodyHeight 180).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airRecover_00` | — | Backflip starts: body curled into a tight tuck (knees to chest, arms hugging the shins), rotated about 60° backward (head tilting toward screen-left). | eyes shut tight |  |
| f1 | `airRecover_01` | — | Upside down: the same tuck rotated about 200° (head at the bottom-left, feet up-right). | eyes squeezed shut |  |
| f2 | `airRecover_02` | — | Almost upright (about 340°): legs extending down, arms opening out to the sides, ready to land. | focused, eyes open |  |

---

## Ground attacks (auto combo and launcher)

<a id="light1"></a>

### `light1`: jab with the lead (L) fist

7 frames · phases 2/2/3 (startup f0–f1, active f2–f3, recovery f4–f6) · plays once · **CORE** · bodyHeight 204 · ms 30/30/40/50/50/50/30 · prompt A03 (2 images: f0–f3 + f4–f6)

First hit of the auto combo (Light ×4). Fast and snappy: a long, straight lead-hand jab. The engine lunges him forward a little.

- **Strike target:** f2–f3: L fist tip in the contact zone **x 206-226, y 64-86** (aim about x 216, y 76: the opponent's face). Only the L forearm and fist go past the idle front edge (about x 182).
- **Hair and cloth:** Hair spikes jolt 1 px forward on f2 and settle on f4. Tails whip 2 px on f2 (still behind the head); sleeve folds snap forward.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `light1_00` | startup | Anticipation: L fist draws back slightly toward the chin, shoulders turn a touch toward the viewer (coiling), weight shifts onto the R (rear) leg. | focused, eyes narrowed |  |
| f1 | `light1_01` | startup | The L arm starts to fire: elbow rising toward shoulder height and pointing forward, fist halfway out, knuckles turning over; L shoulder rolling forward, torso turning to lead with the left side; R fist still guarding the jaw. | fierce, teeth gritted | QA: L fist ~x 194, y 80 |
| f2 | `light1_02` | **active** | IMPACT: L arm fully extended toward the right at face height (the opponent's nose and eyes), the fist slightly above his own shoulder line, clenched with the knuckles forward and the palm facing down; L shoulder raised to protect the chin; torso turned so the left side leads, leaning forward about 12°; L foot slid forward a short step, R heel lifted; R fist guarding the jaw. | fierce, short shout | **Smear:** the L forearm is stretched into a short, solid, tapered streak in the sleeve and skin colors behind the fist (hard pixels, no blur) · QA: L fist tip x 216 ±8, y 76 (zone x 206-226, y 64-86); smear 15-20 px |
| f3 | `light1_03` | **active** | Hold the extension (fist 2 px back from f2), clean arm without smear; sleeve folds snapped forward. | fierce | QA: fist tip ~x 214 |
| f4 | `light1_04` | recovery | Retract: L elbow bends to about 90°, fist pulled halfway back; torso starts turning back. | fierce | QA: fist ~x 196 |
| f5 | `light1_05` | recovery | Fist almost back at the chin, L foot sliding back, weight re-centering. | focused |  |
| f6 | `light1_06` | recovery | Back in the stance (same as idle f0). | determined | QA: within 1-2 px of idle f0 |

<a id="light2"></a>

### `light2`: rear straight with the R (near) fist

7 frames · phases 2/2/3 (startup f0–f1, active f2–f3, recovery f4–f6) · plays once · **CORE** · bodyHeight 204 · ms 35/30/40/50/60/50/30 · prompt A04 (2 images: f0–f3 + f4–f6)

Second hit of the auto combo: a heavier rear straight with full hip rotation.

- **Strike target:** f2–f3: R fist tip in the contact zone **x 214-236, y 70-92** (aim about x 226, y 82: the opponent's chin). Only the R forearm and fist go past the idle front edge (about x 182).
- **Hair and cloth:** Tails whip on f2 (behind the head); hair follow-through on f3.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `light2_00` | startup | Wind-up: R fist cocked back beside the right jaw, elbow back; torso twists further toward the viewer (right shoulder back); weight on the R (rear) leg; L fist guarding forward. | focused |  |
| f1 | `light2_01` | startup | Hips rotate first: R heel lifts, R elbow drives forward at chest height with the fist passing the chest; L arm begins pulling back toward the chest. | fierce | QA: R fist ~x 170 |
| f2 | `light2_02` | **active** | IMPACT: R arm fully extended straight forward at chin height (the opponent's chin), just above his own shoulder line, knuckles forward; hips and torso fully rotated so the chest squares to screen-right and the right shoulder leads, leaning forward about 15°; R heel up, pivoting on the ball of the foot; L fist pulled back tight to the left cheek. | shout, mouth wide | **Smear:** a short, solid, stretched streak behind the R forearm · QA: R fist tip x 226 ±8, y 82 (zone x 214-236, y 70-92); smear 15-20 px |
| f3 | `light2_03` | **active** | Hold (fist 2 px back), no smear. | fierce | QA: fist tip ~x 224 |
| f4 | `light2_04` | recovery | R arm retracting, elbow bent, fist halfway back; torso unwinding. | fierce | QA: fist ~x 204 |
| f5 | `light2_05` | recovery | R fist returning to the jaw; R heel down. | focused |  |
| f6 | `light2_06` | recovery | Back in the stance. | determined | QA: within 1-2 px of idle f0 |

<a id="light3"></a>

### `light3`: front push-kick with the R (rear) leg

7 frames · phases 2/2/3 (startup f0–f1, active f2–f3, recovery f4–f6) · plays once · **CORE** · bodyHeight 215 · ms 40/35/45/60/60/60/30 · prompt A05 (2 images: f0–f3 + f4–f6)

Third hit of the auto combo: a front push-kick with the rear leg, aimed at the stomach (the engine treats it as a low-ish hit).

- **Strike target:** f2–f3: R sandal sole in the contact zone **x 222-246, y 122-148** (aim about x 234, y 135: the opponent's stomach). Only the R leg goes past the idle front edge (about x 182). The back of the head, hair and tails stay inside x 4.
- **Hair and cloth:** Pant leg ripples on f3; tails swing forward a little on f2 as the torso leans back, but stay behind the head.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `light3_00` | startup | Weight shifts onto the L (lead) leg, which straightens; R heel lifts; arms tighten into the guard. | focused |  |
| f1 | `light3_01` | startup | Chamber: R knee lifted high in front to belly height, shin hanging down, foot flexed; torso leaning back slightly; L fist guarding the chin, R arm swinging back a little for balance. | fierce |  |
| f2 | `light3_02` | **active** | IMPACT: R leg thrust straight forward, horizontal at stomach height, the flat sole of the sandal facing the target (push kick), hips driven forward; torso leaning back about 18°; L (support) leg straight and planted on the baseline; L fist guarding the chin, R arm flung back for balance. | shout | **Smear:** a solid arc in the pant-leg colors trailing below and behind the shin · QA: R sole x 234 ±8, y 135 (zone x 222-246, y 122-148) |
| f3 | `light3_03` | **active** | Hold the extension (foot 2 px back), no smear; pant leg rippling. | fierce | QA: sole ~x 232 |
| f4 | `light3_04` | recovery | Re-chamber: knee bends, foot pulled back halfway. | fierce | QA: foot ~x 200 |
| f5 | `light3_05` | recovery | R foot stepping down behind into the rear position, torso coming upright. | focused |  |
| f6 | `light3_06` | recovery | Back in the stance. | determined | QA: within 1-2 px of idle f0 |

<a id="light4"></a>

### `light4`: spinning roundhouse finisher with the R leg

8 frames · phases 3/2/3 (startup f0–f2, active f3–f4, recovery f5–f7) · plays once · **CORE** · bodyHeight 207 · ms 50/45/35/40/70/70/70/40 · prompt A06 (2 images: f0–f4 + f5–f7)

Last hit of the auto combo: a big spinning roundhouse that launches and wall-bounces. Also used by the vanish kick.

- **Strike target:** f3–f4: R foot and shin in the contact zone **x 224-248, y 56-88** (aim about x 236, y 72: the opponent's head). A head-high kick needs the torso to lean far back so the hip moves forward; the foot must still be the right-most point. Only the R leg goes past the idle front edge (about x 182); the head and the flung-back arm stay inside x 4.
- **Hair and cloth:** Headband tails whip around with the spin: out in front of the body on f2, then flung back behind the head (left) on f3-f4 so nothing but the leg is forward. Hair spikes squash toward the spin direction on f3.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `light4_00` | startup | Wind-up: knees bend, torso twists toward the viewer (coil), R shoulder back, arms tucked near the chest, weight on the L (lead) foot. | focused, determined |  |
| f1 | `light4_01` | startup | Spin starts: pivoting on the ball of the L foot, the body turns away from the viewer so we see his right side and the black upper back of the jacket; R heel lifting behind. | eyes visible over the shoulder |  |
| f2 | `light4_02` | startup | Mid-spin: back toward the viewer (black upper back and the red spiral emblem visible), head turned to look over the left shoulder toward screen-right, R knee chambered high at hip level, arms tucked. | one eye visible, fierce | Hair/tails: tails swing out in front of the body |
| f3 | `light4_03` | **active** | IMPACT: the body has come round to face screen-right again; R leg whipping horizontally at HEAD height, fully extended, instep and shin leading; torso leaning back about 30° away from the kick; L support leg straight, up on the ball of the foot; L arm swung forward-low and R arm flung back for balance. | shout | Hair/tails: tails flung back behind the head · **Smear:** a big solid crescent in the leg colors (orange pants, black sandal) sweeping behind the leg · QA: R foot x 236 ±8, y 72 (zone x 224-248, y 56-88) |
| f4 | `light4_04` | **active** | Hold the extension, smear gone. | shout | QA: R foot ~x 234, y 74 |
| f5 | `light4_05` | recovery | Leg dropping and folding at the knee, torso coming upright. | focused |  |
| f6 | `light4_06` | recovery | R foot lands behind, knees bent low, arms returning toward the guard. | focused |  |
| f7 | `light4_07` | recovery | Back in the stance. | determined | QA: within 1-2 px of idle f0 |

<a id="heavy"></a>

### `heavy`: rising uppercut launcher with the R fist

8 frames · phases 3/2/3 (startup f0–f2, active f3–f4, recovery f5–f7) · plays once · **CORE** · bodyHeight 218 · ms 40/35/30/50/70/70/60/30 · prompt A07 (2 images: f0–f4 + f5–f7)

The launcher: a rising uppercut that knocks the opponent straight up for an air combo. The engine adds a small hop.

- **Strike target:** f3: R fist in the contact zone **x 180-208, y 58-86** (aim about x 194, y 72: driving up into the opponent's chin, forearm nearly vertical). f4: R fist in the zone **x 160-188**, above his head but still in front of his face; its top is the highest point of the strip (about y 22 at bodyHeight 218), inside the ADR zone y 22-46. The fist must stay IN FRONT of his body on the active frames: an uppercut that only goes straight up over his own head cannot hit anyone.
- **Hair and cloth:** Hair spikes and tails flick UP on f3–f5 and drop on f6–f7.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `heavy_00` | startup | Anticipation crouch: knees bend deep, torso pitched forward about 24° and turned toward the viewer, R fist dropped low beside the R hip (cocked), L fist guarding forward at chest height. | focused, brows down |  |
| f1 | `heavy_01` | startup | Deepest squash: knees bent about 90°, R fist at its lowest near the R knee, eyes looking up at the target's chin. | fierce |  |
| f2 | `heavy_02` | startup | The explosion begins: legs driving straight, R fist rising forward past the belt, torso starting to rise. | fierce, mouth opening | QA: R fist ~x 176, y 140 |
| f3 | `heavy_03` | **active** | IMPACT: stepping in and rising onto the toes (heels off the ground), hips driving up; R upper arm driving forward with the elbow bent about 90° and the forearm nearly vertical, so the fist rises at chin height well IN FRONT of his body (a true uppercut, not a straight punch), knuckles toward him; L arm pulled down and back to the hip. | shout | **Smear:** a solid tapered streak below and behind the fist, following its upward arc · QA: R fist x 194 ±8, y 72 (zone x 180-208, y 58-86) |
| f4 | `heavy_04` | **active** | Follow-through: torso straightening and leaning back slightly, R arm extending up-forward at about 65°, fist above his head but still in front of his face; stretched up on the toes. | shout | QA: R fist x 160-188, top ~y 22 (highest point of the strip; ADR zone y 22-46) |
| f5 | `heavy_05` | recovery | Peak: R arm still raised up-forward, fist no higher than in f4; body fully stretched on the toes, legs together. | shout, eyes closed | QA: fist top no higher than f4 (bodyHeight 218) |
| f6 | `heavy_06` | recovery | Coming down: knees bending, R arm lowering to shoulder height. | focused |  |
| f7 | `heavy_07` | recovery | Back in the stance. | determined | QA: within 1-2 px of idle f0 |

---

## Air attacks

<a id="airlight1"></a>

### `airLight1`: mid-air jab with the L fist

5 frames · phases 1/2/2 (startup f0, active f1–f2, recovery f3–f4) · plays once · **CORE** · bodyHeight 198 · ms 45/35/50/50/30 · prompt A08

First hit of the air combo (Light ×3 in the air).

- **Strike target:** f1–f2: L fist tip in the contact zone **x 206-230, y 100-120** (aim about x 218, y 110: the opponent's chest).
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Tails trail behind and slightly down; hair jolts forward 1 px on f1.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airLight1_00` | startup | From the AIR BASE POSE: L fist pulled back to the chin, shoulders coiling toward the viewer. | focused |  |
| f1 | `airLight1_01` | **active** | IMPACT: L arm fully extended horizontally at chest height; torso turned to lead with the left side, leaning forward about 10°; R fist guarding the jaw; legs stay tucked. | shout | **Smear:** a solid streak behind the L forearm · QA: L fist tip x 218 ±8, y 110 (zone x 206-230, y 100-120) |
| f2 | `airLight1_02` | **active** | Hold the extension, no smear. | fierce | QA: fist tip ~x 216 |
| f3 | `airLight1_03` | recovery | L arm retracting, elbow bent. | focused |  |
| f4 | `airLight1_04` | recovery | Back to the AIR BASE POSE. | focused |  |

<a id="airlight2"></a>

### `airLight2`: mid-air front kick with the R leg

5 frames · phases 1/2/2 (startup f0, active f1–f2, recovery f3–f4) · plays once · optional · bodyHeight 207 · ms 45/40/50/50/30 · prompt A27

Second hit of the air combo.

- **Strike target:** f1–f2: R sole in the contact zone **x 220-246, y 130-155** (aim about x 233, y 142).
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Tails swing forward slightly as the torso leans back on f1, but stay behind the head.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airLight2_00` | startup | From the AIR BASE POSE: R knee chambered up to the chest, torso leaning back slightly. | focused |  |
| f1 | `airLight2_01` | **active** | IMPACT: R leg extended straight forward at hip height, sole facing the target; torso leaning back about 12°; L leg hanging bent below; arms pulled back and out for balance. | shout | **Smear:** a solid arc behind the shin · QA: R sole x 233 ±8, y 142 (zone x 220-246, y 130-155) |
| f2 | `airLight2_02` | **active** | Hold the extension, no smear. | fierce | QA: sole ~x 231 |
| f3 | `airLight2_03` | recovery | Knee folds back toward the chest. | focused |  |
| f4 | `airLight2_04` | recovery | Back to the AIR BASE POSE. | focused |  |

<a id="airlight3"></a>

### `airLight3`: mid-air spinning back-heel kick with the L leg

6 frames · phases 2/2/2 (startup f0–f1, active f2–f3, recovery f4–f5) · plays once · optional · bodyHeight 201 · ms 50/40/50/70/60/30 · prompt A28 (2 images: f0–f3 + f4–f5)

Third air hit: a spinning back-heel kick that knocks the opponent away (wall bounce).

- **Strike target:** f2–f3: L heel in the contact zone **x 222-248, y 105-150** (aim about x 235, y 128).
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Tails whip around with the spin and trail far behind (left) on f2.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airLight3_00` | startup | Twist: torso and hips turn away from the viewer (more of the back shows), L knee tucked to the chest, arms tight. | focused |  |
| f1 | `airLight3_01` | startup | Back fully toward the viewer (black upper back and the red spiral emblem visible), head turned looking over the shoulder at the target, both legs tucked. | one eye visible, fierce |  |
| f2 | `airLight3_02` | **active** | IMPACT: spun back round, the L leg whips out horizontally, fully extended at chest height with the heel leading; torso leaning back about 18°; R leg tucked underneath; arms flung wide. | shout | **Smear:** a big solid crescent behind the leg · QA: L heel x 235 ±8, y 128 (zone x 222-248, y 105-150) |
| f3 | `airLight3_03` | **active** | Hold the extension, no smear. | shout | QA: heel ~x 233 |
| f4 | `airLight3_04` | recovery | Leg folding back in, body re-centering. | focused |  |
| f5 | `airLight3_05` | recovery | Back to the AIR BASE POSE. | focused |  |

<a id="airheavy"></a>

### `airHeavy`: double-fist hammer spike

6 frames · phases 2/2/2 (startup f0–f1, active f2–f3, recovery f4–f5) · plays once · **CORE** · bodyHeight 198 · ms 50/45/45/70/70/40 · prompt A09 (2 images: f0–f3 + f4–f5)

Air finisher: smashes the opponent into the floor (ground bounce).

- **Strike target:** f2–f3: clasped fists in the contact zone **x 180-218, y 160-206** (aim about x 199, y 183: down-forward at 45°, in front of and below his chest). The fists must not go lower than his lowest foot, or the packer's floor alignment makes the body jump up.
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Hair and tails lift on the wind-up and slam down-forward on f2.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `airHeavy_00` | startup | Wind-up: both arms raised overhead, fists clasped together (one hand wrapped over the other fist) above and slightly behind the head; torso arched back about 20°; knees tucked. | shout |  |
| f1 | `airHeavy_01` | startup | Maximum wind-up: clasped fists further behind the head, body bent back like a bow, legs folded back under him. | shout, eyes wide |  |
| f2 | `airHeavy_02` | **active** | IMPACT: body jackknifes forward about 40°; both straight arms smash the clasped fists down-forward at 45°; legs trailing back and down (the R foot is the lowest point). | shout | **Smear:** a large solid crescent above and behind the arms, tracing the overhead-to-down arc · QA: fists x 199 ±10, y 183 ±12 (zone x 180-218, y 160-206), above the lowest foot |
| f3 | `airHeavy_03` | **active** | Hold the smash, no smear. | shout | QA: fists ~x 197 |
| f4 | `airHeavy_04` | recovery | Arms rising back to chest height, body uncurling. | focused |  |
| f5 | `airHeavy_05` | recovery | Back to the AIR BASE POSE. | focused |  |

<a id="throw"></a>

### `throw`: mid-air shuriken throw (R hand)

4 frames · phases 1/1/2 (startup f0, active f1, recovery f2–f3) · plays once · optional · bodyHeight 201 · ms 50/60/70/50 · prompt A33

Air projectile: three shuriken in a fan. The engine spawns and flies the shuriken.

- **Strike target:** The engine spawns the shuriken at the release point **(192, 125)** (0.5 units in front, 0.9 up). On f1 the R hand is in the release zone **x 186-212, y 116-142**. The arm itself never hits (`hit: []` override, MOVES_AND_VFX.md §6).
- **Air:** starts and ends in the air base pose (above).
- **Hair and cloth:** Tails whip forward on f1 but stay behind the head.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `throw_00` | startup | Cocked: R arm drawn back behind the head, holding three small steel four-pointed shuriken fanned between the fingers; torso twisted toward the viewer and leaning back slightly; L arm extended forward, open hand aiming at the target; legs in the AIR BASE POSE. | focused, one eye aiming | QA: the only frame with a prop |
| f1 | `throw_01` | **active** | RELEASE: R arm whipped forward to horizontal at chest height, hand open, palm down, fingers pointing at the target; NO shuriken in the hand anymore (the engine spawns them); torso turned forward; L arm pulled back. | shout | **Smear:** a solid streak behind the R forearm · QA: R hand in x 186-212, y 116-142 (release point (192, 125)) |
| f2 | `throw_02` | recovery | Follow-through: R arm continues down-forward across the body, L arm back. | focused |  |
| f3 | `throw_03` | recovery | Back to the AIR BASE POSE. | determined |  |

---

## Defense and reactions

<a id="guard"></a>

### `guard`: cross-arm block (loop)

2 frames · loops · **CORE** · bodyHeight 198 · ms 300/300 · prompt A10

Holding guard.

- **Hair and cloth:** Tails sway 1 px between frames.
- **QA:** Compact: the crossed forearms stay near the idle front edge (about x 182).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `guard_00` | loop | Cross block: both forearms raised and crossed in an X in front of the face (wrists crossing in front of the nose, fists closed, R forearm in front), elbows tucked to protect the ribs; torso hunched forward about 12°; head ducked so the eyes look over the forearms; knees bent wide and braced. | fierce glare over the arms |  |
| f1 | `guard_01` | loop | Same, 1 px lower with the knees 1 px deeper (breathing). | fierce glare |  |

<a id="block"></a>

### `block`: pushed back while blocking

2 frames · plays once · optional · bodyHeight 204 · ms 60/80 · prompt A29

Blockstun: the guard absorbing a hit.

- **Hair and cloth:** Hair and tails jolt forward (right) on f0.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `block_00` | — | Same crossed-arm guard, but the torso is pushed upright and back, head snapped down behind the arms, rear (R) foot sliding back with the heel lifted, sandals skidding. | pain: eyes squeezed shut, teeth gritted | Hair/tails: hair and tails jolt forward |
| f1 | `block_01` | — | Recovering into the guard pose (like guard f0). | fierce |  |

<a id="hurthigh"></a>

### `hurtHigh`: hit in the face

3 frames · plays once · **CORE** · bodyHeight 195 · ms 70/90/100 · prompt A11

Standard hitstun reaction for high and mid hits.

- **Hair and cloth:** The head snaps back (left), so the hair spikes, side locks and tails whip forward (right) on f0 and fall back on f1–f2.
- **QA:** Keep the arms flung back, not forward, so the hurtbox does not stretch toward the attacker.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `hurtHigh_00` | — | IMPACT: head snapped back hard (chin up about 30°), torso bent back about 24°, both arms flung back and out (R arm wide behind, L arm up), knees buckling, feet still planted. | pain: eyes squeezed shut, mouth open in a grimace | Hair/tails: spikes and tails whip forward |
| f1 | `hurtHigh_01` | — | Recoil continues: head still back but a little less, arms dropping, torso leaning back about 20°. | one eye squinting, teeth gritted |  |
| f2 | `hurtHigh_02` | — | Starting to recover: head coming forward, torso back about 15°, arms coming down toward the guard. | pained, eyes open |  |

<a id="hurtlow"></a>

### `hurtLow`: hit in the stomach

3 frames · plays once · optional · bodyHeight 183 · ms 70/90/100 · prompt A30

Hitstun for low and stomach hits.

- **Hair and cloth:** Hair spikes and tails flung forward and down on f0.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `hurtLow_00` | — | IMPACT: doubled over forward about 40°, both arms pulled in toward the stomach (fists near the belly), knees bent, hips pushed back; head down. | gasp: eyes wide with small irises, mouth open |  |
| f1 | `hurtLow_01` | — | Still doubled over (about 34°), arms slightly lower. | teeth gritted, one eye shut |  |
| f2 | `hurtLow_02` | — | Recovering: torso about 28°, head lifting. | pained |  |

<a id="launched"></a>

### `launched`: knocked flying backward (loop)

2 frames · loops · **CORE** · bodyHeight 136 · ms 70/70 · prompt A12

Airborne after a launcher or a big hit. The engine flies the sprite. ADR 0007 pose note: arched diagonally, not fully horizontal.

- **Hair and cloth:** He flies left, so hair and tails stream to the right.
- **QA:** Lowest point on the baseline. Height about 136 px, length about 200-220 px, inside x 4-251.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `launched_00` | loop | Knocked flying back toward screen-left: arched like a drawn bow, belly up, the HIPS are the lowest point near the middle of the pose; head and shoulders rise to the upper-left with both arms flung up and back past the head; legs bent, trailing to the right at about hip height or a little higher. | pain: eyes shut, mouth open | Hair/tails: hair and tails stream right · QA: hips (lowest point) near the middle of the shape |
| f1 | `launched_01` | loop | Same bow shape, hips still the lowest point near the middle; arms and legs flailing into an alternate position (L arm higher, R knee bent more). | pain | Hair/tails: tails flutter to a second shape |

<a id="spin"></a>

### `spin`: tumbling backward (loop)

4 frames · loops · optional · bodyHeight 160 · ms 60/60/60/60 · prompt A31

Tumbling through the air after big launches.

- **Hair and cloth:** Tails trail opposite to the rotation.
- **QA:** Keep the tuck compact (about 150-160 px across); the lowest point of every frame sits on the baseline.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `spin_00` | loop | Loose tuck (knees bent toward the chest, arms bent in front), rotated about 30° backward. | pain, eyes shut |  |
| f1 | `spin_01` | loop | Same tuck rotated about 120° (back toward the floor, head to the left). | pain |  |
| f2 | `spin_02` | loop | Rotated about 210° (upside down, head down). | pain |  |
| f3 | `spin_03` | loop | Rotated about 300° (feet coming round over the top). Flows into f0. | pain |  |

<a id="down"></a>

### `down`: slammed down, then lying on the back

2 frames · plays once · **CORE** · bodyHeight 96 · ms 80/420 · prompt A13

Knockdown. The engine adds dust and sometimes a crater. ADR 0007 pose note: lying flat with the head toward screen-left, about 210 px long.

- **Hair and cloth:** Hair spikes splay against the floor; tails flung up on f0 and lying flat on f1.
- **QA:** Height about 96 px on f0 (shoulders and legs bounce up), lower on f1; length about 210 px. Head toward screen-left, feet toward screen-right, everything inside x 4-251.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `down_00` | — | Ground impact: lying on his back, head toward screen-left and feet toward screen-right; his back has slammed into the floor and the shoulders and legs bounce up about 15° from flat; arms flung out from the shoulders. | pain: eyes squeezed shut, mouth open |  |
| f1 | `down_01` | — | Lying flat on the back: arms out to the sides, L knee slightly raised, head turned toward the viewer. | out: eyes closed, dazed |  |

<a id="ko"></a>

### `ko`: knocked out

1 frame · plays once · optional · bodyHeight 64 · ms 500 · prompt A36

Final KO pose (held). ADR 0007 pose note: lying flat, head toward screen-left, about 210 px long.

- **Hair and cloth:** Hair splayed on the floor, tails lying flat.
- **QA:** Height about 64 px, length about 210 px, inside x 4-251. No comedic eyes: he is knocked out cold.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `ko_00` | — | Lying flat on the back like down f1 but completely limp: arms loose at the sides, legs straight, head tilted toward the viewer. Head toward screen-left. | out: eyes closed, mouth slightly open |  |

<a id="getup"></a>

### `getup`: kip-up

5 frames · plays once · **CORE** · bodyHeight 204 · ms 70/60/60/80/70 · prompt A14

Getting back up after a knockdown, fast and athletic.

- **Hair and cloth:** Tails follow one frame behind the body; hair squashes on f3.
- **QA:** f0 matches down f1 closely (no pop): head toward screen-left. f1 is the widest frame: keep it inside x 4-251. f4 is the tallest (idle height).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `getup_00` | — | Lying on the back (head left, feet right), knees pulled up to the chest, palms planted on the floor beside the head (fingers pointing toward the shoulders). | fierce, eyes open |  |
| f1 | `getup_01` | — | Legs kick up and over: rocked back onto the shoulders, hips high, legs pointing up-right. | fierce |  |
| f2 | `getup_02` | — | Spring: body launched up off the hands, torso tilted back about 40°, legs tucked underneath, arms out. | shout |  |
| f3 | `getup_03` | — | Lands in a crouch (squash): knees deep, feet planted in the stance, arms coming up to the guard. | focused |  |
| f4 | `getup_04` | — | Back in the stance. | determined | QA: within 1-2 px of idle f0 |

<a id="stagger"></a>

### `stagger`: dazed stagger (loop)

4 frames · loops · optional · bodyHeight 207 · ms 150/150/150/150 · prompt A35

Dizzy state. Played straight: dazed and unsteady, no comedic spiral eyes.

- **Hair and cloth:** Hair spikes droop slightly; tails swing with the sway.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `stagger_00` | loop | Dazed wobble: standing loosely, upper body swaying to screen-left (rolled about 8°), head tilted the same way, arms hanging loose, knees unsteady (R knee bent inward). | dazed: half-closed unfocused eyes, mouth hanging slightly open |  |
| f1 | `stagger_01` | loop | Swaying back through center (upright), arms swinging loosely. | dazed |  |
| f2 | `stagger_02` | loop | Swaying to screen-right (rolled about 8° the other way), L knee bent inward. | dazed, head lolling |  |
| f3 | `stagger_03` | loop | Back through center. Flows into f0. | dazed |  |

---

## Ki, beam and signature

<a id="charge"></a>

### `charge`: powering up (loop)

4 frames · loops · **CORE** · bodyHeight 198 · ms 50/50/50/50 · prompt A15

Holding the special button charges ki. The engine draws the orange flame aura around him: do NOT draw any aura.

- **Hair and cloth:** An updraft blows the hair spikes, side locks and headband tails UP; they flicker between two shapes. The jacket hem lifts.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `charge_00` | loop | Powering up: wide stance (feet well apart, knees bent about 35°), fists clenched at his sides pushed down and slightly out, elbows slightly bent, arms and shoulders tensed, chest out, torso arched back about 10°, head tilted up, shouting. | shout, eyes intense and narrowed | Hair/tails: spikes and tails blown up |
| f1 | `charge_01` | loop | Same, whole body trembling 1 px to the left; arms flexed 1 px further out. | shout | Hair/tails: second flicker shape |
| f2 | `charge_02` | loop | Same as f0 (tremble right). | shout | Hair/tails: first flicker shape |
| f3 | `charge_03` | loop | Same as f1. | shout | Hair/tails: second flicker shape |

<a id="beamcharge"></a>

### `beamCharge`: charging the Rasen Cannon (loop)

3 frames · loops · **CORE** · bodyHeight 198 · ms 50/50/50 · prompt A16

Ultimate wind-up during the super flash. The engine draws the aura and speed lines; the hands stay empty.

- **Hair and cloth:** Hair spikes and tails blown upward and back.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `beamCharge_00` | loop | Low wide stance (L leg forward and bent, R leg back); torso twisted away toward the viewer (about 35°); both hands cupped together at the R (rear) hip, palms facing each other as if holding a ball, but EMPTY (no energy drawn); elbows bent back; head turned toward the target (screen-right). | shout |  |
| f1 | `beamCharge_01` | loop | Same, trembling 1 px, hands 1 px further apart. | shout | Hair/tails: second flicker shape |
| f2 | `beamCharge_02` | loop | Same, trembling back. | shout |  |

<a id="beamfire"></a>

### `beamFire`: firing the Rasen Cannon (loop)

3 frames · loops · **CORE** · bodyHeight 198 · ms 50/50/50 · prompt A17

Holding the beam. The engine draws the beam from just in front of his palms.

- **Strike target:** Beam origin **(230, 122)** (0.8 units in front, 0.92 up): both palms in the zone **x 222-238, y 112-132** on every frame.
- **Hair and cloth:** Recoil wind: hair and tails blown straight back hard.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `beamFire_00` | loop | Firing: both arms thrust straight forward horizontally at chest height, heels of the palms together, palms open and facing the target, fingers spread; wide braced stance (L leg forward and bent, R leg straight behind pushing against the recoil); torso leaning forward about 14°; head behind the arms, eyes on the target. | shout | QA: palms x 230 ±8, y 122 (zone x 222-238, y 112-132) |
| f1 | `beamFire_01` | loop | Same, recoil tremble: arms 1 px back, rear heel slides 1 px. | shout |  |
| f2 | `beamFire_02` | loop | Same, tremble forward. | shout |  |

<a id="vanish"></a>

### `vanish`: crouch before teleporting

2 frames · plays once · optional · bodyHeight 221 · ms 50/50 · prompt A34

Vanish (1 bar): he blinks out in a smoke puff and reappears behind the opponent with the spinning kick (light4). The engine adds the smoke, lines and afterimage.

- **Hair and cloth:** Hair and tails flick upward on f1.
- **QA:** Height about 221 px because f1 is stretched up on the toes (taller than idle).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `vanish_00` | — | Quick crouch: knees bent about 60°, torso pitched forward about 20°, arms tucked close, eyes locked on the target. | focused, sharp |  |
| f1 | `vanish_01` | — | Snap stretch: up on the toes, body stretched tall, arms straight down at the sides, about to blink out. | determined | Hair/tails: hair and tails flick up |

<a id="special"></a>

### `special`: RASENGAN rush

8 frames · phases 3/3/2 (startup f0–f2, active f3–f5, recovery f6–f7) · plays once · **CORE** · bodyHeight 204 · ms 120/120/120/120/120/160/110/70 · prompt A18 (2 images: f0–f2 + f3–f7)

Signature rush (1 bar): form the Rasengan in the R palm, ninja-run in, and thrust it into the opponent. The engine draws the spinning orb at his palm, so the hand stays EMPTY in these frames.

- **Strike target:** The engine draws the orb at **(205, 148)** on every frame, thrust included (0.6 units in front, 0.72 up). The full-size orb is about 86 px across, so the R palm stays **within about 15 px of that point** on every frame or the orb floats on the forearm. f5 thrust: R palm in the contact zone **x 194-222, y 128-158** (aim about x 214, y 142). Do NOT draw the Rasengan sphere: leave the cupped palm empty.
- **Hair and cloth:** Chakra wind lifts the hair and tails on f0–f2; they stream back on f3–f5.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `special_00` | startup | Forming: wide low stance, torso leaning forward about 15°; R hand held out in front at belt height, palm UP and cupped; L hand hovering just above it palm DOWN, fingers spread, circling over the R palm (shaping the chakra). | focused shout, eyes intense | QA: R palm ~x 203, y 150 |
| f1 | `special_01` | startup | Still forming: the L hand has circled to the far side of the R palm; knees deeper, body leaning forward about 18°. | shout | QA: R palm ~x 204, y 150 |
| f2 | `special_02` | startup | Ready: L hand pulled away and back; R palm now turned FORWARD, cupped as if holding a ball about the size of his head; body coiled low to sprint, L foot forward. | confident grin | QA: R palm ~x 205, y 148 |
| f3 | `special_03` | **active** | Rush (ninja run): torso pitched forward about 32°; R arm extended forward at waist height with the cupped palm facing forward; L arm trailing straight back; legs in the run contact pose (L foot forward). | shout | QA: R palm ~x 208, y 146 |
| f4 | `special_04` | **active** | Rush: same arms, legs in the passing pose (R knee forward). | shout | QA: R palm ~x 208, y 146 |
| f5 | `special_05` | **active** | THRUST: short planted lunge with the L leg forward and the R leg straight behind (the palm must not travel far past the orb point); torso rotated so the right shoulder leads (chest toward the viewer); R arm fully extended palm-first into the opponent's stomach; L arm flung back. | shout ("RASENGAN!") | **Smear:** a solid streak behind the R forearm · QA: R palm x 214 ±8, y 142 ±8 (zone x 194-222, y 128-158; within ~15 px of (205, 148)) |
| f6 | `special_06` | recovery | Follow-through: R arm still extended but relaxing, torso rising, weight on the front leg. | fierce |  |
| f7 | `special_07` | recovery | Recovering toward the stance, R arm pulling back into the guard. | determined |  |

---

## Attitude

<a id="intro"></a>

### `intro`: shadow-clone hand seal (loop)

4 frames · loops · optional · bodyHeight 210 · ms 150/150/150/150 · prompt A37

Pre-fight intro pose. (A future engine hook can poof shadow clones in beside him; see MOVES_AND_VFX.md.)

- **Hair and cloth:** Headband tails and jacket hem flapping in the wind; hair spikes bob 1 px.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `intro_00` | loop | Shadow-clone seal: feet planted about shoulder width (L forward), slight forward lean; both hands in front of the chest forming the cross-shaped seal: index and middle fingers of both hands extended and crossed in a plus shape (R hand fingers vertical, L hand fingers horizontal), other fingers curled; elbows out. | determined, eyes on the opponent, a hint of a confident smile |  |
| f1 | `intro_01` | loop | Same, body 1 px lower (breath). | determined | Hair/tails: tails flip to a second shape |
| f2 | `intro_02` | loop | Same as f0, hair spikes 1 px up. | determined |  |
| f3 | `intro_03` | loop | Same as f1 with the jacket hem fluttering. Flows into f0. | determined |  |

<a id="taunt"></a>

### `taunt`: pointing taunt (loop)

2 frames · loops · optional · bodyHeight 212 · ms 250/250 · prompt A38

Taunt: he points straight at the opponent, confident.

- **Hair and cloth:** Hair bounces 1 px on f1.
- **QA:** Finger tip about x 220-230, y 80-90 (taunt has no hitbox).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `taunt_00` | loop | Pointing: R arm thrust straight forward at shoulder height, index finger pointing at the opponent, L fist planted on the hip; chest out, leaning back slightly; feet planted casually. | confident grin, teeth showing |  |
| f1 | `taunt_01` | loop | Same, mouth open calling out, finger 2 px higher. | confident grin, calling out |  |

<a id="win"></a>

### `win`: fist-pump victory (loop)

4 frames · loops · **CORE** · bodyHeight 212 · ms 110/90/260/180 · prompt A23

Victory pose after the match.

- **Hair and cloth:** Hair spikes bounce up 2 px on f2; tails swing.
- **QA:** At the top of the pump the fist is no higher than about y 28 (bodyHeight 212): bend the elbow a little rather than locking the arm straight overhead.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `win_00` | loop | Chamber: R fist pulled down to the chest, elbow bent down, knees dipping slightly; L fist clenched low at his side. | confident grin |  |
| f1 | `win_01` | loop | Pump: R arm punches up overhead and slightly forward, elbow a little bent; body stretched up on the toes. | shout (a victory yell) | QA: fist top ≤ ~y 28 |
| f2 | `win_02` | loop | Hold the raised fist. | confident grin, eyes narrowed | Hair/tails: spikes bounce up 2 px |
| f3 | `win_03` | loop | Arm lowering slightly (fist at head height), settling. Flows back into the chamber. | confident grin |  |

---

## Changing an animation

- Frame counts and phases come from `src/art/animGuide.js` and `art/manifest.json`. If a strip comes
  out better with a different frame count, that's allowed (the engine spreads frames over the move
  phases), but update the manifest entry (`frames`, `phases`) and this file together, and say so
  in CHANGELOG.md.
- Keep the active frames inside their ADR 0007 contact zones. They are tuned to the move ranges in
  `src/game/moves.js`. If a move feels like it whiffs at close range, check the hitbox in the
  Sprite Lab before redrawing. A `hitboxes.json` override may be all it needs (MOVES_AND_VFX.md §6).
- Body heights are the ADR 0007 table. If an approved strip packs visibly bigger or smaller than idle
  (compare head sizes, about 31 px), Codex corrects that animation's `bodyHeight` in the manifest
  and notes it in TRACKER.md; don't redraw for it.
