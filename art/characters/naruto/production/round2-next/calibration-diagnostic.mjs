import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadPacked } from '../../../../../tools/scale-audit.mjs';
import { blit,encodePng,newImage,readPng,bbox,resample } from '../../../../../tools/pack-sprites.mjs';
const base='art/characters/naruto/production/round2-next',root=base+'/calibration-fixture',out=base+'/calibration-packed';
const m=JSON.parse(fs.readFileSync('art/manifest.json'));
const c=structuredClone(m.characters.naruto);
c.animations={idle:c.animations.idle,ko:c.animations.ko};delete c.ui;delete c.reference;
// Diagnostic only: correspondence of projected thigh/shin chains permits an approximate
// 1.25-1.35 scale exploration. It is not an anatomy pass or production target.
c.animations.ko.bodyHeight=77;c.animations.ko.version=9;c.scaleGate='warn';
const raw=root+'/characters/naruto/raw';fs.mkdirSync(raw,{recursive:true});fs.mkdirSync(root+'/scale',{recursive:true});
fs.copyFileSync('art/scale/builds.json',root+'/scale/builds.json');
fs.writeFileSync(root+'/manifest.json',JSON.stringify({...m,characters:{naruto:c}},null,2));
for(const f of ['idle_v07.png','idle_v07.json','ko_v09.png'])fs.copyFileSync('art/characters/naruto/raw/'+f,raw+'/'+f);
fs.writeFileSync(raw+'/ko_v09.json',JSON.stringify({frameOffsets:[[40,0]],alignmentNotes:'Diagnostic77px whole-source pose fit only. Initial59px bounds x3..176. With foot-derivedpivot128,77/59 fit predicts leftx=-35.1; +40px measured placement restores x4 margin. No pixels or head-only rescale.'},null,2));
const r=spawnSync(process.execPath,['tools/pack-sprites.mjs','naruto','--quantize','48','--root',root,'--out',out,'--no-writeback'],{encoding:'utf8'});
fs.writeFileSync(base+'/ko77-diagnostic.txt',r.stdout+r.stderr);
const P=loadPacked('naruto',path.resolve(out));
const cells=[readPng('public/art-review/title-style-pilot/naruto-neutral_v01.png'),readPng('public/art-review/title-style-pilot/naruto-combat_v01.png'),P.anims.find(a=>a.name==='idle').cells[0],loadPacked('naruto',path.resolve(base+'/comparison-packed')).anims.find(a=>a.name==='ko').cells[0],P.anims.find(a=>a.name==='ko').cells[0]];
const im=newImage(256*cells.length,256);cells.forEach((p,i)=>blit(im,p,i*256,0));
fs.writeFileSync(base+'/ko77-baseline-native.png',encodePng(im));fs.writeFileSync(base+'/ko77-cell-4x.png',encodePng(resample(cells[4],4)));
fs.writeFileSync(base+'/ko77-metrics.json',JSON.stringify({diagnostic:true,bodyHeight:77,officialBodyHeight:59,frameOffset:[40,0],bounds:bbox(cells[4]),audit:P.meta.scaleAudit.anims.ko},null,2));
console.log(JSON.stringify({bounds:bbox(cells[4]),audit:P.meta.scaleAudit.anims.ko}));
