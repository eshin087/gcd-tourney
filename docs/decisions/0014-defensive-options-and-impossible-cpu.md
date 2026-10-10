# 0014. Defensive options (parry, spot dodge, air dodge, wavedash) and the IMPOSSIBLE CPU

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0004](0004-dbfz-combat-model.md) (combat model), [0009](0009-move-system-v2.md) (kits),
  [0011](0011-kit-baseline-and-balance.md) (balance process)

## Context

The user asked for Smash-style movement and defense (wavedash, parry, spot dodge, air dodge), and for an
IMPOSSIBLE CPU level that uses the engine to its limit (optimal combos, movement, decisions) so players see how
deep the game goes, plus CPU vs CPU fights worth watching. Until now defense was block, vanish (1 bar), dash
invincibility and the kit counters; the CPU was one probabilistic brain (Easy, Normal, Hard).

## Decision

### 1. Four free defensive options, all on existing buttons (no new input, no new animation names)

| option | input | rule (numbers in `DEFENSE`, `src/game/moves.js`) |
|---|---|---|
| Parry | press Guard ≤ 6 frames before a blockable hit lands | no damage, chip or block stun; the defender acts at once; a melee attacker is staggered 16 f (24 f for big moves and specials); a projectile is swatted away; +12 ki; a 7 f world freeze sells it. Beams, unblockables and kit counters can't be parried. Every Guard press starts a 24 f lockout, so mashing Guard only blocks; a parry re-arms at once, so a string can be parried hit by hit. |
| Spot dodge | Guard + ↓ (the stick pushed, not held from before) | intangible on frames 2-14 of 24; each dodge within 2.5 s of the last adds 4 recovery frames (up to 3 times) |
| Air dodge | Guard in the air (once per airtime; getting hit gives it back) | intangible on frames 2-17 of 30; with a direction it bursts that way at 12.5 u/s angled down (24 u/s down below 0.95 units), neutral hovers; after an air attack too |
| Wavedash | a directional air dodge that meets the floor, or Guard pressed with the jump (from 2 frames before the jump squat) | slide at 12.5 u/s with 0.875 friction per frame, act from frame 5, keep facing the opponent; the slide's momentum carries into the next attack, guard, special or charge. Jump + Guard with no direction lands on the spot with 10 frames of lag (Melee rules). |

Guard is otherwise unused in the air, and Guard + ↓ was unused, so nothing existing changes meaning. Vanish
(Guard + Special) still wins: Special within 3 frames of an air dodge turns it into a vanish.

**No new animation names.** The new states reuse existing poses (`vanish` crouch-blur for the spot dodge,
`airRecover` / `jumpFall` for the air dodge, `land` for the slide) with ghosts and a blue intangibility shimmer.
Dedicated `dodge` / `airDodge` / `parry` poses are a follow-up that needs the animation-contract change
(CLAUDE.md hard rule 2) and art.

### 2. IMPOSSIBLE is its own brain (`src/game/aiMaster.js`, `MasterBrain`)

`makeBrain(fighter, level, spectate)` in `ai.js` picks it for `level === 'impossible'`; Easy, Normal and Hard keep
`CpuBrain`. It still only presses buttons on its Pad (design pillar 4) and reads what the screen shows (states,
frames, positions), never the opponent's Pad. Layers, in priority order each frame:

1. **Recover**: tech at the first legal frame, vary wake-up timing.
2. **Own move**: hit-confirmed routes. Light ×3, then a kit special only when it lands before the victim's hit
   stun runs out (a 24 f Rasengan after light3 does not; see Consequences), else the launcher; air string with a
   spike while the super dash can follow the ground bounce; super dash / vanish extensions; a lethal check that
   spends the second super, a kit ultimate or a rush special when the scaled damage kills.
3. **Threats**: when, and whether, the opponent's move can reach it (startup, lunge and rush travel, auto lane step,
   projectile closest approach, beams, flurries, Amaterasu, Kirin zones, dives, teleports), seen only after
   `react` frames. It answers once per threat: parry (timed so the hit lands ~2 frames after the press), spot
   dodge (only moves whose recovery leaves a punish), block, super dash through projectiles, kit counter, vanish,
   counter-beam into a clash, depth sidestep, dash out of a Kirin zone, air dodge.
4. **Punish**: the opponent's remaining recovery (whiffs, landing lag, parry stagger, spot dodge recovery, kit
   recoveries, beam users from behind) against jab, dash-in light, shots, teleports, or a super that kills.
5. **Situational**: meaty jab timed to the end of wake-up invincibility, launcher anti-air at the predicted height.
6. **Neutral plans**: approach (walk, dash, wavedash, super dash), pressure, guard (with parry fishing that
   respects the lockout), bait, footsies with wavedash steps, jump-in (air dodge mix-up), zoning, charging, modes,
   kit specials, beam from range.

Fairness knobs are data (`STYLES`): it sees an attack only after 7 frames (a 5-frame jab is a guess, as for a
human), goes for a parry about half the time, and has habits. CPU vs CPU uses the `showman` style (riskier, saves
meter some rounds for a beam or super, more wavedashes) so a spectated fight keeps moving.

### 3. Air juggles track the victim (engine fix found by the CPU work)

With the art packs, the documented air string dropped for everyone: a launched pose leans back, so its hurtbox
starts behind the victim's feet, and the juggle "ride-along" copied the victim's drift without closing the gap.
`airLight2` whiffed on Naruto 100 % of the time and the `airHeavy` spike on Gojo about as often. Air attacks
now close to `JUGGLE_GAP` (0.76, just outside `Game.separate`'s 0.72) while riding a hit and during the next
move's startup, and `airHeavy` gets `boxPad: [0.5, 0.45]`. The air string connects ~97 % across all 16 pairings.

## Consequences

- Defense is stronger and more expressive; offense needs mix-ups and timing (delay a string to beat a parry, bait
  a dodge). **There is still no way to beat a held guard** (guard auto-turns, no throw or guard break): a
  dummy holding Guard forever took zero hits from the IMPOSSIBLE CPU in 50 s. A throw (beats guard and parry) or
  a guard meter is the next balance decision (user question).
- **Light ×3 → signature rush special is not a true combo** (light3's 22 f hit stun ends 2-6 frames before
  Rasengan / Chidori / Rasenshuriken land); a player holding Guard blocks it. The CPU only uses specials that
  connect; fixing the frame data (or a faster cancelled startup) is a user decision.
- Juggle tracking makes air combos longer for everyone (meterless ~230-295 instead of ~150); re-run the balance
  round-robin (ADR 0011) before tuning.
- Hard's guard reaction (7 frames) now lands inside the parry window against raw heavies, so Hard parries some
  launchers too.
- Measured (`?debug`, honest dummy that guards and techs at every chance): IMPOSSIBLE vs a scripted Rasengan
  parries ~55 %, dodges ~20 %, blocks the rest, never gets hit, and punishes 86-197. IMPOSSIBLE beats Hard 9/9
  matches. CPU vs CPU rounds end by KO in 15-35 s with wavedashes, parries, vanishes, supers and the odd beam.
