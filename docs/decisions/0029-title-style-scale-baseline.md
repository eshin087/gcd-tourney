# 0029. The approved title-style cells are the cast's scale and anatomy baseline

- Status: Accepted
- Date: 2026-10-11
- Deciders: User, Claude
- Supersedes for new art: the 200 px body / 31 px head / ~6.5-head numbers of [0007](0007-art-spec-v2-shippuden-256.md)
  and [0010](0010-per-character-body-scale.md), the canon-height rule in art/CHARACTER_SCALE.md, and the numeric
  contract in art/scale/APPROVED_CAST_BASELINE.md (cast redraw, reverted)
- Keeps: 0007's cell, pivot, ppu, palette and file rules; 0010's runtime fields until Claude migrates them

## Context

Scale guidance accumulated in layers: ADR 0007's 200 px body and ~31 px head, ADR 0010's per-fighter
`standingBodyPx`, the canon-height rule, the 2026-10-10 "about 7 heads" proportion tasks, and the 2026-10-11
cast baseline (a common pixels/cm from era stature). The user rejected the cast redraw built on that last
contract and approved the four `title_style_draft_v01` sheets with their neutral and combat lineups instead
(PR #68). Several entry docs still pointed new work at the older numbers, so a fresh agent could pick any of
four contradictory targets.

## Decision

1. For art, the precedence order is:
   1. [PRODUCTION_CONTRACT.md](../../art/scale/title-style-pilot/PRODUCTION_CONTRACT.md) and its exact
      approved cells in `public/art-review/title-style-pilot/` (`*-neutral_v01.png`, `*-combat_v01.png`,
      both lineups; sources `art/characters/<id>/reference/title_style_draft_v01.png`). They are ground truth
      for Naruto, Sasuke, Killua and Gojo.
   2. This fighter's own approved neutral and combat references, once the user approves them beside that
      cast at native size.
   3. art/SPEC.md for everything that isn't scale: cells, pivot, ppu, palette, versions, canonical moves.
   Older numbers (200 px, 31 px, 6.5/7 heads, `1.2 × cm`, a common pixels/cm, `height_neutral`) describe
   the art that ships today or a superseded direction. They are not targets for new drawings.
2. A new fighter is calibrated against the approved lineup, not a formula: record era, stature source and
   uncertainty, draw a neutral and combat reference in the title style, and lay it beside the four approved
   cells at one pixel density. The user approves that lineup before the idle, and the idle before the rest.
   The pilot is a visual relationship, not a certified pixels/cm; if a physical calibration is wanted, Claude
   proposes it explicitly and the user reviews the resulting lineup.
3. Anatomy is fixed per fighter across every pose. Never resize a crouch, run or fallen pose to standing
   height, cap a tall fighter, add a child discount or inflate shoulders. Hair and clothing are measured
   separately from the body.
4. Runtime numbers (`standingBodyPx`, `bodyHeight`, contact zones, builds.json bands) stay as they are until
   Claude's contact and hurtbox check on the assembled title-style packs (QA-TITLE-CONTACT). That migration
   changes data, never the approved drawings.

## Consequences

- One target for every agent. Historical per-character docs (PROPORTION_REDRAW, BUILD_REDRAW, the older
  KIT/PROMPTS scale lines) stay for provenance but carry a pointer here.
- The packer's scale gate keeps working: it measures against `scaleReference` cells (ADR 0021, TOOL-033), so
  a fighter can be gated against its approved combat cell.
- Until the contact migration lands, a strip can fail a stale posed-envelope check while matching the approved
  anatomy. Claude resolves that in data or tooling. The fix is never to stretch a sprite.
