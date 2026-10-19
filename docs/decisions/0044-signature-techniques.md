# 0044: Signature techniques: HD effect cells, shadow clone crews, cloak and transformation shaders

**Status:** Accepted (user request, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-SKL-NAR (engine), ART-SKL-NAR (art, Codex chat "5 - Skills Effects")
**Amended by:** [ADR 0053](0053-hd-effect-pages.md): one HD page per owner (`atlas_hd_<owner>.png`), loaded per match

## Context

The user asked to revamp the specials, supers and ultimates, starting with Naruto, because most "don't seem like the
iconic animations, effects from the original anime/manga". What Claude found:

- **Four-Tails** shipped human Naruto: the title-style round of 2026-10-11 redrew `beamCharge` / `beamFire` from the old
  Rasen Cannon descriptions instead of the shroud brief, so the ultimate showed a normal Naruto in a beam pose with red
  flame sprites around him. The splash cutout kept his hair and headband (its prompt asked for them).
- **Rasengan** was the generic 64 px `orb` tile and the generic explosion, which whites everything out on hit.
- **Nine-Tails Cloak** was ~flame sprites around him; the anime wraps him in see-through chakra that hugs his outline.
- **Shadow Clone Barrage** was the shared flurry: one Naruto teleporting round the target, never a clone on screen.
- **Rasenshuriken** was the Rasengan orb tinted white; **Uzumaki Barrage** was Naruto alone with afterimages;
  **Substitution** was only a smoke puff.

The user's answers (question box, 2026-10-18): the cloak is the Part 1 shroud with one tail, the clone super ends
with a kick-up and a Rasengan from above, the Rasengan is formed solo, and the Rasenshuriken, Uzumaki Barrage and
Substitution are revamped too (the air shuriken stays).

## Decision

1. **HD effect cell.** Signature effects are drawn in **256 px cells at 112 px per unit**: the same world size per
   cell as the shared 128 px / 56 ppu effects, twice the detail. `VFX_EFFECTS` entries with `hd: true` pack into a
   second page, `public/vfx/atlas_hd.png`, described by atlas.json's `hd` block (`cell`, `ppu`, `cols`, `rows`,
   `anims`). The bottom anchor is y = 240. At runtime `Effects.sheet()` picks the page per effect, so `spawn` / `keep`
   / `uv` work unchanged for callers. Every HD name has a small procedural stand-in in `vfxPainter.js` until its art is
   approved (fail soft). First names: `rasengan`, `rasenganForm`, `rasenganBurst`, `rasenshuriken`,
   `rasenshurikenDome`, `poof`, `subLog`, `fourTailsRoar`.
2. **Shadow clones are data in the kit state, drawn by the renderer.** A kit move keeps `kitState.crew`: plain
   entries (position, facing, animation, progress, visible). `Fighter.sync` draws them with a `CloneCrew`
   (`src/game/clones.js`): extra `SpriteActor`s sharing the fighter's sheet. The simulation never reads a clone, every
   hit is still the real fighter's, and the entries are saved and rolled back with the rest of the state (ADR 0036).
   `SUPERS.<id>.crew` turns the flurry into the anime's barrage (fan of clones on the dash, a ring of strikers, the
   kick-up with callouts, the drop from above); a dive's `clones` adds clones that rise and kick beside it. The dash
   and the catch stay the plain flurry's, so the CPUs' timing still holds.
3. **Cloaks and transformations live on the body, not around it.** A mode's `cloak` (`ChakraShroud`, auraShell.js)
   draws see-through chakra over the drawn pixels plus a boiling rim and fizzing specks outside them; one chakra tail
   is a held effect. An ultimate's `shroud` sets the body shader's `engulf` (sprites.js): red-black chakra climbing from
   the feet up through the first 70 % of the super flash, then held at `hold`; `tails` held tail effects. `hold: 1`
   keeps the drawn body a boiling silhouette while only human frames exist; `hold: 0` lets drawn shroud frames show.
4. **A rush special may name its own hit blast** (`blastFx`), which replaces the generic explosion: a spiral you can
   read instead of a white-out (`{ fx: null }`: its blast is drawn elsewhere, the Rasenshuriken's vortex dome).

## Consequences

- New techniques for any fighter reuse these: a clone crew (Naruto today; any summon or afterimage army later), a
  cloak (Kurama mode, Susanoo ribs), an engulf (any transformation), an HD effect for any signature move.
- The atlas json gains an optional block; old packs without it load unchanged, and a missing `atlas_hd.png` keeps the
  HD effects procedural with one `[vfx]` warning.
- Up to 6 extra sprite actors per fighter exist after the first crew move of a match (hidden when unused, disposed
  with the match).
- Until Codex's Four-Tails frames are approved, the beast is his `specialDown` crouch and `dash` as a silhouette with
  four tails. Then `fourTails` switches to `beamCharge` / `beamFire` (maul frame f0, the user's call 2026-10-18), with
  `hold: 0` and `tails: 0`.
