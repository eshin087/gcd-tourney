# Gojo round 4 — independent Astra audit

Verdict: **HOLD**. Final independent audit completed for the named immutable diagnostic atlases. No image approval.

Completed immutable coverage: idle v07 (8), superDash v09 (2), retained guard v04 (2), jumpUp v04 (2), airLight3 v12 (6), hurtLow v04 (3). All 23 candidate/retained frames were directly inspected from quantized atlases. All 8 idle v06 baseline frames were also visually inspected.

## Sources and uncertainty

`atlas-evidence.json` records exact atlas/metadata SHA-256, approved neutral/combat SHA-256, all cell alpha bounds, colors and loop metadata. All three supplied atlas/metadata hashes matched. Contact sheets and grids are atlas extractions. The approved references are title_style_draft_v01 neutral/combat per PRODUCTION_CONTRACT.md and ADR0029. Runtime bodyHeight and offsets were not changed.

`independent-landmarks.json` records independent manually read coordinates and projected segment lengths per frame, plus named skips. Decimal values are arithmetic outputs, not subpixel precision. Conservative uncertainty: head/shoe ±4px, torso or single limb segment ±6px, two-segment chain ±12px. Source-reference crown uncertainty also remains. Bent/oblique projected lengths cannot be treated as unforeshortened anatomy. An uncertain estimate is never a numeric pass or authorization for another generation.

## Findings

- **idle v07: definite HOLD on requested stance.** Every frame is234–236px tall and135–138px wide; requested210–216 by145–160. Open hands were adopted, but the figure remains elongated/upright relative to combat. Torso83–85px versus combat~70 and old idle~79; landmark uncertainty affects exact ratio. Head~35–37 versus old idle~38, each±4: insufficient precision to certify±2%. Do not make this unapproved idle the gate baseline.
- **superDash v09: HOLD on compact anatomy.** Both torsos measure~53.5±6px, collar(156,136) to hem(127,181), versus oldidle79.2±6/combat69.7±6. Most favorable interval against oldidle59.5/73.2≈0.813, below0.94; against combat59.5/63.7≈0.934 is too close to overclaim given reference uncertainty. Bent pose affects projection, but torso visibly reads compact for head. Arm45–46±12 and leg76–77±12 versus oldidle70±12/102±12 are secondary concerns, not independently robust failure ratios. Tucked/crossed/oblique shoes and far limbs skipped.
- **guard v04: HOLD for certification, no redraw recommendation.**211/213h,141/143w. Clothing volume close to combat; torso71–73±6, leg99–100±12, shoe33–35±4. Crossed arms prevent full-chain certification. No robust newly measured drawing defect.
- **jumpUp v04: HOLD for certification, no redraw authorization.** Both200h; torso70–71±6. Raised thigh, pocket wrist, angled shoes and covered hip confound full anatomy. Short projected hanging-leg estimates do not prove short anatomy. Both loop endpoints inspected; no severed limb.
- **airLight3 v12: HOLD for certification; these estimates do not authorize another generation.** All6frames inspected. Body reads compact f0–3 compared f4–5 while head stays broadly stable. Activef2 hip(120,188),knee(161,180),ankle(199,172) gives80.6±12px;f3~78.6±12. Against oldidle102.4±12, uncertainty overlaps the±6% acceptance region. Hidden hip/flared coat/depth also confound torso comparisons. Earlier rough78–84±6 estimate was insufficiently propagated;±12 supersedes it. Size continuity needs review but is not a robust measured failure.
- **hurtLow v04: HOLD for certification, no redraw authorization.**168/184/198h follows recovery. Projected torso39/50/63 expands while unbending, not proof of changing anatomy. Leg89–92±12/shoe32–34±4 overlap baseline tolerance after uncertainty. All poses preserve recognizable outfit/head/limbs; no severed geometry found.

## Technical and temporal inspection

All scoped occupied x stays within4..251. Every inspected cell≤48 opaque colors, binary alpha, no opaque magenta (JSON records exact values). No cell-boundary clipping detected. Metadata256px/16columns/pivot[128,240]/ppu128. These checks do not prove source hard-pixel quality or gameplay contacts.

Idle/superDash/guard/jumpUp last-to-first pairs were inspected from extracted sequences. Idle07 crown varies2px; endpoint bounds delta(1,1,-2,0). SuperDash endpoint y differs1px. No missing figure or obvious endpoint teleport; idle knee/hand contour wobble still merits playback review. AirLight3/hurtLow are nonloops inspected in order. GIFs preserve metadata duration; no runtime validation claimed.

## Provenance incident reported by coordinator

Coordinator reports airLight2 received5new-round calls against3authorized (2over). Call1/2 working sourcecopies were temporarily overwritten, then recovered with exact hashes; versioned airLight2v05 remains selectedcall2 and unchanged. Calls3–5 were preserved as incident evidence. Recovered source hashes and selected-version equality were independently verified at audit completion below. Do not describe sources as lost or the extra calls as authorized.

Final atlas recheck completed below. No image approved and no production/manifest/calibration files modified.


## Final six and affected-atlas recheck

Verified final atlas SHA-256 `89fd7021575060d70a065c620607d3a80fd526d6b8b6f709d2106766381f0b28`, anims JSON `40a09f854da368550c4c158cc16350b7562cfa88030be79bf77002307ff3bdc9`, and fixture manifest `3a75196e6b3a95ae49c34b20203ec970c04d604ff562b1bbd0436cea1f1dec24`. `final-atlas-evidence.json` is the machine-readable evidence. Actual fixture filenames confirm jumpFall v06, airRecover v05, throw v05, airLight1 v07, airLight2 v05 and light3 v05, plus idle v06 and the retained strips.

