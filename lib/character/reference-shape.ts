// Silhouette traced in pixel coordinates from the approved giang-character.png.
// Original pixels are used directly for the front; there is no regenerated face.
export const REFERENCE={width:1419,height:1109,centerX:440,bottom:1074,scale:5.6/1030,wireOffset:600};
export const silhouette:number[][]=[
 [373,49],[396,47],[424,50],[451,60],[469,78],[478,101],[492,103],[505,118],[508,154],[506,187],[511,200],
 [520,195],[528,202],[531,219],[527,240],[515,253],[508,253],[500,279],[486,303],[480,312],
 [493,312],[503,327],[522,336],[548,348],[569,365],[582,390],[591,420],[599,446],[603,470],[606,483],
 [611,513],[612,538],[603,568],[585,603],[567,637],[555,660],[552,674],[539,691],
 [540,742],[544,803],[547,862],[553,920],[563,978],[562,999],[568,1019],[572,1047],[565,1063],[550,1070],[529,1072],[508,1065],[497,1056],[493,1042],[499,1012],[494,988],
 [478,936],[465,883],[450,826],[435,777],[425,741],[421,719],[415,740],[406,790],[399,843],[393,896],[390,944],[389,969],[385,987],
 [401,1002],[421,1016],[421,1032],[409,1039],[374,1043],[342,1046],[307,1046],[284,1041],[273,1034],[275,1024],[288,1014],[314,1004],[341,984],
 [350,958],[349,924],[353,866],[356,810],[357,756],[353,707],[349,669],[343,638],[337,616],[316,606],
 [297,596],[282,582],[276,570],[274,550],[280,527],[289,508],[291,488],[287,485],[292,464],[294,444],[306,413],[316,390],[332,374],[354,364],[374,353],[388,340],
 [391,324],[370,315],[349,297],[338,277],[330,268],[321,268],[316,258],[313,237],[318,226],[326,226],
 [322,205],[317,182],[316,151],[311,123],[303,111],[309,93],[326,79],[322,76],[342,65],[337,60],[379,59]
];
// Openings between the arm and torso, and the empty area above the resting hand.
export const openings:number[][][]=[[[537,499],[547,498],[550,517],[545,540],[537,560],[529,577],[522,586],[524,555],[530,526]]];
const segmentDistance=(x:number,y:number,a:number[],b:number[])=>{const dx=b[0]-a[0],dy=b[1]-a[1];const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);};
export function edgeDistance(x:number,y:number) {let distance=Infinity;for(const polygon of [silhouette,...openings])for(let i=0;i<polygon.length;i++)distance=Math.min(distance,segmentDistance(x,y,polygon[i],polygon[(i+1)%polygon.length]));return distance;}
export function depthAt(x:number,y:number) {
 const edge=Math.sqrt(Math.min(1,edgeDistance(x,y)/48));
 const thickness=y<325?.42:y<640?.34:.23;
 const nose=.15*Math.exp(-(((x-410)/28)**2)-(((y-247)/24)**2));
 return Math.max(.008,edge*(thickness+nose));
}
export function backColor(x:number,y:number) {
 if(y<294)return (x<334||x>509)&&y>197?'#c88e69':'#17212a';
 if(y<334)return '#d29a73';
 if(y>995)return '#101922';
 if(y>638)return '#182029';
 if(y>482&&(x<333||x>547))return '#d49c77';
 return '#e8e5dd';
}
