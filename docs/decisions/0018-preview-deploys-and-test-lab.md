# 0018. Every PR gets a preview link; a test lab page for checking it

- Status: Accepted (part 1, preview deploys: implemented; part 2, the test lab: in progress)
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0013](0013-pull-requests-in-worktrees.md) (PRs in worktrees)

## Context

Since ADR 0013 every feature arrives as a PR, but the only place the user could play a change was the live site,
after the merge. The user works from a phone and wants to try each PR there first ("test it out before pushing it
into production"), plus a place to exercise every move, animation and shared mechanic (beam and ultimate clashes,
throws, dodges, bounces) without setting up a match by hand.

## Decision

### 1. Preview deploys

- `npm run pr -- preview`, inside a PR's worktree, deploys the branch's committed work to a **Vercel preview URL**
  (`tools/deploy.mjs --preview`: the same clean export of HEAD without `art/` as a production deploy, built and
  deployed without `--prod`) and posts the link as a comment on the PR. The live site is untouched.
- `npm run deploy` (production) now refuses to run on any branch but `main`.
- The flow is: open the PR → `npm run pr -- preview` → the user tries it on the phone → "merge" → `npm run pr --
  merge` → `npm run deploy`.
- Previews are behind Vercel Authentication (the project's default Deployment Protection): the user signs in to
  Vercel once in the phone's browser. Changing that protection is the user's call, in the Vercel dashboard.

### 2. The test lab (in progress)

A separate page, `lab.html`, like the Sprite Lab: shipped with the build (so it works on previews and the live
site) but not linked from the game's menus. First version: every fighter's move list (normals, each directional
special, SUPER, ultimate, as one tap against a dummy, with frame data), an animation viewer (all 42 animations
frame by frame with hit and hurt boxes, on the real packed art), mechanic scenarios (ultimate clash, special clash,
throw and break, parry, dodges, wavedash, air combo, wall and ground bounce, vanish, super dash), and tools
(infinite meter, slow motion, frame step, dummy record and replay, the box overlay, instant fighter swaps).

## Alternatives considered

- **Vercel's Git integration** (a preview per push, automatically). Rejected: GitHub holds a slim rewrite of the
  history without raw art (ADR 0013), and Vercel would build that copy on every push; explicit `pr preview` deploys
  the exact committed tree, only when wanted.
- **A LAB entry in the game menu**, hidden on the live site. The user chose a separate page instead.
- **Turning off preview protection.** Not ours to change, and the repo holds fan art of copyrighted characters (ADR
  0008): keeping previews private is the safe default.

## Consequences

- Each preview is a separate Vercel deployment (about 30 seconds); old previews can be removed in the dashboard.
- PR descriptions and hand-backs include the preview link; docs/CONTRIBUTING.md and AI_COLLABORATION.md describe the
  step.
