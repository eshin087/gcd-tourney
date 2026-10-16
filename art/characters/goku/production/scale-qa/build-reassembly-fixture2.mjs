import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {PNG} from 'pngjs';
const base=path.join(process.cwd(),'art/characters/goku/production/scale-qa/reassembly-r02'), old=path.join(base,'fixture-art'), next=path.join(base,'fixture2-art'), out=path.join(base,'fixture2-public');
if(fs.existsSync(next)||fs.existsSync(out))throw Error('fixture2 exists; refusing overwrite');
fs.cpSync(old,next,{recursive:true});fs.mkdirSync(out,{recursive:true});
const m=JSON.parse(fs.readFileSync(path.join(next,'manifest.json'),'utf8')),g=m.characters.goku;
g.scaleGate='warn';
const picks=[
 {anim:'jumpFall',v:4,raw:'jumpFall_v04.png',src:'art/characters/goku/raw/_qa_hold/jumpFall_v04.png'},
 {anim:'jumpUp',v:4,raw:'jumpUp_v04.png',src:'art/characters/goku/raw/_qa_hold/jumpUp_v04.png'},
 {anim:'airLight1',v:5,raw:'airLight1_v05.png',src:'art/characters/goku/raw/_qa_hold/airLight1_v05.png'}
];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'), mag=(d,i)=>d[i]>160&&d[i+1]<100&&d[i+2]>160;
const details=[];
for(const p of picks){const src=PNG.sync.read(fs.readFileSync(p.src));if(src.width%256)throw Error(`${p.anim}: source width not cell multiple`);const dir=path.join(next,'characters/goku/raw');fs.mkdirSync(dir,{recursive:true});const dst=path.join(dir,p.raw);fs.copyFileSync(p.src,dst);const image=PNG.sync.read(fs.readFileSync(dst));let maxH=0,frames=[];for(let f=0;f<image.width/256;f++){let top=256,bottom=-1,left=256,right=-1;for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=(y*image.width+f*256+x)*4;if(image.data[i+3]<128||mag(image.data,i))continue;top=Math.min(top,y);bottom=Math.max(bottom,y);left=Math.min(left,x);right=Math.max(right,x)}const h=bottom>=top?bottom-top+1:0;maxH=Math.max(maxH,h);frames.push({frame:f,bounds:bottom>=top?[left,top,right,bottom]:null,bodyHeight:h})}g.animations[p.anim].bodyHeight=maxH;g.animations[p.anim].version=p.v;details.push({animation:p.anim,version:p.v,sourceCandidatePath:p.src,sourceCandidateSha256:hash(fs.readFileSync(p.src)),fixtureFile:`characters/goku/raw/${p.raw}`,fixtureSha256:hash(fs.readFileSync(dst)),bodyHeight:maxH,pivot:[128,240],frames});}
fs.writeFileSync(path.join(next,'manifest.json'),JSON.stringify(m,null,2)+'\n');
fs.writeFileSync(path.join(base,'fixture2-inventory.json'),JSON.stringify({label:'Fixture 2: exact quantized candidate atlas, warn-only; no approval fields changed, not a scale pass.',fixtureScaleGate:'warn',inheritedFixture1:'fixture-art source copied before adding corrected candidate versions; jumpFall v04 supersedes disputed v03 only in this fixture',candidates:details},null,2)+'\n');
console.log(JSON.stringify(details.map(x=>({animation:x.animation,version:x.version,bodyHeight:x.bodyHeight,sha:x.fixtureSha256})),null,2));
