# Killua: kit notes for the art

> The moveset brief for Killua, as far as the art needs it. His kit is ADR 0011 (cast table) and
> [ADR 0017](../../../docs/decisions/0017-ultimate-variety-and-rhythm-clashes.md) (ultimate); the numbers live in
> `src/game/moves.js`. Design facts are in [CHARACTER.md](CHARACTER.md); ADR 0007 and [art/SPEC.md](../../SPEC.md) win
> over this file. Written by Claude; Codex merges what changes into ANIMATIONS.md, PROMPTS.md and MOVES_AND_VFX.md.

## What changed (ADR 0017)

| button | before | now |
|---|---|---|
| SUPER (3 bars) | Godspeed: Whirlwind (flurry) | **Godspeed: Speed of Lightning**: the same dash, 8-hit afterimage flurry and slam, renamed after Godspeed's premeditated mode in the anime |
| Heavy + Special (3 bars) | Lightning Palm (beam) | **Godspeed: Whirlwind**: Godspeed's reflex mode. For 5 seconds his body answers up to 4 strikes or shots by itself: a lightning blink behind the attacker and the Rhythm Echo claw strike (`specialForward`). |

The Lightning Palm beam is gone. The anime's Whirlwind (Chimera Ant arc) is the mode where his body moves before
his mind: he reacts to an attack automatically, at lightning speed.

### Poses

- `superPose` (the Speed of Lightning flash) and `specialForward` (the counter strike) are unchanged.
- `beamCharge` is now the **Whirlwind activation** (the flash and a 12-frame recovery). The approved Lightning Palm
  charge (hands drawn back to the hip, crouched) works as a charge-up and needs no redraw. **Optional, for the anime
  look:** generate the next `_vNN` as the Whirlwind ready stance: standing low and relaxed on the balls of his feet,
  arms loose and slightly away from his body, hands open with the claws relaxed, assassin eyes fixed forward, his
  white hair bristling upward from the static. Same scale and feet as idle; no lightning in the sprite (the engine
  draws the crackle and afterimages).
- `beamFire` is no longer used by any move. Keep the approved frames: the name stays in the contract.

### Effects

The engine draws all of it: the activation burst, the crackle around him while Whirlwind runs, the afterimages, and
the blink.
