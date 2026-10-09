# VFX final placement touch-ups

Documented art/vfx/README.md frame-edit route,2026-10-09. Source raws preserved. Nearest-neighbor fitting of existing cleaned shapes; canonical palettes and alpha preserved. Ring frames fitted to EFFECTS.md dimensions; streak frames fitted to prescribed heights and rising bottoms. Packer consumes these intentional frame edits.

- ring#0: fitted 32x18, origin 48,55
- ring#1: fitted 50x28, origin 39,50
- ring#2: fitted 68x38, origin 30,45
- ring#3: fitted 84x46, origin 22,41
- ring#4: fitted 102x56, origin 13,36
- ring#5: fitted 120x66, origin 4,31
- streak#0: fitted 4x12, origin 62,109
- streak#1: fitted 8x59, origin 60,58
- streak#2: fitted 8x88, origin 60,25
- streak#3: fitted 8x88, origin 60,21
- streak#4: fitted 6x59, origin 61,46
- streak#5: fitted 4x12, origin 62,89

## Independent verification (w11, 2026-10-09)

Opened all 12 current ring/streak frame PNGs and measured every visible pixel. All dimensions and origins listed above match the actual opaque bounding boxes exactly. All 12 corresponding cells in `public/vfx/atlas.png` match their source frames byte-for-byte (zero RGBA differences); atlas metadata assigns ring row 2 and streak row 11, six frames each.

- Ring: sizes 32×18, 50×28, 68×38, 84×46, 102×56, 120×66. All centers are (63.5,63.5), with at least 4 px outer clearance. This resolves the prior final-height caveat and matches the specified ellipse dimensions. The open ellipses and final broken dashes remain recognizable; nearest-neighbor fitting introduced no severe shape damage.
- Streak: sizes 4×12, 8×59, 8×88, 8×88, 6×59, 4×12; bottoms 120,116,112,108,104,100. All centers are x=63.5. These match the prescribed dimensions and rising anchors. The bright wider segment and grow/hold/collapse progression survive the fit without clipping.
- Both effects retain binary alpha and exactly their canonical two-color palettes (ring white/#C8C8C8; streak white/#E6E6E6). No blur or new blended colors were introduced.

Placement QA passes. One separate inherited style deviation remains: the early ring frames are thin hollow outlines rather than the EFFECTS.md 12/10/7 px thick early rings (frame 00 calls for almost a filled oval). The placement fit preserves that source design; this check does not certify the prescribed line-thickness progression. Final approval remains pending; no approval or engine-loading claim is made here.
