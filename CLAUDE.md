# CLAUDE.md: GCD Tourney

Project instructions for Claude Code. Read this first in every session. Codex and other agents read
[AGENTS.md](AGENTS.md), which covers the same rules with a focus on the art workflow.

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
Codex, must agree on that coordinator before integration starts. This is a process rule, not an automated lock.
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

## What this project is

GCD Tourney is a browser **HD-2D pixel-art anime arena fighter** with a Dragon Ball FighterZ-style
feel. It's built with Three.js and Vite and has no other runtime dependencies. A real 3D tournament ground
(ring, temple, crowd, gate) hosts camera-facing pixel sprites. The camera is cinematic, and the
game has auras, super flashes and ultimate clashes (a rhythm duel). Four fighters exist today (Naruto, Sasuke, Killua, Gojo). Many
more will follow, so everything should stay data-driven and template-based.

The fighter art in the game today is **3D-baked placeholder art**: chibi models built in code and
rendered into 112 px sprite sheets (ppu 44) at startup. The long-term art is **hi-res pixel art on art
spec v2** ([ADR 0007](docs/decisions/0007-art-spec-v2-shippuden-256.md)): Naruto Shippuden designs,
serious anime proportions in the approved title style (not chibi; scale per ADR 0029), 256 px cells, pivot `[128,240]`, ppu 128.
Codex generates it with its built-in image generator, the user approves every versioned image in
[art/REVIEW.md](art/REVIEW.md), and `npm run sprites` packs it (see [art/README.md](art/README.md) and
[art/SPEC.md](art/SPEC.md)).

The user means this to be a long-term project. Optimize for clarity, small reversible changes and
documentation that stays true.

## Commands

