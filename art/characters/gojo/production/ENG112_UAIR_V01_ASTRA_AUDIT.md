# ENG-112 Gojo uair v01 — final Astra audit

Date: 2026-10-18. Scope: actual 48-color quantized atlas cells 245–250, full six-frame uair loop, and comparison with the packed idle f0 plus approved Gojo title-style neutral/combat cells. This is an anatomy/technical audit, not user image approval or runtime contact verification.

## Evidence

- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-normals-gojo-r2`; branch `art/normals-gojo-r2`.
- Candidate: `raw/uair_v01.png`, byte-identical to preserved relay #34 call 3; SHA-256 `E72BD190248A78A30FAF284114E3458A63D755B24CE4ED46B12FF55F7FE1F232`.
- Version-bound import sidecar: `raw/uair_v01.json`; auto-head fit ×0.9434 and f2 `frameOffsets [-11,0]` after the packer measured 7px beyond the right edge. The shift leaves 4px margin.
- Actual atlas `public/characters/gojo/sheet.png`: SHA-256 `DC3CB7E0089BF627A3ED052A5818574FFEED808CA344FF301EA68EA67B1F74BF`.
- Actual `public/characters/gojo/anims.json`: SHA-256 `E2E8B304A95681EA6B6825146AAD1AEA5B8C9C5D96CAAEC72E687170BDB4D091`.
- Packer: 54 animations / 251 frames, 48 opaque colors; uair cells 245–250, phases `[2,2,2]`, `loop:false`. No uair clipping after the fit and offset.
- Head ratios by frame: `.971, 1.000, .971, 1.016, 1.000, 1.029`; median 1.000. Feet proxy 1.057. The scale gate reports `ok`.
- Reference files: actual packed idle f0, `reference/idle_approved.png`, `public/art-review/title-style-pilot/gojo-neutral_v01.png`, and `gojo-combat_v01.png`.

## Frame findings

All measurements below are exclusive alpha bounds `[x0,y0,x1,y1]` in the 256px atlas cell.

| Frame | Bounds | Observation |
|---|---|---|
| f0 | `[69,42,196,241]` | Airborne chamber; both hands out. Legs overlap, limiting segment measurement. Jacket reads compressed against idle. |
| f1 | `[74,52,200,241]` | Deeper chamber; both hands out and joints remain connected. |
| f2 | `[66,65,252,241]` | Clear diagonal up-forward kick. Shoe fully retained with 4 transparent columns at right; toe is approximately level with hair top, below the requested ceiling. Torso looks short relative to the head. |
| f3 | `[73,42,208,241]` | **Hold:** the kicking leg is already tucked during the second active frame. This breaks the sustained strike read and causes a large f2→f3 silhouette change. |
| f4 | `[55,39,194,241]` | Lowering/crossed-leg recovery; hands remain out. |
| f5 | `[92,27,174,241]` | Hands return to pockets as scheduled; tucked airborne neutral. The transition from f4 merits timed playback. |

All six figures fit safely in their cells; the lowest opaque row is y241, leaving 15px at the bottom. The requested shoe-height limit is met after packing. Head identity/scale is consistent with the title-style references and idle.

## Technical verdict: HOLD

The dominant pose issue is f3 retracting inside the two-frame active phase; f2 is the only clearly extended up-forward strike. The jacket also appears short/compressed: projected shoulder-to-hip estimates are approximately 52–66px on most candidate poses versus 65–77px on idle and about 70–82px on title neutral. f2 is occluded and compressed, around 44–59px. These are screening intervals with ±5–8px landmark uncertainty, not certified skeleton lengths or a reliable percentage. Both arm and leg chains remain visually connected; overlapping legs prevent precise segment measures. Do not enlarge the strip from these estimates alone.

This static audit did not include timed browser playback or gameplay contact verification. Claude owns runtime contact. The drawing remains pending the user's image decision; user approval would not clear the pose/body-volume hold.
