# 0012. Art integration: approval-gated world art, candidate preview, hand anchors

- Status: Accepted
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0007](0007-art-spec-v2-shippuden-256.md) (spec v2), [0008](0008-world-art-and-parallel-production.md)
  (world art). Closes the "per-frame anchor points" item of ENG-011.

## Context

Integrating the first finished art sets showed three gaps:

- **Unapproved world art shipped.** `npm run sprites vfx` packed the highest version of every effect, so
  Codex's 15 VFX candidates were committed in `public/vfx/` and deployed although none had the user's
  approval (`approvedVersion` was null for all of them). The user's rule is that every image is approved
  before it ships (ADR 0007 versioning, art/REVIEW.md).
- **No crowd packer.** 121 crowd spectators were approved, but nothing turned them into the
  `public/crowd/atlas.*` the engine already loads (TOOL-011).
- **Effects started at fixed offsets.** Rasengan, Rasenshuriken, Chidori, projectiles and beams spawned at a
  fixed fraction of the body. With hi-res art the orb floated beside Naruto's hands instead of between them.

## Decision

1. **World art is approval-gated in the packer.** For VFX and the crowd, `npm run sprites` packs only items with
   an `approvedVersion` in `art/manifest.json`, at that version. A newer unapproved source is warned and not
   packed. When nothing approved is left, the stale atlas is removed (the game falls back to procedural art).
   Characters keep their existing rule (a sheet is used when it is `complete`, and Codex only promotes approved
   strips).
2. **Candidates are previewed, not shipped.** `--candidates` packs every latest candidate into `public/preview/vfx|crowd/`.
   The folder is git-ignored, so `npm run deploy` (a clean export of HEAD) never ships it. `?art=custom` makes the
   loaders prefer it (`fetchAtlasJson`), the same flag that already previews incomplete character sheets.
3. **Crowd packer mode** (`npm run sprites crowd`) implements the ADR 0008 atlas contract: approved spectators in
   roster order, 3 cells each, idle scaled to the height class, feet on the pivot, ≤ 24 colors, binary alpha.
4. **Hand anchors are art data.** `hitboxes.json` takes `hand: [x, y]` per frame (the drawn palm or fingertip);
   `anims.json` carries it in `boxes`. The engine (`SheetAsset.hand` / `SpriteActor.hand`) uses the frame's
   anchor, then its hit box, then the nearest frame that has one, and the old fixed offsets for the baked
   placeholder. Hand effects, projectile spawns and beam origins use it. Timing stays in `moves.js` (rule 1).

## Alternatives considered

- **Delete the unapproved VFX files.** Rejected: they are Codex's versioned work waiting for review; the gate
  keeps the sources and only stops the shipping.
- **Ship candidates under a flag in production.** Rejected: an unapproved image would still be deployed and
  publicly reachable; local preview is enough for the review loop (the phone gallery covers stills).
- **A new spec version for anchors** (what ENG-011 assumed). Not needed: anchors are optional per-frame data in
  the existing override file, and frames without one fall back to the hit box.

## Consequences

- The deployed game currently uses procedural effects (no VFX approved yet) and 121 approved spectators.
  Approving an effect or a crowd batch now needs `approvedVersion` in the manifest plus a re-pack to ship.
- Codex's VFX/crowd review loop uses `node tools/pack-sprites.mjs vfx crowd --candidates` and `?art=custom`.
- Stage, NPC and shared UI packers/loaders (TOOL-011, ENG-023/024/025) follow the same gate when they arrive.
- New fighters should add `hand` anchors for frames whose effects start at a hand (special, throw, beamFire).
