# Gojo: authorized correction round, 2026-10-11

Scope: inbox "Redraws after the user's yes to all (2026-10-11)". Up to three additional image generations per strip, including both calls for a long strip. No thresholds, exemptions, manual-QA records, scaleFit or builds.json edits. New versions require user visual approval.

Current branch starts at Claude commit4cc79b4. Approved fixed idle was stale: refreshed idle_approved.png from approved raw/idle_v04.png and regenerated head_scale_guide.png from a diagnostic pack containing that idle. The guide now measures hair34x20px and occupied height233px; old guide showed30x18 and221px. This applies existing approval; raw idle and scale baseline are unchanged.

Diagnostic output uses a manifest COPY with scaleGate=warn plus --no-writeback, as directed in the inbox. Release checks always use real manifest --strict-scale. No diagnostic result is a strict pass.

| Strip | Additional calls | Correction |
|---|---:|---|
| charge | 1 | Hair-only reduction to91% in all four poses; body/face preserved. First call preceded discovery of stale fixed idle; target strip was preserved and final validation uses current approved idle. |
| win | 1 | Hair-only +7% f0/f2/f3; preserve f1 and all bodies. |
| airHeavy | 2 | PartA f2 hair89%; PartB f3 hair91%; preserve other poses. |
| airLight3 | 2 | PartA hair+10/+14/+14%; PartB +14/+11/+20%; preserve skull/body. |

Built-in imagegen used for every image correction. Percentage prompts are requests, not measurements; final gate and visual QA determine acceptance. Long parts will be stitched using current-idle scratch atlas and explicit counts3,3. No source image is overwritten.

## Final selected result

charge v06 head0.972/range0.029; airHeavy v06 and win v06 numericok (exact per-frame numbers in correction-scale/scale-report.json). All14 passing-candidate cells visually inspected: long lean torso/limbs retained, hair stable, no clipping/margin warnings. Pixel-diff counts show regenerated colours throughout, so no byte-identical-body claim is made; pose/anatomy preservation is visual evidence.

AirLight3 used its third extra call for two isolated f2/f5 replacement frames (PIPELINE Fixing frames), mechanically patched into new A/B parts then officially stitched. The generated canvas changed1664x793 to1816x866, normalized by1664/1816 with evidence in airLight3-v06-patch.json. That correction overshot: head0.85/0.78 on patched frames, and f2 clipped1px. V06 is retained under _rejected; v05 is the better retained technical hold (head1.03-1.19). No additional calls are authorized. Both attempts remain in REVIEW; no exemption or scale fitting was added.

Final strict command: node tools/pack-sprites.mjs gojo --quantize 48 --strict-scale; exit1 solely airLight3. One idle ref,32ok,8Claude manual,1pop. Production atlas remains its prior pack, not these diagnostic candidates. Remaining legacy notes: baseline head34x21 versus historical31x18, beamFire old override rescale, two active hitbox fallbacks. Claude owns these integration checks; baseline/builds unchanged.

Review page public/art-review/gojo-corrections uses scratch output explicitly labelled diagnostic. Its animated rows compare every candidate with current approved idle at the same pixel scale. The npm lineup artifact shows the current idle candidate beside historical local cast atlases because lineup has no scratch-public option; it is not the other branches' new cast or a full passing-pack claim.

Additional calls used: charge1/3,win2/3,airHeavy2/3,airLight3 3/3. New image approvals remain pending.

Validation: production build passed. Local correction gallery loaded all four candidates; pause and keyboard frame scrubbing worked, with no browser console errors. Full strict pack remains exit 1 as documented above.
