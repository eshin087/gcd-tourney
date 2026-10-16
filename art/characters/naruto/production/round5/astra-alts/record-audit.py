from pathlib import Path
from PIL import Image,ImageDraw
import json,math,hashlib
w=Path.cwd();o=w/'art/characters/naruto/production/round5/astra-alts';ev=json.loads((o/'atlas-evidence.json').read_text())
# Manually read native-cell landmarks, independently from the displayed final atlas grids.
# The points are projected garment/joint estimates, not inferred hidden anatomy.
pts={
'neutral':{'hair':(132,39),'skull':(132,53),'chin':(134,75),'collar':(131,79),'hem':(134,128),'arm':[(112,86),(101,117),(96,144)],'leg':[(138,147),(146,181),(151,227)],'shoe':[(146,235),(174,235)]},
'combat':{'hair':(142,77),'skull':(141,91),'chin':(139,113),'collar':(137,116),'hem':(131,154),'arm':[(118,124),(102,138),(120,128)],'leg':[(139,169),(172,191),(181,228)],'shoe':[(176,236),(202,236)]},
'idle:0':{'hair':(140,76),'skull':(140,91),'chin':(139,114),'collar':(138,117),'hem':(133,153),'arm':[(118,125),(104,140),(122,129)],'leg':[(140,169),(168,188),(175,226)],'shoe':[(170,235),(199,235)]},
'airLight1Alt:0':{'hair':(176,49),'skull':(176,66),'chin':(174,91),'collar':(171,94),'hem':(164,134),'arm':[(148,101),(140,118),(157,108)],'leg':[(157,156),(143,186),(125,226)],'shoe':None},
'airLight2Alt:1':{'hair':(135,65),'skull':(134,80),'chin':(132,102),'collar':(130,105),'hem':(130,144),'arm':[(114,113),(91,129),(70,138)],'leg':[(133,153),(172,147),(215,144)],'shoe':[(221,146),(243,139)]},
'airLight3Alt:2':{'hair':(124,85),'skull':(124,98),'chin':(125,125),'collar':(120,126),'hem':(134,165),'arm':[(97,137),(80,157),(66,175)],'leg':[(132,172),(173,160),(219,152)],'shoe':[(224,155),(234,135)]},
'heavyAlt:3':{'hair':(122,66),'skull':(121,81),'chin':(124,102),'collar':(121,106),'hem':(118,146),'arm':[(102,115),(85,142),(75,159)],'leg':[(132,150),(143,109),(151,73)],'shoe':[(160,65),(147,48)]},
'hurtHighAlt:2':{'hair':(104,66),'skull':(106,80),'chin':(114,102),'collar':(112,105),'hem':(133,144),'arm':[(96,114),(82,133),(106,139)],'leg':[(138,159),(158,181),(164,223)],'shoe':[(157,235),(189,235)]},
'hurtLowAlt:0':{'hair':(170,86),'skull':(170,100),'chin':(168,127),'collar':(153,126),'hem':(127,153),'arm':[(131,125),(116,144),(137,151)],'leg':[(135,168),(160,186),(162,225)],'shoe':[(155,235),(188,235)]},
'light1Alt:0':{'hair':(138,74),'skull':(137,89),'chin':(137,115),'collar':(134,117),'hem':(130,152),'arm':[(115,126),(101,139),(119,130)],'leg':[(139,170),(166,188),(174,225)],'shoe':[(170,235),(199,235)]},
'light2Alt:2':{'hair':(135,65),'skull':(135,78),'chin':(134,103),'collar':(133,106),'hem':(146,146),'arm':[(119,114),(110,130),(128,114)],'leg':[(143,155),(179,133),(213,124)],'shoe':[(222,124),(250,125)]},
'light3Alt:2':{'hair':(143,74),'skull':(141,88),'chin':(140,114),'collar':(139,117),'hem':(136,150),'arm':[(118,127),(111,142),(129,132)],'leg':[(140,158),(178,150),(219,143)],'shoe':[(229,147),(245,123)]},
'light4Alt:3':{'hair':(153,67),'skull':(153,81),'chin':(153,107),'collar':(148,109),'hem':(131,149),'arm':[(134,120),(163,122),(184,123)],'leg':[(147,167),(182,179),(188,225)],'shoe':[(185,235),(214,235)]}}
segments={}
for key,p in pts.items():
 D=lambda a,b:round(math.dist(a,b),1)
 segments[key]={'landmarks':p,'projectedPx':{'H_hair':D(p['hair'],p['chin']),'H_skullEstimate':D(p['skull'],p['chin']),'T':D(p['collar'],p['hem']),'upperArm':D(*p['arm'][:2]),'forearm':D(*p['arm'][1:]),'thigh':D(*p['leg'][:2]),'shin':D(*p['leg'][1:]),'S':D(*p['shoe']) if p['shoe'] else None},'shoulderWidth':None,'shoulderExclusion':'Oblique shoulders; deltoid landmarks/axial depth are not both exposed. Not a numeric pass.'}
 for kind in ['upperArm','forearm','thigh','shin']:
  segments[key].setdefault('exclusions',[]).append(kind+': projected estimate; hidden joint and depth uncertainty prevents a strict intrinsic-length comparison.')
