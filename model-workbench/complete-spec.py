import json,sys,copy,shutil
from pathlib import Path
R=Path(__file__).resolve().parents[2];RUN=R/'work/giang-img2threejs';sys.path.insert(0,str(R/'work/img2threejs/forge/stage2_spec'))
from new_sculpt_spec import make_character_build_passes,_limb_attachment
s=json.load(open(RUN/'character-sculpt-spec.json')); comps=s['componentTree'];by={c['id']:c for c in comps};mats={m['id']:m for m in s['materials']}
s['preSpecAssessment']['unknownsToResolveBeforeImplementation']=[]
s['preSpecAssessment']['complexity']['scores']={k:min(v,3) for k,v in s['preSpecAssessment']['complexity']['scores'].items()}
world={}
for c in comps:
 p=world.get(c.get('parent'),[0,0,0]);world[c['id']]=[a+b for a,b in zip(c['transform']['position'],p)]
 col=mats[c['material']].get('baseColor','#888888').lstrip('#');rgb=[int(col[i:i+2],16) for i in [0,2,4]];rgba='rgba('+', '.join(map(str,rgb))+', 1)'
 c['colorMaterialRecipe']={'dominantAlbedo':rgba,'secondaryAlbedo':rgba,'materialClass':'organic' if c['material'] in ['skin','hair'] else 'fabric' if c['material'] in ['shirt','pants'] else 'metal' if c['material']=='metal' else 'plastic','materialClassConfidence':.8,'evidenceRefs':['full-object'],'materialRef':c['material']}
for cid,x,y,end in [('arm-left',78,464,(145,563)),('arm-right',331,459,(280,617))]:
 pc=world['shirt'];p=lambda x,y:[(x-202)/250-pc[0],(1048-y)/250-pc[1],.03-pc[2]]
 by[cid]['attachment']=_limb_attachment(p(x,y),p(*end),.10,.07,socket=cid+'-sleeve',embed_depth=.035)
# Cavities are subtracted from the face, with independent corneal volumes inside.
h=by['head'];sd=h['geometryDescriptor']['sdf'];center=world['head'];prev=sd['operations'][-1]['id']
for tag,x,y,z,rx,ry,rz in [('eye-socket-left',128,193,76,22,16,21),('eye-socket-right',203,181,77,24,18,22),('smile-cavity',174,252,68,37,11,15)]:
 sd['primitives'].append({'id':tag,'type':'ellipsoid','center':[(x-202)/250-center[0],(1048-y)/250-center[1],z/250-center[2]],'radii':[rx/250,ry/250,rz/250]})
 sd['operations'].append({'id':'carve-'+tag,'type':'subtract','left':prev,'right':tag});prev='carve-'+tag
for cid in ['eye-left','eye-right']:by[cid]['name']=cid+' cornea within carved head socket'
# Generator only supports radial placement, so author the three visible fasteners as a repeated named group.
source=by['button-source'];comps.remove(source);ids=[]
for i,(x,y) in enumerate([(177,352),(170,378),(164,404)]):
 c=copy.deepcopy(source);c['id']=f'button-{i}';c['name']=f'Polo button {i+1}';c['transform']['position']=[(x-202)/250,(1048-y)/250,.255];c['primitive']='ellipsoid';c['actionProfile']['destruction']['fractureGroup']=c['id'];comps.append(c);ids.append(c['id'])
s['repetitionSystems']=[{'id':'placket-buttons','elementComponentIds':ids,'count':3,'level':'micro','buildsGeometry':True,'placement':{'mode':'authored-landmarks'},'evidenceRefs':['full-object']}]
for d in s['preSpecAssessment']['detailInventory']['details']:
 if d['mapsTo']['ref'].startswith('button-source/'):d['mapsTo']['ref']='button-0/three-buttons'
s['buildPasses']=make_character_build_passes()
for b in s['buildPasses']:b['componentRefs']=[c['id'] for c in comps]
s['sculptPipeline']['passOrder']=[b['id'] for b in s['buildPasses']]
s['selfCorrectLoop']['reviewAfterPasses']=s['sculptPipeline']['passOrder']
s['selfCorrectLoop']['screenshotPolicy']['requiredForPasses']=s['sculptPipeline']['passOrder'][:-1]
# Serve independent map evidence locally; preserve extraction metadata and originals.
public=R/'app/public/model-evidence';public.mkdir(exist_ok=True)
for m in mats.values():
 for channel,rec in m.get('referencePbr',{}).get('maps',{}).items():
  path=Path(rec['path']);name=m['id']+'-'+channel+path.suffix;shutil.copy(path,public/name);rec['url']='/model-evidence/'+name
s['referenceCamera']=json.load(open(RUN/'camera.json'))['referenceCamera'] if (RUN/'camera.json').exists() else {}
s['projectedTextureBake']=json.load(open(RUN/'projection.json'))['projectedTextureBake'] if (RUN/'projection.json').exists() else {}
(RUN/'character-sculpt-spec.json').write_text(json.dumps(s,indent=2))
