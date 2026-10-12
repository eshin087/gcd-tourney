import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const base='art/characters/killua/production/title-style',root=base+'/qa-reference-art';
const raw=path.resolve(root,'characters/killua/raw');
if(!raw.startsWith(path.resolve(base)+path.sep))throw Error('Unsafe fixture');
for(const f of fs.readdirSync(raw).filter(f=>/^idle_v\d+\.(png|json)$/.test(f)))fs.unlinkSync(path.join(raw,f));
fs.copyFileSync('art/characters/killua/raw/idle_v05.png',raw+'/idle_v05.png');
const m=JSON.parse(fs.readFileSync(root+'/manifest.json')),real=JSON.parse(fs.readFileSync('art/manifest.json'));
m.animationDefaults.idle.frames=8;m.characters.killua.animations.idle={...real.characters.killua.animations.idle,version:5,approvedVersion:null};m.characters.killua.scaleGate='warn';
fs.writeFileSync(root+'/manifest.json',JSON.stringify(m,null,2));
const builds=JSON.parse(fs.readFileSync('art/scale/builds.json'));
const results={};
for(const kind of ['auto','declared']){
const b=structuredClone(builds);if(kind==='declared')b.fighters.killua.headColors=['#f0eff6','#cdc8e8','#bdb8d7','#b2acd3'];
fs.writeFileSync(root+'/scale/builds.json',JSON.stringify(b,null,2));
const out='public/preview/killua-probe-'+kind;
const r=spawnSync(process.execPath,['tools/pack-sprites.mjs','killua','--quantize','48','--no-writeback','--root',root,'--out',out],{encoding:'utf8'});
fs.writeFileSync(base+'/probe-'+kind+'-pack.txt',r.stdout+r.stderr);if(r.status)throw Error('pack '+kind+' failed');
const meta=JSON.parse(fs.readFileSync(out+'/characters/killua/anims.json'));results[kind]=meta.scaleAudit;
}
fs.writeFileSync(base+'/probe-color-experiment.json',JSON.stringify(results,null,2));
console.log(Object.fromEntries(Object.entries(results).map(([k,a])=>[k,{ref:a.ref,anims:Object.fromEntries(Object.entries(a.anims).map(([n,v])=>[n,{head:v.head,verdict:v.verdict}]))}])));
