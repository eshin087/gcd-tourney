# Luffy skills batches 3–4 — relay #11 pack recheck

This is a pack/scale recheck of the user-approved v01/v03 sources after Claude hub direction in relay `luffy-skills #11`. No image was generated or redrawn. The prior Astra audit remains the anatomy review; this note does not claim a new Astra audit.

## Changes applied

- `specialForward` v01: the versioned sidecar erases the displaced palm fragments at f3/f4 and the sandal-colour speck at f5 with source-image rectangles `[931,300,120,115]`, `[1241,300,130,115]`, and `[1623,566,5,9]`. The packer confirms three erased rectangles and maps 7/7.
- `specialUp` v01: per-animation `packScale: 1.25`; the global Luffy scale is 0.92, and the packed import reports x0.374. The top arm exits in f0–f3 remain intentional as directed. Version-bound `scaleManualQA` v01 records a scale-only manual review; it does not pass arm continuity, anatomy, or runtime contact.
- `specialDown` v03: per-animation `packScale: 0.77`; the packed import reports x0.490. Version-bound `scaleManualQA` v03 records a scale-only manual review for the crouched pose. `hitboxes.json` sets f2 hand to `[252,208]` at the right cell edge so the engine can continue the extended leg into `whipSweep`.

## Packed evidence

- Luffy pack: 27 animations / 129 frames, 4096×2304, 48 colours, complete.
- Exact scale audit: `specialUp` v01 is `manual` with body median 1.039 and head median 0.841; `specialDown` v03 is `manual` with body median 1.177 and head median 1.300. The head probe is pose-confounded; the body-sheet report flags the crouched `specialDown` at +18% (advisory, ±10% pose noise). These values remain visible for Claude's integration review.
- `specialDown` f2 still reaches past the right cell edge (packer warning: 61 px). The new anchor lands at `[252,208]`; Claude must check the leg continuation in game.
- `specialForward` f2/f3 still show the intentional arm ends at the cell boundary; its f3 head probe remains a merged-region artifact. The erased fragments are gone, but the correction does not certify anatomy.
- Packed comparison: [relay11-scale-review.png](relay11-scale-review.png), row order idle, specialForward, specialUp, specialDown; cells left-to-right. Body sheet and report: [body-luffy-specialUp-specialDown.png](../../../scale/body-luffy-specialUp-specialDown.png), [body-report.json](../../../scale/body-report.json).
- Packed sheet SHA-256: `78DE76A540DFF454998F516436D8691F611CC58ACFB0F4DFD7D2BDED0DA14545`.
- Packed metadata SHA-256: `22E393F32BCD93F03DCD8EF6CCFF5CBBFAF7F94798AE72D85FE7A46C8846AEC5`.
- Comparison SHA-256: `84DBDD526A63C2874291C47A45056C0FAA9C246D94CAC93FD0CFDDC60D4EE604`.

The visual approval remains the user's relay #9 approval. Claude owns runtime contact/integration and any final technical clearance.
