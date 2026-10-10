# Killua (Hunter x Hunter 2011, Godspeed era): character design brief

> **ART-SCALE-01 user correction:** preserve Gojo's original approved compact head and slender adult proportions (model v03, idle v02). The enlarged-head candidates are rejected. Use the original Gojo as the visual scale reference when reviewing the cast; retain character height differences and stable anatomy through animations. Never enlarge Gojo to satisfy the nominal 31px target. See [CHARACTER_SCALE.md](../../CHARACTER_SCALE.md).

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (frame-by-frame poses),
> [MOVES_AND_VFX.md](MOVES_AND_VFX.md) (how each move looks in the engine) and
> [PROMPTS.md](PROMPTS.md) (copy-paste image prompts in generation order).
> Every number here follows **art spec v2**
> ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md), [art/SPEC.md](../../SPEC.md))
> and his kit follows **move system v2** ([ADR 0009](../../../docs/decisions/0009-move-system-v2.md)).
> If this file disagrees with them, **the ADRs and SPEC.md win**. Fix this file.
>
> **Killua is smaller than the rest of the cast on purpose** (about 6 heads, a 182 px standing body
> instead of 200 px). SPEC.md says a genuinely shorter character needs an ADR and a reach/lunge check by
> Claude, and his per-animation `bodyHeight` overrides must be in `art/manifest.json` before the first
> strip is packed (§3). Until then, do not run `npm run sprites killua` on real strips: the shared
> body heights would pack him at full adult size.

