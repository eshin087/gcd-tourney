# Complete frame-by-frame landmark annotation

Independent manual readings of every actual quantized frame on a fixed 20px grid at 2x nearest-neighbor. Each record selects a visible arm and leg; anatomical side is not inferred. All coordinates native cell x/y. Garment-covered joints estimated conservatively, not exact bones. H skull is an estimate under hair. N/A means a required endpoint is hidden. Projected measurements do not certify intrinsic lengths under rotation/depth.

**Coverage:** all 59 frames. This supersedes the earlier representative-only measurement limitation; it does not turn uncertain projections into passes. For each frame, the selected arm/leg side and exact endpoint coordinates are in the JSON; the same points are drawn on `*-landmarks.png`.

Hh = hair crown to chin; Hs = estimated skull crown under hair to chin; T = collar to black jacket hem. UA/FA = selected upper arm/forearm; Th/Sh = selected thigh/shin; S = visible heel-to-toe. Native px. Hh/Hs/S uncertainty +/-4; T/UA/FA +/-6; Th/Sh +/-7, plus depth uncertainty. Every decimal is Euclidean arithmetic on approximate integer points, not subpixel precision.

A measured projected number is not a strict intrinsic-length pass. A guarded upper arm and a straight punch cannot be judged equal by dividing their screen lengths; for that case the ratio is explicitly only a projection delta. Hidden far-side joints/foreshortening reasons are retained individually.

## airLight1Alt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 42.0 | 25.1 | 40.6 | 22.4 | 22.8 | 31.3 | 47.5 | N/A |
| 1 | 44.0 | 26.1 | 42.1 | 23.0 | 24.0 | 35.2 | 46.6 | N/A |
| 2 | 44.0 | 26.1 | 42.1 | 22.0 | 24.0 | 35.2 | 46.2 | N/A |
| 3 | 43.0 | 26.0 | 41.0 | 22.8 | 21.5 | 33.6 | 46.2 | N/A |
| 4 | 43.0 | 26.0 | 41.0 | 20.6 | 20.8 | 34.5 | 45.7 | N/A |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left guarding arm; leg = screen-left hanging leg. Raised screen-right thigh projects toward camera; its knee and far hip overlap the orange crotch, so the far leg is not assigned intrinsic lengths. Guarded far upper arm is behind fist/collar. Shoe N/A: Hanging sandal points toward viewer/down; heel is hidden behind ankle wrap.
- f1: arm = screen-right punching arm; leg = screen-left hanging leg. Near guard arm is deeply folded over torso; selected extended arm is a projected shoulder-to-wrist chain, far shoulder joint hidden by collar. Lifted leg hip/knee overlap. Shoe N/A: Toe-on hanging foot; heel not visible.
- f2: arm = screen-right punching arm; leg = screen-left hanging leg. Lifted leg remains depth-foreshortened with hip under crotch fold; guarding forearm crosses chest. Shoe N/A: Toe-on hanging foot; heel not visible.
- f3: arm = screen-left guarding arm; leg = screen-left hanging leg. Screen-right elbow/cuff merges into chest; raised thigh is viewed end-on and knee partly behind trousers. Shoe N/A: Hanging sandal heel hidden by ankle wrap and toe-facing projection.
- f4: arm = screen-left guarding arm; leg = screen-left hanging leg. Raised knee and its hip are partly hidden by crotch folds; far guarding forearm nearly end-on. Shoe N/A: Heel hidden in downward/toe-on sandal.

