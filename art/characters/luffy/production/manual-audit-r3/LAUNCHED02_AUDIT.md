# Luffy launched02 — diagnostic packed-pixel audit

2026-10-16, Astra. PASS within measurement uncertainty for both actual quantized frames; complete cell fit. No new generation or design approval. This adds a proposed version-bound manual body result; old launched01 remains an undersized historical assembly.

Atlas SHA256 `563832d5fc499f860a5a35e21f8e576c3885b4e1a9c76bd7173807187707a996`; metadata `4267efd0a9d992af50cfe99d21da80319d16cbd02cb30495f4db98570253287d`, under production/launched-calibration-r4/public/characters/luffy. Independently extracted actual slots77/78 into launched02-f0/f1.png; PNG/RGBA hashes and durations in LAUNCHED02_PIXELS.json. Pack uses48 colors,256 cells,pivot128/240, bodyHeight193, source uniform193/615=.3138211382; frameOffsets[73,0]/[51,0]. No source pixels lost, complete final bounds14,54–249,240 and7,48–245,240.

Directly viewed both packed frames at native and3x, plus approved title-style neutral/combat and idle reference. Head/face, hat on back, slim torso, exposed arm chains, shorts volume, legs and sandals are coherent. Cloth flare and bent/reclining pose do not imply a different body build. Both full hand silhouettes and sandal ends fit. Static recoil loop between the two70ms frames is coherent; timed playback, hurtboxes and airborne grounding are not certified here.

Approximate native endpoints, uncertainty±6px in projected segment length:

- f0 neck-base at vest neckline(94,96)→sash-center(121,129)=42.6, versus approved idle41.5±6 and combat40.5. This corrects an early quick-screen point too near the jaw; do not use the earlier46.9 number.
- f1 neck-base approximately(80,96)→sash(105,126)=39.1±6; neckline partly oblique, lower-confidence projection.
- f0 exposed shin(149,173)→ankle(172,216)=48.8±6; second visible shin(189,163)→(219,205)=51.6±6, versus idle52.8±6/combat54.6.
- f1 exposed shin approximately(140,171)→ankle(165,222)=56.8±6. No hidden knee or upper-leg length is invented.
- The prior exact-pose projected measurements resampled by1.419 independently predict torso42.3/39.4 and shin52.1/56.5; these are consistency checks, not substitutes for viewing final pixels.

Central ratios are not exact bone lengths. Visible sash width and sandal top-to-sole rotate with the reclining pose; those are visually coherent but do not receive invented unforeshortened numeric targets. This finding is supported by torso and exposed shin measurements plus every-frame anatomy review, not hair height or a head probe.

The final public atlas still needs strict repacking with this exact version and a full shared-palette recheck of all93 selected frames. The existing91-frame public r3 audit is a different hash. Remaining down/getup/special holds are unchanged. Parent owns user review, runtime checks and Claude handoff; auditor changed evidence only.

## Final strict selected atlas — all93 frames rechecked

2026-10-16 follow-up: directly inspected every frame in all20 actual contacts from `production/launched-calibration-r4/final-strict-pack/contacts/`. Exact sheet hash remains `563832d5fc499f860a5a35e21f8e576c3885b4e1a9c76bd7173807187707a996`; strict metadata is now `7c4cee7a4817fc31f2546c0eb358ed4f9533dcf9fb75c5c4c977d84bac144c6a`. contacts-index.json binds all93 cells/indices/durations. The pack reports exit0,1 reference/19manual,48colors,20animations; down/getup/special remain absent.

Result: prior18 manual body passes remain supported after this shared-palette recomputation, plus launched02 PASS above. All93 frames were visually reviewed, not merely inferred from alpha masks. Skin/vest/shorts/sash/sandals remain separable; no new RGB-induced anatomy defect or sequence discontinuity observed. Static loop/end/start findings and all prior uncertainties remain. GearSecond pink charge and GearThird growing fist are intentional KIT effects. Previously user-accepted placement clips remain accepted exceptions; Claude's beamFire arm-only crop remains a runtime lane condition, not a new body rejection.

This is the final exact strict OUTPUT audit, still isolated until worker copies/packs byte-identically into public. If public hashes match these exact two hashes, no further pixel re-audit is needed; otherwise report the changed artifact. User design approval, Claude runtime contacts, and remaining three core holds are unchanged. No generation is required for the19 passed manual versions.
