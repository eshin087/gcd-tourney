# Gojo run direction studies J/K/L v01

Date: 2026-10-15 (America/Los_Angeles). Branch: `art/gojo-run`. These are unapproved direction candidates only.

## Generation and packaging

Built-in imagegen calls: J 3/3 (first call returned no visible artifact path; second was discarded for edge clipping; third selected), K 1/3, L 1/3. See `attempt_inventory_v01.json` for captured source paths and SHA-256 hashes; `prompt_notes_v01.md` records the approved references and direction constraints.

Selected outputs are retained as `J_v01.png`, `K_v01.png`, and `L_v01.png`. The package script separates the eight complete connected figures from each source, measures one uniform scale from the approved neutral hair width, uses nearest-neighbor sampling, centers the head, and preserves the common foot pivot `[128,240]`. Every normalized study is a 2048×256 strip of eight 256×256 cells. All 24 study frames share one 48-color palette. Contact sheets place approved idle f0 first, followed by frames 0–7 at the same candidate scale. GIFs contain eight frames at 60 ms and loop infinitely; MP4s repeat that eight-frame cycle eight times at 50/3 fps (16.67 fps) and decode through FFmpeg with exit code 0. The combined comparison GIF has eight frames at 60 ms and loops infinitely.

## Scale and pose observations

The approved neutral reference has a 35 px measured white-hair width and a 236 px full silhouette envelope including hair. Candidate hair is normalized uniformly across each study; this is a direction comparison, not an anatomy or packed-atlas scale pass. Maximum posed hair-to-sole extents are J 208 px, K 194 px and L 234 px. Run lean and leg pose affect those envelopes, so these values do not certify standing-body height. Head width is stable across J and L within the measured frames. K frames 2 and 6 are about 26% wider at the hair than the neutral; no per-frame rescale was applied.

- **J:** relaxed long stride and loose near-side arm read. The far/left hand comes out of the pocket in frames 3 and 7. Frames 4–7 closely reprise frames 0–3 instead of reading as the requested mirrored second phase. The f7→f0 loop seam remains a hold.
- **K:** strong knee drive and bent near-side pump read. The hair envelope expands about 26% in frames 2 and 6. Frames 4–7 closely reprise frames 0–3 instead of reading as the requested mirrored second phase, so alternation and the seam remain unresolved.
- **L:** upright chin-high pose, bounding movement, flight and wide near-side arm read. The far hand remains pocketed in the inspected frames. Frames 4–7 closely reprise frames 0–3 instead of reading as the requested mirrored second phase, so the seam remains unresolved.

All normalized figures fit inside their cells with margins; the global source-image component check found exactly eight separated figures for each candidate. No animation packer was run because these are deliberately outside `raw/`. No production run/dash/superDash files or public character atlas changed. The manifest remains on shipped Gojo run v12 / approved v12; no approval is implied. No Astra audit, scale-gate pass, gameplay check, or production integration is claimed.

## User review

Choose J, K or L as a **direction only**. Any choice still needs a separately authorized production run strip and technical review. The current candidates have explicit cycle/pose holds above and should not be treated as finished animations.

