# Goku r3 first quantized batch — dash07 / land07

2026-10-16. Four actual quantized cells inspected at native and3x nearest-neighbor scale against approved idle02/title neutral/combat. Atlas has other inherited rows; this report covers ONLY dash07 and land07, not a new audit of those other rows.

Exact atlas SHA-256 `1af3b61123a94fe0844afb59f02a91a15c3cf6b0fab7dbd2b3cc85d379fd7737`; metadata `0ca0cc2788ca9acc24a9d34001ef8e0dbbd868a521f660ce8abd92b68d37baf5`. Paths: `production/reassembly-r03/fixture-public/characters/goku/{sheet.png,anims.json}`. Isolated warn-only,quantize48,no-writeback,256cells,pivot[128,240],ppu128. Fixture bodyHeight dash207/land235,worker log x1. Diagnostic rendering itself is not approval.

`DASH_LAND_MEASUREMENTS.json` records independently checked hashes, native endpoint coordinates and lengths; four `*-landmarks.png` images show those marks. Reference idle collar→belt38.1±5,belt36±4,boot43.7±4. Candidate torso±6,belt±4; dash boot±6 for projection,land boot±4. Concealed knees/shins are not numeric passes. All heads, torsos, visible arm/leg chains, adult build and clothing volumes were visually checked.

## land v07 — PASS within uncertainty

- f0 / atlas20 / cell SHA `2beceba1b5da5843afe44edf258cd9cb119c36f8d89831106b5138dfd9c55cfd`: crouched torso35.4,belt32.6,boot41.8px. No disconnected or cropped limb; compressed torso projection is expected.
- f1 / atlas21 / cell SHA `841b5eb59800a930edd6fc8be267630506bd4d64415c1ec5527a3b527d345dac`: recovery torso35.7,belt36,boot41.8px; ratios.94/1/.96. Head, shoulder/arm build, gi volume and boots match idle/title within uncertainty. Earlier small-body finding resolved at source factor.300.
- Static crouch→guard sequence and guard→idle relation coherent. Metadata50/70ms,one-shot; no timed playback performed here.

Recommended version-bound manual PASS for these pixels at bodyHeight235/pack x1. Final selected public palette must be rechecked if changed. No design approval or runtime-contact certification.

## dash v07 — HOLD final fit; visible body plausible

- f0 / atlas16 / cell SHA `aa02ddee20d72223438e3faff4216d00fed615cccba3025e50fd5e62aa15ccd9`: torso34.7,belt33.6,rear boot35.7px. Torso/belt match uncertainty; boot reading sits at overlap boundary and is projected. Head/build and clothing coherent.
- f1 / atlas17 / cell SHA `b290b0731f7165219bdc4343ffd70dce2ab185a6229f8924cd774cfede2769f9`: torso34.7,belt33.6,foreground boot29.8px. Boot is viewed in a different side orientation, so this is not a validated uniform body correction. **Rear boot is cut at left atlas edge**, preventing complete limb certification. Source figure is complete and can fit by width; packer anchoring/placement must be reconciled before any pass.
- Metadata60/60ms loop; static lean/stride relationship coherent apart from cut limb. No timed playback.

Do not write a full manual pass or request new drawing for the clipped rear foot: this is an assembly/packer-placement issue. Do not apply another global scale based solely on the projected boot number.

Parent and Luna notified. Final Goku release audit remains pending; parent owns handoff.
