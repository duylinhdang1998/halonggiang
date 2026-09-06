import * as THREE from 'three';
import {silhouette,openings,REFERENCE,depthAt,backColor} from './reference-shape';
type Pixel=[number,number];
const midpoint=(a:Pixel,b:Pixel):Pixel=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
function subdivide(a:Pixel,b:Pixel,c:Pixel,output:Pixel[],level=0) {
 // Equal edge subdivision on every base triangle prevents depth cracks at shared edges.
 if(level>=4){output.push(a,b,c);return;}
 const ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);
 subdivide(a,ab,ca,output,level+1);subdivide(ab,b,bc,output,level+1);subdivide(ca,bc,c,output,level+1);subdivide(ab,bc,ca,output,level+1);
}
export function createReferenceGeometry(back=false) {
 const contour=silhouette.map(([x,y])=>new THREE.Vector2(x,-y));const holes=openings.map(polygon=>polygon.map(([x,y])=>new THREE.Vector2(x,-y)));
 const vertices=[...contour,...holes.flat()];const triangles=THREE.ShapeUtils.triangulateShape(contour,holes);const pixels:Pixel[]=[];
 for(const tri of triangles)subdivide(...tri.map(i=>[vertices[i].x,-vertices[i].y] as Pixel) as [Pixel,Pixel,Pixel],pixels);
 const positions:number[]=[],uv:number[]=[],colors:number[]=[];
 for(let i=0;i<pixels.length;i+=3)for(const offset of back?[2,1,0]:[0,1,2]){const [x,y]=pixels[i+offset],z=depthAt(x,y)*(back?-1:1);positions.push((x-REFERENCE.centerX)*REFERENCE.scale,(REFERENCE.bottom-y)*REFERENCE.scale,z);uv.push(x/REFERENCE.width,1-y/REFERENCE.height);const color=new THREE.Color(backColor(x,y));colors.push(color.r,color.g,color.b);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 // Derive smooth normals from the same continuous depth field, avoiding faceted lighting.
 const normals:number[]=[];for(let i=0;i<pixels.length;i+=3)for(const offset of back?[2,1,0]:[0,1,2]){const [x,y]=pixels[i+offset];const dx=(depthAt(x+1,y)-depthAt(x-1,y))/(2*REFERENCE.scale),dy=(depthAt(x,y+1)-depthAt(x,y-1))/(2*REFERENCE.scale);const n=new THREE.Vector3(-dx,dy,back?-1:1).normalize();normals.push(n.x,n.y,n.z);}
 geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));return geometry;
}
export function createReferenceRim() {
 const positions:number[]=[],colors:number[]=[];
 for(const polygon of [silhouette,...openings]){for(let i=0;i<polygon.length;i++){for(let step=0;step<16;step++){
  const from=polygon[i],to=polygon[(i+1)%polygon.length];const at=(t:number)=>[from[0]+(to[0]-from[0])*t,from[1]+(to[1]-from[1])*t];const a=at(step/16),b=at((step+1)/16);
  for(const [p,side] of [[a,1],[b,1],[a,-1],[b,1],[b,-1],[a,-1]] as [number[],number][]){positions.push((p[0]-REFERENCE.centerX)*REFERENCE.scale,(REFERENCE.bottom-p[1])*REFERENCE.scale,.008*side);const color=new THREE.Color(backColor(...p as [number,number]));colors.push(color.r,color.g,color.b);}
 }}}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();return geometry;
}
