import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';

const root = path.resolve('.');
const atlasDir = path.join(root, 'public/preview/vfx');
const outDir = path.join(root, 'public/reviews/clash-hd');
const assets = path.join(outDir, 'assets');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'art/manifest.json'), 'utf8'));
const atlas = JSON.parse(fs.readFileSync(path.join(atlasDir, 'atlas.json'), 'utf8'));
const names = ['clashKnot', 'spearStream', 'palmStream', 'fireballStream', 'kamehamehaStream', 'beastBeamStream', 'redPush', 'dragonFistPush'];
const references = {
  spearStream: ['chidoriSpear', [3, 4, 5]],
  palmStream: ['lightningPalm', [0]],
  fireballStream: ['greatFireball', [0]],
  kamehamehaStream: ['kamehamehaHead', [0]],
  beastBeamStream: ['beastBall', [0]],
  redPush: ['reversalRed', [0]],
  dragonFistPush: ['dragonFistDragon', [0]],
};

fs.mkdirSync(assets, { recursive: true });

const readCell = (name, frame) => {
  const meta = atlas.hd.effects[name];
  if (!meta) throw new Error(`${name}: not present in preview atlas metadata`);
  const page = atlas.hd.pages[meta.page];
  const png = PNG.sync.read(fs.readFileSync(path.join(atlasDir, page.image)));
  const cell = atlas.hd.cell;
  const x0 = frame * cell, y0 = meta.row * cell;
  const result = new PNG({ width: cell, height: cell });
  for (let y = 0; y < cell; y++) {
    const start = ((y0 + y) * png.width + x0) * 4;
    png.data.copy(result.data, y * cell * 4, start, start + cell * 4);
  }
  return result;
};

const upscale = (img, scale = 2) => {
  const out = new PNG({ width: img.width * scale, height: img.height * scale });
  for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) {
    const si = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
    const di = (y * out.width + x) * 4;
    img.data.copy(out.data, di, si, si + 4);
  }
  return out;
};

const writePng = (file, img) => fs.writeFileSync(file, PNG.sync.write(img));
const composeTripled = (img) => {
  const out = new PNG({ width: img.width * 3, height: img.height });
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) for (let k = 0; k < 3; k++) {
    const si = (y * img.width + x) * 4;
    const di = (y * out.width + k * img.width + x) * 4;
    img.data.copy(out.data, di, si, si + 4);
  }
  return out;
};

const makeGif = (pattern, fps, output) => {
  const filter = '[0:v]split[v1][v2];[v1]palettegen=reserve_transparent=1:stats_mode=diff[p];[v2][p]paletteuse=alpha_threshold=128';
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(fps), '-i', pattern, '-filter_complex', filter, '-loop', '0', output], { stdio: 'inherit' });
};

const effectMeta = {};
for (const name of names) {
  const e = manifest.vfx.effects[name];
  const cells = [];
  for (let f = 0; f < e.frames; f++) {
    const cell = readCell(name, f);
    cells.push(cell);
    writePng(path.join(assets, `${name}_f${String(f).padStart(2, '0')}.png`), cell);
    writePng(path.join(assets, `${name}_2x_f${String(f).padStart(2, '0')}.png`), upscale(cell));
    if (e.tile) writePng(path.join(assets, `${name}_tile_${String(f).padStart(2, '0')}.png`), composeTripled(cell));
  }
  makeGif(path.join(assets, `${name}_2x_f%02d.png`), 1000 / e.ms, path.join(assets, `${name}.gif`));
  if (e.tile) makeGif(path.join(assets, `${name}_tile_%02d.png`), 1000 / e.ms, path.join(assets, `${name}_tiled.gif`));
  if (references[name]) {
    const [refName, refFrames] = references[name];
    effectMeta[name] = { refName, refFrames };
    for (const f of refFrames) writePng(path.join(assets, `${name}_reference_f${String(f).padStart(2, '0')}.png`), readCell(refName, f));
  }
}

