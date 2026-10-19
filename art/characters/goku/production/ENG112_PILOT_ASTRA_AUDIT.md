# ENG-112 Goku pilot: exact-atlas anatomy and scale audit

Date: 2026-10-18. Scope: fTilt v01 and fair v01 only, in `art/normals-goku` at `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-normals-goku`.

## Recommendation

**HOLD both candidates for a numeric `scaleManualQA` pass.** Both have coherent visible anatomy and intact cell margins in this diagnostic atlas. I did not establish that every anatomical segment is within approximately 6% of the approved baseline. In particular, obscured knees, rotated shoulders, clothing overlap and hair-covered skull landmarks prevent a sufficiently precise full-body comparison. This is an evidence hold, not a demonstrated proportional failure, rejection, or instruction to redraw or rescale either source. Do not turn the approximate measurements below into exact percentage passes.

**Margin check PASS:** fair's fitted f2/f3 have 11 transparent columns to their right. The previously reported intrusion is absent from these exact quantized cells. Retain Claude's selected strip factors pending the landmark disposition; no further scaling is justified by this audit.

This audit is a technical recommendation only. It does not grant user image approval, certify contacts/hurtboxes or runtime motion, or replace a strict production pack. The inspected output is explicitly a temporary warn-mode diagnostic, with fighter `packScale: 0.92`, fTilt strip factor `1.0`, fair strip factor `0.92`, and 48-color quantization.

## Version binding

SHA-256 values read directly from disk:

| Input | SHA-256 |
|---|---|
| `raw/fTilt_v01.png` | `D92A4B868BEDDA70A2BCA6CB1866FAC06A8F58FE5E3A71C36413983C17FCD870` |
| `raw/fair_v01.png` | `89496DA590C79209428BF01FAA98D4163EDA3C48981956A5D024FF54E2069525` |
| `production/eng112-pilot-atlas/public/characters/goku/sheet.png` | `EC0AE1F30E337C7522125A376F07D44EC322F9322CDF1948217C719B8AA5A48D` |
| `production/eng112-pilot-atlas/public/characters/goku/anims.json` | `12FAA10CD0BB5EBFB0BA6D67DC1CFE2B89026AA75AD6167AFBCDE34CE46849F9` |

The supplied handoff truncated the anims hash by its final `9`; the actual complete 64-digit hash above is authoritative for this audit.

Inspected every candidate cell from the actual sheet: fTilt IDs 111–117; fair IDs 118–123. Comparisons used actual atlas idle f0 (ID 0), all light2 cells (31–37), all airLight1 cells (61–65), and the supplied approved `public/characters/goku/calibration-r2/assets/references/idle_approved.png`, `title-neutral-v02.png`, and `title-combat-v02.png`. Title references establish anatomy/build; raw reference images are not numerically compared as though their import fit were absent. No older cast-height formula or universal head ratio was used.

## Method and uncertainty

Read 256px cells with 16 columns from anims.json. Extracted their existing pixels, inspected at native density and at 2x nearest-neighbor enlargement, and checked alpha bounds programmatically. No candidate was re-rendered, repacked, or modified. Bounds below are exact alpha-support bounds; anatomy estimates are manual observations of visible contours, not a segmentation algorithm.

The approved title neutral/combat retain a muscular adult upper body, narrow blue belt, voluminous orange gi legs and long blue boots. The fitted idle and the two candidate strips preserve those recognizable relationships. Hair silhouettes vary with head turn and are visibly fuller in some pilot cells; the skull under the hair cannot be measured accurately enough to convert that observation into a head-size failure or pass.

The following are approximate native-pixel landmark ranges, rounded deliberately. They cover visible examples, not hidden geometry reconstructed from clothing. Endpoint uncertainty is generally 2–4px, and rises to 5–8px for occluded joints. At a 35–45px feature, even a 3px endpoint ambiguity exceeds a 6% tolerance. Thus overlapping ranges establish visual plausibility, not numerical clearance.

| Landmark | Idle / same-kind live reference | fTilt v01 | fair v01 after .92 fit | Interpretation |
|---|---|---|---|---|
| Boot top to sole, along visible boot axis | Roughly 38–44px on clear boots; bent aerial foot has perspective ambiguity | Roughly 36–43px; cuffs remain near y200–205 and lowest sole y240 | Roughly 35–43px on clearer tucked/extended boots | No obvious shoe inflation; overlap and rotated soles prevent a strict all-frame ratio |
| Shin/knee to ankle | Knee is inferred under orange folds, not an exposed joint; ankle is visible near boot tie | Same problem; changing trouser folds move the apparent knee | Tucked knee and opposite calf overlap in all six frames | Unmeasured anatomical shin, not a numeric pass based on trouser silhouette |
| Neck base to upper belt, projected torso axis | Approximately 34–42px across idle/light2/airLight1 poses | Approximately 35–44px; back-facing windup/extension obscure neck base | Approximately 34–45px; strong forward lean and raised thighs obscure lower torso | Comparable visual torso scale, but endpoints and perspective exceed the narrow tolerance |
| Blue belt visible span | Approximately 34–42px depending on yaw and tilt | Approximately 33–42px; narrowing with back turn is plausible | Approximately 33–43px of visible belt; parts hidden by raised leg/forearm | No clear waist enlargement; visible projected width is not circumference |

