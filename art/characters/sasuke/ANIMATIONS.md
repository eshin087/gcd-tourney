# Sasuke: animations, frame by frame

Every animation the engine knows, in the canonical order and frame counts of
`src/art/animGuide.js`, for **art spec v2** ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md):
256×256 cells, Shippuden designs at about 6.5 heads). Each frame lists **phase**, **body and legs**,
**hands**, **face**, and **hair / cloth** motion. Design facts (palette, landmarks, near/far side,
Sharingan schedule, the sheathed sword) are in [CHARACTER.md](CHARACTER.md). How each move looks
in-engine and which effects the engine adds: [MOVES_AND_VFX.md](MOVES_AND_VFX.md). Prompts:
[PROMPTS.md](PROMPTS.md) (prompt ids in the summary table). If this file disagrees with ADR 0007 or
[art/SPEC.md](../../SPEC.md), they win. Fix this file.

## Conventions

- **f0, f1, …** are 0-based frame numbers. They match the file names `frames/<anim>/<anim>_00.png`,
  the `hitboxes.json` frame keys and the SPEC.md contact-zone frames. In the prompts, "frame 1" is f0.
- **Phase** (attacks only): **S** startup, **A** active (the hitbox is live: the limb must be fully
  extended where the opponent's body is), **R** recovery. Gameplay timing lives in
  `src/game/moves.js`, and the engine stretches attack frames over the move's phases. Active-frame
  numbers are unchanged from spec v1.
- **R / L** are Sasuke's right / left. Facing right in 3/4 view, **R = near the camera**,
  **L = far side**. Stance: L foot and L hand forward.
- **Forward = screen-right.** Every strike travels horizontally toward screen-right at the listed
  height. No strikes angled into or out of the screen. The 2.5D engine lines fighters up in depth, and
  a hit only lands if the drawn fist or foot overlaps the opponent's body on the horizontal.
- **Coordinates** are final-cell pixels (256×256, x from the left, y from the top, soles on y 240,
  body center line x 128) at the idle scale of CHARACTER.md §3. The image generator will not hit them
  exactly. They tell Codex what to check after packing and where the engine anchors effects. Contact
  zones come from ADR 0007.
- **Proportions:** about 6.5 heads in every frame (head about 31 px). Long legs, long arms: a fully
  extended punch reaches about 95 px from the shoulder, a straight kick about 100 px from the hip.
  No frame may drift toward chibi (bigger head, shorter legs).
- **Smear frame:** the moving limb is drawn as one solid, tapered shape in the limb's own colors,
  stretched along its path. No blur, no transparency, no speed lines, no motion-blur gradient.
- **Airborne and lying poses:** draw them normally. The packer drops the lowest body pixel onto
  y 240, and the engine moves the sprite in the air. In air attacks never let a fist or foot go lower
  than the lowest foot, or the body jumps between frames.
- **Centering:** the packer puts the mean x of the bottom 20 % of each frame's rows on x 128. Keep the
  hips over the midpoint between the feet so the body does not slide. In airborne and lying poses,
  put the lowest part of the body near the **middle** of the shape (the knees in `superDash`, the
  hips in `launched`, the whole back in `down` / `ko`); a pose whose lowest point is at one end
  shifts sideways and clips. Keep the waist-cloth hem and the rope ends out of the bottom rows where
  you can, or keep them symmetric around the legs.
- **Height check:** the packer scales each strip so its **tallest frame** equals the `bodyHeight`
  below. A pose taller than intended (a fist far above the head, for example) shrinks the whole
  strip. If a packed strip's head looks more than 3 px smaller or larger than `idle`'s in the Sprite
  Lab, fix the pose, or Codex adjusts that animation's `bodyHeight` in `art/manifest.json` and logs it
  in `art/TRACKER.md`.
- **Forward-most rule:** on active frames the striking fist, foot or hand is the right-most part of
  the silhouette. No bangs, rope ends, waist cloth or sword may stick out further to the right.
- **Cell margin:** after packing every opaque pixel sits inside x 4..251, y 4..240.
- **Sword:** sheathed at the small of his back in **every** frame (CHARACTER.md §4 for how it looks
  in each view). It never leaves the belt and never points forward.
- **No effects in character frames:** no lightning, fire, aura, dust, speed lines or shadows. The
  engine draws all of those (see MOVES_AND_VFX.md).

## Summary

`ms` = default ms per frame, copied from `art/manifest.json` (the manifest is the source of truth;
`special`, `intro`, `taunt` and `win` are Sasuke-specific). Attack ms only matter for previews,
because the engine time-stretches attacks over the move phases. `bodyHeight` = the ADR 0007 v2 table,
the **same for Naruto and Sasuke** (no per-character offsets). **Core** = required before the game uses
the custom sheet. **👁** = Sharingan on.

| anim | frames | phases S/A/R | loop | bodyHeight | ms | core | 👁 | prompt | tallest frame (what sets the height) |
|---|---|---|---|---|---|---|---|---|---|
| [idle](#idle) | 8 | | ✓ | 204 | 150 each | ✓ | | A01 | f2/f3 (breath top) |
| [run](#run) | 8 | | ✓ | 204 | 60 each | ✓ | | A02 | f3/f7 (flight, body highest) |
| [dash](#dash) | 2 | | ✓ | 160 | 60 each | ✓ | | A19 | either |
| [backDash](#backdash) | 3 | | | 207 | 60 60 80 | | | A24 | f2 (landing, legs extended) |
| [superDash](#superdash) | 2 | | ✓ | 120 | 50 each | | | A25 | either (angled 25° up, ~230 px wide) |
| [jumpSquat](#jumpsquat) | 1 | | | 162 | 70 | | | A26 | f0 |
| [jumpUp](#jumpup) | 2 | | ✓ | 198 | 80 each | ✓ | | A20 | f0 (fist at hair-top height) |
| [jumpFall](#jumpfall) | 2 | | ✓ | 209 | 80 each | ✓ | | A21 | f0 (legs extended down) |
| [land](#land) | 2 | | | 174 | 50 70 | ✓ | | A22 | f1 (rising) |
| [light1](#light1) | 7 | 2/2/3 | | 204 | 30 30 40 50 50 50 30 | ✓ | | A03 | f0/f6 (stance) |
| [light2](#light2) | 7 | 2/2/3 | | 204 | 35 30 40 50 60 50 30 | ✓ | | A04 | f6 (stance) |
| [light3](#light3) | 7 | 2/2/3 | | 215 | 40 35 45 60 60 60 30 | ✓ | | A05 | f2 (on the ball of the L foot) |
| [light4](#light4) | 8 | 3/2/3 | | 207 | 50 45 35 40 70 70 70 40 | ✓ | | A06 | f3 (on the ball, leg at head height) |
| [heavy](#heavy) | 8 | 3/2/3 | | 218 | 40 35 30 50 70 70 60 30 | ✓ | | A07 | f4 (fist about 14 px above the hair) |
| [airLight1](#airlight1) | 5 | 1/2/2 | | 198 | 45 35 50 50 30 | ✓ | | A08 | f0/f4 (air neutral) |
| [airLight2](#airlight2) | 5 | 1/2/2 | | 207 | 45 40 50 50 30 | | | A27 | f1 (leg extended) |
| [airLight3](#airlight3) | 6 | 2/2/2 | | 201 | 50 40 50 70 60 30 | | | A28 | f2 (kick at head height) |
| [airHeavy](#airheavy) | 6 | 2/2/2 | | 198 | 50 45 45 70 70 40 | ✓ | | A09 | f1 (clasped fists overhead) |
| [guard](#guard) | 2 | | ✓ | 198 | 300 each | ✓ | | A10 | f0 |
| [block](#block) | 2 | | | 204 | 60 80 | | | A29 | f1 (settling, a bit taller than guard) |
| [hurtHigh](#hurthigh) | 3 | | | 195 | 70 90 100 | ✓ | | A11 | f2 |
| [hurtLow](#hurtlow) | 3 | | | 183 | 70 90 100 | | | A30 | f2 |
| [launched](#launched) | 2 | | ✓ | 136 | 70 each | ✓ | | A12 | either (arched diagonal body) |
| [spin](#spin) | 4 | | ✓ | 160 | 60 each | | | A31 | f0 |
| [airRecover](#airrecover) | 3 | | | 180 | 50 50 60 | | | A32 | f2 (unfolding) |
| [down](#down) | 2 | | | 96 | 80 420 | ✓ | | A13 | f0 (knees up) |
| [getup](#getup) | 5 | | | 204 | 70 60 60 80 70 | ✓ | | A14 | f4 (stance) |
| [charge](#charge) | 4 | | ✓ | 198 | 50 each | ✓ | 👁 | A15 | any |
| [throw](#throw) (Fireball) | 4 | 1/1/2 | | 201 | 50 60 70 50 | | 👁 | A33 | f0 (upright inhale) |
| [beamCharge](#beamcharge) | 3 | | ✓ | 198 | 50 each | ✓ | 👁 | A16 | any |
| [beamFire](#beamfire) | 3 | | ✓ | 198 | 50 each | ✓ | 👁 | A17 | any |
| [vanish](#vanish) | 2 | | | 221 | 50 each | | | A34 | f1 (stretched) |
| [stagger](#stagger) | 4 | | ✓ | 207 | 150 each | | | A35 | f1/f3 (upright) |
| [ko](#ko) | 1 | | | 64 | 500 | | | A36 | f0 |
| [special](#special) (Chidori) | 8 | 3/3/2 | | 204 | 120 120 120 100 100 160 120 80 | ✓ | 👁 | A18 | f0 (stance) |
| [intro](#intro) | 4 | | ✓ | 210 | 200 each | | | A37 | any (upright) |
| [taunt](#taunt) | 2 | | ✓ | 212 | 300 each | | 👁 | A38 | any (upright) |
| [win](#win) | 4 | | ✓ | 212 | 250 each | ✓ | | A23 | any (upright; hand at head height, not above the hair) |

38 animations, 154 frames (10 rows of the 16-column, 4096 px wide sheet). The 23 core animations are
108 frames.

---

## Movement

<a id="idle"></a>

### idle: 8 frames, loop

Fighting stance, slow breathing. **Feet are identical in all 8 frames** (no foot sliding). This strip
becomes `reference/idle_approved.png`, the pose and proportion anchor for every later strip.

Base pose: knees bent about 20°, feet a bit wider than the shoulders, L foot forward with the toes to
screen-right (toes at x ~172), R foot back and turned out 45° (heel at x ~86), weight slightly back.
Torso leans forward about 10° and is turned 35° to the camera. L (lead) arm forward, elbow bent about
30°, open knife-hand at chin height (x ~172 to 180, y ~78 to 90), fingers together. R fist in front of
the chest (x ~150, y ~102), elbow down. Chin slightly down, eyes on screen-right. The rope bow peeks out
behind his lower back, the sword grip sticks out behind his near hip (x ~90 to 100, y ~134 to 142),
and the waist-cloth hem hangs at knee height, parted by the forward L thigh.

- **f0**: base pose, neutral height. Face: cold, mouth a flat line. Bangs and bow at rest.
- **f1**: inhale, chest and shoulders up 1 px. Bangs lag (no change yet).
- **f2**: top of the breath, up about 2 px. L fingers relax slightly. Bangs swing 1 px back.
- **f3**: hold the top. Rope ends drift 1 px down-left.
- **f4**: exhale, back to +1 px.
- **f5**: neutral height (same as f0).
- **f6**: low point. Knees bend 1 to 2 px more, shoulders drop 1 to 2 px. Bangs swing 1 px forward,
  cloth hem settles 1 px.
- **f7**: back up toward f0 (a clean loop into f0). Rope ends drift back.

QA: hair top y ~36, skull top ~52, soles 240 (trimmed height 204). The lead hand is the idle front
edge (x ~180); nothing in idle reaches past ~x 182, because the packer finds strike hitboxes from
whatever reaches past idle's right edge minus 9 px (~x 172 to 174 for an idle front edge at x 180 to 182).

<a id="run"></a>

### run: 8 frames, loop

Ninja run. Torso leans about 40° forward, head up, eyes forward. **Both arms trail straight back**
behind him, about 20° above horizontal, hands open with fingers together and palms up. The arms bob
2 px opposite to the body. Bangs and rope ends stream back to screen-left the whole time with a 1 px
alternating flutter. The waist cloth streams back and parts around the legs (the front panel flips back
over the forward thigh). The sword stays level behind the hips and does not bounce. Face: cold, focused,
mouth closed.

- **f0**: contact. L leg reaches forward, ball of the foot touching the floor ahead (x ~186). R leg
  behind, toes pushing off.
- **f1**: down. Weight on the L leg, knee bent deepest, body at its lowest. R heel lifting behind.
- **f2**: passing. L leg under the hips. R knee swings forward past it. Body rising.
- **f3**: flight. Both feet off the floor. R knee forward and up, L leg extended back. Body at its
  highest.
- **f4**: contact. R leg reaches forward, L leg behind pushing off.
- **f5**: down. Weight on the R leg, lowest body.
- **f6**: passing. L knee swings forward.
- **f7**: flight. L knee forward and up, R leg extended back. Loops into f0.

QA: with the long legs the flight stride is about 150 px wide; keep it inside x 4..251.

<a id="dash"></a>

### dash: 2 frames, loop

Low, fast forward dash. Torso leans about 50° forward, head up glaring forward. L knee bent under the
chest, R leg extended straight back, toes dragging. Arms trail straight back as in `run`. Face:
focused.

- **f0**: as described. Bangs, rope ends and waist cloth streaming back hard.
- **f1**: stride 6 px wider (L foot further forward, R further back), cloth hem and rope ends in an
  alternate flutter position.

<a id="backdash"></a>

### backDash: 3 frames

Quick hop backward (toward screen-left) while still facing right.

- **f0**: push-off. Knees bent, weight on the ball of the L (front) foot pushing back. Torso upright,
  leaning back about 6°. Arms rise into guard (both forearms in front of the chest). Face: cold.
- **f1**: airborne. Both feet off the floor, knees tucked, torso leaning back about 10°, arms forward
  for balance. Bangs, rope ends and the waist-cloth hem whip **forward** (screen-right).
- **f2**: landing on the ball of the R (back) foot, L foot about to touch, legs nearly extended
  (the tallest frame, 207), knees starting to absorb. Arms returning to the stance. Bangs swing back
  past rest.

<a id="superdash"></a>

### superDash: 2 frames, loop

Homing flight toward screen-right like a missile. **ADR 0007 pose:** the body flies **angled about 25°
upward** from horizontal (head and fist higher, hips lower), eyes locked on the target. **R arm thrust
forward along the flight line with a closed fist** (the leading point of the shape). L arm tucked along
his side, pointing back. **Knees bent sharply as if kneeling in the air**: thighs angled down and a little
forward from the hips, shins folded back so the feet trail behind; the **knees are the lowest point,
under the middle of the shape**. Toes pointed. Face: angry. The whole shape is about 230 px wide and
120 px tall.

- **f0**: as described. Back spikes flattened back, bangs, rope ends and waist cloth streaming straight
  back.
- **f1**: knees bent 4 px more and 2 px apart, cloth and rope ends in an alternate flutter.

QA: after packing the fist stays inside x 251 and the trailing feet inside x 4. If the shape shifts
sideways, the lowest point is not near its middle (see Conventions, Centering).

<a id="jumpsquat"></a>

### jumpSquat: 1 frame

- **f0**: deep crouch right before takeoff. Knees bent about 80°, L foot forward, torso leaning
  forward about 18°. Both arms swung down and back, hands open. Head up, looking forward and up. Back
  spikes squashed 1 to 2 px, waist-cloth hem pooled over the knees. Face: focused.

<a id="jumpup"></a>

### jumpUp: 2 frames, loop

Rising.

- **f0**: knees tucked high (L knee near the chest, R knee a little lower), torso upright. **R arm
  raised up and forward** (about 125°, closed fist at hair-top height, in front of the head). L arm
  down and back. Head tilted slightly up. Bangs, rope ends and the cloth hem **dragged downward** by
  the upward motion. Face: cold.
- **f1**: knees 2 px lower, R arm 2 px lower, bangs and rope ends in an alternate flutter.

<a id="jumpfall"></a>

### jumpFall: 2 frames, loop

Falling.

- **f0**: legs extending down, L leg slightly forward and slightly bent, R leg slightly back and
  slightly bent, toes pointed down (the tallest frame, 209). Arms out for balance (R arm out forward
  and up about 70°, L arm out back), hands open. Bangs and rope ends **lifted upward**, waist-cloth hem
  lifted 4 to 6 px and flared. Face: cold.
- **f1**: arms 2 px higher, bangs, rope ends and hem in an alternate flutter.

<a id="land"></a>

### land: 2 frames

- **f0**: impact crouch (squash). Knees deeply bent, torso leaning forward about 20°, arms out forward
  and down for balance. Back spikes squashed 1 to 2 px, bangs swing down past rest (follow-through),
  cloth hem pools over the knees. Face: cold.
- **f1**: rising halfway back to the stance (the tallest frame, 174). Arms returning to guard, bangs
  and rope ends settling.

---

## Ground normals (auto combo: light ×4)

<a id="light1"></a>

### light1: jab with the L (lead) fist · 7 frames · phases 2/2/3

- **f0 · S**: anticipation. L hand closes into a fist and pulls back 6 to 9 px toward the chest. Torso
  turns slightly away, weight sinks 1 px. Face: cold.
- **f1 · S**: L fist launches, elbow half extended (fist at x ~186). Shoulders start rotating forward.
- **f2 · A · smear**: L arm **fully extended horizontally** at face height: **fist in x 206 to 226,
  y 64 to 86** (HIGH). L shoulder forward, chin tucked behind it, R fist guarding the chin. L foot
  slides forward about 9 px (step-in). Solid tapered smear behind the fist from about x 170 to the
  fist, in sleeve-white, arm-guard navy and skin colors. Face: angry.
- **f3 · A**: same extension without the smear, fist 1 to 2 px further (impact settle). Bangs flick
  forward 1 px; the white sleeve ripples.
- **f4 · R**: fist retracting halfway (x ~192), elbow bending.
- **f5 · R**: L hand back near the guard, opening into the knife-hand. L foot slides back.
- **f6 · R**: idle stance (matches idle f0).

<a id="light2"></a>

### light2: rear straight with the R (near) fist · 7 frames · phases 2/2/3

- **f0 · S**: hips coil. Torso twists back toward the camera. R fist cocked beside the R cheek, elbow
  back. Weight on the R (back) leg.
- **f1 · S**: hips and shoulders rotate forward, R fist driving forward past the chin (x ~164).
- **f2 · A · smear**: R arm **fully extended horizontally** at chin height: **fist in x 214 to 236,
  y 70 to 92** (HIGH), crossing in front of his body (fully visible, near side). Torso rotated almost
  to profile, the open shirt twisting with it. R heel lifted, pivoting on the ball of the foot. L hand
  pulled back to the chest. Solid smear trailing behind the R fist. Face: angry, teeth just showing.
- **f3 · A**: hold without the smear, fist 1 to 2 px further.
- **f4 · R**: R fist retracting, torso unwinding.
- **f5 · R**: R fist back in front of the chest, heel down.
- **f6 · R**: idle stance.

<a id="light3"></a>

### light3: front kick to the stomach with the R (near) leg · 7 frames · phases 2/2/3

- **f0 · S**: weight shifts onto the L (front) leg. R knee starts to lift, the waist cloth parting at
  the front. Guard tightens.
- **f1 · S**: R knee chambered high (thigh horizontal, knee at about x 176, y 150, shin hanging down).
  Torso leans back slightly. Arms in guard.
- **f2 · A · smear**: R leg **fully extended straight forward** at stomach height: **sole and ball of
  the foot in x 222 to 246, y 122 to 148** (LOW), toes pulled back. Torso leans back about 15°. R arm
  swings back and out for balance, L fist guards the chest. Standing up on the ball of the L foot (the
  tallest frame, 215). The kicking leg comes out between the panels of the waist cloth; the cloth stays
  behind the knee. Solid smear arc from the chamber to the foot, in pants navy and sandal black. Face:
  angry.
- **f3 · A**: hold without the smear, foot 1 to 2 px further.
- **f4 · R**: knee re-chambers (shin folds back).
- **f5 · R**: R foot sets down behind him. Arms return to guard.
- **f6 · R**: idle stance.

<a id="light4"></a>

### light4: spinning roundhouse finisher (wall bounce) · 8 frames · phases 3/2/3

Also used by the **vanish kick** after a teleport.

- **f0 · S**: wind-up. Torso twists toward the camera, arms coil in, knees bend. Face: angry.
- **f1 · S**: spin starts, pivoting on the ball of the L foot. Body turns so his **back faces the
  camera**: the crest on the back of the collar, the rope bow and the sword lying across the small of
  his back all show. R leg lifting. Head turns to spot the target over his shoulder.
- **f2 · S**: back to the camera, side-on. R knee chambered high and turned over (hip rolled). Head
  spotting the target at screen-right. Waist cloth flaring outward with the spin; the sword stays
  across his back, its ends within about 30 px of his hips.
- **f3 · A · smear**: R leg **fully extended high and horizontal**, the instep and shin striking at
  head height: **foot in x 224 to 248, y 56 to 88** (HIGH). Torso leans back about 25° to
  counterbalance, standing on the ball of the L foot, arms flung out. Big solid crescent smear from
  behind and below up to the foot. Face: shout.
- **f4 · A**: hold without the smear. Bangs, rope ends and cloth whip forward.
- **f5 · R**: leg dropping, rotation follows through.
- **f6 · R**: R foot sets down, regaining the stance.
- **f7 · R**: idle stance.

<a id="heavy"></a>

### heavy: rising uppercut launcher with the R (near) fist · 8 frames · phases 3/2/3

The engine adds a small hop. The fist path must pass **through the opponent's chin space in front of
him**, not straight up beside his own head.

- **f0 · S**: crouch starts. Knees bend, torso leans forward about 20°, R fist drops low beside the
  R hip.
- **f1 · S**: deepest crouch (squash). R fist low behind the hip, L hand forward guarding. Head down,
  eyes on the target. Cloth hem pooled over the knees.
- **f2 · S**: legs explode upward. R fist starts its upward arc in front of the stomach.
- **f3 · A · smear**: rising, heels off, toes last to leave the floor. R fist driving **up and
  forward** through chin height in front of him: **fist in x 180 to 208, y 58 to 86** (HIGH), arm about
  45 to 60° above horizontal. Torso leans back 10 to 15°, L arm pulled down to his side. Solid crescent
  smear from the low position up to the fist. Face: shout.
- **f4 · A**: peak, fully airborne, knees bent and feet hanging with pointed toes (so his hair top is
  about as high as in idle). R arm up and forward (about 70°),
  **fist overhead at x 160 to 188 with its top at about y 22**, about 14 px above the top of his hair
  and no higher (the tallest frame, 218). ADR zone for this frame: x 160 to 188, y 22 to 46. Bangs and
  rope ends pulled down, waist cloth lifted.
- **f5 · R**: descending, arm coming down, knees bending.
- **f6 · R**: landing crouch.
- **f7 · R**: idle stance.

---

## Air normals

**Air neutral** (start and end pose of every air attack and `throw`): torso upright with a slight
forward lean, arms in guard; L knee bent forward and up, **R leg hanging down almost straight with the
toes pointed** (the lowest point of the pose, roughly where a standing foot would be, so his chest stays
at about y 100 to 120 after packing). Bangs and the cloth hem lifted slightly.

<a id="airlight1"></a>

### airLight1: mid-air jab with the L fist · 5 frames · phases 1/2/2

- **f0 · S**: air neutral, L fist pulled back to the chest, shoulders coiled. Face: cold.
- **f1 · A · smear**: L arm **fully extended horizontally** at his own chest height: **fist in x 206 to
  230, y 100 to 120** (MID). Torso leans forward 10°. Smear trailing the fist. Face: angry.
- **f2 · A**: hold without the smear.
- **f3 · R**: retracting.
- **f4 · R**: air neutral.

<a id="airlight2"></a>

### airLight2: mid-air front kick with the R leg · 5 frames · phases 1/2/2

- **f0 · S**: R knee chambered up to the chest.
- **f1 · A · smear**: R leg extends **straight forward**, angled slightly down, at his own hip height:
  **foot in x 220 to 246, y 130 to 155**. Torso leans back about 12°, R arm out behind for balance, the
  L leg hangs as the lowest point. Smear arc to the foot. Face: angry.
- **f2 · A**: hold without the smear.
- **f3 · R**: knee re-chambers.
- **f4 · R**: air neutral.

<a id="airlight3"></a>

### airLight3: mid-air spinning kick that knocks away (wall bounce) · 6 frames · phases 2/2/2

- **f0 · S**: body twists away (back toward the camera: collar crest, rope bow and the sword across his
  back visible), L knee chambered.
- **f1 · S**: spinning. Hips turn over, head spots the target at screen-right, waist cloth flaring.
- **f2 · A · smear**: L leg **fully extended forward**, heel leading, at his own chest-to-hip height:
  **heel in x 222 to 248, y 105 to 150** (MID). Body leans back about 18°, R knee tucked, arms flung
  (R back, L forward). Big crescent smear. Face: shout.
- **f3 · A**: hold without the smear.
- **f4 · R**: leg folding back in.
- **f5 · R**: air neutral.

<a id="airheavy"></a>

### airHeavy: double-fist hammer spike (ground bounce) · 6 frames · phases 2/2/2

- **f0 · S**: both hands clasped together (fingers interlocked) raised overhead. Torso arching back,
  knees tucked. Face: shout.
- **f1 · S**: peak of the wind-up. Arched further, clasped fists behind the head (the tallest frame,
  198).
- **f2 · A · smear**: torso whips forward about 40°. Both arms swing **down and forward**, straight,
  clasped fists in front of and below his chest: **fists in x 180 to 218, y 160 to 206**, smashing down
  onto the opponent. Knees bent, the feet hanging below the fists (the lowest point). Large vertical
  crescent smear from overhead to the fists.
- **f3 · A**: hold without the smear, fists 2 px lower. Bangs whip down.
- **f4 · R**: arms rising, body uncurling.
- **f5 · R**: air neutral.

---

## Defense and reactions

<a id="guard"></a>

### guard: 2 frames, loop

X-block. Both forearms (the navy arm guards) **crossed in front of his face and upper chest**, R forearm
in front (near), fists closed, elbows down. Chin tucked, eyes glaring over the crossed arms. Knees bent
more than in idle, weight back, L foot forward.

- **f0**: as described (the tallest frame, 198). Face: focused glare.
- **f1**: 1 px lower (breath). Bangs and rope ends sway 1 px.

<a id="block"></a>

### block: 2 frames

- **f0**: pushed back by a blocked hit. Whole body leans back about 6° and has slid back (R heel
  digging in). Arms still crossed but jarred upward. **Eyes shut tight**, teeth gritted. Bangs, rope
  ends and cloth hem blown back (screen-left).
- **f1**: settling back into the guard, knees a little straighter than guard f0 (the tallest frame,
  204).

<a id="hurthigh"></a>

### hurtHigh: hit in the face · 3 frames

f0 is the peak of the reaction, and it eases back over f1 and f2.

- **f0**: head snapped back (chin up, face tilted toward the sky). Torso arched back about 25°, both
  arms flung back and out, hands open. One foot slipping. Eyes squeezed shut, mouth open in pain.
  Bangs, rope ends and the cloth hem whip **forward**, back spikes jolted.
- **f1**: about 30 % recovered. Head coming down, arms swinging back in.
- **f2**: mostly recovered (the tallest frame, 195), still wincing, arms returning toward guard.

<a id="hurtlow"></a>

### hurtLow: hit in the stomach · 3 frames

- **f0**: doubled over. Torso bent forward about 40°, head down, both arms clutching the stomach
  (over the rope belt), knees bent. Eyes wide with tiny pupils, mouth open. Bangs swing forward and
  down.
- **f1**: about 30 % recovered.
- **f2**: rising (the tallest frame, 183), wincing, one hand still on the stomach.

<a id="launched"></a>

### launched: knocked flying backward · 2 frames, loop

Facing right, flying toward screen-left. **ADR 0007 pose: arched diagonally, not fully horizontal.**
The body is tilted about 60° back from upright and arched like a drawn bow with the belly up: the
**hips are the lowest point, near the middle of the shape**, the head and shoulders rise to the
upper-left, the legs bend and trail forward to the right at about hip height or a little higher. Arms
flung up and back past the head. Eyes shut, mouth open. Bangs, rope ends and the waist cloth whip
forward (screen-right). About 136 px tall and 180 to 190 px wide.

- **f0**: as described.
- **f1**: limbs in alternate positions (arms about 6° apart, the leg bend swapped).

<a id="spin"></a>

### spin: tumbling head over heels · 4 frames, loop

One full **backward** rotation, **counter-clockwise on screen** (head goes left, down, right, up).
Balled up: knees to the chest, arms bent in. Eyes shut in pain. Bangs, rope ends and the cloth trail
opposite to the rotation; the sword turns with his back.

- **f0**: tilted back 30° (head up-left), the tallest frame (160).
- **f1**: 120° (head pointing down-left).
- **f2**: 210° (upside down, head at the bottom).
- **f3**: 300° (head at the right, coming back around).

<a id="airrecover"></a>

### airRecover: mid-air backflip recovery · 3 frames

Backward flip, counter-clockwise on screen.

- **f0**: tucked, tilted back 60°, knees to the chest. Eyes open, regaining focus.
- **f1**: upside down (about 200°), fully tucked.
- **f2**: almost upright (about 340°), unfolding: legs extending down, arms out, cold glare (the tallest
  frame, 180).

<a id="down"></a>

### down: slammed into the floor · 2 frames

**ADR 0007 pose: lying flat with the head toward screen-left** (about 210 px long).

- **f0** (short): his back slams flat onto the floor from the shoulders to the hips (the whole back is
  the lowest part, so the pose stays centered); knees bent and lifted toward the upper-right by the
  bounce, arms flung out. Eyes shut, mouth open. Hair splashes out to the left. The tallest frame
  (96), about 180 px wide.
- **f1** (long hold): lying flat on his back, arms out at the sides, legs straight. Eyes closed,
  grimacing. Waist cloth splayed, the sword grip visible beside his near hip.

<a id="ko"></a>

### ko: 1 frame

- **f0**: **lying flat on his back, head toward screen-left** (ADR 0007, about 210 px long, 64 px
  tall), completely limp, arms splayed, one knee only slightly bent (a high knee would make the frame
  taller than 64). Eyes closed, mouth slightly open. Hair spread on the floor, waist cloth splayed,
  the sword grip visible beside his near hip.

<a id="getup"></a>

### getup: kip-up to standing · 5 frames

- **f0**: lying on his back (head toward screen-left), knees pulled to the chest, palms planted beside
  his head (fingers toward the shoulders). Eyes open, angry.
- **f1**: legs kick up and over toward the upper-right, back rolling onto the shoulders, hands pushing
  off.
- **f2**: springing up, airborne, torso tilted back about 40°, legs folding under him, arms out.
- **f3**: landing crouch (squash), arms coming into guard.
- **f4**: idle stance with an angry glare (the tallest frame, 204).

<a id="stagger"></a>

### stagger: dizzy (guard crush) · 4 frames, loop

Standing almost upright on wobbly knees, arms hanging loose. Eyes half-lidded and unfocused, mouth
slightly open. Bangs messy, hanging over the eyes.

- **f0**: torso and head lean toward screen-right about 8°.
- **f1**: centered, upright (tallest, 207).
- **f2**: lean toward screen-left about 8°.
- **f3**: centered.

---

## Ki, jutsu and ultimate

<a id="charge"></a>

### charge: powering up (hold Special) · 4 frames, loop · 👁 Sharingan

Wide stance (feet well apart, knees bent), arms down and out at his sides with **fists clenched and
shaking**, elbows slightly bent, torso leaning slightly back, head tilted up, shouting. Sharingan on.
Bangs, rope ends and the waist cloth **blown upward** by the aura wind, the open shirt and sleeves
fluttering. The engine draws the aura, flames and light streaks.

- **f0**: as described, shifted 1 px left.
- **f1**: shifted 1 px right, bangs and rope ends in a new flicker shape.
- **f2**: 1 px left, fists 1 px higher.
- **f3**: 1 px right, hair and cloth flicker variant. Loops.

<a id="throw"></a>

### throw: FIREBALL (Great Fireball Technique, air) · 4 frames · phases 1/1/2 · 👁 Sharingan

Performed **in mid-air**. The engine spawns the fireball at the start of f1, 0.5 units forward and 0.9
up: **(192, 125)** in the cell (ADR 0007). Sasuke's release point is his **mouth**, not a hand, so f1
pushes his head forward and down until the lips sit at about **x 186 to 198, y 118 to 132**, on the
spawn point (the ADR zone for a throwing hand is x 186 to 212, y 116 to 142; his mouth sits at its
left edge). The fireball is large and covers his face. **Do not draw any fire in the sprite.**

- **f0 · S**: inhale (the tallest frame, 201). Air-neutral legs, torso upright leaning back, chest
  puffed, cheeks full. Both hands forming the **tiger hand seal at the chin**: fingers interlaced, both
  index and middle fingers pointing up together. Sharingan on.
- **f1 · A**: exhale. Torso and head **lunge forward and down** toward screen-right (torso leaning
  about 30 to 35°), legs trailing back and down, mouth wide open and round (blowing), lips at about
  (192, 125). R hand raised beside the mouth with index and middle fingers held up. L arm swings back.
  Bangs and rope ends whip back. (Smear optional: a solid streak along the R hand's path.)
- **f2 · R**: still exhaling, mouth open smaller. Body drifting back from the recoil, legs extending.
- **f3 · R**: air neutral, hands lowering, mouth closed, Sharingan still on.

<a id="beamcharge"></a>

### beamCharge: LIGHTNING LANCE charge · 3 frames, loop · 👁 Sharingan

Chidori-style charge. Deep front stance (L foot forward, knees bent), torso **twisted back** away from
screen-right. **R hand held low and back at the R hip** (about x 76 to 92, y 146 to 164): open, palm
down, fingers spread. **L hand grips the R wrist.** Head turned toward the opponent at screen-right.
Sharingan on, teeth gritted. Bangs, rope ends and the waist cloth blown up and back, the open shirt
fluttering. No lightning in the sprite. (A proposed engine follow-up would draw Chidori lightning at
this hand, about (84, 155); see MOVES_AND_VFX.md §4.)

- **f0**: as described.
- **f1**: tremble 1 px forward, bangs and rope ends flicker variant.
- **f2**: tremble 1 px back, R fingers flex 1 px. Loops.

<a id="beamfire"></a>

### beamFire: LIGHTNING LANCE fire · 3 frames, loop · 👁 Sharingan

The engine starts the beam 0.8 units forward and 0.92 up: **(230, 122)** (ADR 0007), so the **spear-hand
tip must reach x 222 to 238 at y 112 to 132**.

Deep lunge toward screen-right: L leg forward and bent, R leg straight back, torso leaning forward
about 14°. **R arm thrust straight forward at chest height as a spear-hand** (fingers straight and
together, palm facing down). **L hand grips the R forearm just behind the wrist** to brace. Head behind
the R shoulder, Sharingan on, mouth open shouting. Bangs, rope ends, waist cloth and sleeves blown
**back** (screen-left) by the recoil. No beam in the sprite.

- **f0**: as described.
- **f1**: recoil, whole body 1 to 2 px back, bangs and rope ends flicker variant.
- **f2**: pushing forward again, 1 px forward. Loops.

<a id="vanish"></a>

### vanish: teleport · 2 frames

- **f0**: quick crouch (squash about 10 %). Torso leans 20° forward, arms pulled in. Eyes sharp.
- **f1**: stretched blur. Body stretched about 8 % taller and thinner, up on his toes, arms tight to
  his sides, bangs, rope ends and cloth streaming up (the tallest frame, 221). The lower half breaks
  into 3 or 4 **solid horizontal slices** offset sideways by 3 to 9 px (the anime high-speed
  afterimage). Solid shapes in his own colors, no transparency, no blur.

<a id="special"></a>

### special: CHIDORI · 8 frames · phases 3/3/2 · 👁 Sharingan

The engine draws the lightning and pins it to these hand positions. **Draw his hand open and empty.**
Timing (60 fps): startup 28 frames (f0 to f2), active 18 frames of rush (f3 to f5), recovery 20 frames
(f6 and f7). **On hit the engine jumps straight to f6**, so f6 must read as the impact pose by itself.

Lightning anchor (ADR 0007 "Effect anchor points"): during f0 to f5 (the whole startup and active
phase) it sits at about **(64, 199)**, low and behind his near leg. Only after a hit, for about 6 game
frames of f6, does it jump to about **(218, 140)** (thrust forward at stomach height); on a whiff the
lightning is gone in recovery.

> **Known gap (task ENG-015):** on f5 (the whiff thrust) the engine still draws the lightning at the
> back point, behind his leg, while the drawn spear-hand is forward. Draw f5 as described below; the
> engine task will move the lightning to the forward point for the last third of the active phase so
> it matches f5. Until then, a whiffed Chidori shows the hand forward and the lightning behind.

- **f0 · S**: Sharingan flares on. Feet planted, knees starting to bend. R arm snaps down and back, L
  hand reaching across his waist toward the R forearm. Face: angry.
- **f1 · S**: deep crouch, torso leaning forward about 30°. **R arm straight down and back behind his R
  leg, palm open facing the floor, fingers spread, hand at about (64, 199).** L hand reaches across
  and grips the R forearm halfway between elbow and wrist. Teeth gritted. Bangs, rope ends and the
  cloth hem blown upward by the chakra wind.
- **f2 · S**: same crouch, more tension: shoulders hunched, R fingers clawed, eyes locked on the target.
  Bangs and rope ends flicker variant.
- **f3 · A**: sprint 1. Ninja run with the torso leaning about 45°, head up, glaring forward. **R arm
  trails straight back and low**, open hand at about knee height behind him, well above the floor
  (about x 56 to 72, y 192 to 206; never lower than his knees).
  L arm swings back and up. L leg forward (contact). Bangs, rope ends and waist cloth streaming back.
- **f4 · A**: sprint 2. Legs swapped (R leg forward), R hand still trailing at knee height at the same spot.
- **f5 · A · smear**: thrust (shown when the rush whiffs). Hips and shoulders whip forward, **R arm
  snaps straight forward** at stomach height, spear-hand with fingers straight: **tip in x 206 to 222,
  y 130 to 150**, inside the ADR zone for the special hand (x 194 to 222, y 128 to 158). L leg lunges
  forward and bent, R leg straight back. Solid smear arc from the low trailing position up to the
  hand. Face: shout. (The engine lightning stays at the back point on f5 until ENG-015 lands.)
- **f6 · R**: **impact pose.** Deepest lunge, R arm fully extended, hand at about x 208 to 228, y 130 to
  150 (around the (218, 140) anchor), as if driven into the opponent's chest. Head down behind the
  shoulder, Sharingan glare, teeth gritted. Bangs, rope ends and the cloth whip forward from the stop.
- **f7 · R**: recovering. Arm still forward but bending, weight shifting back, torso rising. Mouth
  closed, Sharingan still on.

QA: on f3 and f4 the trailing hand sits just above the bottom 20 % of the frame; if it drops into those
rows it pulls the packed body to the right (see Conventions, Centering).

---

## Character moments

<a id="intro"></a>

### intro: arms-crossed cold stare · 4 frames, loop

Standing upright, legs straight, feet slightly apart, weight on the R leg. Body turned more toward the
camera (about 50°). **Arms folded across his chest** (R forearm over the L), covering the open V of the
shirt. Chin slightly raised, looking down his nose at the opponent (screen-right) through half-lidded
dark eyes, a faint one-sided smirk at most. A light breeze moves the bangs, rope ends and cloth hem.

- **f0**: as described.
- **f1**: breath, up 1 px. Bangs and rope ends sway 1 px.
- **f2**: head tilts 1 to 2 px (dismissive). Rope ends and cloth flutter further.
- **f3**: settle back toward f0.

<a id="taunt"></a>

### taunt: "come at me" · 2 frames, loop · 👁 Sharingan

Standing upright, body turned toward the camera, chin down, **Sharingan glare** with a slight smirk.
**L arm extended forward at chest height, palm up.** R hand relaxed at his side.

- **f0**: L fingers straight, palm up.
- **f1**: L fingers curl in (beckon). Rope ends flick.

<a id="win"></a>

### win: back-turned salute · 4 frames, loop

**3/4 back view**: his back faces the camera, his body points into the screen toward the upper-right.
The **crest on the back of the collar**, the **rope bow** and the **sword lying across the small of
his back** are all clearly visible. Head turned over his **R shoulder**, glancing back at the camera
with a faint smirk (one dark eye visible). **R hand raised to head height beside his head**, index and
middle fingers up (a casual two-finger salute). The hand stays no higher than the top of his hair.
L hand relaxed at his side. Standing upright.

- **f0**: as described.
- **f1**: bangs, rope ends and cloth hem flutter in the breeze.
- **f2**: two fingers flick forward 3 px (the salute).
- **f3**: settle, flutter variant.
