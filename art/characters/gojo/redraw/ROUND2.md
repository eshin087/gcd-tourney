# Gojo round 2: approvals and airLight3, 2026-10-11

User approved the 12 passing corrections, including Gojo charge v06, airHeavy v06 and win v06. Their REVIEW rows and approvedVersion fields are updated. The approval repack initially failed only for the retained airLight3 v05; log: approval-repack.log.

The user authorized up to three MORE built-in image generation calls per failed strip. AirLight3 used two calls, one per part, producing v07. No third call is needed because the full strict pack passes. New v07 remains unapproved.

## Prompt blocks and provenance

Both calls attached the edit target airLight3_v05_A/B.png, approved idle_approved.png (idle v04), and head_scale_guide.png. Edit target retained its 1983x793 canvas. Instructions: keep every figure's position, pose, face, skull, blindfold, chin, neck, costume, torso, arms, legs and boots unchanged; change white hair envelope only. Each part's first and second hair width/height requested at 96% of current size; third at 90%, anchored at the original scalp. Preserve spike design and original sharp sprite shading/colors on #FF00FF, no text/effects. SCALE LOCK: unchanged body anatomy/camera/canvas, no whole-person scaling or zoom. These percentages are prompt requests; packed measurements decide acceptance.

Built-in imagegen outputs: part A exec-403d27f8-*; part B exec-eeff8fc7-94c0-4410-b937-54b6307f5495.png. Immutable saved sources: raw/_parts/airLight3_v07_A.png and _B.png. Official stitch counts 3,3 used the existing current-idle scratch atlas: measured B factor1.0504, A scaled0.952, resulting B/A1. See raw/airLight3_v07.json. No hand-selected rescale or scaleFit was introduced.

## Verification and limitations

node tools/pack-sprites.mjs gojo --quantize 48 --strict-scale passes, writing the runtime sheet and frame outputs. 1 reference, 33 ok, eight existing Claude manual passes. AirLight3 head0.952, spread0.095; f0-f5: .905, .952, .952, .941, 1.000, .952. No clipping/margin warning. All six cells inspected alongside idle in round2-airLight3-contact.png: lean adult torso and long limbs, consistent pose anatomy and compact hair. Projected boots in aerial poses are larger than idle; this predates the hair edit and is not treated as evidence of changed leg length.

npm run scale -- gojo --out art/characters/gojo/redraw/round2-scale: zero flagged strips. npm run lineup writes round2-lineup.png: Gojo current atlas, other characters historical local atlases. Its build-class bands are historical (athletic-adult), so SBR/MWR warnings remain, not silently reclassified. Approved lean baseline is unchanged. Existing idle-baseline head warning and beamFire hitbox override/fallback notes remain for Claude. No thresholds, exemptions, scaleManualQA, scaleFit or builds.json changed.

Production build passed. Gallery uses the passing branch atlas, includes approved three corrections and new v07, clearly identifies approval status. Claude alone merges, deploys production and edits main/NOW/inbox. Existing worktree .worktrees/art-gojo-full-redraw is retained for integration and cleanup.

## Approval checkpoint
User approved airLight3 v07 on2026-10-11 along with the five passing corrections. approvedVersion7 and REVIEW approved recorded; older pending v05 archived immutably as superseded. This is an approval-only step; no new images generated.
