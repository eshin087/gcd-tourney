# Sasuke (Shippuden / Hebi era): character design brief

> **ART-SCALE-01 user correction:** preserve Gojo's original approved compact head and slender adult proportions (model v03, idle v02). The enlarged-head candidates are rejected. Use the original Gojo as the visual scale reference when reviewing the cast; retain character height differences and stable anatomy through animations. Never enlarge Gojo to satisfy the nominal 31px target. See [CHARACTER_SCALE.md](../../CHARACTER_SCALE.md).

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (frame-by-frame poses),
> [MOVES_AND_VFX.md](MOVES_AND_VFX.md) (how each move looks in the engine) and
> [PROMPTS.md](PROMPTS.md) (copy-paste image prompts in generation order).
> Every number here follows **art spec v2**:
> [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md) and
> [art/SPEC.md](../../SPEC.md). If this file disagrees with them, **ADR 0007 / SPEC.md win**. Fix this file.

| | |
|---|---|
| Engine id | `sasuke` (folder `art/characters/sasuke/`, output `public/characters/sasuke/`) |
| Engine definition | `src/characters/sasuke.js` (read it for names, colors and stats; do not edit it for art). Its 3D placeholder model still wears the Part 1 outfit; that is expected until a separate restyle task (ADR 0007). |
| Design era | **Naruto Shippuden, Hebi era** (about 16 years old): white open-chest shirt, purple rope belt, navy waist cloth, sword sheathed at the back of the belt. **No forehead protector.** |
| HUD name / subtitle | `SASUKE` / "Last of the Clan" |
| Signature rush (1 bar) | **CHIDORI**: lightning in the hand held low behind him, a low sprint, a spear-hand thrust (`special`) |
| Air projectile (½ bar) | **FIREBALL**: Great Fireball Technique, a big fireball breathed from the mouth (`throw`) |
| Ultimate (3 bars) | **AMATERASU**: Mangekyo glare (`superPose`); engine draws black flames |
| SUPER (3 bars) | **KIRIN**: call storm and command lightning (`beamCharge` -> `beamFire`) |
| Sword | the Kusanagi-style straight sword is part of the design only. It stays **sheathed at the back of the belt in every animation**; the moveset never swings it (Chidori is hand-based). |
| Character color | `#4a7bff` (HUD, afterimages, vanish ring, super-dash bursts) |
| Aura | outer `#408cff` (`aura [0.25, 0.55, 1.0]`), core `#ccebff` (`auraCore [0.8, 0.92, 1.0]`) |
| Beam colors | core `#f0fbff`, mid `#62b8ff`, edge `#3a54ff` |
| Stats | fastest of the starters: speed 6.2, power 1.05, defense 0.95 |
| Legal | Fan art for a personal, non-commercial demo. A public or commercial release needs a license or an original redesign (see the root README). |

## One-paragraph look

Trait-only description (no names), used as `{{TRAITS}}` in shared prompts such as the title key art
(`art/ui/PROMPTS.md`) and as the fallback `CHARACTER:` line (§9):

> a lean, pale young ninja of about 16 with a cold, calm, precise air, drawn with realistic anime
> proportions (about 6.5 heads tall, not chibi); black hair with a dark-blue sheen, spiky and swept back
> at the back of his head, with long bangs framing both sides of his face down past the jaw and a few
> strands falling between his sharp, narrow dark eyes; no forehead band; a white long-sleeved shirt with
> a tall stand-up collar, worn open in a deep V to mid-chest, with a small red-and-white round
> paper-fan emblem on the back of the collar; a thick purple rope belt tied in a big bow at the back; a
> dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants; dark navy arm
> guards on his forearms; black open-toed ninja sandals; a straight sword in a black sheath tucked
> horizontally through the rope belt at the small of his back, always sheathed

---

## 1. Who he is on screen

Cold, calm and precise. Sasuke never wastes motion and never shows effort he doesn't need. Where
Naruto is loud and over-committed, Sasuke is compact and exact: a tight guard, short decisive strikes,
balanced landings, and a flat, unimpressed stillness between exchanges. He shouts only on big moves
(launcher, finisher, jutsu, ultimate).

