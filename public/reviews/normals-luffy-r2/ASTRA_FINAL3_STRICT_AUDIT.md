# Luffy ENG-112 r2 final3 independent Astra audit

2026-10-18. **Technical HOLD: dTilt v04, uSmash v05, dSmash v03, uair v02.** Packing and phase defects have improved, but a strict all-anatomy FINAL5 pass is not supported for this exact atlas. Holds are distinguished below between observed size discontinuity and unresolved anatomical calibration. This report neither approves designs nor changes the user's approved versions.

## Exact artifact and method

- Atlas: `audit_atlas/characters/luffy/sheet.png`, SHA256 `f61ebe70fe7814f23861e3749f5d204b49fa6d7d7f0057995b88f0451e104c73`.
- Metadata: same directory `anims.json`, SHA256 `da1dd7f86fa1d595d1f91beb7269dbbe3fb997a87520dc9e4c3c4084b25d5e24`.
- Independently counted 48 opaque RGB colors; atlas 4096 x 2816; 256px cells, 16 columns. All 28 requested cells were extracted directly from this atlas. Per-cell RGBA hashes, exact alpha bounds, metadata, reference hashes and selected raw/sidecar hashes are in `FINAL3_PIXEL_EVIDENCE.json`.
- Reviewed every frame sequentially at the same native pixel density as atlas idle f0 and `art/characters/luffy/production/native-audit-20261015/{neutral,combat}.png`; nearest-neighbor enlarged evidence adds detail without changing geometry. All four moves are non-looping. Reviewed startup/active/recovery boundaries and terminal-to-idle shape transitions statically. No real-time browser playback or runtime contact certification was performed. This matches the static-sequence scope of FINAL5, not a claim of tested runtime loops.
- Manual Luffy comparison only. No automatic head-gate result is used as anatomical proof. Hat widths are silhouette checks, never skull measurements. Exact pixel bounds have no rounding uncertainty; visual boundary interpretation is approximately +/-3px per endpoint and +/-6px per segment. Hidden hips, skull crown, and foreshortened limb lengths cannot receive numeric passes.

## Critical baseline nuance

The initial audit's head/hat concern must not be translated into an automatic redraw or whole-strip shrink. Measured occupied width of the top 32px band is **idle 53px, approved neutral 52px, approved combat 64px**. Thus the approved references themselves have different hat projections. dSmash guard 63/61px and dTilt guard 66px are close to the approved combat band. Their disagreement with idle does not alone prove an enlarged skull. Nevertheless their visible idle transition and whole-body proportions need reconciliation before an unconditional FINAL5 certificate. Preserve the approved reference relationship and distinguish brim projection from head size.

## Per-strip findings and all-frame inspection

| Candidate | Frames and static sequence | Final finding |
|---|---|---|
| dTilt v04 | f0 guard; f1 crouch; f2/f3 complete rightward low kick; f4 knee retraction; f5 guard. Red vest, sash, white cuffs, blue shorts and both leg chains remain connected. Both active sandals are complete. | **HOLD: anatomical/transition consistency.** Clipping hold is resolved. f0/f5 near-matching guards have larger hat/face and footwear presentation than idle; footwear band widths 32/46px versus idle 26/40px. The bent legs/shorts read bulkier while torso length is broadly similar. Do not claim a measured all-body pass or shrink the whole strip from the head-band result. |
| uSmash v05 | f0 crouched preparation; f1 rise; f2 windup; f3 bent upward punch; f4 fully extended upward punch; f5 retract; f6/f7 guard. All sandals are intact, including f4/f5 previously affected by extraction. | **HOLD: reduced body/clothing/footwear compared with idle and approved combat.** f6/f7 guard has a narrower, shorter lower-body/shorts presentation and smaller sandals. It visibly grows on return to idle. This persists independently of the repaired extraction seam. f3 is an upward bent-arm hit and f4 full extension; no static active-phase mismatch found. |
| dSmash v03 | f0 guard; f1 lower; f2 two-hand brace; f3/f4 simultaneous complete bilateral sweep; f5 retract; f6 rise; f7 guard. Both opposing legs and sandals remain attached and uncropped. | **HOLD: unresolved manual anatomy calibration against idle.** No new extraction or timing defect. Head/hat disagreement with idle persists, but guard band agrees with approved combat within uncertainty. Feet are close to idle. Existing evidence cannot establish that every head/torso/limb segment preserves the approved relationship, especially hidden thighs in the sweeps. This is not a proven demand for redraw or uniform scaling. |
| uair v02 | f0 airborne tuck; f1 lift knee; f2 complete overhead kick; f3 retracted knee; f4/f5 airborne recovery. All six poses have bent supporting legs and complete sandals. | **HOLD: residual anatomy consistency uncertainty.** The earlier second-active-contact finding is resolved by [2,1,3]. Head/hat band changes from 66px in f0 to 56/57px in f4/f5, and shorts/cuff volume changes across the tuck/recovery poses. Rotation/occlusion explain part of this, so it is not a proven skull-width error; a strict all-segment certification is still unsupported. No clipped limb or palette-boundary defect was observed. |