Upper-arm and forearm volumes remain muscular, with readable elbow/wrist transitions and no obvious duplicate limb. Extended fTilt f3 preserves a continuous shoulder–elbow–wrist–fist chain comparable to light2's extension. Fair's folded leg chains are readable as an airborne tuck and kick, but their hidden hip/knee locations do not support a precise thigh/shin length claim. The clothing silhouette alone cannot prove those lengths. Hair, garment area and overall posed height were not substituted for skeletal scale.

## Every-frame observations and margins

Coordinates use `[left, top, right-exclusive, bottom-exclusive]`. Transparent margins are left/top/right/bottom. All candidate bottoms are 241, leaving 15 transparent rows; this reflects the packed pivot convention and does not establish airborne world placement.

| Move/frame (atlas ID) | Alpha bounds | Margins L/T/R/B | Anatomy, build and continuity observation |
|---|---|---|---|
| fTilt f0 (111) | [57,24,198,241] | 57/24/58/15 | Complete guard, both boots and forearms visible; same adult build as idle, with a slightly narrower stance. Hair silhouette differs; skull landmark hidden. |
| fTilt f1 (112) | [64,28,206,241] | 64/28/50/15 | Windup rotates chest and shoulders; belt remains narrow, baggy knees retained. No broken elbow. Torso rotation makes an exact width ratio unreliable. |
| fTilt f2 (113) | [56,25,206,241] | 56/25/50/15 | Back/side turn and folded striking arm; far shoulder obscured. Both lower legs remain complete; apparent garment bulk follows the turn. |
| fTilt f3 (114) | [50,28,236,241] | 50/28/20/15 | Full extension has intact fist/wrist and continuous arm; boot tips intact. Far-side torso and neck are occluded. |
| fTilt f4 (115) | [54,25,202,241] | 54/25/54/15 | Returns rapidly to front guard. Gi volume and boot size appear consistent; extension-to-guard transition is large but no missing body part. |
| fTilt f5 (116) | [58,24,199,241] | 58/24/57/15 | Settled guard with visible elbows, belt and boots; no sudden apparent body-size jump from f4. |
| fTilt f6 (117) | [59,24,199,241] | 59/24/57/15 | Near-identical settling silhouette to f5; plausible return to idle. Minor stance/hair differences remain. |
| fair f0 (118) | [68,72,197,241] | 68/72/59/15 | Both knees tucked, both boots readable. Large folded gi area is expected from overlapping thighs; hidden joints cannot be certified. |
| fair f1 (119) | [56,66,190,241] | 56/66/66/15 | Tuck rotates with pulled-back arm; intact forearm and boot outlines. Neck/waist are foreshortened and partly covered. |
| fair f2 (120) | [60,72,245,241] | 60/72/11/15 | Extended kicking boot and its sole are complete. Trailing leg stays folded; raised orange thigh obscures hip and knee landmarks. |
| fair f3 (121) | [60,78,245,241] | 60/78/11/15 | Follow-through retains full boot/sole and fist. Head/body drop about 6px at the top; pose change, not evidence of whole-body resizing. |
| fair f4 (122) | [68,77,191,241] | 68/77/65/15 | Retraction restores crossed tuck; two boots can be distinguished, though one calf/ankle is partly hidden. No missing limb detected. |
| fair f5 (123) | [91,68,198,241] | 91/68/58/15 | Guarded tuck, intact forearms and boots. Transition to the existing less-tucked aerial reference needs runtime review; static body scale is plausible. |

Both animation entries are non-looping. All sequential frames and their endpoint poses were inspected; no loop closure is claimed. The rapid fTilt f3→f4 retraction and fair f5→existing aerial state were not viewed as timed gameplay transitions, so timing/contact suitability remains Claude's check.

## Required disposition

Keep `scaleManualQA` pending for these exact versions unless Claude supplies or accepts a version-bound landmark method that resolves the hidden-joint and skull uncertainty. Useful evidence would mark matching anatomical endpoints in these exact cells and the corresponding approved poses, explicitly distinguishing visible boot/shirt contours from inferred knees, hips and skull. A color-area match alone cannot close the anatomical segment requirement. No new generation is requested by this finding.

The parent Goku lane should carry this audit and its exact hashes into the technical handoff. User approval remains separate. This task wrote only this report in the worktree; it did not modify source art, production outputs, manifest, tracker, review rows or main-only records. No build/test was run for this inspection-only report.