| Command | What it does |
|---|---|
| `npm install` | install deps (three, vite, pngjs for the packer) |
| `npm run dev` | dev server at **http://127.0.0.1:5188** (`strictPort`, fails if the port is busy) |
| `npm run dev:alt` | same on port **5200** (use it when 5188 is taken, e.g. by the user's own session) |
| `npm run build` | production build to `dist/` (two entries: `index.html`, `sprites.html`). **Must pass.** |
| `npm run preview` | serve the built `dist/` |
| `npm run sprites` | pack all characters' art from `art/` into `public/characters/<id>/` + every world-art kind (vfx, crowd, stage, npc, ui; approved items only) |
| `npm run sprites naruto` | pack one character |
| `npm run sprites vfx` | pack only the VFX atlas into `public/vfx/` (approved effects only) |
| `npm run sprites crowd` | pack only the crowd atlas into `public/crowd/` (approved spectators only) |
| `npm run sprites stage npc ui` | pack the approved stage slots, NPC sheets and title art into `public/stage|npc|ui/` |
| `npm run sprites decals` | pack the approved ground decals into `public/decals/` (atlas.json + the pages of each page set, at most 4 per match; ADR 0024, `tools/pack-decals.mjs`) |
| `node tools/pack-sprites.mjs vfx crowd stage npc ui --candidates` | pack unapproved world art into git-ignored `public/preview/` (see it with `?art=custom`) |
| `npm run publish:github` | push a slim copy of `main` (no raw art) to the private repo github.com/eshin087/gcd-tourney |
| `npm run deploy` | build a clean export of HEAD (committed work only) and deploy it to Vercel production: https://gcd-tourney.vercel.app (only from `main`; `-- --preview` for a branch) |
| `npm run pr -- start feature/<name>` | optional manual CLI helper that creates a named worktree + branch off main in the repository's `.worktrees/` folder; `--art <id>[,<id>]` adds only that character's or art kind's raw art. Use the host's managed-worktree flow when available; never use `--full` for art work |
| `npm run pr -- open` | (in a worktree on a named branch, never detached HEAD) publish the branch slim and open or update its GitHub PR |
| `npm run pr -- preview` | (in the worktree) deploy the branch to a Vercel preview URL and link it on the PR, so the user can try it on a phone (ADR 0018; previews need a Vercel sign-in) |
| `npm run pr -- merge <branch>` | (in the main checkout) `--no-ff` merge, publish main (PR shows merged), remove the worktree, then deploy main to production (`--no-deploy` skips it) |
| `npm run pr -- prune [--dry-run]` | (in the main checkout) remove clean worktrees whose branch was merged; lists dirty ones and non-worktree copies in `.worktrees/` |
| `npm run lineup` | the cast side by side on one floor line (idle, run, heavy) with standing height and shoulder width per fighter, flagged against `art/scale/builds.json`; writes `art/scale/lineup.png` + `.json`. Attach it to every model sheet and idle review |
| `npm run body [id] [anim...]` | body sheet (TOOL-036): every packed frame beside idle f0 and the approved combat cell at one density, labelled with body size B (garment area vs idle f0) and head H; writes `art/scale/body-<id>.png` + `body-report.json`. Advisory (±10 %): confirm a flagged strip by its segments |
| `npm run test:anims` | tech pose test (`tools/test-tech-anims.mjs`: animation selection, beat transitions, back rolls, wall facing, missing-art fallbacks); run after changes to the tech states or `src/game/techAnim.js` |
| `npm run test:sprites` | packer regression test (`tools/test-pack-sprites.mjs`, fixtures in tools/.test-fixtures/, never touches art/ or public/); run after any tools/ change |

The project path contains a space (`.../Claude Code/gcdTourney`). Always quote paths in shell
commands. The shell is Windows. Use the PowerShell tool or Git Bash with POSIX syntax.

## Architecture map

Full write-up: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

```
index.html, src/main.js     game entry: renderer + input + Game, rAF loop, ?fight= / ?debug helpers
sprites.html, src/spriteLab.js   Sprite Lab: preview baked anims, copy ChatGPT prompts, import strips
lab.html, src/lab/   Test lab (ADR 0018): one-tap moves and scenarios, animation viewer with boxes, time tools
src/core/      renderer.js (low-res render + nearest upscale, bloom, grade), input.js (keyboard/gamepad/touch -> Pad),
               touch.js (on-screen joystick + buttons for phones), artIndex.js (prod list of packed art),
               audio.js (WebAudio synth: sfx, loops, music, crowd; no audio files)
src/game/      game.js (loop, match flow, melee/clash/KO hooks), clash.js (rhythm clash: chart, judge, CPU timing),
               fighter.js (state machine + physics + takeHit),
               moves.js (ALL move/frame data), kit.js (fighter kits: directional specials, special kinds, SUPER,
               passives; ADR 0009), ai.js (CpuBrain drives a Pad), projectiles.js (projectiles, vortex, beams),
               effects.js (VFX sprites, aura, overlay), camera.js (CameraDirector modes), boxViewer.js (hit/hurt box overlay), sprites.js (SheetAsset,
               SpriteActor, custom-sheet loading + animation FALLBACK), constants.js (world/ruleset constants)
src/characters/  one file per fighter (look, colors, stats, special/projectile, 3D model, stance, extra anims); index.js = ROSTER
src/art/       animGuide.js (canonical animation list + poses), vfxPainter.js (procedural VFX atlas),
               pixel.js, textures.js, crowdPainter.js (procedural pixel art)
src/art/rig/   3D chibi rig, toon shader, pose/keyframe system, shared anim library, sprite baker
src/world/     arena.js (ring, temple, stands + instanced crowd, gate, trees, sky; stage slot registry), worldArt.js (stage/NPC/title art loaders,
               NPC placement + event cues), voidStage.js (domain stage), trainingRoom.js (holographic practice stage)
src/ui/        hud.js (bars, combo, cut-ins, callouts, input history), menus.js (DOM menus, training panel, pause),
               controls.js (PS/Xbox/keyboard layouts, live highlights, rebinding, match/clash hints)
tools/         pack-sprites.mjs (art/ -> public/ packer, Node + pngjs)
art/           art source (versioned raws), briefs + image prompts, REVIEW.md queue (see art/README.md). Not shipped.
public/        shipped static files: characters/<id>/{sheet.png, anims.json, portrait.png, cutin.png, select.png}, vfx/atlas.*
docs/          SDLC docs, ADRs, task board, agent prompts
```

## Hard rules

### Worktree workflow rules

The docs-only/main exceptions below still apply.

1. Before starting, run `git worktree list` and report any worktree whose branch is already merged into
   `main` (check with `npm run pr -- prune --dry-run`; `git branch --merged` also lists brand-new branches).
2. Never copy the project folder as a substitute for a worktree. Use the host's managed-worktree feature when
   available. In a manual CLI session, the optional project helper can create a real Git worktree and branch.
3. For an art task created with the helper, use `npm run pr -- start <branch> --art <id>[,<id>]` so the required
   raw art is included without a full checkout. Never use `--full` for art work. A plain
   `git sparse-checkout add art/characters/<id>` does not bring back its `raw/` directory.
4. Use one worktree per task and reuse it for later versions (`v02`, `v03`, etc.) of that same task.
5. At handoff, report the worktree path so the coordinator can remove it after merging. The coordinator must
   finish cleanup of merged task worktrees. `npm run pr -- merge` automatically removes only the project-local
   worktree path created by the helper; archive or remove an app-managed worktree through the Codex app after
   its branch is merged.
6. Worktree storage is controlled by the user's Codex app or Git configuration. Do not require a repository-local
   worktree root, change the user's global Worktree root, or reject an app-managed worktree because it is outside
   this repository. Verify the actual returned path before using it. Audit existing worktrees for uncommitted and
   ignored files before moving, removing or archiving them.

### Code and integration rules

0. **Every new feature or character lands through a pull request** ([ADR 0013](docs/decisions/0013-pull-requests-in-worktrees.md)).
   Start or reuse one real managed worktree for the task. Use the worktree returned by the Codex app or other host
   when available. In a manual CLI session, `npm run pr -- start <branch>` is an optional helper; use its `--art`
   form for sparse art work. A managed worktree may start at a detached HEAD. Before editing or committing, run
   `git branch --show-current`; if it is empty, create or attach the intended named task branch after auditing the
   worktree status. Never run `npm run pr -- open` from a detached HEAD. Work and commit in the task worktree, run
   `npm run pr -- open`, then run
   `npm run pr -- merge <branch>` from the main checkout once the Definition of Done passes (unless the user asked
   to review first); the merge deploys to production. Never commit features straight to `main`, never
   `git checkout`/`switch`/`stash` in the shared main checkout, and never use the GitHub merge button or
   `gh pr merge`. Only docs-only edits, bookkeeping and art approvals for a character that already ships may
   commit straight to `main`. Revert a feature with `git revert -m 1 <merge>` in a `fix/revert-<name>` PR. Each
   worktree runs its own dev server port (`npx vite --port 52xx`). The main folder is merge-only, and
   `docs/NOW.md` / `docs/agents/CODEX_INBOX.md` are edited on `main` only
   ([AI_COLLABORATION.md](docs/AI_COLLABORATION.md#branches-worktrees-and-shared-files)). A new character is a
   Claude data PR, then Codex art PRs ([ADDING_A_CHARACTER.md](docs/ADDING_A_CHARACTER.md#0-plan-user--claude)).
1. **Gameplay timing lives in `src/game/moves.js`**, never in art. Animation frames are stretched over a
   move's startup, active and recovery phases (`phases` in anims.json).
2. **Animation names are a contract.** The canonical list is `src/art/animGuide.js`. Adding or renaming one
   means updating `animGuide.js`, `FALLBACK` in `src/game/sprites.js`, `src/art/rig/anims.js` (placeholder),
   `art/manifest.json`, `art/SPEC.md`, `ASSETS.md` and the art template, all in the same change.
3. **Generated files are outputs.** Never hand-edit `public/characters/<id>/sheet.png`, `anims.json` or
   `public/vfx|crowd|stage|npc|ui|decals/**`. Change the inputs (`art/**`, `hitboxes.json`, manifest) and re-run `npm run sprites`.
   Generated images are inputs with a `_vNN` version (ADR 0007): never overwrite, reuse or delete one.
4. **Character data lives in `src/characters/<id>.js`**. Shared systems should not special-case a character
   id (`if (def.id === 'naruto')`). Add a data field instead.
5. **No new runtime dependencies** without an ADR in `docs/decisions/`. Dev-only tools (pngjs) are fine
   when they're documented.
6. **Fail soft on art.** Missing or broken custom art must fall back to the baked placeholder or the
   procedural VFX, with one clear console line (prefix `[sprites]` / `[vfx]`). It must never crash.
7. Don't commit `node_modules/`, `dist/`, `.vercel/`, `.env*`, or secrets. Other agents (Codex) commit in the same
   working copy: commit only your own paths (`git commit -- <paths>`), never `git add -A`. Don't touch `.claude/` unless the user asks.
8. **Claim shared files.** Codex edits in the same working copy: before editing a file outside your usual lane,
   list it in your docs/TASKS.md row (`files: ...`) and check no in-progress Codex row lists it. Deploy only
   committed work (`npm run deploy` builds a clean export of HEAD).
9. Keep changes focused. Don't refactor unrelated code in the same change. Propose it as a task in
   [docs/TASKS.md](docs/TASKS.md).

## Conventions (summary)

Full guide: [docs/STYLE_GUIDE_CODE.md](docs/STYLE_GUIDE_CODE.md).

- Plain JavaScript ES modules, no TypeScript, no framework. Three.js via `import * as THREE from 'three'`.
- Match the surrounding style: 2-space indent, single quotes, semicolons, `const` by default, small arrow helpers.
- Comments explain **why** (intent, game-feel reasons, gotchas), not what the line does. Each module opens with a
  short header comment.
- Units: time in **60 fps frames** in the simulation (`DT = 1/60`), **world units = floor tiles**, angles in
  degrees in pose data and radians elsewhere.
- Data tables (`MOVES`, `SPECIALS`, `PROJECTILES`, character files) are plain object literals. Tune numbers
  there, not in logic.
- Hot paths (per-frame update/render) avoid allocations where it's easy. Reuse module-level temp vectors.
- Dispose GPU resources (materials, textures, geometries) you create per match or per effect.
- Debug-only code goes behind `?debug` in `src/main.js`.

## Testing protocol

Full checklist: [docs/TESTING.md](docs/TESTING.md).

1. `npm run dev` (or `dev:alt`), open `http://127.0.0.1:5188/?fight=naruto,sasuke&mode=solo&level=hard&debug`.
2. **The console must be clean.** No errors and no new warnings. Expected info lines are `[sprites] baked <id> from 3D in N ms`
   or `[sprites] using custom sheet for <id>`.
3. Drive the change with the debug helpers (only with `?debug`):
   - `step(n)` advances n fixed frames deterministically and pauses the live loop. It returns fighter states.
     `resumeLoop()` resumes.
   - `press('KeyJ', frames=3)` taps a key while stepping. `hold('KeyD')` / `release('KeyD')` hold one.
   - `tap(['KeyK','KeyL'])` sends a real-time key chord (async). `sleep(ms)`, `waitFight()`.
   - `freezeCpu()` makes the CPU stand still (a training dummy).
   - `snap()` / `unsnap()` copies the WebGL frame into a 2D canvas so screenshots of hidden tabs aren't blank.
   - `window.game` is the live `Game` (fighters, cam, fx, hud, brains, state).
   - Solo keys: move WASD, light J, heavy K, special L, jump Space, guard ShiftLeft, dash O.
4. For combat, AI or performance changes, run a **CPU-vs-CPU soak** of at least 3 full matches
   (recipe in docs/TESTING.md §Soak). Watch for console errors, NaN positions, stuck states and fighters
   leaving the ring outside a KO.
5. `npm run build` must pass.
6. When something visual changed, take a screenshot (`snap()` first) and look at it. Don't guess.
7. For moves and shared mechanics, the test lab (`/lab.html`) plays them in one tap; add a scenario to
   `src/lab/scripts.js` when you add a mechanic.

## Definition of done

A change is done when:

- [ ] It does what the task asked, and nothing else snuck in.
- [ ] The console is clean in a real match, and the relevant docs/TESTING.md checklist items pass.
- [ ] A CPU-vs-CPU soak passed (combat/AI/perf changes).
- [ ] `npm run build` passes.
- [ ] Docs are updated where behavior or contracts changed (README controls, ARCHITECTURE, COMBAT_DESIGN,
      art/SPEC.md, ASSETS.md).
- [ ] `CHANGELOG.md` has an entry under **Unreleased**.
- [ ] `docs/TASKS.md` status is updated (and `art/TRACKER.md` + `art/manifest.json` for art-facing work).
- [ ] An ADR exists for any architecture-level decision (new dependency, new pipeline, new core system).
- [ ] The commit message is a conventional commit (`feat(combat): ...`). See docs/CONTRIBUTING.md.
- [ ] Features and characters: on their own branch with a PR (`npm run pr -- open`), merged with `npm run pr -- merge`.

## Where docs live

| Doc | Purpose |
|---|---|
| [README.md](README.md) | player-facing overview, controls, run instructions |
| [AGENTS.md](AGENTS.md) | rules for Codex and other agents |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | modules, frame data flow, sprite pipeline, render |
| [docs/COMBAT_DESIGN.md](docs/COMBAT_DESIGN.md) | moveset, frame data, combat systems, hit rules |
| [docs/ADDING_A_CHARACTER.md](docs/ADDING_A_CHARACTER.md) | end-to-end new-fighter recipe |
| [docs/AI_COLLABORATION.md](docs/AI_COLLABORATION.md) | Claude / Codex / user (+ optional ChatGPT) roles and handoffs |
| [docs/TESTING.md](docs/TESTING.md) | manual checklists, debug helpers, soak, perf budget |
| [docs/ROADMAP.md](docs/ROADMAP.md) | milestones |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | branches, commits, review, versioning |
| [docs/TASKS.md](docs/TASKS.md) | the task board (owner, status) |
| [docs/STYLE_GUIDE_CODE.md](docs/STYLE_GUIDE_CODE.md) | coding conventions |
| [docs/decisions/](docs/decisions/README.md) | ADRs |
| [docs/agents/CODEX_PROMPT.md](docs/agents/CODEX_PROMPT.md) | copy-paste prompts for Codex |
| [CHANGELOG.md](CHANGELOG.md) | Keep a Changelog |
| [art/README.md](art/README.md) | art pipeline entry point (SPEC, STYLE_GUIDE, PIPELINE, TRACKER, manifest) |
| [art/REVIEW.md](art/REVIEW.md) | art review queue: one row per generated image version, newest first |
| [ASSETS.md](ASSETS.md) | sheet format + Sprite Lab quick-import path |

## Bookkeeping after every change

- `CHANGELOG.md` gets one line under `## [Unreleased]` in the right group (Added / Changed / Fixed / Removed).
- `docs/TASKS.md` moves the task's status and adds new follow-ups you discovered (owner + one-line note).
- `art/TRACKER.md` + `art/manifest.json` get updated when you change anything art-facing (new animation
  names, spec changes, packer behavior). Codex normally updates per-asset status and `art/REVIEW.md`.
- `docs/decisions/NNNN-*.md` gets a new ADR for decisions that future contributors would otherwise
  re-litigate.
- `docs/NOW.md` gets its "Your next actions" list updated whenever what the user has to do changes
  (approvals, prompts to paste into Codex, decisions), then run `npm run status -- --write`. The user works
  from a phone and switches between Claude and Codex; when they say **"status"**, run `npm run status` and
  answer with their next actions and anything waiting for review, in under 10 lines.

## Working with the other AIs

- **Codex** produces the art: it generates every image with its built-in image generator from the prompts
  in `art/`, saves it with a `_vNN` version, runs `npm run sprites`, does QA, adds a row to `art/REVIEW.md`,
  then stops for the user's `approve vNN` and updates the statuses. It can make small code/data changes that
  follow AGENTS.md. Session prompts: [docs/agents/CODEX_PROMPT.md](docs/agents/CODEX_PROMPT.md).
- **The user** reviews and approves every image (and can still generate one by hand in ChatGPT; it gets the
  same naming and review).
- **Claude (you)** owns engine and gameplay code, integration, the packer and tooling, the art spec
  (art/SPEC.md + ADRs), code review and QA soaks. When Codex or the user reports a packer or integration
  problem, fix the tool, not the output.
- The handoff protocol is in [docs/AI_COLLABORATION.md](docs/AI_COLLABORATION.md). In short: claim a task in
  docs/TASKS.md, make the change, log it in CHANGELOG, then hand back with a status and a note.

## Gotchas

- `step()` sets `window.__manualStep = true`, which stops the rAF loop from driving the game. Call
  `resumeLoop()` before testing in real time.
- Startup bakes every fighter on the main thread (blocking). Keep the bake under ~1 s per character.
- Gamepads only take control after one of their buttons is pressed (`InputManager.activeGamepads`).
- Audio needs a user gesture (first pointerdown/keydown calls `audio.init()`). `M` toggles mute.
- The renderer draws into a small buffer (360 px tall at 1080p; integer scale = round(height / 340)) and upscales with nearest-neighbor. Sub-pixel jitter in
  sprites shows up as shimmering, so keep sprite placement and scales pixel-consistent. Hi-res packs
  (`pixelsPerUnit` >= 70; spec v2 is 128) switch it to the `hd` detail (scale = floor(height / 600));
  override with `?res=pixel` or `?res=hd`.
- Spec v2 custom sheets are 4096 × 2816 px (16 columns of 256 px cells). Fine on desktop GPUs; a GPU with a
  2048 texture limit gets a downscaled sheet and a three.js warning (ADR 0007).
- Simulation randomness uses `Math.random()` (AI, the CPU's clash timing, FX; clash charts are seeded). That's fine for now. Online play
  will need a seeded RNG for the sim (see docs/ROADMAP.md).
