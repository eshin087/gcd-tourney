import fs from 'node:fs';
import {loadPacked} from '../../../../../../tools/scale-audit.mjs';
import {bbox,newImage,blit,encodePng} from '../../../../../../tools/pack-sprites.mjs';
const dir='art/characters/gojo/production/title-style/round2';
const P=loadPacked('gojo','public');
const cells=Object.fromEntries(P.anims.map(a=>[a.name,a.cells]));
const rows=['run','airHeavy','special','airLight3'];
const result={source:'public/characters/gojo/sheet.png, actual full strict quantized atlas',audit:P.meta.scaleAudit,animations:{}};
for(const a of rows){const contact=newImage(2048,512);for(let i=0;i<8;i++)blit(contact,cells.idle[i],i*256,0);for(let i=0;i<cells[a].length;i++)blit(contact,cells[a][i],i*256,256);fs.writeFileSync(`${dir}/${a}-full-native.png`,encodePng(contact));result.animations[a]=cells[a].map((c,i)=>({frame:i,bbox:bbox(c)}));}
fs.writeFileSync(`${dir}/full-metrics.json`,JSON.stringify(result,null,2));
fs.mkdirSync('public/reviews/gojo-round2/characters/gojo',{recursive:true});
for(const file of ['sheet.png','anims.json'])fs.copyFileSync(`public/characters/gojo/${file}`,`public/reviews/gojo-round2/characters/gojo/${file}`);
for(const a of rows)fs.copyFileSync(`${dir}/${a}-full-native.png`,`public/reviews/gojo-round2/${a}-native.png`);
fs.copyFileSync('public/art-review/title-style-pilot/gojo-neutral_v01.png','public/reviews/gojo-round2/neutral.png');
