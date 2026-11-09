# Gojo B2-B7 final packed-atlas anatomy audit

Audit: GPT-6 Astra (medium), 2026-11-09. Scope: relay audit2 #7. This is an anatomy/scale audit, not a new design approval or runtime/contact clearance.

## Disposition

| Batch | Actual packed asset | Result |
|---|---|---|
| B2 | special v08 | PASS under current audit tolerance; runtime transition check remains. |
| B3 | fSmash v02 | PASS; broad planted shoes and stance are pose-dependent, not a uniform scale error. |
| B4 | airLight1 v07 | Unchanged live baseline; existing short-body anatomy HOLD remains unresolved. No new candidate audited. |
| B5 | airLight3 v13 | PASS with airborne-pose caveat below; head median .939 is inside the user's 8% line. |
| B6 | fair v02 | PASS with tucked-leg/hem occlusion caveat. |
| B7 | fTilt v02 | PASS; modest recovery stance change remains for runtime observation. |

The five new strips are assessed at their delivered x1 pack scale. No uniform scaling change is recommended. Passing this audit does not remove unrelated manifest technical holds automatically; Claude owns reconciliation and runtime contact/hurtbox testing. The existing user approval of the five selected drawings is independent of this audit.

## Exact artifact and scope

- Read-only integration source: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-size-r8-b2`.
- Content commit: `d218274f0b44ed114a33745764b969dd56927f7a`. Parent agent verified the two blobs from this commit with `git show`; the on-disk bytes I audited match them. Do not infer identity from the source worktree's current HEAD metadata.
- `public/characters/gojo/sheet.png` SHA-256: `0ec94868a62f3a81116ed5fc1dfbd19431ac4168567419c9e3bdf0f3675e264d`.
- Matching `anims.json` SHA-256: `c3b7d62e60efe14e27882499c8f9f0399a9bcd536ed769de18eedf2f1a3ea858`.
- Version authority is the matching metadata's `scaleAudit.anims.<name>.v`, not manifest newest-version fields. This identifies airLight1 as v07 even though its manifest newest version is v10. Quarantined source-worktree v10 was not opened or changed.
- All 41 requested packed frames inspected, with idle's eight-frame baseline. Every requested animation has `loop:false`; therefore there is no internal looping seam to certify. Recovery-to-idle/jumpFall is discussed below, not claimed runtime-tested.
- Reference authority: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`, exact `public/art-review/title-style-pilot/gojo-neutral_v01.png` and `gojo-combat_v01.png`, plus approved packed idle v08. Packed jumpFall f0 is an additional airborne pose control, not a replacement scale reference.

## Method and measurement limits

Each comparison PNG is extracted directly from the quantized atlas with the matching frame indices. Reference cells and extracted cells remain at the same native pixel density; enlarged grid evidence uses nearest-neighbor enlargement only. No pose is resized to standing height. `atlas-metrics.json` records exact frame indices, durations, phases, bounds and the original per-frame head/feet probe records. Probe numbers were recorded by the packer before final quantization; they are distinguished from this visual review of the actual quantized pixels. They measure hair silhouette and shoe-color area, not skull or limb lengths.

The current user rule is median head within 8%; an individual frame below .92 is not automatically a strip rejection. Uncertain concealed joints are not a fabricated numerical pass or an automatic hold. Native manual garment landmarks carry roughly +/-3 px per endpoint, projected torso lengths about +/-6 px, limb-chain estimates about +/-8-12 px. Perspective, sleeve/hem movement, tucked limbs and shoe yaw limit anatomical inferences. In particular, none of the passes certifies every segment within the historical +/-6% criterion.

The title neutral's long upright torso and lean adult build are retained in the ground strips; the title combat permits shoulder rotation, bent knees and shorter projected bounds. No new strip shows a detached limb, duplicated limb, obvious shoulder inflation or severe build discontinuity. Feet/contact positions must still be checked in runtime.

## Quantitative packed evidence

### special v08

Head median `0.958`; feet proxy median `1.091`; packer verdict `ok`.

