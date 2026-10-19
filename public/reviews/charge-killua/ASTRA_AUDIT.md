# Killua charge v15 — final Astra anatomy/scale audit

Date: 2026-10-19 UTC / 2026-10-18 Pacific. Auditor: GPT-6 Astra, medium. **Verdict: HOLD — body-scale validation remains unresolved.** This is a technical finding, not user approval or rejection.

## Version binding and method

- Raw charge_v15.png SHA-256: eee81e7655d1d63a3223f45cc1e79c2c335983b05db77d01a71aeef6f018b108.
- Quantized sheet.png SHA-256: 6408da250f82c522f8175ae16fea09dd44cc754773d251d020e06848f151e106.
- anims.json SHA-256: f384d3e85d1a4fc1e7174b415b333cfa5867ef599f5d07fc326c5ca138e7ca79.
- Inspected actual 256 px atlas cells 115–120, row 7, columns 3–8 (zero based), x=768/1024/1280/1536/1792/2048, y=1792. Idle f0 is cell 0, x=0,y=0. Exact unmodified crops are charge-f0.png through charge-f5.png and idle-f0.png beside this report.
- Compared at identical pixel density to public/art-review/title-style-pilot/killua-neutral_v01.png and killua-combat_v01.png under PRODUCTION_CONTRACT.md and ADR 0029. See atlas-reference-comparison.png; charge-detail-2x.png and segment-comparison-2x.png use nearest-neighbor display enlargement only.
- Read this atlas's scaleAudit and the version-15 body-report.json entry. evidence.json binds hashes, cell rectangles, reports and floor measurements. No production input or pack settings changed. No new image generated.

## Frame findings

| Frame | H, approved combat probe | B, idle garment-color metric | Inspection |
|---|---:|---:|---|
| f0 | 1.023 | .438 | Recognizable gather: hunched forward, tucked head, crossed low arms. Complete figure; hands overlap intentionally. Shorter posed envelope is expected. |
| f1 | .956 | .447 | Release opens arms down/out, spread crooked fingers, bristled hair, fierce open mouth. No detached effects. |
| f2 | 1.005 | .454 | Clear crouched power stance. Outfit and identity consistent; lower legs and torso need scale confirmation below. |
| f3 | 1.032 | .433 | Hair rises, mouth opens, upper-body breath. No extra limb or missing body part visible. |
| f4 | 1.016 | .439 | Tensed open hands and changed hair/hem. Same overall body and clothing identity. |
| f5 | .990 | .430 | Settles toward f2. Complete anatomy, no visible silhouette jump large enough to resemble the former spasm. |

Head probe verdict is `ok`, median 1.011. It is readable for this candidate; the fighter-wide manual count is not evidence of a manual charge probe. **No SCALE_MANUAL_QA.md or head exemption is warranted.** Head agreement alone cannot clear the body hold.

## Loop registration

- Metadata verified: six frames, durations 70/90/110/110/110/110 ms, loop true, loopFrom 2.
- f2–f5 floor y=240 opaque x positions are exactly 76–88 in every frame. The rear/right shoe terminates at y=238 in every frame, consistent with depth placement; it does not jump between floor rows.
- Shoes are not byte-identical: y220–240 changes from f2 are 445/350/261 RGBA pixels for f3/f4/f5. Most changes are shading and 1–2 px outline redraw. Left shoe x bounds 75–94/96/95/94; right shoe 150–178,151–179,150–178,150–178. This fits the brief's later allowance for 1–2 px outline variation, not the original literal identical-feet wording.
- Readable head-probe box centers f2–f5: (137,138.5), (136,137.5), (135.5,138.5), (136.5,139.5). Axis span x=1.5,y=2 px passes the stated head-center limit for this proxy. Hair-tip height varies more, intentionally.
- Knees/hips and hand roots appear stable within roughly 1–2 px; manual landmark uncertainty is ±2 px due to contours, fingers and cloth. This is a qualitative registration finding, not a certified exact ≤2 px hand-root measurement. Hair/hem have four visually distinct drawings and a settling return, not a two-frame alternation. No timed browser-loop playback was performed by this auditor.

