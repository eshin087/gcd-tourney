# Chakra decal candidates v01

Six names, 11 immutable built-in imagegen sources, 24 variants. User batch instruction permits continuing from provisional style v01; the style sheet is not approved and no fixed-name reference was promoted. Cursed assets belong to the separate art/decals-cursed branch. Claude alone integrates, edits main, and deploys production.

## Validation

- Candidate pack exits 0, one 2048x1792 chakra page, 24 colors per name, all required variant counts and cell sizes present. Five source-import warnings remain (see pack-report.txt): scour_spiral_big 0.4%, cut_wind 2.6%, claw 1.1%, scorch_chakra 0.5%, fracture_chakra 0.2% pink/purple. Raw status retained for every name; no approval recorded.
- Sidecars set the existing magenta-key tolerance to 160. This removes fringe contamination without raw-image editing; it does not eliminate all bad pixels. A cached-frame repack can report zero warnings because quantization changes the detection ratio; that is NOT evidence that the source-import failures were fixed.
- Local browser groundDemo('chakra'): 6 names, 24 decals, 6 custom, no page errors. Screenshot in public/art-review/decals-chakra-cursed/game-qa.png shows all groups rendered with orange hot seams. Initial session logged two transient resource404 entries; repeat QA recorded no failed HTTP responses and no page errors. Gameplay, gallery and candidate atlas loaded.
- Production build passed through the project-local Vite adapter. No engine/tool changes or character scale exemptions.

## Review recommendation

Hold approval pending palette corrections for five warned names. scour_spiral is suitable for shape review with minor facet-light bias and approximate groove counts. scour_spiral_big has too few spiral revolutions and A/B density differences. cut_wind cuts are heavier than hairlines, white seams extensive, and debris too raised. claw has the four required furrows and directional variants but raised facets and residual pink; raw A is 1774x887 instead of 1536x1024 (packer normalizes final cells). scorch_chakra B has noisy surface texture and differing pixel density. fracture_chakra has correct center-only hot specks but pink outer streaks. No candidate should be described as fully spec-compliant.

Source prompts: art/decals/PROMPTS.md preamble and each owned name block, with explicit part selection and radial-only/no-purple corrections. Attempts kept: scour_spiral A 3/3, B 1/3; scour_spiral_big A 2/3, B 3/3; cut_wind A/B 1/3; claw A 1/3, B 2/3; scorch_chakra A/B 1/3; fracture_chakra 1/3. Only the best source per part was filed; no numbered source was overwritten.

## Integration

Branch art/decals-chakra-cursed, worktree .worktrees/art-decals-chakra-cursed, local port5217. Gallery /art-review/decals-chakra-cursed/index.html. The preview atlas is partial and overlaps atlas.json in the other two decal PRs: Claude must repack the combined candidates after integration, never select one partial atlas as the complete result. Ordinary production decal packs continue to use approvedVersion only.
