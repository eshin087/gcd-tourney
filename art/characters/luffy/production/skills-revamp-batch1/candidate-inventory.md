# Luffy skills revamp — Batch 1 candidate inventory

Relay authorization: `luffy-skills #1`. All art is unapproved. Generation was directed by the Luna sub-agent using `gpt-6-luna`, medium. References supplied: the approved Luffy title-style draft and approved idle. Prompt source: [SKILLS_REVAMP.md](../../SKILLS_REVAMP.md), Batch 1, plus the corresponding character/effect prompt files. No global-newest-file recovery was used.

## Image call ledger

| Image | Calls | Saved file | Exact generation output | Verdict |
|---|---:|---|---|---|
| `special` | 1 | No saved candidate | Returned path was not retained by the worker; no recovery attempted. | Unsaved attempt. |
| `special` | 2 | `raw/_qa_hold/special_v03.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-7e1dd0aa-e757-4812-b34d-262099829fcc.png` | Preserved diagnostic; superseded. |
| `special` | 3 | `raw/special_v04.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-c2c4be6d-efb9-4ec6-ac82-716378d22882.png` | Selected candidate; packer technical HOLD. No more calls remain. |
| `throw` | 1 | `raw/throw_v01.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-1b77924f-19cd-46a7-9acc-fc1dfc75a4a9.png` | Candidate; packer scale probe HOLD. |
| `throw` | 2 | Unsaved | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-f41f03ce-4d33-42a7-9642-36cde9c0110e.png` | Unsaved: no pulled-back wind-up; smooth shading. |
| `throw` | 3 | Unsaved | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-0355123f-8a45-40a7-b2ac-667b16a327a9.png` | Unsaved: f0 bends left but not far back; smooth shading. Budget exhausted. |
| `gumArm` | 1 | `vfx/raw/_qa_hold/gumArm_v01.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-55a809b9-8b76-48db-a49a-a6dfde50276f.png` | Held; f0 blank. |
| `gumArm` | 2 | `vfx/raw/_qa_hold/gumArm_v02.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-33c22dc9-a7a0-4751-9bb6-229c172b9af0.png` | Held; f0 blank. |
| `gumArm` | 3 | `vfx/raw/_qa_hold/gumArm_v03.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-bd751204-f821-4c4f-8639-9757766b5bea.png` | Held; f0 blank. Budget exhausted. |
| `gumFist` | 1 | `vfx/raw/gumFist_v01.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-441b9563-5f65-459e-9ea6-5e15b3a9a04e.png` | Candidate; VFX candidate pack completed. |
| `gumImpact` | 1 | `vfx/raw/gumImpact_v01.png` | `E:\Vibe Coding\.codex\generated_images\01a151b7-933c-7f80-97ac-085840a71a1d\exec-8888f1dc-62e0-4bff-9a67-aada67a758a0.png` | Candidate; importer detects 9 frames instead of 7. |

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

- `node tools/pack-sprites.mjs luffy --quantize 48 --keep-palette` failed the scale gate; no Luffy sheet or frame output was written. It read `special_v04` as 7/8 frames, with touching poses and clipped f5/f6. Both `special_v04` and `throw_v01` require version-bound scale review; the throw head probe reads 1.07–1.21.
- `node tools/pack-sprites.mjs vfx --candidates` succeeded for the candidate atlas. `gumFist` is 4 frames; `gumImpact` imported as 9/7; `gumArm` is missing and remains procedural.
- `npm run scale -- luffy` completed and wrote the scale contact sheet. `npm run body luffy special throw` could not produce a body sheet because the failed fighter pack wrote no candidate animations.
- No image has user approval. These results do not authorize shipping or integration.

The throw retries were inspected by Luna and intentionally not saved because neither met the brief. `special_v04` was also inspected for an exact crop/re-stitch option; no clean measured method preserves the source while resolving the packer's split and clipping, so it remains a pack/Astra hold. No further calls are available for throw or special in this round.