Motion language for every animation:

- **Economy:** short anticipation (one frame where possible), a hard snap into the active pose, a
  clean, controlled recovery. No flailing except when he gets hit.
- **Straight lines:** strikes travel in straight lines along the screen horizontal toward
  screen-right. Kicks are high and clean, with pointed toes and a straight supporting leg.
- **Low center:** his fighting stance, dashes and the Chidori sprint are low, torso leaning forward.
- **Realistic weight:** with ~6.5-head proportions the limbs are long. Show it: long reaches, full hip
  rotation on punches, the supporting leg fully planted on kicks. No rubbery, cartoon squash beyond
  the 1 to 2 px noted per frame.
- **Cold face:** default expression is an emotionless, narrow-eyed stare with a flat mouth. At most a
  faint one-sided smirk in the intro and win. Gritted teeth when hurt, never crying or goofy.
- **Sharingan:** his eyes turn red with three black tomoe for jutsu, the ultimate and the taunt
  (schedule in §5).

## 2. Identity checklist (the silhouette test)

If a frame is missing any of these, it is off-model. Check them in every strip.

1. **Hair:** black with a dark-blue sheen. Spiky at the **back**: a mass of thick spikes swept
   backward and up behind the head (they add width behind the head and some height on top). **Long
   bangs frame both sides of the face** and hang a little past the jawline; a few shorter strands
   fall across the forehead and between the eyes. Never brown, never grey, never a neat bowl cut.
2. **No forehead protector.** No headband, no steel plate, no headband tails. This is the biggest
   difference from the Part 1 design.
3. **Face:** a longer, sharper, older face than Part 1: angular jaw, narrow sharp **dark** eyes (onyx,
   not blue), straight brows, small nose, thin mouth. Pale skin.
4. **Shirt:** white, long-sleeved, loose. A **tall stand-up collar** that rises behind and beside the
   jaw, worn **open in a deep V** from the collar down to about mid-chest, so his chest shows. The
   shirt tucks under the rope belt.
5. **Crest:** a small Uchiha fan crest (a round paper fan, red top half, white bottom half, short
   handle) on the **back of the collar**. Visible only in back-turned frames and the model-sheet back
   view; at sprite scale it is a few pixels of red over white.
6. **Rope belt:** a **thick purple rope** wrapped around the waist and tied in a **big bow at the
   back** (two loops plus two hanging ends). From the 3/4 front view the bow peeks out behind his lower
   back.
7. **Waist cloth:** a **dark navy cloth** wrapped around the waist under the rope, hanging to the
   **knees** like a short apron-skirt. It is open enough at the front for the legs to move; it flaps
   with motion.
8. **Pants:** dark navy, loose, down to the ankles.
9. **Arm guards:** dark navy guards over the forearms, from just below the elbow to the wrist. The
   white sleeve ends under them. Hands bare.
10. **Sandals:** black open-toed ninja sandals, toes visible.
11. **Sword:** a straight sword in a **black sheath**, tucked nearly horizontally through the rope
    belt at the small of his back, the dark grip sticking out past his **right** hip. Always sheathed,
    never in his hand.
12. **Build:** about **6.5 heads tall**, lean and athletic: long legs, defined but narrow shoulders,
    long neck under the collar, a flat, lightly defined chest and stomach in the open shirt. Not
    chibi, not bulky, not western-realistic.

Off-model in any frame: a forehead protector, the Part 1 outfit (navy short-sleeved shirt, white
shorts, leg wraps), the dark cloak or the grey Taka-era shirt, a drawn sword, curse-mark patterns,
a pinwheel-shaped Mangekyo eye outside `superPose`, chibi proportions (a big head, short legs).

## 3. Proportions and landmarks (final 256×256 cell)

Art spec v2 (ADR 0007): 256×256 cell, pivot `[128, 240]`, `pixelsPerUnit` 128, facing right, 3/4 view
(body turned about 35° toward the camera, head turned a bit more so both eyes show, camera about 12°
above). Full rules: [SPEC.md](../../SPEC.md).

