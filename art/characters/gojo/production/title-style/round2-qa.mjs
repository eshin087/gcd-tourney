import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {loadPacked} from '../../../../../tools/scale-audit.mjs';
import {bbox,newImage,blit,encodePng} from '../../../../../tools/pack-sprites.mjs';
const [anim,ver]=process.argv.slice(2); const d=`art/characters/gojo/production/title-style/round2/${anim}-v${ver}`; fs.mkdirSync(d,{recursive:true});
const fixture=`${d}/fixture`;fs.mkdirSync(`${fixture}/characters/gojo/raw`,{recursive:true});
const m=JSON.parse(fs.readFileSync('art/manifest.json'));const c=structuredClone(m.characters.gojo);c.animations={idle:c.animations.idle,[anim]:c.animations[anim]};c.animations[anim].version=Number(ver);delete c.ui;delete c.reference;m.characters={gojo:c};fs.writeFileSync(`${fixture}/manifest.json`,JSON.stringify(m,null,2));
for(const a of [['idle','06'],[anim,ver]])for(const ext of ['png','json'])fs.copyFileSync(`art/characters/gojo/raw/${a[0]}_v${a[1]}.${ext}`,`${fixture}/characters/gojo/raw/${a[0]}_v${a[1]}.${ext}`);
fs.mkdirSync(`${fixture}/scale`,{recursive:true});fs.copyFileSync('art/scale/builds.json',`${fixture}/scale/builds.json`);
const out=`public/reviews/gojo-round2/${anim}-v${ver}`;const r=spawnSync(process.execPath,['tools/pack-sprites.mjs','gojo','--quantize','48','--strict-scale','--root',fixture,'--out',out,'--no-writeback'],{encoding:'utf8'});fs.writeFileSync(`${d}/strict-pack.txt`,r.stdout+r.stderr);console.log(r.stdout+r.stderr);if(r.status)process.exit(r.status);
const s=spawnSync(process.execPath,['tools/scale-audit.mjs','gojo','--root',fixture,'--public',out,'--out',`${d}/scale`],{encoding:'utf8'});console.log(s.stdout+s.stderr);
const p=loadPacked('gojo',out);p.cells=Object.fromEntries(p.anims.map(a=>[a.name,a.cells]));const contact=newImage(2048,512);const metrics={audit:p.meta.scaleAudit,frames:[]};for(let i=0;i<8;i++)blit(contact,p.cells.idle[i],i*256,0);for(const [i,cell]of p.cells[anim].entries()){blit(contact,cell,i*256,256);metrics.frames.push({frame:i,box:bbox(cell)});}fs.writeFileSync(`${d}/native.png`,encodePng(contact));fs.writeFileSync(`${d}/metrics.json`,JSON.stringify(metrics,null,2));fs.writeFileSync(`${d}/candidate-f0.png`,encodePng(p.cells[anim][0]));

