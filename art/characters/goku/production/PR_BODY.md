# Goku core: measured reassembly and final diagnostic audit

No new image calls. Fifteen of eighteen source slots now have versioned reassemblies; airHeavy, down and charge remain source/measurement/sequence holds. Every previous candidate and user drawing approval is preserved. Nothing is approved, merged or deployed to production by this PR.

## Review

Committed preview: pending publication. Review entry: /characters/goku/calibration-r2/reassembly/index.html; separate pilot comparison: /characters/goku/calibration-r2/index.html. These are diagnostic galleries, not a cleared gameplay atlas. Raw source candidates remain local in the task worktree because the slim PR/export excludes raw art.

Astra inspected every frame in the final 48-color fixture: 81 frames, 16 animations. Final sheet SHA256 c77417967595b060c9981c5d55c6d1cc32fb748a2e7361ea658746e0adb0bfa0; metadata dec929ae11544546e7a8a8f3c23c860ffa33f4844882bfda2cc9313d7cab9167. Full evidence is in art/characters/goku/production/manual-audit-r2/REASSEMBLY_R02_FINAL_AUDIT.md and the gallery reports.

- Proposed visible-anatomy passes at exact fixture calibration only: jumpUp v04 (bodyHeight206, tucked projection qualification), jumpFall v04 (232), hurtHigh v08 (223).
- light1 v03 body scale passes at238; hair at y3 remains a separate 1px margin hold.
- Separate native-density pilots guard v05 (229) and light2 v05 (236) pass at sheet b319f07b217b76f1292eeba0f1559464b6d6104d7091790180bc8db7293abfe8 / metadata b4df0fed72369440395e697d5a78cde9a0487f9c6a443830ad497c92e94cf324. Current production198/204 shrinks them and remains HOLD.
- Other candidates retain undersize, source fragment, crop, placement or measurement holds listed below. Diagnostic correction ratios are not approved rescale factors. Concealed joints have no numerical pass.

## Claude next

Select calibration from PROPOSED_CALIBRATION.json, retain exact pixel identity or request affected-frame Astra recheck, and resolve the known-invalid head probe/manual-QA policy. Current judgeStrip only converts unmeasured/partial to manual passes; false drift/uniform/pop classifications still block the strict pack. No gate exemption or tooling change was made. Then address remaining source landmarks/crops and runtime contacts before asking for final art review. Existing low-pose raw-only manualQA must not be treated as final-atlas certification.

## Verification and scope

Adapter production build passed. Local gallery images, frame stepping, one-shot playback, fixture version/absence labels and console checked; no broken images or observed console errors. This does not certify game contacts or every timed loop. Exact public atlas/metadata/audit copies match the audited files. Production manifest changes are only15 candidate-version tokens: no bodyHeight, status, approvedVersion or exemptions changed. User approvals stay separate from technical audit results. Worktree: E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-goku-core. No tests added or run.

## Proposed review rows

# Goku r02 review rows for parent integration

Date: 2026-10-15. These rows correspond to exact source-measured rescale candidates in `raw/_qa_hold/`. They are technical audit records, not new drawings, approval decisions, or production calibration. Preserve any user design approval attached to the identical source drawing; the rescaled pixels still need Claude calibration/tool review and the final packed pixel audit. Do not copy fixture-only bodyHeight values into the production manifest.