## Anatomy, palette and unresolved scale

Identity, youthful slim build, white spiky hair, purple long-sleeved top, dark shorts and purple shoes remain recognizable across all six. No clipped hands, feet, hair or adjacent-cell fragments are visible. Occupied bounds are safely inside the cell except the intentional y240 soles. No aura/lightning/dust is baked into these sprites. Candidate clothing is substantially darker and more contrasty than idle/the approved combat reference; loop colors remain consistent.

The body-sheet median B=.439 is far outside the charge brief's .93–1.07 target. **It does not prove that the anatomical body is 44% size.** B is a square-root count of selected garment colors; the darker shading, arm extension and crouch can change that count. Visual comparison does not support interpreting .439 as a literal uniform scale factor.

However, segment inspection does not independently establish a body-scale pass: collar-to-white-hem projected span is approximately 30–34 px in hold versus roughly 38–42 px in idle/approved combat (landmarks ±2–3 px); exposed lower-leg spans also look shorter. Forward torso pitch and stronger knee bend explain some difference, but hip/knee joint centers are obscured by shorts and foreshortening. Arm chains are differently rotated and partly covered by sleeves. Exact segment lengths within ±6–7% cannot be certified from these pixels. Shoes retain comparable width; there is no basis to globally enlarge the whole sprite merely to repair B.

**Required resolution:** confirm the body-color mask coverage against this packed palette, and obtain defensible torso and limb segment measurements or a corrected candidate if actual proportions prove short. Keep the technical hold until that evidence resolves the mismatch. Do not silently change bodyColors, exempt the body metric, or call low-confidence landmarks a numeric pass.

## Recommendations

- No manifest scale change recommended on this evidence. Retain bodyHeight125 for the current version-bound comparison; do not derive a rescale from 1/.439. A uniform increase risks breaking the passing head size and shoe size.
- No scaleManualQA or head exemption. Head is automatically measured and passing already.
- Preserve v15 and these exact crops. Reaudit any changed pack using its new atlas/anims hashes. User image approval remains separate, and Claude owns contact/hurtbox and game-loop validation.

## Follow-up: measured palette mismatch (same atlas hash)

A broader diagnostic on the existing packed pixels supports **palette mismatch, not a demonstrated 56% anatomical shrink**. The declared bodyColors target light lavender (documented HSL 255–290 degrees, saturation >.45, lightness .58–.8). The candidate's dominant shirt pixels are RGB (132,97,187), (121,75,173), (83,39,120), much darker than that target.

Diagnostic method: count opaque pixels in x65–189, hue 245–295 degrees, saturation >.2, lightness .2–.8, using shirt-height bands: idle y120–164; release y153–194; f2–f4 y155–195; f5 y156–195. This is an explicit alternate diagnostic, **not a change to the project metric**. Bands avoid most hair, shorts and footwear but include sleeves; they are pose-specific and are not a skeleton measurement.

| Frame | Broad purple pixels | sqrt(count / idle1643) |
|---|---:|---:|
| idle f0 | 1643 | 1.000 |
| charge f1 | 1492 | .953 |
| charge f2 | 1481 | .949 |
| charge f3 | 1457 | .942 |
| charge f4 | 1469 | .946 |
| charge f5 | 1425 | .931 |

The hold/release garment footprint is therefore compatible with the requested .93–1.07 band under a broader color mask. The original B=.43–.45 cannot be used to demand a redraw or global enlargement. This does not by itself certify all limb lengths: the more strongly bent pose has hidden joints, and the measurement uncertainty is larger than a ±6% segment gate.

**Refined disposition:** visual anatomy/proportion comparison is plausible under crouch and foreshortening; no specific redraw is justified. The technical HOLD is limited to unresolved quantitative body/segment certification under the stated brief. A documented acceptance of the pose-specific palette explanation plus defensible segment evidence could clear it without new art. If the parent/Claude uses a visual-only criterion, report that criterion explicitly rather than claiming the original B metric passed. No manifest scale change is supported.
