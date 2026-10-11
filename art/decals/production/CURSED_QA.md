# Cursed decal correction QA

**Approval update, 2026-10-11:** the user approved all six versions shown in the linked preview and accepted the listed visual deviations. Older unapproved/do-not-approve language below records the pre-approval assessment. Pixel defects remain unchanged; approval does not mean they were technically repaired. Rejected v01/v02 history is preserved and there are no other pending versions of these six assets.

2026-10-11, PR54, art/decals-cursed. All six names remain **unapproved**; approvedVersion is null. Claude remains integration coordinator. This is a review-only candidate delivery, not a claim that every brief gate passed.

## Versions and selection

- erasure v02: third attempt, narrower double rim and faint inner ring restored.
- erasure_trench v02 A/B: attempts 2/3, taller open-ended channels; B now close to 2:1.
- crush_implode v03 A/B: third attempts. v02 was saved and fresh-source QA still failed; preserved as rejected history. Coarser boundaries and central rubble retained.
- gouge_repel v02 A/B: attempts 3/1. Other B retries lost required cut counts, so rejected before filing. Selected fans have 5/8/5/7 cuts; no part exceeded three attempts.
- fracture_cursed v03 A/B: attempts 3/2. v02 fresh-source warning prompted coarse-edge correction. A now six straight primary cuts rather than circular crack lines; B pale flat centers replace pits.
- fracture_cursed_big v02: attempt 2, three/four internal circular cuts and eight/twelve radial rays. Thin outer tips extend beyond fill.

Every previously filed v01 and failed v02 source is retained under raw/_rejected/. No fixed approved style sheet was created. Sources still contain generated AA/texture and are not claimed to meet strict raw palette requirements.

## Fresh source pack and measurable gates

[Final source report](pack-final-source.txt) imports raw sources for all six names, not cached frames. Exit 0; six names, twenty variants; single 2048x1280 page. Counts 3/3/4/4/4/2. Packed colors 24/23/24/24/24/24; every alpha value is binary. No count, clipping, tiling-gap or hot-key-missing warning.

Two warnings remain: crush_implode **0.6%** and fracture_cursed **0.2%** magenta/pink/purple before quantization. Post-pack scan finds **283 pink pixels** in implode; fracture has zero after quantization. This distinction matters: quantization does not erase the source warning or make implode ready for approval. [Metrics](qa-v02/metrics.json), [contact](qa-v02/final-contact.png).

Only repel uses sidecar tolerance180. A default72 comparison and 180 comparison were inspected; fan/rubble silhouettes survive. Additional chroma-eligible source pixels: A11792/B21387, **zero** with the ordered brown palette relation R>=G>=B. Packed repel has zero pink pixels. Tolerance220 was tested and rejected because speck loss increased and warnings worsened; no source uses it. Packer warning thresholds and alpha policy are unchanged. Ordinary source cleanup, no exemption.

Hot pixels: erasure8806, trench14277, repel464, fracture757, big192; implode0. Repel has **300 hot pixels beyond the left quarter**: the brief's origin-only hot placement is still not satisfied, principally selected B. Its fan proportions are also narrower in the packed cell than the intended broad2:1 fan. This remains a redraw gate, not an accepted exception.

## Visual caveats

- Erasure circles and narrower double rim read clearly; generated source canvas remains wider than requested and ring pixel symmetry is imperfect.
- Trench ends are open and packed full width, no tiling-gap warning. A/B rim thickness differs; human review of long repeated paths remains useful.
- Implode: inward spirals/central rubble improved, but pink pixels, raised-looking slab facets and dense outer detail remain. **Do not approve as clean.**
- Repel: count-valid selection retained, but origin-only white and exact proportions remain failures. **Do not approve as clean.**
- Fracture: centers flat, angular web and straight primary cuts improved; outer filled discs remain too solid in places and source fringe warning remains.
- Big fracture: required ring/ray counts now present; outer tips improved, but filled circular boundary is still conspicuous.

## Delivery checks

Gallery copies normal packed atlas/pages byte-for-byte to public/art-review/decals-cursed/candidate. It filters cursed entries and loads each entry's actual page. The review-only helper installs preloaded candidate images in the embedded game instance; it changes neither approvals nor production assets. No dependency on ignored /preview files. Production build and hosted show/rotate results are recorded in the PR handoff after publication.

## Approved-only production pack

User-approved versions packed on 2026-10-11: 6 names, 20 variants, one 2048x1280 page. Production PNG is byte-identical to the reviewed candidate page: **0 changed pixels**; decal entries are identical, only atlas source metadata changes candidates to approved. Normal pack reports the known packed implode fringe as 0.3%; earlier fresh-source 0.6%/0.2% reports remain historical evidence, not repaired warnings. Build passes80modules. [Exact verification](approval-verification.json), [approved pack](pack-approved.txt). Root Codex is now user-appointed coordinator for these three PR merges; worker performed no merge or production deploy.
