# 0054: GOD, a spectator-only CPU level above IMPOSSIBLE

**Status:** Accepted (user decision, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-120
**Builds on:** [ADR 0014](0014-defensive-options-and-impossible-cpu.md), [0016](0016-showcase-cpu.md),
[0025](0025-cpu-defense-personas.md), [0026](0026-combo-composer-and-bounce-budget.md), [0038](0038-melee-clash.md)

## Context

The user asked for CPU vs CPU at "god-like tier": more epic combos, continuous parries, dodges and clashes, "a grand
epic anime episode fight" that shows what the game can do. Asked how, they chose:

- a **new GOD level on top** in the CPU vs CPU menu, with today's spectated IMPOSSIBLE (the showman) kept as it is so
  the two can be compared;
- **stronger brains, no director**: the drama comes from both CPUs playing at the top of every dial, not from a
  script;
- **the real rules**: same health, damage, timer and juggle rules as any match;
- no extra presentation (slow-mo, callouts, staredowns).

A 12-match baseline soak of the showman (seed 101, every pairing of the six fighters) showed what was missing: parry
streaks never longer than 2, melee clash chains never reaching the finale, 2 combos of 13+ hits in 257.

## Decision

1. **GOD is a level only for watching.** `WATCH_LEVELS` (`src/game/ai.js`) is `CPU_LEVELS` plus `god`; the CPU vs CPU
   menu lists it and defaults to it. `makeBrain('god', spectate)` builds a `MasterBrain` with the `god` style; against a
   person (a hand-typed `?level=god`) it builds IMPOSSIBLE, so fighting the CPU is unchanged.
2. **It is a style of the same brain** (`STYLES.god`, `DEF_KNOBS.god` in `aiMaster.js`): the showman's repertoire with
   every dial turned up: a 3-frame read, parries and dodges before a plain block, the rhythm clash nearly perfect,
   throw breaks, more saved bars (`hoard`) for three-bar finishers. New knobs, each defaulting to today's value so no
   other style changes:
   - `rallyDecay` (0.5): the parry rally's weight per rally already in the exchange; GOD 0.85, up to 10 rallies.
   - `rallyParry` (1): the parry's weight while the brain is in a parry exchange (it was parried a moment ago, so the
     next swing is the other side's rally); GOD 5. Together: parry exchanges that go back and forth.
   - `clashChain` (`MELEE_CLASH.chainSeek`): how keen it is to swing again out of a melee clash; GOD reaches the chain's
     finale.
   - `energyAnswer` (0.15 / 0.25): weight of meeting their energy with its own unprompted (beam clashes).
   - `exactTech` (off): the timed impact tech is decided per launch and is the only way it techs an impact. Without it
     the brain's tech roll is made at its first launch and kept for the match, and its hold-Guard air tech, started
     inside an impact's tech window, techs that wall or floor by accident. GOD's long combos need both fixed; the other
     levels keep today's behavior until the user decides (ENG-121).
3. **Its combos** draw a per-match persona like the showman's (`makePersona(..., 'god')`, `aiCombo.js`) with the tier
   odds pushed toward highlights, the bars spent on them, and in a highlight a stronger lean on edges that leave a long
   stun window (`reach`) and the super dash kept for after a bounce (`sdLate`). The juggle rules still cap a route
   near 12 hits; past that a three-bar finisher crowns it.

## Consequences

- Measured on the same 12 pairings (24 matches at seed 101, `soak()` plus a page-only sampler): longest parry streak 15
  (showman 2), melee clash finales 1.5 a match (0), ultimate clashes 0.21 a match (0.08), 8-12 hit combos 5.1 a match
  (2.8), 10 combos of 13+ hits (best 21, crowned with a super) against 2. Round length is unchanged (38 s on average),
  no time-ups, no soak violations.
- Every knob reads `?? <old value>`, so IMPOSSIBLE, INSANE and the showman play exactly as before.
- Any `src/game` change moves the simulation fingerprint, so the determinism fixtures were re-recorded.
- Revisit if the user wants a director after all (set pieces, staredowns) or presentation extras for GOD; both were
  offered and declined for now.

## Alternatives considered

- **Upgrade the showman in place:** rejected by the user, who wanted to compare.
- **An episode director that choreographs acts and set pieces:** offered; the user chose stronger brains.
- **More health or a longer timer for spectated matches:** offered; the user kept the real rules.
- **Fix `exactTech` for every level now:** it changes how IMPOSSIBLE plays against a person, which this task promised to
  leave alone. Logged as ENG-121.
