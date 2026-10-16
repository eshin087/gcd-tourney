# Luffy final strict-pack attempt after Astra audit

Command: `node tools/pack-sprites.mjs luffy --quantize 48`

Exit code: 1. The packer selected 19 animations / 91 frames and reported 48 colors, then refused to write because its automatic scale probe flagged `run`, `jumpUp`, `land`, `light1`, `light4`, `heavy`, `airLight1`, `airHeavy`, `guard`, `charge`, and `beamCharge`. The matching Astra records do not override the measured `drift`, `uniform` and `pop` findings under current packer policy; only `unmeasured`/`partial` verdicts convert to manual.

Four core strips remain held and absent from this attempted pack: `launched`, `down`, `getup`, `special`. No public output was written; the pre-existing gameplay atlas and metadata remain unchanged. Astra's manual results cover only the separate diagnostic fixture atlas SHA-256 `67152fadd32053fb70ab5682b9dde97df94a4c9d818edf233a6d1caa061d2f6e`; they do not certify the existing public atlas.

No warning-mode public pack, tool edit, scale exemption, or gate override was applied. The detailed source log is `art/characters/luffy/production/strict-pack-after-manual-audit-r2.log`.
