import sys,json,struct,hashlib
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'))
import bpy,bmesh,agent_runtime as rt
from mathutils import Vector
OUT=ROOT/'work/giang-blender';glb=ROOT/'app/public/models/giang-blender.glb'
raw=glb.read_bytes();length,kind=struct.unpack_from('<II',raw,12);doc=json.loads(raw[20:20+length])
assert len(doc['meshes'])==17
assert all('uri' not in entry for entry in doc.get('images',[])), 'Images must be embedded'
for obj in list(bpy.data.objects):bpy.data.objects.remove(obj,do_unlink=True)
assert bpy.ops.import_scene.gltf(filepath=str(glb))=={'FINISHED'}
meshes=[o for o in bpy.data.objects if o.type=='MESH'];assert len(meshes)==17
bpy.context.view_layer.update();pts=[o.matrix_world@Vector(v) for o in meshes for v in o.bound_box]
height=max(v.z for v in pts)-min(v.z for v in pts);assert abs(height-5.6)<.01,height
tris=0
for obj in meshes:
    obj.data.calc_loop_triangles();tris+=len(obj.data.loop_triangles)
    assert len(obj.data.uv_layers)==1 and len(obj.data.materials)==1,obj.name
    assert len(obj.data.vertices)>100
assert 100000<tris<200000
report={'runtime':bpy.app.version_string,'meshes':len(meshes),'height':height,'triangles':tris,'embedded_images':len(doc['images']),'sha256':hashlib.sha256(raw).hexdigest(),'source':'Blender-native lofts with baked reference UV maps','hidden_views':'inferred','visual_acceptance':'trial, not owner approved'}
(OUT/'export-verification.json').write_text(json.dumps(report,indent=2));rt.emit_ok('round-trip',**report)
