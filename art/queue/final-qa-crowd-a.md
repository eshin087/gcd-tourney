# Final crowd QA A

Date: 2026-10-09. Scope: original crowd batches indices 0–35, 36 batches / 293 spectators. 121 current approved images across 14 batches verified against highest approvedVersion and REVIEW records; none had a newer candidate. Their approvals are preserved. All 172 current images across remaining 22 batches were visually inspected individually with view_image (516 poses). Four DB04 v02 files arrived during audit and were independently inspected successfully. No missing files remain in this scope.

This is raw visual QA, not packed atlas or in-game approval. Near-magenta noise, raw palettes above 24 colors and inconsistent canvas margins are shared packing risks. Verify color-key cleanup, final 64x96 cells, roster height class, feet pivot and clean palette on packed output. Cutline crossings with clear gaps are extraction issues, not grounds for regeneration by themselves.

## Concrete corrections

- **High — fma-002_v01**: cheer and shocked poses each have three arms (two raised plus an extra cat-holding forearm). Generate exactly two arms: one cradles cat and the other cheers/reacts. Preserve armor and cat.
- **Medium — db-029_v02**: remove two detached steam clouds from shocked pose; keep cheek puff and head holes.
- **Medium — fma-005_v01**: remove all floating sparkle crosses; keep forelock, mustache, gauntlets and flexes.
- **Medium — jojo-006_v01**: remove cheer fingertip flames; preserve raised hands/robe. These effects are requested by original roster wording but forbidden in PROMPTS. Lead has now corrected the roster conflict and reopened relevant batches.

Minor detached motion strokes in db-032, org-el-010, org-fv-003/004/007, ippo-003, org-idol-013 are recorded as caveats, not another broad regeneration round. Physical dropped props, tears touching faces and attached ornaments are distinct from disallowed decorative symbols.

## Batch coverage

### Previously approved; inventory checked and approval preserved

- **crowd-animal-folk-01** — [org-af-001_v01.png](../crowd/raw/org-af-001_v01.png), [org-af-002_v01.png](../crowd/raw/org-af-002_v01.png), [org-af-003_v01.png](../crowd/raw/org-af-003_v01.png), [org-af-004_v01.png](../crowd/raw/org-af-004_v01.png), [org-af-005_v01.png](../crowd/raw/org-af-005_v01.png), [org-af-006_v01.png](../crowd/raw/org-af-006_v01.png), [org-af-007_v01.png](../crowd/raw/org-af-007_v01.png), [org-af-008_v01.png](../crowd/raw/org-af-008_v01.png), [org-af-009_v01.png](../crowd/raw/org-af-009_v01.png), [org-af-010_v01.png](../crowd/raw/org-af-010_v01.png). Approved current versions preserved.

- **crowd-animal-folk-02** — [org-af-011_v01.png](../crowd/raw/org-af-011_v01.png), [org-af-012_v01.png](../crowd/raw/org-af-012_v01.png), [org-af-013_v02.png](../crowd/raw/org-af-013_v02.png), [org-af-014_v01.png](../crowd/raw/org-af-014_v01.png), [org-af-015_v02.png](../crowd/raw/org-af-015_v02.png), [org-af-016_v01.png](../crowd/raw/org-af-016_v01.png), [org-af-017_v01.png](../crowd/raw/org-af-017_v01.png), [org-af-018_v01.png](../crowd/raw/org-af-018_v01.png), [org-af-019_v02.png](../crowd/raw/org-af-019_v02.png), [org-af-020_v01.png](../crowd/raw/org-af-020_v01.png). Approved current versions preserved.

