# Sasuke: kit animations (move system v2)

> Art brief for Sasuke's four kit animations (`specialForward`, `specialUp`, `specialDown`,
> `superPose`; [ADR 0009](../../../docs/decisions/0009-move-system-v2.md)) and for his redrawn
> `beamCharge` / `beamFire` (KIRIN). His kit itself is ADR 0011 (task ENG-036, Claude). Design facts
> (palette, landmarks, near/far side, the Sharingan, the sheathed sword) are in
> [CHARACTER.md](CHARACTER.md). If this file disagrees with ADR 0007 or [art/SPEC.md](../../SPEC.md),
> they win. Written by Claude; Codex merges it (below), after which the merged files are the source.

## 1. What this file is and how Codex merges it

Sasuke's kit (ADR 0009 inputs; engine work in ENG-036):

| input | move | animation(s) |
|---|---|---|
| Special | CHIDORI (rush, unchanged) | `special` |
| → + Special | **CHIDORI SHARP SPEAR** (Chidori Eiso) | `specialForward` (new) |
| ↑ + Special | **LION'S BARRAGE** (Shishi Rendan), anti-air | `specialUp` (new) → `airHeavy` (slam) → `land` |
| ↓ + Special | **SHARINGAN COUNTER** stance | `specialDown` (new) |
| air Special | FIREBALL (unchanged) | `throw` |
| Heavy + Special (ultimate, 3 bars) | **AMATERASU** (black flames on the opponent) | `superPose` (new) |
| SUPER (3 bars) | **KIRIN** (a lightning dragon called down from a storm) | `beamCharge` → `beamFire` (redrawn, §4) |

Sasuke **no longer fires a beam**: the Lightning Lance is gone, and `beamCharge` / `beamFire` now show
KIRIN. The engine draws every effect (lightning in the hand, the lightning spear, the counter flash,
the black flames, the storm and the dragon). **No sprite in this file contains lightning, fire, black
flames, glow or energy**, and the sword stays sheathed at the back of the belt in every frame.

