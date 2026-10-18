# Sasuke `beamStruggle` v04 calibration

This is a no-call re-assembly of the unchanged v01 pixels for user review. It changes no pose or drawing and does not approve the art.

Claude corrected its original hand estimate in art-camera relay #5. Template-match ratios for approved v01 frames 0-2 were 0.92 / 0.86 / 0.92 against Sasuke controls from 0.98 to 1.02. The extended navy sleeve contaminates the scale probe, so frame exemptions remain necessary. Claude directed bodyHeight 134 (122 x 1.10), replacing the previous 152 setting. The raw v04 SHA-256 is `00ade94028b861de74ce8095b5644a75d0aa5106013d4b55764b0045fdb993f1` and is byte-identical to v01.

Applying 134/122 = 1.098 to the reported frame ratios predicts approximately 1.01 / 0.94 / 1.01 of the approved idle. This correction uses Claude's template-match evidence; no second sash width measurement is asserted here. The packed v04 at bodyHeight134 is on the review page. Scale calibration is recorded separately from design approval and contact QA.

The head probe overlaps the outstretched sleeve in the hair palette, so `scaleExemptFrames` covers f0-f2 and `scaleExemptVersion` is 4. The version-bound manual QA record is in `art/manifest.json`.

`node tools/pack-sprites.mjs sasuke --quantize 48` completed 44 animations / 181 frames, 4096x3072, 48 colors; this candidate is reported as manual by its exemptions. Packed atlas SHA-256: `66ab3b9a3b833ffd3141fee2682d53efbc4964529e79cfd3f123c2e5022a978b`; metadata SHA-256: `efb737abc542febd353f0bf3ee704c9a9c37d58ffa630dafdc85bfdb89f1a757`. The page [Sasuke beamStruggle v04](../../../public/reviews/size-r6/sasuke-beamStruggle-v04/index.html) presents the candidate and controls. v01 remains approved until the user decides.
