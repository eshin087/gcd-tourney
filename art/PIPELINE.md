# Art pipeline

From a ChatGPT image to a fighter in the game, step by step. Sizes and formats:
[SPEC.md](SPEC.md). Look and posing: [STYLE_GUIDE.md](STYLE_GUIDE.md). Status:
[TRACKER.md](TRACKER.md) + [manifest.json](manifest.json).

```
 ChatGPT image generator         art/characters/<id>/raw/<anim>.png
 (user runs the prompt)   ──>    (exact file name, magenta background)
                                          │
                                          ▼
                              npm run sprites <id>   (tools/pack-sprites.mjs)
                                          │  cleans, scales, aligns, boxes
                                          ▼
              frames/<anim>/<anim>_NN.png  +  public/characters/<id>/sheet.png + anims.json
                                          │
                                          ▼
              preview: Sprite Lab (/sprites.html)  ·  game with ?art=custom
                                          │
                                          ▼
              TRACKER.md + manifest.json status  ·  commit  ·  CHANGELOG.md
```

## Who does what

| who | job in this pipeline |
|---|---|
| **User** | runs prompts in the ChatGPT image generator, saves images, plays the game, approves |
| **ChatGPT** (image generator) | draws: model sheets, animation strips, VFX, UI, following `PROMPTS.md` |
| **Codex** | picks the next asset, hands the user the exact prompt, files raw images, runs the packer, checks the report and previews, updates TRACKER/manifest, writes new character briefs from `_template/` |
| **Claude** (Claude Code) | engine integration, packer/tooling changes, hitbox and move tuning, code review, ADRs |

Full roles and the handoff protocol: `docs/AI_COLLABORATION.md`. Tasks: `docs/TASKS.md`.

## Generation order

Always work top to bottom per character. Each step depends on the ones before it (a strip is only
as consistent as the reference attached to its prompt). `step` numbers match `manifest.json`.

| step | what | why this order |
|---|---|---|
| 1 | **Reference model sheet + turnaround** (one image: `reference/model_sheet.png`: front, 3/4 right, side, back, fighting stance, palette swatches) | the identity anchor: every later prompt attaches it. Iterate until the user approves it |
| 2 | **Expression sheet** (`reference/expressions.png`) | faces for attacks, hurt, shout, win |
| 3 | **idle** | sets the scale, the stance and the packer's attack baseline. Approve before going on, then copy it to `reference/idle_approved.png` |
| 4 | **run** | second most visible animation |
| 5 | **Core attacks**: light1, light2, light3, light4, heavy, airLight1, airHeavy | the combat feel |
| 6 | **Reactions**: guard, hurtHigh, launched, down, getup | needed every exchange |
| 7 | **Specials**: charge, beamCharge, beamFire, special | the signature moments |
| 8 | **Rest (core)**: dash, jumpUp, jumpFall, land, win | completes the core set: the sheet now loads by default |
| 9 | **Rest (optional)**: backDash, superDash, jumpSquat, airLight2, airLight3, block, hurtLow, spin, airRecover, throw, vanish, stagger, ko, intro, taunt | polish; fallbacks cover them until then |
| 10 | **VFX** ([vfx/](vfx/)) | shared by all characters; can run in parallel once a style exists |
| 11 | **UI**: per-character portrait, cutin, select; shared logo and title art ([ui/](ui/)) | last, so it matches the final look |

Rule of thumb: **never start step N+1 while step N has a frame you don't like.** Fixing the
reference later means regenerating everything after it.

## Step by step (one asset)

1. **Pick the next asset.** Lowest `step` with status `todo` in `manifest.json` for the character
   (Codex: "what's next for naruto?").
2. **Get the prompt** from `art/characters/<id>/PROMPTS.md` (copy the whole block).
3. **In ChatGPT**: start the message with the attachments, then paste the prompt.
   - Attach `reference/model_sheet.png` (always) and `reference/idle_approved.png` once idle is
     approved (or the previous approved strip of the same move family).
   - Ask for one animation, one horizontal row, the exact pose count.
4. **Quick check before saving** (30 seconds): right pose count, facing right, same character,
   same colors, flat magenta, no shadow or text. If not, regenerate (see the tricks below).
