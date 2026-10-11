# Killua proportion sample v01 — review-only QA

Selected built-in imagegen attempt2 of2. Native1254x1254, not requested1024x1024. Four627x627 quadrants, idle/guard/run/light1. Original pixels preserved. This is a new reference sample only; no animation, manifest, approval, pack or shipped atlas change. No full animation set generated.

## Anatomy observations

Face, spiky silver-white hair, blue eyes, purple/navy/white costume, youthful light build remain recognizable. All four face/head/hair masses read consistent; guard does not shrink its head as the current shipped guard does. Run retains long leg/arm segments under foreshortening. Attack reads the canonical extended knife-hand, with claw tips leading right. Attack hand is a little below the requested brow contact height and its rear guarding hand is closer to chin than open-palm reference; these remain pose caveats, not approval.

Visual skull landmarks are inferred beneath opaque hair, NOT precise probe measurements. Approximate source coordinates (crown/chin, ±10-12px crown, ±5px chin): idle124/197; guard124/198; run745/817; attack745/818. Skull-to-chin roughly72-74px across poses, uncertainty about12px. Hair adds substantial silhouette width but consistent volume. Inferred idle crown to lowest sole588 is464px in this slightly bent pose. A single provisional display factor182/464=0.39224 applied to ALL four poses makes the projected idle crown-to-sole182px and skull-to-chin about28.2-29.0px. This is a shared comparison factor, not verified standing-skeleton calibration; bent knees mean full extended skeleton would be a little taller. Never fit each quadrant independently.

Idle near/far deltoids are partly obscured by sleeve/raised arm; approximate source shoulder width110-120px excluding forearms, or43-47px with the single factor. This is consistent with the requested44px child target within landmark uncertainty. Shoulder width of other poses must not use the arm/hand envelope.

The four measured opaque bounding boxes (background-threshold estimate, no source modification) are in proportion_sample_v01.measurements.json. Top-row soles588/589 versus requested480; lower-row lowest sole1188 versus requested992. Both are generation-canvas/layout deviation, not evidence of within-row body-scale change. Exact pixel/color/palette and2x2-grid compliance are not verified; source contains more shading than a shipping quantized48-color atlas. No scale-gate pass claimed. No separately auto-fitted cells.

Recommendation: suitable for comparative cast sample review using one shared factor; retain caveats about inferred skull crown, requested canvas mismatch and attack hand height. User decision is required before any fuller redraw.
