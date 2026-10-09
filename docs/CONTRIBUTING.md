# Contributing

This applies to everyone: the user, Claude, Codex. A solo project still benefits from branches, small
commits and a review checklist, especially when three AIs touch the same repo.

## Branching

- `main` is always playable. `npm run build` passes, and the smoke test in [TESTING.md](TESTING.md) passes.
- Work happens on short-lived branches off `main`:

| Prefix | For | Example |
|---|---|---|
| `feature/` | features, new systems, new characters | `feature/training-room`, `feature/char-goku` |
| `fix/` | bug fixes | `fix/hitbox-mirroring` |
| `art/` | art batches (filing, packing, overrides) | `art/naruto-core-locomotion` |
| `docs/` | docs-only changes | `docs/combat-frame-data` |
| `chore/` | tooling, deps, cleanup | `chore/packer-palette-report` |

- Merge to `main` with a fast-forward or squash once the review checklist passes. Delete the branch after.
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
art(naruto): add idle, run and dash strips (raw + packed)
build(tools): add pack-sprites palette report
docs(adr): add 0005 2.5D lanes and frame hitboxes
```

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
- [ ] **Bookkeeping:** CHANGELOG (Unreleased), TASKS status, TRACKER/manifest for art.
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
- Raw ChatGPT images can be large. When a remote is added, consider Git LFS for `art/**/raw/*.png` (and decide
  in an ADR).
- Never commit `dist/` or `node_modules/` (they're in `.gitignore`).
