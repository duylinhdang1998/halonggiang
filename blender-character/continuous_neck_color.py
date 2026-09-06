import bpy
from pathlib import Path

def repaint_neck(target,reference,out):
    mat=target.data.materials[0];tree=mat.node_tree;n=tree.nodes;links=tree.links
    baked=next(node for node in n if node.type=='TEX_IMAGE');emission=next(node for node in n if node.type=='EMISSION')
    geometry=n.new('ShaderNodeNewGeometry');pos=n.new('ShaderNodeSeparateXYZ');normal=n.new('ShaderNodeSeparateXYZ')
    links.new(geometry.outputs['Position'],pos.inputs[0]);links.new(geometry.outputs['Normal'],normal.inputs[0])
    def math_node(op,a,b):
        node=n.new('ShaderNodeMath');node.operation=op
        for i,v in enumerate([a,b]):
            if isinstance(v,(int,float)):node.inputs[i].default_value=v
            else:links.new(v,node.inputs[i])
        return node.outputs[0]
    def ramp(value,a,b):
        node=n.new('ShaderNodeMapRange');node.interpolation_type='SMOOTHSTEP';node.clamp=True
        links.new(value,node.inputs['Value']);node.inputs['From Min'].default_value=a;node.inputs['From Max'].default_value=b
        return node.outputs[0]
    scale=5.6/1023
    x=math_node('ADD',math_node('DIVIDE',pos.outputs['X'],scale),202)
    py=math_node('SUBTRACT',1049,math_node('DIVIDE',pos.outputs['Z'],scale))
    uv=n.new('ShaderNodeCombineXYZ');links.new(math_node('DIVIDE',x,404),uv.inputs['X'])
    links.new(math_node('SUBTRACT',1,math_node('DIVIDE',py,1065)),uv.inputs['Y'])
    photo=n.new('ShaderNodeTexImage');photo.image=bpy.data.images.load(str(reference),check_existing=True);photo.extension='EXTEND';links.new(uv.outputs[0],photo.inputs['Vector'])
    band=math_node('MULTIPLY',ramp(py,273,286),math_node('SUBTRACT',1,ramp(py,339,353)))
    facing=ramp(math_node('MULTIPLY',pos.outputs['Y'],-1),-.12,-.03)
    mix=n.new('ShaderNodeMixRGB');links.new(math_node('MULTIPLY',band,facing),mix.inputs[0]);links.new(baked.outputs['Color'],mix.inputs[1]);links.new(photo.outputs['Color'],mix.inputs[2]);links.new(mix.outputs[0],emission.inputs['Color'])
    image=bpy.data.images.new('UpperFinal',width=2048,height=2048,alpha=False)
    dest=n.new('ShaderNodeTexImage');dest.image=image;dest.extension='EXTEND'
    for node in n:node.select=False
    dest.select=True;n.active=dest
    for obj in bpy.context.scene.objects:obj.select_set(False)
    target.select_set(True);bpy.context.view_layer.objects.active=target
    assert bpy.ops.object.bake(type='EMIT',use_selected_to_active=False,margin=12,use_clear=True)=={'FINISHED'}
    image.filepath_raw=str(out);image.file_format='PNG';image.save();image.pack()
    links.new(dest.outputs['Color'],emission.inputs['Color'])
    for node in list(n):
        if node not in [dest,emission] and node.type!='OUTPUT_MATERIAL':n.remove(node)
    return image
