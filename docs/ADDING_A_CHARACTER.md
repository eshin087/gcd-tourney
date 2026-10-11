# Adding a character

Before generating: complete the [shared fighter scale gate](../art/CHARACTER_SCALE.md), including measured skull/limb landmarks and cross-cast comparison.

This is the end-to-end recipe for a new fighter, from data file to approved hi-res art. It's written so
any of Claude, Codex or the user can pick up any step. Owners per step are suggestions. The task board
([TASKS.md](TASKS.md)) is the source of truth.

A new character touches four places:

| Where | What |
|---|---|
| `src/characters/<id>.js` | gameplay data, colors, stats, special/projectile/beam, 3D placeholder model, stance, extra anims |
| `src/characters/index.js` | registration in `ROSTER` |
| `art/characters/<id>/` | briefs (KIT.md: the moveset brief both AIs read) and image prompts, versioned reference sheets and raw images, cleaned frames, UI art, hitbox overrides |
| `public/characters/<id>/` | packer output (never edit by hand) |

Shared code (`src/game/moves.js`, `effects.js`, `audio.js`) changes only when the character brings a **new**
special, projectile or effect type.

## 0. Plan (User + Claude)

- Pick an **id**: lowercase ascii letters, digits and `_` (not leading: the packer skips folders that
  start with `_` or `.`), no spaces, e.g. `goku`, `rock_lee`. It's used in file names, URLs and the
  manifest.
- Write a one-paragraph concept: design era / outfit (Naruto and Sasuke use their Shippuden designs), archetype,
  silhouette, signature special, projectile, ultimate name, colors, and how it should *feel* (rushdown,
  zoner, bruiser).
- Add tasks to [TASKS.md](TASKS.md): `CHAR-<id>-data`, `CHAR-<id>-briefs`, `ART-<id>-ref`, `ART-<id>-core`,
  `ART-<id>-optional`, `ART-<id>-ui`, `CHAR-<id>-balance`.
- **Pull requests** ([ADR 0013](decisions/0013-pull-requests-in-worktrees.md)). A character arrives in a few PRs, so
  each one can be reverted on its own and Claude and Codex never commit to the same branch:

  | PR | owner | branch (`npm run pr -- start <branch>`) | contains | merge when |
  |---|---|---|---|---|
  | 1. data | Claude | `feature/char-<id>` | steps 1-3: `src/characters/<id>.js`, roster, kit entries (+ an ADR for a new kind), placeholder model, `art/characters/<id>/KIT.md` (moveset + the poses each move needs) | playable on the baked placeholder (L0): soak and build pass |
  | 2. refs | Codex | `art/<id>-refs` (`--full`) | step 4 briefs + manifest/tracker entries, model sheet, expressions, idle | the user approved those images |
  | 3. core | Codex | `art/<id>-core` (`--full`) | the CORE animations: the custom sheet goes live (L1) | approved |
  | 4. full | Codex | `art/<id>-full` (`--full`) | optional + kit animations, UI images (L2) | approved |
  | later | either | `fix/<id>-<what>` | redraws, balance | |

  Start each art PR from `main` after the previous one merged (no stacking). Two characters can run in parallel:
  one Codex thread per character, each in its own worktree on its own branch. Claude merges every PR with
  `npm run pr -- merge <branch>` and deploys.

## 1. Data file (Claude or Codex)

Copy `src/characters/naruto.js` to `src/characters/<id>.js` and change the fields:

| Field | Meaning |
|---|---|
| `id`, `name`, `subtitle` | identity. `name` is upper-case and shows in the HUD and cards. |
| `look` | one line of **visual traits** (hair, eyes, outfit, colors). The Sprite Lab prompt builder uses it. |
| `color` | signature UI and aura color (hex) |
| `aura`, `auraCore` | aura RGB (0..1) for flame tongues and the core streaks |
| `beam` | `{ core, mid, edge, name, width? }`: ultimate beam colors, its name in the cut-in, optional width |
| `specialName`, `projectileName` | display names |
| `special` | a key in `SPECIALS` (`'rasengan'`, `'chidori'`, or a new one, see step 3) |
| `projectile` | a key in `PROJECTILES` (`'shuriken'`, `'fireball'`, or a new one) |
| `kit` | **required** ([ADR 0011](decisions/0011-kit-baseline-and-balance.md)): `{ specials: { neutral, forward, up, down, back?, air, airDown? }, super, ultimate?, passive? }`. Slots map to `SPECIAL_MOVES` ids, `super` (and an optional non-beam `ultimate`) to `SUPERS` ids, `passive` to a `PASSIVES` id. Every slot stays inside the ADR 0011 budget table. |
| `superName` | display name of the second super (char select) |
| `stats` | `{ speed, power, defense }`. Start at `{ 6.0, 1.0, 1.0 }` and tune in step 8. |
| `model`, `stance`, `extraAnims`, `runLean`, `runArms` | 3D placeholder (step 2) |
| `portraitFace`, `cutinEyes` | placeholder portrait expression; baked cut-in eyes (`true`/`'red'` Sharingan, `'six'` Six Eyes; `cutinRedEyes` still works) |
| `selectFacing` | `'left'` or `'right'` (default): which way the character-select illustration (`ui/select.png`) faces; char select mirrors it so both sides face the middle |

