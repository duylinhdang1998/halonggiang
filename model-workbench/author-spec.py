"""Subject measurements and img2threejs spec authoring; no mesh vertices are authored here."""
import json, sys, math, copy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
REPO=ROOT/'work/img2threejs'; RUN=ROOT/'work/giang-img2threejs'
sys.path.insert(0,str(REPO)); sys.path.insert(0,str(REPO/'forge/stage2_spec'))
from new_sculpt_spec import _cnode, make_spec
from forge.stage4_review.fit_params import fit,FitConfig

def save(name,d): (RUN/name).write_text(json.dumps(d,indent=2,ensure_ascii=False))
# Manual visual measurements in the 404x1065 approved artwork. Not detector output.
landmarks={'hairTop':[143,27],'chin':[181,301],'eyeLeft':[128,194],'eyeRight':[203,181],'noseBase':[168,233],'mouthCenter':[175,251],'earLeft':[87,224],'earRight':[272,205],'neckBase':[192,329],'shoulderLeft':[112,352],'shoulderRight':[293,357],'elbowLeft':[58,523],'elbowRight':[340,507],'wristLeft':[103,550],'wristRight':[298,600],'waistLeft':[92,579],'waistRight':[273,571],'hipLeft':[127,653],'hipRight':[228,654],'kneeLeft':[141,808],'kneeRight':[269,817],'ankleLeft':[140,964],'ankleRight':[291,978],'soleLeft':[101,1020],'soleRight':[294,1045]}
anatomy={'applies':True,'source':'manual visual measurements of approved stylized reference; not automatic landmark detection','styleHeads':(1045-27)/(301-27),'proportions':{'headUnit':274/1065,'torso':(579-329)/274,'legs':(1045-579)/274,'shoulderWidth':(326-81)/274,'hipWidth':(279-92)/274},'pose':{'type':'contrapposto standing; screen-left forearm across notebook; screen-right hand tucked into trouser pocket','jointAngles':{'leftElbow':[0,0,78],'rightElbow':[0,0,-40],'neck':[0,0,-4],'rightHip':[0,0,-10],'leftHip':[0,0,3]}},'faceLandmarks':{'hairline':87/1065,'eyeLine':188/1065,'eyeSpacing':75/404,'noseBase':233/1065,'mouthLine':251/1065,'earTop':174/1065,'earBottom':253/1065},'features':['swept black quiff','broad open smile exposing upper teeth','arched dark brows','large brown eyes','short chin with rounded jaw','polo collar with dark and gold piping'],'confidence':.84,'measuredPixels':landmarks}
save('anatomy.json',{'sourceImage':str(RUN/'reference/approved-front.png'),'anatomy':anatomy,'uncertainty':'Visible landmark positions estimated within 3–6 px. Depth and rear are inferred, not measured.'})
a=json.load(open(RUN/'assessment.json')); p=a['preSpecAssessment']; p['anatomy']=anatomy
p['objectClass']={'primaryType':'stylized adult male full-body character','primaryDomain':'character','formLanguage':['smooth continuous organic volumes','enlarged head and eyes','tailored clothing over articulated limbs'],'structureKind':['head-neck-torso','paired articulated arms and legs','separate notebook and wristwatch'],'motionPotential':['whole-object orbit and zoom; no limb animation requested'],'materialFamilies':['skin','hair','woven cotton','trouser fabric','leather','metal'],'notes':'Reconstruct the approved cartoon, not the original photographic proportions.'}
p['complexity']['scores']={'silhouetteComplexity':4,'componentCount':4,'hierarchyDepth':3,'repetitionDensity':2,'materialLayerCount':4,'localDetailDensity':5,'occlusionRisk':4,'actionReadinessNeed':2}
p['complexity']['reasoning']=['Face identity relies on eye separation, asymmetric brows, mouth width and chin shape.','Arms overlap notebook and body; isolated front relief cannot represent these volumes.','Rear surface unseen; anatomical volume and continuation of clothing allowed by user.']
p['unknownsToResolveBeforeImplementation']=['Exact rear hairstyle and garment folds are unseen; user accepts plausible inferred continuation.']
a['qualityContract']['definitionOfDone']=['Front resembles approved cartoon in proportions, pose, facial landmarks and outfit; rear is smooth, closed and plausible; all orbit angles reviewed before integration.','Pinned scroll fill, animated connected cards, logos, rotation and zoom continue working locally.']
a['qualityContract']['minimumSpecDepth']['repetitionSystems']=1
p['specDepthDecision']['rationale']='Oversized expressive head, overlapping limbs, fitted polo and several accessories demand separate macro, meso and micro geometry.'
# Parameter fitting of a head ellipsoid to the observed outer face boundary.
outline=[(92,151),(95,213),(108,261),(138,291),(178,302),(217,282),(249,252),(262,206),(251,137),(219,95),(173,86),(126,108)]
def objective(t):
 cx,cy,rx,ry=t
 return -sum((math.sqrt(((x-cx)/rx)**2+((y-cy)/ry)**2)-1)**2 for x,y in outline)/len(outline)
