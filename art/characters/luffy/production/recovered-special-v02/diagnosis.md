# Special v02 recovery diagnosis and next-call preparation

## Exact recovered call and source

- The user authorized one final special generation attempt after the original two calls. The extra call was executed; it is not another available attempt. Cumulative special generation calls: 3; remaining: 0.
- Exact generated output is preserved unchanged at [returned-source.png](returned-source.png). SHA-256: 49acf64d976dd044f853c7078417290b6a600c624358af88c75383eeaeada0a6; 1533064 bytes; 1774x887 px. Its SHA-256 matches the tool's recorded savedPath byte-for-byte.
- Prompt/call, savedPath, completion event, prompt hash and authorization are in [PROVENANCE.md](PROVENANCE.md).
- Existing special_v01_A is 2172x724, SHA-256 7ec7381d83ca597c9e91f6c05bc7390c241a0fc24befa9a77e506828d1a55ceb. It contains six sequential poses through the active extended-arm punch (f3-f5); the approved move brief then requires recovery: f6 arm snapping back, f7 fully returned upright recovery.

## Can the recovered output replace recovery frames?

No. At the exact returned source, both panels show an upright wide-leg guard/combat stance with both arms bent and fists near the chest. Neither panel shows a visibly stretched arm in mid-retraction, so the sequence has no visual transition from special_v01_A's final fully extended punch into recovery. The second panel also remains in the wide-leg combat stance rather than the approved idle's upright recovery stance. It therefore cannot replace f6/f7 as a coherent motion continuation. This is a pose/continuity finding from direct panel comparison; it is not a scale or anatomy pass. Retain it as recovered source evidence only; do not crop, resize, stitch, pack, or promote it.

## Authorized generation remaining after Goku-first gate

- light1: two calls remain (cumulative attempts 4-5); produce only one next version, raw/light1_v02.png, choosing the best result after up to two calls. Existing v01 and its three attempts remain preserved.
- win: one call remains (next version raw/win_v03.png); target the same approved victory pose, fists around head height, with an upright hat-top-to-sole target of about 237 px in a native 256 px cell. Keep source pose stature distinct from hair/hat and raised-arm bounds.
- special: zero calls remain; do not generate again under the current authorization. Recovered call counts as the consumed third attempt.
- No image generation is authorized until the parent sends Goku-first go.

## 2026-10-16 follow-up after coordinator go

The preceding budget/status bullets describe the pre-go checkpoint. One additional light1 call (attempt 04) and one win correction call (the 1/1 call authorized for that round; cumulative source call 2, asset v03; v02 was a transform) were authorized and completed. Light1 v02 and win v03 are both retained under `raw/_qa_hold/` after actual packer scale-gate failures; see the versioned rows in `REVIEW_ROWS.md` and the native-density reports `production/light1-v02-QA.md` and `production/win-v03-QA.md`. Light1's final authorized extra call was not used. Special remains at 3/3 with no calls remaining. No further call is authorized by this follow-up.

## Capture and measurement procedure when generation is released

1. Freeze/hash the approved idle and title neutral/combat inputs plus selected source versions. Record the exact prompt and input paths/hashes before calling.
2. After each imagegen call, immediately capture its returned savedPath, completion status, call ID, revised prompt and exact result hash. Copy the exact PNG bytes to the assigned versioned destination; verify destination and savedPath SHA-256 equality before inspecting. Failed calls count against the asset budget.
3. Inspect the full returned canvas and all panels before crop or assembly. Record dimensions, panel bounds, cell layout, omissions and clipping. Never use a global-newest-file lookup.
4. Compare stable body landmarks at the approved idle's density (e.g., collar-to-belt, boot-top-to-sole, and an unforeshortened forearm); separately record hat/hair top, soles and posed bounds with uncertainty. Do not scale each pose to its own bounds or use a stretched/cropped panel as a whole-body size reference.
5. Keep exact raw source immutable. Only after visual review, determine whether panel separation/assembly is valid; display the intended 256 px cells and pivot guides. Don't alter bodyHeight or other production calibration fields; Claude owns those.
