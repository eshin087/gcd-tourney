import fs from 'node:fs';
import crypto from 'node:crypto';
const root='art/characters/luffy';const dir=`${root}/production/relay8-generation`;const fx=`${dir}/diagnostic-atlas-v03`;const H=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [anim,size] of [['down',[512,256]],['getup',[1280,256]]]){const p=`${root}/raw/${anim}_v03.json`;const j=JSON.parse(fs.readFileSync(p,'utf8'));j.sourceSize=size;j.sourceInputSize=anim==='down'?[1536,1024]:[2172,724];fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');}
const m=JSON.parse(fs.readFileSync(`${fx}/anims.json`,'utf8'));for(const anim of ['down','getup']){const p=`${root}/raw/${anim}_v03.json`;m.source[anim].sidecarSha256=H(fs.readFileSync(p));}fs.writeFileSync(`${fx}/anims.json`,JSON.stringify(m,null,2)+'\n');
const idx=JSON.parse(fs.readFileSync(`${fx}/contacts-index.json`,'utf8'));idx.atlas.sha256=m.atlas.sha256;idx.metadataSha256=H(fs.readFileSync(`${fx}/anims.json`));fs.writeFileSync(`${fx}/contacts-index.json`,JSON.stringify(idx,null,2)+'\n');
console.log(JSON.stringify({down:JSON.parse(fs.readFileSync(`${root}/raw/down_v03.json`)),getup:JSON.parse(fs.readFileSync(`${root}/raw/getup_v03.json`)),fixtureAtlas:m.atlas,metadataSha256:H(fs.readFileSync(`${fx}/anims.json`)),contactsSha256:H(fs.readFileSync(`${fx}/contacts-index.json`))},null,2));
