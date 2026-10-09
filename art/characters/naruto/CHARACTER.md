# Naruto (Shippuden): character design brief

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (frame-by-frame poses),
> [MOVES_AND_VFX.md](MOVES_AND_VFX.md) (how each move looks in the engine) and
> [PROMPTS.md](PROMPTS.md) (copy-paste image prompts in generation order).
> Every number here follows **art spec v2**:
> [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md) and
> [art/SPEC.md](../../SPEC.md). If this file disagrees with them, **ADR 0007 / SPEC.md win**. Fix this file.

| | |
|---|---|
| Engine id | `naruto` (folder `art/characters/naruto/`, output `public/characters/naruto/`) |
| Engine definition | `src/characters/naruto.js` (read it for names, colors and stats; do not edit it for art). Its 3D placeholder model still wears the Part 1 jumpsuit and chibi proportions; that is expected until a separate restyle task (ADR 0007). |
| Design era | **Naruto Shippuden** (about 16 years old, after the time skip): orange-and-black zip jacket, **black** forehead protector with long tails, black sandals |
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

> a lean, athletic young ninja of about 16 with a serious, confident, determined air, drawn with
> realistic anime proportions (about 6.5 heads tall, not chibi); thick spiky bright golden-blond hair,
> a little long, with pointed bangs falling over the top of his forehead plate and long spiky locks
> framing both sides of his face; sharp bright blue eyes; three thin whisker-like marks on each cheek;
> a black cloth forehead band with two long tails and a polished steel plate engraved with a
> leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest,
> upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull,
> orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems
> folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed
> ninja sandals

---

## 1. Who he is on screen

Shippuden Naruto is a trained fighter, not a scrappy kid. He is relentless and forward-driving: he
presses in, commits his whole body to every strike and never gives ground. Where Sasuke is compact
and cold, Naruto is powerful and wide: committed wind-ups, full hip and shoulder rotation, planted
stances, and a steady, determined stare. He still grins when he is ahead and shouts on big moves,
but the default read is **serious, athletic and confident**, never goofy.

Motion language for every animation:

- **Commitment:** clear anticipation (1 to 2 frames), a hard snap into the hit, then visible
  follow-through before he recovers. Recovery is quick and grounded, never stiff and never sloppy.
- **Horizontal strikes:** punches, kicks and palm thrusts travel along the screen horizontal toward
  screen-right, loaded with hip and shoulder twist. Kicks are big and swinging. The uppercut and the
  air hammer travel up-forward / down-forward, always ending **in front of** his body, never only
  above his own head.
- **Realistic weight:** with ~6.5-head proportions the limbs are long. Show it: long reaches, the
  supporting leg fully planted on kicks, the back heel lifting on rotated punches. No rubbery,
  cartoon squash beyond the 1 to 2 px noted per frame.
- **Ninja run:** torso pitched far forward, both arms trailing straight back, hands flat.
- **Wide base:** his stance is a little wider and lower than a boxer's, weight centered, knees bent.
- **Serious face:** default is a focused, determined look with the mouth closed. He shouts on every
  big move, grins on taunt and win, grits his teeth when hurt, and looks dazed (not comedic) when
  stunned.
- **Hand seals:** the cross-shaped shadow-clone seal (index and middle fingers of both hands crossed
  in a "+") is his signature pose (intro).

## 2. Identity checklist (the silhouette test)

If a frame is missing any of these, it is off-model. Check them in every strip.

1. **Hair:** bright golden-blond. Thick, sharp, triangular spikes that sweep up, back and out from
   the head, a little longer than the Part 1 look (less of a round spiky ball, more layered).
   **Longer pointed bangs** fall over the top edge of the forehead plate (they may cover part of
   the plate, never the eyes), and **long spiky side locks** frame both sides of the face down to
   about the jawline. The hair adds about 16 px above the skull and 20 to 28 px behind the head.
2. **Forehead protector:** a **black** cloth band (never navy blue: that is the Part 1 band), a bit
   wider than before, knotted at the back of the head with **two long tails** that hang to about
   the middle of the back. A rectangular polished steel plate on the forehead, engraved with the
   leaf-swirl village symbol (a spiral with a small pointed leaf tip).
