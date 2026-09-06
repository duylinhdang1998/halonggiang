'use client';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {projectReference} from '../../model-workbench/project-reference';
import {createHaLongGiangApprovedCartoonModel} from '../../model-workbench/createGiangGenerated';

type Lab={angle:(v:number)=>void;capture:()=>void;geometry:()=>void;mode:(v:boolean)=>void};
export default function ModelLab(){
 const host=useRef<HTMLDivElement>(null),lab=useRef<Lab|null>(null);
 const [angle,setAngle]=useState(0),[status,setStatus]=useState('Đang dựng khối…');
 useEffect(()=>{
  if(!host.current)return;
  const element=host.current;
  const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(404,1065);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  element.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#07111e');
  const camera=new THREE.OrthographicCamera(-202/250,202/250,1065/500,-1065/500,.1,40);camera.position.set(0,(1048-1065/2)/250,12);camera.lookAt(0,(1048-1065/2)/250,0);
  const model=createHaLongGiangApprovedCartoonModel({textureSize:128});scene.add(model);model.updateMatrixWorld(true);
  const ambient=new THREE.HemisphereLight('#d6e4ef','#5c5553',1.8);scene.add(ambient);
  const key=new THREE.DirectionalLight('#ffeddc',2.2);key.position.set(-3,6,8);scene.add(key);const fill=new THREE.DirectionalLight('#c7e9ff',.7);fill.position.set(4,3,5);scene.add(fill);const rim=new THREE.DirectionalLight('#73d4ed',1.4);rim.position.set(2,5,-4);scene.add(rim);
  const meshes:THREE.Mesh[]=[];model.traverse(o=>{if(o instanceof THREE.Mesh)meshes.push(o);});
  let degrees=0,clay=true;
  const originals=new Map<THREE.Mesh,THREE.Material|THREE.Material[]>();
  for(const mesh of meshes){originals.set(mesh,mesh.material);if(mesh.name.toLowerCase().includes('root'))mesh.visible=false;}
  const clayMat=new THREE.MeshStandardMaterial({color:'#c5c3bc',roughness:.85});
  const draw=()=>renderer.render(scene,camera);
  const download=async(href:string,name:string)=>{const blob=await(await fetch(href)).blob();const result=await fetch('/__model-evidence',{method:'POST',headers:{'x-evidence-name':name},body:blob});setStatus(result.ok?`Đã lưu ${name}`:'Không lưu được ảnh');};
  const mode=(v:boolean)=>{clay=v;meshes.forEach(m=>{m.material=v?clayMat:originals.get(m)!;});draw();};
  const disposeProjection=projectReference(model,draw);
  mode(true);
  lab.current={angle(v){degrees=v;model.rotation.y=THREE.MathUtils.degToRad(v);draw();},mode,capture(){draw();void download(renderer.domElement.toDataURL('image/png'),`giang-blockout-${degrees}-${clay?'clay':'color'}.png`);},geometry(){
   model.updateMatrixWorld(true);const out=meshes.filter(m=>m.visible).map(m=>({name:m.name,material:(Array.isArray(m.material)?m.material:[m.material]).map(v=>v.toJSON()),positions:Array.from(m.geometry.attributes.position.array),indices:m.geometry.index?Array.from(m.geometry.index.array):[],matrixWorld:m.matrixWorld.toArray()}));const url=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:'application/json'}));void download(url,'giang-blockout-meshes.json');setTimeout(()=>URL.revokeObjectURL(url),1000);
  }};
  setStatus(`${meshes.length} bộ phận · bản thử, chưa đạt nghiệm thu`);
  const timer=setInterval(draw,1500);
  return()=>{clearInterval(timer);lab.current=null;meshes.forEach(m=>m.geometry.dispose());for(const mat of originals.values())for(const m of Array.isArray(mat)?mat:[mat]){for(const v of Object.values(m))if(v instanceof THREE.Texture)v.dispose();m.dispose();}disposeProjection();clayMat.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
 },[]);
 return <main style={{background:'#08111c',color:'#e2e9ee',minHeight:'100vh',padding:24,fontFamily:'system-ui'}}>
 <p style={{marginBottom:12}}>img2threejs — kiểm tra bản dựng · {status}</p>
 <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:18}}>{[0,35,-35,90,135,180,270].map(v=><button key={v} style={{padding:10,border:'1px solid #567',borderRadius:8}} onClick={()=>{setAngle(v);lab.current?.angle(v);}}>{v}°</button>)}
 <button onClick={()=>lab.current?.mode(true)}>Khối trơn</button><button onClick={()=>lab.current?.mode(false)}>Vật liệu</button><button onClick={()=>lab.current?.capture()}>Lưu ảnh {angle}°</button><button onClick={()=>lab.current?.geometry()}>Xuất hình học</button></div>
 <div style={{display:'flex',gap:24,alignItems:'start'}}><figure><figcaption>Mẫu đã duyệt</figcaption><Image unoptimized src='/model-evidence/approved-front.png' width={404} height={1065} alt='Mẫu nhân vật hoạt hình đã duyệt'/></figure><figure><figcaption>Ảnh dựng thực tế · {angle}°</figcaption><div ref={host} /></figure></div>
 </main>;
}
