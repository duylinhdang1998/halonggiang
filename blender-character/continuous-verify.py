import sys,json,struct,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'))
import bpy,bmesh,agent_runtime as rt
from mathutils import Vector
OUT=ROOT/'work/giang-blender';glb=ROOT/'app/public/models/giang-continuous.glb'
raw=glb.read_bytes();length=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+length])
assert len(doc['meshes'])==15 and len(doc['images'])==15
assert all('uri' not in item for item in doc['images'])
for obj in list(bpy.data.objects):bpy.data.objects.remove(obj,do_unlink=True)
assert bpy.ops.import_scene.gltf(filepath=str(glb))=={'FINISHED'}
upper=bpy.data.objects['HeadNeckTorso'];assert upper.get('continuous_upper_body')
# UV island duplicates must coincide geometrically after the GLB round trip.
# Weld only exact seam duplicates on an audit copy, not the delivered mesh.
bm=bmesh.new();bm.from_mesh(upper.data)
bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.000001)
unseen=set(bm.verts);parts=0
while unseen:
    parts+=1;todo=[unseen.pop()]
    while todo:
        v=todo.pop()
        for e in v.link_edges:
            other=e.other_vert(v)
            if other in unseen:unseen.remove(other);todo.append(other)
assert parts==1,parts
bad=sum(not e.is_manifold for e in bm.edges);assert bad==0,bad
bm.free();meshes=[o for o in bpy.data.objects if o.type=='MESH'];assert len(meshes)==15
bpy.context.view_layer.update();points=[o.matrix_world@Vector(v) for o in meshes for v in o.bound_box]
height=max(v.z for v in points)-min(v.z for v in points);assert abs(height-5.6)<.001
report={'meshes':15,'embedded_images':15,'upper_components':parts,'nonmanifold_edges':bad,'height':height,'sha256':hashlib.sha256(raw).hexdigest()}
(OUT/'continuous-roundtrip.json').write_text(json.dumps(report,indent=2));rt.emit_ok('continuous-roundtrip',**report)
