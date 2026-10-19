# Killua skills revamp batch 1 attempt inventory

Prompt source: `art/characters/killua/SKILLS_REVAMP.md`, sections 2 and 3 (A1-A7). Generation directed by gpt-6-luna, medium. Each image used no more than 3 calls. The chosen source bytes were copied to versioned raw files; hashes below identify those exact files.

| Effect/version | Calls | Selected source | SHA-256 | Verdict |
|---|---:|---|---|---|
| lightningPalm v01 | 3/3 | `01a151a6-4e86-7f30-9ff4-4c66907eec23/exec-81d1e29d-6c00-4e1a-aa68-c75b640f8b44.png` | `43311863FF2582A24AF259A0F2AF414C4B0EFB5F774F1B4B7C9C82AC22920F8A` | Selected; 8/8 frames |
| palmCrackle v01 | 1/3 | `exec-c5041c54-d7f4-4347-8e29-c8f0241d46f3.png` | `D975F174BE2158FC4421EC93307B46B3DC109FF816965A65B7712946D5186128` | Selected; 6/6 |
| palmShock v01 | 1/3 | `exec-ca5dca00-8d5f-4969-a590-4eb3d55f5d71.png` | `6535334EBF40B289E01244060C1501E63BA9C3E64E46F89765DA23EE9D71AE32` | 10 detected vs 8; retained as distinct candidate |
| palmShock v02 | 2/3 | `exec-73be952b-c75e-4843-878c-923ec6f134aa.png` | `4340D2749FE3B0FAA41DDFD2B55B525335B6BDFD08008C2C3A35BAA557060191` | Selected; 8/8 |
| shockCrawl attempt 01 | 1/3 | `exec-3026d341-492a-4c18-bee2-fb5c45110456.png` | `A7FA7B73E13B97F912E35928AEFF285D996CE6FCC54A3FAEC0A5C2ADD5945C66` | Not selected; recovered from exact generation path after an accidental overwrite during filing; preserved in `_qa_hold/` |
| shockCrawl v01 | 2/3 | `exec-0109abf8-2a47-4e45-b799-8ed92decf01f.png` | `767DB95FFF0C86479285E34145CE7CE6EA3E6892A23C36F787C6ABB3856D08E7` | 14 detected vs 6; retained as distinct candidate |
| shockCrawl v02 | 3/3 | `exec-94971763-b884-4869-bfc8-5d0f68aeb577.png` | `1F0AA79B0DB55F61DF0E164763A82FCB0F78CD79A5AC9211D1FCE1923F821AFB` | Selected; 6/6 |
| godspeedBurst v01 | 1/3 | `exec-2d492aae-4467-4833-bc26-279eceace23a.png` | `8163F25CB759EC11C20CBAD331978B9057F82BE9597B48CC233B3C0F5050D90D` | Selected; 8/8 |
| godspeedAura v01 | 1/3 | `exec-40b18d3e-e82d-4e5d-856d-94dfc0b18802.png` | `F572F0C479DBE662C670E85436676BF1ACEC03E09373C2DF3F72D7DF91E8A7B3` | Clipped; retained |
| godspeedAura v02 | 2/3 | `exec-9700ce6a-cde5-4efd-9e95-48629dd30fc5.png` | `5283635231D450AD0D475666D805499BCC8EBE042F257C77084DC4E85C86C2E4` | Clipped; retained |
| godspeedAura v03 | 3/3 | `exec-63c9d29e-4ae8-424f-aea0-253ec8e6cb58.png` | `142236A193D74EFC627945F664EF4D5A82CE713E7F85426B3D8A9D587724B614` | Selected; still clipped, technical hold |
| godspeedStreak v01 | 1/3 | `exec-6a2fe687-88b0-476f-99d9-4563ca128f4c.png` | `D2292C854F1892A1E7B0A53094F12E77F099C702C6E7E34DADEE2435A0D05680` | 4 detected vs 6; retained |
| godspeedStreak v02 | 2/3 | `exec-80214a91-41b6-4fd9-a13f-fa1fbcc1fa9c.png` | `DDDF9646B5BA84E6EC175E4DBE0E7380D40FCF65BCCE9F9C756C550CEE763CB4` | 9 detected vs 6; retained |
| godspeedStreak v03 | 3/3 | `exec-512df29f-2952-41f2-b17e-8f1668e5a817.png` | `1729694A9581DAFE3C74E572B09B249DF075D6E1ACD506432ED5CC357C846FEE` | Selected; 6/6 |

For lightningPalm calls 1 and 2 the generation output paths were not captured contemporaneously; they were not selected and were not recovered by searching global newest files. All saved attempts are linked in the review gallery. The source generator produced large landscape canvases with near-magenta corners and high source color counts; raw art is preserved unchanged. Packer quantization/keying produces the game scale frame previews. `godspeedAura` remains clipped after exhausting its three calls. No Astra audit applies to effects.