Frames, phases and timing (`ms` = default ms per frame for the manifest; attack ms only matter for
previews, because the engine time-stretches attack frames over the move's phases):

| anim | slot · move | frames | phases S/A/R | loop | bodyHeight | default ms | fallback | eyes | prompt | tallest frame |
|---|---|---|---|---|---|---|---|---|---|---|
| [specialForward](#specialforward) | → + Special · Chidori Sharp Spear | 7 | 2/2/3 | | 204 | 50 50 50 80 70 60 50 | `special` | 👁 f1-f4 | A39 | f0/f6 (stance) |
| [specialUp](#specialup) | ↑ + Special · Lion's Barrage rise | 6 | 2/2/2 | | 214 | 50 50 60 60 70 70 | `special` | dark | A40 | f2 (kicking foot at about hair-top height) |
| [specialDown](#specialdown) | ↓ + Special · Sharingan counter | 4 | 2/1/1 | | 204 | 80 80 200 90 | `charge` | 👁 f1-f3 | A41 | f2 (upright reading stance) |
| [superPose](#superpose) | ultimate · Amaterasu | 4 | | ✓ | 208 | 140 each | `taunt` | Mangekyō | A42 | any (upright) |
| [beamCharge](#beamcharge) | SUPER · Kirin (call) | 3 | | ✓ | **230** (override, default 198) | 50 each | core | 👁 | A16 | any (raised hand about one head above the hair) |
| [beamFire](#beamfire) | SUPER · Kirin (strike) | 3 | | ✓ | 198 | 50 each | core | 👁 | A17 | any |

Notes on the table:

- `bodyHeight` 204 / 214 / 204 / 208 are the SPEC.md kit defaults; Sasuke keeps the standard body
  scale (200 px standing body, head about 31 px), so no per-character table. `specialForward` and
  `specialDown` ms differ slightly from the SPEC.md defaults on purpose (Sasuke-specific, like his
  `special` ms).
- **`beamCharge` needs `bodyHeight` 230, not 198.** The KIRIN call raises one arm straight up, about
  one head above his hair. At 198 the packer would shrink the whole strip until his head is about 26 px
  (5 px smaller than idle). 230 is the estimate for the pose described in §4. Codex sets it in the
  manifest before packing, checks the head against idle (within 3 px) and adjusts the number if needed,
  and logs it in `art/TRACKER.md`.
- With the 4 kit animations Sasuke has 42 animations, 175 frames (11 rows, a 4096 × 2816 sheet).

**How Codex merges this file:**

1. **Now, before step 7** (A16/A17 are still `todo`): swap §4 into ANIMATIONS.md (replace the
   `beamCharge` and `beamFire` entries and their Summary rows) and PROMPTS.md (replace the A16 and A17
   blocks and their Index titles). Set `beamCharge` `bodyHeight` to 230 in Sasuke's block of
   `art/manifest.json`. Then generate A16/A17 from the new blocks. Never generate the old beam versions.
2. **At step 9:** merge §2 into ANIMATIONS.md as a "Move-system-v2 animations (optional, ADR 0009)" part
   after `special` (plus the 4 Summary rows from the table above, and the new totals), and §3 into
   PROMPTS.md as A39-A42 (4 Index rows at step 9, the blocks after A38). Add the 4 manifest rows below
   to Sasuke's `animations` block and 4 rows (step 9, opt v2, `todo`) to his block in `art/TRACKER.md`.
3. **Same edit, CHARACTER.md** (Codex's file):
   - header table: Ultimate (3 bars) = **AMATERASU** (`superPose`); add SUPER (3 bars) = **KIRIN**
     (`beamCharge` → `beamFire`); the Lightning Lance row goes.
   - §2 off-model list: a pinwheel-shaped Mangekyō eye stays off-model **except in `superPose`**.
   - §4: the Chidori Sharp Spear (`specialForward`) uses the **L (lead) hand**, the one exception to
     "Chidori hand = R".
   - §5 Sharingan schedule: add `specialForward` f1-f4 and `specialDown` f1-f3; `beamCharge` and
     `beamFire` stay ON (now KIRIN); `superPose` shows the **Mangekyō** (its own row).
   - §9 replacement terms: the table below.
4. MOVES_AND_VFX.md: the move list and §3 change (Lightning Lance → KIRIN, plus the four kit moves).
   Claude supplies engine details from ENG-036; Codex records the measured anchors asked for in §2 and §4.
5. U2 (super cut-in eye strip) still says "before the Lightning Lance"; its 3-tomoe Sharingan eyes stay
   valid for both supers. A Mangekyō cut-in variant for Amaterasu would be a separate UI asset (the
   user's call), not part of this kit.

Manifest rows for Sasuke's `animations` block (step 9, optional):

```json
"specialForward": { "frames": 7, "loop": false, "phases": [2, 2, 3], "bodyHeight": 204, "ms": [50, 50, 50, 80, 70, 60, 50], "required": false, "step": 9, "status": "todo", "version": 0, "approvedVersion": null },
"specialUp": { "frames": 6, "loop": false, "phases": [2, 2, 2], "bodyHeight": 214, "ms": [50, 50, 60, 60, 70, 70], "required": false, "step": 9, "status": "todo", "version": 0, "approvedVersion": null },
"specialDown": { "frames": 4, "loop": false, "phases": [2, 1, 1], "bodyHeight": 204, "ms": [80, 80, 200, 90], "hitbox": false, "required": false, "step": 9, "status": "todo", "version": 0, "approvedVersion": null },
"superPose": { "frames": 4, "loop": true, "bodyHeight": 208, "ms": [140, 140, 140, 140], "required": false, "step": 9, "status": "todo", "version": 0, "approvedVersion": null }
```

`"hitbox": false` on `specialDown` makes the packer write no hit box for the counter stance (it never
strikes). Existing rows: `beamCharge` `bodyHeight` 198 → **230** (frames, loop and ms unchanged);
`beamFire` unchanged (198, 50 each).

Replacement terms for CHARACTER.md §9 (when the generator refuses a name):

| instead of | write |
|---|---|
| Chidori Sharp Spear / Chidori Eiso | "a fast, straight spear-hand thrust" (the lightning is not drawn anyway) |
| Lion's Barrage | "a rising anti-air kick" |
| Sharingan counter | "a calm reading stance" (plus the Sharingan wording already in §9) |
| Mangekyō Sharingan | "glowing red eyes with a bold black three-bladed pinwheel pattern around the pupil" |
| Amaterasu | "a cold, still eye-technique stare" |
| Kirin | "calling down a lightning strike from a storm with one raised arm" (no lightning drawn) |

---

## 2. Kit animations (for ANIMATIONS.md)

These four names are **optional**: when one is missing the engine plays its fallback (in brackets).
They need manifest rows before the packer picks them up (§1). Strips: A39 to A42 in PROMPTS.md (§3).
Conventions as in ANIMATIONS.md: f0 is the first frame ("pose 1" in the prompts), R = near, L = far,
coordinates are final-cell px at the idle scale, and the sword stays sheathed at the small of his back.

<a id="specialforward"></a>

### specialForward: CHIDORI SHARP SPEAR · 7 frames · phases 2/2/3 · 👁 Sharingan f1-f4 [fallback `special`]

→ + Special. A fast, short-range lightning spear (Chidori Eiso): lightning gathers in his open hand,
then he thrusts it forward as a long, straight spear-hand. The engine draws the crackling lightning in
the hand during the startup and the lightning spear from the fingertips on the thrust. **Draw the hand
open and empty.** Timing lives in `src/game/moves.js` (ENG-036); the frames stretch over its phases.

**Hand: L (lead, far) in this move only.** Every other Chidori-type frame uses the R (near) hand
(CHARACTER.md §4). This is a lead-hand thrust on the same line as `light1`, so the reach comes from the
lead shoulder. Keep the L hand **fully visible in front of his waist** on f0-f1 (not hidden behind the
hip): the lightning needs a hand to sit in.

Effect anchors (proposed; Codex measures the packed frames, writes the real points in
MOVES_AND_VFX.md and tells Claude, who sets the engine offsets):

| frames | what the engine draws | cell px (x, y) | world units from the feet |
|---|---|---|---|
| f0-f1 | crackling lightning in the open L palm | about (146, 156) | 0.14 forward, 0.66 up |
| f2-f3 | the lightning spear, from the fingertips toward screen-right | about (220, 140) | 0.72 forward, 0.78 up (next to the Chidori impact anchor (218, 140)) |

- **f0 · S**: anticipation from the stance. Weight starts shifting forward onto the L (front) foot, knees
  starting to bend. The **L hand pulls back** from the knife-hand guard, down to his L hip: palm open,
  fingers slightly spread, elbow bent back. R fist guards the chest. L shoulder turns slightly away.
  Dark eyes. Face: cold. (Height no taller than idle.)
- **f1 · S**: coiled. Weight forward, knees bent deeper, shoulders coiled, head forward. **L hand low
  beside the L hip, a little in front of it** (about x 138 to 154, y 146 to 166): palm open and turned
  forward and down, fingers spread and tense, the whole hand visible against the waist cloth. Sharingan
  flares on. Face: focused. Bangs and rope ends lift slightly.
- **f2 · A · smear**: thrust. Hips and the L shoulder drive forward into a deep lunge: L leg forward and
  bent, R leg straight back (rear heel at about x 60 to 70). **L arm fully extended horizontally**
  toward screen-right as a spear-hand: fingers straight and pressed together, palm down, wrist straight.
  In the lunge his shoulders drop to about y 112 to 120, so the arm runs level to very slightly
  downward: **fingertips in x 210 to 234, y 128 to 152**, around the (220, 140) anchor (the opponent's
  lower chest and stomach). R fist pulled back to the R hip. Chin tucked behind the L shoulder. Solid
  tapered smear from the hip to the fingertips in sleeve white, arm-guard navy and skin. Face: angry,
  teeth just showing. Sharingan.
- **f3 · A**: hold without the smear, fingertips 1 to 2 px further. Bangs, rope ends and the waist cloth
  whip forward from the sudden stop. Sharingan.
- **f4 · R**: pulling back. L elbow bends, the hand retracts to about x 190, the body rises out of the
  lunge, weight shifting back. Sharingan (last red frame). Face: cold.
- **f5 · R**: L hand back near the guard, opening into the knife-hand, L foot sliding back. Dark eyes.
  Face: cold.
- **f6 · R**: idle stance (matches idle f0), dark eyes, the tallest frame (204).

QA: on f2-f3 the fingertips are the right-most pixels (no bangs, rope ends, cloth or sword grip past
them) and sit in the zone above; the lunge stays inside x 4..251.

<a id="specialup"></a>

### specialUp: LION'S BARRAGE rise · 6 frames · phases 2/2/2 [fallback `special`]

↑ + Special, an anti-air. A rising kick carries him straight up, he turns over at the top, then slams
down. This strip covers the takeoff, the rising kick and the turn at the top; **the slam reuses
[airHeavy](#airheavy)** (his double-fist hammer spike) and **the landing reuses [land](#land)**. In the
anime the barrage ends with a heel drop; here the finisher is his existing `airHeavy`, so **f5 is
airHeavy's f0 pose** (clasped fists overhead), not a heel drop.

Engine (the `dive` kind as `src/game/kit.js` runs it today): f0-f1 play over the first 40 % of the
rise, f2-f3 over the rest, then the hang shows `airHeavy` f0 and the slam its active frame. f4-f5 only
play if the engine runs the recovery phase (ENG-036 decides); draw them anyway, so the strip flows into
`airHeavy` f0 in previews and in game. The rise's anti-air hit is checked by distance there, not by the
packed box, so draw the kick for readability. Dark eyes in every frame (no Sharingan).

- **f0 · S**: crouch. Knees deeply bent, torso leaning forward, both arms swung down and back, head up
  looking up and forward at the target. Back spikes squashed 1 to 2 px, waist-cloth hem pooled over the
  knees. Face: focused.
- **f1 · S**: spring. Legs extending explosively, heels off, toes last on the floor. Torso **still
  leaning forward** about 25° and the knees not yet straight; both arms swing forward to chest height
  (hands no higher than the chin). This frame stays lower than f2. Face: focused.
- **f2 · A · smear**: rising kick. Airborne, rising straight up. **The R (near) leg kicks straight up**
  in front of his body, knee locked, the ball of the foot leading upward: **foot in about x 164 to 200,
  y 26 to 60**, in front of his face at about the height of his hair top (no more than about 10 px above
  it). Torso upright, leaning back about 10°. **L leg hangs below with the knee slightly bent and the
  toes pointed** (the lowest point, under the hips). Both arms swept down and back along his sides. The
  kicking leg comes out between the panels of the waist cloth; bangs, rope ends and the hem are dragged
  downward by the rise. Solid crescent smear from the hip up to the foot. Face: angry, teeth showing.
  The tallest frame (214).
- **f3 · A**: the same kick without the smear, foot 1 to 2 px higher, cloth still dragged down.
- **f4 · R**: turning over at the apex. The kicking leg folds, both knees tuck toward the chest, the body
  tips forward over the top of the jump (torso pitched about 30° forward, head looking down at the target
  below-right), both arms swinging up past the shoulders with the hands coming together. Face: focused.
- **f5 · R**: apex hang = **airHeavy f0**: both hands clasped together (fingers interlocked) raised
  overhead, torso arching back, knees tucked. Face: shout. Flows straight into the slam.

QA: f5 matches airHeavy f0 (same clasped hands, arch and tuck; the head within 3 px of airHeavy's after
packing); nothing on f1, f4 or f5 rises above the f2 foot; in the airborne frames the lowest point
stays near the middle of the shape (Conventions, Centering).

<a id="specialdown"></a>

### specialDown: SHARINGAN COUNTER stance · 4 frames · phases 2/1/1 · 👁 Sharingan f1-f3 [fallback `charge`]

↓ + Special. A calm, perfectly still stance in which the Sharingan reads the opponent's attack; the
engine handles the counter itself (flash, freeze, any follow-up). **No hit box**: the stance never
strikes (manifest `"hitbox": false`). If it uses the `counter` kind as Gojo's Infinity does, f0-f1
play over the first 3 game frames, **f2 holds for the whole counter window** and f3 plays over the
recovery, so f2 is the frame players see.

**Feet identical in all 4 frames** (same planted stance as idle: L foot forward, R foot back).

- **f0 · S**: settling out of the stance. Knees bend a little more, torso coming upright, weight
  centered. R hand starts rising, open; L hand starts dropping. Eyes still dark, narrowing. Face: cold.
- **f1 · S**: the calm guard. **R (near) hand raised open in front of his face**, palm toward the
  opponent (screen-right), fingers straight up and together, held a little forward of the face (about
  x 160 to 180) with the fingertips just below eye height, so **both eyes stay visible**. L hand low in
  front of his stomach, open and ready. Chin down. **The eyes snap to the 3-tomoe Sharingan.** Face:
  cold, intense stare.
- **f2 · A**: the reading stance (held longest). The same pose, perfectly still and balanced: the
  Sharingan glaring at the opponent, the **L hand low and ready** (open, fingers loose, in front of the
  belt). Bangs, rope ends and the waist cloth completely at rest. Face: cold, unblinking. The tallest
  frame (204).
- **f3 · R**: back toward the stance. R hand lowering to the chest, L hand rising back toward the
  forward knife-hand guard. Sharingan still on. Face: cold.

QA: nothing reaches past the idle front edge (about x 182), the R hand never covers the eyes, and no
glow or light is drawn around the eyes.

<a id="superpose"></a>

### superPose: AMATERASU · 4 frames, loop · Mangekyō Sharingan [fallback `taunt`]

His **ultimate** (Heavy + Special, 3 bars). The engine holds this pose during the super flash, then
ignites black flames on the opponent. Without it the flash shows the "come at me" taunt, so generate
it. **The only animation with the Mangekyō Sharingan** (the one exception to CHARACTER.md §2, which
calls a pinwheel-shaped eye off-model). **PG: no blood from the eye**, no tears, no red streaks on the
face. No black flames, fire or glow in the sprite.

**Mangekyō (his own pattern):** both eyes. Red iris `#d81e28` with the thin dark-red rim `#7c0c16`, and
instead of the three small tomoe a **bold black (`#141018`) three-bladed pinwheel** around the pupil:
three curved, pointed blades, like a three-pointed throwing star, whose tips touch the rim of the iris.
At sprite scale (each eye about 4 to 5 px tall): a 2 × 2 px black center with three 1 px black points
reaching the red rim, so the eye reads as **red with a large black three-pointed star**, clearly darker
than the 3-tomoe Sharingan (red with a 1 px pupil). **No new colors are needed**: all three hexes are
already in his 34-color palette. If the pattern still cannot read with them, Codex may add at most 2
colors (listed in CHARACTER.md §7 first, total at or below 48) and tells Claude.

Base pose: standing tall and still, legs nearly straight with soft knees, feet shoulder-width, weight on
the R leg, body turned a bit more toward the camera (about 45°), head turned to the opponent at
screen-right so both eyes show, chin slightly down. **L hand raised to his left eye**: palm toward the
face, fingers spread, the fingertips resting along the brow and temple just above and beside the left
eye, framing it; **the left eye stays fully visible** under and between the fingers. R arm hangs relaxed
at his side. A cold, merciless glare, mouth a flat line. The raised hand stays below the top of his
hair.

- **f0**: as described.
- **f1**: bangs and rope ends sway 1 px.
- **f2**: the L fingers tense 1 px, rope ends and the cloth hem in a new flutter shape.
- **f3**: settle back toward f0, another small hair and cloth variation. Loops.

QA: feet identical and the body still in all 4 frames; the tallest frame is 208 (upright); the
Mangekyō reads on the packed frames (see §5).

---

## 3. Prompt blocks A39-A42 (for PROMPTS.md)

Index rows (step 9, after A38):

| step | id | asset | frames | images | CORE | save as (versioned; NN = next free version) |
|---|---|---|---|---|---|---|
| 9 | A39 | `specialForward`: CHIDORI SHARP SPEAR, spear-hand thrust | 7 | 2 | opt v2 | `raw/_parts/specialForward_vNN_A.png` + `raw/_parts/specialForward_vNN_B.png` → `raw/specialForward_vNN.png` |
| 9 | A40 | `specialUp`: LION'S BARRAGE rising kick | 6 | 2 | opt v2 | `raw/_parts/specialUp_vNN_A.png` + `raw/_parts/specialUp_vNN_B.png` → `raw/specialUp_vNN.png` |
| 9 | A41 | `specialDown`: SHARINGAN COUNTER stance | 4 | 1 | opt v2 | `raw/specialDown_vNN.png` |
| 9 | A42 | `superPose`: AMATERASU, Mangekyō Sharingan glare (loop) | 4 | 1 | opt v2 | `raw/superPose_vNN.png` |

**Step 9 · optional, move system v2 (ADR 0009)**

These four names are optional for every fighter (fallback in brackets in the titles). For Sasuke they
are the visible half of his kit: within step 9 run A42 `superPose` first (every Amaterasu shows it),
then A39 and A41. A40 attaches the approved `airHeavy` strip (step 5), so it waits for that approval.
They need manifest rows before the packer picks them up (KIT.md §1).

### A39 · `specialForward`: CHIDORI SHARP SPEAR, spear-hand thrust (opt v2, fallback `special`)

7 frames, phases 2/2/3, Sharingan in poses 2-5. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/specialForward_vNN_A.png` and `raw/_parts/specialForward_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/specialForward_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light1` strip (`raw/light1_vNN.png` with NN = its `approvedVersion`; same lead-hand line); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialforward). This move uses the **left** hand, open and empty in every frame: the engine draws the lightning in it and the spear from the fingertips. If refused, replace "Chidori Sharp Spear" and "Sharingan" per CHARACTER.md §9.

Part A (save as `raw/_parts/specialForward_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialForward", CHIDORI SHARP SPEAR, a fast, short-range spear-hand thrust with the LEFT hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
EYES: the Sharingan in poses 2 to 5 (glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it); normal dark eyes (#2c2c40) in poses 1, 6 and 7.
1. From his fighting stance, the weight starts shifting forward onto the left (front) foot, knees starting to bend; the LEFT hand pulls back from the guard and down to his left hip, palm open, fingers slightly spread, the elbow bent back; the right fist guards his chest; the left shoulder turns slightly away. Face: cold.
2. Weight forward, knees bent deeper, shoulders coiled, head forward: the LEFT hand held low beside his left hip and a little in front of it, palm open and turned forward and down, fingers spread and tense, the whole hand clearly visible in front of the waist cloth. The eyes flare red. Face: focused.
3. IMPACT: hips and left shoulder drive forward into a deep lunge, left leg forward and bent, right leg straight back; the LEFT ARM FULLY EXTENDED horizontally to the right at the height of his own lowered chest, a spear-hand with the fingers straight and pressed together, palm down, wrist straight; the right fist pulled back to his right hip; chin tucked behind the left shoulder. SMEAR: a solid tapered streak from the hip to the fingertips in the sleeve, arm-guard and skin colors (no blur). Face: angry, teeth just showing.
4. Same extension without the smear, the fingertips slightly further; bangs, rope ends and waist cloth whipping forward from the sudden stop. Face: angry.
MOTION: Draw NO lightning anywhere: the left hand is open and empty in every frame (the game adds the lightning in the hand and the lightning spear from the fingertips). The sword stays sheathed at his back. The lunge stays inside its slot.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialForward_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialForward", CHIDORI SHARP SPEAR, a fast, short-range spear-hand thrust with the LEFT hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
EYES: the Sharingan in poses 2 to 5 (glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it); normal dark eyes (#2c2c40) in poses 1, 6 and 7.
5. Pulling the arm back: the left elbow bends, the hand retracting toward his chest, the body rising out of the lunge, weight shifting back. Sharingan. Face: cold.
6. The left hand back near the guard, opening into the knife-hand; the left foot slides back; normal dark eyes. Face: cold.
7. Fighting stance (same as idle frame 1), normal dark eyes. Face: cold.
MOTION: Draw NO lightning anywhere: the left hand is open and empty in every frame (the game adds the lightning). The sword stays sheathed at his back.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A40 · `specialUp`: LION'S BARRAGE rising kick (opt v2, fallback `special`)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/specialUp_vNN_A.png` and `raw/_parts/specialUp_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/specialUp_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airHeavy` strip (`raw/airHeavy_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialup). The slam is his `airHeavy` strip, so pose 6 must match `airHeavy` pose 1. Normal dark eyes (no Sharingan). If refused, replace "Lion's Barrage" per CHARACTER.md §9.

Part A (save as `raw/_parts/specialUp_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialUp", LION'S BARRAGE rise: a rising anti-air kick that carries him straight up (it ends in his double-fist hammer slam). 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are HIT frames (an anti-air kick on the way up): the right foot kicks straight up in front of his face and is the highest point of the character; head, hair, rope ends and waist cloth stay below and behind it.
1. Crouch: knees deeply bent, torso leaning forward, both arms swung down and back, head up looking up and forward at the target. Back hair spikes squashed slightly, the waist-cloth hem pooled over the knees. Face: focused.
2. Spring: legs extending explosively, heels off, toes last on the ground, the torso still leaning forward and the knees not yet straight; both arms swinging forward to chest height (the hands no higher than his chin). Face: focused.
3. IMPACT: rising straight up through the air; the RIGHT LEG KICKS STRAIGHT UP in front of his body, knee locked, the ball of the foot leading, the foot in front of his face at about the height of the top of his hair (no more than a few pixels above it); torso upright, leaning back slightly; the left leg hangs below with the knee slightly bent and the toes pointed (the lowest point); both arms swept down and back along his sides. The kicking leg comes out between the panels of the waist cloth. SMEAR: a solid crescent from the hip up to the foot (no blur). Face: angry, teeth showing. Bangs, rope ends and the cloth hem dragged downward by the rise.
4. Same rising kick without the smear, the foot slightly higher. Face: angry.
MOTION: All poses after pose 2 are in mid-air. Normal dark eyes in every pose. Draw NO lightning, dust or speed lines: the game adds the effects. Nothing in poses 5 and 6 rises above the kicking foot of pose 3.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialUp_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialUp", LION'S BARRAGE rise: a rising anti-air kick that carries him straight up (it ends in his double-fist hammer slam). 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Turning over at the top of the jump: the kicking leg folds, both knees tuck toward his chest, the body tips forward over the top (torso pitched about 30 degrees forward, head looking down at the target below on the right), both arms swinging up past his shoulders with the hands coming together. Face: focused.
6. Apex hang: both hands clasped together (fingers interlocked) raised overhead, torso arching back, knees tucked; this pose leads straight into his double-fist hammer slam (match the first pose of the attached airHeavy strip exactly). Face: shout.
MOTION: All poses are in mid-air. Normal dark eyes in every pose. Draw NO lightning, dust or speed lines. Nothing in poses 5 and 6 rises above the kicking foot of pose 3 in part A.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A41 · `specialDown`: SHARINGAN COUNTER stance (opt v2, fallback `charge`)

4 frames, phases 2/1/1, Sharingan in poses 2-4. **Save as: `raw/specialDown_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialdown). A still stance with no hit box; pose 3 is the frame players see longest. Draw **no glow or flash**: the engine adds the counter effect. If refused, replace "Sharingan" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialDown", SHARINGAN COUNTER: a calm, perfectly still reading stance that waits for the opponent's attack. 4 frames, left to right. No strike in any pose.
EYES: the Sharingan in poses 2 to 4 (glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it); normal dark eyes (#2c2c40) in pose 1.
1. Settling out of his fighting stance: knees bending a little more, torso coming upright, weight centered; the right hand starts rising, open; the left hand starts dropping. Eyes dark and narrowing. Face: cold.
2. The calm guard: the RIGHT hand raised open in front of his face, palm toward the opponent on the right, fingers straight up and together, held a little forward of the face with the fingertips just below eye height so both eyes stay visible; the LEFT hand low in front of his stomach, open and ready; chin down. The eyes snap to the Sharingan. Face: cold, intense stare.
3. HELD READING STANCE: the same pose, perfectly still and balanced, the Sharingan glaring at the opponent on the right; the left hand low and ready, fingers loose. Bangs, rope ends and waist cloth completely at rest. Face: cold, unblinking.
4. Relaxing back toward his fighting stance: the right hand lowering to his chest, the left hand rising back toward the forward knife-hand guard; Sharingan still on. Face: cold.
MOTION: Feet identical in all 4 frames. A still, controlled stance: no strike, nothing reaches forward. Draw NO glow, aura or lightning around him or his eyes: the game adds the counter flash.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A42 · `superPose`: AMATERASU, Mangekyō Sharingan glare (loop) (opt v2, fallback `taunt`)

4 frames, loops, **Mangekyō Sharingan** (the only strip with it). **Save as: `raw/superPose_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superpose). His ultimate's pose (Heavy + Special): without it the super flash shows the taunt, so generate it. **No blood** from the eye (PG) and **no black flames**: the engine ignites them on the opponent. If refused, replace "Amaterasu" and "Mangekyō Sharingan" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "superPose", AMATERASU: a cold, perfectly still eye-technique stare at the opponent (shown during the super flash). 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: the MANGEKYŌ SHARINGAN in both eyes in every frame (the only animation with this eye; it overrides the eyes of the attached sheets): glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16) and, instead of the three small comma marks, one bold black (#141018) three-bladed pinwheel around the pupil: three curved, pointed black blades, like a three-pointed throwing star, whose tips reach the rim of the iris. Even at small size each eye must read as red with a large black three-pointed star in the middle, clearly darker than the normal Sharingan. No blood, no tears, no red streaks on the face.
1. Standing tall and still: legs nearly straight with soft knees, feet shoulder-width apart, weight on the right leg, body turned a bit more toward the viewer, head turned toward the opponent on the right so both eyes show, chin slightly down. The LEFT hand raised to his left eye: palm toward his face, fingers spread, the fingertips resting along his brow and temple just above and beside the left eye, framing it; the left eye stays fully visible under and between the fingers. The right arm hangs relaxed at his side. A cold, merciless glare, mouth a flat line. A light wind moves the bangs, rope ends and cloth hem.
2. Same pose; bangs and rope ends sway slightly.
3. Same pose; the left fingers tense slightly; the rope ends and cloth hem in a new flutter shape.
4. Settling back toward frame 1, another small hair and cloth variation.
MOTION: A menacing still pose: the body does not move, only the hair, cloth and fingers. Feet identical in all frames. The raised hand stays below the top of his hair. Draw NO black flames, fire, aura or glow: the game adds them.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

---

## 4. beamCharge and beamFire become KIRIN (Sasuke no longer fires a beam)

His SUPER (3 bars) is now KIRIN: he raises an arm to call a storm, then brings it down to aim a lightning
dragon at the opponent. The engine draws the storm, the lightning and the dragon. These two entries and
prompt blocks **replace** the Lightning Lance versions in his ANIMATIONS.md (`beamCharge`, `beamFire`)
and PROMPTS.md (A16, A17); they stay **CORE, step 7**. Codex swaps them in when it merges KIT.md,
**before** it generates those two strips (both are still `todo`). The old note about a Chidori anchor
at the `beamCharge` hand (about (84, 155)) goes with them.

<a id="beamcharge"></a>

### beamCharge: KIRIN, calling the storm · 3 frames, loop · 👁 Sharingan

Wide, low stance (feet well apart, L foot forward, knees bent), torso upright. **R (near) arm raised
straight up toward the sky beside his head** (not in front of the face; the elbow may be very slightly
soft), hand open, palm up, fingers spread: the **fingertips about one head above the top of his hair**
(hand at about x 104 to 132, y 8 to 30, the top of the frame). L arm low at his side, hand open. Head
tilted up toward the raised hand. Sharingan on. Face: cold focus, mouth a flat line. Bangs, rope ends,
the waist cloth and the open shirt **whipped hard toward screen-left by a storm wind**. No lightning,
clouds or storm in the sprite. Codex measures the raised palm center on the packed frames and writes it
in MOVES_AND_VFX.md (Claude anchors the storm and lightning there).

- **f0**: as described.
- **f1**: whole body 1 px lower, bangs, rope ends and cloth in a new whipping shape.
- **f2**: back up, the raised fingers flex 1 px, another hair and cloth shape. Loops.

QA: `bodyHeight` 230 (not 198, see §1); the head matches idle within 3 px after packing; feet identical
in all 3 frames.

<a id="beamfire"></a>

### beamFire: KIRIN, bringing the lightning down · 3 frames, loop · 👁 Sharingan

The raised arm has swung **down and forward toward the opponent, pointing at the target** while the
dragon falls. Wide, low stance (L foot forward, knees bent), torso leaning slightly forward. **R arm
fully extended toward screen-right, slightly below shoulder height**, hand open, fingers straight and
together, pointing at the opponent: **fingertips in about x 212 to 234, y 108 to 130**, the right-most
point of every frame (the old beam origin (230, 122) sits at the fingertips, in case the engine keeps a
hand flash there). L arm pulled back low at his side. Head behind the R shoulder, glaring along the arm.
Sharingan on. Face: cold, mouth a flat line. Bangs, rope ends, waist cloth and sleeves **whipped back
toward screen-left** by the blast wind. No lightning, dragon or energy in the sprite.

- **f0**: as described.
- **f1**: recoil, whole body 1 to 2 px back, bangs and rope ends in a new whipping shape.
- **f2**: pushing 1 px forward again. Loops.

QA: `bodyHeight` 198; same scale as `beamCharge` (head within 3 px); feet identical in all 3 frames.

**Index rows** (titles change; step 7, CORE, unchanged file names):

| step | id | asset | frames | images | CORE | save as (versioned; NN = next free version) |
|---|---|---|---|---|---|---|
| 7 | A16 | `beamCharge`: KIRIN, calling the storm (loop) | 3 | 1 | **CORE** | `raw/beamCharge_vNN.png` |
| 7 | A17 | `beamFire`: KIRIN, bringing the lightning down (loop) | 3 | 1 | **CORE** | `raw/beamFire_vNN.png` |

### A16 · `beamCharge`: KIRIN, calling the storm (loop) (CORE)

3 frames, loops, Sharingan on. **Save as: `raw/beamCharge_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamcharge). Taller than the other strips: set `bodyHeight` 230 in the manifest before packing (KIT.md §1). Draw **no lightning, clouds or storm**: the engine draws them. If refused, replace "Kirin" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "beamCharge", KIRIN: he raises one arm to the sky to call down a storm. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
1. Wide, low stance: feet well apart, left foot forward, knees bent, torso upright. The RIGHT ARM RAISED STRAIGHT UP toward the sky beside his head (not in front of his face), the hand open with the palm up and the fingers spread, the fingertips about one head above the top of his hair; the left arm low at his side, hand open. Head tilted up toward the raised hand. Face: cold focus, mouth a flat line. Bangs, rope ends, the waist cloth and the open shirt whipped hard to the left by a storm wind.
2. Same pose, the whole body very slightly lower; bangs, rope ends and cloth in a new whipping shape.
3. Same pose, back up, the raised fingers flexing slightly; another hair and cloth shape.
MOTION: A tense, still loop: only the hair, cloth and fingers move. Feet identical in all frames. Draw NO lightning, clouds or energy: the game adds the storm.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A17 · `beamFire`: KIRIN, bringing the lightning down (loop) (CORE)

3 frames, loops, Sharingan on. **Save as: `raw/beamFire_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `beamCharge` strip (`raw/beamCharge_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamfire). Draw **no lightning dragon or energy**: the engine draws it. If refused, replace "Kirin" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "beamFire", KIRIN: he brings the raised arm down to point at the opponent while the lightning falls. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
1. Wide, low stance: left foot forward, knees bent, torso leaning slightly forward. The RIGHT ARM SWUNG DOWN AND FORWARD and fully extended toward the opponent on the right, slightly below shoulder height, the hand open with the fingers straight and together, pointing at the target; the left arm pulled back low at his side. Head behind the right shoulder, glaring along the arm. Face: cold, mouth a flat line. Bangs, rope ends, waist cloth and sleeves whipped back to the left by the blast wind.
2. Recoil: the whole body pushed slightly back; bangs and rope ends in a new whipping shape.
3. Pushing slightly forward again.
MOTION: The pointing fingertips are the right-most point of every frame. Draw NO lightning, dragon or energy: the game draws the lightning dragon.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

---

## 5. QA per animation

Run the usual strip checks too (about 6.5 heads, head about 31 px and within 3 px of idle after
packing, facing right, the Hebi outfit, flat magenta, at most 48 colors, inside x 4..251, y 4..240).

**specialForward** (→ + Special · Chidori Sharp Spear)

- [ ] Sword sheathed at the back of the belt in all 7 frames; its grip never sticks out past the hand.
- [ ] The **left** hand is the technique hand, open and empty; on f0-f1 it is fully visible in front of
      the waist near (146, 156). Codex writes the measured palm center in MOVES_AND_VFX.md.
- [ ] f2-f3: the L fingertips are the right-most pixels, in x 210-234, y 128-152 (near (220, 140)).
- [ ] Sharingan on f1-f4 only; dark eyes on f0, f5 and f6.
- [ ] f6 matches idle f0; nothing is taller than f6 (204); the lunge stays inside the cell.
- [ ] No lightning, spear or glow drawn; the smear is a solid shape in limb colors.

**specialUp** (↑ + Special · Lion's Barrage)

- [ ] Sword sheathed in all 6 frames, turning with the hips.
- [ ] **f5 matches airHeavy f0** (clasped hands overhead, arched back, knees tucked; head within 3 px
      of airHeavy's after packing).
- [ ] f2 is the tallest frame (214): the kicking foot at about the hair top, at most about 10 px above;
      f1 stays lower (torso still forward, hands no higher than the chin); f4-f5 never rise above the f2 foot.
- [ ] Dark eyes in all 6 frames (no Sharingan).
- [ ] Airborne frames keep their lowest point near the middle of the shape (no sideways jump after packing).
- [ ] No lightning, dust or speed lines.

**specialDown** (↓ + Special · Sharingan counter)

- [ ] Feet identical in all 4 frames; sword sheathed.
- [ ] Sharingan on f1-f3 only; dark eyes on f0; both eyes visible above the raised R hand.
- [ ] f2 reads perfectly still (hair, rope ends and cloth at rest) and is the clearest pose of the strip.
- [ ] Nothing reaches past the idle front edge (about x 182); the manifest row has `"hitbox": false`.
- [ ] No glow, flash or lightning drawn.

**superPose** (ultimate · Amaterasu)

- [ ] **Mangekyō readable** on the packed frames: each eye shows red with a black three-pointed shape,
      not just a 1 px pupil. If it collapses to a dot, redraw the frame (F1) or touch up the eye pixels
      by hand with only `#d81e28`, `#7c0c16` and `#141018`.
- [ ] Both eyes Mangekyō in all 4 frames; the left eye is not covered by the fingers.
- [ ] **No blood**, tears or red streaks; no black flames, fire, aura or glow.
- [ ] Body still and feet identical; only hair, cloth and fingers vary; the loop has no pop.
- [ ] Tallest frame 208 (upright); the raised hand stays below the hair top; sword sheathed.
- [ ] Palette still 34 colors (or at most 36, with the additions listed in CHARACTER.md §7).

**beamCharge** (SUPER · Kirin call; replaces the beam charge)

- [ ] Sharingan in all 3 frames; sword sheathed; feet identical.
- [ ] The R arm is raised straight up beside the head and the face stays fully visible; the fingertips
      about one head above the hair top.
- [ ] `bodyHeight` set to 230 in the manifest before packing; the head matches idle within 3 px
      (adjust the number, not the art, if it is off).
- [ ] No lightning, clouds or storm drawn.

**beamFire** (SUPER · Kirin strike; replaces the beam fire)

- [ ] Sharingan in all 3 frames; sword sheathed; feet identical.
- [ ] The pointing fingertips are the right-most pixels of every frame, in about x 212-234, y 108-130.
- [ ] Same character scale as the approved `beamCharge` (head within 3 px).
- [ ] No lightning, dragon or beam drawn.
