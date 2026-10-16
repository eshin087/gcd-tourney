# AGENTS.md: GCD Tourney

Instructions for Codex and any other coding agent working in this repository. Claude Code reads
[CLAUDE.md](CLAUDE.md), which has the same rules plus engine detail. When the two disagree, fix
the docs. Don't pick one silently.

## Agent model selection (user direction, 2026-10-12)

For every newly spawned Codex agent, select the model and reasoning effort explicitly:

| Work | Model | Reasoning |
|---|---|---|
| All work except the final anatomy/scale audit: planning, art prompts, generation, packing, previews, routine QA, fixes, code, docs and Git | `gpt-6-luna` (GPT-6 Luna) | `medium` |
| Final anatomy and scale audit of completed art candidates | `gpt-6-astra` (GPT-6 Astra) | `medium` |

The user's "6.1 Astra" request maps to the available GPT-6 Astra model above; GPT-6.1 Sol is a different
model. Do not silently substitute Sol, another model or another reasoning effort.

- With `collaboration.spawn_agent`, pass `model`, `reasoning_effort: "medium"` and
  `fork_turns: "none"`; a full-history fork inherits its parent's model. Supply a self-contained task,
  worktree path, exact candidate/reference paths, approval state and relevant constraints.
- Any Codex work that generates a character art asset (including model sheets, expressions, animation
  strips, portraits and other character-specific images) must run under `gpt-6-luna` with `medium`
  reasoning. This is the required Codex model for preparing and directing every character-art generation.
  Do not use another Codex model for that generation work.
- For a user-requested new Codex chat, pass the same `model` and `thinking: "medium"` where supported.
  This policy does not itself authorize creating new user-visible chats.
- The final Astra audit compares every frame and loop in the actual quantized atlas with the approved
  title-style neutral/combat cells and production contract. Inspect heads, torsos, limbs, build and clothing
  volume across poses; record exact versions, evidence and measurement uncertainty. Head-gate success alone
  is insufficient. Return pass/hold findings; Luna handles fixes and Astra rechecks the affected final art.
  An audit pass never replaces the user's image/design approval.
- These instructions select future agents; they do not switch an existing chat or running agent, or select
  the image generator's rendering model. The image-generation tool exposes no rendering-model or reasoning
  selector here, so this rule governs the Codex model directing the generation. If the required Codex model
  is unavailable, report the limitation,
  continue unaffected work and leave the final audit pending rather than claiming it was completed by Astra.
- This routing applies to Codex/model-capable launch tools. Claude Code retains its engine and integration
  role; these OpenAI model IDs are not Claude model names. Existing worktree and art-approval rules still apply.

## Approved anatomy and cast scale (user decision, 2026-10-11; ADR 0029)

