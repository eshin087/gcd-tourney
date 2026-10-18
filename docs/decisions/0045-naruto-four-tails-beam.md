# 0045: Naruto's ultimate is the Four-Tails beam (the Tailed Beast Ball)

**Status:** Accepted (user decision, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-SKL-NAR-2 (engine), ART-SKL-NAR (art, Codex chat "5 - Skills Effects")
**Amends:** [ADR 0017](0017-ultimate-variety-and-rhythm-clashes.md) §1 (at most one beam in the cast)

## Context

ADR 0017 gave every fighter but one a non-beam ultimate so the finishers would differ; Naruto's became the Four-Tails
rampage (roar, pounce, mauling). After trying the revamped build (ADR 0044), the user asked: "narutos ultimate make
him do the beam and have him look like the 4 tail fox like this and have him do the beam from the anime like this",
with two anime stills from the Tenchi Bridge fight: the four-tailed fox gathering red and blue chakra, and the fox
firing a huge white-hot blast from its mouth with a ring of light round its root.

## Decision

1. **Naruto drops `kit.ultimate`:** Heavy + Special fires the shared beam ultimate (`Fighter.startUltimate`, the
   Beam, its clashes and the CPUs' beam play), named **FOUR-TAILS: TAILED BEAST BALL**. The cast now has two beams
   (Goku, Naruto). The `rampage` kind stays in the engine; no fighter uses it.
2. **The transformation and the look are `def.beam` data**, read by shared code, not a Naruto special case:
   `flashPose` / `flashPhase` (held through the flash), `shroud` (the ADR 0044 engulf and tails, now also kept
   through `beamCharge` / `beamFire`), `gather` (an effect growing at the drawn hand anchor through the charge, with
   chakra converging on it in `colors`), `muzzle` (shock rings sent down the beam), `width` (1.7, wider than Goku's).
   When the flash ends the fox roars (`fourTailsRoar`) and the charge pose takes over.
3. **Art:** `beamCharge` is the four-tailed fox gathering (Codex's roar crouch), a new `beamFire` v15 is the fox firing
   from its mouth, and its `hand` anchor in hitboxes.json moves to the mouth so the ball and the beam leave from there.
   The pounce strip `beamFire` v14 (approved in batch 1) does not ship as `beamFire`. Until the four-tails strips are
   approved, `shroud.hold: 1` draws his human beam poses as a boiling silhouette with four chakra tails; afterwards
   `hold: 0`, `tails: 0`.

## Consequences

- Naruto's ultimate clashes as a beam (the stream struggle), not as a pounce.
- Damage and timing are the shared beam's (ULTIMATE): 46-frame windup, ticks of 12, 130 on the final hit.
- The determinism fixture with Naruto (naruto-sasuke-s7) is re-recorded on this simulation.
