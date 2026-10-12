# Gojo round-3 QA (Claude, 2026-10-12)

With this patch, the strict pack (quantize 48) exits 0: 1 ref, 33 ok, 8 manual. The three holds below are visual,
and each one is a drawing defect.

Hit boxes, re-measured where the packed version changed (only the airLight3, airHeavy and special blocks):
- airLight3 v12 (approved): the right shoe, sole forward, at hip height. The front edge is 0.66/0.68 units ahead of
  the pivot, so it connects up to about 1.12 units of spacing. Contact is the same as v10's.
- airHeavy v08: the clasped hands. The v07 boxes sat on the forearms behind them.
- special v07: the two-finger hand. This is cosmetic, because Lapse: Blue is a pull vortex.
- See `boxes-before.png` and `boxes-after.png`.

Drawing defects (Codex briefs in docs/agents/CODEX_INBOX.md, round 3):
- run v12, the hover-glide:
  - The figure is drawn 6-8% shorter in part A than in part B at the same head size: A is 203-213 px tall,
    B is 215-221 px.
  - So the crown jumps 10 px at f3 -> f4 and 8 px at the loop wrap.
  - The toe tips slide on the floor.
  - See `run-v12-seams-3x.png` and `run-feet.png`.
- special v07: part B's body is about 10% short for its head (211 px against A's 231 px). The crown drops 20 px
  at f2 -> f3.
  - v05 (approved) has the reverse 8% step, plus fingertip fragments.
  - A Claude-assembled v07 A + v05 B brings the fragments back.
  - See `special-v07-seam-3x.png`, `special-v05-packed.png` and `special-mix-v07A-v05B.png`.
- airHeavy v08: the head alone is about 5% big (1.03-1.09) on a body that matches airLight1.
  - Approved v07 fails strict (pop).
  - See `heads-airHeavy.png`.
