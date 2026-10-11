# Sasuke: image prompts (generation order)

> **ART-SCALE-01 user correction:** preserve Gojo's original approved compact head and slender adult proportions (model v03, idle v02). The enlarged-head candidates are rejected. Use the original Gojo as the visual scale reference when reviewing the cast; retain character height differences and stable anatomy through animations. Never enlarge Gojo to satisfy the nominal 31px target. See [CHARACTER_SCALE.md](../../CHARACTER_SCALE.md).

> Copy-paste prompts for the image generator (Codex's built-in generator, or ChatGPT run by the user),
> in the order to run them, for **art spec v2**
> ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md): Shippuden Hebi-era design,
> about 6.5 heads, 256×256 cells). Each prompt is self-contained. The poses are the same as
> [ANIMATIONS.md](ANIMATIONS.md), described in words. Look, palette and fallback wording:
> [CHARACTER.md](CHARACTER.md). Pipeline and QA: [art/PIPELINE.md](../../PIPELINE.md). Review queue:
> [art/REVIEW.md](../../REVIEW.md). If anything here disagrees with ADR 0007 or
> [art/SPEC.md](../../SPEC.md), they win; if a prompt and ANIMATIONS.md disagree, ANIMATIONS.md wins.

## How to use (Codex + user)

1. **Codex generates every image** with its built-in image generator and attaches the approved
   references as image inputs (the "Attach" line of each prompt). The user can still run a prompt by
   hand in ChatGPT; the file is saved and reviewed the same way.
2. **One thread per character, run in parallel with Naruto.** Use a separate Codex thread (or
   chat) named "GCD Sasuke sprites" next to the Naruto thread; both can run at the same time, and S1
   for Sasuke does not wait for Naruto. **Never put both characters in one image, and never attach
   Naruto's references to a Sasuke prompt.** Start a fresh thread (re-attach the references; every
   prompt is self-contained) when it drifts or after about 6 strips.
3. **Run S1 and S2 first** (model sheet, expressions). Iterate until the user approves one version of
   each. Codex then **copies** the approved version to the fixed name: `reference/model_sheet.png`,
   `reference/expressions.png`. As identity references, later prompts attach only approved fixed-name
   files (`model_sheet.png`, `expressions.png`, `idle_approved.png`). Two exceptions: (a) a Part B block
   attaches Part A of the same version; (b) a retry of S1/S2 or a strip fix may attach the candidate
   being corrected, together with the list of changes. Never attach `reference/source/` (copyrighted),
   `reference/_old/` or v1 files.
4. **Run the strips in `step` order** (the index below = `art/manifest.json` steps). A01–A23 are the
   CORE set: the game switches to the new art only when all of them are packed. A24–A38 are optional
   polish. Never start a step while the step before it has no approved version.
5. **Quick check before saving** (30 seconds): right pose count, facing right, **about 6.5 heads (not
   chibi)**, the Hebi outfit (no forehead protector, open white shirt with the high collar, purple
   rope belt with the bow at the back, knee-length navy waist cloth, navy forearm guards, black
   sandals, the sword sheathed at the back of the belt), flat magenta, no shadow or text. If it fails,
   regenerate; an attempt that was never saved needs no number.
6. **Save every image with a version number** (ADR 0007): the "Save as" name with `_vNN`, where
   `NN` is two digits and **1 + the highest version ever used for that asset** (look in the folder,
   `raw/_parts/`, its `_rejected/` subfolder and the REVIEW.md rows). Make up to 3 attempts per round
   and save only the best one. The first image of an asset is `v01`. Never
   overwrite, reuse or delete a version: the **highest number is always the latest candidate**, so the
   user and Claude can find it at a glance. Don't crop or rename frames; Codex and the packer do that.
7. **Long strips come in two images.** Every strip with 6 or more frames has a Part A and a Part B
   block (4 or fewer 6.5-head figures per image stay big enough). Save part A as
   `raw/_parts/<anim>_vNN_A.png`, run part B with part A attached, save it as
   `raw/_parts/<anim>_vNN_B.png` (same NN), then stitch both into `raw/<anim>_vNN.png`
   (art/PIPELINE.md "Long strips (parts)"). If only one part needs a redo, the redo is a new version:
   save it under the next NN and copy the kept part under the same new NN, so both halves of a version
   always belong together. One REVIEW.md row covers the stitched strip.
