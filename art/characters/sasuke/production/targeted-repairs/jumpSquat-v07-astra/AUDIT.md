# Sasuke jumpSquat v07 targeted Astra audit

**Visual repair improved; strict anatomy verdict HOLD (measurement uncertainty).** The extended-arm silhouette concern from v06 is reduced. No new robust head, torso, leg or shoe defect is established. This is a diagnostic-atlas audit, not a successful strict pack, manual QA exemption, image approval or production integration.

Audited source/diagnostic commit `5b1fe90`, atlas SHA256 `79427700a78d5a158407d86a8b1ab68f092d34cd880a45f0d47ccc321f14b6c9`, metadata `30a5dcc5b50cf6fbca30aa938c317202c787f3a2c105a8bd4aeccf868d870043`. Source v07 SHA `8b8cb826e0d4105e5bc66dc1bd25e6c6e8399b1d7b8930f778b35428ed3ad1bb`; exact generation call is in round4 candidate inventory. Extracted actual quantized atlas index23, one70ms nonlooping cell. No multi-frame or return-loop claim applies. BodyHeight157 sidecar retained; the diagnostic manifest alone sets warn. Actual standard strict gate fails unmeasured; v06 manualQA does not cover v07.

[Comparison](comparison-3x.png), left to right: v07 diagnostic, v06 calibrated production, approved idle v07 f0, approved neutral, approved combat. All use native256px cells and identical nearest-neighbor3x enlargement, without pose-height fitting. v06/idle extractions and coordinates come from `round4/post-calibration-20261015`; v06 production atlas SHA starts `a2a8faed`. [Coordinates, hashes and uncertainties](measurements.json), [native v07](cell.png), [10px grid](grid-3x.png). The comparison is not evidence that a shorter bent projection proves corrected intrinsic anatomy.

| Native projected measure | v07 | v06 | idle | neutral / combat |
|---|---:|---:|---:|---:|
| H outer hair tip to chin |44.1±5|44.1±5|43±5|42.2 /40.9±5|
| T collar to belt |47±7|47±7|45±7|46.1 /43±7|
| Near upper arm /forearm |43.7 /24.2±10 each|45.2 /43.5±10|23.7 /19.9±10|36.8 /25.7;27.7 /18±10|
| Near thigh /shin |35.9±12 /43.5±10|35.9 /43.5|43.9 /35.8|45.4 /30.1;38.9 /35.8|
| Far thigh /shin |31.9±12 /34.2±10|31.9 /34.2|43.1 /34.4|43.6 /32.8;41 /35.3|
| S side-facing sandal extent |34±2|34±2|32±2|28 /29±2|

The same central non-arm landmarks remain appropriate at this audit's precision; that is not a claim of byte-identical preserved art. H includes hair, not hidden skull crown. T and limb joints are garment-covered estimates; shoe orientation adds uncertainty. No full ±6% numerical pass is available: even H interval against idle is0.815–1.292 and sandal interval0.941–1.200. Squat leg projections cannot be interpreted as standing limb lengths.

Near arm endpoints: shoulder(145,125)→elbow(102,133)→wrist(92,155), total67.9px versus v06 88.7px. The elbow now bends distinctly downward and the wrist sits near the rear hip. The upper-arm estimate remains43.7 versus neutral36.8; its covered shoulder/elbow centers prevent a robust disproportion finding. The forearm projected length is24.2 versus neutral25.7. Whole bent-arm uncertainty is±15px (wider than the prior nearly straight±10); against neutral62.5±10, ratio0.730–1.579. Thus the prior overlong nearly straight chain concern is no longer robustly demonstrated, but this cannot certify true arm segment lengths within±6%.

Near wrist→longest visible fingertip(76,163) is17.9±4px. The hand is connected, fingers remain readable, and no cut wrist or isolated fragment appears. Its open/downturned gesture prevents direct comparison with neutral relaxed fingers or the foreshortened idle guard hand. The two hands now overlap more closely, reducing silhouette separation; this is a review caveat, not an established fused-hand defect. Far arm/hand chain is excluded because of torso/hand overlap. No frontal shoulder width is measurable.

Head profile, open collar, sash, trouser volume, squat and sandals remain visually coherent with v06 and approved references. No new obvious missing limb, clipping, adjacent-frame fragment or body-scale jump appears in this single cell. Saved bounds verify clear cell margins. No independent contact/hurtbox or gameplay test was performed.

**Next action:** Claude must independently resolve the v07 unmeasured gate using v07-specific evidence, then validate contacts. User reviews the image separately. Keep `needs review`; do not inherit v06 manualQA, weaken production thresholds, rescale the crouch or generate another repair based solely on these low-confidence estimates. The audit does not authorize another call.
