# Sasuke round 4: Claude calibration (2026-10-14)

Requested in `../CLAUDE_RECALIBRATION_20261014.md` (Codex, source `383747c`). No generation, no budget change, no art
approval, no merge, no deploy.

## superDash v07: fixed (fit, not drawing)

Cause: the sidecar asked for the packer's auto head fit. It measured 1.42 at bodyHeight 108, outside the packer's
0.75-1.33 range, so it clamped to 1.33. The strip then packed too small for its own measured fit, and with the feet on the
fixed pivot both outstretched fists ran 13-19 px past the right edge (the raw source is complete, as Astra found).

Fix (`raw/superDash_v07.json`; Codex's `anatomy` kept as `codexAnatomy`): explicit **bodyHeight 153** (= 108 x 1.42, the
measured fit), and both frames **23 px back** (the measured 19 px overflow plus the 4 px margin; the same shift on both
frames, so nothing jumps). Packed: head probe 1.008 (f0 1.001, f1 1.015), body garment area 0.96-0.98 of idle07 (the
shipped v05 was 0.80), bounds x 69-251, both fists complete.

## jumpSquat v06: calibrated + manual QA for this version

`raw/jumpSquat_v06.json` bodyHeight 162 -> **157** (k 0.97): at 162 the profile sandal sole read 36 px against idle07's
32-33 (about 1.09). Packed: head 0.996, garment area about 0.92, sandal about 1.06. The crouch defeats the automatic head
read, so the manifest's `scaleManualQA` is now recorded for **v06** (it was for v03), with `body-sasuke-round4.png` as
evidence. This is Sasuke's spot-dodge pose: it no longer reads bigger than the idle.

## beamFire v07 and dash v07: measured, inconclusive where covered

- beamFire v07 (auto head fit x0.8482, inside range): head 0.995; profile sandal sole f0 33 px vs idle 32-33 (1.0); f1/f2's
  sole splits around the strap (6 + 21 px), so it is inconclusive by this reading. Its **beam hand anchors** were the v06-era
  points scaled by the fit and sat 17-19 px in front of the palm and 12 px low; `hitboxes.json` beamFire now puts them on the
  palm tip (199,112 / 201,112 / 198,113) with `"_scale": 0.8482`, so the beam starts at the hand.
- dash v07: head 1.013; profile sandal 30-32 px vs idle 32-33 (0.94-1.0); the front foot reads 22 vs 19, a yaw difference.
- Full-body verdicts stay with Astra where clothing covers the joints.

## Atlas

`node tools/pack-sprites.mjs sasuke --quantize 48 --strict-scale` passes (1 ref, 31 ok, 10 manual). `public/characters/sasuke/sheet.png`
sha256 `a2a8faed1e07f105bfa0db9e3bb401217a3e47b43363ff5aad9ea82c8822f55e`, `anims.json` sha256
`3e6cc01adaffda8bf101e1412ad708af3c65d9f3a4d4d9a303c3756c593334bb`. Retained run v05, airLight3 v07, specialUp v09, hurtLow v03,
airRecover v01 unchanged.