Register it in `src/characters/index.js` (`import` + add it to `ROSTER`). Keep the existing order. New
characters go at the end.

## 2. 3D placeholder model (Claude)

The game must be playable before any custom art exists, so every character gets a baked placeholder. The
placeholder rig is chibi (112 px cells, PPU 44) even though the real art is ~6.5 heads (spec v2). That's
expected: it stands at the same world height, and restyling the rig is a separate task (ENG-016).

- `model.palette`: color ramps per material (`base`, `shadow`, `light`, optional `hi`). Use the character's
  real colors. The same hexes go into `art/characters/<id>/CHARACTER.md`.
- `model.outfit`: which material covers which body part (torso bands, sleeves, legs, sandals, collar).
- `model.hair`: spikes `[elevation, azimuth, length, radius, sides, tiltBack]` + bangs. Silhouette matters
  more than detail.
- `headband`, `blindfold` (`{ mat, y, h, r }`; a pose lifts it with `blindfold: false`), `face` (iris colors, whiskers, marks).
- `stance`: the fighting stance every move blends from (joint angles; see `src/art/rig/pose.js`).
- `extraAnims`: the character-specific keyframed `special`, `intro`, `taunt`, `win`, plus any kit
  animations the kit uses (`specialForward`, `specialUp`, `specialDown`, `superPose`; missing ones fall back to
  `special`/`special`/`charge`/`taunt`). The shared moveset lives in `src/art/rig/anims.js`.
- A body that is genuinely taller or shorter than the cast (Gojo, Killua) changes `props` and needs the art
  side of [ADR 0010](decisions/0010-per-character-body-scale.md): `standingBodyPx`, a scaled `bodyHeight`
  table and a reach check.

Check it in the **Sprite Lab** (`/sprites.html`) and in a match. The console prints the bake time. Keep it
**under 1 s per character**.

## 3. Special, projectile, ultimate (Claude)

- **Reuse first.** If the special behaves like Rasengan or Chidori (charge → rush → launch), point `special`
  at the existing entry, or add a new `SPECIALS` entry in `src/game/moves.js` with its own numbers, `name`,
  `color`, `fx` and `sfxLoop`.
- A new `fx` kind needs a branch in `Effects.handTick` (`src/game/effects.js`) that draws it in the hand during
  startup and active. A new `sfxLoop` kind needs a case in `AudioEngine.loop` (`src/core/audio.js`).
- A new projectile is a `PROJECTILES` entry. `sprite` must be a VFX atlas effect name (add one in
  `vfxPainter.js` + the art/vfx briefs if needed).
- **Not every ultimate is a beam.** The shared beam (colors and name from `beam`) is one ultimate kind among
  several: a `kit.ultimate` names a `SUPERS` entry instead (`ignite`, `skyStrike`, `domain`, `flurry`, ...). Look
  at the cast table in ADR 0011 §2 first and pick a shape the cast doesn't already overuse: the user wants
  varied finishers and cool moments, with clashes only where both moves make sense together. Whatever the kind,
  its poses are `beamCharge` / `beamFire` (the names are a contract), so KIT.md says what they show.
- **KIT.md is the moveset's single source.** Claude writes `art/characters/<id>/KIT.md` (from
  `art/characters/_template/KIT.md`) in the data PR: every slot, its kind and numbers, the animation it uses and
  what each pose must show. Codex builds ANIMATIONS.md and PROMPTS.md from it. A later move change edits KIT.md in
  the same PR as the data.
- **The kit baseline is mandatory** ([ADR 0011](decisions/0011-kit-baseline-and-balance.md)): neutral, →, ↑, ↓
  and air specials, a second super and an ultimate (the shared beam or a `kit.ultimate`), each inside the
  slot's cost and damage budget, and stats with a stat index `(speed / 6.2) × power × defense` of 0.93-1.02.
  Pick moves from the fighter's **art era** (early Shippuden Naruto has no Sage Mode).
- **Kits first** ([ADR 0009](decisions/0009-move-system-v2.md)). Most iconic moves are a `SPECIAL_MOVES`
  entry of an existing *kind*: `rush`, `shot`, `teleport`, `pull`, `dive`, `counter` (`onCounter` freeze /
  strike / behind) or `mode`. Second supers and non-beam ultimates are `SUPERS` entries of kind `flurry`,
  `domain`, `skyStrike` or `ignite`. All four current fighters are worked examples. Tune the numbers in
  `moves.js`. `kit.js` stays generic.
