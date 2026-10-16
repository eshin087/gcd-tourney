# Gojo dashes generation attempt inventory

Task worktree: `.worktrees/art-gojo-dashes` (branch `art/gojo-dashes`). Images generated with approved `model_sheet.png`, `expressions.png`, `idle_approved.png`, and explicitly authorized `run_v14_A.png` references. Every call is a separate image.

| Asset/version attempt | Call status | Exact generated output path | Preserved attempt copy | SHA256 of preserved copy |
|---|---|---|---|---|
| dash v10 attempt 1 | Consumed; output_hint was not captured by the initial wrapper. No copy/hash; provenance unresolved. | unavailable | unavailable | unavailable |
| backDash v07 attempt 1 | Consumed; output_hint was not captured by the initial wrapper. No copy/hash; provenance unresolved. | unavailable | unavailable | unavailable |
| dash v10 attempt 2 | Captured and preserved | `E:\Vibe Coding\.codex\generated_images\01a14305-9bdb-70a2-abfb-782dc845e021\exec-a0ad2626-f2ca-4b8a-abbe-ff69b0a3881e.png` | `art/characters/gojo/production/dashes/attempts/dash_v10_attempt02.png` | `3E92C94E95B0090B550A3FBC820D1040AF7FA853B270F8643869E5CD680EE3B6` |
| backDash v07 attempt 2 | Captured and preserved | `E:\Vibe Coding\.codex\generated_images\01a14305-9bdb-70a2-abfb-782dc845e021\exec-e8865e50-0606-465a-bca9-2c81dc0355cd.png` | `art/characters/gojo/production/dashes/attempts/backDash_v07_attempt02.png` | `E8287F029E9E25E7284B611D4002A492D79F886FC6B489A5DEA3CE4AC5604934` |
| superDash v12 attempt 1 | Captured and preserved | `E:\Vibe Coding\.codex\generated_images\01a14305-9bdb-70a2-abfb-782dc845e021\exec-7ff25e4e-6605-4bc3-832a-aa8c776f6c0a.png` | `art/characters/gojo/production/dashes/attempts/superDash_v12_attempt01.png` | `44F9B10C3F14FC0922FCE9B0B22DA774264C8A00790AA9458EFE55D4389C7083` |

Selection and disposition (2026-10-15): backDash attempt 02 was selected as `raw/backDash_v07.png` (SHA256 above) and packed at atlas slots 18-20 with a uniform auto-head fit x0.8569. Strict pack command `node tools/pack-sprites.mjs gojo --quantize 48` exited 0; 42 animations / 175 frames packed, 48 colors. Astra audited the actual packed cells and returned a scoped HOLD for tucked-frame placement and uncertain occluded torso/limb landmarks; see [audit](ASTRA_DASHES_AUDIT_v01.md), SHA256 `0742484db6e44eda952521ff7f275ad16bb5338d240714adc045a9f58ef1b043`. No redraw was prescribed.

Dash attempt 03 was selected for technical evaluation, but its auto-head fit x1.2626 clipped frame 1 by 12 px; candidate and sidecar are preserved in `raw/_qa_hold/`. Attempt 02 is separately held for head/hair drift. SuperDash attempt 03 was selected for technical evaluation but failed scale/clipping (head 0.91, feet 0.79 of idle; frame 1 clipped 4 px); attempt 01/02 and selected attempt 03 are preserved under `_qa_hold/`. Both remain excluded from the atlas, which uses approved dash v06 and superDash v09. Calls used: dash 3/3, backDash 2/3 (attempt 01 output path was not captured), superDash 3/3. No remaining calls are authorized in this round.

| dash v10 attempt 3 | Captured and preserved | `E:\Vibe Coding\.codex\generated_images\01a14305-9bdb-70a2-abfb-782dc845e021\exec-45ec6bea-bb71-4138-ac5f-e0b397ae26a2.png` | `art/characters/gojo/production/dashes/attempts/dash_v10_attempt03.png` | `6132E315714021F32BAD7D80F46E5C42B5A050A38C0E53AD5E56C9CD713C34FE` |
| superDash v12 attempt 2 | Captured and preserved | `E:\Vibe Coding\.codex\generated_images\01a14305-9bdb-70a2-abfb-782dc845e021\exec-f3ddd7d5-49e0-49e4-8de2-f2811e166a4c.png` | `art/characters/gojo/production/dashes/attempts/superDash_v12_attempt02.png` | `4D16FBA792D6E67D0AA975AD1BD3F16502F0311FAEB9733101B1342D7EC11ACF` |

| superDash v12 attempt 3 | Captured and preserved | `E:\Vibe Coding\.codex\generated_images\01a14305-9bdb-70a2-abfb-782dc845e021\exec-18234345-0835-4497-9d87-c3ca69611bed.png` | `art/characters/gojo/production/dashes/attempts/superDash_v12_attempt03.png` | `C953A5D0F01A23A393590C4A5767F4996AA739F9FDA272E723B8CD6C2B08E1F4` |

