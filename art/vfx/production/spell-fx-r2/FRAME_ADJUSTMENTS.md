# Derived packed-frame adjustments

The versioned raw sources remain immutable and are the source of truth. The candidate atlas reviewed at public/reviews/spell-fx-r2/index.html used these derived frame cells:

- gigantArm v02: raw frames were keyed from exact #FF00FF to alpha and used as 256px hand-made tile cells. The pre-existing v01 cells were preserved under references/gigantArm_v01/; the user approved v02 as drawn via Claude relay spells #7, and its exact candidate cells are now active in art/vfx/frames/gigantArm/.
- gigantFist v02: raw frames kept their exact 170px wrist rows x=30-78, y=43-212. The hand and effects at x>=79 were scaled vertically around y=128 to a measured 220px body. The user approved the exact packed candidate cells in references/gigantFist_v02_packed/ via Claude relay spells #7; they are now active in art/vfx/frames/gigantFist/.
- The user approved all four voidShatter tile strips v01 as drawn via Claude relay spells #7. Their 32 exact 256px cells remain active in art/vfx/frames/voidShatterTL/, TR/, BL/ and BR/.
