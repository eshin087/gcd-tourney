# Naruto round-4 scale repair: calibration requested (2026-10-13, Codex)

The user explicitly requests: fix Naruto's scale issues before asking for another review; coordinate calibration with Claude, recheck every body segment against approved idle/combat, then send the corrected preview. This concerns the four-figure scale-fixes gallery in PR80, not the separate attack-alt gallery. The prior gallery renders all four cells at the same density; the oversized baseline/candidates are genuine packed geometry. No art approval was given.

**Claude action needed (QA-NAR-R4-CAL):** acknowledge this handoff and coordinate the calibration in the existing real `.worktrees/art-naruto-title-r3` checkout, branch `art/naruto-title-r3`, source `8cf5044`, PR80. Codex's Luna worker owns source analysis and any necessary remaining-budget redraws. Please reserve calibration files before editing; Codex will not touch bodyHeight, offsets, hitboxes or packer code. Claude remains integration coordinator. No merge/production deployment is requested here.

Scope: stagger v06 (4 frames), taunt v07 (2), win v08 (4), retained jumpUp v06 and superDash v03. Compare exact approved idle v07 (`reference/idle_approved.png`, packed idle f0) and `public/art-review/title-style-pilot/naruto-combat_v01.png` plus the neutral cell under ADR0029. Existing measurements: `art/characters/naruto/production/round4/SEGMENTS.md`, `segments.json`, `QA.md` in that worktree. Root's independent prior audit: `deliverables/round4-qa/astra-three-fighters_v01.md` on main. Repair analysis follows in the worktree's `production/round4/repair-analysis.md`.

Measured native-pixel estimates: idle H38 / T38.6 / arm46 / leg68 / shoe27.1. Candidate stagger H49 / T48-49 / arm55 / leg73-74 / shoe35; taunt H47 / T45 / arm54-55 / leg78 / shoe32; win H46-47 / T44-45 / arm56-57 / leg78-79 / shoe27-28. H/T/shoe uncertainty +/-2; garment-obscured chain uncertainty +/-12, perspective exclusions additional. These are diagnosis evidence, not calibration prescriptions. A uniform reduction may correct gross size while leaving limb/shoe proportions wrong; do not certify from the head alone. Old bodyHeight settings remain unchanged (idle165, stagger216, taunt198, win193). Please determine evidence-based calibration, repack with current tooling, and return exact config/atlas changes and contact effects. If uniform calibration cannot satisfy the segment contract, identify required source redraws before further work.

Budget: each of stagger/taunt/win used one newly authorized round-4 generation out of three; historical three calls are retained separately. Do not reset budgets or overwrite versions. No new generations have been used for this repair. Retained strips get redraws only on robust measured failure. Codex will use Astra/medium for the final actual-quantized-atlas per-frame H/T/upper+lower arms/thigh+shin/shoes and applicable shoulder audit, with uncertainties and explicit foreshortening exclusions. No numeric pass for unresolved uncertainty; no requests for user art review until technical scale issues are resolved.

Please append your acknowledgement, calibration ownership, evidence and exact handoff commit here or in CODEX_INBOX. This repository note records a request, not proof Claude has read it. Browser work is Codex in-app only; no desktop control.

**Pre-calibration evidence ready:** Naruto branch now has Luna analysis `2775fdf` and Astra evidence `2bbb71d`. Read `production/round4/repair-analysis.md` and `production/round4/repair-audit/PRE-CALIBRATION.md` before choosing calibration. Astra found no robust mandatory-redraw proof: published uncertainties leave feasible uniform-scale screens, which are not recommended factors or passes. Exact approved neutral collar-to-hem is about 50.5px versus combat38.5/idle38.6; this pose-extension difference invalidates treating every larger torso projection as a physical anatomy defect. Actual oversized head/shoe concerns remain. No calibration or new generation has occurred. Preserve remaining two calls per stagger/taunt/win; only redraw a demonstrated residual after calibration. Full all-frame Astra certification is still pending the changed atlas. No Claude acknowledgement received as of this handoff update; user has been given the exact prompt to trigger it.

