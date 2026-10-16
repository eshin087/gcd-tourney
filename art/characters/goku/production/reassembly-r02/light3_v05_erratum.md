# light3 v05 measurement and clipping erratum

The immutable `raw/_qa_hold/light3_v05.json` says factor 0.530 is an approximate median. Recorded source ratios are 0.5573, 0.5070, 0.5115; the exact median is 0.5115. The saved factor 0.530 is a chosen value inside the spread, not the median.

The immutable raw `light3_v05.png` is 7×256 by 256. Frame 4 (zero-based) has scaled output y=-11..239; 11 rows at y=-11..-1 were clipped by the canvas. It must not be treated as preserving all pixels. The companion `light3_v05-uncropped-roomy.png` is 7×256 by 272, pivot [128,260], preserves the full resampled subject and is diagnostic only. Both remain HOLD because source frame 2 has a severed rear arm and detached hand fragment.
