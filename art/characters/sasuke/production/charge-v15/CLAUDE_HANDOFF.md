# Sasuke charge v15 technical handoff

Candidate: `art/characters/sasuke/raw/charge_v15.png`, scripted composite from v14. It is not user-approved; v12 remains approved and active. Exact atlas hashes and frame-by-frame findings are in `AUDIT.md` and `measurements.json`.

## Current status

- Packed on current `main` at 48 colors, cells 115–120, 70/90/110/110/110/110 ms, `loopFrom: 2`.
- Body proxy B is 0.973–1.006. Hair-inclusive H is 1.034–1.077; f3 exceeds the brief's 1.07 maximum because trailing hair extends the probe box. Astra's version-bound `SCALE_MANUAL_QA.md` could not certify the hidden skull within uncertainty; do not add an exemption or call this a scale pass.
- Packed feet are identical in f2–f4. f5's right sandal is 2 px narrower than f2; soles stay on y240, within the revised outline tolerance.
- Broad pixel differences across the held loop may be cloth/shading motion; static evidence cannot prove shimmer. In-game lab playback, including the f5→f2 transition, has not been observed.
- No art approval, preview deployment or merge is requested. The review page is clearly marked technical hold.

## Requested follow-up

Please perform the in-game lab playback at the packed timing and report whether the f2–f5 motion reads smoothly and f5→f2 pops. Revisit f3's head scale only if you can obtain a defensible measurement of the actual skull/face against the approved references; preserve the 1.077 probe value and the current evidence. If the remaining checks still cannot clear, keep v12 active and hand back the exact additional evidence or correction needed before a user review.
