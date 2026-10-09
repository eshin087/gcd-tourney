# Final crowd QA B

Date: 2026-10-09. Scope: original crowd batch indices 36–70 inclusive. Visually inspected all **283/283 raw images, 849 poses, 35/35 batches** using view_image. All inspected versions were v01. This is a snapshot of the explicitly linked versions; later repairs require separate QA. No queue, images, shared trackers or outputs changed by this audit.

## Findings

- Two high-severity anatomy failures: org-cosp-010 and sm-010.
- One medium-severity prop duplication: org-trvl-011.
- Remaining 280 raw images have usable coherent identities and three distinguishable complete poses. This is a raw visual recommendation, not user approval or packed/game validation.
- Packer must remove near-magenta noise, quantize palette, apply height classes and retain detached roster props. Precise color counts, packed cells and game output were not measured here. Worker claim notes already disclose background/palette issues.
- Equal-third crossings alone are packing concerns when adjacent silhouettes remain separated. Use adaptive extraction; do not regenerate solely for these crossings.

## Exact corrections

- [org-cosp-010_v01.png](../crowd/raw/org-cosp-010_v01.png): FAIL: shocked pose has three arms/hands. Regenerate with exactly two arms: one polearm grip and one startled hand.
- [sm-010_v01.png](../crowd/raw/sm-010_v01.png): FAIL: idle has three arms/hands (staff grip, chin hand, hanging hand). Regenerate with exactly two arms; retain one consistent full-length red-orb key staff.
- [org-trvl-011_v01.png](../crowd/raw/org-trvl-011_v01.png): FIX: idle duplicates binoculars at eyes and chest. Keep one pair at eyes in idle and hanging in other poses.

## Packing and continuity notes

- Broad separated silhouettes/long props: ken-003/006; org-ma-003/004/007/010/013/014/016/018; mob-007 umbrella; mha-018; nar-005/013; org-cosp-003/007/013; op-003/004/020/022/026; org-punk-005 yo-yo; ranma-003/007; org-rich-001; org-ra-007; seiya-005/007; sd-003/005/006; org-stud-004/005; org-trvl-001/008/013; org-vw-001/004/011/015; yyh-002/006/008. Preserve silhouette before fitting all three to uniform per-spectator scale.
- Tall detached elements: org-stud-011 balloon, org-trvl-009 phone, org-vw-012 balloons/hat, yyh-003 rose petals; preserve with their correct pose, not as another spectator. Many other dropped props/effects are roster-driven and are not anatomy errors.
- Special intentional anatomy: mha-013 six arms; org-ra-010 four arms; opm-009 robotic backpack arms; op-011 one arm; op-012 detached head/hands; mob-003 ghost tail; org-ra-004 three eyes; yyh-004 forehead eye. Do not normalize away these identities.
- Keying: org-rich-008 tablet contains bright magenta-like stripe; nar-030 pale pink steam, sm-007 pink identity colors, opm-003 green aura, and other purple/pink costumes need edge/content checks after masking.
- Squash/hops/crouches: mob-003, org-ra-006, org-mp-003, org-punk-009, sd-004, sxf-004 and small children have intended pose-height changes; do not independently stretch poses.
- Minor continuity: op-002 sword belt side changes; org-mp-010 cheer striker appears tucked/unheld; org-trvl-006 whistle appears both at mouth and neck in cheer (small prop duplication). These are low severity crowd-scale details, not anatomy blockers.

## Batch coverage

### crowd-kenichi-01

Verdict: Usable raw art; pack and validate.

Inspected: [ken-001_v01.png](../crowd/raw/ken-001_v01.png), [ken-002_v01.png](../crowd/raw/ken-002_v01.png), [ken-003_v01.png](../crowd/raw/ken-003_v01.png), [ken-004_v01.png](../crowd/raw/ken-004_v01.png), [ken-005_v01.png](../crowd/raw/ken-005_v01.png), [ken-006_v01.png](../crowd/raw/ken-006_v01.png).

### crowd-martial-artists-01

Verdict: Usable raw art; pack and validate.

