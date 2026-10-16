# Reassembly r02 source inventory

Date: 2026-10-15. This is a source-level inventory, not an anatomy-scale pass. Astra’s conditional method pass applies to guard v05 and light2 v05 only. No factor is transferred to another source. Win v04 is now reassembled from three directly marked frame-0 source landmarks (factor 0.444 ±0.050) and remains on HOLD for 14px proposed top overflow. Charge has direct source-frame-0 endpoint marks, but the three resulting factors (.454 torso, .383 belt, .371 boot) disagree, so it remains a measured HOLD without a resample. Sixteen candidates still need direct source measurements.

The companion JSON gives exact source SHA-256, pixel dimensions and next free version. The contact sheet is a visual index, not measurement evidence: [source inventory contacts](../scale-qa/source-inventory-contacts.png).

| Animation | Source | Dimensions | Next version | State / reason held |
|---|---|---:|---:|---|
| run | run_v02_attempt04.png | 1774×887 | v05 | whole-strip/parts provenance needs verification; source endpoint marks pending |
| dash | dash_v03_attempt03.png | 1774×887 | v04 | crouched pose; direct endpoints not annotated; source endpoint marks still pending |
| jumpUp | jumpUp_v03_attempt03.png | 1774×887 | v04 | tuck/extension; landmarks not annotated; source endpoint marks still pending |
| jumpFall | jumpFall_v02_attempt03.png | 1774×887 | v03 | rotated airborne pose; landmarks not annotated; source endpoint marks still pending |
| land | land_v03_attempt03.png | 1774×887 | v04 | crouch/landing; endpoints not annotated; source endpoint marks still pending |
| light1 | light1_v01_attempt01_A.png | 2172×724 | v03 | part A/B mapping unresolved; source endpoint marks still pending |
| light3 | light3_v04_attempt04.png | 1254×1254 | v05 | detached hand/rear-arm source defect; source endpoint marks still pending |
| light4 | light4_v04_attempt04.png | 1774×887 | v05 | kick pose source/panel overflow; source endpoint marks still pending |
| heavy | heavy_v04_attempt04.png | 1536×1024 | v05 | detached fragments/overflow; source endpoint marks still pending |
| airLight1 | airLight1_v04_attempt04.png | 1536×1024 | v05 | strike-limb overflow; source endpoint marks still pending |
| airHeavy | airHeavy_v04_attempt04.png | 1536×1024 | v05 | tucked/rotated poses; landmarks not annotated; source endpoint marks still pending |
| hurtHigh | hurtHigh_v07_attempt03.png | 2172×724 | v08 | recoil arms overlap; endpoints not annotated; source endpoint marks still pending |
| launched | launched_v06_attempt02.png | 1774×887 | v07 | rotated pose/overflow; factor not measured; source endpoint marks still pending |
| down | down_v04_attempt02.png | 1774×887 | v05 | lying pose; landmarks not annotated; source endpoint marks still pending |
| getup | getup_v03_attempt02.png | 1536×1024 | v04 | kneeling transitions; landmarks not annotated; source endpoint marks still pending |
| charge | charge_v04_attempt03.png | 2170×725 | v05 | loop snap persists; factor not measured; source endpoint marks still pending |
| special | special_v02_attempt03.png | 1774×887 | v03 | multiphase projection; landmarks not annotated; source endpoint marks still pending |
| win | win_v03_attempt03.png | 1263×1246 | v04 | hair touches panel top; panel integrity review; source endpoint marks still pending |

**Measurement requirement:** record source-frame coordinates and landmark definitions for at least two independent visible body landmarks, compute ratios against Astra’s approved idle endpoints, annotate the untouched source, and only then apply one uniform factor per strip. Preserve candidates with unreliable landmarks or source defects as HOLD.

- win v04: `raw/_qa_hold/win_v04.png`; measured factor .444 chosen; exact median .4456 (erratum); roomy candidate; proposed 256 top overflow 14px; HOLD.

- light3 v05: `raw/_qa_hold/light3_v05.png`; measured factor .530 chosen; exact median .5115 (erratum); source arm/hand defect; v05 raw clips 11 rows frame4; roomy companion; HOLD.

- light4 v05: `raw/_qa_hold/light4_v05.png`; measured factor .565 exact median of collar/belt; boot projection excluded; roomy candidate, audit pending.

- run v05: `raw/_qa_hold/run_v05.png`; measured factor .484 exact median collar/boot; belt screening excluded; roomy candidate.

- dash v04: `raw/_qa_hold/dash_v04.png`; measured factor .241 exact median three frame0 ratios; 2-frame candidate.

- jumpFall v03: `raw/_qa_hold/jumpFall_v03.png`; measured factor .452 exact median torso/belt; dangling boot excluded; 58/52px proposed top overflow; roomy candidate.

- land v04: `raw/_qa_hold/land_v04.png`; measured factor .253 exact median collar/boot; belt screening excluded; 2-frame candidate.

- light1 v03: `raw/_qa_hold/light1_v03.png`; measured factor .385 exact median of four belt/boot ratios across A/B; A attempt01 + B attempt03 mapping explicit; 2px proposed top-margin intrusion.
