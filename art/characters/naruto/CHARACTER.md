# Naruto (Part 1 / genin era): character design brief

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (frame-by-frame poses),
> [MOVES_AND_VFX.md](MOVES_AND_VFX.md) (how each move looks in the engine) and
> [PROMPTS.md](PROMPTS.md) (copy-paste ChatGPT prompts in generation order).
> Technical rules (cell size, pivot, palette limits, file naming) live in
> [art/SPEC.md](../../SPEC.md). If this file and SPEC.md disagree, **SPEC.md wins**. Fix this file.

| | |
|---|---|
| Engine id | `naruto` (folder `art/characters/naruto/`, output `public/characters/naruto/`) |
| Engine definition | `src/characters/naruto.js` (read it for art facts: palette, colors, names; do not edit it for art) |
| HUD name / subtitle | `NARUTO` / "Orange Hokage-to-be" |
| Signature rush (1 bar) | **RASENGAN**: a spinning blue chakra sphere formed in his right palm, then a ninja-run rush and a palm thrust (`special`) |
| Air projectile (½ bar) | **SHURIKEN**: three four-point throwing stars thrown in a fan from the air (`throw`) |
| Ultimate (3 bars) | **RASEN CANNON**: a huge orange spiraling chakra beam fired from both palms (`beamCharge` → `beamFire`) |
| Character color | `#ff8a1c` (HUD, afterimages, vanish ring, dash bursts) |
| Aura | outer `#ff8c1f` (`aura [1.0, 0.55, 0.12]`), core `#ffeb8c` (`auraCore [1.0, 0.92, 0.55]`) |
| Beam colors | core `#fff6d8`, mid `#ffb43a`, edge `#ff6a10` |
| Rasengan color | `#6ab4ff` (impact flash and explosion tint, from `SPECIALS.rasengan.color`) |
| Stats | all-rounder: speed 5.9, power 1.0, defense 1.0 |
| Legal | Fan art for a personal, non-commercial demo. A public or commercial release needs a license or an original redesign (see the root README). |

## One-paragraph look

Trait-only description (no names), used as `{{TRAITS}}` in shared prompts such as the title key art
(`art/ui/PROMPTS.md`) and as the fallback `CHARACTER:` line (§9):

> an original anime fan-art ninja boy, about 12 years old, scrappy and cocky, with a huge mass of
> thick spiky bright golden-blond hair that sticks out in every direction, big bright blue eyes,
> three thin whisker-like marks on each cheek, a navy-blue cloth forehead band with two long tails
> and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit
> jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper
> ring, matching orange pants bound tight at the lower shins, a small navy holster over a white
> bandage on his right thigh, and blue open-toed ninja sandals

---

## 1. Who he is on screen

Loud, cocky, scrappy, impossible to keep down. Where Sasuke is economical and cold, Naruto is a
brawler who throws his whole body into everything: big wind-ups, wide stances, over-committed
swings, and a grin even when he is losing. He fights like a street kid who learned ninjutsu.

Motion language for every animation:

- **Commitment:** clear anticipation (1 to 2 frames), a hard snap into the hit, then visible
  follow-through and overshoot before he recovers. Recovery can look a little scrappy (a hop, a
  shuffle), never stiff.
- **Horizontal strikes:** punches, kicks and palm thrusts travel along the screen horizontal toward
  screen-right, loaded with hip and shoulder twist. Kicks are big and swinging. Uppercuts and the
  air hammer travel up-forward / down-forward, always ending **in front of** his body, never only
  above his own head.
- **Ninja run:** torso pitched far forward, both arms trailing straight back, hands flat.
- **Wide base:** his stance is wider and lower than a boxer's, weight centered, knees bent.
- **Expressive face:** default is a cocky half-smirk. He shouts on every big move with a wide-open
  mouth, flashes a huge toothy grin on taunt and win, grits his teeth when hurt, and gets spiral
  "dizzy" eyes when stunned.
- **Hand seals:** the cross-shaped shadow-clone seal (index and middle fingers of both hands
  crossed in a "+") is his signature pose (intro).

## 2. Identity checklist (the silhouette test)

If a frame is missing any of these, it is off-model. Check them in every strip.

