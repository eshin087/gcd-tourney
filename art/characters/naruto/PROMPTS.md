# Naruto: image prompts (spec v2, generation order)

> **ART-SCALE-01 user correction:** preserve Gojo's original approved compact head and slender adult proportions (model v03, idle v02). The enlarged-head candidates are rejected. Use the original Gojo as the visual scale reference when reviewing the cast; retain character height differences and stable anatomy through animations. Never enlarge Gojo to satisfy the nominal 31px target. See [CHARACTER_SCALE.md](../../CHARACTER_SCALE.md).

> Copy-paste prompts for the image generator, in the order to run them. **Spec v2**
> ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md)) governs cell and pixel
> production values. Naruto's anatomy and scale follow the user-approved title-style cells and
> [production contract](../../scale/title-style-pilot/PRODUCTION_CONTRACT.md), not a universal head ratio.
> Each prompt is self-contained. The poses are the
> same as [ANIMATIONS.md](ANIMATIONS.md), described in words. Look, palette and fallback wording:
> [CHARACTER.md](CHARACTER.md). Pipeline and QA: [art/PIPELINE.md](../../PIPELINE.md). Review queue:
> [art/REVIEW.md](../../REVIEW.md). If anything here disagrees with ADR 0007 or
> [art/SPEC.md](../../SPEC.md), they win.

> **Shorter-hair revision:** the user approved the compact spikes and upper-ear temple tufts.
> `reference/model_sheet.png`, `reference/expressions.png` and `reference/idle_approved.png`
> are approved **v02** references; run **v03** is also approved.
> **User workflow override (2026-10-09):** finish the remaining Naruto set and QA without
> intermediate approval pauses. Keep new candidates provisional until one final set review.

## How to use (Codex + user)

