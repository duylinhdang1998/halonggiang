import * as THREE from 'three';
import {createGiangModel} from './createGiangModel';
import {revealUniform} from './materials';
export type Anchors={left:[number,number];right:[number,number];mobileY?:number};
export function mountCharacter(host:HTMLElement,onAnchors:(anchors:Anchors)=>void) {
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 host.appendChild(renderer.domElement);const canvas=renderer.domElement;
 canvas.setAttribute('aria-hidden','true');
 let angle=0,pitch=0,zoom=1,dirty=true,disposed=false;
 const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-2,2,3.2,-3.2,.1,60);const target=new THREE.Vector3(0,2.8,0);
 const model=createGiangModel(()=>{dirty=true;});scene.add(model);
 scene.add(new THREE.HemisphereLight(0xdbeeff,0x344053,1.8));
 const key=new THREE.DirectionalLight(0xffe4ca,2.7);key.position.set(-3,7,5);scene.add(key);
 const fill=new THREE.DirectionalLight(0xb8e5ff,1.1);fill.position.set(4,3,4);scene.add(fill);
 const rim=new THREE.DirectionalLight(0x70e2f4,3.2);rim.position.set(2,5,-4);scene.add(rim);
 const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.left=-3.2*width/height;camera.right=3.2*width/height;camera.updateProjectionMatrix();dirty=true;};
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 const draw=()=>{if(!dirty||document.hidden||disposed)return;model.rotation.set(pitch,angle,0);camera.zoom=zoom;camera.updateProjectionMatrix();camera.position.set(0,2.8,12);camera.lookAt(target);renderer.render(scene,camera);const rect=host.getBoundingClientRect();const project=(x:number,y:number):[number,number]=>{const p=new THREE.Vector3(x,y,.18).applyMatrix4(model.matrixWorld).project(camera);return [(rect.left+(p.x+1)*rect.width/2)/document.documentElement.clientWidth*1000,(rect.top+(1-p.y)*rect.height/2)/window.innerHeight*1000];};const card=window.matchMedia('(max-width:760px)').matches?host.closest('.scroll-stage')?.querySelector<HTMLElement>('.hologram-card[data-visible="true"][data-mobile="true"]'):null;onAnchors({left:project(-.65,3.5),right:project(.7,2.95),mobileY:card?(card.getBoundingClientRect().top+12)/window.innerHeight*1000:undefined});host.dataset.angle=angle.toFixed(3);host.dataset.zoom=zoom.toFixed(2);host.dataset.meshes=String(renderer.info.render.triangles);dirty=false;};
 renderer.setAnimationLoop(draw);
 let pointer:{id:number;x:number;y:number;angle:number;pitch:number;horizontal:boolean}|null=null;
 const down=(event:PointerEvent)=>{if(event.button!==0)return;pointer={id:event.pointerId,x:event.clientX,y:event.clientY,angle,pitch,horizontal:false};};
 const move=(event:PointerEvent)=>{if(!pointer||pointer.id!==event.pointerId)return;const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
 if(!pointer.horizontal&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){pointer.horizontal=true;canvas.setPointerCapture(event.pointerId);}
 if(pointer.horizontal){angle=pointer.angle+dx*.012;pitch=THREE.MathUtils.clamp(pointer.pitch+dy*.003,-.22,.22);dirty=true;}
 };
 const up=()=>{pointer=null;};
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
 const visibility=()=>{dirty=true;};document.addEventListener('visibilitychange',visibility);
 return {update(reveal:number,nextZoom:number,rotation:number){revealUniform.value=reveal;zoom=nextZoom;if(rotation!==Number(host.dataset.rotationCommand??0)){angle+=rotation-Number(host.dataset.rotationCommand??0);pitch=0;host.dataset.rotationCommand=String(rotation);}dirty=true;},reset(){angle=0;pitch=0;dirty=true;},dispose(){disposed=true;observer.disconnect();renderer.setAnimationLoop(null);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();model.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>{for(const value of Object.values(m))if(value instanceof THREE.Texture)value.dispose();m.dispose();});renderer.dispose();renderer.forceContextLoss();canvas.remove();}};
}
