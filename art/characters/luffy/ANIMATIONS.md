# Luffy: animation brief (frame by frame)

This character brief is downstream of the pending title-style reference approval. No idle or other animation is authorized or created in this task. Canonical names, counts, phases and timing remain those in `art/manifest.json` and `art/SPEC.md`; the specifics below translate [KIT.md](KIT.md) only.

Shared pose rules: 256×256 cells, pivot `[128,240]`, face screen-right in 3/4 view, hard pixels, flat magenta raw background. Preserve head, torso, limb lengths, build and clothing volume from the approved Luffy neutral/combat cells once approved. Do not apply older cast constants or scale a pose by its bounding box.

## Kit move specifics

| anim | move / pose-specific details |
|---|---|
| `special` | Gum-Gum Pistol: startup twists torso and pulls near arm far back; active frames 3–5 extend that arm straight toward the opponent with a closed fist reaching toward the cell edge; recovery snaps arm back. Stretch is anatomy, not an effect overlay. |
| `specialForward` | Gum-Gum Bazooka: crouch and stretch both arms behind; active pose leans forward with both palms thrust together at chest height; return to stance. |
| `specialUp` | Gum-Gum Rocket: deep crouch with both arms stretched back and down, launch upward with arms above head, turn into `airHeavy` frame 0. |
| `specialDown` | Gum-Gum Whip: low crouched startup, weight on back leg; active near leg sweeps along floor with hands braced for balance; pull leg back in recovery. |
| `charge` | Gear Second: low crouch, one hand on knee and other fist clenched/pumping; draw the skin flush pink. The engine supplies steam. |
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
