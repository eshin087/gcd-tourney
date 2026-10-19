# ENG-112 Goku relay #46 final5 audit

Date: 2026-10-18. Auditor: GPT-6 Astra, medium. Scope: every frame of uSmash v05 and dSmash v06 in the exact 48-color diagnostic atlas, compared at native density with approved idle02 and live ground heavy. The diagnostic manifest contains manual-QA placeholders only to inspect Goku's intentionally disabled head probe; they are not evidence and are absent from the production manifest.

- Atlas SHA-256: `6477e8a9820940826e1cf7ac94efe97ad04eee43e0ff8aba4a138aaf80013251`
- Metadata SHA-256: `f9bea0e68bc6ad6402c685513b1d1c316450493d9b59494fbe81221c009c09a4`
- uSmash v05 source SHA-256: `BC44988A2C98B8A59EDEB09A8116731F8268A30269FBEAA0E869DDD5A2B36A40`
- dSmash v06 source SHA-256: `7B153B644C424A81DC708618DC1FA4813497254A2FD0C61BB5276B3682E2CF0B`

## Findings

**HOLD — uSmash v05.** Alpha bounds across f0–f7 are 160, 161, 170, 181, 216, 181, 162, 161 px; approved idle is 213–214 px. Head, torso, boots, arms and trouser volume read substantially smaller throughout, not explained by crouch alone. The 216px peak includes the raised fist and does not establish standing stature. All frames fit x=4..251 only after a severe whole-strip reduction (reported scale 0.43902). The packed figures appear connected, but touching source groups led to split notes and the small recovery cannot transition cleanly to idle. Existing auto boxes are not suitable contacts: uSmash f3 `[149,57,38,187]`, f4 `[153,22,38,222]`, tall columns extending from fist toward soles.

**HOLD — dSmash v06.** Alpha bounds are 218, 192, 175, 153, 154, 172, 214, 217 px. Active f3/f4 occupy x=0..255, clipping both boots and failing the required x=4..251 margin. Head/hair and upper body/clothing volume look larger than idle, especially in crouched poses. Contact boxes are misplaced/incomplete: active f2 `[158,65,45,171]` covers the body during the tucked pose; f3 `[197,199,59,43]` reaches only the clipped right boot; f4 has no active hit box. Main has no dSmash comparator, so the local production strip is not treated as independently verified deployed content.

These are alpha bounds, not skeleton heights. Anatomical judgments are visual; occluded joints and projected limb lengths remain uncertain. Both candidates fail the technical bar and are retained in `_qa_hold`, unapproved, with no `scaleManualQA` pass. Static sequence inspection is not timed browser playback or runtime contact validation.
