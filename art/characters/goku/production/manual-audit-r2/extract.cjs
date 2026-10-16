const fs=require('fs'),path=require('path'),crypto=require('crypto'),{PNG}=require('pngjs');
const base=path.resolve(__dirname,'../scale-qa/pilot-v01/fixture-output');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest={};
for(const mode of ['current','native-height']){
 const dir=path.join(base,mode,'characters/goku'),sheet=path.join(dir,'sheet.png'),meta=path.join(dir,'anims.json');
 const src=PNG.sync.read(fs.readFileSync(sheet)),m=JSON.parse(fs.readFileSync(meta));
 manifest[mode]={sheet:hash(sheet),metadata:hash(meta),colors:new Set(Array.from({length:src.width*src.height},(_,i)=>src.data[i*4+3]?[...src.data.subarray(i*4,i*4+3)].join(','):null).filter(Boolean)).size,frames:{}};
 for(const [name,a] of Object.entries(m.animations)){
  const cells=a.frames.map((index,f)=>{const cell=new PNG({width:256,height:256});for(let y=0;y<256;y++){let start=((Math.floor(index/16)*256+y)*src.width+index%16*256)*4;src.data.copy(cell.data,y*256*4,start,start+256*4);}const file=path.join(__dirname,`${mode}-${name}-${f}.png`);fs.writeFileSync(file,PNG.sync.write(cell));manifest[mode].frames[`${name}-${f}`]=hash(file);return cell;});
  for(let start=0;start<cells.length;start+=3){const part=cells.slice(start,start+3),out=new PNG({width:part.length*512,height:512});part.forEach((cell,i)=>{for(let y=0;y<512;y++)for(let x=0;x<512;x++){let s=(Math.floor(y/2)*256+Math.floor(x/2))*4;cell.data.copy(out.data,(y*out.width+i*512+x)*4,s,s+4);}});fs.writeFileSync(path.join(__dirname,`${mode}-${name}-group${start}.png`),PNG.sync.write(out));}
 }
}
fs.writeFileSync(path.join(__dirname,'pixel-hashes.json'),JSON.stringify(manifest,null,2));
