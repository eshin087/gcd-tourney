# Gojo proportion study generation log

These are review-only study images. They are not production references, strips, or approved art. A file's `_v01` suffix identifies a saved study result and does not change the production manifest.

All successful calls used the built-in image generator in the `gpt-6-luna` / medium Codex session, with the approved Gojo neutral and combat cells attached. C calls also attached approved `run_v14` and `dash_v11` only to guide jacket and sleeve volume. Each returned file was copied immediately from the exact path in its tool response, then hashed in the study worktree. Source images remain in the generator output folder.

| Cell | Call | Result | Saved study file | SHA-256 | Notes |
|---|---:|---|---|---|---|
| B neutral | 1 | Lost output path | — | — | Initial tool result was not captured before the execution context ended. No global-newest lookup was used; no candidate was filed. Counts against the B-neutral budget. |
| B neutral | 2 | Saved | `gojo-neutral_study-B_v01.png` | `3D45162435B76334FA8F1A28056297261525AF5F93A147223BDD1E5576C81012` | Generator path: `E:\Vibe Coding\.codex\generated_images\01a14c4c-2860-74b0-9d18-73511d6596c2\exec-36bbb48a-faf1-497a-bc73-1b32a8a230cc.png`. |
| B combat | 1 | Saved | `gojo-combat_study-B_v01.png` | `74B0D0A4BAA83334932DB8B61A4602944B9B23578E68825FC621B19F459DA149` | Generator path: `E:\Vibe Coding\.codex\generated_images\01a14c4c-2860-74b0-9d18-73511d6596c2\exec-00e69d48-e492-47ba-b9eb-bf81a28f1a1b.png`. |
| C neutral | 1 | Saved | `gojo-neutral_study-C_v01.png` | `BFAD9FD9432DC4745B8A8BF1155CBB45A762ED06D2EE23854AB29389B1F00A98` | Generator path: `E:\Vibe Coding\.codex\generated_images\01a14c4c-2860-74b0-9d18-73511d6596c2\exec-40eb52e2-c4d6-4bfe-bf20-0a1bfab830cb.png`. |
| C neutral | 2 | Saved | `gojo-neutral_study-C_v02.png` | `52D76EF8BB62F831C43646BC8FF92570439B008BC111A4BAE0818D05B5ECE3AD` | Generator path: `E:\Vibe Coding\.codex\generated_images\01a14c4c-2860-74b0-9d18-73511d6596c2\exec-a86297e3-afba-4b0c-9fae-30f5cac8779a.png`; correction increased head/face presence relative to jacket and legs. |
| C neutral | 3 | Tool validation error | — | — | A follow-up requested a B-matched head/torso ratio, but was rejected before generation because six reference paths exceeded the tool's five-image limit. No candidate was created. Counts against the C-neutral budget; no further call is available. |
| C combat | 1 | Saved | `gojo-combat_study-C_v01.png` | `D4C68C654B59030446F68280D367CAAA134DE497A62AE611E5F35D2D7E998907` | Generator path: `E:\Vibe Coding\.codex\generated_images\01a14c4c-2860-74b0-9d18-73511d6596c2\exec-465bee55-92fa-418a-bf0f-0e627bbd3fee.png`. |
| D combat | 1 | Tool error | — | — | Invalid reference path was rejected before generation; it did not create a candidate. Counts against the D-combat budget. |
| D combat | 2 | Saved | `gojo-combat_study-D_v01.png` | `3AB97FFAA075448626F2782BBE643FD1392C1707A5F960AB6181ACEAFD3A7238` | Generator path: `E:\Vibe Coding\.codex\generated_images\01a14c4c-2860-74b0-9d18-73511d6596c2\exec-331faf94-b04e-4855-bf08-28af0c307eac.png`. |

Variant A reuses the approved neutral/combat cells as-is. Variant D's neutral is likewise the unchanged approved neutral; its sole generated cell is the lower, wider combat pose above. All cells remain provisional pending the requested Astra consistency check and user's direction decision.