5. **Save** the PNG with the exact name: `art/characters/<id>/raw/<anim>.png`
   (single frames: `raw/<anim>_00.png`, `raw/<anim>_01.png`, ...). Names are camelCase exactly
   as in SPEC (`airLight1`).
6. **Status -> `raw`** in TRACKER.md and manifest.json.
7. **Pack**: `npm run sprites <id>`. Read the report: packed animations, missing core
   animations, warnings (frame count mismatch, clipped frames, palette > 48 colors).
8. **Preview**:
   - Sprite Lab: `http://127.0.0.1:5188/sprites.html` (plays every animation at game speed).
   - In game: `http://127.0.0.1:5188/?fight=naruto,sasuke&mode=solo&art=custom` (partial sheets need
     `art=custom` until every core animation exists).
   - Run the [QA checklist](#qa-checklist).
9. **Fix** what fails (see [Fixing frames](#fixing-frames) and
   [Troubleshooting](#troubleshooting)), re-pack.
10. **Status -> `packed`**, commit (see [Commits](#commits-and-changelog)).
11. **The user plays it.** Looks right and hits visibly connect -> **`approved`**. Otherwise note the
    problem in the TRACKER notes column and loop back.

## Consistency tricks for ChatGPT

ChatGPT does not remember the design between images. These keep a character on-model:

- **Always attach the approved model sheet + the latest approved frame/strip**
  (`reference/model_sheet.png` + `reference/idle_approved.png`). Say: "Match the
  attached reference exactly: same character design, proportions, colors and pixel density."
- **Ask for a single horizontal strip**: "N poses in one horizontal row, left to right, evenly
  spaced, poses not touching." Never ask for a full sheet or a grid.
- **Restate the palette hexes every time** ("hair #FFC935 / shadow #E0861C / light #FFE36A ...").
  The palette is in each character's `CHARACTER.md` and already inside every prompt block.
- **Restate the fixed rules every time**: facing right, 3/4 view, feet on one baseline, same size
  in every pose, flat #FF00FF background, no shadow, no text, crisp hard pixels.
- **One chat per character.** Start a fresh chat with the primer/attachments when it drifts or
  after about 6 strips (every prompt restates the palette and rules, so it works in a fresh chat).
- **Regenerate single bad frames** instead of accepting them: "Redraw only pose 3 as a single image:
  same character, same scale as the attached strip, [pose description]."
- **Keep strips short.** Wide poses (kicks) at 4-5 per image. Longer animations: generate in two
  parts (poses 1-4, then 5-8, attaching part A when asking for part B) and stitch.
- **One change at a time** when correcting: "Same image, but the fist must be fully extended to
  the right at face height." Long correction lists make it redraw everything.
- **Describe traits, not names** (see the fallback wording in [STYLE_GUIDE.md](STYLE_GUIDE.md#prompt-language-rules)).
- If colors drift anyway, the strip can still pass: the packer keeps the palette, and Codex/Claude
  can remap stray colors to the character's hexes. Note it in TRACKER.

## Long strips (parts)

Save parts as `raw/_parts/<anim>_A.png`, `raw/_parts/<anim>_B.png` (the packer ignores
`raw/_parts/`). Codex stitches them into `raw/<anim>.png`: same height (scale B so the character's
head size matches A), side by side, with at least 24 px of magenta between the last pose of A and
the first of B. Then pack as usual.

## Fixing frames

Pick the lightest fix that works:

1. **Regenerate the strip** with the problem called out (attach the old strip): best when more
   than one frame is off.
2. **Patch one frame in the raw strip**: generate the single pose (save attempts as
   `raw/<anim>_fixNN.png`; the packer skips them), paste it over the bad pose in `raw/<anim>.png` at
   the same scale (match the head size), re-pack. Untouched packer-written frames re-import
   automatically when the raw changes.
3. **Touch up the cleaned frame** in a pixel editor (Aseprite, LibreSprite, Pixelorama, Piskel):
   edit `frames/<anim>/<anim>_NN.png` directly (already 192x192, already on the pivot), re-pack.
   `frames/` wins over `raw/`, so your edit is kept.

**Important:** packer-written frames are re-imported automatically when `raw/` changes (the
`frames/<anim>/.packer.json` marker tells the packer they are untouched). Delete `frames/<anim>/`
only if you hand-edited it and want to discard the edits: hand-edited frames win over a newer raw,
with a warning in the report.

## Hitbox tuning

1. Pack, then preview the attack in game with `?art=custom` (and `?debug`, if the lead engineer
   added a box overlay there) or check `boxes` in `public/characters/<id>/anims.json`.
2. If an auto hitbox is wrong (too big, on the wrong limb, missing), add an override to
   `art/characters/<id>/hitboxes.json` (copy `hitboxes.example.json`). Frame numbers are 0-based
   within the animation (`light1_02.png` -> `"2"`), boxes in 192-cell px.
3. Re-pack. If spacing still feels off (hits that should land whiff, or land from too far), open a
   task for Claude in `docs/TASKS.md` to tune `reach` / `lunge` in `src/game/moves.js`.

## Naming rules

| thing | rule | example |
|---|---|---|
| character id | lowercase ascii letters, digits and `_` (not leading: `_`/`.` folders are skipped) | `naruto`, `rock_lee` |
| animation name | camelCase, exactly as in SPEC | `airLight1`, `beamFire` |
| raw strip | `raw/<anim>.png` | `raw/light1.png` |
| raw single frame | `raw/<anim>_NN.png`, two digits, 0-based | `raw/light1_02.png` |
| raw parts | `raw/_parts/<anim>_A.png` | `raw/_parts/run_B.png` |
| fix-up attempt | `raw/<anim>_fixNN.png` (skipped by the packer) | `raw/light1_fix02.png` |
| proposed art (engine support pending) | character animation: `raw/_proposed/<name>.png`; effect: `art/vfx/raw/_proposed/<charId>_<effect>.png` (never read by the packer) | `art/vfx/raw/_proposed/sasuke_chidoriBall.png` |
| cleaned frame | `frames/<anim>/<anim>_NN.png` | `frames/heavy/heavy_03.png` |
| UI | `ui/<name>.png`: save the ChatGPT image here; the packer removes the magenta and fits the exact size. Optional untouched original: `raw/ui_<name>.png` (skipped) | `ui/portrait.png` (96x96) |
| reference | `reference/model_sheet.png`, `expressions.png`, `idle_approved.png`, optional `notes.md`; official pictures only in `reference/source/` (local only) | `reference/idle_approved.png` |
| VFX | `art/vfx/raw/<effect>.png`, `art/vfx/frames/<effect>/<effect>_NN.png` | `art/vfx/raw/spark.png` |

Don't put spaces, capitals in ids, or version suffixes (`_v2`, `_final`) in file names: git keeps
history. Old attempts go in `raw/_old/` if you want to keep them.

## QA checklist

Run it on every packed strip (Codex runs it and writes the result in the TRACKER notes):

**Identity and style**

- [ ] On-model in every frame: hair shape/spike count, outfit pieces, colors, face marks
      (the character's identity checklist in `CHARACTER.md`).
- [ ] **Palette <= 32 colors** for the character (the packer warns above 48); no stray colors.
- [ ] **No anti-aliasing**, blur, gradients, dithering or semi-transparent edges; 1 px dark outline.
- [ ] No VFX, aura, ground shadow, text or background remnants (magenta fringe!).

**Geometry**

- [ ] **Silhouette readable at 1x** (view the sheet at 100 % and at 50 %: can you tell the pose?).
- [ ] **Feet on the baseline**: soles on y 180 for grounded frames; the feet do not slide between
      frames of a planted pose.
- [ ] **Same height**: the character is the same size as in idle (compare head size) and within
      the animation's body height; nothing clipped at the cell edges.
- [ ] Facing right, 3/4 view, both eyes visible.
- [ ] Frame count matches `manifest.json` (or update it on purpose, with a note).

**Motion and combat**

- [ ] **Strike extends to the right**: on active frames the fist/foot is the forward-most pixel,
      horizontal, at the zone height (SPEC contact zones), clearly separated from the body.
- [ ] Anticipation before the strike, recovery back to the stance; loops cycle without a pop.
- [ ] Hitbox in `anims.json` sits on the fist/foot on active frames only; hurtbox covers the body.
- [ ] In game (`?art=custom`): the hit visibly connects with the opponent's body at normal combo
      range; reactions recoil away from the attacker.
- [ ] Hand anchors for specials, beams and throws match SPEC "Effect anchor points" (or are
      recorded in `MOVES_AND_VFX.md`).

## Troubleshooting

| symptom | likely cause | fix |
|---|---|---|
| pink/magenta fringe around the character | ChatGPT anti-aliased into the background | re-pack (near-magenta pixels are removed); if it stays, touch up `frames/` or regenerate asking for "hard edges, no anti-aliasing" |
| grey blob under the feet | ChatGPT drew a ground shadow | regenerate with "no ground shadow", or erase it in the raw strip |
| character too big/small in game | strip's tallest frame doesn't match the expected pose | check `bodyHeight` for that animation; a raised arm or flying hair makes the tallest frame. Adjust the art or (with a note) the manifest value |
| feet slide / character jitters in a loop | uneven poses or a cloth/hair piece in the bottom rows | make sure only the feet are in the bottom 20 % of the frame; fix the pose |
| wrong frame count | poses touch or have gaps inside a pose | ask for more spacing, or save single frames `raw/<anim>_NN.png` |
| sheet not used in game | not every core animation is packed (`"complete": false`) | preview with `?art=custom`; finish the core set |
| new raw strip ignored | `frames/<anim>/` was hand-edited (the report warns "has manual edits") | keep the edits, or delete `frames/<anim>/` to discard them and re-import; untouched packer-written frames re-import automatically |
| hits land without touching / whiff at close range | strike not forward-most, wrong height, or spacing | fix the active pose; add `hitboxes.json` override; task Claude to tune `reach`/`lunge` |
| ChatGPT refuses the prompt | names or "style of" wording | use the fallback wording (STYLE_GUIDE); describe traits only |
| colors drift between strips | palette not restated / reference not attached | always attach model sheet + idle; restate hexes; regenerate |

## Commits and changelog

Conventional commits, one asset or one logical batch per commit:

```
art(naruto): add idle strip (raw)
art(naruto): pack light1-light3, hitbox override for light3
art(sasuke): approve core set
art(vfx): add spark and burst frames
docs(art): clarify contact zones for air attacks
chore(art): update tracker after pack
```

- Every commit that changes status also updates `TRACKER.md` **and** `manifest.json`.
- Add a line to `CHANGELOG.md` (Unreleased section) for anything the user will notice in game.
- Generated outputs in `public/characters/<id>/` are committed together with the source change
  that produced them.
- Official pictures collected from the anime/manga (`reference/source/`) are copyrighted: keep
  them local (`art/**/reference/source/` is git-ignored) and never upload them to ChatGPT as style
  sources.

## Adding a new character

1. Copy `art/characters/_template/` to `art/characters/<id>/`.
2. Fill `CHARACTER.md` (identity checklist, palette hexes, silhouette notes, expressions),
   `MOVES_AND_VFX.md` (special, projectile, beam, aura colors, anchors), `ANIMATIONS.md` (the
   specifics column for every frame) and `PROMPTS.md` (replace every `{{...}}`).
   Codex can draft all four from the template; the user reviews.
3. Add `characters.<id>` to `manifest.json` (copy `animationDefaults`, add `reference` and `ui`
   blocks like naruto's) and a section to `TRACKER.md`.
4. Open a task for Claude in `docs/TASKS.md`: register the fighter in `src/characters/` (stats,
   colors, special, projectile; new specials or projectiles need code).
5. Follow the [generation order](#generation-order) from step 1.

## VFX and UI

- **VFX**: same loop with `art/vfx/` (briefs in `art/vfx/EFFECTS.md`, prompts in
  `art/vfx/PROMPTS.md`), packed with `npm run sprites vfx` into `public/vfx/atlas.png` +
  `atlas.json`. Tinted effects are white/grey only.
- **Per-character UI**: save the ChatGPT image as `ui/<name>.png`. The packer removes the magenta
  and fits it to the exact size (nearest-neighbor or mode sampling, never smooth resampling) when
  it writes `public/characters/<id>/`. Optionally keep the untouched original as
  `raw/ui_<name>.png` (skipped by the packer).
- **Shared UI** (logo, title art): [ui/README.md](ui/README.md).
