'use client';
import type {Anchors} from '@/lib/profile-anchors';
import {cardMotion} from '@/lib/scroll-state.mjs';
type Props={progress:number;pair:number;anchors:Anchors;mobileY:number};
export default function LightConnectors({progress,pair,anchors,mobileY}:Props) {
 return <svg className="light-connectors" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
  {(['left','right'] as const).map(side=>{const motion=cardMotion(progress,pair,side);const [x,y]=anchors[side];const d=side==='left'?`M${x},${y} L365,430 H285`:`M${x},${y} L635,540 H715`;
   return <g key={side} opacity={motion.line} data-phase={motion.phase}>
    <g className={`connector-${side}`}>
    <path className="connector-glow" d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1-motion.line}/>
    <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1-motion.line}/>
    <path className="connector-flow" d={d} pathLength={1} opacity={motion.opacity} strokeDasharray=".035 .965"/>
    <circle className="connector-ring" cx={x} cy={y} r={8}/><circle cx={x} cy={y} r={3}/>
   </g><g className="connector-mobile" opacity={motion.mobile?motion.mobileOpacity:0}><path className="connector-glow" d={`M${x},${y} L220,440 V${mobileY}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1-motion.line}/><path d={`M${x},${y} L220,440 V${mobileY}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1-motion.line}/><circle cx={x} cy={y} r={4}/></g></g>;
  })}
 </svg>;
}
