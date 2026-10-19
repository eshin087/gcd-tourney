# Goku charge v10 provenance and registration status

## Candidate identity

- Candidate: `art/characters/goku/raw/charge_v10.png`
- Source: `art/characters/goku/raw/_qa_hold/charge_v08_attempt03.png`
- SHA256 for both files: `6317AF1187A981D7FD44DB59A9E5C0F5ED69356FE8D4F5571A9D3E7A8F6B6BE5`
- Dimensions: 1536 x 1024; six cells in a 3-column x 2-row layout.
- Promotion: byte-identical file copy, no new image call and no pixel edits. Attempt prompts and original raw-canvas measurements remain in `raw/_qa_hold/charge_v08_HOLD.md`.
- Manifest `bodyHeight: 237` is provisional, retained from the existing charge slot pending body-sheet measurement against the approved idle. `approvedVersion` remains 5.

## Registration evidence

Claude's relay charge #2 reports that it trial-packed the unchanged image using the Goku manifest, `--quantize 48`, and `loopFrom: 2`. After packer feet registration, f1-f5 feet matched within 1 px (x 49-206); f3-f5 relative to f2 had body dx 0, dy -1 and head/shoulders at most dx -1, dy -2. The 8 px height excess in f3-f5 was attributed to hair spikes. Claude reports these packed measurements are within the brief's loop lock. This is relayed evidence; Codex has not reproduced it in this worktree.

The old source-canvas bounding-box centers in `charge_v08_HOLD.md` are not registered packed-cell measurements and must not be used as the final loop verdict. As directed in relay #2, registration from the production quantized packed cells is authoritative. ENG-117 (`loopFrom`) must reach main before a production pack, onion-skin registration sheet, body sheet, lab loop, or final packed atlas audit can be made.

## Astra pre-pack audit

The raw candidate has been compared with the approved Goku model sheet, expression sheet, idle, and title-style baseline. Astra's pre-pack review found the identity and six-pose intent usable, with no visible clipping, but the raw source is not a clean technical pass: it contains 180,498 unique RGB values and nonuniform near-magenta background pixels (example: f0 top-left RGB 242, 12, 241). The held loop's source centers differ, so the loop lock cannot be certified from the raw canvas. Final quantized packed-cell registration and loop audit remain **HOLD/PENDING**. See the exact frame-level Astra findings in this file's audit addendum when received.

This technical review is not user design approval. v10 is `needs review`; no approval is inferred.

## Approved identity anchor hashes

- `reference/model_sheet.png`: SHA256 `C0A197C11B409D3D916078FB8577D09F3C0597B6F9875F7F7DA0CC31873A985D`
- `reference/expressions.png`: SHA256 `0E71CE3E4083AD6A2CB5BC0C89F2545A94B9C6EA97AB164F93C9DE12F97A845A`
- `reference/idle_approved.png`: SHA256 `57FBBD3CB99FC92A30DAFDD478479971E4E9D497E035C846E9FD28ECB126FE03`
- Title-style comparison: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md` and the exact approved cells in `public/art-review/title-style-pilot/`.

## Astra frame-level raw audit (GPT-6 Astra, medium)

**Finding:** raw visual/anatomy PASS to proceed to a diagnostic pack; raw technical compliance HOLD; packed-loop/anatomy audit HOLD. No user design approval. Qualitative comparison only, not a numeric segment pass. Hair obscures the skull crown, clothing obscures joints, and anchor/candidate pixel densities differ; physical segment comparisons remain uncertain.

- f0: clear deep gather, lowered head, bent knees, fists at hips; crouch explains the shorter silhouette. No obvious enlarged head or compressed limb anatomy.
- f1: clear release with raised chest, open shout, fists lowered and spread, wide planted stance; matches the approved shouting expression; arms and boots appear complete.
- f2: suitable held-pose reference; upward face, clenched fists, planted knees and feet.
- f3: same apparent anatomical pose but source figure is displaced right. This is not proof of drift after feet registration. Hair and cloth differ.
- f4: same apparent held-body construction; lifted gi flap and changed hair. No obvious limb-length or head-volume discontinuity by visual inspection.
- f5: source placement returns near f2, with higher hair. The f5-to-f2 seam still needs playback inspection.

Magenta-family-mask bounds (inclusive, source pixels within each 512x512 cell; fringe threshold uncertainty about +/-1-2 px): f0 `(68,161,439,497)`, f1 `(68,22,423,497)`, f2 `(58,26,411,497)`, f3 `(97,7,453,497)`, f4 `(68,7,423,497)`, f5 `(57,8,411,497)`. No visible boundary crossing; f3/f4 have 7 px above hair and each frame has 14 px below soles, short of the requested 20 px margin. Independent color count: 180,498 unique RGB values; soft/antialiased edges and background are not exact flat magenta (f0 top-left `(242,12,241)`). Inspect quantization for halos, silhouette erosion and lost face detail.

Astra did not reproduce Claude relay #2's feet-registered measurements. Final acceptance remains contingent on actual quantized atlas inspection: body segments vs approved anchors, registered fists/feet/head, and f5-to-f2 playback.
