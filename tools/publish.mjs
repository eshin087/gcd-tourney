#!/usr/bin/env node
// Push a slim copy of main to the private GitHub repo (no raw image generations).
//
//   npm run publish:github                    (local main -> GitHub main)
//   npm run publish:github -- --branch <name> (a local branch -> the same GitHub branch, e.g. for a PR)
//
// The local repository keeps everything (raw ChatGPT/Codex images are ~1 GB and growing). GitHub
// gets the same history minus art/**/raw/, _rejected/, _old/ and contact sheets, rewritten with
// git-filter-repo in a scratch clone. The rewrite is deterministic, so every run produces the same
// commit ids for old commits and the push is a normal fast-forward.
// Needs: python with git-filter-repo (`python -m pip install git-filter-repo`).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scratchDir } from './scratch-dir.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REMOTE = process.env.GCD_PUBLISH_REMOTE || 'https://github.com/eshin087/gcd-tourney.git';
const bi = process.argv.indexOf('--branch');
const BRANCH = bi > 0 && process.argv[bi + 1] ? process.argv[bi + 1] : 'main';
const EXCLUDE = ['art/*/raw/*', 'art/*/_rejected/*', 'art/*/_old/*', 'art/*/contact/*'];

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();

const work = fs.mkdtempSync(path.join(scratchDir(), 'gcd-publish-'));
try {
  run('git', ['clone', '-q', '--no-local', '--single-branch', '--branch', BRANCH, ROOT, work]);
  const python = process.platform === 'win32' ? 'python' : 'python3';
  run(python, ['-m', 'git_filter_repo', '--force', '--quiet', '--invert-paths', ...EXCLUDE.flatMap((g) => ['--path-glob', g])], work);
  run('git', ['remote', 'add', 'origin', REMOTE], work);
  const head = run('git', ['rev-parse', '--short', 'HEAD'], work);
  execFileSync('git', ['push', 'origin', `${BRANCH}:${BRANCH}`], { cwd: work, stdio: 'inherit' });
  console.log(`published ${BRANCH} (${head}) to ${REMOTE} without raw art`);
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