- **crowd-athletes-01** — [org-athl-001_v01.png](../crowd/raw/org-athl-001_v01.png), [org-athl-002_v01.png](../crowd/raw/org-athl-002_v01.png), [org-athl-003_v01.png](../crowd/raw/org-athl-003_v01.png), [org-athl-004_v01.png](../crowd/raw/org-athl-004_v01.png), [org-athl-005_v02.png](../crowd/raw/org-athl-005_v02.png), [org-athl-006_v02.png](../crowd/raw/org-athl-006_v02.png), [org-athl-007_v01.png](../crowd/raw/org-athl-007_v01.png), [org-athl-008_v01.png](../crowd/raw/org-athl-008_v01.png), [org-athl-009_v02.png](../crowd/raw/org-athl-009_v02.png), [org-athl-010_v01.png](../crowd/raw/org-athl-010_v01.png). Approved current versions preserved.

- **crowd-athletes-02** — [org-athl-011_v02.png](../crowd/raw/org-athl-011_v02.png), [org-athl-012_v02.png](../crowd/raw/org-athl-012_v02.png). Approved current versions preserved.

- **crowd-attack-on-titan-01** — [aot-001_v01.png](../crowd/raw/aot-001_v01.png), [aot-002_v01.png](../crowd/raw/aot-002_v01.png), [aot-003_v01.png](../crowd/raw/aot-003_v01.png), [aot-004_v01.png](../crowd/raw/aot-004_v01.png), [aot-005_v01.png](../crowd/raw/aot-005_v01.png), [aot-006_v01.png](../crowd/raw/aot-006_v01.png), [aot-007_v01.png](../crowd/raw/aot-007_v01.png), [aot-008_v02.png](../crowd/raw/aot-008_v02.png), [aot-009_v02.png](../crowd/raw/aot-009_v02.png), [aot-010_v01.png](../crowd/raw/aot-010_v01.png). Approved current versions preserved.

- **crowd-baki-01** — [baki-001_v01.png](../crowd/raw/baki-001_v01.png), [baki-002_v02.png](../crowd/raw/baki-002_v02.png), [baki-003_v02.png](../crowd/raw/baki-003_v02.png), [baki-004_v01.png](../crowd/raw/baki-004_v01.png), [baki-005_v02.png](../crowd/raw/baki-005_v02.png), [baki-006_v02.png](../crowd/raw/baki-006_v02.png), [baki-007_v02.png](../crowd/raw/baki-007_v02.png), [baki-008_v01.png](../crowd/raw/baki-008_v01.png). Approved current versions preserved.

- **crowd-bleach-01** — [bl-001_v02.png](../crowd/raw/bl-001_v02.png), [bl-002_v01.png](../crowd/raw/bl-002_v01.png), [bl-003_v02.png](../crowd/raw/bl-003_v02.png), [bl-004_v01.png](../crowd/raw/bl-004_v01.png), [bl-005_v02.png](../crowd/raw/bl-005_v02.png), [bl-006_v02.png](../crowd/raw/bl-006_v02.png), [bl-007_v01.png](../crowd/raw/bl-007_v01.png), [bl-008_v01.png](../crowd/raw/bl-008_v01.png), [bl-009_v01.png](../crowd/raw/bl-009_v01.png), [bl-010_v01.png](../crowd/raw/bl-010_v01.png). Approved current versions preserved.

- **crowd-bleach-02** — [bl-011_v01.png](../crowd/raw/bl-011_v01.png), [bl-012_v01.png](../crowd/raw/bl-012_v01.png), [bl-013_v01.png](../crowd/raw/bl-013_v01.png), [bl-014_v01.png](../crowd/raw/bl-014_v01.png), [bl-015_v01.png](../crowd/raw/bl-015_v01.png), [bl-016_v01.png](../crowd/raw/bl-016_v01.png), [bl-017_v01.png](../crowd/raw/bl-017_v01.png), [bl-018_v01.png](../crowd/raw/bl-018_v01.png), [bl-019_v01.png](../crowd/raw/bl-019_v01.png), [bl-020_v01.png](../crowd/raw/bl-020_v01.png). Approved current versions preserved.