1. **Hair:** bright golden-blond. A big mass of thick, sharp, triangular spikes radiating out
   from the head in every direction (up, back and to the sides) like a spiky ball, with the
   biggest spikes on top and at the back. Three or four shorter pointed bangs fall over the
   headband in front, and a small spiky sideburn hangs in front of each ear. The hair adds about
   12 to 14 px above the skull and 8 to 12 px behind the head.
2. **Forehead protector:** **navy-blue** cloth band (not black; black is the later look), knotted at
   the back of the head with two long tails that hang to the shoulders. A rectangular polished
   steel plate sits on the forehead, engraved with the leaf-swirl village symbol (a spiral with a
   small pointed leaf tip). Small rivet dots at the plate's ends are optional at sprite scale.
3. **Eyes:** large and bright sky-blue, dark pupil, white catch-light. Thin, very expressive brows.
4. **Whisker marks:** three thin horizontal lines on **each** cheek, fanning slightly. This is the
   strongest recognition cue at sprite scale. Never skip them, even in small or turned heads (draw
   the far cheek's marks when that cheek is visible).
5. **Jacket (Part 1 jumpsuit top):** bright orange zip-up track jacket. A navy-black yoke covers
   the shoulders and upper back and extends a little onto the top of the upper arms. Big white
   stand-up collar, open at the throat in a small V, with a silver zipper pull-ring hanging at the
   front. Long orange sleeves to the wrists, hands bare. A red spiral emblem sits centered on the
   back (only visible in back-turned frames: `light4_02`, `airLight3_01`, turnaround).
6. **Pants:** the same bright orange as the jacket (one jumpsuit), loose, gathered and bound tight
   at the lower shins.
7. **Holster (optional at sprite scale):** a small navy-black kunai holster strapped over a white
   bandage wrap on the **right thigh** (the near thigh, visible in the 3/4 view).
8. **Sandals:** blue open-toed ninja sandals (a brighter blue than the headband), toes visible,
   dark soles.
9. **Build:** a scrappy 12-year-old boy. Round youthful face, slightly bigger head than Sasuke,
   compact torso, sturdy legs. Not muscular, not lanky.
10. **Face:** round cheeks and jaw, small nose, a wide mouth capable of a huge grin. No fangs and
    no red eyes (those belong to the nine-tails forms and are out of scope).

## 3. Proportions and landmarks (final 192×192 cell)

Hi-res sprite spec v1: 192×192 cell, pivot `[96, 180]`, `pixelsPerUnit` 86, facing right,
3/4 view (body turned about 35° toward the camera, head turned a bit more so both eyes show,
camera about 12° above). Full rules: [SPEC.md](../../SPEC.md).

- About **4.3 heads tall**. Head (chin to top of skull) is about **31 px**.
- Standing body (soles to top of skull, legs straight, hair not counted): **136 px**. His spiky
  hair adds about 12 to 14 px on top.
- In the **idle stance** (wide, knees bent about 25°, slight forward lean) the top of the skull
  sits at about y 57 and the hair tips at about y 45. Trimmed height including hair is about
  **135 px**, which is the idle `bodyHeight`.

Idle stance landmarks, in final cell pixels (x from the left, y from the top; soles on y = 180):

| landmark | y (px) | x (px) |
|---|---|---|
| top of hair spikes | ~45 | spikes reach back to ~x 74 |
| skull top / headband | ~57 to 66 | plate centered ~x 112 |
| eyes | ~70 to 76 | |
| chin | ~88 | |
| shoulders | ~95 | |
| chest | ~96 to 112 | |
| stomach / waist | ~112 to 124 | |
| crotch | ~130 | |
| knees | ~154 | |
| soles (floor line) | 180 | front (left) toes ~124, back (right) heel ~70 |
| lead (left) fist | ~92 | ~128 (the idle front edge; nothing in idle goes further right than ~x 132) |
| rear (right) fist | ~102 | ~112 |

Strike target heights (where the **opponent's** body is when he is in range). Every active frame in
[ANIMATIONS.md](ANIMATIONS.md) aims at one of these:

| target | y (px) | used by |
|---|---|---|
| face / chin | 60 to 88 | `light1` fist (x ~156, y ~78), `light2` fist (chin / upper chest, x ~166, y ~86), `light4` foot (x ~178, y ~76), `heavy` fist path |
| upper chest | 88 to 100 | `airLight1`, `taunt` finger |
| chest / solar plexus | 96 to 118 | `beamFire` palms, Rasengan thrust (palm ~(156, 112), inside the engine orb at (148, 118)) |
| stomach | 108 to 126 | `light3`, `airLight2` |
| fully extended punch / palm tip | | x 150 to 172 (SPEC.md contact zones) |
| fully extended kick tip | | x 166 to 186 (SPEC.md contact zones; never past x 187) |

**Scale note.** The packer scales each strip so its tallest frame matches that animation's
`bodyHeight` in `art/manifest.json`. The values assume these proportions: a fist raised straight
overhead ends about 5 px above the hair tips (`win` 140, `heavy` 144). If an approved strip still
looks bigger or smaller than idle in the Sprite Lab, Codex corrects that animation's `bodyHeight`
in the manifest. Don't redraw the art.

## 4. Facing, near side and handedness

- Sprites always face **right**. The engine mirrors them when he faces left.
- Facing right in a 3/4 view, his **right side is nearest the camera**. In every brief:
  - **R arm / R leg = near** (drawn in front of the body, fully visible).
  - **L arm / L leg = far** (partly behind the torso).
- **Stance:** L foot forward, R foot back (orthodox). **Lead hand = L** (fist at chin height).
  **Rear hand = R** (fist guarding the right cheek/chest).
- **Rasengan hand = R (near) hand.** That matches how he usually holds it, and it keeps the orb from
  being hidden behind his body. Shuriken throws, the taunt point and the win fist pump also use the
  R hand.
- Mirroring flips the leaf symbol and the back spiral. That's accepted for the demo.

## 5. Face and expressions

| expression | look | used in |
|---|---|---|
| **smirk** (default) | one mouth corner up, eyes confident and focused on the opponent, brows slightly lowered | idle, guard (glaring), intro, getup end |
| **focused** | brows down, eyes narrowed, mouth closed | run, dash, jumps, anticipation frames |
| **angry** | brows hard down, teeth gritted and showing | light attacks (active), superDash, guard |
| **shout** | mouth wide open (teeth and `#5a1a22` interior visible), brows down, eyes intense | `light4`, `heavy`, `airHeavy`, `special`, `charge`, `beamCharge`, `beamFire`, `win_01` |
| **grin** | huge toothy grin, cheeks pushed up, eyes squinting or closed in happy arcs | `taunt`, `win`, `intro` alt |
| **pain** | eyes squeezed shut, teeth gritted or mouth open in a grimace | hurtHigh, block, launched, spin, down_00 |
| **gasp** | eyes wide with tiny pupils, mouth open | hurtLow_00 |
| **dazed / dizzy** | spiral "swirl" eyes (comedic anime dizzy eyes), mouth hanging open | stagger |
| **out** | eyes closed (lines), mouth slightly open, brows relaxed | down_01, ko |

Eyes: iris `#2f86ec` with a `#1a3f8e` dark upper half and rim, pupil and lash line `#1d1420`,
whites `#f1eef6`, one 1 px `#ffffff` catch-light. At sprite scale each eye is about 5 to 7 px tall.
Whisker marks: three 1 px lines per cheek, 3 to 5 px long, in `#b9704f`. On the large UI art
(portrait, cut-in, select) they may be drawn in the outline color `#1d1420` for crispness.

## 6. Hair, headband and cloth motion

- **Hair spikes** are stiff. They move as one mass (1 to 2 px squash/stretch on landings and
  impacts, 1 px lag on bobs) and never bend like cloth.
- **Headband tails** are the main secondary-motion part. They lag one frame behind the head:
  - moving forward (run, dash, superDash, Rasengan rush): stream back toward screen-left;
  - moving backward (backDash, hurt, launched, block): whip forward toward screen-right;
  - rising: dragged downward; falling: lifted upward;
  - landing or impact: overshoot 2 to 3 px past rest, then settle the next frame;
  - aura (charge, beamCharge, beamFire): blown upward / backward and flickering.
- **Collar** is stiff. **Jacket hem**, **sleeve cuffs** and **pant legs** can ripple 1 to 2 px.
  The **zipper ring** may swing 1 px.

## 7. Palette (31 colors used, hard limit 32)

Base ramps are the exact hexes from `src/characters/naruto.js` (`model.palette`). Extras
(marked ✚) come from `model.face` or are new and listed here. Use **only** these colors in
character frames. The packer warns above 48, but aim for 32 or fewer.

| # | material | light / highlight | base | shadow | extra | source |
|---|---|---|---|---|---|---|
| 1 | outline, pupils, lash lines, darkest line | | | | `#1d1420` ✚ | `face.line` |
| 2–5 | skin | `#ffe2c6` | `#f8c69b` | `#d98a66` | `#b9704f` ✚ (whiskers, nose, ear, mouth corners) | `skin`, `face.skinLine` |
| 6–9 | hair | `#fff6c2` (spike-tip glints), `#ffe36a` | `#ffc935` | `#e0861c` | | `hair` |
| 10–12 | orange jumpsuit (jacket **and** pants) | `#ffac48` | `#f88320` | `#c44d14` | | `jacket` |
| 13–15 | navy-black yoke, holster, sandal soles | `#474a72` | `#2b2c42` | `#17182a` | | `black` |
| 16–18 | white collar, bandage, eye whites, teeth | `#ffffff` (shared) | `#f1eef6` | `#bbb5cc` | | `white` |
| 19–21 | sandals | `#5a88e2` | `#2d55b4` | `#1b3376` | | `sandal` |
| 22–24 | headband cloth, tails | `#3e4fa0` | `#25306e` | `#141a46` | | `band` |
| 25–27 | headband plate, zipper ring (steel) | `#e4eaf4` (+ `#ffffff` specular, shared) | `#b8c2d2` | `#76829a` (leaf engraving) | | `metal` |
| 28–29 | iris | | `#2f86ec` ✚ | `#1a3f8e` ✚ | | `face.iris`, `face.irisDark` |
| 30 | mouth interior, tongue shadow | | `#5a1a22` ✚ | | | `face.mouth` |
| 31 | back spiral emblem | | `#c8282a` ✚ | | | new |
| 32 | *spare* (only if the back spiral needs a shadow: `#8a1a20`; list it here if used) | | | | | |

Folded to stay under 32. Do **not** add these back:

- the separate pants ramp `#ffa040` / `#f07a1e` / `#b9461a` (the placeholder used it for
  readability; the anime jumpsuit is one orange). Separate jacket hem and pants with a shadow band
  and outline instead.
- the sole ramp `#5a4440` / `#3b2b2a` / `#241818`: draw soles with `#2b2c42` / `#17182a`.
- `face.sclera #f6f2f4`: use `#f1eef6`.
- `face.symbol #3a3448`: engrave the leaf symbol with `#76829a` and `#1d1420`.

Material rules:

- **Outline:** 1 px `#1d1420` on the outer silhouette. Inner lines may use the darkest tone of the
  material (selective outline), e.g. `#c44d14` between jacket folds, `#e0861c` between hair
  spikes, `#d98a66` / `#b9704f` for the nose and ear.
- **Lighting:** key light from the upper-front-right (his front). Light tones sit on top and front
  surfaces (screen-right). Shadows fall on the back (screen-left), under the hair, chin, collar and
  arms.
- **Hair:** mostly `#ffc935` with `#e0861c` shadow planes on the lower and back side of each spike,
  `#ffe36a` on the lit planes, and a few `#fff6c2` glints at spike tips facing the light. Never
  greenish, never brown, never pale platinum.
- **Orange:** a warm saturated orange, never red and never brown. The navy-black yoke must stay
  clearly darker than the headband blue.
- **No** gradients, dithering, noise, glow, soft shadows or anti-aliasing. Hard pixels only.

Effect colors (**not** part of the body sprite palette; for VFX and UI art only):

| effect | colors |
|---|---|
| Rasengan orb (`orb`) | `#3a7cf0`, `#7ab8ff`, `#e8f6ff`, `#ffffff` (same as the procedural orb); runtime glow tint `#8ac8ff`, sparkle tint `#bfe4ff` |
| Rasengan impact tint | `#6ab4ff` |
| Rasen Cannon beam | core `#fff6d8`, mid `#ffb43a`, edge `#ff6a10` |
| Chakra aura (tinted white art) | outer `#ff8c1f`, core `#ffeb8c` |
| Shuriken (`shuriken`) | steel `#5a6070`, edge highlight `#c8d0dc`, center hole `#1a1a24` |

## 8. Reference folder (`reference/`)

Approved images that every later prompt attaches. Codex files them here. Names:

| file | what | from |
|---|---|---|
| `reference/model_sheet.png` | approved turnaround (front, 3/4 right, side, back), fighting stance and palette swatches | PROMPTS.md step S1 |
| `reference/expressions.png` | approved expression sheet (9 heads) | PROMPTS.md step S2 |
| `reference/idle_approved.png` | the approved `idle` strip (best pose and proportion anchor) | PROMPTS.md step A01 |
| `reference/notes.md` (optional) | what was fixed between attempts, which chat produced the keeper | Codex |
| `reference/source/` (optional, local only) | official screenshots the user collects for their own comparison | user |

Official screenshots are copyrighted. Keep them local for comparison only, and do not upload them
to ChatGPT as style sources. Attach our own approved model sheet instead. ChatGPT may refuse or
degrade when given copyrighted frames.

## 9. Trait-only description (fallback wording)

If ChatGPT refuses or waters down a prompt that names the character, replace the `CHARACTER:` line
of the prompt with this block. Also drop "Naruto", "Uzumaki", "Rasengan", "Rasen Cannon" and
"shadow clone" from the prompt. Never name the original artist.

> CHARACTER: an original anime fan-art ninja boy, about 12 years old, scrappy and cocky, with a
> huge mass of thick spiky bright golden-blond hair that sticks out in every direction, big bright
> blue eyes, three thin whisker-like marks on each cheek, a navy-blue cloth forehead band with two
> long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up
> jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a
> silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster
> over a white bandage on his right thigh, and blue open-toed ninja sandals

Replacement terms:

| instead of | write |
|---|---|
| Rasengan | "a swirling sphere of blue wind-energy held in his open palm" |
| shadow-clone seal / Shadow Clone Jutsu | "a cross-shaped hand sign: index and middle fingers of both hands extended and crossed in a plus shape" |
| Rasen Cannon | "a huge orange spiraling energy beam fired from both palms" |
| Uzumaki spiral | "a red spiral emblem" |
| leaf symbol / Konoha | "a leaf-swirl symbol" |
| shuriken | "small four-pointed steel throwing stars" (this one is usually fine as is) |
| "in the style of <artist>" | "classic early-2000s shonen anime look: bold clean line art, big expressive eyes, spiky hair, flat cel shading" |

## 10. Files in this folder

| path | what |
|---|---|
| `CHARACTER.md` | this brief |
| `ANIMATIONS.md` | every animation, frame by frame (poses, phases, strike targets) |
| `MOVES_AND_VFX.md` | how each move plays in the engine, which VFX it uses, Naruto-specific effect requests |
| `PROMPTS.md` | copy-paste ChatGPT prompts in generation order |
| `reference/` | approved model sheet, expression sheet, idle anchor |
| `raw/` | ChatGPT output as saved: `raw/<anim>.png` (one strip) or `raw/<anim>_NN.png` (single frames); optional untouched UI originals `raw/ui_<name>.png`, fix-up attempts `raw/<anim>_fixNN.png`, long-strip halves in `raw/_parts/` (all skipped by the packer) |
| `frames/<anim>/` | cleaned final frames `<anim>_NN.png` (NN = 00, 01, ...), written by the packer or touched up by hand |
| `ui/` | `portrait.png`, `cutin.png`, `select.png`: ChatGPT output saved here directly; the packer removes the magenta and fits them to 96×96, 480×128, 384×384 |
| `hitboxes.json` (optional) | per-frame hit/hurt overrides; see MOVES_AND_VFX.md §6 |

Status of every asset: [art/TRACKER.md](../../TRACKER.md) (human) and
[art/manifest.json](../../manifest.json) (machine). Build: `npm run sprites naruto`.
