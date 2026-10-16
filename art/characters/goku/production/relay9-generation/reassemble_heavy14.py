from pathlib import Path
import cv2, numpy as np, json, hashlib
root=Path('.')
src=Path('art/characters/goku/raw/_qa_hold/heavy_v12.png')
out=Path('art/characters/goku/raw/_qa_hold/heavy_v14.png')
p=cv2.imread(str(src),cv2.IMREAD_COLOR)
bg=(p[:,:,2]>200)&(p[:,:,1]<80)&(p[:,:,0]>200)
n,l,stats,c=cv2.connectedComponentsWithStats((~bg).astype(np.uint8),8)
ids=[i for i in range(1,n) if stats[i,cv2.CC_STAT_AREA]>100];ids.sort(key=lambda i:stats[i,cv2.CC_STAT_LEFT]);assert len(ids)==8
frames=[];infos=[]
for f,label in enumerate(ids):
 x,y,w,h=map(int,stats[label,:4]);mask=l[y:y+h,x:x+w]==label;crop=p[y:y+h,x:x+w];fac=.72;sw=max(1,round(w*fac));sh=max(1,round(h*fac));im=cv2.resize(crop,(sw,sh),interpolation=cv2.INTER_NEAREST);sm=cv2.resize(mask.astype(np.uint8),(sw,sh),interpolation=cv2.INTER_NEAREST).astype(bool)
 center=float(c[label][0]-x);left=round(128-round(center*fac));top=240-sh;cell=np.empty((256,256,3),np.uint8);cell[:]=[255,0,255];x0=max(0,-left);y0=max(0,-top);dx=max(0,left);dy=max(0,top);cw=max(0,min(sw-x0,256-dx));ch=max(0,min(sh-y0,256-dy));placed=np.zeros_like(sm)
 if cw and ch:
  m=sm[y0:y0+ch,x0:x0+cw];cell[dy:dy+ch,dx:dx+cw][m]=im[y0:y0+ch,x0:x0+cw][m];placed[y0:y0+ch,x0:x0+cw]=m
 frames.append(cell);infos.append({'frame':f,'sourceComponentId':int(label),'sourceComponentBoundsXYWH':[x,y,w,h],'sourceForegroundPixels':int(mask.sum()),'resampledForegroundPixels':int(sm.sum()),'resamplingPixelDelta':int(mask.sum()-sm.sum()),'scaledSize':[sw,sh],'offsetTopLeft':[top,left],'clippedForegroundPixels':int(sm.sum()-placed.sum())})
strip=np.concatenate(frames,axis=1);cv2.imwrite(str(out),strip)
meta={'schema':'goku-relay9-heavy-v14-assembly','source':str(src),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'sourceDimensions':[p.shape[1],p.shape[0]],'componentMethod':'8-connected non-magenta foreground components; pixels owned by component label','factor':.72,'factorEvidence':'Astra HEAVY_MULTIFRAME_ESTIMATOR.json: equal-weight median f0/f6/f7 visible torso/boot/belt ratios .719591, rounded .720','pivotBottomY':240,'frameCount':8,'frames':infos,'candidate':str(out),'candidateDimensions':[strip.shape[1],strip.shape[0]],'candidateSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'status':'isolated held candidate; diagnostic only; no final audit or drawing approval'}
Path('art/characters/goku/production/relay9-generation/HEAVY_V14_ASSEMBLY.json').write_text(json.dumps(meta,indent=2)+'\n')
print(meta['candidateSha256'],[(i['frame'],i['offsetTopLeft'],i['clippedForegroundPixels']) for i in infos])


