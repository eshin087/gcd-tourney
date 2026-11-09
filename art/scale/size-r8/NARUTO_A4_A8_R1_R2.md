# Naruto ART-SIZE-R8 A4-A8 and R1-R2 technical record

Date: 2026-11-09
Branch: `art/size-r8-a`
Review: [Naruto batch decision page](../../../public/reviews/size-r8-naruto/index.html)
Source inventory: [generation and pixel-repair inventory](../../characters/naruto/production/size-r8/GENERATION_INVENTORY.md)

## Decision boundary

Relay `audit1 #9` authorized up to three additional image calls per A4-A8 item, edited from approved Naruto art.
All five budgets are exhausted. None of the supplemental candidates clears every requested head/body/floor/contact
gate. Via user decision relayed as `audit1 #11`, which supersedes #10, A4-A8 is closed with the approved/live versions
retained: `light2` v06, `stagger` v08, `taunt` v10, `light3Alt` v02 and `specialDown` v05. No further image calls
are authorized and no candidate was approved. All newer redraw versions are held under `raw/_qa_hold/` so the
retained approved files remain the pack inputs. No pack change or resize is authorized for `specialDown`: the user
measured roar heads only 2-3% larger and confirmed the feet match the crouch frames, choosing to keep v05 as is.
R1/R2 v05 were approved by the user via Claude relay `audit1 #7`; their script-only
pixel repairs and inherited geometry evidence are recorded below. Image approval remains separate from
technical/runtime clearance.

## Relay #11 closure and held versions

The 15 unapproved first-pass source PNGs above each selected `approvedVersion` were moved from `raw/` to
`raw/_qa_hold/`. No source was deleted or overwritten; all supplemental relay #9 candidates and parts were already
quarantined. Manifest `version` and `approvedVersion` remain unchanged, because they continue to record the newest
saved candidate and the selected approved input respectively.

| Item | Selected live version | Newly quarantined first-pass versions | Relay #9 versions already held |
|---|---:|---|---|
| A4 `light2` | v06 | v07-v08 | v09 parts, v10 |
| A5 `stagger` | v08 | v09-v11 | v12-v14 |
| A6 `taunt` | v10 | v11-v13 | v14-v16 |
| A7 `light3Alt` | v02 | v03-v06 | v07 parts, v08 |
| A8 `specialDown` | v05 | v06-v08 | v09-v11 |

## Candidate measurements

Body-area B is the project's advisory garment-area proxy against packed idle f0; it is pose-sensitive and must be
confirmed by visible body segments. Here the large shortfalls also appear on upright frames, so they do not read as
pose-only noise. Head H is the packer's idle-palette head probe, including hair.

| Item | Candidate | Head H / feet proxy | Body B | Result |
|---|---|---|---|---|
| A4 `light2` | v10, 7 frames | H 0.970-1.028 (median 1.000); feet align to floor | 0.381-0.472 (median 0.430) | Head gate passes, but body B is far below 0.90. Packer cannot identify the f2/f3 strike limb, so contact and hitbox alignment are unverified. Held in `_qa_hold`. |
| A5 `stagger` | v14, 4-frame loop | In-strip head pop: f0 1.06 vs f2 1.21 | v13 B 0.354-0.404 (median 0.387); v14 not measured | Final candidate fails head consistency; preceding candidate also fails B. Held in `_qa_hold`. |
| A6 `taunt` | v16, 2-frame loop | H 0.963-0.978 (median 0.970); feet not measurable | 0.165-0.168 (median 0.167) | Head gate passes, but garment B is far below 0.90. Held in `_qa_hold`. |
| A7 `light3Alt` | v08, 7 frames | H 1.084-1.118 (median 1.097); feet proxy 0.71 | 0.357-0.408 (median 0.391) | Head and body fail. Packer cannot identify the f2/f3 strike limb, so the 24 px contact-height check is unverified. Held in `_qa_hold`. |
| A8 `specialDown` | v11, 4 frames | In-strip head pop: f2 0.90 vs f0 1.19 | 0.768-0.904 (median 0.818) | Head consistency and body minimum fail; feet stay planted in the pose but the full gate does not pass. Held in `_qa_hold`. |
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

The boxes include the visible fist and cuff with a small pad; no reach extension was added. They apply only to the
earlier v08 candidate. Supplemental v10 did not expose a clear striking limb in the diagnostic pack, so the old boxes
are not evidence for v10 and no hitbox update was made. Pack scale stays 1.

## Pack and image-call evidence

- Supplemental candidates were packed in isolated per-item diagnostic roots at 48 colors. Strict scale checks and
  body sheets never wrote to the worktree's `public/` or `frames/`; temporary atlases are not production outputs.
- Relay #9's 3/3 additional calls were used for every A4-A8 item. The generation inventory records each call id,
  source path/hash, references, prompt scope and candidate measurements. All unapproved A4-A8 files stay under
  `art/characters/naruto/raw/_qa_hold/`; none is promoted or queued for image approval.
- The original candidate/contact findings in the table remain historical context. No attempt changes the approved
  live versions, `packScale`, or runtime boxes. R1/R2 used no image calls and were approved via relay #7.
- R1/R2 used no image calls. `light3Alt` v05/v06 are background-only script cleanup derivatives of v04; their source
  and output hashes and pixel counts are recorded in the inventory.

## Current review state

All A4-A8 candidates are held and unapproved; relay #11 supersedes #10, closes the batch, and retains the five
already-approved live versions listed above. No new user review ring was appropriate because none met relay #9's
technical thresholds. `specialDown` v05 remains unchanged, with no pack edit or resize authorized. R1/R2
v05 are approved by the user via Claude relay #7, with continuity-only QA. Killua A9/A10 approvals via relay #8 are
recorded separately in `art/REVIEW.md`, the manifest and tracker; A10 retains its separate floor-contact/runtime hold
for Claude.
