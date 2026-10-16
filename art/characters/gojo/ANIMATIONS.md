# Gojo: animations, frame by frame

Every animation the engine knows, in the canonical order and frame counts of
`src/art/animGuide.js`, for **art spec v2** ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md):
256×256 cells), plus the four **optional** animations of the move system v2
([ADR 0009](../../../docs/decisions/0009-move-system-v2.md)): `specialForward`, `specialUp`,
`specialDown`, `superPose`. Each frame lists **phase**, **body and legs**, **hands**, **face**, and
**hair / cloth** motion. Design facts (palette, landmarks, near/far side, the pockets schedule, the
blindfold and the Six Eyes) are in [CHARACTER.md](CHARACTER.md). How each move looks in-engine and
which effects the engine adds: [MOVES_AND_VFX.md](MOVES_AND_VFX.md). Prompts:
[PROMPTS.md](PROMPTS.md) (prompt ids in the summary table). If this file disagrees with ADR 0007 /
0009 or [art/SPEC.md](../../SPEC.md), they win. Fix this file.

## Conventions

- **f0, f1, …** are 0-based frame numbers. They match the file names `frames/<anim>/<anim>_00.png`,
  the `hitboxes.json` frame keys and the SPEC.md contact-zone frames. In the prompts, "frame 1" is f0.
