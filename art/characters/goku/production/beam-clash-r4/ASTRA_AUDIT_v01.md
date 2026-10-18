# Goku beamStruggle v01: Astra audit v01

2026-10-17. GPT-6 Astra, medium reasoning. Worktree `.worktrees/art-beam-clash-r3`, branch `art/beam-clash-r3`. **Independent audit complete; candidate verdict HOLD.** This is the final audit of the frozen **diagnostic candidate**, not a final production-pack pass. No image calls, art edits, pack, approval, source promotion, or commit were performed by this auditor.

## Exact candidate and status

Luna and the parent froze the bodyHeight **205**, reported uniform factor **0.338**, quantized-48 diagnostic. Original diagnostic path: `E:/Vibe Coding/.codex/visualizations/2026/10/17/01a14c11-bc07-7bb1-9cbb-4f8be60be9e1/round4/public/characters/goku/`. Independent immutable inspection copy: the same scratch root's `round4/astra-provisional/sheet.png` and `anims.json`. Hashes matched before/after copying; Luna confirmed the snapshot. Source is still `art/characters/goku/raw/_qa_hold/beamStruggle_v01.png`, unapproved. Diagnostic manifest approval fields used by Luna to enable packing are **not user approval**.

- Sheet SHA-256: `991182a67fe71939373db9758348465141f8c09ebed8264d7185e0a0dac7140b`
- Anims SHA-256: `d7ffaeacf6eb6dd07c871de3fd193cdadea8ac49253d385b9c41b5a6a1fe1f0d`
- Actual JSON lookup: beamStruggle local f0/f1/f2 = atlas **108/109/110**, [70,70,70] ms, loop true. Comparator beamFire f0/f1/f2 = **93/94/95**, v07 per current manifest; idle f0 = 0. All cells 256x256, 16 columns.

## Verdict by boundary

| Boundary | Verdict | Evidence |
|---|---|---|
| Uniform density | Plausible calibration against beamFire, **not a strict scale PASS** | Crown/chin and front boot measurements broadly match beamFire93 at 205; differences from approved combat remain. The factor was not justified from cell width. |
| Head | HOLD for strict numeric certification | Candidate crown/chin roughly 55-59 px versus beamFire about60 and approved combat about52, with +/-2-3 px landmark uncertainty and head-angle/hair variation. |
| Torso / shoulder / build | HOLD | f0/f2 show a broad chest and shoulder construction relative to the approved combat cell, while f1 narrows with a different torso turn. Joint locations under the gi are uncertain. No confident all-segment +/-6% pass. |
| Forward arm | No demonstrated thickness inflation; length not strictly certified | Exact arm cross-section extents are comparable or smaller than beamFire. The shoulder/chest concern is not evidence that the entire straight arm is too thick. |
| Legs / clothing / footwear | HOLD for strict title-reference match | Lunge chains remain complete; loose pants obscure joints. Front boots match beamFire density but look longer than the approved combat boot. |
| Loop | HOLD | No missing limb, but chest/shoulder silhouette changes materially through 0->1->2; f2->f0 resets the broad surge pose. Front fist moves about6 px at f2. |
| Cell clipping / contact | HOLD | f2 reaches x255 and Luna's diagnostic reports1 px right clipping; all measured front knuckles exceed the brief's x<=240 hand zone. Strict pack cannot pass this candidate as-is. |
| User review | Pending | Existing v01 remains unapproved and held; this report authorizes no redraw or approval change. |

## References and inspection method

Authoritative Goku references are the approved **v02** cells under `public/characters/goku/calibration-r2/assets/references/`, derived from `art/characters/goku/reference/title_style_draft_v02.png`. The initially inspected pilot-fixture `title-combat-v02.png` was verified byte-identical to this exact authoritative combat cell; it was not an old cast-v01 substitute.

