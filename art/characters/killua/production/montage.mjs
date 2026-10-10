import fs from 'node:fs';
import { PNG } from 'pngjs';
const base='art/characters/killua/production/';
const meta=JSON.parse(fs.readFileSync('public/characters/killua/anims.json'));
const sheet=PNG.sync.read(fs.readFileSync('public/characters/killua/sheet.png'));
const entries=Object.entries(meta.animations);
for(let page=0;page<6;page++){
 const rows=entries.slice(page*7,page*7+7),out=new PNG({width:2048,height:rows.length*256});
 for(let i=0;i<out.data.length;i+=4){out.data[i]=28;out.data[i+1]=32;out.data[i+2]=42;out.data[i+3]=255;}
 rows.forEach(([name,a],row)=>a.frames.forEach((f,col)=>{
   for(let y=0;y<256;y++)for(let x=0;x<256;x++){const si=((Math.floor(f/16)*256+y)*sheet.width+(f%16)*256+x)*4,di=((row*256+y)*out.width+col*256+x)*4;if(sheet.data[si+3])sheet.data.copy(out.data,di,si,si+4);}
 }));
 fs.writeFileSync(base+`contact-${page+1}.png`,PNG.sync.write(out));console.log(page+1,rows.map(([n])=>n).join(', '));
}
