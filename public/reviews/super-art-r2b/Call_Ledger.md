# Super Art Round 2b generation ledger

Date: 2026-10-16. Workspace: `.worktrees/art-super-art-r2b`, branch `art/super-art-r2b`.

All images were generated with the built-in imagegen tool. Each final `_v01` is the only selected candidate filed in the worktree; original generated outputs are retained in `E:\Vibe Coding\.codex\generated_images\01a1435f-e454-7cb1-af5f-407af1ca9c35`. SHA-256 values below are for the filed worktree candidates, except the noted discarded Goku attempt.

## Candidate and call inventory

| Character / asset | Calls | Selected generator output | Discarded/failed call details | Filed candidate SHA-256 |
|---|---:|---|---|---|
| Goku `ui_super_bg_v01.png` | 2 | `exec-7cc24759-c5c0-4c3d-8550-8fa194961e90.png` | Call 1 retained as `exec-7924a7e2-3bdf-467d-b64a-8b0fd8cfa81f.png`; visually compared against call 2. Call 2 selected for brighter red action concentrated across the required central crop band. Discarded call remains preserved outside the repo. | `8C567B9D60B69C39F442471AE77F9BF49A02541A990C89074F050CD86F4EA292` |
| Goku `ui_super_fg_v01.png` | 1 | `exec-b71d235c-de49-4391-aa92-8c5c755eca8c.png` | None | `A1FF2D2A552BBB75E5D6B75C416208C7B2BBD18CDB484D1890039845C4C8953A` |
| Goku `ui_ult_bg_v01.png` | 1 | `exec-10c1d2b5-83dd-45bc-b890-6dc26610ff14.png` | None | `0D493F299488EB5ADA85ED62EF6F33B75C2BD52E34C95EBFFA16144C2CB4E0B0` |
| Goku `ui_ult_fg_v01.png` | 1 | `exec-1c4fc246-d6ea-43c3-a549-9306c5d99af9.png` | None | `F19929330909633929F8DD2ABDC1516259E4B2A7AF5EAEE336269CC83268D1B8` |
| Luffy `ui_super_bg_v01.png` | 1 | `exec-9d44e27b-598a-4424-9834-42320d31819d.png` | None | `8A8564B595EC8675418D2326C7BEAFC10FB5DB77415A96E5F4C3703C67A72C32` |
| Luffy `ui_super_fg_v01.png` | 2 | `exec-d0045c03-22c0-44c0-8df7-085980cf2833.png` | Call 1 failed before generation because the reference path for `naruto-combat_v01.png` omitted the `title-style-pilot` directory. Corrected path used on call 2. No image output from failed call. | `2D1A463581D070AD7946BBF7F22F7AD76E86F466A4C85217FD01ADCF56B0F9F0` |
| Luffy `ui_ult_bg_v01.png` | 1 | `exec-470506d6-9986-440e-ae82-6e2934fe1851.png` | None | `9B4B9844C343DA363A5D5F4455FD63E6F97BBA27A53F9223794D0D3D6AEB8F33` |
| Luffy `ui_ult_fg_v01.png` | 1 | `exec-c8202ca3-dc07-429c-9cc7-11eaefc4cca2.png` | None | `2B523C22E91E939315D4B30F0570C228B8ABF715EA8C47CEF89B3D25DAFB13F2` |

Total: 10 tool calls, 9 successful image outputs, 1 failed call, 8 filed candidates. All outputs/calls stayed within the three-call-per-image budget.

## Prompt and input provenance

Exact generation directions are recorded in the Round 2b sections appended to each fighter's `PROMPTS.md`; those sections state composition, crop, pose, identity constraints, background rules, and pixel-style limits.

- Goku cutouts used approved `reference/title_style_draft.png`, `reference/model_sheet.png`, `reference/expressions.png`, and the approved pilot Naruto neutral/combat cells (`public/art-review/title-style-pilot/naruto-neutral_v01.png`, `naruto-combat_v01.png`). Goku backdrops used no identity images.
- Luffy cutouts used only approved `reference/title_style_draft.png` plus approved pilot cells. SUPER FG used Naruto neutral/combat; ULT FG used Naruto and Sasuke neutral/combat. No Luffy model sheet, expressions or idle inputs were attached. Luffy backdrops used no identity images.
- The approved-cell inputs are comparison/style anchors only; they do not grant art approval. All eight candidates remain unapproved.

No eye-strip section existed in either fighter's current `PROMPTS.md`; the Round 2b section was appended after the existing prompt content. Luffy's file previously described its title-style reference as pending, which is stale relative to the user authorization supplied for this task.

## Technical notes

- The cutouts are visually crisp and on magenta, but still require automated color-key / crop review before integration.
- The backgrounds read as pixel art at presentation size but show painterly-looking texture in some sky/stone detail. Review against the hard-pixel contract before approval.
- Candidate-only packing and the review gallery were completed; no fixed-name UI copies were made.
