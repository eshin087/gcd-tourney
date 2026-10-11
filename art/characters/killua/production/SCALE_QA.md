# Killua W1 scale-fix evidence — BLOCKED

2026-10-10. Branch art/scale-fix-killua. Claude alone integrates and deploys production. No image approval recorded. **Do not approve or merge this batch yet.**

19 target assets have candidate sources; 25 immutable versioned strips are recorded in REVIEW. The final required command, `node tools/pack-sprites.mjs killua --quantize 48`, exits **1** and refuses to replace the fighter atlas. The game/preview retains the previous approved sheet. The raw gallery is diagnostic artwork, not approved art or verified gameplay integration.

## Actual gates

Eight latest candidates fail: jumpUp v02, heavy v07, airLight1 v03, airLight2 v04, guard v04, block v04, hurtLow v03, specialUp v05. Other latest candidates are only individually provisional; the whole-fighter pack has not passed. KO v03 floor contact70%, worst gap3px, height44px; down v02 rest contact53%, worst gap7px, height54px. Both pass the floor checks in the refused pack. Down impact offset x-18 and specialUp f2 x-12 are placement-only corrections.

| Latest asset | Final scale verdict | Median head / idle | Per-frame head / idle | Built-in generation attempts used |
|---|---|---|---|---|
| airLight1 v03 | drift | 0.827 | 0.816 / 0.828 / 0.821 / 0.914 / 0.827 | No generation; route A |
| airLight2 v04 | drift | 0.928 | 0.933 / 0.919 / 0.904 / 0.939 / 0.928 | 1 |
| airLight3 v03 | ok | 0.964 | 0.942 / 0.934 / 0.946 / 1.045 / 0.981 / 0.983 | No generation; route A |
| airHeavy v02 | ok | 0.98 | 0.615 / 0.806 / 1.999 / 0.993 / 0.635 / 0.966 | No generation; route A |
| hurtHigh v03 | ok | 0.987 | 1.012 / 0.987 / 0.984 | No generation; route A |
| hurtLow v03 | drift | 0.916 | 0.885 / 0.916 / 0.921 | No generation; route A |
| specialUp v05 | pop | 0.94 | 0.941 / 0.908 / 1.224 / 0.939 / 1.017 / 0.8 | A2/B1 |
| jumpFall v02 | ok | 1.007 | 1.001 / 1.014 | No generation; route A |
| charge v08 | ok | 1.005 | 1 / 1.007 / 1.009 / 1.003 | No generation; route A |
| guard v04 | drift | 0.933 | 0.932 / 0.934 | 1 |
| superPose v04 | ok | 0.98 | 0.98 / 1 / 0.981 / 0.979 | 1 |
| beamFire v05 | ok | 0.99 | 1.012 / 0.966 / 0.99 | 1 |
| throw v03 | ok | 0.952 | 1.016 / 0.923 / 0.967 / 0.937 | 1 |
| jumpUp v02 | drift | 0.908 | 0.864 / 0.951 | 1 |
| block v04 | pop | 1.124 | 1.192 / 1.055 | 1 |
| specialForward v07 | ok | 1.005 | 1.008 / 0.994 / 0.979 / 0.982 / 1.054 / 1.005 / 1.07 | A3/B2 |
| heavy v07 | pop | 1.023 | 0.983 / 1.01 / 1.106 / 1.022 / 1.058 / 1.038 / 1.024 / 0.969 | A2/B2 |
| ko v03 | unmeasured | 0.874 | 0.874 | 1 |
| down v02 | unmeasured | 0.841 | 0.753 / 0.929 | 1 |

## Reproduction and evidence

