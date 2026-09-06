import sys,math,json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(Path(__file__).parent));sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'))
import bpy,agent_runtime as rt
from mathutils import Vector
from continuous_geometry import connected_report
OUT=ROOT/'work/giang-blender';PUBLIC=ROOT/'app/public/models'
assert bpy.ops.wm.open_mainfile(filepath=str(OUT/'continuous.blend'))=={'FINISHED'}
objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];assert len(objects)==15
upper=bpy.data.objects['HeadNeckTorso'];report=connected_report(upper);assert report['components']==1 and report['nonmanifold_edges']==0
lib=rt.load_lib(str(ROOT/'work/design-os-3d-blender/scripts/agent-verify-lib.py'))
triangles=sum(lib.tri_count(o) for o in objects);assert triangles<250000,triangles
for obj in bpy.context.scene.objects:obj.select_set(obj in objects)
glb=PUBLIC/'giang-continuous.glb'
assert bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_apply=True,export_animations=False,export_extras=True)=={'FINISHED'}
scene=bpy.context.scene;cam=scene.camera
scene.render.filepath=str(OUT/'continuous-full.png');assert bpy.ops.render.render(write_still=True)=={'FINISHED'}
cam.data.ortho_scale=2.3;scene.render.resolution_x=720;scene.render.resolution_y=720
focus=Vector((-.12,0,4.38));cam.location=focus+Vector((6,-10.392,0));cam.rotation_euler=(focus-cam.location).to_track_quat('-Z','Y').to_euler()
clay=bpy.data.materials.new('ContinuousGeometryDiagnostic');bsdf=clay.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=(.32,.36,.40,1)
upper.data.materials.clear();upper.data.materials.append(clay)
for name,loc,power in [('Key',(-4,-6,8),400),('Fill',(4,-2,5),160),('Rim',(1,4,7),400)]:
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.size=4
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=(focus-obj.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath=str(OUT/'continuous-clay.png');assert bpy.ops.render.render(write_still=True)=={'FINISHED'}
report.update(meshes=15,triangles=triangles,bytes=glb.stat().st_size,sha256=hashlib.sha256(glb.read_bytes()).hexdigest())
(OUT/'continuous-delivery.json').write_text(json.dumps(report,indent=2));rt.emit_ok('continuous-delivery',**report)