# Every frame was inspected in the strip sheets and endpoint panels. Numeric representative samples are identified explicitly.
notes={
'airLight1Alt':['Guard, raised knee; far limbs overlap.','Straight punch; near arm lengthens in projection as expected.','Held extended punch, no detached wrist.','Retracts to guard without head jump.','Guard recovery; last-to-first near pose match.'],
'airLight2Alt':['Knee chamber, compact guard.','Side kick; supporting thigh bent, striking knee under cloth.','Extended kick, stable head and torso; toe remains inside margin.','Knee retracts and both forearms converge; joints occluded.','Returns to chamber; last-to-first small stance change.'],
'airLight3Alt':['Knee chamber, shorter silhouette than base; not scaled to standing.','Open arms/hips, no base back-spin pose.','Extended kick with crescent; exclude effect from body.','Extended kick without crescent, head/torso stable to f2.','Retracts and opens rear hand; no lost limb.','Guarded recovery, bent support leg; endpoint differs from base.'],
'heavyAlt':['Low preload; garment compression expected.','Deeper preload, head lowered with torso.','Knee lift; rising torso, no global head jump.','High kick, head tipped back; striking knee not clearly localized.','High kick hold, hip fold and raised sandal rotate.','Retracts into airborne guard with raised fist; no scaled-down part B.','Landing turn, rear arm spread; projected shoulder width changes.','Guard recovery; last-to-first bends into startup.'],
'hurtHighAlt':['Back lean/open arms; head rolls back.','Open-arm hit hold; far forearm occluded.','Guarded recovery; head angle differs from base, not a proven size jump.'],
'hurtLowAlt':['Forward fold, both hands at abdomen.','One arm thrown behind; near sleeve overlaps waist.','Re-folds with hands at abdomen; last-to-first modest head rise.'],
'light1Alt':['Guard startup, feet wider than base.','Guard/shoulder load.','Straight extended punch rather than compact hook.','Extended punch held, guard fist overlaps face.','Cross-body withdrawal; arms obscure torso.','Guard recovery.','Guard end; last-to-first close but not pixel-identical.'],
'light2Alt':['Guard startup; base rear-fist load absent.','Knee lift, near leg folded.','Snap kick; foot lower/further than base fist.','Kick held; foot retracts horizontally while same low height remains.','Knee retraction, body near vertical.','Guard recovery.','Guard endpoint; slightly different stance/head tilt from base.'],
'light3Alt':['Grounded guard differs from base knee-chamber start.','Knee lift, forearms guarding.','Side kick reaches mid torso; shoe intact at margin.','Held kick; no obvious head/torso pop.','Chamber crosses body, opposite support configuration; large pose reset from f3.','Wide guard recovery.','Guard end; last-to-first similar, base remains more upright.'],
'light4Alt':['Guard startup.','Both palms raised, shoulders opening.','Double-palm extension, no lost fingers/forearms.','Full lunge, arms extended; torso lean lengthens projected hem distance.','Lower follow-through, palms still extended.','Rear step; one sandal oblique and largely edge-on.','Guard recovery.','Guard endpoint; last-to-first small chest/head-height shift.']}
vers={'heavyAlt':2,'light2Alt':3,'light3Alt':2}
res={'method':'Fresh manual native-cell representative landmarks on exact final quantized pixels; all 59 frames visually inspected. Numeric samples do NOT stand in for all-frame numeric clearance. H_hair includes hair; H_skullEstimate estimates skull under hair and is low confidence. T consistently collar to black jacket hem, not to crotch/trouser folds. Segment coordinates are projected, not depth corrected.','uncertaintyPx':{'H_hair':4,'H_skullEstimate':4,'T':6,'upperArm':6,'forearm':6,'thigh':7,'shin':7,'S':4},'comparisonTolerance':0.06,'numericFullContractPass':False,'referencesAndSamples':segments,'perFrame':{}}
for n,ns in notes.items():
 res['perFrame'][n]=[{'frame':i,'visualInspection':s,'anatomyComponentsInspected':['head','torso','upper/lower arms','upper/lower legs','shoes','build/clothing'],'sampleKey':f'{n}:{i}' if f'{n}:{i}' in segments else None,'numericStatus':'UNRESOLVED: no all-segment +/-6% certificate; see projection/occlusion exclusions'} for i,s in enumerate(ns)]
