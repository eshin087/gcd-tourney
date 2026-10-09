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

**Files**: raw strip `raw/<anim>.png` (poses left to right on #FF00FF) or single frames
`raw/<anim>_NN.png`. Cleaned frames end up in `frames/<anim>/<anim>_NN.png` (NN = 00, 01, ...).

## Index

| anim | frames | phases | loop | body height px | core | step |
|---|---|---|---|---|---|---|
| [idle](#idle) | 8 | - | yes | 135 | **yes** | 3 |
| [run](#run) | 8 | - | yes | 135 | **yes** | 4 |
| [dash](#dash) | 2 | - | yes | 111 | **yes** | 8 |
| [backDash](#backdash) | 3 | - | - | 137 | - | 9 |
| [superDash](#superdash) | 2 | - | yes | 70 | - | 9 |
| [jumpSquat](#jumpsquat) | 1 | - | - | 107 | - | 9 |
| [jumpUp](#jumpup) | 2 | - | yes | 131 | **yes** | 8 |
| [jumpFall](#jumpfall) | 2 | - | yes | 138 | **yes** | 8 |
| [land](#land) | 2 | - | - | 115 | **yes** | 8 |
| [light1](#light1) | 7 | 2/2/3 | - | 135 | **yes** | 5 |
| [light2](#light2) | 7 | 2/2/3 | - | 135 | **yes** | 5 |
| [light3](#light3) | 7 | 2/2/3 | - | 142 | **yes** | 5 |
| [light4](#light4) | 8 | 3/2/3 | - | 137 | **yes** | 5 |
| [heavy](#heavy) | 8 | 3/2/3 | - | 144 | **yes** | 5 |
| [airLight1](#airlight1) | 5 | 1/2/2 | - | 131 | **yes** | 5 |
| [airLight2](#airlight2) | 5 | 1/2/2 | - | 137 | - | 9 |
| [airLight3](#airlight3) | 6 | 2/2/2 | - | 133 | - | 9 |
| [airHeavy](#airheavy) | 6 | 2/2/2 | - | 131 | **yes** | 5 |
| [guard](#guard) | 2 | - | yes | 131 | **yes** | 6 |
| [block](#block) | 2 | - | - | 135 | - | 9 |
| [hurtHigh](#hurthigh) | 3 | - | - | 129 | **yes** | 6 |
| [hurtLow](#hurtlow) | 3 | - | - | 121 | - | 9 |
| [launched](#launched) | 2 | - | yes | 94 | **yes** | 6 |
| [spin](#spin) | 4 | - | yes | 123 | - | 9 |
| [airRecover](#airrecover) | 3 | - | - | 119 | - | 9 |
| [down](#down) | 2 | - | - | 68 | **yes** | 6 |
| [getup](#getup) | 5 | - | - | 135 | **yes** | 6 |
| [charge](#charge) | 4 | - | yes | 131 | **yes** | 7 |
| [throw](#throw) | 4 | 1/1/2 | - | 133 | - | 9 |
| [beamCharge](#beamcharge) | 3 | - | yes | 131 | **yes** | 7 |
| [beamFire](#beamfire) | 3 | - | yes | 131 | **yes** | 7 |
| [vanish](#vanish) | 2 | - | - | 146 | - | 9 |
| [stagger](#stagger) | 4 | - | yes | 137 | - | 9 |
| [ko](#ko) | 1 | - | - | 62 | - | 9 |
| [special](#special) | 8 | 3/3/2 | - | 135 | **yes** | 7 |
| [intro](#intro) | 4 | - | yes | 139 | - | 9 |
| [taunt](#taunt) | 2 | - | yes | 140 | - | 9 |
| [win](#win) | 4 | - | yes | 140 | **yes** | 8 |

## idle

**fighting stance, fists up, breathing bob (loop)**  
8 frames · loops · body height 135 px · **CORE** · step 3 · default ms 150, 150, 150, 150, 150, 150, 150, 150

Default standing state. Its bounding box is also the reference the packer uses to find the striking limb in attacks, so keep the lead fist compact (about x 125-135).

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
8 frames · loops · body height 135 px · **CORE** · step 4 · default ms 60, 60, 60, 60, 60, 60, 60, 60

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
2 frames · loops · body height 111 px · **CORE** · step 8 · default ms 60, 60

Forward dash along the ground.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | low forward burst: torso almost horizontal, rear leg extended pushing off, lead knee bent forward, arms trailing back, hair streaming back | _{{fill in}}_ |
| 01 | loop | same pose, legs slightly alternated and cloth/hair flap changed (2-frame shimmer loop) | _{{fill in}}_ |

## backDash

**quick hop backwards**  
3 frames · plays once · body height 137 px · optional · step 9 · default ms 60, 60, 80

Back dash (hop away from the opponent).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | push off the lead foot, torso leaning back, guard up | _{{fill in}}_ |
| 01 | - | airborne hop backward: knees tucked, body upright and tilted back, guard up | _{{fill in}}_ |
| 02 | - | landing on the toes, knees bent, guard up (ready to blend into idle) | _{{fill in}}_ |

## superDash

**flying horizontally like a missile, one fist thrust forward, legs trailing (loop)**  
2 frames · loops · body height 70 px · optional · step 9 · default ms 50, 50

Homing super dash. The whole body is horizontal, so the strip is short (bodyHeight 70).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | horizontal flight toward screen-right: body stretched flat, lead fist thrust forward at head level (forward-most point), other arm back along the body, legs together trailing | _{{fill in}}_ |
| 01 | loop | same pose, hair/cloth flap and a 1-2 px limb variation | _{{fill in}}_ |

## jumpSquat

**crouch right before jumping**  
1 frame · plays once · body height 107 px · optional · step 9 · default ms 70

Pre-jump frame.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | compressed crouch: knees deeply bent, torso leaned forward, arms swung back, about to spring | _{{fill in}}_ |

## jumpUp

**rising in the air, knees tucked, one arm up (loop)**  
2 frames · loops · body height 131 px · **CORE** · step 8 · default ms 80, 80

Rising part of a jump. Draw the pose only: the engine moves the sprite up.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | rising: knees tucked up, one arm raised up-forward, other arm back, hair/cloth trailing downward | _{{fill in}}_ |
| 01 | loop | same pose with a cloth/hair flap variation | _{{fill in}}_ |

## jumpFall

**falling, legs extending down, arms out for balance (loop)**  
2 frames · loops · body height 138 px · **CORE** · step 8 · default ms 80, 80

Falling part of a jump.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | falling: legs extending downward, arms spread out for balance, hair/cloth lifting up | _{{fill in}}_ |
| 01 | loop | same pose with a cloth/hair flap variation | _{{fill in}}_ |

## land

**landing crouch, then rising**  
2 frames · plays once · body height 115 px · **CORE** · step 8 · default ms 50, 70

Landing recovery.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | impact crouch: knees deeply bent, arms down/out for balance, hair still lifted | _{{fill in}}_ |
| 01 | - | rising halfway back toward the fighting stance, hair settling | _{{fill in}}_ |

## light1

**jab: wind-up, lead fist fully extended (2 frames), recover**  
7 frames · phases 2/2/3 (startup/active/recovery) · plays once · body height 135 px · **CORE** · step 5 · default ms 30, 30, 40, 50, 50, 50, 30

Auto-combo hit 1 (moves.js light1). Hits HIGH (face).

Strike point: **lead (far) fist**. Contact zone on active frames: **fist tip around x 150-162, y 70-84** (frame-local px, 192 cell, facing right).

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
7 frames · phases 2/2/3 (startup/active/recovery) · plays once · body height 135 px · **CORE** · step 5 · default ms 35, 30, 40, 50, 60, 50, 30

Auto-combo hit 2. Hits HIGH (face / upper chest).

Strike point: **rear (near) fist**. Contact zone on active frames: **fist tip around x 158-172, y 76-92** (frame-local px, 192 cell, facing right).

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
7 frames · phases 2/2/3 (startup/active/recovery) · plays once · body height 142 px · **CORE** · step 5 · default ms 40, 35, 45, 60, 60, 60, 30

Auto-combo hit 3 (moves.js marks it low: true). Hits LOW/MID (stomach).

Strike point: **near foot (sole/heel)**. Contact zone on active frames: **sole around x 166-184, y 110-128** (frame-local px, 192 cell, facing right).

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
8 frames · phases 3/2/3 (startup/active/recovery) · plays once · body height 137 px · **CORE** · step 5 · default ms 50, 45, 35, 40, 70, 70, 70, 40

Auto-combo finisher; wall-bounces. Also used by the vanish attack. Hits HIGH.

Strike point: **kicking foot**. Contact zone on active frames: **foot around x 170-186, y 64-88** (frame-local px, 192 cell, facing right).

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
8 frames · phases 3/2/3 (startup/active/recovery) · plays once · body height 144 px · **CORE** · step 5 · default ms 40, 35, 30, 50, 70, 70, 60, 30

Launcher (moves.js heavy). Frame 03 must connect at chin height in FRONT of the body; frame 04 is the follow-through overhead.

Strike point: **rear (near) fist**. Contact zone on active frames: **F03 fist around x 132-150, y 66-86; F04 fist overhead around x 118-136, y 36-52** (frame-local px, 192 cell, facing right).

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
5 frames · phases 1/2/2 (startup/active/recovery) · plays once · body height 131 px · **CORE** · step 5 · default ms 45, 35, 50, 50, 30

Air combo hit 1. Airborne: draw the pose only (lowest pixel is placed on y=180 by the packer).

Strike point: **lead fist**. Contact zone on active frames: **fist around x 150-166, chest height of the attacker** (frame-local px, 192 cell, facing right).

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
5 frames · phases 1/2/2 (startup/active/recovery) · plays once · body height 137 px · optional · step 9 · default ms 45, 40, 50, 50, 30

Air combo hit 2.

Strike point: **near foot**. Contact zone on active frames: **foot around x 164-184, hip height of the attacker** (frame-local px, 192 cell, facing right).

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
6 frames · phases 2/2/2 (startup/active/recovery) · plays once · body height 133 px · optional · step 9 · default ms 50, 40, 50, 70, 60, 30

Air combo ender; wall-bounces.

Strike point: **kicking heel**. Contact zone on active frames: **heel around x 166-186, chest/hip height** (frame-local px, 192 cell, facing right).

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
6 frames · phases 2/2/2 (startup/active/recovery) · plays once · body height 131 px · **CORE** · step 5 · default ms 50, 45, 45, 70, 70, 40

Air spike; ground-bounces the victim. The strike goes DOWN-FORWARD (the only non-horizontal strike).

Strike point: **both clasped fists**. Contact zone on active frames: **fists around x 140-166, y 120-150 (below the attacker's chest, in front)** (frame-local px, 192 cell, facing right).

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
2 frames · loops · body height 131 px · **CORE** · step 6 · default ms 300, 300

Holding guard.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | forearms crossed in front of the face, knees bent, chin tucked, eyes visible over the arms | _{{fill in}}_ |
| 01 | loop | 1 px breathing variation | _{{fill in}}_ |

## block

**blocking while being pushed back, eyes shut**  
2 frames · plays once · body height 135 px · optional · step 9 · default ms 60, 80

Blockstun.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | impact: pushed back, torso leaning back, eyes shut, arms still crossed, rear foot sliding | _{{fill in}}_ |
| 01 | - | recovering into guard | _{{fill in}}_ |

## hurtHigh

**hit in the face: head snapped back, arms flung back**  
3 frames · plays once · body height 129 px · **CORE** · step 6 · default ms 70, 90, 100

Hitstun from high hits.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | impact: head snapped back, chin up, eyes squeezed/shocked, arms flung back | _{{fill in}}_ |
| 01 | - | deepest recoil, torso arched back | _{{fill in}}_ |
| 02 | - | recovering, head coming forward | _{{fill in}}_ |

## hurtLow

**hit in the stomach: doubled over**  
3 frames · plays once · body height 121 px · optional · step 9 · default ms 70, 90, 100

Hitstun from low hits.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | impact to the stomach: doubled over, mouth open, hands toward the stomach | _{{fill in}}_ |
| 01 | - | deepest fold | _{{fill in}}_ |
| 02 | - | recovering upright | _{{fill in}}_ |

## launched

**knocked flying backwards, body arched back, limbs flailing (loop)**  
2 frames · loops · body height 94 px · **CORE** · step 6 · default ms 70, 70

Airborne knockback. The body travels toward screen-LEFT (backwards) in its own frame.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | flying backwards: body arched back, head trailing toward screen-left, limbs flailing forward | _{{fill in}}_ |
| 01 | loop | limb/hair variation | _{{fill in}}_ |

## spin

**tumbling head over heels through the air (one full backward rotation, loop)**  
4 frames · loops · body height 123 px · optional · step 9 · default ms 60, 60, 60, 60

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
3 frames · plays once · body height 119 px · optional · step 9 · default ms 50, 50, 60

Air recovery after being launched.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | tucked backflip start | _{{fill in}}_ |
| 01 | - | upside-down tuck | _{{fill in}}_ |
| 02 | - | upright, arms out, legs ready to land | _{{fill in}}_ |

## down

**hitting the ground, then lying flat on the back**  
2 frames · plays once · body height 68 px · **CORE** · step 6 · default ms 80, 420

Knockdown. Head toward screen-LEFT, feet toward screen-right.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | back slams the ground: arms and legs bounce up | _{{fill in}}_ |
| 01 | - | lying flat on the back, head toward screen-left, limbs relaxed | _{{fill in}}_ |

## getup

**kip-up from lying on the back to standing**  
5 frames · plays once · body height 135 px · **CORE** · step 6 · default ms 70, 60, 60, 80, 70

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
4 frames · loops · body height 131 px · **CORE** · step 7 · default ms 50, 50, 50, 50

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
4 frames · phases 1/1/2 (startup/active/recovery) · plays once · body height 133 px · optional · step 9 · default ms 50, 60, 70, 50

Air projectile (shuriken / fireball). The projectile spawns from the hand on the active frame; draw the hand where the projectile leaves.

Strike point: **throwing hand (release point)**. Contact zone on active frames: **hand around x 140-160, y 92-110** (frame-local px, 192 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | startup | arm cocked back behind the head (a small held weapon may be drawn in the hand) | _{{fill in}}_ |
| 01 | ACTIVE | arm whipped forward HORIZONTALLY, hand open at the release point | _{{fill in}}_ |
| 02 | recovery | follow-through: arm across the body | _{{fill in}}_ |
| 03 | recovery | neutral air pose | _{{fill in}}_ |

## beamCharge

**charging a beam: both hands cupped together at the rear hip, shouting (loop)**  
3 frames · loops · body height 131 px · **CORE** · step 7 · default ms 50, 50, 50

Ultimate wind-up. No energy in the sprite: the engine draws the glow.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | both hands cupped together at the rear hip (screen-left side of the body), knees bent, shouting | _{{fill in}}_ |
| 01 | loop | 1 px shake variation | _{{fill in}}_ |
| 02 | loop | hair/cloth flicker variation | _{{fill in}}_ |

## beamFire

**firing a beam: both arms thrust straight forward, palms open, shouting (loop)**  
3 frames · loops · body height 131 px · **CORE** · step 7 · default ms 50, 50, 50

Ultimate beam. The beam starts at the palms; no beam in the sprite.

Strike point: **both palms (beam origin)**. Contact zone on active frames: **palms around x 158-170, y 94-108** (frame-local px, 192 cell, facing right).

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | both arms thrust straight forward HORIZONTALLY, palms open together facing screen-right, wide braced stance | _{{fill in}}_ |
| 01 | loop | recoil shake 1 px | _{{fill in}}_ |
| 02 | loop | hair/cloth variation | _{{fill in}}_ |

## vanish

**crouch and blur before teleporting**  
2 frames · plays once · body height 146 px · optional · step 9 · default ms 50, 50

Vanish teleport. Draw the "blur" as a solid stretched pose, not motion blur.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | quick crouch (squash) | _{{fill in}}_ |
| 01 | - | stretched tall upward, toes pointed (stretch; tallest frame) | _{{fill in}}_ |

## stagger

**dizzy stagger (loop)**  
4 frames · loops · body height 137 px · optional · step 9 · default ms 150, 150, 150, 150

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
1 frame · plays once · body height 62 px · optional · step 9 · default ms 500

KO pose. Same orientation as down 01.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | - | lying flat on the back, limbs loose, eyes closed, head toward screen-left | _{{fill in}}_ |

## special

**signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover**  
8 frames · phases 3/3/2 (startup/active/recovery) · plays once · body height 135 px · **CORE** · step 7 · default ms 120, 120, 120, 120, 120, 160, 110, 70

Signature rush (Rasengan / Chidori / ...). Draw the HAND that holds the technique, not the energy: the engine draws the orb/lightning at the hand anchor (see SPEC "Effect anchor points").

Strike point: **technique hand**. Contact zone on active frames: **thrust hand around x 148-166, y 100-120** (frame-local px, 192 cell, facing right).

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
4 frames · loops · body height 139 px · optional · step 9 · default ms 150, 150, 150, 150

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
2 frames · loops · body height 140 px · optional · step 9 · default ms 250, 250

Taunt.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | signature taunt pose | _{{fill in}}_ |
| 01 | loop | small variation (1-2 px, cloth/hair) | _{{fill in}}_ |

## win

**victory pose (loop)**  
4 frames · loops · body height 140 px · **CORE** · step 8 · default ms 200, 200, 200, 200

Round/match win.

{{NAME}} flavor for the whole animation: _{{fill in: attitude, signature details, what differs from the generic move}}_

| # | phase | generic pose | {{NAME}} specifics |
|---|---|---|---|
| 00 | loop | signature victory pose | _{{fill in}}_ |
| 01 | loop | variation (cloth/hair, small body motion) | _{{fill in}}_ |
| 02 | loop | like 00 with hair variation | _{{fill in}}_ |
| 03 | loop | variation, loops into 00 | _{{fill in}}_ |

