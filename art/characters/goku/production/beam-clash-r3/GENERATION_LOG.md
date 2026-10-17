# Goku `beamStruggle_v01` — generation and QA record

Status: **technical hold, raw only**. No production pack or approval claim.

## Call inventory

All calls used the imagegen tool under Luna medium direction. The three-call cumulative limit is exhausted. Full prompts and reference paths are preserved in `generation-call-inputs.txt`.

| Attempt | Tool call ID | Returned source | SHA-256 | Decision |
|---|---|---|---|---|
| 01 | `call_0b73139b56574231939bd49a1cfd5575` | `exec-e24a3e24-78ad-48ac-bb1f-f2c6d44b09e3.png`, 2172×724 | `EC2122479AA2155A12FB810F04D81F5793264BF9785A478CEF334A67FDC1452E` | Discarded; frame 2 arm/body anatomy and loop less clear |
| 02 | `call_ef7231793395490baa96f5b14621d868` | `exec-cc185dcc-e83a-46b8-af95-87b877b0f4d8.png`, 2172×724 | `A41481D130CCAC3D187864603DED9115057A5DC70D5AFC20C1CD0C6581C34A4E` | Discarded; less deep lunge and weaker loop |
| 03 | `call_558663b69d644a799bd65d7b01fd9b7b` | `exec-f2459449-2aad-4f8e-97c3-6789062ac60c.png`, 2172×724 | `9035EBC7B62956461469954A0ABCFA3C5CFA26FC110D76877FBC79BD551A3E98` | Selected for review; deepest lunge and clearest braced loop |

Call times from this agent's session log (UTC): 2026-10-17 23:03:17 / 23:03:43 / 23:04:12; outputs at 23:03:39 / 23:03:59 / 23:04:34. Agent session ID: `01a14c1a-5c41-7e02-aad0-448e49d29dc0`. Selected source is preserved byte-identically at `raw/_qa_hold/beamStruggle_v01.png` (SHA above). The wrapper-emitted 2048×683 payload is preserved at `generation-source/beamStruggle_v01_attempt03.png` and in the review gallery (SHA `B0D6379DD5AEA8050DA172E07E03167A1C527A7107CDF670753C19C8A07CD6D5`). The outputs are distinct dimensions and no pixel-identity equivalence is asserted.

## References and prompt

The call inputs attach the approved Goku `reference/idle_approved.png` and `raw/beamFire_v07.png` pose reference. The latter's manifest marks v07 approved but its sidecar labels it technical hold; it was used only as the assigned pose reference. All prompts and exact paths are in `generation-call-inputs.txt`.

Prompt objective: exactly three ground poses in one row, Dragon Fist push/strain/surge, empty forward fist, right-facing, no VFX, no flight, no extra character. Attempt 03 used concise rephrasing of that same objective.

## Round 4 calibration and QA (2026-10-17)

The candidate remains **technical hold, raw only**. The initial 233 copied from `beamFire_v07` was a bad lunge assumption. Landmark comparison supports a diagnostic `bodyHeight` 205 (factor 0.338), and the official Goku manifest records 205, but this is not a certified manual scale pass. The raw source remains in `_qa_hold`; only isolated scratch outputs were packed and copied to the public review page. No official atlas was changed.

- Strict diagnostic command, isolated scratch root and result are preserved in scratch `round4/strict-pack-205.log` (SHA-256 `A5C510A27A675BF43523A1785E86B31247FEF7571D8B79556576D9A12FAE9E11`). Exit 1: packer reports `1 ref, 22 manual, 1 unmeasured`; Goku's known-unreliable automatic head probe has no version-bound manual pass. It writes no candidate sheet/frames. It also reports frame 2 right clipping by 1 px. This is a strict-gate failure, not a pass.
- A non-strict scratch quantized 48-color diagnostic snapshot is in `public/reviews/beam-clash-r3/goku-atlas-205-diagnostic.png` (SHA-256 `991182A67FE71939373DB9758348465141F8C09EBED8264D7185E0A0DAC7140B`) and its animation metadata is beside it (SHA-256 `D7FFAEACF6EB6DD07C871DE3FD193CDADEA8AC49253D385B9C41B5A6A1FE1F0D`). Neither is a production pack.
- Version-bound equal-density landmark measurements, uncertainty, references, contact deviation and the independent Astra anatomy hold are recorded in [`MEASUREMENTS.md`](MEASUREMENTS.md). Head/boot evidence does not support solving the uncertainty by shrinking; torso/shoulder construction remains a separate drawing concern.
- Diagnostic body sheet (`goku-body-205-diagnostic.png`, SHA-256 `BB52890E861BF078DD3478B28FEEFFEEBFC09F8BF949AB4BCFFE2A564A0CECC6`) uses a custom scratch-only 18-shade orange palette because Goku has no declared `bodyColors`; its B values are advisory and not a canonical body sheet.
- No scale report or strict passing atlas exists. No user approval exists. Do not move the source out of `_qa_hold` or promote the diagnostic atlas.

The generation calls were launched under this agent's exact worktree and captured in its session. This call-to-emitted-file mapping is recorded from the retained call order, output paths and session log; the tool wrapper emitted a resized payload, so reviewers should consider that transformation when evaluating source binding.