- Combat v02 SHA-256: `5714f663bd847e7ce9bb258d49872b85190fbcc9de3a75678acaa2fc25bfd69c`
- Neutral v02 SHA-256: `748ace13116f05cde59ca1ad390655bca26156e351fd6afcf307d2aad7ee7445`
- Approved title source v02 SHA-256: `f7ae672771e9282f31e7804b02bb3f0ed46488618efd6050a4b864b2203dea42`

All three target atlas cells, all three beamFire cells, idle f0, neutral and combat were compared at one pixel density and nearest-neighbor magnification. Every target frame and 0->1,1->2,2->0 transitions were inspected. This is frame-sequence inspection, not real-time browser playback or collision/hurtbox validation. Approved reference magenta was removed **only in disposable comparison composites**; source pixels and atlas inputs were untouched.

Crown-to-chin includes hair; it is not skull-only height. Heel-to-toe is a projected front-foot span, not boot-shaft height. Manual endpoint uncertainty is +/-2-3 px for clear contours, +/-5-8 px for shoulder/hip centers hidden by clothing; foreshortened chains cannot be reconstructed reliably. Bounds and cross-sections below are exact alpha measurements; anatomy landmarks are estimates. No automatic head probe number is used. Luna's B~1.048/1.044/1.097 garment report is context only, not proof of anatomical compliance.

## Independent measurement observations

| Sample | Crown through chin, native px | Front boot heel-to-toe projection | Notes |
|---|---|---|---|
| Approved combat v02 | about52 +/-3 (y27..78) | about35 +/-2 (x167..202) | More compact hair/head projection and shorter foot silhouette than beamFire. |
| beamFire93 | about60 +/-2 (y9..68) | about45 +/-2 (x180..225) | Actual packed approved pose comparator, not raw source dimensions. |
| Struggle108 | about58 +/-3 (y38..95) | about45 +/-2 (x187..231) | Head tilted forward, upright front boot. |
| Struggle109 | about55 +/-3 (y41..95) | about44 +/-2 (x187..230) | Crown3 px lower; torso turns and narrows. |
| Struggle110 | about59 +/-3 (y36..94) | about43 +/-2 (x195..237) | Crown rises, head moves forward; foot shifts with surge. |

These support 0.338 as a defensible **beamFire-relative working density**, with uncertainty of several percent from the landmarks, but do not prove the requested strict +/-6% match to all references. Nominal head ratios to beamFire are about0.97/0.92/0.98; to combat about1.12/1.06/1.13. Boot projections are near beamFire and roughly1.23-1.29 of combat. Different pose, view and hair/boot drawing shape contribute; none of these values alone licenses a new uniform rescale. Reducing scale to cure chest width or fit the cell would also shrink the comparatively matching beamFire-scale head/boots.

**Forward-arm thickness check, exact visible silhouette in a restricted arm band:** beamFire93 columns155/165/175 measure21/21/20 px; struggle108 columns190/200/210 measure19/16/19; struggle109 the same columns measures20/17/20; struggle110 columns195/205/215 measures19/14/19. Windows y65..104 for beamFire and y90..124 for struggle isolate the horizontal arm without torso/legs. This disproves an unqualified claim that the forward forearm is simply thicker. It does not establish joint-to-joint length or rear-arm volume.

**Torso and shoulder concern:** approximate sleeve-root/shoulder-center separation is about48-55 px in the combat reference, about60-72 in struggle108, about53-61 in109, and about65-77 in110 (joint ambiguity +/-6-8 px, additional to those ranges). The combat cell already has a three-quarter chest view, so all of the broad f0/f2 appearance cannot confidently be dismissed as a profile-to-frontal change. Conversely, sleeve volume and torso rotation make an exact excess percentage unjustified. The collar-to-belt diagonal remains visually plausible (roughly40-50 px depending on chosen collar point), but a matched-endpoint numeric torso pass is not established. Rear deltoid/biceps silhouette is heavier in f0/f2 and partly hidden by the gi sleeve; it remains a local build HOLD rather than a proven uniform-density error.