f=fit([178,194,84,108],[[165,190],[177,205],[72,100],[95,121]],objective,FitConfig(max_iterations=40,max_evaluations=500))
save('head-parameter-fit.json',{'method':'img2threejs bounded parameter fit to manually observed boundary landmarks','pixels':outline,'result':f.to_json(),'note':'Objective measures ellipse boundary agreement only, not visual acceptance.'})
s=make_spec('Ha Long Giang approved cartoon',str(RUN/'reference/approved-front.png'),a)
s['suitability']='conditional'; s['coordinateFrame']={'front':'+Z','up':'+Y','scaleReference':'250 image pixels per world unit; image x=202 is x=0; y=1048 is ground','units':'relative'}
s['assumptions']=['Approved cartoon image is identity target.','Depth and rear unobserved; user explicitly permits approximate rear.','Static component hierarchy supports whole model rotation and reveal; articulated animation out of scope.']
s['silhouette']={'boundingShape':'Oversized rounded head, tapered polo torso, separated trouser legs, asymmetric shoe stance','aspectRatios':[{'width':338,'height':1018,'ratio':338/1018}],'symmetry':'asymmetric pose, approximate bilateral anatomy','dominantCurves':['swept hair arc','rounded cheek and chin','sloping shoulders','bent elbow outline','splayed shoe toe'],'negativeSpaces':['gap between legs','right elbow to waist opening'],'landmarks':[{'name':k,'imagePosition':v} for k,v in landmarks.items()]}
s['viewEvidence']=[{'id':'full-object','view':'front','imageRegion':{'x':0,'y':0,'width':1,'height':1,'units':'normalized'},'observations':p['complexity']['reasoning']+anatomy['features'],'confidence':.84}]
W=250
P=lambda x,y,z=0:[(x-202)/W,(1048-y)/W,z/W]
components=[_cnode('root','Character root','box',None,[0,0,0],[1,1,1],material='hidden',level='macro',anim_role='root')]
anchors={'root':[0,0,0]}
# Each smooth union is a genuine closed 3D volume with separately inferred depth.
def part(cid,name,mat,shapes,level='meso',parent='root',features=None):
 # Shape entries (screen cx,cy,depth center,rx,ry,rz,angle degrees). The factory polygonizes analytic fields.
 center=P(shapes[0][0],shapes[0][1],shapes[0][2]); pc=anchors[parent]; rel=[center[i]-pc[i] for i in range(3)]
 prim=[]; mins=[999]*3; maxs=[-999]*3
 for i,(x,y,z,rx,ry,rz,ang) in enumerate(shapes):
  c=[q-r for q,r in zip(P(x,y,z),center)]; radii=[rx/W,ry/W,rz/W]
  prim.append({'id':f'v{i}','type':'ellipsoid','center':c,'radii':radii,'transform':{'rotation':[0,0,math.radians(ang)]}})
  ext=[abs(math.cos(math.radians(ang)))*radii[0]+abs(math.sin(math.radians(ang)))*radii[1],abs(math.sin(math.radians(ang)))*radii[0]+abs(math.cos(math.radians(ang)))*radii[1],radii[2]]
  for j in range(3):mins[j]=min(mins[j],c[j]-ext[j]-.05);maxs[j]=max(maxs[j],c[j]+ext[j]+.05)
 ops=[]
 for i in range(1,len(prim)):ops.append({'id':f'u{i}','type':'smooth-union','left':'v0' if i==1 else f'u{i-1}','right':f'v{i}','radius':.035})
 sdf={'primitives':prim,'operations':ops,'bounds':{'min':mins,'max':maxs},'resolution':56 if level=='macro' else 40}
 node=_cnode(cid,name,'ellipsoid',parent,rel,[maxs[i]-mins[i] for i in range(3)],material=mat,level=level,sdf=sdf,topology_rationale='Continuous anatomical/clothed volume: smooth union of parameterized ellipsoids; no silhouette extrusion.',local_features=features or [])
 node['confidence']=.84 if mat!='hair' else .7
 components.append(node);anchors[cid]=center
 return node
