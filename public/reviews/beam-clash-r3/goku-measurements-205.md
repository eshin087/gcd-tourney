# Goku `beamStruggle_v01` — round 4 calibration

Status: **diagnostic calibration only; strict scale and anatomy HOLD; user review not an approval**. The raw source remains in `raw/_qa_hold/beamStruggle_v01.png`.

## Bound snapshot and references

- Candidate source SHA-256: `9035EBC7B62956461469954A0ABCFA3C5CFA26FC110D76877FBC79BD551A3E98`.
- Diagnostic pack input was the held source at bodyHeight 205, factor 0.338, quantized to 48 colors. The isolated atlas is `public/reviews/beam-clash-r3/goku-atlas-205-diagnostic.png`, SHA-256 `991182A67FE71939373DB9758348465141F8C09EBED8264D7185E0A0DAC7140B`; metadata `goku-anims-205-diagnostic.json`, SHA-256 `D7FFAEACF6EB6DD07C871DE3FD193CDADEA8AC49253D385B9C41B5A6A1FE1F0D`.
- Approved title combat reference: `public/characters/goku/calibration-r2/assets/references/title-combat-v02.png` (same bytes as the inspected title-combat-v02 fixture, SHA prefix `5714F663`; verification by the independent Astra auditor). Approved `beamFire_v07` frame 93 is the second comparator. The five-cell equal-density comparison is `public/reviews/beam-clash-r3/goku-landmark-comparison-205.png`, SHA-256 `FB2F75378C9AFF9AD486225E4150548628181581789C9F1FAF77F20F6178B45C`.
- The body sheet is diagnostic, not canonical: `goku-body-205-diagnostic.png`, SHA-256 `BB52890E861BF078DD3478B28FEEFFEEBFC09F8BF949AB4BCFFE2A564A0CECC6`. Its scratch-only custom 18-shade orange palette was used because Goku has no `bodyColors` declaration.

## Manual landmarks and uncertainty

Approximate visible pixel extents were measured on the bound quantized cells by manual pixel inspection; uncertainty includes antialias-free but occluded/overlapping silhouette boundaries and pose projection. The candidate measurements are not inferred from the 256-cell bounds.

| Landmark | Approved title combat | Approved beamFire frame 93 | Candidate f0 / f1 / f2 | Interpretation |
|---|---:|---:|---:|---|
| Hair crown to chin (hair included) | 52 ±3 px | 60 ±2 px | 58 ±3 / 55 ±3 / 59 ±3 px | Candidate matches beamFire more closely. Relative to the combat estimate, candidate is about +6–13%; the uncertainty does not establish ±6% agreement with both. |
| Front boot heel-to-toe | 35 ±2 px | 45 ±2 px | 45 ±2 / 44 ±2 / 43 ±2 px | Candidate matches beamFire and is wider than the combat cell. Pose/projection differs; this cannot alone set global scale. |
| Straight forearm thickness windows | n/a | x155/165/175: 21/21/20 px | f0 x190/200/210: 19/16/19; f1: 20/17/20; f2 x195/205/215: 19/14/19 | Forward forearm is not evidence of global oversize. Astra's bulk concern is shoulder/chest construction and rear upper arm. |

The selected diagnostic factor is `0.338`, corresponding to manifest bodyHeight 205. This is a plausible compromise supported by boot and arm proximity to beamFire, but the head and boot comparisons differ between the two approved references, and the pose is a deep lunge. **No strict manual scale pass is claimed.** The prior 233 was copied from the more upright beamFire and yielded 11/12/18 px right clipping; at 205 only f2 clips right by 1 px. Do not use clipping alone to choose density.

## Contact anchor and anatomy findings

On the diagnostic quantized atlas, the connected front-hand skin-color component produced these approximate extents and centroids:

| Frame | Skin component bbox | Centroid | Estimated front-knuckle tip anchor |
|---|---|---|---|
| f0 (atlas 108) | [234,93]–[249,110] | [241.7,100.4] | [247,100] ±2 px |
| f1 (atlas 109) | [234,93]–[249,110] | [241.3,100.5] | [247,100] ±2 px |
| f2 (atlas 110) | [240,93]–[255,109] | [247.5,100.3] | [253,100] ±2 px; right edge clips 1 px |

The knuckle estimate is deliberately distinct from the component centroid: it is placed near the forwardmost knuckle pixels, approximately 2 px inside the silhouette tip. The brief's hand-anchor zone ends at x=240, so these estimates exceed that zone by approximately 7, 7, and 13 px. Do not silently move the art or substitute the centroid as a contact point. No hitbox override or contact-pass claim was added.

The independent Astra provisional inspection of these exact atlas hashes found frame 0/2 shoulder-center separation around 65–75 px versus approved combat around 48–55 px (joint ambiguity ±6–8 px); f1 narrows in the turn. This is an anatomy/projection hold, not a reason to globally shrink. Astra also found the forward arm silhouette thickness not inflated, with shoulder/chest and rear upper arm the concern. Final Astra disposition remains with the parent audit. These diagnostic findings do not approve the art.

## Strict pack result

The isolated strict command used the same diagnostic manifest and `--quantize 48`; full captured output and hash are recorded in `GENERATION_LOG.md` and the scratch folder. It exited 1 and wrote no candidate sheet or frame images. The packer reported `1 ref, 22 manual, 1 unmeasured`, because no version-bound `scaleManualQA` evidence is entered for this candidate and the known Goku head probe is unreliable. It additionally reports f2 right clipping by 1 px. Therefore status remains raw/held; the atlas and body sheet are display-only diagnostics.
