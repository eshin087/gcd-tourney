# Final QA: stage, NPC, UI and VFX

Date: 2026-10-09. Reviewer: final_world_other. Read-only asset audit; no images changed, no approvals recorded.

Coverage: all 30 current stage v01 fitted images (all tiling previews except the flat-row sky were also visually checked), all 13 NPC v01 reference/strip images, both UI v01 raws, all 15 VFX v01 raws and the complete packed VFX atlas. Compared title art with both approved fighter model sheets. Checked ADR 0008, area README/PROMPTS, stage ASSETS, NPC animation briefs and VFX EFFECTS. This is visual and static pixel QA, not in-game validation.

## Results that prevent final technical acceptance

- Stage: every fit has the exact documented dimensions and alpha is binary, but **29 of 30 exceed the slot palette limit**. Only brick meets its limit. Preserve raws; produce corrected derived candidates with palette reduction, then review texture noise, outlines and seams again. Existing fit files are versioned and must not be overwritten.
- NPC: vendor is smooth illustrated art rather than hard pixel art; vendor and monk-a have visibly large heads/short bodies (roughly four heads tall, compared with 5.5 and about 5 in their briefs). Redraw these NPC batches using their existing identity but corrected proportions/pixel craft. All requested figures and animation frames exist.
- NPC cross-strip scale differs: announcer point is drawn about 20% larger than idle despite both being upright; monk-b signal also has a larger head/body than idle. Normalize each strip against idle head size before applying the shared NPC scale, or regenerate those strips at matching scale. A single scale blindly applied to every raw will visibly enlarge these animations.
- VFX frame counts are complete and the packed atlas is readable. However generated color noise survives packing: fire has about 1,880 RGB colors per frame, orb about 1,380, crater 2,315–3,506; tintable effects retain 11–95 shades instead of their short white/grey palettes. Snap to the documented palettes without dithering and remove residual magenta in crater, dust and smoke. This is an output-cleanup requirement, not a reason to regenerate every source.
- VFX ring needs a new candidate: current packed largest ring is 120 x 43, versus the brief's 120 x 66; first ring is already 72 x 33 versus about 32 x 18. Redraw six frames with 1:0.55 ellipse ratio and stronger small-to-large expansion. Streak's last frame drops back down (bottom y=113 after y=106); brief calls for continued lift. Correct that final frame/sequence in a new version.
- Stage/NPC/UI packers and loaders remain dependencies: TASKS currently lists TOOL-011, ENG-023, ENG-024 and ENG-025 as todo. A finished raw queue is not a finished integrated world. In-game scale, anchors, animation timing and UI readability must be checked after these land.

## Stage: all 30 batches

Paths are `art/stage/raw/_fit/<slot>_v01.png`; `colors` counts distinct visible RGBA values. All sizes pass. `cleanup` means retain composition and create a corrected derived candidate; it does not mean approved.

| Batch | Colors / budget | Verdict |
|---|---:|---|
| stage-ringTop | 59 / 32 | Cleanup; coherent pale 18x18 ring, restrained cracks. |
| stage-ringSide | 30 / 16 | Cleanup; horizontal tiling reads cleanly. |
| stage-grass | 90 / 16 | Cleanup; visible repetitive blade noise, simplify while keeping mowing stripes. |
| stage-steps | 23 / 12 | Cleanup; course pattern repeats cleanly. |
| stage-stoneBase | 17 / 16 | Cleanup; near budget, quiet staggered blocks. |
| stage-brick | 14 / 16 | Static fit passes; clean running bond and seams. |
| stage-path | 20 / 16 | Cleanup; clean four-stone layout/seams. |
| stage-templeFacade | 881 / 32 | Cleanup; composition and mirrored central doors work, but fine noisy edges need quantization. |
| stage-roof | 35 / 16 | Cleanup; coherent repeating barrel tiles. |
| stage-bannerBu | 33 / 12 | Cleanup; 武 legible, red cloth and notched cutout correct. |
| stage-bannerDo | 48 / 12 | Cleanup; 道 legible, blue cloth and notched cutout correct. |
| stage-bannerSai | 39 / 12 | Cleanup; 祭 legible, blue cloth and notched cutout correct. |
| stage-bannerTo | 50 / 12 | Cleanup; 闘 legible, red cloth and notched cutout correct. |
| stage-plaster | 10 / 8 | Cleanup; subtle surface reads, remove fine stipple. |
| stage-sky | 60 / 16 | Cleanup; blue stepped vertical ramp appropriate, enforce flat rows/16 bands. |
| stage-cloudA | 34 / 6 | Cleanup; silhouette reads, reduce palette and restore specified closed outline. |
| stage-cloudB | 75 / 6 | Cleanup; tall billowing variant reads, reduce palette and restore specified closed outline. |
| stage-cloudC | 52 / 6 | Cleanup; low clustered variant reads, reduce palette and restore specified closed outline. |
| stage-gong | 46 / 12 | Cleanup; concentric bronze disc reads. |
| stage-parasol | 46 / 12 | Cleanup; red/white scallops and horizontal wrap read. |
| stage-woodDark | 23 / 12 | Cleanup; vertical repeating grain, simplify speckle. |
| stage-treeRoundA | 282 / 24 | Cleanup; round crown reads, simplify noisy foliage to broad clusters. |
| stage-treeRoundB | 331 / 24 | Cleanup; umbrella crown distinct, simplify noisy foliage to broad clusters. |
| stage-treePine | 174 / 24 | Cleanup; tiered pine distinct, simplify needles into clusters. |
| stage-treePalm | 172 / 24 | Cleanup; curved trunk and fronds distinct, simplify foliage/outline. |
| stage-sign | 165 / 16 | Cleanup; 天下一武闘祭 appears correct, retain legibility after palette reduction. |
| stage-lanternBu | 28 / 12 | Cleanup; repeated 武 and ribs work horizontally. |
| stage-lanternSai | 37 / 12 | Cleanup; repeated 祭 and ribs work horizontally. |
| stage-woodPillar | 36 / 12 | Cleanup; red lacquer reads but visible grain noise needs simplification. |
| stage-wood | 21 / 12 | Cleanup; honey boards read and tile, simplify grain noise. |

