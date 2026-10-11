# Naruto idle v04: new proportion baseline candidate

Model v03 approved by user and merged before this stage. Existing fixed idle remains approved v02; no remaining animation redrawn.

## Sources and versions

Part A selected attempt2/2, correcting exaggerated40px bob to tiny motion. Part B v03 selected attempt2, then final attempt3 created v04 to avoid changing any saved image. v04 A is byte-identical v03 A. Measured stitch scales A0.9902, B/A after stitch1.006. No by-eye scaling and no exemptions. Raw v03 kept as technical history and v04 is the review candidate.

## Gate evidence

Packer default quantize48 exits0. The packer intentionally labels idle 'ref' and excludes it from strict rejection, so exit0 alone is NOT an idle pass. Independent call to existing auditStrip() reports v04 'ok': median0.995, range0.082 (<0.12), all8 frames measured, no exemptions. Data-only Naruto headColors adds actual darkergold #fdb223 to the previous lightgold #fcd457. Highlight-only palette missed f6 hair extent (25px vs full35px) and reported false pop0.156. Independent old approvedv02 with bothhairplanes remains ok, range0.066. Neither palette includes skin/cloth. Both shades also appear in some orange cloth, so later raised-arm frames still require visual contamination checks. Other fighters untouched. See independent-audit.json and head detail.

The full-hair proxy new median35x19 versus old34x18 DOES NOT establish an8% hair shrink: palette distribution and different poses make that claim unsafe. Manual skull-to-chin in packedf0: inferred crown y54±3, chin y84±1, about30±4px versus28.57 target. Other frames same face size visually, crown hidden byhair. Declared upright skeleton200 unchanged; crouched silhouette202px includinghair is not direct standing-skeleton proof. No sidecar invented to force200/7. Model target stays7heads with anatomical uncertainty documented.

## Visual QA and build

Identity/design/colors preserved; compact blondhead, guardstance, black/orange costume, rightthighholster. Bothparts have smallbreathing variation, but footwidth/alignment shifts slightly and loop closure not pixelidentical. Packed palette48 colors; source AA gets cleaned/quantized. Some face/whisker detail lost at256px.

Lineup: candidate202px silhouette, SBR0.365 (73pxband) just below0.37 teenageguard minimum; guardarms contaminate shoulderproxy. DR0.31 shown bylineup is inheritedmetadata, not newlymeasured. Manual deltoid width near60±3px givesDR~0.30 withinteen0.29-0.33; MWR0.57. No claim of exact200px skull-based anatomy.

Legacy animations still old proportions; many report drift against newcandidateidle. These remain for post-idle fullredraw; fixed reference/baseline not promoted. Existing ko/down floor warnings remain. Nominal heads row staysunchanged untiluserapprovesidle.

Recommendation: review v04 idle direction/loop with model and lineup. Technical internal-head consistency passes after evidencedpalette correction; exact7heads/8%hair reduction remains uncertain. User decides whether this is the new baseline. STOP before allother41animations.
