# Gojo `heavy` v06 scale test

Claude's relay #5 suggested a no-call 1.08x re-assembly of v05 only if every packed frame fits with crown at y >= 4. Testing bodyHeight 246 (228 x 1.08) caused the packer to cap the strip at bodyHeight 237 to preserve the 4px top margin. Therefore the requested 1.08x cannot fit. No Gojo candidate is presented for review; production remains v05 at bodyHeight228, approvedVersion5. The copied v06 source and stitch sidecar are retained under `art/characters/gojo/raw/_qa_hold/` and excluded from packing. No camera or engine change.
