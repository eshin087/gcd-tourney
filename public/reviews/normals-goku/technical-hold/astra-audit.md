# ENG-112 Goku import and scale recheck

**Disposition: technical HOLD for all ten v01 drawings (dSmash v02).** This is an independent GPT-6 Astra medium recheck of the current 48-color diagnostic atlas. It does not grant visual approval, game-contact validation, or permission to ship. Goku's head probe is known invalid, so no head-probe values were used as anatomy evidence.

## Evidence set

- Atlas: `production/eng112-dsmash-v02-diagnostic/characters/goku/sheet.png`
- `sheet.png` SHA-256: `d4e3dea2b0ec19871e3b7d90f4b51942f0f69247352e70f9b94d5a51bb6665e9`
- `anims.json` SHA-256: `9059fbc09ef84b06e31f0ea99c636a90466284cc56ae5841df26c5868a0d91c9`
- Packer report: `production/eng112-dsmash-v02-report.json`
- Scope: all 70 candidate frames; Goku idle v02 frame 0, live `light2`, `light4`, `heavy`, `airLight1`, and approved title-style neutral/combat fixture cells.
- Atlas ranges: fTilt 111–117, uTilt 118–124, dTilt 125–130, dashAttack 131–137, fSmash 138–146, uSmash 147–154, dSmash 155–162, fair 163–168, bair 169–174, uair 175–180.

## Per-move findings

| Move | Result | Evidence and limits |
|---|---|---|
| fTilt v01 | HOLD: landmark evidence and contact phase | Whole figure is intact and adult build/clothing broadly match live `light2`. Cell 113 (f2) is still bent-arm preparation although phases `[2,2,3]` mark f2–f3 active; cell 114 (f3) has the full extension. Claude should verify contact timing. |
| uTilt v01 | HOLD: undersized | Guard endpoints 118/124 are smaller in hair, arms, boots and gi than idle. Cell 122 reaches y25, so any measured fit must also solve top clearance. |
| dTilt v01 | HOLD: scale evidence | Low shin strike and connected recovery read coherently; guard cells are broadly near idle. Covered knee/hip joints prevent strict segment clearance. |
| dashAttack v01 | HOLD: scale evidence and runtime placement | The frame offsets remove the cuts; cell 134 has a complete extended kick with 10px right margin. Horizontal air movement still needs runtime contact review. |
| fSmash v01 | HOLD: scale evidence | The erase rectangles remove grid residue and restore row-major order. Preparation 138–141, active fists 142–143 and recovery 144–146 are intact. Torso/belt and trouser volume look fuller than `heavy`; measurements do not settle the ±6% requirement. |
| uSmash v01 | HOLD: undersized | Guard/recovery 154 and preparation 147 show smaller boots, torso, arms and hair silhouette than idle. Cell 151 reaches y25; do not enlarge without checking top margin. |
| dSmash v02 | HOLD: oversized upper body | Cells 158/159 show simultaneous left/right low kicks with connected boots. Cleanup removes the source grid; no dSmash clipping remains. Head/hair, arms and clothing volume look conspicuously larger than idle, including cells 155/161/162. Do not choose a whole-strip fit from crouch height alone. |
| fair v01 | HOLD: landmark evidence | The calibrated strip factor `.92` clears the margin and preserves intact airborne kicks. Rotation/occlusion leave body landmark ranges inconclusive against `airLight1`. |
| bair v01 | HOLD: scale evidence | The offsets clear both rear strikes; cells 171/172 have 5px left margin. Rearward attack reads correctly, but torso and clothing volume look narrower than `airLight1`. |
| uair v01 | HOLD: scale evidence | Vertical kicks 177/178 are complete and fit inside the cell. Torso/build appear reduced versus `airLight1`; rotated knees make limb comparison uncertain. |

## Landmark samples

Approximate visible-contour ranges from representative native cells; not concealed-bone measurements and not a claim that every frame lies inside the range. Clear ground guards have about ±3–4px endpoint uncertainty; rotated aerial poses about ±5–6px.

| Sample | Boot top to sole | Neckline to belt | Visible belt span |
|---|---:|---:|---:|
| idle0 | 36–41px | 37–43px | 36–42px |
| fTilt 111/117 | 35–41px | 37–44px | 36–43px |
| uTilt 118/124 | 26–31px | 30–36px | 29–35px |
| dTilt 125/130 | 36–43px | 39–46px | 37–44px |
| dashAttack 131/137 | 34–42px | 37–45px | 35–43px |
| fSmash 138/146 | 35–43px | 42–49px | 41–48px |
| uSmash 147/154 | 25–30px | 29–35px | 28–34px |
| dSmash 155/162 | 35–43px | 44–53px | 47–56px |
| fair 163/168 | 33–42px | 35–45px | 35–45px |
| bair 169/174 | 29–36px | 29–37px | 28–36px |
| uair 175/180 | 29–37px | 29–37px | 29–37px |

Shin length remains unmeasured because the trousers conceal the knee and boot-top relationship; foreshortening also affects several aerials. Hidden skull, upper-arm and hip centers have the same limitation. These ranges do **not** support `scaleManualQA: pass` under the requested anatomy tolerance.

The packer reports all 34 animations / 181 frames complete. Its only warnings are pre-existing Goku `win` height and `getup` floor placement; no new-strip frame clips a cell. The dSmash sidecar erases 11 source-divider rectangles while preserving `raw/dSmash_v02.png` unchanged (SHA-256 `A553402373AE19C6BEC4FD31F99A89501D84607B80655E6AB035856D23FB9B82`).
