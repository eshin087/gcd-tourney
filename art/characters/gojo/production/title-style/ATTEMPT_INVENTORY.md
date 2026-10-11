# Gojo title-style candidate attempt inventory

As of 2026-10-11, all 42 animation names have versioned assembled candidates and all three UI names have candidates. “Rounds” counts title-style generation rounds per asset (an A/B pair is one round). Land had one initial round plus three corrective image-generation calls; one of the latter was unsaved. Older approved art versions are excluded. All listed latest candidates still require user review.

The latest quantized pack is `pack-after-special-v05.txt`: exit 1, 10 scale-gate holds, no updated atlas. A “head pass” here is only the automated head gate; it does not certify anatomy, motion, contact zones, or clipping.

| Asset | Latest candidate | Generation rounds | Current hold or note |
|---|---:|---:|---|
| idle | v06 | 1 | head gate passes; full frame QA pending |
| run | v09 B rejected; assembled v08 | 3 | head pass on v08; generated v09 B also repeats leg lead; source rounds exhausted |
| dash | v06 | 1 | head gate passes; full frame QA pending |
| backDash | v04 | 1 | head gate passes; full frame QA pending |
| superDash | v07 | 1 generation, 1 measured placement | head pass; 11px left offset clears right clip and cell-margin warning; native anatomy pending |
| jumpSquat | v04 | 1 | manual scale pass, user review pending |
| jumpUp | v04 | 1 | head gate passes; full frame QA pending |
| jumpFall | v04 | 1 | head gate passes; full frame QA pending |
| land | v06 | 4 | head pass after fit; 3 correction calls after v04 |
| light1 | v05 | 2 | head gate passes; full frame QA pending |
| light2 | v06 | 3 | head pass; 3 rounds used |
| light3 | v04 | 2 | measured B stitch x0.9467; head gate passes; contact QA pending |
| light4 | v07 B rejected; assembled v06 | 3 | head pass on v06; B stitch x0.7965; regenerated B remains oversize, rounds exhausted |
| heavy | v06 A rejected; assembled v05 | 3 | v05 elbow still ambiguous and head 0.93; v06 A crosses face; source rounds exhausted |
| airLight1 | v06 | 2 | head gate passes; splitter warning from touching source group, native edge QA pending |
| airLight2 | v04 | 1 | head gate passes; full frame QA pending |
| airLight3 | v10 | 3 | gate hold; 3 rounds used; B x0.7189 |
| airHeavy | v07 | 1 | gate hold; within-strip head pop |
| guard | v04 | 1 | head gate passes; full frame QA pending |
| block | v03 | 1 | head gate passes; full frame QA pending |
| hurtHigh | v03 | 1 | head gate passes; full frame QA pending |
| hurtLow | v04 | 1 | head gate passes; full frame QA pending |
| launched | v04 | 1 | scale-gate hold |
| spin | v04 | 1 | scale-gate hold |
| airRecover | v03 | 1 | scale-gate hold |
| down | v04 | 1 | gate hold; original pose, Claude adjudication |
| getup | v05 | 3 | five distinct segmented poses after measured 3+2 stitch; low-confidence anatomy hold |
| charge | v07 | 1 | head gate passes; full frame QA pending |
| throw | v04 | 2 | head gate passes; flick and anatomy QA pending |
| beamCharge | v03 | 1 | head gate passes; full frame QA pending |
| beamFire | v04 | 1 | head gate passes; full frame QA pending |
| vanish | v03 | 1 | scale-gate hold |
| stagger | v03 | 1 | head gate passes; full frame QA pending |
| ko | v05 | 1 | gate hold; original pose, Claude adjudication |
| special | v05 | 3 | head gate passes; B factor x1.1884 and A/B seam anatomy held; source rounds exhausted |
| intro | v03 | 1 | head gate passes; full frame QA pending |
| taunt | v04 | 1 | head gate passes; full frame QA pending |
| win | v07 | 1 | head gate passes; full frame QA pending |
| specialForward | v06 | 2 | B factor x0.9886, head gate passes; recoil/contact QA pending |
| specialUp | v03 | 1 | head gate passes; full frame QA pending |
| specialDown | v05 | 3 | head gate passes after v04 overshoot; source rounds exhausted; anatomy QA pending |
| superPose | v05 | 2 | head gate passes; eyes, finger sign and loop QA pending |
| ui_portrait | v02 | 1 | visual candidate; not approved |
| ui_cutin | v02 | 1 | visual candidate; not approved |
| ui_select | v02 | 1 | visual candidate; not approved |

The source separation, motion, or part-scale retry cap is reached for run, light2, light4, heavy, getup, airLight3, specialDown and special. Land's corrective round is also exhausted. Getup now has five packed poses, but its low-confidence anatomy hold remains. The ten current gate holds are **heavy, airLight3, airHeavy, launched, spin, airRecover, down, getup, vanish, ko**. The full pack writes no atlas. The original down/KO pose geometry remains a Claude adjudication hold, not a manual pass.

Per-part call budget where a corrective half was generated: run A 2/B 3 (v09 B rejected, no assembled v09); light4 A 2/B 3 (v07 B rejected, no assembled v07); heavy A 3/B 1 (v05 B copied from v04, v06 A rejected); getup first two rounds were single strips and final round A 1/B 1; light2 A 3/B 3; airLight3 A 2/B 3 (v10 A copied from v09); special A 2/B 3 (v05 A copied from v04); specialForward A 2/B 2; light3 A 2/B 2. Copied source pixels and measured placement metadata are not extra image-generation calls. These counts exclude historical pre-title-style source versions.