- **crowd-chainsaw-man-01** — [csm-001_v01.png](../crowd/raw/csm-001_v01.png), [csm-002_v01.png](../crowd/raw/csm-002_v01.png), [csm-003_v01.png](../crowd/raw/csm-003_v01.png), [csm-004_v01.png](../crowd/raw/csm-004_v01.png), [csm-005_v01.png](../crowd/raw/csm-005_v01.png), [csm-006_v01.png](../crowd/raw/csm-006_v01.png), [csm-007_v01.png](../crowd/raw/csm-007_v01.png), [csm-008_v01.png](../crowd/raw/csm-008_v01.png), [csm-009_v01.png](../crowd/raw/csm-009_v01.png), [csm-010_v02.png](../crowd/raw/csm-010_v02.png). Approved current versions preserved.

- **crowd-cowboy-bebop-01** — [bebop-001_v01.png](../crowd/raw/bebop-001_v01.png), [bebop-002_v01.png](../crowd/raw/bebop-002_v01.png), [bebop-003_v02.png](../crowd/raw/bebop-003_v02.png), [bebop-004_v02.png](../crowd/raw/bebop-004_v02.png), [bebop-005_v01.png](../crowd/raw/bebop-005_v01.png), [bebop-006_v01.png](../crowd/raw/bebop-006_v01.png). Approved current versions preserved.

- **crowd-demon-slayer-01** — [ds-001_v01.png](../crowd/raw/ds-001_v01.png), [ds-002_v01.png](../crowd/raw/ds-002_v01.png), [ds-003_v01.png](../crowd/raw/ds-003_v01.png), [ds-004_v01.png](../crowd/raw/ds-004_v01.png), [ds-005_v01.png](../crowd/raw/ds-005_v01.png), [ds-006_v01.png](../crowd/raw/ds-006_v01.png), [ds-007_v01.png](../crowd/raw/ds-007_v01.png), [ds-008_v01.png](../crowd/raw/ds-008_v01.png), [ds-009_v01.png](../crowd/raw/ds-009_v01.png), [ds-010_v01.png](../crowd/raw/ds-010_v01.png). Approved current versions preserved.

- **crowd-demon-slayer-02** — [ds-011_v01.png](../crowd/raw/ds-011_v01.png), [ds-012_v01.png](../crowd/raw/ds-012_v01.png), [ds-013_v01.png](../crowd/raw/ds-013_v01.png), [ds-014_v01.png](../crowd/raw/ds-014_v01.png), [ds-015_v01.png](../crowd/raw/ds-015_v01.png). Approved current versions preserved.

- **crowd-dragon-ball-01** — [db-001_v01.png](../crowd/raw/db-001_v01.png), [db-002_v01.png](../crowd/raw/db-002_v01.png), [db-003_v01.png](../crowd/raw/db-003_v01.png), [db-004_v01.png](../crowd/raw/db-004_v01.png), [db-005_v01.png](../crowd/raw/db-005_v01.png), [db-006_v01.png](../crowd/raw/db-006_v01.png), [db-007_v01.png](../crowd/raw/db-007_v01.png), [db-008_v01.png](../crowd/raw/db-008_v01.png), [db-009_v01.png](../crowd/raw/db-009_v01.png), [db-010_v01.png](../crowd/raw/db-010_v01.png). Approved current versions preserved.

- **crowd-dragon-ball-02** — [db-011_v01.png](../crowd/raw/db-011_v01.png), [db-012_v01.png](../crowd/raw/db-012_v01.png), [db-013_v01.png](../crowd/raw/db-013_v01.png), [db-014_v01.png](../crowd/raw/db-014_v01.png), [db-015_v01.png](../crowd/raw/db-015_v01.png), [db-016_v01.png](../crowd/raw/db-016_v01.png), [db-017_v01.png](../crowd/raw/db-017_v01.png), [db-018_v01.png](../crowd/raw/db-018_v01.png), [db-019_v01.png](../crowd/raw/db-019_v01.png), [db-020_v01.png](../crowd/raw/db-020_v01.png). Approved current versions preserved.

