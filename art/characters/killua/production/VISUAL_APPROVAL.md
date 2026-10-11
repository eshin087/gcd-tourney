# Killua visual approval — 2026-10-11

User explicitly said:

> ok whats left to do? i approve everything and would like to see it live on the game

This records visual approval of the latest reviewed PR64 checkpoint. It does not waive strict scale, segmentation, anatomy, or gameplay QA. No new generation or additional attempt authorization is inferred. Claude alone merges and deploys production.

Manifest approvedVersion, fixed idle_approved reference, scale baseline and existing atlas are unchanged. Generated candidates remain technically blocked. Repack evidence is visual-approval-repack.json.

| Asset | Visually approved version | Form | Existing technical finding |
|---|---|---|---|
| idle | v03 | strip | ref |
| run | v06 | strip | drift |
| dash | v04 | strip | ok |
| backDash | v03 | strip | ok |
| superDash | v05 | strip | ok |
| jumpSquat | v04 | strip | unmeasured |
| jumpUp | v04 | strip | ok |
| jumpFall | v04 | strip | ok |
| land | v03 | strip | ok |
| light1 | v05 | strip | drift |
| light2 | v04 | strip | ok |
| light3 | v04 | strip | ok |
| light4 | v06 | parts A/B | pop |
| heavy | v09 | strip | pop |
| airLight1 | v05 | strip | ok |
| airLight2 | v06 | strip | ok |
| airLight3 | v05 | strip | drift |
| airHeavy | v04 | strip | pop |
| guard | v06 | strip | ok |
| block | v06 | strip | ok |
| hurtHigh | v05 | strip | ok |
| hurtLow | v05 | strip | ok |
| launched | v04 | strip | unmeasured |
| spin | v03 | strip | unmeasured |
| airRecover | v04 | strip | unmeasured |
| down | v04 | strip | unmeasured |
| getup | v05 | strip | unmeasured |
| charge | v10 | strip | ok |
| throw | v05 | strip | ok |
| beamCharge | v07 | strip | ok |
| beamFire | v07 | strip | ok |
| vanish | v03 | strip | unmeasured |
| stagger | v03 | strip | uniform |
| ko | v05 | strip | unmeasured |
| special | v04 | parts A/B | uniform |
| intro | v03 | strip | ok |
| taunt | v03 | strip | ok |
| win | v03 | strip | ok |
| specialForward | v09 | strip | ok |
| specialUp | v07 | strip | pop |
| specialDown | v03 | strip | pop |
| superPose | v06 | strip | ok |

The gallery also displayed earlier diagnostic light4 v05 and special v03; their visual approval is recorded in REVIEW, but latest selected work is light4 v06 and special v04 parts. Historical intermediate versions not displayed by that checkpoint are outside this exact latest-version record.

See correction-status.md for the attempt ledger and all remaining technical work. Numeric passes do not certify whole-body anatomy, and unmeasured poses remain manual holds. The five explicit source/segmentation holds are run gait reversal, light4 overlapping segmentation, special extra arms, and down/ko overlong shins.

## Repack after approval

Unchanged candidates were repacked with main tooling at revision `3f136d8e185016254dd217ff345b464b4b6c150c`:

```powershell
node 'C:/Users/eshin/Desktop/Claude Code/gcdTourney/tools/pack-sprites.mjs' killua --root 'C:/Users/eshin/Desktop/Claude Code/gcdTourney/.worktrees/art-scale-fix-killua/art' --out 'C:/Users/eshin/Desktop/Claude Code/gcdTourney/.worktrees/art-scale-fix-killua/public' --quantize 48 --json
```

Exit 1; no new character atlas or cleaned frames written. Results unchanged: 23 `ok`, 1 idle reference, 10 strict failures, 8 unmeasured. Strict failures: run, light1, light4, heavy, airLight3, airHeavy, stagger, special, specialUp, specialDown. Manual holds: jumpSquat, launched, spin, airRecover, down, getup, vanish, ko. Down and ko also retain cell-margin warnings.

The existing preview is the earlier checkpoint and predates this approval record; it remains valid source evidence but its approval wording is historical. No new preview, production deployment, merge or generation was performed for this approval-only update.
