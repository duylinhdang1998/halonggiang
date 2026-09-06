import sys,json,math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).parent
sys.path.insert(0,str(HERE));sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'))
import bpy,agent_runtime as rt
from mathutils import Vector
from continuous_geometry import merged_source,build_continuous
from continuous_bake import bake_surface
from continuous_neck_color import repaint_neck
OUT=ROOT/'work/giang-blender'
assert bpy.ops.wm.open_mainfile(filepath=str(OUT/'continuous-before/candidate.blend'))=={'FINISHED'}
old=[bpy.data.objects[n] for n in ['head','neck','polo']]
source=merged_source(old)
for obj in old:obj.hide_render=True;obj.hide_set(True)
target,report=build_continuous(source)
bake_surface(source,target,OUT/'continuous-upper.png')
for obj in [source,*old]:bpy.data.objects.remove(obj,do_unlink=True)
repaint_neck(target,ROOT/'work/giang-img2threejs/reference/approved-front.png',OUT/'continuous-upper-final.png')
target['continuous_upper_body']=True;target['topology_components']=1
scene=bpy.context.scene;scene.render.bake.use_selected_to_active=False;scene.cycles.samples=8
assert bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'continuous.blend'))=={'FINISHED'}
cam=scene.camera;scene.render.resolution_x=720;scene.render.resolution_y=720;cam.data.ortho_scale=2.3
focus=Vector((-.12,0,4.38))
for angle in [0,30,-30]:
    a=math.radians(angle);cam.location=focus+Vector((12*math.sin(a),-12*math.cos(a),0));cam.rotation_euler=(focus-cam.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(OUT/f'continuous-{angle}.png');assert bpy.ops.render.render(write_still=True)=={'FINISHED'}
(OUT/'continuous-topology.json').write_text(json.dumps(report,indent=2));rt.emit_ok('continuous-upper',**report)
