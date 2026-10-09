# Art pipeline

From a generated image to a fighter in the game, step by step. Sizes and formats:
[SPEC.md](SPEC.md) (hi-res sprite spec v2, [ADR 0007](../docs/decisions/0007-art-spec-v2-shippuden-256.md)).
Look and posing: [STYLE_GUIDE.md](STYLE_GUIDE.md). Review queue: [REVIEW.md](REVIEW.md). Status:
[TRACKER.md](TRACKER.md) + [manifest.json](manifest.json).

```
 Codex built-in image generator        art/characters/<id>/raw/<anim>_vNN.png
 (approved references attached)  ──>   (next free version, magenta background)
 or the user in ChatGPT                         │
                                                ├──> REVIEW.md row "needs review"
                                                ▼
                              npm run sprites <id>   (tools/pack-sprites.mjs, highest _vNN wins)
                                                │  cleans, scales, aligns, boxes
                                                ▼
              frames/<anim>/<anim>_NN.png  +  public/characters/<id>/sheet.png + anims.json
                                                │
                                                ▼
              preview: game with ?art=custom  ·  Sprite Lab (load the sheet)  ·  QA notes in REVIEW.md
                                                │
                                                ▼
              user approves / rejects in REVIEW.md or chat
                                                │
                                                ▼
              REVIEW.md + TRACKER.md + manifest.json (version / approvedVersion)  ·  commit  ·  CHANGELOG.md
```

## Who does what

| who | job in this pipeline |
|---|---|
| **User** | reviews every candidate in [REVIEW.md](REVIEW.md) and approves or rejects it (in chat or in the table), plays the game; can still generate an image in ChatGPT by hand (same naming) |
| **Codex** | picks the next asset, **generates the image with its built-in image generator** (attaching the approved references as image inputs), saves it under the next `_vNN` name, adds the REVIEW.md row, runs the packer, QAs the report and previews, records the user's decision in REVIEW/TRACKER/manifest, writes new character briefs from `_template/` |
| **ChatGPT** (optional, run by the user) | same prompts, same references, same naming; the user hands the file to Codex or saves it under the next version |
| **Claude** (Claude Code) | the spec, packer and tooling, engine integration, hitbox and move tuning, code review, ADRs |

Full roles and the handoff protocol: `docs/AI_COLLABORATION.md`. Tasks: `docs/TASKS.md`.

## Generation order

Always work top to bottom per character. Each step depends on the ones before it (a strip is only
as consistent as the reference attached to its prompt). `step` numbers match `manifest.json`.

| step | what | why this order |
|---|---|---|
| 1 | **Reference model sheet + turnaround** (one image, `reference/model_sheet_vNN.png`: front, 3/4 right, side, back, fighting stance, palette swatches) | the identity anchor: every later prompt attaches it. Iterate (v01, v02, ...) until the user approves one; Codex copies it to `reference/model_sheet.png` |
| 2 | **Expression sheet** (`reference/expressions_vNN.png` -> approved copy `reference/expressions.png`) | faces for attacks, hurt, shout, win |
| 3 | **idle** | sets the scale, the stance and the packer's attack baseline. Approve before going on; Codex copies the approved strip to `reference/idle_approved.png` |
| 4 | **run** | second most visible animation |
| 5 | **Core attacks**: light1, light2, light3, light4, heavy, airLight1, airHeavy | the combat feel |
| 6 | **Reactions**: guard, hurtHigh, launched, down, getup | needed every exchange |
| 7 | **Specials**: charge, beamCharge, beamFire, special | the signature moments |
| 8 | **Rest (core)**: dash, jumpUp, jumpFall, land, win | completes the core set: the sheet now loads by default |
| 9 | **Rest (optional)**: backDash, superDash, jumpSquat, airLight2, airLight3, block, hurtLow, spin, airRecover, throw, vanish, stagger, ko, intro, taunt | polish; fallbacks cover them until then |
| 10 | **VFX** ([vfx/](vfx/)) | shared by all characters; can run in parallel once a style exists |
| 11 | **UI**: per-character portrait, cutin, select; shared logo and title art ([ui/](ui/)) | last, so it matches the final look |