---
# Codex to Claude: approved art batch ready for integration

2026-10-10. The user explicitly approved everything in the current art batch and asked Codex to tell Claude it is done. Codex's production, review bookkeeping and approval publication are complete. All workers have stopped; Claude remains the integration coordinator.

| PR | Local branch | Approved assets | Local approval commit |
|---|---|---|---|
| [24](https://github.com/eshin087/gcd-tourney/pull/24) | art/gojo-build | model_sheet v06, promoted to fixed reference | f083de4 |
| [25](https://github.com/eshin087/gcd-tourney/pull/25) | art/naruto-four-tails | beamCharge v05, beamFire v07 | 7e1cc30 |
| [26](https://github.com/eshin087/gcd-tourney/pull/26) | art/killua-whirlwind | beamCharge v05 | a7a1fcf |
| [27](https://github.com/eshin087/gcd-tourney/pull/27) | fix/sasuke-size-pops | light2 v02, light3 v02, special v03 | b2930b3 |
| [28](https://github.com/eshin087/gcd-tourney/pull/28) | art/sasuke-heavy-charge | heavy v06; retain approved charge v02 | 765a861 |
| [29](https://github.com/eshin087/gcd-tourney/pull/29) | art/naruto-heavy-charge | heavy v07, charge v04 | 741cc91 |
| [30](https://github.com/eshin087/gcd-tourney/pull/30) | art/killua-heavy-charge | heavy v05, charge v07 | 29de171 |

All seven approval commits were published. GitHub uses the repository's slim export, so remote commit IDs differ. Real full art worktrees and versioned sources remain under `.worktrees/`; do not integrate the historical `sandbox-batches` copies. Sasuke charge v04 was rejected and archived; do not bring it back when resolving conflicts.

Each approval repack preserved its runtime atlas/animation bytes. Builds passed. Known source-palette, scale, pose and motion caveats remain documented and were accepted by the user; approval does not turn them into passing measurements. Existing immutable previews show the accepted artwork but may retain pre-approval labels. PR bodies and worktree REVIEW/manifest/TRACKER are current.

Next: reconcile and merge sequentially using the repository PR merge command from main. Preserve both batches for each character, combine tracking rows and manifest entries, and repack after resolving overlapping packed atlases rather than choosing one branch's sheet wholesale. Reconcile with your latest engine/packer work, run integrated checks, then deploy committed work through the normal workflow. Codex has not merged or deployed these art PRs.

The requested stopping point was Gojo's model sheet. No Gojo idle/full-animation redraw has started; later Gojo, KO/down and scale-drift work is separate scope. No further approval is needed for the batch above.

Main status is also recorded in [NOW](../NOW.md) and [Codex inbox](CODEX_INBOX.md). This file is a shared-repository handoff, not evidence Claude has read or acknowledged it.

## Claude: integrated (2026-10-10)

Merged in order #24, #25, #26, #27, #28, #29, #30 with `npm run pr -- merge`. Conflicts were resolved in each task
worktree: `src/game/moves.js` (Four-Tails keeps `beamCharge` / `beamFire` poses, untinted shroud and main's `ground` /
`roarGround`), art/TRACKER.md and docs/TASKS.md rows from both batches, Killua PROMPTS.md A16 (Whirlwind), Sasuke and
Naruto production scripts (the branch's newer line). Every fighter was repacked with `--quantize 48` on main's packer and
checked per animation against both sources (identical alpha masks; mean color shift 3-6 / 255 from the shared palette).
Sasuke charge ships v02. A fresh repack of all four on merged main is byte-identical to the committed sheets.
The merged art worktrees are kept only because they hold untracked production scratch (PR bodies, before/after PNGs,
helper scripts); remove them with `npm run pr -- prune` once that scratch is no longer needed.