## NPC: all four batches

All references are `reference/model_sheet_v01.png`; all strips are `raw/<anim>_v01.png` under the NPC directory. Every reference has four views and every strip has two separated frames.

| Batch | Files inspected | Verdict |
|---|---|---|
| npc-announcer | model_sheet, idle, point, shout, cower | Strong coherent identity, correct microphone hand and requested gestures; small sweat drop in cower is explicitly allowed by animation brief. Normalize point scale to idle; verify shout feet and 128px cell margins after packing. |
| npc-monk-a | model_sheet, idle, signal | Paddle, saffron/crimson robe, beard and beads consistent; proportions too compressed/large-headed. Redraw model and both strips at about five heads tall, keep short stooped silhouette. |
| npc-monk-b | model_sheet, idle, signal | Clean distinct lean official with consistent staff/ribbon. Normalize signal scale to idle; check wide horizontal staff inside x4..123. |
| npc-vendor | model_sheet, idle | Food/tray identity and hawking gesture consistent, no unwanted writing; smooth illustration and oversized head violate pixel style/proportion brief. Redraw model and idle at about 5.5 heads with deliberate pixel clusters. |

All four need keyed, palette-limited 128x128 packed previews before acceptance. The raw images alone cannot establish foot anchors or exact cell margins.

## Shared UI

| Batch | Candidate | Verdict |
|---|---|---|
| ui-logo | art/ui/raw/logo_v01.png | Composition ready for final review after cleaning/fitting; GCD TOURNEY and six subtitle characters appear correct. Check at ~480x180 against bright/dark backgrounds; raw still has noisy near-magenta background. |
| ui-title_art | art/ui/raw/title_art_v01.png | Composition ready for final review after 640x360 fit: both approved Shippuden identities recognizable, opposed poses/aura colors, top third open sky. Sky contains smooth tone variation; fit/style pass should replace it with stepped bands, and check thin Sasuke hand details at final size. |

## VFX: all 15 batches

All raws `art/vfx/raw/<effect>_v01.png`. Packed atlas metadata has 128px cells, ppu56, 15 rows, and all expected frame counts. No frame bbox touches a cell border. All verdicts still require in-game tint/anchor/timing check.

| Batch | Frames | Verdict |
|---|---:|---|
| vfx-spark | 5 | Shape sequence reads; clean to white/grey palette, verify common impact center during expanding crescent playback. |
| vfx-burst | 5 | Solid-to-hollow burst reads; clean white palette. Eight principal spikes versus approximate ten in brief is a minor visual deviation. |
| vfx-ring | 6 | Redraw ellipse/growth as specified above; palette cleanup also required. |
| vfx-dust | 6 | Expansion/breakup reads; palette cleanup and isolated magenta removal; base stays y119–120. |
| vfx-smoke | 7 | Poof/breakup reads; palette cleanup and isolated magenta removal; inspect rising progression in playback. |
| vfx-shuriken | 4 | Four spin poses present; palette cleanup, then check constant apparent size across rotation (diagonal frame bbox naturally smaller). |
| vfx-fire | 4 | Good radial flicker silhouettes; reduce to six-tone palette. |
| vfx-flame | 7 | Growth/collapse and baseline read; clean white/grey palette. |
| vfx-lightning | 6 | Six distinct branching clusters; clean white/grey palette. |
| vfx-orb | 6 | Stable sphere, spiral loop; reduce to specified short blue palette. |
| vfx-glow | 2 | Static packed check passes: white RGB and alpha exactly 0/110/200/255. |
| vfx-streak | 6 | Correct thin form and count; fix final downward jump, clean white/grey palette. |
| vfx-star | 5 | Shrinking flare reads and frame02 remains distinct; clean palette. |
| vfx-crater | 3 | Three top-down variants read; substantial palette cleanup and isolated magenta removal. |
| vfx-lines | 4 | Expanding hollow radial burst reads; clean white/grey palette. |

## Handoff

Lead should resolve redrafts/cleanup, link these 51 batches in the final review packet, and keep them `needs review` until the user's one final decision. Do not silently call current palette violations passed. Keep engine/tool implementation with Claude; provide the measured examples above to TOOL-011, and verify actual game loading once supported. No generation, queue changes, shared tracker edits or commits were performed by this QA agent.
