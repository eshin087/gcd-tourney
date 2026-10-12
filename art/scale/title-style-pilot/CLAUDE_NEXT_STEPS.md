# Claude handoff: title-style production blockers

Please keep sole ownership of integration, tooling, main bookkeeping and production deployment. The user approved the title-style pilot baseline and original down/KO poses, and authorized the full redraw. That does not approve the subsequently generated animation/UI candidates. Do not merge the WIP production branches yet.

Use the real local worktrees; their raw image sources are intentionally omitted by the slim GitHub publisher:

- `art/title-style-pilot` / `.worktrees/art-title-style-pilot` / PR68: approved baseline, common-scale contract and production lessons.
- `art/naruto-title-production` / `.worktrees/art-naruto-title-production` / PR69.
- `art/killua-title-production` / `.worktrees/art-killua-title-production` / PR70.
- `art/sasuke-title-production` / `.worktrees/art-sasuke-title-production` / PR71.
- `art/gojo-title-production` / `.worktrees/art-gojo-title-production` / PR72.

Read `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md` and `TOOLING_HANDOFF.md` in PR68, then each character's current QA/attempt inventory. Preserve selected versions and cumulative attempt limits, including unsaved failures. Never restore the rejected earlier cast proportions or resize posed envelopes to standing height.

Prioritize these tooling checks before requesting more redraws:

1. Reproduce Killua's same-pixel reference-palette discrepancy. Approved-combat palette measures the working idle near1.0; the automatic idle palette includes face/collar and inflates the denominator. The declared-color experiment is diagnostic only and is not a safe production configuration. Validate hair/face region handling without weakening thresholds or bulk exemptions. Rerun the full quantize48 pack afterward and independently inspect torso/limbs.
2. Preserve intact source figures when their horizontal projections overlap. Killua specialForwardv12 and Naruto light2v06/specialv07 show segmentation cutting connected hands into neighboring frames despite apparently correct counts. Compare source parts with the actual assembled atlas. Implement a safe assembly fix or supported explicit masks, then rerun packer tests and source-to-atlas QA. Do not spend more image calls merely to compensate for a proven stitch defect.
3. Fix the measured-factor path in stitch-parts: Naruto specialUpv04 and specialForward source parts abort on missing PartA detected head before an explicitly measured factor can be honored. Require documented landmarks and uncertainty when using this path.
4. Check runtime contact/hurtbox zones against the newly approved common-scale baseline. Historical posed-envelope/contact targets may disagree with physically correct new anatomy. Formal SPEC/ADR migration is yours; do not stretch sprites or enlarge bodies solely to satisfy stale geometry.
5. Check down/KO/getup grounding and seams in the game, preserving the user's preferred original poses. Oblique fallen silhouettes are intentional; a universal horizontal floor-band criterion must not resurrect the rejected side-on redesign.

Keep real drawing/motion defects separate: e.g. repeated run lead legs, disconnected anatomy already present in source, and visible torso/head changes need bounded art corrections. Tooling fixes do not approve them. Review exact latest character QA for exhausted attempt budgets.

After technical blockers are resolved: pack each fighter with `node tools/pack-sprites.mjs <id> --quantize 48`, generate current heads/lineup evidence, inspect every frame and loop at common pixel density, and return the candidate set for user approval. Only after explicit image approvals and gameplay QA should you integrate one branch at a time, deploy production and clean merged worktrees. Keep raw source history available until integration is verified.