Inspected: [org-ma-001_v01.png](../crowd/raw/org-ma-001_v01.png), [org-ma-002_v01.png](../crowd/raw/org-ma-002_v01.png), [org-ma-003_v01.png](../crowd/raw/org-ma-003_v01.png), [org-ma-004_v01.png](../crowd/raw/org-ma-004_v01.png), [org-ma-005_v01.png](../crowd/raw/org-ma-005_v01.png), [org-ma-006_v01.png](../crowd/raw/org-ma-006_v01.png), [org-ma-007_v01.png](../crowd/raw/org-ma-007_v01.png), [org-ma-008_v01.png](../crowd/raw/org-ma-008_v01.png), [org-ma-009_v01.png](../crowd/raw/org-ma-009_v01.png), [org-ma-010_v01.png](../crowd/raw/org-ma-010_v01.png).

### crowd-martial-artists-02

Verdict: Usable raw art; pack and validate.

Inspected: [org-ma-011_v01.png](../crowd/raw/org-ma-011_v01.png), [org-ma-012_v01.png](../crowd/raw/org-ma-012_v01.png), [org-ma-013_v01.png](../crowd/raw/org-ma-013_v01.png), [org-ma-014_v01.png](../crowd/raw/org-ma-014_v01.png), [org-ma-015_v01.png](../crowd/raw/org-ma-015_v01.png), [org-ma-016_v01.png](../crowd/raw/org-ma-016_v01.png), [org-ma-017_v01.png](../crowd/raw/org-ma-017_v01.png), [org-ma-018_v01.png](../crowd/raw/org-ma-018_v01.png), [org-ma-019_v01.png](../crowd/raw/org-ma-019_v01.png), [org-ma-020_v01.png](../crowd/raw/org-ma-020_v01.png).

### crowd-mob-psycho-100-01

Verdict: Usable raw art; pack and validate.

Inspected: [mob-001_v01.png](../crowd/raw/mob-001_v01.png), [mob-002_v01.png](../crowd/raw/mob-002_v01.png), [mob-003_v01.png](../crowd/raw/mob-003_v01.png), [mob-004_v01.png](../crowd/raw/mob-004_v01.png), [mob-005_v01.png](../crowd/raw/mob-005_v01.png), [mob-006_v01.png](../crowd/raw/mob-006_v01.png), [mob-007_v01.png](../crowd/raw/mob-007_v01.png), [mob-008_v01.png](../crowd/raw/mob-008_v01.png).

### crowd-monks-priests-01

Verdict: Usable raw art; pack and validate.

Inspected: [org-mp-001_v01.png](../crowd/raw/org-mp-001_v01.png), [org-mp-002_v01.png](../crowd/raw/org-mp-002_v01.png), [org-mp-003_v01.png](../crowd/raw/org-mp-003_v01.png), [org-mp-004_v01.png](../crowd/raw/org-mp-004_v01.png), [org-mp-005_v01.png](../crowd/raw/org-mp-005_v01.png), [org-mp-006_v01.png](../crowd/raw/org-mp-006_v01.png), [org-mp-007_v01.png](../crowd/raw/org-mp-007_v01.png), [org-mp-008_v01.png](../crowd/raw/org-mp-008_v01.png), [org-mp-009_v01.png](../crowd/raw/org-mp-009_v01.png), [org-mp-010_v01.png](../crowd/raw/org-mp-010_v01.png).

### crowd-my-hero-academia-01

Verdict: Usable raw art; pack and validate.

Inspected: [mha-001_v01.png](../crowd/raw/mha-001_v01.png), [mha-002_v01.png](../crowd/raw/mha-002_v01.png), [mha-003_v01.png](../crowd/raw/mha-003_v01.png), [mha-004_v01.png](../crowd/raw/mha-004_v01.png), [mha-005_v01.png](../crowd/raw/mha-005_v01.png), [mha-006_v01.png](../crowd/raw/mha-006_v01.png), [mha-007_v01.png](../crowd/raw/mha-007_v01.png), [mha-008_v01.png](../crowd/raw/mha-008_v01.png), [mha-009_v01.png](../crowd/raw/mha-009_v01.png), [mha-010_v01.png](../crowd/raw/mha-010_v01.png).

### crowd-my-hero-academia-02

