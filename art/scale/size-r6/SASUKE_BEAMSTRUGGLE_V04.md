# Sasuke `beamStruggle` v04 calibration

This is a no-call re-assembly for scale review. It changes no pose, anatomy, or source pixels and does not approve the art.

## Calibration and provenance

Claude's calibration instruction arrived in art-camera relay #4: v01 was about 20% small; the head probe included the outstretched navy sleeve because that sleeve uses the hair palette. The two independent landmarks agreed: crown-to-chin about 31 px versus the idle's 40 px, and front sash band about 37 px versus 46 px. Claude directed an approximately 1.25× no-call re-assembly, per-frame probe exemptions, and version-bound manual QA.

The v01 raw SHA-256 is `00ADE94028B861DE74CE8095B5644A75D0AA5106013D4B55764B0045FDB993F1`. v04 is byte-identical to that source; packed `bodyHeight` changes from 122 to 152 (1.246×). The existing held v02 prototype and v03 byte-copy remain preserved and untouched; v04 is the next unused version under the no-overwrite rule.

## Packed landmark verification

At equal 256 px cell density, the packed v04 frames were compared with approved Sasuke idle f0 and the approved title-style combat cell. The corrected landmarks match Claude's target:

| Landmark | Idle f0 | v04 f0 | v04 f1 | v04 f2 | Uncertainty / disposition |
|---|---:|---:|---:|---:|---|
| Crown including hair to chin | ~40 px | 39–41 px | 39–41 px | 39–41 px | Head tilt and sleeve overlap; about ±2 px. Within target. |
| Front sash band width, excluding ties and tails | ~46 px | 44–48 px | 44–48 px | 44–48 px | Pose/perspective; about ±2 px. Within target. |

The head probe remains invalid for this strip because it captures the navy sleeve. Manifest `scaleExemptFrames` covers f0-f2 and `scaleExemptVersion` is 4; `scaleManualQA` is bound to v04. The manual result is a scale QA pass only. Limb-chain proportions, contact, pose quality and user art approval remain separate.

## Pack and review evidence

`node tools/pack-sprites.mjs sasuke --quantize 48` completed 44 animations / 181 frames into a 4096×3072 atlas at 48 colors. It reported 1 reference, 32 automatically measured strips and 11 manual strips; the beam probe is exempted for v04. Existing unrelated scale and lying-frame warnings remain listed in the pack output. The generated head report has no flagged strip; the body sheet is advisory and has no flagged strip. The lineup was generated at `art/scale/size-r6/lineup-sasuke-beamStruggle-v04.png`.

The equal-density old/new comparison and playback page is [Sasuke beamStruggle v04](../../../public/reviews/size-r6/sasuke-beamStruggle-v04/index.html). Packed atlas SHA-256: `1365C56FEF7617875F7B61B89D209287488D27275BA19FAB95D00C2B910BD7EE`; metadata SHA-256: `61A18CD8D31BBD2BC88A27B5B1288E28E04F4B2B0A03116A3B27073A3F101410`. Candidate v04 is ready for the user's visual approval; v01 remains the approved version until that decision is relayed.
