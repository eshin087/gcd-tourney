# Killua title-style production trial — 2026-10-11

## Approved source and scope

The user approved `reference/title_style_draft_v01.png` and the shared-size pilot cells `neutral_v01.png` and `combat_v01.png`. The neutral occupies 82 x 186 px, with a 176 px body target. The combat stance occupies 148 x 145 px, including hair, at the same anatomical scale. These are the ground truth for this batch. The older 182/186 px standing targets and the rejected torso-redraw direction are not used as visual targets. Keep the original down/KO poses when later redrawing their appearance.

The title-style model is an approved visual reference; the new animations and UI below are candidates, not user-approved. Fixed-name model, idle and UI references were not replaced.

## Generation ledger

| Asset | Saved | Built-in attempts | Result |
|---|---|---:|---|
| idle Part A | `raw/_parts/idle_v04_A.png` | 3/3 | Best four-frame spacing, but f0 is shorter than the rest. |
| idle Part B | `raw/_parts/idle_v04_B.png` | 1/3 | Stitched v04; visible height pop, rejected as a working anchor. |
| idle Part B correction | `raw/_parts/idle_v05_B.png` | 2/3 | Improved source heights; Part A reused unchanged as `idle_v05_A.png`. Measured stitch factor 1.0144; post-stitch B/A head ratio 1.02. |
| guard | `raw/guard_v07.png` | 3/3 | First attempt differed by 50 raw px between poses; third attempt has identical 658 x 717 raw bounds for both. |
| portrait, cut-in, select | `raw/ui_portrait_v02.png`, `raw/ui_cutin_v03.png`, `raw/ui_select_v02.png` | 1/3 each | Candidate UI from approved title-style sheet. |

Historical Git filenames were checked before numbering: idle had v01–v03, guard v01–v06, portrait v01, cut-in v01–v02, select v01. No number was reused.

## Native-size comparison

The current mixed atlas was packed with `node tools/pack-sprites.mjs killua --quantize 48`. The packer reads idle v05 and guard v07. It reports 42 animations and 48 colors, but the other 40 animations are older art, so its 44 scale/baseline warnings are expected and this is not a clean cast-scale pass. The actual atlas cells were extracted from `public/characters/killua/sheet.png`; `frames/idle/` is stale under `--quantize` and was not used for this QA.

| Cell | Opaque bounds | Occupied size | Finding |
|---|---|---|---|
| Approved combat | x54–201, y96–240 | 148 x 145 | Approved pose-scale reference. |
| New idle f0 | x59–195, y101–240 | 137 x 140 | Same costume and broad pose; narrower than approved combat and 5 px shorter. |
| New idle f1–f7 | 132–136 wide, 144–146 high | — | Head/torso appearance is close, but 6 px height spread from f0 to peak is larger than the requested subtle breathing. Feet remain on y240. |
| New guard f0 | x62–189, y101–240 | 128 x 140 | Crossed-arm pose; a narrower silhouette is expected from the pose. |
| New guard f1 | x62–189, y102–240 | 128 x 139 | Same width and foot placement; no obvious size pop. Nearly static. |

Comparison image: `idle-v05-vs-approved-combat.png` (approved combat left; new idle f0 right). Guard contact image: `packed-guard-v07.png`. The apparent hair/head size is similar, but the idle f0 width and six-pixel loop height variation require closer anatomy and playback review before this idle can become the animation reference. A head-gate result alone would not establish torso and limb consistency. No numeric anatomy pass or exemption is claimed.

The trial `manifest.json` sets Killua `standingBodyPx` to 176, idle `bodyHeight` to 146 and guard `bodyHeight` to 140 to keep crouches below neutral height. These are provisional trial values. The old approved idle/UI files remain intact, and no later animation strip was generated from the provisional idle.

`npm run scale -- killua` produced `heads-trial.png` and reported 25 flagged strips in the mixed old/new atlas. `npm run lineup` produced `lineup-trial.png`; its build-band warning still assumes the older 182 px child baseline and cannot certify this user-approved title-style scale. The full strict scale gate and equal-depth game QA remain pending. Shared `art/scale` baseline/report outputs from this exploratory run are not production evidence.

`node tools/pack-sprites.mjs killua --quantize 48 --strict-scale` exited 1 and wrote no atlas: the existing older strips differ from the new provisional idle, with 33 failing animation names in the strict report. This is a genuine blocked gate, not an exemption request.

## Next technical gate

Correct idle f0 and confirm all eight frames at native size and in a loop against the approved neutral/combat cells. Recheck head, torso, limbs, foot position, facing and contact proportions. Then run strict pack, heads sheet, lineup and equal-depth game QA as the rest of the set is produced. The 3 UI candidates can receive final review independently.

## Additional user-authorized correction round
The user allowed three more targeted attempts. Root generated A and B (one call each) and a single f0 fix (third call). Stitched v06 uses measured B factor0.9899. Diagnostic-only pack: actual heights145,146,145,145,143,144,143,144; widths118–120 vs approved148. This reduced loop pop but introduced a visibly narrower stance and fails independent baseline comparison. Strict candidate pack refuses guard head0.92 against this new idle. No exemption or passing anchor is claimed. Single f0 fix01 returns closer approved pose geometry but cannot fix all seven remaining frames by itself; not assembled/approved. All three extra image calls are used. Continue holding full Killua production pending a passing baseline animation.

## Independent poses from the approved reference
Full Killua production resumed for independent poses using approved title_style_approved.png, an exact copy of the user-approved pilot. Held idle v06 is not an image input. First built-in attempt each: dash v05, jumpUp v05, jumpFall v05, hurtHigh v06, land v04, intro v04, taunt v04, win v04. All are candidates; none is approved or a final atlas pass.

An isolated art-only QA fixture uses the exact approved combat cell as a ONE-frame reference-only idle, not a generated or proposed animation. It does not alter production idle. Strict 48-color pack gives dash/jumpUp/jumpFall/hurtHigh/land/intro ok; taunt uniform1.07head/1.11feet and win head drift1.09. Approved neutral itself measures1.008 head/0.997 feet against this combat, confirming this is a useful reference control. The taunt auto-fit trial reduced standing height to172–173 vs approved186, so it is NOT promoted: numeric head pass alone does not establish anatomy. Win may include adjacent white cuffs but needs manual hair ROI verification; no exemption claimed.

Native source-to-atlas factors: dash0.217, jumpUp0.220, jumpFall0.218, hurtHigh0.235, land0.208, intro0.246. Trial bodyHeights122/148/165/150/132/186 respectively; these are pose-specific candidates, not standing-height inflation. Dash source equal-slot head movement is about9px but automatic foot centering produces46px; offsets[-18,0],[18,0] remove36px of the artificial shift without resizing anatomy. Loop verification pending. Diagnostic comparisons: movement-reference-comparison.png and standing-reference-comparison.png. Second image includes failed win and non-promoted auto-fit taunt: not a passing atlas.

Validation: real `node tools/pack-sprites.mjs killua --quantize 48` exits1 against held idle v06; dash,jumpUp,jumpFall,land,guard,hurtHigh,intro,taunt,win fail relative to that wrong anchor. It writes no character atlas. This is not overridden. Local Vite production build passes80modules. Diagnostic reference heads live in reference-scale/heads-killua.png; they include the non-promoted taunt autofit and failed win, explicitly not full-production evidence. Full heads/lineup/game loops remain pending.