const descriptions = {
  clashKnot: 'Shared collision knot; engine tints a white and gray source.',
  spearStream: 'Sasuke’s Chidori Spear held as a lightning lance.',
  palmStream: 'Killua’s Lightning Palm bolt as a continuous stream.',
  fireballStream: 'Sasuke’s Great Fireball torrent.',
  kamehamehaStream: 'Goku’s Kamehameha body behind its approved head.',
  beastBeamStream: 'Naruto’s Four-Tails chakra beam body.',
  redPush: 'Gojo’s Reversal: Red orb shoving forward with repulsion waves.',
  dragonFistPush: 'Goku’s golden dragon bursting forward from his fist.',
};
const htmlSections = names.map((name) => {
  const e = manifest.vfx.effects[name];
  const frames = Array.from({ length: e.frames }, (_, i) => `<figure><img loading="lazy" width="512" height="512" src="assets/${name}_2x_f${String(i).padStart(2, '0')}.png" alt="${name} frame ${i} at 2x"><figcaption>Frame ${i}</figcaption></figure>`).join('');
  const ref = effectMeta[name] ? `<div class="compare"><figure><img src="assets/${name}_f00.png" width="256" height="256" alt="${name} frame 0 at native cell scale"><figcaption>${name} · v${String(e.version).padStart(2, '0')}</figcaption></figure><span aria-hidden="true">↔</span>${effectMeta[name].refFrames.map((f) => `<figure><img src="assets/${name}_reference_f${String(f).padStart(2, '0')}.png" width="256" height="256" alt="Approved ${effectMeta[name].refName} frame ${f} at native cell scale"><figcaption>Approved ${effectMeta[name].refName} · frame ${f}</figcaption></figure>`).join('')}</div>` : '';
  const tiles = e.tile ? `<h3>Three copies end to end</h3><img class="tiled" src="assets/${name}_tiled.gif" alt="${name} loop tiled three times">` : '';
  const provenance = `<p class="meta">${e.frames} frames · ${e.ms} ms/frame · owner: ${e.owner} · anchor: center · ${e.tile ? 'horizontal tile' : 'single effect'} · status: ${e.reviewStatus || 'needs review'}</p>`;
  return `<section id="${name}"><h2>${name}</h2><p>${descriptions[name]}</p>${provenance}<div class="loop"><figure><img src="assets/${name}.gif" alt="Looping ${name} animation"><figcaption>Looping preview</figcaption></figure>${tiles}</div>${ref}<h3>Frames at 2×</h3><div class="frames">${frames}</div></section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#10151e"><title>Clash HD effect review</title><style>
:root{color-scheme:dark;--bg:#10151e;--panel:#1a2330;--line:#303c4d;--text:#edf3fb;--muted:#a9b5c6;--accent:#82d7ff}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}main{max-width:1120px;margin:auto;padding:20px}h1{font-size:clamp(1.7rem,5vw,2.6rem);line-height:1.1;margin:.2em 0}h2{font-size:1.45rem;margin:.1em 0}h3{font-size:1rem;margin:18px 0 8px;color:#d8e7f3}.intro,.status{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;margin:14px 0}.status{border-left:4px solid #e6ba5b}.muted,.meta,figcaption{color:var(--muted);font-size:.9rem}.status strong{color:#ffe08a}section{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;margin:18px 0;scroll-margin-top:12px}.loop{display:flex;flex-wrap:wrap;align-items:flex-start;gap:18px}.loop figure{margin:0}.loop img{display:block;width:min(100%,512px);height:auto;image-rendering:pixelated;background:#080b10;border:1px solid var(--line);border-radius:8px}.loop figcaption,.frames figcaption,.compare figcaption{padding-top:4px}.tiled{display:block;width:min(100%,768px);height:auto;image-rendering:pixelated;background:#080b10;border:1px solid var(--line);border-radius:8px}.frames{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:8px}.frames figure,.compare figure{margin:0;min-width:0}.frames img{display:block;width:100%;height:auto;image-rendering:pixelated;background:#080b10;border:1px solid var(--line);border-radius:6px}.compare{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin:18px 0;padding:12px;background:#131b26;border-radius:10px}.compare figure{width:min(256px,100%)}.compare img{display:block;width:100%;height:auto;image-rendering:pixelated;background:#080b10;border:1px solid var(--line);border-radius:6px}.compare>span{color:var(--accent);font-size:1.4rem}@media(max-width:520px){main{padding:12px}.loop{display:block}.loop>figure{margin-bottom:14px}.frames{grid-template-columns:repeat(2,minmax(0,1fr))}.compare{gap:8px}.compare figure{width:calc(50% - 28px)}}
</style></head><body><main><header><h1>Clash HD effects</h1><p>Eight clash effects matching each fighter’s approved HD move art.</p><div class="status"><strong>Approved as drawn.</strong> The user approved all eight images via Claude relay beam-clash-6 #3 (“Approve all 8 (Recommended)”). Claude owns atlas/runtime integration; approval applies to these drawings.</div><div class="intro"><strong>Technical note:</strong> Generated sources were larger than square-cell strips. The five continuous bands were cropped, background-keyed, and palette-limited into exact 256×256 tiles. The Four-Tails source had white bars outside its magenta strip; those bars were removed from the derived tiles while the original versioned raw is preserved. C1 is imported from derived grayscale cells; Red and Dragon Fist are split from their preserved raw strips by the packer. Packer warnings for unrelated existing effects are recorded in the branch QA notes.</div><nav>${names.map((n) => `<a href="#${n}">${n}</a>`).join(' · ')}</nav></header>${htmlSections}<footer class="muted">Source prompts, generation call counts and hashes: <a href="../../../art/vfx/production/clash-hd/CALLS.md">call inventory</a>. Review page uses packed atlas outputs; approval does not claim runtime integration.</footer></main></body></html>`;
fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log(`Built ${outDir}/index.html with ${names.length} effects and ${Object.keys(effectMeta).length} approved-effect comparisons.`);
