"""Read-only measurement of the immutable extracted atlas; writes audit JSON only."""
from pathlib import Path
from PIL import Image
import numpy as np
import hashlib, json, math
P = Path(__file__).resolve().parent
expected = '8a77c8ebcb6690e5afc8d6a892b5a492f9b9c83017f55c7d45ecf3a62f097876'
assert hashlib.sha256((P/'sheet.png').read_bytes()).hexdigest() == expected
meta = json.loads((P/'anims.json').read_text())
assert meta['animations']['idle']['frames'][0] == 0
assert meta['animations']['superPose']['frames'] == [110,111,112,113]
source = Image.open(P/'sheet.png').convert('RGBA')
colors = ['fa840f','e05f0d','d2530e','fa8312','c84e0e','d45816','f8781a','f98115']
want = np.array([tuple(bytes.fromhex(s)) for s in colors])
rows, cells = [], []
for cell in [0,110,111,112,113]:
    x,y = cell%16*256,cell//16*256
    im = source.crop((x,y,x+256,y+256))
    a = np.array(im).astype(int)
    cells.append(a)
    garment = (np.linalg.norm(a[:,:,:3,None]-want.T[None,None,:,:],axis=2)<=8).any(axis=2)&(a[:,:,3]>127)
    yy,xx = np.indices((256,256))
    blue = (a[:,:,0]<50)&(a[:,:,1]>25)&(a[:,:,2]>90)&(a[:,:,3]>0)&(yy>170)
    boots = []
    for half in [xx<128,xx>=128]:
        by,bx = np.where(blue&half)
        boots.append({'bboxInclusive':[int(bx.min()),int(by.min()),int(bx.max()),int(by.max())], 'width':int(bx.max()-bx.min()+1), 'height':int(by.max()-by.min()+1), 'area':int(len(bx))})
    rows.append({'cell':cell,'occupiedBBoxExclusive':im.getbbox(),'garmentArea':int(garment.sum()),'blueBootsLeftRight':boots})
for row in rows:
    row['B'] = math.sqrt(row['garmentArea']/rows[0]['garmentArea'])
transitions=[]
for n in range(4):
    a,b=cells[n+1],cells[(n+1)%4+1]
    candidates=[]
    for dy in range(-3,4):
        for dx in range(-3,4):
            shifted=np.roll(b,(dy,dx),(0,1))
            candidates.append((int(np.any(a!=shifted,axis=2).sum()),dx,dy))
    regions={}
    for name,(x0,y0,x1,y1) in {'head':(93,43,150,98),'torso':(96,98,157,133),'legs':(52,134,205,241),'leftHand':(45,25,85,55),'rightHand':(170,25,211,55)}.items():
        aa,bb=a[y0:y1,x0:x1],b[y0:y1,x0:x1]
        regions[name]={'rgbaDifferent':int(np.any(aa!=bb,axis=2).sum()),'alphaXor':int(((aa[:,:,3]>0)!=(bb[:,:,3]>0)).sum())}
    transitions.append({'from':n,'to':(n+1)%4,'rgbaDifferent':int(np.any(a!=b,axis=2).sum()),'bestGlobalRegistration_difference_dx_dy':min(candidates),'regions':regions})
result={'atlasSha256':expected,'sourceCommit':'3120d514','garmentColors':colors,'garmentRgbTolerance':8,'cells':rows,'transitions':transitions}
(P/'measurements.json').write_text(json.dumps(result,indent=2)+'\n')
print('Verified atlas SHA, metadata and measurements; wrote measurements.json')
