import * as THREE from 'three';
/** Implements the img2threejs projection descriptor on the generated volumetric component mesh. */
export function projectReference(root:THREE.Group,onReady:()=>void){
 const replacedMaps=new Set<THREE.Texture>();
 const texture=new THREE.TextureLoader().load('/model-evidence/albedo.png',onReady);
 texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
 root.updateMatrixWorld(true);
 root.traverse(object=>{
  if(!(object instanceof THREE.Mesh))return;
  const mesh=object;
  const p=mesh.geometry.getAttribute('position'),n=mesh.geometry.getAttribute('normal');
  const uv=new Float32Array(p.count*2),weights=new Float32Array(p.count);
  const point=new THREE.Vector3(),normal=new THREE.Vector3(),normalMatrix=new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  for(let i=0;i<p.count;i++){
   point.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);
   normal.fromBufferAttribute(n,i).applyMatrix3(normalMatrix).normalize();
   uv[i*2]=(point.x*250+202)/404;uv[i*2+1]=1-(1048-point.y*250)/1065;
   weights[i]=THREE.MathUtils.smoothstep(normal.z,.02,.32);
   // Keep the reference's ear pixels off the cheek volume; ears have separate geometry.
   if(mesh.name.includes('Fitted cranium')){
    const px=point.x*250+202;
    weights[i]*=THREE.MathUtils.smoothstep(px,97,110)*(1-THREE.MathUtils.smoothstep(px,241,253));
   }
  }
  mesh.geometry.setAttribute('photoUv',new THREE.BufferAttribute(uv,2));mesh.geometry.setAttribute('photoWeight',new THREE.BufferAttribute(weights,1));
  for(const original of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
   if(!(original instanceof THREE.MeshStandardMaterial))continue;
   const recipe=original.userData.sculptMaterial as {color?:string}|undefined;
   original.color.set(recipe?.color??'#888888');
   if(original.map)replacedMaps.add(original.map);
   original.map=null;original.bumpScale=0;original.aoMapIntensity=.08;
   if(original instanceof THREE.MeshPhysicalMaterial){original.clearcoat=0;original.transmission=0;original.sheen=0;original.specularIntensity=.15;original.anisotropy=0;}
   original.metalness=mesh.name.toLowerCase().includes('watch')?.65:0;
   original.normalScale.set(.03,.03);original.displacementScale=0;original.roughness=.68;
   original.onBeforeCompile=shader=>{
    shader.uniforms.referencePhoto={value:texture};
    shader.vertexShader='attribute vec2 photoUv; attribute float photoWeight; varying vec2 vPhotoUv; varying float vPhotoWeight;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvPhotoUv=photoUv;vPhotoWeight=photoWeight;');
    shader.fragmentShader='uniform sampler2D referencePhoto; varying vec2 vPhotoUv; varying float vPhotoWeight;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nvec4 referenceSample=texture2D(referencePhoto,vPhotoUv);diffuseColor.rgb=mix(diffuseColor.rgb,referenceSample.rgb,vPhotoWeight);');
    // The stylized source retains residual baked shading after de-lighting. Use a predominantly
    // unlit front response so that new scene lights do not double those shadows.
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>','outgoingLight=mix(outgoingLight,referenceSample.rgb*1.35,0.85*vPhotoWeight);\n#include <opaque_fragment>');
   };
   original.customProgramCacheKey=()=> 'giang-reference-projection-1';original.needsUpdate=true;
  }
 });
 return ()=>{texture.dispose();replacedMaps.forEach(map=>map.dispose());};
}
