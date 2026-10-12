# Gojo run v10 — bounded redraw, needs review

User scope: existing art/gojo-title-production worktree / PR72, main merged first. Only run and its review/QA bookkeeping changed. Claude owns integration and production.

Approved inputs: idle_v06 (user's title-style batch approval) and public/art-review/title-style-pilot/gojo-neutral_v01.png. Eight frames, A f0–f3 and B f4–f7, magenta sources. A used its one remaining call; B used both additionally authorized calls. B attempt1 repeated the near-leg lead; selected B attempt2 improves foreground limb overlaps and opposite arm swing but still does not establish a clean opposite-leg half-cycle. No more calls authorized. Historical v09 B remains unchanged.

Stitch: npm run stitch -- gojo run v10. Four whole figures in each part. Measured B/A factor1.0115; A downscaled0.9886, B unchanged. No hand/foot fragments from assembly.

Strict production command: node tools/pack-sprites.mjs gojo --quantize 48 --strict-scale. Exit1: existing airLight3v10 and airHeavyv07 gate failures. Run v10 is not flagged; no character atlas or cleaned frames written. Existing UI pack outputs may be rewritten by the command, but were not included in this change.

Isolated idle/run fixture uses unchanged production gate settings and the same versioned inputs, without exemptions or warn-mode overrides. Strict quantize48 exits0 with 1ref/1ok. This is a PARTIAL QA atlas, not a full fighter pass. Reproduce with the commands in reproduce.mjs. Fixture copies are disposable and omitted from the commit.

Actual quantized run bounds: heights219,220,220,214,219,221,221,218px (idle234–235); x bounds55–196,70–171,106–186,39–183,38–184,67–172,99–190,44–195. All eight lie inside x4..251, soles y240; no clipping. The crouch-size collapse is corrected.

Head probe against idle35x22: median0.959; frames0.955,0.963,0.971,0.955,0.971,0.975,0.914,0.955. Normal6% median/12%pop gate says ok. User's stricter2% target is NOT met; f6 is especially small. No exemption or false numeric pass. A uniform enlargement would also enlarge the body/boots and exceed the intended run-height range; it was not promoted.

Native loop: source pose phases and arm overlaps change across halves, but forward/rear leg topology is still ambiguous/repeated in several frames. f3→f4 and f7→f0 transitions remain visible. Do not call the requested stride alternation fully solved. Recommend HOLD, not approval, despite improved upright posture and normal automated gate pass.

Heads sheet: scale/heads-gojo.png is generated from the actual isolated packed v10, not the stale game sheet. lineup-gojo-run_v10 shows the new f0 as a candidate beside currently packed cast idles; its historical build-band warnings are not the title-style anatomy contract. Review page also includes the exact approved Gojo neutral next to the new idle/run at identical pixel density.
