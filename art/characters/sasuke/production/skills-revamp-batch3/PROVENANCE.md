# Skills revamp batch 3 candidate inventory

Generated with built-in `image_gen`. The image tool responses returned inline `data:image/png;base64,...` images but did not expose a call ID or a generated-image filesystem path. Prompt text is in [PROMPTS.md](PROMPTS.md). Each saved attempt file below is the exact returned PNG bytes; raw selections are byte-identical copies. SHA-256 is recorded for the selected raw file. No approval is implied.

| Asset | Calls used | Selected attempt | Saved attempt path | Selected raw path | Dimensions | Selected raw SHA-256 | Verdict / limitations |
|---|---:|---:|---|---|---:|---|---|
| beamFire v08 | 3 / 3 | 03 | `beamFire_attempt03.png` | `art/characters/sasuke/raw/beamFire_v08.png` | 2172x724 | `efbf298de187480a46f561ae36101c9505b38273ef943c5984b7fac2300bdb67` | Pose direction reads; sharper pixel treatment than 02. Attempt 01 response was not saved to disk; attempt 02 retained for comparison. Generated canvas does not honor 768x256 geometry, and it has not passed packer, body-size or anatomy review. Do not spend another call. |
| greatFireball v01 | 1 / 3 | 01 | `greatFireball_attempt01.png` | `art/vfx/raw/greatFireball_v01.png` | 2172x724 | `a0595d235bb8f2985c26560ea8a8155f7752f29f4993a578f093fd6b879ec532` | Fire sphere and rolling variations read; image has substantial empty top/bottom and output geometry differs from requested 2048x256. |
| greatFireballBurst v01 | 1 / 3 | 01 | `greatFireballBurst_attempt01.png` | `art/vfx/raw/greatFireballBurst_v01.png` | 2172x724 | `2be57d704a2568efd012f29fa7b11a3bda4711c8ab1f50a3777c734ae1b8b0b0` | Expansion and smoke fade read; first frame has a bright center but is not a full-cell white-out. Geometry differs from requested. |
| stormCloud v01 | 2 / 3 | 02 | `stormCloud_attempt02.png` | `art/vfx/raw/stormCloud_v01.png` | 2172x724 | `0157d58e7932f5c309ab693d7c6efcfe4dc819305fcf466dd5dd985eb7a575ae` | Targeted layout retry created four distinctly separated clouds and clear gutters. It reads as four frames. Seamless side-repeat still needs packer/game review. Attempt 01 is retained for comparison. |
| kirinBody v01 | 1 / 3 | 01 | `kirinBody_attempt01.png` | `art/vfx/raw/kirinBody_v01.png` | 1774x887 | `7a6c8129857333ce9fdf43dd6f8c21f20a91ff9532dd71108735c52b5bc5e72e` | Four distinct blue-white bolt columns read. Exact top/bottom edge continuity and geometry are unverified. |
| kirinHead v01 | 1 / 3 | 01 | `kirinHead_attempt01.png` | `art/vfx/raw/kirinHead_v01.png` | 2171x724 | `ce0a487775d6796bd538e00b36a31860bf67b1b1adb1eb0367bbef07b41d533f` | Downward-facing lightning beast profile, jaws, eye and mane read. Strong white areas may need palette/scale review; geometry differs from requested. |
| kirinStrike v01 | 1 / 3 | 01 | `kirinStrike_attempt01.png` | `art/vfx/raw/kirinStrike_v01.png` | 2172x724 | `4806752e01028215bc2ecd6986684deef95777f0b7f2ac9d6b8394366608c78f` | Strike, dome, collapse and low arcs read. Strong white in first frames but not a solid white screen; geometry differs from requested. |

## Input provenance

- beamFire attempts 01–03: approved Sasuke `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`; no `reference/source` input.
- Every effect attempt: style-only refs `art/vfx/raw/rasengan_v01.png`, `rasenganBurst_v01.png`, `fourTailsRoar_v02.png`.
- Every saved generated attempt came from a separate built-in tool call except beamFire attempts 01 and 02, which used the same prompt. Prompt revisions and exact text are in `PROMPTS.md`.
- The tool returned PNG canvases mostly 2172x724, despite square-cell strip dimensions in prompts; kirinBody returned 1774x887. No attempt has been packed, resized, or otherwise edited. Only file copies were made to the prescribed raw paths.
