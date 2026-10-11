> Active full redraw: userapproved height_neutral v01 on2026-10-11. [PROPORTION_REDRAW](PROPORTION_REDRAW.md) and [shared baseline](../../scale/APPROVED_CAST_BASELINE.md) supersede historical build/height/head instructions below. KIT motion remains authoritative.

# Gojo (Jujutsu Kaisen, blindfold): character design brief

> **ART-SCALE-01 user correction:** preserve Gojo's original approved compact head and slender adult proportions (model v03, idle v02). The enlarged-head candidates are rejected. Use the original Gojo as the visual scale reference when reviewing the cast; retain character height differences and stable anatomy through animations. Never enlarge Gojo to satisfy the nominal 31px target. See [CHARACTER_SCALE.md](../../CHARACTER_SCALE.md).

## User direction — 2026-10-09, reaffirmed during ART-SCALE-01

The user rejected model v02 because its head was too large and selected the proportions in
`reference/model_sheet_v03.png` (their supplied image). Match that smaller head, narrow adult face,
long legs and slender silhouette. This visual direction overrides the approximate head-ratio wording
below; do not enlarge the head to satisfy a numeric ratio. Keep the manifest's game-cell dimensions,
bodyHeight values and pivot. Use this version provisionally throughout production without intermediate
approval stops; retain final review status and version history.

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (frame-by-frame poses),
> [MOVES_AND_VFX.md](MOVES_AND_VFX.md) (how each move looks in the engine) and
> [PROMPTS.md](PROMPTS.md) (copy-paste image prompts in generation order).
> Every number here follows **art spec v2**:
> [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md) and
> [art/SPEC.md](../../SPEC.md), plus the move-system contract of
> [ADR 0009](../../../docs/decisions/0009-move-system-v2.md) (four optional animations). If this file
> disagrees with them, **the ADRs / SPEC.md win**. Fix this file.
>
> **One deliberate exception (user decision):** Gojo is the tallest fighter. His standing body is
> about **215 px** in the 256 cell instead of the shared 200 px, so he has his own `bodyHeight` table
> ([ANIMATIONS.md](ANIMATIONS.md#summary)). His head keeps the original approved compact proportions: the extra
> height is in his legs and torso (about 7 heads instead of 6.5). Claude records this in the manifest
> and does the reach / lunge check (SPEC.md "Proportions and landmarks").

| | |
|---|---|
| Engine id | `gojo` (folder `art/characters/gojo/`, output `public/characters/gojo/`) |
| Engine definition | `src/characters/gojo.js` (read it for names, colors and stats; do not edit it for art). Its 3D placeholder model is chibi; that is expected until a separate restyle task (ADR 0007). Kit data: `SPECIAL_MOVES` / `SUPERS` in `src/game/moves.js`, behaviour in `src/game/kit.js` (ADR 0009). |
| Design | **Jujutsu Kaisen, blindfold look** (an adult of about 28): dark navy-black high-collar jujutsu-teacher uniform, a **black blindfold over his eyes in every body sprite** (user decision), spiky white hair pushed up by the blindfold, black shoes |
| HUD name / subtitle | `GOJO` / "The Strongest" |
| Neutral special (1 bar) | **LAPSE: BLUE**: a two-finger point; the engine opens a blue gravity vortex in front of him that drags the opponent in, then pops them up (`special`) |
| Forward special (1 bar) | **REVERSAL: RED**: a finger flick and recoil; the engine fires a red repulsion orb (wall bounce) (`specialForward`) |
| Up special (½ bar) | **BLINK**: a teleport above the opponent (`specialUp`, see MOVES_AND_VFX.md for the engine status) |
| Down / back special (½ bar) | **INFINITY**: a calm counter stance with an open palm raised; melee attackers freeze, projectiles stop (`specialDown`) |
| Air special (1 bar) | **REVERSAL: RED** in the air (`throw`) |
| Ultimate (3 bars) | **HOLLOW PURPLE**: hands apart (blue and red), then a palm thrust; the engine draws a wide purple beam (`beamCharge` → `beamFire`) |
| SUPER (3 bars) | **DOMAIN EXPANSION: UNLIMITED VOID**: the crossed-fingers hand sign, blindfold lifted, glowing blue eyes; the engine turns the stage into the void (`superPose`) |
| Passive | **Infinity**: non-beam projectiles stop and fade before touching him; no chip damage while blocking (engine only, no art) |
| Character color | `#7ac8ff` (HUD, afterimages, vanish ring, dash bursts) |
| Aura | outer `#73b8ff` (`aura [0.45, 0.72, 1.0]`), core `#e6f5ff` (`auraCore [0.9, 0.96, 1.0]`) |
| Beam colors | core `#ffffff`, mid `#b46cff`, edge `#6a2cd8` (width 1.85, wider than the others) |
| Stats | tall, strong, durable: speed 6.0, power 1.1, defense 1.05 |
| Legal | Fan art for a personal, non-commercial demo. A public or commercial release needs a license or an original redesign (see the root README). |

## One-paragraph look

Trait-only description (no names), used as `{{TRAITS}}` in shared prompts such as the title key art
(`art/ui/PROMPTS.md`) and as the fallback `CHARACTER:` line (§9):

> a very tall, slender, broad-shouldered man of about 28 with a relaxed, cocky confidence, drawn with
> serious adult anime proportions (about 7 heads tall, not chibi); spiky snow-white hair pushed straight
> up and slightly back by a wide black cloth blindfold that wraps around his head and completely covers
> his eyes and brows; pale skin, a sharp jaw, a straight nose and thin lips in a lazy smile; a dark
> navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin, a center
> zipper with a small silver pull, the hem just below his hips; matching loose dark trousers; black
> leather shoes; he often stands with his hands in his pockets

---

## 1. Who he is on screen

Effortless, amused and untouchable. Gojo never looks like he is trying. Where Naruto commits his whole
body and Sasuke is cold and exact, Gojo is **loose**: a relaxed slouch, hands in his pockets, a lazy
smile, and then a strike that is suddenly already there. He looks *down* at his opponents (he is the
tallest fighter) and keeps smiling while he wins. He almost never shouts; he names his techniques
calmly.

Motion language for every animation:

- **Economy with arrogance:** minimal anticipation (often just the hand leaving the pocket), a fast
  snap into the active pose, and the hands drift back into the pockets in recovery.
- **One hand is enough:** his techniques use the **R (near) hand**; the other hand often **stays in
  its pocket** (Blue, Red, Infinity, the Domain sign, super dash, jumps, the jab). He kicks
  `light3` with both hands still in his pockets.
- **Long reach:** about 7 heads tall, long arms and legs. He reaches the contact zones **without
  stepping in**; his weight stays back. Palm strikes (heel of the palm forward, fingers up), fast
  clean kicks, a rising elbow.
- **Realistic weight:** adult anatomy, no rubbery squash beyond the 1 to 2 px noted per frame.
- **Blindfold face:** the blindfold hides his eyes and brows, so every expression reads through the
  **mouth, jaw, cheeks and head tilt** (§5). Default: a lazy, one-sided smile.
- **The Six Eyes:** his bright blue eyes appear **only** in `superPose` and on the UI cut-in (the
  blindfold pushed up onto his forehead). Never in any other body sprite.

## 2. Identity checklist (the silhouette test)

If a frame is missing any of these, it is off-model. Check them in every strip.

1. **Hair:** snow-white, spiky, **pushed straight up and slightly back by the blindfold**: a dense
   crown of upward spikes above the band (tallest at the top-front, fanning back), short white hair
   at the nape and over the ears below the band, two or three thin strands falling over the front of
   the band. Never flat, never long, never grey-brown, never yellow. It adds about 18 px above the
   skull (never more than 20).
2. **Blindfold:** a wide **black** cloth band wrapped around his head at eye level, covering **both
   eyes and the brows completely**, from the top of the nose bridge up to the forehead (about 10 px
   tall at sprite scale). Neat overlapping wraps at the back, **no long hanging tails**. It is on in
   every body sprite except `superPose`.
3. **Face:** adult, handsome and sharp: long straight nose, angular jaw, a long chin, thin lips. Pale
   skin. No eyes visible (blindfold). No marks, no scars.
4. **Collar:** a **tall stand-up collar** zipped all the way up: it covers his whole neck and rises to
   just under his jaw and ears. Stiff; it never flutters.
5. **Jacket:** dark navy-black, long-sleeved, slightly loose; a **center zipper** from the collar top to
   the hem (a 1 px light line at sprite scale) with a small silver **zipper pull under the chin**; the
   hem hangs **just below the hips** (upper thigh) with short side slits; the sleeves end at the wrists.
   No buttons, no gold spiral button, no hood, no emblem.
6. **Trousers:** the same dark navy-black, loose and straight, down to the shoes.
7. **Shoes:** black leather shoes (closed, no sandals, no toes visible).
8. **Hands:** bare, large adult hands with long fingers.
9. **Pockets:** his hands go into the **trouser pockets** under the jacket hem (through the side
   slits); with the hands in, the elbows hang loosely out from his sides.
10. **Build:** about **7 heads tall**, the tallest fighter: very long legs (the crotch at half his
    height), long arms, broad shoulders on a slender, lean body, a small head on a long neck (hidden
    by the collar). Not chibi, not bulky, not western-realistic.

Off-model in any frame: visible eyes outside `superPose`, sunglasses instead of the blindfold, the
blindfold with long tails, hair falling flat over the forehead, a school uniform with a gold spiral
button, a hood, a white shirt, sandals, any energy drawn on the body, chibi proportions (a big head,
short legs), Gojo drawn the same height as a 6.5-head teenager.

## 3. Proportions and landmarks (final 256×256 cell)

Art spec v2 (ADR 0007): 256×256 cell, pivot `[128, 240]`, `pixelsPerUnit` 128, facing right, 3/4 view
(body turned about 35° toward the camera, head turned a bit more so the front of the blindfold and both
cheeks show, camera about 12° above). Full rules: [SPEC.md](../../SPEC.md).

- Preserve the original approved compact head and serious adult anime proportions.
  Match model v03 and idle v02; do not enlarge the head to force a nominal ratio. **Standing upright
  body (soles to top of skull, legs straight) about 215 px** (shared cast: 200 px). The crotch sits at
  about half the body height (y ~132 when standing straight).
- Hair adds about **18 px** above the skull (never more than 20), so standing straight his total
  height is about **233 px** (hair top at y ~7). **That is the most the cell allows** (the margin is
  y 4), so: **no pose may be taller than standing straight**, no hand, elbow or foot may rise above
  the top of his hair, and stretched poses (`vanish`, `specialUp`) stretch **thinner, not taller**.
- In the **idle stance** (knees bent about 20°, a relaxed slouch, hands in his pockets) the top of the
  skull sits at about y 36 and the hair top at about y 18, so the trimmed height including hair is
  about **222 px**, his idle `bodyHeight`.
- **Per-character `bodyHeight` table:** every animation is about 1.09× the shared v2 value (222 / 204),
  capped where his height would clip; the full table is in [ANIMATIONS.md](ANIMATIONS.md#summary).
  Claude copies it into his manifest rows. Preserve the approved idle head scale.
  Do not change bodyHeight or redraw the head merely to approach 31px; inspect animation drift against the approved reference.
- Keep every opaque pixel inside **x 4..251, y 4..240** (the cell margin). Lying and flying poses are
  long on him (about 224 to 230 px): bend a knee or an elbow rather than stretching every limb.

Idle stance landmarks, in final cell pixels (x from the left, y from the top; soles on y 240, body
center line x 128):

| landmark | y (px) | x (px) |
|---|---|---|
| top of hair (spike crown) | ~18 | spikes from ~x 104 (back) to ~x 160 (front) |
| top of skull | ~36 | |
| blindfold band (covers eyes and brows) | ~42 to 52 | wraps fully around the head; the front edge at ~x 160 |
| nose tip / mouth | ~57 / ~61 | |
| chin | ~67 | the collar top rises to ~y 63 beside the jaw |
| shoulders | ~77 | |
| chest | ~80 to 112 | zipper line down the center |
| stomach / waist | ~112 to 138 | |
| hips / crotch | ~140 | hands in the pockets at ~y 140 to 150; elbows out at ~x 102 (near) and ~x 152 (far) |
| jacket hem | ~152 to 160 | side slits at the hips |
| knees | ~190 | |
| soles (floor line) | 240 | front (L) toes ~x 174, back (R) heel ~x 84 |
| idle front edge | | the lead (L) knee and toes at ~x 174 to 178: nothing in idle reaches past ~x 180 |

**Hitting a shorter opponent.** The strike zones (ADR 0007) are measured on a same-size 200 px
opponent, and every current opponent is that size. On Gojo's taller body they land lower than on the
cast, which is why his strikes look slightly downward-aimed:

| zone (on the opponent) | y (px) | on Gojo's own body | used by (contact zone x, y) |
|---|---|---|---|
| HIGH (face) | 58 to 90 | his chin to upper chest | `light1` lead palm (206-226, 64-86), `light2` rear palm (214-236, 70-92), `light4` foot (224-248, 56-88), `heavy` f3 elbow (180-208, 58-86), then overhead f4 (160-188, 22-46) |
| MID (chest) | 92 to 124 | his chest to stomach | `airLight1` palm (206-230, 100-120), `airLight3` heel (222-248, 105-150) |
| LOW (stomach) | 122 to 152 | his waist to hips | `light3` sole (222-246, 122-148), `airLight2` foot (220-246, 130-155) |
| down-forward | | | `airHeavy` clasped hands (180-218, 160-206) |
| technique points | | | Red release fingertips ~(196, 124) (engine projectile spawn (192, 125)); Hollow Purple palm in (222-238, 112-132), beam origin (230, 122); details in MOVES_AND_VFX.md |

When Gojo is the one being hit, the opponents' HIGH strikes land around his collar and MID strikes on
his stomach. The packer's hurtbox follows his silhouette, so that needs no art change.

**Forward-most rule.** On active frames the striking palm, elbow or foot is the right-most part of the
silhouette. Hair spikes, the jacket hem and the free hand stay behind it (and behind about x 170, the
idle front edge minus 9 px, unless the frame is the strike).

## 4. Facing, near side, hands and pockets

- Sprites always face **right**. The engine mirrors them when he faces left.
- Facing right in a 3/4 view, his **right side is nearest the camera**. In every brief:
  - **R arm / R leg = near** (drawn in front of the body, fully visible).
  - **L arm / L leg = far** (partly behind the torso).
- **Stance:** L foot forward, R foot back (orthodox), weight mostly on the back (R) leg. Lead hand = L,
  rear hand = R.
- **Technique hand = R (near) hand** for every jutsu-like move, so it is never hidden behind his body:
  Blue (two-finger point), Red (finger flick), Infinity (raised open palm), the Domain sign, and the
  Hollow Purple palm thrust. In the Hollow Purple charge the hands are apart: **L (far) hand forward =
  blue**, **R (near) hand back = red**. Mirroring for left-facing play swaps handedness; accepted.
- **Pockets schedule** (both = both hands in the trouser pockets; L = the L hand stays in its pocket;
  R = the R hand stays in its pocket):

| hands | animations |
|---|---|
| both in pockets | `idle`, `dash`, `vanish`, `intro`, `taunt`, `light3` (the whole kick), the last frame of every attack and of `getup` |
| L in pocket | `special`, `specialForward`, `specialUp`, `specialDown`, `superPose`, `superDash`, `jumpSquat`, `jumpUp`, `jumpFall`, `land`, `throw`, `win` |
| R in pocket | `light1` (he jabs with the lead hand only) |
| both out | `run`, `backDash`, `light2`, `light4`, `heavy`, air attacks, `guard`, `block`, reactions, `charge`, `beamCharge`, `beamFire`, `getup`, `stagger` |

- With a hand in a pocket, the wrist disappears under the jacket hem at the hip and the elbow hangs
  loosely out from his side. Keep it the same shape in every frame.
- Mirroring flips nothing important (the zipper is centered). Accepted for the demo.

## 5. Face, blindfold and the Six Eyes

With the blindfold on, the brows and eyes are hidden. Expressions read through the mouth, jaw, cheeks
and head tilt; the band may crease 1 px where the brows move under it.

| expression | look | used in |
|---|---|---|
| **lazy smile** (default) | one mouth corner raised, lips closed, chin slightly up | idle, run, dash, jumps, land, getup, airRecover, intro, special startup, specialDown, charge |
| **focused** | mouth a calm flat line, jaw set, head level | normals (startup and active), special, specialForward startup, specialUp, throw, beamCharge, superDash, vanish, guard |
| **grin** | wide grin showing the upper teeth (`#ffffff`), cheeks raised | light4, heavy, airHeavy, taunt, win |
| **declaration** | mouth open, teeth and the `#5a1a22` interior visible (saying the technique's name) | specialForward release, throw release, beamFire |
| **pain** | teeth gritted, mouth twisted to one side, head turned away | hurtHigh, hurtLow, launched, spin, down, block |
| **slack** | mouth hanging open, head lolling | stagger, ko |
| **Six Eyes** | blindfold pushed up onto his forehead; both eyes open, bright glowing blue; white lashes and brows; calm, superior half-smile | `superPose` only, the UI cut-in, the expression sheet's last panel |

**Six Eyes** (eyes uncovered; only in `superPose`, `ui/cutin.png` and S2 panel 8):

- Full detail (UI art and the expression sheet): large almond eyes; a bright sky-blue iris `#5fe2ff`
  with a darker blue outer ring `#1f8ee8` and a thin deep rim `#0f3c8a`, pale ice-blue inner rings
  `#e2fbff` around a small dark pupil `#08080c`, one or two `#ffffff` catch-lights; whites `#f6f2f4`;
  **white eyelashes and brows** (hair ramp). The irises look luminous and crystalline.
- At sprite scale (each eye about 4 to 5 px tall): `#5fe2ff` iris with a `#1f8ee8` rim, a 1 px
  `#e2fbff` highlight and a 1 px dark pupil. The blue must read at a glance.
- With the blindfold pushed up, it sits across his **forehead** as a black band (y ~30 to 38 in an
  upright pose) and the white hair still stands up above it. Never draw it pulled down around his neck
  (the hair would have to fall flat).

## 6. Hair, blindfold, jacket and trouser motion

- **Hair crown** is spiky and stiff: it moves as one mass (1 to 2 px squash or stretch on impacts and
  landings); only the spike tips and the thin strands over the band flick 1 to 2 px:
  - moving forward (run, dash, superDash): tips swept back toward screen-left;
  - moving backward (backDash, hurt, launched, block): tips flick forward toward screen-right;
  - rising: dragged downward 1 px; falling: lifted 1 px; landing or impact: squash 1 to 2 px, settle
    the next frame;
  - aura (charge, beamCharge, superPose): tips stirred upward.
- **Blindfold** is a tight wrap: it never moves or flaps (no tails).
- **Jacket hem** (below the hips) is the clearest secondary motion: it flares and flaps 2 to 6 px,
  streams back when he runs or dashes, lifts when he falls, drags down when he rises, flares outward in
  spins and whips forward when he is hit. On kicks the side slits open around the kicking thigh; **the
  hem never covers or reaches past the striking foot** on active frames.
- **Collar** is stiff and never flutters. **Sleeves** ripple 1 to 2 px. **Trouser legs** ripple 1 to
  2 px at the ankles on fast moves.
- Lag rule: the hair tips and the jacket hem lag one frame behind the body.

## 7. Palette (29 colors, limit 48)

Several ramps are the exact hexes from `src/characters/gojo.js` (`model.palette`, `model.face`): skin,
hair, the uniform (`jacket`), the blindfold black (`band`), the zipper (`metal`), the Six Eyes and the
mouth. The ramps marked ✚ add tones for realistic form shading. Use **only** these colors in character
frames. ADR 0007 allows up to 48 (the packer warns above 64), so there are 19 spare slots: list any
color you add here first.

| # | material | highlight | light | base | shadow | deep / line | source |
|---|---|---|---|---|---|---|---|
| 1 | outline, pupils, darkest black (blindfold and shoe shadow) | | | | | `#08080c` | `band.shadow` |
| 2–6 | skin (face, ears, hands) | `#fff4ec` | | `#fbe2d2` | `#e2ae96` | `#cc9a84` (nose, ear, lip and knuckle lines), `#a06a58` ✚ (deep creases, nostrils, mouth corners) | `skin`, `face.skinLine` |
| 7–12 | white hair (also white lashes and brows, teeth) | `#ffffff` | `#f2f4fa` | `#dde2ee` ✚ | `#b4bccf` | `#8a93ac` ✚, `#5e6680` ✚ (inner spike lines, the darkest strands) | `hair` |
| 13–14 | black: blindfold, shoes, soles | `#2c2c3a` (cloth and leather sheen) | | `#16161e` | `#08080c` (= outline) | | `band`, `shoe` |
| 15–19 | navy-black uniform: jacket, collar, trousers | `#4a5478` ✚ (rim light on folds, sparing) | `#323858` | `#262b44` ✚ (mid plane) / `#1c2034` | `#0d0f1c` | | `jacket` |
| 20–22 | zipper and zipper pull | `#eef2fa` | | `#c8cede` | `#8890a6` | | `metal` |
| 23–27 | Six Eyes (superPose, S2 panel 8, UI only) | `#e2fbff` ✚ (inner rings, highlight) | `#5fe2ff` (iris) | `#1f8ee8` (outer iris) | `#0f3c8a` ✚ (rim) | `#f6f2f4` (eye whites) | `face.iris`, `face.irisDark`, `face.sclera` |
| 28–29 | mouth interior, tongue | | | `#5a1a22` | | `#a84a52` ✚ (tongue) | `face.mouth` |

Not used (placeholder only, do **not** add back): the separate `pants` ramp `#1a1d30` / `#0c0e1a` /
`#2e3352` (use the jacket ramp for the trousers), `shoe` `#141420` / `#08080e` / `#2a2a3c` and `sole`
`#2a2a34` / `#16161c` / `#40404c` (use the black ramp), `face.line #16121c` (use `#08080c`),
`face.symbol #3a3448`.

Material rules:

- **Outline:** 1 px `#08080c` on the outer silhouette. Inner lines use the darkest tone of the
  material (selective outline): `#5e6680` between hair spikes, `#0d0f1c` in the uniform folds,
  `#a06a58` / `#cc9a84` for the nose, ear, lips and knuckles.
- **Lighting:** key light from the upper-front-right (his front). Light tones on top and front
  surfaces (screen-right). Shadows on the back (screen-left), under the hair, the jaw, the collar and
  the arms. Realistic shading means more planes, not soft gradients.
- **White hair:** mostly `#f2f4fa` and `#dde2ee` with `#b4bccf` on the shadow side of each spike and
  `#8a93ac` / `#5e6680` in the deep gaps; `#ffffff` only on the lit tips. It must read **white**, not
  grey, not blue, not blond.
- **Uniform:** mostly `#1c2034` and `#262b44`, `#323858` on lit planes, `#0d0f1c` in the folds and
  under the arms, `#4a5478` only as thin rim highlights. It must read **dark navy**, clearly lighter
  and bluer than the black blindfold and shoes.
- **Blindfold and shoes:** `#16161e` with `#2c2c3a` on the lit upper edge; outline `#08080c`. Keep the
  blindfold pure black-grey, not navy, so it separates from the collar.
- **No** gradients, dithering, noise, glow, soft shadows or anti-aliasing. Hard pixels only.

Effect colors (**not** part of the body sprite palette; for VFX and UI art only):

| effect | colors |
|---|---|
| Lapse: Blue vortex (engine: `orb` tinted `#7ab8ff` + `glow` `#2a6aff`; move color `#4aa8ff`) | `#ffffff` core flash, `#c6ecff`, `#7ab8ff`, `#4aa8ff`, `#2a6aff`, `#0a1450` (dark vortex eye) |
| Reversal: Red orb (engine: `orb` tinted `#ff4050` + `glow` `#ff2038`, burst `#ff3048`; move color `#ff3a4a`) | `#fff0ec` core, `#ffb0a0`, `#ff4050`, `#ff2038`, `#c80e2a`, `#5a0614` (dark edge) |
| Hollow Purple beam (shader) | core `#ffffff`, mid `#b46cff`, edge `#6a2cd8`; dark rim `#2a0a6a` (UI art only) |
| Infinity (counter ring, projectile stop) | ring `#d8f2ff`, glow `#9fd8ff` |
| Blink, Domain, Six-Eyes glints | `#9fd8ff`, `#d8f2ff`, `#ffffff` |
| Unlimited Void (UI art only) | `#04040c` void, `#1a1640` deep indigo, `#5a4ad0` nebula, `#c8f4ff` stars, `#ffffff` |
| Cursed-energy aura (tinted white art) | outer `#73b8ff`, core `#e6f5ff` |
| Character color (dash bursts, vanish ring) | `#7ac8ff` |

## 8. Reference folder (`reference/`)

Codex files every generated reference image here with a `_vNN` version (ADR 0007). Versions are never
overwritten, reused or deleted; the highest number is the latest candidate. The approved version is
**copied** to the fixed name, which is what later prompts attach.

| file | what | from |
|---|---|---|
| `reference/model_sheet_vNN.png` | model-sheet candidates: turnaround (front, 3/4 right, true side profile, back), relaxed fighting stance with the hands in the pockets, palette swatches | PROMPTS.md S1 |
| `reference/model_sheet.png` | **copy** of the approved model-sheet version | Codex, after "approve gojo model_sheet vNN" |
| `reference/expressions_vNN.png` | expression-sheet candidates (7 blindfold heads + 1 with the Six Eyes revealed) | PROMPTS.md S2 |
| `reference/expressions.png` | **copy** of the approved expression sheet | Codex |
| `reference/idle_approved.png` | **copy** of the approved `raw/idle_vNN.png` strip (best pose and proportion anchor) | Codex, after A01 is approved |
| `reference/notes.md` (optional) | what was fixed between versions, which prompt tweak produced the keeper | Codex |
| `reference/_rejected/` | rejected reference versions (they keep their names) | Codex |
| `reference/source/` (optional, local only) | official pictures the user collects for their own comparison | user |

A rejected reference version is marked `rejected` in [art/REVIEW.md](../../REVIEW.md) and moved to
`reference/_rejected/` (SPEC.md "Files and naming"), so the highest version left in `reference/` is
always the current candidate. Official pictures in `reference/source/` are copyrighted: keep them
local, never commit them, and never upload them to an image generator (SPEC.md). Attach our own
approved model sheet instead.

## 9. Trait-only description (fallback wording)

If the image generator refuses or waters down a prompt that names the character, replace the
`CHARACTER:` line of the prompt with this block. Also drop "Gojo", "Satoru", "Jujutsu Kaisen",
"jujutsu", "Six Eyes", "Limitless", "Lapse", "Reversal", "Hollow Purple", "Infinity", "Domain
Expansion" and "Unlimited Void" from the prompt (table below). Never name the original artist or
studio.

> CHARACTER: an original character inspired by modern dark-fantasy shonen anime, fan-art sprite for a
> personal non-commercial game project: a very tall, slender, broad-shouldered man of about 28 with a
> relaxed, cocky confidence, drawn with serious adult anime proportions (about 7 heads tall, not chibi).
> Spiky snow-white hair pushed straight up and slightly back by a wide black cloth blindfold that wraps
> around his head and completely covers his eyes and brows, short white hair at the nape. Pale skin, a
> sharp jaw, a straight nose, thin lips in a lazy smile. A dark navy-black long-sleeved jacket with a
> tall stand-up collar zipped all the way up to his chin, a center zipper with a small silver pull
> under the chin, the hem just below his hips with short side slits. Matching loose dark navy-black
> trousers. Black leather shoes. He often keeps his hands in his trouser pockets.

Replacement terms:

| instead of | write |
|---|---|
| Satoru Gojo / Gojo | "the tall white-haired blindfolded man" (and keep the full trait list) |
| Jujutsu Kaisen / jujutsu-teacher uniform | "a modern dark-fantasy sorcerer anime" / "a dark navy high-collar teacher's uniform" |
| Six Eyes | "bright, glowing sky-blue crystalline eyes with white eyelashes" |
| Limitless / cursed technique / cursed energy | "his space-bending power" / "blue-white energy" |
| Lapse: Blue | "pointing two fingers forward to open a small swirling blue gravity vortex" (move: "blue pull") |
| Reversal: Red | "flicking a red repulsion orb from his fingertip, with recoil" (move: "red blast") |
| Hollow Purple | "a huge purple energy beam made by merging a blue orb and a red orb" |
| Infinity | "a calm raised open palm; an invisible barrier stops attacks just before they touch him" |
| Domain Expansion: Unlimited Void | "his ultimate hand sign (middle finger crossed over the index finger, raised in front of his chest), the blindfold pushed up, glowing blue eyes" (the effect: "a starry black void") |
| Blink | "a high-speed teleport" |
| "in the style of <artist>" | "modern 2020s shonen TV anime look: realistic adult proportions, sharp handsome face, bold clean line art, flat cel shading" |

## 10. Files in this folder

| path | what |
|---|---|
| `CHARACTER.md` | this brief |
| `ANIMATIONS.md` | every animation, frame by frame (poses, phases, contact zones, anchors), the 38 spec animations plus the 4 optional ADR 0009 ones, and Gojo's `bodyHeight` table |
| `MOVES_AND_VFX.md` | how each move plays in the engine, which VFX it uses, Gojo-specific effect requests, hitbox overrides |
| `PROMPTS.md` | copy-paste image prompts in generation order, with the versioned file name of each asset |
| `reference/` | model-sheet and expression-sheet versions, the approved copies, the idle anchor (§8) |
| `raw/` | generated strips `raw/<anim>_vNN.png` (the packer uses the highest version; a plain `raw/<anim>.png` only when no versioned file exists), single-frame fix attempts `raw/<anim>_NN_fixMM.png` (NN = frame, MM = attempt; skipped by the packer; the patched strip is saved as the next `_vNN`), parts `raw/_parts/<anim>_vNN_A.png` / `_B.png`, UI candidates `raw/ui_<name>_vNN.png`, rejected versions in `raw/_rejected/` (ignored by the packer) |
| `frames/<anim>/` | cleaned final frames `<anim>_NN.png` (NN = 00, 01, ...), written by the packer or touched up by hand |
| `ui/` | `portrait.png`, `cutin.png`, `select.png`: the approved `raw/ui_<name>_vNN.png`, fitted to 96×96, 480×128, 384×384 |
| `hitboxes.json` (optional) | per-frame hit/hurt overrides in 256-cell px; see MOVES_AND_VFX.md §5 |

Review queue: [art/REVIEW.md](../../REVIEW.md). Status of every asset: [art/TRACKER.md](../../TRACKER.md)
(human) and [art/manifest.json](../../manifest.json) (machine, with `version` and `approvedVersion`).
Build: `npm run sprites gojo`.
