# Killua torso samples — REJECTED 2026-10-11

**DO NOT MERGE.** User rejected the new fallen sprites and prefers the older ones (2026-10-11). Stop torso production; new cast direction is a separate draft. Raw files/sidecars moved to raw/_rejected. Prior approved versions and runtime atlas unchanged. All pending/recommendation wording below is historical pre-rejection evidence.

New candidates: **down v06** (two successful imagegen calls, second selected) and **ko v07** (one successful call, selected). A missing-file KO request failed before generation while Claude moved its target into `_hold`; it produced no image. Limit three successful attempts per strip. No more generation recommended.

## Verdict

Identity: approved white hair, face, purple shirt, scarf and shorts retained. Anatomy: the overlong lying shirts are shorter, with similar head/leg scale to approved idle v03. Side-on impact/rest poses and clear scarf/hem joins remain. All three frames were inspected by worker and independently by lead.

Technical: whole-character strict pack exits **1**, only down v06 and ko v07 are `unmeasured` lying poses requiring Claude's version-scoped manual QA. No manual certification, exemption, scaleFit, threshold, build data or tools were changed. The existing runtime atlas remains Claude's last successful pack with approved temporary stand-ins. New pixels need user approval. This is a diagnostic sample, not a strict pass or merge-ready atlas.

## Same-scale measurements

All ranges are packed pixels, with approximately ±3–4 px uncertainty at hidden shoulder/scarf and curved fabric boundaries. They are visual landmarks, not certified bone lengths. First cell is approved idle f0; in old/new sheets the top row is held old pixels and bottom row is the selected correction. No independent per-pose silhouette fit was used.

| Pose | Purple scarf-edge to hem | Shoulder to hem including scarf | Interpretation |
|---|---:|---:|---|
| Approved idle v03 f0 | 40–43 | about 50 | Claude comparison reference |
| Held down v05 f1 | 50–55 | about 58–63 | Claude failed long torso |
| New down v06 f0 | 36–39 | 46–51 | Curved/flexed impact pose, mild foreshortening |
| New down v06 f1 | 38–42 | 48–53 | Rest torso close to idle |
| Held ko v06 | 56–58 | about 64–66 | Claude failed long torso |
| New ko v07 | 40–43 | 48–53 | Rest torso close to idle |

Approximate packed local endpoints: down f0 purple (95,228)→(133,226); down f1 (92,228)→(132,225); KO (74,230)→(117,228). Scarf diagonals and shirt folds make a single horizontal color run shorter than the anatomical centerline. Heads remain within source measurement uncertainty: down 110±18 px each, KO 150±20 px, native2172×724 unchanged; target skull24.225774996334824px. No calibration was changed to force a verdict. The source KO knee/ankle outlines shifted slightly: packed near shin approximately40–43px vs idle roughly36–40px; joint/cloth occlusion uncertainty prevents treating this small residual difference as certified equality. Claude must examine it with the torso.

Down first attempt over-shortened shirts to approximately33–35px. Second edit extended just shirts toward target; selected best only. KO first edit matched target. Arm pose changes accommodate the shorter torso; head, scarf, shorts and legs are not deliberately rescaled. Body compression is not hidden by enlarging the whole figure.

## Evidence and reproduction

- [Down old/new/idle](contacts/down-old-new.png), [KO old/new/idle](contacts/ko-old-new.png), [down current](contacts/down.png), [KO current](contacts/ko.png).
- [Heads](final-scale/heads-killua.png), [lineup](lineup.png), [strict report](strict.json), [prompts](PROMPTS.md).
- `node tools/pack-sprites.mjs killua --quantize 48 --strict-scale --json`: exit1, refuses production write. Other40 animations are ref/ok/existing Claude manual.
- Diagnostic only: copied manifest with Killua scaleGate=warn, `node tools/pack-sprites.mjs killua --manifest art/characters/killua/production/torso-fix/scratch-art/manifest.json --out art/characters/killua/production/torso-fix/scratch-public --quantize 48 --no-writeback --json`. This creates review cells, never production outputs.
- `node tools/scale-audit.mjs killua --root art/characters/killua/production/torso-fix/scratch-art --public art/characters/killua/production/torso-fix/scratch-public --out art/characters/killua/production/torso-fix/final-scale`. Scale baseline write stays scratch-only.
- `npm.cmd run lineup -- --candidate art/characters/killua/production/torso-fix/candidate-ko.png --name killua-ko-v07 --out art/characters/killua/production/torso-fix/lineup.png`. Other lineup columns are historical worktree cast data; same-character contacts are the relevant anatomy comparison.

Prior idle-baseline warning (43×32 vs stored51×36) and stale airHeavy-v02 exemption warning are historical and unchanged; no acceptance/reset performed. Claude's hold-history commit e0ae853 preserved. Git writes require scoped escalation in this chat; no ACL changes. `npm.cmd` preserves flags.

Recommend `approve killua down v06` and `approve killua ko v07`, contingent on user visual judgment. Claude manual QA remains a separate technical requirement.

Validation: production build passes; local review loads8/8 images. Game logs custom Killua sheet42animations, retaining existing atlas. No application errors; only existing favicon404. Strict rerun after metadata updates exits1 with only down6/ko7 unmeasured.
