# Killua round-3 QA (Claude, 2026-10-12)

The gate reference is the approved combat cell (head box 40x31). The strict pack (quantize 48) with this patch
exits 1: charge only.

Technical fixes (no new images, no pixel edits):
- idle v08 (approved): frame 0 sat 2 px left of its neighbours. A sidecar offset f0 [2,0] removes the twitch at the
  loop wrap, and the shoes now hold within 1 px. The head reads 0.983 of the combat cell. See
  `idle-v08-onion.png` and `idle-v08-wrap-after-offset.png`.
- beamFire v09: bodyHeight 127 -> 123. The lunge frames are now the tallest, and every part was 3-5% over v08.
  The head goes 1.038 -> 0.996. Hand points re-measured. See `beamFire-size-v08-v09.png` and
  `beamFire-v09-bh123-boxes.png`.
- run v09: bodyHeight 162 -> 158. Part A is v08's and was packed 2.1% bigger without the stitch factor. The head
  goes 1.032 -> 1.001.
- idle v08, stagger v05 and taunt v05 pass, each within 2%.

Drawing defects (Codex briefs in docs/agents/CODEX_INBOX.md, round 3). All three image budgets are exhausted.
- charge v13: the head and hair are drawn about 8% small for a body at reference size.
  - The body measures at reference size: shoes 0.95-1.01, collar 0.96-1.03, sweater 0.97-0.99.
  - The hair is narrow: silhouette 41-42 px against the reference's 45.
  - Approved v11 also fails (head 1.077).
  - See `charge-v13-vs-refs-native2x.png` and `charge-heads4b.png`.
- beamFire v09 f1: the recoil moves the head 16 px, the torso 14 px and the palms 15 px behind the beam root.
- run v09 part B:
  - The legs alternate only by overlap, with no far-leg shading.
  - f5 sits 6 px high and leans back, so the head lurches 41 px from f5 to f6.
  - See `run-v09-legs-B.png` and `run-v09-f2-f6-overlap.png`.
