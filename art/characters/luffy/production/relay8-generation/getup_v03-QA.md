# Luffy getup v03 deterministic assembly candidate

Status: Astra PASS within measurement uncertainty on the exact 22-animation/100-frame shared-palette atlas. No user art approval, gameplay approval, or runtime contact pass is claimed.

- Candidate: `art/characters/luffy/raw/getup_v03.png`, SHA-256 `e14761e7f80b58eeb7d08eb465b5347bba192e9e3baae7ada6e3f2cbea018ad0`; sidecar `raw/getup_v03.json`.
- This is a deterministic uniform assembly from the intact original returned source; no image-generation call was made. Cumulative generation calls remain 2/3.
- Original source `production/generation-source/getup_v02_call02_returned-source.png` is 2172×724, SHA `674be6dfc0e3cda4546201392d5b0664681565e8d80cd28d8724276631611127`. All five complete components are retained from the continuous source; no equal-panel crops were used.
- One direct source-to-native factor `.477` is applied to all five components. f4 endpoints: sternoclavicular/open-vest neckline `(185,115)`→sash `(178,202)`, `87.28±8px`; exposed shin `(72,300)`→ankle `(31,402)`, `109.93±8px`. Predictions are torso `41.63px` and shin `52.44px` against references `41.5±6px` and `52.8±6px`.
- The assembled cleaned max height/bodyHeight is 209px; the isolated actual-format pack selected v03 at scale 1. Frames span heights 84,115,138,164,209px with each placed on the shared floor pivot; maximum source width after scale is 225px. No frame clip or safe-margin violation.
- Astra candidate-cell audit: PASS within measurement uncertainty on diagnostic atlas SHA `4f53696f1bd8bb6f053fdad300dc35c1d53a2dce1628578d10477a8cf05b0345`, metadata SHA `35118942ed041cc28a7594861fe76ae324e6d661bdcd73967bd489cfe181e3ed`; see `production/manual-audit-r5/V03_CANDIDATE_AUDIT.md` and `V03_PIXEL_HASHES.json`.
- Full actual-format shared-palette candidate pack: `production/relay8-generation/strict-r5/output/characters/luffy/sheet.png` SHA `0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122`, metadata SHA `dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f`. Astra final all-frame recheck PASSed the exact atlas above; the matching output has been adopted by the packer at `public/characters/luffy/sheet.png` and `public/characters/luffy/anims.json`.
- Earlier v02 is preserved and held; no prior candidate or source was overwritten.
