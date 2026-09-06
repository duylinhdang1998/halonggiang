import sys,math,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
sys.path.insert(0,str(ROOT/'work/design-os-3d-blender/scripts'))
import bpy,agent_runtime as rt
from mathutils import Vector
OUT=ROOT/'work/giang-blender';PUBLIC=ROOT/'app/public/models';PUBLIC.mkdir(parents=True,exist_ok=True)
assert bpy.ops.wm.open_mainfile(filepath=str(OUT/'candidate.blend'))=={'FINISHED'}
scene=bpy.context.scene;cam=scene.camera
objects=[o for o in scene.objects if o.type=='MESH'];assert len(objects)==17
lib=rt.load_lib(str(ROOT/'work/design-os-3d-blender/scripts/agent-verify-lib.py'))
# Realtime export includes only the native character meshes and their packed UV textures.
for obj in scene.objects:obj.select_set(obj in objects)
glb=PUBLIC/'giang-blender.glb'
assert bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_apply=True,export_animations=False,export_extras=True)=={'FINISHED'}
assert glb.stat().st_size>100000
for angle in [90,180]:
    a=math.radians(angle);cam.location=(12*math.sin(a),-12*math.cos(a),2.8)
    cam.rotation_euler=(Vector((0,0,2.8))-cam.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(OUT/f'angle{angle}.png');assert bpy.ops.render.render(write_still=True)=={'FINISHED'}
# Neutral geometry diagnostic exposes the actual shape underneath the baked front artwork.
clay=bpy.data.materials.new('Clay');bsdf=clay.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=(.40,.44,.48,1)
for obj in objects:obj.data.materials.clear();obj.data.materials.append(clay)
for name,loc,power,size in [('Key',(-4,-6,8),1700,5),('Fill',(4,-2,5),650,4),('Rim',(1,4,7),1500,3)]:
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=(Vector((0,0,3))-obj.location).to_track_quat('-Z','Y').to_euler()
cam.location=(6,-10.392,2.8);cam.rotation_euler=(Vector((0,0,2.8))-cam.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath=str(OUT/'clay30.png');assert bpy.ops.render.render(write_still=True)=={'FINISHED'}
rt.emit_ok('native-export',objects=len(objects),glb_bytes=glb.stat().st_size,glb=str(glb),visual_acceptance='trial')
