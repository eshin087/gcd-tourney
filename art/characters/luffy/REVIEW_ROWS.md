# Proposed shared review rows (Claude to integrate)

| date | character | asset | file | version | status | what changed | QA notes |
|---|---|---|---|---|---|---|---|
| 2026-10-14 | luffy | title_style_draft | [candidate](characters/luffy/reference/title_style_draft_v01.png), [lineup](characters/luffy/reference/title_style_lineup_v01.svg) | v01 | approved | Enies Lobby neutral and combat reference beside the four approved title-style neutral cells. | User explicitly approved both poses. Canon stature is provenance only; scale and landmark uncertainty are recorded. |
| 2026-10-14 | luffy | model_sheet | [candidate](characters/luffy/reference/model_sheet_v01.png) | v01 | needs review | First Luffy turnaround, fighting stance and palette sheet, following approved title-style v01. | Four views and a fighting pose are present; profile/volume, head/torso/limb proportions, color fidelity and hard-pixel finish remain for user review. Not a fixed-name reference. |
| 2026-10-14 | luffy | expressions | [candidate](characters/luffy/reference/expressions_v01.png) | v01 | needs review | Eight Enies Lobby expression portraits using approved title-style v01 and model-sheet v01 for continuity. | Eight states are visible and identity is consistent; compare scar, hair and facial proportions. Not a fixed-name reference. |
| 2026-10-14 | luffy | idle | [candidate](characters/luffy/raw/idle_v01.png) | v01 | needs review | Eight-frame subtle guard/breathing idle, assembled in canonical order from one generated 4×2 grid. | 2048×256; 8 frames. Magenta background and baseline alignment look consistent. Frame-to-frame motion is very subtle; inspect at native size and in loop. No pack, scale-gate or in-game result claimed. |

These rows are intentionally proposed locally because this task does not edit shared `art/REVIEW.md`. Claude should move them into the shared queue when integrating the PR. Candidate approvals do not automatically approve later assets.
