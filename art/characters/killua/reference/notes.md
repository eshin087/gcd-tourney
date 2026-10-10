# Killua reference QA

## model_sheet_v01 — 2026-10-09 — approved

Selected the third of three built-in imagegen attempts. All used the S1 block without image inputs. Retry reminders corrected attempt 1's short purple sleeves; the selected image has full purple sleeves, narrow white cuffs and the white hem. Only the selected image was filed as a version.

The 1536x1024 image has five full-body views, including a true right profile with one eye, and two hand close-ups. The claw hand reads as pale nails rather than metal. Silver-white hair, blue eyes, navy rolled collar, baggy navy shorts and purple-white high-tops follow the written brief. User approved the depicted model and outfit on 2026-10-09.

Front-view standing body is approximately 600 raw pixels; estimated skull-to-chin height is 95-100 pixels, giving about 6.0-6.3 heads. The skull crown is hidden under hair, so these are visual estimates. This is larger than the prompt's 364/60 raw-pixel target. Foreground segmentation measured lowest soles at y687, 688, 688, 687, 688 across the five views; the stance's far foot is raised.

Technical deviations: 29 swatches instead of 30 (counted at y840, 845 and 850); nonuniform near-magenta background (corners RGB 242/11/241, 246/17/243, 236/32/236, 242/29/239); 38,665 distinct RGB colors in the front figure's non-magenta region, exceeding the 48-color limit. The image has a crisp pixel-art appearance but does not meet strict hard-pixel/palette requirements. No text, floor, props or lightning. Recommend technical revision before strict spec approval.

S1 is a reference image, not an animation strip, so packing and custom-sheet gameplay QA are not applicable yet. Production build passed after a sandbox EPERM retry outside the sandbox. Approved v01 was copied unchanged to model_sheet.png on 2026-10-09; technical deviations remain documented.
