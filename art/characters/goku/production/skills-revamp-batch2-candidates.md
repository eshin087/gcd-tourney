# Goku skills revamp batch 2 candidate inventory

Branch: `art/goku-skills`. The three effects are visually approved via Claude relay goku-skills #4; `specialForward` remains unapproved. Exact brief and call prompts are in [SKILLS_REVAMP.md](../SKILLS_REVAMP.md) plus the prompt excerpts below. No files were overwritten intentionally; the A8 duplicate collision is documented explicitly.

## B1 `specialForward_v01`

- One image call, selected call 1/1. Source and saved raw are byte-identical, 2172×724 RGB, SHA-256 `541A850BD3334C891A9C4E7A9CBD2D3AF445A24DFCDA688CA8BA458318DC02E1`.
- Prompt file: [SKILLS_REVAMP.md](../SKILLS_REVAMP.md), B1 Dragon Fist strip brief; exact generation prompt included approved Goku lineup and idle references, seven 256×256 horizontal cells, startup/coil/launch/flight/landing/turn/return sequence, screen-right 3/4 pose, flat magenta, no effects.
- Visual read: seven discernible poses and consistent Goku identity; smooth/inked finish and wrong canvas dimensions remain caveats.
- Technical: pack attempt did not produce a candidate atlas. Parser saw seven frames, but f2/f3/f4 clips 74/77/3 px at right; the head probe is unusable and strict scale gate requires version-bound manual evidence. No body sheet or Astra final-atlas audit. HOLD.

## A7 `dragonFistAura_v01`

- Three calls; selected call 2. Attempt outputs: call 1 1983×793 SHA `8b14f5a2e0e9a114340a4638a831a9f6f9d4cae83e11b394e54d4576f4b164bc`; call 2 saved raw 2172×724 SHA `d8898a0e9435452ea9516f409824ac417f928d1eae949fe43da4d324ef7a622b`; call 3 2172×724 SHA `17c6c282dc918caf97804afeab9db13416a066ee6f0a21caa6673c77a4b31ae9`.
- Prompt file: [SKILLS_REVAMP.md](../SKILLS_REVAMP.md), A7. Prompts requested six-frame gold envelope, leftward streaming tongues, empty body channel, flat magenta and the seven-color gold palette. No identity refs.
- Technical: clear envelope silhouette, but canvas is 2172×724, corner RGB `#F40CF0`, only 5 exact magenta pixels, 140,603 non-magenta colors and 140,599 colors outside the required palette. HOLD.

## A8 `dragonFistDragon_v01` — provenance collision

- Worker `/root/goku_b7_banner` used three calls and wrote this same `_v01` path; its selected call 3 was 2172×724, SHA `5AF6F81F0FB3CB15AAE99B0604CDF3B2E72248EB2AAB959E3990047CEBE289DF`. It had near-magenta background, 199,385 colors, and a clipped left flash. Call 1 was not retained. Its call 2 and 3 sources remain in the Codex visualization scratch folder; this call 3 file was overwritten by the collision.
- Concurrent worker `/root/goku_skills_effects_3` independently used one call. Source: 1983×793, SHA `1B29A4217F8AC8261C62AFB6858D64A3EA04D55B33A043785C73283477B9D5C8`. Exact prompt: “Create the golden Eastern ki dragon for Goku's Dragon Fist, exactly 10 sequential frames in one horizontal strip, intended as 10 equal 256x256 cells… keep the center region mostly clear during the coil… head bursts from a left flash, coils around center, rears, flares, then breaks into shards. Flat solid #FF00FF background; dragon gold palette; crisp hard-pixel art; no victim or character.”
- That worker cropped `(0,140)-(1983,620)`, split 10 equal sections, nearest-neighbor resized them to 256×256, normalized near-magenta to exact magenta and quantized remaining pixels to the seven gold colors. Current saved path is the processed 2560×256 output, SHA `491E5D3C83988714E8F9F1320CC3284CC5E10C30AC8B68424C04DAC5FEB74ADD`, with 8 colors including magenta.
- User approved the current v01 drawing via Claude relay goku-skills #4; visual approval does not resolve this provenance hold. This is an orchestration failure: four calls were spent across duplicate tasks, exceeding the max-3-per-image policy. Current image reads as head/coil/roar/flare/shards, but crop/resample alters the authored framing and the coil occludes the requested clear center. HOLD; no further A8 calls authorized by this batch.

## A9 `dragonFistBurst_v01`

- Three calls; selected call 2. Attempt outputs: call 1 1774×887 SHA `20583f2fa66bef26942bc65482be18fb0110cef408f52fb8522b1fac3c0a136f`; call 2 saved raw 1774×887 SHA `bbee6b0ebf6983b203b55aa5b4960a68b557b3741733863bb67246c92bca48f2`; call 3 2172×724 SHA `59dbd111f471deac89410c9a03920c41970b2b6cd7b4de01dbeae8343e4a6bc3`.
- Prompt file: [SKILLS_REVAMP.md](../SKILLS_REVAMP.md), A9. Prompts requested eight centered frames progressing compact core → golden burst/lobes → tongues → fading sparks, white limited to initial core, exact gold palette, flat magenta, no whiteout. No identity refs.
- Technical: progression is readable, but canvas 1774×887, corner `#F30BF2`, only 1 exact magenta pixel, 100,396 non-magenta colors and 100,395 outside palette. HOLD.

Attempt images not selected remain only at the temporary paths returned by generation; their hashes and dimensions are captured above. This inventory is the attempt ledger; raw versioned candidates are immutable from this point.
