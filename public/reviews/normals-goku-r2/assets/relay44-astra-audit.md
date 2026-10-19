# ENG-112 Goku relay #44 — final5 Astra audit

Date: 2026-10-18. Auditor: GPT-6 Astra, medium. Scope: the exact 48-color packed diagnostic atlas for uTilt v04, uSmash v04, and dSmash v05. Each candidate frame and its loop endpoints were inspected against approved idle02 and same-kind live refs at one pixel density. This is static sequence inspection, not timed playback.

The temporary diagnostic manifest contains version-bound placeholder `scaleManualQA` entries solely to bypass Goku's intentionally manual head probe for inspection. Those placeholders are not evidence and were not copied into `art/manifest.json`.

- Sheet SHA-256: `483b083e04618147f6db1d94efab3d241b0f24553450e92f58bad172a80abac6`
- Metadata SHA-256: `6b08d31b1e31c91d96b5f396a8e795298f838da46691c9df7aeff9fe4526f0c2`
- dSmash v05 phases: `[2,2,4]`, placing its two bilateral split poses on active frames f2/f3.

## Findings

| Candidate | Verdict | Evidence |
|---|---|---|
| uTilt v04 | HOLD — body scale and contact | All silhouettes fit, with minimum top at y=25. Active f3/f4 show the overhead fist. Guard/recovery boots and lower body are smaller than idle02/light2/heavy; belt and torso also trend smaller, though their individual uncertainty overlaps. No disconnected anatomy or separate color-boundary defect. |
| uSmash v04 | HOLD — body scale and contact | All silhouettes fit, with minimum top at y=25. Active f3/f4 show the rising strikes. Boot size and recovery proportions remain small versus idle. No independent color-boundary or disconnected-anatomy issue. |
| dSmash v05 | HOLD — clipped active strikes | Both active frames f2/f3 contain low split poses with both legs extended, but both occupy x=0–255 and crop outer boot contours. No horizontal translation can restore the missing pixels. Guard heads and upper-body volume also read larger than idle; belt/torso alone do not establish a uniform scale defect. |

## Landmark estimates

Visible collar-center to belt-center, belt width, and boot cuff to toe were measured in approximate packed cell pixels. Concealed joints are not inferred.

| Comparable pose | Collar to belt | Belt width | Visible boot cuff to toe |
|---|---:|---:|---:|
| Current idle f0 | 38±5 | 36±4 | 44±4 |
| light2/heavy guard/recovery band | 36–41±5 | 34–39±4 | 41–46±4 |
| uTilt f0/f6 | 33±5 | 30–33±4 | 32–35±4 |
| uSmash f7 recovery | 34±5 | 33–36±4 | 29–33±4 |
| dSmash f0/f7 | 40–44±5 | 39–44±4 | 37–41±4 |

Boundary uncertainty is approximately ±2–4px for strike extremities; ground landmarks ±3–4px; rotation/occlusion can raise torso/limb endpoint uncertainty to ±5–7px. For uTilt, the combined reduced boot and guard stance is stronger evidence than hair height alone. uSmash's boot geometry remains reduced in recovery; crouching does not explain the boot-size difference. Pants obscure knee positions, so no thigh/shin certification is claimed.

## Diagnostic contact proposals only

Coordinates are `[x,y,width,height]`, in the packed 256×256 cell. Uppercut boxes replace the packer's generic body-height fallback. dSmash boxes cover only visible boot fragments and are not valid final contacts while the feet remain clipped.

| Candidate frame | Proposed rectangle |
|---|---|
| uTilt f3 | `[144,43,24,22]` |
| uTilt f4 | `[158,23,22,21]` |
| uSmash f3 | `[152,59,25,23]` |
| uSmash f4 | `[158,23,22,24]` |
| dSmash f2 left/right | `[0,211,55,30]`, `[211,207,45,30]` |
| dSmash f3 left/right | `[0,210,48,26]`, `[207,211,49,30]` |

No `scaleManualQA` passes or final hitbox overrides are authorized by this HOLD audit. Candidates are held under `raw/_qa_hold/`; stand-ins remain active. User image/design approval is separate from this technical audit.
