# Sasuke charge v13 generation provenance

- Status: raw candidate only; not packed, reviewed, or approved.
- Worktree/branch: `.worktrees/art-charge-sasuke` / `art/charge-sasuke`.
- Selected source copied unchanged to `art/characters/sasuke/raw/charge_v13.png`.
- Approved identity references attached in every call: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`.
- Reference scope: identity/design guidance only; the new ART-CHARGE brief supersedes the legacy A15 pose contract.
- Cumulative image-call budget: 3/3 used.

## Attempts

1. Source returned under `E:\Vibe Coding\.codex\generated_images\01a152ad-d675-7620-865f-105092fa5620\exec-d939723f-e250-472a-8217-84f885ebd941.png` (path identified in the task-scoped generation run folder after the first tool wrapper did not print its metadata). 2172x724. SHA-256: `9f0d81fb257f44676807ced173188aad4641915a7fec9940945dbd7cec36a1ef`. Has six separated figures, a readable gather and shouting seal stance, and visible updraft changes, but f2-f5 show more body/face variation than the fixed-loop brief allows.
2. Source returned at `E:\Vibe Coding\.codex\generated_images\01a152ad-d675-7620-865f-105092fa5620\exec-155de9c5-c16c-4253-9146-21a7c9cf54a8.png`. 2171x724. SHA-256: `26e1286b1bd0d8b5e0c2c29e6baffc4e2d9fc4f078a913c91621e67f8651efac`. Stable loop and clear seal, but f0 is too close to the final seal pose and the render reads smoother than desired.
3. Source returned at `E:\Vibe Coding\.codex\generated_images\01a152ad-d675-7620-865f-105092fa5620\exec-ba3310a0-766a-4a31-9510-1373d4eace25.png`. 2172x724. SHA-256: `1b91562845a9cadaf7e7993e673319b99474b345388a3c61ff05a3de6147dfad`. Selected: clearest sink-to-seal gather, clear low wide stance, readable raised two-finger seal, sheathed sword, and the most consistent f2-f5 body placement. The hold frames are very close to identical; the requested 1-2 px breath and 1 px finger tremor are not reliably legible at this displayed resolution. Candidate has visibly softened/antialiased edge pixels despite the hard-pixel instruction, and needs actual strip/palette/scale QA before any review state.

## Prompt used for attempt 3

```text
Make a six-pose horizontal pixel-art charge strip for the attached approved Sasuke identity references (model_sheet, expressions, idle_approved). New ART-CHARGE brief supersedes old prompt. Hard square pixels only, visibly pixelated clusters on a consistent grid, crisp 1-pixel style outlines, flat cel shading with no soft edges. Flat pure #FF00FF background. Six separate full-body poses with clear empty magenta spacing. Right-facing 3/4.

Exact Sasuke design from references: lean pale teenage ninja; black swept spiky hair with dark-blue sheen and long cheek bangs; white long-sleeved deep-V open shirt with high collar; purple rope belt and rear bow; navy knee-length waist cloth over navy pants; navy forearm guards; black open-toed sandals; no forehead protector. Black-sheathed straight sword stays horizontal at small of back, fully sheathed in every pose.

Six beats in order: f0 visibly sinks at knees and shoulders, head dips, right hand rises from low at side toward center chest (not at face yet). f1 completes the pose: low wide stance, right hand holds a one-handed seal directly before chin, index and middle fingers clearly raised together, other fingers folded; left arm hangs down and back ending in a clenched fist. Three-tomoe red Sharingan, brows sharply lowered, shouting mouth. f2 establishes same pose and body placement. f3 same exact stance with tiny 1-2 px shoulder/chest breath only. f4 same stance, only 1 px right forearm/finger tremble. f5 settles to the exact f2 pose.

For f2-f5 lock the anatomy and body: both feet, knees, hips, head and both hands stay at identical coordinates; head and hands no more than 2 pixels' movement. No jitter or body scaling. Only subtle breath/tremble and varied steady updraft forms of bangs/back hair, loose sleeve, rope bow/ends and waist cloth. Keep all six figures same scale; the posed sink in f0 may be shorter naturally. No energy, effects, aura, lightning, sparks, steam, dust, ground shadow, text, borders, gradients, blur, antialiasing, dithering or texture.
```
