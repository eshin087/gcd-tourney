# 0030: Tech recovery animations (techGround, techRoll, wallTech)

**Status:** Proposed
**Date:** 2026-10-11
**Task:** ENG-079 (engine), TOOL-034 (packer and scale gate), ART-TECH-01 (Codex art)

## Context

The techs (ADR 0022 hold-Guard tech and tech roll, ADR 0028 timed impact tech: in place, roll, wall tech, wall-jump
tech) borrowed existing poses: `land` for the in-place tech and the wall cling, `airRecover` for every roll and the
wall kick, `jumpUp` for the wall jump. A brace that looks like a landing and a roll that looks like a backflip sell the
mechanic poorly. The cast is being redrawn in the approved title style (PRs #68-#72), so dedicated strips can be
produced in the same batches, but they must not change gameplay timing, must not break a fighter that lacks them, and
their tucked and rotated poses defeat the scale probe and the packer's horizontal placement.

## Decision

1. **Three optional canonical animations** in `src/art/animGuide.js`: `techGround` (4 frames, beats 1/2/1),
   `techRoll` (6 frames, 1/4/1) and `wallTech` (5 frames, 2/1/2). Optional for the `complete` flag; `FALLBACK`
   maps them to `land`, `airRecover`, `land`; the 3D placeholder rig bakes simple versions.
2. **Played on the tech state's own clock.** `DEFENSE` gets `animPhases` (moves.js): three beats in game frames
   (contact, main motion, settle) that sum to the state's length; the main beat ends with the invulnerability (rolls, in
   place) or the kick (wall: its first beat is exactly the 6-frame cling). `src/game/techAnim.js` maps the clock to a
   beat and `SpriteActor.setPhase` (shared mapping in `src/game/animPhase.js`) maps the beat onto the art's frames.
   Timing, invulnerability and movement are untouched: a strip with any frame count lands on the same moments.
3. **Per-strip switch, legacy fallback.** A tech uses its strip only when the fighter's sheet has it
   (`SheetAsset.has`); otherwise it keeps exactly the legacy poses, free-running as before (`LEGACY_POSE`). New
   characters and the four current sheets need no art to keep working.
4. **Orientation.** All strips face right. `techRoll` is a forward roll; a roll against the facing plays its tumble
   beat backward (a back roll), so the sprite never turns around mid-roll. `wallTech` is drawn with the wall at the
   cell's left: on the ring barrier's x walls (screen sides: the fight camera's yaw stays within ±0.42 rad) the strip
   faces away from the wall; on the z walls (in depth) it keeps facing the opponent and is re-centred on the fighter.
   Visual only: the fighter's facing for gameplay never changes. The wall jump shows the cling, then the push-off frame
   for `wallJump.animFrames` (4) frames while already actionable, then `jumpUp`.
5. **Wall anchoring (packer).** The cling and push-off frames (`TECH_POSES.wallTech.wall`: beats 1-2) are placed with
   their leftmost opaque pixel on the pivot column, so the soles drawn on the implied wall touch the barrier;
   `anims.json` `wallAnchor` records each such frame's body centre for the depth-wall re-centring. Tech strips get no
   hit boxes (`NO_HITBOX`).
6. **Pose QA (packer, warn only).** A cling frame with fewer than about 12 opaque px on the wall line warns; a tucked or
   braced frame outside its height band against the idle's median height warns (`techGround` brace 0.45-0.85,
   `techRoll` tumble 0.30-0.68, `wallTech` cling 0.35-0.90): the giveaway of a pose packed at a standing height.
7. **Scale gate: unread beats are not a pass.** `spec.scaleGate.lowConfPhases` (defaults `techRoll: [1]`,
   `wallTech: [0, 1]`) marks beats the head probe cannot read; their frames are reported "not read", the readable
   frames are judged as usual, and a strip that passes on them is `partial`. `partial` fails a strict (candidate)
   strip until a `scaleManualQA` record of that version covers the unread frames (then `manual`, never `ok`). No
   blanket exemption.

## Consequences

- With all three strips a sheet has 45 animations and 190 frames: 12 rows (4096 x 3072). The placeholder bake grows by
  about 8 % (only used with `?art=procedural` or for a fighter with no art).
- Codex produces the art in each fighter's title-style production branch (brief: `art/characters/TECH_POSES_BRIEF.md`);
  the user approves every version as usual.
- Tests: `npm run test:anims` (selection, beat transitions, frame mapping, back rolls, walls, fallbacks) and
  `npm run test:sprites` (wall anchoring, the contact and band warnings, `partial` and manual QA, no hit boxes).
