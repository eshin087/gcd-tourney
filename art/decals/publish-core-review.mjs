import fs from 'node:fs';
import path from 'node:path';
import {readPng,crop} from '../../tools/pack-sprites.mjs';
const out='public/art-review/decals', source='public/preview/decals';
fs.mkdirSync(out+'/candidate',{recursive:true});
const atlas=JSON.parse(fs.readFileSync(source+'/atlas.json','utf8'));
for(const f of ['atlas.json',...atlas.pages])fs.copyFileSync(source+'/'+f,out+'/candidate/'+f);
const rows=[];
for(const [name,d] of Object.entries(atlas.decals)){
 const page=readPng(source+'/'+atlas.pages[d.page]),colors=new Set();let partial=0,hot=0,purple=0,opaque=0;
 for(const [x,y] of d.frames){const c=crop(page,x,y,d.w,d.h);for(let i=0;i<c.data.length;i+=4){const [r,g,b,a]=c.data.subarray(i,i+4);if(a&&a!==255)partial++;if(a){opaque++;colors.add([r,g,b].join(','));if(r===255&&g===255&&b===255)hot++;if(Math.min(r,b)-g>30&&b-g>50)purple++;}}}
 rows.push({name,version:d.version,frames:d.frames.length,colors:colors.size,partialAlpha:partial,hot,requiresHot:!!d.hotKey,packedPurplePct:purple/opaque*100});
 for(const f of fs.readdirSync('art/decals/raw').filter(f=>f.startsWith(name+'_v'+String(d.version).padStart(2,'0'))&&f.endsWith('.png')))fs.copyFileSync('art/decals/raw/'+f,out+'/'+f);
}
fs.writeFileSync('art/decals/variant-qa-corrections.json',JSON.stringify(rows,null,2)+'\n');
fs.copyFileSync('art/decals/variant-qa-corrections.json',out+'/variant-qa-corrections.json');
fs.copyFileSync('art/decals/pack-report-corrections.txt',out+'/pack-report-corrections.txt');
const intro='Five corrected v02 sets: crack_s, scuff, skid, burn_lightning_big and barrier_crack. All 19 names / 99 variants remain unapproved. Fresh source pack still reports fringe on 18 names; the barrier grayscale warning is cleared. Directional stone facets remain in older sets. These are partial improvements, not a clean art pass.';
const sources=Object.entries(atlas.decals).map(([n,d])=>{const v=String(d.version).padStart(2,'0');return '<details><summary>'+n+' v'+v+' sources</summary>'+fs.readdirSync(out).filter(f=>f.startsWith(n+'_v'+v)&&f.endsWith('.png')).map(f=>'<a href="'+f+'"><img loading="lazy" src="'+f+'" alt="'+f+'"></a>').join('')+'</details>'}).join('\n');
fs.writeFileSync(out+'/index.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Core decal candidates</title><style>body{background:#202732;color:#eee;font:16px system-ui;margin:24px}a{color:#bce}img{max-width:100%;image-rendering:pixelated}figure{display:inline-block;margin:8px;width:240px}canvas{width:100%;image-rendering:pixelated;background:#74715f}details{margin:20px 0}button{padding:12px}</style><h1>Core decal correction review</h1><p>${intro}</p><p><a href="./game.html">Open game demo, rotation and cooling</a> · <a href="pack-report-corrections.txt">Fresh source pack report</a> · <a href="variant-qa-corrections.json">Packed QA</a></p><p>Only the user can approve a named version. No approval is recorded.</p><div id="variants"></div><h2>Latest raw sources</h2>${sources}<script>fetch('./candidate/atlas.json').then(r=>r.json()).then(async a=>{for(const [name,d] of Object.entries(a.decals)){const h=document.createElement('h3');h.textContent=name+' v'+String(d.version).padStart(2,'0');variants.append(h);const im=new Image();im.src='./candidate/'+a.pages[d.page];await im.decode();d.frames.forEach(([x,y],i)=>{const f=document.createElement('figure'),c=document.createElement('canvas');c.width=d.w;c.height=d.h;c.getContext('2d').drawImage(im,x,y,d.w,d.h,0,0,d.w,d.h);f.append(c);const cap=document.createElement('figcaption');cap.textContent=name+' #'+i;f.append(cap);variants.append(f)})}})</script></html>`);
console.log(JSON.stringify({names:rows.length,variants:rows.reduce((s,r)=>s+r.frames,0),invalid:rows.filter(r=>r.colors>24||r.partialAlpha||r.requiresHot&&!r.hot)},null,2));