### Individually visually inspected current candidates

#### crowd-dragon-ball-03

[db-021_v01.png](../crowd/raw/db-021_v01.png), [db-022_v01.png](../crowd/raw/db-022_v01.png), [db-023_v01.png](../crowd/raw/db-023_v01.png), [db-024_v01.png](../crowd/raw/db-024_v01.png), [db-025_v01.png](../crowd/raw/db-025_v01.png), [db-026_v01.png](../crowd/raw/db-026_v01.png), [db-027_v01.png](../crowd/raw/db-027_v01.png), [db-028_v01.png](../crowd/raw/db-028_v01.png), [db-029_v02.png](../crowd/raw/_rejected/db-029_v02.png), [db-030_v01.png](../crowd/raw/db-030_v01.png)

Repair db-029_v02: remove detached steam clouds. Other nine pass; db-026 fist/Whis hair need top-padding check.

#### crowd-dragon-ball-04

[db-031_v01.png](../crowd/raw/db-031_v01.png), [db-032_v01.png](../crowd/raw/db-032_v01.png), [db-033_v02.png](../crowd/raw/db-033_v02.png), [db-034_v02.png](../crowd/raw/db-034_v02.png), [db-035_v02.png](../crowd/raw/db-035_v02.png), [db-036_v01.png](../crowd/raw/db-036_v01.png), [db-037_v01.png](../crowd/raw/db-037_v01.png), [db-038_v02.png](../crowd/raw/db-038_v02.png), [db-039_v01.png](../crowd/raw/db-039_v01.png), [db-040_v01.png](../crowd/raw/db-040_v01.png)

All ten pass current anatomy and identities, including independently inspected db-033/034/035/038 v02 repairs. db-037 crosses nominal cutline but silhouettes remain separate; db-032 has minor tail motion ticks.

#### crowd-elders-01

[org-el-001_v01.png](../crowd/raw/org-el-001_v01.png), [org-el-002_v01.png](../crowd/raw/org-el-002_v01.png), [org-el-003_v01.png](../crowd/raw/org-el-003_v01.png), [org-el-004_v01.png](../crowd/raw/org-el-004_v01.png), [org-el-005_v01.png](../crowd/raw/org-el-005_v01.png), [org-el-006_v01.png](../crowd/raw/org-el-006_v01.png), [org-el-007_v01.png](../crowd/raw/org-el-007_v01.png), [org-el-008_v01.png](../crowd/raw/org-el-008_v01.png), [org-el-009_v01.png](../crowd/raw/org-el-009_v01.png), [org-el-010_v02.png](../crowd/raw/org-el-010_v02.png)

All ten pass. Preserve detached roster props (dentures, monocle, yarn, fish); org-el-003/005/008 raised props need headroom check. org-el-010 has minor motion strokes.

#### crowd-elders-02

[org-el-011_v01.png](../crowd/raw/org-el-011_v01.png), [org-el-012_v01.png](../crowd/raw/org-el-012_v01.png), [org-el-013_v01.png](../crowd/raw/org-el-013_v01.png), [org-el-014_v01.png](../crowd/raw/org-el-014_v01.png), [org-el-015_v01.png](../crowd/raw/org-el-015_v01.png)

All five pass. Detached papers, tea and vegetables are intentional physical props. Fine straw/cape details need reduced-size inspection.

#### crowd-evangelion-01

[eva-001_v01.png](../crowd/raw/eva-001_v01.png), [eva-002_v01.png](../crowd/raw/eva-002_v01.png), [eva-003_v01.png](../crowd/raw/eva-003_v01.png), [eva-004_v01.png](../crowd/raw/eva-004_v01.png), [eva-005_v01.png](../crowd/raw/eva-005_v01.png), [eva-006_v01.png](../crowd/raw/eva-006_v01.png)

