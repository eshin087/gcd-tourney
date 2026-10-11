# Sasuke corrected proportion sample v01

New reference sample only. User requested art-lead judgment and four corrected key poses before full production. Best of two built-in imagegen attempts; first was larger-headed with misplaced long front rope tails. No animation, atlas, fixed-reference, manifest, or approval state changed.

- Actual canvas1254x1254, not requested1024. Four627x627 cells: TLidle, TRguard, BLrunflight, BRclean active left-lead jab. Exact cell rectangles and measured non-magenta bounds are in the sibling measurements JSON.
- Identity: cold face, dark blue-black hair, white open shirt, navy guards/cloth/pants, purple rope and sheathed sword retained. Second attempt moves rope tails toward rear. Right-facing3/4 throughout. Active fist points right with opposite hand at chin; arm laterality should be checked closely against canonical lead side before production.
- Build: more natural long legs and compact heads than first attempt. Idle/guard share body scale; run bend/flight correctly reduces vertical bounds, jab step widens silhouette. No pose has been independently resized.
- Manual idle landmarks: inferred crown~y95, chin~170, soles~603 (uncertainty roughly8sourcepx); skull~75px, bent-pose crown-to-soles~508px. Provisional common factor200/508=.3937 yields skull~29.5px. This is close to intended28px but NOT exact7.15heads proof; hidden crown and bent legs are uncertainty. Do not normalize each pose independently.
- Hair/face scale visually similar across four poses, with guard obscuration and run head tilt. Run hair reads slightly larger/broader than idle; about5-10% visual uncertainty. Groundedtopfeet both~607; bottomjab~1202; runlowesttoe1153naturally airborne. These differ from requested480/992 because generator returned1254canvas.
- Technical: generator retained anti-alias/palette excess and near-magenta variations. Raw sample has not been quantized or packed and is not production-ready pixel art. No scale-gate pass claimed for a four-pose reference sheet.

Recommendation: useful coherent direction sample for the cast comparison; assess head/body balance and run consistency before committing to all42animations. Exact prompt is saved beside this file. Stop here for user review.
