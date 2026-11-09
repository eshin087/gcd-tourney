# Derived packed-frame adjustments

The versioned raw sources remain immutable and are the source of truth. The candidate atlas reviewed at public/reviews/spell-fx-r2/index.html used these derived frame cells:

- gigantArm v02: raw frames were keyed from exact #FF00FF to alpha and used as 256px hand-made tile cells. The pre-existing v01 cells were preserved under references/gigantArm_v01/ and restored to art/vfx/frames/gigantArm/ after candidate capture.
- gigantFist v02: raw frames kept their exact 170px wrist rows x=30-78, y=43-212. The hand and effects at x>=79 were scaled vertically around y=128 to a measured 220px body. Exact packed candidate cells are preserved under references/gigantFist_v02_packed/; the active folder was removed so the production pack regenerated the approved v01 cells.
- The user has not approved the v02 or tile candidates. Manifest reviewStatus remains needs review.
