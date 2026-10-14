# Round-4 preview verification

Recorded 2026-10-13 (local). These are unapproved diagnostic review galleries. None is a production integration or anatomy pass.

| Fighter | Local committed source | Published PR head | Preview |
|---|---|---|---|
| Sasuke | fe4dd88 | 3eccd68cfc355ff4686e68e8f463f0d842514715 (PR79, open) | https://gcd-tourney-b4s5hamum-eshin087s-projects.vercel.app/reviews/sasuke-round4/index.html |
| Naruto Part 1 | 8cf5044 | 297be5a731fee2636359cb27c639ff34bc25e5e1 (PR80, open) | https://gcd-tourney-pwvs5k8dg-eshin087s-projects.vercel.app/reviews/naruto-round4/index.html |
| Killua | 8c25da8 | caf4918787e8bac1aafdd6fe96130396eed321a4 (PR81, open) | https://gcd-tourney-fllkidy67-eshin087s-projects.vercel.app/reviews/killua-round4/index.html |

The project publishing helper filters raw history, so published PR commits differ from local committed preview sources. All previews were created by the committed-export helper. No production deployment or merge was performed.

## Browser observations

- Sasuke: hosted gallery loaded; unchanged game custom-sheet loading was verified locally with no console errors. Evidence: [gallery](sasuke-gallery.jpg).
- Naruto: hosted gallery loaded all five players; pause and frame stepping worked without broken images or reported console errors.
- Killua: local selected-loop gallery verified five native-size players, pause, stepping, speed, and stagger frame 3 to 0. Evidence: [selected-loop gallery](killua-gallery-selected.jpg). The refreshed hosted page then loaded all five exact atlas players and displayed the correct selected versions: idle11, guard09, superDash08, stagger07, win05. Hosted control interaction was interrupted by the user's Escape before confirmation; do not count it as verified. No hosted console inspection was performed in that resumed check.
- User subsequently directed all further browser work to the Codex in-app browser. Desktop control stopped. The in-app review page was queued with the app tool; in-app automation was not exposed in that session. Do not substitute desktop control.

## Build and atlas evidence

All three production builds passed (82 modules). Killua preview helper independently rebuilt committed source 8c25da8 successfully before publishing. This build result does not clear strict sprite packing or anatomy holds.

Killua diagnostic sheet SHA-256: `f9d0d80a7b0bbc9341fe909d5bf57bccdfb3f8c0297a16069453a6d772a0097a`.
Paired animation metadata SHA-256: `9ef60e70b94af486cb6ee1200593de62b8d0c35887e1854cf754feb3896fb746`.
Gallery source/atlas/reference hashes remain unchanged from the audited candidate set.

Saved screenshot SHA-256:
- Killua: `809a5105a566285c766895b2955b8aa362a113723f52e59868764fe6be0b9317`.
- Sasuke: `7b45d6e5a93877a57ad46ddd4ae717d544536671aecd71e6ab988e45a74a01b5`.

The [independent Astra report](astra-three-fighters_v01.md) remains HOLD for all three fighters. Gojo and Naruto's eleven alts are separate ongoing work and are not certified by this record.

## Gojo publication

PR83 is open at filtered head 0e9ec98fba213dd1d6d828bc4a16182d6d75e422, exported from local source 19eb3174b60d464671b1e1e942aeef7e3bd304bf. Committed preview: https://gcd-tourney-2ste13exl-eshin087s-projects.vercel.app/reviews/gojo-round4/index.html . Its build passed (82 modules). The page was queued in the Codex in-app browser; hosted interactive QA remains unverified because automation was not exposed. No desktop fallback was used. A read-only merge simulation identifies only docs/TASKS.md as conflicted; Claude owns integration. All candidates remain HOLD and production atlas unchanged.
