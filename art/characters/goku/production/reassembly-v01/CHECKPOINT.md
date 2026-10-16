# Goku reassembly checkpoint

Date: 2026-10-15. This is a bounded calibration checkpoint, not completion of the 22-strip batch. No new generation, production pack, calibration-field edit, or approval change occurred. The parent recorded only newest-version metadata for guard v05, light2 v05, beamCharge v06 and beamFire v06; those version fields do not approve or clear any candidate.

## Provisional calibration pilots for Claude

- `guard_v05.png/json`: source `generation-source/guard_v04_attempt03.png`, SHA-256 `c1d19e09c37b55e9fbd08a31de0dea60e2ed23564eec1489f669f2f606b9a104`. Factor 0.282 ±0.030 was derived from source endpoints inverse-mapped from Astra's marked `native-control` candidate, so it is weaker than fresh direct source marking. Scale ratios use idle/source: torso 46/164=.280, belt 36/132=.273, boot 45/148=.304. Factor .282 is an approximate chosen value within that spread, not the exact median or a numeric pass. Two frames occupy 229px each without cell overflow. Treat as a calibration pilot, not a numeric pass.
- `light2_v05.png/json`: user-approved v04 drawing source `generation-source/light2_v04_attempt05.png`, SHA-256 `f9541b3fbabd570bf9db80152add3331d4b7753ff9f1bee52065683608e61753`. Approximate factor 0.613 ±0.075, based on frame-0 idle/source ratios: collar-to-belt 46/75=.613, belt width 36/58=.621, boot-top-to-sole 45/72=.625. Frame heights are 227–236px, with no overflow. Existing design approval remains; technical calibration and packed audit are pending. Source points are inverse-mapped from the prior candidate, with that uncertainty retained.
- Corrected one-scale pilot contacts are under `../scale-qa/reassembly-v01/guard-v05-contact.png` and `light2-v05-contact.png`. Earlier own-folder contact images without `v02` have the idle stride error and are superseded.

## Beam trials: preserve, quarantine, do not use as calibrated

Direct source annotations exist for frame 0 of both sources under `../scale-qa/reassembly-v01/`. The original is 2172x724, three 724x724 panels. Marks are approximate, projected endpoints. Eye-to-chin was estimated as 51px against a visually estimated idle 17px (.333) for beamCharge, and 50px against visually estimated idle 17px (17/50=.340) for beamFire. Left boot-top-to-sole was estimated 130px against an idle 40px (.308) for both. These two ratios suggest a midpoint near .320, but the idle endpoints were not recorded as exact coordinates. Therefore neither ratio nor their midpoint is a Claude-ready factor.

The immutable `beamCharge_v05` / `beamFire_v05` outputs used factor .292, which does not follow from the recorded ratios. Subsequent immutable v06 trials used .320, the arithmetic midpoint, but still lack exact idle endpoint provenance. Preserve both versions and sidecars as disputed experiments. Do not pack, select, or claim either as calibrated. Claude should first mark exact comparable endpoints on idle v02, then recompute or reject these estimates.

## Remaining inventory / work limit

The existing 18-row inventory in `REVIEW_ROWS.md` preserves selected source paths and current prior versions for run, dash, jumpUp, jumpFall, land, light1, light3, light4, heavy, airLight1, airHeavy, hurtHigh, launched, down, getup, charge, special and win. No new factors were derived for those strips in this checkpoint. In particular, several prioritize-able originals were inspected directly: hurtHigh v07 is 2172x724 (3x1); special v02, jumpFall v02, land v03 and down v04 are 1774x887; getup v03 is 1536x1024. This is source-layout evidence only, not a verified crop map or scale measurement. Keep their existing HOLD reasons and do not treat them as completed.

Claude's next action: verify the two pilot endpoint baselines against approved idle v02 and decide whether the factor method is sound; then review the disputed beam annotations and exact idle endpoints before scaling further strips. No scale-gate or design pass is claimed here.


Errata: `beamFire_v05.json` and `beamFire_v06.json` record the eye-to-chin ratio as .333 from 50px/17px. The correct target/source arithmetic is 17/50=.340. Their PNGs and sidecars remain immutable; treat both ratios and factors as disputed. `guard_v05.json` describes .282 as the median, but the recorded ratios have median .280. The saved factor remains unchanged and is only an approximate choice within the measurements' uncertainty.
