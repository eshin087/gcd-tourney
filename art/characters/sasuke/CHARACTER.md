# Sasuke (Part 1 / genin era) — character design brief

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (frame-by-frame poses),
> [MOVES_AND_VFX.md](MOVES_AND_VFX.md) (how each move looks in the engine) and
> [PROMPTS.md](PROMPTS.md) (copy-paste ChatGPT prompts in generation order).
> Technical rules (cell size, pivot, palette limits, file naming) live in
> [art/SPEC.md](../../SPEC.md). If this file and SPEC.md disagree, **SPEC.md wins**. Fix this file.

| | |
|---|---|
| Engine id | `sasuke` (folder `art/characters/sasuke/`, output `public/characters/sasuke/`) |
| Engine definition | `src/characters/sasuke.js` (read only for art: palette, colors, names) |
| HUD name / subtitle | `SASUKE` / "Last of the Clan" |
| Signature rush (1 bar) | **CHIDORI**: lightning in the hand, low sprint, thrust (`special`) |
| Air projectile (½ bar) | **FIREBALL**: Great Fireball Technique, a big fireball breathed from the mouth (`throw`) |
| Ultimate (3 bars) | **LIGHTNING LANCE**: blue lightning beam thrust from a spear-hand (`beamCharge` → `beamFire`) |
| Character color | `#4a7bff` (HUD, afterimages, vanish ring) |
| Aura | outer `#408cff` (`aura [0.25, 0.55, 1.0]`), core `#ccebff` (`auraCore [0.8, 0.92, 1.0]`) |
| Beam colors | core `#f0fbff`, mid `#62b8ff`, edge `#3a54ff` |
| Stats | fastest of the starters: speed 6.2, power 1.05, defense 0.95 |
| Legal | Fan-art for a personal, non-commercial demo. A public or commercial release needs a license or an original redesign (see the root README). |

## One-paragraph look

Trait-only description (no names), used as `{{TRAITS}}` in shared prompts such as the title key art
(`art/ui/PROMPTS.md`) and as the fallback wording (§9):

> a slim, pale 12-year-old anime ninja boy with spiky black hair that has a blue sheen, thick
> spikes swept backward and up behind his head, and two long bangs framing his face down to the
> jaw; sharp narrow dark eyes and an aloof, serious expression; a navy-blue cloth forehead band with
> a steel plate engraved with a leaf-swirl symbol; a dark-navy short-sleeved shirt with a tall
> stand-up collar (a red-and-white round paper-fan emblem on the upper back); white arm warmers on
> his forearms; white shorts; white bandage wraps on his shins; a small dark holster strapped to his
> right thigh; dark-navy open-toed ninja sandals

---

## 1. Who he is on screen

Cool, precise and fast. Sasuke never wastes motion. Where Naruto is loose and loud, Sasuke is
compact and sharp: tight guard, short decisive strikes, perfectly balanced landings, and a
contemptuous calm between exchanges. He shouts only on big moves (launcher, finisher, jutsu).

Motion language for every animation:

- **Economy:** short anticipation (1 frame where possible), hard snap into the active pose, clean
  and controlled recovery. No flailing except when he gets hit.
- **Straight lines:** strikes travel in straight lines along the screen horizontal toward
  screen-right. Kicks are high and clean, with pointed toes and a straight supporting leg.
- **Low center:** his fighting stance and dashes are low, with the torso leaning forward.
- **Cold face:** default expression is a narrow-eyed, unimpressed glare with a flat mouth. Smirks
  ("Hmph") in the intro and win. Gritted teeth when hurt, never crying or goofy.
- **Sharingan:** his eyes turn red with three black tomoe for jutsu, the ultimate and the taunt
  (see the schedule in section 5).

## 2. Identity checklist (the silhouette test)

If a frame is missing any of these, it is off-model. Check them in every strip.

1. **Hair:** black with a blue sheen. A mass of thick spikes swept **backward** and up behind
   the head (the back of the head bristles out like a spiky fan pointing to the upper-left of the
   sprite). Two **long bangs** hang down on either side of the face to the jawline, framing it.
   Shorter bangs fall over the headband in the middle. The hair adds width behind the head more
   than height on top.
2. **Forehead protector:** navy-blue cloth band, steel plate on the forehead engraved with the
   leaf-swirl village symbol, knotted at the back with two short tails.
