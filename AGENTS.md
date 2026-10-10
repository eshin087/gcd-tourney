# AGENTS.md: GCD Tourney

Instructions for Codex and any other coding agent working in this repository. Claude Code reads
[CLAUDE.md](CLAUDE.md), which has the same rules plus engine detail. When the two disagree, fix
the docs. Don't pick one silently.

## The project in one paragraph

GCD Tourney is a browser HD-2D pixel-art anime arena fighter (Three.js + Vite, plain JavaScript ES modules)
with a Dragon Ball FighterZ-style combat feel. The current fighters are Naruto and Sasuke, and many more
are planned. Today their sprites are 3D-baked chibi placeholders generated at startup. The real art is
**hi-res pixel art on art spec v2** ([ADR 0007](docs/decisions/0007-art-spec-v2-shippuden-256.md)):
Naruto Shippuden designs, about 6.5 heads tall (serious anime proportions, not chibi), 256 px cells.
**You (Codex) generate it** with your built-in image generator from the briefs in `art/`, and the **user
reviews and approves** every image in [art/REVIEW.md](art/REVIEW.md). A Node packer (`npm run sprites`)
cleans and packs it into `public/characters/<id>/`, and the game picks it up automatically.

## Your main job: art producer

Unless a task says otherwise, you produce the art and keep the tracking files true. Session prompts are in
[docs/agents/CODEX_PROMPT.md](docs/agents/CODEX_PROMPT.md) (Prompt 0 restarts the art under spec v2).

1. **Read first**: [ADR 0007](docs/decisions/0007-art-spec-v2-shippuden-256.md) (the source of truth for
   every v2 number), [art/README.md](art/README.md), [art/SPEC.md](art/SPEC.md),
   [art/STYLE_GUIDE.md](art/STYLE_GUIDE.md), [art/PIPELINE.md](art/PIPELINE.md) and
   [art/REVIEW.md](art/REVIEW.md).
2. **Check the state** in [art/manifest.json](art/manifest.json) (machine-readable),
   [art/TRACKER.md](art/TRACKER.md) (human-readable) and art/REVIEW.md (the review queue). Manifest status
   values: `todo | raw | packed | approved`, plus `version` (newest saved) and `approvedVersion`. REVIEW.md
   row status: `needs review | approved | rejected`.
3. **Pick the next asset** per character: the lowest `step` in `art/manifest.json` without an
   `approvedVersion` (1 model sheet, 2 expression sheet, 3 idle, 4 run, 5 core attacks, 6 reactions,
   7 specials, 8 rest of core, 9 optional, 10 VFX, 11 UI). A character with a version marked `needs review` waits for
   the user first. Naruto and Sasuke can run **in parallel**, as separate generations (one thread per
   character, each touching only its own files and rows). Never put two characters in one image (only
   exception: the shared title key art in art/ui/PROMPTS.md, after both model sheets are approved).
4. **Generate it** from the prompt in `art/characters/<id>/PROMPTS.md` (or `art/vfx/PROMPTS.md`,
   `art/ui/PROMPTS.md`), attaching the approved references as image inputs: `reference/model_sheet.png`,
   then also `reference/expressions.png`, and `reference/idle_approved.png` from the run strip on. As
   identity references, attach only approved fixed-name files (`model_sheet.png`, `expressions.png`,
   `idle_approved.png`). Two exceptions: (a) a Part B prompt attaches Part A of the same version; (b) a
   retry of S1/S2 or a strip fix may attach the candidate being corrected, together with the list of
   changes. Never attach `reference/source/` (copyrighted, local comparison only), `reference/_old/` or v1
   files. Make up to 3 attempts, then save ONLY the single best attempt as the next version (one new
   version per round; unsaved attempts get no number).
