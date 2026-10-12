# Naruto KO and airLight3 follow-up v09

**2026-10-12: user approved both v09 artwork samples. KO technical calibration/anatomy/contact HOLD remains; the 77px fit remains diagnostic only. See APPROVALS.md.**

User rejected ko v08 (“looks really bad”) and airLight3 v08 (“looks bad”) on 2026-10-12. Their versioned raw strips, sidecars and kick parts moved into the adjacent _rejected directories; round2 evidence is preserved. This follow-up used exactly ONE new built-in call for KO, ONE for kick Part A and ONE for Part B. No further image calls are authorized for this follow-up. At generation, approvedVersion was7 for both assets.

## airLight3 v09 — recommend visual review

Four-plus-two whole-figure parts redrawn against the exact approved title neutral/combat and working idle07. A/B retain one head, jacket length, pelvis and limb construction; B was generated at a larger source magnification, corrected by the current stitch tool's measured B factor0.7164. That factor warning is preserved; the raw canvas did not obey the declared2x source magnification, so numbers in the prompt are intent, not verified output dimensions. New kick face is compact/title-style, torso lean, first hanging leg and active heel leg retain full thigh/shin construction. The compact attached crescent stays inside the kicked leg's occupied outline after placement.

Initial strict isolated pack read ok but clipped f2 by2px at right. The inferred original extent was x257 (visible max255 plus2 clipped), so a measured8px left shift restores x249, without scale or pixel edits. Final strict exit0, strip **ok**, zero warnings. Head median1.048, all frames1.016–1.054. Native bounds:
f0 x113..207, f1 x62..165, f2 x61..249, f3 x70..251, f4 x109..196, f5 x110..200. Soles/low point y240. Actual48-color atlas compared frame-by-frame with exact approved neutral/combat and idle07, including active foot/crescent and both recovery legs. Different bounds reflect tuck and extension; no standing-height normalization. The kick is one-shot, not a locomotion loop; recoil-to-air-base handover shown in native player.

## ko v09 — HOLD for calibration/anatomy/contact QA

Newly drawn whole pose from title anatomy/face/style and the original approved ko05 pose. Supine silhouette remains: head left, eyes closed, one knee raised, near leg extended with original slight bend, relaxed spread palms. No head-only enlargement or pixel edit. Source face/neck is cleaner than rejected v08. Current official manifest bodyHeight59 uniformly fits the new source at0.095 and visibly makes the whole pose small. Position-only+1px repairs the initial left-margin intrusion: x4..177, height59. Strict exit1: **unmeasured**, floor contact30%, worst fifth18px above floor. These are not numeric passes and no exemption/manual pass was added.

### Calibration exploration (DIAGNOSTIC ONLY)

Approved neutral/combat and current idle were independently compared with down05 f1 and the new KO at native density. Approximate manual anatomical correspondence under clothing/foreshortening, with endpoint uncertainty:
- Neutral skull axis crown-to-chin ~30 ±4px; current KO projected skull axis ~19 ±4px. The prone/upturned head makes this particularly uncertain.
- Neutral neck-to-hip chain ~65 ±6px; current KO ~57 ±6px. Jacket volume and the near arm obscure endpoints.
- Neutral near thigh/shin chain ~79 ±8px; current KO projected chain ~60 ±8px. The original ko05 provides pose semantics, not a numeric anatomy target; its historical31px sidecar is superseded.
- Source equivalents at current import0.095: skull ~200 ±42px; neck-to-hip ~600 ±63px; projected thigh/shin ~632 ±84px. These are back-calculated estimates from current packed landmarks, not independently certified source bones.

These correspondences disagree enough that they do not certify a production calibration. The projected leg chain supports exploring a whole-source1.25–1.35 fit (no head-only scaling), while face foreshortening and cloth volume require Claude's manual judgment. A diagnostic77px pose fit is1.305x current59. The foot-derived pivot predicted leftx=-35.1; a measured+40px diagnostic offset produces x6..232, height77. This is **a proposal for inspection, not a production target**. Diagnostic head probe .833 remains unmeasured. Face/neck reads clearer and whole figure is visually closer to the baseline, but ground/anatomy still needs review.

Official manifest bodyHeight is unchanged59. Official v09 sidecar only+1px placement; the77px/40px parameters exist solely in calibration-diagnostic.mjs and its disposable fixture. All new raw pixels are unchanged. Claude should review skull/torso/leg proportions, source fit and contact before accepting any calibration or production atlas. Do not recommend approval of the59px packing.

## Evidence and reproducibility

- qa.mjs <asset> art/characters/naruto/raw/<asset>_v09.png 9 rebuilds an isolated fixture with only idle07 and the named source. Gate thresholds, build declarations and anatomy data stay unchanged. A failed/unmeasured pose receives a separately labeled warning-mode diagnostic atlas; it is never called a strict pass.
- comparison.mjs produces native title-neutral/title-combat/idle/down/KO evidence and all six kick cells.
- calibration-diagnostic.mjs produces the explicitly labeled77px proposal; does not change production manifest/raw/sidecar.
- Strict logs, metrics, heads sheets and lineage/attempt inventory are alongside this note. Native diagrams are actual quantized atlas cells; no cached frames or source-only claims.
- The source palette contains fine detail; packer quantizes to48 colors. No tool, engine, unrelated strips, other fighter, UI, main, NOW, inbox or ART-TECH-01 changes.
- Hosted browser verification remains blocked by the already reported Vercel access restriction. No share-link/access bypass or indirect workaround was attempted. Native inspection completed; interactive hosted playback remains unverified.

Final verification: full strict exit1,33ok/6manual/2unmeasured; failed spin and ko. Kick remainsok withno margins/clips. Official character atlas notwritten. Restricted-profile build passed82modules; player/script syntax and gitdiff whitespace checks passed.
