# 0049: Gojo's signature techniques: technique looks as data, the Unlimited Void sequence in the view

**Status:** Accepted (user request, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-SKL-GOJ (engine), ART-SKL-GOJ (art, Codex chat "5 - Skills Effects")
**Builds on:** [ADR 0044](0044-signature-techniques.md) (HD effect cells, stand-ins), [ADR 0047](0047-sasuke-signature-techniques.md)
(technique data on moves, shots and supers), [ADR 0017](0017-ultimate-variety-and-rhythm-clashes.md) (Hollow Purple is an orb)

## Context

After Naruto and Sasuke the user asked for the same revamp of Gojo. In game (2026-10-18) Lapse: Blue and Reversal:
Red were Naruto's Rasengan sprite tinted blue or red under a soft glow disc, Red hit with the explosion that whites
out the screen, Blink left a ninja smoke puff, a shot Infinity stopped vanished in a ring, Unlimited Void was a white
flash and a navy floor with rings, and Hollow Purple was two small tinted Rasengans drifting together under a violet
disc that hid him, a tinted orb and a white explosion. The user's answers (question box, 2026-10-18): Hollow Purple's
full sequence with his hands carrying Red and Blue together (a new `beamCharge`), the full domain sequence, Blue and Red
both, plus the Infinity passive, Blink and a Six Eyes glint; the Infinity counter stays.

## Decision

Every look is data on the move, the projectile, the super or the passive, read by shared code (CLAUDE.md rule 4), and
none of it feeds the simulation (no new simulation state; the determinism fixtures need no change for it):

1. **Pull (Lapse: Blue):** `look` gives the Vortex its HD `core` (no glow disc), floor rubble dragged into it
   (`rubble` chunks every `rubbleEvery` frames: `Effects.rubbleIn`, debris chunks that spiral in and shrink to nothing)
   and the implosion it ends in (`collapse`) instead of the explosion. The pop draws no spark of its own.
2. **Shots (Reversal: Red):** the move's `fx: 'redForm'` with `fxForm` (Killua's shared hand-tick path, PR #189)
   plays the forming strip at the frame's `hand` anchor by the startup's progress: Red gathering on the raised
   fingertip. A projectile's
   `halo: false` drops the glow disc under full-color art; Red also uses ADR 0047's `orient` and `burstFx`.
3. **Teleports (Blink):** the shared `vanishFx` / `appearFx` (ENG-SKL-TPFX, PR #187: an effect name or `{ fx, scale,
   bottom, y, lead, reverse }`, false for nothing) replace the smoke puff, speed lines and afterimage with Blue's
   implosion, small, where he vanishes and where he reappears (the arrival freeze is unchanged).
4. **Passive (Infinity):** `PASSIVES.infinity.stopFx` draws a ripple of space where a shot stops, and the shot's own
   sprite hangs there, stopped, for `hang` seconds while it fades (`ShotViews.hang`).
5. **Orb (Hollow Purple):** `look` draws Red and Blue in the drawn palms (`def.hands[pose]`: per-frame near and far palm
   points, final-cell pixels, character data), plays a non-looping `beamCharge` across the merge by progress (f0 held
   through the flash), the two colliding (`form`, by progress, gone at the release) and the HD mass (`mass`) with no
   glow disc, erased specks drawn into it and its own hit (`burst`) instead of the explosion. A looping `beamCharge`
   keeps the hands apart and the two drift together. The spawn point and the clash body stay where they were.
6. **Domain (Unlimited Void):** `open` makes `Game.startDomain` hand the opening to the view: a black sphere with a hard
   rim bursts out of him and swallows the arena (`voidStage.open`; `Game.syncView` keeps the arena until it has),
   then the cosmos inside (a log-spiral galaxy round a core kept behind the fight, streaming starlight and stars in the
   sky; a black mirror floor whose Fresnel reflection carries the horizon the fight camera rarely sees; specks of
   starlight rushing past the camera), the frozen opponent's head flooded with light (`flood`), and `shatter`, a pane
   of black glass cracking open over the view when it ends, instead of the white flashes. Its data is read from the
   owner's SUPER, so a domain restored by a rollback simply shows the void.
7. **Glint:** a super's `glint` spawns the Six Eyes gleam at `at` [forward, up] off the feet, at the flash start or, with
   `on: 'merge'`, when Hollow Purple's merge starts (the ultimate splash covers its flash).
8. Twelve HD effect names (`lapseBlue`, `blueCollapse`, `redForm`, `reversalRed`, `redBurst`, `infinityRipple`,
   `sixEyesGlint`, `purpleForm`, `hollowPurple`, `purpleBurst`, `voidFlood`, `voidShatter`) with procedural stand-ins until
   Codex's art is approved (brief: art/characters/gojo/SKILLS_REVAMP.md), and one strip, `beamCharge` v04 (4 frames,
   not looping: the hands coming together).

## Consequences

- Frame data, damage, ranges and hit boxes are unchanged. Red's and Blue's pops draw their own blasts instead of the
  generic sparks; the hit stop and shake are the same.
- `hitboxes.json` gains hand anchors on `specialForward` f0-f1 and `throw` f0 (the raised fingertip); the repack changes
  only those anchors in `anims.json` (the sheet is byte-identical).
- When `beamCharge` v04 is approved, its palm points (`hands.beamCharge`, `_v` 4, with `meet`) are measured on the
  packed strip and the merge plays it by progress; until then the v03 loop and its measured palms are used.
- The void's cosmos and sphere are shaders: no art, nothing to approve. A later stage-art pass could replace them.
