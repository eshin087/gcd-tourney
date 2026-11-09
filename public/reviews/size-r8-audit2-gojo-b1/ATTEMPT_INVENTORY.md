# ART-SIZE-R8 B1 — Gojo light1 attempt inventory

Seven-frame redraw; approved head and idle build, right hand pocketed, phases, durations, facing and floor placement retained. Approved identity inputs: reference/model_sheet.png, reference/expressions.png, reference/idle_approved.png.
- Attempt ceiling: Part A 3/3 calls; Part B 2/3. No further call is authorized under the current budget.
- All calls requested hard pixels on flat #FF00FF, right-facing 4+3 frames, preserving the established light1 pose sequence.

| Part/call | returned image | SHA-256 | filed source | filed SHA-256 |
|---|---|---|---|---|
| A v06 | exec-94ada990-7f91-4017-a884-e653ca334a30.png | 5EF49F33763FB957A784BD4DC15D8A2C1C49BBD2FDEBE67C3CFC932B55E88091 | raw/_parts/light1_v06_A.png | 5EF49F33763FB957A784BD4DC15D8A2C1C49BBD2FDEBE67C3CFC932B55E88091 |
| B v06 | exec-48876c2e-b13b-4ca6-a81f-7644ab57992d.png | FF01794775AD9A524B0ABEC7691E18EB2217AAFD9A4005883D589F4C202C3C08 | raw/_parts/light1_v06_B.png | FF01794775AD9A524B0ABEC7691E18EB2217AAFD9A4005883D589F4C202C3C08 |
| A v07 | exec-96883b34-cc19-4630-b3ad-dd0ebb99c917.png | 85CC120B28B8BE790A035C1B54E54B7EA8C66C56C6E005855C2F69C53F15D0F6 | raw/_parts/light1_v07_A.png | 85CC120B28B8BE790A035C1B54E54B7EA8C66C56C6E005855C2F69C53F15D0F6 |
| B v07 | exec-940b3538-2aa3-4c6c-842c-8cc523b37ab0.png | E1D6C10B45E1C3B2EBE7876BFBC3A32A9ABF90D444F7EAFC183BAD88F2D2EFE3 | raw/_parts/light1_v07_B.png | E1D6C10B45E1C3B2EBE7876BFBC3A32A9ABF90D444F7EAFC183BAD88F2D2EFE3 |
| A v08 | exec-fe6fdeaf-335b-4774-9258-50d12612d7db.png | F2E74E6E6AB2AEC195EE06788EF3A435874AECB4FE078A49CCCFC7A2E6F8D20D | raw/_parts/light1_v08_A.png | F2E74E6E6AB2AEC195EE06788EF3A435874AECB4FE078A49CCCFC7A2E6F8D20D |

Part B for v08 is byte-identical to v07_B, reused to preserve the measured stitch and stay within the Part A correction budget.

## Stitch measurements

| Version | A idleScale | B idleScale | measured factor | disposition |
|---|---:|---:|---:|---|
| v06 | 0.4180 | 0.2705 | 0.6470 | rejected before review: parts differ too much in body scale |
| v07 | 0.4102 | 0.4116 | 1.0034 | superseded before user review |
| v08 | 0.4075 | 0.4116 | 1.0099 | selected drawing candidate; packed with contact hold below |

## v08 packed evidence

- Quantized pack node tools/pack-sprites.mjs gojo --quantize 48 exited 0: 54 animations / 254 frames, 48 colors, complete. light1 is seven frames, v08; approved v05 remains the fixed approval.
- Scale gate: 1 reference, 45 auto-pass, 8 manual, 0 flagged. Head median 0.943; per-frame 0.914, 0.914, 0.943, 0.963, 0.955, 0.914, 0.943. Feet proxy median 1.110 (range 1.079–1.125).
- Body sheet B: 0.879, 0.904, 0.922, 0.911, 0.944, 0.946, 0.952; median 0.922, no strip flagged at the 12% advisory threshold. Area-based body measurement does not numerically certify individual limb lengths.
- Timing/phases unchanged: seven frames, phases [2,2,3], durations [30,30,40,50,50,50,30].
- Quantized atlas SHA-256: 93B73C1C7236FD23792EFE263D97D02431CA76A6C084B8C78D50019A819E9E67. Gojo-only scale report preserved as scale-report-v08.json.

## Technical hold: active contact position

Packed f2 hand/skin pixels x175–196, y55–73; f3 x179–191, y55–73. The animation brief requires palm x206–226, y64–86. The f2/f3 hitbox overrides match visible pixels ([174,54,24,21], [178,54,15,21]); extending gameplay boxes to the brief zone would create invisible reach. This is a contact-placement HOLD, not a scale-gate failure. Part A has exhausted three calls; a fresh budget or user-directed disposition is needed before correction.

No user image approval, Astra final anatomy/scale audit, merge, runtime contact pass or production deployment is recorded.
