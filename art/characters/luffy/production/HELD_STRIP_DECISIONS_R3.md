# Luffy held-strip decisions for the next production round

Status at 2026-10-16: no image calls are authorized in the current relay assignment. The following is a planning inventory only; it does not authorize generation, approve art, or change the existing review state.

| Animation | Current candidate and exact blocker | Recorded cumulative calls | Smallest possible next art action | Current action |
|---|---|---:|---|---|
| `launched` | `raw/_qa_hold/launched_v01.png`; Astra r2 found undersized body landmarks (shin 36.7/39.8px, torso 29.8/27.8px vs idle); low-confidence tumbling pose/clipping also noted. | 1/3 | If later authorized, one targeted 2-frame source call correcting body volume/pose while preserving the knocked-away hat behavior in KIT. Re-check scale, clipping, and hat placement; do not assume a body-height change. | Hold v01; no call in this round. |
| `down` | `raw/_qa_hold/down_v01.png`; Astra r2 hold: f1 loses 9px at right; floor contour 7px above expected. Body projection may fit; placement/grounding is unresolved. | 1/3 | If later authorized, first determine whether documented grounding/pivot handling can resolve the issue without redrawing. If source art is the cause, one targeted 2-frame candidate call preserving the low grounded pose and soles/floor contact. | Hold v01; no call in this round. |
| `getup` | `raw/_qa_hold/getup_v01.png`; Astra r2 hold: f0 loses 6px left/7px right, floor warning 8px; f3 support pose has low-confidence measurements. | 1/3 | If later authorized, first determine whether pivot/grounding handling explains the warning. If source art is the cause, one targeted 5-frame candidate call with continuous floor contact and retained low-confidence pose landmarks for review. | Hold v01; no call in this round. |
| `special` | `raw/_qa_hold/special_v01.png`; f6/f7 recovery is split/cut. The recovered third-call source is in `production/recovered-special-v02/returned-source.png`; it shows two guard poses, not arm retraction and return, so it is not a usable v02. | 3/3 (the review ledger's earlier 2/3 line is superseded by the recovered third-call provenance) | No call remains within the existing budget. A future attempt requires a newly authorized budget. Any future prompt should target only f6 retraction and f7 upright return; preserve the six earlier frames. | Hold v01; no call in this round. |

## Current packed status

The actual strict pack contains 19 animations / 91 frames and omits these four held CORE animations. Astra final actual-pixel r3 recheck PASSes the 18 selected versions on the exact gameplay atlas; the four held candidates remain unpassed. No held candidate is approved, no new image was generated, and no candidate was removed or overwritten.

## Read-only source geometry diagnosis (2026-10-16)

The two placement holds were checked against the source sheets and the actual 256px diagnostic cells; this did not edit pixels or metadata.

- `down_v01`: source is a 2172×724 two-pose strip. In the quantized diagnostic frame f1, visible bounds are x=9..255, y=187..240, with Astra measuring 9px lost beyond the right cell edge and a 7px floor-contour gap. A horizontal frame offset cannot recover the missing right pixels without moving the left edge out of the safe x=4..251 range; vertical translation cannot repair a discontinuous floor contour while preserving the existing pivot contact. This requires a narrower/reposed f1 source (not a blanket body-height scale) and grounding check if another attempt is later authorized. Current round remains no-call.
- `getup_v01`: source is a 2172×724 five-pose strip. Diagnostic f0 bounds touch both horizontal cell edges (x=0..255, y=168..240), matching Astra's measured 6px left and 7px right pixel loss; no rigid horizontal translation can recover both sides, and vertical translation would disturb the other four floor-anchored frames while not resolving f0's low floor contour. f3 remains strongly foreshortened. This needs a narrower/reposed lying f0 and explicit floor continuity across all five poses, rather than an offset-only patch. Current round remains no-call.

These measurements support a source geometry/pose repair rather than a pivot-only adjustment. A later round, if authorized, needs one new source attempt for each of these strips; preserve existing v01. The four attempt counts remain launched 1/3, down 1/3, getup 1/3, special 3/3. No attempt was consumed by this diagnosis.