All six pass. eva-003 blink and eva-005 almost unchanged cheer are specifically requested in roster; do not replace these with generic reactions. Tiny suit insignia should remain shapes at final size.

#### crowd-families-kids-01

[org-fk-001_v01.png](../crowd/raw/org-fk-001_v01.png), [org-fk-002_v01.png](../crowd/raw/org-fk-002_v01.png), [org-fk-003_v01.png](../crowd/raw/org-fk-003_v01.png), [org-fk-004_v01.png](../crowd/raw/org-fk-004_v01.png), [org-fk-005_v01.png](../crowd/raw/org-fk-005_v01.png), [org-fk-006_v01.png](../crowd/raw/org-fk-006_v01.png), [org-fk-007_v01.png](../crowd/raw/org-fk-007_v01.png), [org-fk-008_v01.png](../crowd/raw/org-fk-008_v01.png), [org-fk-009_v01.png](../crowd/raw/org-fk-009_v01.png), [org-fk-010_v02.png](../crowd/raw/org-fk-010_v02.png)

All ten pass with caveat: org-fk-010_v02 is noticeably three-quarter-facing to reveal the back carrier; roster asks glance back, so preserve this identity/pose rather than regenerate solely for facing. Check shoulder-carried paired figures against huge scale.

#### crowd-families-kids-02

[org-fk-011_v01.png](../crowd/raw/org-fk-011_v01.png), [org-fk-012_v01.png](../crowd/raw/org-fk-012_v01.png), [org-fk-013_v01.png](../crowd/raw/org-fk-013_v01.png), [org-fk-014_v01.png](../crowd/raw/org-fk-014_v01.png), [org-fk-015_v01.png](../crowd/raw/org-fk-015_v01.png), [org-fk-016_v01.png](../crowd/raw/org-fk-016_v01.png), [org-fk-017_v01.png](../crowd/raw/org-fk-017_v01.png), [org-fk-018_v01.png](../crowd/raw/org-fk-018_v01.png), [org-fk-019_v01.png](../crowd/raw/org-fk-019_v01.png), [org-fk-020_v01.png](../crowd/raw/org-fk-020_v01.png)

All ten pass; dropped food/binoculars and separate child shapes must stay associated with correct pose.

#### crowd-farmers-villagers-01

[org-farm-001_v02.png](../crowd/raw/org-farm-001_v02.png), [org-farm-002_v01.png](../crowd/raw/org-farm-002_v01.png), [org-farm-003_v01.png](../crowd/raw/org-farm-003_v01.png), [org-farm-004_v01.png](../crowd/raw/org-farm-004_v01.png), [org-farm-005_v01.png](../crowd/raw/org-farm-005_v01.png), [org-farm-006_v01.png](../crowd/raw/org-farm-006_v01.png), [org-farm-007_v01.png](../crowd/raw/org-farm-007_v01.png), [org-farm-008_v02.png](../crowd/raw/org-farm-008_v02.png), [org-farm-009_v01.png](../crowd/raw/org-farm-009_v01.png), [org-farm-010_v01.png](../crowd/raw/org-farm-010_v01.png)

All ten pass anatomy/identity; minor motion strokes org-fv-003/004/007. org-fv-005 pitchfork and org-fv-006 dropped bouquet extend below soles: use feet baseline rather than lowest foreground.

#### crowd-farmers-villagers-02

[org-farm-011_v01.png](../crowd/raw/org-farm-011_v01.png), [org-farm-012_v01.png](../crowd/raw/org-farm-012_v01.png), [org-farm-013_v01.png](../crowd/raw/org-farm-013_v01.png)

All three pass. org-fv-011 raised hammer crosses nominal left cut but clear gap permits adaptive extraction. Beekeeper veil may alias after scaling.

#### crowd-fist-of-the-north-star-01

