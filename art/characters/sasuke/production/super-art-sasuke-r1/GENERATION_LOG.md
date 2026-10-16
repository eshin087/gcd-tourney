# Sasuke super art pilot — generation log

Round: 1, 2026-10-15. Generator outputs are preserved outside the repository in the Codex generated_images folder. Each selected v01 source was copied from the exact path recorded below; unselected edits remain outside the repo. Image generation did not expose a renderer/model selector; the directing Codex policy was GPT-6 Luna, medium.

| Asset | Call | Output | SHA-256 | Dimensions | Filed |
|---|---:|---|---|---|---|
| super_bg | 1 | `exec-2a49ec26-24b2-4d5a-b6f6-d153b4929ec9.png` | `ebf0e2c2cc360e29c2221b6171c9cedcdb4c624f91ccbe450942c77a445e0dee` | 1536×1024 | v01 |
| super_fg | 1 | `exec-b77d6048-fd6d-40e1-9ce9-7ae9d66bf315.png` | `1c251bc71c45926c356c8dedf0108d6349f0784163a263a61e8ed1bd3a71c6c7` | 1254×1254 | v01 |
| super_fg | 2 | `exec-8c4dd73c-d56c-4e62-8d1d-b07770a86b3f.png` | `9bd88c5a78fcace9d15024742c2bbb47b4bec124c6d842d043d4710123836c3c` | 1254×1254 | unselected edit |
| ult_bg | 1 | `exec-58ef2e86-dd18-4498-8b58-75a018d84d8a.png` | `40da853ddc7843fcd1662557be9c6fea55daf6b9ad34ac27cc3a822d221598d9` | 1536×1024 | v01 |
| ult_fg | 1 | `exec-2d47908d-ff34-4fb8-aa58-c39fe5c4b031.png` | `00ccc3e902c77d605db21f507233ec0bcd2e781b4f6ab77ce260d6fa2de79481` | 1024×1536 | v01 |
| ult_fg | 2 | `exec-71236ece-0e20-4658-804a-1277d8345ab8.png` | `8654167eca3008deba65c9bd8dac54f8f11b41ff2bc1734d8dc07957a1641a16` | 1024×1536 | unselected edit |
| super_fg | 3 | `exec-6c486fb0-c9fc-4ce6-8994-72361b9315fa.png` | `CECE9F965FE1880D875C9A109C1222D9947576761D88FA972E9DF360975A2EA3` | 1254×1254 | v02 |
| ult_fg | 3 | `exec-1304ef9c-ddd7-4c54-baa0-ff037276928e.png` | `BB20D39B1C865A82FA4F942AAD906CED350F42CFE45D7A005C4E603D0A943B5F` | 1024×1536 | v02 |

Attempt budget: super_bg 1/3, super_fg 3/3, ult_bg 1/3, ult_fg 3/3. The two v02 sources are in the repository and the review gallery; no foreground calls remain. The invalid wrapper request caused no image generation and is not counted. All v01 SHA values are output-file hashes, before any UI preview rendering. `super_fg` generator output was 1254 square despite the requested 1024 square; source was preserved without resizing.

## Astra anatomy audit

Astra medium audit compared the two foregrounds with approved Sasuke title-style neutral/combat cells and select art. Both are technical HOLDs. Kirin: recognizable Sasuke, but eyes too round/wide and lower face soft relative to the narrower angular approved face; chin raised; arm points outward rather than straight overhead. Five-digit hand is visible. Amaterasu: face/hair and lean build closer, left-hand-to-eye pose reads, but visible right eye is a small circular/tomoe form instead of the required bold three-blade Mangekyo; blood is beneath the uncovered right eye rather than the covered left; rope knot/ends sit front/side rather than at rear; sword projects steeply upward rather than horizontally at the lower back. Lower legs/feet may be elongated, but pose perspective and flames make that uncertain, not a measured failure. No numeric anatomy, color-count, pixel-grid, or final-size eye-readability pass was completed. The older no-violet prompt wording conflicted with Sasuke's approved outfit palette; the user confirmed the purple rope is correct and main's updated brief makes the character palette authoritative.