5. **Save every image with a version number** (`_vNN`, two digits; never overwrite, reuse or delete a
   version; the next number is 1 + the highest `vNN` for that asset in the folder, `raw/_parts/`, the
   `_rejected/` subfolder and REVIEW.md):
   - model sheet / expressions: `art/characters/<id>/reference/model_sheet_vNN.png`, `expressions_vNN.png`
   - a strip: `art/characters/<id>/raw/<anim>_vNN.png` (poses left to right). The packer uses the highest
     version; a plain `raw/<anim>.png` is used only when no versioned file exists.
   - parts of a long strip (every strip with 6 or more frames): `raw/_parts/<anim>_vNN_A.png`, `_B.png`,
     stitched into `raw/<anim>_vNN.png` (art/PIPELINE.md "Long strips (parts)")
   - single frames: `raw/<anim>_NN.png` (`NN` = the 0-based frame number, no `v`), only for an animation
     delivered frame by frame. To fix one bad pose, see art/PIPELINE.md "Fixing frames": attempts are
     `raw/<anim>_NN_fixMM.png` (skipped by the packer) and the patched strip is the next `raw/<anim>_vNN.png`
   - VFX: `art/vfx/raw/<effect>_vNN.png`; UI: `art/characters/<id>/raw/ui_<name>_vNN.png` (`portrait`,
     `cutin`, `select`); shared UI: `art/ui/raw/<asset>_vNN.png`
   - images the user made by hand in ChatGPT get the same names and the same review
6. **Pack**: `npm run sprites <id>` (or `node tools/pack-sprites.mjs vfx crowd stage npc ui --candidates` for world art
   waiting for review: it writes the git-ignored `public/preview/`, seen with `?art=custom`; `npm run sprites vfx`
   / `crowd` / `stage` / `npc` / `ui` ship approved art only). Read the report: which file it used per
   animation, packed anims, missing CORE anims, frame-count mismatches, clipped frames, palette warnings.
7. **QA** the output in `art/characters/<id>/frames/<anim>/` and in the game
   (`npm run dev`, then `http://127.0.0.1:5188/?fight=<id>,<id>&mode=solo&art=custom&debug`). The Sprite
   Lab (`/sprites.html?c=<id>`) shows the baked placeholder until you click "Load full sheet (.png +
   .json)…" and pick `public/characters/<id>/sheet.png` and `anims.json`. Report issues
   such as chibi proportions or design drift from the approved model sheet, misaligned feet, wrong body
   height, palette drift, anti-aliasing or blur, wrong facing, or limbs that don't reach the art/SPEC.md
   contact zones toward screen-right on active frames.
8. **Queue it for review**: one row per saved version at the top of art/REVIEW.md (date, character, asset,
   file link, version, `needs review`, what changed, QA notes). Re-read REVIEW.md right before each edit;
   parallel threads only touch their own character's rows. Update `version` and the status in the
   manifest and TRACKER (`todo` -> `raw` on the first save, `raw` -> `packed` after a clean pack; a status
   never goes down, so an approved asset stays `approved` while a newer candidate waits). Then **stop**,
   show the user the
   latest version with a 3-line verdict (identity / proportions and pose / technical plus a recommendation),
   and wait for `approve vNN` or feedback.
9. **Apply the decision**:
   - `approve vNN`: row `approved`, `approvedVersion` = NN, status `approved`. Any other `needs review`
     row of the same asset becomes `rejected` (reason: superseded by vNN) and its file moves to
     `_rejected/`. Copy the approved model sheet
     / expressions to `reference/model_sheet.png` / `reference/expressions.png`, the approved idle strip to
     `reference/idle_approved.png`, and the approved UI image to `ui/<name>.png` (the packer removes the
     magenta and fits the size; shared UI is cleaned into `art/ui/final/`). If a newer unapproved strip
     exists, ask the user whether to reject it so the packer uses the approved one. Re-pack.
   - feedback or reject: row `rejected` with the reason. The file moves to the `_rejected/` folder next to
     it (`raw/_rejected/`, `reference/_rejected/`, `art/vfx/raw/_rejected/`, `art/ui/raw/_rejected/`; name
     kept, ignored by the packer) and the row's link is fixed. Re-pack, then generate the next version.
10. **Bookkeeping**: update [docs/TASKS.md](docs/TASKS.md), add a line to [CHANGELOG.md](CHANGELOG.md) under
    Unreleased, and commit after each approved step (`art(<id>): ...`). Parallel threads share one working
    copy, so:
    - commit on the current branch: the character's PR worktree for a new character (`feature/char-<id>`,
      ADR 0013), otherwise `main`; never `git checkout`, `switch` or `stash`
    - stage explicit paths only: this character's new or moved files (`reference/*_vNN.png`, the
      fixed-name copies, `raw/<anim>_vNN.png`, `raw/_parts/`, the `_rejected/` moves, `frames/<anim>/`,
      `public/characters/<id>/`) plus art/REVIEW.md, art/TRACKER.md, art/manifest.json, docs/TASKS.md and
      CHANGELOG.md. Never `git add -A`, `git add .` or `git commit -a`
    - if `.git/index.lock` exists, wait about 10 s and retry, up to 5 times
