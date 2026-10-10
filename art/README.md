# art/: start here

Required for every fighter and every body strip: [shared scale and anatomy gate](CHARACTER_SCALE.md). Technical packing success does not establish anatomical consistency.

Everything needed to turn GCD Tourney's placeholder fighters into **hi-res pixel-art anime
fighters**: the briefs the image generator draws from, the versioned images it produces, the review
queue, the cleaned frames, and the status of every asset. Humans, Codex and ChatGPT all read this
folder.

> The game never reads `art/` directly. `npm run sprites` packs it into `public/` (sheets,
> `anims.json`, VFX atlas, UI images). Until a character's core set is packed, the game keeps
> using its procedural placeholder.

**Current spec: hi-res sprite spec v2** ([ADR 0007](../docs/decisions/0007-art-spec-v2-shippuden-256.md)):
Naruto Shippuden designs, about 6.5 heads tall (serious anime proportions, not chibi), 256 px cells,
and a version number on every generated image. Spec v1 (192 px, ~4.3-head chibi, Part 1 outfits) is
retired; its one candidate is archived and listed as rejected in [REVIEW.md](REVIEW.md).

## Read this first, depending on who you are

| you are | read | then |
|---|---|---|
| **the user** | [REVIEW.md](REVIEW.md) (what is waiting for your decision), [PIPELINE.md](PIPELINE.md) (generation order) | approve or reject the top rows (in chat or in the table); play the game with `?art=custom` |
| **Codex** | `AGENTS.md` at the repo root, [PIPELINE.md](PIPELINE.md), [SPEC.md](SPEC.md), [REVIEW.md](REVIEW.md), [TRACKER.md](TRACKER.md), [manifest.json](manifest.json) | generate the next asset with the built-in image generator (approved references attached), save it as the next `_vNN`, queue it in REVIEW.md, run `npm run sprites`, QA, record the user's decision (session prompt: [docs/agents/CODEX_PROMPT.md](../docs/agents/CODEX_PROMPT.md)) |
| **ChatGPT** (optional, run by the user) | the prompt block you were given + the attached reference images; for context [STYLE_GUIDE.md](STYLE_GUIDE.md) | draw exactly what the block asks: one horizontal strip, facing right, about 6.5 heads tall, flat #FF00FF background |
| **Claude** (Claude Code) | [SPEC.md](SPEC.md) (game-side contract), `CLAUDE.md` at the repo root | integrate, tune hitboxes/moves, extend the packer |

> **World art** (500+ crowd spectators, stage set, announcer/NPCs, UI, VFX) and the parallel claim
> queue: start at [WORLD_ART.md](WORLD_ART.md) and [queue/README.md](queue/README.md) (ADR 0008).

## The files

| file | what it is |
|---|---|
| [SPEC.md](SPEC.md) | the exact technical spec (v2): cell size, pivot, proportions and landmarks, every animation (frames, phases, body height), contact zones, effect anchors, anims.json, boxes, VFX atlas, versioned file names, packer, game contract. **Source of truth.** |
| [STYLE_GUIDE.md](STYLE_GUIDE.md) | look and feel: serious Shippuden tone, 6.5-head anatomy, shading, posing, animation principles, how to make hits connect, prompt wording |
| [PIPELINE.md](PIPELINE.md) | generate -> save `_vNN` -> queue for review -> pack -> preview -> approve; generation order; parallel characters; consistency tricks; naming; QA checklist; troubleshooting; commits |
| [REVIEW.md](REVIEW.md) | the review queue: one row per generated image, newest first, with its status (`needs review` / `approved` / `rejected`) |
| [TRACKER.md](TRACKER.md) | human checklist of every asset per character, with status, latest version and approved version |
| [manifest.json](manifest.json) | the same, machine-readable (the packer reads the `spec` block and frames/phases/bodyHeight from it) |
| [characters/_template/](characters/_template/) | copy-me folder for a new character |
| `characters/<id>/` | one folder per fighter: `CHARACTER.md`, `ANIMATIONS.md`, `MOVES_AND_VFX.md`, `PROMPTS.md`, `reference/`, `raw/`, `frames/`, `ui/` |
| `vfx/` | shared effects (sparks, bursts, Rasengan orb, lightning...): `EFFECTS.md`, `PROMPTS.md`, `raw/`, `frames/` |
| [ui/](ui/) | shared UI art: logo, title-screen key art |

