# Naruto Part 1: independent pre-calibration check

**HOLD. Existing evidence does not justify a mandatory redraw of stagger06, taunt07 or win08. Preserve their two remaining round-4 calls until Claude supplies a calibrated atlas.** This is an independent visible-marker check of f0, not a repeat or replacement of the immutable full-frame audit. No art, manifest, calibration, runtime or production output was changed.

## Exact inputs

Candidate sheet SHA-256 `0496c7aae6da74b5611e8cab204d193d7de865d1bf09589eac20ed52ed3578a2`; anims JSON `28e28ad9c9d859d9875b3d137322d7730a1933e166a9afe4623b9bb9ed40439b`. Reference hashes and native coordinates are in `pre-calibration-evidence.json`. Inspected exact approved neutral/combat cells, candidate idle07, and stagger06/taunt07/win08 f0 at nearest-neighbor 3x. Source generation provenance/budgets remain the worker inventory; this check generated no art.

## Independent marker evidence (native pixels)

| Input | Hair crown–chin H interval | Collar–hem T interval | Visible profile shoe S interval |
|---|---:|---:|---:|
| approved title neutral | 37–41 | 48–55 | 25–29 |
| approved title combat | 35–40 | 36–42 | 24–28 |
| approved idle07 f0 | 37–41 | 36–42 | 25–30 |
| stagger06 f0 | 48–52 | 44–50 | 33–37 |
| taunt07 f0 | 45–49 | 42–48 | 29–34 |
| win08 f0 | 44–49 | 41–47 | 25–30 |

These are manual endpoint intervals, not statistical confidence intervals. H includes styled hair; it is not skull height. Collar position and jacket projection create additional anatomical comparability limits. The neutral jacket is visibly more extended than the crouched combat/idle jacket: direct corresponding marker coordinates give approximately 50.5 px versus 38.5 px. Consequently, the former stagger torso/idle ratio proof demonstrates a projected-marker difference, **not by itself a robust physical torso-length defect requiring redraw**. Existing narrower ±2 garment marker uncertainty does not cover this pose effect. A standing candidate should also be compared to neutral, while bent/guard poses need combat/idle. Do not require identical torso projection in those different poses.

Stagger's hair-inclusive head and shoe remain clearly larger at present packing: favorable ratios to idle are 48/41 = 1.171 and 33/30 = 1.10. Taunt head favorable ratio 45/41 = 1.098. Win head 44/41 = 1.073 is only slightly beyond the gate and has hair/pose ambiguity; do not base a mandatory redraw on that small excess. These observations establish a calibration problem, not an unavoidable internal-proportion contradiction. Shoes depend on foot yaw; the comparison uses the visible profile foot, not the near-frontal foot.

No new precise arm/leg chain is claimed. Garment-hidden shoulder/elbow/wrist and hip/knee/ankle centers retain the original ±12 px chain uncertainty plus stated foreshortening exclusions. All inspected figures are three-quarter; frontal shoulder-width comparison is excluded. Unmeasured segments remain HOLD.

## Does the existing all-frame table prove a scalar cannot work?

No. Applying each original measurement's published uncertainty before the ±6% test gives nonempty necessary-feasibility intersections across all listed frames and H/T/A/L/S constraints:

- stagger06: k approximately 0.688–0.902.
- taunt07: k approximately 0.732–0.942.
- win08: k approximately 0.814–0.942.

Formula for candidate interval [c−e,c+e] and baseline [b−e,b+e]: possible k = [0.94(b−e)/(c+e), 1.06(b+e)/(c−e)]. Detailed per-frame constraints are in JSON. These broad intervals are only a conservative necessary-feasibility screen. They are not recommended scale factors, not a guarantee that correlated endpoints admit a single solution, and not a technical pass. Nominal empty intersections reported by Luna are useful calibration diagnostics but do not prove a residual anatomy defect under current uncertainty. Adding honest pose uncertainty cannot make that proof stronger.

## Action for Claude and next audit

Claude should choose the normalization interpretation against both exact title cells and approved idle07, state whether it changes quantized atlas scale or only runtime rendering, and provide an immutable changed atlas/JSON with hashes. A runtime-only adjustment leaves these pixel measurements unchanged. Preserve offsets/hitboxes/bodyHeight ownership. Do not use full posed bounding height as a target.

Then Astra rechecks every affected frame and loop, including separate upper/lower limb segments wherever visible, H/T/S and frontal shoulders when available. Establish a residual failure with comparable visible markers after normalization before spending a remaining named redraw call. If a residual defect is robust, specify that segment and pose; otherwise keep it HOLD. Retained jumpUp06/superDash03 remain under their original uncertainty/foreshortening exclusions; this check supplies no new redraw trigger for either.

No corrected preview or final certification exists yet. Claude acknowledgement/calibration and the changed atlas remain pending.
