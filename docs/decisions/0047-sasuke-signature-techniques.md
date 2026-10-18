# 0047: Sasuke's signature techniques: technique data on moves, shots and supers

**Status:** Accepted (user request, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-SKL-SAS (engine), ART-SKL-SAS (art, Codex chat "5 - Skills Effects")
**Builds on:** [ADR 0044](0044-signature-techniques.md) (HD effect cells, `blastFx`, the engulf shader)

## Context

After Naruto (ADR 0044, 0045) the user asked for the same revamp of Sasuke. In game (2026-10-18) the Chidori was the
generic 128 px lightning tile under a big glow (a white blob) with the generic explosion on hit, the Chidori Spear a
lightning sprite flying out of his palm, Kirin a blue glow disc and a white-out, Amaterasu a white flash and a black
silhouette in purple, Lion's Barrage a rising kick and a slam, the Sharingan counter a stance and a kick. The user's
answers (question box, 2026-10-18): redraw the Chidori with its effects, the full anime Kirin sequence, Amaterasu
revamped, and Lion's Barrage, the counter, the Chidori Spear and the air Great Fireball as well.

## Decision

Every new behaviour is data on the move, the projectile or the super, read by shared code (CLAUDE.md rule 4), so
any later fighter can reuse it:

1. **Rush specials:** `trench` (a ground style torn along the floor wherever the drawn hand drags through the run,
   `GroundDamage.trail`) and `hitPose` (contact jumps the strip to the drawn strike, given as its place in the active
   phase, so the Chidori shows the stab, not the run it was in).
2. **Projectiles:** `lance` (an HD strip laid from the hand along the shot, played by a frame sequence `seq` so its
   middle frames hold while the blade is out: the Chidori Spear), `orient` (the sprite turned along its flight and
   mirrored: the Great Fireball) and `burstFx` (its own hit blast through `Effects.blast`, with a `smoke` count).
   Shots with their own blast use `spark: 'none'` so no generic white burst covers it.
3. **Dives:** `shadow` (Lion's Barrage, the Shadow of the Dancing Leaf): when the rising kick connects he blinks
   behind them as they rise, lands `hits` in the air, flips over them and carries them down into the floor with the
   slam. The victim is held and placed exactly; `kitState.hold` switches off the fighters' push-apart while one kit
   move places both bodies. A KO mid-way falls back to the plain slam.
4. **Counters:** `current` (an effect bursting from the body on the read, plus an afterimage: Chidori Current).
5. **Sky strike:** `storm` (Kirin) plays the anime inside the unchanged frames: the Great Fireball breathed into the
   sky, thunderclouds over the spot, the stage dimmed and the camera tipped up (view-only `Game.stormAt / stormDim /
   stormLift`, which expire by themselves two frames after the kit move stops writing them), lightning crawling on
   the spot instead of the glow dome, the strike pose 9 frames early and the dragon (`kirinHead` over stacked
   `kirinBody` tiles) diving out of the clouds for the last 6 frames.
6. **Ignite:** `blastFx` on a non-rush hit draws the technique's blast (Amaterasu's black flames bursting on them),
   `hitFlash: 'ignite'` is a hit flash tier without white, and `burn.fx` keeps the black blaze on the burning body
   (one copy behind, one in front) while the body itself burns black through the ADR 0044 engulf shader.
7. Thirteen HD effect names (`chidori`, `chidoriForm`, `chidoriBurst`, `chidoriSpear`, `chidoriCurrent`,
   `amaterasu`, `amaterasuIgnite`, `greatFireball`, `greatFireballBurst`, `stormCloud`, `kirinBody`, `kirinHead`,
   `kirinStrike`) with procedural stand-ins until Codex's art is approved. The packer now keeps a manifest effect's
   `hd` and `tile` flags (it dropped them for a name its own table did not list).

## Consequences

- Frame data and damage are unchanged except Lion's Barrage on a hit: three air blows (10, 10, 12) before the slam,
  about the old total after scaling.
- The determinism fixtures are re-recorded; a scripted rollback check of all seven moves (an 8-frame re-simulation on
  other inputs every 10 frames) matches frame for frame.
- `Effects.spawn` gains `seq` and `Effects.span` (a straight effect laid along a line): view code only.