```
art/
  README.md  SPEC.md  STYLE_GUIDE.md  PIPELINE.md  REVIEW.md  TRACKER.md  manifest.json
  characters/
    _template/   CHARACTER.md ANIMATIONS.md MOVES_AND_VFX.md PROMPTS.md hitboxes.example.json
                 reference/ raw/ frames/ ui/
    naruto/      (same layout, filled in)
    sasuke/      (same layout, filled in)
  vfx/           README.md EFFECTS.md PROMPTS.md reference/ raw/ (raw/_proposed/, raw/_rejected/) frames/<effect>/
  ui/            README.md PROMPTS.md raw/ final/
```

> Do not use the Sprite Lab "Copy prompt" for production art: it still targets the old chibi
> placeholder (TOOL-002). Use `art/characters/<id>/PROMPTS.md`.

## The loop in 7 lines

1. Codex looks up the next asset without an approved version in `manifest.json` (lowest `step` first).
2. Codex generates it from `characters/<id>/PROMPTS.md` with its built-in image generator, **attaching
   `reference/model_sheet.png`, `reference/expressions.png` and `reference/idle_approved.png`** (each once
   it is approved).
3. It saves the image under the next version, e.g. `characters/<id>/raw/light1_v03.png` (never
   overwriting), and adds a `needs review` row at the top of [REVIEW.md](REVIEW.md).
4. `npm run sprites <id>` (the packer uses the highest `_vNN`), then preview in game with `?art=custom`
   or in the Sprite Lab (`/sprites.html?c=<id>`, then "Load full sheet (.png + .json)…" with
   `public/characters/<id>/sheet.png` and `anims.json`; otherwise it shows the baked placeholder); QA
   notes go in the REVIEW row.
5. You approve or reject it (chat or REVIEW.md). Rejected files move to `_rejected/`; the next try is
   a higher version.
6. Codex updates REVIEW.md, `TRACKER.md` and `manifest.json` (`version`, `approvedVersion`) together.
7. Commit (`art(<id>): ...`). Naruto and Sasuke can run in parallel in separate threads.

## Review the art on a phone

After packing the current Naruto and Sasuke candidates or recording an approval, run
`npm run review:export`, then `npm run build`. Open the built site on a URL your phone can reach:
`/art-review.html?c=naruto&a=run` or `/art-review.html?c=sasuke&a=run`. The page plays packed
frames at their recorded timings, shows QA notes, and links to the full-resolution original. It
is read-only; send the character, asset and version with your decision in chat or [REVIEW.md](REVIEW.md).

The export copies the selected `_vNN` originals into `public/art-review/` and gives each packed
sheet and metadata export a content-hashed name. It writes `review.json` for the page to load.
Export is **manual and intentional**: packing or building alone does not refresh the review
collection. The exporter validates the approved references and latest packed run before writing;
fix any reported mismatch, re-pack, then export again.

## The spec in 10 numbers

256x256 cell · 16 columns · pivot [128, 240] · 128 px per world unit · facing right, 3/4 view ·
~200 px standing body, ~6.5 heads (+ up to 20 px hair) · <= 48 colors (warn > 64) · flat #FF00FF raw
background · 38 animations / 154 frames per character (23 core) · VFX cells 128x128.

## Kick off a Codex art session

Prompts are in [docs/agents/CODEX_PROMPT.md](../docs/agents/CODEX_PROMPT.md) (Codex also reads
`AGENTS.md` automatically). Now: paste **Prompt 0** (spec v2 restart, both model sheets in parallel in
one session). Later: paste **Prompt 1** once per character, with `<id>` filled in, one session each.
Prompt 2 there adds a new character end to end.

## Rules that keep this folder healthy

- **SPEC.md is the source of truth** (it follows ADR 0007). If two docs disagree, fix the other one.
- **Every generated image gets a `_vNN` version** and a REVIEW.md row. Never overwrite or reuse a number.
- **REVIEW.md, TRACKER.md and manifest.json change together**, in the same commit.
- `art/characters/<id>/` only ever holds that character's files. Shared things go in `vfx/` or `ui/`.
- New character = copy `_template/`, never start from scratch.
- Big changes (cell size, proportions, new animation names) need an ADR in `docs/decisions/` and a
  task for Claude (packer + engine).
