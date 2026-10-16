# Relay8 initial diagnostic audit — down02/getup02

Astra, 2026-10-16. Both provisional versions remain **HOLD for measured reassembly**, not rejected source drawings. Special has no new candidate: authorized fourth invocation failed input validation before output and is counted4/4; old special01 remains held. No additional image call or design approval implied.

## Exact reviewed pixels

Candidate-only atlas1792x256/7cells/48colors: sheet SHA256 `fb8efd04a08d7c47c3ad2ce84ab07b01825cd163e2579af0d71dfab131dbca58`, metadata `efdc35842ced8d9a750eaa18d3b059f21b36361015676c1e27186a4dbef1953a`, under production/relay8-generation/diagnostic-atlas. All seven cells directly inspected and independently extracted; exact hashes in INITIAL_MEASUREMENTS.json. This is not a normal gameplay atlas or strict production pass.

Raw down02 SHA09c67ad0b61621ad5beb32d9ac552be30d2f26939f3474205c60b5b9d3dc0479; getup02 SHA94c7666ebc59f696a7acea845b2a64ee576af179310682ad4d087ee9125598d4. Preserve these versions when making corrected assemblies.

## Approved comparison

Exact prior approved neutral/combat/idle cells were reviewed. Idle neck-base→sash41.5±6px, exposed shin52.8±6, sash25±4, forearm32.3±6, sandal top→sole12.4±3. Title combat torso40.5/shin54.6; neutral43.1/59.1. These are projected visible segments with pose uncertainty, not universal ratios. Head/hat alone cannot determine body density.

## Down02: HOLD

- f0 preserves the original source crop as requested. Final visible shin approximately(168,198)→(204,230)=48.2±5, consistent with reference within uncertainty. Bent torso partly hidden by hand; no invented collar-to-sash pass. Head/vest/shorts/foot coherent. Bracing hand and sandal meet the support line; runtime contact remains Claude's.
- f1 complete new drawing is severely reduced by provisional .46 part normalization followed by common diagnostic scale.2815249: effective source→native about.12950. Final exposed shin approximately(146,209)→(170,232)=33.2±4; torso approximately(102,200)→(116,224)=27.8±5, both below reference. This is a real final-pixel density mismatch; compact pose width alone did not establish it.
- f0→f1 shows a body-size change in addition to the intended fall. No crop is visible, but fit is not anatomy certification. The source itself has intact hands, cuff/leg chains and sandals.
- Independently marked new-f1 SOURCE-CROP endpoints (crop1020x521, global original crop origin258,389): neck-base(261,279)→sash(371,432)=188.4±12; exposed knee(700,239)→ankle(874,435)=262.1±12. Torso endpoint/path is partly covered by the arm; uncertainty is explicit. See down-new-f1-endpoints.png.
- Direct body-derived source→native factor .205 predicts torso38.6/shin53.7, both consistent with reference; width~209px fits without shrinking to a width target. A bounded .205–.210 diagnostic is supported for independent confirmation. This is DIRECT sourcecrop→native, not an instruction to multiply the already twice-resampled output. Preserve old f0 source pixels and apply its established density separately; assemble a new version.
- Enlarged new-f1 head/hat/upper-arm breadth must be compared again against the reference and f0. Two body numbers are not sufficient to pass its build. No final source-unrepairability claim is made.

## Getup02: HOLD pending corrected landmarks/reassembly

All five figures are complete in the generated source. Equal-width source panels would cut intact limbs crossing nominal boundaries. Use complete components/bespoke rectangles; do not treat those cuts as missing generation anatomy.

The provisional neck point(168,88) in the f4 crop lies near jaw/upper neck, inconsistent with the reference sternoclavicular definition. Corrected independently marked f4 SOURCE-CROP points (crop392x441, global origin1759,163): neck-base(185,115)→sash-center(178,202)=87.3±8; exposed shin(72,300)→ankle(31,402)=109.9±8. See getup-f4-endpoints.png. Target ratios .475/.480 agree; the earlier .36/.46 discrepancy is not evidence of an incompatible source body.

The actual diagnostic metadata reports sourceScale.4328018, slightly different from sidecar190/441=.430839 because background-cleaned bounds differ. At .4328 the corrected torso/shin predict37.8/47.6. These may overlap broad reference intervals, but the original scale rationale was invalid and the guard/limb mass trends small; do not automatically pass from overlap or a chosen190px height. A single measured diagnostic near .477 predicts torso41.6/shin52.4 and complete maximum height~210px, safely inside the cell; source f0 width~473*.477=226px also fits. Luna should independently validate the annotated endpoints and use one uniform factor for all five complete figures.

Per-frame static findings: f0 side-lying figure intact, f1 elbow-supported roll intact, f2 hand/knee-supported rise intact, f3 low kneel has visible planted foot/knee/supporting arm, f4 returns to guard. No floating limb or severed anatomy found in these provisional cells. The support sequence is plausible, but exact floor contour and transition into idle need recheck after scale correction and Claude runtime review. Folded torso/hidden knees in early poses remain unmeasured; no fictitious numeric pass.

## Next bounded work

No generation needed for these identified defects. Produce new versioned assemblies from original sources with confirmed body landmarks, complete components and measured translations. Freeze quantized candidate pixels, then Astra rechecks every affected frame. Only supported candidates receive version-bound manualQA. A later actual strict shared-palette atlas requires reviewing retained93 frames if RGB changes. Existing public baseline remains unchanged. Parent owns approval-desk notification and Claude handoff; auditor edited evidence only.
