'use client';
import {lazy,Suspense} from 'react';
import {useBackgroundMotion} from '@/hooks/use-background-motion';
import styles from './ProfileBackground.module.css';

const Lightfall=lazy(()=>import('@/components/backgrounds/Lightfall'));
const COLORS=['#70e2f4','#36a9c0','#d4f7ff'];

export default function ProfileBackground() {
 const {enabled,paused,dpr}=useBackgroundMotion();
 return <div className={styles.background} aria-hidden="true" data-background="lightfall" data-motion={enabled?'animated':'static'}>
   <div className={styles.halo}/>
   <div className={styles.lightField}>
     {enabled&&<Suspense fallback={null}><Lightfall colors={COLORS} backgroundColor="#123c50" speed={.22} streakCount={2} streakWidth={.65} streakLength={.75} glow={.5} density={.35} twinkle={.1} zoom={3} backgroundGlow={.18} opacity={.7} mouseInteraction={false} paused={paused} dpr={dpr} mixBlendMode="screen"/></Suspense>}
   </div>
   <div className={styles.horizon}/><div className={styles.floor}/>
   <div className={styles.vignette}/>
 </div>;
}
