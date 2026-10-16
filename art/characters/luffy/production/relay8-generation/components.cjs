const fs=require('fs');const {PNG}=require('pngjs');
for(const f of process.argv.slice(2)){
 const p=PNG.sync.read(fs.readFileSync(f)),w=p.width,h=p.height,d=p.data,seen=new Uint8Array(w*h),out=[];
 const is=(i)=>!(d[i]>230&&d[i+1]<50&&d[i+2]>230)&&d[i+3]>0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){let q=y*w+x;if(seen[q]||!is(q*4))continue;seen[q]=1;let stack=[q],n=0,x0=x,x1=x,y0=y,y1=y;while(stack.length){let a=stack.pop(),ax=a%w,ay=(a/w)|0;n++;x0=Math.min(x0,ax);x1=Math.max(x1,ax);y0=Math.min(y0,ay);y1=Math.max(y1,ay);for(let yy=Math.max(0,ay-1);yy<=Math.min(h-1,ay+1);yy++)for(let xx=Math.max(0,ax-1);xx<=Math.min(w-1,ax+1);xx++){let b=yy*w+xx;if(!seen[b]&&is(b*4)){seen[b]=1;stack.push(b)}}}if(n>30)out.push({n,x0,x1,y0,y1,w:x1-x0+1,h:y1-y0+1});}
 out.sort((a,b)=>b.n-a.n);console.log(f,JSON.stringify(out.slice(0,20)));
}
