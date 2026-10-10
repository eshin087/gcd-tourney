# Gojo: kit notes for the art

> The moveset brief for Gojo, as far as the art needs it. His kit is ADR 0011 (cast table) and
> [ADR 0017](../../../docs/decisions/0017-ultimate-variety-and-rhythm-clashes.md) (ultimate); the numbers live in
> `src/game/moves.js`. Design facts are in [CHARACTER.md](CHARACTER.md); ADR 0007 and [art/SPEC.md](../../SPEC.md) win
> over this file. Written by Claude; Codex merges what changes into ANIMATIONS.md, PROMPTS.md and MOVES_AND_VFX.md.

## Ultimate: Hollow Technique: Purple (ADR 0017)

Hollow Purple is no longer a beam. After the super flash (46 frames) **Red** appears in his near hand and **Blue**
in his far hand; for 26 frames they drift together and fuse into Purple about 0.9 units in front of him; then a
huge sphere (radius 1.45 units, about 370 px across at sprite scale) rolls forward at 15 units/s, erasing every
projectile in its path and carving a trench, and hits once for 260. The engine draws Red, Blue, the fusion, the
orb and the trench.

### Poses (`beamCharge`, `beamFire`)

- **No redraw is required.** The approved `beamCharge` (both arms held apart at chest height, palms up, the far hand
  forward-right at about (204, 104) holding Blue, the near hand back-left at about (54, 104) holding Red) and
  `beamFire` (the deep lunge with the near arm thrust forward) already fit the new timing: the engine places Red and
  Blue on those hands and fuses them in front of him.
- **Optional, for the anime look:** compare `beamFire` with the release in Jujutsu Kaisen season 2 (the Hidden
  Inventory arc, his fight with Toji Fushiguro) and the manga. If the release gesture in that scene differs from the
  open-palm thrust, generate `beamFire` as the next `_vNN` with that gesture. Keep the hand at the fusion point,
  about (243, 115) in the 256 cell (0.9 units forward, 0.98 up), and no orb, glow or energy in the sprite.

### Effect (optional, world-art lane, ADR 0008)

The orb is the procedural `orb` effect tinted violet (`#a24cff`) with a light core (`#f2e2ff`) and a violet glow
(`#7a2cff`). A dedicated `hollowPurple` VFX strip would read closer to the anime: a giant sphere with a bright
lavender-white core, a saturated violet body and a darker violet rim, with swirling energy streaks; 4 frames
looping, square, on flat magenta, at least 256 px. It needs a VFX atlas entry first (a Claude task), so ask before
generating it.

## SUPER and the rest

Unchanged: Domain Expansion: Unlimited Void on SUPER; Lapse: Blue, Reversal: Red, Blink and Infinity as in ADR 0011.
