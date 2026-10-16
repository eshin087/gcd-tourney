const fs=require('fs');const {PNG}=require('pngjs');
for(const p of ['art/characters/luffy/production/light1-v02-contact.png','art/characters/luffy/production/win-v03-contact.png']){
 const im=PNG.sync.read(fs.readFileSync(p));
 for(let i=0;i<im.data.length;i+=4) if(im.data[i+3]<16){im.data[i]=255;im.data[i+1]=0;im.data[i+2]=255;im.data[i+3]=255;}
 fs.writeFileSync(p,PNG.sync.write(im));
}
