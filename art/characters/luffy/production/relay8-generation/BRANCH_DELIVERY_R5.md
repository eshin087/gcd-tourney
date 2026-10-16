# Luffy core r5 branch delivery

This note records the Luffy source-art delivery before the docs-only PR description update.

- Art/source commit: `3a0476c917d013a6c79b62a0553f7c3d4bdc4f8f` (`art(luffy): complete recovery repairs r5`).
- `npm run pr -- open` published slim branch head `9add7fb9` and updated PR #96.
- Preview deployment: https://gcd-tourney-82qk6yott-eshin087s-projects.vercel.app
- Review gallery: https://gcd-tourney-82qk6yott-eshin087s-projects.vercel.app/characters/luffy/calibration-r5/index.html
- Adopted public sheet/metadata SHA-256: `0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122` / `dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f`.
- Parent's authenticated hosted fetch confirmed both hosted files match those hashes and the r5 gallery content reports v03 / 100-frame audit / special held. The hosted browser view prompts for Vercel sign-in, so playback was verified in the local browser only; no hosted playback claim is made.

Astra's final strict audit covers 22 selected animations / 100 frames and supports the down v03 and getup v03 technical body/scale measurements. The user has not approved these candidates. Special remains the only absent/held CORE move; the authorized fourth request failed before generation, and any fifth special request awaits a new user decision. No merge or production deployment occurred.

The follow-up commit that updates `PR_BODY.md` and this note is documentation only; it does not alter raw art or public atlas pixels.
