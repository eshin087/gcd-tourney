# shockRing v01 — call 2 edit prompt

Use case: precise-object-edit
Asset type: HD pixel-art VFX sprite sheet for a fighting game
Input image: Image 1 is the existing six-frame shockRing contact sheet. Preserve it as the source; this is a technical cleanup edit, not a redraw.
Primary request: Keep the six frame shapes, sizes, positions, and order exactly as they are. Remove the thin black grid divider lines between cells. Make the entire background one perfectly uniform exact #FF00FF magenta. Convert only the existing effect pixels to white plus at most three exact neutral gray levels. Replace soft or noisy color variation with solid hard-pixel clusters; no anti-aliasing, gradients, transparency, or dithering. Keep the six frames in the same 3-column by 2-row contact sheet with equal square cells and no gutters.
Subject: Preserve the small tight ring in frame 0, rapid expansion in frames 1–3, and separated arcs plus small outward chips in frames 4–5. Preserve the empty center of every ring as magenta.
Constraints: Change only the background uniformity, divider artifacts, and color quantization. Do not change the force-ring silhouette, ellipse shape, frame timing/order, center position, or relative scale.
Avoid: New shapes, lost arcs or chips, filled centers, filled discs, black separators, outlines, any colors beyond exact magenta plus four neutral effect colors, blur, airbrush, gradients, dithering, text, labels, watermark.
