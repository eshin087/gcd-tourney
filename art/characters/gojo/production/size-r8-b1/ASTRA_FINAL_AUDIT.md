# ART-SIZE-R8 B1 — Gojo light1 v08 final Astra audit

## Result

**HOLD for full anatomy/scale clearance.** The user-approved drawing and the user-accepted reach remain valid. The earlier severe short-body problem is substantially improved, and the strip is fully contained. The actual quantized cells still show a smaller head in several poses and a larger front-shoe silhouette than idle. Clothing and pose occlusion prevent a reliable segment-by-segment numeric pass. Claude's runtime contact and grounding check also remains open.

This is a technical hold, not a rejection or a request for another drawing. No pixels or hitboxes were changed for this audit. The user's decision via Claude relay `audit2 #3` was: “Approve, keep reach.” It accepts the current v08 reach as drawn; it does not clear the independent anatomy/scale or runtime checks.

## Audited artifact and method

- Character/animation: Gojo `light1` v08, all seven frames and the full return to idle.
- Evidence: actual 48-color quantized production atlas, compared with the packed approved idle and the approved title-style Gojo neutral/combat cells at the same pixel density.
- Atlas SHA-256: `93B73C1C7236FD23792EFE263D97D02431CA76A6C084B8C78D50019A819E9E67`.
- Packed cells: 30–36. Phases `[2,2,3]`; durations `[30,30,40,50,50,50,30]`; no loop.
- Scale report: head ratios by frame `.914, .914, .943, .963, .955, .914, .943`; median `.943`. These are hair-mask probe ratios, not skull-length measurements, and the mask has pose-dependent uncertainty.
- Body-area proxy B by frame `.879, .904, .922, .911, .944, .946, .952`; median `.922`. This advisory area measurement does not certify individual torso or limb lengths.

## Every-frame observations

| Frame / cell | Head probe | Visual anatomy and pose | Finding |
|---|---:|---|---|
| f0 / 30 | .914 | Coherent chest-level anticipation; near hand remains pocketed. Head reads smaller than idle. | Head-scale hold. |
| f1 / 31 | .914 | Shoulder, elbow and wrist remain connected as the palm launches screen-right. Head reads smaller than idle. | Head-scale hold; arm chain visually connected. |
| f2 / 32 | .943 | Extended arm and leg chains remain connected; directional smear resolves around the forward palm. | Anatomy coherent; accepted reach recorded below. |
| f3 / 33 | .963 | Smear resolves into an intact palm and arm. | Best head match in the strip; anatomy coherent. |
| f4 / 34 | .955 | Plausible elbow bend and palm withdrawal. | Anatomy coherent. |
| f5 / 35 | .914 | Hand lowers toward the pocket; front shoe remains visibly longer than idle. Head reads smaller than idle. | Head-scale and footwear hold. |
| f6 / 36 | .943 | Both hands return to pockets; the transition to idle changes head size, stance and hand placement rather than matching the idle endpoint. | Recovery is readable; loop is not applicable, but return-to-idle should be checked in runtime. |

Across the strip, Gojo retains the lean build, high collar, blindfold, right-facing view and two intact leg chains. Shoulder rotation and pocketed arms explain some garment-area reduction. Collar-to-hem is visually about `75–80 ±5 px` versus idle about `80 ±4 px`; the leg chains appear modestly shorter, not the earlier approximately 12% short, but clothing obscures landmarks too much to certify them at ±6%. No shoulder inflation or recurrence of the original roughly 20% torso shortening is visible.

## Head and footwear measurements

The head probe is below idle in all seven frames and falls to `.914` at f0, f1 and f5. The hair-mask probe can move with silhouette changes, so it does not isolate skull length; manual head landmarks remain uncertain. This residual, repeated head-size difference is enough to keep the full anatomy/scale result on hold.

The front-shoe raster spans `38, 39, 39, 40, 40, 40, 40 px` across f0–f6 in the y230–240 band, versus `36 px` on idle (`+5.6–11.1%`). The rear shoe is about `21–22 px` versus idle `21 px`. Pixel bounds are exact; mapping them to anatomical shoe length carries roughly `±1–2 px` uncertainty because of pose and perspective. The front-foot proxy is `1.079–1.125`; it supports the visible difference but cannot prove an anatomical length change on its own.

## Containment, contact and accepted reach

- Occupied bounds are x72–196, y19–240. There is no clipping or cross-cell contamination; every frame reaches y240. Crown variation is 3 px and the rear foot shifts left by 3 px across the sequence.
- The packed f2 palm occupies x175–196, y55–73; f3 occupies x179–191, y55–73. These are short of the original move-brief target x206–226, y64–86. The user explicitly accepted that current reach via Claude relay `audit2 #3`, “Approve, keep reach.” Do not treat that earlier target as a remaining rejection criterion or change the art/hitboxes for it.
- Hitboxes remain aligned to visible pixels: f2 `[174,54,24,21]`; f3 `[178,54,15,21]`. Visual placement is recorded; gameplay contact against opponents has not been verified in runtime and remains Claude's check.
- Grounding and the transition into idle also remain for Claude to verify in runtime. This audit does not certify gameplay contact or floor behavior.

## Disposition

Keep v08 marked **approved by the user** in REVIEW, manifest and TRACKER. Record this separate **Astra technical HOLD** for the smaller head at f0/f1/f5 and enlarged front shoe, plus Claude's runtime contact/grounding check. Do not redraw, resize, alter hitboxes, or infer further approval from this audit. B2–B11 and R4 are outside this audit.
