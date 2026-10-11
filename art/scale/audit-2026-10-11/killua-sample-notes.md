# Killua quick sample packet (2026-10-11)

Current main 1bb2d948c212ffd4594b6fa400b6ef320bd7d9a4. Read-only extraction; hashes in killua-sources.json. No new art, approvals, pack or atlas changes. Title-screen Naruto/Killua relationship remains the relative-size target; these are current gameplay samples, not proposed corrections.

- killua-samples-main.png: exact packed pixels at2x nearest neighbor; idle0, guard0, charge0, heavy3 / heavy0, heavy5, heavy6, heavy7. Samecell scale and baseline, no per-pose normalization.
- Approved turnaround source: art/characters/killua/reference/model_sheet.png (v01); retain original sheet size for angle/design inspection, not as a scale-normalized cast comparison.
- Idle all8frames: visually stable child build and head/hair mass, only breathing/stance variation.
- Guard bothframes: head/hair visibly smaller than idle while the body retains comparable limb/body mass. Candidate for head/proportion redraw; do not enlarge the entire guarded body blindly.
- Charge all4frames: crouch explains reduced height, but hair/head and arms are visibly larger than idle. Wholebody scale inflation, not merely crouch silhouette.
- Heavy all8frames: f0-f6 head/limb density generally smaller, with strong crouch/foreshortening in f1/f5. Full-size idle f7 makes a visible recovery size change. Correct wholebody continuity after separating tucked poses; preserve the heavy action.

Only idle/guard/charge/heavy (22 frames) visually inspected so far. Contacts/automated metrics for175 main frames and75 blocked candidate frames were extracted before the user's pause; extraction is NOT full visual audit completion. No standalone skull/chin landmark measurements completed in this quick packet. Scale-probe numbers are advisory and not used as approval evidence. Full42animation audit paused as requested.
