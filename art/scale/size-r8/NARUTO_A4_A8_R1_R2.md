# Naruto ART-SIZE-R8 A4-A8 and R1-R2 technical record

Date: 2026-11-09
Branch: `art/size-r8-a`
Review: [Naruto batch decision page](../../../public/reviews/size-r8-naruto/index.html)
Source inventory: [generation and pixel-repair inventory](../../characters/naruto/production/size-r8/GENERATION_INVENTORY.md)

## Decision boundary

The latest candidates are not user-approved. A4-A8 have unresolved anatomy and/or contact holds, so this is a
decision request about additional generation calls versus keeping those versions held. R1 and R2 are exact,
script-only pixel repairs; their unchanged geometry is recorded below. The user reviews every drawing separately
from technical clearance.

## Candidate measurements

Body-area B is the project's advisory garment-area proxy against packed idle f0; it is pose-sensitive and must be
confirmed by visible body segments. Here the large shortfalls also appear on upright frames, so they do not read as
pose-only noise. Head H is the packer's idle-palette head probe, including hair.

| Item | Candidate | Head H / feet proxy | Body B | Result |
|---|---|---|---|---|
| A4 `light2` | v08, 7 frames | H 0.988-1.037 (median 1.000); feet 0.892-0.986 (median 0.952) | 0.716-0.734 (median 0.729) | Head gate passes after auto-head fit x1.1403; torso/limb volume remains about 27% under idle. Its drawn strike is 38 px above `light2Alt`'s strike height, beyond the 24 px attack-alt tolerance. Hold. |
| A5 `stagger` | v11, 4-frame loop | H 0.984-1.034 (median 1.006); feet proxy 0.627 | 0.536-0.551 (median 0.546) | Head passes; upright torso and legs remain visibly short. Hold. |
| A6 `taunt` | v13, 2-frame loop | H 1.054-1.067 (median 1.061); feet not measurable | 0.503-0.510 (median 0.506) | Strict head gate fails and body area is about half of idle. Hold. Third/final original generation call used. |
| A7 `light3Alt` | v06, 7 frames | H 0.960-1.002 (median 0.993); feet proxy 0.814 | 0.555-0.616 (median 0.592) | Head passes, but upright body and standing leg remain short. Drawn strike is 67 px above floor versus `light3` v04 hit at 118 px: 51 px mismatch, beyond 24 px. Hold. |
| A8 `specialDown` | v08, 4 frames | H 1.034-1.069 (median 1.060); feet proxy 0.694 | 0.560-0.653 (median 0.595) | Strict head gate fails; body is short. The old v02 scale exemption is stale and was not applied to v08. Hold. Third/final original generation call used. |
| R1 `airHeavyAlt` | v05, 6 frames | Geometry matches approved v04 exactly | 0.920-1.035 (median 0.996) | Script recolored 2,253 thigh-pouch pixels in the documented masks; every other RGBA pixel is unchanged. Scale evidence is inherited from approved v04, not a new anatomy certification. |
| R2 `jumpSquat` | v05, 1 frame | H 1.000 | 0.882 | Script made three pixels transparent: (481,862), (480,863), (479,864); all other RGBA pixels match v04. Exact continuity only. |

The underlying per-frame measurements are in the candidate `body-report.json` and quantized `anims.json` in the
work session. The committed body sheets and head-scale sheet are on the [review page](../../../public/reviews/size-r8-naruto/index.html).

## Hitbox remeasurement

`light2` has a frame-3 override but no hand anchors. After the v08 auto-head fit, the old box transformed away from
the visible fist. The active lead fist and black cuff were measured on the fitted 48-color cells and the sidecar now
records `"_scale": 1.1403` so the packer does not scale those measured coordinates a second time:

| Frame | Packed cell | Hit box `[x,y,w,h]` | Hand point |
|---|---:|---|---|
| f2 | 39 | `[195,65,28,23]` | none defined in this animation's sidecar |
| f3 | 40 | `[190,67,30,23]` | none defined in this animation's sidecar |

The boxes include the visible fist and cuff with a small pad; no reach extension was added. The `light2` / `light2Alt`
height mismatch remains a technical hold. Pack scale stays 1; only the supported auto-head fit is recorded in the raw
sidecar and hitbox measurement scale.

## Pack and image-call evidence

- Candidate-only warning pack: 54 animations / 245 frames, 48 colors, complete scratch atlas. Scale gate was set to
  `warn` in an external diagnostic manifest; it reports two drift candidates (`taunt` v13 and `specialDown` v08).
  This output is not production art.
- Normal strict pack returns exit 1 on those same two strips. It does not replace the production sheet or frames
  (the packer writes its unchanged UI images only). The attack-alt
  contact warnings are `light2Alt` at -38 px and `light3Alt` at -51 px against their base hit heights.
- Body sheets compare each candidate cell with packed idle f0 and the approved combat reference at the same cell
  density. Candidate review shows every frame; the note above keeps head, feet-proxy, and garment-area measurements
  separate.
- A4 `light2` used two part-generation calls for v07 and one call for v08. A5 `stagger`, A6 `taunt`, and A8
  `specialDown` each used three generation calls. A7 `light3Alt` used two calls for v03 parts, a failed call rejected
  before generation because six image paths exceeded the tool's five-path limit, then one successful full-strip call
  for v04. The original three-call budget is therefore exhausted for A4-A8 (A7 has four call events if the failed
  invocation is counted). No further image calls are made without the user's explicit budget decision.
- R1/R2 used no image calls. `light3Alt` v05/v06 are background-only script cleanup derivatives of v04; their source
  and output hashes and pixel counts are recorded in the inventory.

## Current review state

All seven latest versions remain `needs review`; none is marked user-approved. A4-A8 remain technical holds; R1/R2
retain only their exact-pixel continuity checks. The user decision request asks whether to authorize an extra image
call for named A4-A8 items beyond the original cap, or keep the current candidates held and proceed to Killua.
