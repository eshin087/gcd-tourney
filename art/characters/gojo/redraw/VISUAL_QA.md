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

## Final packed-atlas visual review (2026-10-11)

Re-extracted the actual committed atlas cells, rather than the stale frames cache, into contact/packed-*.png. airLight1 v04 now preserves the entire extended palm in both active cells; no neighboring-frame fragment is visible. specialForward v04 preserves the tall narrow torso and long legs across all seven cells, including the leaning pose.

Reviewed all four spin, three airRecover and five getup packed cells. Their rotated hair and hidden joints prevent a reliable upright hair-box comparison. Along each local body axis, the visible head, torso and bent limb segments retain plausible adult proportions; no obvious swollen head or compressed torso comparable to the rejected airLight3 correction is visible. This is qualitative evidence, not a precise landmark pass: trousers obscure knees and the tucked poses occlude hips. Keep those strips flagged for explicit visual review and do not use them as future scale references. No probe exemption was added.

The deployed preview of commit 01aa8b3 loads the gallery and atlas without browser console errors. Five technical holds remain excluded from approval instructions.

### Low-confidence gate classification

Current main scale-probe.mjs explicitly classifies jumpSquat, launched, spin, airRecover, down, getup, vanish and ko as low-confidence poses. Their Gojo verdict is `unmeasured`, even when the hair box yields a number. Thus “37 packed candidates” does not mean 37 numeric `ok` verdicts: the new set is one idle reference, 28 numeric-ok strips and eight requiring manual review. Their head ratios range from0.963 to1.194; spin's rotated hair bounding boxes cannot establish anatomical size. Qualitative review is not an exemption or a precise anatomical certificate. These eight remain a manual-QA prerequisite before merge readiness, alongside the five failed redraws. No threshold or exemption was changed.

### Consolidated low-confidence atlas evidence

`contact/packed-unmeasured.png` contains the exact committed atlas cells, in rows jumpSquat, launched, spin, airRecover, down, getup, vanish and ko. Every cell was reviewed at this checkpoint. JumpSquat and vanish preserve the long torso and limbs through knee flexion; launched keeps the body axis and limb volume between its two poses. Down and KO retain a long side-on silhouette and floor contact. Spin, airRecover and getup have heavily occluded hip/knee landmarks; their silhouette continuity is plausible but remains insufficient for precise bone-length certification. In particular spin's larger apparent hair mass remains a review concern. No numeric `ok`, probe exemption or art approval is inferred from this contact sheet.

### Spin v03 correction and anatomical diagnostic

An independent reviewer measured v02 source skull axes at approximately72/68/65/69 px (crowns under hair; +/-12–14 px uncertainty) and found no conclusive source skeletal compression. The diagnostic `contact/spin-axis-diagnostic.png` compares the earlier packed cells with that calibration; calibration alone does not resolve the fuller hair. A second generated attempt therefore reduced only hair mass against the approved neutral, preserving body and facial skull anatomy. Saved as spin_v03 with those independently measured anatomical axes, not a probe exemption.

The exact new atlas contact is `contact/packed-spin-v03.png`; earlier `packed-unmeasured.png` and `packed-spin.png` retain v02 evidence. V03's hair median is1.010 versus v02's1.194. Its rotated per-frame range remains0.135 and verdict remains `unmeasured`; the pose still needs manual review. All four packed cells were inspected: hair is more compact, limb/torso construction remains unchanged, no clipping. Full review-subset pack exits0 with the same five historical fallbacks and six documented legacy warnings. No new art approval or numeric-pass claim.
Latest local gallery verified42 sections; unresolved-QA filter shows13 entries (five technical plus eight manual). No browser console errors. Build passed79 modules after the spin correction.


Gojo visual approval (2026-10-11): user approved the latest selected full-redraw checkpoint; exact 42 versions are in art/characters/gojo/redraw/USER_APPROVAL.json. Five technical failures and eight manual-QA holds remain. Shipping manifest promotion is deferred; no gate baseline change, merge or deployment. Claude owns integration.
