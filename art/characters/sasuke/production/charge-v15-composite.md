# Sasuke charge v15 scripted composite provenance

- Status: raw composite candidate only; not packed, scale-gated, reviewed, or approved.
- Worktree/branch: .worktrees/art-charge-sasuke / art/charge-sasuke.
- No image-generation calls used for v15. Only v14 was used; unselected external attempt 3 was not read or used.
- Source: art/characters/sasuke/raw/charge_v14.png, 2172x724 RGB, SHA-256 CEE1E0D93999FFBC6D97358D3710A8F3B47F65CA49D64D968AF7D0468482156C.
- Output: art/characters/sasuke/raw/charge_v15.png, 2172x724 RGB, SHA-256 D9B4FB88C1B43B4499BA067CBF278E3C3CD76D8473D2CDD916D63C375CE46154.

## Composite

The source strip is six equal 362x724 cells. Frame index is zero-based; each cell begins at x = frame × 362.

1. Keep f0, f1 and f2 byte-for-byte at their original pixel values.
2. For f3, f4 and f5, copy the exact rectangle from f2 source pixels [0,520,362,724) into each target cell at [frame×362,520,(frame+1)×362,724). This stabilizes the lower shins, cuffs and sandals. Row 520 begins at the stable cuff/shin boundary in the inspected source; the moving waist panels and rope ends all remain above this cut and are untouched.
3. Sustain the f3 shout into f4 by copying source rectangle [3×362+204,225,3×362+238,258) into f4 rectangle [4×362+204,225,4×362+238,258). This 34×33 px patch contains the open mouth and its immediate edge pixels. f3 and f5 otherwise retain their source face.
4. No resampling, color conversion, feathering or alpha changes: all operations are integer-coordinate RGB pixel copies.

## Exact script used

    from PIL import Image
    src = 'art/characters/sasuke/raw/charge_v14.png'
    dst = 'art/characters/sasuke/raw/charge_v15.png'
    im = Image.open(src).convert('RGB')
    assert im.size == (2172, 724)
    out = im.copy()
    cell_w = 362
    for frame in (3, 4, 5):
        out.paste(im.crop((2*cell_w, 520, 3*cell_w, 724)),
                  (frame*cell_w, 520))
    mouth = im.crop((3*cell_w+204, 225, 3*cell_w+238, 258))
    out.paste(mouth, (4*cell_w+204, 225))
    out.save(dst, format='PNG')

## Checks and limits

- Script assertions confirmed f0-f2 are unchanged, f3-f5 lower rectangles exactly equal f2's donor rectangle, and the f4 mouth patch exactly equals f3's source patch.
- Inspected the full strip and the f3/f4 face crop at nearest-neighbor enlargement. No visible rectangular edge or discontinuity was apparent at source resolution. The lower patch begins at the stable trouser cuff/shin boundary and does not overwrite waist-cloth variation.
- This corrects the lower-leg/foot temporal repaint and the f4 closed-mouth beat. Trouser areas above y=520 and the rest of the loop have not been composited; packed playback and the requested complete loop audit remain necessary.
- No packer, public output, manifest, tracker, review queue, or commit was changed. This note does not claim strict scale pass, full loop pass, or user image approval.
