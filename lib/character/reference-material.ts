import {createRevealMaterial} from './materials';
import {REFERENCE} from './reference-shape';
// Fragment-space regions stay smooth even across long, narrow silhouette triangles.
export function createReferenceBackMaterial() {
 const material=createRevealMaterial('#ffffff',.86);const revealCompile=material.onBeforeCompile.bind(material);
 material.onBeforeCompile=(shader,renderer)=>{
  revealCompile(shader,renderer);shader.vertexShader='varying vec2 vReferencePoint;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nvReferencePoint=vec2(position.x/${REFERENCE.scale}+${REFERENCE.centerX}.0,${REFERENCE.bottom}.0-position.y/${REFERENCE.scale});`);
  shader.fragmentShader='varying vec2 vReferencePoint;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float x=vReferencePoint.x;float y=vReferencePoint.y;
   vec3 hair=vec3(.009,.015,.023), skin=vec3(.60,.33,.17), cloth=vec3(.81,.78,.72), pants=vec3(.012,.019,.028);
   vec3 region=mix(hair,skin,smoothstep(284.0,288.0,y));
   region=mix(region,cloth,smoothstep(330.0,334.0,y));
   float outerArm=max(1.0-smoothstep(329.0,336.0,x),smoothstep(543.0,551.0,x))*smoothstep(480.0,486.0,y);
   region=mix(region,skin,outerArm);
   region=mix(region,pants,smoothstep(632.0,638.0,y));
   diffuseColor.rgb*=region;
  `);
 };material.customProgramCacheKey=()=> 'reference-back-regions-v1';return material;
}
