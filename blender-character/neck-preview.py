import sys,math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'))
import bpy,agent_runtime as rt
from mathutils import Vector
OUT=ROOT/'work/giang-blender'
assert bpy.ops.wm.open_mainfile(filepath=str(OUT/'candidate.blend'))=={'FINISHED'}
scene=bpy.context.scene;cam=scene.camera;scene.render.resolution_x=720;scene.render.resolution_y=720
cam.data.ortho_scale=2.3;target=Vector((-.12,0,4.38))
for angle in [0,30,-30,90]:
    a=math.radians(angle);cam.location=target+Vector((12*math.sin(a),-12*math.cos(a),0))
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(OUT/f'neck-{angle}.png');assert bpy.ops.render.render(write_still=True)=={'FINISHED'}
rt.emit_ok('neck-closeups',angles=[0,30,-30,90],resolution=720)
