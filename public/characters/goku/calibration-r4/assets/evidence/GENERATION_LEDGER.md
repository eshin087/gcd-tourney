# Relay 9 redraw generation ledger

User decision relayed by Claude: one redraw call each for `light3` and `heavy`. Exactly two built-in image-generation calls were made, one per move. No retry was made.

The parent recovered the light3 tool receipt into [light3-call05-recovery-receipt.json](light3-call05-recovery-receipt.json). The receipt preserves the exact call ID, time window, output path, and recovery basis; this worker's wrapper had omitted the output hint.

| Move | Saved version | Exact tool output | Prompt | Cumulative call count | State |
|---|---|---|---|---:|---|
| light3 | v10 | Original returned path recovered by parent from the exact session and call window: `E:/Vibe Coding/.codex/generated_images/01a14385-47eb-7ba1-b7aa-f23c5e205115/exec-6d3092e3-d95a-403b-be2b-720d0031ff9f.png`; SHA256 `5079524DE75F308A6421F24D2B88B8BD57EBABCF407C0C9AB1A00CD78656DAB5`; dimensions 2172x724. Tool receipt `call_7be411bb614044019840315cd0f3b07e`, 2026-10-16 07:03:31.261-07:03:58.483 UTC. The original wrapper omitted the top-level `output_hint`; parent recovered this exact-session file based on the call time window and confirmed its seven-phase kick/guard sequence. This recovery basis is explicit; do not represent it as an output_hint captured at generation time. | [light3 v10 prompt](light3_v10_prompt.txt), SHA256 `49C8B6D1863B73D5249987C66CC937E582CF82BB085C0D002BC3BCC85EB734BB` | 5 total (4 prior + this call) | Preserved at `art/characters/goku/raw/_qa_hold/light3_v10.png`; technical hold; not atlas-ready or approved |
| heavy | v12 | Original returned path: `E:/Vibe Coding/.codex/generated_images/01a14385-47eb-7ba1-b7aa-f23c5e205115/exec-5f8bf7f8-3cb9-4340-a906-09d477d83f0e.png`; SHA256 `8789FFDCD3ECF07FCAB091896429FFC80A1524E7B3C0E7FD72F7B8072E17DA01`; dimensions 2172x724 | [heavy v12 prompt](heavy_v12_prompt.txt), SHA256 `175ABB5E0EEB8D3F7D3409B769A9FD6C277929BC2E2E1D960D6C250A752C0F7E` | 5 total (4 prior + this call) | Preserved at `art/characters/goku/raw/_qa_hold/heavy_v12.png`; technical hold; not atlas-ready or approved |

Both calls used the four approved Goku identity references and the exact held candidate as the fifth input. Reference hashes and roles for both calls are in their sidecars. The light3 call used `raw/_qa_hold/light3_v09.png` as its fifth input; the heavy call used `raw/_qa_hold/heavy_v11.png`. The approved references were title_style_draft.png, model_sheet.png, expressions.png, and idle_approved.png.

The heavy image is a single generated wide source, not yet a measured set of cell crops. No body scale factor, endpoint intervals, native `bodyHeight`, or manual QA pass is claimed. `heavy_v12` remains under `_qa_hold` until exact-density extraction, measurement, and the requested Astra audit. The actual public atlas was not changed.

Generation path sources (built-in imagegen) were outside the repository; both exact workspace copies are retained and versioned. Generation did not grant image approval.
