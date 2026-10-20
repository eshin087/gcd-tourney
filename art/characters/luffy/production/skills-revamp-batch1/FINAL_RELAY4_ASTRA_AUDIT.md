# Batch 1 final Astra manual anatomy and scale audit

Date: 2026-10-19  
Auditor: GPT-6 Astra, medium  
Scope: actual 48-color quantized `special` v04 and `throw` v01 cells after relay #4 sidecar/hit-anchor corrections. This audit is technical evidence; the user approved both drawings separately via Claude relay #2.

## Audited pack

- Sheet: `public/characters/luffy/sheet.png`, 4096×1792, SHA-256 `bf9558cdb575c47e45d74474b749115c7ddd9c7b6993b7d27c75f4e531aa5905`.
- Metadata: `public/characters/luffy/anims.json`; `special` maps indices 100–107 and `throw` maps 90–93.
- References: the packed approved idle and user-approved title-style neutral/combat cells. Applied the user-approved ART-SIZE-R7 / ADR 0041 common ×0.92 fit documented in `art/scale/size-r7/CLAUDE_AUDIT.md`.
- Supporting measurements: `art/scale/body-luffy-special-throw.png`, `art/scale/heads-luffy.png`.

## Frame review

| Animation/frame | Cell | Finding |
|---|---:|---|
| special f0 | 100 | PASS. Twist preserves torso, shoulder and leg proportions. |
| special f1 | 101 | PASS. Deliberate rubber-arm extension; head, torso and planted legs remain consistent. |
| special f2 | 102 | PASS. Further extension does not enlarge the body or head. |
| special f3 | 103 | PASS. Forward punch preserves shoulder attachment, torso and shins. |
| special f4 | 104 | PASS. Held punch tracks f3; no body-scale pop. |
| special f5 | 105 | PASS. Flared vest explains garment-area B≈1.30; chest, waist and legs do not inflate correspondingly. |
| special f6 | 106 | PASS. Recovery restores the arm; head, torso and sandals remain coherent. |
| special f7 | 107 | PASS. Guard returns to the packed idle's build. |
| throw f0 | 90 | PASS. Tucked thighs and folded shins account for shorter silhouette; normal torso/head size. |
| throw f1 | 91 | PASS. Forward extension maintains body dimensions and shoulder attachment. |
| throw f2 | 92 | PASS. Held pose tracks f1; no scale pop. |
| throw f3 | 93 | PASS. Dropping leg increases silhouette height without enlarging head or torso. |

**Result: manual anatomy/scale PASS** for special v04 and throw v01. Both qualify for version-bound `scaleManualQA` records on this exact atlas.

## Measurements and limits

Manual native-pixel readings put special neck-base→sash around 40–45 px, exposed comparable shins around 48–55 px, and hat-crown→chin around 40–44 px. Packed idle neck→sash is around 41 px, with comparable shins around 53–55 px. Representative special f0 landmarks: neck `(140,99)`→sash `(123,140)` ≈44 px; right knee `(173,176)`→ankle `(180,228)` ≈52 px. Endpoint uncertainty is approximately ±5–6 px for torso/shins and ±3–4 px for head/accessory boundaries. Tilt, cuff coverage and perspective prevent a precise universal percentage certification.

Throw's visible torso remains around 40–46 px across its four poses. Tucked shins and overlapping feet in f0–f2 are not numerically certified as bone lengths; joint connections, thickness and clothing volume were inspected visually. Head appearance tracks idle. The heads sheet H≈1.68–1.72 boxes include vest/torso pixels and do not demonstrate enlarged heads. No precise segment-length pass is claimed for occluded limbs.

This audit covers static pixels/anatomy/scale only. It does not certify hand-anchor continuation, attack reach/contact, timing, gameplay, or runtime integration; Claude owns those checks.