Every one of the final atlas's 47 frames was visually inspected. Its 21 retained/baseline frames have byte-identical alpha masks to the earlier atlas; RGB changed through quantization and was rechecked visually. All 26 new frames were measured independently using cell-coordinate overlays. `FINAL-SEGMENTS.md` gives the per-frame H/T/A/L/S table; `final-independent-landmarks.json` provides endpoints, upper/lower limb segments, full intervals, baseline comparisons and exclusions. Audit coverage across the separate immutable atlases is 49 candidate/retained frame instances plus 8 baseline idle frames. Final atlas does not contain idle v07 or superDash v09; those remain independently audited holds in their separate atlases.

| Final candidate | Independent projected segment ranges (px) | Finding |
|---|---|---|
| jumpFall v06, 2 frames | H 38–39; T 64; A 58; L 87; S 24 oblique | HOLD. Jacket projection is shorter than old idle, but uncertainty overlaps tolerance. Bent thigh/pocket wrist and shoe angle prevent complete certification. |
| airRecover v05, 3 frames | H 36–40; T 53–69; A 57–74; L 84–101; S 22–47 oblique | HOLD. Rotating/curling pose makes these projections unsuitable for direct anatomical ratios. Preserve the tumble; do not resize its pose bounds. Requires fresh manual tumbling QA rather than stale v03 annotation. |
| throw v05, 4 frames | H 35–37; T 56–61; A 34–50; L 95–98; S unmeasured | HOLD. Jacket is visibly compact relative to head; torso projections remain below old idle even with the declared landmark intervals. Twist/depth prevents converting that directly to a certified anatomical percentage. Dangling heel is not measurable; a visible toe fragment is not shoe length. |
| airLight1 v07, 5 frames | H 36–38; T 55–57; A 45–49; L 91–92; S unmeasured | HOLD. Short torso and extended-arm projections for the head; f1/f2 extended arm should receive focused review. Torso is nominally 28–31% below old idle and 18–21% below combat, with stated uncertainty. Hidden heel and raised thigh preclude full pass. |
| airLight2 v05, 5 frames | H 38–40; T 56–64; A 32–49; L 69–92; S active kick 29–31, other frames unmeasured | HOLD. f1/f2 kick has compact torso/leg projection relative to recovery; hip and thigh depth confound the exact anatomical ratio. Source-budget incident is a separate hold below. |
| light3 v05, 7 frames | H 36–38; T 62–63; A 49–51; L 80–99; S 28–32 | HOLD. Head scale is broadly stable while clothing/body reads short relative to old idle. A-to-B transition drops the crown about 9–11px; f5/f6 stand more upright yet remain shorter, so this needs explicit scale/seam review. Pocket wrist and kicking hip depth prevent all-segment certification. |

H/S uncertainty is ±4px, T/single limb segment ±6px, A/L chain ±12px. These are conservative manual landmark uncertainties, not statistical confidence intervals. They do not account for unknown 3D foreshortening, which is separately excluded. Nominal outliers are not automatically proof of an anatomical defect or authorization for another generation. A visible projected torso mismatch can support HOLD while its exact anatomical cause remains uncertain. No strip receives an all-segment ±6% pass.

### Technical and sequence findings

The final atlas has binary alpha, no opaque magenta and at most 48 opaque colors per cell. Every occupied x lies within 4..251, including airRecover f2 at x=9; no figure is cut by a cell boundary. All expected frame counts and animation durations are present. All new poses face generally screen-right; airRecover rotation is intentional. No obvious severed or duplicated major limb was found in the extracted frames. These findings do not certify fingers, contact boxes or runtime gameplay.

JumpFall's two-frame loop preserves the crown within 1px, but its free hand swings roughly 16–20px between two 80ms frames; this may read as a sharp alternating motion and deserves playback review. Idle, guard and jumpUp loop endpoints were rechecked after quantization. The other five new strips are nonloops and were inspected in order; light3's A/B size continuity is the key sequence concern. GIF evidence preserves atlas durations. This audit used frame/sequence inspection, not a game runtime test.

This is a **diagnostic warn-mode pack**, not a successful production strict-scale gate. The worker reported a stale airRecover manual-QA warning tied to v03; an old manual annotation cannot approve v05. No strict-gate success, engine calibration, source approval, merge or production deployment is claimed.

### Recovered-source verification

I independently verified recovered call1 hash `14fff9bdb7fcff22d02ab401a679cfdf88a939b3ed0b2d6d7dba05f324fc4414` and call2 hash `84a80437cc13504a6c34567eeaab84f71e22d510ea0aaada0ad077bf5491f989`. The latter exactly equals both immutable `raw/airLight2_v05.png` and the final fixture input. Incident call3/4/5 files exist and their hashes are recorded in `provenance-hashes.json`. Thus sources are recovered, not lost, and selected v05 is unchanged. The coordinator-reported 5 calls against 3 authorized remains a budget breach of 2 calls; preserving/recovering the files does not authorize them. No further generation is recommended or performed by this audit.

Final recommendation: keep the candidate set on HOLD for user/Claude review, preserve the quantified gaps and uncertainty, retain the approved baseline, and do not substitute head-gate success for anatomy certification.