1. **Codex generates the images** with its built-in image generator, one prompt block per image. The
   user may run the same block in ChatGPT by hand and hand the file over (same naming). Use one
   thread for Naruto. **Sasuke can run in parallel** in his own thread with his own
   [PROMPTS.md](../sasuke/PROMPTS.md): one character per thread and per image, each thread writes
   only its own folder and its own REVIEW/TRACKER/manifest lines (art/PIPELINE.md "Parallel
   characters").
2. **Attach the approved references as image inputs.** S1: nothing the first time (never the archived
   `reference/_old/` spec v1 sheet: it is chibi). S2 and every later prompt:
   `reference/model_sheet.png` (the approved copy); every prompt after S2 also
   `reference/expressions.png`. From A02 on also `reference/idle_approved.png`. Some strips list one
   more approved strip under "Attach" (the move before it, or the same pose family). As identity
   references, attach only approved fixed-name files. Two exceptions: (a) a Part B block attaches Part
   A of the same version; (b) a retry of S1/S2 or a strip fix may attach the candidate being corrected,
   together with the list of changes. Never attach `reference/source/` (copyrighted), `reference/_old/`
   or v1 files.
3. **Run the steps in order** (the index below = `art/manifest.json` steps). A01–A23 are the CORE
   set: the game switches to the new art only when all of them are packed. A24–A38 are optional
   polish. Never start a step while the step before it has no approved version.
4. **Quick check before saving** (30 seconds): right pose count, facing right, **about 6.5 heads (not
   chibi)**, Shippuden outfit (black headband with long tails, orange-and-black jacket with the black
   high collar, black sandals), whiskers on both cheeks, flat magenta, no shadow or text. If it fails,
   regenerate; an attempt that was never saved needs no number.
5. **Save under the next version number.** Every image gets a two-digit `_vNN` suffix: NN = 1 + the
   highest number ever used for that asset (look in its folder, `raw/_parts/`, its `_rejected/`
   folder and art/REVIEW.md). Make up to 3 attempts per round and save only the best one. Start at `v01`; never overwrite a file, never reuse a number; the highest number
   is always the latest candidate. The "save as" names are in the index (`reference/model_sheet_vNN.png`,
   `raw/<anim>_vNN.png`, `raw/ui_<name>_vNN.png`).
6. **Long strips come in two images.** Every strip with 6 or more frames has a Part A and a Part B
   block (4-5 poses per image keep 6.5-head figures big enough). Save part A as
   `raw/_parts/<anim>_vNN_A.png`, run part B with part A attached, save it as
   `raw/_parts/<anim>_vNN_B.png` (same NN), then stitch both into `raw/<anim>_vNN.png`
   (art/PIPELINE.md "Long strips (parts)"). If only one part needs a redo, the redo is a new version:
   save it under the next NN and copy the kept part under the same new NN, so both halves of a version
   always belong together.
7. **Log it in [art/REVIEW.md](../../REVIEW.md)** right away: a new row at the top (date, `naruto`,
   asset, file link, version, status `needs review`, what changed since the previous version, QA
   notes). Set the asset's `version` in `art/manifest.json` and update `art/TRACKER.md`. For strips,
   run `npm run sprites naruto` first (the packer uses the highest `_vNN` and prints which file it
   used), check it in game (http://127.0.0.1:5188/?fight=naruto,naruto&mode=solo&art=custom&debug) or in the Sprite Lab (http://127.0.0.1:5188/sprites.html?c=naruto, click "Load full sheet (.png + .json)…" and pick `public/characters/naruto/sheet.png` and `anims.json`; otherwise it shows the baked placeholder) against the QA notes in ANIMATIONS.md, and
   write the result in the QA notes.
8. **Wait for the user's decision.** Approved: the row becomes `approved`, `approvedVersion` = NN in
   the manifest, and Codex copies references to their fixed names (`reference/model_sheet.png`,
   `reference/expressions.png`, the approved idle strip to `reference/idle_approved.png`, UI to
   `ui/<name>.png`). Rejected: the row becomes `rejected` with the reason, the file moves to the
   `_rejected/` folder next to it, and the next version is generated with the problem called out
   (fix prompts F1-F4 at the bottom).
9. **If the generator refuses** a prompt that names the character: replace the `CHARACTER:` line with
   the fallback below, and swap the technique names using the replacement table in CHARACTER.md §9
   (Rasengan → "a swirling sphere of blue wind-energy held in his open palm", and so on). Never name
   the original artist or studio.

### Fallback CHARACTER line (no names)

```text
CHARACTER: an original character inspired by classic shonen ninja anime, fan-art sprite for a personal non-commercial game project: a lean, athletic young ninja of about 16 with a serious, confident, determined air, about 6.5 heads tall with realistic anime proportions (not chibi); short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker-like marks on each cheek; a black cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
```

## Index

Run the prompts top to bottom: `step` is the generation order from `art/manifest.json` (the same
steps as art/PIPELINE.md "Generation order" and art/TRACKER.md). Codex picks the lowest `step` that
has no `approvedVersion` yet. All paths are relative to `art/characters/naruto/`; `NN` = the next
free version number.

| step | id | asset | frames | images | CORE | save as |
|---|---|---|---|---|---|---|
| 1 | S1 | model sheet (5 views + palette swatches) | | 1 | | `reference/model_sheet_vNN.png` → approved copy `reference/model_sheet.png` |
| 2 | S2 | expression sheet (9 heads) | | 1 | | `reference/expressions_vNN.png` → approved copy `reference/expressions.png` |
| 3 | A01 | `idle`: fighting stance (breathing loop) | 8 | 2 | **CORE** | `raw/_parts/idle_vNN_A.png` + `raw/_parts/idle_vNN_B.png` → `raw/idle_vNN.png` → approved copy `reference/idle_approved.png` |
| 4 | A02 | `run`: ninja run (loop) | 8 | 2 | **CORE** | `raw/_parts/run_vNN_A.png` + `raw/_parts/run_vNN_B.png` → `raw/run_vNN.png` |
| 5 | A03 | `light1`: jab with the lead (L) fist | 7 | 2 | **CORE** | `raw/_parts/light1_vNN_A.png` + `raw/_parts/light1_vNN_B.png` → `raw/light1_vNN.png` |
| 5 | A04 | `light2`: rear straight with the R (near) fist | 7 | 2 | **CORE** | `raw/_parts/light2_vNN_A.png` + `raw/_parts/light2_vNN_B.png` → `raw/light2_vNN.png` |
| 5 | A05 | `light3`: front push-kick with the R (rear) leg | 7 | 2 | **CORE** | `raw/_parts/light3_vNN_A.png` + `raw/_parts/light3_vNN_B.png` → `raw/light3_vNN.png` |
| 5 | A06 | `light4`: spinning roundhouse finisher with the R leg | 8 | 2 | **CORE** | `raw/_parts/light4_vNN_A.png` + `raw/_parts/light4_vNN_B.png` → `raw/light4_vNN.png` |
| 5 | A07 | `heavy`: rising uppercut launcher with the R fist | 8 | 2 | **CORE** | `raw/_parts/heavy_vNN_A.png` + `raw/_parts/heavy_vNN_B.png` → `raw/heavy_vNN.png` |
| 5 | A08 | `airLight1`: mid-air jab with the L fist | 5 | 1 | **CORE** | `raw/airLight1_vNN.png` |
| 5 | A09 | `airHeavy`: double-fist hammer spike | 6 | 2 | **CORE** | `raw/_parts/airHeavy_vNN_A.png` + `raw/_parts/airHeavy_vNN_B.png` → `raw/airHeavy_vNN.png` |
| 6 | A10 | `guard`: cross-arm block (loop) | 2 | 1 | **CORE** | `raw/guard_vNN.png` |
| 6 | A11 | `hurtHigh`: hit in the face | 3 | 1 | **CORE** | `raw/hurtHigh_vNN.png` |
| 6 | A12 | `launched`: knocked flying backward (loop) | 2 | 1 | **CORE** | `raw/launched_vNN.png` |
| 6 | A13 | `down`: slammed down, then lying on the back | 2 | 1 | **CORE** | `raw/down_vNN.png` |
| 6 | A14 | `getup`: kip-up | 5 | 1 | **CORE** | `raw/getup_vNN.png` |
| 7 | A15 | `charge`: powering up (loop) | 4 | 1 | **CORE** | `raw/charge_vNN.png` |
| 7 | A16 | `beamCharge`: charging the Rasen Cannon (loop) | 3 | 1 | **CORE** | `raw/beamCharge_vNN.png` |
| 7 | A17 | `beamFire`: firing the Rasen Cannon (loop) | 3 | 1 | **CORE** | `raw/beamFire_vNN.png` |
| 7 | A18 | `special`: RASENGAN rush | 8 | 2 | **CORE** | `raw/_parts/special_vNN_A.png` + `raw/_parts/special_vNN_B.png` → `raw/special_vNN.png` |
| 8 | A19 | `dash`: low forward dash (loop) | 2 | 1 | **CORE** | `raw/dash_vNN.png` |
| 8 | A20 | `jumpUp`: rising (loop) | 2 | 1 | **CORE** | `raw/jumpUp_vNN.png` |
| 8 | A21 | `jumpFall`: falling (loop) | 2 | 1 | **CORE** | `raw/jumpFall_vNN.png` |
| 8 | A22 | `land`: landing | 2 | 1 | **CORE** | `raw/land_vNN.png` |
| 8 | A23 | `win`: fist-pump victory (loop) | 4 | 1 | **CORE** | `raw/win_vNN.png` |
| 9 | A24 | `backDash`: quick hop backward | 3 | 1 |  | `raw/backDash_vNN.png` |
| 9 | A25 | `superDash`: homing super dash, flying like a missile (loop) | 2 | 1 |  | `raw/superDash_vNN.png` |
| 9 | A26 | `jumpSquat`: pre-jump crouch | 1 | 1 |  | `raw/jumpSquat_vNN.png` |
| 9 | A27 | `airLight2`: mid-air front kick with the R leg | 5 | 1 |  | `raw/airLight2_vNN.png` |
| 9 | A28 | `airLight3`: mid-air spinning back-heel kick with the L leg | 6 | 2 |  | `raw/_parts/airLight3_vNN_A.png` + `raw/_parts/airLight3_vNN_B.png` → `raw/airLight3_vNN.png` |
| 9 | A29 | `block`: pushed back while blocking | 2 | 1 |  | `raw/block_vNN.png` |
| 9 | A30 | `hurtLow`: hit in the stomach | 3 | 1 |  | `raw/hurtLow_vNN.png` |
| 9 | A31 | `spin`: tumbling backward (loop) | 4 | 1 |  | `raw/spin_vNN.png` |
| 9 | A32 | `airRecover`: mid-air backflip recovery | 3 | 1 |  | `raw/airRecover_vNN.png` |
| 9 | A33 | `throw`: mid-air shuriken throw (R hand) | 4 | 1 |  | `raw/throw_vNN.png` |
| 9 | A34 | `vanish`: crouch before teleporting | 2 | 1 |  | `raw/vanish_vNN.png` |
| 9 | A35 | `stagger`: dazed stagger (loop) | 4 | 1 |  | `raw/stagger_vNN.png` |
| 9 | A36 | `ko`: knocked out | 1 | 1 |  | `raw/ko_vNN.png` |
| 9 | A37 | `intro`: shadow-clone hand seal (loop) | 4 | 1 |  | `raw/intro_vNN.png` |
| 9 | A38 | `taunt`: pointing taunt (loop) | 2 | 1 |  | `raw/taunt_vNN.png` |
| 9 | A39 | `specialForward`: WIND STYLE: RASENSHURIKEN (held in the hand) | 7 | 2 |  | `raw/_parts/specialForward_vNN_A.png` + `raw/_parts/specialForward_vNN_B.png` → `raw/specialForward_vNN.png` |
| 9 | A40 | `specialUp`: UZUMAKI BARRAGE rising flip kick | 6 | 2 |  | `raw/_parts/specialUp_vNN_A.png` + `raw/_parts/specialUp_vNN_B.png` → `raw/specialUp_vNN.png` |
| 9 | A41 | `specialDown`: NINE-TAILS CHAKRA CLOAK activation | 4 | 1 |  | `raw/specialDown_vNN.png` |
| 9 | A42 | `superPose`: SHADOW CLONE seal (super flash, loop) | 4 | 1 |  | `raw/superPose_vNN.png` |
| 11 | U1 | portrait 96×96 | | 1 | | `raw/ui_portrait_vNN.png` → approved copy `ui/portrait.png` |
| 11 | U2 | super cut-in eye strip 480×128 | | 1 | | `raw/ui_cutin_vNN.png` → approved copy `ui/cutin.png` |
| 11 | U3 | character select art 384×384 | | 1 | | `raw/ui_select_vNN.png` → approved copy `ui/select.png` |

---

## S1 · Model sheet

Attach: nothing the first time. For a later version you may attach the best earlier `_vNN` candidate
together with a short list of what to change (never the `reference/_old/` spec v1 sheet). Save as:
`reference/model_sheet_vNN.png`. After approval Codex copies it to `reference/model_sheet.png`.

```text
Character model sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.

Draw the same character 5 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale and height, standing on one shared baseline, with clear gaps between them:
1. FRONT view, relaxed neutral stand, arms slightly away from the body, facing the viewer;
2. 3/4 view facing RIGHT (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), relaxed neutral stand;
3. TRUE SIDE PROFILE facing RIGHT: the body seen exactly from the side, only one eye visible, the nose, lips and chin in silhouette, the shoulders seen edge-on, the headband tails hanging behind the head. A real profile, not a 3/4 view;
4. BACK view: the back of the spiky hair, the headband knot with its two long black tails, the black shoulders and upper back of the jacket and the red spiral emblem on the back, the holster strap on the right thigh;
5. 3/4 view facing RIGHT in his fighting stance: left foot forward, right foot back and turned out, feet a little wider than the shoulders, knees bent, left fist up at chin height, right fist guarding the right jaw, determined expression.
Below the figures, one row of 34 small square color swatches (no text), one per palette color, in the palette order listed below.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. On this sheet draw at 2x: every art pixel is a 2x2 block, so the standing body (soles to top of the skull) is about 400 px tall on the canvas, the hair on top of that.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no labels, no ground shadow, no floor.
```

Check before saving: **about 6.5 heads tall** (head about 1/6.5 of the body, long legs), all five
figures the same height, a **true side profile** in view 3, short, compact golden-blond spikes with shortened
bangs and upper-ear temple tufts, **black** headband with long tails, whiskers on both cheeks, the
orange-and-black jacket with the black high collar, folded pant cuffs, black sandals, right-thigh
holster, 34 swatches, flat magenta. Codex writes what changed between versions in the REVIEW.md row
and `reference/notes.md`.

## S2 · Expression sheet

Attach: `reference/model_sheet.png`. Save as: `reference/expressions_vNN.png`. After approval Codex
copies it to `reference/expressions.png`.

```text
Expression sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet exactly (same face shape, hair, bangs and short temple tufts, headband, whisker marks and colors): a slim, angular teenage face, not a round chibi face.

Draw 9 head-and-shoulders close-ups in a 3x3 grid on a 1024x1024 square canvas, every head facing RIGHT in 3/4 view (both eyes visible), all at the same scale, with clear gaps between them:
1. determined (his default face: brows slightly lowered, steady eyes locked forward, mouth closed in a firm line);
2. focused (brows down, eyes narrowed, mouth closed);
3. fierce (brows hard down, teeth gritted and showing);
4. shouting (mouth wide open showing teeth and the dark mouth interior, brows down, intense eyes);
5. confident grin (wide toothy grin, eyes narrowed with confidence, eyes open);
6. pain (eyes squeezed shut, teeth gritted);
7. gasp (eyes wide with small irises, mouth open);
8. dazed (eyelids half closed, unfocused eyes, slack raised brows, mouth slightly open; serious, not comedic);
9. knocked out (eyes closed as lines, mouth slightly open, relaxed brows).
Eyes: bright blue iris (#2f86ec) with a darker upper half (#1a3f8e) and a lighter lower edge (#7cc0ff), dark pupil, one white catch-light pixel. Three thin whisker marks on each cheek in every face. The black collar of the jacket at the bottom of each bust.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. The head is about 31 px tall in the game (chin to the top of the skull); on this sheet draw at 4x: every art pixel is a 4x4 block.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything. No text, no numbers, no labels.
```

---

## Animation strips

Attach to every strip prompt: `reference/model_sheet.png`, `reference/expressions.png` and, from A02
on, `reference/idle_approved.png`, plus any extra approved strip listed under "Attach". Every block
restates the proportions, size, palette and rules, so it also works in a fresh thread.

**Step 3 · idle**

### A01 · `idle`: fighting stance (breathing loop) (CORE)

8 frames, loops. **Two images** (poses 1-4, then 5-8). Save as: `raw/_parts/idle_vNN_A.png` and `raw/_parts/idle_vNN_B.png` (same NN); Codex stitches them into `raw/idle_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle).

**After the user approves it, Codex copies the stitched strip to `reference/idle_approved.png`.** Every later prompt attaches that file.

Part A (save as `raw/_parts/idle_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet exactly: same face, whisker marks, hair, headband, outfit, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", fighting stance (breathing loop). 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4. It loops: the last frame must flow smoothly back into the first.
1. KEY POSE. Orthodox fighting stance: left (lead) foot forward with the toes pointing right, right foot back and turned out about 45°, feet a little wider than the shoulders, knees bent about 20°, weight centered on the balls of the feet. Torso upright with a slight forward lean, chest turned about 35° toward the viewer, shoulders relaxed and broad. Left fist up in front at chin height, elbow down and tucked; right fist guarding beside the right jaw, elbow covering the ribs. Face: determined: brows slightly lowered, eyes locked on the opponent (right), mouth closed in a firm line. Hair/headband tails: neutral; headband tails hang behind the head to about the middle of the back.
2. Exhale: knees bend a little more, shoulders and both fists drop slightly. Face: determined. Hair/headband tails: spikes still at frame 1 height (lag); tails swing slightly left.
3. Lowest point: knees bent the most, torso sunk lowest, fists lowest, chest slightly compressed. Face: determined. Hair/headband tails: spikes drop slightly.
4. Hold the lowest point; shoulders roll forward a touch. Face: determined. Hair/headband tails: spikes settle slightly more (follow-through); tails at their furthest left.
MOTION: A small breathing bob done with the knees only (feet never move). Hair spikes and short temple tufts lag the body by one frame. Headband tails hang behind the head and sway gently; the jacket hem moves slightly with the breath.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/idle_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet exactly: same face, whisker marks, hair, headband, outfit, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", fighting stance (breathing loop). 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4). It loops: the last frame must flow smoothly back into the first.
5. Inhale: body rises (knees straighten a little), fists rise. Face: determined. Hair/headband tails: spikes still low (lag).
6. Back to frame 1 height, chest lifted slightly. Face: determined. Hair/headband tails: spikes rise; tails swing back.
7. Same as frame 1, but the left fist flicks forward a little, a small ready twitch (no further right than in frame 1). Face: determined, eyes slightly narrower. Hair/headband tails: spikes slightly above neutral (overshoot).
8. Same as frame 1 (flows straight back into frame 1). Face: determined. Hair/headband tails: spikes and tails back to the frame 1 position.
MOTION: A small breathing bob done with the knees only (feet never move). Hair spikes and short temple tufts lag the body by one frame. Headband tails hang behind the head and sway gently; the jacket hem moves slightly with the breath.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 4 · run**

### A02 · `run`: ninja run (loop) (CORE)

8 frames, loops. **Two images** (poses 1-4, then 5-8). Save as: `raw/_parts/run_vNN_A.png` and `raw/_parts/run_vNN_B.png` (same NN); Codex stitches them into `raw/run_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#run).

Part A (save as `raw/_parts/run_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "run", ninja run. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4. It loops: the last frame must flow smoothly back into the first.
1. Contact: left foot reaching forward, heel touching down well ahead of the hips; right leg extended far back, toes pushing off. Arms straight back. Face: focused, mouth closed.
2. Down: left foot flat under the hips, left knee bent about 45° absorbing the weight; right leg swinging forward with the knee bent and the foot high behind. Body at its lowest. Arms slightly lower. Face: focused.
3. Passing: right knee drives forward past the left leg up to hip height; left leg straightening behind and pushing off; body rising. Face: focused.
4. Flight: both feet off the ground; right thigh horizontal in front, left leg extended straight back with pointed toes; longest stride. Arms slightly higher. Face: focused, mouth slightly open.
MOTION: Torso pitched forward about 40° for the whole cycle, head raised and looking ahead. Both arms stay extended straight back behind the body, slightly raised, hands open and flat with fingers together; they bob up and down slightly. Hips stay over the midpoint between the feet. Short hair spikes and temple tufts stay compact and angle back (left); the long headband tails stream straight back the whole time, waving up and down; the jacket hem and pant legs flap back.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/run_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "run", ninja run. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4). It loops: the last frame must flow smoothly back into the first.
5. Contact (mirror of frame 1): right foot reaching forward to touch down; left leg extended back, pushing off. Face: focused.
6. Down (mirror of frame 2): right foot flat under the hips, knee bent; left leg swinging forward, foot high behind. Arms slightly lower. Face: focused.
7. Passing (mirror of frame 3): left knee drives forward to hip height; right leg pushing off behind. Face: focused.
8. Flight (mirror of frame 4): left thigh horizontal in front, right leg extended back. Flows back into frame 1. Face: focused, mouth slightly open.
MOTION: Torso pitched forward about 40° for the whole cycle, head raised and looking ahead. Both arms stay extended straight back behind the body, slightly raised, hands open and flat with fingers together; they bob up and down slightly. Hips stay over the midpoint between the feet. Short hair spikes and temple tufts stay compact and angle back (left); the long headband tails stream straight back the whole time, waving up and down; the jacket hem and pant legs flap back.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 5 · core attacks**

### A03 · `light1`: jab with the lead (L) fist (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). Save as: `raw/_parts/light1_vNN_A.png` and `raw/_parts/light1_vNN_B.png` (same NN); Codex stitches them into `raw/light1_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light1).

Part A (save as `raw/_parts/light1_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light1", jab with the lead (left) fist. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended toward the right and is the right-most part of the character; head, hair, short temple tufts and headband tails stay behind it.
1. Anticipation: left fist draws back slightly toward the chin, shoulders turn a touch toward the viewer (coiling), weight shifts onto the right (rear) leg. Face: focused, eyes narrowed.
2. The left arm starts to fire: elbow rising toward shoulder height and pointing forward, fist halfway out, knuckles turning over; left shoulder rolling forward, torso turning to lead with the left side; right fist still guarding the jaw. Face: fierce, teeth gritted.
3. IMPACT: left arm fully extended toward the right at face height (the opponent's nose and eyes), the fist slightly above his own shoulder line, clenched with the knuckles forward and the palm facing down; left shoulder raised to protect the chin; torso turned so the left side leads, leaning forward about 12°; left foot slid forward a short step, right heel lifted; right fist guarding the jaw. Face: fierce, short shout. SMEAR: the left forearm is stretched into a short, solid, tapered streak in the sleeve and skin colors behind the fist (hard pixels, no blur).
4. Hold the extension (fist slightly back from frame 3), clean arm without smear; sleeve folds snapped forward. Face: fierce.
MOTION: Hair spikes jolt slightly forward on frame 3 and settle on frame 5. Tails whip slightly on frame 3 (still behind the head); sleeve folds snap forward.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light1_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light1", jab with the lead (left) fist. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Retract: left elbow bends to about 90°, fist pulled halfway back; torso starts turning back. Face: fierce.
6. Fist almost back at the chin, left foot sliding back, weight re-centering. Face: focused.
7. Back in the stance (same as idle frame 1). Face: determined.
MOTION: Hair spikes jolt slightly forward on frame 3 and settle on frame 5. Tails whip slightly on frame 3 (still behind the head); sleeve folds snap forward.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A04 · `light2`: rear straight with the R (near) fist (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). Save as: `raw/_parts/light2_vNN_A.png` and `raw/_parts/light2_vNN_B.png` (same NN); Codex stitches them into `raw/light2_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light1` strip (`raw/light1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light2).

Part A (save as `raw/_parts/light2_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "light1" strip, for continuity (same scale, same pose language).

ANIMATION: "light2", rear straight with the right (near) fist. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended toward the right and is the right-most part of the character; head, hair, short temple tufts and headband tails stay behind it.
1. Wind-up: right fist cocked back beside the right jaw, elbow back; torso twists further toward the viewer (right shoulder back); weight on the right (rear) leg; left fist guarding forward. Face: focused.
2. Hips rotate first: right heel lifts, right elbow drives forward at chest height with the fist passing the chest; left arm begins pulling back toward the chest. Face: fierce.
3. IMPACT: right arm fully extended straight forward at chin height (the opponent's chin), just above his own shoulder line, knuckles forward; hips and torso fully rotated so the chest squares to the right side of the image and the right shoulder leads, leaning forward about 15°; right heel up, pivoting on the ball of the foot; left fist pulled back tight to the left cheek. Face: shout, mouth wide. SMEAR: a short, solid, stretched streak behind the right forearm.
4. Hold (fist slightly back), no smear. Face: fierce.
MOTION: Tails whip on frame 3 (behind the head); hair follow-through on frame 4.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light2_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "light1" strip, for continuity (same scale, same pose language).

ANIMATION: "light2", rear straight with the right (near) fist. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Right arm retracting, elbow bent, fist halfway back; torso unwinding. Face: fierce.
6. Right fist returning to the jaw; right heel down. Face: focused.
7. Back in the stance. Face: determined.
MOTION: Tails whip on frame 3 (behind the head); hair follow-through on frame 4.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A05 · `light3`: front push-kick with the R (rear) leg (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). Save as: `raw/_parts/light3_vNN_A.png` and `raw/_parts/light3_vNN_B.png` (same NN); Codex stitches them into `raw/light3_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light2` strip (`raw/light2_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light3).

Part A (save as `raw/_parts/light3_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "light2" strip, for continuity (same scale, same pose language).

ANIMATION: "light3", front push-kick with the right (rear) leg. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended toward the right and is the right-most part of the character; head, hair, short temple tufts and headband tails stay behind it.
1. Weight shifts onto the left (lead) leg, which straightens; right heel lifts; arms tighten into the guard. Face: focused.
2. Chamber: right knee lifted high in front to belly height, shin hanging down, foot flexed; torso leaning back slightly; left fist guarding the chin, right arm swinging back a little for balance. Face: fierce.
3. IMPACT: right leg thrust straight forward, horizontal at stomach height, the flat sole of the sandal facing the target (push kick), hips driven forward; torso leaning back about 18°; left (support) leg straight and planted on the baseline; left fist guarding the chin, right arm flung back for balance. Face: shout. SMEAR: a solid arc in the pant-leg colors trailing below and behind the shin.
4. Hold the extension (foot slightly back), no smear; pant leg rippling. Face: fierce.
MOTION: Pant leg ripples on frame 4; tails swing forward a little on frame 3 as the torso leans back, but stay behind the head.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light3_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "light2" strip, for continuity (same scale, same pose language).

ANIMATION: "light3", front push-kick with the right (rear) leg. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Re-chamber: knee bends, foot pulled back halfway. Face: fierce.
6. Right foot stepping down behind into the rear position, torso coming upright. Face: focused.
7. Back in the stance. Face: determined.
MOTION: Pant leg ripples on frame 4; tails swing forward a little on frame 3 as the torso leans back, but stay behind the head.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A06 · `light4`: spinning roundhouse finisher with the R leg (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). Save as: `raw/_parts/light4_vNN_A.png` and `raw/_parts/light4_vNN_B.png` (same NN); Codex stitches them into `raw/light4_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light3` strip (`raw/light3_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light4).

Part A (save as `raw/_parts/light4_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "light3" strip, for continuity (same scale, same pose language).

ANIMATION: "light4", spinning roundhouse finisher with the right leg. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5. Poses 4 and 5 are the HIT frames: the striking limb (fist, foot or palm) is fully extended toward the right and is the right-most part of the character; head, hair, short temple tufts and headband tails stay behind it.
1. Wind-up: knees bend, torso twists toward the viewer (coil), right shoulder back, arms tucked near the chest, weight on the left (lead) foot. Face: focused, determined.
2. Spin starts: pivoting on the ball of the left foot, the body turns away from the viewer so we see his right side and the black upper back of the jacket; right heel lifting behind. Face: eyes visible over the shoulder.
3. Mid-spin: back toward the viewer (black upper back and the red spiral emblem visible), head turned to look over the left shoulder toward the right side of the image, right knee chambered high at hip level, arms tucked. Face: one eye visible, fierce. Hair/headband tails: tails swing out in front of the body.
4. IMPACT: the body has come round to face the right side of the image again; right leg whipping horizontally at HEAD height, fully extended, instep and shin leading; torso leaning back about 30° away from the kick; left support leg straight, up on the ball of the foot; left arm swung forward-low and right arm flung back for balance. Face: shout. Hair/headband tails: tails flung back behind the head. SMEAR: a big solid crescent in the leg colors (orange pants, black sandal) sweeping behind the leg.
5. Hold the extension, smear gone. Face: shout.
MOTION: Headband tails whip around with the spin: out in front of the body on frame 3, then flung back behind the head (left) on frame 4-frame 5 so nothing but the leg is forward. Hair spikes squash toward the spin direction on frame 4.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light4_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "light3" strip, for continuity (same scale, same pose language).

ANIMATION: "light4", spinning roundhouse finisher with the right leg. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
6. Leg dropping and folding at the knee, torso coming upright. Face: focused.
7. Right foot lands behind, knees bent low, arms returning toward the guard. Face: focused.
8. Back in the stance. Face: determined.
MOTION: Headband tails whip around with the spin: out in front of the body on frame 3, then flung back behind the head (left) on frame 4-frame 5 so nothing but the leg is forward. Hair spikes squash toward the spin direction on frame 4.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A07 · `heavy`: BURSTING UPPERCUT launcher with the R fist (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). Save as: `raw/_parts/heavy_vNN_A.png` and `raw/_parts/heavy_vNN_B.png` (same NN; today the next free NN is 04); Codex stitches them into `raw/heavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A and the approved `land` strip (`raw/land_v01.png`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#heavy).

Part A (save as `raw/_parts/heavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "heavy", a bursting rising-uppercut launcher with the right fist, like the uppercut from below that knocks an opponent straight up into the air: he steps in, sinks into a deep coiled crouch with the right fist loaded low, then explodes upward with his whole body behind the fist. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5. Poses 4 and 5 are the HIT frames. Pose 4: the right fist drives UP in front of his face at the chin height of an opponent standing on the right, well in front of his body; it is the right-most part of the character. Pose 5: the fist has carried on up above his forehead, still in front of his face; it is the highest point of the whole strip. Head, hair, headband tails, the left arm and the left knee stay behind and below the fist.
1. Step in and drop: the left (lead) foot steps forward and plants, the stance a little wider than his idle stance; knees bending deep; torso pitched forward about 25 degrees and turned away from the opponent (right shoulder pulled back, chest toward the viewer); the right fist cocked low behind the right hip, elbow bent; the left fist guarding in front of the chin. Face: focused, eyes on the opponent's chin. Hair/headband tails: swinging down and back.
2. Coil, the lowest pose: knees bent about 90 degrees, hips sunk low, weight over the bent left leg; the torso coiled further away (more of his back toward the viewer); the right fist at its lowest beside the right knee, about shin height; the left forearm forward and low as a guard; head low, eyes looking up at the target. Face: fierce, teeth gritted. Hair spikes squashed slightly.
3. Drive: the legs push up, the right heel lifts and the right knee drives forward, the hips swing square to the opponent; the right fist sweeps up past the right knee and the belt, in front of his body; the left arm starts to pull back. Face: fierce, mouth opening. Headband tails streaming back.
4. IMPACT: hips and shoulders fully rotated so the right shoulder leads; the left leg braced and bent; the right heel up, toes pivoting on the floor; the right upper arm forward with the elbow bent about 90 degrees and the forearm nearly vertical, so the fist rises at the opponent's chin height well IN FRONT of his face (a true uppercut, knuckles toward him); the left fist pulled back to the left hip; his head behind the fist. Face: shout. SMEAR: the right forearm and fist drawn as one solid tapered shape stretched downward along the path they came up, in the orange sleeve and skin colors, attached to the arm and below the fist (hard pixels; no separate white crescent, no blur).
5. Rising follow-through: the right arm extends up and forward at about 65 degrees with the elbow slightly bent, the fist above his forehead but still in front of his face; his whole body stretches into one rising line from the right toes through the hips to the fist; both feet leaving the floor, toes pointed and kept under his hips; torso leaning back slightly; left fist at the hip. Face: shout. Hair spikes and headband tails flick UP.
MOTION: A real launcher: anticipation (step in, coil low), then the hips lead the shoulders and the shoulders lead the fist on one upward arc in front of his body, and he rises off the floor at the end. Draw everything in place: the game moves him forward and adds the hop. The feet do not slide in poses 1 to 3.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A and the approved `land` strip too; save as `raw/_parts/heavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "land" strip, for continuity: pose 7 must flow into its first pose.

ANIMATION: "heavy", a bursting rising-uppercut launcher with the right fist. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
6. Peak in the air, the pose held longest: the body still stretched upward, the right fist overhead in front of his face and no higher than in pose 5; both legs hang below with the toes pointed under the hips, the left knee slightly bent; eyes up on the opponent he launched. Face: fierce, mouth still open. Hair and headband tails floating.
7. Dropping to land: the right arm coming down to shoulder height, the left fist rising toward the guard, the knees bending, the feet reaching for the floor toes first. Face: focused. Headband tails lifted by the fall.
8. Back in his fighting stance, the same as idle frame 1. Face: determined.
MOTION: A real launcher: anticipation (step in, coil low), then the hips lead the shoulders and the shoulders lead the fist on one upward arc in front of his body, and he rises off the floor at the end. Draw everything in place: the game moves him forward and adds the hop.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```


### A08 · `airLight1`: mid-air jab with the L fist (CORE)

5 frames, phases 1/2/2. Save as: `raw/airLight1_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight1).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airLight1", mid-air jab with the left fist. 5 frames in total, numbered 1 to 5 from left to right. Poses 2 and 3 are the HIT frames: the striking limb (fist, foot or palm) is fully extended toward the right and is the right-most part of the character; head, hair, short temple tufts and headband tails stay behind it.
1. From the AIR BASE POSE: left fist pulled back to the chin, shoulders coiling toward the viewer. Face: focused.
2. IMPACT: left arm fully extended horizontally at chest height; torso turned to lead with the left side, leaning forward about 10°; right fist guarding the jaw; legs stay tucked. Face: shout. SMEAR: a solid streak behind the left forearm.
3. Hold the extension, no smear. Face: fierce.
4. Left arm retracting, elbow bent. Face: focused.
5. Back to the AIR BASE POSE. Face: focused.
MOTION: Tails trail behind and slightly down; hair jolts forward slightly on frame 2.
AIR BASE POSE: Left knee drawn up high in front, right leg hanging lower and slightly behind with the knee bent, torso upright and leaning slightly forward, both fists in a loose guard at chest height, headband tails trailing behind and slightly up.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A09 · `airHeavy`: double-fist hammer spike (CORE)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). Save as: `raw/_parts/airHeavy_vNN_A.png` and `raw/_parts/airHeavy_vNN_B.png` (same NN); Codex stitches them into `raw/airHeavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airheavy).

Part A (save as `raw/_parts/airHeavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airLight1" strip, for continuity (same scale, same pose language).

ANIMATION: "airHeavy", double-fist hammer spike. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: both straight arms smash the clasped fists down-forward at 45°, in front of and below his chest; the fists are the right-most part of the arms and never lower than his lowest foot; head, hair and headband tails stay behind them.
1. Wind-up: both arms raised overhead, fists clasped together (one hand wrapped over the other fist) above and slightly behind the head; torso arched back about 20°; knees tucked. Face: shout.
2. Maximum wind-up: clasped fists further behind the head, body bent back like a bow, legs folded back under him. Face: shout, eyes wide.
3. IMPACT: body jackknifes forward about 40°; both straight arms smash the clasped fists down-forward at 45°; legs trailing back and down (the right foot is the lowest point). Face: shout. SMEAR: a large solid crescent above and behind the arms, tracing the overhead-to-down arc.
4. Hold the smash, no smear. Face: shout.
MOTION: Hair and tails lift on the wind-up and slam down-forward on frame 3.
AIR BASE POSE: Left knee drawn up high in front, right leg hanging lower and slightly behind with the knee bent, torso upright and leaning slightly forward, both fists in a loose guard at chest height, headband tails trailing behind and slightly up.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/airHeavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airLight1" strip, for continuity (same scale, same pose language).

ANIMATION: "airHeavy", double-fist hammer spike. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Arms rising back to chest height, body uncurling. Face: focused.
6. Back to the AIR BASE POSE. Face: focused.
MOTION: Hair and tails lift on the wind-up and slam down-forward on frame 3.
AIR BASE POSE: Left knee drawn up high in front, right leg hanging lower and slightly behind with the knee bent, torso upright and leaning slightly forward, both fists in a loose guard at chest height, headband tails trailing behind and slightly up.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 6 · reactions**

### A10 · `guard`: cross-arm block (loop) (CORE)

2 frames, loops. Save as: `raw/guard_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#guard).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "guard", cross-arm block. 2 frames in total, numbered 1 and 2 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Cross block: both forearms raised and crossed in an X in front of the face (wrists crossing in front of the nose, fists closed, right forearm in front), elbows tucked to protect the ribs; torso hunched forward about 12°; head ducked so the eyes look over the forearms; knees bent wide and braced. Face: fierce glare over the arms.
2. Same, slightly lower with the knees slightly deeper (breathing). Face: fierce glare.
MOTION: Tails sway slightly between frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A11 · `hurtHigh`: hit in the face (CORE)

3 frames. Save as: `raw/hurtHigh_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurthigh).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "hurtHigh", hit in the face. 3 frames in total, numbered 1 to 3 from left to right.
1. IMPACT: head snapped back hard (chin up about 30°), torso bent back about 24°, both arms flung back and out (right arm wide behind, left arm up), knees buckling, feet still planted. Face: pain: eyes squeezed shut, mouth open in a grimace. Hair/headband tails: spikes and tails whip forward.
2. Recoil continues: head still back but a little less, arms dropping, torso leaning back about 20°. Face: one eye squinting, teeth gritted.
3. Starting to recover: head coming forward, torso back about 15°, arms coming down toward the guard. Face: pained, eyes open.
MOTION: The head snaps back (left), so the hair spikes, short temple tufts and tails whip forward (right) on frame 1 and fall back on frames 2–3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A12 · `launched`: knocked flying backward (loop) (CORE)

2 frames, loops. Save as: `raw/launched_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#launched).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "launched", knocked flying backward. 2 frames in total, numbered 1 and 2 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Knocked flying back toward the left side of the image: arched like a drawn bow, belly up, the HIPS are the lowest point near the middle of the pose; head and shoulders rise to the upper-left with both arms flung up and back past the head; legs bent, trailing to the right at about hip height or a little higher. Face: pain: eyes shut, mouth open. Hair/headband tails: hair and tails stream right.
2. Same bow shape, the hips still the lowest point near the middle; arms and legs flailing into an alternate position (left arm higher, right knee bent more). Face: pain. Hair/headband tails: tails flutter to a second shape.
MOTION: He flies left, so hair and tails stream to the right.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A13 · `down`: slammed down, then lying on the back (CORE)

2 frames. Save as: `raw/down_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#down).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "down", slammed down, then lying on the back. 2 frames in total, numbered 1 and 2 from left to right.
1. Ground impact: lying on his back, head toward the left side of the image and feet toward the right side of the image; his back has slammed into the floor and the shoulders and legs bounce up about 15° from flat; arms flung out from the shoulders. Face: pain: eyes squeezed shut, mouth open.
2. Lying flat on the back: arms out to the sides, left knee slightly raised, head turned toward the viewer. Face: out: eyes closed, dazed.
MOTION: Hair spikes splay against the floor; tails flung up on frame 1 and lying flat on frame 2.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A14 · `getup`: kip-up (CORE)

5 frames. Save as: `raw/getup_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `down` strip (`raw/down_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#getup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "down" strip, for continuity (same scale, same pose language).

ANIMATION: "getup", kip-up. 5 frames in total, numbered 1 to 5 from left to right.
1. Lying on the back (head left, feet right), knees pulled up to the chest, palms planted on the floor beside the head (fingers pointing toward the shoulders). Face: fierce, eyes open.
2. Legs kick up and over: rocked back onto the shoulders, hips high, legs pointing up-right. Face: fierce.
3. Spring: body launched up off the hands, torso tilted back about 40°, legs tucked underneath, arms out. Face: shout.
4. Lands in a crouch (squash): knees deep, feet planted in the stance, arms coming up to the guard. Face: focused.
5. Back in the stance. Face: determined.
MOTION: Tails follow one frame behind the body; hair squashes on frame 4.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 7 · specials**

### A15 · `charge`: chakra power-up (loop) (CORE)

4 frames, loops. Save as: `raw/charge_vNN.png` (today the next free NN is 02). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#charge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "charge", powering up: planted in a wide, low stance he strains to force his chakra out, shouting. 4 frames in total, numbered 1 to 4 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Brace: feet planted wide, well wider than the shoulders, left foot forward; knees bent about 45 degrees, hips sunk low, weight centered; both fists clenched hard and pushed down and slightly out beside the hips, elbows nearly straight, forearms and shoulders tense; chest forward; head up and level. Face: fierce, teeth gritted. Hair/headband tails: lifted by a rising wind, the tails streaming up and back; the jacket hem lifted.
2. Surge: the chest lifts and the shoulders rise slightly and pull back, the fists push a little further down and out, the chin lifts slightly, the mouth opens into a shout. Face: shout. Hair spikes stretched upward, the headband tails flung higher, the jacket hem flared up.
3. Peak: the same as pose 2 with the whole body trembling (shifted very slightly to the right) and the fists shaking; head tilted back only a little, mouth wide open. Face: shout, eyes intense and narrowed. Hair, headband tails, jacket hem and pant cuffs at their highest, in a third shape.
4. Settle: the shoulders drop back slightly, the shout narrowing; the headband tails and the jacket hem drop a little into a fourth shape; it flows straight back into pose 1. Face: shout, mouth half open.
MOTION: A straining power-up loop. The feet stay planted in exactly the same place in all 4 poses; the shoulders and chest rise in poses 2 and 3 and settle in pose 4; the head moves only slightly. The hair spikes, short temple tufts, headband tails, jacket hem and pant cuffs are blown UPWARD and change shape in every pose. Draw NO aura, no flames, no glow, no energy, no dust and no flying rocks: the game adds all of them.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```


### A16 · `beamCharge`: charging the Rasen Cannon (loop) (CORE)

3 frames, loops. Save as: `raw/beamCharge_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamcharge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "beamCharge", charging the Rasen Cannon. 3 frames in total, numbered 1 to 3 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Low wide stance (left leg forward and bent, right leg back); torso twisted away toward the viewer (about 35°); both hands cupped together at the right (rear) hip, palms facing each other as if holding a ball, but EMPTY (no energy drawn); elbows bent back; head turned toward the target (the right side of the image). Face: shout.
2. Same, trembling slightly, hands slightly further apart. Face: shout. Hair/headband tails: second flicker shape.
3. Same, trembling back. Face: shout.
MOTION: Hair spikes and tails blown upward and back.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A17 · `beamFire`: firing the Rasen Cannon (loop) (CORE)

3 frames, loops. Save as: `raw/beamFire_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `beamCharge` strip (`raw/beamCharge_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamfire).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "beamCharge" strip, for continuity (same scale, same pose language).

