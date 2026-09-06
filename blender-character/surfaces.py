import bpy, math, numpy as np
from mathutils import Vector
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'work/giang-blender'
SCALE=5.6/(1049-26)
REFERENCE=ROOT/'work/giang-img2threejs/reference/approved-front.png'
COLORS={'skin':(.84,.58,.37),'polo':(.70,.69,.66),'black':(.016,.019,.023),'shoe':(.018,.022,.028),'book':(.018,.050,.075),'watch':(.38,.23,.10)}

def interp(rows, t):
    a=np.asarray(rows,float); x=a[:,0]; y=a[:,1:]
    slopes=np.gradient(y,x,axis=0)
    i=np.clip(np.searchsorted(x,t)-1,0,len(x)-2)
    span=x[i+1]-x[i]; u=np.clip((t-x[i])/span,0,1)
    return ((2*u**3-3*u**2+1)[...,None]*y[i]+(u**3-2*u**2+u)[...,None]*span[...,None]*slopes[i]+(-2*u**3+3*u**2)[...,None]*y[i+1]+(u**3-u**2)[...,None]*span[...,None]*slopes[i+1])

def surface(rows,theta,t,offset,name):
    l,r,d=np.moveaxis(interp(rows,t),-1,0); c=(l+r)/2; radius=(r-l)/2
    px=c+radius*np.sin(theta); co=np.cos(theta)
    center_depth=offset
    if name=='arm-left':center_depth=np.interp(t,[455,499,540,571],[-2,25,70,88])
    if name=='arm-right':center_depth=np.interp(t,[449,514,593,654],[-2,25,45,35])
    if name=='shoe-left':center_depth=np.interp(t,[958,983,1025],[-13,10,21])
    if name=='shoe-right':center_depth=np.interp(t,[970,1000,1049],[-23,10,32])
    depth=center_depth+d*np.sign(co)*np.abs(co)**.60
    if name=='head':
        # Continuous sculpt offsets: projecting nasal bridge/tip, cheeks, orbital bowls.
        front=np.clip(co,0,1)**3
        bump=27*np.exp(-((px-171)/17)**2-((t-222)/16)**2)
        bump+=11*np.exp(-((px-169)/11)**2-((t-199)/32)**2)
        bump+=6*np.exp(-((px-170)/47)**2-((t-266)/21)**2)
        bump-=7*(np.exp(-((px-127)/21)**2-((t-192)/13)**2)+np.exp(-((px-204)/22)**2-((t-182)/15)**2))
        depth+=front*bump
    return px,t,depth