8. **Queue it for review:** add a row at the **top** of [art/REVIEW.md](../../REVIEW.md) (date,
   `sasuke`, asset, file link, version, status `needs review`, what changed since the previous
   version including any prompt tweak, QA notes). In the same edit set the asset's `version` in
   `art/manifest.json` (status `raw` if it was `todo`) and update `art/TRACKER.md`. Re-read REVIEW.md
   right before editing it: the Naruto thread edits it too. For strips, run `npm run sprites sasuke`
   first: the packer uses the **highest** `_vNN` strip per animation and prints which file it used
   (check it is the one just saved). Check it in game (http://127.0.0.1:5188/?fight=sasuke,sasuke&mode=solo&art=custom&debug) or in the Sprite Lab (http://127.0.0.1:5188/sprites.html?c=sasuke, click "Load full sheet (.png + .json)…" and pick `public/characters/sasuke/sheet.png` and `anims.json`; otherwise it shows the baked placeholder), run the QA notes
   in ANIMATIONS.md (head about 31 px, feet on the pivot, contact zones, sword sheathed, no chibi
   frame) and write the result in the QA notes. Then stop and show the user the latest version with
   a short verdict (identity / proportions and pose / technical).
9. **The user decides** ("approve sasuke idle v03" / "reject sasuke light1 v02: fist too low", in chat
   or in REVIEW.md). Approved: the row becomes `approved`, `approvedVersion` = NN in the manifest,
   and Codex copies references to their fixed names (`reference/model_sheet.png`,
   `reference/expressions.png`, the approved idle strip to `reference/idle_approved.png`, UI to
   `ui/<name>.png`). Rejected: the row becomes `rejected` with the reason, the file moves to the
   `_rejected/` folder next to it (`raw/_rejected/`, `reference/_rejected/`), and the next version
   is generated with the problem called out (fix prompts F1-F4 at the bottom).
10. **If the generator refuses** a prompt that names the character: replace the `CHARACTER:` line
    with the fallback below, and swap the names using the replacement table in CHARACTER.md §9
    (Sharingan → "glowing red eyes with three small black comma marks around the pupil", Chidori → "a
    crackling ball of blue-white lightning in his open hand", and so on; also drop "Shippuden" from
    the PROPORTIONS line). Never name the original artist or studio.

### Fallback CHARACTER line (no names)

```text
CHARACTER: an original character inspired by classic shonen ninja anime, fan-art sprite for a personal non-commercial game project: a lean, pale young man of about 16 with a cold, calm, precise air, drawn with realistic anime proportions (about 6.5 heads tall, not chibi). Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. No forehead band. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, with a small red-and-white round paper-fan emblem on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms. Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
```

## Index

Run the prompts top to bottom: `step` is the generation order from `art/manifest.json` (the same
steps as art/PIPELINE.md "Generation order" and art/TRACKER.md). Codex picks the lowest `step` with
no approved version. All paths are relative to `art/characters/sasuke/`; `vNN` = the next free
version (`v01` first).

| step | id | asset | frames | images | CORE | save as (versioned; NN = next free version) |
|---|---|---|---|---|---|---|
| 1 | S1 | model sheet (5 views incl. a true side profile + palette swatches) | | 1 | | `reference/model_sheet_vNN.png` → approved copy `reference/model_sheet.png` |
| 2 | S2 | expression sheet (8 heads incl. the Sharingan) | | 1 | | `reference/expressions_vNN.png` → approved copy `reference/expressions.png` |
| 3 | A01 | `idle`: fighting stance (breathing loop) | 8 | 2 | **CORE** | `raw/_parts/idle_vNN_A.png` + `raw/_parts/idle_vNN_B.png` → `raw/idle_vNN.png` → approved copy `reference/idle_approved.png` |
| 4 | A02 | `run`: ninja run (loop) | 8 | 2 | **CORE** | `raw/_parts/run_vNN_A.png` + `raw/_parts/run_vNN_B.png` → `raw/run_vNN.png` |
| 5 | A03 | `light1`: jab with the L (lead) fist | 7 | 2 | **CORE** | `raw/_parts/light1_vNN_A.png` + `raw/_parts/light1_vNN_B.png` → `raw/light1_vNN.png` |
| 5 | A04 | `light2`: rear straight with the R (near) fist | 7 | 2 | **CORE** | `raw/_parts/light2_vNN_A.png` + `raw/_parts/light2_vNN_B.png` → `raw/light2_vNN.png` |
| 5 | A05 | `light3`: front kick to the stomach with the R (near) leg | 7 | 2 | **CORE** | `raw/_parts/light3_vNN_A.png` + `raw/_parts/light3_vNN_B.png` → `raw/light3_vNN.png` |
| 5 | A06 | `light4`: spinning roundhouse finisher with the R leg | 8 | 2 | **CORE** | `raw/_parts/light4_vNN_A.png` + `raw/_parts/light4_vNN_B.png` → `raw/light4_vNN.png` |
| 5 | A07 | `heavy`: Lion's Barrage opener, rising front kick with the R leg | 8 | 2 | **CORE** | `raw/_parts/heavy_vNN_A.png` + `raw/_parts/heavy_vNN_B.png` → `raw/heavy_vNN.png` |
| 5 | A08 | `airLight1`: mid-air jab with the L fist | 5 | 1 | **CORE** | `raw/airLight1_vNN.png` |
| 5 | A09 | `airHeavy`: double-fist hammer spike | 6 | 2 | **CORE** | `raw/_parts/airHeavy_vNN_A.png` + `raw/_parts/airHeavy_vNN_B.png` → `raw/airHeavy_vNN.png` |
| 6 | A10 | `guard`: cross-arm block (loop) | 2 | 1 | **CORE** | `raw/guard_vNN.png` |
| 6 | A11 | `hurtHigh`: hit in the face | 3 | 1 | **CORE** | `raw/hurtHigh_vNN.png` |
| 6 | A12 | `launched`: knocked flying backward (loop) | 2 | 1 | **CORE** | `raw/launched_vNN.png` |
| 6 | A13 | `down`: slammed down, then lying on the back | 2 | 1 | **CORE** | `raw/down_vNN.png` |
| 6 | A14 | `getup`: kip-up | 5 | 1 | **CORE** | `raw/getup_vNN.png` |
| 7 | A15 | `charge`: powering up (loop) | 4 | 1 | **CORE** | `raw/charge_vNN.png` |
| 7 | A16 | `beamCharge`: calling KIRIN (loop) | 3 | 1 | **CORE** | `raw/beamCharge_vNN.png` |
| 7 | A17 | `beamFire`: KIRIN lightning command (loop) | 3 | 1 | **CORE** | `raw/beamFire_vNN.png` |
| 7 | A18 | `special`: CHIDORI rush | 8 | 2 | **CORE** | `raw/_parts/special_vNN_A.png` + `raw/_parts/special_vNN_B.png` → `raw/special_vNN.png` |
| 8 | A19 | `dash`: low forward dash (loop) | 2 | 1 | **CORE** | `raw/dash_vNN.png` |
| 8 | A20 | `jumpUp`: rising (loop) | 2 | 1 | **CORE** | `raw/jumpUp_vNN.png` |
| 8 | A21 | `jumpFall`: falling (loop) | 2 | 1 | **CORE** | `raw/jumpFall_vNN.png` |
| 8 | A22 | `land`: landing | 2 | 1 | **CORE** | `raw/land_vNN.png` |
| 8 | A23 | `win`: back-turned salute (loop) | 4 | 1 | **CORE** | `raw/win_vNN.png` |
| 9 | A24 | `backDash`: quick hop backward | 3 | 1 |  | `raw/backDash_vNN.png` |
| 9 | A25 | `superDash`: homing super dash (loop) | 2 | 1 |  | `raw/superDash_vNN.png` |
| 9 | A26 | `jumpSquat`: pre-jump crouch | 1 | 1 |  | `raw/jumpSquat_vNN.png` |
| 9 | A27 | `airLight2`: mid-air front kick with the R leg | 5 | 1 |  | `raw/airLight2_vNN.png` |
| 9 | A28 | `airLight3`: mid-air spinning kick with the L leg | 6 | 2 |  | `raw/_parts/airLight3_vNN_A.png` + `raw/_parts/airLight3_vNN_B.png` → `raw/airLight3_vNN.png` |
| 9 | A29 | `block`: pushed back while blocking | 2 | 1 |  | `raw/block_vNN.png` |
| 9 | A30 | `hurtLow`: hit in the stomach | 3 | 1 |  | `raw/hurtLow_vNN.png` |
| 9 | A31 | `spin`: tumbling backward (loop) | 4 | 1 |  | `raw/spin_vNN.png` |
| 9 | A32 | `airRecover`: mid-air backflip recovery | 3 | 1 |  | `raw/airRecover_vNN.png` |
| 9 | A33 | `throw`: FIREBALL, breathed in mid-air | 4 | 1 |  | `raw/throw_vNN.png` |
| 9 | A34 | `vanish`: high-speed teleport | 2 | 1 |  | `raw/vanish_vNN.png` |
| 9 | A35 | `stagger`: dizzy stagger (loop) | 4 | 1 |  | `raw/stagger_vNN.png` |
| 9 | A36 | `ko`: knocked out | 1 | 1 |  | `raw/ko_vNN.png` |
| 9 | A37 | `intro`: arms-crossed cold stare (loop) | 4 | 1 |  | `raw/intro_vNN.png` |
| 9 | A38 | `taunt`: "come at me" beckon (loop) | 2 | 1 |  | `raw/taunt_vNN.png` |
| 9 | A39 | `specialForward`: Chidori Sharp Spear | 7 | 2 | | `raw/specialForward_vNN.png` |
| 9 | A40 | `specialUp`: Lion's Barrage | 6 | 2 | | `raw/specialUp_vNN.png` |
| 9 | A41 | `specialDown`: Sharingan Counter | 4 | 1 | | `raw/specialDown_vNN.png` |
| 9 | A42 | `superPose`: Amaterasu | 4 | 1 | | `raw/superPose_vNN.png` |
| 11 | U1 | portrait 96×96 | | 1 | | `raw/ui_portrait_vNN.png` → approved copy `ui/portrait.png` |
| 11 | U2 | super cut-in eye strip 480×128 | | 1 | | `raw/ui_cutin_vNN.png` → approved copy `ui/cutin.png` |
| 11 | U3 | character select art 384×384 | | 1 | | `raw/ui_select_vNN.png` → approved copy `ui/select.png` |
| extra | X1, X2 | optional Sasuke effect art (engine support pending, ENG-014) | | 1 each | | `art/vfx/raw/_proposed/sasuke_<effect>_vNN.png` |

Within step 9, Sasuke tip: run A33 `throw` and A37 `intro` first; they show up every match.

---

## S1 · Model sheet

Attach: nothing the first time (never a Naruto image, never a spec v1 image). For a later version you
may attach the best earlier Sasuke `_vNN` candidate together with a short list of what to change.
**Save as: `reference/model_sheet_vNN.png`** (the first one is `v01`). Runs **in parallel with
Naruto's S1**, in the Sasuke thread. After "approve sasuke model_sheet vNN", Codex copies that version
to `reference/model_sheet.png`.

```text
Character model sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.

Draw the same character 5 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear gaps between them:
1. FRONT view, relaxed neutral stand, arms slightly away from the body, facing the viewer (the sword grip shows beside his right hip, the sheath tip beside his left hip);
2. 3/4 view facing RIGHT (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), relaxed neutral stand: this is the main game view;
3. TRUE SIDE PROFILE facing RIGHT: turned exactly 90 degrees, only ONE eye visible, nose, lips and chin in silhouette pointing straight to the right, the far arm and leg hidden behind the near ones, the long bangs and back spikes in profile; NOT a 3/4 view;
4. BACK view: the spiky back of his hair, the small red-and-white round fan crest on the back of the collar, the sheathed sword lying horizontally across the small of his back, tucked through the rope belt, with the big purple bow knot over the middle of the sheath;
5. 3/4 view facing RIGHT in his fighting stance: low and compact, knees bent, left foot forward, right foot back, left hand forward at chin height as an open knife-hand, right fist in front of his chest, cold narrow-eyed stare.
Below the figures, one row of 34 small square color swatches (no text), one per palette color, in the palette order listed below.
Show clearly in every view: no forehead protector; long bangs framing both sides of the face; the tall white collar open in a deep V with his chest showing; long white sleeves ending under the dark navy forearm guards; the purple rope belt and its bow; the knee-length navy waist cloth over navy pants; black open-toed sandals; the sword sheathed at the back of the belt.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. On this sheet draw at 2x: every art pixel is a 2x2 block, so the standing body (soles to top of the skull) is about 400 px tall on the canvas (the head about 62 px), the hair on top of that.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no labels, no ground shadow, no floor, no effects.
```

Check before saving (and write the result in the REVIEW.md QA notes): **measure the proportions**
(standing body height ÷ head height ≈ 6.5, not 4 to 5); no headband; black hair with a blue sheen,
spiky at the back, long bangs on both sides; view 3 is a **true profile** (one eye); open white shirt
with the high collar and the crest on its back; purple rope with the bow at the back; knee-length
navy waist cloth; navy arm guards; black sandals; sword sheathed horizontally at the back; flat
magenta; at most 48 colors on the character. Codex notes what changed between versions in
`reference/notes.md`.

## S2 · Expression sheet

Attach: `reference/model_sheet.png`. **Save as: `reference/expressions_vNN.png`**. After approval Codex
copies it to `reference/expressions.png`.

```text
Expression sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet exactly (same face shape, hair, bangs, collar and colors).

Draw 8 head-and-shoulders close-ups in a 4 by 2 grid on a 1536x1024 landscape canvas, every head facing RIGHT in 3/4 view (both eyes visible), all at the same scale, with clear gaps between them:
1. cold neutral stare (his default): upper lids low and straight, brows level and low, mouth a short flat line;
2. faint smirk: one mouth corner barely raised, half-lidded eyes, chin slightly up;
3. focused / angry: brows hard down, eyes narrowed, mouth tight;
4. shout: mouth open showing teeth and the dark mouth interior, brows down;
5. pain: eyes squeezed shut, teeth gritted;
6. eyes shut, straining (blocking a hit);
7. dazed: half-lidded unfocused eyes, mouth slightly open, bangs messy;
8. Sharingan glare: glowing red irises (#d81e28) with a thin dark-red ring (#7c0c16), a black pupil and three small black comma-shaped marks (tomoe) evenly spaced around it, intense stare.
Eyes 1 to 7: dark iris (#2c2c40), black pupil, one white catch-light pixel. No forehead protector in any head; long bangs frame both sides of every face; the tall white collar open at the throat.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. The head is about 31 px tall in the game (chin to the top of the skull); on this sheet draw at 4x: every art pixel is a 4x4 block.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything. No text, no numbers, no labels.
```

---

## Animation strips

Attach to every strip prompt: `reference/model_sheet.png`, `reference/expressions.png` and, from A02
on, `reference/idle_approved.png`, plus any extra approved strip listed under "Attach" (the move it
continues: `light2` after `light1`, the air attacks, `getup` after `down`, `beamFire` after
`beamCharge`, `block` after `guard`). Strips with 6 or more frames come as **two images** (Part A
and Part B). Every block restates the proportions, size, palette and rules, so it also works in a
fresh thread. Every "Save as" name gets the next free `_vNN`.

**Step 3 · idle**

### A01 · `idle`: fighting stance (breathing loop) (CORE)

8 frames, loops. **Two images** (poses 1-4, then 5-8). **Save as: `raw/_parts/idle_vNN_A.png` and `raw/_parts/idle_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/idle_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle). **After the user approves it, Codex copies the stitched strip to `reference/idle_approved.png`**; every later prompt attaches that file.

Part A (save as `raw/_parts/idle_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and expression sheet exactly: same face, hair, outfit, rope bow, sword, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", fighting stance (breathing loop). 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4. It loops: the last frame must flow smoothly back into the first.
1. KEY POSE. Compact orthodox stance: left (lead) foot forward with the toes pointing right, right foot back and turned out 45 degrees, feet a bit wider than the shoulders, knees bent about 20 degrees, weight slightly back. Torso leans slightly forward, chest turned about 35 degrees toward the viewer. Left arm forward with the elbow slightly bent, an open knife-hand (fingers together) at chin height. Right fist in front of his chest, elbow down. Chin slightly down. Face: cold, emotionless narrow-eyed stare to the right, mouth a flat line. The rope bow peeks out behind his lower back; the sword grip shows behind his near hip.
2. Inhale: chest and shoulders rise very slightly. Face: cold. Bangs not moved yet (lag).
3. Top of the breath, slightly higher; the left-hand fingers relax a touch; bangs swing slightly back. Face: cold.
4. Hold the top; the rope-bow ends drift slightly down-left. Face: cold.
MOTION: A very small breathing bob done with the knees and chest only. The FEET ARE IDENTICAL in all 8 frames (they never slide). Bangs and rope-bow ends lag the body by one frame; the waist cloth barely moves.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/idle_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and expression sheet exactly: same face, hair, outfit, rope bow, sword, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", fighting stance (breathing loop). 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4). It loops: the last frame must flow smoothly back into the first.
5. Exhale, halfway down. Face: cold.
6. Same height as frame 1. Face: cold.
7. Lowest point: knees bend a little more, shoulders drop slightly; bangs swing slightly forward, the waist-cloth hem settles. Face: cold.
8. Rising back toward frame 1 (flows straight into frame 1); the rope ends drift back. Face: cold.
MOTION: A very small breathing bob done with the knees and chest only. The FEET ARE IDENTICAL in all 8 frames (they never slide). Bangs and rope-bow ends lag the body by one frame; the waist cloth barely moves.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

**Step 4 · run**

### A02 · `run`: ninja run (loop) (CORE)

8 frames, loops. **Two images** (poses 1-4, then 5-8). **Save as: `raw/_parts/run_vNN_A.png` and `raw/_parts/run_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/run_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#run).

Part A (save as `raw/_parts/run_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "run", ninja run. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4. It loops: the last frame must flow smoothly back into the first.
1. Contact: left foot reaching forward, ball of the foot touching down well ahead of the hips; right leg extended back, toes pushing off. Face: cold, focused, mouth closed.
2. Down: weight on the left leg, knee bent deepest, body at its lowest; right heel lifting behind.
3. Passing: left leg under the hips, right knee swinging forward past it; body rising.
4. Flight: both feet off the ground; right knee forward and up, left leg extended straight back with pointed toes; body at its highest; longest stride.
MOTION: Torso pitched about 40 degrees forward for the whole cycle, head up looking ahead. BOTH arms trail straight back behind him, slightly raised, hands open and flat with fingers together; they bob slightly opposite to the body. Bangs and rope-bow ends stream back to the left; the waist cloth streams back and parts around the legs. The sword stays level behind his hips and does not bounce. Long legs, long realistic stride.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/run_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "run", ninja run. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4). It loops: the last frame must flow smoothly back into the first.
5. Contact (mirror of frame 1): right foot reaching forward to touch down, left leg pushing off behind.
6. Down (mirror of frame 2): weight on the right leg, body lowest.
7. Passing (mirror of frame 3): left knee swinging forward.
8. Flight (mirror of frame 4): left knee forward and up, right leg extended back. Flows back into frame 1.
MOTION: Torso pitched about 40 degrees forward for the whole cycle, head up looking ahead. BOTH arms trail straight back behind him, slightly raised, hands open and flat with fingers together; they bob slightly opposite to the body. Bangs and rope-bow ends stream back to the left; the waist cloth streams back and parts around the legs. The sword stays level behind his hips and does not bounce. Long legs, long realistic stride.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

