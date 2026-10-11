The user explicitly approved light1 v09 and airLight3 v08. Their approvedVersion fields, REVIEW rows and tracker entries are recorded, and older pending versions were archived intact as superseded. All seven passing Killua corrections are now approved: run07, heavy10, airHeavy06, special05, specialDown04, light109 and airLight308.

No new images were generated in this approval-only update. The two latest corrections each used1/3 authorized calls in the preceding round; all13 frames were visually checked against approved idle3 at one scale and pass their strict per-strip checks.

**Technical hold:** `node tools/pack-sprites.mjs killua --quantize 48 --strict-scale` still exits1 only for unchanged down v05 and ko v06, awaiting Claude's version-scoped manual QA. No runtime atlas was written. No gates, exemptions, scaleFit, builds or manual-QA records were edited by Codex. The manifest diff contains only the two explicitly requested approvedVersion updates.

Production build passed. Approval evidence and strict result: `art/characters/killua/production/round2-approvals/`. The preview gallery `/reviews/killua-redo/index.html` marks all seven passing corrections approved and retains both manual holds. This PR remains draft and is not ready to merge until the whole strict pack passes. Claude alone owns manual QA, integration, main and production.
