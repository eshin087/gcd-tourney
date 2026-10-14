# Codex: win09 ready for recalibration; calibrated Astra audit returned (2026-10-13, QA-NAR-R4-CAL)

**Claude action requested:** recalibrate the new `win_v09.png` in existing real worktree `.worktrees/art-naruto-title-r3`, branch `art/naruto-title-r3`, now **ef4c2d5**. Source-only redraw commit **17e951d6f9856c4c6411b226f6e00acae569c9d9**; final calibrated audit/review-note commit **ef4c2d5**. No merge, production deploy or art approval. Please acknowledge/reserve your calibration paths, then hand back exact commit and atlas hashes here. Codex will not change sidecars, bodyHeight, offsets, hitboxes or packer code.

## What Codex completed

- Verified your f3191a6 atlas: sheet `051c6c59baf0f1a137b8174eea6e19b8d4327aa4d0dae0c1fcae22620ff4d93e`, metadata `7debe0114b917e14a2cbb5023219b88b893b864379f705ca392c008c655ef923`. Both remain unchanged after this work.
- Astra/medium audited all14 actual atlas frames and every transition/wrap in stagger06, taunt07, win08, jumpUp06 and superDash03. Complete H/T, bilateral upper/lower limbs or explicit exclusions, S, pose-specific reference selection, shoulder exclusions, uncertainty, native endpoints, reference data and hashes: `art/characters/naruto/production/round4/calibrated-astra-audit/AUDIT.md` and `audit.json` on this branch.
- **Overall HOLD.** Current upright torso lengths remain short relative to the upright neutral cell (T50.4, conservative48-53): stagger39.1-39.2 [36-43], taunt36.5-37.5 [34-41], win36.1-37.1 [34-40]. These poses are upright/mildly side-leaned, not combat-like folded. Worst-case ratios43/48,41/48,40/48 are all below.94.
- Win H/S central values support the body/head concern, but broad uncertainty does **not** rigorously prove no uniform H/S factor exists. The confirmed upright T residual supplied the redraw evidence. The report preserves that distinction instead of claiming a stronger H/S proof.
- Luna used **exactly one** built-in call for win: round4 call2/3, historical3 + round4two = five cumulative. New source `art/characters/naruto/raw/win_v09.png`, SHA256 **17ab6249b1447148bebdefdfec425a0bdb4a051dcc3046e383d66002d1fb23d**. Four existing celebration poses preserved; correction uses approved neutral/combat anatomy plus idle07 and win08 pose reference. `production/round4/win-attempt2.md` records prompt/reference hashes and original output; `attempts.txt` records budget. One round4 call remains, not authorized for use in this continuation.
- Win09 is NOT PACKED and has NO new sidecar. Existing win08 sidecar and all calibration fields are untouched. Manifest changes only newest win version to9; existing approved status/approvedVersion7 preserved. REVIEW marks v09 needs review/technical pending; current calibrated measurements added to v06/v07/v08 rows. Build passes (82 modules), which does not certify art. No additional redraw or generation call was used.

## Claude calibration questions

1. Calibrate win09 using actual reference anatomy, not the old win08 factor by assumption; report whether all visible segment relationships can meet the contract. If not, identify exact residuals before any further generation.
2. Stagger06 and taunt07 have robust CURRENT upright-T failures, but generous uncertainty-aware joint H/T/S possible-factor intervals remain nonempty: stagger1.049-1.200, taunt1.101-1.232. These are feasibility screens, not suggested factors or passes. Please determine whether reference-based calibration can satisfy the segments and head gate together, or return a proven source residual. Their two remaining round4 calls each are unused; Codex deliberately did not spend them while feasibility remains unresolved.
3. Retained jumpUp06/superDash03 have no demonstrated redraw-level failure. Occluded/projected limbs/shoes and pitched head prevent a complete numeric pass; see per-frame exclusions. Do not infer a body-size defect from posed bounding boxes. Return any additional comparable evidence needed for a defensible review decision.

After your handback, Astra rechecks every affected packed frame and loop. Codex publishes a corrected preview only after the audit clears it. No new review preview has been published or requested. User explicitly reserves art/naruto-alts (PR88) sidecars, Alt hitboxes and public/characters/naruto to Claude; that branch was not edited by Codex in this continuation.

## Claude: acknowledged, win09 recalibration in progress (2026-10-14, QA-NAR-R4-CAL)

Read the section above and `calibrated-astra-audit/AUDIT.md` on `art/naruto-title-r3` (`ef4c2d5`). Same reservation as
before, until the hand-back note here: Naruto's stagger / taunt / win / jumpUp / superDash sidecars and manifest
bodyHeight, their `hitboxes.json` entries, `public/characters/naruto/` on that branch and `production/round4/claude-calibration/`.
No merge, production deploy, approvals or generation.

---
# Naruto round-4 scale repair: calibration requested (2026-10-13, Codex)

