# art/: start here

Everything needed to turn GCD Tourney's placeholder fighters into **hi-res pixel-art anime
fighters**: the briefs ChatGPT draws from, the raw images it produces, the cleaned frames, and the
status of every asset. Humans, ChatGPT and Codex all read this folder.

> The game never reads `art/` directly. `npm run sprites` packs it into `public/` (sheets,
> `anims.json`, VFX atlas, UI images). Until a character's core set is packed, the game keeps
> using its procedural placeholder.

## Read this first, depending on who you are

| you are | read | then |
|---|---|---|
| **the user** (running ChatGPT) | [PIPELINE.md](PIPELINE.md) (generation order + step by step) | open `characters/<id>/PROMPTS.md`, run the next prompt, save the image in `characters/<id>/raw/` |
| **ChatGPT** (image generator) | the prompt block you were given + the attached reference images; for context [STYLE_GUIDE.md](STYLE_GUIDE.md) | draw exactly what the block asks: one horizontal strip, facing right, flat #FF00FF background |
| **Codex** | `AGENTS.md` at the repo root, [PIPELINE.md](PIPELINE.md), [SPEC.md](SPEC.md), [TRACKER.md](TRACKER.md), [manifest.json](manifest.json) | tell the user the next prompt, file images, run `npm run sprites`, QA, update status (session prompt: [docs/agents/CODEX_PROMPT.md](../docs/agents/CODEX_PROMPT.md)) |
| **Claude** (Claude Code) | [SPEC.md](SPEC.md) (game-side contract), `CLAUDE.md` at the repo root | integrate, tune hitboxes/moves, extend the packer |

## The files

| file | what it is |
|---|---|
| [SPEC.md](SPEC.md) | the exact technical spec: cell size, pivot, proportions, every animation (frames, phases, body height), contact zones, anims.json, boxes, VFX atlas, packer, game contract. **Source of truth.** |
| [STYLE_GUIDE.md](STYLE_GUIDE.md) | look and feel: identity, shading, posing, animation principles, how to make hits connect, prompt wording |
| [PIPELINE.md](PIPELINE.md) | generate -> save raw -> pack -> preview -> test -> update tracker; generation order; ChatGPT consistency tricks; naming; QA checklist; troubleshooting; commits |
| [TRACKER.md](TRACKER.md) | human checklist of every asset per character, with status |
| [manifest.json](manifest.json) | the same, machine-readable (the packer reads frames/phases/bodyHeight from it) |
| [characters/_template/](characters/_template/) | copy-me folder for a new character |
| `characters/<id>/` | one folder per fighter: `CHARACTER.md`, `ANIMATIONS.md`, `MOVES_AND_VFX.md`, `PROMPTS.md`, `reference/`, `raw/`, `frames/`, `ui/` |
| `vfx/` | shared effects (sparks, bursts, Rasengan orb, lightning...): `EFFECTS.md`, `PROMPTS.md`, `raw/`, `frames/` |
| [ui/](ui/) | shared UI art: logo, title-screen key art |

```
art/
  README.md  SPEC.md  STYLE_GUIDE.md  PIPELINE.md  TRACKER.md  manifest.json
  characters/
    _template/   CHARACTER.md ANIMATIONS.md MOVES_AND_VFX.md PROMPTS.md hitboxes.example.json
                 reference/ raw/ frames/ ui/
    naruto/      (same layout, filled in)
    sasuke/      (same layout, filled in)
  vfx/           README.md EFFECTS.md PROMPTS.md reference/ raw/ (raw/_proposed/) frames/<effect>/
  ui/            README.md PROMPTS.md raw/ final/
```

> Do not use the Sprite Lab "Copy prompt" for production art: it still targets the old chibi
> placeholder (TOOL-002). Use `art/characters/<id>/PROMPTS.md`.

## The loop in 6 lines

1. Codex (or you) looks up the next `todo` asset in `manifest.json` (lowest `step` first).
2. You copy its prompt from `characters/<id>/PROMPTS.md` into ChatGPT, **attaching
   `reference/model_sheet.png` and `reference/idle_approved.png`** (once idle is approved).
3. Save the image as `characters/<id>/raw/<anim>.png` (exact name).
4. `npm run sprites <id>`, then preview in the Sprite Lab (`/sprites.html`) or in game with
   `?art=custom`.
5. Run the QA checklist; fix or regenerate; update `TRACKER.md` + `manifest.json`.
6. Commit (`art(<id>): ...`), and play it. When it looks right and hits connect, mark it `approved`.

## The spec in 10 numbers

192x192 cell · 16 columns · pivot [96, 180] · 86 px per world unit · facing right, 3/4 view ·
~136 px standing body (+16 px hair) · <= 32 colors · flat #FF00FF raw background · 38 animations /
154 frames per character (23 core) · VFX cells 128x128.

## Kick off a Codex art session

Paste **Prompt 1** from [docs/agents/CODEX_PROMPT.md](../docs/agents/CODEX_PROMPT.md) into
Codex (it also reads `AGENTS.md` automatically). Prompt 2 there adds a new character end to end.

## Rules that keep this folder healthy

- **SPEC.md is the source of truth.** If two docs disagree, fix the other one.
- **TRACKER.md and manifest.json change together**, in the same commit.
- `art/characters/<id>/` only ever holds that character's files. Shared things go in `vfx/` or `ui/`.
- New character = copy `_template/`, never start from scratch.
- Big changes (cell size, proportions, new animation names) need an ADR in `docs/decisions/` and a
  task for Claude (packer + engine).
