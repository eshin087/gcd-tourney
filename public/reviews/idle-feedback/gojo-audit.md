# Gojo idle v08: independent source screen, 2026-10-15

**Verdict: HOLD. No image approval. No packed-atlas or numeric scale pass.**

## Scope and provenance

Inspected all eight source poses, numbered f0-f7 left to right, against the exact approved combat cell and approved idle v06. Read AGENTS.md, the title-style PRODUCTION_CONTRACT.md and main's current Gojo/Every thread inbox instructions. Worktree: `.worktrees/art-gojo-title-r3`; actual branch: `codex/gojo-run-def`.

- Candidate: `art/characters/gojo/raw/idle_v08.png`, 2172 x 724, SHA256 `6c1ec47c2c1e2b7df2d3aa6ccf2256e46dc93bdd8e426607f2990f6f963913bb`.
- Combat: `public/art-review/title-style-pilot/gojo-combat_v01.png`, SHA256 `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656`.
- Idle anchor: `art/characters/gojo/reference/idle_approved.png`, SHA256 `e1565a4392546e037cb36131c51a4f6ddd0d0c2b02b857eb5af40e5ace2c2c30`; byte-identical to `raw/idle_v06.png`.
- Coordinator reports the one extra authorized render has been spent on this candidate. This audit made zero generation calls; no further attempt is implied or authorized by this report.

## Findings across all eight poses

| Source poses | Identity and anatomy screen | Pose result |
|---|---|---|
| f0 | White spiked hair, blindfold, adult face, dark high collar/zip uniform and black footwear retained. Limbs read continuous. | Both hands hang below waist; no raised open-hand guard. HOLD. |
| f1 | Same recognizable identity and general build; no obvious sudden head or torso change. | Same lowered arms and relatively upright torso. HOLD. |
| f2 | Same identity; knee bend and clothing folds remain coherent. | Same missing guard. HOLD. |
| f3 | Same identity; no obvious limb discontinuity. | Same missing guard. HOLD. |
| f4 | Same identity and broadly consistent garment volume. | Same missing guard. HOLD. |
| f5 | Same identity and broadly consistent head/limb silhouette. | Same missing guard. HOLD. |
| f6 | Same identity; no obvious isolated anatomy outlier. | Same missing guard. HOLD. |
| f7 | Same identity; front shoe reaches the source's right boundary. | Same missing guard; source toe truncation/edge hold. HOLD. |

The approved combat cell has a bent-arm open-hand guard, a lower off-hand near the abdomen, a forward-ready torso and substantially spread feet. v08 places both arms down alongside the thighs and keeps the torso more upright. This is a different stance, not a calibration discrepancy. All eight source poses repeat that mismatch. Preserve the source and stop before calibration/packing.

Relative to the combat reference, the candidate's spread is visibly too narrow for its occupied height. Do not stretch width or fit the standing torso to the requested 210-216 px height to manufacture a numerical result. No native packed width/height or within-2-percent head claim was measured here. The raw files have different source densities; the displayed review images were resized by the image viewer, so apparent screen-pixel dimensions are not valid native measurements.

The head design resembles idle v06 and the eight source poses look broadly consistent with one another. That is only an identity screen: skull-to-chin, torso, arm chains, leg chains, shoes and clothing volume have not been certified within any tolerance. Hair obscures the crown, the collar obscures neck landmarks and the uniform obscures hip/knee joints. No source T/H estimate is needed to establish the categorical pose failure.

The final right shoe visually meets the image edge. An independent source-pixel edge probe found 24 non-magenta pixels in the final column (threshold: not R>230, G<30, B>230), including y=627; the overall range extends to y=723, so the count includes possible unrelated edge pixels. Treat this as edge contamination/truncation evidence, not a measured amount of missing shoe. It needs resolution before any later clean frame assembly.

Eight figures are present, but a still strip does not establish a correct timed breathing loop. No animation playback, loop continuity, quantized palette, 256-cell fit, pivot, contact, strict gate, browser or runtime check was performed. Source rendering retains smooth shading/edges; production hard-pixel and palette compliance remain unverified.

## Disposition

Retain v08 as an unapproved source candidate on technical HOLD. The missing combat pose is sufficient to stop; do not spend calibration work to present it as review-ready. The user must decide the next direction, and any further image call needs authorization beyond the single spent extra render. A future corrected candidate requires all-frame actual quantized-atlas anatomy/scale audit and user image approval. This source screen approves nothing.

Only this new report was written. No shared tracking rows, source images, packing outputs, references, commits or production files were changed by the auditor.
