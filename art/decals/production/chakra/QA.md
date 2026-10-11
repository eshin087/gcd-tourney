# Chakra decal correction review, 2026-10-11

Current candidates: scour_spiral v01, scour_spiral_big v02, cut_wind v03, claw v02, scorch_chakra v02, fracture_chakra v02. All remain unapproved. The earlier blanket approval of other art does not approve these decals or the provisional style sheet.

## Current technical result — incomplete

- `pack-report-final-source.txt` is a fresh import of ALL six raw sources, not a cached-frame pass. Exit 0; six names, 24 variants, one 2048x1792 chakra page. Four warnings remain: scour_spiral_big 0.7%, cut_wind 2.8%, claw 1.1%, scorch_chakra 0.5% magenta/pink/purple before palette quantization. Fracture's source warning is resolved. **Do not call the requested fringe correction complete.**
- `pixel-qa.json`: every name has 24 packed colors, binary alpha and nonzero hot pixels. Quantized packed frames have zero purple pixels under the packer's predicate, but that does not retroactively pass the raw imports.
- Normal tolerance160 retained. Experiments180 and195 did not clear the warnings and were reverted, with their reports retained. No tolerance200+, warning threshold edits, palette exemption, hand-edited frames, or production output edits were used. Valid named stone palette colors can be as close as211RGB distance from magenta; chasing the remaining dark blended outlines with high tolerance risks removing stone. No interior-loss claim is made for the abandoned experiments.
- Versioned sources are immutable. v01 failures were archived with rejection rows after the user's correction request; wind v02 was saved before source QA and then archived when its 4.3% source warning prompted v03. No version was overwritten or deleted. The v02/v03 numbering records this actual sequence rather than hiding the extra saved correction round.
- Selected round attempts: giant spiral A3/B1; wind initial A2/B1, then palette correction A1/B1 (cumulative A3/B2); claw A2/B1; scorch A1/B1; fracture1. Further shape/palette correction is still needed, not waived by these bounded attempts.

## Current visual result

- Giant spiral: thin grooves, smaller bowls and longer cracks improve the shape. Exact 6/8 groove counts are still approximate; A/B pixel density and small chip faceting remain visible.
- Wind: thin slashes replace the heavy gouges. Slabs are flatter and white seams reduced; exact small-slab count and perfectly flat shading remain imperfect.
- Claw: four furrows per variant; straight/up/down/short-deep direction retained, rubble on the right. Shortened hot streaks. Some lower-lip light bias and raised-looking chips persist.
- Scorch: narrower/wider/deep-center fans point left-to-right with origin-only white seams; texture is simpler and more consistent. Part B is still drawn larger and then normalized by the normal packer.
- Fracture: clearer beige radial streaks and center hot specks. Bright outer tips acquire a few hot pixels through the packer's existing near-white snap, so hot-key placement is not a complete pass.
- Small spiral v01 retained unchanged visually, including approximate groove counts and minor facet-light bias. No new approval.

## Review delivery

The gallery at `/art-review/decals-chakra-cursed/index.html` contains the actual latest raw sources and packed variants. `candidate/atlas.json` and its page are byte-for-byte copies of the normal candidate pack. `game.html` uses a review-only helper to install that atlas and invoke `groundDemo('chakra')`; a button rotates the live decals90degrees. The ordinary game/runtime engine and production decals are unchanged. Tracked `public/preview/decals` files were removed from the index, retained locally, and remain ignored.

Production build and hosted browser result are recorded in the PR body after verification; old browser evidence below applies only to v01 and must not be presented as new verification.

---

# Historical chakra decal candidates v01

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
