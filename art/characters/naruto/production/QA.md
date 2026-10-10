# Naruto final candidate batch

2026-10-09. The user authorized all remaining Naruto production and QA, with one final approval. Model and expressions v02, idle v02 and run v03 remain approved. The 43 newest assets in `progress.json` are candidates, not approved.

## Delivered

- 40 new animation strips: the complete character now has 42 animations and 175 frames.
- 4096×2816 atlas, 256×256 cells, 16 columns, pivot [128,240], pixelsPerUnit 128.
- Portrait v01 at 96×96, cut-in v02 at 480×128, selection v01 at 384×384. UI is packed in `ui-preview`, pending fixed-name promotion after approval.
- Phone review: `/art-review/naruto/final/index.html`. Playback, speed controls, frame stepping, source strips, hit/hurt overlays, UI and approved references.
- Versioned source generations, multipart strips, correction history, cleaned frames, prompts, placement sidecars and hitbox overrides are retained.

## Verification

| Check | Result |
|---|---|
| Strict pack: `node tools/pack-sprites.mjs naruto --quantize 48 --strict --json` | PASS: 42 animations, 175/175 frames, no missing animations, zero warnings |
| Pixel integrity | PASS: exactly 48 opaque RGB colors, alpha only 0/255; see `qa-integrity.json` |
| UI pack | PASS: all three target dimensions; cut-in fully opaque, portrait and selection transparent; `qa-ui.json` |
| Source isolation | Corrected neighboring-pose fragments in light1, beamFire, airLight1/2, spin, getup, throw and specialDown; regenerated overlapping specialForward A |
| Placement | Dash, launched and special sidecars keep full silhouettes inside cell margins; manifest bodyHeight values unchanged |
| Attack boxes | heavy frame 3 and airHeavy frame 3 override broad fallback boxes with boxes around the drawn hands |
| Visual inspection | Six contact sheets and representative packed frames inspected; knockout and cut-in regenerated for suitable aspect ratios |
| Browser game | PASS: `[sprites] using custom sheet for naruto (42 animations)`; mirror match and light-attack screenshots saved |
| Review interaction | PASS: all 42 animation selections and frame-step controls exercised |
| Mobile layout | PASS at 390×844 viewport: document width 390, all images loaded, no horizontal page overflow |
| Browser errors | No JavaScript exceptions or HTTP errors during the successful run; see `qa-browser.json` |
| Production build | PASS: `npm run build` |

Windows sandbox restrictions prevented browser launch and communication with the sandboxed server. The successful browser test and build ran with the authorized escalation. Local Vite requires the explicit `index.html` review URL; the folder URL initially fell back to the game page.

## Visual limitations for the final decision

- Short compact blond hair and the orange/black Shippuden identity are consistent overall. Face detail, holster placement and apparent head size vary slightly between independently generated strips. Light3 changes the apparent kicking leg; some tucked and recovery poses appear smaller.
- Source generations include softened edges and excess colors. Packing produces a 48-color atlas and hard transparency; it does not make every internal color cluster equivalent to hand-authored pixel art. UI previews retain their own generated colors.
- Several attacks differ from the exact SPEC contact rectangles. Light1's hand is around x208–217/y80–95; light2's held punch is shorter than its impact pose. Light3/4 and aerial kicks vary in reach and height. Heavy's high fist is around x151–166/y25–43, left of its target. These are visible pose deviations, not repaired with invisible extended hitboxes.
- The Rasengan palm is higher and farther forward than the nominal engine anchor (~205,148), around x230/y110 in the impact sequence. This deserves attention during the final visual/gameplay review. Engine VFX anchoring and balance remain engine-owned; no gameplay values were changed.
- The packer still reports two informational fallback detections before applying the explicit hand-box overrides. The final report confirms both overrides and has zero warnings.
- UI cut-in is a tight eye crop; not all three cheek marks remain visible at final banner height. Portrait/select retain the full face.
- Browser mobile viewport testing is not a physical-phone gameplay or performance test. No balance soak or controller hardware test is claimed.

Recommendation: review the complete batch in motion, especially aerial transitions, high attacks and Rasengan alignment. Reply `approve Naruto final batch` or list changes. New art remains provisional until that decision.

## Integration check (Claude, 2026-10-10)

- Rasengan alignment: fixed in the engine with per-frame hand anchors (`hand` in `hitboxes.json`, ADR 0012). The orb
  forms between the cupped hands on special f0-2 (anchors ~[168,116] / [174,124] / [164,111]) and rides the palm's hit
  box on the active frames; Rasenshuriken sits on the raised palm (specialForward f0-1), shuriken leave the hand
  (throw f1-2), Rasen Cannon starts at the palms (beamFire f0-2). Checked in the browser. The short-hair design is
  unchanged (the sheet re-packed byte-identical; only box data changed).
- Reach: all kit moves connect in training; 144 CPU matches with the art packs ran without errors (ADR 0011 log run
  10-11).