| Frame / atlas cell | Head | Feet proxy | Occupied bounds [x0,y0,x1,y1), native px |
|---|---:|---:|---|
| f0 / 139 | 0.961 | 1.091 | [87, 17, 176, 241] |
| f1 / 140 | 0.949 | 1.094 | [87, 17, 185, 241] |
| f2 / 141 | 0.967 | 1.129 | [87, 17, 209, 241] |
| f3 / 142 | 0.943 | 1.09 | [86, 10, 188, 241] |
| f4 / 143 | 0.955 | 1.1 | [87, 10, 179, 241] |
| f5 / 144 | 0.977 | 1.077 | [87, 10, 176, 241] |
| f6 / 145 | 0.957 | 1.056 | [87, 9, 176, 241] |
| f7 / 146 | 0.96 | 1.052 | [83, 10, 176, 241] |

### fSmash v02

Head median `0.971`; feet proxy median `1.157`; packer verdict `ok`.

| Frame / atlas cell | Head | Feet proxy | Occupied bounds [x0,y0,x1,y1), native px |
|---|---:|---:|---|
| f0 / 211 | 0.971 | 1.201 | [65, 19, 194, 241] |
| f1 / 212 | 1 | 1.183 | [63, 20, 198, 241] |
| f2 / 213 | 1 | 1.192 | [60, 21, 199, 241] |
| f3 / 214 | 0.971 | 1.235 | [60, 20, 199, 241] |
| f4 / 215 | 1 | 1.157 | [67, 17, 200, 241] |
| f5 / 216 | 0.955 | 1.146 | [70, 16, 193, 241] |
| f6 / 217 | 0.971 | 1.051 | [73, 17, 190, 241] |
| f7 / 218 | 1 | 1.077 | [74, 16, 189, 241] |
| f8 / 219 | 0.971 | 1.031 | [82, 16, 182, 241] |

### airLight1 v07

Head median `0.955`; feet proxy median `0.986`; packer verdict `ok`.

| Frame / atlas cell | Head | Feet proxy | Occupied bounds [x0,y0,x1,y1), native px |
|---|---:|---:|---|
| f0 / 67 | 0.956 | 0.973 | [113, 27, 190, 241] |
| f1 / 68 | 0.955 | 1.002 | [112, 26, 229, 241] |
| f2 / 69 | 0.954 | 1.002 | [115, 27, 230, 241] |
| f3 / 70 | 0.955 | 0.972 | [116, 27, 195, 241] |
| f4 / 71 | 0.953 | 0.986 | [114, 26, 192, 241] |

### airLight3 v13

Head median `0.939`; feet proxy median `1.05`; packer verdict `drift`.

| Frame / atlas cell | Head | Feet proxy | Occupied bounds [x0,y0,x1,y1), native px |
|---|---:|---:|---|
| f0 / 77 | 0.961 | 1.003 | [75, 62, 190, 241] |
| f1 / 78 | 0.94 | 1.026 | [69, 70, 184, 241] |
| f2 / 79 | 0.92 | 1.077 | [41, 84, 220, 241] |
| f3 / 80 | 0.938 | 1.074 | [66, 84, 238, 241] |
| f4 / 81 | 0.971 | 1.077 | [68, 36, 198, 241] |
| f5 / 82 | 0.903 | 1.012 | [87, 22, 186, 241] |

### fair v02

Head median `0.999`; feet proxy median `0.96`; packer verdict `ok`.

| Frame / atlas cell | Head | Feet proxy | Occupied bounds [x0,y0,x1,y1), native px |
|---|---:|---:|---|
| f0 / 236 | 0.997 | 0.967 | [89, 39, 211, 241] |
| f1 / 237 | 0.995 | 0.953 | [95, 39, 217, 241] |
| f2 / 238 | 1.016 | 0.928 | [88, 44, 251, 241] |
| f3 / 239 | 1 | 0.902 | [88, 44, 250, 241] |
| f4 / 240 | 1.038 | 1.01 | [108, 25, 246, 241] |
| f5 / 241 | 0.968 | 0.969 | [101, 16, 195, 241] |

### fTilt v02

Head median `1.016`; feet proxy median `1.014`; packer verdict `ok`.

