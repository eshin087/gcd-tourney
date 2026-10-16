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
| [0019](0019-generative-lofi-music.md) | Chill generative lo-fi music: seeded composer + WebAudio performer, moods, ducks, music volume | Proposed (in PR) |
| [0020](0020-lying-pose-ground-contact.md) | Lying poses touch the floor: packer ground check, per-frame footprint, grounded KO shadow | Proposed (in PR) |
| [0021](0021-scale-gate-and-depth-normalized-sprites.md) | Measured scale gate for every packed frame; depth-normalized fighter sprites in fight cameras | Proposed (in PR) |
| [0022](0022-combo-escape-and-true-combos.md) | Combo escape: hold-Guard tech, once-per-round Burst, the blue counter for escapable combos, callout banners | Proposed (in PR) |
| [0023](0023-canon-power-up-styles.md) | Canon power-ups as per-fighter charge-style data under a VFX budget | Proposed (in PR) |
| [0024](0024-ground-damage-decals.md) | Ground damage: force tiers, element styles, a separate decal atlas kind | Proposed (in PR) |
| [0025](0025-cpu-defense-personas.md) | CPU defense personas, reads and exchanges for CPU vs CPU (amends 0016) | Proposed (in PR) |
| [0026](0026-combo-composer-and-bounce-budget.md) | Seeded CPU combo composer and a per-combo bounce budget (amends 0016) | Proposed (in PR) |
| [0027](0027-beam-clash-energy-struggles.md) | Beam clashes: energy specials that meet become a struggle; show director for CPU vs CPU | Proposed (in PR) |
| [0028](0028-timed-impact-tech.md) | Timed impact tech (Smash style): a fresh Guard press before a floor or wall impact; wall tech, wall jump, lockout | Proposed (in PR) |
| [0029](0029-title-style-scale-baseline.md) | The approved title-style cells are the cast and new-character scale/anatomy baseline; older numeric targets are historical | Accepted |
| [0030](0030-tech-recovery-animations.md) | Tech recovery animations: techGround, techRoll, wallTech on the tech's clock, wall anchoring, unread beats are not a scale pass | Proposed |
| [0031](0031-attack-alt-animations.md) | Attack alts: optional `<anim>Alt` strips for the nine attacks and both hit reactions, same frames and phases, deterministic Thue-Morse alternation, fail-soft to the base, packer hit-box check | Proposed |
| [0032](0032-goku-and-luffy-kits.md) | Goku and Luffy join: their kits (Goku keeps the cast's one beam), and the `laneStrike` ultimate kind for Gigant Pistol | Accepted |
| [0034](0034-beam-clash-visuals.md) | Beam clash visuals: drawing fixes for both clash tiers, a stream shape per move (`stream.style`), the optional `beamStruggle` pose and five clash effects | Proposed |
| [0033](0033-claude-codex-relay.md) | Claude-Codex relay: Claude queues the inbox prompt into the lane's Codex chat, Codex rings a git-ignored doorbell that wakes Claude's background watcher; per-lane hop limit and pause switch; approvals never relayed | Proposed |
| [0036](0036-online-rollback-netcode.md) | Online play: own rollback module, simulation made replayable first (sim-owned control basis, frame-based flow, view events, save/restore, deterministic math), lobby server on Cloudflare Durable Objects, inputs relayed, spectators replay; determinism spike results | Proposed |
| [0037](0037-approvals-in-claude.md) | Approvals happen in Claude: Codex rings the relay `--for user`, Claude asks with a question box and relays the user's quoted answer (`USER APPROVAL via Claude`); amends 0033 | Accepted |
| [0038](0038-melee-clash.md) | Melee clash: lights / heavies meeting while both are live cancel out and chain (CLASH ×n, CLASH BREAK! at 5); a heavy beats a light; the `clashBack` bounce; CPUs seek clashes | Accepted |
| [0039](0039-approvals-desk.md) | One approvals desk: only the Claude chat `0 - Approvals` asks the user; Codex rings for the user and other Claude chats' `relay ask` land in one queue (`.relay/asks/`), watched by `relay wait all`; `/desk` + a SessionStart hook restore it after chats are deleted; amends 0037 | Accepted |

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