[fotns-001_v01.png](../crowd/raw/fotns-001_v01.png), [fotns-002_v02.png](../crowd/raw/fotns-002_v02.png), [fotns-003_v01.png](../crowd/raw/fotns-003_v01.png), [fotns-004_v01.png](../crowd/raw/fotns-004_v01.png), [fotns-005_v02.png](../crowd/raw/fotns-005_v02.png), [fotns-006_v01.png](../crowd/raw/fotns-006_v01.png), [fotns-007_v01.png](../crowd/raw/fotns-007_v01.png), [fotns-008_v02.png](../crowd/raw/fotns-008_v02.png)

All eight pass, including Raoh/Jagi/raider v02; no regeneration found.

#### crowd-fullmetal-alchemist-01

[fma-001_v01.png](../crowd/raw/fma-001_v01.png), [fma-002_v01.png](../crowd/raw/fma-002_v01.png), [fma-003_v01.png](../crowd/raw/fma-003_v01.png), [fma-004_v01.png](../crowd/raw/fma-004_v01.png), [fma-005_v01.png](../crowd/raw/fma-005_v01.png), [fma-006_v01.png](../crowd/raw/fma-006_v01.png), [fma-007_v01.png](../crowd/raw/fma-007_v01.png), [fma-008_v01.png](../crowd/raw/fma-008_v01.png), [fma-009_v01.png](../crowd/raw/fma-009_v01.png), [fma-010_v01.png](../crowd/raw/fma-010_v01.png)

REPAIR fma-002_v01: middle/right each have three arms. REPAIR fma-005_v01: floating sparkle crosses. Other eight pass. Preserve Riza dog component.

#### crowd-gintama-01

[gin-001_v01.png](../crowd/raw/gin-001_v01.png), [gin-002_v01.png](../crowd/raw/gin-002_v01.png), [gin-003_v01.png](../crowd/raw/gin-003_v01.png), [gin-004_v01.png](../crowd/raw/gin-004_v01.png), [gin-005_v01.png](../crowd/raw/gin-005_v01.png), [gin-006_v01.png](../crowd/raw/gin-006_v01.png), [gin-007_v01.png](../crowd/raw/gin-007_v01.png), [gin-008_v01.png](../crowd/raw/gin-008_v01.png)

All eight pass. Milk spit/food drops/mayonnaise are roster physical props; Elizabeth dropped board below feet needs baseline check.

#### crowd-hajime-no-ippo-01

[ippo-001_v01.png](../crowd/raw/ippo-001_v01.png), [ippo-002_v01.png](../crowd/raw/ippo-002_v01.png), [ippo-003_v01.png](../crowd/raw/ippo-003_v01.png), [ippo-004_v01.png](../crowd/raw/ippo-004_v01.png), [ippo-005_v01.png](../crowd/raw/ippo-005_v01.png), [ippo-006_v01.png](../crowd/raw/ippo-006_v01.png), [ippo-007_v01.png](../crowd/raw/ippo-007_v01.png), [ippo-008_v01.png](../crowd/raw/ippo-008_v01.png)

All eight pass. ippo-003 has minor cane motion ticks. ippo-002/005/006 broad poses need scale/width check.

#### crowd-hunter-x-hunter-01

[hxh-001_v01.png](../crowd/raw/hxh-001_v01.png), [hxh-002_v01.png](../crowd/raw/hxh-002_v01.png), [hxh-003_v01.png](../crowd/raw/hxh-003_v01.png), [hxh-004_v01.png](../crowd/raw/hxh-004_v01.png), [hxh-005_v01.png](../crowd/raw/hxh-005_v01.png), [hxh-006_v01.png](../crowd/raw/hxh-006_v01.png), [hxh-007_v01.png](../crowd/raw/hxh-007_v01.png), [hxh-008_v01.png](../crowd/raw/hxh-008_v01.png), [hxh-009_v01.png](../crowd/raw/hxh-009_v01.png), [hxh-010_v01.png](../crowd/raw/hxh-010_v01.png)

