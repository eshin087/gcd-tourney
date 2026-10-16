# 0034: Melee clash (light vs light, heavy vs heavy)

**Status:** Accepted
**Date:** 2026-10-15
**Task:** ENG-082

## Context

The user asked (2026-10-15) that two lights or two heavies thrown at the same time cancel each other out, again and
again, "like a cool anime clash". Until now two melee hits landing on the same frame simply traded
(`Game.resolveMelee`, both take damage), and the clash systems that exist are for specials and energy: the one-beat
special clash (ADR 0017), the ultimate rhythm clash and the beam clash (ADR 0027). Normals had nothing.

The user's answers to the design questions:

- **Matchups:** same class only. Light vs light and heavy vs heavy clash; a light meeting a heavy is beaten by it.
- **Timing:** active frames overlap, so it happens naturally when both press within a few frames (not only on the
  exact same frame, which would be near impossible between people).
- **After a clash:** both bounce back and can act at once, so pressing again starts the next clash.
- **Chains:** escalating spectacle, ki for both, a finale after a set number, and the CPU seeks clashes.

## Decision

1. **Classes are move data.** `MOVES` entries carry `meleeClash: 'light' | 'heavy'`: light1-4 and airLight1-3 are
   lights, heavy and airHeavy are heavies. Specials, the vanish kick, the super dash hit and throws have none and
   never clash this way. All numbers live in `MELEE_CLASH` (`src/game/moves.js`).
2. **Detection in `resolveMelee`.** A queued melee hit whose defender is also attacking with a classed move that is
   active, or at most `window` (4) frames before its first active frame, means the swings met
   (`Game.swingsMeet`). Same class: `Game.meleeClash`, and no hit of that frame applies. Different class: every hit
   by the light's owner that frame is dropped and the heavy lands now (`heavyBeatsLight`, a CRUSH! callout), even
   when the heavy was still a few frames from active.
3. **The bounce.** Both fighters freeze in their swing (hit stop `stop[class]` + `stopPer` per chain step), then
   `Fighter.leaveClash` puts them in a new `clashBack` state sliding apart at `push[class]`. After `act` (3) frames
   they can do anything; a Light or Heavy pressed during the freeze (`buffer`) comes out then. The short slide is
   there so the bounce reads before the next swing pulls them back in; without it a chain glued the fighters
   together. An air clash bounces with a small hop and lands with 2 frames of lag.
4. **The chain.** A clash within `chainGap` (80) frames of the last one adds to `Game.meleeChain`. Each step grows the
   spark, ring, flash, camera shake and zoom punch, slow-mo (from the second), crowd cheer and the `CLASH ×n!`
   banner, and pays both fighters `ki[class]` × (1 + `kiPer` × (n − 1)). The `finale`-th (5th) clash is
   **CLASH BREAK!**: an explosion and a crater, and both take `finaleHit` (30 damage, a launch apart, a knockdown).
5. **The CPU.** `src/game/aiClash.js` `seekClash` is shared by `CpuBrain` and `MasterBrain`: once per opposing light
   or heavy that has just started in reach, it presses the same button at its level's `meleeClash` rate (Easy 4 %
   to Hard 12 %, ×1.5 spectated; INSANE 8 %, IMPOSSIBLE 10 %, showman 18 %), and once per bounce it presses again
   at that rate × `chainSeek`. `MasterBrain` rolls with `Math.random`, so the seeded combo routes stay the same.
   Two CPUs also clash on their own, jabbing into each other: the first soak at twice these rates gave Hard CPU vs
   CPU 25 clashes a match; at these about 7 exchanges a match (16 clashes) and a CLASH BREAK every other match.

## Alternatives considered

- **Any normal clashes with any** (light vs heavy too): the user chose same class, with the heavy winning.
- **Exact same frame only:** would almost never happen between two people.
- **A locked button-mash exchange** (both held until one wins): the user chose free bounces, which keeps the
  exchange in the players' hands and reuses the normal moves.
- **Reusing the special clash (`startClash` 'beat')**: that freezes the world for a rhythm beat and has a winner,
  where a melee clash is a wash that keeps the fight moving.

## Consequences

- Two lights or heavies thrown together no longer trade; the old trade rule still applies to every other pair of
  melee hits (a special into a normal, normals out of the window).
- `clashBack` is a new fighter state (no new animation: it plays `backDash`, or `airRecover` in the air). Code that
  lists states (HOLDABLE, onLand) knows it.
- Tuning lives in `MELEE_CLASH` and the per-level `meleeClash` rates. Revisit the rates if spectated matches feel
  clash-heavy, and the finale damage if chains turn into a damage race.
