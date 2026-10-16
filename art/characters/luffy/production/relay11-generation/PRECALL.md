# Luffy special recovery retry — pre-call checkpoint

Status: PRECALL READY; **wait for parent go before invoking imagegen**.

## Authorization and inventory

- User decision relayed via Claude, relay #11: “Goku luffy retry”. This authorizes exactly one Luffy special recovery call, cumulative call 5. Failed calls count. It is call permission only, not image approval.
- Preserve special frames f0–f5. Generate only a two-pose continuation for f6/f7. Do not retry if the one call fails or produces an unusable result.
- Existing source call 4 was rejected before generation because six references exceeded the tool's five-image limit. It has no returned image and no candidate. The recovered third-call output at `production/recovered-special-v02/returned-source.png` is source evidence only; its two guard poses do not provide the required f6/f7 recovery.
- Next candidate filename is `special_v02`: no `special_v02.png`, `_parts/special_v02_*`, `_qa_hold/special_v02.*`, `_rejected/special_v02.*`, or candidate row exists. The call-4 failure receipt and recovered source are not candidate files. If call 5 yields a source, first preserve it exactly as `production/generation-source/special_v02_attempt05_returned-source.png`; only after full-canvas inspection may it become `raw/_parts/special_v02_B.png`. Assemble it with an exact copy of preserved source-A history as `raw/_parts/special_v02_A.png`, then create `raw/special_v02.png` without changing f0–f5 source pixels or density.
- Current held strip `raw/_qa_hold/special_v01.png`: 2870×470, 841,030 bytes, SHA-256 `df4bda5a14e459392d04bbc792716d32c034b002fa1eac1b836f0a0a12589ea2`.
- Immutable original f0–f5 `raw/_parts/special_v01_A.png`: 2172×724, 1,622,738 bytes, SHA-256 `7ec7381d83ca597c9e91f6c05bc7390c241a0fc24befa9a77e506828d1a55ceb`.
- Existing `special_v01_B.png` and `special_v01_B_two.png` are identical 1448×724 sources; neither is an input for this call. The fixture copy under `production/astra-fixture-input/` is archival, not another candidate.

## Five image inputs (maximum used: five)

1. `reference/model_sheet.png` — approved Luffy identity, outfit and body design; 1536×1024; SHA-256 `c81bbe79608f291b70c8146a5ec3e95833d2c786470c7de05dc022902103e0cb`.
2. `reference/expressions.png` — approved face and expression continuity; 1774×887; SHA-256 `cc214ac79f5eb453ac62b33db43b6e8585a87c85ecd083b25485828e2b70e700`.
3. `reference/idle_approved.png` — approved guard silhouette and body density; 2048×256; SHA-256 `b11ae08cddc02bd2be95a21663f0dfba993d2743c356a7a346dfdd00d7cecb4b`.
4. `raw/_qa_hold/special_v01.png` — correction target and animation context; includes the unusable ending; 2870×470; SHA-256 `df4bda5a14e459392d04bbc792716d32c034b002fa1eac1b836f0a0a12589ea2`.
5. `raw/_parts/special_v01_A.png` — immutable f0–f5 continuity source, ending on the fully extended punch; 2172×724; SHA-256 `7ec7381d83ca597c9e91f6c05bc7390c241a0fc24befa9a77e506828d1a55ceb`.

The approved title-style neutral/combat cells remain available for later audit, but are deliberately not attached so the call stays within the five-image cap.

## Exact proposed prompt

Prompt text SHA-256: `50496c45e3ae6f083ea92091ce599b59f9dafb676ddca2f6d8a78fa8305cae11`.

```text
Use case: stylized-concept
Asset type: two-frame pixel-art recovery continuation for a fighting-game animation
Primary request: Create exactly two new sequential poses for frames 6 and 7 of the same Gum-Gum Pistol action shown in the references. Image 5 is the exact original f0–f5 source and ends on the fully extended punch; Image 4 is the held eight-frame correction target and shows why its final poses need replacement. Draw only the two missing recovery poses. Do not redraw or output frames 0–5.
Input images: Image 1 approved character design and outfit; Image 2 approved face and expressions; Image 3 approved fighting-guard density and pose; Image 4 correction target for identity and sequence context only; Image 5 exact pose-continuity source for f0–f5, ending at the extended punch.
Scene/backdrop: flat pure magenta #FF00FF with no floor, ground shadow or other background detail.
Subject: the same young, lean, wiry anime pirate in all references: messy short black hair, dark eyes, small scar below the left eye, straw hat with red band, open red sleeveless vest, blue knee-length shorts with white cuffs, yellow sash and brown straw sandals.
Style/medium: hard-edged detailed pixel art with the approved references' anatomy, restrained palette, outline and discrete cel shading; no smoothing or antialiasing.
Composition/framing: two separate, equally sized full-body conceptual cells side by side with clear magenta separation and no labels. Face screen-right in 3/4 view. Match Image 3's native body density; keep the same head, torso, limb lengths, wiry build, clothing volume and foot baseline rather than fitting poses to their bounds. Frame 6 continues directly from Image 5's last punch: the same near arm remains visibly stretched but retracts about halfway, with an unbroken shoulder-to-elbow-to-wrist-to-closed-fist chain and the complete hand inside the cell. Frame 7 completes recovery: that arm returns to normal length and the body settles upright into a compact version of Image 3's guard. Keep the hat on. Keep all anatomy within each conceptual 256×256 cell, including at least 4 px of horizontal safety; soles align to the common grounded baseline.
Constraints: these are only f6 and f7; make the retraction and return visibly distinct and sequential. The stretched arm is body anatomy. The later assembly will preserve f0–f5 from Image 5 exactly and fit only these new poses from their measured body landmarks; do not shrink or enlarge either pose independently.
Avoid: repeated guard poses, another attack, a second punch, detached fist, missing or broken arm/hand/fingers, cropped anatomy, altered build or outfit, extra characters, text, panel labels, watermark, glow, steam, smoke, aura, motion lines, gradients, blur or semitransparent pixels.
```

## Capture plan (only after parent go)

1. Before the single call, save the exact start time, call number 5/5, candidate v02, authorization quote, prompt, and the five input paths/hashes in this checkpoint. Set an explicit pending marker.
2. In the same `functions.exec` that calls built-in imagegen, immediately store the complete returned object using `store`, print only small `output_hint`/status metadata, and render the returned image with `generatedImage(result)`. Never print base64 or infer paths from result content blocks.
3. Read the actual returned schema and `savedPath`/output hint. Copy only that exact returned file to `production/generation-source/special_v02_attempt05_returned-source.png`; compare byte length and SHA-256 before clearing the pending marker. If the returned path cannot be bound exactly, stop and report the provenance block.
4. Inspect the complete source canvas and both panels before cropping. Record dimensions, panel bounds, omissions, cuts, body endpoints and uncertainty. Compare the source to the fixed approved references and the exact A-side source; no automatic retry is authorized.
5. Keep the A side byte-identical and density-identical when assembling. Derive any B transform from stable body landmarks against A and approved idle; do not fit either pose to its bounding box. Preserve the source and every prior version. Astra must audit the assembled, quantized candidate before manualQA or public adoption.