11. For a **new character**, copy `art/characters/_template/` to `art/characters/<id>/` and fill in
    CHARACTER.md, ANIMATIONS.md, MOVES_AND_VFX.md and PROMPTS.md. Add the character to the manifest and
    tracker. The end-to-end recipe is in [docs/ADDING_A_CHARACTER.md](docs/ADDING_A_CHARACTER.md).

World art (crowd, stage, NPCs, UI, VFX) runs as a parallel claim queue with one lead and many workers: [art/WORLD_ART.md](art/WORLD_ART.md), [art/queue/README.md](art/queue/README.md), ADR 0008. Commands: `npm run queue -- claim|done|release|status|next-file`. Prompts W1 (lead) and W2 (worker) in docs/agents/CODEX_PROMPT.md.

## Art rules you must never break

- **Never invent new animation names.** The canonical list is `src/art/animGuide.js` (mirrored in
  art/SPEC.md and the manifest). If a character needs something new, add a task for Claude in
  docs/TASKS.md instead.
- **Follow ADR 0007 and art/SPEC.md exactly**: 256×256 cells, 16 columns, pivot `[128,240]` (feet center on
  x=128, soles on y=240), `pixelsPerUnit` 128, standing body about 200 px from soles to top of skull,
  about 6.5 heads tall, facing **right**, 3/4 view, flat magenta `#FF00FF` background on raw generations,
  hard pixels (no anti-aliasing, blur, gradients or dithering fills), ≤ 48 colors per character (the packer
  warns above 64).
- The in-game 3D-baked placeholder is still chibi (112 px cells, ppu 44). Never match new art to it.
- Body heights per animation come from the manifest (`bodyHeight`). Don't "fix" a height in an image.
  The packer scales each strip.
- **Hit/hurt boxes**: the packer generates them automatically. Correct them with
  `art/characters/<id>/hitboxes.json` overrides (frame-local px in the final 256×256 cell, keyed by
  animation, then the 0-based frame number = the `NN` in `<anim>_NN.png`). Never hand-edit
  `public/characters/<id>/anims.json`.
- Never hand-edit `public/characters/**` or `public/vfx|crowd|stage|npc|ui/**`. They are packer outputs.
- Prompts describe **visual traits** (hair, outfit, colors, silhouette) and say "anime fan-art sprite".
  Don't depend on character or artist names. If the image generator refuses, use the fallback wording in
  the PROMPTS file.
- **Every generated image keeps its `_vNN` version.** Never overwrite, reuse or delete one. Raw
  generations are the source of truth for re-packing, and the versions are the review history.

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
`/sprites.html` (Sprite Lab; its "Copy prompt" text predates spec v2, so the `art/` PROMPTS files win).

## Safe boundaries for code changes

