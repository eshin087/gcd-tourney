# Goku specialForward v02: exact-atlas anatomy review

2026-10-18. Final review by GPT-6 Astra, medium reasoning. Scope: the seven packed specialForward v02 cells versus packed idle f0 from the same commit. This does not recertify the idle against the historical cast lineup.

**PASS for visible anatomy and consistency of scale at native density.** I found no concrete anatomical scale failure in these seven cells. This is a visual/manual-landmark verdict, **not a numeric head-gate pass or certification that every anatomical segment is within +/-6%.** The skull crown cannot be read reliably under the hair. I cannot certify skull-to-chin head scale from these pixels; the automatic Goku head probe is off and is not used as evidence of a pass.

## Immutable inputs

- Commit: `6159cc2d` (full object ID in evidence.json).
- Atlas SHA256: `88d4576971827d4397aec6327308c2275a3d21e7c3955a7cc6f0401d84263554` — verified before cropping.
- Metadata SHA256: `ea0b600b8c4d3fdb2c945c2dd773249b9a3f198e68955e0d1493fd2fba105ca6`.
- Sidecar `art/characters/goku/raw/specialForward_v02.json` SHA256: `6feb2fc53821463d427efb005b01e47bb7b8a96a0a5527c794903f074144bf91`.
- Sidecar offsets: `[[0,0],[0,0],[-18,0],[-18,-40],[-10,0],[0,0],[0,0]]`.
- Committed manifest: v02, bodyHeight 222. Its approval record explicitly retains a technical hold. This audit does not change that record or infer release approval.
- 256x256 cells, 16 columns; idle cell 0, candidate cells 110–116. Exact committed packed pixels were used, not local cached frames or a new pack.

## Evidence and reproduction

Run `python art/characters/goku/production/specialForward-v02-audit/reproduce.py` from this worktree. Pillow is required. The script extracts `git show` bytes, asserts the requested atlas hash/cells/bodyHeight, and produces crops, hashes, bounds, manual landmark coordinates and comparison sheets. It does not run the packer or alter source art.

- [Native contact sheet](contact-native.png): every cell at 1:1 pixel density, no per-pose fitting.
- [Native paired comparison](paired-native.png): idle repeated beside every candidate frame.
- [2x contact sheet](contact-2x.png): nearest-neighbor enlargement only.
- [Machine-readable evidence](evidence.json): exact hashes, exclusive alpha bounds and hand-selected coordinates.
- `idle-landmarks.png` and `f0-landmarks.png` through `f6-landmarks.png`: annotated 3x nearest-neighbor copies. The letters mark N neck base, B belt center, S shoulder, E elbow, W wrist.

All unannotated individual crops preserve native RGBA pixels. No figure was resized or aligned independently for the comparison. The apparent native height falls on f3 because the legs tuck; it is not a valid standing-body measurement.

## Landmark measurements and uncertainty

The visible lower-neck and belt centers give a projected torso indicator. They are hand-selected garment/anatomy landmarks with approximately +/-3 native pixels uncertainty **per endpoint**; this is not a measured skeletal length. Torso turn and forward lean shorten the projection. Do not rescale the low f0/f4 readings to idle.

| Frame | Cell | Neck-to-belt projected length | Interpretation |
|---|---:|---:|---|
| idle f0 | 0 | 37.3 px | Working comparator |
| specialForward f0 | 110 | 33.5 px | Turned, lowered stance; no visible torso collapse |
| f1 | 111 | 36.1 px | Coiled torso, shoulder rotation |
| f2 | 112 | 37.0 px | Extended punch; near-idle projected torso |
| f3 | 113 | 35.8 px | Forward airborne torso, legs tucked |
| f4 | 114 | 32.2 px | Low forward landing; strongest foreshortening |
| f5 | 115 | 38.3 px | Upright recovery; 1.03x idle estimate |
| f6 | 116 | 38.3 px | Fighting stance; 1.03x idle estimate |