- **Phase** (attacks only): **S** startup, **A** active (the hitbox is live: the limb must be fully
  extended where the opponent's body is), **R** recovery. Gameplay timing lives in
  `src/game/moves.js`, and the engine stretches the frames of each phase over the move's phase
  length (`src/game/kit.js` does the same for the kit moves). Active-frame numbers are the spec ones.
- **R / L** are Gojo's right / left. Facing right in 3/4 view, **R = near the camera**, **L = far
  side**. Stance: L foot forward, weight on the back (R) leg. His techniques use the **R hand**.
- **Forward = screen-right.** Every strike travels horizontally toward screen-right at the listed
  height. No strikes angled into or out of the screen. The 2.5D engine lines fighters up in depth, and
  a hit only lands if the drawn palm, elbow or foot overlaps the opponent's body on the horizontal.
- **Coordinates** are final-cell pixels (256×256, x from the left, y from the top, soles on y 240,
  body center line x 128) at the idle scale of CHARACTER.md §3. The image generator will not hit them
  exactly. They tell Codex what to check after packing and where the engine anchors effects. Contact
  zones come from ADR 0007 and are measured on a same-size (200 px) opponent, so on Gojo they sit a
  little lower on his own body (CHARACTER.md §3).
- **Proportions:** about **7 heads** in every frame (head about 31 px, standing body about 215 px).
  Long legs, long arms: a fully extended arm reaches about 100 px from the shoulder, a straight kick
  about 107 px from the hip. No frame may drift toward chibi (bigger head, shorter legs) or shrink him
  to the cast's 6.5-head height.
- **Height ceiling:** standing straight with his hair he is about 233 px tall, and the cell allows
  236 (y 4..240). So **no frame may be taller than him standing straight**, no hand, elbow or foot may
  rise above the top of his hair, and stretched poses stretch **thinner, not taller**. Each animation's
  `bodyHeight` below already respects that.
- **Hands in pockets:** follow the schedule in CHARACTER.md §4. A pocketed hand disappears under the
  jacket hem at the hip with the elbow hanging loosely out; keep that shape identical across frames.
- **Blindfold:** on in every frame of every animation **except `superPose`** (pushed up onto the
  forehead, eyes open and blue). Expressions read through the mouth and head tilt.
- **Smear frame:** the moving limb is drawn as one solid, tapered shape in the limb's own colors
  (navy sleeve or trouser, skin, black shoe), stretched along its path. No blur, no transparency, no
  speed lines, no motion-blur gradient.
- **Airborne and lying poses:** draw them normally. The packer drops the lowest body pixel onto
  y 240, and the engine moves the sprite in the air. In air attacks never let a hand or foot go lower
  than the lowest foot, or the body jumps between frames.
- **Centering:** the packer puts the mean x of the bottom 20 % of each frame's rows on x 128. Keep the
  hips over the midpoint between the feet so the body does not slide. In airborne and lying poses,
  put the lowest part of the body near the **middle** of the shape (the knees in `superDash`, the
  hips in `launched`, the whole back in `down` / `ko`); a pose whose lowest point is at one end shifts
  sideways and clips. Keep the jacket hem out of the bottom rows where you can.
- **Height check:** the packer scales each strip so its **tallest frame** equals the `bodyHeight`
  below. A pose taller than intended shrinks the whole strip. If a packed strip's head looks more than
  3 px smaller or larger than `idle`'s in the Sprite Lab, fix the pose, or Codex adjusts that
  animation's `bodyHeight` in `art/manifest.json` and logs it in `art/TRACKER.md`.
- **Forward-most rule:** on active frames the striking palm, elbow or foot is the right-most part of
  the silhouette. No hair spike, jacket hem or free hand may stick out further to the right.
- **Cell margin:** after packing every opaque pixel sits inside x 4..251, y 4..240.
- **No effects in character frames:** no blue vortex, red orb, purple beam, Infinity ripple, aura,
  dust, speed lines or shadows. The engine draws all of those (see MOVES_AND_VFX.md).

## Summary

`shared` = the ADR 0007 v2 `bodyHeight` every other fighter uses. **`gojo` = Gojo's own
`bodyHeight`** (about 1.09× the shared value, capped by the height ceiling; copy these into his
manifest rows). `ms` = default ms per frame from `art/manifest.json` `animationDefaults` (the manifest
is the source of truth; attack ms only matter for previews, because the engine time-stretches attacks
over the move phases). The four ADR 0009 rows at the end are **optional**; their `ms` are proposals.
**Core** = required before the game uses the custom sheet. **Eyes** = the Six Eyes show (blindfold
up).

| anim | frames | phases S/A/R | loop | shared | **gojo** | ms | core | eyes | prompt | tallest frame (what sets the height) |
|---|---|---|---|---|---|---|---|---|---|---|
| [idle](#idle) | 8 | | yes | 204 | **222** | 150 each | yes | | A01 | f2/f3 (breath top) |
| [run](#run) | 8 | | yes | 204 | **222** | 60 each | yes | | A02 | f3/f7 (flight, body highest) |
| [dash](#dash) | 2 | | yes | 160 | **174** | 60 each | yes | | A19 | either |
| [backDash](#backdash) | 3 | | | 207 | **225** | 60 60 80 | | | A24 | f2 (landing, legs extended) |
| [superDash](#superdash) | 2 | | yes | 120 | **140** | 50 each | | | A25 | either (angled 30° up, ~230 px wide) |
| [jumpSquat](#jumpsquat) | 1 | | | 162 | **176** | 70 | | | A26 | f0 |
| [jumpUp](#jumpup) | 2 | | yes | 198 | **215** | 80 each | yes | | A20 | f0 (hand at head height, below the hair top) |
| [jumpFall](#jumpfall) | 2 | | yes | 209 | **227** | 80 each | yes | | A21 | f0 (legs extended down) |
| [land](#land) | 2 | | | 174 | **189** | 50 70 | yes | | A22 | f1 (rising) |
| [light1](#light1) | 7 | 2/2/3 | | 204 | **222** | 30 30 40 50 50 50 30 | yes | | A03 | f0/f6 (stance) |
| [light2](#light2) | 7 | 2/2/3 | | 204 | **222** | 35 30 40 50 60 50 30 | yes | | A04 | f6 (stance) |
| [light3](#light3) | 7 | 2/2/3 | | 215 | **228** | 40 35 45 60 60 60 30 | yes | | A05 | f2 (straight, flat-footed supporting leg) |
| [light4](#light4) | 8 | 3/2/3 | | 207 | **225** | 50 45 35 40 70 70 70 40 | yes | | A06 | f3 (pivot, leg at shoulder height) |
| [heavy](#heavy) | 8 | 3/2/3 | | 218 | **228** | 40 35 30 50 70 70 60 30 | yes | | A07 | f3/f4 (rising elbow, never above the hair) |
| [airLight1](#airlight1) | 5 | 1/2/2 | | 198 | **215** | 45 35 50 50 30 | yes | | A08 | f0/f4 (air neutral) |
| [airLight2](#airlight2) | 5 | 1/2/2 | | 207 | **225** | 45 40 50 50 30 | | | A27 | f1 (leg extended) |
| [airLight3](#airlight3) | 6 | 2/2/2 | | 201 | **219** | 50 40 50 70 60 30 | | | A28 | f2 |
| [airHeavy](#airheavy) | 6 | 2/2/2 | | 198 | **215** | 50 45 45 70 70 40 | yes | | A09 | f1 (clasped hands behind the head, at hair height) |
| [guard](#guard) | 2 | | yes | 198 | **215** | 300 each | yes | | A10 | f0 |
| [block](#block) | 2 | | | 204 | **222** | 60 80 | | | A29 | f1 (settling) |
| [hurtHigh](#hurthigh) | 3 | | | 195 | **212** | 70 90 100 | yes | | A11 | f2 |
| [hurtLow](#hurtlow) | 3 | | | 183 | **199** | 70 90 100 | | | A30 | f2 |
| [launched](#launched) | 2 | | yes | 136 | **148** | 70 each | yes | | A12 | either (arched diagonal body) |
| [spin](#spin) | 4 | | yes | 160 | **174** | 60 each | | | A31 | f0 |
| [airRecover](#airrecover) | 3 | | | 180 | **196** | 50 50 60 | | | A32 | f2 (unfolding) |
| [down](#down) | 2 | | | 96 | **104** | 80 420 | yes | | A13 | f0 (knees up) |
| [getup](#getup) | 5 | | | 204 | **222** | 70 60 60 80 70 | yes | | A14 | f4 (stance) |
| [charge](#charge) | 4 | | yes | 198 | **215** | 50 each | yes | | A15 | any |
| [throw](#throw) (air Red) | 4 | 1/1/2 | | 201 | **219** | 50 60 70 50 | | | A33 | f0 (upright wind-up) |
| [beamCharge](#beamcharge) | 3 | | yes | 198 | **215** | 50 each | yes | | A16 | any |
| [beamFire](#beamfire) | 3 | | yes | 198 | **215** | 50 each | yes | | A17 | any |
| [vanish](#vanish) | 2 | | | 221 | **232** | 50 each | | | A34 | f1 (on the toes, stretched thinner) |
| [stagger](#stagger) | 4 | | yes | 207 | **225** | 150 each | | | A35 | f1/f3 (upright) |
| [ko](#ko) | 1 | | | 64 | **70** | 500 | | | A36 | f0 |
| [special](#special) (Lapse: Blue) | 8 | 3/3/2 | | 204 | **222** | 120 120 120 120 120 160 110 70 | yes | | A18 | f0/f7 (stance) |
| [intro](#intro) | 4 | | yes | 210 | **228** | 150 each | | | A37 | any (upright) |
| [taunt](#taunt) | 2 | | yes | 212 | **228** | 250 each | | | A38 | any (leaning in) |
| [win](#win) | 4 | | yes | 212 | **230** | 200 each | yes | | A23 | any (upright; hand at cheek height) |
| [specialForward](#specialforward) (Reversal: Red) | 7 | 2/2/3 | | (optional) | **222** | 50 50 60 90 80 70 50 | | | A39 | f0/f6 (stance) |
| [specialUp](#specialup) (Blink) | 6 | 2/2/2 | | (optional) | **232** | 50 50 40 40 60 80 | | | A40 | f2 (on the toes, stretched thinner) |
| [specialDown](#specialdown) (Infinity) | 4 | 2/1/1 | | (optional) | **222** | 60 60 300 80 | | | A41 | any (calm stance) |
| [superPose](#superpose) (Unlimited Void) | 4 | | yes | (optional) | **230** | 160 each | | **yes** | A42 | any (upright) |

42 animations, 175 frames: **11 rows** of the 16-column sheet (4096 × 2816 px; the shared 38 are 154
frames = 10 rows). The 23 core animations are 108 frames. Every `gojo` value keeps the hair top at or
below y 8 (232 is the tallest), so every pose fits the y 4 margin.

For the manifest, the four optional rows (frames, loop, phases, `bodyHeight`, `ms`) are:
`specialForward` 7, no loop, `[2, 2, 3]`, 222, `[50, 50, 60, 90, 80, 70, 50]` ·
`specialUp` 6, no loop, `[2, 2, 2]`, 232, `[50, 50, 40, 40, 60, 80]` ·
`specialDown` 4, no loop, `[2, 1, 1]`, 222, `[60, 60, 300, 80]` ·
`superPose` 4, loop, no phases, 230, `[160, 160, 160, 160]`. All four `required: false`, step 9 (after
A38) unless the manifest's own step for them says otherwise.

---

## Movement

<a id="idle"></a>

### idle: 8 frames, loop

Relaxed fighting stance, **both hands in his pockets**, slow breathing. **Feet are identical in all 8
frames** (no foot sliding). This strip becomes `reference/idle_approved.png`, the pose and proportion
anchor for every later strip.

Base pose: L foot forward with the toes to screen-right (toes at x ~174), R foot back and turned out
45° (heel at x ~84), feet about shoulder-width, knees bent about 20°, weight mostly on the R (back)
leg, hips slightly cocked. Torso turned 35° to the camera with a **lazy slouch**: shoulders loose and
a little rounded, head forward and tilted a touch down, as if looking down at a shorter opponent.
**Both hands in the trouser pockets** under the jacket hem, elbows hanging loosely out from his sides
(R elbow ~x 102, y 122; L elbow ~x 152, y 120). Lazy smile. The white hair crown stands up above the
black blindfold band.

- **f0**: base pose, neutral height. Face: lazy smile.
- **f1**: inhale, chest and shoulders up 1 px. Hair tips lag (no change yet).
- **f2**: top of the breath, up about 2 px. Hair tips lift 1 px.
- **f3**: hold the top. The jacket hem drifts 1 px.
- **f4**: exhale, back to +1 px.
- **f5**: neutral height (same as f0).
- **f6**: low point. Knees bend 1 to 2 px more, shoulders drop 1 to 2 px, the head bobs 1 px. Hair tips
  settle, hem settles 1 px.
- **f7**: back up toward f0 (a clean loop into f0).

QA: hair top y ~18, skull top ~36, chin ~67 (head ~31 px), soles 240 (trimmed height 222). The lead
(L) knee and toes are the idle front edge (x ~174 to 178); nothing in idle reaches past ~x 180,
because the packer finds strike hitboxes from whatever reaches past idle's right edge minus 9 px
(about x 167 to 171). Elbows stay at the sides, never forward.

<a id="run"></a>

### run: 8 frames, loop

A fast athletic run in the selected K direction (not a ninja run). Torso leans about 35° forward,
head up, chin level, lazy smile. The far/left hand stays in the pocket throughout; the near/right arm
pumps bent about 90° opposite the near/right leg. Keep both legs visibly distinct as they alternate.
Hair tips and jacket hem stream back to screen-left with a small alternating flutter; trouser legs
ripple.

**As drawn in v14 (candidate, 2026-10-15):** Part A (f0-f3, L leg forward) is used for both halves: the generator
would not swap the lead leg, and v13's Part B lost the near arm in f6. The near fist stays forward in every frame (a
held-fist look). The sidecar frameOffsets hold the head at x 166 (the foot-centre anchor slides this pose ~76 px)
and lift the flight frames f3/f7 28 px. A redraw that follows the list below still replaces it.

- **f0**: contact. L leg reaches forward; near R arm is forward. R leg trails, toes pushing off.
- **f1**: down. Weight on the L leg, knee bent deepest, body at its lowest; R heel lifts behind.
- **f2**: passing. L leg passes under the hips as the R knee swings forward; body rises.
- **f3**: flight. Both feet are off the floor; R knee is forward and up, L leg extends back.
- **f4**: mirrored contact. R leg reaches forward; near R arm is back. L leg trails, toes push off.
- **f5**: mirrored down. Weight on the R leg, lowest body position; L heel lifts behind.
- **f6**: mirrored passing. R leg passes under the hips as the L knee swings forward.
- **f7**: mirrored flight. L knee is forward and up, R leg extends back; loop into f0.

QA: with his long legs the flight stride is about 165 px wide; keep it inside x 4..251.

<a id="dash"></a>

### dash: 2 frames, loop

Two-frame low burst-lunge toward screen-right. Keep the far/left hand in his pocket and the near/right
arm pumping. Torso leans about 35° forward except for the action compression; head and shoulders stay
low while the lead knee drives under the chest and the rear leg extends behind. Chin up, lazy smile.
No aura, trail, smear effect or speed lines. Candidate v09 passed the strict scale gate and is packed
for review; it remains unapproved.

- **f0**: lowest burst-lunge, far hand pocketed, near arm pumping back, rear leg extended.
- **f1**: second lunge phase with the lead knee driven forward and near arm pumping; keep both legs
  identifiable and the whole pose inside the cell.

<a id="backdash"></a>

### backDash: 3 frames

Three-frame hop backward toward screen-left while still facing right in 3/4 view. Keep the far/left
hand pocketed; the near/right arm balances the hop. Candidate v06 is held after the third attempt
failed the strict scale gate; no active backDash candidate is available for review.

- **f0**: push-off, knees bent, facing right; far hand remains pocketed, near arm balances the hop.
- **f1**: airborne with both feet off the floor and knees tucked; torso leans back for the hop.
- **f2**: land on the back foot, front foot about to touch; knees absorb and the far hand stays pocketed.

<a id="superdash"></a>

### superDash: 2 frames, loop

Two-frame K flight toward screen-right, stretched thinner than tall, with the whole projected pose
about 230 px wide by 140 px tall. Keep the far/left hand in the pocket; sweep the near/right arm back
along the body instead of leading with an open palm. Drive the lead knee forward while the rear leg
extends back, keeping both legs distinct. Head stays up with the blindfold and lazy smile; no aura or
trail. All three calls are exhausted and no candidate passed the required silhouette target; v10 and
v11 remain held in raw/_qa_hold, and call 3 was not saved as a version.

- **f0**: as described. Hair crown flattened back, jacket hem streaming straight back.
- **f1**: knees bent 4 px more and 2 px apart, hem in an alternate flutter.

QA: after packing the palm stays inside x 251 and the trailing feet inside x 4. If it does not fit,
bend the R elbow slightly rather than shrinking the body. If the shape shifts sideways, the lowest
point is not near its middle (Conventions, Centering).

<a id="jumpsquat"></a>

### jumpSquat: 1 frame

- **f0**: deep crouch right before takeoff. Knees bent about 80°, L foot forward, torso leaning
  forward about 18°. **R arm swung down and back**, hand open; **L hand in his pocket**. Head up,
  looking forward and up. Hair crown squashed 1 to 2 px, jacket hem pooled over the thighs. Face:
  smile.

<a id="jumpup"></a>

### jumpUp: 2 frames, loop

Rising.

- **f0**: knees tucked high (L knee near the chest, R knee a little lower), torso upright. **R arm
  raised up and forward**, open hand at about **head height** in front of the face (never above the
  top of his hair). **L hand in his pocket.** Head tilted slightly up. Hair tips and the jacket hem
  **dragged downward** by the upward motion. Face: smile.
- **f1**: knees 2 px lower, R arm 2 px lower, hem in an alternate flutter.

<a id="jumpfall"></a>

### jumpFall: 2 frames, loop

Falling. (The engine also plays it right after **Blink** reappears above the opponent.)

- **f0**: legs extending down, L leg slightly forward and slightly bent, R leg slightly back and
  slightly bent, toes pointed down (the tallest frame, 227). **R arm out forward for balance** (about
  60° up, open hand below head height), **L hand in his pocket**. Hair tips lifted, jacket hem lifted
  4 to 6 px and flared. Face: smile, head tilted down toward the opponent.
- **f1**: R arm 2 px higher, hair tips and hem in an alternate flutter.

<a id="land"></a>

### land: 2 frames

- **f0**: impact crouch (squash). Knees deeply bent, torso leaning forward about 20°, R arm out
  forward and down for balance, L hand in his pocket. Hair crown squashed 1 to 2 px, hem pools over
  the thighs. Face: smile.
- **f1**: rising halfway back to the stance (the tallest frame, 189). R hand drifting back toward the
  pocket.

---

## Ground normals (auto combo: light ×4)

<a id="light1"></a>

### light1: lead palm jab with the L hand · 7 frames · phases 2/2/3

**The R hand stays in its pocket for the whole jab.**

- **f0 · S**: anticipation. The L hand slides out of the pocket, flattening into an open palm, and
  pulls back to the chest. Shoulders turn slightly away. Face: focused.
- **f1 · S**: the L palm launches, elbow half extended (palm at x ~190). Shoulders rotate forward.
- **f2 · A · smear**: L arm **fully extended horizontally** at the opponent's face height (his own
  chin-to-collar height): open palm, **fingers up, heel of the palm leading**, **palm in x 206 to 226,
  y 64 to 86** (HIGH). **No step-in**: his weight stays back over the R leg and the torso leans back
  a touch; the long arm does the work. Solid tapered smear behind the palm from about x 168, in sleeve
  navy and skin colors. Face: focused, a faint smile.
- **f3 · A**: same extension without the smear, palm 1 to 2 px further (impact settle). Hair tips flick
  forward 1 px; the sleeve ripples.
- **f4 · R**: palm retracting halfway (x ~194), elbow bending.
- **f5 · R**: L hand back at the hip, sliding toward the pocket.
- **f6 · R**: idle stance, both hands in the pockets (matches idle f0).

<a id="light2"></a>

### light2: rear palm strike with the R (near) hand · 7 frames · phases 2/2/3

- **f0 · S**: hips coil. Torso twists back toward the camera. Both hands out of the pockets: the R
  palm cocked back beside the R shoulder, the L hand open in front of the chest. Weight on the R leg.
- **f1 · S**: hips and shoulders rotate forward, R palm driving forward past the chin (x ~166).
- **f2 · A · smear**: R arm **fully extended horizontally** at the opponent's chin height: **palm
  heel forward, fingers up**, **palm in x 214 to 236, y 70 to 92** (HIGH), crossing in front of his
  body (fully visible, near side). Torso rotated almost to profile. R heel lifted, pivoting on the ball
  of the foot. L hand open in front of the chest. Solid smear trailing behind the R palm. Face:
  focused, a thin grin.
- **f3 · A**: hold without the smear, palm 1 to 2 px further.
- **f4 · R**: R palm retracting, torso unwinding.
- **f5 · R**: R hand back at the hip, the L hand dropping toward its pocket.
- **f6 · R**: idle stance, both hands in the pockets.

<a id="light3"></a>

### light3: front push kick to the stomach with the R (near) leg · 7 frames · phases 2/2/3

**Both hands stay in his pockets for the whole kick** (he doesn't need them).

- **f0 · S**: weight shifts onto the L (front) leg. R knee starts to lift; the jacket's side slit
  opens around the thigh. Face: focused.
- **f1 · S**: R knee chambered high (thigh horizontal, knee at about x 178, y 140, shin hanging down).
  Torso leans back slightly.
- **f2 · A · smear**: R leg **fully extended straight forward** at the opponent's stomach height (his
  own hip height): **sole and heel (a push kick) in x 222 to 246, y 122 to 148** (LOW), toes pulled
  back. Torso leans back about 12°. **Supporting L leg straight, flat-footed (heel down)**: he does
  not rise onto his toes (the tallest frame, 228). Hands in the pockets. The jacket hem stays behind
  the knee. Solid smear arc from the chamber to the foot, in trouser navy and shoe black. Face: focused
  smile.
- **f3 · A**: hold without the smear, foot 1 to 2 px further.
- **f4 · R**: knee re-chambers (shin folds back).
- **f5 · R**: R foot sets down behind him.
- **f6 · R**: idle stance.

<a id="light4"></a>

### light4: spinning roundhouse finisher (wall bounce) · 8 frames · phases 3/2/3

Also used by the **vanish kick** after a teleport.

- **f0 · S**: wind-up. Hands out of the pockets, torso twists toward the camera, arms coil in, knees
  bend. Face: grin.
- **f1 · S**: spin starts, pivoting on the L foot. Body turns so his **back faces the camera**: the back
  of the tall collar, the jacket back and the blindfold's wrap at the back of his head show. R leg
  lifting. Head turns to spot the target over his shoulder.
- **f2 · S**: back to the camera, side-on. R knee chambered high and turned over (hip rolled). Head
  spotting the target at screen-right. Jacket hem flaring outward with the spin.
- **f3 · A · smear**: R leg **fully extended high and horizontal**, the instep and shin striking at
  the opponent's head height (about **his own shoulder height**): **foot in x 224 to 248, y 56 to 88**
  (HIGH). He barely needs to lean: torso back about 15°, pivoting on the flat L foot (no tiptoe), arms
  flung out below head height. Big solid crescent smear from behind and below up to the foot. Face:
  grin with teeth.
- **f4 · A**: hold without the smear. Hair tips and jacket hem whip forward.
- **f5 · R**: leg dropping, rotation follows through.
- **f6 · R**: R foot sets down, regaining the stance.
- **f7 · R**: idle stance, hands back in the pockets.

<a id="heavy"></a>

### heavy: rising elbow launcher with the R (near) elbow · 8 frames · phases 3/2/3

The engine adds a small hop. The elbow path must pass **through the opponent's chin space in front of
him**, not straight up beside his own head. Gojo's launcher is a **rising elbow** (not an uppercut):
the forearm stays folded, so nothing rises above his hair.

- **f0 · S**: crouch starts. Hands out of the pockets. Knees bend, torso leans forward about 15°, the
  R arm folds tight (fist closed at the R collarbone), elbow pointing down.
- **f1 · S**: deepest crouch (squash). R elbow low in front of the stomach, forearm folded up, L hand
  open forward guarding. Head down over the target. Jacket hem pooled over the thighs.
- **f2 · S**: legs explode upward. The R elbow starts rising in front of the stomach and chest.
- **f3 · A · smear**: rising, heels off, **knees still bent about 20°** (keeps the frame under the
  ceiling). The R elbow drives **up and forward** through the opponent's chin height in front of him:
  **elbow tip in x 180 to 208, y 58 to 86** (HIGH). R fist beside his R ear (forearm folded). Torso
  leans back about 10°, L arm pulled down to his side. Solid crescent smear along the elbow's path.
  Face: grin with teeth.
- **f4 · A**: peak, fully airborne, knees bent and feet hanging with pointed toes. The **R elbow points
  straight up in front of his face**: **elbow tip at x 160 to 188, y 22 to 46**, its top level with his
  hair top and **never above it** (the tallest frame, 228). Hair tips dragged down, jacket hem lifted.
- **f5 · R**: descending, the arm unfolding down, knees bending.
- **f6 · R**: landing crouch.
- **f7 · R**: idle stance, hands back in the pockets.

---

## Air normals

**Air neutral** (start and end pose of every air attack): torso upright with a slight forward lean,
**both hands open in a loose guard at chest height**; L knee bent forward and up, **R leg hanging down
almost straight with the toes pointed** (the lowest point of the pose, roughly where a standing foot
would be, so his chest stays at about y 85 to 115 after packing). Hair tips and the jacket hem lifted
slightly. Face: focused.

<a id="airlight1"></a>

### airLight1: mid-air palm jab with the L hand · 5 frames · phases 1/2/2

- **f0 · S**: air neutral, the L palm pulled back to the chest, shoulders coiled.
- **f1 · A · smear**: L arm **fully extended horizontally** at his own lower-chest height: **palm heel
  in x 206 to 230, y 100 to 120** (MID), fingers up. Torso leans forward 10°. Smear trailing the palm.
- **f2 · A**: hold without the smear.
- **f3 · R**: retracting.
- **f4 · R**: air neutral.

<a id="airlight2"></a>

### airLight2: mid-air front kick with the R leg · 5 frames · phases 1/2/2

- **f0 · S**: R knee chambered up to the chest.
- **f1 · A · smear**: R leg extends **straight forward**, angled slightly down, at his own hip height:
  **foot in x 220 to 246, y 130 to 155** (LOW). Torso leans back about 12°, R arm out behind for
  balance, the L leg hangs as the lowest point. Smear arc to the foot. Face: focused.
- **f2 · A**: hold without the smear.
- **f3 · R**: knee re-chambers.
- **f4 · R**: air neutral.

<a id="airlight3"></a>

### airLight3: mid-air spinning heel kick that knocks away (wall bounce) · 6 frames · phases 2/2/2

- **f0 · S**: body twists away (back toward the camera: the collar back and the blindfold's wrap
  visible), L knee chambered.
- **f1 · S**: spinning. Hips turn over, head spots the target at screen-right, jacket hem flaring.
- **f2 · A · smear**: L leg **fully extended forward**, heel leading, at his own waist height: **heel
  in x 222 to 248, y 105 to 150** (MID). Body leans back about 15°, R knee tucked, arms flung (R back,
  L forward, below head height). Big crescent smear. Face: grin.
- **f3 · A**: hold without the smear.
- **f4 · R**: leg folding back in.
- **f5 · R**: air neutral.

<a id="airheavy"></a>

### airHeavy: two-handed hammer spike (ground bounce) · 6 frames · phases 2/2/2

- **f0 · S**: both hands clasped together (fingers interlocked) raised **behind his head**, elbows
  bent up and back; torso arching back, knees tucked. Face: grin.
- **f1 · S**: peak of the wind-up. Arched further, the clasped hands behind his head **at the height
  of his hair top, never above it** (the tallest frame, 215).
- **f2 · A · smear**: torso whips forward about 40°. Both arms swing **down and forward**, straight,
  clasped hands in front of and below his chest: **hands in x 180 to 218, y 160 to 206**, smashing
  down onto the opponent. Knees bent, the feet hanging below the hands (the lowest point). Large
  vertical crescent smear from overhead to the hands.
- **f3 · A**: hold without the smear, hands 2 px lower. Hair tips whip down.
- **f4 · R**: arms rising, body uncurling.
- **f5 · R**: air neutral.

---

## Defense and reactions

<a id="guard"></a>

### guard: 2 frames, loop

A casual high block: **both forearms raised in front of his face and upper chest, crossed at the
wrists, hands open with the palms out**, fingers loose, elbows down. Chin tucked, body leaning back
slightly, knees bent more than in idle, weight back, L foot forward. Face: focused, unbothered.

- **f0**: as described (the tallest frame, 215).
- **f1**: 1 px lower (breath). Hair tips sway 1 px.

<a id="block"></a>

### block: 2 frames

(With his Infinity passive he takes no chip damage, but the block still reads as a block.)

- **f0**: pushed back by a blocked hit. Whole body leans back about 6° and has slid back (R heel
  digging in). Arms still crossed but jarred upward. Mouth tight, teeth showing (annoyed). Hair tips
  and the jacket hem blown back (screen-left).
- **f1**: settling back into the guard, knees a little straighter than guard f0 (the tallest frame,
  222).

<a id="hurthigh"></a>

### hurtHigh: hit in the face · 3 frames

f0 is the peak of the reaction, and it eases back over f1 and f2. The blindfold stays on.

- **f0**: head snapped back (chin up). Torso arched back about 20°, both arms flung back and out,
  hands open. One foot slipping. Teeth gritted, mouth twisted. Hair tips and the jacket hem whip
  **forward**, the crown jolts.
- **f1**: about 30 % recovered. Head coming down, arms swinging back in.
- **f2**: mostly recovered (the tallest frame, 212), still wincing, arms returning toward guard.

<a id="hurtlow"></a>

### hurtLow: hit in the stomach · 3 frames

- **f0**: doubled over. Torso bent forward about 40°, head down, both arms clutching the stomach,
  knees bent. Mouth open, teeth gritted. Hair crown swings forward and down.
- **f1**: about 30 % recovered.
- **f2**: rising (the tallest frame, 199), wincing, one hand still on the stomach.

<a id="launched"></a>

### launched: knocked flying backward · 2 frames, loop

Facing right, flying toward screen-left. **Arched diagonally, not fully horizontal.** The body is tilted
about 60° back from upright and arched like a drawn bow with the belly up: the **hips are the lowest
point, near the middle of the shape**, the head and shoulders rise to the upper-left, the legs bend and
trail forward to the right at about hip height or a little higher. Arms flung up and back, **bent at
the elbows** (his arms are long: fully stretched they would leave the cell on the left). Mouth open in
pain. Hair tips and the jacket hem whip forward (screen-right). About 148 px tall and 195 to 205 px
wide.

- **f0**: as described.
- **f1**: limbs in alternate positions (arms about 6° apart, the leg bend swapped).

QA: the hair and hands stay inside x 4.

<a id="spin"></a>

### spin: tumbling head over heels · 4 frames, loop

One full **backward** rotation, **counter-clockwise on screen** (head goes left, down, right, up).
Balled up: knees to the chest, arms bent in. Teeth gritted. Hair tips and the jacket hem trail opposite
to the rotation.

- **f0**: tilted back 30° (head up-left), the tallest frame (174).
- **f1**: 120° (head pointing down-left).
- **f2**: 210° (upside down, head at the bottom).
- **f3**: 300° (head at the right, coming back around).

<a id="airrecover"></a>

### airRecover: mid-air backflip recovery · 3 frames

Backward flip, counter-clockwise on screen.

- **f0**: tucked, tilted back 60°, knees to the chest. Mouth flat, regaining control.
- **f1**: upside down (about 200°), fully tucked.
- **f2**: almost upright (about 340°), unfolding: legs extending down, arms out, lazy smile (the tallest
  frame, 196).

<a id="down"></a>

### down: slammed into the floor · 2 frames

**Lying flat with the head toward screen-left** (about 224 px long; he is long, so one knee stays a
little bent).

**Lying rule ([ADR 0020](../../../docs/decisions/0020-lying-pose-ground-contact.md), [SPEC.md](../../SPEC.md#lying-poses)):** seen **side-on** from the 12 degree spec camera, never from above: the back of the head, the back, the hips, the backs of the legs and the heels rest on the floor line (y 240), the far limbs at most about 8 px higher. The packer's ground check must report nothing for f1.

- **f0** (short): his back slams flat onto the floor from the shoulders to the hips (the whole back is
  the lowest part, so the pose stays centered); knees bent and lifted toward the upper-right by the
  bounce, arms flung out to the sides. Mouth open. Hair crown splashes out to the left. The tallest
  frame (104), about 200 px wide.
- **f1** (long hold): lying flat on his back, seen side-on (head, back, hips and heels on the floor line), arms
  out along the floor at his sides (never stretched above the head), one knee slightly bent. Grimacing. The
  blindfold still on, the jacket hem splayed.

QA: the hair stays inside x 4 and the shoes inside x 251.

<a id="ko"></a>

### ko: 1 frame

**Lying rule ([ADR 0020](../../../docs/decisions/0020-lying-pose-ground-contact.md), [SPEC.md](../../SPEC.md#lying-poses)):** seen **side-on** from the 12 degree spec camera, never from above: the back of the head, the back, the hips, the backs of the legs and the heels rest on the floor line (y 240), the far limbs at most about 8 px higher. The packer's ground check must report nothing for f0.

- **f0**: **lying flat on his back, head toward screen-left, seen side-on** (about 226 px long, 70 px
  tall), completely limp, arms loose along the floor at his sides, one knee only slightly bent (a high knee
  would make the frame taller than 70). Mouth slightly open, slack. The blindfold still on, hair spread on the floor,
  jacket hem splayed.

<a id="getup"></a>

### getup: kip-up to standing · 5 frames

- **f0**: lying on his back (head toward screen-left), knees pulled to the chest, palms planted beside
  his head (fingers toward the shoulders). Mouth flat.
- **f1**: legs kick up and over toward the upper-right, back rolling onto the shoulders, hands pushing
  off.
- **f2**: springing up, airborne, torso tilted back about 40°, legs folding under him, arms out.
- **f3**: landing crouch (squash), hands going toward the pockets.
- **f4**: idle stance with both hands in the pockets and a lazy smile (the tallest frame, 222).

<a id="stagger"></a>

### stagger: dizzy (guard crush) · 4 frames, loop

Standing almost upright on wobbly knees, arms hanging loose (out of the pockets), head lolling, mouth
slack and slightly open, the hair crown tilted.

- **f0**: torso and head lean toward screen-right about 8°.
- **f1**: centered, upright (tallest, 225).
- **f2**: lean toward screen-left about 8°.
- **f3**: centered.

---

## Ki, kit specials and ultimate

<a id="charge"></a>

### charge: powering up (hold Special) · 4 frames, loop

A **calm** power-up (no shouting). Wide stance (feet well apart, knees bent), torso upright, arms held
slightly out from his sides and down, **palms open facing the floor, fingers spread**, head tilted
slightly back, lazy smile. Hair tips and the jacket hem **blown upward** by the aura wind, sleeves
fluttering. The engine draws the aura and light streaks. (Also the engine fallback for
`specialDown`.)

- **f0**: as described, shifted 1 px left.
- **f1**: shifted 1 px right, hair tips in a new flicker shape.
- **f2**: 1 px left, palms 1 px higher.
- **f3**: 1 px right, hem flicker variant. Loops.

<a id="throw"></a>

### throw: REVERSAL: RED in the air · 4 frames · phases 1/1/2

Performed **in mid-air** (kit move `redAir`). The engine spawns the red orb at the start of f1, 0.5
units forward and 0.9 up: **(192, 125)** in the cell (ADR 0007, shared by every projectile). Gojo's
release point is his **R fingertips**: target about **(196, 124)**, inside the ADR release zone x 186
to 212, y 116 to 142. **Do not draw the orb.** L hand in his pocket throughout.

- **f0 · S**: air-neutral legs, torso upright leaning back slightly (the tallest frame, 219). R hand
  raised to his chest, **index finger up and the middle finger cocked against the thumb** (a flick
  about to snap). Face: focused.
- **f1 · A**: FLICK. The R arm snaps forward and slightly down toward screen-right, elbow slightly
  bent, index finger pointing at the target and the middle finger flicked forward off the thumb:
  **fingertips at about (196, 124)**. Torso leans forward about 15°, legs trailing back and down. Mouth
  open (naming the technique). Optional smear: a short solid streak along the R hand's path.
- **f2 · R**: recoil. The R arm kicks up and back about 25° (hand open, below head height), body
  drifting back, hair tips and hem blown back (screen-left).
- **f3 · R**: air neutral, R hand lowering, mouth closed, smile.

<a id="beamcharge"></a>

### beamCharge: HOLLOW PURPLE charge · 3 frames, loop

Wide, grounded stance (L foot forward, knees bent), torso upright, chest open to the camera. **Both
arms held out apart at chest height, elbows slightly bent, palms up, fingers slightly curled as if
each hand holds an orb**: the **L (far) hand forward-right at about (204, 104)** (blue), the **R
(near) hand back-left at about (54, 104)** (red). Hands open and **empty**. Head turned toward the
opponent, focused calm mouth. Hair tips and the jacket hem blown upward by the energy wind, sleeves
fluttering. No orbs, no beam in the sprite.

- **f0**: as described.
- **f1**: tremble 1 px, both hands 1 px closer together, hair tips flicker variant.
- **f2**: tremble 1 px back, fingers flex 1 px. Loops.

QA: the R hand stays inside x 4 (bend the R elbow more if needed); both hands at the same height.

<a id="beamfire"></a>

### beamFire: HOLLOW PURPLE fire · 3 frames, loop

The engine starts the beam 0.8 units forward and 0.92 up: **(230, 122)** (ADR 0007), so the **heel of
the R palm must reach x 222 to 238 at y 112 to 132**.

Deep lunge toward screen-right: L leg forward and bent, R leg straight back, torso leaning forward about
14°. **R (near) arm thrust straight forward as an open palm** (fingers up, palm facing right) at his
own stomach height, aimed at the shorter opponent's chest. **L hand pulled back to his L hip**, open.
Head behind the R shoulder, mouth open (naming the technique). Hair tips, jacket hem and sleeves blown
**back** (screen-left) by the recoil. No beam in the sprite.

- **f0**: as described.
- **f1**: recoil, whole body 1 to 2 px back, hair tips flicker variant.
- **f2**: pushing forward again, 1 px forward. Loops.

<a id="vanish"></a>

### vanish: teleport · 2 frames

(The engine also uses it for **Blink** today; MOVES_AND_VFX.md §3.)

- **f0**: quick crouch (squash about 10 %). Torso leans 20° forward, **both hands in his pockets**.
  Face: focused.
- **f1**: stretched blur. Body stretched **thinner, not taller**: up on the balls of his feet with the
  knees still slightly bent (the tallest frame, 232; the hair top no higher than y 8), hands in his
  pockets, hair tips and hem streaming up. The lower half breaks into 3 or 4 **solid horizontal
  slices** offset sideways by 3 to 9 px (the anime high-speed afterimage). Solid shapes in his own
  colors, no transparency, no blur.

<a id="special"></a>

### special: LAPSE: BLUE · 8 frames · phases 3/3/2

Kit move `blue` (kind `pull`). **No melee hit:** the engine opens a blue gravity vortex **2.6 units in
front of him** (far outside the cell) at the start of the active phase, drags the opponent in, ticks
damage and pops them up. Gojo only points at it. Engine timing: startup 12 game frames (f0 to f2),
active **2 game frames** (f3 to f5 flash by), recovery 18 game frames (f6 and f7, on screen while the
vortex pulls). So **f6 carries the look** of the move. **L hand in his pocket** throughout. **Draw no
blue anywhere.**

- **f0 · S**: the R hand slides out of the pocket and rises to the chest; weight settles back. Face:
  lazy smile.
- **f1 · S**: R arm extending forward, **index and middle fingers extended together** (the other
  fingers curled, thumb tucked): the two-finger sign. Face: focused.
- **f2 · S**: R arm fully extended forward at his chest height, elbow almost straight, the two
  fingertips pointing at the target at about **x 212 to 222, y 100 to 110**.
- **f3 · A**: release: the wrist snaps a quarter-turn (palm up), fingers still pointing; the vortex
  opens. Hair tips and jacket hem pulled 1 to 2 px **forward** (screen-right), toward the vortex.
- **f4 · A**: hold, fingers 1 px crooked.
- **f5 · A**: hold, the arm 2 px back.
- **f6 · R**: **the held pose while the vortex pulls**: arm still forward, palm up, the two fingers
  crooked in a slight "come here" curl, hair tips and hem pulled 1 to 2 px forward. Face: lazy smile.
- **f7 · R**: arm lowering, the hand on its way back to the pocket (close to idle).

QA: the fingertips are not a hitbox (MOVES_AND_VFX.md §5). The two-finger sign must read clearly: two
straight fingers, not a fist, not an open hand.

---

## Kit specials (ADR 0009, optional)

These four names are optional: a missing one falls back (`specialForward` → `special`, `specialUp` →
`special`, `specialDown` → `charge`, `superPose` → `taunt`). For Gojo they are his identity, so they
are briefed in full.

<a id="specialforward"></a>

### specialForward: REVERSAL: RED (ground) · 7 frames · phases 2/2/3

Kit move `red` (kind `shot`, projectile `red`). Engine timing: startup 14 game frames (f0, f1), active
3 (f2, f3), recovery 22 (f4 to f6). The red orb spawns at the start of f2 at the shared projectile
point **(192, 125)**: put the R fingertips at about **(196, 124)** on f2 (x 188 to 206, y 116 to 132).
**No melee hit; draw no orb.** **L hand in his pocket** throughout.

- **f0 · S**: weight shifts back onto the R leg. The R hand comes out of the pocket and rises to the
  chest, **index finger up, the middle finger cocked against the thumb**. Face: focused.
- **f1 · S**: R arm extends toward the target at chest height, **elbow slightly bent**, the index
  finger pointing at the opponent's chest and the middle finger still cocked (a finger-gun).
- **f2 · A**: FLICK. The middle finger snaps forward off the thumb; index and middle fingers point at
  the target, **fingertips at about (196, 124)**. A tiny solid flick arc at the fingertips is allowed.
  Face: declaration (mouth open, naming the technique).
- **f3 · A**: RECOIL. The blast kicks the R arm **up and back** about 25° (hand open, fingers spread,
  at about face height, never above the hair), torso leans back about 8°, the R (back) foot slides back
  a few px. Hair tips and the jacket hem blown back (screen-left). Face: smile returning.
- **f4 · R**: recoil settles, the arm lowering.
- **f5 · R**: R hand dropping toward the pocket.
- **f6 · R**: idle stance, both hands in the pockets (the tallest frames are f0 and f6, 222).

<a id="specialup"></a>

### specialUp: BLINK · 6 frames · phases 2/2/2

Kit move `blink` (kind `teleport`, to `above`): he vanishes and reappears above the opponent, then falls
(`jumpFall`). Brief per the user's design: **a teleport pose that reuses the `vanish` timing**. Engine
status: `kit.js` currently plays `vanish` (hidden from the first frame) for every teleport, so this
strip shows up only after Claude points the teleport kind at it (MOVES_AND_VFX.md §3). **L hand in his
pocket** throughout. No hit.

- **f0 · S**: knees dip. The R hand comes up in front of his chin, **index and middle fingers raised
  together** (a casual one-hand sign). Face: lazy smile.
- **f1 · S**: crouch deeper (squash about 8 %), torso leaning forward 15°, the sign held at the chin.
  Face: focused.
- **f2 · A**: stretched blur (like `vanish` f1): stretched **thinner, not taller**, up on the balls of
  his feet with the knees still slightly bent (the tallest frame, 232). The lower half breaks into 3 or
  4 solid horizontal slices offset sideways by 3 to 9 px; hair tips and hem streaming up.
- **f3 · A**: almost gone: the slices spread wider apart (6 to 14 px) and the whole silhouette thins
  further, but it is **still a full-size body shape** (never an empty or tiny frame: the packer
  measures every frame).
- **f4 · R**: REAPPEAR in mid-air above the opponent: airborne, knees bent, the jacket hem flared up,
  head tilted **down** toward screen-right (looking down at the opponent below him), R hand open at the
  chest. Face: lazy smile.
- **f5 · R**: air-ready pose: the same, hem settling, the R hand drawn back slightly, ready to flow into
  `jumpFall` (or a follow-up attack).

QA: in f4 and f5 the lowest point is the hanging foot (the packer drops it to y 240).

<a id="specialdown"></a>

### specialDown: INFINITY · 4 frames · phases 2/1/1

Kit move `infinity` (kind `counter`). Engine timing: startup 3 game frames (f0, f1), the counter
window 23 game frames (**f2 is held the whole time**), recovery 14 (f3). The engine draws a pale ring
around his body; melee attackers freeze and projectiles stop. **No hit. No effects in the sprite.**
**L hand in his pocket** throughout.

- **f0 · S**: the R hand slides out of the pocket; weight settles back onto the R leg. Face: lazy
  smile.
- **f1 · S**: the **R (near) arm raised forward across his body, open palm facing the opponent**
  (screen-right) at chest-to-face height, fingers relaxed and slightly spread, elbow slightly bent:
  **palm center at about (200, 90)**. Head tilted slightly up.
- **f2 · A**: **the held counter stance**: identical to f1, perfectly still, hair tips settled.
  Absolutely calm. Face: lazy smile.
- **f3 · R**: the palm lowering, the hand returning to its pocket.

QA: the raised palm stays below his hair top; f2 is on screen for about 0.4 s, so it must be the
cleanest frame of the strip.

<a id="superpose"></a>

### superPose: DOMAIN EXPANSION: UNLIMITED VOID · 4 frames, loop · Six Eyes

The SUPER's pose (kit super `unlimitedVoid`, kind `domain`): it plays during the 50-frame super flash
while the engine turns the stage into the void. **The only body sprite with his eyes showing.**

Standing upright, body turned about 45° toward the camera. **The blindfold is pushed up onto his
forehead** (a black band across the forehead at about y 30 to 38; the white hair still stands up above
it). **Both eyes open and glowing bright sky-blue** (CHARACTER.md §5: `#5fe2ff` iris, `#1f8ee8` rim,
`#e2fbff` highlight, a 1 px dark pupil), with **white eyelashes and brows**. **R hand raised in front of
his chest at chin height forming the Unlimited Void sign**: the **middle finger crossed over the index
finger**, both raised, the other fingers curled, the back of the hand toward the opponent (about x 160
to 178, y 58 to 78). **L hand in his pocket.** Calm, superior half-smile. Hair tips and the jacket hem
stirring in the domain wind. No void, no stars, no glow in the sprite.

- **f0**: as described.
- **f1**: hem and hair tips flutter 1 to 2 px.
- **f2**: the eye highlight shifts 1 px, the hand sign 1 px higher.
- **f3**: settle back toward f0 (a clean loop).

QA: the blue eyes read at a glance; the crossed fingers read as crossed (not a peace sign, not a
point); the hand stays below the hair top.

---

## Character moments

<a id="intro"></a>

### intro: hands-in-pockets shrug · 4 frames, loop

Standing upright, legs nearly straight, weight on the R leg (hip cocked), body turned more toward the
camera (about 50°). **Both hands in his pockets.** Chin raised, head tilted, lazy cocky smile, looking
down at the opponent (screen-right). A light breeze moves the hair tips and the jacket hem.

- **f0**: as described.
- **f1**: a loose shrug: shoulders rise 2 px.
- **f2**: shoulders drop, head tilts 1 to 2 px the other way.
- **f3**: settle back toward f0.

<a id="taunt"></a>

### taunt: looming tease · 2 frames, loop

**Both hands in his pockets.** Upper body leaning forward about 10° toward screen-right, as if looming
over a shorter opponent, head tilted, a wide teasing grin with teeth.

- **f0**: as described.
- **f1**: head tilts to the other side, grin wider, the hem flicks.

<a id="win"></a>

### win: peace sign · 4 frames, loop

Standing upright, body turned toward the camera (about 50°). **L hand in his pocket.** **R hand raised
beside his face flashing a peace sign** (index and middle fingers up and apart, palm toward the viewer)
at cheek height, **never above the top of his hair**. Big grin, head tilted. Blindfold on.

- **f0**: as described.
- **f1**: hair tips and the hem flutter in the breeze.
- **f2**: the peace sign tilts 3 px (a playful wiggle).
- **f3**: settle, flutter variant.

## Tech poses (ADR 0030)

`techGround` (4 frames, beats 1/2/1), `techRoll` (6, 1/4/1) and `wallTech` (5, 2/1/2): optional; until they are
packed the game shows `land` / `airRecover` / `jumpUp` for the techs. Per-frame poses, this fighter's flavor, the
prompt blocks and the QA: [TECH_POSES_BRIEF.md](../TECH_POSES_BRIEF.md) (ART-TECH-01); the generic rows:
[_template/ANIMATIONS.md](../_template/ANIMATIONS.md#techground).
