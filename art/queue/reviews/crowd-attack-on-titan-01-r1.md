# crowd-attack-on-titan-01-r1

Previously approved batch; newer corrections have separate review.

Full raw visual audit and targeted corrections complete. Crowd/NPC cleanup, cell/scale and in-game QA await TOOL-011/ENG-024.

[Audit A](../final-qa-crowd-a.md) / [Audit B](../final-qa-crowd-b.md) / [Other audit](../final-qa-other.md) / [Cleanup verification](../final-qa-cleanup.md).

Worker/redo notes: Lead QA: in cheer pose, arms cross the 512-px pose-column boundary (aot-008 45, aot-009 29 foreground pixels at cut line); redraw narrower and centered, preserve identity and three poses aot-008 and aot-009 v02: cheer arms now clear both 512px cuts; visual QA three poses and consistent identities. Raw background is near-magenta (about RGB 239,14,240), so packer color-key QA remains needed.

| Item | Current candidate | Decision |
|---|---|---|
| aot-008 | [v02](../../../art/crowd/raw/aot-008_v02.png) | previously approved |
| aot-009 | [v02](../../../art/crowd/raw/aot-009_v02.png) | previously approved |

## Rejected history

- [aot-008_v01.png](../../../art/crowd/raw/_rejected/aot-008_v01.png) — rejected and preserved.
- [aot-009_v01.png](../../../art/crowd/raw/_rejected/aot-009_v01.png) — rejected and preserved.
