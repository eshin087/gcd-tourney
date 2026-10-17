#!/usr/bin/env node
// Delete one throw-away copy that is still locked (tools/scratch-dir.mjs removeCopy() starts this, detached).
//   node tools/rm-later.mjs <scratch>/gcd-deploy-XXXXXX
// Windows keeps files in a deploy export locked for a little while after `vercel deploy` exits (its telemetry flush,
// esbuild.exe, Defender scans), longer than a deploy can wait; the locks are gone within minutes. Exports left for
// the next deploy's sweep piled up to 29 GB in E:\gcd-scratch (2026-10-16, TOOL-053), so this retries every ~10 s
// for up to ~10 min, then exits; the sweep stays the backstop. It deletes nothing but the one path it was given,
// and only when that path is a tool's own copy directly in a scratch folder (isScratchCopy).
// GCD_RM_LATER_INTERVAL_MS / GCD_RM_LATER_TIMEOUT_MS shorten it for tools/test-deploy-export.mjs.
import fs from 'node:fs';
import { isScratchCopy } from './scratch-dir.mjs';

const target = process.argv[2];
const INTERVAL = Number(process.env.GCD_RM_LATER_INTERVAL_MS) || 10_000;
const TIMEOUT = Number(process.env.GCD_RM_LATER_TIMEOUT_MS) || 10 * 60_000;

if (!target || !isScratchCopy(target)) {
  console.error(`rm-later: refusing ${target ?? '(no path)'}: not a gcd-* throw-away copy directly in a scratch folder`);
  process.exit(2);
}
const until = Date.now() + TIMEOUT;
const attempt = () => {
  try {
    fs.rmSync(target, { recursive: true, force: true });
    process.exit(0);
  } catch {
    if (Date.now() + INTERVAL > until) process.exit(1);
    setTimeout(attempt, INTERVAL);
  }
};
attempt();
