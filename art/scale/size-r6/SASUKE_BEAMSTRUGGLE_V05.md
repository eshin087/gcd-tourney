# Sasuke `beamStruggle` v05 calibration

A no-call re-assembly of the unchanged v01 pixels for a new user review. The original drawing is byte-identical: v01, rejected v04 and v05 SHA-256 `00ade94028b861de74ce8095b5644a75d0aa5106013d4b55764b0045fdb993f1`. No image generation call was made. v04 remains preserved under `raw/_rejected/`; v01 remains the approved version.

Claude relay #6 reports that the reviewed v04 at bodyHeight152 was too large, with template-match head ratios 1.11–1.17 of idle. Rescaling those readings by 134/152 predicts 0.98–1.03 for v05. Claude’s prior v01 template readings were 0.92 / 0.86 / 0.92 against controls 0.98–1.02; both measurement sets are included in the version-bound manifest `scaleManualQA`. The requested v05 bodyHeight is 134 (about 1.10× the approved v01 setting 122).

The outstretched navy sleeve contaminates the automated head box. `scaleExemptFrames` remains on f0-f2 and `scaleExemptVersion` is 5. This is manual scale calibration only; the drawing needs user review, and pose/contact/gameplay QA remains separate.

`node tools/pack-sprites.mjs sasuke --quantize 48` packed 44 animations / 181 frames, 4096×3072, 48 colors. Packed atlas SHA-256 `66ab3b9a3b833ffd3141fee2682d53efbc4964529e79cfd3f123c2e5022a978b`; metadata SHA-256 `bd2b8fb67e90337040dd7d5021116adc98a25fc31d83756661b6463756f94bf4`. The [v05 review page](../../../public/reviews/size-r6/sasuke-beamStruggle-v05/index.html) compares approved v01, rejected v04 and candidate v05.