3. **Shirt:** dark-navy, short-sleeved, with a **tall stand-up collar** that hides the neck up
   to the jaw, slightly open in a narrow V at the front. Hem at the hips. The **Uchiha fan crest**
   (red top half, white bottom half, round fan with a short handle) sits on the upper back and is
   only visible in back-turned frames.
4. **Arm warmers:** white, from just below the elbow to the wrist, hands bare.
5. **Shorts:** white / very light grey, ending just above the knee.
6. **Leg wraps:** white bandage wraps around both shins from below the knee to the ankle.
7. **Kunai holster:** small dark-navy holster strapped over a white bandage on the **right
   thigh** (the near thigh, visible in the 3/4 view).
8. **Sandals:** dark-navy open-toed ninja sandals, toes visible.
9. **Build:** slim, wiry 12 to 13 year old ninja, narrow shoulders, long legs for his height,
   pale skin.
10. **Face:** angular jaw, narrow sharp dark eyes (onyx, not blue), small nose, thin mouth.

## 3. Proportions and landmarks (final 192×192 cell)

Hi-res sprite spec v1: 192×192 cell, pivot `[96, 180]`, `pixelsPerUnit` 86, facing right,
3/4 view (body turned about 35° toward the camera, head turned a bit more so both eyes show,
camera about 12° above). Full rules: [SPEC.md](../../SPEC.md).

- About **4.25 heads tall**. Head (chin to top of skull) is about **32 px**.
- Standing body (soles to top of skull, legs straight, hair not counted): **136 px**, the same
  body scale as Naruto and every other fighter (SPEC.md "Proportions and landmarks"). Sasuke's
  hair sweeps back, so it adds only about 6 px of height but 10 to 18 px of width behind the head.
- In the **idle stance** (knees bent) the skull top sits at about y 58 and the hair top at about
  y 51, so the trimmed height including hair is about **129 px**, which is the idle `bodyHeight`.
  Because his hair adds about 6 px less than Naruto's spikes, every upright `bodyHeight` in
  `art/manifest.json` is the spec default minus 6 px (lying and horizontal poses keep the
  defaults). Same body, smaller hair: do not draw him bigger to fill the height.

Idle stance landmarks, in final cell pixels (x from the left, y from the top; soles on y = 180).
They match the SPEC.md landmark table:

| landmark | y (px) | x (px) |
|---|---|---|
| top of hair | ~51 | |
| top of skull / headband plate | ~58 to 66 | |
| eyes | ~72 to 76 | |
| chin / top of collar | ~88 | |
| shoulders | ~94 | |
| chest | ~98 to 112 | |
| stomach / belt line | ~112 to 126 | |
| hem of shorts | ~146 | |
| knees | ~155 | |
| soles (floor line) | 180 | front (left) toes ~122, back (right) heel ~70 |
| back hair spikes | ~52 to 76 | reach back to ~x 58 |
| lead (left) hand, open | ~84 to 92 | ~128 to 134 |
| rear (right) fist | ~96 | ~108 |

