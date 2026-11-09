# shockRing v01 — call 1 prompt

Use case: stylized-concept
Asset type: HD pixel-art VFX sprite sheet for a fighting game
Primary request: Draw exactly six sequential frames of a shockwave ring. Arrange the six equal square frames in a 3-column by 2-row contact sheet, ordered left-to-right across the first row, then left-to-right across the second row. The cells touch with no gutters, borders, frame numbers, or labels.
Scene/backdrop: One perfectly flat solid magenta #FF00FF background filling the whole sheet.
Subject: A force ring seen from slightly above. Keep its center at the exact center of each square frame. Frame 0 is a small tight ring about one third the final width. Frames 1–3 expand quickly into a thin ellipse about 2.4 times wider than tall, with a crisp bright inner edge and two hard gray outer bands. Frames 4–5 thin out and break into separate arcs plus a few small chips flying outward. The center remains completely empty magenta in every frame; this is a line-shaped ring, never a filled disc.
Style/medium: Crisp hard-pixel HD game effect, visibly pixel clustered, shaded only in hard bands, white and two or three gray steps.
Composition/framing: Each frame has identical square framing, center anchor at pixel (128,128) after scaling, full effect contained inside its cell.
Color palette: White, light gray, medium gray, dark gray; flat magenta background only.
Materials/textures: Hard-edged pixel clusters with no soft rendering.
Constraints: Designed for a 256×256 VFX cell at 112 px per world unit, white-tinted by the game to white, blue, or orange. At most 16 colors. Preserve the transparent-looking empty center and magenta background.
Avoid: Filled ring center, solid white disc, white-filled cell, black outline, blur, airbrush, antialiasing, gradients, dithering, noise, extra decorative objects, text, labels, borders, watermark.