- About **6.5 heads tall**: the official Shippuden look, serious and anime-accurate. Head (chin to
  top of skull) about **31 px**. Standing upright body (soles to top of skull, legs straight) about
  **200 px**. The crotch sits at about half the body height.
- Hair adds up to about **16 px** above the skull (the back spikes) and 20 to 28 px behind the head.
  The side bangs hang about 8 px below the chin.
- In the **idle stance** (knees bent about 20°, slight forward lean) the top of the skull sits at
  about y 52 and the hair top at about y 36, so the trimmed height including hair is about **204 px**,
  the idle `bodyHeight`.
- **Same anatomical scale as Naruto:** 200px neutral skeleton and about 31px skull-to-chin,
  excluding hair. Follow [CHARACTER_SCALE.md](../../CHARACTER_SCALE.md): measure source landmarks,
  calibrate uniform source scale, and inspect bone lengths through transitions. `bodyHeight` is a
  pose envelope and fallback, not a substitute for measurements. Redraw a disproportionate or
  oversized pose when uniform scale cannot preserve both anatomy and cell bounds.
- Keep every opaque pixel inside **x 4..251, y 4..240** (the cell margin).

Idle stance landmarks, in final cell pixels (x from the left, y from the top; soles on y 240, body
center line x 128). They match the ADR 0007 landmark table:

| landmark | y (px) | x (px) |
|---|---|---|
| top of hair (back spikes) | ~36 | spikes reach back to ~x 98 |
| top of skull | ~52 | |
| eyes | ~66 to 70 | |
| chin | ~83 | collar points rise to ~y 78 beside the jaw |
| shoulders | ~92 | |
| chest (open V of the shirt from the collar down to ~y 118) | ~96 to 124 | |
| rope belt | ~128 to 136 | bow knot behind the lower back at ~x 104; loops and rope ends hang to ~y 162 |
| sword (sheathed) | ~134 to 142 | grip end sticks out behind the near hip at ~x 90 to 100 |
| stomach / belt zone | ~124 to 150 | |
| hips / crotch | ~152 | |
| hem of the waist cloth | ~190 to 196 | |
| knees | ~196 | |
| soles (floor line) | 240 | front (L) toes ~x 172, back (R) heel ~x 86 |
| lead (L) hand, open knife-hand | ~78 to 90 | ~172 to 180: the idle front edge, nothing in idle reaches past ~x 182 |
| rear (R) fist | ~102 | ~150 |

Strike heights on a same-size opponent (ADR 0007) and the contact zones of his active frames
(frame-local px, facing right). Per-frame values are in [ANIMATIONS.md](ANIMATIONS.md):

| zone | y (px) | used by (contact zone x, y) |
|---|---|---|
| HIGH (face) | 58 to 90 | `light1` lead fist (206-226, 64-86), `light2` rear fist (214-236, 70-92), `light4` foot (224-248, 56-88), `heavy` f3 R foot (180-208, 58-86), then overhead f4 R foot (160-188, 22-46) |
| MID (chest) | 92 to 124 | `airLight1` fist (206-230, 100-120), `airLight3` heel (222-248, 105-150) |
| LOW (stomach) | 122 to 152 | `light3` sole (222-246, 122-148), `airLight2` foot (220-246, 130-155), Chidori thrust hand (194-222, 128-158) |
| down-forward | | `airHeavy` clasped fists (180-218, 160-206) |
| jutsu origins | | Fireball: mouth at ~(192, 125); Kirin strike: pointing fingertips near (230, 122); Kirin call: measure raised palm after packing; Chidori lightning: low behind (64, 199), forward (218, 140). These are planning targets; measured anchors win. |

**Forward-most rule.** On active frames the striking fist, foot or hand is the right-most part of the
silhouette. Bangs, rope ends, the waist cloth and the sword stay behind it (and behind about x 172 to
174, the idle front edge minus 9 px, unless the frame is a lunge).

