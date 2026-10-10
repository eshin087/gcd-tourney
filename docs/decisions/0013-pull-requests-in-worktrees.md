# 0013. Every feature and character lands through a pull request, built in its own worktree

- Status: accepted
- Date: 2026-10-10
- Deciders: User, Claude

## Context
Several Claude sessions and Codex threads edit the same working copy at the same time and commit straight to
`main`. Their uncommitted edits overlap in shared files (game.js, main.js, TASKS.md, CHANGELOG.md), so commits
pick up each other's hunks and one bad feature can't be backed out cleanly. The user wants every new feature
or character to arrive as a pull request, so it can be reviewed and reverted as a unit.

GitHub (eshin087/gcd-tourney) holds a filter-repo "slim" rewrite of local `main` without raw art
(tools/publish.mjs); the rewrite is deterministic, so pushes fast-forward. A merge commit made on GitHub would
break that.

## Decision
- New features, new characters (code and art), gameplay/AI/engine changes and tooling changes go through a
  pull request. Exceptions that may still commit straight to `main`: docs-only edits, bookkeeping, and art
  approvals for a character that already ships (Codex's per-approval commits).
- Each PR is built in its own git worktree on its own branch: `npm run pr -- start <prefix>/<name>` creates
  `.worktrees/<prefix>-<name>` off `main` (sparse: no raw image generations unless `--full`) and
  installs dependencies. Nobody runs `git checkout`/`switch`/`stash` in the shared main checkout.
- `npm run pr -- open` (in the worktree) publishes the branch slim and opens the GitHub PR (or updates it).
- `npm run pr -- merge <branch>` (in the main checkout) checks the branch merges cleanly, merges it with
  `--no-ff` (one merge commit per feature), publishes `main` (GitHub marks the PR merged) and removes the
  worktree. Conflicts are resolved in the feature worktree (`git merge main`), never on `main`.
- Revert a feature with `git revert -m 1 <merge commit>`, itself done as a PR (`fix/revert-<name>`).
- Merge after the Definition of Done passes, unless the user asked to review first. Deploy after merging.

Amended 2026-10-10: worktrees moved from the sibling folder `../gcdTourney-worktrees/` into `.worktrees/` inside the
project (user request: one folder). `.gitignore` and `vite.config.js` (`server.watch.ignored`) keep git and the dev
server out of it.

## Alternatives considered
- **Branches in the shared checkout.** A checkout switches files under every other agent. Rejected.
- **`gh pr merge` on GitHub.** Creates commits GitHub has and local `main` doesn't; the next slim publish
  is non-fast-forward. Rejected.
- **Squash merges.** One commit per feature too, but the branch history is lost and GitHub wouldn't see the
  PR's commits in `main`, so the PR wouldn't auto-close. Rejected for `--no-ff`.
- **Full worktrees.** ~1.7 GB each because raw generations are committed locally. Sparse by default instead.

## Consequences
- Features are isolated until merged, and each one is a single revertible merge commit.
- Each worktree needs its own `npm ci` (fast, three deps) and its own dev server port (`npm run dev:alt` or
  `npx vite --port <n>`).
- `pr merge` refuses while the main checkout has uncommitted edits in files the branch changes; during the
  move to this workflow, sessions with uncommitted work on `main` move it to a branch first.
- Bookkeeping files (CHANGELOG, TASKS) now conflict between PRs instead of mixing silently; resolve them in
  the later branch.
