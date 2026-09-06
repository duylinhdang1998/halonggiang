import * as THREE from 'three';
import {createReferenceGeometry,createReferenceRim} from './reference-geometry';
import {createReferenceBackMaterial} from './reference-material';
import {REFERENCE} from './reference-shape';
import {revealUniform,createWireMaterial,createSkeletonMaterial} from './materials';
// Front-projected relief: exact approved front pixels, inferred rounded depth/rear.
export function createGiangModel(onTextureReady:()=>void) {
 const root=new THREE.Group();root.name='HaLongGiang-approved-reference';
 const texture=new THREE.TextureLoader().load('/giang-character.png',onTextureReady);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
 const frontMaterial=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,toneMapped:false});
 frontMaterial.onBeforeCompile=shader=>{
  shader.uniforms.revealLevel=revealUniform;shader.fragmentShader='uniform float revealLevel;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   vec4 fullColor=texture2D(map,vMapUv);
   vec4 wireColor=texture2D(map,vMapUv+vec2(${REFERENCE.wireOffset/REFERENCE.width},0.0));
   float threshold=1.0-(45.0+revealLevel*1030.0)/1109.0;
   float colored=step(threshold,vMapUv.y);
   diffuseColor *= mix(wireColor,fullColor,colored);
   float scan=(1.0-smoothstep(0.0,.0014,abs(vMapUv.y-threshold)))*step(.005,revealLevel)*(1.0-step(.995,revealLevel));
   diffuseColor.rgb+=vec3(.15,.55,.65)*scan;
  `);
 };
 frontMaterial.customProgramCacheKey=()=> 'approved-reference-front-v1';
 const front=new THREE.Mesh(createReferenceGeometry(),frontMaterial);front.name='approved-front-projection';root.add(front);
 const backGeometry=createReferenceGeometry(true);const backMaterial=createReferenceBackMaterial();backMaterial.side=THREE.DoubleSide;
 const back=new THREE.Mesh(backGeometry,backMaterial);back.name='inferred-back-volume';root.add(back);
 const wire=new THREE.Mesh(backGeometry,createWireMaterial());wire.name='rear-wire';root.add(wire);
 const shell=new THREE.Mesh(backGeometry,createSkeletonMaterial());shell.name='rear-depth-shell';root.add(shell);
 const rim=new THREE.Mesh(createReferenceRim(),backMaterial);rim.name='closed-silhouette-rim';root.add(rim);
 root.userData={source:'approved-image-projection',front:'original-pixels',geometry:'inflated-relief',inferred:['depth','rear'],height:5.6};return root;
}