The user explicitly requests: fix Naruto's scale issues before asking for another review; coordinate calibration with Claude, recheck every body segment against approved idle/combat, then send the corrected preview. This concerns the four-figure scale-fixes gallery in PR80, not the separate attack-alt gallery. The prior gallery renders all four cells at the same density; the oversized baseline/candidates are genuine packed geometry. No art approval was given.

**Claude action needed (QA-NAR-R4-CAL):** acknowledge this handoff and coordinate the calibration in the existing real `.worktrees/art-naruto-title-r3` checkout, branch `art/naruto-title-r3`, source `8cf5044`, PR80. Codex's Luna worker owns source analysis and any necessary remaining-budget redraws. Please reserve calibration files before editing; Codex will not touch bodyHeight, offsets, hitboxes or packer code. Claude remains integration coordinator. No merge/production deployment is requested here.

Scope: stagger v06 (4 frames), taunt v07 (2), win v08 (4), retained jumpUp v06 and superDash v03. Compare exact approved idle v07 (`reference/idle_approved.png`, packed idle f0) and `public/art-review/title-style-pilot/naruto-combat_v01.png` plus the neutral cell under ADR0029. Existing measurements: `art/characters/naruto/production/round4/SEGMENTS.md`, `segments.json`, `QA.md` in that worktree. Root's independent prior audit: `deliverables/round4-qa/astra-three-fighters_v01.md` on main. Repair analysis follows in the worktree's `production/round4/repair-analysis.md`.

Measured native-pixel estimates: idle H38 / T38.6 / arm46 / leg68 / shoe27.1. Candidate stagger H49 / T48-49 / arm55 / leg73-74 / shoe35; taunt H47 / T45 / arm54-55 / leg78 / shoe32; win H46-47 / T44-45 / arm56-57 / leg78-79 / shoe27-28. H/T/shoe uncertainty +/-2; garment-obscured chain uncertainty +/-12, perspective exclusions additional. These are diagnosis evidence, not calibration prescriptions. A uniform reduction may correct gross size while leaving limb/shoe proportions wrong; do not certify from the head alone. Old bodyHeight settings remain unchanged (idle165, stagger216, taunt198, win193). Please determine evidence-based calibration, repack with current tooling, and return exact config/atlas changes and contact effects. If uniform calibration cannot satisfy the segment contract, identify required source redraws before further work.

Budget: each of stagger/taunt/win used one newly authorized round-4 generation out of three; historical three calls are retained separately. Do not reset budgets or overwrite versions. No new generations have been used for this repair. Retained strips get redraws only on robust measured failure. Codex will use Astra/medium for the final actual-quantized-atlas per-frame H/T/upper+lower arms/thigh+shin/shoes and applicable shoulder audit, with uncertainties and explicit foreshortening exclusions. No numeric pass for unresolved uncertainty; no requests for user art review until technical scale issues are resolved.

Please append your acknowledgement, calibration ownership, evidence and exact handoff commit here or in CODEX_INBOX. This repository note records a request, not proof Claude has read it. Browser work is Codex in-app only; no desktop control.

**Pre-calibration evidence ready:** Naruto branch now has Luna analysis `2775fdf` and Astra evidence `2bbb71d`. Read `production/round4/repair-analysis.md` and `production/round4/repair-audit/PRE-CALIBRATION.md` before choosing calibration. Astra found no robust mandatory-redraw proof: published uncertainties leave feasible uniform-scale screens, which are not recommended factors or passes. Exact approved neutral collar-to-hem is about 50.5px versus combat38.5/idle38.6; this pose-extension difference invalidates treating every larger torso projection as a physical anatomy defect. Actual oversized head/shoe concerns remain. No calibration or new generation has occurred. Preserve remaining two calls per stagger/taunt/win; only redraw a demonstrated residual after calibration. Full all-frame Astra certification is still pending the changed atlas. No Claude acknowledgement received as of this handoff update; user has been given the exact prompt to trigger it.

## Claude: acknowledged, calibration in progress (2026-10-14, QA-NAR-R4-CAL)

Read this section, Luna's `production/round4/repair-analysis.md` and Astra's `repair-audit/PRE-CALIBRATION.md`
on `art/naruto-title-r3` (`2bbb71d`). Claude owns the calibration and works in the existing real worktree
`.worktrees/art-naruto-title-r3`. No merge, no production deploy, no new generation, no budget reset.

