# Killua B2 throw v07 generation inventory

Scope: B2 only. Candidate is unreviewed and not approved. Source prompt: `art/characters/killua/SKILLS_REVAMP.md` §2 (model/budget/version constraints) and §4 B2 (four frames, anchor and bodyHeight). Approved identity inputs for every call: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Maximum budget: 3 calls; all 3 used.

## Calls

### Call 1 — not selected
- Source: `E:\Vibe Coding\.codex\generated_images\01a151ed-dcee-7130-864e-456b49efd6a7\exec-e7d51098-cbef-484d-9717-18086ab9d9fd.png`
- SHA-256: `0C60B0A9F48D7870C52A5A07FBCF41A2429992410A7ACC393069500B04539285`
- Prompt direction: four sequential airborne yo-yo wind-up/snap/follow-through/catch poses, Killua identity from approved refs, steel yo-yo only in f0, crooked right middle finger anchor in f1, magenta background and crisp pixels. Full frame details follow SKILLS_REVAMP.md §4 B2.
- Verdict: first attempt; not chosen. Superseded after checking the output.

### Call 2 — not selected
- Source: `E:\Vibe Coding\.codex\generated_images\01a151ed-dcee-7130-864e-456b49efd6a7\exec-c8df9d24-2525-47a1-baab-39e97605acbb.png`
- SHA-256: `D3DCC3A1BD9014FFCCDF5763B6FD0F67F8CE422017B8EC7F1B27E40717924365`
- Prompt direction: explicitly repeated all four prescribed poses, correct costume and identity, distinct middle-finger anchor, f0-only prop, pixel art and magenta background.
- Verdict: pose/action sequence reads, but f1 anchor is weak and the output is soft/painterly for the hard-pixel brief; not selected.

### Call 3 — selected
- Source: `E:\Vibe Coding\.codex\generated_images\01a151ed-dcee-7130-864e-456b49efd6a7\exec-d10bc115-ef9d-434c-84b6-d7623c21a520.png`
- SHA-256: `5FC8FE030AC007555751D86D0F4A2D23BBE9F62B164AF7D91B4E8A9A1BBE3A96`
- Prompt direction: exact 4:1 four-cell horizontal sprite strip; full §4 B2 sequence, including f1 down-forward flick and conspicuously crooked middle finger anchor; approved Killua refs, f0-only steel yo-yo, magenta and pixel-art constraints.
- Verdict: strongest action read; four poses are distinct, yo-yo appears only in f0, f1 has a bent finger gesture and f2/f3 read as tug/catch. Selected as `art/characters/killua/raw/throw_v07.png`.

## Selected candidate facts and caveats
- Output file SHA-256 matches call 3 source: `5FC8FE030AC007555751D86D0F4A2D23BBE9F62B164AF7D91B4E8A9A1BBE3A96`.
- Visual caveats: rendering retains smooth/anti-aliased shading despite the requested hard-pixel treatment; f1's exact right middle-finger identity may need careful frame review/anchor measurement. f0 is airborne with tucked legs, though knee tuck is not equally strong on both sides. The actual atlas dimensions/packing and scale/body gates remain unverified.
- Approval state: needs user review; this inventory does not record approval.
