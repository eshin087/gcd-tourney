# Relay #8 call outcomes and review bounds

User decision relayed by Claude: “Fix down, Fix getup, Fix special (4th call)”. This authorized one image-generation call each for down and getup, plus the fourth cumulative special request. It did not approve art and did not authorize retries.

| Asset | Current call outcome | Cumulative budget | Candidate/source state |
|---|---|---:|---|
| down | Call 2 succeeded; exact returned source captured immediately. | 2/3 | `raw/down_v02.png`, source and factor notes in `down-v02-QA.md`. |
| getup | Call 2 succeeded; exact returned source captured immediately. | 2/3 | `raw/getup_v02.png`, source and scale notes in `getup_v02-QA.md`. |
| special | Fourth request rejected before image generation because six input refs exceeded tool maximum of five; no output path/hash. It is conservatively counted as the fourth call. | 4/4 | No special v02 exists. Preserve special v01 hold. A future retry would require a separately authorized fifth call and <=5 refs. |

The candidate-only seven-cell diagnostic fixture is `diagnostic-atlas/sheet.png`, SHA-256 `fb8efd04a08d7c47c3ad2ce84ab07b01825cd163e2579af0d71dfab131dbca58`; metadata SHA-256 `efdc35842ced8d9a750eaa18d3b059f21b36361015676c1e27186a4dbef1953a`. It contains only down v02 and getup v02 cells and uses a 48-color palette. It is not a normal game pack and has no scaleManualQA or approval state.

The standard isolated pack target was `production/relay8-generation/diagnostic-public`; strict run refused to write due low-confidence down/getup candidates requiring manual review. The prior public gameplay output was not the destination and remains unchanged. For special's exact pre-generation failure and approved input inventory, see `special-v02-call04.md`.

## Astra interim scale screening (not final audit)

The frozen diagnostic atlas remains byte-identical. Down v02 is a technical HOLD: packed f1 torso is 27.8±5px vs idle 41.5±6px; exposed shin is 33.2±4px vs 52.8±6px. Astra source-crop endpoints are neck-base (261,279)→sash (371,432), 188.4±12px, and knee (700,239)→ankle (874,435), 262.1±12px. Direct source-to-native ratios are ~0.220 torso and ~0.201 shin, indicating a provisional 0.205–0.210 source factor. This still needs final endpoint confirmation plus head/hat and upper-arm checks. Any down v03 must preserve the exact f0 native density; a new B scale must be paired with bodyHeight derived to avoid re-shrinking f0.

Getup v02 is also a technical HOLD pending final recommendation. Corrected f4 endpoints are sternoclavicular/open-vest neckline (185,115)→sash center (178,202), 87.3±8px; exposed shin (72,300)→(31,402), 110±8px. References are torso 41.5±6px and shin 52.8±6px, supporting a common source factor near 0.478. Frozen factor 0.43280 may undersize the candidate. No candidate or atlas bytes changed in response to this interim screen.

## Final r5 outcome

After the bounded deterministic v03 assemblies, Astra PASSed all 22 selected animations / 100 frames in the exact strict 48-color pack. Final adopted sheet SHA-256: `0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122`; metadata SHA-256: `dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f`. The 93 retained frames have zero alpha-byte differences from the prior audited pack; all changed-palette frames were visually checked. Down v03 and getup v03 pass body/scale within recorded endpoint uncertainty. See `production/manual-audit-r5/FINAL_STRICT_AUDIT.md` and `FINAL_PIXEL_HASHES.json`. This technical audit is not user art/design approval or runtime contact/grounding certification. Special remains absent/held; its fourth authorized call failed before generation. No further image calls occurred.
