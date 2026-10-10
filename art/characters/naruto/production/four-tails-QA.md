# Four-Tails correction QA — beamCharge v05 / beamFire v07

Identity: near-black crimson shroud, bubbling red rim, fox ears, blank white eyes and mouth, no skin/clothes or external effects. Every pose now shows four separately traceable tails. The thin beast silhouette is intentional; tail bases remain visually crowded at sprite size.

Anatomy/pose: skull-to-chin target31px; manual source landmarks are approximate (+/-4sourcepx). Tail corrections preserve the body and skull; f0/f1 pounce were curled to fit the cell, not scaled smaller. Soles/lowest silhouette remain y239 (pivot floor y240); no vertical offsets. One attempt repaired roar f0; pounce f0 took two corrections and f1 one. Preserved earlier candidates are rejected as tail-count/clipping failures.

Technical: final atlas42animations/175frames,48colors and binary alpha. Original source report and quantized report retained. No new clipping or margin warnings for touched strips; the whole-character strict check still returns1 for pre-existing approved ko f0 margins (left4/right2). Repack reproducibility and build checked for final commit. Current cast lineup shows baseline Gojo build flags, outside this Naruto batch.

The small KIT-authorized data change selects beamCharge for roar, beamFire for pounce/slams, maulPhase2, and neutral shroud tint. No gameplay values change. No assets approved or promoted. Hosted lab browser verification is recorded in the PR handoff.

Recommendation: review these repaired candidates in the gallery and the Ultimate/clash lab; four-tail count and clipping gates now pass.