ANIMATION: "beamFire", firing the Rasen Cannon. 3 frames in total, numbered 1 to 3 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Firing: both arms thrust straight forward horizontally at chest height, heels of the palms together, palms open and facing the target, fingers spread; wide braced stance (left leg forward and bent, right leg straight behind pushing against the recoil); torso leaning forward about 14°; head behind the arms, eyes on the target. Face: shout.
2. Same, recoil tremble: arms slightly back, rear heel slides slightly. Face: shout.
3. Same, tremble forward. Face: shout.
MOTION: Recoil wind: hair and tails blown straight back hard.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A18 · `special`: RASENGAN rush (CORE)

8 frames, phases 3/3/2. **Two images** (poses 1-3, then 4-8). Save as: `raw/_parts/special_vNN_A.png` and `raw/_parts/special_vNN_B.png` (same NN); Codex stitches them into `raw/special_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#special).

Leave the palm EMPTY: the engine draws the Rasengan orb. If the generator refuses, replace "Rasengan" wording per CHARACTER.md §9.

Part A (save as `raw/_parts/special_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "special", RASENGAN rush. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 3.
1. Forming: wide low stance, torso leaning forward about 15°; right hand held out in front at belt height, palm UP and cupped; left hand hovering just above it palm DOWN, fingers spread, circling over the right palm (shaping the chakra). Face: focused shout, eyes intense.
2. Still forming: the left hand has circled to the far side of the right palm; knees deeper, body leaning forward about 18°. Face: shout.
3. Ready: left hand pulled away and back; right palm now turned FORWARD, cupped as if holding a ball about the size of his head; body coiled low to sprint, left foot forward. Face: confident grin.
MOTION: Chakra wind lifts the hair and tails on frames 1–3; they stream back on frames 4–6.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/special_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "special", RASENGAN rush. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 4 to 8 (the attached part A shows poses 1 to 3). Poses 4, 5 and 6 are the HIT frames: the cupped right palm leads at waist height in front of his body and is the right-most part of the character; leave the palm EMPTY (the game draws the energy sphere); head, hair and headband tails stay behind it.
4. Rush (ninja run): torso pitched forward about 32°; right arm extended forward at waist height with the cupped palm facing forward; left arm trailing straight back; legs in the run contact pose (left foot forward). Face: shout.
5. Rush: same arms, legs in the passing pose (right knee forward). Face: shout.
6. THRUST: short planted lunge with the left leg forward and the right leg straight behind (the palm must not travel far past the orb point); torso rotated so the right shoulder leads (chest toward the viewer); right arm fully extended palm-first into the opponent's stomach; left arm flung back. Face: shout ("RASENGAN!"). SMEAR: a solid streak behind the right forearm.
7. Follow-through: right arm still extended but relaxing, torso rising, weight on the front leg. Face: fierce.
8. Recovering toward the stance, right arm pulling back into the guard. Face: determined.
MOTION: Chakra wind lifts the hair and tails on frames 1–3; they stream back on frames 4–6.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 8 · rest of the core**