Verdict: Usable raw art; pack and validate.

Inspected: [mha-011_v01.png](../crowd/raw/mha-011_v01.png), [mha-012_v01.png](../crowd/raw/mha-012_v01.png), [mha-013_v01.png](../crowd/raw/mha-013_v01.png), [mha-014_v01.png](../crowd/raw/mha-014_v01.png), [mha-015_v01.png](../crowd/raw/mha-015_v01.png), [mha-016_v01.png](../crowd/raw/mha-016_v01.png), [mha-017_v01.png](../crowd/raw/mha-017_v01.png), [mha-018_v01.png](../crowd/raw/mha-018_v01.png), [mha-019_v01.png](../crowd/raw/mha-019_v01.png), [mha-020_v01.png](../crowd/raw/mha-020_v01.png).

### crowd-naruto-01

Verdict: Usable raw art; pack and validate.

Inspected: [nar-001_v01.png](../crowd/raw/nar-001_v01.png), [nar-002_v01.png](../crowd/raw/nar-002_v01.png), [nar-003_v01.png](../crowd/raw/nar-003_v01.png), [nar-004_v01.png](../crowd/raw/nar-004_v01.png), [nar-005_v01.png](../crowd/raw/nar-005_v01.png), [nar-006_v01.png](../crowd/raw/nar-006_v01.png), [nar-007_v01.png](../crowd/raw/nar-007_v01.png), [nar-008_v01.png](../crowd/raw/nar-008_v01.png), [nar-009_v01.png](../crowd/raw/nar-009_v01.png), [nar-010_v01.png](../crowd/raw/nar-010_v01.png).

### crowd-naruto-02

Verdict: Usable raw art; pack and validate.

Inspected: [nar-011_v01.png](../crowd/raw/nar-011_v01.png), [nar-012_v01.png](../crowd/raw/nar-012_v01.png), [nar-013_v01.png](../crowd/raw/nar-013_v01.png), [nar-014_v01.png](../crowd/raw/nar-014_v01.png), [nar-015_v01.png](../crowd/raw/nar-015_v01.png), [nar-016_v01.png](../crowd/raw/nar-016_v01.png), [nar-017_v01.png](../crowd/raw/nar-017_v01.png), [nar-018_v01.png](../crowd/raw/nar-018_v01.png), [nar-019_v01.png](../crowd/raw/nar-019_v01.png), [nar-020_v01.png](../crowd/raw/nar-020_v01.png).

### crowd-naruto-03

Verdict: Usable raw art; pack and validate.

Inspected: [nar-021_v01.png](../crowd/raw/nar-021_v01.png), [nar-022_v01.png](../crowd/raw/nar-022_v01.png), [nar-023_v01.png](../crowd/raw/nar-023_v01.png), [nar-024_v01.png](../crowd/raw/nar-024_v01.png), [nar-025_v01.png](../crowd/raw/nar-025_v01.png), [nar-026_v01.png](../crowd/raw/nar-026_v01.png), [nar-027_v01.png](../crowd/raw/nar-027_v01.png), [nar-028_v01.png](../crowd/raw/nar-028_v01.png), [nar-029_v01.png](../crowd/raw/nar-029_v01.png), [nar-030_v01.png](../crowd/raw/nar-030_v01.png).

### crowd-ninja-samurai-cosplayers-01

Verdict: Correction required: org-cosp-010. Other images usable.

Inspected: [org-cosp-001_v01.png](../crowd/raw/org-cosp-001_v01.png), [org-cosp-002_v01.png](../crowd/raw/org-cosp-002_v01.png), [org-cosp-003_v01.png](../crowd/raw/org-cosp-003_v01.png), [org-cosp-004_v01.png](../crowd/raw/org-cosp-004_v01.png), [org-cosp-005_v01.png](../crowd/raw/org-cosp-005_v01.png), [org-cosp-006_v01.png](../crowd/raw/org-cosp-006_v01.png), [org-cosp-007_v01.png](../crowd/raw/org-cosp-007_v01.png), [org-cosp-008_v01.png](../crowd/raw/org-cosp-008_v01.png), [org-cosp-009_v01.png](../crowd/raw/org-cosp-009_v01.png), [org-cosp-010_v01.png](../crowd/raw/org-cosp-010_v01.png).

