# Killua redraws after yes to all — 2026-10-11

User invoked the current inbox section `Redraws after the user's yes to all (2026-10-11)` and authorized up to three additional generations per listed strip. This batch covers run, light1, heavy, airLight3, airHeavy, special, specialDown, down and ko. Each generator call, including parts, counts toward the strip's three-call additional cap. Exact prompts and saved immutable versions are recorded here. New outputs need new visual approval.

Starting branch commit: afbb974. Claude's b84d66a/afbb974 changes (approval application, measured stitching, scaleFit, exemptions, manual QA) are preserved. No edits to thresholds, exemptions, manual-QA records, scaleFit or builds data.

Reference preflight found the fixed idle_approved.png still held the old idle despite manifest approvedVersion3. It was refreshed byte-for-byte from already-approved raw/idle_v03.png (SHA256 DABD85E2A8124DB44DFCDA275B8E327518A6257E2B3E2D4A8570ADF7A603B61B). A fresh diagnostic pack verifies idle version3, and its generated head_scale_guide reports42x32 hair. This is applying the existing approval, not changing the approved drawing or baseline.

The scratch manifest copies current manifest data with only Killua scaleGate=warn, solely to produce diagnostic heads and a current-idle stitch reference per Claude's inbox instructions. It is never used to claim a strict pass or shipped to public/characters. Real validation uses the unchanged authoritative manifest and `--quantize 48 --strict-scale`. The scratch pack uses `--no-writeback`.

KO/down new versions require Claude's version-scoped manual QA after source/ground/limb evidence is supplied. Codex does not record that decision.
