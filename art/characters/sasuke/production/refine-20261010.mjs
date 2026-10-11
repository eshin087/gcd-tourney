import fs from 'node:fs';
import {PNG} from 'pngjs';
import crypto from 'node:crypto';
const dir='art/characters/sasuke/raw/';
const out=new PNG({width:5120,height:1024});
for(let i=0;i<out.data.length;i+=4){out.data[i]=255;out.data[i+2]=255;out.data[i+3]=255;}
let f=0;
for(const [part,cuts] of [['A',[0,463,799,1145,1610,1983]],['B',[0,500,1040,1536]]]){
 const p=PNG.sync.read(fs.readFileSync(dir+`_parts/heavy_v06_${part}.png`));
 for(let i=0;i<cuts.length-1;i++){const w=cuts[i+1]-cuts[i];PNG.bitblt(p,out,cuts[i],0,w,p.height,f*640+Math.floor((640-w)/2),1024-p.height);f++;}
}
fs.writeFileSync(dir+'heavy_v06.png',PNG.sync.write(out),{flag:'wx'});
const marks={heavy:[[[304,412],[324,483]],[[689,430],[707,496]],[[1025,231],[1047,306]],[[1301,220],[1343,289]],[[1732,159],[1778,232]],[[281,127],[300,246]],[[785,209],[805,327]],[[1284,214],[1304,330]]],charge:[[[279,86],[302,181]],[[784,86],[807,181]],[[1290,86],[1313,181]],[[1798,86],[1821,181]]]};
for(const [anim,points] of Object.entries(marks)){
 const version=anim==='heavy'?6:4;
 const measurements=points.map(([crown,chin],frame)=>({frame,source:anim==='heavy'?`_parts/heavy_v06_${frame<5?'A':'B'}.png`:'charge_v04.png',crown,chin,length:+Math.hypot(chin[0]-crown[0],chin[1]-crown[1]).toFixed(3),uncertainty:'Crown inferred beneath hair; visually traced axis, approximate +/-3 source px. Tilted heavy f3/f4 axes measured diagonally.'}));
 const side={split:'even',frames:points.length,anatomy:{measurement:'skull-to-chin',targetHeadPx:31,sourceHeadPx:measurements.map(m=>m.length)},measurements,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(dir+`${anim}_v0${version}.png`)).digest('hex'),calibrationNotes:'New generated correction, explicit source-coordinate landmarks and source hash; measure skull independent of pose bounds. Human image approval remains pending.'};
 if(anim==='heavy')side.frameOffsets=points.map(()=>[0,0]);
 fs.writeFileSync(dir+`${anim}_v0${version}.json`,JSON.stringify(side,null,2)+'\n',{flag:'wx'});
}
const boxes=JSON.parse(fs.readFileSync('art/characters/sasuke/hitboxes.json'));delete boxes.heavy;fs.writeFileSync('art/characters/sasuke/hitboxes.json',JSON.stringify(boxes,null,2)+'\n');
for(const [name,versions] of [['heavy',[3,4,5]],['charge',[3]]])for(const v of versions)for(const ext of ['png','json']){
 const p=dir+`${name}_v0${v}.${ext}`;fs.mkdirSync(dir+'_rejected',{recursive:true});fs.renameSync(p,dir+`_rejected/${name}_v0${v}.${ext}`);
}
console.log('New versioned candidates assembled; prior failed sandbox candidates archived by user correction request.');
