import fs from 'node:fs';
import {PNG} from 'pngjs';
const label=process.argv[2]||'before';
const ids=['naruto','sasuke','killua','gojo'];
const fill=(w,h)=>{const p=new PNG({width:w,height:h});for(let i=0;i<p.data.length;i+=4){p.data[i]=35;p.data[i+1]=40;p.data[i+2]=50;p.data[i+3]=255;}return p;};
function draw(out,sheet,meta,f,dx,dy){for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=((Math.floor(f/meta.columns)*256+y)*sheet.width+(f%meta.columns)*256+x)*4,j=((dy+y)*out.width+dx+x)*4;if(sheet.data[i+3])sheet.data.copy(out.data,j,i,i+4);}for(let x=0;x<256;x++){const j=((dy+241)*out.width+dx+x)*4;out.data[j]=90;out.data[j+1]=100;out.data[j+2]=120;}}
const compare=fill(1024,512),report={};
for(const [c,id]of ids.entries()){
 const meta=JSON.parse(fs.readFileSync(`public/characters/${id}/anims.json`)),sheet=PNG.sync.read(fs.readFileSync(`public/characters/${id}/sheet.png`));
 draw(compare,sheet,meta,meta.animations.idle.frames[0],c*256,0);draw(compare,sheet,meta,meta.animations.run.frames[0],c*256,256);
 const entries=Object.entries(meta.animations),page=fill(1792,Math.ceil(entries.length/7)*256);report[id]={ppu:meta.pixelsPerUnit,cell:[meta.frameWidth,meta.frameHeight],animations:{}};
 entries.forEach(([name,a],n)=>{draw(page,sheet,meta,a.frames[0],n%7*256,Math.floor(n/7)*256);report[id].animations[name]=a.frames.map(f=>{let x0=256,y0=256,x1=-1,y1=-1;for(let y=0;y<256;y++)for(let x=0;x<256;x++){let i=((Math.floor(f/meta.columns)*256+y)*sheet.width+f%meta.columns*256+x)*4;if(sheet.data[i+3]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}return {x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};});});
 fs.writeFileSync(`art/scale/${id}-${label}.png`,PNG.sync.write(page));console.log(id,entries.map(([n])=>n).join(','));
}
fs.writeFileSync(`art/scale/cast-${label}.png`,PNG.sync.write(compare));fs.writeFileSync(`art/scale/bounds-${label}.json`,JSON.stringify(report,null,2));
