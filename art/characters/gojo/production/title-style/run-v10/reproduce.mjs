import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

// Run-only QA fixture: no production gate overrides and no writeback to source art.
const dir = 'art/characters/gojo/production/title-style/run-v10';
const fixture = `${dir}/fixture`;
fs.mkdirSync(`${fixture}/characters/gojo/raw`, { recursive: true });
const manifest = JSON.parse(fs.readFileSync('art/manifest.json', 'utf8'));
const character = structuredClone(manifest.characters.gojo);
character.animations = { idle: character.animations.idle, run: character.animations.run };
character.animations.run.version = 10;
delete character.ui;
delete character.reference;
manifest.characters = { gojo: character };
fs.writeFileSync(`${fixture}/manifest.json`, JSON.stringify(manifest, null, 2));
for (const file of ['idle_v06.png', 'idle_v06.json', 'run_v10.png', 'run_v10.json']) {
  fs.copyFileSync(`art/characters/gojo/raw/${file}`, `${fixture}/characters/gojo/raw/${file}`);
}
fs.mkdirSync(`${fixture}/scale`, { recursive: true });
fs.copyFileSync('art/scale/builds.json', `${fixture}/scale/builds.json`);
const pack = spawnSync(process.execPath, ['tools/pack-sprites.mjs', 'gojo', '--quantize', '48', '--strict-scale', '--root', fixture, '--out', 'public/reviews/gojo-run-v10', '--no-writeback'], { encoding: 'utf8' });
fs.writeFileSync(`${dir}/isolated-strict-pack.txt`, pack.stdout + pack.stderr);
process.stdout.write(pack.stdout + pack.stderr);
if (pack.status !== 0) process.exit(pack.status ?? 1);
const scale = spawnSync(process.execPath, ['tools/scale-audit.mjs', 'gojo', '--root', fixture, '--public', 'public/reviews/gojo-run-v10', '--out', `${dir}/scale`], { encoding: 'utf8' });
process.stdout.write(scale.stdout + scale.stderr);
process.exitCode = scale.status ?? 1;
