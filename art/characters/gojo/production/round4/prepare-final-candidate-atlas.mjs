import fs from 'node:fs';
import path from 'node:path';
const base='art/characters/gojo/production/round4';
const art=path.join(base,'final-candidate-art');
const out=path.join(base,'final-candidate-public');
const versions={idle:6,guard:4,jumpUp:4,jumpFall:6,airRecover:5,throw:5,airLight1:7,airLight2:5,airLight3:12,light3:5,hurtLow:4};
const sourceManifest=JSON.parse(fs.readFileSync('art/manifest.json','utf8'));
const gojo=structuredClone(sourceManifest.characters.gojo);
gojo.scaleGate='warn';
gojo.animations=Object.fromEntries(Object.entries(versions).map(([name,version])=>{const x=structuredClone(sourceManifest.characters.gojo.animations[name]);x.version=version;x.approvedVersion=name==='idle'?6:sourceManifest.characters.gojo.animations[name].approvedVersion;return [name,x]}));
fs.mkdirSync(path.join(art,'characters/gojo/raw'),{recursive:true});
fs.writeFileSync(path.join(art,'manifest.json'),JSON.stringify({...sourceManifest,characters:{gojo}},null,2)+'\n');
for(const [name,version] of Object.entries(versions))for(const ext of ['png','json']){const src=`art/characters/gojo/raw/${name}_v${String(version).padStart(2,'0')}.${ext}`;if(fs.existsSync(src))fs.copyFileSync(src,path.join(art,'characters/gojo/raw',path.basename(src)));}
fs.mkdirSync(out,{recursive:true});
console.log(JSON.stringify({art,out,versions,scaleGate:gojo.scaleGate},null,2));
