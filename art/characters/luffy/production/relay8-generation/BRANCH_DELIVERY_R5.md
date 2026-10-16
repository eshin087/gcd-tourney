# Luffy core r5 branch delivery

This note records the Luffy source-art delivery before the docs-only PR description update.

- Art/source commit: `3a0476c917d013a6c79b62a0553f7c3d4bdc4f8f` (`art(luffy): complete recovery repairs r5`).
- `npm run pr -- open` published slim branch head `9add7fb9` and updated PR #96.
- Preview deployment: https://gcd-tourney-1sgd4nb1t-eshin087s-projects.vercel.app
- Review gallery: https://gcd-tourney-1sgd4nb1t-eshin087s-projects.vercel.app/characters/luffy/calibration-r5/index.html
- Adopted public sheet/metadata SHA-256: `0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122` / `dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f`.
- Parent's authenticated hosted fetch confirmed both hosted files match those hashes and the r5 gallery content reports v03 / 100-frame audit / special held. The hosted browser view prompts for Vercel sign-in, so playback was verified in the local browser only; no hosted playback claim is made.

Astra's final strict audit covers 22 selected animations / 100 frames and supports the down v03 and getup v03 technical body/scale measurements. On 2026-10-16, the user approved down v03 and getup v03 via Claude relay #10, quote “Approved”. No other new art was approved. Special remains the only absent/held CORE move; the authorized fourth request failed before generation, and any fifth special request awaits a new user decision. No merge or production deployment occurred.

The follow-up commit that updates `PR_BODY.md` and this note is documentation only; it does not alter raw art or public atlas pixels.

## Latest approval delivery

- Approval bookkeeping commit: `decb56f86aae473e2bcc7300e2937c704afc845d`; published slim head: `4ff4b3d3`.
- Latest preview: https://gcd-tourney-1sgd4nb1t-eshin087s-projects.vercel.app
- Parent's authenticated hosted verification confirmed the preview sheet SHA-256 `0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122` and metadata SHA-256 `dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f`; both match the final Astra audit. The hosted gallery carries the down/getup v03 approval labels. The hosted browser remains Vercel sign-in protected, so playback verification remains local only.

## Relay #10 approval bookkeeping

The user approved down v03 and getup v03 only via Claude relay #10, quote “Approved”. Both Luffy manifest entries now have `status: approved` and `approvedVersion: 3`; the Luffy review rows and tracker reflect that decision. This does not approve special or other new art. Special remains held after failed request 4/4; a fifth request requires a new user decision.

The superseded down/getup v01 and v02 files were moved to `raw/_rejected/` without changing their bytes. V01 SHA-256 values match the historical review records: down `c96ea9a5be693933d55870841110d43d45154e1291f0125c8c1e5a431156220f`, getup `d4d5c2dd91c5adce01278cf69c83e9b4dfa3e9a02937b733ec8c3a7b7616971e`. For v02, destination Git blob IDs match the prior committed blob IDs exactly: down PNG/JSON `64ad1c6a47f5ee5293fdd4f41efa1ff89442364a` / `53f67097ed2c1d3460eb31f876e0ef4f2e3ca70a`; getup PNG/JSON `f95970ae034824f357431f93973165c29bd0bbd7` / `800111d993e3bbc7d69893a552266a3031d0a6cf`. Current review, gallery copy, and diagnostic reassembly scripts now link to the archive paths. Historical call/audit receipts retain their original path text and findings as contemporaneous evidence.