- **Every new feature or character lands through a pull request** ([ADR 0013](docs/decisions/0013-pull-requests-in-worktrees.md)).
  Run `npm run pr -- start feature/<name>` (add `--full` for art work, e.g. `feature/char-<id>`) from the main
  folder, then work, pack and commit **only inside the new worktree** (`.worktrees/<prefix>-<name>`).
  When it's done, `npm run pr -- open` there, and `npm run pr -- merge <branch>` from the main folder (never the
  GitHub merge button). Commits straight to `main` are allowed only for docs-only edits, bookkeeping and art
  approvals for a character that already ships. A new character's art goes in batch PRs (`art/<id>-refs`,
  `art/<id>-core`, `art/<id>-full`), each started from `main` after the previous one merged
  ([docs/ADDING_A_CHARACTER.md](docs/ADDING_A_CHARACTER.md#0-plan-user--claude)). Your app's own worktree is fine
  if it is on a named branch and you open the PR with `npm run pr -- open` from it. Base PRs on `main`, never on
  another PR's branch unless you say so in the PR body.
- **The main folder is merge-only.** Never leave uncommitted work there (git can't merge over it); docs-only and
  bookkeeping commits there go in right away. `docs/NOW.md` and `docs/agents/CODEX_INBOX.md` are edited only on
  `main`, never in a branch. Read the moveset from `art/characters/<id>/KIT.md`; ask Claude to change a move there
  rather than drawing a different one.
- **Shared code files: claim before you edit.** Claude and Codex work in the same folder at the same time. Before
  editing anything outside `art/` and `public/` (e.g. `tools/`, `src/`, `vite.config.js`, `package.json`), put the
  file paths in your task row in docs/TASKS.md (`files: tools/pack-sprites.mjs`) and check that no in-progress row
  of the other agent lists the same file. If one does, wait or ask. Run `npm run test:sprites` / `npm run build`
  before committing tool or code changes.
- **Deploys ship committed work only.** Use `npm run deploy` (it builds a clean export of HEAD). Never run
  `vercel deploy` from the working folder: it would publish whatever is half-finished there.
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
| **Claude (Claude Code)** | engine/gameplay code, integration, packer and tooling changes, the art spec (art/SPEC.md + ADRs), code review, QA soak tests |
| **Codex (you)** | art production: generating every image with the built-in image generator (model sheets first, then strips, VFX, UI), versioned filing, `npm run sprites`, QA, the art/REVIEW.md queue, status updates, new character briefs from the template, small code/data changes per these rules |
| **User** | reviews and approves every image (`approve vNN`), approves gameplay feel, makes product decisions, merges to `main`; can still generate an image by hand in ChatGPT (same naming and review) |
| **ChatGPT (optional, run by the user)** | manual image generation from the same `art/` prompts when the user wants it |

Handoff protocol (details in [docs/AI_COLLABORATION.md](docs/AI_COLLABORATION.md)):

1. **Tasks** live in [docs/TASKS.md](docs/TASKS.md) (id, title, owner, status, notes). Claim one by setting
   the owner and status to `in-progress` before you start.
2. **Every change** gets a line in [CHANGELOG.md](CHANGELOG.md) under `## [Unreleased]`.
3. **Art status** lives in [art/TRACKER.md](art/TRACKER.md) and [art/manifest.json](art/manifest.json), and
   every generated image has a row in [art/REVIEW.md](art/REVIEW.md). Keep all three in sync.
4. **Decisions** go in `docs/decisions/NNNN-title.md` (ADR). Codex may draft one, and Claude or the user
   accepts it.
5. When you finish, set the task to `review` (or `done` for pure bookkeeping) and write a one-line note
   about what changed and what to check.
6. **Check your inbox.** At the start of every session, and whenever the user says "read the inbox", read
   [docs/agents/CODEX_INBOX.md](docs/agents/CODEX_INBOX.md) and do the open items in the section for your thread
   (plus "Every thread"). That file is how Claude hands you work; tick items when done.
7. **Keep the user's "now" page current.** The user works from a phone and switches between Claude and
   Codex. Before you stop and hand back, edit "Your next actions" in [docs/NOW.md](docs/NOW.md) (what the
   user must do next: approvals, prompts to paste, decisions; remove what's done), then run
   `npm run status -- --write` and commit `docs/NOW.md` on `main` (a docs-only commit in the main folder; never in a branch). When the user says
   **"status"**, run `npm run status` and answer with the "Your next actions" list plus anything waiting for
   review, in under 10 lines.

## Definition of done (for agent work)

- [ ] Every image you saved has a `_vNN` name and a REVIEW.md row, and the user decided on the latest one
      (or it's clearly marked `needs review`).
- [ ] `npm run sprites` runs without errors for the touched character, and the report has no new warnings
      (or each warning is explained in the task notes).
- [ ] The game loads the art: the console shows `[sprites] using custom sheet for <id>` (or the documented
      fallback), with no console errors.
- [ ] Manifest, tracker, REVIEW, TASKS and CHANGELOG are updated.
- [ ] `npm run build` passes.
- [ ] Commits use conventional commits, e.g. `art(naruto): approve idle v03`, `docs(art): ...`,
      `fix(tools): ...`. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).
