import fs from 'node:fs';
import { PNG } from 'pngjs';
const base='art/characters/killua/';
const [anim,mode='inspect']=process.argv.slice(2);
const p=PNG.sync.read(fs.readFileSync(base+`raw/_parts/${anim}_v01_B.png`));
const mask=new Uint8Array(p.width*p.height),seen=new Uint8Array(mask.length);
for(let i=0;i<mask.length;i++){const j=i*4;mask[i]=p.data[j+3]>127&&!(p.data[j]>180&&p.data[j+2]>175&&p.data[j+1]<110&&p.data[j]-p.data[j+1]>70&&p.data[j+2]-p.data[j+1]>70)?1:0;}
const comps=[];
for(let i=0;i<mask.length;i++)if(mask[i]&&!seen[i]){
  const stack=[i],pixels=[];seen[i]=1;let x0=p.width,y0=p.height,x1=0,y1=0;
  while(stack.length){const k=stack.pop(),x=k%p.width,y=Math.floor(k/p.width);pixels.push(k);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
    for(const n of [x>0?k-1:-1,x<p.width-1?k+1:-1,y>0?k-p.width:-1,y<p.height-1?k+p.width:-1])if(n>=0&&mask[n]&&!seen[n]){seen[n]=1;stack.push(n);}
  }
  if(pixels.length>40)comps.push({pixels,x0,y0,x1,y1,n:pixels.length});
}
const bodies=comps.filter(c=>c.n>10000).sort((a,b)=>a.x0-b.x0);
console.log(JSON.stringify({anim,components:comps.map(({pixels,...c})=>c).sort((a,b)=>b.n-a.n)}));
if(mode==='write'){
  for(const c of comps.filter(c=>c.n<=10000)){
    const near=bodies.reduce((a,b)=>Math.abs((b.x0+b.x1-c.x0-c.x1)/2)<Math.abs((a.x0+a.x1-c.x0-c.x1)/2)?b:a);
    near.pixels.push(...c.pixels);near.x0=Math.min(near.x0,c.x0);near.x1=Math.max(near.x1,c.x1);
  }
  const width=bodies.reduce((s,c)=>s+c.x1-c.x0+1+80,0),out=new PNG({width,height:p.height});
  for(let i=0;i<out.data.length;i+=4){out.data[i]=255;out.data[i+2]=255;out.data[i+3]=255;}
  let dx=40;for(const c of bodies){for(const k of c.pixels){const x=k%p.width,y=Math.floor(k/p.width),j=(y*width+dx+x-c.x0)*4;p.data.copy(out.data,j,k*4,k*4+4);}dx+=c.x1-c.x0+1+80;}
  const file=`raw/_parts/${anim}_v02_B.png`;if(fs.existsSync(base+file))throw Error('Version exists');fs.writeFileSync(base+file,PNG.sync.write(out));
}

