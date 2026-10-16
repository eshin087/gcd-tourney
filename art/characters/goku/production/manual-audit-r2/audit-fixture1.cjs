const fs=require('fs'),crypto=require('crypto'),{PNG}=require('pngjs');
const root='E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-goku-core/art/characters/goku/production/scale-qa/reassembly-r02';
const out=__dirname; const inv=JSON.parse(fs.readFileSync(root+'/quantized-crops/inventory.json'));const atlas=PNG.sync.read(fs.readFileSync(root+'/fixture-public/characters/goku/sheet.png'));const colors=new Set();for(let i=0;i<atlas.data.length;i+=4)if(atlas.data[i+3])colors.add(atlas.data.slice(i,i+3).toString('hex'));
const marks={
 idle:[0,[136,75,127,112],[109,112,145,112],[70,197,58,239]],
 run:[0,[155,108,137,135],[122,132,146,140],[166,205,177,236]],
 dash:[0,[190,128,175,149],[155,145,181,153],[169,208,161,233]],
 land:[1,[135,104,124,130],[109,129,140,130],[75,204,65,238]],
 light1:[0,[136,79,127,115],[110,115,143,116],[69,200,58,238]],
 light1Recovery:[6,[140,72,129,106],[110,107,148,108],[69,198,56,238]],
 light3:[6,[134,83,124,119],[109,120,141,120],[70,202,62,238]],
 light4:[7,[132,98,124,127],[110,127,139,128],[75,204,64,238]],
 heavy:[7,[135,103,125,129],[111,130,139,131],[74,205,63,238]],
 hurtHigh:[2,[140,85,120,114],[99,111,137,116],[69,199,55,239]],
 getup:[4,[135,111,128,135],[112,136,139,136],[82,207,72,238]],
 win:[0,[138,56,138,91],[117,91,154,91],[93,199,85,238]]
};const baseline=[38.1,36,43.7];const records={};for(const [key,[frame,...segments]]of Object.entries(marks)){const anim=key==='light1Recovery'?'light1':key;const png=PNG.sync.read(fs.readFileSync(root+`/quantized-crops/${anim}/f${String(frame).padStart(2,'0')}.png`));records[key]={animation:anim,frame,measurements:segments.map((v,i)=>{const length=Math.hypot(v[2]-v[0],v[3]-v[1]);return{landmark:['collarCenterToBelt','visibleBeltSpan','bootShaftTopToSole'][i],a:v.slice(0,2),b:v.slice(2),lengthPx:+length.toFixed(2),lengthUncertaintyPx:[5,4,4][i],ratioToIdle:+(length/baseline[i]).toFixed(3),correctionToIdle:+(baseline[i]/length).toFixed(3)}})};for(let j=0;j<segments.length;j++){const [x1,y1,x2,y2]=segments[j];const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));for(let t=0;t<=steps;t++){const x=Math.round(x1+(x2-x1)*t/steps),y=Math.round(y1+(y2-y1)*t/steps),i=(y*256+x)*4;[png.data[i],png.data[i+1],png.data[i+2],png.data[i+3]]=[[0,255,255,255],[255,255,0,255],[255,0,128,255]][j];}}const big=new PNG({width:768,height:768});for(let y=0;y<768;y++)for(let x=0;x<768;x++)png.data.copy(big.data,(y*768+x)*4,(Math.floor(y/3)*256+Math.floor(x/3))*4,(Math.floor(y/3)*256+Math.floor(x/3))*4+4);fs.writeFileSync(out+`/r02-${key}-landmarks-3x.png`,PNG.sync.write(big));}
const bounds={};for(const [anim,meta]of Object.entries(inv.animations)){bounds[anim]=meta.frames.map(f=>{const p=PNG.sync.read(fs.readFileSync(root+'/'+f.path));let a=[256,256,-1,-1];for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(p.data[(y*256+x)*4+3]){a=[Math.min(a[0],x),Math.min(a[1],y),Math.max(a[2],x),Math.max(a[3],y)]}return{frame:f.frame,atlasIndex:f.atlasIndex,sha256:f.sha256,bounds:a,durationMs:f.durationMs}})}
const result={atlasSha256:crypto.createHash('sha256').update(fs.readFileSync(root+'/fixture-public/characters/goku/sheet.png')).digest('hex'),metadataSha256:crypto.createHash('sha256').update(fs.readFileSync(root+'/fixture-public/characters/goku/anims.json')).digest('hex'),opaqueRgbColors:colors.size,scope:'Independent manual representative endpoints on exact quantized cells; all64 frames visually inspected. Uncertainty is segment-length uncertainty, not pixel-coordinate certification. Hidden knees/shins unmeasured.',records,bounds};fs.writeFileSync(out+'/REASSEMBLY_R02_FIXTURE1_MEASUREMENTS.json',JSON.stringify(result,null,2));console.log(JSON.stringify({hash:result.atlasSha256,colors:colors.size,records},null,2));
