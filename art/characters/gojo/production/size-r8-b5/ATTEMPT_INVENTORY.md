# ART-SIZE-R8 B5 — Gojo airLight3 attempt inventory

Target: `airLight3` six frames with `[2,2,2]` phases. v13 is the closest visual candidate but remains in `_qa_hold`; v14 was rejected after the strict head gate. Preserve the left-leg spinning heel kick, hit frames f2-f3, and safe cell margins. Do not alter `bodyHeight`, `packScale`, or gameplay timing.

Approved identity references attached: model sheet, expressions, idle; approved jumpFall is the body-length reference; approved airLight2 is the related air-kick guide. The older airLight3 v12 is only a pose-order source where attached.

## Part A — poses f0-f3

| Call | Result | Returned image path | SHA-256 | Filed path |
|---:|---|---|---|---|
| 1 | Failed validation, counted | No image | — | — |
| 2 | Selected for stitch | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-b3094133-1020-4087-bfa9-8fea3ef12cf0.png` | `EB7F8C6739CE4EC88B30973BE32B639B940993CF752618E8577D01278C904A18` | `raw/_parts/airLight3_v13_A.png` |
| 3 | Corrected head to the approved scale guide | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-411b4223-29e4-4281-a3ac-184d0ede063e.png` | `A27D28B1C14D1AA51B5097E390D2606EB89CBFA3106FA0EA9D6A837A9A85D877` | `raw/_parts/_rejected/airLight3_v14_A.png` |

Part A call 1 failed because six reference files exceeded the tool's five-file maximum. Call 2 used the five approved/model references (model sheet, expressions, idle, jumpFall, airLight2); frame order and the v13 pose plan were specified in the prompt.

## Part B — poses f4-f5

| Call | Result | Returned image path | SHA-256 | Filed path |
|---:|---|---|---|---|
| 1 | Selected for v13 stitch | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-db05d649-17eb-4463-a59f-87efbdf258a3.png` | `AA7B4C305B8718352CBF9BC850D69CF98F299ABC57FEEF0B7CE2D4B2027D6631` | `raw/_parts/airLight3_v13_B.png` |
| 2 | Selected for v14 stitch | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-b6df21d2-e5d0-4622-88ab-b6d564d6105e.png` | `A910984E56471AD30FEBD9F0162B12DAB6D213022CFBC84594302058857DB6AC` | `raw/_parts/_rejected/airLight3_v14_B.png` |

## Stitch and packed evidence

v13 measured stitch factor was `.8829` (Part B scaled to 88.29%, ending 1.021 of Part A); strict pack failed because head was `.94` of idle while feet were `1.05`, a head/body drift. v13 is the closer head result and is retained at `raw/_qa_hold/airLight3_v13.png` for visual review only. v14 measured stitch scaled Part A by `.9024`; strict pack failed because head was `1.14` of idle while feet were `1.03`. v14 was rejected and its files moved under `_rejected`. Part A reached the three-call limit; no image in this batch passes strict pack, so B5 remains technically blocked.