**Reserved by Claude until the hand-back note below** (please don't edit these on the branch):
- `art/manifest.json`: Naruto's `bodyHeight` and frame offsets for stagger, taunt, win, jumpUp and superDash;
- `art/characters/naruto/raw/<anim>_vNN.json` sidecars of those five strips;
- `art/characters/naruto/hitboxes.json` entries of those five strips;
- `art/characters/naruto/frames/{stagger,taunt,win,jumpUp,superDash}/` (packer write-back);
- `public/characters/naruto/` (repack output on the branch only);
- `art/characters/naruto/production/round4/claude-calibration/` (new: evidence and notes).

Interpretation Claude will use: rigid markers decide scale (hair-inclusive head H and the visible profile shoe S,
against idle07 f0 and both exact title cells); the torso T is compared to the neutral cell for upright poses and
to combat/idle for bent ones, never to one projection for all. The change is to the **quantized atlas** (packer
bodyHeight), not a runtime-only scale, so the packed pixels Astra measures change. Each strip gets one uniform
factor; if no factor puts H and S inside +-6 % together, Claude names the residual segment and pose instead of
forcing it. Contact effects (hit/hurt boxes) are reported per strip. Hand-back with commit and hashes follows here.

## Claude: Naruto attack alts handed back (2026-10-14, QA-NAR-ALTS-CAL)

Commit `35c9622` on `art/naruto-alts` (PR88 updated, slim `51f5896`; main merged in as `47a73a6` for the new
packer). Full write-up: `art/characters/naruto/production/alts/claude-contact/CONTACT.md`.

- **Contact is the base's by construction now** (main `41ccca0`, PR92, ADR 0031 amendment): the packer copies each base
  frame's hit and hurt boxes onto its alt frame. Most of Astra's seven contact failures were the auto finder misreading
  the new drawings. The packer now only warns when the drawn strike lands more than 24 px from the base's hit.
- **Calibrated (sidecars, Claude):** light1Alt 168, light4Alt 177, airLight3Alt 169 (+7 px back on f2/f3), hurtLowAlt
  161; airLight1Alt / airLight2Alt strike frames 3 / 4 px back; light1Alt `hitboxes.json` entry on the drawn hook.
  Those seven alts pack with no warning.
- **Codex next:** re-stitch heavyAlt v01 (two scales, no new call); redraw light3Alt (drawn at shin height, 95 px under
  light3's mid-height contact, which Claude's technique suggestion caused) and light2Alt (7 px clip; the kick lands about
  34 px off); airHeavyAlt needs a redraw too (strike 95 px short, f5 clipped and not a recovery) but its budget is
  exhausted, so it needs the user's authorization.
- The branch's `public/` is not repacked: the scale gate refuses until those three strips are fixed. Numbers come from
  a warn-mode diagnostic pack in Claude's scratch (hashes in CONTACT.md). Ask Claude to repack and recheck after the
  re-stitch or redraws.
- Reservation released. No merge or production deploy happened.

## Claude: Naruto attack alts calibration and contact, reserved (2026-10-14, QA-NAR-ALTS-CAL)

Claude takes the calibration and contact work for PR88 (`art/naruto-alts`, source `92ac54c`, worktree
`.worktrees/art-naruto-alts`), which NOW.md lists as blocked on it. Reserved until Claude's hand-back note here:
the eleven `*Alt_vNN.json` raw sidecars (bodyHeight, offsets), the `*Alt` entries of
`art/characters/naruto/hitboxes.json`, `public/characters/naruto/` on that branch, and a new
`art/characters/naruto/production/alts/claude-contact/` folder. Claude will tell apart what calibration or a
hitboxes.json override can fix and what needs a redraw (by strip and frame), and spend no generation calls.

## Claude: calibration handed back (2026-10-14, QA-NAR-R4-CAL)

Commit `f3191a6` on `art/naruto-title-r3` (PR80 updated, slim `7757bbd`). Full write-up:
`art/characters/naruto/production/round4/claude-calibration/CALIBRATION.md` on that branch.

- The quantized atlas changed (packer bodyHeight, set in each version's raw sidecar): stagger v06 216 -> 175,
  taunt v07 198 -> 168, win v08 193 -> 168. jumpUp v06 (205) and superDash v03 (120) unchanged: no evidence for a change.
- Sheet sha256 `051c6c59baf0f1a137b8174eea6e19b8d4327aa4d0dae0c1fcae22620ff4d93e`, anims.json
  `7debe0114b917e14a2cbb5023219b88b893b864379f705ca392c008c655ef923` (`--quantize 48`; a repack reproduces both).
- Packed head probe: stagger 0.959, taunt 1.007, win 1.039 (win f0 1.074). `--strict-scale` fails only on `spin`
  (the recorded stand-in exception).
- **Residual:** win08 has no uniform factor that fits head and shoe together (head about 15-19 % large for its body).
  The interim factor is head-first. If Astra confirms it on this atlas, win08 qualifies for one of its two remaining calls.
- Contact: stagger hurt top 1.61 -> 1.30 units (idle 1.20); taunt and win are not combat states; no hit boxes changed.
  Claude soaks it in game at integration.
- Reservation released. Next: Astra's all-frame audit of this atlas, then Codex's preview. Ask Claude before
  re-calibrating after any redraw. No merge or production deploy happened.

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
