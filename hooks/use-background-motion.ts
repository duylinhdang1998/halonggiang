'use client';
import {useEffect,useState} from 'react';

export function useBackgroundMotion() {
 const [motion,setMotion]=useState({enabled:false,paused:true,dpr:1});
 useEffect(()=>{
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
   const mobile=window.matchMedia('(max-width:760px)');
   const update=()=>setMotion({enabled:!reduced.matches,paused:document.hidden,dpr:mobile.matches?1:Math.min(window.devicePixelRatio,1.25)});
   update();reduced.addEventListener('change',update);mobile.addEventListener('change',update);document.addEventListener('visibilitychange',update);
   return()=>{reduced.removeEventListener('change',update);mobile.removeEventListener('change',update);document.removeEventListener('visibilitychange',update);};
 },[]);
 return motion;
}
