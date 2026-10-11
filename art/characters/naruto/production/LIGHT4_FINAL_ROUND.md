# Naruto final light4 correction round

2026-10-11: user approved heavy v10, throw v05 and airLight3 v05, and authorized up to3 more built-in imagegen calls for light4. The three approvals are recorded in manifest and REVIEW. New light4 pixels remain unapproved.

All3 calls were used: A f0 hair -12%/f4 -5%; B hair -10%; then a targeted A f0 -12% retry. v05 is best and retained active. v06 is archived as an inferior technical attempt, not a user rejection. v05 head1.040/range.146 versus v06 head1.041/range.150. Both preserve the eight spin-kick poses, identity and costume. The final call barely changed the problematic first gold hair silhouette.

Retained v05 full strict command: node tools/pack-sprites.mjs naruto --quantize 48 --strict-scale. Exit1 solely for light4, with1 reference/28ok/10existing manual/1pop/2existing exemptions. All42 animations/175frames evaluated. f0=1.108 versus f2=.962. No runtime atlas or cleaned frames written. Build passed. Existing baseline and win-version warnings remain; no gate, threshold, exemption, scaleFit, builds or manualQA changed.

Anatomical source skull calibration remains A60/B64 +/-6sourcepixels, target25.21402951469189px. Official measured stitch factors: v05 B.9251; v06 B.9048. Both use --counts5,3 and the current idle-only --public scratch reference. Body proportions are unchanged; only gold hair was requested to change. Manifest.version6 preserves highest saved history, while approvedVersion3 is untouched and active best source is v05.

The all8-frame review finds f0 gold cap still too large versus f2; recovery B has improved. Recommend HOLD light4 v05. No additional generation allowance remains. Heads and gallery cells use warning-only diagnostic scratch output because strict packing blocks the game atlas. The lineup adds light4 v05 f0 to the worktree's older cast at native density; it is context, not whole-cast certification. No diagnostic atlas copied to runtime outputs.

[Retained strict log](light4-retained-v05-strict.log), [heads](light4-v05-qa/heads-naruto.png), [lineup](light4-v05-qa/lineup.png), [per-frame report](light4-v05-qa/scale-report.json), [exact prompts](LIGHT4_FINAL_PROMPTS.md). Older attempts/logs remain immutable evidence.