| | |
|---|---|
| Engine id | `killua` (folder `art/characters/killua/`, output `public/characters/killua/`) |
| Engine definition | `src/characters/killua.js` (Claude, ENG-028; read it for names, colors and stats once it exists; do not edit it for art). Kit data: `SPECIAL_MOVES` / `SUPERS` / `MOVES.echoStrike` in `src/game/moves.js`. |
| Design era | **Hunter x Hunter (2011 anime), Chimera Ant arc / Godspeed era**, about 13 years old: loose long-sleeved purple shirt with a dark-navy rolled collar over a white undershirt, baggy dark-navy shorts, purple-and-white high-top sneakers. |
| HUD name | `KILLUA` (subtitle: Claude's call, see MOVES_AND_VFX.md §7) |
| Neutral special (½ bar) | **NARUKAMI**: a lightning bolt shot from his open palm (`special` on the ground, `throw` in the air) |
| Forward special (1 bar) | **RHYTHM ECHO**: afterimage teleport behind the opponent, then a claw thrust (`vanish` → `specialForward`) |
| Up special (1 bar) | **THUNDERBOLT**: lightning leap and slam (`specialUp` rise → `airHeavy` slam → `land`) |
| Down / back special (1 bar) | **GODSPEED**: 8 s speed mode, +35 % speed, lightning blink dashes, +15 % damage (`specialDown`) |
| Ultimate (3 bars) | **LIGHTNING PALM**: blue-white lightning beam from both palms (`beamCharge` → `beamFire`) |
| SUPER (3 bars) | **GODSPEED: WHIRLWIND**: lightning dash, then a flurry from every direction and a slam (`superPose` during the super flash) |
| Claws | his assassin hand: fingers stiffen and the nails grow into short sharp claws. Drawn **only on the frames listed in §6**; every other frame has normal bare hands. |
| Lightning | engine VFX only. **Never drawn in body sprites** (SPEC.md "No effects in body sprites"); allowed only in UI art (cut-in glints, select art). |
| Character color, aura, beam | proposed in MOVES_AND_VFX.md §7 (Claude decides in `src/characters/killua.js`) |
| Stats (ADR 0009) | fastest walk and run of the cast, lower power and defense |
| Legal | Fan art for a personal, non-commercial demo. A public or commercial release needs a license or an original redesign (see the root README). |

## One-paragraph look

Trait-only description (no names), used as `{{TRAITS}}` in shared prompts such as the title key art
(`art/ui/PROMPTS.md`) and as the fallback `CHARACTER:` line (§9):

> a slim, wiry, pale boy of about 13 with a cold, detached, catlike air, drawn with serious anime
> proportions (about 6 heads tall, shorter and slimmer than the older fighters, not chibi); messy,
> fluffy, spiky silver-white hair that sticks out in soft pointed tufts in every direction, a few tufts
> falling over his forehead; sharp, upturned, cat-like blue eyes; a loose long-sleeved purple shirt with
> a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white
> cuffs at the wrists and a white hem below the purple hem; baggy dark-navy shorts ending just above the
> knees; bare shins; purple high-top sneakers with white soles, toe caps and laces; when he strikes, his
> fingers stiffen and his fingernails grow into short, sharp claws

---

## 1. Who he is on screen

A child assassin who has already decided how the fight ends. Killua is **fast, light and cold**: he
moves like a cat, stays loose until the instant he strikes, and never shows effort. Where Sasuke is
compact and rigid, Killua is **relaxed and springy**: low knees, weight on the balls of his feet,
hands hanging loose, then a snap into a claw or a kick and straight back to loose. Between exchanges
he looks bored. The cheeky kid shows only in the match moments (bored intro, tongue-out taunt, cat grin
on the win).

Motion language for every animation:

- **Speed:** the shortest anticipation of the cast (one frame, often half a pose), a hard snap into
  the active pose, a quick light recovery. He is the fastest fighter (ADR 0009).
- **Lightness:** he lives on the balls of his feet. Heels barely touch in the stance, landings are
  silent crouches, jumps are springy. No heavy stomps.
- **Loose to sharp:** hands hang open with loosely curled fingers; strikes become knife-hands
  (fingers straight together) or claws (fingers hooked, nails out). Kicks are fast snaps with pointed
  toes.
- **Straight lines:** strikes travel horizontally toward screen-right, like every fighter. His HIGH
  strikes are aimed at a taller opponent's face, so his arm reaches out at his **own brow height**
  (§3); that is still a horizontal strike, not an upward one.
- **Smaller body, same seriousness:** about 6 heads tall, a slim, wiry 13-year-old. Long thin limbs,
  narrow shoulders, lean forearms and calves. Never chibi, never a toddler, never cute-round.
- **Cold face:** the default is a half-lidded, bored, emotionless stare. **Assassin eyes** (dark,
  empty irises with pinpoint pupils) mark his killing moves (schedule in §5).

## 2. Identity checklist (the silhouette test)

If a frame is missing any of these, it is off-model. Check them in every strip.

1. **Hair:** **silver-white** with cool lavender-grey shading, **messy, fluffy and spiky**: soft
   pointed tufts stick up and out in every direction (on top, at the sides above the ears and at the
   back), a few shorter tufts fall over the forehead and between the brows. The mass adds about 15 px
   above the skull and 8 to 14 px at the sides and back at sprite scale. Never yellow, never dark grey,
   never slicked down, never a neat bowl.
2. **Face:** a young but sharp face: narrow chin, small nose, thin straight brows, slightly fuller
   cheeks than the 16-year-olds (not baby-round). Pale skin.
3. **Eyes:** **blue, sharp and upturned like a cat's** (outer corners lifted), large irises with one
   white catch-light. Assassin eyes darken them (§5).
4. **No headwear, no accessories:** no headband, no skateboard, no yo-yos, no bag, no chocolate box.
5. **Shirt (outer layer):** a **loose, long-sleeved purple shirt**, baggy on his slim frame, sleeves to
   the wrists, hem at the hips. It ripples and flaps with motion.
6. **Collar:** a **wide, loose dark-navy rolled collar** (a soft turtleneck folded down) sitting around
   the base of his neck. It reads as a dark ring between the pale neck and the purple shirt.
7. **White undershirt:** a **white long-sleeved undershirt** under the purple shirt. It shows as
   **white cuffs** (4 to 6 px) at both wrists below the purple sleeves and as a **white hem** (4 to 6
   px) below the purple hem around the hips.
8. **Shorts:** **baggy dark-navy shorts** ending **just above the knees**, with wide loose leg
   openings. The purple shirt hem and the white hem hang over the waistband.
9. **Legs:** bare knees and shins.
10. **Sneakers:** **purple high-top sneakers** covering the ankles, **white soles, white toe caps and
    white laces**.
11. **Hands:** bare. Relaxed hands have loosely curled fingers. **Claws** (fingers stiff and hooked,
    nails grown into short, pale, sharp points) appear only on the frames listed in §6.
12. **Build:** about **6 heads tall**, a **182 px standing body** (vs 200 px for the older fighters),
    head about 30 px. Slim and wiry: narrow shoulders, thin long arms and legs, lean defined
    forearms and calves. The crotch sits at about half his height.

Off-model in any frame: the Hunter Exam outfit (a dark short-sleeved tunic over a white turtleneck,
white shorts), the one-off plaid shirt and khakis, a skateboard, yo-yos, lightning or sparks drawn on
the body, claws on relaxed frames, red or green eyes, dark or yellow hair, adult proportions (a small
head on a tall body), chibi proportions (a big head, short legs).

## 3. Proportions and landmarks (final 256×256 cell)

Art spec v2 (ADR 0007): 256×256 cell, pivot `[128, 240]`, `pixelsPerUnit` 128, facing right, 3/4 view
(body turned about 35° toward the camera, head turned a bit more so both eyes show, camera about 12°
above). Full rules: [SPEC.md](../../SPEC.md).

**Killua's size (deliberate exception).** He is a 13-year-old next to 16-year-olds, so he is drawn at
**about 0.91 of the shared body scale**:

| | older fighters (SPEC.md) | **Killua** |
|---|---|---|
| heads tall | about 6.5 | **about 6** |
| standing upright body (soles to top of skull) | about 200 px | **about 182 px** |
| head (chin to top of skull) | about 31 px | **about 30 px** (a younger head is relatively bigger) |
| hair above the skull | up to about 20 px | **about 15 px** (fluffy tufts) |
| idle stance total height incl. hair | about 204 px | **about 186 px** |
| `bodyHeight` table | ADR 0007 table | **ADR 0007 × 0.91, rounded** (one exception: `heavy` 206). Full table: [ANIMATIONS.md](ANIMATIONS.md#body-heights-for-the-manifest) |

Because `pixelsPerUnit` stays 128, he is also about 0.91 of their size in the world. That needs (for
Claude): an ADR or an amendment to ADR 0007 for a shorter character, `bodyHeight` overrides in the
manifest's `killua` entry, and a reach/lunge check (his limbs are about 9 % shorter).

- Keep every opaque pixel inside **x 4..251, y 4..240** (the cell margin).
- If the approved idle's head comes out more than 3 px bigger or smaller than 30 px in the Sprite Lab
  (his fluffy hair may add more or less height than estimated), Codex sets per-animation `bodyHeight`
  overrides in `art/manifest.json` and logs them in `art/TRACKER.md`. Don't redraw for it.

Idle stance landmarks, in final cell pixels (x from the left, y from the top; soles on y 240, body
center line x 128):

| landmark | y (px) | x (px) |
|---|---|---|
| top of hair (tufts) | ~54 | tufts reach back to ~x 100 and forward to ~x 150 |
| top of skull | ~69 | |
| eyes | ~83 to 87 | |
| chin | ~99 | |
| navy rolled collar | ~100 to 108 | |
| shoulders | ~107 | |
| chest | ~110 to 134 | |
| purple shirt hem | ~150 | white undershirt hem below it to ~y 156 |
| stomach / waistband | ~134 to 158 | |
| hips / crotch | ~160 | |
| shorts hem | ~188 to 192 | |
| knees | ~200 | |
| sneaker tops (high-tops) | ~222 | |
| soles (floor line) | 240 | front (L) toes ~x 166, back (R) heel ~x 92 |
| lead (L) hand, open, fingers loosely curled | ~98 to 112 | ~160 to 172: the idle front edge; nothing in idle reaches past ~x 174 |
| rear (R) hand, open, low beside the R hip | ~146 to 160 | ~130 to 142 |

**Contact zones.** Strikes use the **ADR 0007 contact zones unchanged**: they mark where a standard
(200 px) opponent's body is, and that is what Killua hits. On his own smaller body those heights fall
lower than on the others:

| opponent zone (ADR 0007) | y (px) | where that is on Killua's own body | used by (contact zone x, y) |
|---|---|---|---|
| HIGH (face) | 58 to 90 | top of his hair down to his nose: **brow / eye height** | `light1` knife-hand (206-226, 64-86), `light2` claw (214-236, 70-92), `light4` foot (224-248, 56-88), `heavy` f3 claw (180-208, 58-86), then overhead f4 (160-188, 22-46; his claw tops out at ~y 34) |
| MID (chest) | 92 to 124 | chin to upper chest: **shoulder height** | `airLight1` knife-hand (206-230, 100-120), `airLight3` heel (222-248, 105-150), `specialForward` claw (212-240, 92-124, new) |
| LOW (stomach) | 122 to 152 | his chest down to the waistband | `light3` sole (222-246, 122-148), `airLight2` foot (220-246, 130-155) |
| down-forward | | in front of and below his hips | `airHeavy` clasped hands (180-218, 160-206), also the Thunderbolt slam |
| technique origins | | his chest | Narukami palm on the projectile spawn (192, 125) (release zone x 186-212, y 116-142); Lightning Palm palms on the beam origin (230, 122) (zone x 222-238, y 112-132) |

**Forward-most rule.** On active frames the striking hand, claw or foot is the right-most part of the
silhouette. Hair tufts, the collar, the loose shirt and its white hem stay behind it (and behind about
x 165, the idle front edge minus 9 px, unless the frame is a lunge).

## 4. Facing, near side and handedness

- Sprites always face **right**. The engine mirrors them when he faces left.
- Facing right in a 3/4 view, his **right side is nearest the camera**:
  - **R arm / R leg = near** (drawn in front of the body, fully visible).
  - **L arm / L leg = far** (partly behind the torso).
- **Stance:** L foot forward, R foot back (orthodox). **Lead hand = L** (open, forward at chin-to-chest
  height). **Rear hand = R** (open, low beside the R hip).
- **Claw hand = R (near)** for the big claw strikes (`light2`, `heavy`, `specialForward`, `superPose`),
  so the claws are never hidden behind his body. Knife-hand jabs use the lead L hand (`light1`,
  `airLight1`).
- **Narukami palm = R (near)** (`special`, `throw`). **Lightning Palm** uses both palms, R in front.
- His outfit has no asymmetric details, so mirroring changes nothing important.

## 5. Face, eyes and assassin eyes

| expression | look | used in |
|---|---|---|
| **cold** (default) | half-lidded and bored: upper lids low and flat, brows level, mouth a small flat line | idle, run, dash, jumps, land, guard, getup, airRecover, recovery frames |
| **focused** | brows down at the inner ends, eyes narrowed, mouth tight | normals (startup and active frames), `special`, `throw`, `superDash`, `vanish` |
| **fierce / shout** | mouth open showing teeth and one small pointed canine (`#6e2633` interior), brows down | `light4`, `heavy`, `airLight3`, `airHeavy`, `charge`, `specialDown` f2, `beamFire` |
| **cat grin** | eyes curved or half-closed, a small ω-shaped cat mouth with one tiny fang | intro f2, win |
| **tongue out** | one lower eyelid pulled down with a finger, tongue out (`#e27d8c`) | taunt |
| **pain** | eyes squeezed shut or wide with tiny pupils, teeth gritted or mouth open | hurtHigh, hurtLow, launched, spin, down |
| **eyes shut** | lids closed, brows strained | block, ko |
| **dazed** | half-lidded, unfocused, mouth slightly open, tufts over the eyes | stagger |
| **assassin eyes** | the irises go **dark** (filled `#1d4c94`), pupils shrink to 1 px points (`#16121f`), **no catch-light**, upper lids flat and low with a skin-shadow band (`#d39a84`) over them; the mouth expressionless or teeth gritted | see the schedule below |

Normal eyes: iris `#3d8fe0` with a lighter top band `#9ad6ff` and a dark rim `#1d4c94`, pupil and
lash line `#16121f`, whites `#f3f3fb`, one 1 px `#ffffff` catch-light. Upturned outer corners. At
sprite scale each eye is about 4 to 5 px tall and slightly wider than the 16-year-olds' eyes.

**Assassin-eyes schedule.** "ON" means every frame of the animation unless noted:

| ON | OFF (normal blue eyes) |
|---|---|
| `specialForward` (f0-f5; f6 back to normal), `specialDown`, `superPose`, `beamCharge`, `beamFire`, UI cut-in, UI select art | everything else, including `special` / `throw` (Narukami), `charge`, intro, taunt, win and the HUD portrait |

## 6. Hair, collar, shirt, shorts and claws

- **Hair tufts** are soft and light. The whole mass bounces 1 to 2 px on impacts and landings, and
  single tufts lag one frame behind the head:
  - moving forward (run, dash, superDash, lunges): swept back toward screen-left;
  - moving backward (backDash, hurt, launched, block): flicked forward toward screen-right;
  - rising: pressed down; falling: lifted up;
  - landing or impact: overshoot 2 px, settle next frame;
  - power moments (`charge`, `specialDown`, `superPose`, `beamCharge`): **bristling upward** with
    static, 2 to 4 px taller than in idle (the engine adds the lightning).
- **Rolled collar:** soft but thick; it shifts at most 1 px and never flaps.
- **Purple shirt:** loose. The hem flaps 2 to 4 px, sleeves billow 1 to 2 px, and the shirt rides up
  on raised arms and when airborne (more white hem shows). On kicks it never covers the kicking leg.
- **White cuffs and hem** move with the purple layer; they must stay visible (the white is part of his
  identity).
- **Shorts:** baggy; the leg openings flap 1 to 3 px, the kicking leg comes out of the opening.
- **Sneakers:** rigid.
- **Claws** (assassin hand): the fingers stiffen and hook slightly, the knuckles tense, and the nails
  grow **4 to 6 px** past the fingertips into pale, sharp points (hair-ramp tones `#f3f3fb` /
  `#dedfee` with `#9597b4` shading and a `#6b6d8c` edge). Never longer than about half a finger, never
  metal, never glowing. Knife-hand strikes keep the fingers straight and together with the nail tips
  pointed. **Claws ON** only in: `light1` f1-f4, `light2` f0-f4, `heavy` f2-f5, `airLight1` f1-f3,
  `superDash`, `charge`, `beamCharge`, `beamFire`, `specialForward` f0-f5, `specialUp` f2-f3,
  `specialDown`, `superPose`. Every other frame: normal fingertips.
- **Smear trails of claws:** on active claw frames the smear may include four thin solid streaks in
  the nail colors along the fingertips' path. Solid shapes only (SPEC.md), never blur or transparency.

## 7. Palette (30 colors, limit 48)

New palette (the 3D placeholder in `src/characters/killua.js` has its own simplified colors for the
chibi bake; the art uses these). Use **only** these colors in character frames.
ADR 0007 allows up to 48 (the packer warns above 64), so there are 18 spare slots: list any color you
add here first.

| # | material | highlight | light | base | shadow | deep / line |
|---|---|---|---|---|---|---|
| 1 | outline, pupils, darkest black | | | | | `#16121f` |
| 2–6 | skin (face, neck, hands, knees, shins) | `#fff5ee` | | `#fde2cf` | `#eebba3` | `#d39a84`, `#a9705f` (creases, nostrils, knuckles, assassin-eye lid shadow) |
| 7–12 | silver-white hair, claws, eye whites | `#ffffff` (catch-lights, teeth too) | `#f3f3fb` | `#dedfee` | `#bec0d6` / `#9597b4` | `#6b6d8c` |
| 13–15 | blue eyes | `#9ad6ff` | | `#3d8fe0` | `#1d4c94` (rim, assassin-eye fill) | |
| 16 | mouth interior | | | `#6e2633` | | |
| 17 | tongue | | | `#e27d8c` | | |
| 18–22 | purple shirt and sneaker uppers | `#b8a2ec` | `#9478d6` | `#6f52b4` | `#4c3586` | `#2f2058` |
| 23–26 | dark navy: rolled collar, shorts | `#4a5888` | | `#2f3a64` | `#1f2646` | `#141a32` |
| 27–30 | white undershirt (cuffs, hem), sneaker soles, toe caps, laces | (`#ffffff`) | `#f2f0ea` | `#dad5cc` | `#b3ada4` | `#8a847c` |

Material rules:

- **Outline:** 1 px `#16121f` on the outer silhouette. Inner lines use the darkest tone of the
  material (selective outline): `#6b6d8c` between hair tufts, `#2f2058` in shirt folds, `#141a32` in
  the collar roll and shorts folds, `#8a847c` on the white layers, `#a9705f` for nose, ear, knuckles.
- **Lighting:** key light from the upper-front-right (his front). Light tones on top and front
  surfaces (screen-right), shadows on the back (screen-left), under the hair, chin, collar and arms.
  Realistic shading means more planes, not soft gradients: use the extra tones for the loose shirt
  folds, the hair tufts and the lean muscle of forearms and calves.
- **Silver-white hair vs the white undershirt:** the hair is **cool** (lavender-grey shadows
  `#bec0d6`, `#9597b4`), the undershirt is **warm** (`#dad5cc`, `#b3ada4`). Keep them apart. The hair
  must never read grey overall: mostly `#f3f3fb` and `#dedfee` with shadow planes under the tufts.
- **Purple shirt:** mostly `#6f52b4` and `#4c3586` with `#9478d6` on lit folds and `#b8a2ec` only on a
  few top edges. It must read clearly purple, not blue, not pink.
- **Navy vs purple:** the collar and shorts are a **blue** navy, darker and less saturated than the
  shirt. They must never merge with the purple.
- **Claws:** the hair ramp's light tones; they must read as pale nails, not as metal blades.
- **No** gradients, dithering, noise, glow, soft shadows or anti-aliasing. Hard pixels only.

Effect colors (**not** part of the body sprite palette; for VFX and UI art only):

| effect | colors |
|---|---|
| Godspeed / Narukami lightning (tinted `lightning`, glow, arcs) | `#ffffff` core, `#e8f8ff`, `#bfe6ff`, `#7fcfff`, `#3f8cff` outer; engine tints: bolt `#d8f0ff`, bolt glow `#6ab8ff`, move-name banners `#bfe6ff` |
| Lightning Palm beam (shader) | core `#ffffff`, mid `#9fdcff`, edge `#4a8cff` |
| Godspeed aura (tinted white art, proposed) | outer `#8cd9ff`, core `#ebfaff` |
| Character color | `#8fd4ff` (`src/characters/killua.js`) |

## 8. Reference folder (`reference/`)

Codex files every generated reference image here with a `_vNN` version (ADR 0007). Versions are never
overwritten, reused or deleted; the highest number is the latest candidate. The approved version is
**copied** to the fixed name, which is what later prompts attach.

| file | what | from |
|---|---|---|
| `reference/model_sheet_vNN.png` | model-sheet candidates: turnaround (front, 3/4 right, true side profile, back), fighting stance, two hand close-ups (relaxed, claw), palette swatches | PROMPTS.md S1 |
| `reference/model_sheet.png` | **copy** of the approved model-sheet version | Codex, after "approve killua model_sheet vNN" |
| `reference/expressions_vNN.png` | expression-sheet candidates (8 heads incl. assassin eyes) | PROMPTS.md S2 |
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
`CHARACTER:` line of the prompt with this block. Also drop "Killua", "Zoldyck", "Hunter x Hunter",
"Chimera Ant", "Godspeed", "Narukami", "Rhythm Echo", "Thunderbolt", "Whirlwind" and "Lightning Palm"
from the prompt (table below). Never name the original artist or studio.

> CHARACTER: an original character inspired by classic shonen adventure anime, fan-art sprite for a
> personal non-commercial game project: a slim, wiry, pale boy of about 13 with a cold, detached,
> catlike air, drawn with serious anime proportions (about 6 heads tall, shorter and slimmer than an
> adult, not chibi). Messy, fluffy, spiky silver-white hair that sticks out in soft pointed tufts in
> every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin
> brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy
> rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and
> as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees.
> Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands;
> when he strikes, his fingers stiffen and his fingernails grow into short, sharp, pale claws.

Replacement terms:

| instead of | write |
|---|---|
| Killua Zoldyck / Zoldyck assassin | (drop the name; keep the full trait list) "a boy raised as an assassin" |
| Hunter x Hunter (2011) / Chimera Ant arc outfit | "his later outfit from a classic shonen adventure anime" (and keep the full trait list) |
| assassin claws / claw hand | "his fingers stiffen and his fingernails grow into short sharp claws" |
| assassin eyes | "his blue eyes go dark and empty, with tiny pinpoint pupils" |
| Narukami | "a lightning bolt shot from his open palm" |
| Rhythm Echo | "an afterimage step: he blurs out of sight and strikes from behind with a clawed hand" |
| Thunderbolt | "a lightning-charged leap and a downward double-hand slam" |
| Godspeed | "a lightning-speed mode: his body crackles with blue-white electricity" |
| Godspeed: Whirlwind | "a lightning-speed flurry of strikes from every direction" |
| Lightning Palm | "a blue-white lightning beam fired from both open palms" |
| "in the style of <artist / studio>" | "early-2010s TV anime look: clean thin line art, flat cel shading, sharp upturned eyes, slim youthful proportions" |

## 10. Files in this folder

| path | what |
|---|---|
| `CHARACTER.md` | this brief |
| `ANIMATIONS.md` | every animation, frame by frame (poses, phases, contact zones, anchors), incl. the 4 optional move-system-v2 animations and the body-height table for the manifest |
| `MOVES_AND_VFX.md` | how each move plays in the engine, which VFX it uses, Killua-specific effect requests, hitbox overrides, proposed engine fields |
| `PROMPTS.md` | copy-paste image prompts in generation order, with the versioned file name of each asset |
| `reference/` | model-sheet and expression-sheet versions, the approved copies, the idle anchor (§8) |
| `raw/` | generated strips `raw/<anim>_vNN.png` (the packer uses the highest version; a plain `raw/<anim>.png` only when no versioned file exists), single-frame fix attempts `raw/<anim>_NN_fixMM.png` (NN = frame, MM = attempt; skipped by the packer; the patched strip is saved as the next `_vNN`), parts `raw/_parts/<anim>_vNN_A.png` / `_B.png`, UI candidates `raw/ui_<name>_vNN.png`, rejected versions in `raw/_rejected/` (ignored by the packer) |
| `frames/<anim>/` | cleaned final frames `<anim>_NN.png` (NN = 00, 01, ...), written by the packer or touched up by hand |
| `ui/` | `portrait.png`, `cutin.png`, `select.png`: the approved `raw/ui_<name>_vNN.png`, fitted to 96×96, 480×128, 384×384 |
| `hitboxes.json` (optional) | per-frame hit/hurt overrides in 256-cell px; see MOVES_AND_VFX.md §5 |

Review queue: [art/REVIEW.md](../../REVIEW.md). Status of every asset: [art/TRACKER.md](../../TRACKER.md)
(human) and [art/manifest.json](../../manifest.json) (machine, with `version` and `approvedVersion`).
Build: `npm run sprites killua` (only after the manifest has his `killua` entry, see §3).