3. **Eyes:** bright blue, a little narrower and sharper than the Part 1 eyes, dark pupil, one white
   catch-light. Thin, expressive brows.
4. **Whisker marks:** three thin horizontal lines on **each** cheek, fanning slightly. This is the
   strongest recognition cue at sprite scale. Never skip them, even in small or turned heads (draw
   the far cheek's marks when that cheek is visible).
5. **Jacket (Shippuden):** an orange-and-black zip-up track jacket. **Black** across the shoulders,
   the upper chest, the upper back and the upper part of the sleeves; a **black high stand-up
   collar** that rises to the jaw; a straight front zipper with a small steel pull at the collar.
   The rest of the jacket (the torso below the chest and the lower sleeves) is bright orange. Long
   sleeves to the wrists, hands bare. A **red spiral emblem** sits centered on the back (visible
   only in back-turned frames: `light4_02`, `airLight3_01`, the model-sheet back view; follow the
   approved model sheet for its exact size and placement).
6. **Pants:** orange (the same orange family as the jacket), slightly loose, with the hems **folded
   up into a cuff at the lower shin**, above the sandals. Not bound tight like the Part 1 pants.
7. **Holster:** a black kunai holster strapped around the **right thigh** (the near thigh, visible in
   the 3/4 view). Optional at sprite scale; draw it as a dark block with one strap.
8. **Sandals:** **black** open-toed ninja sandals, toes visible, dark soles.
9. **Build:** about **6.5 heads tall**, a lean, athletic 16-year-old (around 166 cm): shoulders
   clearly broader than the hips, long legs (the crotch at about half the body height), defined
   forearms and hands, a slim neck under the collar. Not chibi, not bulky, not western-realistic.
10. **Face:** slimmer and more angular than the Part 1 face: defined cheekbones and jaw, a smaller
    chin, a small nose, a wide mouth that can open in a big grin or shout. No fangs, no red or
    orange-ringed eyes (the nine-tails and sage forms are out of scope).

Off-model in any frame: the Part 1 jumpsuit (big white collar, navy headband, blue sandals, pants
bound at the shins), the sage cloak or the red-flame coat, a glowing chakra-mode body, fangs or red
eyes, chibi proportions (a big head, short legs).

## 3. Proportions and landmarks (final 256×256 cell)

Art spec v2 (ADR 0007): 256×256 cell, pivot `[128, 240]`, `pixelsPerUnit` 128, facing right, 3/4 view
(body turned about 35° toward the camera, head turned a bit more so both eyes show, camera about 12°
above). Full rules: [SPEC.md](../../SPEC.md).

- About **6.5 heads tall**: the official Shippuden look, serious and anime-accurate. Head (chin to
  top of skull) about **31 px**. Standing upright body (soles to top of skull, legs straight) about
  **200 px**. The crotch sits at about half the body height.
- Hair adds about **16 px** above the skull (the ADR allows up to 20) and 20 to 28 px behind the head.
- In the **idle stance** (feet a little wider than the shoulders, knees bent about 20°, slight forward
  lean) the top of the skull sits at about y 52 and the hair top at about y 36, so the trimmed height
  including hair is about **204 px**, the idle `bodyHeight`.
- **Same body scale and the same `bodyHeight` table as Sasuke** (ADR 0007). If the approved idle reads
  more than 3 px bigger or smaller in head size than Sasuke's in the Sprite Lab, Codex sets
  per-character `bodyHeight` overrides in `art/manifest.json` and logs them in `art/TRACKER.md`.
  Don't redraw for it.
- Keep every opaque pixel inside **x 4..251, y 4..240** (the cell margin).

Idle stance landmarks, in final cell pixels (x from the left, y from the top; soles on y 240, body
center line x 128). They match the ADR 0007 landmark table:

| landmark | y (px) | x (px) |
|---|---|---|
| top of hair spikes | ~36 | spikes reach back to ~x 100 |
| top of skull / headband | ~52 to 62 | plate centered ~x 142 (the face is turned toward screen-right) |
| eyes | ~66 to 70 | |
| chin | ~83 | side locks hang to ~y 80; headband tails hang behind the head to ~y 130 |
| shoulders | ~92 | black yoke from the collar down to ~y 108 on the chest |
| chest | ~96 to 124 | |
| stomach / jacket hem | ~124 to 150 | jacket hem at ~y 148 |
| hips / crotch | ~152 | holster on the near (R) thigh ~y 158 to 178 |
| knees | ~196 | |
| pant cuffs | ~214 to 222 | |
| soles (floor line) | 240 | front (L) toes ~x 176, back (R) heel ~x 84 |
| lead (L) fist | ~86 | ~170 to 182: the idle front edge, nothing in idle reaches past ~x 182 |
| rear (R) fist | ~98 | ~154 |

Strike heights on a same-size opponent (ADR 0007) and the contact zones of his active frames
(frame-local px, facing right). Per-frame values are in [ANIMATIONS.md](ANIMATIONS.md):

| zone | y (px) | used by (contact zone x, y) |
|---|---|---|
| HIGH (face) | 58 to 90 | `light1` lead fist (206-226, 64-86), `light2` rear fist (214-236, 70-92), `light4` foot (224-248, 56-88), `heavy` f3 fist (180-208, 58-86), then overhead f4 (160-188, 22-46) |
| MID (chest) | 92 to 124 | `airLight1` fist (206-230, 100-120), `airLight3` heel (222-248, 105-150) |
| LOW (stomach) | 122 to 152 | `light3` sole (222-246, 122-148), `airLight2` foot (220-246, 130-155), Rasengan thrust palm (194-222, 128-158) |
| down-forward | | `airHeavy` clasped fists (180-218, 160-206) |
| hand anchors | | Rasengan orb in the R palm (205, 148) on every `special` frame; Rasen Cannon palms in (222-238, 112-132), beam origin (230, 122); shuriken release (186-212, 116-142), spawn point (192, 125) |

**Forward-most rule.** On active frames the striking fist, foot or palm is the right-most part of the
silhouette. Bangs, side locks, headband tails and the jacket hem stay behind it (and behind about
x 174, the idle front edge minus 9 px, unless the frame is a lunge; keep hair and tails behind about
x 172 on active frames).

**Scale note.** The packer scales each strip so its tallest frame matches that animation's
`bodyHeight` in `art/manifest.json` (ADR 0007 table). A raised fist or flying hair makes the tallest
frame: `heavy` (218) and `win` (212) assume the raised fist ends near the top of that height, not far
above it. If an approved strip still looks bigger or smaller than idle in the Sprite Lab, Codex
corrects that animation's `bodyHeight` in the manifest and notes it. Don't redraw the art for it.

## 4. Facing, near side and handedness

- Sprites always face **right**. The engine mirrors them when he faces left.
- Facing right in a 3/4 view, his **right side is nearest the camera**. In every brief:
  - **R arm / R leg = near** (drawn in front of the body, fully visible).
  - **L arm / L leg = far** (partly behind the torso).
- **Stance:** L foot forward, R foot back (orthodox). **Lead hand = L** (fist at chin height).
  **Rear hand = R** (fist guarding the right jaw).
- **Rasengan hand = R (near) hand.** That matches how he usually holds it, and it keeps the orb from
  being hidden behind his body. Shuriken throws, the taunt point and the win fist pump also use the
  R hand.
- **Holster** on the R (near) thigh: visible in the 3/4 and front views, a small dark block behind
  the leg in the back view.
- Mirroring flips the leaf symbol and the back spiral. That is accepted for the demo.

## 5. Face and expressions

| expression | look | used in |
|---|---|---|
| **determined** (default) | brows slightly lowered, eyes steady and locked on the opponent, mouth closed in a firm line | idle, guard, intro, getup end, recoveries |
| **focused** | brows down, eyes narrowed, mouth closed | run, dash, jumps, anticipation frames |
| **fierce** | brows hard down, teeth gritted and showing | light attacks (active), superDash, dash |
| **shout** | mouth wide open (teeth and `#5a1a22` interior visible), brows down, eyes intense | `light4`, `heavy`, `airHeavy`, `special`, `charge`, `beamCharge`, `beamFire`, `win_01` |
| **confident grin** | wide toothy grin, eyes narrowed with confidence (open, not closed in arcs) | `taunt`, `win`, `special_02` |
| **pain** | eyes squeezed shut, teeth gritted or mouth open in a grimace | hurtHigh, block, launched, spin, down_00 |
| **gasp** | eyes wide with small irises, mouth open | hurtLow_00 |
| **dazed** | eyelids half closed, eyes unfocused, brows raised and slack, mouth slightly open | stagger |
| **out** | eyes closed (lines), mouth slightly open, brows relaxed | down_01, ko |

No comedic faces in v2: no spiral "dizzy" eyes, no eyes closed in happy arcs, no sweat drops.

Eyes: iris `#2f86ec` with a `#1a3f8e` dark upper half and rim and a `#7cc0ff` light lower edge,
pupil and lash line `#1d1420`, whites `#f1eef6`, one 1 px `#ffffff` catch-light. At sprite scale each
eye is about 4 to 5 px tall. Whisker marks: three 1 px lines per cheek, 4 to 6 px long, in `#b9704f`.
On the large UI art (portrait, cut-in, select) they may be drawn in the outline color `#1d1420` for
crispness.

## 6. Hair, headband and jacket motion

- **Hair spikes** are stiff. They move as one mass (1 to 2 px squash or stretch on landings and
  impacts, 1 px lag on bobs) and never bend like cloth. The **side locks** and **bangs** lag one
  frame behind the head.
- **Headband tails** are the main secondary-motion part. They are long now, so keep them readable but
  inside the cell. They lag one frame behind the head:
  - moving forward (run, dash, superDash, Rasengan rush): stream back toward screen-left;
  - moving backward (backDash, hurt, launched, block): whip forward toward screen-right;
  - rising: dragged downward; falling: lifted upward;
  - landing or impact: overshoot 2 to 3 px past rest, then settle the next frame;
  - aura (charge, beamCharge, beamFire): blown upward / backward and flickering;
  - **active frames of attacks: always behind the head (screen-left)**, never past the striking limb.
- **Collar** is stiff and never flutters. The **jacket hem**, **sleeve cuffs** and **folded pant
  cuffs** can ripple 1 to 2 px. The **zipper pull** may swing 1 px. The holster is rigid.

## 7. Palette (34 colors, limit 48)

Some ramps are the exact hexes from `src/characters/naruto.js` (`model.palette`, `model.face`):
skin, hair, the orange `jacket` ramp, steel, whites, iris, mouth, outline. The Shippuden outfit
adds new ramps and tones (✚): the black cloth ramp, deeper shading tones for realistic form, the
spiral shadow. Use **only** these colors in character frames. ADR 0007 allows up to 48 (the packer
warns above 64), so there are 14 spare slots: list any color you add here first.

| # | material | highlight | light | base | shadow | deep / line | source |
|---|---|---|---|---|---|---|---|
| 1 | outline, pupils, lash lines, darkest line | | | | | `#1d1420` | `face.line` |
| 2–7 | skin (face, neck, hands, toes) | `#ffe2c6` | | `#f8c69b` | `#eaa77e` ✚, `#d98a66` | `#b9704f` (whiskers, nose, ear, mouth corners), `#8a4a3a` ✚ (core shadow under the chin and between the fingers, inner face lines) | `skin`, `face.skinLine` |
| 8–12 | hair | `#fff6c2` (spike-tip glints) | `#ffe36a` | `#ffc935` | `#e0861c` | `#a85a14` ✚ (undersides of spikes, behind the ears, under the bangs) | `hair` |
| 13–17 | orange cloth: jacket body, lower sleeves, pants | `#ffc878` ✚ | `#ffac48` | `#f88320` | `#c44d14` | `#8f3310` ✚ (deep folds, cuff creases) | `jacket` |
| 18–21 | black cloth: jacket yoke and upper sleeves, collar, headband cloth and tails, sandals and soles, holster | `#5a5c74` ✚ (rim light, fold edges) | `#3a3b4e` ✚ | `#26273a` ✚ | `#15151f` ✚ | | new |
| 22–24 | steel: headband plate, zipper pull | `#e4eaf4` (+ `#ffffff` specular, shared) | | `#b8c2d2` | `#76829a` (leaf engraving, with `#1d1420`) | | `metal` |
| 25–27 | iris | `#7cc0ff` ✚ (lower edge light) | | `#2f86ec` | `#1a3f8e` (upper half, rim) | | `face.iris`, `face.irisDark` |
| 28–30 | whites: eye whites, teeth, catch-lights (and a thigh bandage only if the approved model sheet shows one) | `#ffffff` | | `#f1eef6` | `#bbb5cc` | | `white` |
| 31–32 | mouth interior, tongue | | | `#5a1a22` | | `#a8424a` ✚ (tongue) | `face.mouth` |
| 33–34 | back spiral emblem | | | `#c8282a` ✚ | `#8a1a20` ✚ | | new |

Not used in v2 (Part 1 or placeholder only, do **not** add back): the navy headband ramp
`#3e4fa0` / `#25306e` / `#141a46` (`band`), the blue sandal ramp `#5a88e2` / `#2d55b4` / `#1b3376`
(`sandal`), the navy-black yoke ramp `#474a72` / `#2b2c42` / `#17182a` (`black`; replaced by the
neutral black ramp), the separate pants ramp `#ffa040` / `#f07a1e` / `#b9461a`, the sole ramp
`#5a4440` / `#3b2b2a` / `#241818`, `face.sclera #f6f2f4` (use `#f1eef6`), `face.symbol #3a3448`
(engrave the leaf with `#76829a` and `#1d1420`).

Material rules:

- **Outline:** 1 px `#1d1420` on the outer silhouette. Inner lines may use the darkest tone of the
  material (selective outline): `#8f3310` between jacket and pant folds, `#a85a14` between hair
  spikes, `#b9704f` / `#8a4a3a` for the nose, ear, jaw and knuckles, `#15151f` in the black cloth.
- **Lighting:** key light from the upper-front-right (his front). Light tones on top and front
  surfaces (screen-right). Shadows on the back (screen-left), under the hair, chin, collar and arms.
  Realistic shading means more planes, not soft gradients: use the extra tones for the cheekbones and
  jaw, the forearms and knuckles, and the big folds of the jacket and pants.
- **Hair:** mostly `#ffc935` with `#e0861c` shadow planes on the lower and back side of each spike,
  `#a85a14` in the deepest gaps, `#ffe36a` on the lit planes, and a few `#fff6c2` glints at spike
  tips facing the light. Never greenish, never brown, never pale platinum.
- **Orange:** a warm saturated orange, never red and never brown. The jacket and pants are one
  orange family; separate them with the hem's shadow band and the outline.
- **Black cloth:** a neutral, slightly cool black (`#26273a` base). Lit edges get `#3a3b4e` and a
  thin `#5a5c74` rim so the yoke, collar and headband never merge into one dark blob with the
  outline. It must not read navy blue.
- **No** gradients, dithering, noise, glow, soft shadows or anti-aliasing. Hard pixels only.

Effect colors (**not** part of the body sprite palette; for VFX and UI art only):

| effect | colors |
|---|---|
| Rasengan orb (`orb`) | `#3a7cf0`, `#7ab8ff`, `#e8f6ff`, `#ffffff` (same as the procedural orb); runtime glow tint `#8ac8ff`, sparkle tint `#bfe4ff` |
| Rasengan impact tint | `#6ab4ff` |
| Rasen Cannon beam | core `#fff6d8`, mid `#ffb43a`, edge `#ff6a10` |
| Chakra aura (tinted white art) | outer `#ff8c1f`, core `#ffeb8c` |
| Shuriken (`shuriken`) | steel `#5a6070`, edge highlight `#c8d0dc`, center hole `#1a1a24` |
| Character color (dash bursts, vanish ring) | `#ff8a1c` |

## 8. Reference folder (`reference/`)

Codex files every generated reference image here with a `_vNN` version (ADR 0007). Versions are never
overwritten or reused; the highest number is the latest candidate. The approved version is
**copied** to the fixed name, which is what later prompts attach.

| file | what | from |
|---|---|---|
| `reference/model_sheet_vNN.png` | model-sheet candidates: turnaround (front, 3/4 right, true side profile, back), fighting stance, palette swatches | PROMPTS.md S1 |
| `reference/model_sheet.png` | **copy** of the approved model-sheet version | Codex, after "approve naruto model_sheet vNN" |
| `reference/expressions_vNN.png` | expression-sheet candidates (9 heads) | PROMPTS.md S2 |
| `reference/expressions.png` | **copy** of the approved expression sheet | Codex |
| `reference/idle_approved.png` | **copy** of the approved `idle` strip (`raw/idle_vNN.png`): the pose and proportion anchor | Codex, after A01 is approved |
| `reference/_rejected/` | rejected reference candidates (names kept) | Codex |
| `reference/_old/` | art from an older spec: `model_sheet_candidate_spec-v1.png` (spec v1, Part 1, chibi). **Never attach it.** | archive |
| `reference/notes.md` | what was fixed between attempts | Codex |
| `reference/source/` (optional, local only) | official screenshots the user collects for their own comparison | user |

Every candidate gets a row in [art/REVIEW.md](../../REVIEW.md) (`needs review`); the user approves or
rejects it there or in chat.

Official screenshots are copyrighted. Keep them local for comparison only, and do not upload them to
an image generator as style sources. Attach our own approved model sheet instead. Generators may
refuse or degrade when given copyrighted frames.

## 9. Trait-only description (fallback wording)

If the image generator refuses or waters down a prompt that names the character, replace the
`CHARACTER:` line of the prompt with this block. Also drop "Naruto", "Uzumaki", "Shippuden",
"Rasengan", "Rasen Cannon" and "shadow clone" from the prompt. Never name the original artist or
studio.

> CHARACTER: an original character inspired by classic shonen ninja anime, fan-art sprite for a
> personal non-commercial game project: a lean, athletic young ninja of about 16 with a serious,
> confident, determined air, about 6.5 heads tall with realistic anime proportions (not chibi);
> thick spiky bright golden-blond hair, a little long, with pointed bangs falling over the top of his
> forehead plate and long spiky locks framing both sides of his face; sharp bright blue eyes; three
> thin whisker-like marks on each cheek; a black cloth forehead band with two long tails and a
> polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket
> (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up
> collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem
> on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster
> strapped to his right thigh; black open-toed ninja sandals

Replacement terms:

| instead of | write |
|---|---|
| Naruto Shippuden / Shippuden design | "his older teenage outfit" (and keep the full trait list) |
| Rasengan | "a swirling sphere of blue wind-energy held in his open palm" |
| shadow-clone seal / Shadow Clone Jutsu | "a cross-shaped hand sign: index and middle fingers of both hands extended and crossed in a plus shape" |
| Rasen Cannon | "a huge orange spiraling energy beam fired from both palms" |
| Uzumaki spiral | "a red spiral emblem" |
| leaf symbol / Konoha | "a leaf-swirl symbol" |
| shuriken | "small four-pointed steel throwing stars" (usually fine as is) |
| "in the style of <artist / studio>" | "modern 2000s shonen anime TV look: clean confident line art, realistic teen proportions, sharp eyes, spiky hair, flat cel shading" |

## 10. Files in this folder

| path | what |
|---|---|
| `CHARACTER.md` | this brief |
| `ANIMATIONS.md` | every animation, frame by frame (poses, phases, contact zones, QA numbers) |
| `MOVES_AND_VFX.md` | how each move plays in the engine, which VFX it uses, Naruto-specific effect requests, hitbox overrides |
| `PROMPTS.md` | copy-paste image prompts in generation order |
| `reference/` | model-sheet and expression candidates (`_vNN`), approved copies, idle anchor (§8) |
| `raw/` | generated strips `raw/<anim>_vNN.png` (the packer uses the highest version); long strips in parts `raw/_parts/<anim>_vNN_A.png` / `_B.png`; single-frame fix attempts `raw/<anim>_NN_fixMM.png` (NN = frame, MM = attempt); UI candidates `raw/ui_<name>_vNN.png`; rejected candidates in `raw/_rejected/` (the packer skips every subfolder and `ui_*` / `*_fix<digits>` files) |
| `frames/<anim>/` | cleaned final frames `<anim>_NN.png` (NN = 00, 01, ...), written by the packer or touched up by hand |
| `ui/` | `portrait.png`, `cutin.png`, `select.png`: copies of the approved UI candidates; the packer removes the magenta and fits them to 96×96, 480×128, 384×384 |
| `hitboxes.json` (optional) | per-frame hit/hurt overrides; see MOVES_AND_VFX.md §6 |

Status of every asset: [art/REVIEW.md](../../REVIEW.md) (review queue),
[art/TRACKER.md](../../TRACKER.md) (human) and [art/manifest.json](../../manifest.json) (machine).
Build: `npm run sprites naruto`.
