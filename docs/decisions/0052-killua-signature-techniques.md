# 0052: Killua's signature techniques: body auras, clinging shocks, tethered shots, lingering afterimages

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

Every new behaviour is data on a move, a projectile or a super, read by shared code (CLAUDE.md rule 4). Four pieces are
shared with the other fighters' revamps and built once by their owners (the hub's split, 2026-10-18); Killua adds his
fields beside them:

1. **Body look (owner Goku, `kit.modeLook`):** Godspeed, Whirlwind and Speed of Lightning name `aura` (an HD loop at the
   feet, one copy behind the body and a see-through `front` copy) and `shell` (the electric outline) on their move or
   SUPERS entry; the shared path draws them while a mode, a reflex or a running kit move lasts. Godspeed's `burstFx`
   uses `center` (it bursts out of the whole body). Killua adds `blink`: a streak laid along each blink dash.
2. **Strings (owner Luffy, `limb`):** the yo-yo's string is a projectile `limb` (the `strand` tube from his drawn hand to
   the shot). Killua adds `returns`: the shot flies out for `life` seconds, then (or at once on a hit or on the floor)
   back to a fixed point off its owner's body at `reel` units/s, spent on the way back (simulation). His Godspeed
   streaks are one-shot limbs (`Effects.limb` with a null id) of `godspeedStreak`, kept thin.
3. **Teleports (owner Gojo, `vanishFx` / `appearFx`):** Rhythm Echo and Whirlwind's counter leave with nothing
   (`vanishFx: false`) and land in his crackle (`appearFx`). Killua adds `afterimage` (afterimages close in round the
   target one at a time while he is hidden: crew entries in `kitState.crew`) and `streak` (a streak from where he
   left to where he lands).
4. **Hand effects (Effects.handTick):** a move's `fx` naming any effect is held in the drawn palm through the startup
   (Lightning Palm's crackle; `fxForm` / `fxScale` for a forming strip, Gojo's Red). Landed on its own (PR #189).
5. **Clinging hit effects:** a projectile's `cling` keeps an effect on the victim while it stays stunned (hitstun,
   launched or held). It is render state on the victim's `hfx` (never read by the simulation, skipped by the snapshot
   and the sim hash), set on the hit and drawn by `Game.fxTicks`.
6. **Lingering crews:** crew entries with `linger` (frames) stay drawn after their kit move ends, flickering out
   (CloneCrew keeps a copy, view only); `flash` / `tint` put a sheen on a copy.
7. **Dives:** `gather` (an effect held in the drawn hand at the top), `column` (a bolt from the sky stacked down to him
   through the slam: `Effects.column`), `landFx: { fx }` (its own strike on the floor instead of the white-out) and
   `diveAnim` (a strip whose last phase is the gather, then the dive frame held for the slam: `specialUp` v09, which
   also opens an air dive and finishes Speed of Lightning).
8. **Flurries:** `zigzag` plays Speed of Lightning inside the plain flurry's frames: streaks between blows, `attacks`
   (one of his normals per blow), `shock` (the hit blast instead of the white burst) and the Narukami finish (`pose`,
   `gather`, `column`, `strike`). `Effects.blast` takes a `ring` size (0: none); `burstFx` / `blastFx` pass it.
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
