# CLAUDE.md: GCD Tourney

Project instructions for Claude Code. Read this first in every session. Codex and other agents read
[AGENTS.md](AGENTS.md), which covers the same rules with a focus on the art workflow.

## One central chat (user decision, 2026-10-15; OPS-016, ADR 0039)

At every session start, read the main checkout's [docs/COORDINATION.md](docs/COORDINATION.md) and
[docs/agents/CONTROL_CHAT.json](docs/agents/CONTROL_CHAT.json). The Claude chat **`0 - Approvals`** is the one
central chat: approvals and decisions, status, forwarding the user's instructions to Codex chats, and the reset
after chats are deleted. The Codex control chat ("0 - G") and its attention monitor are retired; do not start
coordinators or monitors anywhere else.

## Approvals desk (user decision, 2026-10-15; ADR 0039)

Only the Claude chat titled **`0 - Approvals`** asks the user for an approval or decision; it runs `/approvals`
(`.claude/skills/approvals/SKILL.md`) and watches one queue with `node tools/relay.mjs wait all`. **Every other Claude
chat never asks the user itself** (no AskUserQuestion for approvals or decisions): it runs
`node tools/relay.mjs ask --from "<this chat's title>" --session <its local_ id from get_session self> --kind
approval|decision|blocked --note "<question; versions>" --link <review url>`, then stops; the desk asks, and sends
the answer back with SendMessage (`USER APPROVAL|REJECTION|DECISION via the approvals desk ...`). Codex rings
`--for user` reach the desk the same way; lane watchers leave them to it. A SessionStart hook (`relay brief`)
prints this rule and the queue size in every new chat. After chats are deleted, a chat named `0 - Approvals` types
`/approvals`. Routine technical questions to the user that need no decision (a quick clarification while they are
talking to this chat) are fine; anything they must approve or decide goes through the desk.

