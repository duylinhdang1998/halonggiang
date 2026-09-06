'use client';
import {ArrowUpRight} from 'lucide-react';
import type {CSSProperties} from 'react';
import type {ProfileCardData} from '@/lib/profile-cards';
import {cardMotion} from '@/lib/scroll-state.mjs';

type Props={card:ProfileCardData;pair:number;side:'left'|'right';progress:number};
export default function HologramCard({card,pair,side,progress}:Props) {
 const motion=cardMotion(progress,pair,side);
 const mobileOpacity=Math.min(motion.opacity,motion.mobileOpacity);
 const style={'--mobile-opacity':mobileOpacity,'--mobile-clip':`${(1-mobileOpacity)*100}%`,'--mobile-scale':.9+mobileOpacity*.1,'--card-opacity':motion.opacity,'--card-offset':`${motion.offset}px`,'--card-fold':motion.fold,'--card-content':motion.content,'--card-clip':`${motion.fold*100}%`,'--card-blur':`${motion.fold*8}px`,'--card-scale':1-motion.fold*.12,'--content-offset':`${(1-motion.content)*16}px`} as CSSProperties;
 const visible=motion.opacity>.05;
 return <article className={`hologram-card card-${side}`} style={style} data-visible={visible} data-phase={motion.phase} data-mobile={motion.mobile} aria-hidden={!visible} inert={!visible}>
   <span className="card-scan" aria-hidden="true"/><div className="card-topline"><span>{card.label}</span><span className="card-bracket" aria-hidden="true">⌜</span></div>
   <h2>{card.title}</h2><p>{card.body}</p>
   {card.note && <div className="card-note">{card.note}</div>}
   {card.link && <a className="card-link" href={card.link.url} target="_blank" rel="noopener noreferrer">{card.link.label}<ArrowUpRight size={18}/></a>}
   <span className="card-corner" aria-hidden="true"/>
 </article>;
}
