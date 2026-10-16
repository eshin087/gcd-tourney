import fs from 'node:fs';
import {PNG} from 'pngjs';
const root='art/characters/gojo/production/round4';
const atlas=PNG.sync.read(fs.readFileSync('public/characters/gojo/sheet.png'));
const meta=JSON.parse(fs.readFileSync('public/characters/gojo/anims.json'));
const selected=['idle','guard','superDash','jumpUp','jumpFall','airRecover','throw','airLight1','airLight2','airLight3','light3','hurtLow'];
for(const name of selected){const ids=meta.animations[name].frames; const out=new PNG({width:(ids.length+1)*256,height:256}); const combat=PNG.sync.read(fs.readFileSync('public/art-review/title-style-pilot/gojo-combat_v01.png')); PNG.bitblt(combat,out,0,0,256,256,0,0); ids.forEach((id,i)=>PNG.bitblt(atlas,out,id%16*256,Math.floor(id/16)*256,256,256,(i+1)*256,0)); fs.writeFileSync(root+'/'+name+'-baseline-native.png',PNG.sync.write(out)); }
const out=new PNG({width:512,height:256}); PNG.bitblt(atlas,out,0,0,256,256,0,0); const combat=PNG.sync.read(fs.readFileSync('public/art-review/title-style-pilot/gojo-combat_v01.png')); PNG.bitblt(combat,out,0,0,256,256,256,0);fs.writeFileSync(root+'/idle-combat-baseline.png',PNG.sync.write(out));
