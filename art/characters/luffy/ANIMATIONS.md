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

The current candidate is `reference/title_style_draft_v01.png`; its equal-density comparison is `reference/title_style_lineup_v01.svg`. It has not been approved. Generate no model sheet or animation until the user approves this lineup. The first idle must later be compared independently with both the approved neutral and combat cells before use as an animation reference.