Rule of thumb: **never start step N+1 while step N has no approved version.** Fixing the reference
later means regenerating everything after it.

### Parallel characters

Naruto and Sasuke can be produced **in parallel**, each in its own Codex thread (or chat). Rules:

- **One character per thread, one character per image.** Never put both fighters in one generated
  image (the only exception is the shared title key art in step 11, which attaches both approved
  model sheets).
- Each thread attaches only its own character's references and writes only to its own
  `art/characters/<id>/` folder, its own rows in `REVIEW.md` and its own `characters.<id>` block in
  `manifest.json` / section in `TRACKER.md`.
- Shared files (`REVIEW.md`, `TRACKER.md`, `manifest.json`) are edited by both threads: re-read the
  file right before editing, change only your character's lines, and insert REVIEW rows at the top.
- Keep both characters at the same body scale: once both idles are approved, compare their head
  sizes in the Sprite Lab (about 31 px) and note any correction in TRACKER.
- VFX and shared UI belong to neither thread: do them in a third thread or after the characters.

## Step by step (one asset)

1. **Pick the next asset.** Lowest `step` without an `approvedVersion` in `manifest.json` for the
   character (Codex: "what's next for naruto?"). If the top REVIEW.md row for it says
   `needs review`, wait for the user's decision first.
2. **Get the prompt** from `art/characters/<id>/PROMPTS.md` (copy the whole block).
3. **Generate.** Codex uses its built-in image generator; the user may use ChatGPT instead.
   - Attach `reference/model_sheet.png` (always, from step 2 on), `reference/expressions.png` (every
     prompt after S2) and `reference/idle_approved.png` once idle is approved (or the latest approved
     strip of the same move family). As identity references, attach only approved fixed-name files.
     Two exceptions: (a) a Part B prompt attaches Part A of the same version; (b) a retry of S1/S2 or a
     strip fix may attach the candidate being corrected, together with the list of changes. Never
     attach `reference/source/`, `reference/_old/` or v1 files.
   - Make up to 3 attempts, then save ONLY the single best one (one new version per round).
   - One animation per image, one horizontal row, the exact pose count.
4. **Quick check before saving** (30 seconds): right pose count, facing right, same character,
   ~6.5 heads tall (not chibi), same colors, flat magenta, no shadow or text. If not, regenerate (see
   the tricks below); a discarded attempt that was never saved needs no number.
5. **Save with the next version**: `art/characters/<id>/raw/<anim>_vNN.png`, where `NN` = 1 + the
   highest version ever used for that asset (look in `raw/`, `raw/_parts/`, `raw/_rejected/` and
   REVIEW.md). Never
   overwrite a file. Names are camelCase exactly as in SPEC (`airLight1_v01.png`). See
   [Versioned naming](#versioned-naming).
6. **Queue it**: add a row at the top of [REVIEW.md](REVIEW.md) (`needs review`, what changed since
   the previous version), set the asset's `version` in `manifest.json` to `NN` (status `raw` if it was
   `todo`) and update TRACKER.md.
7. **Pack**: `npm run sprites <id>`. The packer uses the **highest** `_vNN` strip and prints which
   file it used. Read the report: packed animations and sources, missing core animations, warnings
   (frame count mismatch, clipped frames, palette > 64 colors, upscaled art).
