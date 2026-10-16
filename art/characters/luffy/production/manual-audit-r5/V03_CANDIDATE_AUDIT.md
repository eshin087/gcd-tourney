# Relay8 down03/getup03 quantized candidate audit

Astra, 2026-10-16. **PASS within measurement uncertainty for down03 and getup03 on these exact seven diagnostic cells.** This is a technical anatomy/fit recommendation, not user design approval, normal-game-atlas verification or timed/runtime certification. Special remains held with no new output from failed call4.

## Identity

- Candidate sheet SHA256 `4f53696f1bd8bb6f053fdad300dc35c1d53a2dce1628578d10477a8cf05b0345`.
- Corrected metadata SHA256 `35118942ed041cc28a7594861fe76ae324e6d661bdcd73967bd489cfe181e3ed` (metadata-only sourceSize correction; previous875c... superseded, pixels unchanged).
- Paths `production/relay8-generation/diagnostic-atlas-v03/{sheet.png,anims.json}`. Candidate-only1792x256,seven256cells,48colors; not normal gameplay layout.
- Independently extracted/hashed all seven atlas cells in V03_PIXEL_HASHES.json. Sources down03 `b40f4b01cf7f861d083fb153f156495bc23150324328078182e75782b7100e00`; getup03 `e14761e7f80b58eeb7d08eb465b5347bba192e9e3baae7ada6e3f2cbea018ad0`.
- Down preserves old f0 native cell and directly samples original newf1 at.205; bodyHeight106 givesx1. Getup uniformly samples all complete figures at.477; bodyHeight209 givesx1. No per-pose size fitting. Initial v02 versions remain preserved.

## Reference and uncertainty

Approved idle neck-base→sash41.5±6, shin52.8±6, forearm32.3±6, sash25±4,sandal top→sole12.4±3 native pixels; exact approved neutral/combat/idle reviewed. Title combat torso40.5/shin54.6. Endpoints measure visible projection, not inferred bones. Hidden joints in folded poses receive no numeric pass. Hat/posed bounds do not establish body density.

## Down03 — two frames PASS

f0 is the preserved original pose: bracing hand, bent knee and long exposed shin form a coherent crouched impact pose; shin about48.2±5 remains compatible with reference. Torso partly obscured by hand/neck flexion is not assigned invented landmarks.

f1 now has visible neckline→sash approximately(68,191)→(91,221)=37.8±5; exposed shin approximately(164,191)→(199,229)=51.7±5. Source endpoints independently annotated in INITIAL_MEASUREMENTS.json predict38.6/53.7; raster/endpoint differences are within stated uncertainty. The former under-density is corrected.

All visible hands, shoulders, vest/shorts, both lower-leg chains and sandals were inspected. Enlarged face is approximately20px tall versus idle about18±4, coherent within uncertainty; tilted hat brim is broader but is not used as a scale target. Upper-arm breadth/foreshortening reads consistently with the reclining angle, without a clear new muscular-build defect. Both feet and bracing forearm/hand are complete. No clipped pixel silhouette or detached limb found.

Static f0→f1 is a plausible fall into a side-lying supported pose. Different silhouette width follows articulation; it is not evidence of a size change by itself. Hand/sandal/body support pixels lie near the floor line; no isolated floating whole body is observed. Exact contact/hurtbox behavior remains Claude's runtime check.

## Getup03 — five frames PASS

Final f4 approximate native landmarks: neckline(128,86)→sash(124,128)=42.2±6; left shin(76,177)→ankle(50,226)=55.5±6; right shin(171,178)→(190,223)=48.9±6; forearm(77,106)→(105,94)=30.5±6. These agree with reference within pose/endpoint uncertainty. Eye-to-chin appearance remains consistent; head, torso, arm/leg thickness and vest/shorts volume are coherent with approved combat/idle.

Every frame inspected:

| Frame | Static anatomy/support finding |
|---|---|
|0|Complete side-lying figure; bent legs, sandals, elbow/forearm and torso connect naturally. No panel crop.|
|1|Elbow-supported roll upward; shoulder/arm and bent legs remain complete.|
|2|Both hands and bent knee visibly support the forward torso; no severed supporting limb.|
|3|Low kneel has a planted foot, knee and visible supporting arm; no unsupported kick/floating pose.|
|4|Complete compact guard, body landmarks above; plausible transition to existing idle.|

The same factor is used across all five figures. Earlier equal-panel cuts were assembly errors; complete components preserve limbs. Folded/oblique early torso and shins are visually coherent but not falsely labeled precise numerical matches. No visible step requires new source art.

## Remaining work

These seven pixels used a candidate-only shared palette. Build the actual strict combined atlas with the retained93 approved/manual-audited frames, then inspect all100 actual final quantized frames and their palette. A candidate pass is not automatically a production-pixel pass. Preserve public baseline until that result is bound to exact hashes. Timed playback/gameplay grounding, user image approval and merge/deploy remain separate. Parent owns goku-luffy approval-desk handoff. No new image calls, source edits or production edits by auditor.
