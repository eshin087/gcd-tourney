# Sasuke — animations, frame by frame

Every animation the engine knows, in the canonical order and frame counts of
`src/art/animGuide.js`. Each frame lists **phase**, **body & legs**, **hands**, **face**, and
**hair / cloth** motion. Design facts (palette, landmarks, near/far side, Sharingan schedule) are
in [CHARACTER.md](CHARACTER.md). How each move looks in-engine and which effects the engine adds:
[MOVES_AND_VFX.md](MOVES_AND_VFX.md). Prompts: [PROMPTS.md](PROMPTS.md).

## Conventions

- **f0, f1, …** are 0-based frame numbers. They match the file names `frames/<anim>/<anim>_00.png`
  and the `hitboxes.json` frame keys. In ChatGPT prompts, "pose 1" is f0.
- **Phase** (attacks only): **S** startup, **A** active (the hitbox is live: the limb must be
  fully extended where the opponent's body is), **R** recovery. Gameplay timing lives in
  `src/game/moves.js`, and the engine stretches attack frames over the move's phases.
- **R / L** are Sasuke's right / left. Facing right in 3/4 view, **R = near the camera**,
  **L = far side**. Stance: L foot and L hand forward.
- **Forward = screen-right.** Every strike travels horizontally toward screen-right at the
  listed height. No strikes angled into or out of the screen. The 2.5D engine lines fighters up in
  depth, and a hit only lands if the drawn fist or foot overlaps the opponent's body on the
  horizontal.
- **Coordinates** are final-cell pixels (192×192, soles on y = 180, body center line x = 96).
  ChatGPT will not hit them exactly. They tell Codex what to check after packing and where the
  engine anchors effects.
- **Smear frame:** the moving limb is drawn as one solid, tapered shape in the limb's own colors,
  stretched along its path. No blur, no transparency, no speed lines, no motion-blur gradient.
- **Airborne / lying poses:** draw them normally. The packer drops the lowest body pixel onto
  y = 180, and the engine moves the sprite in the air.
- **Height check:** the packer scales each strip so its **tallest frame** equals the
  `bodyHeight` below. A pose taller than intended (a fist far above the head, for example) shrinks
  the whole strip. If a packed strip's head looks smaller or larger than `idle`'s by more than
  3 px in the Sprite Lab, fix the pose or adjust that animation's `bodyHeight` in
  `art/manifest.json` and log it in `art/TRACKER.md`.
- **Forward-most rule:** on active frames the striking fist, foot or hand must be the forward-most
  part of the silhouette. No bangs, headband tails or cloth may stick out further to the right.
  Contact zones below follow the table in [SPEC.md](../../SPEC.md) "Strikes and contact zones".
- **No effects in character frames:** no lightning, fire, aura, dust, speed lines or shadows. The
  engine draws all of those (see MOVES_AND_VFX.md).

## Summary

`ms` = default ms per frame, copied from `art/manifest.json` (the manifest is the source of truth;
`special`, `intro`, `taunt` and `win` are Sasuke-specific). Attack ms only matter for previews,
because the engine time-stretches attacks over the move phases. **Core** = required before the game uses the
custom sheet. **👁** = Sharingan on.

`bodyHeight` = the spec default **minus 6 px** on every pose where the top of his hair is the
highest point (his hair sweeps back, so it adds about 6 px less height than Naruto's spikes). That
keeps his body at the same scale as every other fighter (SPEC.md "Proportions and landmarks").
Lying and horizontal poses (`superDash`, `launched`, `spin`, `down`, `ko`) keep the defaults.

| anim | frames | phases S/A/R | loop | bodyHeight | ms | core | 👁 | tallest frame (what sets the height) |
|---|---|---|---|---|---|---|---|---|
| idle | 8 | | ✓ | 129 | 150 each | ✓ | | f2/f3 (breath top) |
| run | 8 | | ✓ | 129 | 60 each | ✓ | | f3/f7 (flight, body highest) |
| dash | 2 | | ✓ | 105 | 60 each | ✓ | | either |
| backDash | 3 | | | 131 | 60 60 80 | | | f2 (landing, legs extended) |
| superDash | 2 | | ✓ | 70 | 50 each | | | either (horizontal body) |
| jumpSquat | 1 | | | 101 | 70 | | | f0 |
| jumpUp | 2 | | ✓ | 125 | 80 each | ✓ | | f0 (fist at hair-top height) |
| jumpFall | 2 | | ✓ | 132 | 80 each | ✓ | | f0 (legs extended down) |
| land | 2 | | | 109 | 50 70 | ✓ | | f1 (rising) |
| light1 | 7 | 2/2/3 | | 129 | 30 30 40 50 50 50 30 | ✓ | | f6 (stance) |
| light2 | 7 | 2/2/3 | | 129 | 35 30 40 50 60 50 30 | ✓ | | f6 (stance) |
| light3 | 7 | 2/2/3 | | 136 | 40 35 45 60 60 60 30 | ✓ | | f2 (on the ball of the L foot) |
| light4 | 8 | 3/2/3 | | 131 | 50 45 35 40 70 70 70 40 | ✓ | | f3 (on the ball, leg at head height) |
| heavy | 8 | 3/2/3 | | 138 | 40 35 30 50 70 70 60 30 | ✓ | | f4 (fist just above the hair) |
| airLight1 | 5 | 1/2/2 | | 125 | 45 35 50 50 30 | ✓ | | f0/f4 (air neutral) |
| airLight2 | 5 | 1/2/2 | | 131 | 45 40 50 50 30 | | | f1 (leg extended) |
| airLight3 | 6 | 2/2/2 | | 127 | 50 40 50 70 60 30 | | | f2 (kick at head height) |
| airHeavy | 6 | 2/2/2 | | 125 | 50 45 45 70 70 40 | ✓ | | f1 (clasped fists overhead) |
| guard | 2 | | ✓ | 125 | 300 each | ✓ | | f0 |
| block | 2 | | | 129 | 60 80 | | | f1 |
| hurtHigh | 3 | | | 123 | 70 90 100 | ✓ | | f2 |
| hurtLow | 3 | | | 115 | 70 90 100 | | | f2 |
| launched | 2 | | ✓ | 94 | 70 each | ✓ | | either (diagonal body) |
| spin | 4 | | ✓ | 123 | 60 each | | | f0 |
| airRecover | 3 | | | 113 | 50 50 60 | | | f2 (unfolding) |
| down | 2 | | | 68 | 80 420 | ✓ | | f0 (legs up) |
| getup | 5 | | | 129 | 70 60 60 80 70 | ✓ | | f4 (stance) |
| charge | 4 | | ✓ | 125 | 50 each | ✓ | 👁 | any |
| throw (Fireball) | 4 | 1/1/2 | | 127 | 50 60 70 50 | | 👁 | f0 |
| beamCharge | 3 | | ✓ | 125 | 50 each | ✓ | 👁 | any |
| beamFire | 3 | | ✓ | 125 | 50 each | ✓ | 👁 | any |
| vanish | 2 | | | 140 | 50 each | | | f1 (stretched) |
| stagger | 4 | | ✓ | 131 | 150 each | | | f1/f3 (upright) |
| ko | 1 | | | 62 | 500 | | | f0 |
| special (Chidori) | 8 | 3/3/2 | | 129 | 120 120 120 100 100 160 120 80 | ✓ | 👁 | f0 (stance) |
| intro | 4 | | ✓ | 133 | 200 each | | | any (upright) |
| taunt | 2 | | ✓ | 134 | 300 each | | 👁 | any (upright) |
| win | 4 | | ✓ | 134 | 250 each | ✓ | | any (hand at head height, not above the hair) |

38 animations, 154 frames. The 23 core animations are 108 frames.

---

## Movement

### idle — 8 frames, loop

Fighting stance, slow breathing. **Feet are identical in all 8 frames** (no foot sliding).
Base pose: knees bent about 20°, feet a bit wider than the shoulders, L foot forward with toes to
screen-right, R foot back and turned out 45°, weight slightly back. Torso leans forward about
10° and is turned 35° to the camera. L (lead) arm forward, elbow bent about 30°, open knife-hand
at chin height (x ~130, y ~88), fingers together. R fist in front of the chest (x ~108, y ~96),
elbow down. Chin slightly down, eyes on screen-right.

- **f0**: base pose, neutral height. Face: neutral glare, mouth a flat line. Hair at rest.
- **f1**: inhale, chest and shoulders up about 1 px. Bangs lag (no change yet).
- **f2**: top of the breath, up about 2 px. L fingers relax slightly. Bangs swing 1 px back.
- **f3**: hold the top. Headband tails drift 1 px down-left.
- **f4**: exhale, back to +1 px.
- **f5**: neutral height (same as f0).
- **f6**: low point. Knees bend 1 px more, shoulders drop 1 px. Bangs swing 1 px forward.
- **f7**: back up toward f0 (a clean loop into f0). Tails drift back.

### run — 8 frames, loop

Ninja run. Torso leans about 40° forward, head up, eyes forward. **Both arms trail straight back**
behind him, about 20° above horizontal, hands open with fingers together and palms up. The arms
bob 2 px opposite to the body. Bangs and headband tails stream back to screen-left the whole time,
with a 1 px alternating flutter. Face: focused, mouth closed.

- **f0**: contact. L leg reaches forward, ball of the foot touching the floor ahead (x ~130). R leg
  behind, toes pushing off.
- **f1**: down. Weight on the L leg, knee bent deepest, body at its lowest. R heel lifting behind.
- **f2**: passing. L leg under the hips. R knee swings forward past it. Body rising.
- **f3**: flight. Both feet off the floor. R knee forward and up, L leg extended back. Body at
  its highest.
- **f4**: contact. R leg reaches forward, L leg behind pushing off.
- **f5**: down. Weight on the R leg, lowest body.
- **f6**: passing. L knee swings forward.
- **f7**: flight. L knee forward and up, R leg extended back. Loops into f0.

### dash — 2 frames, loop

Low, fast forward dash. Torso leans about 50° forward, head up glaring forward. L knee bent
under the chest, R leg extended straight back, toes dragging. Arms trail straight back as in
`run`. Face: focused.

- **f0**: as described. Hair, bangs and tails streaming back hard.
- **f1**: stride 4 px wider (L foot further forward, R further back), shirt hem and tails in an
  alternate flutter position.

### backDash — 3 frames

Quick hop backward (toward screen-left) while still facing right.

- **f0**: push-off. Knees bent, weight on the ball of the L (front) foot pushing back. Torso
  upright, leaning back about 6°. Arms rise into guard (both forearms in front of the chest).
  Face: neutral glare.
- **f1**: airborne. Both feet off the floor, knees tucked, torso leaning back about 10°, arms
  forward for balance. Bangs and tails whip **forward** (screen-right).
- **f2**: landing on the ball of the R (back) foot, L foot about to touch, knees absorbing. Arms
  returning to the stance. Bangs swing back past rest.

### superDash — 2 frames, loop

Homing flight like a missile toward screen-right. Body nearly horizontal (about 70° from
vertical), head forward and slightly up with eyes locked on the target. **R arm thrust straight
forward with a closed fist** (the leading point of the shape). L arm tucked along his side,
pointing back. Legs together and trailing, knees slightly bent, toes pointed. Face: angry. Keep
the whole shape within 176 px wide, centered in the cell.

- **f0**: as described. Hair spikes flattened back, bangs and tails streaming straight back.
- **f1**: knees bent 4 px more and 2 px apart, shirt hem and tails in an alternate flutter.

### jumpSquat — 1 frame

- **f0**: deep crouch right before takeoff. Knees bent about 80°, L foot forward, torso leaning
  forward about 18°. Both arms swung down and back, hands open. Head up, looking forward and up.
  Hair squashed 1 to 2 px. Face: focused.

### jumpUp — 2 frames, loop

Rising.

- **f0**: knees tucked high (L knee near the chest, R knee a little lower), torso upright. **R arm
  raised up and forward** (about 125°, closed fist at hair-top height, in front of the head). L arm
  down and back. Head tilted slightly up. Bangs, hair tips and tails **dragged downward** by the
  upward motion. Face: neutral glare.
- **f1**: knees 2 px lower, R arm 2 px lower, bangs and tails flutter alternate.

### jumpFall — 2 frames, loop

Falling.

- **f0**: legs extending down, L leg slightly forward and slightly bent, R leg slightly back and
  slightly bent, toes pointed down. Arms out for balance (R arm out forward and up about 70°, L
  arm out back), hands open. Bangs and tails **lifted upward**. Shirt hem lifts 1 to 2 px. Face:
  neutral glare.
- **f1**: arms 2 px higher, bangs and tails flutter alternate.

### land — 2 frames

- **f0**: impact crouch (squash). Knees deeply bent, torso leaning forward about 20°, arms out
  forward and down for balance. Hair squashed 1 to 2 px, bangs swing down past rest
  (follow-through). Face: neutral.
- **f1**: rising halfway back to the stance. Arms returning to guard, bangs settling.

---

## Ground normals (auto combo: light ×4)

### light1 — jab with the L (lead) fist · 7 frames · phases 2/2/3

- **f0 · S**: anticipation. L hand closes into a fist and pulls back 4 to 6 px toward the chest.
  Torso turns slightly away, weight sinks 1 px. Face: neutral glare.
- **f1 · S**: L fist launches, elbow half extended (fist at x ~125). Shoulders start rotating
  forward.
- **f2 · A · smear**: L arm **fully extended horizontally** at face height (fist tip x ~150 to
  162, y ~70 to 84). L shoulder forward, chin tucked behind it, R fist guarding the chin. L foot
  slides forward about 6 px (step-in). Solid tapered smear behind the fist from about x 120 to the
  fist, in sleeve and skin colors. Face: angry.
- **f3 · A**: same extension without the smear, fist 1 to 2 px further (impact settle). Bangs and
  tails flick forward 1 px.
- **f4 · R**: fist retracting halfway (x ~138), elbow bending.
- **f5 · R**: L hand back near the guard, opening into the knife-hand. L foot slides back.
- **f6 · R**: idle stance (matches idle f0).

### light2 — rear straight with the R (near) fist · 7 frames · phases 2/2/3

- **f0 · S**: hips coil. Torso twists back toward the camera. R fist cocked beside the R cheek,
  elbow back. Weight on the R (back) leg.
- **f1 · S**: hips and shoulders rotate forward, R fist driving forward past the chin (x ~120).
- **f2 · A · smear**: R arm **fully extended horizontally** at chin height (fist tip x ~158 to
  172, y ~76 to 92), crossing in front of his body (fully visible, near side). Torso
  rotated almost to profile. R heel lifted, pivoting on the ball of the foot. L hand pulled back
  to the chest. Solid smear trailing behind the R fist. Face: angry, teeth just showing.
- **f3 · A**: hold without the smear, fist 1 to 2 px further.
- **f4 · R**: R fist retracting, torso unwinding.
- **f5 · R**: R fist back in front of the chest, heel down.
- **f6 · R**: idle stance.

### light3 — front kick to the stomach with the R (near) leg · 7 frames · phases 2/2/3

- **f0 · S**: weight shifts onto the L (front) leg. R knee starts to lift. Guard tightens.
- **f1 · S**: R knee chambered high (thigh horizontal, knee at about x 120, y 128, shin hanging
  down). Torso leans back slightly. Arms in guard.
- **f2 · A · smear**: R leg **fully extended straight forward** at stomach height (sole and ball
  of the foot at x ~166 to 184, y ~110 to 128, toes pulled back). Torso leans back about 15°. R arm swings
  back and out for balance, L fist guards the chest. Standing up on the ball of the L foot (the
  tallest frame). Solid smear arc from the chamber to the foot, in shorts, skin and bandage colors.
  Face: angry.
- **f3 · A**: hold without the smear, foot 1 to 2 px further.
- **f4 · R**: knee re-chambers (shin folds back).
- **f5 · R**: R foot sets down behind him. Arms return to guard.
- **f6 · R**: idle stance.

### light4 — spinning roundhouse finisher (wall bounce) · 8 frames · phases 3/2/3

Also used by the **vanish kick** after a teleport.

- **f0 · S**: wind-up. Torso twists toward the camera, arms coil in, knees bend. Face: angry.
- **f1 · S**: spin starts, pivoting on the ball of the L foot. Body turns so his **back faces the
  camera** (the fan crest shows on the upper back). R leg lifting. Head turns to spot the target
  over his shoulder.
- **f2 · S**: back to the camera, side-on. R knee chambered high and turned over (hip rolled).
  Head spotting the target at screen-right.
- **f3 · A · smear**: R leg **fully extended high and horizontal**, the instep and shin striking
  at head height (foot x ~170 to 186, y ~64 to 88). Torso leans back about 25° to counterbalance,
  standing on the ball of the L foot, arms flung out. Big solid crescent smear from behind and below
  up to the foot. Face: shout (kiai).
- **f4 · A**: hold without the smear. Bangs and tails whip forward.
- **f5 · R**: leg dropping, rotation follows through.
- **f6 · R**: R foot sets down, regaining the stance.
- **f7 · R**: idle stance.

### heavy — rising uppercut launcher with the R (near) fist · 8 frames · phases 3/2/3

The engine adds a small hop. The fist path must pass **through the opponent's chin space in
front of him**, not straight up beside his own head.

- **f0 · S**: crouch starts. Knees bend, torso leans forward about 20°, R fist drops low beside
  the R hip.
- **f1 · S**: deepest crouch (squash). R fist low behind the hip, L hand forward guarding. Head
  down, eyes on the target.
- **f2 · S**: legs explode upward. R fist starts its upward arc in front of the stomach.
- **f3 · A · smear**: rising, heels off, toes last to leave the floor. R fist driving **up and
  forward** through chin height in front of him (fist at about x 132 to 150, y 66 to 86, arm about
  45 to 60° above horizontal). Torso leans back 10 to 15°, L arm pulled down to his side. Solid crescent smear from
  the low position up to the fist. Face: shout.
- **f4 · A**: peak, fully airborne. R arm straight up and slightly forward, **fist just above the
  top of his hair** (x ~118 to 136, y ~42 to 56) and no higher (this is the tallest frame, 138). Bangs and tails pulled
  down, shirt hem lifted.
- **f5 · R**: descending, arm coming down, knees bending.
- **f6 · R**: landing crouch.
- **f7 · R**: idle stance.

---

## Air normals

**Air neutral** (start and end pose of every air attack): knees bent and moderately tucked (L knee
forward and up, R leg hanging slightly back), torso upright with a slight forward lean, arms in
guard, bangs lifted slightly.

### airLight1 — mid-air jab with the L fist · 5 frames · phases 1/2/2

- **f0 · S**: air neutral, L fist pulled back to the chest, shoulders coiled. Face: neutral glare.
- **f1 · A · smear**: L arm **fully extended horizontally** at his own chest height (fist x ~150 to
  166, y ~88 to 100). Torso leans forward 10°. Smear trailing the fist. Face: angry.
- **f2 · A**: hold without the smear.
- **f3 · R**: retracting.
- **f4 · R**: air neutral.

### airLight2 — mid-air front kick with the R leg · 5 frames · phases 1/2/2

- **f0 · S**: R knee chambered up to the chest.
- **f1 · A · smear**: R leg extends **straight forward**, angled slightly down (foot x ~164 to 184,
  at his own hip height, y ~115 to 130). Torso leans back about 12°, R arm out behind for balance. Smear arc to the foot.
  Face: angry.
- **f2 · A**: hold without the smear.
- **f3 · R**: knee re-chambers.
- **f4 · R**: air neutral.

### airLight3 — mid-air spinning kick that knocks away (wall bounce) · 6 frames · phases 2/2/2

- **f0 · S**: body twists away (back toward the camera, crest visible), L knee chambered.
- **f1 · S**: spinning. Hips turn over, head spots the target at screen-right.
- **f2 · A · smear**: L leg **fully extended forward**, heel leading, at his own chest-to-hip height
  (heel x ~166 to 186, y ~95 to 125). Body leans back about 18°, R knee tucked, arms flung (R back, L forward). Big
  crescent smear. Face: shout.
- **f3 · A**: hold without the smear.
- **f4 · R**: leg folding back in.
- **f5 · R**: air neutral.

### airHeavy — double-fist hammer spike (ground bounce) · 6 frames · phases 2/2/2

- **f0 · S**: both hands clasped together (fingers interlocked) raised overhead. Torso arching
  back, knees tucked. Face: shout.
- **f1 · S**: peak of the wind-up. Arched further, clasped fists behind the head (tallest frame).
- **f2 · A · smear**: torso whips forward about 40°. Both arms swing **down and forward**, straight,
  clasped fists in front of and below his chest (x ~140 to 166, y ~120 to 150), smashing down onto
  the opponent. Knees bent. Large vertical crescent smear from overhead to the fists.
- **f3 · A**: hold without the smear, fists 2 px lower. Bangs whip down.
- **f4 · R**: arms rising, body uncurling.
- **f5 · R**: air neutral.

---

## Defense and reactions

### guard — 2 frames, loop

X-block. Both forearms (the white arm warmers) **crossed in front of his face and upper chest**,
R forearm in front (near), fists closed, elbows down. Chin tucked, eyes glaring over the crossed
arms. Knees bent more than in idle, weight back, L foot forward.

- **f0**: as described. Face: focused glare.
- **f1**: 1 px lower (breath). Bangs sway 1 px.

### block — 2 frames

- **f0**: pushed back by a blocked hit. Whole body leans back about 6° and has slid back (R heel
  digging in). Arms still crossed but jarred upward. **Eyes shut tight**, teeth gritted. Bangs and
  tails blown back (screen-left).
- **f1**: back to guard f0.

### hurtHigh — hit in the face · 3 frames

f0 is the peak of the reaction, and it eases back over f1 and f2.

- **f0**: head snapped back (chin up, face tilted toward the sky). Torso arched back about 25°,
  both arms flung back and out, hands open. One foot slipping. Eyes squeezed shut, mouth open in
  pain. Bangs and tails whip **forward**, hair spikes jolted.
- **f1**: about 30% recovered. Head coming down, arms swinging back in.
- **f2**: mostly recovered, still wincing, arms returning toward guard.

### hurtLow — hit in the stomach · 3 frames

- **f0**: doubled over. Torso bent forward about 40°, head down, both arms clutching the stomach,
  knees bent. Eyes wide with tiny pupils, mouth open. Bangs swing forward and down.
- **f1**: about 30% recovered.
- **f2**: rising, wincing, one hand still on the stomach.

### launched — knocked flying backward · 2 frames, loop

Facing right, flying toward screen-left. Body arched back on a diagonal, about 55° from upright
(head to the upper-left, feet to the lower-right). Arms flung up and back past the head, legs bent
and trailing forward. Eyes shut, mouth open. Bangs and tails whip forward (screen-right).

- **f0**: as described.
- **f1**: limbs in alternate positions (arms about 6° apart, the leg bend swapped).

### spin — tumbling head over heels · 4 frames, loop

One full **backward** rotation, **counter-clockwise on screen** (head goes left, down, right,
up). Balled up: knees to the chest, arms bent in. Eyes shut in pain. Hair and tails trail opposite
to the rotation.

- **f0**: tilted back 30° (head up-left).
- **f1**: 120° (head pointing down-left).
- **f2**: 210° (upside down, head at the bottom).
- **f3**: 300° (head at the right, coming back around).

### airRecover — mid-air backflip recovery · 3 frames

Backward flip, counter-clockwise on screen.

- **f0**: tucked, tilted back 60°, knees to the chest. Eyes open, regaining focus.
- **f1**: upside down (about 200°), fully tucked.
- **f2**: almost upright (about 340°), unfolding: legs extending down, arms out, cool glare.

### down — slammed into the floor · 2 frames

He lands on his back with his **head at screen-left** and feet at screen-right.

- **f0** (short): back hits the floor. Body about 18° from flat, shoulders on the floor, hips and
  legs raised toward the upper-right, arms flung out. Eyes shut, mouth open. Hair splashes out.
- **f1** (long hold): lying flat on his back, arms out at the sides, legs straight. Eyes closed,
  grimacing.

### ko — 1 frame

- **f0**: lying flat on his back (head screen-left), completely limp, arms splayed, one knee
  slightly bent. Eyes closed, mouth slightly open. Headband slightly askew, hair spread on the floor.

### getup — kip-up to standing · 5 frames

- **f0**: lying on his back, knees pulled to the chest, palms planted beside his head (fingers
  toward the shoulders). Eyes open, angry.
- **f1**: legs kick up and over toward the upper-right, back rolling onto the shoulders, hands
  pushing off.
- **f2**: springing up, airborne, torso tilted back about 40°, legs folding under him, arms out.
- **f3**: landing crouch (squash), arms coming into guard.
- **f4**: idle stance with an angry glare.

### stagger — dizzy (guard crush) · 4 frames, loop

Standing almost upright on wobbly knees, arms hanging loose. Eyes half-lidded and unfocused, mouth
slightly open. Headband slightly askew.

- **f0**: torso and head lean toward screen-right about 8°.
- **f1**: centered, upright.
- **f2**: lean toward screen-left about 8°.
- **f3**: centered.

---

## Ki, jutsu and ultimate

### charge — powering up (hold Special) · 4 frames, loop · 👁 Sharingan

Wide stance (feet well apart, knees bent), arms down and out at his sides with **fists clenched
and shaking**, elbows slightly bent, torso leaning slightly back, head tilted up, shouting.
Sharingan on. Hair, bangs and headband tails **blown upward** by the aura wind, shirt hem fluttering
up. The engine draws the aura, flames and light streaks.

- **f0**: as described, shifted 1 px left.
- **f1**: shifted 1 px right, bangs and tails in a new flicker shape.
- **f2**: 1 px left, fists 1 px higher.
- **f3**: 1 px right, hair flicker variant. Loops.

### throw — FIREBALL (Great Fireball Technique, air) · 4 frames · phases 1/1/2 · 👁 Sharingan

Performed **in mid-air**. The engine spawns the fireball at the start of f1, 0.5 units forward and
0.9 up (around x 139, y 103). Sasuke's release point is his **mouth**, so f1 pushes his head forward
and down until the lips sit at about x 134 to 142, y 88 to 100, right next to the spawn point. The
fireball is large and covers his face. **Do not draw any fire in the sprite.**

- **f0 · S**: inhale. Air-neutral legs, torso leaning back, chest puffed, cheeks full. Both hands
  forming the **tiger hand-seal at the chin**: fingers interlaced, both index and middle fingers
  pointing up together. Sharingan on.
- **f1 · A**: exhale. Torso and head **lunge forward and down** toward screen-right, mouth wide
  open and round (blowing), lips at about x 134 to 142, y 88 to 100. R hand raised to the mouth with
  index and middle fingers held up beside the lips. L arm swings back. Bangs and tails whip back.
  (Smear optional: a solid streak along the R hand's path.)
- **f2 · R**: still exhaling, mouth open smaller. Body drifting back from the recoil, legs
  extending.
- **f3 · R**: air neutral, hands lowering, mouth closed, Sharingan still on.

### beamCharge — LIGHTNING LANCE charge · 3 frames, loop · 👁 Sharingan

Chidori-style charge. Deep front stance (L foot forward, knees bent), torso **twisted back** away
from screen-right. **R hand held low and back at the R hip** (about x 62 to 72, y 118 to 130):
open, palm down, fingers spread. **L hand grips the R wrist.** Head turned toward the opponent at
screen-right. Sharingan on, teeth gritted. Hair, bangs and tails blown up and back, shirt hem
fluttering. No lightning in the sprite.

- **f0**: as described.
- **f1**: tremble 1 px forward, bangs and tails flicker variant.
- **f2**: tremble 1 px back, R fingers flex 1 px. Loops.

### beamFire — LIGHTNING LANCE fire · 3 frames, loop · 👁 Sharingan

The engine starts the beam 0.8 units forward and 0.92 up (around x 165, y 101), so the **hand tip
must reach x 158 to 170 at y 94 to 108**.

Deep lunge toward screen-right: L leg forward and bent, R leg straight back, torso leaning forward
about 14°. **R arm thrust straight forward at chest height as a spear-hand** (fingers straight and
together, palm facing down). **L hand grips the R forearm just behind the wrist** to brace. Head
behind the R shoulder, Sharingan on, mouth open shouting. Hair, bangs, tails and shirt hem blown
**back** (screen-left) by the recoil. No beam in the sprite.

- **f0**: as described.
- **f1**: recoil, whole body 1 to 2 px back, bangs and tails flicker variant.
- **f2**: pushing forward again, 1 px forward. Loops.

### vanish — teleport · 2 frames

- **f0**: quick crouch (squash about 10%). Torso leans 20° forward, arms pulled in. Eyes sharp.
- **f1**: stretched blur. Body stretched about 8% taller and thinner, up on his toes, arms tight to
  his sides, hair and tails streaming up (the tallest frame, 140). The lower half breaks into 3 or 4
  **solid horizontal slices** offset sideways by 2 to 6 px (the anime high-speed afterimage). Solid
  shapes in his own colors, no transparency, no blur.

### special — CHIDORI · 8 frames · phases 3/3/2 · 👁 Sharingan

The engine draws the lightning and pins it to these hand positions. **Draw his hand open and
empty.** Timing (60 fps): startup 28 frames (f0 to f2), active 18 frames of rush (f3 to f5),
recovery 20 frames (f6 and f7). **On hit the engine jumps straight to f6**, so f6 must read as the
impact pose by itself.

Lightning anchor (SPEC.md "Effect anchor points"): during f0 to f5 (the whole startup and active
phase) it sits at about **x 53, y 152** (low, behind his near leg). Only after a hit, for about 6
game frames of f6, does it jump to about **x 156, y 113** (thrust forward at chest and stomach
height); on a whiff the lightning is gone in recovery.

> **Known gap (task ENG-015):** on f5 (the whiff thrust) the engine still draws the lightning at the
> back point, behind his leg, while the drawn spear-hand is forward. Draw f5 as described below; the
> engine task will move the lightning to the forward point for the last third of the active phase so
> it matches f5. Until then, a whiffed Chidori shows the hand forward and the lightning behind.

- **f0 · S**: Sharingan flares on. Feet planted, knees starting to bend. R arm snaps down and back,
  L hand reaching across his waist toward the R wrist. Face: angry.
- **f1 · S**: deep crouch, torso leaning forward about 30°. **R arm straight down and back behind
  his R leg, palm open facing the floor, fingers spread, hand at about x 53, y 152.** L hand reaches
  across his waist and grips the R forearm just above the wrist. Teeth gritted. Hair, bangs and tails
  blown upward by the chakra wind.
- **f2 · S**: same crouch, more tension: shoulders hunched, R fingers clawed, eyes locked on the
  target. Bangs and tails flicker variant.
- **f3 · A**: sprint 1. Ninja run with the torso leaning about 45°, head up, glaring forward. **R arm
  trails straight back and low**, open hand near the floor behind him (about x 50 to 58,
  y 148 to 156). L arm swings back and up. L leg forward (contact). Hair and tails streaming back.
- **f4 · A**: sprint 2. Legs swapped (R leg forward), R hand still trailing low at the same spot.
- **f5 · A · smear**: thrust (shown when the rush whiffs). Hips and shoulders whip forward, **R arm
  snaps straight forward** at chest height, spear-hand with fingers straight (tip at x ~148 to 166,
  y ~100 to 120). L leg lunges forward and bent, R leg straight back. Solid smear arc from the low
  trailing position up to the hand. Face: shout. (The engine lightning stays at the back point on
  f5 until ENG-015 lands; see the note above.)
- **f6 · R**: **impact pose.** Deepest lunge, R arm fully extended, hand at about x 150 to 166,
  y 104 to 120 (around the x 156, y 113 anchor), as if driven into the opponent's chest. Head down behind the shoulder, Sharingan
  glare, teeth gritted. Bangs and tails whip forward from the stop.
- **f7 · R**: recovering. Arm still forward but bending, weight shifting back, torso rising. Mouth
  closed, Sharingan still on.

---

## Character moments

### intro — arms-crossed smirk · 4 frames, loop

Standing upright, legs straight, feet slightly apart, weight on the R leg. Body turned more toward
the camera (about 50°). **Arms folded across his chest** (R forearm over the L). Chin slightly
raised, looking down his nose at the opponent (screen-right) through half-lidded dark eyes,
one-sided smirk. A light breeze moves the bangs and tails.

- **f0**: as described.
- **f1**: breath, up 1 px. Bangs and tails sway 1 px.
- **f2**: head tilts 1 to 2 px (smug). Tails flutter further.
- **f3**: settle back toward f0.

### taunt — "come at me" · 2 frames, loop · 👁 Sharingan

Standing upright, body turned toward the camera, chin down, **Sharingan glare** with a slight smirk.
**L arm extended forward at chest height, palm up.** R hand relaxed at his side.

- **f0**: L fingers straight, palm up.
- **f1**: L fingers curl in (beckon). Headband tails flick.

### win — back-turned salute · 4 frames, loop

**3/4 back view**: his back faces the camera, his body points into the screen toward the upper-right,
and the **fan crest is clearly visible** between the shoulder blades. Head turned over his **R
shoulder**, glancing back at the camera with a smirk (one dark eye visible). **R hand raised to head
height beside his head**, index and middle fingers up (a casual two-finger salute). The hand stays
no higher than the top of his hair. L hand relaxed at his side. Standing upright.

- **f0**: as described.
- **f1**: bangs, tails and shirt hem flutter in the breeze.
- **f2**: two fingers flick forward 2 px (the salute).
- **f3**: settle, flutter variant.
