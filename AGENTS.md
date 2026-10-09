# AGENTS.md: GCD Tourney

Instructions for Codex and any other coding agent working in this repository. Claude Code reads
[CLAUDE.md](CLAUDE.md), which has the same rules plus engine detail. When the two disagree, fix
the docs. Don't pick one silently.

## The project in one paragraph

GCD Tourney is a browser HD-2D pixel-art anime arena fighter (Three.js + Vite, plain JavaScript ES modules)
with a Dragon Ball FighterZ-style combat feel. The current fighters are Naruto and Sasuke, and many more
are planned. Today their sprites are 3D-baked placeholders generated at startup. The real art is
**hi-res pixel art** that the **user generates in the ChatGPT image generator** from the briefs in `art/`.
A Node packer (`npm run sprites`) cleans and packs it into `public/characters/<id>/`, and the game
picks it up automatically.

## Your main job: art-production coordinator

Unless a task says otherwise, you are the coordinator between the user, ChatGPT and the game:

1. **Read [art/README.md](art/README.md) first**, then [art/SPEC.md](art/SPEC.md),
   [art/STYLE_GUIDE.md](art/STYLE_GUIDE.md) and [art/PIPELINE.md](art/PIPELINE.md).
2. Check the state in [art/manifest.json](art/manifest.json) (machine-readable) and
   [art/TRACKER.md](art/TRACKER.md) (human-readable). Status values: `todo | raw | packed | approved`.
3. Tell the user **exactly which ChatGPT prompt to run next**, quoted from
   `art/characters/<id>/PROMPTS.md` (or `art/vfx/PROMPTS.md`, `art/ui/PROMPTS.md`), and which reference
   images to attach. Order: the lowest `step` in `art/manifest.json` whose status is `todo`
   (1 model sheet, 2 expression sheet, 3 idle, 4 run, 5 core attacks, 6 reactions, 7 specials,
   8 rest of core, 9 optional, 10 VFX, 11 UI).
4. When the user saves images, **file and rename them**:
   - a strip: `art/characters/<id>/raw/<anim>.png` (poses left to right)
   - single frames: `art/characters/<id>/raw/<anim>_NN.png` (`NN` = 00, 01, ...)
   - VFX: `art/vfx/raw/<effect>.png`; UI: `art/characters/<id>/ui/<name>.png` (`portrait`, `cutin`,
     `select`; the packer removes the magenta and fits it to size)
   - when the user approves `idle`, copy `raw/idle.png` to `reference/idle_approved.png` and tell
     the user to attach it from then on
5. Run `npm run sprites <id>` (or `npm run sprites vfx`) and **read the report**: packed anims, missing
   CORE anims, frame-count mismatches, clipped frames, palette > 48 colors.
6. **Review the output** in `art/characters/<id>/frames/<anim>/` and in the game
   (`npm run dev`, then `http://127.0.0.1:5188/?fight=<id>,naruto&art=custom&debug`). Report issues
   such as misaligned feet, wrong body height, palette drift, anti-aliasing or blur, wrong facing,
   design drift between frames, or limbs that don't reach toward screen-right on active frames.
7. **Update statuses** in `art/manifest.json` and `art/TRACKER.md` (`raw` after filing, `packed` after a
   clean pack, `approved` only after the user says it looks right in game). Also update
   [docs/TASKS.md](docs/TASKS.md) and add a line to [CHANGELOG.md](CHANGELOG.md) under Unreleased.
8. For a **new character**, copy `art/characters/_template/` to `art/characters/<id>/` and fill in
   CHARACTER.md, ANIMATIONS.md, MOVES_AND_VFX.md and PROMPTS.md. Add the character to the manifest and
   tracker. The end-to-end recipe is in [docs/ADDING_A_CHARACTER.md](docs/ADDING_A_CHARACTER.md).

Ready-made prompts for starting a Codex session: [docs/agents/CODEX_PROMPT.md](docs/agents/CODEX_PROMPT.md).

## Art rules you must never break

- **Never invent new animation names.** The canonical list is `src/art/animGuide.js` (mirrored in
  art/SPEC.md and the manifest). If a character needs something new, add a task for Claude in
  docs/TASKS.md instead.
- **Follow art/SPEC.md exactly**: 192×192 cells, 16 columns, pivot `[96,180]` (feet center on x=96,
  soles on y=180), `pixelsPerUnit` 86, facing **right**, 3/4 view, flat magenta `#FF00FF` background on
  raw generations, hard pixels (no anti-aliasing, blur, gradients or dithering fills), ≤ 32 colors per character.
