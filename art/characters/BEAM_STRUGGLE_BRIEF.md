# Beam clash struggle brief (ART-BEAM-CLASH)

For Codex. One new optional strip per fighter with an energy move, plus five clash effects
([ADR 0034](../../docs/decisions/0034-beam-clash-visuals.md)). Today a beam clash freezes both fighters on their
`beamFire` release (or the rush frame) for about four seconds; the user wants poses that read as a **struggle** and look
like each character. As soon as a fighter's `beamStruggle` is packed, the clash plays it instead (the strip switches on by
itself). Contract: [SPEC.md](../SPEC.md) (`beamStruggle` row, "Strikes and contact zones", "Effect anchor points"); template
row: [_template/ANIMATIONS.md](_template/ANIMATIONS.md#beamstruggle). The effects are briefed in
[../vfx/EFFECTS.md "Beam clash"](../vfx/EFFECTS.md#beam-clash-adr-0034).

| strip | frames | loop | default ms | tallest frame |
|---|---|---|---|---|
| `beamStruggle` | 3 | yes | 70 each | a braced lunge: lower than the idle; set its `bodyHeight` from the drawn pose (see Rules) |

## What the engine does with it

- Both fighters hold `beamStruggle` for the whole clash; the struggle point (where the two techniques meet) slides
  between them as the rhythm chart goes. The engine draws the **technique** (Rasengan orb, lightning, fire, Red) at the
  frame's `hand` point and the stream from there to the struggle point. **Draw the hand empty**, in the gesture that holds
  the technique (like the approved `special` strips: the palm is empty, the engine draws the orb).
- `hand` = the technique point, measured on every frame and recorded in `hitboxes.json` (zone x 196-240, y 100-150;
  about (218, 125)). Keep it within about 6 px across the three frames, or the stream wobbles at the hand.
- No hit box (the clash decides the damage). No effects in the art: no aura, no lightning, no orb, no speed lines.

## The loop (every fighter)

| # | beat | generic pose |
|---|---|---|
| 00 | push | braced lunge toward screen-right: front knee bent, back leg straight and driving into the floor, torso leaning in, the technique hand forward at the stream origin |
| 01 | strain | shoved back: hips and shoulders 3-5 px further left, the hand held on its point, teeth gritted, eyes narrowed |
| 02 | surge | leaning in harder: shoulders 2-3 px further right than 00, hair, headband tails and clothes whipped back hardest; loops into 00 |

## Per fighter

The pose follows each fighter's 1-bar energy move (`src/game/moves.js`), like `beamCharge` / `beamFire` follow the kit.

| fighter | move in the clash | pose (facing right) | character note |
|---|---|---|---|
| Naruto | Rasengan (rush, held into the stream) | the iconic two-handed Rasengan push: the near (right) arm straight out at chest height, palm open and cupped toward screen-right as if holding a ball (the engine draws the orb there), the far hand gripping his right wrist to brace it | scrappy, loud: mouth open in a yell, whisker marks creased, headband tails and jacket hem flying back |
| Sasuke | Chidori Spear (ground) and Great Fireball (air) | the Chidori Spear thrust: the lead arm straight forward at chest height, fingers together and extended like a blade (the engine draws the lightning lance from the fingertips), the other hand gripping that forearm; low, wide stance | cold and controlled: Sharingan glare, mouth closed, the robe and rope belt dragged back by the force |
| Killua | Narukami | one arm straight forward, palm open and fingers splayed (the bolt leaves the palm), the other fist clenched at the hip; light on his feet even while braced | sharp, cat-like: narrow eyes, a hard grin, his spiky white hair streaming back |
| Gojo | Reversal: Red | right arm extended, index and middle fingers together pointing forward (the Red gesture; the engine draws the orb at the fingertips), the other hand in his pocket; a slight lean, not a lunge | the only one not straining: relaxed, smirking under the blindfold, coat flapping back. Keep the 01 "strain" small (a 1-2 px give) |
| Goku | Dragon Fist (rush, held into the stream) | a deep forward lunge with the near fist driven straight forward at shoulder height, the other arm pulled back at the hip | Super Saiyan intensity: teeth bared, brow furrowed, hair spikes swept back. **Only after his core art is approved and on main** |

Luffy has no energy move and draws no `beamStruggle`.

## Rules for this batch

- **One task worktree for the batch:** `npm run pr -- start art/beam-clash --art naruto,sasuke,killua,gojo,goku,vfx`
  from the main checkout once this contract is on main (never a copy, never `--full`). Reuse it for every later version.
  Claude alone merges it.
- **Order:** the VFX first (they show in every clash), then the strips one fighter at a time: Naruto, Sasuke, Killua,
  Gojo, then Goku when his core art is on main. One phone review page per round.
- **The approved title-style contract applies** (`art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`): the approved
  neutral and combat cells in `public/art-review/title-style-pilot/` are ground truth; one anatomical scale in every
  pose; head, torso, limb lengths and clothing volume preserved; a lunge is never fitted to a standing height. Reuse each
  fighter's identity and SCALE LOCK block from `art/characters/TECH_POSES_BRIEF.md` (Goku: his own references and
  CHARACTER.md). Attach the fighter's approved idle and approved `beamFire` as pose and scale references.
- **Versions:** `beamStruggle_v01` first. Up to 3 attempts per image (count unsaved failures), keep only the best,
  never overwrite, reuse or delete a version. Each candidate gets its REVIEW row (`needs review`), its manifest
  version (copy the entry from `animationDefaults` into `characters.<id>.animations`) and its tracker status.
- **bodyHeight:** start from the fighter's approved `beamFire` bodyHeight on main (Naruto 153, Sasuke 198, Killua 123,
  Gojo 215) only as a first guess; then adjust so the head, torso and limbs match the approved combat cell at native size.
  Never stretch the lunge to a standing height.
- **QA before review:** `npm run sprites <id>` (strict scale gate), the body sheet (`npm run body <id> beamStruggle`),
  the `hand` point on every frame, and the strip in the lab (`/lab.html`, scenario **Beam clash (energy vs energy)**,
  frame-stepped with `.`). The Astra anatomy audit of the quantized atlas runs before the user sees it. The user
  approves every image; an audit pass is not an approval.

## Suggested prompt (adapt per fighter)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. {{IDENTITY}} {{SCALE LOCK}}
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no ground shadow, no text, no labels, no effects (no aura, no lightning, no glowing orb, no fire, no speed lines). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "beamStruggle", a beam clash struggle: he is braced against an enormous force, pushing his technique forward against the opponent's, held for several seconds ({{CHARACTER NOTE}}). 3 poses, feet on one shared baseline, a seamless loop.
The technique hand: {{POSE}}. Draw the hand EMPTY in that gesture (the game adds the technique there) and keep it at the same spot in all three poses.
1. PUSH: braced lunge toward the right, front knee bent, back leg straight and driving into the floor, torso leaning in.
2. STRAIN: shoved back a little at the hips and shoulders, the hand still in place, teeth gritted, eyes narrowed.
3. SURGE: leaning in harder, hair and clothes whipped back hardest; flows back into pose 1.
```
