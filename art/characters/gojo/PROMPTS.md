# Gojo: image prompts (generation order)

> ART-GOJ-BUILD, 2026-10-10: BUILD_REDRAW.md section 4 is the active S1 brief. Model v05 is a sandbox candidate with failing QA; do not use it as a reference. The full section 10 prompt/doc migration and idle v04 wait for a passing user-approved model. The old slender-build instructions below describe the still-approved shipping set and must not guide the build redraw.

> **ART-SCALE-01 user correction:** preserve Gojo's original approved compact head and slender adult proportions (model v03, idle v02). The enlarged-head candidates are rejected. Use the original Gojo as the visual scale reference when reviewing the cast; retain character height differences and stable anatomy through animations. Never enlarge Gojo to satisfy the nominal 31px target. See [CHARACTER_SCALE.md](../../CHARACTER_SCALE.md).

> **Current correction, 2026-10-09 (reaffirmed by the user):** model v02 is rejected for its enlarged head. Use the supplied
> `reference/model_sheet_v03.png` as the proportion reference: compact head, narrow adult face,
> long legs and slender body. This visual reference overrides numeric head-ratio instructions in
> every prompt below. Preserve this approved head size through every animation; never enlarge it to meet a numeric target. Provisional references were authorized; continue
> production and testing without per-step approval stops, retaining versioned files and final review.

> Copy-paste prompts for the image generator (Codex's built-in generator, or ChatGPT run by the user),
> in the order to run them, for **art spec v2**
> ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md): 256×256 cells) and the move
> system v2 ([ADR 0009](../../../docs/decisions/0009-move-system-v2.md): four optional kit animations).
> Gojo is the **tallest fighter** (about 7 heads, standing body about 215 px in the cell; head about
> the approved compact size). Each prompt is self-contained. The poses are the same as
> [ANIMATIONS.md](ANIMATIONS.md), described in words. Look, palette and fallback wording:
> [CHARACTER.md](CHARACTER.md). Pipeline and QA: [art/PIPELINE.md](../../PIPELINE.md). Review queue:
> [art/REVIEW.md](../../REVIEW.md). If anything here disagrees with the ADRs or
> [art/SPEC.md](../../SPEC.md), they win; if a prompt and ANIMATIONS.md disagree, ANIMATIONS.md wins.

## How to use (Codex + user)

1. **Codex generates every image** with its built-in image generator and attaches the approved
   references as image inputs (the "Attach" line of each prompt). The user can still run a prompt by
   hand in ChatGPT; the file is saved and reviewed the same way.
2. **One thread per character, run in parallel with the others.** Use a separate Codex thread (or
   chat) named "GCD Gojo sprites"; it can run at the same time as the Naruto, Sasuke and Killua
   threads, and S1 for Gojo does not wait for anyone. **Never put two characters in one image, and
   never attach another character's references to a Gojo prompt.** Start a fresh thread (re-attach the
   references; every prompt is self-contained) when it drifts or after about 6 strips.
3. **Run S1 and S2 first** (model sheet, expressions). Iterate until the user approves one version of
   each. Codex then **copies** the approved version to the fixed name: `reference/model_sheet.png`,
   `reference/expressions.png`. As identity references, later prompts attach only approved fixed-name
   files (`model_sheet.png`, `expressions.png`, `idle_approved.png`). Two exceptions: (a) a Part B block
   attaches Part A of the same version; (b) a retry of S1/S2 or a strip fix may attach the candidate
   being corrected, together with the list of changes. Never attach `reference/source/` (copyrighted),
   `reference/_old/` or another character's files.
4. **Run the strips in `step` order** (the index below = `art/manifest.json` steps). A01–A23 are the
   CORE set: the game switches to the new art only when all of them are packed. A24–A38 are optional
   polish, then the four ADR 0009 kit animations A39–A42 (optional for the engine, but they are Gojo's
   identity: Red, Blink, Infinity and the Domain pose). Never start a step while the step before it has
   no approved version.
5. **Quick check before saving** (30 seconds): right pose count, facing right, **about 7 heads, the
   tallest fighter (not chibi, not a 6.5-head teen)**, the **black blindfold over the eyes** (eyes only in
   A42 and U2), the white hair standing up above the band, the tall collar zipped to the chin, the
   hip-length dark navy jacket with the center zipper, loose trousers, black shoes, the hands in the
   pockets where the prompt says, **no hand, elbow or foot above the top of his hair**, flat magenta, no
   shadow, text or effects. If it fails, regenerate; an attempt that was never saved needs no number.
6. **Save every image with a version number** (ADR 0007): the "Save as" name with `_vNN`, where
   `NN` is two digits and **1 + the highest version ever used for that asset** (look in the folder,
   `raw/_parts/`, its `_rejected/` subfolder and the REVIEW.md rows). Make up to 3 attempts per round
   and save only the best one. The first image of an asset is `v01`. Never overwrite, reuse or delete a
   version: the **highest number is always the latest candidate**, so the user and Claude can find it
   at a glance. Don't crop or rename frames; Codex and the packer do that.
7. **Long strips come in two images.** Every strip with 6 or more frames has a Part A and a Part B
   block (4 or fewer tall figures per image stay big enough; the split keeps all hit frames in one
   image). Save part A as `raw/_parts/<anim>_vNN_A.png`, run part B with part A attached, save it as
   `raw/_parts/<anim>_vNN_B.png` (same NN), then stitch both into `raw/<anim>_vNN.png`
   (art/PIPELINE.md "Long strips (parts)"). If only one part needs a redo, the redo is a new version:
   save it under the next NN and copy the kept part under the same new NN, so both halves of a version
   always belong together. One REVIEW.md row covers the stitched strip.
