from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
import json,hashlib,math,copy
root=Path.cwd();o=Path(__file__).parent;prior=Path('art/characters/naruto/production/round5/astra-alts')
a=json.loads(Path('public/characters/naruto/anims.json').read_text());sheet=Image.open('public/characters/naruto/sheet.png').convert('RGBA')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def cell(name,f):
 i=a['animations'][name]['frames'][f];return sheet.crop((i%16*256,i//16*256,i%16*256+256,i//16*256+256))
old=json.loads((prior/'per-frame-measurements.json').read_text());rows=copy.deepcopy(old['frames']['light2Alt'])
rows[2]['landmarks']={'hairCrown':[137,64],'estimatedSkullCrown':[137,80],'chin':[136,105],'collar':[133,107],'jacketHem':[146,147],'armShoulderElbowWrist':[[118,113],[108,131],[129,115]],'legHipKneeAnkle':[[141,155],[179,129],[214,124]],'shoeHeelToe':[[220,124],[248,124]]}
rows[3]['landmarks']={'hairCrown':[134,65],'estimatedSkullCrown':[134,81],'chin':[133,104],'collar':[132,107],'jacketHem':[144,147],'armShoulderElbowWrist':[[117,113],[108,131],[128,115]],'legHipKneeAnkle':[[140,156],[173,132],[200,124]],'shoeHeelToe':[[204,124],[228,125]]}
unc=old['uncertaintyPx'];refs={k:v for k,v in json.loads((prior/'measurements.json').read_text())['referencesAndSamples'].items() if k in ['neutral','combat','idle:0']};out=Image.new('RGB',(1024,560),'#cccccc');draw=ImageDraw.Draw(out);table=[]
for row in rows:
 f=row['frame'];l=row['landmarks'];arm=l['armShoulderElbowWrist'];leg=l['legHipKneeAnkle'];pairs={'H_hair':[l['hairCrown'],l['chin']],'H_skullEstimate':[l['estimatedSkullCrown'],l['chin']],'T':[l['collar'],l['jacketHem']],'upperArm':arm[:2],'forearm':arm[1:],'thigh':leg[:2],'shin':leg[1:],'S':l['shoeHeelToe']};row['metrics']={}
 row['readingProvenance']='Fresh f2/f3 annotation' if f in [2,3] else 'Prior endpoint coordinates rechecked visually; exact occupancy mask unchanged'
 for k,pair in pairs.items():row['metrics'][k]={'endpoints':pair,'valuePx':round(math.dist(*pair),1) if pair else None,'uncertaintyPx':unc[k],'status':'MEASURED_PROJECTED' if pair else 'OCCLUDED','intrinsicPlusMinus6Status':'UNRESOLVED: landmark uncertainty and depth'}
 if f in [2,3]:
  row['selectedArm']='screen-left guarding arm';row['selectedLeg']='screen-right striking leg';row['frameSpecificExclusions']='Striking knee/hip under orange fabric are approximate; far hip/upper arm concealed. Supporting leg visually intact but overlaps hip cloth. No depth correction or intrinsic-length claim.';row['shoeExclusion']='S is the visible horizontal foot envelope; heel is estimated beneath ankle wrap.'
 x=f%4*256;y=f//4*280+24;c=cell('light2Alt',f);out.paste(c,(x,y),c);draw.text((x+4,y-20),'v04 f'+str(f),fill='black')
 for k,pair in pairs.items():
  if pair:draw.line([(x+px,y+py) for px,py in pair],fill={'H_hair':'red','H_skullEstimate':'orange','T':'cyan','upperArm':'purple','forearm':'purple','thigh':'green','shin':'green','S':'yellow'}[k],width=1)
 table.append('| '+str(f)+' | '+' | '.join(str(row['metrics'][k]['valuePx']) if row['metrics'][k]['valuePx'] is not None else 'N/A' for k in pairs)+' |')
out.save(o/'landmarks.png')
raw3=Path('art/characters/naruto/raw/light2Alt_v03.png');raw4=Path('art/characters/naruto/raw/light2Alt_v04.png');oldpanel=Image.open(prior/'light2Alt.png').convert('RGB');e=[]
for f,i in enumerate(a['animations']['light2Alt']['frames']):
 c=cell('light2Alt',f);oc=oldpanel.crop((f%4*256,f//4*280+24,f%4*256+256,f//4*280+280));om=bytes(255 if p!=(90,90,90) else 0 for p in oc.getdata());maskdiff=sum((v>0)!=(w>0) for v,w in zip(om,c.getchannel('A').tobytes()));e.append({'frame':f,'atlasIndex':i,'rgbaSha256':hashlib.sha256(c.tobytes()).hexdigest(),'bounds':c.getbbox(),'occupancyDifferencePixelsVsV03':maskdiff,'boxesEqualBase':a['boxes'][str(i)]==a['boxes'][str(a['animations']['light2']['frames'][f])]})
contact=[];overlay=Image.new('RGB',(1024,280),'#cccccc');d=ImageDraw.Draw(overlay)
for j,f in enumerate([2,3]):
 hit=a['boxes'][str(a['animations']['light2Alt']['frames'][f])]['hit'][0];foot=[220,116,249,132] if f==2 else [204,117,229,132];delta=[(foot[0]+foot[2])/2-hit[0]-hit[2]/2,(foot[1]+foot[3])/2-hit[1]-hit[3]/2];contact.append({'frame':f,'hitRectXYWH':hit,'footExtentXYXY':foot,'centerDeltaPx':delta,'footLandmarkUncertaintyPx':3,'verticalOverlapPx':max(0,min(foot[3],hit[1]+hit[3])-max(foot[1],hit[1]))})
 for n,key in enumerate(['light2','light2Alt']):
  x=(j*2+n)*256;c=cell(key,f);overlay.paste(c,(x,24),c);d.text((x+3,4),key+' f'+str(f),fill='black');d.rectangle((x+hit[0],24+hit[1],x+hit[0]+hit[2],24+hit[1]+hit[3]),outline='green',width=1)
  if n:d.rectangle((x+foot[0],24+foot[1],x+foot[2],24+foot[3]),outline='red',width=1)
overlay.save(o/'contact.png')
provenance={'sourceCommit':'b8d800bdd676045730f4077d41bb41365a2bbbd3','hashes':{str(p):sha(p) for p in [Path('public/characters/naruto/sheet.png'),Path('public/characters/naruto/anims.json'),raw3,raw4,raw4.with_suffix('.json'),Path('art/characters/naruto/raw/light2Alt_02-03_fix01.png'),Path('public/art-review/title-style-pilot/naruto-neutral_v01.png'),Path('public/art-review/title-style-pilot/naruto-combat_v01.png')]},'sidecarByteEqualV03':raw3.with_suffix('.json').read_bytes()==raw4.with_suffix('.json').read_bytes(),'rawDifferenceBounds':ImageChops.difference(Image.open(raw3).convert('RGB'),Image.open(raw4).convert('RGB')).getbbox(),'packedVersionMetadata':a['scaleAudit']['anims']['light2Alt'],'frames':e}
(o/'evidence.json').write_text(json.dumps(provenance,indent=2)+'\n')
(o/'measurements.json').write_text(json.dumps({'method':old['method'],'uncertaintyPx':unc,'references':refs,'frames':rows,'contact':contact},indent=2)+'\n')
(o/'MEASUREMENTS.md').write_text('# light2Alt v04 projected measurements\n\nAll units native cell pixels. H includes hair; skull is separately estimated. Torso = collar to black jacket hem. Endpoint coordinates, selected limbs, exclusions and uncertainty are in measurements.json. Unchanged-frame annotations were visually rechecked against identical occupancy masks; f2/f3 were newly annotated. Projected lengths do not establish intrinsic lengths to +/-6%.\n\n| f | H hair | H skull | T | UA | FA | thigh | shin | shoe |\n|---|---|---|---|---|---|---|---|---|\n'+'\n'.join(table)+'\n\nUncertainty: H/skull/shoe +/-4px, T/UA/FA +/-6px, thigh/shin +/-7px, before depth uncertainty. f1/f4 shoe N/A: turned foot hides heel. Other-side limbs and shoulder width excluded where overlapping or at unequal depth. Neutral is the upright visual reference; combat and idle are the bent-pose references. No standing-height normalization.\n')
(o/'verdict.json').write_text(json.dumps({'asset':'naruto/light2Alt','version':4,'decision':'HOLD','contactResolved':False,'verticalImprovementEstablished':False,'horizontalImprovement':'f3 retracts about 6.5px more than v03; f2 change about 1px within reading uncertainty','fullAnatomyNumericPass':False,'qualitativeAnatomy':'No newly demonstrated gross limb defect or whole-body scale pop; exact intrinsic +/-6% unproven','allSevenFramesAndSixAdjacentTransitionsInspected':True,'repeatBoundary':'f6 to f0 inspected; non-loop gameplay animation, preview repeat only','approval':'needs review; no user approval','contact':contact},indent=2)+'\n')
print('audit evidence written')
