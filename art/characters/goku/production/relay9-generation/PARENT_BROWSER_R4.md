# Parent browser QA — Goku relay9 r4

2026-10-16. Review gallery: /characters/goku/calibration-r4/index.html, local port5241.

- Heavy v14 candidate and actual atlas players progress through eight frames and stop at frame8/8,30ms. Actual atlas idle loops from8/8 to1/8; Previous/Next pause playback before stepping. The initial loop-control defect was corrected before publication.
- The approved native reference strip renders at768x256 (three256px cells). Candidate and actual atlas cells render256x256; the separate enlarged views are labeled. Initial reference thumbnail scaling was corrected. Whole-page scroll width1265 at viewport1280: no page overflow.
- Light3 v11 frame5/7 displays the same pose in256 and280 native cells. It explicitly reports680 lost foreground pixels in this frame and0 in the roomy companion; total loss800 is clearly held/excluded. All images loaded after pausing; no missing assets observed.
- Final status distinguishes heavy14 technical PASS awaiting drawing approval from light3v11 clipping HOLD. The actual22-animation/101-frame atlas player omits light3 and reads the branch sheet/anims.json.
- Local Goku-vs-Goku fight loaded. Console2026-10-16T07:29:33.710Z: [sprites] using custom sheet for goku (22 animations, incomplete preview). HUD rendered and game paused after smoke check. No localhost5241 warnings/errors captured. Earlier Vercel-login messages in the reused tab were excluded from this local result.
- Exact audited/public sheet SHA256 f117d996d5d9f225b13bfc6d7b19a741e603fa04a329b1410422263eadd824f2; metadata2ee25e2a2103a145f1a888700b5e55cd19ddb0fd7a755649f1056226e6fdbbd6. Worker real-input strict pack reproduced both hashes at x1. Hosted hashes are checked after committed preview publication and recorded in the handoff.

This is gallery/game-load smoke evidence, not full timed gameplay, grounding, contact-zone or hitbox certification. User drawing approval remains separate; Claude owns runtime/integration. No test suite or new image call by parent.
