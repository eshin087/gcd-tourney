from PIL import Image, ImageDraw
from pathlib import Path
import json,hashlib
base=Path('art/characters/killua/production/round4/post-calibration-20261015');base.mkdir(exist_ok=True)
sheet=Image.open('public/characters/killua/sheet.png').convert('RGBA');meta=json.load(open('public/characters/killua/anims.json'))
files=['public/characters/killua/sheet.png','public/characters/killua/anims.json','public/art-review/title-style-pilot/killua-neutral_v01.png','public/art-review/title-style-pilot/killua-combat_v01.png','art/characters/killua/production/round4/approved-idle.png']
files += ['art/characters/killua/raw/'+n+'_v'+v+'.png' for n,v in [('idle','11'),('guard','09'),('superDash','08'),('win','05')]]
hashes={p:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in files}
json.dump(hashes,open(base/'hashes.json','w'),indent=2)
refs=[Image.open(p).convert('RGBA') for p in files[2:5]]
print([(files[i+2],im.size) for i,im in enumerate(refs)])
data={}
for name in ['idle','guard','superDash','win']:
 ids=meta['animations'][name]['frames']; imgs=[];data[name]=[]
 for i,k in enumerate(ids):
  im=sheet.crop((k%16*256,k//16*256,k%16*256+256,k//16*256+256));im.save(base/f'{name}-{i}.png');imgs.append(im);data[name].append({'frame':i,'atlas':k,'bbox':im.getbbox()})
 allimgs=refs+imgs; out=Image.new('RGB',(4*512,((len(allimgs)+3)//4)*552),'#dddddd');d=ImageDraw.Draw(out)
 for i,im in enumerate(allimgs):
  x=i%4*512;y=i//4*552;out.paste(im.resize((512,512),Image.Resampling.NEAREST),(x,y+30),im.resize((512,512),Image.Resampling.NEAREST));d.text((x+10,y+8),(['neutral','combat','approved idle08']+[f'{name} f{j}' for j in range(len(imgs))])[i],fill='black')
 out.save(base/f'{name}-all-2x.png')
json.dump(data,open(base/'bounds.json','w'),indent=2)
print(json.dumps(data));print('audit',json.dumps({n:meta['scaleAudit']['anims'][n] for n in data}))
