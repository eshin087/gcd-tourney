# Gojo run study prompt notes v01

All generations used the built-in image generator with only these approved inputs: `reference/title_style_approved.png` (including its right-hand combat pose), `reference/title_neutral_approved.png`, and `reference/idle_approved.png`. The combat reference identifies the screen-forward/right arm as near-camera; left arm is far-side. Each output requested eight distinct right-facing 3/4 whole-body run poses, 256 px cells at approved idle density, pivot `[128,240]`, hard-edged pixel art, flat `#FF00FF`, no effects/dividers/extra figures, alternating leg phases, and readable left/right legs.

- **J:** about 20° forward lean, long loping strides, far/left hand in the pocket, near/right arm low and loose, chin lifted.
- **K:** about 35° lean, athletic knee drive, far/left hand in pocket, near/right arm pumping at roughly 90°.
- **L:** upright showboat, chin high and head slightly tilted, bounding stride with clear flight, far/left hand in pocket, near/right arm swinging wide.

J used three cumulative calls; K and L used one each. See `attempt_inventory_v01.json` for exact output paths, hashes, selection decisions, and the unsurfaced first J output limitation. These are review-only direction studies.
