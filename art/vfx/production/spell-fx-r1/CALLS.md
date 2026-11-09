# ART-SPELL-R1 candidate call inventory

Date: 2026-11-08
Authorization: user decision delivered as Claude relay spells #1: "Use their current model" (waives the GPT-6 Luna rule for this chat for this round only). This is not image approval.
Generation route: built-in image_gen; this tool exposes no rendering-model selector. Current Codex model directs the prompts per the decision.
Budget: maximum 3 image-generation calls per effect, cumulative; every call, including a failed or rejected attempt, is recorded here.
Approval: pending user review via Claude; no image is approved.

| Effect | Calls used / max | Call | Prompt | Archived source | Exact image_gen output | Verdict |
|---|---:|---|---|---|---|
| shockRing | 2 / 3 | call 1 | [prompt](prompts/shockRing_v01_call01.md) | [source](source/shockRing_v01_call01.png), 1536×1024, SHA256 0B7A40AD223C77062E99C810D22A9E28A508F3AEEE2E51B380BD5920B0222C4A | `E:\Vibe Coding\.codex\generated_images\01a1bdc7-fdf1-7c93-9506-03dc751cd9de\exec-fe1dad44-0143-4344-ac31-129cd5a91ca5.png` | Six shapes match; selected for extraction and cleanup. Final strip: 1536×256, five exact colors, SHA256 B5DDE5041874B56871BF2B91F3CB56CF420AE538152FBB6FD86F10D2BCC223F7. |
| shockRing | 2 / 3 | call 2 edit | [prompt](prompts/shockRing_v01_call02.md) | [source](source/shockRing_v01_call02.png), 1536×1024, SHA256 A80180C3E4783435F8961EE194B4833402721079836A945846353063FDAE51FA | `E:\Vibe Coding\.codex\generated_images\01a1bdc7-fdf1-7c93-9506-03dc751cd9de\exec-215076fe-be6c-479d-8675-6fe23621a33a.png` | Preserved shapes but did not materially remove color variation or grid seams; not selected. |
| impactBurst | 1 / 3 | call 1 | [prompt](prompts/impactBurst_v01_call01.md) | [source](source/impactBurst_v01_call01.png), 1536×1024, SHA256 31CD33377A54284703420BD34B26C07AEF7E71846F72AFDFE2B971899C6ED320 | `E:\Vibe Coding\.codex\generated_images\01a1bdc7-fdf1-7c93-9506-03dc751cd9de\exec-d997af14-ffd3-403a-9dcf-ec1309feeb2a.png` | Six phases match the brief; selected for extraction. Final strip: 1536×256, five exact colors, SHA256 9D8FECE2C4B849BE17064EDDA92CFEB69BB68FBF3E04CE4FFACC0A644A891039. |
| flare | 1 / 3 | call 1 | [prompt](prompts/flare_v01_call01.md) | [source](source/flare_v01_call01.png), 1254×1254, SHA256 73EDE17818CBF1DF54C72CAAA3676539B08193B30AA47C4AE6DC12B175274671 | `E:\Vibe Coding\.codex\generated_images\01a1bdc7-fdf1-7c93-9506-03dc751cd9de\exec-26e86817-81df-4e72-91c2-4b985a15d1b1.png` | Four centered frames with varied rays and small sparkles; selected for extraction. Final strip: 1024×256, five exact colors, SHA256 8CBF344F11692A8E3A768A93AE2A40D801AD95C759B7165AB83A112CC3A39FE2. |

Candidate pack: `node tools/pack-sprites.mjs vfx --candidates` completed with 110 effects / 697 frames and 8 HD pages. New strips pack to the expected counts: shockRing 6/6 at x0.968 with version sidecar `split: even`; impactBurst 6/6 at x1.0; flare 4/4 at x1.316. No new warnings were reported for these three; existing streamBolt, streamFlame and gumArm warnings remain.

Review gallery: `public/reviews/spell-fx-r1/index.html` compares white, blue and orange tints, frame-by-frame, against current stand-ins. All images remain unapproved; current effects stay in use.

Final versioned strips: art/vfx/raw/shockRing_v01.png, art/vfx/raw/impactBurst_v01.png, art/vfx/raw/flare_v01.png.
