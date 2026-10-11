# Gojo full redraw visual QA — working evidence

All 42 source animations have been drawn. This is NOT full production completion or art approval.

## Reviewed contacts

Viewed every pose in idle, run, dash, backDash, superDash, jumpSquat, jumpUp, jumpFall, land, light1–4, heavy, airLight1–3, guard, block, hurtHigh, hurtLow, launched, spin, airRecover, down, getup, throw, beamCharge, beamFire, vanish, stagger, ko, special, intro, taunt, specialUp, specialDown and superPose. Charge, win, airHeavy and specialForward are correction holds pending final candidate measurement.

Diagnostic contacts use the current main packer helpers. Formal pack output remains authoritative; contacts alone do not certify a strip.

## Issues that head-only checks miss

- superDash v05: compact reposed torso/limbs read oversized relative to idle despite hair gate success. Three image attempts exhausted. Technical hold; do not ship.
- airLight3 v04: enlarged-head correction plus automatic fit compresses body relative to approved lean adult anatomy. A part has exhausted three attempts. Technical hold; do not accept the uniform-fit verdict as sufficient.
- airLight1 v03: x-overlap between extended palm and neighboring figure splits the hand into the next cell. Position offsets cannot repair a wrong split. Third attempt v04 re-spaces complete figures; inspect source and all five packed cells.
- charge v03–v05 and win v02–v04: head corrections overshot/undershot. Three attempts exhausted, no exemption. Keep best evidence and flag for further authorized work.
- Rotated spin/airRecover and transitional getup remain low-confidence automatic measurements. Visual limb continuity is plausible; independent landmark QA is still required before review-ready status.
- Idle B differs by several packed pixels in body height from A. Head consistency is good; show the complete loop for motion review rather than claim a perfect match.
- Down/KO source landmarks are inferred through hair (±8/±10 source px). Both use anatomical calibration; latest formal pack has no ground-contact warning. KO measured offset corrects left clipping without rescaling.

## Technical boundaries

No new strips are approved. No merge or production deploy is authorized for this worker. Claude remains sole integration coordinator. Remaining failed images are not converted into probe exemptions. The latest failed full-pack log is retained as pack-fixed-tool.txt.

## Browser and build checkpoint

Production build passed (79 modules). Local game on port5224 logged custom Gojo sheet with42animations; no console errors. The packed sheet contains37new candidates plus5explicitly labeled historical fallbacks. Browser review page loads all42sections and every packed frame. This is a partial review checkpoint, not a full-batch release.

Direct neutral comparison of idle PartA: inferred skull~67sourcepx versus neutral110; shoulder-to-hip~190–195 versus neutral~310 (expected189 at matching skull scale). Long leg silhouette and narrow adult torso remain consistent by eye. Knee landmarks under trousers carry uncertainty; loop B height caveat remains.
