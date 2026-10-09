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
   the old one's status to `Superseded by NNNN`.
5. Mention the ADR in CHANGELOG and link it from the docs it affects.

## Index

| # | Title | Status |
|---|---|---|
| [0001](0001-threejs-vite-browser.md) | Three.js + Vite, browser-only, plain JS | Accepted |
| [0002](0002-hd2d-pixel-renderer.md) | HD-2D pixel renderer (low-res render, nearest upscale, bloom) | Accepted |
| [0003](0003-3d-baked-placeholder-sprites.md) | 3D-baked placeholder sprites | Accepted |
| [0004](0004-dbfz-combat-model.md) | DBFZ-inspired combat model | Accepted |
| [0005](0005-25d-lanes-frame-hitboxes.md) | 2.5D lanes + per-frame hitboxes/hurtboxes | Accepted (implementation in progress) |
| [0006](0006-ai-art-pipeline.md) | AI art pipeline: ChatGPT images, packer, Codex coordination | Accepted |

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
