# 0048: Killua's signature techniques: body auras, clinging shocks, tethered shots, lingering afterimages

**Status:** Accepted (user request, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-SKL-KIL (engine), ART-SKL-KIL (art, Codex chat "5 - Skills Effects")
**Builds on:** [ADR 0044](0044-signature-techniques.md) (HD effect cells, crews, `blastFx`) and
[ADR 0047](0047-sasuke-signature-techniques.md) (technique data on moves, shots and supers)

## Context

After Naruto and Sasuke, the user asked for the same revamp of Killua (four fighters in parallel, 2026-10-18). In game
almost every Killua effect was the generic 128 px `lightning` tile under a big glow, and most hits ended in the generic
white-out: the Narukami bolt was a white-blue ball, Rhythm Echo a ninja smoke puff, Thunderbolt a plain jump and a
white-out, Godspeed a white flash and a glow blob now and then, Speed of Lightning 8 identical teleport hits with white
bursts, Whirlwind white blobs. The user's answers (question box, 2026-10-18): Lightning Palm renamed like the anime with
a paralysis, the super as a zigzag of lightning between different blows ending in Narukami from above, Whirlwind's
look revamped with the same rules, and Godspeed on his body, Narukami from above, Rhythm Echo afterimages and his
electrified yo-yos as the air special. Brief: [art/characters/killua/SKILLS_REVAMP.md](../../art/characters/killua/SKILLS_REVAMP.md).

## Decision

Every new behaviour is data on a move, a projectile or a super, read by shared code (CLAUDE.md rule 4):

1. **Body auras:** a mode's, a reflex super's or a running kit move's `aura` (`{ fx, scale, front, shell }`) draws an HD
   loop over the drawn body (one copy behind, a see-through `front` copy out of step) and the charge style's outline
   `shell` (auraShell.js) for as long as it runs (`Game.fxTicks` → `Effects.bodyAura`). Not while powering up (the
   charge style shows then) and not while hidden. A mode's `burstFx` replaces its white start burst; `blink` lays a
   streak along a blink dash.
2. **Clinging hit effects:** a projectile's `cling` keeps an effect on the victim while it stays stunned (hitstun,
   launched or held). It is render state on the victim's `hfx` (never read by the simulation, skipped by the snapshot
   and the sim hash), set on the hit and drawn by `Game.fxTicks`.
3. **Tethered, returning shots:** a projectile with `returns` flies out for `life` seconds, then (or at once on a hit or
   on the floor) flies back to a fixed point off its owner's body at `reel` units/s and is gone there; spent on the way
   back. `tether` draws a line from the owner's drawn hand to it (ShotViews, view only).
4. **Teleports:** `puff: false` (no smoke and no lines), `arrive` (its own effect where it lands instead of the white
   star; `Game.onVanish` takes it), `streak` (a lightning streak from where it left to where it lands), `echoes`
   (afterimages close in round the target one at a time while hidden: crew entries in `kitState.crew`).
5. **Lingering crews:** crew entries with `linger` (frames) stay drawn after their kit move ends, flickering out
   (CloneCrew keeps a copy, view only); `flash` / `tint` put a sheen on a copy.
6. **Dives:** `gather` (an effect held in the drawn hand at the top), `column` (a bolt from the sky stacked down to him
   through the slam: `Effects.column`), `landFx: { fx }` (its own strike on the floor instead of the white-out) and
   `diveAnim` (a strip whose last phase is the gather, then the dive frame held for the slam; switched on when
   `specialUp` v09 is approved).
7. **Flurries:** `zigzag` plays Speed of Lightning inside the plain flurry's frames: streaks between blows, `attacks`
   (one of his normals per blow), `shock` (the hit blast instead of the white burst) and the Narukami finish (`pose`,
   `gather`, `column`, `strike`).
8. `Effects.span` takes `thick` (a fixed size across the line, so a long streak stays thin); `Effects.streak` lays a
   span between two points; `Effects.blast` takes a `ring` size (0: none) and `burstFx` / `blastFx` pass it through.
9. Ten HD effect names (`lightningPalm`, `palmCrackle`, `palmShock`, `shockCrawl`, `godspeedBurst`, `godspeedAura`,
   `godspeedStreak`, `narukamiBolt`, `narukamiStrike`, `yoyo`) with procedural stand-ins in his own palette (thin,
   sparse, kinked filaments with violet rims, so his lightning can't be mistaken for the Chidori's dense blue knot).

## Consequences

- Frame data and damage are unchanged except the air special: the Yo-yo (54, physical, reach about 4.8 units out and
  back) replaces the air Narukami bolt (58, an energy shot that could beam-clash). Names: LIGHTNING PALM (neutral),
  NARUKAMI (up / air-down), YO-YO (air).
- The simulation changes (Speed of Lightning's poses only, the yo-yo's flight and return, Rhythm Echo's crew entries),
  so the determinism fixtures are re-recorded when this merges.
- Any later fighter can reuse an aura (a Super Saiyan glow, Gear Second steam), a cling (poison, burning), a tethered
  shot (a whip, Gum-Gum arms) or lingering afterimages.
