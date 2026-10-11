# Claude tooling handoff: clipped stitch refinement

Confirmed for light1_v04 parts, not a hypothesis. No tool patch or final-gate exemption applied.

Reproduce from this real worktree:

```powershell
node 'C:/Users/eshin/Desktop/Claude Code/gcdTourney/tools/stitch-parts.mjs' killua light1 v06 --parts v04 --dry-run --root 'C:/Users/eshin/Desktop/Claude Code/gcdTourney/.worktrees/art-scale-fix-killua/art' --public 'C:/Users/eshin/Desktop/Claude Code/gcdTourney/.worktrees/art-scale-fix-killua/public'
node art/characters/killua/production/diagnose-stitch-roi.mjs light1 v04
```

The diagnostic imports main's real packer/probe/audit functions, reproduces stitch trial/refinement scales, and writes `light1-v04-stitch-roi.json` and `.png`. JSON records input SHA256s, packed sheet SHA256, idle cache provenance and every frame's source/scaled dimensions, clipping and detected box. Board rows are A trial/refined/final then B trial/refined/final; red rectangles are actual detected ROIs.

Selected public idle provenance is the existing `raw/idle_v01.png`, cache version1/bodyHeight186 (sourceHash5b6befd89f14f14dc89c90368a2895019004a83c); the new whole-character pack failed and intentionally kept that atlas. The approved-neutral/candidate-idle redraw has a smaller head relative to skeleton.

At the first trial all seven new jab frames are unclipped: A head ratios.710-.729, B.735-.760 against the old packed reference. The refinement enlarges A to258-259px tall and clips17-18px at top; the next derived scale produces350-351px tall, clips109-110px and puts the actual head entirely above canvas. The detected final A box [88,55,149,66] (f0) surrounds the white shirt hem, not a head. B refinement clips8-9px, and final clips21-22px, leaving truncated hair ROIs. Thus the proposed B factor.7429 is based on different clipped regions, not true anatomy.

Independent source ruler board `light1-v04-landmark-board.png` shows A/B torso lengths172/175px and shins100px each, with skull estimate80±10px. All seven source poses retain similar head/hair and build; corrected `raw/light1_v05.png` uses manual factor1 with a written measured reason and skull sidecar. The old bad automatic `light1_v04.png` is retained as evidence. Do not infer a final scale pass from this diagnosis.

Expected tool behavior for Claude to decide: avoid fitting a part to a reference if the refinement clips the head; report unmeasurable or allow the candidate calibrated idle as reference. Worker has not edited tools or public outputs by hand.
