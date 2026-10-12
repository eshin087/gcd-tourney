import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadPacked } from '../../../../../tools/scale-audit.mjs';
import { bbox,blit,encodePng,newImage,readPng,resample } from '../../../../../tools/pack-sprites.mjs';
const base='art/characters/naruto/production/round2-next';
const m=JSON.parse(fs.readFileSync('art/manifest.json'));
const c=structuredClone(m.characters.naruto);
c.animations={idle:c.animations.idle,down:c.animations.down,ko:c.animations.ko};
delete c.ui;delete c.reference;c.scaleGate='warn';
const root=base+'/comparison-fixture',raw=root+'/characters/naruto/raw',out=base+'/comparison-packed';
fs.mkdirSync(raw,{recursive:true});fs.mkdirSync(root+'/scale',{recursive:true});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({...m,characters:{naruto:c}},null,2));
fs.copyFileSync('art/scale/builds.json',root+'/scale/builds.json');
for(const stem of ['idle_v07','down_v05','ko_v09'])for(const suffix of ['png','json']){
 const src='art/characters/naruto/raw/'+stem+'.'+suffix;
 if(fs.existsSync(src))fs.copyFileSync(src,raw+'/'+stem+'.'+suffix);
}
const r=spawnSync(process.execPath,['tools/pack-sprites.mjs','naruto','--quantize','48','--root',root,'--out',out,'--no-writeback'],{encoding:'utf8'});
fs.writeFileSync(base+'/comparison-diagnostic.txt',r.stdout+r.stderr);
const P=loadPacked('naruto',path.resolve(out));
const cells=[
 readPng('public/art-review/title-style-pilot/naruto-neutral_v01.png'),
 readPng('public/art-review/title-style-pilot/naruto-combat_v01.png'),
 P.anims.find(a=>a.name==='idle').cells[0],
 P.anims.find(a=>a.name==='down').cells[1],
 P.anims.find(a=>a.name==='ko').cells[0]
];
const composite=newImage(256*cells.length,256);cells.forEach((p,i)=>blit(composite,p,i*256,0));
fs.writeFileSync(base+'/ko-baseline-native.png',encodePng(composite));
fs.writeFileSync(base+'/ko-baseline-4x.png',encodePng(resample(composite,4)));
fs.writeFileSync(base+'/ko-cell-4x.png',encodePng(resample(cells[4],4)));
const kick=loadPacked('naruto',path.resolve(base+'/packed-airLight3')).anims.find(a=>a.name==='airLight3').cells;
const kickComposite=newImage(256*(3+kick.length),256);[...cells.slice(0,3),...kick].forEach((p,i)=>blit(kickComposite,p,i*256,0));
fs.writeFileSync(base+'/airLight3-baseline-native.png',encodePng(kickComposite));
console.log(JSON.stringify({ order:['approved neutral','approved combat','idle07 f0','down05 f1','ko09'],bounds:cells.map(p=>bbox(p)) }));
