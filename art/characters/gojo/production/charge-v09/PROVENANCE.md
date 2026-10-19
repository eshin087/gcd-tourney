# Gojo charge v09 provenance (Claude, 2026-10-19)

v09 is v08 (raw/_qa_hold/charge_v08.png, SHA-256 eac1216109fe36d3e47eb26d9623f5c6d11350345f556827d45dc05e4abfddb7, 2172x724) with the generator's black frame-divider lines removed:
every pixel column that is at least 90 % near-black (r, g, b < 60) over the full height was painted #FF00FF magenta
(17 columns, all in the gutters between figures; no figure pixel touched). No image-generation call, no other edit.
Output raw/charge_v09.png, SHA-256 5352efb768e5ddad9b3895f15d86babc8917ba07b7f5f36eff40335c504c098e.

Why: the divider lines made the packer misread the cells (f2-f5 soles alternating y240 / y222, head centre drifting
18 px, head 0.886 and body 0.817 of the idle). Packed from v09, f1-f5 feet match within 1 px, the hold body moves 0 px,
and the strip is at the idle's scale (Claude trial pack). The user approved v08 cleaned this way: "Approve v08 (cleaned)"
(relay charge #15).
