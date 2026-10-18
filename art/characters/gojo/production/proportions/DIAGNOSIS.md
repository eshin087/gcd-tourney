# Gojo leg proportion study: diagnosis

Study status: diagnostic only. No production art, raw inputs, manifest entries, atlas output, or approval state is changed here.

## Finding

The approved Gojo neutral is tall in its own right, and its dark, uninterrupted trousers read narrower and longer than the other fighters' orange trousers, wrapped lower half, and bare legs. In the approved neutral cell, the measured hip/belt-to-sole segment is about **106 px (±5 px)**. Against the **215 px** standing body (skull to soles, per Gojo's character contract), that is about **49% ±2 percentage points**; against the full **236 px** visible silhouette (hair through soles), it is about **45% ±2 points**. The approved combat cell is bent and wide. A visual hip-to-shoe chord is **112 px (±14 px)**, about **52% ±7 points** of the neutral standing-body height; this is a low-confidence pose chord, not a leg-path or combat-cell standing-height measurement. The neutral cell's alpha bounds are x82–172, y5–240; the combat cell's are x50–205, y28–240. These include posed hair and limbs and are not standing-height measures.

The comparison cells make the visual cause clear: the approved Gojo neutral has a visibly uninterrupted trouser silhouette from waist to shoe. Naruto's bright trousers add several horizontal breaks; Sasuke's sash and broad hakama break the leg line; Killua's exposed knees and shorter shorts do the same. Gojo's baseline therefore reads lankier even where the packed poses preserve the same leg segment length. The title-style neutral cells have full visible heights of Naruto **205 px**, Sasuke **209 px**, Killua **186 px**, Gojo **236 px** (hair included, alpha bounds to floor). They are not meant to share a standing height: Gojo's approved stature is taller.

I found **no measured strip-level leg-length drift beyond the approved neutral/combat cells** in the requested packed frames. The straightest exposed legs occur in `hurtHigh` f1–f2, several run frames, and the extended `dash` frames, but their visible hip-to-sole spans are within the baseline range after allowing for hip rotation, foreshortening, and foot lift. `hurtLow` and `heavy` bend the knees; `launched` is airborne and foreshortened. Those poses can look stilt-like without containing a longer leg. This distinction matters: a model change would require a cast-wide Gojo redraw, while pose-only work can target the reactions.

## Measurement basis and limits

The approved comparison images are `public/art-review/title-style-pilot/gojo-neutral_v01.png` (SHA-256 `D9FD4DCA67C7CC133E897773A3C8128D6C5320A42402642C11409FEA770175A0`) and `gojo-combat_v01.png` (SHA-256 `AB42BC6FACD14659BF35B48A4BCE8682CD17218F200D1E7FCDC6430F58451656`). Gojo's neutral is 256×256; its alpha bounds are (82,5)–(172,240). The hip/belt point is a visual landmark, not a machine-detected joint. A 5 px uncertainty covers the waistband and pixel-edge choice on the upright cell.

The packed comparison uses the current production sheet `public/characters/gojo/sheet.png` (SHA-256 `CE87CC8D31F6CA7336BE020F477A178BC909A4804BD16002D7A70B96F9DE7EF7`) and `anims.json` (SHA-256 `0134EC68B48889310BD6FE85711C4FFE1126D120751FAD9F96AEB4E9EADACB6C`). Each table entry below is the listed animation frame cropped at its `anims.json` atlas slot, one 256×256 cell. The measurements are hip/belt to sole, rounded to the nearest pixel; where the hips turn away, the legs cross, or the feet leave the floor, uncertainty rises to ±8–14 px. Airborne estimates follow the visible leg contour and are not vertical bbox heights.

The separate files under `art/characters/gojo/frames/` are stale previews: **all 33 requested cells differ pixel-for-pixel from the corresponding current sheet crop**. Do not use them for this finding. The atlas crop slot mapping and exact raw inputs are:

