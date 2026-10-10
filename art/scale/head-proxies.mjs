import fs from 'node:fs';import {PNG} from 'pngjs';
const ids=['naruto','sasuke','killua','gojo'],out={};
for(const id of ids){const m=JSON.parse(fs.readFileSync(`public/characters/${id}/anims.json`)),s=PNG.sync.read(fs.readFileSync(`public/characters/${id}/sheet.png`));out[id]={};
for(const[name,a]of Object.entries(m.animations)){out[id][name]=a.frames.map(f=>{
 const mask=new Uint8Array(65536),skin=new Uint8Array(65536);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=((Math.floor(f/m.columns)*256+y)*s.width+f%m.columns*256+x)*4,[r,g,b,alpha]=s.data.subarray(i,i+4);if(!alpha)continue;
 mask[y*256+x]=id==='naruto'?+(r>215&&g>185&&b<145):id==='sasuke'?+(r<125&&b>r*1.25&&g>r&&g/b>.65):+(r>165&&g>165&&b>165&&b>r-12);
 skin[y*256+x]=+(r>175&&g>100&&r>g&&g>b&&r-b>22&&r-b<110&&g-b<70&&(id!=='naruto'||b>125));
 }
 const seen=new Uint8Array(65536),comps=[];
 for(let k=0;k<65536;k++)if(mask[k]&&!seen[k]){const pts=[],q=[k];seen[k]=1;for(let n=0;n<q.length;n++){const v=q[n],x=v%256,y=v>>8;pts.push([x,y]);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){let xx=x+dx,yy=y+dy,j=yy*256+xx;if(xx>=0&&xx<256&&yy>=0&&yy<256&&!seen[j]&&mask[j]){seen[j]=1;q.push(j);}}}comps.push(pts);}
 comps.sort((a,b)=>b.length-a.length);let h=comps[0]||[];if(!h.length)return null;
 let xs=h.map(p=>p[0]),ys=h.map(p=>p[1]),box=[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)],cx=xs.reduce((a,b)=>a+b,0)/h.length,cy=ys.reduce((a,b)=>a+b,0)/h.length;
 const radius=Math.max(box[2]-box[0],box[3]-box[1])*.85,face=[];for(let y=Math.max(0,Math.floor(cy-radius));y<Math.min(256,cy+radius);y++)for(let x=Math.max(0,Math.floor(cx-radius));x<Math.min(256,cx+radius);x++)if(skin[y*256+x]&&Math.hypot(x-cx,y-cy)<radius)face.push([x,y]);
 return{hairBox:box,hairArea:h.length,skinCount:face.length,skinCenter:face.length?[face.reduce((a,b)=>a+b[0],0)/face.length,face.reduce((a,b)=>a+b[1],0)/face.length]:null};
 });}
}
fs.writeFileSync('art/scale/head-proxies.json',JSON.stringify(out,null,2));for(const id of ids){console.log(id);for(const[name,frames]of Object.entries(out[id]))console.log(name,frames.map(f=>f?Math.round(Math.sqrt(f.hairArea)):0).join(','));}
