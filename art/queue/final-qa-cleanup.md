# Independent cleanup QA addendum

2026-10-09, worker w11. Supplements `final-qa-other.md`; no user approvals applied. Read `palette-cleanup.md`, visually inspected all 30 stage palette candidates and the repacked VFX atlas, and measured current PNG pixels directly.

## Stage: cleanup passes with inherited style caveats

Every `art/stage/review/<slot>_palette_v01.png` below was opened individually:

- Surfaces: brick, grass, path, plaster, ringSide, roof, steps, stoneBase, wood, woodDark, woodPillar, ringTop.
- Set: templeFacade, bannerBu, bannerDo, bannerSai, bannerTo, gong, parasol, sign, lanternBu, lanternSai.
- Environment: sky, cloudA, cloudB, cloudC, treeRoundA, treeRoundB, treePine, treePalm.

All 30 match the dimensions and palette counts documented in `palette-cleanup.md`; none exceeds its budget. All opaque assets remain opaque; cutouts have only alpha 0/255. Compared every candidate with its corresponding `raw/_fit/<slot>_v01.png`: zero dimension changes, zero alpha changes, and zero newly unequal opposite-edge pixel pairs where the original edges matched. Palette mapping therefore preserves existing silhouettes and matching seam pixels. This is a preservation check, not proof that the original surfaces tile perfectly in the engine.

Visual results: temple door/window structure and sign/banner/lantern lettering remain readable; tree silhouettes retain separation; stone cracks and wood grain remain intact. The sky now has deliberate stepped bands. No new severe blotches, lost props, or cutout holes appeared. Fine isolated texture pixels remain in trees/wood/grass and the temple facade; quantization satisfies palette limits but does not convert those textures into fully hand-clustered pixel art. Cloud blue edge outlines remain the earlier brief deviation. These are inherited style caveats, not new cleanup damage.

## VFX: palette passes; geometry substantially improved

Viewed `public/vfx/atlas.png`, covering all 15 effects. Current frame counts are spark 5, burst 5, ring 6, dust 6, smoke 7, shuriken 4, fire 4, flame 7, lightning 6, orb 6, glow 2, streak 6, star 5, crater 3, lines 4. The atlas preserves recognizable shape progression and frame separation after cleanup. Dust/smoke/crater now read as stepped clusters, and fire/orb retain their bright cores.

Pixel scan confirms exactly the documented canonical RGB sets for all effects. Zero visible magenta pixels remain. Every effect except glow uses binary alpha. Glow retains white RGB with alpha 0/110/200/255; the atlas preview on black does not clearly show these steps, but the measured alpha values do.

### Ring v02

| Frame | Opaque bounds, inclusive | Size |
|---|---|---|
| 00 | (48,56) to (78,75) | 31×20 |
| 01 | (40,50) to (88,80) | 49×31 |
| 02 | (32,44) to (95,86) | 64×43 |
| 03 | (23,40) to (104,90) | 82×51 |
| 04 | (14,34) to (113,94) | 100×61 |
| 05 | (4,28) to (123,99) | 120×72 |

The ring now expands from a small ellipse to a large broken ellipse, stays centered near (64,64), and clears all cell edges. This resolves the prior oversized first frame and excessively flat final frame. Remaining measurable deviation: final height is 72 rather than the 66 px target; height/width is 0.60 rather than 0.55. Recommend retaining the new animation for final review with this explicit 6 px height caveat, or apply a documented vertical fit if exact geometry is required.

### Streak v02

All six widths are 6 px. Heights are 15, 71, 102, 102, 58, 19 px. Bottom rows are 120, 115, 109, 109, 106, 83, so the last frame no longer drops downward. Peak top is y=8. Growth/hold/dissolve reads correctly and stays inside the cell. Minor target difference: 6 px rather than approximately 8 px wide and 102 rather than approximately 100 px peak height. No further redraw required for the earlier motion defect.

## Remaining delivery boundaries

- Stage candidates remain under `review/`, awaiting the single final approval and approved-path integration.
- Stage/NPC/UI engine integration and runtime scale/seam checks remain dependent on the lead/Claude handoff; this report verifies image assets, not game loading.
- The separate NPC redo work produced monk-a model/idle/signal v02 and vendor model/idle v02. The vendor idle was the best of three attempts but frame 0 still turns its face toward image-left while frame 1 faces right. Its queue completion note preserves this exception; do not mark strict NPC facing QA passed.
