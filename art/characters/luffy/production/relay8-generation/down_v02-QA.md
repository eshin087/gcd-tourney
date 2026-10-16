# Luffy down v02 candidate — relay #8

Status: candidate is frozen for independent Astra inspection. **No scale/manual QA pass, art approval, or gameplay approval is claimed.**

## Provenance and exact files

- Candidate: `art/characters/luffy/raw/down_v02.png`, SHA-256 `09c67ad0b61621ad5beb32d9ac552be30d2f26939f3474205c60b5b9d3dc0479`.
- Sidecar: `art/characters/luffy/raw/down_v02.json`.
- Immutable returned source: `art/characters/luffy/production/generation-source/down_v02_call02_returned-source.png`, 1,422,473 bytes, SHA-256 `8eeafecc703c1b83d018dbb8dd486e7ab3aa5e21b25ae642deab9aed5cc3d1c3`.
- Preserved frame 0 comes from held `raw/_qa_hold/down_v01.png`, SHA-256 `c96ea9a5be693933d55870841110d43d45154e1291f0125c8c1e5a431156220f`; complete source component box `[157,298]–[759,640]`, 603×343. Its cropped RGBA bytes are hashed in the sidecar; no resize or pixel edit was made to that crop before assembly.
- Generated frame 1 whole figure box is `[258,389]–[1277,909]`, 1020×521; its full source SHA and exact returned path are in `down-v02-call02.md`.
- Frame 1 was nearest-neighbor resampled once at factor `0.46` to 469×240, using a provisional hat-brim span estimate (~180px in old f0 vs ~395px in returned f1; uncertainty ±0.04). Frame 0 remains byte-exact content. The two figures are translated onto a shared floor baseline; no pose-specific fit after this source-density alignment.
- Packer common scale for the assembled 2-frame source is `96/341 = 0.28152` (candidate f0 max visible height 341px after exact alpha/background cleanup; manifest bodyHeight 96). The recorded sidecar bodyHeight remains 96, unchanged from the existing move spec.

## Measurement limits

The brim estimate is not enough to establish body density: brim span changes with pose and perspective. Astra interim cell measurements on the frozen candidate show f1 exposed shin ~33.2±4px versus idle52.8±6 and torso27.8±5 versus41.5±6; preserved f0 shin is ~48.2±5. Astra source-crop screening estimates f1 neck-base `(261,279)` to sash `(371,432)`, 188.4±12px, and exposed upper shin knee `(700,239)` to ankle `(874,435)`, 262.1±12px. These imply direct B source-to-native factors near .220 and .201, supporting ~.205–.210 before checking head/hat and upper-arm breadth. The frozen B has net factor .46×.28152=.1295, explaining its undersize. This interim finding is a technical HOLD, not a final report or pass. Candidate bytes stay frozen while Astra completes review; only a later immutable deterministic assembly version may use a corrected measured factor. Astra screening estimates direct source-to-native factors of 0.220 for torso and 0.201 for shin, supporting a provisional 0.205–0.210 range. This still requires endpoint confirmation and head/hat and upper-arm checks. A later v03 must preserve f0 native density and derive compatible bodyHeight; do not let existing bodyHeight 96 shrink both frames.

Frozen candidate cells in `production/relay8-generation/diagnostic-atlas/`: f0 bounds x53–221, y145–240; f1 x59–190, y174–240. Both are inside the cell and the baseline is y240 in the diagnostic transform. These are diagnostic placement observations only, not proof of anatomy or grounding.

## Attempt and pack status

Generation call 2/3 was used on 2026-10-16; exact prompt, approved input hashes, tool-returned filename and times are in `down-v02-call02.md`. No retry is authorized this round. `node tools/pack-sprites.mjs luffy --out art/characters/luffy/production/relay8-generation/diagnostic-public --no-writeback --quantize 48 --json` was run isolated and exited 1. It refused to write because down and getup require manual review of low-confidence poses; report lists `wrote: []`, `writeback: []`. The source public gameplay sheet/anims were not the output target and were not changed.

The frozen `diagnostic-atlas/sheet.png` is a candidate-only 7-cell fixture built from packer-exported background removal, figure splitting, resampling, placement and palette-quantization helpers. It is explicitly not a normal full gameplay pack, and its quantization palette may differ from a later full atlas. Astra must bind any finding to the exact fixture hash in its metadata.
