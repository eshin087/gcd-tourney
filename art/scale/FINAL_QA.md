# Fighter scale corrections — final candidate QA

Date: 2026-10-10. Task: ART-SCALE-01. Review status: **one final user visual review pending**.

## Delivered
- Naruto: 19 corrected animation candidates; Killua: 14 corrected animation candidates.
- Sasuke: all 42 animations / 175 frames available, including ADR 0011 Kirin, Sharp Spear, Lion's Barrage, counter and Amaterasu poses. 40 new animations and three UI candidates await approval; prior idle/run approvals remain intact.
- Gojo: original approved model v03 / idle v02 proportions preserved. All enlarged-head candidates rejected; none selected by the packer.
- Shared rules: [CHARACTER_SCALE.md](../CHARACTER_SCALE.md), linked from onboarding, prompts, pipeline and style guide. Character height differences remain intentional.
- Packer accepts per-frame skull-axis calibration and preserves it when loading cached frames. No runtime actor scale or gameplay-stat changes.

## Evidence
- [final-pack.json](final-pack.json): four complete sheets, **42 animations / 175 frames / 48 colors each**. Zero missing core animations and zero clipped-frame warnings.
- [final-inventory.json](final-inventory.json): selected source versions, raw/sidecar hashes and final atlas/metadata hashes.
- [final-tests.txt](final-tests.txt): **207 regression checks passed**, including changed-sidecar cache invalidation and repeat-pack stability.
- [final-build.txt](final-build.txt): full `npm run build` including art-index prebuild passed.
- [game-qa.json](game-qa.json): Edge loaded all four custom sheets; six match setups (four mirrors and two cross-cast matches), run/light/heavy/jump input transitions, all 42 actor animations exercised per fighter instance; no page errors.
- [browser-qa.json](browser-qa.json): all 42 comparison selectors exercised; 390px viewport has no horizontal overflow.
- [all-frames/index.json](all-frames/index.json): 24 contact pages cover all 700 packed frames. Every page inspected, with corrected rows rechecked.
- [cast-before.png](cast-before.png) / [cast-final.png](cast-final.png): same pixel density and baseline, idle above run, columns Naruto / Sasuke / Killua / Gojo.
- [review.html](review.html): local animation comparison and crown/chin measurement tool. Buildable phone-sized copy at `/art-review/scale/`, including Sasuke UI candidates. It becomes remotely accessible only after an authorized deployment.

## Contact/effect anchors
Naruto heavy f4 now covers the raised fist instead of the full forward leg. Existing heavy f3 and airHeavy f3 hand boxes were rechecked. Naruto beamFire palm anchors were refreshed. Sasuke Chidori startup/rush anchors follow the low trailing hand; active f3/f4 boxes replace incorrect head detections, and f5 covers the extended palm. Kirin command-hand anchors were added. Killua beam palms were visually rechecked and retained. Overrides live in character `hitboxes.json`; all public metadata is regenerated.

## Explicit exceptions and limits
- Naruto KO v05 is completely visible but uses the outer safety margin: left 4px / right 2px intrusion into the nominal 4px inset. Killua KO v02 has a 1px left safety-margin intrusion after cached repacking. These are **margin warnings, not lost pixels**. The poses were not shrunk to suppress warnings. Inspect these two poses during final approval.
- Source skull-axis values are visual estimates where hair obscures the crown. Their decimals encode conversion factors, **not measurement precision**. Full crown/chin landmark certification for every pose is not claimed; the +/-2px target remains a review criterion, not an automated pass.
- Gojo's approved compact adult head is the explicit user preference. A universal 31px enlargement is not applied to him. Different hairstyles, face shapes and foreshortening remain visible.
- Contact-page review and browser smoke establish the corrected candidate package, not human approval, long gameplay balance testing, or physical-phone performance.
- Sasuke UI fixed-name approved copies have not been promoted; the generated UI remains in the review package.
- Raw versions and rejected history remain in the local repository. The existing GitHub publisher strips raw/rejected art. Claude should consume committed packed sheets and metadata; re-generation/repacking that needs raw sources must use the full local checkout.

## Final approval scope
76 current review rows: 19 Naruto + 14 Killua + 43 Sasuke; no new Gojo approval required. One final batch decision can approve these latest candidates. Previous approvedVersion values remain unchanged until that decision.