Contact zones for active frames (where the **opponent's** body is when he is in range). These
follow the table in [SPEC.md](../../SPEC.md) "Strikes and contact zones". Per-frame values are in
[ANIMATIONS.md](ANIMATIONS.md):

| zone | y (px) | x of the striking point (px) | used by |
|---|---|---|---|
| HIGH (face / chin) | 64 to 92 | punches 150 to 172, kicks 170 to 186 | `light1`, `light2`, `light4`, `heavy` f3 |
| MID (chest to hip, in the air) | 88 to 130 | 150 to 186 | `airLight1`, `airLight2`, `airLight3` |
| LOW (stomach) | 110 to 128 | 166 to 184 | `light3` |
| chest (jutsu) | 94 to 120 | 148 to 170 | `beamFire` hand, Chidori thrust |
| down-forward | 120 to 150 | 140 to 166 | `airHeavy` |

Never let a fist or foot go past x 186 (the cell is 192 px wide).

## 4. Facing, near side and handedness

- Sprites always face **right**. The engine mirrors them when he faces left.
- Facing right in a 3/4 view, his **right side is nearest the camera**. In every brief:
  - **R arm / R leg = near** (drawn in front of the body, fully visible).
  - **L arm / L leg = far** (partly behind the torso).
- **Stance:** L foot forward, R foot back (orthodox). **Lead hand = L** (open knife-hand at chin
  height). **Rear hand = R** (fist in front of the chest).
- **Chidori hand = R (near) hand.** In the anime Sasuke usually forms Chidori in his left hand.
  We use the near hand so the lightning is never hidden behind his body, and because mirroring
  for left-facing play swaps handedness anyway. Keep this consistent in every Chidori and Lightning
  Lance frame.
- Mirroring flips the leaf symbol and the fan crest. That is accepted for the demo.

## 5. Face, eyes and the Sharingan

| expression | look | used in |
|---|---|---|
| **neutral glare** (default) | upper lids low and straight, brows angled down at the inner ends, mouth a short flat line | idle, run, dash, jumps, guard, getup |
| **focused / angry** | brows hard down, eyes narrowed further, mouth tight or teeth just showing | normals (active frames), superDash |
| **shout** | mouth open (teeth visible), brows down | `light4`, `heavy`, `airHeavy`, `special` thrust, `beamFire`, `charge` |
| **smirk** ("Hmph") | one mouth corner raised, half-lidded eyes, chin up | intro, win |
| **pain** | eyes squeezed shut or wide with tiny pupils, teeth gritted or mouth open | hurtHigh, hurtLow, launched, spin, down |
| **eyes shut** | lids closed, brows strained | block, ko |
| **dazed** | half-lidded, unfocused, mouth slightly open | stagger |

Normal eyes: dark iris `#2c2c40`, pupil and lash line `#141018`, whites `#ebe8f2` with a 1 px
`#ffffff` catch-light.

**Sharingan** (red eyes with three tomoe):

- Full detail (UI art and the expression sheet): red iris `#d81e28`, thin dark-red ring
  `#7c0c16` around the iris and around the pupil, black pupil `#141018`, three black comma-shaped
  tomoe evenly spaced on the ring, pointing clockwise.
- At sprite scale the eye is only about 4 to 6 px tall. Draw a red iris (`#d81e28`) with a dark-red
  rim (`#7c0c16`) and a 1 px black pupil. Tomoe are 1 px black dots if they fit, otherwise skip
  them. The red must read clearly at a glance.

**Sharingan schedule.** "ON" means every frame of the animation:

| ON | OFF (dark eyes) |
|---|---|
| `special` (Chidori), `throw` (Fireball), `beamCharge`, `beamFire`, `charge`, `taunt`, UI cut-in, UI select art | everything else, including `intro`, `win` and the HUD portrait |

## 6. Hair, headband and cloth motion

- **Back spikes** are stiff. They move as one mass (1 to 2 px squash or stretch on impacts and
  landings) and never bend like cloth.
- **Long side bangs** and the **headband tails** are the secondary-motion parts. They lag one
  frame behind the head:
  - moving forward (run, dash, superDash, Chidori): stream back toward screen-left;
  - moving backward (backDash, hurt, launched): whip forward toward screen-right;
  - rising: dragged downward; falling: lifted upward;
  - landing or impact: overshoot 2 to 3 px past rest, then settle the next frame;
  - aura (charge, beamCharge): blown upward and flickering.
- **Collar** is stiff and never flutters. **Shirt hem** and the **bottom edge of the shorts**
  can ripple 1 to 2 px. **Arm warmers** and **leg wraps** stay tight.

## 7. Palette (32 colors, hard limit 32)

Base ramps are the exact hexes from `src/characters/sasuke.js` (`model.palette`). Extras
(marked ✚) come from `model.face` or are new and listed here. Use **only** these colors in
character frames. The packer warns above 48. Aim for 32 or fewer.

| # | material | light | base | shadow | deep / extra | source |
|---|---|---|---|---|---|---|
| 1 | outline, pupils, tomoe, darkest line | | | | `#141018` ✚ | `face.line` |
| 2–5 | skin | `#fff1e4` | `#fbd8bd` | `#e0a283` | `#c4866a` ✚ (deep shadow, skin lines) | `skin`, `face.skinLine` |
| 6–9 | hair | `#2e3556` | `#1e2032` | `#0e0f18` | `#4a5684` (blue sheen highlight) | `hair` |
| 10–12 | shirt (dark navy) | `#4a64ac` | `#2e4282` | `#1a2650` | | `shirt` |
| 13–15 | headband cloth, tails | `#3e548f` | `#283a6c` | `#162044` | | `band` |
| 16–19 | headband plate (steel) | `#e4eaf4` | `#b8c2d2` | `#76829a` | `#ffffff` (specular, shared) | `metal` |
| 20–21 | arm warmers, leg wraps, bandage, crest bottom, eye whites | `#ffffff` (shared) | `#ebe8f2` | `#aaa5c0` | | `white` |
| 22–24 | shorts | `#f2f0f8` | `#d8d6e4` | `#9893b2` | | `shorts` |
| 25–27 | sandals, holster strap | `#454f8c` | `#2a2f58` | `#171a36` | | `sandal` |
| 28 | sandal sole | | `#2a2228` | | | `sole.base` |
| 29 | iris (normal eyes) | | `#2c2c40` ✚ | | | `face.iris` |
| 30 | mouth interior | | `#5a1a22` ✚ | | | `face.mouth` |
| 31 | Sharingan red, fan crest red | | `#d81e28` ✚ | | | new |
| 32 | Sharingan rim / pupil ring, crest shadow | | `#7c0c16` ✚ | | | new |

Folded to stay at 32. Do **not** add these back: sole shadow `#181216` and sole light `#433840`
(use `#141018` and `#2a2228`), `face.irisDark #121218` (use `#141018`), `face.sclera #f6f2f4` (use
`#ebe8f2`), `face.symbol #3a3448` (engrave the leaf symbol with `#76829a` and `#141018`).

Material rules:

- **Outline:** 1 px. `#141018` on the outer silhouette. Inner lines may use the darkest tone of
  the material (selective outline), e.g. `#1a2650` between shirt folds, `#c4866a` for the nose and
  ear.
- **Lighting:** key light from the upper-front-right (his front). Light tones sit on top and front
  surfaces (screen-right). Shadows fall on the back (screen-left) and under the hair, chin, collar
  and arms.
- **Hair:** mostly `#1e2032` and `#0e0f18`, with `#2e3556` planes on the top and front of the
  spikes and a few sharp `#4a5684` sheen streaks (the anime blue highlight). Never brown, never
  pure grey.
- **Holster:** shirt navy (`#1a2650`, `#2e4282`) over a white bandage.
- **No** gradients, dithering, noise, glow, soft shadows or anti-aliasing. Hard pixels only.

## 8. Reference folder (`reference/`)

Approved images that every later prompt attaches. Codex files them here. Names:

| file | what | from |
|---|---|---|
| `reference/model_sheet.png` | approved model sheet: turnaround (front, 3/4 right, side, back), fighting stance facing right, palette swatches | PROMPTS.md step 1 |
| `reference/expressions.png` | approved expression sheet incl. Sharingan close-up | PROMPTS.md step 2 |
| `reference/idle_approved.png` | the approved `idle` strip (best pose and proportion anchor) | PROMPTS.md step 3 |
| `reference/notes.md` (optional) | what was fixed between attempts, which seed or chat produced the keeper | Codex |
| `reference/source/` (optional, local only) | official screenshots the user collects for their own eyes | user |

Official screenshots are copyrighted. Keep them local for comparison only, and do not upload
them to ChatGPT as style sources. Attach our own approved model sheet instead. ChatGPT may refuse
or degrade when given copyrighted frames.

## 9. Trait-only description (fallback wording)

If ChatGPT refuses or waters down a prompt that names the character, replace the name with this
block. Also drop "Naruto", "Uchiha", "Sharingan" and "Chidori" from the prompt. Never name the
original artist.

> a slim, pale 12-year-old anime ninja boy with spiky black hair that has a blue sheen, thick
> spikes swept backward and up behind his head, and two long bangs framing his face down to the
> jaw; sharp narrow dark eyes and an aloof, serious expression; a navy-blue cloth forehead band with
> a steel plate engraved with a leaf-swirl symbol; a dark-navy short-sleeved shirt with a tall
> stand-up collar (a red-and-white round paper-fan emblem on the upper back); white arm warmers on
> his forearms; white shorts; white bandage wraps on his shins; a small dark holster strapped to his
> right thigh; dark-navy open-toed ninja sandals

Replacement terms:

| instead of | write |
|---|---|
| Sharingan | "glowing red eyes with three small black comma marks around the pupil" |
| Chidori | "a crackling ball of blue-white lightning in his open hand" |
| Great Fireball Technique | "breathing a large ball of fire from his mouth" |
| Uchiha crest | "a red-and-white round paper-fan emblem" |
| leaf symbol | "a leaf-swirl symbol" |
| "in the style of <artist>" | "classic early-2000s shonen anime look: sharp angular faces, narrow eyes, bold clean line art, flat cel shading" |
