# Power-up VFX approved review

Built-in imagegen, using the preamble and per-effect prompts in art/vfx/PROMPTS.md. Selected bubble/tail attempt 2, wisp/arc attempt 1, ripple attempt 3. Raw files are immutable; ripple v01 remains as an earlier technical-failure record. The unsaved intermediate ripple attempt received no version.

Review: /art-review/vfx-powerups/index.html. Approvals: `approve vfx bubble v01`, `approve vfx wisp v01`, `approve vfx arc v01`, `approve vfx ripple v02`, `approve vfx naruto_chakraTail v01`.

- Candidate pack: 20 effects, 106 frames total; five new effects contribute 30 frames (6/7/6/5/6). All new cells are 128px, atlas ppu56. Existing 15 approved effects retain their packed source frames. dustWave remains procedural.
- Source caveats: generated pixel edges contain intermediate shades; packed tinted effects are grayscale. Ripple v02 fresh import reports colored fringe converted to grayscale; no clipping after automatic split. The older ripple v01 incorrectly auto-splits into six frames and is not recommended for approval. Bubble uses equal-slot sidecar so all pop droplets survive grouping. No character scale exemptions or anatomy changes apply to VFX.
- Visual review: clear bubble growth/pop, wisp rise/release, independent angular arcs, circular expanding ripple, left-curving rounded tail. Tail bubbles are more granular than the reference brief; user should judge shimmer and sway. Bubble rim is subtle at native size. Recommend the five latest versions with these caveats.
- Browser: actual game at port5216, `?fight=naruto,sasuke&mode=solo&art=custom&debug`, logs all five candidate names. Spawned each effect through game.fx at red/dark/blue tints, verified metadata and shader tint values, captured game-qa.png. Zero page exceptions; development optional-resource 404 messages remain. This controlled spawn verifies game rendering, not a complete natural-charge gameplay soak.
- Gallery: verified all five animation canvases in Edge; packed art is shown at 2x nearest-neighbor, tint multiplication, original links. Screenshot gallery-qa.png.
- Build: local restricted-profile Vite adapter production build passed, 77 modules. No engine/tool changes.
- User explicitly approved bubble/wisp/arc/chakra tail v01 and ripple v02. approvedVersion/status and review records updated; superseded ripple v01 archived. Normal approved pack contains20effects/106frames, zero warnings. public/vfx atlas PNG/JSON match the reviewed candidate atlas byte-for-byte. Temporary candidate atlas removed; Claude alone integrates.

Worktree: `.worktrees/art-vfx-powerups`. Branch: `art/vfx-powerups`. Port5216. No main/NOW/INBOX edits; no merge or production deployment.
- Packed measurements: zero non-grayscale visible pixels in all 30 frames. Wisp/tail bottoms y120 every frame; tail height83-90px. Ripple diameters46/70/90/106/122px (brief40/60/80/100/122): early rings modestly oversized. Bubble initial dot5px (brief8); oval38x27 (brief38x30). Wisp final heights60/45px (brief56/40). These are documented candidate deviations, not probe exemptions.
- Additional natural-charge check: held KeyL for420 deterministic game frames, Naruto reached state charge and ki300. chargeKeep held naruto_chakraTail; bubble and wisp emitters were live. Screenshot charge-qa.png confirms attached red tail and surrounding particles. Other fighters were not exhaustively soaked.

- Approval follow-up after rebase onto current main: production build passed79modules; normal-game held-charge check passed atki300 with tail/bubble/wisp. Approved atlas remains byte-identical to reviewed atlas. Re-import after Git normalized sidecar line endings repeats the documented ripple grayscale-conversion warning; cached normal packing has zero warnings. No fresh image or visual change.
