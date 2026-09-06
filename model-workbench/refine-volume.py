import json,sys,copy,math
from pathlib import Path
R=Path(__file__).resolve().parents[2];run=R/'work/giang-img2threejs';p=run/'character-sculpt-spec.json';s=json.loads(p.read_text());cs=s['componentTree'];by={c['id']:c for c in cs};world={}
for c in cs:world[c['id']]=[a+b for a,b in zip(c['transform']['position'],world.get(c.get('parent'),[0,0,0]))]
P=lambda x,y,z:[(x-202)/250,(1048-y)/250,z/250]
def add(cid,prims):
 c=by[cid];sd=c['geometryDescriptor']['sdf'];prev=sd['operations'][-1]['id'] if sd['operations'] else sd['primitives'][0]['id']
 for tag,typ,pos,size in prims:
  center=[a-b for a,b in zip(P(*pos),world[cid])];q={'id':tag,'type':typ,'center':center,('radii' if typ=='ellipsoid' else 'size'):[v/250 for v in size]};sd['primitives'].append(q);sd['operations'].append({'id':'union-'+tag,'type':'smooth-union','left':prev,'right':tag,'radius':.045});prev='union-'+tag
  for j in range(3):
   ext=size[j]/250*(1 if typ=='ellipsoid' else .5)+.06;sd['bounds']['min'][j]=min(sd['bounds']['min'][j],center[j]-ext);sd['bounds']['max'][j]=max(sd['bounds']['max'][j],center[j]+ext)
add('pants',[('waist','box',(183,603,-4),(179,48,100)),('ankle-l','ellipsoid',(140,954,-3),(34,29,34)),('ankle-r','ellipsoid',(291,968,-6),(31,28,33))])
add('shirt',[('tucked-hem','box',(183,550,0),(176,43,93)),('cuff-left','ellipsoid',(77,447,0),(30,17,31)),('cuff-right','ellipsoid',(333,447,0),(31,16,34))])
add('arm-left',[('upper-arm-contact','ellipsoid',(74,464,1),(26,27,26))]);add('arm-right',[('upper-arm-contact','ellipsoid',(334,461,0),(29,26,28))])
# Shape the scalp first, then union visible swept locks. Carve forehead from the hair volume.
h=by['hair'];center=world['hair'];loc=lambda x,y,z:[a-b for a,b in zip(P(x,y,z),center)]
prim=[{'id':'scalp','type':'ellipsoid','center':loc(176,154,-18),'radii':[92/250,121/250,83/250]}, {'id':'forehead-clearance','type':'box','center':loc(176,259,52),'size':[211/250,335/250,142/250]}]
ops=[{'id':'scalp-shell','type':'subtract','left':'scalp','right':'forehead-clearance'}];prev='scalp-shell'
for i,(x,y,rx,ry,angle) in enumerate([(104,76,40,16,15),(123,63,48,18,16),(152,51,43,18,14),(181,48,32,16,10),(206,62,27,25,15),(231,87,19,24,8)]):
 tag=f'lock-{i}';prim.append({'id':tag,'type':'ellipsoid','center':loc(x,y,15),'radii':[rx/250,ry/250,57/250],'transform':{'rotation':[0,0,math.radians(angle)]}});ops.append({'id':'hair-'+str(i),'type':'smooth-union','left':prev,'right':tag,'radius':.018});prev='hair-'+str(i)
h['geometryDescriptor']['sdf']={'primitives':prim,'operations':ops,'resolution':64,'bounds':{'min':loc(49,283,-112),'max':loc(281,17,98)}}
h['localFeatures']+=['scalp-following-back-shell','individual-swept-locks'];h['topologyRationale']='Closed scalp-following volume with forehead clearance and swept clump masses. Rear topology inferred and reviewed separately.'
for side in ['left','right']:
 c=by['eye-'+side];c['geometryDescriptor']['sdf']['primitives'][0]['radii'][2]=.028
# Independently shaped collar leaves; projected trim lands on these volumes.
proto=copy.deepcopy(by['notebook'])
for i,(x,y,angle) in enumerate([(149,341,-32),(222,330,39)]):
 c=copy.deepcopy(proto);c['id']='collar-'+str(i);c['name']='Polo collar leaf '+str(i);c['material']='shirt';c['materialLayers']=['shirt'];c['parent']='shirt';c['level']='meso';c['transform']={'position':[a-b for a,b in zip(P(x,y,48),world['shirt'])],'rotation':[0,0,math.radians(angle)],'scale':[.245,.092,.024]};c['dimensions']={'width':.245,'height':.092,'depth':.024,'units':'relative','confidence':.8};c['localFeatures']=['collar-piping'];c['colorMaterialRecipe']=copy.deepcopy(by['shirt']['colorMaterialRecipe']);c['actionProfile']['destruction']['fractureGroup']=c['id'];cs.append(c)
# Do not interpret lit hair crop as transmissive polished material.
for m in s['materials']:
 m['metalness']={'base':.65 if m['id']=='metal' else 0,'variation':0}
 m['roughness']['base']=.6 if m['id']=='skin' else .72 if m['id']=='hair' else m['roughness']['base']
 m['renderCorrectionNote']='First browser review showed exaggerated highlights. Independent maps retained, displacement disabled; low-amplitude normal response used for stylized surfaces.'
 m['displacement']={'pattern':'none','amplitude':0,'scale':1,'silhouetteAffects':False} if not m.get('textureless') else None
 if m['displacement'] is None:m.pop('displacement')
 if 'normal' in m:m['normal']['strength']=.025
s['projectedTextureBake']['runtimeImplementation']='app/model-workbench/project-reference.ts; reference UV per vertex; front-facing weights; de-lit source. Runtime texture projection implemented, UV raster bake not yet performed.'
s['sculptPipeline']['currentPass']='blockout'
for b in s['buildPasses']:b['componentRefs']=[c['id'] for c in cs]
p.write_text(json.dumps(s,indent=2))
