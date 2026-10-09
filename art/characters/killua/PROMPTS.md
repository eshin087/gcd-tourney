# Killua: image prompts (generation order)

> Copy-paste prompts for the image generator (Codex's built-in generator, or ChatGPT run by the user),
> in the order to run them, for **art spec v2**
> ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md): 256×256 cells) and **move system
> v2** ([ADR 0009](../../../docs/decisions/0009-move-system-v2.md)): Hunter x Hunter (2011) Chimera Ant /
> Godspeed-era design, **about 6 heads, a 182 px standing body** (a 13-year-old, smaller than the 200 px
> cast, never chibi). Each prompt is self-contained. The poses are the same as [ANIMATIONS.md](ANIMATIONS.md),
> described in words. Look, palette and fallback wording: [CHARACTER.md](CHARACTER.md). Pipeline and QA:
> [art/PIPELINE.md](../../PIPELINE.md). Review queue: [art/REVIEW.md](../../REVIEW.md). If anything here
> disagrees with the ADRs or [art/SPEC.md](../../SPEC.md), they win; if a prompt and ANIMATIONS.md
> disagree, ANIMATIONS.md wins.

> **Before the first strip (A01):** `art/manifest.json` must have a `killua` entry with his per-animation
> `bodyHeight` overrides ([ANIMATIONS.md "Body heights for the manifest"](ANIMATIONS.md#body-heights-for-the-manifest))
> and rows for the 4 optional move-system-v2 animations. Without them `npm run sprites killua` packs him at
> the older fighters' size and skips A39-A42. If the entry is missing, ask Claude (S1 and S2 can run
> before that).

## How to use (Codex + user)

1. **Codex generates every image** with its built-in image generator and attaches the approved
   references as image inputs (the "Attach" line of each prompt). The user can still run a prompt by
   hand in ChatGPT; the file is saved and reviewed the same way.
2. **One thread per character, run in parallel with the others.** Use a separate Codex thread (or
   chat) named "GCD Killua sprites"; S1 for Killua does not wait for anyone. **Never put two characters
   in one image, and never attach another character's references to a Killua prompt.** Start a fresh
   thread (re-attach the references; every prompt is self-contained) when it drifts or after about 6
   strips.
3. **Run S1 and S2 first** (model sheet, expressions). Iterate until the user approves one version of
   each. Codex then **copies** the approved version to the fixed name: `reference/model_sheet.png`,
   `reference/expressions.png`. As identity references, later prompts attach only approved fixed-name
   files (`model_sheet.png`, `expressions.png`, `idle_approved.png`) and the approved strips listed
   under "Attach". Two exceptions: (a) a Part B block attaches Part A of the same version; (b) a retry of
   S1/S2 or a strip fix may attach the candidate being corrected, together with the list of changes.
   Never attach `reference/source/` (copyrighted) or another character's files.
4. **Run the strips in `step` order** (the index below = `art/manifest.json` steps). A01–A23 are the
   CORE set: the game switches to the new art only when all of them are packed. A24–A38 are optional
   polish. **A39–A42 are the optional move-system-v2 animations** (ADR 0009); for Killua they carry
   his Rhythm Echo strike, Thunderbolt leap, Godspeed power-up and the super pose, so run them early in
   step 9. Never start a step while the step before it has no approved version.
5. **Quick check before saving** (30 seconds): right pose count, facing right, **about 6 heads and a
   slim 13-year-old build** (not chibi, not a toddler, not an adult), fluffy silver-white hair, blue cat
   eyes (dark assassin eyes only where the prompt asks), the outfit (loose long-sleeved purple shirt with
   the dark navy rolled collar, white cuffs and white hem showing, baggy dark navy shorts above the
   knees, bare shins, purple-and-white high-top sneakers), claws only on (CLAW) poses, **no lightning
   drawn**, flat magenta, no shadow or text. If it fails, regenerate; an attempt that was never saved
   needs no number.
6. **Save every image with a version number** (ADR 0007): the "Save as" name with `_vNN`, where
   `NN` is two digits and **1 + the highest version ever used for that asset** (look in the folder,
   `raw/_parts/`, its `_rejected/` subfolder and the REVIEW.md rows). Make up to 3 attempts per round
   and save only the best one. The first image of an asset is `v01`. Never overwrite, reuse or delete a
   version: the **highest number is always the latest candidate**, so the user and Claude can find it
   at a glance. Don't crop or rename frames; Codex and the packer do that.
7. **Long strips come in two images.** Every strip with 6 or more frames has a Part A and a Part B
   block (4 or 5 figures per image stay big enough). Save part A as `raw/_parts/<anim>_vNN_A.png`, run
   part B with part A attached, save it as `raw/_parts/<anim>_vNN_B.png` (same NN), then stitch both
   into `raw/<anim>_vNN.png` (art/PIPELINE.md "Long strips (parts)"). If only one part needs a redo, the
   redo is a new version: save it under the next NN and copy the kept part under the same new NN, so
   both halves of a version always belong together. One REVIEW.md row covers the stitched strip.
8. **Queue it for review:** add a row at the **top** of [art/REVIEW.md](../../REVIEW.md) (date,
   `killua`, asset, file link, version, status `needs review`, what changed since the previous version
   including any prompt tweak, QA notes). In the same edit set the asset's `version` in
   `art/manifest.json` (status `raw` if it was `todo`) and update `art/TRACKER.md`. Re-read REVIEW.md
   right before editing it: other threads edit it too. For strips, run `npm run sprites killua` first:
   the packer uses the **highest** `_vNN` strip per animation and prints which file it used (check it
   is the one just saved). Check it in game (http://127.0.0.1:5188/?fight=killua,killua&mode=solo&art=custom&debug)
   or in the Sprite Lab (http://127.0.0.1:5188/sprites.html?c=killua, click "Load full sheet (.png +
   .json)…" and pick `public/characters/killua/sheet.png` and `anims.json`; otherwise it shows the baked
   placeholder), run the QA notes in ANIMATIONS.md (head about 30 px, standing body about 182 px, feet
   on the pivot, contact zones, claws only where listed, no lightning, no chibi frame) and write the
   result in the QA notes. Then stop and show the user the latest version with a short verdict
   (identity / proportions and pose / technical).
9. **The user decides** ("approve killua idle v03" / "reject killua light2 v02: claw too low", in chat
   or in REVIEW.md). Approved: the row becomes `approved`, `approvedVersion` = NN in the manifest,
   and Codex copies references to their fixed names (`reference/model_sheet.png`,
   `reference/expressions.png`, the approved idle strip to `reference/idle_approved.png`, UI to
   `ui/<name>.png`). Rejected: the row becomes `rejected` with the reason, the file moves to the
   `_rejected/` folder next to it (`raw/_rejected/`, `reference/_rejected/`), and the next version
   is generated with the problem called out (fix prompts F1-F4 at the bottom).
10. **If the generator refuses** a prompt that names the character: replace the `CHARACTER:` line
    with the fallback below, and swap the names using the replacement table in CHARACTER.md §9
    (Narukami → "a lightning bolt shot from his open palm", Godspeed → "a lightning-speed mode", and so
    on; also drop "Hunter x Hunter (2011)" from the PROPORTIONS line). Never name the original artist or
    studio.

### Fallback CHARACTER line (no names)

```text
CHARACTER: an original character inspired by classic shonen adventure anime, fan-art sprite for a personal non-commercial game project: a slim, wiry, pale boy of about 13 with a cold, detached, catlike air, drawn with serious anime proportions (about 6 heads tall, shorter and slimmer than an adult, not chibi). Messy, fluffy, spiky silver-white hair that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands; when he strikes, his fingers stiffen and his fingernails grow into short, sharp, pale claws.
```

## Index

Run the prompts top to bottom: `step` is the generation order from `art/manifest.json` (the same
steps as art/PIPELINE.md "Generation order" and art/TRACKER.md). Codex picks the lowest `step` with
no approved version. All paths are relative to `art/characters/killua/`; `vNN` = the next free
version (`v01` first).

| step | id | asset | frames | images | CORE | save as (versioned; NN = next free version) |
|---|---|---|---|---|---|---|
| 1 | S1 | model sheet (5 views incl. a true side profile, 2 hand close-ups, palette swatches) | | 1 | | `reference/model_sheet_vNN.png` → approved copy `reference/model_sheet.png` |
| 2 | S2 | expression sheet (8 heads incl. assassin eyes) | | 1 | | `reference/expressions_vNN.png` → approved copy `reference/expressions.png` |
| 3 | A01 | `idle`: loose assassin stance (breathing loop) | 8 | 2 | **CORE** | `raw/_parts/idle_vNN_A.png` + `raw/_parts/idle_vNN_B.png` → `raw/idle_vNN.png` → approved copy `reference/idle_approved.png` |
| 4 | A02 | `run`: low silent sprint (loop) | 8 | 2 | **CORE** | `raw/_parts/run_vNN_A.png` + `raw/_parts/run_vNN_B.png` → `raw/run_vNN.png` |
| 5 | A03 | `light1`: knife-hand thrust with the L (lead) hand | 7 | 2 | **CORE** | `raw/_parts/light1_vNN_A.png` + `raw/_parts/light1_vNN_B.png` → `raw/light1_vNN.png` |
| 5 | A04 | `light2`: claw swipe with the R (near) hand | 7 | 2 | **CORE** | `raw/_parts/light2_vNN_A.png` + `raw/_parts/light2_vNN_B.png` → `raw/light2_vNN.png` |
| 5 | A05 | `light3`: snap kick to the stomach with the R (near) leg | 7 | 2 | **CORE** | `raw/_parts/light3_vNN_A.png` + `raw/_parts/light3_vNN_B.png` → `raw/light3_vNN.png` |
| 5 | A06 | `light4`: spinning high roundhouse finisher with the R leg | 8 | 2 | **CORE** | `raw/_parts/light4_vNN_A.png` + `raw/_parts/light4_vNN_B.png` → `raw/light4_vNN.png` |
| 5 | A07 | `heavy`: rising claw uppercut launcher with the R hand | 8 | 2 | **CORE** | `raw/_parts/heavy_vNN_A.png` + `raw/_parts/heavy_vNN_B.png` → `raw/heavy_vNN.png` |
| 5 | A08 | `airLight1`: mid-air knife-hand thrust with the L hand | 5 | 1 | **CORE** | `raw/airLight1_vNN.png` |
| 5 | A09 | `airHeavy`: double-hand hammer spike (also the THUNDERBOLT slam) | 6 | 2 | **CORE** | `raw/_parts/airHeavy_vNN_A.png` + `raw/_parts/airHeavy_vNN_B.png` → `raw/airHeavy_vNN.png` |
| 6 | A10 | `guard`: cross-arm block (loop) | 2 | 1 | **CORE** | `raw/guard_vNN.png` |
| 6 | A11 | `hurtHigh`: hit in the face | 3 | 1 | **CORE** | `raw/hurtHigh_vNN.png` |
| 6 | A12 | `launched`: knocked flying backward (loop) | 2 | 1 | **CORE** | `raw/launched_vNN.png` |
| 6 | A13 | `down`: slammed down, then lying on the back | 2 | 1 | **CORE** | `raw/down_vNN.png` |
| 6 | A14 | `getup`: kip-up | 5 | 1 | **CORE** | `raw/getup_vNN.png` |
| 7 | A15 | `charge`: powering up (loop) | 4 | 1 | **CORE** | `raw/charge_vNN.png` |
| 7 | A16 | `beamCharge`: charging the LIGHTNING PALM (loop) | 3 | 1 | **CORE** | `raw/beamCharge_vNN.png` |
| 7 | A17 | `beamFire`: firing the LIGHTNING PALM (loop) | 3 | 1 | **CORE** | `raw/beamFire_vNN.png` |
| 7 | A18 | `special`: NARUKAMI, lightning bolt from the palm (ground) | 8 | 2 | **CORE** | `raw/_parts/special_vNN_A.png` + `raw/_parts/special_vNN_B.png` → `raw/special_vNN.png` |
| 8 | A19 | `dash`: low forward dash (loop) | 2 | 1 | **CORE** | `raw/dash_vNN.png` |
| 8 | A20 | `jumpUp`: rising (loop) | 2 | 1 | **CORE** | `raw/jumpUp_vNN.png` |
| 8 | A21 | `jumpFall`: falling (loop) | 2 | 1 | **CORE** | `raw/jumpFall_vNN.png` |
| 8 | A22 | `land`: landing | 2 | 1 | **CORE** | `raw/land_vNN.png` |
| 8 | A23 | `win`: hands behind his head (loop) | 4 | 1 | **CORE** | `raw/win_vNN.png` |
| 9 | A24 | `backDash`: quick catlike hop backward | 3 | 1 |  | `raw/backDash_vNN.png` |
| 9 | A25 | `superDash`: homing super dash (loop) | 2 | 1 |  | `raw/superDash_vNN.png` |
| 9 | A26 | `jumpSquat`: pre-jump crouch | 1 | 1 |  | `raw/jumpSquat_vNN.png` |
| 9 | A27 | `airLight2`: mid-air snap kick with the R leg | 5 | 1 |  | `raw/airLight2_vNN.png` |
| 9 | A28 | `airLight3`: mid-air spinning heel kick with the L leg | 6 | 2 |  | `raw/_parts/airLight3_vNN_A.png` + `raw/_parts/airLight3_vNN_B.png` → `raw/airLight3_vNN.png` |
| 9 | A29 | `block`: pushed back while blocking | 2 | 1 |  | `raw/block_vNN.png` |
| 9 | A30 | `hurtLow`: hit in the stomach | 3 | 1 |  | `raw/hurtLow_vNN.png` |
| 9 | A31 | `spin`: tumbling backward (loop) | 4 | 1 |  | `raw/spin_vNN.png` |
| 9 | A32 | `airRecover`: mid-air backflip recovery | 3 | 1 |  | `raw/airRecover_vNN.png` |
| 9 | A33 | `throw`: NARUKAMI, lightning bolt from the palm in mid-air | 4 | 1 |  | `raw/throw_vNN.png` |
| 9 | A34 | `vanish`: high-speed teleport (also the start of RHYTHM ECHO) | 2 | 1 |  | `raw/vanish_vNN.png` |
| 9 | A35 | `stagger`: dizzy stagger (loop) | 4 | 1 |  | `raw/stagger_vNN.png` |
| 9 | A36 | `ko`: knocked out | 1 | 1 |  | `raw/ko_vNN.png` |
| 9 | A37 | `intro`: hands in pockets, bored (loop) | 4 | 1 |  | `raw/intro_vNN.png` |
| 9 | A38 | `taunt`: tongue-out "akanbe" (loop) | 2 | 1 |  | `raw/taunt_vNN.png` |
| 9 | A39 | `specialForward`: RHYTHM ECHO claw strike | 7 | 2 | opt v2 | `raw/_parts/specialForward_vNN_A.png` + `raw/_parts/specialForward_vNN_B.png` → `raw/specialForward_vNN.png` |
| 9 | A40 | `specialUp`: THUNDERBOLT rising leap | 6 | 2 | opt v2 | `raw/_parts/specialUp_vNN_A.png` + `raw/_parts/specialUp_vNN_B.png` → `raw/specialUp_vNN.png` |
| 9 | A41 | `specialDown`: GODSPEED activation | 4 | 1 | opt v2 | `raw/specialDown_vNN.png` |
| 9 | A42 | `superPose`: GODSPEED: WHIRLWIND activation pose | 4 | 1 | opt v2 | `raw/superPose_vNN.png` |
| 11 | U1 | portrait 96×96 | | 1 | | `raw/ui_portrait_vNN.png` → approved copy `ui/portrait.png` |
| 11 | U2 | super cut-in eye strip 480×128 | | 1 | | `raw/ui_cutin_vNN.png` → approved copy `ui/cutin.png` |
| 11 | U3 | character select art 384×384 | | 1 | | `raw/ui_select_vNN.png` → approved copy `ui/select.png` |
| extra | X1, X2 | optional Killua effect art (engine support pending, ENG-014) | | 1 each | | `art/vfx/raw/_proposed/killua_<effect>_vNN.png` |

Within step 9, Killua tip: run A39 `specialForward`, A41 `specialDown`, A42 `superPose`, A33 `throw` and
A37 `intro` first; they show up in almost every match. A39-A42 are listed last only because they are
the new optional names (ADR 0009); they still belong to step 9.

---

## S1 · Model sheet

Attach: nothing the first time (never another character's image). For a later version you may attach
the best earlier Killua `_vNN` candidate together with a short list of what to change.
**Save as: `reference/model_sheet_vNN.png`** (the first one is `v01`). After "approve killua
model_sheet vNN", Codex copies that version to `reference/model_sheet.png`.

```text
Character model sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.

Draw the same character 5 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear gaps between them:
1. FRONT view, relaxed neutral stand, arms slightly away from the body, facing the viewer, hands relaxed with normal fingertips;
2. 3/4 view facing RIGHT (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), relaxed neutral stand: this is the main game view;
3. TRUE SIDE PROFILE facing RIGHT: turned exactly 90 degrees, only ONE eye visible, nose, lips and chin in silhouette pointing straight to the right, the far arm and leg hidden behind the near ones, the fluffy hair tufts in profile; NOT a 3/4 view;
4. BACK view: the fluffy spiky back of his silver-white hair, the dark navy rolled collar from behind, the back of the loose purple shirt with the white undershirt hem showing below it, the shorts and the backs of the high-top sneakers;
5. 3/4 view facing RIGHT in his fighting stance: loose and low, knees bent, weight on the balls of his feet, left foot forward, right foot back, the open left hand forward at chin-to-chest height with loosely curled fingers, the open right hand low beside his right hip, a cold, bored, half-lidded stare.
Below the figures, on the left: two close-ups of his right hand at twice the figure scale, side by side: (a) relaxed and open, fingers loosely curled, normal fingertips; (b) the assassin claw: fingers stiff and slightly hooked, knuckles tense, the fingernails grown into short, sharp, pale silver-white claws about as long as the last finger joint. On the right of the same row: one row of 30 small square color swatches (no text), one per palette color, in the palette order listed below.
Show clearly in every view: fluffy, spiky silver-white hair; sharp upturned blue cat eyes (where visible); the dark navy rolled collar; the loose long-sleeved purple shirt with white cuffs at the wrists and the white undershirt hem below the purple hem; baggy dark navy shorts ending just above the knees; bare shins; purple high-top sneakers with white soles, toe caps and laces; a slim, wiry body about 6 heads tall.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (shorter than the other fighters' 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. On this sheet draw at 2x: every art pixel is a 2x2 block, so the standing body (soles to top of the skull) is about 364 px tall on the canvas (the head about 60 px), the hair on top of that.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no labels, no ground shadow, no floor, no effects, no lightning.
```

Check before saving (and write the result in the REVIEW.md QA notes): **measure the proportions**
(standing body height ÷ head height ≈ 6: not 4 to 5 (chibi), not 6.5 or more (adult)); slim 13-year-old
build; silver-white fluffy tufts (not yellow, not grey); blue upturned cat eyes; view 3 is a **true
profile** (one eye); purple long-sleeved shirt with the dark navy rolled collar; white cuffs and white
hem visible; baggy navy shorts above the knees; purple high-tops with white soles, toe caps and laces;
the claw close-up shows pale nails (not metal, not glowing); no props; flat magenta; at most 48 colors
on the character. Codex notes what changed between versions in `reference/notes.md`.

## S2 · Expression sheet

Attach: `reference/model_sheet.png`. **Save as: `reference/expressions_vNN.png`**. After approval Codex
copies it to `reference/expressions.png`.

```text
Expression sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet exactly (same face shape, hair, collar and colors).

Draw 8 head-and-shoulders close-ups in a 4 by 2 grid on a 1536x1024 landscape canvas, every head facing RIGHT in 3/4 view (both eyes visible), all at the same scale, with clear gaps between them:
1. cold, bored neutral stare (his default): half-lidded, upper lids low and flat, brows level, mouth a small flat line;
2. cat grin: eyes curved and half-closed, a small cat-like mouth shaped like a rounded w, one tiny pointed fang, cheeky;
3. focused: brows down at the inner ends, eyes narrowed, mouth tight;
4. fierce shout: mouth open showing teeth, one small pointed fang and the dark mouth interior, brows down;
5. pain: eyes squeezed shut, teeth gritted;
6. tongue-out taunt: his right index finger pulls down the lower eyelid of his right eye and he sticks his tongue out (#e27d8c);
7. dazed: half-lidded unfocused eyes, mouth slightly open, hair tufts messy over the eyes;
8. assassin eyes: the irises turn dark (#1d4c94) and empty, the pupils shrink to tiny black points, no white catch-light, the upper lids low and flat with a shadow over them, an expressionless mouth: cold killing intent.
Eyes 1 to 7: blue iris (#3d8fe0 with a lighter top band #9ad6ff and a dark rim #1d4c94), black pupil, one white catch-light pixel, upturned outer corners like a cat's. The fluffy silver-white tufts frame every face; the dark navy rolled collar at the base of the neck.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. The head is about 30 px tall in the game (chin to the top of the skull); on this sheet draw at 4x: every art pixel is a 4x4 block.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything. No text, no numbers, no labels, no lightning.
```

---

## Animation strips

Attach to every strip prompt: `reference/model_sheet.png`, `reference/expressions.png` and, from A02
on, `reference/idle_approved.png`, plus any extra approved strip listed under "Attach" (the move it
continues or shares a hand shape with: `light2` after `light1`, the air attacks after `airLight1`,
`getup` after `down`, `beamFire` after `beamCharge`, `block` after `guard`, `throw` after `special`,
`specialForward` and `superPose` after `light2` (claw), `specialUp` after `airHeavy`, `specialDown`
after `charge`). Strips with 6 or more frames come as **two images** (Part A and Part B). Every block
restates the proportions, size, palette and rules, so it also works in a fresh thread. Every "Save as"
name gets the next free `_vNN`.

**Step 3 · idle**

### A01 · `idle`: loose assassin stance (breathing loop) (CORE)

8 frames, loops. **Two images** (poses 1-4, then 5-8). **Save as: `raw/_parts/idle_vNN_A.png` and `raw/_parts/idle_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/idle_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#idle). **After the user approves it, Codex copies the stitched strip to `reference/idle_approved.png`**; every later prompt attaches that file.

Part A (save as `raw/_parts/idle_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and expression sheet exactly: same face, hair, outfit, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", loose assassin stance (breathing loop). 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4. It loops: the last frame must flow smoothly back into the first.
1. KEY POSE. Loose assassin stance: knees bent about 25 degrees, weight on the balls of both feet with the heels just touching, feet a bit wider than the shoulders, left foot forward with the toes pointing right, right foot back and turned out about 40 degrees. Torso leans slightly forward, a little hunched, chest turned about 35 degrees toward the viewer, shoulders low and relaxed. Left arm forward with the elbow bent, the open left hand at chin-to-chest height with the fingers loosely curled, palm down. Right arm hanging low, the open right hand beside the right hip with the fingers loosely curled. Head slightly down, eyes looking up from under the tufts to the right. Face: cold, bored, half-lidded stare, mouth a small flat line. The loose purple shirt hangs over the waistband with the white hem showing.
2. Inhale: chest and shoulders rise very slightly. Face: cold. Hair tufts not moved yet (lag).
3. Top of the breath, slightly higher; the left-hand fingers flex once; the tufts settle slightly back. Face: cold.
4. Hold the top; one forehead tuft drifts. Face: cold.
MOTION: A very small breathing bob done with the knees and chest only. The FEET ARE IDENTICAL in all 8 frames (they never slide). Hair tufts lag the body by one frame; the loose shirt barely moves. Normal fingertips, no claws.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/idle_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and expression sheet exactly: same face, hair, outfit, colors and proportions. This idle strip becomes the reference for every later animation, so make the design as clean and on-model as possible.

ANIMATION: "idle", loose assassin stance (breathing loop). 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4). It loops: the last frame must flow smoothly back into the first.
5. Exhale, halfway down. Face: cold.
6. Same height as frame 1. Face: cold.
7. Lowest point: knees bend a little more, shoulders drop slightly; the tufts bounce, the shirt hem settles. Face: cold.
8. Rising back toward frame 1 (flows straight into frame 1). Face: cold.
MOTION: A very small breathing bob done with the knees and chest only. The FEET ARE IDENTICAL in all 8 frames (they never slide). Hair tufts lag the body by one frame; the loose shirt barely moves. Normal fingertips, no claws.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

**Step 4 · run**

### A02 · `run`: low silent sprint (loop) (CORE)

8 frames, loops. **Two images** (poses 1-4, then 5-8). **Save as: `raw/_parts/run_vNN_A.png` and `raw/_parts/run_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/run_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#run).

Part A (save as `raw/_parts/run_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "run", low silent sprint. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4. It loops: the last frame must flow smoothly back into the first.
1. Contact: left foot reaching forward, the ball of the foot touching down well ahead of the hips; right leg extended back, toes pushing off. Face: cold, mouth closed.
2. Down: weight on the left leg, knee bent deepest, body at its lowest; right heel lifting behind.
3. Passing: left leg under the hips, right knee swinging forward past it; body rising.
4. Flight: both feet off the ground; right knee forward and up, left leg extended straight back with pointed toes; body at its highest; longest stride.
MOTION: Torso pitched about 35 degrees forward for the whole cycle, head up and level. The arms are held LOW and slightly back, elbows a little bent, open loose hands trailing beside his hips; they swing only slightly (no arm pumping, not a ninja run with straight arms). Light, long strides on the balls of the feet. Hair tufts swept back to the left; the loose shirt and its white hem flap back; the shorts flap.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/run_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "run", low silent sprint. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4). It loops: the last frame must flow smoothly back into the first.
5. Contact (mirror of frame 1): right foot reaching forward to touch down, left leg pushing off behind.
6. Down (mirror of frame 2): weight on the right leg, body lowest.
7. Passing (mirror of frame 3): left knee swinging forward.
8. Flight (mirror of frame 4): left knee forward and up, right leg extended back. Flows back into frame 1.
MOTION: Torso pitched about 35 degrees forward for the whole cycle, head up and level. The arms are held LOW and slightly back, elbows a little bent, open loose hands trailing beside his hips; they swing only slightly (no arm pumping, not a ninja run with straight arms). Light, long strides on the balls of the feet. Hair tufts swept back to the left; the loose shirt and its white hem flap back; the shorts flap.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