## Measurements and uncertainty

These are supporting observations, not a universal scale formula. Every other frame's bounds and measured bands are in the JSON.

- dTilt f2 bounds `[59,63,252,241]`, f3 `[57,64,251,241]`: right margins 4/5px, bottom margin 15px. The sandals visibly end naturally within the cell. f0/f5 hat bands 66/66px, +25% versus idle and +3% versus combat. Bottom 12px sandal bands 32/46px versus idle 26/40px; the 6px differences reach the conservative two-endpoint uncertainty limit and support the visible transition concern rather than independently proving a scale failure.
- uSmash f6/f7 sandal bands 23/34 and 22/33px versus idle 26/40px; the right sandal reduction of 6-7px is at or beyond +/-6px segment uncertainty. Manual neck-base-to-sash vertical span is approximately 39px +/-6 in f7, versus about 47px +/-6 idle and 45px +/-6 combat: these intervals overlap, so torso length alone is inconclusive. f7 knee-to-ankle vertical span is approximately 41px +/-6 versus approximately 51px +/-6 idle, again advisory because knee angle changes. Together with narrower shorts and the matched guard silhouette, these support the reduced-figure hold; no exact rescale factor is prescribed.
- dSmash f3/f4 bounds `[17,106,236,241]` / `[11,106,242,241]`: left/right margins 17/20 and 11/14px. Guard f0/f7 hat bands 63/61px versus combat 64px; sole bands 28/43 and 29/42px versus idle 26/40px. Those footwear differences fall within the conservative segment uncertainty. Active hat bands 69/70px include changed brim projection; no skull-size ratio is certified.
- uair f2 bounds `[87,40,233,241]`, 40px top and 23px right clearance. Its sole is visibly above its head. f3's lower sandal is now recovery, so its lack of overhead contact is correct for the revised metadata. Top-32px bands in f1/f2 include a raised limb and must not be read as head measurements. f0 versus f4/f5 bands are 66 versus 56/57px, a 9-10px silhouette change; anatomy remains uncertain under changing head angle.
- Across all 28 cells, no occupied alpha touches a cell edge. This does not by itself prove valid pose extraction; complete outlines were also inspected visually. No missing isolated fingers, straight internal sandal cut, obvious magenta contamination, torso disconnection, or loss of the main red/blue/white/yellow costume boundaries was observed.

## Phase timing

| Move | Metadata phases | Startup | Active | Recovery | Total |
|---|---|---|---|---|---|
| dTilt | [2,2,2] | f0-f1, 65ms | f2-f3, 100ms | f4-f5, 80ms | 245ms |
| uSmash | [3,2,3] | f0-f2, 120ms | f3-f4, 120ms | f5-f7, 160ms | 400ms |
| dSmash | [3,2,3] | f0-f2, 120ms | f3-f4, 120ms | f5-f7, 160ms | 400ms |
| uair | [2,1,3] | f0-f1, 85ms | f2, 50ms | f3-f5, 140ms | 275ms |

Durations are positive, phase counts match frame counts, and active silhouettes correspond to the described attacks. uSmash/dSmash total 400ms; no loop seam is applicable because `loop:false`. Runtime timing, grounding, hit/hurtboxes and air-position transitions remain Claude's checks.

## Evidence and handoff

`final3_{dTilt,uSmash,dSmash,uair}_evidence.png` show every native frame with all three baselines. `final3_baseline_details.png` and individual `final3_*_3x.png` show nearest-neighbor details. `FINAL3_PIXEL_EVIDENCE.json` binds all input/evidence measurements. All evidence was written only in `public/reviews/normals-luffy-r2/`.

Selected source identities supplied by the parent are dTilt v04 attempt05, uSmash v05 attempt06, dSmash v03 attempt06, uair v02 attempt05; source hashes are recorded, but generator call provenance was not independently re-audited. No dashAttack redraw is selected or certified. Historical run/light4/beamFire clipping is outside this review. Approved main versions remain dTilt v02, uSmash v03, dSmash v02, uair v01. No source, manifest, REVIEW, TRACKER, production atlas or approval state was edited; no commit was made.

Next: reconcile matched-pose anatomy with both approved references and idle, keeping the reference projection discrepancy explicit. Any changed atlas/palette or metadata requires a hash-bound recheck of affected frames. Technical review does not grant user image/design approval or runtime contact approval.
