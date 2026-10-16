# Win09 final quantized-atlas anatomy audit

**HOLD for strict numeric certification. No robust redraw-level defect established by this audit.** GPT-6 Astra, medium; 2026-10-14. Source commit `3ac8bfa154f520180ae895f04907298a4df5995b`. Sheet and metadata match Claude's supplied hashes (full provenance in audit.json). This is not user art approval.

All four win09 frames (atlas150–153), every adjacent transition and wrap were inspected from the actual quantized atlas. The exact approved neutral/combat cells, approved idle07 strip and packed idle f0 were inspected. Neutral is the appropriate upright torso comparator; combat/idle are bent and cannot replace it to make the upright torso pass.

## Decision and uncertainty

The redraw materially restores the upright jacket length, leg volume and footwear missing in win08. H is approximately40 versus neutral39, compatible centrally. Upright collar-to-hem T is46.0–47.0 versus neutral50.4: central ratios0.913–0.933 sit slightly below0.94. Candidate endpoints each support about±2px length ambiguity; neutral conservative48–53. Therefore the uncertainty-aware ratios overlap the accepted band: this is a borderline unresolved measurement, **not a robust proven below-6% failure**, and not a numeric pass. In particular48/48=1 is feasible; taking the worst extremes is not evidence that the true value passes.

Right profile shoe heel-to-toe endpoint distance is approximately28–29 versus neutral29 (30 occupied columns), with conservative candidate27–30 and reference27–31. Claude's30–31 reference reading uses slightly different silhouette endpoints; a one-pixel inclusive/exclusive convention matters at this size. Central same-method ratios0.966–1.0 are compatible, but the uncertainty does not certify±6%. Left shoes are toe-facing; their narrow projected width is explicitly excluded.

No evidence supports spending another generation call solely on this audit. A rigid all-segment±6% pass is unavailable: clothed joint centers and raised-arm depth projection are unresolved. The root should retain HOLD and send the borderline torso measurement/endpoint evidence to Claude or seek an explicit manual-review policy decision. Do not silently treat this as technical clearance, art approval, or proven need to redraw. A head-only pass cannot clear it.

## Every frame, native pixels

H=crown/hair-to-chin; T=collar-to-jacket hem; arms=upper/lower projected segments; legs=thigh/shin projected segments; S=profile heel-to-toe. Left/right identify screen sides, not anatomical laterality. Arms each±6px and legs each±7px due clothing/hidden joints. These ranges are measurement limitations, not tolerance relaxations. Coordinates and overlays are supplied.

| Frame | H | T | Left arm | Right arm | Left leg | Right leg | S |
|---|---|---|---|---|---|---|---|
| 0 | 40 [38–42] | 46.0 ±2 | 21.0/13.9 | 31.0/17.5 | 32.7/31.4 | 36.8/27.1 | 28 [27–30] |
| 1 | 40 [38–42] | 47.0 ±2 | 20.6/25.0 | 31.0/17.5 | 32.7/31.4 | 36.8/27.1 | 28 [27–30] |
| 2 | 40 [38–42] | 47.0 ±2 | 20.6/25.0 | 31.0/17.5 | 32.7/31.4 | 36.8/27.1 | 28 [27–30] |
| 3 | 40 [38–42] | 46.2 ±2 | 25.0/19.6 | 16.6/18.0 | 32.7/31.8 | 37.2/27.1 | 29 [27–30] |

Reference projected estimates from the prior audit, visually rechecked for pose applicability: neutral UA/LA26.0/25.3, thigh/shin35.9/34.0; combat21.9/17.0,41.3/25.3; idle07 f024.4/18.4,40.5/26.0. Their±6/±7px uncertainties remain. Candidate hanging arms and legs look plausible in build/clothing volume, but their segment ratios cannot rigorously certify physical length. The new arm endpoints are wrist/cuff-centered; ambiguous elbow/shoulder landmarks can differ from the earlier audit. No claim is made that a shorter projected bent arm is physically shorter.

Explicit exclusions by frame: f0 left arm bent across chest; f1/f2 left upper arm raised and partly foreshortened/overlapped by head/shoulder; f3 right arm bent toward face. Both sides are nevertheless recorded as projected estimates. Hip/knee centers are hidden under jacket/trousers in all four; no reconstructed bone lengths. Every torso is three-quarter and alternating shoulder elevation prevents a reliable frontal shoulder span. No frontal shoulder numeric pass. Upright T remains comparable to neutral despite those limb exclusions; raised-arm positions alone do not justify comparing T with crouched combat.

## Transition and wrap inspection

- 0→1: left fist moves from chest overhead; lower body and head scale stable. Large intentional pose jump.
- 1→2: overhead hold with expression change; no gross scale pop.
- 2→3: raised fist switches sides, other arm drops; visible pose jump with small lower-body x differences.
- 3→0 wrap: left fist returns to chest, right arm drops; visible snap, no missing limb or scale inflation.

All extremities remain within their actual atlas cells; no cross-cell cut or clipping found. Durations110/90/260/180ms, loop=true. `win09-loop.gif` preserves these metadata durations as a diagnostic export. Static pair/sequence inspection and exported timing are not live in-game/browser playback or Claude contact validation.

## Evidence and boundaries

`reference-2x.png`, `win-2x.png`, native crops, pixel grids and per-frame landmark overlays are derived from exact inputs; they are diagnostic evidence, not generated art candidates. audit.json records source/reference hashes, native endpoints, uncertainty, exclusions and transition findings. Only this new audit directory was written. No source generation, packing, calibration, sidecars, manifest, hitboxes, public outputs, approvals, commits, merge or deployment was performed.

Visible pose/anatomy supports a clearly labeled user in-game manual review of win09 with unresolved torso-edge and clothed/foreshortened segment measurements, if the coordinator/user authorizes that review route. It does not support advertising a fully passed corrected preview. The only comparable central residual is upright T46.0-47.0 versus50.4 (about6.7-8.7% short); uncertainty prevents a robust failure claim. No robust visible anatomy defect independently requires another redraw.
