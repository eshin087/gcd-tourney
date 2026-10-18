# ENG-112 Gojo directional normals handoff

Date: 2026-10-18  
Branch/worktree: `art/normals-gojo` / `.worktrees/art-normals-gojo`  
Review: `public/reviews/normals-gojo/`  

## Candidate state

The whole Gojo character was packed at 48 colors: 53 animations / 245 frames, including the 44 existing animations and nine new strips. The strict candidate head scale gate passed after measured importer fits on fSmash v01 (×0.9208) and fair v01 (×0.8803). The user approved all nine drawings as drawn via Claude relay combat #30; manifest, tracker and review rows record that approval. All nine remain technically held by Astra pending the findings below and Claude's runtime contact check. `uair` remains on the gameplay stand-in with manifest version 0; no usable complete candidate was recovered.

Nine user-approved drawings shown from the exact packed atlas: fTilt v01, uTilt v01, dTilt v02, dashAttack v01, fSmash v01, uSmash v01, dSmash v01, fair v01 and bair v02. The review page includes per-frame packed crops and loop GIFs beside the matching gameplay stand-in and approved idle f0, plus head/body/lineup sheets, raw sources, provenance and Astra's audit.

## Astra final audit

Audit: `public/reviews/normals-gojo/astra-audit.md` (source copy `production/ENG112_NORMALS_ASTRA_AUDIT.md`). All nine are on technical HOLD. Decisive issues: fTilt's f0 violates the scheduled R-hand-out pose and its source finish is soft; uTilt f5 clips at x255 and f4 head probe is 1.065; dTilt f2 reaches x255 and the crouch body-volume proxy is .817-.827; dashAttack active shoes clip 9/8 px; fSmash auto-head fit shrinks the whole body and source split/cut integrity needs verification (charge is f2); uSmash is diagonal rather than straight up and has head probes above +6% on f2/f6/f7; dSmash reads as a two-sided sweep but full segment tolerance is uncertified; fair's whole-body fit leaves body proxy .815-.860 and pre-fit clipping needs source-toe reconciliation; bair's first active f2 is still a bent rear chamber, with f3 delivering the full strike. See the audit for frame-by-frame data and uncertainty. Drawing approval, even if given, does not clear any technical hold. No hitbox override is claimed as runtime-verified; Claude owns the contact check.

## Generation exception

The authorized one-round budget was up to three image calls per move. For uair, two Part A results exceeded the hair ceiling and were preserved; subsequent combined-strip rescue attempts were mishandled, including an accidental no-op call, exceeding the cap. The output path for the combined rescue was not trustworthy, so no complete strip was copied, packed or represented as a candidate. Full prompts, attempt paths and incident details are in `raw/_qa_hold/ENG112_NORMALS_V01_PROVENANCE.md` and its review-page copy. No more image calls are authorized absent a new user decision. This was a generation-process mistake, not user rejection of an image.

## Integration checks for Claude

- Run `node tools/pr.mjs check art/normals-gojo` from the main/integration context; expect strict scale to pass for packed candidates, while the nine technical holds above need disposition.
- Check runtime contact/hurtbox alignment on the packed cells and active frames; adjust only Gojo `hitboxes.json` overrides if warranted. The art-side review was static and does not establish gameplay contact.
- Keep all nine unapproved candidates out of production. The public candidate atlas is branch output only.
- Main docs merge conflicts, if any, are outside this branch's scope; this handoff did not edit `docs/TASKS.md`, `CHANGELOG.md`, `docs/NOW.md` or the inbox.
