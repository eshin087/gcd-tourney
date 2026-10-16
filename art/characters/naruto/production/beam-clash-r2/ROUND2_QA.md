# Beam clash round 2 pack checks

Main was merged at `2de7bbb0`. Sparse-checkout raw folders for Naruto, Sasuke, Killua and Gojo were copied from the main checkout for QA; copied main raw files were not staged. The seven round-2 candidate sources were restored from their recorded generation outputs. VFX source and atlas directories match main; no VFX pack was run.

| Fighter | Quantized pack | Candidate checks | Result |
|---|---|---|---|
| Naruto | 52 animations, 230 frames, 48 colours; complete | `beamStruggle` v02 head 0.981/0.963/0.954; body B 0.658/0.648/0.666. `hand` palm center [232,124] on all frames, estimated uncertainty ±3 px. | Pass. Body-area ratio is advisory; user approved as drawn via Claude relay #7. |
| Sasuke | 44 animations, 181 frames, 48 colours; complete | Ground v01 H 0.923–0.987, B 0.706–0.799. Air v01 H 0.943–1.016, B 0.836–0.914. | Both pass after bodyHeight calibration; user approved both via relay #7. |
| Killua | 43 animations, 178 frames, 48 colours; complete | Ground v01 H 0.951–1.030, B 0.920–0.954. Air v01 H 0.975–1.052, feet 1.19, body B 0.551–0.607. | Ground passes and user approved via relay #7. Air v01 fails the strict gate, remains in `raw/_qa_hold/`, and is omitted from the atlas. |
| Gojo | 44 animations, 181 frames, 48 colours; complete | Ground v01 H 0.971–1.069, B 0.943–0.951. Air v01 H 0.948–0.971, B 0.903–0.934. | Both pass; user approved both via relay #7. Body sheet reports one palette colour-list warning. |

The Astra anatomy audit of the final quantized atlas remains pending. The six approved images are listed at `public/reviews/beam-clash-r2/`; their approval does not substitute for that audit. Local `npm run build` was blocked by a Windows `EPERM` realpath error on the managed worktree's `index.html`; the PR preview build is the production-build verification.

The other five pose-specific `hand` anchors still need Claude's measured per-frame coordinates before final runtime integration; Naruto's anchor is the only new override recorded here. The approval is for the drawings, not this remaining contact-point check.
