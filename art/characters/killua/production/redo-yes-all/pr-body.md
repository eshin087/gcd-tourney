Killua's approved-neutral redraw receives the nine requested follow-up corrections. New source versions retain approved identity/body proportions, use refreshed already-approved idle v03 and its current guide, and include all50 frames in the review gallery.

This PR remains draft and technically blocked. New per-strip passes: run v07, heavy v10, airHeavy v06, special v05, specialDown v04. Light1 v08 and airLight3 v07 remain numerical failures after3 additional generator calls per strip. Down v05 and ko v06 correct overlong shins but require Claude's version-scoped manual QA. No new image approval is implied by the earlier blanket approval.

`node tools/pack-sprites.mjs killua --quantize 48 --strict-scale` exits1 and writes no runtime output. Existing game atlas remains unchanged. No thresholds, exemptions, manualQA, scaleFit, builds data or approvedVersion were changed; only nine newest-version fields changed. Official measured stitching uses explicit counts and a scratch atlas proven to contain approved idle3. Diagnostics use a copied warn manifest only, clearly marked as non-shipping evidence.

Validation: production build passed. All50 requested frames inspected; 13 saved immutable version rows, exact additional-attempt ledger, source prompts, anatomy uncertainties, heads sheet and cast lineup are in `art/characters/killua/production/redo-yes-all/`. Gallery path `/reviews/killua-redo/index.html`. Runtime browser QA confirms the prior42-animation Killua custom atlas loads; candidate gallery and runtime fallback are explicitly separate.

Claude owns manual QA, integration, merge and production. Remaining source failures need further explicit attempt authorization or a targeted diagnosis, never scale-rule weakening. No merge-ready claim.
Browser details: all18 gallery images loaded, no application exception; the only console404 was existing favicon.ico.
