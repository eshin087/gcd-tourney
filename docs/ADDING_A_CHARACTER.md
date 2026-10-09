# Adding a character

This is the end-to-end recipe for a new fighter, from data file to approved hi-res art. It's written so
any of Claude, Codex or the user can pick up any step. Owners per step are suggestions. The task board
([TASKS.md](TASKS.md)) is the source of truth.

A new character touches four places:

| Where | What |
|---|---|
| `src/characters/<id>.js` | gameplay data, colors, stats, special/projectile/beam, 3D placeholder model, stance, extra anims |
| `src/characters/index.js` | registration in `ROSTER` |
| `art/characters/<id>/` | briefs and prompts for ChatGPT, raw images, cleaned frames, UI art, hitbox overrides |
| `public/characters/<id>/` | packer output (never edit by hand) |

Shared code (`src/game/moves.js`, `effects.js`, `audio.js`) changes only when the character brings a **new**
special, projectile or effect type.

## 0. Plan (User + Claude)

- Pick an **id**: lowercase ascii letters, digits and `_` (not leading: the packer skips folders that
  start with `_` or `.`), no spaces, e.g. `goku`, `rock_lee`. It's used in file names, URLs and the
  manifest.
- Write a one-paragraph concept: archetype, silhouette, signature special, projectile, ultimate name, colors,
  and how it should *feel* (rushdown, zoner, bruiser).
- Add tasks to [TASKS.md](TASKS.md): `CHAR-<id>-data`, `CHAR-<id>-briefs`, `ART-<id>-ref`, `ART-<id>-core`,
  `ART-<id>-optional`, `ART-<id>-ui`, `CHAR-<id>-balance`.
- Create a branch: `feature/char-<id>`.

## 1. Data file (Claude or Codex)

Copy `src/characters/naruto.js` to `src/characters/<id>.js` and change the fields:

| Field | Meaning |
|---|---|
| `id`, `name`, `subtitle` | identity. `name` is upper-case and shows in the HUD and cards. |
| `look` | one line of **visual traits** (hair, eyes, outfit, colors). The Sprite Lab prompt builder uses it. |
| `color` | signature UI and aura color (hex) |
| `aura`, `auraCore` | aura RGB (0..1) for flame tongues and the core streaks |
| `beam` | `{ core, mid, edge, name }`: ultimate beam colors + its name in the cut-in |
| `specialName`, `projectileName` | display names |
| `special` | a key in `SPECIALS` (`'rasengan'`, `'chidori'`, or a new one, see step 3) |
| `projectile` | a key in `PROJECTILES` (`'shuriken'`, `'fireball'`, or a new one) |
| `stats` | `{ speed, power, defense }`. Start at `{ 6.0, 1.0, 1.0 }` and tune in step 8. |
| `model`, `stance`, `extraAnims`, `runLean`, `runArms` | 3D placeholder (step 2) |
| `portraitFace`, `cutinRedEyes` | placeholder portrait expression, red eyes in the baked cut-in |

Register it in `src/characters/index.js` (`import` + add it to `ROSTER`). Keep the existing order. New
characters go at the end.

## 2. 3D placeholder model (Claude)

The game must be playable before any custom art exists, so every character gets a baked placeholder.

- `model.palette`: color ramps per material (`base`, `shadow`, `light`, optional `hi`). Use the character's
  real colors. The same hexes go into `art/characters/<id>/CHARACTER.md`.
- `model.outfit`: which material covers which body part (torso bands, sleeves, legs, sandals, collar).
- `model.hair`: spikes `[elevation, azimuth, length, radius, sides, tiltBack]` + bangs. Silhouette matters
  more than detail.
- `headband`, `face` (iris colors, whiskers, marks).
- `stance`: the fighting stance every move blends from (joint angles; see `src/art/rig/pose.js`).
- `extraAnims`: the character-specific keyframed `special`, `intro`, `taunt`, `win`. The shared moveset
  lives in `src/art/rig/anims.js`.

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
- The ultimate beam is shared. Only the colors and name come from `beam`.
- A genuinely new mechanic (stance switch, install, teleport special, sword reach) needs an **ADR** plus a
  data-driven hook, never `if (def.id === ...)` in shared code.

