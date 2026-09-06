'use client';
import {useLayoutEffect,useRef} from 'react';
import type {Anchors} from '@/lib/profile-anchors';

export function useIllustrationAnchors(progress:number,onAnchors:(anchors:Anchors)=>void) {
 const frame=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
   const element=frame.current;
   const stage=element?.closest('.scroll-stage');
   if(!element||!stage)return;
   const measure=()=>{
     const bounds=element.getBoundingClientRect();const viewport=stage.getBoundingClientRect();
     if(!viewport.width||!viewport.height)return;
     const point=(x:number,y:number):[number,number]=>[(bounds.left-viewport.left+bounds.width*x)/viewport.width*1000,(bounds.top-viewport.top+bounds.height*y)/viewport.height*1000];
     const card=window.matchMedia('(max-width:760px)').matches?stage.querySelector<HTMLElement>('.hologram-card[data-visible="true"][data-mobile="true"]'):null;
     onAnchors({left:point(.25,.43),right:point(.665,.51),mobileY:card?(card.getBoundingClientRect().top-viewport.top+12)/viewport.height*1000:undefined});
   };
   measure();
   const observer=new ResizeObserver(measure);observer.observe(element);observer.observe(stage);
   return()=>observer.disconnect();
 },[progress,onAnchors]);
 return frame;
}
