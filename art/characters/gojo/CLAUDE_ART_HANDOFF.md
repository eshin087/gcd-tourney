# ART-CHARGE Gojo v08 review handoff

Date: 2026-10-19
Branch/worktree: `art/charge-gojo` / `.worktrees/art-charge-gojo`
Review: [public/reviews/charge-gojo/](../../../public/reviews/charge-gojo/)
Status: **user review pending; technical HOLD**. Candidate v08 is in `raw/_qa_hold/`; approved v07 remains the game asset.

The branch was fast-forward merged with main at `7706db2f` before packing. Strict `node tools/pack-sprites.mjs gojo --quantize 48 --keep-palette --no-writeback` exited 1 and did not write the Gojo atlas because charge H=0.89 of idle. A temporary `scaleGate: warn` diagnostic pack was used to inspect actual quantized cells and then removed; the warning-mode atlas and metadata hashes match `production/charge-v08/ASTRA_AUDIT.md`. The public game atlas was restored to the main/approved v07 output before handoff.

**Astra HOLD:** H median 0.886; body garment-area proxy B median 0.817. f2/f4 soles are y240 while f3/f5 are y222 (18 px loop pop); head-mask center drifts 18.5 px vertically and 8 px horizontally. The packer also reported a non-magenta source background, 159 removed specks and one 29 px left clipping warning. No scale exemption or `scaleManualQA` was added. Full results: `production/charge-v08/ASTRA_AUDIT.md`, `PRODUCER_REPACK_CHECK.md`, and the public review page.

The v08 image budget is exhausted at 3/3. The user review request asks whether to approve the visual direction as drawn while v07 stays live and technical work remains, or reject v08 and authorize a fresh three-call round. Do not treat visual approval as technical clearance or merge v08 into the game pack.

Gojo-specific brief request: packed f2's projected eye centre under the blindfold is estimated at **cell `(130, 72)` ±2 px**; the eye itself is not visible. This point is version-bound and should be remeasured if the packed registration changes, for Claude to re-aim the Six Eyes glint.

The review GIF shows actual warning-mode quantized cells at 70/90/110/110/110/110 ms, f0-f1 once, then f2-f5 four times and pause. No in-game lab playback was run because strict packing failed. The game preview route uses approved v07.

---

# ENG-112 Gojo directional normals handoff

Date: 2026-10-18  
Branch/worktree: `art/normals-gojo` / `.worktrees/art-normals-gojo`  
Review: `public/reviews/normals-gojo/`  

## Candidate state

The whole Gojo character was packed at 48 colors: 53 animations / 245 frames, including the 44 existing animations and nine new strips. The strict candidate head scale gate passed after measured importer fits on fSmash v01 (×0.9208) and fair v01 (×0.8803). The user approved all nine drawings as drawn via Claude relay combat #30; manifest, tracker and review rows record that approval. All nine remain technically held by Astra pending the findings below and Claude's runtime contact check. `uair` remains on the gameplay stand-in with manifest version 0; no usable complete candidate was recovered.

Nine user-approved drawings shown from the exact packed atlas: fTilt v01, uTilt v01, dTilt v02, dashAttack v01, fSmash v01, uSmash v01, dSmash v01, fair v01 and bair v02. The review page includes per-frame packed crops and loop GIFs beside the matching gameplay stand-in and approved idle f0, plus head/body/lineup sheets, raw sources, provenance and Astra's audit.

## Astra final audit

Audit: `public/reviews/normals-gojo/astra-audit.md` (source copy `production/ENG112_NORMALS_ASTRA_AUDIT.md`). All nine are on technical HOLD. Decisive issues: fTilt's f0 violates the scheduled R-hand-out pose and its source finish is soft; uTilt f5 clips at x255 and f4 head probe is 1.065; dTilt f2 reaches x255 and the crouch body-volume proxy is .817-.827; dashAttack active shoes clip 9/8 px; fSmash auto-head fit shrinks the whole body and source split/cut integrity needs verification (charge is f2); uSmash is diagonal rather than straight up and has head probes above +6% on f2/f6/f7; dSmash reads as a two-sided sweep but full segment tolerance is uncertified; fair's whole-body fit leaves body proxy .815-.860 and pre-fit clipping needs source-toe reconciliation; bair's first active f2 is still a bent rear chamber, with f3 delivering the full strike. See the audit for frame-by-frame data and uncertainty. Drawing approval, even if given, does not clear any technical hold. No hitbox override is claimed as runtime-verified; Claude owns the contact check.


## Relay combat #32 packed-offset correction