**Step 5 · core attacks**

### A03 · `light1`: knife-hand thrust with the L (lead) hand (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light1_vNN_A.png` and `raw/_parts/light1_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light1_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light1).

Part A (save as `raw/_parts/light1_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light1", knife-hand thrust with the left (lead) hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are the HIT frames: the striking hand or foot is fully extended toward the right and is the right-most part of the character; head, hair tufts, collar, shirt and its white hem stay behind it.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Anticipation: the left hand pulls back toward the chest, fingers straightening and pressing together; weight sinks a touch. Face: cold.
2. The left knife-hand launches, elbow half extended, the nail tips sharpening (CLAW). Face: focused.
3. IMPACT (CLAW): left arm FULLY EXTENDED straight to the right, raised to the height of his own brows (where a taller opponent's face is), fingers straight and pressed together, the sharp nail tips leading; left shoulder forward with the chin tucked behind it; right hand up near the chin, open; left foot stepped forward. SMEAR: a short solid tapered streak behind the hand in purple-sleeve, white-cuff and skin colors (hard pixels, no blur). Face: focused.
4. Same full extension without the smear, the hand a touch further (CLAW); hair tufts flick forward, the sleeve ripples. Face: focused.
MOTION: One-frame anticipation, a hard snap, a quick light recovery: no wasted motion. Hair tufts jolt forward on frame 3 and settle on frame 5.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light1_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light1", knife-hand thrust with the left (lead) hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
5. Hand pulling back halfway, the nails shrinking back (CLAW). Face: focused.
6. Left hand back near the guard, fingers relaxing into the loose curl; left foot slides back. Face: cold.
7. Back in the fighting stance (same as idle frame 1). Face: cold.
MOTION: One-frame anticipation, a hard snap, a quick light recovery: no wasted motion. Hair tufts jolt forward on frame 3 and settle on frame 5.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A04 · `light2`: claw swipe with the R (near) hand (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light2_vNN_A.png` and `raw/_parts/light2_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light2_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light1` strip (`raw/light1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light2).

Part A (save as `raw/_parts/light2_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light2", claw swipe with the right (near) hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are the HIT frames: the striking hand or foot is fully extended toward the right and is the right-most part of the character; head, hair tufts, collar, shirt and its white hem stay behind it.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Hips coil: torso twists back toward the viewer; the right hand cocked high beside his right ear with the fingers hooked into a claw (CLAW), elbow back; weight on the right (back) leg. Face: cold.
2. Hips and shoulders rotate forward, the right claw sweeps forward past his face (CLAW). Face: focused.
3. IMPACT (CLAW): right arm FULLY EXTENDED to the right at the height of his own eyes, the claw leading (fingers spread and hooked, sharp nails forward), the arm crossing in front of his body (fully visible); torso turned almost to profile, the loose shirt twisting with it; right heel lifted, pivoting on the ball of the foot; left hand pulled back to the chest. SMEAR: a solid crescent behind the claw with four thin solid claw-trail streaks in the pale nail color along the fingertips' path (hard pixels, no blur). Face: focused, teeth just showing.
4. Same full extension without the smear, the claw a touch further (CLAW). Face: focused.
MOTION: The power comes from the hip rotation; the thin arm snaps fully straight. Hair tufts flick forward on frame 3.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light2_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light2", claw swipe with the right (near) hand. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
5. Right arm pulling back, torso unwinding, the claw still out (CLAW). Face: focused.
6. Right hand back in front of his chest, the nails shrinking back, heel down. Face: cold.
7. Fighting stance (same as idle frame 1). Face: cold.
MOTION: The power comes from the hip rotation; the thin arm snaps fully straight. Hair tufts flick forward on frame 3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A05 · `light3`: snap kick to the stomach with the R (near) leg (CORE)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/light3_vNN_A.png` and `raw/_parts/light3_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light3_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light3).

Part A (save as `raw/_parts/light3_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light3", snap kick to the stomach with the right (near) leg. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are the HIT frames: the striking hand or foot is fully extended toward the right and is the right-most part of the character; head, hair tufts, collar, shirt and its white hem stay behind it.
1. Weight shifts onto the left (front) leg, the right knee starts to lift; hands loose in guard. Face: cold.
2. Right knee chambered high, thigh about horizontal, shin hanging down; torso leaning back slightly. Face: focused.
3. IMPACT: right leg FULLY EXTENDED to the right, rising slightly, at the height of his own chest (where a taller opponent's stomach is), the sneaker sole and toe cap leading, toes pulled back; torso leaning back about 15 degrees; right arm swung back for balance, left hand guarding the chest; standing tall on the ball of the left foot. The loose shirt never covers the kicking leg. SMEAR: a solid arc from the chambered knee to the foot in skin, purple and white (no blur). Face: focused.
4. Same extension without the smear, the foot a touch further. Face: focused.
MOTION: A quick snap from the ball of the supporting foot, precise and light. Normal fingertips, no claws.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light3_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light3", snap kick to the stomach with the right (near) leg. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Knee folding back in. Face: focused.
6. Right foot setting down behind him, hands back to the loose guard. Face: cold.
7. Fighting stance. Face: cold.
MOTION: A quick snap from the ball of the supporting foot, precise and light. Normal fingertips, no claws.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A06 · `light4`: spinning high roundhouse finisher with the R leg (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). **Save as: `raw/_parts/light4_vNN_A.png` and `raw/_parts/light4_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/light4_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#light4).

Part A (save as `raw/_parts/light4_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light4", spinning high roundhouse finisher with the right leg. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5.
Poses 4 and 5 are the HIT frames: the striking hand or foot is fully extended toward the right and is the right-most part of the character; head, hair tufts, collar, shirt and its white hem stay behind it.
1. Wind-up: torso twists toward the viewer, arms coil in, knees bend. Face: focused.
2. Spinning on the ball of the left foot: his BACK now faces the viewer (the back of the purple shirt, the dark navy collar from behind and the fluffy back tufts are visible); right leg lifting; head turning to look over his shoulder at the target.
3. Back to the viewer, side-on: right knee chambered high and turned over (hip rolled); head spotting the target on the right; the shirt hem flares out with the spin, the white hem flashing.
4. IMPACT: right leg FULLY EXTENDED high and horizontal to the right, the shin and instep striking at the height of his own eyes or a little higher (a taller opponent's head); torso leaning back to counterbalance, standing on the ball of the left foot, arms flung out. SMEAR: a big solid crescent from behind and below up to the foot (no blur). Face: fierce, one small fang showing.
5. Same extension without the smear; hair tufts and the shirt hems whipping forward. Face: fierce.
MOTION: A light, fast spin on the ball of the foot. Only the kicking foot reaches far right on frames 4 and 5. Normal fingertips, no claws.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/light4_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "light4", spinning high roundhouse finisher with the right leg. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
6. Leg dropping, the rotation following through. Face: focused.
7. Right foot setting down, regaining the stance. Face: cold.
8. Fighting stance. Face: cold.
MOTION: A light, fast spin on the ball of the foot. Only the kicking foot reaches far right on frames 4 and 5. Normal fingertips, no claws.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A07 · `heavy`: rising claw uppercut launcher with the R hand (CORE)

8 frames, phases 3/2/3. **Two images** (poses 1-5, then 6-8). **Save as: `raw/_parts/heavy_vNN_A.png` and `raw/_parts/heavy_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/heavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#heavy).

Part A (save as `raw/_parts/heavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "heavy", rising claw uppercut launcher with the right hand. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 5.
Poses 4 and 5 are HIT frames. Pose 4: the right claw rakes up and forward IN FRONT of his face, at the chin height of a taller opponent standing on the right; it is the right-most part of the character, with head and hair behind it. Pose 5: the right claw is above his head but still in front of his face (arm up and forward at about 65 to 70 degrees), about two thirds of a head above the top of his hair and no higher.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Crouch begins: knees bend, torso leans forward, the right hand drops low beside the right hip, fingers hooking into a claw. Face: focused.
2. Deepest crouch: the right claw low behind the hip, left hand forward guarding, head down, eyes up at the target; the shirt hem pooled over the thighs. Face: focused.
3. Legs explode upward, the right claw starts rising in front of his stomach (CLAW). Face: fierce.
4. IMPACT (CLAW): rising, heels off the ground (toes last to leave), the right claw raking UP AND FORWARD in front of his face, at the chin height of a taller opponent on the right, arm about 45 to 60 degrees above horizontal; torso leaning back slightly; left arm pulled down to his side. SMEAR: a solid crescent from the low position up to the claw with thin claw-trail streaks (no blur). Face: fierce.
5. Airborne peak (CLAW): knees bent and feet hanging with pointed toes; the right arm up and forward at about 65 to 70 degrees, the claw about two thirds of a head above the top of his hair and no higher; hair tufts pressed down, the shirt riding up so more white hem shows. Face: fierce.
MOTION: The claw travels up and forward IN FRONT of his body (it hits a chin on the right), not straight up beside his own head.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/heavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "heavy", rising claw uppercut launcher with the right hand. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 6 to 8 (the attached part A shows poses 1 to 5).
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
6. Coming down, the arm lowering, the nails shrinking back, knees bending. Face: focused.
7. Landing crouch on the balls of the feet. Face: focused.
8. Fighting stance. Face: cold.
MOTION: The claw travels up and forward IN FRONT of his body (it hits a chin on the right), not straight up beside his own head.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A08 · `airLight1`: mid-air knife-hand thrust with the L hand (CORE)

5 frames, phases 1/2/2. **Save as: `raw/airLight1_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight1).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airLight1", mid-air knife-hand thrust with the left hand. 5 frames, left to right.
Poses 2 and 3 are the HIT frames: the striking hand or foot is fully extended toward the right and is the right-most part of the character; head, hair tufts, collar, shirt and its white hem stay behind it.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, hands loose in front of the chest, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame).
1. Air pose, the left hand pulled back to the chest, fingers straightening. Face: cold.
2. IMPACT (CLAW): left arm FULLY EXTENDED horizontally to the right at the height of his own shoulders (a taller opponent's chest), fingers straight and together, the sharp nail tips leading; torso leaning forward slightly. SMEAR: a solid tapered streak behind the hand (no blur). Face: focused.
3. Same extension without the smear (CLAW). Face: focused.
4. Hand pulling back, the nails shrinking back. Face: focused.
5. Air pose. Face: cold.
MOTION: All poses are in mid-air. Hair tufts and the shirt hem lifted slightly by the air.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A09 · `airHeavy`: double-hand hammer spike (also the THUNDERBOLT slam) (CORE)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/airHeavy_vNN_A.png` and `raw/_parts/airHeavy_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/airHeavy_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airheavy).

Part A (save as `raw/_parts/airHeavy_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airHeavy", double-hand hammer spike. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are the HIT frames. Pose 3: both straight arms smash the clasped hands DOWN AND FORWARD, in front of and below his chest; the hands are the right-most part of his arms, and his feet stay lower than the hands. Pose 4: the same smash with the hands slightly lower, still in front of and below his chest and above his feet.
1. Both hands clasped together (fingers interlocked) raised overhead, torso arching back, knees tucked. Face: fierce.
2. Wind-up peak: arched further back, the clasped hands behind his head. Face: fierce.
3. IMPACT: torso whips forward, both straight arms swing DOWN AND FORWARD, the clasped hands in front of and below his chest on the right; knees bent with the feet hanging below the hands. SMEAR: a large solid crescent from overhead down to the hands (no blur). Face: fierce.
4. Same smash pose without the smear, hands slightly lower; hair tufts whipping down. Face: focused.
MOTION: All poses are in mid-air. The feet stay the lowest point in every frame (the hands never go below them). Draw NO lightning: this pose is also his lightning slam, and the game adds the lightning.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/airHeavy_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airHeavy", double-hand hammer spike. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Arms rising, body uncurling. Face: focused.
6. Air pose: torso upright, hands loose in front of the chest, left knee forward and up, right leg hanging with pointed toes. Face: cold.
MOTION: All poses are in mid-air. The feet stay the lowest point in every frame (the hands never go below them). Draw NO lightning: this pose is also his lightning slam, and the game adds the lightning.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

**Step 6 · reactions**

### A10 · `guard`: cross-arm block (loop) (CORE)

2 frames, loops. **Save as: `raw/guard_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#guard).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "guard", cross-arm block. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Both forearms (purple sleeves with white cuffs) CROSSED in an X in front of his face and upper chest, right forearm in front, hands open with loosely curled fingers (no claws), elbows down; chin tucked, eyes cold over the crossed arms; knees bent more than in the fighting stance, weight back on the balls of the feet, left foot forward. Face: cold glare.
2. Identical but the body slightly lower (breathing); hair tufts slightly shifted. Face: cold glare.
MOTION: Almost still: a tiny breathing bob only. Feet identical in both frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A11 · `hurtHigh`: hit in the face (CORE)

3 frames. **Save as: `raw/hurtHigh_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurthigh).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "hurtHigh", hit in the face. 3 frames, left to right.
1. Hit in the face by an attack from the right: head snapped back with the chin up, torso arched back, both arms flung back and out with open hands, one foot slipping. Face: pain, eyes squeezed shut, mouth open. Hair tufts and the shirt hems whipping forward to the right.
2. About one third recovered: head coming down, arms swinging back in. Face: pain.
3. Mostly recovered, still wincing, arms returning toward guard. Face: pain, teeth gritted.
MOTION: Frame 1 is the peak of the reaction; it eases back over frames 2 and 3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A12 · `launched`: knocked flying backward (loop) (CORE)

2 frames, loops. **Save as: `raw/launched_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#launched).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "launched", knocked flying backward. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Knocked flying backward to the left by a big hit from the right. His body is tilted about 60 degrees back from upright and arched like a drawn bow with the belly up: his HIPS are the lowest point, near the middle of the pose; head and shoulders rise to the upper left; legs bent and trailing forward to the right at about hip height; arms flung up and back past his head. Face: eyes shut, mouth open. Hair tufts and the loose shirt whipping to the right, the shirt riding up.
2. Arms and legs in slightly different flailing positions. Face: same.
MOTION: A diagonal, arched body, not fully horizontal. Keep each pose about one and a half times as wide as it is tall.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A13 · `down`: slammed down, then lying on the back (CORE)

2 frames. **Save as: `raw/down_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#down).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "down", slammed down, then lying on the back. 2 frames, left to right.
1. His back slams flat onto the ground from the shoulders to the hips (head on the LEFT), knees bent and lifted toward the upper right by the bounce, arms flung out. Face: eyes shut, mouth open. Hair splashing out to the left.
2. Lying flat on his back, head on the LEFT and feet on the RIGHT, arms out at his sides, legs straight. Face: eyes closed, grimacing. Shirt splayed, the white hem showing.
MOTION: Lowest body points on one shared baseline (the ground line).

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A14 · `getup`: kip-up (CORE)

5 frames. **Save as: `raw/getup_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `down` strip (`raw/down_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#getup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "getup", kip-up. 5 frames, left to right.
1. Lying on his back (head on the LEFT), knees pulled to his chest, palms planted beside his head with the fingers toward the shoulders. Face: eyes open, cold.
2. Legs kicking up and over toward the upper right, rolling onto his shoulders, hands pushing off. Face: focused.
3. Springing up into the air, torso tilted back, legs folding under him, arms out. Face: focused.
4. Landing in a crouch facing right on the balls of his feet, hands coming into the loose guard. Face: focused.
5. His fighting stance (left foot forward, same as idle frame 1). Face: cold glare.
MOTION: He faces right from frame 4 on. Hair tufts and the shirt follow the flip.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

**Step 7 · specials**

### A15 · `charge`: powering up (loop) (CORE)

4 frames, loops. **Save as: `raw/charge_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#charge).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "charge", powering up. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Charging his body with electricity: wide low stance with the feet well apart and knees bent, arms held down and away from his sides, hands open with the fingers spread rigid and the claws out (CLAW), shoulders hunched, head up, teeth clenched in a fierce grimace (one small fang). Hair tufts BRISTLING UPWARD with static, the loose shirt and sleeves fluttering upward. Normal blue eyes, wide and intense. Shifted slightly left.
2. Same, shifted slightly right; the tufts in a new bristle shape (CLAW).
3. Same, shifted slightly left; hands a bit higher (CLAW).
4. Same, shifted slightly right; another tuft and shirt-hem flicker shape (CLAW).
MOTION: A trembling loop. NO lightning, NO aura, NO sparks: the game adds them.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A16 · `beamCharge`: charging the LIGHTNING PALM (loop) (CORE)

3 frames, loops. **Save as: `raw/beamCharge_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamcharge). Assassin eyes on.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "beamCharge", charging the LIGHTNING PALM. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: assassin eyes in every frame: his blue irises turn dark (#1d4c94) and empty, the pupils shrink to tiny black points, no white catch-light, the upper lids low and flat with a shadow over them.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Deep wide stance with the left foot forward and knees bent low, torso twisted back away from the right; BOTH HANDS drawn back to his right hip, palms facing each other about a fist-width apart as if holding a ball between them, fingers spread and hooked (CLAW); elbows back; head turned toward the opponent on the right. Face: teeth gritted. Hair tufts bristling up and back, the shirt and sleeves fluttering.
2. Trembling slightly forward; the tufts in a new flicker shape (CLAW).
3. Trembling slightly back; the fingers flexing (CLAW).
MOTION: Draw NO lightning between or around the hands: the game adds it.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A17 · `beamFire`: firing the LIGHTNING PALM (loop) (CORE)

3 frames, loops. **Save as: `raw/beamFire_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `beamCharge` strip (`raw/beamCharge_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#beamfire). Assassin eyes on.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "beamFire", firing the LIGHTNING PALM. 3 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: assassin eyes in every frame: his blue irises turn dark (#1d4c94) and empty, the pupils shrink to tiny black points, no white catch-light, the upper lids low and flat with a shadow over them.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Deep lunge to the right: left leg forward and bent, right leg straight back, torso leaning forward. BOTH ARMS THRUST STRAIGHT FORWARD to the right at the height of his own shoulders, palms open and facing the target, the heels of the hands together, fingers spread and hooked (CLAW); head low between and behind the arms. Face: shouting. Hair tufts, shirt and sleeves blown back to the left by the recoil.
2. Recoil: the whole body pushed slightly back; the tufts in a new flicker shape (CLAW).
3. Pushing slightly forward again (CLAW).
MOTION: The open palms are the right-most point of every frame. Draw NO beam or lightning: the game draws the beam.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A18 · `special`: NARUKAMI, lightning bolt from the palm (ground) (CORE)

8 frames, phases 3/3/2. **Two images** (poses 1-4, then 5-8). **Save as: `raw/_parts/special_vNN_A.png` and `raw/_parts/special_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/special_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#special). Leave the right palm **open and empty**: the engine fires the bolt from it at the start of pose 4 (spawn point (192, 125)). If refused, replace "Narukami" per CHARACTER.md §9.

Part A (save as `raw/_parts/special_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "special", NARUKAMI, a lightning bolt fired from the open palm. 8 frames in total, numbered 1 to 8 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Pose 4 is the RELEASE frame: a lightning bolt leaves his open right palm there (the game draws it). From pose 4 to pose 7 the right arm stays pushed forward toward the right.
1. Weight shifts back onto the right leg, torso twisting back; the right hand drops back beside the right hip, palm open facing forward, fingers spreading; the left hand comes forward at chest height, open, pointing at the target (aiming). Face: focused.
2. Deeper twist: the right palm cocked back at the hip, elbow bent behind him; left arm extended forward aiming; knees bent; eyes locked on the target; hair tufts and the shirt hem lifting slightly. Face: focused.
3. Hips turn forward, the right palm starts forward past the hip, the left hand pulls back. Face: focused.
4. RELEASE: the right arm THRUSTS FORWARD to the right at the height of his own chest, open palm facing the target, fingers spread (arm about three quarters extended); left hand pulled back to the chest; left leg forward and bent, right leg pushing. SMEAR: a solid streak from the hip to the palm (no blur). Face: focused, a short sharp exhale.
MOTION: Draw NO lightning anywhere: the palm is open and empty (the game fires the bolt from it). Normal blue eyes, normal fingertips.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/special_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "special", NARUKAMI, a lightning bolt fired from the open palm. 8 frames in total, numbered 1 to 8 from left to right; this image is PART B of 2 and shows only poses 5 to 8 (the attached part A shows poses 1 to 4).
Pose 4 is the RELEASE frame: a lightning bolt leaves his open right palm there (the game draws it). From pose 4 to pose 7 the right arm stays pushed forward toward the right.
5. Full extension: the right arm straight, palm open facing the target, fingers spread wide, torso leaning forward slightly. Face: focused.
6. Holding the palm out as the recoil starts: fingers flexing, hair tufts and the shirt hem blown back. Face: focused.
7. Recoil: the body jolted back slightly, the right arm STILL EXTENDED with the elbow slightly bent, palm still facing forward. Face: focused.
8. Returning toward the fighting stance, the hand lowering. Face: cold.
MOTION: Draw NO lightning anywhere: the palm is open and empty (the game fires the bolt from it). Normal blue eyes, normal fingertips.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

**Step 8 · rest of the core**

### A19 · `dash`: low forward dash (loop) (CORE)

2 frames, loops. **Save as: `raw/dash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#dash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "dash", low forward dash. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Low, very fast forward dash: torso leaning far forward (about 50 degrees), head up glaring forward, left knee bent under his chest, right leg extended straight back with the toes dragging; both arms trailing straight back low, hands open. Face: focused. Hair tufts, the shirt hem and the white hem streaming back hard.
2. Stride slightly wider; the hems in an alternate flutter. Face: focused.
MOTION: Low and fast. Same height in both frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A20 · `jumpUp`: rising (loop) (CORE)

2 frames, loops. **Save as: `raw/jumpUp_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpup).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "jumpUp", rising. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Rising: knees tucked high (left knee near the chest, right knee a little lower), torso upright; the right arm raised up and forward with the open hand at the height of the top of his hair, in front of his head; left arm down and back; head tilted slightly up. Hair tufts and the shirt hem pressed downward by the upward motion. Face: cold.
2. Knees and the right arm slightly lower, the tufts in an alternate flutter. Face: cold.
MOTION: All poses in mid-air.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A21 · `jumpFall`: falling (loop) (CORE)

2 frames, loops. **Save as: `raw/jumpFall_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpfall).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "jumpFall", falling. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Falling: legs extending down (left slightly forward and bent, right slightly back and bent), toes pointed down; arms out for balance (right arm forward and up, left arm back), hands open. Hair tufts lifted upward, the loose shirt billowing up so more of the white hem shows. Face: cold.
2. Arms slightly higher, the tufts and hems in an alternate flutter. Face: cold.
MOTION: All poses in mid-air.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A22 · `land`: landing (CORE)

2 frames. **Save as: `raw/land_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#land).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "land", landing. 2 frames, left to right.
1. Silent landing crouch (squash): knees deeply bent, on the balls of the feet, torso leaning forward, arms out forward and down for balance with the hands well above the ground; hair tufts squashed slightly, the shirt hem pooled over the thighs. Face: cold.
2. Rising halfway back to the fighting stance, arms returning, the tufts settling. Face: cold.
MOTION: Feet on one baseline.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A23 · `win`: hands behind his head (loop) (CORE)

4 frames, loops. **Save as: `raw/win_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#win).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "win", hands behind his head, victory. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Relaxed victory pose: standing in 3/4 view facing right, weight on the right leg; BOTH HANDS clasped behind his head with the elbows out to the sides at head height (never above the top of his hair). Face: a cheeky cat grin (a small cat-like mouth shaped like a rounded w, one tiny fang), eyes curved shut.
2. Hair tufts and the shirt hem fluttering in a breeze.
3. One eye opens, glancing at the viewer with the cat grin.
4. Settling, another flutter shape.
MOTION: Feet identical in all frames.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

**Step 9 · optional**

### A24 · `backDash`: quick catlike hop backward

3 frames. **Save as: `raw/backDash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#backdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "backDash", quick catlike hop backward. 3 frames, left to right.
1. Push-off: knees bent, pushing off the ball of the front (left) foot, torso upright leaning slightly back, both hands coming up loose in front of the chest. Face: cold.
2. Airborne catlike hop backward to the LEFT while still facing right: knees tucked high, leaning back, arms forward for balance; hair tufts and the shirt hems flicking forward to the right.
3. Landing on the ball of the back (right) foot with the legs nearly straight, knees starting to absorb, arms returning to his stance; the tufts swinging back.
MOTION: He faces right in every frame.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A25 · `superDash`: homing super dash (loop)

2 frames, loops. **Save as: `raw/superDash_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superdash).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "superDash", homing super dash. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Flying toward the right like a missile, the body angled about 25 degrees UPWARD from horizontal (head and hand higher, hips lower): the RIGHT ARM thrust forward along the flight line as a spear-hand (fingers straight and together, the sharp nails out: CLAW), the leading point of the shape; left arm tucked along his side pointing back; knees bent sharply as if kneeling in the air, the shins folded back so the feet trail behind; the KNEES are the lowest point, under the middle of the shape; toes pointed. Face: focused. Hair tufts flattened back, the shirt and hems streaming straight back.
2. Knees bent slightly more and slightly apart, the hems in an alternate flutter (CLAW).
MOTION: Keep the whole shape about twice as wide as it is tall.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A26 · `jumpSquat`: pre-jump crouch

1 frame. **Save as: `raw/jumpSquat_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#jumpsquat).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "jumpSquat", pre-jump crouch. 1 frame.
1. Deep catlike crouch right before jumping: knees bent about 85 degrees, up on the balls of the feet, left foot forward, torso leaning forward, both arms swung down and back with open hands, head up looking forward and up. Hair tufts squashed slightly, the shirt hem pooled over the thighs. Face: focused.
MOTION: Coiled like a spring.

LAYOUT: one single pose centered on a 1536x1024 landscape canvas, the whole body visible with a clear magenta margin. Make the character as large as the canvas allows.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A27 · `airLight2`: mid-air snap kick with the R leg

5 frames, phases 1/2/2. **Save as: `raw/airLight2_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight2).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airLight2", mid-air snap kick with the right leg. 5 frames, left to right.
Poses 2 and 3 are the HIT frames: the striking hand or foot is fully extended toward the right and is the right-most part of the character; head, hair tufts, collar, shirt and its white hem stay behind it.
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, hands loose in front of the chest, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame).
1. Right knee chambered up to the chest. Face: cold.
2. IMPACT: right leg extending STRAIGHT FORWARD to the right, angled slightly down, at the height of his own hips, the sneaker sole leading; torso leaning back; right arm out behind for balance; the left leg hanging as the lowest point. SMEAR: a solid arc to the foot (no blur). Face: focused.
3. Same extension without the smear. Face: focused.
4. Knee folding back. Face: focused.
5. Air pose. Face: cold.
MOTION: All poses are in mid-air.

LAYOUT: one single horizontal row of exactly 5 poses on a 1536x1024 landscape canvas. Split the width into 5 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A28 · `airLight3`: mid-air spinning heel kick with the L leg

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/airLight3_vNN_A.png` and `raw/_parts/airLight3_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/airLight3_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airLight1` strip (`raw/airLight1_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airlight3).

Part A (save as `raw/_parts/airLight3_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airLight3", mid-air spinning heel kick with the left leg. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are the HIT frames: the striking hand or foot is fully extended toward the right and is the right-most part of the character; head, hair tufts, collar, shirt and its white hem stay behind it.
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, hands loose in front of the chest, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame).
1. Body twisting away (his back toward the viewer: the back of the shirt and collar, the back tufts), left knee chambered. Face: focused.
2. Spinning: hips turning over, head spotting the target on the right, the shirt hem flaring.
3. IMPACT: left leg FULLY EXTENDED forward to the right, heel leading, at the height of his own chest to hips; body leaning back; right knee tucked; arms flung (right back, left forward). SMEAR: a big solid crescent (no blur). Face: fierce.
4. Same extension without the smear. Face: fierce.
MOTION: All poses are in mid-air.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/airLight3_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airLight3", mid-air spinning heel kick with the left leg. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
AIR POSE (first and last frame of every air attack): torso upright leaning slightly forward, hands loose in front of the chest, left knee bent forward and up, right leg hanging down almost straight with the toes pointed (the lowest point in every frame).
5. Leg folding back in. Face: focused.
6. Air pose. Face: cold.
MOTION: All poses are in mid-air.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A29 · `block`: pushed back while blocking

2 frames. **Save as: `raw/block_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `guard` strip (`raw/guard_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#block).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "block", pushed back while blocking. 2 frames, left to right.
1. Pushed back by a blocked hit: the whole body leaning back slightly and slid back (the right sneaker skidding), arms still crossed but jarred upward. Face: eyes shut tight, teeth gritted. Hair tufts and the shirt hems blown back to the left.
2. Settling back into the guard, knees a little straighter. Face: cold glare.
MOTION: Feet on one baseline.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A30 · `hurtLow`: hit in the stomach

3 frames. **Save as: `raw/hurtLow_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#hurtlow).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "hurtLow", hit in the stomach. 3 frames, left to right.
1. Hit in the stomach: doubled over, torso bent forward about 40 degrees, head down, both arms clutching his stomach, knees bent. Face: eyes wide with tiny pupils, mouth open. Hair tufts swinging forward and down.
2. About one third recovered. Face: pain.
3. Rising, wincing, one hand still on his stomach. Face: pain, teeth gritted.
MOTION: Frame 1 is the peak; it eases back over frames 2 and 3.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A31 · `spin`: tumbling backward (loop)

4 frames, loops. **Save as: `raw/spin_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#spin).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "spin", tumbling backward. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Tumbling head over heels backward through the air after a big hit, balled up with knees to his chest and arms bent in, tilted back 30 degrees, head at the upper left. Face: eyes shut in pain.
2. Rotated 120 degrees: head pointing down-left.
3. Upside down: head at the bottom.
4. Rotated 300 degrees: head at the right, coming back upright.
MOTION: One full backward rotation, turning COUNTER-CLOCKWISE on screen. Hair tufts and the shirt hems trail opposite to the rotation.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: seen from the side with his chest turned slightly toward the viewer, camera slightly above; he rotates in the picture plane, starting from a pose that faces right. His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A32 · `airRecover`: mid-air backflip recovery

3 frames. **Save as: `raw/airRecover_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#airrecover).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "airRecover", mid-air backflip recovery. 3 frames, left to right.
1. Tucked, knees to his chest, tilted back 60 degrees. Face: eyes open, regaining focus.
2. Upside down, fully tucked.
3. Almost upright, unfolding like a landing cat: legs extending down, arms out loose, facing right. Face: cold glare.
MOTION: A backflip rotating COUNTER-CLOCKWISE on screen, all in mid-air.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A33 · `throw`: NARUKAMI, lightning bolt from the palm in mid-air

4 frames, phases 1/1/2. **Save as: `raw/throw_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `special` strip (`raw/special_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#throw). His release point is his **open R palm**; draw **no lightning** (the engine fires the bolt from (192, 125) at the start of pose 2). If refused, replace "Narukami" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "throw", NARUKAMI in mid-air, a lightning bolt fired from the open palm. 4 frames, left to right.
Pose 2 is the RELEASE frame: a lightning bolt leaves his open right palm there (the game draws it). In poses 2 and 3 the right arm is pushed forward toward the right.
AIR POSE (frames 1 and 4): left knee bent forward and up, right leg hanging down with pointed toes (the lowest point).
1. Air-pose legs, torso twisted back; the right hand cocked back beside the right hip, palm open facing forward, fingers spread and slightly hooked; the left hand forward at chest height pointing at the target (aiming). Face: focused.
2. RELEASE: the right arm THRUSTS FORWARD to the right at the height of his own chest, open palm facing the target, fingers spread; left hand pulled back to the chest; legs trailing back and down. SMEAR: a solid streak from the hip to the palm (no blur). Face: focused, a short sharp exhale.
3. Recoil: body drifting back slightly, the arm still extended, fingers splayed; hair tufts and hems blown back. Face: focused.
4. Air pose, the hand lowering. Face: cold.
MOTION: All poses in mid-air. Draw NO lightning anywhere: the palm is open and empty (the game fires the bolt from it). Normal blue eyes.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A34 · `vanish`: high-speed teleport (also the start of RHYTHM ECHO)

2 frames. **Save as: `raw/vanish_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#vanish).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "vanish", high-speed teleport. 2 frames, left to right.
1. A quick low crouch with a slight sideways sway (the start of a rhythmic step), torso leaning forward, arms loose and pulled in. Face: sharp, focused eyes.
2. Body stretched a little taller and thinner, up on his toes, arms tight to his sides, hair tufts and the shirt hems streaming upward, and the lower half of his body broken into 3 or 4 solid horizontal slices shifted sideways by small amounts (an anime high-speed afterimage), drawn with solid shapes in his own colors.
MOTION: No transparency, no blur: the slices are solid.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A35 · `stagger`: dizzy stagger (loop)

4 frames, loops. **Save as: `raw/stagger_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#stagger).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "stagger", dizzy stagger. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Dizzy, standing almost upright on wobbly knees, arms hanging loose; torso and head leaning to the right. Face: eyes half-lidded and unfocused, mouth slightly open. Hair tufts messy over the eyes.
2. Centered, upright.
3. Leaning to the left.
4. Centered.
MOTION: No stars or swirls (the game adds effects if needed). Feet on one baseline.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A36 · `ko`: knocked out

1 frame. **Save as: `raw/ko_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#ko).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "ko", knocked out. 1 frame.
1. Knocked out, lying flat on his back with his head on the LEFT and feet on the RIGHT, completely limp, arms splayed, one knee only slightly bent. Face: eyes closed, mouth slightly open. Hair spread on the ground, the shirt splayed.
MOTION: Flat and long: the pose is about three times as wide as it is tall.

LAYOUT: one single pose centered on a 1536x1024 landscape canvas, the whole body visible with a clear magenta margin. Make the character as large as the canvas allows.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: he lies or tumbles in the side plane: seen from the side with his chest turned slightly toward the viewer, camera slightly above. His head is on the LEFT and his feet on the RIGHT (his front faces up and to the right). His right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A37 · `intro`: hands in pockets, bored (loop)

4 frames, loops. **Save as: `raw/intro_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#intro). High priority within step 9 (shows up every match).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "intro", hands in pockets, bored. 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Pre-fight attitude: standing upright, slouched, weight on the right leg, left knee relaxed; BOTH HANDS shoved into the pockets of his shorts (the purple shirt hem hangs over his wrists); head tilted slightly, looking at the opponent on the right from the corner of his eye. Face: bored, half-lidded. A light breeze moves the hair tufts and the shirt hem.
2. Breathing, slightly up; the tufts swaying. Face: bored.
3. Head tilting a little further; a small cat-like smirk (mouth shaped like a rounded w, one tiny fang).
4. Settling back toward frame 1. Face: bored.
MOTION: Feet identical in all frames.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A38 · `taunt`: tongue-out "akanbe" (loop)

2 frames, loops. **Save as: `raw/taunt_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#taunt).

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "taunt", tongue-out taunt. 2 frames, left to right. It loops: the last frame must flow smoothly back into the first.
1. Standing upright, body turned toward the viewer, weight on one leg; his RIGHT index finger pulls down the lower eyelid of his right eye and he sticks his tongue out (pink #e27d8c), cheeky; left hand in the pocket of his shorts. Normal blue eyes.
2. Head tilting slightly, the tongue a little further out; the hair tufts flicking.
MOTION: Feet identical in both frames.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

**Step 9 · optional, move system v2 (ADR 0009)**

These four names are optional for every fighter (fallback in brackets in the titles). For Killua they are the visible half of his kit: generate them early in step 9. They need manifest rows before the packer picks them up (Claude adds them).

### A39 · `specialForward`: RHYTHM ECHO claw strike (opt v2, fallback `special`)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). **Save as: `raw/_parts/specialForward_vNN_A.png` and `raw/_parts/specialForward_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/specialForward_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light2` strip (`raw/light2_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialforward). Assassin eyes in poses 1-6. Draw **no afterimages and no lightning**: the engine draws the teleport and the 3 ghost copies. If refused, replace "Rhythm Echo" per CHARACTER.md §9.

Part A (save as `raw/_parts/specialForward_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "specialForward", RHYTHM ECHO claw strike: he has just reappeared behind the opponent out of an afterimage teleport. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are the HIT frames: the striking hand or foot is fully extended toward the right and is the right-most part of the character; head, hair tufts, collar, shirt and its white hem stay behind it.
EYES: assassin eyes in poses 1 to 6 (his blue irises turn dark (#1d4c94) and empty, the pupils shrink to tiny black points, no white catch-light, the upper lids low and flat with a shadow over them); normal blue eyes in pose 7.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Reappearing: a low crouch already facing right, weight forward on the bent left leg, torso leaning about 30 degrees; the right claw drawn back low behind the right hip (fingers together and hooked, sharp nails fully out: CLAW); left hand forward low and open. Hair tufts and the shirt hems still lifted from the teleport. Face: expressionless.
2. Drive: the right leg pushes, hips and shoulders turn forward, the right claw comes forward past the hip at waist height (CLAW). Face: expressionless.
3. IMPACT (CLAW): deep lunge, left knee bent far forward, right leg straight back; the right arm FULLY EXTENDED horizontally to the right at the height of his own shoulders (a taller opponent's chest) as a spear-like claw thrust, fingers together, nails out, the claw tips leading; left hand pulled back to the chest; head low behind the right shoulder. SMEAR: a solid streak behind the claw with thin claw-trail streaks in the pale nail color (no blur). Face: teeth gritted.
4. Same extension without the smear, the claw a touch further (CLAW); hair tufts and the shirt hems whipping forward. Face: teeth gritted.
MOTION: Draw NO afterimages, ghosts or lightning: the game draws the teleport and the ghost copies of him. The lunge stays inside its slot.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialForward_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "specialForward", RHYTHM ECHO claw strike: he has just reappeared behind the opponent out of an afterimage teleport. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
EYES: assassin eyes in poses 1 to 6 (his blue irises turn dark (#1d4c94) and empty, the pupils shrink to tiny black points, no white catch-light, the upper lids low and flat with a shadow over them); normal blue eyes in pose 7.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
5. Arm pulling back, the body rising out of the lunge (CLAW). Face: expressionless.
6. The claw hand back in front of his chest, the nails shrinking back, weight shifting back. Face: expressionless.
7. Fighting stance (same as idle frame 1), normal fingertips, normal blue eyes. Face: cold.
MOTION: Draw NO afterimages, ghosts or lightning: the game draws the teleport and the ghost copies of him. The lunge stays inside its slot.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A40 · `specialUp`: THUNDERBOLT rising leap (opt v2, fallback `special`)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). **Save as: `raw/_parts/specialUp_vNN_A.png` and `raw/_parts/specialUp_vNN_B.png`** (same NN = the next free version); Codex stitches them into `raw/specialUp_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airHeavy` strip (`raw/airHeavy_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialup). The slam itself is his `airHeavy` strip, so pose 6 must match `airHeavy` pose 1. Draw **no lightning**. If refused, replace "Thunderbolt" per CHARACTER.md §9.

Part A (save as `raw/_parts/specialUp_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "specialUp", THUNDERBOLT rising leap (a lightning leap that ends in a double-hand slam). 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4.
Poses 3 and 4 are HIT frames (an anti-air strike on the way up): the right claw thrusts up and forward above his head and the right knee drives up and forward; together they lead the shape toward the upper right.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Crouch: knees deeply bent, torso leaning forward, both arms swung down and back, head up looking up and forward at the target. Hair tufts compressed slightly. Face: focused.
2. Spring: legs extending explosively, heels off, toes last on the ground, arms swinging forward and up, body leaning up and forward. Face: focused.
3. IMPACT (CLAW): rising through the air, the body stretched diagonally up and forward; the right knee driven up and forward; the right claw thrust up and forward above his head at about 60 degrees, its top about half a head above the top of his hair and no higher; left arm back and down; the left leg trailing straight down with pointed toes (the lowest point). SMEAR: a solid streak trailing the claw (no blur). Face: fierce. Hair tufts and the shirt hem pressed down.
4. Same rising pose without the smear (CLAW). Face: fierce.
MOTION: All poses after pose 2 are in mid-air. Draw NO lightning: the game adds the lightning leap and the slam. Nothing in poses 5 and 6 rises above the claw of pose 3.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialUp_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "specialUp", THUNDERBOLT rising leap (a lightning leap that ends in a double-hand slam). 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Apex: the body curling, knees tucked, both hands coming together above his shoulders, head looking down and forward at the target below on the right. Face: focused.
6. Apex hang: both hands clasped together (fingers interlocked) at the top of his head, torso arching slightly back, knees tucked; this pose leads straight into his double-hand hammer slam (match the first pose of the attached airHeavy strip). Face: fierce.
MOTION: All poses after pose 2 are in mid-air. Draw NO lightning: the game adds the lightning leap and the slam. Nothing in poses 5 and 6 rises above the claw of pose 3.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A41 · `specialDown`: GODSPEED activation (opt v2, fallback `charge`)

4 frames, phases 2/1/1. **Save as: `raw/specialDown_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `charge` strip (`raw/charge_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialdown). Assassin eyes on. Draw **no lightning and no aura**: the engine wraps him in lightning for the whole 8 s mode. If refused, replace "Godspeed" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "specialDown", GODSPEED activation, a power-up that charges his whole body with lightning speed. 4 frames, left to right.
EYES: assassin eyes in every frame: his blue irises turn dark (#1d4c94) and empty, the pupils shrink to tiny black points, no white catch-light, the upper lids low and flat with a shadow over them.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Coiling: knees bent low, feet planted wide, torso curling forward, both forearms crossed in front of his chest with the fingers clawed (CLAW); head lowered so the hair tufts shade his eyes, the dark eyes glinting under the hair.
2. Deeper coil: shoulders hunched, elbows tight, the claws trembling (CLAW), teeth gritted; the hair starting to bristle.
3. RELEASE: his body SNAPS UPRIGHT AND OPEN, chest forward, both arms flung down and back from the shoulders with the fingers spread rigid and the claws out (CLAW), head up, mouth open in a short sharp cry (one small fang); the hair BRISTLING straight up and out with static (clearly taller than in his idle), the shirt and sleeves blown outward.
4. Settling into a low, forward-leaning ready stance close to his fighting stance: knees bent, hands low and loose at his sides with the claws still out (CLAW), hair still bristling slightly. Face: cold.
MOTION: Draw NO lightning, NO aura, NO sparks: the game adds them. Feet stay planted.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### A42 · `superPose`: GODSPEED: WHIRLWIND activation pose (opt v2, fallback `taunt`)

4 frames, loops. **Save as: `raw/superPose_vNN.png`** (next free version). Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `light2` strip (`raw/light2_vNN.png` with NN = its `approvedVersion`). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superpose). Assassin eyes on. Without it the super flash shows the tongue-out taunt, so generate it. If refused, replace "Godspeed: Whirlwind" per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose.

ANIMATION: "superPose", GODSPEED: WHIRLWIND activation pose (shown during the super flash). 4 frames, left to right. It loops: the last frame must flow smoothly back into the first.
EYES: assassin eyes in every frame: his blue irises turn dark (#1d4c94) and empty, the pupils shrink to tiny black points, no white catch-light, the upper lids low and flat with a shadow over them.
CLAWS: in the poses marked (CLAW) his fingers stiffen and hook slightly and his fingernails grow into short, sharp, pale claws (about as long as the last finger joint, silver-white like his hair, never metal, never glowing); in every other pose his fingertips are normal.
1. Standing almost upright, knees slightly bent, feet shoulder-width apart, body turned more toward the viewer, chin down; the RIGHT hand raised in front of the right side of his face at eye height, fingers spread and hooked into a claw with the sharp nails fully out (CLAW), his dark eyes glaring at the target on the right past the claw; the left hand low at his side, also clawed (CLAW). Hair tufts bristling upward with static, the shirt hem and sleeves lifted by an upward wind. The raised hand stays below the top of his hair.
2. The claws flex slightly, a new bristle shape in the hair (CLAW).
3. The whole body slightly higher, the shirt hem in a new flutter shape (CLAW).
4. Settling back toward frame 1, another hair flicker (CLAW).
MOTION: A menacing still pose with a subtle trembling loop. Feet identical in all frames. Draw NO lightning: the game adds it.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks, claw and hand strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

---

## UI art

UI images are not packed into the sheet. Codex saves every candidate as **`raw/ui_<name>_vNN.png`**
(the sheet packer skips `ui_*` files) and adds a REVIEW.md row. After "approve killua <name> vNN",
Codex **copies** that version to `ui/<name>.png`; the packer removes the magenta, crops and fits it to
the exact size (nearest / palette-preserving "mode" sampling) and writes it to
`public/characters/killua/` (SPEC.md "Per-character UI images"). Rejected versions move to
`raw/_rejected/`. Attach `reference/model_sheet.png` and `reference/expressions.png`. Lightning **is**
allowed in UI art (cut-in glints, select art), never in sprites.

### U1 · Portrait (96×96)

**Save as: `raw/ui_portrait_vNN.png`** → approved copy `ui/portrait.png` (packed to 96×96, transparent).

```text
Pixel-art character portrait for a fighting-game HUD (anime fan-art).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and expression sheet exactly.

Head and shoulders, facing RIGHT in 3/4 view (both eyes visible), cropped at the upper chest; the head fills most of the frame. A cold, half-lidded, bored stare with NORMAL blue eyes (one white catch-light each, not the dark assassin eyes) and a faint cocky smirk; the fluffy silver-white tufts sticking out in every direction; the dark navy rolled collar and the shoulders of the loose purple shirt. Bold, readable shapes that still work when shrunk to 96 by 96 pixels.
SIZE: a 1024x1024 square canvas showing pixel art on a 96x96 art-pixel grid (every art pixel is a crisp square block about 10x10 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no border, no ground shadow, no effects.
```

### U2 · Super cut-in eye strip (480×128)

The DBFZ-style super-flash strip before the Lightning Palm and before Godspeed: Whirlwind (one strip
serves both). **Save as: `raw/ui_cutin_vNN.png`** → approved copy `ui/cutin.png`. The packer removes the
magenta above and below the band and fits the band to 480×128. The face fills the strip edge to edge.

```text
Pixel-art "super move cut-in" for a fighting game (anime fan-art), an extreme close-up of the character's eyes.
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and expression sheet exactly.

On a 1536x1024 landscape canvas, draw one horizontal band 1536 px wide and 410 px tall across the middle (ratio 3.75 to 1). Inside the band: an extreme close-up of his face from the hair tufts above the brows to just below the nose, both eyes visible, face turned slightly toward the right. A sharp, slim 13-year-old face with upturned cat-like eyes, not chibi. Expression: cold killing intent, brows down. Both eyes are assassin eyes: the irises dark (#1d4c94) and empty, the pupils tiny black points, no catch-light, a shadow over the upper lids. Silver-white hair tufts cut across the band, a few tiny blue-white lightning crackles at the edges. The face fills the band completely; a flat dark navy (#141a32) background may show only around the eyes and brows.
SIZE: pixel art on a 480x128 art-pixel grid inside the band (every art pixel is a crisp square block about 3x3 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c. Plus for the lightning only: #e8f8ff #bfe6ff #7fcfff #3f8cff.
BACKGROUND: flat solid magenta #FF00FF above and below the band only. No text, no speed lines, no borders.
```

### U3 · Character select art (384×384)

**Save as: `raw/ui_select_vNN.png`** → approved copy `ui/select.png` (packed to 384×384, transparent).
The Godspeed lightning **is** allowed here (UI art, not a sprite).

```text
Pixel-art full-body character select illustration for a fighting game (anime fan-art).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips (claws only where a pose asks for them). No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and expression sheet exactly.

Low lightning-speed crouch facing RIGHT in 3/4 view: knees deeply bent, weight forward on the balls of his feet, torso leaning forward, the RIGHT hand forward and low as a claw (sharp pale nails out), the LEFT hand back and low, also clawed; hair tufts bristling upward with static; dark assassin eyes (dark empty irises, tiny pupils) glaring toward the right. Blue-white lightning crackles around his body, along his arms and from his claws (draw the lightning in this image: white core, pale blue and blue jagged arcs, a few arcs striking the ground; hard pixels, no blur). The whole body fits inside the frame with a small margin.
SIZE: a 1024x1024 square canvas showing pixel art on a 384x384 art-pixel grid (every art pixel is a crisp square block about 2.7x2.7 screen pixels).
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c. Plus for the lightning only: #e8f8ff #bfe6ff #7fcfff #3f8cff.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no logo, no ground shadow.
```

---

## Extra · Optional Killua effect art (engine support pending)

Specs in [MOVES_AND_VFX.md](MOVES_AND_VFX.md) §4. The engine does not read these yet (task ENG-014),
and the packer never reads `_proposed/`. **Save as: `art/vfx/raw/_proposed/killua_<effect>_vNN.png`**
with a REVIEW.md row per version. Generate them only after the core strips are packed.

### X1 · `killua_narukamiBolt` (6 frames)

```text
Pixel-art game effect sprite strip: killua_narukamiBolt, 6 frames, ONE horizontal row on a 1536x1024 landscape canvas, evenly spaced, each frame a square cell with the effect centered. A horizontal jagged lightning bolt flying to the RIGHT: a bright white-hot head (#ffffff) at the right end, a forked zig-zag body trailing to the left in #e8f8ff, #bfe6ff and #7fcfff with dark blue #3f8cff edges, thin 1-pixel side branches; a different zig-zag in every frame so it flickers when looped. Hard pixels, no blur, no glow gradients, flat magenta #FF00FF background, no text.
```

### X2 · `killua_thunderStrike` (6 frames)

```text
Pixel-art game effect sprite strip: killua_thunderStrike, 6 frames, ONE horizontal row on a 1536x1024 landscape canvas, evenly spaced, each frame a square cell. A thick vertical lightning strike coming down from the top of the cell and hitting the ground at the bottom center, then splitting into short jagged ground arcs to both sides and fading: frame 1 a thin white bolt, frames 2-3 the full thick bolt (white core #ffffff, #e8f8ff, #bfe6ff, #7fcfff, dark blue edges #3f8cff), frames 4-6 only the ground arcs breaking up. The impact point sits on one shared ground line near the bottom of every cell. Hard pixels, no blur, no gradients, flat magenta #FF00FF background, no text.
```

For `killua_godspeedCrackle`, `killua_blinkTrail`, `killua_palmCharge` and `killua_assassinGlint`, reuse
the same wording with the description and colors from the MOVES_AND_VFX.md §4 table. Tinted effects
(`killua_godspeedCrackle`, `killua_blinkTrail`, `killua_assassinGlint`) are drawn in white and light grey
only.

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
`npm run sprites killua`.

```text
Using the attached sprite strip, redraw ONLY frame <N> as a single pose on a 1024x1024 flat solid magenta (#FF00FF) canvas, at exactly the same character scale, design, proportions (about 6 heads, a slim 13-year-old, not chibi) and palette as the other frames. Fix: <describe the problem, e.g. "the right claw must be fully extended horizontally toward the right at the height of his own eyes; it is the right-most point of the character">. Keep everything else about the pose identical. Facing right, 3/4 view, the loose purple shirt with the dark navy rolled collar, white cuffs and white hem, claws only if this frame had them, no lightning, crisp hard pixels, no anti-aliasing, no text, no ground shadow.
```

### F2 · Character drifted off-model

Regenerate the whole strip as the next version (`raw/<anim>_vNN.png`), attaching the drifted strip.

```text
In the attached strip the character drifted from the attached model sheet: <list, e.g. "the hair turned grey or yellow", "the head is too big (chibi) in frames 4-6", "he looks like a tall adult", "the white cuffs and the white hem are missing", "lightning is drawn on his body", "claws appear on relaxed frames">. Redraw the whole strip with exactly the same poses, fixing only those details: about 6 heads tall (a slim 13-year-old), fluffy silver-white hair, blue cat eyes, the loose long-sleeved purple shirt with the dark navy rolled collar, white cuffs and white hem, baggy dark navy shorts above the knees, purple-and-white high-top sneakers, no lightning. Same layout, scale, palette and magenta background.
```

### F3 · Hit frames don't reach

Regenerate as the next version.

```text
In the attached strip, frames <a>-<b> are the hit frames but the <hand / claw / foot> stops short. Redraw the strip with the same poses, except that in frames <a>-<b> the <limb> is fully extended horizontally toward the right edge of the image and is clearly the right-most part of the character. Hair tufts, collar and shirt hems stay behind it. Same scale, palette and magenta background.
```

### F4 · Inconsistent scale or baseline

Regenerate as the next version.

```text
In the attached strip the character changes size between frames and the feet are not on one baseline. Redraw it with exactly the same poses, the same head size in every frame (about 6 heads tall, a slim 13-year-old, not chibi), and every grounded foot on one shared horizontal line. Same palette and magenta background.
```

### Fix-up lines (append one to a regeneration)

| problem | add this line |
|---|---|
| chibi / big head / short legs | "About 6 heads tall, a slim wiry 13-year-old: a sharp face, long thin limbs, the crotch at half his height. Not chibi, not super-deformed." |
| looks like an adult / too tall / too muscular | "He is a 13-year-old boy, about 6 heads tall, clearly shorter and slimmer than an adult: narrow shoulders, slim limbs, a slightly larger head than an adult's." |
| wrong number of poses | "Exactly N poses in one row, no more, no less." |
| poses overlap or touch | "Leave a wide empty magenta gap between every pose." |
| size changes between poses | "Every pose is the same character size as pose 1; feet on one baseline." |
| facing left | "He faces RIGHT in every pose (his right arm nearest the viewer)." |
| strike goes up, down or into the screen | "The strike travels straight to the right, horizontally, at the height of his own <brows / eyes / shoulders / chest>." |
| blurry or painterly | "Clean hard-edged pixel art on one pixel grid, fewer colors, no anti-aliasing, no gradients." |
| shadow, text or effects added | "No ground shadow, no text, no effects; plain flat magenta background." |
| lightning, sparks or static drawn on him | "No lightning, sparks or electricity anywhere on or around him: the game draws all of it." |
| hair yellow, grey or dark; eyes the wrong color | "His hair is silver-white with cool lavender-grey shading (never yellow, never dark grey); his eyes are blue and cat-like (dark assassin eyes only where I ask)." |
| outfit drifts (dark short-sleeved tunic, white shorts, turtleneck up to the chin) | "Match the attached model sheet exactly: loose long-sleeved purple shirt with a dark navy rolled collar, white cuffs and a white hem from the undershirt, baggy dark navy shorts just above the knees, purple high-top sneakers with white soles, toe caps and laces." |
| claws everywhere, metal claws, or claws missing | "Claws only on the poses marked (CLAW): short pale fingernails, never metal; every other pose has normal fingertips." |
| props appear (skateboard, yo-yo, chocolate) | "No skateboard, no yo-yos, no props: empty hands." |
| off-model face | "Attach expressions.png. Same face as the reference: sharp upturned blue cat eyes, thin brows, a narrow chin, fluffy silver-white tufts over the forehead." |
