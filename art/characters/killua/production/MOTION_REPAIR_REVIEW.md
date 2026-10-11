# Killua heavy v05 — attack motion correction

> Approval recorded2026-10-10: User approved all presented art on2026-10-10, including documented QA caveats; accepted art direction does not imply those technical deviations were repaired. Previous candidate-status language below is retained as production history.

The user rejected heavy v04 because it looked like reaching upward instead of attacking. v05 redraws f0–f6 into a low coil, shoulder-driven rising claw strike forward of the face, compact recoil and landing. The approved idle f0 is reused exactly as heavy f7. Charge v07 and all approval fields are unchanged. v04 source and sidecar are archived, with its original source parts retained.

Identity and anatomy: silver hair, blue eyes, purple/navy costume and the child-class build remain. The two selected built-in generations are Part A attempt3 and Part B attempt3, after three attempts each. Common anatomical scaling uses estimated skull-to-chin source lengths95px and128px respectively, normalized to30px; crown positions beneath hair are uncertain by roughly5sourcepx. No bounds-based shrinking was used. The sidecar records source hashes and axes.

Motion: f0/f1 crouch and rotate, f2 opens the torso, f3 drives the bent elbow and claw forward/up through chin height, f4 carries the claw forward at forehead height with a bent elbow, f5 tucks and draws the claw across the chest, f6 lands with normal fingertips. The silhouette avoids the former straight sky-reaching arm. The latest user direction permits this forward f4 finish instead of the earlier overhead y34 target. Hand-local hitbox overrides follow the new claws; gameplay numbers, durations, frame count and phase definitions are unchanged.

Placement: offsets f3−31px and f4−25px place the active claw in its forward corridor. f5+8px aligns the visually estimated pelvis center around x136 with f4 (uncertainty about4px), without blindly centering the differently folded feet. All vertical offsets are zero. Head scale is stable. The deep recovery tuck still makes a pronounced vertical silhouette change.

Remaining art gates:
- The two active poses are closely similar, so the120ms active interval has a held-strike quality. No timing edits were made.
- The anticipation hand stays forward instead of loading fully behind the hip.
- f5 has a pronounced tuck; judge continuity in the synchronized playback.
- Raw assembled v05 contains36,135 non-magenta colors; source A160,005 and B123,147. It fails the raw hard-pixel/palette gate. Strict48-color packing is not proof of raw compliance.
- Anatomical crown and pelvis landmarks are visual estimates, not exact skeleton measurements.

Technical evidence:8frames, phases3/2/3, durations40/35/30/50/70/70/60/30ms, bodyHeight206, pivot[128,240], ppu128. Strict pack succeeds with42animations/175frames and no new clipping warnings. Existing KO left1px warning and four pre-existing automatic hitbox fallback notes remain. heavy f7 PNG is byte-identical to approved idle f0; charge frame files are unchanged. Atlas-wide quantization can slightly change colors of other atlas cells.

The v05 lineup includes current packed f3 alongside the cast; unchanged Killua idle child-class values SBR.352/DR.23/MWR.46 pass. The existing Gojo idle build issue belongs to the separate Gojo batch.

Review gallery: public/killua-heavy-charge-review contains real candidate assets, full eight-frame v04/v05 comparison, synchronized original-duration animation, frame stepping, contact sheet and cast lineup. heavy-v05-pack.txt, heavy-v05-metrics.json and heavy-v05-build.txt hold mechanical evidence. Hosted checks are recorded in PR30 after publishing the committed build.

Recommendation: review whether the new forward claw slash reads as an attack in motion. This is an improvement candidate with the above unresolved gates, not an approval or a claim of complete KIT compliance.