- **Balance check:** add the fighter to the CPU round-robin (docs/TESTING.md "Balance round-robin") and log the
  result in ADR 0011's balance log.
- A genuinely new mechanic (stance switch, install, sword reach, a new special kind) needs an **ADR** plus a
  data-driven hook (a new kind in `src/game/kit.js`), never `if (def.id === ...)` in shared code. Teach the
  CPU about a new kind in `CpuBrain.pickSpecial` (`src/game/ai.js`).

## 4. Art briefs (Codex, reviewed by the user)

1. Copy `art/characters/_template/` to `art/characters/<id>/`.
2. Fill in:
   - `CHARACTER.md`: the design era, visual traits from the source material (hair shape and color, eyes,
     marks, outfit layers, accessories, silhouette notes), the hex palette (≤ 48 colors, matching
     `model.palette`), proportions per art/SPEC.md (spec v2: about 6.5 heads, not chibi), an identity
     checklist that every model sheet is checked against, do's and don'ts, and what makes the character
     instantly recognizable.
   - `ANIMATIONS.md`: every animation from `src/art/animGuide.js` with frame counts, phases and the
     character-specific pose description (how *this* character punches, runs, charges, wins).
   - `MOVES_AND_VFX.md`: special, projectile, ultimate and aura look, plus which VFX effects they use and
     where the effect sits relative to the hand on each frame.
   - `PROMPTS.md`: copy-paste image prompts (for Codex's built-in image generator, also usable by hand in
     ChatGPT) in `art/manifest.json` step order: S1 model sheet, S2 expression sheet, then one prompt per
     animation strip, then UI (portrait, cut-in, select), each with its versioned save name
     (`<asset>_vNN.png`). Describe visual traits and say "anime fan-art sprite". Include the
     **fallback wording** for when a name or style request is refused.
3. Add the character to `art/manifest.json` (every animation with `frames`, `phases`, `bodyHeight`,
   `required`, `status: "todo"`) and to `art/TRACKER.md`. Until his strips are approved the packer's scale gate is
   strict for them (art/CHARACTER_SCALE.md "Scale gate (automatic)"); once every strip passes, set
   `"scaleGate": "strict"` on the character so it stays that way. If his hair shares body or outline colours, declare
   `headColors` in his `art/scale/builds.json` row (check the first `npm run scale` heads sheet: the green boxes must
   sit on the hair).

Don't invent animation names. If the character needs a pose the list doesn't have, raise a task for
Claude (see CLAUDE.md, hard rule 2).

## 5. Generate the art (Codex generates, the user approves)

