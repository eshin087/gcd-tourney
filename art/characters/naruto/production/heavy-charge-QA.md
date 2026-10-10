# Naruto heavy v07 and charge v04 — correction QA

Identity: approved short blond spikes, whisker marks and orange/black Shippuden costume retained. Approximate31px skull calibration uses recorded source landmarks (+/-4sourcepx uncertainty). Body heights, phases and timing are unchanged.

Heavy: isolated f3/f4 arm repairs each used three imagegen attempts. Visible fist-local boxes are f3[186,73,14,15] (center193,80), f4[158,21,16,19] (top21). This fixes the old high/short contacts. f7 reuses the approved idle f0 pixels: measured alpha difference0, identical bounds/foot location. v07 reassembles the unchanged v06 full strip with the exact requested five-frame A / three-frame B parts. v06's4/4 assembly and earlier art candidates remain archived and rejected.

Remaining heavy pose caveats: f3 forearm is less vertical and elbow less bent than the specified90degrees; f5 has both knees bent instead of the more extended hanging peak requested. The coil silhouette is161px including hair (brief approximate165–175); the recovery is204px including hair, exactly equal to approved idle. User review should include these deviations; contact/recovery fixes do not establish every pose gate passed.

Charge: best of three targeted imagegen registration edits preserves stronger chest/shoulder expansion and mouth/tail motion. Literal identical feet were not achieved. Bottom15px foot spans are125,120,119,114px; left extents69,71,71,75 and right193,190,189,188. Soles remain y240 in allframes. This is a failed feet-registration gate, not a passing loop. F3 is visibly narrower/smaller; approximate skull calibration cannot certify perfect limb consistency.

Technical: all42animations/175frames present; atlas48colors, binary alpha. Touched strips have no clipping/margin warnings. Whole-character strict returns1 solely for existing approved ko f0 margin(left4/right2). Original source and quantized reports are saved. Cast lineup's Gojo build flags are baseline, outside Naruto scope. No vertical offsets or engine lift painted into source. Final build and repack reproducibility checked. No gameplay numbers changed; hand boxes follow visible fists.

Recommendation: heavy is materially improved but exact elbow/peak posture deserves review; charge needs further correction before approval. No approvedVersion or fixed-name reference changed. Hosted candidate gallery includes these actual versions, raw art, packed playback and lineup. Browser evidence is recorded in the PR handoff.

Hosted browser verification: candidate gallery images loaded3/3, frame stepping worked, no console errors. Test lab loaded Naruto custom sheet42animations. Heavy launched Killua (67damage); paused uppercut peak was inspected. Charge exercised through frame27, no console errors. This is browser evidence, not physical-phone validation.
