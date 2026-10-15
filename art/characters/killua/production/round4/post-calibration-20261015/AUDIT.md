# Killua calibrated atlas: final anatomy audit, 2026-10-15

Auditor: GPT-6 Astra, medium. Exact worktree HEAD at inspection: `6b911419a2382b7d971e7feee51c032917a63b0c`, branch `art/killua-title-r3`. All 16 requested frame instances and every adjacent transition, including each last-to-first wrap, inspected as ordered native-pixel crops. Diagnostic GIFs retain the atlas durations; this is raster/sequence QA, not a live-game validation.

**Verdict: all four remain HOLD.** Idle/guard stance targets are met. Their explicit 0.98–1.02 head-probe target is not met in 9 of 10 frames, although the normal pack gate accepts them. Win has a robust short upright torso relative to the approved upright neutral; agreement with the crouched idle does not resolve it. Other anatomy discrepancies remain uncertain or projection-dependent, not proven redraw requirements. No art is approved and no additional generation is authorized by this report.

## Identity and immutable evidence

`hashes.json` contains full SHA-256 for the atlas, metadata, both exact approved reference cells, prior approved idle08 f0, and all four raw inputs. Verified sheet `32526013d6d786c800c2c477b26519796340afc21a089c7a7051ce5ae91dce95` and metadata `423120ff1c66e0ed2fbab8803dcfefe8e374f814bda61d7bde74414912168ca5` equal Claude's handoff. Metadata verifies versions idle11/guard09/superDash08/win05 and atlas indices 0–7/89–90/21–22/150–153. Cached approved-idle.png was checked pixel-for-pixel against main's current atlas f0, whose metadata identifies v08; identical. This cache is a reference only, not the current candidate.

Every `*-N.png` is a direct 256px atlas crop. `*-all-2x.png` compares all frames with exact neutral/combat cells and prior idle08 at equal pixel density. `*-grid.png` is nearest-neighbour 3x evidence with native coordinates. No new packing, calibration, public edits or generated art. Claude's recorded normal pack passes; strict pack fails on unchanged charge13. Neither was rerun for this evidence-only audit.

## Measurement conventions and reference checks

H is visible hair crown to chin, not an invented skull landmark. T is midpoint of the skin/neck-to-collar boundary to central lower shirt/white hem, along the posed torso. For the neutral reference use roughly (125,98) to (127,148): 50±3px. For combat use (126,136) to (128,174): 38±3. Approved idle08 uses (128,135) to (128,173): 38±3. This fixed endpoint convention matters: the upright and forward-folded shirts cannot be treated as interchangeable projected lengths.

Arms: shoulder-to-elbow / elbow-to-wrist, excluding hand. Legs: hip-to-knee / knee-to-ankle, excluding shoe. L/R below means screen-left/right, never inferred anatomical laterality. Garments conceal shoulder/hip/elbow centers, so those are projected estimates rather than certified skeletal dimensions. Shoe is heel-to-toe along its long axis, not color area or foot-span width. Approximate uncertainty: H±2, T±3, arm segments±4, thigh±6, shin±3, shoe±2px. These intervals exceed the requested tolerances for many segments. No numeric PASS follows from overlapping uncertainty.

Reference central readings (same conventions):

| Reference | H | T | arm L U/F | arm R U/F | leg L thigh/shin | leg R thigh/shin | shoe L/R |
|---|---:|---:|---|---|---|---|---|
| approved neutral | 41±2 | 50±3 | 29/23 | 29/23 | 31/35 | 36/33 | 22/29 |
| approved combat | 40±2 | 38±3 | 25/12 | 24/15 | 34/33 | 34/33 | 23/26 |
| approved idle08 f0 | 38±2 | 38±3 | 24/12 | 24/15 | 32/31 | 32/29 | 23/25 |

Neutral feet and straight arms have different projection from combat. Neutral's near shoe is more side-on; combat and old idle are the primary footwear comparison for the new stance. None of these reference limbs has sufficiently certain hidden joint centers for universal ±6% certification. Frontal shoulder width is excluded in every row: all are 3/4, torso-pitched, crossed-arm or raised-arm views; no reliable frontal deltoid pair is available. No shoulder inflation is inferred from sleeve width.

## Every frame

Values in native pixels; U/F = upper arm/forearm, Th/Sh = thigh/shin. A dash means occluded, not zero. All central readings are estimates with the above uncertainty and pose exclusions below. Identical rounded readings across frames mean changes smaller than reading resolution, not pixel-identical art.

| Strip frame | H | T | arm L U/F | arm R U/F | leg L Th/Sh | leg R Th/Sh | shoe L/R | occupied height | head probe |
|---|---:|---:|---|---|---|---|---|---:|---:|
| idle 0 | 40 | 41 | 24/12 | 22/14 | 31/30 | 29/30 | 22/25 | 156 | 1.032 |
| idle 1 | 40 | 41 | 24/12 | 22/14 | 31/30 | 29/30 | 22/25 | 156 | 1.035 |
| idle 2 | 40 | 41 | 24/12 | 22/14 | 31/30 | 29/30 | 22/25 | 156 | 1.040 |
| idle 3 | 40 | 41 | 24/12 | 22/14 | 31/30 | 29/30 | 22/25 | 156 | 1.045 |
| idle 4 | 41 | 40 | 24/12 | 22/14 | 31/30 | 30/30 | 22/25 | 158 | 1.015 |
| idle 5 | 40 | 41 | 24/12 | 22/14 | 31/30 | 30/30 | 22/25 | 157 | 1.040 |
| idle 6 | 41 | 41 | 24/12 | 22/14 | 31/30 | 30/30 | 22/25 | 158 | 1.050 |
| idle 7 | 41 | 41 | 24/12 | 22/14 | 31/30 | 30/30 | 22/25 | 158 | 1.035 |
| guard 0 | 39 | 38 | —/— | —/— | 30/32 | 30/32 | 22/25 | 151 | 1.035 |
| guard 1 | 39 | 38 | —/— | —/— | 30/32 | 30/32 | 22/25 | 151 | 1.037 |
| superDash 0 | 40 | 36 | 26/22 | 26/22 | —/25 | 31/25 | 25/27 | 119 | 1.000 |
| superDash 1 | 40 | 36 | 26/22 | 26/22 | —/25 | 31/25 | 25/27 | 120 | 1.009 |
| win 0 | 39 | 37 | 24/— | 24/— | 30/32 | 30/32 | 21/24 | 164 | 1.012 |
| win 1 | 39 | 37 | 24/— | 24/— | 30/32 | 30/32 | 21/24 | 165 | 0.984 |
| win 2 | 39 | 37 | 24/— | 24/— | 30/32 | 30/32 | 21/24 | 163 | 0.998 |
| win 3 | 39 | 37 | 24/— | 24/— | 30/32 | 30/32 | 21/24 | 164 | 1.013 |

