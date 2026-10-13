from pathlib import Path
from PIL import Image, ImageDraw
import json, hashlib
ROOT=Path('E:/Vibe Coding/Claude Code/gcdTourney')
OUT=ROOT/'deliverables/round4-qa'
records={}
configs={
 'sasuke':('candidate/sheet.png','candidate/anims.json','production/sheet.png','production/anims.json',['superDash','jumpSquat','beamFire','dash'],['run','airLight3','specialUp','hurtLow','airRecover']),
 'killua':('diagnostic-sheet.png','diagnostic-anims.json','../../../characters/killua/sheet.png','../../../characters/killua/anims.json',['idle','guard','superDash','stagger','win'],['jumpUp','jumpFall','airRecover','airLight1','airLight2']),
 'naruto':('candidate-sheet.png','candidate-anims.json','baseline-sheet.png','baseline-anims.json',['stagger','taunt','win'],['jumpUp','superDash'])}
for char,(cs,cj,bs,bj,new,old) in configs.items():
 wt=ROOT/f'.worktrees/art-{char}-title-r3'
 base=wt/f'public/reviews/{char}-round4'
 if char=='killua': bs='../../characters/killua/sheet.png';bj='../../characters/killua/anims.json'
 def load(s,j):
  p=(base/s).resolve(); q=(base/j).resolve()
  records[str(p)]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'metadataSha256':hashlib.sha256(q.read_bytes()).hexdigest()}
  return Image.open(p).convert('RGBA'),json.loads(q.read_text())
 ci,cm=load(cs,cj);bi,bm=load(bs,bj)
 def cell(im,meta,anim,i):
  n=meta['animations'][anim]['frames'][i]; return im.crop(((n%16)*256,(n//16)*256,(n%16+1)*256,(n//16+1)*256))
 for kind,im,meta,anims in [('candidate',ci,cm,new),('retained',bi,bm,old),('old-replaced',bi,bm,new)]:
  rows=[]
  refs=[]
  for pose in ['neutral','combat']:
   p=ROOT/f'public/art-review/title-style-pilot/{char}-{pose}_v01.png'
   refs.append((pose,Image.open(p).convert('RGBA')))
  refs.append(('baseline idle f0',cell(bi,bm,'idle',0)))
  rows.append(refs)
  for anim in anims:
   frames=meta['animations'][anim]['frames']
   rows.append([(f'{anim} f{i}',cell(im,meta,anim,i)) for i in range(len(frames))])
  canvas=Image.new('RGB',(max(len(r) for r in rows)*256,len(rows)*280),(105,112,119));d=ImageDraw.Draw(canvas)
  for y,row in enumerate(rows):
   for x,(label,img) in enumerate(row):
    canvas.paste(img,(x*256,y*280+24),img);d.text((x*256+4,y*280+5),label,fill='white')
  canvas.save(OUT/f'{char}-{kind}.png')
(OUT/'atlas-hashes.json').write_text(json.dumps(records,indent=2))
