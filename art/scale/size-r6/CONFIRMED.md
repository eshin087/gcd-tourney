# Size consistency round 6: segment confirmation

Exhaustive 230-strip inventory and triage counts: [FILTERED_CANDIDATES.md](FILTERED_CANDIDATES.md). Probe flags remain separate from endpoint findings.

## Evidence status

The previous draft contained estimated segment ratios that were not reproducible from endpoint coordinates. Those ratios and every resulting redraw/“OK” verdict are withdrawn. B (garment-color area) and H (head-probe output) remain diagnostic only; neither establishes a limb-chain ratio. The per-frame coordinate grids in this folder show the packed candidate, its own idle f0, and the approved title-style combat cell at equal 256 px density, with 32 px grid lines. They support pose inspection but do not themselves mark anatomical landmarks.

**Relay #4 calibration:** Claude supplied two agreeing landmarks for Sasuke `beamStruggle` v01 (about 31/40 px crown-to-chin and 37/46 px front sash width, both about 20% small); this supersedes the earlier unannotated estimates below. A no-call 1.246× packed re-assembly at bodyHeight152 is v04. Its packed head and sash landmarks are within the idle target ranges; scale QA passes, while design approval and contact QA remain pending. Claude withdrew the B-based tier-1 picks Killua `airLight2`, Sasuke `airLight3`, and Gojo `hurtLow`; no further image call for Killua `airLight2`. Gojo `heavy` and `airLight1` stay unresolved pending two-landmark checks. See [v04 record](SASUKE_BEAMSTRUGGLE_V04.md).

The inspected frames do not yet establish a reproducible limb-chain error. Two torso comparisons have endpoint estimates below, but their poses introduce projection/compression uncertainty; broad silhouette spans are not accepted as torso breadth unless they isolate shoulder/torso landmarks. These data do not yet authorize a redraw. Unresolved rows are holds, not passes. Tier 2 likewise has no certified pass; “no demonstrated error” means only that this review did not establish one.

## Tier 1: required segments and disposition

| Fighter / strip | Candidate frames | Grid evidence | Head | Torso collar-to-belt | Arms shoulder-to-wrist | Legs hip-to-ankle | Shoes sole/toe-heel | Disposition |
|---|---|---|---|---|---|---|---|---|
| Gojo `heavy` v05 | f0-f7; checked f7 grounded recovery | `coords-gojo-heavy-f7.png` | Head not measured | Idle collar/zip start (128,62) to waist/zip end (130,132): 70.0 px; heavy f7 (129,63) to (130,135): 72.0 px; ratio 1.03. Endpoint uncertainty ±3 px each (ratio approx 0.84–1.11). | Not homologous in this frame | Idle hip (128,133) to ankle (128,222): 89 px; heavy f7 (129,136) to (128,222): 86 px; ratio 0.97, endpoint uncertainty ±4 px (approx 0.82–1.10). | Sole/toe-heel pair not measured | f7 shows no demonstrated torso/leg size error; other frames unresolved. Hold, no redraw evidence |
| Gojo `airLight1` v07 | f0-f4 | `coords-gojo-airLight1-f*.png` | No endpoint coordinates recorded | No endpoint coordinates recorded | Extended arm is not a same-pose comparison | Folded/airborne chain; no homologous endpoints | No sole/heel pair measured | Hold; previous short-body assertion withdrawn |
| Gojo `hurtLow` v04 | f0-f2 | `coords-gojo-hurtLow-f*.png` | No endpoint coordinates recorded | Crouch changes projected torso; endpoints unmarked | Partly occluded | Bent chain; endpoints unmarked | No sole/heel pair measured | Hold; previous short-body assertion withdrawn |
| Sasuke `airLight3` v07 | f0-f5 | `coords-sasuke-airLight3-f*.png` | No endpoint coordinates recorded | Rotating poses; endpoints unmarked | Rotation/extension; endpoints unmarked | Rotation/extension; endpoints unmarked | No sole/heel pair measured | Hold; previous enlarged-body assertion withdrawn |
| Sasuke `beamStruggle` v01 | f0-f2 | Claude's relay #4 two-landmark calibration | Crown-to-chin 31 vs idle 40 px (0.78); front sash band 37 vs idle 46 px (0.80); both approximately 20% small and agree, identifying a whole-drawing scale error rather than anatomy drift. | Same source, matched horizontal front-band endpoints; approximately 20% small. | Extended push pose; no same-pose arm pair | Deep wide crouch; projection not used as height | Shoe pair not needed after two agreeing landmarks | Confirmed size error. No-call re-assembly at ~1.25×; v04 retains identical source pixels at bodyHeight152. |
| Sasuke `beamStruggle` v03 | f0-f2; diagnostic-only bodyHeight146 | `diagnostics/sasuke-beamStruggle-v03-coordinate-grid.png`; candidate atlas SHA-256 `F986CBDC5E9B1D48EF0B125DEB00CA4B71D4D200EEABE06D5464D456D23188BB` | Earlier diagnostic readings are superseded by Claude's corrected v01 measurements and v04 calibration. Probe H≈1.15 overlaps sleeve/hair palette and is invalid. | Earlier connected-component readings are non-homologous and superseded. | Not fully measured | Not fully measured | Not fully measured | Preserved technical diagnostic; no longer a review candidate. See `SASUKE_BEAMSTRUGGLE_V03.md`. |
| Sasuke `beamStruggle` v04 | f0-f2; no-call bodyHeight152 | `public/reviews/size-r6/sasuke-beamStruggle-v04/`; packed atlas SHA-256 `1365C56FEF7617875F7B61B89D209287488D27275BA19FAB95D00C2B910BD7EE` | Crown-to-chin 39–41 px vs idle ~40 px, about ±2 px; all frames within target. | Front sash band 44–48 px vs idle ~46 px, about ±2 px; loose ties/tails excluded. | Not changed; pose-scale QA only | Not used as a height proxy in crouched pose | No drawing change | No-call correction; scale QA pass. Candidate ready for user art review; approvedVersion remains v01. See `SASUKE_BEAMSTRUGGLE_V04.md`. |
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