All ten pass. hxh-004 briefcase, hxh-005 cards/hands, hxh-009 elbows cross nominal cuts with clear gaps; use adaptive extraction. hxh-003 and008 raised prop need headroom check.

#### crowd-hunter-x-hunter-02

[hxh-011_v01.png](../crowd/raw/hxh-011_v01.png), [hxh-012_v01.png](../crowd/raw/hxh-012_v01.png), [hxh-013_v01.png](../crowd/raw/hxh-013_v01.png), [hxh-014_v01.png](../crowd/raw/hxh-014_v01.png), [hxh-015_v01.png](../crowd/raw/hxh-015_v01.png)

All five pass. Meruem follows written crest design. hxh-014 head is large (worker caveat), consistent with young short spectator; preserve unless final-size review proves unsuitable. Large scythe/umbrella need headroom/width check.

#### crowd-idol-fans-01

[org-idol-001_v01.png](../crowd/raw/org-idol-001_v01.png), [org-idol-002_v01.png](../crowd/raw/org-idol-002_v01.png), [org-idol-003_v01.png](../crowd/raw/org-idol-003_v01.png), [org-idol-004_v01.png](../crowd/raw/org-idol-004_v01.png), [org-idol-005_v01.png](../crowd/raw/org-idol-005_v01.png), [org-idol-006_v01.png](../crowd/raw/org-idol-006_v01.png), [org-idol-007_v01.png](../crowd/raw/org-idol-007_v01.png), [org-idol-008_v01.png](../crowd/raw/org-idol-008_v01.png), [org-idol-009_v01.png](../crowd/raw/org-idol-009_v01.png), [org-idol-010_v01.png](../crowd/raw/org-idol-010_v01.png)

All ten pass. org-idol-003 towel and007 bags extend across nominal cuts but remain isolated. org-idol-008 dropped fans require preserving components.

#### crowd-idol-fans-02

[org-idol-011_v01.png](../crowd/raw/org-idol-011_v01.png), [org-idol-012_v01.png](../crowd/raw/org-idol-012_v01.png), [org-idol-013_v01.png](../crowd/raw/org-idol-013_v01.png)

All three pass; org-idol-013 has minor floating spring-motion ticks. Heart shapes are attached headband ornaments, not detached symbols.

#### crowd-jojo-01

[jojo-001_v01.png](../crowd/raw/jojo-001_v01.png), [jojo-002_v01.png](../crowd/raw/jojo-002_v01.png), [jojo-003_v01.png](../crowd/raw/jojo-003_v01.png), [jojo-004_v01.png](../crowd/raw/jojo-004_v01.png), [jojo-005_v01.png](../crowd/raw/jojo-005_v01.png), [jojo-006_v01.png](../crowd/raw/_rejected/jojo-006_v01.png), [jojo-007_v01.png](../crowd/raw/jojo-007_v01.png), [jojo-008_v01.png](../crowd/raw/jojo-008_v01.png), [jojo-009_v01.png](../crowd/raw/jojo-009_v01.png), [jojo-010_v01.png](../crowd/raw/jojo-010_v01.png)

REPAIR jojo-006_v01: fingertip flames conflict with no-effects rule. Other nine pass; jojo-001/003/005/008 broad cheers cross nominal cuts but remain separated.

#### crowd-jojo-02

[jojo-011_v01.png](../crowd/raw/jojo-011_v01.png), [jojo-012_v01.png](../crowd/raw/jojo-012_v01.png), [jojo-013_v01.png](../crowd/raw/jojo-013_v01.png), [jojo-014_v01.png](../crowd/raw/jojo-014_v01.png), [jojo-015_v01.png](../crowd/raw/jojo-015_v01.png)

All five pass. JoJo angular turns are mild and silhouettes/identities stable. No missing poses or anatomy defects.

#### crowd-jujutsu-kaisen-01

