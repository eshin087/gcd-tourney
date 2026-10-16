# Parent browser check: Luffy calibration r4

2026-10-16, local Codex in-app browser, port 5242.

- Actual public atlas SHA-256: `563832d5fc499f860a5a35e21f8e576c3885b4e1a9c76bd7173807187707a996`; metadata: `7c4cee7a4817fc31f2546c0eb358ed4f9533dcf9fb75c5c4c977d84bac144c6a`. These match Astra's final 20-animation / 93-frame audit.
- Review route: `/characters/luffy/calibration-r4/index.html`. All 26 image elements loaded. No document overflow at a 1280px viewport (document width 1265px).
- Current-frame canvas, approved neutral, combat and idle cells each display at 256 by 256 pixels. Contact sheets retain native cell density inside scrollable panels.
- All 20 animation choices loaded. `light1 v02` played once and stopped at frame 7/7 with the Play button restored. `launched v02` uses the canonical 70ms loop; pause and next-frame controls displayed frame 2/2 correctly.
- The three held candidates are visible in separate diagnostic panels and are explicitly absent from the gameplay pack. User design approval is distinguished from Astra body-scale findings.
- Browser QA found a missing `contacts/contacts-index.json`, causing an HTML-as-JSON error and an empty player. The worker copied the exact index; reload verified the controls and all contacts now initialize.
- Reloaded `/?fight=luffy,luffy&mode=solo&art=custom&debug`: the running fight visibly used the detailed custom Luffy sprites. Captured game warning/error logs were empty. Escape paused the fight. The specific sprite-loader info message was not captured, and no all-move runtime claim is made.

This is a review-page and limited game smoke check, not an all-move runtime contact, hurtbox, grounding or competitive-play certification. Source art and prior versions are preserved; no image-generation call or user approval occurred.
