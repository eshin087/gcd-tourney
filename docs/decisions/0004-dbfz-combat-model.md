# 0004. DBFZ-inspired combat model

- Status: Accepted
- Date: 2026-10-04 (recorded retroactively 2026-10-08)
- Deciders: User, Claude

## Context
The game should feel like an anime fight: fast, flashy, readable, and fun for non-experts, with depth for
players who learn it. Dragon Ball FighterZ is the reference for that balance. The arena is a free-roam 3D
ring rather than a fixed 2D plane.

## Decision
Adopt a DBFZ-style toolkit on a 4-button layout (Light, Heavy, Special, plus Jump/Guard/Dash):

- **Auto combo** (Light ×4) that chains on whiff or hit. **Light → Heavy launcher** on hit.
- **Launcher + chase** (Jump/Dash after the launcher connects), **air combo**, and an **air heavy spike** with
  **ground bounce**.
- **Wall bounce** off the ring's ki barrier, **once per combo**.
- **Super dash** (homing, projectile-invulnerable, once per airtime) and **Vanish** (1 bar, teleport behind,
  guard-cancel capable).
- **Signature rush special** (1 bar), **air projectile** (½ bar), **ultimate beam** (3 bars) with a **super
  flash** cut-in, and a **beam clash** mash-off.
- **Ki economy** of 3 bars with passive gain, charging, and gain on hit, hurt and block.
- **Damage scaling, hitstun decay, a 22-hit combo cap and air tech**, so combos stay escapable.
- A **KO destructive finish**: the barrier drops and the loser flies out of the ring into the stands.
- Feel systems: per-fighter **hitstop**, directional camera shake, zoom punch, slow-mo, impact frames.
- All numbers live in **data** (`src/game/moves.js`). Animations stretch over move phases, so art never sets
  timing.
- The CPU drives the same `Pad` interface as humans.

Details and frame data: [COMBAT_DESIGN.md](../COMBAT_DESIGN.md).

## Alternatives considered
- **Traditional 6-button / motion-input fighter**: deeper, but a steep curve for the target audience.
- **Arena brawler (Naruto Storm style), fully 3D**: fits the ring, but loses the crisp 2D sprite readability
  the HD-2D look depends on. ADR 0005 resolves the 3D-ring tension with lanes.

## Consequences
- The shared moveset means every new character gets a complete kit for free. Identity comes from stats,
  special, projectile, beam and art.
- Systems interact heavily (bounces, caps, cancels), so changes need soak tests and table updates.
- Future depth (assists, tag teams, character-unique mechanics) requires ADRs to avoid special-casing.
