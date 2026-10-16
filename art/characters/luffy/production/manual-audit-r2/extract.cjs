const fs=require('fs'),path=require('path'),crypto=require('crypto'),{PNG}=require('pngjs');
const dir=path.resolve(__dirname,'../astra-fixture-output/characters/luffy');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const src=PNG.sync.read(fs.readFileSync(dir+'/sheet.png')),meta=JSON.parse(fs.readFileSync(dir+'/anims.json'));
const out={sheet:hash(dir+'/sheet.png'),metadata:hash(dir+'/anims.json'),colors:new Set(Array.from({length:src.width*src.height},(_,i)=>src.data[i*4+3]?[...src.data.subarray(i*4,i*4+3)].join(','):null).filter(Boolean)).size,animations:{}};
for(const [name,a] of Object.entries(meta.animations)){
 out.animations[name]={loop:a.loop,durations:a.durations,frames:[]};
 a.frames.forEach((index,f)=>{let p=new PNG({width:256,height:256});for(let y=0;y<256;y++){let s=((Math.floor(index/16)*256+y)*src.width+index%16*256)*4;src.data.copy(p.data,y*1024,s,s+1024);}let file=__dirname+'/'+name+'-'+f+'.png';fs.writeFileSync(file,PNG.sync.write(p));out.animations[name].frames.push({frame:f,hash:hash(file)});
 if(['idle','win','light1','land','heavy','guard','launched','beamCharge'].includes(name)){let b=new PNG({width:768,height:768});for(let y=0;y<768;y++)for(let x=0;x<768;x++){let i=(Math.floor(y/3)*256+Math.floor(x/3))*4;p.data.copy(b.data,(y*768+x)*4,i,i+4);}fs.writeFileSync(__dirname+'/'+name+'-'+f+'-3x.png',PNG.sync.write(b));}
 });
}
fs.writeFileSync(__dirname+'/pixel-hashes.json',JSON.stringify(out,null,2));