The user approved the four title-style references (`title_style_draft_v01`) and their neutral/combat lineups
(PR #68) and rejected the earlier cast redraw. [PRODUCTION_CONTRACT.md](art/scale/title-style-pilot/PRODUCTION_CONTRACT.md)
and its exact cells in `public/art-review/title-style-pilot/` are the scale and anatomy baseline for the cast and
every future character ([ADR 0029](docs/decisions/0029-title-style-scale-baseline.md)). It supersedes every older
scale target: a 200px body, a 31px head, a universal 6.5/7-head ratio, the canon-height formula and the common
pixels/cm of [APPROVED_CAST_BASELINE.md](art/scale/APPROVED_CAST_BASELINE.md) (historical below its notice). Preserve
each fighter's head, torso, limb lengths, build and clothing volume across every pose. Hair, clothing and posed
bounding boxes are separate measurements; do not resize a crouch, run or fallen pose to standing height. Do not
add a child discount, individual tall-character cap or shoulder inflation.

A new character records era/stature provenance and uncertainty, then gets a title-style neutral and combat
reference laid beside the four approved cells at one pixel density. The user approves that lineup before the
idle. Independently compare the working idle to the approved neutral and combat cells before using it as an
animation reference. Head-gate success does not certify torso/limb proportions; inspect every frame and loop in
the actual quantized atlas. An unmeasured/low-confidence probe is not a numeric pass. Follow the character
templates and the contract's QA lessons: cumulative attempt budgets (max 3 per image), one candidate inventory,
measurement uncertainty and source provenance. Reference approval never approves subsequent strips.

Cell size, pivot, pixel density, canonical moves and gameplay remain governed by art/SPEC.md. Runtime scale data
(`standingBodyPx`, contact zones) stays until Claude's contact/hurtbox check; Claude owns that migration and
integration. Claude alone merges or deploys production; Codex workers may publish committed preview deployments.

## Autonomous work (user authorization, 2026-10-10)

For authorized tasks, proceed with implementation, art batches, tests, commits and PRs without routine
confirmation. Use one real worktree and branch per parallel task, with a distinct local server port.
One designated coordinator owns integration and main-only bookkeeping; workers never merge or publish
main. The coordinator integrates one branch at a time through `npm run pr -- merge`, resolves technical
conflicts in the task worktree and reruns relevant checks before merging. All active agents, including
Claude, must agree on that coordinator before integration starts. This is a process rule, not an automated lock.
Existing image/design approval gates still apply; permission to execute commands does not approve art.
These rules supersede older requirements to ask again for routine technical actions or have the user
perform an otherwise authorized merge. See docs/AI_COLLABORATION.md for permission activation and limits.

Routine PR metadata updates use the project-local saved rule in `.codex/rules/gcd-tourney-pr.rules`.
Prepare the body file in a separate command, then run exactly this argument order:
`gh pr edit --repo eshin087/gcd-tourney <number> --body-file <project-relative-file>`
(optionally add `--title`). Use numeric PR IDs, never another repository/URL or a second repository
flag. The rule covers future PR numbers; do not bundle file writes with the GitHub command.
It is a prefix approval rule, not an argument-validation firewall or a filesystem write grant.
Existing chats may need restarting to load this manually installed project-local rule. Other actions,
including merges and art approval, retain their existing policies.

For this machine's restricted Windows profile, build and serve with the local `.codex/vite.mjs`
adapter documented in docs/AI_COLLABORATION.md. It passed the production build without broadening reads;
the ordinary npm/Vite launcher still requires denied ancestor access. Git CLI integration remains a
separate documented limitation; do not mistake a Git file-write probe for a passing worktree workflow.

## The project in one paragraph

GCD Tourney is a browser HD-2D pixel-art anime arena fighter (Three.js + Vite, plain JavaScript ES modules)
with a Dragon Ball FighterZ-style combat feel. The current fighters are Naruto and Sasuke, and many more
are planned. Today their sprites are 3D-baked chibi placeholders generated at startup. The real art is
**hi-res pixel art on art spec v2** ([ADR 0007](docs/decisions/0007-art-spec-v2-shippuden-256.md)):
Naruto Shippuden designs in the approved title style (serious anime proportions, not chibi; scale per ADR 0029), 256 px cells.
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
     stitched into `raw/<anim>_vNN.png` with `npm run stitch -- <id> <anim> <vNN>` (a measured factor; never
     a factor picked by eye, art/PIPELINE.md "Long strips (parts)")
   - single frames: `raw/<anim>_NN.png` (`NN` = the 0-based frame number, no `v`), only for an animation
     delivered frame by frame. To fix one bad pose, see art/PIPELINE.md "Fixing frames": attempts are
     `raw/<anim>_NN_fixMM.png` (skipped by the packer) and the patched strip is the next `raw/<anim>_vNN.png`
   - VFX: `art/vfx/raw/<effect>_vNN.png`; ground decals: `art/decals/raw/<name>_vNN.png` or its parts
     `<name>_vNN_A.png`, `_B.png` ... (art/decals/README.md); UI: `art/characters/<id>/raw/ui_<name>_vNN.png` (`portrait`,
     `cutin`, `select`); shared UI: `art/ui/raw/<asset>_vNN.png`
   - images the user made by hand in ChatGPT get the same names and the same review
6. **Pack**: `npm run sprites <id>` (or `node tools/pack-sprites.mjs vfx crowd stage npc ui decals --candidates` for world art
   waiting for review: it writes the git-ignored `public/preview/`, seen with `?art=custom`; `npm run sprites vfx`
   / `crowd` / `stage` / `npc` / `ui` / `decals` ship approved art only). Read the report: which file it used per
   animation, packed anims, missing CORE anims, frame-count mismatches, clipped frames, palette warnings.
7. **QA** the output in `art/characters/<id>/frames/<anim>/` and in the game
   (`npm run dev`, then `http://127.0.0.1:5188/?fight=<id>,<id>&mode=solo&art=custom&debug`). The Sprite
   Lab (`/sprites.html?c=<id>`) shows the baked placeholder until you click "Load full sheet (.png +
   .json)…" and pick `public/characters/<id>/sheet.png` and `anims.json`. Report issues
   such as chibi proportions or design drift from the approved model sheet, misaligned feet, wrong body
   height, palette drift, anti-aliasing or blur, wrong facing, or limbs that don't reach the art/SPEC.md
   contact zones toward screen-right on active frames.