8. **Queue it for review:** add a row at the **top** of [art/REVIEW.md](../../REVIEW.md) (date,
   `gojo`, asset, file link, version, status `needs review`, what changed since the previous version
   including any prompt tweak, QA notes). In the same edit set the asset's `version` in
   `art/manifest.json` (status `raw` if it was `todo`) and update `art/TRACKER.md`. Re-read REVIEW.md
   right before editing it: the other character threads edit it too. For strips, run
   `npm run sprites gojo` first: the packer uses the **highest** `_vNN` strip per animation and prints
   which file it used (check it is the one just saved). Check it in game
   (http://127.0.0.1:5188/?fight=gojo,gojo&mode=solo&art=custom&debug) or in the Sprite Lab
   (http://127.0.0.1:5188/sprites.html?c=gojo, click "Load full sheet (.png + .json)…" and pick
   `public/characters/gojo/sheet.png` and `anims.json`; otherwise it shows the baked placeholder), run
   the QA notes in ANIMATIONS.md (head about 31 px, the strip's `bodyHeight` from the Gojo column, feet
   on the pivot, contact zones, nothing clipped at the top, the blindfold on) and write the result in
   the QA notes. Then stop and show the user the latest version with a short verdict (identity /
   proportions and pose / technical).
9. **The user decides** ("approve gojo idle v03" / "reject gojo light1 v02: palm too low", in chat or in
   REVIEW.md). Approved: the row becomes `approved`, `approvedVersion` = NN in the manifest, and Codex
   copies references to their fixed names (`reference/model_sheet.png`, `reference/expressions.png`,
   the approved idle strip to `reference/idle_approved.png`, UI to `ui/<name>.png`). Rejected: the row
   becomes `rejected` with the reason, the file moves to the `_rejected/` folder next to it
   (`raw/_rejected/`, `reference/_rejected/`), and the next version is generated with the problem
   called out (fix prompts F1-F4 at the bottom).
10. **If the generator refuses** a prompt that names the character: replace the `CHARACTER:` line with
    the fallback below, and swap the names using the replacement table in CHARACTER.md §9 (Six Eyes →
    "bright, glowing sky-blue crystalline eyes with white eyelashes", Lapse: Blue → "pointing two fingers
    forward to open a small swirling blue gravity vortex", Hollow Purple → "a huge purple energy beam made
    by merging a blue orb and a red orb", and so on; also drop "jujutsu" and "Jujutsu Kaisen"). Never
    name the original artist or studio.

### Fallback CHARACTER line (no names)

```text
CHARACTER: an original character inspired by modern dark-fantasy shonen anime, fan-art sprite for a personal non-commercial game project: a very tall, slender, broad-shouldered man of about 28 with a relaxed, cocky confidence, drawn with serious adult anime proportions (about 7 heads tall, not chibi). Spiky snow-white hair pushed straight up and slightly back by a wide black cloth blindfold that wraps around his head and completely covers his eyes and brows, short white hair at the nape. Pale skin, a sharp jaw, a straight nose, thin lips in a lazy smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin, a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits. Matching loose dark navy-black trousers. Black leather shoes. He often keeps his hands in his trouser pockets.
```

## Index

Run the prompts top to bottom: `step` is the generation order from `art/manifest.json` (the same
steps as art/PIPELINE.md "Generation order" and art/TRACKER.md). Codex picks the lowest `step` with
no approved version. All paths are relative to `art/characters/gojo/`; `vNN` = the next free
version (`v01` first). The A39–A42 rows are the ADR 0009 kit animations (step 9 after A38 unless the
manifest gives them their own step).

| step | id | asset | frames | images | CORE | save as (versioned; NN = next free version) |
|---|---|---|---|---|---|---|
| 1 | S1 | model sheet (5 views incl. a true side profile + palette swatches) | | 1 | | `reference/model_sheet_vNN.png` → approved copy `reference/model_sheet.png` |
| 2 | S2 | expression sheet (7 blindfold heads + 1 with the eyes revealed) | | 1 | | `reference/expressions_vNN.png` → approved copy `reference/expressions.png` |
| 3 | A01 | `idle`: relaxed stance, hands in pockets (breathing loop) | 8 | 2 | **CORE** | `raw/_parts/idle_vNN_A.png` + `raw/_parts/idle_vNN_B.png` → `raw/idle_vNN.png` → approved copy `reference/idle_approved.png` |
| 4 | A02 | `run`: easy athletic run (loop) | 8 | 2 | **CORE** | `raw/_parts/run_vNN_A.png` + `raw/_parts/run_vNN_B.png` → `raw/run_vNN.png` |
| 5 | A03 | `light1`: palm jab with the L (lead) hand | 7 | 2 | **CORE** | `raw/_parts/light1_vNN_A.png` + `raw/_parts/light1_vNN_B.png` → `raw/light1_vNN.png` |
| 5 | A04 | `light2`: rear palm strike with the R (near) hand | 7 | 2 | **CORE** | `raw/_parts/light2_vNN_A.png` + `raw/_parts/light2_vNN_B.png` → `raw/light2_vNN.png` |
| 5 | A05 | `light3`: push kick to the stomach with the R (near) leg, hands in pockets | 7 | 2 | **CORE** | `raw/_parts/light3_vNN_A.png` + `raw/_parts/light3_vNN_B.png` → `raw/light3_vNN.png` |
| 5 | A06 | `light4`: spinning roundhouse finisher with the R leg | 8 | 2 | **CORE** | `raw/_parts/light4_vNN_A.png` + `raw/_parts/light4_vNN_B.png` → `raw/light4_vNN.png` |
| 5 | A07 | `heavy`: rising elbow launcher with the R (near) elbow | 8 | 2 | **CORE** | `raw/_parts/heavy_vNN_A.png` + `raw/_parts/heavy_vNN_B.png` → `raw/heavy_vNN.png` |
| 5 | A08 | `airLight1`: mid-air palm jab with the L hand | 5 | 1 | **CORE** | `raw/airLight1_vNN.png` |
| 5 | A09 | `airHeavy`: two-handed hammer spike | 6 | 2 | **CORE** | `raw/_parts/airHeavy_vNN_A.png` + `raw/_parts/airHeavy_vNN_B.png` → `raw/airHeavy_vNN.png` |
| 6 | A10 | `guard`: crossed-wrist high block (loop) | 2 | 1 | **CORE** | `raw/guard_vNN.png` |
| 6 | A11 | `hurtHigh`: hit in the face | 3 | 1 | **CORE** | `raw/hurtHigh_vNN.png` |
| 6 | A12 | `launched`: knocked flying backward (loop) | 2 | 1 | **CORE** | `raw/launched_vNN.png` |
| 6 | A13 | `down`: slammed down, then lying on the back | 2 | 1 | **CORE** | `raw/down_vNN.png` |
| 6 | A14 | `getup`: kip-up | 5 | 1 | **CORE** | `raw/getup_vNN.png` |
| 7 | A15 | `charge`: calm power-up (loop) | 4 | 1 | **CORE** | `raw/charge_vNN.png` |
| 7 | A16 | `beamCharge`: charging the HOLLOW PURPLE (loop) | 3 | 1 | **CORE** | `raw/beamCharge_vNN.png` |
| 7 | A17 | `beamFire`: firing the HOLLOW PURPLE (loop) | 3 | 1 | **CORE** | `raw/beamFire_vNN.png` |
| 7 | A18 | `special`: LAPSE: BLUE (two-finger point) | 8 | 2 | **CORE** | `raw/_parts/special_vNN_A.png` + `raw/_parts/special_vNN_B.png` → `raw/special_vNN.png` |
| 8 | A19 | `dash`: hands-in-pockets glide (loop) | 2 | 1 | **CORE** | `raw/dash_vNN.png` |
| 8 | A20 | `jumpUp`: rising (loop) | 2 | 1 | **CORE** | `raw/jumpUp_vNN.png` |
| 8 | A21 | `jumpFall`: falling (loop) | 2 | 1 | **CORE** | `raw/jumpFall_vNN.png` |
| 8 | A22 | `land`: landing | 2 | 1 | **CORE** | `raw/land_vNN.png` |
| 8 | A23 | `win`: peace sign (loop) | 4 | 1 | **CORE** | `raw/win_vNN.png` |
| 9 | A24 | `backDash`: quick hop backward | 3 | 1 |  | `raw/backDash_vNN.png` |
| 9 | A25 | `superDash`: homing super dash (loop) | 2 | 1 |  | `raw/superDash_vNN.png` |
| 9 | A26 | `jumpSquat`: pre-jump crouch | 1 | 1 |  | `raw/jumpSquat_vNN.png` |
| 9 | A27 | `airLight2`: mid-air front kick with the R leg | 5 | 1 |  | `raw/airLight2_vNN.png` |
| 9 | A28 | `airLight3`: mid-air spinning heel kick with the L leg | 6 | 2 |  | `raw/_parts/airLight3_vNN_A.png` + `raw/_parts/airLight3_vNN_B.png` → `raw/airLight3_vNN.png` |
| 9 | A29 | `block`: pushed back while blocking | 2 | 1 |  | `raw/block_vNN.png` |
| 9 | A30 | `hurtLow`: hit in the stomach | 3 | 1 |  | `raw/hurtLow_vNN.png` |
| 9 | A31 | `spin`: tumbling backward (loop) | 4 | 1 |  | `raw/spin_vNN.png` |
| 9 | A32 | `airRecover`: mid-air backflip recovery | 3 | 1 |  | `raw/airRecover_vNN.png` |
| 9 | A33 | `throw`: REVERSAL: RED in mid-air (finger flick) | 4 | 1 |  | `raw/throw_vNN.png` |
| 9 | A34 | `vanish`: high-speed teleport | 2 | 1 |  | `raw/vanish_vNN.png` |
| 9 | A35 | `stagger`: dizzy stagger (loop) | 4 | 1 |  | `raw/stagger_vNN.png` |
| 9 | A36 | `ko`: knocked out | 1 | 1 |  | `raw/ko_vNN.png` |
| 9 | A37 | `intro`: hands-in-pockets shrug (loop) | 4 | 1 |  | `raw/intro_vNN.png` |
| 9 | A38 | `taunt`: looming tease (loop) | 2 | 1 |  | `raw/taunt_vNN.png` |
| 9 | A39 | `specialForward`: REVERSAL: RED (finger flick, recoil) | 7 | 2 |  | `raw/_parts/specialForward_vNN_A.png` + `raw/_parts/specialForward_vNN_B.png` → `raw/specialForward_vNN.png` |
| 9 | A40 | `specialUp`: BLINK (teleport) | 6 | 2 |  | `raw/_parts/specialUp_vNN_A.png` + `raw/_parts/specialUp_vNN_B.png` → `raw/specialUp_vNN.png` |
| 9 | A41 | `specialDown`: INFINITY (raised open palm) | 4 | 1 |  | `raw/specialDown_vNN.png` |
| 9 | A42 | `superPose`: DOMAIN EXPANSION: UNLIMITED VOID (eyes revealed, loop) | 4 | 1 |  | `raw/superPose_vNN.png` |
| 11 | U1 | portrait 96×96 (blindfold on) | | 1 | | `raw/ui_portrait_vNN.png` → approved copy `ui/portrait.png` |
| 11 | U2 | super cut-in eye strip 480×128 (**eyes revealed**) | | 1 | | `raw/ui_cutin_vNN.png` → approved copy `ui/cutin.png` |
| 11 | U3 | character select art 384×384 (blindfold on) | | 1 | | `raw/ui_select_vNN.png` → approved copy `ui/select.png` |
| extra | X1, X2 | optional Gojo effect art (engine support pending) | | 1 each | | `art/vfx/raw/_proposed/gojo_<effect>_vNN.png` |

Within step 9, Gojo tip: run A33 `throw` (his air Red) and A37 `intro` first; they show up every
match. Among A39–A42, run A41 `specialDown`, A39 `specialForward` and A42 `superPose` before A40
`specialUp` (the engine does not show Blink's strip yet).

---

## S1 · Model sheet

Attach: nothing the first time (never another character's image). For a later version you may attach
the best earlier Gojo `_vNN` candidate together with a short list of what to change. **Save as:
`reference/model_sheet_vNN.png`** (the first one is `v01`). Runs **in parallel with the other
characters' S1**, in the Gojo thread. After "approve gojo model_sheet vNN", Codex copies that version
to `reference/model_sheet.png`.

```text
Character model sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.

Draw the same character 5 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear gaps between them:
1. FRONT view, relaxed neutral stand, arms slightly away from the body, facing the viewer (the zipper runs down the center of the jacket from the collar top to the hem; the blindfold covers both eyes);
2. 3/4 view facing RIGHT (body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show), relaxed neutral stand: this is the main game view;
3. TRUE SIDE PROFILE facing RIGHT: turned exactly 90 degrees, the nose, lips and chin in silhouette pointing straight to the right, the blindfold band seen from the side wrapping around the head at eye level, the white hair spikes in profile sweeping up and back, the tall collar in profile up to the jaw, the far arm and leg hidden behind the near ones; NOT a 3/4 view;
4. BACK view: the back of the white hair spikes and the short hair at the nape, the blindfold's neat overlapping wraps at the back of the head (no hanging tails), the back of the tall collar, the plain jacket back and hem;
5. 3/4 view facing RIGHT in his relaxed fighting stance: tall and loose, knees bent about 20 degrees, left foot forward, right foot back, weight on the back leg, BOTH HANDS IN HIS TROUSER POCKETS with the elbows hanging loosely out, a slight slouch, chin slightly down as if looking down at a shorter opponent, a lazy confident smile.
Below the figures, one row of 29 small square color swatches (no text), one per palette color, in the palette order listed below.
Show clearly in every view: the black blindfold covering both eyes and brows; the snow-white hair standing up above the band; the tall collar zipped up to the chin; the hip-length dark navy jacket with the center zipper and the small silver pull; loose dark trousers; black leather shoes; about 7 heads tall with very long legs.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (the head matching approved model v03 and idle v02; the hair adds about 18 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. On this sheet draw at 2x: every art pixel is a 2x2 block, so the standing body (soles to top of the skull) is about 430 px tall on the canvas (the head at twice its approved packed length), the hair on top of that.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no labels, no ground shadow, no floor, no effects.
```

Check before saving (and write the result in the REVIEW.md QA notes): **measure the proportions**
(standing body height ÷ head height ≈ 7, not 4 to 6); the blindfold covers the eyes and brows in every
view, no tails; white hair standing up above the band (not flat, not grey); view 3 is a **true
profile**; the collar zipped to the chin with the zipper pull; hip-length navy jacket, no buttons or
emblem; loose trousers; black shoes; the stance has both hands in the pockets; flat magenta; at most 48
colors on the character. Codex notes what changed between versions in `reference/notes.md`.

## S2 · Expression sheet

Attach: `reference/model_sheet.png`. **Save as: `reference/expressions_vNN.png`**. After approval Codex
copies it to `reference/expressions.png`.

```text
Expression sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet exactly (same face shape, hair, blindfold, collar and colors).

Draw 8 head-and-shoulders close-ups in a 4 by 2 grid on a 1536x1024 landscape canvas, every head facing RIGHT in 3/4 view, all at the same scale, with clear gaps between them:
1. lazy smile (his default): one mouth corner raised, lips closed, chin slightly up;
2. focused: mouth a calm flat line, jaw set, head level;
3. grin: a wide grin showing the upper teeth, cheeks raised, head tilted;
4. declaration: mouth open showing teeth and the dark mouth interior, as if calmly naming a technique;
5. pain: teeth gritted, mouth twisted to one side, head turned slightly away;
6. slack: mouth hanging open, head lolling (dazed or knocked out);
7. bored and unimpressed: mouth slightly pursed, head tilted back, looking down his nose;
8. EYES REVEALED: the blindfold pushed UP onto his forehead (a black band across the forehead, the white hair still standing up above it), both eyes open: glowing bright sky-blue crystalline irises (#5fe2ff with a #1f8ee8 rim, pale #e2fbff inner rings and one white catch-light), a small dark pupil, eye whites #f6f2f4, long WHITE eyelashes and WHITE brows; a calm, superior half-smile.
Heads 1 to 7: the black blindfold covers both eyes and brows completely; the expression shows through the mouth, jaw, cheeks and head tilt, and the band may crease slightly where the brows move under it. The tall collar zipped up to the chin in every head.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. Keep the approved compact skull-to-chin size in the game; on this sheet draw at 4x: every art pixel is a 4x4 block.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything. No text, no numbers, no labels.
```

---

## Animation strips

Attach to every strip prompt: `reference/model_sheet.png`, `reference/expressions.png` and, from A02
on, `reference/idle_approved.png`, plus any extra approved strip listed under "Attach" (the move it
continues: `light2` after `light1`, the air attacks, `getup` after `down`, `beamFire` after
`beamCharge`, `block` after `guard`). Strips with 6 or more frames come as **two images** (Part A
and Part B). Every block restates the proportions, size, blindfold rule, palette and rules, so it also
works in a fresh thread. Every "Save as" name gets the next free `_vNN`.

**Step 3 · idle**

### A01 · `idle`: relaxed stance, hands in pockets (breathing loop) (CORE)

8 frames, loops. **Two images** (poses 1-4, then 5-8). **Save as: `raw/_parts/idle_vNN_A.png` and `raw/_parts/idle_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/idle_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle). **After the user approves it, Codex copies the stitched strip to `reference/idle_approved.png`**; every later prompt attaches that file.

Part A (save as `raw/_parts/idle_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and expression sheet exactly: same face, hair, blindfold, uniform, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", relaxed fighting stance with both hands in his pockets (breathing loop). 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. KEY POSE. Relaxed, tall stance: left (lead) foot forward with the toes pointing right, right foot back and turned out 45 degrees, feet about shoulder-width, knees bent about 20 degrees, weight mostly on the back (right) leg, hips slightly cocked. Torso turned about 35 degrees toward the viewer with a lazy slouch: shoulders loose and a little rounded, head forward and tilted slightly down as if looking down at a shorter opponent. BOTH HANDS IN HIS TROUSER POCKETS under the jacket hem, elbows hanging loosely out from his sides. Face: lazy, confident one-sided smile. The white hair crown stands up above the black blindfold band.
2. Inhale: chest and shoulders rise very slightly. Hair tips not moved yet (lag). Face: lazy smile.
3. Top of the breath, slightly higher; hair tips lift slightly. Face: lazy smile.
4. Hold the top; the jacket hem drifts slightly. Face: lazy smile.
MOTION: A very small breathing bob done with the knees and chest only. The FEET ARE IDENTICAL in all 8 frames (they never slide) and both hands stay in the pockets in every frame. Hair tips and the jacket hem lag the body by one frame.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/idle_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and expression sheet exactly: same face, hair, blindfold, uniform, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", relaxed fighting stance with both hands in his pockets (breathing loop). 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4). It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
5. Exhale, halfway down. Face: lazy smile.
6. Same height as frame 1. Face: lazy smile.
7. Lowest point: knees bend a little more, shoulders drop slightly, the head bobs slightly; hair tips and the jacket hem settle. Face: lazy smile.
8. Rising back toward frame 1 (flows straight into frame 1). Face: lazy smile.
MOTION: A very small breathing bob done with the knees and chest only. The FEET ARE IDENTICAL in all 8 frames (they never slide) and both hands stay in the pockets in every frame. Hair tips and the jacket hem lag the body by one frame.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

**Step 4 · run**

### A02 · `run`: easy athletic run (loop) (CORE)

8 frames, loops. **Two images** (poses 1-4, then 5-8). **Save as: `raw/_parts/run_vNN_A.png` and `raw/_parts/run_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/run_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#run).

Part A (save as `raw/_parts/run_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "run", easy long-striding athletic run. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Contact: left foot reaching forward, ball of the foot touching down well ahead of the hips; right leg extended back, toes pushing off; right arm swung forward, left arm back. Face: lazy smile.
2. Down: weight on the left leg, knee bent deepest, body at its lowest; right heel lifting behind.
3. Passing: left leg under the hips, right knee swinging forward past it; body rising.
4. Flight: both feet off the ground; right knee forward and up, left leg extended straight back; body at its highest; longest stride.
MOTION: Torso leaning about 35 degrees forward for the whole cycle, head up, chin level. Arms bent about 90 degrees swing loosely opposite to the legs, hands open and relaxed (this is NOT a ninja run). Long, effortless strides. Hair tips and the jacket hem stream back to the left; the trouser legs ripple.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/run_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "run", easy long-striding athletic run. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4). It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
5. Contact (like frame 1 with the legs and arms swapped): right foot reaching forward, left leg back; left arm forward, right arm back. Face: lazy smile.
6. Down: weight on the right leg, knee bent deepest, body at its lowest.
7. Passing: left knee swinging forward past the right leg; body rising.
8. Flight: left knee forward and up, right leg extended back; body at its highest (flows into frame 1).
MOTION: Torso leaning about 35 degrees forward for the whole cycle, head up, chin level. Arms bent about 90 degrees swing loosely opposite to the legs, hands open and relaxed (this is NOT a ninja run). Long, effortless strides. Hair tips and the jacket hem stream back to the left; the trouser legs ripple.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

**Step 5 · core attacks**

### A03 · `light1`: palm jab with the L (lead) hand (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light1_vNN_A.png` and `raw/_parts/light1_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light1_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light1).

Part A (save as `raw/_parts/light1_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "light1", palm jab with the left (lead) hand; his right hand stays in its pocket. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking palm is fully extended toward the right and is the right-most part of the character; his head, hair, free hand and jacket hem stay behind it.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Anticipation: the left hand slides out of the pocket, flattening into an open palm, and pulls back to the chest; shoulders turn slightly away. The right hand stays in its pocket. Face: focused, mouth a calm line.
2. The left palm launches, elbow half extended, shoulders start rotating forward. Face: focused.
3. IMPACT: left arm FULLY EXTENDED horizontally to the right at the height of a shorter opponent's face (about his own chin-to-collar height), an open palm with the fingers pointing up and the HEEL OF THE PALM leading. No step forward: his weight stays back and the long arm does the work. The right hand still in its pocket. SMEAR: a short solid tapered streak behind the palm in navy-sleeve and skin colors (hard pixels, no blur). Face: focused, faint smile.
4. Same full extension without the smear, the palm a touch further; hair tips flick forward, the sleeve ripples. Face: focused.
MOTION: Minimal anticipation, a fast snap, an unhurried recovery. The right hand never leaves its pocket. Hair tips jolt forward on frame 3 and settle on frame 5.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light1_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "light1", palm jab with the left (lead) hand; his right hand stays in its pocket. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
5. Palm retracting halfway, elbow bending. Face: focused.
6. Left hand back at the hip, sliding toward the pocket. Face: lazy smile.
7. Back in the relaxed stance with both hands in the pockets (same as idle frame 1). Face: lazy smile.
MOTION: Minimal anticipation, a fast snap, an unhurried recovery. The right hand never leaves its pocket. Hair tips jolt forward on frame 3 and settle on frame 5.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A04 · `light2`: rear palm strike with the R (near) hand (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light2_vNN_A.png` and `raw/_parts/light2_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light2_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light1` strip (`raw/light1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light2).

Part A (save as `raw/_parts/light2_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "light2", palm strike with the right (rear, near) hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking palm is fully extended toward the right and is the right-most part of the character; his head, hair, free hand and jacket hem stay behind it.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Hips coil, torso twists back toward the viewer; both hands out of the pockets: the right palm cocked back beside the right shoulder, the left hand open in front of the chest; weight on the right leg. Face: focused.
2. Hips and shoulders rotate forward, the right palm driving forward past the chin. Face: focused.
3. IMPACT: right arm FULLY EXTENDED horizontally to the right at the height of a shorter opponent's chin, the palm heel forward with the fingers up, crossing in front of his body (fully visible); torso rotated almost to profile, right heel lifted, pivoting on the ball of the foot; left hand open in front of the chest. SMEAR: a solid streak trailing behind the right palm (no blur). Face: focused, a thin grin.
4. Same extension without the smear, the palm a touch further. Face: thin grin.
MOTION: Full hip rotation, no step forward. Hair tips jolt forward on frame 3 and settle on frame 5; the jacket hem swings with the hips.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light2_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "light2", palm strike with the right (rear, near) hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
5. Right palm retracting, torso unwinding. Face: focused.
6. Right hand back at the hip; the left hand dropping toward its pocket. Face: lazy smile.
7. Back in the relaxed stance with both hands in the pockets (same as idle frame 1). Face: lazy smile.
MOTION: Full hip rotation, no step forward. Hair tips jolt forward on frame 3 and settle on frame 5; the jacket hem swings with the hips.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A05 · `light3`: push kick to the stomach with the R (near) leg, hands in pockets (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light3_vNN_A.png` and `raw/_parts/light3_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light3_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light3).

Part A (save as `raw/_parts/light3_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "light3", front push kick to the stomach with the right (near) leg, both hands staying in his pockets. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking foot is fully extended toward the right and is the right-most part of the character; his head, hair, free hand and jacket hem stay behind it.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Weight shifts onto the left (front) leg; the right knee starts to lift, the jacket's side slit opening around the thigh. Both hands in the pockets. Face: focused.
2. Right knee chambered high (thigh horizontal, shin hanging down), torso leaning back slightly. Both hands in the pockets.
3. IMPACT: right leg FULLY EXTENDED straight forward to the right at the height of a shorter opponent's stomach (about his own hip height): the sole and heel push forward, toes pulled back. Torso leans back slightly. The supporting left leg is straight with the whole foot flat on the ground (he does NOT rise onto his toes). Both hands stay in his pockets. The jacket hem stays behind the knee. SMEAR: a solid arc from the chambered knee to the foot in trouser navy and shoe black (no blur). Face: focused, faint smile.
4. Same extension without the smear, the foot a touch further. Face: faint smile.
MOTION: Both hands stay in his pockets in every frame (pure arrogance). Only the kicking foot reaches far right on frames 3 and 4.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light3_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "light3", front push kick to the stomach with the right (near) leg, both hands staying in his pockets. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
5. Knee re-chambers, shin folding back.
6. Right foot sets down behind him.
7. Back in the relaxed stance (same as idle frame 1). Face: lazy smile.
MOTION: Both hands stay in his pockets in every frame (pure arrogance). Only the kicking foot reaches far right on frames 3 and 4.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A06 · `light4`: spinning roundhouse finisher with the R leg (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). **Save as: `raw/_parts/light4_vNN_A.png` and `raw/_parts/light4_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light4_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light4).

Part A (save as `raw/_parts/light4_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "light4", spinning roundhouse finisher with the right leg. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5. Poses 4 and 5 are the HIT frames: the striking foot is fully extended toward the right and is the right-most part of the character; his head, hair, free hand and jacket hem stay behind it.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Wind-up: the hands come out of the pockets, torso twists toward the viewer, arms coil in, knees bend. Face: grin.
2. Spinning on the left foot: his BACK now faces the viewer (the back of the tall collar, the jacket back and the blindfold's wraps at the back of his head are visible); right leg lifting; head turning to look over his shoulder at the target.
3. Back to the viewer, side-on: right knee chambered high and turned over (hip rolled); head spotting the target on the right; the jacket hem flares out with the spin.
4. IMPACT: right leg FULLY EXTENDED high and horizontal to the right, the shin and instep striking at the height of a shorter opponent's head (about his own shoulder height, so he barely leans); torso leaning back slightly, the left foot flat on the ground, arms flung out below head height. SMEAR: a big solid crescent from behind and below up to the foot (no blur). Face: grin with teeth.
5. Same extension without the smear; hair tips and the jacket hem whipping forward. Face: grin.
MOTION: The kicking foot never rises above the top of his hair. Only the kicking foot reaches far right on frames 4 and 5.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light4_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "light4", spinning roundhouse finisher with the right leg. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
6. Leg dropping, the rotation following through. Face: lazy smile.
7. Right foot sets down, regaining the stance.
8. Back in the relaxed stance with both hands in the pockets (same as idle frame 1). Face: lazy smile.
MOTION: The kicking foot never rises above the top of his hair. Only the kicking foot reaches far right on frames 4 and 5.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A07 · `heavy`: rising elbow launcher with the R (near) elbow (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). **Save as: `raw/_parts/heavy_vNN_A.png` and `raw/_parts/heavy_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/heavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#heavy).

Part A (save as `raw/_parts/heavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "heavy", rising elbow launcher with the right (near) elbow. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5. Poses 4 and 5 are the HIT frames: the right ELBOW leads (the forearm stays folded, the fist beside his ear) and is the right-most and highest part of his arm; nothing rises above the top of his hair.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Crouch starts: the hands come out of the pockets, knees bend, torso leans forward slightly, the right arm folds tight with the fist at the right collarbone and the elbow pointing down. Face: focused.
2. Deepest crouch: the right elbow low in front of his stomach, forearm folded up; left hand open forward, guarding; head down over the target; the jacket hem pooled over the thighs. Face: focused.
3. Legs explode upward; the right elbow starts rising in front of his stomach and chest. Face: focused.
4. IMPACT: rising, heels off the ground but the knees still bent; the right ELBOW drives UP AND FORWARD in front of him through the height of a shorter opponent's chin, the right fist beside his right ear; torso leaning back slightly, left arm pulled down to his side. SMEAR: a solid crescent along the elbow's path (no blur). Face: grin with teeth.
5. Peak, fully in the air, knees bent and feet hanging with pointed toes: the right elbow points STRAIGHT UP in front of his face, its tip level with the top of his hair and never above it; hair tips dragged down, jacket hem lifted. Face: grin.
MOTION: A short hop straight up. The elbow path passes through the space in front of his face, not beside his own head. No hand, elbow or foot ever goes above the top of his hair.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/heavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "heavy", rising elbow launcher with the right (near) elbow. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
6. Descending, the arm unfolding down, knees bending. Face: focused.
7. Landing crouch. Face: lazy smile.
8. Back in the relaxed stance with both hands in the pockets (same as idle frame 1). Face: lazy smile.
MOTION: A short hop straight up. The elbow path passes through the space in front of his face, not beside his own head. No hand, elbow or foot ever goes above the top of his hair.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A08 · `airLight1`: mid-air palm jab with the L hand (CORE)

5 frames, phases 1/2/2. **Save as: `raw/airLight1_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight1).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "airLight1", mid-air palm jab with the left hand. 5 frames, left to right. Poses 2 and 3 are the HIT frames: the striking palm is fully extended toward the right and is the right-most part of the character; his head, hair, free hand and jacket hem stay behind it.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, both hands open in a loose guard at chest height, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame); the jacket hem lifted slightly.
1. Air pose, the left palm pulled back to the chest, shoulders coiled. Face: focused.
2. IMPACT: left arm FULLY EXTENDED horizontally to the right at his own lower-chest height, an open palm with the fingers up and the heel of the palm leading; torso leaning forward slightly. SMEAR: a solid tapered streak behind the palm (no blur). Face: focused.
3. Same extension without the smear. Face: focused.
4. Palm pulling back. Face: focused.
5. Air pose. Face: lazy smile.
MOTION: All poses are in mid-air. Hair tips and the jacket hem lifted slightly by the air.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A09 · `airHeavy`: two-handed hammer spike (CORE)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/airHeavy_vNN_A.png` and `raw/_parts/airHeavy_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/airHeavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airheavy).

Part A (save as `raw/_parts/airHeavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "airHeavy", two-handed hammer spike. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames. Pose 3: both straight arms smash the clasped hands DOWN AND FORWARD, in front of and below his chest; the hands are the right-most part of his arms, and his feet stay lower than the hands. Pose 4: the same smash with the hands slightly lower, still in front of and below his chest and above his feet.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Both hands clasped together (fingers interlocked) raised behind his head, elbows bent up and back; torso arching back, knees tucked. Face: grin.
2. Wind-up peak: arched further back, the clasped hands behind his head at the height of the top of his hair and never above it. Face: grin.
3. IMPACT: torso whips forward, both straight arms swing DOWN AND FORWARD, the clasped hands in front of and below his chest on the right; knees bent with the feet hanging below the hands. SMEAR: a large solid crescent from overhead down to the hands (no blur). Face: grin with teeth.
4. Same smash pose without the smear, the hands slightly lower; hair tips whipping down. Face: focused.
MOTION: All poses are in mid-air. The feet stay the lowest point in every frame (the hands never go below them).

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/airHeavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "airHeavy", two-handed hammer spike. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
5. Arms rising, body uncurling. Face: focused.
6. Air pose: torso upright, both hands open in a loose guard at chest height, left knee forward and up, right leg hanging with pointed toes. Face: lazy smile.
MOTION: All poses are in mid-air. The feet stay the lowest point in every frame (the hands never go below them).

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

**Step 6 · reactions**

### A10 · `guard`: crossed-wrist high block (loop) (CORE)

2 frames, loops. **Save as: `raw/guard_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#guard).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "guard", casual crossed-wrist block. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. A casual high block: both forearms raised in front of his face and upper chest, CROSSED AT THE WRISTS, hands open with the palms facing out, fingers loose, elbows down; chin tucked, body leaning back slightly, knees bent more than in the stance, weight back, left foot forward. Face: focused, unbothered.
2. Identical but the body slightly lower (breathing); hair tips slightly shifted. Face: focused.
MOTION: Almost still: a tiny breathing bob only. Feet identical in both frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A11 · `hurtHigh`: hit in the face (CORE)

3 frames. **Save as: `raw/hurtHigh_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurthigh).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "hurtHigh", hit in the face. 3 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Hit in the face: head snapped back with the chin up, torso arched back, both arms flung back and out with open hands, one foot slipping. The blindfold stays on. Face: teeth gritted, mouth twisted in pain. Hair tips and jacket hem whipping forward, the hair crown jolted.
2. About a third recovered: head coming down, arms swinging back in. Face: pain.
3. Mostly recovered, still wincing, arms returning toward guard. Face: teeth gritted.
MOTION: Frame 1 is the peak of the reaction; it eases back over frames 2 and 3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A12 · `launched`: knocked flying backward (loop) (CORE)

2 frames, loops. **Save as: `raw/launched_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#launched).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "launched", knocked flying backward. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Knocked flying backward to the left by a big hit from the right. His body is tilted about 60 degrees back from upright and arched like a drawn bow with the belly up: his HIPS are the lowest point, near the middle of the pose; head and shoulders rise to the upper left; long legs bent and trailing forward to the right at about hip height; arms flung up and back with the elbows bent (not fully stretched). Face: mouth open in pain. Hair tips and jacket hem whipping to the right.
2. Arms and legs in slightly different flailing positions. Face: same.
MOTION: A diagonal, arched body, not fully horizontal. Keep each pose about one and a half times as wide as it is tall.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A13 · `down`: slammed down, then lying on the back (CORE)

2 frames. **Save as: `raw/down_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#down).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "down", slammed into the ground, then lying on his back. 2 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. His back slams flat onto the ground from the shoulders to the hips (head on the LEFT), knees bent and lifted toward the upper right by the bounce, arms flung out to the sides. Face: mouth open. The hair crown splashing out to the left. The blindfold stays on.
2. Lying flat on his back, head on the LEFT and feet on the RIGHT, arms out at his sides (not above his head), one knee slightly bent. Face: grimacing. The jacket hem splayed.
MOTION: Lowest body points on one shared baseline (the ground line). He is very long: keep one knee slightly bent so the whole body fits.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A14 · `getup`: kip-up (CORE)

5 frames. **Save as: `raw/getup_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `down` strip (`raw/down_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#getup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "getup", kip-up from lying on his back to standing. 5 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Lying on his back (head on the LEFT), knees pulled to his chest, palms planted beside his head with the fingers toward the shoulders. Face: mouth flat.
2. Legs kicking up and over toward the upper right, rolling onto his shoulders, hands pushing off. Face: focused.
3. Springing up into the air, torso tilted back, legs folding under him, arms out. Face: focused.
4. Landing in a crouch facing right, hands going toward his pockets. Face: focused.
5. His relaxed stance with both hands in the pockets (left foot forward, same as idle frame 1). Face: lazy smile.
MOTION: He faces right from frame 4 on. Hair tips and the jacket hem follow the flip.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

**Step 7 · specials**

### A15 · `charge`: calm power-up (loop) (CORE)

4 frames, loops. **Save as: `raw/charge_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#charge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "charge", calm power-up. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Calm power-up: wide stance with the feet well apart and the knees bent, torso upright, arms held slightly out from his sides and down, palms open facing the floor, fingers spread; head tilted slightly back. Face: calm lazy smile (no shouting). Hair tips and the jacket hem blown upward by a rising wind, sleeves fluttering. Whole body shifted slightly left.
2. Same, shifted slightly right; hair tips in a new flicker shape.
3. Shifted slightly left; palms slightly higher.
4. Shifted slightly right; the jacket hem in a new flicker shape.
MOTION: A tiny tremble of power; the feet stay planted. Draw NO aura, no glow and no energy: the game adds them.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A16 · `beamCharge`: charging the HOLLOW PURPLE (loop) (CORE)

3 frames, loops. **Save as: `raw/beamCharge_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamcharge). If refused, replace "Hollow Purple" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "beamCharge", charging the HOLLOW PURPLE, hands apart. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Wide grounded stance (left foot forward, knees bent), torso upright with the chest open to the viewer. BOTH ARMS HELD OUT APART at chest height, elbows slightly bent, palms up, fingers slightly curled as if each hand cradles an invisible orb: the left hand forward on the right side of the image, the right hand back on the left side of the image, both at the same height. The hands are open and EMPTY. Head turned toward the right. Face: focused, calm mouth. Hair tips and the jacket hem blown upward by a rising wind.
2. A tiny tremble: both hands slightly closer together; hair tips flicker.
3. Tremble back; fingers flex slightly (flows into frame 1).
MOTION: Draw NO orbs, no glow and no energy in his hands: the game adds a blue orb and a red orb there. Feet stay planted.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A17 · `beamFire`: firing the HOLLOW PURPLE (loop) (CORE)

3 frames, loops. **Save as: `raw/beamFire_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `beamCharge` strip (`raw/beamCharge_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamfire). If refused, replace "Hollow Purple" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "beamFire", firing the HOLLOW PURPLE with a palm thrust. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Deep lunge to the right: left leg forward and bent, right leg straight back, torso leaning forward slightly. RIGHT ARM THRUST STRAIGHT FORWARD to the right as an OPEN PALM (fingers up, palm facing right) at his own stomach height, the heel of the palm the right-most point of the character; the left hand pulled back to his left hip, open. Head behind the right shoulder. Face: mouth open, naming the technique. Hair tips, jacket hem and sleeves blown back to the left by the recoil.
2. Recoil: the whole body slightly back; hair tips flicker.
3. Pushing forward again, slightly forward (flows into frame 1).
MOTION: Draw NO beam and no glow: the game adds a huge purple beam from his palm. Feet stay planted.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A18 · `special`: LAPSE: BLUE (two-finger point) (CORE)

8 frames, phases 3/3/2. **Two images** (poses 1-3, then 4-8). **Save as: `raw/_parts/special_vNN_A.png` and `raw/_parts/special_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/special_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#special). The left hand stays in its pocket; draw **no blue anywhere** (the engine opens the vortex far in front of him). Pose 7 (f6) is the frame the player sees while the vortex pulls. If refused, replace "Lapse: Blue" per CHARACTER.md §9.

Part A (save as `raw/_parts/special_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "special", LAPSE: BLUE, a two-finger point that opens a gravity vortex in front of him. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 3. Poses 1 to 3 are the startup: no hit.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. The right hand slides out of the pocket and rises to his chest; weight settles back; the left hand stays in its pocket. Face: lazy smile.
2. The right arm extends forward; the INDEX AND MIDDLE FINGERS are extended together, the other fingers curled and the thumb tucked (a two-finger sign). Face: focused.
3. Right arm fully extended forward at his chest height, elbow almost straight, the two fingertips pointing straight at the target on the right. Face: focused.
MOTION: Draw NO vortex, no blue light and no glow anywhere (the game adds them, far in front of him). The left hand stays in its pocket in every frame.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/special_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "special", LAPSE: BLUE, a two-finger point that opens a gravity vortex in front of him. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 4 to 8 (the attached part A shows poses 1 to 3). This move has no punching hit: poses 4 to 6 are the release and flash by in the game; pose 7 is the frame the player sees while the vortex pulls, so make it the clearest.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
4. Release: the wrist snaps a quarter-turn so the palm faces up, the two fingers still pointing forward; hair tips and the jacket hem pulled slightly FORWARD (to the right), toward an invisible pull. Face: focused.
5. Same, the two fingers slightly crooked. Face: focused.
6. Same, the arm slightly drawn back. Face: focused.
7. Held pose: the arm still forward, palm up, the two fingers crooked in a slight "come here" curl; hair tips and the jacket hem still pulled slightly forward. Face: lazy smile.
8. The arm lowering, the right hand on its way back to the pocket. Face: lazy smile.
MOTION: Draw NO vortex, no blue light and no glow anywhere (the game adds them, far in front of him). The left hand stays in its pocket in every frame.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

**Step 8 · rest of the core**

### A19 · `dash`: hands-in-pockets glide (loop) (CORE)

2 frames, loops. **Save as: `raw/dash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#dash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "dash", low fast forward glide with his hands in his pockets. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Low fast forward glide with BOTH HANDS STILL IN HIS POCKETS: torso leaning about 45 degrees forward, chin up, left knee bent under the chest, right leg extended straight back with the toes dragging, elbows tucked back. Face: lazy smile. Hair tips and the jacket hem streaming back hard.
2. Stride slightly wider (left foot further forward, right foot further back); the jacket hem fluttering differently.
MOTION: Both hands stay in his pockets. No speed lines.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A20 · `jumpUp`: rising (loop) (CORE)

2 frames, loops. **Save as: `raw/jumpUp_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "jumpUp", rising in the air. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Rising: knees tucked high (left knee near the chest, right knee a little lower), torso upright; the RIGHT ARM raised up and forward with an open hand at about head height in front of his face (never above the top of his hair); the LEFT HAND IN HIS POCKET; head tilted slightly up. Face: lazy smile. Hair tips and the jacket hem dragged downward by the upward motion.
2. Knees and the right arm slightly lower; the jacket hem fluttering differently.
MOTION: Both poses are in mid-air.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A21 · `jumpFall`: falling (loop) (CORE)

2 frames, loops. **Save as: `raw/jumpFall_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpfall).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "jumpFall", falling. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Falling: legs extending down, the left leg slightly forward and bent, the right leg slightly back and bent, toes pointed down; the RIGHT ARM out forward for balance with an open hand below head height; the LEFT HAND IN HIS POCKET; head tilted down toward the right. Face: lazy smile. Hair tips lifted, the jacket hem lifted and flared.
2. The right arm slightly higher; hair tips and hem fluttering differently.
MOTION: Both poses are in mid-air.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A22 · `land`: landing (CORE)

2 frames. **Save as: `raw/land_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#land).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "land", landing. 2 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Impact crouch: knees deeply bent, torso leaning forward, the right arm out forward and down for balance, the left hand in his pocket; the hair crown squashed slightly, the jacket hem pooled over the thighs. Face: lazy smile.
2. Rising halfway back to the stance, the right hand drifting toward its pocket. Face: lazy smile.
MOTION: Feet flat on one shared baseline in both frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A23 · `win`: peace sign (loop) (CORE)

4 frames, loops. **Save as: `raw/win_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#win).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "win", victory pose with a peace sign. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Standing upright, body turned toward the viewer (about 50 degrees). The LEFT HAND IN HIS POCKET. The RIGHT HAND raised beside his face flashing a PEACE SIGN (index and middle fingers up and apart, palm toward the viewer) at cheek height, never above the top of his hair. Head tilted. Face: big grin. Blindfold on.
2. Hair tips and the jacket hem flutter in a light breeze. Face: big grin.
3. The peace sign tilts slightly (a playful wiggle). Face: big grin.
4. Settle back toward frame 1, flutter variant. Face: big grin.
MOTION: Feet planted in a relaxed upright stance. Loops gently.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

**Step 9 · optional**

### A24 · `backDash`: quick hop backward

3 frames. **Save as: `raw/backDash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#backdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "backDash", quick hop backward. 3 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Push-off backward: knees bent, weight on the ball of the left (front) foot pushing back; torso upright leaning back slightly; the hands come out of the pockets, open, loosely in front of the chest. Face: lazy smile.
2. In the air: both feet off the ground, knees tucked, torso leaning back, arms forward for balance; hair tips and the jacket hem whipping FORWARD (to the right).
3. Landing on the ball of the right (back) foot, the left foot about to touch, legs nearly extended, knees starting to absorb; hands drifting back toward the pockets. Face: lazy smile.
MOTION: He moves to the LEFT (backward) while still facing right.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A25 · `superDash`: homing super dash (loop)

2 frames, loops. **Save as: `raw/superDash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "superDash", homing super dash, flying palm first. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Flying to the right like a missile, the body angled about 30 degrees UPWARD (head and leading hand higher, hips lower), head locked on the target. RIGHT ARM thrust forward along the flight line with an OPEN PALM leading (heel of the palm forward, fingers up); the LEFT HAND IN HIS POCKET. KNEES BENT SHARPLY as if kneeling in the air: thighs angled down and a little forward from the hips, shins folded back so the feet trail behind; the knees are the lowest point, under the middle of the shape; toes pointed. Face: focused, smile corner. Hair crown flattened back, the jacket hem streaming straight back.
2. Knees bent slightly more and slightly apart; the jacket hem fluttering differently.
MOTION: Not stretched fully horizontal: each pose is a bit less than twice as wide as it is tall. No speed lines.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A26 · `jumpSquat`: pre-jump crouch

1 frame. **Save as: `raw/jumpSquat_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpsquat).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "jumpSquat", pre-jump crouch. 1 frame.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Deep crouch right before jumping: knees bent sharply, left foot forward, torso leaning forward; the RIGHT ARM swung down and back with an open hand, the LEFT HAND IN HIS POCKET; head up looking forward and up; the hair crown squashed slightly, the jacket hem pooled over the thighs. Face: lazy smile.
MOTION: Both feet flat on the ground.

LAYOUT: one single pose centered on a 1024x1024 square canvas, the whole body visible with a clear magenta margin. Make the character as large as the canvas allows.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A27 · `airLight2`: mid-air front kick with the R leg

5 frames, phases 1/2/2. **Save as: `raw/airLight2_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight2).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "airLight2", mid-air front kick with the right leg. 5 frames, left to right. Poses 2 and 3 are the HIT frames: the striking foot is fully extended toward the right and is the right-most part of the character; his head, hair, free hand and jacket hem stay behind it.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, both hands open in a loose guard at chest height, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame); the jacket hem lifted slightly.
1. Right knee chambered up to the chest. Face: focused.
2. IMPACT: right leg extends STRAIGHT FORWARD to the right, angled slightly down, at his own hip height, sole first; torso leans back slightly, the right arm out behind for balance, the left leg hanging as the lowest point. SMEAR: a solid arc to the foot (no blur). Face: focused.
3. Same extension without the smear. Face: focused.
4. Knee re-chambers. Face: focused.
5. Air pose. Face: lazy smile.
MOTION: All poses are in mid-air. The hanging left foot is the lowest point in frames 2 and 3.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A28 · `airLight3`: mid-air spinning heel kick with the L leg

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/airLight3_vNN_A.png` and `raw/_parts/airLight3_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/airLight3_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight2` strip (`raw/airLight2_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight3).

Part A (save as `raw/_parts/airLight3_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "airLight3", mid-air spinning heel kick with the left leg. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the striking heel is fully extended toward the right and is the right-most part of the character; his head, hair, free hand and jacket hem stay behind it.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, both hands open in a loose guard at chest height, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame); the jacket hem lifted slightly.
1. Body twists away (his back toward the viewer: the back of the collar and the blindfold's wraps visible), left knee chambered. Face: focused.
2. Spinning: hips turn over, head spots the target on the right, the jacket hem flaring.
3. IMPACT: left leg FULLY EXTENDED forward to the right, heel leading, at his own waist height; body leaning back, right knee tucked, arms flung (right back, left forward, below head height). SMEAR: a big solid crescent (no blur). Face: grin.
4. Same extension without the smear. Face: grin.
MOTION: All poses are in mid-air.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/airLight3_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "airLight3", mid-air spinning heel kick with the left leg. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, both hands open in a loose guard at chest height, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame); the jacket hem lifted slightly.
5. Leg folding back in. Face: focused.
6. Air pose. Face: lazy smile.
MOTION: All poses are in mid-air.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A29 · `block`: pushed back while blocking

2 frames. **Save as: `raw/block_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `guard` strip (`raw/guard_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#block).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "block", pushed back while blocking. 2 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Pushed back by a blocked hit: whole body leaning back slightly and slid back (right heel digging in), forearms still crossed at the wrists but jarred upward. Face: mouth tight, teeth showing (annoyed). Hair tips and the jacket hem blown back to the left.
2. Settling back into the guard, knees a little straighter than in the guard. Face: focused.
MOTION: Feet on one shared baseline.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A30 · `hurtLow`: hit in the stomach

3 frames. **Save as: `raw/hurtLow_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurtlow).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "hurtLow", hit in the stomach. 3 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Hit in the stomach: doubled over, torso bent forward, head down, both arms clutching his stomach, knees bent. Face: mouth open, teeth gritted. The hair crown swinging forward and down. Blindfold on.
2. About a third recovered. Face: pain.
3. Rising, wincing, one hand still on his stomach. Face: teeth gritted.
MOTION: Frame 1 is the peak; it eases back over frames 2 and 3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A31 · `spin`: tumbling backward (loop)

4 frames, loops. **Save as: `raw/spin_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#spin).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "spin", tumbling backward. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Tumbling head over heels backward through the air after a big hit, balled up with knees to his chest and arms bent in, tilted back 30 degrees, head at the upper left. Face: teeth gritted. Blindfold on.
2. Rotated 120 degrees: head pointing down-left.
3. Upside down: head at the bottom.
4. Rotated 300 degrees: head at the right, coming back upright.
MOTION: One full backward rotation, turning COUNTER-CLOCKWISE on screen. Hair tips and the jacket hem trail opposite to the rotation.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: seen from the side with his chest turned slightly toward the viewer, camera slightly above; he rotates in the picture plane, starting from a pose that faces right. His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A32 · `airRecover`: mid-air backflip recovery

3 frames. **Save as: `raw/airRecover_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airrecover).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "airRecover", mid-air backflip recovery. 3 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Tucked, tilted back about 60 degrees, knees to the chest. Face: mouth flat, regaining control.
2. Upside down, fully tucked.
3. Almost upright, unfolding: legs extending down, arms out for balance. Face: lazy smile.
MOTION: A backward flip, turning counter-clockwise on screen.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: seen from the side with his chest turned slightly toward the viewer, camera slightly above; he rotates in the picture plane, starting from a pose that faces right. His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A33 · `throw`: REVERSAL: RED in mid-air (finger flick)

4 frames, phases 1/1/2. **Save as: `raw/throw_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#throw). His release point is his **R fingertips**; draw **no orb** (the engine spawns the red orb at (192, 125)). If refused, replace "Reversal: Red" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "throw", REVERSAL: RED fired in mid-air with a finger flick. 4 frames, left to right. Pose 2 is the RELEASE frame: the right fingertips point at the target and are the right-most part of his arm.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
AIR POSE: torso upright, left knee bent forward and up, right leg hanging almost straight with the toes pointed (the lowest point in every frame); the LEFT HAND IN HIS POCKET in every frame.
1. Wind-up in mid-air: torso upright leaning back slightly; the RIGHT hand raised to his chest with the INDEX FINGER UP and the MIDDLE FINGER COCKED AGAINST THE THUMB (a flick about to snap). Face: focused.
2. FLICK: the right arm snaps forward and slightly down toward the right, elbow slightly bent, the index finger pointing at the target and the middle finger flicked forward off the thumb; torso leaning forward, legs trailing back and down. Face: mouth open, naming the technique. (Optional: a short solid streak along the hand's path.)
3. Recoil: the right arm kicks up and back with an open hand (below head height), the body drifting back; hair tips and the jacket hem blown back to the left. Face: focused.
4. Air pose, the right hand lowering. Face: lazy smile.
MOTION: All poses are in mid-air. Draw NO red orb, no glow, no energy: the game adds the red orb at his fingertips.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A34 · `vanish`: high-speed teleport

2 frames. **Save as: `raw/vanish_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#vanish).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "vanish", high-speed teleport. 2 frames, left to right.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Quick crouch: body squashed slightly, torso leaning forward, BOTH HANDS IN HIS POCKETS. Face: focused.
2. High-speed blur: the body stretched THINNER (not taller), up on the balls of his feet with the knees still slightly bent, hands in his pockets, hair tips and the jacket hem streaming up; the lower half broken into 3 or 4 solid horizontal slices shifted sideways by small different amounts (an afterimage effect made of solid shapes in his own colors, no transparency, no blur). Face: focused.
MOTION: Pose 2 is no taller than he is standing straight: nothing above the top of his hair. No smoke, no speed lines.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A35 · `stagger`: dizzy stagger (loop)

4 frames, loops. **Save as: `raw/stagger_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#stagger).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "stagger", dizzy stagger. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Dizzy: standing almost upright on wobbly knees, arms hanging loose out of the pockets, head lolling, leaning to the right. Face: mouth slack and slightly open. Blindfold on, the hair crown tilted.
2. Centered and upright. Face: slack.
3. Leaning to the left. Face: slack.
4. Centered. Face: slack.
MOTION: A slow drunken sway; the feet stay planted.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A36 · `ko`: knocked out

1 frame. **Save as: `raw/ko_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#ko).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "ko", knocked out. 1 frame.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Knocked out, lying flat on his back with his head on the LEFT and feet on the RIGHT, completely limp, arms splayed at his sides, one knee only slightly bent. Face: mouth slightly open, slack. The blindfold still on, the hair spread on the ground, the jacket hem splayed.
MOTION: Flat and long: the pose is about three times as wide as it is tall.

LAYOUT: one single pose centered on a 1536x1024 landscape canvas, the whole body visible with a clear magenta margin. Make the character as large as the canvas allows.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A37 · `intro`: hands-in-pockets shrug (loop)

4 frames, loops. **Save as: `raw/intro_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#intro).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "intro", pre-fight intro: a hands-in-pockets shrug. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Standing upright and tall, legs nearly straight, weight on the right leg (hip cocked), body turned toward the viewer (about 50 degrees), BOTH HANDS IN HIS POCKETS, chin raised, head tilted, looking down at the opponent on the right. Face: lazy cocky smile.
2. A loose shrug: shoulders rise slightly. Face: lazy smile.
3. Shoulders drop, head tilts slightly the other way. Face: lazy smile.
4. Settle back toward frame 1. Face: lazy smile.
MOTION: A light breeze moves the hair tips and the jacket hem. Feet planted.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A38 · `taunt`: looming tease (loop)

2 frames, loops. **Save as: `raw/taunt_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#taunt).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "taunt", taunt: looming over the opponent. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. BOTH HANDS IN HIS POCKETS, upper body leaning forward toward the right as if looming over a shorter opponent, head tilted. Face: wide teasing grin with teeth.
2. Head tilted to the other side, grin wider, the jacket hem flicks.
MOTION: Feet planted; only the head, shoulders and hem move.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

**Step 9 · kit specials (ADR 0009, optional)**

### A39 · `specialForward`: REVERSAL: RED (finger flick, recoil)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/specialForward_vNN_A.png` and `raw/_parts/specialForward_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/specialForward_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialforward). The left hand stays in its pocket; draw **no orb** (the engine spawns the red orb at (192, 125), so the fingertips sit there on pose 3). If refused, replace "Reversal: Red" per CHARACTER.md §9.

Part A (save as `raw/_parts/specialForward_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "specialForward", REVERSAL: RED, a finger flick that fires a red blast, with recoil. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Pose 3 is the RELEASE frame: the right fingertips point at the target and are the right-most part of the character. Pose 4 is the recoil.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Weight shifts back onto the right leg; the right hand comes out of the pocket and rises to his chest with the INDEX FINGER UP and the MIDDLE FINGER COCKED AGAINST THE THUMB; the left hand stays in its pocket. Face: focused.
2. The right arm extends toward the target at chest height, elbow slightly bent, the index finger pointing at the opponent's chest and the middle finger still cocked (a finger-gun). Face: focused.
3. FLICK: the middle finger snaps forward off the thumb, the index and middle fingers pointing at the target. (Optional: a tiny solid flick arc at the fingertips.) Face: mouth open, naming the technique.
4. RECOIL: the blast kicks the right arm UP AND BACK (an open hand with the fingers spread at about face height, never above the hair), torso leaning back, the back foot sliding back a little; hair tips and the jacket hem blown back to the left. Face: the smile returning.
MOTION: Draw NO red orb, no blast, no glow anywhere (the game adds them). The left hand stays in its pocket in every frame.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialForward_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "specialForward", REVERSAL: RED, a finger flick that fires a red blast, with recoil. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
5. Recoil settling, the arm lowering. Face: lazy smile.
6. The right hand dropping toward its pocket. Face: lazy smile.
7. Back in the relaxed stance with both hands in the pockets (same as idle frame 1). Face: lazy smile.
MOTION: Draw NO red orb, no blast, no glow anywhere (the game adds them). The left hand stays in its pocket in every frame.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A40 · `specialUp`: BLINK (teleport)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/specialUp_vNN_A.png` and `raw/_parts/specialUp_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/specialUp_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialup). The engine does not show this strip yet (Blink plays `vanish` today; MOVES_AND_VFX.md §3), so run it **last** among A39 to A42.

Part A (save as `raw/_parts/specialUp_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "specialUp", BLINK, a high-speed teleport that reappears above the opponent. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. No hit frames. Poses 3 and 4 are the teleport blur.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. Knees dip; the right hand comes up in front of his chin with the INDEX AND MIDDLE FINGERS raised together (a casual one-hand sign); the left hand in his pocket. Face: lazy smile.
2. Crouching deeper (body squashed slightly), torso leaning forward, the sign held at the chin. Face: focused.
3. High-speed blur: the body stretched THINNER (not taller), up on the balls of his feet with the knees slightly bent; the lower half broken into 3 or 4 solid horizontal slices shifted sideways by small different amounts; hair tips and the jacket hem streaming up. Face: focused.
4. Almost gone: the slices spread wider apart and the whole silhouette thinner still, but still a full-size body shape (not an empty frame). Face: focused.
MOTION: Solid shapes only, no transparency, no blur, no smoke, no speed lines. No pose is taller than he is standing straight.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialUp_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "specialUp", BLINK, a high-speed teleport that reappears above the opponent. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
5. Reappearing in mid-air high above the opponent: airborne, knees bent, the jacket hem flared up, head tilted DOWN toward the lower right (looking down at the opponent below him), the right hand open at his chest, the left hand in his pocket. Face: lazy smile.
6. The same air pose with the hem settling and the right hand drawn back slightly, ready to drop. Face: lazy smile.
MOTION: Solid shapes only, no transparency, no blur, no smoke, no speed lines. No pose is taller than he is standing straight.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A41 · `specialDown`: INFINITY (raised open palm)

4 frames, phases 2/1/1. **Save as: `raw/specialDown_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialdown). Pose 3 (f2) is held on screen for the whole counter window (about 0.4 s). If refused, replace "Infinity" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "specialDown", INFINITY, a calm counter stance with one open palm raised. 4 frames, left to right. No hit frames: pose 3 is held on screen for a long moment, so make it the cleanest pose.
BLINDFOLD: the black blindfold covers both of his eyes and brows in every pose; never draw his eyes in this strip. His expression shows through the mouth, jaw and head tilt.
1. The right hand slides out of the pocket; weight settles back onto the right leg; the left hand stays in its pocket. Face: lazy smile.
2. The RIGHT ARM raised forward across his body with an OPEN PALM facing the opponent (to the right) at chest-to-face height, fingers relaxed and slightly spread, elbow slightly bent; head tilted slightly up. Face: lazy smile.
3. The same stance held perfectly still (the counter): absolutely calm. Face: lazy smile.
4. The palm lowering, the hand returning to its pocket. Face: lazy smile.
MOTION: Draw NO barrier, no ripple, no glow: the game adds them. The left hand stays in its pocket in every frame.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

### A42 · `superPose`: DOMAIN EXPANSION: UNLIMITED VOID (eyes revealed, loop)

4 frames, loops, **eyes revealed**. **Save as: `raw/superPose_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superpose). **The only body strip with his eyes showing** (blindfold pushed up onto his forehead). If refused, replace "Domain Expansion: Unlimited Void" and "Six Eyes" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head (neat wraps, no hanging tails); it normally covers both eyes and his brows, but here it is pushed UP onto his forehead and his eyes are open. Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, blindfold, uniform, colors, proportions and character scale in every pose.

ANIMATION: "superPose", DOMAIN EXPANSION: UNLIMITED VOID hand sign with his eyes revealed. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: in this strip ONLY, the black blindfold is pushed UP onto his forehead (a black band across the forehead, the white hair still standing up above it) and BOTH EYES ARE OPEN: glowing bright sky-blue crystalline irises (#5fe2ff with a #1f8ee8 rim and pale #e2fbff inner rings), a small dark pupil, white eye whites (#f6f2f4), WHITE eyelashes and WHITE brows. Never pull the blindfold down around his neck.
1. Standing upright and tall, body turned about 45 degrees toward the viewer. The RIGHT HAND raised in front of his chest at chin height forming his ultimate hand sign: the MIDDLE FINGER CROSSED OVER THE INDEX FINGER, both raised, the other fingers curled, the back of the hand toward the right; the LEFT HAND IN HIS POCKET. Face: calm, superior half-smile, the glowing blue eyes looking at the opponent on the right.
2. Hair tips and the jacket hem stirring slightly in a rising wind.
3. The eye highlights shift by one pixel, the hand sign slightly higher.
4. Settle back toward frame 1.
MOTION: Almost still and imposing. Draw NO void, no stars, no glow, no aura: the game adds them. The hand stays below the top of his hair.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 215 px tall (soles to the top of the skull; the head matches approved model v03 and idle v02; the white hair adds about 18 px on top): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. He is so tall that his hands, elbows and feet must never rise above the top of his hair in any pose.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so the front of the blindfold and both cheeks show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Palm strikes, punches and kicks travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no blue vortex, no red orb, no purple beam, no aura, no energy effects, no extra characters.
```

---

## UI art

UI images are not packed into the sheet. Codex saves every candidate as **`raw/ui_<name>_vNN.png`**
(the sheet packer skips `ui_*` files) and adds a REVIEW.md row. After "approve gojo <name> vNN",
Codex **copies** that version to `ui/<name>.png`; the packer removes the magenta, crops and fits it to
the exact size (nearest / palette-preserving "mode" sampling) and writes it to
`public/characters/gojo/` (SPEC.md "Per-character UI images"). Rejected versions move to
`raw/_rejected/`. Attach `reference/model_sheet.png` and `reference/expressions.png` (panel 8 of the
expression sheet is the reference for the revealed eyes).

### U1 · Portrait (96×96)

**Save as: `raw/ui_portrait_vNN.png`** → approved copy `ui/portrait.png` (packed to 96×96, transparent).
Blindfold **on**.

```text
Pixel-art character portrait for a fighting-game HUD (anime fan-art).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and expression sheet exactly.

Head and shoulders, facing RIGHT in 3/4 view, cropped at the upper chest; the head fills most of the frame. The black blindfold covers both eyes and brows. A lazy, cocky one-sided smile, chin slightly up; the snow-white hair crown standing up above the band, the tall dark collar zipped up to the chin with the small silver zipper pull. Bold, readable shapes that still work when shrunk to 96 by 96 pixels.
SIZE: a 1024x1024 square canvas showing pixel art on a 96x96 art-pixel grid (every art pixel is a crisp square block about 10x10 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no border, no ground shadow, no effects.
```

### U2 · Super cut-in eye strip (480×128)

The DBFZ-style super-flash strip before Hollow Purple and the Domain (`src/characters/gojo.js`:
`cutinEyes: 'six'`). **His eyes are revealed here.** **Save as: `raw/ui_cutin_vNN.png`** → approved copy
`ui/cutin.png`. The packer removes the magenta above and below the band and fits the band to 480×128.
The face fills the strip edge to edge.

```text
Pixel-art "super move cut-in" for a fighting game (anime fan-art), an extreme close-up of the character's eyes.
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head (neat wraps, no hanging tails); it normally covers both eyes and his brows, but here it is pushed UP onto his forehead and his eyes are open. Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and expression sheet exactly (panel 8 of the expression sheet shows his eyes).

On a 1536x1024 landscape canvas, draw one horizontal band 1536 px wide and 410 px tall across the middle (ratio 3.75 to 1). Inside the band: an extreme close-up of his face from the lower edge of the lifted black blindfold (a black band along the very top of the strip) down to just below the nose, both eyes visible and wide open, face turned slightly toward the right. A handsome adult face, not chibi. Expression: calm, overwhelming confidence, the eyes slightly narrowed. Both eyes are glowing bright sky-blue crystalline irises (#5fe2ff with a #1f8ee8 outer ring, a thin #0f3c8a rim and pale #e2fbff inner rings around a small dark pupil, one or two white catch-lights), eye whites #f6f2f4, long WHITE eyelashes and WHITE brows. A few snow-white hair strands fall across the band. The face fills the band completely; a flat dark navy (#0d0f1c) background may show only around the eyes and brows, with a few tiny pale-blue glints at the edges.
SIZE: pixel art on a 480x128 art-pixel grid inside the band (every art pixel is a crisp square block about 3x3 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52. Plus for the glints only: #c6ecff #7ab8ff.
BACKGROUND: flat solid magenta #FF00FF above and below the band only. No text, no speed lines, no borders.
```

### U3 · Character select art (384×384)

**Save as: `raw/ui_select_vNN.png`** → approved copy `ui/select.png` (packed to 384×384, transparent).
Blindfold **on**. The blue vortex **is** allowed here (UI art, not a sprite).

```text
Pixel-art full-body character select illustration for a fighting game (anime fan-art).
CHARACTER: Satoru Gojo from Jujutsu Kaisen, about 28 years old, in his dark jujutsu-teacher uniform with his black blindfold, drawn as an anime fan-art sprite: a very tall, slender, broad-shouldered man with a relaxed, cocky confidence. Spiky snow-white hair pushed straight up and slightly back by the blindfold: a dense crown of upward spikes above the band, short white hair at the nape, two or three thin strands falling over the front of the band. A wide BLACK cloth blindfold wrapped around his head at eye level that completely covers both eyes and his brows (neat wraps, no hanging tails). Pale skin, a sharp jaw, a straight nose, thin lips in a lazy confident smile. A dark navy-black long-sleeved jacket with a tall stand-up collar zipped all the way up to his chin (it hides his neck), a center zipper with a small silver pull under the chin, the hem just below his hips with short side slits; matching loose dark navy-black trousers; black leather shoes. No buttons, no emblem, no hood.
PROPORTIONS: about 7 heads tall, serious adult anime proportions (the official modern TV-anime look): very tall and slender with broad shoulders, very long legs (the crotch at about half his height), long arms and large adult hands, a small head; relaxed, confident, cocky tone. He is the tallest fighter in the game, clearly taller than a 6.5-head teenage fighter, with the compact head size of the approved model v03 and idle v02. Not chibi, not super-deformed, no big head, no oversized hands or feet, not bulky, not western-realistic.
Match the attached model sheet and expression sheet exactly.

Full body facing RIGHT in 3/4 view, relaxed and tall: his RIGHT hand raised forward at chest height with the index and middle fingers extended together (a two-finger sign) and a small swirling blue gravity vortex just in front of the fingertips (draw it in this image: a dark navy eye in the center, bright blue spiral arms curling inward, a thin white rim, tiny debris specks being pulled in; hard pixels, no blur); his LEFT hand in his trouser pocket; a lazy, cocky smile; the black blindfold over his eyes; the white hair tips and the jacket hem stirred toward the vortex. The whole body fits inside the frame with a small margin.
SIZE: a 1024x1024 square canvas showing pixel art on a 384x384 art-pixel grid (every art pixel is a crisp square block about 2.7x2.7 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#08080c) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the layered spikes of the white hair, the blindfold band, the tall zipped collar, jacket sleeve and hem folds, trouser folds, knuckles), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 29 colors): outline #08080c; skin #fff4ec #fbe2d2 #e2ae96 #cc9a84 #a06a58; white hair (also teeth) #ffffff #f2f4fa #dde2ee #b4bccf #8a93ac #5e6680; black blindfold and shoes #2c2c3a #16161e; navy-black jacket and trousers #4a5478 #323858 #262b44 #1c2034 #0d0f1c; silver zipper #eef2fa #c8cede #8890a6; blue eyes (only where his eyes are uncovered) #e2fbff #5fe2ff #1f8ee8 #0f3c8a, eye whites #f6f2f4; mouth #5a1a22 #a84a52. Plus for the vortex only: #ffffff #c6ecff #7ab8ff #4aa8ff #2a6aff #0a1450.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no logo, no ground shadow.
```

---

## Extra · Optional Gojo effect art (engine support pending)

Specs in [MOVES_AND_VFX.md](MOVES_AND_VFX.md) §4. The engine does not read these yet, and the packer
never reads `_proposed/`. **Save as: `art/vfx/raw/_proposed/gojo_<effect>_vNN.png`** with a REVIEW.md
row per version. Generate them only after the core strips are packed.

### X1 · `gojo_blueVortex` (8 frames)

```text
Pixel-art game effect sprite strip: gojo_blueVortex, 8 frames, ONE horizontal row on a 1536x1024 landscape canvas, evenly spaced, each frame a square cell with the effect centered. An imploding gravity vortex: a dark navy eye in the center (#0a1450), bright blue spiral arms (#2a6aff, #4aa8ff, #7ab8ff) curling INWARD toward it, a thin pale rim (#c6ecff, #ffffff), tiny debris specks being pulled in; every frame rotated a little further clockwise so it loops. Hard pixels, no blur, no glow gradients, flat magenta #FF00FF background, no text.
```

### X2 · `gojo_redOrb` (6 frames)

```text
Pixel-art game effect sprite strip: gojo_redOrb, 6 frames, ONE horizontal row on a 1536x1024 landscape canvas, evenly spaced, each frame a square cell with the effect centered. A compact, dense red sphere of repelling force: a white-hot core (#fff0ec, #ffb0a0), a red body (#ff4050, #ff2038), a dark red edge (#c80e2a, #5a0614), a thin shell pulsing OUTWARD and a few short repulsion spikes; slightly different in every frame so it loops. Hard pixels, flat cel-shaded shapes, no blur, no gradients, flat magenta #FF00FF background, no text.
```

For `gojo_blueGlint`, `gojo_redBlast`, `gojo_purpleCore`, `gojo_infinityRipple`, `gojo_voidStar` and
`gojo_sixEyesGlint`, reuse the same wording with the description and colors from the MOVES_AND_VFX.md
§4 table. Tinted effects (`gojo_blueGlint`, `gojo_infinityRipple`, `gojo_sixEyesGlint`) are drawn in
white and light grey only.

---

## Fix-up prompts

### F1 · Redraw one frame

Attach the strip that has the bad frame (its latest `raw/<anim>_vNN.png`) plus `reference/model_sheet.png`.
**Save each redrawn attempt as `raw/<anim>_NN_fixMM.png`** (NN = the bad frame's 0-based file number,
MM = the attempt: pose 3 in the prompt, first attempt = `<anim>_02_fix01.png`, so attempts never
overwrite each other; the packer skips `*_fix<digits>.png` files, so a loose single frame never gets
packed as an animation of its own). Codex removes the background, pastes it over the bad pose at the
same head size, and saves the patched strip as the **next** version `raw/<anim>_vNN.png` (never edit an
existing version in place), with a REVIEW.md row ("frame N patched"). Then `npm run sprites gojo`.

```text
Using the attached sprite strip, redraw ONLY frame <N> as a single pose on a 1024x1024 flat solid magenta (#FF00FF) canvas, at exactly the same character scale, design, proportions (about 7 heads, the tallest fighter, not chibi) and palette as the other frames. Fix: <describe the problem, e.g. "the right palm must be fully extended horizontally toward the right at chin height, heel of the palm forward; it is the right-most point of the character">. Keep everything else about the pose identical. Facing right, 3/4 view, the black blindfold covering his eyes (unless this is the superPose strip), white hair standing up above the band, the tall collar zipped to the chin, no hand, elbow or foot above the top of his hair, crisp hard pixels, no anti-aliasing, no text, no ground shadow, no effects.
```

### F2 · Character drifted off-model

Regenerate the whole strip as the next version (`raw/<anim>_vNN.png`), attaching the drifted strip.

```text
In the attached strip the character drifted from the attached model sheet: <list, e.g. "his eyes are showing", "the blindfold turned into sunglasses", "the head is too big (chibi) in frames 4-6", "he is as short as a teenager", "the hair fell flat over the forehead", "a gold button appeared on the jacket", "his hands came out of his pockets in the idle">. Redraw the whole strip with exactly the same poses, fixing only those details: about 7 heads tall with very long legs, the black blindfold over both eyes and brows, snow-white hair standing up above the band, the tall collar zipped to the chin, the plain hip-length dark navy jacket with a center zipper, loose dark trousers, black shoes. Same layout, scale, palette and magenta background.
```

### F3 · Hit frames don't reach

Regenerate as the next version.

```text
In the attached strip, frames <a>-<b> are the hit frames but the <palm / elbow / foot> stops short. Redraw the strip with the same poses, except that in frames <a>-<b> the <limb> is fully extended horizontally toward the right edge of the image and is clearly the right-most part of the character. His head, hair, free hand and jacket hem stay behind it. Same scale, palette and magenta background.
```

### F4 · Inconsistent scale or baseline

Regenerate as the next version.

```text
In the attached strip the character changes size between frames and the feet are not on one baseline. Redraw it with exactly the same poses, the same head size in every frame (about 7 heads tall, the tallest fighter, not chibi), and every grounded foot on one shared horizontal line. Same palette and magenta background.
```

### Fix-up lines (append one to a regeneration)

| problem | add this line |
|---|---|
| chibi / big head / short legs | "About 7 heads tall: small head, very long legs, the crotch at half his height. Not chibi, not super-deformed." |
| too short (drawn like a 6.5-head teen) | "He is the tallest fighter: about 7 heads tall, long legs and a long torso, the same head size as before." |
| clipped at the top / arm raised too high | "No hand, elbow or foot above the top of his hair; keep the pose no taller than him standing straight." |
| wrong number of poses | "Exactly N poses in one row, no more, no less." |
| poses overlap or touch | "Leave a wide empty magenta gap between every pose." |
| size changes between poses | "Every pose is the same character size as pose 1; feet on one baseline." |
| facing left | "He faces RIGHT in every pose (his right arm nearest the viewer)." |
| strike goes up, down or into the screen | "The palm/kick travels straight to the right, horizontally, at <height> height." |
| blurry or painterly | "Clean hard-edged pixel art on one pixel grid, fewer colors, no anti-aliasing, no gradients." |
| shadow, text or effects added | "No ground shadow, no text, no effects (no vortex, no orb, no beam, no aura); plain flat magenta background." |
| eyes visible / blindfold missing | "The black cloth blindfold covers both eyes and brows completely (only the superPose strip shows his eyes)." |
| sunglasses or tails on the blindfold | "A wide black cloth band wrapped around the head at eye level, no sunglasses, no hanging tails." |
| hair flat, grey, blond or long | "Snow-white spiky hair pushed straight up above the blindfold band, short at the nape." |
| outfit drifts (school uniform, gold button, hood, open collar, white shirt) | "Match the attached model sheet exactly: a plain dark navy-black jacket with a tall collar zipped to the chin, a center zipper, hip-length; loose dark trousers; black shoes." |
| hands out of the pockets where they should be in | "Both hands stay in his trouser pockets in every pose of this strip (elbows hanging loosely out)." |
| two-finger sign or hand sign unclear | "Index and middle fingers extended straight together, the other fingers curled, the thumb tucked." (Domain sign: "the middle finger crossed over the index finger, both raised") |
| off-model face | "Attach expressions.png. Same face as the reference: sharp jaw, straight nose, thin lips, the blindfold over the eyes." |
