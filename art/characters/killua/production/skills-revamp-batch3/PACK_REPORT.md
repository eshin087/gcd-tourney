# Killua skills revamp Batch 3 pack evidence

Date: 2026-10-18. Branch: `art/killua-skills`.

## B2 `throw_v07`

Command: `node tools/pack-sprites.mjs killua --quantize 48`.

- Packer detected 4/4 poses and attempted re-import from `raw/throw_v07.png` at x0.309.
- Scale gate failed: head 1.28x of idle, feet proxy 1.49x; f1 clipped 17 px at the right edge.
- The command wrote no character atlas or frame output. The existing `frames/throw/` remains v06.
- `npm run body -- killua throw` read the existing v06 frames: B 0.86 and H 0.98. This is stale and is not v07 evidence.
- Astra's report is a provisional raw review only; no final quantized-atlas audit or numeric pass is possible.

## A10 `yoyo_v01`

Command: `node tools/pack-sprites.mjs vfx --candidates`.

- Packer detected and wrote 8/8 candidate cells to `art/vfx/frames/yoyo/` and the ignored local candidate atlas under `public/preview/vfx/`.
- Packer output reports scale x0.519. A pixel scan of the first 256px cell, filtering low-saturation grey pixels associated with the steel body, gives bounds x85..172 and y81..168: about 88x88 px. This approximate disc bound is larger than the brief's 52px target; it is not a user art rejection or game integration result.
- The source is 1774x887 RGB, not the requested canvas dimensions. The packer still separated eight frames. Generator call 1 was transient and could not be preserved or hashed; see `A10_ATTEMPTS.md`.

The VFX candidate command also emitted unrelated `.packer.json`-marked frame folders for other effects omitted by the sparse worktree. Those generated folders were removed after verifying each was within this task worktree and none was raw or versioned input. Only `art/vfx/frames/yoyo/` is retained from this command.
