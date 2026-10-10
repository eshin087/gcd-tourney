# Gojo model sheet v06 — needs review, correction still recommended

2026-10-10. Real worktree `art/gojo-build`, based on main. Best of three new built-in image-generator attempts (attempt 2). This supersedes the old sandbox delivery limitations of the v05 report.

- **Identity:** white hair, black blindfold, compact adult face, tall zipped collar, silver zipper and navy uniform retained. Front and three-quarter neutral views now have arms out of the pockets; the side view reads closer to a true profile. The fighting view retains pocket hands.
- **Proportions and pose:** smaller than v05, but still fails the declared 2x source scale. The fifth view is 518 px including hair (v05: 623 px); estimated covered skull crown y267 to sole y745 gives about 479 px versus 430 ±5%. The skull landmark is inferred, not certified. Approximate 3/4 deltoid widths 145–155 source px are close to the 146–168 target in absolute pixels, but too narrow relative to this oversized skeleton. Head-to-height and limb gates remain uncertified. Do not approve the build based on the shoulder-band proxy alone.
- **Technical:** source 1536×1024, 84,170 RGB colors: fails the raw <=48-color requirement and hard-pixel purity. Original generation retained byte-for-byte. No geometry or palette alterations were used to conceal these failures.
- **Required lineup:** [exact half-scale](../../../scale/lineup-gojo-model_sheet_v06.png), with Naruto, Sasuke, Killua, current approved Gojo, then v06. Candidate is 115×260 (lineup background threshold) before placement and clips above the 256px cell. The candidate is deliberately named `candidate-v06` so the lineup tool does not inherit approved Gojo's deltoid measurement. Its clipped bounds are not valid anatomical ratios.
- **Runtime scope:** only the model sheet is new. Approved model v03, expressions v02, idle v02 and all production animation sources remain unchanged. No idle redraw was started. Packing validates the existing runtime sheet, not this reference image.

Recommendation: review the improved pose/identity direction; request another correction before production approval. The three-attempt limit for this round is exhausted. This candidate is `needs review`; no approval is implied by the PR or preview.

Evidence: [measured opaque bounds](model_sheet_v06-measurements.json), [strict pack log](model_sheet_v06-pack.txt), [generation prompt](model_sheet_v06-prompt.txt).

Validation: strict pack passed (42 animations, 175 frames, 48 colors, zero warnings); all five public Gojo runtime files remain byte-identical to HEAD. Vite production build passed (68 modules) through the documented local sandbox adapter.