### A19 · `dash`: low forward dash (loop) (CORE)

2 frames, loops. Save as: `raw/dash_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#dash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "dash", low forward dash. 2 frames in total, numbered 1 and 2 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Torso pitched forward about 50° (chest low), head up looking at the opponent; arms trailing straight back like the ninja run but lower and closer to the body; left leg reaching far forward with the knee bent about 60°, foot skimming the ground; right leg extended straight back, toes dragging. A long, low, driving silhouette. Face: fierce, teeth just showing.
2. Same, legs a little wider apart and the right toes lifted (pushing again); arms slightly higher. Face: fierce. Hair/headband tails: tails flutter to a second shape.
MOTION: Hair spikes, short temple tufts and headband tails swept flat back; jacket hem flapping.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A20 · `jumpUp`: rising (loop) (CORE)

2 frames, loops. Save as: `raw/jumpUp_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "jumpUp", rising. 2 frames in total, numbered 1 and 2 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Rising: body stretched upward; left knee pulled high in front (thigh above horizontal), right leg bent below and behind; right arm swung up-forward (fist at about head height, in front of the face), left arm swung down and back; torso upright. Face: focused, mouth closed. Hair/headband tails: tails dragged down-left.
2. Same, right arm slightly higher, legs tucked slightly tighter. Face: focused. Hair/headband tails: tails flutter to a second shape.
MOTION: Air rushes past while rising: hair spikes and tails are dragged DOWN-left.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A21 · `jumpFall`: falling (loop) (CORE)

