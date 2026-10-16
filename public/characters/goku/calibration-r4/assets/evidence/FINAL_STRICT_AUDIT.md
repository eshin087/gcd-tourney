# Goku relay9 final strict atlas audit

Astra, 2026-10-16. **PASS within measurement uncertainty for all22 selected animations /101 actual quantized frames, including heavy14. Light3v11 remains HOLD and is excluded.** Technical audit only; user design approval and runtime contact/timed playback remain separate.

## Exact output

- Normal strict fixture directory: production/reassembly-r03/final6-fixture-public/characters/goku/.
- sheet.png SHA256 f117d996d5d9f225b13bfc6d7b19a741e603fa04a329b1410422263eadd824f2.
- anims.json SHA256 2ee25e2a2103a145f1a888700b5e55cd19ddb0fd7a755649f1056226e6fdbbd6.
- Pack report SHA256 838df84a87fa9d8880dce6b88fc6c30fd57199e71e2a57be0ad4904f9bc01dfe; strict exit0, all scales/frameScales1,48colors. Only existing getup floor/contact warning remains; light3 is missing intentionally.
- Auditor independently extracted all101 exact cells and hashes in FINAL_PIXEL_HASHES.json and final-cells/. Retained93 alpha bytes are identical to prior public baseline fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054. RGB palette changed and all101 frames were independently visually inspected; mask equality was not substituted for palette review.

## Selected inventory

| Version | Frames | Body/scale result |
|---|---:|---|
| idle v02 | 8 | PASS within uncertainty |
| run v09 | 8 | PASS within uncertainty |
| dash v09 | 2 | PASS within uncertainty |
| jumpUp v04 | 2 | PASS within uncertainty |
| jumpFall v04 | 2 | PASS within uncertainty |
| land v07 | 2 | PASS within uncertainty |
| light1 v04 | 7 | PASS within uncertainty |
| light2 v05 | 7 | PASS within uncertainty |
| light4 v09 | 8 | PASS within uncertainty |
| heavy v14 | 8 | PASS within uncertainty |
| airLight1 v07 | 5 | PASS within uncertainty |
| airHeavy v06 | 6 | PASS within uncertainty |
| guard v05 | 2 | PASS within uncertainty |
| hurtHigh v08 | 3 | PASS within uncertainty |
| launched v08 | 2 | PASS within uncertainty |
| down v05 | 2 | PASS within uncertainty |
| getup v11 | 5 | PASS within uncertainty |
| charge v05 | 4 | PASS within uncertainty |
| beamCharge v07 | 3 | PASS within uncertainty |
| beamFire v07 | 3 | PASS within uncertainty |
| special v05 | 8 | PASS within uncertainty |
| win v05 | 4 | PASS within uncertainty |
| light3 v11 | excluded | HOLD: actual clipping at supported density |

## Heavy14 final finding

Raw source SHA256 e6402a00a760d5262553e977f16ebfa9ca14523a3aa1b394b678019676310adc. Uniform source factor.720 derives from median.719591 of nine visible torso/boot/belt ratios across f0/f6/f7, documented in HEAVY_MULTIFRAME_ESTIMATOR.json and verified endpoint overlays. It is not a bounding-box fit. Native bodyHeight235 produces x1; horizontal offsets f3–5 [-28,-35,-31], dy0, preserve complete punches at the same density. All eight actual normal-atlas cells checked: no clipping, neighbor fragments or unsafe top margin.

The approved native idle/title measurements remain torso38.1 +/-5, boot43.7 +/-4, belt36 +/-4; source readings +/-6. At.720, source f0 predicts torso36.8,boot43.7,belt36.0; recovery f6 predicts37.4/41.9/36.0, f7 predicts39.3/44.5/37.4. These agree within measurement/projection uncertainty and are supported by visual head/face, neck, exposed arm chains, chest/back build, baggy gi and complete boots in final pixels. Forearm projection changes across punch are inspected visually, not forced into the idle projected length. Hidden knee/ankle centers and rear-facing active collar receive no invented measurements.

All eight phase poses inspected: guard, crouched chamber, raised-arm wind-up, three active straight punches, two guard recovery poses. Final horizontal registration preserves contact reach without changing body dimensions. Last-frame-to-idle relationship is coherent. No runtime contact-zone or timing certification is claimed.

## Retained93 frames / shared palette

All retained frames rechecked at native256 against approved idle and exact title-style neutral/combat cells. Skin/gi/undershirt/belt/boot regions remain distinct and joint/face outlines readable. No new anatomy-size drift, clothing-volume change or palette-induced limb fragmentation found. Prior manual-audit-r3 findings and uncertainty remain applicable to unchanged geometry; this audit directly confirms their new final RGB appearance.

Static consecutive poses and last-to-first relationships of looping rows inspected: locomotion gait, aerial poses, guard/charge/beam loops and win sequence remain coherent; attacks retract to guards. Down/getup and launched retain prior anatomy passes, with the existing getup ground-contact warning left for Claude. Static seam review is not timed playback or game grounding validation.

## Light3 held result

Light3v11 remains outside this atlas. At source factor.62, complete roomy280 companion is anatomically coherent within uncertainty, but standard256 loses800 foreground pixels (f4 loses680). Source f4 height424 predicts262.9px. No consistent whole-frame anatomy enlargement supports a separate f4 shrink. Exact diagnostic hashes and all-frame source evidence are in DIAGNOSTIC_AUDIT.md, SOURCE_SCREEN.md and LIGHT3_ALLFRAME_SCREEN.json. This is a capacity/calibration hold with complete source artwork, not a claim that another image call is automatically required. No further iteration or call performed.

## Handoff boundary

These exact isolated normal-atlas bytes are audited; actual public/hosted adoption must match them. Changed pixels require recheck. Heavy14 awaits user image approval; light3 stays held. Parent owns committed preview, approval-desk request and one goku-luffy relay ring. Main AGENTS/inbox/relay state rechecked before handback; no ring sent by this subagent. No production assets/manifests/public outputs or source versions edited by auditor.
