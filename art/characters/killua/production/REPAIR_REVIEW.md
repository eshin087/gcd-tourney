# Killua heavy v03 and charge v07

## Review verdict

- Identity: the approved silver hair, blue eyes, purple/navy outfit and child build remain. Normal fingertips return on heavy f7 through exact approved idle reuse.
- Pose and scale: heavy f4 no longer clips; its highest claw pixel is y32. Heavy f7 is byte-identical to approved idle f0. Charge feet stay on y240, with footprint endpoints within ±1px of the common median reference; pairwise extremes differ up to2px. Shoulders, fingers and tufts visibly twitch.
- Technical: 42 animations,175 frames,48 colors,4096×2816 atlas;256px cells,pivot[128,240],ppu128. No new pack warnings. Raw sources fail the hard-pixel palette gate: heavy v03 has 30,997 and charge v07 has 157,775 non-magenta RGB colors. Packed 48-color compliance does not establish raw pixel-art compliance. Previous KO left1px margin warning remains. Art is **unapproved**; user review still controls promotion.

## Corrected issues

The failed heavy v02 and charge v04/v05/v06 are rejected as correction history, preserved in raw/_rejected with review rows. Approved heavy v01 and charge v03 remain approved; no approval fields or fixed reference files were changed.

Heavy v03 retains six v02 poses at their calibrated pixel scale. Its overhead f4 is a built-in-generator single-frame repair, selected from three attempts (the second best matched the raised-claw brief). The selected original is heavy_04_fix01.png; the review row covers that source and the assembled strip. Skull axis estimated between[468,357] and[502,538],184.17sourcepx, normalized to30px. This is an anatomical estimate, not pose-bounds shrink-to-fit. The source's crown is obscured by hair, so human verification remains necessary. Final f7 reuses approved idle f0 exactly, removing the13px recovery size pop. Its PNG bytes and bounds match idle f0: [86,59,172,240].

The strip and A/B assembly parts are preserved as v03. Horizontal frameOffsets f3+6,f4+10,f5+6 align the skipping feet and raised claw; all dy=0. Active hitboxes follow hands rather than the prior knee/swoosh: f3[185,64,22,27],f4[159,32,22,27]. The f3 claw is near the upper part of its allowed y58–86 band, above the brief's preferred y78–86; judge chin contact in gameplay. f4's contact is no longer cropped.

Charge v07 is the third attempt in this correction round; the first was preserved as v06 before further refinement. All four faces/skulls use a common110sourcepx visual estimate, target30px. Crown-to-chin coordinates are recorded in the sidecar, with explicit uncertainty under hair. Final hair-bound tops are y82 in all frames (a proxy, not proof of skull position). Foot-band endpoints: [82,178],[83,177],[83,176],[82,178]. Relative to median[83,177], each endpoint stays within1px; these are not pixel-identical feet, and pairwise variation can be2px. No bodyHeight,ppu,animation count or timing was changed.

## Cross-cast anatomy

Declared standing skeleton182px. Bent attack/charge poses do not supply a direct standing-body measurement. Unchanged approved idle is182px including hair in f0 and up to186px in the loop; do not substitute those bounds for skeleton height. Killua's approved idle child-class lineup measurements: SBR .352 within .30–.38,DR .23 within .21–.26,MWR .46 above .40. The new heavy appears at the same cast scale in lineup-killua-heavy_v03.png. Existing Gojo remains flagged while his separate build redraw is pending.

## Evidence

- repair-import-final.txt and repair-pack.txt: latest candidate sources and warning history.
- repair-contact.png and repair-metrics.json: all touched frames, bounds and exact recovery equality.
- ../../../scale/lineup-killua-heavy_v03.png and .json: mandatory cast review.
- /killua-heavy-charge-review/: committed public candidate gallery, playback and full lineup. It carries actual assets because deployments exclude art/.
- Browser and build results are recorded in browser-repair.json and repair-build.txt. Hosted CUA observed the custom sheet in the lab, stepped all eight heavy and four charge frames, ran launcher and held-charge moves, and completed the scripted light-chain / launcher / air-chase scenario (7 hits, 192 damage), with no captured console errors. This is a playback/transition smoke test, not exact contact-timing validation.

Generation used the built-in image tool and the full KIT.md heavy/charge briefs with approved references. This correction round targeted the overhead reach/open claw, the recovery idle mismatch, and locked charge lower bodies. Historical staging reports remain historical and are not the latest verdict.