The wide lunge is lower than the upright-ish beamFire. Both thigh/shin chains remain present; no anatomical limb truncation or extra limb was found. Knee and hip locations under orange cloth are low-confidence and are **not assigned passing length ratios**. Pants maintain volume broadly, but f2's hip cloth flares further left. Both blue boots remain recognizable; the rotated rear boot cannot be compared by horizontal width to a forward-facing shoe.

## Frame-by-frame and loop

- **f0 /108:** full forward fist and wristband, rear fist at hip, two booted legs. Broad near-frontal chest and rear shoulder relative to combat; arm itself has comparable thickness to beamFire. Lower, wider pose is legitimate; pose height205 is not an anatomy measurement.
- **f1 /109:** head crown lowers3 px, torso turns/narrows, gi V/neck opening rotates markedly. Front fist remains on the same measured location. Rear fist and bent arm stay visible. The build change is greater than a simple small translational recoil, though drawing perspective may explain part of it.
- **f2 /110:** forward surge, broader chest/shoulder silhouette, flying belt/hip cloth; head crown rises5 px from f1. Front fist advances6 px into the right-edge problem. Both boots and rear fist remain present. No complete missing segment, but cell clipping prevents a clean pack conclusion.
- **f2->f0:** fist retracts6 px; crown shifts2 px lower; rear/near shoulder contour and cloth flare reset. The sequence is recognizable as push/strain/surge but its anatomy consistency cannot be certified within the strict tolerance. Runtime contact motion remains separate.

## Contact and clipping

Luna measured knuckle bounds in this exact snapshot: f0/f1 [234,93]-[249,110], f2 [240,93]-[255,109], with proposed front-knuckle points [247,100],[247,100],[253,100]. Independent visual inspection confirms the fist is at the far right and f2 touches the cell edge. These points exceed the brief's hand-zone maximum x240 by7/7/13 px. They are measurements/proposals, not approved hitbox overrides or proof that engine anchoring works. Moving registration can fix clipping/contact without changing density, but any such change produces new atlas hashes and needs verification. No offset change was audited here.

## Exact cell evidence

Bounds are [left,top,right,bottom), nonzero alpha, not skeleton dimensions. SHA below hashes decoded RGBA256x256 cell bytes.

| Animation/frame | Index | Bounds | RGBA SHA-256 |
|---|---:|---|---|
| beamFire f0 | 93 | (28, 9, 226, 241) | `af748ad44e1fedf5c6463c15deff0509db5927dde45ee539981f9bce9a311c84` |
| beamFire f1 | 94 | (29, 9, 225, 241) | `80cc7d328d748717e92638f8a5da7cad5958a70011ee77dd23d8118bc5e3a7ee` |
| beamFire f2 | 95 | (29, 10, 225, 241) | `aca84007d84657bed084fa0c5efcd5908d68007424d5eccdda472591a6fc84ab` |
| beamStruggle f0 | 108 | (23, 38, 251, 241) | `6ce5e6bf1f9ebe65bf863f7551c03e048a732c23e080bf0bf20d3c56472fd1b2` |
| beamStruggle f1 | 109 | (25, 41, 251, 241) | `8b29ead93e1994bc214e38cc02f7e1c8e41faff5146b984bd5225d019fd575c3` |
| beamStruggle f2 | 110 | (22, 36, 256, 241) | `f7a3fac607af081c1d48d77044035c37193b0131cdbb51899ccee815a59c2317` |

## Handoff

Keep source v01 held and unapproved. No strict pack or anatomy pass is claimed. Parent/Luna owns the measurement-led calibration record, official manifest/source/hand-anchor decisions, review presentation and Claude handoff. No new call is authorized by this report. If only registration changes, recheck clipping, contact and hashes; if density or drawing changes, repeat affected anatomy comparisons. The three other fighters' air holds remain untouched per the user's decision.

Reproducible scratch evidence: `round4/astra-provisional/compare.png`, `grid-*.png`, `head-*.png`, `boot-*.png`, `cell-*.png`, plus frozen sheet/anims. These are inspection crops, not generated or approved art. Only this report was written in the worktree by the auditor.
