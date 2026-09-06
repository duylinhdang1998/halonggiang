import sys, math, json
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
sys.path.insert(0,str(HERE));sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'))
import bpy, agent_runtime as rt
from mathutils import Vector
from profiles import PARTS
from surfaces import loft, OUT
assert bpy.app.version >= (5,2,0), bpy.app.version
OUT.mkdir(parents=True,exist_ok=True)
# This pass runs in factory startup, leaving the existing website and saved scenes intact.
for o in list(bpy.data.objects):bpy.data.objects.remove(o,do_unlink=True)
objects=[loft(*part) for part in PARTS]
assert len(objects)==17 and all(len(o.data.polygons)>100 for o in objects)
scene=bpy.context.scene;scene['workflow']='design-os-3d-blender/native-reference';scene['runtime']=bpy.app.version_string
scene.render.engine='CYCLES';scene.cycles.samples=8;scene.cycles.use_denoising=True
scene.view_settings.view_transform='Standard';scene.render.resolution_x=606;scene.render.resolution_y=1065;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
scene.world.color=(.013,.020,.030)
world=scene.world.node_tree.nodes.get('Background');world.inputs['Color'].default_value=(.005,.009,.017,1);world.inputs['Strength'].default_value=1
cam_data=bpy.data.cameras.new('Front');cam=bpy.data.objects.new('Front',cam_data);scene.collection.objects.link(cam);scene.camera=cam
cam_data.type='ORTHO';cam_data.ortho_scale=5.9
cam.location=(0,-12,2.8);cam.rotation_euler=(Vector((0,0,2.8))-cam.location).to_track_quat('-Z','Y').to_euler()
lib=rt.load_lib(str(ROOT/'work/design-os-3d-blender/scripts/agent-verify-lib.py'))
bpy.context.view_layer.update()
for obj in objects:
    assert lib.framing(obj)['in_front'],obj.name
assert bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'candidate.blend'))=={'FINISHED'}
scene.render.filepath=str(OUT/'front.png');assert bpy.ops.render.render(write_still=True)=={'FINISHED'}
assert lib.frame_stats(str(OUT/'front.png'))['stdev']>.01
cam.location=(6,-10.392,2.8);cam.rotation_euler=(Vector((0,0,2.8))-cam.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath=str(OUT/'angle30.png');assert bpy.ops.render.render(write_still=True)=={'FINISHED'}
report={'objects':len(objects),'triangles':sum(lib.tri_count(o) for o in objects),'blender':bpy.app.version_string,'front':'front.png','angle':'angle30.png','visual_acceptance':'pending'}
(OUT/'blockout-report.json').write_text(json.dumps(report,indent=2));rt.emit_ok('native-blockout',**report)
