# 0048: The live announcer: a view-only MC who follows the fight and comments it in small captions

**Status:** Accepted (user request, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-118 (engine), ART-NPC-ANN-R1 (art, Codex chat "2 - World Announcer")
**Builds on:** [ADR 0008](0008-world-art-and-parallel-production.md) (NPC cameos),
[ADR 0012](0012-art-integration-gates-and-hand-anchors.md) (NPC sheets, `NPC_CUES`),
[ADR 0036](0036-online-rollback-netcode.md) (view vs simulation)

## Context

The tournament announcer (ENG-024) stood still beside the gong and switched between four poses on a handful of
events. The user asked for him to move around and follow the action, with hype manga speech bubbles commenting the
fight: the special moves used, who is winning, the momentum. Their answers (question boxes, 2026-10-18): he follows
the fight and also climbs into the ring for the KO call; crisp manga bubbles drawn over the game; lively talk (every
notable moment plus filler in the lulls); new art for walk, run, shocked and a mic thrust.

The first build kept him on a walkway on the grass around the ring. The fight camera looks down at the ring, so the
grass beyond it sits at the very top of the screen under the health bars: in a normal close fight he was a small
figure half hidden by the HUD. Shown screenshots of both, the user picked the ring's back half.

The second round (same day): the white manga balloons were "very distracting and annoying"; the user wants him to be
a cool background thing, not a focal point. The balloons went, the lettering shrank to a small caption above his head.

## Decision

1. **A view-only director.** `src/world/announcer.js` (`Announcer`) owns his body (the packed `NpcSprite`, or the
   painted placeholder through `paintedBody`), where he stands, what he plays and what he says. The arena hands him
   its NPC cues and calls him from `arena.update(time, excite, game, dt)`; he reads the game (states, fighters,
   timer, camera yaw) and never writes to it. `Game.quiet` already stands the arena in during a rollback, so a
   re-simulated frame never cues him twice, and his `Math.random` (line picks, sides) is fine under ADR 0036.
2. **Cues carry what he needs.** `arena.npcCue(kind, info)`: the existing kinds gain their fighter (and the move's
   name, the loser, the clash tier), and new kinds go only to him: `special`, `combo`, `tag` (every Game.tag technique
   banner), `throw`, `maxPower`, `clashWin`, `timeup`. `NPC_CUES` stays the reaction table for the other NPCs and his
   base reactions (a duck for cover stops him).
3. **Where he stands.** Intro and round calls in the ring just beyond the fighters (seen from the camera). In the
   fight a spot five tiles beyond their middle and four to one side, inside the ring, kept while it is clear of both
   fighters; he runs when far, scurries away from a fighter who comes at him, and when cornered at the edge hops down
   to a walkway on the grass (a rounded square between the stone lip and the standing-room fans) until his ring spot is
   free. After a KO he chases the fallen fighter and counts ONE / TWO / THREE, then runs to the winner for the
   victory close-up and calls the round. The match's hero shot is the winner's alone: he goes back to the gong.
4. **What he says** is data: `src/world/announcerLines.js`, one entry per moment with a bubble style, a priority, a
   cooldown, a reaction animation and original lines with `{A}` / `{B}` / `{M}` / `{N}` slots. One bubble at a time: a
   line shows when nothing that outranks it is up; once-a-round moments (first hit, low health, comeback, the clock)
   wait up to 2.5 s for a busy bubble; filler fills a 6-10 s lull.
5. **The captions** (`src/ui/speechBubble.js`) are DOM, not pixels, so small lettering stays sharp on a phone where
   the 360 px pixel buffer could not hold it: the UI's Bangers font at about 1.45 `--u` (9 px minimum), one line,
   cream with a thin ink outline for every line (a fighter's name in their color), fading in and out, in a layer under
   the HUD so cut-ins and announcements stay on top. No balloon, no tail, no pop or shake, and nothing while he is off
   screen: he is a background touch, not a focal point. Third round (same day, "all over the place and buggy ... not so
   bouncy"): it is locked straight above his standing head height, moved in the game's own pixel steps with no easing,
   never switched to his side, and unmoved by a hop's arc or a duck for cover; under the health bars it is only clamped
   down; and a line stays up at least 1.2 s before another may replace it (the KO count and the winner call excepted).
6. **Art.** Four new NPC animations (`walk` 4, `run` 4, `shocked` 2, `micThrust` 2; walk and run are cycles in
   place, the engine moves the billboard). The packer reads an NPC animation's frame count from its ANIMATIONS.md
   row. Until a strip is approved, `NPC_FALLBACK` plays the nearest existing pose and the announcer bobs and waddles
   so a sliding idle still reads as walking.

## Alternatives considered

- **Manga balloons** (the first build: white SVG starbursts and round balloons with inked tails, docking at the
  screen edge when he was off screen): fun, but they pulled the eye off the fight; the user turned them down.
- **Text in the 3D world** (a canvas texture on a billboard): pixel-consistent, but unreadable at the 360 px buffer on
  a phone.
- **Ringside only** (the first build): faithful to the arena layout, but the camera hides him under the HUD.
- **A generated line per event** (an LLM or text templates assembled word by word): no network or dependency is worth
  it; a curated table reads better and stays reviewable.

## Consequences

- Any NPC can now walk (`NpcSprite.setMirror`, `setAnim`, `NPC_FALLBACK`); a new announcer moment is one LINES entry
  plus, if the game has no cue for it yet, one `npcCue` call.
- He shares the ring with the fighters but has no hit boxes: projectiles and beams pass through him. A follow-up could
  make the crowd or the camera react to him; nothing depends on it.
- `game.js` changes for him change the simulation fingerprint (`vite.config.js` simId hashes `src/game`), so the
  determinism fixtures are re-recorded with the change even though the simulation does not change.
- He is a cameo (ADR 0008): the `cameos: false` build (ENG-020) must drop or replace him and his lines' homage.
