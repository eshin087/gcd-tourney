# 0032. Goku and Luffy join: their kits, and the laneStrike ultimate kind

- Status: Accepted
- Date: 2026-10-13
- Deciders: User, Claude
- Builds on: [0009](0009-move-system-v2.md) (kits and kinds), [0011](0011-kit-baseline-and-balance.md) (slots and
  budgets), [0017](0017-ultimate-variety-and-rhythm-clashes.md) (one beam in the cast, varied finishers),
  [0029](0029-title-style-scale-baseline.md) (art scale)

## Context

The roadmap's next two fighters, from two new series, are Goku and Luffy (user, 2026-10-12): Goku as a Super Saiyan
in the Cell saga and Luffy in the comparable Enies Lobby arc. On 2026-10-13 the user approved a move list per slot.
ADR 0017 already reserved the shared beam for Goku's Kamehameha. Luffy's finisher, Gear Third's Gigant Pistol, is a
giant fist thrown down his lane: none of the existing ultimate kinds has that shape (an orb rolls on by itself and
erases projectiles, a rampage pounces and mauls, a skyStrike marks a spot).

## Decision

1. **Goku** (`src/characters/goku.js`): Ki Blast Volley (shot, 3 × 24), Dragon Fist (energy rush, 150), Rising Kick
   (dive), Instant Transmission (teleport behind + the vanish kick, on ↓), Kaio-ken Rush (flurry), and the Kamehameha:
   the shared beam, his `beam` palette. No passive: the Super Saiyan aura is his power-up look (`charge`). Stat index
   1.02.
2. **Luffy** (`src/characters/luffy.js`): Gum-Gum Pistol (a physical shot, 70, ~6 u), Bazooka (rush, 145), Rocket
   (dive), Gear Second (mode on ↓: × 1.25 speed, × 1.1 damage), Whip (low rush on ←), Gear Second: Jet Gatling (flurry
   from the front), Gear Third: Gigant Pistol (laneStrike). Stat index 0.98.
   The user's list put the Whip on ↓; ADR 0011 keeps ↓ for modes and counters, so Gear Second takes ↓ and the Whip ←.
3. **New SUPERS kind `laneStrike`** (`src/game/kit.js`): `windup` frames on `pose` (beamCharge), then a strike that
   travels down the lane he faces to `reach` in `extend` frames (strikePose, beamFire), one unblockable hit
   (`dmg`, `launch`) on a target within `width` of the lane and below `height`, then `recovery`. It commits to the lane
   when the punch leaves, so leaving the lane or jumping during the windup dodges it. It doesn't clash (not in
   `CLASH_KINDS`). The CPU uses it when they stand in its lane within reach (ai.js, aiMaster.js). Budget: dodgeable,
   so up to 300 (ADR 0011); Gigant Pistol is 270.
4. **Flurry options** (data, no new kind): `front` keeps the striker in front of the victim and ends on a straight
   wall-bounce punch (`finalLaunch`) instead of the slam from above; `hitColor` tints the per-hit burst; `finalFx:
   'impact'` is an explosion in `finalColor`. Kaio-ken Rush and Jet Gatling use them.
5. **Hand fx `kiFist`** (effects.js): a golden glow and flame licks on the fist for the Dragon Fist.
6. The art follows ADR 0029: each fighter gets a title-style neutral + combat reference beside the four approved cells,
   approved by the user before any animation is drawn. Their manifest blocks are reserved in this PR so the two Codex
   art threads only edit their own fighter's block.

## Consequences

- The cast's finishers are now a beam (Goku), an orb, a pounce, an ignite, a reflex and a lane strike: still one beam.
- Gigant Pistol's giant fist is an `orb` sprite tinted skin colour until a dedicated VFX exists (fail-soft); the
  giant arm itself is drawn in Luffy's `beamCharge` / `beamFire` strips, so the cell margins need a check when Codex
  delivers them.
- Balance is a first guess inside the ADR 0011 budgets. The round-robin with six fighters is CHAR-goku-balance and
  CHAR-luffy-balance in docs/TASKS.md.