headx,heady,headrx,headry=f.parameters
part('pants','Continuous trouser pelvis and legs','pants',[(181,640,-4,99,65,52,0),(127,704,-3,45,91,43,5),(138,833,-3,35,132,35,0),(239,717,-6,40,93,43,12),(276,866,-6,34,118,34,7)],'macro',features=['trouser-folds','pocket-opening','ankle-hems'])
part('shirt','Polo body with integrated shoulders and sleeves','shirt',[(195,443,0,94,126,56,-4),(188,533,0,93,46,50,0),(127,373,-2,58,39,48,28),(283,378,-2,53,50,47,-26),(84,418,0,28,47,32,-20),(328,420,0,32,49,36,20)],'macro',features=['placket','collar-piping','cuff-piping','hem-folds'])
part('neck','Neck','skin',[(186,307,0,44,45,40,-8)],parent='shirt')
head=part('head','Fitted cranium jaw cheeks and nose','skin',[(headx,heady,-1,headrx,headry,77,0),(178,268,9,63,35,61,0),(115,237,38,24,30,32,-15),(221,219,39,27,34,31,10),(167,220,78,18,12,20,0),(168,202,65,12,27,18,0)],'macro',parent='neck',features=['cheek-volume','nose-tip','rounded-chin','smile-cavity'])
part('ear-left','Screen-left ear','skin',[(88,226,-4,13,29,17,13)],parent='head',features=['ear-helix'])
part('ear-right','Screen-right ear','skin',[(269,205,-5,18,31,17,-12)],parent='head',features=['ear-helix'])
part('hair','Swept cranial hair volume','hair',[(168,102,-12,94,74,82,-2),(142,75,-8,87,35,65,-18),(170,52,-15,59,23,61,-12),(248,122,-11,17,45,52,0)],parent='head',features=['swept-quiff','temple-taper'])
# The visible face is projected from the de-lit source; these support brow/eye shape from oblique views.
part('eye-left','Recessed left eye','eye',[(128,193,69,20,14,13,10)],parent='head',features=['brown-iris-left'])
part('eye-right','Recessed right eye','eye',[(203,181,70,22,16,14,9)],parent='head',features=['brown-iris-right'])
part('brow-left','Left arched brow','hair',[(119,156,62,24,6,5,15)],'micro',parent='head',features=['arched-brows'])
part('brow-right','Right arched brow','hair',[(197,146,63,27,5,5,-1)],'micro',parent='head')
part('mouth','Smile and upper teeth carrier','lips',[(174,252,65,38,12,7,9)],'micro',parent='head',features=['upper-teeth-smile'])
part('arm-left','Bent book-holding arm and hand','skin',[(70,481,3,23,42,25,-14),(58,528,9,28,30,26,0),(94,550,29,42,24,22,-14),(143,564,49,41,25,19,8)],parent='shirt',features=['notebook-grip'])
part('arm-right','Pocket-side arm','skin',[(333,486,1,26,40,29,11),(336,524,3,28,33,26,-20),(317,558,10,22,52,25,-28),(283,621,28,24,38,21,-25)],parent='shirt',features=['pocket-hand'])
part('shoe-left','Left leather shoe','leather',[(106,991,29,72,27,75,7)],parent='pants',features=['shoe-cap','shoe-sole'])
part('shoe-right','Right leather shoe','leather',[(291,1013,27,35,32,76,2)],parent='pants',features=['shoe-cap','shoe-sole'])
# Discrete props use actual rounded box geometry rather than smooth-union anatomy.
def box(cid,name,mat,x,y,z,w,h,d,parent='root',level='meso',features=None):
 c=P(x,y,z); pc=anchors[parent]
 n=_cnode(cid,name,'box',parent,[c[i]-pc[i] for i in range(3)],[w/W,h/W,d/W],material=mat,level=level,local_features=features or [])
 n['geometryDescriptor']['edgeTreatment']={'type':'bevel','bevelRadius':.012,'segments':4};components.append(n);anchors[cid]=c;return n
