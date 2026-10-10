# 0017. Every ultimate its own shape; ultimate clashes are a rhythm duel

- Status: Accepted (part 1, ultimate kinds: implemented; part 2, rhythm clash: in progress)
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0011](0011-kit-baseline-and-balance.md) (kit baseline: amends its ultimate row and the cast table),
  [0009](0009-move-system-v2.md) (kinds)

## Context

Three of the four ultimates were the same shared beam (Rasen Cannon, Lightning Palm, Hollow Purple), and the only
clash in the game was beam against beam with button mashing. The user wants varied finishers with their own cool
moments, faithful to each anime; clashes only between ultimates, only where they make sense, balanced and skillful
rather than mashy; no comeback bonus. Goku (Super Saiyan) and Luffy (a comparable arc) join next.

## Decision

### 1. Ultimate kinds: at most one beam in the cast

| fighter | ultimate | kind | how it plays | avoid it by | damage |
|---|---|---|---|---|---|
| Goku (coming) | Kamehameha | `beam` (the shared beam) | the classic stream; the cast's only beam | leaving its lane | ~250 effective |
| Gojo | Hollow Technique: Purple | `orb` | Red (near hand) and Blue (far hand) fuse in front of him (26 f), then a huge sphere (radius 1.45) rolls forward at 15 u/s, erases the opponent's projectiles and vortices, carves a trench | leaving its lane, a vanish | 260, one unblockable hit |
| Naruto | Four-Tails | `rampage` | the shroud boils up, he roars (16 f) and pounces on all fours (20 u/s, up to 8 u), committed to the line chosen when the roar starts; a catch is a mauling: 3 slams × 45 and a chakra roar (120) into the barrier | leaving the lane during the roar; a whiff leaves him open 34 f | 255 |
| Killua | Godspeed: Whirlwind | `reflex` | Godspeed's reflex mode: for 300 f his body answers up to 4 blockable strikes or shots by itself (a blink behind the attacker and the Rhythm Echo strike, 70) | not attacking: wait it out, throw it, or use a super or ultimate (they go through) | ≤ 4 × 70 |
| Sasuke | Amaterasu | `ignite` (unchanged) | black flames ignite on him wherever he is | nothing (lower damage) | 80 + burn |

Killua's flurry SUPER is renamed **Godspeed: Speed of Lightning** (the premeditated Godspeed mode in the anime);
the name Whirlwind moves to the ultimate. SUPERs are unchanged otherwise. The ADR 0011 budgets hold: a dodgeable
non-beam ultimate stays at or under 300, an unavoidable one at or under 230.

Art: until Codex redraws them (`art/characters/<id>/KIT.md`), Four-Tails runs on `specialDown` (the transformation)
and `dash` (the pounce) with the shroud as a sprite tint plus engine chakra and tails, Hollow Purple and Whirlwind
use the existing `beamCharge` / `beamFire` poses. The animation names stay the contract: a fighter whose ultimate
isn't a beam redraws `beamCharge` / `beamFire` as the poses of that ultimate.

### 2. Ultimate clashes: the shared note chart

- **Only ultimate vs ultimate** (Heavy + Special, `kitState.ultimate`), and only kinds with a body that can meet
  another: the beam (its line), the orb (its sphere) and the rampage (the pouncing fighter). Ignite, reflex and
  domain never clash: their answer is dodging or timing, and their damage is lower to match.
- **A rhythm duel instead of mashing.** Both players get the same short chart of approach rings closing on a
  target (like osu!): taps, doubles and a final hold ("FINAL PUSH"), in three phases that speed up, about 7
  seconds. Each press is judged by its frame distance to the note: Perfect (≤ 3 frames, ~50 ms), Great (≤ 6),
  Good (≤ 9) or Miss; better grades push the struggle point harder; a press with no note nearby counts against you,
  so mashing loses. The chart is seeded from the two ultimates, so each pairing has its own pattern, and it is the
  same for both players. The CPU presses with a timing spread by level.
- **Stakes:** the winner's ultimate lands for about 250 and the loser's three bars are gone; a draw (a final lead
  under 2 points) blows both back for 90. No comeback modifier.
- **Answering an ultimate:** firing yours during the opponent's ultimate (its flash or windup) shortens your startup,
  so the two can meet. This already existed for beams (14-frame windup) and extends to every clashable kind.
- **Signature specials** (Rasengan vs Chidori and other rush specials meeting head-on): a one-beat version, a
  single timing press of about a second; the closer press wins and the loser takes the 60 both take today (a tie
  keeps today's double hit). At most one per 8 seconds, so neutral keeps its pace.

## Alternatives considered

- **Keep the shared beam for everyone.** Rejected by the user: every finisher looked the same.
- **Mash tug-of-war for all clashes** (the old beam clash). Rejected: it rewards tapping speed over skill and is
  unfair on touch screens; the user asked for a skillful, rhythm-game feel.
- **A note highway per player** (DDR-style, three lanes) or a **beat duel** (closest press per beat wins). The
  shared chart reads better during a cinematic clash and works one-thumbed on a phone; the beat duel is simpler but
  less varied.
- **SUPER vs ultimate clashes.** Rejected by the user: ultimates only.
- **A comeback push for the player with less health.** Rejected by the user.
- **A homing Four-Tails pounce.** Tried first: in CPU matches it landed four times in two rounds because sidestepping
  couldn't escape it. It now commits to its line when the roar starts.

## Consequences

- New `SUPERS` kinds `orb`, `rampage`, `reflex` (`src/game/kit.js`), the `Orb` object (`src/game/projectiles.js`,
  `Game.orbs`), and the Whirlwind check in `Fighter.takeHit`. Both CPU brains know where each kind makes sense, and
  how to dodge an orb or pounce and to stop swinging into Whirlwind.
- Codex redraws `beamCharge` / `beamFire` for Naruto (the Four-Tails form; required for the anime look) and
  optionally for Killua and Gojo; briefs in each `KIT.md`. A dedicated Hollow Purple VFX effect is optional.
- Part 2 (the rhythm clash, the one-beat special clash, the faster answer) lands in its own PR and replaces the mash
  in `Game.updateClash`, `CpuBrain` and `MasterBrain.mashClash`.
- Re-run the balance round-robin after both parts (ADR 0011 balance log).
