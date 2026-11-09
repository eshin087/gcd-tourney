# Luffy run v02 registration recheck: corrected offset pack

GPT-6 Astra (medium), 2026-11-09, relay audit2 #15. This recheck clears the run v02 registration hold recorded against the prior pack. The user's image approval via Claude relay audit2 #11 remains separate.

## Verdict

**PASS: corrected packed-cell registration and visible anatomy/scale within stated uncertainty.** The torso, head and whole-body landmarks now stay in a narrow horizontal band through the 8-frame loop. There is no new scale defect, no clipped pixel, and no evidence that the offsets distort the figure. Runtime grounding, hurtboxes/contact and gameplay remain Claude-owned.

The earlier `HOLD` was based on atlas SHA-256 `4d0fa71916948303dcff65d75f2d1129bf0c224ed9890d748bdb180245fe41b1`, before these offsets. It remains a valid finding for that pack only; this report and the manifest QA record bind the pass to the corrected pack below.

## Exact pack and references

- Read-only source worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-size-r8-b4`, branch `art/size-r8-b4`, commit `e3ca6a4e5c54e004eb6f3d48250526863de71583`.
- Exact atlas `public/characters/luffy/sheet.png`: SHA-256 `4edce4bb847658d02c9123dbce70b994d16f017f1de1da5843433c48ed4074b5`.
- Exact metadata `public/characters/luffy/anims.json`: SHA-256 `6d5975ef83790a52698ffb27767c942197bf986e035f107c2ec26f8170fc54d8`.
- Run v02 remains cells 8–15, eight 60 ms frames, looped. BodyHeight and packScale are unchanged; no image pixels were redrawn.
- Raw strip SHA-256: `e719904a758dbc715558085c0e0f612abfc993dd4ffa9745d066ace54ce46d49`.
- Updated sidecar `raw/run_v02.json` SHA-256: `5a0c286b2f3ad4e80191f5d6f059b701c0e75d3430e8151c8643ad5898649fa1`.
- Current pre-scale `frameOffsets`: `[[-18,0],[39,0],[3,0],[58,0],[63,0],[5,0],[16,0],[58,0]]`; the pack applies the existing 0.92 global scale. The sidecar's `frameOffsetsNote` identifies these as replacing the earlier clipping-only offsets.

Approved references were verified in the exact-pack worktree:

| Reference | SHA-256 |
|---|---|
| Approved idle f0, `public/characters/luffy/calibration-r3/reference-approved-idle-f0.png` | `a26d94992f0c3ee5fcff26cc043bc6ba797f432ea9def450d6f6afafd90e522d` |
| Approved title neutral, `public/characters/luffy/calibration-r3/reference-neutral.png` | `8e9da76421c52e5fa449ce55b2dba1933b52e74d15ccd4a69090b9f97eb082b1` |
| Approved title combat, `public/characters/luffy/calibration-r3/reference-combat.png` | `439678e0a9689edc3cc9686d51a65f9d546e2e68aae20760de8e7f4391a306e0` |

The [exact-atlas comparison board](../../../../../public/reviews/size-r8-audit2-luffy-b9-b10-r4/astra-run-v02-offset-recheck-exact-atlas-references.png) extracts these cells from the corrected sheet and shows them with the approved references at equal displayed density. Full frame metrics and hashes are in [astra-run-v02-offset-recheck.json](astra-run-v02-offset-recheck.json).

## Registration evidence

The supplied vest/shorts segmentation places the torso centers at x124.0–125.4; the hat band spans x151.6–158.8; the whole-body mass stays at x128.3–132.4. Independent opaque-pixel centroids below reproduce the whole-body range. The center moves only −0.22 px from f0→f1 and −3.54 px across the f7→f0 loop seam. The prior audit measured −54.5 px and +43 px on the hat landmark at those same transitions.

| Frame / cell | Alpha bounds `[x0,y0,x1-exclusive,y1-exclusive]` | Opaque-pixel centroid X | Approx. hat-band center X | Leading shin estimate |
|---|---|---:|---:|---:|
| f0 / 8 | `[36,55,194,241)` | 128.56 | 150.5 | 50 px |
| f1 / 9 | `[42,53,195,241)` | 128.34 | 149.0 | 55 px |
| f2 / 10 | `[34,56,220,241)` | 131.24 | 152.0 | 50 px |
| f3 / 11 | `[33,61,222,241)` | 131.59 | 149.5 | 48 px |
| f4 / 12 | `[39,57,215,241)` | 132.42 | 152.5 | 48 px |
| f5 / 13 | `[71,57,195,241)` | 131.55 | 157.0 | 42 px; bent, not an unprojected bone length |
| f6 / 14 | `[37,58,224,241)` | 132.02 | 151.5 | 50 px |
| f7 / 15 | `[31,65,221,241)` | 132.10 | 151.5 | 45 px |

The hat is a clothing landmark, not a skull measurement. Its remaining few-pixel bob follows the gait and is not accompanied by the prior body-wide jumps. The eight alpha bounds were measured from the exact quantized atlas, not cached frames. All stay within the 4 px cell safety margin; occupied x is 31–223 and the soles reach row 240. No cell boundary is touched.

## Anatomy and scale

All eight cells were compared with the approved idle f0, neutral and combat at one 256×256 cell density. The head/hat, lean shoulders, open vest, shorts, attached arm and leg chains and sandals retain the approved slim build through the gait. The estimated visible neckline-to-sash length is 42–48 px (about ±5–6 px endpoint uncertainty). Leading shins are approximately 42–55 px across the frames (about ±6–8 px uncertainty), with f5 visibly bent. These visible measurements overlap the references; hidden thighs, bent rear legs and foreshortened arms are not numeric ±6% passes.

The automatic head probe remains `unmeasured` for Luffy. Its ratios are not used as evidence. Manual pass is based on this exact-version, all-frame landmark and registration comparison. No repack or source/output change was made in this audit; the report and manifest record only the result. User drawing approval is unchanged.
