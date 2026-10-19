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

The old source-canvas bounding-box centers in `charge_v08_HOLD.md` are not registered packed-cell measurements and must not be used as the final loop verdict. As directed in relay #2, registration from the production quantized packed cells is authoritative. ENG-117 (`loopFrom`) is on main. The final review pack and registration sheet use packed atlas cells; the Sprite Lab route is linked, but interactive playback was not independently verified in this session.

## Astra pre-pack audit

The raw candidate was compared with the approved Goku model sheet, expression sheet, idle, and title-style baseline. Astra's pre-pack review found the identity and six-pose intent usable, with no visible clipping, but the raw source is not a clean technical pass: it contains 180,498 unique RGB values and nonuniform near-magenta background pixels (example: f0 top-left RGB 242, 12, 241). The held loop's source centers differ, so the loop lock cannot be certified from the raw canvas. Final quantized packed-cell registration and loop audit remain **HOLD/PENDING**. See the exact frame-level Astra findings in this file's audit addendum when received.

This technical review is not user design approval. v10 is `needs review`; no approval is inferred.

## Approved identity anchor hashes

- `reference/model_sheet.png`: SHA256 `C0A197C11B409D3D916078FB8577D09F3C0597B6F9875F7F7DA0CC31873A985D`
- `reference/expressions.png`: SHA256 `0E71CE3E4083AD6A2CB5BC0C89F2545A94B9C6EA97AB164F93C9DE12F97A845A`
- `reference/idle_approved.png`: SHA256 `57FBBD3CB99FC92A30DAFDD478479971E4E9D497E035C846E9FD28ECB126FE03`
- Title-style comparison: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md` and the exact approved cells in `public/art-review/title-style-pilot/`.

## Astra frame-level raw audit (GPT-6 Astra, medium)

**Historical finding:** raw visual/anatomy PASS to proceed to a diagnostic pack; raw technical compliance HOLD; packed-loop/anatomy audit was pending at that stage. The packed audit below supersedes the packed-loop status. No user design approval. Qualitative comparison only, not a numeric segment pass. Hair obscures the skull crown, clothing obscures joints, and anchor/candidate pixel densities differ; physical segment comparisons remain uncertain.

- f0: clear deep gather, lowered head, bent knees, fists at hips; crouch explains the shorter silhouette. No obvious enlarged head or compressed limb anatomy.
- f1: clear release with raised chest, open shout, fists lowered and spread, wide planted stance; matches the approved shouting expression; arms and boots appear complete.
- f2: suitable held-pose reference; upward face, clenched fists, planted knees and feet.
- f3: same apparent anatomical pose but source figure is displaced right. This is not proof of drift after feet registration. Hair and cloth differ.
- f4: same apparent held-body construction; lifted gi flap and changed hair. No obvious limb-length or head-volume discontinuity by visual inspection.
- f5: source placement returns near f2, with higher hair. The f5-to-f2 seam still needs playback inspection.

Magenta-family-mask bounds (inclusive, source pixels within each 512x512 cell; fringe threshold uncertainty about +/-1-2 px): f0 `(68,161,439,497)`, f1 `(68,22,423,497)`, f2 `(58,26,411,497)`, f3 `(97,7,453,497)`, f4 `(68,7,423,497)`, f5 `(57,8,411,497)`. No visible boundary crossing; f3/f4 have 7 px above hair and each frame has 14 px below soles, short of the requested 20 px margin. Independent color count: 180,498 unique RGB values; soft/antialiased edges and background are not exact flat magenta (f0 top-left `(242,12,241)`). Inspect quantization for halos, silhouette erosion and lost face detail.

Claude relay #2 provided earlier trial-pack registration numbers. The final pack was independently audited below; final acceptance still has the exact loop-lock and body-segment holds recorded there, with the timed seam not independently checked.

## Packed diagnostic and Astra final audit (GPT-6 Astra, medium)

The final review pack used unchanged v10 raw, manifest timing `[70,90,110,110,110,110]`, `loopFrom: 2`, and `--quantize 48 --keep-palette`. It contains 31 animations / 160 frames / a 4096x2560 sheet / 48 colors, matching main’s animation count. Packed sheet SHA256 `9a1417af010ead2f9ce0027c3835b2aee61964e2ffb08b1014eed4ecaa2ae0b4`; `anims.json` SHA256 `3b3de8f659f6326c2fccc3248daa24dfe0b246128761dba6394582ed16ae0d99`. Astra audited these exact output hashes. The pack was written with a disposable review manifest marking only charge v10 approved to bypass the unapproved-candidate write gate; the committed source manifest remains raw, version 10, approvedVersion 5, needs review, with no manual QA pass. The public atlas is review output and not ship clearance.

Astra finding: qualitative identity/anatomy and approximate placement PASS; literal loop-lock compliance HOLD. f2-f5 floor occupancy masks differ from f2 by 2 / 1 / 2 pixels; foot contour positions are within 1 px. The f2 floor span is left 52-67 and right 188-205; f3 is 51-66 / 188-205; f4 is 51-67 / 188-205; f5 is 51-67 / 187-205. At y240 there are 34, 34, 35, 36 occupied pixels for f2-f5 respectively. Footprint XOR over y220-240 is 59 / 57 / 47. Regional registration estimates relative to f2: head f3 `(0,-1)`, f4 `(0,-2)`, f5 `(-1,-2)`; knees and hips each `(0,-1)`; left fist each `(-1,-1)`; right fist `(0,-1)`, `(1,-1)`, `(0,-1)`. Estimates are ±1 px and include cloth/shading changes, not located anatomical joint centers. Therefore the stated ≤1 px approximate placement passes, but the exact identical floor-pixel and locked knee/hip wording does not. Timed seam playback was not independently checked at audit time.

Astra reports f0 is a clear crouched gather (149 px occupied height); f1 is a clear release; f2 is a coherent held reference. f3-f5 preserve apparent build and pose with breathing/updraft changes. No obvious anatomical discontinuity, enlarged head, shortened limb, missing digit mass, inflated clothing or clipping was found. This is qualitative only: hidden crown/joints and clothing prevent a defensible numeric segment pass. This does not support a version-bound numeric scale pass or clear loop lock or approve the art.

Body sheet (`body-sheet/body-goku-charge.png`, `body-sheet/body-report.json`) gives garment-area B by frame `0.973, 1.164, 1.165, 1.189, 1.199, 1.184`, median `1.175` versus idle f0. B is advisory and can rise with the open-arm/wide-stance pose, but it is above the 1.12 flag and the segment measurements remain uncertain. Head-probe H values are not reliable for Goku under the manual head-probe configuration. Keep the body-size check as a visible review caveat. The combat comparison in the body sheet is the approved `title-combat-v02.png`; it was copied under the body-sheet tool’s expected alias in temporary staging.

The quantized output has binary alpha, 47-48 occupied colors per frame and no visible magenta fringe or cell clipping. The source's near-magenta/soft-edge concern did not produce an obvious halo in the packed cells.

### Review status

The user approved v10 as drawn via Claude relay charge #4 (quote: “Approve v10”). No `scaleManualQA` pass is recorded. Goku’s automatic probe is unreliable, segment measurements remain uncertain, and the B median is above the advisory threshold. The pack metadata reports the candidate as unmeasured. Visual approval does not pass loop lock, numeric segments, runtime contact or integration. Claude review remains pending.
