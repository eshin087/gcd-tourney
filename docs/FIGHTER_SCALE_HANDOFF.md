# Claude handoff: fighter scale corrections

ART-SCALE-01 is an isolated art/tooling PR based on local 41fc6ad. The shared gameplay checkout was left intact while Claude used the earlier Sasuke art.

1. Read [final QA](../art/scale/FINAL_QA.md), [scale rules](../art/CHARACTER_SCALE.md), and [source inventory](../art/scale/final-inventory.json).
2. Consume the four committed `public/characters/<id>/sheet.png` and `anims.json` pairs together. Keep 256px cells, [128,240] pivot and 128 pixels/unit; do not normalize individual animation bounds at runtime.
3. Keep Gojo model v03 / idle v02 head proportions. Do not reapply the rejected universal-head enlargement.
4. Sasuke now includes all 42 animations and ADR 0011 poses. Use existing canonical animation names. UI candidates need the user's final visual approval before promoting fixed UI files.
5. Review the two documented KO safety-margin exceptions. The pack has no clipped pixels. The user's final batch approval is pending; do not infer art approval from technical test success.
6. Existing gameplay/controls/CPU/throw PRs are separate. This PR changes no gameplay stats or actor scale. Preserve concurrent changes when reconciling shared tracking docs.
7. The review page is `/art-review/scale/index.html` once this branch is served or deployed. No deployment was performed for this PR.

Packer changes have 206 passing regression checks; the full build and local browser smoke passed. Details and limitations are recorded in the QA file, so Codex chat access is not required.

## PR integration order

Claude opened #7 (Sasuke and scale tooling) and #8 (earlier Naruto/Killua candidates). This final correction PR is stacked after #8; review this final correction first, then integrate #8 and this correction together; do not deploy unfinished #8 alone. No original Gojo enlargement should be reintroduced.
