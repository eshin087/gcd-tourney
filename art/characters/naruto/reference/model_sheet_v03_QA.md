# Naruto model_sheet v03 review evidence

Generated with built-in imagegen; selected attempt 2 of 3. Original raw saved unchanged. Approved fixed files and all animation sources remain unchanged.

## Manual anatomy check (source pixels, estimated landmarks)

Front view skull crown about y286 +/-4 (occluded by hair); chin y344 +/-2; sole y704. Standing skeleton about418 +/-4 px at requested 2x, versus400 target: about4.5% high. Skull-to-chin about58 +/-6 source px, or29 +/-3 at2x; about7.2 heads, with uncertainty because hair hides skull crown. Target57.14 source. No precise 8% shrink claim is justified from hidden landmarks. Identity preserved: compact blond spikes, cheek marks, black collar/headband, orange costume, back spiral and holster. True side profile present.

Candidate stance lineup is a crop (x1200,y220,w310,h510) at declared0.5 scale, not rescaled by eye. It measures210px silhouette height with hair, band78px/SBR0.390 (teen guard band0.37-0.45 passes), width128px/MWR0.61 (wider stance than approved0.51; caveat). Manual neutral front deltoid span about116-124 source pixels, or58-62 at2x; DR0.29-0.31 in teen0.29-0.33 band. Candidate DR printed by lineup is inherited build metadata, NOT a new automatic measurement.

Raw unique RGBA colors: 115267; exceeds48, antialiased edge/color variation persists and swatch count is not strictly34. Palette families match, raw palette specification does not pass. No quantization or editing of raw source. New model has no runtime animation; pack/heads checks below describe EXISTING approved animation set only, not a gate for this candidate.

Recommendation: request a correction before approval. The seven-head direction reads, but source-scale/palette/stance-width caveats remain. Require measured200px skeleton and new approved-idle anchor before drawing other strips. Do not approve as a technically exact production reference without accepting or correcting these deviations.

## Technical verification

Existing Naruto pack `node tools/pack-sprites.mjs naruto --quantize 48` completed 1/1 with four inherited warnings: ko margin, superPose baseline drift, down floor contact, ko floor contact. 17 existing strips remain scale-flagged; these await the post-idle redraw. No new animation created. Heads report produced. Ordinary npm build hit Windows realpath EPERM; production build passed via local sandbox adapter (77 modules). Browser connection to local review page timed out; source images and generated lineup were visually inspected directly.

Lead visual check: visible magenta edge fringe remains around ties/legs in the candidate lineup. This is a raw-background/clean-preview defect, not a passed crisp-palette gate. Skeleton estimate above is measured from upright view1, independently of stance silhouette height210px.

Final attempt3 requested400px skeleton,57px skull and flat48-color edges; it retained the oversized source layout and109276 RGBA colors. It did not resolve the technical failures, so it is not filed as another version. Candidate v03 remains the selected identity/layout reference.
