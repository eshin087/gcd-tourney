# 0005. 2.5D lanes + per-frame hitboxes/hurtboxes

- Status: Accepted (implementation in progress: ENG-005, ENG-006)
- Date: 2026-10-08
- Deciders: User, Claude

## Context
The user reported that "sometimes the characters are not actually hitting them directly on their body, but
they are showing they are getting hit."

Root causes in the original design:
1. **Free-roam facing.** Fighters faced the opponent in full 3D. Sprites are drawn facing right and only mirror,
   so an attack aimed partly into the screen still looked like a horizontal strike, while the hit test followed
   the 3D direction.
2. **A forgiving cylinder test.** `checkMelee` accepted any victim within `reach + 0.3` ahead and ±`width`
   (~1 unit) sideways. Through the tilted camera, a victim one unit deeper looked clearly above or below the
   fist, but still got hit.
3. **No relation to the art.** The test ignored the actual pose on the current frame, and sparks spawned at a
   fixed chest height near the victim, not at the contact point.

## Decision
1. **Screen-horizontal facing.** Fighters face screen-left or screen-right only (`Fighter.side` = ±1,
   `face = cam.right × side`). Strikes travel across the screen the way they're drawn.
2. **Depth lanes with auto-step.** During an attack's startup and active frames, the attacker steps in depth
   (along `cam.fwd`) toward the opponent's lane, capped per frame. The CPU lines up in depth before attacking.
3. **Same-lane requirement.** A melee hit needs `|depth offset| ≤ LANE` (default 0.6 units; per-move override
   `m.lane`).
4. **Per-frame boxes.** `anims.json` gains `boxes: { "<frameIndex>": { hurt: [[x,y,w,h]...], hit: [[...]] } }` in
   frame-local pixels (origin top-left, facing right). A hit needs an attacker **hit** box on the current
   frame (active frames only) to overlap a defender **hurt** box on *their* current frame, in screen-plane
   coordinates. Boxes are mirrored for `side = -1`.
5. **Box sources.** The 3D baker derives hurt boxes from the silhouette and hit boxes from the striking limbs
   (`STRIKES` map). The packer derives them for custom art (silhouette inset and the forward-extending
   part on active frames), with per-character overrides in `art/characters/<id>/hitboxes.json`.
6. **Fallback.** Sheets without boxes use the move's `reach`/`yTol` along the screen axis (still lane-gated).
7. **Feedback at contact.** The impact spark spawns at the center of the box overlap.

## Alternatives considered
- **Pure 2D plane (no depth movement)**: simplest, but it throws away the 3D ring, sidestep and camera drama.
- **Full 3D capsules per limb**: accurate, but heavy, and disconnected from what the 2D art shows.
- **Tighter cylinder numbers only**: reduces false hits, but still ignores the pose and creates
  "fist clearly touches but whiffs" cases.

## Consequences
- Hits match what the player sees, and art quality directly improves combat readability.
- The art spec must define pivots and facing precisely, and hit boxes must be tuned per character
  (tooling: a debug box overlay ENG-010, Sprite Lab box preview TOOL-003).
- Box lookups use the **rendered frame**, so animation phases and gameplay phases must stay aligned
  (`phases` in anims.json).
- Lane rules change movement feel (no attacking "into" the screen). AI and dash behavior need soak testing.
- Projectiles and beams keep their own volume tests for now.
- Future: per-frame **anchor points** (hand/effect origin), proposed as ENG-011 and requiring a spec bump.
