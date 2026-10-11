# Naruto model approval gate

Adds the user-requested seven-head proportion brief, model_sheet v03, measured cast lineup, and phone review page at /art-review/naruto/proportions/. Model only: approved fixed references and all animations remain unchanged; idle waits for explicit model approval.

Recommendation: request correction before approving v03. Identity and smaller-head direction read correctly, but inferred source skeleton418px exceeds400 target, raw palette has115267 colors/AA, and lineup has magenta fringe. Three imagegen attempts exhausted; second retained.

Validation: production build passed local adapter77 modules; existing Naruto pack exit0 with four inherited warnings,17 existing scale flags. Candidate is a reference, not a newly packed animation. Local browser connection timed out; images and lineup visually inspected.

Claude alone merges this branch through npm run pr -- merge art/naruto-proportions after the complete gated redraw is approved. Do not merge this model-only checkpoint.