2 frames, loops. Save as: `raw/jumpFall_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `jumpUp` strip (`raw/jumpUp_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpfall).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "jumpUp" strip, for continuity (same scale, same pose language).

ANIMATION: "jumpFall", falling. 2 frames in total, numbered 1 and 2 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Falling: legs extending down toward the floor, left leg in front slightly bent, right leg behind and straighter, toes pointing down; both arms spread out sideways for balance (right arm forward and up, left arm back), elbows soft; torso upright. Face: focused, looking down-forward. Hair/headband tails: tails lifted up.
2. Same, arms slightly higher and feet slightly further apart. Face: focused. Hair/headband tails: tails flutter to a second shape.
MOTION: Falling: hair spikes, short temple tufts and headband tails float UP.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A22 · `land`: landing (CORE)

2 frames. Save as: `raw/land_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `jumpFall` strip (`raw/jumpFall_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#land).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "jumpFall" strip, for continuity (same scale, same pose language).

ANIMATION: "land", landing. 2 frames in total, numbered 1 and 2 from left to right.
1. Impact squash: knees deeply bent, feet planted wide (left forward, right back), torso pitched forward about 20°, arms out low to the sides for balance, head tucked. Face: eyes half closed, teeth gritted (impact). Hair/headband tails: spikes squashed slightly, tails slap down.
2. Rising halfway back to the stance: knees bent about 40°, arms coming back up toward the guard, head up. Face: focused. Hair/headband tails: spikes rebound slightly.
MOTION: Squash and settle: hair spikes squash down slightly on frame 1, rebound slightly on frame 2; tails slap down.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A23 · `win`: fist-pump victory (loop) (CORE)

4 frames, loops. Save as: `raw/win_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#win).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "win", fist-pump victory. 4 frames in total, numbered 1 to 4 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Chamber: right fist pulled down to the chest, elbow bent down, knees dipping slightly; left fist clenched low at his side. Face: confident grin.
2. Pump: right arm punches up overhead and slightly forward, elbow a little bent; body stretched up on the toes. Face: shout (a victory yell).
3. Hold the raised fist. Face: confident grin, eyes narrowed. Hair/headband tails: spikes bounce up slightly.
4. Arm lowering slightly (fist at head height), settling. Flows back into the chamber. Face: confident grin.
MOTION: Hair spikes bounce up slightly on frame 3; tails swing.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

**Step 9 · optional polish**

### A24 · `backDash`: quick hop backward

3 frames. Save as: `raw/backDash_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#backdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "backDash", quick hop backward. 3 frames in total, numbered 1 to 3 from left to right.
1. Push-off: weight on the left (lead) foot, which shoves backward; torso upright and leaning back slightly; right leg already lifting behind; arms in a tight guard close to the chest. Face: alert, eyes on the opponent.
2. Airborne hop backward: both knees tucked (left knee higher), torso leaning back, arms opening a little for balance (left arm forward, right arm back and down). Face: focused. Hair/headband tails: hair and tails flow forward (right).
3. Descending: legs extending down to land, right (rear) foot reaching back and down for the landing, left leg slightly bent in front; arms returning to the guard. Face: determined. Hair/headband tails: tails dropping back behind the head.
MOTION: He moves left, so hair, short temple tufts and tails flow forward (right) in the air.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A25 · `superDash`: homing super dash, flying like a missile (loop)