## airLight2Alt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 40.0 | 23.0 | 41.8 | 23.3 | 26.4 | 30.3 | 46.4 | N/A |
| 1 | 37.1 | 22.1 | 39.0 | 28.0 | 22.8 | 39.5 | 43.1 | 23.1 |
| 2 | 38.1 | 23.1 | 39.1 | 29.2 | 21.9 | 43.1 | 45.3 | 25.3 |
| 3 | 39.1 | 24.1 | 41.0 | 19.1 | 24.4 | 30.3 | 45.6 | N/A |
| 4 | 41.1 | 24.0 | 40.8 | 22.5 | 25.5 | 31.1 | 45.0 | N/A |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left visible arm; leg = hanging screen-left leg. Raised thigh projects forward; hip and upper thigh under jacket/crotch. Far elbow behind chest/fist. Shoe N/A: Hanging sandal is toe-on; hidden heel.
- f1: arm = screen-left visible arm; leg = screen-right extended kicking leg. Selected kick knee center inferred under straight trouser cloth (+/-7px); hanging other thigh is sharply folded and its hip occluded.
- f2: arm = screen-left visible arm; leg = screen-right extended kicking leg. Kick knee under cloth (+/-7px); hanging leg hip is obscured by belt/pouch and flexed toward viewer.
- f3: arm = screen-left visible arm; leg = hanging screen-left leg. Raised knee obscures torso lower-right; its thigh points into depth. Far guard elbow is hidden by knee/chest overlap. Shoe N/A: Hanging foot faces viewer with heel hidden.
- f4: arm = screen-left visible arm; leg = hanging screen-left leg. Raised thigh/hip overlap the jacket hem and crotch; far guard elbow lies behind fist/torso. Shoe N/A: Hanging foot points down/toward viewer; no exposed heel.

## airLight3Alt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 41.0 | 26.0 | 37.5 | 31.1 | 14.8 | 23.8 | 43.1 | N/A |
| 1 | 40.2 | 24.2 | 39.0 | 26.9 | 16.4 | 22.8 | 41.7 | N/A |
| 2 | 40.0 | 27.0 | 41.4 | 26.2 | 22.8 | 42.7 | 46.7 | 22.4 |
| 3 | 40.0 | 27.0 | 41.4 | 26.2 | 22.8 | 46.6 | 49.0 | 26.1 |
| 4 | 40.1 | 26.1 | 35.7 | 29.2 | 22.0 | 18.2 | 34.7 | N/A |
| 5 | 39.2 | 23.1 | 40.2 | 20.0 | 25.1 | 26.6 | 31.2 | N/A |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-right guarding arm; leg = hanging screen-left leg. Selected guarding forearm points into depth; its projected length is not intrinsic. Other arm is behind back/torso. Raised knee and hip merge in foreshortened orange cloth. Shoe N/A: Hanging sandal is toe-on; heel hidden.
- f1: arm = screen-left visible arm; leg = hanging screen-left leg. Other forearm/open palm points right with cuff overlap; raised thigh points toward viewer and hip is obscured by crotch. Shoe N/A: Toe-on dangling sandal, no separate heel.
- f2: arm = screen-left visible arm; leg = screen-right kicking leg. Crescent is excluded. Kicking knee center is garment estimate; supporting thigh curls into depth with hip under pouch/crotch. Far hand near waist hides far wrist/elbow.
- f3: arm = screen-left visible arm; leg = screen-right kicking leg. No crescent in this frame. Supporting hip hidden under pouch/crotch; far hand is partly hidden at waist. Extended kicking knee center under cloth, uncertainty retained.
- f4: arm = screen-left visible arm; leg = hanging screen-left leg. Raised thigh projects forward, its hip obscured by hem; guard elbow on screen-right partly merged with jacket. Hanging thigh itself is flexed toward depth. Shoe N/A: Hanging foot toe-on, heel not delineated.
- f5: arm = screen-left visible arm; leg = hanging screen-left leg. Far guarding forearm points toward face; raised thigh projects forward with hip covered by hem. Shoe N/A: Hanging sandal toe-on; heel hidden.