box('notebook','Navy notebook','leather',136,497,63,83,120,16,'shirt',features=['notebook-binding','notebook-clasp'])
box('belt','Black leather belt','leather',183,591,0,187,22,99,'pants',features=['belt-seam'])
box('buckle','Belt buckle','metal',164,595,55,30,21,8,'belt','micro',features=['buckle-edge'])
part('watch-strap','Brown watch strap','leather',[(298,602,23,25,11,27,28)],parent='arm-right',features=['watch-strap'])
part('watch','Gold watch face','metal',[(309,615,48,12,16,5,28)],'micro',parent='watch-strap',features=['watch-bezel'])
# Instances follow the observed placket; emission realizes a repetition system.
box('button-source','Polo button','button',0,0,-3000,7,7,2,level='micro',features=['three-buttons'])
s['componentTree']=components
s['repetitionSystems']=[{'id':'placket-buttons','name':'Three placket buttons','sourceComponent':'button-source','count':3,'distribution':'linear','instances':[{'position':P(x,y,59),'rotation':[math.pi/2,0,0],'scale':[1,1,1]} for x,y in [(177,352),(170,378),(164,404)]],'buildsGeometry':True,'evidenceRefs':['full-object']}]
# Original hero materials use measured independent PBR evidence; utility only for invisible root.
base=copy.deepcopy(s['materials'][0]); mats=[]
colors={'skin':'#d69b73','shirt':'#e9e6df','pants':'#13171b','hair':'#111518','leather':'#17222b','eye':'#e8d8c3','lips':'#ba745b','metal':'#b5a17a','button':'#b1b0a9','hidden':'#000000'}
for mid,col in colors.items():
 m=copy.deepcopy(base);m.update({'id':mid,'name':mid,'color':col,'baseColor':col,'albedo':{'dominant':col,'secondary':[col]},'colorVariation':{'palette':[col,col],'pattern':'flat','amplitude':.015,'heightCorrelation':0},'textureProjection':{'mode':'orthographic-front-projection','texelDensityIntent':'source crop 250 px per model unit; inferred rear uses UV material maps'},'roughness':{'base':.48 if mid=='skin' else .7,'variation':.04,'map':'independent-procedural-field'},'localOverrides':[]})
 if mid in ['eye','metal']:m['roughness']['base']=.2
 if mid in ['eye','lips','metal','button']:
  # No resolved microscopic texture in these sub-30px details; geometry/colour defines them.
  for key in ['colorVariation','normal','bump','displacement','surfaceFrequencyBands','textureProjection','textureResolution','referencePbr']:m.pop(key,None)
  m['textureless']={'declared':True,'evidence':['full-object: sub-30px eye/lip/button/watch regions show smooth cartoon shading with no resolved pores, wear or repeating surface texture.']}
 if mid=='hidden':m['qualityTier']='utility';m['opacity']=0
 mats.append(m)
s['materials']=mats
# Each inventory item references its concrete semantic component feature.
details=[]
for cid,kind,feat,desc in [('hair','ridge','swept-quiff','Leftward rising quiff with swept lock peaks'),('hair','contour','temple-taper','Short temple sides join cranial hair'),('head','contour','rounded-chin','Small chin below broad smiling cheek mass'),('head','ridge','nose-tip','Rounded nose tip projects ahead of cheeks'),('brow-left','linework','arched-brows','Dark asymmetric arched brows'),('eye-left','gloss','brown-iris-left','Brown iris and corneal catchlight'),('eye-right','gloss','brown-iris-right','Brown iris and corneal catchlight'),('mouth','hole','upper-teeth-smile','Open smiling mouth exposes upper teeth'),('shirt','linework','collar-piping','Navy and gold polo collar piping'),('shirt','seam','cuff-piping','Dark stripe follows sleeve cuff'),('button-source','fastener','three-buttons','Three circular buttons down placket'),('notebook','bevel','notebook-binding','Rounded notebook binding and visible page edge'),('notebook','fastener','notebook-clasp','Small wraparound notebook clasp'),('arm-left','contour','notebook-grip','Bent fingers cross bottom of notebook'),('pants','seam','pocket-opening','Slanted pocket seam around tucked hand'),('buckle','bevel','buckle-edge','Rectangular belt buckle lip'),('watch','gloss','watch-bezel','Gold circular watch bezel'),('shoe-left','seam','shoe-cap','Leather cap-toe seam'),('shoe-right','contour','shoe-sole','Sole lip under shoe')]:
 details.append({'id':feat,'kind':kind,'description':desc,'region':{'x':0,'y':0,'width':1,'height':1,'units':'normalized'},'scale':'meso' if kind=='contour' else 'micro','affects':'geometry and material','mapsTo':{'type':'component.localFeatures','ref':f'{cid}/{feat}'},'evidenceRef':'full-object','confidence':.85})
