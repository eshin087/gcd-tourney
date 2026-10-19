# Luffy skills revamp — Batch 1 candidate inventory

Generation authorization: `luffy-skills #1`. Generation was directed by the Luna sub-agent using `gpt-6-luna`, medium. References supplied: the approved Luffy title-style draft and approved idle. Prompt source: [SKILLS_REVAMP.md](../../SKILLS_REVAMP.md), Batch 1, plus the corresponding character/effect prompt files. No global-newest-file recovery was used.

Approval update: the user approved `special` v04, `throw` v01, `gumArm` v03, `gumFist` v01 and `gumImpact` v01 as drawn via Claude relay `luffy-skills #2`. This does not clear any technical holds. Superseded `special` v03 and `gumArm` v01-v02 moved to `_rejected/`; approved `gumArm` v03 moved to the active raw folder.

## Image call ledger

| Image | Calls | Saved file | Exact generation output | Verdict |
|---|---:|---|---|---|
| `special` | 1 | No saved candidate | Returned path was not retained by the worker; no recovery attempted. | Unsaved attempt. |
| `special` | 2 | `raw/_rejected/special_v03.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-7e1dd0aa-e757-4812-b34d-262099829fcc.png` | Superseded by user-approved v04; preserved in `_rejected/`. |
| `special` | 3 | `raw/special_v04.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-c2c4be6d-efb9-4ec6-ac82-716378d22882.png` | Selected candidate; packer technical HOLD. No more calls remain. |
| `throw` | 1 | `raw/throw_v01.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-1b77924f-19cd-46a7-9acc-fc1dfc75a4a9.png` | Candidate; packer scale probe HOLD. |
| `throw` | 2 | Unsaved | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-f41f03ce-4d33-42a7-9642-36cde9c0110e.png` | Unsaved: no pulled-back wind-up; smooth shading. |
| `throw` | 3 | Unsaved | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-0355123f-8a45-40a7-b2ac-667b16a327a9.png` | Unsaved: f0 bends left but not far back; smooth shading. Budget exhausted. |
| `gumArm` | 1 | `vfx/raw/_rejected/gumArm_v01.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-55a809b9-8b76-48db-a49a-a6dfde50276f.png` | Superseded by user-approved v03; f0 blank; preserved in `_rejected/`. |
| `gumArm` | 2 | `vfx/raw/_rejected/gumArm_v02.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-33c22dc9-a7a0-4751-9bb6-229c172b9af0.png` | Superseded by user-approved v03; f0 blank; preserved in `_rejected/`. |
| `gumArm` | 3 | `vfx/raw/gumArm_v03.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-bd751204-f821-4c4f-8639-9757766b5bea.png` | User-approved as drawn; f0 blank technical hold remains. Budget exhausted. |
| `gumFist` | 1 | `vfx/raw/gumFist_v01.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-441b9563-5f65-459e-9ea6-5e15b3a9a04e.png` | Candidate; VFX candidate pack completed. |
| `gumImpact` | 1 | `vfx/raw/gumImpact_v01.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-8888f1dc-62e0-4bff-9a67-aada67a758a0.png` | Candidate; importer detects 9 frames instead of 7. |
| `gumImpact` | 2 | Unsaved | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-4c3322e6-a2d7-4fee-ad97-71ef7ddf9678.png` | Unsaved: raster 1660×916, not seven equal square cells in one row. |
| `gumImpact` | 3 | Unsaved | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-4ed99c97-3778-4be5-8973-df7d36d5bb8f.png` | Unsaved: seven stages read clearly, but 2206×713 (~3.1:1) does not meet seven equal square cells in one row. Three-call budget exhausted. |

Saved-source SHA-256 and dimensions:

| File | Dimensions | SHA-256 |
|---|---:|---|
| `special_v04.png` | 2172×724 | `88a0d9a7b8c58b4369235609c0e44dedbcb02de55c7f179816bf72411b870b08` |
| `special_v03.png` | 2172×724 | `809ad47bf894a1bb7967b304eef031a0ab7433d244532fa1a2954de98678695c` |
| `throw_v01.png` | 2172×724 | `615ca918a07192c2b598186fd54ea0170816798994eaed8353d9ea73498cc823` |
| `gumArm_v01.png` | 1774×887 | `eb33b9c1e5e77f410a139fad29ee8edcbbdeb839bbae8dc79af037442465741b` |
| `gumArm_v02.png` | 1774×887 | `405b42aea05e4c9481291adae6d8e5c4f5b029824d9bb5bd3ca464b86c88640d` |
| `gumArm_v03.png` | 1774×887 | `37180d67e673f579bf83c10c7268289f3cae743e7a206e6e56896d39a49b0ac1` |
| `gumFist_v01.png` | 1983×793 | `8cc37f50b18b71c04b4890af7c64100ec9f73dd5b43a318febb04383b7218595` |
| `gumImpact_v01.png` | 1659×948 | `0f6adfc722ac507d7cea4fd1b68e3231964d409b87eb3a44a8e06cbaf2479545` |

