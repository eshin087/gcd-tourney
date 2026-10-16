# Relay 11 light3 call preflight

Status: exactly one call completed after parent go; cumulative call 6. No retry. The call succeeded and exact output was captured; generation is not drawing approval. See light3_v12_call_receipt.json and raw sidecar.

- Worktree: `.worktrees/art-goku-core`, branch `art/goku-core`, HEAD `13e15bc7`.
- User decision via Claude relay #11: “Goku luffy retry”. Scope is exactly one additional Goku light3 image call; compact articulation is allowed while preserving the light3 front-kick move, timing, design and anatomy.
- Existing light3 calls: 5 cumulative (four initial calls plus relay #9 call 5). Relay #11 authorizes call 6 only.
- Version inventory: `light3_v01` through `light3_v10` are preserved sources/candidates; `light3_v11.png` is the held 256px assembly and `light3_v11_roomy_280.png` is its complete 280px companion. Highest root `raw/`, `_parts/`, `_qa_hold/`, `_rejected/` and `REVIEW_ROWS.md` version is v11. Reserve `raw/_qa_hold/light3_v12.png` for the exact new generated source and `raw/_qa_hold/light3_v12.json` for its provenance sidecar. Any later measured assembly must use the next free version, never overwrite v12 or v11.
- Failure being addressed: the uniform-density .62 v11 assembly's extended kick creates a 263px source/body extent at f4 and the 256px diagnostic loses 800 foreground-mask pixels. The complete v11 roomy companion remains preserved. The new prompt explicitly articulates a compact stomach-height forward kick and bent-knee retraction; it does not scale only f4 or fit each frame to its bbox.
- Canonical count/timing: seven frames; one-shot; phases 2/2/3; durations 40/35/45/60/60/60/30 ms. Sequence follows the supplied canonical description: guard/weight shift, knee chamber, two-frame stomach-height extension, retract to bent knee, plant, return to guard.

## Exact reference inputs (5 total; maximum permitted)

All four approved identity refs were inspected at native resolution before this preflight. The fifth input is the exact current light3 v11 held candidate's full 280px companion, visually inspected alongside the cropped 256px diagnostic. It is for pose/phase continuity only; its density is not authoritative.

| # | Absolute path | Role | Dimensions | SHA-256 |
|---:|---|---|---:|---|
| 1 | `art/characters/goku/reference/title_style_draft.png` | Approved title-style neutral/combat scale and style | 512x256 | `F7AE672771E9282F31E7804B02BB3F0ED46488618EFD6050A4B864B2203DEA42` |
| 2 | `art/characters/goku/reference/model_sheet.png` | Approved identity, outfit and silhouette | 1536x1024 | `C0A197C11B409D3D916078FB8577D09F3C0597B6F9875F7F7DA0CC31873A985D` |
| 3 | `art/characters/goku/reference/expressions.png` | Approved face and expression continuity | 2172x724 | `0E71CE3E4083AD6A2CB5BC0C89F2545A94B9C6EA97AB164F93C9DE12F97A845A` |
| 4 | `art/characters/goku/reference/idle_approved.png` | Approved idle anatomy and actual body/pixel density | 2048x256 | `57FBBD3CB99FC92A30DAFDD478479971E4E9D497E035C846E9FD28ECB126FE03` |
| 5 | `art/characters/goku/raw/_qa_hold/light3_v11_roomy_280.png` | Exact held light3 v11 complete sequence; phase continuity only | 1960x280 | `896144629B1ACF6EB07EF6CE235E1744729A8556D50D4586967A1EBC65B49A8C` |

Prompt: [light3_v12_prompt.txt](light3_v12_prompt.txt).

## One-call source capture plan (execute only after parent go)

1. Make one built-in `image_gen` call with exactly the five paths above, in listed order; do not call a CLI or issue a second tool call for an alternate.
2. In the same `functions.exec` invocation, immediately `store()` the complete tool receipt, inspect only non-image metadata, and record the exact returned `output_hint` path, call ID if present, invocation/completion UTC timestamps, and prompt/reference hashes. Do not print image base64 or search for recent files.
3. Hash and inspect the PNG at that exact returned path directly. Copy only that path to `art/characters/goku/raw/_qa_hold/light3_v12.png`, then verify copied SHA-256 equals the source and write `light3_v12.json` with receipt attribution, dimensions, prompt hash, five input paths/hashes/roles, and cumulative call 6. Never infer the result from a global-newest lookup.
4. If the built-in tool returns no usable image or fails, record the failed call against cumulative attempt 6 and stop. No retry under relay #11.
5. After capture, send parent the exact output path, call receipt, prompt hash, source hash/dimensions, then wait for the assigned Astra source and quantized audit before any manualQA/public adoption.

## Captured source

- Exact tool path: E:\Vibe Coding\.codex\generated_images\01a14385-47eb-7ba1-b7aa-f23c5e205115\exec-f9edf1af-877a-4eb7-87fd-8d9c7e0853f5.png.
- Saved immutable version: art/characters/goku/raw/_qa_hold/light3_v12.png; 1659x948, 1,533,006 bytes, SHA-256 C2320840541EF2B9A9EBD5919F632BF40F733092CE2C2DDCD54F37467447DCB1.
- Invocation/completion: 2026-10-16T12:12:23Z / 2026-10-16T12:12:44Z.
- Returned output_hint and full tool result were stored immediately. The tool response exposed no provider call ID; no global-newest lookup was used.
- Source remains on technical hold. No scaling, assembly, manualQA, gallery or public atlas adoption is represented as passing.

Prompt SHA-256: `3DA0AF5ECA9E556556BD5D760E800CD3D0F5AB2BA504BBD03B3DBE5AAAFAB096`.
