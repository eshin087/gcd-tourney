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

## QA and holds

- `bodyHeight` remains 233, the first guess copied from approved `beamFire_v07`; no anatomy-led measurement validates it for the lunge.
- `node tools/pack-sprites.mjs goku --quantize 48` at this value failed strict scale/clip validation and wrote no candidate atlas or frame images. Reported right clipping: f0 11 px, f1 12 px, f2 18 px. The raw strip was moved to `_qa_hold` so the packer skips it.
- No later body-height reductions are used. Head, torso, limbs, clothing volume and equal-density comparisons must be measured against approved idle and title-style combat cells before choosing another value.
- Goku's automatic head probe is known unreliable; no numeric result from it is claimed. There is no version-bound manual scale QA.
- Per-frame front-knuckle positions remain unmeasured. No hitbox override has been added.
- No scale report, body sheet, packed frames, strict passing atlas, Astra final-atlas audit, or user approval exists for Goku v01.

The generation calls were launched under this agent's exact worktree and captured in its session. This call-to-emitted-file mapping is recorded from the retained call order, output paths and session log; the tool wrapper emitted a resized payload, so reviewers should consider that transformation when evaluating source binding.