The approved raw strips remain unchanged. Version-bound sidecars apply uTilt v01 f5 [-7,0] (3px loss + 4px margin), dTilt v02 f2 [-4,0] (margin intrusion only), dashAttack v01 f2/f3 [-13,0]/[-12,0] (9/8px loss + 4px margin); every other frame is [0,0]. Full 48-color pack: 53 animations / 245 frames; none of these three strips reports clipping or margin intrusion. Review packed crops, loops, and all 18 active hit overlays were rebuilt from the sheet.

Astra confirms the corrected margin and dTilt/dashAttack strike boxes. Focused continuity: uTilt has only a small shoe slide on the non-active recovery frame; dTilt passes. **dashAttack remains HOLD:** f3→f4 head landmark shifts about 58px, and the required [0,0] f4 contributes to the jump. Do not merge until Claude dispositions this transition; resolving it may need a further offset decision. Full original anatomy/pose holds on all nine drawings remain recorded in the audit.

Relay #31 authorized one up-to-three-call uair v03 round, but only after the nine-move branch merges. Wait for Claude's merge confirmation, then start `art/normals-gojo-r2` from main, bring forward only the authorized uair task, and run Luna generation followed by Astra audit.

## Generation exception

The authorized one-round budget was up to three image calls per move. For uair, two Part A results exceeded the hair ceiling and were preserved; subsequent combined-strip rescue attempts were mishandled, including an accidental no-op call, exceeding the cap. The output path for the combined rescue was not trustworthy, so no complete strip was copied, packed or represented as a candidate. Full prompts, attempt paths and incident details are in `raw/_qa_hold/ENG112_NORMALS_V01_PROVENANCE.md` and its review-page copy. No more image calls are authorized absent a new user decision. This was a generation-process mistake, not user rejection of an image.

## Integration checks for Claude

- Run `node tools/pr.mjs check art/normals-gojo` from the main/integration context; expect strict scale to pass for packed candidates, while the nine technical holds above need disposition.
- Check runtime contact/hurtbox alignment on the packed cells and active frames; adjust only Gojo `hitboxes.json` overrides if warranted. The art-side review was static and does not establish gameplay contact.
- All nine drawings are user-approved, but keep them out of production pending the remaining technical holds. The public candidate atlas is branch output only.
- Main docs merge conflicts, if any, are outside this branch's scope; this handoff did not edit `docs/TASKS.md`, `CHANGELOG.md`, `docs/NOW.md` or the inbox.

## Relay combat #33 — fresh uair round (2026-10-18)

Claude confirmed the nine-move branch merged at `9679cf1d` and authorized the one fresh up-to-three-call uair round from relay #31. It was run on `art/normals-gojo-r2`; all three calls are accounted for. Call 2 and call 3 are preserved unchanged in `raw/_qa_hold/` with prompts, source paths, dimensions and hashes in `uair_fresh_round_2026-10-18.md`. Both show the active shoe above the hair-top ceiling and exceed the intended square-cell height. Call 1 completed but its output path was not captured, so it was not searched for, recovered or filed. No compliant strip exists; no `uair_vNN` candidate, pack, manifest version, REVIEW row or visual approval was created. The existing gameplay stand-in remains. A public review page documents the two held attempts at `public/reviews/normals-gojo/uair-r2/`. The three-call authorization is exhausted; await a new user decision before any further image calls.

## Relay combat #34 — diagonal uair retry (2026-10-18)

The user authorized one fresh up-to-three-call round for an up-and-forward diagonal aerial kick, with the raised shoe inside the cell and hands following Gojo's pocket schedule. All three exact image paths were captured; the unchanged originals remain in `raw/_qa_hold/uair_upforward_call01_hold.png` through `call03_hold.png`, with prompts, hashes and findings in `uair_fresh_round_2026-10-18.md`. After considering the packer's per-frame body-height rescaling, call 3 was selected byte-for-byte as `raw/uair_v01.png`; sidecar `raw/uair_v01.json` applies the measured auto-head fit ×0.9434 and f2 offset [-11,0]. The 48-color full-character pack contains 54 animations / 251 frames, with uair in cells 245–250, no clipping, head median 1.000 and feet proxy 1.057. Astra places v01 on HOLD: f3 retracts during the second active frame, and the jacket reads compressed against references with uncertain projected torso measures. The packed frames and the three attempts are shown at `public/reviews/normals-gojo/uair-r2/retry-34/`. User drawing approval is pending; Claude still owns runtime contact. No further generation was authorized by #34.
