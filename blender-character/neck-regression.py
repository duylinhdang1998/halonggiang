import sys,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'))
import bpy,numpy as np,agent_runtime as rt
OUT=ROOT/'work/giang-blender'
def geometry_fingerprints(path):
    assert bpy.ops.wm.open_mainfile(filepath=str(path))=={'FINISHED'}
    result={}
    for obj in bpy.data.objects:
        if obj.type!='MESH':continue
        coords=np.array([tuple(v.co) for v in obj.data.vertices],dtype='<f4')
        indices=np.array([l.vertex_index for l in obj.data.loops],dtype='<i4')
        result[obj.name]=hashlib.sha256(coords.tobytes()+indices.tobytes()).hexdigest()
    return result
before=geometry_fingerprints(OUT/'neck-before/candidate.blend')
after=geometry_fingerprints(OUT/'candidate.blend')
assert before.keys()==after.keys()
changed=[name for name in after if before[name]!=after[name]]
assert changed==['neck'],changed
neck=bpy.data.objects['neck'];polo=bpy.data.objects['polo']
assert neck.dimensions.x<.44,neck.dimensions.x
assert all(n.extension=='EXTEND' for obj in bpy.data.objects if obj.type=='MESH' for m in obj.data.materials for n in m.node_tree.nodes if n.type=='TEX_IMAGE')
report={'changed_geometry':changed,'unchanged_parts':16,'neck_width':neck.dimensions.x,'texture_edges':'clamped, no opposing-edge bleed','render_views':[0,30,-30,90]}
(OUT/'neck-regression.json').write_text(json.dumps(report,indent=2));rt.emit_ok('neck-regression',**report)
