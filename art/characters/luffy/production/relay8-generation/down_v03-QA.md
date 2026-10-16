# Luffy down v03 deterministic assembly candidate

Status: Astra PASS within measurement uncertainty on the exact 22-animation/100-frame shared-palette atlas. No user art approval, gameplay approval, or runtime contact pass is claimed.

- Candidate: `art/characters/luffy/raw/down_v03.png`, SHA-256 `b40f4b01cf7f861d083fb153f156495bc23150324328078182e75782b7100e00`; sidecar `raw/down_v03.json`.
- This is a deterministic assembly from prior approved-reference-scale pixels and the immutable call 2 returned source; no image-generation call was made. Cumulative generation calls remain 2/3.
- The original f0 source crop is preserved without resampling in the assembly; final shared-palette quantization may change RGB values from the diagnostic cell. Its source content and density are preserved.
- f1 source crop is original returned source box `[258,389]–[1277,909]`, 1020×521, from source SHA `8eeafecc703c1b83d018dbb8dd486e7ab3aa5e21b25ae642deab9aed5cc3d1c3`. One direct source-to-native factor `.205` yields predicted torso 38.63px and shin 53.73px. Astra endpoint estimates: neck-base `(261,279)`→sash `(371,432)`, `188.44±12px`; knee `(700,239)`→ankle `(874,435)`, `262.09±12px`; references `41.5±6px` and `52.8±6px`.
- The assembled cleaned max height/bodyHeight is 106px; the isolated actual-format pack selected v03 at scale 1. The old `bodyHeight:96` did not reshrink f0. Frame 0/f1 diagnostic cell bounds are `[53,145]–[221,240]` and `[18,135]–[226,240]`; no placement clip or safe-margin violation.
- Astra candidate-cell audit: PASS within measurement uncertainty on diagnostic atlas SHA `4f53696f1bd8bb6f053fdad300dc35c1d53a2dce1628578d10477a8cf05b0345`, metadata SHA `35118942ed041cc28a7594861fe76ae324e6d661bdcd73967bd489cfe181e3ed`; see `production/manual-audit-r5/V03_CANDIDATE_AUDIT.md` and `V03_PIXEL_HASHES.json`.
- Full actual-format shared-palette candidate pack: `production/relay8-generation/strict-r5/output/characters/luffy/sheet.png` SHA `0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122`, metadata SHA `dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f`. Astra final all-frame recheck PASSed the exact atlas above; the matching output has been adopted by the packer at `public/characters/luffy/sheet.png` and `public/characters/luffy/anims.json`.
- Earlier v02 is preserved and held; no prior candidate or source was overwritten.
