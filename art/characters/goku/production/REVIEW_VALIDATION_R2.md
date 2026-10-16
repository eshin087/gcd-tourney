# Goku review validation r2

## Local browser evidence

- Explicit /characters/goku/calibration-r2/index.html loads on port5241; all pilot images loaded.
- Pilot light2 v05 one-shot stops at frame7/7 and changes Play/Pause state correctly.
- /characters/goku/calibration-r2/reassembly/index.html loads both quantized fixture panels.
- Pausing and stepping jumpFall changes to frame2/2 at80ms; new-only jumpUp displays 'Not included in this fixture' for fixture1 and its actual frames in fixture2.
- Desktop1280px has no body horizontal overflow (scrollWidth1265), no broken images, no observed browser console warning/error.
- These are local gallery checks, not full game/contact or all timed-loop validation. Astra's final audit is separately bound to exact quantized pixels.

## Pixel evidence

- Final reassembly fixture2 atlasSHA256 c77417967595b060c9981c5d55c6d1cc32fb748a2e7361ea658746e0adb0bfa0; metadata dec929ae11544546e7a8a8f3c23c860ffa33f4844882bfda2cc9313d7cab9167.
- Final Astra report: manual-audit-r2/REASSEMBLY_R02_FINAL_AUDIT.md.
- Approved pilot comparisons are a separate hash, documented in manual-audit-r2/AUDIT.md. Production settings remain unchanged; no final public gameplay-atlas pass.

- Final gallery version/absence labels and final Astra report links verified after reload.
- Adapter production build passed. Public fixture2 atlas/metadata/final audit copies match source SHA256 exactly; browser-open EBUSY recopy did not alter them.

## Hosted delivery

Preview https://gcd-tourney-97ul7l7o2-eshin087s-projects.vercel.app/characters/goku/calibration-r2/reassembly/index.html from committed source 7f934fda; PR #123. Hosted browser reaches Vercel sign-in, so hosted playback was not repeated. Existing-auth Vercel fetch of FINAL_AUDIT.md matches committed LF bytes SHA256 5888caf794e675305f05c1c19171539b421d032460cb399c464e987464df90fc. No protection setting changed.
