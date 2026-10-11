# Sasuke title-style production QA — 2026-10-11

User-approved source: `reference/title_style_draft_v01.png`, plus the 256 px neutral and combat cells copied here from the title-style pilot. The neutral occupies 90×209 px, has a 197 px pre-fit body target, and soles at y240. The combat cell occupies 155×180 px. These values govern this batch; the old universal head-count prompt does not.

## Idle v07

- Git history contains idle v01–v06. The two v07 source parts are 4 poses each; `npm run stitch -- sasuke idle v07` measured B factor 1.0296, scaled A by 0.9713, and reported B/A 0.988 after stitching. No factor was chosen by eye.
- The 48-color packer selected `raw/idle_v07.png` at x0.337 and exited 0. `bodyHeight` is 180 for the crouched idle, to preserve the approved combat scale rather than enlarge the crouch to the 209 px neutral envelope.
- Actual packed idle frame 0 occupies x46..204, y64..240 = 159×177 px. The approved combat sample occupies x50..204, y61..240 = 155×180 px. Same floor and comparable occupied scale, head/torso/limb build, outfit, face and sheathed sword. [First frame](packed-idle-v07-f0.png) and [all eight frames](packed-idle-v07-loop.png) are extracted from `public/characters/sasuke/sheet.png`; the old `frames/idle/` cache is not the new candidate.
- Every frame was inspected at native size. Feet stay planted; the loop changes only subtly. v07 is a provisional continuity reference, not `idle_approved.png` and not user-approved.

## Guard v03 → v04

- v03 was rejected on technical QA: the second frame crouched about 20 packed pixels lower and compressed the torso and limbs. The first and second v03 frames are saved in [QA preview](packed-guard-v03-qa.png); the raw image is in `raw/_rejected/`.
- v04 corrects the pop. Both [packed QA frames](packed-guard-v04-qa.png) have hair top y61, upper head silhouette x100..142 and x101..142 at y50..94, planted feet y240, and close torso/leg shapes. Idle's corresponding upper head region is x95..134, hair top y64. The few-pixel contour differences are within the pilot's approximately ±3 packed-pixel crown uncertainty; there is no visible 38% head enlargement.
- The automatic guard probe reads 1.38× idle because the crossed navy forearms touch the dark hair mask. That is an invalid skull measurement. A v04-only exemption documents this demonstrated mask problem. It is a **manual anatomy acceptance, not a numeric scale pass**. With that exemption, `node tools/pack-sprites.mjs sasuke --quantize 48` exits 0 and selects guard v04. The older approved Sasuke strips still show scale mismatches against the new idle and are not represented as complete or strict-clean.

## Run v04 → v05

- v04 measured A/B factor 0.9901 but failed the new-strip gate: head pop (f1 1.29×, f7 0.88×) and flight frames 3/7 clipped 22/24 px at the right edge. [Native QA](packed-run-v04-qa.png) shows the defect; this version is a technical reject.
- v05 redrew both parts. Measured B factor 0.9959, final B/A 1.012. The packer's first import revealed the pose max height was about 438 source pixels; the measured idle-head source factor 0.3523 implied a 154 px run envelope. The gate at 154 px found hair ratio 1.06, just beyond tolerance. A 150 px envelope gives scale 0.342 and a numeric pass with no clipping. It was selected from those measurements and then checked visually, not chosen from the run's bounding box by eye.
- [All eight packed frames](packed-run-v05.png) were extracted from the actual written atlas. Frame bounds are 125–151 px wide and 142–150 px high; every frame stays inside x4..251 and y4..240. The same face, hair, torso, lean build, long legs, sheath and costume persist. The sequence has left/right contacts, passing strides and flight phases; f7 flows into f0. Current candidate is technically packable but still awaits the full-set visual review.

## Light1 v06

- Seven-frame left-lead jab, four poses in A and three in B. Stitch measured B factor 1.0362, scaled A 0.9651, and reported final B/A 1.036; no guessed size factor.
- `node tools/pack-sprites.mjs sasuke --quantize 48` selected `raw/light1_v06.png` at x0.355 and exited 0. [All seven actual packed cells](packed-light1-v06.png) were inspected. The active fist is the rightmost element at head level in f2/f3, with a small solid smear in f2; f4–f6 retract to the idle guard. Feet remain grounded and hair, torso and leg proportions read consistently.
- Visual defect: f1's punch is already near full extension, so the anticipation-to-impact distinction is modest. The f6 open lead palm was correct: both approved combat and provisional idle source have that palm. User final batch review remains pending.

## Light2 v05 → v06

- v05 stitched with measured B factor 0.9856 but failed the new-strip gate. The dark right fist touching the face inflated f1's mask to 1.24× idle. Masking that frame exposed a 1.09× uniform head reading; actual packed upper hair width was 46–48 px versus 40 px in idle. [v05 QA cells](packed-light2-v05-qa.png) show the larger head. This is a technical reject, archived under `raw/_rejected/` with both parts preserved under `raw/_parts/_rejected/`.
- v06 redraw narrowed the head and separated the fist contour. The measured stitch scaled B by 0.9686, final B/A 0.975. The 48-color candidate gate exits 0 **without a scale exemption** at bodyHeight 180, preserving the same standing envelope as the approved combat pilot. [All seven cells](packed-light2-v06.png) were extracted from the actual public atlas and inspected: coiled startup, right near fist extending at head level in f2/f3. Its f6 two-fist guard differs from the approved open-palm combat stance, so v06 is a visual reject. Independent [3× nearest-neighbor head crop](packed-light2-v06-heads.png) shows upper dark-hair width 38–39 px through f0–f4 versus 40 px in idle. The crown and face both shift down about 6 px during f4 recovery while the head width, torso, legs and y240 soles remain at the same anatomical scale. This is a posed head drop, not evidence of a shrunken head.

