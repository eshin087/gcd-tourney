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

1. **World art is approval-gated in the packer.** For every world-art kind (VFX, crowd, stage, NPC, UI), `npm run sprites` packs only items with
   an `approvedVersion` in `art/manifest.json`, at that version; a newer candidate is noted and waits for review. When
   nothing approved is left, the stale output is removed (the game falls back to procedural art). An unreadable
   manifest leaves every world-art output untouched (approvals unknown).
   Characters keep their existing rule (a sheet is used when it is `complete`, and Codex only promotes approved
   strips).
2. **Candidates are previewed, not shipped.** `--candidates` packs every latest candidate into `public/preview/<kind>/`.
   The folder is git-ignored, so `npm run deploy` (a clean export of HEAD) never ships it. `?art=custom` makes the
   loaders prefer it (`fetchAtlasJson`), the same flag that already previews incomplete character sheets.
3. **Crowd packer mode** (`npm run sprites crowd`) implements the ADR 0008 atlas contract: approved spectators in
   roster order, 3 cells each, idle scaled to the height class, feet on the pivot, ≤ 24 colors, binary alpha.
   **Stage, NPC and UI modes** (`npm run sprites stage|npc|ui`) follow the same gate. Stage slots are exact-size images
   that replace a painted texture's image in place (geometry and repeats stay, so world coverage never changes). NPC
   sheets take their animations, timing and target heights from each NPC's `ANIMATIONS.md` table, and every strip is
   scaled to its own height row (generated strips drift in scale between images). The engine places NPCs from a data
   table and drives them with game-event cues; shared UI replaces the CSS title logo and adds the key art.
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

- Approving any world-art item needs `approvedVersion` in the manifest plus a re-pack to ship. On 2026-10-10 the
  user approved all existing world art (15 effects, 576 spectators, 30 stage slots, 4 NPCs, 2 title images); all
  of it ships.
- New candidates (redos, new spectators) are reviewed with `node tools/pack-sprites.mjs vfx crowd stage npc ui
  --candidates` and `?art=custom`; the approved version keeps shipping meanwhile.
- Known engine quirks from art/stage/ASSETS.md are not fixed yet (lantern glyph facing, stretched riser/beam faces,
  mipmaps for repeated ground textures): ENG-039.
- New fighters should add `hand` anchors for frames whose effects start at a hand (special, throw, beamFire).
