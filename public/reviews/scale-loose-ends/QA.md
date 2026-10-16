# Calibrated review page QA — 2026-10-15

The comparison assets were regenerated from the exact production atlas files at Naruto commit `802e673b` and Killua commit `5bda5260`. SHA-256 values are recorded in `review-data.json` and `crops/calibrated/manifest.json`; the source hashes match the requested final sheets and metadata.

An RGBA pixel comparison checked all 20 candidate frames against their declared atlas cell indexes: light2Alt 7, airHeavyAlt 6, charge 4, down 2, and ko 1. Every crop matched its source atlas exactly. The comparison crops retain the native 256 × 256 cell density without resizing. The prior atlases, crops, and Astra reports remain in their original paths as historical pre-calibration evidence.

Root checked the local page in the Codex in-app browser at a 390px viewport; the document scroll width measured 375px, with no horizontal body overflow. All five cards and images loaded, the down pose displayed correctly, and the browser console was clean. Down/Naruto one-shots advanced and stopped; airHeavy replay advanced and stopped; charge pause/next worked; KO remained static at its end frame.

The calibrated Astra reports and their supporting frame strips, comparison grids, references, and `pixel-evidence.json` are copied under `audits/naruto-calibrated/` and `audits/killua-calibrated/`. The page reports their screening verdicts: Naruto light2Alt passes visual anatomy/contact screening, while airHeavyAlt f3 remains a borderline strict-contact hold; Killua's charge/down/ko pass visual screening, with aura retention and runtime grounding still unverified. Hidden or foreshortened anatomy does not receive a numeric ±6% pass. These are technical findings, not user approvals.

This verifies the review page and controls only. No gameplay or production runtime QA is claimed.
