# Killua Whirlwind — beamCharge v05

2026-10-10. Optional ART-KIL-WW handled after Naruto's Four-Tails candidate batch. Transferred into real worktree `art/killua-whirlwind`. User requested routine autonomous delivery; new art remains unapproved.

Identity: approved silver-white hair, blue assassin eyes, purple/navy clothes, slim child build retained. No lightning or aura in source sprites.

Pose: low relaxed ready stance with loose open claw hands. First saved candidate v04 kept flat heels; two targeted retries produced selected v05 with visible raised heels, toes on floor. v04 is preserved with its own review row. Three attempts total; full generation prompt in WHIRLWIND_PROMPT.txt. Corrections changed only feet to raise heels, keeping identity/scale/upper body.

Technical: complete 42-animation / 175-frame 4096x2816 sheet, 48 colors, 256px cells, pivot [128,240], ppu128. No new pack warnings; existing KO left-margin warning and unrelated fallback boxes remain. No clipping in beamCharge. Foot baseline y240 throughout. f0/f1/f2 bounds [80,55,178,240], [82,56,176,240], [80,56,178,240]; bottom-band x extents [82,175], [84,173], [82,174]. Height incl. hair 186/185/185 versus reference idle f0 182 (loop max186). Bounds are proxies, not skull or standing-skeleton measurements.

Each version has source SHA256 and per-frame crown/chin coordinate estimates in its sidecar. Target30px anatomical head axis; crowns are occluded under hair, so measurements remain explicitly uncertain. Standing skeleton declared182, not directly measured in the bent stance. Human anatomy and gameplay review are still required. Visual recommendation: review v05 rather than v04; no automatic approval.

`beamFire` source, sidecars, frames and its animation metadata are unchanged. Whole-atlas quantization may remap palette colors globally; this is packer output, not a beamFire redraw.

Strict pack repeated in the real worktree: 42 animations, 175 frames, 48 colors; only the unchanged KO 1px left-margin warning. `beamFire` metadata and source/frames verified unchanged against HEAD.

Production build and hosted browser activation QA are recorded in the PR. Local browser routing may fail independently of the build. The cast lineup uses the candidate frame at exactly 1:1 packed scale and does not inherit any by-eye deltoid measurement.

Evidence: whirlwind-contact.png (idle f0, then beamCharge f0-f2), whirlwind-import-v05.txt, whirlwind-pack.txt and [cast lineup](../../../scale/lineup-killua-whirlwind_v05.png). The phone review gallery is `/killua-whirlwind-review/` on this branch preview.