def make_texture(name,rows,offset,region):
    image=bpy.data.images.load(str(REFERENCE),check_existing=True)
    w,h=image.size; pix=np.array(image.pixels[:],dtype=np.float32).reshape(h,w,4)
    tw,th=(768,768) if name=='head' else (384,512)
    theta=np.linspace(-math.pi,math.pi,tw)[None,:]+np.zeros((th,1))
    t=np.linspace(rows[-1][0],rows[0][0],th)[:,None]+np.zeros((1,tw))
    px,py,depth=surface(rows,theta,t,offset,name)
    x=np.clip(px,0,w-1); y=np.clip(h-1-py,0,h-1)
    ix=x.astype(int); iy=y.astype(int); fx=(x-ix)[...,None];fy=(y-iy)[...,None]
    sampled=(pix[iy,ix]*(1-fx)+pix[iy,np.minimum(ix+1,w-1)]*fx)*(1-fy)+(pix[np.minimum(iy+1,h-1),ix]*(1-fx)+pix[np.minimum(iy+1,h-1),np.minimum(ix+1,w-1)]*fx)*fy
    base=np.zeros_like(sampled);base[:,:,:3]=COLORS[region];base[:,:,3]=1
    if name=='head':
        hair=np.clip((214+8*np.sin(theta)-t)/6,0,1)
        base[:,:,:3]=base[:,:,:3]*(1-hair[:,:,None])+np.array([.021,.028,.036])*hair[:,:,None]
    # Extend neighboring fabric into regions hidden by the book/hand in the reference.
    # Sampling the same row preserves weave and lighting, avoiding solid rectangular patches.
    def fill_from_column(hidden,column):
        source=pix[iy,np.full_like(ix,column)]
        sampled[hidden]=source[hidden]
    if name=='polo':
        hidden=((px<184)&(py>435))|((px<136)&(py>490))
        fill_from_column(hidden,195)
    if name=='trousers-hip':
        hidden=((px>251)&(py<655))|((px<181)&(py<599))
        fill_from_column(hidden,224)
    if name=='neck':
        # Match the source neck lighting, not a flat gold band. Clamp only the
        # inferred side pixels to known skin so the shirt is never painted on skin.
        skin_left=np.interp(py,[265,284,300,311,322,337,350],[172,169,159,158,166,179,185])
        skin_right=np.interp(py,[265,284,300,311,322,337,350],[222,229,230,222,211,197,192])
        nx=np.clip(px,skin_left,skin_right)
        sx=nx.astype(int);f=(nx-sx)[:,:,None]
        inferred=pix[iy,sx]*(1-f)+pix[iy,np.minimum(sx+1,w-1)]*f
        front_weight=np.clip((np.cos(theta)-.30)/.30,0,1)[:,:,None]
        sampled=sampled*front_weight+inferred*(1-front_weight)
    blend=np.clip((np.cos(theta)+.12)/.50,0,1);blend=blend*blend*(3-2*blend)
    # Baked softbox illumination for inferred sides; no duplicated front painting on the back.
    points=np.stack([px,-depth,-py],axis=-1)
    du=np.gradient(points,axis=1);dv=np.gradient(points,axis=0)
    normals=np.cross(du,dv);normals/=np.maximum(np.linalg.norm(normals,axis=2,keepdims=True),.0001)
    outward=np.stack([np.sin(theta),-np.cos(theta),np.zeros_like(theta)],axis=-1)
    normals*=np.where((normals*outward).sum(axis=2,keepdims=True)<0,-1,1)
    key=np.array([-.5,-.5,.7]);key/=np.linalg.norm(key)
    rim=np.array([.6,.65,.45]);rim/=np.linalg.norm(rim)
    shade=.55+.38*np.maximum(0,(normals*key).sum(axis=2))+.24*np.maximum(0,(normals*rim).sum(axis=2))
    base[:,:,:3]*=shade[:,:,None]
    rgba=sampled*blend[:,:,None]+base*(1-blend[:,:,None]);rgba[:,:,3]=1
    tex=bpy.data.images.new(name+'-baked',width=tw,height=th,alpha=True)
    tex.pixels.foreach_set(rgba.astype(np.float32).ravel());tex.filepath_raw=str(OUT/(name+'.png'));tex.file_format='PNG';tex.save();tex.pack()
    mat=bpy.data.materials.new(name+'-reference-bake');nodes=mat.node_tree.nodes;nodes.clear()
    source=nodes.new('ShaderNodeTexImage');source.image=tex;source.interpolation='Linear';source.extension='EXTEND'
    shader=nodes.new('ShaderNodeEmission');output=nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(source.outputs['Color'],shader.inputs['Color']);mat.node_tree.links.new(shader.outputs[0],output.inputs['Surface'])
    return mat

def loft(name,rows,offset,region):
    n=64; steps=max(16,int((rows[-1][0]-rows[0][0])/2))
    ts=np.linspace(rows[0][0],rows[-1][0],steps);theta=np.arange(n)*2*math.pi/n-math.pi
    verts=[];faces=[];uvs=[]
    for t in ts:
        px,py,d=surface(rows,theta,np.full(n,t),offset,name)
        verts.extend(zip((px-202)*SCALE,-d*SCALE,(1049-py)*SCALE))
    for j in range(steps-1):
        for i in range(n):
            nxt=(i+1)%n;faces.append((j*n+i,j*n+nxt,(j+1)*n+nxt,(j+1)*n+i))
            uvs.append(((i/n,1-j/(steps-1)),((i+1)/n,1-j/(steps-1)),((i+1)/n,1-(j+1)/(steps-1)),(i/n,1-(j+1)/(steps-1))))
    for j,reverse in [(0,True),(steps-1,False)]:
        ring=np.asarray(verts[j*n:(j+1)*n]);center=len(verts);verts.append(tuple(ring.mean(axis=0)))
        for i in range(n):
            face=(center,j*n+(i+1)%n,j*n+i) if reverse else (center,j*n+i,j*n+(i+1)%n)
            faces.append(face);uvs.append(((.5,1-j/(steps-1)),)*3)
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();assert not mesh.validate()
    obj=bpy.data.objects.new(name,mesh);bpy.context.scene.collection.objects.link(obj)
    uv=mesh.uv_layers.new(name='BakedReferenceUV')
    for polygon,coords in zip(mesh.polygons,uvs):
        polygon.use_smooth=True
        for idx,value in zip(polygon.loop_indices,coords):uv.data[idx].uv=value
    # Explicit outward orientation for the closed surface.
    import bmesh
    bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free()
    mesh.materials.append(make_texture(name,rows,offset,region));obj['inferred_rear']=True
    return obj