| Frame / atlas cell | Head | Feet proxy | Occupied bounds [x0,y0,x1,y1), native px |
|---|---:|---:|---|
| f0 / 184 | 1.015 | 1.014 | [81, 10, 180, 241] |
| f1 / 185 | 1.024 | 1.02 | [81, 10, 182, 241] |
| f2 / 186 | 1 | 1.019 | [80, 9, 199, 241] |
| f3 / 187 | 1.031 | 1.04 | [80, 10, 199, 241] |
| f4 / 188 | 1.027 | 0.933 | [78, 14, 184, 241] |
| f5 / 189 | 1.013 | 0.919 | [78, 15, 184, 241] |
| f6 / 190 | 1.016 | 0.915 | [78, 15, 184, 241] |

## Frame-by-frame anatomy observations

**special v08:** f0 retains the long collar-to-hip section with one pocketed arm and the other hand near the chest. f1 begins a connected shoulder/elbow extension. f2 resolves the pointing hand without an extra limb. f3 lifts/opens the palm and straightens the upper body; the roughly 8 px head-height change from f2 is a pose/registration change, not a corresponding head-size jump. f4 holds that open-hand action; f5 and f6 withdraw it with stable leg lengths and jacket volume. f7 lowers the arm into recovery. Head range .943-.977 is narrow. Collar-to-center hem is approximately 76-82 px on readable upright frames, comparable with idle's approximately 75-80 px. Planted leg chains remain long and lean. The .091 excess median shoe proxy is not a measured 9.1% longer shoe; the native views show toe yaw/stance changes. PASS; check f2-f3 rise and f7-to-idle in motion.

**fSmash v02:** f0 spreads into a lower stance; f1 draws the hand in with the near elbow intact. f2 extends the palm while rotating the chest. f3 reaches farther and f4 raises/holds the push. f5 begins withdrawal; f6 bends the elbow; f7 restores the hand near the torso; f8 returns both hands to pockets. Torso and trouser volumes remain coherent through all nine frames. The visible collar-to-center hem is roughly 78-85 px in the open poses, while bent leg projections are shorter than standing by design. Shoes show a broad planted sole through f0-f5, with feet proxy 1.146-1.235, falling toward 1.031 at pocketed recovery. The actual shapes are connected and perspective-consistent; this is not evidence to resize the body. Head range .955-1.000, no scale pop. PASS with a noticeable stance change at recovery.

**airLight1 v07:** f0 has a narrow shortened chest and one tucked leg. f1-f2 extend the palm without restoring torso length. f3-f4 retract to the same compact baseline. The head remains near the allowed baseline (.953-.956), but collar-to-center hem is roughly 53-59 px against idle's 75-80 px; the torso remains narrow through all five poses. The extended leg also reads short/slender relative to idle; a clothing-obscured chain estimate of roughly 90-100 px versus idle roughly 105-112 px has too much uncertainty to certify an exact percentage. The torso issue is more definite than the leg estimate. This is the known unresolved live v07 short-body baseline, not repaired by the B2-B7 batch. Metadata confirms v07; 'unchanged' is relay provenance, not a claim that a separate previous-production atlas was byte-compared. Preserve its existing HOLD; no audit of the quarantined v10 candidate is implied.

**airLight3 v13:** f0 turns the back and lifts the knee; foreshortened jacket and arm projections must not be compared to standing box height. f1 compresses into the chamber, with both leg chains still readable. f2 extends the kick and adds the white arc; f3 removes the arc while retaining a coherent extended leg. The arc is excluded from anatomical size judgment. f4 recoils into a high knee with a fuller visible back/shoulder. f5 straightens the hanging leg and restores the chest-facing recovery, with intact hands and two leg chains. Head range .903-.971 (median .939); f5 is the .903 hair-silhouette probe outlier (not a measured skull-length ratio), explicitly retained here rather than concealed, but the strip median is within the user's 8% line and the range .068 is not an abrupt scale split. Feet median 1.05 contradicts a uniform undersize diagnosis.

