# Naruto ENG-112 directional normals — generation and QA ledger

Branch: `art/normals-naruto`
Worktree: `.worktrees/art-normals-naruto`
Authorization: relay combat #55
Generation controller: GPT-6 Luna, medium
Style/reference sources: `art/characters/naruto/PROMPTS.md`, approved `reference/model_sheet.png`, approved `reference/idle_approved.png`; move targets in `KIT.md`, `CHARACTER.md`, and `ANIMATIONS.md`.

## Call accounting

There were 30 image-generation invocations total, exactly 3 per move. Twenty-nine source PNGs were saved: fTilt v01/v02 and v01-v03 for the other nine moves. fTilt call 1 returned an image but was not persisted; the generation tool returned image data without a reusable local output path, so that output cannot be recovered or hash-verified. No candidate versions were overwritten. `raw/_qa_hold/` also contains older unrelated files; this ledger covers only the 29 ENG-112 files below.

Each saved call result was written to the exact versioned PNG path below and hashed from that file. The generation tool did not provide a filesystem path; “saved path” is the exact path used to persist that call result. Each attempt used its canonical move brief plus a repair cue addressing prior QA.

## Saved source candidates

| Move | Call | Version | Saved path | SHA-256 |
|---:|---|---|---|---|
| fTilt | 2/3 | v01 | `art/characters/naruto/raw/_qa_hold/fTilt_v01.png` | `adfd8d1531448c4ef59e957376d96df0e5ef74f3e0e51f86a2ff974b03b735fe` |
| fTilt | 3/3 | v02 | `art/characters/naruto/raw/_qa_hold/fTilt_v02.png` | `c1d5193515f7e7af8c03cc5e1e791dde9c05cf89c8db71f2001e518f283a46cc` |
| uTilt | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/uTilt_v01.png` | `5f96753c8d82ebd4c4c43b3e67a7d34ccaf222678b2b6b07d1a9c55a60df73ef` |
| uTilt | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/uTilt_v02.png` | `e61a0f9deb7b084d3f3089b4a0fbc34d6399858a84b7d3727bbeeb00621cbd7e` |
| uTilt | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/uTilt_v03.png` | `f4787c431cf7c009fedd08e34bd6bf667775088c6b34861da9f016f6b0b631ec` |
| dTilt | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/dTilt_v01.png` | `8b7afc51ae0c46b424974fd748df2ceaa5ccb6ddf8be790c1fe3d658ff292fd6` |
| dTilt | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/dTilt_v02.png` | `5cfc937ba75674f97e0fdda253bcd6aba5994f776150a6cbb8beb294ecb2d320` |
| dTilt | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/dTilt_v03.png` | `3c1bfc3c9e805aae56d208ba3eb1642a165c5a8241acd13ec72a3ce7ff144c10` |
| dashAttack | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/dashAttack_v01.png` | `2b78bb4a97d1439ad6364e14d377d2c6b113830f5ff2c38ae7ac4533ddc53e0e` |
| dashAttack | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/dashAttack_v02.png` | `d86f7a3c9ed043d75b9b639c87e59ac6bc2bd8767312a0e50628fbd22823d319` |
| dashAttack | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/dashAttack_v03.png` | `4adeeb269f3449cb763bf97cea233b2d97ef29f959097596eb39f61bd3c54a94` |
| fSmash | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/fSmash_v01.png` | `980a27b85d00f3694d93a555f431b662c766fab34739c232f2939fa586d05b80` |
| fSmash | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/fSmash_v02.png` | `3010fc1e39c06a067fb5b7bedd88633f0268a903145c108dcfa0899ea35ca3e5` |
| fSmash | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/fSmash_v03.png` | `0570ae8f5f0a3b37ffaefd6ea5acf4d971cde5515ff69a94127cf364753fb09e` |
| uSmash | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/uSmash_v01.png` | `9a3c8857d4c15bf00d38dd982bee7bb8ba73cae96fcc9d0d67db038511dcbac4` |
| uSmash | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/uSmash_v02.png` | `32b4458b1c71a9952959bad9953894cee88d7a8e8fb942805a585abff570b418` |
| uSmash | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/uSmash_v03.png` | `50f47e01b13ae9df16887cd66a0ad1d96cba473dde0848c83f42559302dc231e` |
| dSmash | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/dSmash_v01.png` | `e53f32244d699bcb90dfd81f211437db3430e569784931c6096d2cbbba733d94` |
| dSmash | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/dSmash_v02.png` | `bb2ed76b8d48cf5ce60ddbea89ff8b7346d431069adabb38e909718d8e8d993f` |
| dSmash | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/dSmash_v03.png` | `620ebbaf8c919941d497eafba10012f7c6ba39d4261b254f7481591a3daae810` |
| fair | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/fair_v01.png` | `da5664f166fa16e9cda930aee53c385f8422b45fc4337faa54845787e4c32f5b` |
| fair | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/fair_v02.png` | `3f09086d0bacdcf71efd40079bd1fce2236f1796edf3fc31b0f338d121fe6702` |
| fair | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/fair_v03.png` | `d7751bb4f5a72672a0337e9337109478518b9cf5d64fa3dfc4db155f24775cea` |
| bair | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/bair_v01.png` | `8810bdb17d2ec56ce82dc7fe2625dc2fdc4ccc2388dcb2ce0a82e703d5425fb5` |
| bair | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/bair_v02.png` | `f84f90ff2858d73193946e63e8d5b6cfb5ecdb89904214b89485d025af31e861` |
| bair | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/bair_v03.png` | `a1d587feca34a431bcda27aed5ffd7da4104fad97b5a369f94e5fb6c7c149f40` |
| uair | 1/3 | v01 | `art/characters/naruto/raw/_qa_hold/uair_v01.png` | `695ad2248ac2fbb316ca33fd67c35873d767ea23019623d71f6e18f7ea269eec` |
| uair | 2/3 | v02 | `art/characters/naruto/raw/_qa_hold/uair_v02.png` | `87ecb0d21f88bc4fddceea445c5c4431b9a9443979bf75d2790877c5d0492351` |
| uair | 3/3 | v03 | `art/characters/naruto/raw/_qa_hold/uair_v03.png` | `47e191a7eb792c7c1722918d7f00b6ff7b33c29c298408f084a0f1e543b2b342` |
| fTilt | call 1 | no saved path; returned image was not persisted and is unhashable | - |

