# Constrained calibration screening — not a pixel pass

2026-10-16. All factors below use one uniform scale across each original strip. Source drawings inspected earlier are complete. Fixed 237px packed height and 248px safe width constrain feasible factors; they do not define anatomy. The allowed interval comes from independent collar/belt/boot measurements against idle. Final every-frame visual review can still reject a mathematically feasible factor as systematically undersized.

Exact calculations for run/light3/light4/heavy/airHeavy are in CONSTRAINED_SOURCE_INTERVALS.json, from preserved sidecar source bounds and measured lengths. Using only target uncertainty and treating source lengths as exact:

| Strip | Common body interval | Capacity upper | One diagnostic candidate | Qualification |
|---|---|---|---|---|
| run |.59891–.68349|.58955|.589|Requires documented source endpoint uncertainty. Parent authorized one lower-confidence diagnostic; 4.2% below central.615.|
| light3 |.51586–.61787|.50000|.499|Requires documented source endpoint uncertainty. Parent authorized one lower-confidence diagnostic;12.1% below central.568. Systematic small body is a real audit risk.|
| light4 |.63932–.70132|.65289|.652|Inside all three target intervals even with exact source lengths;5.2% below central.688.|
| heavy |.60014–.70376|.60000|.599|Central lower interval misses capacity by0.023%, negligible relative to measured endpoint error;10.1% below central.666. Visual undersize risk must be inspected.|
| airHeavy |.56942–.62131|.57385|.573|Inside all three target intervals with exact source lengths;8.6% below central.627.|
| getup |.4980–.5984|approximately.533|.532|Torso37.74,belt35.13,boot42.41; all direct target intervals. Worker reports new11 max237 and zero loss.|

For run/light3, even source LENGTH uncertainty±8px (narrower than two uncertain endpoints) permits the proposed constrained factors; this establishes feasibility, not precision. No further factor iteration is proposed after this batch. Calibration uncertainty is not evidence that new source art is necessary.

## Other complete-source placement checks

- airLight1 preserved05 sidecar: maximum source439h/418w. Factor.539 predicts torso37.94,belt32.88,boot43.15 from independent lengths70.385/61/80.05, within target intervals; outputheight237,width226. Prior arm cut arose after packing/anchoring despite zero raw source loss. Measured horizontal frameOffsets can preserve the full width.
- launched07: factor.258 yields approximately218x200 from complete source bounds, zero raw source loss. The old head-left cut is a horizontal pivot/anchor issue, not missing drawing. Corrected final pixels still need anatomy review; reclining torso projection is uncertain.
- special03: max source397h, old.628 cut hair. Factor.596 yields torso34.71 and boot43.34 from58.241/72.719, both within target uncertainty; max237h, width221. Only two visible measures, lower confidence than three-landmark cases.
- win04: source563h, old.444 yields250h. Factor.420 predicts torso35.37,belt34.44,boot41.19 from84.21/82/98.06, all within target intervals; max237h. Source fist/hair is complete. Uniform constrained calibration is plausible, not proof of exact density.
- light103: max source618h at.385 yields238. Factor.383 yields237, a sub1% change from previously supported body geometry. Preserve source A/B relationship and review both halves; do not let total height alone certify the part change.

## Charge

Original combat f1 local collar(263,214)→belt(235,318)107.7, belt(187,316)→(279,318)92.0, rear boot(81,551)→sole(47,663)117.05; endpoints±8–10sourcepx. Boot-derived.373354 predicts torso40.2,belt34.3,boot43.7 within idle uncertainty. Parent-authorized sequence1,2,3,1 retains four canonical durations; Luna independently annotated marks and reports charge05 max237/zero loss. Needs actual palette/sequence audit; no design approval.
