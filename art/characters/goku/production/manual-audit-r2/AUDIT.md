# Goku manual body audit r2 — Astra, 2026-10-15

## Decision

**PASS: guard v05 and light2 v05 in the native-height fixture only**, under Claude's main-inbox criterion of visible landmarks matching the approved idle/title cells within measurement uncertainty. This is a supported manual body-scale finding, not user design approval, numeric certification of hidden joints, a strict automatic gate pass, or a complete production release audit.

**HOLD: both pilots in the current-manifest fixture.** Its secondary resize makes them about 13.5% smaller while idle remains at scale1. Do not enter a production scaleManualQA pass against those pixels.

**Conditional source-method PASS:** reuse this workflow for the remaining18 strips: independently measure their own stable source landmarks, preserve one factor across each strip, quantize, then audit all final cells. The factors0.282 and0.613 are specific to these source images, not transferable constants.

## Exact covered pixels/settings

Worktree E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-goku-core, branch art/goku-core. Inventory source commit ec37e3ae3eb2a97aa3e9afc54d8b4ee14a1ec694.

Fixture root: production/scale-qa/pilot-v01/fixture-output under art/characters/goku.

| Fixture | sheet.png SHA256 | anims.json SHA256 | Result |
|---|---|---|---|
| native-height | b319f07b217b76f1292eeba0f1559464b6d6104d7091790180bc8db7293abfe8 | b4df0fed72369440395e697d5a78cde9a0487f9c6a443830ad497c92e94cf324 | manual body pass for guard05/light205 |
| current | bb4eb2d7e03d075f90784784d009906fd09cbc4e420fb89b68d67a85b11d3a55 | 229ab74b97556ef3a2b2dd8bd4148323b4509d5a840d4c5374ec66573454367c | HOLD |

Both have exactly48 distinct nontransparent RGB colors (independently counted); 256x256 cells,16 columns,pivot[128,240],pixelsPerUnit128. Native-height bodyHeights idle233,guard229,light2236 produce scale1 for each. Current bodyHeights idle233,guard198,light2204 produce guard198/229=0.86463 and light2204/236=0.86441; compensating factors are229/198=1.15657 and236/204=1.15686. These are corrections to the pack settings, not new source-generation factors. Both render in isolated warn mode, after strict mode exit1. No real manifest edited by this auditor.

Source SHA256: idle02 57fbbd3cb99fc92a30dafdd478479971e4e9d497e035c846e9fd28ecb126fe03; guard05 517c51ce2899ac06bcf4c8ab99c710f9e0660742bc637e9a11c084124bba8406; light205 248b5c7c2b4e8dfed110585c19d868477588d4f3b2cf899a1a446423a59ce2b3. Full sidecar/packer/probe/manifest hashes are in the fixture inventory. Exact extracted per-frame pixel PNG hashes are in this directory's pixel-hashes.json. A larger inventory may change quantization; re-audit changed final pixels rather than carrying this pass blindly.

## Measurement authority and uncertainty

measurements.json records independently read native pixel endpoints, lengths and ratios for every pilot frame. Evidence comes from actual quantized atlas cells, extracted by extract.cjs, viewed at integer2x without interpolation. Measurements are rounded visual readings, not exact anatomical segmentation. Length uncertainty: torso±5px, belt±4px, boot±4px, projected forearm±6px. These are conservative reading limits, not statistical confidence intervals.

Neck base is now defined consistently as collar-center/sternoclavicular region. The earlier diagnostic used a posterior-neck point yielding about46px; do not mix these endpoints. With this definition idle torso38.1px, approved title neutral37.0px and combat37.4px. Approved title belt widths about32/33px vs idle36px; boot projected lengths39.6/40.0px vs idle43.7px. Differences are within combined endpoint/projection uncertainty. Idle remains the user-approved reference; no old universal body/head ratio is applied.

| Frame | Torso px / idle ratio | Belt px / ratio | Boot px / ratio | Forearm projected px |
|---|---|---|---|---|
| idle02 f0 |38.1 /1|36 /1|43.7 /1|19.4|
| guard05 f0 |37.9 /.994|36 /1|44.9 /1.027|18.2|
| guard05 f1 |39.8 /1.045|36 /1|43.3 /.991|15.5|
| light205 f0 |40.3 /1.057|35 /.972|44.9 /1.027|18.4|
| light205 f1 |40.9 /1.073|37 /1.028|43.7 /1|19.1|
| light205 f2 |occluded|33 /.917|44.3 /1.014|27.2|
| light205 f3 |39.6 /1.039|36 /1|44.0 /1.007|26.2|
| light205 f4 |37.6 /.987|37 /1.028|42.1 /.964|26.0|
| light205 f5 |40.8 /1.070|35 /.972|44.1 /1.009|16.6|
| light205 f6 |38.9 /1.021|35 /.972|44.3 /1.014|15.8|

Knee/ankle centers are concealed by loose gi and boots; no measured shin length is invented. Garment folds are not skeletal joints. The rotated light2 f2 hides its neck base, so torso is unmeasurable there. Extended forearms f2–4 have longer projected spans than bent/foreshortened idle; their elbows, wrists and hands remain connected and coherent. Ratios for changed forearm projections are not treated as scale ratios. Occlusion plus the consistent torso/belt/boots and coherent visible limb chains supports the manual scale pass, without claiming hidden lengths are exact.

Heads, torso/build and clothing: all pilot cells preserve the adult jaw/neck structure, gi shoulder volume, chest taper, baggy thigh/knee folds, boots and limb build. The current fixture is uniformly smaller; it does not reveal a separate source anatomy repair requirement. No disconnected limbs, cross-cell fragments or clipping in these pilots. No color-head detector reading used as anatomy evidence.

## Every-frame and sequence coverage

All8 idle frames and all9 pilot frames were viewed, plus both current-manifest pilot sequences. Idle breathing and f7→f0 are coherent. Guard f0→f1 tightens the cover and f1→f0 releases it; planted legs/torso do not visibly pop in scale. Metadata loops300/300ms. Light2 f0 guard, f1 windup, f2 rotated extension, f3–4 extended follow-through, f5–6 recovery are complete and coherent. f6→idle is visually plausible; the raised guard f5 is pose variation. Metadata is one-shot35/30/40/50/60/50/30ms. Replay f6→f0 has a small guard change, not scale collapse.

This is static frame/seam review with timing metadata inspected; actual timed browser playback and gameplay contact/hurtbox validation were not performed by this auditor. Parent/Claude must report those separately.

## Application of pass

Claude can set guard bodyHeight229 and light2 bodyHeight236, preserving source/sidecars and the rest of the pack settings, then verify that selected final cells equal these audited pixels. Only then may the production record cite this version-bound manual pass. If palette composition or placement changes, compare hashes and re-audit changed cells. Current production settings remain held. User design approval on light2v04 drawing persists through uniform calibration; guard remains unapproved. No new image calls requested.

Claude next action belongs to parent: commit handoff, calibrated final-pixel status and remaining holds, then ring goku-luffy once. This subagent does not commit or ring.