## 4. Art briefs (Codex, reviewed by the user)

1. Copy `art/characters/_template/` to `art/characters/<id>/`.
2. Fill in:
   - `CHARACTER.md`: visual traits from the source material (hair shape and color, eyes, marks, outfit layers,
     accessories, silhouette notes), the hex palette (≤ 32 colors, matching `model.palette`), proportions
     per art/SPEC.md, do's and don'ts, and what makes the character instantly recognizable.
   - `ANIMATIONS.md`: every animation from `src/art/animGuide.js` with frame counts, phases and the
     character-specific pose description (how *this* character punches, runs, charges, wins).
   - `MOVES_AND_VFX.md`: special, projectile, ultimate and aura look, plus which VFX effects they use and
     where the effect sits relative to the hand on each frame.
   - `PROMPTS.md`: copy-paste ChatGPT prompts in `art/manifest.json` step order: model sheet, expression
     sheet, then one prompt per animation strip, then UI (portrait, cut-in, select). Describe visual traits and say "anime fan-art sprite". Include the
     **fallback wording** for when a name or style request is refused.
3. Add the character to `art/manifest.json` (every animation with `frames`, `phases`, `bodyHeight`,
   `required`, `status: "todo"`) and to `art/TRACKER.md`.

Don't invent animation names. If the character needs a pose the list doesn't have, raise a task for
Claude (see CLAUDE.md, hard rule 2).

## 5. Generate the art (User in ChatGPT, coordinated by Codex)

Order matters for consistency. Follow the `step` numbers in `art/manifest.json` (details:
[art/PIPELINE.md "Generation order"](../art/PIPELINE.md#generation-order)):

1. **Model sheet** (front, 3/4 right, side, back, fighting stance, palette swatches) →
   **expression sheet** → **idle** (approved copy saved as `reference/idle_approved.png`). Save them to
   `art/characters/<id>/reference/` and attach them to every later prompt.
2. **CORE animations**, in step order: run; light1 to light4, heavy, airLight1, airHeavy; guard, hurtHigh,
   launched, down, getup; charge, beamCharge, beamFire, special; dash, jumpUp, jumpFall, land, win. The game
   uses a custom sheet only when all of these exist (or with `?art=custom`).
3. Optional animations, which otherwise fall back (see `FALLBACK` in `src/game/sprites.js`).
4. UI: `portrait.png` (96×96), `cutin.png` (480×128), `select.png` (384×384) saved in
   `art/characters/<id>/ui/` (the packer removes the magenta and fits the size).

Codex files each image as `raw/<anim>.png` (strip) or `raw/<anim>_NN.png` (single frames) and sets the status
to `raw`.

## 6. Pack and review (Codex)

```bash
npm run sprites <id>
```

- Read the report: packed anims, missing CORE anims, frame-count mismatches, clipped frames, palette > 48.
- Inspect `art/characters/<id>/frames/<anim>/` (cleaned frames you can touch up by hand and re-pack).
- Fix hit/hurt boxes with `art/characters/<id>/hitboxes.json` (frame-local px in the 192 cell, per animation
  and frame number). Strikes on active frames must cover the fist, foot or palm, nothing more.
- Set the status to `packed` in the manifest and tracker.

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
- Commit with `feat(char:<id>): add <Name>` for data/code and `art(<id>): ...` for art batches. Open a PR or
  self-review against the checklist in [CONTRIBUTING.md](CONTRIBUTING.md).

## Character readiness levels

| Level | Means |
|---|---|
| **L0 data** | playable with the baked placeholder, the shared moveset and a reused special |
| **L1 core art** | all CORE anims packed; the custom sheet loads by default |
| **L2 full art** | all optional anims + UI art + custom VFX approved |
| **L3 polished** | unique special/VFX/sfx, balance pass done, CPU tuned |
