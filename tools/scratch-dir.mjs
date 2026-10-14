// Where tools build throw-away copies (deploy exports, art-guard scratch trees; publishing uses .publish-cache/).
//
// Not os.tmpdir() when that is on another drive than the project: a deploy export (committed tree plus
// `vercel build`) is ~4 GB, and parallel agents deploy often, so on a machine whose project drive is not the system
// drive that filled the system drive. The scratch folder is `gcd-scratch` at the root of the project's drive, shared
// by every worktree so stale-export sweeps see each other's leftovers. Same drive as the temp folder (and Linux, mac
// and CI, where there is only one root): plain os.tmpdir(), unchanged. GCD_SCRATCH_DIR overrides both.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const driveOf = (p) => path.parse(path.resolve(p)).root.toLowerCase();

export function scratchDir() {
  const dir = process.env.GCD_SCRATCH_DIR
    || (driveOf(ROOT) === driveOf(os.tmpdir()) ? os.tmpdir() : path.join(path.parse(ROOT).root, 'gcd-scratch'));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