2 frames, loops. Save as: `raw/superDash_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `dash` strip (`raw/dash_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "dash" strip, for continuity (same scale, same pose language).

ANIMATION: "superDash", homing super dash, flying like a missile. 2 frames in total, numbered 1 and 2 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Flying toward the upper right like a missile: body angled about 25° upward (head higher than the hips), right arm thrust straight ahead past the head with the fist leading, left arm tucked back along his side, head tucked between the shoulders looking forward; knees bent sharply under the hips as if kneeling in the air, so the knees are the lowest point, under the middle of the shape; shins and feet trail back and up. Face: fierce, teeth gritted.
2. Same, the knees still the lowest point under the middle, the shins slightly scissored (right shin higher); left arm slightly lower. Face: fierce, teeth gritted. Hair/headband tails: tails flutter to a second shape.
MOTION: Hair spikes, short temple tufts and headband tails swept flat back (left) and fluttering between frames; jacket hem flapping.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A26 · `jumpSquat`: pre-jump crouch

1 frame. Save as: `raw/jumpSquat_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpsquat).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "jumpSquat", pre-jump crouch. 1 frame.
1. Deep crouch: knees bent about 90°, torso leaning forward, both arms swung down and back behind the hips (ready to swing up), heels down, head up looking at the target. Face: focused.
MOTION: Hair spikes compressed slightly; tails droop.

LAYOUT: one single pose centered on a 1024x1024 square canvas. Make the character as large as fits with a clear magenta margin on every side.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A27 · `airLight2`: mid-air front kick with the R leg

5 frames, phases 1/2/2. Save as: `raw/airLight2_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight2).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airLight1" strip, for continuity (same scale, same pose language).

ANIMATION: "airLight2", mid-air front kick with the right leg. 5 frames in total, numbered 1 to 5 from left to right. Poses 2 and 3 are the HIT frames: the striking limb (fist, foot or palm) is fully extended toward the right and is the right-most part of the character; head, hair, short temple tufts and headband tails stay behind it.
1. From the AIR BASE POSE: right knee chambered up to the chest, torso leaning back slightly. Face: focused.
2. IMPACT: right leg extended straight forward at hip height, sole facing the target; torso leaning back about 12°; left leg hanging bent below; arms pulled back and out for balance. Face: shout. SMEAR: a solid arc behind the shin.
3. Hold the extension, no smear. Face: fierce.
4. Knee folds back toward the chest. Face: focused.
5. Back to the AIR BASE POSE. Face: focused.
MOTION: Tails swing forward slightly as the torso leans back on frame 2, but stay behind the head.
AIR BASE POSE: Left knee drawn up high in front, right leg hanging lower and slightly behind with the knee bent, torso upright and leaning slightly forward, both fists in a loose guard at chest height, headband tails trailing behind and slightly up.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A28 · `airLight3`: mid-air spinning back-heel kick with the L leg

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). Save as: `raw/_parts/airLight3_vNN_A.png` and `raw/_parts/airLight3_vNN_B.png` (same NN); Codex stitches them into `raw/airLight3_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight2` strip (`raw/airLight2_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight3).

Part A (save as `raw/_parts/airLight3_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airLight2" strip, for continuity (same scale, same pose language).

ANIMATION: "airLight3", mid-air spinning back-heel kick with the left leg. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking limb (fist, foot or palm) is fully extended toward the right and is the right-most part of the character; head, hair, short temple tufts and headband tails stay behind it.
1. Twist: torso and hips turn away from the viewer (more of the back shows), left knee tucked to the chest, arms tight. Face: focused.
2. Back fully toward the viewer (black upper back and the red spiral emblem visible), head turned looking over the shoulder at the target, both legs tucked. Face: one eye visible, fierce.
3. IMPACT: spun back round, the left leg whips out horizontally, fully extended at chest height with the heel leading; torso leaning back about 18°; right leg tucked underneath; arms flung wide. Face: shout. SMEAR: a big solid crescent behind the leg.
4. Hold the extension, no smear. Face: shout.
MOTION: Tails whip around with the spin and trail far behind (left) on frame 3.
AIR BASE POSE: Left knee drawn up high in front, right leg hanging lower and slightly behind with the knee bent, torso upright and leaning slightly forward, both fists in a loose guard at chest height, headband tails trailing behind and slightly up.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/airLight3_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airLight2" strip, for continuity (same scale, same pose language).

ANIMATION: "airLight3", mid-air spinning back-heel kick with the left leg. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Leg folding back in, body re-centering. Face: focused.
6. Back to the AIR BASE POSE. Face: focused.
MOTION: Tails whip around with the spin and trail far behind (left) on frame 3.
AIR BASE POSE: Left knee drawn up high in front, right leg hanging lower and slightly behind with the knee bent, torso upright and leaning slightly forward, both fists in a loose guard at chest height, headband tails trailing behind and slightly up.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A29 · `block`: pushed back while blocking

2 frames. Save as: `raw/block_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `guard` strip (`raw/guard_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#block).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "guard" strip, for continuity (same scale, same pose language).

ANIMATION: "block", pushed back while blocking. 2 frames in total, numbered 1 and 2 from left to right.
1. Same crossed-arm guard, but the torso is pushed upright and back, head snapped down behind the arms, rear (right) foot sliding back with the heel lifted, sandals skidding. Face: pain: eyes squeezed shut, teeth gritted. Hair/headband tails: hair and tails jolt forward.
2. Recovering into the guard pose (like frame 1 of the attached "guard" strip). Face: fierce.
MOTION: Hair and tails jolt forward (right) on frame 1.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A30 · `hurtLow`: hit in the stomach

3 frames. Save as: `raw/hurtLow_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `hurtHigh` strip (`raw/hurtHigh_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurtlow).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "hurtHigh" strip, for continuity (same scale, same pose language).

ANIMATION: "hurtLow", hit in the stomach. 3 frames in total, numbered 1 to 3 from left to right.
1. IMPACT: doubled over forward about 40°, both arms pulled in toward the stomach (fists near the belly), knees bent, hips pushed back; head down. Face: gasp: eyes wide with small irises, mouth open.
2. Still doubled over (about 34°), arms slightly lower. Face: teeth gritted, one eye shut.
3. Recovering: torso about 28°, head lifting. Face: pained.
MOTION: Hair spikes and tails flung forward and down on frame 1.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A31 · `spin`: tumbling backward (loop)

4 frames, loops. Save as: `raw/spin_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `launched` strip (`raw/launched_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#spin).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "launched" strip, for continuity (same scale, same pose language).

ANIMATION: "spin", tumbling backward. 4 frames in total, numbered 1 to 4 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Loose tuck (knees bent toward the chest, arms bent in front), rotated about 30° backward. Face: pain, eyes shut.
2. Same tuck rotated about 120° (back toward the floor, head to the left). Face: pain.
3. Rotated about 210° (upside down, head down). Face: pain.
4. Rotated about 300° (feet coming round over the top). Flows into frame 1. Face: pain.
MOTION: Tails trail opposite to the rotation.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A32 · `airRecover`: mid-air backflip recovery

3 frames. Save as: `raw/airRecover_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airrecover).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airRecover", mid-air backflip recovery. 3 frames in total, numbered 1 to 3 from left to right.
1. Backflip starts: body curled into a tight tuck (knees to chest, arms hugging the shins), rotated about 60° backward (head tilting toward the left side of the image). Face: eyes shut tight.
2. Upside down: the same tuck rotated about 200° (head at the bottom-left, feet up-right). Face: eyes squeezed shut.
3. Almost upright (about 340°): legs extending down, arms opening out to the sides, ready to land. Face: focused, eyes open.
MOTION: Hair and tails trail opposite to the spin.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A33 · `throw`: mid-air shuriken throw (R hand)

4 frames, phases 1/1/2. Save as: `raw/throw_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#throw).

The three shuriken appear only in pose 1 (in his hand); the engine spawns the thrown ones.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airLight1" strip, for continuity (same scale, same pose language).

ANIMATION: "throw", mid-air shuriken throw (right hand). 4 frames in total, numbered 1 to 4 from left to right. Pose 2 is the HIT frame: it is the release frame: the right hand whips forward to chest height, open and EMPTY (the game spawns the shuriken), and is the right-most part of the character.
1. Cocked: right arm drawn back behind the head, holding three small steel four-pointed shuriken fanned between the fingers; torso twisted toward the viewer and leaning back slightly; left arm extended forward, open hand aiming at the target; legs in the AIR BASE POSE. Face: focused, one eye aiming.
2. RELEASE: right arm whipped forward to horizontal at chest height, hand open, palm down, fingers pointing at the target; NO shuriken in the hand anymore (the engine spawns them); torso turned forward; left arm pulled back. Face: shout. SMEAR: a solid streak behind the right forearm.
3. Follow-through: right arm continues down-forward across the body, left arm back. Face: focused.
4. Back to the AIR BASE POSE. Face: determined.
MOTION: Tails whip forward on frame 2 but stay behind the head.
AIR BASE POSE: Left knee drawn up high in front, right leg hanging lower and slightly behind with the knee bent, torso upright and leaning slightly forward, both fists in a loose guard at chest height, headband tails trailing behind and slightly up.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A34 · `vanish`: crouch before teleporting

2 frames. Save as: `raw/vanish_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#vanish).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "vanish", crouch before teleporting. 2 frames in total, numbered 1 and 2 from left to right.
1. Quick crouch: knees bent about 60°, torso pitched forward about 20°, arms tucked close, eyes locked on the target. Face: focused, sharp.
2. Snap stretch: up on the toes, body stretched tall, arms straight down at the sides, about to blink out. Face: determined. Hair/headband tails: hair and tails flick up.
MOTION: Hair and tails flick upward on frame 2.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A35 · `stagger`: dazed stagger (loop)

4 frames, loops. Save as: `raw/stagger_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#stagger).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "stagger", dazed stagger. 4 frames in total, numbered 1 to 4 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Dazed wobble: standing loosely, upper body swaying to the left side of the image (rolled about 8°), head tilted the same way, arms hanging loose, knees unsteady (right knee bent inward). Face: dazed: half-closed unfocused eyes, mouth hanging slightly open.
2. Swaying back through center (upright), arms swinging loosely. Face: dazed.
3. Swaying to the right side of the image (rolled about 8° the other way), left knee bent inward. Face: dazed, head lolling.
4. Back through center. Flows into frame 1. Face: dazed.
MOTION: Hair spikes droop slightly; tails swing with the sway.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A36 · `ko`: knocked out