The similarly folded visible near arm in idle and f6 provides a useful second check: shoulder–elbow–wrist projected chain **51.2 px versus 52.1 px (1.02x)**. Because each joint center is approximate, this supports the absence of a conspicuous size jump; it cannot prove a tight numerical tolerance. The extended arms in f0/f2/f3/f4 have coherent upper arm, elbow, forearm and wrist connections; perspective and their different shoulder orientation prevent treating their silhouette length as a direct replacement for the folded-arm measurement.

Claude's supplied garment B result (median **1.03**, range **0.99–1.10**) is supporting context, not independently regenerated here. It agrees with the comparable recovery-torso indicators and the visual volume of the orange gi. Garment area does not by itself establish bone length or head scale.

**Head:** face and jaw continuity can be inspected, but the true skull crown is hidden by the gold hair. No reliable head-size number is reported. Hair silhouette/spike spread varies and is not a skull landmark. No numerical head pass is claimed.

**Legs/boots:** knees and hip joint centers are concealed by baggy trousers, especially f3. Therefore exact femur/shin ratios cannot be read. Visible garment folds, ankle exits, boot shafts and toes remain connected and consistent with the idle build. Different ankle angles, cuff coverage and overlapping legs prevent a tight numeric shoe/leg ratio; none is invented.

## Frame-by-frame visible anatomy

| Frame | Finding |
|---|---|
| f0 | Broad horse stance; torso retains chest/waist relationship, chambered arm connects through wrist, open forward hand has a coherent palm. Both trousers taper into intact boots. No scale failure identified. |
| f1 | Head and shoulder turn forward with the coil; bent arms attach correctly. Rear leg extends while front leg folds. Gi volume stays consistent; no stretched neck or disconnected forearm. |
| f2 | Complete forward fist/forearm at the cell's right side; bent far arm connects at shoulder and elbow. Torso and boot size are consistent with the stance. No clipping; the rightmost occupied x is 250. |
| f3 | Torso and punching arm retain visual size; both folded legs/boots remain in the cell. One leg partially occludes the other, so hidden joint lengths are unmeasured. Short outline is explained by the tuck. No anatomy/scale failure identified. |
| f4 | Low landing foreshortens torso and bent leg. Extended punch and trailing leg remain connected; boots retain coherent shafts/toes. No independent shrink or enlargement indicated. |
| f5 | Upright recovery gives a clear comparison: torso length and folded near arm return to idle-like size; chest, arms and loose trousers retain the same build. |
| f6 | Fighting stance is the closest full-body comparator. Torso and near-arm estimates are about 1.03x/1.02x idle, with stated uncertainty. Slightly different crouch/cuff positions explain silhouette differences; no obvious body-size pop. |

All occupied alpha bounds lie inside their 256x256 cells. Grounded f0/f1/f2/f4/f5/f6 reach y240; airborne f3 occupies y69–203. Alpha bounds alone do not prove anatomy, but confirm the inspected limbs are not truncated at a cell border.

## Sequence and separate pose note

Metadata marks this as a nonlooping animation, phases 2/2/3. The sequence was inspected frame by frame, including f5/f6-to-idle recovery comparison. No browser playback or engine hit/hurtbox test is claimed. Cell translations in the committed sidecar are part of the reviewed output; the airborne y position is not an anatomical scale change.

The original SKILLS_REVAMP brief describes a straighter horizontal flight with trailing legs. v02 f3 instead tucks its knees. This is a **pose deviation, not this audit's scale failure**; the requested scope is the user-selected v02 anatomy/scale. The far tucked leg is partly occluded, so its full segment lengths remain uncertain.

No source, manifest, tracker, review row, public pack, approval or technicalHold field was changed. Claude retains integration/contact decisions; this evidence should not be relabeled as an automatic head pass or a comprehensive numeric +/-6% certification.
