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

Attempt budget: super_bg 1/3, super_fg 2/3, ult_bg 1/3, ult_fg 2/3. One inventory per asset; no further calls until user feedback. All v01 SHA values are output-file hashes, before any UI preview rendering. `super_fg` generator output was 1254 square despite the requested 1024 square; source was preserved without resizing.

## Astra anatomy audit

Astra medium audit compared the two foregrounds with approved Sasuke title-style neutral/combat cells and select art. Both are technical HOLDs. Kirin: recognizable Sasuke, but eyes too round/wide and lower face soft relative to the narrower angular approved face; chin raised; arm points outward rather than straight overhead. Five-digit hand is visible. Amaterasu: face/hair and lean build closer, left-hand-to-eye pose reads, but visible right eye is a small circular/tomoe form instead of the required bold three-blade Mangekyo; blood is beneath the uncovered right eye rather than the covered left; rope knot/ends sit front/side rather than at rear; sword projects steeply upward rather than horizontally at the lower back. Lower legs/feet may be elongated, but pose perspective and flames make that uncertain, not a measured failure. No numeric anatomy, color-count, pixel-grid, or final-size eye-readability pass was completed. The purple rope visible on the fg also conflicts with the brief's no-violet rule; preserve the established outfit and resolve the prompt conflict in the next round.

Audit is technical evidence only. On 2026-10-15, the user approved super_bg and ult_bg v01 via Claude relay effects #2 and rejected super_fg and ult_fg v01 via Claude relay effects #3. Rejected source files were moved intact to raw/_rejected/; the two foreground technical holds remain. No additional generation is authorized.
