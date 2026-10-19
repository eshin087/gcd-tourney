# ENG-112 Goku redraw follow-up: exact diagnostic atlas audit

Date: 2026-10-18. Auditor: GPT-6 Astra, medium. Scope: exact 48-color packed diagnostic atlas in `eng112-r2-selected-atlas/characters/goku/`; compare each candidate against approved idle02 at one density and inspect every frame/loop. This atlas uses a temporary manifest with placeholder `scaleManualQA` only to bypass Goku's intentionally manual head probe for inspection. Those placeholders are not evidence, must not be copied into the working manifest, and this atlas must not ship.

Atlas SHA-256: `0C3A9A8930508009DC58F498218261FBC4604EEB2D0745DB58E8886079A90E37`  
Metadata SHA-256: `6C5CC6C5F80B2664A3DF3841451A9883C3B7778BA9D9EDDF10199C02BC3BB032`

| Move | Candidate | Atlas cells | Findings | Contact box suggestions for diagnostic cells | Verdict |
|---|---|---:|---|---|---|
| uTilt | v03, attempt 3 | 118–124 | HOLD. Guard silhouette is about 176 px tall versus idle's 213 px; head width 44–47 px versus 53–56 px. The overhead fist fits, but scaling up risks clipping it. No separate color-boundary or disconnected-limb defect. | f3 `[131,47,20,20]`; f4 `[131,23,21,20]` | Technical HOLD |
| uSmash | v03, attempt 3 | 147–154 | HOLD. Head width about 42–46 px versus idle's 53–56 px; face, arms and torso remain visibly smaller through the strike and guard. | f3 `[141,55,22,22]`; f4 `[146,23,22,22]` | Technical HOLD |
| dSmash | v03, attempt 2 | 155–162 | HOLD. Hair width about 69–71 px versus idle's 53–56 px, with visibly enlarged upper-body volume. Active f3 is a bent, foreshortened left kick; f4 is a clear rightward boot, so a bilateral sweep is not clear. Frame 2 alpha bounds x=4–252 inclusive (249 px wide); no translation alone preserves a 4 px margin on both sides. Attempt 3 is closer in proportions but all extended kicks point right. | f3 `[76,188,43,50]`; f4 `[193,195,50,43]` | Technical HOLD |

Uncertainty: head-width reads ±2–3 px; clothing-covered torso and limb endpoints about ±5–7 px. Hidden knees, hips and skull portions are not held solely for being occluded. Contact boxes above are audit suggestions only, not working hitbox overrides: the candidates are held and no shipped contact data was changed. The round's three calls per move are exhausted. User image/design approval remains separate from this technical audit.
