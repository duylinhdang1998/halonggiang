'use client';
import {useEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {chapterProgress,timelineState} from '@/lib/scroll-state.mjs';
const SCROLL_SCREENS = 7;
const SCRUB_SECONDS = .65;

export function useProfileScroll() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [progress,setProgress] = useState(0);
  useEffect(()=>{
    gsap.registerPlugin(ScrollTrigger);
    const playhead = {progress:0};
    const context = gsap.context(()=>{
      const tween = gsap.to(playhead,{progress:1,ease:'none',onUpdate:()=>setProgress(playhead.progress),scrollTrigger:{trigger:root.current,pin:'.scroll-stage',start:'top top',end:()=>`+=${window.innerHeight*SCROLL_SCREENS}`,scrub:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? true : SCRUB_SECONDS,invalidateOnRefresh:true}});
      trigger.current = tween.scrollTrigger ?? null;
    },root);
    return ()=>{trigger.current=null;context.revert();};
  },[]);
  const goTo = (chapter:number)=>{
    const scene = trigger.current;
    if (!scene) return;
    window.scrollTo({top:scene.start+chapterProgress(chapter)*(scene.end-scene.start),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return {root,goTo,...timelineState(progress)};
}