## 4. Facing, near side and handedness

- Sprites always face **right**. The engine mirrors them when he faces left.
- Facing right in a 3/4 view, his **right side is nearest the camera**. In every brief:
  - **R arm / R leg = near** (drawn in front of the body, fully visible).
  - **L arm / L leg = far** (partly behind the torso).
- **Stance:** L foot forward, R foot back (orthodox). **Lead hand = L** (open knife-hand at chin
  height). **Rear hand = R** (fist in front of the chest).
- **Chidori hand = R (near) hand.** In the anime he often forms Chidori in his left hand. We use the
  near hand so the lightning is never hidden behind his body, and mirroring for left-facing play swaps
  handedness anyway. Keep it consistent in every Chidori and Lightning Lance frame.
- **Sword placement per view** (it lies across the small of his back at belt level, the bow over its
  middle, grip end past the right hip):
  - 3/4 view facing right: a short dark bar behind his near hip, the grip end pointing back
    (screen-left) and slightly down; the sheath tip is hidden behind the far hip.
  - front view: only the grip end shows beside his right hip (screen-left) and the sheath tip beside
    his left hip.
  - true side profile facing right: a short end-on stub behind the hip, under the bow.
  - back view (and back-turned frames): a full horizontal bar across the small of the back, the bow
    knot over its middle.
- Mirroring flips the crest and the sword side. That is accepted for the demo.

## 5. Face, eyes and the Sharingan

| expression | look | used in |
|---|---|---|
| **cold** (default) | emotionless: upper lids low and straight, brows level and low, mouth a short flat line | idle, run, dash, jumps, land, guard, getup, airRecover |
| **focused / angry** | brows hard down at the inner ends, eyes narrowed further, mouth tight or teeth just showing | normals (active frames), superDash, vanish |
| **shout** | mouth open (teeth and `#5a1a22` interior visible), brows down | `light4`, `heavy`, `airHeavy`, `special` thrust, `beamFire`, `charge` |
| **faint smirk** | one mouth corner barely raised, half-lidded eyes, chin up | intro, win |
| **pain** | eyes squeezed shut or wide with tiny pupils, teeth gritted or mouth open | hurtHigh, hurtLow, launched, spin, down |
| **eyes shut** | lids closed, brows strained | block, ko |
| **dazed** | half-lidded, unfocused, mouth slightly open | stagger |
| **Sharingan glare** | red eyes, brows down, intense stare | special, throw, beamCharge, beamFire, charge, taunt |

Normal eyes: dark iris `#2c2c40`, pupil and lash line `#141018`, whites `#f4f2f8`, one 1 px
`#ffffff` catch-light. At sprite scale each eye is about 4 to 5 px tall.

**Sharingan** (red eyes with three tomoe; the three-tomoe form only):

- Full detail (UI art and the expression sheet): red iris `#d81e28`, a thin dark-red ring `#7c0c16`
  around the iris and around the pupil, black pupil `#141018`, three black comma-shaped tomoe evenly
  spaced on the ring.
- At sprite scale: a red iris (`#d81e28`) with a dark-red rim (`#7c0c16`) and a 1 px black pupil.
  Tomoe are 1 px black dots if they fit, otherwise skip them. The red must read at a glance.

**Sharingan schedule.** "ON" means every frame of the animation:

| ON | OFF (dark eyes) |
|---|---|
| `special` (Chidori), `throw` (Fireball), `beamCharge`, `beamFire`, `charge`, `taunt`, UI cut-in, UI select art | everything else, including `intro`, `win` and the HUD portrait |

## 6. Hair, rope bow, waist cloth and sword motion

- **Back spikes** are stiff. They move as one mass (1 to 2 px squash or stretch on impacts and
  landings) and never bend like cloth.
- **Long side bangs** (and the short forehead strands) lag one frame behind the head:
  - moving forward (run, dash, superDash, Chidori sprint): stream back toward screen-left;
  - moving backward (backDash, hurt, launched, block): whip forward toward screen-right;
  - rising: dragged downward; falling: lifted upward;
  - landing or impact: overshoot 2 to 3 px past rest, then settle the next frame;
  - aura (charge, beamCharge, special startup): blown upward and flickering.
