# Cursed decal v01 review

2026-10-10. Branch `art/decals-cursed`, local port 5218. All six names are **needs review**, with no approvedVersion. Claude alone integrates; this PR is a candidate art delivery, not production art approval.

Built-in imagegen used `art/decals/PROMPTS.md` section 0 and each cursed name's prompt, with the unchanged provisional `decal_style_sheet_v01.png` as style input. The user explicitly waived decal-by-decal approval waits for this batch. No fixed approved style copy was created. Raw sources are immutable v01 files. Ten selected images yield twenty variants.

Prompt additions emphasized orthographic top-down, radial shading, no side lighting, palette-only hard boundaries, hot seams only, and open matching trench ends. Implosion A used the second attempt, B the second attempt. Third attempts of each were worse (lost crack shape / center rubble), so were not filed. A gouge A retry also lost the directional fan and was discarded. Other sheets use their first attempt. None exceeded three attempts.

## Validation

- `node tools/pack-sprites.mjs decals --candidates`: exit 0, six names, twenty variants, one 2048 x 1280 cursed page. Counts: erasure 3, trench 3, implode 4, repel 4, fracture 4, large fracture 2. Each packed name has at most 24 colors.
- Hot pixels: erasure 7030, trench 12096, repel 899, fracture 581, large fracture 358. Implode has no hot key; seven near-white pixels were toned down by the normal packer.
- The three palette warnings remain: implode 1.1%, repel 1.5%, fracture 1.0% magenta/pink/purple. A tolerance 90 test barely reduced them; restored the default 72. No broad tolerance or hand-edited output conceals the defects.
- Production build passed using the repository `.codex/vite.mjs` adapter (79 modules). No tool/engine source changed, so no new tool regression suite was needed.
- Chrome via CUA on port 5218: actual `groundDemo('cursed')` reported `6 names, 20 decals (6 custom)` and twenty visible parts. A second UI button rotated all twenty parts by 90 degrees. Both views inspected; hot rims read yellow in the demo tint. Console error/warning query returned an empty list. The game QA page retains these controls for repeatable human inspection.
- Evidence: `public/art-review/decals-cursed/game-qa.png` and `game-rotated-qa.png`; gallery `public/art-review/decals-cursed/index.html`. Standard demo fixes heat rather than exercising cooling over time, so cooling is not newly verified.

## Recommendations and deviations

| Name | Recommendation | Remaining caveats |
|---|---|---|
| erasure v01 | Reviewable with caveats | Three hollows intact and no palette warning; generator canvas 2172 x 724 instead of 1536 x 1024, varying rim thickness and slight asymmetric bands. |
| erasure_trench v01 | Reviewable with caveats | Open ends and all hot seams preserved; no packer tiling warning. Source ratios are wider than 2:1, producing thin lanes. Visual seamlessness across long chains still needs user assessment. |
| crush_implode v01 | Redraw recommended | Pink fringe warning; some raised-stone shading remains despite retries; outer detail exceeds thin tips in places. |
| gouge_repel v01 | Redraw recommended | Pink fringe warning; variable fan proportions; white extends farther than origin on B; some directional stone highlights remain. |
| fracture_cursed v01 | Redraw recommended | Pink fringe warning; not all cracks are perfectly straight/angular; B center reads like a pit rather than uniformly flattened stone. |
| fracture_cursed_big v01 | Refinement recommended | No palette warning, but second variant has fewer complete circular rings than required and both discs have overly solid outer boundaries. |

No warning is an exemption or user approval. Raw AA/texture/palette imperfections are not claimed to satisfy strict pixel-art source requirements. Kept variants are offered as candidates with the above recommendations, not as a clean production set.
