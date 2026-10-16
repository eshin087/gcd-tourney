# Review-page validation r2

- Adapter build passed (Vite6.4.3).
- Local /characters/luffy/calibration-r2/index.html on port5242 loads. Directory URL needs explicit index.html.
- Browser: all gallery images loaded, frame stepping changes state, win loop and light1 one-shot control work; light1 stops at7/7.
- Desktop1280px: no body horizontal overflow; canvas square.
- Final per-card Astra results checked after reload;18PASS and4HOLD labels align with report.
- Observed console errors/warnings: none. No gameplay, full timed-loop audit or final production pixel-equivalence pass claimed.
- Strict production command wrote nothing. See strict-pack-after-manual-audit-r2.log.

- Published preview: https://gcd-tourney-auxet8r2u-eshin087s-projects.vercel.app/characters/luffy/calibration-r2/index.html (source69458e91). Hosted browser reaches Vercel sign-in; hosted playback not repeated. Authenticated Vercel fetch of astra-result.json matches committed localSHA256 000e3f1a32fa67e3c748de491f83cbd639586cd30e968c443338a0436b3ee7dc.
