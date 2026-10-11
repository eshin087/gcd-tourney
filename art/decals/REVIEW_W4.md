# W4 decal review

Unapproved candidates: 19 names / 99 variants. Purple fringe remains; stone facets sometimes imply upper-left lighting. Recommend targeted redraw before blanket approval. burn_lightning v02 improves fringe versus v01. Tolerance 200 damaged interiors and was reverted to 72. Claude must repack combined decal branches after integration.

All source files retain immutable versions. v01 lightning remains reviewable; v02 is recommended over it. Style was generated first and used provisionally under the explicit batch authorization; no approved fixed-name reference exists.

Packer exited 0 with 19 names / 99 variants and 19 warnings: 18 fringe warnings plus barrier_crack grayscale conversion. See [full pack report](pack-report.txt). Four candidate pages; missing chakra/cursed groups belong to separate branches. Character scale gate does not apply to ground decals.

Visual caveats: centered craters read well overall, but facets imply directional illumination. crack_s and scuff retain strongest key fringe; burn_lightning_big retains 4.7%. Tolerance 200 was tested then reverted because it created transparent holes in dark artwork. barrier_crack is grayscale in packed output; source color is converted by packer. No warnings are exempted as false positives.

- crack_s v01: 8 variants
- crack v01: 8 variants
- crater v01: 8 variants
- crater_big v01: 6 variants
- crater_huge v01: 4 variants
- fracture_ring v01: 4 variants
- scuff v01: 8 variants
- skid v01: 4 variants
- rubble v01: 6 variants
- dirt_crater v01: 4 variants
- dirt_skid v01: 3 variants
- barrier_crack v01: 6 variants
- crater_wall v01: 4 variants
- burn_lightning v02: 6 variants
- burn_lightning_big v01: 4 variants
- fracture_lightning v01: 2 variants
- burn_fire v01: 6 variants
- burn_black v01: 4 variants
- scorch_ki v01: 4 variants

Technical QA: all 99 variants match expected counts; each name has 24 packed colors and binary alpha (variant-qa.json). Production build passed using the documented local Vite adapter. Chrome game QA with ?art=custom&debug and groundDemo groups: base 9 names/56 custom variants; edge 4/17; lightning 3/12; fire 2/10; ki 1/4. All19 names confirmed custom. Newly selected page sets need a second demo click after their asynchronous load. Console warning/error capture empty. Screenshots game-{base,edge,lightning,fire,ki}-qa.png record output. Visible magenta contamination is especially obvious in scuff/skid; recommend redraw before approval.
