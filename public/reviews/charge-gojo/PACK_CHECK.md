# Gojo charge v08 producer repack check

Date: 2026-10-19. Branch `art/charge-gojo` was fast-forward merged with main at `7706db2f` before the pack attempt; `tools/pack-sprites.mjs` includes ENG-117 `loopFrom` support.

## Strict attempt

Command: `node tools/pack-sprites.mjs gojo --quantize 48 --keep-palette --no-writeback`

Exit code 1. The packer analysed 54 animations / 254 frames and refused to write the Gojo character atlas because charge v08's head scale is 0.89 of idle (feet 1.00). The existing approved public atlas stayed unchanged during the strict attempt. The candidate also triggered source warnings: background `#17002e` instead of `#FF00FF`, one frame clipped at the left edge by 29 px, and 159 specks removed. The frame detector did not recognize six separated poses without whole-figure grouping.

## Diagnostic-only pack and audit binding

For inspection only, the Gojo character's `scaleGate` was temporarily set to `warn`; the pack used the same quantization and palette options. That temporary override was removed immediately after inspection. It produced six charge cells at indices 115–120 with durations 70/90/110/110/110/110 ms and `loopFrom: 2`.

The warning-mode atlas SHA-256 is `6083cfe0ad268a54fc12b31a9065a61fcd8ff8660987b36631df8be05c2f25cb`; metadata SHA-256 is `dc49bf8d13be89c33780c5dad1beb6cdca2cb99892ba72a750db02680122da09`. Both exactly match the atlas and metadata hashes in `ASTRA_AUDIT.md`, so the Astra report applies to these extracted cells. The warning-mode public character outputs are restored before handoff; they are not included as shipped output.

## Loop and scale summary

The 2x registration sheet and body sheet are extracted from the quantized diagnostic cells. H values are `[0.886, 0.909, 0.871, 0.886, 0.864, 0.909]` (median 0.886); B values are `[0.760, 0.819, 0.816, 0.816, 0.820, 0.818]` (median 0.817). The loop is not registered: f2/f4 main soles are y240, while f3/f5 are y222. Do not describe warning-mode packing as acceptance.

No game lab or in-game playback of v08 was run because the candidate cannot pass the strict pack; the review GIF uses the packed candidate cells and exact manifest timings. Current in-game preview continues to use approved v07.

## Six Eyes glint anchor request

Packed f2's head is turned and its eyes are hidden by the blindfold. The best projected eye-centre estimate for Claude's glint target is **cell `(130, 72)`**, with about ±2 px uncertainty because the eye itself is not visible. This coordinate is version-bound to v08 and should be remeasured if its packed registration changes.