| Character | Asset | Candidate | Status | Exact change and evidence | Current technical finding |
|---|---|---|---|---|---|
| Goku | run | [run_v05.png](art/characters/goku/raw/_qa_hold/run_v05.png) | needs review | Source `run_v02_attempt04.png`; factor .484; [sidecar](art/characters/goku/raw/_qa_hold/run_v05.json). | Final fixture2 HOLD (fixture1 finding rechecked): body segments undersized; rear boot crop at frames 3/6. |
| Goku | dash | [dash_v04.png](art/characters/goku/raw/_qa_hold/dash_v04.png) | needs review | Source `dash_v03_attempt03.png`; factor .241; [sidecar](art/characters/goku/raw/_qa_hold/dash_v04.json). | Final fixture2 HOLD (fixture1 finding rechecked): short body segments and rear boot crop. |
| Goku | jumpUp | [jumpUp_v04.png](art/characters/goku/raw/_qa_hold/jumpUp_v04.png) | needs review | Source `jumpUp_v03_attempt03.png`; corrected collar-center/boot endpoints; exact median .257±.06; [sidecar](art/characters/goku/raw/_qa_hold/jumpUp_v04.json); [annotated source](art/characters/goku/production/reassembly-r02/jumpUp-source-f0-corrected-endpoints.png). | Fixture2 final Astra audit: proposed qualified body/anatomy PASS within uncertainty, bound to atlas c77417967595b060c9981c5d55c6d1cc32fb748a2e7361ea658746e0adb0bfa0; tucked boot projection is qualified. |
| Goku | jumpFall | [jumpFall_v04.png](art/characters/goku/raw/_qa_hold/jumpFall_v04.png) | needs review | Source `jumpFall_v02_attempt03.png`; corrected endpoints; .356±.04; [sidecar](art/characters/goku/raw/_qa_hold/jumpFall_v04.json); [annotated source](art/characters/goku/production/reassembly-r02/jumpFall-source-f0-endpoints.png). | Fixture2 final Astra audit: proposed full visible-anatomy PASS, bound to atlas c77417967595b060c9981c5d55c6d1cc32fb748a2e7361ea658746e0adb0bfa0; v03 stays immutable and disputed. |
| Goku | land | [land_v04.png](art/characters/goku/raw/_qa_hold/land_v04.png) | needs review | Source `land_v03_attempt03.png`; factor .253; [sidecar](art/characters/goku/raw/_qa_hold/land_v04.json). | Final fixture2 HOLD (fixture1 finding rechecked): undersized upright recovery. |
| Goku | light1 | [light1_v03.png](art/characters/goku/raw/_qa_hold/light1_v03.png) | needs review | A/B parts mapping and factor .385; [sidecar](art/characters/goku/raw/_qa_hold/light1_v03.json). | Fixture2 final Astra audit: body-only PASS; y3 hair margin HOLD (1px inside nominal 4px margin). |
| Goku | light3 | [light3_v05.png](art/characters/goku/raw/_qa_hold/light3_v05.png) | needs review | Same source drawing `light3_v04_attempt04.png`; factor .530; [sidecar](art/characters/goku/raw/_qa_hold/light3_v05.json). | Final fixture2 HOLD (fixture1 finding rechecked): detached/severed rear arm and hand; prior source crop remains. Drawing approval is retained; technical pass is not. |
| Goku | light4 | [light4_v05.png](art/characters/goku/raw/_qa_hold/light4_v05.png) | needs review | Same source drawing `light4_v04_attempt04.png`; factor .565; [sidecar](art/characters/goku/raw/_qa_hold/light4_v05.json). | Final fixture2 HOLD (fixture1 finding rechecked): undersized recovery body and right-edge kick crop. |
| Goku | heavy | [heavy_v05.png](art/characters/goku/raw/_qa_hold/heavy_v05.png) | needs review | Same source drawing `heavy_v04_attempt04.png`; factor .533±.04; [sidecar](art/characters/goku/raw/_qa_hold/heavy_v05.json). | Final fixture2 HOLD (fixture1 finding rechecked): undersized body; extended fist/arm cut and detached fragments. |
| Goku | airLight1 | [airLight1_v05.png](art/characters/goku/raw/_qa_hold/airLight1_v05.png) | needs review | Source `airLight1_v04_attempt04.png`; corrected visible belt span; exact median .546±.07; [sidecar](art/characters/goku/raw/_qa_hold/airLight1_v05.json); [annotated source](art/characters/goku/production/reassembly-r02/airLight1-source-f0-corrected-endpoints.png). | Fixture2 final Astra audit: visible body matches; active attack arms crop at right, overall HOLD. |
| Goku | hurtHigh | [hurtHigh_v08.png](art/characters/goku/raw/_qa_hold/hurtHigh_v08.png) | needs review | Source `hurtHigh_v07_attempt03.png`; factor .335±.04; [sidecar](art/characters/goku/raw/_qa_hold/hurtHigh_v08.json). | Fixture2 final Astra audit: proposed full visible-anatomy PASS within uncertainty; user/design approval remains separate. |
| Goku | launched | [launched_v07.png](art/characters/goku/raw/_qa_hold/launched_v07.png) | needs review | Source `launched_v06_attempt02.png`; corrected lower boot axis; exact median .258±.07; [sidecar](art/characters/goku/raw/_qa_hold/launched_v07.json); [annotated source](art/characters/goku/production/reassembly-r02/launched-source-f0-corrected-endpoints.png). | Fixture2 final Astra audit: visible body plausible; head cropped left in both frames, overall HOLD. |
| Goku | getup | [getup_v05.png](art/characters/goku/raw/_qa_hold/getup_v05.png) | needs review | Source `getup_v03_attempt02.png`; factor .418±.04; [sidecar](art/characters/goku/raw/_qa_hold/getup_v05.json). | Final fixture2 HOLD (fixture1 finding rechecked): upright body remains undersized. |
| Goku | special | [special_v03.png](art/characters/goku/raw/_qa_hold/special_v03.png) | needs review | Source `special_v02_attempt03.png`; corrected collar and visible boot; exact median .628±.07; [sidecar](art/characters/goku/raw/_qa_hold/special_v03.json); [uncropped companion](art/characters/goku/production/reassembly-r02/special_v03-uncropped-roomy.png). | Fixture2 final Astra audit: visible body matches, but hair crops at top. Standard 256 candidate loses 768 pixels; roomy companion preserves all resampled pixels. |
| Goku | win | [win_v04.png](art/characters/goku/raw/_qa_hold/win_v04.png) | needs review | Source `win_v03_attempt03.png`; factor prose erratum preserved; [sidecar](art/characters/goku/raw/_qa_hold/win_v04.json). | Visible body consistent; hair/raised fist crop, overall HOLD. |

