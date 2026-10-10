# Shared fighter scale and anatomy gate

Status: required production check under ART-SCALE-01. User direction: retain Gojo's taller body and Killua's shorter body, while matching anatomical scale and preventing animation size changes. This operational guide implements ADR 0007 and ADR 0010; it does not change gameplay stats.

## User correction: preserve the original Gojo

The user reaffirmed that the original approved Gojo head scale and size are preferred. Enlarging Gojo toward a universal 31px head was an incorrect interpretation and is rejected. Preserve model v03 and idle v02 proportions, and use the original packed Gojo as the visual reference for the cast. Height differences remain intentional. Measure approved anatomy before choosing correction factors; numeric targets must not override this direction. Other fighters still require review against this baseline.

## Nominal contract (Gojo visual exception takes precedence)

| Property | Naruto | Sasuke | Killua | Gojo |
|---|---:|---:|---:|---:|
| Standing skeleton: soles to skull crown, px | 200 | 200 | 182 | 215 |
| Skull crown to chin, excluding hair, px | 31 nominal, review against Gojo | same | same | preserve approved reference |
| Nominal heads tall | 6.45 | 6.45 | 5.87 | approved proportions |
| pixelsPerUnit | 128 | 128 | 128 | 128 |
| Cell / feet pivot | 256x256 / [128,240] | same | same | same |

A tilted head is measured along its skull-to-chin axis, not its vertical bounding box. Hair, bangs, hats, headbands, weapons, raised hands and effects do not count toward anatomical head or body height. Gojo's narrow adult face and Killua's youthful face remain distinct; equal anatomical scale does not mean identical silhouettes.

## The failure to prevent

A constant sprite bounding-box height does not establish constant anatomy. A raised hand makes the bounding box taller, a crouch makes it shorter, and a tucked aerial pose changes both dimensions. Scaling each strip to an estimated pose height can therefore shrink or enlarge the person. A zero-warning pack only proves technical validity; it does not prove scale consistency.

## Before generating a character

1. Record standing-body height, skull-to-chin height, head width, shoulder width and upper/lower limb lengths from the approved neutral reference. Compare at the same pixel density and ground baseline with the existing cast.
2. Use existing approved identity references. Preserve character identity while correcting inconsistent proportions; never match the chibi placeholder.
3. Add the scale paragraph below to every body-animation prompt. Keep its source dimensions identical for parts A/B and all strips. Do not enlarge poses merely because fewer frames share the canvas.
4. Never approve a new baseline solely because its overall height matches. Check the head and the skeleton separately.

### Prompt paragraph

Scale lock: preserve the approved character's skull-to-chin length, excluding hair. The nominal 31px value is not permission to enlarge Gojo; his approved proportions take precedence. Standing skeleton height is CHARACTER_BODY_PX. Draw source art at a declared common multiplier (normally 2x: skull 2 * approved skull length, standing skeleton 2 * CHARACTER_BODY_PX). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.

## Measurement and packing

- Measure every candidate pose before final approval. Save skull crown and chin coordinates, the measured axis length, orientation/occlusion notes, and source version/hash. If either landmark is obscured, mark the measurement uncertain and compare another stable landmark; do not invent a precise value.
- Versioned raw sidecars can provide `anatomy: { measurement: "skull-to-chin", targetHeadPx: 31, sourceHeadPx: [...] }`, with one independently checked source measurement per frame. The packer uses target/source instead of pose-bounds normalization. Cached frames retain that scale; changed sidecars invalidate the source cache.
- `bodyHeight` remains the legacy fallback and pose planning envelope. It is not proof of anatomy and must not be changed simply to hide drift. Do not change pixelsPerUnit or stretch x/y independently to compensate.
- If correct anatomical scale clips a limb, redraw/repose that frame within the cell. Do not shrink the whole character to fit. Uniform scaling cannot repair a head that is proportionally too large relative to its torso; that needs an image edit.
- Preserve raw `_vNN` sources. Record every visual correction as a new version and retain previous approvals/history. Recompute and visually inspect hitboxes and hand anchors after scale or placement changes.

## Acceptance gate

- Skull-to-chin target from approved proportions (nominal 31 px only where visually appropriate); tolerance +/-2 px for clear comparable views. Document foreshortened/occluded exceptions explicitly. No automatic exemption for a whole animation.
- Comparable-frame head axis and width vary by at most 2 px within a loop and across adjacent animation transitions. Hair motion alone is allowed to change hair bounds.
- Neutral skeleton height stays within 5% of the character's declared height. Review cross-cast anatomy against the original Gojo; preserve his preferred head and deliberate body-height differences.
- Verify limb lengths and torso width in comparable views. Rotation/foreshortening may change projection; cropping or zoom may not.
- Inspect ALL packed frames at native scale, plus idle-to-run, idle-to-attack, recovery-to-idle, jump-to-air-attack and knockdown-to-getup transitions at game speed.
- Check fixed cell/ppu/pivot, no clipping, correct facing, feet/airborne placement, palette and regenerated contact/effect anchors.
- Run packer regression tests after tooling changes, strict packing, build, and same-depth browser mirror/cross-cast checks. Compare on a common camera/depth so perspective does not masquerade as scale drift.
- A hair/skin segmentation heuristic can flag suspicious frames, but cannot certify skull size or anatomy. Bounds and color-component metrics must remain labelled as proxies until visually reviewed.

## Evidence

Audit and before/after comparisons live in `art/scale/`. Each character's production QA must link its measured results and unresolved exceptions. A missing or incomplete measurement record means the anatomical gate is pending, even when the atlas packs successfully.
