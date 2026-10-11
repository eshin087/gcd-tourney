# Four-character proportion pilot — awaiting user review

> Historical first checkpoint. Superseded by [lineup v03](PROPORTION_PILOT_V03.md) after user feedback about height/build and Naruto's small head. Naruto sample v01 is rejected and retained under `reference/_rejected/`; the latest Naruto is v02. No sample approval has been recorded.

2026-10-10 · ART-CAST-PILOT · branch `art/cast-proportion-pilot` · integration coordinator: Claude Code.

The user requested corrected idle, guard, run and attack samples before the full set, and released the earlier preference locks. These are four-pose reference sheets, not new animation names or completed gameplay strips. No existing approval, fixed-name reference or gameplay atlas is changed.

Recommended: Naruto, Sasuke and Killua `proportion_sample v01`; Gojo `proportion_sample v02`. Gojo v01 is retained as the first comparison round. Only the user can approve these samples. Sample approval establishes direction, not approval of existing or future animation strips.

## Review

- [Interactive gallery](../../public/art-review/cast-proportion-pilot/index.html)
- [Corrected lineup v02](../../public/art-review/cast-proportion-pilot/lineup_v02.png)
- [Initial lineup v01](../../public/art-review/cast-proportion-pilot/lineup_v01.png)
- [Production comparison](../../public/art-review/cast-proportion-pilot/current-lineup.png), baseline e8109c4
- [Measured report](../../public/art-review/cast-proportion-pilot/qa.json)

All four source sheets use a 2x2 grid: idle, guard, run, light1. The lineup uses fighter columns Naruto / Sasuke / Killua / Gojo and pose rows idle / guard / run / light1. The gallery labels both axes and provides current-art comparison, equal-magnification head crops, backgrounds and zoom.

## Shared-scale method

`node art/scale/pack-proportion-pilot.mjs` uses the production packer's unchanged image helpers. It writes only the review directory. All four poses of a fighter receive exactly the same measured resize factor. Individual poses are never fitted to a target height. Grounded poses use the normal feet alignment; airborne run keys are centered by position only, with the lowest foot eight pixels above the floor. Palette quantization is shared across all four cells per fighter.

| Fighter | Nominal starting height | Idle crown / sole in source | Shared factor | Approximate packed skull height |
|---|---:|---|---:|---:|
| Naruto | 200 px | 116 / 562 | 0.44843 | 29.15 px |
| Sasuke | 200 px | 95 / 603 | 0.39370 | 29.53 px |
| Killua | 182 px | 124 / 588 | 0.39224 | 28.63 px |
| Gojo | 215 px | 50 / 607 | 0.38600 | 26.63 px |

These are provisional artistic normalization measurements. Skull crowns are inferred beneath hair, and idle poses bend their knees. The table does **not** establish exact upright standing heights or a verified heads-tall ratio. Individual source QA notes record landmark uncertainty. Hair silhouette height is not skull height.

## Findings

Naruto has a compact head and athletic legs; his jacket and bent arms still create a stockier silhouette. Sasuke reads leaner at a similar body scale. Killua remains visibly younger and smaller without chibi limbs. After the initial lineup review, Gojo v02 broadened shoulders, chest and sleeves while retaining head, legs and height. Independent final review found no sample-direction blocker or obvious large head-size jump across the four poses.

All 16 review cells have 48 colors per fighter, no lost pixels and no clipping. Source canvases are 1254x1254 with 627px quadrants despite the requested 1024px canvas. Raw originals contain antialiasing and high color counts; the quantized review pack is not proof of full production pixel-art compliance. Naruto's open rear run hand deserves a final consistency check when the loop is produced.

## Scale probe limitations

The unmodified head probe was run against each sample's own idle before quantization, using the existing character palette declarations. Raw results are preserved in `qa.json`.

- Killua: guard 0.998, run 1.044, light1 1.012; all `ok` against sample idle.
- Gojo v02: guard 0.999, run 0.963, light1 1.000; all `ok` against sample idle.
- Naruto: existing declared gold does not find a head in the new idle. No valid automatic result, no exemption entered.
- Sasuke: run 0.993 and light1 0.951 are `ok`; guard reads 1.333. Its measured box reaches y93 into the crossed dark sleeves rather than isolating the head. This is a documented suspected probe misread, not a passing gate or filed exemption.

This is a reference-sample checkpoint. The canonical production strip scale gate has **not** passed for these sample sheets, which are not animation strips and are not placed in `raw/`. After direction approval, production idle and every animation must pass the normal packer gate and attach their heads/lineup evidence before being queued as finished strips. Full animation production remains stopped until the user reviews these samples.

## Validation

Review packing completed with 16 cells, 48 colors per fighter and zero clipped pixels. Browser controls, build and preview checks are recorded in the PR. Only Claude integrates; the worktree is `.worktrees/art-cast-proportion-pilot` for coordinator cleanup after merging.
