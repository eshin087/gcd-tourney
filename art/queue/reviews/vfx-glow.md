# vfx-glow

Final approval pending.

76 frames across15 effects, canonical palettes and zero magenta verified; ring/streak deviations documented. Browser verification tracked in final packet.

[Packed atlas](../../../public/vfx/atlas.png); edited canonical-palette frames under art/vfx/frames/.

[Audit A](../final-qa-crowd-a.md) / [Audit B](../final-qa-crowd-b.md) / [Other audit](../final-qa-other.md) / [Cleanup verification](../final-qa-cleanup.md).

Worker/redo notes: 3 imagegen attempts; selected first for centered, separated 2-frame pulse and three hard concentric zones at intended relative sizes. Direct raw 1536x1024 PNG saved. Generator ignored exact 4-color requirement: ~17672 colors with smooth grey variation inside rings, near-magenta background RGB 244,17,243 rather than #FF00FF. Packer luma-to-alpha snapping and magenta removal need inspection; no postprocessing applied.

| Item | Current candidate | Decision |
|---|---|---|
| glow | [v01](../../../art/vfx/raw/glow_v01.png) | final review pending |

## Rejected history

None.
