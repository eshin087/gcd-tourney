from pathlib import Path
from PIL import Image, ImageDraw
import sys, json, hashlib
# Read-only candidate analysis. All derived files stay beside this audit script.
o=Path(__file__).parent
w=o.parents[5]
d=Path(sys.argv[1])
a=json.loads((d/'anims.json').read_text())
im=Image.open(d/'sheet.png').convert('RGBA')
b=json.loads((o/'baseline-evidence.json').read_text())
bim=Image.open(o/'approved-base-sheet.png').convert('RGBA')
def crop(image,f):
 return image.crop((f%16*256,f//16*256,f%16*256+256,f//16*256+256))
def edges(rect):
 x,y,width,height=rect
 return [x,y,x+width,y+height]
result={'sha256':{f:hashlib.sha256((d/f).read_bytes()).hexdigest() for f in ['sheet.png','anims.json']},'alphaValues':sorted(set(im.getchannel('A').getdata())),'animations':{}}
for base,expected in b['animations'].items():
 if base=='idle':continue
 name=base+'Alt'
 if name not in a['animations']:
  result['animations'][name]={'status':'MISSING'};continue
 an=a['animations'][name]
 rows=[];frames=[]
 panel=Image.new('RGB',(1024,280*((len(an['frames'])+3)//4)),(96,96,96));dr=ImageDraw.Draw(panel)
 for i,f in enumerate(an['frames']):
  c=crop(im,f);bb=c.getbbox();hit=a.get('boxes',{}).get(str(f),{}).get('hit',[]);basehit=expected['cells'][i]['boxes'].get('hit',[]) if i<len(expected['cells']) else []
  row={'frame':i,'atlasIndex':f,'boundsExclusive':bb,'opaqueColors':len({v[:3] for v in c.getdata() if v[3]}),'alphaSha256':hashlib.sha256(c.getchannel('A').tobytes()).hexdigest(),'hit':hit,'baseHit':basehit,'activeEdgeComparisons':[]}
  if len(hit)!=len(basehit):row['contactStatus']='HOLD: hit rectangle count differs'
  elif hit:
   for h,bh in zip(hit,basehit):
    delta=[x-y for x,y in zip(edges(h),edges(bh))];row['activeEdgeComparisons'].append({'deltaXYRightBottom':delta,'within12':all(abs(v)<=12 for v in delta)})
   row['contactStatus']='PASS' if all(x['within12'] for x in row['activeEdgeComparisons']) else 'HOLD'
  else:row['contactStatus']='not active'
  rows.append(row);panel.paste(c,(i%4*256,i//4*280+24),c);dr.text((i%4*256+5,i//4*280+5),name+' f'+str(i),fill='white')
  bg=Image.new('RGBA',(256,256),(96,96,96,255));bg.alpha_composite(c);frames.append(bg.convert('RGB'))
  g=Image.new('RGB',(256,276),(96,96,96));g.paste(c,(0,20),c);gd=ImageDraw.Draw(g)
  for x in range(0,256,20):gd.line((x,20,x,276),fill=(115,115,115));gd.text((x,8),str(x),fill='white')
  for y in range(0,256,20):gd.line((0,y+20,256,y+20),fill=(115,115,115));gd.text((0,y+20),str(y),fill='white')
  g.resize((512,552),Image.Resampling.NEAREST).save(o/(name+'-f'+str(i)+'-grid.png'))
 ep=Image.new('RGB',(1024,280),(96,96,96));ed=ImageDraw.Draw(ep);epdata=[]
 for col,(label,image,frameidx) in enumerate([('base first',bim,expected['frames'][0]),('alt first',im,an['frames'][0]),('base last',bim,expected['frames'][-1]),('alt last',im,an['frames'][-1])]):
  c=crop(image,frameidx);ep.paste(c,(col*256,24),c);ed.text((col*256+5,5),label,fill='white')
 for i in [0,len(an['frames'])-1]:
  ca=crop(im,an['frames'][i]);cb=crop(bim,expected['frames'][i]);aa=ca.getchannel('A');ab=cb.getchannel('A');inter=sum(1 for x,y in zip(aa.getdata(),ab.getdata()) if x and y);union=sum(1 for x,y in zip(aa.getdata(),ab.getdata()) if x or y);epdata.append({'frame':i,'alphaIdentical':aa.tobytes()==ab.tobytes(),'alphaIoU':round(inter/union,4) if union else 1})
 panel.save(o/(name+'-contact.png'));ep.save(o/(name+'-endpoints.png'));frames[0].save(o/(name+'-sequence.gif'),save_all=True,append_images=frames[1:],duration=an['durations'],loop=1)
 result['animations'][name]={'frameCount':len(an['frames']),'expectedFrameCount':len(expected['frames']),'countMatches':len(an['frames'])==len(expected['frames']),'phases':an.get('phases'),'phasesMatch':an.get('phases')==expected.get('phases'),'durations':an['durations'],'durationsMatch':an['durations']==expected['durations'],'loop':an['loop'],'endpoints':epdata,'frames':rows}
(o/'frozen-atlas-evidence.json').write_text(json.dumps(result,indent=2))
print(json.dumps({'sha256':result['sha256'],'animations':{n:{k:v for k,v in z.items() if k!='frames'} for n,z in result['animations'].items()}},indent=2))
