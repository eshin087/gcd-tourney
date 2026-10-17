# Size consistency round 6: segment confirmation

## Evidence status

The previous draft contained estimated segment ratios that were not reproducible from endpoint coordinates. Those ratios and every resulting redraw/“OK” verdict are withdrawn. B (garment-color area) and H (head-probe output) remain diagnostic only; neither establishes a limb-chain ratio. The per-frame coordinate grids in this folder show the packed candidate, its own idle f0, and the approved title-style combat cell at equal 256 px density, with 32 px grid lines. They support pose inspection but do not themselves mark anatomical landmarks.

The inspected frames do not yet establish a reproducible limb-chain error. Two torso comparisons have endpoint estimates below, but their poses introduce projection/compression uncertainty; broad silhouette spans are not accepted as torso breadth unless they isolate shoulder/torso landmarks. These data do not yet authorize a redraw. Unresolved rows are holds, not passes. Tier 2 likewise has no certified pass; “no demonstrated error” means only that this review did not establish one.

## Tier 1: required segments and disposition

| Fighter / strip | Candidate frames | Grid evidence | Head | Torso collar-to-belt | Arms shoulder-to-wrist | Legs hip-to-ankle | Shoes sole/toe-heel | Disposition |
|---|---|---|---|---|---|---|---|---|
| Gojo `heavy` v05 | f0-f7; checked f7 grounded recovery | `coords-gojo-heavy-f7.png` | Head not measured | Idle collar/zip start (128,62) to waist/zip end (130,132): 70.0 px; heavy f7 (129,63) to (130,135): 72.0 px; ratio 1.03. Endpoint uncertainty ±3 px each (ratio approx 0.84–1.11). | Not homologous in this frame | Idle hip (128,133) to ankle (128,222): 89 px; heavy f7 (129,136) to (128,222): 86 px; ratio 0.97, endpoint uncertainty ±4 px (approx 0.82–1.10). | Sole/toe-heel pair not measured | f7 shows no demonstrated torso/leg size error; other frames unresolved. Hold, no redraw evidence |
| Gojo `airLight1` v07 | f0-f4 | `coords-gojo-airLight1-f*.png` | No endpoint coordinates recorded | No endpoint coordinates recorded | Extended arm is not a same-pose comparison | Folded/airborne chain; no homologous endpoints | No sole/heel pair measured | Hold; previous short-body assertion withdrawn |
| Gojo `hurtLow` v04 | f0-f2 | `coords-gojo-hurtLow-f*.png` | No endpoint coordinates recorded | Crouch changes projected torso; endpoints unmarked | Partly occluded | Bent chain; endpoints unmarked | No sole/heel pair measured | Hold; previous short-body assertion withdrawn |
| Sasuke `airLight3` v07 | f0-f5 | `coords-sasuke-airLight3-f*.png` | No endpoint coordinates recorded | Rotating poses; endpoints unmarked | Rotation/extension; endpoints unmarked | Rotation/extension; endpoints unmarked | No sole/heel pair measured | Hold; previous enlarged-body assertion withdrawn |
| Sasuke `beamStruggle` v01 | f0-f2; checked all frames | `coords-sasuke-beamStruggle-f0.png`, `f1.png`, `f2.png`; native sources `raw/beamStruggle_v01.png`, `reference/idle_approved.png` | Packed-grid visual crown-to-chin: idle f0 y65–108 ≈43 px; beam f0 y123–156 ≈33 px; candidate/reference 0.77 (±4 px endpoint uncertainty -> approx 0.60–0.96). Manual B/H body report says H=.949; discrepancy unresolved, so visual head estimate alone is not accepted as a finding. | Torso collar-to-belt visual estimate: idle y96–145 ≈49 px; beam f0 y139–175 ≈36 px; ratio 0.73, ±4 px each endpoint (approx 0.62–0.88). Deep crouch/lean compresses vertical projection. Previous broad torso silhouette-width estimate is withdrawn; sleeves/arms were not excluded with an annotated scanline. | Arm chains not homologous; extended push pose | Deep wide crouch; lower-chain endpoints not homologous to idle stance | Sole/toe-heel not measured | Original manifest bodyHeight 122 packs with no beamStruggle scale-gate warning (`1 ref, 33 ok, 10 manual`). Isolated diagnostic bodyHeight 159 produced `beamStruggle head 1.24 of idle (feet 1.44)` and was worse; 122 and all outputs restored. Conflicting visual/probe evidence and pose projection leave this unresolved; no redraw authorized |
| Killua `airLight2` v07 | f0-f4 | `coords-killua-airLight2-f*.png` | No endpoint coordinates recorded | No endpoint coordinates recorded | Kick pose; no homologous chain measured | f0 is a one-leg airborne pose unlike idle stance; projected length is not full chain length | No homologous heel/toe pair | Hold; previous .65-.76 leg and .78-.90 shoe ratios withdrawn |

The prior ratio claims were based on visual estimates and/or inferred from B/H. They must not be reused as measurements. To change a hold into a finding, annotate each compared frame with the actual anatomical endpoint pixel coordinates, calculate Euclidean pixel lengths at the same packed density, record the reference chain and candidate chain, and report uncertainty for ambiguous landmarks. A redraw decision requires repeatable evidence of the same segment deviation across relevant frames, not a body-area median.

## Tier 2: disposition before tier-1 changes

The prior “OK” labels are withdrawn because no reproducible segment coordinates accompanied them. B/H medians below are retained only as diagnostic pointers. Every row is unresolved pending explicit endpoint evidence; this is not a failure finding or certified pass.