- [Final text](scale-pack-final.log) and [JSON](scale-pack-final.json): exact default strict-for-candidate command above. Run from this real worktree. No source/idle/tolerance changes are needed.
- [Initial refit-only log](scale-pack-initial.log), [small redraw addition](scale-pack-second.log), [long strips/floor addition](scale-pack-third.log), [corrected split log](scale-pack-fourth.log). These record different candidate sets over the same approved idle. Initial candidates airLight1/airLight3 fit; after unrelated color additions auto-head declines to fit them. Initial airLight2 prefit says drift while final verdict says uniform. The precise candidate source for every row appears in each log.
- In the final log the idle proxy is52x43 versus the saved approved baseline52x35, although the idle raw, sidecar and cleaned cells were never edited. Global48 quantization selected head colors #faf1e9 #d4cbdd #b7a2da #9c91b3. The lightest color merges hair and skin; purple shades can connect the hair/skin to garment areas. This is a measurement hypothesis supported by the declared-color experiment, not a claim that every geometric failure is false.
- Declared cool-hair-color experiment produced47x28 idle proxy and changed the failure set to five, while adding lavender recovered52x43 and different failures. It did not produce a stable full silhouette measure. **Experimental builds.json edits were reverted.** No threshold, idle geometry, scale baseline, or probe exemption was changed to force a pass. Existing same-pixel airHeavy/specialUp refit exemptions were carried to v02/v03 per brief; specialUp redraw v05 remains measured and fails rather than inheriting those exemptions.
- [Diagnostic heads](diagnostic-scale/heads-killua.png) and [full contact](diagnostic-contact.png) come from a **separate, explicitly warn-mode diagnostic manifest**, `--no-writeback`, and output under production/diagnostic-public. They only make refused candidate cells visible. They are not passing gate evidence and never replace public/characters. Diagnostic manifest/output are archived here for reproducibility.
- [Shipped lineup](lineup-shipped.png) was generated with `node tools/lineup.mjs`; it displays the retained approved runtime art, not these refused candidates.
- [Hashes](source-hashes.json) record the unchanged approved idle/runtime output and latest candidate sources. Earlier generated versions remain present as history and are not recommended.

## Art and route notes

Route A copies retain approved raw pixels and replace only anatomy metadata with auto-head. Prior hand-edited airLight1/specialUp/throw frames are preserved under previous-frames so they cannot silently override new raw. Heavy v05 was confirmed ~18% small f0–f6 with full idle f7. Heavy v06 and initial specialForward v05/specialUp v04 had overlapping x projections that confused the automatic stitch probe. The wider final heavy v07 stitches5+3 at B factor0.7985, postcheck1.008; specialForward v07 stitches4+3 at0.8497, postcheck1.008; specialUp v05 stitches4+2 at0.7125, postcheck0.993 (large factor warning retained). No factor was chosen by eye. Batch1 had no old-part route-B-only row; measured stitching was applied to its route-C long redraws and the unsuccessful earlier stitch versions are retained.

All raster redraws used the built-in image generator with approved model, expressions, idle and scale guide. Part B repeats attach selected Part A. Detailed prompt bases are Killua PROMPTS.md, SCALE_FIX_BRIEF.md and KO_DOWN_BRIEF.md; widened parts add3072x1024 layout and explicit magenta gaps. The generator did not reliably honor declared2x source dimensions; actual output is measured by the stitch/pack pipeline. Small redraws retain1/3 attempt budget, heavy and specialUp2/3, specialForward A3/3 and B2/3; continuing art before stable measurement would chase changing targets. AirLight1 and airLight3 have not yet received route-C redraws.

## Claude next steps

Resolve ART-KIL-PROBE: stabilize approved-reference color measurement/prefit vs final audit, then rerun the exact default pack. Inspect true airLight1 undersizing and block/late-heavy variation independently; do not exempt real size changes. SpecialUp f2 contains a white slash arc and f5 raised sleeve/arms obscure the crown, so inspect their probe boxes before any written version-scoped misread exemption. Final anchors/hitboxes and gameplay transitions still need QA after a passing pack; old overrides may not fit redrawn poses. Only after pack exit0 and every touched strip ok should these enter the user's art-approval queue.

Git writes in this chat need exec require_escalated because .git is read-only in its sandbox; no machine ACL change was made. Use npm.cmd or direct node to preserve flags. No main, NOW or INBOX edits.

Production build passed with the local .codex/vite.mjs adapter (77 modules). Local browser verified the diagnostic gallery at /reviews/killua-scale/index.html with all 19 latest source entries and explicit blocked labeling. Directory-only URLs fall through to the game, so use the explicit index.html link.
`/?fight=killua,killua&mode=solo&art=custom&debug` local browser logged `[sprites] using custom sheet for killua (42 animations)` and no console errors. This verifies only the retained shipped sheet, not the failing candidate strips.