p['detailInventory']={'scanMethod':'component-zones','targetMinDetails':10,'details':details};s['preSpecAssessment']=p
for mat in s['materials']:
 if mat['id']=='leather':mat['localOverrides']=[{'id':'shoe-polish','region':'shoe toes','roughness':.24,'evidenceRefs':['full-object']}]
s['featureReviewTargets']=[{'id':id,'name':name,'tier':'critical','passIds':['blockout','proportion-lock','feature-placement'],'minimumScore':.8,'mustPass':True,'componentRefs':refs,'evidenceRefs':['full-object']} for id,name,refs in [('anatomy-proportion','Oversized head and short body proportions',['head','shirt','pants']),('pose-silhouette','Book arm, pocket hand and asymmetric stance',['arm-left','arm-right','pants']),('face-landmark-placement','Eye spacing, smile and quiff',['head','eye-left','eye-right','mouth','hair'])]]
s['featureReviewTargets'].append({'id':'outfit-and-palette','name':'White piped polo, navy notebook and black trousers','tier':'important','passIds':['material-pass'],'minimumScore':.7,'mustPass':False,'componentRefs':['shirt','pants','notebook'],'evidenceRefs':['full-object']})
s['lightingFromPhoto']=['Warm broad key light camera upper-left at (-3,6,8), intensity 2.2','Cool weak fill light camera right (4,3,5), intensity .7','Blue rim light behind subject (2,5,-4), intensity 1.4','ACES tone mapping exposure 1; dark navy background #07111e; soft contact shadow under feet; neutral and grazing-light reviews required.']
s['qualityTargets']['reviewViewpoints']=['front','left35','right35','side90','rear135','rear180','head-front','head35']
s['performanceBudget']['targetTriangles']=250000
for b in s['buildPasses']:b['componentRefs']=[c['id'] for c in components]
save('assessment.json',a);save('detail-inventory.json',p['detailInventory']);save('character-sculpt-spec.json',s)
(RUN/'analysis.md').write_text('''# Reference analysis\nTarget: approved full-body cartoon, exact colored panel retained. Original photographic anatomy is not the target.\nMacro: 3.72 heads tall including hair; enlarged head, slim shoulders, bent left-screen book arm, right-screen pocket hand, asymmetric stance.\nMeso: volumetric cheeks/chin/nose; swept clumped black hair; white polo over torso and sleeves; independent notebook, belt, watch; trousers bridge pelvis into two legs.\nMicro: 19 inventoried landmarks/details mapped to components; brown irises, arched brows, exposed upper teeth, piping, buttons, notebook clasp, watch bezel, shoe seam.\nSurface decision: organic anatomy uses smooth union implicit fields, not extruded image contour. Props are distinct rounded solids. Projection uses de-lit front artwork and independent material channels.\nSuitability: CONDITIONAL. Front artwork is complete and legible; rear and depth are unobserved. User has explicitly accepted approximate rear. No exact full 360-degree likeness claim.\nLandmarks are agent measurements, not outputs of an automatic detector. Parametric head fit minimizes boundary landmark error; fit score is not visual acceptance.\nContracts read: reconstruction.md, likeness_maximization.md, structure_decomposition.md, head_construction.md, stylized_hair_threejs.md. Character static profile is appropriate: no articulation requested.\nDo not integrate until rendered front and orbit views pass actual visual review.\n''')
print('Authored',len(components),'components;',len(details),'details; head fit',f.parameters)
