# BLOCKED: Killua scale-fix candidates and measurement evidence

The required whole-character quantize48 pack exits1, so this PR is evidence only and must not merge or enter art approval.19 target assets have latest candidates;25 immutable strip versions are preserved. Eight latest candidates fail (jumpUp, heavy, airLight1, airLight2, guard, block, hurtLow, specialUp). No user art approvals are recorded.

The unchanged approved idle measures differently as unrelated candidate colors enter the global palette. Reproduction logs, hashes, candidate-by-candidate verdicts, remaining attempt counts, and the narrow Claude tooling task ART-KIL-PROBE are in art/characters/killua/production/SCALE_QA.md. Experimental head-color data was reverted. True undersizing/variation still needs correction after reliable measurement.

Validation: production build passed; local diagnostic gallery renders; existing shipped Killua sheet loads42animations without console errors. Required candidate scale gate fails. Runtime atlas remains the previous shipped output. Diagnostic warn-mode output is isolated and explicitly not a gate pass.

Preview gallery path: /reviews/killua-scale/index.html (explicit index.html required). Game preview uses old shipped art. Claude alone merges and deploys production.
