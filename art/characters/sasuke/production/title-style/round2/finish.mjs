import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {PNG} from 'pngjs';
import {loadPacked} from '../../../../../../tools/scale-audit.mjs';
const dir=path.resolve('art/characters/sasuke/production/title-style/round2');
const jobs=JSON.parse(fs.readFileSync(path.join(dir,'jobs.json')));
const pass=new Set(['heavy','backDash','charge','throw','block','stagger','specialUp']);
const original=JSON.parse(fs.readFileSync('art/manifest.json'));
const review=path.resolve('public/reviews/sasuke-round2');
function run(args,name){const r=spawnSync(process.execPath,args,{encoding:'utf8'});fs.writeFileSync(path.join(dir,'reports',name),`exit ${r.status}\nnode ${args.join(' ')}\n${r.stdout}${r.stderr}`);console.log(name,r.status);return r;}
for(const mode of ['strict','diagnostic']) {
  const root=path.join(dir,'combined-fixtures',mode), out=path.join(review,mode);
  const m=structuredClone(original);m.characters={sasuke:structuredClone(original.characters.sasuke)};
  delete m.characters.sasuke.ui;delete m.characters.sasuke.reference;
  const selected=jobs.jobs.filter(j=>mode==='diagnostic'||pass.has(j.asset));
  m.characters.sasuke.animations=Object.fromEntries(['idle',...selected.map(j=>j.asset)].map(a=>[a,structuredClone(original.characters.sasuke.animations[a])]));
  const raw=path.join(root,'characters/sasuke/raw');fs.mkdirSync(raw,{recursive:true});fs.mkdirSync(path.join(root,'scale'),{recursive:true});
  for(const j of [{asset:'idle',version:7},...selected]) {
    const v=`v${String(j.version).padStart(2,'0')}`;
    if(j.bodyHeight)m.characters.sasuke.animations[j.asset].bodyHeight=j.bodyHeight;
    m.characters.sasuke.animations[j.asset].version=j.version;
    if(mode==='diagnostic'&&!pass.has(j.asset))m.characters.sasuke.animations[j.asset].approvedVersion=j.version;
    for(const ext of ['png','json']){const source=`art/characters/sasuke/raw/${j.asset}_${v}.${ext}`;if(fs.existsSync(source))fs.copyFileSync(source,path.join(raw,`${j.asset}_${v}.${ext}`));}
  }
  if(mode==='diagnostic')m.spec.scaleGate={...m.spec.scaleGate,mode:'warn'};
  fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(m,null,2));fs.copyFileSync('art/scale/builds.json',path.join(root,'scale/builds.json'));
  run(['tools/pack-sprites.mjs','sasuke','--quantize','48',...(mode==='strict'?['--strict-scale']:[]),'--root',root,'--out',out,'--no-writeback'],`combined-${mode}.txt`);
  run(['tools/scale-audit.mjs','sasuke','--root',root,'--public',out,'--out',path.join(review,mode,'scale')],`scale-${mode}.txt`);
  const p=loadPacked('sasuke',out);
  const metrics={mode,ref:p.meta.scaleAudit.ref,anims:{}};
  for(const a of p.anims) {
    const version=p.meta.scaleAudit.anims[a.name]?.v;
    if(a.name!=='idle'&&version!==selected.find(j=>j.asset===a.name)?.version)throw Error('Stale candidate atlas');
    const contact=new PNG({width:256*(a.cells.length+1),height:256});
    const idle=p.anims.find(a=>a.name==='idle').cells[0];
    for(const [i,c] of [idle,...a.cells].entries())for(let y=0;y<256;y++)contact.data.set(c.data.subarray(y*1024,(y+1)*1024),y*contact.width*4+i*1024);
    fs.writeFileSync(path.join(out,`${a.name}-native.png`),PNG.sync.write(contact));
    const bbox=c=>{let x0=256,y0=256,x1=-1,y1=-1;for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(c.data[(y*256+x)*4+3]>0){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}return{x0,y0,x1,y1,w:x1-x0+1,h:y1-y0+1,inside:x0>=4&&x1<=251&&y0>=4&&y1<=240};};
    metrics.anims[a.name]={version,audit:p.meta.scaleAudit.anims[a.name],frames:a.cells.map(bbox)};
    if(a.name==='heavy')for(const f of [3,4]) {const c=a.cells[f],z=4,img=new PNG({width:256*z,height:256*z});for(let y=0;y<img.height;y++)for(let x=0;x<img.width;x++){const q=(Math.floor(y/z)*256+Math.floor(x/z))*4,k=(y*img.width+x)*4;img.data.set(c.data.subarray(q,q+4),k);}fs.writeFileSync(path.join(dir,`heavy-f${f}-4x.png`),PNG.sync.write(img));}
  }
  fs.writeFileSync(path.join(dir,'reports',`metrics-${mode}.json`),JSON.stringify(metrics,null,2));
}
fs.copyFileSync('art/characters/sasuke/production/title-style/sasuke-combat_v01.png',path.join(review,'approved-combat.png'));
fs.copyFileSync('art/characters/sasuke/production/title-style/sasuke-neutral_v01.png',path.join(review,'approved-neutral.png'));
console.log('Candidate review packs ready; isolated diagnostic approval values are not production approvals.');
