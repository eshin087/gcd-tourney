# Naruto post-approval redraws

2026-10-11. User invoked the current inbox section Redraws after the user's yes to all. Up to3 additional image generations per strip: light4,airLight3,throw,heavy. This is not approval of new pixels. Claude commit40ad27d already present and preserved: approvedVersion,scaleFit,manualQA,exemptions and builds are not edited. New image versions require user review.

Initial strict pack: light4 pop0.89–1.16; airLight3 pop0.90–1.04; throw drift1.07. Heavy gate passes but f4 top24px/f5 top5px clipped. Current idle v05. Refreshed head_scale_guide from current idle (old guide was stale). Tool guide crown-to-chin32px includes hair and is not anatomical skull25.214px.

Scratch reference atlas uses separate warning-only manifest per stitch tool instructions, --no-writeback, under production/redraw-scratch; never a strict acceptance result. Final acceptance uses real manifest with --strict-scale.

Generation ledger to follow.

## Final evidence and attempt ledger

Strict command: node tools/pack-sprites.mjs naruto --quantize 48 --strict-scale. Exit **1**, 42 animations / 175 frames evaluated: 1 reference, 28 ok, 10 pre-existing manual QA, 1 pop, 2 pre-existing exemptions. Only light4 v04 fails. Runtime atlas and frames were NOT written. Existing manual QA is not an automatic measurement pass. Existing win exemption-version warning remains; no exemptions changed.

| Asset | New versions | Additional generations | Outcome |
| --- | --- | --- | --- |
| heavy | v09 intermediate, v10 final | 3/3: A repose, B repose, B hair correction | v10 ok: head .984, range .050; no clipping/margin warning. v09 retained as immutable intermediate, not recommended. |
| throw | v05 | 1/3 | ok: head .995, range .032; f1 x offset -1px gives margin; no body rescale. |
| airLight3 | v05 | 3/3: B hair expansion overshot, two targeted corrections | ok: head 1.003, range .084. A reused unchanged from v04. |
| light4 | v04 | 3/3: A expansion overshot, A correction, B correction | HOLD: head 1.092, range .160; f3 .983 vs f0 1.143. No more authorized attempts remain. |

Skull calibrations preserve the existing anatomy: heavy A64/B76 source px; light4 A60/B64; airLight3 A80/B100; throw60. Measurement uncertainty remains approximately5–9 source px. Stitch factors were measured with current idle-only scratch, not chosen to pass: heavy v09 .7346, heavy v10 .8370, light4 .8624, airLight3 .7457. Approved anatomy target remains25.21402951469189px. Hair-only corrections do not redefine skull measurements. No changes to builds, thresholds, exemptions, manualQA or scaleFit.

The initial full scratch palette did not match the declared gold; it could not find the idle head. The final stitch reference is an idle-only scratch pack using the unchanged manifest, builds and idle v05 source/sidecar, quantized48. This isolates palette competition, not a gate bypass. Final strict gate above uses the unmodified full production manifest except the four candidate version fields.

[Heads](redraw-qa/heads-naruto.png), [all-frame numerical report](redraw-qa/scale-report.json), [heavy f4 lineup](redraw-qa/lineup.png), [strict log](redraw-final-strict.log). Heads and review cells use separate warning-only diagnostic output because strict correctly blocked writing. The lineup adds new heavy f4 at native density to the worktree's older packed cast; it is context, not certification of the latest whole cast. No diagnostic atlas is copied into public/characters.

Visual review covered all26 new final frames. Identity and orange/black costume retained. Heavy raised frames tuck knees/elbow and retain body size; throw release/recovery intact; airLight3 rotation and recovery remain pose-dependent. Light4 f0 hair is visibly larger than middle poses and remains held. New versions need user approval independently of the earlier blanket approval. Recommendation: review heavy v10, throw v05 and airLight3 v05; hold light4 v04. User or coordinator must authorize the next correction path; no fabricated pass.
