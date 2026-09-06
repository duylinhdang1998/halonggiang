import * as THREE from 'three';
import {applyReveal} from './materials';

/** Follow the Blender surface UVs so the scan stays readable on a dense, smooth mesh. */
export function createBlenderScanMaterial(continuous=false) {
 const material=new THREE.MeshBasicMaterial({color:'#70e2f4',transparent:true,opacity:.6,depthWrite:false});
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec2 vScanUV; varying vec3 vScanPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvScanUV=uv; vScanPosition=position;');
  shader.fragmentShader='varying vec2 vScanUV; varying vec3 vScanPosition;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>',`#include <dithering_fragment>
    ${continuous ? `float axisX=-.08-max(0.0,vScanPosition.y-4.3)*.12;
    vec2 scan=vec2(atan(vScanPosition.x-axisX,vScanPosition.z)/6.2831853,(vScanPosition.y-2.5)/1.7);` : 'vec2 scan=vScanUV;'}
    vec2 grid=scan*vec2(28.0,32.0);
    vec2 edge=abs(fract(grid-.5)-.5)/max(fwidth(grid),vec2(.001));
    float line=1.0-smoothstep(.25,1.0,min(edge.x,edge.y));
    if(line<.02) discard;
    gl_FragColor.a*=line;`);
 };
 material.customProgramCacheKey=()=> `blender-surface-scan-v2-${continuous}`;
 return applyReveal(material,'wire');
}
