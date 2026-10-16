# Image-call capture checkpoint

No new Goku calls are authorized in this reassembly round. This template governs a future authorized call; it does not grant another attempt.

The tool returns top-level `image_url` and `output_hint`. Do not assume MCP `content` blocks, print only key names, or discard the result before filing. Record the attempt in the fighter's persistent ledger before calling. Use a unique asset/attempt key and the approved prompt/reference paths.

```javascript
// @exec: {"yield_time_ms": 120000, "max_output_tokens": 2000}
const key = 'fighter-asset-vNN-attempt-N';
if (load('unfiled-image-call')) throw new Error('File or resolve the previous image call first.');
store('unfiled-image-call', { key, status: 'started' });
const result = await tools.image_gen__imagegen({
  prompt: 'EXACT APPROVED TASK PROMPT',
  referenced_image_paths: ['EXACT INSPECTED REFERENCE PATH'],
  transparent_background: false
});
store(key, result);
store('unfiled-image-call', { key, status: 'returned' });
text({ key, output_hint: result.output_hint });
generatedImage(result);
```

Before any further image call, use the exact returned path/hint to copy the original PNG into the fighter's source folder and record its hash, prompt, references and call provenance. Verify the copied hash. Only then mark the persistent ledger as filed and clear the checkpoint with `store('unfiled-image-call', null)`. A failed call still counts; record its failure and resolve the checkpoint explicitly.

If later output is omitted, recover the stored response with `load(key)` instead of generating again. If that state is unavailable, locate the exact tool event in this agent's session log; the log directory follows the session start date, not today's date. Match the call/prompt and completion event, never the newest image filename. An unresolved result blocks another call; it does not reset the budget.