8. **Preview**:
   - In game: `http://127.0.0.1:5188/?fight=<id>,<id>&mode=solo&art=custom&debug` (partial sheets need
     `art=custom` until every core animation exists; `npm run dev:alt` and port 5200 if 5188 is taken).
   - Sprite Lab: open `http://127.0.0.1:5188/sprites.html?c=<id>`, click "Load full sheet (.png + .json)…" and pick `public/characters/<id>/sheet.png` and `anims.json`; otherwise it shows the baked placeholder. It plays every animation at game speed.
   - Run the [QA checklist](#qa-checklist) and write the result in the REVIEW.md row's QA notes.
9. **Status -> `packed`** in TRACKER.md and manifest.json when it packs cleanly.
   `npm run sprites <id> -- --update-manifest` raises `status` (`raw` / `packed`) and `version` in
   manifest.json for you; it never touches `approvedVersion` (that is the user's decision) and never
   lowers a status. TRACKER.md is still updated by hand.
10. **The user decides** (in REVIEW.md or in chat):
    - **approved**: Codex sets the row to `approved`, `approvedVersion` = `NN` and status `approved`
      in manifest.json, updates TRACKER.md, and copies references (model sheet, expressions, idle) to
      their fixed names. Any other `needs review` row of the same asset becomes `rejected` (reason:
      superseded by vNN) and its file moves to `_rejected/`.
    - **rejected**: Codex sets the row to `rejected` with the reason, moves the file to
      `raw/_rejected/` (fixing the link), re-packs (the packer falls back to the highest version
      left), and generates the next version with the problem called out. See
      [Fixing frames](#fixing-frames).
11. **Commit** (see [Commits](#commits-and-changelog)).

## Versioned naming

Every generated image carries a two-digit version (ADR 0007). Versions are never overwritten or
reused; the highest number left in a folder is the current candidate.

| asset | candidate file | approved / used file |
|---|---|---|
| model sheet | `reference/model_sheet_vNN.png` | copied to `reference/model_sheet.png` |
| expression sheet | `reference/expressions_vNN.png` | copied to `reference/expressions.png` |
| idle strip | `raw/idle_vNN.png` | packed (highest version); approved one also copied to `reference/idle_approved.png` |
| animation strip | `raw/<anim>_vNN.png` | packed (highest version) |
| strip in parts | `raw/_parts/<anim>_vNN_A.png`, `_B.png` | stitched into `raw/<anim>_vNN.png` (same NN) |
| single frames (an animation delivered frame by frame) | `raw/<anim>_NN.png` (NN = frame, no `v`) | packed when no strip exists |
| single-frame fix attempt | `raw/<anim>_NN_fixMM.png` (NN = frame, MM = attempt; skipped by the packer) | patched into the strip, saved as the next `raw/<anim>_vNN.png` |
| per-character UI | `raw/ui_<name>_vNN.png` | copied to `ui/<name>.png` (the packer fits it) |
| VFX strip | `art/vfx/raw/<effect>_vNN.png` | packed (highest version) |
| VFX style sheet | `art/vfx/reference/vfx_style_sheet_vNN.png` | copied to `art/vfx/reference/vfx_style_sheet.png` |
| shared UI | `art/ui/raw/<asset>_vNN.png` (`logo`, `logo_title`, `title_art`, `title_bg`) | cleaned into `art/ui/final/<asset>.png` |
| rejected candidate | moved to `_rejected/` next to it (`raw/_rejected/`, `reference/_rejected/`, ...) | ignored by the packer |

A plain `raw/<anim>.png` (no version) is still packed when no versioned file exists, so old art
keeps working, but new art always gets a version.

## Consistency tricks for the image generator

The generator does not remember the design between images. These keep a character on-model:

- **Always attach the approved model sheet + expression sheet + the latest approved frame/strip**
  (`reference/model_sheet.png` + `reference/expressions.png` + `reference/idle_approved.png`) as image
  inputs. Say: "Match the
  attached reference exactly: same character design, proportions, colors and pixel density."
- **Restate the proportions every time**: "about 6.5 heads tall, Shippuden-era anime proportions,
  athletic teenage build, long legs; not chibi, not super-deformed". Without it, generators drift
  back to big heads.
- **Ask for a single horizontal strip**: "N poses in one horizontal row, left to right, evenly
  spaced, poses not touching." Never ask for a full sheet or a grid.
- **Restate the palette hexes every time**. The palette is in each character's `CHARACTER.md` and
  already inside every prompt block.
- **Restate the fixed rules every time**: facing right, 3/4 view, feet on one baseline, same size
  in every pose, flat #FF00FF background, no shadow, no text, crisp hard pixels.
- **One thread per character.** Start a fresh thread with the attachments when it drifts or after
  about 6 strips (every prompt restates the palette and rules, so it works in a fresh thread).
- **Regenerate single bad frames** instead of accepting them: "Redraw only pose 3 as a single image:
  same character, same scale as the attached strip, [pose description]."
- **Keep strips short.** With 6.5-head bodies, 4-5 poses per image read best; wide poses (kicks) at
  4. Every strip with 6 or more frames is generated in two parts (Part A, then Part B, attaching part A
  when asking for part B) and stitched. Split so that **all active (hit) frames are in the same
  image** (e.g. a strip that hits on poses 4-5 splits 1-5 / 6-8), so the strike's reach and scale
  match across its active frames.
- **One change at a time** when correcting: "Same image, but the fist must be fully extended to
  the right at face height." Long correction lists make it redraw everything.
- **Describe traits, not names** (see the fallback wording in [STYLE_GUIDE.md](STYLE_GUIDE.md#prompt-language-rules)).
- If colors drift anyway, the strip can still pass: the packer keeps the palette, and Codex/Claude
  can remap stray colors to the character's hexes. Note it in the REVIEW row.

## Long strips (parts)

Save parts as `raw/_parts/<anim>_vNN_A.png`, `raw/_parts/<anim>_vNN_B.png` (the packer ignores
`raw/_parts/`). Codex stitches them into `raw/<anim>_vNN.png` with the same `NN`. There is no stitch
tool in `tools/` yet (task TOOL-008 for Claude), so Codex writes a throwaway script outside
`tools/` (Node + `pngjs` from `node_modules`):

- one canvas filled with flat `#FF00FF`, A on the left, B on the right, both bottom-aligned (feet on
  one line), with at least 24 px of magenta between the last pose of A and the first of B;
- if B must be rescaled so the character's head size matches A, use **nearest-neighbor only**, never
  bilinear or bicubic (smooth resizing adds blended colors and a magenta-purple fringe);
- save the result as `raw/<anim>_vNN.png`.

One REVIEW row covers the stitched strip. Then pack as usual.

## Fixing frames

Pick the lightest fix that works:

1. **Regenerate the strip** as the next version with the problem called out (attach the rejected
   strip): best when more than one frame is off.
2. **Patch one frame**: generate the single pose (save attempts as `raw/<anim>_NN_fixMM.png`, NN =
   the 0-based frame, MM = the attempt, so attempts never overwrite each other; the packer skips
   them), paste it over the bad pose at the same scale (match the head size) and save
   the result as the **next** version `raw/<anim>_vNN.png` (never edit an existing version in place).
   Add a REVIEW row ("pose 4 patched"). Untouched packer-written frames re-import automatically.
3. **Touch up the cleaned frame** in a pixel editor (Aseprite, LibreSprite, Pixelorama, Piskel):
   edit `frames/<anim>/<anim>_NN.png` directly (already 256x256, already on the pivot), re-pack.
   `frames/` wins over `raw/`, so your edit is kept. Note it in the REVIEW row of the version it fixes.

**Important:** packer-written frames are re-imported automatically when the chosen raw file changes
(a new `_vNN` counts; the `frames/<anim>/.packer.json` marker tells the packer they are untouched).
Delete `frames/<anim>/` only if you hand-edited it and want to discard the edits: hand-edited frames
win over a newer raw, with a warning in the report.

### Per-frame placement corrections

If the packer's automatic foot centering makes a run pose slide or clips a limb, put a
`frameOffsets` array in that candidate's `raw/<anim>_vNN.json` sidecar. It needs one `[dx, dy]`
integer pair per packed frame, in 0-based frame order. These are **final cell pixels**, applied
after the animation's common body-height scale: positive x moves the art right, positive y moves
it down. Use `dy = 0` for grounded poses; a negative `dy` can lift a flight pose above the floor.
`[0, 0]` keeps the automatic placement for that frame.

The offsets change where pixels sit inside the cell. They do not change the shared pivot
`[128, 240]`, pixels per unit, or the manifest's `bodyHeight`. The packer validates the pair
count and integer values, and still warns if corrected pixels clip or enter the cell margin.
Editing a sidecar re-imports the original raw image when its cleaned frames are untouched; a
manually edited `frames/<anim>/` folder keeps precedence and produces a warning. Preserve the
earlier `_vNN` image, save a new candidate version and its matching sidecar, then re-pack and
queue that version for user review. A placement correction does not approve the image.

## Hitbox tuning

1. Pack, then preview the attack in game with `?art=custom` (and `?debug`, if the lead engineer
   added a box overlay there) or check `boxes` in `public/characters/<id>/anims.json`.
2. If an auto hitbox is wrong (too big, on the wrong limb, missing), add an override to
   `art/characters/<id>/hitboxes.json` (copy `hitboxes.example.json`). Frame numbers are 0-based
   within the animation (`light1_02.png` -> `"2"`), boxes in 256-cell px.
3. Re-pack. If spacing still feels off (hits that should land whiff, or land from too far), open a
   task for Claude in `docs/TASKS.md` to tune `reach` / `lunge` in `src/game/moves.js`.

## Naming rules

| thing | rule | example |
|---|---|---|
| character id | lowercase ascii letters, digits and `_` (not leading: `_`/`.` folders are skipped) | `naruto`, `rock_lee` |
| animation name | camelCase, exactly as in SPEC | `airLight1`, `beamFire` |
| version | `_vNN`, two digits, starts at `v01`, never reused | `light1_v03.png` |
| raw strip | `raw/<anim>_vNN.png` | `raw/light1_v01.png` |
| raw single frame | `raw/<anim>_NN.png`, two digits, 0-based, no `v` | `raw/light1_02.png` |
| raw parts | `raw/_parts/<anim>_vNN_A.png` | `raw/_parts/run_v02_B.png` |
| fix-up attempt | `raw/<anim>_NN_fixMM.png` (NN = frame, MM = attempt; skipped by the packer) | `raw/light1_02_fix01.png` |
| rejected candidate | moved to `_rejected/`, name kept | `raw/_rejected/light1_v01.png` |
| proposed art (engine support pending) | character animation: `raw/_proposed/<name>_vNN.png`; effect: `art/vfx/raw/_proposed/<charId>_<effect>_vNN.png` (never read by the packer) | `art/vfx/raw/_proposed/sasuke_chidoriBall_v01.png` |
| cleaned frame | `frames/<anim>/<anim>_NN.png` | `frames/heavy/heavy_03.png` |
| UI | candidates `raw/ui_<name>_vNN.png` (skipped by the sheet packer); approved one copied to `ui/<name>.png`, which the packer fits to the exact size | `raw/ui_portrait_v02.png` -> `ui/portrait.png` (96x96) |
| reference | candidates `reference/<name>_vNN.png`; approved copies `reference/model_sheet.png`, `expressions.png`, `idle_approved.png`; optional `notes.md`; official pictures only in `reference/source/` (local only) | `reference/model_sheet_v04.png` |
| VFX | `art/vfx/raw/<effect>_vNN.png`, `art/vfx/frames/<effect>/<effect>_NN.png` | `art/vfx/raw/spark_v01.png` |

No spaces, no capitals in ids, and no other suffixes (`_final`, `_new`, `_v2b`): the `_vNN` number
is the only version marker. Art from an older spec goes in `reference/_old/` or `raw/_old/`.

## QA checklist

Run it on every packed strip (Codex runs it and writes the result in the REVIEW.md row):

**Identity and style**

- [ ] On-model in every frame: hair shape/spike count, Shippuden outfit pieces, colors, face marks
      (the character's identity checklist in `CHARACTER.md`).
- [ ] **Proportions ~6.5 heads**: in idle the head (skull top to chin) is about 31 px and the stance is
      about 204 px tall including hair; long legs, defined shoulders. Not chibi, no oversized head,
      hands or feet.
- [ ] **Palette <= 48 colors** for the character (the packer warns above 64); no stray colors.
- [ ] **No anti-aliasing**, blur, gradients, dithering or semi-transparent edges; 1 px dark outline.
- [ ] No VFX, aura, ground shadow, text or background remnants (magenta fringe!).

**Geometry**

- [ ] **Silhouette readable at 1x** (view the sheet at 100 % and at 50 %: can you tell the pose?).
- [ ] **Feet on the baseline**: soles on y 240 for grounded frames; the feet do not slide between
      frames of a planted pose.
- [ ] **Same height**: the character is the same size as in idle (compare head size) and within
      the animation's body height; nothing outside the cell margin (x 4..251, y 4..240) and no
      "clipped" warning.
- [ ] Facing right, 3/4 view, both eyes visible.
- [ ] Frame count matches `manifest.json` (or update it on purpose, with a note).
- [ ] The report names the version you expect (`raw/<anim>_vNN.png` with the highest `NN`).

**Motion and combat**

- [ ] **Strike extends to the right**: on active frames the fist/foot is the forward-most pixel,
      horizontal, at the zone height (SPEC contact zones: HIGH y 58-90, MID y 92-124, LOW y 122-152),
      clearly separated from the body.
- [ ] Anticipation before the strike, recovery back to the stance; loops cycle without a pop.
- [ ] Hitbox in `anims.json` sits on the fist/foot on active frames only; hurtbox covers the body.
- [ ] In game (`?art=custom`): the hit visibly connects with the opponent's body at normal combo
      range; reactions recoil away from the attacker.
- [ ] Hand anchors for specials, beams and throws match SPEC "Effect anchor points" (orb (205, 148),
      beam origin (230, 122), throw release (192, 125)) or are recorded in `MOVES_AND_VFX.md`.

## Troubleshooting

| symptom | likely cause | fix |
|---|---|---|
| character looks chibi (big head, short legs) | proportions not restated, or an old v1 image attached | restate "about 6.5 heads tall ... not chibi, not super-deformed"; attach only the approved v2 `model_sheet.png`; reject and regenerate |
| packer used the wrong version | a newer file exists, or a rejected file was not moved | read the report's source line; move rejected versions to `raw/_rejected/`; check the `NN` (two digits) and camelCase name |
| two files with the same `NN` | a number was reused | rename the newer one to the next free number and fix REVIEW.md; numbers are never reused |
| two threads overwrote each other's rows | REVIEW/TRACKER/manifest edited at the same time | re-read before editing, restore the lost row from the other thread's note, edit only your character's lines |
| pink/magenta fringe around the character | the generator anti-aliased into the background | re-pack (near-magenta pixels are removed); if it stays, touch up `frames/` or regenerate asking for "hard edges, no anti-aliasing" |
| grey blob under the feet | the generator drew a ground shadow | regenerate with "no ground shadow", or erase it in a patched next version |
| character too big/small in game | strip's tallest frame doesn't match the expected pose | check `bodyHeight` for that animation; a raised arm or flying hair makes the tallest frame. Adjust the art or (with a note) the manifest value |
| "upscaled" warning | poses in the raw image are smaller than the target body height | generate fewer poses per image (two parts) so each figure is bigger |
| "clipped" warning on a wide or lying pose | the pose is wider than the 256 cell allows | follow the SPEC pose notes (superDash angled ~25 degrees with bent knees, launched diagonal, down/ko ~210 px long) |
| feet slide / character jitters in a loop | uneven poses or a cloth/hair piece in the bottom rows | make sure only the feet are in the bottom 20 % of the frame; fix the pose |
| wrong frame count | poses touch or have gaps inside a pose | ask for more spacing, or save single frames `raw/<anim>_NN.png` |
| sheet not used in game | not every core animation is packed (`"complete": false`) | preview with `?art=custom`; finish the core set |
| new raw version ignored | `frames/<anim>/` was hand-edited (the report warns "has manual edits") | keep the edits, or delete `frames/<anim>/` to discard them and re-import |
| palette warning (> 64 colors) | generator noise or soft shading | ask for flat cel bands; remap stray colors to the hexes |
| hits land without touching / whiff at close range | strike not forward-most, wrong height, or spacing | fix the active pose; add `hitboxes.json` override; task Claude to tune `reach`/`lunge` |
| the generator refuses the prompt | names or "style of" wording | use the fallback wording (STYLE_GUIDE); describe traits only |
| colors drift between strips | palette not restated / reference not attached | always attach model sheet + idle; restate hexes; regenerate |

## Commits and changelog

Conventional commits, one asset or one logical batch per commit:

```
art(naruto): add model_sheet v03 candidate
art(naruto): approve model_sheet v03
art(sasuke): pack light1 v02, hitbox override for light3
art(sasuke): reject light2 v01 (fist too low)
art(vfx): add spark v01 and burst v01
docs(art): clarify contact zones for air attacks
```

- Every commit that changes a status or version also updates `REVIEW.md`, `TRACKER.md` **and**
  `manifest.json`.
- Add a line to `CHANGELOG.md` (Unreleased section) for anything the user will notice in game.
- Generated outputs in `public/characters/<id>/` are committed together with the source change
  that produced them.
- Parallel threads share one working copy and one art branch (created by the user before the
  session, e.g. `art/spec-v2-restart`): never `git checkout`, `switch` or `stash`. Stage explicit paths
  only: the character's new or moved files (`reference/*_vNN.png`, the fixed-name copies,
  `raw/<anim>_vNN.png`, `raw/_parts/`, the `_rejected/` moves, `frames/<anim>/`,
  `public/characters/<id>/`) plus `art/REVIEW.md`, `art/TRACKER.md`, `art/manifest.json`,
  `docs/TASKS.md` and `CHANGELOG.md`. Never `git add -A`, `git add .` or `git commit -a`. If
  `.git/index.lock` exists, wait about 10 s and retry, up to 5 times.
- Official pictures collected from the anime/manga (`reference/source/`) are copyrighted: keep
  them local (`art/**/reference/source/` is git-ignored) and never upload them to an image
  generator as style sources.

## Adding a new character

1. Copy `art/characters/_template/` to `art/characters/<id>/`.
2. Fill `CHARACTER.md` (identity checklist, palette hexes, silhouette notes, expressions),
   `MOVES_AND_VFX.md` (special, projectile, beam, aura colors, anchors), `ANIMATIONS.md` (the
   specifics column for every frame) and `PROMPTS.md` (replace every `{{...}}`).
   Codex can draft all four from the template; the user reviews.
3. Add `characters.<id>` to `manifest.json` (copy `animationDefaults`, add `reference` and `ui`
   blocks like naruto's, all with `version: 0` and `approvedVersion: null`) and a section to
   `TRACKER.md`.
4. Open a task for Claude in `docs/TASKS.md`: register the fighter in `src/characters/` (stats,
   colors, special, projectile; new specials or projectiles need code).
5. Follow the [generation order](#generation-order) from step 1. The new character can run in its
   own thread in parallel with the others.

## VFX and UI

- **VFX**: same loop with `art/vfx/` (briefs in `art/vfx/EFFECTS.md`, prompts in
  `art/vfx/PROMPTS.md`): candidates `art/vfx/raw/<effect>_vNN.png`, queued in REVIEW.md (character
  column `vfx`), packed with `npm run sprites vfx` into `public/vfx/atlas.png` + `atlas.json` (highest
  version wins). VFX cells stay 128 x 128 at ppu 56. Tinted effects are white/grey only.
- **Per-character UI**: candidates `raw/ui_<name>_vNN.png`; the approved one is copied to
  `ui/<name>.png`. The packer removes the magenta and fits it to the exact size (nearest-neighbor or
  mode sampling, never smooth resampling) when it writes `public/characters/<id>/`.
- **Shared UI** (logo, title art): [ui/README.md](ui/README.md); candidates `art/ui/raw/<asset>_vNN.png`
  (character column `shared` in REVIEW.md).
