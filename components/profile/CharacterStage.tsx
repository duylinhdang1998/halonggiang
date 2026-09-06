'use client';
import {useState} from 'react';
import Image from 'next/image';
import type {CSSProperties} from 'react';
import type {Anchors} from '@/lib/profile-anchors';
import {useIllustrationAnchors} from '@/hooks/use-illustration-anchors';

type Props={progress:number;reveal:number;onAnchors:(anchors:Anchors)=>void};
export default function CharacterStage({progress,reveal,onAnchors}:Props) {
 const frame=useIllustrationAnchors(progress,onAnchors);
 const [failed,setFailed]=useState(false);
 const style={'--reveal':`${reveal*100}%`} as CSSProperties;
 return <figure className="character-stage">
   <figcaption className="sr-only">Minh họa hoạt hình thầy Hà Long Giang. Cuộn để khám phá hồ sơ.</figcaption>
   <div className="orbital orbital-one" aria-hidden="true"/><div className="orbital orbital-two" aria-hidden="true"/>
   <div ref={frame} className="character-frame" style={style} data-artwork="approved-original">
     <div className="character-layer character-wire" aria-hidden="true"><Image unoptimized src="/giang-character.png" width={1419} height={1109} alt="" draggable={false}/></div>
     <div className="character-layer character-color"><Image unoptimized src="/giang-character.png" width={1419} height={1109} alt="Thầy Hà Long Giang trong phong cách hoạt hình, mặc áo polo trắng và cầm sổ xanh" draggable={false} fetchPriority="high" onError={()=>setFailed(true)}/></div>
     <div className="scan-line" data-visible={reveal>.01&&reveal<.99} aria-hidden="true"/>
   </div>
   {failed&&<output className="model-status">Không tải được ảnh. Vui lòng tải lại trang.</output>}
   <div className="ground-orbit" aria-hidden="true"/>
 </figure>;
}
