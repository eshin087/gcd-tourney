// Simulation math lint (ADR 0036; third step of prebuild, so `npm run build` fails on it). The simulation must
// compute the same bits on every engine, and the spec leaves the last bit of Math.sin, cos, hypot, atan2, pow, exp,
// log ... to each one (Safari's Math.hypot is one ulp off Chrome's, which split an online match in the determinism
// test). Gameplay files call src/game/dmath.js instead; this fails the build on any of those Math functions there,
// with file:line. Effects, the camera, the CPU brains and three.js keep the engine's: they don't feed the simulation.
// Usage: node tools/lint-sim-math.mjs [root]   (root defaults to the repository; the lint test points it at fixtures)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));

// the files the fixed step computes gameplay state in (keep in step with ADR 0036 and the SIM_ID list in vite.config.js)
const SIM_FILES = [
  'src/game/fighter.js', 'src/game/kit.js', 'src/game/game.js', 'src/game/projectiles.js', 'src/game/clash.js',
  'src/game/techAnim.js', 'src/game/basis.js', 'src/game/moves.js', 'src/game/animAlts.js', 'src/game/animPhase.js',
  'src/game/constants.js', 'src/core/input.js',
];
const SIM_DIRS = ['src/characters'];
const BANNED = /\bMath\.(sin|cos|tan|asin|acos|atan|atan2|sinh|cosh|tanh|asinh|acosh|atanh|hypot|pow|exp|expm1|log|log1p|log2|log10|cbrt)\b/;

const files = [...SIM_FILES];
for (const d of SIM_DIRS) {
  const dir = path.join(root, d);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith('.js')) files.push(`${d}/${f}`);
}

const bad = [];
for (const rel of files) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) continue;
  fs.readFileSync(p, 'utf8').split(/\r?\n/).forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, ''); // a comment may name them
    const m = code.match(BANNED);
    if (m) bad.push(`${rel}:${i + 1}: ${m[0]} (use dmath.${m[1]} from src/game/dmath.js${['hypot', 'sin', 'cos', 'atan', 'atan2'].includes(m[1]) ? '' : ', adding it there'})`);
  });
}

if (bad.length) {
  console.error(`[lint-sim-math] ${bad.length} engine-rounded Math call(s) in simulation files (ADR 0036):`);
  for (const b of bad) console.error('  ' + b);
  process.exit(1);
}
console.log(`[lint-sim-math] ok: ${files.length} simulation files use deterministic math`);
