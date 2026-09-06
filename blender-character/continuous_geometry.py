import bpy,bmesh,math
from mathutils import Vector

def merged_source(objects):
    verts=[];faces=[];uvs=[];materials=[];slots=[]
    for obj in objects:
        offset=len(verts);mat_offset=len(materials)
        verts.extend(tuple(obj.matrix_world@v.co) for v in obj.data.vertices)
        materials.extend(obj.data.materials)
        for poly in obj.data.polygons:
            faces.append(tuple(offset+i for i in poly.vertices));slots.append(mat_offset+poly.material_index)
            uvs.extend(tuple(obj.data.uv_layers.active.data[i].uv) for i in poly.loop_indices)
    mesh=bpy.data.meshes.new('ReferenceUpper');mesh.from_pydata(verts,[],faces);mesh.update()
    for mat in materials:mesh.materials.append(mat)
    uv=mesh.uv_layers.new(name='ReferenceUV')
    for loop,value in zip(uv.data,uvs):loop.uv=value
    for poly,slot in zip(mesh.polygons,slots):poly.material_index=slot;poly.use_smooth=True
    obj=bpy.data.objects.new('ReferenceUpper',mesh);bpy.context.scene.collection.objects.link(obj)
    return obj

def apply_evaluated(obj):
    bpy.context.view_layer.update();old=obj.data
    evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh=bpy.data.meshes.new_from_object(evaluated)
    obj.modifiers.clear();obj.data=mesh
    if old.users==0:bpy.data.meshes.remove(old)

def connected_report(obj):
    bm=bmesh.new();bm.from_mesh(obj.data);unseen=set(bm.verts);sizes=[]
    while unseen:
        seed=unseen.pop();stack=[seed];size=0
        while stack:
            v=stack.pop();size+=1
            for edge in v.link_edges:
                other=edge.other_vert(v)
                if other in unseen:unseen.remove(other);stack.append(other)
        sizes.append(size)
    report={'components':len(sizes),'vertices':len(bm.verts),'nonmanifold_edges':sum(not e.is_manifold for e in bm.edges)}
    bm.free();return report

def build_continuous(source):
    target=source.copy();target.data=source.data.copy();target.name='HeadNeckTorso';bpy.context.scene.collection.objects.link(target)
    mod=target.modifiers.new('UnionSurface','REMESH');mod.mode='VOXEL';mod.voxel_size=.009;mod.adaptivity=0;mod.use_smooth_shade=True
    apply_evaluated(target)
    # Smooth only the attachment zone. Eyes, smile, hair and the shirt remain outside it.
    group=target.vertex_groups.new(name='JawNeckCollarBlend')
    for v in target.data.vertices:
        py=1049-v.co.z/(5.6/1023)
        weight=math.exp(-((py-307)/29)**4)
        if weight>.001:group.add([v.index],weight,'REPLACE')
    smooth=target.modifiers.new('ContinuousNeck','SMOOTH');smooth.vertex_group=group.name;smooth.factor=.6;smooth.iterations=80
    apply_evaluated(target)
    reduce=target.modifiers.new('RealtimeBudget','DECIMATE');reduce.ratio=.42
    apply_evaluated(target)
    # All faces now share geometry and normals; there are no internal neck end caps.
    for p in target.data.polygons:p.use_smooth=True
    report=connected_report(target)
    assert report['components']==1 and report['nonmanifold_edges']==0,report
    return target,report
