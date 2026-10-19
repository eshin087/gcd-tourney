# Luffy: animation brief (frame by frame)

The title-style neutral/combat reference, model sheet, expressions and idle v01 were approved by the user (PR #93 merged 2026-10-15). The inbox assignment authorizes this core-animation batch. Canonical names, counts, phases and timing remain those in `art/manifest.json` and `art/SPEC.md`; the specifics below translate [KIT.md](KIT.md) only.

Shared pose rules: 256×256 cells, pivot `[128,240]`, face screen-right in 3/4 view, hard pixels, flat magenta raw background. Preserve head, torso, limb lengths, build and clothing volume from the approved Luffy neutral/combat cells once approved. Do not apply older cast constants or scale a pose by its bounding box.

## Kit move specifics

| anim | move / pose-specific details |
|---|---|
| `special` | Gum-Gum Pistol: startup twists torso and pulls near arm far back; active frames 3–5 extend that arm straight toward the opponent with a closed fist reaching toward the cell edge; recovery snaps arm back. Stretch is anatomy, not an effect overlay. |
| `specialForward` | Gum-Gum Bazooka: crouch and stretch both arms behind; active pose leans forward with both palms thrust together at chest height; return to stance. |
| `specialUp` | Gum-Gum Rocket: deep crouch with both arms stretched back and down, launch upward with arms above head, turn into `airHeavy` frame 0. |
| `specialDown` | Gum-Gum Whip: low crouched startup, weight on back leg; active near leg sweeps along floor with hands braced for balance; pull leg back in recovery. |
| `charge` | v02 (user-approved via Claude relay charge #6): six-frame Gear Second charge. f0 gathers low with one hand on the near knee and normal skin; f1 releases into the far fist at the chest and pink flush; f2-f5 hold and pump the legs/body about 3-4 px. The pink flush remains fixed f1-f5; the engine supplies steam. Runtime timings: 70, 90, 110, 110, 110, 110 ms; f2-f5 loop. Astra's packed audit accepts scale on sandal landmarks but holds the exact loop contract: feet are not pixel-identical and face/fist/body excursions exceed the target. See `production/charge-v02/ASTRA_AUDIT.md`; awaiting Claude's in-game/integration review. |
| `superPose` | Jet Gatling: low Gear Second stance, both fists cocked back, pink skin flush. |
| `beamCharge` | Gear Third: bite thumb and inflate near arm across the three loop frames; giant fist held behind and above him, ultimately larger than torso. No puff/smoke pixels. |
| `beamFire` | Throw the giant fist forward on its stretched arm. Keep all art within the cell; no beam stream is drawn into the sprite. |
| `throw` | Air Gum-Gum Pistol: orient the throw around a forward stretched fist; preserve hand as the effect anchor. |
| `airHeavy` | Gear Third/Rocket drop: use a forceful downward rubber-body strike and carry to `land`; no aura or motion lines in sprite. |
| `intro` | Grin and hold the straw hat on his head. |
| `taunt` | Laugh and point. |
| `win` | Laugh with both arms raised. |
| `launched`, `spin`, `ko` | Hat may hang on his back by its cord while he is knocked flying. |

## Reference gate

`reference/title_style_draft_v01.png` and `reference/title_style_lineup_v01.svg` were approved by the user for both poses on 2026-10-14. The first idle must still be compared independently with both approved neutral and combat cells before it is used as a future animation reference.

## Idle v01 candidate

The requested `raw/idle_v01.png` contains eight 256×256 cells in canonical order, 00 through 07, arranged as a restrained breathing/guard loop. The source generator placed them in a 4×2 grid; the final strip was assembled from those eight cells with nearest-neighbor scaling. The user approved idle v01 and its fixed copy is `reference/idle_approved.png`. The poses read consistently, but motion between frames is very subtle. Approval does not certify anatomy/scale, packing or loop quality.

## Directional normals (ENG-112)

Use the approved idle, model sheet, expressions and title-style neutral/combat cells as identity and size references. Luffy's hat and palette confuse the automatic head probe, so no numeric probe exemption is a substitute for a version-bound `scaleManualQA`: compare every packed frame with idle f0 and the approved neutral/combat cells at one density, using the hat top, brim width, shoulder/torso, sash/belt, knees, sandals and soles as visible landmarks with uncertainty. Keep the body at idle scale; pose crouches and lunges rather than shrinking the strip. Keep rubber limbs inside x=4..251. Limit overhead peaks to the available 256px cell with at least a 4px top margin; do not shrink the body to fit a raised fist or foot. Leave the hat seated on the head in these ordinary moves; keep the left-eye scar, open red vest, blue shorts with white cuffs, yellow sash and sandals consistent.

| animation | Luffy's move |
|---|---|
| fTilt | Step forward and snap a near-arm straight punch to chest height; the fist leads the silhouette. |
| uTilt | Crouch then swing a compact elastic uppercut from in front of the face up and over, reaching the opponent on the way up. |
| dTilt | Drop into a low guard and extend the near foot in a quick shin-height poke, then pull it back. |
| dashAttack | Carry the run into a forward shoulder-first body lunge at chest height; keep the hat and both legs attached and inside the cell. |
| fSmash | Pull the near arm far back, then deliver a full-body stretched straight punch to the chest. Cell 1 (zero-based frame 1) is the held charge pose. Keep even the extended fist within x=251. |
| uSmash | From a crouch, drive a diagonal up-forward elastic uppercut. Keep the fist peak within the cell and no more than about one head above the hat; never reduce his body to fit. |
| dSmash | Low, simultaneous two-sided split sweep: both legs extend in opposite directions on both active poses, with bent knees so both sandals remain inside x=4..251. |
| fair | Compact airborne forward kick at body height; the near sandal is the forward contact. |
| bair | Turn the hips and snap the far heel behind the body toward screen-left while the 3/4 body faces screen-right. |
| uair | Compact upward aerial kick over the hat; keep body size and leave at least 4px above the raised sandal. |
