import fs from 'node:fs';
import { PNG } from 'pngjs';
const m=JSON.parse(fs.readFileSync('public/characters/sasuke/anims.json'));
const s=PNG.sync.read(fs.readFileSync('public/characters/sasuke/sheet.png'));
const records={};
const entries=Object.entries(m.animations);
for(let page=0;page<4;page++){
 const rows=entries.slice(page*11,page*11+11),out=new PNG({width:1536,height:rows.length*192});
 for(let i=0;i<out.data.length;i+=4)out.data.set([35,40,50,255],i);
 rows.forEach(([anim,a],row)=>{records[anim]=a.frames.map((f,col)=>{
  const sx=f%m.columns*256,sy=Math.floor(f/m.columns)*256,mask=new Uint8Array(65536),seen=new Uint8Array(65536),cs=[];
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=((sy+y)*s.width+sx+x)*4,[r,g,b,alpha]=s.data.subarray(i,i+4);mask[y*256+x]=+(alpha>127&&r>175&&r-g>15&&g>b&&g-b<75&&r-b<125);}
  for(let i=0;i<65536;i++)if(mask[i]&&!seen[i]){const q=[i];seen[i]=1;for(let n=0;n<q.length;n++){const k=q[n],x=k%256,y=k>>8;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy,j=yy*256+xx;if(xx>=0&&xx<256&&yy>=0&&yy<256&&mask[j]&&!seen[j]){seen[j]=1;q.push(j);}}}cs.push(q);}
  cs.sort((a,b)=>b.length-a.length);const c=cs[0]||[128+100*256],top=Math.min(...c.map(k=>k>>8)),upper=c.filter(k=>(k>>8)<top+12),cx=upper.reduce((n,k)=>n+k%256,0)/upper.length,cy=top+8,x0=Math.round(cx-32),y0=Math.round(cy-28);
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){const xx=x0+x,yy=y0+y;if(xx<0||xx>255||yy<0||yy>255)continue;const i=((sy+yy)*s.width+sx+xx)*4;if(!s.data[i+3])continue;for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++)s.data.copy(out.data,((row*192+y*3+dy)*out.width+col*192+x*3+dx)*4,i,i+4);}
  return {frame:col,cropOrigin:[x0,y0],page,row,col,note:'Diagnostic skin crop only; may select a hand or chest. Never an anatomical measurement.'};
 });});
 fs.writeFileSync(`art/scale/sasuke-heads-${page+1}.png`,PNG.sync.write(out));console.log(page+1,rows.map(([n])=>n).join(','));
}
fs.writeFileSync('art/scale/sasuke-head-crops.json',JSON.stringify(records,null,2));
