import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {applyReveal,createSkeletonMaterial} from './materials';
import {createBlenderScanMaterial} from './blenderScanMaterial';

function releaseAsset(asset:THREE.Object3D) {
 const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
 asset.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>materials.add(material));}});
 materials.forEach(material=>{for(const value of Object.values(material))if(value instanceof THREE.Texture)textures.add(value);material.dispose();});
 geometries.forEach(geometry=>geometry.dispose());textures.forEach(texture=>{texture.dispose();if(typeof ImageBitmap!=='undefined'&&texture.image instanceof ImageBitmap)texture.image.close();});
}

export function createGiangModel(onReady:()=>void,onError:()=>void) {
 let disposed=false;
 const root=Object.assign(new THREE.Group(),{disposeResources(){if(disposed)return;disposed=true;releaseAsset(root);root.clear();}});
 root.name='HaLongGiang-Blender';
 root.userData={source:'Blender-5.2.1-native',height:5.6,inferred:['sides','rear'],visualAcceptance:'trial'};
 new GLTFLoader().load('/models/giang-continuous.glb',gltf=>{
  const asset=gltf.scene;
  if(disposed){releaseAsset(asset);return;}
  const meshes:THREE.Mesh[]=[];const materials=new Set<THREE.Material>();
  asset.traverse(object=>{if(object instanceof THREE.Mesh){meshes.push(object);(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>materials.add(material));}});
  if(!meshes.length){releaseAsset(asset);onError();return;}
  materials.forEach(material=>{material.toneMapped=false;applyReveal(material,'color');});
  const wireMaterial=createBlenderScanMaterial(),shellMaterial=createSkeletonMaterial();
  for(const mesh of meshes){
   const wire=new THREE.Mesh(mesh.geometry,mesh.userData.continuous_upper_body?createBlenderScanMaterial(true):wireMaterial);wire.name=`${mesh.name}-scan-grid`;
   const shell=new THREE.Mesh(mesh.geometry,shellMaterial);shell.name=`${mesh.name}-scan-shell`;
   mesh.add(shell,wire);
  }
  root.add(asset);onReady();
 },undefined,()=>{if(!disposed)onError();});
 return root;
}