### crowd-ninja-samurai-cosplayers-02

Verdict: Usable raw art; pack and validate.

Inspected: [org-cosp-011_v01.png](../crowd/raw/org-cosp-011_v01.png), [org-cosp-012_v01.png](../crowd/raw/org-cosp-012_v01.png), [org-cosp-013_v01.png](../crowd/raw/org-cosp-013_v01.png).

### crowd-one-piece-01

Verdict: Usable raw art; pack and validate.

Inspected: [op-001_v01.png](../crowd/raw/op-001_v01.png), [op-002_v01.png](../crowd/raw/op-002_v01.png), [op-003_v01.png](../crowd/raw/op-003_v01.png), [op-004_v01.png](../crowd/raw/op-004_v01.png), [op-005_v01.png](../crowd/raw/op-005_v01.png), [op-006_v01.png](../crowd/raw/op-006_v01.png), [op-007_v01.png](../crowd/raw/op-007_v01.png), [op-008_v01.png](../crowd/raw/op-008_v01.png), [op-009_v01.png](../crowd/raw/op-009_v01.png), [op-010_v01.png](../crowd/raw/op-010_v01.png).

### crowd-one-piece-02

Verdict: Usable raw art; pack and validate.

Inspected: [op-011_v01.png](../crowd/raw/op-011_v01.png), [op-012_v01.png](../crowd/raw/op-012_v01.png), [op-013_v01.png](../crowd/raw/op-013_v01.png), [op-014_v01.png](../crowd/raw/op-014_v01.png), [op-015_v01.png](../crowd/raw/op-015_v01.png), [op-016_v01.png](../crowd/raw/op-016_v01.png), [op-017_v01.png](../crowd/raw/op-017_v01.png), [op-018_v01.png](../crowd/raw/op-018_v01.png), [op-019_v01.png](../crowd/raw/op-019_v01.png), [op-020_v01.png](../crowd/raw/op-020_v01.png).

### crowd-one-piece-03

Verdict: Usable raw art; pack and validate.

Inspected: [op-021_v01.png](../crowd/raw/op-021_v01.png), [op-022_v01.png](../crowd/raw/op-022_v01.png), [op-023_v01.png](../crowd/raw/op-023_v01.png), [op-024_v01.png](../crowd/raw/op-024_v01.png), [op-025_v01.png](../crowd/raw/op-025_v01.png), [op-026_v01.png](../crowd/raw/op-026_v01.png), [op-027_v01.png](../crowd/raw/op-027_v01.png), [op-028_v01.png](../crowd/raw/op-028_v01.png), [op-029_v01.png](../crowd/raw/op-029_v01.png), [op-030_v01.png](../crowd/raw/op-030_v01.png).

### crowd-one-punch-man-01

Verdict: Usable raw art; pack and validate.

Inspected: [opm-001_v01.png](../crowd/raw/opm-001_v01.png), [opm-002_v01.png](../crowd/raw/opm-002_v01.png), [opm-003_v01.png](../crowd/raw/opm-003_v01.png), [opm-004_v01.png](../crowd/raw/opm-004_v01.png), [opm-005_v01.png](../crowd/raw/opm-005_v01.png), [opm-006_v01.png](../crowd/raw/opm-006_v01.png), [opm-007_v01.png](../crowd/raw/opm-007_v01.png), [opm-008_v01.png](../crowd/raw/opm-008_v01.png), [opm-009_v01.png](../crowd/raw/opm-009_v01.png), [opm-010_v01.png](../crowd/raw/opm-010_v01.png).

### crowd-one-punch-man-02

Verdict: Usable raw art; pack and validate.

Inspected: [opm-011_v01.png](../crowd/raw/opm-011_v01.png), [opm-012_v01.png](../crowd/raw/opm-012_v01.png).

### crowd-punks-delinquents-01

Verdict: Usable raw art; pack and validate.

