# Gojo round 4 final QA — diagnostic only

Status: **HOLD on every new candidate; no image approval, promotion, production pack, PR publish, merge or deploy is claimed.** Root owns preview publication and main integration. User approval remains outstanding.

## Frozen quantized atlas

- Input versions: idle v06 (approved denominator), guard v04, jumpUp v04, jumpFall v06, airRecover v05, throw v05, airLight1 v07, airLight2 v05, airLight3 v12 (retained), light3 v05, hurtLow v04.
- Isolated output: [`sheet.png`](final-candidate-public/characters/gojo/sheet.png), SHA-256 `89FD7021575060D70A065C620607D3A80FD526D6B8B6F709D2106766381F0B28`; [`anims.json`](final-candidate-public/characters/gojo/anims.json), SHA-256 `40A09F854DA368550C4C158CC16350B7562CFA88030BE79BF77002307FF3BDC9`.
- Isolated fixture manifest uses `scaleGate: warn` solely to extract quantized diagnostic pixels. No production threshold, bodyHeight, offset, hitbox, runtime data or `public/characters/gojo/` file was changed.
- The fixture packs 47 frames at 48 colors with all expected frame counts and no clipped cells. Packer notes one unclear active strike limb and the airRecover manual QA record is stale at v03 while v05 is packed. `airLight1` and `throw` segmentation each report a column boundary that cuts through one figure group. These remain contact/segmentation holds.

## Anatomy references and method

Approved title-style neutral reference: `public/art-review/title-style-pilot/gojo-neutral_v01.png`. Approved combat reference: `public/art-review/title-style-pilot/gojo-combat_v01.png`. Measured reference centers are old approved idle v06: H36.2, T79.2, A70.0, L102.4, S33.0px; combat: H38.3, T70.7, A61.4, L107.2, S30.1px. User target is the unchanged approved head at idle scale within 2%, while body proportions follow the combat reference with H±2%, T±4%, A/L±6%, S±4%; comparison tolerances do not remove measurement uncertainty.

Astra inspected every candidate frame in the final quantized atlas. Projected intervals use H±4, T±6, A±12, L±12, S±4px; these ranges include endpoint and projection uncertainty and are not subpixel-precise. Angled views, bent limbs, coat occlusion, rotation and soles limit some segments. `skip` means no reliable heel-to-toe length; visible fragments are not reported as shoe length. A frame whose uncertainty overlaps the tolerance is **inconclusive**, never a pass. See [`FINAL-SEGMENTS.md`](astra-audit/FINAL-SEGMENTS.md) and the full coordinates, individual limb segments and named skips in [`final-independent-landmarks.json`](astra-audit/final-independent-landmarks.json).

| Candidate frame | H | T | A | L | S |
|---|---:|---:|---:|---:|---:|
| jumpFall v06 f0 | 38.1 | 64.0 | 58.1 | 86.8 | 23.6 |
| jumpFall v06 f1 | 39.1 | 64.0 | 58.1 | 87.2 | 23.6 |
| airRecover v05 f0 | 36.2 | 69.4 | 71.5 | 101.2 | 46.5 |
| airRecover v05 f1 | 36.2 | 52.5 | 74.4 | 100.7 | 36.1 |
| airRecover v05 f2 | 40.0 | 64.5 | 56.5 | 84.4 | 22.0 |
| throw v05 f0 | 35.2 | 60.7 | 45.4 | 98.2 | skip |
| throw v05 f1 | 36.2 | 56.1 | 49.6 | 98.0 | skip |
| throw v05 f2 | 37.1 | 55.7 | 34.2 | 95.9 | skip |
| throw v05 f3 | 36.1 | 58.1 | 43.2 | 94.5 | skip |
| airLight1 v07 f0 | 36.1 | 57.0 | 48.5 | 91.8 | skip |
| airLight1 v07 f1 | 38.0 | 56.0 | 46.0 | 91.5 | skip |
| airLight1 v07 f2 | 38.0 | 55.0 | 45.0 | 91.7 | skip |
| airLight1 v07 f3 | 37.1 | 56.1 | 48.6 | 91.4 | skip |
| airLight1 v07 f4 | 38.1 | 56.1 | 45.8 | 91.2 | skip |
| airLight2 v05 f0 | 40.2 | 64.1 | 49.2 | 91.6 | skip |
| airLight2 v05 f1 | 38.3 | 56.3 | 36.0 | 69.2 | 29.4 |
| airLight2 v05 f2 | 38.2 | 57.5 | 31.8 | 76.1 | 30.7 |
| airLight2 v05 f3 | 40.2 | 64.0 | 47.0 | 91.6 | skip |
| airLight2 v05 f4 | 40.2 | 64.0 | 47.3 | 91.6 | skip |
| light3 v05 f0 | 38.1 | 61.6 | 50.3 | 99.4 | 29.0 |
| light3 v05 f1 | 37.0 | 62.6 | 50.1 | 98.7 | 32.0 |
| light3 v05 f2 | 36.1 | 62.8 | 51.0 | 81.4 | 28.2 |
| light3 v05 f3 | 37.1 | 62.8 | 51.0 | 79.5 | 28.2 |
| light3 v05 f4 | 36.0 | 61.7 | 50.0 | 89.9 | 32.0 |
| light3 v05 f5 | 38.0 | 63.1 | 48.6 | 87.3 | 32.0 |
| light3 v05 f6 | 38.0 | 62.1 | 48.6 | 87.2 | 31.0 |

