import bpy

def bake_surface(source,target,path):
    for obj in bpy.context.scene.objects:obj.select_set(False)
    target.select_set(True);bpy.context.view_layer.objects.active=target
    if not target.data.uv_layers:target.data.uv_layers.new(name='SurfaceUV')
    assert bpy.ops.object.mode_set(mode='EDIT')=={'FINISHED'}
    assert bpy.ops.mesh.select_all(action='SELECT')=={'FINISHED'}
    assert bpy.ops.uv.smart_project(angle_limit=1.2,island_margin=.012)=={'FINISHED'}
    assert bpy.ops.object.mode_set(mode='OBJECT')=={'FINISHED'}
    target.data.materials.clear();mat=bpy.data.materials.new('ContinuousReference');target.data.materials.append(mat)
    nodes=mat.node_tree.nodes;nodes.clear();tex=nodes.new('ShaderNodeTexImage')
    image=bpy.data.images.new('ContinuousUpperBake',width=2048,height=2048,alpha=False)
    tex.image=image;tex.extension='EXTEND';tex.select=True;nodes.active=tex
    output=nodes.new('ShaderNodeOutputMaterial');shader=nodes.new('ShaderNodeEmission')
    mat.node_tree.links.new(shader.outputs[0],output.inputs['Surface'])
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=1
    scene.render.bake.use_selected_to_active=True;scene.render.bake.target='IMAGE_TEXTURES'
    source.select_set(True);source.hide_render=False
    assert bpy.ops.object.bake(type='EMIT',use_selected_to_active=True,cage_extrusion=.065,max_ray_distance=.16,margin=12,use_clear=True)=={'FINISHED'}
    image.filepath_raw=str(path);image.file_format='PNG';image.save();image.pack()
    mat.node_tree.links.new(tex.outputs['Color'],shader.inputs['Color'])
    return image
