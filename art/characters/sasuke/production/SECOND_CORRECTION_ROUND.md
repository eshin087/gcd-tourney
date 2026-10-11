# Second correction round —2026-10-11

User approved12passing corrections, including Sasuke superDashv04; approval applied to manifest/REVIEW. User authorizes up to3 MORE built-in image generations per failed strip: charge, special, specialForward. New pixels remain unapproved. getupv04 stays unchanged for Claude manualQA. No thresholds/exemptions/scaleFit/builds/manualQA changes.

## Final selected set and checks

Combined strict pack after restoring best specialForwardv06: exit1; 42animations/175frames,1ref,29ok,7existingmanual,3existingexemptions,1unmeasured(getup4),1pop(SF6). Production atlas/frames not written. [Exact report](second-round-strict.txt).

- chargev09: **ok**, every head .936–.962, range .026;1/3new calls used. Bodies preserved (below-source-y330 silhouette overlap99.5% vs v08).
- specialv10: **ok**, every head .941–1.029, range .088;3/3new calls used. All8frames visually checked against idle; original A preserved, B hair edits retain athletic body/limbs and canonical poses.
- specialForwardv06: **hold**, heads[1,1.003,1.057,1.057,1.086,.941,.937], range .149.3/3new calls used. v07(.86–1.15) andv08(.62–1.06) technically rejected and archived; v06 best. Manifest newest version8 retains history; selected source6.
- superDashv04: **approved**, user approved12passing corrections including this one; approvedVersion4 applied. No new pixels.
- getupv04: source/sidecar unchanged; Claude manual QA pending. Check final guard-to-idle height; bent stance is plausible but not certified.

No thresholds, exemptions, manualQA, scaleFit, build declarations or tool/engine edits. No manual stitch factor. Automatic measured stitch with current-idle scratch reference and --counts3,5 or4,3. Existing skull sidecars retained because edits target hair only; measured stitch scale applied to source skull values.

## Measurement limitation for Claude

Resampling/palette sensitivity is a HYPOTHESIS, not a proven tooling bug. The intended-unchanged first SF recovery head varied in probe reading; direct source comparison found silhouette overlap98.4% but exact pixel match only6.5% in ROI[360,70,530,250], so generated palette changes can also contribute. [Source comparison](second-round-source-comparison.json). No gate bypass applied. Source anatomy remains plausible; keep strict hold until independently resolved.

[Prompts/caps](second-round-attempts.json). [Review gallery](../../../../public/art-review/sasuke-corrections-r2/index.html), [contact](../../../../public/art-review/sasuke-corrections-r2/contact.png), [heads](../../../../public/art-review/sasuke-corrections-r2/heads.png), [lineup](../../../../public/art-review/sasuke-corrections-r2/lineup.png). Diagnostic gallery is current; game retains prior successful atlas. Lineup cast columns are historical atlas, appended chargev09 is current candidate. Build passes. Claude alone integrates/merges/deploys production.