No frame is certified as a complete anatomy pass. Several torso/arm/leg vectors materially differ from the title-style cells, while foreshortened or occluded chains remain inconclusive. JumpFall shoes are oblique. AirRecover has rotation/depth uncertainty. Do not interpret a numeric point estimate without the stated interval.

The strongest new review concerns are throw v05's compact 56–61px torso projection, airLight1 v07's 55–57px torso and 45–49px arm chain (nominally 28–31% and 18–21% below old idle respectively, with the stated uncertainty), and light3 v05's 9–11px crown drop at the A/B seam, including upright recovery frames. These are explicit holds requiring user/Claude review, not automatic redraw authorization. JumpFall v06 preserves crown height within 1px, but its free hand swings roughly 16–20px between two 80ms frames and deserves playback review.

## Other retained items inspected by Astra

- Idle v07: HOLD. All eight frames are 234–236px tall and 135–138px wide against the 210–216 by 145–160px target. Torso is about 83–85px versus old idle 79.2/combat 70.7; far chains are occluded/foreshortened and frontal shoulder comparison is unavailable. Idle head range is insufficiently precise for the requested ±2% certification. Do not use unapproved idle v07 as the identity or scale denominator.
- SuperDash v09: HOLD. Compact torso reads about 53.5±6px versus old idle 79.2±6 and combat 69.7±6; folded arm/leg values are secondary, with shoe projection and far limbs skipped. No head-only pass certifies the body.
- Guard v04, jumpUp v04, airLight3 v12 and hurtLow v04: HOLD for certification without a robust measured defect authorizing redraw. airLight3 f2/f3 leg values have ±12px propagated uncertainty and overlap the acceptance band; retain pose-scale concern as inconclusive.

Full retained/candidate audit and cell metadata: [`Astra report`](astra-audit/REPORT.md), [`atlas evidence`](astra-audit/atlas-evidence.json). Atlas SHA was independently rechecked after the audit.

## Packer gates

The real-manifest full strict-scale dry run exits **1** and refuses to write the Gojo production atlas. It sees the latest candidate versions and numerous existing/approved failures, including: superDash v09, jumpUp v04, airRecover v05, throw v05, airLight1 v07, airLight2 v05, airLight3 v12, light3 v05 and hurtLow v04; jumpFall v06 and guard v04 pass that automated probe. This is a whole-character refusal, not a clean production pack. The raw machine output and exit code are in [`full-strict-dry-run.json`](full-strict-dry-run.json) and [`full-strict-dry-run-exit.txt`](full-strict-dry-run-exit.txt). No production atlas or frames were written.

H/B values per cell are separately recorded in [`final-candidate-atlas-measurements.json`](final-candidate-atlas-measurements.json). H is the packer head probe; B is TOOL-036 garment area, advisory ±10%. Neither is a torso/limb/shoe measurement or anatomy pass.

## Attempt accounting and integrity incident

Call totals are cumulative by asset/part across saved version numbers: jumpFall 3/3 (v05 and v06 candidates), airRecover 3/3 (v04 and v05), throw 3/3, airLight1 3/3, light3 Part A 2/3 and Part B 2/3. No more rendering was performed after recovery; unused light3 calls remain unused.

AirLight2 has five calls recorded against an authorization of three, an overrun of two. The three extra calls are preserved under `sources/airLight2-budget-incident-20261013/` and were rejected for anti-aliased/painterly style. Original call1/call2 were restored to their original source paths after exact hash matches (`14FFF9…` and `84A804…`); v05/call2 remains the selected saved strip. The temporary overwritten bytes remain preserved under `sources/incident-airLight2-overrun/`. No further airLight2 generation is authorized. Full hashes and provenance are in [`attempt-ledger.json`](sources/attempt-ledger.json).

## Status

All candidates remain `needs review`; manifest `status` and `approvedVersion` continue to reflect the previously user-approved art. New version numbers are candidates, not approvals. Preserve all existing D/E/F/G/H/I studies and round3 items. Claude retains ownership of production integration and bodyHeight/offset/contact checks. The user must review the gallery and approve or give feedback; Astra’s independent hold is not user approval.
