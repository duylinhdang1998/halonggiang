'use client';
import {ArrowUpRight} from 'lucide-react';
import type {CSSProperties} from 'react';
import type {ProfileCardData} from '@/lib/profile-cards';
import {cardMotion} from '@/lib/scroll-state.mjs';

type Props={card:ProfileCardData;pair:number;side:'left'|'right';progress:number};
export default function HologramCard({card,pair,side,progress}:Props) {
 const motion=cardMotion(progress,pair,side);
 const style={'--card-opacity':motion.opacity,'--card-offset':`${motion.offset}px`} as CSSProperties;
 const visible=motion.opacity>.05;
 return <article className={`hologram-card card-${side}`} style={style} data-visible={visible} data-mobile={motion.mobile} aria-hidden={!visible} inert={!visible}>
   <div className="card-topline"><span>{card.label}</span><span className="card-bracket" aria-hidden="true">⌜</span></div>
   <h2>{card.title}</h2><p>{card.body}</p>
   {card.note && <div className="card-note">{card.note}</div>}
   {card.link && <a className="card-link" href={card.link.url} target="_blank" rel="noopener noreferrer">{card.link.label}<ArrowUpRight size={18}/></a>}
   <span className="card-corner" aria-hidden="true"/>
 </article>;
}