## heavyAlt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 40.0 | 26.0 | 36.2 | 29.1 | 15.0 | 35.4 | 37.0 | 28.0 |
| 1 | 40.0 | 27.0 | 27.7 | 30.6 | 17.0 | 32.4 | 36.0 | 29.0 |
| 2 | 38.0 | 22.0 | 40.1 | 27.6 | 17.2 | 32.0 | 51.5 | 19.2 |
| 3 | 36.1 | 21.2 | 40.1 | 31.9 | 19.7 | 42.4 | 36.9 | 21.4 |
| 4 | 37.0 | 22.0 | 41.0 | 32.2 | 17.8 | 48.3 | 36.4 | 23.1 |
| 5 | 38.1 | 23.1 | 37.4 | 24.0 | 24.0 | 35.9 | 47.4 | N/A |
| 6 | 39.1 | 23.0 | 38.5 | 23.3 | 19.0 | 24.1 | 43.2 | 29.0 |
| 7 | 39.1 | 23.0 | 36.3 | 19.8 | 21.5 | 33.3 | 37.9 | 28.0 |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left trailing arm; leg = screen-right support leg. Trailing forearm partly directed toward viewer; far guarding upper arm lies under face/fist. Other hip is hidden by pouch and crotch fold.
- f1: arm = screen-left trailing arm; leg = screen-right support leg. Deep crouch compresses collar-to-hem projection; no standing-height inference. Far guard elbow lies behind forearm/torso. Other hip hidden by pouch.
- f2: arm = screen-left trailing arm; leg = screen-left hanging leg. Raised thigh points toward viewer and overlaps hem; its hip/knee are ambiguous. Far guard elbow partially behind raised leg. Selected ankle joint estimated inside wrap.
- f3: arm = screen-left trailing arm; leg = screen-right raised kicking leg. Head tilted back; skull estimate low confidence. Straight raised-kick knee is inferred from trouser taper (+/-7px), not visible patella. Bent hanging hip occluded by raised thigh; far elbow obscured by kick.
- f4: arm = screen-left trailing arm; leg = screen-right raised kicking leg. Raised-kick knee is cloth/taper estimate (+/-7px); head tilt changes hair contour. Hanging leg hip behind kick; far wrist/elbow hidden at waist.
- f5: arm = screen-right raised arm; leg = screen-left hanging leg. Raised elbow is inside sleeve (+/-6px). Other lifted thigh is foreshortened into depth and hip covered by hem; hanging ankle visible but heel is not. Shoe N/A: Hanging sandal points toward viewer/down; heel hidden behind wrap.
- f6: arm = screen-left trailing arm; leg = screen-right support leg. Trailing forearm has depth shortening; far guard elbow lies behind fist. Screen-left rear hip is behind pouch/hem and bent thigh.
- f7: arm = screen-left guarding arm; leg = screen-right support leg. Near guarding arm folded in depth; other shoulder/collar and far elbow overlap. Rear hip behind pouch; not a second measured leg.

## hurtHighAlt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 38.5 | 24.2 | 44.9 | 26.4 | 19.1 | 31.8 | 42.0 | 31.0 |
| 1 | 39.1 | 24.0 | 36.9 | 27.8 | 23.3 | 31.1 | 41.2 | 32.0 |
| 2 | 37.4 | 23.4 | 44.3 | 23.6 | 24.7 | 29.7 | 42.4 | 32.0 |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left arm; leg = screen-right planted leg. Head rolled back, crown under hair uncertain. Far shoulder behind collar/torso; rear hip covered by pouch. Selected arm projects obliquely toward viewer.
- f1: arm = screen-left arm; leg = screen-right planted leg. Far upper arm runs behind torso and only cuff/hand emerge; rear hip hidden by pouch. Chest rotation changes visible shoulder span.
- f2: arm = screen-left arm; leg = screen-right planted leg. Near forearm crosses torso; far shoulder/elbow behind jacket and guarding hand. Rear hip is obscured by pouch; skull estimate affected by backward tilt.

## hurtLowAlt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 41.0 | 27.1 | 37.5 | 24.2 | 22.1 | 30.8 | 39.1 | 33.0 |
| 1 | 39.3 | 25.3 | 31.1 | 19.6 | 18.4 | 28.8 | 39.1 | 32.0 |
| 2 | 39.3 | 24.3 | 37.8 | 25.8 | 23.1 | 30.2 | 39.1 | 33.0 |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left arm; leg = screen-right planted leg. Two hands overlap abdomen; far forearm/elbow cannot be separated from near hand/hem. Back hip behind pouch. Neck/collar partly hidden by bowed head.
- f1: arm = screen-left trailing arm; leg = screen-right planted leg. Screen-right guarding arm crosses abdomen and its wrist merges with jacket folds. Rear shoulder in selected trailing arm inferred beneath upper sleeve; rear hip behind pouch.
- f2: arm = screen-left arm; leg = screen-right planted leg. Overlapping hands hide far wrist and elbow; rear hip obscured by pouch. Collar at bent neck partly under face/hair.

