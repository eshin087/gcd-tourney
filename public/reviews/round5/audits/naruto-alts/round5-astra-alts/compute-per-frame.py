from pathlib import Path
from PIL import Image, ImageDraw
import json, math, hashlib
w=Path.cwd();o=w/'art/characters/naruto/production/round5/astra-alts';D=json.loads((o/'per-frame-landmarks-source.json').read_text());a=json.loads((w/'public/characters/naruto/anims.json').read_text());im=Image.open(w/'public/characters/naruto/sheet.png').convert('RGBA');old=json.loads((o/'measurements.json').read_text());unc=old['uncertaintyPx'];ref=old['referencesAndSamples']['idle:0']['projectedPx'];out={'atlasSha256':hashlib.sha256((w/'public/characters/naruto/sheet.png').read_bytes()).hexdigest(),'method':'Independent manual readings of every actual quantized frame on a fixed 20px grid at 2x nearest-neighbor. Each record selects a visible arm and leg; anatomical side is not inferred. All coordinates native cell x/y. Garment-covered joints estimated conservatively, not exact bones. H skull is an estimate under hair. N/A means a required endpoint is hidden. Projected measurements do not certify intrinsic lengths under rotation/depth.','uncertaintyPx':unc,'numericTolerance':0.06,'frames':{},'coverage':{}}
counts={k:0 for k in ref};total=0;md=['# Complete frame-by-frame landmark annotation','',out['method'],'','**Coverage:** all 59 frames. This supersedes the earlier representative-only measurement limitation; it does not turn uncertain projections into passes. For each frame, the selected arm/leg side and exact endpoint coordinates are in the JSON; the same points are drawn on `*-landmarks.png`.','', 'Hh = hair crown to chin; Hs = estimated skull crown under hair to chin; T = collar to black jacket hem. UA/FA = selected upper arm/forearm; Th/Sh = selected thigh/shin; S = visible heel-to-toe. Native px. Hh/Hs/S uncertainty +/-4; T/UA/FA +/-6; Th/Sh +/-7, plus depth uncertainty. Every decimal is Euclidean arithmetic on approximate integer points, not subpixel precision.','', 'A measured projected number is not a strict intrinsic-length pass. A guarded upper arm and a straight punch cannot be judged equal by dividing their screen lengths; for that case the ratio is explicitly only a projection delta. Hidden far-side joints/foreshortening reasons are retained individually.']
colors={'H_hair':(255,100,100),'H_skullEstimate':(255,180,40),'T':(50,230,255),'upperArm':(230,100,255),'forearm':(230,100,255),'thigh':(80,255,110),'shin':(80,255,110),'S':(255,245,70)}
for n,rows in D.items():
 assert len(rows)==len(a['animations'][n]['frames']);assert [r['frame'] for r in rows]==list(range(len(rows)))
 out['frames'][n]=[];md+=['',f'## {n}','', '| f | Hh | Hs | T | UA | FA | Th | Sh | S |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|']
 panel=Image.new('RGB',(1024,280*((len(rows)+3)//4)),(80,80,80));pd=ImageDraw.Draw(panel)
 for row in rows:
  i=row['frame'];p=row['landmarks'];arm=p['armShoulderElbowWrist'];leg=p['legHipKneeAnkle'];shoe=p['shoeHeelToe'];pairs={'H_hair':[p['hairCrown'],p['chin']],'H_skullEstimate':[p['estimatedSkullCrown'],p['chin']],'T':[p['collar'],p['jacketHem']],'upperArm':arm[:2],'forearm':arm[1:],'thigh':leg[:2],'shin':leg[1:],'S':shoe};metrics={}
  f=a['animations'][n]['frames'][i];x=f%16*256;y=f//16*256;c=im.crop((x,y,x+256,y+256));cx=i%4*256;cy=i//4*280+24;panel.paste(c,(cx,cy),c);pd.text((cx+3,cy-20),n+' f'+str(i),fill='white')
  for key,pair in pairs.items():
   if pair is None or any(z is None for z in pair):
    reason=row['shoeExclusion'] if key=='S' else 'Hip/upper thigh hidden behind crossed raised thigh in f4; no independent hip endpoint.'
    metrics[key]={'valuePx':None,'status':'N/A','reason':reason};continue
   value=round(math.dist(*pair),1);u=unc[key];r=ref[key];ratio=[round((value-u)/(r+u),3),round((value+u)/(r-u),3)];metrics[key]={'endpoints':pair,'valuePx':value,'uncertaintyPx':u,'status':'MEASURED_PROJECTED','idleProjectedValuePx':r,'projectedRatioIntervalToIdle':ratio,'intrinsicPlusMinus6Status':'UNRESOLVED: landmark interval and/or pose projection; not a numerical pass'};counts[key]+=1
   points=[(cx+pt[0],cy+pt[1]) for pt in pair];pd.line(points,fill=colors[key],width=1)
   for xx,yy in points:pd.ellipse((xx-1,yy-1,xx+1,yy+1),fill=colors[key])
  extra=row.get('additionalVisibleForearm')
  if extra:extra['projectedPx']=round(math.dist(*extra['elbowWrist']),1)
  z=dict(row);z['metrics']=metrics;z['atlasIndex']=f;z['referenceMethod']='Same fixed native density as approved neutral/combat and packed idle; no per-pose normalization.';out['frames'][n].append(z);md.append('| '+str(i)+' | '+' | '.join(str(metrics[k]['valuePx']) if metrics[k]['valuePx'] is not None else 'N/A' for k in ref)+' |');total+=1
 panel.save(o/f'{n}-landmarks.png')
 md+=['', '**Frame-specific exclusions / selected chains:**','']
 for row in rows:
  md.append(f"- f{row['frame']}: arm = {row['selectedArm']}; leg = {row['selectedLeg']}. {row['frameSpecificExclusions']}"+(f" Shoe N/A: {row['shoeExclusion']}" if row['shoeExclusion'] else ''))
  if row.get('additionalVisibleForearm'):md.append('  Additional visible far forearm: '+json.dumps(row['additionalVisibleForearm']))
assert total==59
out['coverage']={'totalFrames':total,'frameRows':total,'measuredProjectedMetricCounts':counts,'notMeasuredCounts':{k:total-v for k,v in counts.items()},'allFramesHaveSpecificExclusionText':all(bool(r['frameSpecificExclusions']) for rows in D.values() for r in rows),'unresolvedIntrinsicComparisons':'All metrics remain subject to documented landmark and depth uncertainty; no blanket all-frame +/-6% pass asserted.'}
md+=['','## Coverage counts','',json.dumps(out['coverage'],indent=2),'','Overlay colors: red hair envelope; orange skull estimate; cyan torso; purple upper/lower arm; green thigh/shin; yellow shoe. Overlapping endpoints remain distinguishable in the native-coordinate JSON.']
(o/'per-frame-measurements.json').write_text(json.dumps(out,indent=2)+'\n');(o/'PER-FRAME-MEASUREMENTS.md').write_text('\n'.join(md)+'\n');print(json.dumps(out['coverage'],indent=2))
