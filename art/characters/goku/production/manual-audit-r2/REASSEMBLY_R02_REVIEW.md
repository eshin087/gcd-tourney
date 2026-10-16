# Goku reassembly r02 — interim independent source review

2026-10-15. This supplement is source-level feedback, not a final quantized-atlas pass. The guard v05/light2 v05 pilot decisions in AUDIT.md retain their exact scope. No new r02 output is certified at the existing production bodyHeight settings.

## Method corrections

Use the same anatomical endpoint definition in source and reference. Collar-center/sternoclavicular neckline to belt center is the harmonized torso measure; an endpoint inside the blue shirt is not interchangeable. Belt width must include the same visible outer garment span. Separate source-coordinate uncertainty from native-reference uncertainty. Evaluate each ratio interval before taking a median. A factor spread alone does not establish incompatible anatomy, and an inconvenient boot ratio cannot be discarded solely because the boot is vertical. Foreshortening needs a visible pose explanation.

## Per-output preliminary findings

| Output | Finding | State |
|---|---|---|
| win v04 | Chosen .444 differs from exact recorded-ratio median .4456; erratum preserved. Roomy output preserves pixels, but proposed standard placement has 14px top-margin overflow. | HOLD; native quantized audit and fit correction pending |
| light3 v05 | Chosen .530 differs from exact median .5115. Original v05 already clips 11 rows in f4; roomy companion preserves them. Detached rear-arm/hand topology remains visible in f2. | HOLD; source topology and cell-fit defects |
| light4 v05 | .565 uses collar/belt and excludes boot .6975. The much larger boot correction requires endpoint/projection review, not automatic exclusion. | HOLD pending exact quantized cells and independent boot remeasurement |
| run v05 | .484 uses collar/boot; belt .5806 excluded for perspective. Body appears coherent in source contact, but exclusion and all eight final cells need checking. | Pending quantized audit; no pass |
| dash v04 | .241 agrees with three recorded ratios (.2357/.2432/.241). Crouched silhouette is plausible. | Pending quantized audit; no pass |
| jumpFall v03 | Likely endpoint error: collar (468,287) lies inside blue chest; neckline appears near (477,267), approximately ±6 source px. Belt recorded x398..480 appears to omit right end; visible span near x395..496. These are visual screening coordinates requiring a fresh mark on the untouched source. True lengths may be nearer100 than82px, making .452 too large. Boot .333 should not be dismissed just for vertical orientation. Proposed top overflow58/52px may therefore be partly calibration error. | HOLD; re-mark before any new version |
| land v04 | .253 uses collar/boot; belt .3303 excluded. Bent/overlapped limbs make source comparison provisional. | Pending quantized audit; no pass |
| light1 v03 | .385 combines A attempt01 and B attempt03 belt/boot ratios. B looks slightly larger; f4–6 intrude2px into top margin at proposed placement. Torso ratios .3717/.340 were excluded for lean and require checking. | HOLD for fit; body consistency pending quantized audit |
| charge, no new candidate | Central ratios .4536/.3830/.3705 differ, but target uncertainties can yield overlapping factor intervals around .394–.421 before adding source uncertainty. Do not claim scaling is impossible from central ratios alone. The neutral-to-combat loop discontinuity remains a separate real issue. | HOLD for loop/pose; factor unresolved |
| jumpUp, no new candidate | Recorded torso distance186.72 gives38.1/186.72=.2040, not .209. Other ratios .2483/.2855/.2555 involve projected/tucked segments; units of uncertainty need separation. | HOLD pending endpoint/uncertainty review |

## Required next evidence

The worker is preparing a frozen isolated native-density fixture with source hashes, exact pack settings, actual quantized PNG/metadata hashes, extracted native cells, and clipping/overflow records. Audit every frame against the approved neutral/combat/idle references. Passing source arithmetic is insufficient; no pass may be transferred to a resized production atlas. Static contacts establish frame and sequence evidence only; timed playback remains a separate review.

No source, manifest, tooling, approvals, or production outputs were changed by this review. Parent owns handoff to Claude and any supported calibration changes.

## Seven held sources: annotation review

The annotated PNGs were inspected directly. Several recorded segments do not identify the named anatomy; their numerical disagreement cannot establish source anatomy failure.

- **jumpUp:** collar mark (469,284) is at posterior neck, not the collar-center used for idle. Screening replacement collar (480,350), belt center (398,473), approximately ±8 source px per endpoint, yields length148px and ratio .258. This agrees with recorded belt .248 and boot ratios .256/.286 within measurement/projection uncertainty. Re-mark untouched source and calculate a new factor near .26; a measured diagnostic reassembly is supported in principle. No final scale pass.
- **airLight1:** screening collar-center (278,147), belt center (251,212), length70.4px, ratio .541. Visible belt span is nearer x218..279 at y213 than the recorded x206..291 at220 (which extends into trousers), giving .590. Boot shaft top near(150,386) to sole(132,464), length80.0px, ratio .546. Screening endpoints ±6–10 source px. These support a re-marked factor around .55, not a source mismatch rejection. Worker must confirm marks before reassembly.
- **airHeavy:** annotated boot line starts near ankle/foot and ends in magenta below foot. It is invalid as shaft-top-to-sole evidence. Rear boot visible shaft top is near local(155,326) and sole near(145,398), approximately ±6px; convert local coordinates by adding panel origin(1024,512). Torso and belt must likewise be re-marked at actual neckline and blue garment edges. A common factor remains plausible; current .5426/.5375 agreement is not trustworthy because boot endpoint is wrong. No redraw justified.
- **launched:** annotated boot segment starts on orange trouser and ends in magenta above the toe. Use the unobscured lower boot instead: screening shaft top near(563,676), sole near(655,824), length174px, ratio .251, approximately ±10 source px. The belt is diagonal, and its existing line cuts across orange trousers. Re-mark both blue outer edges and neckline/belt center; likely a viable source calibration, not proven anatomy mismatch. No factor finalized.
- **down:** existing torso/belt annotation lies on hair/upper torso, not the folded torso and actual belt. The actual belt is near x430–456,y490–550. The right boot is visible but flexed; screening top near(619,653), sole near(720,752) gives142px, ratio .306, with larger orientation uncertainty. A second trustworthy segment is still required; HOLD for measurement, not a redraw requirement.
- **special:** collar mark is near jaw/neck side; belt line crosses the forearms and is not visible belt width. Much of the belt is obscured. Screen neckline near(227,145), belt center near(211,201), approximately ±8–12px: length58px, ratio .65; recorded boot ratio .60 is compatible. Re-mark another frame with unobscured belt/torso if available. Existing .357/.327 ratios are invalid; no anatomical failure established, no final factor supplied.
- **charge:** marked f0 points are substantially more plausible than the above. Central ratio spread alone is not conclusive given reference uncertainty. Existing neutral-to-combat loop discontinuity remains a genuine hold independent of scale. A diagnostic factor must come from revised interval calculation, not an arbitrary midpoint.

All replacement coordinates above are independent visual screening estimates to direct precise re-marking, not accepted sidecar values or audited final-pixel measurements. Preserve current sidecars and write corrections as errata/new evidence. Prioritize actual quantized fixtures of re-marked outputs. Hidden joints remain unmeasured; ordinary projected pose widths alone do not require redraw.
