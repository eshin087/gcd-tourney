# Contributing

This applies to everyone: the user, Claude, Codex. A solo project still benefits from branches, small
commits and a review checklist, especially when two AI agents (Claude and Codex) touch the same repo.

## Branching

- `main` is always playable. `npm run build` passes, and the smoke test in [TESTING.md](TESTING.md) passes.
- Work happens on short-lived branches off `main`:

| Prefix | For | Example |
|---|---|---|
| `feature/` | features, new systems, new characters | `feature/training-room`, `feature/char-goku` |
| `fix/` | bug fixes | `fix/hitbox-mirroring` |
| `art/` | art batches (generating, filing, packing, overrides) | `art/naruto-core-locomotion` |
| `docs/` | docs-only changes | `docs/combat-frame-data` |
| `chore/` | tooling, deps, cleanup | `chore/packer-palette-report` |

- **Every new feature or character is a pull request** built in its own worktree ([ADR 0013](decisions/0013-pull-requests-in-worktrees.md)).
  The main checkout is shared by Claude sessions and Codex threads, so nobody switches branches there:

  ```
  npm run pr -- start feature/<name>        # from the main folder; --full for art (raw generations)
  # work, test (npx vite --port 52xx), commit in .worktrees/feature-<name>
  npm run pr -- open                        # from the worktree: slim publish + gh pr create (re-run to update)
  npm run pr -- preview                     # from the worktree: a Vercel preview of the branch, linked on the PR (ADR 0018)
  git merge main                            # in the worktree, only if merge reports conflicts
  npm run pr -- merge feature/<name>        # from the main folder: --no-ff merge, publish main, remove worktree
  npm run deploy
  ```

  Worktrees live in `.worktrees/` inside the project (git-ignored, not watched by the dev server). Never run
  `git clean -x` in the main folder: it deletes ignored files, including every worktree's uncommitted work.
  Never merge on GitHub (button or `gh pr merge`): GitHub holds a slim rewrite of local `main`, and a merge made
  there breaks the next fast-forward publish. Publishing local `main` marks the PR merged.
- **Reverting:** each feature is one merge commit. Undo it with `git revert -m 1 <merge>` on a
  `fix/revert-<name>` branch, through the same PR flow.
- Straight-to-`main` commits are only for docs-only edits, bookkeeping and art approvals for a character that
  already ships. A new character's art production (Codex threads) commits on its `feature/char-<id>` branch.
- Commits stage explicit paths only (never `git add -A`, `git add .` or `git commit -a`). See AGENTS.md step 10.
- Merge only after the review checklist passes (unless the user asked to review the PR first).
- Don't rewrite `main` history.

## Commits: Conventional Commits

```
<type>(<scope>): <summary in imperative mood, ≤ 72 chars>

<optional body: what and why, not how>

<optional footer: Refs: TASK-ID, BREAKING CHANGE: ...>
```

| Type | Use for |
|---|---|
| `feat` | a new player-visible feature or system |
| `fix` | a bug fix |
| `perf` | a performance improvement |
| `refactor` | code change with no behavior change |
| `art` | bitmap asset changes (raw images, frames, packed sheets, hitbox overrides) |
| `docs` | documentation only |
| `test` | tests or test tooling |
| `build` | build system, dependencies, packer CLI |
| `chore` | everything else (cleanup, config) |

Common scopes: `combat`, `fighter`, `input`, `ai`, `camera`, `render`, `vfx`, `audio`, `ui`, `hud`, `menus`,
`training`, `sprites`, `tools`, `art`, `docs`, `char:<id>`, `<id>` (for art commits).

Examples:

```
feat(training): mirror live input on the training-room fighter
fix(combat): require same depth lane for melee hits
art(naruto): approve spec v2 model sheet v02
art(sasuke): approve idle v03 (raw + packed)
build(tools): add pack-sprites palette report
docs(adr): add 0005 2.5D lanes and frame hitboxes
```

Art commits name the approved version (`vNN`) so the commit, the file name and the
[art/REVIEW.md](../art/REVIEW.md) row line up.

- One logical change per commit. Don't mix art filing with engine changes.
- Reference the task id in the footer (`Refs: ENG-005`).
- Breaking contract changes (anims.json format, animation names, art/SPEC.md) use `!` (`feat(sprites)!: ...`) and
  a `BREAKING CHANGE:` footer, and need an ADR.

## Review checklist (even when solo)

Before merging, the author (or the reviewing AI) checks:

- [ ] **Scope:** the diff matches the task and nothing else.
- [ ] **Behavior:** the relevant [TESTING.md](TESTING.md) checklists pass, the console is clean, and the soak passed
      for combat/AI/perf.
