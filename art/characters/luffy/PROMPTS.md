# Luffy: image prompts

This work is at reference step 1 only. The title-style candidate is pending user review; do not generate later assets before approval. Candidate inventory and source provenance are in `reference/notes.md`.

## Title-style neutral + combat reference

Save as `reference/title_style_draft_vNN.png`. Attach no copyrighted source images. After generation, place neutral and combat cells beside the exact four approved neutral cells in `public/art-review/title-style-pilot/` at equal displayed density; review the resulting lineup before model sheet or idle work.

```text
Create a serious anime fan-art sprite reference for a young, lean, wiry male pirate from the Enies Lobby era. He has messy short black hair, dark eyes, a small scar under his left eye, an open red sleeveless vest, blue knee-length shorts with white rolled cuffs, a yellow sash, brown straw sandals, and a straw hat with a red band. Keep the hat on his head in both poses.

Show exactly two full-body poses of the same character, each in a separate 256×256 cell at common pixel density. Left: relaxed but alert neutral stand. Right: compact combat stance, knees bent, hands raised, cocky focused face. Both face screen-right in 3/4 view. Preserve identical head, torso, limb lengths and wiry build between poses. Keep hair and hat mass separate from skull and body measurements. Use the approved title-style anime anatomy and visual finish as seen in the attached approved cells; do not imitate their characters or costumes.

Native cell is 256×256, pivot [128,240], grounded soles near y=240. Cell geometry is a production constraint, not a numeric body-height target. The candidate must be measured against the four exact approved cells at equal pixel density; the pilot does not establish pixels/cm. Do not apply old 200 px, 31 px head, 6.5-head ratio, historical pixels/cm or any added child discount.

Hard-edged high-detail pixel art, selective dark outline, discrete cel-shading bands, no antialiasing, blur, gradients, dithering or semitransparent edges. Restrained palette: skin #9b5b43/#c77b58/#e6a27a/#f3c29a; hair #17151b/#29252b/#40363a/#62504a; vest #762b25/#b83c32/#e34c3d/#f4775c; shorts #183b68/#285a91/#3979b8/#68a2d3; sash #a96c16/#d99b25/#f0bd43; straw #6e4325/#a86a32/#d39a50/#f0c978; white cuffs #a8a8a6/#e1ded4/#fff5df; outline #211a20. Flat #FF00FF background. No text, aura, steam, motion lines, ground shadow or additional figures.
```

## Later steps

Model sheet, expressions and animation prompt blocks are intentionally not authored until this reference lineup is approved and its landmarks are measured. Use the canonical animation names and counts from `art/manifest.json`; kit-specific pose guidance is in `ANIMATIONS.md`.
