# Naruto skills revamp: batch 2 provenance

Date: 2026-10-18. Source brief: `art/characters/naruto/SKILLS_REVAMP.md`, A1/A2/A3/A6/A7. The user approved all five v01 drawings via Claude relay skills #9; one built-in image-generation call per asset (1/3 each). No discarded attempts. No user-owned or copyrighted reference stills were attached.

| asset | attempts | generated output | source SHA-256 | filed strip | strip SHA-256 |
|---|---:|---|---|---|---|
| `rasengan` v01 | 1/3 | `exec-b247cbe6-4540-454d-9151-4e509c0407a3.png` | `349acf627b4f9baeef608649fc5cfce25d502ac6a20afebc225ee146f26a2971` | `rasengan_v01.png` (742620 bytes) | `C8615EE2D30E443508889F07A9A44B85D0DEA348CC3425019A78E5CA9E1A94D4` |
| `rasenganForm` v01 | 1/3 | `exec-6967ab76-f07e-41a3-af76-01ab5184bb3a.png` | `1824b2213ea8e4f1c6c47d61cc3e87960745ebc191c93f8c624207447ca49829` | `rasenganForm_v01.png` (491936 bytes) | `9068EA7F7F80EAE0DC5D51D3E047D4F12AC62E8DF182CE101BD0563D58FFD05C` |
| `rasenganBurst` v01 | 1/3 | `exec-6da433bb-5685-4742-b4e8-6c3ac619db15.png` | `0c5c32d0348c7a3870c2b633fee8e0b254ee68723dd1d76ce758b23a713b8018` | `rasenganBurst_v01.png` (699249 bytes) | `DCEF70C32CE6DC0CA4F85694E1A7F7D0426B0AD875E69027A44FFA44DC28BBF8` |
| `poof` v01 | 1/3 | `exec-23682fe3-8346-4f33-9a81-792745d5084d.png` | `7b99195369e1c023419f28e4136f23f4a98eba9916d7a512aa7fa44e8d3890bc` | `poof_v01.png` (398314 bytes) | `FD3085DD2955C83144A97C5F1E31C8A694F300E1B742DD8A3C91D3D2111A9955` |
| `subLog` v01 | 1/3 | `exec-fcb9b3ba-3f34-4964-97bd-e288d2dff6e8.png` | `15924cf05fca550b7e2cffdd0bfb61031c03973fdaa678ae81dabbf6549f7a42` | `subLog_v01.png` (327995 bytes) | `1611A042386108C76068E1CF2E87B04089E2368E5AA4E356C634118B65AC4A96` |

## Extraction and technical state

Each generated grid was split in reading order, center-cropped to square cells where the renderer returned rectangular slots, then nearest-neighbor scaled to 256 x 256 per HD cell. Cells were assembled into one magenta-background horizontal strip per effect. RasenganForm uses the Rasengan v01 candidate as a visual continuity reference in its single call. Visual approval is recorded; no candidate pack or in-game check has been run for this batch on this art branch. Claude owns integration and support for these new effect names.
