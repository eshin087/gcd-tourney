# Sasuke Chidori VFX source provenance (batch 1)

Generated with built-in imagegen. Prompt source: art/characters/sasuke/SKILLS_REVAMP.md sections 2–3, A1–A5, with HD VFX style rules from art/SPEC.md / ADR 0044. Effects were generated independently without fighter reference images. Style-only VFX samples were inspected but not attached because their soft/noisy rendering conflicts with the hard-pixel brief.

All assets use the specified lightning palette: #FFFFFF #E8F7FF #BFE8FF #7CC8FF #3E8CFF #2350D8 #141E78. Four effect candidates are versioned and listed in the manifest/review queue. The user approved all four via Claude relay skills #14: “Approve all four: Codex records the approval; I pack them in HD and wire them into the game.”.

## Candidate pack QA (2026-10-18)

Command: `node tools/pack-sprites.mjs vfx --candidates --no-writeback`.

- Candidate manifest entries specify `hd: true`, but `normalizeManifest()` in `tools/pack-sprites.mjs` does not preserve that field. The pack therefore writes only `public/preview/vfx/atlas.png` at 128 px cells and does not create `atlas_hd.png`. This is a packer/tooling hold for Claude; Codex did not edit `tools/`.
- Packer frame counts after adding source sidecars `{"split":"even"}`: `chidoriForm` 6/6, `chidoriBurst` 8/8, `chidoriSpear` 8/8, `chidoriCurrent` 8/8. The Spear preview reports one clipped frame; it needs review before the source can be considered technically clean.
- The source sidecars change only layout parsing and do not alter the generated PNGs. First pack trial wrote derived frame folders at the standard 128 px size; those generated folders were removed. The second pack trial used `--no-writeback`.
- The four raw images are shown at [the batch 1 gallery](../../../../../public/reviews/sasuke-skills-batch1/index.html). The user approved all four via Claude relay skills #14 (quote recorded in REVIEW.md and manifest); Claude owns HD packing and integration.

## Saved source files

| Asset | Calls used | Built-in imagegen output identifier | Saved source | PNG dimensions | SHA-256 | Visual notes |
|---|---:|---|---|---:|---|---|
| chidoriForm_v01.png | 3/3 | exec-d9240988-b877-4582-9955-f3654afbd47e.png | art/vfx/raw/chidoriForm_v01.png | 2171×724 | 44ECD1E9A84DA45497D4EF2D65C71DD00F2D6670D3ED87DCF4DB3990E3376C3D | Six effect-only stages from separate sparks to formed knot; center is visually consistent. Correction reduced softness only slightly; residual halo/edge smoothing remains a technical concern. |
| chidoriBurst_v01.png | 2/3 | exec-f93bb689-baec-4fa6-afc8-62845c047334.png | art/vfx/raw/chidoriBurst_v01.png | 2172×724 | 80917DB07E51E14E16ACBD7A94D76492C98CAF738CA347482FAE585FA960A1ED | Eight effect-only frames: rightward piercing spike, expanding bolts, ring, then fading fragments. Layout correction retained the 3:1 canvas rather than producing 2048×256. |
| chidoriSpear_v01.png | 1/3 | exec-e6e063af-3819-4f80-ad0f-2a3dc6afa75a.png | art/vfx/raw/chidoriSpear_v01.png | 2172×724 | 59AEE962A4B86FBDD7FC8CAC67D25B6208CA3985090DFAC2B40537907889E8AD | Eight effect-only frames: blade grows left-to-right, holds through f3–f5 with changing arcs, then breaks into dashes and sparks. Thin horizontal silhouette reads clearly. |
| chidoriCurrent_v01.png | 1/3 | exec-da66ae2e-52ec-4464-8c5e-ad2f46ff2aaa.png | art/vfx/raw/chidoriCurrent_v01.png | 1774×887 | EDD454A9829011B2CA0E1D84B4BCE9293B7700066E8DB3BD091E0BAD74547FD1 | Eight effect-only frames with an open oval center for the fighter; outward discharge, shortened bolts, then fading rim crackle. |

The tool returned canvases with a horizontal strip centered in a band (A2 2171×724; A3/A4 2172×724; A5 1774×887), not the requested 8:1 raw canvas. The frames are visibly in one horizontal row; packer/layout behavior has not been checked. Pixel art is block-stepped, though A2 and some lightning edges retain a pale soft halo. Color-count and exact per-pixel palette checks remain unverified.

## Chidori hold

Three calls were used (budget exhausted); no compliant source was saved at art/vfx/raw/chidori_v01.png.

1. Built-in imagegen call 1: output identifier was not retained in the exec result; image data was not saved.
2. Built-in imagegen call 2: effect-only eight-frame crackle loop appeared inline. Image data was not persisted because art/vfx/raw/ did not yet exist when the save ran. The exec isolate ended and the data URL is no longer available. No output identifier was retained.
3. Built-in imagegen call 3 (layout correction): introduced Sasuke's full character in the cells, violating the effect-only contract. It was moved out of the packer root to art/vfx/raw/_qa_hold/chidori_attempt03.png and is held, not a v01 candidate. Dimensions 2172×724; SHA-256 ADD151DF7B7E0FF3D7B94EB6FBC61987EB84B133FB1291F6B7AB42448831690F.

The call-3 hold remains in _qa_hold so it cannot become a candidate. The effect-only call-2 result was visible but cannot be recovered with the available tool output; no further Chidori calls are allowed under the three-call limit.

## Held alternatives

| Path | Output identifier | Dimensions | SHA-256 | Reason held |
|---|---|---:|---|---|
| art/vfx/raw/_qa_hold/chidoriForm_attempt01.png | exec-2f63c6bd-3f7c-47af-8073-f5406761694e.png | 2172×724 | FA16B0E923A19C4F4E2F205A1AD6BD6D044EBCB0EEAC1F33C4FBB71B8D4340F4 | Correct progression, excessive soft glow. |
| art/vfx/raw/_qa_hold/chidoriForm_attempt02.png | exec-bf135dbd-fe79-477a-b78d-97c614e160ac.png | 2172×724 | 9A4D84AE7A15F1A05D6872FE51DAA3DB5900D17D63A04653D9AA4B1BB7FD64BE | Focused edge correction still left soft halo. |
| art/vfx/raw/_qa_hold/chidoriBurst_attempt01.png | exec-6814602f-0baf-4ffa-8498-b5f293880695.png | 1774×887 | 48D8DEFC3EDE8130FB61072BAFA672934A0168558B8E2A3E7846ED4420986219 | Content was usable; layout-only correction was tried and returned a better one-row canvas. |

