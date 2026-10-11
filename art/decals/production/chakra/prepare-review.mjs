import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const names = ['scour_spiral', 'scour_spiral_big', 'cut_wind', 'claw', 'scorch_chakra', 'fracture_chakra'];
const versions = [1, 2, 3, 2, 2, 2];
const notes = [
  'Original v01 retained. Six spirals; groove counts approximate and small facets retain light bias.',
  'Narrower grooves, basin about half footprint, four major slabs in first variant. Counts still approximate rather than exact 6/8; fine cracks and chips may read busy. Fresh source fringe warning remains.',
  'Hairline cuts replace broad gouges; smaller white seams and flatter chips. Four/six slab counts remain approximate. Fresh source fringe warning remains; the final palette retry did not eliminate it.',
  'Four furrows in each variant; straight, upward, downward and short/deep layouts. White streaks shortened. Some lower-lip light bias and raised-looking chips remain. Fresh source fringe warning remains.',
  'Narrow/wide/deep-center fans travel left to right, with restrained origin seams and more consistent texture. Fine part B pixel density and small chip shading remain review caveats. Fresh source fringe warning remains.',
  'Pressure dishes keep center hot specks and clearer beige outward streaks. Fresh source fringe warning cleared. Near-white snapping also creates a few hot pixels on bright outer tips: inspect at game scale.'
];
const dir = 'public/art-review/decals-chakra-cursed';
fs.mkdirSync(`${dir}/candidate`, { recursive: true });
const atlas = JSON.parse(fs.readFileSync('public/preview/decals/atlas.json'));
for (const file of ['atlas.json', ...atlas.pages]) fs.copyFileSync(`public/preview/decals/${file}`, `${dir}/candidate/${file}`);
const qa = [];
let sections = '';
for (let k = 0; k < names.length; k++) {
  const name = names[k], v = `v${String(versions[k]).padStart(2, '0')}`;
  const files = fs.readdirSync('art/decals/raw').filter(f => f.startsWith(`${name}_${v}`) && f.endsWith('.png'));
  for (const f of files) fs.copyFileSync(`art/decals/raw/${f}`, `${dir}/${f}`);
  const frames = fs.readdirSync(`art/decals/frames/${name}`).filter(f => f.endsWith('.png')).sort();
  const colors = new Set(); let opaque = 0, partial = 0, purple = 0, white = 0;
  for (const f of frames) {
    const p = PNG.sync.read(fs.readFileSync(`art/decals/frames/${name}/${f}`));
    fs.copyFileSync(`art/decals/frames/${name}/${f}`, `${dir}/${f}`);
    for (let i = 0; i < p.data.length; i += 4) {
      const [r,g,b,a] = p.data.subarray(i,i+4);
      if (a && a !== 255) partial++;
      if (!a) continue;
      opaque++; colors.add(`${r},${g},${b}`);
      if (r === 255 && g === 255 && b === 255) white++;
      if (Math.min(r,b)-g > 30 && b-g > 50) purple++;
    }
  }
  qa.push({ name, version: versions[k], variants: frames.length, colors: colors.size, opaque, partialAlpha: partial, packedPurple: purple, hotPixels: white, note: notes[k] });
  sections += `<section><h2>${name} ${v} — needs review</h2><p>${notes[k]}</p><p>${frames.length} variants · ${colors.size} packed colors · ${white} hot pixels · ${partial} partial-alpha pixels. Packed quantization does not erase the source-import failures.</p><div class="frames">${frames.map(f=>`<figure><img src="${f}" alt="${f}"><figcaption>${f}</figcaption></figure>`).join('')}</div><details><summary>Versioned raw sources</summary>${files.map(f=>`<a href="${f}">${f}</a><img class="raw" src="${f}" alt="${f}">`).join('')}</details></section>`;
}
fs.writeFileSync('art/decals/production/chakra/pixel-qa.json', JSON.stringify(qa, null, 2)+'\n');
fs.copyFileSync('art/decals/production/chakra/pixel-qa.json', `${dir}/pixel-qa.json`);
fs.writeFileSync(`${dir}/index.html`, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chakra decal corrections — unapproved</title><style>body{margin:20px auto;max-width:1200px;padding:0 16px;background:#171923;color:#eee;font:16px/1.5 system-ui}a{color:#8ecbff}section{border-top:1px solid #667;margin-top:30px}.frames{display:flex;flex-wrap:wrap;gap:12px}figure{margin:0;width:256px}figure img{width:256px;max-height:256px;object-fit:contain;background:#c9bda7;image-rendering:pixelated}figcaption{font-size:12px}.raw{width:100%;image-rendering:pixelated}button{padding:10px;font:inherit}body.rotate figure img{transform:rotate(90deg)}.warning{padding:16px;background:#4c3021}</style></head><body><h1>Chakra decals — correction review</h1><p>Six names, 24 variants. All remain unapproved; provisional style v01 is also unapproved.</p><p class="warning">Four fresh-source palette warnings remain. This is a reviewable improvement, not a fully passing production batch. No character art, approval state, runtime engine, or production decal pack was changed.</p><p><a href="game.html">Open in-game candidate demo and rotation check</a> · <a href="candidate/atlas.json">Exact candidate atlas metadata</a> · <a href="pixel-qa.json">Pixel counts</a></p><button id="rotate">Rotate packed previews 90°</button>${sections}<script>document.querySelector('#rotate').onclick=()=>document.body.classList.toggle('rotate')</script></body></html>`);
fs.writeFileSync(`${dir}/game.html`, `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unapproved chakra game review</title><style>body{margin:0;background:#171923;color:white;font:16px system-ui}header{padding:12px}button,a{margin-right:12px;padding:8px;color:inherit}button{background:#374258}iframe{border:0;width:100%;height:80vh}#status{margin-top:12px}</style><header><a href="index.html">Gallery</a><button id="load">Show 24 chakra candidates</button><button id="rotate">Rotate 90°</button><div id="status">Unapproved review harness. Wait for the match to load, then show candidates.</div></header><iframe id="game" src="/?fight=naruto,sasuke&mode=solo&debug"></iframe><script type="module">import{showReviewGroup,rotateReview}from'./review-candidates.js';const frame=document.querySelector('#game'),status=document.querySelector('#status');document.querySelector('#load').onclick=async()=>{try{const r=await showReviewGroup(frame,'chakra',['chakra']);status.textContent='Unapproved candidates loaded: '+JSON.stringify(r)}catch(e){status.textContent=e.message}};document.querySelector('#rotate').onclick=()=>{try{status.textContent=rotateReview(frame)}catch(e){status.textContent=e.message}};</script>`);
console.log(JSON.stringify(qa, null, 2));