## light1Alt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 41.0 | 26.0 | 35.2 | 19.1 | 20.1 | 32.4 | 37.9 | 29.0 |
| 1 | 40.0 | 25.0 | 35.2 | 13.6 | 27.6 | 32.4 | 37.9 | 29.0 |
| 2 | 40.0 | 25.0 | 35.2 | 22.2 | 22.0 | 32.2 | 36.9 | 29.0 |
| 3 | 40.0 | 25.0 | 35.2 | 18.0 | 16.1 | 33.0 | 36.9 | 29.0 |
| 4 | 41.0 | 26.0 | 36.1 | 22.0 | 11.2 | 30.2 | 37.5 | 28.0 |
| 5 | 41.0 | 26.0 | 36.1 | 19.8 | 22.4 | 30.8 | 36.7 | 29.0 |
| 6 | 41.0 | 26.0 | 36.2 | 19.1 | 22.4 | 30.8 | 36.7 | 28.0 |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left guarding arm; leg = screen-right planted leg. Other guard shoulder and elbow overlap collar/raised fist. Rear hip covered by pouch; rear toe faces viewer.
- f1: arm = screen-left guarding arm; leg = screen-right planted leg. Loaded far arm folds behind guard fist and chest: wrist cannot be isolated. Selected forearm points toward viewer; rear hip covered by pouch.
- f2: arm = screen-right striking arm; leg = screen-right planted leg. Guard forearm/fist overlaps face and hides its wrist/shoulder separation. Extended shoulder estimated through sleeve; rear hip hidden by pouch.
- f3: arm = screen-right striking arm; leg = screen-right planted leg. Guard forearm crosses face; selected punch is less extended and projects into depth, so its short forearm is not intrinsic length. Rear hip hidden by pouch.
- f4: arm = screen-left lowered arm; leg = screen-right planted leg. Selected near forearm crosses torso almost toward viewer; far arm crosses upper chest and hides elbow/wrist boundary. Rear hip behind pouch/hem.
- f5: arm = screen-left guarding arm; leg = screen-right planted leg. Far guard upper arm partly hidden by raised hand and collar; rear hip behind pouch. Both forearms folded in depth.
- f6: arm = screen-left guarding arm; leg = screen-right planted leg. Far guard elbow under cuff/chest; rear hip covered by pouch. Selected arm remains folded in depth.

## light2Alt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 39.1 | 23.1 | 38.3 | 20.5 | 22.8 | 37.7 | 40.4 | 31.0 |
| 1 | 40.0 | 24.0 | 41.2 | 19.0 | 26.2 | 33.0 | 35.7 | N/A |
| 2 | 38.0 | 25.0 | 42.1 | 18.4 | 24.1 | 42.2 | 35.2 | 28.0 |
| 3 | 38.1 | 23.0 | 41.8 | 18.4 | 24.8 | 37.7 | 31.6 | 22.0 |
| 4 | 41.0 | 24.0 | 39.6 | 19.7 | 24.2 | 33.2 | 35.4 | N/A |
| 5 | 42.0 | 25.0 | 39.1 | 20.2 | 24.7 | 29.7 | 39.1 | 32.0 |
| 6 | 41.0 | 24.0 | 39.2 | 20.0 | 24.2 | 37.2 | 40.4 | 29.0 |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left guarding arm; leg = screen-right planted leg. Far guard elbow/shoulder overlap the collar and fist; rear hip behind pouch. Guard arm has depth shortening.
- f1: arm = screen-left guarding arm; leg = screen-left planted leg. Raised thigh points toward viewer with knee/hip partly under hem; far fist overlaps raised knee and hides forearm endpoint. Shoe N/A: Planted foot is toe-on; heel obscured.
- f2: arm = screen-left guarding arm; leg = screen-right striking leg. Kick knee center inferred beneath straight trouser cloth; far guard elbow overlaps extended thigh. Supporting hip obscured by pouch/crotch.
- f3: arm = screen-left guarding arm; leg = screen-right striking leg. Kick knee under cloth; shortened f3 kick has a depth component, so projected length is not intrinsic. Far elbow merges with upper thigh; supporting hip behind pouch.
- f4: arm = screen-left guarding arm; leg = screen-left planted leg. Raised leg folds toward viewer and hides hip/knee separation; far guard forearm lies behind chest/knee. Shoe N/A: Planted sandal points toward viewer; heel not separable.
- f5: arm = screen-left guarding arm; leg = screen-right planted leg. Other guard arm partly behind fist/chest; rear hip covered by pouch. Both forearms flex toward viewer.
- f6: arm = screen-left guarding arm; leg = screen-right planted leg. Far elbow is masked by guard cuff/chest; rear hip behind pouch. Forearm depth projection remains unknown.

