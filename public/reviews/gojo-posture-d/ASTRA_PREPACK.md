# Astra pre-pack audit: Gojo launched v07

2026-10-17. Auditor: GPT-6 Astra, medium. ART-GOJO-POSTURE-D. Technical HOLD; not an image/design approval.

Worktree: E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-proportions
Branch: art/gojo-proportions. HEAD at inspection: fe886b480540a1f11980cb453975a7a98a3d1afd.

## Result

Do not add a v07 scaleManualQA pass or scale exemption on this evidence. Both source frames meet the actual inbox direction: one knee raised and one trailing leg, no straight parallel pair. There is no inbox requirement to exchange anatomical left/right leg roles; the visible near raised knee appears retained, which is not a failure of that instruction. White hair, blindfold, navy uniform and black shoes remain recognizable. The pose change succeeds, but anatomy at the inherited bodyHeight 170 is not demonstrated within the task's +/-6% segment tolerance. Torso scale is materially suspect and arm/leg measurements remain uncertain. Retain v06 live and hold v07 pending a measured correction and new final-atlas audit. This report does not authorize another generation or reset its budget.

## Exact inputs

SHA256 of files:

- raw/launched_v07.png: 740935A4E76418E52368B6A4A1911DF69AE8197E777DECF9B73ECCDDAFFEE918
- raw/launched_v06.png: 963244EE7C4D2E4B01A28E5C24C199DD7B49C85FF3E9163752383053A73A7C29
- raw/idle_v08.png: 6C1EC47C2C1E2B7DF2D3AA6CCF2256E46DC93BDD8E426607F2990F6F963913BB
- public/characters/gojo/sheet.png: CE87CC8D31F6CA7336BE020F477A178BC909A4804BD16002D7A70B96F9DE7EF7
- public/art-review/title-style-pilot/gojo-neutral_v01.png: D9FD4DCA67C7CC133E897773A3C8128D6C5320A42402642C11409FEA770175A0
- public/art-review/title-style-pilot/gojo-combat_v01.png: AB42BC6FACD14659BF35B48A4BCE8682CD17218F200D1E7FCDC6430F58451656

Source-frame hashes are SHA256 of decoded RGBA bytes, each 768x1024 crop, left then right (not PNG file hashes):

| Source | f0 | f1 |
|---|---|---|
| v07 | 30468018d8f9a66e7ddc281d6eb1d9a61406019acd34d737335eb1b0718deb7c | f2eec532687e4dedb1b0491580746fe8d8daebbe78b8eeac8a13199c9273fc50 |
| v06 | e41481d8ccd12137d09f3569f362f06f2bc7017ead00990b9c7352d4a9c82fdc | c724d4c868e0d7c347d0a42b9c258ed9a16a01f72ed02706f8fb83a62ef621ee |

## Evidence and method

`prepack-density-diagnostic.png` columns: v07 f0, v07 f1, v06 f0, v06 f1, current quantized atlas idle f0, approved neutral, approved combat. Each column is 256px. Candidate and old source poses are nearest-neighbor diagnostic reconstructions, NOT new quantized pack outputs. The three reference columns use their actual pixels unchanged. Placement is diagnostic (bottom aligned), not a validation of runtime pivots or inherited frameOffsets. `prepack-source-measurements.json` records frame hashes and measured source bounds.

A simple chroma exclusion R>180, B>180, G<100 and largest connected component yields v07 bounds f0 [27,171,744,892], f1 [33,171,732,892], each 722px tall. v06 bounds f0 [19,219,736,769] (551px), f1 [7,273,748,796] (524px). The source has a disconnected seam artifact; largest-component analysis excludes it. This is not the packer's exact cleaning or quantization algorithm. The inherited max-height normalization predicts v07 170/722 = 0.23546 and v06 170/551 = 0.30853. Both are pose-box normalization facts, not anatomy calibration. No target height was changed.

The cached frames/idle and frames/launched markers refer to old v02/v01; they were NOT used as current reference evidence. Atlas idle f0 was extracted from actual sheet frame 0. All eight idle frames were not re-audited for this limited pre-pack check.

## Landmark estimates and uncertainty