- **Rope bow** (two loops and two hanging ends at the back) follows the same lag rules as the bangs
  and swings 2 to 4 px. It is the clearest secondary motion at the waist.
- **Waist cloth** is heavier cloth. Its hem flares and flaps 2 to 6 px: it streams back and parts
  around the legs when he runs or dashes, lifts when he falls, drags down when he rises, flares
  outward in spins, and whips forward when he is hit. On kicks the cloth splits at the front and the
  kicking leg comes out between the panels; **the cloth never covers or reaches past the striking
  foot** on active frames.
- **Shirt:** the collar is stiff and never flutters. The open lapels may flap 1 to 2 px, the loose
  white sleeves ripple 1 to 2 px. The **arm guards** stay rigid.
- **Sword:** rigid, moves only with the hips, never flops or swings loose, never drawn. In spins it
  turns with the body.

## 7. Palette (34 colors, limit 48)

Some ramps are the exact hexes from `src/characters/sasuke.js` (`model.palette`, `model.face`):
skin, hair, the navy (`shirt` ramp, now used for the cloth), steel, iris, mouth, outline. The
Shippuden outfit adds new ramps (✚): white shirt, purple rope, black. Use **only** these colors in
character frames. ADR 0007 allows up to 48 (the packer warns above 64), so there are 14 spare slots:
list any color you add here first.

| # | material | highlight | light | base | shadow | deep / line | source |
|---|---|---|---|---|---|---|---|
| 1 | outline, pupils, tomoe, darkest black (sandal and sheath shadow) | | | | | `#141018` | `face.line` |
| 2–6 | skin (face, neck, open chest, hands, toes) | `#fff1e4` | | `#fbd8bd` | `#e0a283` | `#c4866a`, `#9c6450` ✚ (muscle and crease lines, nostrils) | `skin`, `face.skinLine` |
| 7–11 | hair | `#6a78a8` ✚ (sheen glints) | `#4a5684` (sheen) | `#2e3556` / `#1e2032` | `#0e0f18` | | `hair` |
| 12 | iris (normal eyes) | | | `#2c2c40` | | | `face.iris` |
| 13–14 | Sharingan, crest red | | | `#d81e28` ✚ | `#7c0c16` ✚ (rim, pupil ring, crest shadow) | | new |
| 15 | mouth interior | | | `#5a1a22` | | | `face.mouth` |
| 16–20 | white shirt, eye whites, teeth, crest bottom | `#ffffff` (specular, teeth, catch-light) | `#f4f2f8` ✚ | `#e2dfec` ✚ | `#bdb7d0` ✚ | `#928ca8` ✚ (deep folds, inner lines) | new |
| 21–24 | purple rope belt and bow | `#c4a2ec` ✚ | | `#9a72d2` ✚ | `#6a46a6` ✚ | `#432a72` ✚ | new |
| 25–28 | navy: waist cloth, pants, arm guards | `#4a64ac` | | `#2e4282` | `#1a2650` | `#10173a` ✚ | `shirt` |
| 29–31 | black: sandals, soles, sword sheath and grip | `#4a4c62` ✚ (lacquer sheen) | `#2e3044` ✚ | `#1e1f2e` ✚ | `#141018` (outline) | | new |
| 32–34 | steel: sword guard and end cap | `#e4eaf4` | | `#b8c2d2` | `#76829a` | | `metal` |

Not used in v2 (Part 1 or placeholder only, do **not** add back): the headband ramps (`band`), the
white-shorts ramp, the old navy sandal ramp `#454f8c` / `#2a2f58` / `#171a36`, the sole ramp
`#2a2228` / `#181216` / `#433840` (use the black ramp), `face.irisDark #121218` (use `#141018`),
`face.sclera #f6f2f4` (use `#f4f2f8`), `face.symbol #3a3448` (no headband symbol any more).

Material rules:

