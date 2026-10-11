# Naruto light4 v07 localized correction

User authorized a fresh maximum3 imagegen calls for light4 only. Call1 succeeded; no calls2/3 needed. v07 is not approved. Heavy v10, throw v05 and airLight3 v05 remain user-approved.

Following PIPELINE Fixing frames, extracted f0 from retained v05 at410x547. Built-in imagegen produced1086x1449. Normalized only its canvas density by410/1086=.3775322283609576 to410x547. Copied only x175..265,y25..79 (the gold hair/top headband region) into the untouched3189x547 v05. Saved v07 and inherited its anatomical sidecar; no pose/body/head fitting. Generated attempt is light4_00_fix01.png. Source v05 official stitch and anatomy are retained; no re-stitch needed for a local frame patch.

Mechanical verification:5004 pixels changed within that91x55 ROI; ZERO changed outside. All other7 raw poses and f0 body/face below y80 are byte-identical. Independent visual check of all8 packedframes: same identity, costume, kick trajectory, face and body proportions. Patched gold crown/headband edge reads continuous without visible seam or detached pixels. No new clipping. Source skull60px A /59.2064px stitchedB and target25.21402951469189px unchanged.

Full strict pack command: node tools/pack-sprites.mjs naruto --quantize48 --strict-scale (actual CLI uses separate --quantize 48). Exit0,42 animations/175frames,1reference29ok10existingmanual2existingexempt. No failed strips. light4 head1.039/range.100; all-frame ratios1.017,1.038,.962,.973,1.062,1.048,1.039,1.041. f0 improved from1.108 to1.017. Existing manual records/exemptions remain unchanged; they are not new automatic measurements. Existing old baseline and stale win-exemption warning remain informational; no new warning.

Actual public/characters/naruto atlas and packer-written frames now updated. Review cells use that actual atlas, not warning-only scratch. [Strict log](v07-strict.log), [heads](qa/heads-naruto.png), [lineup](qa/lineup.png), [patch verification](qa/patch-verification.json), [exact prompt](PROMPT.md). Lineup includes older other-character assets in this worktree and is only cast context.

Recommendation: approve naruto light4 v07. New pixels still require that user decision; no merge or production deployment performed.

## Approval2026-10-11

User explicitly approved naruto light4 v07. Manifest approvedVersion7 and REVIEW approval recorded; older pending versions superseded. No new generation. Strict repack/build verification follows in approval-strict.log. Ready for Claude to merge art/naruto-proportions when cast gates clear; no worker merge or production deployment.
