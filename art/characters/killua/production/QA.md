# Killua complete candidate batch — final review

2026-10-09. User authorized completion without intermediate approvals. Model v01 is approved; the complete final batch was **approved by the user on 2026-10-09**. `progress.json` identifies the exact latest version of all 46 remaining assets. Review them together in [final-review.html](final-review.html).

## Delivered

- Expression sheet v01, eight expressions.
- All 42 canonical animations, 175 frames. Full atlas: 4096×2816, 16 columns, 256×256 cells, pivot [128,240], pixelsPerUnit 128.
- Portrait v01 at 96×96, cut-in v02 at 480×128, selection v01 at 384×384, packed into a separate provisional preview directory. Cut-in is fully opaque; portrait and selection have transparent backgrounds.
- Versioned raws and parts retained, including earlier attempts; cleaned frame writeback, source sidecars, hitbox overrides, contact sheets, game screenshots and an interactive review page.

## Checks performed

| Check | Result |
|---|---|
| `node tools/pack-sprites.mjs killua --quantize 48 --strict --json` | PASS: all 42 names, 175 expected frames, no missing core animations, no count/clipping/margin warnings |
| Atlas pixel check | PASS: 48 opaque RGB colors; alpha only 0/255; see qa-integrity.json |
| UI pack using isolated input/output | PASS: three fitted images; no UI warnings; see qa-ui.json |
| Visual frame inspection | All six contact sheets inspected. Fixed cross-frame limb fragments in 15 strips; regenerated touching special/specialForward poses, preserved earlier versions |
| Run alignment | Source sidecar aligns torso across alternating support feet and lifts passing poses; no bodyHeight changes |
| Hitboxes | light1 frames 2/3 and airHeavy frames 2/3 have explicit boxes over the drawn hands. specialForward frames 2/3 were regenerated and separated, restoring the complete thrust and its auto box |
| Stray pixels | Tiny disconnected components removed from cleaned frames at the packer's own <3-pixel threshold. Final report has no stray-pixel notes. Earlier cleaned run/airLight1/specialForward folders retained in production/previous-frames before fresh source import |
| Browser mirror match | PASS: `[sprites] using custom sheet for killua (42 animations)`; idle and light-attack screenshots saved |
| Browser console | No JavaScript exceptions observed. Two resource-error messages identify the existing missing `/favicon.ico`; no Killua asset load failures |
| Interactive review page | All 42 animation selectors and frame-step controls exercised; screenshot in review-preview.png |
| `npm run build` | PASS after running outside Windows sandbox (initial sandbox attempt failed EPERM) |

## Visual deviations for the final decision

The packer passing does **not** establish full visual/spec compliance.

- Identity is consistent overall: silver hair, purple wrist-length sleeves, white cuffs/hem, navy collar and shorts, purple high-tops. Face and hair detail vary slightly among separately generated strips.
- Raw generations have softened edges and excess colors. Packing produces hard transparency and a 48-color atlas, but does not turn every interior cluster into hand-authored pixel art. UI previews retain their own generated palettes.
- Some airborne/tucked and recovery poses change apparent head/body size. Heavy/getup recovery transitions and the run loop should be judged in motion. Per-animation manifest body heights were preserved.
- Several attacks miss the precise SPEC contact rectangles. Examples from packed auto-box extents: light1 reaches approximately x204–210 with its hand around y96–113 (target fist x206–226, y64–86); light2 is shorter than x214–236; light4’s foot is near x214–218 and lower than the HIGH target x224–248/y56–88; airLight2/3 and airHeavy have shorter reach than the listed target. These are visual deviations, not fixed by increasing invisible hitboxes.
- Four active frames trigger the packer's informational fallback heuristic (front 28% of body); that count is calculated before overrides. Explicit hand boxes are supplied for light1 and airHeavy. Inspect the remaining automatic boxes with the review overlay. Claude separately reported 24 successful CPU matches and an engine minimum-hurtbox-width fix in CODEX_INBOX.md; that is Claude's evidence, not a repeated soak test here. ENG-035 remains the integration gate for final normals/lunge behavior.
- Special and beam poses are complete; runtime lightning and projectile effects are engine-owned per MOVES_AND_VFX.md. No new engine VFX or gameplay code was changed in this character-art thread.
- Expression sheet heads are larger than the nominal reference layout. Assassin eyes in UI are dark with no catchlights; their intensity is a final artistic judgment.

## Review and approval

Recommendation: review the complete batch together, paying particular attention to high attacks and airborne transitions. All requested candidate assets are present; the caveats above remain visible for your decision.

User approved the latest 46 versions in progress.json on 2026-10-09. Expression/idle/UI fixed-name files are promoted and 16 superseded candidate rows are rejected with sources archived. The model reference remains approved. The recorded visual deviations remain part of the approval record.

No deployment was made in this approval step.

Commit status: not committed or staged. User requested work stay inside the writable project folder without permission prompts. Protected Git writes and deployment are deferred; the scoped shared-file patch is preserved in staging/approval.patch. All art approvals and local installation are complete.

## Integration check (Claude, 2026-10-10)

- Committed in 5f17ce9 (the commit status above is superseded); `staging/` and `status-approved.txt` were left out.
- Hand anchors for throw f1-2 and beamFire f0-2 (Narukami and Lightning Palm start at the drawn hand), ADR 0012.
- light4 f3 and airLight3 f2 hit boxes now cover the kicking foot and the leading arc, not the smear trail behind the
  leg (it reached knee height).
- 144 CPU matches with the art packs: Killua 58 %, no errors (ADR 0011 log run 10-11).

## 2026-10-10 scale candidate pass

See [final cross-cast QA](../../../scale/FINAL_QA.md) for selected versions, source hashes, all-frame inspection, browser checks, contact anchors, measurement uncertainty and final approval scope. Earlier records below/above describe previous versions.
