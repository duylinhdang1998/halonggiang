import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {ellipsoid,loft,sweep,taperedLimb} from './geometry';
import type {Point} from './geometry';
import {createRevealMaterial,createWireMaterial,createSkeletonMaterial} from './materials';
// Procedural trial informed by img2threejs character decomposition; hidden views inferred.
export function createGiangModel() {
 const root=new THREE.Group(); root.name='HaLongGiang';
 const materials={skin:createRevealMaterial('#dca27f'),ear:createRevealMaterial('#c78870'),hair:createRevealMaterial('#111923',.42),white:createRevealMaterial('#f1f0e9',.85),navy:createRevealMaterial('#16364b',.62),black:createRevealMaterial('#141c27',.85),eye:createRevealMaterial('#22202b',.2),teeth:createRevealMaterial('#fff6e5',.35),mouth:createRevealMaterial('#753f39'),gold:createRevealMaterial('#bda46b',.3,.7)};
 const wire=createWireMaterial();const shell=createSkeletonMaterial();
 const add=(name:string,geometry:THREE.BufferGeometry,material:THREE.Material,position:Point=[0,0,0],parent:THREE.Group=root)=>{const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(...position);parent.add(mesh);const grid=new THREE.Mesh(geometry,wire);grid.name=name+'-wire';mesh.add(grid);const depthShell=new THREE.Mesh(geometry,shell);depthShell.name=name+'-shell';mesh.add(depthShell);return mesh;};
 const orb=(name:string,position:Point,size:Point,material:THREE.Material,parent=root)=>add(name,ellipsoid(size),material,position,parent);
 const line=(name:string,points:Point[],radius:number,material:THREE.Material,parent=root)=>add(name,sweep(points,radius),material,[0,0,0],parent);
 const box=(name:string,position:Point,size:Point,material:THREE.Material,radius=.03,parent=root)=>add(name,new RoundedBoxGeometry(...size,3,radius),material,position,parent);
 // Closed continuous torso, with a fitted waist and rounded shoulder contour.
 add('polo-torso',loft([[2.28,0,0],[2.3,.46,.27],[2.48,.53,.31],[2.9,.57,.34],[3.36,.62,.34],[3.67,.72,.29],[3.83,.63,.23],[3.93,.31,.18],[3.94,0,0]]),materials.white);
 add('trousers-hips',loft([[1.91,0,0],[1.98,.5,.28],[2.32,.49,.28],[2.38,0,0]]),materials.black);
 box('belt',[0,2.35,.005],[1.02,.09,.56],materials.eye);
 box('belt-buckle',[0,2.35,.301],[.18,.1,.025],materials.gold,.015);
 for(const side of [-1,1]) {
  const leg=add(`leg-${side}`,loft([[.19,0,0],[.22,.18,.17],[.5,.18,.18],[1,.19,.19],[1.44,.215,.22],[1.94,.25,.26],[2.07,.21,.24],[2.1,0,0]]),materials.black,[side*.265,0,0]);leg.rotation.z=side*-.025;
  box(`shoe-${side}`,[side*.285,.15,.105],[.4,.27,.66],materials.eye,.1);
  box(`sole-${side}`,[side*.285,.045,.1],[.41,.055,.67],materials.navy,.025);
  line(`trouser-crease-${side}`,[[side*.265,.43,.18],[side*.275,1.05,.2],[side*.28,1.69,.245]],.009,materials.navy);
 }
 orb('neck',[0,4,.0],[.23,.35,.21],materials.skin);
 // Collar is a pair of rounded folded cloth pieces with dark piping.
 for(const side of [-1,1]) {const collar=box(`collar-${side}`,[side*.205,3.925,.18],[.32,.35,.075],materials.white,.025);collar.rotation.z=side*.48;line(`collar-piping-${side}`,[[side*.1,4.12,.205],[side*.31,3.96,.218],[side*.22,3.77,.23]],.012,materials.navy);}
 box('placket',[0,3.58,.333],[.10,.39,.025],materials.white,.015);
 for(let i=0;i<3;i++) orb(`polo-button-${i}`,[0,3.73-i*.12,.358],[.021,.021,.01],materials.teeth);
 // Character-right arm supports the notebook; left wrist rests next to the pocket.
 for(const side of [-1,1]) {const sleeve=orb(`sleeve-${side}`,[side*.705,3.48,.005],[.28,.385,.285],materials.white);sleeve.rotation.z=side*.3;}
 add('right-arm',taperedLimb([[-.82,3.27,.02],[-.91,2.92,.11],[-.85,2.7,.27],[-.52,2.65,.48],[-.21,2.72,.51]],[.205,.18,.17,.145,.125]),materials.skin);
 add('left-arm',taperedLimb([[.82,3.27,.02],[.97,2.88,.01],[.95,2.67,.055],[.8,2.36,.16]],[.205,.18,.16,.13]),materials.skin);
 orb('left-hand',[.73,2.29,.21],[.155,.2,.115],materials.skin);
 const book=box('notebook',[-.28,2.98,.49],[.58,.83,.12],materials.navy,.04);book.rotation.z=.10;
 box('notebook-pages',[-.279,3.0,.44],[.52,.72,.07],materials.white,.015);
 box('notebook-strap',[-.03,3.1,.574],[.21,.085,.025],materials.navy,.015);
 orb('right-hand',[-.19,2.69,.59],[.25,.10,.12],materials.skin);
 for(let i=0;i<4;i++) {line(`right-finger-${i}`,[[-.36+i*.1,2.67,.65],[-.34+i*.1,2.76,.67],[-.31+i*.1,2.81,.62]],.033,materials.skin);}
 box('watch-strap',[.815,2.43,.17],[.27,.12,.25],materials.eye,.03);
 box('watch-case',[.815,2.44,.308],[.16,.18,.05],materials.gold,.03);
 box('watch-face',[.815,2.44,.338],[.12,.14,.009],materials.white,.02);
 // Head: a single shaped surface, with a tapered jaw and continuous forehead.
 const head=new THREE.Group();head.name='head';head.position.set(0,4.47,0);root.add(head);
 add('face',loft([[-.39,0,0,.015],[-.35,.22,.21,.035],[-.26,.36,.29,.035],[-.07,.46,.36,.01],[.15,.49,.385,0],[.4,.48,.36,-.015],[.6,.40,.30,-.025],[.72,.20,.15,-.03],[.75,0,0,-.03]],48),materials.skin,[0,0,0],head);
 for(const side of [-1,1]) {
  orb(`ear-${side}`,[side*.48,.1,0],[.105,.165,.085],materials.skin,head);orb(`ear-concha-${side}`,[side*.518,.1,.063],[.044,.095,.02],materials.ear,head);
  orb(`eye-white-${side}`,[side*.2,.19,.347],[.126,.07,.041],materials.teeth,head);
  orb(`iris-${side}`,[side*.195,.185,.384],[.047,.052,.017],materials.eye,head);
  orb(`eye-catchlight-${side}`,[side*.195-.015,.205,.399],[.012,.015,.007],materials.teeth,head);
  line(`upper-lid-${side}`,[[side*.08,.2,.366],[side*.18,.257,.372],[side*.28,.229,.335],[side*.33,.195,.31]],.014,materials.ear,head);
  line(`eyebrow-${side}`,[[side*.095,.335,.36],[side*.19,.362,.35],[side*.29,.348,.316],[side*.35,.32,.286]],.025,materials.hair,head);
 }
 orb('nose-bridge',[0,.09,.355],[.06,.15,.07],materials.skin,head);orb('nose-tip',[0,.005,.429],[.082,.06,.064],materials.skin,head);
 orb('smile-cavity',[0,-.17,.332],[.21,.075,.032],materials.mouth,head);
 orb('smile-teeth',[0,-.147,.358],[.174,.031,.012],materials.teeth,head);
 line('lower-lip',[[-.17,-.188,.345],[0,-.233,.357],[.17,-.188,.345]],.018,materials.ear,head);
 // Scalp is an enclosed asymmetric shell. Raised sweep locks share embedded roots.
 const scalp=ellipsoid([.505,.43,.39]);const scalpPositions=scalp.attributes.position;
 for(let i=0;i<scalpPositions.count;i++){const x=scalpPositions.getX(i),y=scalpPositions.getY(i);scalpPositions.setY(i,y+.58+(x<0?-.12*x:0));}scalp.computeVertexNormals();
 add('hair-crown',scalp,materials.hair,[0,0,-.05],head);
 for(const side of [-1,1]) orb(`hair-side-${side}`,[side*.438,.35,-.075],[.068,.25,.24],materials.hair,head);
 for(let i=0;i<6;i++) {const z=.21-i*.075;add(`swept-lock-${i}`,taperedLimb([[-.44,.56,z],[-.29,.84,z+.09],[.05,.91,z+.08],[.35,.76,z-.04]],[.075,.10,.08,.012]),materials.hair,[0,0,0],head);}
 root.userData={source:'procedural-img2threejs-guided-trial',likeness:'stylized-approximation',inferred:['rear','feet','depth'],height:5.6};
 return root;
}
