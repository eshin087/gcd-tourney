# Sasuke exact-version probe exceptions

These are measurement exceptions, not image approvals or anatomy passes. Diagnostic masks and matching ordinary cells are in `public/art-review/sasuke-neutral-redraw/`; the yellow pixels show the declared hair palette. Dark clothing shares those colors. Coordinates below are packed 256-cell pixels. Preserve the separate manual drawing holds in neutral-redraw-QA.md.

| Candidate | Frames | Observed mistaken ROI | Evidence |
|---|---|---|---|
| jumpUp v02 | strip | Raised wrist [155,57,178,83]; actual head near [97,62,135,97] | jumpUp-mask-0.png and jumpUp-0.png |
| beamCharge v02 | strip | Raised forearm [146,26,157,52]; actual head near [94,45,140,81] | beamCharge-mask-0.png and beamCharge-0.png |
| airHeavy v03 | 1, 4 only | f1 foreground forearm [87,95,105,113]; f4 forearm [105,60,122,80] above actual head | airHeavy-mask-1.png, airHeavy-mask-4.png and matching cells |
| block v02 | 1 only | Crossed forearms join the hair component [105,79,152,125], extending below the actual hair | block-mask-1.png and block-1.png |

These exact versions use scaleExemptVersion. Future versions must be measured again. No exemption is granted for true head drift, compressed limbs, or wrong action. Original guard v02 arm-occlusion exception remains separately recorded in the manifest.

SpecialUp v03 frame4 additionally selects the overhead navy forearm above/left of the real head. Compare specialUp-mask-4.png and specialUp-4.png. Only frame4 is exempt; other frames remain measured. This is not approval of pose, height, or build.