Coordinates below are frame-local source pixels, excluding the second frame's +768 x offset. Hand estimates at source resolution, generally +/-10px per endpoint; hidden joints +/-15-25px. Target equivalents multiply by 0.23546. Reference estimates are native pixels, usually +/-3-5px. Clothing seams are not bone landmarks. None of these measurements is a numeric pass.

| Check | v07 f0 | v07 f1 | Reference / interpretation |
|---|---|---|---|
| Collar to lower jacket hem | (244,350) to (334,581): 248 source px, about 59 +/-5 native | (245,350) to (355,583): 258 source px, about 61 +/-5 native | Neutral collar approximately (125,47), lower hem (128,125): 78 +/-4px; idle has comparable roughly 78-80px jacket length. Candidate/reference central estimates 0.75 / 0.78. Lean/fold affects projection, but this cannot certify +/-6% retention. |
| Skull under hair to chin | approximately (174,281) to (228,346): 85 +/-20 source px, about 20 +/-5 native | approximately (176,281) to (230,346): same estimate | Skull is obscured by hair/blindfold and face tilted. Native neutral axis roughly 22-27px depending on hidden crown choice. Overlapping uncertainty prevents exact head ratio; do not substitute hair extent for skull length. |
| Hair + face extent | roughly y224..365, about 33px after fit | roughly same | Native reference hair-to-chin extent roughly 37-40px. Orientation-dependent; suggests smaller head but is not a head-probe reading. |
| Raised thigh / shin | hip ~(385,528), knee ~(504,435), ankle ~(458,627): about 36 / 46px after fit | hip ~(390,530), knee ~(555,400), ankle ~(562,551): about 49 / 36px | Hip/knee placement +/-20px, strong folds and foreshortening. Reference visible thigh/shin chains roughly 50-56px each. These projected lengths do not prove preserved bones; do not mark a short projected segment as a measured anatomical failure or pass. |
| Trailing leg | Bent knee near (597,638), ankle near (657,805) | Knee near (553,679), ankle near (668,787) | Trousers obscure hip and knee. No straight parallel-leg stilt silhouette. Exact segment certification unavailable. |
| Arms | Both raised and bent; left image-side elbow near (106,525), wrist near (53,461) | Similar upper-arm arrangement, wrist lower | Forearm projection about 20px after fit in f0; native neutral visible forearm about 30px. Foreshortening/hidden elbow limits comparison. Cannot certify +/-6%. |
| Shoes | Raised shoe approximately (402,630) to (511,703): 31 +/-5px; trailing shoe roughly (620,821) to (736,881): 31 +/-5px | Raised shoe roughly (516,578) to (652,597): 32 +/-5px; trailing shoe angled | Reference side-visible shoe roughly 33-38px. Angled soles and cuffs affect endpoints. Broad agreement does not rescue torso/limb uncertainty. |

v06's collar-to-hem source estimate (~[187,369] to [289,584]) becomes ~73 +/-6px with its inherited fit, nearer the reference than v07. Thus copying the v06 manual record would erase a real version-dependent scaling concern. This does not re-certify every v06 segment.

The two candidate frames have nearly identical head/upper-body layout and visibly articulate the lower legs; a 70/70ms two-frame loop will change the lower-leg silhouette substantially. Source images alone cannot certify final quantized loop continuity, clipping or frameOffsets. Both directions of wrap require final atlas review after any correction.

## Remaining holds

hurtHigh v04 and hurtLow v05-v07 retain the parent's reported strict-pack holds (latest hurtHigh head1.23/feet1.35; hurtLow v07 head1.19/feet0.98). Those numbers were supplied by the task, not remeasured in this pre-pack assessment. Their old live versions are not replaced. No new candidate atlas was produced or approved by this audit. A final all-candidate quantized-atlas audit remains pending if any candidate becomes technically reviewable.

No manifest, source image, pack output, approval record or production state was edited. Evidence files and this report only. Governing references: main inbox ART-GOJO-POSTURE-D, art/CHARACTER_SCALE.md manual/unmeasured rules, and art/scale/title-style-pilot/PRODUCTION_CONTRACT.md.

## Addendum: launched v08, third-call source

