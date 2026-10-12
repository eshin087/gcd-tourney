# Naruto round-3 QA (Claude, 2026-10-12)

Technical fixes (no new images, no pixel edits):
- ko v09: bodyHeight 59 -> 77. At 59 the whole figure was about 23% small next to down v05 f1, the same lying body.
  At 77 the head silhouette is 0.985 of the idle (down f1: 1.005), crown-to-chin is 41 px (down f1: 41) and
  hair-to-toe is 206 px (down f1: 204). The sidecar's +39 px offset puts the hips on the pivot.
  This passes manual QA (`ko_v09_claude_manualqa.png`), and the user's pose is unchanged.
- Gate head against the idle, tightened to within 2% by bodyHeight:
  - charge v07: 172 -> 167, head 1.032 -> 0.999.
  - jumpUp v06: 198 -> 205, head 0.974 -> 1.011.
  - specialDown v05: 204 -> 199, head 1.023 -> 0.986.
  - airLight3 v09: 201 -> 192, head 1.048 -> 1.006. Its f2/f3 offsets go to -2 px so the two kick frames line up.
- Hit boxes:
  - airLight3 v09 f2/f3: re-measured on the kicking sandal.
  - light2 v06 f3: the auto box had picked the hair after the size pass, so it is now set on the jab fist.
- run v08 moved to raw/_qa_hold/, so the user-approved v07 ships (head 1.005).

Drawing defects (Codex briefs in docs/agents/CODEX_INBOX.md, round 3):
- spin v07: the head is drawn 10-18% too big for the body. Hands and sandals match the combat cell.
  See `spin_v07_head_drift.png`. One call is left from the round-2 extra authorization.
- run v08 part B:
  - f4 repeats f0's leg roles.
  - f4, f6 and f7 are drawn 17, 19 and 24 px lower than f0, f2 and f3.
  - At the loop wrap f7 -> f0 the crown rises 40 px.
  - See `run_v08_seam.png`. The part B budget is exhausted.

Strict pack (quantize 48, --strict-scale) with this patch: exit 1, spin only.