**Step 5 · core attacks**

### A03 · `light1`: jab with the L (lead) fist (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light1_vNN_A.png` and `raw/_parts/light1_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light1_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light1).

Part A (save as `raw/_parts/light1_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "light1", jab with the left (lead) fist. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
1. Anticipation: the left hand closes into a fist and pulls back toward the chest, torso turns slightly away, weight sinks a touch. Face: cold.
2. The left fist launches, elbow half extended, shoulders start rotating forward. Face: angry.
3. IMPACT: left arm FULLY EXTENDED horizontally to the right at face height, knuckles forward; left shoulder forward with the chin tucked behind it; right fist guarding the chin; left foot stepped forward. SMEAR: a short solid tapered streak behind the fist in white-sleeve, navy-guard and skin colors (hard pixels, no blur). Face: angry.
4. Same full extension without the smear, the fist a touch further; bangs flick forward, the white sleeve ripples. Face: angry.
MOTION: One-frame anticipation, hard snap, clean recovery: no wasted motion. Bangs jolt forward on frame 3 and settle on frame 5; rope ends whip slightly.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light1_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "light1", jab with the left (lead) fist. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Fist retracting halfway, elbow bending. Face: focused.
6. Left hand back near the guard, opening into the knife-hand; left foot slides back. Face: cold.
7. Back in the fighting stance (same as idle frame 1). Face: cold.
MOTION: One-frame anticipation, hard snap, clean recovery: no wasted motion. Bangs jolt forward on frame 3 and settle on frame 5; rope ends whip slightly.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A04 · `light2`: rear straight with the R (near) fist (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light2_vNN_A.png` and `raw/_parts/light2_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light2_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light1` strip (`raw/light1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light2).

Part A (save as `raw/_parts/light2_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "light2", rear straight with the right (near) fist. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
1. Hips coil: torso twists back toward the viewer, right fist cocked beside his right cheek, elbow back, weight on the right (back) leg. Face: cold.
2. Hips and shoulders rotate forward, the right fist drives forward past his chin. Face: angry.
3. IMPACT: right arm FULLY EXTENDED horizontally to the right at chin height, crossing in front of his body (fully visible); torso turned almost to profile, the open shirt twisting with it; right heel lifted, pivoting on the ball of the foot; left hand pulled back to the chest. SMEAR: a solid tapered streak behind the right fist (no blur). Face: angry, teeth just showing.
4. Same full extension without the smear, the fist a touch further. Face: angry.
MOTION: The power comes from the hip rotation; the long arm snaps fully straight. Bangs and rope ends flick forward on frame 3.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light2_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "light2", rear straight with the right (near) fist. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Right fist pulling back, torso unwinding. Face: focused.
6. Right fist back in front of his chest, heel down. Face: cold.
7. Fighting stance (same as idle frame 1). Face: cold.
MOTION: The power comes from the hip rotation; the long arm snaps fully straight. Bangs and rope ends flick forward on frame 3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A05 · `light3`: front kick to the stomach with the R (near) leg (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light3_vNN_A.png` and `raw/_parts/light3_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light3_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light3).

Part A (save as `raw/_parts/light3_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "light3", front kick to the stomach with the right (near) leg. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
1. Weight shifts onto the left (front) leg, the right knee starts to lift and the waist cloth parts at the front; guard tightens. Face: cold.
2. Right knee chambered high, thigh horizontal, shin hanging down; torso leaning back slightly; arms in guard. Face: focused.
3. IMPACT: right leg FULLY EXTENDED straight to the right at stomach height, sole and ball of the foot forward, toes pulled back; torso leaning back about 15 degrees; right arm swung back for balance, left fist guarding the chest; standing tall on the ball of the left foot. The kicking leg comes out between the panels of the waist cloth; the cloth stays behind the knee. SMEAR: a solid arc from the chambered knee to the foot in navy and black (no blur). Face: angry.
4. Same extension without the smear, the foot a touch further. Face: angry.
MOTION: A straight supporting leg, precise and clean. The waist-cloth panels swing with the kick but never cover or pass the kicking foot.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light3_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "light3", front kick to the stomach with the right (near) leg. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Knee folding back in. Face: focused.
6. Right foot setting down behind him, arms back to guard. Face: cold.
7. Fighting stance. Face: cold.
MOTION: A straight supporting leg, precise and clean. The waist-cloth panels swing with the kick but never cover or pass the kicking foot.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A06 · `light4`: spinning roundhouse finisher with the R leg (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). **Save as: `raw/_parts/light4_vNN_A.png` and `raw/_parts/light4_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light4_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light4).

Part A (save as `raw/_parts/light4_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "light4", spinning roundhouse finisher with the right leg. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5. Poses 4 and 5 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
1. Wind-up: torso twists toward the viewer, arms coil in, knees bend. Face: angry.
2. Spinning on the ball of the left foot: his BACK now faces the viewer (the small red-and-white fan crest on the back of the collar, the purple rope bow and the sheathed sword lying across the small of his back are visible); right leg lifting; head turning to look over his shoulder at the target.
3. Back to the viewer, side-on: right knee chambered high and turned over (hip rolled); head spotting the target on the right; the waist cloth flares out with the spin.
4. IMPACT: right leg FULLY EXTENDED high and horizontal to the right, the shin and instep striking at head height; torso leaning back to counterbalance, standing on the ball of the left foot, arms flung out. SMEAR: a big solid crescent from behind and below up to the foot (no blur). Face: shout.
5. Same extension without the smear; bangs, rope ends and waist cloth whipping forward. Face: shout.
MOTION: The sword stays tucked in the belt across his back and turns with his hips; its ends stay close to his body and never point at the target. Only the kicking foot reaches far right on frames 4 and 5.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light4_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "light4", spinning roundhouse finisher with the right leg. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
6. Leg dropping, the rotation following through. Face: angry.
7. Right foot setting down, regaining the stance. Face: focused.
8. Fighting stance. Face: cold.
MOTION: The sword stays tucked in the belt across his back and turns with his hips; its ends stay close to his body and never point at the target. Only the kicking foot reaches far right on frames 4 and 5.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A07 · `heavy`: LION'S BARRAGE OPENER, rising front kick launcher with the R leg (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). **Save as: `raw/_parts/heavy_vNN_A.png` and `raw/_parts/heavy_vNN_B.png`** (same NN = the next free version; today 03); Codex stitches them into `raw/heavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A and the approved `land` strip (`raw/land_v01.png`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#heavy). If the generator refuses, replace "Lion's Barrage" per CHARACTER.md §9 ("a rising anti-air kick").

Part A (save as `raw/_parts/heavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "heavy", a rising front-kick launcher with the right (near) leg, the opening kick of his Lion's Barrage: he drops low under the opponent's guard, touches the floor with his left fingertips, springs, and snaps his right leg straight up under the opponent's chin and on overhead, so the kick launches the opponent straight up. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5. Poses 4 and 5 are the HIT frames. Pose 4: the ball and toes of the right foot drive UP under the chin of an opponent standing on the right, in front of his body; the foot is the right-most part of the character. Pose 5: the right leg has carried on up, close to vertical in front of his face, toes leading; the toes are the highest point of the whole strip, higher than his hair. His bangs, back spikes, rope ends, the waist cloth, the sword and both arms stay behind and below the kicking foot. Dark eyes in every pose (no red eyes).
1. Drop under the guard: the left foot slides forward and he drops low, knees bent deep, torso pitched forward about 35 degrees; the left hand reaching down toward the floor beside the left foot, fingers open; the right arm back along his side; head low, eyes up on the opponent. Face: cold. Bangs and rope ends swing forward and down.
2. Coil, the lowest pose: the left knee deeply bent; the right knee drawn forward under his chest with the right foot on its toes beside the left foot, the kicking leg loaded; the left fingertips touching the floor right next to the left foot; torso low over the thighs; head up, eyeing the opponent's chin. Face: focused, eyes narrowed. The waist-cloth hem pooled over the knees.
3. Spring: the left leg drives straight, the left hand leaves the floor, the right knee drives up in front of his chest with the thigh about horizontal and the shin folded; both arms swinging down and back. Face: angry, teeth showing. Bangs dragged down.
4. IMPACT: the right leg snaps up and forward almost straight, rising at about 45 degrees, the ball and toes of the right foot driving up under the opponent's chin; the supporting left leg straight, up on the ball of the foot; torso leaning back about 25 degrees; both arms swept down and back behind his hips for balance. The kicking leg comes out between the panels of the waist cloth. Face: shout. SMEAR: one solid crescent in the pants navy and sandal black below the right leg along its upward arc, attached to the leg and never past the foot (hard pixels, no blur).
5. High follow-through: the right leg carries on up close to vertical in front of his face, toes pointed and leading; he leaves the floor: the left leg hangs straight under his hips with the toes pointed, the lowest point of the pose; torso arched back about 30 degrees, arms swept down and back; head tilted back, eyes up. Face: shout. Bangs and rope ends dragged down, the waist cloth parted around the kicking leg.
MOTION: A clean, exact launcher: one low drop, then a single straight-legged kick that rises in front of his body with the toes pointed and the supporting leg straight, and he leaves the floor at the top. The sword stays sheathed across the small of his back. Draw everything in place: the game moves him forward and adds the hop.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A and the approved `land` strip too; save as `raw/_parts/heavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose. Also attached: the approved "land" strip, for continuity: pose 7 must flow into its first pose.

ANIMATION: "heavy", a rising front-kick launcher with the right (near) leg, the opening kick of his Lion's Barrage. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5). Dark eyes in every pose (no red eyes).
6. Top of the jump, the pose held longest: still in the air, the right leg folding down with the knee bent and the foot in front at about his waist height, the left knee tucking up, the torso coming upright, both hands coming back toward his guard; eyes up on the opponent he launched. Face: angry. Bangs and the waist cloth floating.
7. Dropping to land: both feet reaching down toes first, the knees bending; the left hand forward as an open knife-hand, the right fist at the chest. Face: focused. Bangs and rope ends lifted by the fall.
8. Back in his fighting stance, the same as idle frame 1. Face: cold.
MOTION: A clean, exact launcher: one low drop, then a single straight-legged kick that rises in front of his body with the toes pointed and the supporting leg straight, and he leaves the floor at the top. The sword stays sheathed across the small of his back. Draw everything in place: the game moves him forward and adds the hop.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

---

### A08 · `airLight1`: mid-air jab with the L fist (CORE)

5 frames, phases 1/2/2. **Save as: `raw/airLight1_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight1).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "airLight1", mid-air jab with the left fist. 5 frames, left to right. Poses 2 and 3 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, arms in guard, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame).
1. Air pose, the left fist pulled back to the chest, shoulders coiled. Face: cold.
2. IMPACT: left arm FULLY EXTENDED horizontally to the right at his own chest height, torso leaning forward slightly. SMEAR: a solid tapered streak behind the fist (no blur). Face: angry.
3. Same extension without the smear. Face: angry.
4. Fist pulling back. Face: focused.
5. Air pose. Face: cold.
MOTION: All poses are in mid-air. Bangs and the waist-cloth hem lifted slightly by the air.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A09 · `airHeavy`: double-fist hammer spike (CORE)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/airHeavy_vNN_A.png` and `raw/_parts/airHeavy_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/airHeavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airheavy).

Part A (save as `raw/_parts/airHeavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "airHeavy", double-fist hammer spike. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames. Pose 3: both straight arms smash the clasped fists DOWN AND FORWARD, in front of and below his chest; the fists are the right-most part of his arms, and his feet stay lower than the fists. Pose 4: the same smash with the fists slightly lower, still in front of and below his chest and above his feet.
1. Both hands clasped together (fingers interlocked) raised overhead, torso arching back, knees tucked. Face: shout.
2. Wind-up peak: arched further back, the clasped fists behind his head. Face: shout.
3. IMPACT: torso whips forward, both straight arms swing DOWN AND FORWARD, the clasped fists in front of and below his chest on the right; knees bent with the feet hanging below the fists. SMEAR: a large solid crescent from overhead down to the fists (no blur). Face: shout.
4. Same smash pose without the smear, fists slightly lower; bangs whipping down. Face: angry.
MOTION: All poses are in mid-air. The feet stay the lowest point in every frame (the fists never go below them).

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/airHeavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "airHeavy", double-fist hammer spike. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Arms rising, body uncurling. Face: focused.
6. Air pose: torso upright, arms in guard, left knee forward and up, right leg hanging with pointed toes. Face: cold.
MOTION: All poses are in mid-air. The feet stay the lowest point in every frame (the fists never go below them).

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

**Step 6 · reactions**

### A10 · `guard`: cross-arm block (loop) (CORE)

2 frames, loops. **Save as: `raw/guard_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#guard).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "guard", cross-arm block. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Both forearms (the dark navy arm guards) CROSSED in an X in front of his face and upper chest, right forearm in front, fists closed, elbows down; chin tucked, eyes glaring over the crossed arms; knees bent more than in the fighting stance, weight back, left foot forward. Face: focused glare.
2. Identical but the body slightly lower (breathing); bangs and rope ends slightly shifted. Face: focused glare.
MOTION: Almost still: a tiny breathing bob only. Feet identical in both frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A11 · `hurtHigh`: hit in the face (CORE)

3 frames. **Save as: `raw/hurtHigh_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurthigh).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "hurtHigh", hit in the face. 3 frames, left to right.
1. Hit in the face by an attack from the right: head snapped back with the chin up, torso arched back, both arms flung back and out with open hands, one foot slipping. Face: pain, eyes squeezed shut, mouth open. Bangs, rope ends and the waist-cloth hem whipping forward to the right.
2. About one third recovered: head coming down, arms swinging back in. Face: pain.
3. Mostly recovered, still wincing, arms returning toward guard. Face: pain, teeth gritted.
MOTION: Frame 1 is the peak of the reaction; it eases back over frames 2 and 3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A12 · `launched`: knocked flying backward (loop) (CORE)

2 frames, loops. **Save as: `raw/launched_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#launched).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "launched", knocked flying backward. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Knocked flying backward to the left by a big hit from the right. His body is tilted about 60 degrees back from upright and arched like a drawn bow with the belly up: his HIPS are the lowest point, near the middle of the pose; head and shoulders rise to the upper left; legs bent and trailing forward to the right at about hip height; arms flung up and back past his head. Face: eyes shut, mouth open. Bangs, rope ends and waist cloth whipping to the right.
2. Arms and legs in slightly different flailing positions. Face: same.
MOTION: A diagonal, arched body, not fully horizontal. Keep each pose about one and a half times as wide as it is tall.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A13 · `down`: slammed down, then lying on the back (CORE)

2 frames. **Save as: `raw/down_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#down).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "down", slammed down, then lying on the back. 2 frames, left to right.
1. His back slams flat onto the ground from the shoulders to the hips (head on the LEFT), knees bent and lifted toward the upper right by the bounce, arms flung out. Face: eyes shut, mouth open. Hair splashing out to the left.
2. Lying flat on his back, head on the LEFT and feet on the RIGHT, arms out at his sides, legs straight. Face: eyes closed, grimacing. Waist cloth splayed, the sword grip visible beside his hip.
MOTION: Lowest body points on one shared baseline (the ground line).

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A14 · `getup`: kip-up (CORE)

5 frames. **Save as: `raw/getup_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `down` strip (`raw/down_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#getup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "getup", kip-up. 5 frames, left to right.
1. Lying on his back (head on the LEFT), knees pulled to his chest, palms planted beside his head with the fingers toward the shoulders. Face: eyes open, angry.
2. Legs kicking up and over toward the upper right, rolling onto his shoulders, hands pushing off. Face: angry.
3. Springing up into the air, torso tilted back, legs folding under him, arms out. Face: focused.
4. Landing in a crouch facing right, arms coming into guard. Face: focused.
5. His fighting stance (left foot forward, same as idle frame 1). Face: cold, angry glare.
MOTION: He faces right from frame 4 on. Bangs, rope ends and waist cloth follow the flip.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

**Step 7 · specials**

### A15 · `charge`: powering up (loop) (CORE)

4 frames, loops, Sharingan on. **Save as: `raw/charge_vNN.png`** (next free version; today 03). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#charge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "charge", powering up with cold intensity: braced low, fists clenched hard and drawn down, head level and the red eyes locked on the opponent while the power tears at his hair and clothes. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
1. Brace: feet planted wide, well wider than the shoulders, left foot forward; knees bent about 40 degrees; torso leaning slightly forward; both arms drawn down and slightly back beside the hips, fists clenched hard, elbows bent and flared a little; shoulders squared; head level, staring at the opponent on the right. Face: angry, teeth bared. Bangs, back spikes, rope ends and bow loops lifted by a rising wind; the waist-cloth hem lifting.
2. Surge: the shoulders rise slightly and square back, the chest lifts, the fists push down, the elbows flare out a little more; a short, controlled shout. Face: shout. Rope ends flung up, the waist-cloth panels billowing up, the open lapels and sleeves flaring.
3. Peak: the same as pose 2 with the whole body trembling (shifted very slightly to the right) and the fists shaking. Face: shout. Bangs, rope ends, waist cloth and sleeves at their highest, in a third shape.
4. Settle: the shoulders drop back slightly, the mouth closing to bared teeth; the rope ends and the cloth drop a little into a fourth shape; it flows straight back into pose 1. Face: angry, teeth bared.
MOTION: A trembling power-up loop. The feet stay planted in exactly the same place in all 4 poses; the shoulders rise in poses 2 and 3 and settle in pose 4; the head stays level and moves only slightly. The bangs, rope ends, waist cloth, lapels and sleeves are blown UPWARD and change shape in every pose. NO aura, no lightning, no glow, no effects: the game adds them.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

---

### A16 · `beamCharge`: KIRIN, calling the storm (loop) (CORE)

3 frames, loops, Sharingan on. **Save as: `raw/beamCharge_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamcharge). Taller than the other strips: set `bodyHeight` 230 in the manifest before packing (KIT.md §1). Draw **no lightning, clouds or storm**: the engine draws them. If refused, replace "Kirin" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "beamCharge", KIRIN: he raises one arm to the sky to call down a storm. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
1. Wide, low stance: feet well apart, left foot forward, knees bent, torso upright. The RIGHT ARM RAISED STRAIGHT UP toward the sky beside his head (not in front of his face), the hand open with the palm up and the fingers spread, the fingertips about one head above the top of his hair; the left arm low at his side, hand open. Head tilted up toward the raised hand. Face: cold focus, mouth a flat line. Bangs, rope ends, the waist cloth and the open shirt whipped hard to the left by a storm wind.
2. Same pose, the whole body very slightly lower; bangs, rope ends and cloth in a new whipping shape.
3. Same pose, back up, the raised fingers flexing slightly; another hair and cloth shape.
MOTION: A tense, still loop: only the hair, cloth and fingers move. Feet identical in all frames. Draw NO lightning, clouds or energy: the game adds the storm.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A17 · `beamFire`: KIRIN, bringing the lightning down (loop) (CORE)

3 frames, loops, Sharingan on. **Save as: `raw/beamFire_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `beamCharge` strip (`raw/beamCharge_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamfire). Draw **no lightning dragon or energy**: the engine draws it. If refused, replace "Kirin" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "beamFire", KIRIN: he brings the raised arm down to point at the opponent while the lightning falls. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
1. Wide, low stance: left foot forward, knees bent, torso leaning slightly forward. The RIGHT ARM SWUNG DOWN AND FORWARD and fully extended toward the opponent on the right, slightly below shoulder height, the hand open with the fingers straight and together, pointing at the target; the left arm pulled back low at his side. Head behind the right shoulder, glaring along the arm. Face: cold, mouth a flat line. Bangs, rope ends, waist cloth and sleeves whipped back to the left by the blast wind.
2. Recoil: the whole body pushed slightly back; bangs and rope ends in a new whipping shape.
3. Pushing slightly forward again.
MOTION: The pointing fingertips are the right-most point of every frame. Draw NO lightning, dragon or energy: the game draws the lightning dragon.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

---

### A18 · `special`: CHIDORI rush (CORE)

8 frames, phases 3/3/2, Sharingan on. **Two images** (poses 1-3, then 4-8). **Save as: `raw/_parts/special_vNN_A.png` and `raw/_parts/special_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/special_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#special). Leave the right hand **open and empty**: the engine draws the lightning (low behind him through frame 6). If refused, replace "Chidori" per CHARACTER.md §9.

Part A (save as `raw/_parts/special_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "special", CHIDORI rush. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 3. Poses 1 to 3 are the startup: no hit yet.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
1. The eyes flare red; feet planted, knees starting to bend; the right arm snaps down and back; the left hand reaches across his waist toward the right forearm. Face: angry.
2. Deep crouch, torso leaning forward about 30 degrees: RIGHT ARM STRAIGHT DOWN AND BACK behind his right leg, palm open facing the floor, fingers spread, the hand about knee height behind him; the left hand grips the right forearm halfway between elbow and wrist. Face: teeth gritted. Bangs, rope ends and waist-cloth hem blown upward by the energy wind.
3. Same crouch with more tension: shoulders hunched, right fingers clawed, eyes locked on the target. Face: teeth gritted.
MOTION: Draw NO lightning anywhere: the right hand is open and empty in every frame (the game adds the lightning). The sword stays sheathed at his back.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/special_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "special", CHIDORI rush. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 4 to 8 (the attached part A shows poses 1 to 3). Poses 4, 5 and 6 are active rush frames: in poses 4 and 5 he hits with his leading shoulder while the right hand trails behind him at knee height (the hand is NOT the right-most point there); in pose 6 the right spear-hand is fully extended toward the right and is the right-most part of the character.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
4. Sprinting to the right in a low ninja run, torso leaning about 45 degrees, head up glaring ahead; the RIGHT ARM TRAILS STRAIGHT BACK AND LOW with the open hand at knee height behind his rear leg, well above the floor (never lower than his knees); left arm swung back; left leg forward. Face: angry. Bangs, rope ends and waist cloth streaming back.
5. Same sprint with the legs swapped (right leg forward); the right hand still trailing behind at knee height at the same spot, well above the floor.
6. THRUST: hips and shoulders whip forward, the RIGHT ARM SNAPS STRAIGHT FORWARD to the right at stomach height as a spear-hand with straight fingers; left leg lunging forward and bent, right leg straight back. SMEAR: a solid arc from the low trailing position up to the hand (no blur). Face: shout.
7. IMPACT POSE: deepest lunge, right arm fully extended forward at stomach height as if driven into an opponent's chest, head down behind his shoulder. Face: teeth gritted. Bangs, rope ends and cloth whipping forward from the sudden stop.
8. Recovering: arm still forward but bending, weight shifting back, torso rising. Face: mouth closed, cold.
MOTION: Draw NO lightning anywhere: the right hand is open and empty in every frame (the game adds the lightning). The sword stays sheathed at his back.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

**Step 8 · rest of the core**

### A19 · `dash`: low forward dash (loop) (CORE)

2 frames, loops. **Save as: `raw/dash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#dash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "dash", low forward dash. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Very low, fast forward dash to the right: torso leaning about 50 degrees forward, head up glaring ahead, left knee bent under his chest, right leg extended straight back with the toes dragging, both arms trailing straight back. Face: focused. Bangs, rope ends and waist cloth streaming back hard.
2. Stride slightly wider; bangs, rope ends and cloth hem in a different flutter shape.
MOTION: Both frames low and long; the head stays at the same height.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A20 · `jumpUp`: rising (loop) (CORE)

2 frames, loops. **Save as: `raw/jumpUp_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "jumpUp", rising. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Rising in a jump: knees tucked high (left knee near the chest, right knee a bit lower), torso upright, the RIGHT arm raised up and forward with a closed fist at the height of the top of his hair, left arm down and back, head tilted slightly up. Face: cold. Bangs, rope ends and the waist-cloth hem dragged DOWNWARD by the upward motion.
2. Knees and the right arm slightly lower; bangs and rope ends fluttering differently.
MOTION: Both poses in mid-air.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A21 · `jumpFall`: falling (loop) (CORE)

2 frames, loops. **Save as: `raw/jumpFall_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpfall).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "jumpFall", falling. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Falling from a jump: legs extending down (left leg slightly forward, right leg slightly back, both slightly bent, toes pointed down), arms out for balance (right arm out forward and up, left arm out back, hands open). Face: cold. Bangs and rope ends LIFTED UPWARD by the air, the waist-cloth hem lifted and flared.
2. Arms slightly higher; bangs, rope ends and cloth hem fluttering differently.
MOTION: Both poses in mid-air.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A22 · `land`: landing (CORE)

2 frames. **Save as: `raw/land_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#land).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "land", landing. 2 frames, left to right.
1. Landing impact crouch: knees deeply bent, torso leaning forward, arms out forward and down for balance; bangs swinging down past their rest position, the waist-cloth hem pooled over the knees. Face: cold.
2. Rising halfway back into his fighting stance (left foot forward), arms returning to guard, bangs and rope ends settling. Face: cold.
MOTION: Feet on one baseline in both frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A23 · `win`: back-turned salute (loop) (CORE)

4 frames, loops. **Save as: `raw/win_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#win).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "win", back-turned salute. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Cool victory pose, standing upright as if about to walk away into the distance on the right. His back faces the viewer: the small red-and-white fan crest on the back of the collar, the big purple rope bow and the sheathed sword lying horizontally across the small of his back are clearly visible. His head turns over his RIGHT shoulder, glancing back at the viewer (one dark eye visible). His RIGHT hand is raised beside his head at head height with the index and middle fingers up (a casual two-finger salute), never higher than the top of his hair. Left hand relaxed at his side. Face: faint smirk.
2. Bangs, rope ends and waist-cloth hem fluttering in a breeze.
3. The two fingers flick forward slightly (the salute).
4. Settling, another flutter shape.
MOTION: Feet identical in all frames.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: 3/4 BACK view: his back faces the viewer and his body points into the picture toward the upper right; his head turns back over his right shoulder toward the viewer. His right arm is nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

**Step 9 · optional**

### A24 · `backDash`: quick hop backward

3 frames. **Save as: `raw/backDash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#backdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "backDash", quick hop backward. 3 frames, left to right.
1. Push-off: knees bent, pushing off the ball of the front (left) foot, torso upright leaning slightly back, forearms rising into guard. Face: cold.
2. Airborne hop backward to the LEFT while still facing right: knees tucked, leaning back, arms forward for balance; bangs, rope ends and the waist-cloth hem whipping forward to the right.
3. Landing on the ball of the back (right) foot with the legs nearly straight, knees starting to absorb, arms returning to his stance; bangs swinging back.
MOTION: He faces right in every frame.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A25 · `superDash`: homing super dash (loop)

2 frames, loops. **Save as: `raw/superDash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "superDash", homing super dash. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Flying to the right like a missile, the body angled about 25 degrees UPWARD (head and leading fist higher, hips lower), eyes locked on the target. RIGHT arm thrust forward along the flight line with a closed fist leading the shape; left arm tucked along his side pointing back. KNEES BENT SHARPLY as if kneeling in the air: thighs angled down and a little forward from the hips, shins folded back so the feet trail behind; the knees are the lowest point, under the middle of the shape; toes pointed. Face: angry. Hair spikes flattened back; bangs, rope ends and waist cloth streaming straight back.
2. Knees bent slightly more and slightly apart; waist cloth and rope ends fluttering differently.
MOTION: Not stretched fully horizontal: each pose is about twice as wide as it is tall. No speed lines.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A26 · `jumpSquat`: pre-jump crouch

1 frame. **Save as: `raw/jumpSquat_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpsquat).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "jumpSquat", pre-jump crouch. 1 frame.
1. Deep crouch right before jumping: knees bent sharply, left foot forward, torso leaning forward, both arms swung down and back with open hands, head up looking forward and up; the waist-cloth hem pooled over the knees. Face: focused.
MOTION: Both feet flat on the ground.

LAYOUT: one single pose centered on a 1024x1024 square canvas, the whole body visible with a clear magenta margin. Make the character as large as the canvas allows.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A27 · `airLight2`: mid-air front kick with the R leg

5 frames, phases 1/2/2. **Save as: `raw/airLight2_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight2).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "airLight2", mid-air front kick with the right leg. 5 frames, left to right. Poses 2 and 3 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
1. Air pose with the right knee chambered up to his chest, arms in guard. Face: cold.
2. IMPACT: right leg extends STRAIGHT FORWARD to the right, angled slightly down, the foot at his own hip height; torso leaning back, right arm out behind for balance; the left leg hangs as the lowest point. SMEAR: a solid arc to the foot (no blur). Face: angry.
3. Same kick without the smear. Face: angry.
4. Knee folding back in. Face: focused.
5. Air pose: torso upright, arms in guard, left knee forward and up, right leg hanging with pointed toes. Face: cold.
MOTION: All poses in mid-air. The waist cloth never covers the kicking foot.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A28 · `airLight3`: mid-air spinning kick with the L leg

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/airLight3_vNN_A.png` and `raw/_parts/airLight3_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/airLight3_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight2` strip (`raw/airLight2_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight3).

Part A (save as `raw/_parts/airLight3_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "airLight3", mid-air spinning kick with the left leg. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
1. Body twisting away so his back faces the viewer (collar crest, rope bow and the sword across his back visible), left knee chambered. Face: angry.
2. Spinning: hips turning over, head spotting the target on the right, waist cloth flaring.
3. IMPACT: LEFT leg fully extended forward to the right, heel leading, at his own chest-to-hip height; body leaning back, right knee tucked, arms flung out. SMEAR: a big solid crescent (no blur). Face: shout.
4. Same kick without the smear. Face: shout.
MOTION: All poses in mid-air. The sword turns with his back and never points at the target.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/airLight3_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "airLight3", mid-air spinning kick with the left leg. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Leg folding back in. Face: focused.
6. Air pose: torso upright, arms in guard, left knee forward and up, right leg hanging with pointed toes. Face: cold.
MOTION: All poses in mid-air. The sword turns with his back and never points at the target.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A29 · `block`: pushed back while blocking

2 frames. **Save as: `raw/block_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `guard` strip (`raw/guard_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#block).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "block", pushed back while blocking. 2 frames, left to right.
1. Blocking a heavy hit from the right: forearms still crossed in an X in front of his face but jarred upward, the whole body leaning back and pushed back, right heel digging in. Face: eyes shut tight, teeth gritted. Bangs, rope ends and waist-cloth hem blown back to the left.
2. Settling back into his steady crossed-arm guard (forearms crossed in front of his face, chin tucked, glaring over the arms), knees a little straighter than in the guard. Face: focused glare.
MOTION: Feet on one baseline.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A30 · `hurtLow`: hit in the stomach

3 frames. **Save as: `raw/hurtLow_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurtlow).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "hurtLow", hit in the stomach. 3 frames, left to right.
1. Hit in the stomach from the right: doubled over, torso bent forward about 40 degrees, head down, both arms clutching his stomach over the rope belt, knees bent. Face: eyes wide with tiny pupils, mouth open. Bangs swinging down.
2. About one third recovered. Face: pain.
3. Rising, wincing, one hand still on his stomach. Face: pain, teeth gritted.
MOTION: Feet on one baseline.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A31 · `spin`: tumbling backward (loop)

4 frames, loops. **Save as: `raw/spin_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#spin).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "spin", tumbling backward. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Tumbling head over heels backward through the air after a big hit, balled up with knees to his chest and arms bent in, tilted back 30 degrees, head at the upper left. Face: eyes shut in pain.
2. Rotated 120 degrees: head pointing down-left.
3. Upside down: head at the bottom.
4. Rotated 300 degrees: head at the right, coming back upright.
MOTION: One full backward rotation, turning COUNTER-CLOCKWISE on screen. Bangs, rope ends and waist cloth trail opposite to the rotation; the sword turns with his back.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: seen from the side with his chest turned slightly toward the viewer, camera slightly above; he rotates in the picture plane, starting from a pose that faces right. His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A32 · `airRecover`: mid-air backflip recovery

3 frames. **Save as: `raw/airRecover_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airrecover).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "airRecover", mid-air backflip recovery. 3 frames, left to right.
1. Tucked, knees to his chest, tilted back 60 degrees. Face: eyes open, regaining focus.
2. Upside down, fully tucked.
3. Almost upright, unfolding: legs extending down, arms out, facing right. Face: cold glare.
MOTION: A backflip rotating COUNTER-CLOCKWISE on screen, all in mid-air.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A33 · `throw`: FIREBALL, breathed in mid-air

4 frames, phases 1/1/2, Sharingan on. **Save as: `raw/throw_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#throw). Sasuke tip: run A33 `throw` and A37 `intro` first within step 9; they show up every match. His release point is his **mouth**; draw **no fire** (the engine draws the fireball). If refused, replace "Great Fireball" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "throw", FIREBALL, breathed in mid-air. 4 frames, left to right. Pose 2 is the RELEASE frame.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
AIR POSE (frames 1 and 4): torso upright, left knee bent forward and up, right leg hanging with pointed toes.
1. Inhaling: air pose, torso upright leaning back, chest puffed, cheeks full, both hands forming a hand seal at his chin (fingers interlaced, both index and middle fingers pointing up together).
2. RELEASE: exhaling hard: torso and head lunge forward and down toward the right (torso leaning about 30 degrees), legs trailing back and down, mouth wide open and round as if blowing; right hand raised beside his lips with the index and middle fingers up; left arm swung back; bangs whipping back.
3. Still blowing with the mouth less open, body drifting back from the recoil, legs extending.
4. Air pose, hands lowering, mouth closed.
MOTION: All poses in mid-air. NO fire anywhere: the game draws the fireball in front of his mouth.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A34 · `vanish`: high-speed teleport

2 frames. **Save as: `raw/vanish_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#vanish).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "vanish", high-speed teleport. 2 frames, left to right.
1. Quick crouch, torso leaning forward, arms pulled in. Face: sharp, focused eyes.
2. Body stretched a little taller and thinner, up on his toes, arms tight to his sides, bangs, rope ends and cloth streaming upward, and the lower half of his body broken into 3 or 4 solid horizontal slices shifted sideways by small amounts (an anime high-speed afterimage), drawn with solid shapes in his own colors.
MOTION: No transparency, no blur: the slices are solid.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A35 · `stagger`: dizzy stagger (loop)

4 frames, loops. **Save as: `raw/stagger_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#stagger).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "stagger", dizzy stagger. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Dizzy, standing almost upright on wobbly knees, arms hanging loose; torso and head leaning to the right. Face: eyes half-lidded and unfocused, mouth slightly open. Bangs messy over the eyes.
2. Centered, upright.
3. Leaning to the left.
4. Centered.
MOTION: No stars or swirls (the game adds effects if needed). Feet on one baseline.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A36 · `ko`: knocked out

1 frame. **Save as: `raw/ko_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#ko).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "ko", knocked out. 1 frame.
1. Knocked out, lying flat on his back with his head on the LEFT and feet on the RIGHT, completely limp, arms splayed, one knee only slightly bent. Face: eyes closed, mouth slightly open. Hair spread on the ground, waist cloth splayed, the sword grip visible beside his hip.
MOTION: Flat and long: the pose is about three times as wide as it is tall.

LAYOUT: one single pose centered on a 1536x1024 landscape canvas, the whole body visible with a clear magenta margin. Make the character as large as the canvas allows.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A37 · `intro`: arms-crossed cold stare (loop)

4 frames, loops. **Save as: `raw/intro_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#intro). High priority within step 9 (shows up every match).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "intro", arms-crossed cold stare. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Pre-fight attitude: standing upright with straight legs, feet slightly apart, weight on the right leg, body turned a bit more toward the viewer; ARMS FOLDED across his chest (right forearm over the left); chin slightly raised, looking down his nose at the opponent on the right with half-lidded dark eyes. Face: cold, a faint one-sided smirk at most. A light breeze moves the bangs, rope ends and cloth hem.
2. Breathing, slightly up; bangs and rope ends swaying.
3. Head tilting slightly (dismissive); rope ends and cloth fluttering further.
4. Settling back toward frame 1.
MOTION: Feet identical in all frames.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A38 · `taunt`: "come at me" beckon (loop)

2 frames, loops, Sharingan on. **Save as: `raw/taunt_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#taunt).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "taunt", "come at me" beckon. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: the Sharingan in every frame: glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it.
1. Standing upright, body turned toward the viewer, chin down, glaring at the opponent on the right with a slight smirk; LEFT arm extended forward at chest height, palm up, fingers straight; right hand relaxed at his side.
2. The left fingers curl in (beckoning); rope ends flicking.
MOTION: Feet identical in both frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

---

### A39 · `specialForward`: CHIDORI SHARP SPEAR, spear-hand thrust (opt v2, fallback `special`)

7 frames, phases 2/2/3, Sharingan in poses 2-5. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/specialForward_vNN_A.png` and `raw/_parts/specialForward_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/specialForward_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light1` strip (`raw/light1_vNN.png` with NN = its `approvedVersion`; same lead-hand line); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialforward). This move uses the **left** hand, open and empty in every frame: the engine draws the lightning in it and the spear from the fingertips. If refused, replace "Chidori Sharp Spear" and "Sharingan" per CHARACTER.md §9.

Part A (save as `raw/_parts/specialForward_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialForward", CHIDORI SHARP SPEAR, a fast, short-range spear-hand thrust with the LEFT hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or hand) is fully extended toward the right and is the right-most part of the character; head, hair, rope ends, waist cloth and sword stay behind it.
EYES: the Sharingan in poses 2 to 5 (glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it); normal dark eyes (#2c2c40) in poses 1, 6 and 7.
1. From his fighting stance, the weight starts shifting forward onto the left (front) foot, knees starting to bend; the LEFT hand pulls back from the guard and down to his left hip, palm open, fingers slightly spread, the elbow bent back; the right fist guards his chest; the left shoulder turns slightly away. Face: cold.
2. Weight forward, knees bent deeper, shoulders coiled, head forward: the LEFT hand held low beside his left hip and a little in front of it, palm open and turned forward and down, fingers spread and tense, the whole hand clearly visible in front of the waist cloth. The eyes flare red. Face: focused.
3. IMPACT: hips and left shoulder drive forward into a deep lunge, left leg forward and bent, right leg straight back; the LEFT ARM FULLY EXTENDED horizontally to the right at the height of his own lowered chest, a spear-hand with the fingers straight and pressed together, palm down, wrist straight; the right fist pulled back to his right hip; chin tucked behind the left shoulder. SMEAR: a solid tapered streak from the hip to the fingertips in the sleeve, arm-guard and skin colors (no blur). Face: angry, teeth just showing.
4. Same extension without the smear, the fingertips slightly further; bangs, rope ends and waist cloth whipping forward from the sudden stop. Face: angry.
MOTION: Draw NO lightning anywhere: the left hand is open and empty in every frame (the game adds the lightning in the hand and the lightning spear from the fingertips). The sword stays sheathed at his back. The lunge stays inside its slot.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialForward_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialForward", CHIDORI SHARP SPEAR, a fast, short-range spear-hand thrust with the LEFT hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
EYES: the Sharingan in poses 2 to 5 (glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it); normal dark eyes (#2c2c40) in poses 1, 6 and 7.
5. Pulling the arm back: the left elbow bends, the hand retracting toward his chest, the body rising out of the lunge, weight shifting back. Sharingan. Face: cold.
6. The left hand back near the guard, opening into the knife-hand; the left foot slides back; normal dark eyes. Face: cold.
7. Fighting stance (same as idle frame 1), normal dark eyes. Face: cold.
MOTION: Draw NO lightning anywhere: the left hand is open and empty in every frame (the game adds the lightning). The sword stays sheathed at his back.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A40 · `specialUp`: LION'S BARRAGE rising kick (opt v2, fallback `special`)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/specialUp_vNN_A.png` and `raw/_parts/specialUp_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/specialUp_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airHeavy` strip (`raw/airHeavy_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialup). The slam is his `airHeavy` strip, so pose 6 must match `airHeavy` pose 1. Normal dark eyes (no Sharingan). If refused, replace "Lion's Barrage" per CHARACTER.md §9.

Part A (save as `raw/_parts/specialUp_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialUp", LION'S BARRAGE rise: a rising anti-air kick that carries him straight up (it ends in his double-fist hammer slam). 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are HIT frames (an anti-air kick on the way up): the right foot kicks straight up in front of his face and is the highest point of the character; head, hair, rope ends and waist cloth stay below and behind it.
1. Crouch: knees deeply bent, torso leaning forward, both arms swung down and back, head up looking up and forward at the target. Back hair spikes squashed slightly, the waist-cloth hem pooled over the knees. Face: focused.
2. Spring: legs extending explosively, heels off, toes last on the ground, the torso still leaning forward and the knees not yet straight; both arms swinging forward to chest height (the hands no higher than his chin). Face: focused.
3. IMPACT: rising straight up through the air; the RIGHT LEG KICKS STRAIGHT UP in front of his body, knee locked, the ball of the foot leading, the foot in front of his face at about the height of the top of his hair (no more than a few pixels above it); torso upright, leaning back slightly; the left leg hangs below with the knee slightly bent and the toes pointed (the lowest point); both arms swept down and back along his sides. The kicking leg comes out between the panels of the waist cloth. SMEAR: a solid crescent from the hip up to the foot (no blur). Face: angry, teeth showing. Bangs, rope ends and the cloth hem dragged downward by the rise.
4. Same rising kick without the smear, the foot slightly higher. Face: angry.
MOTION: All poses after pose 2 are in mid-air. Normal dark eyes in every pose. Draw NO lightning, dust or speed lines: the game adds the effects. Nothing in poses 5 and 6 rises above the kicking foot of pose 3.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialUp_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialUp", LION'S BARRAGE rise: a rising anti-air kick that carries him straight up (it ends in his double-fist hammer slam). 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Turning over at the top of the jump: the kicking leg folds, both knees tuck toward his chest, the body tips forward over the top (torso pitched about 30 degrees forward, head looking down at the target below on the right), both arms swinging up past his shoulders with the hands coming together. Face: focused.
6. Apex hang: both hands clasped together (fingers interlocked) raised overhead, torso arching back, knees tucked; this pose leads straight into his double-fist hammer slam (match the first pose of the attached airHeavy strip exactly). Face: shout.
MOTION: All poses are in mid-air. Normal dark eyes in every pose. Draw NO lightning, dust or speed lines. Nothing in poses 5 and 6 rises above the kicking foot of pose 3 in part A.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A41 · `specialDown`: SHARINGAN COUNTER stance (opt v2, fallback `charge`)

4 frames, phases 2/1/1, Sharingan in poses 2-4. **Save as: `raw/specialDown_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialdown). A still stance with no hit box; pose 3 is the frame players see longest. Draw **no glow or flash**: the engine adds the counter effect. If refused, replace "Sharingan" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "specialDown", SHARINGAN COUNTER: a calm, perfectly still reading stance that waits for the opponent's attack. 4 frames, left to right. No strike in any pose.
EYES: the Sharingan in poses 2 to 4 (glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16), a black pupil and three small black comma marks around it); normal dark eyes (#2c2c40) in pose 1.
1. Settling out of his fighting stance: knees bending a little more, torso coming upright, weight centered; the right hand starts rising, open; the left hand starts dropping. Eyes dark and narrowing. Face: cold.
2. The calm guard: the RIGHT hand raised open in front of his face, palm toward the opponent on the right, fingers straight up and together, held a little forward of the face with the fingertips just below eye height so both eyes stay visible; the LEFT hand low in front of his stomach, open and ready; chin down. The eyes snap to the Sharingan. Face: cold, intense stare.
3. HELD READING STANCE: the same pose, perfectly still and balanced, the Sharingan glaring at the opponent on the right; the left hand low and ready, fingers loose. Bangs, rope ends and waist cloth completely at rest. Face: cold, unblinking.
4. Relaxing back toward his fighting stance: the right hand lowering to his chest, the left hand rising back toward the forward knife-hand guard; Sharingan still on. Face: cold.
MOTION: Feet identical in all 4 frames. A still, controlled stance: no strike, nothing reaches forward. Draw NO glow, aura or lightning around him or his eyes: the game adds the counter flash.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### A42 · `superPose`: AMATERASU, Mangekyō Sharingan glare (loop) (opt v2, fallback `taunt`)

4 frames, loops, **Mangekyō Sharingan** (the only strip with it). **Save as: `raw/superPose_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superpose). His ultimate's pose (Heavy + Special): without it the super flash shows the taunt, so generate it. **No blood** from the eye (PG) and **no black flames**: the engine ignites them on the opponent. If refused, replace "Amaterasu" and "Mangekyō Sharingan" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose.

ANIMATION: "superPose", AMATERASU: a cold, perfectly still eye-technique stare at the opponent (shown during the super flash). 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: the MANGEKYŌ SHARINGAN in both eyes in every frame (the only animation with this eye; it overrides the eyes of the attached sheets): glowing red irises (#d81e28) with a thin dark-red rim (#7c0c16) and, instead of the three small comma marks, one bold black (#141018) three-bladed pinwheel around the pupil: three curved, pointed black blades, like a three-pointed throwing star, whose tips reach the rim of the iris. Even at small size each eye must read as red with a large black three-pointed star in the middle, clearly darker than the normal Sharingan. No blood, no tears, no red streaks on the face.
1. Standing tall and still: legs nearly straight with soft knees, feet shoulder-width apart, weight on the right leg, body turned a bit more toward the viewer, head turned toward the opponent on the right so both eyes show, chin slightly down. The LEFT hand raised to his left eye: palm toward his face, fingers spread, the fingertips resting along his brow and temple just above and beside the left eye, framing it; the left eye stays fully visible under and between the fingers. The right arm hangs relaxed at his side. A cold, merciless glare, mouth a flat line. A light wind moves the bangs, rope ends and cloth hem.
2. Same pose; bangs and rope ends sway slightly.
3. Same pose; the left fingers tense slightly; the rope ends and cloth hem in a new flutter shape.
4. Settling back toward frame 1, another small hair and cloth variation.
MOTION: A menacing still pose: the body does not move, only the hair, cloth and fingers. Feet identical in all frames. The raised hand stays below the top of his hair. Draw NO black flames, fire, aura or glow: the game adds them.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

---

## UI art

UI images are not packed into the sheet. Codex saves every candidate as **`raw/ui_<name>_vNN.png`**
(the sheet packer skips `ui_*` files) and adds a REVIEW.md row. After "approve sasuke <name> vNN",
Codex **copies** that version to `ui/<name>.png`; the packer removes the magenta, crops and fits it to
the exact size (nearest / palette-preserving "mode" sampling) and writes it to
`public/characters/sasuke/` (SPEC.md "Per-character UI images"). Rejected versions move to
`raw/_rejected/`. Attach `reference/model_sheet.png` and `reference/expressions.png`.

### U1 · Portrait (96×96)

**Save as: `raw/ui_portrait_vNN.png`** → approved copy `ui/portrait.png` (packed to 96×96, transparent).

```text
Pixel-art character portrait for a fighting-game HUD (anime fan-art).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and expression sheet exactly.

Head and shoulders, facing RIGHT in 3/4 view (both eyes visible), cropped at the upper chest; the head fills most of the frame. Cold, confident glare with DARK eyes (not red), brows angled down, mouth a flat line; long bangs framing both sides of the face, the spiky back of the hair visible behind the head, the tall white collar open at the throat. No forehead protector. Bold, readable shapes that still work when shrunk to 96 by 96 pixels.
SIZE: a 1024x1024 square canvas showing pixel art on a 96x96 art-pixel grid (every art pixel is a crisp square block about 10x10 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no border, no ground shadow, no effects.
```

### U2 · Super cut-in eye strip (480×128)

The DBFZ-style super-flash strip before his supers (Kirin and Amaterasu). **Save as: `raw/ui_cutin_vNN.png`** →
approved copy `ui/cutin.png`. The packer removes the magenta above and below the band and fits the
band to 480×128. The face fills the strip edge to edge.

```text
Pixel-art "super move cut-in" for a fighting game (anime fan-art), an extreme close-up of the character's eyes.
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and expression sheet exactly.

On a 1536x1024 landscape canvas, draw one horizontal band 1536 px wide and 410 px tall across the middle (ratio 3.75 to 1). Inside the band: an extreme close-up of his face from the bangs above the brows to just below the nose, both eyes visible, face turned slightly toward the right. A slim, angular, mature 16-year-old face with narrow eyes, not chibi. Expression: cold fury, brows hard down. Both eyes are the Sharingan: glowing red irises (#d81e28) with a thin dark-red ring (#7c0c16), a black pupil and three black comma-shaped marks (tomoe) around it. Long black-blue bangs cut diagonally across the band, a few tiny blue-white lightning glints at the edges. The face fills the band completely; a flat dark navy (#10173a) background may show only around the eyes and brows. No forehead protector.
SIZE: pixel art on a 480x128 art-pixel grid inside the band (every art pixel is a crisp square block about 3x3 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a. Plus for the glints only: #d8f0ff #5aa8ff.
BACKGROUND: flat solid magenta #FF00FF above and below the band only. No text, no speed lines, no borders.
```

### U3 · Character select art (384×384)

**Save as: `raw/ui_select_vNN.png`** → approved copy `ui/select.png` (packed to 384×384, transparent).
The Chidori lightning **is** allowed here (UI art, not a sprite).

```text
Pixel-art full-body character select illustration for a fighting game (anime fan-art).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and expression sheet exactly.

Low dramatic stance facing RIGHT in 3/4 view: crouched forward, his RIGHT hand held low behind him crackling with a ball of blue-white lightning (draw the lightning in this image: white core, light-blue and blue jagged arcs, a few arcs striking the ground; hard pixels, no blur), LEFT hand gripping his right forearm, Sharingan eyes (glowing red with three black comma marks) glaring toward the right; bangs, rope-bow ends and the waist cloth blown by the energy wind; the sword stays sheathed at the back of his belt. The whole body fits inside the frame with a small margin.
SIZE: a 1024x1024 square canvas showing pixel art on a 384x384 art-pixel grid (every art pixel is a crisp square block about 2.7x2.7 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a. Plus for the lightning only: #ffffff #d8f0ff #9ad8ff #5aa8ff #3a54ff.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no logo, no ground shadow.
```

---

## Extra · Optional Sasuke effect art (engine support pending)

Specs in [MOVES_AND_VFX.md](MOVES_AND_VFX.md) §4. The engine does not read these yet (task ENG-014),
and the packer never reads `_proposed/`. **Save as: `art/vfx/raw/_proposed/sasuke_<effect>_vNN.png`**
with a REVIEW.md row per version. Generate them only after the core strips are packed.

### X1 · `sasuke_chidoriBall` (8 frames)

```text
Pixel-art game effect sprite strip: sasuke_chidoriBall, 8 frames, ONE horizontal row on a 1536x1024 landscape canvas, evenly spaced, each frame a square cell with the effect centered. A dense crackling ball of lightning held in a hand (the hand is NOT drawn): a white-hot core (#ffffff), forked jagged bolts in #d8f0ff, #9ad8ff and #5aa8ff with dark blue #3a54ff tips, 3 to 6 long tendrils whipping out, a different arc pattern in every frame so it flickers when looped. Hard pixels, no blur, no glow gradients, flat magenta #FF00FF background, no text.
```

### X2 · `sasuke_fireballCore` (6 frames)

```text
Pixel-art game effect sprite strip: sasuke_fireballCore, 6 frames, ONE horizontal row on a 1536x1024 landscape canvas, evenly spaced, each frame a square cell with the effect centered. A large roiling ball of fire moving to the RIGHT, flame tongues streaming back to the LEFT, a swirling yellow-white core (#fff4c0, #ffd04a), orange body (#ff9a24, #f05a14), red and dark-red edges (#c42a10, #6a1a0a); the flames churn differently in every frame so it loops. Hard pixels, flat cel-shaded flame shapes, no blur, no gradients, flat magenta #FF00FF background, no text.
```

For `sasuke_chidoriDrag`, `sasuke_chidoriPierce`, `sasuke_fireballBreath`, `sasuke_fireballBlast`,
`sasuke_lanceTip` and `sasuke_sharinganGlint`, reuse the same wording with the description and colors
from the MOVES_AND_VFX.md §4 table. Tinted effects (`sasuke_lanceTip`, `sasuke_sharinganGlint`) are
drawn in white and light grey only.

---

## Fix-up prompts

### F1 · Redraw one frame

Attach the strip that has the bad frame (its latest `raw/<anim>_vNN.png`) plus `reference/model_sheet.png`.
**Save each redrawn attempt as `raw/<anim>_NN_fixMM.png`** (NN = the bad frame's 0-based file number,
MM = the attempt: pose 3 in the prompt, first attempt = `<anim>_02_fix01.png`, so attempts never
overwrite each other; the packer skips `*_fix<digits>.png` files, so a loose single frame never gets
packed as an animation of its own). Codex removes the background, pastes it over the bad
pose at the same head size, and saves the patched strip as the **next** version `raw/<anim>_vNN.png`
(never edit an existing version in place), with a REVIEW.md row ("frame N patched"). Then
`npm run sprites sasuke`.

```text
Using the attached sprite strip, redraw ONLY frame <N> as a single pose on a 1024x1024 flat solid magenta (#FF00FF) canvas, at exactly the same character scale, design, proportions (about 6.5 heads, not chibi) and palette as the other frames. Fix: <describe the problem, e.g. "the right fist must be fully extended horizontally toward the right at chin height; it is the right-most point of the character">. Keep everything else about the pose identical. Facing right, 3/4 view, no forehead protector, the sword sheathed at the back of the rope belt, crisp hard pixels, no anti-aliasing, no text, no ground shadow.
```

### F2 · Character drifted off-model

Regenerate the whole strip as the next version (`raw/<anim>_vNN.png`), attaching the drifted strip.

```text
In the attached strip the character drifted from the attached model sheet: <list, e.g. "a forehead protector appeared", "the head is too big (chibi) in frames 4-6", "the rope belt turned blue", "the sword is drawn in his hand", "the waist cloth is missing">. Redraw the whole strip with exactly the same poses, fixing only those details: about 6.5 heads tall, no forehead protector, purple rope belt with the bow at the back, knee-length navy waist cloth, the sword sheathed at his back. Same layout, scale, palette and magenta background.
```

### F3 · Hit frames don't reach

Regenerate as the next version.

```text
In the attached strip, frames <a>-<b> are the hit frames but the <fist / foot / hand> stops short. Redraw the strip with the same poses, except that in frames <a>-<b> the <limb> is fully extended horizontally toward the right edge of the image and is clearly the right-most part of the character. Head, hair, rope ends, waist cloth and sword stay behind it. Same scale, palette and magenta background.
```

### F4 · Inconsistent scale or baseline

Regenerate as the next version.

```text
In the attached strip the character changes size between frames and the feet are not on one baseline. Redraw it with exactly the same poses, the same head size in every frame (about 6.5 heads tall, not chibi), and every grounded foot on one shared horizontal line. Same palette and magenta background.
```

### Fix-up lines (append one to a regeneration)

| problem | add this line |
|---|---|
| chibi / big head / short legs | "About 6.5 heads tall: small head, long legs, the crotch at half his height. Not chibi, not super-deformed." |
| wrong number of poses | "Exactly N poses in one row, no more, no less." |
| poses overlap or touch | "Leave a wide empty magenta gap between every pose." |
| size changes between poses | "Every pose is the same character size as pose 1; feet on one baseline." |
| facing left | "He faces RIGHT in every pose (his right arm nearest the viewer)." |
| strike goes up, down or into the screen | "The punch/kick travels straight to the right, horizontally, at <height> height." |
| blurry or painterly | "Clean hard-edged pixel art on one pixel grid, fewer colors, no anti-aliasing, no gradients." |
| shadow, text or effects added | "No ground shadow, no text, no effects; plain flat magenta background." |
| headband appears | "No forehead protector, no headband: bare forehead with bangs falling over it." |
| hair brown or grey, eyes blue | "Hair is black with a dark-blue sheen; eyes are dark (red Sharingan only where I ask)." |
| outfit drifts (Part 1 navy shirt, shorts, leg wraps, closed shirt) | "Match the attached model sheet exactly: white long-sleeved shirt open in a deep V, purple rope belt with a bow at the back, knee-length navy waist cloth over navy pants, navy forearm guards, black sandals." |
| sword drawn, in hand or pointing forward | "The sword stays sheathed, tucked horizontally through the rope belt at the small of his back." |
| off-model face | "Attach expressions.png. Same face as the reference: narrow sharp dark eyes, angular jaw, long side bangs." |
