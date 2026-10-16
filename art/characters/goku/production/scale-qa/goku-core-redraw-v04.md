# Goku core redraw v04 evidence

Date: 2026-10-15. One extra generator call per strip was authorized by the user for `light2`, `light3`, `light4`, `heavy`, `airLight1`, and `airHeavy`. `run` and `light1` were not changed.

## Attempt inventory

| strip | call | imagegen output id | retained source | processed native cells | result |
|---|---:|---|---|---|---|
| light2 | 4 | output path not captured | none retained | none | call counted; cannot inspect or file a candidate |
| light3 | 4 | `exec-1d74f2b4-f34c-4d76-9808-38a33168727b.png` | `generation-source/light3_v04_attempt04.png` (SHA-256 `6ac8c834982930f4ee24c43e8de3fda78d2ff84a28a1694c7ef5a3156f19d72c`) | `raw/_qa_hold/light3_v04.png` (SHA-256 `e6996334ca212f113de5130488c46e9dbc06d20f0ba02c68d0e7f6cef87a3b7e`), 1792x256, common transform x0.506329 | held |
| light4 | 4 | `exec-4e33cd2b-30e5-4e15-a2b4-ffb7b5250999.png` | `generation-source/light4_v04_attempt04.png` (SHA-256 `1a968ce8893d3217f122244227eb2fad9a9502e2a965c5e0ad832863063ca7d2`) | `raw/_qa_hold/light4_v04.png` (SHA-256 `8f23e78215a75687dafd28af0dfa0a53630014ba4b0db9173ee022500dc47dfa`), 2048x256, common transform x0.661157 | held |
| heavy | 4 | `exec-3e9030bc-25e3-4e7a-b0a0-548983b09504.png` | `generation-source/heavy_v04_attempt04.png` (SHA-256 `c7822c99040c120d564dbe76af54f9b9aa23dd2b4a9e799d99a5c21bfc0a3116`) | `raw/_qa_hold/heavy_v04.png` (SHA-256 `406981f37acc11ad4c9b985cfccaab85628f1f746815e7fc3816d84f154bdef6`), 2048x256, common transform x0.607595 | held |
| airLight1 | 4 | `exec-03e492f8-3d03-457d-910f-d5b5027ce573.png` | `generation-source/airLight1_v04_attempt04.png` (SHA-256 `1e18761c0c48cbe9b739a8d57adc3e701e018fa88291b12cf23986fe36b67305`) | `raw/_qa_hold/airLight1_v04.png` (SHA-256 `228b3af5c0602bcb04d8420639abb5ff480228f690b465518b10e044132b3e1a`), 1280x256, common transform x0.546697 | held |
| airHeavy | 4 | `exec-c16869c5-4d07-4d85-aea2-bff1850f643a.png` | `generation-source/airHeavy_v04_attempt04.png` (SHA-256 `39fc7ce748f4234f88b0d72631f5db9e9e0048e11dd6fa47f9760e7329def6e8`) | `raw/_qa_hold/airHeavy_v04.png` (SHA-256 `f68429ae403f0d1f91f9b332aff1f4cbfc624782d37e7589ba34653a31996bb3`), 1536x256, common transform x0.581114 | held |

The five retained source sheets are kept byte-for-byte in `production/generation-source/`. Grid-to-cells converted their unbordered panels to native 256px cells with one common scale per strip and aligned soles to y=240. Candidate cells remain in `_qa_hold`; they are never approved or packed into a shipped atlas.

## Strict packer dry-run

Command: `node tools/pack-sprites.mjs goku --quantize 48 --dry-run`. It wrote nothing. The partial report selected idle v02 and the five available v04 candidates, then failed the strict scale gate on all five:

| strip | automatic head-size range within strip (relative to idle) | clipping |
|---|---|---|
| light3 | f1 0.50 vs f3 0.74 | source figure reaches panel edge; no recorded packer clip warning |
| light4 | f2 0.50 vs f0 0.98 | f4 right 9px; f5 right 2px |
| heavy | f0 0.50 vs f1 1.13 | f3 right 10px; f4 right 11px; f5 right 13px |
| airLight1 | f4 0.50 vs f2 1.00 | f2 right 36px; f3 right 29px |
| airHeavy | f1 0.50 vs f0 0.63 | no recorded clip warning |

Five active frames also lacked a clear strike limb: `light3#3`, `light4#3`, `airLight1#1`, `airHeavy#2`, and `airHeavy#3`; the dry-run would use the packer's default front-body hit region. These remain QA findings, not manually approved hitboxes. No atlas exists for this batch, so the full atlas anatomy audit and PR preview remain blocked. Native-density comparison: [goku-core-six_v02.png](goku-core-six_v02.png). `light2` is shown at its last retained v03 in that comparison.