- Body heights per animation come from the manifest (`bodyHeight`). Don't "fix" a height in an image.
  The packer scales each strip.
- **Hit/hurt boxes**: the packer generates them automatically. Correct them with
  `art/characters/<id>/hitboxes.json` overrides (frame-local px in the final 192 cell, keyed by
  animation, then the 0-based frame number = the `NN` in `<anim>_NN.png`). Never hand-edit
  `public/characters/<id>/anims.json`.
- Never hand-edit `public/characters/**` or `public/vfx/**`. They are packer outputs.
- Prompts describe **visual traits** (hair, outfit, colors, silhouette) and say "anime fan-art sprite".
  Don't depend on character or artist names. If ChatGPT refuses, use the fallback wording in the PROMPTS file.
- Keep raw generations. They are the source of truth for re-packing.

## Commands

| Command | What it does |
|---|---|
| `npm install` | install dependencies |
| `npm run dev` | game at http://127.0.0.1:5188 (`npm run dev:alt` uses port 5200 if 5188 is busy) |
| `npm run sprites [id\|vfx]` | pack art from `art/` into `public/` and print a QA report |
| `npm run test:sprites` | packer regression test (fixtures in tools/.test-fixtures/, never touches art/ or public/); run after any tools/ change |
| `npm run build` | production build. Must pass before you finish. |

Useful URLs: `/?fight=naruto,sasuke&mode=solo&level=hard` (skip menus), `&debug` (console helpers:
`step(n)`, `press('KeyJ')`, `freezeCpu()`, `snap()`), `&art=custom` (use partial custom sheets),
`/sprites.html` (Sprite Lab).

## Safe boundaries for code changes

- **Don't refactor engine code** (`src/core`, `src/game`, `src/art/rig`, `src/world`) without a task in
  docs/TASKS.md that assigns it to you. Engine and gameplay belong to Claude by default.
- Small, focused data changes are fine when a task asks for them: a new character file in
  `src/characters/`, registering it in `src/characters/index.js`, `hitboxes.json` overrides, manifest and
  tracker edits, docs.
- Match the surrounding style (2-space indent, single quotes, semicolons, plain ESM). Comments explain why.
  See [docs/STYLE_GUIDE_CODE.md](docs/STYLE_GUIDE_CODE.md).
- Gameplay numbers live in `src/game/moves.js` and character stats in `src/characters/<id>.js`. Don't
  tune them unless a task asks you to.
- Never commit `node_modules/` or `dist/`. Don't touch `.claude/`.
- If the packer misbehaves, **report it** (task for Claude with the exact command, input file and report
  output). Don't patch `public/` outputs by hand.

## Roles and handoff protocol

| Role | Owns |
|---|---|
| **Claude (Claude Code)** | engine/gameplay code, integration, packer and tooling changes, code review, QA soak tests, ADRs |
| **ChatGPT (image generator, run by the user)** | all bitmap art: reference model sheets first, then animation strips, VFX, UI, following `art/` briefs |
| **Codex (you)** | art-production coordination: next prompt, filing and renaming, `npm run sprites`, QA, status updates, new character briefs from the template, small code/data changes per these rules |
| **User** | runs ChatGPT, approves art and gameplay feel, makes product decisions, merges to `main` |

Handoff protocol (details in [docs/AI_COLLABORATION.md](docs/AI_COLLABORATION.md)):

1. **Tasks** live in [docs/TASKS.md](docs/TASKS.md) (id, title, owner, status, notes). Claim one by setting
   the owner and status to `in-progress` before you start.
2. **Every change** gets a line in [CHANGELOG.md](CHANGELOG.md) under `## [Unreleased]`.
3. **Art status** lives in [art/TRACKER.md](art/TRACKER.md) and [art/manifest.json](art/manifest.json).
   Keep both in sync.
4. **Decisions** go in `docs/decisions/NNNN-title.md` (ADR). Codex may draft one, and Claude or the user
   accepts it.
5. When you finish, set the task to `review` (or `done` for pure bookkeeping) and write a one-line note
   about what changed and what to check.

## Definition of done (for agent work)

- [ ] `npm run sprites` runs without errors for the touched character, and the report has no new warnings
      (or each warning is explained in the task notes).
- [ ] The game loads the art: the console shows `[sprites] using custom sheet for <id>` (or the documented
      fallback), with no console errors.
- [ ] Manifest, tracker, TASKS and CHANGELOG are updated.
- [ ] `npm run build` passes.
- [ ] Commits use conventional commits, e.g. `art(naruto): add idle and run strips`, `docs(art): ...`,
      `fix(tools): ...`. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).