**The user can switch the desk off** (user request 2026-10-17; [ADR 0040](docs/decisions/0040-desk-on-off-switch.md)):
on their word, any chat runs `node tools/relay.mjs desk off` (`desk on` undoes it; `desk` shows the state). While it
is off, every chat asks the user itself for its own approvals and decisions, and lane watchers wake their own chat
for Codex's `--for user` rings. That chat relays the answer with `send <lane> --user-approved|--user-rejected|--user-decision
... --quote`. `relay ask` then queues nothing (exit 6), and `relay brief` says the desk is off. Never switch it
yourself.

**Report your task state so the desk can stop itself** (user request 2026-10-15): every Claude chat other than the desk
runs `node tools/relay.mjs chat active --from "<this chat's title>" --session <its local_ id>` when it starts or resumes
a task, and `node tools/relay.mjs chat done` (same flags, optional `--note`) when the task is finished: merged or handed
off, nothing pending from Codex, no lane watcher left running (stop yours first). The desk's `wait all` stops itself
after 15 quiet minutes: no open ask, no lane where it is Codex's turn or a watcher runs, and no chat reporting `active`.

After chats are deleted: in a Claude chat named `0 - Approvals`, type `/approvals`; it follows COORDINATION.md's
reset. Deleted chats do not erase task records or approve work.

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
| `npm run dev:capped` | the same dev server as `npm run dev`, started through `tools/capped.ps1` (OPS-019): the server and its helpers share an 8 GB memory cap, and closing the shell that started it ends them. A runaway server then crashes by itself instead of filling the machine's memory (one reached 131 GB on 2026-10-17). Flags pass through: `npm run dev:capped -- --port 5200`. Use it, or the restricted-profile form in docs/AI_COLLABORATION.md, for any dev server that will run unattended |
| `npm run devs` | read-only list of the dev servers running now (`tools/dev-servers.ps1`): ports, age, committed memory, browser connections, folder, and the machine's committed memory against its limit; flags servers with no browser connected for an hour and servers over 2 GB. Check it when a task ends and stop your own idle servers (`Stop-Process -Id <PID>`) |
| `npm run build` | production build to `dist/` (two entries: `index.html`, `sprites.html`). **Must pass.** |
| `npm run preview` | serve the built `dist/` |
| `node tools/relay.mjs <cmd>` | Claude-Codex relay (ADR 0033/0037; `npm run relay -- <cmd>` swallows some flags): `lanes`, `add <lane> <chat id\|title>`, `remove <lane>`, `send <lane>` (inbox prompt; `--direct`; `--user-approved\|--user-rejected\|--user-decision "<what>" --quote "<answer>"`; `--supersedes <N>` voids a queued send it replaces), `check <lane> <N>` (Codex, before acting on `#N`: open, or DONE/VOID exit 7), `done <lane> <N>` (send `#N` carried out; OPS-020), `ring <lane>` (`--for user --kind approval\|decision\|blocked`), `wait <lane>` (Claude's background watcher), `status`, `reset <lane>`, `pause\|resume <lane\|all>`; approvals desk (ADR 0039): `ask`, `asks`, `answer <id>`, `wait all`, `brief`, `desk [on\|off]` (the user's switch, ADR 0040); state in git-ignored `.relay/` |
| `npm run test:relay` | relay regression test (`tools/test-relay.mjs`: fake `codex` and chat index, throw-away `.relay/`); run after changes to `tools/relay.mjs` |
| `npm run lobby` | the online lobby server locally (`server/`, wrangler dev on `ws://127.0.0.1:8787`; a page on localhost uses it by itself). Deploy: `server/README.md` (the user's Cloudflare account) |
| `npm run test:lobby` | lobby room rules test (`server/test/room.test.mjs`: RoomCore with a fake clock: line, relay, feed, results, forfeit, timeout); run after changes to `server/src/roomCore.js` |
| `npm run sprites` | pack all characters' art from `art/` into `public/characters/<id>/` + every world-art kind (vfx, crowd, stage, npc, ui; approved items only) |
| `npm run sprites naruto` | pack one character |
| `npm run sprites vfx` | pack only the VFX atlas into `public/vfx/` (approved effects only) |
| `npm run sprites crowd` | pack only the crowd atlas into `public/crowd/` (approved spectators only) |
| `npm run sprites stage npc ui` | pack the approved stage slots, NPC sheets and title art into `public/stage|npc|ui/` |
| `npm run sprites decals` | pack the approved ground decals into `public/decals/` (atlas.json + the pages of each page set, at most 4 per match; ADR 0024, `tools/pack-decals.mjs`) |
| `node tools/pack-sprites.mjs vfx crowd stage npc ui --candidates` | pack unapproved world art into git-ignored `public/preview/` (see it with `?art=custom`) |
| `npm run publish:github` | push a slim copy of `main` (no raw art) to the private repo github.com/eshin087/gcd-tourney |
| `npm run deploy` | build a clean export of HEAD (committed work only) and deploy it to Vercel production: https://gcd-tourney.vercel.app (only from `main`; `-- --preview` for a branch) |
| `npm run pr -- start feature/<name>` | optional manual CLI helper that creates a named worktree + branch off main in the repository's `.worktrees/` folder; `--art <id>[,<id>]` adds only that character's or art kind's raw art. Use the host's managed-worktree flow when available; never use `--full` for art work. It verifies each `--art` folder's tracked `raw/` files are on disk (TOOL-048) |
| `npm run pr -- art <id>[,<id>]` | (inside a sparse worktree) add more raw art there with the same patterns as `start --art`, drop patterns a shell rewrote (`C:/Program Files/Git/art/...`), and verify the raws are on disk. Use it instead of a hand-typed `git sparse-checkout add` |
| `npm run pr -- open` | (in a worktree on a named branch, never detached HEAD) publish the branch slim and open or update its GitHub PR |
| `npm run pr -- preview` | (in the worktree) deploy the branch to a Vercel preview URL and link it on the PR, so the user can try it on a phone (ADR 0018; previews need a Vercel sign-in) |
| `npm run pr -- merge <branch>` | (in the main checkout) `--no-ff` merge, publish main (PR shows merged), remove the worktree, then deploy main to production (`--no-deploy` skips it). **Art guard first (TOOL-028, `tools/pr-guard.mjs`):** for every fighter strip the merge changes it refuses an unapproved newest raw (newest `raw/<anim>_vNN.png` != manifest `approvedVersion`; approve it or move it to `raw/_qa_hold/`, which the packer skips), a committed pack of an unapproved version, or a strict-scale-gate failure (packer dry run on scratch copies); for every fighter pack the merge changes it refuses one that drops animations main's pack lists, and names them (packed in a worktree without every raw: re-pack after `npm run pr -- art <id>`; TOOL-061). Code branches skip it. `--force-art "<reason>"` overrides and records the reason in the merge commit |
| `npm run pr -- check <branch>` | the art guard alone, read-only, from any checkout: prints what `merge` would refuse (exit 1 when it would) |
| `npm run pr -- prune [--dry-run]` | (in the main checkout) remove clean worktrees whose branch was merged; lists dirty ones and non-worktree copies in `.worktrees/` |
| `npm run lineup` | the cast side by side on one floor line (idle, run, heavy) with standing height and shoulder width per fighter, flagged against `art/scale/builds.json`; writes `art/scale/lineup.png` + `.json`. Attach it to every model sheet and idle review |
| `npm run body [id] [anim...]` | body sheet (TOOL-036): every packed frame beside idle f0 and the approved combat cell at one density, labelled with body size B (garment area vs idle f0) and head H; writes `art/scale/body-<id>.png` + `body-report.json`. Advisory (±10 %): confirm a flagged strip by its segments |
| `npm run lint:anims` | animation-contract lint (TOOL-004, `tools/lint-anims.mjs`; also the first step of `prebuild`, so `npm run build` fails on it): every `animGuide.js` animation has a manifest default and a per-fighter entry, optional ones have a `FALLBACK` entry that reaches an animation the placeholder bakes, every `altOf` repeats its base's frames and phases, `art/SPEC.md` names every animation. `--strict` fails on its warnings (optional strips a fighter lacks, SPEC wording) too |
| `npm run lint:undeclared` | undeclared-identifier check (TOOL-027, `tools/check-undeclared.mjs [dir]`; second step of `prebuild`): every `src/**/*.js` name that is used but never declared, imported or a known global (the ENG-062 `MODE_ORDER` bug) fails the build with `file:line` |
| `npm run lint:simmath` | simulation math lint (`tools/lint-sim-math.mjs`; third step of `prebuild`, ADR 0036): `Math.sin` / `cos` / `hypot` / `atan2` / `pow` / `exp` / `log` ... in a gameplay file (fighter, kit, game, projectiles, clash, techAnim, basis, moves, input, characters) fails the build with `file:line`; use `src/game/dmath.js`, which every engine computes identically |
| `npm run test:lints` | lint regression test (`tools/test-lints.mjs`, fixtures in tools/.test-fixtures/lints/): the planted `MODE_ORDER` bug, a wide valid-syntax sample, one doctored case per animation-contract rule; run after any change to the two lints |
| `npm run test:anims` | tech pose test (`tools/test-tech-anims.mjs`: animation selection, beat transitions, back rolls, wall facing, missing-art fallbacks); run after changes to the tech states or `src/game/techAnim.js` |
| `npm run test:guard` | art merge guard test (`tools/test-pr-guard.mjs`: throw-away git repo under tools/.test-fixtures/; unapproved, held, approved, off-size and shipped-version branches, merge-result verdicts, `--force-art` parsing) plus the sparse worktree test (`tools/test-sparse-art.mjs`: real `pr start --art` and `pr art` in a throw-away repo, raw/ on disk) and the deploy export test (`tools/test-deploy-export.mjs`: no art/ in an export from a sparse worktree, TOOL-052; stale sweep and a locked export removed by `tools/rm-later.mjs`, TOOL-053); run after changes to `tools/pr-guard.mjs`, `tools/pr.mjs`, `tools/sparse-art.mjs`, `tools/deploy.mjs`, `tools/export-head.mjs`, `tools/scratch-dir.mjs` or `tools/rm-later.mjs` |
| `npm run test:alts` | attack-alt picker test (`tools/test-anim-alts.mjs`: balanced Thue-Morse alternation, never three in a row, base when the alt is missing, `?alts` override; ADR 0031); run after changes to `src/game/animAlts.js` or the alt hooks in fighter.js |
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
   `git sparse-checkout add art/characters/<id>` does not bring back its `raw/` directory; in an existing worktree
   (one recreated without `--art`, or a task that grew) run `npm run pr -- art <id>[,<id>]` there instead.
4. Use one worktree per task and reuse it for later versions (`v02`, `v03`, etc.) of that same task.
5. At handoff, report the worktree path so the coordinator can remove it after merging. The coordinator must
   finish cleanup of merged task worktrees. `npm run pr -- merge` automatically removes only the project-local
   worktree path created by the helper; archive or remove an app-managed worktree through the Codex app after
   its branch is merged.
6. Worktree storage is controlled by the user's Codex app or Git configuration. Do not require a repository-local
   worktree root, change the user's global Worktree root, or reject an app-managed worktree because it is outside
   this repository. Verify the actual returned path before using it. Audit existing worktrees for uncommitted and
   ignored files before moving, removing or archiving them.

### Storage hygiene (user request, 2026-10-15; OPS-013)

The project lives on a small USB drive, so agents clean up what a finished task leaves behind. Details and the
audit recipe: [AI_COLLABORATION.md](docs/AI_COLLABORATION.md#storage-hygiene-2026-10-15-ops-013).

1. After `npm run pr -- merge`, the coordinator runs `npm run pr -- prune` and archives the app-managed worktree
   of every merged branch through its app (worktree rule 5). A folder left in `.worktrees/` that is no longer a
   registered worktree (an empty shell after a removal, an old plain copy) is listed by `prune --dry-run` and
   deleted once it holds nothing unique.
2. When a task ends, delete its worktree's `node_modules/` and `dist/` (reinstall and rebuild are cheap). Main's
   `dist/` is a build output too; `npm run deploy` builds its own clean export.
3. Agent scratch (PR body `.md` files, one-off `.cjs`/`.mjs` helpers, QA comparison PNGs, `.tmp/`) goes in the
   agent's own scratch or temp folder, never the project root, `.worktrees/` or `deliverables/`. Anything in
   `deliverables/` is deleted once the user has it.
4. A `_preserved-*` or `_codex-scratch-*` folder must hold a `README.md` saying why it is kept, what in it is
   unique and a review-by date. Past that date it is reviewed and removed (or its README renewed with a reason).
5. Hygiene never touches `art/**/raw/` or any versioned `_vNN` input (ADR 0007), approved art, unmerged commits or
   another agent's uncommitted work. Deleting anything beyond rules 1-3's routine outputs needs the user's yes,
   asked through the approvals desk (ADR 0039).

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
  then rings Claude for the user's approval (ADR 0037) and updates the statuses. It can make small code/data changes that
  follow AGENTS.md. Session prompts: [docs/agents/CODEX_PROMPT.md](docs/agents/CODEX_PROMPT.md).
- **The user** reviews and approves every image (and can still generate one by hand in ChatGPT; it gets the
  same naming and review).
- **Claude (you)** owns engine and gameplay code, integration, the packer and tooling, the art spec
  (art/SPEC.md + ADRs), code review and QA soaks. When Codex or the user reports a packer or integration
  problem, fix the tool, not the output.
- The handoff protocol is in [docs/AI_COLLABORATION.md](docs/AI_COLLABORATION.md). In short: claim a task in
  docs/TASKS.md, make the change, log it in CHANGELOG, then hand back with a status and a note.
- **The relay replaces paste-in prompts** ([ADR 0033](docs/decisions/0033-claude-codex-relay.md); call
  `node tools/relay.mjs` directly, npm swallows some flags). A lane is one Codex chat (`lanes`, then
  `add <lane> <chat uuid|title>`). To hand a lane to Codex: write the CODEX_INBOX item as usual, run
  `send <lane> --note "<one line>"` (a one-off question without an inbox item: `send <lane> --direct --note "..."`),
  then start `node tools/relay.mjs wait <lane>` as a **background** command whose description starts with
  "Relay watcher" (the `relay-status` footer mod shows it). When it wakes you, read the newest handoff and continue.
  If the watcher exits 2 saying it is still Codex's turn, start it again. If `send` fails, give the user the
  paste-in prompt instead. **Never tell the user to paste a decision into Codex**: relay it.
  A send waits in the Codex chat's queue until its current turn ends, and nothing withdraws it (OPS-020). Codex acts
  on each `#N` once: it runs `relay check <lane> <N>` on delivery and `relay done <lane> <N>` when finished. To replace
  a send that may still be queued, send the new one with `--supersedes <N>` (its delivery then says VOID); when a ring
  shows Codex already did a queued send's work, run `relay done <lane> <N> --note "<where>"` so its delivery does nothing.
- **All approvals happen in Claude** ([ADR 0037](docs/decisions/0037-approvals-in-claude.md)), **at the desk**
  `0 - Approvals` ([ADR 0039](docs/decisions/0039-approvals-desk.md); the rest of this bullet is the desk's job).
  In any other chat, a lane watcher that says "Codex needs the USER" means the desk is off: send one PushNotification
  pointing at `0 - Approvals` and `/approvals`, ask nothing, restart the watcher. When the desk's `wait all` wakes it, send a
  PushNotification (what is waiting, one line), then ask with **AskUserQuestion**:
  one question per approval or decision, the review link and versions in the question, options such as
  "Approve vNN" / "Reject (say why)" / "Hold"; several strips can be one multi-select question. Relay the answer
  word for word: `send <lane> --user-approved "<asset vNN>" --quote "<their answer>"`, `--user-rejected ... --note
  "<their feedback>"`, or `--user-decision "<what>" --quote "..."` for non-image decisions, then restart the watcher.
  Use these only with an answer the user gave in this conversation, never one you inferred; a plain `--note` that
  says "approve" is refused. A relayed answer starts the round-trip count again; other brakes: when `send` exits 3
  (4 round trips without the user), notify and stop; after the user replies on a lane otherwise, `reset <lane>`.
  "Stop the relay" means `pause all`. "status" also reports `node tools/relay.mjs status` (turn "you" = waiting on
  the user).

### Mandatory Claude handoff check (every chat and agent, 2026-10-15)

At session start and before every final response or task handback, check whether Claude needs a reply,
even for direct user tasks without a relay prefix. Read the main checkout's current AGENTS.md relay rules
and docs/agents/CODEX_INBOX.md (your section plus Every thread); an older task-worktree copy is insufficient.
Locate main with git worktree list. Run node tools/relay.mjs status from main.

- Identify the lane from the relay message, inbox section or registered chat mapping. Never guess, broadcast
  or ring another chat's lane. If Claude needs the result but no lane can be identified, preserve the written
  handoff and report the missing mapping instead of silently omitting the handback.
- When Claude has the next actionable step (review, calibration, integration, requested report or follow-up),
  commit the handoff with branch/worktree, commit, results and remaining holds, then run
  node tools/relay.mjs ring <lane> --note "<what is ready; commit; next Claude action>" from main.
  This user-authorized handback needs no reminder or further permission. Check the command result: a written
  handoff alone is not a sent notification. Ring once per new handoff, not on every status response.
- Preserve approval, BLOCKED and pause brakes. If only the user's approval or decision remains, ring once with
  `--for user --kind approval|decision|blocked` (ADR 0037: Claude asks the user with buttons), update NOW.md and
  stop; that ring never authorizes further production. Proceed only on a relayed `USER APPROVAL`/`USER DECISION`
  or the user's own message. A relayed one counts once it is delivered as its own `[relay <lane> #N]` message and
  `relay check` calls it open; reading NOW.md, the inbox or relay status for this check never authorizes acting on a
  decision whose message is still queued (AGENTS.md relay rules, OPS-020). Do not reset/resume a paused lane or
  bypass a hop limit to complete this check.
- Subagents report the handoff requirement to their parent; the owning chat rings once unless the handback
  was explicitly delegated. Claude maintains a background watcher for each active lane and reads the
  committed handoff when notified. A ring without a watcher is queued, not proof that Claude read it.
- Briefly report the outcome in the final response: Claude notified (lane and commit), already notified,
  waiting for the user, no Claude action needed, or delivery blocked (reason). On failure, retain the
  handoff and report the exact failure; never claim successful delivery.

### Mandatory user-facing status (every Codex chat, 2026-10-15)

Every final response or task handback must end with these four short status lines, even when there is
no action needed. Use current evidence from this task, main's inbox and relay state; never make the user
infer who acts next from "done", "ready", a commit, or a preview link:

- **Status:** Complete / Waiting for you / Waiting for Claude / Blocked / In progress. If multiple waits
  apply, name each. Complete means the requested scope is finished, with no required approval, validation,
  delivery or handoff outstanding. Distinguish this task's completion from the larger project's completion.
- **Your action:** None, or the exact approval/decision/test/input needed. Link the specific candidate or
  review page, name its version, and say what reply to give. Separate visual approval from technical holds.
- **Claude:** None, or the exact next action/reply awaited and handoff delivery state (sent/queued/failed,
  lane and commit when applicable). If Claude asked Codex for unfinished work, say so and identify that work.
  Do not claim Claude has read or completed anything without evidence; mark unknown status as unverified.
- **Next:** Who acts next and what resumes afterward. Say whether Codex is continuing, waiting for a relay,
  waiting for the user's reply, or finished with no follow-up. Never imply background work or monitoring
  continues unless it is actually running.

When code/art is only committed locally or on a preview, say so; do not imply merged, deployed, approved
or fully validated. Keep these lines concise and actionable. An idle rule-reminder turn reports the current
wait without starting unrequested work. Subagents give the same facts to their parent for the final handback.
Read this rule from main alongside the mandatory Claude handoff check; it applies to older worktrees too.

## Gotchas

- `step()` sets `window.__manualStep = true`, which stops the rAF loop from driving the game. Call
  `resumeLoop()` before testing in real time.
- Startup shows the title after the title art and the fighters' anims.json only; sheets and world art load behind it
  (ADR 0043). Code that needs fighters right after `game.init()` waits for `game.assetsReady` or uses `whenLoaded`.
  A fighter without a complete pack is baked on the main thread (blocking): keep the bake under ~1 s per character.
- Gamepads only take control after one of their buttons is pressed (`InputManager.activeGamepads`).
- Audio needs a user gesture (first pointerdown/keydown calls `audio.init()`). `M` toggles mute.
- The renderer draws into a small buffer (360 px tall at 1080p; integer scale = round(height / 340)) and upscales with nearest-neighbor. Sub-pixel jitter in
  sprites shows up as shimmering, so keep sprite placement and scales pixel-consistent. Hi-res packs
  (`pixelsPerUnit` >= 70; spec v2 is 128) switch it to the `hd` detail (scale = floor(height / 600));
  override with `?res=pixel` or `?res=hd`.
- Spec v2 custom sheets are 16 columns of 256 px cells, at most 4096 × 4096 px (256 frames) per page; a fighter past
  that ships `sheet2.png` ... with the frames numbered straight through (`anims.json` `pages`, art/SPEC.md "Sheet pages",
  TOOL-060). Find a frame's page and cell with `src/art/sheetPages.js`, never `frame % columns` on `sheet.png`. A GPU
  with a 2048 texture limit gets downscaled pages and a three.js warning (ADR 0007).
- Simulation randomness: `Math.random()` only reaches the CPU brains and effects (clash charts are seeded), so online
  play doesn't need a seeded RNG (ADR 0036). Gameplay files must use `src/game/dmath.js`, not `Math.sin` / `cos` /
  `hypot` / `atan2` ...: engines round those differently (`npm run lint:simmath`, part of the build, enforces it).