## light3Alt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 40.0 | 24.0 | 35.1 | 17.7 | 21.9 | 31.2 | 38.8 | 25.0 |
| 1 | 40.0 | 24.0 | 33.2 | 18.6 | 25.9 | 26.0 | 31.1 | N/A |
| 2 | 40.1 | 26.0 | 33.1 | 16.6 | 20.6 | 38.8 | 41.6 | 28.8 |
| 3 | 40.1 | 25.0 | 34.1 | 17.0 | 22.0 | 39.6 | 40.6 | 28.0 |
| 4 | 41.0 | 25.0 | 37.1 | 15.6 | 19.7 | N/A | 31.3 | 25.0 |
| 5 | 40.0 | 24.0 | 35.5 | 19.8 | 24.6 | 32.4 | 35.9 | 26.0 |
| 6 | 39.1 | 23.1 | 36.5 | 19.8 | 23.3 | 32.4 | 35.9 | 27.0 |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left guarding arm; leg = screen-right planted leg. Far guarding elbow is partly concealed by cuff/chest; back hip behind pouch. Skull crown inferred under bangs.
- f1: arm = screen-left guarding arm; leg = screen-left planted leg. Raised thigh is directed toward viewer with hip covered by jacket; far guard forearm overlaps the raised knee/torso. Shoe N/A: Planted sandal points toward viewer with heel hidden.
- f2: arm = screen-left guarding arm; leg = screen-right kicking leg. Straight kicking knee is garment-center estimate; support hip hidden behind pouch and overlapping kicking thigh. Far guard elbow merges with torso.
- f3: arm = screen-left guarding arm; leg = screen-right kicking leg. Kicking knee lies under trouser cloth; support hip hidden by pouch/crotch overlap. Far guard upper arm and forearm masked by fist/collar.
- f4: arm = screen-left guarding arm; leg = screen-right planted lower leg; thigh occluded. Selected planted thigh is N/A: hip and upper thigh completely behind crossed raised thigh, so no independent hip endpoint can be assigned. Raised leg points into depth; its knee/hip overlap. Far elbow behind guarding hand.
- f5: arm = screen-left guarding arm; leg = screen-right planted leg. Far arm folded across upper chest; rear hip hidden by pouch. Selected guarding forearm is depth-foreshortened.
- f6: arm = screen-left guarding arm; leg = screen-right planted leg. Far cuff/fist obscures its forearm-to-elbow boundary; rear hip behind pouch. Head tips forward, skull crown remains an estimate.

## light4Alt

