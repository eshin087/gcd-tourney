# Killua charge v15 — post-merge recheck

Date: 2026-10-19 UTC / 2026-10-18 Pacific. Auditor: GPT-6 Astra, medium.
Branch: `art/charge-killua`; merged HEAD: `3b4ae71da03da4e872196196356ffeb15088c17d`.

**Result: packed-art identity PASS; prior quantitative body/segment HOLD remains unchanged.** This is a supplement to `ASTRA_AUDIT.md`, including its palette-mismatch follow-up, and is not user approval.

## Exact binding

SHA-256 checks against the prior `evidence.json` confirm these files are byte-identical:

- Raw `charge_v15.png`: `eee81e7655d1d63a3223f45cc1e79c2c335983b05db77d01a71aeef6f018b108`
- Packed `sheet.png`: `6408da250f82c522f8175ae16fea09dd44cc754773d251d020e06848f151e106`
- `anims.json`: `f384d3e85d1a4fc1e7174b415b333cfa5867ef599f5d07fc326c5ca138e7ca79`
- Approved neutral v01: `86278707ba8f0fcb78942cbcedb3341d8ad8f559e95f8cbf48273d0bbdca1855`
- Approved combat v01: `d32d8f9f297efac7bcd8ba7e0dfd34c4d458ada1fc5e45a9c93801340f5a63d6`

Independently decoded the current atlas to RGBA and compared every pixel against the saved exact audit crops: all six charge cells and idle f0 are identical. Charge remains cells **115–120**, row **7**, columns **3–8** (zero based), 256×256; x=768,1024,1280,1536,1792,2048; y=1792. Idle f0 remains cell 0 at (0,0). Thus registration, silhouettes, head/torso/limb/clothing pixels and palette are unchanged, not merely visually similar.

Durations remain 70/90/110/110/110/110 ms; loop=true, loopFrom=2. The charge scaleAudit entry is identical, with median H=1.011 and verdict=ok. The regenerated global body-report file has a different hash (`d456967ca910dee1c6f18bfdbf250a9ee1b9ee7051e25ce1b41f57dab99d3a16`), but its Killua charge v15 entry is structurally identical: B=.438/.447/.454/.433/.439/.430, median .439.

## Findings carried forward

The prior head pass, floor registration and plausible crouched anatomy findings apply to these exact packed pixels. The original garment mask undercounts the darker candidate palette; the broader purple-mask diagnostic remains .931–.953 for release/hold. This does not certify hidden joint positions or torso/limb lengths within the brief's numeric tolerance. Prior landmark uncertainty (approximately ±2–3 px, with foreshortening/occlusion) and the limited quantitative body/segment HOLD remain. No redraw or global rescale is justified by B alone. No head exemption is warranted.

**Review evidence:** existing charge crops, comparison sheets and displayed animation do not need regeneration. Link this supplemental report to document the post-merge binding; retain the prior report and its uncertainty. Do not describe the changed global body-report hash as the old hash. No timed browser playback or contact/hurtbox validation was added by this recheck. No art, manifest or pack output was modified.
