import { PNG } from 'pngjs';

// Packing preparation: separate disconnected poses without redrawing their pixels.
export function isolate(p, expected) {
  const mask = new Uint8Array(p.width * p.height), seen = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) {
    const j = i * 4, [r,g,b,a] = p.data.subarray(j,j+4);
    mask[i] = a > 127 && !(r > 180 && b > 175 && g < 110 && r-g > 70 && b-g > 70) ? 1 : 0;
  }
  const comps = [];
  for (let i = 0; i < mask.length; i++) if (mask[i] && !seen[i]) {
    const stack = [i], pixels = []; seen[i] = 1;
    let x0=p.width,x1=0;
    while(stack.length) {
      const k=stack.pop(),x=k%p.width,y=Math.floor(k/p.width); pixels.push(k);x0=Math.min(x0,x);x1=Math.max(x1,x);
      for(const n of [x>0?k-1:-1,x<p.width-1?k+1:-1,y>0?k-p.width:-1,y<p.height-1?k+p.width:-1]) if(n>=0&&mask[n]&&!seen[n]) {seen[n]=1;stack.push(n);}
    }
    if(pixels.length>40) comps.push({pixels,x0,x1});
  }
  const bodies=comps.filter(c=>c.pixels.length>10000).sort((a,b)=>a.x0-b.x0);
  if(bodies.length!==expected) throw Error(`Pose isolation found ${bodies.length}, expected ${expected}; inspect source before saving.`);
  for(const c of comps.filter(c=>c.pixels.length<=10000)) {
    const near=bodies.reduce((a,b)=>Math.abs(b.x0+b.x1-c.x0-c.x1)<Math.abs(a.x0+a.x1-c.x0-c.x1)?b:a);
    for(const k of c.pixels) near.pixels.push(k);
    near.x0=Math.min(near.x0,c.x0);near.x1=Math.max(near.x1,c.x1);
  }
  const width=bodies.reduce((s,c)=>s+c.x1-c.x0+1+80,0),out=new PNG({width,height:p.height});
  for(let i=0;i<out.data.length;i+=4){out.data[i]=255;out.data[i+2]=255;out.data[i+3]=255;}
  let dx=40;
  for(const c of bodies){for(const k of c.pixels){const x=k%p.width,y=Math.floor(k/p.width),j=(y*width+dx+x-c.x0)*4;p.data.copy(out.data,j,k*4,k*4+4);}dx+=c.x1-c.x0+1+80;}
  return out;
}