Audit is technical evidence only. On 2026-10-15, the user approved super_bg and ult_bg v01 via Claude relay effects #2 and rejected super_fg and ult_fg v01 via Claude relay effects #3. Rejected source files were moved intact to raw/_rejected/; v01 foregrounds are rejected and preserved. The user authorized a v02 redraw, consuming the final call (3/3) for each foreground; both v02s are on user review hold.


## V02 Astra follow-up

Both v02 candidates remain technical HOLD. Kirin arm is substantially straighter and overhead, but face still reads softer, eyes wider/rounder and chin elevated versus approved references. Amaterasu rope bow reads at rear and Kusanagi is nearly horizontal; blood still appears under uncovered right eye and visible eye does not unambiguously read as bold three-blade Mangekyo. Lower legs/foot scale uncertain from perspective and flames. No pixel-accurate packed-size validation. See user review gallery; user decision required because each foreground budget is exhausted.

## V03 redraw round — user-authorized by Claude relay effects #5

The user authorized three additional imagegen calls for each foreground. V02 candidates were superseded (not approved); Astra v02 HOLD findings remain historical. Both rounds used all three additional calls, cumulative 6/6 each. Unselected outputs remain in generated_images. Selected sources were copied byte-for-byte into raw v03 files; no production packing occurred. The built-in image generator exposes no renderer selector.

| Asset | Cumulative call | Output | SHA-256 | Dimensions | Result |
|---|---:|---|---|---|---|
| super_fg | 4 | exec-7378756d-f2ca-44d9-af8d-1fd6533387ce.png | E2AEC2B606FFEAEACE65D2E2AB1DF19EF3AEAF7E9B100A8EEDD9638B599E12F2 | 1254×1254 | unselected |
| super_fg | 5 | exec-b6059744-00e5-46d0-bedc-6ae7ca67c4f0.png | 60C56DA29528D829C5B5661283A326B288D23351882D37AF63718E3986EC0FE3 | 1254×1254 | unselected |
| super_fg | 6 | exec-9998fcd8-9d9b-4036-9973-af6d2e64cbf2.png | C20201B8C72004C3EEF74C26DD605CF3E5E5BD93F7A9B36FC43105B02CCC1921 | 1254×1254 | selected as ui_super_fg_v03.png |
| ult_fg | 4 | exec-ea31f67e-1cbc-4776-b19f-e0885dca17db.png | 8394E1B68BB5B3EAAA8FB2F5CC39F0317F16CAC205BE5D7541DDB62FD33BFF14 | 1024×1536 | unselected |
| ult_fg | 5 | exec-8e06b61e-4598-4981-93ef-182d8edc136c.png | 23B897EACE237C50F76564EF19E64A1E76F7C49CF6333F16B4765E6568C62016 | 1024×1536 | unselected |
| ult_fg | 6 | exec-d43a83c3-0879-481f-b047-f6b35bca6335.png | 3D29960B196D14B177B3B60B00511787E5AF84B7C390FD24F0F1CD513D7683F2 | 1024×1536 | selected as ui_ult_fg_v03.png |

Originals and unselected attempts remain in E:\Vibe Coding\.codex\generated_images\01a142d6-af40-78e0-a125-f2c6952d6bee\; the exact paths and metadata are preserved in the selection ledger from the generation agent.

## V03 Astra follow-up

Astra audited the raw sources and nearest-neighbor fits: both candidates remain HOLD. Kirin face narrows but eyes remain open/round and chin slightly raised; overhead arm passes. Amaterasu eye has a connected three-blade motif at source scale, but blades are faint at fitted size. Blood remains below the uncovered right eye with a separate red mark near the hand; rear purple rope and horizontal sheath pass. Lower-leg scale concern is uncertain. Whole-canvas unique RGB counts are 100,743 and 127,235, so ≤48-color hard-pixel final output is not established. See ASTRA_AUDIT_V03.md. User decision required; no approval recorded.
