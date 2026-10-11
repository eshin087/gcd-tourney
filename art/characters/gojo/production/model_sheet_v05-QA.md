# Gojo model sheet v05: correction required

2026-10-10. Built-in image generation, three attempts; attempt 3 saved as the single v05 candidate. User requested sandbox-only work without permission prompts. This is an ordinary staging copy, not a Git worktree. No commit, PR, merge or hosted preview exists.

- Identity: white hair, blindfold, high zipped collar, dark uniform and compact face retained. View 3 still reads partly three-quarter rather than a strict profile. Views 1/2 retain pocket hands rather than the neutral arm positions in the brief.
- Proportions: shoulders and limbs broadened visibly. The declared 2x scale failed: view 5 has approximately 574 source pixels from inferred skull crown to sole (target 430 +/-5%). At the required 0.5 scale its total height is 312 px and the lineup clips it to the cell. The head-size invariant is not certified; covered crown landmarks are uncertain.
- Technical: source 1536x1024, 87,899 RGB colors including magenta; fails <=48 palette and strict hard-pixel requirements. Raw source preserved without palette or geometry alterations. View-5 crop is a derived review aid, not another generated version.
- Required lineup: [0.5 scale](../../../scale/lineup-gojo-model_sheet_v05.png). This intentionally records the failed scale; do not treat clipped metrics as anatomical measurements.
- Diagnostic lineup: [0.375 scale](../../../scale/lineup-gojo-model_sheet_v05-diagnostic.png). This is an approximate height-normalized comparison only, NOT the required 2x gate. Visible height 234 px, shoulder-band proxy 75 px, SBR 0.349, MWR 0.470. DR in tool JSON is inherited from the old Gojo declaration (50/215), not measured on this candidate. Candidate deltoid width and limb windows remain uncertified.
- `npm run sprites gojo` completed with the existing sheet's palette warning. `node tools/pack-sprites.mjs gojo --quantize 48` completed: 42 animations, 175 frames, 48 colors, zero warnings. Existing stray-pixel/fallback notes remain; this model sheet is not consumed by the packer and the pack does not validate it.
- `npm run build` failed at Vite realpath EPERM on the allowed staging index.html. Existing `node art/characters/gojo/reference/qa/build-local.mjs` passed: 68 modules, using preserveSymlinks resolution; no sandbox or permission change.

Recommendation: request a new correction round, not approval for production. Keep approved model v03 and every approved strip. Idle v04 and all later Gojo production remain stopped.

Prompt: [exact final attempt](model_sheet_v05-prompt.txt). Review page: [model and lineups](model_sheet_v05-review.html).

Verification addendum: all five strict-packed public Gojo outputs (sheet, metadata, portrait, cut-in, select) are SHA-256 identical to main. Browser QA pending: CUA localhost navigation timed out; local HTTP probe was denied socket access. No permission change or escalation attempted. Review images inspected directly.
