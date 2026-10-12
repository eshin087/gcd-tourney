# Title-style draft v01 — review only

User asked to restore the original art direction, use the title's Naruto/Killua look, apply that style to Sasuke/Gojo, and review an initial draft before all frames. Four separate built-in generations create neutral/combat concept sheets; no canonical animation was generated or replaced.

Identity: Naruto/Killua follow the approved title art. Sasuke uses historical approved model v01; Gojo historical approved model v03. The current fixed models are deliberately not the style anchors for this new user direction.

Attempts: Naruto 1/3, Sasuke 1/3, Killua 1/3, Gojo 2/3 including transparent-background cleanup. Only selected images are versioned. Gojo's source RGB contains haze behind alpha-zero pixels; transparency inspection confirms the review render has no visible background haze. Source alpha is preserved; review-cell preparation uses ordinary alpha thresholding and nearest-neighbor sampling. Source pixels are not anatomically edited by code.

Layout: 256px review cells with soles at y240. The neutral establishes one uniform source-to-review scale per character, reused unchanged on the combat pose. A common 236/238 fit factor keeps the tallest figure inside the cell. No independent x/y scaling or combat-pose height fitting. All bounds stay inside the cell. Source crown landmarks have ±12px uncertainty, approximately ±3px after reduction.

Final standing occupied heights: Naruto205, Sasuke209, Killua186, Gojo236px. Fighting poses:165,180,146,214px respectively. The different stance heights reflect pose, not a frame-specific resize. Killua's visual reduction is an explicit proposal for approval, roughly10% below Naruto's body length, and is not represented as exact canon stature. It addresses the user's observed near-equal-height issue. This choice supersedes prior physical-ratio directions only if the user approves the draft.

Visual inspection: recognizable faces/costumes; natural clothing volume; similar teenage builds for Naruto/Sasuke; smaller youthful Killua; tall lean Gojo. The guard poses are concept keys, not a claim of transition continuity, combat contact, or animation timing. All eight poses are inside their cells. Source detail is smoother than final native pixels; both source and game-size layouts are shown so the user can assess it.

No character packer run applies to these non-animation reference studies. They are not promoted into fixed reference filenames, game atlases, or approvedVersion fields. Existing runtime issues are not claimed fixed. Once the user approves the visual direction, a real idle/guard pack and same-depth game check are required before full production.

Production rollback/release remains Claude's responsibility. The latest fallen-pose candidates down06/ko07 are rejected separately on their own branch; this study does not alter fallen poses.

Validation: production build passed through the documented local Vite adapter. Browser loaded all six initial images; fighting-stance image loaded after switching; standing/combat and 1x/2x controls work; zero console errors. Standing and combat native lineups plus the displayed page were visually inspected. See PR for committed preview. Source prompts: PROMPTS.json. Current runtime audit and target rationale: BRIEF.md. Reproducible review-cell layout: compose.mjs and measurements.json.

Gojo attempt 2 prompt: background-extraction edit of the first two-view sheet, preserve both character drawings, faces, costumes, positions, scale and poses; remove black/blue haze and all halos, use true transparent alpha including gaps between limbs, no other changes. The generated alpha was inspected separately from hidden RGB before selection.
