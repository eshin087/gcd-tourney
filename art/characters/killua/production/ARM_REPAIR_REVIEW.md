# Killua heavy v04 — targeted arm and hand repair

The user identified the fourth, fifth and sixth sprites as unnatural. This version replaces only those poses (zero-based f3/f4/f5), selected from three built-in imagegen edits. heavy v03 is rejected and archived; heavy v01 remains approved. Charge v07 is unchanged and still unapproved.

- Identity: silver hair, blue eyes, purple/navy costume and child build remain.
- Pose: f3 has a continuous diagonal shoulder–elbow–wrist rake; f4 carries a neutral wrist overhead; f5 draws the claw back to shoulder height in a compact recoil. The packed 2× comparison preserves visible hand silhouettes.
- Technical: 8 frames, phases 3/2/3, all timings, bodyHeight206, pivot[128,240] and ppu128 unchanged. No engine or gameplay-number edits. Hand-local active hitbox overrides track the new hands.

## Evidence and limits

The selected source is raw/_parts/heavy_v04_middle.png (all three corrected poses). The complete strip and required A/B parts are immutable v04 files. The sidecar records estimated skull crown/chin axes under hair, a common source120px to final30px factor, and uncertainty of roughly4sourcepx. This calibration is anatomical, not bounds-based shrinking. Horizontal offsets are f3−15px and f4/f5−9px; all vertical offsets are zero. The skip pivots differ by6px between f3 and f4, then remain equal through f5.

Unchanged packed-frame PNG hashes match for f1/f2/f6/f7. f7 still exactly matches approved idle f0. f0 retains its geometry and placement; reimport removes two isolated pixels. Charge frame files are unchanged. The complete atlas is quantized globally, so exact palette RGB equality of untouched atlas cells is not guaranteed.

Focal visual review:
- f3: clearer upper-arm, elbow, forearm and wrist continuity; compact fingers point along the ascending motion. Fingertips remain toward the high portion of allowed y58–86 contact band rather than preferred y78–86.
- f4: wrist no longer sharply hooks sideways and the hand clears the hair; fingers are more extended than the preferred hooked claw. This is an explicit remaining art caveat.
- f5: bent elbow and hand near the shoulder replace the stretched grabbing pose; lowest point stays under the hips.

Raw pixel-art gate remains open: assembled heavy v04 has31,899 non-magenta RGB colors; the selected source has113,123. Strict packing produces48 colors; this does not establish raw hard-pixel compliance. No new clipping warnings. Existing KO left1px-margin warning remains. Skull anatomy beneath the hair is estimated and requires human review.

The v04 cast lineup is art/scale/lineup-killua-heavy_v04.png. Approved idle child-class values remain SBR.352, DR.23, MWR.46. The old Gojo idle still fails its separate build gate.

## Review

- /killua-heavy-charge-review/ contains actual candidate assets, enlarged packed before/after comparison (v03 top; v04 bottom), playback and lineup.
- arm-repair-import.txt / arm-repair-pack.txt record source selection and warnings.
- arm-repair-before-after.png shows the three requested poses after strict48-color packing.
- arm-repair-metrics.json records palette counts, preservation and remaining gates.
- arm-repair-build.txt records the production build.
- Fresh hosted browser results will be recorded in PR30 after the committed preview publishes.

Recommendation: review the improved arm motion and hand silhouettes, with the extended f4 fingers, upper contact height and raw-palette limitations visible. No approval or merge is implied.