## Pack evidence and limits

- Before the user approval, `node tools/pack-sprites.mjs luffy --quantize 48 --keep-palette` failed its gate and wrote no candidate sheet. It read `special_v04` as 7/8 with touching poses and clipped f5/f6; the throw probe read 1.07–1.21.
- After user approval, the same Luffy pack command exited 0 and wrote the actual 48-color sheet plus `anims.json`, but this does not clear warnings: special is mapped as 7/8 frames; touching/cropped pose groups and clipped f5/f6 remain; its versioned `scaleManualQA` record is still for v02. The four throw frames are mapped, but require anatomy review.
- `npm run body luffy special throw` completed. Report: `throw` head ratios 1.72, 1.68, 1.68, 1.01; body ratios 1.092, 1.079, 1.078, 0.934 (median 1.079). `special` has a nearly empty f2 (body ratio 0.033, no head read), late body ratios 1.773 and 1.47, despite head median 0.996. The tool flags no B-size outliers, but B is advisory and these values are not anatomy passes.
- `npm run scale -- luffy` writes a contact sheet with 1 reference, 21 manual results and 2 unmeasured results, 0 flagged; this does not provide the version-bound anatomy sign-off required for these strips.
- `node tools/pack-sprites.mjs vfx --candidates` packed `gumFist` to 4; `gumImpact` imported as 9/7; `gumArm` was missing before approval. After approval, `npm run sprites vfx` wrote an atlas but reports `gumArm` 1/2 (blank first frame) and `gumImpact` 9/7. This atlas is diagnostic and is not cleared for integration.
- The user visually approved the five named drawings via Claude relay luffy-skills #2. These pack results do not authorize integration or shipping. Exact post-approval quantized files are preserved under `quantized/`; final Astra anatomy/scale audit is pending.

The throw retries were inspected by Luna and intentionally not saved because neither met the brief. GumImpact calls 2 and 3 were also inspected and left unsaved: neither raster is a genuine seven-equal-cell strip. All three gumImpact calls are now used; no further calls are available for it, throw or special in this round. `special_v04` was also inspected for an exact crop/re-stitch option; no clean measured method preserves the source while resolving the packer's split and clipping, so it remains a pack/Astra hold.

## Final Astra anatomy and scale audit

Auditor: GPT-6 Astra, medium. Scope: actual post-approval 48-color quantized Luffy atlas, approved neutral/combat reference cells and production contract. Atlas SHA-256 `f70f27f5e9d9f7e91397a0c0cd778dcbc18488851a3471b362c14c251dfae082`. Result: **HOLD special v04 and throw v01**; the visual approvals remain recorded, but neither strip is cleared for integration.

- `special` cells 100–106: f2/cell 102 contains only an arm fragment and lower leg/sandal; f5–f6 contain multiple partial bodies and cross-cell contamination; f3's rear leg is cut off. Other cells also have detached fists, abruptly ended arms, or insufficient active reach. Packer maps 7/8 frames and phases `[3,3,1]` instead of the required eight and `[3,3,2]`. Late body-area values 1.773/1.470 measure duplicated content, not one enlarged body. No valid whole-strip scale certification.
- `throw` cells 90–93: bodies are mostly coherent and visually near the reference; exact limb lengths in tucked poses are uncertain because of overlap. In active cells 91–92 the forward arm ends at x221/x220, leaving 34/35 transparent columns before x255. Thus the required edge continuation fails. The reported head ratios 1.72/1.68/1.68/1.01 are suspect probes, not evidence of 68–72% head enlargement.
- Other approved VFX remain separately held where importer defects exist: gumArm v03 has blank f0 and gumImpact v01 imports 9/7. gumFist v01 packed to four frames. None of the drawing approvals substitutes for integration or runtime contact checks.
