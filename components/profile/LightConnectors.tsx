'use client';
import {cardMotion} from '@/lib/scroll-state.mjs';

type Props={progress:number;pair:number;zoom:number};
export default function LightConnectors({progress,pair,zoom}:Props) {
 const left=cardMotion(progress,pair,'left');
 const right=cardMotion(progress,pair,'right');
 const leftX=500-55*zoom;
 const rightX=500+55*zoom;
 return <svg className="light-connectors" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
   <g className="connector-left" opacity={left.line}>
     <path className="connector-glow" d={`M${leftX},350 L365,430 H285`} pathLength={1} strokeDasharray={1} strokeDashoffset={1-left.line}/>
     <path d={`M${leftX},350 L365,430 H285`} pathLength={1} strokeDasharray={1} strokeDashoffset={1-left.line}/>
     <circle cx={leftX} cy={350} r={3}/>
   </g>
   <g className="connector-right" opacity={right.line}>
     <path className="connector-glow" d={`M${rightX},455 L635,540 H715`} pathLength={1} strokeDasharray={1} strokeDashoffset={1-right.line}/>
     <path d={`M${rightX},455 L635,540 H715`} pathLength={1} strokeDasharray={1} strokeDashoffset={1-right.line}/>
     <circle cx={rightX} cy={455} r={3}/>
   </g>
 </svg>;
}
