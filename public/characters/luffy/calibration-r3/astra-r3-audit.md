# Luffy r3 actual public atlas — Astra final pixel recheck

2026-10-16. **PASS: the18 previously supported manual body/anatomy findings remain supported on the actual strict-packed public pixels below.** Approved idle01 remains reference. This is not user design approval, proof of concealed anatomy, or runtime-contact certification.

## Exact delivered pixels

- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-luffy-core`.
- Actual atlas: `public/characters/luffy/sheet.png`, SHA-256 `73e1d99a75d22190ee3bb684fca30d9080f14dcc44af175d3f8c4bd2d9034a00`.
- Actual metadata: `public/characters/luffy/anims.json`, SHA-256 `9b357b1cd0ba48e421434523049d64157f607a8261ac8d3347b59d26d4f94ee8`.
- 19 animations,91 frames;4096×1536 atlas;256px cells,16columns,pivot[128,240],ppu128;48 opaque RGB colors independently counted.
- Reviewed pack log `../r3-strict-pack-after-sparse-repair.log`: command `node tools/pack-sprites.mjs luffy --quantize 48`, actual output written, `EXIT=0`. Current manual-probe policy is documented in main inbox; this is no longer the old warn-only diagnostic render.
- Independent extraction/comparison: `pixel-hashes-and-comparison.json` contains every actual cell hash, atlas index,duration/loop and exact RGB/alpha difference counts against the r2 diagnostic. `*-contact.png` and `*-<frame>.png` here are extracted from this actual public sheet, not reused old contacts.

## What was rechecked

Every one of the91 actual frames and each strip's static first/last relationship was visually inspected. The approved neutral/combat/idle cells were viewed again. Independent corresponding-cell comparison found **zero alpha-byte differences across all91 frames** against the r2 audit. Global quantization changed RGB values after the four held moves were excluded; those changed pixels were visually rechecked. Hat/head, skin/neck, open red vest, blue shorts, sash, limb boundaries and sandals remain legible and coherent. No new disconnected limb, scale jump, clothing-volume change or loss of joint definition was introduced by this palette.

The r2 manual coordinates and length uncertainties remain applicable because geometry is unchanged and the visible internal boundaries were rechecked. Detailed endpoints remain in `../manual-audit-r2/measurements.json`; they were not replaced by a head-color probe or silhouette-height inference. Reference idle shin52.8±6px,torso41.5±6,sash25±4,forearm32.3±6,sandal12.4±3; title combat shin54.6/torso40.5 and neutral shin59.1/torso43.1. Projection/occlusion caveats from r2 remain, especially jumpUp tuck and airHeavy middle frames. Those concealed segments are not numeric passes.

## Version-bound results on this atlas

| Version | Frames inspected | Actual-pixel body/anatomy result and retained limits |
|---|---:|---|
| idle01 | 8 | REF; stable adult slim build and breathing seam |
| run01 | 8 | PASS; visible shin40.5–55.8, support frames47.8–55.8; accepted rear-foot placement loss f3/f4/f7 remains |
| dash02 | 2 | PASS; shins50.2/47.0, coherent lean and two-frame cycle |
| jumpUp01 | 2 | PASS with projection limits; f0 shin46.9, f1 tucked shin unmeasured; torso38.9/34.0, complete visible limb chain |
| jumpFall03 | 2 | PASS; shins50.2/52.4, coherent floating pair |
| land01 | 2 | PASS; shins55.9/48.6; crouched torso not compared as standing height; recovery coherent |
| light1v02 | 7 | PASS; shins51.9–55.6,torso~42,sash26; jab/return connected and consistent |
| light2v01 | 7 | PASS; shins50.1–60.8 vary with extension, torso/build coherent |
| light3v02 | 7 | PASS; planted shin51.2–53.2; accepted f3 toe crop remains |
| light4v02 | 8 | PASS; shins46.0–54.6, A/B density consistent; accepted f4 foot crop and f5 margin retained |
| heavy01 | 8 | PASS within broad projection uncertainty; upright/recovery shin46.6–49.1 overlaps idle; no resolved A/B scale defect |
| airLight1v01 | 5 | PASS with accepted placement exception; bent leg chain50.8–54.2, f2/f3 fist crop remains |
| airHeavy01 | 6 | PASS with occlusion limits; torso38±6/46±8, recovery shin54.4; middle tuck/dive concealed lengths unmeasured |
| guard01 | 2 | PASS; shin48.5/47.2,sash26; torso occluded by arms, no fabricated measurement |
| hurtHigh01 | 3 | PASS; shins49.9–52.2, coherent recoil/build |
| charge01 | 4 | PASS; shins57.7–58.6,torso40.6; pink Gear Second skin intentional per KIT |
| beamCharge01 | 3 | PASS; shins53.5,torso40.5; enlarged Gear Third fist intentional per KIT |
| beamFire02 | 3 | PASS body scale; shins55.5–55.9,torso39.6; Claude's arm-only clip exception remains; whole body stays in cell |
| win03 | 4 | PASS; shin52.9,torso48.3±6 vsneutral43.1±6,sash31±4; hands/head/legs intact, coherent cheer loop |

## Exceptions and release limits

User-accepted placement losses remain exactly the existing ones: run rear foot f3/f4/f7 (21/32/16px),airLight1 fist f2/f3(15px),light3 toe f3(8px),light4 foot f4(29px). Claude accepted beamFire02 arm-only44/130px f1/f2 because runtime giant fist continues the lane. None is a general permission to crop body anatomy. Palette review does not remove the need for Claude's gameplay/contact check, including the packer's9 fallback strike-limb hitboxes.

Launched01,down01,getup01,special01 are absent from this public pack and remain held; they receive no new pass. Thus the selected18 pass recheck is complete, while the full core set/release remains incomplete. Static frame/sequence review is complete; timed playback and live contact/grounding were not performed by this auditor. Parent's browser checks are separate evidence.

A concise evidence update may cite this actual hash and retain each strip's r2 measurements/limits. No further image generation is needed for the18 selected strips based on this recheck. No source, manifest, art approval or public output was changed by this auditor. Parent owns committing and ringing the goku-luffy handoff; final integration remains Claude's responsibility.
