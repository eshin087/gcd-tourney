const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PNG } = require('pngjs');
const base = 'art/characters/luffy';
const prod = path.join(base, 'production');
const local = path.join(prod, 'astra-audit-r2');
const publicDir = 'public/characters/luffy/calibration-r2';
const sourceOut = path.join(prod, 'astra-fixture-output/characters/luffy');
const atlasPath = path.join(sourceOut, 'sheet.png');
const metaPath = path.join(sourceOut, 'anims.json');
const refs = [
  ['neutral', path.join(prod, 'native-audit-20261015/neutral.png')],
  ['combat', path.join(prod, 'native-audit-20261015/combat.png')],
  ['approved-idle-f0', path.join(prod, 'native-audit-20261015/idle-f0.png')],
];
const inventory = [
  ['idle','v01'],['run','v01'],['dash','v02'],['jumpUp','v01'],['jumpFall','v03'],['land','v01'],
  ['light1','v02'],['light2','v01'],['light3','v02'],['light4','v02'],['heavy','v01'],['airLight1','v01'],
  ['airHeavy','v01'],['guard','v01'],['hurtHigh','v01'],['launched','v01'],['down','v01'],['getup','v01'],
  ['charge','v01'],['beamCharge','v01'],['beamFire','v02'],['special','v01'],['win','v03'],
];
const selected = Object.fromEntries(inventory.map(([a,v]) => [a,v]));
const holdNames = new Set(['run','jumpUp','land','light3','light4','heavy','airLight1','airHeavy','guard','launched','down','getup','charge','beamCharge','beamFire','special']);
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const ensureFreshDir = p => { if(fs.existsSync(p)) throw new Error(`Refusing to overwrite existing ${p}`); fs.mkdirSync(p,{recursive:true}); };
const writeFresh = (p,b) => { if(fs.existsSync(p)) throw new Error(`Refusing to overwrite existing ${p}`); fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,b); };
const copyFresh = (a,b) => writeFresh(b,fs.readFileSync(a));
const readPng = p => PNG.sync.read(fs.readFileSync(p));
const writePng = (p,img) => writeFresh(p,PNG.sync.write(img));
const blit = (src,dst,dx,dy,sx=0,sy=0,w=256,h=256) => {
  for(let y=0;y<h;y++) src.data.copy(dst.data,((dy+y)*dst.width+dx)*4,((sy+y)*src.width+sx)*4,((sy+y)*src.width+sx+w)*4);
};
const scale2 = src => { const out=new PNG({width:src.width*2,height:src.height*2}); for(let y=0;y<src.height;y++) for(let x=0;x<src.width;x++){const si=(y*src.width+x)*4;for(let yy=0;yy<2;yy++)for(let xx=0;xx<2;xx++)out.data.set(src.data.subarray(si,si+4),((y*2+yy)*out.width+x*2+xx)*4);} return out; };
ensureFreshDir(local); ensureFreshDir(publicDir);
const atlas=readPng(atlasPath), meta=JSON.parse(fs.readFileSync(metaPath,'utf8'));
const anchorImgs=refs.map(([n,p])=>({name:n,path:p,image:readPng(p),sha256:sha(p)}));
for(const a of anchorImgs) if(a.image.width!==256||a.image.height!==256) throw new Error(`Reference not native 256 cell: ${a.path}`);
const outputInventory=[];
for(const [anim,version] of inventory){
  const d=meta.animations[anim]; if(!d) throw new Error(`Packed metadata missing ${anim}`);
  const n=d.frames.length, rows=1+Math.ceil(n/4), contact=new PNG({width:1024,height:rows*256});
  // Reference cells at identical 256px density in first row.
  for(let i=0;i<anchorImgs.length;i++) blit(anchorImgs[i].image,contact,i*256,0);
  const frames=[];
  d.frames.forEach((idx,i)=>{
    const sx=(idx%meta.columns)*meta.frameWidth, sy=Math.floor(idx/meta.columns)*meta.frameHeight;
    const cell={width:256,height:256,data:Buffer.alloc(256*256*4)};
    for(let y=0;y<256;y++) atlas.data.copy(cell.data,y*256*4,((sy+y)*atlas.width+sx)*4,((sy+y)*atlas.width+sx+256)*4);
    const px=new PNG({width:256,height:256});px.data=cell.data;
    const col=i%4,row=1+Math.floor(i/4);blit(px,contact,col*256,row*256);
    frames.push({frame:i,atlasIndex:idx,atlasXY:[sx,sy],durationMs:d.durations[i]});
  });
  const nativePath=path.join(local,`contact-${anim}.png`), largePath=path.join(local,`contact-${anim}-2x.png`);
  writePng(nativePath,contact);writePng(largePath,scale2(contact));
  copyFresh(nativePath,path.join(publicDir,path.basename(nativePath)));
  copyFresh(largePath,path.join(publicDir,path.basename(largePath)));
  const sourceDir=holdNames.has(anim)?path.join(base,'raw/_qa_hold'):path.join(base,'raw');
  const sourcePath=path.join(sourceDir,`${anim}_${version}.png`);
  outputInventory.push({animation:anim,version,sourcePath,sourceSha256:sha(sourcePath),status:anim==='idle'?'approved reference; included only as comparison':'candidate, not approved',sourceWasHeld:holdNames.has(anim),frames,loop:d.loop,durationsMs:d.durations,contactNative:path.relative(prod,nativePath).replaceAll('\\','/'),contact2x:path.relative(prod,largePath).replaceAll('\\','/'),contactNativeSha256:sha(nativePath),contact2xSha256:sha(largePath)});
}
const atlasName='atlas-luffy-calibration-r2.png',metaName='animations-luffy-calibration-r2.json';
copyFresh(atlasPath,path.join(local,atlasName));copyFresh(metaPath,path.join(local,metaName));
copyFresh(atlasPath,path.join(publicDir,atlasName));copyFresh(metaPath,path.join(publicDir,metaName));
const referenceInventory=anchorImgs.map(a=>({name:a.name,source:a.path,sha256:a.sha256}));
const report={title:'Luffy calibration round 2 - diagnostic atlas evidence',status:'For Astra manual audit; no candidate approval or scaleManualQA recorded.',pack:{command:'node tools/pack-sprites.mjs --root art/characters/luffy/production/astra-fixture-input --out art/characters/luffy/production/astra-fixture-output --quantize 48 --no-writeback luffy',mode:'warn-only diagnostic fixture: fixture-local manifest sets Luffy scaleGate=warn solely to render exact quantized cells after the unmodified branch-manifest auto gate refused output; no exemption or calibration was added to branch files.',strictAttempt:'See strict-pack-after-claude-calibration.log: branch manifest and sources, quantize 48, no-writeback; failed on light1 head probe and wrote no atlas.',packedAnimations:23,packedFrames:108,colors:48,completeFlag:'true in diagnostic metadata only; not production readiness.',atlas:{path:'art/characters/luffy/production/astra-fixture-output/characters/luffy/sheet.png',sha256:sha(atlasPath)},metadata:{path:'art/characters/luffy/production/astra-fixture-output/characters/luffy/anims.json',sha256:sha(metaPath)}},references:referenceInventory,selected:outputInventory,additionalHoldNotes:['run v01: user accepted rear-foot edge clipping f3/f4/f7 for placement only; anatomy is still open.','light4 v02: user accepted foot f4 edge clip for placement only; remaining hold/anatomy uncertainty stands.','beamFire v02: user accepted only the stretched arm edge clip for the move; body/art remains held.','special v01: source split cuts/touches a pose; packed only to inspect exact selected cells, not cleared.','All other candidates remain unapproved; packer warnings are retained in the fixture log.'],files:{atlas:atlasName,metadata:metaName,contactCount:inventory.length,contactLayout:'Each 256px-cell contact has exact approved neutral/combat/idle-f0 references in row 0; atlas-extracted candidate frames follow in rows of at most four. 2x views use nearest-neighbor only.'}};
writeFresh(path.join(local,'inventory.json'),JSON.stringify(report,null,2)+'\n');
copyFresh(path.join(local,'inventory.json'),path.join(publicDir,'inventory.json'));
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Luffy calibration r2 — audit only</title><style>body{font:16px system-ui;background:#17191d;color:#eee;margin:2rem}h1{margin:0}small,.muted{color:#b9c1ca}.warning{border:1px solid #e3ad59;padding:1rem;margin:1rem 0;background:#30291e}.controls{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}button,select{font:inherit;padding:.45rem .7rem}canvas{background:#292d34;image-rendering:pixelated;width:512px;height:512px;max-width:100%;border:1px solid #727984}.contact{max-width:100%;image-rendering:pixelated;border:1px solid #59616b}table{border-collapse:collapse}td,th{border:1px solid #555;padding:.4rem;text-align:left}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.2rem}.item{overflow:auto;background:#202329;padding:.8rem}code{font-size:.85em}</style><h1>Luffy calibration r2</h1><p class="muted">Isolated, quantized review evidence. Not the gameplay atlas. Nothing here marks art approved or records a scaleManualQA pass.</p><div class="warning"><b>Diagnostic holds remain.</b> The source branch's normal auto scale gate was run first and wrote no atlas (light1 probe hold). A separate fixture-only warn-mode render is supplied for Astra's manual landmark audit. See <a href="inventory.json">inventory and hashes</a>. Approved edge clips are limited to the specific placements recorded in the review notes.</div><h2>Timed atlas viewer</h2><p>Current selection plays the exact quantized atlas cells with manifest frame durations and loop behavior. Use Replay, Pause, Previous/Next or enable Loop override.</p><div class="controls"><select id="anim"></select><button id="play">Pause</button><button id="replay">Replay</button><button id="prev">Previous</button><button id="next">Next</button><label><input type="checkbox" id="loop"> Loop override</label></div><p id="state"></p><canvas id="view" width="256" height="256"></canvas><h2>One-density frame contacts</h2><p>Each contact begins with approved neutral, combat and idle f0 at 256 px per cell. Candidate cells are extracted from this exact quantized atlas. Open a native-size or nearest-neighbor 2x contact.</p><div class="grid" id="contacts"></div><p class="muted">Atlas SHA-256: <code>${sha(atlasPath)}</code><br>Animation metadata SHA-256: <code>${sha(metaPath)}</code><br>Palette: 48 colors. Candidates remain unapproved.</p><script>
const META=${JSON.stringify(meta)};const INV=${JSON.stringify(outputInventory)};const image=new Image();image.src='${atlasName}';const sel=document.getElementById('anim'),canvas=document.getElementById('view'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;let current='win',i=0,playing=true,timer=null,loopOverride=false;for(const n of Object.keys(META.animations)){const o=document.createElement('option');o.value=n;o.textContent=n+' — '+(INV.find(x=>x.animation===n)?.version||'');sel.append(o);}function draw(){const a=META.animations[current],idx=a.frames[i];ctx.clearRect(0,0,256,256);ctx.drawImage(image,(idx%META.columns)*256,Math.floor(idx/META.columns)*256,256,256,0,0,256,256);document.getElementById('state').textContent=current+' frame '+(i+1)+'/'+a.frames.length+' · '+a.durations[i]+' ms · '+(a.loop||loopOverride?'loops':'plays once');}function schedule(){clearTimeout(timer);if(!playing)return;const a=META.animations[current];timer=setTimeout(()=>{if(i+1<a.frames.length)i++;else if(a.loop||loopOverride)i=0;else{playing=false;document.getElementById('play').textContent='Play';return;}draw();schedule();},a.durations[i]);}function restart(){i=0;playing=true;draw();document.getElementById('play').textContent='Pause';schedule();}image.onload=()=>{sel.value=current;draw();schedule();};sel.onchange=()=>{current=sel.value;restart();};document.getElementById('play').onclick=()=>{playing=!playing;document.getElementById('play').textContent=playing?'Pause':'Play';if(playing)schedule();else clearTimeout(timer);};document.getElementById('replay').onclick=restart;document.getElementById('prev').onclick=()=>{i=(i+META.animations[current].frames.length-1)%META.animations[current].frames.length;draw();if(playing)schedule();};document.getElementById('next').onclick=()=>{i=(i+1)%META.animations[current].frames.length;draw();if(playing)schedule();};document.getElementById('loop').onchange=e=>{loopOverride=e.target.checked;draw();};const cards=document.getElementById('contacts');for(const x of INV){const d=document.createElement('section');d.className='item';const h=document.createElement('h3');h.textContent=x.animation+' '+x.version+(x.animation==='idle'?' (approved reference)':' (candidate; not approved)');d.append(h);const p=document.createElement('p');p.textContent=x.sourceWasHeld?'Selected from prior _qa_hold source; diagnostic inclusion only.':'Selected from raw source.';d.append(p);const a=document.createElement('a');a.href='contact-'+x.animation+'.png';a.textContent='native 256px contact';d.append(a);d.append(document.createTextNode(' · '));const b=document.createElement('a');b.href='contact-'+x.animation+'-2x.png';b.textContent='nearest-neighbor 2x';d.append(b);const im=document.createElement('img');im.className='contact';im.src=a.href;im.alt=x.animation+' contact, references then exact quantized frames';d.append(im);cards.append(d);}</script></html>`;
writeFresh(path.join(publicDir,'index.html'),Buffer.from(html));
console.log(JSON.stringify({local,publicDir,atlasSHA256:sha(atlasPath),metadataSHA256:sha(metaPath),animations:outputInventory.map(x=>`${x.animation}_${x.version}`),contacts:outputInventory.length},null,2));
