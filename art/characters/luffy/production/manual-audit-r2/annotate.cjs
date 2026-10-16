const fs=require('fs'),{PNG}=require('pngjs');
const data=JSON.parse(fs.readFileSync(__dirname+'/measurements.json'));
for(const r of data.rows){const p=PNG.sync.read(fs.readFileSync(`${__dirname}/${r.animation}-${r.frame}.png`));
 function dot(x,y,c){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=Math.round(x)+dx,yy=Math.round(y)+dy;if(xx<0||yy<0||xx>=256||yy>=256)continue;const i=(yy*256+xx)*4;p.data.set([...c,255],i);}}
 function line(a,b,c){const n=Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]));for(let k=0;k<=n;k++){const x=Math.round(a[0]+(b[0]-a[0])*k/n),y=Math.round(a[1]+(b[1]-a[1])*k/n),i=(y*256+x)*4;p.data.set([...c,255],i);}dot(...a,c);dot(...b,c);}
 if(r.shin.endpoints)line(...r.shin.endpoints,[0,255,255]);
 for(const a of data.additional.filter(x=>x.animation===r.animation&&x.frame===r.frame)){const c=a.name==='neckBaseToSash'?[0,255,0]:a.name==='sashWidth'?[255,0,255]:[255,255,255];line(...a.endpoints,c);}
 fs.writeFileSync(`${__dirname}/${r.animation}-${r.frame}-landmarks.png`,PNG.sync.write(p));
}
