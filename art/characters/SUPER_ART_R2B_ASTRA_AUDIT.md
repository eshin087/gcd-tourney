# Super Art Round 2b Astra Audit

Date: 2026-10-16. Scope: Goku and Luffy `super_fg_v01` and `ult_fg_v01`, raw sources plus actual candidate-fitted outputs. Compared against approved Goku title-style v02 and Luffy title-style v01. This audit is technical evidence only and does not approve or reject any image.

## Findings

| Candidate | Visual reading | Technical / anatomy finding | Verdict |
|---|---|---|---|
| Goku `super_fg_v01` | Golden hair, teal eyes, clenched teeth, blue undershirt/wristbands and cocked fist read correctly; adult build recognizable. | **12,461 colors** in 384×240 fitted output, above the 48-color contract. Both arms cross raw canvas boundaries (107 foreground pixels at left, 37 at right); truncation remains after fit. | HOLD |
| Goku `ult_fg_v01` | Full figure, cupped hands, golden hair and blue-white energy read as Kamehameha. Boots, trousers and limbs intact; raw silhouette has margins on all edges. | **21,178 colors** in 576×432 fitted output. Muscular arm and shoulder volume looks heavier than the approved leaner cells; pose foreshortening prevents confident numeric anatomy measurement. | HOLD |
| Luffy `super_fg_v01` | Straw hat, left-eye scar, open vest, flush, steam and fierce grin read clearly. | **11,703 colors** in 384×240 fitted output. The eyes are rounder/more emphatic and shoulder/chest treatment heavier than the approved wiry reference. Both arms cross raw canvas boundaries (365 foreground pixels left, 102 right); truncation remains after fit. | HOLD |
| Luffy `ult_fg_v01` | Inflated arm is appropriate for Gear Third; torso, shorts, legs, hat and sandals retain identity. | **15,587 colors** in 576×432 fitted output. Right sandal meets raw right boundary for 15 foreground pixels, leaving a small crop; left-eye scar is not confidently resolved at fitted size. | HOLD |

All four fitted cutouts have binary alpha, zero opaque exact-magenta pixels and zero pixels matching `R>180, B>180, G<100`. Output dimensions and bottom alignment pass. They are not 48-color quantized. Smooth source color variation drives the high color counts despite hard stepped contours. Approved Goku/Luffy `select.png` and `portrait.png` were not present, so this comparison remains unavailable. No mobile/game composite was audited. Body-height comparisons are inappropriate across these UI poses.

The candidate packer run completed with zero warnings and emitted all four contract dimensions for both characters. Missing animation strips were expected in the isolated scratch root; this does not establish in-game integration.

## Backdrop color counts

Opaque RGB color counts in the actual fitted outputs also exceed the 48-color brief limit: Goku SUPER 55,248; Goku ULT 159,721; Luffy SUPER 45,130; Luffy ULT 114,906. Luffy SUPER is below 48, but still has far more than 48 colors. Hard-pixel rendering / color-reduction review is pending for all backdrops; some texture reads painterly. These were mechanical distinct-color counts, not a pixel-grid visual audit.
