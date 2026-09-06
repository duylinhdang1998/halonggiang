import json
from pathlib import Path
r=Path(__file__).resolve().parents[2]/'work/giang-img2threejs';p=r/'character-sculpt-spec.json';s=json.loads(p.read_text());by={c['id']:c for c in s['componentTree']}
shirt=by['shirt']['geometryDescriptor']['sdf']
for q in shirt['primitives']:
 if q['id']=='tucked-hem':q['size']=[158/250,40/250,80/250]
for op in shirt['operations']:op['radius']=.065
for q in by['pants']['geometryDescriptor']['sdf']['primitives']:
 if q['id']=='waist':q['size']=[152/250,45/250,90/250]
hair=by['hair']['geometryDescriptor']['sdf'];hair['primitives'].append({'id':'front-sweep','type':'ellipsoid','center':[-.06,.052,.12],'radii':[.29,.070,.20],'transform':{'rotation':[0,0,.16]}});hair['operations'].append({'id':'swept-front-fill','type':'smooth-union','left':hair['operations'][-1]['id'],'right':'front-sweep','radius':.035})
head=by['head']['geometryDescriptor']['sdf']
for prim in head['primitives']:
 if prim['id'] in ['v2','v3']:prim['radii'][2]*=.72
 if prim['id']=='v4':prim['radii'][2]*=.6
s['projectedTextureBake']['runtimeImplementation']='project-reference.ts computes explicit fixed-camera photo UVs and front-facing weight per generated vertex; face boundary restricts projection to avoid duplicated ears; residual source shading handled by 85% unlit front response. Rear uses inferred palette and real scene lights. This is stylized projection, not fully de-lit physical skin.'
s['risks']=['Single-image front projection is imperfect off-axis; no claim of scan-quality identity.','The approximation uses a mostly unlit front material to preserve stylized source appearance; it is not physically calibrated PBR.']
p.write_text(json.dumps(s,indent=2))
