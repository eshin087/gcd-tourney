# Naruto four-pose sample v01 — needs user review

Scope: new reference sample only. Built-in imagegen, three attempts, third selected. No animation, atlas, fixed-name reference, manifest, approval or shared tracker changed. User's new art-lead judgment instruction supersedes earlier guard/dodge preferences for this sample. Prompt and edit history: [proportion_sample_v01_prompt.md](proportion_sample_v01_prompt.md).

Source: [proportion_sample_v01.png](proportion_sample_v01.png). Actual **1254x1254**, not requested 1024x1024. Four source cells are exactly `[0,0,627,627]`, `[627,0,627,627]`, `[0,627,627,627]`, `[627,627,627,627]` as x/y/width/height. Pose order: idle, cross-arm guard, airborne forward run, lead-left light1 jab. Right-facing three-quarter identity maintained. No text, effects or ground shadows. Preserve this untouched source.

## Visual anatomy observations

The third attempt improves head/body balance over the first two while retaining long athletic legs and a compact torso. Hair/face masses appear consistent between poses; run has forward tilt and punch has torso twist. Upper/lower limb lengths appear plausible and consistent, with bent run knee and guard forearms producing genuine foreshortening. The run's rear hand is more open/long-looking than idle's closed fist; hand-shape consistency merits user attention. Jab fist is normal-sized, extended toward screen-right. The active lead-hand choice reads as the farther arm across the shoulder line, though overlapping sleeves limit certainty.

Independent visual landmark estimates in actual source pixels, not claims of exact compliance:

| Pose | Estimated skull crown | Chin | Skull height | Notes |
|---|---:|---:|---:|---|
| idle | y116 +/-6 | y181 +/-3 | 65 +/-9 | Crown inferred beneath hair; soles y562 +/-2; occupied crown-to-sole446 +/-8. |
| guard | y116 +/-6 | y181 +/-4 | 65 +/-10 | Jaw partially obscured by fist; tilted face. |
| run | y709 +/-7 | y777 +/-4 | 68 +/-11 | Tilt makes vertical span a rough proxy, not anatomical head length. |
| jab | y711 +/-7 | y778 +/-3 | 67 +/-10 | Neck/shoulder overlap; compact head remains visually comparable. |

Idle shoulder-joint span is approximately125 +/-15 source pixels (excluding fists/outer bent forearms), close in intent to the120 target but not an exact calibrated landmark. Hair-tip-to-chin is roughly83px for idle; do not substitute it for skull height. Idle's crouch means446px crown-to-sole is **not** a measured upright400px skeleton. A possible uniform normalization factor `400/446 = .897` would normalize this pose's occupied height, not prove the standing-height target. The lead should not label it a validated200px standing figure from that factor alone. Any review gallery normalization must use one declared common factor for all four poses; never scale individual poses to fill cells.

## Technical limits

PNG inspection:1254x1254, **95,061 distinct RGBA values**, corner RGBA `[240,13,242,255]`. It is a near-magenta illustrated source with edge/color variation, **not** pure#FF00FF, <=48-color production pixel art, or verified aligned2x2 pixel blocks. Actual top soles abouty562 and bottom grounded soles abouty1171 also differ from prompt y480/y992. No source processing was used to conceal these deviations. Exact requested skull57px/skeleton400px targets remain unproven.

Recommendation: review the **natural compact-head/athletic-body direction** across all four poses in the cast lineup. Do not approve it as a pack-ready animation or as proof of exact metric compliance. Stop here for sample review; no further generation until direction is decided.
