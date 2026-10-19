from PIL import Image, ImageDraw, ImageChops
import json, hashlib
from pathlib import Path
p=Path('art/characters/sasuke/production/charge-v15')
a=json.load(open('public/characters/sasuke/anims.json')); sh=Image.open('public/characters/sasuke/sheet.png').convert('RGBA')
def cell(n): return sh.crop(((n%16)*256,(n//16)*256,(n%16+1)*256,(n//16+1)*256))
fs=[cell(n) for n in a['animations']['charge']['frames']]; idle=cell(0)
refs=[Image.open('public/art-review/title-style-pilot/sasuke-'+s+'_v01.png').convert('RGBA') for s in ['neutral','combat']]
board=Image.new('RGB',(1536,570),(60,65,72)); dr=ImageDraw.Draw(board)
for i,f in enumerate(fs): board.paste(f,(i*256,25),f); dr.text((i*256+5,5),'charge f'+str(i),fill='white'); f.save(p/('packed-f'+str(i)+'.png'))
for i,(f,name) in enumerate(zip([idle]+refs,['current idle f0','approved neutral','approved combat'])): board.paste(f,(i*256,310),f); dr.text((i*256+5,290),name,fill='white')
board.save(p/'comparison.png')
reg=Image.new('RGB',(1024,560),(45,48,54)); dr=ImageDraw.Draw(reg)
for i,f in enumerate(fs[2:]):
 reg.paste(f,(i*256,24),f); dr.text((i*256+5,5),'f'+str(i+2),fill='white')
 dr.rectangle((i*256,244,i*256+255,264),outline='yellow')
 diff=ImageChops.difference(fs[2],f); mask=diff.convert('RGB').point(lambda x: 255 if x else 0).convert('L').point(lambda x:255 if x else 0)
 reg.paste((255,70,80),(i*256,300,i*256+256,556),mask); dr.text((i*256+5,280),'difference from f2',fill='white')
reg.save(p/'registration.png')
data={'sha256':{q:hashlib.sha256(Path(q).read_bytes()).hexdigest() for q in ['art/characters/sasuke/raw/charge_v15.png','public/characters/sasuke/sheet.png','public/characters/sasuke/anims.json']},'charge':a['animations']['charge'],'bounds':[f.getbbox() for f in fs],'body_report':json.load(open('art/scale/body-report.json'))['fighters']['sasuke']['anims']['charge'],'loop_differences':[]}
for i,f in enumerate(fs[2:]):
 d=ImageChops.difference(fs[2],f)
 data['loop_differences'].append({'frame':i+2,'foot_rows_220_240_identical':fs[2].crop((0,220,256,241)).tobytes()==f.crop((0,220,256,241)).tobytes(),'changed_pixels':sum(x!=(0,0,0,0) for x in d.getdata()),'diff_bbox':d.convert('RGB').getbbox()})
(p/'measurements.json').write_text(json.dumps(data,indent=2))
print(json.dumps(data,indent=2))
from PIL import Image,ImageDraw,ImageChops
from pathlib import Path
import json
p=Path('art/characters/sasuke/production/charge-v15'); fs=[Image.open(p/('packed-f'+str(i)+'.png')).convert('RGBA') for i in range(6)]
board=Image.new('RGB',(1536,1536),(60,65,72))
for i,f in enumerate(fs): board.paste(f.resize((512,512),Image.Resampling.NEAREST),((i%3)*512,(i//3)*512),f.resize((512,512),Image.Resampling.NEAREST))
a=json.load(open('public/characters/sasuke/anims.json')); sh=Image.open('public/characters/sasuke/sheet.png').convert('RGBA')
refs=[sh.crop((0,0,256,256))]+[Image.open('public/art-review/title-style-pilot/sasuke-'+s+'_v01.png').convert('RGBA') for s in ['neutral','combat']]
for i,f in enumerate(refs): board.paste(f.resize((512,512),Image.Resampling.NEAREST),(i*512,1024),f.resize((512,512),Image.Resampling.NEAREST))
board.save(p/'anatomy-2x.png')
for i in range(2,6):
 im=fs[i]; mask=im.getchannel('A'); print(i,'feet',[(x,mask.crop((x,220,x+128,241)).getbbox()) for x in (0,128)])
 d=ImageChops.difference(fs[2],im); print('feet changed',sum(v!=(0,0,0,0) for v in d.crop((0,220,256,241)).getdata()))
# Four-color alpha silhouettes and true RGB/alpha difference evidence, all at 2x.
onion=Image.new('RGBA',(256,256),(45,48,54,255))
for f,col in zip(fs[2:],[(255,60,80,70),(60,255,90,70),(80,120,255,70),(255,230,60,70)]):
 overlay=Image.new('RGBA',(256,256),col); overlay.putalpha(f.getchannel('A').point(lambda x:70 if x else 0)); onion=Image.alpha_composite(onion,overlay)
ImageDraw.Draw(onion).rectangle((0,220,255,240),outline='white'); onion.resize((512,512),Image.Resampling.NEAREST).save(p/'onion-2x.png')
