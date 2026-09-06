import sys,json,math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'));sys.path.insert(0,str(Path(__file__).parent))
import bpy,numpy as np,agent_runtime as rt
from profiles import PARTS
from surfaces import interp
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'work/giang-blender/candidate.blend'))
report={}
for name in ['neck','polo']:
    rows=next(p[1] for p in PARTS if p[0]==name)
    img=next(n.image for n in bpy.data.objects[name].data.materials[0].node_tree.nodes if n.type=='TEX_IMAGE')
    pix=np.asarray(img.pixels[:]).reshape(img.size[1],img.size[0],4)
    values=[]
    for t in [315,318,319,320,323]:
        l,r,d=interp(rows,np.array(t));s=(190-(l+r)/2)/((r-l)/2);u=(math.asin(np.clip(s,-1,1))+math.pi)/(2*math.pi);v=(rows[-1][0]-t)/(rows[-1][0]-rows[0][0])
        values.append([t,*pix[int(np.clip(v,0,1)*(img.size[1]-1)),int(u*(img.size[0]-1)),:3]])
    report[name]=values
rt.emit_ok('neck-colors',values=report)