## Findings and exclusions

- **idle11 — target-height PASS, full anatomy HOLD.** Exact occupied heights 156/156/156/156/158/157/158/158 satisfy 156–162. Foot-band span (all occupied shoe pixels below y210, same endpoints every frame) 119/119/119/119/121/120/120/120 satisfies 110–125. Soles remain y240. Hair-crown motion is 2px peak-to-peak, within the breathing brief; minor hand and hair shifts persist, no cut figure or abrupt pose reset at 3→4 or 7→0. Head probes 1.032/1.035/1.040/1.045/1.015/1.040/1.050/1.035: seven fail the requested 1.02 upper limit. Visible H40–41 vs combat40±2 does not independently prove oversized skull; hair segmentation can drive this exact probe failure. T40–41 is +5–8% central versus idle08's38, but uncertainty overlaps ±6%; forward lean also differs. Both visible shin lengths near30 match old idle's29–31 centrally. Thighs remain under shorts. Elbows under sleeves and screen-left forearm foreshortening prevent arm certification. Shoe25±2 near/22±2 far does not certify ±4%, whose allowance at25px is only1px; no robust shoe defect found.
- **guard09 — target-height PASS, full anatomy HOLD.** Both heights151 satisfy150–158; soles y240. Probe1.035/1.037 fails the same explicit head target. Crossed forearms and cuffs obscure both elbow/wrist chains: no invented lengths. T38±3 is partly behind crossed arms, comparable to combat only approximately. Thighs under shorts; shins32±3 versus idle29–31±3 overlap. Both frames and 1→0 wrap preserve pose/stance without a large pop. Shoes remain25±2/22±2 and ±4% cannot be certified. More upright body is the requested pose change; narrow95px foot span has no separate guard width target.
- **superDash08 — HOLD for projection/measurement uncertainty, no robust residual size defect established.** H40±2 and probe1.000/1.009 agree with combat. T36±3 versus folded combat38±3 is compatible, but cannot be substituted for neutral50. Both projected arm chains about48±8 are centrally longer than idle's36–39±8; the dash extends arms sideways while idle points its forearms toward the camera, so this is not an established anatomical enlargement. Elbows beneath sleeves make U/F split uncertain. Screen-left thigh is hidden behind shorts: excluded; screen-right thigh31±6 and both shins25±3 are folded/projected. Compare old-idle near shin29±3: the possible ratio22/32–28/26 spans0.69–1.08, so neither PASS nor robust shortness. Shoes25–27±2 are pitched. Both poses are complete, no contact with cell borders, and the f0↔f1 shift is a coherent dash stride; head shifts about10px left with torso, not an isolated scaling jump. Do not force this119–120px crouched airborne silhouette to standing height.
- **win05 — HOLD, robust upright torso discrepancy.** Each T37±3 against upright neutral50±3 gives possible ratio34/53–40/47 =0.642–0.851: outside ±6% even allowing stated error. H39±2 remains compatible with neutral41±2, so this is a body/head relationship difference, not blanket scale. The shirt hem sits about153 while the comparable neutral hem is148, despite win's head/neck being about20px lower. Hands behind head and raised shoulders can pull the garment upward, so the direct finding is a visibly shortened upright collar-to-hem garment segment, not an independently known skeleton defect. It is robust under the stated endpoints; Claude/user must decide whether the pose explains that much shortening before calling it anatomically clear. Against crouched idle38±3 it appears to pass centrally—this is precisely why neutral is necessary. Both upper arms about24±4; forearms/hands behind hair are excluded. Thigh centers under shorts and shins32±3 remain uncertain. Near shoe24±2 is compatible with idle25±2 but cannot strictly certify ±6%. Four consecutive frames and 3→0 have only1–2px head/body sway, no abrupt pose reset.

Identity/palette/build: the white spiked hair, violet layered top, navy shorts, claw-hand idle and purple sneakers remain recognizable throughout. Quantization alters fine hair/edge pixels; no missing limb or frame assembly clipping in the scoped16. Do not interpret the metadata feet ratios1.18–1.35 as geometric shoe enlargement; shared sweater/hair colors contaminate that proxy.

Stagger07 is outside this re-audit and retains the existing user motion HOLD (f2→f3 reset). No rework. All four REVIEW rows remain needs review; this audit does not alter calibration, manual QA, exemptions or approval. Next: Claude reconcile the explicit idle/guard head target and win upright garment discrepancy; preserve the uncertainty holds instead of assigning a blanket ±6% pass. No redraw recommendation solely from occluded limbs.
