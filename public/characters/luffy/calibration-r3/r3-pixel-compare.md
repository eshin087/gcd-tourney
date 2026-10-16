# Luffy calibration r3 pixel comparison

Compared actual 19-animation public pack against audited 23-animation r2 diagnostic atlas at exact 256px cell granularity. Alpha occupancy (mask), alpha byte, and RGB of mutually opaque pixels were measured separately. No image bytes were changed by this comparison.

Old fixture: 4096x1792; current gameplay pack: 4096x1536.

- idle: 8 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 88481.
- run: 8 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 82846.
- dash: 2 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 19419.
- jumpUp: 2 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 24876.
- jumpFall: 2 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 18344.
- land: 2 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 17735.
- light1: 7 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 73799.
- light2: 7 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 73390.
- light3: 7 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 66453.
- light4: 8 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 76503.
- heavy: 8 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 65956.
- airLight1: 5 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 56536.
- airHeavy: 6 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 52881.
- guard: 2 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 18929.
- hurtHigh: 3 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 29394.
- charge: 4 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 56231.
- beamCharge: 3 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 33815.
- beamFire: 3 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 38023.
- win: 4 compared frames; mask-different pixels 0; alpha-byte differences 0; mutually opaque RGB-different pixels 49294.

Per-frame indices, durations, exact diff counts, and mask-difference bounds are in `r3-pixel-compare.json`. Differences can reflect the actual packer selecting a different 48-color palette after four held strips were excluded; this is a comparison report, not Astra certification.
