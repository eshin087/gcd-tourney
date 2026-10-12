import fs from 'node:fs';
import {PNG} from 'pngjs';
import {loadPacked} from '../../../../../../tools/scale-audit.mjs';
const dir='art/characters/sasuke/production/title-style/round2';
const before=loadPacked('sasuke',`${dir}/packs/specialUp/diagnostic`);
const after=loadPacked('sasuke',`${dir}/packs/specialUp/strict`);
for(const f of [4,5]){const c=after.anims.find(a=>a.name==='specialUp').cells[f],z=new PNG({width:1024,height:1024});for(let y=0;y<1024;y++)for(let x=0;x<1024;x++)z.data.set(c.data.subarray((Math.floor(y/4)*256+Math.floor(x/4))*4,(Math.floor(y/4)*256+Math.floor(x/4))*4+4),(y*1024+x)*4);fs.writeFileSync(`${dir}/specialUp-v09-f${f}-4x.png`,PNG.sync.write(z));}
const image=new PNG({width:768,height:512});
const rect=(x,y,b,color)=>{for(let i=b[0];i<=b[2];i++)for(const j of [b[1],b[3]])image.data.set(color,((y+j)*768+x+i)*4);for(let j=b[1];j<=b[3];j++)for(const i of [b[0],b[2]])image.data.set(color,((y+j)*768+x+i)*4);};
for(const [row,p] of [before,after].entries()){
 const a=p.anims.find(a=>a.name==='specialUp');const idle=p.anims.find(a=>a.name==='idle').cells[0];
 for(const [col,c] of [idle,a.cells[4],a.cells[5]].entries())for(let y=0;y<256;y++)image.data.set(c.data.subarray(y*1024,(y+1)*1024),((row*256+y)*768+col*256)*4);
 const heads=row===0?[[140,114,178,153],[126,63,164,103]]:[[139,105,179,145],[123,50,164,89]];
 for(const [i,f] of [4,5].entries()){
  rect((i+1)*256,row*256,p.meta.scaleAudit.anims.specialUp.boxes[f],[255,50,50,255]);
  rect((i+1)*256,row*256,heads[i],[40,255,120,255]);
 }
}
fs.writeFileSync(`${dir}/specialUp-v09-probe-rois.png`,PNG.sync.write(image));
const ship=loadPacked('sasuke','public');const end=new PNG({width:768,height:256});
for(const [i,c] of [after.anims.find(a=>a.name==='idle').cells[0],after.anims.find(a=>a.name==='specialUp').cells[5],ship.anims.find(a=>a.name==='airHeavy').cells[0]].entries())for(let y=0;y<256;y++)end.data.set(c.data.subarray(y*1024,(y+1)*1024),(y*768+i*256)*4);
fs.writeFileSync(`${dir}/specialUp-v09-airHeavy-v04-endpoint.png`,PNG.sync.write(end));
