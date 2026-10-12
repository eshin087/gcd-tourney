# Sasuke round-3 QA (Claude, 2026-10-12)

With this patch, the strict pack (quantize 48) exits 0: 1 ref, 31 ok, 10 manual.

Technical fixes (no new images, no pixel edits). The user's poses are unchanged.
- Fallen poses: each one was drawn at the wrong overall size; the head and the length were off together. Each
  pose was measured in a manual head box using the probe's own method, and against the approved neutral rotated
  to lie on the floor.
  - launched v07: bodyHeight 136 -> 144. The head goes from 0.92-0.94 to 1.010 / 0.988.
  - down v08: bodyHeight 96 -> 108, plus offsets -6 px. The head goes from 0.86-0.90 to 1.033 / 0.981. f1's
    length is 205 px.
  - ko v07: bodyHeight 64 -> 86. The head goes from 0.71 to 0.974, matching down f1.
  - Manual QA records: `r3-launched-v07.png`, `r3-down-v08-ko-v07.png`.
- Gate head against the idle, tightened to within 2%:
  - heavy v11: 218 -> 213, head 1.026 -> 1.000. The kicking leg is 0.87 of the standing leg.
  - throw v07: 201 -> 208, head 0.96 -> 0.993.
- Hit boxes and hand points:
  - heavy v11 f3/f4: on the kicking foot.
  - throw v07 f1: the release point at the mouth.
  - specialUp v09 f2/f3: on the rising foot.
  - See `r3-hitboxes-before.png` and `r3-hitboxes-after.png`.
- Checked and left unchanged:
  - backDash v07: 0.998, though f1 alone is drawn about 6% small.
  - block v07: 1.031 by the gate, but the hair is 0.98-0.99 of the guard's, and its height matches the guard's
    180 px exactly.
  - stagger v08: 0.979.
  - specialUp v09: 1.009.
  - jumpSquat v03 (the spot-dodge pose): the takeoff crouch. Its profile head is 0.96-1.06 by shape match.

Drawing defect (Codex brief in docs/agents/CODEX_INBOX.md, round 3):
- charge v12: only the head is about 5% big (gate 1.035-1.051, shape match 1.06-1.07). The stance, height and
  torso are the idle's. One call is left.

Note for the in-game check: down f1's head is at x 42-85 and getup f0's at x 80-122, so the head moves about 40 px
at the get-up.
