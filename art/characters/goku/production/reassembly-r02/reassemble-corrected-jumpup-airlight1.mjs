import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';
const root=process.cwd(), base=path.join(root,'art/characters/goku'), srcDir=path.join(base,'production/generation-source'), qa=path.join(base,'production/reassembly-r02'), out=path.join(base,'raw/_qa_hold');
const target={collarToBelt:38.1,beltWidth:36,bootTopToSole:43.7};
const configs=[
 {name:'jumpUp',version:4,source:'jumpUp_v03_attempt03.png',cols:2,rows:1,frames:2,w:887,h:887,marks:{collarToBelt:{a:[480,350],b:[398,473],unc:[8,8],t:'collar-center/sternoclavicular point to belt center, f0'},beltWidth:{a:[331,453],b:[476,453],unc:[8,8],t:'outer visible blue belt edge span at y453, f0'},bootTopToSole:{a:[304,645],b:[269,794],unc:[10,10],t:'left boot shaft top to sole along diagonal, f0'},otherBoot:{a:[407,655],b:[409,826],unc:[10,10],t:'other boot shaft top to sole, near-vertical f0; secondary projection check',target:'bootTopToSole'}}},
 {name:'airLight1',version:5,source:'airLight1_v04_attempt04.png',cols:3,rows:2,frames:5,w:512,h:512,marks:{collarToBelt:{a:[278,147],b:[251,212],unc:[8,8],t:'collar-center/sternoclavicular point to belt center, f0'},beltWidth:{a:[218,213],b:[279,213],unc:[6,6],t:'outer blue belt span; excludes pants edge, f0'},bootTopToSole:{a:[150,386],b:[132,464],unc:[8,8],t:'left boot shaft top to sole along axis, f0'}}}
];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const isM=(d,i)=>d[i]>160&&d[i+1]<100&&d[i+2]>160;
const med=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2};
function bounds(im,x0,y0,x1,y1){let l=x1,t=y1,r=-1,b=-1;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){let i=(y*im.width+x)*4;if(im.data[i+3]<128||isM(im.data,i))continue;l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y)}if(r<0)throw Error('empty frame');return{l,t,r,b,w:r-l+1,h:b-t+1}}
function line(im,a,b,color){let [x0,y0]=a,[x1,y1]=b,dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,e=dx+dy;for(;;){for(let oy=-2;oy<=2;oy++)for(let ox=-2;ox<=2;ox++){let x=x0+ox,y=y0+oy;if(x>=0&&x<im.width&&y>=0&&y<im.height)im.data.set(color,(y*im.width+x)*4)}if(x0===x1&&y0===y1)break;let e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
const rows=[];
for(const c of configs){const srcPath=path.join(srcDir,c.source),src=PNG.sync.read(fs.readFileSync(srcPath));if(src.width!==c.cols*c.w||src.height!==c.rows*c.h)throw Error(`${c.name} source dims mismatch`);
 const refPath=path.join(base,'raw/idle_v02.png'), refSha=sha(fs.readFileSync(refPath));
 const values=Object.entries(c.marks).map(([k,m])=>{const targetKey=m.target??k;const len=Math.hypot(m.b[0]-m.a[0],m.b[1]-m.a[1]),t=target[targetKey],ratio=t/len;return {key:k,m,len,t,ratio,targetKey}});
 const factor=Number(med(values.map(v=>v.ratio)).toFixed(3));
 const strip=new PNG({width:c.frames*256,height:256});for(let i=0;i<strip.data.length;i+=4)strip.data.set([255,0,255,255],i);
 const roomyWidth=Math.ceil(Math.max(...Array.from({length:c.frames},(_,f)=>{const col=f%c.cols,row=Math.floor(f/c.cols);return bounds(src,col*c.w,row*c.h,(col+1)*c.w,(row+1)*c.h).w*factor})))+16;
 const roomyHeight=Math.ceil(Math.max(...Array.from({length:c.frames},(_,f)=>{const col=f%c.cols,row=Math.floor(f/c.cols);return bounds(src,col*c.w,row*c.h,(col+1)*c.w,(row+1)*c.h).h*factor})))+16;
 const roomy=new PNG({width:c.frames*roomyWidth,height:roomyHeight});for(let i=0;i<roomy.data.length;i+=4)roomy.data.set([255,0,255,255],i);
 const frameStats=[];
 for(let f=0;f<c.frames;f++){const col=f%c.cols,row=Math.floor(f/c.cols),x0=col*c.w,y0=row*c.h,b=bounds(src,x0,y0,x0+c.w,y0+c.h),sw=Math.ceil(b.w*factor),sh=Math.ceil(b.h*factor),ox=Math.round(128-(sw-1)/2),oy=240-sh+1;let lost=0;
  for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){const sx=b.l+Math.min(b.w-1,Math.floor(x/factor)),sy=b.t+Math.min(b.h-1,Math.floor(y/factor)),si=(sy*src.width+sx)*4;if(src.data[si+3]<128||isM(src.data,si))continue;
   const tx=ox+x,ty=oy+y;if(tx<0||tx>=256||ty<0||ty>=256){lost++;continue}strip.data.set(src.data.subarray(si,si+4),(ty*strip.width+f*256+tx)*4);
   const rx=Math.floor((roomyWidth-sw)/2)+x,ry=roomyHeight-sh+y;roomy.data.set(src.data.subarray(si,si+4),(ry*roomy.width+f*roomyWidth+rx)*4);
  }
  frameStats.push({frame:f,sourceRect:[x0,y0,x0+c.w,y0+c.h],sourceBounds:{left:b.l-x0,top:b.t-y0,right:b.r-x0,bottom:b.b-y0,width:b.w,height:b.h},scaledBounds:{x:ox,y:oy,width:sw,height:sh},lostPixelsIn256:lost});
 }
 const pngName=`${c.name}_v${String(c.version).padStart(2,'0')}.png`,rawPath=path.join(out,pngName),roomyPath=path.join(qa,`${c.name}_v${String(c.version).padStart(2,'0')}-uncropped-roomy.png`);
 for(const f of [rawPath,rawPath.replace(/\.png$/,'.json'),roomyPath])if(fs.existsSync(f))throw Error(`refusing overwrite ${f}`);
 const stripBuf=PNG.sync.write(strip),roomyBuf=PNG.sync.write(roomy);fs.writeFileSync(rawPath,stripBuf);fs.writeFileSync(roomyPath,roomyBuf);
 const ann=new PNG({width:c.w,height:c.h});for(let y=0;y<c.h;y++)for(let x=0;x<c.w;x++){const si=((y+Math.floor(c.marks[Object.keys(c.marks)[0]].a[1]/c.h)*c.h)*src.width+x+Math.floor(c.marks[Object.keys(c.marks)[0]].a[0]/c.w)*c.w)*4;ann.data.set(src.data.subarray(si,si+4),(y*c.w+x)*4)}
 const offX=Math.floor(c.marks[Object.keys(c.marks)[0]].a[0]/c.w)*c.w,offY=Math.floor(c.marks[Object.keys(c.marks)[0]].a[1]/c.h)*c.h;
 for(const v of values)line(ann,[v.m.a[0]-offX,v.m.a[1]-offY],[v.m.b[0]-offX,v.m.b[1]-offY],v.key==='collarToBelt'?[20,245,255,255]:v.key==='beltWidth'?[255,230,20,255]:[255,30,30,255]);
 const annName=`${c.name}-source-f0-corrected-endpoints.png`;fs.writeFileSync(path.join(qa,annName),PNG.sync.write(ann));
 const landmarks=Object.fromEntries(values.map(v=>[v.key,{a:v.m.a,b:v.m.b,definition:v.m.t,sourceLengthPx:Number(v.len.toFixed(3)),sourceEndpointUncertaintyPx:v.m.unc,targetPx:v.t,targetUncertaintyPx:v.targetKey==='beltWidth'?4:v.targetKey==='collarToBelt'?5:6,ratio:Number(v.ratio.toFixed(8))}]));
 const record={animation:c.name,version:c.version,status:'measured diagnostic reassembly; technical review hold, no art approval or scale pass',sourcePath:`art/characters/goku/production/generation-source/${c.source}`,sourceSha256:sha(fs.readFileSync(srcPath)),sourceDimensions:[src.width,src.height],sourceGrid:[c.cols,c.rows,c.frames],sourceFrameGridCellPx:[c.w,c.h],sourceFrameUsedForScale:0,reference:{path:'art/characters/goku/raw/idle_v02.png',sha256:refSha,targetsPx:target,referenceUncertaintyPx:{collarToBelt:5,beltWidth:4,bootTopToSole:6}},landmarks,factor,factorMethod:'exact median of all listed direct source landmark ratios, calculated programmatically and rounded to 0.001; nearest-neighbor uniform scale, no per-frame or bounds normalization',factorUncertaintySourceAndReference:'Approximate ±0.06 for jumpUp / ±0.07 for airLight1, propagated conservatively from independent endpoint and reference target uncertainties; not a numeric gate result.',frames:frameStats,outputPath:`art/characters/goku/raw/_qa_hold/${pngName}`,outputSha256:sha(stripBuf),uncroppedRoomyCompanion:`art/characters/goku/production/reassembly-r02/${path.basename(roomyPath)}`,uncroppedRoomySha256:sha(roomyBuf),uncroppedRoomyDimensions:[roomy.width,roomy.height],annotation:`art/characters/goku/production/reassembly-r02/${annName}`,reviewNote:'Source pixels rescaled uniformly. Inspect lost-pixel counts and roomy companion before judging 256-cell suitability.'};
 fs.writeFileSync(rawPath.replace(/\.png$/,'.json'),JSON.stringify(record,null,2)+'\n');rows.push({animation:c.name,version:c.version,factor,sourceSha256:record.sourceSha256,outputSha256:record.outputSha256,roomy:record.uncroppedRoomyCompanion,landmarks,frames:frameStats});
}
fs.writeFileSync(path.join(qa,'corrected-jumpup-airlight1-summary.json'),JSON.stringify({method:'Corrected source endpoints based on direct original inspection and Astra screening; uncertainty retained.',rows},null,2)+'\n');console.log(JSON.stringify(rows.map(x=>({animation:x.animation,version:x.version,factor:x.factor,outputSha256:x.outputSha256,lost:x.frames.reduce((n,f)=>n+f.lostPixelsIn256,0)})),null,2));