- [ ] **Build:** `npm run build` passes.
- [ ] **Contracts:** animation names, anims.json fields and art/SPEC.md are unchanged, or changed together with
      the packer, game, template, manifest and an ADR.
- [ ] **Data:** gameplay numbers are in `moves.js` or character files, not hard-coded in logic.
- [ ] **Style:** matches [STYLE_GUIDE_CODE.md](STYLE_GUIDE_CODE.md). Comments explain why. No dead code or
      debug leftovers outside `?debug`.
- [ ] **Resources:** new GPU objects are disposed, and no per-frame allocations were added in hot loops.
- [ ] **Fallbacks:** missing or broken art degrades gracefully.
- [ ] **Docs:** README, ARCHITECTURE, COMBAT_DESIGN and art docs are updated where behavior changed.
- [ ] **Bookkeeping:** CHANGELOG (Unreleased), TASKS status, TRACKER/manifest and REVIEW.md for art.
- [ ] **Files:** no `node_modules/`, `dist/`, editor junk or secrets. Large binaries only under `art/` or `public/`.

Cross-review: Claude reviews Codex's code changes, and Codex re-runs the packer report after Claude's packer
changes. The user plays every gameplay change before it's marked `done`.

## Versioning and releases

- **SemVer 0.x** while the game is in development. The version is in `package.json`.
  - **Minor** (`0.x.0`): a milestone or a meaningful feature set (see [ROADMAP.md](ROADMAP.md)).
  - **Patch** (`0.x.y`): fixes and small tweaks.
  - **1.0.0**: release readiness (see the roadmap, including the licensing decision).
- Release steps:
  1. Move the `## [Unreleased]` entries in CHANGELOG.md into `## [x.y.z] - YYYY-MM-DD`.
  2. Bump `version` in `package.json`.
  3. Run the "Before a release" list in TESTING.md.
  4. Commit `chore(release): vx.y.z`, then tag `vx.y.z`.

## Definition of done

Same as [CLAUDE.md](../CLAUDE.md#definition-of-done): the task does what it says, the console is clean, the
checklists pass, the soak passes (combat/AI/perf), the build passes, docs and bookkeeping are updated, an ADR
exists for architectural decisions, and the commit is conventional.

## Binary assets

- Commit `art/**` sources (reference, raw, frames, ui) and the packer outputs in `public/characters/**` and
  `public/vfx/**`, so the game runs from a fresh clone without re-packing, except
  `art/**/reference/source/` (official pictures, git-ignored, never committed).
- **Generated images are versioned in their file names** (`<asset>_vNN.png`, [ADR 0007](decisions/0007-art-spec-v2-shippuden-256.md)):
  the user compares candidates side by side, and the packer picks the highest version. Versions are never
  overwritten, reused or deleted; rejected ones move to the `_rejected/` folder next to them (still
  committed), art from an older spec moves to `_old/`, and the approved model sheet, expression sheet, idle
  strip and UI images are **copied** to their fixed names (`reference/model_sheet.png`, `expressions.png`,
  `idle_approved.png`, `ui/<name>.png`). This replaces the
  old "no version suffixes in file names, git keeps history" rule. Other files (code, docs, cleaned frames,
  packer outputs) keep stable names and rely on git history.
- Generated images can be large, and the versions add up. When a remote is added, consider Git LFS for
  `art/**/raw/**/*.png` and `art/**/reference/*.png` (and decide in an ADR).
- Never commit `dist/` or `node_modules/` (they're in `.gitignore`).

## Hosting and the GitHub mirror

- **GitHub** (private): https://github.com/eshin087/gcd-tourney. PRs come from `npm run pr` (above). `npm run publish:github` pushes `main`
  without raw image generations (`art/**/raw/`, `_rejected/`, `_old/`, contact sheets), which stay only in
  the local repository (~1 GB and growing). The rewrite is deterministic, so pushes are fast-forwards. Needs
  `python -m pip install git-filter-repo`.
- **Vercel**: https://gcd-tourney.vercel.app. `npm run deploy` (tools/deploy.mjs) exports HEAD without `art/` into
  a temp folder, builds it there (`prebuild` runs the build lints, `tools/lint-anims.mjs` and `tools/check-undeclared.mjs`, then writes
  `public/art-index.json`, the list of packed art, so production never requests a missing file) and deploys the prebuilt output. Only committed work goes live; uncommitted
  changes are listed as "not deployed". Deploys are on demand, not on every push.
- The site and repo contain fan art of copyrighted characters: keep the repo private, and see ADR 0008
  (ENG-020) before any public release.