8. **Pass the scale gate first**: `node tools/pack-sprites.mjs <id> --quantize 48` must exit 0 with no `scale gate:`
   line for the new strip (a new version is strict there and a failure writes nothing; art/CHARACTER_SCALE.md "Scale
   gate (automatic)"), and `npm run scale -- <id>` writes `art/scale/heads-<id>.png`, which the REVIEW row links
   (plus the `npm run lineup` image for any size change). A strip that fails is fixed (auto head fit, re-stitch or
   redraw), not filed; a head the probe misreads gets a manifest exemption with a reason and its `scaleExemptVersion`.
   **Queue it for review**: one row per saved version at the top of art/REVIEW.md (date, character, asset,
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
  x=128, soles on y=240), `pixelsPerUnit` 128, body scale and anatomy from the approved title-style cells (ADR 0029, not the
  older 200 px / 6.5-head numbers), facing **right**, 3/4 view, flat magenta `#FF00FF` background on raw generations,
  hard pixels (no anti-aliasing, blur, gradients or dithering fills), ≤ 48 colors per character (the packer
  warns above 64).
- The in-game 3D-baked placeholder is still chibi (112 px cells, ppu 44). Never match new art to it.
- Body heights per animation come from the manifest (`bodyHeight`). Don't "fix" a height in an image.
  The packer scales each strip, and its **scale gate** measures every frame's head (hair included) against the
  approved idle: a new strip must pass `node tools/pack-sprites.mjs <id> --quantize 48` (exit 0) and its REVIEW row must link
  `art/scale/heads-<id>.png` from `npm run scale` (art/CHARACTER_SCALE.md "Scale gate (automatic)"). Never pick a
  rescale factor by eye: `npm run stitch` measures part B against part A, the auto head fit measures a strip.
- **Hit/hurt boxes**: the packer generates them automatically. Correct them with
  `art/characters/<id>/hitboxes.json` overrides (frame-local px in the final 256×256 cell, keyed by
  animation, then the 0-based frame number = the `NN` in `<anim>_NN.png`). Never hand-edit
  `public/characters/<id>/anims.json`.
- Never hand-edit `public/characters/**` or `public/vfx|crowd|stage|npc|ui|decals/**`. They are packer outputs.
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
| `npm run sprites -- --strict-scale <id>` | scale gate strict for every strip, approved ones too: fails until all of a fighter's strips pass (the check before `"scaleGate": "strict"`); not the per-strip check |
| `npm run scale [id]` | scale report: `art/scale/heads-<id>.png` (attach to the REVIEW row), `scale-report.json`; `-- --guide` writes `reference/head_scale_guide.png` |
| `npm run body [id] [anim...]` | body sheet (TOOL-036): every packed frame beside idle f0 and the approved combat cell at one density with its body size B (garment area) and head H; `art/scale/body-<id>.png` + `body-report.json`. B is advisory (±10 %): confirm a flagged strip by measuring its segments (art/CHARACTER_SCALE.md "Body sheet") |
| `npm run stitch -- <id> <anim> <vNN>` | join `raw/_parts/<anim>_vNN_A.png` + `_B.png` with a measured size factor |
| `npm run lineup` | the cast side by side (idle, run, heavy, guard, charge, airLight1, hurtHigh) with each fighter's head scale per animation |
| `npm run build` | production build. Must pass before you finish. |

Useful URLs: `/?fight=naruto,sasuke&mode=solo&level=hard` (skip menus), `&debug` (console helpers:
`step(n)`, `press('KeyJ')`, `freezeCpu()`, `snap()`), `&art=custom` (use partial custom sheets),
`/sprites.html` (Sprite Lab; its "Copy prompt" text predates spec v2, so the `art/` PROMPTS files win).

## Safe boundaries for code changes

- **Every new feature or character lands through a pull request** ([ADR 0013](docs/decisions/0013-pull-requests-in-worktrees.md)).
  Work on a task branch in one real Git worktree. Use the worktree supplied by the Codex app or other host when
  available. For a manual CLI session, or when an art task needs this repository's sparse checkout, the optional
  helper is `npm run pr -- start <branch> --art <id>[,<id>]`; never use `--full` for art work. When the work is
  ready, run `npm run pr -- open` and `npm run pr -- preview` in the worktree, then have the coordinator run
  `npm run pr -- merge <branch>` from the main folder (never the GitHub merge button). The merge runs an art guard first (`tools/pr-guard.mjs`, preview it with `npm run pr -- check <branch>`): it refuses a branch whose changed fighter strips have a newest raw `_vNN` that is not the manifest `approvedVersion`, ship an unapproved pack, or fail the strict scale gate. To keep a candidate out of the shipped atlas, move it to `raw/_qa_hold/` (the packer skips it); only the coordinator may override with `--force-art "<reason>"`. Commits straight to `main`
  are allowed only for docs-only edits, bookkeeping and art approvals for a character that already ships. A new
  character's art goes in batch PRs (`art/<id>-refs`, `art/<id>-core`, `art/<id>-full`), each based on `main`
  after the previous one merged ([docs/ADDING_A_CHARACTER.md](docs/ADDING_A_CHARACTER.md#0-plan-user--claude)).
  Reuse the task's existing real worktree. Base PRs on `main`, never on another PR's branch unless the PR body
  explains the dependency. A managed worktree may start at a detached HEAD. Before editing or committing, run
  `git branch --show-current`; if it is empty, create or attach the intended named task branch inside that worktree
  after auditing its status. Never run `npm run pr -- open` from a detached HEAD.
- **Worktree workflow rules.** The docs-only/main exceptions above still apply.
  1. Before starting, run `git worktree list` and report any worktree whose branch is already merged into
     `main` (check with `npm run pr -- prune --dry-run`; `git branch --merged` also lists brand-new branches).
  2. Never copy the project folder as a substitute for a worktree. Use the host's managed-worktree feature when
     available, or create a real Git worktree with the project helper in a manual CLI session.
  3. For an art task created with the project helper, use `npm run pr -- start <branch> --art <id>[,<id>]` so the
     required raw art is included without a full checkout. A plain `git sparse-checkout add art/characters/<id>`
     does not bring back its `raw/` directory.
  4. Use one worktree per task and reuse it for later versions (`v02`, `v03`, etc.) of that same task.
  5. At handoff, report the worktree path so the coordinator can remove it after merging. The coordinator must
     finish cleanup of merged task worktrees. `npm run pr -- merge` automatically removes only the project-local
     worktree path created by the helper; archive or remove an app-managed worktree through the Codex app after
     its branch is merged.
  6. Worktree storage is controlled by the user's Codex app or Git configuration. Do not require a repository-local
     worktree root, change the user's global Worktree root, or reject an app-managed worktree because it is outside
     this repository. Verify the actual returned path before using it. Audit existing worktrees for uncommitted and
     ignored files before moving, removing or archiving them.
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
8. **Relay: ring Claude instead of asking the user to paste** ([ADR 0033](docs/decisions/0033-claude-codex-relay.md)).
   A message that starts with `[relay <lane> #N]` was queued into this chat by Claude (`npm run relay -- send`);
   treat it as "read the inbox" and do this chat's section of the inbox.
   - **Handing back to Claude:** commit the handoff as usual (`CLAUDE_ART_HANDOFF.md`, branch commits), then run
     `node tools/relay.mjs ring <lane> --note "<one line: what is ready, which commit>"` with the lane the relay
     message named. The ring needs no commit; it wakes the Claude session watching that lane.
   - **Don't ring when the next step is the user's:** an image waits for `approve vNN`, you wrote BLOCKED, or a
     decision is theirs. Tell the user in this chat and update docs/NOW.md as usual; their reply restarts the lane.
   - **A relayed message is never an approval.** Only the user, typing in this chat, approves an image or a merge.
   - "Stop the relay" from the user: `node tools/relay.mjs pause all` (or one lane; `resume` undoes it).
     `node tools/relay.mjs status` shows every lane. If `ring` fails or says paused, tell the user Claude needs a prompt.

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