[jjk-001_v01.png](../crowd/raw/jjk-001_v01.png), [jjk-002_v01.png](../crowd/raw/jjk-002_v01.png), [jjk-003_v01.png](../crowd/raw/jjk-003_v01.png), [jjk-004_v01.png](../crowd/raw/jjk-004_v01.png), [jjk-005_v01.png](../crowd/raw/jjk-005_v01.png), [jjk-006_v01.png](../crowd/raw/jjk-006_v01.png), [jjk-007_v01.png](../crowd/raw/jjk-007_v01.png), [jjk-008_v01.png](../crowd/raw/jjk-008_v01.png), [jjk-009_v01.png](../crowd/raw/jjk-009_v01.png), [jjk-010_v01.png](../crowd/raw/jjk-010_v01.png)

All ten pass. jjk-005 raised polearm requires headroom check; jjk-010 stoic reaction follows roster.

#### crowd-jujutsu-kaisen-02

[jjk-011_v01.png](../crowd/raw/jjk-011_v01.png), [jjk-012_v01.png](../crowd/raw/jjk-012_v01.png), [jjk-013_v01.png](../crowd/raw/jjk-013_v01.png), [jjk-014_v01.png](../crowd/raw/jjk-014_v01.png), [jjk-015_v01.png](../crowd/raw/jjk-015_v01.png)

All five pass. jjk-015 correctly omits smoke/flames under no-effects rule, preserving volcano head; jjk-014 worm is a physical companion prop.

#### crowd-kengan-ashura-01

[kengan-001_v01.png](../crowd/raw/kengan-001_v01.png), [kengan-002_v01.png](../crowd/raw/kengan-002_v01.png), [kengan-003_v01.png](../crowd/raw/kengan-003_v01.png), [kengan-004_v01.png](../crowd/raw/kengan-004_v01.png), [kengan-005_v01.png](../crowd/raw/kengan-005_v01.png), [kengan-006_v01.png](../crowd/raw/kengan-006_v01.png)

All six pass. kengan-006 stoic reaction follows roster. kengan-001/003/004 broad cheers and002 briefcase cross nominal cuts with clear gaps.

## Finalization boundary

The four concrete corrections must be regenerated/self-QAed, then packed if the crowd packer exists. Broad high poses, narrow silhouette gaps and dropped props must be checked in the extracted final cells. Keep existing user approvals unchanged; offer all remaining candidates together for the user’s single final approval. No source, queue, review or approval mutations were made by this audit.


## w12 correction follow-through

After completing the read-only audit, lead assigned w12 production on reopened claims. Built-in imagegen precise edits each succeeded on first attempt, saved without overwriting; original versions moved to raw/_rejected. All four replacements visually self-QA pass:

- [db-029_v03](../crowd/raw/db-029_v03.png): removed both steam clouds/jets; shocked eyes widened; three identities/poses retained. DB03-r2 done.
- [jojo-006_v02](../crowd/raw/jojo-006_v02.png): removed fingertip flames and sparks; two clear hands and robe preserved. Jojo01-r1 done.
- [org-cosp-010_v02](../crowd/raw/org-cosp-010_v02.png): removed extra shocked raised arm; exactly two hands, one on polearm. Ninja-samurai-cosplayers01-r1 done. This is outside audit A coverage, assigned afterward by queue.
- [org-trvl-011_v02](../crowd/raw/org-trvl-011_v02.png): removed second binocular pair from idle chest; one pair per pose retained. Travelers-tourists02-r1 done. This is outside audit A coverage, assigned afterward by queue.

Final prompt set: precise edits of the preceding candidates, removing only the described effects/extra limbs/duplicate prop, preserving identity, outfit, pose layout and baseline, requesting 1536x1024 hard pixels on #FF00FF. Actual raw palette/key cleanup and final packed-size QA remain required. FMA corrections belong to another worker. No shared REVIEW/manifest/tracker edits or commits by w12. Final claim returned nothing left to claim for type crowd.
