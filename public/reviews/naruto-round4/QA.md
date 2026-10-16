# Naruto round-4 QA and handoff

Source baseline: approved title combat cell and idle v07. Main TOOL-036 merged into this real sparse worktree (84e9342). All 14 suspect frames and all 10 candidate frames were inspected in actual 48-color packer atlases with 3x nearest-neighbor crops. See SEGMENTS.md and segments.json for every-frame estimates, uncertainties, named skips and exact marker failure proofs.

## Candidate inventory

- stagger v06: 1 new built-in call (3 historical + 1 = 4 cumulative). Best of one attempt. Torso shortened relative to head. Current strict head 1.19; body/limbs remain held at unchanged legacy bodyHeight216. Subtle repeated sway remains a motion caveat.
- taunt v07: 1 new built-in call (3 + 1 = 4). Best of one. Torso shortened, pointing gesture retained. Current strict head1.20, not a pass.
- win v08: 1 new built-in call (3 + 1 = 4). Best of one. Shorter trunk and original bent-elbow fist pump. Drawing was initially attempted from rough39/46 torso estimates; exact white collar-to-hem marker subsequently confirmed f0 failure: idle(138,118)-(131,156)=38.6, win(134.5,94)-(133,141)=47.0, total uncertainty2px, conservative45/40.6=1.108>1.06. Current strict head1.19, not a pass.
- jumpUp v06 and superDash v03: every frame measured/inspected; no new calls. Under visible-chain uncertainty and named foreshortening, no robust failure established. Retained and inconclusive, NEVER passed.

Scalp crown is hidden by hair. Hair-crown-to-chin values are visible silhouette measurements only; no guessed skull anatomy sidecar. The torso marker is comparable but arms/legs under garments have conservative12px total chain uncertainty. No 6% anatomy pass is claimed for any strip.

## Packing evidence

- Baseline full strict48 pack: exit1, old spin v07 unmeasured (outside Part1). No atlas written by strict run.
- Candidate full strict48 pack: exit1, spin plus stagger/taunt/win. No strict atlas written.
- Disposable diagnostic input has exactly the same numeric thresholds and approvals; only its character gate mode is warn, so the unapproved geometry can be inspected. Output is under production/round4/candidate-public and mirrored under public/reviews/naruto-round4. It is NOT the production character atlas. Packer report's generic COMPLETE/gamewilluse wording applies only if this diagnostic atlas were installed; it was never installed.
- Diagnostic full atlas:42animations/175frames,48colors; no candidate clipping or cell-margin warnings. Existing down/ko floor warnings and old exemptions are preserved; Claude owns them. No runtime scale, bodyHeight, frame-offset or hitbox changes.
- TOOL036 baseline npm run body completed. Its B garment-area values (.86superDash,1.20stagger,1.18taunt) are advisory. Candidate body and head sheets produced from actual candidate fixture with --public. Their proxy findings do not clear the segment gate.

Three-line verdict: Identity recognizable; changed source body/head relationship awaits calibration and user review. Anatomy/pose: measured failures prompted redraws, all new packed candidates still HOLD; jumpUp/superDash inconclusive. Technical:48colors, complete diagnostic atlas, STRICT_FAILED; recommend Claude calibration/contact check before user can approve final scale.

## Review entry point

/public/reviews/naruto-round4/index.html (URL /reviews/naruto-round4/index.html). Sources, per-frame numbers, actual baseline/candidate playback, head/body sheets and strict log are self-contained under public so committed previews include them. The diagnostic lineup attaches the candidate native cell beside the shipped cast at scale1; historical SBR/build-band warnings are advisory and not new anatomy targets.

Validation: production build passed using the main checkout's restricted-profile Vite adapter (82 modules, 4m15s). Static gallery assets, module syntax,42animation/175frame diagnostic metadata and25measurement rows (idle+14baseline+10candidate) checked. Local IAB timed out and local HTTP fetch was denied EACCES by the sandbox; browser playback and game/contact QA are pending coordinator-hosted verification. No browser pass claimed. Root owns PR/committed preview publishing and main-only NOW/inbox bookkeeping.

Part2 remains gated on light1Alt in BOTH main animGuide and manifest. No alt frame tables or drawing were begun. Round3 items, approved references and production atlases remain untouched.
