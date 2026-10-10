# Architecture Decision Records

An ADR captures one significant decision: the context, what was decided, and the consequences we accept.
ADRs stop future contributors (human or AI) from re-litigating settled questions, and make it obvious
when a decision should be revisited.

## When to write one

- A new runtime dependency, build tool, test runner or formatter.
- A new core system or a change to a cross-cutting contract (anims.json format, art/SPEC.md, animation names,
  hit detection rules, the save format for bindings).
- A change in how the AIs collaborate or how assets flow.
- Anything you'd have to explain twice.

## Process

1. Copy the template below to `NNNN-short-title.md` (next number, kebab-case).
2. Set **Status: Proposed**. Claude usually drafts. Codex may draft for art-pipeline topics.
3. The user accepts it (**Accepted**) or rejects it (**Rejected**, kept for the record).
4. ADRs are immutable once accepted. To change course, write a new ADR that **supersedes** the old one, and set
   the old one's status to `Superseded by NNNN`. When the new ADR replaces only part of the old one, it
   **amends** it instead: the old ADR gets a one-line `Amended by NNNN` header note and nothing else changes.
5. Mention the ADR in CHANGELOG and link it from the docs it affects.

## Index

| # | Title | Status |
|---|---|---|
| [0001](0001-threejs-vite-browser.md) | Three.js + Vite, browser-only, plain JS | Accepted |
| [0002](0002-hd2d-pixel-renderer.md) | HD-2D pixel renderer (low-res render, nearest upscale, bloom) | Accepted |
| [0003](0003-3d-baked-placeholder-sprites.md) | 3D-baked placeholder sprites | Accepted |
| [0004](0004-dbfz-combat-model.md) | DBFZ-inspired combat model | Accepted |
| [0005](0005-25d-lanes-frame-hitboxes.md) | 2.5D lanes + per-frame hitboxes/hurtboxes | Accepted (implementation in progress) |
| [0006](0006-ai-art-pipeline.md) | AI art pipeline: ChatGPT images, packer, Codex coordination | Accepted (amended by 0007) |
| [0007](0007-art-spec-v2-shippuden-256.md) | Art spec v2: Shippuden designs, ~6.5 heads, 256 px cells, versioned review; Codex generates the images | Accepted |
| [0008](0008-world-art-and-parallel-production.md) | World art (crowd, stage, NPCs, UI, VFX) and parallel Codex production with a claim queue | Accepted |
| [0009](0009-move-system-v2.md) | Move system v2: command specials, special kinds, SUPER button, passives and modes | Accepted |
| [0010](0010-per-character-body-scale.md) | Per-character body scale (shorter Killua, taller Gojo); amends 0007 | Accepted |
| [0011](0011-kit-baseline-and-balance.md) | Kit baseline: every fighter fills the same slots within the same budgets; balance log | Accepted |
| [0012](0012-art-integration-gates-and-hand-anchors.md) | Art integration: approval-gated world art (VFX, crowd, stage, NPC, UI), local candidate preview, per-frame hand anchors | Accepted |
| [0013](0013-pull-requests-in-worktrees.md) | Every feature and character lands through a PR, built in its own worktree (`npm run pr`) | Accepted |
| [0014](0014-defensive-options-and-impossible-cpu.md) | Defensive options (parry, spot dodge, air dodge, wavedash), the IMPOSSIBLE CPU brain, air-juggle tracking | Proposed |
| [0015](0015-throws-and-cancelled-special-startup.md) | Throw and throw break; faster startup for specials cancelled out of a hit | Accepted |
| [0016](0016-showcase-cpu.md) | Showcase CPU: every CPU shows its kit (shared `Showcase` weights), CPU vs CPU plays short combos and mid-range kit for the viewer | Accepted |
| [0017](0017-ultimate-variety-and-rhythm-clashes.md) | Every ultimate its own shape (orb, rampage, reflex; one beam at most), ultimate clashes as a rhythm duel | Accepted |
| [0018](0018-preview-deploys-and-test-lab.md) | A Vercel preview link per PR (`npm run pr -- preview`) and a test lab page | Accepted |

## Template

```markdown
# NNNN. Title

- Status: Proposed | Accepted | Rejected | Superseded by NNNN
- Date: YYYY-MM-DD
- Deciders: User, Claude (, Codex)

## Context
What forces are at play? What problem are we solving? What constraints?

## Decision
What we will do, stated plainly.

## Alternatives considered
Options we rejected, and why.

## Consequences
What becomes easier, what becomes harder, what we must now maintain, and when to revisit.
```