Inspected: [org-punk-001_v01.png](../crowd/raw/org-punk-001_v01.png), [org-punk-002_v01.png](../crowd/raw/org-punk-002_v01.png), [org-punk-003_v01.png](../crowd/raw/org-punk-003_v01.png), [org-punk-004_v01.png](../crowd/raw/org-punk-004_v01.png), [org-punk-005_v01.png](../crowd/raw/org-punk-005_v01.png), [org-punk-006_v01.png](../crowd/raw/org-punk-006_v01.png), [org-punk-007_v01.png](../crowd/raw/org-punk-007_v01.png), [org-punk-008_v01.png](../crowd/raw/org-punk-008_v01.png), [org-punk-009_v01.png](../crowd/raw/org-punk-009_v01.png), [org-punk-010_v01.png](../crowd/raw/org-punk-010_v01.png).

### crowd-punks-delinquents-02

Verdict: Usable raw art; pack and validate.

Inspected: [org-punk-011_v01.png](../crowd/raw/org-punk-011_v01.png), [org-punk-012_v01.png](../crowd/raw/org-punk-012_v01.png), [org-punk-013_v01.png](../crowd/raw/org-punk-013_v01.png), [org-punk-014_v01.png](../crowd/raw/org-punk-014_v01.png), [org-punk-015_v01.png](../crowd/raw/org-punk-015_v01.png).

### crowd-ranma-01

Verdict: Usable raw art; pack and validate.

Inspected: [ranma-001_v01.png](../crowd/raw/ranma-001_v01.png), [ranma-002_v01.png](../crowd/raw/ranma-002_v01.png), [ranma-003_v01.png](../crowd/raw/ranma-003_v01.png), [ranma-004_v01.png](../crowd/raw/ranma-004_v01.png), [ranma-005_v01.png](../crowd/raw/ranma-005_v01.png), [ranma-006_v01.png](../crowd/raw/ranma-006_v01.png), [ranma-007_v01.png](../crowd/raw/ranma-007_v01.png), [ranma-008_v01.png](../crowd/raw/ranma-008_v01.png).

### crowd-rich-patrons-01

Verdict: Usable raw art; pack and validate.

Inspected: [org-rich-001_v01.png](../crowd/raw/org-rich-001_v01.png), [org-rich-002_v01.png](../crowd/raw/org-rich-002_v01.png), [org-rich-003_v01.png](../crowd/raw/org-rich-003_v01.png), [org-rich-004_v01.png](../crowd/raw/org-rich-004_v01.png), [org-rich-005_v01.png](../crowd/raw/org-rich-005_v01.png), [org-rich-006_v01.png](../crowd/raw/org-rich-006_v01.png), [org-rich-007_v01.png](../crowd/raw/org-rich-007_v01.png), [org-rich-008_v01.png](../crowd/raw/org-rich-008_v01.png), [org-rich-009_v01.png](../crowd/raw/org-rich-009_v01.png), [org-rich-010_v01.png](../crowd/raw/org-rich-010_v01.png).

### crowd-rich-patrons-02

Verdict: Usable raw art; pack and validate.

Inspected: [org-rich-011_v01.png](../crowd/raw/org-rich-011_v01.png), [org-rich-012_v01.png](../crowd/raw/org-rich-012_v01.png), [org-rich-013_v01.png](../crowd/raw/org-rich-013_v01.png), [org-rich-014_v01.png](../crowd/raw/org-rich-014_v01.png).

### crowd-robots-aliens-01

Verdict: Usable raw art; pack and validate.

Inspected: [org-ra-001_v01.png](../crowd/raw/org-ra-001_v01.png), [org-ra-002_v01.png](../crowd/raw/org-ra-002_v01.png), [org-ra-003_v01.png](../crowd/raw/org-ra-003_v01.png), [org-ra-004_v01.png](../crowd/raw/org-ra-004_v01.png), [org-ra-005_v01.png](../crowd/raw/org-ra-005_v01.png), [org-ra-006_v01.png](../crowd/raw/org-ra-006_v01.png), [org-ra-007_v01.png](../crowd/raw/org-ra-007_v01.png), [org-ra-008_v01.png](../crowd/raw/org-ra-008_v01.png), [org-ra-009_v01.png](../crowd/raw/org-ra-009_v01.png), [org-ra-010_v01.png](../crowd/raw/org-ra-010_v01.png).

