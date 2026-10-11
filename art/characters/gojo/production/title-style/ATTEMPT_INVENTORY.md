# Gojo title-style candidate attempt inventory

As of 2026-10-11, all 42 animation names have versioned assembled candidates and all three UI names have candidates. “Rounds” counts title-style generation rounds per asset (an A/B pair is one round). Land had one initial round plus three corrective image-generation calls; one of the latter was unsaved. Older approved art versions are excluded. All listed latest candidates still require user review.

The latest quantized pack is `pack-all42.txt`: exit 1, 17 scale-gate holds, no updated atlas. A “head pass” here is only the automated head gate; it does not certify anatomy, motion, contact zones, or clipping.

| Asset | Latest candidate | Generation rounds | Current hold or note |
|---|---:|---:|---|
| idle | v06 | 1 | head gate passes; full frame QA pending |
| run | v08 | 2 | head pass; repeated leg lead |
| dash | v06 | 1 | head gate passes; full frame QA pending |
| backDash | v04 | 1 | head gate passes; full frame QA pending |
| superDash | v06 | 1 | head pass; 7px right clip |
| jumpSquat | v04 | 1 | manual scale pass, user review pending |
| jumpUp | v04 | 1 | head gate passes; full frame QA pending |
| jumpFall | v04 | 1 | head gate passes; full frame QA pending |
| land | v06 | 4 | head pass after fit; 3 correction calls after v04 |
| light1 | v05 | 2 | head gate passes; full frame QA pending |
| light2 | v06 | 3 | head pass; 3 rounds used |
| light3 | v03 | 1 | scale-gate hold |
| light4 | v06 | 2 | head pass; B stitch x0.7965 |
| heavy | v04 | 1 | gate hold; elbow reads fist |
| airLight1 | v05 | 1 | scale-gate hold |
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
| getup | v03 | 1 | gate hold; 4 visible poses vs 5 |
| charge | v07 | 1 | head gate passes; full frame QA pending |
| throw | v03 | 1 | scale-gate hold |
| beamCharge | v03 | 1 | head gate passes; full frame QA pending |
| beamFire | v04 | 1 | head gate passes; full frame QA pending |
| vanish | v03 | 1 | scale-gate hold |
| stagger | v03 | 1 | head gate passes; full frame QA pending |
| ko | v05 | 1 | gate hold; original pose, Claude adjudication |
| special | v03 | 1 | scale-gate hold |
| intro | v03 | 1 | head gate passes; full frame QA pending |
| taunt | v04 | 1 | head gate passes; full frame QA pending |
| win | v07 | 1 | head gate passes; full frame QA pending |
| specialForward | v05 | 1 | scale-gate hold |
| specialUp | v03 | 1 | head gate passes; full frame QA pending |
| specialDown | v03 | 1 | scale-gate hold |
| superPose | v04 | 1 | scale-gate hold |
| ui_portrait | v02 | 1 | visual candidate; not approved |
| ui_cutin | v02 | 1 | visual candidate; not approved |
| ui_select | v02 | 1 | visual candidate; not approved |

The source separation or part-scale retry cap is reached for light2 and airLight3. Land's corrective round is also exhausted. Other 17 gate holds and visual issues need targeted QA and corrective decisions before more generation. The original down/KO pose geometry remains a Claude adjudication hold, not a manual pass.