Technical HOLD remains. No v08 scaleManualQA pass or exemption is defensible at the inherited bodyHeight170. D split-knee posture is present in both frames. The source torso length increased, but its full-height normalization also shrinks the whole figure further. A head-only manual exemption would not address the unresolved torso/limb scale. No generation budget remains according to the parent task; this audit does not authorize more calls.

Exact source SHA256, verified: 8EC2242DA411EF38AFB3A77F2557FDF9D422527334793E6F3FA6A36CDBBD92E4.

Connected-component segmentation of the full 1536x1024 image with the same chroma rule (not equal-width slicing) finds two separate figures:

| Frame | Inclusive full-source bounds | Opaque component pixels | SHA256 decoded isolated component RGBA |
|---|---|---|---|
| f0 | [30,132,808,922], 779x791 | 178665 | 346be0bde2c7aef771bc493f1f486a325a7dc0a026054129addf0164a9d2c33e |
| f1 | [783,173,1491,933], 709x761 | 179965 | 4322dab831c6a9bbf044d1d5e9f6205a4fb971655f81633c707a4a8d66ad8416 |

Component hashes use each bounding rectangle, transparent black outside that component. Source figure projections overlap on x783..808, but the figures are disconnected. Equal 768px slicing truncates f0's trailing shoe. Any later pack must prove it extracted complete components; this report does not assert the packer mishandled them.

Inherited max-height scale prediction: 170/791 = 0.2149178255. `prepack-v08-density-diagnostic.png` displays component f0, component f1, actual atlas idle f0, approved neutral, approved combat at that scale. Source component reconstruction is diagnostic, not final quantized output; offset/pivot placement is not certified. Exact bounds and hashes are in `prepack-v08-source-measurements.json`.

Manual landmarks use FULL source coordinates for both frames (unlike the v07 frame-local table):

| Measurement | f0 | f1 | Assessment |
|---|---|---|---|
| Collar to lower jacket hem | (260,319) to (361,610): 308 +/-20 source px ->66 +/-4px | (1024,332) to (1105,630): 309 +/-20 ->66 +/-4px | Neutral ~78 +/-4; idle ~78-80. Central ratio ~0.85 in both. Larger than v07's59-61, but not demonstrably within +/-6%. Folded/occluded hem adds uncertainty, which prevents a numeric pass rather than granting one. |
| Skull under hair to chin | ~(190,254) to (253,319):91 +/-20 ->20 +/-4px | ~(945,264) to (1010,326):90 +/-20 ->19 +/-4px | Hair/blindfold hide crown; neutral roughly22-27px. Cannot derive reliable exact head ratio. |
| Hair-to-chin vertical extent | roughly y190..337 ->32px | roughly y197..345 ->32px | Reference ~37-40px; orientation-dependent indication of a smaller head, not the automated probe. |
| Raised thigh and shin | hip ~(410,545), knee ~(563,410), ankle ~(518,623):44 /47px | hip ~(1195,548), knee ~(1340,416), ankle ~(1347,582):42 /36px | Joint locations hidden by navy folds, +/-20px source per endpoint and foreshortening. Reference visible segments roughly50-56px. No +/-6% certification. |
| Shoes | raised heel ~(463,645), toe ~(576,705):28 +/-5px; trailing heel ~(685,849), toe ~(801,905):28 +/-5px | raised heel ~(1292,608), toe ~(1440,621):32 +/-5px; trailing shoe oblique | Reference side-visible shoe roughly33-38px. Angles/cuffs obscure exact skeletal endpoints; no numeric footwear pass. |
| Upper limbs | shoulders/elbows/wrists intact, both elbows bent | same, f1 upper hand moves down and right | Projected elbows and thick sleeves limit exact chain measurement. No missing limb, but segment retention is unproven. |

The total source silhouette heights differ by30px; after common scaling this is6.4px, attributable in part to the changed top hand. Do not individually normalize each frame to170px. Both directions of the 70/70ms loop still require final quantized inspection if corrected. The candidate keeps the recognizable identity and split-leg pose, but current evidence supports HOLD, not a manual scale record. v07 and v08 source history must remain intact; the parent may move held sources through the prescribed workflow. This auditor did not edit manifest, sidecars, images, or production atlas.