- **Outline:** 1 px `#141018` on the outer silhouette. Inner lines may use the darkest tone of the
  material (selective outline): `#928ca8` between shirt folds, `#432a72` between rope twists,
  `#10173a` in the waist-cloth folds, `#9c6450` / `#c4866a` for the nose, ear and chest lines.
- **Lighting:** key light from the upper-front-right (his front). Light tones on top and front
  surfaces (screen-right). Shadows on the back (screen-left), under the hair, chin, collar, rope and
  arms. Realistic shading means more planes, not soft gradients: use the extra tones for the folds
  of the loose shirt and the lean muscle of the chest and forearms.
- **White shirt:** mostly `#f4f2f8` and `#e2dfec` with `#bdb7d0` folds and `#928ca8` deep creases;
  `#ffffff` only on a few lit edges. It must never read grey overall.
- **Hair:** mostly `#1e2032` and `#0e0f18`, with `#2e3556` planes on the top and front of the spikes,
  a few sharp `#4a5684` sheen streaks and single `#6a78a8` glints. Never brown, never pure grey.
- **Purple rope:** twisted-rope texture drawn as short diagonal bands of `#9a72d2` and `#6a46a6` with
  `#c4a2ec` on lit twists. It must read clearly purple, not pink, not blue.
- **Navy cloth vs. hair:** the navy cloth is bluer and more saturated than the hair. Keep them apart.
- **No** gradients, dithering, noise, glow, soft shadows or anti-aliasing. Hard pixels only.

Effect colors (**not** part of the body sprite palette; for VFX and UI art only):

| effect | colors |
|---|---|
| Chidori lightning (`lightning` tint, hand glow, arcs) | `#ffffff` core, `#d8f0ff`, `#9ad8ff`, `#5aa8ff`, `#3a54ff` outer; runtime tints: hand `#d8f0ff`, glow `#5aa8ff`, extra arcs `#ffffff`, sprint afterimages `#9ad8ff` |
| Fireball (`fire`, full color) | `#fff4c0`, `#ffd04a`, `#ff9a24`, `#f05a14`, `#c42a10`, `#6a1a0a` (dark edge); runtime glow `#ff7a20`, explosion `#ff8a30` |
| Lightning Lance beam (shader) | core `#f0fbff`, mid `#62b8ff`, edge `#3a54ff`; beam-hit explosion `#62b8ff` |
| Chakra aura (tinted white art) | outer `#408cff`, core `#ccebff` |
| Character color (dash bursts, vanish ring) | `#4a7bff` |

## 8. Reference folder (`reference/`)

Codex files every generated reference image here with a `_vNN` version (ADR 0007). Versions are never
overwritten, reused or deleted; the highest number is the latest candidate. The approved version is
**copied** to the fixed name, which is what later prompts attach.

| file | what | from |
|---|---|---|
| `reference/model_sheet_vNN.png` | model-sheet candidates: turnaround (front, 3/4 right, true side profile, back), fighting stance, palette swatches | PROMPTS.md S1 |
| `reference/model_sheet.png` | **copy** of the approved model-sheet version | Codex, after "approve sasuke model_sheet vNN" |
| `reference/expressions_vNN.png` | expression-sheet candidates (8 heads incl. the Sharingan) | PROMPTS.md S2 |
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

Lion's Barrage opener = a rising anti-air kick.

If the image generator refuses or waters down a prompt that names the character, replace the
`CHARACTER:` line of the prompt with this block. Also drop "Sasuke", "Uchiha", "Naruto",
"Shippuden", "Hebi", "Sharingan", "Chidori" and "Kusanagi" from the prompt (table below). Never name
the original artist or studio.

> CHARACTER: an original character inspired by classic shonen ninja anime, fan-art sprite for a
> personal non-commercial game project: a lean, pale young man of about 16 with a cold, calm, precise
> air, drawn with realistic anime proportions (about 6.5 heads tall, not chibi). Black hair
> with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides
> of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. No
> forehead band. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to
> mid-chest, with a small red-and-white round paper-fan emblem on the back of the collar. A thick
> purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth
> wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his
> forearms. Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally
> through the rope belt at the small of his back, its dark grip past his right hip; the sword always
> stays sheathed.