### crowd-sailor-moon-01

Verdict: Correction required: sm-010. Other images usable.

Inspected: [sm-001_v01.png](../crowd/raw/sm-001_v01.png), [sm-002_v01.png](../crowd/raw/sm-002_v01.png), [sm-003_v01.png](../crowd/raw/sm-003_v01.png), [sm-004_v01.png](../crowd/raw/sm-004_v01.png), [sm-005_v01.png](../crowd/raw/sm-005_v01.png), [sm-006_v01.png](../crowd/raw/sm-006_v01.png), [sm-007_v01.png](../crowd/raw/sm-007_v01.png), [sm-008_v01.png](../crowd/raw/sm-008_v01.png), [sm-009_v01.png](../crowd/raw/sm-009_v01.png), [sm-010_v01.png](../crowd/raw/sm-010_v01.png).

### crowd-saint-seiya-01

Verdict: Usable raw art; pack and validate.

Inspected: [seiya-001_v01.png](../crowd/raw/seiya-001_v01.png), [seiya-002_v01.png](../crowd/raw/seiya-002_v01.png), [seiya-003_v01.png](../crowd/raw/seiya-003_v01.png), [seiya-004_v01.png](../crowd/raw/seiya-004_v01.png), [seiya-005_v01.png](../crowd/raw/seiya-005_v01.png), [seiya-006_v01.png](../crowd/raw/seiya-006_v01.png), [seiya-007_v01.png](../crowd/raw/seiya-007_v01.png), [seiya-008_v01.png](../crowd/raw/seiya-008_v01.png).

### crowd-slam-dunk-01

Verdict: Usable raw art; pack and validate.

Inspected: [sd-001_v01.png](../crowd/raw/sd-001_v01.png), [sd-002_v01.png](../crowd/raw/sd-002_v01.png), [sd-003_v01.png](../crowd/raw/sd-003_v01.png), [sd-004_v01.png](../crowd/raw/sd-004_v01.png), [sd-005_v01.png](../crowd/raw/sd-005_v01.png), [sd-006_v01.png](../crowd/raw/sd-006_v01.png).

### crowd-spy-x-family-01

Verdict: Usable raw art; pack and validate.

Inspected: [sxf-001_v01.png](../crowd/raw/sxf-001_v01.png), [sxf-002_v01.png](../crowd/raw/sxf-002_v01.png), [sxf-003_v01.png](../crowd/raw/sxf-003_v01.png), [sxf-004_v01.png](../crowd/raw/sxf-004_v01.png), [sxf-005_v01.png](../crowd/raw/sxf-005_v01.png), [sxf-006_v01.png](../crowd/raw/sxf-006_v01.png).

### crowd-students-01

Verdict: Usable raw art; pack and validate.

Inspected: [org-stud-001_v01.png](../crowd/raw/org-stud-001_v01.png), [org-stud-002_v01.png](../crowd/raw/org-stud-002_v01.png), [org-stud-003_v01.png](../crowd/raw/org-stud-003_v01.png), [org-stud-004_v01.png](../crowd/raw/org-stud-004_v01.png), [org-stud-005_v01.png](../crowd/raw/org-stud-005_v01.png), [org-stud-006_v01.png](../crowd/raw/org-stud-006_v01.png), [org-stud-007_v01.png](../crowd/raw/org-stud-007_v01.png), [org-stud-008_v01.png](../crowd/raw/org-stud-008_v01.png), [org-stud-009_v01.png](../crowd/raw/org-stud-009_v01.png), [org-stud-010_v01.png](../crowd/raw/org-stud-010_v01.png).

### crowd-students-02

Verdict: Usable raw art; pack and validate.

Inspected: [org-stud-011_v01.png](../crowd/raw/org-stud-011_v01.png), [org-stud-012_v01.png](../crowd/raw/org-stud-012_v01.png), [org-stud-013_v01.png](../crowd/raw/org-stud-013_v01.png), [org-stud-014_v01.png](../crowd/raw/org-stud-014_v01.png), [org-stud-015_v01.png](../crowd/raw/org-stud-015_v01.png).

