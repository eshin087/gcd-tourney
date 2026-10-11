# Manual QA: Killua down v05 and ko v06 — FAIL (2026-10-11, Claude)

No `scaleManualQA` recorded. Compared with the approved idle v03 f0 at one scale on one floor line
([sheet](qa-killua-down-v05-ko-v06.png), [segments at 2x](qa-killua-down-v05-ko-v06-segments.png)).

Fixed since v04/v05: overall lying length is back in the cast's range (down f1 208 px, ko 221 px vs a 203 px
stance: 1.02 / 1.09; Gojo 1.04, Sasuke 1.07), thighs and shins match the idle (shorts ~85, bare leg ~75-80,
shoe ~50 at 2x), and both stay inside the cell margins (down f1 x33-240, ko x18-238).

Still wrong: the **torso**. Colour runs along the body's centre line (purple shirt from the scarf to the hem):
idle 40-43 px, ko 56-58 px (+35 %), down f1 50-55 px (+25 %). The scarf (8 px) and the shorts (35-40 px) match,
so the extra length is the shirt itself. down f1 only looks right overall because its bent knees shorten the legs.
Fix: shorten the lying torso to the idle's (shoulder to hem about 50 px at the packed scale including the scarf).
