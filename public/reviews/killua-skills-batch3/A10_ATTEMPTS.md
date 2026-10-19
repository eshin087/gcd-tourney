# Killua skills revamp Batch 3 — A10 yoyo attempt inventory

Worktree: `.worktrees/art-killua-skills`, branch `art/killua-skills`  
Asset: `yoyo`, candidate version `v01`, pending user review.  
Budget: 3 generation calls used; no further calls authorized in this round.  
Selected source: `art/characters/killua/production/skills-revamp-batch3/A10_yoyo_call03.png`  
Selected source SHA-256: `de353170b207ac0b540c0c0b79828d1941e1d28b7cde8c44911e76220a81d0af`  
Filed unchanged as `art/vfx/raw/yoyo_v01.png` (SHA-256 identical).

## Calls

| Call | Prompt record | Source path and SHA-256 | Verdict |
|---|---|---|---|
| 1 | `A10_yoyo_call01_prompt.txt` | **Not preserved:** the initial generator response was emitted only as a transient data URL; the image bytes and hash were not saved. | Superseded. Output had noticeable placement/format issues; not selected. Provenance incomplete. |
| 2 | `A10_yoyo_call02_prompt.txt` | `A10_yoyo_call02.png`; `532bacb125566cc80c6bd242912512ce4161a0d67f78af7c687b2aefe2890962` | Clear disc and spin, but lightning clustered above/below and generated strip canvas did not match the requested dimensions. Not selected. |
| 3 | `A10_yoyo_call03_prompt.txt` | `A10_yoyo_call03.png`; `de353170b207ac0b540c0c0b79828d1941e1d28b7cde8c44911e76220a81d0af` | Selected: steel disc reads clearly; spin phases show 0/90/180/270 degree steps; thin arcs distribute around the disc. |

## Technical notes

- Selected PNG dimensions: 1774 x 887, RGB, despite the requested 2048 x 512 canvas. The image visually contains eight yoyo frames; output canvas dimensions require validation against the packer's splitting behavior before integration.
- Source yo-yo looks about 118 px across before packing; table fill 0.42 predicts about 50 px at final 256 px cell scale, near the 52 px brief target.
- Raw is the exact generated source copied without image edits. Candidate remains unapproved. No shared review, tracker, manifest, changelog, or task records were changed.
