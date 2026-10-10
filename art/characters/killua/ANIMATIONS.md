# Killua: animations, frame by frame

Every animation the engine knows, in the canonical order and frame counts of
`src/art/animGuide.js`, plus the **4 optional move-system-v2 animations** of
[ADR 0009](../../../docs/decisions/0009-move-system-v2.md) (`specialForward`, `specialUp`,
`specialDown`, `superPose`), for **art spec v2** ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md):
256×256 cells). Killua is **about 6 heads tall with a 182 px standing body** (the older fighters are
6.5 heads and 200 px), so every body height below is scaled (see
[Body heights for the manifest](#body-heights-for-the-manifest)). Each frame lists **phase**, **body
and legs**, **hands**, **face**, and **hair / cloth** motion. Design facts (palette, landmarks, near/far
side, assassin eyes, claw rules) are in [CHARACTER.md](CHARACTER.md). How each move looks in-engine and
which effects the engine adds: [MOVES_AND_VFX.md](MOVES_AND_VFX.md). Prompts: [PROMPTS.md](PROMPTS.md)
(prompt ids in the summary table). If this file disagrees with the ADRs or [art/SPEC.md](../../SPEC.md),
they win. Fix this file.

## Conventions

- **f0, f1, …** are 0-based frame numbers. They match the file names `frames/<anim>/<anim>_00.png`,
  the `hitboxes.json` frame keys and the SPEC.md contact-zone frames. In the prompts, "frame 1" is f0.
- **Phase** (attacks only): **S** startup, **A** active (the hitbox is live: the limb must be fully
  extended where the opponent's body is), **R** recovery. Gameplay timing lives in
  `src/game/moves.js` (and the kit in `SPECIAL_MOVES` / `SUPERS`); the engine stretches attack frames
  over the move's phases.
- **R / L** are Killua's right / left. Facing right in 3/4 view, **R = near the camera**,
  **L = far side**. Stance: L foot and L hand forward.
- **Forward = screen-right.** Every strike travels horizontally toward screen-right at the listed
  height. No strikes angled into or out of the screen. The 2.5D engine lines fighters up in depth, and
  a hit only lands if the drawn hand or foot overlaps the opponent's body on the horizontal.
- **Coordinates** are final-cell pixels (256×256, x from the left, y from the top, soles on y 240,
  body center line x 128) at Killua's idle scale (CHARACTER.md §3). The image generator will not hit
  them exactly. They tell Codex what to check after packing and where the engine anchors effects.
- **Contact zones are the ADR 0007 zones unchanged**: they mark a standard (200 px) opponent's face,
  chest and stomach. Killua is shorter, so on **his own body** those heights are lower: HIGH (y 58-90)
  is his **brow / eye height**, MID (y 92-124) his **shoulder height**, LOW (y 122-152) his **chest
  to waistband**. His strikes still travel horizontally; his arm simply reaches out at brow height for
  a face strike. He is about 9 % shorter in the limbs too, so most strikes include a small step-in.
- **Proportions:** about 6 heads in every frame (head about 30 px). Slim, wiry limbs: a fully extended
  arm reaches about 80 px from the shoulder, a straight kick about 90 px from the hip. No frame may
  drift toward chibi (a bigger head, shorter legs) or toward adult proportions (a small head on a
  tall body).
- **Claws** only where CHARACTER.md §6 lists them: fingers stiff and slightly hooked, nails 4 to 6 px
  past the fingertips, pale (hair-ramp tones), never metal, never glowing.
- **Smear frame:** the moving limb is drawn as one solid, tapered shape in the limb's own colors,
  stretched along its path; on claw frames it may add four thin solid streaks in the nail colors. No
  blur, no transparency, no speed lines, no motion-blur gradient.
- **Airborne and lying poses:** draw them normally. The packer drops the lowest body pixel onto
  y 240, and the engine moves the sprite in the air. In air attacks never let a hand or foot go lower
  than the lowest foot, or the body jumps between frames.
- **Centering:** the packer puts the mean x of the bottom 20 % of each frame's rows on x 128. Keep the
  hips over the midpoint between the feet so the body does not slide. In airborne and lying poses,
  put the lowest part of the body near the **middle** of the shape (the knees in `superDash`, the
  hips in `launched`, the whole back in `down` / `ko`). Keep loose shirt hems out of the bottom rows
  where you can.
- **Height check:** the packer scales each strip so its **tallest frame** equals the `bodyHeight`
  below. A pose taller than intended (a hand far above the head, extra-bristly hair) shrinks the whole
  strip. If a packed strip's head looks more than 3 px smaller or larger than `idle`'s (about 30 px)
  in the Sprite Lab, fix the pose, or Codex adjusts that animation's `bodyHeight` in
  `art/manifest.json` and logs it in `art/TRACKER.md`.
- **Forward-most rule:** on active frames the striking hand, claw or foot is the right-most part of
  the silhouette. No hair tufts, collar, shirt hem or white hem may stick out further to the right.
- **Cell margin:** after packing every opaque pixel sits inside x 4..251, y 4..240.
- **No effects in character frames:** no lightning, sparks, static, aura, dust, speed lines or
  shadows. The engine draws all of those (see MOVES_AND_VFX.md). "Bristling" hair is drawn as hair.

## Summary

`ms` = proposed default ms per frame for the manifest (shared values copied from
`art/manifest.json` `animationDefaults`; `special`, `intro`, `taunt`, `win` and the 4 new animations
are Killua-specific). Attack ms only matter for previews, because the engine time-stretches attacks
over the move phases. `bodyHeight` = Killua's value (ADR 0007 table × 0.91, rounded; `heavy` is the one
exception). **Core** = required before the game uses the custom sheet. **eyes**: `dark` = assassin
eyes on (CHARACTER.md §5). **opt v2** = optional move-system-v2 animation (ADR 0009, fallback in
brackets).

| anim | frames | phases S/A/R | loop | bodyHeight | ms | core | eyes | prompt | tallest frame (what sets the height) |
|---|---|---|---|---|---|---|---|---|---|
| [idle](#idle) | 8 | | ✓ | 186 | 150 each | ✓ | | A01 | f2/f3 (breath top) |
| [run](#run) | 8 | | ✓ | 186 | 60 each | ✓ | | A02 | f3/f7 (flight) |
| [dash](#dash) | 2 | | ✓ | 146 | 60 each | ✓ | | A19 | either |
| [backDash](#backdash) | 3 | | | 188 | 60 60 80 | | | A24 | f2 (landing, legs nearly straight) |
| [superDash](#superdash) | 2 | | ✓ | 109 | 50 each | | | A25 | either (angled 25° up, ~210 px wide) |
| [jumpSquat](#jumpsquat) | 1 | | | 147 | 70 | | | A26 | f0 |
| [jumpUp](#jumpup) | 2 | | ✓ | 180 | 80 each | ✓ | | A20 | f0 (hand at hair-top height) |
| [jumpFall](#jumpfall) | 2 | | ✓ | 190 | 80 each | ✓ | | A21 | f0 (legs extended down) |
| [land](#land) | 2 | | | 158 | 50 70 | ✓ | | A22 | f1 (rising) |
| [light1](#light1) | 7 | 2/2/3 | | 186 | 30 30 40 50 50 50 30 | ✓ | | A03 | f0/f6 (stance) |
| [light2](#light2) | 7 | 2/2/3 | | 186 | 35 30 40 50 60 50 30 | ✓ | | A04 | f6 (stance) |
| [light3](#light3) | 7 | 2/2/3 | | 196 | 40 35 45 60 60 60 30 | ✓ | | A05 | f2 (on the ball of the L foot) |
| [light4](#light4) | 8 | 3/2/3 | | 188 | 50 45 35 40 70 70 70 40 | ✓ | | A06 | f3 (on the ball, leg at head height) |
| [heavy](#heavy) | 8 | 3/2/3 | | **206** | 40 35 30 50 70 70 60 30 | ✓ | | A07 | f4 (claw top ~y 34, ~20 px above the hair) |
| [airLight1](#airlight1) | 5 | 1/2/2 | | 180 | 45 35 50 50 30 | ✓ | | A08 | f0/f4 (air neutral) |
| [airLight2](#airlight2) | 5 | 1/2/2 | | 188 | 45 40 50 50 30 | | | A27 | f1 (leg extended) |
| [airLight3](#airlight3) | 6 | 2/2/2 | | 183 | 50 40 50 70 60 30 | | | A28 | f2 (kick at chest height) |
| [airHeavy](#airheavy) | 6 | 2/2/2 | | 180 | 50 45 45 70 70 40 | ✓ | | A09 | f1 (clasped hands overhead) |
| [guard](#guard) | 2 | | ✓ | 180 | 300 each | ✓ | | A10 | f0 |
| [block](#block) | 2 | | | 186 | 60 80 | | | A29 | f1 (settling) |
| [hurtHigh](#hurthigh) | 3 | | | 177 | 70 90 100 | ✓ | | A11 | f2 |
| [hurtLow](#hurtlow) | 3 | | | 167 | 70 90 100 | | | A30 | f2 |
| [launched](#launched) | 2 | | ✓ | 124 | 70 each | ✓ | | A12 | either (arched diagonal body) |
| [spin](#spin) | 4 | | ✓ | 146 | 60 each | | | A31 | f0 |
| [airRecover](#airrecover) | 3 | | | 164 | 50 50 60 | | | A32 | f2 (unfolding) |
| [down](#down) | 2 | | | 87 | 80 420 | ✓ | | A13 | f0 (knees up) |
| [getup](#getup) | 5 | | | 186 | 70 60 60 80 70 | ✓ | | A14 | f4 (stance) |
| [charge](#charge) | 4 | | ✓ | 180 | 50 each | ✓ | | A15 | any |
| [throw](#throw) (Narukami, air) | 4 | 1/1/2 | | 183 | 50 60 70 50 | | | A33 | f0 (air wind-up) |
| [beamCharge](#beamcharge) | 3 | | ✓ | 180 | 50 each | ✓ | dark | A16 | any |
| [beamFire](#beamfire) | 3 | | ✓ | 180 | 50 each | ✓ | dark | A17 | any |
| [vanish](#vanish) | 2 | | | 201 | 50 each | | | A34 | f1 (stretched) |
| [stagger](#stagger) | 4 | | ✓ | 188 | 150 each | | | A35 | f1/f3 (upright) |
| [ko](#ko) | 1 | | | 58 | 500 | | | A36 | f0 |
| [special](#special) (Narukami, ground) | 8 | 3/3/2 | | 186 | 80 80 80 40 40 60 130 90 | ✓ | | A18 | f0/f7 (stance) |
| [intro](#intro) | 4 | | ✓ | 191 | 180 each | | | A37 | any (upright) |
| [taunt](#taunt) | 2 | | ✓ | 193 | 220 each | | | A38 | any (upright) |
| [win](#win) | 4 | | ✓ | 193 | 220 each | ✓ | | A23 | any (upright; elbows at head height, not above the hair) |
| [specialForward](#specialforward) (Rhythm Echo) | 7 | 2/2/3 | | 186 | 40 40 50 60 60 50 40 | opt v2 [special] | dark f0-f5 | A39 | f6 (stance) |
| [specialUp](#specialup) (Thunderbolt rise) | 6 | 2/2/2 | | 198 | 50 50 60 60 70 70 | opt v2 [special] | | A40 | f2/f3 (claw ~13 px above the hair) |
| [specialDown](#specialdown) (Godspeed) | 4 | 2/1/1 | | 188 | 90 90 120 100 | opt v2 [charge] | dark | A41 | f2 (snap upright, hair bristling) |
| [superPose](#superpose) (Whirlwind) | 4 | | ✓ | 191 | 120 each | opt v2 [taunt] | dark | A42 | any |

38 + 4 = **42 animations, 175 frames** (11 rows of the 16-column sheet: 4096 × 2816 px, one row more
than the 154-frame sheets). The 23 core animations are 108 frames.

## Body heights for the manifest

For Claude: the per-character `bodyHeight` overrides for `art/manifest.json` → `characters.killua.animations`.
Rule: ADR 0007 value × 0.91 (182 / 200), rounded; **`heavy` = 206** instead of 198 so its f4 claw still
reaches the ADR F04 zone (y 22-46) with a natural, nearly vertical arm. The 4 new animations have no ADR
value yet; Killua's numbers are set from their tallest frames.

| anim | ADR 0007 | **Killua** | anim | ADR 0007 | **Killua** | anim | ADR 0007 | **Killua** |
|---|---|---|---|---|---|---|---|---|
| idle | 204 | **186** | light4 | 207 | **188** | hurtHigh | 195 | **177** |
| run | 204 | **186** | heavy | 218 | **206** | hurtLow | 183 | **167** |
| dash | 160 | **146** | airLight1 | 198 | **180** | launched | 136 | **124** |
| backDash | 207 | **188** | airLight2 | 207 | **188** | spin | 160 | **146** |
| superDash | 120 | **109** | airLight3 | 201 | **183** | airRecover | 180 | **164** |
| jumpSquat | 162 | **147** | airHeavy | 198 | **180** | down | 96 | **87** |
| jumpUp | 198 | **180** | guard | 198 | **180** | getup | 204 | **186** |
| jumpFall | 209 | **190** | block | 204 | **186** | charge | 198 | **180** |
| land | 174 | **158** | throw | 201 | **183** | beamCharge | 198 | **180** |
| light1 | 204 | **186** | vanish | 221 | **201** | beamFire | 198 | **180** |
| light2 | 204 | **186** | stagger | 207 | **188** | ko | 64 | **58** |
| light3 | 215 | **196** | special | 204 | **186** | intro | 210 | **191** |
| taunt | 212 | **193** | win | 212 | **193** | | | |
| specialForward | (new) | **186** | specialUp | (new) | **198** | specialDown | (new) | **188** |
| superPose | (new) | **191** | | | | | | |

New-animation rows for the manifest (frames, phases, loop, proposed ms):
`specialForward` 7, [2, 2, 3], no loop, 40 40 50 60 60 50 40 · `specialUp` 6, [2, 2, 2], no loop,
50 50 60 60 70 70 · `specialDown` 4, [2, 1, 1], no loop, 90 90 120 100 · `superPose` 4, loop,
120 120 120 120. Killua-specific shared-animation ms: `special` 80 80 80 40 40 60 130 90, `intro` 180
each, `taunt` 220 each, `win` 220 each.

---

## Movement

<a id="idle"></a>

### idle: 8 frames, loop

Loose assassin stance, slow breathing. **Feet are identical in all 8 frames** (no foot sliding). This
strip becomes `reference/idle_approved.png`, the pose and proportion anchor for every later strip.

Base pose: knees bent about 25°, **weight on the balls of both feet** (heels just touching), feet a
bit wider than the shoulders, L foot forward with the toes to screen-right (toes at x ~166), R foot
back and turned out about 40° (heel at x ~92). Torso leans forward about 12°, slightly hunched, turned
35° to the camera; shoulders low and relaxed. L (lead) arm forward, elbow bent about 70°, **open hand
at chin-to-chest height** (x ~160 to 172, y ~98 to 112), fingers loosely curled, palm down and forward.
R (rear) arm hanging low, **open hand beside the R hip** in front of the thigh (x ~130 to 142, y ~146 to
160), fingers loosely curled. Head slightly down, eyes looking up from under the tufts toward
screen-right. The loose purple shirt hangs over the waistband with the white hem showing, the shorts
end just above the knees.

- **f0**: base pose, neutral height. Face: cold, half-lidded, mouth a small flat line.
- **f1**: inhale, chest and shoulders up 1 px. Tufts lag (no change yet).
- **f2**: top of the breath, up about 2 px. L fingers flex once. Tufts settle 1 px back.
- **f3**: hold the top. One forehead tuft drifts 1 px.
- **f4**: exhale, back to +1 px.
- **f5**: neutral height (same as f0).
- **f6**: low point. Knees bend 1 to 2 px more, shoulders drop 1 to 2 px. Tufts bounce 1 px, shirt
  hem settles 1 px.
- **f7**: back up toward f0 (a clean loop into f0).

QA: hair top y ~54, skull top ~69, soles 240 (trimmed height 186); head about 30 px. The lead hand is
the idle front edge (x ~172); nothing in idle reaches past ~x 174, because the packer finds strike
hitboxes from whatever reaches past idle's right edge minus 9 px (~x 163 to 165).

<a id="run"></a>

### run: 8 frames, loop

Low, silent assassin sprint (not the ninja run). Torso leans about 35° forward, head up and level,
eyes forward. **Arms held low and slightly back**, elbows a little bent, open loose hands trailing
beside the hips; they swing only 2 px (no arm pumping). Long, light strides on the balls of the feet.
Tufts swept back to screen-left with a 1 px alternating flutter; the loose shirt and its white hem flap
back; the shorts' leg openings flap. Face: cold, mouth closed.

- **f0**: contact. L leg reaches forward, ball of the foot touching down ahead (x ~180). R leg behind,
  toes pushing off.
- **f1**: down. Weight on the L leg, knee bent deepest, body at its lowest. R heel lifting behind.
- **f2**: passing. L leg under the hips. R knee swings forward past it. Body rising.
- **f3**: flight. Both feet off the floor. R knee forward and up, L leg extended back. Body at its
  highest.
- **f4**: contact. R leg reaches forward, L leg behind pushing off.
- **f5**: down. Weight on the R leg, lowest body.
- **f6**: passing. L knee swings forward.
- **f7**: flight. L knee forward and up, R leg extended back. Loops into f0.

QA: the flight stride is about 136 px wide; keep it inside x 4..251.

<a id="dash"></a>

### dash: 2 frames, loop

Low, very fast forward dash. Torso leans about 50° forward, head up glaring forward. L knee bent under
the chest, R leg extended straight back, toes dragging. Arms trail straight back low, hands open.
Face: focused.

- **f0**: as described. Tufts, shirt hem and white hem streaming back hard.
- **f1**: stride 6 px wider (L foot further forward, R further back), hems in an alternate flutter.

<a id="backdash"></a>

### backDash: 3 frames

Quick catlike hop backward (toward screen-left) while still facing right.

- **f0**: push-off. Knees bent, weight on the ball of the L (front) foot pushing back. Torso upright,
  leaning back about 6°. Both hands come up loose in front of the chest. Face: cold.
- **f1**: airborne. Knees tucked high, torso leaning back about 10°, arms forward for balance. Tufts,
  the shirt hem and the white hem flick **forward** (screen-right).
- **f2**: landing on the ball of the R (back) foot, L foot about to touch, legs nearly straight (the
  tallest frame, 188), knees starting to absorb. Arms returning to the stance. Tufts swing back past
  rest.

<a id="superdash"></a>

### superDash: 2 frames, loop

Homing flight toward screen-right like a missile. **ADR 0007 pose:** the body flies **angled about 25°
upward** from horizontal (head and hand higher, hips lower), eyes locked on the target. **R arm thrust
forward along the flight line as a spear-hand** (fingers straight and together, claws out), the leading
point of the shape. L arm tucked along his side, pointing back. **Knees bent sharply as if kneeling in
the air**: thighs angled down and a little forward from the hips, shins folded back so the feet trail
behind; the **knees are the lowest point, under the middle of the shape**. Toes pointed. Face: focused.
The whole shape is about 210 px wide and 109 px tall.

- **f0**: as described. Tufts flattened back, shirt and hems streaming straight back.
- **f1**: knees bent 4 px more and 2 px apart, hems in an alternate flutter.

QA: after packing the fingertips stay inside x 251 and the trailing feet inside x 4. If the shape shifts
sideways, the lowest point is not near its middle (Conventions, Centering).

<a id="jumpsquat"></a>

### jumpSquat: 1 frame

- **f0**: deep catlike crouch right before takeoff. Knees bent about 85°, up on the balls of the feet,
  L foot forward, torso leaning forward about 20°. Both arms swung down and back, hands open. Head
  up, looking forward and up. Tufts squashed 1 to 2 px, shirt hem pooled over the thighs. Face:
  focused.

<a id="jumpup"></a>

### jumpUp: 2 frames, loop

Rising.

- **f0**: knees tucked high (L knee near the chest, R knee a little lower), torso upright. **R arm
  raised up and forward** (about 125°, open hand at hair-top height, in front of the head). L arm down
  and back. Head tilted slightly up. Tufts, shirt hem and white hem **pressed downward** by the upward
  motion; the shirt rides up a little. Face: cold.
- **f1**: knees 2 px lower, R arm 2 px lower, tufts in an alternate flutter.

<a id="jumpfall"></a>

### jumpFall: 2 frames, loop

Falling.

- **f0**: legs extending down, L leg slightly forward and slightly bent, R leg slightly back and
  slightly bent, toes pointed down (the tallest frame, 190). Arms out for balance (R arm out forward
  and up about 70°, L arm out back), hands open. Tufts **lifted upward**, the loose shirt billowing up
  2 to 4 px so more of the white hem shows. Face: cold.
- **f1**: arms 2 px higher, tufts and hems in an alternate flutter.

<a id="land"></a>

### land: 2 frames

- **f0**: silent impact crouch (squash). Knees deeply bent, on the balls of the feet, torso leaning
  forward about 20°, arms out forward and down for balance (hands stay well above the floor). Tufts
  squashed 1 to 2 px, shirt hem pools over the thighs. Face: cold.
- **f1**: rising halfway back to the stance (the tallest frame, 158). Arms returning, tufts settling.

---

## Ground normals (auto combo: light ×4)

<a id="light1"></a>

### light1: knife-hand thrust with the L (lead) hand · 7 frames · phases 2/2/3

- **f0 · S**: anticipation. The L hand pulls back 6 to 8 px toward the chest, fingers straightening
  and pressing together. Weight sinks 1 px. Face: cold.
- **f1 · S**: the L knife-hand launches, elbow half extended (fingertips at x ~184), nail tips
  sharpening into points. Shoulders start rotating forward. Face: focused.
- **f2 · A · smear**: L arm **fully extended straight toward the right, raised to his own brow height**
  (an opponent's face): **fingertips in x 206 to 226, y 64 to 86** (HIGH), fingers straight and together,
  nail tips pointed. L shoulder forward, chin tucked behind it, R hand up near the chin (open, loose).
  L foot slides forward about 10 px (step-in). Solid tapered smear behind the hand from about x 168, in
  sleeve purple, cuff white and skin colors. Face: focused.
- **f3 · A**: same extension without the smear, hand 1 to 2 px further (impact settle). Tufts flick
  forward 1 px; the sleeve ripples.
- **f4 · R**: hand retracting halfway (x ~190), nails shrinking back.
- **f5 · R**: L hand back near the guard, fingers relaxing into the loose curl. L foot slides back.
- **f6 · R**: idle stance (matches idle f0).

<a id="light2"></a>

### light2: claw swipe with the R (near) hand · 7 frames · phases 2/2/3

- **f0 · S**: hips coil. Torso twists back toward the camera. R hand cocked high beside the R ear,
  **fingers hooked into a claw, nails out**, elbow back. Weight on the R (back) leg. Face: cold.
- **f1 · S**: hips and shoulders rotate forward, the R claw sweeps forward past his face (x ~166).
  Face: focused.
- **f2 · A · smear**: R arm **fully extended forward at his own eye height**: **claw (fingers spread and
  hooked, nails leading) in x 214 to 236, y 70 to 92** (HIGH), crossing in front of his body (fully
  visible, near side). Torso turned almost to profile, the loose shirt twisting with it. R heel lifted,
  pivoting on the ball of the foot. L hand pulled back to the chest. Solid crescent smear behind the
  claw from the cocked position, with four thin solid claw-trail streaks in the nail colors along the
  fingertips' path. Face: focused, teeth just showing.
- **f3 · A**: hold without the smear, claw 1 to 2 px further.
- **f4 · R**: arm retracting, torso unwinding, claw still out.
- **f5 · R**: R hand back in front of the chest, nails shrinking back, heel down.
- **f6 · R**: idle stance.

<a id="light3"></a>

### light3: snap kick to the stomach with the R (near) leg · 7 frames · phases 2/2/3

- **f0 · S**: weight shifts onto the L (front) leg. R knee starts to lift out of the shorts' leg
  opening. Hands loose in guard.
- **f1 · S**: R knee chambered high (thigh about horizontal, knee at about x 170, y 150, shin hanging
  down). Torso leans back slightly. Arms in guard.
- **f2 · A · smear**: R leg **fully extended forward, rising slightly**, at his own chest height (an
  opponent's stomach): **sneaker sole and toe cap in x 222 to 246, y 122 to 148** (LOW), toes pulled
  back. Torso leans back about 15°. R arm swings back and out for balance, L hand guards the chest. Up on
  the ball of the L foot (the tallest frame, 196). The loose shirt never covers the kicking leg. Solid
  smear arc from the chamber to the foot in skin, purple and white. Face: focused.
- **f3 · A**: hold without the smear, foot 1 to 2 px further.
- **f4 · R**: knee re-chambers (shin folds back).
- **f5 · R**: R foot sets down behind him. Arms return to the loose guard.
- **f6 · R**: idle stance.

<a id="light4"></a>

### light4: spinning high roundhouse finisher (wall bounce) · 8 frames · phases 3/2/3

Also used by the **vanish kick** after a teleport (and possibly by the Whirlwind flurry, see
MOVES_AND_VFX.md).

- **f0 · S**: wind-up. Torso twists toward the camera, arms coil in, knees bend. Face: focused.
- **f1 · S**: spin starts, pivoting on the ball of the L foot. His **back faces the camera**: the back
  of the purple shirt, the navy collar from behind and the fluffy back tufts show. R leg lifting. Head
  turns to spot the target over his shoulder.
- **f2 · S**: back to the camera, side-on. R knee chambered high and turned over (hip rolled). Head
  spotting the target at screen-right. The shirt hem flares out with the spin, the white hem flashing.
- **f3 · A · smear**: R leg **fully extended high and horizontal**, the instep and shin striking at an
  opponent's head height (his own eye level or a little higher): **foot in x 224 to 248, y 56 to 88**
  (HIGH). Torso leans back about 25° to counterbalance, up on the ball of the L foot (the tallest frame,
  188), arms flung out. Big solid crescent smear from behind and below up to the foot. Face: fierce
  (one small fang).
- **f4 · A**: hold without the smear. Tufts and hems whip forward.
- **f5 · R**: leg dropping, rotation follows through.
- **f6 · R**: R foot sets down, regaining the stance.
- **f7 · R**: idle stance.

<a id="heavy"></a>

### heavy: rising claw uppercut launcher with the R (near) hand · 8 frames · phases 3/2/3

The engine adds a small hop. The claw path must pass **through the opponent's chin space in front of
him**, not straight up beside his own head. **Killua's `bodyHeight` here is 206** (not 198): his arm goes
almost straight up on f4 so the claw tops out at about y 34, inside the ADR F04 zone.

- **f0 · S**: crouch starts. Knees bend, torso leans forward about 20°, the R hand drops low beside the
  R hip, fingers hooking into a claw.
- **f1 · S**: deepest crouch (squash). R claw low behind the hip, L hand forward guarding. Head down,
  eyes up at the target. Shirt hem pooled over the thighs.
- **f2 · S**: legs explode upward. The R claw starts its upward arc in front of the stomach.
- **f3 · A · smear**: rising, heels off, toes last to leave the floor. The R claw **rakes up and forward**
  in front of his face, through an opponent's chin height: **claw in x 180 to 208, y 58 to 86** (HIGH; for
  him that is in front of his forehead), arm about 45 to 60° above horizontal. Torso leans back 10 to
  15°, L arm pulled down to his side. Solid crescent smear from the low position up to the claw, with
  claw-trail streaks. Face: fierce.
- **f4 · A**: peak, fully airborne, knees bent and feet hanging with pointed toes (so his hair top is
  about as high as in idle). R arm up and forward about 65 to 70°, **claw overhead at x 160 to 188 with
  its top at about y 34**, about 20 px above the top of his hair and no higher (the tallest frame,
  206). ADR zone for this frame: x 160 to 188, y 22 to 46. Tufts pressed down, the shirt riding up so the
  white hem shows more.
- **f5 · R**: descending, arm coming down, nails shrinking back, knees bending.
- **f6 · R**: landing crouch on the balls of the feet.
- **f7 · R**: idle stance.

---

## Air normals

**Air neutral** (start and end pose of every air attack and of `throw`): torso upright with a slight
forward lean, hands loose in front of the chest; L knee bent forward and up, **R leg hanging down
almost straight with the toes pointed** (the lowest point of the pose, roughly where a standing foot
would be, so his chest stays at about y 110 to 134 after packing). Tufts and the shirt hem lifted
slightly.

<a id="airlight1"></a>

### airLight1: mid-air knife-hand thrust with the L hand · 5 frames · phases 1/2/2

- **f0 · S**: air neutral, the L hand pulled back to the chest, fingers straightening. Face: cold.
- **f1 · A · smear**: L arm **fully extended horizontally at his own shoulder height** (an opponent's
  chest): **fingertips in x 206 to 230, y 100 to 120** (MID), fingers straight and together, nail tips
  pointed. Torso leans forward 10°. Smear trailing the hand. Face: focused.
- **f2 · A**: hold without the smear.
- **f3 · R**: retracting, nails shrinking back.
- **f4 · R**: air neutral.

<a id="airlight2"></a>

### airLight2: mid-air snap kick with the R leg · 5 frames · phases 1/2/2

- **f0 · S**: R knee chambered up to the chest.
- **f1 · A · smear**: R leg extends **straight forward**, angled slightly down, at his own hip height:
  **foot in x 220 to 246, y 130 to 155** (LOW). Torso leans back about 12°, R arm out behind for
  balance, the L leg hangs as the lowest point. Smear arc to the foot (the tallest frame, 188). Face:
  focused.
- **f2 · A**: hold without the smear.
- **f3 · R**: knee re-chambers.
- **f4 · R**: air neutral.

<a id="airlight3"></a>

### airLight3: mid-air spinning heel kick that knocks away (wall bounce) · 6 frames · phases 2/2/2

- **f0 · S**: body twists away (back toward the camera: the back of the shirt and collar, the back
  tufts), L knee chambered.
- **f1 · S**: spinning. Hips turn over, head spots the target at screen-right, shirt hem flaring.
- **f2 · A · smear**: L leg **fully extended forward**, heel leading, at his own chest-to-hip height:
  **heel in x 222 to 248, y 105 to 150** (MID). Body leans back about 18°, R knee tucked, arms flung (R
  back, L forward). Big crescent smear (the tallest frame, 183). Face: fierce.
- **f3 · A**: hold without the smear.
- **f4 · R**: leg folding back in.
- **f5 · R**: air neutral.

<a id="airheavy"></a>

### airHeavy: double-hand hammer spike (ground bounce; also the THUNDERBOLT slam) · 6 frames · phases 2/2/2

The Thunderbolt up special ([specialUp](#specialup)) ends its rise in the same clasped-hands pose as f0
here, then the engine plays this strip for the slam. Draw no lightning: the engine adds it.

- **f0 · S**: both hands clasped together (fingers interlocked) raised overhead. Torso arching back,
  knees tucked. Face: fierce.
- **f1 · S**: peak of the wind-up. Arched further, clasped hands behind the head (the tallest frame,
  180).
- **f2 · A · smear**: torso whips forward about 40°. Both arms swing **down and forward**, straight,
  clasped hands in front of and below his chest: **hands in x 180 to 218, y 160 to 206**, smashing down
  onto the opponent. Knees bent, the feet hanging below the hands (the lowest point). Large vertical
  crescent smear from overhead to the hands.
- **f3 · A**: hold without the smear, hands 2 px lower. Tufts whip down.
- **f4 · R**: arms rising, body uncurling.
- **f5 · R**: air neutral.

---

## Defense and reactions

<a id="guard"></a>

### guard: 2 frames, loop

X-block. Both forearms (purple sleeves, white cuffs) **crossed in front of his face and upper chest**,
R forearm in front (near), hands open with loosely curled fingers (no claws), elbows down. Chin tucked,
eyes cold over the crossed arms. Knees bent more than in idle, weight back, on the balls of the feet,
L foot forward.

- **f0**: as described (the tallest frame, 180). Face: cold glare.
- **f1**: 1 px lower (breath). Tufts sway 1 px.

<a id="block"></a>

### block: 2 frames

- **f0**: pushed back by a blocked hit. Whole body leans back about 6° and has slid back (the R sneaker
  skidding). Arms still crossed but jarred upward. **Eyes shut tight**, teeth gritted. Tufts and hems
  blown back (screen-left).
- **f1**: settling back into the guard, knees a little straighter than guard f0 (the tallest frame,
  186).

<a id="hurthigh"></a>

### hurtHigh: hit in the face · 3 frames

f0 is the peak of the reaction, and it eases back over f1 and f2.

- **f0**: head snapped back (chin up, face tilted toward the sky). Torso arched back about 25°, both
  arms flung back and out, hands open. One foot slipping. Eyes squeezed shut, mouth open in pain.
  Tufts and hems whip **forward**.
- **f1**: about 30 % recovered. Head coming down, arms swinging back in.
- **f2**: mostly recovered (the tallest frame, 177), still wincing, arms returning toward guard.

<a id="hurtlow"></a>

### hurtLow: hit in the stomach · 3 frames

- **f0**: doubled over. Torso bent forward about 40°, head down, both arms clutching the stomach, knees
  bent. Eyes wide with tiny pupils, mouth open. Tufts swing forward and down.
- **f1**: about 30 % recovered.
- **f2**: rising (the tallest frame, 167), wincing, one hand still on the stomach.

<a id="launched"></a>

### launched: knocked flying backward · 2 frames, loop

Facing right, flying toward screen-left. **ADR 0007 pose: arched diagonally, not fully horizontal.**
The body is tilted about 60° back from upright and arched like a drawn bow with the belly up: the
**hips are the lowest point, near the middle of the shape**, the head and shoulders rise to the
upper-left, the legs bend and trail forward to the right at about hip height or a little higher. Arms
flung up and back past the head. Eyes shut, mouth open. Tufts and hems whip forward (screen-right); the
loose shirt rides up. About 124 px tall and 165 to 175 px wide.

- **f0**: as described.
- **f1**: limbs in alternate positions (arms about 6° apart, the leg bend swapped).

<a id="spin"></a>

### spin: tumbling head over heels · 4 frames, loop

One full **backward** rotation, **counter-clockwise on screen** (head goes left, down, right, up).
Balled up: knees to the chest, arms bent in. Eyes shut in pain. Tufts and hems trail opposite to the
rotation.

- **f0**: tilted back 30° (head up-left), the tallest frame (146).
- **f1**: 120° (head pointing down-left).
- **f2**: 210° (upside down, head at the bottom).
- **f3**: 300° (head at the right, coming back around).

<a id="airrecover"></a>

### airRecover: mid-air backflip recovery · 3 frames

Backward flip, counter-clockwise on screen, landing-ready like a cat.

- **f0**: tucked, tilted back 60°, knees to the chest. Eyes open, regaining focus.
- **f1**: upside down (about 200°), fully tucked.
- **f2**: almost upright (about 340°), unfolding: legs extending down, arms out loose, cold glare (the
  tallest frame, 164).

<a id="down"></a>

### down: slammed into the floor · 2 frames

**ADR 0007 pose: lying flat with the head toward screen-left** (about 190 px long at his size).

- **f0** (short): his back slams flat onto the floor from the shoulders to the hips (the whole back is
  the lowest part, so the pose stays centered); knees bent and lifted toward the upper-right by the
  bounce, arms flung out. Eyes shut, mouth open. Hair splashes out to the left. The tallest frame (87),
  about 165 px wide.
- **f1** (long hold): lying flat on his back, arms out at the sides, legs straight. Eyes closed,
  grimacing. Shirt splayed, the white hem showing.

<a id="ko"></a>

### ko: 1 frame

- **f0**: **lying flat on his back, head toward screen-left** (about 190 px long, 58 px tall),
  completely limp, arms splayed, one knee only slightly bent (a high knee would make the frame taller
  than 58). Eyes closed, mouth slightly open. Hair spread on the floor, shirt splayed.

<a id="getup"></a>

### getup: kip-up to standing · 5 frames

- **f0**: lying on his back (head toward screen-left), knees pulled to the chest, palms planted beside
  his head (fingers toward the shoulders). Eyes open, cold.
- **f1**: legs kick up and over toward the upper-right, back rolling onto the shoulders, hands pushing
  off.
- **f2**: springing up, airborne, torso tilted back about 40°, legs folding under him, arms out.
- **f3**: landing crouch on the balls of the feet, hands coming into the loose guard.
- **f4**: idle stance with a cold glare (the tallest frame, 186).

<a id="stagger"></a>

### stagger: dizzy (guard crush) · 4 frames, loop

Standing almost upright on wobbly knees, arms hanging loose. Eyes half-lidded and unfocused, mouth
slightly open. Tufts messy, hanging over the eyes.

- **f0**: torso and head lean toward screen-right about 8°.
- **f1**: centered, upright (tallest, 188).
- **f2**: lean toward screen-left about 8°.
- **f3**: centered.

---

## Ki, Narukami and the ultimate

<a id="charge"></a>

### charge: powering up (hold Special) · 4 frames, loop

Charging his body with electricity. Wide low stance (feet well apart, knees bent), arms held down and
away from his sides, **hands open with the fingers spread rigid and the claws out** (as if current runs
through them), shoulders hunched, head up, teeth clenched in a fierce grimace (mouth slightly open,
one small fang). Normal blue eyes, wide and intense. Tufts **bristling upward** (static, 2 to 3 px
taller than idle), the loose shirt and sleeves fluttering upward. The engine draws the aura and any
lightning.

- **f0**: as described, shifted 1 px left.
- **f1**: shifted 1 px right, tufts in a new bristle shape.
- **f2**: 1 px left, hands 1 px higher.
- **f3**: 1 px right, tuft and hem flicker variant. Loops.

<a id="throw"></a>

### throw: NARUKAMI (air) · 4 frames · phases 1/1/2

Performed **in mid-air** (`narukamiAir`: startup 8, active 3, recovery 14 game frames). The engine
spawns the lightning bolt at the start of f1, 0.5 units forward and 0.9 up: **(192, 125)** in the cell
(ADR 0007 projectile spawn). Killua's release point is his **open R palm** at chest height, on that
point. **Do not draw any lightning in the sprite.**

- **f0 · S**: air neutral legs, torso twisted back. **R hand cocked back beside the R hip**, palm open
  facing forward, fingers spread and slightly hooked. L hand forward at chest height pointing at the
  target (aim). Face: focused (the tallest frame, 183).
- **f1 · A · smear**: the R arm **thrusts forward at chest height, open palm facing the target**, fingers
  spread: **palm center at about (192 to 200, 120 to 132)**, inside the ADR release zone (x 186 to 212,
  y 116 to 142). L hand pulled back to the chest, legs trailing back and down. Solid smear from the hip
  to the palm. Face: focused, mouth open in a short exhale.
- **f2 · R**: recoil. Body drifting back 3 to 4 px, arm still extended, fingers splayed. Tufts and
  hems blown back.
- **f3 · R**: air neutral, hand lowering.

<a id="beamcharge"></a>

### beamCharge: WHIRLWIND ready stance · 3 frames, loop · assassin eyes

Low and relaxed on the balls of his feet, arms loose and slightly away from the body, hands open with relaxed short claws. White hair bristles upward; cold assassin eyes fixed forward. Same anatomical scale and feet baseline as idle; no lightning in the sprite.

- **f0:** settle low into loose ready stance.
- **f1:** small finger flex and tuft bristle; relaxed shoulders.
- **f2:** holds ready, flowing back into f0.

The previous approved Lightning Palm charge remains approved until the candidate is accepted. `beamFire` is unchanged and retained in the animation contract.

<a id="beamfire"></a>

### beamFire: LIGHTNING PALM fire · 3 frames, loop · assassin eyes

The engine starts the beam 0.8 units forward and 0.92 up: **(230, 122)** (ADR 0007), so **both palms
must reach x 222 to 238 at y 112 to 132** (his own shoulder height).

Deep lunge toward screen-right: L leg forward and bent, R leg straight back, torso leaning forward
about 14°. **Both arms thrust straight forward, palms open and facing the target, the heels of the
hands together**, fingers spread and hooked (claws out). The palms are the right-most point. Head low
between and behind the arms, **assassin eyes**, mouth open shouting. Tufts, collar edge, shirt and
sleeves blown **back** (screen-left) by the recoil. No beam in the sprite.

- **f0**: as described.
- **f1**: recoil, whole body 1 to 2 px back, tuft flicker variant.
- **f2**: pushing forward again, 1 px forward. Loops.

<a id="vanish"></a>

### vanish: teleport · 2 frames

Used by the shared vanish (→ `light4`) and as the first part of **RHYTHM ECHO** (the engine then hides
him and draws 3 ghost afterimages before [specialForward](#specialforward)).

- **f0**: a quick low crouch with a slight sideways sway (the start of his rhythm step), torso leaning
  20° forward, arms loose and pulled in. Eyes sharp, focused.
- **f1**: stretched blur. Body stretched about 8 % taller and thinner, up on his toes, arms tight to
  his sides, tufts and hems streaming up (the tallest frame, 201). The lower half breaks into 3 or 4
  **solid horizontal slices** offset sideways by 3 to 9 px (the anime high-speed afterimage). Solid
  shapes in his own colors, no transparency, no blur.

<a id="special"></a>

### special: NARUKAMI (ground) · 8 frames · phases 3/3/2

The ground neutral special is a **shot**, not a rush: `SPECIAL_MOVES.narukami` plays `special` with
startup 10 (f0 to f2), active 3 (f3 to f5) and recovery 16 (f6 and f7) game frames. The engine spawns the
lightning bolt at the start of f3 at **(192, 125)** (the same spawn point as `throw`). The active
phase is only 3 game frames, so f3 to f5 flash by; **f6 is on screen for about 8 game frames right
after the release and must still show the arm extended**. This strip is also the **fallback** for
`specialForward` and `specialUp` (ADR 0009). **Draw no lightning.**

- **f0 · S**: weight shifts back onto the R leg, torso twisting back. The R hand drops back beside the
  R hip, palm open facing forward, fingers spreading. The L hand comes forward at chest height, open,
  pointing at the target (aim). Face: focused.
- **f1 · S**: deeper twist: R palm cocked back at the hip, elbow bent behind him; L arm extended
  forward aiming; knees bent, eyes locked on the target. Tufts and the shirt hem lift slightly.
- **f2 · S**: hips turn forward, the R palm starts forward past the hip, the L hand pulls back.
- **f3 · A · smear**: release. The R arm **thrusts forward at chest height, open palm facing the target**,
  fingers spread: **palm center at about (192 to 200, 120 to 132)**, on the spawn point. L hand pulled
  back to the chest, L leg forward and bent, R leg pushing. Solid smear from the hip to the palm.
- **f4 · A**: full extension: palm at about (200 to 208, 122 to 132), fingers spread wide, torso leaning
  forward about 10°.
- **f5 · A**: hold; the recoil starts: fingers flex, tufts and hems blown back.
- **f6 · R**: recoil: body jolted back 3 to 4 px, the arm **still extended** (elbow slightly bent),
  palm still facing forward. Face: focused.
- **f7 · R**: returning toward the idle stance, the hand lowering. Face: cold.

QA: palm within about 12 px of (192, 125) on f3; f0 and f7 are about idle height (186). If the packed
palm sits elsewhere, write the measured point in MOVES_AND_VFX.md and tell Claude.

---

## Move-system-v2 animations (optional, ADR 0009)

These four names are **optional**: when one is missing the engine plays its fallback (in brackets).
They need manifest rows before the packer picks them up (Claude adds them). Strips: A39 to A42 in
PROMPTS.md.

<a id="specialforward"></a>

### specialForward: RHYTHM ECHO claw strike · 7 frames · phases 2/2/3 · assassin eyes f0-f5 [fallback `special`]

Sequence in the engine (`SPECIAL_MOVES.rhythmEcho` + `MOVES.echoStrike`): `vanish` → hidden for 7 game
frames while the engine draws 3 ghost afterimages → he **reappears 0.85 units behind the opponent,
facing them** → `echoStrike` plays this strip (startup 3, active 4, recovery 18 game frames; wall
bounce, `boxPad` [0.2, 0.3]). So f0 is a **reappearing pose**, not a stance.

- **f0 · S**: reappearing: a low crouch already facing right, weight forward on the bent L leg, torso
  leaning about 30°. **R claw drawn back low behind the R hip** (fingers together and hooked, nails fully
  out). L hand forward low and open. Assassin eyes. Tufts and hems still lifted from the teleport.
- **f1 · S**: drive: the R leg pushes, hips and shoulders turn forward, the R claw comes forward past
  the hip at waist height.
- **f2 · A · smear**: deep lunge, L knee bent far forward, R leg straight back. The R arm **fully
  extended horizontally at his own shoulder height** (an opponent's chest) as a spear-like claw thrust:
  fingers together, nails out, **claw tips in x 212 to 240, y 92 to 124** (MID). L hand pulled back to
  the chest, head low behind the R shoulder. Solid smear streak with claw-trail streaks. The claw tips
  are the right-most point.
- **f3 · A**: hold without the smear, claw 1 to 2 px further. Tufts and hems whip forward.
- **f4 · R**: arm pulling back, body rising out of the lunge.
- **f5 · R**: claw hand back in front of the chest, nails shrinking back, weight shifting back.
- **f6 · R**: idle stance (matches idle f0), eyes back to normal blue (the tallest frame, 186).

QA: the lunge stays inside x 4..251 (rear foot at about x 60 to 70); the claw tips, not the sleeve, end
the silhouette on f2 and f3.

<a id="specialup"></a>

### specialUp: THUNDERBOLT rising leap · 6 frames · phases 2/2/2 [fallback `special`]

`SPECIAL_MOVES.thunderbolt` is a **dive**: he leaps toward the opponent (rise 14, hang 5 game frames;
an anti-air hit on the way up), then slams down with an area hit. This strip covers the takeoff, the
rise and the hang; **the slam reuses [airHeavy](#airheavy)** and the landing reuses [land](#land) (exact
confirmed in `src/game/kit.js`: `specialUp` plays over the rise, the hang and slam show `airHeavy`
f0 then its active frame, the landing plays `land`). The air version (`thunderboltAir`) has no
rise and goes straight to the slam.

- **f0 · S**: crouch: knees deeply bent, torso leaning forward, both arms swung down and back, head up
  looking up and forward at the target. Tufts compressed 1 to 2 px. Face: focused.
- **f1 · S**: spring: legs extending explosively, heels off, toes last on the floor, arms swinging
  forward and up, body leaning up and forward.
- **f2 · A · smear**: rising: airborne, body stretched diagonally up and forward (about 30° from
  vertical). **R knee driven up and forward** (knee at about x 160 to 180, y 120 to 140). **R claw thrust
  up and forward above his head at about 60°** (claw at about x 172 to 206, y 42 to 70; its top about 13 px
  above his hair top and no higher). L arm back and down, L leg trailing straight down with pointed
  toes (the lowest point). Solid smear trailing the claw. Face: fierce. Tufts and hems pressed down.
  The tallest frame (198).
- **f3 · A**: the same rising pose without the smear; legs trailing, tufts pressed down.
- **f4 · R**: apex: the body curls, knees tucked, both hands coming together above the shoulders, head
  looking down and forward at the target (below-right).
- **f5 · R**: apex hang: **hands clasped together (fingers interlocked) at the top of his head**, torso
  arching slightly back, knees tucked: this flows straight into airHeavy f0 (the slam).

QA: f5 matches airHeavy f0 closely (same clasped hands, same head size); nothing on f4 and f5 rises
above the f2 claw.

<a id="specialdown"></a>

### specialDown: GODSPEED activation · 4 frames · phases 2/1/1 · assassin eyes [fallback `charge`]

`SPECIAL_MOVES.godspeed` is a **mode**: startup 18 (f0 and f1), then the activation (f2) and recovery
6 (f3) game frames; afterwards he keeps Godspeed for 8 s (+35 % speed, lightning blink dashes, +15 %
damage) and the engine draws the crackling aura around him the whole time. Sprites never change for the
mode; **draw no lightning**.

- **f0 · S**: coiling: knees bent low, feet planted wide, torso curling forward, both forearms crossed
  in front of his chest, fingers clawed. Head lowered so the tufts shade his eyes; assassin eyes
  glinting under the hair.
- **f1 · S**: deeper coil: shoulders hunched, elbows tight, the claws trembling, teeth gritted. The hair
  starts to bristle (tufts lifting 1 to 2 px).
- **f2 · A**: release: the body **snaps upright and open**, chest forward, both arms flung down and back
  from the shoulders with the fingers spread rigid and the claws out, head up, mouth open in a short
  sharp cry (one small fang). Hair **bristling straight up and out** (tufts 2 to 4 px higher than idle),
  the shirt and sleeves blown outward. The tallest frame (188).
- **f3 · R**: settles into a low, forward-leaning ready stance close to idle: knees bent, hands low and
  loose at his sides with the claws still out, hair still bristling 1 to 2 px, cold assassin eyes. Flows
  into idle.

<a id="superpose"></a>

### superPose: GODSPEED: WHIRLWIND activation (cut-in pose) · 4 frames, loop · assassin eyes [fallback `taunt`]

Shown during the **super flash** of `SUPERS.whirlwind` (flash 34 game frames, together with the
`ui/cutin.png` eye strip), right before the lightning dash. A still, menacing pose that loops a subtle
flicker. Without it the engine plays `taunt` (the tongue-out taunt), so generate it.

Base pose: standing almost upright, knees slightly bent, feet shoulder-width, body turned more toward
the camera (about 50°), chin down. **R hand raised in front of the R side of his face at eye height**,
fingers spread and hooked into a claw with the nails fully out; his **assassin eyes** glare at the
target past the claw. L hand low at his side, also clawed. Hair **bristling upward** (2 to 3 px above
idle), the shirt hem and sleeves lifted by an upward wind. The raised hand stays below the hair top.

- **f0**: as described.
- **f1**: claws flex 1 px, tuft bristle variant.
- **f2**: whole body 1 px up, shirt-hem flutter variant.
- **f3**: settle, another tuft flicker. Loops.

---

## Character moments

<a id="intro"></a>

### intro: hands in pockets, bored · 4 frames, loop

Standing upright, slouched, weight on the R leg, L knee relaxed. **Both hands shoved into the pockets of
his shorts** (the purple shirt hem hangs over his wrists). Head tilted slightly, looking at the opponent
(screen-right) from the corner of his eye, bored and half-lidded. A light breeze moves the tufts and
hems.

- **f0**: as described. Face: bored.
- **f1**: breath, up 1 px. Tufts sway 1 px.
- **f2**: head tilts 2 px further; a small ω-shaped cat smirk with one tiny fang.
- **f3**: settle back toward f0.

<a id="taunt"></a>

### taunt: tongue-out "akanbe" · 2 frames, loop

Standing upright, body turned toward the camera, weight on one leg. **His R index finger pulls down the
lower lid of his R eye** and he **sticks his tongue out** (`#e27d8c`), cheeky. L hand in the pocket of his
shorts. Normal blue eyes.

- **f0**: as described.
- **f1**: head tilts 1 to 2 px, tongue a little further out, tufts flick.

<a id="win"></a>

### win: hands behind his head · 4 frames, loop

Standing relaxed in 3/4 view facing right, weight on the R leg. **Both hands clasped behind his head,
elbows out to the sides at head height** (never above the hair top). A cheeky **cat grin** (small ω-shaped
mouth, one tiny fang), eyes curved shut.

- **f0**: as described.
- **f1**: tufts and the shirt hem flutter in the breeze.
- **f2**: one eye opens, glancing at the camera with the cat grin.
- **f3**: settle, flutter variant.