## Light1 v06 → v07

- v06 packed but failed visual pose QA: f1 was almost fully extended in startup. Its f6 open palm was correct. It is archived under `raw/_rejected/`, with both parts preserved under `raw/_parts/_rejected/` and [old packed cells](packed-light1-v06.png) retained for comparison.
- v07 redrew both parts: f1 is a bent-arm halfway jab, f2/f3 are extended impact, f4 retracts. Its f6 two-fist guard differs from the approved open-palm combat stance. [v07 actual atlas cells](packed-light1-v07.png) document that visual reject.

## Light3 v05 → v07

- v05 front kick used a measured 0.9762 B stitch but at the anatomically appropriate 190 px attack envelope, active frames clipped 21/11 px to the right. [Actual packed QA](packed-light3-v05-qa.png) preserves the evidence. Scaling the entire strip down to 180 px made the head 0.90× idle and still did not solve the pose transition, so v05 is a technical reject.
- v06 used the same active pose with measured frame offsets (-25,0) and (-15,0), removing right clipping while keeping one anatomical scale. Its last recovery pose remained about 11 px taller than idle; [actual packed v06 cells](packed-light3-v06.png) show the pop. v06 is a technical visual reject, not an approved animation.
- v07 kept the active pose, redrew only the recovery posture, and measured B factor 0.9984 (A scaled 0.9956, final B/A 0.977). The same measured frame offsets place the kicking sandal inside the 256 cell. The 48-color new-strip gate exits 0 with no clip warning or exemption. [All seven actual atlas cells](packed-light3-v07.png) were inspected; active f2/f3 extend to x250 without clipping, supporting foot and recovery soles stay at y240, and f6 crown y65 nearly matches idle y64. Its f6 two-fist guard differs from the approved open-palm stance; v07 is a visual reject.

## Light4 v05 → v07

- The five-pose A strip shows a back-facing coil with collar crest/sheathed sword and a high right-leg roundhouse. Initial v05 measured B factor 0.9802, but packed f3 clipped 17 px right and f4 reached 1 px into the cell margin. [v05 actual QA](packed-light4-v05-qa.png) also shows f7 crown y74 versus idle y64. v05 is a technical reject.
- v06 reused the generated kick poses, redrew B and used frame offsets (-21,0) for f3 and (-5,0) for f4 based on the measured v05 clip/margin. The 48-color gate passed without clipping, but [v06 actual cells](packed-light4-v06.png) had f7 crown y54, 10 px too high for the idle return. v06 is a visual reject.
- v07 tried an intermediate B recovery with measured stitch B factor 0.996 (A/B 0.979) and the same offsets. The 48-color gate passes without clipping or exemption; [all eight actual cells](packed-light4-v07.png) show the back-facing windup, head-height high kick, solid crescent, leg drop and planted y240 soles. Its f7 crown is y75, 11 px below idle y64, and its hands remain closed. Three B imagegen attempts did not match the approved return, so v07 is a visual reject.

## Canonical open-palm recovery corrections

- The approved combat cell and generated idle v07 f0 both have an open lead palm toward screen-right. Previous QA incorrectly treated two closed fists as the idle authority. The candidate rows and notes now use the approved source stance. No generated source was overwritten; all recovery repairs are new versioned strips.
- Light1 v08 paired the corrected v07 startup with the already generated v06 B open-palm endpoint. The measured stitch scaled B 0.9645; the 48-color gate passed. [Actual atlas cells](packed-light1-v08.png) showed f6 only 137 px wide versus idle f0 159 px. v08 is a visual reject for an undersized/narrow recovery pose. Light1 v09 reused generated idle v07 f0 in B at source factor 0.9815 derived from idle x0.337 / (light1 x0.356 × preceding B stitch 0.9645). The fresh stitch measured B 0.9493, the 48-color gate passed without a new scale or clip warning, and [actual atlas cells](packed-light1-v09.png) now show the correct open-palm endpoint. f5 remains a visibly retracting guard and f6 resolves to ready stance; feet stay y240.
- Light2 v07 reused generated idle v07 f0 as f6 at measured source factor 0.9691 and freshly stitched B 0.9702. [Actual atlas cells](packed-light2-v07.png) pass the 48-color gate without new scale or clip warnings; f5 fist guard eases into the approved open-palm stance at f6. The final cell is 158×177 px versus idle f0 159×177, both soles y240.
- Light3 v08 reused the same generated idle f0 at measured source factor 0.9755 and freshly stitched the parts (A scaled 0.9921). The existing measured active-frame offsets remain. [Actual atlas cells](packed-light3-v08.png) pass the 48-color gate without new scale or clip warnings. The elevated knee drops through f5 into the planted open-palm f6, which occupies 159×177 px, matching idle f0.
- Light4 v08 reused generated idle f0 for canonical f7 at measured source factor 0.8438 and fresh measured B stitch 0.9850. The high kick and crescent remain inside the cell with the same measured offsets. [All eight actual cells](packed-light4-v08.png) pass the 48-color gate without new scale or clip warnings. The planted f6 guard flows to f7 open palm; f7 occupies 158×176 px versus idle f0 159×177, soles y240. Canonical pose reuse and exact method are in the versioned sidecar and patch script.

## Remaining checks

The escalated local Vite adapter served port 5222. The in-app browser showed two Sasuke fighters at the same game depth with the new idle, matched apparent height and grounded feet. The console logged `[sprites] using custom sheet for sasuke (42 animations)` and no errors. The production build passed (80 modules) and the adapter's HTTP self-check returned four 200 responses. Full production, full-character strict scale, contact/hurtbox validation, user image approval, integration and deployment remain open.
