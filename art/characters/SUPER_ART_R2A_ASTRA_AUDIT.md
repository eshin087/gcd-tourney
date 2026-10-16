# Super art round 2a: Astra audit

Auditor: GPT-6 Astra, medium reasoning. Candidates: Naruto, Killua and Gojo `super_fg_v01` / `ult_fg_v01`. Compared each raw PNG with the character's approved model, expressions and idle references plus the approved title-style neutral/combat cells. Also inspected nearest-neighbor contain-fit simulations at the ADR 0035 output sizes (384x240 super foreground; 576x432 ultimate foreground), bottom-aligned.

**All six candidates remain on technical hold.** Killua's two images pass the visual identity check provisionally, but their technical issues remain. This audit is visual and source-format review; it is not an intrinsic segment measurement, quantized atlas certification or user design approval.

| Candidate | Source | Distinct visible RGB colors | Partial-alpha pixels | Astra finding |
|---|---:|---:|---:|---|
| Naruto super v01 | 1536x1024 | 237,068 | 996,757 | Face, whiskers, headband, hair and jacket broadly match identity. Required two clone silhouettes are absent; palm points toward viewer/screen-left. Hand foreshortening is not a proven anatomy defect. Soft Rasengan halo dominates the fit. HOLD. |
| Naruto ultimate v01 | 1536x1024 | 88,010 | 889,112 | Four tails, white eyes/mouth and all-fours roar read. Normal blond hair, skin, headband and orange clothing remain exposed; shroud is patchy/armored rather than continuous and bubbling. HOLD. |
| Killua super v01 | 1983x793 | 128,835 | 552,551 | Visual identity PASS: face, half-lidded blue eyes, silver hair, purple shirt, navy collar and claw gesture read. Technical HOLD: the wide source leaves the bust comparatively small at fit; hair/lightning touch the top edge; soft edges and partial alpha. |
| Killua ultimate v01 | 1536x1024 | 179,208 | 629,981 | Visual identity PASS: lean build, crouch, hooked hands, blue eyes, cuffs/hem, shorts and shoes remain consistent. No clear limb or clothing-volume defect. Technical HOLD: soft aura edges and partial alpha. |
| Gojo super v01 | 1983x793 | 52,375 | 438,133 | Adult face, cyan eyes and crossed-finger motif read. Blindfold is pushed onto forehead, not pulled down; hand is near face instead of chest height. Fitted bust is comparatively small; edge fringes remain. HOLD. |
| Gojo ultimate v01 | 1536x1024 | 143,541 | 423,739 | Lean adult figure and clothing read; required extended/open hand and opposite raised arm read. Blue appears on anatomical right hand and red/pink on anatomical left, apparently reversing the requested assignment; red reads hot pink and reflects on the character. HOLD. |

All six raw outputs exceed 48 visible RGB colors and contain extensive partial alpha, including nearly opaque interior pixels (commonly alpha 253/255), not just edge antialiasing. They are not on the specified generation canvas. Naruto and the electricity effects use smooth glow. These raw-source findings may change after packer trimming/quantization, which must be inspected separately. Fitted simulations retain source padding and alpha; actual packing may change the appearance.

No files were edited by the auditor. No candidate was approved. Full anatomy, segment lengths and contact are not measured here; energy, clothing, perspective and image framing obscure landmarks.