### crowd-travelers-tourists-01

Verdict: Usable raw art; pack and validate.

Inspected: [org-trvl-001_v01.png](../crowd/raw/org-trvl-001_v01.png), [org-trvl-002_v01.png](../crowd/raw/org-trvl-002_v01.png), [org-trvl-003_v01.png](../crowd/raw/org-trvl-003_v01.png), [org-trvl-004_v01.png](../crowd/raw/org-trvl-004_v01.png), [org-trvl-005_v01.png](../crowd/raw/org-trvl-005_v01.png), [org-trvl-006_v01.png](../crowd/raw/org-trvl-006_v01.png), [org-trvl-007_v01.png](../crowd/raw/org-trvl-007_v01.png), [org-trvl-008_v01.png](../crowd/raw/org-trvl-008_v01.png), [org-trvl-009_v01.png](../crowd/raw/org-trvl-009_v01.png), [org-trvl-010_v01.png](../crowd/raw/org-trvl-010_v01.png).

### crowd-travelers-tourists-02

Verdict: Correction required: org-trvl-011. Other images usable.

Inspected: [org-trvl-011_v01.png](../crowd/raw/org-trvl-011_v01.png), [org-trvl-012_v01.png](../crowd/raw/org-trvl-012_v01.png), [org-trvl-013_v01.png](../crowd/raw/org-trvl-013_v01.png), [org-trvl-014_v01.png](../crowd/raw/org-trvl-014_v01.png), [org-trvl-015_v01.png](../crowd/raw/org-trvl-015_v01.png).

### crowd-vendors-workers-01

Verdict: Usable raw art; pack and validate.

Inspected: [org-vw-001_v01.png](../crowd/raw/org-vw-001_v01.png), [org-vw-002_v01.png](../crowd/raw/org-vw-002_v01.png), [org-vw-003_v01.png](../crowd/raw/org-vw-003_v01.png), [org-vw-004_v01.png](../crowd/raw/org-vw-004_v01.png), [org-vw-005_v01.png](../crowd/raw/org-vw-005_v01.png), [org-vw-006_v01.png](../crowd/raw/org-vw-006_v01.png), [org-vw-007_v01.png](../crowd/raw/org-vw-007_v01.png), [org-vw-008_v01.png](../crowd/raw/org-vw-008_v01.png), [org-vw-009_v01.png](../crowd/raw/org-vw-009_v01.png), [org-vw-010_v01.png](../crowd/raw/org-vw-010_v01.png).

### crowd-vendors-workers-02

Verdict: Usable raw art; pack and validate.

Inspected: [org-vw-011_v01.png](../crowd/raw/org-vw-011_v01.png), [org-vw-012_v01.png](../crowd/raw/org-vw-012_v01.png), [org-vw-013_v01.png](../crowd/raw/org-vw-013_v01.png), [org-vw-014_v01.png](../crowd/raw/org-vw-014_v01.png), [org-vw-015_v01.png](../crowd/raw/org-vw-015_v01.png).

### crowd-yu-yu-hakusho-01

Verdict: Usable raw art; pack and validate.

Inspected: [yyh-001_v01.png](../crowd/raw/yyh-001_v01.png), [yyh-002_v01.png](../crowd/raw/yyh-002_v01.png), [yyh-003_v01.png](../crowd/raw/yyh-003_v01.png), [yyh-004_v01.png](../crowd/raw/yyh-004_v01.png), [yyh-005_v01.png](../crowd/raw/yyh-005_v01.png), [yyh-006_v01.png](../crowd/raw/yyh-006_v01.png), [yyh-007_v01.png](../crowd/raw/yyh-007_v01.png), [yyh-008_v01.png](../crowd/raw/yyh-008_v01.png), [yyh-009_v01.png](../crowd/raw/yyh-009_v01.png), [yyh-010_v01.png](../crowd/raw/yyh-010_v01.png).

### crowd-yu-yu-hakusho-02

Verdict: Usable raw art; pack and validate.

Inspected: [yyh-011_v01.png](../crowd/raw/yyh-011_v01.png), [yyh-012_v01.png](../crowd/raw/yyh-012_v01.png).