The f5 torso initially looks short beside standing idle: visible collar to center zipper/hem is approximately 56-62 px versus idle 75-80. The approved airborne control is essential: packed jumpFall f0 itself projects approximately 62-68 px, with a bent abdominal line and displaced hem. The remaining roughly 6 px difference is at the manual landmark uncertainty and coincides with stronger abdominal fold, raised knee and forward chest angle. The outside jacket tail is not the pelvis, and neither knee lift nor hem position gives an exact hidden hip landmark. The extended hanging leg in f5 is long and coherent; there is no corroborating uniform short-leg problem. After that pose control, I cannot substantiate a clear new torso anatomy failure. **PASS under the current user rule, with this explicit pose-dependent uncertainty**, not a precise claim that the hidden torso equals idle within +/-6%. See `airborne-recovery-2x.png` and `recovery-torso-3x.png`. No scale fix is justified. Claude should check the f3-f4-f5 vertical recovery and transition into jumpFall in the game.

**fair v02:** f0 raises a knee in anticipation; f1 tucks it tightly with overlapping thighs. f2-f3 extend the kick, with consistent hip-knee-ankle continuity and narrow foreshortened boot profiles. f4 re-chambers with a more open shoulder/hand reach. f5 restores the hanging leg and pocketed hand. The upright recovery collar-to-hem is roughly 65-72 px, near the airborne control; head median .999 and coherent shoulder/leg volume support PASS. The tucked frames' reduced area and the .902-.928 feet proxies on the active kick are not equivalent to shrinking the whole person. No missing leg or clipped toe visible. Check the lateral/vertical f3-f4 recoil in runtime.

**fTilt v02:** f0 is a neutral pocketed stance; f1 raises the working hand; f2-f3 extend the palm with a coherent elbow/wrist chain and stable torso. f4 withdraws to chest level; f5 lowers the hand and f6 pockets it. Upright projected collar-to-hem is roughly 75-81 px, matching idle within garment-landmark uncertainty. Legs remain long; the modest knee/stance change in f4-f6 explains a lower head position and reduced shoe-color area without a head scale change (head 1.000-1.031). PASS; the shoes remain anatomically plausible despite feet proxy falling to .915 at f6.

## Containment and transitions

All requested occupied bounds are inside their 256x256 cells; no visible cross-cell hand, foot or arc fragment is present. Grounded frames reach the common y240 sole baseline; airborne feet also reach that packed pivot line, which by itself says nothing about world-space altitude. No inference of runtime grounding is made from the grid. Non-looping actions have different return stances and arm placements from idle; this report inspects their drawings and the endpoints, not the game's interpolation/timing or hitbox reach. Those remain Claude's checks.

## Exact scaleManualQA object for Claude

This is version- and atlas-bound manual clearance of airLight3 v13 under the current audit tolerance. It is not an override for another version, atlas, or gameplay check.

```json
{
  "version": 13,
  "result": "pass",
  "by": "GPT-6 Astra (medium)",
  "note": "All six actual quantized atlas frames inspected against approved idle, title neutral/combat and airborne pose control. Head median 0.939 is inside the user 8% line; feet median 1.05. Tucked/recovery torso projection has stated landmark uncertainty consistent with airborne folding; no clear independent anatomy failure established. Packed x1 as drawn; no uniform scale correction. Runtime contact and recovery transitions remain Claude checks.",
  "evidence": "public/reviews/size-r8-audit2-gojo-b2-b7/airLight3.png",
  "atlasSha256": "0ec94868a62f3a81116ed5fc1dfbd19431ac4168567419c9e3bdf0f3675e264d"
}
```

## Evidence and changes

Native comparisons and exact machine records: `public/reviews/size-r8-audit2-gojo-b2-b7/{idle,special,fSmash,airLight1,airLight3,fair,fTilt}.png`, `atlas-metrics.json`. Additional nearest-neighbor coordinate evidence: `landmark-grid.png`, `recovery-torso-3x.png`, `airborne-recovery-2x.png`.

Only this report and those branch-local evidence files were written. No source integration file, manifest, production atlas, hitbox, approval record or commit was changed. No pack/build was run as part of this read-only atlas audit; those would not validate the anatomical judgments above.
