# Claude art handoff — ENG-112 Killua normals

## Current status (2026-10-18; relay combat #19 complete)

The authorized fresh round is complete on branch `art/normals-killua`. All ten selected v02 source strips are saved with exact-call provenance, hash-matched against their selected held attempts; all v01 and prior attempt files remain untouched. The branch manifest lists v02 as `raw`, with no approved version. **All ten remain technical HOLD; none is ready to ship.** User visual review is requested for feedback/approval of the drawings, with the caveat that visual approval does not clear technical holds.

- Packed v02 review page (frame-by-frame and loop beside stand-in and approved idle): [public/reviews/normals-killua/v02/index.html](../../../public/reviews/normals-killua/v02/index.html). Root review URL redirects to v02. v01 review crops/page are preserved at `public/reviews/normals-killua/v01/`.
- Astra audit: `production/ENG112_NORMALS_V02_AUDIT.md`; it inspected all 70 cells (indices 181–250) from the exact atlas below.
- Generation log: `raw/_qa_hold/ENG112_NORMALS_V02_PROVENANCE.md`; contains exact prompts, call UUIDs/source paths, references, dimensions, hashes and cumulative call counts. fTilt call01 was consumed but its output path/UUID were not returned by the wrapper; the selected fTilt attempt02 is traceable.
- Diagnostic whole-character atlas: **54 animations / 251 frames**, 48-color quantization; SHA-256 `b66a685b321f548570f4ddbb70392068972dcc20d9c3b08e8bd26e5fde69b41a`; anims JSON SHA `60b4dddc3d139aeb6cc92089688eecdd42b7f5ba9e5ed28e2d10eaf30d69edbf`. A temporary external manifest marked v02 approved only to extract diagnostic frames. Nothing from that pack is copied into the branch's shipped `public/characters/killua/` atlas.
- Standard strict quantized pack exited 1 and refused the candidate atlas; scale gate flags fTilt, dTilt, dashAttack, fSmash, uSmash, dSmash, fair, bair and uair. uTilt is also held by anatomy/assembly, despite no scale-gate flag. The committed pack remains the full 44-animation / 181-frame character baseline.
- Source-layout/style holds remain for every move: all ten generated canvases miss their requested one-row square-cell dimensions and have smooth illustrated rendering rather than compliant hard-pixel source art. Packer also noted touching/cut-figure groups on eight strips.

Astra’s corrected atlas findings: dTilt's shin kick and fair's body-height aerial read well (fair f2 is x253, 2 px past the x251 safety margin); fTilt is connected but reads near shoulder/face; dashAttack misses the first active strike timing; fSmash’s charge and blow are usable but full-body parity is unmeasured; uTilt contains disconnected/severed lower-leg/shoe pieces and puts its strongest overhead extension in recovery; uSmash starts its overhead extension after its first active frame; dSmash’s active frames alternate sides rather than both striking sides in each active frame; bair is clipped at x0 and reads grounded; uair’s visible head is consistently enlarged. See the audit for exact H/F proxy measurements, corrected findings and uncertainties.

## Next steps

1. Get the user's visual decisions on all ten v02s through relay combat; do not infer approval from an unchecked item. Review page: the URL in the PR preview under `/reviews/normals-killua/v02/`.
2. If approved visually, preserve that approval separately from technical holds. Do not merge or ship. Repair work requiring new drawings needs a new user authorization; measured packing or scripted edits may be proposed only when applicable and supported by measurements.
3. After an approval/rejection relay, record REVIEW, manifest and TRACKER accordingly. Claude owns runtime hit/contact validation and integration.
4. This branch is the active PR #166 worktree; no merge/deploy by Codex.
