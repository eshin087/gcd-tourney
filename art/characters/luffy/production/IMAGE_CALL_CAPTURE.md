# Luffy image-call capture protocol

Use this protocol for any specifically authorized remaining Luffy generation call. Current inventory: `light1` has 4 cumulative calls (one additional call remains authorized, but was not used for this batch); `win` has 2 cumulative calls and its one authorized correction call is consumed; `special` has 3 cumulative calls and no calls remain. Do not infer unused budget from asset version numbers.

1. Before calling imagegen, write a pending checkpoint with asset, candidate version, cumulative call number, authorization source, exact prompt, exact input paths and SHA-256 hashes.
2. Immediately after return, store the complete tool result. Print only `output_hint` metadata and render the returned image. Do not assume a content-block schema or search for the newest generated file.
3. Copy the exact returned `savedPath` into `production/generation-source/` under a filename that distinguishes candidate version from call number. Verify byte count and SHA-256 against the original before clearing the pending checkpoint or making another call.
4. Record exact tool call ID, start/end time, prompt, input hashes, output path/hash, byte count and inspection result in a sidecar Markdown file. Preserve every output; never overwrite or silently discard a failed call.
5. If the exact returned path cannot be recovered, stop generation and report the missing provenance. If no suitable call remains authorized, retain the source and mark it held; do not make a substitute call.

The win v03 correction call was cumulative win call 2 and consumed its authorized 1/1 correction. Light1 attempt 5 remains unused. Special has no remaining budget. This protocol records handling; it does not authorize calls or approve art.
