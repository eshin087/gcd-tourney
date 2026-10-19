#!/usr/bin/env node
// Animation-contract lint (TOOL-004). Runs before every build (prebuild) so a half-finished animation change
// fails `npm run build` with a precise list instead of surfacing as a missing strip at runtime.
//
//   node tools/lint-anims.mjs [--strict]      --strict turns the warnings into failures
//
// The contract (CLAUDE.md "Animation names are a contract"): src/art/animGuide.js is the canonical list, and each
// name must also exist in art/manifest.json, in FALLBACK (src/game/sprites.js), in the 3D placeholder
// (src/art/rig/anims.js) where it is baked, and in art/SPEC.md. Checked here:
//   1. every guide animation has a manifest `animationDefaults` entry, and nothing in the manifest is unknown to the guide;
//   2. every fighter's `characters.<id>.animations` has an entry for every guide animation (an optional one that is
//      missing is only a warning: the packer falls back to the default entry, so nothing breaks);
//   3. every optional animation has its own FALLBACK entry, FALLBACK names only real animations, and it reaches one the placeholder bakes
//      for every roster fighter within the engine's 6-hop guard (SheetAsset.anim);
//   4. every `altOf` (attack alts, ADR 0031) names an existing base and repeats its frames and phases, in the guide,
//      the manifest defaults and each fighter's entry;
//   5. art/SPEC.md mentions every animation name (ASSETS.md every optional one) in backticks (warning only: prose can be reworded);
//   6. a move that strikes behind (`back: true` in src/game/moves.js MOVES) plays a strip the guide marks `strike: 'back'`,
//      and every such strip is one: the packer looks for that strip's auto hit box behind the body (TOOL-062).
// sprites.js imports three.js and reads `location`, so FALLBACK is parsed out of the source text, not imported.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const HOPS = 6; // SheetAsset.anim() gives up (and shows idle) after this many FALLBACK steps

// Pure check: every input is plain data, so the test can hand it a doctored copy.
// in: { guide, manifest, fallback, baked: { <fighterId>: [anim names the placeholder bakes] }, spec, assets, moves }
export function checkAnims({ guide, manifest, fallback, baked, spec, assets, moves = {} }) {
  const errors = [];
  const warnings = [];
  const notes = [];
  const names = Object.keys(guide);
  // `npm run deploy` builds a clean export of HEAD without art/ (tools/deploy.mjs): no manifest, no SPEC. The guide,
  // FALLBACK and placeholder checks still run there.
  if (!manifest) notes.push('art/manifest.json not found (a deploy export drops art/): the manifest checks are skipped');
  const defaults = manifest?.animationDefaults || {};
  const chars = manifest?.characters || {};
  const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

  // 1. manifest defaults <-> guide
  for (const n of manifest ? names : []) if (!defaults[n]) errors.push(`animationDefaults has no entry for "${n}" (art/manifest.json)`);
  for (const n of Object.keys(defaults)) if (!guide[n]) errors.push(`animationDefaults has "${n}", which is not in ANIM_GUIDE (src/art/animGuide.js)`);

  // 2. every fighter has every animation (optional ones: warn, the default entry stands in)
  for (const [id, c] of Object.entries(chars)) {
    const have = c.animations || {};
    const lacking = names.filter((n) => !have[n]);
    for (const n of lacking.filter((x) => !guide[x].optional)) errors.push(`characters.${id}.animations has no "${n}" entry`);
    const opt = lacking.filter((x) => guide[x].optional);
    if (opt.length) warnings.push(`characters.${id}.animations has no entry for optional ${opt.join(', ')} (the animationDefaults entry applies)`);
    for (const n of Object.keys(have)) if (!guide[n]) errors.push(`characters.${id}.animations has "${n}", which is not in ANIM_GUIDE`);
  }

  // 3. FALLBACK reaches a baked animation
  for (const n of names) {
    if (guide[n].optional && !(n in fallback)) errors.push(`optional animation "${n}" has no FALLBACK entry (src/game/sprites.js)`);
  }
  // a mistyped target ("speical") would silently fall through to idle, so every name in the map must be real
  for (const [from, to] of Object.entries(fallback)) {
    if (!(from in guide) && !Object.values(fallback).includes(from)) errors.push(`FALLBACK has a key "${from}" that is neither an animation name nor another entry's target (src/game/sprites.js)`);
    if (!(to in guide) && !(to in fallback)) errors.push(`FALLBACK maps "${from}" to "${to}", which is not an animation name (src/game/sprites.js)`);
  }
  for (const [id, keys] of Object.entries(baked)) {
    const has = new Set(keys);
    for (const n of names) {
      let cur = n, hops = 0;
      while (!has.has(cur) && hops++ < HOPS) cur = fallback[cur] || 'idle';
      if (has.has(cur)) continue;
      const chain = [n];
      for (let c2 = n, h = 0; h < HOPS; h++) chain.push(c2 = fallback[c2] || 'idle');
      errors.push(`"${n}" never reaches an animation the placeholder bakes for ${id} (FALLBACK chain ${chain.join(' > ')}; src/art/rig/anims.js)`);
    }
  }

  // 4. attack alts repeat their base's frames and phases
  const checkAlt = (where, alt, base, altName) => {
    if (!alt || !base) return;
    if (alt.frames !== undefined && alt.frames !== base.frames) errors.push(`${where}: "${altName}" has ${alt.frames} frames, its base has ${base.frames}`);
    if (alt.phases !== undefined && !same(alt.phases, base.phases)) errors.push(`${where}: "${altName}" phases ${JSON.stringify(alt.phases)} differ from its base's ${JSON.stringify(base.phases ?? null)}`);
  };
  for (const n of names) {
    const base = guide[n].altOf;
    if (!base) continue;
    if (!guide[base]) { errors.push(`"${n}" is altOf "${base}", which is not in ANIM_GUIDE`); continue; }
    if (guide[base].altOf) errors.push(`"${n}" is altOf "${base}", which is itself an alt`);
    checkAlt('ANIM_GUIDE', guide[n], guide[base], n);
    if (defaults[n] && defaults[n].altOf !== base) errors.push(`animationDefaults.${n}.altOf is ${JSON.stringify(defaults[n].altOf ?? null)}, the guide says "${base}"`);
    checkAlt('animationDefaults', defaults[n], defaults[base], n);
    for (const [id, c] of Object.entries(chars)) {
      const a = c.animations?.[n];
      if (a?.altOf !== undefined && a.altOf !== base) errors.push(`characters.${id}.animations.${n}.altOf is "${a.altOf}", the guide says "${base}"`);
      checkAlt(`characters.${id}`, a, c.animations?.[base], n);
    }
  }
  for (const n of Object.keys(defaults)) {
    if (defaults[n].altOf && guide[n] && guide[n].altOf !== defaults[n].altOf) errors.push(`animationDefaults.${n}.altOf is "${defaults[n].altOf}" but the guide has no matching altOf`);
  }

  // 5. docs mention every name (backticked: a bare word like `special` would match any prose)
  // SPEC lists every animation; ASSETS.md only the optional strips (the core list lives in SPEC)
  for (const [label, text, list] of [['art/SPEC.md', spec, names], ['ASSETS.md', assets, names.filter((n) => guide[n].optional)]]) {
    if (text == null) continue;
    const missing = list.filter((n) => !text.includes('`' + n + '`'));
    if (missing.length) warnings.push(`${label} does not mention in backticks: ${missing.join(', ')}`);
  }

  // 6. the strike side the packer boxes matches the move's: a mismatch puts the auto hit box on the wrong side
  const backAnims = new Set();
  for (const [id, m] of Object.entries(moves)) {
    if (!m?.back || !m.anim || !guide[m.anim]) continue;
    backAnims.add(m.anim);
    if (guide[m.anim].strike !== 'back') errors.push(`MOVES.${id} strikes behind (back: true) but ANIM_GUIDE.${m.anim} has no strike: 'back' (the packer would box it in front)`);
  }
  for (const n of names) {
    if (guide[n].strike !== undefined && guide[n].strike !== 'back') errors.push(`ANIM_GUIDE.${n}.strike is ${JSON.stringify(guide[n].strike)} - only 'back' is known`);
    else if (guide[n].strike === 'back' && !backAnims.has(n)) errors.push(`ANIM_GUIDE.${n} has strike: 'back' but no move with back: true plays it (src/game/moves.js MOVES)`);
  }
  return { errors, warnings, notes };
}