The three no-output source holds remain in `FINAL_INVENTORY.json` and are not assigned guessed factors: airHeavy (corrected boot point, but airborne landmark spread does not support one factor), down (prior collar/belt points withdrawn; no independent pair), and charge (loop snap; factor spread alone does not establish anatomy failure). Do not create versions for them without new reliable evidence.


## Superseded and companion files

| Character | Asset | Candidate | Status | Exact scope | Technical finding |
|---|---|---|---|---|---|
| Goku | jumpFall | [jumpFall_v03.png](art/characters/goku/raw/_qa_hold/jumpFall_v03.png) | needs review | Immutable earlier v03; sidecar records the withdrawn endpoint/factor issue. | Disputed and excluded from fixture 2; do not select over v04. |
| Goku | getup | [getup_v04.png](art/characters/goku/raw/_qa_hold/getup_v04.png) | needs review | Immutable earlier reassembly candidate, superseded by v05. | Fixture 1 pack/audit did not use this version; preserve as history, no pass inferred. |
| Goku | jumpUp | [jumpUp_v04-uncropped-roomy.png](art/characters/goku/production/reassembly-r02/jumpUp_v04-uncropped-roomy.png) | needs review | Diagnostic roomy companion, not a standard 256-cell asset. | Preserves resampled pixels for overflow review; not packed or approved. |
| Goku | airLight1 | [airLight1_v05-uncropped-roomy.png](art/characters/goku/production/reassembly-r02/airLight1_v05-uncropped-roomy.png) | needs review | Diagnostic roomy companion, not a standard 256-cell asset. | Does not repair source attack-arm crop; not packed or approved. |
| Goku | light3 | [light3_v05-uncropped-roomy.png](art/characters/goku/production/reassembly-r02/light3_v05-uncropped-roomy.png) | needs review | Diagnostic roomy companion, not a standard 256-cell asset. | Source fragments remain; not packed or approved. |
| Goku | guard | [guard_v05.png](art/characters/goku/raw/_qa_hold/guard_v05.png) | needs review | Native-density reassembly pilot; separate from approved drawing. | Astra conditional source-method pass is fixture-bound; current manifest-scale render remains HOLD pending Claude calibration. |
| Goku | light2 | [light2_v05.png](art/characters/goku/raw/_qa_hold/light2_v05.png) | needs review | Approved v04 drawing uniformly reassembled at measured pilot density. | Existing design approval retained; native-density pilot pass is fixture-bound; current manifest-scale render remains HOLD pending Claude calibration. |