| f | Hh | Hs | T | UA | FA | Th | Sh | S |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 41.1 | 25.1 | 38.2 | 19.1 | 23.7 | 33.8 | 42.2 | 28.0 |
| 1 | 41.1 | 25.1 | 38.5 | 17.2 | 24.7 | 34.5 | 43.0 | 33.0 |
| 2 | 41.1 | 25.1 | 43.0 | 22.2 | 15.0 | 37.2 | 42.2 | 31.0 |
| 3 | 40.0 | 26.0 | 43.5 | 29.1 | 21.0 | 37.0 | 46.4 | 29.0 |
| 4 | 43.0 | 27.0 | 38.9 | 21.4 | 20.0 | 35.3 | 34.7 | 32.0 |
| 5 | 40.0 | 24.0 | 39.5 | 19.8 | 21.8 | 27.2 | 31.0 | 29.0 |
| 6 | 42.0 | 26.0 | 36.1 | 19.8 | 24.6 | 31.2 | 36.3 | 28.0 |
| 7 | 39.0 | 23.0 | 36.2 | 18.4 | 24.2 | 34.7 | 36.9 | 30.0 |

**Frame-specific exclusions / selected chains:**

- f0: arm = screen-left guarding arm; leg = screen-right planted leg. Far guard elbow is behind the fist/cuff/chest; rear hip behind pouch. Selected forearm points toward viewer.
- f1: arm = screen-left guarding arm; leg = screen-right planted leg. Both palms open; far elbow hidden by near forearm/chest. Rear hip behind pouch. Near wrist partly under palm cuff.
- f2: arm = near screen-right extending palm arm; leg = screen-right planted leg. Far shoulder hidden by neck/near shoulder; its forearm endpoints separately noted. Rear hip behind pouch; near extended arm projects into depth.
  Additional visible far forearm: {"side": "far extending palm arm", "elbowWrist": [[180, 125], [198, 125]], "uncertaintyPx": 6, "upperArm": "N/A: shoulder hidden behind neck and near arm", "projectedPx": 18.0}
- f3: arm = near screen-right extending palm arm; leg = screen-right planted leg. Far shoulder is hidden by near arm/neck; far forearm separately noted. Rear hip under pouch/hem. Lunge changes torso projection.
  Additional visible far forearm: {"side": "far extending palm arm", "elbowWrist": [[195, 123], [215, 123]], "uncertaintyPx": 6, "upperArm": "N/A: shoulder hidden behind neck and near arm", "projectedPx": 20.0}
- f4: arm = near screen-right extending palm arm; leg = screen-right planted leg. Far shoulder hidden behind near arm; far forearm separately noted. Rear hip behind pouch. Bent waist and lowered palms shorten torso projection.
  Additional visible far forearm: {"side": "far extending palm arm", "elbowWrist": [[180, 134], [196, 134]], "uncertaintyPx": 6, "upperArm": "N/A: shoulder hidden behind neck and near arm", "projectedPx": 16.0}
- f5: arm = screen-left guarding arm; leg = screen-right planted leg. Far palm/forearm partly turned toward viewer, elbow obscured by torso. Rear step sandal is tilted/toe-on (heel hidden), not used for shoe length; its hip under pouch.
- f6: arm = screen-left guarding arm; leg = screen-right planted leg. Far guard elbow merges into chest/cuff; rear hip behind pouch. Selected forearm folded into depth.
- f7: arm = screen-left guarding arm; leg = screen-right planted leg. Far guard elbow/collar overlap; rear hip under pouch. Both forearms folded toward viewer.

## Coverage counts

{
  "totalFrames": 59,
  "frameRows": 59,
  "measuredProjectedMetricCounts": {
    "H_hair": 59,
    "H_skullEstimate": 59,
    "T": 59,
    "upperArm": 59,
    "forearm": 59,
    "thigh": 58,
    "shin": 59,
    "S": 43
  },
  "notMeasuredCounts": {
    "H_hair": 0,
    "H_skullEstimate": 0,
    "T": 0,
    "upperArm": 0,
    "forearm": 0,
    "thigh": 1,
    "shin": 0,
    "S": 16
  },
  "allFramesHaveSpecificExclusionText": true,
  "unresolvedIntrinsicComparisons": "All metrics remain subject to documented landmark and depth uncertainty; no blanket all-frame +/-6% pass asserted."
}

Overlay colors: red hair envelope; orange skull estimate; cyan torso; purple upper/lower arm; green thigh/shin; yellow shoe. Overlapping endpoints remain distinguishable in the native-coordinate JSON.
