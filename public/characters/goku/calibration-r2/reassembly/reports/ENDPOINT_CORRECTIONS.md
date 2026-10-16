# r02 endpoint corrections and withdrawals

These notes preserve the original sidecars. New records supersede only their stated endpoint readings; no source drawing was changed.

- `jumpUp`: old collar endpoint `[469,284]` was on the posterior neck region. Corrected f0 collar-center `[480,350]` to belt-center `[398,473]`; independent visible belt and both boot axes retained. New candidate is `raw/_qa_hold/jumpUp_v04.png`, exact median factor `0.257`, uncertainty ±0.06.
- `airLight1`: old f0 belt span `[206,220]`–`[291,220]` extends into pants. Corrected visible waistband `[218,213]`–`[279,213]`; collar `[278,147]`→belt `[251,212]`; boot `[150,386]`→`[132,464]`. New candidate `raw/_qa_hold/airLight1_v05.png`, factor `.546`, uncertainty ±0.07.
- `jumpFall`: v03 collar/belt points were misplaced; see existing `jumpFall_v03_measurement_erratum.md`. Corrected v04 source endpoints and output are in `raw/_qa_hold/jumpFall_v04.json`.
- `airHeavy`: old boot line `[1168,881]`→`[1175,962]` began around ankle/foot and ended in magenta. Corrected screen endpoints `[1179,838]`→`[1169,910]` (frame5 panel-local `[155,326]`→`[145,398]`). Torso/belt remain uncertain screening only; no factor is selected. See `airHeavy-measurement-hold-v02.json`.
- `launched`: old boot line `[705,396]`→`[822,447]` did not follow the lower visible boot. Corrected frame0 axis `[563,676]`→`[655,824]`; retained torso/belt screening points yield exact median `.258` for diagnostic v07, ±.07. Candidate is held for reclined pose/packed review.
- `down`: old collar and belt marks are withdrawn; neither marked the actual neck base/waistband. The visible waistband is only localized approximately at x430–456,y490–550 and does not provide two independent segments. See `down-measurement-hold-v02.json`.
- `special`: old collar was on jaw/neck side and belt span crossed the forearm/occlusion. Corrected collar `[227,145]`→`[211,201]`; confirmed visible boot `[75,356]`→`[37,418]`. Exact median `.628` for diagnostic v03, ±.07. Standard-cell candidate loses 768 nonmagenta pixels; preserved companion is `production/reassembly-r02/special_v03-uncropped-roomy.png`.
- `charge`: prior point ratios do not establish scale impossibility once reference and endpoint uncertainty are included; loop pose snap remains a concrete animation HOLD. See `charge_measurement_erratum.md`.

Uncertainty attached to source endpoints and approved-idle targets is recorded separately in each measurement JSON. These factors are candidate-specific and are not calibration approvals.