| Animation | Frames / atlas slots | Source version | Raw source SHA-256 |
|---|---|---:|---|
| idle | f0–7 / 0–7 | v08 | `6C1EC47C2C1E2B7DF2D3AA6CCF2256E46DC93BDD8E426607F2990F6F963913BB` |
| hurtHigh | f0–2 / 93–95 | v03 | `A7465B58D2D3B9C7849ACA8B457E40A0601CAED979CE2877AA4FDCF8AA728215` |
| hurtLow | f0–2 / 96–98 | v04 | `001B39509C0B5AF2CF27C828E8F4527DE1E1DB9183E84B0FF358A8C59939DFCF` |
| launched | f0–1 / 99–100 | v06 | `963244EE7C4D2E4B01A28E5C24C199DD7B49C85FF3E9163752383053A73A7C29` |
| run | f0–7 / 8–15 | v14 | `031A7DA4E5B7C670B5A55B0217C837E7D1CD05AAA017D16FE711C2A41E1DF170` |
| dash | f0–1 / 16–17 | v11 | `0C2949BA6ABBD693975F2F21DED6709E136792C4224AA8DB367DA24AE801B59D` |
| light1 | f0–6 / 30–36 | v05 | `DEE7D5F0B08D239441BCD2A8E91E3F6838FC1A73F18E66A99517D382CDDEAD52` |
| heavy | f0–7 / 59–66 | v05 | `019C61549032C3860FE94B3E1966317E1EDEE42CB6D1BDD5158985A5F6E0F363` |

The run atlas repeats slots 8–11 at 12–15, consistent with `run_v14`'s source metadata that reuses Part A for both halves.

These are direct visual measurements with stated uncertainty, not a packer anatomy pass. A low-confidence or occluded segment is not a numeric pass. The pose comparison is sufficient to distinguish an obvious length outlier from a consistent model; it does not certify every anatomical segment in every pose.

## Packed frame leg measurements

| Animation/source | Frame measurements, hip/belt to sole | Read |
|---|---|---|
| `idle` v08 | f0 97±5; f1 95±6; f2 96±6; f3 97±6; f4 95±6; f5 94±6; f6 96±6; f7 97±6 px | Bent stance; close to the approved cell after pose differences. |
| `hurtHigh` v03 | f0 96±10; f1 101±8; f2 99±8 px | f1–f2 expose long straight trouser lines, but neither exceeds the neutral estimate outside uncertainty. Candidate-level box-axis lead in size-r6; not a confirmed leg-length defect. |
| `hurtLow` v04 | f0 93±10; f1 92±9; f2 97±8 px | Knees remain bent. The size-r6 work explicitly withdrew this as a correction candidate; no redraw evidence here. |
| `launched` v06 | f0 104±14; f1 101±14 px | Both airborne and rotated; contour estimate is low confidence and not evidence of drift. |
| `run` v14 | f0 104±9; f1 102±9; f2 99±10; f3 103±10; f4 104±10; f5 100±10; f6 103±10; f7 102±10 px | Long strides and crossings change projection; no repeated outlier. Atlas frames 4–7 repeat 0–3. |
| `dash` v11 | f0 101±10; f1 103±10 px | Low, bent pose; within pose variation. |
| `light1` v05 | f0 96±6; f1 96±6; f2 97±6; f3 96±6; f4 96±6; f5 96±6; f6 96±6 px | Near-static lower body; no drift. |
| `heavy` v05 | f0 96±10; f1 93±11; f2 93±11; f3 97±13; f4 98±13; f5 95±11; f6 95±10; f7 96±8 px | Crouch and airborne follow-through make the hip landmark uncertain; no repeated longer leg. Size-r6 lists heavy as a visual lead only. |

The apparent differences between the upright approved 106±5 px leg and several packed cells are explained by bent knees, the lower idle pose, or a turned/airborne pelvis. None shows a repeated segment materially longer than the reference. In contrast, the approved neutral's 49% leg share of standing body height is itself a design choice and the uninterrupted dark trousers amplify it.

## Current size-r6 overlap

The separate `art/size-r6` task excludes Gojo dash and superDash. It lists `jumpUp` f0, `hurtHigh` f0, `charge` f0–f3, and `beamStruggleAir` f2 as additional packed-box leads. Its handoff also retains `heavy` and `airLight1` as visual leads; it explicitly says none is confirmed by two homologous segment endpoints, and it keeps `hurtLow` unchanged. These are screening leads, not confirmed defects. If the user chooses a shorter-legged model, every Gojo strip in that task's 42-strip scope would need a proportion decision; dash and superDash are the two separately owned exclusions. Do not treat size-r6's box/area flags as proof that those strips have longer legs.

