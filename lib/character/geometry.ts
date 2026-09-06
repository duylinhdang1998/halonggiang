import * as THREE from 'three';
export type Point = [number,number,number];
export type Ring = [number,number,number,number?];
// Continuous elliptical rings keep organic silhouettes smooth rather than stacked primitives.
export function loft(rings:Ring[], segments=32) {
 const positions:number[]=[]; const indices:number[]=[];
 rings.forEach(([y,width,depth,z=0])=>{for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;positions.push(Math.cos(a)*width,y,Math.sin(a)*depth+z);}});
 for(let row=0;row<rings.length-1;row++) for(let i=0;i<segments;i++){const a=row*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
export function sweep(points:Point[], radius:number, segments=24) {return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),segments,radius,8,false);}
export function ellipsoid(size:Point) {const geometry=new THREE.SphereGeometry(1,32,24);geometry.scale(...size);return geometry;}
export function taperedLimb(points:Point[], radii:number[]) {
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const n=24;
 const geometry=new THREE.TubeGeometry(curve,n,1,16,false);const positions=geometry.attributes.position;
 for(let i=0;i<=n;i++) {const t=i/n*(radii.length-1),index=Math.min(Math.floor(t),radii.length-2),r=THREE.MathUtils.lerp(radii[index],radii[index+1],t-index);const center=curve.getPointAt(i/n);
 for(let j=0;j<=16;j++){const at=i*17+j;positions.setXYZ(at,center.x+(positions.getX(at)-center.x)*r,center.y+(positions.getY(at)-center.y)*r,center.z+(positions.getZ(at)-center.z)*r);}}
 geometry.computeVertexNormals();return geometry;
}