## Diagnostic packing and holds

The live pack was rebuilt with no normal candidates present: 54 animations, 245 frames, 48 colors, one 4096×4096 sheet. All 54 original animation names and frame-index arrays are intact. `anims.json` differs only in existing `charge` scale metadata (head 0.996→0.992, feet 0.648→0.653, verdict `pop`→`ok`). `sheet.png` bytes changed during the quantized rebuild, so the output is not byte-identical to main.

For candidate evidence, each move’s latest held PNG was temporarily copied into its normal raw root. The packer ran with `--quantize 48 --no-writeback`, a temporary manifest outside the repository, and `--out public/reviews/normals-naruto/diagnostic-atlas`. That isolated atlas has 64 animations / 315 frames / 48 colors, sheet1 plus sheet2 after frame 256. Temporary source copies and manifest were removed. The temporary manifest’s `approvedVersion` entries were diagnostic plumbing only; no approvals were recorded and no production files were written from that pack.

The strict production pack gate did not accept the held candidate set. GPT-6 Astra (medium) then inspected all 70 cells from the exact diagnostic atlas at native 256-pixel density beside idle f0 and approved neutral/combat references. Final result: HOLD for all ten latest strips; zero `scaleManualQA` passes; technical audit only, not user art approval. Head/shoe ratios in the audit JSON are packer color-region proxies, not independent skull or shoe measurements. Occlusion and cell clipping invalidate several apparent probe changes: do not describe dashAttack f2/f3, uSmash f6, or raised-arm uTilt/uair as proven anatomical shrinking. The B/body garment proxy is invalid because three declared body colors are missing from the palette; do not use it to rescale the figures. Visible holds include unresolved segment calibration/head-to-body balance (fTilt), head/build landmark calibration (uTilt), clipped f2 fist plus missing second low active poke at f3 (dTilt), four cropped frames and no clearly extended blow (dashAttack), enlarged head/build without segment certification (fSmash), visibly reduced build/leg/shoe silhouette (uSmash), left clipping and incomplete bilateral contact (dSmash), enlarged head relative to body/feet with tight margin (fair), enlarged head relative to footwear (bair), and small footwear/occluded landmarks plus a fist where the requested move is an up kick (uair). The raw artwork has softened contours and broader orange shading than the approved pixel reference. All 29 sources remain held; no scale pass or approval is implied.

Astra audit: [FINAL5_DIAGNOSTIC_AUDIT.md](FINAL5_DIAGNOSTIC_AUDIT.md), [evidence JSON](astra-evidence/FINAL5_DIAGNOSTIC_AUDIT.json). Exact atlas SHA-256: sheet `69c24a34301990b1e010d21c446ccad36110a928047cb34d3816d9fc7ab17e29`; sheet2 `777c730db966cae1d232b169bf431115ae03c951b4908053e60d1da52f259506`; anims `65f1f4c601b4c8660e73cd1ea9c3e721d1963f844f17e6bed5154803571855a2`. Astra notes the temporary manifest was removed and cannot be reconstructed; the atlas hashes bind the audited output, not the lost build configuration. The separate body sheet is `public/reviews/normals-naruto/body/body-naruto-fTilt-uTilt-dTilt-dashAttack-fSmash-uSmash-dSmash-fair-bair-uair.png`; its B proxy is invalid for the same missing-palette colors.