Replacement terms:

| instead of | write |
|---|---|
| Sharingan | "glowing red eyes with three small black comma marks around the pupil" |
| Chidori | "a crackling ball of blue-white lightning in his open hand" (the move: "lightning-hand rush") |
| Great Fireball Technique | "breathing a large ball of fire from his mouth" |
| Kirin | "a raised-arm storm call followed by a downward pointing command" (no lightning drawn) |
| Chidori Sharp Spear | "an empty left lead-hand spear thrust" |
| Lion's Barrage | "a rising anti-air kick" |
| Sharingan Counter | "a calm reading stance with red eyes" |
| Amaterasu | "a cold still eye-technique stare" (no flames drawn) |
| Mangekyo Sharingan | "red eyes with a bold black three-bladed pinwheel around the pupil" |
| Uchiha crest | "a small red-and-white round paper-fan emblem" |
| Kusanagi | "a straight sword in a black sheath" |
| Naruto Shippuden / Hebi outfit | "his older teenage outfit" (and keep the full trait list) |
| "in the style of <artist>" | "late-2000s shonen TV anime look: realistic teenage proportions, sharp angular face, narrow eyes, bold clean line art, flat cel shading" |

## 10. Files in this folder

| path | what |
|---|---|
| `CHARACTER.md` | this brief |
| `ANIMATIONS.md` | every animation, frame by frame (poses, phases, contact zones, anchors) |
| `MOVES_AND_VFX.md` | how each move plays in the engine, which VFX it uses, Sasuke-specific effect requests, hitbox overrides |
| `PROMPTS.md` | copy-paste image prompts in generation order, with the versioned file name of each asset |
| `reference/` | model-sheet and expression-sheet versions, the approved copies, the idle anchor (§8) |
| `raw/` | generated strips `raw/<anim>_vNN.png` (the packer uses the highest version; a plain `raw/<anim>.png` only when no versioned file exists), single-frame fix attempts `raw/<anim>_NN_fixMM.png` (NN = frame, MM = attempt; skipped by the packer; the patched strip is saved as the next `_vNN`), parts `raw/_parts/<anim>_vNN_A.png` / `_B.png`, UI candidates `raw/ui_<name>_vNN.png`, rejected versions in `raw/_rejected/` (ignored by the packer) |
| `frames/<anim>/` | cleaned final frames `<anim>_NN.png` (NN = 00, 01, ...), written by the packer or touched up by hand |
| `ui/` | `portrait.png`, `cutin.png`, `select.png`: the approved `raw/ui_<name>_vNN.png`, fitted to 96×96, 480×128, 384×384 |
| `hitboxes.json` (optional) | per-frame hit/hurt overrides in 256-cell px; see MOVES_AND_VFX.md §5 |

Review queue: [art/REVIEW.md](../../REVIEW.md). Status of every asset: [art/TRACKER.md](../../TRACKER.md)
(human) and [art/manifest.json](../../manifest.json) (machine, with `version` and `approvedVersion`).
Build: `npm run sprites sasuke`.


## Current kit constraints (ADR 0011)

- Chidori uses the right hand, except Chidori Sharp Spear (`specialForward`), which uses the left lead hand.
- Three-tomoe Sharingan: specialForward f1-f4, specialDown f1-f3, beamCharge and beamFire throughout.
- Mangekyo only in superPose, all four frames. No blood. Normal attacks keep dark eyes.
- Super cut-in retains three-tomoe Sharingan for the shared Kirin/Amaterasu UI.
- Sword always sheathed. All lightning, dragon, flames and energy are engine VFX.
- Terminology fallback: Sharp Spear = empty lead-hand spear thrust; Lion's Barrage = rising kick; Sharingan counter = red-eye reading stance; Amaterasu = Mangekyo glare without drawn flames; Kirin = raised-arm lightning command without drawn lightning.
