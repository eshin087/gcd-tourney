# airHeavyAlt v03 technical hold handoff — 2026-10-15

`raw/airHeavyAlt_v03.png` was moved byte-for-byte to `raw/_qa_hold/airHeavyAlt_v03.png` to keep the unverified candidate out of the normal raw input set. Its SHA-256 remains `8D86F7C326194ECFF02524E260E5E3D6A0BE34FD42CE999433322B138D2BDE40` (1,618,903 bytes). There was no adjacent v03 sidecar.

**Selector caveat:** `raw/airHeavyAlt_v01.png` and `raw/airHeavyAlt_v02.png` are still present. The main packer's highest-remaining-version selection may therefore choose v02 after v03 is moved. This move alone does not establish that the approved base `airHeavy` will be used as fallback. The review row, inventory and tracker record this uncertainty. Do not claim base fallback or a verified repack from this hold operation.

Claude owns resolving the repack/cache/fallback behavior and performing production contact/hurtbox checks. No art, hitbox, sidecar, manifest approval field, bodyHeight, exemption or manual-QA data was changed here.