1 frame. Save as: `raw/ko_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `down` strip (`raw/down_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#ko).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "down" strip, for continuity (same scale, same pose language).

ANIMATION: "ko", knocked out. 1 frame.
1. Lying flat on the back like frame 2 of the attached "down" strip but completely limp: arms loose at the sides, legs straight, head tilted toward the viewer. Head toward the left side of the image. Face: out: eyes closed, mouth slightly open.
MOTION: Hair splayed on the floor, tails lying flat.

LAYOUT: one single pose centered on a 1024x1024 square canvas. Make the character as large as fits with a clear magenta margin on every side.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A37 · `intro`: shadow-clone hand seal (loop)

4 frames, loops. Save as: `raw/intro_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#intro).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "intro", shadow-clone hand seal. 4 frames in total, numbered 1 to 4 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Shadow-clone seal: feet planted about shoulder width (left forward), slight forward lean; both hands in front of the chest forming the cross-shaped seal: index and middle fingers of both hands extended and crossed in a plus shape (right hand fingers vertical, left hand fingers horizontal), other fingers curled; elbows out. Face: determined, eyes on the opponent, a hint of a confident smile.
2. Same, body slightly lower (breath). Face: determined. Hair/headband tails: tails flip to a second shape.
3. Same as frame 1, hair spikes slightly up. Face: determined.
4. Same as frame 2 with the jacket hem fluttering. Flows into frame 1. Face: determined.
MOTION: Headband tails and jacket hem flapping in the wind; hair spikes bob slightly.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A38 · `taunt`: pointing taunt (loop)

2 frames, loops. Save as: `raw/taunt_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#taunt).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.

ANIMATION: "taunt", pointing taunt. 2 frames in total, numbered 1 and 2 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Pointing: right arm thrust straight forward at shoulder height, index finger pointing at the opponent, left fist planted on the hip; chest out, leaning back slightly; feet planted casually. Face: confident grin, teeth showing.
2. Same, mouth open calling out, finger slightly higher. Face: confident grin, calling out.
MOTION: Hair bounces slightly on frame 2.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

---

### A39 · `specialForward`: WIND STYLE: RASENSHURIKEN, held in the hand (kit, fallback `special`)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). Save as: `raw/_parts/specialForward_vNN_A.png` and `raw/_parts/specialForward_vNN_B.png` (same NN); Codex stitches them into `raw/specialForward_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `special` strip (`raw/special_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialforward).

Leave the palm EMPTY in every pose: the engine draws the wind shuriken. If the generator refuses, replace "Rasenshuriken" wording per CHARACTER.md §9.

Part A (save as `raw/_parts/specialForward_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "special" strip, for continuity (same scale, same pose language).
ERA: early Shippuden, before Sage Mode: no orange eye pigment or markings around the eyes, no sage cloak, no toad features, no glowing chakra-mode body.

ANIMATION: "specialForward", WIND STYLE: RASENSHURIKEN, held in his hand: he raises the technique on his open palm, lunges in and slams it into the opponent by hand, and it hurts his own arm. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the open right palm is fully extended toward the right and is the right-most part of the character; leave the palm EMPTY (the game draws the technique); head, hair, short temple tufts and headband tails stay behind it.
1. Raising the technique: weight back on the right (rear) leg, knees bent about 30°, torso leaning back slightly, left foot forward; the right arm raised up and forward with the elbow slightly bent, the open right palm facing UP above the front of his head (no higher than the top of his hair), fingers spread, EMPTY; the left hand grips the right wrist from below to steady it. Face: fierce, teeth gritted, eyes intense on the opponent. Hair/headband tails: blown up and back.
2. Straining: knees deeper, torso leaning back a touch more, the right arm trembling, the left hand still on the right wrist; the palm still up and EMPTY. Face: fierce, teeth gritted. Hair/headband tails: second wind shape.
3. IMPACT: a deep lunge to the right, left knee bent far forward, right leg straight behind; torso pitched forward and rotated so the right shoulder leads (chest toward the viewer); the right arm fully extended straight forward at the height of his own chest (the deep lunge lowers it to an opponent's stomach), the open palm facing the right edge of the image, fingers spread and pointing up, EMPTY; the left fist pulled back to the left hip. Face: shout. SMEAR: a solid streak behind the right forearm (hard pixels, no blur).
4. Hold the extension (palm slightly back from frame 3), clean arm without smear. Face: shout.
MOTION: The right palm stays EMPTY in every pose: draw NO wind shuriken, no energy ball, no wind lines, no glow (the game draws the technique at his palm). Hair and headband tails are blown up and back on frames 1-2, stream back behind the head on frames 3-4 (never past the palm), whip forward on frame 5 and settle by frame 7.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialForward_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "special" strip, for continuity (same scale, same pose language).
ERA: early Shippuden, before Sage Mode: no orange eye pigment or markings around the eyes, no sage cloak, no toad features, no glowing chakra-mode body.

ANIMATION: "specialForward", WIND STYLE: RASENSHURIKEN, held in his hand: he raises the technique on his open palm, lunges in and slams it into the opponent by hand, and it hurts his own arm. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Recoil: staggering half a step back onto the right leg, torso hunched; the right arm hangs limp straight down at his side (the technique hurt it), the left hand clutching the right forearm. No wounds, burns or bandages. Face: pain, one eye squeezed shut, teeth gritted. Hair/headband tails: tails whip forward, still behind the head.
6. Straightening up: the right arm still low and limp, fingers twitching; the left fist rising toward the guard; weight re-centering. Face: pained, teeth gritted, eyes open.
7. Back in the stance (same as idle frame 1), the right fist back beside the jaw. Face: determined, teeth slightly gritted.
MOTION: The right palm stays EMPTY in every pose: draw NO wind shuriken, no energy ball, no wind lines, no glow (the game draws the technique at his palm). Hair and headband tails are blown up and back on frames 1-2, stream back behind the head on frames 3-4 (never past the palm), whip forward on frame 5 and settle by frame 7.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A40 · `specialUp`: UZUMAKI BARRAGE rising flip kick (kit, fallback `special`)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). Save as: `raw/_parts/specialUp_vNN_A.png` and `raw/_parts/specialUp_vNN_B.png` (same NN); Codex stitches them into `raw/specialUp_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airHeavy` strip (`raw/airHeavy_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialup).

The slam is his `airHeavy` strip, so pose 6 must match `airHeavy` pose 1. Draw no clones, afterimages or smoke: the engine adds them. If the generator refuses, replace "Uzumaki Barrage" wording per CHARACTER.md §9.

Part A (save as `raw/_parts/specialUp_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airHeavy" strip, for continuity (same scale, same pose language).

ANIMATION: "specialUp", UZUMAKI BARRAGE rising flip kick: he springs straight up with a rising flip kick, turns over at the top and ends ready for a double-fist hammer blow. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames (an anti-air kick on the way up): the right foot leads up and forward, in front of his face, and is the highest and right-most part of the character; head, hair and headband tails stay behind it.
1. Crouch: knees bent about 90°, torso leaning forward, both arms swung down and back behind the hips, heels down, head up looking up and forward at the target. Face: focused. Hair/headband tails: spikes compressed slightly, tails droop.
2. Spring: legs driving up, heels off the ground, toes last on the floor, knees still slightly bent; arms swinging forward and up to shoulder height; body leaning up and forward (not stretched fully upright). Face: fierce.
3. IMPACT: rising flip kick in mid-air: the body leaning back about 40° from vertical as he flips; the right leg kicks straight up and slightly forward, fully extended, instep and toes leading at the top right, in front of his face; the left leg trails straight down under the hips with pointed toes (the lowest point); both arms swept down and back for balance; head tilted back, eyes on the foot and the target above. Face: shout. SMEAR: a solid crescent in the pant-leg colors trailing below and behind the right leg along its upward arc (hard pixels, no blur). Hair/headband tails: dragged down.
4. Hold the kick without the smear, the legs slightly wider apart, the foot no higher than in frame 3. Face: shout. Hair/headband tails: dragged down, second shape.
MOTION: Poses 3 to 6 are in mid-air. While rising, the hair spikes, short temple tufts and headband tails are dragged DOWN; at the top of the arc (poses 5 and 6) they float up. Draw NO clones, no afterimages, no smoke: the game adds the shadow-clone afterimages. Nothing in poses 5 and 6 rises above the kicking foot of pose 3.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialUp_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airHeavy" strip, for continuity (same scale, same pose language).

ANIMATION: "specialUp", UZUMAKI BARRAGE rising flip kick: he springs straight up with a rising flip kick, turns over at the top and ends ready for a double-fist hammer blow. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Turning over at the top of the arc: the right leg swings down and folds, the body rolls forward toward upright, knees pulled up toward the chest, both hands coming together above the shoulders, head coming forward and looking down at the target below on the right. Face: focused. Hair/headband tails: floating up.
6. Apex: both arms raised overhead, fists clasped together (one hand wrapped over the other fist) above and slightly behind the head; torso arched back about 20°; knees tucked. This pose leads straight into his double-fist hammer slam: match the first pose of the attached airHeavy strip exactly. Face: shout.
MOTION: Poses 3 to 6 are in mid-air. While rising, the hair spikes, short temple tufts and headband tails are dragged DOWN; at the top of the arc (poses 5 and 6) they float up. Draw NO clones, no afterimages, no smoke: the game adds the shadow-clone afterimages. Nothing in poses 5 and 6 rises above the kicking foot of pose 3.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A41 · `specialDown`: NINE-TAILS CHAKRA CLOAK activation (kit, fallback `charge`)

4 frames, phases 2/1/1. Save as: `raw/specialDown_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialdown).

Draw NO chakra cloak, aura or glow: the engine wraps him in the red chakra cloak. The red slit eyes, thicker whiskers, canines and claws appear in this strip only, so its PALETTE line adds the 2 red eye colors (36 colors). The attached expression sheet shows his normal blue eyes; the prompt overrides them for this strip. If the generator refuses, replace "Nine-Tails" wording per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.
ERA: early Shippuden, before Sage Mode: no orange eye pigment or markings around the eyes, no sage cloak, no toad features, no glowing chakra-mode body.

