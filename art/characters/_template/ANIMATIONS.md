# {{NAME}}: animation brief (frame by frame)

> TEMPLATE. Copy this folder to `art/characters/<id>/`, replace every `{{...}}` and fill the
> "{{NAME}} specifics" column for every frame. The generic pose column is the shared moveset;
> the specifics column is what makes it **this** character (hand shapes, hair/cloth, attitude,
> signature details). Keep frame counts unless you also update `manifest.json`.

Shared rules: [SPEC.md](../../SPEC.md) (sizes, pivot, contact zones) and
[STYLE_GUIDE.md](../../STYLE_GUIDE.md) (posing, smears, strike lines). Every pose faces
**screen-right**, 3/4 view. "Near" = the side closer to the camera (the character's right side),
drawn in front of the body. "Far" = the side behind the body. Stance is orthodox: the **lead** side
(far) is forward, the **rear** side (near) is back.

**Phases**: `startup` frames build up, `ACTIVE` frames are where the strike is fully out (the
hitbox comes from these frames, so the fist/foot must reach the contact zone), `recovery` frames
return to stance. `loop` frames must cycle seamlessly.

**Proportions**: use the approved neutral and combat cells and the [title-style production contract](../../scale/title-style-pilot/PRODUCTION_CONTRACT.md) (ADR 0029), with measured skull, torso and limb lengths. A pose changes occupied bounds, not anatomical scale. The historical body-height values below describe pose envelopes; they are not independent rescale targets for new art. Calibrate from anatomical landmarks, then verify contacts, cell margins and floor placement. Claude owns formal spec/contact-zone migration.

**Files**: every generated strip is saved as the next version `raw/<anim>_vNN.png` (poses left to
right on #FF00FF; the packer uses the highest version) and queued in `art/REVIEW.md`; single frames
`raw/<anim>_NN.png`. Cleaned frames end up in `frames/<anim>/<anim>_NN.png` (NN = 00, 01, ...).

## Index

| anim | frames | phases | loop | body height px | core | step |
|---|---|---|---|---|---|---|
| [idle](#idle) | 8 | - | yes | 204 | **yes** | 3 |
| [run](#run) | 8 | - | yes | 204 | **yes** | 4 |
| [dash](#dash) | 2 | - | yes | 160 | **yes** | 8 |
| [backDash](#backdash) | 3 | - | - | 207 | - | 9 |
| [superDash](#superdash) | 2 | - | yes | 120 | - | 9 |
| [jumpSquat](#jumpsquat) | 1 | - | - | 162 | - | 9 |
| [jumpUp](#jumpup) | 2 | - | yes | 198 | **yes** | 8 |
| [jumpFall](#jumpfall) | 2 | - | yes | 209 | **yes** | 8 |
| [land](#land) | 2 | - | - | 174 | **yes** | 8 |
| [light1](#light1) | 7 | 2/2/3 | - | 204 | **yes** | 5 |
| [light2](#light2) | 7 | 2/2/3 | - | 204 | **yes** | 5 |
| [light3](#light3) | 7 | 2/2/3 | - | 215 | **yes** | 5 |
| [light4](#light4) | 8 | 3/2/3 | - | 207 | **yes** | 5 |
| [heavy](#heavy) | 8 | 3/2/3 | - | 218 | **yes** | 5 |
| [airLight1](#airlight1) | 5 | 1/2/2 | - | 198 | **yes** | 5 |
| [airLight2](#airlight2) | 5 | 1/2/2 | - | 207 | - | 9 |
| [airLight3](#airlight3) | 6 | 2/2/2 | - | 201 | - | 9 |
| [airHeavy](#airheavy) | 6 | 2/2/2 | - | 198 | **yes** | 5 |
| [guard](#guard) | 2 | - | yes | 198 | **yes** | 6 |
| [block](#block) | 2 | - | - | 204 | - | 9 |
| [hurtHigh](#hurthigh) | 3 | - | - | 195 | **yes** | 6 |
| [hurtLow](#hurtlow) | 3 | - | - | 183 | - | 9 |
| [launched](#launched) | 2 | - | yes | 136 | **yes** | 6 |
| [spin](#spin) | 4 | - | yes | 160 | - | 9 |
| [airRecover](#airrecover) | 3 | - | - | 180 | - | 9 |
| [down](#down) | 2 | - | - | 96 | **yes** | 6 |
| [getup](#getup) | 5 | - | - | 204 | **yes** | 6 |
| [charge](#charge) | 4 | - | yes | 198 | **yes** | 7 |
| [throw](#throw) | 4 | 1/1/2 | - | 201 | - | 9 |
| [beamCharge](#beamcharge) | 3 | - | yes | 198 | **yes** | 7 |
| [beamFire](#beamfire) | 3 | - | yes | 198 | **yes** | 7 |
| [vanish](#vanish) | 2 | - | - | 221 | - | 9 |
| [stagger](#stagger) | 4 | - | yes | 207 | - | 9 |
| [ko](#ko) | 1 | - | - | 64 | - | 9 |
| [special](#special) | 8 | 3/3/2 | - | 204 | **yes** | 7 |
| [intro](#intro) | 4 | - | yes | 210 | - | 9 |
| [taunt](#taunt) | 2 | - | yes | 212 | - | 9 |
| [win](#win) | 4 | - | yes | 212 | **yes** | 8 |
| [specialForward](#specialforward) | 7 | 2/2/3 | - | 204 | - (kit) | 9 |
| [specialUp](#specialup) | 6 | 2/2/2 | - | 214 | - (kit) | 9 |
| [specialDown](#specialdown) | 4 | 2/1/1 | - | 204 | - (kit) | 9 |
| [superPose](#superpose) | 4 | - | yes | 208 | - (kit) | 9 |
| [beamStruggle](#beamstruggle) | 3 | - | yes | 198 | - (struggle) | 9 |
| [beamStruggleAir](#beamstruggleair) | 3 | - | yes | 190 | - (struggle) | 9 |
| [techGround](#techground) | 4 | 1/2/1 beats | - | 204 | - (tech) | 9 |
| [techRoll](#techroll) | 6 | 1/4/1 beats | - | 162 | - (tech) | 9 |
| [wallTech](#walltech) | 5 | 2/1/2 beats | - | 209 | - (tech) | 9 |
| [light1Alt](#attack-alts) | 7 | 2/2/3 | - | 204 | - (alt) | 9 |
| [light2Alt](#attack-alts) | 7 | 2/2/3 | - | 204 | - (alt) | 9 |
| [light3Alt](#attack-alts) | 7 | 2/2/3 | - | 215 | - (alt) | 9 |
| [light4Alt](#attack-alts) | 8 | 3/2/3 | - | 207 | - (alt) | 9 |
| [heavyAlt](#attack-alts) | 8 | 3/2/3 | - | 218 | - (alt) | 9 |
| [airLight1Alt](#attack-alts) | 5 | 1/2/2 | - | 198 | - (alt) | 9 |
| [airLight2Alt](#attack-alts) | 5 | 1/2/2 | - | 207 | - (alt) | 9 |
| [airLight3Alt](#attack-alts) | 6 | 2/2/2 | - | 201 | - (alt) | 9 |
| [airHeavyAlt](#attack-alts) | 6 | 2/2/2 | - | 198 | - (alt) | 9 |
| [hurtHighAlt](#attack-alts) | 3 | - | - | 195 | - (alt) | 9 |
| [hurtLowAlt](#attack-alts) | 3 | - | - | 183 | - (alt) | 9 |
| [fTilt](#directional-normals) | 7 | 2/2/3 | - | 204 | - (normal) | 9 |
| [uTilt](#directional-normals) | 7 | 2/2/3 | - | 218 | - (normal) | 9 |
| [dTilt](#directional-normals) | 6 | 2/2/2 | - | 215 | - (normal) | 9 |
| [dashAttack](#directional-normals) | 7 | 2/2/3 | - | 207 | - (normal) | 9 |
| [fSmash](#directional-normals) | 9 | 4/2/3 | - | 207 | - (normal) | 9 |
| [uSmash](#directional-normals) | 8 | 3/2/3 | - | 218 | - (normal) | 9 |
| [dSmash](#directional-normals) | 8 | 3/2/3 | - | 215 | - (normal) | 9 |
| [fair](#directional-normals) | 6 | 2/2/2 | - | 207 | - (normal) | 9 |
| [bair](#directional-normals) | 6 | 2/2/2 | - | 201 | - (normal) | 9 |
| [uair](#directional-normals) | 6 | 2/2/2 | - | 218 | - (normal) | 9 |

The four **kit** rows ([ADR 0009](../../../docs/decisions/0009-move-system-v2.md)) are part of every
fighter's baseline kit ([ADR 0011](../../../docs/decisions/0011-kit-baseline-and-balance.md)): fill them for
this character's →, ↑, ↓ specials and second super. Missing kit animations fall back (`specialForward`/`specialUp` →
`special`, `specialDown` → `charge`, `superPose` → `taunt`). Worked examples:
[killua/ANIMATIONS.md](../killua/ANIMATIONS.md), [gojo/ANIMATIONS.md](../gojo/ANIMATIONS.md).

The three **tech** rows ([ADR 0030](../../../docs/decisions/0030-tech-recovery-animations.md),
[SPEC.md "Tech poses"](../../SPEC.md#tech-poses)) are the tech recoveries; every fighter draws them, after its idle is
approved. Until then the game shows `land` / `airRecover` / `jumpUp` for them. The engine plays each on the tech's own
clock in three beats, so the "beat" column below is which beat a frame belongs to.

The eleven **alt** rows ([ADR 0031](../../../docs/decisions/0031-attack-alt-animations.md),
[SPEC.md "Attack alts"](../../SPEC.md#attack-alts)) are optional alternate versions of the attacks and hit reactions; the
game alternates each with its base in a fixed pattern and plays the base while the alt is missing. Each alt keeps its
base's frame count, phases and body height. Write each alt's section right after its base's section, in the format of
[Attack alts](#attack-alts) below.

## idle

**fighting stance, fists up, breathing bob (loop)**  
8 frames · loops · body height 204 px · **CORE** · step 3 · default ms 150, 150, 150, 150, 150, 150, 150, 150

Default standing state. Its bounding box is also the reference the packer uses to find the striking limb in attacks, so keep the lead fist compact (about x 170-185).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | neutral fighting stance: knees bent, lead (far) fist up in front at chin height, rear (near) fist guarding the chin, weight centered between the feet | _{{fill in}}_ |
| 01 | loop | inhale: chest rises 1 px, shoulders lift slightly | _{{fill in}}_ |
| 02 | loop | top of breath: shoulders up 1-2 px, hair/cloth tips lift | _{{fill in}}_ |
| 03 | loop | exhale begins: body 1 px down | _{{fill in}}_ |
| 04 | loop | bottom of breath: knees bend 2-3 px more, shoulders drop | _{{fill in}}_ |
| 05 | loop | hold bottom: hair/cloth settle one frame late (secondary motion) | _{{fill in}}_ |
| 06 | loop | rising 1-2 px | _{{fill in}}_ |
| 07 | loop | almost back to frame 00 (must loop seamlessly into 00); feet never move | _{{fill in}}_ |

## run

**run cycle; ninja run with the torso leaned forward and arms trailing straight back (loop)**  
8 frames · loops · body height 204 px · **CORE** · step 4 · default ms 60, 60, 60, 60, 60, 60, 60, 60

Running in any direction. The engine moves the sprite; draw the cycle in place.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | CONTACT: near leg forward, heel touching, far leg back; torso leaned forward ~35-40 deg; both arms trailing straight back | _{{fill in}}_ |
| 01 | loop | DOWN: weight on the near leg, knee bent, body at its lowest | _{{fill in}}_ |
| 02 | loop | PASSING: far leg swings forward under the body, near leg straightening | _{{fill in}}_ |
| 03 | loop | UP: push off the near toes, body at its highest, both feet nearly off the ground; hair/cloth stream back | _{{fill in}}_ |
| 04 | loop | CONTACT (mirror of 00): far leg forward, near leg back | _{{fill in}}_ |
| 05 | loop | DOWN (mirror of 01) | _{{fill in}}_ |
| 06 | loop | PASSING (mirror of 02) | _{{fill in}}_ |
| 07 | loop | UP (mirror of 03); loops into 00 | _{{fill in}}_ |

## dash

**low fast forward dash, body leaning far forward, arms back (loop)**  
2 frames · loops · body height 160 px · **CORE** · step 8 · default ms 60, 60

Forward dash along the ground.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | low forward burst: torso almost horizontal, rear leg extended pushing off, lead knee bent forward, arms trailing back, hair streaming back | _{{fill in}}_ |
| 01 | loop | same pose, legs slightly alternated and cloth/hair flap changed (2-frame shimmer loop) | _{{fill in}}_ |

## backDash

**quick hop backwards**  
3 frames · plays once · body height 207 px · optional · step 9 · default ms 60, 60, 80

Back dash (hop away from the opponent).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | push off the lead foot, torso leaning back, guard up | _{{fill in}}_ |
| 01 | - | airborne hop backward: knees tucked, body upright and tilted back, guard up | _{{fill in}}_ |
| 02 | - | landing on the toes, knees bent, guard up (ready to blend into idle) | _{{fill in}}_ |

## superDash

**flying like a missile, angled about 25 degrees upward, knees bent, one fist thrust forward (loop)**  
2 frames · loops · body height 120 px · optional · step 9 · default ms 50, 50

Homing super dash. A tall body stretched fully flat may not fit the 256 px cell, so the body flies **angled about 25 degrees upward with the knees bent** (about 230 px wide); the strip is short (bodyHeight 120).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | flight toward screen-right, body angled about 25 degrees upward: lead fist thrust forward at head level (forward-most point), other arm back along the body, knees bent, legs together trailing below and behind | _{{fill in}}_ |
| 01 | loop | same pose, hair/cloth flap and a 1-2 px limb variation | _{{fill in}}_ |

## jumpSquat

**crouch right before jumping**  
1 frame · plays once · body height 162 px · optional · step 9 · default ms 70

Pre-jump frame.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | compressed crouch: knees deeply bent, torso leaned forward, arms swung back, about to spring | _{{fill in}}_ |

## jumpUp

**rising in the air, knees tucked, one arm up (loop)**  
2 frames · loops · body height 198 px · **CORE** · step 8 · default ms 80, 80

Rising part of a jump. Draw the pose only: the engine moves the sprite up.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | rising: knees tucked up, one arm raised up-forward, other arm back, hair/cloth trailing downward | _{{fill in}}_ |
| 01 | loop | same pose with a cloth/hair flap variation | _{{fill in}}_ |

## jumpFall

**falling, legs extending down, arms out for balance (loop)**  
2 frames · loops · body height 209 px · **CORE** · step 8 · default ms 80, 80

Falling part of a jump.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | falling: legs extending downward, arms spread out for balance, hair/cloth lifting up | _{{fill in}}_ |
| 01 | loop | same pose with a cloth/hair flap variation | _{{fill in}}_ |

## land

**landing crouch, then rising**  
2 frames · plays once · body height 174 px · **CORE** · step 8 · default ms 50, 70

Landing recovery.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | impact crouch: knees deeply bent, arms down/out for balance, hair still lifted | _{{fill in}}_ |
| 01 | - | rising halfway back toward the fighting stance, hair settling | _{{fill in}}_ |

## light1

**jab: wind-up, lead fist fully extended (2 frames), recover**  
7 frames · phases 2/2/3 (startup/active/recovery) · plays once · body height 204 px · **CORE** · step 5 · default ms 30, 30, 40, 50, 50, 50, 30

Auto-combo hit 1 (moves.js light1). Hits HIGH (face).

Strike point: **lead (far) fist**. Contact zone on active frames: **lead fist around x 206-226, y 64-86** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | anticipation: shoulders turn back slightly, lead fist pulls back 3-6 px toward the chin, small step forward begins | _{{fill in}}_ |
| 01 | startup | lead foot slides forward, hips start turning, lead fist halfway out (a short SOLID smear shape behind the fist is allowed) | _{{fill in}}_ |
| 02 | ACTIVE | lead (far) arm fully extended HORIZONTALLY toward screen-right at face height; fist is the forward-most pixel; shoulder rolled in, chin tucked | _{{fill in}}_ |
| 03 | ACTIVE | hold the extension (1-2 px recoil, sleeve/hair follow-through) | _{{fill in}}_ |
| 04 | recovery | fist retracting halfway | _{{fill in}}_ |
| 05 | recovery | back toward guard, weight returning | _{{fill in}}_ |
| 06 | recovery | fighting stance (close to idle 00 so the chain blends) | _{{fill in}}_ |

## light2

**straight punch with the rear arm: wind-up, extended (2 frames), recover**  
7 frames · phases 2/2/3 (startup/active/recovery) · plays once · body height 204 px · **CORE** · step 5 · default ms 35, 30, 40, 50, 60, 50, 30

Auto-combo hit 2. Hits HIGH (face / upper chest).

Strike point: **rear (near) fist**. Contact zone on active frames: **fist around x 214-236, y 70-92** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | weight shifts onto the rear (near) foot, rear fist cocked at the cheek, lead arm starting to pull back | _{{fill in}}_ |
| 01 | startup | hips and shoulders rotate toward screen-right, rear heel lifts, rear fist launches (solid smear allowed) | _{{fill in}}_ |
| 02 | ACTIVE | rear (near) arm fully extended HORIZONTALLY at face/upper-chest height, crossing IN FRONT of the torso; lead fist pulled back to the chin | _{{fill in}}_ |
| 03 | ACTIVE | hold (rear shoulder fully forward, follow-through in hair/cloth) | _{{fill in}}_ |
| 04 | recovery | arm retracting | _{{fill in}}_ |
| 05 | recovery | torso unwinding | _{{fill in}}_ |
| 06 | recovery | fighting stance | _{{fill in}}_ |

## light3

**front kick at stomach height: knee chambered, leg extended (2 frames), recover**  
7 frames · phases 2/2/3 (startup/active/recovery) · plays once · body height 215 px · **CORE** · step 5 · default ms 40, 35, 45, 60, 60, 60, 30

Auto-combo hit 3 (moves.js marks it low: true). Hits LOW/MID (stomach).

Strike point: **near foot (sole/heel)**. Contact zone on active frames: **sole around x 222-246, y 122-148** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | weight onto the lead foot, arms up for balance | _{{fill in}}_ |
| 01 | startup | rear (near) knee chambered high in front of the body, foot cocked | _{{fill in}}_ |
| 02 | ACTIVE | near leg snapped straight HORIZONTALLY toward screen-right at stomach height, sole/heel forward; torso leans back a little to counterbalance | _{{fill in}}_ |
| 03 | ACTIVE | hold the extension | _{{fill in}}_ |
| 04 | recovery | knee re-chambers | _{{fill in}}_ |
| 05 | recovery | foot comes down a step forward | _{{fill in}}_ |
| 06 | recovery | fighting stance | _{{fill in}}_ |

## light4

**spinning roundhouse finisher: wind-up and spin, leg high and extended (2 frames), recover**  
8 frames · phases 3/2/3 (startup/active/recovery) · plays once · body height 207 px · **CORE** · step 5 · default ms 50, 45, 35, 40, 70, 70, 70, 40

Auto-combo finisher; wall-bounces. Also used by the vanish attack. Hits HIGH.

Strike point: **kicking foot**. Contact zone on active frames: **foot around x 224-248, y 56-88** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | step in: lead foot plants, torso starts turning away | _{{fill in}}_ |
| 01 | startup | spin: back partly toward the camera, arms pulled in, head turned to keep eyes on the target | _{{fill in}}_ |
| 02 | startup | coming around: kicking knee chambered high, hips rotating toward screen-right | _{{fill in}}_ |
| 03 | ACTIVE | kicking leg fully extended HORIZONTALLY at head height; foot is the forward-most pixel (solid smear arc behind the foot allowed) | _{{fill in}}_ |
| 04 | ACTIVE | follow-through: leg still extended, a few px further | _{{fill in}}_ |
| 05 | recovery | leg sweeping down | _{{fill in}}_ |
| 06 | recovery | foot lands, body still turned | _{{fill in}}_ |
| 07 | recovery | back to fighting stance | _{{fill in}}_ |

## heavy

**rising uppercut launcher: deep crouch, explode upward with the fist straight up (2 frames), land**  
8 frames · phases 3/2/3 (startup/active/recovery) · plays once · body height 218 px · **CORE** · step 5 · default ms 40, 35, 30, 50, 70, 70, 60, 30

Launcher (moves.js heavy). Frame 03 must connect at chin height in FRONT of the body; frame 04 is the follow-through overhead.

Strike point: **rear (near) fist**. Contact zone on active frames: **F03 fist around x 180-208, y 58-86; F04 fist overhead around x 160-188, y 22-46** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | drop into a crouch, rear fist drops to the hip | _{{fill in}}_ |
| 01 | startup | deepest crouch, coiled; rear (near) fist low by the knee, eyes on the target | _{{fill in}}_ |
| 02 | startup | explode: legs drive up, fist starts rising in front of the body | _{{fill in}}_ |
| 03 | ACTIVE | CONTACT: fist rising through the opponent's chin height IN FRONT of the body, body extending upward | _{{fill in}}_ |
| 04 | ACTIVE | fist straight up overhead, body fully stretched, toes leaving the ground (tallest frame of the strip) | _{{fill in}}_ |
| 05 | recovery | peak of the hop, arm still up | _{{fill in}}_ |
| 06 | recovery | descending, arm lowering | _{{fill in}}_ |
| 07 | recovery | land in fighting stance | _{{fill in}}_ |

## airLight1

**mid-air jab**  
5 frames · phases 1/2/2 (startup/active/recovery) · plays once · body height 198 px · **CORE** · step 5 · default ms 45, 35, 50, 50, 30

Air combo hit 1. Airborne: draw the pose only (lowest pixel is placed on y=240 by the packer).

Strike point: **lead fist**. Contact zone on active frames: **fist around x 206-230, y 100-120** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | air pose (knees tucked), lead fist cocked | _{{fill in}}_ |
| 01 | ACTIVE | air jab: lead arm extended HORIZONTALLY at chest height, legs tucked | _{{fill in}}_ |
| 02 | ACTIVE | hold | _{{fill in}}_ |
| 03 | recovery | retract | _{{fill in}}_ |
| 04 | recovery | neutral air pose (knees tucked) | _{{fill in}}_ |

## airLight2

**mid-air front kick**  
5 frames · phases 1/2/2 (startup/active/recovery) · plays once · body height 207 px · optional · step 9 · default ms 45, 40, 50, 50, 30

Air combo hit 2.

Strike point: **near foot**. Contact zone on active frames: **foot around x 220-246, y 130-155** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | knee chambered in the air | _{{fill in}}_ |
| 01 | ACTIVE | air front kick: near leg extended HORIZONTALLY, sole forward, at hip height | _{{fill in}}_ |
| 02 | ACTIVE | hold | _{{fill in}}_ |
| 03 | recovery | retract | _{{fill in}}_ |
| 04 | recovery | neutral air pose | _{{fill in}}_ |

## airLight3

**mid-air spinning kick that knocks away**  
6 frames · phases 2/2/2 (startup/active/recovery) · plays once · body height 201 px · optional · step 9 · default ms 50, 40, 50, 70, 60, 30

Air combo ender; wall-bounces.

Strike point: **kicking heel**. Contact zone on active frames: **heel around x 222-248, y 105-150** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | turn away in the air, knees tucked | _{{fill in}}_ |
| 01 | startup | spin: back partly toward the camera | _{{fill in}}_ |
| 02 | ACTIVE | spin kick: leg extended HORIZONTALLY, heel forward, body tilted | _{{fill in}}_ |
| 03 | ACTIVE | follow-through | _{{fill in}}_ |
| 04 | recovery | tuck | _{{fill in}}_ |
| 05 | recovery | neutral air pose | _{{fill in}}_ |

## airHeavy

**double-fist hammer: both fists raised overhead, then smashed down-forward**  
6 frames · phases 2/2/2 (startup/active/recovery) · plays once · body height 198 px · **CORE** · step 5 · default ms 50, 45, 45, 70, 70, 40

Air spike; ground-bounces the victim. The strike goes DOWN-FORWARD (the only non-horizontal strike).

Strike point: **both clasped fists**. Contact zone on active frames: **fists around x 180-218, y 160-206 (below the attacker's chest, in front)** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | both hands clasped and raised overhead, back arched | _{{fill in}}_ |
| 01 | startup | highest wind-up: clasped fists behind the head, knees tucked | _{{fill in}}_ |
| 02 | ACTIVE | SMASH: clasped fists swung down-forward in front of the body, below chest height | _{{fill in}}_ |
| 03 | ACTIVE | follow-through, fists at their lowest | _{{fill in}}_ |
| 04 | recovery | recover, arms rising | _{{fill in}}_ |
| 05 | recovery | neutral air pose | _{{fill in}}_ |

## guard

**blocking, forearms crossed in front of the face (loop)**  
2 frames · loops · body height 198 px · **CORE** · step 6 · default ms 300, 300

Holding guard.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | forearms crossed in front of the face, knees bent, chin tucked, eyes visible over the arms | _{{fill in}}_ |
| 01 | loop | 1 px breathing variation | _{{fill in}}_ |

## block

**blocking while being pushed back, eyes shut**  
2 frames · plays once · body height 204 px · optional · step 9 · default ms 60, 80

Blockstun.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | impact: pushed back, torso leaning back, eyes shut, arms still crossed, rear foot sliding | _{{fill in}}_ |
| 01 | - | recovering into guard | _{{fill in}}_ |

## hurtHigh

**hit in the face: head snapped back, arms flung back**  
3 frames · plays once · body height 195 px · **CORE** · step 6 · default ms 70, 90, 100

Hitstun from high hits.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | impact: head snapped back, chin up, eyes squeezed/shocked, arms flung back | _{{fill in}}_ |
| 01 | - | deepest recoil, torso arched back | _{{fill in}}_ |
| 02 | - | recovering, head coming forward | _{{fill in}}_ |

## hurtLow

**hit in the stomach: doubled over**  
3 frames · plays once · body height 183 px · optional · step 9 · default ms 70, 90, 100

Hitstun from low hits.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | impact to the stomach: doubled over, mouth open, hands toward the stomach | _{{fill in}}_ |
| 01 | - | deepest fold | _{{fill in}}_ |
| 02 | - | recovering upright | _{{fill in}}_ |

## launched

**knocked flying backwards, body arched back, limbs flailing (loop)**  
2 frames · loops · body height 136 px · **CORE** · step 6 · default ms 70, 70

Airborne knockback. The body travels toward screen-LEFT (backwards) in its own frame. Arch the body **diagonally**, not fully horizontal, so it fits the 256 px cell.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | flying backwards: body arched back diagonally, head trailing up-left toward screen-left, limbs flailing forward | _{{fill in}}_ |
| 01 | loop | limb/hair variation | _{{fill in}}_ |

## spin

**tumbling head over heels through the air (one full backward rotation, loop)**  
4 frames · loops · body height 160 px · optional · step 9 · default ms 60, 60, 60, 60

Big-hit tumble.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | tucked, tilted back ~30 deg | _{{fill in}}_ |
| 01 | loop | rotated to horizontal (head toward screen-left) | _{{fill in}}_ |
| 02 | loop | upside down | _{{fill in}}_ |
| 03 | loop | rotated 270 deg (head toward screen-right), loops into 00 | _{{fill in}}_ |

## airRecover

**backflip recovery in mid-air**  
3 frames · plays once · body height 180 px · optional · step 9 · default ms 50, 50, 60

Air recovery after being launched.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | tucked backflip start | _{{fill in}}_ |
| 01 | - | upside-down tuck | _{{fill in}}_ |
| 02 | - | upright, arms out, legs ready to land | _{{fill in}}_ |

## down

**hitting the ground, then lying flat on the back**  
2 frames · plays once · body height 96 px · **CORE** · step 6 · default ms 80, 420

Knockdown. Head toward screen-LEFT, feet toward screen-right; lying flat the body is about 210 px long (keep it inside x 4..251). Lying rule ([SPEC.md](../../SPEC.md#lying-poses), ADR 0020): seen side-on from the 12 degree spec camera, never from above; on 01 the back of the head, the back, the hips, the backs of the legs and the heels rest on y 240 (the packer's ground check must report nothing for it).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | back slams the ground: arms and legs bounce up | _{{fill in}}_ |
| 01 | - | lying flat on the back, head toward screen-left, limbs relaxed | _{{fill in}}_ |

## getup

**kip-up from lying on the back to standing**  
5 frames · plays once · body height 204 px · **CORE** · step 6 · default ms 70, 60, 60, 80, 70

Wake-up.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | lying on the back, knees pulled to the chest, hands by the head | _{{fill in}}_ |
| 01 | - | legs kicked up and forward | _{{fill in}}_ |
| 02 | - | kip-up spring: body airborne, rotating upright | _{{fill in}}_ |
| 03 | - | landing crouch | _{{fill in}}_ |
| 04 | - | fighting stance | _{{fill in}}_ |

## charge

**powering up: wide stance, fists clenched at the sides, shouting upward (loop)**  
4 frames · loops · body height 198 px · **CORE** · step 7 · default ms 50, 50, 50, 50

Ki charge. Do NOT draw the aura: the engine adds aura flames and streaks.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | wide stance, fists clenched at the sides, head tilted up shouting, hair/cloth blown upward | _{{fill in}}_ |
| 01 | loop | 1 px shake left, cloth variation | _{{fill in}}_ |
| 02 | loop | like 00 with a hair flicker | _{{fill in}}_ |
| 03 | loop | 1 px shake right | _{{fill in}}_ |

## throw

**throwing a projectile in mid-air: arm cocked back, whipped forward, follow-through**  
4 frames · phases 1/1/2 (startup/active/recovery) · plays once · body height 201 px · optional · step 9 · default ms 50, 60, 70, 50

Air projectile (shuriken / fireball). The projectile spawns from the hand on the active frame; draw the hand where the projectile leaves.

Strike point: **throwing hand (release point)**. Contact zone on active frames: **hand around x 186-212, y 116-142** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | arm cocked back behind the head (a small held weapon may be drawn in the hand) | _{{fill in}}_ |
| 01 | ACTIVE | arm whipped forward HORIZONTALLY, hand open at the release point | _{{fill in}}_ |
| 02 | recovery | follow-through: arm across the body | _{{fill in}}_ |
| 03 | recovery | neutral air pose | _{{fill in}}_ |

## beamCharge

**charging a beam: both hands cupped together at the rear hip, shouting (loop)**  
3 frames · loops · body height 198 px · **CORE** · step 7 · default ms 50, 50, 50

Ultimate wind-up. No energy in the sprite: the engine draws the glow.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | both hands cupped together at the rear hip (screen-left side of the body), knees bent, shouting | _{{fill in}}_ |
| 01 | loop | 1 px shake variation | _{{fill in}}_ |
| 02 | loop | hair/cloth flicker variation | _{{fill in}}_ |

## beamFire

**firing a beam: both arms thrust straight forward, palms open, shouting (loop)**  
3 frames · loops · body height 198 px · **CORE** · step 7 · default ms 50, 50, 50

Ultimate beam. The beam starts at the palms; no beam in the sprite.

Strike point: **both palms (beam origin)**. Contact zone on active frames: **palms around x 222-238, y 112-132** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | both arms thrust straight forward HORIZONTALLY, palms open together facing screen-right, wide braced stance | _{{fill in}}_ |
| 01 | loop | recoil shake 1 px | _{{fill in}}_ |
| 02 | loop | hair/cloth variation | _{{fill in}}_ |

## vanish

**crouch and blur before teleporting**  
2 frames · plays once · body height 221 px · optional · step 9 · default ms 50, 50

Vanish teleport. Draw the "blur" as a solid stretched pose, not motion blur.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | quick crouch (squash) | _{{fill in}}_ |
| 01 | - | stretched tall upward, toes pointed (stretch; tallest frame) | _{{fill in}}_ |

## stagger

**dizzy stagger (loop)**  
4 frames · loops · body height 207 px · optional · step 9 · default ms 150, 150, 150, 150

Dizzy state.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | wobbly knees, leaning left, arms dangling, unfocused eyes | _{{fill in}}_ |
| 01 | loop | center | _{{fill in}}_ |
| 02 | loop | leaning right | _{{fill in}}_ |
| 03 | loop | center | _{{fill in}}_ |

## ko

**knocked out, lying flat on the back**  
1 frame · plays once · body height 64 px · optional · step 9 · default ms 500

KO pose. Same orientation and length as down 01 (about 210 px long, head toward screen-left). Same lying rule as `down` 01: side-on, head, back, hips, legs and heels on y 240, at most body height x 1.15 tall.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | lying flat on the back, limbs loose, eyes closed, head toward screen-left | _{{fill in}}_ |

## special

**signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover**  
8 frames · phases 3/3/2 (startup/active/recovery) · plays once · body height 204 px · **CORE** · step 7 · default ms 120, 120, 120, 120, 120, 160, 110, 70

Signature rush (Rasengan / Chidori / ...). Draw the HAND that holds the technique, not the energy: the engine draws the orb/lightning at the hand anchor (see SPEC "Effect anchor points").

Strike point: **technique hand**. Contact zone on active frames: **thrust hand around x 194-222, y 128-158** (frame-local px, 256 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | plant wide, hands start forming the technique (character-specific hand position) | _{{fill in}}_ |
| 01 | startup | technique growing, shouting | _{{fill in}}_ |
| 02 | startup | technique fully formed, last frame before the rush | _{{fill in}}_ |
| 03 | ACTIVE | RUN holding it (run contact pose), technique hand forward or trailing per character | _{{fill in}}_ |
| 04 | ACTIVE | RUN passing pose, still holding | _{{fill in}}_ |
| 05 | ACTIVE | THRUST: technique arm fully extended HORIZONTALLY toward screen-right at chest height (the hit frame) | _{{fill in}}_ |
| 06 | recovery | follow-through | _{{fill in}}_ |
| 07 | recovery | recover to stance | _{{fill in}}_ |

## intro

**pre-fight intro pose (character-specific attitude, loop)**  
4 frames · loops · body height 210 px · optional · step 9 · default ms 150, 150, 150, 150

Match intro.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | signature pre-fight attitude pose | _{{fill in}}_ |
| 01 | loop | breathing / cloth flutter variation | _{{fill in}}_ |
| 02 | loop | like 00 with hair variation | _{{fill in}}_ |
| 03 | loop | breathing variation, loops into 00 | _{{fill in}}_ |

## taunt

**confident taunt / pointing at the opponent (loop)**  
2 frames · loops · body height 212 px · optional · step 9 · default ms 250, 250

Taunt.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | signature taunt pose | _{{fill in}}_ |
| 01 | loop | small variation (1-2 px, cloth/hair) | _{{fill in}}_ |

## win

**victory pose (loop)**  
4 frames · loops · body height 212 px · **CORE** · step 8 · default ms 200, 200, 200, 200

Round/match win.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | signature victory pose | _{{fill in}}_ |
| 01 | loop | variation (cloth/hair, small body motion) | _{{fill in}}_ |
| 02 | loop | like 00 with hair variation | _{{fill in}}_ |
| 03 | loop | variation, loops into 00 | _{{fill in}}_ |

## specialForward

**kit: the forward special's strike or cast (Special + forward)**  
7 frames · body height 204 px · optional (kit) · step 9 · phases 2/2/3 · default ms 50, 50, 60, 80, 70, 60, 50

Only if the kit maps a move to `specialForward` (ADR 0009). The active frames carry the hit box.

{{NAME}} flavor for the whole animation: _{{fill in: which technique, where it hits or where the effect spawns}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | wind-up | _{{fill in}}_ |
| 01 | startup | wind-up peak | _{{fill in}}_ |
| 02 | active | strike / release, arm fully extended | _{{fill in}}_ |
| 03 | active | contact held | _{{fill in}}_ |
| 04 | recovery | follow-through | _{{fill in}}_ |
| 05 | recovery | settling | _{{fill in}}_ |
| 06 | recovery | back toward idle | _{{fill in}}_ |

## specialUp

**kit: a rising special (Special + up)**  
6 frames · body height 214 px · optional (kit) · step 9 · phases 2/2/2 · default ms 50, 50, 60, 60, 70, 70

Only if the kit maps a move to `specialUp`. For a leap into a dive, draw the last frame so it flows into `airHeavy` frame 00.

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | crouch | _{{fill in}}_ |
| 01 | startup | push-off | _{{fill in}}_ |
| 02 | active | rising, body stretched upward | _{{fill in}}_ |
| 03 | active | rising, peak energy | _{{fill in}}_ |
| 04 | recovery | top of the arc | _{{fill in}}_ |
| 05 | recovery | turning over toward the next move | _{{fill in}}_ |

## specialDown

**kit: a stance or power-up, no hit box (Special + down)**  
4 frames · body height 204 px · optional (kit) · step 9 · phases 2/1/1 · default ms 80, 80, 160, 90

Only if the kit maps a move to `specialDown` (a mode activation, a counter stance). The packer writes no hit box for it.

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | gathering | _{{fill in}}_ |
| 01 | startup | gathering peak | _{{fill in}}_ |
| 02 | active | the stance / power-up pose (held longest) | _{{fill in}}_ |
| 03 | recovery | back toward idle | _{{fill in}}_ |

## superPose

**kit: the second super's pose during the super flash (loop)**  
4 frames · loops · body height 208 px · optional (kit) · step 9 · default ms 140, 140, 140, 140

Only if the kit has a second super (SUPER button). Shown during the freeze before the super plays out.

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | signature super pose | _{{fill in}}_ |
| 01 | loop | aura / cloth / hair variation | _{{fill in}}_ |
| 02 | loop | like 00, stronger energy | _{{fill in}}_ |
| 03 | loop | variation, loops into 00 | _{{fill in}}_ |

## beamStruggle

**beam clash struggle: braced, pushing the energy technique into the other side's (loop)**  
3 frames · loops · body height 198 px · optional (struggle, [ADR 0034](../../../docs/decisions/0034-beam-clash-visuals.md)) · step 9 · default ms 70, 70, 70

Only if the kit has an energy move (a shot with `clash: 'beam'` or a rush with `clash: 'rush'` in `src/game/moves.js`).
Held for the whole beam clash (about 4 s), so it must read as effort against a push. The technique hand stays on one
point (the stream origin, recorded as `hand` on every frame, within about 6 px across the loop); the engine draws the
technique itself (orb, lightning, fire), so draw the hand empty in the gesture that holds it. Missing → `beamFire`.
Brief and per-fighter poses: [BEAM_STRUGGLE_BRIEF.md](../BEAM_STRUGGLE_BRIEF.md).

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | braced push: front knee bent, back leg straight and driving, torso leaning in, technique hand forward at the stream origin | _{{fill in}}_ |
| 01 | loop | strain: shoved back a few px at the hips and shoulders, the hand held on its point, teeth gritted | _{{fill in}}_ |
| 02 | loop | surge: leaning further in, hair and clothes whipped back harder; loops into 00 | _{{fill in}}_ |

## beamStruggleAir

**beam clash struggle from the air: hovering, driving the technique down-forward (loop)**
3 frames · loops · body height 190 px · optional (struggle, ADR 0034) · step 9 · default ms 70, 70, 70

Only if the kit has an air energy shot (an air special whose projectile has `clash: 'beam'`). The fighter hovers low,
about one body height up, above an opponent standing in front of them, for the whole clash. Legs tucked under the body
(never standing on an invisible floor), the technique hand driven down-forward at the `hand` point, kept within about 6 px
across the loop. Draw the hand empty in its gesture. Missing → the `throw` release frame, held.

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | hovering, knees drawn up, torso leaning toward the target, technique hand driven down-forward | _{{fill in}}_ |
| 01 | loop | strain: shoulders and hips 3-5 px back and up, the hand held on its point, teeth gritted | _{{fill in}}_ |
| 02 | loop | surge: leaning into it harder, hair and clothes streaming back and up; loops into 00 | _{{fill in}}_ |

## techGround

**ground tech in place: impact brace, push up, back in the stance**
4 frames · plays once (on the tech's clock: beats 4 / 10 / 4 game frames) · body height 204 px (the stance) · optional · step 9 · default ms 67, 83, 83, 67

A timed tech on the floor with the stick neutral (ADR 0028): the fighter beats the impact and stands up on the spot,
invulnerable through 01-02. Lowest pixels on y 240 in every frame. 03 hands over to `idle` f0 without a pop. Never a
lying pose. Scale: the idle's anatomy, the brace folded, not shrunk or stretched (packer band 0.45-0.85 of the idle's
height for 00).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details}}_

| # | beat | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | contact | impact brace: feet planted wide, the near palm slapped flat on the floor in front, knees deeply bent, torso low, head up looking right | _{{fill in}}_ |
| 01 | rise | palm leaving the floor, legs driving up, half crouch, guard hands rising | _{{fill in}}_ |
| 02 | rise | nearly upright, knees slightly bent, guard up | _{{fill in}}_ |
| 03 | settle | the fighting stance, the same as idle f0 | _{{fill in}}_ |

## techRoll

**ground tech roll: shoulder contact, one forward roll, low crouch**
6 frames · plays once (beats 3 / 15 / 4 game frames, 3 / 15 / 2 for the hold-Guard roll) · body height 162 px (the crouch) · optional · step 9 · default ms 50, 63, 62, 63, 62, 67

A tech roll (a timed tech with the stick left or right, or landing from a launch while holding Guard): the fighter rolls
along the floor, invulnerable through the tumble. Drawn as a FORWARD roll toward screen-right; the game plays 01-04
backward for a roll away from the opponent, so they are four even quarter turns. Every frame touches y 240 (rolling, not
airborne). The contact and the tumble are a tight ball about half the standing height (packer band 0.30-0.68 of the
idle's height for 00-04), the same head and limb lengths as the idle, folded. 05 hands over to `idle`.

{{NAME}} flavor for the whole animation: _{{fill in}}_

| # | beat | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | contact | hits the floor on the back of the near shoulder, chin tucked, knees pulled to the chest, near hand slapping the floor | _{{fill in}}_ |
| 01 | tumble | hips rolling over the shoulders, a quarter turn on from 00 | _{{fill in}}_ |
| 02 | tumble | upside down on the upper back, legs tucked over | _{{fill in}}_ |
| 03 | tumble | rolling over onto the hips and feet | _{{fill in}}_ |
| 04 | tumble | coming up onto both feet, still tucked | _{{fill in}}_ |
| 05 | settle | low crouch on both feet facing right, guard up, ready to stand | _{{fill in}}_ |

## wallTech

**wall tech: feet-first on the wall, push off, airborne recovery**
5 frames · plays once (beats 6 / 4 / 8 game frames) · body height 209 px (the airborne recovery) · optional · step 9 · default ms 50, 50, 67, 67, 66

A timed tech against the ring barrier: the fighter clings to it for 6 frames, kicks off away from it and falls free.
The wall is NOT drawn: it is implied at the cell's LEFT, behind the fighter. 00-02 are wall-anchored by the packer: their
leftmost opaque pixel goes on x 8, the cell's left edge (the game puts that line on the barrier), so the push-off can
reach across the whole cell. The soles flat on the wall (and optionally the near hand) are the leftmost part of the
figure; hair and cloth trail up or to the right, never past the soles. 03-04 are ordinary airborne poses; 04 hands over
to `jumpFall` f0. The wall jump (↑ at the kick) shows 00-01, 02 for 4 frames, then `jumpUp`.

{{NAME}} flavor for the whole animation: _{{fill in}}_

| # | beat | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | cling | lands feet-first on the wall: both soles flat on it, knees to the chest, torso tilted out from the wall, near hand on the wall, head turned right | _{{fill in}}_ |
| 01 | cling | the same cling, coiled tighter, eyes on the opponent | _{{fill in}}_ |
| 02 | push-off | legs fully extended, toes just leaving the wall, body launched up and to the right, arms swept back | _{{fill in}}_ |
| 03 | recovery | uncurling in mid-air, knees tucking under, arms opening | _{{fill in}}_ |
| 04 | recovery | falling pose like `jumpFall` f0: legs extending down, arms out | _{{fill in}}_ |

## Attack alts

Optional alternate strips of the nine attacks and both hit reactions ([ADR 0031](../../../docs/decisions/0031-attack-alt-animations.md),
[SPEC.md "Attack alts"](../../SPEC.md#attack-alts)). The game alternates each base with its alt in a fixed, balanced
pattern (never the same version three times in a row), on the base move's timing, and keeps the base while the alt is
missing. Melee hits use the art's hit boxes, so the contract is a gameplay rule:

- the base's **frame count and phases** (the index above);
- the **same strike height and reach**: the active frames hit in the base's contact zone (the packer warns beyond 12 px of
  reach or 16 px of height). `light3Alt` stays a low; `heavyAlt` launches upward; `light4Alt` and `airLight3Alt` send
  the opponent forward; `airHeavyAlt` spikes downward. A hit reaction alt keeps the height it was hit at;
- the first frame leaves from the base's first pose and the last returns to its recovery pose, so any mix of base and
  alt in a string blends (air alts start and end in the air base pose);
- a **clearly different technique** (another limb or motion), not a re-pose of the same strike;
- the same anatomy at the idle's scale.

| alt | base (keep its timing) | {{NAME}} alt technique |
|---|---|---|
| light1Alt | jab | _{{fill in: e.g. a short hook or a backfist at the jab's height}}_ |
| light2Alt | rear straight | _{{fill in: e.g. a front snap kick to the midsection, the foot at the fist's reach}}_ |
| light3Alt | front kick (LOW) | _{{fill in: e.g. a low sweep at shin height}}_ |
| light4Alt | spinning roundhouse finisher | _{{fill in: e.g. a stepping double-palm shove at chest height}}_ |
| heavyAlt | rising uppercut launcher | _{{fill in: e.g. a rising flip kick from the floor to above the head}}_ |
| airLight1Alt | air jab | _{{fill in: e.g. an air backfist}}_ |
| airLight2Alt | air front kick | _{{fill in: e.g. an air knee}}_ |
| airLight3Alt | air spinning kick | _{{fill in: e.g. an air roundhouse (forward launch)}}_ |
| airHeavyAlt | double-fist hammer spike | _{{fill in: e.g. an axe kick, the heel chopping down-forward}}_ |
| hurtHighAlt | hit in the face | _{{fill in: e.g. head and shoulders snapped sideways, torso twisting away}}_ |
| hurtLowAlt | hit in the stomach | _{{fill in: e.g. struck in the ribs, folding sideways, one arm clutching}}_ |

Each alt gets its own section right after its base's, in this format (the example is `light1Alt`):

> ## light1Alt
>
> **alternate of light1: {{technique}}**
> 7 frames · phases 2/2/3 (startup/active/recovery, the same as light1) · plays once · body height = light1's · optional ·
> step 9 · default ms = light1's
>
> Plays instead of `light1` on every other use or so (the same move data). Strike point: **{{limb}}**. Contact zone on
> active frames: **light1's, x 206-226, y 64-86** (frame-local px, 256 cell, facing right).
>
> | # | phase | {{NAME}} pose |
> |---|---|---|
> | 00 | startup | leaves from light1 f00's pose, then {{...}} |
> | 01 | startup | _{{fill in}}_ |
> | 02 | ACTIVE | {{limb}} fully out in light1's contact zone, the forward-most pixel |
> | 03 | ACTIVE | _{{fill in}}_ |
> | 04 | recovery | _{{fill in}}_ |
> | 05 | recovery | _{{fill in}}_ |
> | 06 | recovery | back in light1 f06's recovery pose (close to idle 00) |

## Directional normals

Optional, ADR 0042 and art/SPEC.md "Directional normals": the Smash-style moves the stick picks. Until this fighter has
a strip, the move plays its fallback (`fTilt` → `light2`; `uTilt`, `uSmash`, `uair` → `heavy`; `dTilt`, `dSmash` →
`light3`; `dashAttack`, `fSmash` → `light4`; `fair` → `airLight2`; `bair` → `airLight3` mirrored). Draw each strike
where the move hits: forward tilt and forward smash at the chest, down tilt and down smash at the shins (down smash on
both sides), up tilt and up smash in an arc from in front of the face to over the head, up air over the head, forward
air in front, back air BEHIND the body (toward screen-left while facing right). `fSmash` frame 01 is the charge pose
the game holds while Heavy is held.

| Animation | What this fighter does |
|---|---|
| fTilt | _{{fill in: e.g. a stepping straight punch or a side kick at chest height}}_ |
| uTilt | _{{fill in: e.g. an overhead arc of the arm or a kick swung up and over}}_ |
| dTilt | _{{fill in: e.g. a crouching shin sweep or a low jab}}_ |
| dashAttack | _{{fill in: e.g. a flying kick off the run}}_ |
| fSmash | _{{fill in: e.g. a wound-up haymaker or a spinning heel kick}}_ |
| uSmash | _{{fill in: e.g. a flipping kick or a rising double fist}}_ |
| dSmash | _{{fill in: e.g. a spinning leg sweep hitting both sides}}_ |
| fair | _{{fill in: e.g. a mid-air flying kick or an overhead swing}}_ |
| bair | _{{fill in: e.g. a mid-air back kick behind the body}}_ |
| uair | _{{fill in: e.g. a mid-air flip kick straight up}}_ |