| Fighter / strip | Frames / version | Grid evidence | Segment evidence | Advisory B/H | Disposition |
|---|---|---|---|---|---|
| Gojo `airLight2` | f0-f4 / v05 | `body-gojo-airLight2-airLight3-light1-light3-land-special-throw.png` | No endpoint coordinates recorded; folded legs/crossed arms | 0.810 / 0.970 | Hold, unresolved |
| Gojo `airLight3` | f0-f5 / v12 | same Gojo diagnostic sheet | No endpoint coordinates recorded; rotation/occlusion | 0.790 / 0.980 | Hold, unresolved |
| Gojo `light1` | f0-f6 / v05 | same Gojo diagnostic sheet | No endpoint coordinates recorded | 0.870 / 0.970 | Unresolved; no error demonstrated |
| Gojo `light3` | f0-f6 / v06 | same Gojo diagnostic sheet | No endpoint coordinates recorded; raised leg foreshortened | 0.880 / 0.990 | Hold, unresolved |
| Gojo `land` | f0-f1 / v06 | same Gojo diagnostic sheet | Crouch; no unbent homologous chain measured | 0.780 / 1.010 | Hold, unresolved |
| Gojo `special` | f0-f7 / v07 | same Gojo diagnostic sheet | No endpoint coordinates recorded | 0.860 / 1.000 | Unresolved; no error demonstrated |
| Gojo `throw` | f0-f3 / v05 | same Gojo diagnostic sheet | Folded/airborne; no comparable full leg chain | 0.880 / 1.000 | Hold, unresolved |
| Sasuke `hurtLow` | f0-f2 / v03 | `body-sasuke-hurtLow-specialUp-run-spin-airRecover-getup-vanish.png` | Folded torso/crossed arm; endpoints unmarked | 0.810 / 0.990 | Hold, unresolved |
| Sasuke `specialUp` | f0-f5 / v09 | same Sasuke diagnostic sheet | Alternating crouch/extension; endpoints unmarked | 0.790 / 1.010 | Hold, unresolved |
| Sasuke `run` | f0-f7 / v05 | same Sasuke diagnostic sheet | No endpoint coordinates recorded; lean changes projection | 0.860 / 1.010 | Unresolved; no error demonstrated |
| Sasuke `spin` | f0-f3 / v01 | same Sasuke diagnostic sheet | Rotated/inverted; chains not isolated | 0.780 / 1.540 (head probe invalid) | Hold, unresolved |
| Sasuke `airRecover` | f0-f2 / v01 | same Sasuke diagnostic sheet | Backflip/occlusion; chains not isolated | 0.810 / 1.050 (f1 head probe 2.23) | Hold, unresolved |
| Sasuke `getup` | f0-f4 / v05 | same Sasuke diagnostic sheet | Folded in f0-f2; no endpoint coordinates recorded | 0.840 / 1.070 | Hold, unresolved |
| Sasuke `vanish` | f0-f1 / v05 | same Sasuke diagnostic sheet | No endpoint coordinates recorded | 0.830 / 1.040 | Unresolved; no error demonstrated |
| Killua `airLight1` | f0-f4 / v06 | `body-killua-airLight1-light3-light4-dash-backDash-hurtLow-beamFire-specialForward-win.png` | Folded/extended; no homologous full chain | 0.730 / 1.010 | Hold, unresolved |
| Killua `light3` | f0-f6 / v05 | same Killua diagnostic sheet | No endpoint coordinates recorded | 0.880 / 0.990 | Unresolved; no error demonstrated |
| Killua `light4` | f0-f7 / v10 | same Killua diagnostic sheet | No endpoint coordinates recorded | 0.860 / 1.000 | Unresolved; no error demonstrated |
| Killua `dash` | f0-f1 / v05 | same Killua diagnostic sheet | Lean changes projection; endpoints unmarked | 0.830 / 1.000 | Hold, unresolved |
| Killua `backDash` | f0-f2 / v04 | same Killua diagnostic sheet | Crouch/crossed arms; endpoints unmarked | 0.830 / 0.990 | Hold, unresolved |
| Killua `hurtLow` | f0-f2 / v06 | same Killua diagnostic sheet | Folded chain; endpoints unmarked | 0.780 / 1.000 | Hold, unresolved |
| Killua `beamFire` | f0-f2 / v09 | same Killua diagnostic sheet | No endpoint coordinates recorded | 0.800 / 1.000 | Unresolved; no error demonstrated |
| Killua `specialForward` | f0-f6 / v12 | same Killua diagnostic sheet | No endpoint coordinates recorded | 0.840 / 1.000 | Unresolved; no error demonstrated |
| Killua `win` | f0-f3 / v04 | same Killua diagnostic sheet | Raised arms; no endpoint coordinates recorded | 1.180 / 1.090 | Hold, unresolved |

## Goku and Luffy body-sheet scope

`body-goku.png` and `body-luffy.png` were generated from the added body-color definitions in `art/scale/builds.json`. The saved `body-report.json` is the last report only (Luffy); rerun each character separately and preserve each report under a unique name before replacing it. Flagged animation entries are area diagnostics, not segment-scale findings or redraw approvals. The listed body-color values are palette swatches, not anatomy measurements.

## Candidate hold and generation provenance

Killua `airLight2` v08 is preserved under `art/characters/killua/raw/_qa_hold/airLight2_v08.png` as an unapproved, held candidate. It failed `node tools/pack-sprites.mjs killua --quantize 48` with scale-gate output `airLight2 head 1.06, feet 1.21 of idle`; no frames/atlas were written. The v08 generation is not treated as a repair because the v07 segment deviation was not established. See `art/characters/killua/production/size-r6/GENERATION_LEDGER.md` for exact call receipt, source path, hash, prompt, the earlier unpersisted call incident, cumulative count, and pack result. No user approval is requested for this held candidate; no additional generation call is justified by the current evidence.
