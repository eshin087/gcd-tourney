# ENG-112 Goku relay #44 generation provenance

Date: 2026-10-18. Task branch: `art/normals-goku-r2`. User authorized one new round, up to three image calls per move, for uTilt, uSmash and dSmash. All earlier v01–v03 candidates and attempts remain untouched. Every source attempt and its generation receipt is preserved under `raw/_qa_hold/`.

Approved references supplied to the generation helper: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. All generated outputs are 2172×724. Selected strips are byte copies of the exact attempt source.

| Move | Calls | Selected saved version | Selected attempt SHA-256 |
|---|---:|---|---|
| uTilt | 2 | v04, attempt 2 | `9B9CDA4A1AA1891F1AE7FC74D38A259F2C00FDFBC2E457592669587C50AD32F1` |
| uSmash | 2 | v04, attempt 2 | `6C898C6E8DA7BB340EF8B96E3B51342DF8584F055FDE1333B484239484A6C5E8` |
| dSmash | 3 | v05, attempt 3 | `2E7CABE51156DB4D08E3ACF8F67CBB89ABC57909EC0A04CFA6F6064BA11FFF5D` |

Other attempt hashes:

- uTilt attempt 1: `D9593EEBA3A0F8B62FE1ABE8D79DFACA804D4435357FEB3DF538B0DC1E44D086`
- uSmash attempt 1: `D8DD66A73406DED229EEBD93396ACB498E4E5BC9DAD276E027CB3372072A4ADD`
- dSmash attempt 1: `EE40358DBB3DA6F8074F94C4181C59D6ACA63592C352BDE33BB25F850D42BC33`
- dSmash attempt 2: `68E8C7897D938919EDA9C4E860757529EDB163770F6020FCA211789CE5720C47`

The first diagnostic pack showed dSmash v04 from attempt 2 clipped by 22–27px. To honor the requested bilateral low split pose on active frames, attempt 3 was selected as a new versioned candidate, dSmash v05, with phases `[2,2,4]`. Its active f2/f3 do show both legs extended but still clip at the cell edges, so v04 and v05 are in `_qa_hold` and the stand-in remains active.

Exact packed diagnostic atlas and temporary manifest:

- `production/eng112-r2-relay44-atlas/characters/goku/sheet.png`
- `production/eng112-r2-relay44-atlas/characters/goku/anims.json`
- `production/eng112-r2-relay44-diagnostic-manifest.json` (contains placeholder scale records for diagnostic packing only; never ship)
- Astra audit: `production/ENG112_R2_RELAY44_ASTRA_AUDIT.md`
- User review: `../../../../public/reviews/normals-goku-r2/index.html`

No image approval, final scale pass, or runtime contact pass has been recorded.