// FALLBACK is an object literal in sprites.js: lift it out of the text (comments are stripped first, the body is
// plain `name: 'name'` pairs) rather than import a module that needs a browser.
export function parseFallback(src) {
  const m = src.match(/export const FALLBACK = (\{[\s\S]*?\n\});/);
  if (!m) throw new Error('could not find `export const FALLBACK = {...};` in src/game/sprites.js');
  const body = m[1].replace(/\/\/[^\n]*/g, '');
  return new Function(`return (${body});`)();
}

export async function loadReal(root) {
  const imp = (rel) => import(pathToFileURL(path.join(root, rel)).href);
  const { ANIM_GUIDE } = await imp('src/art/animGuide.js');
  const { ROSTER } = await imp('src/characters/index.js'); // builds each fighter's placeholder anims (a few ms)
  const { MOVES } = await imp('src/game/moves.js');
  const read = (rel) => (fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), 'utf8') : null);
  return {
    guide: ANIM_GUIDE,
    manifest: read('art/manifest.json') ? JSON.parse(read('art/manifest.json')) : null,
    fallback: parseFallback(read('src/game/sprites.js')),
    baked: Object.fromEntries(ROSTER.map((c) => [c.id, Object.keys(c.anims)])),
    spec: read('art/SPEC.md'),
    assets: read('ASSETS.md'),
    moves: MOVES,
  };
}

export async function lintAnims(root, { strict = false } = {}) {
  const r = checkAnims(await loadReal(root));
  return { ...r, failed: r.errors.length > 0 || (strict && r.warnings.length > 0) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const t0 = performance.now();
  const strict = process.argv.includes('--strict');
  const r = await lintAnims(root, { strict });
  for (const n of r.notes) console.log(`lint-anims: note: ${n}`);
  for (const w of r.warnings) console.warn(`lint-anims: warning: ${w}`);
  for (const e of r.errors) console.error(`lint-anims: ERROR: ${e}`);
  const ms = Math.round(performance.now() - t0);
  if (r.failed) {
    console.error(`lint-anims: failed (${r.errors.length} error(s), ${r.warnings.length} warning(s)${strict ? ', --strict' : ''}) in ${ms} ms. The animation contract: CLAUDE.md "Animation names are a contract".`);
    process.exit(1);
  }
  console.log(`lint-anims: ok (${r.warnings.length} warning(s)) in ${ms} ms`);
}
