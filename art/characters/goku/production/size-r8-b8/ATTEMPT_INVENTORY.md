# ART-SIZE-R8 B8 — Goku run attempt inventory

Target: `run` v10, correcting the oversized hair-and-face head to the approved idle size while keeping the current adult body scale, eight-frame gait, frame order and 60 ms timing. Approved model sheet v02, idle v02, title-style draft v02 and title-style lineup v02 define identity and anatomy; run v09 is pose and timing guidance. Do not change bodyHeight, packScale or gameplay timing.

## Generation calls

| Call | Returned image path | SHA-256 | Filed path | Selection |
|---:|---|---|---|---|
| 1 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-9c867c00-f769-4dd9-8a99-b9263b2cd9da.png` | `0E4E37E2513C70169D6B853139E4D0A571DA7342F33328E3DAE40988C1EAAA29` | `attempts/run_call01.png` | Not selected: packed at x0.588; frames 3/4 clipped 33/27 px; head probe is disabled for Goku and no version-bound manual comparison existed. |
| 2 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-26ab8227-bfa1-4f61-b755-fd02bcaca0ec.png` | `8895B556CE1526905D52BDA22292B8A472404E9D613E227BF6B01AF27898C6ED` | `attempts/run_call02.png` | Not selected: packed at x0.611; frames 3/4 clipped 36/32 px; Goku's head still required manual review. |
| 3 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-1de2dc0a-fd3c-4064-a9da-cea725e3e632.png` | `B2FED70381002B8D00EA19181ECE1542DB3F7DADE33305D6C2CDFBF8B936B20B` | `raw/run_v10.png` | Selected for user review after packed comparison. It preserves the gait and matches the approved idle head visually; measured frameOffsets [16,0] and [7,0] on frames 3/4 at strip scale 1 remove clipping (actual +15/+6 at fighter packScale 0.92), with no rescaling. |

## Packed evidence and limits

The 48-color comparison board is [run-v10-compare.png](../../../../../public/reviews/size-r8-audit2-goku-b8-b11/run-v10-compare.png), SHA-256 `B759965AB2E785C3F7D7668D67AB0D31D8B492D4031A145F330C225D16EB6F5A`. It shows approved idle f0, title-style neutral/combat, prior run v09, and all eight candidate frames at one 256x256 density.

The automatic Goku head probe is disabled by TOOL-GOKU-PROBE. The required version-specific manual comparison judged the head and visible body landmarks consistent with the approved references within an estimated 6-8 px pose/rotation uncertainty. The body-sheet proxy reported B=.67, but its configured body palette omits `#c84e0e`; that advisory number is not treated as a reliable measurement. The manifest carries the manual scale record and keeps the final Astra audit and runtime contact as separate holds. User drawing approval is pending.