Codex generates every image with its built-in image generator (session prompt: Prompt 1 in
[agents/CODEX_PROMPT.md](agents/CODEX_PROMPT.md)). The user can also generate one by hand in ChatGPT; it
gets the same naming and review. Order matters for consistency. Follow the `step` numbers in
`art/manifest.json` (details: [art/PIPELINE.md "Generation order"](../art/PIPELINE.md#generation-order)):

1. **Model sheet** (front, 3/4 right, true side profile, back, fighting stance, palette swatches) →
   **expression sheet** → **idle**. Before S1, the canon height and **build class** go into CHARACTER.md §3 and
   `art/scale/builds.json`; the model sheet, idle, run and heavy reviews each attach an `npm run lineup` image of
   the new fighter next to the cast (art/CHARACTER_SCALE.md "Lineup review"), and a build outside its class band is
   rejected. Each approved one is copied to its fixed name in
   `art/characters/<id>/reference/` (`model_sheet.png`, `expressions.png`, `idle_approved.png`) and
   attached to every later prompt.
2. **CORE animations**, in step order: run; light1 to light4, heavy, airLight1, airHeavy; guard, hurtHigh,
   launched, down, getup; charge, beamCharge, beamFire, special; dash, jumpUp, jumpFall, land, win. The game
   uses a custom sheet only when all of these exist (or with `?art=custom`).
3. Optional animations, which otherwise fall back (see `FALLBACK` in `src/game/sprites.js`).
4. UI: portrait (96×96), cut-in (480×128), select (384×384), generated as `raw/ui_<name>_vNN.png`; the
   approved one is copied to `art/characters/<id>/ui/<name>.png` (the packer removes the magenta and fits
   the size).

Every generated image is saved with a version number and never overwritten
([ADR 0007](decisions/0007-art-spec-v2-shippuden-256.md)): `reference/model_sheet_vNN.png`,
`reference/expressions_vNN.png`, `raw/<anim>_vNN.png` (strip; the packer uses the highest version),
`raw/_parts/<anim>_vNN_A.png` / `_B.png`, `raw/<anim>_NN_fixMM.png` for single-frame fix attempts (the
patched strip is saved as the next `raw/<anim>_vNN.png`), and `raw/<anim>_NN.png` only for an animation
delivered frame by frame. Codex adds a row for each one to [art/REVIEW.md](../art/REVIEW.md), sets the
status to `raw` (when it was `todo`; a status never goes down) with the newest `version`, and
stops for the user's `approve vNN` (which sets `approvedVersion`) or feedback (the version is rejected and
the next one generated).

Lessons from the first four fighters:

- **One scale per strip.** A strip stitched from parts (`raw/_parts/<anim>_vNN_A.png` / `_B.png`) must calibrate
  every part to the same head size ([art/CHARACTER_SCALE.md](../art/CHARACTER_SCALE.md)). A part packed
  at its own scale makes the fighter grow or shrink in the middle of a move (Sasuke's light2, light3 and special,
  2026-10-10). Stitch with `npm run stitch` (a measured factor), never a factor picked by eye.
- **Every strip at the idle's size.** Killua grew and shrank in fights (2026-10-10) because strips were packed
  12-34 % off his idle: a fist above the head shrinks a whole strip, a redraw with a smaller hair mass shrinks his
  head. The packer's scale gate now measures every frame; a new strip must pass it (a failure writes nothing).
- **Commit after every approved step, in your branch.** Never leave work uncommitted in the main folder: on
  2026-10-10 a whole session of uncommitted art had to be split into PRs by hand before anything else could merge.
- **UI images ship only after approval:** the approved `raw/ui_<name>_vNN.png` is copied to `ui/<name>.png` and
  packed; until then the game shows the placeholder portrait and cut-in.

## 6. Pack and review (Codex)

```bash
npm run sprites <id>
node tools/pack-sprites.mjs <id> --quantize 48                  # the scale gate: exit 0, no `scale gate:` line
npm run scale -- <id>                                           # art/scale/heads-<id>.png for the REVIEW row
```

- Read the report: the `_vNN` file used per animation, packed anims, missing CORE anims, frame-count
  mismatches, clipped frames, palette warnings (spec v2 target ≤ 48 colors; the packer warns above 64), and the
  **scale gate** line: every strip's head (hair included) against the idle. A `scale gate:` failure is fixed before
  the REVIEW row is filed (auto head fit, re-stitch or redraw; art/CHARACTER_SCALE.md "Scale gate (automatic)").
- Inspect `art/characters/<id>/frames/<anim>/` (cleaned frames you can touch up by hand and re-pack).
- Fix hit/hurt boxes with `art/characters/<id>/hitboxes.json` (frame-local px in the 256 cell, per animation
  and frame number). Strikes on active frames must cover the fist, foot or palm, nothing more.
- Set the status to `packed` in the manifest and tracker.
- Before handing back, check the packed files match their inputs: repack into a scratch folder
  (`node tools/pack-sprites.mjs <id> --out <tmp> --no-writeback --quantize 48`) and compare `sheet.png` and
  `anims.json` with `public/characters/<id>/` byte for byte. A difference means `public/` is stale or an input
  changed after packing.

## 7. Test in game (Claude or Codex, then the user)

- `http://127.0.0.1:5188/?fight=<id>,naruto&mode=solo&level=hard&debug` (add `&art=custom` while
  the set is incomplete).
- Run the per-character checklist in [TESTING.md](TESTING.md#character-checklist): every move animates, the
  feet don't slide or pop between animations, sparks land on the body, the special and projectile look
  right, the portrait and cut-in show, and mirror matches are tinted.
- Run a CPU-vs-CPU soak (3+ matches) with the new character on both sides.
- The user approves the look, and the status becomes `approved`.

## 8. Balance (Claude + User)

- Start from the shared moveset. Tune `stats` first, then the special and projectile numbers.
- Compare against the existing cast in the [COMBAT_DESIGN.md](COMBAT_DESIGN.md) tables and add the new row
  to the character table.
- Note balance decisions in CHANGELOG under **Changed**.

## 9. Ship it

- Update README.md (roster mention if needed), CHANGELOG.md (**Added**: "<Name> fighter"), TASKS.md and the
  tracker.
- Commit with `feat(char:<id>): add <Name>` for data/code and `art(<id>): ...` for art batches, in the PR's
  worktree. `npm run pr -- open` there; Claude reviews against the checklist in [CONTRIBUTING.md](CONTRIBUTING.md)
  and merges with `npm run pr -- merge <branch>` (never the GitHub button), then deploys.

## Character readiness levels

| Level | Means |
|---|---|
| **L0 data** | playable with the baked placeholder, the shared moveset and a reused special |
| **L1 core art** | all CORE anims packed; the custom sheet loads by default |
| **L2 full art** | all optional anims + UI art + custom VFX approved |
| **L3 polished** | unique special/VFX/sfx, balance pass done, CPU tuned |