ANIMATION: "specialDown", NINE-TAILS CHAKRA CLOAK activation: a feral power-up, not an attack. 4 frames in total, numbered 1 to 4 from left to right.
FERAL: in the poses marked (FERAL) his eyes are RED with thin black VERTICAL SLIT pupils (red iris #e0302a with a lighter lower edge #ff6a4d and a dark upper half and rim #8a1a20, white eye whites, one tiny white catch-light); the three whisker marks on each cheek are thicker, darker (#1d1420) and slightly jagged; his upper canines are sharper (two small pointed fangs); his fingernails have grown into short pointed claws (pale, in his skin-highlight and white tones, never metal, never glowing). In poses 1 and 2 the change is only starting. His short hair, outfit and colors stay exactly as on the model sheet.
1. Dropping into a feral crouch: knees bent about 80°, feet planted wide, torso hunched far forward, both hands low in front of the knees with the fingers curled like claws, head down so the bangs shade the eyes. Face: teeth gritted, eyes hidden in the shadow of the bangs. Hair/headband tails: starting to lift.
2. Deeper: crouched lower, shoulders hunched and trembling, the clawed hands nearly touching the floor, head still down; the whisker marks starting to thicken and the nails starting to grow. Face: teeth gritted, a small red glint in the shadowed eyes. Hair/headband tails: lifting.
3. ROAR (FERAL): torso rising and arched back, chest out, knees still bent and wide; both arms spread down and out to the sides, hands open with the fingers hooked into claws; head thrown up and back, mouth wide open roaring, the sharp canines bared. Face: feral roar, red slit eyes. Hair/headband tails: blown straight up.
4. (FERAL) Rising back toward his fighting stance, still feral: knees bent, a slight forward lean, both hands raised in front at chest height as open claws instead of fists, head level, glaring at the opponent on the right. Face: feral snarl, red slit eyes, lips pulled back over the clenched teeth and canines. Hair/headband tails: settling.
MOTION: The feet stay planted on the same spot in all 4 poses. Draw NO red chakra cloak, no aura, no glow, no bubbling energy, no chakra tail, no red skin tint, no smoke: the game draws the cloak around him.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 36 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20; red eyes (this strip only) #e0302a #ff6a4d.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A42 · `superPose`: SHADOW CLONE seal, super flash (kit, fallback `taunt`)

4 frames, loops. Save as: `raw/superPose_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `intro` strip (`raw/intro_vNN.png` with NN = its `approvedVersion`; if `intro` has no approved version yet, leave it out and delete the "Also attached" sentence). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superpose).

Draw NO clones and no smoke: the engine adds the shadow clones and the super flash. Without this strip the super flash shows the pointing taunt, so generate it. If the generator refuses, replace the "Shadow Clone" wording per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "intro" strip, for continuity (same scale, same hand seal).

ANIMATION: "superPose", SHADOW CLONE JUTSU hand seal for his shadow-clone barrage super (shown during the super flash). 4 frames in total, numbered 1 to 4 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Braced: feet well wider than the shoulders (left foot forward), knees bent about 30°, weight low and centered; torso upright and turned a bit more toward the viewer so the seal reads; both hands in front of the middle of the chest forming the cross-shaped seal: index and middle fingers of both hands extended and crossed in a plus shape (right hand fingers vertical, left hand fingers horizontal), other fingers curled, elbows out; head up, eyes on the opponent on the right. Face: shout, brows hard down, determined. Hair/headband tails: blown up and back.
2. Same, body slightly lower; the headband tails and jacket hem in a second wind shape. Face: shout.
3. Same as frame 1, hair spikes slightly up, the tails in a third shape. Face: shout.
4. Same as frame 2 with the pant legs fluttering. Flows into frame 1. Face: shout.
MOTION: A held, powerful pose with a small wind loop: only the hair, headband tails, jacket hem and pant legs move; the hands, face and feet stay put. The hands never cover his face. Draw NO clones, no smoke puffs, no aura: the game adds the shadow clones and the super flash.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

## UI art

UI images are not packed into the sheet. Save each candidate as `raw/ui_<name>_vNN.png` (the sheet
packer skips `ui_*` files) and log it in art/REVIEW.md. When the user approves one, Codex copies it to
`ui/<name>.png`; `npm run sprites naruto` removes the magenta, crops and fits it to the exact size
(nearest / palette-preserving "mode" sampling) and writes it to `public/characters/naruto/` (SPEC.md
"Per-character UI images"). Attach `reference/model_sheet.png` and `reference/expressions.png`.

### U1 · Portrait (96×96)

Save as: `raw/ui_portrait_vNN.png` → approved copy `ui/portrait.png` (packed to 96×96, transparent
background).

```text
Pixel-art character portrait for a fighting-game HUD (anime fan-art).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and expression sheet exactly.

Head and shoulders, facing RIGHT in 3/4 view (both eyes visible), cropped at the upper chest; the head fills most of the frame. Serious, confident, determined look with a faint hint of a smile, eyes looking right toward the opponent. Slim angular teenage face (not chibi), whisker marks on both cheeks, shortened bangs ending above or at the top edge of the headband plate with the leaf-swirl symbol clearly readable, short upper-ear temple tufts, the black high collar and a bit of the black-and-orange jacket at the bottom.
SIZE: a 1024x1024 square canvas showing pixel art on a 96x96 art-pixel grid (every art pixel is a crisp square block about 10x10 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no numbers, no labels, no frame borders.
```

### U2 · Super cut-in eye strip (480×128)

The DBFZ-style super-flash strip that slides across the screen before the Rasen Cannon. Save as:
`raw/ui_cutin_vNN.png` → approved copy `ui/cutin.png`. The packer removes the magenta above and
below the band and fits the band to 480×128. The face fills the strip edge to edge, so there is no
background to remove inside the band.

```text
Pixel-art "super move cut-in" for a fighting game (anime fan-art), an extreme close-up of the character's eyes.
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and expression sheet exactly.

On a 1536x1024 landscape canvas, draw one horizontal band 1536 px wide and 410 px tall across the middle (ratio 3.75 to 1). Inside the band: an extreme close-up of his face from just above the eyebrows to just below the nose, both eyes visible, face turned slightly toward the right. Expression: furious determination, brows hard down, sharp bright blue eyes with small intense pupils and crisp white catch-lights, the three whisker marks on both cheeks, the lower edge of the steel headband plate at the very top of the band with short blond bangs ending above or at the plate's top edge. A slim, mature teenage face, not chibi. The face fills the band completely edge to edge.
SIZE: pixel art on a 480x128 art-pixel grid inside the band (every art pixel is a crisp square block about 3x3 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
Colors: use the palette below; the eyes may read slightly brighter (#ffffff catch-lights), still with hard pixels.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF above and below the band only. No text, no speed lines, no borders.
```

### U3 · Character select art (384×384)

Save as: `raw/ui_select_vNN.png` → approved copy `ui/select.png` (packed to 384×384, transparent
background). The Rasengan **is** allowed here (UI art, not a sprite).

```text
Pixel-art full-body character select illustration for a fighting game (anime fan-art).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and expression sheet exactly.

Dynamic hero pose facing RIGHT in 3/4 view: low wide stance, right arm thrust forward holding a glowing, swirling sphere of blue wind-chakra (a Rasengan: blue #3a7cf0 and #7ab8ff with white #e8f6ff swirl bands, hard-edged pixels, no blur) in his open palm, left fist clenched back at his hip, headband tails and jacket hem blowing back, a fierce, confident expression. The whole body fits inside the frame with a small margin.
SIZE: a 1024x1024 square canvas showing pixel art on a 384x384 art-pixel grid (every art pixel is a crisp square block, about 2.7x2.7 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20. Plus for the sphere only: #3a7cf0 #7ab8ff #e8f6ff.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no logo, no ground shadow.
```

---

## Fix-up prompts

Every fix produces a **new version**: never edit or overwrite an existing `_vNN` file. Attach the
candidate being fixed (and the usual approved references), then log the new version in
art/REVIEW.md with what changed.

### F1 · Redraw one frame

Attach the strip that has the bad frame (`raw/<anim>_vNN.png`). Save each attempt as
`raw/<anim>_NN_fixMM.png`, where NN is the bad frame's 0-based file number and MM the attempt
(pose 3 in the prompt, first attempt = `<anim>_02_fix01.png`; a second attempt is `_02_fix02.png`, so
attempts never overwrite each other). The packer skips `*_fix<digits>.png` files, so a loose single
frame never gets packed as an animation of its own. Codex
removes the background, scales the keeper to the same head size as its neighbours, pastes it over
the bad pose and saves the patched strip as the **next** version `raw/<anim>_vNN.png` (REVIEW row:
"pose N patched"), then re-runs `npm run sprites naruto`.

```text
Using the attached sprite strip, redraw ONLY frame <N> (counting from 1, left to right) as a single pose on a 1024x1024 flat solid magenta (#FF00FF) canvas, at exactly the same character scale, design, proportions (about 6.5 heads tall, not chibi) and palette as the other frames. Fix: <describe the problem, e.g. "the left fist must be fully extended horizontally toward the right; it is the right-most point of the character">. Keep everything else about the pose identical. Facing right, 3/4 view, crisp hard pixels, no anti-aliasing, no text, no ground shadow.
```

### F2 · Character drifted off-model

Save as the next version `raw/<anim>_vNN.png` (or the next part version).

```text
In the attached strip the character drifted from the attached model sheet: <list, e.g. "headband is navy blue instead of black", "the jacket lost its black shoulders and high black collar", "whisker marks missing in frames 4-6", "sandals turned blue">. Redraw the whole strip with exactly the same poses, fixing only those details. Same layout, scale, palette and magenta background.
```

### F3 · Hit frames don't reach

Save as the next version `raw/<anim>_vNN.png`.

```text
In the attached strip, frames <a>-<b> are the hit frames but the <fist / foot / palm> stops short. Redraw the strip with the same poses, except that in frames <a>-<b> the <limb> is fully extended horizontally toward the right edge of the image and is clearly the right-most part of the character. Head, hair, short temple tufts and headband tails stay behind it. Same scale, palette and magenta background.
```

### F4 · Chibi drift, inconsistent scale or baseline

Save as the next version `raw/<anim>_vNN.png`.

```text
In the attached strip the character <came out chibi (head too big, legs too short) / changes size between frames / does not stand on one baseline>. Redraw it with exactly the same poses at about 6.5 heads tall with serious anime proportions (not chibi, not super-deformed), matching the attached model sheet and idle strip: the same head size in every frame, and every grounded foot on one shared horizontal line. Same palette and magenta background.
```
