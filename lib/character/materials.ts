import * as THREE from 'three';
export const revealUniform={value:0};
export function applyReveal(material:THREE.Material,kind:'color'|'wire'|'shell') {
 const previousCompile=material.onBeforeCompile.bind(material);
 const previousKey=material.customProgramCacheKey();
 material.onBeforeCompile=(shader,renderer)=>{
  previousCompile(shader,renderer);
  shader.uniforms.revealLevel=revealUniform;
  shader.vertexShader='varying float vWorldHeight;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvWorldHeight=(modelMatrix*vec4(transformed,1.0)).y;');
  shader.fragmentShader='uniform float revealLevel; varying float vWorldHeight;\n'+shader.fragmentShader;
  const comparison=kind==='color'?'<':'>=';
  shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>\nif(vWorldHeight ${comparison} mix(5.9,-.2,revealLevel)) discard;`);
  if(kind==='color')shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\nfloat scan=1.0-smoothstep(0.0,.045,abs(vWorldHeight-mix(5.9,-.2,revealLevel))); gl_FragColor.rgb+=vec3(.22,.7,.8)*scan;');
 };
 material.customProgramCacheKey=()=>`${previousKey}-giang-${kind}-reveal-v3`;return material;
}
export function createRevealMaterial(color:string,roughness=.6,metalness=0) {return applyReveal(new THREE.MeshStandardMaterial({color,roughness,metalness}),'color');}
export function createWireMaterial() {return applyReveal(new THREE.MeshBasicMaterial({color:'#70e2f4',wireframe:true,transparent:true,opacity:.28,depthWrite:false}),'wire');}
export function createSkeletonMaterial() {return applyReveal(new THREE.MeshBasicMaterial({color:'#091a24',polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}),'shell');}
