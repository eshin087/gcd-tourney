from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
w=Path.cwd();o=w/'art/characters/naruto/production/round5/astra-alts';o.mkdir(parents=True,exist_ok=True)
a=json.loads((w/'public/characters/naruto/anims.json').read_text());im=Image.open(w/'public/characters/naruto/sheet.png').convert('RGBA')
names=['airLight1Alt','airLight2Alt','airLight3Alt','heavyAlt','hurtHighAlt','hurtLowAlt','light1Alt','light2Alt','light3Alt','light4Alt']
def cell(n,i):
 f=a['animations'][n]['frames'][i];x=f%16*256;y=f//16*256;return im.crop((x,y,x+256,y+256))
def panel(seq,p):
 out=Image.new('RGB',(1024,280*((len(seq)+3)//4)),(90,90,90));d=ImageDraw.Draw(out)
 for j,(label,c) in enumerate(seq):
  x=j%4*256;y=j//4*280;out.paste(c,(x,y+24),c);d.text((x+5,y+4),label,fill='white')
 out.save(o/p)
refs=[('neutral',Image.open(w/'public/art-review/title-style-pilot/naruto-neutral_v01.png').convert('RGBA')),('combat',Image.open(w/'public/art-review/title-style-pilot/naruto-combat_v01.png').convert('RGBA')),('current idle f0',cell('idle',0)),('current idle f7',cell('idle',7))];panel(refs,'references.png')
e={'sheetSha256':hashlib.sha256((w/'public/characters/naruto/sheet.png').read_bytes()).hexdigest(),'animsSha256':hashlib.sha256((w/'public/characters/naruto/anims.json').read_bytes()).hexdigest(),'animations':{},'airHeavyAltAbsent':'airHeavyAlt' not in a['animations']}
for n in names:
 z=a['animations'][n];b=n[:-3];panel([(n+' f'+str(i),cell(n,i)) for i in range(len(z['frames']))],n+'.png');panel([(b+' f'+str(i),cell(b,i)) for i in range(len(z['frames']))],b+'-base.png')
 frames=[]
 for i,f in enumerate(z['frames']):
  c=cell(n,i);bc=cell(b,i);bf=a['animations'][b]['frames'][i];frames.append({'frame':i,'atlasIndex':f,'bounds':c.getbbox(),'boxesEqualBase':a['boxes'][str(f)]==a['boxes'][str(bf)],'sha256Rgba':hashlib.sha256(c.tobytes()).hexdigest()})
 e['animations'][n]={'frames':frames,'durationsEqualBase':z['durations']==a['animations'][b]['durations'],'phasesEqualBase':z.get('phases')==a['animations'][b].get('phases'),'loop':z['loop']}
 panel([(b+' first',cell(b,0)),(n+' first',cell(n,0)),(b+' last',cell(b,len(z['frames'])-1)),(n+' last',cell(n,len(z['frames'])-1))],n+'-endpoints.png')
(o/'atlas-evidence.json').write_text(json.dumps(e,indent=2)+'\n')
print(o)