(o/'measurements.json').write_text(json.dumps(res,indent=2)+'\n')
# Explicit interval arithmetic for comparable sample projections versus the provisional packed idle; it is not an anatomy pass.
ref=segments['idle:0']['projectedPx'];lines=['# Fresh projected landmark samples','',res['method'],'','Uncertainty: hair/skull head +/-4 px; torso +/-6; each arm segment +/-6; each leg segment +/-7; shoe +/-4. These bounds exceed many 6% tolerances. Hidden depth is additional and unbounded.','', '| Sample | H hair | H skull estimate | T | upper arm | forearm | thigh | shin | shoe |','|---|---:|---:|---:|---:|---:|---:|---:|---:|']
for k,v in segments.items():lines.append('| '+k+' | '+' | '.join(str(v['projectedPx'][x]) for x in ['H_hair','H_skullEstimate','T','upperArm','forearm','thigh','shin','S'])+' |')
lines+=['','## Every frame and adjacent transition','', 'Read each animation in order. Its final entry also covers the last-to-first preview wrap. All ten metadata entries have loop=false; a preview repeat is not a gameplay loop.']
for n,ns in notes.items():
 lines+=['',f'### {n}', '']+[f'- f{i}: {s}' for i,s in enumerate(ns)]
(o/'MEASUREMENTS.md').write_text('\n'.join(lines)+'\n')
summary={
'airLight1Alt':'No new visible scale pop; punch remains close to base technique. Full limb/foot +/-6% unresolved under foreshortening.',
'airLight2Alt':'No new visible scale pop; kick and chamber remain close to base. Bent/occluded limb +/-6% unresolved.',
'airLight3Alt':'Calibrated kick is intact; start/end poses and spin differ from base. Full projected limb/foot +/-6% unresolved.',
'heavyAlt':'High-kick parts show no clear head-size jump; rear tipped head is a probe limitation. Full limb +/-6% unresolved.',
'hurtHighAlt':'Reaction is intact and broadly follows base; tilted head and projected sandals cannot certify strict +/-6%.',
'hurtLowAlt':'Folded reaction is intact; near hands/waist and bent knees prevent full +/-6% certification.',
'light1Alt':'Active art reads a straight punch rather than a compact hook; endpoint stance differs. Full anatomy +/-6% unresolved.',
'light2Alt':'Confirmed drawn-foot contact residual: about 27-28 px below base hit center; f2 toe about 31 px beyond drawn fist. Anatomy precision separately unresolved.',
'light3Alt':'Kick contact is now mid-height and intact; f3 to f4 chamber is a large pose reset, startup differs from base. Full anatomy +/-6% unresolved.',
'light4Alt':'Distinct double-palm move; no new visible global scale pop, recovery differs from base. Full anatomy +/-6% unresolved.'}
ver=[{'animation':n,'version':vers.get(n,1),'verdict':'HOLD','summary':summary[n],'evidence':'AUDIT.md','anatomyStatus':'UNRESOLVED_MEASUREMENT','contactStatus':'HOLD_DRAWN_OFFSET' if n=='light2Alt' else 'BASE_BOXES_VERIFIED_NO_NEW_CONFIRMED_OFFSET','visualScaleStatus':'NO_CONFIRMED_NEW_GLOBAL_POP','approval':'needs review'} for n in notes]
(o/'verdicts.json').write_text(json.dumps(ver,indent=2)+'\n')
# Provenance bound to selected raw inputs; held fallback inventory is explicit.
pro={'sourceCommit':'357951e','atlas':{k:ev[k] for k in ['sheetSha256','animsSha256']},'raw':{},'heldAirHeavyAlt':[]}
for n in notes:
 f=w/f'art/characters/naruto/raw/{n}_v{vers.get(n,1):02}.png';pro['raw'][n]={'path':str(f.relative_to(w)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()}
for f in sorted((w/'art/characters/naruto/raw/_qa_hold').glob('airHeavyAlt*')):pro['heldAirHeavyAlt'].append({'path':str(f.relative_to(w)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
(o/'provenance.json').write_text(json.dumps(pro,indent=2)+'\n')
print('wrote audit data',sum(len(x) for x in notes.values()),'frames')
