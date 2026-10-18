# Sasuke `beamStruggle` v03: technical hold

This is a no-call packing calibration, not an image approval. The approved v01 remains the shipped reference. Candidate v03 is retained as a diagnostic comparison while the intended sash-width endpoints are clarified; it is not cleared for production or user approval.

## Sources and version history

| Artifact | SHA-256 | Role |
|---|---|---|
| `art/characters/sasuke/raw/beamStruggle_v01.png` | `00ADE94028B861DE74CE8095B5644A75D0AA5106013D4B55764B0045FDB993F1` | Approved raw source; unchanged |
| `art/characters/sasuke/raw/_qa_hold/beamStruggle_v03.png` | `00ADE94028B861DE74CE8095B5644A75D0AA5106013D4B55764B0045FDB993F1` | Candidate raw; byte-identical copy, no redraw; technical hold |
| `art/characters/sasuke/raw/_qa_hold/beamStruggle_v02.png` | `48A3E60551671AEABF0DE8D54651BB4EE737F53FEE625F4F46C0B0ECCB9900A9` | First saved v02 prototype; held |
| `art/scale/size-r6/diagnostics/beamStruggle_v02-second-pass-internal-background.png` | `8BE8C8BD6D828BB9598D13D317BDF671178678B6E4CED730209DE8EBE415BF42` | Preserved prototype |
| `art/scale/size-r6/diagnostics/beamStruggle_v02-upsized-source-prototype.png` | `D8CF9217D44B3440FFD6E64FB8E1E7C7BA5CD0ECB6E5AA200274EF93483BEC0A` | Preserved prototype |
| `art/scale/size-r6/diagnostics/beamStruggle_v02-bytecopy-reassembly.png` | `00ADE94028B861DE74CE8095B5644A75D0AA5106013D4B55764B0045FDB993F1` | Preserved byte-copy attempt |

The v02 label was reused during the diagnostic sequence. All four byte artifacts are preserved, with the first saved v02 held under `_qa_hold`; none is approved. v03 is the next distinct raw version. The packer calibration changed only the manifest `bodyHeight`; the raw v03 bytes were never edited.

## Packed comparison and measurements

The comparison grid at [sasuke-beamStruggle-v03-coordinate-grid.png](diagnostics/sasuke-beamStruggle-v03-coordinate-grid.png) uses the current packed atlas SHA-256 `F986CBDC5E9B1D48EF0B125DEB00CA4B71D4D200EEABE06D5464D456D23188BB` and shows idle f0, approved combat, then v03 f0-f2, at 3× nearest-neighbor density with 32-pixel cell grid lines. The matching `beamStruggleAir` strip appears in the adjacent air grid. Per-frame paired crops are under `diagnostics/`.

At `bodyHeight: 146`, visual crown-including-hair to chin readings are approximately 39-43 px across v03 f0-f2; idle f0 is about 41 px. Endpoint uncertainty is ±2-3 px because the head is tilted and the sleeve/head palette overlaps. This does not demonstrate a repeatable head-size error above uncertainty. The automatic head probe is unsuitable: it reports H≈1.15 because the extended navy sleeve shares the hair palette, so the frame exemptions remain diagnostic and require manual segment evidence.

The sash-band reading is not resolved. On the packed atlas, the largest connected component of the declared purple sash palette measures 46 px horizontally on idle f0 (bbox x85-130, y142-178); v03 spans about 38-42 px by frame when that same connected-component rule is applied. The sash fragments, overlaps its tails and turns in the pose, so connected-component bounds are not homologous belt endpoints. Row scans also produce different widths when the loose tails are included. The required 44-48 px sash target therefore cannot be called met or failed from these endpoints. Claude needs to annotate the intended belt-width landmarks on the approved idle/combat cell and each beam frame before this can become a pass.

The independent body-color proxy is advisory only: at `bodyHeight: 146`, B is 0.84 with per-frame values 0.84, 0.84, 0.96; head-probe median is 1.15. Neither measurement resolves the sash endpoints. Arms, leg chains and shoes were not certified by this calibration. No scale-manual-QA pass is claimed.

## Packer and production status

`node tools/pack-sprites.mjs sasuke --quantize 48` emitted 44 animations / 181 frames, 4096×3072, 48 colors, and a COMPLETE candidate atlas at bodyHeight 146 while a provisional diagnostic exemption was active. That atlas is preserved only as an inspection source in the paired grids; the working `public/characters/sasuke/` atlas is restored to the approved baseline. Do not ship the diagnostic atlas. Manifest v03 remains `version: 3`, `approvedVersion: 1`, with manual QA pending; the approved version is unchanged.

The static comparison/player is [the technical review page](../../../public/reviews/size-r6/sasuke-beamStruggle-v03/index.html). It includes approved idle, approved title-style combat, old packed v01, and candidate v03 frames with a frame control. It is explicitly a technical hold, not an approval request.
