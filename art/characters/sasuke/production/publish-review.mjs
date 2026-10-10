import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
const batch=process.argv[2]||'heavy-charge';
const heavy=batch==='heavy-charge';
const versions=heavy?{heavy:6,charge:4}:{light2:2,light3:2,special:3};
const approved=heavy?{heavy:2,charge:2}:{light2:1,light3:1,special:2};
const prod='art/characters/sasuke/production';
const out=`public/art-review/sasuke-${batch}`;
fs.mkdirSync(out,{recursive:true});
const sheet=PNG.sync.read(fs.readFileSync('public/characters/sasuke/sheet.png'));
const meta=JSON.parse(fs.readFileSync('public/characters/sasuke/anims.json'));
const qa=heavy?`Identity follows the approved Hebi references. New heavy v06 restores low anticipation, a rising kick and full-size recovery; charge v04 narrows the shout and stabilizes the four-pose loop. Both remain unapproved. Heavy f3 foot is approximately x212–233/y57–88, outside the brief x180–208; f4 foot is x155–179/y10–52, partly above y22–46. Foot-only hitboxes follow the drawn foot, not an invented contact. f7 is similar in scale to idle but is not its exact pose. These remain visual brief deviations after the generation attempt limit, so heavy is not recommended for approval yet. Charge is ready for user visual review; its exact <=1px feet and <=2px head loop tolerance is not certified. Source scale did not honor 2x; explicit traced crown/chin axes calibrate each frame to nominal31px, with hidden-crown uncertainty. No negative vertical frame offsets.`:`Existing approved raster pixels are preserved byte-for-byte in new candidate versions. Per-frame source crown/chin coordinates now accompany the provisional calibration, inferred beneath hair with +/-6 source-pixel uncertainty. light2 upright pose heights change from 194–216 to 199–202px; light3 from188–211 to199–202px; special f0 from211 to193px while its crouched keys remain unchanged. Bounds are only a silhouette cross-check. Compare skull, torso and boot proportions in animation before approving.`;
const common='Strict pack:42 animations,175 frames,48 colors,zero warnings. Approved versions and fixed-name references remain unchanged. Sasuke unchanged idle:202px bounds,200px declared skeleton,SBR0.435,DR0.30,MWR0.51; athletic-teen bands pass. Existing Gojo build flags are unrelated. Browser/build results are recorded separately.';
const metrics={};
for(const [anim,v]of Object.entries(versions)){
 const strip=new PNG({width:meta.animations[anim].frames.length*256,height:256});
 const bounds=[];
 meta.animations[anim].frames.forEach((id,f)=>{
  const x=(id%16)*256,y=Math.floor(id/16)*256;let minX=256,minY=256,maxX=-1,maxY=-1;
  for(let yy=0;yy<256;yy++)for(let xx=0;xx<256;xx++){
   const si=((y+yy)*sheet.width+x+xx)*4,di=(yy*strip.width+f*256+xx)*4;
   sheet.data.copy(strip.data,di,si,si+4);
   if(sheet.data[si+3]){minX=Math.min(minX,xx);minY=Math.min(minY,yy);maxX=Math.max(maxX,xx);maxY=Math.max(maxY,yy);}
  }
  bounds.push({frame:f,bounds:[minX,minY,maxX,maxY],height:maxY-minY+1});
 });
 metrics[anim]=bounds;
 fs.writeFileSync(`${out}/${anim}-contact.png`,PNG.sync.write(strip));
 const name=`${anim}_v${String(v).padStart(2,'0')}`;
 for(const ext of ['png','json'])fs.copyFileSync(`art/characters/sasuke/raw/${name}.${ext}`,`${out}/${name}.${ext}`);
 const before=`${prod}/${anim}-before.png`;
 if(fs.existsSync(before))fs.copyFileSync(before,`${out}/${anim}-before.png`);
}
const lineup=heavy?'lineup-sasuke-heavy_v06':'lineup-sasuke-size-pops';
for(const ext of ['png','json'])fs.copyFileSync(`art/scale/${lineup}.${ext}`,`${out}/lineup.${ext}`);
fs.copyFileSync('public/characters/sasuke/sheet.png',`${out}/sheet.png`);
fs.copyFileSync('public/characters/sasuke/anims.json',`${out}/anims.json`);
fs.writeFileSync(`${prod}/${batch}-current-bounds.json`,JSON.stringify(metrics,null,2)+'\n');
fs.writeFileSync(`${prod}/${batch}-QA.md`,`# Sasuke ${batch} review\n\n${qa}\n\n${common}\n\n[Phone gallery](../../../../public/art-review/sasuke-${batch}/index.html).\n`);
const cards=Object.entries(versions).map(([a,v])=>`<section><h2>${a} v${String(v).padStart(2,'0')} · needs review</h2><canvas width="256" height="256" data-anim="${a}"></canvas><label>Frame <input type="range" min="0" max="${meta.animations[a].frames.length-1}" value="0" data-anim="${a}"><output>0</output></label><button data-anim="${a}">Play</button><p><a href="${a}_v${String(v).padStart(2,'0')}.png">Raw candidate</a> · <a href="${a}_v${String(v).padStart(2,'0')}.json">Measurements</a></p><div class="strip"><img src="${a}-contact.png" alt="All ${a} frames"></div>${fs.existsSync(`${out}/${a}-before.png`)?`<details><summary>Before</summary><img src="${a}-before.png"></details>`:''}</section>`).join('');
fs.writeFileSync(`${out}/index.html`,`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sasuke ${batch} review</title><style>body{max-width:1050px;margin:auto;padding:22px;background:#171b25;color:#edf1ff;font:16px/1.5 system-ui}a{color:#adc9ff}h1{font-size:28px}section{border-top:1px solid #687080;padding:18px 0}canvas{display:block;image-rendering:pixelated;background:#303846;max-width:100%}.strip{overflow:auto}.strip img{max-width:none;height:256px;image-rendering:pixelated}img{max-width:100%;background:#303846}label{display:block}button{padding:8px 20px}p{max-width:90ch}</style><h1>Sasuke ${batch} · unapproved candidates</h1><p>${qa}</p><p>${common}</p><p id="status">Loading packed candidate atlas…</p>${cards}<h2>Cast lineup</h2><a href="lineup.png"><img src="lineup.png" alt="Current packed cast lineup"></a><script>const meta=${JSON.stringify(meta)},sheet=new Image(),states={};sheet.onload=()=>{document.querySelector('#status').textContent='Packed candidate atlas loaded';document.querySelectorAll('canvas').forEach(c=>{const a=c.dataset.anim;states[a]={c,f:0,play:false};draw(a)});};sheet.src='sheet.png';function draw(a){const s=states[a],i=meta.animations[a].frames[s.f],x=s.c.getContext('2d');x.clearRect(0,0,256,256);x.drawImage(sheet,(i%16)*256,Math.floor(i/16)*256,256,256,0,0,256,256);const r=document.querySelector('input[data-anim="'+a+'"]');r.value=s.f;r.nextElementSibling.value=s.f;}document.querySelectorAll('input').forEach(r=>r.oninput=()=>{states[r.dataset.anim].f=+r.value;draw(r.dataset.anim)});document.querySelectorAll('button').forEach(b=>b.onclick=()=>{const s=states[b.dataset.anim];s.play=!s.play;b.textContent=s.play?'Pause':'Play'});setInterval(()=>{Object.keys(states).forEach(a=>{const s=states[a];if(s.play){s.f=(s.f+1)%meta.animations[a].frames.length;draw(a)}})},100);</script>`);
const reviewPath='art/REVIEW.md';let review=fs.readFileSync(reviewPath,'utf8');
const rows=Object.entries(versions).map(([a,v])=>`| 2026-10-10 | sasuke | ${a} | [candidate](characters/sasuke/raw/${a}_v${String(v).padStart(2,'0')}.png) | v${String(v).padStart(2,'0')} | needs review | ${heavy?'Fresh generated correction using approved references':'Versioned anatomy-sidecar correction; unchanged raw pixels'}; approved v${String(approved[a]).padStart(2,'0')} retained. | 48-color strict pack passes. [QA](characters/sasuke/production/${batch}-QA.md); ${heavy?'remaining contact/loop tolerances explicitly flagged':'per-frame crown/chin traces with +/-6px source uncertainty'}. |`);
if(heavy)for(const[a,v,reason]of[['heavy',5,'Anatomy and recovery scale inconsistent'],['heavy',4,'Active kick too steep and scale inconsistent'],['heavy',3,'Pose separation failed'],['charge',3,'Wide shouting mouth and unstable head/feet']])rows.push(`| 2026-10-10 | sasuke | ${a} | [archived](characters/sasuke/raw/_rejected/${a}_v0${v}.png) | v0${v} | rejected | ${reason}; user requested correction. | Source and parts preserved; superseded by latest candidate. |`);
review=review.split('\n').filter(l=>!rows.some(r=>r.split('|').slice(1,6).join('|')===l.split('|').slice(1,6).join('|'))).join('\n');
review=review.replace('|---|---|---|---|---|---|---|---|','|---|---|---|---|---|---|---|---|\n'+rows.join('\n'));
fs.writeFileSync(reviewPath,review);
let tracker=fs.readFileSync('art/TRACKER.md','utf8');const start=tracker.indexOf('## sasuke'),end=tracker.indexOf('\n## ',start+4);const section=tracker.slice(start,end<0?undefined:end);let changed=section;
for(const[a,v]of Object.entries(versions))changed=changed.split('\n').map(l=>{if(!l.match(new RegExp('^\\| \\d+ \\| '+a+' \\|')))return l;const p=l.split('|');p[8]=` v${String(v).padStart(2,'0')} `;p[10]=` Latest candidate needs review; approved v${String(approved[a]).padStart(2,'0')} retained. See production/${batch}-QA.md. `;return p.join('|');}).join('\n');
if(start<0)throw Error('Sasuke tracker section not found');fs.writeFileSync('art/TRACKER.md',tracker.slice(0,start)+changed+(end<0?'':tracker.slice(end)));
let tasks=fs.readFileSync('docs/TASKS.md','utf8');tasks=tasks.replace(/(\| ART-SAS-(?:REDRAW|SIZE)-20261010[^\n]*?)\| in-progress \|/g,'$1| review |');fs.writeFileSync('docs/TASKS.md',tasks);
const change='CHANGELOG.md';fs.writeFileSync(change,fs.readFileSync(change,'utf8').replace('## [Unreleased]',`## [Unreleased]\n\n- Sasuke ${batch}: versioned unapproved candidates, strict packing, source landmarks, cast lineup and a portable phone review gallery; approval versions unchanged.`));
console.log(JSON.stringify({out,metrics}));

